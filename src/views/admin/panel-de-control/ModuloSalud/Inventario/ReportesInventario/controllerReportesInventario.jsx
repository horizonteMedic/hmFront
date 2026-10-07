import { agregarHojaTabla, crearLibro, nombreSeguro } from "../../utils/excelReporte";
import { getMedicamentos } from "../ProductosEnInventario/controllerProductosEnInventario";

const columnas = [
    { key: "id", label: "ID", ancho: 8 },
    { key: "nombre", label: "Nombre", ancho: 42 },
    { key: "presentacion", label: "Presentación", ancho: 22 },
    { key: "uso", label: "Uso", ancho: 36 },
    { key: "laboratorio", label: "Laboratorio", ancho: 22 },
    { key: "marca", label: "Marca", ancho: 20 },
    { key: "unidadMedida", label: "Unidad Medida", ancho: 16 },
    { key: "stockActual", label: "Stock Actual", ancho: 14 },
    { key: "stockMinimo", label: "Stock Mínimo", ancho: 14 },
    { key: "activo", label: "Activo", ancho: 10 },
];

// Excel con los medicamentos de la campaña y su stock. Devuelve null si la campaña no tiene ninguno.
export const generarReporteMedicamentos = async ({ token, campania }) => {
    const medicamentos = await getMedicamentos(campania.id, token);
    if (!medicamentos.length) return null;

    const fecha = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    const libro = crearLibro();
    agregarHojaTabla(libro, "Medicamentos", {
        titulo: `Reporte de Medicamentos | ${campania.nombre} | ${fecha}`,
        columnas,
        filas: medicamentos.map((medicamento) => ({ ...medicamento, activo: medicamento.activo ? "Sí" : "No" })),
        conTotal: true,
    });

    return { libro, nombreArchivo: `Medicamentos_${nombreSeguro(campania.codigo)}_${fecha.replace(/\//g, "-")}.xlsx` };
};
