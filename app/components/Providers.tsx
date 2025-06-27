'use client'
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { NotificationProvider } from "./Notification";


const urlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

export default function Providers({ children }: { children: ReactNode }) {

    //here re-fetchInterval is used to check use is authenticate or not in a fix interval through session

    return <SessionProvider refetchInterval={5 * 60}>
        <NotificationProvider>
        <ImageKitProvider urlEndpoint= {urlEndPoint}>
            {children}
        </ImageKitProvider>
        </NotificationProvider>
    </SessionProvider>
}