import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse } from "next/server";


export async function GET() {
    try {
        // Your application logic to authenticate the user
        // For example, you can check if the user is logged in or has the necessary permissions
        // If the user is not authenticated, you can return an error response
    
        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
   
        })
    
        console.log("PRIVATE_KEY:", process.env.IMAGEKIT_PRIVATE_KEY);
        console.log("PUBLIC_KEY:", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);

        return NextResponse.json({ ...authenticationParameters, publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY });
        
    } catch (error) {
        console.log("uploading vid may have issue",error);
        console.error("Auth error:", error);
        return NextResponse.json({ error: "Authentication Failed" } , {status: 500})
    }
}