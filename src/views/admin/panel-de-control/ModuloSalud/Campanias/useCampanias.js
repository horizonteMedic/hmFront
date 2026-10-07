import useCargaLista from "../utils/useCargaLista";
import { getCampanias } from "./controllerCampanias";

// Lista de campañas del backend (ver useCargaLista).
export default function useCampanias(token) {
    const { lista, ...estado } = useCargaLista(
        () => getCampanias(token),
        token,
        "No se pudo cargar la lista de campañas"
    );
    return { campanias: lista, ...estado };
}
