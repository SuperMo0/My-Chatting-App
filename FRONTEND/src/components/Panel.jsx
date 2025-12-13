import React from 'react'
import { NavLink } from 'react-router'
import { RiChatSmile3Fill } from "react-icons/ri";
import { MdPeopleAlt } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { useChatStore } from '../stores/chat.store';
import { useAuthStore } from '../stores/auth.store';
import Badge from '@mui/material/Badge';





export default function Panel() {

    const { chats, requestsToUser } = useChatStore();
    const { authUser } = useAuthStore();

    let unreadChats = 0;

    chats.forEach(chat => {
        const lastMessage = chat.lastMessage;
        if (!lastMessage) return;

        if (lastMessage.senderId != authUser.id && !lastMessage.isRead) unreadChats++;
    })

    let unreadRequestsToUserCount = 0;
    requestsToUser.forEach(r => {
        if (!r.isSeen) unreadRequestsToUserCount++;
    })


    return (
        <div className='px-1 py-1 flex gap-2 justify-around md:flex-col md:gap-4 pt-2 md:pt-0'>

            <NavLink key={"Chats"} className="group aria-[current=page]:*:bg-base-200" to={'/'}>
                <div className='flex flex-col items-center gap-1 px-4 rounded-2xl bg-base-100/10'>
                    <Badge className='ml-auto mr-2.5' color="primary" badgeContent={unreadChats}>
                        <RiChatSmile3Fill className='text-5xl text-gray group-aria-[current=page]:text-blue' />
                    </Badge>
                    <p className='text-gray-500 md:text-xl group-aria-[current=page]:text-blue'>Chats</p>

                </div>
            </NavLink >

            <NavLink key={"People"} className="group aria-[current=page]:*:bg-base-200" to={'/people'}>
                <div className='flex flex-col items-center gap-1 px-4 rounded-2xl bg-base-100/10'>
                    <Badge className='ml-auto mr-2.5' color="primary" badgeContent={unreadRequestsToUserCount}>
                        <MdPeopleAlt className='text-5xl text-gray group-aria-[current=page]:text-blue' />
                    </Badge>
                    <p className='text-gray-500 md:text-xl group-aria-[current=page]:text-blue'>People</p>
                </div>
            </NavLink>

            <NavLink key={"Profile"} className="group aria-[current=page]:*:bg-base-200" to={'/profile'}>
                <div className='flex flex-col items-center gap-1 px-4 rounded-2xl bg-base-100/10'>
                    <BiSolidUser className='text-5xl text-gray group-aria-[current=page]:text-blue' />
                    <p className='text-gray-500 md:text-xl group-aria-[current=page]:text-blue'>Profile</p>
                </div>
            </NavLink>
        </div >
    )
}
