"use client"

import type { ThreadMessage } from "openai/resource/beta/threads/index.mjs"
import React, { useState, useEffect } from "react"

export default function ChatPage() {
  const [fetching, setFetching] = useState(false)
  const [messages, setMessages] = useState<ThreadMessage[]>([])

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setFetching(true)
    try {
      // TODO: Implement API call to fetch messages
      // const response = await fetch('/api/messages');
      // const data = await response.json();
      // setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setFetching(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 text-black">
      <div className="flex-grow overflow-y-auto p-8 space-y-2">
        {fetching && <div className="text-center font-bold"> Loading... </div>}
        {messages.length === 0 && !fetching && <div className="text-center font-bold"> No messages yet </div>}
        {messages.map((message, index) => (
          <div key={index} className="p-2 bg-white rounded shadow">
            {/* Display message content here */}
            {message.content}
          </div>
        ))}
      </div>
    </div>
  )
}

