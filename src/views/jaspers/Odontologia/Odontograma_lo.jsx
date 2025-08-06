import jsPDF from "jspdf";

export default function Odontograma_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();

  // Datos de prueba basados en la imagen
  const datosPrueba = {
    norden: "96639",
    sede: "trujillo-pierola",
    nombres: "hady katherine castillo plasencia",
    empresa: "servicios industriales mmj empresa individual de responsabilidad limitada- servicios industriales mm",
    contratista: "asociacion de transportistas mineria y construccion huamachuco - asmychuamachuco",
    sexo: "femenino",
    edad: "39",
    fecha: "lunes 04 noviembre 2024",
    // Dental status counts - Datos de prueba con diferentes condiciones
    piezasMalEstado: "5",
    pprMetalicas: "2",
    pprAcrilicas: "1",
    ausentes: "3",
    puentes: "2",
    coronas: "4",
    porExtraer: "1",
    pTotales: "1",
    normales: "18",
    obturacionesEfectuadas: "6",
    cariadasPorOturar: "2",
    fracturadas: "1",
    // Observaciones y lugar fecha
    observaciones: "paciente presenta buena higiene bucal. se recomienda control cada 6 meses. se observa ligera acumulación de sarro en molares inferiores. necesita limpieza profesional.",
    lugarFecha: "trujillo, 04 de noviembre de 2024"
  };

  // Función para obtener string de datos
  const obtenerString = (nombre) => {
    return data[nombre] ?? "";
  };

  // Función para convertir a mayúsculas los campos específicos
  const obtenerStringMayus = (nombre) => {
    const valor = data[nombre] ?? "";
    return valor.toUpperCase();
  };

  // Datos reales
  const datosReales = {
    norden: obtenerString("norden"),
    sede: obtenerStringMayus("sede"),
    nombres: obtenerStringMayus("nombres"),
    empresa: obtenerStringMayus("empresa"),
    contratista: obtenerStringMayus("contratista"),
    sexo: obtenerStringMayus("sexo"),
    edad: obtenerString("edad"),
    fecha: obtenerStringMayus("fecha"),
    piezasMalEstado: obtenerString("piezasMalEstado"),
    pprMetalicas: obtenerString("pprMetalicas"),
    pprAcrilicas: obtenerString("pprAcrilicas"),
    ausentes: obtenerString("ausentes"),
    puentes: obtenerString("puentes"),
    coronas: obtenerString("coronas"),
    porExtraer: obtenerString("porExtraer"),
    pTotales: obtenerString("pTotales"),
    normales: obtenerString("normales"),
    obturacionesEfectuadas: obtenerString("obturacionesEfectuadas"),
    cariadasPorOturar: obtenerString("cariadasPorOturar"),
    fracturadas: obtenerString("fracturadas"),
    observaciones: obtenerStringMayus("observaciones"),
    lugarFecha: obtenerStringMayus("lugarFecha")
  };

  // Usar datos reales o datos de prueba
  const datosFinales = data && Object.keys(data).length > 0 ? datosReales : {
    norden: datosPrueba.norden,
    sede: datosPrueba.sede.toUpperCase(),
    nombres: datosPrueba.nombres.toUpperCase(),
    empresa: datosPrueba.empresa.toUpperCase(),
    contratista: datosPrueba.contratista.toUpperCase(),
    sexo: datosPrueba.sexo.toUpperCase(),
    edad: datosPrueba.edad,
    fecha: datosPrueba.fecha.toUpperCase(),
    piezasMalEstado: datosPrueba.piezasMalEstado,
    pprMetalicas: datosPrueba.pprMetalicas,
    pprAcrilicas: datosPrueba.pprAcrilicas,
    ausentes: datosPrueba.ausentes,
    puentes: datosPrueba.puentes,
    coronas: datosPrueba.coronas,
    porExtraer: datosPrueba.porExtraer,
    pTotales: datosPrueba.pTotales,
    normales: datosPrueba.normales,
    obturacionesEfectuadas: datosPrueba.obturacionesEfectuadas,
    cariadasPorOturar: datosPrueba.cariadasPorOturar,
    fracturadas: datosPrueba.fracturadas,
    observaciones: datosPrueba.observaciones.toUpperCase(),
    lugarFecha: datosPrueba.lugarFecha.toUpperCase()
  };

  // === 1) Imagen de fondo para el odontograma ===
  const fondoImg = "/img/Odontograma_Digitalizado_LO.png";
  const pageH = doc.internal.pageSize.getHeight();
  
  // Usar todo el ancho del documento horizontal
  const imgWidth = pageW; // Todo el ancho disponible
  const imgHeight = pageH; // Todo el alto disponible
  
  // Empezar desde el borde superior izquierdo
  const xOffset = 0;
  const yOffset = 0;
  
  try {
    doc.addImage(fondoImg, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  } catch (e) {
    doc.text(
      "Imagen de odontograma no disponible",
      margin,
      yOffset + 10
    );
  }

  // === 2) Datos posicionados individualmente ===
  doc.setFont("helvetica", "normal").setFontSize(10);

  // === FUNCIÓN PARA COLOCAR ICONOS DENTALES ===
  const colocarIconoDental = (tipo, cantidad, posiciones) => {
    if (cantidad > 0 && posiciones && posiciones.length > 0) {
      const iconPath = `/src/views/jaspers/Odontologia/iconos_odonto/Icon_${tipo}.png`;
      
      // Colocar iconos en las posiciones especificadas
      posiciones.slice(0, cantidad).forEach((pos) => {
        try {
          doc.addImage(iconPath, "PNG", pos.x, pos.y, pos.width || 8, pos.height || 8);
        } catch (e) {
          console.log(`Error al cargar icono ${tipo}:`, e);
        }
      });
    }
  };

  // === POSICIONES DE LOS DIENTES EN EL ODONTOGRAMA ===
  // Definir las posiciones de los dientes (ejemplo para algunos dientes)
  const posicionesDientes = {
    // Dientes superiores (1-16)
    1: { x: margin + 20, y: margin + 80, width: 8, height: 8 },
    2: { x: margin + 30, y: margin + 80, width: 8, height: 8 },
    3: { x: margin + 40, y: margin + 80, width: 8, height: 8 },
    4: { x: margin + 50, y: margin + 80, width: 8, height: 8 },
    5: { x: margin + 60, y: margin + 80, width: 8, height: 8 },
    6: { x: margin + 70, y: margin + 80, width: 8, height: 8 },
    7: { x: margin + 80, y: margin + 80, width: 8, height: 8 },
    8: { x: margin + 90, y: margin + 80, width: 8, height: 8 },
    9: { x: margin + 100, y: margin + 80, width: 8, height: 8 },
    10: { x: margin + 110, y: margin + 80, width: 8, height: 8 },
    11: { x: margin + 120, y: margin + 80, width: 8, height: 8 },
    12: { x: margin + 130, y: margin + 80, width: 8, height: 8 },
    13: { x: margin + 140, y: margin + 80, width: 8, height: 8 },
    14: { x: margin + 150, y: margin + 80, width: 8, height: 8 },
    15: { x: margin + 160, y: margin + 80, width: 8, height: 8 },
    16: { x: margin + 170, y: margin + 80, width: 8, height: 8 },
    
    // Dientes inferiores (17-32)
    17: { x: margin + 20, y: margin + 100, width: 8, height: 8 },
    18: { x: margin + 30, y: margin + 100, width: 8, height: 8 },
    19: { x: margin + 40, y: margin + 100, width: 8, height: 8 },
    20: { x: margin + 50, y: margin + 100, width: 8, height: 8 },
    21: { x: margin + 60, y: margin + 100, width: 8, height: 8 },
    22: { x: margin + 70, y: margin + 100, width: 8, height: 8 },
    23: { x: margin + 80, y: margin + 100, width: 8, height: 8 },
    24: { x: margin + 90, y: margin + 100, width: 8, height: 8 },
    25: { x: margin + 100, y: margin + 100, width: 8, height: 8 },
    26: { x: margin + 110, y: margin + 100, width: 8, height: 8 },
    27: { x: margin + 120, y: margin + 100, width: 8, height: 8 },
    28: { x: margin + 130, y: margin + 100, width: 8, height: 8 },
    29: { x: margin + 140, y: margin + 100, width: 8, height: 8 },
    30: { x: margin + 150, y: margin + 100, width: 8, height: 8 },
    31: { x: margin + 160, y: margin + 100, width: 8, height: 8 },
    32: { x: margin + 170, y: margin + 100, width: 8, height: 8 }
  };

  // === TOP RIGHT BLOCK - N° Ficha y Sede ===
  // N° Ficha - Coordenadas individuales
  const xNorden = pageW - margin - 25; // AJUSTAR POSICIÓN X DE N° FICHA AQUÍ
  const yNorden = margin + 35; // AJUSTAR POSICIÓN Y DE N° FICHA AQUÍ
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.norden, xNorden, yNorden, { align: "right" });
  
  // Subrayado para el N° Ficha
  const textWidth = doc.getTextWidth(datosFinales.norden);
  const underlineY = yNorden + 1; // Posición Y del subrayado
  const underlineX = xNorden - textWidth; // Posición X del subrayado (alineado a la derecha)
  doc.setDrawColor(0, 0, 0); // Color negro
  doc.setLineWidth(0.5); // Grosor de la línea
  doc.line(underlineX, underlineY, xNorden, underlineY);

  // Sede - Coordenadas individuales
  const xSede = pageW - margin - 12; // AJUSTAR POSICIÓN X DE SEDE AQUÍ
  const ySede = margin + 41.5; // AJUSTAR POSICIÓN Y DE SEDE AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(datosFinales.sede, xSede, ySede, { align: "right" });

  // === PATIENT INFORMATION BLOCK ===
  // Nombres - Coordenadas individuales
  const xNombres = pageW - margin - 158; // AJUSTAR POSICIÓN X DE NOMBRES AQUÍ (más a la izquierda)
  const yNombres = margin + 47.5; // AJUSTAR POSICIÓN Y DE NOMBRES AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.nombres, xNombres, yNombres, { maxWidth: 85 });

  // Sexo - Coordenadas individuales
  const xSexo = pageW - margin - 61; // AJUSTAR POSICIÓN X DE SEXO AQUÍ
  const ySexo = margin + 47; // AJUSTAR POSICIÓN Y DE SEXO AQUÍ
  doc.text(datosFinales.sexo, xSexo, ySexo);

  // Empresa - Coordenadas individuales
  const xEmpresa = pageW - margin - 158; // AJUSTAR POSICIÓN X DE EMPRESA AQUÍ (más a la izquierda)
  const yEmpresa = margin + 53; // AJUSTAR POSICIÓN Y DE EMPRESA AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.empresa, xEmpresa, yEmpresa, { maxWidth: 82 });

  // Edad - Coordenadas individuales
  const xEdad = pageW - margin - 61; // AJUSTAR POSICIÓN X DE EDAD AQUÍ
  const yEdad = margin + 53; // AJUSTAR POSICIÓN Y DE EDAD AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(datosFinales.edad, xEdad, yEdad);

  // Contratista - Coordenadas individuales
  const xContratista = pageW - margin - 155; // AJUSTAR POSICIÓN X DE CONTRATISTA AQUÍ (más a la izquierda)
  const yContratista = margin + 63.5; // AJUSTAR POSICIÓN Y DE CONTRATISTA AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contratista, xContratista, yContratista, { maxWidth: 82 });

  // Fecha - Coordenadas individuales
  const xFecha = pageW - margin - 60; // AJUSTAR POSICIÓN X DE FECHA AQUÍ
  const yFecha = margin + 61; // AJUSTAR POSICIÓN Y DE FECHA AQUÍ
  doc.text(datosFinales.fecha, xFecha, yFecha);

  // === SUMMARY OF DENTAL STATUS ===
  doc.setFont("helvetica", "normal").setFontSize(10);
  
  // Piezas en mal estado - Coordenadas individuales
  const xPiezasMalEstado = pageW - margin - 131; // AJUSTAR POSICIÓN X DE PIEZAS MAL ESTADO AQUÍ
  const yPiezasMalEstado = margin + 125; // AJUSTAR POSICIÓN Y DE PIEZAS MAL ESTADO AQUÍ
  doc.text(datosFinales.piezasMalEstado, xPiezasMalEstado, yPiezasMalEstado, { align: "right" });

  // P.P.R. Metalicas - Coordenadas individuales
  const xPprMetalicas = pageW - margin - 131; // AJUSTAR POSICIÓN X DE PPR METALICAS AQUÍ
  const yPprMetalicas = margin + 130.5; // AJUSTAR POSICIÓN Y DE PPR METALICAS AQUÍ
  doc.text(datosFinales.pprMetalicas, xPprMetalicas, yPprMetalicas, { align: "right" });

  // P.P.R. Acrilicas - Coordenadas individuales
  const xPprAcrilicas = pageW - margin - 131; // AJUSTAR POSICIÓN X DE PPR ACRILICAS AQUÍ
  const yPprAcrilicas = margin + 136; // AJUSTAR POSICIÓN Y DE PPR ACRILICAS AQUÍ
  doc.text(datosFinales.pprAcrilicas, xPprAcrilicas, yPprAcrilicas, { align: "right" });

  // Ausentes - Coordenadas individuales
  const xAusentes = pageW - margin - 101; // AJUSTAR POSICIÓN X DE AUSENTES AQUÍ
  const yAusentes = margin + 125; // AJUSTAR POSICIÓN Y DE AUSENTES AQUÍ
  doc.text(datosFinales.ausentes, xAusentes, yAusentes, { align: "right" });

  // Puentes - Coordenadas individuales
  const xPuentes = pageW - margin - 101; // AJUSTAR POSICIÓN X DE PUENTES AQUÍ
  const yPuentes = margin + 130.5; // AJUSTAR POSICIÓN Y DE PUENTES AQUÍ
  doc.text(datosFinales.puentes, xPuentes, yPuentes, { align: "right" });

  // Coronas - Coordenadas individuales
  const xCoronas = pageW - margin - 101; // AJUSTAR POSICIÓN X DE CORONAS AQUÍ
  const yCoronas = margin + 136; // AJUSTAR POSICIÓN Y DE CORONAS AQUÍ
  doc.text(datosFinales.coronas, xCoronas, yCoronas, { align: "right" });

  // Por Extraer - Coordenadas individuales
  const xPorExtraer = pageW - margin - 70; // AJUSTAR POSICIÓN X DE POR EXTRAER AQUÍ
  const yPorExtraer = margin + 125; // AJUSTAR POSICIÓN Y DE POR EXTRAER AQUÍ
  doc.text(datosFinales.porExtraer, xPorExtraer, yPorExtraer, { align: "right" });

  // P. Totales - Coordenadas individuales
  const xPTotales = pageW - margin - 70; // AJUSTAR POSICIÓN X DE P TOTALES AQUÍ
  const yPTotales = margin + 130.5; // AJUSTAR POSICIÓN Y DE P TOTALES AQUÍ
  doc.text(datosFinales.pTotales, xPTotales, yPTotales, { align: "right" });

  // Normales - Coordenadas individuales
  const xNormales = pageW - margin - 70; // AJUSTAR POSICIÓN X DE NORMALES AQUÍ
  const yNormales = margin + 136; // AJUSTAR POSICIÓN Y DE NORMALES AQUÍ
  doc.text(datosFinales.normales, xNormales, yNormales, { align: "right" });

  // Obturaciones Efectuadas - Coordenadas individuales
  const xObturacionesEfectuadas = pageW - margin - 14; // AJUSTAR POSICIÓN X DE OBTURACIONES EFECTUADAS AQUÍ
  const yObturacionesEfectuadas = margin + 126; // AJUSTAR POSICIÓN Y DE OBTURACIONES EFECTUADAS AQUÍ
  doc.text(datosFinales.obturacionesEfectuadas, xObturacionesEfectuadas, yObturacionesEfectuadas, { align: "right" });

  // Cariadas por Oturar - Coordenadas individuales
  const xCariadasPorOturar = pageW - margin - 14; // AJUSTAR POSICIÓN X DE CARIADAS POR OTURAR AQUÍ
  const yCariadasPorOturar = margin + 131; // AJUSTAR POSICIÓN Y DE CARIADAS POR OTURAR AQUÍ
  doc.text(datosFinales.cariadasPorOturar, xCariadasPorOturar, yCariadasPorOturar, { align: "right" });

  // Fracturadas - Coordenadas individuales
  const xFracturadas = pageW - margin - 14; // AJUSTAR POSICIÓN X DE FRACTURADAS AQUÍ
  const yFracturadas = margin + 136.5; // AJUSTAR POSICIÓN Y DE FRACTURADAS AQUÍ
  doc.text(datosFinales.fracturadas, xFracturadas, yFracturadas, { align: "right" });

  // === OBSERVACIONES Y LUGAR FECHA ===
  // Observaciones - Coordenadas individuales
  const xObservaciones = margin + 148; // AJUSTAR POSICIÓN X DE OBSERVACIONES AQUÍ
  const yObservaciones = margin + 142; // AJUSTAR POSICIÓN Y DE OBSERVACIONES AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.observaciones, xObservaciones, yObservaciones, { maxWidth: 120 });

  // Lugar y Fecha - Coordenadas individuales
  const xLugarFecha = margin + 132.5; // AJUSTAR POSICIÓN X DE LUGAR Y FECHA AQUÍ
  const yLugarFecha = margin + 153.6; // AJUSTAR POSICIÓN Y DE LUGAR Y FECHA AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.lugarFecha, xLugarFecha, yLugarFecha);

  // === 3) COLOCAR ICONOS DENTALES BASADOS EN LOS DATOS ===
  // Convertir los datos de texto a números para comparar
  const ausentes = parseInt(datosFinales.ausentes) || 0;
  const cariadas = parseInt(datosFinales.cariadasPorOturar) || 0;
  const coronas = parseInt(datosFinales.coronas) || 0;
  const fracturadas = parseInt(datosFinales.fracturadas) || 0;
  const normales = parseInt(datosFinales.normales) || 0;
  const obturaciones = parseInt(datosFinales.obturacionesEfectuadas) || 0;
  const porExtraer = parseInt(datosFinales.porExtraer) || 0;
  const pprMetalicas = parseInt(datosFinales.pprMetalicas) || 0;
  const pprAcrilicas = parseInt(datosFinales.pprAcrilicas) || 0;
  const puentes = parseInt(datosFinales.puentes) || 0;
  const pTotales = parseInt(datosFinales.pTotales) || 0;

  // Obtener las posiciones de los dientes como array
  const posicionesArray = Object.values(posicionesDientes);

  // Crear un array de posiciones disponibles para evitar superposición
  let posicionActual = 0;

  // Función para obtener las siguientes posiciones disponibles
  const obtenerPosicionesDisponibles = (cantidad) => {
    const posiciones = posicionesArray.slice(posicionActual, posicionActual + cantidad);
    posicionActual += cantidad;
    return posiciones;
  };

  // Colocar iconos según los datos de manera secuencial
  colocarIconoDental("ausente", ausentes, obtenerPosicionesDisponibles(ausentes));
  colocarIconoDental("cariada", cariadas, obtenerPosicionesDisponibles(cariadas));
  colocarIconoDental("corona", coronas, obtenerPosicionesDisponibles(coronas));
  colocarIconoDental("fracturada", fracturadas, obtenerPosicionesDisponibles(fracturadas));
  colocarIconoDental("normal", normales, obtenerPosicionesDisponibles(normales));
  colocarIconoDental("obturacion", obturaciones, obtenerPosicionesDisponibles(obturaciones));
  colocarIconoDental("por_extraer", porExtraer, obtenerPosicionesDisponibles(porExtraer));
  colocarIconoDental("ppr_metalica", pprMetalicas, obtenerPosicionesDisponibles(pprMetalicas));
  colocarIconoDental("ppr_acrilica", pprAcrilicas, obtenerPosicionesDisponibles(pprAcrilicas));
  colocarIconoDental("puente", puentes, obtenerPosicionesDisponibles(puentes));
  colocarIconoDental("p_total", pTotales, obtenerPosicionesDisponibles(pTotales));

  // === 4) Generar blob y abrir en iframe para imprimir automáticamente ===
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
