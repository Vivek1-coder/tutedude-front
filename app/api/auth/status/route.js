import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.cookies.get("token")?.value;
  return NextResponse.json({ isLoggedIn: !!token });
}
