import React from 'react'
import { useChatStore } from './../stores/chat.store'
import { fixDate } from '../utils/utils.js';

export default function FriendBubble({ message }) {
    const { selectedFriend } = useChatStore();

    return (
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="friend avatar"
                        src={selectedFriend.avatar}
                    />
                </div>
            </div>
            <div className="chat-header">
                {selectedFriend.name}
                <time className="text-xs opacity-50">{fixDate(message.timestamp)}</time>
            </div>
            <div className="chat-bubble bg-blue text-white max-w-1/2">{message.content}</div>
        </div>

    )
}
