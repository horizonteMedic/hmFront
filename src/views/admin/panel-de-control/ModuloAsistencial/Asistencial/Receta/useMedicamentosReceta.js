import { useEffect, useState } from "react";
import { CargarMedicamentosReceta } from "./controllerReceta";

// Medicamentos que se pueden recetar (con su stock disponible) del inventario de la sede del ticket. Se cargan
// cuando hay un ticket buscado (`habilitado`) y se vuelven a pedir con cada ticket nuevo, porque el stock
// disponible cambia a medida que otras recetas reservan. Si falla deja el mensaje en `error` (la pantalla lo muestra
// con un botón de reintento) y la lista vacía.
export const useMedicamentosReceta = (token, sede, habilitado) => {
    const [estado, setEstado] = useState({ cargando: false, error: "", inventario: null, medicamentos: [] });
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        if (!habilitado) return undefined;

        // Solo se aplica la respuesta de la última carga: si el ticket cambia mientras tanto, la lenta no pisa a la nueva.
        let vigente = true;
        setEstado((anterior) => ({ ...anterior, cargando: true, error: "" }));

        CargarMedicamentosReceta(sede, token).then((res) => {
            if (!vigente) return;
            setEstado(
                res.ok
                    ? { cargando: false, error: "", inventario: res.inventario, medicamentos: res.medicamentos }
                    : { cargando: false, error: res.mensaje, inventario: null, medicamentos: [] }
            );
        });

        return () => {
            vigente = false;
        };
    }, [token, sede, habilitado, intento]);

    return { ...estado, recargar: () => setIntento((n) => n + 1) };
};
