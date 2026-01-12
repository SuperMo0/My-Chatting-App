import { create } from "zustand"
import api from '../lib/axios.js'
import { toast } from 'react-toastify';
import { useChatStore } from "./chat.store.js";


export const useAuthStore = create((set, get) => ({

    authUser: null,

    isSigningIn: false,

    isChecking: true,

    socket: null,

    isSigningUp: false,


    check: async () => {
        try {
            let res = await api.get('/auth/check');
            set({ authUser: res.data.user })
        } catch (error) {
            if (error.code == "ERR_NETWORK")
                toast.error('we are having a problem connecting to servers please try again later');


        }
        finally {
            set({ isChecking: false });
        }
    },

    login: async (data) => {
        set({ isSigningIn: true })
        try {
            let res = await api.post('/auth/login', data)
            set({ authUser: res.data.user })
        } catch (error) {
            if (error.code == "ERR_NETWORK")
                toast.error('we are having a problem connecting to servers please try again later');
            else {
                let message = error.response.data.message;
                toast.error(message);
            }
        }
        finally {
            set({ isSigningIn: false });
            set({ isChecking: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            let result = await api.post('/auth/signup', data);
            const user = result.data.user;
            set({ authUser: user });
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
        finally {
            set({ isSigningUp: false });
            set({ isChecking: false });
        }
    },

    logout: async () => {
        await api.post('/auth/logout');
        useChatStore.setState(useChatStore.getInitialState());
        set({ authUser: null });
    }
}))

