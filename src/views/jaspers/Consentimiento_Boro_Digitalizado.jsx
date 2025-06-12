import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "./components/headerConsentimiento";
import footer from "./components/footer";

export default function Consentimiento_Boro_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  const huella = datos.digitalizacion.find(d => d.nombreDigitalizacion === "HUELLA");
  const firma = datos.digitalizacion.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello = datos.digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const isValidUrl = url => url && url !== "Sin registro";

  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(huella?.url) ? loadImg(huella.url) : Promise.resolve(null),
    isValidUrl(firma?.url) ? loadImg(firma.url) : Promise.resolve(null),
    isValidUrl(sello?.url) ? loadImg(sello.url) : Promise.resolve(null)
  ])
   .then(([huellap, firmap, sellop]) => {
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
    doc.text(`Nro Orden :`, 160, y);
    doc.text(`${datos.norden || ''}`, 195, y, { align: 'right' });

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
    doc.text(`SI ( ${datos.antBoroAlgunaEnfermedad ? 'X' : ' '} )  NO ( ${!datos.antBoroAlgunaEnfermedad ? 'X' : ' '} )`, 110, y);
    doc.text('¿Cuál (es):', 150, y);
    doc.text(`${datos.critCualAlgunaEnfermedad || ''}`, 170, y);
    y += 8;
    // Medicamento
    doc.text('¿Consume regularmente algún medicamento?', 18, y);
    doc.text(`SI ( ${datos.antBoroAlgunMedicamento ? 'X' : ' '} )  NO ( ${!datos.antBoroAlgunMedicamento ? 'X' : ' '} )`, 110, y);
    doc.text('¿Cuál (es):', 150, y);
    doc.text(`${datos.critCualAlgunMedicamento || ''}`, 170, y);
    y += 8;
    // Mate de coca
    doc.text('¿Consume regularmente mate de coca?', 18, y);
    doc.text(`SI ( ${datos.antBoroConsumenMateCoca ? 'X' : ' '} )  NO ( ${!datos.antBoroConsumenMateCoca ? 'X' : ' '} )`, 110, y);
    y += 8;
    doc.text('Si la respuesta es SI: ¿Cuándo consumió por última vez?', 18, y);
    y += 6;
    doc.text(`${datos.antBoroConsumenMateCoca ? 'Fecha:' : ''}`, 25, y);
    doc.text(`${datos.antBoroConsumenMateCoca ? datos.critFechaConsumoMateCoca : ''}`, 40, y);
    y += 10;
    // Hoja de coca
    doc.text('¿Consume o mastica hoja de coca?', 18, y);
    doc.text(`SI ( ${datos.masticaHojaCoca ? 'X' : ' '} )  NO ( ${!datos.masticaHojaCoca ? 'X' : ' '} )`, 110, y);
    y += 8;
    const hojaMsg = 'Si la respuesta es SI, se procederá a reprogramar la toma de la muestra en 5 días, caso contrario se tomará la muestra bajo responsabilidad del paciente.';
    const hojaLines = doc.splitTextToSize(hojaMsg, 176);
    doc.text(hojaLines, 18, y, { maxWidth: 176 });
    y += hojaLines.length * 6 + 2;
    // Tratamiento quirúrgico/dental
    doc.text('¿Se realizó algún tratamiento quirúrgico o dental en las últimas 48 horas?', 18, y);
    doc.text(`SI ( ${datos.antBoroTratQuirugODental ? 'X' : ' '} )  NO ( ${!datos.antBoroTratQuirugODental ? 'X' : ' '} )`, 160, y);
    y += 8;
    const tratMsg = 'Si la respuesta es SI, indicar qué tratamiento se realizó, cual es nombre del cirujano, donde y cuando se realizó dicho procedimiento o tratamiento';
    const tratLines = doc.splitTextToSize(tratMsg, 176);
    doc.text(tratLines, 18, y, { maxWidth: 176 });
    y += tratLines.length * 6 + 2;
    doc.text('Cual:', 18, y);
    doc.text(`${datos.critCualTratQuirugODental || ''}`, 32, y);
    doc.text('Cuando:', 80, y);
    doc.text(`${datos.critCuandoTratQuirugODental || ''}`, 100, y);
    doc.text('Donde:', 120, y);
    doc.text(`${datos.critDondeTratQuirugODental || ''}`, 135, y);

    // Más espacio antes de la firma y huella
    y += 34;

    // Línea horizontal antes del texto de firma (solo hasta el final del texto)
    const firmaText = 'Firma y Huella del trabajador / paciente evaluado';
    const firmaTextWidth = doc.getTextWidth(firmaText);
    const lineaBaseY = y - 4; // Línea donde se posicionan firma y huella
    doc.setDrawColor(100);
    doc.line(18, lineaBaseY, 18 + firmaTextWidth, lineaBaseY);
    doc.setFont(undefined, 'bold');
    doc.text(firmaText, 18, y); // texto a y (encima de la línea)

    // --- Huella: centrada al 1/4 de la línea ---
    if (huellap) {
      const huellaW = 16;
      const huellaH = (huellap.height / huellap.width) * huellaW;
      const huellaX = 18 + firmaTextWidth * 0.25 - huellaW / 2;
      const huellaY = lineaBaseY - huellaH - 2; // justo encima de la línea

      const canvas = document.createElement('canvas');
      canvas.width = huellap.width;
      canvas.height = huellap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(huellap, 0, 0);
      const huellaBase64 = canvas.toDataURL('image/png');
      doc.addImage(huellaBase64, 'PNG', huellaX, huellaY, huellaW, huellaH);
    }

    // --- Firma: centrada al 3/4 de la línea ---
    if (firmap) {
      const firmaW = 26;
      const firmaH = (firmap.height / firmap.width) * firmaW;
      const firmaX = 18 + firmaTextWidth * 0.75 - firmaW / 2;
      const firmaY = lineaBaseY - firmaH - 2; // justo encima de la línea

      const canvas = document.createElement('canvas');
      canvas.width = firmap.width;
      canvas.height = firmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(firmap, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');
      doc.addImage(firmaBase64, 'PNG', firmaX, firmaY, firmaW, firmaH);
    }



    // Notas como cuadro
    y += 10;
    doc.setFont(undefined, 'normal');
    doc.text('Notas:', 18, y);
    const notas = datos.notas || '';
    const notasLines = doc.splitTextToSize(notas, 170);
    doc.setDrawColor(100);
    doc.rect(35, y - 5, 160, notasLines.length * 6 + 5);
    doc.text(notasLines, 40, y + 5, { maxWidth: 150 });

    //sello
    y += 31
    const SelloText = 'Firma del testigo o responsable de la toma de muestra';
    const SelloTextWidth = doc.getTextWidth(SelloText);
    const SellolineaBaseY = y - 4; // Línea donde se posicionan firma y huella
    doc.setDrawColor(100);
    doc.line(100, SellolineaBaseY, 100 + SelloTextWidth, SellolineaBaseY);
    doc.setFont(undefined, 'bold');
    doc.text(SelloText, 100, y); // texto a y (encima de la línea)
    if (sellop) {
      const selloW = 50; // Ajusta este valor para achicar o agrandar
      const selloH = (sellop.height / sellop.width) * selloW;

      // Centrado horizontal respecto a la línea de texto
      const selloX = 100 + (SelloTextWidth - selloW) / 2;

      // Un poco arriba de la línea horizontal
      const selloY = SellolineaBaseY - selloH - 2;

      const canvas = document.createElement('canvas');
      canvas.width = sellop.width;
      canvas.height = sellop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sellop, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', selloX, selloY, selloW, selloH);
    }


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
  
  })
  
} 