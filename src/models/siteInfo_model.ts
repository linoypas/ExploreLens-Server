import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface ISiteInfo {
    _id: string;
    name: string;
    description: string;
    averageRating: number;
    ratingCount: number;
    comments: string[];
}

const siteInfo = new Schema<ISiteInfo>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  comments: [{ type: String }]
});

const siteInfoModel = mongoose.model<ISiteInfo>("siteInfo",siteInfo);
export default siteInfoModel;