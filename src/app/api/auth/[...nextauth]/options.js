import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connect } from "@/mongodbConnection/connectDB";
import User from "@/models/user";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await connect();

        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.username },
              { username: credentials.username },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerify) {
            throw new Error("Please verify your account before logging in");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerify;
        token.isAcceptingMessages = user.isAcceptMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
       
        session.user = {
          id: token._id,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
          username: token.username,
        };
      }
     
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
