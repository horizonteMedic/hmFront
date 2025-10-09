import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { normalizeList } from "../../../utils/listUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';

export default function FichaPsicologicaOcupacional_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const resultadoTexto = String(
      raw?.resultado ?? raw?.resultadoPsicologico ?? raw?.aptoTexto ?? raw?.apto_resultado ?? ''
    ).toUpperCase();

    const datosReales = {
      apellidosNombres: String((((raw?.apellidos_apellidos_pa ?? '') + ' ' + (raw?.nombres_nombres_pa ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaInformePsicologico ?? raw?.fecha_examen ?? ''),
      sexo: convertirGenero(raw?.sexo_sexo_pa ?? raw?.sexo ?? ''),
      documentoIdentidad: String(raw?.dni_cod_pa ?? raw?.documento ?? ''),
      edad: String(raw?.edad_edad ?? raw?.edad ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechanacimientopaciente_fecha_nacimiento_pa ?? raw?.fecha_nacimiento ?? ''),
      domicilio: String(raw?.direccionpaciente_direccion_pa ?? raw?.domicilio ?? ''),
      areaTrabajo: String(raw?.area_area_o ?? raw?.area_trabajo ?? ''),
      puestoTrabajo: String(raw?.cargo_cargo_de ?? raw?.puesto_trabajo ?? ''),
      empresa: String(raw?.empresa_razon_empresa ?? raw?.empresa ?? ''),
      contrata: String(
        raw?.contrata_razon_contrata ?? raw?.contrata ?? raw?.contratista_razon_contratista ?? raw?.contratista ?? ''
      ),
      sede: String(raw?.sede ?? ''),
      numeroFicha: String(raw?.n_orden ?? raw?.numero_ficha ?? ''),
      codigoEntrevista: String(
        raw?.codEntrevista ?? raw?.cod_entrevista ?? raw?.codigoEntrevista ?? raw?.codigo_entrevista ?? ''
      ),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      cuerpo: {
        areaIntelectual: raw?.cuerpo?.areaIntelectual,
        areaPersonalidad: raw?.cuerpo?.areaPersonalidad,
        areaOrganicidad: raw?.cuerpo?.areaOrganicidad,
        areaPsicomotricidad: raw?.cuerpo?.areaPsicomotricidad,
        recomendaciones: raw?.cuerpo?.recomendaciones
      },
      apto: (typeof raw?.apto === 'boolean') ? raw.apto
        : (typeof raw?.aptoPsicologico === 'boolean') ? raw.aptoPsicologico
        : (typeof raw?.aptoInforme === 'boolean') ? raw.aptoInforme
        : resultadoTexto.includes('NO APTO') ? false
        : resultadoTexto.includes('APTO') ? true
        : false
    };

    const datosPrueba = {
      apellidosNombres: 'PÉREZ QUISPE, JUAN CARLOS',
      fechaExamen: '30/09/2025',
      sexo: 'Masculino',
      documentoIdentidad: '12345678',
      edad: '32',
      fechaNacimiento: '15/04/1993',
      domicilio: 'Av. Los Olivos 123 - Lima',
      areaTrabajo: 'Planta Concentradora',
      puestoTrabajo: 'Operador de Volquete',
      empresa: 'MINERA ANDINA S.A.C.',
      contrata: 'SERVICIOS INTEGRALES S.R.L.',
      sede: 'Trujillo Nicolas de Pierola',
      numeroFicha: '000123',
      codigoEntrevista: '63183',
      color: 2,
      codigoColor: '#2E7D32',
      textoColor: 'L',
      cuerpo: {
        areaIntelectual: raw?.cuerpo?.areaIntelectual,
        areaPersonalidad: raw?.cuerpo?.areaPersonalidad,
        areaOrganicidad: raw?.cuerpo?.areaOrganicidad,
        areaPsicomotricidad: raw?.cuerpo?.areaPsicomotricidad,
        recomendaciones: raw?.cuerpo?.recomendaciones
      },
      apto: true
    };

    const selected = (raw && (raw.n_orden || raw.numero_ficha)) ? datosReales : datosPrueba;
    // Asegurar que las secciones de cuerpo sean arrays listables
    selected.cuerpo = {
      areaIntelectual: normalizeList(selected.cuerpo.areaIntelectual),
      areaPersonalidad: normalizeList(selected.cuerpo.areaPersonalidad),
      areaOrganicidad: normalizeList(selected.cuerpo.areaOrganicidad),
      areaPsicomotricidad: normalizeList(selected.cuerpo.areaPsicomotricidad),
      recomendaciones: normalizeList(selected.cuerpo.recomendaciones)
    };
    return selected;
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("ANEXO N° 03", pageW / 2, 25, { align: "center" });
    doc.text("FICHA PSICOLOGICA OCUPACIONAL", pageW / 2, 32, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Cod. Entrevista: " + (datosFinales.codigoEntrevista || ""), pageW - 70, 20);
    doc.text("Sede: " + datosFinales.sede, pageW - 70, 25);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, 30);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 25, 8);

    // Bloque de color
    drawColorBox(doc, {
      color: datosFinales.codigoColor,
      text: datosFinales.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    const fontSize = doc.internal.getFontSize();
    const palabras = texto.split(' ');
    let lineaActual = '';
    let yPos = y;
    
    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);
      
      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          doc.text(lineaActual, x, yPos);
          yPos += fontSize * 0.35;
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yPos);
          yPos += fontSize * 0.35;
        }
      }
    });
    
    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
    }
    
    return yPos;
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 10;
    const tablaAncho = 190;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(160, 160, 160);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3);
    
    return yPos + alturaHeader;
  };

  // === PÁGINA 1 ===
  drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 40;
  const filaAltura = 5;

  // Header de datos de filiación
  yPos = dibujarHeaderSeccion("I. DATOS DE FILIACIÓN", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Fecha Nacimiento, Domicilio (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Contratista (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Edad:", tablaInicioX + 62, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 75, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sexo:", tablaInicioX + 122, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.sexo, tablaInicioX + 135, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Fecha Nacimiento, Domicilio
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Nac.:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 20, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Domicilio:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 122, yTexto + 1.5, 65);
  yTexto += filaAltura;

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, 50);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 1.5, 65);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 5 });

  // Imprimir
  imprimir(doc);
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
