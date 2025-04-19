import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface IComment {
  user: string;
  content: string;
  date: Date;
}
export interface ISiteInfo {
    _id: string;
    name: string;
    description: string;
    averageRating: number;
    ratingCount: number;
    totalRating: number;
    comments: IComment[];
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const siteInfo = new Schema<ISiteInfo>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  comments: [commentSchema]
});

const siteInfoModel = mongoose.model<ISiteInfo>("siteInfo",siteInfo);
export default siteInfoModel;