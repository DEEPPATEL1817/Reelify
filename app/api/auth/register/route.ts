import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "@/lib/dbConnection";
import User from "@/models/User";

export async function POST(request: NextRequest){

    try {
       const {email, password} = await request.json()

       if (!email || !password) {
        return NextResponse.json(
            {error: "Email and password are req."},
            {status: 400}
        )
       }

       await connectToDataBase()

       const existingUser = await User.findOne({email})

       if (existingUser) {
        return NextResponse.json(
            {error: "User is already registered"},
            {status: 400}
        )
       }

       await User.create({
        email,
        password
       })

       return NextResponse.json(
        {message: "User registered successfully"},
        {status: 201}
       )

    } catch (error) {
        console.log("registrateion error", error)
      return NextResponse.json(
        {error: "Failed to register User"},
        {status: 500}
      )
    }
}