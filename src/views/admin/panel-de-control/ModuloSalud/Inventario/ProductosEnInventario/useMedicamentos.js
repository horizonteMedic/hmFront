import useCargaLista from "../../utils/useCargaLista";
import { getMedicamentos } from "./controllerProductosEnInventario";

// Medicamentos de la campaña activa (ver useCargaLista).
export default function useMedicamentos(token, campania) {
    const { lista, ...estado } = useCargaLista(
        () => getMedicamentos(campania.id, token),
        campania?.id,
        "No se pudo cargar la lista de medicamentos"
    );
    return { medicamentos: lista, ...estado };
}
