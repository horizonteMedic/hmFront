import jsPDF from "jspdf";
import HeaderReporteFechasRadiografia from "./Headers/header_ReporteFechasRadiografia.jsx";

export default async function ReporteFechasRadiografia_Digitalizado(data = {}) {
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

    // Si está en formato DD-MM-YYYY, convertir
    if (/^\d{2}-\d{2}-\d{4}$/.test(fecha)) {
      const [day, month, year] = fecha.split("-");
      return `${day}/${month}/${year}`;
    }

    // Si está en formato MM/DD/YYYY (formato americano), convertir
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      const partes = fecha.split("/");
      if (partes.length === 3) {
        const [month, day, year] = partes;
        // Validar que sea formato americano (mes <= 12)
        if (parseInt(month) <= 12 && parseInt(day) <= 31) {
          return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }
      }
    }

    // Si está en formato DD.MM.YYYY (con puntos), convertir
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(fecha)) {
      const [day, month, year] = fecha.split(".");
      return `${day}/${month}/${year}`;
    }

    // Si está en formato YYYY.MM.DD (con puntos), convertir
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(fecha)) {
      const [year, month, day] = fecha.split(".");
      return `${day}/${month}/${year}`;
    }

    // Para cualquier otro formato, intentar parsear como Date y convertir
    try {
      const fechaObj = new Date(fecha);
      if (!isNaN(fechaObj.getTime())) {
        const day = fechaObj.getDate().toString().padStart(2, '0');
        const month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        const year = fechaObj.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch (error) {
      // Si falla el parsing, continuar
    }

    // Si no coincide con ningún formato conocido, retornar tal como está
    return fecha;
  };

  // Función para partir datos en dos columnas EQUITATIVAMENTE
  function partirEnDos(arr) {
    // Para 64 registros por página: cada tabla debe tener exactamente 32
    const mitad = Math.ceil(arr.length / 2);
    const izquierda = arr.slice(0, mitad);
    const derecha = arr.slice(mitad);
    return [izquierda, derecha];
  }

  // Variables de control de página
  let paginaActual = 1;

  // Calcular total de páginas ANTES de empezar
  const registrosPorPagina = 64; // Máximo 64 registros por página (32 + 32)
  const totalRegistros = data.fechas ? data.fechas.length : 0;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

  // Función para dibujar una página completa
  const dibujarPagina = (datosPagina) => {
    // Header de la página
    HeaderReporteFechasRadiografia(doc, data);

    const tablaY = 60; // Posición Y de la tabla

    const columnas = [
      { nombre: "Nro Orden", ancho: 20 },
      { nombre: "APELLIDOS Y NOMBRES", ancho: 55 },
      { nombre: "FECHA", ancho: 20 },
    ];

    const espacioEntreColumnas = 4;
    const anchoTotal = columnas.reduce((t, c) => t + c.ancho, 0);
    const margenLateral = (pageW - 2 * anchoTotal - espacioEntreColumnas) / 2;

    const tablaIzquierdaX = margenLateral;
    const tablaDerechaX = margenLateral + anchoTotal + espacioEntreColumnas;

    // Partir datos de esta página en dos columnas EQUITATIVAMENTE
    const [izq, der] = partirEnDos(datosPagina);

    // Función para dibujar una tabla
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
        doc.rect(colX, colY, colW, headerH, "F");
        doc.rect(colX, colY, colW, headerH, "S");
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold").setFontSize(7);
        doc.text(columna.nombre, colX + colW / 2, colY + headerH / 2, {
          align: "center",
          baseline: "middle",
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
        const palabras = fila.nombres ? fila.nombres.split(" ") : [];
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

          doc.rect(colX, filaY, colW, filaH, "S");
          doc.setFont("helvetica", "normal").setFontSize(7);

          let texto = "";
          switch (colIndex) {
            case 0:
              texto = `${fila.norden || ""}`;
              break;
            case 1:
              texto = `${fila.nombres || ""}`;
              break;
            case 2:
              texto = String(formatearFecha(fila.fechaExamen) || "");
              break;
          }

          if (colIndex === 1) {
            // NOMBRES con salto de línea
            lineasMostradas.forEach((l, i) => {
              doc.text(l, colX + 2, filaY + 3 + i * 3, {
                align: "left",
              });
            });
          } else {
            // Centrado en ambas direcciones
            doc.text(texto, colX + colW / 2, filaY + filaH / 2, {
              align: "center",
              baseline: "middle",
            });
          }

          currentX += colW;
        });

        filaY += filaH;
      });
    };

    // Dibujar ambas tablas
    dibujarTabla(izq, tablaIzquierdaX);
    dibujarTabla(der, tablaDerechaX);

    // Numeración de página
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(`Página ${paginaActual} de ${totalPaginas}`, pageW / 2, pageH - 15, { align: "center" });
  };

  // Procesar datos por páginas de forma dinámica
  const datosRestantes = [...data.fechas];

  while (datosRestantes.length > 0) {
    // Tomar máximo 64 registros por página (32 + 32)
    const registrosEnPagina = Math.min(datosRestantes.length, 64);

    // Tomar los registros para esta página
    const datosPagina = datosRestantes.splice(0, registrosEnPagina);

    // Dibujar página actual
    dibujarPagina(datosPagina);

    // Si quedan datos, agregar nueva página
    if (datosRestantes.length > 0) {
      doc.addPage();
      paginaActual++;
    }
  }

  // Generar blob y abrir en iframe para imprimir automáticamente
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
