// app/api/videos/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "@/lib/dbConnection";
import Video from "@/models/Video";

export async function POST(req: NextRequest) {
  try {
    await connectToDataBase();
    const body = await req.json();

    const video = await Video.create(body);

    return NextResponse.json({ message: "Video saved", video }, { status: 201 });
  } catch (err) {
    console.error("Video save failed:", err);
    return NextResponse.json({ error: "Video save failed" }, { status: 500 });
  }
}
