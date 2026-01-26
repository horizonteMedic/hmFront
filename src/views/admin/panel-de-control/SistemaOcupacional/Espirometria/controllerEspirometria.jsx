import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    handleSubirArchivoDefault,
    handleSubirArchivoDefaultSinSellos,
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
            user_doctorAsignado: res.doctorAsignado,
            user_doctorExtra: res.doctorExtra,
            SubirDoc: true,
            digitalizacion: res.digitalizacion
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

        usuarioRegistro: user,
        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
        doctorExtra: form.user_doctorExtra,

    };
    console.log(body)
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
    const coordenadas = {
        FIRMA: { x: 40, y: 750, width: 120, height: 60 },
        HUELLA: { x: 180, y: 750, width: 60, height: 60 },
        SELLOFIRMA: { x: 220, y: 700, width: 100, height: 60 },
        SELLOFIRMADOCASIG: { x: 340, y: 700, width: 100, height: 60 },
        "SELLOFIRMADOCASIG-EXTRA": { x: 460, y: 700, width: 100, height: 60 },
    };
    handleSubirArchivoDefault(form, selectedSede, registrarPDF, userlogued, token, coordenadas)
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