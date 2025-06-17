import mongoose from "mongoose";

export interface IUserStatistics {
  userId: string;
  percentageVisited: string;
  countryCount: number;    
  countries: string[]; 
  siteCount: number;       
  createdAt?: Date;
  _id?: string;
}

const userStatisticsSchema = new mongoose.Schema<IUserStatistics>(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    percentageVisited: {
      type: String,
      required: true
    },
    countryCount: {
      type: Number,
      required: true
    },
    countries: {
      type: [String],
      required: true
    },
    siteCount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const userStatisticsModel = mongoose.model<IUserStatistics>(
  "UserStatistics",
  userStatisticsSchema
);

export default userStatisticsModel;
