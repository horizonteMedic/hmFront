import Swal from "sweetalert2";
import { SubmitData } from "../../../../utils/apiHelpers"
import { LoadingDefault } from "../../../../utils/functionUtils"
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const urlSubmit = '/api/v01/st/registros/matrizControlInterno2026'
const urlSubmitPerso = '/api/v01/st/registros/matrizControlInterno2026Examenes'
const urlMatriz = '/api/v01/st/registros/matrizGeneralSede'

export const SubmitValorizaciones = async (form, token, setData, setTotalPages, recordsPerPage) => {
    let body
    if (form.TipoBusqueda === "1" || form.TipoBusqueda === "2") {
        body = {
            "tipoPago": form.tipoPago,
            "contrata": form.razonContrata,
            "empresa": form.razonEmpresa,
            "fechaDesde": form.fechaInicio,
            "fechaHasta": form.fechaFinal,
            "sede": form.sede.cod_sede ?? ""
        };
    } else {
        body = {
            "fechaInicio": form.fechaInicio,
            "fechaFinal": form.fechaFinal,
            "sede": form.sede.cod_sede ?? ""
        };
    }

    const url = form.TipoBusqueda === "1" ? urlSubmit : form.TipoBusqueda === "2" ? urlSubmitPerso : urlMatriz
    LoadingDefault('Realizando Busqueda')
    SubmitData(body, url, token)
        .then((res) => {
            if (Array.isArray(res) && res.length > 0) {
                setData(res)
                setTotalPages(Math.ceil(res.length / recordsPerPage));
                Swal.close()
            } else {
                Swal.fire("Error", "No se Encontrearon Registros", "error")
            }
        })
        .catch(() => {
            Swal.fire("Error", "Ocurrio un error en la consulta", "error")
        })
}


export const exportToExcel = async ({
    data,
    form,
    columnasBase,
    config // { name: "archivo" }
}) => {
    LoadingDefault('Exportando a Excel')
    // 🔥 1. Determinar columnas activas
    const columnasVisibles = form.TipoBusqueda === "1"
        ? columnasBase
        : form.TipoBusqueda === "2" ? (form.Filtros || []).filter(col => col.valor) : form.TipoBusqueda === "3" && data.length > 0
            ? Object.keys(data[0]).map(key => ({
                key,
                nombre: key // luego puedes formatearlo si quieres
            }))
            : [];

    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No hay data para exportar");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("REPORTE");

    // 🔥 2. HEADER
    const headers = columnasVisibles.map(col => col.nombre);
    sheet.addRow(headers);

    // 🎨 Estilo header
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9E1F2" } // azul suave
        };
    });

    // 🔥 3. DATA
    data.forEach(row => {

        const fila = columnasVisibles.map(col => {

            let value = row[col.key];

            // 🔧 fallback para valores undefined/null
            if (value === undefined || value === null) return "";
            if (typeof value === "boolean") {
                value = value ? "SI" : "NO";
            }
            return value;
        });

        sheet.addRow(fila);
    });

    // 🔥 4. AUTO WIDTH (ingeniería real, no fijo)
    sheet.columns.forEach((column, i) => {
        let maxLength = headers[i].length;

        column.eachCell({ includeEmpty: true }, (cell) => {
            const length = cell.value ? cell.value.toString().length : 10;
            if (length > maxLength) maxLength = length;
        });

        column.width = maxLength + 2;
    });

    // 🔥 5. DESCARGA
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${config?.name || "reporte"}.xlsx`);
    Swal.close()
};