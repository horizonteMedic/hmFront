import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    LoadingDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getHoraActual, getToday } from "../../../../utils/helpers";
import { URLAzure } from "../../../../config/config";

const obtenerReporteUrl = "/api/v01/ct/observaciones/obtenerReporte";
const registrarUrl = "/api/v01/ct/observaciones/registrar";
const obtenerTablaUrl = "/api/v01/ct/observaciones/obtenerReporteFiltros";
const eliminarUrl = "/api/v01/ct/observaciones/eliminar";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    try {
        const res = await getFetch(`${obtenerReporteUrl}?nOrden=${nro}`, token);
        console.log({ res })
        if (res?.resultado) {
            const rese = res.resultado;
            console.log({ rese })
            set((prev) => ({
                ...prev,
                norden: rese.norden ?? "",
                idObservacion: rese.idObservacion ?? null,
                fecha: rese.fechaFin,
                dni: rese.dniPaciente ?? "",
                nombres: `${rese.nombresPaciente ?? ""} ${rese.apellidosPaciente ?? ""}`,
                edad: rese.edadPaciente ?? "",
                interpretacion: rese.examenes ?? "",
            }));
        }
        Swal.close();
    } catch (error) {
        Swal.fire("Error", "Ha ocurrido un error al encontrar ese norden", "error");
    }
    finally {
        onFinish();
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla, fetchTabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        idObservacion: form.idObservacion ?? null,
        norden: form.norden,
        fechaObser: form.fecha,
        horaObser: getHoraActual(),
        examenes: form.interpretacion,
        usuarioRegistro: user
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        fetchTabla();
        Swal.fire("Registrado", "El registro ha sido guardado", "success");
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

export const getInfoTabla = (form, setData, token) => {
    try {
        let url = `${obtenerTablaUrl}?`;
        if (form?.codigo_search) url += `&nOrden=${form.codigo_search}`;
        if (form?.nombres_search) url += `&nombres=${form.nombres_search}`;
        if (form?.empresas_search) url += `&empresaContrata=${form.empresas_search}`;
        if (form?.observaciones_search) url += `&observaciones=${form.observaciones_search}`;
        if (form?.desde) url += `&fechaInicio=${form.desde}`;
        if (form?.hasta) url += `&fechaFin=${form.hasta}`;

        getFetch(url, token).then((res) => {
            if (res?.resultado) {
                setData(res.resultado);
            }
        });
    } catch (error) {
        console.error("Error en getInfoTabla:", error);
        Swal.fire("Error", "Ocurrió un error al obtener los datos de la tabla", "error");
    }
}

export const handleExportar = async (dataTabla) => {
    if (dataTabla.length === 0) {
        Swal.fire("Aviso", "No hay datos para exportar", "info");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pacientes Observados");

    // Definir columnas
    worksheet.columns = [
        { header: "N° Orden", key: "norden", width: 12 },
        { header: "Nombres", key: "nombres", width: 30 },
        { header: "Fecha", key: "fechaInicio", width: 15 },
        { header: "Empresa", key: "empresa", width: 30 },
        { header: "Contrata", key: "contrata", width: 20 },
        { header: "Tipo de Examen", key: "tipoExamen", width: 25 },
        { header: "Cargo", key: "cargoPaciente", width: 25 },
        { header: "Observaciones", key: "examenes", width: 60 },
        { header: "Hora Entrada", key: "horaEntrada", width: 15 },
        { header: "Hora Salida", key: "horaFin", width: 15 },
    ];

    // Agregar datos
    dataTabla.forEach(row => {
        worksheet.addRow({
            norden: row.norden,
            nombres: `${row.apellidosPaciente} ${row.nombresPaciente}`,
            fechaInicio: formatearFechaCorta(row.fechaInicio),
            empresa: row.empresa,
            contrata: row.contrata,
            tipoExamen: row.tipoExamen,
            cargoPaciente: row.cargoPaciente,
            examenes: row.examenes,
            horaEntrada: row.horaEntrada,
            horaFin: row.horaFin,
        });
    });

    // 🎨 Estilo cabecera
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4F81BD" }, // azul elegante
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // 📦 Estilo de celdas
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        row.eachCell(cell => {
            cell.alignment = {
                vertical: "top",
                wrapText: true,
            };

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
    });

    // 🧊 Congelar cabecera
    worksheet.views = [
        { state: "frozen", ySplit: 1 }
    ];

    // 🔽 Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Pacientes_Observados_${getToday()}.xlsx`);
};

export const handleEliminarObservacion = async (form, token, user, limpiar, fetchTabla) => {
    if (!form.norden || !form.nombres) {
        await Swal.fire("Error", "Debe Ingresar seleccionar un paciente", "error");
        return;
    }
    const result = await Swal.fire({
        title: '¿Está seguro de Eliminar la Observación?',
        text: "Esta acción Eliminará el registro de observación.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
        LoadingDefault("Eliminando Registro");
        const response = await fetch(`${URLAzure}${eliminarUrl}/${form.norden}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok === true) {
            Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
            limpiar();
            fetchTabla();
        } else {
            Swal.fire("Error", "No se pudo eliminar el registro", "error");
        }
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
