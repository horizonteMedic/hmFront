import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    handleSubidaMasiva,
    handleSubirArchivoDefaultSinSellos,
    LoadingDefault,
    ReadArchivosFormDefault,
    VerifyTRPerzonalizadoDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";
import { sellarAuditoria } from "../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    validarSede,
} from "../../../../utils/registroOcupacionalUtils";

const EMPRESA_OHLA = "OBRASCON HUARTE LAIN S.A";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/espirometria/obtenerReporteEspirometria";
const registrarUrl =
    "/api/v01/ct/espirometria/registrarActualizarEspirometria";
const registrarPDF =
    "/api/v01/ct/archivos/archivoInterconsulta";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (!res || res.error || !res.norden) {
        Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
            html: `No se encontró ningún registro con el N° Orden ${nro}.`,
        });
        return;
    }
    set((prev) => ({
        ...prev,
        norden: res.norden ?? "",
        esOHLA: res.empresa === EMPRESA_OHLA,
        nombres: res.nombresApellidos ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
        edad: res.edad ?? "",
        lugarNacimiento: res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudios ?? "",
        dni: res.dni ?? "",
        sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.areaO ?? "",
        cargoDesempenar: res.cargo ?? "",
        nombreExamen: res.nomExam ?? "",
        sistolica: res.sistolica ?? "",
        diastolica: res.diastolica ?? "",
        tieneRegistro: false,
    }));
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
        fecha: res.fechaAbs,

        nombreExamen: res.tipoExamen ?? "",
        dni: res.dniPaciente ?? "",

        nombres: res.nombres ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        edad: res.edad ?? "",
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        // Datos Laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",

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
        interpretacionCie10: res.interpretacionCie10,

        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: res.doctorAsignado,
        user_doctorExtra: res.doctorExtra,
        SubirDoc: true,
        digitalizacion: res.digitalizacion,

        // Cuestionario Platino - Espirometría (OHLA)
        esOHLA: res.esOHLA,
        ohlaCirugiaPulmonToraxAbdomen: res.ohlaCirugiaPulmonToraxAbdomen ?? null,
        ohlaInfartoCorazon: res.ohlaInfartoCorazon ?? null,
        ohlaDesprendimientoRetina: res.ohlaDesprendimientoRetina ?? null,
        ohlaHospitalizadoCorazon: res.ohlaHospitalizadoCorazon ?? null,
        ohlaMedicamentoTuberculosis: res.ohlaMedicamentoTuberculosis ?? null,
        ohlaEmbarazada: res.ohlaEmbarazada ?? null,
        pulso: res.pulso ?? "",
        ohlaInfeccionRespiratoria: res.ohlaInfeccionRespiratoria ?? null,
        ohlaUsoMedicamentoRespiracion: res.ohlaUsoMedicamentoRespiracion ?? null,
        ohlaFumoCigarro: res.ohlaFumoCigarro ?? null,
        ohlaFumoCigarroCuantos: res.ohlaFumoCigarroCuantos ?? "",
        ohlaEjercicioFisico: res.ohlaEjercicioFisico ?? null,
        ohlaResultadoPrueba: res.ohlaResultadoPrueba ?? "",

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fechaAbs: form.fecha,
    codAbs: form.codAbs,
    codExam: form.codExam,

    fvc: form.fvc,
    fev1: form.fev1,
    fev1Fvc: form.fev1_fvc,
    fef2575: form.fef,
    interpretacion: form.interpretacion,
    interpretacionCie10: form.interpretacionCie10,
    fvcTeorico: form.fvcTeorico,
    fev1Teorico: form.fev1Teorico,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
    doctorExtra: form.user_doctorExtra,

    esOHLA: form.esOHLA,
    ohlaCirugiaPulmonToraxAbdomen: form.ohlaCirugiaPulmonToraxAbdomen,
    ohlaInfartoCorazon: form.ohlaInfartoCorazon,
    ohlaDesprendimientoRetina: form.ohlaDesprendimientoRetina,
    ohlaHospitalizadoCorazon: form.ohlaHospitalizadoCorazon,
    ohlaMedicamentoTuberculosis: form.ohlaMedicamentoTuberculosis,
    ohlaEmbarazada: form.ohlaEmbarazada,
    pulso: form.pulso,
    ohlaInfeccionRespiratoria: form.ohlaInfeccionRespiratoria,
    ohlaUsoMedicamentoRespiracion: form.ohlaUsoMedicamentoRespiracion,
    ohlaFumoCigarro: form.ohlaFumoCigarro,
    ohlaFumoCigarroCuantos: form.ohlaFumoCigarroCuantos,
    ohlaEjercicioFisico: form.ohlaEjercicioFisico,
    ohlaResultadoPrueba: form.ohlaResultadoPrueba,
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

// ===== Impresión (solo formato OHLA / Cuestionario Platino) =====
export const PrintHojaR = (nro, token, tabla) => {
    Loading("Cargando Formato a Imprimir");
    getFetch(
        `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
        token
    ).then(async (res) => {
        if (res?.norden) {
            if (!res.esOHLA) {
                Swal.fire(
                    "Alerta",
                    "El paciente no cuenta con registros de cuestionario.",
                    "warning"
                );
                return;
            }
            const nombre = "Espirometria_OHLA_Digitalizado";
            const jasperModules = import.meta.glob("../../../../jaspers/Espirometria/*.jsx");
            const modulo = await jasperModules[`../../../../jaspers/Espirometria/${nombre}.jsx`]();
            if (typeof modulo.default === "function") {
                modulo.default(res);
            } else {
                console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
            }
            Swal.close();
        } else {
            Swal.close();
        }
    });
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Búsqueda / verificación por N° Orden =====
// VerifyTRPerzonalizadoDefault (3 estados: nuevo / existente / necesita Triaje),
// anteponiendo la validación de sede como el resto de formularios de la plantilla.
export const VerifyTR = async (nro, tabla, token, set, sede) => {
    if (!nro) {
        await Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-keyboard"></i>Error',
            html: "Debe Introducir un N° Orden válido",
        });
        return;
    }

    LoadingDefault("Validando datos");

    if (sede) {
        const { estado, descripcionSede } = await validarSede(nro, sede, token);
        if (estado === "otraSede") {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                html: `El N° Orden ${nro} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.`,
            });
            return;
        }
        if (estado !== "ok") {
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
                html: `Verifique el número de orden ${nro} e intente nuevamente.`,
            });
            return;
        }
    }

    VerifyTRPerzonalizadoDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => GetInfoServicio(nro, set, token, sede),
        () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Espirometría.",
                });
            }),
        () => {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-eye"></i>Alerta',
                html: "El paciente necesita pasar por Triaje.",
            });
        }
    );
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

export const handleSubirArchivoEspirometria = async (form, selectedSede, userlogued, token) => {
    handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token);
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
    ReadArchivosFormDefault(form, setVisualerOpen, token);
};

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token) => {
    handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token);
};
