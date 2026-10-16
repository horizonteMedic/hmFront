import { consultarInventario, inventarioUrl } from "../inventarioUtils";

const alertasUrl = `${inventarioUrl}/stock/alertas`;

// Medicamentos del inventario cuyo stock disponible llegó al mínimo o quedó por debajo.
export const ObtenerAlertasReposicion = (inventarioId, token) =>
    consultarInventario(
        `${alertasUrl}?${new URLSearchParams({ inventarioId })}`,
        token,
        "No se pudieron cargar las alertas de reposición."
    );

// Unidades que faltan para volver al stock mínimo (0 si ya lo alcanzó).
export const Faltante = (fila) => Math.max((Number(fila.stockMinimo) || 0) - (Number(fila.cantidadDisponible) || 0), 0);

// Lo más urgente (mayor faltante) primero; a igual faltante, por nombre.
export const OrdenarPorUrgencia = (alertas) =>
    [...alertas].sort((a, b) => Faltante(b) - Faltante(a) || String(a.nombre ?? "").localeCompare(String(b.nombre ?? ""), "es"));
