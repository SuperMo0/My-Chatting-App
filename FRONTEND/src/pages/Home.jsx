import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import Panel from '../components/Panel'
import { useChatStore } from '../stores/chat.store';
import { useAuthStore } from '../stores/auth.store';
import { ClipLoader } from 'react-spinners';

export default function Home() {

    const { connectSocket,
        getChats,
        onlineUsers,
        getRequestsToUser,
        isGettingChats,
        isGettingRequestsToUser,
    } = useChatStore();

    useEffect(() => {
        if (!isGettingChats) getChats();
        if (!isGettingRequestsToUser) getRequestsToUser();
    }, [])

    useEffect(() => {
        let socket = connectSocket()
        return () => socket.disconnect();
    }, [])

    if (isGettingChats || !onlineUsers || isGettingRequestsToUser) return <div className='grid place-content-center h-full'>
        <ClipLoader color='blue' loading={true} />
    </div>


    return (
        <div className="flex items-center justify-center h-screen bg-base-100 ">
            <div className='max-w-full w-full bg-slate-300 glass dark:bg-base-300 h-full rounded-2xl px-2 py-3'>
                <div className='flex flex-col h-full md:flex-row md:gap-3'>
                    <div className='mt-auto md:mt-0 order-2 md:order-1'>
                        <Panel></Panel>
                    </div>
                    <div className='order-1 md:order2 flex-1 h-full'>
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </div>
    )
}
