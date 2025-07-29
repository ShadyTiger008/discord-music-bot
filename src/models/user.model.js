import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true
    },
    discordUserName: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
