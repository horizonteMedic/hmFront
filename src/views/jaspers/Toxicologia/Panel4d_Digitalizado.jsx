// src/views/jaspers/Toxicologia/Panel4d_Digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { dibujarFirmas } from '../../utils/dibujarFirmas.js';

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 100,
  col3X: 170,
  fontSize: {
    title: 14,
    header: 9,
    body: 9,
  },
  font: 'helvetica',
  lineHeight: 7,
};

// --- Funciones de Ayuda ---

const drawResultRow = (doc, y, label, result, units) => {
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(label || "", config.col1X, y);
  doc.text(String(result || ""), config.col2X, y, { align: "center" });
  doc.text(String(units || ""), config.col3X, y, { align: "center" });
  return y + config.lineHeight;
};

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
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
  let yPos = 43;

  // Header DATOS PERSONALES
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : '';

  // Fila 1: Nombres y Apellidos (fila completa)
  const nombresCompletos = (datos.nombresPaciente && datos.apellidosPaciente)
    ? `${datos.nombresPaciente} ${datos.apellidosPaciente}`
    : datos.nombres || datos.nombreCompleto || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Nombres y Apellidos:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(nombresCompletos, tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  // Fila 2: DNI | Edad | Sexo
  const dni = datos.dniPaciente || datos.dni || datos.codPa || '';
  const edad = datos.edadPaciente || datos.edad || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(dni), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(edad ? edad + " AÑOS" : '', tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  yPos += filaAltura;

  // Fila 3: Lugar Nacimiento | Estado Civil
  const lugarNacimiento = datos.lugarNacimientoPaciente || datos.lugarNacimiento || '';
  const estadoCivil = datos.estadoCivilPaciente || datos.estadoCivil || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(lugarNacimiento, tablaInicioX + 38, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(estadoCivil, tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // Fila 4: Tipo Examen | Fecha Nac.
  const tipoExamen = datos.tipoExamen || datos.nombreExamen || '';
  const fechaNacimiento = datos.fechaNacimientoPaciente || datos.fechaNacimiento || datos.fechaNac || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(tipoExamen, tablaInicioX + 28, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(fechaNacimiento), tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // Fila 5: Nivel de Estudio (fila completa)
  const nivelEstudio = datos.nivelEstudioPaciente || datos.nivelEstudio || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(nivelEstudio, tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  // Fila 6: Ocupación (fila completa)
  const ocupacion = datos.ocupacionPaciente || datos.ocupacion || datos.areaO || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(ocupacion, tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // Fila 7: Cargo (fila completa)
  const cargo = datos.cargoPaciente || datos.cargo || datos.cargoDesempenar || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(cargo, tablaInicioX + 18, yPos + 3.5);
  yPos += filaAltura;

  // Fila 8: Área (fila completa)
  const area = datos.areaPaciente || datos.area || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(area, tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  // Fila 9: Empresa (fila completa)
  const empresa = datos.empresa || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(empresa, tablaInicioX + 20, yPos + 3.5);
  yPos += filaAltura;

  // Fila 10: Contrata (fila completa)
  const contrata = datos.contrata || '';
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(contrata, tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

// --- Componente Principal ---

export default async function Panel4d_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  await drawHeader(doc, datos);

  // === TÍTULO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("TOXICOLÓGICO", pageW / 2, 38, { align: "center" });

  // === DATOS DEL PACIENTE ===
  const finalYPos = drawPatientData(doc, datos);

  // === CUERPO ===
  let y = finalYPos + 10;

    // Muestra y Método
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("MUESTRA :", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text("ORINA", config.margin + 30, y);
    y += config.lineHeight;

    doc.setFont(config.font, "bold");
    doc.text("MÉTODO :", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text("INMUNOCROMATOGRAFICO", config.margin + 30, y);
    y += config.lineHeight * 2;

    // Encabezado de tabla
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA CUALITATIVO", config.col1X, y);
    doc.text("RESULTADOS", config.col2X, y, { align: 'center' });
    doc.text("UNIDADES", config.col3X, y, { align: 'center' });
    y += 3;

    // Línea
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;

    // Título del Panel
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("DROGAS PANEL 4D", config.col1X, y);
    y += config.lineHeight;

    // Datos - usando las claves exactas del JSON y convirtiendo booleanos a texto
    const tests = [
      { label: "COCAINA", key: "cocaina" },
      { label: "MARIHUANA", key: "marihuana" },
      { label: "OPIACEOS", key: "opiaceos" },
      { label: "METHANFETAMINA", key: "metanfetamina" },
    ];

    tests.forEach(({ label, key }) => {
      // Convertir booleano a texto: true = "POSITIVO", false = "NEGATIVO"
      let value = "NEGATIVO";
      if (datos[key] != null) {
        if (typeof datos[key] === 'boolean') {
          value = datos[key] ? "POSITIVO" : "NEGATIVO";
        } else if (typeof datos[key] === 'string') {
          value = datos[key].toUpperCase() === 'TRUE' || datos[key].toUpperCase() === 'POSITIVO' 
            ? "POSITIVO" 
            : "NEGATIVO";
        } else {
          value = String(datos[key] || "NEGATIVO");
        }
      }
      y = drawResultRow(doc, y, label, value, "S/U");
    });

    // === FIRMAS ===
    const yFirmas = 210; // Posición Y para las firmas
    dibujarFirmas({ doc, datos, y: yFirmas, pageW })
      .then(() => {
        // === FOOTER ===
        footerTR(doc, { footerOffsetY: 8 });

        // === Imprimir ===
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        };
      })
      .catch(error => {
        console.error("Error al cargar firmas:", error);
        // Continuar con la impresión aunque falle la carga de firmas
        footerTR(doc, { footerOffsetY: 8 });
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        };
      });
}
