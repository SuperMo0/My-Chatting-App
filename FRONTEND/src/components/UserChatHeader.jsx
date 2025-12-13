import React from 'react'
import { useChatStore } from './../stores/chat.store'
import { MdKeyboardArrowLeft } from "react-icons/md";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { getFriend } from '../utils/utils';
import { useAuthStore } from '../stores/auth.store.js';
import { cn } from '../utils/utils';



export default function UserChatHeader() {

    const { setSelectedChat, selectedFriend, onlineUsers } = useChatStore();

    let isOnline = onlineUsers.includes(selectedFriend.id);
    return (
        <div className='flex gap-2 items-center pb-2 border-b border-b-base-content/20 '>
            <MdKeyboardArrowLeft onClick={() => { setSelectedChat(null) }} className='cursor-pointer text-6xl text-gray' />
            <div className={cn('avatar', isOnline ? 'avatar-online' : 'avatar-offline')}>
                <div className="w-18 rounded-full">
                    <img src={selectedFriend.avatar} draggable={false} className='cursor-pointer' />
                </div>
            </div>
            <div>
                <p className='font-mono  text-xl'>{selectedFriend.name}</p>
                <p className={cn(isOnline ? 'text-success' : 'text-gray')}>{isOnline ? 'online' : 'offline'}</p>
            </div>
            <PiDotsThreeOutlineVerticalFill className='ml-auto mr-3 text-3xl text-gray' />
        </div>
    )
}
