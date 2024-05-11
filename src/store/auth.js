import {create} from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create(
    persist((set) => ({
    token: null,
    userlogued: null,
    listView: [],
    setlistView: (listView) => set({listView}),
    setuserlogued: (userlogued) => set({userlogued}),
    setToken: (token) => set({token}),
    }),
    {
        name: 'auth'
    },
))

export const isTokenExpired = (token) => {
    if (!token) {
      return true; // Si no hay token, considerarlo como caducado
    }
    
    const decodedToken = jwtDecode(token); // Decodificar el token JWT
    const currentTime = Date.now() / 1000; // Obtener el tiempo actual en segundos
    
    // Verificar si el tiempo de expiración del token es menor al tiempo actual
    return decodedToken.exp < currentTime;
  };