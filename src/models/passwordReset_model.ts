import mongoose from "mongoose";

export interface IPasswordReset {
  email: string;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  _id?: string;
}

const passwordResetSchema = new mongoose.Schema<IPasswordReset>({
  email: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } 
  },
  isUsed: {
    type: Boolean,
    default: false
  }
});

const passwordResetModel = mongoose.model<IPasswordReset>("PasswordReset", passwordResetSchema);

export default passwordResetModel;
