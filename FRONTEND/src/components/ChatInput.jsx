import React, { useState } from 'react'
import { IoMdImage } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import { useChatStore } from '../stores/chat.store';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import { cn } from '../utils/utils';



export default function ChatInput() {

    const [text, setText] = useState();
    const [image, setImage] = useState();
    const { sendMessage } = useChatStore();
    const [showEmoji, setShowEmoji] = useState(false);

    async function handleSendMessage(e) {
        e.preventDefault();

        let isTextEmpty = text.trim() === "";

        if (isTextEmpty) return;

        try {
            await sendMessage(text);

            setText("");

            setImage(null);
        } catch (error) {


        }
    }

    function toggleEmoji() {
        setShowEmoji(!showEmoji);
    }

    return (
        <>
            {showEmoji &&
                <div className='absolute bottom-full'>
                    <EmojiPicker onEmojiClick={(e) => {
                        setText(text + e.emoji)
                    }} />
                </div>}
            <form onSubmit={handleSendMessage}>
                <div className='px-1 py-3 bg-slate-300 dark:bg-base-300 rounded-3xl'>
                    <textarea id='message-input-area' value={text} onChange={(e) => { setText(e.target.value) }} className="
            textarea textarea-ghost w-full resize-none
            focus:outline-0
            bg-transparent"
                        placeholder="type a message"></textarea>
                    <div className='flex gap-1.5'>
                        <IoMdImage onClick={() => { toast.info('this feature is not available yet stay tuned') }} className='text-gray text-2xl hover:text-blue cursor-pointer' />
                        <MdEmojiEmotions onClick={toggleEmoji} className={cn(showEmoji ? "text-blue" : "text-gray", "text-2xl", "hover:text-blue", "cursor-pointer")} />
                        <button className='btn bg-blue  border-0 text-white ml-auto mr-2'>Send</button>
                    </div>
                </div>
            </form>
        </>
    )
}
