import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IComment {
  _id: string;              
  owner: string;
  content: string;
  date: Date;
  siteId: string;
}

const commentSchema = new Schema<IComment>(
    {
      owner: { type: String, required: true },
      content: { type: String, required: true },
      date: { type: Date, default: Date.now },
      siteId: { type: String, required: true },
    },
  );

const commentModel = mongoose.model<IComment>("Comment",commentSchema);
export default commentModel;