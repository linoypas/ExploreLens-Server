import mongoose from "mongoose";

export interface IChat {
  topic: string;
  userId: mongoose.Types.ObjectId;
  messages: mongoose.Types.ObjectId[];
  _id?: string;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    topic: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model<IChat>("Chat", chatSchema);
export default chatModel;
