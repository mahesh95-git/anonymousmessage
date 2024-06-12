import { connect } from "@/mongodbConnection/connectDB";
import User from "@/models/user";
import { sendApiRes } from "@/util/apiResponse/apiResponse";
import { usernameSchema } from "@/schema/signUpSchema";
export async function POST(req) {
  try {
    const body = await req.json();
    const { username } = body;
    const verifyUsername = usernameSchema.safeParse(username);
    if (!verifyUsername.success) {
      const usernameError = verifyUsername.error.errors[0].message;
      return sendApiRes({
        message: usernameError,
        statusCode: 400,
        success: false,
      });
    }
    await connect();
    const user = await User.findOne({ username });
    if (user && user.isVerify) {
      return sendApiRes({
        message: "username already taken",
        statusCode: 400,
        success: false,
      });
    }
    return sendApiRes({
      message: "username available",
      statusCode: 201,
      success: true,
    });
  } catch (error) {
    return sendApiRes({
      message: error.message,
      statusCode: 500,
      success: false,
    });
  }
}
