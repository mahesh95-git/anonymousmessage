import { connect } from "@/mongodbConnection/connectDB";
import User from "@/models/user";
import { emailSchema } from "@/schema/signUpSchema";
import { verifyCodeSchema } from "@/schema/verifySchema";
import { sendApiRes } from "@/util/apiResponse/apiResponse";
export async function POST(req) {
  try {
  
    const body = await req.json();
    const { username, verifyCode } = body;
    const verifyCodeValid = verifyCodeSchema.safeParse(verifyCode.toString());
    if (!verifyCodeValid.success) {
      const codeError = verifyCodeValid.error.errors[0].message;
      return sendApiRes(codeError, 400, false);
    }
    await connect();
    const user = await User.findOne({ username });
    if (!user) {
      return sendApiRes({ message: "user not found", statusCode: 400, success: false});
    }

    if (user.isVerify) {
      return sendApiRes({ message: "user already verified", statusCode: 400, success: false});
    }

    if (user.verificationCode !== verifyCode.toString()) {
      return sendApiRes({message:"invalid verification code", statusCode: 400, success: false});
    }

    if (user.verificationExpiry < new Date()) {
      return sendApiRes({ message: "verification code expired", statusCode: 400, success: false});
    }

    user.isVerify = true;
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;
    await user.save();

    return sendApiRes({ message: "email verification successfully ", statusCode: 201,  success: true});
  } catch (error){
    return sendApiRes({ message: error.message, statusCode: 500, success: false});
  }
}
