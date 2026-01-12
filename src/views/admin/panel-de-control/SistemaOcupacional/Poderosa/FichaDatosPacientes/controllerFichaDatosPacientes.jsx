import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    GetInfoServicioDefaultManejo,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    SubmitDataServiceDefaultManejo,
    VerifyTRPerzonalizadoDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/ct/fichaDatosPersonales/obtenerReporteFichaDatosPersonales";
const registrarUrl =
    "/api/v01/ct/fichaDatosPersonales/registrarActualizarFichaDatosPersonales";

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefaultManejo(
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
            id: res.id,
            fechaIngreso: res.fechaIngreso,

            tipoTrabajador: res.empleado
                ? "EMPLEADO"
                : res.obrero
                    ? "OBRERO"
                    : "",

            // ===== DATOS LABORALES =====
            empresa: res.empresa ?? "",
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
            distritoNacimiento: res.lugarNacimientoPaciente ?? "",
            provinciaNacimiento: "",
            departamentoNacimiento: "",

            // ===== DOMICILIO =====
            direccionDomicilio: res.direccionPaciente ?? "",
            distritoDomicilio: res.distrito ?? "",
            provinciaDomicilio: res.provincia ?? "",
            departamentoDomicilio: res.departamento ?? "",
            referenciaDomiciliaria: res.referenciaDomicilio ?? "",

            // ===== CONTACTO =====
            telefono1: res.telefonoEmergencia ?? "",
            telefono2: "",
            tipoVivienda: res.viviendaPropia
                ? "PROPIA"
                : res.viviendaAlquilada
                    ? "ALQUILADA"
                    : "OTROS",
            email: "",
            radioFrec: res.radioFrecuencia ?? "",
            celular: "",
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

            //Pre-Evaluación
            grupoSanguineo: res.grupoSanguineo ?? "",
            aptitudAltura18: res.aptitudAltura18,
            aptitud: res.aptitud,

            // capacitaciones: [],
            experiencias: res.experienciaLaboral ?? [],
            referencias: res.referenciasPersonales ?? [],
        }));
        Swal.close();
    }
};
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

