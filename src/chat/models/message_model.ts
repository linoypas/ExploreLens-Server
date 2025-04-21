import mongoose from "mongoose";

export interface IMessage {
  data: string;
  sender: "user" | "system";
  createdAt?: Date;
  _id?: mongoose.Types.ObjectId;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    data: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "system"],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const messageModel = mongoose.model<IMessage>("Message", messageSchema);
export default messageModel;
