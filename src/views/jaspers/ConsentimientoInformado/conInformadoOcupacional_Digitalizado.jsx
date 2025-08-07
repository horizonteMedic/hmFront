import jsPDF from "jspdf";
import footerTR from "../components/footerTR.jsx";
import headerConInformadoOcupacional from "./Header/header_conInformadoOcupacional_Digitalizado.jsx";

export default function conInformadoOcupacional_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 20;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba
  const datosPrueba = {
    nombre: "VIVIANA AYDE DELGADO VEGA",
    dni: "75461024",
    ocupacion: "CAPATAZ",
    empresa: "CORPORACION PERUANA DE CENTROS MEDICOS SAC",
    fecha: "05 agosto 2025",
    hora: "4.10 PM"
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
    nombre: obtenerStringMayus("nombre"),
    dni: obtenerString("dni"),
    ocupacion: obtenerStringMayus("ocupacion"),
    empresa: obtenerStringMayus("empresa"),
    fecha: obtenerString("fecha"),
    hora: obtenerString("hora")
  };

  // Usar datos reales o datos de prueba
  const datosFinales = data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

  // === 0) HEADER CON LOGO, N° FICHA, SEDE Y BLOQUE DE COLOR ===
  headerConInformadoOcupacional(doc, data);

  // === 1) TÍTULO PRINCIPAL ===
  const titulo1 = "CONSENTIMIENTO INFORMADO PARA AUTORIZAR";
  const titulo2 = "EL EXAMEN MEDICO OCUPACIONAL";
  
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(titulo1, pageW / 2, margin + 25, { align: "center" });
  doc.text(titulo2, pageW / 2, margin + 35, { align: "center" });

  // Subrayado para los títulos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  const titulo1Width = doc.getTextWidth(titulo1);
  const titulo2Width = doc.getTextWidth(titulo2);
  doc.line((pageW - titulo1Width) / 2, margin + 27, (pageW + titulo1Width) / 2, margin + 27);
  doc.line((pageW - titulo2Width) / 2, margin + 37, (pageW + titulo2Width) / 2, margin + 37);

  // === 2) INFORMACIÓN PERSONAL ===
  doc.setFont("helvetica", "normal").setFontSize(12);
  
  // "Yo" seguido del nombre
  doc.text("Yo", margin, margin + 55);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.nombre, margin + 8, margin + 55);

  // DNI
  doc.setFont("helvetica", "normal");
  doc.text("identificado con documento de identidad N°:", margin, margin + 65);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.dni, margin + 95, margin + 65);

  // Ocupación
  doc.setFont("helvetica", "normal");
  doc.text("Con ocupacion laboral de:", margin, margin + 75);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.ocupacion, margin + 50, margin + 75);

  // === 3) CERTIFICACIÓN ===
  doc.setFont("helvetica", "normal").setFontSize(11);
  const certificacion = "certifico que he sido informado/a acerca de la naturaleza y propósito del examen médico ocupacional así como pruebas complementarias determinada por la empresa:";
  doc.text(certificacion, margin, margin + 90, { maxWidth: pageW - 2 * margin, align: "justify" });

  // === 4) NOMBRE DE LA EMPRESA ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text(datosFinales.empresa, pageW / 2, margin + 105, { align: "center" });

  // === 5) CUERPO DEL CONSENTIMIENTO ===
  doc.setFont("helvetica", "normal").setFontSize(11);
  const consentimiento = "De acuerdo a los peligros y riesgos identificados en mi puesto de trabajo. En ese sentido en forma consiente y voluntaria doy mi consentimiento, para que se me realice el examen médico ocupacional de acuerdo a la Resolución ministerial N° 312-2011/MINSA . Y doy fe que la información brindada a HORIZONTE MEDIC es verídica. Así mismo, autorizo a HORIZONTE MEDIC para que brinde mi historia clínica y toda información resultante de mi examen medico ocupacional al Medico Ocupacional de mi empresa para que tenga acceso a mi Historia Clínica de acuerdo a la N.T.N° 022 MINSA/dgsp-V.02 y Ley N° 26842, Ley general de salud.";
  
  doc.text(consentimiento, margin, margin + 120, { maxWidth: pageW - 2 * margin, align: "justify" });

  // === 6) FOOTER CON FECHA, HORA Y FIRMAS ===
  const footerY = pageH - 80;
  
  // Calcular el ancho total del bloque (huella + espacio + firma)
  const huellaSize = 25;
  const espacioEntre = 40;
  const firmaWidth = 60;
  const anchoTotal = huellaSize + espacioEntre + firmaWidth;
  
  // Calcular la posición X para centrar el bloque completo
  const bloqueX = (pageW - anchoTotal) / 2;
  
  // Fecha y Hora (centradas con la misma separación que huella y firma, 15 puntos más arriba)
  const fechaHoraY = footerY - 15;
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`Fecha: ${datosFinales.fecha}`, bloqueX, fechaHoraY);
  doc.text(`Hora: ${datosFinales.hora}`, bloqueX + huellaSize + espacioEntre + 18, fechaHoraY);
  
  // Cuadro para huella (más grande)
  const huellaX = bloqueX;
  const huellaY = footerY + 2;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(huellaX, huellaY, huellaSize, huellaSize);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Huella", huellaX + huellaSize / 2, huellaY + huellaSize + 5, { align: "center" });

  // Línea para firma (más cerca del cuadro de huella)
  const firmaX = huellaX + huellaSize + espacioEntre;
  const firmaY = footerY + 9;
  doc.setLineWidth(0.5);
  doc.line(firmaX, firmaY + 12, firmaX + firmaWidth, firmaY + 12);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Firma", firmaX + firmaWidth / 2, firmaY + 20, { align: "center" });

  // === 7) FOOTER CON LÍNEA PÚRPURA Y DATOS DE CONTACTO ===
  const footerContactY = pageH - 25;
  
  // Línea separadora horizontal
  doc.setDrawColor(51, 0, 153); // Color #330099
  doc.setLineWidth(1);
  doc.line(margin, footerContactY - 5, pageW - margin, footerContactY - 5);
  
  // Restaurar color negro para el texto
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  
  // Agregar footer con datos de contacto
  footerTR(doc, data);

  // === 8) Generar blob y abrir en iframe para imprimir automáticamente ===
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
