import { NextDataPathnameNormalizer } from "next/dist/server/future/normalizers/request/next-data";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request){
    const {message, threadId, fromUser = false} = await req.json();

    console.log("from user", {threadId});

    if (!threadId || !message) {
        return NextResponse.json(
            { 
                error: "threadId and message are required", 
                success: false 
            },
            { 
                status: 400 
            }
        );
    }

    const openai = new OpenAI();
    try{
        const threadMessage = await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message,
            metadata: {
                fromUser,
            }
        });

        console.log("from openai", threadMessage);
        
        return NextResponse.json(
            {  
                success: true,
                message: threadMessage 
            },
            {
                status: 201
            }    
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to create message"
            },
            { 
                status: 500 
            }
        );
    }
    
}
    