import jsPDF from "jspdf";
import headerAnexo16ABoro_Digitalizado from "./Header/Header_Anexo16ABoro_Digitalizado";

const Anexo16ABoro_Digitalizado = (datos) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Márgenes
  const margenLateral = 8;
  const margenSuperior = 15;

  // Agregar header
  headerAnexo16ABoro_Digitalizado(doc, datos, 1);

  // Posición inicial después del header
  let y = 70; // Ajustar según el header

  // === FUNCIONES VITALES ===
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("FUNCIONES VITALES", margenLateral, y);

  y += 6;

  // Datos de funciones vitales
  const funcionesVitales = {
    fc: datos?.fc || "64",
    fr: datos?.fr || "19", 
    pa: datos?.pa || "120/60",
    satO2: datos?.satO2 || "99",
    imc: datos?.imc || "23.48"
  };

  // FC
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("FC:", margenLateral, y);
  doc.text(`${funcionesVitales.fc} x min`, margenLateral + 12, y);

  // FR
  doc.text("FR:", margenLateral + 40, y);
  doc.text(`${funcionesVitales.fr} x min`, margenLateral + 52, y);

  // PA
  doc.text("PA:", margenLateral + 80, y);
  doc.text(`${funcionesVitales.pa} mmHg`, margenLateral + 92, y);

  // Sat O2
  doc.text("Sat. O2:", margenLateral + 120, y);
  doc.text(`${funcionesVitales.satO2}%`, margenLateral + 140, y);

  y += 4;

  // IMC
  doc.text("IMC:", margenLateral, y);
  doc.text(`${funcionesVitales.imc} kg/m2`, margenLateral + 12, y);

  y += 10;

  // === ANTECEDENTES MÉDICOS ===
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("El / La presenta o ha presentado en los últimos 6 m", margenLateral, y);

  y += 6;

  // Lista de condiciones médicas con sus respuestas según la imagen
  const condicionesMedicas = [
    { texto: "Cirugía mayor reciente", si: true, no: false },
    { texto: "Desórdenes de la coagulación, trombosis", si: true, no: false },
    { texto: "Diabetes Mellitus", si: true, no: false },
    { texto: "Hipertensión Arterial", si: false, no: true },
    { texto: "Embarazo", si: true, no: false },
    { texto: "Problemas neurológicos: epilepsia, vértigo, etc.", si: true, no: false },
    { texto: "Infecciones recientes (especialmente oídos, nariz, garganta)", si: true, no: false },
    { texto: "Obesidad Mórbida (IMC mayor a 35 m/kg2)", si: true, no: false },
    { texto: "Problemas Cardíacos: marcapasos, coronariopatía, etc.", si: true, no: false },
    { texto: "Problemas Respiratorios: asma, EPOC, etc.", si: false, no: true },
    { texto: "Problemas Oftalmológicos: retinopatía, glaucoma, etc.", si: true, no: false },
    { texto: "Problemas Digestivos: úlcera péptica, hepatitis, etc.", si: true, no: false },
    { texto: "Apnea del Sueño", si: true, no: false },
    { texto: "Alergias", si: true, no: false },
    { texto: "Otra condición médica importante", si: true, no: false }
  ];

  condicionesMedicas.forEach((condicion) => {
    // Dibujar checkboxes
    const checkboxX = margenLateral + 3;
    const checkboxY = y - 1;
    const checkboxSize = 2.5;

    // Checkbox NO
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(checkboxX, checkboxY, checkboxSize, checkboxSize);
    if (condicion.no) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text("X", checkboxX + 0.3, checkboxY + 1.5);
    }
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("NO", checkboxX + 4, checkboxY + 1.5);

    // Checkbox SI
    const siCheckboxX = checkboxX + 15;
    doc.rect(siCheckboxX, checkboxY, checkboxSize, checkboxSize);
    if (condicion.si) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text("X", siCheckboxX + 0.3, checkboxY + 1.5);
    }
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("SI", siCheckboxX + 4, checkboxY + 1.5);

    // Texto de la condición
    doc.text(condicion.texto, siCheckboxX + 12, checkboxY + 1.5);

    y += 3;
  });

  y += 3;

  // Uso de medicación actual
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Uso de medicación Actual :", margenLateral, y);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datos?.medicacionActual || "", margenLateral + 45, y);

  y += 8;

  // === DECLARACIÓN DEL PACIENTE ===
  doc.setFont("helvetica", "normal").setFontSize(7);
  const declaracion = "Declaro que las respuestas dadas en el presente documento son verdaderas y estoy consciente que el ocultar o falsear información me puede causar daño por lo que asumo total responsabilidad de ello.";
  const declaracionLines = doc.splitTextToSize(declaracion, pageW - 2 * margenLateral);
  declaracionLines.forEach(line => {
    doc.text(line, margenLateral, y);
    y += 2.5;
  });

  y += 6;

  // Firma del paciente y huella
  const firmaY = y;
  
  // Firma del paciente
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Firma del paciente", margenLateral, firmaY);
  
  // Línea para firma
  doc.setLineWidth(0.3);
  doc.line(margenLateral, firmaY + 1.5, margenLateral + 35, firmaY + 1.5);

  // Huella dactilar
  const huellaX = pageW - margenLateral - 25;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Huella dactilar", huellaX, firmaY);
  
  // Cuadrado para huella
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(huellaX, firmaY + 1.5, 20, 20);
  
  // Agregar imagen de huella
  try {
    doc.addImage("./img/firmas_sellos_prueba/HUELLA_DIGITAL.png", "PNG", huellaX + 1, firmaY + 3, 18, 18);
  } catch (error) {
    console.log("Error cargando huella:", error);
  }

  y += 25;

  // === LABORATORIO ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("LABORATORIO", margenLateral, y);

  y += 6;

  // Datos de laboratorio
  const laboratorio = {
    hemoglobina: datos?.hemoglobina || "13",
    hematocrito: datos?.hematocrito || "62",
    glucosa: datos?.glucosa || "N/A",
    ekg: datos?.ekg || ""
  };

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Hemoglobina:", margenLateral, y);
  doc.text(`${laboratorio.hemoglobina} g%`, margenLateral + 25, y);

  doc.text("Hematocrito:", margenLateral + 50, y);
  doc.text(`${laboratorio.hematocrito}%`, margenLateral + 75, y);

  y += 4;

  doc.text("Glucosa:", margenLateral, y);
  doc.text(`${laboratorio.glucosa} mg/dL`, margenLateral + 25, y);

  doc.text("EKG (>= 45años):", margenLateral + 50, y);
  doc.text(laboratorio.ekg, margenLateral + 85, y);

  y += 12;

  // === CERTIFICACIÓN MÉDICA ===
  doc.setFont("helvetica", "normal").setFontSize(8);
  const certificacion = "Conforme a la declaración del / de la paciente y las pruebas complementarias, certifico que se encuentra APTO ______ para ascender a grandes altitudes (mayor a 2,500 m.s.n.m); sin embargo, no aseguro el desempeño durante el ascenso durante su permanencia.";
  const certificacionLines = doc.splitTextToSize(certificacion, pageW - 2 * margenLateral);
  certificacionLines.forEach(line => {
    doc.text(line, margenLateral, y);
    y += 2.5;
  });

  y += 6;

  // === OBSERVACIONES ===
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Observaciones:", margenLateral, y);
  y += 4;

  doc.setFont("helvetica", "normal").setFontSize(7);
  const observaciones = datos?.observaciones || ["- USO DE LENTES CORRECTORES."];
  observaciones.forEach(obs => {
    doc.text(obs, margenLateral, y);
    y += 3;
  });

  y += 8;

  // === DATOS DEL MÉDICO ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DATOS DEL MÉDICO", margenLateral, y);

  y += 6;

  // Datos del médico
  const datosMedico = {
    apellidosNombres: datos?.medicoApellidosNombres || "SANCHEZ QUIÑONES JOSE ALEJANDRO",
    direccion: datos?.medicoDireccion || "Av. Nicolas de Piérola N°1106 Urb. San Fernando",
    cmp: datos?.medicoCmp || "80135",
    fecha: datos?.medicoFecha || "04/11/2024"
  };

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Apellidos y Nombres:", margenLateral, y);
  doc.text(datosMedico.apellidosNombres, margenLateral + 45, y);

  y += 4;

  doc.text("Dirección:", margenLateral, y);
  doc.text(datosMedico.direccion, margenLateral + 25, y);

  y += 4;

  doc.text("CMP:", margenLateral, y);
  doc.text(datosMedico.cmp, margenLateral + 15, y);

  doc.text("Fecha (dd/mm/aa):", margenLateral + 50, y);
  doc.text(datosMedico.fecha, margenLateral + 85, y);

  y += 4;

  doc.text("Firma y sello:", margenLateral, y);

  // Área para firma y sello del médico (coordenadas configurables)
  const firmaMedicoX = typeof datos?.firmaX === "number" ? datos.firmaX : margenLateral;
  const firmaMedicoY = typeof datos?.firmaY === "number" ? datos.firmaY : y + 3;
  
  // Línea para firma
  doc.setLineWidth(0.3);
  doc.line(firmaMedicoX, firmaMedicoY, firmaMedicoX + 50, firmaMedicoY);

  // Agregar imagen de firma
  try {
    doc.addImage("./img/firmas_sellos_prueba/firma_de_prueba_jaspers.png", "PNG", firmaMedicoX, firmaMedicoY - 4, 35, 12);
  } catch (error) {
    console.log("Error cargando firma:", error);
  }
  
  // Agregar sello como imagen (reemplaza el círculo dibujado)
  const selloImgX = typeof datos?.selloX === "number" ? datos.selloX : (firmaMedicoX + 60);
  const selloImgY = typeof datos?.selloY === "number" ? datos.selloY : (firmaMedicoY - 10);
  const selloAncho = typeof datos?.selloW === "number" ? datos.selloW : 24;
  const selloAlto = typeof datos?.selloH === "number" ? datos.selloH : 24;
  try {
    doc.addImage("./img/firmas_sellos_prueba/firma_sello.png", "PNG", selloImgX, selloImgY, selloAncho, selloAlto);
  } catch (error) {
    console.log("Error cargando sello:", error);
  }

  // === IMPRIMIR ===
  imprimir(doc);
};

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}

export default Anexo16ABoro_Digitalizado;
