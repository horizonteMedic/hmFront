import { faChartLine, faDownload } from "@fortawesome/free-solid-svg-icons";
import { generarDashboard } from "./generarDashboard";
import { generarReporteVisitas } from "./generarReporteVisitas";

// Reportes en Excel de la campaña activa. Para sumar uno basta su generador
// (devuelve { libro, nombreArchivo }) y una entrada aquí: botón y modal salen solos.
export const REPORTES = {
    visitas: {
        etiqueta: "Reporte de Visitas",
        icono: faDownload,
        titulo: "Reporte de visitas",
        descripcion: "Excel con una fila por visita de la campaña: datos del paciente, parentesco y estado de la visita.",
        generar: generarReporteVisitas,
    },
    dashboard: {
        etiqueta: "Dashboard",
        icono: faChartLine,
        titulo: "Dashboard de la campaña",
        descripcion:
            "Excel de 6 hojas: resumen, visitas por estado, atenciones por especialidad, procedencia, género y rangos de edad. " +
            "Visitas y atenciones son solo de esta campaña; procedencia, género y edades cuentan a los pacientes registrados " +
            "en el período (de todas las campañas), porque el sistema aún no los filtra por campaña.",
        generar: generarDashboard,
    },
};
