"use client";

import Navbar from "@/components/Navbar";
import { UserThread } from "@/server/db/schemas";
import { ClerkProvider } from "@clerk/nextjs";
import axios from "axios";
import { boolean } from "drizzle-orm/mysql-core";
import { useEffect, useState} from "react";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [userThread, setUserThread] = useState<UserThread | null>(null);

  useEffect(() => {
      async function getUserThread() {
          try {
              console.log("Calling GET /api/user-thread");
              const response = await axios.get<{
                  success: boolean;
                  message?: string;
                  userThread: UserThread; // Ensure this matches the response structure
              }>("/api/user-thread");

              console.log("Response from GET /api/user-thread", response.data);  
              const { success, message, userThread } = response.data; // Destructure with correct case
              console.log("userThread===", userThread);
              console.log("message====", message);
              console.log("success====", success);

              if (!success || !userThread) {
                  console.log(message ?? "Error fetching user thread....");
                  setUserThread(null);
                  return;
              }

              console.log("Thread ID:", userThread.threadId);
              setUserThread(userThread);
          } catch (error) {
              console.error(error);
              setUserThread(null);
          }
      }

      getUserThread();
  }, []);

  return (
    <ClerkProvider>
        <div className="flex flex-col w-full h-full">
            {children}
        </div>
    </ClerkProvider>
  );
}

// Turn on middle ware and make everything protected
// Us our user id to create and fetch the threadId
// A threadId is what stores all messages between a user and the AI
// So we need to use the threadId to fetch all messages and display them in the chat window
