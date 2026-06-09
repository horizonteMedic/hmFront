import Swal from "sweetalert2";
import { getFetch } from "../../../../utils/apiHelpers";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { LoadingDefault } from "../../../../utils/functionUtils";

const obtenerReporteUrl = "/api/v01/st/registros/historial";
const obtenerHistorialExamenes = "/api/v01/st/registros/historialExamenes"

export const searchByNorden = async (
    nro,
    setForm,
    token,
    selectedSede
) => {
    try {
        LoadingDefault("Buscando Datos")
        const urlPrincipal = `${obtenerReporteUrl}?${nro == "" ? "" : `&norden=${nro}`}`;
        const resPrincipal = await getFetch(urlPrincipal, token);

        if (resPrincipal) {
            const tablaTrujilloNormalizada = resPrincipal.historialOrdenes?.map(item => ({
                nroOrden: item.nroOrden,
                dni: item.dni,
                empresa: item.empresa,
                contrata: item.contrata,
                fechaApertura: item.fechaApertura,
                aptitud: item.aptitud,
                sede: "Trujillo"
            }));
            setForm(prev => ({
                ...prev,
                norden: resPrincipal.norden ?? "",
                dni: resPrincipal.dniPaciente ?? "",
                nombres: `${resPrincipal.nombresPaciente ?? ""} ${resPrincipal.apellidosPaciente ?? ""}`,
                fechaNacimiento: formatearFechaCorta(resPrincipal.fechaNacimientoPaciente ?? ""),
                lugarNacimiento: resPrincipal.lugarNacimientoPaciente ?? "",
                edad: resPrincipal.edadPaciente ?? "",
                sexo: resPrincipal.sexoPaciente === "M" ? "MASCULINO" : resPrincipal.sexoPaciente === "F" ? "FEMENINO" : "",
                estadoCivil: resPrincipal.estadoCivilPaciente ?? "",
                nivelEstudios: resPrincipal.nivelEstudioPaciente ?? "",
                historialOrdenes: tablaTrujilloNormalizada ?? []
            }));
        }
        const urlHuamachuco = `/api/v01/local-huamachuco/seguimientoClinico/historial?dni=${resPrincipal.dniPaciente}`
        if (selectedSede === "HMAC") {
            LoadingDefault("Buscando en huamachuco...")
            const resHuamachuco = await getFetch(urlHuamachuco, token);
            const tablaHuamachuco = resHuamachuco.historialOrdenes ?? []
            const tablaHuamachucoNormalizada = tablaHuamachuco.map(item => ({
                nroOrden: item.norden,
                dni: item.dni,
                empresa: item.empresa,
                contrata: item.contrata,
                fechaApertura: item.fecha_apertura,
                aptitud: item.aptitud,
                sede: "Huamachuco"
            }));

            if (tablaHuamachucoNormalizada.length > 0) {
                setForm(prev => ({
                    ...prev,
                    historialOrdenes: [...(prev.historialOrdenes ?? []), ...tablaHuamachucoNormalizada]
                }));
            }

        }
        Swal.close()
        return resPrincipal ? resPrincipal.dniPaciente : ""

    } catch (error) {
        console.error("Error en Encontrar Norden:", error);
        Swal.fire(
            "Error",
            "Ocurrió un error al obtener los datos del Norden",
            "error"
        );
    }
};

export const getHistorialExamenes = async (
    nro,
    setForm,
    token,
    dni,
    selectedSede
) => {
    try {
        Loading("Buscando Registros de Exámenes");
        const urlPrincipal = `${obtenerHistorialExamenes}?${nro == "" ? "" : `&norden=${nro}`}`
        const urlHuamachuco = `/api/v01/local-huamachuco/seguimientoClinico/historialExamenes?dni=${dni}`
        const resPrincipal = await getFetch(urlPrincipal, token);

        if (resPrincipal) {
            const marcarSede = (arr, sede) => (arr ?? []).map(item => ({ ...item, sede }));

            setForm(prev => ({
                ...prev,
                resultadoExamenes: {
                    laboratorio: marcarSede(resPrincipal.laboratorio, "Trujillo"),
                    audiometria: marcarSede(resPrincipal.audiometria, "Trujillo"),
                    oftalmologia: marcarSede(resPrincipal.oftalmologia, "Trujillo"),
                    rayosX: marcarSede(resPrincipal.rayosX, "Trujillo"),
                },
            }));
        }

        if (selectedSede === "HMAC") {
            LoadingDefault("Buscando en huamachuco...")
            const resHuamachuco = await getFetch(urlHuamachuco, token);
            if (resHuamachuco) {
                const marcarSede = (arr, sede) => (arr ?? []).map(item => ({ ...item, sede }));

                setForm(prev => ({
                    ...prev,
                    resultadoExamenes: {
                        laboratorio: [...(prev.resultadoExamenes?.laboratorio ?? []), ...marcarSede(resHuamachuco.laboratorio, "Huamachuco")],
                        audiometria: [...(prev.resultadoExamenes?.audiometria ?? []), ...marcarSede(resHuamachuco.audiometria, "Huamachuco")],
                        oftalmologia: [...(prev.resultadoExamenes?.oftalmologia ?? []), ...marcarSede(resHuamachuco.oftalmologia, "Huamachuco")],
                        rayosX: [...(prev.resultadoExamenes?.rayosX ?? []), ...marcarSede(resHuamachuco.rayosX, "Huamachuco")],
                    }
                }));
            }

        }


        Swal.close();

    } catch (error) {
        console.error("Error en Encontrar Registros de Exámenes:", error);
        Swal.fire(
            "Error",
            "Ocurrió un error al obtener los registros de exámenes",
            "error"
        );
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};