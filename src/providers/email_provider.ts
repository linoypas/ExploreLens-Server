import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'valeriya312002@cs.colman.ac.il',
      pass: process.env.EMAIL_PASSWORD 
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const sendPasswordResetEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: 'valeriya312002@cs.colman.ac.il',
      to: email,
      subject: 'Password Reset Code - ExploreLens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You have requested to reset your password for your ExploreLens account.</p>
          <p>Your password reset code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The ExploreLens Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
