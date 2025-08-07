import jsPDF from "jspdf";
import header_OdontogramaFechas from "./headers/header_OdontogramaFechas.jsx";


export default function OdontogramaFechas(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // 1) Header específico para Odontograma con Fechas
  header_OdontogramaFechas(doc, data);

  // 2) Tabla de datos
  const tablaY = 60; // Posición después del header

  // Configuración de la tabla
  const columnas = [
    { nombre: "Nro Orden", ancho: 25 },
    { nombre: "FECHA", ancho: 25 },
    { nombre: "NOMBRES", ancho: 60 },
    { nombre: "Empresa", ancho: 40 },
    { nombre: "Emp. Contratista", ancho: 40 },
  ];

  // Calcular ancho total de la tabla para centrarla
  const anchoTotal = columnas.reduce((total, col) => total + col.ancho, 0);
  const startX = (pageW - anchoTotal) / 2; // Centrar la tabla
  let currentX = startX;

  // Dibujar encabezados de la tabla
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);

  columnas.forEach((columna) => {
    const colX = currentX;
    const colY = tablaY;
    const colW = columna.ancho;
    const colH = 8;

    // Fondo del header con relleno gris claro
    doc.setFillColor(240, 240, 240); // Gris claro
    doc.rect(colX, colY, colW, colH, "F"); // Relleno gris
    doc.setFillColor(255, 255, 255); // Resetear a blanco

    // Borde del header
    doc.rect(colX, colY, colW, colH, "S"); // Borde

    // Texto del header - asegurar que sea negro y visible
    doc.setTextColor(0, 0, 0); // Negro para el texto
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(columna.nombre, colX + colW / 2, colY + colH / 2, {
      align: "center",
      baseline: "middle",
    });

    currentX += colW;
  });

  // Datos de ejemplo (puedes pasar esto como parámetro)
  // const datosTabla = data.fechas || [
  //   {
  //     norden: "153247",
  //     fechaOd: "14/07/2025",
  //     nombres: "SANTOS ALFONSO CORREA",
  //     empresa: "MONARCA GOLD S.A.C.",
  //     contrata: "CONSORCIO MINERO DRIFATI",
  //   },
  //   {
  //     norden: "153200",
  //     fechaOd: "14/07/2025",
  //     nombres: "OSCAR ANTONIO IBAÑEZ DIAZ",
  //     empresa: "CONSORCIO BESALCO",
  //     contrata: "RIPCONCIV CONSTRUCCIONES",
  //   },
  //   {
  //     norden: "153214",
  //     fechaOd: "14/07/2025",
  //     nombres: "JANN CARLOS FLORINDES RAMIREZ",
  //     empresa: "OBRASCÓN HUARTE",
  //     contrata: "SOLUCIONES AMBIENTALES",
  //   },
  //   {
  //     norden: "153215",
  //     fechaOd: "14/07/2025",
  //     nombres: "MARÍA ELENA GONZÁLEZ LÓPEZ",
  //     empresa: "MINERA BOROO",
  //     contrata: "CONFIPETROL ANDINA S.A.",
  //   },
  //   {
  //     norden: "153216",
  //     fechaOd: "14/07/2025",
  //     nombres: "CARLOS ALBERTO RODRÍGUEZ",
  //     empresa: "SUMMA GOLD",
  //     contrata: "EMPRESA DE TRANSPORTES",
  //   },
  //   {
  //     norden: "153217",
  //     fechaOd: "14/07/2025",
  //     nombres: "ANA LUCÍA MARTÍNEZ",
  //     empresa: "MINERA BOROO",
  //     contrata: "CONSORCIO MINERO DRIFATI",
  //   },
  //   {
  //     norden: "153218",
  //     fechaOd: "14/07/2025",
  //     nombres: "JUAN PABLO SÁNCHEZ",
  //     empresa: "MONARCA GOLD S.A.C.",
  //     contrata: "RIPCONCIV CONSTRUCCIONES",
  //   },
  //   {
  //     norden: "153219",
  //     fechaOd: "14/07/2025",
  //     nombres: "SOFÍA ELENA TORRES",
  //     empresa: "CONSORCIO BESALCO",
  //     contrata: "SOLUCIONES AMBIENTALES",
  //   },
  //   {
  //     norden: "153220",
  //     fechaOd: "14/07/2025",
  //     nombres: "DIEGO ARMANDO VARGAS",
  //     empresa: "OBRASCÓN HUARTE",
  //     contrata: "CONFIPETROL ANDINA S.A.",
  //   },
  //   {
  //     norden: "153221",
  //     fechaOd: "14/07/2025",
  //     nombres: "LUCÍA FERNANDA CASTRO",
  //     empresa: "SUMMA GOLD",
  //     contrata: "EMPRESA DE TRANSPORTES",
  //   },
  //   {
  //     norden: "153222",
  //     fechaOd: "14/07/2025",
  //     nombres: "ROBERTO CARLOS MENDIETA",
  //     empresa: "MINERA BOROO",
  //     contrata: "CONSORCIO MINERO DRIFATI",
  //   },
  // ];
  const datosTabla = data.fechas;

  // Dibujar filas de datos
  let filaY = tablaY + 8; // Comenzar después del header
  let paginaActual = 1; // Contador de página actual
  let filasEnPagina = 0; // Contador de filas en la página actual

  // Calcular total de páginas basado en el espacio disponible
  const espacioDisponible = pageH - 60 - 30; // Altura total - header - margen inferior
  const filaHBase = 6; // Altura base de fila
  const filasPorPagina = Math.floor(espacioDisponible / filaHBase);
  const totalPaginas = Math.ceil(datosTabla.length / filasPorPagina);

  datosTabla.forEach((fila, index) => {
    currentX = startX;

    // === Calcular altura dinámica para todas las columnas de texto ===
    const nombresCol = columnas[2]; // NOMBRES está en el índice 2
    const empresaCol = columnas[3]; // EMPRESA está en el índice 3
    const contratistaCol = columnas[4]; // CONTRATISTA está en el índice 4

    // Función para calcular líneas de texto
    const calcularLineas = (texto, maxWidth) => {
      const palabras = texto.split(" ");
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

      return lineas.slice(0, 2); // Máximo 2 líneas
    };

    // Calcular líneas para cada columna
    const lineasNombres = calcularLineas(fila.nombres, nombresCol.ancho - 4);
    const lineasEmpresa = calcularLineas(fila.empresa, empresaCol.ancho - 4);
    const lineasContratista = calcularLineas(
      fila.contrata,
      contratistaCol.ancho - 4
    );

    // Encontrar la máxima cantidad de líneas para determinar altura de fila
    const maxLineas = Math.max(
      lineasNombres.length,
      lineasEmpresa.length,
      lineasContratista.length
    );

    const filaH = filaHBase + (maxLineas - 1) * 3; // Altura dinámica

    columnas.forEach((columna, colIndex) => {
      const colX = currentX;
      const colW = columna.ancho;

      // Borde de la celda
      doc.rect(colX, filaY, colW, filaH, "S");

      // Texto de la celda
      doc.setFont("helvetica", "normal").setFontSize(7);
      let texto = "";

      switch (colIndex) {
        case 0:
          texto = `${fila.norden || ""}`;
          break;
        case 1:
          texto = `${fila.fechaOd || ""}`;
          break;
        case 2:
          texto = `${fila.nombres || ""}`;
          break;
        case 3:
          texto = `${fila.empresa || ""}`;
          break;
        case 4:
          texto = `${fila.contrata || ""}`;
          break;
      }

      if (colIndex === 2) {
        // NOMBRES con salto de línea
        lineasNombres.forEach((l, i) => {
          doc.text(l, colX + 2, filaY + 3 + i * 3, {
            align: "left",
          });
        });
      } else if (colIndex === 3) {
        // EMPRESA con salto de línea
        lineasEmpresa.forEach((l, i) => {
          doc.text(l, colX + 2, filaY + 3 + i * 3, {
            align: "left",
          });
        });
      } else if (colIndex === 4) {
        // CONTRATISTA con salto de línea
        lineasContratista.forEach((l, i) => {
          doc.text(l, colX + 2, filaY + 3 + i * 3, {
            align: "left",
          });
        });
      } else {
        // Centrado en ambas direcciones para otras columnas (Nro Orden, Fecha)
        doc.text(texto, colX + colW / 2, filaY + filaH / 2, {
          align: "center",
          baseline: "middle",
        });
      }

      currentX += colW;
    });

    filaY += filaH;
    filasEnPagina++;

    // Verificar si necesitamos una nueva página
    if (filaY > pageH - 30 || filasEnPagina >= filasPorPagina) {
      // Agregar numeración de página actual
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text(
        `Página ${paginaActual} de ${totalPaginas}`,
        pageW / 2,
        pageH - 15,
        { align: "center" }
      );

      // Nueva página (excepto si es la última fila)
      if (index < datosTabla.length - 1) {
        doc.addPage();
        header_OdontogramaFechas(doc, data);
        filaY = 60 + 8; // Reiniciar posición Y
        filasEnPagina = 0; // Resetear contador de filas
        paginaActual++; // Incrementar número de página
      }
    }
  });

  // Numeración de página final (si no se agregó en el bucle)
  if (paginaActual <= totalPaginas) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(
      `Página ${paginaActual} de ${totalPaginas}`,
      pageW / 2,
      pageH - 15,
      { align: "center" }
    );
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
