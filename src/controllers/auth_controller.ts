import { NextFunction, Request, Response } from 'express';
import UserModel, { IUser } from '../models/user_model';
import PasswordResetModel from '../models/passwordReset_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { sendPasswordResetEmail } from '../providers/email_provider';


const client = new OAuth2Client();

const generateResetCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const checkUsernameInDb = async(username: string) => {
    const user = await UserModel.findOne({ username });
    return user !== null;
}

const generateUsernameWithSuffix = async(baseUsername: string) => {
    if(await checkUsernameInDb(baseUsername)){
        let suffix = 1;
        let newUsername = `${baseUsername}${suffix}`;
        
        while (await checkUsernameInDb(newUsername)) {
          suffix += 1;
          newUsername = `${baseUsername}${suffix}`;
        }
        return newUsername;
    } else{
        return baseUsername; 
    }
  }


const googleSignin = async (req: Request, res: Response): Promise<void> => {
   const credential = req.body.credential;
   try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email
        const image = payload?.picture

        if(email != null){
            let user = await UserModel.findOne({'email': email});
            if (user == null) {
                let username = (payload?.given_name + "_" +  payload?.family_name).toLowerCase();
                const uniqueUsername = await generateUsernameWithSuffix(username);

                user = await UserModel.create(
                    {
                        'email': email,
                        'profilePicture': image,
                        'username': uniqueUsername,
                        'password': '*'
                });
            }
            const tokens = generateToken(user._id);
            if (!tokens) {
                res.status(500).send('Server Error');
                return;
            }
            if (!user.refreshToken) {
                user.refreshToken = [];
            }
            user.refreshToken.push(tokens.refreshToken);
            await user.save();
            res.status(200).send(
                {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    _id: user._id,
                    isSignedWithGoogle: true
                });
        }
   } catch (err) {
       res.status(400).send(err);
   }
}

const register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { profilePicture, email, name, password } = req.body;
  
      if (!email || !name || !password) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }
  
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        res.status(409).json({ message: 'Email already in use' });
        return;
      }
  
      const uniqueUsername = await generateUsernameWithSuffix(name);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await UserModel.create({
        email,
        username: uniqueUsername,
        password: hashedPassword,
        profilePicture,
      });
  
      const tokens = generateToken(newUser._id);
      if (!tokens) {
        res.status(500).json({ message: 'Token generation failed' });
        return;
      }
  
      newUser.refreshToken = newUser.refreshToken || [];
      newUser.refreshToken.push(tokens.refreshToken);
      await newUser.save();
  
      res.status(200).json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        _id: newUser._id,
        isSignedWithGoogle: false
      });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ message: 'Error during registration' });
    }
  };

type tTokens = {
    accessToken: string,
    refreshToken: string
}

const generateToken = (userId: string): tTokens | null => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    // generate token
    const random = Math.random().toString();
    const accessToken = jwt.sign({
        _id: userId,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES });

    const refreshToken = jwt.sign({
        _id: userId,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};

const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(400).send('Wrong email or password');
        return;
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(400).send('Wrong email or password');
        return;
      }
  
      const tokens = generateToken(user._id);
      if (!tokens) {
        res.status(500).send('Server Error');
        return;
      }
  
      user.refreshToken = user.refreshToken || [];
      user.refreshToken.push(tokens.refreshToken);
      await user.save();
  
      res.status(200).send({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        _id: user._id,
        isSignedWithGoogle: false
      });
    } catch (err) {
      res.status(400).send(err);
    }
  };

const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const resetCode = generateResetCode();
        
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        await PasswordResetModel.create({
            email,
            code: resetCode,
            expiresAt,
            isUsed: false
        });

        const emailSent = await sendPasswordResetEmail(email, resetCode);
        
        if (!emailSent) {
            res.status(500).json({ message: 'Failed to send reset email' });
            return;
        }

        res.status(200).json({ message: 'Password reset code sent to your email' });
    } catch (error) {
        console.error('Error generating password reset code:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
  
const resetPassword = async (req: Request, res: Response) => {
    const { email, code, newPassword } = req.body;
    try {
        if (!email || !code || !newPassword) {
            res.status(400).json({ message: 'Missing required fields: email, code, newPassword' });
            return;
        }

        const resetRecord = await PasswordResetModel.findOne({
            email,
            code,
            isUsed: false,
            expiresAt: { $gt: new Date() } 
        });

        if (!resetRecord) {
            res.status(400).json({ message: 'Invalid or expired reset code' });
            return;
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        await PasswordResetModel.findByIdAndUpdate(resetRecord._id, { isUsed: true });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Reset error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

type tUser = Document<unknown, {}, IUser> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}

const verifyRefreshToken = async (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {
        if (!refreshToken) {
            reject("fail");
            return;
        }

        const tokenSecret = process.env.TOKEN_SECRET;
        if (!tokenSecret) {
            reject("fail");
            return;
        }

        jwt.verify(refreshToken, tokenSecret, async (err: any, payload: any) => {
            if (err) {
                reject("fail");
                return;
            }

            const userId = payload._id;

            try {
                const user = await UserModel.findById(userId);
                if (!user || !user.refreshToken?.includes(refreshToken)) {
                    reject("fail");
                    return;
                }

                user.refreshToken = user.refreshToken || [];
                user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);

                const newTokens = generateToken(user._id);
                if (!newTokens || !newTokens.refreshToken) {
                    reject("Server Error");
                    return;
                }

                user.refreshToken.push(newTokens.refreshToken);
                await user.save();

                resolve(user);
            } catch (err) {
                reject("fail");
            }
        });
    });
};



const logout = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.body.refreshToken;
      const user = await verifyRefreshToken(refreshToken);
  
      user.refreshToken = user.refreshToken?.filter(t => t !== refreshToken);
      await user.save();
  
      res.status(200).send("success");
    } catch (err) {
      res.status(400).send("fail");
    }
  };
  

const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });
        //send new token
    } catch (err) {
        res.status(400).send("fail");
    }
};

//Change password for logged user
const changePassword = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).send({ message: 'Missing currentPassword or newPassword' });
    return;
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).send({ message: 'Current password is incorrect' });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).send({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).send({ message: 'Server error' });
  }
};


type Payload = {
    _id: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    });
};

export default {
    register,
    login,
    refresh,
    logout,
    googleSignin,
    forgotPassword,
    resetPassword,
    changePassword,
};