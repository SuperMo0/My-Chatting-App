import React, { useEffect, useRef } from 'react'
import { useChatStore } from './../stores/chat.store'
import UserChatHeader from './UserChatHeader';
import MeBubble from './MeBubble'
import FriendBubble from './FriendBubble'
import ChatInput from './ChatInput';
import { useAuthStore } from '../stores/auth.store.js';
import { ClipLoader } from 'react-spinners';


export default function UserChat() {

    const { getMessages, isLoading, selectedChat, messages, markMessageAsRead, markChatAsRead } = useChatStore();
    const { authUser } = useAuthStore();
    const messagesContainerRef = useRef();

    useEffect(() => {
        getMessages();
    }, [selectedChat.id])

    useEffect(() => {
        if (!messages) return;

        const lastMessage = selectedChat.lastMessage
        if (!lastMessage) return;

        let hasUnread = (lastMessage.senderId != authUser.id) && (!lastMessage.isRead) // we should be checking all message probably this will cause weird bugs 

        if (hasUnread)
            markChatAsRead(selectedChat);

    }, [selectedChat.id, messages])

    useEffect(() => {
        if (!messages) return;
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [messages])


    if (!messages) return <div className='grid place-content-center h-full'>
        <ClipLoader color='blue' loading={true} />
    </div>

    return (
        <div className='h-full flex flex-col bg-slate-400/60 glass dark:bg-base-300 py-2 px-2 overflow-hidden rounded-2xl'>
            <UserChatHeader />
            <div ref={messagesContainerRef} className='overflow-y-scroll grow basis-0 no-scrollbar'>
                {
                    messages.map((message) => (
                        message.senderId == authUser.id ? <MeBubble key={message.id} message={message} />
                            : <FriendBubble key={message.id} message={message} />
                    ))
                }
            </div>
            <div className='mt-auto relative'>
                <ChatInput />
            </div>
        </div>
    )
}
