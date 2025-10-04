import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSign } from '../../utils/helpers';

export default function UsoRespiradores({ data = {} }) {
  useEffect(() => {
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();
    
    // Contador de páginas dinámico
    let numeroPagina = 1;

    // Datos de prueba por defecto
    const datosPrueba = {
      numeroHistoria: "96639",
      tipoExamen: "PRE-OCUPACIONAL",
      apellidosNombres: "TASILLA RAMIREZ RAFAEL",
      documentoIdentidad: "48512123",
      
      genero: "MASCULINO",
      edad: "36",
      fechaNacimiento: "07/10/1988",
      domicilio: "ARICA 172",
      puestoTrabajo: "AYUDANTE",
      areaTrabajo: "PRODUCCION",
      empresa: "INGENIERIA Y SERVICIOS E.I.R.L",
      contratista: "N/A",
      anosExperiencia: "5",
      primeraAptitud: true,
      revalidacion: false,
      fechaExamen: "08/04/2025",
      // Datos de color
      color: 1,
      codigoColor: "#008f39",
      textoColor: "F",
      // Datos adicionales para header
      numeroFicha: "99164",
      sede: "Trujillo-Pierola",
    };

    // Datos reales mapeados desde la estructura de datos
    const datosReales = {
      numeroHistoria: String(data.n_orden ?? ""),
      tipoExamen: String(data.nombreExamen ?? ""),
      apellidosNombres: String((data.apellidosPaciente ?? "") + " " + (data.nombresPaciente ?? "")).trim(),
      documentoIdentidad: String(data.dniPaciente ?? ""),
      genero: data.sexoPaciente === "M" ? "MASCULINO" : data.sexoPaciente === "F" ? "FEMENINO" : String(data.sexoPaciente ?? ""),
      edad: String(data.edadPaciente ?? ""),
      fechaNacimiento: formatearFechaCorta(data.fechaNacimiento ?? ""),
      domicilio: String(data.domicilio ?? ""),
      puestoTrabajo: String(data.puestoTrabajo ?? ""),
      areaTrabajo: String(data.areaTrabajo ?? ""),
      empresa: String(data.empresa ?? ""),
      contratista: String(data.contrata ?? ""),
      anosExperiencia: String(data.anosExperiencia ?? ""),
      primeraAptitud: Boolean(data.primeraAptitud ?? false),
      revalidacion: Boolean(data.revalidacion ?? false),
      fechaExamen: formatearFechaCorta(data.fechaDesde ?? ""),
      // Datos de color
      color: data.color || 1,
      codigoColor: data.codigoColor || "#008f39",
      textoColor: data.textoColor || "F",
      // Datos adicionales para header
      numeroFicha: String(data.n_orden ?? ""),
      sede: data.sede || data.nombreSede || "",
    };

    // Usar datos reales si existen, sino usar datos de prueba
    const datosFinales = data && data.n_orden ? datosReales : datosPrueba;

    // Header reutilizable
    const drawHeader = (pageNumber) => {
      // Logo y membrete - Subido 3.5 puntos
      CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 6.5 }); // 10 - 3.5 = 6.5

      // Título principal (solo en página 1)
      if (pageNumber === 1) {
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("CERTIFICACION DE SUFICIENCIA MEDICA PARA USO DE RESPIRADORES", pageW / 2, 28, { align: "center" });
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("(Protección Respiratoria)", pageW / 2, 32, { align: "center" });
      }

      // Número de Ficha y Página (alineación automática mejorada) - Subidos 3.5 puntos
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Nro de ficha: ", pageW - 80, 12); // 15 - 3.5 = 11.5

      doc.setFont("helvetica", "bold").setFontSize(18);
      doc.text(datosFinales.numeroFicha, pageW - 50, 13); // 16 - 3.5 = 12.5
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Sede: " + datosFinales.sede, pageW - 80, 17); // 20 - 3.5 = 16.5
      
      doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 7); // 10 - 3.5 = 6.5

      // Bloque de color (posición mejorada) - Subido 3.5 puntos
      drawColorBox(doc, {
        color: datosFinales.codigoColor,
        text: datosFinales.textoColor,
        x: pageW - 30,
        y: 7, // 10 - 3.5 = 6.5
        size: 22,
        showLine: true,
        fontSize: 30,
        textPosition: 0.9
      });
    };

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

    // === DIBUJAR HEADER ===
    drawHeader(numeroPagina);

    // === TABLA DE DATOS PERSONALES ===
    const tablaInicioX = 10;
    const tablaInicioY = 33.5; // Ajustado para dar espacio al subtítulo
    const tablaAncho = 190;
    let yPos = tablaInicioY;

    // Altura general para todas las filas
    const filaAltura = 5;

    // Función general para dibujar header de sección con fondo gris
    const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
      // Dibujar fondo gris más oscuro
      doc.setFillColor(160, 160, 160); // Gris más oscuro
      doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
      
      // Dibujar líneas del header
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
      
      // Dibujar texto del título
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(titulo, tablaInicioX + 2, yPos + 3);
      
      return yPos + alturaHeader; // Retorna la nueva posición Y
    };

    // Función para dibujar fila con división central
    const dibujarFilaConDivisionCentral = (yPos, alturaFila = filaAltura) => {
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila); // Línea izquierda
      doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + alturaFila); // Línea divisoria central
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila); // Línea derecha
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
      doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + alturaFila); // Línea inferior
      return yPos + alturaFila;
    };

    // Función para dibujar fila con división central y casillero
    const dibujarFilaConDivisionCentralYCasillero = (yPos, alturaFila = filaAltura) => {
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila); // Línea izquierda
      doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + alturaFila); // División para casillero
      doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + alturaFila); // Línea divisoria central
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila); // Línea derecha
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
      doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + alturaFila); // Línea inferior
      return yPos + alturaFila;
    };

    // Primera fila: AFILIACION usando función general
    yPos = dibujarHeaderSeccion("1. AFILIACION (a partir del registro médico)", yPos, filaAltura);

    // Segunda fila: Apellidos y Nombres (fila completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // Tercera división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Cuarta fila: Domicilio (fila completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // División central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Sexta fila: Empresa (fila completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Séptima fila: Contrata (fila completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;


    // === CONTENIDO DE LA TABLA ===
    let yTexto = tablaInicioY + 2.5;

    // Primera fila: AFILIACION (ya dibujada por dibujarHeaderSeccion)
    yTexto += filaAltura;

    // Segunda fila: Apellidos y Nombres
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 55, yTexto + 1, 130);
    yTexto += filaAltura;

    // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.edad, tablaInicioX + 58, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.genero, tablaInicioX + 105, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1);
    yTexto += filaAltura;

    // Cuarta fila: Domicilio
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1, 150);
    yTexto += filaAltura;

    // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.puestoTrabajo, tablaInicioX + 40, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.areaTrabajo, tablaInicioX + 125, yTexto + 1);
    yTexto += filaAltura;

    // Sexta fila: Empresa
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 20, yTexto + 1, 160);
    yTexto += filaAltura;

    // Séptima fila: Contrata
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Contrata:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.contratista, tablaInicioX + 25, yTexto + 1);
    yTexto += filaAltura;

    // === SECCIÓN 7.1: EVALUACIÓN DEL LUGAR DE TRABAJO ===
    yPos = dibujarHeaderSeccion("7.1 Ficha: Evaluación del Lugar de Trabajo (llenado por el personal de salud)", yPos, filaAltura);

    // Fila con división central y dos textos con fondos de colores
    // Primero dibujar el fondo verde para la primera mitad
    doc.setFillColor(173, 216, 230); // Verde claro
    doc.rect(tablaInicioX, yPos, tablaAncho/2, filaAltura, 'F');
    
    // Luego dibujar el fondo azul claro para la segunda mitad
    doc.setFillColor(173, 216, 230); // Azul claro (light blue)
    doc.rect(tablaInicioX + tablaAncho/2, yPos, tablaAncho/2, filaAltura, 'F');
    
    // Luego dibujar las líneas
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la fila con división central
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Marcar el tipo de respirador(es) a utilizar :", tablaInicioX + 2, yPos - 1.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Frecuencia de uso :", tablaInicioX + tablaAncho/2 + 2, yPos - 1.5);

    // Fila con 4 divisiones usando medidas fijas
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 35, yPos, tablaInicioX + 35, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Tercera división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

  
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    // Primer elemento - Máscara de polvo
    const x1 = 15; // Posición X independiente
    const y1 = yPos - 1.5; // Posición Y independiente
    doc.text("Máscara de polvo", x1, y1);
    
    // Segundo elemento - ½ cara
    const x2 = 50; // Posición X independiente
    const y2 = yPos - 1.5; // Posición Y independiente
    doc.text("½ cara", x2, y2);
    
    // Tercer elemento - Cara completa
    const x3 = 75; // Posición X independiente
    const y3 = yPos - 1.5; // Posición Y independiente
    doc.text("Cara completa", x3, y3);
    
    // Cuarto elemento - De manera diaria
    const x4 = 110; // Posición X independiente
    const y4 = yPos - 1.5; // Posición Y independiente
    doc.text("De manera diaria", x4, y4);

    
    // Fila 4
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la nueva fila - dos textos con coordenadas independientes
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    // Primer texto de la nueva fila
    const x5 = 15; // Posición X independiente
    const y5 = yPos - 1.5; // Posición Y independiente
    doc.text("Purificador de aire (sin energía)", x5, y5);
    
    // Segundo texto de la nueva fila
    const x6 = 110; // Posición X independiente
    const y6 = yPos - 1.5; // Posición Y independiente
    doc.text("Ocasional – pero no más de dos veces por semana: hrs", x6, y6);

    // Fila 5
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la nueva fila - dos textos con coordenadas independientes
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Primer texto de la nueva fila
    const x7 = 15; // Posición X independiente
    const y7 = yPos - 1.5; // Posición Y independiente
    doc.text("Purificador de aire (con energía)", x7, y7);

    // Segundo texto de la nueva fila
    const x8 = 110; // Posición X independiente
    const y8 = yPos - 1.5; // Posición Y independiente
    doc.text("Rara vez – uso de emergencia solamente.", x8, y8);

    // Fila 6
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la nueva fila - dos textos con coordenadas independientes
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Primer texto de la nueva fila
    const x9 = 15; // Posición X independiente
    const y9 = yPos - 1.5; // Posición Y independiente
    doc.text("Respirador suministrador de atmosfera", x9, y9);

    // Segundo texto de la nueva fila
    const x10 = 110; // Posición X independiente
    const y10 = yPos - 1.5; // Posición Y independiente
    doc.text("Promedio de horas de uso por Día:", x10, y10); 

    // Fila 7 - Solo dos textos con fondo de color solo en la parte derecha
    // Primero dibujar el fondo azul claro solo para la parte derecha (después de la división central)
    doc.setFillColor(173, 216, 230); // Azul claro (light blue)
    doc.rect(tablaInicioX + tablaAncho/2, yPos, tablaAncho/2, filaAltura, 'F');
    
    // Luego dibujar las líneas
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la fila 7 - dos textos con coordenadas independientes
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Primer texto de la fila 7
    const x11 = 15; // Posición X independiente
    const y11 = yPos - 1.5; // Posición Y independiente
    doc.text("Combinación línea de aire SCBA", x11, y11);

    // Segundo texto de la fila 7
    const x12 = 107; // Posición X independiente
    const y12 = yPos - 1.5; // Posición Y independiente
    doc.text("Exposición de Materiales Peligros:", x12, y12);

    // Fila 8 - Respirador de Flujo Continuo | (div central) | Humo de Metal | Amoniaco
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la fila 8
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Texto izquierda - Respirador de Flujo Continuo
    const x13 = 15; // Posición X independiente
    const y13 = yPos - 1.5; // Posición Y independiente
    doc.text("Respirador de Flujo Continuo", x13, y13);

    // Texto derecha 1 - Humo de Metal
    const x14 = 110; // Posición X independiente
    const y14 = yPos - 1.5; // Posición Y independiente
    doc.text("Humo de Metal", x14, y14);

    // Texto derecha 2 - Amoniaco
    const x15 = 160; // Posición X independiente
    const y15 = yPos - 1.5; // Posición Y independiente
    doc.text("Amoniaco", x15, y15);

    // Fila 9 - Respirador de Flujo Continuo | (div central) | Humo de Metal | Amoniaco
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la fila 9
    doc.setFont("helvetica", "normal").setFontSize(8);

    const x16 = 15; 
    const y16 = yPos - 1.5; // Posición Y independiente
    doc.text("Respirador suministrador de aire", x16, y16);

    const x17 = 110; // Posición X independiente
    const y17 = yPos - 1.5; // Posición Y independiente
    doc.text("Arsénico", x17, y17);

    const x18 = 160; // Posición X independiente
    const y18 = yPos - 1.5; // Posición Y independiente
    doc.text("Polvo Respirable", x18, y18);


    // Fila 10 - Respirador de Flujo Continuo | (div central) | Humo de Metal | Amoniaco  
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la fila 10
    doc.setFont("helvetica", "normal").setFontSize(8);
    const x19 = 15; // Posición X independiente
    const y19 = yPos - 1.5; // Posición Y independiente
    doc.text("SCBA de circuito abierto", x19, y19);
    const x20 = 110; // Posición X independiente
    const y20 = yPos - 1.5; // Posición Y independiente
    doc.text("Plomo", x20, y20);

    const x21 = 160; // Posición X independiente
    const y21 = yPos - 1.5; // Posición Y independiente
    doc.text("Sílice", x21, y21);

    // Fila 11 - Respirador de Flujo Continuo | (div central) | Humo de Metal | Amoniaco  
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la fila 11
    doc.setFont("helvetica", "normal").setFontSize(8);
    const x22 = 15; // Posición X independiente
    const y22 = yPos - 1.5; // Posición Y independiente
    doc.text("SCBA de circuito cerrado", x22, y22);
    const x23 = 110; // Posición X independiente
    const y23 = yPos - 1.5; // Posición Y independiente
    doc.text("Asbesto", x23, y23);

    const x24 = 160; // Posición X independiente
    const y24 = yPos - 1.5; // Posición Y independiente
    doc.text("Mercurio", x24, y24);

    // Fila 12 - Tipo de Protección con fondo gris en la primera mitad
    // Primero dibujar el fondo gris solo para la primera mitad
    doc.setFillColor(173, 216, 230); // Gris más oscuro (igual que dibujarHeaderSeccion)
    doc.rect(tablaInicioX, yPos, tablaAncho/2, filaAltura, 'F');
    
    // Luego dibujar las líneas
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    
    yPos += filaAltura;

   

     // Contenido de la fila 11
     doc.setFont("helvetica", "normal").setFontSize(8);
     const x25 = 12; // Posición X independiente
     const y25 = yPos - 1.5; // Posición Y independiente
     doc.text("Tipo de Protección :", x25, y25);
     const x26 = 110; // Posición X independiente
     const y26 = yPos - 1.5; // Posición Y independiente
     doc.text("DPM", x26, y26);
     const x27 = 160; // Posición X independiente
     const y27 = yPos - 1.5; // Posición Y independiente
     doc.text("Otros", x27, y27);
 
    // Fila 13
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la nueva fila - dos textos con coordenadas independientes
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Primer texto de la nueva fila
    const x28 = 15; // Posición X independiente
    const y28 = yPos - 1.5; // Posición Y independiente
    doc.text("Filtro HEPA (partículas)", x28, y28);

    // Segundo texto de la nueva fila
    const x29 = 110; // Posición X independiente
    const y29 = yPos - 1.5; // Posición Y independiente
    doc.text("Monóxido de Carbono", x29, y29);

    // Fila 14
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la nueva fila - dos textos con coordenadas independientes
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Primer texto de la nueva fila
    const x30 = 15; // Posición X independiente
    const y30 = yPos - 1.5; // Posición Y independiente
    doc.text("Cartuchos (Gas acido)", x30, y30);

    // Segundo texto de la nueva fila
    const x31 = 110; // Posición X independiente
    const y31 = yPos - 1.5; // Posición Y independiente
    doc.text("Dióxido de Carbono", x31, y31);


    // Fila 15
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la nueva fila - dos textos con coordenadas independientes
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Primer texto de la nueva fila
    const x32 = 15; // Posición X independiente
    const y32 = yPos - 1.5; // Posición Y independiente
    doc.text("Cartuchos (Vapor Orgánico)", x32, y32);

    // Segundo texto de la nueva fila
    const x33 = 110; // Posición X independiente
    const y33 = yPos - 1.5; // Posición Y independiente
    doc.text("Vapor Orgánico", x33, y33);

     // Fila 16
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
     doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
     doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
     doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
     yPos += filaAltura;
 
     // Contenido de la nueva fila - dos textos con coordenadas independientes
     doc.setFont("helvetica", "normal").setFontSize(8);
 
     // Primer texto de la nueva fila
     const x34 = 15; // Posición X independiente
     const y34 = yPos - 1.5; // Posición Y independiente
     doc.text("Cartuchos (amoniaco)", x34, y34);
 
     // Segundo texto de la nueva fila
     const x35 = 107; // Posición X independiente
     const y35 = yPos - 1.5; // Posición Y independiente
     doc.text("Condiciones Especiales de Trabajo :", x35, y35);
     
     // Fila 17
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la nueva fila - dos textos con coordenadas independientes
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Primer texto de la nueva fila
    const x36 = 15; // Posición X independiente
    const y36 = yPos - 1.5; // Posición Y independiente
    doc.text("Cartuchos (Mercurio)", x36, y36);

    // Segundo texto de la nueva fila
    const x37 = 110; // Posición X independiente
    const y37 = yPos - 1.5; // Posición Y independiente
    doc.text("Elevaciones Altas (> 2500 msnm)", x37, y37);


     // Fila 18
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
     doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
     doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
     doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
     yPos += filaAltura;
 
     // Contenido de la nueva fila - dos textos con coordenadas independientes
     doc.setFont("helvetica", "normal").setFontSize(8);
 
     // Primer texto de la nueva fila
     const x38 = 12; // Posición X independiente
     const y38 = yPos - 1.5; // Posición Y independiente
     doc.text("Esfuerzo Físico Esperado Requerido :", x38, y38);
 
     // Segundo texto de la nueva fila
     const x39 = 110; // Posición X independiente
     const y39 = yPos - 1.5; // Posición Y independiente
     doc.text("Temperaturas Extremas", x39, y39);
 

     // Fila 19
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 30, yPos, tablaInicioX + 30, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Tercera división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

  
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    // Primer elemento - Máscara de polvo
    const x40 = 15; // Posición X independiente
    const y40 = yPos - 1.5; // Posición Y independiente
    doc.text("Ligero", x40, y40);
    
    // Segundo elemento - ½ cara
    const x41 = 45; // Posición X independiente
    const y41 = yPos - 1.5; // Posición Y independiente
    doc.text("Moderado", x41, y41);
    
    // Tercer elemento - Cara completa
    const x42 = 75; // Posición X independiente
    const y42 = yPos - 1.5; // Posición Y independiente
    doc.text("Pesado", x42, y42);
    
    // Cuarto elemento - De manera diaria
    const x43 = 110; // Posición X independiente
    const y43 = yPos - 1.5; // Posición Y independiente
    doc.text("Atmosferas Húmedas", x43, y43);

    // Fila 20
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
     doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
     doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
     doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
     yPos += filaAltura;
 
     // Contenido de la nueva fila - dos textos con coordenadas independientes
     doc.setFont("helvetica", "normal").setFontSize(8);
 
      // Primer texto de la nueva fila
      const x44 = 12; // Posición X independiente
      const y44 = yPos - 1.5; // Posición Y independiente
      doc.setFont("helvetica", "normal").setFontSize(6); // Font size 6 solo para este texto
      doc.text("Ligero: Sentado mientras escribe, tipea, manejo, manual de cargas ligero (<3 mets)", x44, y44);

     // Segundo texto de la nueva fila
     const x45 = 110; // Posición X independiente
     const y45 = yPos - 1.5; // Posición Y independiente
     doc.setFont("helvetica", "normal").setFontSize(8);
     doc.text("Espacios confirmados", x45, y45);

     // Fila 21 - Moderado
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
     doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
     doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
     yPos += filaAltura;

     // Contenido de la fila 21
     doc.setFont("helvetica", "normal").setFontSize(8);

     // Primer texto de la fila 21
     const x46 = 12; // Posición X independiente
     const y46 = yPos - 1.5; // Posición Y independiente
     doc.setFont("helvetica", "normal").setFontSize(6); // Font size 6 para texto largo
     doc.text("Moderado: Manejo manual de cargas menos de 15 Kg, operando equipos (<5 mets)", x46, y46);

     // Segundo texto de la fila 21
     const x47 = 110; // Posición X independiente
     const y47 = yPos - 1.5; // Posición Y independiente
     doc.setFont("helvetica", "normal").setFontSize(8); // Restablecer font size 8
     doc.text("Atmosferas IDLH", x47, y47);

     // Fila 22 - Pesado
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
     doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
     doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
     doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
     yPos += filaAltura;

     // Contenido de la fila 22
     doc.setFont("helvetica", "normal").setFontSize(8);

     // Primer texto de la fila 22
     const x48 = 12; // Posición X independiente
     const y48 = yPos - 1.5; // Posición Y independiente
     doc.setFont("helvetica", "normal").setFontSize(6); // Font size 6 para texto largo
     doc.text("Pesado: manejo de cargas encima de 25 Kg, subiendo escaleras con carga, palaneando (>5 mets)", x48, y48);

     // Segundo texto de la fila 22
     const x49 = 110; // Posición X independiente
     const y49 = yPos - 1.5; // Posición Y independiente
     doc.setFont("helvetica", "normal").setFontSize(8); // Restablecer font size 8
     doc.text("Hazmat / Fuego / Rescate Mina", x49, y49);

    // === FOOTER ===
    footerTR(doc, { footerOffsetY: 8});

    // === IMPRIMIR ===
    imprimir(doc);
  }, [data]);

  return null; // No renderiza nada en el DOM
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

UsoRespiradores.propTypes = {
  data: PropTypes.object
};
