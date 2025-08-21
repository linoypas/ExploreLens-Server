import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendPasswordResetEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    const msg = {
      to: email,
      from: {
        email: 'valeriya312002@cs.colman.ac.il',
        name: 'ExploreLens Team'
      },
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

    await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid');
    return true;
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    return false;
  }
};