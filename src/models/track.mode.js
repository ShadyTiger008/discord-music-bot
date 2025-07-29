import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    duration: Number, // in seconds
    artist: String,
    source: String, // YouTube, Spotify, etc.
    thumbnail: String
  },
  { timestamps: true }
);

const Track = mongoose.model("Track", trackSchema);
export default Track;
