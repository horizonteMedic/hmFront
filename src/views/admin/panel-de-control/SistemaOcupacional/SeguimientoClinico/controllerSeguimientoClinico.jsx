import Swal from "sweetalert2";
import { getFetch } from "../../../../utils/apiHelpers";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { LoadingDefault } from "../../../../utils/functionUtils";

const obtenerReporteUrl =
    "/api/v01/st/registros/historial";

export const searchByNorden = (
    nro,
    setForm,
    token
) => {
    try {
        Loading("Buscando Registros");
        getFetch(`${obtenerReporteUrl}?${nro == "" ? "" : `&norden=${nro}`}`, token)
            .then((res) => {
                if (res) {
                    setForm(prev => ({
                        ...prev,
                        norden: res.norden ?? "",

                        dni: res.dniPaciente ?? "",

                        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
                        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
                        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
                        edad: res.edadPaciente ?? "",
                        sexo: res.sexoPaciente === "M" ? "MASCULINO" : res.sexoPaciente === "F" ? "FEMENINO" : "",
                        estadoCivil: res.estadoCivilPaciente ?? "",
                        nivelEstudios: res.nivelEstudioPaciente ?? "",
                        historialOrdenes: res.historialOrdenes ?? [],
                    }));
                }
                Swal.close();
            });
    } catch (error) {
        console.error("Error en Encontrar Norden:", error);
        Swal.fire(
            "Error",
            "Ocurrió un error al obtener los datos del Norden",
            "error"
        );
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};