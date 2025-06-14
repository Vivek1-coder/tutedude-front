const apiUrl = "http://localhost:4000";
import { NextResponse } from "next/server";

import axios from "axios";
export async function POST(request) {
  const body = await request.json();
  const { query } = body;
  console.log("receiverd query is : ", query);

  const token = request.cookies.get("token")?.value;
  console.log(query);
  const res = await axios.post(
    `${apiUrl}/diagnosis/explain`,
    {
      query,
    },
    { headers: { cookie: token } }
  );
  console.log(res);
  return NextResponse.json(res.data, {
    status: res.status,
  });

  // console.log("hello");
  return res;
  return NextResponse.json({ message: "hello" });
}
