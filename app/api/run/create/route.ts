import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest){

    const {threadId, assistantId} = await req.json();

    if (!threadId || !assistantId) {
        return NextResponse.json(
            {
                error: "Thread ID and assistant ID are required", 
                success: false
            },
            {
                status: 400
            }
        )
    };

    const openai = new OpenAI();

    try{
        const run = await openai.beta.threads.runs.create(threadId, {assistant_id: assistantId});   
        console.log("from openai run", run);
        
        return NextResponse.json(
            {
                success: true,
                run
            }, 
            {
                status: 200
            }
        );

    } catch (error) {
        console.error(error);
        return  NextResponse.json(
            {
                success: false,
                error: "Something went wrong"
            },
            {
                status: 500
            }
        );
    }
}
