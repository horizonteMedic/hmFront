import {create} from "zustand"
import { persist } from "zustand/middleware"

export const useAuthStore = create(
    persist((set) => ({
    token: null,
    userlogued: null,
    setuserlogued: (userlogued) => set({userlogued}),
    setToken: (token) => set({token}),
    }),
    {
        name: 'auth'
    },
))