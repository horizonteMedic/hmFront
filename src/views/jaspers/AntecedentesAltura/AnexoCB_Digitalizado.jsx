import jsPDF from "jspdf";
import Header_AnexoCB_Digitalizado from "./Header/Header_AnexoCB_Digitalizado";
import { formatearFechaCorta } from "../../utils/formatDateUtils";

export default function GenerarDatosPaciente(data = {}) {
  const datosPrueba = {
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
    esApto: true,
    observaciones: "comentario",
    otrosDescripcion: "otrosObser",
    apellidosUsuario: "Apellidos doctor",
    nombresUsuario: "Nombres doctor",
    cmpUsuario: "1234",
    fechaExamen: "12/03/2023"
  };
  const datosReales = {
    apellidos: data.apellidos ?? "",
    nombres: data.nombres ?? "",
    dni: String(data.dni ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente ?? ""),
    edad: String(data.edad ?? ""),
    sexo: data.sexo ?? "",
    direccion: String(data.direccionPaciente ?? ""),
    empresaContratista:
      data.contrata ??
      "",
    empresa: data.empresa ?? "",
    actividadRealizar: data.cargo ?? "",
    antecedentes: [
      {
        texto: "Accidente cerebrovascular",
        si: data?.antecedentes?.accidenteCerebroVascularSi,
        no: data?.antecedentes?.accidenteCerebroVascularNo
      },
      {
        texto: "Angina inestable",
        si: data?.antecedentes?.anginaInestableSi,
        no: data?.antecedentes?.anginaInestableNo
      },
      {
        texto: "Antecedente de Bypass arterial coronario/AngioplastÍa/Stent",
        si: data?.antecedentes?.antecedenteBypassArterialSi,
        no: data?.antecedentes?.antecedenteBypassArterialNo
      },
      {
        texto: "Antecedente de edema cerebral de altura",
        si: data?.antecedentes?.antecedenteEdemaCerebralSi,
        no: data?.antecedentes?.antecedenteEdemaCerebralNo
      },
      {
        texto: "Antecendente de edema pulmonar de altura",
        si: data?.antecedentes?.antecedenteEdemaPulmonarSi,
        no: data?.antecedentes?.antecedenteEdemaPulmonarNo
      },
      {
        texto: "Antecedente de Neumotórax en los ultimos 6 meses",
        si: data?.antecedentes?.antecedenteNeumotoraxSi,
        no: data?.antecedentes?.antecedenteNeumotoraxNo
      },
      {
        texto: "Arritmia cardiaca no controlada",
        si: data?.antecedentes?.arritmiaCardiacaSi,
        no: data?.antecedentes?.arritmiaCardiacaNo
      },
      {
        texto: "Cardiomiopatía hipertrófica idiopática",
        si: data?.antecedentes?.cardiomiopatiaSi,
        no: data?.antecedentes?.cardiomiopatiaNo
      },
      {
        texto: "Cirugía mayor en los últimos 30 días",
        si: data?.antecedentes?.cirujiaMayorSi,
        no: data?.antecedentes?.cirujiaMayorNo
      },
      {
        texto: "Cualquier insuficiencia en la válvula aórtica",
        si: data?.antecedentes?.cualquierInsuficienciaSi,
        no: data?.antecedentes?.cualquierInsuficienciaNo
      },
      {
        texto: "Diabetes Mellitus",
        si: data?.antecedentes?.diabetesMellitusSi,
        no: data?.antecedentes?.diabetesMellitusNo
      },
      {
        texto: "Embarazo",
        si: data?.antecedentes?.embarazoSi,
        no: data?.antecedentes?.embarazoNo
      },
      {
        texto: "Epilepsia",
        si: data?.antecedentes?.epilepsiaSi,
        no: data?.antecedentes?.epilepsiaNo
      },
      {
        texto: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada",
        si: data?.antecedentes?.epocSi,
        no: data?.antecedentes?.epocNo
      },
      {
        texto: "Eritrocitosis excesiva (mal de montaña crónico)",
        si: data?.antecedentes?.eritrocitosisSi,
        no: data?.antecedentes?.eritrocitosisNo
      },
      {
        texto: "Hipertensión arterial",
        si: data?.antecedentes?.hipertensionArterialSi,
        no: data?.antecedentes?.hipertensionArterialNo
      },
      {
        texto: "Hipertensión pulmonar",
        si: data?.antecedentes?.hipertensionPulmonarSi,
        no: data?.antecedentes?.hipertensionPulmonarNo
      },
      {
        texto: "Infarto al miocardio en los últimos 6 meses",
        si: data?.antecedentes?.infartoMiocardioSi,
        no: data?.antecedentes?.infartoMiocardioNo
      },
      {
        texto: "Insuficiencia cardíaca congestiva",
        si: data?.antecedentes?.insuficienciaCardiacaSi,
        no: data?.antecedentes?.insuficienciaCardiacaNo
      },
      {
        texto: "Patología hemorrágica de retina",
        si: data?.antecedentes?.patologiaHemorragicaSi,
        no: data?.antecedentes?.patologiaHemorragicaNo
      },
      {
        texto: "Patología Valvular Cardiáca en tratamiento",
        si: data?.antecedentes?.patologiaValvularSi,
        no: data?.antecedentes?.patologiaValvularNo
      },
      {
        texto: "Presencia de marcapasos",
        si: data?.antecedentes?.presenciaMarcaPasosSi,
        no: data?.antecedentes?.presenciaMarcaPasosNo
      },
      {
        texto: "Presencia de riesgo cardiovascular alto",
        si: data?.antecedentes?.presenciaRiesgoCardioSi,
        no: data?.antecedentes?.presenciaRiesgoCardioNo
      },
      {
        texto: "Trastornos de la coagulación",
        si: data?.antecedentes?.transtornoCoagulacionSi,
        no: data?.antecedentes?.transtornoCoagulacionNo
      },
      {
        texto: "Trombosis venosa cerebral",
        si: data?.antecedentes?.trombosisSi,
        no: data?.antecedentes?.trombosisNo
      },
      {
        texto: "Otros",
        si: data?.antecedentes?.otrosSi,
        no: data?.antecedentes?.otrosNo
      },
    ],
    observaciones: data?.antecedentes?.observaciones ?? "",
    otrosDescripcion: data?.antecedentes?.otrosDescripcion ?? "",
    esApto: data?.antecedentes?.esApto,
    //doctor
    apellidosUsuario: data?.apellidosUsuario ?? "",
    nombresUsuario: data?.nombresUsuario ?? "",
    cmpUsuario: String(data?.cmpUsuario ?? ""),
    fechaExamen: formatearFechaCorta(data?.antecedentes?.fechaAntecedente ?? ""),

  };
  const datos =
    data && Object.keys(data).length > 0 ? datosReales : datosPrueba;


  const doc = new jsPDF();

  // Usar el header
  let y = Header_AnexoCB_Digitalizado(doc, data);
  const leftMargin = 10;

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
  doc.text("DNI/CE :", leftMargin + 2, y + 3);
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
  doc.text(datos.edad + " AÑOS", leftMargin + colDNI + colFecha + 2, y + 6);

  doc.rect(leftMargin + colDNI + colFecha + colEdad, y, colSexo, row2Height);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo :", leftMargin + colDNI + colFecha + colEdad + 2, y + 3);
  doc.setFont("helvetica", "normal");

  // Convertir M/F a texto completo
  let sexoTexto = datos.sexo;
  if (sexoTexto === "M") {
    sexoTexto = "MASCULINO";
  } else if (sexoTexto === "F") {
    sexoTexto = "FEMENINO";
  }

  doc.text(sexoTexto, leftMargin + colDNI + colFecha + colEdad + 2, y + 6);
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
  doc.text("NO", leftMargin + colTexto + colNo / 2, y + 5, { align: "center" });

  doc.rect(leftMargin + colTexto + colNo, y, colSi, 8);
  doc.text("SI", leftMargin + colTexto + colNo + colSi / 2, y + 5, { align: "center" });

  y += 8;

  doc.setFont("helvetica", "normal").setFontSize(8.5); // Aumentado de 8 a 9
  datos.antecedentes.forEach((item) => {
    let textoDividido = doc.splitTextToSize(item.texto, colTexto - 4);
    let altura = textoDividido.length * 4 + 1;

    // Texto
    doc.rect(leftMargin, y, colTexto, altura);
    doc.text(textoDividido, leftMargin + 2, y + 3.5);

    // NO
    doc.rect(leftMargin + colTexto, y, colNo, altura);
    if (item.no === true) doc.text("X", leftMargin + colTexto + colNo / 2, y + 3, { align: "center" });

    // SI
    doc.rect(leftMargin + colTexto + colNo, y, colSi, altura);
    if (item.si === true) doc.text("X", leftMargin + colTexto + colNo + colSi / 2, y + 3, { align: "center" });

    y += altura;
  });

  // ===== COMENTARIOS DEL MÉDICO =====
  // y += 1;
  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin, y, 190, 8);
  doc.text("Comentarios del Médico :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datos.otrosDescripcion, leftMargin + 15, y - 1.5,);
  doc.text(datos.observaciones, leftMargin + 45, y + 4, { maxWidth: 100 });
  y += 8;

  // Variables para firma de prueba en comentarios
  const firmaPruebaX = leftMargin + 58;
  const firmaPruebaY = y - 19;
  const firmaPruebaWidth = 45;
  const firmaPruebaHeight = 25;

  // Variables para huella digital en comentarios
  const huellaDigitalX = leftMargin + 105;
  const huellaDigitalY = y - 19;
  const huellaDigitalWidth = 25;
  const huellaDigitalHeight = 18;

  // Agregar firma de prueba y huella flotantes
  // doc.addImage("public/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png", "PNG", firmaPruebaX, firmaPruebaY, firmaPruebaWidth, firmaPruebaHeight);
  // doc.text("PRUEBA", leftMargin + 135, y);

  // Agregar huella digital (ajustada para que salga vertical)
  // Intercambiamos width y height para que la huella salga vertical
  // doc.addImage("public/img/firmas_sellos_prueba/HUELLA_DIGITAL.png", "PNG", huellaDigitalX, huellaDigitalY, huellaDigitalHeight, huellaDigitalWidth);
  y += 5;

  // ===== CERTIFICACIÓN DE APTITUD =====
  // y += 5;
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
  doc.text(datos.apellidosUsuario, leftMargin + 25, y + 4);

  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + 95, y, 95, medicoRowHeight);
  doc.text("Nombres :", leftMargin + 97, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombresUsuario, leftMargin + 120, y + 4);
  y += medicoRowHeight;

  // Fila 2: Dirección
  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin, y, 190, medicoRowHeight);
  doc.text("Dirección :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text("", leftMargin + 25, y + 4);
  y += medicoRowHeight;

  // Fila 3: Correo - Fax - Cel
  const colCorreo = 100, colFax = 45, colCel = 45; // Correo más ancho, Fax y Cel más estrechos
  const correoRowHeight = 12; // Altura aumentada para label arriba y valor abajo

  // Correo: Label arriba, valor abajo
  doc.rect(leftMargin, y, colCorreo, correoRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("Correo electrónico :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text("", leftMargin + 2, y + 9);

  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + colCorreo, y, colFax, correoRowHeight);
  doc.text("Fax :", leftMargin + colCorreo + 2, y + 4);
  doc.setFont("helvetica", "normal");
  // doc.text("", leftMargin + colCorreo + 25, y + 4);

  doc.setFont("helvetica", "bold");
  doc.rect(leftMargin + colCorreo + colFax, y, colCel, correoRowHeight);
  doc.text("Cel :", leftMargin + colCorreo + colFax + 2, y + 4);
  doc.setFont("helvetica", "normal");
  // doc.text("", leftMargin + colCorreo + colFax + 25, y + 4);
  y += correoRowHeight;

  // Fila 4: CMP - Fecha - Firma y Sello
  const colCMP = 40, colFechaMedico = 60, colFirma = 90;
  const firmaRowHeight = 12; // Altura aumentada para label arriba y valor abajo

  // CMP: Label arriba, valor abajo
  doc.rect(leftMargin, y, colCMP, firmaRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("CMP :", leftMargin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cmpUsuario, leftMargin + 2, y + 9);

  // Fecha: Label arriba, valor abajo
  doc.rect(leftMargin + colCMP, y, colFechaMedico, firmaRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha (dd/mm/aa) :", leftMargin + colCMP + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datos.fechaExamen, leftMargin + colCMP + 2, y + 9);

  // Firma y sello: Solo label, la firma será flotante
  doc.rect(leftMargin + colCMP + colFechaMedico, y, colFirma, firmaRowHeight);
  doc.setFont("helvetica", "bold");
  doc.text("Firma y sello :", leftMargin + colCMP + colFechaMedico + 2, y + 4);

  // Variables para firma del médico flotante (puedes ajustar X e Y a tu gusto)
  const firmaMedicoX = leftMargin + colCMP + colFechaMedico + 35;
  const firmaMedicoY = y - 4; // Posición Y ajustable
  const firmaMedicoWidth = 45;
  const firmaMedicoHeight = 25; // Altura de la firma

  // Agregar firma y sello médico (flotante, puedes mover X e Y)
  // doc.addImage("public/img/firmas_sellos_prueba/firma_sello.png", "PNG", firmaMedicoX, firmaMedicoY, firmaMedicoWidth, firmaMedicoHeight);
  y += firmaRowHeight + 5;

  // Imprimir / Preview
  const firmasAPintar = [
    {
      nombre: "FIRMAP",
      x: firmaPruebaX+45,
      y: firmaPruebaY-10,
      maxw: 30,
    },
    {
      nombre: "HUELLA",
      x: huellaDigitalX+40,
      y: huellaDigitalY-5,
      maxw: 20,
    },
    {
      nombre: "SELLOFIRMA",
      x: firmaMedicoX,
      y: firmaMedicoY - 10,
      maxw: 40,
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
