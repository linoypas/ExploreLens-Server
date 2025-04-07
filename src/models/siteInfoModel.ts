import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface ISiteInfo {
    siteId: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
}

const siteInfo = new Schema<ISiteInfo>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const siteInfoModel = mongoose.model<ISiteInfo>("siteInfo",siteInfo);
export default siteInfoModel;