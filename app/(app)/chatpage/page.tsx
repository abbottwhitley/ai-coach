"use client"

import { assistantAtom, userThreadAtom } from "@/atoms"
import axios from "axios"
import { index } from "drizzle-orm/mysql-core"
import { useAtom } from "jotai"
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { Run, ThreadMessage } from "openai/resource/beta/threads/index.mjs"
import { toNamespacedPath } from "path"
import React, { useState, useEffect, use, useCallback, useRef } from "react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast";
import { threadId } from "worker_threads"


const POLLING_FREQUENCY_MS = 1000

export default function ChatPage() {
  // Atom state
  const [userThread] = useAtom(userThreadAtom);
  const [assistant] = useAtom(assistantAtom);

  // State
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [pollingRun, setPollingRun] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessagesRef = useRef<ThreadMessage[]>([]);
    
  const fetchMessages = useCallback( async () => {
    if (!userThread) return;
     
    setFetching(true)
    
    try {
      // Implement API call to fetch messages
      // NextResponse.json({success: true, message: response.data}, {status: 200})
      const response = await axios.post<{
        success: boolean;
        error?: string;
        messages?: ThreadMessage[];
      }>("api/message/list", {threadId: userThread.threadId})

      console.log("Response from POST /api/message/list ====>", response.data.messages)    
    
      // Validation
      if (!response.data.success || !response.data.messages) {
        console.error(response.data.error ?? "Unknown error.");
        return;
      }

      let newMessages = response.data.messages;
      // console.log("my newMessage ===>", newMessages ); 

      // Sort in descending order
      newMessages = newMessages
        .sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        })
        .filter(
          (message) =>
            message.content &&
            message.content.length > 0 &&
            message.content[0].type === "text" &&
            message.content[0].text.value.trim() !== ""
        );
      
      // console.log("my newMessages after sorting and filtering ===>", newMessages ); 

      // Compare new messages with previous messages
      const prevMessages = prevMessagesRef.current;
      if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
          setMessages(newMessages);
          prevMessagesRef.current = newMessages;

          // Auto-scroll to the bottom
          if (bottomRef.current) {
              bottomRef.current.scrollIntoView({ behavior: "smooth" });
          }
      }

    } catch (error) {
      console.error("Error fetching messages:", error)
      setFetching(false);
      setMessages([]);
    } finally {
      setFetching(false);
    }
  }, [userThread]);

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, POLLING_FREQUENCY_MS);

    // clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchMessages]); 

  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const startRun = async (
    threadId: string, 
    assistantId: string
  ): Promise<string> => {
    // api call to /api/run/create
    try {
      const {
        data: {success, run, error},
      } = await axios.post<{
        success: boolean;
        run?: Run;
        error?: string;
      }>("api/run/create", {
        threadId, 
        assistantId
      });
    
      if (!success || !run) {
        console.error(error ?? "Unknown error.");
        toast.error("Failed to start run.");
        return "";
      }

      return run.id;
    }
    catch (error) {
      console.error("Error starting run:", error);
      toast.error("Failed to start run.");
      return "";
    }
  };

  const pollRunStatus = async (threadId: string, runId: string) => {
    // need to track the threadId and the runId
    // api/run/retrieve
    setPollingRun(true);

    // set a poll interval that gets triggered every x seconds
    
    const intervalId = setInterval(async () => {
      // console.log("Polling run status...");
      // console.log("threadId ===>", threadId);
      // console.log("runId ===>", runId);
      try {
        
        const {
          data: {success, run, error},
        } = await axios.post<{
          success: boolean;
          error?: string;
          run?: Run;
        }>("api/run/retrieve", {
            threadId, 
            runId
        });

        if(!success || !run) {
          console.error(error ?? "Unknown error.");
          toast.error("Failed to poll run status.");
          return;
        }

        console.log("my run ===>", run);

        if(run.status === "completed") {
          clearInterval(intervalId);
          setPollingRun(false);
          fetchMessages();
          return;
        } else if (run.status === "failed") {
          clearInterval(intervalId);
          setPollingRun(false);
          toast.error("Run failed.");
          return;
        }
      } catch (error) {
        console.error("Error polling run status:", error);
        toast.error("Failed to poll run status.");
        clearInterval(intervalId);
      } 
    }, POLLING_FREQUENCY_MS);

    // Cleanup up on unmount
    return () => clearInterval(intervalId);
  }

  const sendMessage = async () => {
    // validation
    console.log("!!!!!!!!!!!!!!!!!!! sendMessage called !!!!!!!!!!!!!!!!!!!");
    if (!userThread || sending || !assistant) {
      toast.error("Failed to send message. Invalid state.")
      return
    };

    setSending(true);

    try{
      // send message /api/message/create
      console.log("########## MAKING CALL TO create message");
      const {
        data: {message: newMessages},
      } = await axios.post<{
        success: boolean;
        message?: ThreadMessage;
        error?: string;
      }>("api/message/create", {
        message,
        threadId: userThread.threadId,
        fromUser: "true"
      });

      if( !newMessages) {
        console.error("No message returned.")
        toast.error("Failed to send message. Please try again.")
      }
      // update our messages with our new response
      setMessages((prev) => [...prev, newMessages])
      setMessage("");
      toast.success("Message sent.");
      // start run is an asyn call, so we can await it
      console.log("HERE IS MY THREAD ID =======================> ", userThread.threadId);
      const runId  = await startRun(userThread.threadId, assistant.assistantId)
      if (!runId) {
        toast.error("Failed to start run.");
        return;
      }
      pollRunStatus(userThread.threadId, runId);
    } catch (error) {
        console.error(error)
        toast.error("Failed to send message. Please try again.")
    } finally {
      setSending(false);
    }    
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
  };

  return (
    <div className="w-screen h-[calc(100vh-64px)] flex flex-col" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      {/* MESSAGES */}
      <div className="flex-grow overflow-y-scroll p-8 space-y-2">
        {/* 1. FETCHING MESSAGES */}
        {fetching && messages.length === 0 && (
          <div className="text-center font-bold">Fetching...</div>
        )}
        {/* 2. NO MESSAGES */}
        {messages.length === 0 && !fetching && (
          <div className="text-center font-bold">No messages.</div>
        )}
        {/* 3. LISTING OUT THE MESSAGES */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${
              ["true", "True"].includes(
                (message.metadata as { fromUser?: string }).fromUser ?? ""
              )
                ? "bg-blue-500 ml-auto"
                : "bg-gray-400"
            }`}
          >
            {message.content[0].type === "text"
              ? message.content[0].text.value
                  .split("\n")
                  .map((text, index) => <p key={index}>{text}</p>)
              : null}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="mt-auto p-4 bg-gray-800">
        <div className="flex items-center bg-white p-2">
          <input
            type="text"
            className="flex-grow bg-transparent text-black focus:outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            disabled={
              !userThread?.threadId || !assistant || sending || !message.trim()
            }
            className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded-full focus:outline-none disabled:bg-yellow-700"
            onClick={sendMessage}
          >
            {sending ? "Sending..." : pollingRun ? "Polling Run..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

