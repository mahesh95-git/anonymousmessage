import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please enter name"],
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "please enter valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  content: {
    type: [{
      message:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
      }
    },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isAcceptMessage: {
    type: Boolean,
    default: false,
  },
  isVerify:{
    type:Boolean,
    default:false
  },
  verificationCode: String,
  verificationExpiry: Date,
  forgotPasswordToken: String,
  forgotPasswordExp: Date,
});

const User = mongoose.models?.users || mongoose.model("users", userSchema);
export default User;
