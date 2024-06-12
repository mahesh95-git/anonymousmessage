import User from "@/models/user";
import { connect } from "@/mongodbConnection/connectDB";
import { sendApiRes } from "@/util/apiResponse/apiResponse";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import Message from "@/models/message";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return sendApiRes({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  await connect();
  try {
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const messages = await User.aggregate([
      {
        $match: {
          _id: userId,
        },
      },

      {
        $unwind: "$content",
      },

      {
        $lookup: {
          from: "messages",
          localField: "content.message",
          foreignField: "_id",
          as: "messages",
        },
      },
      {
        $project: {
          _id: 1,
          messages: 1,
          created: 1,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: null,
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!messages) {
      return sendApiRes({
        message: "user not found",
        statusCode: 400,
      });
    }

    return sendApiRes({
      data: messages[0],
      success: true,
    });
  } catch (error) {
    return sendApiRes({
      message: error.message,
      statusCode: 500,
    });
  }
}
export async function DELETE(request) {
  const url = new URL(request.url);
  const messageId = url.searchParams.get("messageId");

  if (!messageId) {
    return sendApiRes({
      message: "Message ID is required",
      statusCode: 400,
    });
  }

  // Get session
  const session = await getServerSession(authOptions);
  if (!session) {
    return sendApiRes({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  await connect();

  try {
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const updateResult = await User.updateOne(
      {
        _id: userId,
      },
      {
        $pull: {
          content: {
            message: messageId,
          },
        },
      }
    );

    if (updateResult.nModified === 0) {
      return sendApiRes({
        message: "Message not found in user content",
        statusCode: 404,
      });
    }

    const deleteResult = await Message.deleteOne({ _id: messageId });

    if (deleteResult.deletedCount === 0) {
      return sendApiRes({
        message: "Message not found",
        statusCode: 404,
      });
    }

    return sendApiRes({
      message: "Message deleted successfully",
      statusCode: 200,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return sendApiRes({
      message: error.message,
      statusCode: 500,
    });
  }
}
