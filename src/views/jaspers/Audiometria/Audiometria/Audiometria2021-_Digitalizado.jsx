import jsPDF from "jspdf";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { formatearFechaCorta } from '../../../utils/formatDateUtils';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

// Header con logo, color box y título
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 10 });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValue = datos.sede || datos.nombreSede || "";
  doc.text("Sede: " + sedeValue, pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = formatearFechaCorta(datos.fechaExamen || datos.fechaRegistro || datos.fecha || datos.fechaAu || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
  if (datos.color && datos.textoColor) {
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  }
};

// Función para dibujar texto con salto de línea
const dibujarTextoConSaltoLinea = (doc, texto, x, y, anchoMaximo) => {
  const fontSize = doc.internal.getFontSize();
  const palabras = String(texto || "").split(' ');
  let lineaActual = '';
  let yActual = y;
  palabras.forEach(palabra => {
    const prueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
    const w = doc.getTextWidth(prueba);
    if (w <= anchoMaximo) {
      lineaActual = prueba;
    } else {
      if (lineaActual) {
        doc.text(lineaActual, x, yActual);
        yActual += fontSize * 0.35;
        lineaActual = palabra;
      } else {
        doc.text(palabra, x, yActual);
        yActual += fontSize * 0.35;
      }
    }
  });
  if (lineaActual) doc.text(lineaActual, x, yActual);
  return yActual;
};

// Función para dibujar datos personales
const drawPatientData = (doc, datos = {}) => {
  // Parámetros de tabla
  const tablaInicioX = 5;
  const tablaInicioY = 35;
  const tablaAncho = 200;
  const filaAltura = 4;
  let yPos = tablaInicioY;

  // Header de sección filiación (datos personales)
  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + alturaHeader / 2 + 1);
    return yPosLocal + alturaHeader;
  };

  // Preparar datos
  const nombres = String(datos.nombres || "");
  const apellidos = String(datos.apellidos || "");
  const nombresCompletos = `${apellidos} ${nombres}`.trim();
  const dni = String(datos.dni || "");
  const edad = String(datos.edad || "").replace(" años", "").trim();
  const sexo = datos.sexo === 'F' || datos.sexo === 'Femenino' ? 'FEMENINO' : datos.sexo === 'M' || datos.sexo === 'Masculino' ? 'MASCULINO' : '';
  const fechaNacimiento = formatearFechaCorta(datos.fechaNac || datos.fechaNacimiento || "");
  const lugarNacimiento = String(datos.lugarNacimiento || "");
  const direccion = String(datos.direccionPaciente || "");
  const estadoCivil = String(datos.estadoCivil || "");
  const nivelEstudio = String(datos.nivelEstudio || datos.nivelEstudios || "");
  const ocupacion = String(datos.ocupacion || datos.cargo || "");
  const areaTrabajo = String(datos.areaTrabajo || datos.area || "");
  const empresa = String(datos.empresa || "");
  const contrata = String(datos.contrata || "");

  // Sección: 1. DATOS PERSONALES
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Fila: Apellidos y Nombres (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Lugar de Nacimiento, Estado Civil, Nivel de Estudio (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 65, yPos, tablaInicioX + 65, yPos + filaAltura);
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Dirección (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Ocupación (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Área de Trabajo (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Empresa (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Contrata (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de la tabla (centrado verticalmente en cada fila)
  let yTexto = tablaInicioY + filaAltura;
  const yCentro = (y) => y + filaAltura / 2 + 1;

  // Apellidos y Nombres
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yCentro(yTexto));
  dibujarTextoConSaltoLinea(doc, nombresCompletos, tablaInicioX + 35, yCentro(yTexto), 150);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("DNI:", tablaInicioX + 2, yCentro(yTexto));
  doc.text(dni, tablaInicioX + 12, yCentro(yTexto));

  doc.text("Edad:", tablaInicioX + 47, yCentro(yTexto));
  doc.text((edad ? edad + " Años" : ""), tablaInicioX + 58, yCentro(yTexto));

  doc.text("Sexo:", tablaInicioX + 92, yCentro(yTexto));
  doc.text(sexo, tablaInicioX + 105, yCentro(yTexto));

  doc.text("Fecha Nac.:", tablaInicioX + 137, yCentro(yTexto));
  doc.text(fechaNacimiento || "", tablaInicioX + 155, yCentro(yTexto));
  yTexto += filaAltura;

  // Lugar de Nacimiento, Estado Civil, Nivel de Estudio
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yCentro(yTexto));
  doc.text(lugarNacimiento, tablaInicioX + 35, yCentro(yTexto));

  doc.text("Estado Civil:", tablaInicioX + 67, yCentro(yTexto));
  doc.text(estadoCivil, tablaInicioX + 82, yCentro(yTexto));

  doc.text("Nivel de Estudio:", tablaInicioX + 132, yCentro(yTexto));
  doc.text(nivelEstudio, tablaInicioX + 150, yCentro(yTexto));
  yTexto += filaAltura;

  // Dirección
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Dirección:", tablaInicioX + 2, yCentro(yTexto));
  dibujarTextoConSaltoLinea(doc, direccion, tablaInicioX + 20, yCentro(yTexto), 170);
  yTexto += filaAltura;

  // Ocupación
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Ocupación:", tablaInicioX + 2, yCentro(yTexto));
  dibujarTextoConSaltoLinea(doc, ocupacion, tablaInicioX + 25, yCentro(yTexto), 165);
  yTexto += filaAltura;

  // Área de Trabajo
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yCentro(yTexto));
  dibujarTextoConSaltoLinea(doc, areaTrabajo, tablaInicioX + 30, yCentro(yTexto), 160);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Empresa:", tablaInicioX + 2, yCentro(yTexto));
  dibujarTextoConSaltoLinea(doc, empresa, tablaInicioX + 24, yCentro(yTexto), 160);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Contratista:", tablaInicioX + 2, yCentro(yTexto));
  dibujarTextoConSaltoLinea(doc, contrata, tablaInicioX + 24, yCentro(yTexto), 160);
  yTexto += filaAltura;

  return yPos;
};

// Función para dibujar X (checkbox marcado)
const dibujarX = (doc, x, y) => {
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("X", x, y, { align: "center" });
};

// Función para dibujar Síntomas Actuales
const drawSintomasActuales = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 4;
  let yPos = yInicio;

  // Header de sección
  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + alturaHeader / 2 + 1);
    return yPosLocal + alturaHeader;
  };

  // Sección: 2. SÍNTOMAS ACTUALES
  yPos = dibujarHeaderSeccion("2. SÍNTOMAS ACTUALES", yPos, filaAltura);

  // Fila header: Sí | No (repetido para cada síntoma)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dividir en columnas: cada síntoma tiene su label + Si + No
  const numSintomas = 5;
  const anchoColumna = tablaAncho / numSintomas;
  const anchoLabel = anchoColumna * 0.5;
  const anchoSi = anchoColumna * 0.25;
  const anchoNo = anchoColumna * 0.25;

  for (let i = 0; i <= numSintomas; i++) {
    const x = tablaInicioX + (i * anchoColumna);
    doc.line(x, yPos, x, yPos + filaAltura);
    if (i < numSintomas) {
      const xSi = x + anchoLabel;
      const xNo = xSi + anchoSi;
      doc.line(xSi, yPos, xSi, yPos + filaAltura);
      doc.line(xNo, yPos, xNo, yPos + filaAltura);
    }
  }

  const yCentroHeader = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  for (let i = 0; i < numSintomas; i++) {
    const xInicio = tablaInicioX + (i * anchoColumna);
    const xSi = xInicio + anchoLabel;
    const xNo = xSi + anchoSi;
    doc.text("Si", xSi + anchoSi / 2, yCentroHeader, { align: "center" });
    doc.text("No", xNo + anchoNo / 2, yCentroHeader, { align: "center" });
  }
  yPos += filaAltura;

  // Fila de síntomas
  const sintomas = [
    { nombre: "Sordera", si: datos.rbsasorderaSi, no: datos.rbsasorderaNo },
    { nombre: "Vértigo", si: datos.rbsavertigoSi, no: datos.rbsavertigoNo },
    { nombre: "Secreción Ótica", si: datos.rbsasecrecionSi, no: datos.rbsasecrecionNo },
    { nombre: "Acúfenos", si: datos.rbsaacufenosSi, no: datos.rbsaacufenosNo },
    { nombre: "Otalgia", si: datos.rbsaotalgiaSi, no: datos.rbsaotalgiaNo }
  ];

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroFila = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);

  sintomas.forEach((sintoma, index) => {
    const xInicio = tablaInicioX + (index * anchoColumna);
    const xSi = xInicio + anchoLabel;
    const xNo = xSi + anchoSi;

    doc.line(xInicio, yPos, xInicio, yPos + filaAltura);
    doc.line(xSi, yPos, xSi, yPos + filaAltura);
    doc.line(xNo, yPos, xNo, yPos + filaAltura);

    doc.text(sintoma.nombre, xInicio + 1, yCentroFila);
    if (sintoma.si === true) {
      dibujarX(doc, xSi + anchoSi / 2, yCentroFila);
    }
    if (sintoma.no === true) {
      dibujarX(doc, xNo + anchoNo / 2, yCentroFila);
    }
  });
  yPos += filaAltura;

  // Fila: Otros síntomas ORL
  const alturaOtros = filaAltura * 2;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaOtros);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaOtros);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaOtros, tablaInicioX + tablaAncho, yPos + alturaOtros);

  const yCentroOtros = yPos + alturaOtros / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Otros síntomas ORL:", tablaInicioX + 2, yCentroOtros);
  const otrosSintomas = String(datos.txtsaotrossintomas || "");
  dibujarTextoConSaltoLinea(doc, otrosSintomas, tablaInicioX + 35, yCentroOtros, 160);
  yPos += alturaOtros;

  return yPos;
};

