import User from "@/models/user";
import { connect } from "@/mongodbConnection/connectDB";
import { sendApiRes } from "@/util/apiResponse/apiResponse";
import Message from "@/models/message";

export async function POST(request) {
  try {
    const { message, username } = await request.json();
    await connect();
    const user = await User.findOne({ username, isVerify: true });
    if (!user) {
      return sendApiRes({
        message: "user not found",
        statusCode: 404,
      });
    }
    if (!user.isAcceptMessage) {
      return sendApiRes({
        message: "user not accepting messages",
        statusCode: 403,
      });
    }

    const newMessage = await Message.create({
      userId: user._id,
      message,

    });

    user.content.push({message:newMessage._id});
    await user.save();
    return sendApiRes({
      message: "message sent successfully",
      statusCode: 201,
      success:true
    });
  } catch (error) {

    return sendApiRes({
      message: error.message,
      statusCode: 500,
    })
  }
}
