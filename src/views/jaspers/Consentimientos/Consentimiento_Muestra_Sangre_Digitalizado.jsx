import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import { dibujarFirmas } from "../../utils/dibujarFirmas.js";

export default async function Consentimiento_Muestra_Sangre_Digitalizado( datos = {}, docExistente = null ) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Función para formatear fecha a DD/MM/YYYY
  const toDDMMYYYY = (fecha) => {
    if (!fecha) return '';
    if (fecha.includes('/')) return fecha; // ya está en formato correcto
    const [anio, mes, dia] = fecha.split('-');
    if (!anio || !mes || !dia) return fecha;
    return `${dia}/${mes}/${anio}`;
  };

  // Header con datos de ficha, sede y fecha
  const drawHeader = async () => {
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

  await drawHeader();

  // Contenido del documento

  const margin = 15;
  let y = 44;
  // ─── 1) TÍTULO CON SUBRAYADO (más fino y más compacto) ─────
  doc.setFont('helvetica', 'bold').setFontSize(13);

  // Primera línea del título
  const titulo1 = 'CONSENTIMIENTO INFORMADO PARA LA';
  doc.text(titulo1, pageW / 2, y, { align: 'center' });

  const wT1 = doc.getTextWidth(titulo1);
  const xT1 = (pageW - wT1) / 2;

  // Línea muy fina (0.4 pt) y muy cerca del texto
  doc.setLineWidth(0.4);
  doc.line(xT1, y + 1, xT1 + wT1, y + 1);   // solo 1 mm debajo del texto

  y += 8;   // menos espacio entre las dos líneas del título

  // Segunda línea del título
  const titulo2 = 'TOMA DE MUESTRA DE SANGRE';
  doc.text(titulo2, pageW / 2, y, { align: 'center' });

  const wT2 = doc.getTextWidth(titulo2);
  const xT2 = (pageW - wT2) / 2;

  doc.setLineWidth(0.4);                     // línea fina también aquí
  doc.line(xT2, y + 1, xT2 + wT2, y + 1);   // pegada al texto

  // Espacio final antes del siguiente bloque
  y += 12;

  doc.setFontSize(11);

  // ─── 2) PREPARAR DATOS Y TEXTO ────────────────────
  const nombre = String(datos.nombres || '_________________________').trim();
  const edad = String(datos.edad || '___').trim();
  const dni = String(datos.dni || '__________').trim();
  const empresa = String(datos.empresa || '_________________________').trim();

  // Usar formato con marcadores similar al otro archivo
  const datosTexto = {
    nombre: nombre,
    edad: edad,
    dni: dni,
    empresa: empresa
  };

  // Texto con marcadores para datos en negrita
  const textoCompleto = 'Yo  {nombre}, de {edad} años de edad, identificado con DNI N° {dni}; habiendo recibido consejería e información acerca de los exámenes en sangre que se me va a realizar según solicitud del protocolo médico de la empresa {empresa}; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra de sangre para cumplir con los exámenes pertinentes.';

  const maxWidth = pageW - 2 * margin;

  // Función mejorada para dibujar texto con datos en negrita
  const dibujarTextoConSaltoLineaYBold = (textoBase, datosTexto, x, y, anchoMaximo, fontSize = 11) => {
    if (!textoBase) return y;
    doc.setFontSize(fontSize);
    const interlineado = fontSize * 0.4;
    let yPos = y;

    // Dividir el texto en partes: texto normal y datos (que van en negrita)
    const partes = [];
    const regex = /\{([^}]+)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(textoBase)) !== null) {
      if (match.index > lastIndex) {
        partes.push({ tipo: 'texto', contenido: textoBase.substring(lastIndex, match.index) });
      }
      partes.push({ tipo: 'dato', contenido: String(datosTexto[match[1]] || '') });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < textoBase.length) {
      partes.push({ tipo: 'texto', contenido: textoBase.substring(lastIndex) });
    }

    // Si no hay marcadores, usar el texto completo como texto normal
    if (partes.length === 0) {
      partes.push({ tipo: 'texto', contenido: textoBase });
    }

    // Construir líneas con datos en negrita (primero construir todas las líneas)
    let lineas = [];
    let lineaActual = [];
    let anchoLineaActual = 0;
    const espacioAncho = doc.getTextWidth(' ');

    partes.forEach(parte => {
      const esDato = parte.tipo === 'dato';
      const palabras = parte.contenido.split(' ');

      palabras.forEach(palabra => {
        if (!palabra) return; // Saltar palabras vacías

        doc.setFont("helvetica", esDato ? "bold" : "normal");
        const anchoPalabra = doc.getTextWidth(palabra);
        const espacioNecesario = lineaActual.length > 0 ? espacioAncho : 0;
        const anchoTotal = anchoLineaActual + espacioNecesario + anchoPalabra;

        // Si la palabra sola es más larga que el ancho máximo, dividirla
        if (anchoPalabra > anchoMaximo) {
          // Guardar línea actual si hay contenido
          if (lineaActual.length > 0) {
            lineas.push([...lineaActual]);
            lineaActual = [];
            anchoLineaActual = 0;
          }
          // Dividir palabra en caracteres
          let palabraRestante = palabra;
          while (palabraRestante.length > 0) {
            let caracteres = '';
            for (let i = 0; i < palabraRestante.length; i++) {
              const testCaracteres = caracteres + palabraRestante[i];
              doc.setFont("helvetica", esDato ? "bold" : "normal");
              if (doc.getTextWidth(testCaracteres) <= anchoMaximo) {
                caracteres = testCaracteres;
              } else {
                break;
              }
            }
            if (caracteres.length === 0) {
              caracteres = palabraRestante[0];
            }
            lineas.push([{ texto: caracteres, esDato: esDato }]);
            palabraRestante = palabraRestante.substring(caracteres.length);
          }
        } else if (anchoTotal <= anchoMaximo) {
          lineaActual.push({ texto: palabra, esDato: esDato });
          anchoLineaActual = anchoTotal;
        } else {
          // Guardar línea actual
          if (lineaActual.length > 0) {
            lineas.push([...lineaActual]);
          }
          // Nueva línea con esta palabra
          lineaActual = [{ texto: palabra, esDato: esDato }];
          anchoLineaActual = anchoPalabra;
        }
      });
    });

    // Agregar última línea
    if (lineaActual.length > 0) {
      lineas.push(lineaActual);
    }

    // Dibujar líneas justificadas
    lineas.forEach((linea, index) => {
      const esUltimaLinea = index === lineas.length - 1;
      const anchoTotalLinea = linea.reduce((sum, item) => {
        doc.setFont("helvetica", item.esDato ? "bold" : "normal");
        return sum + doc.getTextWidth(item.texto);
      }, 0);
      const espaciosEntreItems = linea.length - 1;
      const espacioDisponible = anchoMaximo - anchoTotalLinea;

      // Justificar solo si no es la última línea y hay más de un item
      const espacioExtra = (!esUltimaLinea && espaciosEntreItems > 0 && espacioDisponible > 0)
        ? espacioDisponible / espaciosEntreItems
        : espacioAncho;

      let xActual = x;
      linea.forEach((item, i) => {
        doc.setFont("helvetica", item.esDato ? "bold" : "normal");
        doc.text(item.texto, xActual, yPos);
        if (i < linea.length - 1) {
          xActual += doc.getTextWidth(item.texto) + espacioExtra;
        }
      });
      yPos += interlineado;
    });

    return yPos;
  };

  // Renderizar texto con datos en negrita
  y = dibujarTextoConSaltoLineaYBold(textoCompleto, datosTexto, margin, y, maxWidth, 11);
  y += 5;

  // ─── 4) FECHA ─────────────────────────────────────
  // doc.setFont('helvetica','normal').setFontSize(10);
  // if (datos.fecha) {
  //   const rightMargin = 20;
  //   doc.text(`${datos.fecha}`, pageW - rightMargin, y, { align: 'right' });
  // }
  // y += 15;

  // ─── 5) FIRMA Y HUELLA DEL PACIENTE, FIRMA Y SELLO DEL PROFESIONAL ────────────────────
  const baseY = y + 70;

  // Usar helper para dibujar firmas
  dibujarFirmas({ doc, datos, y: baseY, pageW }).then(() => {
    footerTR(doc, datos);
  }).catch(err => {
    console.error(err);
    alert('Error generando PDF: ' + err);
  });

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