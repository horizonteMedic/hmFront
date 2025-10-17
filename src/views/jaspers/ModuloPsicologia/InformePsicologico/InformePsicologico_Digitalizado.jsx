import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { normalizeList } from "../../../utils/listUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { getSign, convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';

export default function InformePsicologico_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const datosReales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaEntrevista ?? ''), 
      sexo: convertirGenero(raw?.sexoPaciente ?? ''),
      documentoIdentidad: String(raw?.dniPaciente ?? ''),
      edad: String(raw?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente ?? ''),
      domicilio: String(raw?.direccionPaciente ?? ''),
      areaTrabajo: String(raw?.areaPaciente ?? ''),
      puestoTrabajo: String(raw?.cargoPaciente ?? ''),
      empresa: String(raw?.empresa ?? ''),
      contrata: String(raw?.contrata ?? ''),
      sede: String(raw?.sede ?? ''),
      numeroFicha: String(raw?.norden ?? ""),
      codigoEntrevista: String(raw?.codigoInforme ?? ''), 
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      cuerpo: {
        areaIntelectual: raw?.areaIntelectual,
        areaPersonalidad: raw?.areaPersonalidad,
        areaOrganicidad: raw?.areaOrganicidad,
        areaPsicomotricidad: raw?.areaPsicomotricidad,
        recomendaciones: raw?.recomendaciones
      },
      apto: (typeof raw?.aprobo === 'boolean') ? raw.aprobo : false 
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
        // Datos de prueba como string con 7 ítems y separadores mixtos
        areaIntelectual: 'Razonamiento verbal\\nCálculo básico ',
        areaPersonalidad: 'Responsable \\n Colaborador /n Proactivo 7n Tolerante a la presión \\n Comunicación asertiva /n Trabajo en equipo 7n Adaptabilidad',
        areaOrganicidad: 'Orientado en tiempo \\n Orientado en espacio /n Orientado en persona 7n Juicio conservado \\n Memoria íntegra /n Conciencia clara 7n No hay signos neurológicos focales',
        areaPsicomotricidad: 'Coordinación fina adecuada \\n Coordinación gruesa adecuada /n Ritmo y secuencia 7n Trazos firmes ',
        recomendaciones: 'Pausas activas diarias \\n Higiene del sueño '
      },
      apto: true
    };

    const selected = (raw && (raw.norden)) ? datosReales : datosPrueba;
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

  // Header reutilizable (igual que otros formatos)
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("INFORME PSICOLÓGICO", pageW / 2, 30, { align: "center" });

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
  let yPos = 35;
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

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
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
  let yTexto = 35 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);    
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5 );
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.sexo, tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
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

  // === SECCIÓN 2: RESULTADOS ===
  // Header de resultados
  yPos = dibujarHeaderSeccion("II.- RESULTADOS", yPos, filaAltura);

  // Función para dibujar subheader con color celeste
  const dibujarSubHeaderCeleste = (titulo, yPos, alturaHeader = 5) => {
    const tablaInicioX = 10;
    const tablaAncho = 190;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo celeste
    doc.setFillColor(173, 216, 230); // Color celeste claro
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

    // Dibujar líneas del subheader
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

    // Dibujar texto del subtítulo
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // Subheader de área intelectual
  yPos = dibujarSubHeaderCeleste("a.- Área Intelectual (Test de Inteligencia de Barranquilla/test de Otis Intermedia)", yPos, filaAltura);

  // Calcular altura dinámica para la lista de datos
  const calcularAlturaLista = (items, anchoMaximo) => {
    if (!items || items.length === 0) return 30; // Altura fija mínima si no hay items

    let lineas = 0;
    items.forEach(item => {
      const palabras = item.split(' ');
      let lineaActual = '';

      palabras.forEach(palabra => {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);

        if (anchoTexto <= anchoMaximo) {
          lineaActual = textoPrueba;
        } else {
          if (lineaActual) {
            lineas++;
            lineaActual = palabra;
          } else {
            lineas++;
          }
        }
      });

      if (lineaActual) {
        lineas++;
      }
    });

    // Altura fija mínima de 40mm, altura por línea de 3mm
    const alturaCalculada = lineas * 3 + 2;
    return Math.max(alturaCalculada, 30); // Altura fija mínima de 40mm
  };

  // Obtener datos del área intelectual
  const areaIntelectual = datosFinales.cuerpo.areaIntelectual || [];
  const anchoMaximoLista = tablaAncho - 4;
  const alturaFilaLista = calcularAlturaLista(areaIntelectual, anchoMaximoLista);

  // Fila de datos con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLista); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLista); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaLista, tablaInicioX + tablaAncho, yPos + alturaFilaLista); // Línea inferior

  // Dibujar lista de datos
  doc.setFont("helvetica", "normal").setFontSize(8);
  let yLista = yPos + 3;
  areaIntelectual.forEach(item => {
    const lineas = doc.splitTextToSize(String(item), anchoMaximoLista - 4);
    lineas.forEach(linea => {
      doc.text(linea, tablaInicioX + 2, yLista);
      yLista += 3;
    });
  });

  yPos += alturaFilaLista;



  // Cuerpo proveniente del normalizador
  const cuerpo = datosFinales.cuerpo;

  // b. Personalidad
  yPos = dibujarSubHeaderCeleste("b.- Área de Personalidad(Test de la figura humana de machover / Inventario Multifásico de personalidad)", yPos, filaAltura);
  const areaPersonalidad = cuerpo.areaPersonalidad || [];
  const alturaFilaPersonalidad = calcularAlturaLista(areaPersonalidad, anchoMaximoLista);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaPersonalidad);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaPersonalidad);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaPersonalidad, tablaInicioX + tablaAncho, yPos + alturaFilaPersonalidad);

  doc.setFont("helvetica", "normal").setFontSize(8);
  let yListaPersonalidad = yPos + 3;
  areaPersonalidad.forEach(item => {
    const lineas = doc.splitTextToSize(String(item), anchoMaximoLista - 4);
    lineas.forEach(linea => {
      doc.text(linea, tablaInicioX + 2, yListaPersonalidad);
      yListaPersonalidad += 3;
    });
  });
  yPos += alturaFilaPersonalidad;

  // c. Organicidad
  yPos = dibujarSubHeaderCeleste("c.- Área de Organicidad(Test de Bender para adultos / test de Benton Forma C)", yPos, filaAltura);
  const areaOrganicidad = cuerpo.areaOrganicidad || [];
  const alturaFilaOrganicidad = calcularAlturaLista(areaOrganicidad, anchoMaximoLista);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaOrganicidad);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaOrganicidad);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaOrganicidad, tablaInicioX + tablaAncho, yPos + alturaFilaOrganicidad);

  doc.setFont("helvetica", "normal").setFontSize(8);
  let yListaOrganicidad = yPos + 3;
  areaOrganicidad.forEach(item => {
    const lineas = doc.splitTextToSize(String(item), anchoMaximoLista - 4);
    lineas.forEach(linea => {
      doc.text(linea, tablaInicioX + 2, yListaOrganicidad);
      yListaOrganicidad += 3;
    });
  });
  yPos += alturaFilaOrganicidad;

  // d. Psicomotricidad
  yPos = dibujarSubHeaderCeleste("d.- Área de Psicomotricidad (Prueba de Laberintos de Weschler)", yPos, filaAltura);
  const areaPsicomotricidad = cuerpo.areaPsicomotricidad || [];
  const alturaFilaPsicomotricidad = calcularAlturaLista(areaPsicomotricidad, anchoMaximoLista);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaPsicomotricidad);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaPsicomotricidad);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaPsicomotricidad, tablaInicioX + tablaAncho, yPos + alturaFilaPsicomotricidad);

  doc.setFont("helvetica", "normal").setFontSize(8);
  let yListaPsicomotricidad = yPos + 3;
  areaPsicomotricidad.forEach(item => {
    const lineas = doc.splitTextToSize(String(item), anchoMaximoLista - 4);
    lineas.forEach(linea => {
      doc.text(linea, tablaInicioX + 2, yListaPsicomotricidad);
      yListaPsicomotricidad += 3;
    });
  });
  yPos += alturaFilaPsicomotricidad;

  // e. Recomendaciones
  yPos = dibujarSubHeaderCeleste("e.- Recomendaciones", yPos, filaAltura);
  const recomendaciones = cuerpo.recomendaciones || [];
  const alturaFilaRecomendaciones = calcularAlturaLista(recomendaciones, anchoMaximoLista);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaRecomendaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaFilaRecomendaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  let yListaRecomendaciones = yPos + 3;
  recomendaciones.forEach(item => {
    const lineas = doc.splitTextToSize(String(item), anchoMaximoLista - 4);
    lineas.forEach(linea => {
      doc.text(linea, tablaInicioX + 2, yListaRecomendaciones);
      yListaRecomendaciones += 3;
    });
  });

  // Firma dentro de la fila de recomendaciones
  const placeSignaturesInRecomendaciones = () => {
    // Calcular posición dentro de la fila de recomendaciones
    const firmaX = tablaInicioX + tablaAncho - 50; // Posición a la derecha
    const firmaY = yPos + (alturaFilaRecomendaciones / 2) - 10; // Centrada verticalmente
    const firmaW = 40;
    const firmaH = 20;

    let imagenPintada = false;
    try {
      const firma = getSign(data, "SELLOFIRMA") || getSign(data, "FIRMAP");
      if (firma) {
        doc.addImage(firma, 'PNG', firmaX, firmaY, firmaW, firmaH);
        imagenPintada = true;
      }
    } catch (e) {
      // si no hay imagen, no se dibuja nada
    }
    if (!imagenPintada && (data.showFirmaPlaceholder ?? true)) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("[FIRMA]", firmaX + (firmaW / 2), firmaY + (firmaH / 2), { align: "center" });
    }
  };

  // Llamar a la función después de dibujar la fila de recomendaciones
  placeSignaturesInRecomendaciones();

  yPos += alturaFilaRecomendaciones;

  // === SECCIÓN 3: APTO PARA EL CARGO ===
  // Header de apto para el cargo
  yPos = dibujarHeaderSeccion("III.- APTO PARA EL CARGO", yPos, filaAltura);

  // Fila de opciones SI/NO
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de opciones SI/NO
  const isApto = Boolean(datosFinales.apto);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`SI ( ${isApto ? 'X' : ' '} )     NO ( ${!isApto ? 'X' : ' '} )`, tablaInicioX + 4, yPos + 3.5);
  yPos += filaAltura;


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


