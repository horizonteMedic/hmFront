import jsPDF from "jspdf";

export default function GenerarDatosPaciente(data = {}) {
  const datos = {
    apellidos: data.apellidos ?? "DELGADO VEGA",
    nombres: data.nombres ?? "VIVIANA AYDE",
    dni: data.dni ?? "75461024",
    fechaNacimiento: data.fechaNacimiento ?? "19/03/2000",
    edad: data.edad ?? "25 AÑOS",
    sexo: data.sexo ?? "FEMENINO",
    direccion: data.direccion ?? "AV. EL PELIGRO",
    empresaContratista:
      data.empresaContratista ??
      "ESTA ES UNA EMPRESA SUPER LARGA PARA PROBAR EL AJUSTE DE TEXTO AUTOMÁTICO",
    empresa: data.empresa ?? "MONARCA GOLD S.A.C.",
    actividadRealizar: data.actividadRealizar ?? "CAPATAZ",
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
  const leftMargin = 10;
  let y = 20;

  // ===== TÍTULO =====
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.rect(leftMargin, y, 190, 6);
  doc.text("DATOS DEL PACIENTE", leftMargin + 70, y + 4);
  y += 6;

  // ===== FILA 1: Apellidos - Nombres =====
  doc.setFontSize(8);
  doc.rect(leftMargin, y, 95, 6);
  doc.text("Apellidos :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datos.apellidos, leftMargin + 25, y + 4);

  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + 95, y, 95, 6);
  doc.text("Nombres :", leftMargin + 97, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres, leftMargin + 120, y + 4);
  y += 6;

  // ===== FILA 2: DNI - Fecha Nacimiento - Edad - Sexo =====
  const row2Height = 8;
  const colDNI = 40, colFecha = 70, colEdad = 30, colSexo = 50;

  doc.rect(leftMargin, y, colDNI, row2Height);
  doc.setFont("helvetica", "bold");
  doc.text("DNI :", leftMargin + 2, y + 3);
  doc.setFont("helvetica", "normal");
  doc.text(datos.dni, leftMargin + 2, y + 6);

  doc.rect(leftMargin + colDNI, y, colFecha, row2Height);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nacimiento(dd/mm/aa)", leftMargin + colDNI + 2, y + 3);
  doc.setFont("helvetica", "normal");
  doc.text(datos.fechaNacimiento, leftMargin + colDNI + 2, y + 6);

  doc.rect(leftMargin + colDNI + colFecha, y, colEdad, row2Height);
  doc.setFont("helvetica", "bold");
  doc.text("Edad :", leftMargin + colDNI + colFecha + 2, y + 3);
  doc.setFont("helvetica", "normal");
  doc.text(datos.edad, leftMargin + colDNI + colFecha + 2, y + 6);

  doc.rect(leftMargin + colDNI + colFecha + colEdad, y, colSexo, row2Height);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo :", leftMargin + colDNI + colFecha + colEdad + 2, y + 3);
  doc.setFont("helvetica", "normal");
  doc.text(datos.sexo, leftMargin + colDNI + colFecha + colEdad + 2, y + 6);
  y += row2Height;

  // ===== FILA 3: Dirección =====
  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin, y, 190, 6);
  doc.text("Dirección :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datos.direccion, leftMargin + 25, y + 4);
  y += 6;

  // ===== FILA 4: Empresa Contratista - Empresa - Actividad =====
  const row4Height = 15;
  const colContratista = 70, colEmpresa = 60, colActividad = 60;

  // Empresa Contratista
  doc.rect(leftMargin, y, colContratista, row4Height);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa Contratista :", leftMargin + 2, y + 3);
  doc.setFont("helvetica", "normal");
  let textoContratista = doc.splitTextToSize(datos.empresaContratista, colContratista - 4);
  doc.text(textoContratista, leftMargin + 2, y + 8);

  // Empresa
  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + colContratista, y, colEmpresa, row4Height);
  doc.text("Empresa :", leftMargin + colContratista + 2, y + 3);
  doc.setFont("helvetica", "normal");
  let textoEmpresa = doc.splitTextToSize(datos.empresa, colEmpresa - 4);
  doc.text(textoEmpresa, leftMargin + colContratista + 2, y + 8);

  // Actividad a Realizar
  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + colContratista + colEmpresa, y, colActividad, row4Height);
  doc.text("Actividad a Realizar :", leftMargin + colContratista + colEmpresa + 2, y + 3);
  doc.setFont("helvetica", "normal");
  let textoActividad = doc.splitTextToSize(datos.actividadRealizar, colActividad - 4);
  doc.text(textoActividad, leftMargin + colContratista + colEmpresa + 2, y + 8);
  y += row4Height + 0;

  // ===== TABLA ANTECEDENTES PATOLÓGICOS =====
  const colTexto = 170, colNo = 10, colSi = 10;
  doc.setFont("helvetica", "bold");

  // Encabezados
  doc.rect(leftMargin, y, colTexto, 8);
  doc.text("ANTECEDENTES PATOLÓGICOS", leftMargin + 2, y + 5);

  doc.rect(leftMargin + colTexto, y, colNo, 8);
  doc.text("NO", leftMargin + colTexto + 2, y + 5);

  doc.rect(leftMargin + colTexto + colNo, y, colSi, 8);
  doc.text("SI", leftMargin + colTexto + colNo + 2, y + 5);

  y += 8;

  doc.setFont("helvetica", "normal");
  datos.antecedentes.forEach((item) => {
    let textoDividido = doc.splitTextToSize(item.texto, colTexto - 4);
    let altura = textoDividido.length * 4 + 1;

    // Texto
    doc.rect(leftMargin, y, colTexto, altura);
    doc.text(textoDividido, leftMargin + 2, y + 3.5);

    // NO
    doc.rect(leftMargin + colTexto, y, colNo, altura);
    if (item.no === true) doc.text("X", leftMargin + colTexto + 3, y + 3);

    // SI
    doc.rect(leftMargin + colTexto + colNo, y, colSi, altura);
    if (item.si === true) doc.text("X", leftMargin + colTexto + colNo + 3, y + 3);

    y += altura;
  });

    // ===== COMENTARIOS DEL MÉDICO =====
  // y += 1;
  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin, y, 190, 8);
  doc.text("Comentarios del Médico :", leftMargin + 2, y + 4);
  y += 8;
   
  // Variables para firma de prueba en comentarios
  const firmaPruebaX = leftMargin + 55;
  const firmaPruebaY = y -15;
  const firmaPruebaWidth = 40;
  const firmaPruebaHeight = 22;
  
  // Variables para huella digital en comentarios
  const huellaDigitalX = leftMargin + 99;
  const huellaDigitalY = y - 15;
  const huellaDigitalWidth = 25;
  const huellaDigitalHeight = 18;
  
  // Agregar firma de prueba y huella flotantes
  doc.addImage("public/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png", "PNG", firmaPruebaX, firmaPruebaY, firmaPruebaWidth, firmaPruebaHeight);
  // doc.text("PRUEBA", leftMargin + 135, y);
   
  // Agregar huella digital (ajustada para que salga vertical)
  // Intercambiamos width y height para que la huella salga vertical
  doc.addImage("public/img/firmas_sellos_prueba/HUELLA_DIGITAL.png", "PNG", huellaDigitalX, huellaDigitalY, huellaDigitalHeight, huellaDigitalWidth);
  y += 5;

  // ===== CERTIFICACIÓN DE APTITUD =====
  // y += 5;
  doc.setFont("helvetica", "normal").setFontSize(8);
  const certificacionTexto = "Revisados los antecedentes y examen médico según anexo16, por el presente documento certifico que él/ella se encuentra";
  doc.text(certificacionTexto, leftMargin, y);
  y += 4;

  // Opciones APTO/NO APTO en línea con el texto
  doc.text("APTO ( )", leftMargin, y);
  doc.text(", NO APTO ( )", leftMargin + 35, y);
  doc.text(" X", leftMargin + 75, y);
  doc.text(" para acceder a emplazamientos ubicados en Gran Altitud Geográfica (>2500 msnm)", leftMargin + 85, y);
  y += 4;

  // ===== TABLA INFORMACIÓN DEL MÉDICO RESPONSABLE =====
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.rect(leftMargin, y, 190, 8);
  doc.text("INFORMACIÓN DEL MÉDICO RESPONSABLE DEL EXAMEN", leftMargin + 2, y + 5);
  y += 8;

  // Fila 1: Apellidos - Nombres
  const medicoRowHeight = 8;
  doc.rect(leftMargin, y, 95, medicoRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("Apellidos :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text("SOPLOPUCO MARCE", leftMargin + 25, y + 4);

  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + 95, y, 95, medicoRowHeight);
  doc.text("Nombres :", leftMargin + 97, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text("SHNEIDER", leftMargin + 120, y + 4);
  y += medicoRowHeight;

  // Fila 2: Dirección
  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin, y, 190, medicoRowHeight);
  doc.text("Dirección :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text("null", leftMargin + 25, y + 4);
  y += medicoRowHeight;

  // Fila 3: Correo - Fax - Cel
  const colCorreo = 65, colFax = 65, colCel = 60;
  doc.rect(leftMargin, y, colCorreo, medicoRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("Correo electrónico :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  // doc.text("", leftMargin + 25, y + 4);

  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + colCorreo, y, colFax, medicoRowHeight);
  doc.text("Fax :", leftMargin + colCorreo + 2, y + 4);
  doc.setFont("helvetica", "normal");
  // doc.text("", leftMargin + colCorreo + 25, y + 4);

  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + colCorreo + colFax, y, colCel, medicoRowHeight);
  doc.text("Cel :", leftMargin + colCorreo + colFax + 2, y + 4);
  doc.setFont("helvetica", "normal");
  // doc.text("", leftMargin + colCorreo + colFax + 25, y + 4);
  y += medicoRowHeight;

  // Fila 4: CMP - Fecha - Firma y Sello
  const colCMP = 40, colFechaMedico = 60, colFirma = 90;
  const firmaRowHeight = 15; // Altura aumentada para esta fila específica
  
  // CMP: Label arriba, valor abajo
  doc.rect(leftMargin, y, colCMP, firmaRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("CMP :", leftMargin + 2, y + 2);
  doc.setFont("helvetica", "normal");
  doc.text("74582", leftMargin + 2, y + 6);

  // Fecha: Label arriba, valor abajo
  doc.rect(leftMargin + colCMP, y, colFechaMedico, firmaRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha (dd/mm/aa) :", leftMargin + colCMP + 2, y + 2);
  doc.setFont("helvetica", "normal");
  doc.text("17/07/2025", leftMargin + colCMP + 2, y + 6);

  // Firma y sello: Label arriba, valor abajo
  doc.rect(leftMargin + colCMP + colFechaMedico, y, colFirma, firmaRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("Firma y sello :", leftMargin + colCMP + colFechaMedico + 2, y + 2);
  
  // Variables para firma del médico en tabla de información
  const firmaMedicoX = leftMargin + colCMP + colFechaMedico + 25;
  const firmaMedicoY = y + 3; // Ajustado para centrar mejor en la fila más alta
  const firmaMedicoWidth = 35;
  const firmaMedicoHeight = 12; // Altura de la firma aumentada
  
  // Agregar firma y sello médico
  doc.addImage("public/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png", "PNG", firmaMedicoX, firmaMedicoY, firmaMedicoWidth, firmaMedicoHeight);
  y += firmaRowHeight + 5;

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
