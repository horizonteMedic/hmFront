import jsPDF from "jspdf";
import headerFicha from "./headers/header_CuestionarioAudiometria_Digitalizado.jsx";
import footer from "../components/footer.jsx";

/**
 * Genera y muestra la FICHA AUDIOLÓGICA con todas las preguntas (1–16),
 * casillas SI/NO sin líneas, todo más compacto con letra tamaño 9.
 *
 * @param {object} datos  
 *   datos.preguntas = [
 *     { numero: 1, valor: "SI"|"NO" }, …, { numero: 16, valor: "" }
 *   ];
 *   datos.nroficha? – para el pie de página
 */
export default function FichaAudiologica_Digitalizado(datos) {
  const doc     = new jsPDF();
  const margin  = 8;
  const pageW   = doc.internal.pageSize.getWidth();
  const pageH   = doc.internal.pageSize.getHeight();
  const boxSize = 5;
  const boxGap  = 3;
  const lineH   = 5;
  const startY  = 65;
  let   y       = startY;

  // 1) Header maqueta
  headerFicha(doc);

  // 2) Sección título
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("II.- PREGUNTAS", margin, y);
  y += lineH;
  doc.setFont("helvetica", "normal").setFontSize(9);

  // 3) Preguntas 1–15
  const preguntas = [
    { numero:1, texto:"1.- Tiene conocimiento de algún problema del oído y/o audición que haya tenido o haya sido diagnosticado y/o en estudio, así como: pérdida de audición, hipoacusia, otitis media agudo, crónico, supurativo externo, presencia de secreción purulenta y/o sanguinolenta con o sin mal olor, escucha sonidos como pititos, soplidos del viento, sonido del mar, acúfenos, tinnitus, mareos, vértigo, náuseas, rinitis alérgica, parálisis facial, adormecimiento de hemicorpo, tumores del sistema nervioso central."},
    { numero:2, texto:"2.- Ha realizado viaje o ha llegado de viaje en las 16 horas anteriores a esta entrevista y examen."},
    { numero:3, texto:"3.- Ha estado escuchando música con audífonos en las 16 horas anteriores a esta entrevista o examen."},
    { numero:4, texto:"4.- Se ha desplazado y/o movilizado en moto lineal y/o en vehículo con las ventanas abiertas."},
    { numero:5, texto:"5.- Ha trabajado expuesto a ruido y/o vibraciones en las 16 horas anteriores a esta entrevista y examen."},
    { numero:6, texto:"6.- Ha bebido bebidas alcohólicas y/o fumó cigarrillos en las 16 horas anteriores a esta entrevista y examen."},
    { numero:7, texto:"7.- Ha estado despierto o trabajando en turno de noche 16 horas anteriores a esta entrevista y examen."},
    { numero:8, texto:"8.- ¿Está resfriado con tos, con dolor auricular, fiebre y/u otra enfermedad respiratoria aguda?"},
    { numero:9, texto:"9.- ¿Le han practicado cirugía de oído (timpanoplastía, mastoidectomía, estapediectomía)?"},
    { numero:10,texto:"10.- ¿Ha tenido traumatismo craneoencefálico, traumatismo en el oído?"},
    { numero:11,texto:"11.- ¿Ha consumido o consume medicamentos como: Cisplatino, aminoglucósidos (vancomicina y amikacina), aspirina, furosemida y/o antituberculosos?"},
    { numero:12,texto:"12.- ¿Ha estado expuesto a solventes orgánicos (tolueno, xileno, disulfuro de carbono, plomo, mercurio, monóxido de carbono), plaguicidas, organofosforados y piretroides?"},
    { numero:13,texto:"13.- ¿Ha estado expuesto a vibraciones continuas?"},
    { numero:14,texto:"14.- ¿Sufre de: hipertensión arterial, diabetes mellitus, hipotiroidismo, insuficiencia renal crónica, enfermedades autoinmunes?"},
    { numero:15,texto:"15.- ¿Consume cigarrillos?"}
  ];

  preguntas.forEach(p => {
    const resp = datos.preguntas?.find(q => q.numero===p.numero)?.valor || "";

    // particionar texto
    const maxTextW = pageW - 2*margin - (boxSize*2 + boxGap*2);
    const lines    = doc.splitTextToSize(p.texto, maxTextW); 

    // agregar página si hace falta
    const neededH = lines.length*lineH + lineH*2;
    if (y+neededH > pageH-margin) {
      doc.addPage();
      headerFicha(doc);
      y = startY;
      doc.setFont("helvetica","bold").setFontSize(9);
      doc.text("II.- PREGUNTAS", margin, y);
      y += lineH;
      doc.setFont("helvetica","normal").setFontSize(9);
    }

    // dibujar texto
    lines.forEach((ln,i) => {
      doc.text(ln, margin, y + i*lineH);
    });

    // casillas pegadas al margen, elevadas 1px
    const yLastLine = y + (lines.length-1)*lineH;
    const yBox      = yLastLine + lineH/2 - 1;
    const xBoxNO    = pageW - margin - boxSize;
    const xBoxSI    = xBoxNO - boxSize - boxGap;

    doc.rect(xBoxSI, yBox - boxSize/2, boxSize, boxSize);
    doc.rect(xBoxNO, yBox - boxSize/2, boxSize, boxSize);

    if (resp==="SI") doc.text("X", xBoxSI+boxSize/2, yBox, {align:"center"});
    if (resp==="NO") doc.text("X", xBoxNO+boxSize/2, yBox, {align:"center"});

    y = yLastLine + lineH*1.3;
  });

  // 4) Pregunta 16 con sub-actividades
  doc.setFont("helvetica","normal").setFontSize(9);
  const lbl16 = "16.- ¿Ha realizado actividades de?   ¿Cuánto tiempo?   ¿Cuánto tiempo?";
  doc.text(lbl16, margin, y);
  y += lineH;

  const left  = ["Caza","Tiro al blanco","Concurrencia a discotecas y/o bares"];
  const right = ["Uso de auriculares","Servicio militar","Boxeo"];
  const midX  = margin + (pageW-2*margin)/2;

  left.forEach((txt,i) => {
    doc.rect(margin, y + i*lineH, boxSize, boxSize);
    doc.text(txt, margin+boxSize+2, y + i*lineH + boxSize - 1);
  });
  right.forEach((txt,i) => {
    doc.rect(midX, y + i*lineH, boxSize, boxSize);
    doc.text(txt, midX+boxSize+2, y + i*lineH + boxSize - 1);
  });

  // 5) Footer
  footer(doc, datos);

  // 6) Mostrar e imprimir
  const blob   = doc.output("blob");
  const url    = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
