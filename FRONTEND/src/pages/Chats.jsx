import React, { useEffect } from 'react'
import ChatsList from '../components/ChatsList'
import UserChat from '../components/UserChat'
import { useChatStore } from './../stores/chat.store'
import { cn } from './../utils/utils.js'

export default function Chats() {


    const { selectedChat } = useChatStore();

    return (
        <div className='md:grid
          md:grid-cols-[4fr_6fr]
          md:gap-4
          overflow-hidden h-full
          '>
            <div className={cn("hidden", !selectedChat && "block", "md:block", "h-full", "overflow-hidden")}>
                <ChatsList />
            </div>
            <div className={cn("hidden", selectedChat && "block", "md:block", "h-full", "overflow-hidden")}>
                {selectedChat ? <UserChat /> :
                    <div className='text-center' >
                        <img src="logo.png" className='w-full' alt="" />
                        <h1 className='text-8xl text-blue font-extrabold'>Chat</h1>
                        <p className='text-3xl text-base-content/70'>Connect freely</p>
                        <p className='text-base-content/50'>pick some chat to start chatting</p>
                    </div>}
            </div>
        </div>
    )


}
