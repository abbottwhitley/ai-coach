import ProfileContainer from "@/components/ProfileContainer";
import { addUserPromptPreferences, getUserPromptPreferences } from "@/server/queries";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default async function ProfilePage() {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("No user");
    }

    let userPromptPreferences = await getUserPromptPreferences(userId);

    if (!userPromptPreferences) {
        userPromptPreferences = await addUserPromptPreferences(userId, "EASY", true);

    }
 
    return (
        <div className="max-w-screen-lg m-10 lg:mx-auto">
            <ProfileContainer userPromptPreferences={userPromptPreferences} />
        </div>
    );
}

