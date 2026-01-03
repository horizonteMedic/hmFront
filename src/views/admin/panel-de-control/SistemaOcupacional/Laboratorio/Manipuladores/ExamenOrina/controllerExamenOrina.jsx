import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteOrina";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarLaboratorioClinicp";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
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
            fecha: res.fechaLab,

            codLabclinico: res.codLabclinico ?? "",

            nombreExamen: res.nombreExamen ?? "",
            dni: res.dni ?? "",

            nombres: res.nombres ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimiento ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            edad: res.edad ?? "",
            sexo: res.sexo === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivil,
            nivelEstudios: res.nivelEstudios,
            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacion,
            cargoDesempenar: res.cargo,

            //AGREGAR
            color: res.colorUrina ?? '',
            aspecto: res.aspecto ?? '',
            densidad: res.densidad ?? "",
            ph: res.ph ?? "",
            // Examen Químico
            nitritos: res.nitritos ?? '',
            proteinas: res.proteinas ?? '',
            cetonas: res.cetonas ?? '',
            leucocitosExamenQuimico: res.leucocitosEq ?? '',
            acAscorbico: res.acAscorbico ?? '',
            urobilinogeno: res.urobilinogeno ?? '',
            bilirrubina: res.bilirrubina ?? '',
            glucosaExamenQuimico: res.glucosa ?? '',
            sangre: res.sangre ?? '',
            // Sedimento
            leucocitosSedimentoUnitario: res.leucocitosSu ?? '',
            hematiesSedimentoUnitario: res.hematiesSu ?? '',
            celEpiteliales: res.celulasEpiteliales ?? '',
            cristales: res.cristales ?? '',
            cilindros: res.cilindros ?? '',
            bacterias: res.bacterias ?? '',
            gramSc: res.gramSC ?? '',
            otros: res.otros ?? '',

            user_medicoFirma: res.usuarioFirma,
        }));
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        norden: form.norden,
        fechaRegistro: form.fecha,
        codLabclinico: form.codLabclinico,
        tipoServicio: "",
        numTicket: 0,
        fechaLab: form.fecha,

        //ORINA
        txtColorEf: form.color,
        txtDensidadEf: form.densidad,
        txtAspectoEf: form.aspecto,
        txtPhEf: form.ph,
        //EXAMEN QUIMICO
        txtNitritosEq: form.nitritos,
        txtProteinasEq: form.proteinas,
        txtCetonasEq: form.cetonas,
        txtLeucocitosEq: form.leucocitosExamenQuimico,
        txtAcAscorbico: form.acAscorbico,
        txtUrobilinogenoEq: form.urobilinogeno,
        txtBilirrubinaEq: form.bilirrubina,
        txtGlucosaEq: form.glucosaExamenQuimico,
        txtSangreEq: form.sangre,
        //SEDIMIETNO
        txtLeucocitosSu: form.leucocitosSedimentoUnitario,
        txtCelEpitelialesSu: form.celEpiteliales,
        txtCilindrosSu: form.cilindros,
        txtBacteriasSu: form.bacterias,
        txtHematiesSu: form.hematiesSedimentoUnitario,
        txtCristalesSu: form.cristales,
        txtPusSu: form.gramSc,
        txtOtrosSu: form.otros,

        userMedicoOcup: "",
        userRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

export const PrintHojaR = (nro, token, tabla) => {
    const jasperModules = import.meta.glob(
        "../../../../../../jaspers/Inmunologia/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        null,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/Inmunologia"
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
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Examen de Orina",
                    "warning"
                );
            });
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
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
