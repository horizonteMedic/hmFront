import { useAuthStore } from "../../../../../store/auth";

// Campaña activa de la sesión. Se lee directo del store (useSessionData re-renderiza cada segundo por su reloj).
// Solo vale una campaña real (con `codigo`): lo que dejó el módulo Configuración en la sesión
// (ids de imagen) no sirve para registrar visitas, así que se trata como "sin campaña".
export default function useCampaniaActiva() {
    const guardada = useAuthStore((state) => state.campaniaActiva);
    const setCampania = useAuthStore((state) => state.setCampaniaActiva);

    return { campania: guardada?.codigo ? guardada : null, setCampania };
}
