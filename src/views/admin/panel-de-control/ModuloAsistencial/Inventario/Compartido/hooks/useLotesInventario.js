import { useCallback, useEffect, useMemo } from "react";
import { indexarLotes, ObtenerLotesInventario } from "../precioReferencial";
import { useConsultaInventario } from "./useConsultaInventario";

// Lotes del inventario elegido con su precio referencial, para valorizar lo que las listas mencionan por `loteId`. Se
// vuelven a pedir al cambiar de inventario; `recargar` los actualiza (p. ej. tras un ingreso o un retiro). Si falla
// deja el mensaje en `error` y las pantallas siguen funcionando, con los valores en "—".
export const useLotesInventario = (inventarioId, token) => {
    const { datos: lotes, cargando, error, ejecutar, limpiar } = useConsultaInventario();
    const lotesPorId = useMemo(() => indexarLotes(lotes), [lotes]);

    const recargar = useCallback(() => {
        if (inventarioId) ejecutar(() => ObtenerLotesInventario(inventarioId, token));
        else limpiar();
    }, [inventarioId, token, ejecutar, limpiar]);

    useEffect(() => {
        recargar();
    }, [recargar]);

    return { lotes, lotesPorId, cargando, error, recargar };
};