// Función para dibujar Antecedentes Médicos de Importancia
const drawAntecedentesMedicos = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 4;
  let yPos = yInicio;

  // Header de sección
  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + alturaHeader / 2 + 1);
    return yPosLocal + alturaHeader;
  };

  // Sección: 3. ANTECEDENTES MÉDICOS DE IMPORTANCIA
  yPos = dibujarHeaderSeccion("3. ANTECEDENTES MÉDICOS DE IMPORTANCIA", yPos, filaAltura);

  // Fila header: Sí | No (repetido para cada antecedente)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dividir en columnas: cada antecedente tiene su label + Si + No
  const numAntecedentesPorFila = 3;
  const anchoColumna = tablaAncho / numAntecedentesPorFila;
  const anchoLabel = anchoColumna * 0.5;
  const anchoSi = anchoColumna * 0.25;
  const anchoNo = anchoColumna * 0.25;

  for (let i = 0; i <= numAntecedentesPorFila; i++) {
    const x = tablaInicioX + (i * anchoColumna);
    doc.line(x, yPos, x, yPos + filaAltura);
    if (i < numAntecedentesPorFila) {
      const xSi = x + anchoLabel;
      const xNo = xSi + anchoSi;
      doc.line(xSi, yPos, xSi, yPos + filaAltura);
      doc.line(xNo, yPos, xNo, yPos + filaAltura);
    }
  }

  const yCentroHeader = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  for (let i = 0; i < numAntecedentesPorFila; i++) {
    const xInicio = tablaInicioX + (i * anchoColumna);
    const xSi = xInicio + anchoLabel;
    const xNo = xSi + anchoSi;
    doc.text("Si", xSi + anchoSi / 2, yCentroHeader, { align: "center" });
    doc.text("No", xNo + anchoNo / 2, yCentroHeader, { align: "center" });
  }
  yPos += filaAltura;

  // Filas de antecedentes
  const filasAntecedentes = [
    [
      { nombre: "Rinitis", si: datos.rbamrenitisSi, no: datos.rbamrenitisNo },
      { nombre: "Meningitis", si: datos.rbammeningitisSi, no: datos.rbammeningitisNo },
      { nombre: "Parotiditis", si: datos.rbamparotiditisSi, no: datos.rbamparotiditisNo }
    ],
    [
      { nombre: "Sinusitis", si: datos.rbamsinusitisSi, no: datos.rbamsinusitisNo },
      { nombre: "TEC", si: datos.rbamtecSi, no: datos.rbamtecNo },
      { nombre: "Sarampión", si: datos.rbamsarampionSi, no: datos.rbamsarampionNo }
    ],
    [
      { nombre: "Otitis Media Crónica", si: datos.rbamotitisSi, no: datos.rbamotitisNo },
      { nombre: "Sordera", si: datos.rbamsorderaSi, no: datos.rbamsorderaNo },
      { nombre: "TBC", si: datos.rbamtbcSi, no: datos.rbamtbcNo }
    ]
  ];

  filasAntecedentes.forEach(fila => {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentroFila = yPos + filaAltura / 2 + 1;
    doc.setFont("helvetica", "normal").setFontSize(7);

    fila.forEach((antecedente, index) => {
      const xInicio = tablaInicioX + (index * anchoColumna);
      const xSi = xInicio + anchoLabel;
      const xNo = xSi + anchoSi;

      doc.line(xInicio, yPos, xInicio, yPos + filaAltura);
      doc.line(xSi, yPos, xSi, yPos + filaAltura);
      doc.line(xNo, yPos, xNo, yPos + filaAltura);

      doc.text(antecedente.nombre, xInicio + 1, yCentroFila);
      if (antecedente.si === true) {
        dibujarX(doc, xSi + anchoSi / 2, yCentroFila);
      }
      if (antecedente.no === true) {
        dibujarX(doc, xNo + anchoNo / 2, yCentroFila);
      }
    });
    yPos += filaAltura;
  });

  // Fila: Medicamentos Ototóxicos
  const alturaMedicamentos = filaAltura * 2;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaMedicamentos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaMedicamentos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaMedicamentos, tablaInicioX + tablaAncho, yPos + alturaMedicamentos);

  const yCentroMedicamentos = yPos + alturaMedicamentos / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Medicamentos Ototóxicos:", tablaInicioX + 2, yCentroMedicamentos);
  const medicamentos = String(datos.txtamcuales || "");
  dibujarTextoConSaltoLinea(doc, medicamentos, tablaInicioX + 45, yCentroMedicamentos, 150);
  yPos += alturaMedicamentos;

  return yPos;
};

