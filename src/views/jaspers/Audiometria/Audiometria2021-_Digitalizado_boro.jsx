import jsPDF from "jspdf";
import header_Audiometria2021_Digitalizado_boro from "./headers/header_Audiometria2021-_Digitalizado_boro";

/**
 * Genera el cuerpo completo del PDF:
 * 2.- Síntomas Actuales
 * 3.- Antecedentes Médicos de importancia
 * 4.- Exposición Ocupacional
 * @param {jsPDF} doc
 */
const body_Audiometria2021_Digitalizado = (doc, data) => {
  // Header
  header_Audiometria2021_Digitalizado_boro(doc, data);

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
  const imgH = 90; // Más alto
  let y = 45;
  try {
    console.log(margin, y);
    doc.addImage("/img/Cuerpo_Audiometria2021_digitalizado.png", "PNG", margin, y, imgW, imgH);
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
  //   exposicion0a2: false,
  //   exposicion2a4: false,
  //   exposicion4a6: false,
  //   exposicion6a8: false,
  //   exposicion8a10: false,
  //   exposicion10a12: false,
  //   exposicionMas12: false,
  //   exposicionEventual: false,

  //   aniosExposicion: "5",
  //   mesesExposicion: "6",

  //   tapones: false,
  //   orejeras: false,

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

  // // O
  //   od500: 30,
  //   od1000: null,
  //   od2000: 60,
  //   od3000: null,
  //   od4000: 10,
  //   od6000: null,
  //   od8000: 0,
  // // X

  //   oi500: 20,
  //   oi1000: 30,
  //   oi2000: null,
  //   oi3000: 50,
  //   oi4000: null,
  //   oi6000: 70,
  //   oi8000: 80,

  //   // Vía ósea OD (corchete izquierdo)
  //   od1_500: 40,
  //   od1_1000: 60, // valor visible para depuración
  //   od1_2000: 70,
  //   od1_3000: null,
  //   od1_4000: 90,
  //   od1_6000: null,
  //   od1_8000: 100,

  //   // Vía ósea OI (corchete derecho)
  //   oi1_500: 35,
  //   oi1_1000: null,
  //   oi1_2000: 80, // valor visible para depuración
  //   oi1_3000: null,
  //   oi1_4000: 95,
  //   oi1_6000: null,
  //   oi1_8000: 105,

  //   txtdiagOd: "diagnosticoOd22",
  //   txtdiagOi: "diagnosticoOi33",
  //   txtcomentarios: "comentarios 3434 fasfas",
  //   chkrpasimple: true,
  //   chkrpadoble: true,
  //   chkcasemestral: true,
  //   chkcaanual: true,
  //   txtotrasrecomendaciones: "txtotrasrecomendaciones fsfs",

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
  function limpiarNumero(valor) {
    if (valor === undefined || valor === null) return null;
    const v = String(valor).trim();

    if (v === "" || v === "N/A" || v === "-") {
      return null;
    }

    // Verifica si el string representa un número válido
    const esNumeroValido = /^-?\d+(\.\d+)?$/.test(v);

    return esNumeroValido ? Number(v) : null;
  }
  console.log(data);
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

    od500: limpiarNumero(data.od500),
    od1000: limpiarNumero(data.od1000),
    od2000: limpiarNumero(data.od2000),
    od3000: limpiarNumero(data.od3000),
    od4000: limpiarNumero(data.od4000),
    od6000: limpiarNumero(data.od6000),
    od8000: limpiarNumero(data.od8000),

    oi500: limpiarNumero(data.oi500),
    oi1000: limpiarNumero(data.oi1000),
    oi2000: limpiarNumero(data.oi2000),
    oi3000: limpiarNumero(data.oi3000),
    oi4000: limpiarNumero(data.oi4000),
    oi6000: limpiarNumero(data.oi6000),
    oi8000: limpiarNumero(data.oi8000),

    //nuevo
    txtdiagOd: data.txtdiagOd || "",
    txtdiagOi: data.txtdiagOi || "",
    txtcomentarios: data.txtcomentarios || "",
    chkrpasimple: data.chkrpasimple,
    chkrpadoble: data.chkrpadoble,
    chkcasemestral: data.chkcasemestral,
    chkcaanual: data.chkcaanual,
    txtotrasrecomendaciones: data.txtotrasrecomendaciones || "",

    od1500: limpiarNumero(data.od1500),
    od11000: limpiarNumero(data.od11000),
    od12000: limpiarNumero(data.od12000),
    od13000: limpiarNumero(data.od13000),
    od14000: limpiarNumero(data.od14000),
    od18000: limpiarNumero(data.od18000),

    oi1500: limpiarNumero(data.oi1500),
    oi11000: limpiarNumero(data.oi11000),
    oi12000: limpiarNumero(data.oi12000),
    oi13000: limpiarNumero(data.oi13000),
    oi14000: limpiarNumero(data.oi14000),
    oi16000: limpiarNumero(data.oi16000),
    oi18000: limpiarNumero(data.oi18000),
  };
  let newY = 47.5;
  newY += 6;
  // =====================
  // 2.- Síntomas Actuales
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`X`, margin + (datos.sorderaActual ? 23 : 27.5), newY);
  doc.text(`X`, margin + (datos.vertigoActual ? 67 : 71.5), newY);
  doc.text(`X`, margin + (datos.secrecionOticaActual ? 111 : 115.5), newY);
  doc.text(datos.otrosSintomasActuales, margin + 153, newY, {
    maxWidth: 30,
  });
  newY += 3;
  doc.text(`X`, margin + (datos.acufenosActual ? 23 : 27.5), newY);
  doc.text(`X`, margin + (datos.otalgiaActual ? 67 : 71.5), newY);

  // =====================
  // 3.- Antecedentes Médicos de importancia
  // =====================
  newY += 10.5;
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
  doc.text(datos.cualesAntecedentes, margin + 75, newY + 0.5, {
    maxWidth: 50,
  });

  // =====================
  // 4.- Exposición Ocupacional
  // =====================
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(
    `X`,
    margin + 54.5 + (datos.explosicionAlRuido ? 0 : 6),
    newY + 11.5
  );

  doc.text(
    `X`,
    margin + 54.5 + (datos.usoProtectorAuditivo ? 0 : 6),
    newY + 19.5
  );

  doc.text(`X`, margin + 54.5 + (datos.exposicionQuimicos ? 0 : 6), newY + 27);

  newY -= 6.4;
  doc.text(`${datos.exposicion0a2 ? "X" : ""}`, margin + 120, newY + 14.5);
  doc.text(`${datos.exposicion2a4 ? "X" : ""}`, margin + 135.5, newY + 14.5);
  doc.text(`${datos.exposicion4a6 ? "X" : ""}`, margin + 152, newY + 14.5);
  doc.text(`${datos.exposicion6a8 ? "X" : ""}`, margin + 168.5, newY + 14.5);

  doc.text(`${datos.exposicion8a10 ? "X" : ""}`, margin + 120, newY + 18);
  doc.text(`${datos.exposicion10a12 ? "X" : ""}`, margin + 135.5, newY + 18);
  doc.text(`${datos.exposicionMas12 ? "X" : ""}`, margin + 152, newY + 18);
  doc.text(`${datos.exposicionEventual ? "X" : ""}`, margin + 168.5, newY + 18);

  newY -= 0.5;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(`${datos.aniosExposicion}`, margin + 120, newY + 21.5);
  doc.text(`${datos.mesesExposicion}`, margin + 152, newY + 21.5);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${datos.tapones ? "X" : ""}`, margin + 135.5, newY + 26);
  doc.text(`${datos.orejeras ? "X" : ""}`, margin + 168.5, newY + 26);

  doc.setFont("helvetica", "normal").setFontSize(7);
  newY -= 1.2;
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

  newY -= 1;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${datos.txteootros}`, margin + 35, newY + 43.5, { maxWidth: 50 });
  newY += 9.1;
  // =====================
  // 4.- Exposición Ocupacional
  // =====================
  newY +=  44.7;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`X`, margin + 42.6 + (datos.practicaTiro ? 0 : 4.5), newY);
  doc.text(`X`, margin + 96.3 + (datos.walkman ? 0 : 4.5), newY + 0.6);
  doc.text(
    `X`,
    margin + 138.7 + (datos.otrosExtraLaborales ? 0 : 4.5),
    newY + 0.6
  );
  doc.text(`${datos.txtaecuales}`, margin + 41.2, newY + 4.6, {
    maxWidth: 60,
  });

  // =====================
  // 5.- Exposición Ocupacional
  // =====================
  newY += 10.5;
  doc.text(`${datos.txtood}`, margin + 55, newY - 0.7, { maxWidth: 20 });
  doc.text(`${datos.txtooi}`, margin + 107, newY - 0.7, { maxWidth: 30 });
  // =====================
  // 7.- Audiometría
  // =====================
  y += 6;
  doc.setFont("helvetica", "bold").setFontSize(8);
  // doc.text("7.- Audiometría:", margin, y);
  // doc.setFont("helvetica", "normal").setFontSize(8);
  // doc.text("(OD: Rojo, OI: Azul)", margin + 40, y);
  // y += 4;

  // Calcular mitad del ancho útil
  const halfW = (pageW - margin * 2) / 2;
  const legendW = halfW;
  const legendH = 70;
  const graphW = halfW;
  const graphH = 70;

  // Leyenda (mitad izquierda)
  try {
    doc.addImage(
      "/img/leyenda_grafico.png",
      "PNG",
      margin,
      y + 2,
      legendW * 0.8,
      legendH * 0.8
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
  // Líneas horizontales (cada 10 dB, de -10 a 120)
  for (let i = 0; i <= 13; i++) {
    const yLine = graphY + i * (graphH / 13);
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
  doc.text("Hz", graphX + graphW + 4, graphY - 2, { align: "left" });
  for (let i = 0; i <= 13; i++) {
    const dB = -10 + i * 10;
    const yTick = graphY + i * (graphH / 13) + 0.5;
    doc.text(String(dB), graphX - 3, yTick, { align: "right" });
  }
  doc.text("dB", graphX - 10, graphY + graphH / 2 - 2, { align: "right" });

  // INTEGRACIÓN: aquí debes pasar tu array de puntos dinámicos
  // Ejemplo: const puntos = datos.puntosAudiometria || [];
  const puntos = [
    //aerea
    //rojo circulo
    { freq: 500, db: datos.od500, color: "red", tipo: "circle" },
    { freq: 1000, db: datos.od1000, color: "red", tipo: "circle" },
    { freq: 2000, db: datos.od2000, color: "red", tipo: "circle" },
    { freq: 3000, db: datos.od3000, color: "red", tipo: "circle" },
    { freq: 4000, db: datos.od4000, color: "red", tipo: "circle" },
    { freq: 6000, db: datos.od6000, color: "red", tipo: "circle" },
    { freq: 8000, db: datos.od8000, color: "red", tipo: "circle" },
    //azul x
    { freq: 500, db: datos.oi500, color: "blue", tipo: "x" },
    { freq: 1000, db: datos.oi1000, color: "blue", tipo: "x" },
    { freq: 2000, db: datos.oi2000, color: "blue", tipo: "x" },
    { freq: 3000, db: datos.oi3000, color: "blue", tipo: "x" },
    { freq: 4000, db: datos.oi4000, color: "blue", tipo: "x" },
    { freq: 6000, db: datos.oi6000, color: "blue", tipo: "x" },
    { freq: 8000, db: datos.oi8000, color: "blue", tipo: "x" },
    //Osea
    //rojo [
    { freq: 500, db: datos.od1500, color: "red", tipo: "bracketLeft" },
    { freq: 1000, db: datos.od11000, color: "red", tipo: "bracketLeft" },
    { freq: 2000, db: datos.od12000, color: "red", tipo: "bracketLeft" },
    { freq: 3000, db: datos.od13000, color: "red", tipo: "bracketLeft" },
    { freq: 4000, db: datos.od14000, color: "red", tipo: "bracketLeft" },
    { freq: 6000, db: datos.od16000, color: "red", tipo: "bracketLeft" },
    { freq: 8000, db: datos.od18000, color: "red", tipo: "bracketLeft" },
    //azul ]
    { freq: 500, db: datos.oi1500, color: "blue", tipo: "bracketRight" },
    { freq: 1000, db: datos.oi11000, color: "blue", tipo: "bracketRight" },
    { freq: 2000, db: datos.oi12000, color: "blue", tipo: "bracketRight" },
    { freq: 3000, db: datos.oi13000, color: "blue", tipo: "bracketRight" },
    { freq: 4000, db: datos.oi14000, color: "blue", tipo: "bracketRight" },
    { freq: 6000, db: datos.oi16000, color: "blue", tipo: "bracketRight" },
    { freq: 8000, db: datos.oi18000, color: "blue", tipo: "bracketRight" },
  ];
  const tipos = [
    { tipo: "circle", color: "red" },
    { tipo: "x", color: "blue" },
    { tipo: "bracketLeft", color: "red" },
    { tipo: "bracketRight", color: "blue" },
  ];
  const prevLineWidth = doc.getLineWidth();
  tipos.forEach(({ tipo, color }) => {
    // Filtrar puntos de este tipo y color, y ordenarlos por frecuencia y solo válidos
    const pts = puntos
      .filter(
        (p) =>
          p.tipo === tipo &&
          p.color === color &&
          p.db !== null &&
          p.db !== undefined
      )
      .sort((a, b) => a.freq - b.freq);
    if (pts.length < 2) return;
    doc.setLineWidth(0.4);
    if (color === "red") doc.setDrawColor(255, 0, 0);
    else if (color === "blue") doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineCap(1);
    let prev = null;
    for (let i = 0; i < pts.length; i++) {
      const freqIdx = freqs.indexOf(pts[i].freq);
      if (freqIdx === -1) continue;
      const x = graphX + freqIdx * (graphW / (freqs.length - 1));
      const y = graphY + ((pts[i].db + 10) / 130) * graphH;
      if (prev) {
        doc.line(prev.x, prev.y, x, y);
      }
      prev = { x, y };
    }
  });
  // Dibujar los puntos (círculo, X, [, ])
  puntos.forEach((punto) => {
    if (punto.db === null || punto.db === undefined) return;
    const freqIdx = freqs.indexOf(punto.freq);
    if (freqIdx === -1) return;
    const x = graphX + freqIdx * (graphW / (freqs.length - 1));
    const yP = graphY + ((punto.db + 10) / 130) * graphH;
    // Color correcto para corchetes
    if (punto.tipo === "bracketLeft") {
      doc.setDrawColor(255, 0, 0); // rojo
    } else if (punto.tipo === "bracketRight") {
      doc.setDrawColor(0, 0, 255); // azul
    } else if (punto.color === "red") doc.setDrawColor(255, 0, 0);
    else if (punto.color === "blue") doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    if (punto.tipo === "circle") {
      doc.circle(x, yP, 1.0);
    } else if (punto.tipo === "x") {
      const size = 2;
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP + size / 2);
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP - size / 2);
    } else if (punto.tipo === "bracketLeft") {
      const size = 2;
      doc.line(x - size / 2, yP - size / 2, x - size / 2, yP + size / 2);
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP - size / 2);
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP + size / 2);
    } else if (punto.tipo === "bracketRight") {
      const size = 2;
      doc.line(x + size / 2, yP - size / 2, x + size / 2, yP + size / 2);
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP - size / 2);
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP + size / 2);
    }
    doc.setDrawColor(0, 0, 0);
  });
  doc.setLineWidth(prevLineWidth);

  y += legendH + 5;

  // =====================
  // 8.- Interpretación – Conclusiones
  // =====================
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("8.- Interpretación – Conclusiones:", margin, y);
  y += 6;

  // =====================
  // 9.- Interpretación Clínica
  // =====================
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(
    "• Interpretación Clínica: Dx Auditivo + (Incluir detalle: Severidad (Promedio Frec. 500/1000/2000/4000) + (Unilateral/bilateral))",
    margin,
    y
  );
  y += 4;

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Oido Derecho:  ", margin + 5, y);

  // Texto subrayado para el diagnóstico del oído derecho
  const diagOdText = String(datos.txtdiagOd || "");
  const diagOdWidth = doc.getTextWidth(diagOdText);
  doc.text(diagOdText, margin + 25, y);
  // doc.line(margin + 25, y + 1, margin + 25 + diagOdWidth, y + 1);

  y += 4;
  doc.text("Oido Izquierdo:  ", margin + 5, y);

  // Texto subrayado para el diagnóstico del oído izquierdo
  const diagOiText = String(datos.txtdiagOi || "");
  const diagOiWidth = doc.getTextWidth(diagOiText);
  doc.text(diagOiText, margin + 25, y);
  // doc.line(margin + 25, y + 1, margin + 25 + diagOiWidth, y + 1);

  y += 6;

  // =====================
  // 10.- Comentarios
  // =====================
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("COMENTARIOS:", margin, y);
  y += 4;

  doc.setFont("helvetica", "normal").setFontSize(8);
  const comentariosText = String(datos.txtcomentarios || "");
  const comentariosLines = doc.splitTextToSize(
    comentariosText,
    pageW - margin * 2 - 10
  );
  doc.text(comentariosLines, margin + 5, y, {
    maxWidth: pageW - margin * 2 - 10,
  });
  y += comentariosLines.length * 3 + 6;

  // =====================
  // 11.- Recomendaciones
  // =====================
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("11.- Recomendaciones:", margin, y);
  y += 4;

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(
    "Uso adecuado de Protección Auditiva.................................",
    margin,
    y
  );
  doc.text("Simple", margin + 80, y);
  doc.text("Doble", margin + 100, y);

  // doc.text(`${datos.chkrpasimple ? "X" : ""}`, margin + 75, y);
  // doc.text(`${datos.chkrpadoble ? "X" : ""}`, margin + 95, y);
  // y += 4;

  // Caja para "Simple"
  doc.rect(margin + 74, y - 3, 4, 4); // x, y, width, height
  doc.text(`${datos.chkrpasimple ? "X" : ""}`, margin + 75, y);

  // Caja para "Doble"
  doc.rect(margin + 94, y - 3, 4, 4);
  doc.text(`${datos.chkrpadoble ? "X" : ""}`, margin + 95, y);
  y += 4;

  doc.text(
    "Control audiométrico............................................................",
    margin,
    y
  );
  doc.text("Semestral", margin + 80, y);
  doc.text("Anual", margin + 100, y);
  // Caja para "Semestral"
  doc.rect(margin + 74, y - 3, 4, 4);
  doc.text(`${datos.chkcasemestral ? "X" : ""}`, margin + 75, y);

  // Caja para "Anual"
  doc.rect(margin + 94, y - 3, 4, 4);
  doc.text(`${datos.chkcaanual ? "X" : ""}`, margin + 95, y);
  y += 4;

  doc.text("Otras", margin, y);
  const otrasRecomendacionesText = String(datos.txtotrasrecomendaciones || "");
  const otrasLines = doc.splitTextToSize(
    otrasRecomendacionesText,
    pageW - margin * 2 - 50
  );
  doc.text(otrasLines, margin + 20, y, { maxWidth: pageW - margin * 2 - 50 });
  y += Math.max(otrasLines.length * 3, 4) + 8;

  // =====================
  // Firmas y Sellos
  // =====================
  const signatureY = y;
  const signatureW = (pageW - margin * 2 - 20) / 3;

  // Firma del Trabajador (izquierda)
  doc.line(margin, signatureY, margin + signatureW, signatureY);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma del Trabajador", margin + signatureW / 2, signatureY + 4, {
    align: "center",
  });

  // Huella digital y Personal (centro)
  const centerX = margin + signatureW + 10;
  doc.rect(centerX, signatureY - 8, 15, 12);
  doc.text("Huella digital", centerX + 7.5, signatureY + 8, {
    align: "center",
  });

  doc.line(centerX + 20, signatureY, centerX + 20 + signatureW, signatureY);
  doc.text(
    "Personal que realiza la Audiometría",
    centerX + 20 + signatureW / 2,
    signatureY + 4,
    { align: "center" }
  );

  // Firma y Sello del Médico (derecha)
  const rightX = margin + signatureW * 2 + 20;
  doc.line(rightX, signatureY, rightX + signatureW, signatureY);
  doc.text(
    "Firma y Sello del Médico Evaluador",
    rightX + signatureW / 2,
    signatureY + 4,
    { align: "center" }
  );
};

