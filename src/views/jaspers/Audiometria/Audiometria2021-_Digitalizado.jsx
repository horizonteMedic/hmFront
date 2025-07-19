import jsPDF from "jspdf";
import header_Audiometria2021_Digitalizado from "./headers/header_Audiometria2021-_Digitalizado.jsx";

/**
 * Genera el cuerpo completo del PDF:
 * 2.- Síntomas Actuales
 * 3.- Antecedentes Médicos de importancia
 * 4.- Exposición Ocupacional
 * @param {jsPDF} doc
 */
const body_Audiometria2021_Digitalizado = (doc, data) => {
  // Header
  header_Audiometria2021_Digitalizado(doc, data);

  function drawCenteredText(text, centerX, y, options = {}) {
    const textWidth = doc.getTextWidth(text);
    const x = centerX - textWidth / 2;
    doc.text(text, x, y, options);
  }

  // Insertar imagen cuerpo2-8.png en la parte superior
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const usableW = pageW - margin * 2;
  const imgW = usableW; // Menos ancho, deja márgenes
  const imgH = 120; // Más alto
  let y = 45;
  try {
    doc.addImage("public/img/cuerpo2-8.png", "PNG", margin, y, imgW, imgH);
    y += imgH + 5; // Deja un pequeño espacio después de la imagen
  } catch (e) {
    doc.text("Imagen no disponible", margin, y + 10);
    y += 20;
  }
  // const datos = {
  //   sorderaActual: false,
  //   vertigoActual: false,
  //   secrecionOticaActual: false,

  //   acufenosActual: false,
  //   otalgiaActual: false,
  //   otrosSintomasActuales: "Ninguno",

  //   // Antecedentes Médicos de importancia
  //   rinitis: false,
  //   meningitis: false,
  //   parotiditis: false,

  //   sinusitis: false,
  //   tec: false,
  //   sarampion: false,

  //   otitisMediaCronica: false,
  //   sorderaAntecedentes: false,
  //   tbc: false,

  //   medicamentosOtotoxicos: false,
  //   cualesAntecedentes: "Ninguno2",

  //   // Exposición Ocupacional
  //   explosicionAlRuido: false,
  //   usoProtectorAuditivo: false,
  //   exposicionQuimicos: false,
  //   exposicion0a2: true,
  //   exposicion2a4: true,
  //   exposicion4a6: true,
  //   exposicion6a8: true,
  //   exposicion8a10: true,
  //   exposicion10a12: true,
  //   exposicionMas12: true,
  //   exposicionEventual: true,

  //   aniosExposicion: "5",
  //   mesesExposicion: "6",

  //   tapones: true,
  //   orejeras: true,

  //   txthplomo: "plomoh",
  //   txttplomo: "plomot",
  //   txthmercurio: "mercurioh",
  //   txttmercurio: "mercuriot",
  //   txthtolueno: "toluenoh",
  //   txtttolueno: "toluenot",
  //   txthxileno: "xilenoh",
  //   txttxileno: "xilenot",
  //   txthplaguic: "plaguicidah",
  //   txttplaguic: "plaguicidat",
  //   txthorganofos: "organofosh",
  //   txttorganofos: "organofost",

  //   txteootros: "Otros",

  //   practicaTiro: false,
  //   walkman: false,
  //   otrosExtraLaborales: false,
  //   txtaecuales: "Ningunooo",

  //   txtood: "Normal",
  //   txtooi: "Anormal",

  //   od500: 100,
  //   od1000: 40,
  //   od2000: 30,
  //   od3000: 20,
  //   od4000: 10,
  //   od6000: 5,
  //   od8000: 0,

  //   oi500: 20,
  //   oi1000: 30,
  //   oi2000: 40,
  //   oi3000: 50,
  //   oi4000: 60,
  //   oi6000: 70,
  //   oi8000: 80,

  //   txtdiagOd: "diagnosticoOd",
  //   txtdiagOi: "diagnosticoOi",
  //   txtcomentarios: "comentarios",
  //   chkrpasimple: true,
  //   chkrpadoble: true,
  //   chkcasemestral: true,
  //   chkcaanual: true,
  //   txtotrasrecomendaciones: "txtotrasrecomendaciones",

    
  //   od1500: 20,
  //   od11000: 10,
  //   od12000: 20,
  //   od13000: 30,
  //   od14000: 40,
  //   od18000: 50,

  //   oi1500: 20,
  //   oi11000: 10,
  //   oi12000: 20,
  //   oi13000: 30,
  //   oi14000: 40,
  //   oi16000: 50,
  //   oi18000: 60,
  // };
  // console.log(data);
  const datos = {
    sorderaActual: data.rbsasorderaSi,
    vertigoActual: data.rbsavertigoSi,
    secrecionOticaActual: data.rbsasecrecionSi,

    acufenosActual: data.rbsaacufenosSi,
    otalgiaActual: data.rbsaotalgiaSi,
    otrosSintomasActuales: data.txtsaotrossintomas || "",

    // Antecedentes Médicos de importancia
    rinitis: data.rbamrenitisSi,
    meningitis: data.rbammeningitisSi,
    parotiditis: data.rbamparotiditisSi,

    sinusitis: data.rbamsinusitisSi,
    tec: data.rbamtecSi,
    sarampion: data.rbamsarampionSi,

    otitisMediaCronica: data.rbamotitisSi,
    sorderaAntecedentes: data.rbamsorderaSi,
    tbc: data.rbamtbcSi,

    medicamentosOtotoxicos: data.rbamototoxicosSi,
    cualesAntecedentes: data.txtamcuales || "",

    // Exposición Ocupacional
    explosicionAlRuido: data.rbeoexposicionSi,
    usoProtectorAuditivo: data.rbeoprotectoresSi,
    exposicionQuimicos: data.rbeosustanciasSi,
    exposicion0a2: data.rbte0a2,
    exposicion2a4: data.rbte2a4,
    exposicion4a6: data.rbte4a6,
    exposicion6a8: data.rbte6a8,
    exposicion8a10: data.rbte8a10,
    exposicion10a12: data.rbte10a12,
    exposicionMas12: data.rbtem12,
    exposicionEventual: data.rbteeventual,

    aniosExposicion: data.txtanios,
    mesesExposicion: data.txtmeses,

    tapones: data.chktapones,
    orejeras: data.chkorejeras,

    txthplomo: data.txthplomo || "",
    txttplomo: data.txttplomo || "",
    txthmercurio: data.txthmercurio || "",
    txttmercurio: data.txttmercurio || "",
    txthtolueno: data.txthtolueno || "",
    txtttolueno: data.txtttolueno || "",
    txthxileno: data.txthxileno || "",
    txttxileno: data.txttxileno || "",
    txthplaguic: data.txthplaguic || "",
    txttplaguic: data.txttplaguic || "",
    txthorganofos: data.txthorganofos || "",
    txttorganofos: data.txttorganofos || "",

    txteootros: data.txteootros || "",

    practicaTiro: data.rbaepraticaSi,
    walkman: data.rbaeusoSi,
    otrosExtraLaborales: data.rbaeotrosSi,
    txtaecuales: data.txtaecuales || "",

    txtood: data.txtood || "",
    txtooi: data.txtooi || "",

    od500: data.od500 || 0,
    od1000: data.od1000 || 0,
    od2000: data.od2000 || 0,
    od3000: data.od3000 || 0,
    od4000: data.od4000 || 0,
    od6000: data.od6000 || 0,
    od8000: data.od8000 || 0,

    oi500: data.oi500 || 0,
    oi1000: data.oi1000 || 0,
    oi2000: data.oi2000 || 0,
    oi3000: data.oi3000 || 0,
    oi4000: data.oi4000 || 0,
    oi6000: data.oi6000 || 0,
    oi8000: data.oi8000 || 0,

    //nuevo
    txtdiagOd: data.txtdiagOd || "",
    txtdiagOi: data.txtdiagOi || "",
    txtcomentarios: data.txtcomentarios || "",
    chkrpasimple: data.chkrpasimple,
    chkrpadoble: data.chkrpadoble,
    chkcasemestral: data.chkcasemestral,
    chkcaanual: data.chkcaanual,
    txtotrasrecomendaciones: data.txtotrasrecomendaciones || "",

    od1500: data.od1500 || 0,
    od11000: data.od11000 || 0,
    od12000: data.od12000 || 0,
    od13000: data.od13000 || 0,
    od14000: data.od14000 || 0,
    od18000: data.od18000 || 0,

    oi1500: data.oi1500 || 0,
    oi11000: data.oi11000 || 0,
    oi12000: data.oi12000 || 0,
    oi13000: data.oi13000 || 0,
    oi14000: data.oi14000 || 0,
    oi16000: data.oi16000 || 0,
    oi18000: data.oi18000 || 0,
  };
  let newY = 50.7;
  newY += 6;
  // =====================
  // 2.- Síntomas Actuales
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`X`, margin + (datos.sorderaActual ? 23 : 27.5), newY);
  doc.text(`X`, margin + (datos.vertigoActual ? 67 : 71.5), newY);
  doc.text(`X`, margin + (datos.secrecionOticaActual ? 111 : 115.5), newY);
  doc.text(datos.otrosSintomasActuales, margin + 159, newY, {
    maxWidth: 30,
  });
  newY += 3;
  doc.text(`X`, margin + (datos.acufenosActual ? 23 : 27.5), newY);
  doc.text(`X`, margin + (datos.otalgiaActual ? 67 : 71.5), newY);

  // =====================
  // 3.- Antecedentes Médicos de importancia
  // =====================
  newY += 15.2;
  doc.text(`X`, margin + 51.7 + (datos.rinitis ? 0 : 4.5), newY);
  doc.text(`X`, margin + 94.7 + (datos.meningitis ? 0 : 4.5), newY + 0.3);
  doc.text(`X`, margin + 138.8 + (datos.parotiditis ? 0 : 4.5), newY + 0.3);
  newY += 3;
  doc.text(`X`, margin + 51.7 + (datos.sinusitis ? 0 : 4.5), newY);
  doc.text(`X`, margin + 94.7 + (datos.tec ? 0 : 4.5), newY + 0.3);
  doc.text(`X`, margin + 138.8 + (datos.sarampion ? 0 : 4.5), newY + 0.3);
  newY += 3;
  doc.text(`X`, margin + 51.7 + (datos.otitisMediaCronica ? 0 : 4.5), newY);
  doc.text(
    `X`,
    margin + 94.7 + (datos.sorderaAntecedentes ? 0 : 4.5),
    newY + 0.3
  );
  doc.text(`X`, margin + 138.8 + (datos.tbc ? 0 : 4.5), newY + 0.3);
  newY += 3;
  doc.text(`X`, margin + 51.7 + (datos.medicamentosOtotoxicos ? 0 : 4.5), newY);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datos.cualesAntecedentes, margin + 80, newY + 1, {
    maxWidth: 50,
  });

  // =====================
  // 4.- Exposición Ocupacional
  // =====================
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`X`, margin + 55 + (datos.explosicionAlRuido ? 0 : 6), newY + 18);

  doc.text(
    `X`,
    margin + 55 + (datos.usoProtectorAuditivo ? 0 : 6),
    newY + 26.5
  );

  doc.text(`X`, margin + 55 + (datos.exposicionQuimicos ? 0 : 6), newY + 34.3);

  doc.text(`${datos.exposicion0a2 ? "X" : ""}`, margin + 120, newY + 14.5);
  doc.text(`${datos.exposicion2a4 ? "X" : ""}`, margin + 135.5, newY + 14.5);
  doc.text(`${datos.exposicion4a6 ? "X" : ""}`, margin + 152, newY + 14.5);
  doc.text(`${datos.exposicion6a8 ? "X" : ""}`, margin + 168.5, newY + 14.5);

  doc.text(`${datos.exposicion8a10 ? "X" : ""}`, margin + 120, newY + 18);
  doc.text(`${datos.exposicion10a12 ? "X" : ""}`, margin + 135.5, newY + 18);
  doc.text(`${datos.exposicionMas12 ? "X" : ""}`, margin + 152, newY + 18);
  doc.text(`${datos.exposicionEventual ? "X" : ""}`, margin + 168.5, newY + 18);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(`${datos.aniosExposicion}`, margin + 120, newY + 21.5);
  doc.text(`${datos.mesesExposicion}`, margin + 152, newY + 21.5);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${datos.tapones ? "X" : ""}`, margin + 135.5, newY + 26);
  doc.text(`${datos.orejeras ? "X" : ""}`, margin + 168.5, newY + 26);

  doc.setFont("helvetica", "normal").setFontSize(7);

  drawCenteredText(`${datos.txthplomo}`, margin + 89.5, newY + 34.7);
  drawCenteredText(`${datos.txthmercurio}`, margin + 105, newY + 34.7);
  drawCenteredText(`${datos.txthtolueno}`, margin + 121, newY + 34.7);
  drawCenteredText(`${datos.txthxileno}`, margin + 136.5, newY + 34.7);
  drawCenteredText(`${datos.txthplaguic}`, margin + 153, newY + 34.7);
  drawCenteredText(`${datos.txthorganofos}`, margin + 168.5, newY + 34.7);

  drawCenteredText(`${datos.txttplomo}`, margin + 89.5, newY + 38.2);
  drawCenteredText(`${datos.txttmercurio}`, margin + 105, newY + 38.2);
  drawCenteredText(`${datos.txtttolueno}`, margin + 121, newY + 38.2);
  drawCenteredText(`${datos.txttxileno}`, margin + 136.5, newY + 38.2);
  drawCenteredText(`${datos.txttplaguic}`, margin + 153, newY + 38.2);
  drawCenteredText(`${datos.txttorganofos}`, margin + 168.5, newY + 38.2);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${datos.txteootros}`, margin + 35, newY + 43.5, { maxWidth: 50 });

  // =====================
  // 4.- Exposición Ocupacional
  // =====================
  newY += 62.4;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`X`, margin + 42.5 + (datos.practicaTiro ? 0 : 4.5), newY);
  doc.text(`X`, margin + 96.2 + (datos.walkman ? 0 : 4.5), newY + 0.6);
  doc.text(
    `X`,
    margin + 138.7 + (datos.otrosExtraLaborales ? 0 : 4.5),
    newY + 0.6
  );
  doc.text(`${datos.txtaecuales}`, margin + 41.2, newY + 4.6, { maxWidth: 60 });

  // =====================
  // 5.- Exposición Ocupacional
  // =====================
  newY += 10.5;
  doc.text(`${datos.txtood}`, margin + 65, newY, { maxWidth: 30 });
  doc.text(`${datos.txtooi}`, margin + 127, newY, { maxWidth: 30 });
  // =====================
  // 7.- Audiometría
  // =====================
  y += 6;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("7.- Audiometría:", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("(OD: Rojo, OI: Azul)", margin + 40, y);
  y += 4;

  // Calcular mitad del ancho útil
  const halfW = (pageW - margin * 2) / 2;
  const legendW = halfW;
  const legendH = 70;
  const graphW = halfW;
  const graphH = 70;

  // Leyenda (mitad izquierda)
  try {
    doc.addImage(
      "public/img/leyenda_grafico.png",
      "PNG",
      margin,
      y + 2,
      legendW,
      legendH
    );
  } catch (e) {
    doc.text("Leyenda no disponible", margin, y + 10);
  }

  // Gráfico dinámico (mitad derecha)
  const graphX = margin + halfW;
  const graphY = y;
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  // Fondo azul 20-40 dB
  doc.setFillColor(180, 235, 255);
  doc.rect(graphX, graphY + 30, graphW, 20, "F");
  // Declarar freqs antes de cualquier uso
  const freqs = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
  // Líneas horizontales (cada 10 dB)
  for (let i = 0; i <= 12; i++) {
    const yLine = graphY + i * (graphH / 12);
    doc.line(graphX, yLine, graphX + graphW, yLine);
  }
  // Líneas verticales (frecuencias)
  for (let i = 0; i < freqs.length; i++) {
    const xLine = graphX + i * (graphW / (freqs.length - 1));
    doc.line(xLine, graphY, xLine, graphY + graphH);
  }
  // Ejes y etiquetas
  doc.setFont("helvetica", "normal").setFontSize(7);
  for (let i = 0; i < freqs.length; i++) {
    const xTick = graphX + i * (graphW / (freqs.length - 1));
    doc.text(String(freqs[i]), xTick, graphY - 2, { align: "center" });
  }
  doc.text("Hz", graphX + graphW, graphY - 2, { align: "left" });
  for (let i = 0; i <= 12; i++) {
    const dB = -10 + i * 10;
    const yTick = graphY + i * (graphH / 12) + 2;
    doc.text(String(dB), graphX - 7, yTick, { align: "right" });
  }
  doc.text("dB", graphX - 10, graphY + graphH / 2, { align: "right" });

  // INTEGRACIÓN: aquí debes pasar tu array de puntos dinámicos
  // Ejemplo: const puntos = datos.puntosAudiometria || [];
  const puntos = [
    { freq: 500, db: datos.od500, color: "red" },
    { freq: 1000, db: datos.od1000, color: "red" },
    { freq: 2000, db: datos.od2000, color: "red" },
    { freq: 3000, db: datos.od3000, color: "red" },
    { freq: 4000, db: datos.od4000, color: "red" },
    { freq: 6000, db: datos.od6000, color: "red" },
    { freq: 8000, db: datos.od8000, color: "red" },

    { freq: 500, db: datos.oi500, color: "blue" },
    { freq: 1000, db: datos.oi1000, color: "blue" },
    { freq: 2000, db: datos.oi2000, color: "blue" },
    { freq: 3000, db: datos.oi3000, color: "blue" },
    { freq: 4000, db: datos.oi4000, color: "blue" },
    { freq: 6000, db: datos.oi6000, color: "blue" },
    { freq: 8000, db: datos.oi8000, color: "blue" },

    //esto es lo nuevo que debe tener [    ]
    // { freq: 500, db: datos.od1500, color: "red" },
    // { freq: 1000, db: datos.od11000, color: "red" },
    // { freq: 2000, db: datos.od12000, color: "red" },
    // { freq: 3000, db: datos.od13000, color: "red" },
    // { freq: 4000, db: datos.od14000, color: "red" },
    // { freq: 6000, db: datos.od16000, color: "red" },
    // { freq: 8000, db: datos.od18000, color: "red" },

    // { freq: 500, db: datos.oi1500, color: "blue" },
    // { freq: 1000, db: datos.oi11000, color: "blue" },
    // { freq: 2000, db: datos.oi12000, color: "blue" },
    // { freq: 3000, db: datos.oi13000, color: "blue" },
    // { freq: 4000, db: datos.oi14000, color: "blue" },
    // { freq: 6000, db: datos.oi16000, color: "blue" },
    // { freq: 8000, db: datos.oi18000, color: "blue" },
  ];
  const prevLineWidth = doc.getLineWidth();
  for (const punto of puntos) {
    const freqIdx = freqs.indexOf(punto.freq);
    if (freqIdx === -1) continue;
    const x = graphX + (freqIdx + 0.5) * (graphW / 9);
    const yP = graphY + ((punto.db + 10) / 120) * graphH;
    if (punto.color === "red") doc.setDrawColor(255, 0, 0);
    else if (punto.color === "blue") doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.circle(x, yP, 1.1);
    doc.setDrawColor(0, 0, 0);
  }
  doc.setLineWidth(prevLineWidth);

  y += legendH + 5;

  // =====================
  // 8.- Interpretación – Conclusiones
  // =====================
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("8.- Interpretación – Conclusiones:", margin, y);
  y += 6;
};

export default function Audiometria2021_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  body_Audiometria2021_Digitalizado(doc, data);
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
