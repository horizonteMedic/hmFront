import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSign } from '../../utils/helpers';

export default function CertificadoAltura_Digitalizado({ data = {} }) {
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
      // Detalle información
      detalleInformacion: "Información adicional del examen médico ocupacional para certificación de conducción de vehículos motorizados.  ocupacional para certificación de conducción de vehículos motorizados",
      // Observaciones
      observaciones: "El paciente presenta aptitud médica para conducción de vehículos según evaluación realizada.",
      // Observaciones y Recomendaciones
      observacionesRecomendaciones: "El paciente cumple con todos los requisitos médicos para la conducción de vehículos motorizados. Se recomienda seguimiento médico anual y evaluación de la presión arterial cada 6 meses.",
      // Detalle pruebas complementarias
      detallePruebasComplementarias: "Resultados de laboratorio dentro de parámetros normales según valores de referencia establecidos.",
      // Datos del examen físico
      fc: "60",
      fr: "60", 
      pa: "50/60",
      talla: "170",
      peso: "65",
      imc: "0.00",
      perimetroCuello: "44",
      perimetroCintura: "75",
      perimetroCadera: "80",
      // Conclusión de la evaluación (demo)
      conclusionDesde: "04/11/2000",
      conclusionHasta: "04/11/2025",
      conclusionApto: true,
      conclusionNoApto: false,
      conclusionObservado: false,
      // Detalle nueva sección
      detalleNuevaSeccion: "Información adicional de la nueva sección del examen médico."
    };

    // Datos reales mapeados desde la estructura de ficha_antecedente_patologico_Digitalizado.jsx
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
      // Detalle información
      detalleInformacion: String(data.detalleInformacion ?? ""),
      // Observaciones
      observaciones: String(data.observaciones ?? ""),
      // Observaciones y Recomendaciones
      observacionesRecomendaciones: String(data.observacionesRecomendaciones ?? ""),
      // Detalle pruebas complementarias
      detallePruebasComplementarias: String(data.detallePruebasComplementarias ?? ""),
      // Datos del examen físico
      fc: String(data.fc ?? ""),
      fr: String(data.fr ?? ""),
      pa: String(data.pa ?? ""),
      talla: String(data.talla ?? ""),
      peso: String(data.peso ?? ""),
      imc: String(data.imc ?? ""),
      perimetroCuello: String(data.perimetroCuello ?? ""),
      perimetroCintura: String(data.perimetroCintura ?? ""),
      perimetroCadera: String(data.perimetroCadera ?? ""),
      // Conclusión evaluación
      conclusionDesde: String(data.conclusionDesde ?? ""),
      conclusionHasta: String(data.conclusionHasta ?? ""),
      conclusionApto: Boolean(data.conclusionApto ?? false),
      conclusionNoApto: Boolean(data.conclusionNoApto ?? false),
      conclusionObservado: Boolean(data.conclusionObservado ?? false),
      // Detalle nueva sección
      detalleNuevaSeccion: String(data.detalleNuevaSeccion ?? "")
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
        doc.text("CERTIFICACION DE SUFICIENCIA MEDICA PARA TRABAJOS EN ALTURA", pageW / 2, 28, { align: "center" });
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("(encima de los 1.8 metros)", pageW / 2, 32, { align: "center" });
      }

       // Número de Ficha y Página (alineación automática mejorada)
      doc.setFont("helvetica", "normal").setFontSize(8);
      
      doc.text("Nro de ficha: ", pageW - 80, 13);

      doc.setFont("helvetica", "normal").setFontSize(18);
      doc.text(datosFinales.numeroFicha, pageW - 60, 13);

      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 8);
      doc.text("Sede: " + datosFinales.sede, pageW - 80, 18);
      doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 23);

      // Bloque de color (posición mejorada)
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

    // Octava fila: Años de experiencia, Primera aptitud, Revalidación (3 columnas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // === CONTENIDO DE LA TABLA ===
    let yTexto = tablaInicioY + 2.5;

    // Primera fila: AFILIACION (ya dibujada por dibujarHeaderSeccion)
    yTexto += filaAltura;

    // Segunda fila: Apellidos y Nombres
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1, 130);
    yTexto += filaAltura;

    // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.genero, tablaInicioX + 105, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1);
    yTexto += filaAltura;

    // Cuarta fila: Domicilio
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1, 150);
    yTexto += filaAltura;

    // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.puestoTrabajo, tablaInicioX + 30, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.areaTrabajo, tablaInicioX + 118, yTexto + 1);
    yTexto += filaAltura;

    // Sexta fila: Empresa
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1, 160);
    yTexto += filaAltura;

    // Séptima fila: Contrata
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.contratista, tablaInicioX + 24, yTexto + 1);
    yTexto += filaAltura;

    // Octava fila: Años de experiencia, Primera aptitud, Revalidación (3 columnas)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Años de experiencia:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.anosExperiencia + " Años", tablaInicioX + 45, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Primera aptitud:", tablaInicioX + 62, yTexto + 1);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(datosFinales.primeraAptitud ? "X" : "", tablaInicioX + 95, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Revalidación:", tablaInicioX + 122, yTexto + 1);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(datosFinales.revalidacion ? "X" : "", tablaInicioX + 145, yTexto + 1);
    yTexto += filaAltura;


    // === SECCIÓN DE ANTECEDENTES ===
    yPos = dibujarHeaderSeccion("2.- ANTECEDENTES (Llenado por el médico, implicando nivel sospecha)", yPos, filaAltura);

    // Segunda fila: Opciones Si/No con divisiones de tabla (altura reducida)
    const alturaFilaAntecedentes = 3.5; // Altura reducida para esta fila específica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaAntecedentes); // Línea izquierda
    doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 180, yPos, tablaInicioX + 180, yPos + alturaFilaAntecedentes); // Segunda división
    doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + alturaFilaAntecedentes); // Tercera división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaAntecedentes, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea inferior
    
    // Contenido de las celdas
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Si", tablaInicioX + 86.3, yPos + 2.5);
    doc.text("No", tablaInicioX + 91, yPos + 2.5);
    doc.text("Si", tablaInicioX + 181.3, yPos + 2.5);
    doc.text("No", tablaInicioX + 186, yPos + 2.5);
    
    yPos += alturaFilaAntecedentes;

    // Función para calcular altura necesaria para texto (específica por fila)
    const calcularAlturaTexto = (texto, anchoMaximo, fontSize, esFilaCompacta = false) => {
      const palabras = texto.split(' ');
      let lineaActual = '';
      let lineas = 1;
      
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
      
      // Configuración específica según el tipo de fila
      if (esFilaCompacta) {
        return Math.max(lineas * fontSize * 0.2 + 0.2, 2); // Fila ultra compacta
      } else {
        return Math.max(lineas * fontSize * 0.35 + 1.5, 4); // Fila normal
      }
    };

    // Función para calcular posición Y centrada para texto corto
    const calcularPosicionYCentrada = (alturaFila) => {
      return alturaFila / 2 + 0.5; // Centrado vertical con pequeño ajuste
    };

    // === CONFIGURACIÓN DE FILAS ===
    // Aquí puedes cambiar fácilmente cada fila
    const configuracionFilas = [
      {
        numero: 1,
        textoIzquierdo: "Todas las enfermedades que produzcan alteración de la consciencia sin importar su causa e independiente de su tratamiento",
        textoDerecho: "Personas que consumen sustancias estupefacientes o psicotrópicas en niveles que alteren su capacidad o trabajar como controlar un vehículo.",
        alturaFila: 6,    // Altura exacta en mm que quieres para esta fila
        posicionY: 2.5        // Posición vertical del texto
      },
      {
        numero: 2,
        textoIzquierdo: "Alcoholismo crónico y en general todas aquellas enfermedades que produzcan incapacidad de efectuar movimientos voluntarios y/o que limiten la capacidad de trabajo como conducción, manejo o control físico de un vehículo motorizado, subir y bajar escaleras, etc.",
        textoDerecho: "Personas que consumen sustancias estupefacientes o psicotrópicas en niveles que no alteren su capacidad de trabajar, pero que se encuentran sin tratamiento o en tratamiento sin prescripción médica.",
        alturaFila: 11,    // Altura exacta en mm
        posicionY: 2.5
      },
      {
        numero: 3,
        textoIzquierdo: "Todas aquellas enfermedades que se caractericen por movimientos involuntarios y que interfieran seriamente su capacidad de trabajar, independiente de su tratamiento farmacológico.",
        textoDerecho: "Personas que como consecuencia de una enfermedad o su tratamiento, sufran uno o varios de los siguientes efectos: alteración del estado de consciencia, alteración del equilibrio, en la percepción, en la habilidad motriz, en la estabilidad emocional y en el juicio.",
        alturaFila: 11,    // Altura exacta en mm
        posicionY: 2.5
      },
      {
        numero: 4,
        textoIzquierdo: "Perdida recurrente de la consciencia, independiente de su tratamiento, tales como narcolepsia, epilepsia, etc.",
        textoDerecho: "Síndrome Apnea Obstructiva del sueño.",
        alturaFila: 5.5,    // Altura exacta en mm
        posicionY: 2.5
      },
      {
        numero: 5,
        textoIzquierdo: "Diabetes mellitus o hipoglicemia no controlada",
        textoDerecho: "Obesidad (IMC > o igual a 30)",
        alturaFila: 3.5,    // Altura exacta en mm (normal)
        posicionY: 2.5
      },
      {
        numero: 6,
        textoIzquierdo: "Insuficiencia renal crónica grado IV",
        textoDerecho: "Anemia de cualquier grado, según criterios OMS 2011.",
        alturaFila: 3.5,    // Altura exacta en mm (normal)
        posicionY: 2.5
      }
    ];

    // Función para dibujar una fila completa
    const dibujarFila = (config, yPos) => {
      // Usar la altura exacta que especificaste
      const alturaFila = config.alturaFila;

      // Dibujar líneas de la fila
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila);
      doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFila);
      doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFila);
      doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + alturaFila);
      doc.line(tablaInicioX + 180, yPos, tablaInicioX + 180, yPos + alturaFila);
      doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + alturaFila);
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila);
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + alturaFila);

      // Calcular ancho máximo disponible para cada texto
      const posicionTextoIzquierdo = tablaInicioX + 2;
      const posicionLineaDivisoriaIzquierda = tablaInicioX + 85;
      const maxWidthIzquierdo = posicionLineaDivisoriaIzquierda - posicionTextoIzquierdo - 2; // 81mm

      const posicionTextoDerecho = tablaInicioX + 97;
      const posicionLineaDivisoriaDerecha = tablaInicioX + 180;
      const maxWidthDerecho = posicionLineaDivisoriaDerecha - posicionTextoDerecho - 2; // 81mm

      // Contenido texto izquierdo
      doc.setFont("helvetica", "normal").setFontSize(7);
      dibujarTextoConSaltoLinea(config.textoIzquierdo, posicionTextoIzquierdo, yPos + config.posicionY, maxWidthIzquierdo);

      // Marca X izquierda
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("X", tablaInicioX + 86.3, yPos + alturaFila/2 + 1);
      doc.text("", tablaInicioX + 91.5, yPos + alturaFila/2 + 1);

      // Contenido texto derecho
      doc.setFont("helvetica", "normal").setFontSize(7);
      // Para texto corto, centrarlo verticalmente
      const esTextoDerechoCorto = config.textoDerecho.length < 50; // Si tiene menos de 50 caracteres
      const posYTextoDerecho = esTextoDerechoCorto ? yPos + calcularPosicionYCentrada(alturaFila, 6) : yPos + config.posicionY;
      dibujarTextoConSaltoLinea(config.textoDerecho, posicionTextoDerecho, posYTextoDerecho, maxWidthDerecho);

      // Marca X derecha
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("", tablaInicioX + 181.3, yPos + alturaFila/2 + 1);
      doc.text("X", tablaInicioX + 186.5, yPos + alturaFila/2 + 1);

      return alturaFila;
    };

    // === DIBUJAR TODAS LAS FILAS ===
    // Ahora es súper fácil cambiar cualquier fila
    configuracionFilas.forEach((config) => {
      const alturaFila = dibujarFila(config, yPos);
      yPos += alturaFila;
    });

    // === FILA DE DETALLE INFORMACIÓN ===
    // Fila sin divisiones para información adicional
    const textoDetalle = "Detalle información: " + (datosFinales.detalleInformacion || "Sin información adicional");
    
    // Calcular altura dinámica para el texto de detalle
    const calcularAlturaDetalle = (texto, anchoMaximo, fontSize) => {
      const palabras = texto.split(' ');
      let lineaActual = '';
      let lineas = 1;
      
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
      
      // Altura mínima de 4mm, altura máxima de 12mm (3 líneas)
      return Math.max(lineas * fontSize * 0.35 + 1.5, 4);
    };

    const anchoMaximoDetalle = tablaAncho - 4; // Ancho total menos márgenes
    const alturaFilaDetalle = calcularAlturaDetalle(textoDetalle, anchoMaximoDetalle, 7);

    // Dibujar líneas de la fila de detalle (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDetalle); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDetalle); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaDetalle, tablaInicioX + tablaAncho, yPos + alturaFilaDetalle); // Línea inferior

    // Contenido de la fila de detalle
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(textoDetalle, tablaInicioX + 2, yPos + 2.5, anchoMaximoDetalle);

    yPos += alturaFilaDetalle;

    // === SECCIÓN 3: PRUEBAS COMPLEMENTARIAS ===
    // Continuar directamente después del detalle información

    // Título de la sección 3 usando función general
    const filaAltura3 = 4;
    yPos = dibujarHeaderSeccion("3.- PRUEBAS COMPLEMENTARIAS (Llenado por el médico)", yPos, filaAltura3);

    // === ENCABEZADOS SI/NO PARA SECCIÓN 3 ===
    // Usar las mismas posiciones exactas que la sección 2
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaAntecedentes); // Línea izquierda
    doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 180, yPos, tablaInicioX + 180, yPos + alturaFilaAntecedentes); // Segunda división
    doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + alturaFilaAntecedentes); // Tercera división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaAntecedentes, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea inferior
    
    // Contenido de las celdas (mismas posiciones que sección 2)
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Si", tablaInicioX + 86.3, yPos + 2.5);
    doc.text("No", tablaInicioX + 91, yPos + 2.5);
    doc.text("Si", tablaInicioX + 181.3, yPos + 2.5);
    doc.text("No", tablaInicioX + 186, yPos + 2.5);
    
    yPos += alturaFilaAntecedentes;

    // Configuración de filas para pruebas complementarias
    const configuracionFilasPruebas = [
      {
        numero: 1,
        textoIzquierdo: "Se encuentra usted resfriado o con algún cuadro respiratorio",
        textoDerecho: "Hipoacusia con compromiso de frecuencias conversacionales con promedio mayor de 40 dB uni o bilateral (no incluye audífonos).",
        alturaFila: 8.5,
        posicionY: 2.5
      },
      {
        numero: 2,
        textoIzquierdo: "Sufre de vértigo o mareos.",
        textoDerecho: "Alteración de la agudeza visual (de lejos diferente a 20/30 en cada ojo) y/o de la visión de profundidad incluso con lentes correctores.",
        alturaFila: 8.5,
        posicionY: 2.5
      },
      {
        numero: 3,
        textoIzquierdo: "Temor a las alturas.",
        textoDerecho: "Campimetría Anormal (Test de confrontación alterada)",
        alturaFila: 3.5,
        posicionY: 2.5
      },
      {
        numero: 4,
        textoIzquierdo: "Test de SAS : Anormal",
        textoDerecho: "Campimetría Anormal (Test de confrontación alterada)",
        alturaFila: 3.5,
        posicionY: 2.5
      },
     
    ];

    // Dibujar todas las filas de pruebas complementarias
    configuracionFilasPruebas.forEach((config) => {
      const alturaFila = dibujarFila(config, yPos);
      yPos += alturaFila;
    });

    // === FILA DE DETALLE PARA PRUEBAS COMPLEMENTARIAS ===
    const textoDetallePruebas = "Detalle información: " + (datosFinales.detallePruebasComplementarias || "Sin información adicional de pruebas complementarias");
    
    const alturaFilaDetallePruebas = calcularAlturaDetalle(textoDetallePruebas, anchoMaximoDetalle, 6);

    // Dibujar líneas de la fila de detalle (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDetallePruebas); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDetallePruebas); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaDetallePruebas, tablaInicioX + tablaAncho, yPos + alturaFilaDetallePruebas); // Línea inferior

    // Contenido de la fila de detalle
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(textoDetallePruebas, tablaInicioX + 2, yPos + 2.5, anchoMaximoDetalle);

    yPos += alturaFilaDetallePruebas;

    // === SECCIÓN 4: EXAMEN FISICO ===
    // Continuar directamente después del detalle información de la sección 3

    // Título de la sección 4 usando función general
    const filaAltura4 = 4;
    yPos = dibujarHeaderSeccion("4.- EXAMEN FISICO (actual)", yPos, filaAltura4);

    // === FILA 1: SIGNOS VITALES (6 divisiones) ===
    const alturaFilaSignos = 4;
    
    // Dibujar líneas de la fila con 6 divisiones
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaSignos); // Línea izquierda
    doc.line(tablaInicioX + 32, yPos, tablaInicioX + 32, yPos + alturaFilaSignos); // División 1
    doc.line(tablaInicioX + 64, yPos, tablaInicioX + 64, yPos + alturaFilaSignos); // División 2
    doc.line(tablaInicioX + 96, yPos, tablaInicioX + 96, yPos + alturaFilaSignos); // División 3
    doc.line(tablaInicioX + 128, yPos, tablaInicioX + 128, yPos + alturaFilaSignos); // División 4
    doc.line(tablaInicioX + 160, yPos, tablaInicioX + 160, yPos + alturaFilaSignos); // División 5
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaSignos); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaSignos, tablaInicioX + tablaAncho, yPos + alturaFilaSignos); // Línea inferior
    
    // Contenido de la fila de signos vitales
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("FC :", tablaInicioX + 2, yPos + 3);
    doc.text((datosFinales.fc || "60") + " lpm", tablaInicioX + 10, yPos + 3);
    
    doc.text("FR :", tablaInicioX + 34, yPos + 3);
    doc.text((datosFinales.fr || "60") + " rpm", tablaInicioX + 42, yPos + 3);
    
    doc.text("PA :", tablaInicioX + 66, yPos + 3);
    doc.text((datosFinales.pa || "50/60") + " mmHg", tablaInicioX + 75, yPos + 3);
    
    doc.text("Talla :", tablaInicioX + 98, yPos + 3);
    doc.text((datosFinales.talla || "170") + " cm", tablaInicioX + 110, yPos + 3);
    
    doc.text("Peso :", tablaInicioX + 130, yPos + 3);
    doc.text((datosFinales.peso || "65") + " kg", tablaInicioX + 140, yPos + 3);
    
    doc.text("IMC :", tablaInicioX + 162, yPos + 3);
    doc.text((datosFinales.imc || "0.00") + " kg/m²", tablaInicioX + 170, yPos + 3);
    
    yPos += alturaFilaSignos;

    // === FILA 2: PERÍMETROS (2 divisiones) ===
    const alturaFilaPerimetros = 4;
    
    // Dibujar líneas de la fila con 2 divisiones
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaPerimetros); // Línea izquierda
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaFilaPerimetros); // 1ra central
    doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + alturaFilaPerimetros); // 2da central

    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaPerimetros); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaPerimetros, tablaInicioX + tablaAncho, yPos + alturaFilaPerimetros); // Línea inferior
    
    // Contenido de la fila de perímetros
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Perímetro de Cuello :", tablaInicioX + 2, yPos + 3);
    doc.text((datosFinales.perimetroCuello || "44") + " cm", tablaInicioX + 34, yPos + 3);
    
    doc.text("Perímetro de Cintura :", tablaInicioX + 62, yPos + 3);
    doc.text((datosFinales.perimetroCintura || "75") + " cm", tablaInicioX + 98, yPos + 3);
    
    doc.text("Perímetro de Cadera :", tablaInicioX + 132, yPos + 3);
    doc.text((datosFinales.perimetroCadera || "80") + " cm", tablaInicioX + 165, yPos + 3);
    
    yPos += alturaFilaPerimetros;

    // === SECCIÓN 5: NUEVA SECCIÓN ===
    // Continuar directamente después de las filas de perímetros

    // === ENCABEZADOS SI/NO PARA SECCIÓN 5 ===
    // Usar las mismas posiciones exactas que las secciones anteriores
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaAntecedentes); // Línea izquierda
    doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + alturaFilaAntecedentes); // Primera división
    doc.line(tablaInicioX + 180, yPos, tablaInicioX + 180, yPos + alturaFilaAntecedentes); // Segunda división
    doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + alturaFilaAntecedentes); // Tercera división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaAntecedentes, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea inferior
    
    // Contenido de las celdas (mismas posiciones que secciones anteriores)
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Si", tablaInicioX + 86.3, yPos + 2.5);
    doc.text("No", tablaInicioX + 91, yPos + 2.5);
    doc.text("Si", tablaInicioX + 181.3, yPos + 2.5);
    doc.text("No", tablaInicioX + 186, yPos + 2.5);
    
    yPos += alturaFilaAntecedentes;

    // Configuración de filas para la nueva sección
    const configuracionFilasNuevaSeccion = [
      {
        numero: 1,
        textoIzquierdo: "Limitación en fuerza y/o movilidad de extremidades (Mayor a 5Kg / fuerza cada mano )",
        textoDerecho: "Presencia de nistagmus",
        alturaFila: 5.5,
        posicionY: 2.5
      },
      {
        numero: 2,
        textoIzquierdo: "Alteración presente del equilibrio. (Romberg).",
        textoDerecho: "Anormalidad en movimientos oculares",
        alturaFila: 4.0,
        posicionY: 2.5
      },
      {
        numero: 3,
        textoIzquierdo: "Anormalidad en la marcha.",
        textoDerecho: "Pupilas no CIRLA",
        alturaFila: 4.0,
        posicionY: 2.5
      },
      {
        numero: 4,
        textoIzquierdo: "Alteración de la coordinación (dedo índice nariz)",
        textoDerecho: "Anormalidad del lenguaje",
        alturaFila: 4.0,
        posicionY: 2.5
      },
      {
        numero: 5,
        textoIzquierdo: "Sustentación en 1 pie > 15",
        textoDerecho: "Movimientos involuntarios y/o Asimetría facial.",
        alturaFila: 4.0,
        posicionY: 2.5
      }
    ];

    // Dibujar todas las filas de la nueva sección
    configuracionFilasNuevaSeccion.forEach((config) => {
      const alturaFila = dibujarFila(config, yPos);
      yPos += alturaFila;
    });

    // === FILA DE DETALLE PARA NUEVA SECCIÓN ===
    const textoDetalleNuevaSeccion = "Detalle información: " + (datosFinales.detalleNuevaSeccion || "Sin información adicional de la nueva sección");
    
    const alturaFilaDetalleNuevaSeccion = calcularAlturaDetalle(textoDetalleNuevaSeccion, anchoMaximoDetalle, 6);

    // Dibujar líneas de la fila de detalle (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDetalleNuevaSeccion); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDetalleNuevaSeccion); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaDetalleNuevaSeccion, tablaInicioX + tablaAncho, yPos + alturaFilaDetalleNuevaSeccion); // Línea inferior

    // Contenido de la fila de detalle
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(textoDetalleNuevaSeccion, tablaInicioX + 2, yPos + 2.5, anchoMaximoDetalle);

    yPos += alturaFilaDetalleNuevaSeccion;

    // === SECCIÓN 5: CONCLUSIÓN DE LA PRESENTE EVALUACIÓN ===
    const alturaHeaderConclusion = 4;
    yPos = dibujarHeaderSeccion("5.- CONCLUSIÓN DE LA PRESENTE EVALUACIÓN", yPos, alturaHeaderConclusion);

    // === Fila de conclusión con divisiones ===
    // Estructura: [Apto para conducción] | [Desde dd/mm/aaaa] | [Hasta dd/mm/aaaa] | [Apto][X] | [No apto][ ] | [Observado]
    const alturaFilaConclusion = 4.5;
    // Líneas
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaConclusion); // izquierda
    doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + alturaFilaConclusion); // col 1 -> col 2
    doc.line(tablaInicioX + 82.5, yPos, tablaInicioX + 82.5, yPos + alturaFilaConclusion); // col 2 -> col 3
    doc.line(tablaInicioX + 115, yPos, tablaInicioX + 115, yPos + alturaFilaConclusion); // col 3 -> col 4 (estado)
    
    doc.line(tablaInicioX + 128, yPos, tablaInicioX + 128, yPos + alturaFilaConclusion); // entre Apto label y X
    doc.line(tablaInicioX + 137, yPos, tablaInicioX + 137, yPos + alturaFilaConclusion); // entre X y No apto label
    doc.line(tablaInicioX + 153, yPos, tablaInicioX + 153, yPos + alturaFilaConclusion); // entre No apto y Observado
    doc.line(tablaInicioX + 162, yPos, tablaInicioX + 162, yPos + alturaFilaConclusion); // entre No apto y Observado
    doc.line(tablaInicioX + 178, yPos, tablaInicioX + 178, yPos + alturaFilaConclusion); // entre No apto y Observado


    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaConclusion); // derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // superior
    doc.line(tablaInicioX, yPos + alturaFilaConclusion, tablaInicioX + tablaAncho, yPos + alturaFilaConclusion); // inferior

    // Contenido
    doc.setFont("helvetica", "normal").setFontSize(8);
    // Col 1: texto
    dibujarTextoConSaltoLinea("Apto para conducción de vehículos", tablaInicioX + 2, yPos + 3, 66);
    // Col 2: Desde
    dibujarTextoConSaltoLinea("Desde: " + (datosFinales.conclusionDesde || "__/__/____"), tablaInicioX + 53, yPos + 3, 32);
    // Col 3: Hasta
    dibujarTextoConSaltoLinea("Hasta: " + (datosFinales.conclusionHasta || "__/__/____"), tablaInicioX + 87, yPos + 3, 32);
    // Col 4: Estado (Apto | X | No apto |  | Observado)
    doc.text("Apto", tablaInicioX + 118, yPos + 3);
    doc.text(datosFinales.conclusionApto ? "X" : "", tablaInicioX + 131, yPos + 3);
    doc.text("No apto", tablaInicioX + 140, yPos + 3);
    doc.text(datosFinales.conclusionNoApto ? "X" : "", tablaInicioX + 153, yPos + 3);
    doc.text("Observado", tablaInicioX + 163, yPos + 3);

    yPos += alturaFilaConclusion;

    // === SECCIÓN 6: OBSERVACIONES Y RECOMENDACIONES ===
    const alturaHeaderObservaciones = 4;
    yPos = dibujarHeaderSeccion("6.- OBSERVACIONES Y RECOMENDACIONES", yPos, alturaHeaderObservaciones);

    // === Fila de observaciones y recomendaciones (sin divisiones internas) ===
    const textoObservacionesRecomendaciones = `Observaciones y Recomendaciones: ${datosFinales.observacionesRecomendaciones || "Sin observaciones adicionales"}`;
    const alturaFilaObservaciones = Math.max(6, calcularAlturaTexto(textoObservacionesRecomendaciones, tablaAncho - 4, 8));
    
    // Dibujar líneas de la fila de observaciones (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaObservaciones); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaObservaciones, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones); // Línea inferior

    // Contenido de la fila de observaciones y recomendaciones
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(textoObservacionesRecomendaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);

    yPos += alturaFilaObservaciones;

    // === CONFIGURACIÓN DE SECCIÓN DE FIRMA MÉDICA ===
    const configuracionFirmaMedica = {
      alturaSeccionFirma: 20,
      alturaNotaAlPie: 5, // Altura fija compacta
      textoNotaAlPie: "NOTA AL PIE: La presente certificación tiene una validez igual a la señalada en CONCLUSION. La aparición de alguna enfermedad NUEVA durante la duración de esta certificación invalida este permiso y deberá ser reevaluado medicamente. Antes de continuar conduciendo u operando algún tipo de vehículo.",
      colorAdvertencia: [245, 174, 103], // #f5ae67 - Naranja personalizado
      fuenteNota: { tipo: "helvetica", estilo: "normal", tamaño: 6 }
    };

    // === SECCIÓN DE FIRMA MÉDICA ===
    const yFirmaMedica = yPos;
    const alturaTotalTabla = configuracionFirmaMedica.alturaSeccionFirma + configuracionFirmaMedica.alturaNotaAlPie;
    
    // Dibujar tabla completa (una sola tabla con dos filas)
    // Líneas verticales
    doc.line(tablaInicioX, yFirmaMedica, tablaInicioX, yFirmaMedica + alturaTotalTabla);
    doc.line(tablaInicioX + tablaAncho/2, yFirmaMedica, tablaInicioX + tablaAncho/2, yFirmaMedica + configuracionFirmaMedica.alturaSeccionFirma);
    doc.line(tablaInicioX + tablaAncho, yFirmaMedica, tablaInicioX + tablaAncho, yFirmaMedica + alturaTotalTabla);
    
    // Líneas horizontales
    doc.line(tablaInicioX, yFirmaMedica, tablaInicioX + tablaAncho, yFirmaMedica);
    doc.line(tablaInicioX, yFirmaMedica + configuracionFirmaMedica.alturaSeccionFirma, tablaInicioX + tablaAncho, yFirmaMedica + configuracionFirmaMedica.alturaSeccionFirma);
    doc.line(tablaInicioX, yFirmaMedica + alturaTotalTabla, tablaInicioX + tablaAncho, yFirmaMedica + alturaTotalTabla);
    
    // Fila 1: Información del médico y firma (2 columnas)
    // Columna 1: Información del médico
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nombre y Apellidos del Médico - N° de Colegiatura", tablaInicioX + 2, yFirmaMedica + 5);
    doc.text("Firma y Sello", tablaInicioX + 2, yFirmaMedica + 9);
    doc.text("CMP", tablaInicioX + 2, yFirmaMedica + 13);
    
    // Columna 2: Firma del médico
    const firmaMedicoUrl = getSign(data, "FIRMA_MEDICO");
    if (firmaMedicoUrl) {
      try {
        const img = new Image();
        img.onload = function() {
          const imgWidth = 80;
          const imgHeight = 20;
          const x = tablaInicioX + tablaAncho/2 + 10;
          const y = yFirmaMedica + 2;
          doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
        };
        img.src = firmaMedicoUrl;
      } catch (error) {
        console.log("Error cargando firma del médico:", error);
      }
    }
    
    // Fila 2: Nota al pie (fila dinámica con fondo naranja personalizado)
    const yNotaAlPie = yFirmaMedica + configuracionFirmaMedica.alturaSeccionFirma;
    
    // Dibujar fondo naranja personalizado
    doc.setFillColor(...configuracionFirmaMedica.colorAdvertencia);
    doc.rect(tablaInicioX, yNotaAlPie, tablaAncho, configuracionFirmaMedica.alturaNotaAlPie, 'F');
    
    // Dibujar texto de nota al pie
    doc.setFont(configuracionFirmaMedica.fuenteNota.tipo, configuracionFirmaMedica.fuenteNota.estilo).setFontSize(configuracionFirmaMedica.fuenteNota.tamaño);
    doc.setTextColor(0, 0, 0);
    dibujarTextoConSaltoLinea(configuracionFirmaMedica.textoNotaAlPie, tablaInicioX + 2, yNotaAlPie + 2, tablaAncho - 4);

    // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
    const yDeclaracion = yFirmaMedica + alturaTotalTabla; // Continuar directamente desde la firma médica
    const alturaSeccionDeclaracion = 20; // Altura para la sección de declaración
    
    // Dibujar las líneas de la sección de declaración (3 columnas)
    doc.line(tablaInicioX, yDeclaracion, tablaInicioX, yDeclaracion + alturaSeccionDeclaracion); // Línea izquierda
    doc.line(tablaInicioX + 60, yDeclaracion, tablaInicioX + 60, yDeclaracion + alturaSeccionDeclaracion); // Primera división
    doc.line(tablaInicioX + 120, yDeclaracion, tablaInicioX + 120, yDeclaracion + alturaSeccionDeclaracion); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yDeclaracion, tablaInicioX + tablaAncho, yDeclaracion + alturaSeccionDeclaracion); // Línea derecha
    doc.line(tablaInicioX, yDeclaracion, tablaInicioX + tablaAncho, yDeclaracion); // Línea superior
    doc.line(tablaInicioX, yDeclaracion + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yDeclaracion + alturaSeccionDeclaracion); // Línea inferior

    // Columna 1: Declaración
    doc.setFont("helvetica", "normal").setFontSize(6);
    const textoDeclaracion = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";
    dibujarTextoConSaltoLinea(textoDeclaracion, tablaInicioX + 2, yDeclaracion + 3, 55);

    // Columna 2: Firma del trabajador
    const firmaUrl = getSign(data, "FIRMAP");
    if (firmaUrl) {
      try {
        const img = new Image();
        img.onload = function() {
          const imgWidth = 50;
          const imgHeight = 15;
          const x = tablaInicioX + 65;
          const y = yDeclaracion + 2;
          doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
        };
        img.src = firmaUrl;
      } catch (error) {
        console.log("Error cargando firma:", error);
      }
    }
    
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Firma del trabajador o postulante", tablaInicioX + 90, yDeclaracion + 16.5, { align: "center" });
    doc.text("DNI : " + datosFinales.documentoIdentidad, tablaInicioX + 90, yDeclaracion + 19, { align: "center" });

    // Columna 3: Huella digital
    const huellaUrl = getSign(data, "HUELLA");
    if (huellaUrl) {
      try {
        const img = new Image();
        img.onload = function() {
          const imgWidth = 50;
          const imgHeight = 15;
          const x = tablaInicioX + 125;
          const y = yDeclaracion + 2;
          doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
        };
        img.src = huellaUrl;
      } catch (error) {
        console.log("Error cargando huella:", error);
      }
    }
    
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Indice Derecho", tablaInicioX + 150, yDeclaracion + 16.5, { align: "center" });

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

CertificadoAltura_Digitalizado.propTypes = {
  data: PropTypes.object
};