const createBase = () => {
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

export const mapFamilia = (familia = []) => {
    const base = createBase();

    familia.forEach((f) => {
        const key = parentescoConfig[f.parentesco.toUpperCase()];
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

const mapInstruccion = (lista) => {
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
    });

    return base;
};


export const GetInfoServicioEditar = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefaultManejo(
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
            id: res.id,
            fechaIngreso: res.fechaIngreso,

            tipoTrabajador: res.empleado
                ? "EMPLEADO"
                : res.obrero
                    ? "OBRERO"
                    : "",

            // ===== DATOS LABORALES =====
            empresa: res.empresa ?? "",
            cargo: res.cargoPaciente ?? "",

            // ===== DATOS PERSONALES =====
            nombres: res.nombresPaciente ?? "",
            apellidos: res.apellidosPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),

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
            distritoNacimiento: res.lugarNacimientoPaciente ?? "",
            provinciaNacimiento: "",
            departamentoNacimiento: "",

            // ===== DOMICILIO =====
            direccionDomicilio: res.direccionPaciente ?? "",
            distritoDomicilio: res.distrito ?? "",
            provinciaDomicilio: res.provincia ?? "",
            departamentoDomicilio: res.departamento ?? "",
            referenciaDomiciliaria: res.referenciaDomicilio ?? "",

            // ===== CONTACTO =====
            telefono1: "",
            telefono2: "",
            tipoVivienda: res.viviendaPropia
                ? "PROPIA"
                : res.viviendaAlquilada
                    ? "ALQUILADA"
                    : "OTROS",
            email: "",
            radioFrec: res.radioFrecuencia ?? "",
            celular: "",
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

            //Pre-Evaluación
            grupoSanguineo: res.grupoSanguineo ?? "",
            aptitudAltura18: res.aptitudAltura18,
            aptitud: res.aptitud,

            // capacitaciones: [],
            experiencias: res.experienciaLaboral ?? [],
            referencias: res.referenciasPersonales ?? [],
        }));
        Swal.fire(
            "Alerta",
            "Este paciente ya cuenta con registros de Ficha Datos Personales.",
            "warning"
        );
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

    const familiaresConfig = [
        { key: "Padre", parentesco: "PADRE" },
        { key: "Madre", parentesco: "MADRE" },
        { key: "Conviviente", parentesco: "CONVIVIENTE" },
        { key: "Esposa", parentesco: "ESPOSA" },
        { key: "Hijo1", parentesco: "HIJO" },
        { key: "Hijo2", parentesco: "HIJO" },
        { key: "Hijo3", parentesco: "HIJO" },
        { key: "Hijo4", parentesco: "HIJO" },
        { key: "Hijo5", parentesco: "HIJO" }
    ];

    const composicionFamiliar = familiaresConfig.map(f => ({
        id: form[`idfamiliar${f.key}`],
        idFichaDatosPersonales: form.norden,
        parentesco: f.parentesco,
        nombres: form[`familiar${f.key}Nombre`],
        vive: form[`familiar${f.key}Vive`],
        fechaNacimiento: form[`familiar${f.key}FechaNac`],
        edad: form[`familiar${f.key}Edad`],
        dni: form[`familiar${f.key}Dni`],
        gradoInstruccion: form[`familiar${f.key}Grado`],
        autogenerado: form[`familiar${f.key}Autogenerado`]
    }));

    const instruccionConfig = [
        { key: "Primaria", label: "PRIMARIA" },
        { key: "Secundaria", label: "SECUNDARIA" },
        { key: "Tecnica", label: "TECNICA" },
        { key: "Superior", label: "SUPERIOR" },
        { key: "Otros", label: "OTROS" },
    ];

    const buildInstruccionAdquirida =
        instruccionConfig
            .map(i => ({
                id: form[`idInstruccion${i.key}`],
                idFichaDatosPersonales: form.norden,
                instruccion: i.label,
                centroEstudio: form[`instruccion${i.key}Centro`],
                fechaInicio: form[`instruccion${i.key}Inicio`],
                fechaTermino: form[`instruccion${i.key}Termino`],
                gradoObtenido: form[`instruccion${i.key}Grado`],
                cap: null,
            }));


    const body = {
        norden: form.norden,
        id: form.id,
        fechaIngreso: form.fechaIngreso,
        empleado: form.tipoTrabajador == "EMPLEADO",
        obrero: form.tipoTrabajador == "OBRERO",
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

        viviendaPropia: form.tipoVivienda == "PROPIA",
        viviendaAlquilada: form.tipoVivienda == "ALQUILADA",
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
        transporteTerrestreSi: form.transporteTerrestre == "SI",
        transporteTerrestreNo: form.transporteTerrestre == "NO",
        transporteAereoSi: form.transporteAereo == "SI",
        transporteAereoNo: form.transporteAereo == "NO",
        viaticosSi: form.viaticos == "SI",
        viaticosNo: form.viaticos == "NO",
        viaticosDescripcion: form.viaticosValor,
        alimentacionContrata: form.alimentacionContrata,

        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: form.apellidoMaterno,

        usuarioRegistro: user,

        composicionFamiliar: composicionFamiliar,

        experienciaLaboral: form.experiencias.map(item => ({ ...item, idFichaDatosPersonales: form.norden })),
        // capacitaciones: form.capacitaciones.map(item => ({ ...item, idFichaDatosPersonales: form.norden, cap: null })),
        instruccionAdquirida: buildInstruccionAdquirida,
        referenciasPersonales: form.referencias.map(item => ({ ...item, idFichaDatosPersonales: form.norden })),
    };

    await SubmitDataServiceDefaultManejo(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};


export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/FichaDatosPersonales/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/FichaDatosPersonales"
    );
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
            GetInfoServicio(nro, tabla, set, token, () => { });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {

            });
        },
        () => {
            //Necesita
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Certificado de Altura Poderosa o Laboratorio Clínico.",
                "warning"
            );
        }
    );
};
export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};