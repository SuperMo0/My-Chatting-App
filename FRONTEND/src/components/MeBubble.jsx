import React from 'react'
import { useAuthStore } from '../stores/auth.store.js';
import { fixDate } from '../utils/utils.js';

export default function MeBubble({ message }) {

    const { authUser } = useAuthStore();

    return (
        <div className="chat chat-end">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS chat bubble component"
                        src={authUser.avatar}
                        draggable={false}
                    />
                </div>
            </div>
            <div className="chat-header">
                {authUser.name}
                <time className="text-xs opacity-50">{fixDate(message.timestamp)}</time>
            </div>
            <div className="chat-bubble bg-blue text-white max-w-1/2">{message.content}</div>
            {message.chatId != "1" &&
                <div className="chat-footer opacity-50">{message.isRead ? `Seen at ${fixDate(message.readAt)}` : 'delivered'}</div>
            }
        </div>
    )



}
