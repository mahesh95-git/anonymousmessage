import mongoose from "mongoose";
const messageSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Message =
  mongoose.models.messages || mongoose.model("messages", messageSchema);
export default Message;
