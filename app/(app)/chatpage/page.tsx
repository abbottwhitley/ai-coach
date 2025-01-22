"use client"

import { ThreadMessage } from "openai/resource/beta/threads/index.mjs";
import React, {useState} from "react";

function landingpage() {
    const [fetching, setFetching] = useState(false);
    const [messages, setMessages] = useState<ThreadMessage[]>([]);

    const fetchMessages = async () => {
        // TODO: api/message list
    }

    return (
        <div className="w-screen h-screen flex flex-col bg-grey text-black">
            <div className="flex-grow overflow-y-hidden p-8 space-y-2">
                {fetching && <div className='text-center font-bold'> Loading... </div>}
                {messages.length === 0 && !fetching && (
                    <div className='text-center font-bold'> No messages yet </div>
                )}
            </div>
        </div>
    )

}

export default landingpage;