// Función para dibujar Exposición Ocupacional
const drawExposicionOcupacional = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 4;
  let yPos = yInicio;

  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, "F");
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + alturaHeader / 2 + 1);
    return yPosLocal + alturaHeader;
  };

  // Sección: 4. EXPOSICIÓN OCUPACIONAL
  yPos = dibujarHeaderSeccion("4. EXPOSICIÓN OCUPACIONAL", yPos, filaAltura);

  // Layout general: [Etiqueta] [SI] [NO] | [Bloque derecho]
  const wEtiqueta = 60;
  const wSi = 8;
  const wNo = 8;
  const wDerecha = tablaAncho - (wEtiqueta + wSi + wNo);

  const x0 = tablaInicioX;
  const xEtiquetaEnd = x0 + wEtiqueta;
  const xSiEnd = xEtiquetaEnd + wSi;
  const xNoEnd = xSiEnd + wNo;
  const xEnd = tablaInicioX + tablaAncho;

  const yMid = (yy) => yy + filaAltura / 2 + 1;

  const drawRowBase = (altura = filaAltura) => {
    doc.rect(tablaInicioX, yPos, tablaAncho, altura);
    doc.line(xEtiquetaEnd, yPos, xEtiquetaEnd, yPos + altura);
    doc.line(xSiEnd, yPos, xSiEnd, yPos + altura);
    doc.line(xNoEnd, yPos, xNoEnd, yPos + altura);
  };

  // ===== Row 1: Exposición a ruido + tiempo de exposición =====
  // Subheader dentro del bloque derecho
  const alturaRuido = filaAltura * 3; // cabecera + opciones + años/meses
  drawRowBase(alturaRuido);

  // División interna del bloque derecho: opciones (5 columnas)
  const opciones = [
    { key: "rbte0a2", label: "0 a 2" },
    { key: "rbte2a4", label: "2 a 4" },
    { key: "rbte4a6", label: "4 a 6" },
    { key: "rbte6a8", label: "6 a 8" },
    { key: "rbtem12", label: ">12" },
    { key: "rbteeventual", label: "Eventual" },
  ];
  const cols = opciones.length;
  const wCol = wDerecha / cols;

  // Líneas horizontales internas (3 filas)
  // - fila 1: título
  // - fila 2: opciones
  // - fila 3: Años/Meses (combinada)
  doc.line(xNoEnd, yPos + filaAltura, xEnd, yPos + filaAltura);
  doc.line(xNoEnd, yPos + filaAltura * 2, xEnd, yPos + filaAltura * 2);

  // Líneas verticales:
  // - opciones: solo en la fila 2 (no dividir el título ni la fila Años/Meses)
  for (let i = 1; i < cols; i++) {
    const xx = xNoEnd + i * wCol;
    doc.line(xx, yPos + filaAltura, xx, yPos + filaAltura * 2);
  }
  // - Años/Meses: una sola división al centro (mitad de columnas)
  const xAniosMeses = xNoEnd + wDerecha / 2;
  doc.line(xAniosMeses, yPos + filaAltura * 2, xAniosMeses, yPos + alturaRuido);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Exposición a ruido", x0 + 2, yMid(yPos));
  if (datos.rbeoexposicionSi === true) dibujarX(doc, xEtiquetaEnd + wSi / 2, yMid(yPos));
  if (datos.rbeoexposicionNo === true) dibujarX(doc, xSiEnd + wNo / 2, yMid(yPos));

  // Título del bloque derecho (fila 1)
  doc.text("Tiempo de exposición (Promedio de hrs por día)", xNoEnd + wDerecha / 2, yMid(yPos), { align: "center" });

  // Fila 2: labels de opciones + X
  const yOpc = yPos + filaAltura;
  const yOpcMid = yMid(yOpc);
  opciones.forEach((op, idx) => {
    const cellX = xNoEnd + idx * wCol;
    doc.text(op.label, cellX + wCol / 2, yOpcMid, { align: "center" });
    if (datos?.[op.key] === true) dibujarX(doc, cellX + wCol / 2, yOpcMid);
  });

  // Fila 3: Años y meses (aprox.)
  const yAn = yPos + filaAltura * 2;
  const yAnMid = yMid(yAn);
  doc.text("Años:", xNoEnd + 2, yAnMid);
  doc.text(String(datos.txtanios ?? ""), xNoEnd + 16, yAnMid);
  doc.text("Meses:", xAniosMeses + 2, yAnMid);
  doc.text(String(datos.txtmeses ?? ""), xAniosMeses + 18, yAnMid);

  yPos += alturaRuido;

  // ===== Row 2: Uso de protectores auditivos + tipo de protectores =====
  const alturaProt = filaAltura * 2;
  drawRowBase(alturaProt);

  // Dividir bloque derecho en 2 columnas (Tapones/Orejeras)
  const wProtCol = wDerecha / 2;
  // Solo dividir la fila inferior (tapones/orejeras), no el título
  doc.line(xNoEnd + wProtCol, yPos + filaAltura, xNoEnd + wProtCol, yPos + alturaProt);
  doc.line(xNoEnd, yPos + filaAltura, xEnd, yPos + filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Uso de Protectores Auditivos", x0 + 2, yMid(yPos));
  if (datos.rbeoprotectoresSi === true) dibujarX(doc, xEtiquetaEnd + wSi / 2, yMid(yPos));
  if (datos.rbeoprotectoresNo === true) dibujarX(doc, xSiEnd + wNo / 2, yMid(yPos));

  doc.text("Tipo de Protectores", xNoEnd + wDerecha / 2, yMid(yPos), { align: "center" });

  const yProt = yPos + filaAltura;
  const yProtMid = yMid(yProt);
  doc.text("Tapones", xNoEnd + wProtCol / 2, yProtMid, { align: "center" });
  if (datos.chktapones === true) dibujarX(doc, xNoEnd + wProtCol / 2, yProtMid);
  doc.text("Orejeras", xNoEnd + wProtCol + wProtCol / 2, yProtMid, { align: "center" });
  if (datos.chkorejeras === true) dibujarX(doc, xNoEnd + wProtCol + wProtCol / 2, yProtMid);

  yPos += alturaProt;

  // ===== Row 3: Exposición a sustancias químicas + químicos (hrs/años) =====
  const alturaQuim = filaAltura * 3;
  drawRowBase(alturaQuim);

  // Bloque derecho: 6 químicos
  const quim = [
    { label: "Plomo", h: "txthplomo", t: "txttplomo" },
    { label: "Mercurio", h: "txthmercurio", t: "txttmercurio" },
    { label: "Tolueno", h: "txthtolueno", t: "txtttolueno" },
    { label: "Xileno", h: "txthxileno", t: "txttxileno" },
    { label: "Plaguic", h: "txthplaguic", t: "txttplaguic" },
    { label: "Organofos", h: "txthorganofos", t: "txttorganofos" },
  ];
  const wQ = wDerecha / quim.length;
  for (let i = 1; i < quim.length; i++) {
    const xx = xNoEnd + i * wQ;
    doc.line(xx, yPos, xx, yPos + alturaQuim);
  }
  doc.line(xNoEnd, yPos + filaAltura, xEnd, yPos + filaAltura);
  doc.line(xNoEnd, yPos + filaAltura * 2, xEnd, yPos + filaAltura * 2);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Exposición a sustancias químicas", x0 + 2, yMid(yPos));
  if (datos.rbeosustanciasSi === true) dibujarX(doc, xEtiquetaEnd + wSi / 2, yMid(yPos));
  if (datos.rbeosustanciasNo === true) dibujarX(doc, xSiEnd + wNo / 2, yMid(yPos));

  // Fila 1 derecha: nombres
  const yQ0 = yPos;
  const yQ0Mid = yMid(yQ0);
  quim.forEach((q, idx) => {
    const cellX = xNoEnd + idx * wQ;
    doc.text(q.label, cellX + wQ / 2, yQ0Mid, { align: "center" });
  });

  // Fila 2 derecha: (Hrs.)
  const yQ1 = yPos + filaAltura;
  const yQ1Mid = yMid(yQ1);
  quim.forEach((q, idx) => {
    const cellX = xNoEnd + idx * wQ;
    doc.text(String(datos?.[q.h] ?? ""), cellX + wQ / 2, yQ1Mid, { align: "center" });
  });

  // Fila 3 derecha: (T.Años)
  const yQ2 = yPos + filaAltura * 2;
  const yQ2Mid = yMid(yQ2);
  quim.forEach((q, idx) => {
    const cellX = xNoEnd + idx * wQ;
    doc.text(String(datos?.[q.t] ?? ""), cellX + wQ / 2, yQ2Mid, { align: "center" });
  });

  yPos += alturaQuim;

  // Fila: Otros (Detallar)
  const alturaOtros = filaAltura * 2;
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaOtros);
  const yOtrosMid = yPos + alturaOtros / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Otros (Detallar):", tablaInicioX + 2, yOtrosMid);
  dibujarTextoConSaltoLinea(doc, String(datos.txteootros || ""), tablaInicioX + 35, yOtrosMid, 160);
  yPos += alturaOtros;

  return yPos;
};

