import React, { useEffect, useMemo, useState } from 'react'
import UsersList from './UsersList'
import { useChatStore } from '../stores/chat.store';
import { ClipLoader } from "react-spinners";
import { useAuthStore } from '../stores/auth.store';

export default function AllPeople() {

    const { users, getUsers, friends, requestsToUser, requestsByUser, sendNewRequest, acceptRequest } = useChatStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        if (users) return;
        getUsers();
    }, [])

    const usersDataCards = useMemo(() => {  // in order not to write the UsersList component twice I ended up with more lines 

        if (!users) return

        const pendingAccept = {};
        const pendingSent = {};
        const isFriend = {};

        friends.forEach((f) => isFriend[f.id] = true);

        let filteredUsers = users.filter((u) => !isFriend[u.id] && authUser.id != u.id)

        requestsToUser.forEach((r) => {
            pendingAccept[r.senderId] = r;
        })

        requestsByUser.forEach((r) => {
            pendingSent[r.receiverId] = r;
        })

        let usersDataCards = filteredUsers.map((u) => {
            if (pendingAccept[u.id]) {
                return {
                    ...u,
                    onAction: () => handleAccept(pendingAccept[u.id]),
                    actionTitle: "Accept",
                    variant: 'blue'
                }
            }
            else if (pendingSent[u.id]) {
                return {
                    ...u,
                    onAction: () => { },
                    actionTitle: "sent",
                    variant: 'success'
                }
            }
            else {
                return {
                    ...u,
                    onAction: () => handleAdd(u),
                    actionTitle: "Add",
                }
            }
        })

        return usersDataCards;


    }, [users, requestsByUser, requestsToUser, friends])


    function handleAdd(user) {
        sendNewRequest(user);
    }

    function handleAccept(request) {
        console.log('here');

        acceptRequest(request)
    }

    if (!users) return <div className='grid place-content-center h-full'>
        <ClipLoader color='blue' loading={true} />
    </div>

    return (
        <UsersList users={usersDataCards}></UsersList>
    )
}
