import { useEffect, useRef } from "react";

// Cuando llega un paciente recién registrado (`paciente`), ejecuta `registrar(paciente)` una sola vez,
// en cuanto se puede (`listo`), y avisa con `alConsumir` para que quien lo envió deje de ofrecerlo.
export default function useAutoRegistro(paciente, listo, registrar, alConsumir) {
    const ultimoId = useRef(null);
    const accion = useRef();

    // Siempre la versión más reciente (campaña y especialidades actuales) sin volver a disparar el efecto
    useEffect(() => {
        accion.current = () => {
            alConsumir?.();
            registrar(paciente);
        };
    });

    useEffect(() => {
        if (!paciente) {
            ultimoId.current = null;
            return;
        }
        if (!listo || ultimoId.current === paciente.pacienteId) return;
        ultimoId.current = paciente.pacienteId;
        accion.current();
    }, [paciente, listo]);
}
