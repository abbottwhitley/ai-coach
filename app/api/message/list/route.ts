
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const {threadId} = await req.json();

  if(!threadId) {
    return NextResponse.json(   
        {error: "Thread ID is required", success: false},
        {status: 400}
    );
  }

  const openai = new OpenAI();

    try {
        const response = await openai.beta.threads.messages.list(threadId);
        console.log("POST response from openai, response.data: ", response.data);
        return NextResponse.json({success: true, messages: response.data}, {status: 200});
    } catch (error) {
        return NextResponse.json(
            {error: "Something went wrong", success: false},
            {status: 500}
        );
    };
}