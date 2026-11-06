import jsPDF from "jspdf";
import footerCons from "../consentimientoMujer/FooterCons.jsx";
import headerConInformadoOcupacional from "../consentimientoMujer/Header/header_conInformadoOcupacional_Digitalizado.jsx";
import { textoDocumento } from "../../../utils/documentoPaciente";

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
};

export default async function ConsentimientoRayosXGeneral_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 20;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const valor = (nombre) => (data[nombre] != null ? `${data[nombre]}` : "");
  const nombres = valor("nombres").toUpperCase();
  const dni = textoDocumento(valor("dni"));
  const fecha = formatearFecha(valor("fecha"));

  const sello1 = data.digitalizacion?.find((d) => d.nombreDigitalizacion === "FIRMAP");
  const sello2 = data.digitalizacion?.find((d) => d.nombreDigitalizacion === "HUELLA");
  const isValidUrl = (url) => url && url !== "Sin registro";
  const loadImg = (src) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  const [firma, huella] = await Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]);

  // === 0) HEADER CON LOGO, N° FICHA, SEDE Y BLOQUE DE COLOR ===
  headerConInformadoOcupacional(doc, data);

  // === 1) TÍTULO ===
  const titulos = ["DECLARACIÓN JURADA DE ACEPTACIÓN", "PARA LA TOMA DE PLACA RADIOGRÁFICA"];
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  titulos.forEach((titulo, i) => {
    const tituloY = margin + 25 + i * 9;
    const tituloWidth = doc.getTextWidth(titulo);
    doc.text(titulo, pageW / 2, tituloY, { align: "center" });
    doc.line((pageW - tituloWidth) / 2, tituloY + 2, (pageW + tituloWidth) / 2, tituloY + 2);
  });

  // === 2) CUERPO ===
  doc.setFontSize(11);
  const lineHeight = 6;
  const maxX = pageW - margin;
  let x = margin;
  let y = margin + 52;

  // Escribe fragmentos (normal o negrita) pasando de línea al llegar al margen derecho.
  const escribirParrafo = (partes) => {
    x = margin;
    partes.forEach((parte) => {
      doc.setFont("helvetica", parte.bold ? "bold" : "normal");
      parte.text.split(" ").forEach((palabra, i) => {
        const fragmento = i > 0 ? ` ${palabra}` : palabra;
        if (x + doc.getTextWidth(fragmento) > maxX) {
          y += lineHeight;
          x = margin;
          doc.text(palabra, x, y);
          x += doc.getTextWidth(palabra);
        } else {
          doc.text(fragmento, x, y);
          x += doc.getTextWidth(fragmento);
        }
      });
    });
    y += lineHeight;
  };

  escribirParrafo([
    { text: "Quien suscribe la presente, " },
    { text: nombres, bold: true },
  ]);
  escribirParrafo([
    { text: "Identificado(a) con DNI N° " },
    { text: dni, bold: true },
    { text: " expongo:" },
  ]);

  y += lineHeight;
  escribirParrafo([
    {
      text: "Que libre y voluntariamente declaro haber sido informado acerca del procedimiento de toma de rayos X y despejado mis dudas al respecto, he comprendido la naturaleza y el propósito del mismo por lo que doy mi consentimiento para que me realicen dicho examen. Y reconozco que toda la información brindada es correcta.",
    },
  ]);

  y += lineHeight / 2;
  escribirParrafo([
    {
      text: "Hago de conocimiento que no me encuentro con diagnóstico ni sospecha de embarazo, motivo por el cual acepto dicho examen.",
    },
  ]);

  // Dibuja una imagen escalada dentro de un área, centrada en X y alineada abajo.
  const dibujarImagen = (img, areaX, areaBottom, maxW, maxH) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const imgW = img.width * scale;
    const imgH = img.height * scale;
    doc.addImage(canvas.toDataURL("image/png"), "PNG", areaX + (maxW - imgW) / 2, areaBottom - imgH, imgW, imgH);
  };

  // === 3) FIRMA, DNI Y FECHA (izquierda) ===
  const firmaX = margin;
  const firmaWidth = 70;
  const firmaLineaY = pageH - 85;

  if (firma) dibujarImagen(firma, firmaX, firmaLineaY - 1, firmaWidth, 35);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(firmaX, firmaLineaY, firmaX + firmaWidth, firmaLineaY);

  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("FIRMA", firmaX + firmaWidth / 2, firmaLineaY + 5, { align: "center" });
  doc.text("DNI:", firmaX, firmaLineaY + 12);
  doc.text("FECHA:", firmaX, firmaLineaY + 20);
  doc.setFont("helvetica", "bold");
  doc.text(dni, firmaX + 16, firmaLineaY + 12);
  doc.text(fecha, firmaX + 16, firmaLineaY + 20);

  // === 4) HUELLA DIGITAL (derecha) ===
  const huellaSize = 35;
  const huellaX = maxX - huellaSize - 10;
  const huellaY = firmaLineaY - 15;

  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.setLineWidth(0.5);
  doc.rect(huellaX, huellaY, huellaSize, huellaSize);
  if (huella) dibujarImagen(huella, huellaX + 2, huellaY + huellaSize - 2, huellaSize - 4, huellaSize - 4);
  doc.text("Huella Digital", huellaX + huellaSize / 2, huellaY + huellaSize + 5, { align: "center" });
  doc.text("(Dedo índice derecho)", huellaX + huellaSize / 2, huellaY + huellaSize + 10, { align: "center" });

  // === 5) FOOTER CON LÍNEA PÚRPURA Y DATOS DE CONTACTO ===
  doc.setDrawColor(51, 0, 153); // Color #330099
  doc.setLineWidth(1);
  doc.line(margin, pageH - 30, maxX, pageH - 30);
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  footerCons(doc, data);

  // === 6) Si viene de un folio, retornar el doc para seguir agregando páginas ===
  if (docExistente) {
    return doc;
  }

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
