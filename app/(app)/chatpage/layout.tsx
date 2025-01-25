"use client"

import { useEffect, useState } from "react"
import { Assistant, UserThread } from "@/server/db/schemas"
import axios from "axios"
import { useAtom } from "jotai"
import { assistantAtom, userThreadAtom } from "@/atoms"
import toast from "react-hot-toast"

export default function ChatPageLayout({ children }: { children: React.ReactNode }) {
  
  const [, setUserThread] = useAtom(userThreadAtom)
  const [assistant, setAssistant] = useAtom(assistantAtom)

  // useEffect used to run on boot and check for assistant
  // makes a request to our backend. But requires that we wrap everything inside of 
  useEffect(() => {

    // In the initial implementation, we only have one agent, so we don't need to
    // worry about fetching the assistant. 
    // So if we do have it and it's not set to null, return it (singleton idea).
    if (assistant) return;

    // But (similar to the getUserThread) requires that we wrap everything inside of a function and then call it
    // because you can't directly call asyn functions
    async function getAssistant() {
      try {
        // actual response from api/user-thread/GET --> NextResponse.json({ success: true, userThread }, { status: 200 })
        console.log("Calling GET /api/assistant")
        const response = await axios.get<{
          success: boolean;
          assistant?: Assistant;
          message?: string;
        }>("/api/assistant")

        console.log("Response from GET /api/assistant", response.data)
        if (!response.data.success || !response.data.assistant) {
          console.log(response.data.message ?? "Error fetching assistant....")
          toast.error("Error fetching assistant....")
          setAssistant(null)
          return;
        }

        console.log("MY ASSISTANT ID:", response.data.assistant.assistantId)
        setAssistant(response.data.assistant)
      } catch (error) {
        console.error(error)
        setAssistant(null)
      }
    }

    getAssistant();
    
}, [assistant, setAssistant]);




  useEffect(() => {
    async function getUserThread() {
      try {
        // actual response from api/user-thread/GET --> NextResponse.json({ success: true, userThread }, { status: 200 })
        console.log("Calling GET /api/user-thread")
        const response = await axios.get<{
          success: boolean;
          message?: string;
          userThread: UserThread;
        }>("/api/user-thread")


        console.log("Response from GET /api/user-thread", response.data)

        if (!response.data.success || !response.data.userThread) {
          console.log(response.data.message ?? "Error fetching user thread....")
          setUserThread(null)
          return
        }

        console.log("MY THREAD ID:", response.data.userThread.threadId)
        setUserThread(response.data.userThread)
      } catch (error) {
        console.error(error)
        setUserThread(null)
      }
    }

    getUserThread()
  }, [setUserThread])

  return (
  <div className="flex flex-col w-full h-full">
      {children}
  </div>
  )
}
