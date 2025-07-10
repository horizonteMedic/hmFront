import jsPDF from "jspdf";
import headerFicha from "./headers/header_FichaAudiologica_Digitalizado.jsx";
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
export default function CuestionarioAudiometria_Digitalizado(datos) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const boxSize = 5;
  const boxGap = 3;
  const lineH = 5;
  const startY = 65;
  let y = startY;

  // 1) Header maqueta
  headerFicha(doc, datos);
  const firmap = datos.digitalizacion?.find(
    (d) => d.nombreDigitalizacion === "FIRMAP"
  );
  const huellap = datos.digitalizacion?.find(
    (d) => d.nombreDigitalizacion === "HUELLA"
  );
  const sellofirma = datos.digitalizacion?.find(
    (d) => d.nombreDigitalizacion === "SELLOFIRMA"
  );
  const isValidUrl = (url) => url && url !== "Sin registro";
  const loadImg = (src) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(firmap?.url) ? loadImg(firmap.url) : Promise.resolve(null),
    isValidUrl(huellap?.url) ? loadImg(huellap.url) : Promise.resolve(null),
    isValidUrl(sellofirma?.url)
      ? loadImg(sellofirma.url)
      : Promise.resolve(null),
  ]).then(([s1, s2, s3]) => {
    // 2) Sección título
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("II.- PREGUNTAS", margin, y);

    doc.text("SI", margin + 182, y);

    doc.text("NO", margin + 189, y);
    y += lineH;
    doc.setFont("helvetica", "normal").setFontSize(9);

    // 3) Preguntas 1–15
    const preguntas = [
      {
        numero: 1,
        texto:
          "1.- Tiene conocimiento de algún problema del oído y/o audición que haya tenido o haya sido diagnosticado y/o en estudio, así como: pérdida de audición, hipoacusia, otitis media agudo, crónico, supurativo externo, presencia de secreción purulenta y/o sanguinolenta con o sin mal olor, escucha sonidos como pititos, soplidos del viento, sonido del mar, acúfenos, tinnitus, mareos, vértigo, náuseas, rinitis alérgica, parálisis facial, adormecimiento de hemicorpo, tumores del sistema nervioso central.",
      },
      {
        numero: 2,
        texto:
          "2.- Ha realizado viaje o ha llegado de viaje en las 16 horas anteriores a esta entrevista y examen.",
      },
      {
        numero: 3,
        texto:
          "3.- Ha estado escuchando música con audífonos en las 16 horas anteriores a esta entrevista o examen.",
      },
      {
        numero: 4,
        texto:
          "4.- Se ha desplazado y/o movilizado en moto lineal y/o en vehículo con las ventanas abiertas.",
      },
      {
        numero: 5,
        texto:
          "5.- Ha trabajado expuesto a ruido y/o vibraciones en las 16 horas anteriores a esta entrevista y examen.",
      },
      {
        numero: 6,
        texto:
          "6.- Ha bebido bebidas alcohólicas y/o fumó cigarrillos en las 16 horas anteriores a esta entrevista y examen.",
      },
      {
        numero: 7,
        texto:
          "7.- Ha estado despierto o trabajando en turno de noche 16 horas anteriores a esta entrevista y examen.",
      },
      {
        numero: 8,
        texto:
          "8.- ¿Está resfriado con tos, con dolor auricular, fiebre y/u otra enfermedad respiratoria aguda?",
      },
      {
        numero: 9,
        texto:
          "9.- ¿Le han practicado cirugía de oído (timpanoplastía, mastoidectomía, estapediectomía)?",
      },
      {
        numero: 10,
        texto:
          "10.- ¿Ha tenido traumatismo craneoencefálico, traumatismo en el oído?",
      },
      {
        numero: 11,
        texto:
          "11.- ¿Ha consumido o consume medicamentos como: Cisplatino, aminoglucósidos (vancomicina y amikacina), aspirina, furosemida y/o antituberculosos?",
      },
      {
        numero: 12,
        texto:
          "12.- ¿Ha estado expuesto a solventes orgánicos (tolueno, xileno, disulfuro de carbono, plomo, mercurio, monóxido de carbono), plaguicidas, organofosforados y piretroides?",
      },
      {
        numero: 13,
        texto: "13.- ¿Ha estado expuesto a vibraciones continuas?",
      },
      {
        numero: 14,
        texto:
          "14.- ¿Sufre de: hipertensión arterial, diabetes mellitus, hipotiroidismo, insuficiencia renal crónica, enfermedades autoinmunes?",
      },
      { numero: 15, texto: "15.- ¿Consume cigarrillos?" },
    ];

    preguntas.forEach((p) => {
      const resp =
        datos.preguntas?.find((q) => q.numero === p.numero)?.valor || "";

      // particionar texto
      const maxTextW = pageW - 2 * margin - (boxSize * 2 + boxGap * 2);
      const lines = doc.splitTextToSize(p.texto, maxTextW);

      // agregar página si hace falta
      const neededH = lines.length * lineH + lineH * 2;
      if (y + neededH > pageH - margin) {
        doc.addPage();
        headerFicha(doc);
        y = startY;
        doc.setFont("helvetica", "bold").setFontSize(9);
        doc.text("II.- PREGUNTAS", margin, y);
        y += lineH;
        doc.setFont("helvetica", "normal").setFontSize(9);
      }

      // dibujar texto
      lines.forEach((ln, i) => {
        doc.text(ln, margin, y + i * lineH);
      });

      // casillas pegadas al margen, elevadas 1px
      const yLastLine = y + (lines.length - 1) * lineH;
      const yBox = yLastLine + lineH / 2 - 2;
      const xBoxNO = pageW - margin - boxSize;
      const xBoxSI = xBoxNO - boxSize - boxGap;

      doc.rect(xBoxSI, yBox - boxSize / 2, boxSize, boxSize);
      doc.rect(xBoxNO, yBox - boxSize / 2, boxSize, boxSize);

      if (datos[`chksi${p.numero}`]) {
        doc.text("X", xBoxSI + boxSize / 2, yBox + 1.2, { align: "center" });
      } else {
        doc.text("X", xBoxNO + boxSize / 2, yBox + 1.2, { align: "center" });
      }

      y = yLastLine + lineH * 1.3;
    });

    // 4) Pregunta 16 con sub-actividades
    doc.setFont("helvetica", "normal").setFontSize(9);
    const lbl16 = "16.- ¿Ha realizado actividades de?";
    doc.text(lbl16, margin, y);
    doc.text("¿Cuánto tiempo?", margin + 62, y);
    doc.text("¿Cuánto tiempo?", margin + 135, y);
    y += lineH;

    const left = [
      { label: "Caza", key: "chkcaza16", tiempo: "txtcaza16" },
      { label: "Tiro al blanco", key: "chktiro16", tiempo: "txttiro16" },
      {
        label: "Concurrencia a discotecas y/o bares",
        key: "chkdiscoteca16",
        tiempo: "txtdiscoteca16",
      },
    ];
    const right = [
      {
        label: "Uso de auriculares",
        key: "chkauriculares16",
        tiempo: "txtauriculares16",
      },
      {
        label: "Servicio militar",
        key: "chkmilitar16",
        tiempo: "txtmilitar16",
      },
      { label: "Boxeo", key: "chkboxeo16", tiempo: "txtboxeo16" },
    ];
    const midX = margin + (pageW - 2 * margin) / 2;

    left.forEach((item, i) => {
      doc.rect(margin, y + i * lineH + 2 * i, boxSize, boxSize);
      doc.text(
        datos[item.key] == true ? "X" : "",
        margin + 1.5,
        y + i * lineH + 2 * i + 3.5
      );
      doc.text(
        datos[item.tiempo] || "",
        margin + boxSize + 2 + 40,
        y + i * lineH + boxSize - 1 + 2 * i
      );
      doc.text(
        item.label,
        margin + boxSize + 2,
        y + i * lineH + boxSize - 1 + 2 * i,
        {
          maxWidth: 30,
        }
      );
    });
    right.forEach((item, i) => {
      doc.rect(midX, y + i * lineH + 2 * i, boxSize, boxSize);
      doc.text(
        datos[item.key] == true ? "X" : "",
        midX + 1.5,
        y + i * lineH + 2 * i + 3.5
      );
      doc.text(
        item.label,
        midX + boxSize + 2,
        y + i * lineH + boxSize - 1 + 2 * i,
        {
          maxWidth: 30,
        }
      );
      doc.text(
        datos[item.tiempo] || "",
        midX + boxSize + 2 + 35,
        y + i * lineH + boxSize - 1 + 2 * i
      );
    });

    if (s1) {
      const canvas = document.createElement("canvas");
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL("image/png");

      // Dimensiones del área del sello - Primera firma (más pequeña)
      const sigW = 60;
      const sigH = 35;
      const sigX = (pageW - 160) / 2;
      const sigY = y + 35;

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Dibujar el borde si quieres

      // Insertar la imagen del sello
      doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
    }

    if (s2) {
      const canvas = document.createElement("canvas");
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL("image/png");

      // Dimensiones del área del sello - Segunda firma (más ancha)
      const sigW = 100;
      const sigH = 35;
      const sigX = (pageW - 160) / 2 + 20;
      const sigY = y + 35;

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s2.width;
      let imgH = s2.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Dibujar el borde si quieres

      // Insertar la imagen del sello
      doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
    }
    if (s3) {
      const canvas = document.createElement("canvas");
      canvas.width = s3.width;
      canvas.height = s3.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(s3, 0, 0);
      const selloBase64 = canvas.toDataURL("image/png");

      // Dimensiones del área del sello - Tercera firma (ubicada a la derecha)
      const sigW = 100;
      const sigH = 35;
      const sigX = (pageW - 160) / 2 + 80; // desplazada más a la derecha
      const sigY = y + 35;

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s3.width;
      let imgH = s3.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Insertar la imagen del sello
      doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
    }

    // 5) Footer
    footer(doc, datos);

    // 6) Mostrar e imprimir
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