export default function Audiometria2021_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  body_Audiometria2021_Digitalizado(doc, data);

  // Función para agregar la firma y esperar a que cargue o falle
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // importante si es una URL externa
      img.src = imagenUrl;

      img.onload = () => {
        let sigW = maxw;
        const sigH = 35;
        const baseX = x;
        const baseY = y;
        const maxW = sigW - 10;
        const maxH = sigH - 10;
        let imgW = img.width;
        let imgH = img.height;
        const scale = Math.min(maxW / imgW, maxH / imgH, 1);
        imgW *= scale;
        imgH *= scale;
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;
        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve(); // se resuelve al cargar
      };

      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve(); // también resolvemos si falla (para no bloquear)
      };
    });
  };

  const firmas = (data.digitalizacion || []).reduce(
    (acc, d) => ({
      ...acc,
      [d.nombreDigitalizacion]: d.url,
    }),
    {}
  );

  // Arreglo de firmas que quieres cargar
  const firmasAPintar = [
    { nombre: "FIRMAP", x: -8, y: 255, maxw: 100 },
    { nombre: "HUELLA", x: 36, y: 255, maxw: 100 },
    { nombre: "SELLOFIRMA", x: 100, y: 255, maxw: 50 },
    { nombre: "SELLOFIRMADOCASIG", x: 112, y: 252, maxw: 120 },
  ];

  // Crear promesas para todas las firmas existentes
  const promesasFirmas = firmasAPintar
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  Promise.all(promesasFirmas).then(() => {
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
  });
}
