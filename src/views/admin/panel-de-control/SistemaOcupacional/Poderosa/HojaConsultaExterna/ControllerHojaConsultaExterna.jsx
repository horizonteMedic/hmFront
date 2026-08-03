import Swal from "sweetalert2";
import {
    GetInfoServicioDefault, 
    VerifyTRPerzonalizadoDefault,
    LoadingDefault,
} from "../../../../../utils/functionUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    validarSede,
    imprimirReporteJasper,
} from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/hojaConsultaExterna/obtenerReporteHojaConsultaExterna";
const registrarUrl = "/api/v01/ct/hojaConsultaExterna/registrarActualizarHojaConsultaExterna";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/HojaConsultaExterna/*.jsx");
const rutaReporte = "../../../../../jaspers/HojaConsultaExterna/Hoja_Consulta_Externa.jsx";

// ===== Observaciones auto-generadas a partir del Anexo 16 =====
const generarObservaciones = (res) =>
    `A- ANAMNESIS: COLABORADOR REFIERE SENTIRSE BIEN, SIN PROBLEMAS DE SALUD, NO practica deporte o deporte de alto rendimiento.
B- ANTECEDENTES PERSONALES: ${res.anexo16AntecedentesPersonales2 || "SIN DATOS."}
C- ANTECEDENTES FAMILIARES: ${res.anexo16AntecedentesFamiliares || "JALARLO DEL ANEXO 16."},
D- EXAMEN FISICO:
- ABEG, LOTEP, CAMINANDO NORMALMENTE. VENTILANDO ESPONTANEAMENTE
- CABEZA: NORMOCÉFALO, CENTRAL, MÓVIL, PUPILAS ISOCÓRICAS, FOTO REACTIVAS. NO SE PALPA MASAS NI DEPRESIONES.
- BOCA: HUMEDA, LENGUA MÓVIL, CENTRAL, NO SE EVIDENCIA LESIONES,
- CUELLO: CENTRAL, MÓVIL, NO TUMORACIONES.
- TÓRAX: BPMV EN ACP, NO RALES.
- CARDIOVASCULAR: RCRR, NO SOPLOS. PULSOS PERIFERICOS PALPABLES
- ABDOMEN: PLANO, RHA PRESENTES, NO DOLOR A LA PALPACIÓN SUPERFICIAL NI PROFUNDA, NO SE PALPA MASAS NI TUMORACIONES.
- RENAL: SIGNO PUÑO PERCUSIÓN BILATERAL NEGATIVO,
- UROLÓGICO: PUNTOS RENOURETERALES NEGATIVOS.
- COLUMNA VERTEBRAL: CENTRAL, CURVATURAS CONSERVADAS, MOVILIDAD CONSERVADA.
- SISTEMA OSTEOMUSCULAR: MOTRICIDAD CONSERVADA. EXTREMIDADES SIMÉTRICAS. FUERZA MUSCULAR 5/5.
- GENITALES: DIFERIDO
- SISTEMA NERVIOSO: SENSIBILIDAD, MOTRICIDAD CONSERVADA, ROTS CONSERVADOS, BIPEDESTACIÓN CONSERVADA, EQUILIBRIO CONSERVADO, ROMBERG NEGATIVO. NO SIGNOS MENÍNGEOS. NO SIGNOS DE FOCALIZACION, NERVIOS CRANEALES CONSERVADOS, GLASGLOW 15 PTOS.
E- EXÁMENES AUXILIARES: \n${res.anexo16OtrosExamenes || "JALARLO DE LOS EXÁMENES DE LABORATORIO."}
F- DIAGNÓSTICOS: \n${res.anexo16ObservacionesGenerales || "JALARLO DE LOS DIAGNÓSTICOS DEL ANEXO 16."}`;

// ===== Mapeo Registro nuevo =====
export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;
    set((prev) => ({
        ...prev,
        norden: res.norden ?? prev.norden,
        nombreExamen: res.nombreExamen ?? "",
        // fechaExamen: res.fechaExamen ?? prev.fechaExamen,
        // Datos personales
        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ?? "",
        sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",
        // Observaciones auto-generadas desde el Anexo 16 (aún no hay observaciones guardadas)
        observaciones: generarObservaciones(res),
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;
    set((prev) => ({
        ...prev,
        norden: res.norden ?? prev.norden,
        nombreExamen: res.nombreExamen ?? prev.nombreExamen,
 
        fechaExamen: res.fechaExamen ?? prev.fechaExamen,
        horaSalida: res.horaSalida ?? prev.horaSalida,       // Datos personales
        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
        sexo: res.sexoPaciente === "F" ? "FEMENINO" : "MASCULINO",
        edad: res.edadPaciente ?? "",
        dni: res.dniPaciente ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",
        // Caja
        cajon: res.paraiso ? "PARAISO" : res.postaVijus ? "POSTA VIJUS" : res.cedro ? "CEDRO" : res.otros ? "OTROS" : "",
        otrosDescripcion: res.otrosDescripcion ?? "",
        // Observaciones guardadas + recálculo de la versión auto (Anexo 16) para comparar
        observaciones: res.observaciones ?? "",
        observacionesAuto: generarObservaciones(res),
        // Médico que certifica
        nombre_medico: res.nombreMedico ?? prev.nombre_medico,
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        // La creación se conserva para reenviarla al editar y que el backend no la borre.
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
    dni: form.dni,
    fechaExamen: form.fechaExamen,
    horaSalida: getHoraActual(),
    nombreMedico: form.nombre_medico,
    postaVijus: form.cajon === "POSTA VIJUS",
    cedro: form.cajon === "CEDRO",
    paraiso: form.cajon === "PARAISO",
    otros: form.cajon === "OTROS",
    otrosDescripcion: form.otrosDescripcion,
    observaciones: form.observaciones,
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización).
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    });

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
// A diferencia del patrón binario nuevo/existente (verificarRegistro), esta ficha exige que el
// paciente tenga un Anexo 16 cerrado antes de poder registrarse. Se reutiliza el
// VerifyTRPerzonalizadoDefault ya compartido (3 estados: nuevo / existente / necesita examen) y
// se le antepone la validación de sede, igual que en el resto de formularios Poderosa.
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
        () => GetInfoServicio(nro, tabla, set, token, () => Swal.close()),
        () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Consulta Externa",
                });
            }),
        () => {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-notes-medical"></i>Alerta',
                html: "El paciente necesita tener un registro de ANEXO 16 cerrado.",
            });
        }
    );
  
};