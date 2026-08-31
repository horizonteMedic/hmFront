import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { getFetch } from "../../../../../../utils/apiHelpers";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/pcrUltrasensible/obtenerReporte";
const registrarUrl = "/api/v01/ct/pcrUltrasensible/registrarActualizar";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
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
            cargoDesempenar: res.cargo ?? "",
            ocupacion: res.areaO ?? "",
            tipoExamen: res.nomExam ?? "",
            tieneRegistro: false,
        }));
    }
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
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

            // DATOS PRINCIPALES
            norden: res.norden ?? "",
            fecha: res.fechaExamen ?? "",
            codAb: res.codAb ?? null,

            nombres: res.nombres ?? "",
            apellidos: res.apellidos ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edad ?? "",

            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",

            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",

            ocupacion: res.ocupacionPaciente ?? "",
            cargoDesempenar: res.cargoPaciente ?? "",
            area: res.areaPaciente ?? "",

            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",

            // EXAMEN
            resultado: res.resultado ? parseFloat(res.resultado).toFixed(2) : "",
            tipoExamen: res.tipoExamen ?? "",

            // USUARIOS
            user_medicoFirma: res.usuarioFirma ?? prev.user_medicoFirma,
            user_doctorAsignado: res.doctorAsignado ?? "",

            // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
            fechaRegistro: res.fechaRegistro ?? "",
            userRegistro: res.userRegistro ?? "",
            fechaActualizacion: res.fechaActualizacion ?? "",
            usuarioActualizacion: res.usuarioActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body base =====
// `user` (usuario en sesión que envía el formulario) se recibe aparte porque "txtReponsable"
// no es un dato de auditoría: el backend lo trata como el responsable del examen y siempre
// se envía con el usuario que está registrando/actualizando en este momento.
const construirBase = (form, user) => ({
    codAb: form.codAb,
    fechaAb: form.fecha,
    resultado: form.resultado,
    userMedicoOcup: "",
    nOrden: form.norden,

    numTicket: 0,
    txtReponsable: user,

    esPCRUltrasensible: true,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). Este módulo espera la clave "userRegistro".
//
// OJO: este backend usa la clave "fechaRegistro" del body para la FECHA DEL EXAMEN, no para
// la auditoría de creación. Por eso, tras sellar la auditoría (que sí necesita
// "usuarioActualizacion"/"fechaActualizacion"/"userRegistro"), se vuelve a forzar
// "fechaRegistro" al valor de `form.fecha` para no romper el contrato ya funcional.
const construirBody = (form, user, esActualizacion) => {
    const sellado = sellarAuditoria(construirBase(form, user), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    });
    return {
        ...sellado,
        fechaRegistro: form.fecha,
    };
};

// ===== Impresión =====
// Este examen no usa el buscador dinámico de reportes: siempre imprime la misma plantilla fija.
export const PrintHojaR = (nro, token, tabla) => {
    Loading('Cargando Formato a Imprimir');
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            if (res.norden) {
                const nombre = "PCRULTRASENSIBLE";
                const jasperModules = import.meta.glob('../../../../../../jaspers/AnalisisBioquimicos/*.jsx');
                const modulo = await jasperModules[`../../../../../../jaspers/AnalisisBioquimicos/${nombre}.jsx`]();
                if (typeof modulo.default === 'function') {
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
export const SubmitDataService = (form, token, user, limpiar, tabla) =>
    guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla),
    });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla) =>
    actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla),
    });

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
                    html: "Este paciente ya cuenta con registros de PCR Ultrasensible.",
                });
            }),
    });

// ===== Loading =====
export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
