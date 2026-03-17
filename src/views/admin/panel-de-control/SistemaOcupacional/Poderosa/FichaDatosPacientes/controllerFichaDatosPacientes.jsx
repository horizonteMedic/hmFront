import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    GetInfoServicioDefaultManejo,
    LoadingDefault,
    PrintHojaRDefault,
    PrintHojaRJsReportDefault,
    SubmitDataServiceDefault,
    SubmitDataServiceDefaultManejo,
    VerifyTRPerzonalizadoDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getFetch } from "../../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/fichaDatosPersonales/obtenerReporteFichaDatosPersonales";
const obtenerReporteJsReportUrl = "/api/v01/ct/fichaDatosPersonales/descargarReporteFichaDatosPaciente";

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
            fechaIngreso: res.fechaIngreso ?? prev.fechaIngreso,

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
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            distritoNacimiento: res.distrito ?? "",
            provinciaNacimiento: res.provincia ?? "",
            departamentoNacimiento: res.departamento ?? "",

            // ===== DOMICILIO =====
            direccionDomicilio: res.direccionPaciente ?? "",
            distritoDomicilio: res.distrito ?? "",
            provinciaDomicilio: res.provincia ?? "",
            departamentoDomicilio: res.departamento ?? "",
            referenciaDomiciliaria: res.referenciaDomicilio ?? "",

            // ===== CONTACTO =====
            telefono1: res.telefonoPaciente ?? "",
            telefono2: "",
            tipoVivienda: res.viviendaPropia
                ? "PROPIA"
                : res.viviendaAlquilada
                    ? "ALQUILADA"
                    : "OTROS",
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

            //Pre-Evaluación
            grupoSanguineo: res.grupoSanguineo ?? "",

            // capacitaciones: [],
            experiencias: res.experienciaLaboral ?? [],
            referencias: res.referenciasPersonales ?? [],
            aptitudAltura18: res.aptitudPoderosaSi === true ? true : res.aptitudPoderosaNo === true ? false : null,
            aptitud: res.apto === true ? "APTO" : res.aptoRestriccion === true ? "APTO RESTRICCION" : res.noApto === true ? "NO APTO" : false
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
    let hijo = 0;
    familia.forEach((f) => {
        if (f.parentesco.toUpperCase() === "HIJO") {
            hijo++;
        }
        const concatenacion =
            f.parentesco.toUpperCase() != "HIJO" ?
                f.parentesco.toUpperCase() : `HIJO${hijo}`;
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
            distritoNacimiento: res.distrito ?? "",
            provinciaNacimiento: res.provincia ?? "",
            departamentoNacimiento: res.departamento ?? "",

            // ===== DOMICILIO =====
            direccionDomicilio: res.direccionPaciente ?? "",
            distritoDomicilio: res.distrito ?? "",
            provinciaDomicilio: res.provincia ?? "",
            departamentoDomicilio: res.departamento ?? "",
            referenciaDomiciliaria: res.referenciaDomicilio ?? "",

            // ===== CONTACTO =====
            telefono1: res.telefonoPaciente ?? "",
            telefono2: "",
            tipoVivienda: res.viviendaPropia
                ? "PROPIA"
                : res.viviendaAlquilada
                    ? "ALQUILADA"
                    : "OTROS",
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

            //Pre-Evaluación
            grupoSanguineo: res.grupoSanguineo ?? "",

            // capacitaciones: [],
            experiencias: res.experienciaLaboral ?? [],
            referencias: res.referenciasPersonales ?? [],
            aptitudAltura18: res.aptitudPoderosaSi === true ? true : res.aptitudPoderosaNo === true ? false : null,
            aptitud: res.apto === true ? "APTO" : res.aptoRestriccion === true ? "APTO RESTRICCION" : res.noApto === true ? "NO APTO" : false
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
        apto: form.aptitud === "APTO" ? true : false,
        aptoRestriccion: form.aptitud === "APTO RESTRICCION" ? true : false,
        noApto: form.aptitud === "NO APTO" ? true : false,
    };

    await SubmitDataServiceDefaultManejo(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};


export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    PrintHojaRJsReportDefault(
        nro,
        token,
        tabla,
        obtenerReporteJsReportUrl
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
            GetInfoServicioEditar(nro, tabla, set, token, () => { });
        },
        () => {
            //Necesita
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Aptitud Altura Poderosa o Laboratorio Clínico.",
                "warning"
            );
        }
    );
};
export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

