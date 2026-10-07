import useCargaLista from "../../utils/useCargaLista";
import { getEspecialidadesActivas } from "../../Especialidades/controllerEspecialidades";

// Especialidades activas de la campaña activa: son las que se asignan a cada visita nueva
// (el backend rechaza asignar especialidades de otra campaña).
export default function useEspecialidadesActivas(token, campania) {
    const { lista, cargando, fallo } = useCargaLista(
        () => getEspecialidadesActivas(campania.id, token),
        campania?.id,
        "No se pudieron cargar las especialidades de la campaña"
    );
    return { especialidades: lista, cargando, fallo };
}
