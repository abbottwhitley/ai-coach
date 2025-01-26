import { updateUserPromptPreferences } from "@/server/queries";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("GET /challenge-preferences called")
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await request.json();

  console.log(response);

  const { user, challengeId, sendNotifications } = response;

  if (!userId || !challengeId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const updatedChallengePreferences = updateUserPromptPreferences(userId, challengeId, sendNotifications)

    return NextResponse.json({
      success: true,
      data: updatedChallengePreferences,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong updating data base table" },
      { status: 500 }
    );
  }
}
