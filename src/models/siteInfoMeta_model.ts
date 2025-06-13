import mongoose from 'mongoose';

export interface ISiteInfoMeta {
  siteId: string;      
  lastVisit: Date;     
}

const schema = new mongoose.Schema<ISiteInfoMeta>({
  siteId:    { type: String, required: true, unique: true },
  lastVisit: { type: Date,   default: Date.now },
});

export default mongoose.model<ISiteInfoMeta>('siteInfoMeta', schema);
