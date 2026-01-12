import React, { useMemo } from 'react'
import { cn } from '../utils/utils'
import { useChatStore } from '../stores/chat.store';



export default function UsersList({ users, onAction }) {

    return (
        <div className='grid gap-x-4 grid-cols-[repeat(auto-fit,140px)]
        overflow-y-scroll gap-y-2.5 px-3 items-start max-h-full no-scrollbar '>
            {
                users.map((user) => (
                    <div key={user.id} className="card bg-slate-300 dark:bg-black glass w-35 shadow-sm rounded-2xl
                     cursor-pointer">
                        <figure className="px-5 pt-5">
                            <img
                                draggable={false}
                                src={user.avatar}
                                alt="user image"
                                className="rounded-full cursor-pointer" />
                        </figure>
                        <div className="card-body items-center text-center px-0 py-2 gap-1">
                            <h2 className="card-title mt-auto">{user.name}</h2>
                            <div className="card-actions ">
                                <button
                                    onClick={() => { user.onAction(user) }}
                                    className={cn("text-white", "glow", "border-0", "btn", user.isActionDisabled ? "btn-disabled" : "bg-blue")}>
                                    {user.actionTitle}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}
