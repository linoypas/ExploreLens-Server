import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IGoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}
export interface IReview {
  _id: string;              
  userId: string;
  content: string;
  date: Date;
  siteId: string;
}

const reviewSchema = new Schema<IReview>(
    {
      userId: { type: String, required: true },
      content: { type: String, required: true },
      date: { type: Date, default: Date.now },
      siteId: { type: String, required: true },
    },
  );

const reviewModel = mongoose.model<IReview>("review",reviewSchema);
export default reviewModel;