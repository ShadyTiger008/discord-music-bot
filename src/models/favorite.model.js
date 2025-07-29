import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
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
    priority: {
      type: Number,
      default: 0
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
