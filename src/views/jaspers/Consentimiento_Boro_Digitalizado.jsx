import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "./components/headerConsentimiento";
import footer from "./components/footer";

export default function Consentimiento_Boro_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  let y = 44;

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(13);
  doc.text('AUTORIZACIÓN DE EXAMEN DE DROGAS', 105, y, { align: 'center' });
  doc.setFontSize(11);

  // Encabezado de datos principales
  y += 8;
  doc.setFont(undefined, 'normal');
  doc.text(`Fecha:`, 18, y);
  doc.text(`${datos.fecha || ''}`, 35, y);
  doc.text(`Hora:`, 65, y);
  doc.text(`${datos.hora || ''}`, 80, y);
  doc.text(`Ciudad:`, 110, y);
  doc.text(`${datos.ciudad || ''}`, 130, y);
  doc.setFont(undefined, 'bold');
  doc.text(`Nro Orden :`, 170, y);
  doc.text(`${datos.nro_orden || ''}`, 195, y, { align: 'right' });

  // Nombre y datos personales
  y += 8;
  doc.setFont(undefined, 'bold');
  doc.text(`Yo`, 18, y);
  doc.setFont(undefined, 'bold');
  doc.text(`${datos.nombres || '_________________________'}`, 28, y);
  doc.setFont(undefined, 'normal');
  doc.text(`de`, 110, y);
  doc.text(`${datos.edad || '___'}`, 118, y);
  doc.text(`años de edad,`, 130, y);
  y += 6;
  doc.text(`con documento de identidad N°`, 18, y);
  doc.setFont(undefined, 'bold');
  doc.text(`${datos.dni || '__________'}`, 80, y);
  doc.setFont(undefined, 'normal');
  doc.text(`trabajador ( ${datos.trabajador ? 'X' : ' '} ) o postulante ( ${datos.postulante ? 'X' : ' '} ), de la empresa`, 100, y);
  y += 6;
  doc.setFont(undefined, 'bold');
  doc.text(`${datos.empresa || '_________________________'}`, 18, y);
  doc.setFont(undefined, 'normal');
  const intro = ", autorizo al POLICLINICO HORIZONTE MEDIC, para que se me realice el examen toxicológico de drogas en orina y/o saliva, según los protocolos establecidos y que los resultados se entreguen directamente a la empresa.";
  const introLines = doc.splitTextToSize(intro, 176);
  doc.text(introLines, 18, y + 6, { maxWidth: 176 });
  y += introLines.length * 6 + 6;

  // Preguntas
  doc.setFont(undefined, 'normal');
  doc.text('Además, declaro que la información que brindaré a continuación es verdadera:', 18, y);
  y += 8;
  // Enfermedad
  doc.text('¿Sufre alguna enfermedad?', 18, y);
  doc.text(`SI ( ${datos.enfermedad_si ? 'X' : ' '} )  NO ( ${datos.enfermedad_no ? 'X' : ' '} )`, 110, y);
  doc.text('¿Cuál (es):', 150, y);
  doc.text(`${datos.enfermedad_cual || ''}`, 140, y);
  y += 8;
  // Medicamento
  doc.text('¿Consume regularmente algún medicamento?', 18, y);
  doc.text(`SI ( ${datos.medicamento_si ? 'X' : ' '} )  NO ( ${datos.medicamento_no ? 'X' : ' '} )`, 110, y);
  doc.text('¿Cuál (es):', 150, y);
  doc.text(`${datos.medicamento_cual || ''}`, 140, y);
  y += 8;
  // Mate de coca
  doc.text('¿Consume regularmente mate de coca?', 18, y);
  doc.text(`SI ( ${datos.mate_si ? 'X' : ' '} )  NO ( ${datos.mate_no ? 'X' : ' '} )`, 110, y);
  y += 8;
  doc.text('Si la respuesta es SI: ¿Cuándo consumió por última vez?', 18, y);
  y += 6;
  doc.text('Fecha:', 25, y);
  doc.text(`${datos.mate_fecha || ''}`, 40, y);
  y += 10;
  // Hoja de coca
  doc.text('¿Consume o mastica hoja de coca?', 18, y);
  doc.text(`SI ( ${datos.hoja_si ? 'X' : ' '} )  NO ( ${datos.hoja_no ? 'X' : ' '} )`, 110, y);
  y += 8;
  const hojaMsg = 'Si la respuesta es SI, se procederá a reprogramar la toma de la muestra en 5 días, caso contrario se tomará la muestra bajo responsabilidad del paciente.';
  const hojaLines = doc.splitTextToSize(hojaMsg, 176);
  doc.text(hojaLines, 18, y, { maxWidth: 176 });
  y += hojaLines.length * 6 + 2;
  // Tratamiento quirúrgico/dental
  doc.text('¿Se realizó algún tratamiento quirúrgico o dental en las últimas 48 horas?', 18, y);
  doc.text(`SI ( ${datos.tratamiento_si ? 'X' : ' '} )  NO ( ${datos.tratamiento_no ? 'X' : ' '} )`, 160, y);
  y += 8;
  const tratMsg = 'Si la respuesta es SI, indicar qué tratamiento se realizó, cual es nombre del cirujano, donde y cuando se realizó dicho procedimiento o tratamiento';
  const tratLines = doc.splitTextToSize(tratMsg, 176);
  doc.text(tratLines, 18, y, { maxWidth: 176 });
  y += tratLines.length * 6 + 2;
  doc.text('Cual:', 18, y);
  doc.text(`${datos.tratamiento_cual || ''}`, 32, y);
  doc.text('Cuando:', 80, y);
  doc.text(`${datos.tratamiento_cuando || ''}`, 100, y);
  doc.text('Donde:', 120, y);
  doc.text(`${datos.tratamiento_donde || ''}`, 135, y);

  // Más espacio antes de la firma y huella
  y += 34;
  // Línea horizontal antes del texto de firma (solo hasta el final del texto)
  const firmaText = 'Firma y Huella del trabajador / paciente evaluado';
  const firmaTextWidth = doc.getTextWidth(firmaText);
  doc.setDrawColor(100);
  doc.line(18, y - 4, 18 + firmaTextWidth, y - 4);
  doc.setFont(undefined, 'bold');
  doc.text(firmaText, 18, y);

  // Notas como cuadro
  y += 10;
  doc.setFont(undefined, 'normal');
  doc.text('Notas:', 18, y);
  const notas = datos.notas || '';
  const notasLines = doc.splitTextToSize(notas, 170);
  doc.setDrawColor(100);
  doc.rect(35, y - 5, 160, notasLines.length * 7 + 10);
  doc.text(notasLines, 40, y + 5, { maxWidth: 150 });

  footer(doc, datos);

  // Mostrar PDF
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
} 