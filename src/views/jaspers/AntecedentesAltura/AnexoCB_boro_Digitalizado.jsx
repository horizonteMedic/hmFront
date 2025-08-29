import jsPDF from "jspdf";
import Header_AnexoCB_boro_Digitalizado from "./Header/Header_AnexoCB_boro_Digitalizado";

export default function GenerarDatosPacienteBoro(data = {}) {
  const datos = {
    antecedentes: data.antecedentes ?? [
      { texto: "Accidente cerebrovascular", si: true, no: false },
      { texto: "Angina inestable", si: true, no: false },
      { texto: "Antecedente de Bypass arterial coronario/AngioplastÍa/Stent", si: true, no: false },
      { texto: "Antecedente de edema cerebral de altura", si: true, no: false },
      { texto: "Antecendente de edema pulmonar de altura", si: true, no: false },
      { texto: "Antecedente de Neumotórax en los ultimos 6 meses", si: true, no: false },
      { texto: "Arritmia cardiaca no controlada", si: true, no: false },
      { texto: "Cardiomiopatía hipertrófica idiopática", si: false, no: true },
      { texto: "Cirugía mayor en los últimos 30 días", si: false, no: true },
      { texto: "Cualquier insuficiencia en la válvula aórtica", si: true, no: false },
      { texto: "Diabetes Mellitus", si: true, no: false },
      { texto: "Embarazo", si: true, no: false },
      { texto: "Epilepsia", si: true, no: false },
      { texto: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada", si: true, no: false },
      { texto: "Eritrocitosis excesiva (mal de montaña crónico)", si: true, no: false },
      { texto: "Hipertensión arterial", si: true, no: false },
      { texto: "Hipertensión pulmonar", si: true, no: false },
      { texto: "Infarto al miocardio en los últimos 6 meses", si: true, no: false },
      { texto: "Insuficiencia cardíaca congestiva", si: true, no: false },
      { texto: "Patología hemorrágica de retina", si: true, no: false },
      { texto: "Patología Valvular Cardiáca en tratamiento", si: false, no: true },
      { texto: "Presencia de marcapasos", si: false, no: true },
      { texto: "Presencia de riesgo cardiovascular alto", si: true, no: false },
      { texto: "Trastornos de la coagulación", si: false, no: true },
      { texto: "Trombosis venosa cerebral", si: false, no: true },
      { texto: "Otros", si: true, no: false },
    ],
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
   
  // Variables para firma de prueba en comentarios
  const firmaPruebaX = leftMargin + 58;
  const firmaPruebaY = y -19;
  const firmaPruebaWidth = 45;
  const firmaPruebaHeight = 25;
  
  // Variables para huella digital en comentarios
  const huellaDigitalX = leftMargin + 105;
  const huellaDigitalY = y - 19;
  const huellaDigitalWidth = 25;
  const huellaDigitalHeight = 18;
  
  // Agregar firma de prueba y huella flotantes
  doc.addImage("public/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png", "PNG", firmaPruebaX, firmaPruebaY, firmaPruebaWidth, firmaPruebaHeight);
   
  // Agregar huella digital (ajustada para que salga vertical)
  doc.addImage("public/img/firmas_sellos_prueba/HUELLA_DIGITAL.png", "PNG", huellaDigitalX, huellaDigitalY, huellaDigitalHeight, huellaDigitalWidth);
  y += 5;

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
  doc.text("APTO ( )", leftMargin, y);
  doc.text(", NO APTO (X)", leftMargin + 35, y);
  doc.setFont("helvetica", "normal");
  doc.text(" para acceder a emplazamientos ubicados en Gran Altitud Geográfica (>2500 msnm)", leftMargin + 75, y);
  y += 8;

  // ===== LUGAR Y FECHA DE EVALUACIÓN =====
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Lugar y Fecha de Evaluación:", leftMargin, y);
  y += 4;
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Trujillo-Pierola, 04/11/2024", leftMargin, y);
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
  doc.addImage("public/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png", "PNG", firmaTrabajadorX, firmaTrabajadorY, firmaTrabajadorWidth, firmaTrabajadorHeight);
  doc.addImage("public/img/firmas_sellos_prueba/HUELLA_DIGITAL.png", "PNG", huellaTrabajadorX, huellaTrabajadorY, huellaTrabajadorHeight, huellaTrabajadorWidth);
  y += 35;

  // ===== SELLO Y FIRMA DEL MÉDICO =====
  // Sello y firma del médico (derecha) - alineado con la huella del lado izquierdo
  const firmaMedicoX = leftMargin + 120;
  const firmaMedicoY = y - 35; // Subir para alinear con la huella
  const firmaMedicoWidth = 52;
  const firmaMedicoHeight = 28;
  
  // Agregar firma y sello médico
  doc.addImage("public/img/firmas_sellos_prueba/firma_sello.png", "PNG", firmaMedicoX, firmaMedicoY, firmaMedicoWidth, firmaMedicoHeight);
  
  // Línea horizontal debajo de la firma del médico
  doc.line(leftMargin + 110, firmaMedicoY + 25, leftMargin + 180, firmaMedicoY + 25);
  
  // Texto "Sello y Firma del Médico Responsable de la Evaluación"
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sello y Firma del Médico Responsable de la Evaluación", leftMargin + 110, firmaMedicoY + 30);
  y += 10;

  // Imprimir / Preview
  imprimir(doc);
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
