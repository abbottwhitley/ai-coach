import { NextResponse } from "next/server";
import { UserThread } from '@/server/db/schemas';
import { getAssistants} from "@/server/queries";

export async function GET(){

    // my assistant id: asst_HAvQYpjSCjj2DsCYEb1ovSex
    const assistant = await getAssistants();

    if (!assistant) return NextResponse.json(
        {
            success: false,
            message: "No assistants found"
        },
        {
            status: 500,
        }
    )

    // if (assistant.length === 0 || !assistant) {
    //     return NextResponse.json(
    //         {
    //             error: "No assistants found",
    //             success: false
    //         },
    //         {
    //             status: 500,
    //         }
    //     )
    // }

    return NextResponse.json(
        {
            success: true,
            assistant: assistant
        },
        {
            status: 200,
        }
    )
}