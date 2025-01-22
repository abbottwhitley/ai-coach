"use server"
import { db } from "@/server/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserThread } from "@/server/queries";


export async function GET(){
    console.log("GET /api/user-thread called!!");
    // const { userId } = await auth();
    const userId = "abbottjc"
    
    console.log(userId);
    
    if (!userId) {
        return NextResponse.json(
            { success: false, message: "unauthorized"},
            { status: 401}
        );
    }
    
    // TODO: Get user threads from data base
    const userThread = await getUserThread(); 
    // console.log("userThread from the user-thread endpoint:", userThread);
    // return NextResponse.json({ success: true, message: "My end point is working" });
    // const userThread = await db.UserThread.findUnique({
    //     where: {
    //         userId: user.id
    //     }
    // });
    
    // TODO: If it does exist, return it
    if (userThread){
        return NextResponse.json(
            { data: userThread, success: true },
            { status: 200}
        );
    }

    // try {

    //     // If it does not exist, create a new thread from openai
    //     const openai = new OpenAI();
    //     const thread = await openai.beta.threads.create()

    //     // Save the thread to the database
    //     const newUserThread = await db.UserThread.create({
    //         data: {
    //             userId: user.id,
    //             threadId: thread.id
    //         }
    //     });

    //     // Return the new thread
    //     return NextResponse.json(
    //         { data: newUserThread, success: true },
    //         { status: 200}
    //     );

    // } catch (error) {
    //     return NextResponse.json(
    //         { success: false, message: "Internal Server Error"},
    //         { status: 500}
    //     );
    // }
}