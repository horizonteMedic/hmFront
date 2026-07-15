import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

const obtenerReporteUrl = "/api/v01/ct/hcMujerVaronAdulto/obtenerReporte";
const registrarUrl = "/api/v01/ct/hcMujerVaronAdulto/registrarActualizar";

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    today,
    onFinish = () => { }
) => {
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
            ...res,
            fecha_apertura_hcl: res.fecha_apertura_hcl ?? today,
            // Asegurarse de que los campos booleanos/strings se manejen correctamente si vienen nulos
            ap_alergia_medicamentos: res.ap_alergia_medicamentos,
            ap_transfusion_sanguinea: res.ap_transfusion_sanguinea,
            consumo_drogas: res.consumo_drogas,
            sedentarismo: res.sedentarismo,
            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        }));
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
    const body = {
        ...form,
        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/HistoriaClinicaMujerVaronAdulto/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloAsistencial/HistoriaClinicaMujerVaronAdulto"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede, today) => {
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
            GetInfoServicio(nro, tabla, set, token, today, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con una Historia Clínica de la Mujer y el Varón Adulto.",
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
            fecha_nac: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            direccion: res.domicilio ?? "",
            lugar_nacimiento: res.lugarNacimiento ?? "",
            sexo: res.genero === "M" ? "M" : "F",
            dni: res.dni ?? "",
            grupo_sang: res.grupo_sanguineo ?? "",
            factor_rh: res.factor_rh ?? "",
            distrito: res.distrito ?? "",
            provincia: res.provincia ?? "",
            departamento: res.departamento ?? "",
            estado_civil: res.estadoCivil ?? "",
            raza: res.raza ?? "",
            religion: res.religion ?? "",
            procedencia: res.procedencia ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
