import CabeceraLogo from "./CabeceraLogo.jsx";
import drawColorBox from "./ColorBox.jsx";
import { formatearFechaCorta } from "../../utils/formatDateUtils";


const FONT = "helvetica";
const TITULO_Y = 38;
const CONTENIDO_Y = 43;

const texto = (v) => String(v ?? "").trim();
const fechaCorta = (v) => formatearFechaCorta(texto(v)) || texto(v);

const HeaderAsistencial = async (
  doc,
  datos = {},
  { pagina = 1, titulo = "", etiquetaFecha = "Fecha de atención" } = {}
) => {
  const pageW = doc.internal.pageSize.getWidth();
  const x = pageW - 80;

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  doc.setTextColor(0, 0, 0);

  const etiquetaTicket = "N° Ticket:";
  doc.setFont(FONT, "normal").setFontSize(8);
  doc.text(etiquetaTicket, x, 15);
  const xTicket = x + doc.getTextWidth(etiquetaTicket) + 2;
  doc.setFontSize(18);
  doc.text(texto(datos.numeroTicket), xTicket, 16);

  doc.setFontSize(8);
  doc.text(`N° Historia Clínica: ${texto(datos.numeroHistoriaClinica)}`, x, 20);
  doc.text(`Sede: ${texto(datos.sede || datos.nombreSede)}`, x, 25);
  doc.text(`${etiquetaFecha}: ${fechaCorta(datos.fecha)}`, x, 30);

  doc.text(`Pag. ${String(pagina).padStart(2, "0")}`, pageW - 30, 10);

  if (texto(datos.codigoColor)) {
    drawColorBox(doc, {
      color: datos.codigoColor,
      text: datos.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
    });
  }

  if (titulo) {
    doc.setFont(FONT, "bold").setFontSize(14);
    doc.text(titulo, pageW / 2, TITULO_Y, { align: "center" });
  }

  doc.setTextColor(0, 0, 0);
  return CONTENIDO_Y;
};

export default HeaderAsistencial;
