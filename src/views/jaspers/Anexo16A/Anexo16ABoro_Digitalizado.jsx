import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign, convertirGenero } from "../../utils/helpers";
import { normalizeList } from "../../utils/listUtils";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Anexo16ABoro_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidos_apellidos_pa || "") + " " + (data.nombres_nombres_pa || "")),
    fechaExamen: formatearFechaCorta(data.fechaAnexo16a_fecha_anexo || ""),
    tipoExamen: String(data.nombreExamen || ""),
    sexo: convertirGenero(data.sexo_sexo_pa) || "",
    documentoIdentidad: String(data.dni_cod_pa || ""),
    edad: data.edad_edad ? String(data.edad_edad) : "",
    areaTrabajo: data.area_area_o || "",
    puestoTrabajo: data.cargo_cargo_de || "",
    empresa: data.empresa_razon_empresa || "",
    contrata: data.contrata_razon_contrata || "",
    apto: data.aptoAnexo16a_apto !== undefined ? data.aptoAnexo16a_apto : true,
    vitalSigns: {
      fc: String(data.frecuenciaCardiacaTriaje_f_cardiaca || ""),
      fr: String(data.frecuenciaRespiratoriaTriaje_f_respiratoria || ""),
      pa: (data.sistolicaTriaje_sistolica || data.diastolicaTriaje_diastolica) 
        ? String(data.sistolicaTriaje_sistolica || "") + "/" + String(data.diastolicaTriaje_diastolica || "")
        : "",
      satO2: String(data.saturacionOxigenoTriaje_sat_02 || ""),
      imc: String(data.imcTriaje_imc || ""),
      temperatura: String(data.temperaturaTriaje_temperatura || ""),
      peso: String(data.pesoTriaje_peso || ""),
      talla: String(data.tallaTriaje_talla || "")
    },
    condiciones: {
      cirugiaMayor: data.cirujiaMayorRecienteSiAnexo16a_si1 === true,
      desordenesCoagulacion: data.desordenCoagulacionSiAnexo16a_si2 === true,
      diabetes: data.diabetesMellitusSiAnexo16a_si3 === true,
      hipertension: data.hipertensionArterialSiAnexo16a_si4 === true,
      embarazo: data.embarazoSiAnexo16a_si5 === true,
      problemasNeurologicos: data.problemaNeurologicoSiAnexo16a_si6 === true,
      infeccionesRecientes: data.infeccionRecienteSiAnexo16a_si7 === true,
      obesidadMorbida: data.obesidadMorbididadSiAnexo16a_si8 === true,
      problemasCardiacos: data.problemasCardiacoSiAnexo16a_si9 === true,
      problemasRespiratorios: data.problemasRespiratoriosSiAnexo16a_si10 === true,
      problemasOftalmologicos: data.problemasOftalmologicosSiAnexo16a_si11 === true,
      problemasDigestivos: data.problemasDigestivosSiAnexo16a_si12 === true,
      apneaSueño: data.apneaDelSuenoSiAnexo16a_si13 === true,
      alergias: data.alergiasSiAnexo16a_si15 === true,
      otraCondicion: data.otraCondicionMedicaSiAnexo16a_si14 === true
    },
    medicacionActual: data.medicacionActualAnexo16a_m_actual || "",
    fur: data.furDescripcionAnexo16a_txtfur || "",
    observaciones: data.observacionesAnexo16a_observaciones || "",
    medico: {
      nombres: String((data.apellidoUsuario_apellido_user || "") + " " + (data.nombreUsuario_nombre_user || "")),
      direccion: data.direccionSede || "",
      cmp: data.cmpUsuario_cmp_user ? String(data.cmpUsuario_cmp_user) : "",
      fecha: formatearFechaCorta(data.fechaAnexo16a_fecha_anexo || "")
    },
    laboratorio: {
      hemoglobina: data.hemoglobinaLaboratorioClinico_txthemoglobina 
        ? String(data.hemoglobinaLaboratorioClinico_txthemoglobina).trim() + " g/dl"
        : "",
      hematocrito: data.hematocritoLaboratorioClinico_txthematocrito 
        ? String(data.hematocritoLaboratorioClinico_txthematocrito).trim() + "%"
        : "",
      glucosa: data.glucosaLaboratorioClinico_txtglucosabio 
        ? String(data.glucosaLaboratorioClinico_txtglucosabio).trim() + " mg/dl"
        : "",
      ekg: data.hallazgosInformeElectroCardiograma_hallazgo 
        ? String(data.hallazgosInformeElectroCardiograma_hallazgo)
        : ""
    },

    // Datos de color
    color: data.color || data.informacionSede?.color || 1,
    codigoColor: data.codigoColor || data.informacionSede?.codigoColor || "#008f39",
    textoColor: data.textoColor || data.informacionSede?.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: String(data.norden_n_orden || ""),
    sede: data.nombreSede || ""
  };

  // Usar datos reales
  const datosFinales = datosReales;

  // Header reutilizable (similar a FichaDetencionSAS_boro_Digitalizado.jsx)
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("ANEXO N° 16 - A", pageW / 2, 30, { align: "center" });

      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.text("EVALUACION MÉDICA PARA ASCENSO A GRANDES ALTITUDES", pageW / 2, 34, { align: "center" });
      doc.text("(mayor de 2,500 m.s.n.m.)", pageW / 2, 38, { align: "center" });
    }

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

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

  // === DIBUJAR HEADER ===
  drawHeader(numeroPagina);


  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea (maneja saltos de línea explícitos \n)
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return y;
    }
    
    const fontSize = doc.internal.getFontSize();
    let yPos = y;
    
    // Primero dividir por saltos de línea explícitos (\n, \r\n)
    const lineasConSaltos = String(texto).split(/\r\n|\r|\n/);
    
    lineasConSaltos.forEach((lineaConSalto, indiceLinea) => {
      // Si no es la primera línea y hay un salto de línea antes, hacer salto
      if (indiceLinea > 0) {
        yPos += fontSize * 0.35; // Salto de línea explícito
      }
      
      // Dividir cada línea por espacios para manejar el ancho máximo
      const palabras = lineaConSalto.trim().split(' ');
      let lineaActual = '';
      
      palabras.forEach(palabra => {
        if (!palabra) return; // Saltar palabras vacías
        
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);
        
        if (anchoTexto <= anchoMaximo) {
          lineaActual = textoPrueba;
        } else {
          if (lineaActual) {
            doc.text(lineaActual, x, yPos);
            yPos += fontSize * 0.35; // salto real entre líneas
            lineaActual = palabra;
          } else {
            // Si la palabra sola es más ancha que el máximo, igual la dibujamos
            doc.text(palabra, x, yPos);
            yPos += fontSize * 0.35;
          }
        }
      });
      
      // Dibujar la línea actual si quedó algo
      if (lineaActual) {
        doc.text(lineaActual, x, yPos);
        // NO sumar una línea extra aquí, solo cuando hay salto explícito o nueva palabra
      }
    });
    
    return yPos; // Devuelve la posición final donde terminó el texto
  };

  // Función para calcular altura dinámica del texto
  const calcularAlturaTexto = (texto, anchoMaximo, fontSize) => {
    if (!texto || texto === null || texto === undefined) {
      return 5; // Altura mínima
    }
    
    // Usar splitTextToSize de jsPDF que es más preciso
    const lineas = doc.splitTextToSize(String(texto), anchoMaximo);
    const alturaPorLinea = fontSize * 0.35;
    const alturaTotal = lineas.length * alturaPorLinea + 2; // +2 para padding
    
    return Math.max(alturaTotal, 5); // Altura mínima de 5mm
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 10;
    const tablaAncho = 190;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3);
    
    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 45;
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;


  // Tercera fila: Área de Trabajo, Puesto de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 45 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 2, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 2);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 62, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 75, yTexto + 2);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Género:", tablaInicioX + 122, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo, tablaInicioX + 135, yTexto + 2);
  yTexto += filaAltura;


  // Tercera fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 2, 50);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 2, 65);
  yTexto += filaAltura;

  // Cuarta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 2, tablaAncho - 25);
  yTexto += filaAltura;

  // Quinta fila: Contrata
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 2, tablaAncho - 30);
  yTexto += filaAltura;

  // === SECCIÓN 2: FUNCIONES VITALES ===
  // Header de funciones vitales (solo título)
  yPos = dibujarHeaderSeccion("2. SIGNOS VITALES", yPos, filaAltura);

  // Primera fila de funciones vitales con 5 columnas (datos van aquí)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 38, yPos, tablaInicioX + 38, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 76, yPos, tablaInicioX + 76, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 114, yPos, tablaInicioX + 114, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + 152, yPos, tablaInicioX + 152, yPos + filaAltura); // Cuarta división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Segunda fila de funciones vitales con 3 columnas (Temperatura, Peso, Talla)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 63, yPos, tablaInicioX + 63, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 126, yPos, tablaInicioX + 126, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // === CONTENIDO DE FUNCIONES VITALES ===
  // Primera fila: FC, FR, PA, Sat. O2, IMC
  const yPrimeraFila = yPos - filaAltura; // Ajustar para la primera fila
  
  // FC (Frecuencia Cardíaca)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FC:", tablaInicioX + 2, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.fc + " x min", tablaInicioX + 8, yPrimeraFila + 3);

  // FR (Frecuencia Respiratoria)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR:", tablaInicioX + 40, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.fr + " x min", tablaInicioX + 46, yPrimeraFila + 3);

  // PA (Presión Arterial)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA:", tablaInicioX + 78, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.pa + " mmHg", tablaInicioX + 84, yPrimeraFila + 3);

  // Sat. O2 (Saturación de Oxígeno)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sat. O2:", tablaInicioX + 116, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.satO2 + " %", tablaInicioX + 130, yPrimeraFila + 3);

  // IMC (Índice de Masa Corporal)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC:", tablaInicioX + 154, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.imc + " kg/m2", tablaInicioX + 162, yPrimeraFila + 3);

  // Segunda fila: T°, Peso, Talla
  const ySegundaFila = yPos; // La segunda fila está en la posición actual de yPos
  
  // Temperatura
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T°:", tablaInicioX + 2, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.temperatura + " °C", tablaInicioX + 8, ySegundaFila + 3);

  // Peso
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso:", tablaInicioX + 65, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.peso + " kg", tablaInicioX + 75, ySegundaFila + 3);

  // Talla
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla:", tablaInicioX + 128, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.talla + " cm", tablaInicioX + 140, ySegundaFila + 3);

  yPos += filaAltura;

  // === SECCIÓN 3: CONDICIONES MÉDICAS ===
  // Función para dibujar header de condiciones médicas con columnas SI/NO
  const dibujarHeaderCondiciones = (titulo, yPos, alturaHeader = 5) => {
    const leftMargin = 10;
    const colTexto = 170;
    const colNo = 10;
    const colSi = 10;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196);
    doc.rect(leftMargin, yPos, colTexto + colNo + colSi, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(leftMargin, yPos, leftMargin + colTexto + colNo + colSi, yPos); // Superior
    doc.line(leftMargin, yPos + alturaHeader, leftMargin + colTexto + colNo + colSi, yPos + alturaHeader); // Inferior
    doc.line(leftMargin, yPos, leftMargin, yPos + alturaHeader); // Izquierda
    doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + alturaHeader); // División texto/opciones
    doc.line(leftMargin + colTexto + colNo, yPos, leftMargin + colTexto + colNo, yPos + alturaHeader); // División NO/SI
    doc.line(leftMargin + colTexto + colNo + colSi, yPos, leftMargin + colTexto + colNo + colSi, yPos + alturaHeader); // Derecha
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(titulo, leftMargin + 2, yPos + 3);
    doc.text("SI", leftMargin + colTexto + colNo/2, yPos + 3, { align: "center" });
    doc.text("NO", leftMargin + colTexto + colNo + colSi/2, yPos + 3, { align: "center" });
    
    return yPos + alturaHeader;
  };

  // Header de condiciones médicas
  yPos = dibujarHeaderCondiciones("3. El / La presenta o ha presentado en los últimos 6 meses:", yPos, 5);

  // Lista de condiciones médicas
  const condiciones = [
    { texto: "Cirugía mayor reciente", campo: "cirugiaMayor" },
    { texto: "Desórdenes de la coagulación, trombosis, etc.", campo: "desordenesCoagulacion" },
    { texto: "Diabetes Mellitus", campo: "diabetes" },
    { texto: "Hipertensión Arterial", campo: "hipertension" },
    { texto: "Embarazo", campo: "embarazo" },
    { texto: "Problemas neurológicos: epilepsia, vértigo, etc.", campo: "problemasNeurologicos" },
    { texto: "Infecciones recientes (especialmente oídos, nariz, garganta)", campo: "infeccionesRecientes" },
    { texto: "Obesidad Mórbida (IMC mayor a 35 m/kg2)", campo: "obesidadMorbida" },
    { texto: "Problemas Cardíacos: marcapasos, coronariopatía, etc.", campo: "problemasCardiacos" },
    { texto: "Problemas Respiratorios: asma, EPOC, etc.", campo: "problemasRespiratorios" },
    { texto: "Problemas Oftalmológicos: retinopatía, glaucoma, etc.", campo: "problemasOftalmologicos" },
    { texto: "Problemas Digestivos: úlcera péptica, hepatitis, etc.", campo: "problemasDigestivos" },
    { texto: "Apnea del Sueño", campo: "apneaSueño" },
    { texto: "Alergias", campo: "alergias" },
    { texto: "Otra condición médica importante", campo: "otraCondicion" }
  ];

  const leftMargin = 10;
  const colTexto = 170;
  const colNo = 10;
  const colSi = 10;

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.setLineWidth(0.2);
  
  condiciones.forEach((condicion) => {
    let textoDividido = doc.splitTextToSize(condicion.texto, colTexto - 4);
    let altura = textoDividido.length * 3 + 2;

    // Líneas de la fila
    doc.line(leftMargin, yPos, leftMargin + colTexto + colNo + colSi, yPos); // Superior
    doc.line(leftMargin, yPos + altura, leftMargin + colTexto + colNo + colSi, yPos + altura); // Inferior
    doc.line(leftMargin, yPos, leftMargin, yPos + altura); // Izquierda
    doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + altura); // División texto/opciones
    doc.line(leftMargin + colTexto + colNo, yPos, leftMargin + colTexto + colNo, yPos + altura); // División NO/SI
    doc.line(leftMargin + colTexto + colNo + colSi, yPos, leftMargin + colTexto + colNo + colSi, yPos + altura); // Derecha

    // Texto
    doc.setTextColor(0, 0, 0);
    doc.text(textoDividido, leftMargin + 2, yPos + 3);

    // NO
    if (datosFinales.condiciones[condicion.campo] === false) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", leftMargin + colTexto + colNo + colSi/2, yPos + altura/2 + 1, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    // SI
    if (datosFinales.condiciones[condicion.campo] === true) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", leftMargin + colTexto + colNo/2, yPos + altura/2 + 1, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    // Si es embarazo y está marcado como SI, mostrar campo FUR en la misma línea
    if (condicion.campo === "embarazo" && datosFinales.condiciones[condicion.campo]) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("FUR:", leftMargin + colTexto + colNo + colSi + 5, yPos + 3);
      doc.text(datosFinales.fur || "", leftMargin + colTexto + colNo + colSi + 15, yPos + 3);
    }

    yPos += altura;
  });

  // === USO DE MEDICACIÓN ===
  // Header de medicación
  yPos = dibujarHeaderSeccion("Uso de medicación Actual:", yPos, filaAltura);

  // Calcular altura dinámica para la medicación
  const calcularAlturaMedicacion = (texto, anchoMaximo, fontSize) => {
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
    
    // Altura mínima de 5mm, altura máxima de 20mm (5 líneas)
    return Math.max(lineas * fontSize * 0.35 + 1.5, 5);
  };

  const textoMedicacion = datosFinales.medicacionActual || "";
  const anchoMaximoMedicacion = tablaAncho - 4;
  const alturaFilaMedicacion = calcularAlturaMedicacion(textoMedicacion, anchoMaximoMedicacion, 8);

  // Fila de medicación con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMedicacion); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMedicacion); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaMedicacion, tablaInicioX + tablaAncho, yPos + alturaFilaMedicacion); // Línea inferior

  // Contenido de medicación
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(textoMedicacion, tablaInicioX + 2, yPos + 3, anchoMaximoMedicacion);

  yPos += alturaFilaMedicacion;

  // === SECCIÓN 4: LABORATORIO ===
  // Header de laboratorio
  yPos = dibujarHeaderSeccion("4. LABORATORIO", yPos, filaAltura);

  // === CONTENIDO DE LABORATORIO ===
  // Verificar si existe laboratorio, sino usar valores por defecto
  const laboratorio = datosFinales.laboratorio || {
    hemoglobina: "N/A",
    hematocrito: "N/A", 
    glucosa: "N/A",
    ekg: "N/A"
  };

  // Configuración para 2 columnas
  const anchoColumna = tablaAncho / 2;
  const mitadTabla = tablaInicioX + anchoColumna;

  // === PRIMERA FILA: Hemoglobina y Hematocrito ===
  // Líneas verticales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(mitadTabla, yPos, mitadTabla, yPos + filaAltura); // Línea divisoria central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  // Líneas horizontales
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // Hemoglobina (columna izquierda)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hemoglobina:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(laboratorio.hemoglobina, tablaInicioX + 25, yPos + 3);

  // Hematocrito (columna derecha)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hematocrito:", mitadTabla + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(laboratorio.hematocrito, mitadTabla + 25, yPos + 3);

  yPos += filaAltura;

  // === SEGUNDA FILA: Glucosa y EKG ===
  // Líneas verticales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(mitadTabla, yPos, mitadTabla, yPos + filaAltura); // Línea divisoria central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  // Líneas horizontales
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // Glucosa (columna izquierda)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Glucosa:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(laboratorio.glucosa, tablaInicioX + 20, yPos + 3);

  // EKG (columna derecha)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EKG (>= 45años):", mitadTabla + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Permitir que el texto de EKG se ajuste si es muy largo
  const textoEkg = String(laboratorio.ekg || "");
  const anchoMaximoEkg = anchoColumna - 30;
  if (doc.getTextWidth(textoEkg) > anchoMaximoEkg) {
    dibujarTextoConSaltoLinea(textoEkg, mitadTabla + 30, yPos + 3, anchoMaximoEkg);
  } else {
    doc.text(textoEkg, mitadTabla + 30, yPos + 3);
  }

  yPos += filaAltura;

  // === SECCIÓN 5: OBSERVACIONES Y RECOMENDACIONES ===
  // Header de observaciones
  yPos = dibujarHeaderSeccion("5. OBSERVACIONES Y RECOMENDACIONES", yPos, filaAltura);

  // Procesar observaciones usando normalizeList
  let observacionesLista = normalizeList(datosFinales.observaciones);
  
  // Si no hay observaciones, usar observación por defecto
  if (observacionesLista.length === 0) {
    observacionesLista = ["Sin observaciones adicionales"];
  }
  
  // Crear texto con formato de lista (cada item en una línea con guión)
  // Agregar guión al inicio de cada observación si no lo tiene
  const observacionesTexto = observacionesLista
    .map(item => {
      const itemTrimmed = item.trim();
      // Si ya tiene guión al inicio, mantenerlo; si no, agregarlo
      return itemTrimmed.startsWith('-') ? itemTrimmed : `- ${itemTrimmed}`;
    })
    .join('\n');

  // Calcular altura dinámica usando la función mejorada
  doc.setFont("helvetica", "normal").setFontSize(8);
  const anchoMaximoObservaciones = tablaAncho - 4;
  const alturaFilaObservaciones = calcularAlturaTexto(observacionesTexto, anchoMaximoObservaciones, 8);

  // Dibujar la fila de observaciones con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaObservaciones); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaObservaciones, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones); // Línea inferior

  // Dibujar el texto de las observaciones en formato de lista
  dibujarTextoConSaltoLinea(observacionesTexto, tablaInicioX + 2, yPos + 3, anchoMaximoObservaciones);
  
  yPos += alturaFilaObservaciones;

  // === CERTIFICACIÓN MÉDICA CON FONDO NARANJA ===
  const estadoApto = datosFinales.apto !== undefined ? datosFinales.apto : false;
  const estadoTexto = estadoApto ? "APTO" : "NO APTO";

  // Texto de certificación
  const textoCertificacion = "Conforme a la declaración del / de la paciente y las pruebas complementarias, certifico que se encuentra  ";
  const textoDespues = " para ascender a grandes altitudes (mayor a 2,500 m.s.n.m); sin embargo, no aseguro el desempeño durante el ascenso durante su permanencia.";

  // Combinar todo el texto
  const textoCompletoCertificacion = `${textoCertificacion}${estadoTexto}${textoDespues}`;
  
  // Calcular altura dinámica para la certificación
  const calcularAlturaCertificacion = (texto, anchoMaximo, fontSize) => {
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
    
    // Altura mínima de 8mm, altura máxima de 25mm (6 líneas)
    return Math.max(lineas * fontSize * 0.35 + 1.5, 8);
  };

  const anchoMaximoCertificacion = tablaAncho - 8; // Reducido de 4 a 8 para más margen
  const alturaFilaCertificacion = calcularAlturaCertificacion(textoCompletoCertificacion, anchoMaximoCertificacion, 8);

  // Dibujar fondo naranja para la certificación
  doc.setFillColor(245, 174, 103); // Color naranja
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaCertificacion, 'F');

  // Dibujar líneas de la certificación
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCertificacion); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCertificacion); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaCertificacion, tablaInicioX + tablaAncho, yPos + alturaFilaCertificacion); // Línea inferior

  // Dividir el texto en líneas para poder hacer bold solo el estado
  const certificacionLineas = doc.splitTextToSize(textoCompletoCertificacion, anchoMaximoCertificacion);
  let yCertificacion = yPos;

  certificacionLineas.forEach(linea => {
    // Verificar si la línea contiene el estado
    if (linea.includes(estadoTexto)) {
      // Dividir la línea en partes para poder hacer bold solo el estado
      const partes = linea.split(estadoTexto);

      // Escribir la primera parte
      if (partes[0]) {
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(partes[0], tablaInicioX + 4, yCertificacion + 3);
      }

      // Escribir el estado en bold
      const xPosEstado = tablaInicioX + 4 + doc.getTextWidth(partes[0]);
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(estadoTexto, xPosEstado, yCertificacion + 3);

      // Escribir la última parte
      if (partes[1]) {
        const xPosFinal = xPosEstado + doc.getTextWidth(estadoTexto);
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(partes[1], xPosFinal, yCertificacion + 3);
      }
    } else {
      // Línea normal sin estado
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(linea, tablaInicioX + 4, yCertificacion + 3);
    }
    yCertificacion += 3.5;
  });

  yPos += alturaFilaCertificacion;

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
  const alturaSeccionDeclaracion = 30; // Altura para la sección de declaración (aumentada a 30 para más espacio)
  
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
  const firmaTrabajadorY = yPos + 3; // Subido 5 puntos más arriba
  
  // Calcular centro de la columna 2 para centrar las imágenes
  const centroColumna2X = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
  
  // Agregar firma del trabajador (lado izquierdo)
  const firmaTrabajadorUrl = getSign(data, "FIRMAP");
  console.log("Firma trabajador URL:", firmaTrabajadorUrl);
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30; // Reducido para que quepa al lado de la huella
      const imgHeight = 20;
      const x = centroColumna2X - 20; // Posicionado a la izquierda del centro
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
      console.log("Firma trabajador agregada exitosamente");
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  } else {
    console.log("No se encontró URL de firma del trabajador");
  }

  // Agregar huella del trabajador (lado derecho, vertical)
  const huellaTrabajadorUrl = getSign(data, "HUELLA");
  console.log("Huella trabajador URL:", huellaTrabajadorUrl);
  if (huellaTrabajadorUrl) {
    try {
      const imgWidth = 12; // Vertical
      const imgHeight = 20; // Ajustado para que coincida con la altura de la firma
      const x = centroColumna2X + 8; // Posicionado a la derecha del centro
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
      console.log("Huella trabajador agregada exitosamente");
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  } else {
    console.log("No se encontró URL de huella del trabajador");
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  // Centrar en la columna 2 (ancho de columna: 60px, desde tablaInicioX + 60 hasta tablaInicioX + 120)
  const centroColumna2 = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
  doc.text("Firma y Huella del trabajador", centroColumna2, yPos + 26, { align: "center" }); // Texto debajo de las imágenes

  // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 125;
  const firmaMedicoY = yPos + 3; // Subido 5 puntos más arriba
  
  // Agregar firma y sello médico
  const firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  console.log("Firma médico URL:", firmaMedicoUrl);
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 50;
      const imgHeight = 20;
      const x = firmaMedicoX;
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
      console.log("Firma médico agregada exitosamente");
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  } else {
    console.log("No se encontró URL de firma del médico");
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  // Centrar en la columna 3 (ancho de columna: 70px, desde tablaInicioX + 120 hasta tablaInicioX + 190)
  const centroColumna3 = tablaInicioX + 120 + (70 / 2); // Centro de la columna 3
  doc.text("Sello y Firma del Médico", centroColumna3, yPos + 26, { align: "center" }); // Texto debajo de la imagen
  doc.text("Responsable de la Evaluación", centroColumna3, yPos + 28.5, { align: "center" }); // Texto debajo de la imagen

  yPos += alturaSeccionDeclaracion;







  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 7});

  // === Imprimir ===
  imprimir(doc);
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