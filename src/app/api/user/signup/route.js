import { NextResponse } from "next/server";
import User from "@/models/user";
import { sendEmail } from "@/util/sendEmail/sendEmail";
import bcrypt from "bcrypt";
import { connect } from "@/mongodbConnection/connectDB";
import { sendApiRes } from "@/util/apiResponse/apiResponse";
export async function POST(req) {
  await connect();
  try {
    const body = await req.json();
    const { username, password, email } = body;

    // Validate input data
    if (!username || !password || !email) {
      return sendApiRes(
        { message: "All fields are required" ,
         statusCode: 400 }
      );
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationExpiry = new Date(Date.now() + 20 * 60 * 1000);

    const user = await User.findOne({ username, email });

    if (user) {
      if (user.isVerify) {
        return sendApiRes(
          { message: "User already exists" ,
          statusCode: 400 }
        );
      } else {
        user.set({
          username,
          password: hashedPassword,
          email,
          verificationCode,
          verificationExpiry,
        });
        await user.save({
          runValidator:false
        });
      }
    } else {
      await User.create({
        username,
        password: hashedPassword,
        email,
        verificationCode,
        verificationExpiry,
      });
    }

    const isSend = await sendEmail({
      email,
      verificationCode,
      verificationExpiry,
    });

    if (isSend) {
      return sendApiRes(
        {
          message: `Email successfully sent to ${email}, please verify your email`,
          success: true,
        
         statusCode: 200 }
      );
    } else {
      return sendApiRes(
        { message: "Failed to send verification email", success: false ,
         statusCode: 500 }
      );
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    return sendApiRes(
      { message: "Something went wrong, please try again", success: false ,
       statusCode: 500 
      }
    );
  }
}
