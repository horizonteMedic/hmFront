import jsPDF from "jspdf";
import headerFicha from "./headers/header_FichaAudiologica_Digitalizado.jsx";

export default function FichaAudiologica_Digitalizado(
  data = {},
  mostrarGrafico = true,
  firmaExtra = true
) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const usableW = pageW - 2 * margin;
  let y = 32;

  // 1) Header
  headerFicha(doc, data);

  // const datos = {
  //   norden: "95899",
  //   marca: "AMPLIVOX",
  //   modelo: "BELL PLUS",
  //   calibracion: "01/07/2025",
  //   fechaExamen: "24/10/2025",
  //   tipoExamen: "PreOcupacional",
  //   nombres: "ROJAS SIGUENZA JOSUE SPENCER",
  //   edad: "29",
  //   sexo: "M",
  //   ocupacion: "ADMINISTRADOR ESPECIALISTA",
  //   aniosTrabajo: "5",
  //   contrata: "CONSTRUCTORA E INMOBILIARIA JAMELY E.I. R.L.",
  //   empresa: "EMPRESA DEL AREA PRINCIPAL DE GRANDES ZONAS XYZ S.A.C.",
  //   tiempoExposicion: "5 H/D",

  //   tapones: true,
  //   orejeras: true,
  //   ruidoMuyIntenso: true,
  //   ruidoModerado: true,
  //   ruidoNoMolesto: true,

  //   consumoTabaco: false,
  //   servicioMilitar: true,
  //   hobbiesRuido: false,
  //   exposicionQuimicos: true,
  //   infeccionOidoAntecente: false,
  //   ototoxicos: true,

  //   disminucionAudicion: true,
  //   dolorOidos: false,
  //   zumbido: true,
  //   mareos: false,
  //   infeccionOidoActual: true,
  //   otros: false,

  //   txtDod250: "40",
  //   txtDod500: "20",
  //   txtDod1000: "30",

  //   txtDoi250: "10",
  //   txtDoi500: "15",
  //   txtDoi1000: "60",

  //   txtLDUmbralDiscriminacion: "20",
  //   txtLIUmbralDiscriminacion: "10",

  //   txtLDPorcentajeDiscriminacion: "80",
  //   txtLIPorcentajeDiscriminacion: "50",

  //   txtLDConfort: "70",
  //   txtLIConfort: "60",

  //   txtLDDisconfort: "90",
  //   txtLIDisconfort: "100",

  //   diagnostico:
  //     "El paciente presenta una pérdida auditiva leve en el oído derecho y una pérdida auditiva moderada en el oído izquierdo.",
  //   txtResponsable: "SHIRLEY KATHERINE GUTIERREZ ARTEAGA",
  //   txtMedico: "DR. JUAN PEREZ GARCIA",

  //   od500: null,
  //   od1000: null,
  //   od2000: null,
  //   od3000: null,
  //   od4000: null,
  //   od6000: null,
  //   od8000: null,

  //   oi500: 20,
  //   oi1000: null,
  //   oi2000: null,
  //   oi3000: null,
  //   oi4000: null,
  //   oi6000: null,
  //   oi8000: null,

  //   od1_500: 30,
  //   od1_1000: null,
  //   od1_2000: null,
  //   od1_3000: null,
  //   od1_4000: null,
  //   od1_6000: null,
  //   od1_8000: 90,

  //   oi1_500: null,
  //   oi1_1000: null,
  //   oi1_2000: null,
  //   oi1_3000: 65,
  //   oi1_4000: null,
  //   oi1_6000: null,
  //   oi1_8000: 95,
  // };

  const obtener = (name) => {
    return data[name] || "";
  };
  function limpiarNumero(valor) {
    if (valor === undefined || valor === null || !mostrarGrafico) return null;
    const v = String(valor).trim();

    if (v === "" || v === "N/A" || v === "-") {
      return null;
    }

    // Verifica si el string representa un número válido
    const esNumeroValido = /^-?\d+(\.\d+)?$/.test(v);

    return esNumeroValido ? Number(v) : null;
  }

  const datos = {
    norden: obtener("norden"),
    marca: obtener("txtMarca"),
    modelo: obtener("txtModelo"),
    calibracion: data.fechaCalibracion,
    fechaExamen: data.fechaExamen,
    tipoExamen: obtener("nomExam"),
    nombres: obtener("nombres"),
    edad: obtener("edad"),
    sexo: obtener("genero"),
    ocupacion: obtener("ocupacion"),
    aniosTrabajo: obtener("tiempoTrabajo"),
    contrata: obtener("contrata"),
    empresa: obtener("empresa"),
    tiempoExposicion: obtener("tiempoExposicionTotalPonderado"),

    tapones: data.chkTapones,
    orejeras: data.chkgrajeras,
    ruidoMuyIntenso: data.chkIntenso,
    ruidoModerado: data.chkModerado,
    ruidoNoMolesto: data.chkNoMolesto,

    consumoTabaco: data.chk1Si,
    servicioMilitar: data.chk2Si,
    hobbiesRuido: data.chk3Si,
    exposicionQuimicos: data.chk4Si,
    infeccionOidoAntecente: data.chk5Si,
    ototoxicos: data.chk6Si,

    disminucionAudicion: data.chk7Si,
    dolorOidos: data.chk8Si,
    zumbido: data.chk9Si,
    mareos: data.chk10Si,
    infeccionOidoActual: data.chk11Si,
    otros: data.chk12Si,

    txtOtoscopia: obtener("txtOtoscopia"),

    txtDod250: obtener("txtDod250"),
    txtDod500: obtener("txtDod500"),
    txtDod1000: obtener("txtDod1000"),

    txtDoi250: obtener("txtDoi250"),
    txtDoi500: obtener("txtDoi500"),
    txtDoi1000: obtener("txtDoi1000"),

    txtLDUmbralDiscriminacion: obtener("txtLDUmbralDiscriminacion"),
    txtLIUmbralDiscriminacion: obtener("txtLIUmbralDiscriminacion"),

    txtLDPorcentajeDiscriminacion: obtener("txtLDPorcentajeDiscriminacion"),
    txtLIPorcentajeDiscriminacion: obtener("txtLIPorcentajeDiscriminacion"),

    txtLDConfort: obtener("txtLDConfort"),
    txtLIConfort: obtener("txtLIConfort"),

    txtLDDisconfort: obtener("txtLDDisconfort"),
    txtLIDisconfort: obtener("txtLIDisconfort"),

    diagnostico: obtener("diagnostico"),
    txtResponsable: obtener("txtResponsable"),
    txtMedico: obtener("txtMedico"),

    od500: limpiarNumero(data.od500),
    od1000: limpiarNumero(data.od1000),
    od2000: limpiarNumero(data.od2000),
    od3000: limpiarNumero(data.od3000),
    od4000: limpiarNumero(data.od4000),
    od6000: limpiarNumero(data.od6000),
    od8000: limpiarNumero(data.od8000),

    oi500: limpiarNumero(data.oi500),
    oi1000: limpiarNumero(data.oi1000),
    oi2000: limpiarNumero(data.oi2000),
    oi3000: limpiarNumero(data.oi3000),
    oi4000: limpiarNumero(data.oi4000),
    oi6000: limpiarNumero(data.oi6000),
    oi8000: limpiarNumero(data.oi8000),

    od1_500: limpiarNumero(data.od1_500),
    od1_1000: limpiarNumero(data.od1_1000),
    od1_2000: limpiarNumero(data.od1_2000),
    od1_3000: limpiarNumero(data.od1_3000),
    od1_4000: limpiarNumero(data.od1_4000),
    od1_6000: limpiarNumero(data.od1_6000),
    od1_8000: limpiarNumero(data.od1_8000),

    oi1_500: limpiarNumero(data.oi1_500),
    oi1_1000: limpiarNumero(data.oi1_1000),
    oi1_2000: limpiarNumero(data.oi1_2000),
    oi1_3000: limpiarNumero(data.oi1_3000),
    oi1_4000: limpiarNumero(data.oi1_4000),
    oi1_6000: limpiarNumero(data.oi1_6000),
    oi1_8000: limpiarNumero(data.oi1_8000),
  };

  // 2) Título
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("FICHA AUDIOLOGICA", pageW / 2, y, { align: "center" });
  y += 6;

  // === NUEVO: Usar imagen de fondo para la cabecera ===
  const fondoImg = "/img/frame_ficha.png";
  const fondoH = 95; // altura aproximada de la cabecera en mm (ajusta si es necesario)
  let yHeader = 40;
  try {
    doc.addImage(fondoImg, "PNG", margin, yHeader, usableW, fondoH);
  } catch (e) {
    doc.text("Imagen de cabecera no disponible", margin, yHeader + 10);
  }

  // === 2) Datos de cabecera (cada uno con su propia posición para moverlos individualmente) ===
  // Puedes ajustar cada x/y a tu gusto
  doc.setFont("helvetica", "normal").setFontSize(9);

  // N° Orden
  const xNorden = margin + 104; // más a la derecha
  const yNorden = margin + 39; // un poco más abajo
  doc.setFont("helvetica", "bold").setFontSize(15);
  doc.text(String(datos.norden || ""), xNorden, yNorden);
  doc.setFont("helvetica", "normal").setFontSize(9); // restaurar tamaño para los demás

  // Fecha Examen
  const xFechaExamen = margin + 25;
  const yFechaExamen = margin + 49;
  let fechaExamenFormateada = datos.fechaExamen || "";
  // Formatear fecha de examen a DD/MM/YYYY
  if (fechaExamenFormateada && fechaExamenFormateada.includes("-")) {
    // Formato yyyy-mm-dd del backend
    const [yyyy, mm, dd] = fechaExamenFormateada.split("-");
    fechaExamenFormateada = `${dd}/${mm}/${yyyy}`;
  } else if (fechaExamenFormateada && fechaExamenFormateada.includes("/")) {
    // Si ya viene con /, verificar el formato
    const partes = fechaExamenFormateada.split("/");
    if (partes.length === 3) {
      if (partes[0].length === 4) {
        // Formato yyyy/mm/dd
        const [yyyy, mm, dd] = partes;
        fechaExamenFormateada = `${dd}/${mm}/${yyyy}`;
      }
      // Si ya está en dd/mm/yyyy, se mantiene igual
    }
  }
  doc.text(fechaExamenFormateada, xFechaExamen, yFechaExamen);

  // Marca
  const xMarca = margin + 160;
  const yMarca = margin + 38.5;
  doc.text(String(datos.marca || ""), xMarca, yMarca);

  // Modelo
  const xModelo = margin + 160;
  const yModelo = margin + 46;
  doc.text(String(datos.modelo || ""), xModelo, yModelo);

  // Calibración
  const xCalibracion = margin + 160;
  const yCalibracion = margin + 53;
  let calibracionFormateada = datos.calibracion || "";
  // Formatear fecha de calibración a DD/MM/YYYY
  if (calibracionFormateada && calibracionFormateada.includes("-")) {
    // Formato yyyy-mm-dd del backend
    const [yyyy, mm, dd] = calibracionFormateada.split("-");
    calibracionFormateada = `${dd}/${mm}/${yyyy}`;
  } else if (calibracionFormateada && calibracionFormateada.includes("/")) {
    // Si ya viene con /, verificar el formato
    const partes = calibracionFormateada.split("/");
    if (partes.length === 3) {
      if (partes[0].length === 4) {
        // Formato yyyy/mm/dd
        const [yyyy, mm, dd] = partes;
        calibracionFormateada = `${dd}/${mm}/${yyyy}`;
      }
      // Si ya está en dd/mm/yyyy, se mantiene igual
    }
  }
  doc.text(calibracionFormateada, xCalibracion, yCalibracion);

  // === Tipo de Examen: Marcar "X" alineada con el número de orden ===
  const xPreOcupacional = margin + 91.5;
  const yPreOcupacional = margin + 46.4;

  const xPeriodica = margin + 115;
  const yPeriodica = margin + 46.4;

  const xRetiro = margin + 91.5;
  const yRetiro = margin + 51.2;

  const xAnual = margin + 115;
  const yAnual = margin + 51.2;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if ((datos.tipoExamen || "").toLowerCase().includes("pre")) {
    doc.text("X", xPreOcupacional, yPreOcupacional);
  }
  if ((datos.tipoExamen || "").toLowerCase().includes("perio")) {
    doc.text("X", xPeriodica, yPeriodica);
  }
  if ((datos.tipoExamen || "").toLowerCase().includes("retiro")) {
    doc.text("X", xRetiro, yRetiro);
  }
  if ((datos.tipoExamen || "").toLowerCase().includes("anual")) {
    doc.text("X", xAnual, yAnual);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // === Datos personales y laborales ===
  doc.setFont("helvetica", "normal").setFontSize(7);

  // Apellidos y Nombres
  const xNombres = margin + 35;
  const yNombres = margin + 58.5;
  doc.text(String(datos.nombres || ""), xNombres, yNombres, { maxWidth: 70 });

  // Edad
  const xEdad = margin + 37;
  const yEdad = margin + 64.5;
  doc.text(String(datos.edad || ""), xEdad, yEdad);

  // Sexo
  const xSexo = margin + 69.5;
  const ySexo = margin + 64.5;
  doc.text(String(datos.sexo || ""), xSexo, ySexo);

  // Ocupación
  const xOcupacion = margin + 94;
  const yOcupacion = margin + 64.5;
  doc.text(String(datos.ocupacion || ""), xOcupacion, yOcupacion, {
    maxWidth: 60,
  });

  // Años de trabajo
  const xAniosTrabajo = margin + 188;
  const yAniosTrabajo = margin + 64.5;
  doc.text(String(datos.aniosTrabajo || ""), xAniosTrabajo, yAniosTrabajo);

  // Empresa Contrata
  const xContrata = margin + 35;
  const yContrata = margin + 70;
  doc.text(String(datos.contrata || ""), xContrata, yContrata, {
    maxWidth: 50,
  });

  // Empresa
  const xEmpresa = margin + 105;
  const yEmpresa = margin + 70;
  doc.text(String(datos.empresa || ""), xEmpresa, yEmpresa, { maxWidth: 55 });

  // Tiempo de Exposición
  const xTiempoExposicion = margin + 185;
  const yTiempoExposicion = margin + 72;
  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.text(
    String(datos.tiempoExposicion || ""),
    xTiempoExposicion - 1,
    yTiempoExposicion
  );

  // === Uso de Protectores Auditivos y Apreciación del Ruido ===
  doc.setFont("helvetica", "bold").setFontSize(9);

  // Tampones
  const xTampones = margin + 48.5;
  const yTampones = margin + 80.4;
  if (datos.tapones) doc.text("X", xTampones, yTampones);

  // Orejeras
  const xOrejeras = margin + 69.5;
  const yOrejeras = margin + 80.4;
  if (datos.orejeras) doc.text("X", xOrejeras, yOrejeras);

  // Ruido muy intenso
  const xRuidoIntenso = margin + 126.5;
  const yRuidoIntenso = margin + 80.4;
  if (datos.ruidoMuyIntenso) doc.text("X", xRuidoIntenso, yRuidoIntenso);

  // Ruido moderado
  const xRuidoModerado = margin + 156.5;
  const yRuidoModerado = margin + 80.4;
  if (datos.ruidoModerado) doc.text("X", xRuidoModerado, yRuidoModerado);

  // Ruido no molesto
  const xRuidoNoMolesto = margin + 187.5;
  const yRuidoNoMolesto = margin + 80.4;
  if (datos.ruidoNoMolesto) doc.text("X", xRuidoNoMolesto, yRuidoNoMolesto);

  // === Antecedentes Relacionados (SI/NO) ===
  // Consumo de Tabaco
  const xTabacoSI = margin + 74.8;
  const xTabacoNO = margin + 86.5;
  let yAnt = margin + 95;
  if (datos.consumoTabaco) doc.text("X", xTabacoSI, yAnt);
  else doc.text("X", xTabacoNO, yAnt);

  // Servicio Militar
  yAnt += 4.4;
  if (datos.servicioMilitar) doc.text("X", xTabacoSI, yAnt);
  else doc.text("X", xTabacoNO, yAnt);

  // Hobbies con exposición a ruido
  yAnt += 4.5;
  if (datos.hobbiesRuido) doc.text("X", xTabacoSI, yAnt);
  else doc.text("X", xTabacoNO, yAnt);

  // Exposición laboral a químicos
  yAnt += 4.6;
  if (datos.exposicionQuimicos) doc.text("X", xTabacoSI, yAnt);
  else doc.text("X", xTabacoNO, yAnt);

  // Infección al Oído (antecedente)
  yAnt += 4.5;
  if (datos.infeccionOidoAntecente) doc.text("X", xTabacoSI, yAnt);
  else doc.text("X", xTabacoNO, yAnt);

  // Uso de Ototóxicos
  yAnt += 4.5;
  if (datos.ototoxicos) doc.text("X", xTabacoSI, yAnt);
  else doc.text("X", xTabacoNO, yAnt);

  // === Síntomas Actuales (SI/NO) ===
  // Disminución de la audición
  const xSintSI = margin + 175;
  const xSintNO = margin + 186.5;
  let ySint = margin + 95;
  if (datos.disminucionAudicion) doc.text("X", xSintSI, ySint);
  else doc.text("X", xSintNO, ySint);

  // Dolor de oídos
  ySint += 4.4;
  if (datos.dolorOidos) doc.text("X", xSintSI, ySint);
  else doc.text("X", xSintNO, ySint);

  // Zumbido
  ySint += 4.5;
  if (datos.zumbido) doc.text("X", xSintSI, ySint);
  else doc.text("X", xSintNO, ySint);

  // Mareos
  ySint += 4.6;
  if (datos.mareos) doc.text("X", xSintSI, ySint);
  else doc.text("X", xSintNO, ySint);

  // Infección al oído (actual)
  ySint += 4.5;
  if (datos.infeccionOidoActual) doc.text("X", xSintSI, ySint);
  else doc.text("X", xSintNO, ySint);

  // Otros
  ySint += 4.5;
  if (datos.otros) doc.text("X", xSintSI, ySint);
  else doc.text("X", xSintNO, ySint);

  // === OTOSCOPIA ===
  const xOtoscopia = margin + 23;
  const yOtoscopia = margin + 122.5;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(String(datos.txtOtoscopia || ""), xOtoscopia, yOtoscopia, {
    maxWidth: 171,
  });

  y += fondoH + 2;
  const colGap = 8;
  const colH = 75;
  const colY = y + 8;

  const dbLabelW = 12;
  const graphW = (usableW - colGap) / 2;
  const graphH = colH;
  const graphX = margin + dbLabelW;
  const graphY = colY;
  // La tabla empieza después del gráfico y el gap
  const tableX = graphX + graphW + colGap;
  // Reducir el ancho de la tabla para que no se salga del margen
  const tableWRight = 81; // antes: usableW - graphW - colGap; ajusta según necesidad
  // Cuadrícula
  doc.setDrawColor(0);
  doc.setLineWidth(0.2); // líneas más delgadas
  // Fondo azul de 20 a 40 dB (ajustado a nueva escala)
  // Asegura el color azul claro justo antes de dibujar
  doc.setFillColor(180, 235, 255);
  const y20 = graphY + ((20 + 10) / 130) * graphH;
  const y40 = graphY + ((40 + 10) / 130) * graphH;
  doc.rect(graphX, y20, graphW, y40 - y20, "F");
  // Líneas horizontales (cada 10 dB, de -10 a 120)
  for (let i = 0; i <= 13; i++) {
    const yLine = graphY + i * (graphH / 13);
    doc.line(graphX, yLine, graphX + graphW, yLine);
  }
  // Líneas verticales (frecuencias)
  for (let i = 0; i < 9; i++) {
    const xLine = graphX + i * (graphW / 8);
    doc.line(xLine, graphY, xLine, graphY + graphH);
  }
  // Etiquetas de frecuencia (Hz) - SOLO UNA FILA
  const freqs = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
  doc.setFont("helvetica", "normal").setFontSize(7);
  for (let i = 0; i < freqs.length; i++) {
    const xTick = graphX + i * (graphW / 8);
    doc.text(String(freqs[i]), xTick, graphY - 2, { align: "center" });
  }
  // Mover 'Hz' más a la derecha del último valor
  doc.text("Hz", graphX + graphW + 4, graphY - 2, { align: "left" });
  // Etiquetas dB
  for (let i = 0; i <= 13; i++) {
    const dB = -10 + i * 10;
    const yTick = graphY + i * (graphH / 13) + 0.5;
    doc.text(String(dB), graphX - 2, yTick, { align: "right" });
  }
  doc.text("dB", graphX - 7, graphY + graphH / 2 - 2, { align: "right" });

  // Graficar puntos de audiometría (ahora con círculos y X, y líneas conectando cada tipo)
  // Ejemplo de datos:
  const puntos = [
    //aerea
    //rojo circulo
    { freq: 500, db: datos.od500, color: "red", tipo: "circle" },
    { freq: 1000, db: datos.od1000, color: "red", tipo: "circle" },
    { freq: 2000, db: datos.od2000, color: "red", tipo: "circle" },
    { freq: 3000, db: datos.od3000, color: "red", tipo: "circle" },
    { freq: 4000, db: datos.od4000, color: "red", tipo: "circle" },
    { freq: 6000, db: datos.od6000, color: "red", tipo: "circle" },
    { freq: 8000, db: datos.od8000, color: "red", tipo: "circle" },
    //azul x
    { freq: 500, db: datos.oi500, color: "blue", tipo: "x" },
    { freq: 1000, db: datos.oi1000, color: "blue", tipo: "x" },
    { freq: 2000, db: datos.oi2000, color: "blue", tipo: "x" },
    { freq: 3000, db: datos.oi3000, color: "blue", tipo: "x" },
    { freq: 4000, db: datos.oi4000, color: "blue", tipo: "x" },
    { freq: 6000, db: datos.oi6000, color: "blue", tipo: "x" },
    { freq: 8000, db: datos.oi8000, color: "blue", tipo: "x" },
    //Osea
    //rojo [
    { freq: 500, db: datos.od1_500, color: "red", tipo: "bracketLeft" },
    { freq: 1000, db: datos.od1_1000, color: "red", tipo: "bracketLeft" },
    { freq: 2000, db: datos.od1_2000, color: "red", tipo: "bracketLeft" },
    { freq: 3000, db: datos.od1_3000, color: "red", tipo: "bracketLeft" },
    { freq: 4000, db: datos.od1_4000, color: "red", tipo: "bracketLeft" },
    { freq: 6000, db: datos.od1_6000, color: "red", tipo: "bracketLeft" },
    { freq: 8000, db: datos.od1_8000, color: "red", tipo: "bracketLeft" },
    //azul ]
    { freq: 500, db: datos.oi1_500, color: "blue", tipo: "bracketRight" },
    { freq: 1000, db: datos.oi1_1000, color: "blue", tipo: "bracketRight" },
    { freq: 2000, db: datos.oi1_2000, color: "blue", tipo: "bracketRight" },
    { freq: 3000, db: datos.oi1_3000, color: "blue", tipo: "bracketRight" },
    { freq: 4000, db: datos.oi1_4000, color: "blue", tipo: "bracketRight" },
    { freq: 6000, db: datos.oi1_6000, color: "blue", tipo: "bracketRight" },
    { freq: 8000, db: datos.oi1_8000, color: "blue", tipo: "bracketRight" },
  ];
  // Agrupar por tipo y color
  const tipos = [
    { tipo: "circle", color: "red" },
    { tipo: "x", color: "blue" },
  ];
  const prevLineWidth = doc.getLineWidth();
  tipos.forEach(({ tipo, color }) => {
    // Filtrar puntos de este tipo y color, y ordenarlos por frecuencia
    const pts = puntos
      .filter(
        (p) =>
          p.tipo === tipo &&
          p.color === color &&
          p.db !== null &&
          p.db !== undefined
      )
      .sort((a, b) => a.freq - b.freq);
    if (pts.length < 2) return;
    // Dibujar línea conectando solo puntos válidos
    doc.setLineWidth(0.4);
    if (color === "red") doc.setDrawColor(255, 0, 0);
    else if (color === "blue") doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineCap(1);
    let prev = null;
    for (let i = 0; i < pts.length; i++) {
      const freqIdx = freqs.indexOf(pts[i].freq);
      if (freqIdx === -1) continue;
      const x = graphX + freqIdx * (graphW / 8);
      const y = graphY + ((pts[i].db + 10) / 130) * graphH;
      if (prev) {
        doc.line(prev.x, prev.y, x, y);
      }
      prev = { x, y };
    }
  });
  // Dibujar los puntos (círculo, X, [, ])
  puntos.forEach((punto) => {
    if (punto.db === null || punto.db === undefined) return;
    const freqIdx = freqs.indexOf(punto.freq);
    if (freqIdx === -1) return;
    const x = graphX + freqIdx * (graphW / 8);
    // Ajuste: usar rango 130 dB (-10 a 120)
    const yP = graphY + ((punto.db + 10) / 130) * graphH;
    if (punto.color === "red") doc.setDrawColor(255, 0, 0);
    else if (punto.color === "blue") doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    if (punto.tipo === "circle") {
      doc.circle(x, yP, 1.0);
    } else if (punto.tipo === "x") {
      // Dibujar una X centrada en (x, yP)
      const size = 2;
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP + size / 2);
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP - size / 2);
    } else if (punto.tipo === "bracketLeft") {
      // Dibujar un '[' centrado en (x, yP)
      const size = 1.5;
      doc.line(x - size / 2, yP - size / 2, x - size / 2, yP + size / 2);
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP - size / 2);
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP + size / 2);
    } else if (punto.tipo === "bracketRight") {
      // Dibujar un ']' centrado en (x, yP)
      const size = 1.5;
      // Línea vertical derecha
      doc.line(x + size / 2, yP - size / 2, x + size / 2, yP + size / 2);
      // Línea base superior
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP - size / 2);
      // Línea base inferior
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP + size / 2);
    }
    doc.setDrawColor(0, 0, 0);
  });
  doc.setLineWidth(prevLineWidth);

  // Derecha: tablas
  // const tableX = graphX + graphW + colGap;
  // const tableWRight = pageW - margin - tableX;

  // --- Tabla DIAPASONES ---
  let tY = graphY;
  const tH = 28;
  const tRows = 5;
  const tCols = 3;
  const tRowH = tH / tRows;
  const tColW = tableWRight / tCols;
  doc.setLineWidth(0.4);
  doc.rect(tableX, tY, tableWRight, tH);
  // Filas
  for (let i = 1; i < tRows; i++) {
    doc.line(tableX, tY + i * tRowH, tableX + tableWRight, tY + i * tRowH);
  }
  // Primera fila: solo una celda, sin líneas internas
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DIAPASONES", tableX + tableWRight / 2, tY + tRowH / 2 + 1, {
    align: "center",
    baseline: "middle",
  });
  // Columnas SOLO desde la segunda fila
  for (let i = 1; i < tCols; i++) {
    doc.line(tableX + i * tColW, tY + tRowH, tableX + i * tColW, tY + tH);
  }
  // Encabezados de columna (segunda fila)
  doc.setFontSize(7);
  doc.text("OD", tableX + tColW / 2, tY + tRowH + tRowH / 2, {
    align: "center",
    baseline: "middle",
  });
  doc.text(
    "RINNE Y WEBER",
    tableX + tColW + tColW / 2,
    tY + tRowH + tRowH / 2,
    { align: "center", baseline: "middle" }
  );
  doc.text("OI", tableX + 2 * tColW + tColW / 2, tY + tRowH + tRowH / 2, {
    align: "center",
    baseline: "middle",
  });
  // Filas de frecuencias
  doc.setFont("helvetica", "normal").setFontSize(7);
  const diapasonRows = ["250 Hz.", "500 Hz.", "1000 Hz."];
  for (let i = 0; i < diapasonRows.length; i++) {
    // Centrar la frecuencia en la columna central
    doc.text(
      diapasonRows[i],
      tableX + tColW + tColW / 2,
      tY + (i + 2) * tRowH + tRowH / 2,
      { align: "center", baseline: "middle" }
    );
  }

  const datosDiapasones = [
    { od: datos.txtDod250, oi: datos.txtDoi250 }, // 250 Hz
    { od: datos.txtDod500, oi: datos.txtDoi500 }, // 500 Hz
    { od: datos.txtDod1000, oi: datos.txtDoi1000 }, // 1000 Hz
  ];
  for (let i = 0; i < diapasonRows.length; i++) {
    const row = datosDiapasones[i];

    // OD (centrado)
    doc.text(
      row.od || "",
      tableX + tColW / 2,
      tY + (i + 2) * tRowH + tRowH / 2,
      { align: "center", baseline: "middle" }
    );
    // OI (centrado)
    doc.text(
      row.oi || "",
      tableX + 2 * tColW + tColW / 2,
      tY + (i + 2) * tRowH + tRowH / 2,
      { align: "center", baseline: "middle" }
    );
  }

  // --- Tabla LOGOAUDIOMETRIA ---
  tY += tH + 2;
  const t2Rows = 5;
  const t2Cols = 3;
  const t2RowH = 9;
  // Ajustar proporciones para que las columnas no sean tan anchas
  const t2ColWArr = [tableWRight * 0.5, tableWRight * 0.25, tableWRight * 0.25];
  const t2H = t2Rows * t2RowH;
  // Dibujar marco exterior
  doc.rect(tableX, tY, tableWRight, t2H);
  // Filas
  for (let i = 1; i < t2Rows; i++) {
    doc.line(tableX, tY + i * t2RowH, tableX + tableWRight, tY + i * t2RowH);
  }
  // Columnas
  let t2X = tableX;
  for (let i = 1; i < t2Cols; i++) {
    t2X += t2ColWArr[i - 1];
    doc.line(t2X, tY, t2X, tY + t2H);
  }
  // Primera fila: LOGOAUDIOMETRIA, DERECHA, IZQUIERDA
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("LOGOAUDIOMETRIA", tableX + t2ColWArr[0] / 2, tY + t2RowH / 2, {
    align: "center",
    baseline: "middle",
  });
  doc.text(
    "DERECHA",
    tableX + t2ColWArr[0] + t2ColWArr[1] / 2,
    tY + t2RowH / 2,
    { align: "center", baseline: "middle" }
  );
  doc.text(
    "IZQUIERDA",
    tableX + t2ColWArr[0] + t2ColWArr[1] + t2ColWArr[2] / 2,
    tY + t2RowH / 2,
    { align: "center", baseline: "middle" }
  );
  // Filas de etiquetas y datos
  doc.setFont("helvetica", "normal").setFontSize(7);
  const logoRows = [
    "Umbral de discriminación",
    "% de discriminación",
    "Umbral de Confort MCL",
    "Umbral de disconfort UCL",
  ];
  const datosLogoAudiometria = [
    {
      derecha: datos.txtLDUmbralDiscriminacion,
      izquierda: datos.txtLIUmbralDiscriminacion,
    },
    {
      derecha: datos.txtLDPorcentajeDiscriminacion,
      izquierda: datos.txtLIPorcentajeDiscriminacion,
    },
    { derecha: datos.txtLDConfort, izquierda: datos.txtLIConfort },
    { derecha: datos.txtLDDisconfort, izquierda: datos.txtLIDisconfort },
  ];
  for (let i = 0; i < logoRows.length; i++) {
    // Etiqueta
    doc.text(
      logoRows[i],
      tableX + t2ColWArr[0] / 2,
      tY + (i + 2) * t2RowH - t2RowH / 2,
      { align: "center", baseline: "middle" }
    );
    // Derecha
    doc.text(
      datosLogoAudiometria[i].derecha || "",
      tableX + t2ColWArr[0] + t2ColWArr[1] / 2,
      tY + (i + 2) * t2RowH - t2RowH / 2,
      { align: "center", baseline: "middle" }
    );
    // Izquierda
    doc.text(
      datosLogoAudiometria[i].izquierda || "",
      tableX + t2ColWArr[0] + t2ColWArr[1] + t2ColWArr[2] / 2,
      tY + (i + 2) * t2RowH - t2RowH / 2,
      { align: "center", baseline: "middle" }
    );
  }

  // --- Tabla de conclusiones y firmas según requerimiento ---
  // Subir la sección un poco
  const conclY = Math.max(graphY + graphH, tY + t2H) + 6;
  const conclW = pageW - 2 * 8;
  const conclX = 8;
  const conclH1 = 16; // Fila 1 (conclusiones, más alta)
  const conclH2 = 12; // Fila 2 y 3
  const conclCol1W = conclW * 0.25;
  const conclCol2W = conclW * 0.45;
  const conclCol3W = conclW * 0.3;

  // Fila 1: solo dos columnas
  doc.rect(conclX, conclY, conclCol1W, conclH1);
  doc.rect(conclX + conclCol1W, conclY, conclW - conclCol1W, conclH1);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Conclusiones:", conclX + 3, conclY + conclH1 / 2 + 2, {
    align: "left",
    baseline: "middle",
  });
  // Texto dinámico, máximo dos líneas, justificado a la izquierda
  const conclusionesTexto = datos.diagnostico || "";
  const conclusionesLines = doc
    .splitTextToSize(conclusionesTexto, conclW - conclCol1W - 8)
    .slice(0, 2);
  let conclusionesY = conclY + 6;
  for (let i = 0; i < conclusionesLines.length; i++) {
    doc.text(
      conclusionesLines[i],
      conclX + conclCol1W + 3,
      conclusionesY + i * 6,
      {
        align: "left",
      }
    );
  }
  doc.text(
    "Sello y Firma",
    conclX + conclCol1W + conclCol2W + conclCol3W / 2,
    conclY + conclH1 + conclH2 / 2 + 2,
    {
      align: "center",
      baseline: "middle",
    }
  );

  // Fila 2: tres columnas perfectamente alineadas
  doc.rect(conclX, conclY + conclH1, conclCol1W, conclH2);
  doc.rect(conclX + conclCol1W, conclY + conclH1, conclCol2W, conclH2);
  doc.rect(
    conclX + conclCol1W + conclCol2W,
    conclY + conclH1,
    conclCol3W,
    conclH2
  );
  // Texto partido en dos líneas si es necesario
  const label2 = "Nombre del profesional que realiza la audiometría";
  const label2Lines = doc.splitTextToSize(label2, conclCol1W - 6);
  // Centrar verticalmente el bloque de texto
  let label2Y = conclY + conclH1 + conclH2 / 2 + 2;
  if (label2Lines.length > 1) {
    label2Y = conclY + conclH1 + 4 + (conclH2 - 8) / 2;
  }
  doc.text(label2Lines, conclX + 3, label2Y, {
    align: "left",
    baseline: "middle",
  });
  doc.setFont("helvetica", "normal");
  doc.text(
    "Sello y Firma",
    conclX + conclCol1W + conclCol2W + conclCol3W / 2,
    conclY + conclH1 + conclH2 / 2 + 2,
    {
      align: "center",
      baseline: "middle",
    }
  );
  doc.text(`${datos.txtResponsable}`, conclX + conclCol1W + 3, label2Y, {
    maxWidth: 80,
  });

  // Fila 3: tres columnas perfectamente alineadas
  doc.rect(conclX, conclY + conclH1 + conclH2, conclCol1W, conclH2);
  doc.rect(
    conclX + conclCol1W,
    conclY + conclH1 + conclH2,
    conclCol2W,
    conclH2
  );
  doc.rect(
    conclX + conclCol1W + conclCol2W,
    conclY + conclH1 + conclH2,
    conclCol3W,
    conclH2
  );
  doc.text(
    "Nombre del Medico",
    conclX + 3,
    conclY + conclH1 + conclH2 + conclH2 / 2 + 2,
    {
      align: "left",
      baseline: "middle",
    }
  );

  doc.text(
    `${datos.txtMedico}`,
    conclX + conclCol1W + 3,
    conclY + conclH1 + conclH2 + conclH2 / 2 + 2,
    {
      maxWidth: 80,
    }
  );
  doc.text(
    "Sello y Firma",
    conclX + conclCol1W + conclCol2W + conclCol3W / 2,
    conclY + conclH1 + conclH2 + conclH2 / 2 + 2,
    {
      align: "center",
      baseline: "middle",
    }
  );

  // Función para agregar la firma y esperar a que cargue o falle
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // importante si es una URL externa
      img.src = imagenUrl;

      img.onload = () => {
        let sigW = maxw;
        const sigH = 35;
        const baseX = x;
        const baseY = y;
        const maxW = sigW - 10;
        const maxH = sigH - 10;
        let imgW = img.width;
        let imgH = img.height;
        const scale = Math.min(maxW / imgW, maxH / imgH, 1);
        imgW *= scale;
        imgH *= scale;
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;
        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve(); // se resuelve al cargar
      };

      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve(); // también resolvemos si falla (para no bloquear)
      };
    });
  };

  const firmas = (data.digitalizacion || []).reduce(
    (acc, d) => ({
      ...acc,
      [d.nombreDigitalizacion]: d.url,
    }),
    {}
  );

  // Arreglo de firmas que quieres cargar
  const firmasAPintar = [
    { nombre: "FIRMAP", x: -8, y: 255, maxw: 100 },
    { nombre: "HUELLA", x: 36, y: 255, maxw: 100 },
    { nombre: "SELLOFIRMA", x: 150, y: 225, maxw: 50 },
    { nombre: "SELLOFIRMADOCASIG", x: 112, y: 242, maxw: 120 },
    { nombre: "SELLOFIRMADOCASIG-EXTRA", x: 70, y: 255, maxw: 120 },
  ];

  // Crear promesas para todas las firmas existentes
  const promesasFirmas = firmasAPintar
    .filter((f) => firmaExtra || f.nombre !== "SELLOFIRMADOCASIG-EXTRA")
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  Promise.all(promesasFirmas).then(() => {
    // 4) Imprimir automáticamente
    // Dibujar el footer
    if (typeof footerFichaAudiologica === "function") {
      footerFichaAudiologica(doc);
    }
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
  });
}
