import jsPDF from "jspdf";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { normalizeList } from "../../utils/listUtils";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import footerTR from "../components/footerTR.jsx";

export default function Aptitud_medico_resumen_Digitalizado({ data = {} }) {
  useEffect(() => {
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();

    // Datos de prueba por defecto
    const datosPrueba = {
      numeroFicha: "000000",
      sede: "Trujillo-Piérola",
      fechaExamen: "01/01/2025",
      apellidosNombres: "APELLIDO PATERNO APELLIDO MATERNO NOMBRES",
      documentoIdentidad: "00000000",
      genero: "MASCULINO",
      edad: "00",
      fechaNacimiento: "01/01/1990",
      domicilio: "AV. EJEMPLO 123 - URB. DEMO",
      puestoTrabajo: "CARGO",
      areaTrabajo: "AREA",
      empresa: "EMPRESA S.A.C.",
      contratista: "CONTRATA S.A.C.",
      tipoExamen: "PRE-OCUPACIONAL",
      examenesRealizados: [
        "Radiografía de tórax",
        "Oftalmología",
        "Audiometría",
        "Electrocardiograma",
        "Laboratorio completo",
        "Espirometría",
        "Examen neurológico",
        "Examen cardiovascular",
        "Examen osteomuscular",
        "Examen dermatológico",
        "Examen psiquiátrico",
        "Tomografía computada",
        "Resonancia magnética",
        "Ultrasonido abdominal",
        "Pruebas de función hepática"
      ],
      resultadosResumen: "APTO",
      color: 1,
      codigoColor: "#008f39",
      textoColor: "F"
    };

    // Datos reales mapeados
    const datosReales = {
      numeroFicha: String(data.n_orden ?? data.norden_n_orden ?? ""),
      sede: data.sede || data.nombreSede || "",
      fechaExamen: formatearFechaCorta(data.fechaDesde ?? data.fechaExamen ?? data.fechaAnexo16a_fecha_anexo ?? ""),
      apellidosNombres: String((data.apellidosPaciente ?? data.apellidos_apellidos_pa ?? "") + " " + (data.nombresPaciente ?? data.nombres_nombres_pa ?? "")).trim(),
      documentoIdentidad: String(data.dniPaciente ?? data.dni_cod_pa ?? ""),
      genero: data.sexoPaciente === "M" ? "MASCULINO" : data.sexoPaciente === "F" ? "FEMENINO" : (data.sexo || data.sexo_sexo_pa || ""),
      edad: String(data.edadPaciente ?? data.edad_edad ?? ""),
      fechaNacimiento: formatearFechaCorta(data.fechaNacimiento ?? ""),
      domicilio: String(data.domicilio ?? ""),
      puestoTrabajo: String(data.puestoTrabajo ?? data.cargo_cargo_de ?? ""),
      areaTrabajo: String(data.areaTrabajo ?? data.area_area_o ?? ""),
      empresa: String(data.empresa ?? data.empresa_razon_empresa ?? ""),
      contratista: String(data.contrata ?? data.contrata_razon_contrata ?? ""),
      tipoExamen: String(data.nombreExamen ?? data.tipoExamen ?? ""),
      examenesRealizados: normalizeList(data.examenesRealizados),
      resultadosResumen: String(
        data.resultadosResumen ?? data.resultados ?? data.resultado ?? ""
      ),
      color: data.color || data.informacionSede?.color || 1,
      codigoColor: data.codigoColor || data.informacionSede?.codigoColor || "#008f39",
      textoColor: data.textoColor || data.informacionSede?.textoColor || "F"
    };

    // Usar datos reales si existen, sino usar datos de prueba
    const datosFinales = (data && (data.n_orden || data.norden_n_orden)) ? datosReales : datosPrueba;

    // Header reutilizable
    const drawHeader = (pageNumber) => {
      // Logo y membrete
      CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 6.5 });

      // Título principal (solo en página 1)
      if (pageNumber === 1) {
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("CONSTANCIA DE EXAMEN MEDICO OCUPACIONAL", pageW / 2, 28, { align: "center" });
      }

      // Número de Ficha y Página
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Nro de ficha: ", pageW - 80, 13);

      doc.setFont("helvetica", "normal").setFontSize(18);
      doc.text(datosFinales.numeroFicha || "", pageW - 60, 13);

      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Pag. " + "01", pageW - 30, 8);
      doc.text("Sede: " + (datosFinales.sede || ""), pageW - 80, 18);
      doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 80, 23);

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

    // Dibujar header
    drawHeader(1);

    // Parámetros de tabla
    const tablaInicioX = 10;
    const tablaInicioY = 33.5;
    const tablaAncho = 190;
    const filaAltura = 5;
    let yPos = tablaInicioY;

    // Header de sección filiación (datos personales)
    const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
      doc.setFillColor(160, 160, 160);
      doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, 'F');
      doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
      doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
      doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
      doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(titulo, tablaInicioX + 2, yPosLocal + 3);
      return yPosLocal + alturaHeader;
    };

    // Texto con salto de línea
    const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
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

    // Sección: 1. DATOS PERSONALES (FILIACIÓN)
    yPos = dibujarHeaderSeccion("1. AFILIACION (a partir del registro médico)", yPos, filaAltura);

    // Fila: Apellidos y Nombres con división para Tipo de examen
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
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

    // Fila: Domicilio (completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    yPos += filaAltura;

    // Fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
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

    // Contenido de la tabla (ubicar texto debajo del header gris)
    let yTexto = tablaInicioY + filaAltura + 2.5;

    // Apellidos y Nombres
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
    dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1, 95);

    // Columna derecha: Tipo de examen
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1);
    yTexto += filaAltura;

    // DNI, Edad, Sexo, Fecha Nac.
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text((datosFinales.edad ? (datosFinales.edad + " Años") : ""), tablaInicioX + 58, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.genero || datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
    yTexto += filaAltura;

    // Domicilio
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.domicilio || "", tablaInicioX + 25, yTexto + 1, 160);
    yTexto += filaAltura;

    // Puesto de Trabajo, Área de Trabajo
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1);
    yTexto += filaAltura;

    // Empresa
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1, 160);
    yTexto += filaAltura;

    // Contratista
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.contratista || datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
    yTexto += filaAltura;

    // ====================
    // 2. SECCIÓN DE EXÁMENES REALIZADOS
    // ====================
    // Header gris
    yPos = dibujarHeaderSeccion("2. HE PASADO EXAMEN MÉDICO EN POLICLÍNICO HORIZONTE MEDIC", yPos, filaAltura);

    // Fila: título "EXAMENES REALIZADOS"
    const alturaTituloExamenes = 4;
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTituloExamenes);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTituloExamenes);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaTituloExamenes, tablaInicioX + tablaAncho, yPos + alturaTituloExamenes);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("EXAMENES REALIZADOS", tablaInicioX + 2, yPos + 3);
    yPos += alturaTituloExamenes;

    // Lista dinámica de exámenes - todos en una sola fila
    const examenesLista = datosFinales.examenesRealizados || [];

    // Crear texto con todos los exámenes sin numeración y con saltos de línea
    const textoExamenes = examenesLista.length > 0 
      ? examenesLista.map((item) => String(item)).join('\n')
      : "Sin exámenes registrados";

    // Calcular altura dinámica para el texto de exámenes
    const calcularAlturaExamenes = (texto, anchoMaximo) => {
      // Primero dividir por saltos de línea para contar las líneas base
      const lineasBase = texto.split('\n');
      let totalLineas = 0;

      lineasBase.forEach(linea => {
        if (linea.trim() === '') {
          totalLineas += 1; // Línea vacía
          return;
        }

        const palabras = linea.split(' ');
        let lineaActual = '';
        let lineasEnEstaSeccion = 1;

        palabras.forEach(palabra => {
          const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
          const anchoTexto = doc.getTextWidth(textoPrueba);

          if (anchoTexto <= anchoMaximo) {
            lineaActual = textoPrueba;
          } else {
            if (lineaActual) {
              lineasEnEstaSeccion++;
              lineaActual = palabra;
            } else {
              lineasEnEstaSeccion++;
            }
          }
        });

        totalLineas += lineasEnEstaSeccion;
      });

      // Altura mínima de 8mm, con interlineado de 3.5mm para fuente 7
      const alturaCalculada = totalLineas * 3.5 + 4; // 3mm arriba + 1mm abajo de margen
      return Math.max(alturaCalculada, 8);
    };

    const anchoMaximoExamenes = tablaAncho - 4; // Ancho total menos márgenes
    const alturaFilaExamenes = calcularAlturaExamenes(textoExamenes, anchoMaximoExamenes);

    // Dibujar líneas de la fila de exámenes (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaExamenes); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaExamenes); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaExamenes, tablaInicioX + tablaAncho, yPos + alturaFilaExamenes); // Línea inferior

    // Contenido de la fila de exámenes
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    // Función específica para dibujar texto con fuente 7 y interlineado correcto
    const dibujarTextoConSaltoLineaFuente7 = (texto, x, y, anchoMaximo) => {
      // Primero dividir por saltos de línea para manejar cada línea numerada por separado
      const lineasBase = texto.split('\n');
      let yPos = y;

      lineasBase.forEach(linea => {
        if (linea.trim() === '') {
          yPos += 2.5; // Espacio para línea vacía
          return;
        }

        const palabras = linea.split(' ');
        let lineaActual = '';

        palabras.forEach(palabra => {
          const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
          const anchoTexto = doc.getTextWidth(textoPrueba);

          if (anchoTexto <= anchoMaximo) {
            lineaActual = textoPrueba;
          } else {
            if (lineaActual) {
              doc.text(lineaActual, x, yPos);
              yPos += 3.5; // Interlineado específico para fuente 7
              lineaActual = palabra;
            } else {
              doc.text(palabra, x, yPos);
              yPos += 3.5;
            }
          }
        });

        if (lineaActual) {
          doc.text(lineaActual, x, yPos);
          yPos += 3.5; // Interlineado después de cada línea
        }
      });

      return yPos;
    };
    
    dibujarTextoConSaltoLineaFuente7(textoExamenes, tablaInicioX + 2, yPos + 3, anchoMaximoExamenes);

    yPos += alturaFilaExamenes;

    // Fila final: Resultados
    const alturaResultados = 5;
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaResultados);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaResultados);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaResultados, tablaInicioX + tablaAncho, yPos + alturaResultados);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Resultados:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.resultadosResumen || "", tablaInicioX + 28, yPos + 3.5, tablaAncho - 30);
    yPos += alturaResultados;

    // Footer
    footerTR(doc, { footerOffsetY: 8 });

    // Imprimir
    imprimir(doc);
  }, [data]);

  return null;
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
Aptitud_medico_resumen_Digitalizado.propTypes = {
  data: PropTypes.object
};



