import { connect } from "@/mongodbConnection/connectDB";
import { sendApiRes } from "@/util/apiResponse/apiResponse";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import User from "@/models/user";
export async function POST(request) {
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return sendApiRes({
        message: "Unauthorized",
        statusCode: 401,
      });
    }
    await connect();
    console.log(session);
    const userId = session.user.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return sendApiRes({
        message: "user not found",
        statusCode: 400,
      });
    }

    if (!user.isVerify) {
      return sendApiRes({
        message: "user not verified",
        statusCode: 400,
      });
    }
    const { isAcceptMessage } = await request.json();
    console.log(isAcceptMessage);
    user.isAcceptMessage = isAcceptMessage;
    const updateUser = await user.save({
      new: true,
    });
    return sendApiRes({
      message: "updated successfully",
      statusCode: 201,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return sendApiRes({
        message: "Unauthorized",
        statusCode: 401,
      });
    }
    await connect();
    console.log(session);
    const userId = session.user.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return sendApiRes({
        message: "user not found",
        statusCode: 400,
      });
    }

    if (!user.isVerify) {
      return sendApiRes({
        message: "user not verified",
        statusCode: 400,
      });
    }

    return sendApiRes({
      data: userAcceptMessage,
      statusCode: 201,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return sendApiRes({
      message: "Internal Server Error",
      statusCode: 500,
    });
  }
}
