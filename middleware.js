// middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// adjust to your cookie name
const AUTH_COOKIE = "token";

export function middleware(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  // console.log("hello", token);
  // if no token and user tries to hit /u
  if (!token && request.nextUrl.pathname.startsWith("/u")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  //if token verify it :
  // if logged in and lands on login or signup, redirect to dashboard
  if (token && /^\/(login|signup)/.test(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/u", request.url));
  }
  return NextResponse.next();
}

// apply to all paths
export const config = { matcher: ["/u/:path*", "/login", "/signup"] };
