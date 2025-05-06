import mongoose from "mongoose";

export interface ISiteInfoHistory {
  siteInfoId: string;  
  geohash: string;    
  longitude: string;                           
  latitude: string;           
  userId: string;            
  createdAt?: Date;          
  _id?: string;              
}

const siteInfoHistorySchema = new mongoose.Schema<ISiteInfoHistory>({
  siteInfoId: {
    type: String,
    required: true
  },
  geohash: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const siteInfoHistoryModel = mongoose.model<ISiteInfoHistory>("SiteInfoHistory", siteInfoHistorySchema);

export default siteInfoHistoryModel;
