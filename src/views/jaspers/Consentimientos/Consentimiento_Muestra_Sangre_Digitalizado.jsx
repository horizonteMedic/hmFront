import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "../components/headerConsentimiento";
import footer from "../components/footer";

export default function Consentimiento_Muestra_Sangre_Digitalizado(datos) {
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

    // Título subrayado y negrita con salto de línea
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('CONSENTIMIENTO INFORMADO PARA LA TOMA DE', 105, y, { align: 'center' });
    y += 6;
    doc.text('MUESTRA DE SANGRE', 105, y, { align: 'center' });
    doc.setFontSize(11);

    // Cuerpo del consentimiento
    y += 10;
    doc.setFont(undefined, 'normal');
    const bloque =
      `Yo ${datos.nombres || '_________________________'} , de ${datos.edad || '___'} años de edad, identificado con DNI nº ${datos.dni || '__________'}; habiendo recibido consejería e información acerca de los exámenes en sangre que se me va ha realizar según solicitud del protocolo médico de la empresa ${datos.empresa || '_________________________'}; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra de sangre para cumplir con los exámenes pertinentes.`;
    const lines = doc.splitTextToSize(bloque, 176);
    doc.text(lines, 18, y + 6, { maxWidth: 176, lineHeightFactor: 1.5 });
    y += lines.length * 7 + 10;

    // Fecha apertura
    doc.setFont(undefined, 'bold');
    doc.text('Fecha:', 140, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${datos.fecha || ''}`, 155, y);

    // Espacio extra antes de las firmas y huella
    const baseY = y + 30;

    // Huella
    doc.rect(25, baseY, 28, 32);
    doc.setFontSize(10);
    doc.text('Huella', 39, baseY + 38, { align: 'center' });
    if (huellap) {
      const maxW = 28;
      const maxH = 32;
      let huellaW = maxW;
      let huellaH = (huellap.height / huellap.width) * huellaW;

      // Si excede la altura máxima, reajustar proporciones
      if (huellaH > maxH) {
        huellaH = maxH;
        huellaW = (huellap.width / huellap.height) * huellaH;
      }

      const huellaX = 25 + (maxW - huellaW) / 2;
      const huellaY = baseY + (maxH - huellaH) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = huellap.width;
      canvas.height = huellap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(huellap, 0, 0);
      const huellaBase64 = canvas.toDataURL('image/png');

      doc.addImage(huellaBase64, 'PNG', huellaX, huellaY, huellaW, huellaH);
    }
    // Firma paciente
    doc.line(65, baseY + 32, 115, baseY + 32);
    doc.text('Firma del Paciente', 90, baseY + 38, { align: 'center' });
    if (firmap) {
      const firmaW = 40;
      const firmaH = (firmap.height / firmap.width) * firmaW;
      const firmaX = 70 + (50 - firmaW) / 2;
      const firmaY = baseY + 32 - firmaH - 2;
      const canvas = document.createElement('canvas');
      canvas.width = firmap.width;
      canvas.height = firmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(firmap, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');
      doc.addImage(firmaBase64, 'PNG', firmaX, firmaY, firmaW, firmaH);
    }
    // Firma consejero
    doc.line(135, baseY + 32, 185, baseY + 32);
    doc.text('Firma y sello del Consejero', 160, baseY + 38, { align: 'center' });
    if (sellop) {
      const selloW = 35;
      const selloH = (sellop.height / sellop.width) * selloW;
      const selloX = 135 + (50 - selloW) / 2;
      const selloY = baseY + 32 - selloH - 2;
      const canvas = document.createElement('canvas');
      canvas.width = sellop.width;
      canvas.height = sellop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sellop, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', selloX, selloY, selloW, selloH);
    }
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
   })
  
} 