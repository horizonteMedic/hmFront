import { useEffect, useState } from "react";
import { CargarInventariosReceta, CargarMedicamentosReceta, inventarioElegido } from "./controllerReceta";

// Inventarios activos y medicamentos que se pueden recetar (con su stock disponible) del inventario elegido
// (`inventarioId`; sin elección o con una que ya no existe, el central). Se cargan cuando hay un ticket buscado
// (`habilitado`) y se vuelven a pedir con cada ticket nuevo, porque el stock disponible cambia a medida que otras
// recetas reservan; al cambiar de inventario se piden solo los medicamentos del nuevo. Si algo falla deja el mensaje en
// `error` (la pantalla lo muestra con un botón de reintento) y la lista vacía.
export const useMedicamentosReceta = (token, habilitado, inventarioId = "") => {
    const [inventarios, setInventarios] = useState({ cargando: false, error: "", lista: [] });
    const [medicamentos, setMedicamentos] = useState({ cargando: false, error: "", lista: [] });
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        if (!habilitado) return undefined;

        // Solo se aplica la respuesta de la última carga: si el ticket cambia mientras tanto, la lenta no pisa a la nueva.
        let vigente = true;
        setInventarios((anterior) => ({ ...anterior, cargando: true, error: "" }));

        CargarInventariosReceta(token).then((res) => {
            if (!vigente) return;
            setInventarios(
                res.ok
                    ? { cargando: false, error: "", lista: res.inventarios }
                    : { cargando: false, error: res.mensaje, lista: [] }
            );
        });

        return () => {
            vigente = false;
        };
    }, [token, habilitado, intento]);

    const inventario = inventarioElegido(inventarios.lista, inventarioId);
    const idInventario = inventario?.id;

    useEffect(() => {
        if (!habilitado || idInventario == null) return undefined;

        let vigente = true;
        // El stock es el de un inventario concreto: al cambiar no se deja el del anterior a la vista.
        setMedicamentos({ cargando: true, error: "", lista: [] });

        CargarMedicamentosReceta(idInventario, token).then((res) => {
            if (!vigente) return;
            setMedicamentos(
                res.ok
                    ? { cargando: false, error: "", lista: res.medicamentos }
                    : { cargando: false, error: res.mensaje, lista: [] }
            );
        });

        return () => {
            vigente = false;
        };
    }, [token, habilitado, idInventario, intento]);

    return {
        cargando: inventarios.cargando || medicamentos.cargando,
        error: inventarios.error || medicamentos.error,
        inventarios: inventarios.lista,
        inventario,
        medicamentos: medicamentos.lista,
        recargar: () => setIntento((n) => n + 1),
    };
};
