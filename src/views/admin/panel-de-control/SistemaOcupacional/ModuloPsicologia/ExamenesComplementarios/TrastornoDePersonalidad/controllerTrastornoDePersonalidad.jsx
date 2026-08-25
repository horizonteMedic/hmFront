import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
    imprimirReporteJasper,
} from "../../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/transtornoPersonalidad/obtenerReporteTranstornoPersonalidad";
const registrarUrl = "/api/v01/ct/transtornoPersonalidad/registrarActualizarTranstornoPersonalidad";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/PsicoTrastorPersonalidad/*.jsx");
const rutaReporte = "../../../../../../jaspers/ModuloPsicologia/PsicoTrastorPersonalidad/Informe_Psico_Test_Personalidad.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
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
            tieneRegistro: false,
        }));
    }
};

// ===== Mapeo Edición (registro existente) =====
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
        onFinish
    );
    if (!res) return;
    set((prev) => ({
        ...prev,
        norden: res.norden ?? "",
        fecha: res.fechaExamen,

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

        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fechaExamen: form.fecha,

    paranoideBajo: form.paranoide === "BAJO",
    paranoideMedio: form.paranoide === "MEDIO",
    paranoideAlto: form.paranoide === "ALTO",

    esquizoideBajo: form.esquizoide === "BAJO",
    esquizoideMedio: form.esquizoide === "MEDIO",
    esquizoideAlto: form.esquizoide === "ALTO",

    esquizoTipicoBajo: form.esquizotipico === "BAJO",
    esquizoTipicoMedio: form.esquizotipico === "MEDIO",
    esquizoTipicoAlto: form.esquizotipico === "ALTO",

    subtipoImpulsivoBajo: form.inestabilidadImpulsivo === "BAJO",
    subtipoImpulsivoMedio: form.inestabilidadImpulsivo === "MEDIO",
    subtipoImpulsivoAlto: form.inestabilidadImpulsivo === "ALTO",

    subtipoLimiteBajo: form.inestabilidadLimite === "BAJO",
    subtipoLimiteMedio: form.inestabilidadLimite === "MEDIO",
    subtipoLimiteAto: form.inestabilidadLimite === "ALTO",

    histrionicoBajo: form.histrionico === "BAJO",
    histrionicoMedio: form.histrionico === "MEDIO",
    histrionicoAlto: form.histrionico === "ALTO",

    antisocialBajo: form.antisocial === "BAJO",
    antisocialMedio: form.antisocial === "MEDIO",
    antisocialAlto: form.antisocial === "ALTO",

    narcicistaBajo: form.narcisista === "BAJO",
    narcicistaMedio: form.narcisista === "MEDIO",
    narcicistaAlto: form.narcisista === "ALTO",

    anancasticoBajo: form.anancastico === "BAJO",
    anancasticoMedio: form.anancastico === "MEDIO",
    anancasticoAlto: form.anancastico === "ALTO",

    dependienteBajo: form.dependiente === "BAJO",
    dependienteMedio: form.dependiente === "MEDIO",
    dependienteAlto: form.dependiente === "ALTO",

    ansiosoBajo: form.ansioso === "BAJO",
    ansiosoMedio: form.ansioso === "MEDIO",
    ansiosoAlto: form.ansioso === "ALTO",

    analisisResultado: form.analisisYResultados,
    recomendaciones: form.recomendaciones,
    perfilCumple: form.cumpleConPerfil,
    perfilNoCumple: !form.cumpleConPerfil,
    interpretacionParainoide: form.interpretacion,

    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). Este endpoint espera la clave "userRegistro"
// (el default de sellarAuditoria, sin override).
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    });

// ===== Validación de datos obligatorios =====
const datosCompletos = (form) => {
    if (form.cumpleConPerfil === undefined || form.cumpleConPerfil === null) {
        Swal.fire("Error", "Seleccione Cumple o No Cumple con el Perfil", "error");
        return false;
    }
    return true;
};

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter, sede) =>
    imprimirReporteJasper({
        nro,
        token,
        tabla,
        datosFooter,
        sede,
        obtenerReporteUrl,
        jasperModules,
        rutaModulo: rutaReporte,
    });

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) => {
    if (!datosCompletos(form)) return;
    return guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) => {
    if (!datosCompletos(form)) return;
    return actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });
};

// ===== Búsqueda / verificación por N° Orden =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        onNuevo: () => GetInfoServicio(nro, set, token, sede),
        onExistente: () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Trastorno de Personalidad.",
                });
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
