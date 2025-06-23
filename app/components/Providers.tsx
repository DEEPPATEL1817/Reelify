import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";


const urlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

export default function Providers({ children }: { children: ReactNode }) {

    //here re-fetchInterval is used to check use is authenticate or not in a fix interval through session

    return <SessionProvider refetchInterval={5 * 60}>
        <ImageKitProvider urlEndpoint= {urlEndPoint}>
            {children}
        </ImageKitProvider>
    </SessionProvider>
}