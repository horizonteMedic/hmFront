import { URLAzure } from "../../../../../config/config";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";

/**
 * Construye el body de registrar/actualizar Historia Ocupacional y lo envía.
 *
 * - `data.codHo` presente  => actualización (se reenvían los detalles a eliminar).
 * - `data.codHo` ausente   => registro nuevo.
 *
 * La auditoría se sella con `sellarAuditoria` (mismo estándar que el resto de
 * formularios ocupacionales). El backend de Historia Ocupacional espera la clave
 * `userRegistro` (valor por defecto de `sellarAuditoria`); en la actualización se
 * reenvía el creador original y, si el backend no lo devolvió, se usa el usuario
 * en sesión para no dejar la columna vacía.
 */
export function SubmitHistoriaOcupacional(data, registros, user, token) {
    const base = {
        codHo: data.codHo ? data.codHo : null,
        norden: data.norden,
        areaO: data.areaO,
        fechaHo: data.fecha,
        dniUser: data.dniUser,
        dniPa: data.dni,
        usuarioFirma: data.user_medicoFirma,
        codigosDetallesEliminar: data.codHo ? data.eliminados : null,
        detalles: registros.map((reg) => ({
            fecha: reg.fecha || "",
            empresa: reg.empresa || "",
            altitud: reg.altitud || "",
            actividad: reg.actividad || "",
            areaEmpresa: reg.areaEmpresa || "",
            ocupacion: reg.ocupacion || "",
            superficie: reg.superficie || "",
            socavon: reg.socavon || "",
            riesgo: reg.riesgo || "",
            proteccion: reg.proteccion || "",
            causaRetiro: reg.causaRetiro || "",
            historiaDetalleId: data.codHo ? reg.historiaDetalleId ?? null : null,
        })),
    };

    const body = sellarAuditoria(base, {
        user,
        esActualizacion: Boolean(data.codHo),
        userRegistro: data.userRegistro || user,
        fechaRegistro: data.fechaRegistro,
    });

    const url = `${URLAzure}/api/v01/ct/historiaOcupacional/registrarActualizarHistoriaOcupacional`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    };
    return fetch(url, options)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((response) => response)
        .catch((error) => {
            console.error("Error en SubmitHistoriaOcupacional:", error);
            throw error;
        });
}
