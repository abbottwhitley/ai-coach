"use client"

import type { UserThread } from "@/server/db/schemas"
import axios from "axios"
import { useEffect, useState } from "react"

export default function ChatPageLayout({ children }: { children: React.ReactNode }) {
  const [userThread, setUserThread] = useState<UserThread | null>(null)

  useEffect(() => {
    async function getUserThread() {
      try {
        console.log("Calling GET /api/user-thread")
        const response = await axios.get<{
          success: boolean
          message?: string
          userThread: UserThread
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
  }, [])

  return (
  <div className="flex flex-col w-full h-full">
      {children}
  </div>
  )
}
