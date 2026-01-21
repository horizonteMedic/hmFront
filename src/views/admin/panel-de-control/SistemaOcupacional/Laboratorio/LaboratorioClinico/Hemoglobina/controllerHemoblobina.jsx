import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteHemoglobina";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarLaboratorioClinicp";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
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

            //AGREGAR
            grupoSanguineo: res.chko ? "O" :
                res.chka ? "A" :
                    res.chkb ? "B" :
                        res.chkab ? "AB" : "",
            factorRh: res.rbrhpositivo ? "RH(+)" : "RH(-)",
            hematocrito: res.hematocrito ?? "",
            hemoglobina: res.hemoglobina ?? "",

            user_medicoFirma: res.usuarioFirma,
            user_doctorAsignado: res.doctorAsignado,
        }));
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        norden: form.norden,
        fechaRegistro: form.fecha,
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
        txtHemoglobina: form.hematocrito,
        txtHematocrito: form.hemoglobina,

        // "txtVsg": "",
        // "txtLeucocitosHematologia": "",
        // "txtHematiesHematologia": "",
        // "txtNeutrofilos": "",
        // "txtAbastonados": "",
        // "txtSegmentadosHematologia": "",
        // "txtMonocitosHematologia": "",
        // "txtEosinofilosHematologia": "",
        // "txtBasofilosHematologia": "",
        // "txtLinfocitosHematologia": "",
        // "txtGlucosaBio": "",
        // "txtCreatininaBio": "",
        // "chkPositivo": false,
        // "chkNegativo": false,
        // "txtVih": "",
        // "txtColorEf": "",
        // "txtDensidadEf": "",
        // "txtAspectoEf": "",
        // "txtPhEf": "",
        // "txtNitritosEq": "",
        // "txtProteinasEq": "",
        // "txtCetonasEq": "",
        // "txtLeucocitosEq": "",
        // "txtUrobilinogenoEq": "",
        // "txtBilirrubinaEq": "",
        // "txtGlucosaEq": "",
        // "txtSangreEq": "",
        // "txtLeucocitosSu": "",
        // "txtCelEpitelialesSu": "",
        // "txtCilindrosSu": "",
        // "txtBacteriasSu": "",
        // "txtHematiesSu": "",
        // "txtCristalesSu": "",
        // "txtPusSu": "",
        // "txtOtrosSu": "",
        // "txtCocaina": "",
        // "txtMarihuana": "",
        // "txtObservacionesLb": "",
        // "resLab": "",
        // "txtPlaquetas": "",
        // "txtAcAscorbico": "",

        userMedicoOcup: "",
        userRegistro: user,

        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

export const PrintHojaR = (nro, token, tabla) => {
    const jasperModules = import.meta.glob(
        "../../../../../../jaspers/AnalisisBioquimicos/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        null,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/AnalisisBioquimicos"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Hemoglobina",
                    "warning"
                );
            });
        }
    );
};

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
