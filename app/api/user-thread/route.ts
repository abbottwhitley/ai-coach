import { db } from "@/server/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserThread, addUserThread } from "@/server/queries";


export async function GET(){
    
    console.log("GET /api/user-thread called!!")
    const { userId } = await auth()
  
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    
    // Get user threads from data base
    const userThread = await getUserThread(userId); 
    
    if (userThread) {
        return NextResponse.json({ success: true, userThread }, { status: 200 })
    }

    // Else create a new thread
    try {

        // If it does not exist, create a new thread from openai
        const openai = new OpenAI();
        const threadId = await openai.beta.threads.create()

        const newUserThread = await addUserThread(userId, threadId.id);
        console.log("New user thread created:", newUserThread);

  
        // Return the new thread
        return NextResponse.json({ success: true, userThread }, { status: 200 })

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error"},
            { status: 500}
        );
    }
}