import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
    imprimirReporteJasper,
} from "../../../../utils/registroOcupacionalUtils";
import {
    calcularPuntaje,
    respuestasDesdeBackend,
    respuestasHaciaBackend,
} from "./modelTest";


// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/testFatigaSomnolencia/obtenerReporteTestFatigaSomnolencia";
const registrarUrl = "/api/v01/ct/testFatigaSomnolencia/registrarActualizarTestFatigaSomnolencia";

// Este endpoint responde id 1 al registrar y 0 al actualizar (el formulario original aceptaba
// ambos como éxito); el helper estándar solo acepta 1.
const idsExito = [0, 1];

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../jaspers/Test_Fatiga/*.jsx");
const rutaReporte = "../../../../jaspers/Test_Fatiga/TestFatigaSomnolenia_Digitalizado_boro.jsx";

// "M" / "F" (backend) -> texto que muestra el formulario.
const textoSexo = (sexo) => (sexo === "M" ? "MASCULINO" : sexo === "F" ? "FEMENINO" : "");

// ===== Mapeo Registro nuevo =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    // Norden inexistente / paciente no encontrado / error del backend.
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
        fexamen: prev.fexamen ?? "",
        // Datos personales
        nombres: res.nombresApellidos ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
        lugarNacimiento: res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudios ?? "",
        dni: res.dni ?? "",
        edad: res.edad ?? "",
        sexo: textoSexo(res.genero),
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.areaO ?? "",
        cargoDesempenar: res.cargo ?? "",
        // Registro nuevo: sin codEval (el backend lo asigna al crear).
        codEval: null,
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;
    set((prev) => ({
        ...prev,
        // Header
        norden: res.norden ?? "",
        // codEval identifica el registro: sin él el backend crearía uno nuevo al actualizar.
        codEval: res.codEval ?? null,
        fexamen: res.fexamen ?? "",
        // Datos personales
        nombres: res.nombres ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        dni: res.dni ?? "",
        edad: res.edad ?? "",
        sexo: textoSexo(res.sexoPa),
        // Datos laborales
        empresa: res.razonEmpresa ?? "",
        contrata: res.razonContrata ?? "",
        ocupacion: res.areaO ?? res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargo ?? "",
        // Cuestionario
        ...respuestasDesdeBackend(res),
        manejaVehiculos: res.rbSi === true ? "SI" : res.rbNo === true ? "NO" : "",
        // Responsable del registro original (si el backend no lo devuelve se conserva el actual).
        txtMedico: res.txtMedico ?? prev.txtMedico,
        dniUser: res.dniUser ?? prev.dniUser,
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea).
        // La creación se conserva para reenviarla al editar y que el backend no la borre.
        // Hoy el backend de este formulario solo devuelve userRegistro; los otros 3 campos
        // quedan vacíos hasta que se agreguen al DTO.
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    codEval: form.codEval ? form.codEval : null,
    nOrden: form.norden,
    codPa: form.dni,
    edad: form.edad,
    fExamen: form.fexamen,
    ...respuestasHaciaBackend(form),
    rbSi: form.manejaVehiculos === "SI",
    rbNo: form.manejaVehiculos === "NO",
    txtPuntaje: String(calcularPuntaje(form)),
    txtMedico: form.txtMedico,
    dniUser: form.dniUser,
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
        idsExito,
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
        idsExito,
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
                    html: "Este paciente ya cuenta con registros de Test de Fatiga y Somnolencia",
                });
            }),
    });
