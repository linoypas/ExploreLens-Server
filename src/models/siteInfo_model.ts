import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}
export interface ISiteInfo {
    _id: string;
    name: string;
    description: string;
    ratings: { userId: string; value: number }[];
    averageRating: number;
    comments: string[];
    imageUrl: string;
    googleReviews: IReview[];
}


const siteInfo = new Schema<ISiteInfo>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      value: { type: Number, required: true }
    }
  ],
  averageRating: { type: Number, default: 0 },
  comments: [{ type: String }],
  imageUrl: {type: String},
  googleReviews: [
    {
      author_name: { type: String, required: true },
      rating: { type: Number, required: true },
      text: { type: String, required: true },
      time: { type: Number, required: true },
      relative_time_description: { type: String, required: true }
    }
  ]
});

const siteInfoModel = mongoose.model<ISiteInfo>("siteInfo",siteInfo);
export default siteInfoModel;