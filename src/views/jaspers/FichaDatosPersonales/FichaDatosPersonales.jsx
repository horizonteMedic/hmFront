import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';
import drawColorBox from '../components/ColorBox.jsx';

export default function FichaDatosPersonales(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

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

  const datosFinales = {
    empresa: String(data.empresa ?? datosPrueba.empresa),
    cargo: String(data.cargoPaciente ?? datosPrueba.cargo),
    esEmpleado: (data.tipoTrabajador ?? datosPrueba.tipoTrabajador) === "EMPLEADO",
    esObrero: (data.tipoTrabajador ?? datosPrueba.tipoTrabajador) === "OBRERO",
    fechaIngreso: formatearFechaCorta(data.fechaIngreso) || datosPrueba.fechaIngreso,
    codigoDpto: String(data.codigoDpto ?? datosPrueba.codigoDpto),
    codigoActividad: String(data.codigoActividad ?? datosPrueba.codigoActividad),
    zona: String(data.zona ?? datosPrueba.zona),
    apellidos: String(data.apellidosPaciente ?? datosPrueba.apellidos),
    nombres: String(data.nombresPaciente ?? datosPrueba.nombres),
    sede: String(data.sede ?? data.nombreSede ?? datosPrueba.sede),
    numeroFicha: String(data.norden ?? datosPrueba.numeroFicha),
    codigoColor: String(data.codigoColor ?? datosPrueba.codigoColor),
    textoColor: String(data.textoColor ?? datosPrueba.textoColor),
    // Fecha y lugar de nacimiento
    diaNacimiento: String(data.diaNacimiento ?? datosPrueba.diaNacimiento),
    mesNacimiento: String(data.mesNacimiento ?? datosPrueba.mesNacimiento),
    anioNacimiento: String(data.anioNacimiento ?? datosPrueba.anioNacimiento),
    distritoNacimiento: String(data.distritoNacimiento ?? datosPrueba.distritoNacimiento),
    provinciaNacimiento: String(data.provinciaNacimiento ?? datosPrueba.provinciaNacimiento),
    departamentoNacimiento: String(data.departamentoNacimiento ?? datosPrueba.departamentoNacimiento),
    // Datos adicionales
    dni: String(data.dniPaciente ?? datosPrueba.dni),
    lmNo: String(data.lmNo ?? datosPrueba.lmNo),
    autogenerado: String(data.autogenerado ?? datosPrueba.autogenerado),
    estadoCivil: String(data.estadoCivil ?? datosPrueba.estadoCivil),
    afpSnp: String(data.afpSnp ?? datosPrueba.afpSnp),
    estatura: String(data.estatura ?? datosPrueba.estatura),
    licConducirNo: String(data.licConducirNo ?? datosPrueba.licConducirNo),
    cusspNo: String(data.cusspNo ?? datosPrueba.cusspNo),
    peso: String(data.peso ?? datosPrueba.peso),
    // Domicilio
    direccionDomicilio: String(data.direccionPaciente ?? datosPrueba.direccionDomicilio),
    distritoDomicilio: String(data.distritoDomicilio ?? datosPrueba.distritoDomicilio),
    provinciaDomicilio: String(data.provinciaDomicilio ?? datosPrueba.provinciaDomicilio),
    departamentoDomicilio: String(data.departamentoDomicilio ?? datosPrueba.departamentoDomicilio),
    referenciaDomiciliaria: String(data.referenciaDomiciliaria ?? datosPrueba.referenciaDomiciliaria),
    telefono1: String(data.telefono1 ?? datosPrueba.telefono1),
    tipoViviendaPropia: data.tipoViviendaPropia ?? datosPrueba.tipoViviendaPropia,
    tipoViviendaAlquilada: data.tipoViviendaAlquilada ?? datosPrueba.tipoViviendaAlquilada,
    tipoViviendaOtros: data.tipoViviendaOtros ?? datosPrueba.tipoViviendaOtros,
    telefono2: String(data.telefono2 ?? datosPrueba.telefono2),
    email: String(data.email ?? datosPrueba.email),
    radioFrec: String(data.radioFrec ?? datosPrueba.radioFrec),
    celular: String(data.celular ?? datosPrueba.celular),
    numeroCuentaAhorro: String(data.numeroCuentaAhorro ?? datosPrueba.numeroCuentaAhorro),
    banco: String(data.banco ?? datosPrueba.banco),
    // Emergencia
    emergenciaNombres: String(data.emergenciaNombres ?? datosPrueba.emergenciaNombres),
    emergenciaParentesco: String(data.emergenciaParentesco ?? datosPrueba.emergenciaParentesco),
    emergenciaTelefono: String(data.emergenciaTelefono ?? datosPrueba.emergenciaTelefono),
    emergenciaDomicilio: String(data.emergenciaDomicilio ?? datosPrueba.emergenciaDomicilio),
    emergenciaOtraReferencia: String(data.emergenciaOtraReferencia ?? datosPrueba.emergenciaOtraReferencia),
    // Composición familiar
    composicionFamiliar: data.composicionFamiliar ?? datosPrueba.composicionFamiliar,
    // Instrucción adquirida
    instruccionAdquirida: data.instruccionAdquirida ?? datosPrueba.instruccionAdquirida,
  };

  // Header con logo
  CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

  // Título principal
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE DATOS PERSONALES", pageW / 2, 32, { align: "center" });

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
  });

  // === TABLA DE DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
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
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1Width, yPos, tablaInicioX + col1Width, yPos + filaAltura);
  doc.line(tablaInicioX + contenidoWidth, yPos, tablaInicioX + contenidoWidth, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + contenidoWidth, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + contenidoWidth, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos :", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.apellidos, tablaInicioX + 40, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Nombres:", tablaInicioX + col1Width + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.nombres, tablaInicioX + col1Width + 25, yPos + 3.5);

  // Celda FOTO (ocupa 4 filas)
  doc.line(tablaInicioX + contenidoWidth, yPos, tablaInicioX + contenidoWidth, yPos + fotoHeight);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + fotoHeight);
  doc.line(tablaInicioX + contenidoWidth, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX + contenidoWidth, yPos + fotoHeight, tablaInicioX + tablaAncho, yPos + fotoHeight);

  // Rectángulo gris para FOTO
  doc.setFillColor(180, 180, 180);
  doc.rect(tablaInicioX + contenidoWidth + 3, yPos + 2, fotoWidth - 6, fotoHeight - 4, 'F');

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("FOTO", tablaInicioX + contenidoWidth + fotoWidth / 2, yPos + fotoHeight / 2 + 2, { align: "center" });

  yPos += filaAltura;

  // === FILA 2: Codigo Actividad + Zona ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1Width, yPos, tablaInicioX + col1Width, yPos + filaAltura);
  doc.line(tablaInicioX + contenidoWidth, yPos, tablaInicioX + contenidoWidth, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + contenidoWidth, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + contenidoWidth, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Codigo Actividad :", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.codigoActividad, tablaInicioX + 40, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Zona :", tablaInicioX + col1Width + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.zona, tablaInicioX + col1Width + 15, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 3: Fecha de Ingreso + Código DPTO ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1Width, yPos, tablaInicioX + col1Width, yPos + filaAltura);
  doc.line(tablaInicioX + contenidoWidth, yPos, tablaInicioX + contenidoWidth, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + contenidoWidth, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + contenidoWidth, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha de Ingreso :", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaIngreso, tablaInicioX + 40, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Código DPTO :", tablaInicioX + col1Width + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.codigoDpto, tablaInicioX + col1Width + 30, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 4: CARGO + Empleado/Obrero ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1Width, yPos, tablaInicioX + col1Width, yPos + filaAltura);
  doc.line(tablaInicioX + contenidoWidth, yPos, tablaInicioX + contenidoWidth, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + contenidoWidth, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + contenidoWidth, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cargo :", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.cargo, tablaInicioX + 40, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empleado:", tablaInicioX + col1Width + 2, yPos + 3.5);
  doc.rect(tablaInicioX + col1Width + 20, yPos + 1, 3.5, 3.5);
  if (datosFinales.esEmpleado) {
    doc.text("X", tablaInicioX + col1Width + 20.8, yPos + 3.8);
  }

  doc.text("Obrero:", tablaInicioX + col1Width + 40, yPos + 3.5);
  doc.rect(tablaInicioX + col1Width + 53, yPos + 1, 3.5, 3.5);
  if (datosFinales.esObrero) {
    doc.text("X", tablaInicioX + col1Width + 53.8, yPos + 3.8);
  }

  yPos += filaAltura;

  // === FILA 5: EMPRESA (sin FOTO, solo hasta contenidoWidth) ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + contenidoWidth, yPos, tablaInicioX + contenidoWidth, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + contenidoWidth, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + contenidoWidth, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa :", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.empresa, tablaInicioX + 80, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 6: Fecha y lugar de nacimiento (header con 2 filas de alto) ===
  const filaAlturaDoble = 10;
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

  yPos += filaAlturaDoble;

  // === FILA 7: DNI / C.Ext .Nº | L.M. No. | Autogenerado ===
  const col3Width = 66.67; // 3 columnas iguales

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col3Width, yPos, tablaInicioX + col3Width, yPos + filaAltura);
  doc.line(tablaInicioX + col3Width * 2, yPos, tablaInicioX + col3Width * 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI / C.Ext .Nº.", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.dni, tablaInicioX + 35, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("L.M. No.", tablaInicioX + col3Width + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.lmNo, tablaInicioX + col3Width + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Autogenerado :", tablaInicioX + col3Width * 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.autogenerado, tablaInicioX + col3Width * 2 + 35, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 8: Estado Civil | AFP/SNP | Estatura ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col3Width, yPos, tablaInicioX + col3Width, yPos + filaAltura);
  doc.line(tablaInicioX + col3Width * 2, yPos, tablaInicioX + col3Width * 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado Civil :", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.estadoCivil, tablaInicioX + 30, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("AFP/SNP :", tablaInicioX + col3Width + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.afpSnp, tablaInicioX + col3Width + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estatura :", tablaInicioX + col3Width * 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.estatura, tablaInicioX + col3Width * 2 + 25, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 9: Lic.Conducir No. | CUSSP No. | Peso ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col3Width, yPos, tablaInicioX + col3Width, yPos + filaAltura);
  doc.line(tablaInicioX + col3Width * 2, yPos, tablaInicioX + col3Width * 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Lic.Conducir No.:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.licConducirNo, tablaInicioX + 35, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CUSSP No.:", tablaInicioX + col3Width + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.cusspNo, tablaInicioX + col3Width + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso :", tablaInicioX + col3Width * 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.peso, tablaInicioX + col3Width * 2 + 25, yPos + 3.5);

  yPos += filaAltura;

  // === FILA 10: Direccion del Domicilio | Distrito | Provincia | Departamento (header) ===
  const colDireccion = 75;
  const colDistritoDom = 45;
  const colProvinciaDom = 40;
  const colDepartamentoDom = 40;

  // Header gris
  doc.setFillColor(196, 196, 196);
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
  // Título con fondo gris
  doc.setFillColor(196, 196, 196);
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
    doc.text(familiar.fNacimiento, xCol + colFNacimiento / 2, yPos + 3.5, { align: "center" });
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
    doc.text(familiar.grado, xCol + colGrado / 2, yPos + 3.5, { align: "center" });
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
  doc.line(tablaInicioX + 140, yPos, tablaInicioX + 140, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX + 140, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX + 140, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.emergenciaOtraReferencia, tablaInicioX + 142, yPos + 3.5);
  yPos += filaAltura + 3;

  // === SECCIÓN: INSTRUCCIÓN ADQUIRIDA ===
  // Título con fondo gris
  doc.setFillColor(196, 196, 196);
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

    // Instrucción
    doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
    doc.line(xColInst + colInstruccion, yPos, xColInst + colInstruccion, yPos + filaAltura);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(inst.instruccion, xColInst + colInstruccion / 2, yPos + 3.5, { align: "center" });
    xColInst += colInstruccion;

    // Centro de Estudios
    doc.line(xColInst, yPos, xColInst, yPos + filaAltura);
    doc.line(xColInst + colCentroEstudios, yPos, xColInst + colCentroEstudios, yPos + filaAltura);
    doc.text(inst.centro, xColInst + colCentroEstudios / 2, yPos + 3.5, { align: "center" });
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
    doc.text(inst.grado, xColInst + colGradoObtenido / 2, yPos + 3.5, { align: "center" });

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
  CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

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
  });

  yPos = 38;

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
  // Título con fondo gris
  doc.setFillColor(196, 196, 196);
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
  const colCargoDesempenado = 35;
  const colFechaInicioExp = 25;
  const colFechaTerminoExp = 28;
  const colMotivoSalida = 50;

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
  for (let i = 0; i < 5; i++) {
    xColExp = tablaInicioX;
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colNombreEmpresa, yPos, xColExp + colNombreEmpresa, yPos + filaAltura);
    xColExp += colNombreEmpresa;
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colTelefonoExp, yPos, xColExp + colTelefonoExp, yPos + filaAltura);
    xColExp += colTelefonoExp;
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colCargoDesempenado, yPos, xColExp + colCargoDesempenado, yPos + filaAltura);
    xColExp += colCargoDesempenado;
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colFechaInicioExp, yPos, xColExp + colFechaInicioExp, yPos + filaAltura);
    xColExp += colFechaInicioExp;
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colFechaTerminoExp, yPos, xColExp + colFechaTerminoExp, yPos + filaAltura);
    xColExp += colFechaTerminoExp;
    doc.line(xColExp, yPos, xColExp, yPos + filaAltura);
    doc.line(xColExp + colMotivoSalida, yPos, xColExp + colMotivoSalida, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    yPos += filaAltura;
  }

  yPos += filaAltura;

  // === SECCIÓN: REFERENCIAS PERSONALES ===
  // Título con fondo gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Referencias Personales", pageW / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Header de la tabla Referencias Personales
  const colApellidosNombresRef = 45;
  const colCentroEstudiosRef = 45;
  const colCargoRef = 28;
  const colTelefonoRef = 25;
  const colDireccionRef = 57;

  let xColRef = tablaInicioX;

  // Apellidos y Nombres
  doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
  doc.line(xColRef + colApellidosNombresRef, yPos, xColRef + colApellidosNombresRef, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Apellidos y Nombres", xColRef + colApellidosNombresRef / 2, yPos + 3.5, { align: "center" });
  xColRef += colApellidosNombresRef;

  // Centro de Estudios
  doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
  doc.line(xColRef + colCentroEstudiosRef, yPos, xColRef + colCentroEstudiosRef, yPos + filaAltura);
  doc.text("Centro de Estudios", xColRef + colCentroEstudiosRef / 2, yPos + 3.5, { align: "center" });
  xColRef += colCentroEstudiosRef;

  // Cargo
  doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
  doc.line(xColRef + colCargoRef, yPos, xColRef + colCargoRef, yPos + filaAltura);
  doc.text("Cargo", xColRef + colCargoRef / 2, yPos + 3.5, { align: "center" });
  xColRef += colCargoRef;

  // Teléfono
  doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
  doc.line(xColRef + colTelefonoRef, yPos, xColRef + colTelefonoRef, yPos + filaAltura);
  doc.text("Teléfono", xColRef + colTelefonoRef / 2, yPos + 3.5, { align: "center" });
  xColRef += colTelefonoRef;

  // Dirección
  doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
  doc.line(xColRef + colDireccionRef, yPos, xColRef + colDireccionRef, yPos + filaAltura);
  doc.text("Dirección", xColRef + colDireccionRef / 2, yPos + 3.5, { align: "center" });

  // Líneas horizontales del header
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // 5 filas vacías para Referencias Personales
  for (let i = 0; i < 5; i++) {
    xColRef = tablaInicioX;
    doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
    doc.line(xColRef + colApellidosNombresRef, yPos, xColRef + colApellidosNombresRef, yPos + filaAltura);
    xColRef += colApellidosNombresRef;
    doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
    doc.line(xColRef + colCentroEstudiosRef, yPos, xColRef + colCentroEstudiosRef, yPos + filaAltura);
    xColRef += colCentroEstudiosRef;
    doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
    doc.line(xColRef + colCargoRef, yPos, xColRef + colCargoRef, yPos + filaAltura);
    xColRef += colCargoRef;
    doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
    doc.line(xColRef + colTelefonoRef, yPos, xColRef + colTelefonoRef, yPos + filaAltura);
    xColRef += colTelefonoRef;
    doc.line(xColRef, yPos, xColRef, yPos + filaAltura);
    doc.line(xColRef + colDireccionRef, yPos, xColRef + colDireccionRef, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    yPos += filaAltura;
  }

  yPos += filaAltura;

  // === SECCIÓN: CONDICIONES LABORALES ===
  // Título
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Condiciones Laborales, a cuenta de la Ctta.", tablaInicioX, yPos + 3.5);
  yPos += filaAltura;

  // Fila 1: Sueldo/Jornal | Transporte Terrestre | Viaticos
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Sueldo/Jornal
  doc.text("Sueldo/Jornal:", tablaInicioX, yPos + 3.5);
  doc.text("S/.", tablaInicioX + 28, yPos + 3.5);
  doc.rect(tablaInicioX + 35, yPos + 0.5, 30, filaAltura - 1);
  
  // Transporte Terrestre
  doc.text("Transporte Terrestre", tablaInicioX + 70, yPos + 3.5);
  doc.text("Si", tablaInicioX + 102, yPos + 3.5);
  doc.rect(tablaInicioX + 107, yPos + 0.5, 5, filaAltura - 1);
  doc.text("X", tablaInicioX + 108.5, yPos + 3.5);
  doc.text("No", tablaInicioX + 114, yPos + 3.5);
  doc.rect(tablaInicioX + 120, yPos + 0.5, 5, filaAltura - 1);
  
  // Viaticos
  doc.text("Viaticos", tablaInicioX + 130, yPos + 3.5);
  doc.text("Si", tablaInicioX + 148, yPos + 3.5);
  doc.rect(tablaInicioX + 153, yPos + 0.5, 5, filaAltura - 1);
  doc.text("No", tablaInicioX + 160, yPos + 3.5);
  doc.rect(tablaInicioX + 167, yPos + 0.5, 5, filaAltura - 1);
  doc.text("S/.", tablaInicioX + 175, yPos + 3.5);
  doc.rect(tablaInicioX + 182, yPos + 0.5, 18, filaAltura - 1);
  
  yPos += filaAltura;

  // Fila 2: Sistema Trabajo | Transporte Aéreo
  doc.text("Sistema Trabajo", tablaInicioX, yPos + 3.5);
  doc.rect(tablaInicioX + 35, yPos + 0.5, 30, filaAltura - 1);
  
  // Transporte Aéreo
  doc.text("Transporte Aéreo", tablaInicioX + 70, yPos + 3.5);
  doc.text("Si", tablaInicioX + 102, yPos + 3.5);
  doc.rect(tablaInicioX + 107, yPos + 0.5, 5, filaAltura - 1);
  doc.text("X", tablaInicioX + 108.5, yPos + 3.5);
  doc.text("No", tablaInicioX + 114, yPos + 3.5);
  doc.rect(tablaInicioX + 120, yPos + 0.5, 5, filaAltura - 1);
  doc.text("X", tablaInicioX + 121.5, yPos + 3.5);
  
  yPos += filaAltura;

  // Fila 3: Alimentación A cta. Contrata
  doc.text("Alimentación A cta. Contrata", tablaInicioX, yPos + 3.5);
  yPos += filaAltura;

  // Fila 4: A cta. Contrata
  doc.text("A cta. Contrata", tablaInicioX, yPos + 3.5);
  doc.rect(tablaInicioX + 35, yPos + 0.5, 80, filaAltura - 1);
  yPos += filaAltura * 2;

  // === SECCIÓN: PRE EVALUACIÓN ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Pre Evaluación:", tablaInicioX, yPos + 3.5);
  yPos += filaAltura;

  // Cuadros de PSICOLOGIA y CENTRO MEDICO (centrados)
  const cuadroAlto = 25;
  const cuadroAncho = 35;
  const espacioEntreCuadros = 60;
  const anchoTotalCuadros = cuadroAncho * 2 + espacioEntreCuadros;
  const xInicioCuadros = (pageW - anchoTotalCuadros) / 2;

  // Cuadro PSICOLOGIA
  doc.rect(xInicioCuadros, yPos, cuadroAncho, cuadroAlto);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PSICOLOGIA", xInicioCuadros + cuadroAncho / 2, yPos + cuadroAlto + 4, { align: "center" });

  // Cuadro CENTRO MEDICO
  const xCentroMedico = xInicioCuadros + cuadroAncho + espacioEntreCuadros;
  doc.rect(xCentroMedico, yPos, cuadroAncho, cuadroAlto);
  doc.text("CENTRO MEDICO", xCentroMedico + cuadroAncho / 2, yPos + cuadroAlto + 4, { align: "center" });

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
  
  // Cuadro Huella Digital (centro)
  const huellaAncho = 20;
  const huellaAlto = 25;
  const xHuella = pageW / 2 - huellaAncho / 2;
  doc.rect(xHuella, yPos, huellaAncho, huellaAlto);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Huella Digital", pageW / 2, yPos + huellaAlto + 5, { align: "center" });

  // Firma del Trabajador (izquierda) - bajado 4mm
  doc.line(tablaInicioX + 10, yPos + huellaAlto - 1, tablaInicioX + 55, yPos + huellaAlto - 1);
  doc.text("Firma del Trabajador", tablaInicioX + 32, yPos + huellaAlto + 6, { align: "center" });

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