export const PrintHojaRPropio = (nro, token, tabla, datosFooter, obtenerReporteUrl, jasperModules, nombreCarpeta) => {

    LoadingDefault("Cargando Formato a Imprimir");

    getFetch(
        `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
        token
    )
        .then(async (res) => {
            console.log('asdas', res)
            // Manejar errores de la respuesta
            if (res.codigo !== 200) {
                console.error("Error en la respuesta del servidor:", res);
                Swal.fire(
                    "Error",
                    `No se pudo obtener el reporte. ${res.status === 404 ? 'El endpoint no existe o no hay datos.' : `Error ${res.status}: ${res.statusText || res.message || 'Error desconocido'}`}`,
                    "error"
                );
                Swal.close();
                return;
            }
            res = res.resultado
            if (res.norden || res.norden_n_orden || res.n_orden) {
                if (!(res.dataPrincipal ?? true)) {
                    Swal.fire(
                        "Error",
                        "No existe registro",
                        "error"
                    );
                    return;
                }
                const nombre = res.nameJasper || res.namejasper;
                console.log("Nombre Jasper recibido:", nombre);
                console.log("Nombre Carpeta:", nombreCarpeta);

                if (!nombre || !nombreCarpeta) {
                    console.error("Faltan datos necesarios:", { nombre, nombreCarpeta });
                    Swal.fire("Error", "Error al obtener el formato de impresión", "error");
                    Swal.close();
                    return;
                }

                // Construir la ruta completa
                const rutaCompleta = `${nombreCarpeta}/${nombre}.jsx`;
                console.log("Ruta completa construida:", rutaCompleta);

                // Verificar las claves disponibles
                const clavesDisponibles = Object.keys(jasperModules);
                console.log("Claves disponibles en jasperModules:", clavesDisponibles);

                // Intentar encontrar el módulo
                let moduloFunc = jasperModules[rutaCompleta];

                // Si no se encuentra la ruta exacta, buscar por nombre del archivo
                if (!moduloFunc) {
                    console.warn(`No se encontró la ruta exacta: ${rutaCompleta}`);
                    // Buscar cualquier clave que contenga el nombre (sin extensión)
                    const nombreSinExtension = nombre.replace(/\.jsx?$/, '');
                    // Extraer palabras clave del nombre (ej: "Informe_Lab_panel4D" -> ["panel", "4d"])
                    const palabrasClave = nombreSinExtension.toLowerCase()
                        .replace(/informe|lab|_/g, ' ')
                        .split(/\s+/)
                        .filter(p => p.length > 0);

                    const claveEncontrada = clavesDisponibles.find(key => {
                        const nombreArchivo = key.split('/').pop().replace(/\.jsx?$/, '').toLowerCase();
                        // Buscar coincidencia exacta
                        if (nombreArchivo === nombreSinExtension.toLowerCase()) {
                            return true;
                        }
                        // Buscar si contiene todas las palabras clave
                        if (palabrasClave.length > 0) {
                            return palabrasClave.every(palabra => nombreArchivo.includes(palabra));
                        }
                        // Buscar si el nombre del archivo contiene el nombre buscado o viceversa
                        return nombreArchivo.includes(nombreSinExtension.toLowerCase()) ||
                            nombreSinExtension.toLowerCase().includes(nombreArchivo);
                    });

                    if (claveEncontrada) {
                        console.log(`Se encontró una clave similar: ${claveEncontrada}`);
                        moduloFunc = jasperModules[claveEncontrada];
                    } else {
                        // Si hay solo un archivo en la carpeta, usarlo
                        if (clavesDisponibles.length === 1) {
                            console.log(`Usando el único archivo disponible: ${clavesDisponibles[0]}`);
                            moduloFunc = jasperModules[clavesDisponibles[0]];
                        } else {
                            console.error("No se pudo encontrar el módulo jasper");
                            Swal.fire("Error", `No se encontró el formato de impresión: ${nombre}.jsx`, "error");
                            Swal.close();
                            return;
                        }
                    }
                }

                if (!moduloFunc || typeof moduloFunc !== 'function') {
                    console.error("El módulo encontrado no es una función:", moduloFunc);
                    Swal.fire("Error", `Error al cargar el formato de impresión: ${nombre}.jsx`, "error");
                    Swal.close();
                    return;
                }

                const modulo = await moduloFunc();
                console.log("Módulo cargado:", modulo);

                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === "function") {
                    modulo.default({ ...res, ...datosFooter }, null);
                } else {
                    console.error(`El módulo no exporta una función por defecto`);
                    Swal.fire("Error", `El formato de impresión ${nombre}.jsx no es válido`, "error");
                }
            }
            Swal.close();
        })
    // .finally(() => {

    // });
};