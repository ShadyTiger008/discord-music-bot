import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: [
        "PLAY",
        "PAUSE",
        "RESUME",
        "SKIP",
        "STOP",
        "JOIN_VC",
        "LEAVE_VC",
        "QUEUE_ADD",
        "ERROR"
      ],
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to your User schema
      default: null
    },

    guildId: {
      type: String, // Discord Guild ID
      required: true
    },

    channelId: {
      type: String, // Voice Channel ID
      default: null
    },

    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Track", // Reference to your Track schema
      default: null
    },

    message: {
      type: String, // Extra details like errors, command info
      default: ""
    },

    metadata: {
      type: Object, // Optional for flexible additional data
      default: {}
    },

    status: {
      type: String,
      enum: ["SUCCESS", "ERROR"],
      required: true
    },

    responseMessage: {
      type: String, // What the bot replied
      default: ""
    },

    errorDetails: {
      type: String, // Error message if failed
      default: ""
    }
  },
  { timestamps: true } // createdAt = event time
);

const Log = mongoose.model("Log", logSchema);
export default Log;
