import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import autoTable from "jspdf-autotable";
import { getSign } from "../../utils/helpers.js";

export default async function Informe_Ocu_DatosPacientes(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  console.log("ssa")
  // Datos de prueba si no hay data
  const datosPrueba = {
    empresa: "MINERA PODEROSA S.A.",
    cargo: "OPERADOR DE MAQUINARIA",
    tipoTrabajador: "OBRERO",
    fechaIngreso: "17/11/2025",
    numeroFicha: "96639",
    sede: "TRUJILLO",
    codigoColor: "#00FF00",
    textoColor: "AB",
    codigoDpto: "OP-001",
    codigoActividad: "MIN-2024",
    zona: "ZONA NORTE",
    apellidos: "CASTILLO PLASENCIA",
    nombres: "HADY KATHERINE",
    // Fecha y lugar de nacimiento
    diaNacimiento: "23",
    mesNacimiento: "01",
    anioNacimiento: "1994",
    distritoNacimiento: "LA ESPERANZA",
    provinciaNacimiento: "TRUJILLO",
    departamentoNacimiento: "LA LIBERTAD",
    // Datos adicionales
    dni: "72384273",
    lmNo: "123456789",
    autogenerado: "AUTO-2024-001",
    estadoCivil: "SOLTERO",
    afpSnp: "PRIMA AFP",
    estatura: "1.60 m.",
    licConducirNo: "A-III-C",
    cusspNo: "CUSSP-123456",
    peso: "60 Kg.",
    // Domicilio
    direccionDomicilio: "SAC1 URB PARQUE INDUSTRIAL MZ D LT 3",
    distritoDomicilio: "LA ESPERANZA",
    provinciaDomicilio: "TRUJILLO",
    departamentoDomicilio: "LA LIBERTAD",
    referenciaDomiciliaria: "FRENTE AL PARQUE CENTRAL",
    telefono1: "969394955",
    tipoViviendaPropia: true,
    tipoViviendaAlquilada: false,
    tipoViviendaOtros: false,
    telefono2: "044-123456",
    email: "hady.castillo@email.com",
    radioFrec: "145.50 MHz",
    celular: "969394955",
    numeroCuentaAhorro: "193-12345678-0-12",
    banco: "BCP",
    // Emergencia
    emergenciaNombres: "MARIA ELENA PLASENCIA RODRIGUEZ",
    emergenciaParentesco: "MADRE",
    emergenciaTelefono: "969123456",
    emergenciaDomicilio: "JR. LOS PINOS 123",
    emergenciaOtraReferencia: "CERCA AL MERCADO",
    // Composición familiar
    composicionFamiliar: [
      { parentesco: "Padre:", nombres: "JUAN CARLOS CASTILLO LOPEZ", vive: "SI", fNacimiento: "15/03/1965", edad: "59", dni: "18234567", grado: "SECUNDARIA COMPLETA", autogenerado: "-" },
      { parentesco: "Madre:", nombres: "MARIA ELENA PLASENCIA RODRIGUEZ", vive: "SI", fNacimiento: "22/07/1968", edad: "56", dni: "18345678", grado: "SECUNDARIA COMPLETA", autogenerado: "-" },
      { parentesco: "Conviviente:", nombres: "-", vive: "-", fNacimiento: "-", edad: "-", dni: "-", grado: "-", autogenerado: "-" },
      { parentesco: "Esposa:", nombres: "-", vive: "-", fNacimiento: "-", edad: "-", dni: "-", grado: "-", autogenerado: "-" },
      { parentesco: "Hijo:", nombres: "-", vive: "-", fNacimiento: "-", edad: "-", dni: "-", grado: "-", autogenerado: "-" },
      { parentesco: "Hijo:", nombres: "-", vive: "-", fNacimiento: "-", edad: "-", dni: "-", grado: "-", autogenerado: "-" },
      { parentesco: "Hijo:", nombres: "-", vive: "-", fNacimiento: "-", edad: "-", dni: "-", grado: "-", autogenerado: "-" },
      { parentesco: "Hijo:", nombres: "-", vive: "-", fNacimiento: "-", edad: "-", dni: "-", grado: "-", autogenerado: "-" },
      { parentesco: "Hijo:", nombres: "-", vive: "-", fNacimiento: "-", edad: "-", dni: "-", grado: "-", autogenerado: "-" },
    ],
    // Instrucción adquirida
    instruccionAdquirida: [
      { instruccion: "PRIMARIA", centro: "I.E. JOSE OLAYA", fechaInicio: "2000", fechaTermino: "2005", grado: "COMPLETA" },
      { instruccion: "SECUNDARIA", centro: "I.E. SAN MARTIN", fechaInicio: "2006", fechaTermino: "2010", grado: "COMPLETA" },
      { instruccion: "TECNICO", centro: "SENATI", fechaInicio: "2011", fechaTermino: "2013", grado: "TITULADO" },
      { instruccion: "", centro: "", fechaInicio: "", fechaTermino: "", grado: "" },
      { instruccion: "", centro: "", fechaInicio: "", fechaTermino: "", grado: "" },
    ],
  };
  const fecha = data.fechaNacimientoPaciente ?? "";

  const [anio = "", mes = "", dia = ""] = fecha.split("-");
  const datosFinales = {
    contrata: String(data.contrata ?? ""),
    empresa: String(data.empresa ?? ""),
    cargo: String(data.cargoPaciente ?? ""),
    esEmpleado: data.empleado ?? false,
    esObrero: data.obrero ?? false,
    fechaIngreso: formatearFechaCorta(data.fechaIngreso) || "",
    codigoDpto: String(data.codigoDpto ?? ""),
    codigoActividad: String(data.codigoActividad ?? ""),
    zona: String(data.zona ?? ""),
    apellidoMaterno: String(data.apellidoMaterno ?? ""),
    apellidoPaterno: String(data.apellidoPaterno ?? ""),
    apellidos: String(data.apellidosPaciente ?? ""),
    nombres: String(data.nombresPaciente ?? ""),
    sede: String(data.sede ?? data.nombreSede ?? ""),
    numeroFicha: String(data.norden ?? ""),
    codigoColor: String(data.codigoColor ?? ""),
    textoColor: String(data.textoColor ?? ""),

    // Fecha y lugar de nacimiento
    diaNacimiento: String(dia ?? ""),
    mesNacimiento: String(mes ?? ""),
    anioNacimiento: String(anio ?? ""),
    distritoNacimiento: String(data.distrito ?? ""),
    provinciaNacimiento: String(data.provincia ?? ""),
    departamentoNacimiento: String(data.departamento ?? ""),

    // Datos adicionales
    dni: String(data.dniPaciente ?? ""),
    lmNo: String(data.lm ?? ""),
    autogenerado: String(data.autogenerado ?? ""),
    estadoCivil: String(data.estadoCivilPaciente ?? ""),
    afpSnp: String(data.afp ?? ""),
    estatura: String(data.talla ?? ""),
    licConducirNo: String(data.lincenciaConducir ?? ""),
    cusspNo: String(data.cussp ?? ""),
    peso: String(data.peso ?? ""),

    // Domicilio
    direccionDomicilio: String(data.direccionPaciente ?? ""),
    distritoDomicilio: String(data.distrito ?? ""),
    provinciaDomicilio: String(data.provincia ?? ""),
    departamentoDomicilio: String(data.departamento ?? ""),
    referenciaDomiciliaria: String(data.referenciaDomicilio ?? ""),
    telefono1: String(data.telefonoPaciente ?? ""),
    tipoViviendaPropia: data.viviendaPropia ?? false,
    tipoViviendaAlquilada: data.viviendaAlquilada ?? false,
    tipoViviendaOtros: data.viviendaPropia === false && data.viviendaAlquilada === false ? true : false,
    telefono2: String(data.telefono2 ?? ""),
    email: String(data.email ?? ""),
    radioFrec: String(data.radioFrecuencia ?? ""),
    celular: String(data.celularPaciente ?? ""),
    numeroCuentaAhorro: String(data.numeroCuenta ?? ""),
    banco: String(data.banco ?? ""),

    // Emergencia
    emergenciaNombres: String(data.nombreEmergencia ?? ""),
    emergenciaParentesco: String(data.parentescoEmergencia ?? ""),
    emergenciaTelefono: String(data.telefonoEmergencia ?? ""),
    emergenciaDomicilio: String(data.domicilioEmergencia ?? ""),
    emergenciaOtraReferencia: String(data.otraReferenciaEmergencia ?? ""),

    // Composición familiar
    composicionFamiliar: data.composicionFamiliar ?? [],

    // Instrucción adquirida
    instruccionAdquirida: data.instruccionAdquirida ?? [],

    // EXP
    experienciaLaboral: data.experienciaLaboral ?? [],
    referenciasPersonales: data.referenciasPersonales ?? [],
    sueldo: data.sueldo ?? "",
    viaticosDescripcion: data.viaticosDescripcion ?? "",
    sistemaTrabajo: data.sistemaTrabajo ?? "",

    transporteTerrestre: data.transporteTerrestreSi === true ? "SI" :
      data.transporteTerrestreNo === true ? "NO" : "",

    viaticos: data.viaticosSi === true ? "SI" :
      data.viaticosNo === true ? "NO" : "",

    transporteAereo: data.transporteAereoSi === true ? "SI" :
      data.transporteAereoNo === true ? "NO" : "",

    aptitudPoderosa: data.aptitudPoderosaSi ? "es apto" : data.aptitudPoderosaNo ? "no es apto" : ""
  };

  const drawRectWithCenteredText = ({
    doc,
    xText,          // posición X donde termina tu label (ej: después de "EMPRESA :")
    yText,          // baseline del texto
    labelWidth = 25, // ancho ocupado por el label (para separar el rectángulo)
    width = 50,
    height = 8,
    text = "",
    padding = 2
  }) => {

    // 🔹 calcular posición del rectángulo (a la derecha del texto)
    const rectX = xText + labelWidth + padding;
    const rectY = yText - height + 1.5;
    // ajuste fino: jsPDF usa baseline, no top

    // 🔹 dibujar rectángulo
    doc.rect(rectX, rectY, width, height);

    // 🔹 centrar texto horizontalmente
    const textWidth = doc.getTextWidth(text);
    const textX = rectX + (width / 2) - (textWidth / 2);

    // 🔹 centrar texto verticalmente (baseline correction)
    const fontSize = doc.internal.getFontSize();
    const textY = rectY + (height / 2) + (fontSize * 0.35) - 2;

    // 🔹 escribir texto
    doc.text(text, textX, textY);
  };

  // Header con logo
  /*await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

  // Drawer con Nro de ficha, Sede, Fecha (lado derecho) - mismas medidas que Aptitud_medico_ocupacional_11
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 70, 15);

  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 50, 16);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + datosFinales.sede, pageW - 70, 20);
  doc.text("Fecha: " + datosFinales.fechaIngreso, pageW - 70, 25);

  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color (mismas medidas que Aptitud_medico_ocupacional_11)
  drawColorBox(doc, {
    color: datosFinales.codigoColor,
    text: datosFinales.textoColor,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });*/

  // Título principal
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE DATOS", pageW / 2, 10, { align: "center" });

  // === TABLA DE DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 15;
  const filaAltura = 5;

  // Configurar líneas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Dimensiones de la celda FOTO
  const fotoWidth = 25;
  const fotoHeight = 25; // 5 filas de altura (5mm cada una)
  const contenidoWidth = tablaAncho - fotoWidth;
  const col1Width = 90;

  // === FILA 1: Apellidos + Nombres + FOTO (inicio) ===
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EMPRESA :", tablaInicioX + 2, yPos + 3.5);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 2,
    yText: yPos + 3.5,
    labelWidth: 15, // ajusta según tu texto "EMPRESA :"
    width: 180,
    height: 6,
    text: datosFinales.contrata
  });

  doc.text("CARGO :", tablaInicioX + 4, yPos + 14);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 4,
    yText: yPos + 14,
    labelWidth: 15, // ajusta según tu texto "EMPRESA :"
    width: 70,
    height: 6,
    text: datosFinales.cargo
  });

  doc.text("EMPLEADO :", tablaInicioX + 115, yPos + 12);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 115,
    yText: yPos + 12,
    labelWidth: 17, // ajusta según tu texto "EMPRESA :"
    width: 15,
    height: 4,
    text: `${datosFinales.esEmpleado ? "X" : ""}`
  });

  doc.text("OBRERO :", tablaInicioX + 118, yPos + 16);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 115,
    yText: yPos + 16,
    labelWidth: 17, // ajusta según tu texto "EMPRESA :"
    width: 15,
    height: 4,
    text: `${datosFinales.esObrero ? "X" : ""}`
  });

  doc.line(tablaInicioX + contenidoWidth, yPos + 6, tablaInicioX + contenidoWidth, yPos + fotoHeight + 6);
  doc.line(tablaInicioX + tablaAncho, yPos + 6, tablaInicioX + tablaAncho, yPos + fotoHeight + 6);
  doc.line(tablaInicioX + contenidoWidth, yPos + 6, tablaInicioX + tablaAncho, yPos + 6);
  doc.line(tablaInicioX + contenidoWidth, yPos + fotoHeight + 6, tablaInicioX + tablaAncho, yPos + fotoHeight + 6);

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("FOTO", tablaInicioX + contenidoWidth + fotoWidth / 2, yPos + fotoHeight / 2 + 6, { align: "center" });

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha de Ingreso :", tablaInicioX + 6, yPos + 26);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 6,
    yText: yPos + 26,
    labelWidth: 25, // ajusta según tu texto "EMPRESA :"
    width: 30,
    height: 5,
    text: datosFinales.fechaIngreso
  });

  doc.text("Código DPTO :", tablaInicioX + 118, yPos + 26);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 118,
    yText: yPos + 26,
    labelWidth: 19, // ajusta según tu texto "EMPRESA :"
    width: 25,
    height: 5,
    text: datosFinales.codigoDpto
  });

  doc.text("Codigo Actividad :", tablaInicioX + 6, yPos + 33);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 6,
    yText: yPos + 33,
    labelWidth: 25, // ajusta según tu texto "EMPRESA :"
    width: 30,
    height: 5,
    text: datosFinales.codigoActividad
  });

  doc.text("Zona :", tablaInicioX + 130, yPos + 32);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 118,
    yText: yPos + 32,
    labelWidth: 19, // ajusta según tu texto "EMPRESA :"
    width: 25,
    height: 5,
    text: datosFinales.zona
  });

  yPos += filaAltura + 35;

  // === FILA X: Apellidos y Nombres (2 filas de alto) ===
  const filaAlturaDoble = 10;
  // Mismo ancho total que el bloque anterior (200)
  const colApPaterno = 50;   // 25%
  const colApMaterno = 50;   // 25%
  const colNombres = 100;    // 50%

  let xHeader2 = tablaInicioX;

  // === Apellido Paterno ===
  doc.line(xHeader2, yPos, xHeader2, yPos + filaAlturaDoble);
  doc.line(xHeader2 + colApPaterno, yPos, xHeader2 + colApPaterno, yPos + filaAlturaDoble);
  doc.line(xHeader2, yPos, xHeader2 + colApPaterno, yPos);
  doc.line(xHeader2, yPos + filaAltura, xHeader2 + colApPaterno, yPos + filaAltura);
  doc.line(xHeader2, yPos + filaAlturaDoble, xHeader2 + colApPaterno, yPos + filaAlturaDoble);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellido Paterno", xHeader2 + colApPaterno / 2, yPos + 3.5, { align: "center" });

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(
    datosFinales.apellidoPaterno || "",
    xHeader2 + colApPaterno / 2,
    yPos + 8,
    { align: "center", maxWidth: colApPaterno - 2 }
  );

  xHeader2 += colApPaterno;


  // === Apellido Materno ===
  doc.line(xHeader2, yPos, xHeader2, yPos + filaAlturaDoble);
  doc.line(xHeader2 + colApMaterno, yPos, xHeader2 + colApMaterno, yPos + filaAlturaDoble);
  doc.line(xHeader2, yPos, xHeader2 + colApMaterno, yPos);
  doc.line(xHeader2, yPos + filaAltura, xHeader2 + colApMaterno, yPos + filaAltura);
  doc.line(xHeader2, yPos + filaAlturaDoble, xHeader2 + colApMaterno, yPos + filaAlturaDoble);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellido Materno", xHeader2 + colApMaterno / 2, yPos + 3.5, { align: "center" });

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(
    datosFinales.apellidoMaterno || "",
    xHeader2 + colApMaterno / 2,
    yPos + 8,
    { align: "center", maxWidth: colApMaterno - 2 }
  );

  xHeader2 += colApMaterno;


  // === Nombres Completos ===
  doc.line(xHeader2, yPos, xHeader2, yPos + filaAlturaDoble);
  doc.line(xHeader2 + colNombres, yPos, xHeader2 + colNombres, yPos + filaAlturaDoble);
  doc.line(xHeader2, yPos, xHeader2 + colNombres, yPos);
  doc.line(xHeader2, yPos + filaAltura, xHeader2 + colNombres, yPos + filaAltura);
  doc.line(xHeader2, yPos + filaAlturaDoble, xHeader2 + colNombres, yPos + filaAlturaDoble);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Nombres Completos", xHeader2 + colNombres / 2, yPos + 3.5, { align: "center" });

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(
    datosFinales.nombres || "",
    xHeader2 + colNombres / 2,
    yPos + 8,
    { align: "center", maxWidth: colNombres - 2 }
  );

  // Avanzar posición
  yPos += filaAlturaDoble + 4;


  // === FILA 6: Fecha y lugar de nacimiento (header con 2 filas de alto) ===

  const colFechaLugar = 25; // Columna "Fecha y lugar de nacimiento"
  const colDia = 15;
  const colMes = 15;
  const colAnio = 15;
  const colDistrito = 45;
  const colProvincia = 40;
  const colDepartamento = 45;

  // Celda "Fecha y lugar de nacimiento" (2 filas de alto)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaDoble);
  doc.line(tablaInicioX + colFechaLugar, yPos, tablaInicioX + colFechaLugar, yPos + filaAlturaDoble);
  doc.line(tablaInicioX, yPos, tablaInicioX + colFechaLugar, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaDoble, tablaInicioX + colFechaLugar, yPos + filaAlturaDoble);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha y lugar", tablaInicioX + 2, yPos + 4);
  doc.text("de nacimiento:", tablaInicioX + 2, yPos + 7.5);

  // Headers: Día, Mes, Año, Distrito, Provincia, Departamento
  let xHeader = tablaInicioX + colFechaLugar;

  // Día
  doc.line(xHeader, yPos, xHeader, yPos + filaAlturaDoble);
  doc.line(xHeader + colDia, yPos, xHeader + colDia, yPos + filaAlturaDoble);
  doc.line(xHeader, yPos, xHeader + colDia, yPos);
  doc.line(xHeader, yPos + filaAltura, xHeader + colDia, yPos + filaAltura);
  doc.line(xHeader, yPos + filaAlturaDoble, xHeader + colDia, yPos + filaAlturaDoble);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Día", xHeader + colDia / 2, yPos + 3.5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.diaNacimiento, xHeader + colDia / 2, yPos + 8, { align: "center" });
  xHeader += colDia;

  // Mes
  doc.line(xHeader, yPos, xHeader, yPos + filaAlturaDoble);
  doc.line(xHeader + colMes, yPos, xHeader + colMes, yPos + filaAlturaDoble);
  doc.line(xHeader, yPos, xHeader + colMes, yPos);
  doc.line(xHeader, yPos + filaAltura, xHeader + colMes, yPos + filaAltura);
  doc.line(xHeader, yPos + filaAlturaDoble, xHeader + colMes, yPos + filaAlturaDoble);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Mes", xHeader + colMes / 2, yPos + 3.5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.mesNacimiento, xHeader + colMes / 2, yPos + 8, { align: "center" });
  xHeader += colMes;

  // Año
  doc.line(xHeader, yPos, xHeader, yPos + filaAlturaDoble);
  doc.line(xHeader + colAnio, yPos, xHeader + colAnio, yPos + filaAlturaDoble);
  doc.line(xHeader, yPos, xHeader + colAnio, yPos);
  doc.line(xHeader, yPos + filaAltura, xHeader + colAnio, yPos + filaAltura);
  doc.line(xHeader, yPos + filaAlturaDoble, xHeader + colAnio, yPos + filaAlturaDoble);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Año", xHeader + colAnio / 2, yPos + 3.5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.anioNacimiento, xHeader + colAnio / 2, yPos + 8, { align: "center" });
  xHeader += colAnio;

  // Distrito
  doc.line(xHeader, yPos, xHeader, yPos + filaAlturaDoble);
  doc.line(xHeader + colDistrito, yPos, xHeader + colDistrito, yPos + filaAlturaDoble);
  doc.line(xHeader, yPos, xHeader + colDistrito, yPos);
  doc.line(xHeader, yPos + filaAltura, xHeader + colDistrito, yPos + filaAltura);
  doc.line(xHeader, yPos + filaAlturaDoble, xHeader + colDistrito, yPos + filaAlturaDoble);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Distrito", xHeader + colDistrito / 2, yPos + 3.5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.distritoNacimiento, xHeader + colDistrito / 2, yPos + 8, { align: "center" });
  xHeader += colDistrito;

  // Provincia
  doc.line(xHeader, yPos, xHeader, yPos + filaAlturaDoble);
  doc.line(xHeader + colProvincia, yPos, xHeader + colProvincia, yPos + filaAlturaDoble);
  doc.line(xHeader, yPos, xHeader + colProvincia, yPos);
  doc.line(xHeader, yPos + filaAltura, xHeader + colProvincia, yPos + filaAltura);
  doc.line(xHeader, yPos + filaAlturaDoble, xHeader + colProvincia, yPos + filaAlturaDoble);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Provincia", xHeader + colProvincia / 2, yPos + 3.5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.provinciaNacimiento, xHeader + colProvincia / 2, yPos + 8, { align: "center" });
  xHeader += colProvincia;

  // Departamento
  doc.line(xHeader, yPos, xHeader, yPos + filaAlturaDoble);
  doc.line(xHeader + colDepartamento, yPos, xHeader + colDepartamento, yPos + filaAlturaDoble);
  doc.line(xHeader, yPos, xHeader + colDepartamento, yPos);
  doc.line(xHeader, yPos + filaAltura, xHeader + colDepartamento, yPos + filaAltura);
  doc.line(xHeader, yPos + filaAlturaDoble, xHeader + colDepartamento, yPos + filaAlturaDoble);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Departamento", xHeader + colDepartamento / 2, yPos + 3.5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.departamentoNacimiento, xHeader + colDepartamento / 2, yPos + 8, { align: "center" });

  yPos += filaAlturaDoble + 4;

  doc.text("DNI / C.Ext. .N°:", tablaInicioX + 2, yPos + 4);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 2,
    yText: yPos + 4,
    labelWidth: 20, // ajusta según tu texto "EMPRESA :"
    width: 50,
    height: 5,
    text: datosFinales.dni
  });

  doc.text("Estado Civil:", tablaInicioX + 6, yPos + 9);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 2,
    yText: yPos + 9,
    labelWidth: 20, // ajusta según tu texto "EMPRESA :"
    width: 50,
    height: 5,
    text: datosFinales.estadoCivil
  });

  doc.text("Lic Conducir No:", tablaInicioX + 2, yPos + 14);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 2,
    yText: yPos + 14,
    labelWidth: 20, // ajusta según tu texto "EMPRESA :"
    width: 50,
    height: 5,
    text: datosFinales.licConducirNo
  });

  //part2
  doc.text("L.M. No.:", tablaInicioX + 85, yPos + 4);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 80,
    yText: yPos + 4,
    labelWidth: 18, // ajusta según tu texto "EMPRESA :"
    width: 40,
    height: 5,
    text: datosFinales.lmNo
  });

  doc.text("AFP/SNP:", tablaInicioX + 84, yPos + 9);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 80,
    yText: yPos + 9,
    labelWidth: 18, // ajusta según tu texto "EMPRESA :"
    width: 40,
    height: 5,
    text: datosFinales.afpSnp
  });

  doc.text("CUSSP No:", tablaInicioX + 82, yPos + 14);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 78,
    yText: yPos + 14,
    labelWidth: 20, // ajusta según tu texto "EMPRESA :"
    width: 40,
    height: 5,
    text: datosFinales.cusspNo
  });

  //part3
  doc.text("Autogenerado:", tablaInicioX + 149, yPos + 4);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 150,
    yText: yPos + 4,
    labelWidth: 18, // ajusta según tu texto "EMPRESA :"
    width: 30,
    height: 5,
    text: datosFinales.autogenerado
  });

  doc.text("Estatura:", tablaInicioX + 156, yPos + 9);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 150,
    yText: yPos + 9,
    labelWidth: 18, // ajusta según tu texto "EMPRESA :"
    width: 30,
    height: 5,
    text: datosFinales.estatura
  });

  doc.text("Peso:", tablaInicioX + 160, yPos + 14);
  drawRectWithCenteredText({
    doc,
    xText: tablaInicioX + 150,
    yText: yPos + 14,
    labelWidth: 18, // ajusta según tu texto "EMPRESA :"
    width: 30,
    height: 5,
    text: datosFinales.peso
  });


  yPos += 21


  // === FILA 10: Direccion del Domicilio | Distrito | Provincia | Departamento (header) ===
  const colDireccion = 75;
  const colDistritoDom = 45;
  const colProvinciaDom = 40;
  const colDepartamentoDom = 40;

  // Header gris NO
  doc.setFillColor(255, 255, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colDireccion, yPos, tablaInicioX + colDireccion, yPos + filaAltura);
  doc.line(tablaInicioX + colDireccion + colDistritoDom, yPos, tablaInicioX + colDireccion + colDistritoDom, yPos + filaAltura);
  doc.line(tablaInicioX + colDireccion + colDistritoDom + colProvinciaDom, yPos, tablaInicioX + colDireccion + colDistritoDom + colProvinciaDom, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Direccion del Domicilio :", tablaInicioX + colDireccion / 2, yPos + 3.5, { align: "center" });
  doc.text("Distrito :", tablaInicioX + colDireccion + colDistritoDom / 2, yPos + 3.5, { align: "center" });
  doc.text("Provincia :", tablaInicioX + colDireccion + colDistritoDom + colProvinciaDom / 2, yPos + 3.5, { align: "center" });
  doc.text("Departamento :", tablaInicioX + colDireccion + colDistritoDom + colProvinciaDom + colDepartamentoDom / 2, yPos + 3.5, { align: "center" });

  yPos += filaAltura;

  // === FILA 11: Valores de Direccion del Domicilio ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colDireccion, yPos, tablaInicioX + colDireccion, yPos + filaAltura);
  doc.line(tablaInicioX + colDireccion + colDistritoDom, yPos, tablaInicioX + colDireccion + colDistritoDom, yPos + filaAltura);
  doc.line(tablaInicioX + colDireccion + colDistritoDom + colProvinciaDom, yPos, tablaInicioX + colDireccion + colDistritoDom + colProvinciaDom, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.direccionDomicilio, tablaInicioX + 2, yPos + 3.5);
  doc.text(datosFinales.distritoDomicilio, tablaInicioX + colDireccion + colDistritoDom / 2, yPos + 3.5, { align: "center" });
  doc.text(datosFinales.provinciaDomicilio, tablaInicioX + colDireccion + colDistritoDom + colProvinciaDom / 2, yPos + 3.5, { align: "center" });
  doc.text(datosFinales.departamentoDomicilio, tablaInicioX + colDireccion + colDistritoDom + colProvinciaDom + colDepartamentoDom / 2, yPos + 3.5, { align: "center" });

  yPos += filaAltura;

  // === FILA 12: Referencia Domiciliaria | Teléfono 1 ===
  const colReferencia = 130;
  const colTelefono = 70;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colReferencia, yPos, tablaInicioX + colReferencia, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Referencia Domiciliaria:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.referenciaDomiciliaria, tablaInicioX + 45, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Teléfono 1 :", tablaInicioX + colReferencia + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.telefono1, tablaInicioX + colReferencia + 25, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 13: Tipo vivienda (Propia X, Alquilada, Otros) | Teléfono 2 ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colReferencia, yPos, tablaInicioX + colReferencia, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tipo vivienda", tablaInicioX + 2, yPos + 3.5);

  doc.text("Propia", tablaInicioX + 35, yPos + 3.5);
  doc.rect(tablaInicioX + 50, yPos + 1, 3.5, 3.5);
  if (datosFinales.tipoViviendaPropia) {
    doc.text("X", tablaInicioX + 50.8, yPos + 3.8);
  }

  doc.text("Alquilada", tablaInicioX + 65, yPos + 3.5);
  doc.rect(tablaInicioX + 85, yPos + 1, 3.5, 3.5);
  if (datosFinales.tipoViviendaAlquilada) {
    doc.text("X", tablaInicioX + 85.8, yPos + 3.8);
  }

  doc.text("Otros", tablaInicioX + 100, yPos + 3.5);
  doc.rect(tablaInicioX + 115, yPos + 1, 3.5, 3.5);
  if (datosFinales.tipoViviendaOtros) {
    doc.text("X", tablaInicioX + 115.8, yPos + 3.8);
  }

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Teléfono 2 :", tablaInicioX + colReferencia + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.telefono2, tablaInicioX + colReferencia + 25, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 14: E-mail | Radio Frec. | Celular ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 70, yPos, tablaInicioX + 70, yPos + filaAltura);
  doc.line(tablaInicioX + colReferencia, yPos, tablaInicioX + colReferencia, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("E-mail :", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.email, tablaInicioX + 18, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Radio Frec.", tablaInicioX + 72, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.radioFrec, tablaInicioX + 95, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Celular :", tablaInicioX + colReferencia + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.celular, tablaInicioX + colReferencia + 25, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 15: Número Cuenta de Ahorro | Banco ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colReferencia, yPos, tablaInicioX + colReferencia, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Número  Cuenta de Ahorro :", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.numeroCuentaAhorro, tablaInicioX + 50, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Banco :", tablaInicioX + colReferencia + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.banco, tablaInicioX + colReferencia + 20, yPos + 3.5);

  yPos += filaAltura;

  // === SECCIÓN: COMPOSICIÓN FAMILIAR ===
  // Título con fondo gris NO
  doc.setFillColor(255, 255, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Composición Familiar", pageW / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Definir anchos de columnas
  const colParentesco = 20;
  const colApellidosNombres = 50;
  const colVive = 15;
  const colFNacimiento = 25;
  const colEdad = 12;
  const colDNI = 25;
  const colGrado = 28;
  const colAutogenerado = 25;

  // Header de la tabla
  doc.setFillColor(255, 255, 255);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  let xCol = tablaInicioX;

  // Parentesco
  doc.line(xCol, yPos, xCol, yPos + filaAltura);
  doc.line(xCol + colParentesco, yPos, xCol + colParentesco, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Parentesco", xCol + colParentesco / 2, yPos + 3.5, { align: "center" });
  xCol += colParentesco;

  // Apellidos y Nombres
  doc.line(xCol, yPos, xCol, yPos + filaAltura);
  doc.line(xCol + colApellidosNombres, yPos, xCol + colApellidosNombres, yPos + filaAltura);
  doc.text("Apellidos y Nombres", xCol + colApellidosNombres / 2, yPos + 3.5, { align: "center" });
  xCol += colApellidosNombres;

  // Vive?
  doc.line(xCol, yPos, xCol, yPos + filaAltura);
  doc.line(xCol + colVive, yPos, xCol + colVive, yPos + filaAltura);
  doc.text("Vive?", xCol + colVive / 2, yPos + 3.5, { align: "center" });
  xCol += colVive;

  // F.Nacimiento
  doc.line(xCol, yPos, xCol, yPos + filaAltura);
  doc.line(xCol + colFNacimiento, yPos, xCol + colFNacimiento, yPos + filaAltura);
  doc.text("F.Nacimiento", xCol + colFNacimiento / 2, yPos + 3.5, { align: "center" });
  xCol += colFNacimiento;

  // Edad
  doc.line(xCol, yPos, xCol, yPos + filaAltura);
  doc.line(xCol + colEdad, yPos, xCol + colEdad, yPos + filaAltura);
  doc.text("Edad", xCol + colEdad / 2, yPos + 3.5, { align: "center" });
  xCol += colEdad;

  // DNI/Part. Nac.
  doc.line(xCol, yPos, xCol, yPos + filaAltura);
  doc.line(xCol + colDNI, yPos, xCol + colDNI, yPos + filaAltura);
  doc.text("DNI/Part. Nac.", xCol + colDNI / 2, yPos + 3.5, { align: "center" });
  xCol += colDNI;

  // Grado
  doc.line(xCol, yPos, xCol, yPos + filaAltura);
  doc.line(xCol + colGrado, yPos, xCol + colGrado, yPos + filaAltura);
  doc.text("Grado", xCol + colGrado / 2, yPos + 3.5, { align: "center" });
  xCol += colGrado;

  // Autogenerado ó Nº
  doc.line(xCol, yPos, xCol, yPos + filaAltura);
  doc.line(xCol + colAutogenerado, yPos, xCol + colAutogenerado, yPos + filaAltura);
  doc.text("Autogenerado ó Nº", xCol + colAutogenerado / 2, yPos + 3.5, { align: "center" });

  // Líneas horizontales del header
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  yPos += filaAltura;

  // Filas de datos (Padre, Madre, Conviviente, Esposa, 5 Hijos)
  datosFinales.composicionFamiliar.forEach((familiar) => {
    xCol = tablaInicioX;
    console.log("familiar", familiar)
    // Parentesco
    doc.line(xCol, yPos, xCol, yPos + filaAltura);
    doc.line(xCol + colParentesco, yPos, xCol + colParentesco, yPos + filaAltura);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(familiar.parentesco, xCol + colParentesco / 2, yPos + 3.5, { align: "center" });
    xCol += colParentesco;

    // Apellidos y Nombres
    doc.line(xCol, yPos, xCol, yPos + filaAltura);
    doc.line(xCol + colApellidosNombres, yPos, xCol + colApellidosNombres, yPos + filaAltura);
    doc.setFontSize(5);
    doc.text(familiar.nombres, xCol + 1, yPos + 3.5);
    doc.setFontSize(7);
    xCol += colApellidosNombres;

    // Vive? Si o No
    doc.line(xCol, yPos, xCol, yPos + filaAltura);
    doc.line(xCol + colVive, yPos, xCol + colVive, yPos + filaAltura);
    doc.text(familiar.vive, xCol + colVive / 2, yPos + 3.5, { align: "center" });
    xCol += colVive;

    // F.Nacimiento
    doc.line(xCol, yPos, xCol, yPos + filaAltura);
    doc.line(xCol + colFNacimiento, yPos, xCol + colFNacimiento, yPos + filaAltura);
    doc.text(String(familiar.fechaNacimiento ?? ""), xCol + colFNacimiento / 2, yPos + 3.5, { align: "center" });
    xCol += colFNacimiento;

    // Edad
    doc.line(xCol, yPos, xCol, yPos + filaAltura);
    doc.line(xCol + colEdad, yPos, xCol + colEdad, yPos + filaAltura);
    doc.text(familiar.edad, xCol + colEdad / 2, yPos + 3.5, { align: "center" });
    xCol += colEdad;

    // DNI/Part. Nac.
    doc.line(xCol, yPos, xCol, yPos + filaAltura);
    doc.line(xCol + colDNI, yPos, xCol + colDNI, yPos + filaAltura);
    doc.text(familiar.dni, xCol + colDNI / 2, yPos + 3.5, { align: "center" });
    xCol += colDNI;

    // Grado
    doc.line(xCol, yPos, xCol, yPos + filaAltura);
    doc.line(xCol + colGrado, yPos, xCol + colGrado, yPos + filaAltura);
    doc.setFontSize(5);
    doc.text(String(familiar.gradoInstruccion), xCol + colGrado / 2, yPos + 3.5, { align: "center" });
    doc.setFontSize(7);
    xCol += colGrado;

    // Autogenerado ó Nº
    doc.line(xCol, yPos, xCol, yPos + filaAltura);
    doc.line(xCol + colAutogenerado, yPos, xCol + colAutogenerado, yPos + filaAltura);
    doc.text(familiar.autogenerado, xCol + colAutogenerado / 2, yPos + 3.5, { align: "center" });

    // Líneas horizontales
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    yPos += filaAltura;
  });

  yPos += filaAltura;

  // === SECCIÓN: EN CASO DE EMERGENCIA NOTIFICAR A ===
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("EN CASO DE EMERGENCIA NOTIFICAR A:", tablaInicioX, yPos + 3.5);
  yPos += filaAltura + 2;

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres", tablaInicioX, yPos + 3.5);
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + 40, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX + 40, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.emergenciaNombres, tablaInicioX + 42, yPos + 3.5);
  yPos += filaAltura + 3;

  // Parentesco | Teléfono
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Parentesco", tablaInicioX, yPos + 3.5);
  doc.line(tablaInicioX + 25, yPos, tablaInicioX + 25, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + 25, yPos, tablaInicioX + 100, yPos);
  doc.line(tablaInicioX + 25, yPos + filaAltura, tablaInicioX + 100, yPos + filaAltura);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.emergenciaParentesco, tablaInicioX + 27, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Teléfono", tablaInicioX + 120, yPos + 3.5);
  doc.line(tablaInicioX + 140, yPos, tablaInicioX + 140, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX + 140, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX + 140, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.emergenciaTelefono, tablaInicioX + 142, yPos + 3.5);
  yPos += filaAltura + 3;

  // Domicilio | Otra Referencia
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio", tablaInicioX, yPos + 3.5);
  doc.line(tablaInicioX + 25, yPos, tablaInicioX + 25, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + 25, yPos, tablaInicioX + 100, yPos);
  doc.line(tablaInicioX + 25, yPos + filaAltura, tablaInicioX + 100, yPos + filaAltura);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.emergenciaDomicilio, tablaInicioX + 27, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Otra Referencia", tablaInicioX + 105, yPos + 3.5);
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX + 130, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "normal").setFontSize(5);
  doc.text(datosFinales.emergenciaOtraReferencia, tablaInicioX + 132, yPos + 3.5);
  yPos += filaAltura + 3;

  // === SECCIÓN: INSTRUCCIÓN ADQUIRIDA ===
  // Título con fondo grisNO
  doc.setFillColor(255, 255, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Instrucción Adquirida", pageW / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Header de la tabla Instrucción Adquirida
  const colInstruccion = 40;
  const colCentroEstudios = 50;
  const colFechaInicio = 30;
  const colFechaTermino = 35;
  const colGradoObtenido = 45;

  let xColInst = tablaInicioX;

  // Instrucción
  doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
  doc.line(xColInst + colInstruccion, yPos, xColInst + colInstruccion, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Instrucción", xColInst + colInstruccion / 2, yPos + 3.5, { align: "center" });
  xColInst += colInstruccion;

  // Centro de Estudios
  doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
  doc.line(xColInst + colCentroEstudios, yPos, xColInst + colCentroEstudios, yPos + filaAltura);
  doc.text("Centro de Estudios", xColInst + colCentroEstudios / 2, yPos + 3.5, { align: "center" });
  xColInst += colCentroEstudios;

  // Fecha Inicio
  doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
  doc.line(xColInst + colFechaInicio, yPos, xColInst + colFechaInicio, yPos + filaAltura);
  doc.text("Fecha Inicio", xColInst + colFechaInicio / 2, yPos + 3.5, { align: "center" });
  xColInst += colFechaInicio;

  // Fecha Término
  doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
  doc.line(xColInst + colFechaTermino, yPos, xColInst + colFechaTermino, yPos + filaAltura);
  doc.text("Fecha Término", xColInst + colFechaTermino / 2, yPos + 3.5, { align: "center" });
  xColInst += colFechaTermino;

  // Grado Obtenido
  doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
  doc.line(xColInst + colGradoObtenido, yPos, xColInst + colGradoObtenido, yPos + filaAltura);
  doc.text("Grado Obtenido", xColInst + colGradoObtenido / 2, yPos + 3.5, { align: "center" });

  // Líneas horizontales del header
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // 5 filas para Instrucción Adquirida con datos
  datosFinales.instruccionAdquirida.forEach((inst) => {
    xColInst = tablaInicioX;
    console.log("items", inst)
    // Instrucción
    doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
    doc.line(xColInst + colInstruccion, yPos, xColInst + colInstruccion, yPos + filaAltura);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(inst.instruccion, xColInst + colInstruccion / 2, yPos + 3.5, { align: "center" });
    xColInst += colInstruccion;

    // Centro de Estudios
    doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
    doc.line(xColInst + colCentroEstudios, yPos, xColInst + colCentroEstudios, yPos + filaAltura);
    doc.text(String(inst.centroEstudio), xColInst + colCentroEstudios / 2, yPos + 3.5, { align: "center" });
    xColInst += colCentroEstudios;

    // Fecha Inicio
    doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
    doc.line(xColInst + colFechaInicio, yPos, xColInst + colFechaInicio, yPos + filaAltura);
    doc.text(inst.fechaInicio, xColInst + colFechaInicio / 2, yPos + 3.5, { align: "center" });
    xColInst += colFechaInicio;

    // Fecha Término
    doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
    doc.line(xColInst + colFechaTermino, yPos, xColInst + colFechaTermino, yPos + filaAltura);
    doc.text(inst.fechaTermino, xColInst + colFechaTermino / 2, yPos + 3.5, { align: "center" });
    xColInst += colFechaTermino;

    // Grado Obtenido
    doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
    doc.line(xColInst + colGradoObtenido, yPos, xColInst + colGradoObtenido, yPos + filaAltura);
    doc.text(String(inst.gradoObtenido), xColInst + colGradoObtenido / 2, yPos + 3.5, { align: "center" });

    // Líneas horizontales
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    yPos += filaAltura;
  });

  // Footer página 1
  footerTR(doc, { footerOffsetY: 5 });

  // === PÁGINA 2 ===
  doc.addPage();

  // Header página 2
  /*await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE DATOS PERSONALES", pageW / 2, 32, { align: "center" });

  // Drawer página 2
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 70, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 50, 16);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + datosFinales.sede, pageW - 70, 20);
  doc.text("Fecha: " + datosFinales.fechaIngreso, pageW - 70, 25);
  doc.text("Pag. 02", pageW - 30, 10);

  drawColorBox(doc, {
    color: datosFinales.codigoColor,
    text: datosFinales.textoColor,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });*/
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setLineWidth(0.2);
  yPos = 12;

  // === SECCIÓN: CAPACITACIÓN ===
  // Header de la tabla Capacitación
  const colCapacitacion = 40;
  const colCentroCapacitacion = 50;
  const colFechaInicioC = 30;
  const colFechaTerminoC = 35;
  const colGradoObtenidoC = 45;

  let xColCap = tablaInicioX;

  // Capacitación
  doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
  doc.line(xColCap + colCapacitacion, yPos, xColCap + colCapacitacion, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Capacitación", xColCap + colCapacitacion / 2, yPos + 3.5, { align: "center" });
  xColCap += colCapacitacion;

  // Centro de Estudios
  doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
  doc.line(xColCap + colCentroCapacitacion, yPos, xColCap + colCentroCapacitacion, yPos + filaAltura);
  doc.text("Centro de Estudios", xColCap + colCentroCapacitacion / 2, yPos + 3.5, { align: "center" });
  xColCap += colCentroCapacitacion;

  // Fecha Inicio
  doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
  doc.line(xColCap + colFechaInicioC, yPos, xColCap + colFechaInicioC, yPos + filaAltura);
  doc.text("Fecha Inicio", xColCap + colFechaInicioC / 2, yPos + 3.5, { align: "center" });
  xColCap += colFechaInicioC;

  // Fecha Término
  doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
  doc.line(xColCap + colFechaTerminoC, yPos, xColCap + colFechaTerminoC, yPos + filaAltura);
  doc.text("Fecha Término", xColCap + colFechaTerminoC / 2, yPos + 3.5, { align: "center" });
  xColCap += colFechaTerminoC;

  // Grado Obtenido
  doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
  doc.line(xColCap + colGradoObtenidoC, yPos, xColCap + colGradoObtenidoC, yPos + filaAltura);
  doc.text("Grado Obtenido", xColCap + colGradoObtenidoC / 2, yPos + 3.5, { align: "center" });

  // Líneas horizontales del header
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // 4 filas vacías para Capacitación
  for (let i = 0; i < 4; i++) {
    xColCap = tablaInicioX;
    doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
    doc.line(xColCap + colCapacitacion, yPos, xColCap + colCapacitacion, yPos + filaAltura);
    xColCap += colCapacitacion;
    doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
    doc.line(xColCap + colCentroCapacitacion, yPos, xColCap + colCentroCapacitacion, yPos + filaAltura);
    xColCap += colCentroCapacitacion;
    doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
    doc.line(xColCap + colFechaInicioC, yPos, xColCap + colFechaInicioC, yPos + filaAltura);
    xColCap += colFechaInicioC;
    doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
    doc.line(xColCap + colFechaTerminoC, yPos, xColCap + colFechaTerminoC, yPos + filaAltura);
    xColCap += colFechaTerminoC;
    doc.line(xColCap, yPos, xColCap, yPos + filaAltura);
    doc.line(xColCap + colGradoObtenidoC, yPos, xColCap + colGradoObtenidoC, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    yPos += filaAltura;
  }

  yPos += filaAltura;

  // === SECCIÓN: EXPERIENCIA LABORAL ===
  // Título con fondo grisNO
  doc.setFillColor(255, 255, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Experiencia Laboral (Comenzar por último empleo)", pageW / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Header de la tabla Experiencia Laboral
  const colNombreEmpresa = 40;
  const colTelefonoExp = 22;
  const colCargoDesempenado = 45;
  const colFechaInicioExp = 25;
  const colFechaTerminoExp = 28;
  const colMotivoSalida = 40;

  let xColExp = tablaInicioX;

  // Nombre de la Empresa
  doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
  doc.line(xColExp + colNombreEmpresa, yPos, xColExp + colNombreEmpresa, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Nombre de la Empresa", xColExp + colNombreEmpresa / 2, yPos + 3.5, { align: "center" });
  xColExp += colNombreEmpresa;

  // Teléfono
  doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
  doc.line(xColExp + colTelefonoExp, yPos, xColExp + colTelefonoExp, yPos + filaAltura);
  doc.text("Teléfono", xColExp + colTelefonoExp / 2, yPos + 3.5, { align: "center" });
  xColExp += colTelefonoExp;

  // Cargo Desempeñado
  doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
  doc.line(xColExp + colCargoDesempenado, yPos, xColExp + colCargoDesempenado, yPos + filaAltura);
  doc.text("Cargo Desempeñado", xColExp + colCargoDesempenado / 2, yPos + 3.5, { align: "center" });
  xColExp += colCargoDesempenado;

  // Fecha Inicio
  doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
  doc.line(xColExp + colFechaInicioExp, yPos, xColExp + colFechaInicioExp, yPos + filaAltura);
  doc.text("Fecha Inicio", xColExp + colFechaInicioExp / 2, yPos + 3.5, { align: "center" });
  xColExp += colFechaInicioExp;

  // Fecha Término
  doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
  doc.line(xColExp + colFechaTerminoExp, yPos, xColExp + colFechaTerminoExp, yPos + filaAltura);
  doc.text("Fecha Término", xColExp + colFechaTerminoExp / 2, yPos + 3.5, { align: "center" });
  xColExp += colFechaTerminoExp;

  // Motivo de Salida
  doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
  doc.line(xColExp + colMotivoSalida, yPos, xColExp + colMotivoSalida, yPos + filaAltura);
  doc.text("Motivo de Salida", xColExp + colMotivoSalida / 2, yPos + 3.5, { align: "center" });

  // Líneas horizontales del header
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // 5 filas vacías para Experiencia Laboral
  const dataExp = datosFinales.experienciaLaboral || [];

  for (let i = 0; i < 5; i++) {
    const exp = dataExp[i] || {};
    console.log('EXP', exp)
    xColExp = tablaInicioX;

    doc.setFont("helvetica", "normal").setFontSize(7);

    // Nombre de la Empresa
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colNombreEmpresa, yPos, xColExp + colNombreEmpresa, yPos + filaAltura);
    doc.text(String(exp.empresa || "-"), xColExp + colNombreEmpresa / 2, yPos + 3.5, { align: "center" });
    xColExp += colNombreEmpresa;

    // Teléfono
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colTelefonoExp, yPos, xColExp + colTelefonoExp, yPos + filaAltura);
    doc.text(String(exp.telefono || "-"), xColExp + colTelefonoExp / 2, yPos + 3.5, { align: "center" });
    xColExp += colTelefonoExp;

    // Cargo
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colCargoDesempenado, yPos, xColExp + colCargoDesempenado, yPos + filaAltura);
    doc.text(String(exp.cargoDesemp || "-"), xColExp + colCargoDesempenado / 2, yPos + 3.5, { align: "center" });
    xColExp += colCargoDesempenado;

    // Fecha Inicio
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colFechaInicioExp, yPos, xColExp + colFechaInicioExp, yPos + filaAltura);
    doc.text(String(exp.fechaInicio || "-"), xColExp + colFechaInicioExp / 2, yPos + 3.5, { align: "center" });
    xColExp += colFechaInicioExp;

    // Fecha Término
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colFechaTerminoExp, yPos, xColExp + colFechaTerminoExp, yPos + filaAltura);
    doc.text(String(exp.fechaTermino || "-"), xColExp + colFechaTerminoExp / 2, yPos + 3.5, { align: "center" });
    xColExp += colFechaTerminoExp;

    // Motivo de Salida
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colMotivoSalida, yPos, xColExp + colMotivoSalida, yPos + filaAltura);
    doc.text(String(exp.motivoSalida || "-"), xColExp + colMotivoSalida / 2, yPos + 3.5, { align: "center" });

    // Líneas horizontales
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    yPos += filaAltura;
  }

  yPos += filaAltura;

  // === SECCIÓN: REFERENCIAS PERSONALES ===
  // Título con fondo gris NO
  doc.setFillColor(255, 255, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Header de la tabla Referencias Personales
  const colApellidosNombresRef = 45;
  const colCentroEstudiosRef = 45;
  const colCargoRef = 28;
  const colTelefonoRef = 25;
  const colDireccionRef = 57;

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Referencias Personales", pageW / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  /// Datos
  const dataRef = datosFinales.referenciasPersonales || [];

  // Siempre 5 filas (como tu lógica original)
  const bodyData = [];
  for (let i = 0; i < 5; i++) {
    const ref = dataRef[i] || {};
    bodyData.push([
      ref.nombres || "-",
      ref.centroTrab || "-",
      ref.cargoDesemp || "-",
      ref.telefono || "-",
      ref.direccion || "-"
    ]);
  }

  // AutoTable
  autoTable(doc, {
    startY: yPos,
    margin: { left: tablaInicioX, right: 10 },

    tableWidth: tablaAncho,

    head: [[
      "Apellidos y Nombres",
      "Centro de Estudios",
      "Cargo",
      "Teléfono",
      "Dirección"
    ]],

    body: bodyData,

    styles: {
      font: "helvetica",
      fontSize: 7,
      halign: "center",     // horizontal
      valign: "middle",     // 🔥 centrado vertical real
      cellPadding: 1.5,
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
      textColor: 0,
    },

    headStyles: {
      fontStyle: "bold",
      fillColor: [255, 255, 255], // blanco (como tu diseño)
      textColor: 0,
    },

    columnStyles: {
      0: { cellWidth: colApellidosNombresRef },
      1: { cellWidth: colCentroEstudiosRef },
      2: { cellWidth: colCargoRef },
      3: { cellWidth: colTelefonoRef },
      4: { cellWidth: colDireccionRef },
    },
    theme: "grid",

    didDrawPage: (data) => {
      // actualizar yPos para lo siguiente
      yPos = data.cursor.y;
    }
  });

  // espacio extra (como tu código)
  yPos += filaAltura;

  // === SECCIÓN: CONDICIONES LABORALES ===
  // Título
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Condiciones Laborales, a cuenta de la Ctta.", tablaInicioX, yPos + 3.5);
  yPos += filaAltura;

  // Fila 1: Sueldo/Jornal | Transporte Terrestre | Viaticos
  doc.setFont("helvetica", "normal").setFontSize(8);

  const drawInputText = (text, x, y, width, height) => {
    const padding = 2;
    const maxWidth = width - padding * 2;

    const lines = doc.splitTextToSize(String(text || "-"), maxWidth);
    const lineHeight = 3;

    const textBlockHeight = lines.length * lineHeight;

    let yText = y + (height - textBlockHeight) / 2 + lineHeight * 0.7;

    lines.forEach(line => {
      if (yText < y + height - 0.5) {
        doc.text(line, x + width / 2, yText, {
          maxWidth,
          align: "center"
        });
        yText += lineHeight;
      }
    });
  };

  // Sueldo/Jornal
  doc.text("Sueldo/Jornal:", tablaInicioX, yPos + 3.5);
  doc.text("S/.", tablaInicioX + 28, yPos + 3.5);
  doc.rect(tablaInicioX + 35, yPos + 0.5, 30, filaAltura - 1);

  drawInputText(
    datosFinales.sueldo,
    tablaInicioX + 35,
    yPos + 0.5,
    30,
    filaAltura - 1
  );

  // Transporte Terrestre
  doc.text("Transporte Terrestre", tablaInicioX + 70, yPos + 3.5);
  doc.text("Si", tablaInicioX + 102, yPos + 3.5);
  doc.rect(tablaInicioX + 107, yPos + 0.5, 5, filaAltura - 1);
  doc.text("No", tablaInicioX + 114, yPos + 3.5);
  doc.rect(tablaInicioX + 120, yPos + 0.5, 5, filaAltura - 1);
  if (datosFinales.transporteTerrestre === "SI") {
    doc.text("X", tablaInicioX + 108.5, yPos + 3.5);
  } else {
    doc.text("X", tablaInicioX + 121.5, yPos + 3.5);
  }

  // Viaticos
  doc.text("Viaticos", tablaInicioX + 130, yPos + 3.5);
  doc.text("Si", tablaInicioX + 148, yPos + 3.5);
  doc.rect(tablaInicioX + 153, yPos + 0.5, 5, filaAltura - 1);
  doc.text("No", tablaInicioX + 160, yPos + 3.5);
  doc.rect(tablaInicioX + 167, yPos + 0.5, 5, filaAltura - 1);
  if (datosFinales.viaticos === "SI") {
    doc.text("X", tablaInicioX + 154.5, yPos + 3.5);
  } else {
    doc.text("X", tablaInicioX + 168.5, yPos + 3.5);
  }
  const altoExtra = filaAltura * 4;

  doc.rect(tablaInicioX + 175, yPos + 0.5, 25, altoExtra - 1);

  drawInputText(
    datosFinales.viaticosDescripcion,
    tablaInicioX + 175,
    yPos + 0.5,
    25,
    altoExtra - 1
  );

  // IMPORTANTE: mover el cursor

  yPos += filaAltura;

  // Fila 2: Sistema Trabajo | Transporte Aéreo
  doc.text("Sistema Trabajo", tablaInicioX, yPos + 3.5);
  doc.rect(tablaInicioX + 35, yPos + 0.5, 30, filaAltura - 1);

  drawInputText(
    datosFinales.sistemaTrabajo,
    tablaInicioX + 35,
    yPos + 0.5,
    30,
    filaAltura - 1
  );

  // Transporte Aéreo
  doc.text("Transporte Aéreo", tablaInicioX + 70, yPos + 3.5);
  doc.text("Si", tablaInicioX + 102, yPos + 3.5);
  doc.rect(tablaInicioX + 107, yPos + 0.5, 5, filaAltura - 1);
  doc.text("No", tablaInicioX + 114, yPos + 3.5);
  doc.rect(tablaInicioX + 120, yPos + 0.5, 5, filaAltura - 1);
  if (datosFinales.transporteAereo === "SI") {
    doc.text("X", tablaInicioX + 108.5, yPos + 3.5);
  } else {
    doc.text("X", tablaInicioX + 121.5, yPos + 3.5);
  }
  yPos += filaAltura;

  // Fila 3: Alimentación A cta. Contrata
  doc.text("Alimentación A cta. Contrata", tablaInicioX, yPos + 3.5);
  yPos += filaAltura;

  // Fila 4: A cta. Contrata
  doc.text("A cta. Contrata", tablaInicioX, yPos + 3.5);
  doc.rect(tablaInicioX + 35, yPos + 0.5, 80, filaAltura - 1);

  drawInputText(
    datosFinales.cuentaContrata,
    tablaInicioX + 35,
    yPos + 0.5,
    80,
    filaAltura - 1
  );
  yPos += filaAltura * 2;

  // === SECCIÓN: PRE EVALUACIÓN ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Pre Evaluación:", tablaInicioX, yPos + 3.5);

  doc.text(`Aptitud Altura 1.8 mt: el trabajador ${datosFinales.aptitudPoderosa} para trabajar altura mayor a 25 m`, tablaInicioX + 20, yPos - 1);

  yPos += filaAltura;
  //SELO


  // Cuadros de PSICOLOGIA y CENTRO MEDICO (centrados)
  const cuadroAlto = 25;
  const cuadroAncho = 35;
  const espacioEntreCuadros = 60;
  const anchoTotalCuadros = cuadroAncho * 2 + espacioEntreCuadros;
  const xInicioCuadros = (pageW - anchoTotalCuadros) / 2;
  const sellofirma = await getSign(data, "SELLOFIRMA");
  const sellofirmaDoc = await getSign(data, "SELLOFIRMADOCASIG");
  console.log(sellofirmaDoc)
  // Cuadro PSICOLOGIA
  doc.rect(xInicioCuadros, yPos, cuadroAncho, cuadroAlto);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PSICOLOGIA", xInicioCuadros + cuadroAncho / 2, yPos + cuadroAlto + 4, { align: "center" });
  if (sellofirma) {
    const padding = 4;

    const imgW = cuadroAncho - padding;
    const imgH = cuadroAlto - padding;

    const imgX = xInicioCuadros + (cuadroAncho - imgW) / 2;
    const imgY = yPos + (cuadroAlto - imgH) / 2;

    doc.addImage(sellofirma, "JPEG", imgX, imgY, imgW, imgH);
  }

  // Cuadro CENTRO MEDICO
  const xCentroMedico = xInicioCuadros + cuadroAncho + espacioEntreCuadros;
  doc.rect(xCentroMedico, yPos, cuadroAncho, cuadroAlto);
  doc.text("CENTRO MEDICO", xCentroMedico + cuadroAncho / 2, yPos + cuadroAlto + 4, { align: "center" });
  if (sellofirmaDoc) {
    const padding = 4;

    const imgW = cuadroAncho - padding;
    const imgH = cuadroAlto - padding;

    const imgX = xCentroMedico + (cuadroAncho - imgW) / 2;
    const imgY = yPos + (cuadroAlto - imgH) / 2;

    doc.addImage(sellofirmaDoc, "JPEG", imgX, imgY, imgW, imgH);
  }

  // === Imagen central (APTO / NO APTO) ===
  let imgEstado = null;

  if (data.apto || data.aptoRestriccion) {
    imgEstado = "/img/DatosPacientes/APTO.png";
  } else if (data.noApto) {
    imgEstado = "/img/DatosPacientes/NOAPTO.png";
  }

  if (imgEstado) {
    const imgSize = cuadroAncho - 15; // mismo tamaño que referencia
    const separacion = 6;

    // === IZQUIERDA de PSICOLOGIA ===
    const imgXLeft = xInicioCuadros - separacion - imgSize;
    const imgYLeft = yPos + (cuadroAlto - imgSize) / 2;

    doc.addImage(imgEstado, "PNG", imgXLeft, imgYLeft, imgSize, imgSize);

    // === DERECHA de CENTRO MEDICO ===
    const imgXRight = xCentroMedico + cuadroAncho + separacion;
    const imgYRight = yPos + (cuadroAlto - imgSize) / 2;

    doc.addImage(imgEstado, "PNG", imgXRight, imgYRight, imgSize, imgSize);
  }

  // Grupo Sanguíneo (alineado con Pre Evaluación)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Grupo Sang.", tablaInicioX + 160, yPos - filaAltura + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("O+", tablaInicioX + 185, yPos - filaAltura + 3.5);

  yPos += cuadroAlto + 8;

  // Línea horizontal separadora
  doc.setLineWidth(0.5);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.setLineWidth(0.2);
  yPos += filaAltura;

  // === SECCIÓN: FIRMAS ===
  yPos += 3; // Bajar 3mm

  const firmap = await getSign(data, "FIRMAP");
  const huellap = await getSign(data, "HUELLA");

  // Cuadro Huella Digital (centro)
  const huellaAncho = 20;
  const huellaAlto = 25;
  const xHuella = pageW / 2 - huellaAncho / 2;
  doc.rect(xHuella, yPos, huellaAncho, huellaAlto);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Huella Digital", pageW / 2, yPos + huellaAlto + 5, { align: "center" });
  if (huellap) {
    const imgW = huellaAncho - 4; // pequeño padding interno
    const imgH = huellaAlto - 4;

    const imgX = xHuella + (huellaAncho - imgW) / 2;
    const imgY = yPos + (huellaAlto - imgH) / 2;

    doc.addImage(huellap, "JPEG", imgX, imgY, imgW, imgH);
  }

  // Firma del Trabajador (izquierda) - bajado 4mm
  doc.line(tablaInicioX + 10, yPos + huellaAlto - 1, tablaInicioX + 55, yPos + huellaAlto - 1);
  doc.text("Firma del Trabajador", tablaInicioX + 32, yPos + huellaAlto + 6, { align: "center" });
  const centerXFirma = (tablaInicioX + 10 + tablaInicioX + 55) / 2;
  if (firmap) {
    const imgW = 30;   // ajusta según tu escala
    const imgH = 12;

    const imgX = centerXFirma - imgW / 2;
    const imgY = (yPos + huellaAlto - 1) - imgH - 1; // encima de la línea

    doc.addImage(firmap, "JPEG", imgX, imgY, imgW, imgH);
  }
  // Firma y sello de contratista (derecha) - bajado 4mm
  doc.line(tablaInicioX + 145, yPos + huellaAlto - 1, tablaInicioX + 195, yPos + huellaAlto - 1);
  doc.text("Firma y sello de contratista", tablaInicioX + 170, yPos + huellaAlto + 6, { align: "center" });

  yPos += huellaAlto + 13;

  // Fecha y Lugar (centrado)
  doc.setFont("helvetica", "bold").setFontSize(8);

  // Obtener fecha actual formateada
  const fechaActual = new Date();
  const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const fechaFormateada = `${diasSemana[fechaActual.getDay()]} ${fechaActual.getDate()} ${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;

  const textoFechaLugar = `Fecha y Lugar:        ${datosFinales.sede},        ${fechaFormateada}`;
  doc.text(textoFechaLugar, pageW / 2, yPos, { align: "center" });

  // Footer
  footerTR(doc, { footerOffsetY: 5 });

  // Imprimir
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
