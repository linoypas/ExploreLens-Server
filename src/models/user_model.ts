import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  _id?: string;
  refreshToken?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true
  }, 
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }, 
  profilePicture: {
    type: String,
    required: false,
  },   
  refreshToken: {
    type: [String],
    default: [],
  }
  
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;