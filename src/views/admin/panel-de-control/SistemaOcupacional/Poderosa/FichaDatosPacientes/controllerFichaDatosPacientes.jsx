import Swal from "sweetalert2";
import {
    existeRegistro,
    GetInfoServicioDefaultManejo,
    LoadingDefault,
    SubmitDataServiceDefaultManejo,
    VerifyTRPerzonalizadoDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { validarSede } from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/fichaDatosPersonales/obtenerReporteFichaDatosPersonales";
const registrarUrl = "/api/v01/ct/fichaDatosPersonales/registrarActualizarFichaDatosPersonales";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/FichaDatosPersonales/*.jsx");
const rutaReporte = "../../../../../jaspers/FichaDatosPersonales/Informe_Ocu_DatosPacientes.jsx";

// ===== Mapeo Composición Familiar =====
const parentescoConfig = {
    PADRE: "Padre",
    MADRE: "Madre",
    CONVIVIENTE: "Conviviente",
    ESPOSA: "Esposa",
    HIJO1: "Hijo1",
    HIJO2: "Hijo2",
    HIJO3: "Hijo3",
    HIJO4: "Hijo4",
    HIJO5: "Hijo5",
};

const createBaseFamilia = () => {
    const base = {};
    Object.values(parentescoConfig).forEach((key) => {
        base[`idfamiliar${key}`] = null;
        base[`familiar${key}Nombre`] = "-";
        base[`familiar${key}Vive`] = "-";
        base[`familiar${key}FechaNac`] = "";
        base[`familiar${key}Edad`] = "-";
        base[`familiar${key}Dni`] = "-";
        base[`familiar${key}Grado`] = "-";
        base[`familiar${key}Autogenerado`] = "-";
    });
    return base;
};

const mapFamilia = (familia = []) => {
    const base = createBaseFamilia();
    let hijo = 0;
    familia.forEach((f) => {
        if (f.parentesco.toUpperCase() === "HIJO") {
            hijo++;
        }
        const concatenacion =
            f.parentesco.toUpperCase() != "HIJO" ? f.parentesco.toUpperCase() : `HIJO${hijo}`;
        const key = parentescoConfig[concatenacion];
        if (!key) return;

        base[`idfamiliar${key}`] = f.id ?? null;
        base[`familiar${key}Nombre`] = f.nombres ?? "-";
        base[`familiar${key}Vive`] = f.vive ?? "-";
        base[`familiar${key}FechaNac`] = f.fechaNacimiento ?? "";
        base[`familiar${key}Edad`] = f.edad ?? "-";
        base[`familiar${key}Dni`] = f.dni ?? "-";
        base[`familiar${key}Grado`] = f.gradoInstruccion ?? "-";
        base[`familiar${key}Autogenerado`] = f.autogenerado ?? "-";
    });
    return base;
};

// ===== Mapeo Instrucción Adquirida =====
const mapInstruccion = (lista = []) => {
    const base = {
        instruccionPrimariaCentro: "-",
        instruccionPrimariaInicio: "",
        instruccionPrimariaTermino: "",
        instruccionPrimariaGrado: "-",

        instruccionSecundariaCentro: "-",
        instruccionSecundariaInicio: "",
        instruccionSecundariaTermino: "",
        instruccionSecundariaGrado: "-",

        instruccionTecnicaCentro: "-",
        instruccionTecnicaInicio: "",
        instruccionTecnicaTermino: "",
        instruccionTecnicaGrado: "-",

        instruccionSuperiorCentro: "-",
        instruccionSuperiorInicio: "",
        instruccionSuperiorTermino: "",
        instruccionSuperiorGrado: "-",

        instruccionOtrosCentro: "-",
        instruccionOtrosInicio: "",
        instruccionOtrosTermino: "",
        instruccionOtrosGrado: "-",
    };

    lista.forEach((i) => {
        const key = i.instruccion?.toLowerCase();
        if (key === "primaria") {
            base.instruccionPrimariaCentro = i.centroEstudio ?? "-";
            base.instruccionPrimariaInicio = i.fechaInicio ?? "";
            base.instruccionPrimariaTermino = i.fechaTermino ?? "";
            base.instruccionPrimariaGrado = i.gradoObtenido ?? "-";
        }
        if (key === "secundaria") {
            base.instruccionSecundariaCentro = i.centroEstudio ?? "-";
            base.instruccionSecundariaInicio = i.fechaInicio ?? "";
            base.instruccionSecundariaTermino = i.fechaTermino ?? "";
            base.instruccionSecundariaGrado = i.gradoObtenido ?? "-";
        }
        if (key === "tecnica") {
            base.instruccionTecnicaCentro = i.centroEstudio ?? "-";
            base.instruccionTecnicaInicio = i.fechaInicio ?? "";
            base.instruccionTecnicaTermino = i.fechaTermino ?? "";
            base.instruccionTecnicaGrado = i.gradoObtenido ?? "-";
        }
        if (key === "superior") {
            base.instruccionSuperiorCentro = i.centroEstudio ?? "-";
            base.instruccionSuperiorInicio = i.fechaInicio ?? "";
            base.instruccionSuperiorTermino = i.fechaTermino ?? "";
            base.instruccionSuperiorGrado = i.gradoObtenido ?? "-";
        }
        if (key === "otros") {
            base.instruccionOtrosCentro = i.centroEstudio ?? "-";
            base.instruccionOtrosInicio = i.fechaInicio ?? "";
            base.instruccionOtrosTermino = i.fechaTermino ?? "";
            base.instruccionOtrosGrado = i.gradoObtenido ?? "-";
        }
    });

    return base;
};

// ===== Mapeo compartido del reporte =====
// obtenerReporte agrega en vivo los datos del paciente exista o no fila propia en
// ficha_datos_paciente (igual que HojaDeRutaEmo): un único mapeo reutilizado por
// GetInfoServicio/GetInfoServicioEditar, que solo difieren en lo que se setea al final.
const mapReporte = (res, prev) => ({
    norden: res.norden ?? "",
    id: res.id,
    fechaIngreso: res.fechaIngreso ?? prev.fechaIngreso,

    tipoTrabajador: res.empleado ? "EMPLEADO" : res.obrero ? "OBRERO" : prev.tipoTrabajador,

    // ===== DATOS LABORALES =====
    empresa: res.contrata ?? "",
    cargo: res.cargoPaciente ?? "",

    // ===== DATOS PERSONALES =====
    nombres: res.nombresPaciente ?? "",
    apellidos: res.apellidosPaciente ?? "",
    apellidoPaterno: res.apellidoPaterno ?? "",
    apellidoMaterno: res.apellidoMaterno ?? "",

    dni: res.dniPaciente ?? "",
    lmNo: res.lm ?? "",
    autogenerado: res.autogenerado ?? "",
    estadoCivil: res.estadoCivilPaciente ?? "",
    afpSnp: res.afp ?? "",
    estatura: res.talla ?? "",
    licConducirNo: res.lincenciaConducir ?? "",
    cusspNo: res.cussp ?? "",
    peso: res.peso ?? "",

    // ===== NACIMIENTO =====
    fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
    distritoNacimiento: res.distritoForm ?? "",
    provinciaNacimiento: res.provinciaForm ?? "",
    departamentoNacimiento: res.departamentoForm ?? "",

    // ===== DOMICILIO =====
    direccionDomicilio: res.direccionPaciente ?? "",
    distritoDomicilio: res.distritoAdmisionPaciente ?? "",
    provinciaDomicilio: res.provinciaAdmisionPaciente ?? "",
    departamentoDomicilio: res.departamentoAdmisionPaciente ?? "",
    referenciaDomiciliaria: res.referenciaDomicilio ?? "",

    // ===== CONTACTO =====
    telefono1: res.telefonoPaciente ?? "",
    telefono2: "",
    tipoVivienda: res.viviendaPropia ? "PROPIA" : res.viviendaAlquilada ? "ALQUILADA" : "OTROS",
    email: "",
    radioFrec: res.radioFrecuencia ?? "",
    celular: res.celularPaciente ?? "",
    numeroCuentaAhorro: res.numeroCuenta ?? "",
    banco: res.banco ?? "",

    // Composición Familiar
    ...mapFamilia(res.composicionFamiliar ?? []),

    // Emergencia
    emergenciaNombres: res.nombreEmergencia ?? "",
    emergenciaParentesco: res.parentescoEmergencia ?? "",
    emergenciaTelefono: res.telefonoEmergencia ?? "",
    emergenciaDomicilio: res.domicilioEmergencia ?? "",
    emergenciaOtraReferencia: res.otraReferenciaEmergencia ?? "",

    // Instrucción Adquirida
    ...mapInstruccion(res.instruccionAdquirida ?? []),

    // Condiciones Laborales
    sueldoJornal: res.sueldo ?? "",
    sistemaTrabajo: res.sistemaTrabajo ?? "",
    transporteTerrestre: res.transporteTerrestreSi ? "SI" : "NO",
    transporteAereo: res.transporteAereoSi ? "SI" : "NO",
    viaticos: res.viaticosSi ? "SI" : "NO",
    viaticosValor: res.viaticosDescripcion ?? "",
    alimentacionContrata: res.alimentacionContrata ?? "",

    // Pre-Evaluación
    grupoSanguineo: res.grupoSanguineo ?? "",

    experiencias: res.experienciaLaboral ?? [],
    referencias: res.referenciasPersonales ?? [],
    aptitudAltura18: res.aptitudPoderosaSi === true ? true : res.aptitudPoderosaNo === true ? false : null,
    aptitud:
        res.faApto === true
            ? "APTO"
            : res.faAptoConRestriccion === true
                ? "APTO RESTRICCION"
                : res.faNoApto === true
                    ? "NO APTO"
                    : false,

    nombrePsicologo: res.nombrePsicologo ?? "",
    nombreMedicoAnexo16: res.nombreMedicoAnexo16 ?? "",
});

// ===== Mapeo Registro nuevo =====
export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefaultManejo(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;
    set((prev) => ({
        ...prev,
        ...mapReporte(res, prev),
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefaultManejo(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;
    set((prev) => ({
        ...prev,
        ...mapReporte(res, prev),
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: res.doctorAsignado,
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body de registro/actualización =====
const construirBody = (form, user) => {
    const familiaresConfig = [
        { key: "Padre", parentesco: "PADRE" },
        { key: "Madre", parentesco: "MADRE" },
        { key: "Conviviente", parentesco: "CONVIVIENTE" },
        { key: "Esposa", parentesco: "ESPOSA" },
        { key: "Hijo1", parentesco: "HIJO" },
        { key: "Hijo2", parentesco: "HIJO" },
        { key: "Hijo3", parentesco: "HIJO" },
        { key: "Hijo4", parentesco: "HIJO" },
        { key: "Hijo5", parentesco: "HIJO" },
    ];

    const composicionFamiliar = familiaresConfig.map((f) => ({
        id: form[`idfamiliar${f.key}`],
        idFichaDatosPersonales: form.norden,
        parentesco: f.parentesco,
        nombres: form[`familiar${f.key}Nombre`],
        vive: form[`familiar${f.key}Vive`],
        fechaNacimiento: form[`familiar${f.key}FechaNac`],
        edad: form[`familiar${f.key}Edad`],
        dni: form[`familiar${f.key}Dni`],
        gradoInstruccion: form[`familiar${f.key}Grado`],
        autogenerado: form[`familiar${f.key}Autogenerado`],
    }));

    const instruccionConfig = [
        { key: "Primaria", label: "PRIMARIA" },
        { key: "Secundaria", label: "SECUNDARIA" },
        { key: "Tecnica", label: "TECNICA" },
        { key: "Superior", label: "SUPERIOR" },
        { key: "Otros", label: "OTROS" },
    ];

    const instruccionAdquirida = instruccionConfig.map((i) => ({
        id: form[`idInstruccion${i.key}`],
        idFichaDatosPersonales: form.norden,
        instruccion: i.label,
        centroEstudio: form[`instruccion${i.key}Centro`],
        fechaInicio: form[`instruccion${i.key}Inicio`],
        fechaTermino: form[`instruccion${i.key}Termino`],
        gradoObtenido: form[`instruccion${i.key}Grado`],
        cap: null,
    }));

    return {
        norden: form.norden,
        id: form.id,
        fechaIngreso: form.fechaIngreso,
        empleado: form.tipoTrabajador === "EMPLEADO",
        obrero: form.tipoTrabajador === "OBRERO",
        codigoActividad: "",
        codigoDepartamento: "",
        zona: "",
        distrito: form.distritoNacimiento,
        provincia: form.provinciaNacimiento,
        departamento: form.departamentoNacimiento,
        lincenciaConducir: form.licConducirNo,
        lm: form.lmNo,
        afp: form.afpSnp,
        cussp: form.cusspNo,
        autogenerado: form.autogenerado,
        referenciaDomicilio: form.referenciaDomiciliaria,

        viviendaPropia: form.tipoVivienda === "PROPIA",
        viviendaAlquilada: form.tipoVivienda === "ALQUILADA",
        radioFrecuencia: form.radioFrec,
        numeroCuenta: form.numeroCuentaAhorro,
        banco: form.banco,

        nombreEmergencia: form.emergenciaNombres,
        parentescoEmergencia: form.emergenciaParentesco,
        telefonoEmergencia: form.emergenciaTelefono,
        domicilioEmergencia: form.emergenciaDomicilio,
        otraReferenciaEmergencia: form.emergenciaOtraReferencia,

        sueldo: form.sueldoJornal,
        sistemaTrabajo: form.sistemaTrabajo,
        transporteTerrestreSi: form.transporteTerrestre === "SI",
        transporteTerrestreNo: form.transporteTerrestre === "NO",
        transporteAereoSi: form.transporteAereo === "SI",
        transporteAereoNo: form.transporteAereo === "NO",
        viaticosSi: form.viaticos === "SI",
        viaticosNo: form.viaticos === "NO",
        viaticosDescripcion: form.viaticosValor,
        alimentacionContrata: form.alimentacionContrata,

        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: form.apellidoMaterno,

        usuarioRegistro: user,

        composicionFamiliar,
        experienciaLaboral: form.experiencias.map((item) => ({ ...item, idFichaDatosPersonales: form.norden })),
        instruccionAdquirida,
        referenciasPersonales: form.referencias.map((item) => ({ ...item, idFichaDatosPersonales: form.norden })),

        apto: form.aptitud === "APTO",
        aptoRestriccion: form.aptitud === "APTO RESTRICCION",
        noApto: form.aptitud === "NO APTO",

        usuarioFirma: "",
        doctorAsignado: "",
    };
};

// ===== Guardar / Editar =====
// El endpoint de fichaDatosPersonales responde envuelto en { codigo, resultado }, por eso se
// usan las variantes "Manejo" de functionUtils en vez de los helpers genéricos de
// registroOcupacionalUtils (pensados para respuestas planas).
const enviarRegistro = async ({ form, token, user, tabla, limpiar, datosFooter, sede, esActualizacion }) => {
    if (!form.norden) {
        await Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-clipboard-list"></i>Error',
            html: "Datos Incompletos",
        });
        return;
    }

    LoadingDefault("Validando datos");
    const yaExiste = await existeRegistro(form.norden, tabla, token);

    if (esActualizacion && !yaExiste) {
        await Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-floppy-disk"></i>Alerta',
            html: "No existe un registro para esta Orden. Use el botón Guardar para registrarlo.",
        });
        return;
    }
    if (!esActualizacion && yaExiste) {
        await Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-pen-to-square"></i>Alerta',
            html: "Ya existe un registro para esta Orden. Use el botón Editar para actualizarlo.",
        });
        return;
    }

    const body = construirBody(form, user);
    await SubmitDataServiceDefaultManejo(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter, sede);
    });
};

export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter, sede) =>
    enviarRegistro({ form, token, user, tabla, limpiar, datosFooter, sede, esActualizacion: false });

export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter, sede) =>
    enviarRegistro({ form, token, user, tabla, limpiar, datosFooter, sede, esActualizacion: true });

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter, sede) => {
    LoadingDefault("Cargando Formato a Imprimir");

    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            if (sede) {
                const { estado: estadoSede, descripcionSede } = await validarSede(nro, sede, token);
                if (estadoSede === "otraSede") {
                    Swal.fire({
                        icon: "warning",
                        title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                        html: `El N° Orden ${nro} pertenece a otra sede${descripcionSede ? ` (${descripcionSede})` : ""}.`,
                    });
                    return;
                }
                if (estadoSede === "error") {
                    Swal.fire({
                        icon: "error",
                        title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
                        html: `Verifique el número de orden ${nro} e intente nuevamente.`,
                    });
                    return;
                }
            }

            const resultado = res?.resultado;
            if (!res || res.error || !resultado?.norden) {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
                    html: `No se encontraron registros para el N° Orden ${nro}.`,
                });
                return;
            }

            const modulo = await jasperModules[rutaReporte]();
            if (typeof modulo.default === "function") {
                modulo.default({ ...resultado, ...datosFooter });
                Swal.close();
            } else {
                console.error(`El módulo ${rutaReporte} no exporta una función por defecto`);
                Swal.fire({
                    icon: "error",
                    title: '<i class="fa-solid fa-print"></i>Error',
                    html: "No se pudo cargar el formato de impresión.",
                });
            }
        })
        .catch((error) => {
            console.error("Error al generar el reporte:", error);
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-print"></i>Error',
                html: "Ocurrió un error al generar el reporte.",
            });
        });
};

// ===== Búsqueda / verificación por N° Orden (3 estados: nuevo / existente / necesita examen previo) =====
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
        const { estado: estadoSede, descripcionSede } = await validarSede(nro, sede, token);
        if (estadoSede === "otraSede") {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                html: `El N° Orden ${nro} pertenece a otra sede${descripcionSede ? ` (${descripcionSede})` : ""}.`,
            });
            return;
        }
        if (estadoSede === "error") {
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
        () => {
            // No tiene registro -> se cargan los datos del paciente.
            GetInfoServicio(nro, tabla, set, token, () => {Swal.close()});
        },
        () => {
            // Ya tiene registro -> se carga para edición.
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Ficha Datos Personales.",
                });
            });
        },
        () => {
            // Necesita pasar por Laboratorio Clínico antes de registrar esta ficha.
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-vial"></i>Alerta',
                html: "El paciente necesita pasar por Laboratorio Clínico.",
            });
        }
    );
};
