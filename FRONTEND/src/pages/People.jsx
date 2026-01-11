import React, { useEffect } from 'react'
import SearchInput from '../components/SearchInput'
import { cn } from '../utils/utils'
import { useState } from 'react'
import AllPeople from '../components/AllPeople'
import Friends from '../components/Friends'
import { ClipLoader } from "react-spinners";
import { useChatStore } from '../stores/chat.store'
import Badge from '@mui/material/Badge';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Requests from '../components/Requests'
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
export default function People() {

    const [tab, setTab] = useState('friends')

    const { getRequestsByUser, requestsToUser, requestsByUser, getFriends, friends } = useChatStore();

    useEffect(() => {
        if (!requestsByUser) getRequestsByUser();
        if (!friends) getFriends();
    }, [])

    if (!requestsByUser || !friends) return <div className='grid place-content-center h-full'>
        <ClipLoader color='blue' loading={true} />
    </div>

    let className = (name) => cn("px-1", "md:px-2", "tab", "md:text-lg", "text-xs", "font-bold", "hover:text-blue", tab == name && "tab-active");

    return (
        <div className='bg-slate-400/60 glass dark:bg-base-300 flex flex-col gap-0.5 h-full px-2.5 pt-2.5 '>
            <div className='flex flex-col border-b/20 border-b border-b-black/20'>
                <SearchInput />
                <div role="tablist" className="tabs tabs-border text-blue">
                    <a role="tab" onClick={() => { setTab("friends") }} className={className("friends")}>
                        <PeopleIcon className='text-slate-500 dark:text-base-content' />
                        &nbsp; Friends</a>
                    <a role="tab" onClick={() => { setTab("all people") }} className={className("all people")}>
                        <PublicIcon className='text-slate-500 dark:text-base-content' />
                        All People</a>
                    <a role="tab" onClick={() => { setTab("near me") }} className={className("near me")}>
                        <ShareLocationIcon className='text-slate-500 dark:text-base-content' />
                        near me</a>
                    <a role="tab" onClick={() => { setTab("requests") }} className={className("requests")}>
                        <Badge className='ml-auto mr-2.5' color="primary" badgeContent={requestsToUser.length} >
                            <PersonAddIcon className='text-slate-500 dark:text-base-content' />
                        </Badge>
                        requests
                    </a>

                </div>
            </div>
            {tab == "friends" && <Friends />}
            {tab == "all people" && <AllPeople />}
            {tab == "requests" && <Requests />}
        </div>

    )
}
