import { React, useEffect, useMemo } from 'react'
import { useChatStore } from './../stores/chat.store'
import { getFriend } from '../utils/utils';
import { useAuthStore } from '../stores/auth.store.js';
import { cn } from '../utils/utils';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';


export default function ChatsList() {

    const { chats, setSelectedChat, onlineUsers } = useChatStore();
    const { authUser } = useAuthStore();


    let shouldShowChats = useMemo(() => {

        let result = chats.filter((c) => (c.lastMessage || c.id == "1"))

        result.sort((a, b) => {
            let lastMessageA = new Date(a?.lastMessage?.timestamp);
            let lastMessageB = new Date(b?.lastMessage?.timestamp);
            return lastMessageB - lastMessageA;
        })

        return result;
    }, [chats])

    return (
        <div className='bg-slate-400/60 glass dark:bg-base-300 rounded-2xl px-2 py-1.5 
        flex flex-col gap-2 overflow-x-hidden overflow-y-auto
         no-scrollbar max-h-full h-full'>
            {shouldShowChats.map((chat) => {
                if (chat.id == "1") {
                    return (<div key={chat.id} onClick={() => { setSelectedChat(chat) }}
                        className='flex gap-2 items-center overflow-hidden cursor-pointer hover:bg-base-100/20 rounded-2xl'>
                        <div className={cn('avatar', 'avatar-online')}>
                            <div className="w-15 rounded-full">
                                <img draggable={false} src={"https://thumbs.dreamstime.com/b/global-people-network-connection-blue-earth-ai-generated-user-icons-connected-around-glowing-globe-represents-419468051.jpg"} />
                            </div>
                        </div>
                        <div>
                            <p>global Chat</p>
                            <p className='text-base-content/50 whitespace-nowrap'>{chat.lastMessage?.content}</p>
                        </div>
                    </div>)
                }
                let friend = getFriend(authUser.id, chat);
                const lastMessage = chat.lastMessage;
                let shouldShowBlueDot = lastMessage.senderId != authUser.id && !lastMessage.isRead
                if (!chat.lastMessage) return;
                return (<div key={chat.id} onClick={() => { setSelectedChat(chat) }}
                    className='flex gap-2 items-center overflow-hidden cursor-pointer hover:bg-base-100/20 rounded-2xl'>
                    <div className={cn('avatar', onlineUsers.includes(friend.id) ? 'avatar-online' : 'avatar-offline')}>
                        <div className="w-15 rounded-full">
                            <img draggable={false} src={friend.avatar} />
                        </div>
                    </div>
                    <div>
                        <p>{friend.name}</p>
                        <p className='text-base-content/50 whitespace-nowrap'>{chat.lastMessage.content}</p>
                    </div>
                    {shouldShowBlueDot && <Badge className='ml-auto mr-2.5' color="primary" variant="dot">
                        <MailIcon className='text-slate-500' />
                    </Badge>}
                </div>)

            })}
        </div>



    )
}
