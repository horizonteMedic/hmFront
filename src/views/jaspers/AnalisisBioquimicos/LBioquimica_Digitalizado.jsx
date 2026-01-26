import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { getSignCompressed } from "../../utils/helpers.js";

const config = {
  margin: 15,
  fontSize: {
    title: 14,
    subtitle: 11,
    header: 11,
    body: 9,
  },
  lineHeight: {
    normal: 7,
    small: 5,
  },
  font: 'helvetica',
};

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Función para formatear fecha larga
const formatDateToLong = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return toDDMMYYYY(dateString) || '';
  }
};

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
  drawColorBox(doc, {
    color: datos.codigoColor,
    text: datos.textoColor,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });
};

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = 41;

  // Header DATOS PERSONALES
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : '';

  // Fila 1: Apellidos y Nombres (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres || '', tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  // Fila 2: DNI | Edad | Sexo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dni || ''), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.edad || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  yPos += filaAltura;

  // Fila 3: Lugar Nacimiento | Estado Civil
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.lugarNacimientoPaciente || '', tablaInicioX + 38, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.estadoCivilPaciente || '', tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // Fila 4: Tipo Examen | Fecha Nac.
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombreExamen || '', tablaInicioX + 28, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || ''), tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // Fila 4: Nivel de Estudio (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudioPaciente || '', tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  // Fila 5: Ocupación (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.ocupacionPaciente || '', tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // Fila 6: Cargo (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cargoPaciente || '', tablaInicioX + 18, yPos + 3.5);
  yPos += filaAltura;

  // Fila 7: Área (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.areaPaciente || '', tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

export default async function LBioquimica_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  await drawHeader(doc, datos);

  // === TÍTULO BIOQUÍMICA ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text('BIOQUÍMICA', pageW / 2, 38, { align: 'center' });

  // === DATOS DEL PACIENTE ===
  const finalYPos = drawPatientData(doc, datos);
  const s1 = await getSignCompressed(datos, "SELLOFIRMA");
  const s2 = await getSignCompressed(datos, "SELLOFIRMADOCASIG");


  let y = finalYPos + 10;
  const tablaInicioX = 15;
  const tablaAncho = 180;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
  doc.text('MUESTRA : SUERO', tablaInicioX, y);
  y += config.lineHeight.normal * 1.5;

  const tableCols = {
    col1: tablaInicioX,
    col2: 100,
    col3: 153,
  };

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text('PRUEBA', tableCols.col1, y);
  doc.text('RESULTADO', tableCols.col2, y, { align: 'center' });
  doc.text('VALORES NORMALES', tableCols.col3, y, { align: 'left' });
  y += 3;
  doc.setLineWidth(0.4).line(tablaInicioX, y, tablaInicioX + tablaAncho, y);
  y += config.lineHeight.normal;

  const dataRows = [
    {
      prueba: 'CREATININA SÉRICA',
      resultado: datos.txtCreatinina || '',
      normales: 'Adulto: 0.8 - 1.4 mg/dl\nNiño: 0.24 - 0.84 mg/dl'
    },
    {
      prueba: 'UREA SÉRICA',
      resultado: datos.txtUreaSerica || '',
      normales: '10 - 50 mg/dl'
    },
    {
      prueba: 'ÁCIDO ÚRICO SÉRICO',
      resultado: datos.txtAcidoUrico || '',
      normales: 'Mujeres: 2.5 - 6.8 mg/dl\nHombres 3.6 - 7.7 mg/dl'
    }
  ];

  doc.setFont(config.font, "normal").setFontSize(9);
  dataRows.forEach(row => {
    // Prueba
    doc.text(row.prueba, tableCols.col1, y);
    // Resultado centrado
    doc.text(String(row.resultado), tableCols.col2, y, { align: 'center' });
    // Valores normales (puede ser multilinea)
    const normalesLines = String(row.normales).split('\n');
    normalesLines.forEach((line, idx) => {
      doc.text(line, tableCols.col3, y + idx * config.lineHeight.small, { align: 'left' });
    });
    // Ajusta y para la siguiente fila
    y += Math.max(config.lineHeight.normal, normalesLines.length * config.lineHeight.small + 2);
  });

  // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
  const sigW = 48;
  const sigH = 20;
  const sigY = y + 12;
  const gap = 16;
  const lineY = sigY + sigH + 3;

  // Función auxiliar para agregar sello al PDF
  const agregarSello = (url, xPos, yPos, width, height) => {
    return new Promise((resolve, reject) => {
      if (!url) return resolve();

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const selloBase64 = canvas.toDataURL('image/jpeg');
          doc.addImage(selloBase64, 'jpeg', xPos, yPos, width, height);

          resolve();
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  // Función auxiliar para dibujar línea y texto debajo del sello
  const dibujarLineaYTexto = (centroX, lineY, tipoSello) => {
    doc.setLineWidth(0.2);
    doc.line(centroX - 25, lineY, centroX + 25, lineY);
    doc.setFont('helvetica', 'normal').setFontSize(9);
    if (tipoSello === 'SELLOFIRMA') {
      // SELLOFIRMA: Firma y Sello del Profesional / Responsable de la Evaluación
      doc.text("Firma y Sello del Profesional", centroX, lineY + 5, { align: "center" });
      doc.text("Responsable de la Evaluación", centroX, lineY + 8, { align: "center" });
    } else if (tipoSello === 'SELLOFIRMADOCASIG') {
      // SELLOFIRMADOCASIG: Firma y Sello Médico Asignado
      doc.text("Firma y Sello Médico Asignado", centroX, lineY + 5, { align: "center" });
    } else {
      doc.text("Firma y Sello", centroX, lineY + 5, { align: "center" });
    }
  };

  if (s1 && s2) {
    const totalWidth = sigW * 2 + gap;
    const startX = (pageW - totalWidth) / 2;

    await agregarSello(s1, startX, sigY, sigW, sigH);
    await agregarSello(s2, startX + sigW + gap, sigY, sigW, sigH);

    const centroSello1X = startX + sigW / 2;
    const centroSello2X = startX + sigW + gap + sigW / 2;
    dibujarLineaYTexto(centroSello1X, lineY, 'SELLOFIRMA');
    dibujarLineaYTexto(centroSello2X, lineY, 'SELLOFIRMADOCASIG');
  } else if (s1) {
    const imgX = (pageW - sigW) / 2;
    await agregarSello(s1, imgX, sigY, sigW, sigH);
    dibujarLineaYTexto(pageW / 2, lineY, 'SELLOFIRMA');
  } else if (s2) {
    const imgX = (pageW - sigW) / 2;
    await agregarSello(s2, imgX, sigY, sigW, sigH);
    dibujarLineaYTexto(pageW / 2, lineY, 'SELLOFIRMADOCASIG');
  }

  // === FOOTER ===
  footerTR(doc, datos);
  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
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