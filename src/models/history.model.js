import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Track",
      required: true
    },
    playedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
export default History;
