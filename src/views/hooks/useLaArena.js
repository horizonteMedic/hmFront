import { useMemo } from "react";
import { useAuthStore } from "../../store/auth";

// Código de la sede "HUAMA - LA ARENA" (cod_sede en userCompleto.sedes). Es lo que define a un cliente La Arena:
// no hay un check manual en ningún formulario.
export const COD_SEDE_LA_ARENA = "LARE";

/**
 * ¿La sede seleccionada en el Navbar es La Arena? Se lee del store, así que cambia al instante si se cambia de sede
 * y vale desde que el formulario se abre (sin esperar a buscar un ticket).
 */
export const useEsSedeLaArena = () =>
    useAuthStore((state) => String(state.selectedSede) === COD_SEDE_LA_ARENA);

/**
 * Formulario con `esArena` resuelto: verdadero si la sede seleccionada es La Arena (las secciones de La Arena -Receta,
 * Descanso Médico, Informe de Accidente, Resumen Asistencial, criterio de Sat. O2- se ven desde que se abre el
 * formulario) o si el ticket buscado ya está registrado como La Arena (`form.esArena`, que carga la búsqueda).
 * Devuelve el mismo objeto si no hay nada que cambiar; el estado guardado (useForm / localStorage) no se modifica.
 */
export const useFormLaArena = (form) => {
    const esSedeLaArena = useEsSedeLaArena();
    return useMemo(
        () => (esSedeLaArena && !form.esArena ? { ...form, esArena: true } : form),
        [form, esSedeLaArena]
    );
};
