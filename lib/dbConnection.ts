import mongoose from "mongoose";
import { Anonymous_Pro } from "next/font/google";

const MONGODB_URI  = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error("Please define mongodb uri")
}

//here we got config from types.db.ts file
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {conn: null , promise: null}
}

export async function connectToDataBase(){
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const options = {
            dbName: "Reels",
            maxPoolSize: 8
        };

        // cached.promise = (async () => {
        //     await mongoose.connect(MONGODB_URI , options);
        //     return mongoose.connection
        // })()

        //or
        cached.promise = mongoose.connect(MONGODB_URI, options).then(() => mongoose.connection)

    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        console.log("mongodb connection", error)
        cached.promise = null
        throw new Error("Check Db file ")
    }

    return cached.conn

}

//another way to connect with db 

// db.ts
// let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

// export async function connectToDataBase() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const options = { bufferCommands: true,           maxPoolSize: 8 };
//     cached.promise = mongoose.connect(MONGODB_URI, options).then(() => mongoose.connection);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }
