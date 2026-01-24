import jsPDF from "jspdf";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split("-");
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Header con datos de ficha, sede y fecha
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
  const fechaExamen = toDDMMYYYY(datos.fechaExamen || datos.fechaRegistro || datos.fechaAu || "");
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

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2; // Centrar la tabla
  const filaAltura = 5;
  let yPos = 35;

  // Preparar datos - mapeo desde los datos del backend
  const apellidosNombres = String(datos?.nombres ?? '');
  const dni = String(datos?.dni ?? '');
  const edad = String(datos?.edad ?? datos?.edadFa ?? '');
  const sexo = datos?.genero === 'F' || datos?.genero === 'Femenino' ? 'FEMENINO' : datos?.genero === 'M' || datos?.genero === 'Masculino' ? 'MASCULINO' : '';
  const fechaNac = toDDMMYYYY(datos?.fechaNacimientoPaciente ?? datos?.fechaNac ?? "");
  const ocupacion = String(datos?.ocupacion ?? '');
  const cargo = String(datos?.cargoPaciente ?? datos?.cargo ?? '');
  const empresa = String(datos?.empresa ?? '');
  const contrata = String(datos?.contrata ?? 'N/A');
  
  // Nuevos campos
  const tipoExamen = String(datos?.nomExam ?? '');
  const marca = String(datos?.txtMarca ?? '');
  const modelo = String(datos?.txtModelo ?? '');
  const calibracion = toDDMMYYYY(datos?.fechaCalibracion ?? '');
  const aniosTrabajo = String(datos?.tiempoTrabajo ?? '');
  const tiempoExposicion = String(datos?.tiempoExposicionTotalPonderado ?? '');
  
  // Uso de protectores auditivos
  let protectoresAuditivos = '';
  if (datos?.chkTapones && datos?.chkgrajeras) {
    protectoresAuditivos = 'Tapones y Orejeras';
  } else if (datos?.chkTapones) {
    protectoresAuditivos = 'Tapones';
  } else if (datos?.chkgrajeras) {
    protectoresAuditivos = 'Orejeras';
  } else {
    protectoresAuditivos = 'No';
  }
  
  // Apreciación del ruido
  let apreciacionRuido = '';
  if (datos?.chkIntenso) {
    apreciacionRuido = 'RUIDO MUY INTENSO';
  } else if (datos?.chkModerado) {
    apreciacionRuido = 'RUIDO MODERADO';
  } else if (datos?.chkNoMolesto) {
    apreciacionRuido = 'RUIDO NO MOLESTO';
  }

  // Header DATOS DE FILIACIÓN
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("1. DATOS DE FILIACIÓN", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila 1: Apellidos y Nombres | T.Examen
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(apellidosNombres, tablaInicioX + 40, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T.Examen:", tablaInicioX + 122, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(tipoExamen, tablaInicioX + 150, yPos + 3.5);
  yPos += filaAltura;

  // Fila 2: DNI | Edad | Sexo | Fecha Nac.
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(dni, tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((edad ? edad + " AÑOS" : ''), tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(fechaNac, tablaInicioX + 165, yPos + 3.5);
  yPos += filaAltura;

  // Fila 3: Ocupación
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(ocupacion, tablaInicioX + 24, yPos + 3.5);
  yPos += filaAltura;

  // Fila 4: Cargo | Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(cargo, tablaInicioX + 18, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(empresa, tablaInicioX + 110, yPos + 3.5);
  yPos += filaAltura;

  // Fila 5: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(contrata, tablaInicioX + 24, yPos + 3.5);
  yPos += filaAltura;

  // Fila 6: AUDIÓMETRO | Marca | Modelo | Calibración
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("AUDIÓMETRO", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Marca:", tablaInicioX + 52, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(marca, tablaInicioX + 65, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Modelo:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(modelo, tablaInicioX + 120, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Calibración:", tablaInicioX + 152, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(calibracion, tablaInicioX + 175, yPos + 3.5);
  yPos += filaAltura;

  // Fila 7: Años de trabajo | Tiempo de exposición
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Años de trabajo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((aniosTrabajo ? aniosTrabajo + " años" : ''), tablaInicioX + 35, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tiempo de exposición:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(tiempoExposicion, tablaInicioX + 155, yPos + 3.5);
  yPos += filaAltura;

  // Fila 8: Uso de protectores auditivos | Apreciación del ruido
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Uso de protectores auditivos:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(protectoresAuditivos, tablaInicioX + 55, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apreciación del ruido:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(apreciacionRuido, tablaInicioX + 155, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

// Función para dibujar la sección de Antecedentes Relacionados
const drawAntecedentesRelacionados = (doc, datos = {}, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2;
  const filaAltura = 5;
  let yPos = yPosInicial;

  // Anchos de columnas
  const colPreguntaW = tablaAncho / 2; // Dos columnas 50/50 (sin espacio entre ellas)
  const colSiW = 6;
  const colNoW = 6;
  const colTextoW = colPreguntaW - colSiW - colNoW;
  
  // Header ANTECEDENTES RELACIONADOS con SI/NO en cada columna
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  
  // Dibujar líneas verticales del header
  // Línea entre texto y SI de la primera columna
  doc.line(tablaInicioX + colTextoW, yPos, tablaInicioX + colTextoW, yPos + filaAltura);
  // Línea entre SI y NO de la primera columna
  doc.line(tablaInicioX + colTextoW + colSiW, yPos, tablaInicioX + colTextoW + colSiW, yPos + filaAltura);
  // Línea divisoria entre las dos columnas principales
  doc.line(tablaInicioX + colPreguntaW, yPos, tablaInicioX + colPreguntaW, yPos + filaAltura);
  // Línea entre texto y SI de la segunda columna
  doc.line(tablaInicioX + colPreguntaW + colTextoW, yPos, tablaInicioX + colPreguntaW + colTextoW, yPos + filaAltura);
  // Línea entre SI y NO de la segunda columna
  doc.line(tablaInicioX + colPreguntaW + colTextoW + colSiW, yPos, tablaInicioX + colPreguntaW + colTextoW + colSiW, yPos + filaAltura);
  
  // Texto del header - alineado a la izquierda como DATOS DE FILIACIÓN
  doc.setFont("helvetica", "bold").setFontSize(8);
  const textoHeader = "2. ANTECEDENTES RELACIONADOS";
  doc.text(textoHeader, tablaInicioX + 2, yPos + 3.5);
  
  // SI/NO de la columna izquierda - centrados en sus celdas
  doc.text("SI", tablaInicioX + colTextoW + colSiW / 2, yPos + 3.5, { align: "center" });
  doc.text("NO", tablaInicioX + colTextoW + colSiW + colNoW / 2, yPos + 3.5, { align: "center" });
  
  // SI/NO de la columna derecha - centrados en sus celdas
  const colDerXHeader = tablaInicioX + colPreguntaW;
  doc.text("SI", colDerXHeader + colTextoW + colSiW / 2, yPos + 3.5, { align: "center" });
  doc.text("NO", colDerXHeader + colTextoW + colSiW + colNoW / 2, yPos + 3.5, { align: "center" });
  
  yPos += filaAltura;

  // Preguntas - Columna izquierda
  const preguntasIzq = [
    { texto: "Consumo de Tabaco", chkSi: datos?.chk1Si, chkNo: datos?.chk1No },
    { texto: "Servicio Militar", chkSi: datos?.chk2Si, chkNo: datos?.chk2No },
    { texto: "Hobbies con exposición a ruido", chkSi: datos?.chk3Si, chkNo: datos?.chk3No },
    { texto: "Exposición laboral a químicos", chkSi: datos?.chk4Si, chkNo: datos?.chk4No },
    { texto: "Infección al Oído", chkSi: datos?.chk5Si, chkNo: datos?.chk5No },
    { texto: "Uso de Ototoxicos", chkSi: datos?.chk6Si, chkNo: datos?.chk6No }
  ];

  // Preguntas - Columna derecha
  const preguntasDer = [
    { texto: "Disminución de la audición", chkSi: datos?.chk7Si, chkNo: datos?.chk7No },
    { texto: "Dolor de oídos", chkSi: datos?.chk8Si, chkNo: datos?.chk8No },
    { texto: "Zumbido", chkSi: datos?.chk9Si, chkNo: datos?.chk9No },
    { texto: "Mareos", chkSi: datos?.chk10Si, chkNo: datos?.chk10No },
    { texto: "Infección al oído", chkSi: datos?.chk11Si, chkNo: datos?.chk11No },
    { texto: "Otros", chkSi: datos?.chk12Si, chkNo: datos?.chk12No, otros: datos?.otros }
  ];

  const numFilas = Math.max(preguntasIzq.length, preguntasDer.length);
  const alturaTotal = numFilas * filaAltura;

  // Dibujar bordes exteriores
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaTotal);

  // Línea vertical divisoria entre columnas
  doc.line(tablaInicioX + colPreguntaW, yPos, tablaInicioX + colPreguntaW, yPos + alturaTotal);

  // Dibujar preguntas de la columna izquierda
  for (let i = 0; i < preguntasIzq.length; i++) {
    const filaY = yPos + i * filaAltura;
    const pregunta = preguntasIzq[i];

    // Líneas horizontales
    if (i > 0) {
      doc.line(tablaInicioX, filaY, tablaInicioX + colPreguntaW, filaY);
    }

    // Líneas verticales
    doc.line(tablaInicioX + colTextoW, filaY, tablaInicioX + colTextoW, filaY + filaAltura);
    doc.line(tablaInicioX + colTextoW + colSiW, filaY, tablaInicioX + colTextoW + colSiW, filaY + filaAltura);

    // Texto de la pregunta
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(pregunta.texto, tablaInicioX + 2, filaY + 3.5);

    // Celda SI (solo X si está marcado)
    doc.rect(tablaInicioX + colTextoW, filaY, colSiW, filaAltura);
    if (pregunta.chkSi) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text("X", tablaInicioX + colTextoW + colSiW / 2, filaY + 3.5, { align: "center" });
    }

    // Celda NO (solo X si está marcado)
    doc.rect(tablaInicioX + colTextoW + colSiW, filaY, colNoW, filaAltura);
    if (pregunta.chkNo) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text("X", tablaInicioX + colTextoW + colSiW + colNoW / 2, filaY + 3.5, { align: "center" });
    }
  }

  // Dibujar preguntas de la columna derecha
  const colDerX = tablaInicioX + colPreguntaW;
  for (let i = 0; i < preguntasDer.length; i++) {
    const filaY = yPos + i * filaAltura;
    const pregunta = preguntasDer[i];

    // Líneas horizontales
    if (i > 0) {
      doc.line(colDerX, filaY, tablaInicioX + tablaAncho, filaY);
    }

    // Líneas verticales
    doc.line(colDerX + colTextoW, filaY, colDerX + colTextoW, filaY + filaAltura);
    doc.line(colDerX + colTextoW + colSiW, filaY, colDerX + colTextoW + colSiW, filaY + filaAltura);

    // Texto de la pregunta
    doc.setFont("helvetica", "normal").setFontSize(8);
    let textoPregunta = pregunta.texto;
    if (pregunta.otros && pregunta.chkSi) {
      textoPregunta += ` ${pregunta.otros}`;
    }
    doc.text(textoPregunta, colDerX + 2, filaY + 3.5);

    // Celda SI (solo X si está marcado)
    doc.rect(colDerX + colTextoW, filaY, colSiW, filaAltura);
    if (pregunta.chkSi) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text("X", colDerX + colTextoW + colSiW / 2, filaY + 3.5, { align: "center" });
    }

    // Celda NO (solo X si está marcado)
    doc.rect(colDerX + colTextoW + colSiW, filaY, colNoW, filaAltura);
    if (pregunta.chkNo) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text("X", colDerX + colTextoW + colSiW + colNoW / 2, filaY + 3.5, { align: "center" });
    }
  }

  yPos += alturaTotal;
  return yPos;
};

// Función para dibujar la sección de Otoscopia
const drawOtoscopia = (doc, datos = {}, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2;
  const filaAltura = 5;
  let yPos = yPosInicial;

  // Fila con el texto de otoscopia (sin header gris)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OTOSCOPIA:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const otoscopiaTexto = String(datos?.txtOtoscopia ?? '');
  doc.text(otoscopiaTexto, tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

// Sección: Gráfico (izquierda) + tablas (derecha)
const drawGraficoYTablas = (doc, datos = {}, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2;

  const colGap = 8;
  const colH = 75;
  const dbLabelW = 12;

  // Si no entra en la página, saltar de página
  if (yPosInicial + colH + 20 > pageH) {
    doc.addPage();
    yPosInicial = 35;
  }

  const graphW = (tablaAncho - dbLabelW - colGap) / 2;
  const graphH = colH;
  const graphX = tablaInicioX + dbLabelW;
  const graphY = yPosInicial + 8;

  const tableX = graphX + graphW + colGap;
  const tableWRight = tablaAncho - dbLabelW - graphW - colGap;

  const toNumberOrNull = (valor) => {
    if (valor === undefined || valor === null) return null;
    const v = String(valor).trim();
    if (!v || v === "-" || v.toUpperCase() === "N/A") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // =======================
  // GRÁFICO (izquierda)
  // =======================
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);

  // Fondo azul de 20 a 40 dB
  doc.setFillColor(180, 235, 255);
  const y20 = graphY + ((20 + 10) / 130) * graphH;
  const y40 = graphY + ((40 + 10) / 130) * graphH;
  doc.rect(graphX, y20, graphW, y40 - y20, "F");

  // Líneas horizontales (cada 10 dB, de -10 a 120)
  for (let i = 0; i <= 13; i++) {
    const yLine = graphY + i * (graphH / 13);
    doc.line(graphX, yLine, graphX + graphW, yLine);
  }
  // Líneas verticales (frecuencias)
  for (let i = 0; i < 9; i++) {
    const xLine = graphX + i * (graphW / 8);
    doc.line(xLine, graphY, xLine, graphY + graphH);
  }

  // Etiquetas de frecuencia (Hz)
  const freqs = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
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

  // Puntos (aérea): OD círculo rojo, OI X azul
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

  // Vía ósea (corchetes) — mapeo correcto con guión bajo
  const puntosOseos = [
    // OD: [
    { freq: 500, db: toNumberOrNull(datos.od1_500), color: "red", tipo: "bracketLeft" },
    { freq: 1000, db: toNumberOrNull(datos.od1_1000), color: "red", tipo: "bracketLeft" },
    { freq: 2000, db: toNumberOrNull(datos.od1_2000), color: "red", tipo: "bracketLeft" },
    { freq: 3000, db: toNumberOrNull(datos.od1_3000), color: "red", tipo: "bracketLeft" },
    { freq: 4000, db: toNumberOrNull(datos.od1_4000), color: "red", tipo: "bracketLeft" },
    { freq: 6000, db: toNumberOrNull(datos.od1_6000), color: "red", tipo: "bracketLeft" },
    { freq: 8000, db: toNumberOrNull(datos.od1_8000), color: "red", tipo: "bracketLeft" },

    // OI: ]
    { freq: 500, db: toNumberOrNull(datos.oi1_500), color: "blue", tipo: "bracketRight" },
    { freq: 1000, db: toNumberOrNull(datos.oi1_1000), color: "blue", tipo: "bracketRight" },
    { freq: 2000, db: toNumberOrNull(datos.oi1_2000), color: "blue", tipo: "bracketRight" },
    { freq: 3000, db: toNumberOrNull(datos.oi1_3000), color: "blue", tipo: "bracketRight" },
    { freq: 4000, db: toNumberOrNull(datos.oi1_4000), color: "blue", tipo: "bracketRight" },
    { freq: 6000, db: toNumberOrNull(datos.oi1_6000), color: "blue", tipo: "bracketRight" },
    { freq: 8000, db: toNumberOrNull(datos.oi1_8000), color: "blue", tipo: "bracketRight" },
  ].filter((p) => p.db !== null);

  puntos.push(...puntosOseos);

  // Conectar puntos por tipo/color
  const drawSeries = (tipo, rgb) => {
    const pts = puntos
      .filter((p) => p.tipo === tipo && p.db !== null)
      .sort((a, b) => a.freq - b.freq);
    if (pts.length < 2) return;
    doc.setDrawColor(...rgb);
    doc.setLineWidth(tipo === "circle" ? 0.95 : 0.4);
    let prev = null;
    pts.forEach((p) => {
      const freqIdx = freqs.indexOf(p.freq);
      if (freqIdx === -1) return;
      const x = graphX + freqIdx * (graphW / 8);
      const y = graphY + ((p.db + 10) / 130) * graphH;
      if (prev) doc.line(prev.x, prev.y, x, y);
      prev = { x, y };
    });
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
  };
  
  // Dibujar líneas de conexión solo para círculos y X (NO para corchetes)
  drawSeries("circle", [255, 0, 0]);
  drawSeries("x", [0, 0, 255]);

  // Dibujar símbolos
  puntos.forEach((p) => {
    if (p.db === null) return;
    const freqIdx = freqs.indexOf(p.freq);
    if (freqIdx === -1) return;
    const x = graphX + freqIdx * (graphW / 8);
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
    doc.setDrawColor(0, 0, 0);
  });
  doc.setLineWidth(0.2);

  // =======================
  // TABLAS (derecha)
  // =======================
  let tY = graphY;

  // --- DIAPASONES ---
  const tH = 28;
  const tRows = 5;
  const tCols = 3;
  const tRowH = tH / tRows;
  const tColW = tableWRight / tCols;

  doc.rect(tableX, tY, tableWRight, tH);
  for (let i = 1; i < tRows; i++) {
    doc.line(tableX, tY + i * tRowH, tableX + tableWRight, tY + i * tRowH);
  }
  // Columnas desde la 2da fila
  for (let i = 1; i < tCols; i++) {
    doc.line(tableX + i * tColW, tY + tRowH, tableX + i * tColW, tY + tH);
  }

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DIAPASONES", tableX + tableWRight / 2, tY + tRowH / 2 + 1, { align: "center" });

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("OD", tableX + tColW / 2, tY + tRowH + tRowH / 2, { align: "center", baseline: "middle" });
  doc.text("RINNE Y WEBER", tableX + tColW + tColW / 2, tY + tRowH + tRowH / 2, { align: "center", baseline: "middle" });
  doc.text("OI", tableX + 2 * tColW + tColW / 2, tY + tRowH + tRowH / 2, { align: "center", baseline: "middle" });

  doc.setFont("helvetica", "normal").setFontSize(7);
  const diapasonRows = ["250 Hz.", "500 Hz.", "1000 Hz."];
  const datosDiapasones = [
    { od: datos.txtDod250, oi: datos.txtDoi250 },
    { od: datos.txtDod500, oi: datos.txtDoi500 },
    { od: datos.txtDod1000, oi: datos.txtDoi1000 },
  ];
  for (let i = 0; i < diapasonRows.length; i++) {
    doc.text(diapasonRows[i], tableX + tColW + tColW / 2, tY + (i + 2) * tRowH + tRowH / 2, {
      align: "center",
      baseline: "middle",
    });
    doc.text(String(datosDiapasones[i].od ?? ""), tableX + tColW / 2, tY + (i + 2) * tRowH + tRowH / 2, {
      align: "center",
      baseline: "middle",
    });
    doc.text(String(datosDiapasones[i].oi ?? ""), tableX + 2 * tColW + tColW / 2, tY + (i + 2) * tRowH + tRowH / 2, {
      align: "center",
      baseline: "middle",
    });
  }

  // --- LOGOAUDIOMETRIA ---
  tY += tH + 2;
  const t2Rows = 5;
  const t2RowH = 9;
  const t2ColWArr = [tableWRight * 0.5, tableWRight * 0.25, tableWRight * 0.25];
  const t2H = t2Rows * t2RowH;

  doc.rect(tableX, tY, tableWRight, t2H);
  for (let i = 1; i < t2Rows; i++) {
    doc.line(tableX, tY + i * t2RowH, tableX + tableWRight, tY + i * t2RowH);
  }
  let t2X = tableX;
  for (let i = 1; i < 3; i++) {
    t2X += t2ColWArr[i - 1];
    doc.line(t2X, tY, t2X, tY + t2H);
  }

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("LOGOAUDIOMETRIA", tableX + t2ColWArr[0] / 2, tY + t2RowH / 2, { align: "center", baseline: "middle" });
  doc.text("DERECHA", tableX + t2ColWArr[0] + t2ColWArr[1] / 2, tY + t2RowH / 2, { align: "center", baseline: "middle" });
  doc.text("IZQUIERDA", tableX + t2ColWArr[0] + t2ColWArr[1] + t2ColWArr[2] / 2, tY + t2RowH / 2, { align: "center", baseline: "middle" });

  doc.setFont("helvetica", "normal").setFontSize(7);
  const logoRows = [
    "Umbral de discriminación",
    "% de discriminación",
    "Umbral de Confort MCL",
    "Umbral de disconfort UCL",
  ];
  const datosLogo = [
    { der: datos.txtLDUmbralDiscriminacion, izq: datos.txtLIUmbralDiscriminacion },
    { der: datos.txtLDPorcentajeDiscriminacion, izq: datos.txtLIPorcentajeDiscriminacion },
    { der: datos.txtLDConfort, izq: datos.txtLIConfort },
    { der: datos.txtLDDisconfort, izq: datos.txtLIDisconfort },
  ];
  for (let i = 0; i < logoRows.length; i++) {
    const yRow = tY + (i + 1) * t2RowH + t2RowH / 2;
    doc.text(logoRows[i], tableX + t2ColWArr[0] / 2, yRow, { align: "center", baseline: "middle" });
    doc.text(String(datosLogo[i].der ?? ""), tableX + t2ColWArr[0] + t2ColWArr[1] / 2, yRow, { align: "center", baseline: "middle" });
    doc.text(
      String(datosLogo[i].izq ?? ""),
      tableX + t2ColWArr[0] + t2ColWArr[1] + t2ColWArr[2] / 2,
      yRow,
      { align: "center", baseline: "middle" }
    );
  }

  const bottom = Math.max(graphY + graphH, tY + t2H);
  return bottom + 2;
};

// Sección: CONCLUSIONES + firmas
const drawConclusiones = (doc, datos = {}, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2;
  const lineH = 4;
  let yPos = yPosInicial;

  const conclusiones = String(datos?.diagnostico ?? "");
  const profesional = String(datos?.txtResponsable ?? "");
  const medico = String(datos?.txtMedico ?? "");

  // Header gris: CONCLUSIONES
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, 5, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("3. CONCLUSIONES", tablaInicioX + 2, yPos + 3.5);
  yPos += 5;

  // Fila: {data} (crece según contenido)
  doc.setFont("helvetica", "normal").setFontSize(8);
  const conclLines = doc.splitTextToSize(conclusiones || "-", tablaAncho - 4);
  const conclH = Math.max(8, conclLines.length * lineH + 2);
  doc.rect(tablaInicioX, yPos, tablaAncho, conclH);
  doc.text(conclLines, tablaInicioX + 2, yPos + 4);
  yPos += conclH;

  // Helpers para filas label/valor
  const drawRowLabelValue = (label, value) => {
    const labelW = 85;
    const valueW = tablaAncho - labelW;
    doc.setFont("helvetica", "bold").setFontSize(8);
    const labelLines = doc.splitTextToSize(label, labelW - 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    const valueLines = doc.splitTextToSize(value || "-", valueW - 4);
    const rowH = Math.max(6, Math.max(labelLines.length, valueLines.length) * lineH + 2);

    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.line(tablaInicioX + labelW, yPos, tablaInicioX + labelW, yPos + rowH);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(labelLines, tablaInicioX + 2, yPos + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(valueLines, tablaInicioX + labelW + 2, yPos + 4);

    yPos += rowH;
  };

  // Fila: profesional
  drawRowLabelValue("Nombre del profesional que realiza la audiometría:", profesional);
  // Fila: médico responsable
  drawRowLabelValue("Nombre del médico responsable:", medico);

  return yPos;
};

// eslint-disable-next-line no-unused-vars
export default async function FichaAudiologica_Digitalizado(datos = {}, docExistente = null, mostrarGrafico = null, firmaExtra = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // 1) Header con logo, datos y drawer colorbox
  await drawHeader(doc, datos);

  // 2) Título FICHA AUDIOLÓGICA
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("FICHA AUDIOLÓGICA", pageW / 2, 32, { align: "center" });

  // 3) Tabla de datos del paciente
  let yPosFinal = drawPatientData(doc, datos);

  // 4) Sección de Antecedentes Relacionados
  yPosFinal = drawAntecedentesRelacionados(doc, datos, yPosFinal);

  // 5) Sección de Otoscopia
  yPosFinal = drawOtoscopia(doc, datos, yPosFinal);

  // 6) Gráfico (izquierda) + tablas (derecha)
  yPosFinal = drawGraficoYTablas(doc, datos, yPosFinal);

  // 7) Conclusiones (tabla) + Firmas
  const pageH = doc.internal.pageSize.getHeight();
  const espacioMinimo = 55; // conclusiones + firmas aprox
  if (yPosFinal + espacioMinimo > pageH - 20) {
    doc.addPage();
    await drawHeader(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("FICHA AUDIOLÓGICA", pageW / 2, 32, { align: "center" });
    yPosFinal = 50;
  }

  yPosFinal = drawConclusiones(doc, datos, yPosFinal);

  // Firmas (sin DNI abajo)
  await dibujarFirmas({ doc, datos, y: yPosFinal + 2, pageW });

  // 8) Footer
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

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
