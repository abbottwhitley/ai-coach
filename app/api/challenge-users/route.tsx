import axios from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { getUserThreadMany, getUserMetaMany, getUserPromptPreferencesMany } from "@/server/queries";
import { UserMeta, UserThread } from "@/server/db/schemas";

interface UserThreadMap {
  [userId: string]: UserThread;
}

interface UserMetaMap {
  [userId: string]: UserMeta;
}

export async function POST(request: Request) {
  // Validation
  const body = await request.json();

  const { challengeId, secret } = body;

  if (!challengeId || !secret) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      {
        status: 400,
      }
    );
  }

  console.log("Challenge ID: ", challengeId);
  console.log("secret: ", secret);
  console.log("process.env.APP_SECRET_KEY: ", process.env.APP_SECRET_KEY);
  if (secret !== process.env.APP_SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  // Define work out message prompt
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
        Generate a message to the user. The message should prompt the user to pause and take time to complete some mindulness exercises.  
        
        Below are a few mindfulness practices that may be be referenced. Feel free to add or remove practices as you see fit.

        1. The Dichotomy of Control: Focus on what you can control and let go of what you cannot. This practice involves recognizing the difference between internal and external events and redirecting your energy towards your own actions and responses.

        2. Morning and Evening Reflections: Start your day by setting intentions and reviewing your goals. In the evening, reflect on your actions and thoughts throughout the day. This practice helps you stay mindful of your behavior and make adjustments as needed.

        3. Negative Visualization (Premeditatio Malorum): Spend a few moments imagining potential challenges or difficulties you might face. This practice helps you prepare mentally for adversity and strengthens your ability to remain calm and composed when challenges arise.

        4. Mindful Awareness of Virtues: Regularly contemplate virtues such as wisdom, courage, justice, and temperance. Reflect on how you can embody these virtues in your daily life and interactions with others.

        5. Journaling: Keep a journal to record your thoughts, experiences, and reflections. Writing helps clarify your mind, process emotions, and reinforce Stoic principles.

        6. Voluntary Discomfort: Occasionally engage in activities that are mildly uncomfortable or challenging. This practice builds resilience and helps you appreciate what you have.

        7. Mindful Acceptance (Amor Fati): Embrace the concept of "love of fate." Practice accepting whatever happens, good or bad, as part of your life's journey. This mindset fosters a sense of peace and acceptance.

        The general outline of the message to the user should include a greeting, a suggested mindfulness practice, and a closing prompt that would encourage the user to engage in a discussion about the suggested practice. Here is an example output that should be followed. This one focuses on self reflection:

        **Mindfulness Exercise Reminder**

        Hello! It seems you might need a moment of calm amidst the daily hustle. Let's take some time for self reflection. 

        Present Moment Reflection: 
        Ask yourself - are you truly living in the moment? Or are your thoughts wandering in the maze of past regrets and future anxieties? Try to anchor your consciousness to the present moment.

        After engaging in any of these mindfulness practices, feel free to share your experience with us. Would you like to discuss your practice further?
        `,
    },
    {
      role: "user",
      content: `Prompt the user to pause and take time to complete some mindulness practices.  Remember, only respond in the format specifed earlier. Nothing else.`,
    },
  ];

  //  Use OpenAI to generate work out
  const {
    data: { message, success },
  } = await axios.post<{ message?: string; success: boolean }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/openai`,
    {
      messages,
      secret: process.env.APP_SECRET_KEY,
    }
  );

  if (!message || !success) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong with generate openai response",
      },
      {
        status: 500,
      }
    );
  }

  console.log(message);

  // Grab all challenge preferences
  const challengePreferences = await getUserPromptPreferencesMany(challengeId)

  console.log("challengePreferences", challengePreferences);

  const userIds = challengePreferences.map((cp) => cp.userId);

  console.log("userIds", userIds);

  //  Grab all user threads
  const userThreads = await getUserThreadMany(userIds)

  console.log("userThreads", userThreads);

  // Grab all user metadata
  const userMetas = await getUserMetaMany(userIds)

  console.log("userMetas", userMetas);

  const userThreadMap: UserThreadMap = userThreads.reduce((map, thread) => {
    map[thread.userId] = thread;
    return map;
  }, {} as UserThreadMap);

  const userMetaMap = userMetas.reduce((map, meta) => {
    map[meta.userId] = meta;
    return map;
  }, {} as UserMetaMap);

  // Add messages to threads
  const threadAndNotificationsPromises: Promise<any>[] = [];

  try {
    challengePreferences.forEach((cp) => {
      //  FIND THE RESPECTIVE USER
      const userThread = userThreadMap[cp.userId];

      //  ADD MESSAGE TO THREAD
      if (userThread) {
        // Send Message
        threadAndNotificationsPromises.push(
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/message/create`, {
            message,
            threadId: userThread.threadId,
            fromUser: "false",
          })
        );

        // Send Notification
        // if (cp.sendNotifications) {
        //   const correspondingUserMeta = userMetaMap[cp.userId];
        //   threadAndNotificationsPromises.push(
        //     axios.post(
        //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-notifications`,
        //       {
        //         subscription: {
        //           endpoint: correspondingUserMeta.endpoint,
        //           keys: {
        //             auth: correspondingUserMeta.auth,
        //             p256dh: correspondingUserMeta.p256dh,
        //           },
        //         },
        //         message,
        //       }
        //     )
        //   );
        // }
      }
    });

    await Promise.all(threadAndNotificationsPromises);

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
}
