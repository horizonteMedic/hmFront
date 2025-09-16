import jsPDF from "jspdf";
import headerInformePsicologico from "./headerInformePsicologico.jsx";
import footerInformePsicologico from "./footerInformePsicologico.jsx";
import { formatearFechaLargaConDia } from "../../../utils/formatDateUtils.js";

export default function InformePsicologico(data = {}) {
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const margin = 3;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Datos de prueba basados en la imagen
    const datosPrueba = {
        nombre: "VIVIANA AYDE DELGADO VEGA",
        edad: "25",
        direccion: "AV. EL PESCADOR",
        gradoInstruccion: "UNIVERSITARIO",
        cargoDesempenar: "CAPATAAZ",
        empresa: "MONARCA GOLD S.A.C.",
        fechaNacimiento: "19 de marzo 2000",
        lugarNacimiento: "CHICLAYO",
        estadoCivil: "SOLTERO",
        ocupacion: "ING. SISTEMAS",
        fechaEntrevista: "miércoles 03 septiembre 2025",
        codigoEntrevista: "63163",
        numeroFicha: "99164",
        sede: "Trujillo-Piérola"
    };

    // Función para obtener string de datos
    const obtenerString = (nombre) => {
        return data[nombre] != null ? `${data[nombre]}` : "";
    };

    // Función para convertir a mayúsculas los campos específicos
    const obtenerStringMayus = (nombre) => {
        const valor = data[nombre] != null ? `${data[nombre]}` : "";
        return valor.toUpperCase();
    };

    // Datos reales
    const datosReales = {
        nombre: obtenerStringMayus("nombres"),
        edad: obtenerString("edad"),
        direccion: obtenerStringMayus("direccion"),
        gradoInstruccion: obtenerStringMayus("gradoInstruccion"),
        cargoDesempenar: obtenerStringMayus("cargoDesempenar"),
        empresa: obtenerStringMayus("empresa"),
        fechaNacimiento: obtenerString("fechaNacimiento"),
        lugarNacimiento: obtenerStringMayus("lugarNacimiento"),
        estadoCivil: obtenerStringMayus("estadoCivil"),
        ocupacion: obtenerStringMayus("ocupacion"),
        fechaEntrevista: obtenerString("fechaEntrevista"),
        codigoEntrevista: obtenerString("codigoEntrevista"),
        numeroFicha: obtenerString("numeroFicha"),
        sede: obtenerString("sede")
    };

    // Usar datos reales o datos de prueba
    const datosFinales = data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

    // === HEADER ===
    headerInformePsicologico(doc, datosFinales);

    // === TÍTULO PRINCIPAL ===
    let currentY = 35;
    doc.setFont("helvetica", "bold").setFontSize(15);
    doc.text("INFORME PSICOLÓGICO", pageW / 2, currentY, { align: "center" });

    // === I.- DATOS DE FILIACIÓN ===
    currentY += 10;
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("I.- DATOS DE FILIACIÓN", margin, currentY);

    // Configuración para los datos de filiación
    currentY += 8;
    doc.setFont("helvetica", "normal").setFontSize(10);
    const lineHeight = 6;
    const labelWidth = 50;

    // Nombre completo
    doc.setFont("helvetica", "bold");
    doc.text("Nombre completo", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.nombre, margin + labelWidth, currentY);

    // Fecha de Nacimiento (derecha)
    doc.setFont("helvetica", "bold");
    doc.text("Fecha de Nacimiento", margin + 110, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.fechaNacimiento, margin + 160, currentY);

    currentY += lineHeight;

    // Edad
    doc.setFont("helvetica", "bold");
    doc.text("Edad", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(`${datosFinales.edad} AÑOS`, margin + labelWidth, currentY);

    // Lugar de Nacimiento (derecha)
    doc.setFont("helvetica", "bold");
    doc.text("Lugar de Nacimiento", margin + 110, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.lugarNacimiento, margin + 160, currentY);

    currentY += lineHeight;

    // Dirección
    doc.setFont("helvetica", "bold");
    doc.text("Dirección", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.direccion, margin + labelWidth, currentY);

    // Estado Civil (derecha)
    doc.setFont("helvetica", "bold");
    doc.text("Estado Civil", margin + 110, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.estadoCivil, margin + 160, currentY);

    currentY += lineHeight;

    // Grado de Instrucción
    doc.setFont("helvetica", "bold");
    doc.text("Grado de Instrucción", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.gradoInstruccion, margin + labelWidth, currentY);

    // Ocupación (derecha)
    doc.setFont("helvetica", "bold");
    doc.text("Ocupación", margin + 110, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.ocupacion, margin + 160, currentY);

    currentY += lineHeight;

    // Cargo a Desempeñar
    doc.setFont("helvetica", "bold");
    doc.text("Cargo a Desempeñar", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.cargoDesempenar, margin + labelWidth, currentY);

    currentY += lineHeight;

    // Empresa
    doc.setFont("helvetica", "bold");
    doc.text("Empresa", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.empresa, margin + labelWidth, currentY);

    // Fecha de Entrevista (derecha)
    doc.setFont("helvetica", "bold");
    doc.text("Fecha de Entrevista", margin + 110, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(datosFinales.fechaEntrevista, margin + 160, currentY);

    // === II.- RESULTADOS ===
    currentY += 15;
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("II.- RESULTADOS", margin, currentY);

    // a.- Área Intelectual
    currentY += 8;
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("a.- Área Intelectual (Test de Inteligencia de Barranquilla/test de Otis Intermedia)", margin, currentY);

    currentY += 6;
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO.", margin + 5, currentY);

    currentY += 5;
    doc.text("- COMPRENDE Y PROCESA LA INFORMACIÓN CON FACILIDAD.", margin + 5, currentY);

    currentY += 5;
    doc.text("- COMPRENDE Y PROCESA LA INFORMACIÓN CON DIFICULTAD.", margin + 5, currentY);

    currentY += 5;
    doc.text("- COMPRENDE Y PROCESA LA INFORMACIÓN CON FACILIDAD.", margin + 5, currentY);

    currentY += 5;
    doc.text("- COMPRENDE Y PROCESA LA INFORMACIÓN CON DIFICULTAD.", margin + 5, currentY);

    currentY += 5;
    doc.text("- NO SE EVIDENCIA DAÑO ORGÁNICO.", margin + 5, currentY);

    // b.- Área de Personalidad
    currentY += 10;
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("b.- Área de Personalidad(Test de la figura humana de machover / Inventario Multifásico de personalidad)", margin, currentY);

    currentY += 6;
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("ESTO ES UNA PRUEBA", margin + 5, currentY);

    // c.- Área de Organicidad
    currentY += 15;
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("c.- Área de Organicidad(Test de Bender para adultos / test de Benton Forma C)", margin, currentY);

    currentY += 6;
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("- ORIENTADO EN TIEMPO, ESPACIO, Y PERSONA.", margin + 5, currentY);

    currentY += 5;
    doc.text("- POSEE UN ALTO MANEJO DE FACULTADES MENTALES.", margin + 5, currentY);

    currentY += 5;
    doc.text("- POSEE UN ADECUADO MANEJO DE FACULTADES MENTALES.", margin + 5, currentY);

    currentY += 5;
    doc.text("- POSEE UN BAJO MANEJO DE FACULTADES MENTALES.", margin + 5, currentY);

    currentY += 5;
    doc.text("NO SE EVIDENCIA DAÑO ORGÁNICO.", margin + 5, currentY);

    // d.- Área de Psicomotricidad
    currentY += 15;
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("d.- Área de Psicomotricidad (Prueba de Laberintos de Weschler)", margin, currentY);

    currentY += 6;
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("- NIVEL BAJO EN DESARROLLO PSICOMOTOR.", margin + 5, currentY);

    // e.- Recomendaciones
    currentY += 15;
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("e.- Recomendaciones", margin, currentY);

    currentY += 6;
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("REALIZAR ACTIVIDADES FÍSICAS PARA REFORZAR SUS FUNCIONES COGNITIVAS", margin + 5, currentY);

    currentY += 5;
    doc.text("ASISTIR A TALLERES DE GESTIÓN EMOCIONAL", margin + 5, currentY);

    currentY += 5;
    doc.text("ORIENTACIÓN Y CONSEJERÍA PSICOLÓGICA.", margin + 5, currentY);

    // === III.- APTO PARA EL CARGO ===
    currentY += 20;
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("III.- APTO PARA EL CARGO", margin, currentY);

    // Checkbox SI marcado con X
    currentY += 10;
    doc.setFont("helvetica", "bold").setFontSize(13);
    doc.text("SI", margin + 20, currentY);

    // Dibujar checkbox marcado
    doc.setLineWidth(0.5);
    doc.rect(margin + 30, currentY - 5, 6, 6);
    doc.text("X", margin + 32, currentY - 1);

    // Checkbox NO
    doc.text("NO", margin + 80, currentY);
    doc.rect(margin + 95, currentY - 5, 6, 6);

    // === FOOTER ===
    footerInformePsicologico(doc, data);

    // === 7) Generar blob y abrir en iframe para imprimir automáticamente ===
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };
}