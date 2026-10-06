import { getJson } from "../../utils/apiSalud";
import { agregarHojaTabla, crearLibro, nombreSeguro } from "../../utils/excelReporte";

const URL_REPORTE = "/api/reportes/pacientes-con-visita";

const COLUMNAS = [
    { key: "norden", label: "N° Orden", ancho: 10 },
    { key: "fechaVisita", label: "Fecha Visita", ancho: 14 },
    { key: "estadoVisita", label: "Estado", ancho: 12 },
    { key: "apellidosNombres", label: "Nombres y Apellidos", ancho: 40, destacado: true },
    { key: "dni", label: "DNI", ancho: 14, destacado: true },
    { key: "tipoDocumento", label: "Tipo Documento", ancho: 16 },
    { key: "edad", label: "EDAD", ancho: 8 },
    { key: "fechaNacimiento", label: "Fecha de Nacimiento", ancho: 20 },
    { key: "sexo", label: "Sexo", ancho: 12 },
    { key: "caserio", label: "Caserío", ancho: 20 },
    { key: "parentesco", label: "Parentesco", ancho: 45 },
];

const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "";
    const fecha = new Date(fechaNacimiento);
    if (isNaN(fecha)) return "";
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const cumple = new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate());
    if (hoy < cumple) edad--;
    return edad;
};

const textoSexo = (sexo) => (sexo === "M" ? "MASCULINO" : sexo === "F" ? "FEMENINO" : sexo ?? "");

// Una fila del reporte (visita + paciente + parentescos) -> fila plana de la hoja
const aplanarFila = (item) => {
    const paciente = item.paciente ?? {};
    const parentescos = Array.isArray(paciente.parentescos) ? paciente.parentescos : [];

    return {
        norden: item.norden ?? "",
        fechaVisita: item.fechaVisita ?? "",
        estadoVisita: item.estadoVisita ?? "",
        apellidosNombres: `${paciente.apellidos ?? ""} ${paciente.nombres ?? ""}`.trim(),
        dni: paciente.numeroDocumento ?? "",
        tipoDocumento: paciente.tipoDocumentoNombre ?? "",
        edad: calcularEdad(paciente.fechaNacimiento),
        fechaNacimiento: paciente.fechaNacimiento ?? "",
        sexo: textoSexo(paciente.sexo),
        caserio: paciente.caserio ?? "",
        parentesco: parentescos
            .map((p) => `${p.tipoRelacion ?? ""} de ${p.nombreRelacionado ?? ""}${p.dniRelacionado ? ` (${p.dniRelacionado})` : ""}`)
            .join(" | "),
    };
};

// Excel con una fila por visita de la campaña dentro del rango de fechas (el N° de orden solo es único
// dentro de una campaña, por eso el reporte siempre es de una). Devuelve null si no hay visitas.
export const generarReporteVisitas = async ({ token, campania, fechaInicio, fechaFin }) => {
    const params = new URLSearchParams({ fechaDesde: fechaInicio, fechaHasta: fechaFin, codigoCampania: campania.codigo });
    const res = await getJson(`${URL_REPORTE}?${params}`, token, "No se pudo consultar el reporte de visitas");
    const visitas = Array.isArray(res) ? res : res?.resultado ?? [];
    if (!visitas.length) return null;

    const libro = crearLibro();
    agregarHojaTabla(libro, "REPORTE", {
        titulo: `REPORTE DE PACIENTES CON VISITA | ${campania.nombre} | ${fechaInicio} al ${fechaFin}`,
        columnas: COLUMNAS,
        filas: visitas.map(aplanarFila),
    });

    return {
        libro,
        nombreArchivo: `Reporte_PacientesConVisita_${nombreSeguro(campania.codigo)}_${fechaInicio}_${fechaFin}.xlsx`,
    };
};
