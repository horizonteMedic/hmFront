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
      otros: "Condiciones especiales adicionales",
      otrosPulmon: "Otras condiciones pulmonares específicas",
      otrosCardiovascular: "Otras condiciones cardiovasculares específicas",
      // Datos para sección 7.1 - Evaluación del Lugar de Trabajo
      respiradores: {
        mascaraPolvo: true,
        mediaCara: true,
        caraCompleta: true,
        purificadorSinEnergia: true,
        purificadorConEnergia: true,
        suministradorAtmosfera: true,
        combinacionLineaAire: true,
        flujoContinuo: true,
        suministradorAire: true,
        scbaCircuitoAbierto: true,
        scbaCircuitoCerrado: true
      },
      frecuenciaUso: {
        diaria: true,
        ocasional: false,
        raraVez: false,
        promedioHoras: "8"
      },
      materialesPeligrosos: {
        humoMetal: false,
        amoniaco: false,
        arsenico: false,
        polvoRespirable: false,
        plomo: false,
        silice: false,
        asbesto: false,
        mercurio: false,
        monoxidoCarbono: false,
        dioxidoCarbono: false,
        vaporOrganico: false
      },
      condicionesEspeciales: {
        elevacionesAltas: false,
        temperaturasExtremas: false,
        atmosferasHumidas: false,
        espaciosConfirmados: false,
        atmosferasIDLH: false,
        hazmatFuegoRescate: false,
        temperaturasExtremasTrabajo: false
      },
      esfuerzoFisico: {
        ligero: false,
        moderado: false,
        pesado: false
      }
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
      otros: String(data.otros ?? ""),
      otrosPulmon: String(data.otrosPulmon ?? ""),
      otrosCardiovascular: String(data.otrosCardiovascular ?? ""),
      // Datos para sección 7.1 - Evaluación del Lugar de Trabajo
      respiradores: {
        mascaraPolvo: Boolean(data.mascaraPolvo ?? false),
        mediaCara: Boolean(data.mediaCara ?? false),
        caraCompleta: Boolean(data.caraCompleta ?? false),
        purificadorSinEnergia: Boolean(data.purificadorSinEnergia ?? false),
        purificadorConEnergia: Boolean(data.purificadorConEnergia ?? false),
        suministradorAtmosfera: Boolean(data.suministradorAtmosfera ?? false),
        combinacionLineaAire: Boolean(data.combinacionLineaAire ?? false),
        flujoContinuo: Boolean(data.flujoContinuo ?? false),
        suministradorAire: Boolean(data.suministradorAire ?? false),
        scbaCircuitoAbierto: Boolean(data.scbaCircuitoAbierto ?? false),
        scbaCircuitoCerrado: Boolean(data.scbaCircuitoCerrado ?? false)
      },
      frecuenciaUso: {
        diaria: Boolean(data.frecuenciaDiaria ?? false),
        ocasional: Boolean(data.frecuenciaOcasional ?? false),
        raraVez: Boolean(data.frecuenciaRaraVez ?? false),
        promedioHoras: String(data.promedioHoras ?? "")
      },
      materialesPeligrosos: {
        humoMetal: Boolean(data.humoMetal ?? false),
        amoniaco: Boolean(data.amoniaco ?? false),
        arsenico: Boolean(data.arsenico ?? false),
        polvoRespirable: Boolean(data.polvoRespirable ?? false),
        plomo: Boolean(data.plomo ?? false),
        silice: Boolean(data.silice ?? false),
        asbesto: Boolean(data.asbesto ?? false),
        mercurio: Boolean(data.mercurio ?? false),
        monoxidoCarbono: Boolean(data.monoxidoCarbono ?? false),
        dioxidoCarbono: Boolean(data.dioxidoCarbono ?? false),
        vaporOrganico: Boolean(data.vaporOrganico ?? false)
      },
      condicionesEspeciales: {
        elevacionesAltas: Boolean(data.elevacionesAltas ?? false),
        temperaturasExtremas: Boolean(data.temperaturasExtremas ?? false),
        atmosferasHumidas: Boolean(data.atmosferasHumidas ?? false),
        espaciosConfirmados: Boolean(data.espaciosConfirmados ?? false),
        atmosferasIDLH: Boolean(data.atmosferasIDLH ?? false),
        hazmatFuegoRescate: Boolean(data.hazmatFuegoRescate ?? false),
        temperaturasExtremasTrabajo: Boolean(data.temperaturasExtremasTrabajo ?? false)
      },
      esfuerzoFisico: {
        ligero: Boolean(data.esfuerzoLigero ?? false),
        moderado: Boolean(data.esfuerzoModerado ?? false),
        pesado: Boolean(data.esfuerzoPesado ?? false)
      }
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
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text("Nro de ficha: ", pageW - 80, 12); // 15 - 3.5 = 11.5

      doc.setFont("helvetica", "bold").setFontSize(18);
      doc.text(datosFinales.numeroFicha, pageW - 50, 13); // 16 - 3.5 = 12.5
      doc.setFont("helvetica", "normal").setFontSize(7);
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
    const filaAltura = 4; // Reducida de 5 a 3.5

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

    // Función para dibujar X en casilleros
    const dibujarX = (x, y) => {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("X", x, y);
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
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 55, yTexto + 1, 130);
    yTexto += filaAltura;

    // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.edad, tablaInicioX + 58, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.genero, tablaInicioX + 105, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1);
    yTexto += filaAltura;

    // Cuarta fila: Domicilio
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1, 150);
    yTexto += filaAltura;

    // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.puestoTrabajo, tablaInicioX + 40, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.areaTrabajo, tablaInicioX + 125, yTexto + 1);
    yTexto += filaAltura;

    // Sexta fila: Empresa
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 20, yTexto + 1, 160);
    yTexto += filaAltura;

    // Séptima fila: Contrata
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Contrata:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(7);
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
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Marcar el tipo de respirador(es) a utilizar :", tablaInicioX + 2, yPos - 1.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
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

  
    doc.setFont("helvetica", "normal").setFontSize(7);
    
    // Primer elemento - Máscara de polvo
    const x1 = 15; // Posición X independiente
    const y1 = yPos - 1; // Posición Y independiente
    doc.text("Máscara de polvo", x1, y1);
    if (datosFinales.respiradores.mascaraPolvo) {
      dibujarX(x1 + 25, y1);
    }
    
    // Segundo elemento - ½ cara
    const x2 = 50; // Posición X independiente
    const y2 = yPos - 1; // Posición Y independiente
    doc.text("½ cara", x2, y2);
    if (datosFinales.respiradores.mediaCara) {
      dibujarX(x2 + 15, y2);
    }
    
    // Tercer elemento - Cara completa
    const x3 = 75; // Posición X independiente
    const y3 = yPos - 1; // Posición Y independiente
    doc.text("Cara completa", x3, y3);
    if (datosFinales.respiradores.caraCompleta) {
      dibujarX(x3 + 25, y3);
    }
    
    // Cuarto elemento - De manera diaria
    const x4 = 110; // Posición X independiente
    const y4 = yPos - 1; // Posición Y independiente
    doc.text("De manera diaria", x4, y4);
    if (datosFinales.frecuenciaUso.diaria) {
      dibujarX(x4 + 80, y4);
    }

    
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
    doc.setFont("helvetica", "normal").setFontSize(7);
    
    // Primer texto de la nueva fila
    const x5 = 15; // Posición X independiente
    const y5 = yPos - 1; // Posición Y independiente
    doc.text("Purificador de aire (sin energía)", x5, y5);
    if (datosFinales.respiradores.purificadorSinEnergia) {
      dibujarX(x5 + 81.5, y5);
    }
    
    // Segundo texto de la nueva fila
    const x6 = 110; // Posición X independiente
    const y6 = yPos - 1; // Posición Y independiente
    doc.text("Ocasional – pero no más de dos veces por semana: hrs", x6, y6);
    if (datosFinales.frecuenciaUso.ocasional) {
      dibujarX(x6 + 81.5, y6);
    }

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
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Primer texto de la nueva fila
    const x7 = 15; // Posición X independiente
    const y7 = yPos - 1; // Posición Y independiente
    doc.text("Purificador de aire (con energía)", x7, y7);
    if (datosFinales.respiradores.purificadorConEnergia) {
      dibujarX(x7 + 81.5, y7);
    }

    // Segundo texto de la nueva fila
    const x8 = 110; // Posición X independiente
    const y8 = yPos - 1; // Posición Y independiente
    doc.text("Rara vez – uso de emergencia solamente.", x8, y8);
    if (datosFinales.frecuenciaUso.raraVez) {
      dibujarX(x8 + 81.5, y8);
    }

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
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Primer texto de la nueva fila
    const x9 = 15; // Posición X independiente
    const y9 = yPos - 1; // Posición Y independiente
    doc.text("Respirador suministrador de atmosfera", x9, y9);
    if (datosFinales.respiradores.suministradorAtmosfera) {
      dibujarX(x9 + 81.5, y9);
    }

    // Segundo texto de la nueva fila
    const x10 = 110; // Posición X independiente
    const y10 = yPos - 1; // Posición Y independiente
    doc.text("Promedio de horas de uso por Día:", x10, y10);
    // Mostrar las horas promedio si están definidas
    if (datosFinales.frecuenciaUso.promedioHoras) {
      doc.text(datosFinales.frecuenciaUso.promedioHoras, x10 + 60, y10);
    } 

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
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Primer texto de la fila 7
    const x11 = 15; // Posición X independiente
    const y11 = yPos - 1.5; // Posición Y independiente
    doc.text("Combinación línea de aire SCBA", x11, y11);
    if (datosFinales.respiradores.combinacionLineaAire) {
      dibujarX(x11 + 81.5, y11);
    }

    // Segundo texto de la fila 7
    const x12 = 107; // Posición X independiente
    const y12 = yPos - 1.5; // Posición Y independiente
    doc.setFont("helvetica", "normal").setFontSize(7);
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
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Texto izquierda - Respirador de Flujo Continuo
    const x13 = 15; // Posición X independiente
    const y13 = yPos - 1; // Posición Y independiente
    doc.text("Respirador de Flujo Continuo", x13, y13);
    if (datosFinales.respiradores.flujoContinuo) {
      dibujarX(x13 + 81.5, y13);
    }

    // Texto derecha 1 - Humo de Metal
    const x14 = 110; // Posición X independiente
    const y14 = yPos - 1; // Posición Y independiente
    doc.text("Humo de Metal", x14, y14);
    if (datosFinales.materialesPeligrosos.humoMetal) {
      dibujarX(x14 - 8, y14);
    }

    // Texto derecha 2 - Amoniaco
    const x15 = 160; // Posición X independiente
    const y15 = yPos - 1; // Posición Y independiente
    doc.text("Amoniaco", x15, y15);
    if (datosFinales.materialesPeligrosos.amoniaco) {
      dibujarX(x15 - 8, y15);
    }

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
    doc.setFont("helvetica", "normal").setFontSize(7);

    const x16 = 15; 
    const y16 = yPos - 1; // Posición Y independiente
    doc.text("Respirador suministrador de aire", x16, y16);
    if (datosFinales.respiradores.suministradorAire) {
      dibujarX(x16 + 81.5, y16);
    }

    const x17 = 110; // Posición X independiente
    const y17 = yPos - 1.5; // Posición Y independiente
    doc.text("Arsénico", x17, y17);
    if (datosFinales.materialesPeligrosos.arsenico) {
      dibujarX(x17 - 8, y17 - 0.5);
    }

    const x18 = 160; // Posición X independiente
    const y18 = yPos - 1.5; // Posición Y independiente
    doc.text("Polvo Respirable", x18, y18);
    if (datosFinales.materialesPeligrosos.polvoRespirable) {
      dibujarX(x18 - 8, y18 - 0.5);
    }


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
    doc.setFont("helvetica", "normal").setFontSize(7);
    const x19 = 15; // Posición X independiente
    const y19 = yPos - 1; // Posición Y independiente
    doc.text("SCBA de circuito abierto", x19, y19);
    if (datosFinales.respiradores.scbaCircuitoAbierto) {
      dibujarX(x19 + 81.5, y19);
    }
    const x20 = 110; // Posición X independiente
    const y20 = yPos - 1.5; // Posición Y independiente
    doc.text("Plomo", x20, y20);
    if (datosFinales.materialesPeligrosos.plomo) {
      dibujarX(x20 - 8, y20 - 0.5);
    }

    const x21 = 160; // Posición X independiente
    const y21 = yPos - 1.5; // Posición Y independiente
    doc.text("Sílice", x21, y21);
    if (datosFinales.materialesPeligrosos.silice) {
      dibujarX(x21 - 8, y21 - 0.5);
    }

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
    doc.setFont("helvetica", "normal").setFontSize(7);
    const x22 = 15; // Posición X independiente
    const y22 = yPos - 1; // Posición Y independiente
    doc.text("SCBA de circuito cerrado", x22, y22);
    if (datosFinales.respiradores.scbaCircuitoCerrado) {
      dibujarX(x22 + 81.5, y22);
    }
    const x23 = 110; // Posición X independiente
    const y23 = yPos - 1.5; // Posición Y independiente
    doc.text("Asbesto", x23, y23);
    if (datosFinales.materialesPeligrosos.asbesto) {
      dibujarX(x23 - 8, y23 - 0.5);
    }

    const x24 = 160; // Posición X independiente
    const y24 = yPos - 1.5; // Posición Y independiente
    doc.text("Mercurio", x24, y24);
    if (datosFinales.materialesPeligrosos.mercurio) {
      dibujarX(x24 - 8, y24 - 0.5);
    }

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
     doc.setFont("helvetica", "normal").setFontSize(7);
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
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Primer texto de la nueva fila
    const x28 = 15; // Posición X independiente
    const y28 = yPos - 1.5; // Posición Y independiente
    doc.text("Filtro HEPA (partículas)", x28, y28);
    // No hay X para filtros, solo para materiales

    // Segundo texto de la nueva fila
    const x29 = 110; // Posición X independiente
    const y29 = yPos - 1.5; // Posición Y independiente
    doc.text("Monóxido de Carbono", x29, y29);
    if (datosFinales.materialesPeligrosos.monoxidoCarbono) {
      dibujarX(x29 - 8, y29 - 0.5);
    }

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
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Primer texto de la nueva fila
    const x30 = 15; // Posición X independiente
    const y30 = yPos - 1.5; // Posición Y independiente
    doc.text("Cartuchos (Gas acido)", x30, y30);
    // No hay X para cartuchos, solo para materiales

    // Segundo texto de la nueva fila
    const x31 = 110; // Posición X independiente
    const y31 = yPos - 1.5; // Posición Y independiente
    doc.text("Dióxido de Carbono", x31, y31);
    if (datosFinales.materialesPeligrosos.dioxidoCarbono) {
      dibujarX(x31 - 8, y31 - 0.5);
    }


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
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Primer texto de la nueva fila
    const x32 = 15; // Posición X independiente
    const y32 = yPos - 1.5; // Posición Y independiente
    doc.text("Cartuchos (Vapor Orgánico)", x32, y32);
    // No hay X para cartuchos, solo para materiales

    // Segundo texto de la nueva fila
    const x33 = 110; // Posición X independiente
    const y33 = yPos - 1.5; // Posición Y independiente
    doc.text("Vapor Orgánico", x33, y33);
    if (datosFinales.materialesPeligrosos.vaporOrganico) {
      dibujarX(x33 - 8, y33 - 0.5);
    }

     // Fila 16
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
     doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
     doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
     doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
     yPos += filaAltura;
 
     // Contenido de la nueva fila - dos textos con coordenadas independientes
     doc.setFont("helvetica", "normal").setFontSize(7);
 
     // Primer texto de la nueva fila
     const x34 = 15; // Posición X independiente
     const y34 = yPos - 1.5; // Posición Y independiente
     doc.text("Cartuchos (amoniaco)", x34, y34);
     // No hay X para cartuchos, solo para materiales
 
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
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Primer texto de la nueva fila
    const x36 = 15; // Posición X independiente
    const y36 = yPos - 1.5; // Posición Y independiente
    doc.text("Cartuchos (Mercurio)", x36, y36);
    // No hay X para cartuchos, solo para materiales

    // Segundo texto de la nueva fila
    const x37 = 110; // Posición X independiente
    const y37 = yPos - 1.5; // Posición Y independiente
    doc.text("Elevaciones Altas (> 2500 msnm)", x37, y37);
    if (datosFinales.condicionesEspeciales.elevacionesAltas) {
      dibujarX(x37 - 8, y37 - 0.5);
    }


     // Fila 18
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
     doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // Línea divisoria central
     doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
     doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
     yPos += filaAltura;
 
     // Contenido de la nueva fila - dos textos con coordenadas independientes
     doc.setFont("helvetica", "normal").setFontSize(7);
 
     // Primer texto de la nueva fila
     const x38 = 12; // Posición X independiente
     const y38 = yPos - 1.5; // Posición Y independiente
     doc.text("Esfuerzo Físico Esperado Requerido :", x38, y38);
 
     // Segundo texto de la nueva fila
     const x39 = 110; // Posición X independiente
     const y39 = yPos - 1.5; // Posición Y independiente
     doc.text("Temperaturas Extremas", x39, y39);
     if (datosFinales.condicionesEspeciales.temperaturasExtremas) {
       dibujarX(x39 - 8, y39 - 0.5);
     }
 

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

  
    doc.setFont("helvetica", "normal").setFontSize(7);
    
    // Primer elemento - Ligero
    const x40 = 15; // Posición X independiente
    const y40 = yPos - 1.5; // Posición Y independiente
    doc.text("Ligero", x40, y40);
    if (datosFinales.esfuerzoFisico.ligero) {
      dibujarX(x40 - 8, y40 - 0.5);
    }
    
    // Segundo elemento - Moderado
    const x41 = 45; // Posición X independiente
    const y41 = yPos - 1.5; // Posición Y independiente
    doc.text("Moderado", x41, y41);
    if (datosFinales.esfuerzoFisico.moderado) {
      dibujarX(x41 - 8, y41 - 0.5);
    }
    
    // Tercer elemento - Pesado
    const x42 = 75; // Posición X independiente
    const y42 = yPos - 1.5; // Posición Y independiente
    doc.text("Pesado", x42, y42);
    if (datosFinales.esfuerzoFisico.pesado) {
      dibujarX(x42 - 8, y42 - 0.5);
    }
    
    // Cuarto elemento - Atmosferas Húmedas
    const x43 = 110; // Posición X independiente
    const y43 = yPos - 1.5; // Posición Y independiente
    doc.text("Atmosferas Húmedas", x43, y43);
    if (datosFinales.condicionesEspeciales.atmosferasHumidas) {
      dibujarX(x43 - 8, y43 - 0.5);
    }

    // Fila 20 - Solo la parte izquierda se extiende verticalmente
    const alturaExtendida = filaAltura * 4; // Cuadruplicar la altura para alinearse con las 4 filas de la derecha
    
    // Líneas de la celda izquierda (extendida)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaExtendida); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + alturaExtendida); // Línea divisoria central
    
    // Líneas de la celda derecha (altura normal)
     doc.line(tablaInicioX + 175, yPos, tablaInicioX + 175, yPos + filaAltura); // Segunda división
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    
    // Líneas horizontales
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX + tablaAncho/2, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior de la celda derecha
    doc.line(tablaInicioX, yPos + alturaExtendida, tablaInicioX + tablaAncho/2, yPos + alturaExtendida); // Línea inferior de la celda izquierda
    
    yPos += alturaExtendida;
 
     // Contenido de la nueva fila - tres textos con coordenadas independientes
     doc.setFont("helvetica", "normal").setFontSize(7); // Font size 7 para todos los textos

      // Ancho disponible para el texto dentro de la celda izquierda
      const anchoDisponible = (tablaInicioX + tablaAncho/2) - 12 - 2; // Ancho de la celda izquierda menos padding
      
      // Primer texto de la nueva fila - Ligero
      const x44 = 12; // Posición X independiente
      let yActual = yPos - alturaExtendida + 3; // Posición Y inicial
      const textoLigero = "Ligero: Sentado mientras escribe, tipea, manejo, manual de cargas ligero (<3 mets)";
      const lineasLigero = doc.splitTextToSize(textoLigero, anchoDisponible);
      doc.text(lineasLigero, x44, yActual);
      yActual += lineasLigero.length * 2.5 + 1; // Espaciado entre textos

      // Segundo texto de la nueva fila - Moderado
      const x45 = 12; // Posición X independiente
      const textoModerado = "Moderado: Manejo manual de cargas menos de 15 Kg, operando equipos (<5 mets)";
      const lineasModerado = doc.splitTextToSize(textoModerado, anchoDisponible);
      doc.text(lineasModerado, x45, yActual);
      yActual += lineasModerado.length * 2.5 + 1; // Espaciado entre textos

      // Tercer texto de la nueva fila - Pesado
      const x46 = 12; // Posición X independiente
      const textoPesado = "Pesado: manejo de cargas encima de 25 Kg, subiendo escaleras con carga, palaneando (>5 mets)";
      const lineasPesado = doc.splitTextToSize(textoPesado, anchoDisponible);
      doc.text(lineasPesado, x46, yActual);

     // Segundo texto de la nueva fila (celda derecha con altura normal)
     const x47 = 110; // Posición X independiente
     const y47 = yPos - alturaExtendida + 3; // Posición Y para la celda derecha (altura normal)
     doc.setFont("helvetica", "normal").setFontSize(7);
     doc.text("Espacios confirmados", x47, y47);
     if (datosFinales.condicionesEspeciales.espaciosConfirmados) {
       dibujarX(x47 - 8, y47 - 0.5);
     }

    // Fila 21 - Solo parte derecha
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura, tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos - alturaExtendida + filaAltura, tablaInicioX + 175, yPos - alturaExtendida + filaAltura + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura + filaAltura); // Línea derecha
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura); // Línea superior
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura + filaAltura, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura + filaAltura); // Línea inferior

     // Contenido de la fila 21
     doc.setFont("helvetica", "normal").setFontSize(7);
    const x48 = 110; // Posición X independiente
    const y48 = yPos - alturaExtendida + filaAltura + 3; // Posición Y para la celda derecha
    doc.text("Atmosferas IDLH", x48, y48);
    if (datosFinales.condicionesEspeciales.atmosferasIDLH) {
      dibujarX(x48 - 8, y48 - 0.5);
    }

    // Fila 22 - Solo parte derecha
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura * 2, tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura * 2 + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos - alturaExtendida + filaAltura * 2, tablaInicioX + 175, yPos - alturaExtendida + filaAltura * 2 + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura * 2, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura * 2 + filaAltura); // Línea derecha
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura * 2, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura * 2); // Línea superior
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura * 2 + filaAltura, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura * 2 + filaAltura); // Línea inferior

    // Contenido de la fila 22
    doc.setFont("helvetica", "normal").setFontSize(7);
    const x49 = 110; // Posición X independiente
    const y49 = yPos - alturaExtendida + filaAltura * 2 + 3; // Posición Y para la celda derecha
    doc.text("Hazmat / Fuego / Rescate Mina", x49, y49);
    if (datosFinales.condicionesEspeciales.hazmatFuegoRescate) {
      dibujarX(x49 - 8, y49 - 0.5);
    }

    // Fila 23 - Solo parte derecha
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura * 3, tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura * 3 + filaAltura); // Línea divisoria central
    doc.line(tablaInicioX + 175, yPos - alturaExtendida + filaAltura * 3, tablaInicioX + 175, yPos - alturaExtendida + filaAltura * 3 + filaAltura); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura * 3, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura * 3 + filaAltura); // Línea derecha
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura * 3, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura * 3); // Línea superior
    doc.line(tablaInicioX + tablaAncho/2, yPos - alturaExtendida + filaAltura * 3 + filaAltura, tablaInicioX + tablaAncho, yPos - alturaExtendida + filaAltura * 3 + filaAltura); // Línea inferior

    // Contenido de la fila 23
    doc.setFont("helvetica", "normal").setFontSize(7);
    const x50 = 110; // Posición X independiente
    const y50 = yPos - alturaExtendida + filaAltura * 3 + 3; // Posición Y para la celda derecha
    doc.text("Temperaturas Extremas", x50, y50);
    if (datosFinales.condicionesEspeciales.temperaturasExtremasTrabajo) {
      dibujarX(x50 - 8, y50 - 0.5);
    }

    // Fila 24 - Fila completa de borde a borde (sin divisiones) - DINÁMICA
    const textoOtros = "Otros: " + (datosFinales.otros || "");
    const anchoDisponibleOtros = tablaAncho - 24; // Ancho total menos padding
    const lineasOtros = doc.splitTextToSize(textoOtros, anchoDisponibleOtros);
    const alturaDinamicaOtros = Math.max(filaAltura, lineasOtros.length * 2.5 + 2); // Altura mínima de fila o según contenido
    
    // Dibujar líneas de la fila dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaOtros); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtros); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaDinamicaOtros, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtros); // Línea inferior
    yPos += alturaDinamicaOtros;

    // Contenido de la fila 24
     doc.setFont("helvetica", "normal").setFontSize(7);
    const x51 = 12; // Posición X independiente
    const y51 = yPos - alturaDinamicaOtros + 3; // Posición Y ajustada para la fila dinámica
    doc.text(lineasOtros, x51, y51);

    // === SECCIÓN 7.2: EVALUACIÓN PERSONAL DEL EMPLEADO ===
    yPos = dibujarHeaderSeccion("7.2 Ficha: Evaluación Personal del Empleado (llenado por el trabajador)", yPos, filaAltura);

    // === SECCIÓN CON FONDO NARANJA ===
    const textoInstrucciones = "Sección 1: Las Preguntas de la 1 a 8 deben ser respondidas por los empleados que usarán cualquier respirador. Por favor colocar \"SI\" o \"No\"";
    
    // Calcular altura dinámica para las instrucciones
    const calcularAlturaInstrucciones = (texto, anchoMaximo, fontSize) => {
      const lineasDivididas = doc.splitTextToSize(texto, anchoMaximo);
      
      // Altura muy reducida: mínima de 4mm, máxima de 8mm
      return Math.max(lineasDivididas.length * fontSize * 0.25 + 1.5, 4);
    };

    const anchoMaximoInstrucciones = tablaAncho - 8;
    const alturaFilaInstrucciones = calcularAlturaInstrucciones(textoInstrucciones, anchoMaximoInstrucciones, 8);

    // Dibujar fondo naranja para las instrucciones
    doc.setFillColor(245, 174, 103); // Color naranja (mismo que Anexo16A)
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaInstrucciones, 'F');

    // Dibujar líneas de las instrucciones
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaInstrucciones); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaInstrucciones); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaInstrucciones, tablaInicioX + tablaAncho, yPos + alturaFilaInstrucciones); // Línea inferior

    // Dibujar el texto de las instrucciones
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineasDivididas = doc.splitTextToSize(textoInstrucciones, anchoMaximoInstrucciones);
    let yInstrucciones = yPos + 3;
    
    lineasDivididas.forEach(linea => {
      doc.text(linea, tablaInicioX + 4, yInstrucciones);
      yInstrucciones += 3.5;
    });

    yPos += alturaFilaInstrucciones;

    // === HEADER SI/NO ===
    // Fila header con SI/NO (similar a Anexo16A)
    const dibujarHeaderSiNo = (yPos, alturaFila = 3.5) => { // Altura reducida de 5 a 3.5
      const leftMargin = tablaInicioX;
      const colTexto = 170;
      const colNo = 10;
      const colSi = 10;
      
      // Configurar líneas con grosor consistente
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      
      // Dibujar fondo gris para el header
      doc.setFillColor(160, 160, 160);
      doc.rect(leftMargin, yPos, colTexto + colNo + colSi, alturaFila, 'F');
      
      // Líneas del header
      doc.line(leftMargin, yPos, leftMargin + colTexto + colNo + colSi, yPos); // Superior
      doc.line(leftMargin, yPos + alturaFila, leftMargin + colTexto + colNo + colSi, yPos + alturaFila); // Inferior
      doc.line(leftMargin, yPos, leftMargin, yPos + alturaFila); // Izquierda
      doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + alturaFila); // División texto/opciones
      doc.line(leftMargin + colTexto + colNo, yPos, leftMargin + colTexto + colNo, yPos + alturaFila); // División NO/SI
      doc.line(leftMargin + colTexto + colNo + colSi, yPos, leftMargin + colTexto + colNo + colSi, yPos + alturaFila); // Derecha

      // Texto SI y NO centrados con font size 7
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.text("SI", leftMargin + colTexto + colNo/2, yPos + 2.5, { align: "center" }); // Ajustado para altura reducida
      doc.text("NO", leftMargin + colTexto + colNo + colSi/2, yPos + 2.5, { align: "center" }); // Ajustado para altura reducida

      return yPos + alturaFila;
    };

    // Dibujar header SI/NO
    yPos = dibujarHeaderSiNo(yPos);

    // === FILAS SI/NO ===
    // Función para dibujar filas con SI/NO (similar a Anexo16A)
    const dibujarFilaSiNo = (texto, yPos, alturaFila = 3.5) => { // Altura reducida de 5 a 3.5
      const leftMargin = tablaInicioX;
      const colTexto = 170;
      const colNo = 10;
      const colSi = 10;
      
      // Configurar líneas con grosor consistente
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      
      // Líneas de la fila
      doc.line(leftMargin, yPos, leftMargin + colTexto + colNo + colSi, yPos); // Superior
      doc.line(leftMargin, yPos + alturaFila, leftMargin + colTexto + colNo + colSi, yPos + alturaFila); // Inferior
      doc.line(leftMargin, yPos, leftMargin, yPos + alturaFila); // Izquierda
      doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + alturaFila); // División texto/opciones
      doc.line(leftMargin + colTexto + colNo, yPos, leftMargin + colTexto + colNo, yPos + alturaFila); // División NO/SI
      doc.line(leftMargin + colTexto + colNo + colSi, yPos, leftMargin + colTexto + colNo + colSi, yPos + alturaFila); // Derecha

      // Texto con font size 7
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(texto, leftMargin + 2, yPos + 2.5); // Ajustado para la altura reducida

      return yPos + alturaFila;
    };

    // Fila 1: ¿Fuma o fumó en el último mes?
    yPos = dibujarFilaSiNo("¿Fuma o fumó en el último mes?", yPos);

    // === PREGUNTA 2 ===
    // Header de pregunta 2 con fondo gris
    yPos = dibujarHeaderSeccion("2. ¿Ha tenido alguna vez cualquiera de las siguientes condiciones?", yPos, filaAltura);

    // Opciones de la pregunta 2
    yPos = dibujarFilaSiNo("Palpitaciones.", yPos);
    yPos = dibujarFilaSiNo("Convulsiones.", yPos);
    yPos = dibujarFilaSiNo("Diabetes.", yPos);
    yPos = dibujarFilaSiNo("Reacciones.", yPos);
    yPos = dibujarFilaSiNo("Claustrofobia.", yPos);

    // === PREGUNTA 3 ===
    // Header de pregunta 3 con fondo gris
    yPos = dibujarHeaderSeccion("3. ¿Ha tenido alguna vez algunas de los siguientes problemas pulmonares o de pulmón?", yPos, filaAltura);

    // Opciones de la pregunta 3
    yPos = dibujarFilaSiNo("Asbestosis", yPos);
    yPos = dibujarFilaSiNo("Asma", yPos);
    yPos = dibujarFilaSiNo("Bronquitis Crónica", yPos);
    yPos = dibujarFilaSiNo("Enfisema.", yPos);
    yPos = dibujarFilaSiNo("Neumonía", yPos);
    yPos = dibujarFilaSiNo("Tuberculosis.", yPos);
    yPos = dibujarFilaSiNo("Silicosis.", yPos);
    yPos = dibujarFilaSiNo("Neumotórax (pulmón colapsado).", yPos);
    yPos = dibujarFilaSiNo("Cáncer al pulmón.", yPos);
    yPos = dibujarFilaSiNo("Costillas fracturadas.", yPos);
    yPos = dibujarFilaSiNo("Cualquier lesión al pulmón o cirugías al pulmón.", yPos);
    // Fila Otros para condiciones pulmonares
    yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otrosPulmon || ""), yPos);

    yPos = dibujarHeaderSeccion("4. ¿Tiene algunos de los siguientes síntomas pulmonares o de enfermedades al pulmón?", yPos, filaAltura);
      
    yPos = dibujarFilaSiNo("Dificultad para respirar en reposos", yPos);
    yPos = dibujarFilaSiNo("Dificultad para respirar cuando camina a nivel del suelo.", yPos);
    yPos = dibujarFilaSiNo("Dificultad para respirar cuando camina en un inclinado.", yPos);
    yPos = dibujarFilaSiNo("Dificultad para respirar cuando realiza alguna tarea.", yPos);
    yPos = dibujarFilaSiNo("Tos que le produce expectoración.", yPos);
    
    // === FOOTER PÁGINA 1 ===
    footerTR(doc, { footerOffsetY: 8});
    
    // === CREAR SEGUNDA PÁGINA ===
    // Forzar creación de segunda página para las preguntas adicionales
    doc.addPage();
    numeroPagina = 2;
    yPos = 30; // Posición inicial de la nueva página
    
    // Dibujar header en la nueva página
    drawHeader(numeroPagina);

    // === CONTENIDO DE LA SEGUNDA PÁGINA ===
    // === PREGUNTA 4 ===
   
      yPos = dibujarFilaSiNo("Tos que lo despierta temprano por la mañana.", yPos);
      yPos = dibujarFilaSiNo("Tos que ocurre cuando se encuentra echado", yPos);
      yPos = dibujarFilaSiNo("Tos con sangre.", yPos);
      yPos = dibujarFilaSiNo("Silbidos del pecho cuando respira.", yPos);
      yPos = dibujarFilaSiNo("Dolor en el pecho cuando respira profundamente.", yPos);
      // Fila Otros para síntomas pulmonares
      yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otrosPulmon || ""), yPos);

      // === PREGUNTA 5 ===
      yPos = dibujarHeaderSeccion("5. ¿Ha tenido alguna vez cualquiera de los siguientes problemas cardiovasculares?", yPos, filaAltura);
      
      yPos = dibujarFilaSiNo("Infarto.", yPos);
      yPos = dibujarFilaSiNo("Angina.", yPos);
      yPos = dibujarFilaSiNo("Insuficiencia cardiaca.", yPos);
      yPos = dibujarFilaSiNo("Hinchazón en las piernas/pies (no causado por caminar).", yPos);
      yPos = dibujarFilaSiNo("Arritmia al corazón.", yPos);
      yPos = dibujarFilaSiNo("Reflujo gastroesofágico (no relacionado con la comida).", yPos);
      // Fila Otros para problemas cardiovasculares
      yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otrosCardiovascular || ""), yPos);


      // === PREGUNTA 6 ===
      yPos = dibujarHeaderSeccion("6. ¿Ha tenido alguna vez cualquiera de los siguientes síntomas cardiovasculares?", yPos, filaAltura);
      
      yPos = dibujarFilaSiNo("Dolor o presión en su pecho", yPos);
      yPos = dibujarFilaSiNo("Dolor/presión en su pecho durante actividad física.", yPos);
      yPos = dibujarFilaSiNo("Dolor/presión en su pecho durante su actividad de trabajo.", yPos);
      yPos = dibujarFilaSiNo("Palpitaciones.", yPos);
      yPos = dibujarFilaSiNo("Acidez estomacal o indigestión (no relacionado con la comida).", yPos);
      // Fila Otros para síntomas cardiovasculares
      yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otrosCardiovascular || ""), yPos);


      // === PREGUNTA 7 ===
      yPos = dibujarHeaderSeccion("7. ¿Toma actualmente medicinas para cualquiera de las siguientes condiciones?", yPos, filaAltura);
      yPos = dibujarFilaSiNo("Problema respiratorio", yPos);
      yPos = dibujarFilaSiNo("Problemas al corazón.", yPos);
      yPos = dibujarFilaSiNo("Presión Sanguínea.", yPos);
      yPos = dibujarFilaSiNo("Convulsiones.", yPos);

       // === PREGUNTA 8 ===
       yPos = dibujarHeaderSeccion("8. ¿Si ha utilizado un respirador, ha tenido usted alguno de los siguientes problemas?", yPos, filaAltura);
       yPos = dibujarFilaSiNo("Irritación a los ojos.", yPos);
       yPos = dibujarFilaSiNo("Alergias a la piel o erupciones.", yPos);
       yPos = dibujarFilaSiNo("Ansiedad", yPos);
       yPos = dibujarFilaSiNo("Fatiga o debilidad.", yPos);
       yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otros || ""), yPos);

      

        // === SECCIÓN 2 CON FONDO NARANJA ===
        const textoInstruccionesSeccion2 = "Sección 2 (Discrecional): Las preguntas de la 9 a la 14 deben ser contestadas por empleados que han sido seleccionados para usar un respirador de cara completa o un aparato de respiración autónomo (SCBA); para los empleados que han sido seleccionados para utilizar otros tipos de respiradores, contestar a estas preguntas de manera voluntaria; por favor, marque \"SI\" o \"NO\".";
        
        // Calcular altura dinámica para las instrucciones de la sección 2
        const calcularAlturaInstruccionesSeccion2 = (texto, anchoMaximo, fontSize) => {
          const lineasDivididas = doc.splitTextToSize(texto, anchoMaximo);
          
          // Altura aumentada para evitar que se corte el texto
          return Math.max(lineasDivididas.length * fontSize * 0.4 + 3, 8);
        };

        const anchoMaximoInstruccionesSeccion2 = tablaAncho - 8;
        const alturaFilaInstruccionesSeccion2 = calcularAlturaInstruccionesSeccion2(textoInstruccionesSeccion2, anchoMaximoInstruccionesSeccion2, 8);

        // Dibujar fondo naranja para las instrucciones de la sección 2
        doc.setFillColor(245, 174, 103); // Color naranja (mismo que Anexo16A)
        doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaInstruccionesSeccion2, 'F');

        // Dibujar líneas de las instrucciones de la sección 2
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaInstruccionesSeccion2); // Línea izquierda
        doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaInstruccionesSeccion2); // Línea derecha
        doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
        doc.line(tablaInicioX, yPos + alturaFilaInstruccionesSeccion2, tablaInicioX + tablaAncho, yPos + alturaFilaInstruccionesSeccion2); // Línea inferior

        // Dibujar el texto de las instrucciones de la sección 2
        doc.setFont("helvetica", "normal").setFontSize(7);
        const lineasDivididasSeccion2 = doc.splitTextToSize(textoInstruccionesSeccion2, anchoMaximoInstruccionesSeccion2);
        let yInstruccionesSeccion2 = yPos + 3;
        
        lineasDivididasSeccion2.forEach(linea => {
          doc.text(linea, tablaInicioX + 4, yInstruccionesSeccion2);
          yInstruccionesSeccion2 += 3.5;
        });

        yPos += alturaFilaInstruccionesSeccion2;

        // === PREGUNTA 9 ===
        yPos = dibujarHeaderSeccion("9. ¿Ha perdido la visión en cualquier ojo(temporal o permanente)?", yPos, filaAltura);
        
        // Fila vacía para pregunta 9 con columnas SI/NO
        yPos = dibujarFilaSiNo("", yPos);

        // === PREGUNTA 10 ===
        yPos = dibujarHeaderSeccion("10. ¿Usa actualmente lentes de contacto?", yPos, filaAltura);
        yPos = dibujarFilaSiNo("Usa lentes de contacto", yPos);
        yPos = dibujarFilaSiNo("Usa lentes.", yPos);
        yPos = dibujarFilaSiNo("Daltonismo", yPos);
        yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otros || ""), yPos);

        // === PREGUNTA 11 ===
        yPos = dibujarHeaderSeccion("11. ¿Ha tenido alguna lesión a sus oídos, incluyendo un tímpano roto?", yPos, filaAltura);
        
        // Fila vacía para pregunta 11 con columnas SI/NO
        yPos = dibujarFilaSiNo("", yPos);

        // === PREGUNTA 12 ===
        yPos = dibujarHeaderSeccion("12. ¿Tiene actualmente algunos de los siguientes problemas de audición?", yPos, filaAltura);
        yPos = dibujarFilaSiNo("Dificultad para escuchar.", yPos);
        yPos = dibujarFilaSiNo("Usa un audífono.", yPos);
        yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otros || ""), yPos);

        // === PREGUNTA 13 ===
        yPos = dibujarHeaderSeccion("13. ¿Ha tenido alguna lesión a la espalda?", yPos, filaAltura);
        
        // Fila vacía para pregunta 13 con columnas SI/NO
        yPos = dibujarFilaSiNo("", yPos);
        
        // === PREGUNTA 14 ===
        yPos = dibujarHeaderSeccion("14. ¿Tiene actualmente algunos de los siguientes problemas musculoesqueléticos?", yPos, filaAltura);
        yPos = dibujarFilaSiNo("Debilidad en los brazos, manos, piernas o pies.", yPos);
        yPos = dibujarFilaSiNo("Dolor de espalda", yPos);
        yPos = dibujarFilaSiNo("Dificultad para mover sus brazos y piernas.", yPos);
        yPos = dibujarFilaSiNo("Dolor o rigidez cuando se inclina hacia adelante o atrás en la cintura", yPos);
        yPos = dibujarFilaSiNo("Dificultad para mover su cabeza de arriba o abajo.", yPos);
        yPos = dibujarFilaSiNo("Dificultad para mover su cabeza de lado a lado.", yPos);
        yPos = dibujarFilaSiNo("Dificultad al doblar las rodillas", yPos);
        yPos = dibujarFilaSiNo("Dificultad en ponerse en cuclillas.", yPos);
        yPos = dibujarFilaSiNo("Subir las escaleras o una escalera", yPos);
         yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otros || ""), yPos);

    // === CREAR TERCERA PÁGINA ===
    // Forzar creación de tercera página para la sección 3
    doc.addPage();
    numeroPagina = 3;
    yPos = 30; // Posición inicial de la nueva página
    
    // Dibujar header en la nueva página
    drawHeader(numeroPagina);

    // === SECCIÓN 3 CON FONDO NARANJA ===
    const textoInstruccionesSeccion3 = "Sección 3: (Confidencial) El profesional de la salud que va a revisar este cuestionario determinara si esta parte debe ser completada por el empleado. Por favor, marque \"SI\" o \"NO\"";
    
    // Calcular altura dinámica para las instrucciones de la sección 3
    const calcularAlturaInstruccionesSeccion3 = (texto, anchoMaximo, fontSize) => {
      const lineasDivididas = doc.splitTextToSize(texto, anchoMaximo);
      
      // Altura muy reducida: mínima de 4mm, máxima de 6mm
      return Math.max(lineasDivididas.length * fontSize * 0.2 + 1.5, 4);
    };

    const anchoMaximoInstruccionesSeccion3 = tablaAncho - 8;
    const alturaFilaInstruccionesSeccion3 = calcularAlturaInstruccionesSeccion3(textoInstruccionesSeccion3, anchoMaximoInstruccionesSeccion3, 8);

    // Dibujar fondo naranja para las instrucciones de la sección 3
    doc.setFillColor(245, 174, 103); // Color naranja (mismo que Anexo16A)
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaInstruccionesSeccion3, 'F');

    // Dibujar líneas de las instrucciones de la sección 3
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaInstruccionesSeccion3); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaInstruccionesSeccion3); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaInstruccionesSeccion3, tablaInicioX + tablaAncho, yPos + alturaFilaInstruccionesSeccion3); // Línea inferior

    // Dibujar el texto de las instrucciones de la sección 3
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineasDivididasSeccion3 = doc.splitTextToSize(textoInstruccionesSeccion3, anchoMaximoInstruccionesSeccion3);
    let yInstruccionesSeccion3 = yPos + 3;
    
    lineasDivididasSeccion3.forEach(linea => {
      doc.text(linea, tablaInicioX + 4, yInstruccionesSeccion3);
      yInstruccionesSeccion3 += 3.5;
    });

    yPos += alturaFilaInstruccionesSeccion3;

    // === PREGUNTA 1 DE LA SECCIÓN 3 ===
    // Crear fila con altura extendida para el texto largo
    const alturaFilaExtendida = filaAltura * 2; // Doblar la altura
    
    // Dibujar líneas de la fila extendida
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaExtendida); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaExtendida); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaExtendida, tablaInicioX + tablaAncho, yPos + alturaFilaExtendida); // Línea inferior
    
    // Dibujar fondo gris para el header
    doc.setFillColor(160, 160, 160);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaExtendida, 'F');
    
    // Dibujar el texto con salto de línea
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    
    const textoPregunta1 = "1. Cuando trabaja en alturas por encima de 2500 msnm en una atmosfera con oxigeno menor al normal, tiene las siguientes sensaciones de:";
    const anchoMaximoPregunta1 = tablaAncho - 8;
    const lineasPregunta1 = doc.splitTextToSize(textoPregunta1, anchoMaximoPregunta1);
    
    let yTextoPregunta1 = yPos + 3;
    lineasPregunta1.forEach(linea => {
      doc.text(linea, tablaInicioX + 2, yTextoPregunta1);
      yTextoPregunta1 += 3.5;
    });
    
    yPos += alturaFilaExtendida;
    
    // Opciones de la pregunta 1
    yPos = dibujarFilaSiNo("Mareos.", yPos);
    yPos = dibujarFilaSiNo("Dificultad para respirar.", yPos);
    yPos = dibujarFilaSiNo("Palpitaciones.", yPos);
    yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otros || ""), yPos);

    // === PREGUNTA 2 DE LA SECCIÓN 3 ===
    yPos = dibujarHeaderSeccion("2. Ha trabajado con alguno de los siguientes materiales listados a continuación:", yPos, filaAltura);
    
    // Opciones de la pregunta 2
    yPos = dibujarFilaSiNo("Asbestos.", yPos);
    yPos = dibujarFilaSiNo("Sílice.", yPos);
    yPos = dibujarFilaSiNo("Tungsteno / Cobalto (Ej.: Esmerilado o soldadura)", yPos);
    yPos = dibujarFilaSiNo("Berilio", yPos);
    yPos = dibujarFilaSiNo("Aluminio.", yPos);
    yPos = dibujarFilaSiNo("Carbón.", yPos);
    yPos = dibujarFilaSiNo("Hierro.", yPos);
    yPos = dibujarFilaSiNo("Latón.", yPos);
    yPos = dibujarFilaSiNo("Ambientes con exceso de polvo.", yPos);
    yPos = dibujarFilaSiNo("Otros: " + (datosFinales.otros || ""), yPos);

    // === PREGUNTA 3 DE LA SECCIÓN 3 ===
    yPos = dibujarHeaderSeccion("3. Liste cualquier trabajo previo/pasatiempo en los que haya sido expuestos a peligros respiratorios:", yPos, filaAltura);
    
    // Fila dinámica para la pregunta 3
    const textoPregunta3 = "Trabajos previos/pasatiempos con exposición a peligros respiratorios: " + (datosFinales.otros || "");
    const anchoDisponiblePregunta3 = tablaAncho - 24;
    const lineasPregunta3 = doc.splitTextToSize(textoPregunta3, anchoDisponiblePregunta3);
    const alturaDinamicaPregunta3 = Math.max(filaAltura, lineasPregunta3.length * 2.5 + 2);
    
    // Dibujar líneas de la fila dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaPregunta3); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaPregunta3); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaDinamicaPregunta3, tablaInicioX + tablaAncho, yPos + alturaDinamicaPregunta3); // Línea inferior
    yPos += alturaDinamicaPregunta3;

    // Contenido de la fila dinámica
    doc.setFont("helvetica", "normal").setFontSize(7);
    const xPregunta3 = 12;
    const yPregunta3 = yPos - alturaDinamicaPregunta3 + 3;
    doc.text(lineasPregunta3, xPregunta3, yPregunta3);

    // === PREGUNTA 4 DE LA SECCIÓN 3 ===
    yPos = dibujarHeaderSeccion("4. ¿Has hecho alguna vez Servicio Militar?", yPos, filaAltura);
    
    // Fila vacía para pregunta 4 con columnas SI/NO
    yPos = dibujarFilaSiNo("", yPos);

    // === PREGUNTA 5 DE LA SECCIÓN 3 ===
    yPos = dibujarHeaderSeccion("5. ¿Has estado alguna vez en un equipo de MATPEL o Respuesta De Emergencias?", yPos, filaAltura);
    
    // Fila vacía para pregunta 5 con columnas SI/NO
    yPos = dibujarFilaSiNo("", yPos);

    // === SECCIÓN 7.3: AUTORIZACIÓN PARA EL USO DE RESPIRADORES ===
    yPos = dibujarHeaderSeccion("7.3 Ficha: Autorización para el uso de Respiradores", yPos, filaAltura);

    // === FILA 1: ID EMPLEADO Y MINERA BARRICK ===
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // División central
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
     yPos += filaAltura;

    // Contenido de la fila 1
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("ID Empleado:", tablaInicioX + 2, yPos - 1.5);
    doc.text(datosFinales.numeroFicha, tablaInicioX + 25, yPos - 1.5);
    doc.text("Minera Barrick:", tablaInicioX + tablaAncho/2 + 2, yPos - 1.5);
    doc.text(datosFinales.empresa, tablaInicioX + tablaAncho/2 + 35, yPos - 1.5);

    // === FILA 2: TRABAJADOR Y ÁREA ===
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // División central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la fila 2
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Trabajador:", tablaInicioX + 2, yPos - 1.5);
    doc.text(datosFinales.apellidosNombres, tablaInicioX + 25, yPos - 1.5);
    doc.text("Área:", tablaInicioX + tablaAncho/2 + 2, yPos - 1.5);
    doc.text(datosFinales.areaTrabajo, tablaInicioX + tablaAncho/2 + 15, yPos - 1.5);

    // === FILA 3: CARGO Y SUPERVISOR ===
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // División central
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
     doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
     yPos += filaAltura;

    // Contenido de la fila 3
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Cargo:", tablaInicioX + 2, yPos - 1.5);
    doc.text(datosFinales.puestoTrabajo, tablaInicioX + 20, yPos - 1.5);
    doc.text("Supervisor:", tablaInicioX + tablaAncho/2 + 2, yPos - 1.5);
    // Campo vacío para supervisor

    // === SECCIÓN CON FONDO NARANJA - EVALUACIÓN MÉDICA ===
    const textoEvaluacionMedica = "El trabajador mencionado ha sido examinado en el ajuste del respirador de conformidad con el Estándar de Barrick de Protección Respiratoria. Esta evaluación limitada es especificada para el uso del respirador solamente. Basado en mis hallazgos he determinado que la persona:";
    
    // Calcular altura dinámica para la evaluación médica
    const calcularAlturaEvaluacionMedica = (texto, anchoMaximo, fontSize) => {
      const lineasDivididas = doc.splitTextToSize(texto, anchoMaximo);
      
      // Altura aumentada para evitar que se corte el texto
      return Math.max(lineasDivididas.length * fontSize * 0.4 + 3, 8);
    };

    const anchoMaximoEvaluacionMedica = tablaAncho - 8;
    const alturaFilaEvaluacionMedica = calcularAlturaEvaluacionMedica(textoEvaluacionMedica, anchoMaximoEvaluacionMedica, 8);

    // Dibujar fondo naranja para la evaluación médica
    doc.setFillColor(245, 174, 103); // Color naranja (mismo que Anexo16A)
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaEvaluacionMedica, 'F');

    // Dibujar líneas de la evaluación médica
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaEvaluacionMedica); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacionMedica); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaEvaluacionMedica, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacionMedica); // Línea inferior

    // Dibujar el texto de la evaluación médica
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineasDivididasEvaluacionMedica = doc.splitTextToSize(textoEvaluacionMedica, anchoMaximoEvaluacionMedica);
    let yEvaluacionMedica = yPos + 3;
    
    lineasDivididasEvaluacionMedica.forEach(linea => {
      doc.text(linea, tablaInicioX + 4, yEvaluacionMedica);
      yEvaluacionMedica += 3.5;
    });

    yPos += alturaFilaEvaluacionMedica;

    // === OPCIONES DE CLASIFICACIÓN MÉDICA ===
    // Función para dibujar filas con una sola división (para marcar X)
    const dibujarFilaConUnaDivision = (texto, yPos, alturaFila = 3.5) => {
      const leftMargin = tablaInicioX;
      const colTexto = 180; // Aumentado de 170 a 185 (15 puntos más)
      const colX = 10; // Reducido de 20 a 5 para compensar
      
      // Configurar líneas con grosor consistente
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      
      // Líneas de la fila
      doc.line(leftMargin, yPos, leftMargin + colTexto + colX, yPos); // Superior
      doc.line(leftMargin, yPos + alturaFila, leftMargin + colTexto + colX, yPos + alturaFila); // Inferior
      doc.line(leftMargin, yPos, leftMargin, yPos + alturaFila); // Izquierda
      doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + alturaFila); // División texto/X
      doc.line(leftMargin + colTexto + colX, yPos, leftMargin + colTexto + colX, yPos + alturaFila); // Derecha

      // Texto con font size 7
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(texto, leftMargin + 2, yPos + 2.5);

      return yPos + alturaFila;
    };

    // Clase I - Sin restricciones
    yPos = dibujarFilaConUnaDivision("Clase I – Sin restricciones en el uso del Respirador.", yPos);
    
    // Clase II - Uso condicional
    yPos = dibujarFilaConUnaDivision("Clase II – Uso condicional: Algunos usos específicos para los respiradores.", yPos);
    
    // Sub-opciones de Clase II
    yPos = dibujarFilaConUnaDivision("         -A ser utilizados en respuestas a emergencia o para escape solamente", yPos);
    yPos = dibujarFilaConUnaDivision("          -Solo PAPR.", yPos);
    yPos = dibujarFilaConUnaDivision("          -No SBCA", yPos);
    yPos = dibujarFilaConUnaDivision("          -otros", yPos);
    
    // Clase III - No se permite
    yPos = dibujarFilaConUnaDivision("Clase III – NO SE PERMITE el uso de", yPos);
    
    // Clase IV - Examen médico exhaustivo
    yPos = dibujarFilaConUnaDivision("Clase IV – El empleado deberá programar un examen médico exhaustivo antes de probar y emplear un respirador", yPos);
    
    // Clase V - Restricciones adicionales
    yPos = dibujarFilaConUnaDivision("Clase V – Restricciones adicionales temporales / permanentes (sin respirador)", yPos);

    // === FILA DE FECHAS ===
    // Fila con 2 columnas para fechas
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura); // División central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Contenido de la fila de fechas
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("FECHA DEL EXAMEN:", tablaInicioX + 2, yPos - 1.5);
    doc.text(datosFinales.fechaExamen, tablaInicioX + 35, yPos - 1.5);
    doc.text("EXPIRA EN:", tablaInicioX + tablaAncho/2 + 2, yPos - 1.5);
    doc.text(datosFinales.fechaExamen, tablaInicioX + tablaAncho/2 + 25, yPos - 1.5);

    // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
    const alturaSeccionDeclaracion = 30; // Altura para la sección de declaración
    
    // Dibujar las líneas de la sección de declaración (3 columnas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionDeclaracion); // Línea izquierda
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionDeclaracion); // Primera división
    doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionDeclaracion); // Segunda división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion); // Línea inferior

    // === COLUMNA 1: DECLARACIÓN ===
    doc.setFont("helvetica", "normal").setFontSize(6);
    const textoDeclaracion = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";
    
    // Función para justificar texto
    const justificarTexto = (texto, x, y, anchoMaximo, interlineado) => {
      const lineas = doc.splitTextToSize(texto, anchoMaximo);
      let yActual = y;
      
      lineas.forEach((linea, index) => {
        // Solo justificar si no es la última línea y tiene más de una palabra
        if (index < lineas.length - 1 && linea.includes(' ')) {
          const palabras = linea.split(' ');
          if (palabras.length > 1) {
            const anchoTexto = doc.getTextWidth(linea);
            const espacioDisponible = anchoMaximo - anchoTexto;
            const espaciosEntrePalabras = palabras.length - 1;
            const espacioExtra = espacioDisponible / espaciosEntrePalabras;
            
            let xActual = x;
            palabras.forEach((palabra, i) => {
              doc.text(palabra, xActual, yActual);
              if (i < palabras.length - 1) {
                const anchoPalabra = doc.getTextWidth(palabra);
                xActual += anchoPalabra + (doc.getTextWidth(' ') + espacioExtra);
              }
            });
          } else {
            doc.text(linea, x, yActual);
          }
        } else {
          doc.text(linea, x, yActual);
        }
        yActual += interlineado;
      });
    };
    
    // Dibujar texto justificado
    justificarTexto(textoDeclaracion, tablaInicioX + 2, yPos + 3, 55, 2.5);

    // === COLUMNA 2: FIRMA Y HUELLA DEL TRABAJADOR ===
    const firmaTrabajadorY = yPos + 3;
    
    // Calcular centro de la columna 2 para centrar las imágenes
    const centroColumna2X = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
    
    // Agregar firma del trabajador (lado izquierdo)
    const firmaTrabajadorUrl = getSign(data, "FIRMAP");
    if (firmaTrabajadorUrl) {
      try {
        const imgWidth = 30;
        const imgHeight = 20;
        const x = centroColumna2X - 20;
        const y = firmaTrabajadorY;
        doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
      } catch (error) {
        console.log("Error cargando firma del trabajador:", error);
      }
    }

    // Agregar huella del trabajador (lado derecho, vertical)
    const huellaTrabajadorUrl = getSign(data, "HUELLA");
    if (huellaTrabajadorUrl) {
      try {
        const imgWidth = 12;
        const imgHeight = 20;
        const x = centroColumna2X + 8;
        const y = firmaTrabajadorY;
        doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
      } catch (error) {
        console.log("Error cargando huella del trabajador:", error);
      }
    }
    
    doc.setFont("helvetica", "normal").setFontSize(7);
    const centroColumna2 = tablaInicioX + 60 + (60 / 2);
    doc.text("Firma y Huella del trabajador", centroColumna2, yPos + 26, { align: "center" });

    // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
    const firmaMedicoX = tablaInicioX + 125;
    const firmaMedicoY = yPos + 3;
    
    // Agregar firma y sello médico
    const firmaMedicoUrl = getSign(data, "SELLOFIRMA");
    if (firmaMedicoUrl) {
      try {
        const imgWidth = 50;
        const imgHeight = 20;
        const x = firmaMedicoX;
        const y = firmaMedicoY;
        doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
      } catch (error) {
        console.log("Error cargando firma del médico:", error);
      }
    }
    
    doc.setFont("helvetica", "normal").setFontSize(7);
    const centroColumna3 = tablaInicioX + 120 + (70 / 2);
    doc.text("Sello y Firma del Médico", centroColumna3, yPos + 26, { align: "center" });
    doc.text("Responsable de la Evaluación", centroColumna3, yPos + 28.5, { align: "center" });

    yPos += alturaSeccionDeclaracion;

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
