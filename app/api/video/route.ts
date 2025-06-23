import { authOption } from "@/lib/authOption";
import { connectToDataBase } from "@/lib/dbConnection";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDataBase();

       const videos = await Video.find({}).sort({createdAt: -1}).lean()

       if (!videos || videos.length === 0) {
        return NextResponse.json([], {status: 200})
       }

       return NextResponse.json(videos)

    } catch (error) {
        return NextResponse.json({error: "Fail to fetch Videos"} , {status: 500})
    }
}

export async function POST(request: NextRequest){
    try {
        // to authenticate the user ..is he is login or not ..here we have getServerSession form next to check user

        const session = await getServerSession(authOption);

        if (!session) {
            return NextResponse.json({error: "Unauthorized"} , {status: 401})
        }

        await connectToDataBase()

        const body: IVideo = await request.json()

        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {

            return NextResponse.json({error: "Missing req. fields"} , {status: 401})
        }

        const VideoData = {
            ...body, 
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? true
            }
        }

        const newVideo = await Video.create(VideoData);

        return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json({error: "Failed to create Video"} , {status: 50})
    }
}