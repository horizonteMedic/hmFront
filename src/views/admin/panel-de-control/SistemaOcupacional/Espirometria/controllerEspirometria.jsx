import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    SubmitDataServiceDefault,
    VerifyTRPerzonalizadoDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/espirometria/obtenerReporteEspirometria";
const registrarUrl =
    "/api/v01/ct/espirometria/registrarActualizarEspirometria";
const registrarPDF =
    "/api/v01/ct/archivos/archivoInterconsulta"

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fecha: res.fechaAbs,

            nombreExamen: res.tipoExamen ?? "",
            dni: res.dniPaciente ?? "",

            nombres: res.nombres ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            edad: res.edad ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,
            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            codExam: res.codExam,
            codAbs: res.codAbs,
            pasoExamen:
                res.fvc == "N/A" &&
                res.fev1 == "N/A" &&
                res.fev1Fvc == "N/A" &&
                res.fef2575 == "N/A" &&
                res.interpretacion == "NO SE REALIZÓ ESPIROMETRÍA",
            fvc: res.fvc,
            fev1: res.fev1,
            fev1_fvc: res.fev1Fvc,
            fef: res.fef2575,
            peso: res.peso,
            talla: res.talla,
            sistolica: res.sistolica,
            diastolica: res.diastolica,
            fvcTeorico: res.fvcTeorico,
            fev1Teorico: res.fev1Teorico,
            interpretacion: res.interpretacion,

            user_medicoFirma: res.usuarioFirma,
            SubirDoc: true
        }));
    }
};

export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        norden: form.norden,
        fechaAbs: form.fecha,
        codAbs: form.codAbs,
        codExam: form.codExam,

        fvc: form.fvc,
        fev1: form.fev1,
        fev1Fvc: form.fev1_fvc,
        fef2575: form.fef,
        interpretacion: form.interpretacion,
        fvcTeorico: form.fvcTeorico,
        fev1Teorico: form.fev1Teorico,

        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        Swal.fire({
            title: "Éxito",
            text: "Se registró o actualizó con éxito",
            icon: "success",
            confirmButtonColor: "#3085d6",
        });
    }, false);
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRPerzonalizadoDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Espirometria",
                    "warning"
                );
            });
        },
        () => {
            //Necesita
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje.",
                "warning"
            );
        }
    );
};

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            sistolica: res.sistolica,
            diastolica: res.diastolica,
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

export const handleSubirArchivoEspirometria = async (form, selectedSede, userlogued, token) => {
    const { value: file } = await Swal.fire({
        title: "Selecciona un archivo PDF",
        input: "file",
        inputAttributes: {
            accept: "application/pdf", // solo PDF
            "aria-label": "Sube tu archivo en formato PDF"
        },
        showCancelButton: true,
        confirmButtonText: "Subir",
        cancelButtonText: "Cancelar",
        inputValidator: (file) => {
            if (!file) return "Debes seleccionar un archivo.";
            if (file.type !== "application/pdf") return "Solo se permiten archivos PDF.";
        },
    });
    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2);

    if (file) {
        // Puedes convertirlo a Base64 si lo necesitas
        const reader = new FileReader();
        reader.onload = async (e) => {
            LoadingDefault("Subiendo documento")
            const base64WithoutHeader = e.target.result.split(',')[1];
            const datos = {
                rutaArchivo: null,
                dni: null,
                historiaClinica: null,
                servidor: "azure",
                estado: true,
                fechaRegistro: `${year}-${month}-${day}`,
                userRegistro: userlogued,
                fechaActualizacion: null,
                userActualizacion: null,
                id_tipo_archivo: null,

                nombreArchivo: file.name,
                codigoSede: selectedSede,
                fileBase64: base64WithoutHeader,
                nomenclatura_tipo_archivo: form.nomenclatura,
                orden: form.norden,
                indice_carga_masiva: undefined,
            };

            const response = await SubmitData(datos, registrarPDF, token);
            console.log(response)
            if (response.id === 1) {

                Swal.fire("Exito", "Archivo Subido con exto", "success")
            } else {
                Swal.fire("Error", "No se pudo subir", "error")
            }
        };
        reader.readAsDataURL(file);
    }
};

export const ReadArchivosFormEspirometria = async (form, setVisualerOpen, token) => {
    LoadingDefault("Cargando Interconsulta")
    getFetch(`/api/v01/st/registros/detalleUrlArchivos/${form.norden}/${form.nomenclatura}`, token)
        .then(response => {
            console.log(response)
            if (response.id === 1) {
                setVisualerOpen(response)

                Swal.close()
            } else {
                Swal.fire("Error", "No Existe reporte para este Numero de Orden", "error")
            }
        })
        .catch(error => {
            Swal.fire("Error", "Ocurrio un Error al visualizar la interconsulta", "error")
            throw new Error('Network response was not ok.', error);
        })
}