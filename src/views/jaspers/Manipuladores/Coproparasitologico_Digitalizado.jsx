// src/views/jaspers/AnalisisBioquimicos/Coproparasitologico_Digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};


// Header con datos de ficha, sede y fecha
const drawHeader = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  
  CabeceraLogo(doc, { ...datos, tieneMembrete: false });
  
  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);
  
  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);
  
  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || datos.fechaLab || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);
  
  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
   drawColorBox(doc, {
    color: datos.codigoColor,
    text: datos.textoColor ,
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
  let yPos = 43;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : '';

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Nombres y Apellidos:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres || datos.nombresPaciente || '', tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dni || datos.dniPaciente || ''), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.edad || datos.edadPaciente || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  yPos += filaAltura;

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

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudioPaciente || '', tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.ocupacionPaciente || '', tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cargoPaciente || '', tablaInicioX + 18, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.areaPaciente || '', tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.empresa || '', tablaInicioX + 20, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.contrata || '', tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

export default function Coproparasitologico_Digitalizado(datos = {}) {
  // === MAPEO DE DATOS ===
  const datosReales = {
    // Datos del paciente
    nombres: String(datos.nombres || datos.nombresPaciente || ""),
    edad: datos.edad || datos.edadPaciente || "",
    dni: datos.dni || datos.dniPaciente || "",
    fecha: datos.fecha || datos.fechaExamen || datos.fechaLab || "",
    
    // Datos de ficha
    norden: String(datos.norden || datos.numeroFicha || ""),
    sede: datos.sede || datos.nombreSede || "",
    
    // Datos de color
    codigocolor: datos.codigoColor || "",
    textoColor: datos.textoColor || "F",
    color: datos.color || 1,
    
    // Muestra I - Examen Macroscópico
    muestra1: {
      color: String(datos.txtcolor || ""),
      aspecto: String(datos.txtaspecto || ""),
      mocoFecal: String(datos.txtmocoFecal || ""),
      sangreVisible: String(datos.txtsangrev || ""),
      restosAlimenticios: String(datos.txtrestosa || ""),
      grasa: String(datos.txtgrasa || "")
    },
    
    // Muestra I - Examen Microscópico
    microscopico1: {
      leucocitos: String(datos.txtleucocitos || ""),
      hematies: String(datos.txthematies || ""),
      parasitos: String(datos.txtlugol || "")
    },
    
    // Digitalizaciones
    digitalizacion: datos.digitalizacion || []
  };

  // Usar datos reales
  const datosFinales = datosReales;

  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const xLeft = margin * 2;

  // Definir columna para los datos
  const xDato = xLeft + 65;

  const sello1 = datosFinales.digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = datosFinales.digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
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
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([s1, s2]) => {
      // HEADER
      drawHeader(doc, datosFinales);
      
      // === TÍTULO ===
      doc.setFont("helvetica", "bold").setFontSize(14);
      doc.text("COPROPARASITOLÓGICO", pageW / 2, 38, { align: "center" });
      
      // === DATOS DEL PACIENTE ===
      const finalYPos = drawPatientData(doc, datosFinales);
      
      let y = finalYPos + 10;
      const xLeft = margin * 2;
      
      // === RESULTADOS ===
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text("RESULTADOS:", xLeft, y);
      y += 8;

      // MUESTRA I
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text("MUESTRA: HECES I", xLeft, y);
      y += 7;

      // EXAMEN MACROSCÓPICO I
      doc.setFont("helvetica", "bold");
      doc.text("EXAMEN MACROSCÓPICO I", xLeft, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      [
        ["COLOR", datosFinales.muestra1.color],
        ["ASPECTO", datosFinales.muestra1.aspecto],
        ["MOCO FECAL", datosFinales.muestra1.mocoFecal],
        ["SANGRE VISIBLE", datosFinales.muestra1.sangreVisible],
        ["RESTOS ALIMENTICIOS", datosFinales.muestra1.restosAlimenticios],
        ["GRASA", datosFinales.muestra1.grasa]
      ].forEach(([lbl, value]) => {
        doc.text(lbl, xLeft, y);
        doc.text(":", xDato, y);
        doc.text(value != null && value !== "" ? String(value) : "", xDato + 4, y);
        y += 7;
      });

      // EXAMEN MICROSCÓPICO I
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.text("EXAMEN MICROSCÓPICO I", xLeft, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      [
        ["LEUCOCITOS", datosFinales.microscopico1.leucocitos],
        ["HEMATÍES", datosFinales.microscopico1.hematies],
        ["INVESTIGACIÓN DE PARÁSITOS", datosFinales.microscopico1.parasitos]
      ].forEach(([lbl, value]) => {
        doc.text(lbl, xLeft, y);
        doc.text(":", xDato, y);
        doc.text(value != null && value !== "" ? String(value) : "", xDato + 4, y);
        y += 7;
      });

      // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
      const sigW = 53;
      const sigH = 23;
      const sigY = y + 12;
      const gap = 16;
      
      if (s1 && s2) {
        const totalWidth = sigW * 2 + gap;
        const startX = (pageW - totalWidth) / 2;
        
        const addSello = (img, xPos) => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const selloBase64 = canvas.toDataURL('image/png');
          doc.addImage(selloBase64, 'PNG', xPos, sigY, sigW, sigH);
        };
        addSello(s1, startX);
        addSello(s2, startX + sigW + gap);
      } else if (s1) {
        const canvas = document.createElement('canvas');
        canvas.width = s1.width;
        canvas.height = s1.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(s1, 0, 0);
        const selloBase64 = canvas.toDataURL('image/png');
        const imgX = (pageW - sigW) / 2;
        doc.addImage(selloBase64, 'PNG', imgX, sigY, sigW, sigH);
      } else if (s2) {
        const canvas = document.createElement('canvas');
        canvas.width = s2.width;
        canvas.height = s2.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(s2, 0, 0);
        const selloBase64 = canvas.toDataURL('image/png');
        const imgX = (pageW - sigW) / 2;
        doc.addImage(selloBase64, 'PNG', imgX, sigY, sigW, sigH);
      }

      // FOOTER
      footerTR(doc, { ...datosFinales, footerOffsetY: 8 });

      // PRINT
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => iframe.contentWindow.print();
  })
  
}
