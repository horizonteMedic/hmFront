import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRJsReportDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/ct/ministerioEnergiaMinas/obtenerReporte";
const obtenerReporteJsReportUrl = "/api/v01/ct/ministerioEnergiaMinas/descargarReporteMinisterioEnergiaMinas";
const registrarUrl =
    "/api/v01/ct/ministerioEnergiaMinas/registrarActualizar";


export const GetInfoServicio = async (
    nro,
    set,
    token,
    sede
) => {
    const res = await GetInfoPacDefault(
        nro,
        token,
        sede
    );
    console.log(res)
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fechaExam: prev.fechaExam ?? "",
            // Datos personales
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",
            dni: res.dni ?? "",
            edad: res.edad ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: res.cargo ?? "",
            ocupacion: res.areaO ?? "",
            usuarioFirma: res.user_medicoFirma,
        }));
    }
};

export const GetInfoServicioEditar = async (
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
        onFinish,
        true
    );
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            ...res,
            // Header
            norden: res.norden ?? "",
            fechaExam: res.fechaExamen ?? "",
            tipoExamen: res.nombreExamen ?? "",
            // Datos personales
            nombres: res.nombreCompletoPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: res.cargoPaciente ?? "",
            ocupacion: res.ocupacionPaciente ?? "",

            //EXAMEN MEDICO

            // observacion
            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
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
        "norden": form.norden,
        "fechaExamen": form.fechaExamen,
        "userRegistro": user,
        usuarioFirma: form.user_medicoFirma,

        "colorPiel": form.colorPiel,
        "colorOjos": form.colorOjos,
        "cabello": form.cabello,

        //1
        "asma": form.asma,
        "alergias": form.alergias,
        "bronquitis": form.bronquitis,
        "pleuresia": form.pleuresia,
        "neumonia": form.neumonia,
        "respiracion": form.respiracion,
        "sangreSaliva": form.sangreSaliva,
        "respiracionBreve": form.respiracionBreve,
        "problemasNasales": form.problemasNasales,
        "tbc": form.tbc,
        "fuma": form.fuma,

        //2
        "palpitaciones": form.palpitaciones,
        "ritmoCardiacoIrregular": form.ritmoCardiacoIrregular,
        "fallasCardiacas": form.fallasCardiacas,
        "desmayos": form.desmayos,
        "tobillosHinchados": form.tobillosHinchados,
        "moretonesAnormales": form.moretonesAnormales,
        "presionAlta": form.presionAlta,
        "heridasPecho": form.heridasPecho,
        "otrasEnfermedades": form.otrasEnfermedades,
        "tomaMedicina": form.tomaMedicina,

        //DETALLES
        //EXAMEN MEDICO
        "pulsoReposo": form.pulsoReposo,
        "pulsoReposoBp": form.pulsoReposoBp,
        "pulso30flexiones": form.pulso30flexiones,
        "respiracionReposo": form.respiracionReposo,
        "respiracion30flexiones": form.respiracion30flexiones,
        "obstruccionNasal": form.obstruccionNasal,
        "formaPecho": form.formaPecho,
        "expansionPecho": form.expansionPecho,
        "enfermedadesCronicas": form.enfermedadesCronicas,
        "enForma": form.enForma,

        "pechoNormal": form.pechoNormal,
        "tbcRayosX": form.tbcRayosX,
        "pneumoconiosis": form.pneumoconiosis,
        "clasificacionOit": form.clasificacionOit,
        "corazonRayosX": form.corazonRayosX,
        "otrosCambios": form.otrosCambios,
        "hallazgosAnormales": form.hallazgosAnormales,
        "opinionClinica": form.opinionClinica,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

export const PrintHojaR = (nro, token, tabla) => {
    PrintHojaRJsReportDefault(
        nro,
        token,
        tabla,
        obtenerReporteJsReportUrl
    );
};
export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Ministerio Energia y Minas",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje.",
                "warning"
            );
        }
    );
};


export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};