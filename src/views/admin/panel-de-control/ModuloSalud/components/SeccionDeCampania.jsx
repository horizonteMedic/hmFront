import useCampaniaActiva from "../utils/useCampaniaActiva";
import CampaniaActivaBanner from "./CampaniaActivaBanner";
import CampaniaRequerida from "./CampaniaRequerida";

// Sección que solo funciona dentro de la campaña activa: muestra el banner con la campaña y llama a
// `children(campania)`; si no hay ninguna activa, muestra en su lugar la pantalla para ir a activarla.
export default function SeccionDeCampania({ mensaje, onIrACampanias, children }) {
    const { campania } = useCampaniaActiva();

    if (!campania) {
        return (
            <div className="mx-auto max-w-[95%] px-4">
                <CampaniaRequerida mensaje={mensaje} onIrACampanias={onIrACampanias} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <CampaniaActivaBanner campania={campania} className="mx-4" />
            {children(campania)}
        </div>
    );
}
