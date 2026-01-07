import { create } from "zustand"
import api from "../lib/axios.js";
import { toast } from "react-toastify";
import { fixDate, getFriend } from "../utils/utils.js";
import { useAuthStore } from "./auth.store.js";
import { io } from 'socket.io-client'
import { message } from "../lib/fake.js";



export const useChatStore = create((set, get) => ({

    isLoading: false,

    messages: null,

    friends: null,

    chats: null,

    users: null,

    onlineUsers: null,

    selectedFriend: null,

    selectedChat: null,

    requestsByUser: null,

    requestsToUser: null,

    isGettingChats: false,

    isGettingRequestsToUser: false,

    getFriends: async () => {
        try {
            let result = await api.get('/app/friends');
            let friends = result.data.friends;
            set({ friends: friends })
        } catch (error) {
            toast.error("couldn't get your chats please try again later");
        }
    },

    getChats: async () => {
        set({ isGettingChats: true })
        try {
            let result = await api.get('/app/chats');
            let chats = result.data.chats;

            set({ chats: chats })
        } catch (error) {
            toast.error("couldn't get your chats please try again later");
        }
        finally {
            set({ isGettingChats: false })
        }
    },

    getUsers: async () => {
        const result = await api('/app/users');
        const users = result.data.users
        set({ users: users });
    },

    setSelectedChat: (selectedChat) => {
        set({ selectedChat: selectedChat });
        if (selectedChat && selectedChat.id == "1") { // case of the global chat invent a friend for now 
            set({
                selectedFriend: {
                    id: "1",
                    name: "global chat",
                    avatar: "https://thumbs.dreamstime.com/b/global-people-network-connection-blue-earth-ai-generated-user-icons-connected-around-glowing-globe-represents-419468051.jpg"
                }
            });
            return;
        }
        let friend = getFriend(useAuthStore.getState().authUser.id, selectedChat);
        set({ selectedFriend: friend });
    },


    getMessages: async () => {
        const { selectedChat } = get();

        let result = await api.get(`/app/chat/${selectedChat.id}/messages`);

        let messages = result.data.messages;

        set({ messages: messages });
    },

    sendMessage: async (content) => {
        try {
            const { selectedChat } = get();
            const result = await api.post(`app/message/${selectedChat.id}`, { content })

        } catch (error) {
            toast.error("couldn't send message please try again");
            throw error;
        }

    },

    getRequestsByUser: async () => {
        try {
            const result = await api.get('/app/requests/by');
            const requestsBy = result.data.requestsBy;
            set({ requestsByUser: requestsBy });
        } catch (error) {
            console.log(error);
        }
    },

    getRequestsToUser: async () => {
        set({ isGettingRequestsToUser: true });

        try {
            const result = await api.get('/app/requests/to');

            const requestsTo = result.data.requestsTo;

            set({ requestsToUser: requestsTo });

        } catch (error) {

        }
        finally {
            set({ isGettingRequestsToUser: false });
        }

    },

    sendNewRequest: async (receiver) => {
        try {
            const result = await api.post(`/app/request/${receiver.id}`);

            let request = result.data.request;

            const { requestsByUser } = get();

            set({ requestsByUser: [...requestsByUser, request] })

        } catch (error) {
            console.log(error);
            toast.error('failure to send request try later');
        }
    },

    acceptRequest: async (request) => {
        try {
            const result = await api.put(`/app/request/${request.id}`);

            const { requestsToUser } = get();

            let newRequestsToUser = requestsToUser.filter((r) => r.id != request.id);

            set({ requestsToUser: newRequestsToUser })

        } catch (error) {
            console.log(error);
            toast.error('failure accepting please try again later');
        }
    },

    markChatAsRead: async (chat) => {
        if (chat.id == "1") return;  // no seen message feature for global messages 
        let newChat = {
            ...chat,
            lastMessage: {
                ...chat.lastMessage,
                isRead: true,
            }
        }
        let newChats = get().chats.map(c => {
            return c.id == chat.id ? newChat : c
        })
        set({ chats: newChats })

        try {
            const result = await api.put(`app/chat/${chat.id}/read`);
        } catch (error) {
            console.log(error);
        }
    },

    connectSocket: () => {

        const { authUser } = useAuthStore.getState();

        if (!authUser) return;

        let url = import.meta.env.MODE == 'production' ? "/" : "http://localhost:3000"
        const socket = io(url, {
            reconnectionDelayMax: 10000,
            withCredentials: true,
        });

        socket.on('onlineUsers', (onlineUsers) => {

            set({ onlineUsers: onlineUsers });
        })

        socket.on("chatUpdate", (chat) => {

            const { chats } = get();
            const { authUser } = useAuthStore.getState();

            const newChats = chats.filter((c) => c.id != chat.id);

            if (get().selectedChat?.id == chat.id) {
                const messages = get().messages || [];          // we should have a state isGettingMessages to avoid race conditions
                set({ messages: [...messages, chat.lastMessage] });

                if (chat.lastMessage.senderId != authUser.id) {
                    chat.lastMessage.isRead = true;
                    if (chat.id != "1") socket.emit("messageReadUpdate", chat.lastMessage);
                }
            }
            set({ chats: [...newChats, chat] });
        })


        socket.on("friendsUpdate", (friend) => {
            console.log('friendsUpdate', friend);
            const { friends } = get();
            set({ friends: [...friends, friend] });
        })

        socket.on("chatIsRead", (chat) => {
            const selectedChat = get().selectedChat;
            if (!selectedChat || chat.id != get().selectedChat.id) return;

            const { messages } = get();
            const { authUser } = useAuthStore.getState();
            const { lastMessage } = chat;
            let newMessages = messages.map((m) => {
                return (m.senderId == authUser.id) ? { ...m, isRead: true, readAt: lastMessage.readAt } : m;
            })
            set({ messages: newMessages });
        })

        socket.on("requestsToUserUpdate", (request) => {
            const { requestsToUser } = get();
            set({ requestsToUser: [...requestsToUser, request] });
        })

        socket.on("messageReadUpdate", (message) => {
            const { authUser } = useAuthStore.getState();

            const selectedChat = get().selectedChat;

            if (!selectedChat || message.chatId != selectedChat.id) return;

            const { messages } = get()

            let newMessages = messages.map((m) => {
                if (m.id == message.id) return message;
                return m;
            })

            set({ messages: newMessages });
        })

        set({ socket: socket });
        return socket;
    }

}))