// Función para dibujar Antecedentes Extra-Laborales
const drawAntecedentesExtraLaborales = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 4;
  let yPos = yInicio;

  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, "F");
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + alturaHeader / 2 + 1);
    return yPosLocal + alturaHeader;
  };

  yPos = dibujarHeaderSeccion("5. ANTECEDENTES EXTRA-LABORALES", yPos, filaAltura);

  // Header SI/NO por cada item (3 items)
  const numItems = 3;
  const anchoColumna = tablaAncho / numItems;
  const anchoLabel = anchoColumna * 0.6;
  const anchoSi = anchoColumna * 0.2;
  const anchoNo = anchoColumna * 0.2;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  for (let i = 0; i <= numItems; i++) {
    const x = tablaInicioX + i * anchoColumna;
    doc.line(x, yPos, x, yPos + filaAltura);
    if (i < numItems) {
      const xSi = x + anchoLabel;
      const xNo = xSi + anchoSi;
      doc.line(xSi, yPos, xSi, yPos + filaAltura);
      doc.line(xNo, yPos, xNo, yPos + filaAltura);
    }
  }

  const yH = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  for (let i = 0; i < numItems; i++) {
    const xInicio = tablaInicioX + i * anchoColumna;
    const xSi = xInicio + anchoLabel;
    const xNo = xSi + anchoSi;
    doc.text("Si", xSi + anchoSi / 2, yH, { align: "center" });
    doc.text("No", xNo + anchoNo / 2, yH, { align: "center" });
  }
  yPos += filaAltura;

  // Fila items con X (encima de SI o NO)
  const items = [
    { nombre: "Practica tiro", si: datos.rbaepraticaSi, no: datos.rbaepraticaNo },
    { nombre: "Uso de walkman", si: datos.rbaeusoSi, no: datos.rbaeusoNo },
    { nombre: "Otros", si: datos.rbaeotrosSi, no: datos.rbaeotrosNo },
  ];

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  const yRow = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  items.forEach((it, idx) => {
    const xInicio = tablaInicioX + idx * anchoColumna;
    const xSi = xInicio + anchoLabel;
    const xNo = xSi + anchoSi;
    doc.line(xInicio, yPos, xInicio, yPos + filaAltura);
    doc.line(xSi, yPos, xSi, yPos + filaAltura);
    doc.line(xNo, yPos, xNo, yPos + filaAltura);
    doc.text(it.nombre, xInicio + 2, yRow);
    if (it.si === true) dibujarX(doc, xSi + anchoSi / 2, yRow);
    if (it.no === true) dibujarX(doc, xNo + anchoNo / 2, yRow);
  });
  yPos += filaAltura;

  // Fila: Detallar
  const alturaDet = filaAltura * 2;
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaDet);
  const yDetMid = yPos + alturaDet / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Detallar:", tablaInicioX + 2, yDetMid);
  dibujarTextoConSaltoLinea(doc, String(datos.txtaecuales || ""), tablaInicioX + 20, yDetMid, 175);
  yPos += alturaDet;

  return yPos;
};

