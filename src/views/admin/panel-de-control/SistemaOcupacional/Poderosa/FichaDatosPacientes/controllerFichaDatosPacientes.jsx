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

const obtenerReporteUrl =
    "/api/v01/ct/fichaDatosPacientes/obtenerReporteFichaDatosPacientes";
const registrarUrl =
    "/api/v01/ct/fichaDatosPacientes/registrarActualizarFichaDatosPacientes";

export const GetInfoServicio = async (
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
        onFinish
    );
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden,
            codigoFicha: res.codigoFicha,
            fechaIngreso: res.fechaIngreso || "",
            nombreExamen: res.nombreExamen ?? "",
            empresa: res.empresa ?? "",
            cargo: res.cargoPaciente ?? "",
            codigoActividad: res.codigoActividad ?? "",
            zona: res.zona ?? "",
            codigoDpto: res.codigoDpto ?? "",
            tipoTrabajador: res.tipoTrabajador ?? "",
            nombres: res.nombresPaciente ?? "",
            apellidos: res.apellidosPaciente ?? "",
            // Nacimiento
            diaNacimiento: res.diaNacimiento ?? "",
            mesNacimiento: res.mesNacimiento ?? "",
            anioNacimiento: res.anioNacimiento ?? "",
            distritoNacimiento: res.distritoNacimiento ?? "",
            provinciaNacimiento: res.provinciaNacimiento ?? "",
            departamentoNacimiento: res.departamentoNacimiento ?? "",
            // Datos personales
            dni: res.dniPaciente ?? "",
            lmNo: res.lmNo ?? "",
            autogenerado: res.autogenerado ?? "",
            estadoCivil: res.estadoCivilPaciente ?? "",
            afpSnp: res.afpSnp ?? "",
            estatura: res.estatura ?? "",
            licConducirNo: res.licConducirNo ?? "",
            cusspNo: res.cusspNo ?? "",
            peso: res.peso ?? "",
            // Domicilio
            direccionDomicilio: res.direccionPaciente ?? "",
            distritoDomicilio: res.distritoDomicilio ?? "",
            provinciaDomicilio: res.provinciaDomicilio ?? "",
            departamentoDomicilio: res.departamentoDomicilio ?? "",
            referenciaDomiciliaria: res.referenciaDomiciliaria ?? "",
            telefono1: res.telefono1 ?? "",
            tipoVivienda: res.tipoVivienda ?? "",
            telefono2: res.telefono2 ?? "",
            email: res.email ?? "",
            radioFrec: res.radioFrec ?? "",
            celular: res.celular ?? "",
            numeroCuentaAhorro: res.numeroCuentaAhorro ?? "",
            banco: res.banco ?? "",
            // Emergencia
            emergenciaNombres: res.emergenciaNombres ?? "",
            emergenciaParentesco: res.emergenciaParentesco ?? "",
            emergenciaTelefono: res.emergenciaTelefono ?? "",
            emergenciaDomicilio: res.emergenciaDomicilio ?? "",
            emergenciaOtraReferencia: res.emergenciaOtraReferencia ?? "",
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
        codigoFicha: form.codigoFicha,
        norden: form.norden,
        fechaIngreso: form.fechaIngreso,
        empresa: form.empresa,
        cargo: form.cargo,
        codigoActividad: form.codigoActividad,
        zona: form.zona,
        codigoDpto: form.codigoDpto,
        tipoTrabajador: form.tipoTrabajador,
        // Datos personales
        lmNo: form.lmNo,
        autogenerado: form.autogenerado,
        afpSnp: form.afpSnp,
        estatura: form.estatura,
        licConducirNo: form.licConducirNo,
        cusspNo: form.cusspNo,
        peso: form.peso,
        // Domicilio
        referenciaDomiciliaria: form.referenciaDomiciliaria,
        telefono1: form.telefono1,
        tipoVivienda: form.tipoVivienda,
        telefono2: form.telefono2,
        email: form.email,
        radioFrec: form.radioFrec,
        celular: form.celular,
        numeroCuentaAhorro: form.numeroCuentaAhorro,
        banco: form.banco,
        // Emergencia
        emergenciaNombres: form.emergenciaNombres,
        emergenciaParentesco: form.emergenciaParentesco,
        emergenciaTelefono: form.emergenciaTelefono,
        emergenciaDomicilio: form.emergenciaDomicilio,
        emergenciaOtraReferencia: form.emergenciaOtraReferencia,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
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
                    "Este paciente ya cuenta con registros de Ficha de Datos.",
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
            fechaIngreso: formatearFechaCorta(res.fechaIngreso ?? ""),
            nombreExamen: res.nomExam ?? "",
            cargo: res.cargo ?? "",
            direccionDomicilio: res.direccion ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

