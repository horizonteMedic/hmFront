import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAuthStore } from "../../../../../store/auth";
import { tieneAccesoA } from "../config/formulariosExamen";

// Acceso a los formularios según las vistas del usuario (`listView`, la misma lista que usa SistemaOcupacional).
// `puedeAbrir(entrada)` dice si tiene todas las vistas que exige el formulario; `avisarSinAcceso(entrada)` lo explica.
export default function useAccesoFormularios() {
    const listView = useAuthStore((state) => state.listView);

    const puedeAbrir = useCallback(
        (entrada) => tieneAccesoA(entrada, (vista) => Array.isArray(listView) && listView.includes(vista)),
        [listView]
    );

    const avisarSinAcceso = useCallback(
        (entrada) =>
            Swal.fire({
                icon: "warning",
                title: "Sin acceso",
                text: `No tienes acceso al formulario de ${entrada.titulo}. Solicita el permiso al administrador del sistema.`,
                confirmButtonText: "Entendido",
            }),
        []
    );

    return { puedeAbrir, avisarSinAcceso };
}
