import mongoose from "mongoose";
const Schema = mongoose.Schema;


export interface ISiteInfo {
    _id: string;
    name: string;
    description: string;
    ratings: { userId: string; value: number }[];
    averageRating: number;
    reviewsIds: string[];
    imageUrl: string;
}


const siteInfo = new Schema<ISiteInfo>({
  name: { type: String, required: true },
  description: { type: String},
  ratings: [
    {
      userId: { type: String, required: true },
      value: { type: Number, required: true }
    }
  ],
  averageRating: { type: Number, default: 0 },
  reviewsIds: [{ type: String }],
  imageUrl: {type: String},
});

const siteInfoModel = mongoose.model<ISiteInfo>("siteInfo",siteInfo);
export default siteInfoModel;