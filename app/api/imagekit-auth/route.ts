
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    try {
        // Your application logic to authenticate the user
        // For example, you can check if the user is logged in or has the necessary permissions
        // If the user is not authenticated, you can return an error response
    
        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
            
        })
    
        return Response.json({ authenticationParameters, publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY });
        
    } catch (error) {
        return Response.json({ error: "Authentication Failed" } , {status: 500})
    }
}