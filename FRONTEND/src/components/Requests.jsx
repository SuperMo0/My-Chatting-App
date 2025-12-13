import React from 'react'
import UsersList from './UsersList';
import { useChatStore } from '../stores/chat.store';

export default function Requests() {

    const { requestsToUser, acceptRequest } = useChatStore();

    const usersDataCards = requestsToUser.map((r) => {
        let user = { ...r.sender };

        return {
            ...user,
            onAction: () => { handleAccept(r) },
            actionTitle: "accept"
        }
    })
    function handleAccept(request) {
        acceptRequest(request)
    }

    return (
        <UsersList users={usersDataCards}></UsersList>
    )
}
