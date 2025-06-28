// app/api/videos/[id]/route.ts
import { authOption } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "@/lib/dbConnection";
import Video from "@/models/Video";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDataBase();

    const video = await Video.findById(params.id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete from ImageKit
    if (video.fileId) {
      try {
        await imagekit.deleteFile(video.fileId);
      } catch (err) {
        console.error("ImageKit error:", err);
        return NextResponse.json({ error: "Failed to delete from ImageKit" }, { status: 500 });
      }
    }

    // Delete from DB
    await Video.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
