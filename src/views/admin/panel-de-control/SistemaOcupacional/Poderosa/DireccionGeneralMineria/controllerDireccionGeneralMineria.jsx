import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    VerifyTRPerzonalizadoDefault,
    LoadingDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../../utils/helpers";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    validarSede,
    imprimirReporteJasper,
} from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/ministerioEnergiaMinas/obtenerReporte";
const registrarUrl = "/api/v01/ct/ministerioEnergiaMinas/registrarActualizar";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
const rutaReporte = "../../../../../jaspers/Poderosa/ENERGIAYMINAS.jsx";

// ===== Mapeo Registro nuevo =====
// A diferencia de otros formularios Poderosa, este examen no consulta "busquedaPorFiltros":
// usa directamente el reporte agregado (el backend ya devuelve los datos básicos del paciente
// aunque aún no exista una fila propia en "ministerio_energia_minas"). Solo se cargan los datos
// de identificación/triaje; el detalle médico/radiológico queda en blanco para llenar.
export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish, true);
    if (!res) return;
    set((prev) => ({
        ...prev,
        // Header
        norden: res.norden ?? "",
        fechaExamen: res.fechaExamen ?? prev.fechaExamen,
        tipoExamen: res.tipoExamen ?? "",
        // Datos personales
        nombres: res.nombreCompletoPaciente ?? "",
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        sexo: convertirGenero(res.sexoPaciente),
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",
        // Datos de Triaje (solo lectura)
        fechaNacimientoPaciente: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        peso: res.peso ?? "",
        talla: res.talla ?? "",
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish, true);
    if (!res) return;
    set((prev) => ({
        ...prev,
        // Header
        norden: res.norden ?? "",
        fechaExamen: res.fechaExamen ?? prev.fechaExamen,
        tipoExamen: res.tipoExamen ?? "",
        // Datos personales
        nombres: res.nombreCompletoPaciente ?? "",
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        sexo: convertirGenero(res.sexoPaciente),
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",

        // Exámen médico (datos básicos, de Triaje)
        fechaNacimientoPaciente: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        peso: res.peso ?? "",
        talla: res.talla ?? "",
        colorPiel: res.colorPiel ?? "",
        colorOjos: res.colorOjos ?? "",
        cabello: res.cabello ?? "",

        // Factores hereditarios (1)
        asma: res.asma ?? false,
        alergias: res.alergias ?? false,
        bronquitis: res.bronquitis ?? false,
        pleuresia: res.pleuresia ?? false,
        neumonia: res.neumonia ?? false,
        respiracion: res.respiracion ?? false,
        sangreSaliva: res.sangreSaliva ?? false,
        respiracionBreve: res.respiracionBreve ?? false,
        problemasNasales: res.problemasNasales ?? false,
        tbc: res.tbc ?? false,
        fuma: res.fuma ?? false,

        // Factores hereditarios (2) / Cáncer pulmonar
        palpitaciones: res.palpitaciones ?? false,
        ritmoCardiacoIrregular: res.ritmoCardiacoIrregular ?? false,
        fallasCardiacas: res.fallasCardiacas ?? false,
        desmayos: res.desmayos ?? false,
        tobillosHinchados: res.tobillosHinchados ?? false,
        moretonesAnormales: res.moretonesAnormales ?? false,
        presionAlta: res.presionAlta ?? false,
        heridasPecho: res.heridasPecho ?? false,
        otrasEnfermedades: res.otrasEnfermedades ?? false,
        tomaMedicina: res.tomaMedicina ?? false,

        // Detalles - Exámen médico
        pulsoReposo: res.pulsoReposo ?? "",
        pulsoReposoBp: res.pulsoReposoBp ?? "",
        pulso30flexiones: res.pulso30flexiones ?? "",
        respiracionReposo: res.respiracionReposo ?? "",
        respiracion30flexiones: res.respiracion30flexiones ?? "",
        obstruccionNasal: res.obstruccionNasal ?? false,
        formaPecho: res.formaPecho ?? "",
        expansionPecho: res.expansionPecho ?? "",
        pulmones: res.pulmones ?? "",
        corazon: res.corazon ?? "",
        enfermedadesCronicas: res.enfermedadesCronicas ?? "",
        funcionPulmonar: res.funcionPulmonar ?? "",
        fvc: res.fvc ?? "",
        fevl: res.fevl ?? "",
        otros: res.otros ?? "",
        enForma: res.enForma ?? false,

        // Detalles - Rayos X
        fechaPlaca: res.fechaPlaca ?? "",
        pechoNormal: res.pechoNormal ?? "",
        tbcRayosX: res.tbcRayosX ?? "",
        pneumoconiosis: res.pneumoconiosis ?? "",
        clasificacionOit: res.clasificacionOit ?? "",
        filmNumeroPlaca: res.filmNumeroPlaca ?? "",
        corazonRayosX: res.corazonRayosX ?? "",
        otrosCambios: res.otrosCambios ?? "",
        examenSaliva: res.examenSaliva ?? "",

        // Opiniones
        hallazgosAnormales: res.hallazgosAnormales ?? "",
        opinionClinica: res.opinionClinica ?? "",

        // Médico que Certifica
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
    fechaExamen: form.fechaExamen,
    usuarioFirma: form.user_medicoFirma,

    colorPiel: form.colorPiel,
    colorOjos: form.colorOjos,
    cabello: form.cabello,

    // Factores hereditarios (1)
    asma: form.asma,
    alergias: form.alergias,
    bronquitis: form.bronquitis,
    pleuresia: form.pleuresia,
    neumonia: form.neumonia,
    respiracion: form.respiracion,
    sangreSaliva: form.sangreSaliva,
    respiracionBreve: form.respiracionBreve,
    problemasNasales: form.problemasNasales,
    tbc: form.tbc,
    fuma: form.fuma,

    // Factores hereditarios (2) / Cáncer pulmonar
    palpitaciones: form.palpitaciones,
    ritmoCardiacoIrregular: form.ritmoCardiacoIrregular,
    fallasCardiacas: form.fallasCardiacas,
    desmayos: form.desmayos,
    tobillosHinchados: form.tobillosHinchados,
    moretonesAnormales: form.moretonesAnormales,
    presionAlta: form.presionAlta,
    heridasPecho: form.heridasPecho,
    otrasEnfermedades: form.otrasEnfermedades,
    tomaMedicina: form.tomaMedicina,

    // Detalles - Exámen médico
    pulsoReposo: form.pulsoReposo,
    pulsoReposoBp: form.pulsoReposoBp,
    pulso30flexiones: form.pulso30flexiones,
    respiracionReposo: form.respiracionReposo,
    respiracion30flexiones: form.respiracion30flexiones,
    obstruccionNasal: form.obstruccionNasal,
    formaPecho: form.formaPecho,
    expansionPecho: form.expansionPecho,
    enfermedadesCronicas: form.enfermedadesCronicas,
    enForma: form.enForma,

    // Detalles - Rayos X / Opiniones
    pechoNormal: form.pechoNormal,
    tbcRayosX: form.tbcRayosX,
    pneumoconiosis: form.pneumoconiosis,
    clasificacionOit: form.clasificacionOit,
    corazonRayosX: form.corazonRayosX,
    otrosCambios: form.otrosCambios,
    hallazgosAnormales: form.hallazgosAnormales,
    opinionClinica: form.opinionClinica,
});

// Body completo (creación / actualización). Este endpoint espera la clave "userRegistro"
// (el default de sellarAuditoria), igual que enviaba el código legacy.
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
// A diferencia del patrón binario nuevo/existente (verificarRegistro), este examen exige que
// el paciente haya pasado Triaje (Agudeza Visual) antes de poder registrarse. Se reutiliza
// VerifyTRPerzonalizadoDefault (3 estados: nuevo / existente / necesita Triaje) anteponiendo
// la validación de sede, igual que en el resto de formularios Poderosa.
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
                    html: "Este paciente ya cuenta con registros de Dirección General de Minería",
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
