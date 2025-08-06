import jsPDF from "jspdf";
import HeaderReporteFechasRadiografia from "./Headers/header_ReporteFechasRadiografia.jsx";

export default function ReporteFechasRadiografia(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Función para formatear fechas en DD/MM/YYYY
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    
    // Si ya está en formato DD/MM/YYYY, retornar tal como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      return fecha;
    }
    
    // Si está en formato YYYY-MM-DD, convertir
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [year, month, day] = fecha.split("-");
      return `${day}/${month}/${year}`;
    }
    
    // Si está en formato YYYY/MM/DD, convertir
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(fecha)) {
      const [year, month, day] = fecha.split("/");
      return `${day}/${month}/${year}`;
    }
    
    // Si no coincide con ningún formato conocido, retornar tal como está
    return fecha;
  };

  HeaderReporteFechasRadiografia(doc, data);

  const tablaY = 60;

  const columnas = [
    { nombre: "Nro Orden", ancho: 20 },
    { nombre: "APELLIDOS Y NOMBRES", ancho: 55 },
    { nombre: "FECHA", ancho: 20 }
  ];

  const espacioEntreColumnas = 4;
  const anchoTotal = columnas.reduce((t, c) => t + c.ancho, 0);
  const margenLateral = (pageW - (2 * anchoTotal) - espacioEntreColumnas) / 2;

  const tablaIzquierdaX = margenLateral;
  const tablaDerechaX = margenLateral + anchoTotal + espacioEntreColumnas;
  
  
  
  // Datos de ejemplo basados en la imagen proporcionada
  const datosTablaIzquierda = data.datosTablaIzquierda || [
    { nroOrden: "152943", nombres: "SEGUNDO ANDRES ORTIZ AZAÑERO ORTIZ AZAÑERO", fecha: formatearFecha("08/07/2025") },
    { nroOrden: "152865", nombres: "JUSTIN DANTE SANTOS MIÑOPE", fecha: formatearFecha("07/07/2025") },
    { nroOrden: "152954", nombres: "YOBER ARSENIO GIMENEZ VALLES", fecha: formatearFecha("08/07/2025") },
    { nroOrden: "152947", nombres: "PERCY TORIBIO SANTOS JANAMPA", fecha: formatearFecha("08/07/2025") },
    { nroOrden: "152950", nombres: "JONATHAN AXEL TURPO MAMANI", fecha: formatearFecha("08/07/2025") },
    { nroOrden: "152928", nombres: "ROMARIO CASTILLO VEGA", fecha: formatearFecha("07/07/2025") },
    { nroOrden: "152963", nombres: "VICENTE CHAVEZ FLORES", fecha: formatearFecha("09/07/2025") },
    { nroOrden: "152969", nombres: "ARNALDO ELIAQUIN SALVADOR MUÑOZ ORTIZ AZAÑERO", fecha: formatearFecha("09/07/2025") },
    { nroOrden: "152967", nombres: "EDHER ANTONIO NEIRA SANCHEZ", fecha: formatearFecha("09/07/2025") },
    { nroOrden: "152970", nombres: "ANDRY DANIEL VERONICO LOPEZ", fecha: formatearFecha("09/07/2025") },
    { nroOrden: "152971", nombres: "FRANCISCO AMILCAR LEON MENDOZA ORTIZ AZAÑERO", fecha: formatearFecha("09/07/2025") },
    { nroOrden: "152961", nombres: "CESAR ALBERTO CABANILLAS MEDINA", fecha: formatearFecha("09/07/2025") },
    { nroOrden: "152962", nombres: "JOEL ESCOBEDO CAMPOS", fecha: formatearFecha("09/07/2025") },
    { nroOrden: "152964", nombres: "LEONARDO ADAN TAMAYO HERNANDEZ", fecha: formatearFecha("09/07/2025") },
    { nroOrden: "152965", nombres: "JOSE LUIS TAVARA BORRERO", fecha: formatearFecha("09/07/2025") }
  ];
  
  const datosTablaDerecha = data.datosTablaDerecha || [
    { nroOrden: "153019", nombres: "YAHIR ALEXANDER PAZ RODRIGUEZ ORTIZ AZAÑERO", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153016", nombres: "ROGER GUILLERMO PAZ RODRIGUEZ", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153023", nombres: "WILLIAM IVAN MENDOZA GIL", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153044", nombres: "VILDER DAUL RODRIGUEZ DONATO", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153034", nombres: "JUAN PABLO SALVADOR AMBULAY", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153029", nombres: "DEYVI ERICK JULIAN CORDOVA", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153041", nombres: "JHONATAN NICOLAS GONZALES ARANDA", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153027", nombres: "BACELIZA VICTORIA ALTAMIRANO ORTIZ AZAÑERO ", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153015", nombres: "LESLIE DONALD VASQUEZ LLAJA", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153047", nombres: "ERICK HUGO SALCEDO QUISPE", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153045", nombres: "FRANZ EDUARDO VALDIVIESO TRUJILLO", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153040", nombres: "JIMMY FRANK TARRILLO VASQUEZ ORTIZ AZAÑERO", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153042", nombres: "ARNULFO LLANOS CHAVEZ", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153043", nombres: "VICTOR HERNAN CRUZADO LOPEZ", fecha: formatearFecha("10/07/2025") },
    { nroOrden: "153046", nombres: "ROYER MANUEL PAULINO TARAZONA", fecha: formatearFecha("10/07/2025") }
  ];
  const dibujarTabla = (datos, offsetX) => {
    let currentX = offsetX;
    const headerH = 8;

    doc.setDrawColor(0);
    doc.setLineWidth(0.2);

    // Header
    columnas.forEach((columna) => {
      const colX = currentX;
      const colY = tablaY;
      const colW = columna.ancho;

      doc.setFillColor(240, 240, 240);
      doc.rect(colX, colY, colW, headerH, 'F');
      doc.rect(colX, colY, colW, headerH, 'S');
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text(columna.nombre, colX + colW / 2, colY + headerH / 2, {
        align: "center",
        baseline: "middle"
      });

      currentX += colW;
    });

    // Filas
    let filaY = tablaY + headerH;

    datos.forEach((fila) => {
      currentX = offsetX;
      const nombresCol = columnas[1];
      const maxWidth = nombresCol.ancho - 4;

      // === Calcular líneas de NOMBRES ===
      const palabras = fila.nombres.split(" ");
      const lineas = [];
      let linea = "";

      palabras.forEach((palabra) => {
        const testLinea = (linea + " " + palabra).trim();
        const textWidth = doc.getTextWidth(testLinea);
        if (textWidth <= maxWidth) {
          linea = testLinea;
        } else {
          if (linea) lineas.push(linea);
          linea = palabra;
        }
      });
      if (linea) lineas.push(linea);

      const lineasMostradas = lineas.slice(0, 2);
      const cantidadLineas = lineasMostradas.length;
      const filaH = 6 + (cantidadLineas - 1) * 3;

      // === Dibujar cada celda ===
      columnas.forEach((columna, colIndex) => {
        const colX = currentX;
        const colW = columna.ancho;

        doc.rect(colX, filaY, colW, filaH, 'S');
        doc.setFont("helvetica", "normal").setFontSize(7);

        let texto = "";
        switch (colIndex) {
          case 0: texto = fila.nroOrden; break;
          case 1: texto = fila.nombres; break;
          case 2: texto = formatearFecha(fila.fecha); break;
        }

        if (colIndex === 1) {
          // NOMBRES con salto de línea
          lineasMostradas.forEach((l, i) => {
            doc.text(l, colX + 2, filaY + 3 + i * 3, {
              align: "left"
            });
          });
        } else {
          // Centrado en ambas direcciones
          doc.text(texto, colX + colW / 2, filaY + filaH / 2, {
            align: "center",
            baseline: "middle"
          });
        }

        currentX += colW;
      });

      filaY += filaH;
    });
  };

  dibujarTabla(datosTablaIzquierda, tablaIzquierdaX);
  dibujarTabla(datosTablaDerecha, tablaDerechaX);

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Página 1 de 1", pageW / 2, pageH - 15, { align: "center" });

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}