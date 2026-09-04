import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    PrintHojaRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteHemoglobina";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarLaboratorioClinicp";

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
            nombreExamen: res.nomExam ?? "",
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
            norden: res.norden ?? "",
            fecha: res.fechaLab,

            codLabclinico: res.codLabclinico ?? "",

            nombreExamen: res.nombreExamen ?? "",
            dni: res.dni ?? "",

            nombres: res.nombres ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimiento ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            edad: res.edad ?? "",
            sexo: res.sexo === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivil,
            nivelEstudios: res.nivelEstudios,
            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacion,
            cargoDesempenar: res.cargo,

            grupoSanguineo: res.chko ? "O" :
                res.chka ? "A" :
                    res.chkb ? "B" :
                        res.chkab ? "AB" : "",
            factorRh: res.rbrhpositivo ? "RH(+)" : res.rbrhnegativo ? "RH(-)" : "",
            hematocrito: res.hematocrito ?? "",
            hemoglobina: res.hemoglobina ?? "",

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            user_doctorAsignado: res.doctorAsignado,

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
const construirBase = (form) => ({
    norden: form.norden,
    codLabclinico: form.codLabclinico,
    tipoServicio: "",
    numTicket: 0,
    fechaLab: form.fecha,
    chko: form.grupoSanguineo == "O",
    chka: form.grupoSanguineo == "A",
    chkb: form.grupoSanguineo == "B",
    chkab: form.grupoSanguineo == "AB",
    rbrhpositivo: form.factorRh == "RH(+)",
    rbrhnegativo: form.factorRh == "RH(-)",
    txtHemoglobina: form.hemoglobina,
    txtHematocrito: form.hematocrito,

    esHemoglobina: true,

    userMedicoOcup: "",

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). Este módulo espera la clave "userRegistro".
//
// OJO: este backend usa la clave "fechaRegistro" del body para la FECHA DEL EXAMEN (igual que
// "fechaLab"), no para la auditoría de creación. Por eso, tras sellar la auditoría (que sí
// necesita "usuarioActualizacion"/"fechaActualizacion"/"userRegistro"), se vuelve a forzar
// "fechaRegistro" al valor de `form.fecha` para no romper el contrato ya funcional.
const construirBody = (form, user, esActualizacion) => {
    const sellado = sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistro",
    });
    return {
        ...sellado,
        fechaRegistro: form.fecha,
    };
};

// ===== Impresión =====
// La carpeta "LaboratorioClinico" tiene varias plantillas Jasper; se resuelve dinámicamente
// según el nombre que devuelva el backend (no hay una única plantilla fija para esta tabla).
export const PrintHojaR = (nro, token, tabla) => {
    const jasperModules = import.meta.glob(
        "../../../../../../jaspers/LaboratorioClinico/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        null,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/LaboratorioClinico"
    );
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
                    html: "Este paciente ya cuenta con registros de Hemoglobina.",
                });
            }),
    });
