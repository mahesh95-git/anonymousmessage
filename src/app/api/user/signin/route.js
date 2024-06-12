import { NextResponse,NextRequest } from "next/server";

import { connect } from "@/mongodbConnection/connectDB";
import User from "@/models/user";

export async function GET(res){
const newUser=await User.create({
  username:"test",
  password:"test",
  email:"mahesh@gmail.com"
})
console.log(newUser)
  await connect()

    return NextResponse.json({message:"hello"})

}