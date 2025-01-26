
import { createUserMeta, getUserMeta, updateUserMeta } from "@/server/queries";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {userId} = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, messages: "Unauthorized" },
      { status: 401 }
    );
  }

  const { endpoint, keys } = await request.json();
  if (!endpoint || !keys) {
    return NextResponse.json(
      { success: false, messages: "Invalid request" },
      { status: 400 }
    );
  }

  const existingUserMeta = await getUserMeta(userId);

  console.log("existingUserMeta", existingUserMeta);

  try {
    if (existingUserMeta) {
      await updateUserMeta(userId, endpoint, keys.auth, keys.p256dh);
     
    } else {
      await createUserMeta(userId, endpoint, keys.auth, keys.p256dh); 
    
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { success: false, message: "Error creating/updating user meta" },
      { status: 500 }
    );
  }
}
