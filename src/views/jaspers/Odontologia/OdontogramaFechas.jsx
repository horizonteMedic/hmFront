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
    { nombre: "Emp. Contratista", ancho: 40 }
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
    doc.rect(colX, colY, colW, colH, 'F'); // Relleno gris
    doc.setFillColor(255, 255, 255); // Resetear a blanco
    
    // Borde del header
    doc.rect(colX, colY, colW, colH, 'S'); // Borde
    
    // Texto del header - asegurar que sea negro y visible
    doc.setTextColor(0, 0, 0); // Negro para el texto
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(columna.nombre, colX + colW/2, colY + colH/2, { align: "center", baseline: "middle" });
    
    currentX += colW;
  });
  
  // Datos de ejemplo (puedes pasar esto como parámetro)
  const datosTabla = data.datosTabla || [
    { nroOrden: "153247", fecha: "14/07/2025", nombres: "SANTOS ALFONSO CORREA", empresa: "MONARCA GOLD S.A.C.", contratista: "CONSORCIO MINERO DRIFATI" },
    { nroOrden: "153200", fecha: "14/07/2025", nombres: "OSCAR ANTONIO IBAÑEZ DIAZ", empresa: "CONSORCIO BESALCO", contratista: "RIPCONCIV CONSTRUCCIONES" },
    { nroOrden: "153214", fecha: "14/07/2025", nombres: "JANN CARLOS FLORINDES RAMIREZ", empresa: "OBRASCÓN HUARTE", contratista: "SOLUCIONES AMBIENTALES" },
    { nroOrden: "153215", fecha: "14/07/2025", nombres: "MARÍA ELENA GONZÁLEZ LÓPEZ", empresa: "MINERA BOROO", contratista: "CONFIPETROL ANDINA S.A." },
    { nroOrden: "153216", fecha: "14/07/2025", nombres: "CARLOS ALBERTO RODRÍGUEZ", empresa: "SUMMA GOLD", contratista: "EMPRESA DE TRANSPORTES" },
    { nroOrden: "153217", fecha: "14/07/2025", nombres: "ANA LUCÍA MARTÍNEZ", empresa: "MINERA BOROO", contratista: "CONSORCIO MINERO DRIFATI" },
    { nroOrden: "153218", fecha: "14/07/2025", nombres: "JUAN PABLO SÁNCHEZ", empresa: "MONARCA GOLD S.A.C.", contratista: "RIPCONCIV CONSTRUCCIONES" },
    { nroOrden: "153219", fecha: "14/07/2025", nombres: "SOFÍA ELENA TORRES", empresa: "CONSORCIO BESALCO", contratista: "SOLUCIONES AMBIENTALES" },
    { nroOrden: "153220", fecha: "14/07/2025", nombres: "DIEGO ARMANDO VARGAS", empresa: "OBRASCÓN HUARTE", contratista: "CONFIPETROL ANDINA S.A." },
    { nroOrden: "153221", fecha: "14/07/2025", nombres: "LUCÍA FERNANDA CASTRO", empresa: "SUMMA GOLD", contratista: "EMPRESA DE TRANSPORTES" },
    { nroOrden: "153222", fecha: "14/07/2025", nombres: "ROBERTO CARLOS MENDIETA", empresa: "MINERA BOROO", contratista: "CONSORCIO MINERO DRIFATI" }
  ];
  
  // Dibujar filas de datos
  const filaH = 6;
  let filaY = tablaY + 8; // Comenzar después del header
  let paginaActual = 1; // Contador de página actual
  let filasEnPagina = 0; // Contador de filas en la página actual
  
  // Calcular total de páginas basado en el espacio disponible
  const espacioDisponible = pageH - 60 - 30; // Altura total - header - margen inferior
  const filasPorPagina = Math.floor(espacioDisponible / filaH);
  const totalPaginas = Math.ceil(datosTabla.length / filasPorPagina);
  
  datosTabla.forEach((fila, index) => {
    currentX = startX;
    
    columnas.forEach((columna, colIndex) => {
      const colX = currentX;
      const colW = columna.ancho;
      
      // Borde de la celda
      doc.rect(colX, filaY, colW, filaH, 'S');
      
      // Texto de la celda
      doc.setFont("helvetica", "normal").setFontSize(7);
      let texto = "";
      
      switch(colIndex) {
        case 0: texto = fila.nroOrden; break;
        case 1: texto = fila.fecha; break;
        case 2: texto = fila.nombres; break;
        case 3: texto = fila.empresa; break;
        case 4: texto = fila.contratista; break;
      }
      
      // Ajustar texto si es muy largo
      if (texto.length > 20) {
        texto = texto.substring(0, 17) + "...";
      }
      
      doc.text(texto, colX + 2, filaY + filaH/2, { align: "left", baseline: "middle" });
      
      currentX += colW;
    });
    
    filaY += filaH;
    filasEnPagina++;
    
    // Verificar si necesitamos una nueva página
    if (filaY > pageH - 30 || filasEnPagina >= filasPorPagina) {
      // Agregar numeración de página actual
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text(`Página ${paginaActual} de ${totalPaginas}`, pageW / 2, pageH - 15, { align: "center" });
      
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
    doc.text(`Página ${paginaActual} de ${totalPaginas}`, pageW / 2, pageH - 15, { align: "center" });
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