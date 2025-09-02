import jsPDF from "jspdf";
import Header_AnexoCB_boro_Digitalizado from "./Header/Header_AnexoCB_boro_Digitalizado";
import { formatearFechaCorta } from "../../utils/formatDateUtils";

export default function GenerarDatosPacienteBoro(data = {}) {
  const datos = {
    nombreSede: String(data.sede || ""),
    antecedentes: [
      { texto: "Accidente cerebrovascular", 
        si: data?.antecedentes?.accidenteCerebroVascularSi,
        no: data?.antecedentes?.accidenteCerebroVascularNo },
      { texto: "Angina inestable", 
        si: data?.antecedentes?.anginaInestableSi,
        no: data?.antecedentes?.anginaInestableNo },
      { texto: "Antecedente de Bypass arterial coronario/AngioplastÍa/Stent", 
        si: data?.antecedentes?.antecedenteBypassArterialSi,
        no: data?.antecedentes?.antecedenteBypassArterialNo },
      { texto: "Antecedente de edema cerebral de altura", 
        si: data?.antecedentes?.antecedenteEdemaCerebralSi,
        no: data?.antecedentes?.antecedenteEdemaCerebralNo },
      { texto: "Antecendente de edema pulmonar de altura", 
        si: data?.antecedentes?.antecedenteEdemaPulmonarSi,
        no: data?.antecedentes?.antecedenteEdemaPulmonarNo },
      { texto: "Antecedente de Neumotórax en los ultimos 6 meses", 
        si: data?.antecedentes?.antecedenteNeumotoraxSi,
        no: data?.antecedentes?.antecedenteNeumotoraxNo },
      { texto: "Arritmia cardiaca no controlada", 
        si: data?.antecedentes?.arritmiaCardiacaSi,
        no: data?.antecedentes?.arritmiaCardiacaNo },
      { texto: "Cardiomiopatía hipertrófica idiopática", 
        si: data?.antecedentes?.cardiomiopatiaSi,
        no: data?.antecedentes?.cardiomiopatiaNo },
      { texto: "Cirugía mayor en los últimos 30 días", 
        si: data?.antecedentes?.cirujiaMayorSi,
        no: data?.antecedentes?.cirujiaMayorNo }, 
      { texto: "Cualquier insuficiencia en la válvula aórtica", 
        si: data?.antecedentes?.cualquierInsuficienciaSi,
        no: data?.antecedentes?.cualquierInsuficienciaNo },
      { texto: "Diabetes Mellitus", 
        si: data?.antecedentes?.diabetesMellitusSi,
        no: data?.antecedentes?.diabetesMellitusNo },
      { texto: "Embarazo", 
        si: data?.antecedentes?.embarazoSi,
        no: data?.antecedentes?.embarazoNo },
      { texto: "Epilepsia", 
        si: data?.antecedentes?.epilepsiaSi,
        no: data?.antecedentes?.epilepsiaNo },
      { texto: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada", 
        si: data?.antecedentes?.epocSi,
        no: data?.antecedentes?.epocNo },
      { texto: "Eritrocitosis excesiva (mal de montaña crónico)", 
        si: data?.antecedentes?.eritrocitosisSi,
        no: data?.antecedentes?.eritrocitosisNo },
      { texto: "Hipertensión arterial", 
        si: data?.antecedentes?.hipertensionArterialSi,
        no: data?.antecedentes?.hipertensionArterialNo },
      { texto: "Hipertensión pulmonar", 
        si: data?.antecedentes?.hipertensionPulmonarSi,
        no: data?.antecedentes?.hipertensionPulmonarNo },
      { texto: "Infarto al miocardio en los últimos 6 meses", 
        si: data?.antecedentes?.infartoMiocardioSi,
        no: data?.antecedentes?.infartoMiocardioNo },
      { texto: "Insuficiencia cardíaca congestiva", 
        si: data?.antecedentes?.insuficienciaCardiacaSi,
        no: data?.antecedentes?.insuficienciaCardiacaNo },
      { texto: "Patología hemorrágica de retina", 
        si: data?.antecedentes?.patologiaHemorragicaSi,
        no: data?.antecedentes?.patologiaHemorragicaNo },
      { texto: "Patología Valvular Cardiáca en tratamiento", 
        si: data?.antecedentes?.patologiaValvularSi,
        no: data?.antecedentes?.patologiaValvularNo },
      { texto: "Presencia de marcapasos", 
        si: data?.antecedentes?.presenciaMarcaPasosSi,
        no: data?.antecedentes?.presenciaMarcaPasosNo },
      { texto: "Presencia de riesgo cardiovascular alto", 
        si: data?.antecedentes?.presenciaRiesgoCardioSi,
        no: data?.antecedentes?.presenciaRiesgoCardioNo },
      { texto: "Trastornos de la coagulación", 
        si: data?.antecedentes?.transtornoCoagulacionSi,
        no: data?.antecedentes?.transtornoCoagulacionNo },
      { texto: "Trombosis venosa cerebral", 
        si: data?.antecedentes?.trombosisSi,
        no: data?.antecedentes?.trombosisNo },
      { texto: "Otros", 
        si: data?.antecedentes?.otrosSi,
        no: data?.antecedentes?.otrosNo },
    ],
    observaciones: data?.antecedentes?.observaciones??"",
    esApto: data?.antecedentes?.esApto,
    fechaExamen: formatearFechaCorta(data?.antecedentes?.fechaAntecedente ?? "")
  };

  const doc = new jsPDF();
  
  // Usar el header de Boro - solo pasar los datos necesarios
  let y = Header_AnexoCB_boro_Digitalizado(doc, data);
  
  const leftMargin = 10;

  // ===== TABLA ANTECEDENTES PATOLÓGICOS =====
  const colTexto = 170, colNo = 10, colSi = 10;
  doc.setFont("helvetica", "bold");

 // Encabezados
doc.rect(leftMargin, y, colTexto, 8);
doc.setFontSize(10);
doc.text("2. ANTECEDENTES PATOLÓGICOS", leftMargin + 2, y + 5);


  doc.rect(leftMargin + colTexto, y, colNo, 8);
  doc.text("NO", leftMargin + colTexto + colNo/2, y + 5, { align: "center" });

  doc.rect(leftMargin + colTexto + colNo, y, colSi, 8);
  doc.text("SI", leftMargin + colTexto + colNo + colSi/2, y + 5, { align: "center" });

  y += 8;

  doc.setFont("helvetica", "normal").setFontSize(8.5);
  datos.antecedentes.forEach((item) => {
    let textoDividido = doc.splitTextToSize(item.texto, colTexto - 4);
    let altura = textoDividido.length * 4 + 1;

    // Texto
    doc.rect(leftMargin, y, colTexto, altura);
    doc.text(textoDividido, leftMargin + 2, y + 3.5);

    // NO
    doc.rect(leftMargin + colTexto, y, colNo, altura);
    if (item.no === true) doc.text("X", leftMargin + colTexto + colNo/2, y + 3, { align: "center" });

    // SI
    doc.rect(leftMargin + colTexto + colNo, y, colSi, altura);
    if (item.si === true) doc.text("X", leftMargin + colTexto + colNo + colSi/2, y + 3, { align: "center" });

    y += altura;
  });

  // ===== COMENTARIOS DEL MÉDICO =====
  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin, y, 190, 8);
  doc.text("3. Comentarios del Médico :", leftMargin + 2, y + 4);
  y += 8;
   

  

  // ===== 4. CONCLUSIONES =====
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("4. CONCLUSIONES", leftMargin, y);
  y += 6;

  // Texto de certificación
  doc.setFont("helvetica", "normal").setFontSize(8);
  const certificacionTexto = "Revisados los antecedentes y examen médico según anexo16, por el presente documento certifico que él/ella se encuentra";
  doc.text(certificacionTexto, leftMargin, y);
  y += 4;

  // Opciones APTO/NO APTO en línea con el texto
  doc.setFont("helvetica", "bold");
  doc.text(`APTO (${datos.esApto ? "X" : " "})`, leftMargin, y);
  doc.text(`, NO APTO (${!datos.esApto ? "X" : " "})`, leftMargin + 35, y);
  doc.setFont("helvetica", "normal");
  doc.text(" para acceder a emplazamientos ubicados en Gran Altitud Geográfica (>2500 msnm)", leftMargin + 75, y);
  y += 8;

  // ===== LUGAR Y FECHA DE EVALUACIÓN =====
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Lugar y Fecha de Evaluación:", leftMargin, y);
  y += 4;
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${datos.nombreSede}, ${datos.fechaExamen}`, leftMargin, y);
  y += 8;

  // ===== FIRMA DEL TRABAJADOR =====
  // Firma del trabajador (izquierda)
  const firmaTrabajadorX = leftMargin + 15;
  const firmaTrabajadorY = y;
  const firmaTrabajadorWidth = 60;
  const firmaTrabajadorHeight = 30;
  
  // Huella digital (derecha de la firma del trabajador)
  const huellaTrabajadorX = leftMargin + 76;
  const huellaTrabajadorY = y;
  const huellaTrabajadorWidth = 23;
  const huellaTrabajadorHeight = 15;
  
  // Agregar firma del trabajador y huella
  // doc.addImage("public/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png", "PNG", firmaTrabajadorX, firmaTrabajadorY, firmaTrabajadorWidth, firmaTrabajadorHeight);
  // doc.addImage("public/img/firmas_sellos_prueba/HUELLA_DIGITAL.png", "PNG", huellaTrabajadorX, huellaTrabajadorY, huellaTrabajadorHeight, huellaTrabajadorWidth);
  y += 35;

  // ===== SELLO Y FIRMA DEL MÉDICO =====
  // Sello y firma del médico (derecha) - alineado con la huella del lado izquierdo
  const firmaMedicoX = leftMargin + 120;
  const firmaMedicoY = y - 35; // Subir para alinear con la huella
  const firmaMedicoWidth = 52;
  const firmaMedicoHeight = 28;
  
  // Agregar firma y sello médico
  // doc.addImage("public/img/firmas_sellos_prueba/firma_sello.png", "PNG", firmaMedicoX, firmaMedicoY, firmaMedicoWidth, firmaMedicoHeight);
  
  // Línea horizontal debajo de la firma del médico
  doc.line(leftMargin + 110, firmaMedicoY + 25, leftMargin + 180, firmaMedicoY + 25);
  
  // Texto "Sello y Firma del Médico Responsable de la Evaluación"
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sello y Firma del Médico Responsable de la Evaluación", leftMargin + 110, firmaMedicoY + 30);
  y += 10;

  
   const firmasAPintar = [
    {
      nombre: "FIRMAP",
      x: firmaTrabajadorX,
      y: firmaTrabajadorY,
      maxw: 40,
    },
    {
      nombre: "HUELLA",
      x: huellaTrabajadorX,
      y: huellaTrabajadorY,
      maxw: 15,
    },
    {
      nombre: "SELLOFIRMA",
      x: firmaMedicoX,
      y: firmaMedicoY-10,
      maxw: 50,
    },
  ];

  // Validar que data.informacionSede exista antes de acceder a sus propiedades
  const digitalizacion = data?.digitalizacion || [];
  agregarFirmas(doc, digitalizacion, firmasAPintar).then(() => {
    imprimir(doc);
  });
}

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}

function agregarFirmas(doc, digitalizacion = [], firmasAPintar = []) {
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagenUrl;
      img.onload = () => {
        const sigH = 35; // alto máximo
        const maxW = maxw; // ancho máximo como parámetro
        const baseX = x;
        const baseY = y;

        let imgW = img.width;
        let imgH = img.height;

        // Escala proporcional en base a ancho y alto máximos
        const scale = Math.min(maxW / imgW, sigH / imgH, 1);
        imgW *= scale;
        imgH *= scale;

        // Ahora el ancho se adapta
        const sigW = imgW;

        // Centrar la imagen
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;

        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve();
      };
      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve();
      };
    });
  };

  const firmas = digitalizacion.reduce(
    (acc, d) => ({ ...acc, [d.nombreDigitalizacion]: d.url }),
    {}
  );

  const promesasFirmas = firmasAPintar
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  return Promise.all(promesasFirmas);
}