// Función para dibujar Otoscopia (en fila gris con OD/OI)
const drawOtoscopia = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 4;
  let yPos = yInicio;

  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "F");
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);

  // Columnas: título | OD | OI
  const wTitulo = 55;
  const wOD = (tablaAncho - wTitulo) / 2;
  const xTituloEnd = tablaInicioX + wTitulo;
  const xODEnd = xTituloEnd + wOD;
  doc.line(xTituloEnd, yPos, xTituloEnd, yPos + filaAltura);
  doc.line(xODEnd, yPos, xODEnd, yPos + filaAltura);

  const yMid = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("6. OTOSCOPIA", tablaInicioX + 2, yMid);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(`Oído derecho: ${String(datos.txtood || "")}`, xTituloEnd + 2, yMid);
  doc.text(`Oído izquierdo: ${String(datos.txtooi || "")}`, xODEnd + 2, yMid);

  yPos += filaAltura;
  return yPos;
};

// Función para dibujar Audiometría (gráfico simple estilo ficha)
const drawAudiometriaGrafico = async (doc, datos = {}, yInicio) => {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2;
  const filaAltura = 4;
  let yPos = yInicio;

  // Verificar si necesitamos nueva página
  const colH = 75;
  if (yPos + colH + 20 > pageH) {
    doc.addPage();
    await drawHeader(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("FICHA DE EVALUACIÓN AUDIOMETRÍA", pageW / 2, 32, { align: "center" });
    yPos = 50;
    footerTR(doc, { footerOffsetY: 12, fontSize: 8 });
  }

  // Header gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "F");
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("7. AUDIOMETRÍA (Oído Derecho: Rojo , Oído Izquierdo: Azul)", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura + 2;

  // Layout como FichaAudiologica: Gráfico (izq) + Imagen leyenda (der) - dos columnas ordenadas
  const colGap = 8;
  const dbLabelW = 12;
  const graphW = (tablaAncho - dbLabelW - colGap) / 2; // Gráfico ocupa la mitad
  const legendW = tablaAncho - dbLabelW - graphW - colGap; // Imagen ocupa el resto
  const graphH = colH; // 75mm de altura
  const graphX = tablaInicioX + dbLabelW; // Gráfico después de dB
  const legendX = graphX + graphW + colGap; // Imagen después del gráfico
  const graphY = yPos + 8;

  const freqs = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];

  const toNumberOrNull = (valor) => {
    if (valor === undefined || valor === null) return null;
    const v = String(valor).trim();
    if (!v || v === "-" || v.toUpperCase() === "N/A") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // Cargar y mostrar imagen de leyenda (columna izquierda)
  try {
    const legendImgW = legendW;
    const legendImgH = graphH; // Misma altura que el gráfico
    const legendImgY = graphY;
    doc.addImage(
      "/img/frame_audiodigializado.png",
      "PNG",
      legendX,
      legendImgY,
      legendImgW,
      legendImgH
    );
  } catch (error) {
    console.log("Error cargando imagen de leyenda:", error);
  }

  // Fondo azul 20-40 dB (gráfico)
  doc.setFillColor(180, 235, 255);
  const y20 = graphY + ((20 + 10) / 130) * graphH;
  const y40 = graphY + ((40 + 10) / 130) * graphH;
  doc.rect(graphX, y20, graphW, y40 - y20, "F");

  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.rect(graphX, graphY, graphW, graphH);

  // Líneas horizontales (cada 10 dB, de -10 a 120)
  for (let i = 0; i <= 13; i++) {
    const yLine = graphY + i * (graphH / 13);
    doc.line(graphX, yLine, graphX + graphW, yLine);
  }
  // Líneas verticales (frecuencias)
  for (let i = 0; i < freqs.length; i++) {
    const xLine = graphX + i * (graphW / (freqs.length - 1));
    doc.line(xLine, graphY, xLine, graphY + graphH);
  }

  // Etiquetas Hz
  doc.setFont("helvetica", "normal").setFontSize(7);
  for (let i = 0; i < freqs.length; i++) {
    const xTick = graphX + i * (graphW / 8);
    doc.text(String(freqs[i]), xTick, graphY - 2, { align: "center" });
  }
  doc.text("Hz", graphX + graphW + 4, graphY - 2, { align: "left" });

  // Etiquetas dB
  for (let i = 0; i <= 13; i++) {
    const dB = -10 + i * 10;
    const yTick = graphY + i * (graphH / 13) + 0.5;
    doc.text(String(dB), graphX - 2, yTick, { align: "right" });
  }
  doc.text("dB", graphX - 7, graphY + graphH / 2 - 2, { align: "right" });

  // Puntos aérea OD/OI
  const puntos = [
    { freq: 500, db: toNumberOrNull(datos.od500), color: "red", tipo: "circle" },
    { freq: 1000, db: toNumberOrNull(datos.od1000), color: "red", tipo: "circle" },
    { freq: 2000, db: toNumberOrNull(datos.od2000), color: "red", tipo: "circle" },
    { freq: 3000, db: toNumberOrNull(datos.od3000), color: "red", tipo: "circle" },
    { freq: 4000, db: toNumberOrNull(datos.od4000), color: "red", tipo: "circle" },
    { freq: 6000, db: toNumberOrNull(datos.od6000), color: "red", tipo: "circle" },
    { freq: 8000, db: toNumberOrNull(datos.od8000), color: "red", tipo: "circle" },

    { freq: 500, db: toNumberOrNull(datos.oi500), color: "blue", tipo: "x" },
    { freq: 1000, db: toNumberOrNull(datos.oi1000), color: "blue", tipo: "x" },
    { freq: 2000, db: toNumberOrNull(datos.oi2000), color: "blue", tipo: "x" },
    { freq: 3000, db: toNumberOrNull(datos.oi3000), color: "blue", tipo: "x" },
    { freq: 4000, db: toNumberOrNull(datos.oi4000), color: "blue", tipo: "x" },
    { freq: 6000, db: toNumberOrNull(datos.oi6000), color: "blue", tipo: "x" },
    { freq: 8000, db: toNumberOrNull(datos.oi8000), color: "blue", tipo: "x" },
  ];

  // Vía ósea (corchetes) — mapeo correcto SIN guión bajo
  const puntosOseos = [
    // OD: [
    { freq: 500, db: toNumberOrNull(datos.od1500), color: "red", tipo: "bracketLeft" },
    { freq: 1000, db: toNumberOrNull(datos.od11000), color: "red", tipo: "bracketLeft" },
    { freq: 2000, db: toNumberOrNull(datos.od12000), color: "red", tipo: "bracketLeft" },
    { freq: 3000, db: toNumberOrNull(datos.od13000), color: "red", tipo: "bracketLeft" },
    { freq: 4000, db: toNumberOrNull(datos.od14000), color: "red", tipo: "bracketLeft" },
    { freq: 6000, db: toNumberOrNull(datos.od16000), color: "red", tipo: "bracketLeft" },
    { freq: 8000, db: toNumberOrNull(datos.od18000), color: "red", tipo: "bracketLeft" },

    // OI: ]
    { freq: 500, db: toNumberOrNull(datos.oi1500), color: "blue", tipo: "bracketRight" },
    { freq: 1000, db: toNumberOrNull(datos.oi11000), color: "blue", tipo: "bracketRight" },
    { freq: 2000, db: toNumberOrNull(datos.oi12000), color: "blue", tipo: "bracketRight" },
    { freq: 3000, db: toNumberOrNull(datos.oi13000), color: "blue", tipo: "bracketRight" },
    { freq: 4000, db: toNumberOrNull(datos.oi14000), color: "blue", tipo: "bracketRight" },
    { freq: 6000, db: toNumberOrNull(datos.oi16000), color: "blue", tipo: "bracketRight" },
    { freq: 8000, db: toNumberOrNull(datos.oi18000), color: "blue", tipo: "bracketRight" },
  ].filter((p) => p.db !== null);

  puntos.push(...puntosOseos);

  // Conectar puntos (aérea) - solo círculos y X, NO corchetes
  const drawSeries = (tipo, rgb) => {
    const pts = puntos
      .filter((p) => p.tipo === tipo && p.db !== null)
      .sort((a, b) => a.freq - b.freq);
    if (pts.length < 2) return;
    doc.setDrawColor(...rgb);
    doc.setLineWidth(tipo === "circle" ? 0.95 : 0.4);
    let prev = null;
    pts.forEach((p) => {
      const idx = freqs.indexOf(p.freq);
      if (idx === -1) return;
      const x = graphX + idx * (graphW / 8);
      const y = graphY + ((p.db + 10) / 130) * graphH;
      if (prev) doc.line(prev.x, prev.y, x, y);
      prev = { x, y };
    });
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
  };
  // Solo conectar círculos y X, NO corchetes
  drawSeries("circle", [255, 0, 0]);
  drawSeries("x", [0, 0, 255]);

  // Dibujar símbolos
  puntos.forEach((p) => {
    if (p.db === null) return;
    const idx = freqs.indexOf(p.freq);
    if (idx === -1) return;
    const x = graphX + idx * (graphW / (freqs.length - 1));
    const y = graphY + ((p.db + 10) / 130) * graphH;

    if (p.color === "red") doc.setDrawColor(255, 0, 0);
    if (p.color === "blue") doc.setDrawColor(0, 0, 255);

    if (p.tipo === "circle") {
      doc.setLineWidth(0.4);
      doc.circle(x, y, 1.0);
    } else if (p.tipo === "x") {
      doc.setLineWidth(0.4);
      const size = 2;
      doc.line(x - size / 2, y - size / 2, x + size / 2, y + size / 2);
      doc.line(x - size / 2, y + size / 2, x + size / 2, y - size / 2);
    } else if (p.tipo === "bracketLeft") {
      // [
      doc.setLineWidth(0.5);
      const w = 2.4;
      const h = 3.6;
      doc.line(x - w / 2, y - h / 2, x - w / 2, y + h / 2);
      doc.line(x - w / 2, y - h / 2, x + w / 2, y - h / 2);
      doc.line(x - w / 2, y + h / 2, x + w / 2, y + h / 2);
    } else if (p.tipo === "bracketRight") {
      // ]
      doc.setLineWidth(0.5);
      const w = 2.4;
      const h = 3.6;
      doc.line(x + w / 2, y - h / 2, x + w / 2, y + h / 2);
      doc.line(x - w / 2, y - h / 2, x + w / 2, y - h / 2);
      doc.line(x - w / 2, y + h / 2, x + w / 2, y + h / 2);
    }
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
  });

  yPos = graphY + graphH + 2;
  return yPos;
};

// Función para dibujar Interpretación - Conclusiones
const drawInterpretacion = (doc, datos = {}, yInicio) => {
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2;
  const filaAltura = 4;
  let yPos = yInicio;

  // Asegurar que el color de las líneas sea negro
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Header gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "F");
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("8.- Interpretación - Conclusiones:", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  // Interpretación Clínica - fila con líneas
  const interpretacionClinica = String(datos?.diagnostico || datos?.interpretacionClinica || "");
  const odResultado = String(datos?.txtdiagOd || "NORMAL");
  const oiResultado = String(datos?.txtdiagOi || "NORMAL");

  // Fila: Interpretación Clínica (solo líneas, sin fondo)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("• Interpretación Clínica: Dx Auditivo + (Incluir detalle: Severidad (Promedio Frec. 500/1000/2000/4000) + (Unilateral/bilateral)):", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  // Texto de interpretación (si existe) - fila con líneas
  if (interpretacionClinica) {
    const lineas = doc.splitTextToSize(interpretacionClinica, tablaAncho - 4);
    const alturaTexto = Math.max(filaAltura, lineas.length * 2.5 + 2);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaTexto, tablaInicioX + tablaAncho, yPos + alturaTexto);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTexto);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTexto);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(lineas, tablaInicioX + 2, yPos + 2.5);
    yPos += alturaTexto;
  }

  // Resultados OD - fila con líneas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(`Oído Derecho: ${odResultado}`, tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  // Resultados OI - fila con líneas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.text(`Oído Izquierdo: ${oiResultado}`, tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  return yPos;
};

