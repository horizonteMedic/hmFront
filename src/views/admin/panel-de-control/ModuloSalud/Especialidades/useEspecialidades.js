import useCargaLista from "../utils/useCargaLista";
import { getEspecialidades } from "./controllerEspecialidades";

// Todas las especialidades de la campaña, activas o no (ver useCargaLista).
export default function useEspecialidades(token, campania) {
    const { lista, ...estado } = useCargaLista(
        () => getEspecialidades(campania.id, token),
        campania?.id,
        "No se pudo cargar la lista de especialidades"
    );
    return { especialidades: lista, ...estado };
}
