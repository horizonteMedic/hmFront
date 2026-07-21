import Swal from "sweetalert2";
import {
    existeRegistro,
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    PrintHojaRJsReportDefault,
    SubmitDataServiceDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { getTimestampActual } from "../../../../../utils/helpers";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoAptitudBrigadista/obtenerReporte";
const obtenerReporteJsReportUrl = "/api/v01/ct/certificadoAptitudBrigadista/descargarReporte";
const registrarUrl =
    "/api/v01/ct/certificadoAptitudBrigadista/registrarActualizar";


export const GetInfoServicio = async (
    nro,
    set,
    token,
    sede
) => {
    const res = await GetInfoPacDefault(
        nro,
        token,
        sede
    );
    // Norden inexistente / paciente no encontrado / error del backend
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
        fechaExam: prev.fechaExam ?? "",
        // Datos personales
        nombres: res.nombresApellidos ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
        lugarNacimiento: res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudios ?? "",
        dni: res.dni ?? "",
        edad: res.edad ?? "",
        sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        // Campos usados por la interfaz principal
        cargoDesempenar: res.cargo ?? "",
        ocupacion: res.areaO ?? "",
        usuarioFirma: res.user_medicoFirma,

        tieneRegistro: false,
    }));
};

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
        onFinish,
        true
    );
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden ?? "",
            fechaExam: res.fechaExamen ?? "",
            tipoExamen: res.nombreExamen ?? "",
            // Datos personales
            nombres: res.nombreCompletoPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: res.cargoPaciente ?? "",
            ocupacion: res.ocupacionPaciente ?? "",

            // observacion
            aptitud: res.apto === true ? "APTO" : res.noApto === true ? "NOAPTO" : "",
            conclusiones: res.conclusiones ?? "",
            restricciones: res.restricciones ?? "",
            recomendaciones: res.recomendaciones ?? "",
            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

            // Auditoría real de la última actualización (la trae obtenerReporte).
            // La fecha llega como ISO y se formatea para mostrarla como "dd/MM/yyyy HH:mm:ss";
            // si aún es null (registro sin editar) queda vacía y la vista muestra un respaldo.
            fechaActualizacion: formatearFechaHora(res.fechaActualizacion),
            usuarioActualizacion: res.usuarioActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};


// Construye el body de registrarActualizar sellando la auditoría según el caso:
//  - Registro NUEVO (esActualizacion = false): sella la creación (userRegistro +
//    fechaRegistro) y deja la actualización en null.
//  - EDICIÓN (esActualizacion = true): sella la actualización con la fecha-hora
//    EXACTA del momento y el usuario en sesión. Se sobrescribe en cada nueva
//    edición (2da, 3ra, ...). No se reenvían los campos de creación: el backend
//    conserva los originales del registro.
const construirBody = (form, user, esActualizacion) => {
    const ahora = getTimestampActual();
    const base = {
        norden: form.norden,
        fechaExamen: form.fechaExam,
        conclusiones: form.conclusiones,
        apto: form.aptitud === "APTO",
        noApto: form.aptitud === "NOAPTO",
        restricciones: form.restricciones,
        recomendaciones: form.recomendaciones,
        usuarioFirma: form.user_medicoFirma,
    };

    // OJO: el body del request usa el prefijo "user" (userRegistro / userActualizacion),
    // igual que userRegistro (que sí persistió al crear) y que el módulo Protocolos.
    // La respuesta de obtenerReporte, en cambio, lo devuelve como "usuarioActualizacion":
    // es una asimetría del backend, no la unifiques.
    return esActualizacion
        ? {
            ...base,
            usuarioActualizacion: user,
            fechaActualizacion: ahora,
        }
        : {
            ...base,
            userRegistro: user,
            fechaRegistro: ahora,
            usuarioActualizacion: null,
            fechaActualizacion: null,
        };
};

// GUARDAR: registra SOLO si aún no existe un registro para esa Orden.
export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
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
    if (yaExiste) {
        await Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-pen-to-square"></i>Alerta',
            html: "Ya existe un registro para esta Orden. Use el botón Editar para actualizarlo.",
        });
        return;
    }

    // Registro nuevo: se sella la creación (usuario en sesión + fecha-hora actual).
    const body = construirBody(form, user, false);

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

// EDITAR: actualiza SOLO si ya existe un registro para esa Orden.
export const UpdateDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
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
    if (!yaExiste) {
        await Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-floppy-disk"></i>Alerta',
            html: "No existe un registro para esta Orden. Use el botón Guardar para registrarlo.",
        });
        return;
    }

    // Edición: se sella la actualización (usuario en sesión + fecha-hora actual),
    // sobrescribiendo el valor previo en cada nueva edición.
    const body = construirBody(form, user, true);

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

// export const PrintHojaR = (nro, token, tabla) => {
//     PrintHojaRJsReportDefault(
//         nro,
//         token,
//         tabla,
//         obtenerReporteJsReportUrl
//     );
// };
// Valida que el N° Orden pertenezca a la sede indicada
// (usa el mismo endpoint filtrado por sede que la búsqueda).
const perteneceASede = async (nro, sede, token) => {
    const pac = await getFetch(
        `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
        token
    );
    return Boolean(pac && !pac.error && pac.norden);
};

export const PrintHojaR = (nro, token, tabla, datosFooter, sede) => {
    Loading('Cargando Formato a Imprimir')
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            // Sin datos / error del backend (500, 404) / N° Orden inexistente o inválido.
            if (!res || res.error || !(res.norden || res.norden_n_orden || res.n_orden)) {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
                    html: `No se encontraron registros para el N° Orden ${nro}.`,
                });
                return;
            }

            // El N° Orden existe: validar que pertenezca a la sede actual (solo en impresión manual).
            if (sede && !(await perteneceASede(nro, sede, token))) {
                Swal.fire({
                    icon: 'warning',
                    title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                    html: `El N° Orden ${nro} pertenece a otra sede.`,
                })
                return;
            }

            const nombre = "Certificado_Aptitud_Brigadista_Digitalizado";
            const jasperModules = import.meta.glob('../../../../../jaspers/Poderosa/*.jsx');
            const modulo = await jasperModules[`../../../../../jaspers/Poderosa/${nombre}.jsx`]();
            // Ejecuta la función exportada por default con los datos
            if (typeof modulo.default === 'function') {
                modulo.default({ ...res, ...datosFooter });
                Swal.close();
            } else {
                console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
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

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    if (!nro) {
        await Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-keyboard"></i>Error',
            html: "Debe Introducir un N° Orden válido",
        });
        return;
    }

    Loading("Validando datos");
    const res = await getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    );

    // Norden inexistente / inválido / error del backend (p. ej. 500 por overflow del N° Orden)
    if (!res || res.error) {
        Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
            html: `No se encontraron registros para el N° Orden ${nro}.`,
        });
        return;
    }

    if (res.id === 0) {
        // No tiene registro de este examen -> se cargan los datos del paciente
        GetInfoServicio(nro, set, token, sede);
    } else {
        // Ya tiene registro: validar que pertenezca a la sede actual antes de cargarlo.
        if (sede && !(await perteneceASede(nro, sede, token))) {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                html: `El N° Orden ${nro} pertenece a otra sede.`,
            });
            return;
        }

        // Pertenece a la sede actual -> se cargan los datos para edición.
        GetInfoServicioEditar(nro, tabla, set, token, () => {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                html: "Este paciente ya cuenta con registros de C. de Aptitud Brigadista",
            });
        });
    }
};


export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};