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

const obtenerReporteUrl = "/api/v01/ct/transtornoPersonalidad/obtenerReporteTranstornoPersonalidad";
const registrarUrl = "/api/v01/ct/transtornoPersonalidad/registrarActualizarTranstornoPersonalidad";

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
            fecha: res.fechaRegistro,

            cumpleConPerfil: res.perfilCumple ?? false,

            nombreExamen: res.tipoExamen ?? "",
            dni: res.dniPaciente ?? "",

            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,
            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            paranoide: res.paranoideBajo ? "BAJO" : res.paranoideMedio ? "MEDIO" : res.paranoideAlto ? "ALTO" : "",
            esquizoide: res.esquizoideBajo ? "BAJO" : res.esquizoideMedio ? "MEDIO" : res.esquizoideAlto ? "ALTO" : "",
            esquizotipico: res.esquizoTipicoBajo ? "BAJO" : res.esquizoTipicoMedio ? "MEDIO" : res.esquizoTipicoAlto ? "ALTO" : "",
            inestabilidadImpulsivo: res.subtipoImpulsivoBajo ? "BAJO" : res.subtipoImpulsivoMedio ? "MEDIO" : res.subtipoImpulsivoAlto ? "ALTO" : "",
            inestabilidadLimite: res.subtipoLimiteBajo ? "BAJO" : res.subtipoLimiteMedio ? "MEDIO" : res.subtipoLimiteAto ? "ALTO" : "",

            histrionico: res.histrionicoBajo ? "BAJO" : res.histrionicoMedio ? "MEDIO" : res.histrionicoAlto ? "ALTO" : "",
            antisocial: res.antisocialBajo ? "BAJO" : res.antisocialMedio ? "MEDIO" : res.antisocialAlto ? "ALTO" : "",
            narcisista: res.narcicistaBajo ? "BAJO" : res.narcicistaMedio ? "MEDIO" : res.narcicistaAlto ? "ALTO" : "",

            anancastico: res.anancasticoBajo ? "BAJO" : res.anancasticoMedio ? "MEDIO" : res.anancasticoAlto ? "ALTO" : "",
            dependiente: res.dependienteBajo ? "BAJO" : res.dependienteMedio ? "MEDIO" : res.dependienteAlto ? "ALTO" : "",
            ansioso: res.ansiosoBajo ? "BAJO" : res.ansiosoMedio ? "MEDIO" : res.ansiosoAlto ? "ALTO" : "",

            analisisYResultados: res.analisisResultado ?? "",
            recomendaciones: res.recomendaciones ?? "",
            interpretacion: res.interpretacionParainoide ?? "",

            user_medicoFirma: res.usuarioFirma,
        }));
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    let mensajeError = ""
    if (!form.norden) {
        mensajeError = "Datos Incompletos"
    }
    else if (form.cumpleConPerfil == undefined || form.cumpleConPerfil == null) {
        mensajeError = "Datos Seleccione Cumple o No Cumple con el Perfil"
    }
    if (mensajeError != "") {
        await Swal.fire("Error", mensajeError, "error");
        return;
    }

    const body = {
        norden: form.norden,
        fechaRegistro: form.fecha,

        paranoideBajo: form.paranoide == "BAJO",
        paranoideMedio: form.paranoide == "MEDIO",
        paranoideAlto: form.paranoide == "ALTO",

        esquizoideBajo: form.esquizoide == "BAJO",
        esquizoideMedio: form.esquizoide == "MEDIO",
        esquizoideAlto: form.esquizoide == "ALTO",

        esquizoTipicoBajo: form.esquizotipico == "BAJO",
        esquizoTipicoMedio: form.esquizotipico == "MEDIO",
        esquizoTipicoAlto: form.esquizotipico == "ALTO",

        subtipoImpulsivoBajo: form.inestabilidadImpulsivo == "BAJO",
        subtipoImpulsivoMedio: form.inestabilidadImpulsivo == "MEDIO",
        subtipoImpulsivoAlto: form.inestabilidadImpulsivo == "ALTO",

        subtipoLimiteBajo: form.inestabilidadLimite == "BAJO",
        subtipoLimiteMedio: form.inestabilidadLimite == "MEDIO",
        subtipoLimiteAto: form.inestabilidadLimite == "ALTO",

        histrionicoBajo: form.histrionico == "BAJO",
        histrionicoMedio: form.histrionico == "MEDIO",
        histrionicoAlto: form.histrionico == "ALTO",

        antisocialBajo: form.antisocial == "BAJO",
        antisocialMedio: form.antisocial == "MEDIO",
        antisocialAlto: form.antisocial == "ALTO",

        narcicistaBajo: form.narcisista == "BAJO",
        narcicistaMedio: form.narcisista == "MEDIO",
        narcicistaAlto: form.narcisista == "ALTO",

        anancasticoBajo: form.anancastico == "BAJO",
        anancasticoMedio: form.anancastico == "MEDIO",
        anancasticoAlto: form.anancastico == "ALTO",

        dependienteBajo: form.dependiente == "BAJO",
        dependienteMedio: form.dependiente == "MEDIO",
        dependienteAlto: form.dependiente == "ALTO",

        ansiosoBajo: form.ansioso == "BAJO",
        ansiosoMedio: form.ansioso == "MEDIO",
        ansiosoAlto: form.ansioso == "ALTO",

        analisisResultado: form.analisisYResultados,
        recomendaciones: form.recomendaciones,
        perfilCumple: form.cumpleConPerfil,
        perfilNoCumple: !form.cumpleConPerfil,
        interpretacionParainoide: form.interpretacion,

        userRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

export const PrintHojaR = (nro, token, tabla) => {
    const jasperModules = import.meta.glob(
        "../../../../../../jaspers/ModuloPsicologia/PsicoTrastorPersonalidad/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        null,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/PsicoTrastorPersonalidad"
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
                    "Este paciente ya cuenta con registros de Trastorno de Personalidad",
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