// Función para dibujar Comentarios
const drawComentarios = (doc, datos = {}, yInicio) => {
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2;
  const filaAltura = 4;
  let yPos = yInicio;

  // Asegurar que el color de las líneas sea negro
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Header gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "F");
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("COMENTARIOS:", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  // Texto de comentarios - solo líneas
  const comentarios = String(datos?.txtcomentarios || "");
  const lineas = doc.splitTextToSize(comentarios || "-", tablaAncho - 4);
  const alturaTexto = Math.max(filaAltura, lineas.length * 2.5 + 2);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaTexto, tablaInicioX + tablaAncho, yPos + alturaTexto);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTexto);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTexto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(lineas, tablaInicioX + 2, yPos + 2.5);
  yPos += alturaTexto;

  return yPos;
};

// Función para dibujar Recomendaciones
const drawRecomendaciones = (doc, datos = {}, yInicio) => {
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2;
  const filaAltura = 4;
  let yPos = yInicio;

  // Asegurar que el color de las líneas sea negro
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Header gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "F");
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("9.- Recomendaciones:", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  // Uso adecuado de Protección Auditiva - ordenado: texto | Simple | X | Doble | X
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dividir en columnas ordenadas: texto | Simple | X | Doble | X
  const colTextoW = 100;
  const colOpcionW = 25;
  const colXCeldaW = 15;
  
  const x1 = tablaInicioX + colTextoW;
  const x2 = x1 + colOpcionW;
  const x3 = x2 + colXCeldaW;
  const x4 = x3 + colOpcionW;
  
  doc.line(x1, yPos, x1, yPos + filaAltura);
  doc.line(x2, yPos, x2, yPos + filaAltura);
  doc.line(x3, yPos, x3, yPos + filaAltura);
  doc.line(x4, yPos, x4, yPos + filaAltura);
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Uso adecuado de Protección Auditiva........", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  doc.text("Simple", x1 + colOpcionW / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  doc.text("Doble", x3 + colOpcionW / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  
  // Dibujar X en las celdas si están marcadas
  if (datos?.chkrpasimple) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", x2 + colXCeldaW / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  }
  if (datos?.chkrpadoble) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", x4 + colXCeldaW / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  }
  yPos += filaAltura;

  // Control - ordenado: texto | Semestral | X | Anual | X
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dividir en columnas ordenadas: texto | Semestral | X | Anual | X
  const colControlTextoW = 30;
  const colControlOpcionW = 30;
  const colControlXCeldaW = 15;
  
  const cx1 = tablaInicioX + colControlTextoW;
  const cx2 = cx1 + colControlOpcionW;
  const cx3 = cx2 + colControlXCeldaW;
  const cx4 = cx3 + colControlOpcionW;
  
  doc.line(cx1, yPos, cx1, yPos + filaAltura);
  doc.line(cx2, yPos, cx2, yPos + filaAltura);
  doc.line(cx3, yPos, cx3, yPos + filaAltura);
  doc.line(cx4, yPos, cx4, yPos + filaAltura);
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Control :", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  doc.text("Semestral", cx1 + colControlOpcionW / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  doc.text("Anual", cx3 + colControlOpcionW / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  
  // Dibujar X en las celdas si están marcadas
  if (datos?.chkcasemestral) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", cx2 + colControlXCeldaW / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  }
  if (datos?.chkcaanual) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", cx4 + colControlXCeldaW / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  }
  yPos += filaAltura;

  // Otras - solo texto, sin línea
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const otrasRecomendaciones = String(datos?.txtotrasrecomendaciones || "");
  doc.text(`Otras: ${otrasRecomendaciones || "-"}`, tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  return yPos;
};

// Función principal del jasper
export default async function Audiometria2021_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // 1) Header con logo, color box y datos
  await drawHeader(doc, datos);

  // 2) Título principal
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("FICHA DE EVALUACIÓN AUDIOMETRÍA", pageW / 2, 32, { align: "center" });

  // 3) Datos personales
  let yPos = drawPatientData(doc, datos);

  // 4) Síntomas actuales
  yPos = drawSintomasActuales(doc, datos, yPos);

  // 5) Antecedentes médicos de importancia
  yPos = drawAntecedentesMedicos(doc, datos, yPos);

  // 6) Exposición ocupacional
  yPos = drawExposicionOcupacional(doc, datos, yPos);

  // 7) Antecedentes extra-laborales
  yPos = drawAntecedentesExtraLaborales(doc, datos, yPos);

  // 8) Otoscopia
  yPos = drawOtoscopia(doc, datos, yPos);

  // 9) Audiometría (gráfico)
  yPos = await drawAudiometriaGrafico(doc, datos, yPos);

  // Verificar si necesitamos nueva página para las secciones finales
  const espacioNecesario = 80; // Interpretación + Comentarios + Recomendaciones + Firmas
  if (yPos + espacioNecesario > pageH - 20) {
    doc.addPage();
    await drawHeader(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("FICHA DE EVALUACIÓN AUDIOMETRÍA", pageW / 2, 32, { align: "center" });
    yPos = 50;
    footerTR(doc, { footerOffsetY: 12, fontSize: 8 });
  }

  // 10) Interpretación - Conclusiones
  yPos = drawInterpretacion(doc, datos, yPos);

  // 11) Comentarios
  yPos = drawComentarios(doc, datos, yPos);

  // 12) Recomendaciones
  yPos = drawRecomendaciones(doc, datos, yPos);

  // 13) Firmas (sin fila)
  await dibujarFirmas({ doc, datos, y: yPos + 5, pageW });

  // Footer en todas las páginas
  const numPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= numPages; i++) {
    doc.setPage(i);
    footerTR(doc, { footerOffsetY: 12, fontSize: 8 });
  }

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
