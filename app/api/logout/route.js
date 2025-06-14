import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });

  // Expire the cookie immediately
  res.cookies.set("token", "", {
    path: "/", // same path you originally used
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // expires now
  });

  return res;
}
