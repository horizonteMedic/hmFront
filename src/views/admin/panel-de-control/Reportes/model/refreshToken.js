import { URLAzure } from "../../../../config/config";
import { useAuthStore } from "../../../../../store/auth";

export default async function RefreshToken() {
    const token = useAuthStore.getState().token;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    try {
        const response = await fetch(`${URLAzure}/api/v01/st/auth/refresh`, options).then(res => res.json());

        if (response.id === 1) {
            useAuthStore.getState().setToken(response.mensaje);
            return response.mensaje;
        }

        return null;
    } catch (error) {
        console.error('Error al refrescar el token:', error);
        return null;
    }
}
