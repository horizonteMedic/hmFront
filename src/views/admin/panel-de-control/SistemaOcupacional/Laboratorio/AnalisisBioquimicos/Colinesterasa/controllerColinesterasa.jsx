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

const obtenerReporteUrl = "/api/v01/ct/colinesterasa/reporte";
const registrarUrl = "/api/v01/ct/colinesterasa/registrar";

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
// El backend de este examen devuelve el registro anidado en la clave "resultado".
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res?.resultado) {
        const rese = res.resultado;
        set((prev) => ({
            ...prev,

            // DATOS PRINCIPALES
            norden: rese.norden ?? "",
            fecha: rese.fechaExamen ?? "",

            nombres: rese.nombres ?? "",
            apellidos: rese.apellidos ?? "",
            dni: rese.dniPaciente ?? "",
            edad: rese.edad ?? "",

            fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
            sexo: rese.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",

            estadoCivil: rese.estadoCivilPaciente ?? "",
            nivelEstudios: rese.nivelEstudioPaciente ?? "",

            ocupacion: rese.ocupacionPaciente ?? "",
            cargoDesempenar: rese.cargoPaciente ?? "",
            area: rese.areaPaciente ?? "",

            empresa: rese.empresa ?? "",
            contrata: rese.contrata ?? "",

            // EXAMEN
            resultado: rese.resultado ? parseFloat(rese.resultado).toFixed(2) : "",
            tipoExamen: rese.tipoExamen ?? "",

            // USUARIOS
            user_medicoFirma: rese.usuarioFirma || prev.user_medicoFirma,
            user_doctorAsignado: rese.doctorAsignado ?? "",

            // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
            fechaRegistro: rese.fechaRegistro ?? "",
            userRegistro: rese.userRegistro ?? "",
            fechaActualizacion: rese.fechaActualizacion ?? "",
            usuarioActualizacion: rese.usuarioActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    muestra: form.muestra,
    resultado: form.resultado,

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
    const sellado = sellarAuditoria(construirBase(form), {
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
            if (res?.resultado?.norden) {
                const nombre = "COLINESTERASA";
                const jasperModules = import.meta.glob('../../../../../../jaspers/AnalisisBioquimicos/*.jsx');
                const modulo = await jasperModules[`../../../../../../jaspers/AnalisisBioquimicos/${nombre}.jsx`]();
                if (typeof modulo.default === 'function') {
                    modulo.default(res.resultado);
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
                    html: "Este paciente ya cuenta con registros de Colinesterasa.",
                });
            }),
    });

// ===== Loading =====
export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
