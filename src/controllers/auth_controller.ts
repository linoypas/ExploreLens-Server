import { NextFunction, Request, Response } from 'express';
import UserModel, { IUser } from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client();

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
                    _id: user._id
                });
        }
   } catch (err) {
       res.status(400).send(err);
   }
}

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { profilePicture, email, username, password } = req.body;

    if (!email || !username || !password) {
        const message =  'Missing required fields';
        console.log(`error: ${message}`)
        res.status(400).json({ message: message });
        return;
    }

    const user = await UserModel.findOne({ username: username });
    if (user) {
        const message = 'User already exists';
        console.log(`error: ${message}`)
        res.status(409).json({ message: message });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      email,
      username,
      password: hashedPassword,
      profilePicture
    });

    res.status(200).json(newUser); 
  } catch (err) {
    const message = 'Error during registration';
    console.error(`error: ${message}`)
    res.status(500).json({ message: message });
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
        const user = await UserModel.findOne({ username: req.body.username });
        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate token
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

    } catch (err) {
        res.status(400).send(err);
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
                if (!user) {
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
        const user = await verifyRefreshToken(req.body.refreshToken);
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
    googleSignin
};