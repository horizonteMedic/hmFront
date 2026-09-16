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
import { convertirGenero } from "../../../../../../utils/helpers";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/psicologiaEspaciosConfinados/obtenerReportePsicologiaEspaciosConfinados";
const registrarUrl =
    "/api/v01/ct/psicologiaEspaciosConfinados/registrarActualizarPsicologiaEspaciosConfinados";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformeEspaciosConfinados/*.jsx");
const rutaReporte = "../../../../../../jaspers/ModuloPsicologia/InformeEspaciosConfinados/formatPsicologia_SuficienciaEspaciosC.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            nombreExamen: res.nomExam ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            ocupacion: res.areaO ?? "",

            nombres: (res.nombres + " " + res.apellidos) ?? "",
            edad: res.edad ? `${res.edad} AÑOS` : "",
            sexo: convertirGenero(res.genero) ?? "",
            dni: res.dni ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",

            domicilioActual: res.direccion ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",

            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            cargoDesempenar: res.cargo ?? "",
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
        norden: res.norden,
        fechaExamen: res.fecha,
        nombreExamen: res.nombreExamen ?? "",
        esApto: res.apto === true ? true : false,

        // Datos Personales - Columna Izquierda
        nombres: (res.nombresPaciente + " " + res.apellidosPaciente) ?? "",
        edad: res.edadPaciente ? `${res.edadPaciente} AÑOS` : "",
        sexo: convertirGenero(res.sexoPaciente) ?? "",
        dni: res.dniPaciente ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente) ?? "",
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",

        // Datos Personales - Columna Derecha
        domicilioActual: res.direccionPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",

        // Datos Laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",

        // Criterios Psicológicos - Aspecto Intelectual
        razonamiento:
            res.razonamientoI ? "I" : res.razonamientoNPI ? "NPI" : res.razonamientoNP ? "NP" : res.razonamientoNPS ? "NPS" : res.razonamientoS ? "S" : "",
        memoria:
            res.memoriaI ? "I" : res.memoriaNPI ? "NPI" : res.memoriaNP ? "NP" : res.memoriaNPS ? "NPS" : res.memoriaS ? "S" : "",
        atencionConcentracion:
            res.atencionI ? "I" : res.atencioNPI ? "NPI" : res.atencionNP ? "NP" : res.atencionNPS ? "NPS" : res.atencionS ? "S" : "",
        coordinacionVisoMotora:
            res.visoMotoraI ? "I" : res.visoMotoraNPI ? "NPI" : res.visoMotoraNP ? "NP" : res.visoMotoraNPS ? "NPS" : res.visoMotoraS ? "S" : "",
        orientacionEspacial:
            res.orientacionEspacialI ? "I" : res.orientacionEspacialNPI ? "NPI" : res.orientacionEspacialNP ? "NP" : res.orientacionEspacialNPS ? "NPS" : res.orientacionEspacialS ? "S" : "",

        // Criterios Psicológicos - Aspectos Personalidad
        estabilidadEmocional:
            res.estabilidadEmocionalInestable ? "INESTABLE" : res.estabilidadEmocionalEstable ? "ESTABLE" : "",
        nivelAnsiedadGeneral:
            res.ansiedadGeneralCaso ? "CASO" : res.ansiedadGeneralNoCaso ? "NO_CASO" : "",
        ansiedadEspaciosConfinados:
            res.ansiedadEspaciosConfinadosNada ? "NADA" :
                res.ansiedadEspaciosConfinadosPoca ? "POCA_ANSIEDAD" :
                    res.ansiedadEspaciosConfinadosModerada ? "MODERADAMENTE_ANSIOSO" :
                        res.ansiedadEspaciosConfinadosElevada ? "ELEVADAMENTE_ANSIOSO" : "",

        // Análisis y Resultados
        analisisResultados: res.analisis ?? "",
        recomendaciones: res.recomendacion ?? "",

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
    fecha: form.fechaExamen,
    razonamientoI: form.razonamiento === "I",
    razonamientoNPI: form.razonamiento === "NPI",
    razonamientoNP: form.razonamiento === "NP",
    razonamientoNPS: form.razonamiento === "NPS",
    razonamientoS: form.razonamiento === "S",
    memoriaI: form.memoria === "I",
    memoriaNPI: form.memoria === "NPI",
    memoriaNP: form.memoria === "NP",
    memoriaNPS: form.memoria === "NPS",
    memoriaS: form.memoria === "S",
    atencionI: form.atencionConcentracion === "I",
    atencioNPI: form.atencionConcentracion === "NPI",
    atencionNP: form.atencionConcentracion === "NP",
    atencionNPS: form.atencionConcentracion === "NPS",
    atencionS: form.atencionConcentracion === "S",
    visoMotoraI: form.coordinacionVisoMotora === "I",
    visoMotoraNPI: form.coordinacionVisoMotora === "NPI",
    visoMotoraNP: form.coordinacionVisoMotora === "NP",
    visoMotoraNPS: form.coordinacionVisoMotora === "NPS",
    visoMotoraS: form.coordinacionVisoMotora === "S",
    orientacionEspacialI: form.orientacionEspacial === "I",
    orientacionEspacialNPI: form.orientacionEspacial === "NPI",
    orientacionEspacialNP: form.orientacionEspacial === "NP",
    orientacionEspacialNPS: form.orientacionEspacial === "NPS",
    orientacionEspacialS: form.orientacionEspacial === "S",
    estabilidadEmocionalInestable: form.estabilidadEmocional === "INESTABLE",
    estabilidadEmocionalEstable: form.estabilidadEmocional === "ESTABLE",
    ansiedadGeneralCaso: form.nivelAnsiedadGeneral === "CASO",
    ansiedadGeneralNoCaso: form.nivelAnsiedadGeneral === "NO_CASO",
    ansiedadEspaciosConfinadosNada: form.ansiedadEspaciosConfinados === "NADA",
    ansiedadEspaciosConfinadosPoca: form.ansiedadEspaciosConfinados === "POCA_ANSIEDAD",
    ansiedadEspaciosConfinadosModerada: form.ansiedadEspaciosConfinados === "MODERADAMENTE_ANSIOSO",
    ansiedadEspaciosConfinadosElevada: form.ansiedadEspaciosConfinados === "ELEVADAMENTE_ANSIOSO",
    apto: form.esApto === true,
    noApto: form.esApto === false,
    analisis: form.analisisResultados,
    recomendacion: form.recomendaciones,
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). El backend de este módulo espera la
// clave "usuarioRegistro" (no "userRegistro") para el usuario que registra.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistro",
    });

// ===== Validación de datos obligatorios =====
const datosCompletos = (form) => {
    if (form.esApto === undefined || form.esApto === null) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, marque si es apto o no apto.",
        });
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
                    html: "Este paciente ya cuenta con registros de Examen de Espacio Confinado.",
                });
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
