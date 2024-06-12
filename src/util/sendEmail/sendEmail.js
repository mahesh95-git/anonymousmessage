import { Resend } from "resend";
import MysteryMgVerifyEmail from "@/components/verification";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ email, verificationCode, validTime }) {
  
  try {
    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification email",
      react: (
        <MysteryMgVerifyEmail
          verificationCode={verificationCode}
          validTime={validTime}
        />
      ),
    });

    if (response?.data) {
      return true;
    }
    if (response.error) {
      return false;
    }
  } catch (error) {
    console.log(error)
    return false;
  }
}
