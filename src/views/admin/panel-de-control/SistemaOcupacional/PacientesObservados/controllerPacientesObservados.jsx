import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";

const obtenerReporteUrl = "/api/v01/ct/pacientesObservados/obtenerReportePacientesObservados";
const registrarUrl = "/api/v01/ct/pacientesObservados/registrarActualizarPacientesObservados";
const obtenerReporteInfoTablaUrl = "/api/v01/ct/pacientesObservados/obtenerPacientesObservadosPorFiltros";
const levantarObservacionUrl = "/api/v01/ct/pacientesObservados/levantarObservacion";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden,
            codigoPacientesObservados: res.codigoPacientesObservados,
            fecha: res.fechaInforme,
            hora: res.horaInforme,
            dni: res.dni ?? "",
            nombres: res.nombres ?? "",
            edad: res.edad ?? "",
            interpretacion: res.interpretacion ?? "",
        }));
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla, fetchTabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        codigoPacientesObservados: form.codigoPacientesObservados,
        norden: form.norden,
        fechaInforme: form.fecha,
        horaInforme: form.hora,
        interpretacion: form.interpretacion,
        userRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        fetchTabla();
    }, false);
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(nro, tabla, token, set, sede, () => {
        GetInfoPac(nro, set, token, sede);
    }, () => {
        GetInfoServicio(nro, tabla, set, token, () => {
            Swal.fire("Alerta", "Este paciente ya cuenta con registros de observaciones.", "warning");
        });
    });
};

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos,
            edad: res.edad,
        }));
    }
};

export const getInfoTabla = (nombreSearch, codigoSearch, desde, hasta, setData, token) => {
    try {
        let url = `${obtenerReporteInfoTablaUrl}?`;
        if (codigoSearch) url += `&nOrden=${codigoSearch}`;
        if (nombreSearch) url += `&nombres=${nombreSearch}`;
        if (desde) url += `&fechaDesde=${desde}`;
        if (hasta) url += `&fechaHasta=${hasta}`;

        getFetch(url, token).then((res) => {
            setData(res);
        });
    } catch (error) {
        console.error("Error en getInfoTabla:", error);
        Swal.fire("Error", "Ocurrió un error al obtener los datos de la tabla", "error");
    }
};

export const handleLevantarObservacion = async (form, token, user, limpiar, fetchTabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Seleccione un registro", "error");
        return;
    }
    const result = await Swal.fire({
        title: '¿Levantar Observación?',
        text: "Esta acción marcará la observación como levantada.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, levantar'
    });

    if (result.isConfirmed) {
        LoadingDefault("Procesando...");
        const body = {
            norden: form.norden,
            userRegistro: user
        };
        const res = await SubmitData(body, levantarObservacionUrl, token);
        if (res.id === 1) {
            Swal.fire("Éxito", "Observación levantada correctamente", "success");
            limpiar();
            fetchTabla();
        } else {
            Swal.fire("Error", "No se pudo levantar la observación", "error");
        }
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
