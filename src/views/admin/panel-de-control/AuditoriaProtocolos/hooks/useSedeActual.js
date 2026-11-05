import { useEffect } from "react";
import { useAuthStore } from "../../../../../store/auth";

const SEDE_POR_DEFECTO = "T-NP";

// Sede con la que trabaja el usuario: `{ codigo, nombre }`, o null si no tiene sedes asignadas.
//
// El login deja `selectedSede` en null y solo SistemaOcupacional (y el selector del Navbar al cambiarla) le pone
// un valor; entrando directo a este módulo quedaba vacío, así que no había sede contra la cual validar la orden y
// los formularios incrustados consultaban con `nomSede=null`. Misma regla que SistemaOcupacional y ModuloAsistencial:
// la elegida si sigue siendo válida; si no, T-NP o la primera sede del usuario.
export default function useSedeActual() {
    const sedes = useAuthStore((state) => state.userlogued?.sedes);
    const selectedSede = useAuthStore((state) => state.selectedSede);
    const setSelectedSede = useAuthStore((state) => state.setSelectedSede);

    useEffect(() => {
        if (!Array.isArray(sedes) || sedes.length === 0) return;
        if (sedes.some((sede) => sede.cod_sede === selectedSede)) return;
        const porDefecto = sedes.find((sede) => sede.cod_sede === SEDE_POR_DEFECTO);
        setSelectedSede(porDefecto?.cod_sede || sedes[0].cod_sede);
    }, [sedes, selectedSede, setSelectedSede]);

    if (!selectedSede) return null;
    const sede = Array.isArray(sedes) ? sedes.find((item) => item.cod_sede === selectedSede) : null;
    return { codigo: selectedSede, nombre: sede?.nombre_sede ?? selectedSede };
}
