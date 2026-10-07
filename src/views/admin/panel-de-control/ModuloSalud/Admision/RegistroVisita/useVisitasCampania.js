import useCargaLista from "../../utils/useCargaLista";
import { getVisitas } from "./controllerRegistroVisita";

// Visitas de la campaña activa (ver useCargaLista). Sin campaña no se carga nada.
export default function useVisitasCampania(token, campania) {
    const { lista, ...estado } = useCargaLista(
        () => getVisitas(campania.codigo, token),
        campania?.codigo,
        "No se pudo cargar la lista de visitas"
    );
    return { visitas: lista, ...estado };
}
