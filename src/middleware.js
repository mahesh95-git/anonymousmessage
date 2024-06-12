
import { NextResponse } from "next/server";
export { default } from "next-auth/middleware"
export async function middleware(request) {
  NextResponse.next();
}
export const config = {
  matcher: ["/signin", "/signup", "/"],
};
