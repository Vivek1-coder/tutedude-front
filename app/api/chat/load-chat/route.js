const apiUrl = "http://localhost:4000";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const token = request.cookies.get("token")?.value;
  // console.log(request);
  const { id } = await request.json();
  console.log(id);
  const res = await axios.post(
    `${apiUrl}/chats/loadChat`,
    { id },
    {
      headers: { cookie: token },
    }
  );
  return NextResponse.json(res.data, {
    status: res.status,
  });
  console.log(res);
}
