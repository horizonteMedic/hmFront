import jsPDF from "jspdf";
import headerFicha from "./headers/header_FichaAudiologica_Digitalizado.jsx";

export default function FichaAudiologica_Digitalizado(data = {}) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 32;

  // 1) Header
  headerFicha(doc, data);

  const datos = {
    norden: "95899",
    marca: "AMPLIVOX",
    modelo: "BELL PLUS",
    calibracion: "01/07/2025",
    fechaExamen: "24/10/2025",
    tipoExamen: "Anual",
    nombres: "ROJAS SIGUENZA JOSUE SPENCER",
    edad: "29",
    sexo: "M",
    ocupacion: "ADMINISTRADOR ESPECIALISTA",
    aniosTrabajo: "5",
    contrata: "CONSTRUCTORA E INMOBILIARIA JAMELY E.I. R.L.",
    empresa: "EMPRESA DEL AREA PRINCIPAL DE GRANDES ZONAS XYZ S.A.C.",
    tiempoExposicion: "5 H/D",

    tapones: true,
    orejeras: true,
    ruidoMuyIntenso: false,
    ruidoModerado: true,
    ruidoNoMolesto: false,

    consumoTabaco: true,
    servicioMilitar: false,
    hobbiesRuido: true,
    exposicionQuimicos: false,
    infeccionOidoAntecente: true,
    ototoxicos: false,

    disminucionAudicion: true,
    dolorOidos: false,
    zumbido: true,
    mareos: false,
    infeccionOidoActual: true,
    otros: true,

    txtDod250: "40",
    txtDod500: "20",
    txtDod1000: "30",

    txtDoi250: "10",
    txtDoi500: "15",
    txtDoi1000: "60",

    txtLDUmbralDiscriminacion: "20",
    txtLIUmbralDiscriminacion: "10",

    txtLDPorcentajeDiscriminacion: "80",
    txtLIPorcentajeDiscriminacion: "50",

    txtLDConfort: "70",
    txtLIConfort: "60",

    txtLDDisconfort: "90",
    txtLIDisconfort: "100",

    txtConclusiones:
      "El paciente presenta una pérdida auditiva leve en el oído derecho y una pérdida auditiva moderada en el oído izquierdo.",
    txtResponsable: "SHIRLEY KATHERINE GUTIERREZ ARTEAGA",
    txtMedico: "DR. JUAN PEREZ GARCIA",

    od500: null,
    od1000: null,
    od2000: null,
    od3000: null,
    od4000: null,
    od6000: null,
    od8000: null,

    oi500: 20,
    oi1000: null,
    oi2000: null,
    oi3000: null,
    oi4000: null,
    oi6000: null,
    oi8000: null,

    od1_500: 30,
    od1_1000: null,
    od1_2000: null,
    od1_3000: null,
    od1_4000: null,
    od1_6000: null,
    od1_8000: 90,

    oi1_500: null,
    oi1_1000: null,
    oi1_2000: null,
    oi1_3000: 65,
    oi1_4000: null,
    oi1_6000: null,
    oi1_8000: 95,
  };

  const obtener = (name) => {
    return data[name] || "";
  };
  const obtenerNumero = (name) => {
    return data[name] || 0;
  };

  // const datos = {
  //   norden: obtener("norden"),
  //   marca: obtener("txtMarca"),
  //   modelo: obtener("txtModelo"),
  //   calibracion: data.fechaCalibracion,
  //   fechaExamen: data.fechaExamen,
  //   tipoExamen: obtener("nomExam"),
  //   nombres: obtener("nombres"),
  //   edad: obtener("edad"),
  //   sexo: obtener("genero"),
  //   ocupacion: obtener("ocupacion"),
  //   aniosTrabajo: obtener("tiempoTrabajo"),
  //   contrata: obtener("contrata"),
  //   empresa: obtener("empresa"),
  //   tiempoExposicion: obtener("tiempoExposicionTotalPonderado"),

  //   tapones: data.chkTapones,
  //   orejeras: data.chkgrajeras,
  //   ruidoMuyIntenso: data.chkIntenso,
  //   ruidoModerado: data.chkModerado,
  //   ruidoNoMolesto: data.chkNoMolesto,

  //   consumoTabaco: data.chk1Si,
  //   servicioMilitar: data.chk2Si,
  //   hobbiesRuido: data.chk3Si,
  //   exposicionQuimicos: data.chk4Si,
  //   infeccionOidoAntecente: data.chk5Si,
  //   ototoxicos: data.chk6Si,

  //   disminucionAudicion: data.chk7Si,
  //   dolorOidos: data.chk8Si,
  //   zumbido: data.chk9Si,
  //   mareos: data.chk10Si,
  //   infeccionOidoActual: data.chk11Si,
  //   otros: data.chk12Si,

  //   txtDod250: obtener("txtDod250"),
  //   txtDod500: obtener("txtDod500"),
  //   txtDod1000: obtener("txtDod1000"),

  //   txtDoi250: obtener("txtDoi250"),
  //   txtDoi500: obtener("txtDoi500"),
  //   txtDoi1000: obtener("txtDoi1000"),

  //   txtLDUmbralDiscriminacion: obtener("txtLDUmbralDiscriminacion"),
  //   txtLIUmbralDiscriminacion: obtener("txtLIUmbralDiscriminacion"),

  //   txtLDPorcentajeDiscriminacion: obtener("txtLDPorcentajeDiscriminacion"),
  //   txtLIPorcentajeDiscriminacion: obtener("txtLIPorcentajeDiscriminacion"),

  //   txtLDConfort: obtener("txtLDConfort"),
  //   txtLIConfort: obtener("txtLIConfort"),

  //   txtLDDisconfort: obtener("txtLDDisconfort"),
  //   txtLIDisconfort: obtener("txtLIDisconfort"),

  //   txtConclusiones: obtener("txtConclusiones"),
  //   txtResponsable: obtener("txtResponsable"),
  //   txtMedico: obtener("txtMedico"),

  //   od500: obtenerNumero("od500"),
  //   od1000: obtenerNumero("od1000"),
  //   od2000: obtenerNumero("od2000"),
  //   od3000: obtenerNumero("od3000"),
  //   od4000: obtenerNumero("od4000"),
  //   od6000: obtenerNumero("od6000"),
  //   od8000: obtenerNumero("od8000"),

  //   oi500: obtenerNumero("oi500"),
  //   oi1000: obtenerNumero("oi1000"),
  //   oi2000: obtenerNumero("oi2000"),
  //   oi3000: obtenerNumero("oi3000"),
  //   oi4000: obtenerNumero("oi4000"),
  //   oi6000: obtenerNumero("oi6000"),
  //   oi8000: obtenerNumero("oi8000"),

  //   od1_500: obtenerNumero("od1_500"),
  //   od1_1000: obtenerNumero("od1_1000"),
  //   od1_2000: obtenerNumero("od1_2000"),
  //   od1_3000: obtenerNumero("od1_3000"),
  //   od1_4000: obtenerNumero("od1_4000"),
  //   od1_6000: obtenerNumero("od1_6000"),
  //   od1_8000: obtenerNumero("od1_8000"),

  //   oi1_500: obtenerNumero("oi1_500"),
  //   oi1_1000: obtenerNumero("oi1_1000"),
  //   oi1_2000: obtenerNumero("oi1_2000"),
  //   oi1_3000: obtenerNumero("oi1_3000"),
  //   oi1_4000: obtenerNumero("oi1_4000"),
  //   oi1_6000: obtenerNumero("oi1_6000"),
  //   oi1_8000: obtenerNumero("oi1_8000"),
  // };

  // 2) Título
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("FICHA AUDIOLOGICA", pageW / 2, y, { align: "center" });
  y += 6;

  // --- Bloque superior rediseñado con Audiómetro ---
  const x0 = margin;
  const wTotal = pageW - 2 * margin;
  // Definir anchos de columnas principales
  const colW = [38, 60, 30, wTotal - 38 - 60 - 30 - 45, 45]; // última columna: Audiómetro
  const rowH1 = 10;
  const rowH2 = 12;
  const rowH3Sup = 10;
  // Fila 1: 4 columnas + Audiómetro
  doc.setLineWidth(0.4);
  doc.rect(x0, y, wTotal, rowH1);
  let x = x0;
  for (let i = 0; i < colW.length - 1; i++) {
    x += colW[i];
    doc.line(x, y, x, y + rowH1);
  }
  // Audiómetro subdivisión interna (3 filas)
  let audX = x0 + colW[0] + colW[1] + colW[2] + colW[3];
  let audY = y;
  doc.line(audX, audY + rowH1 / 3, audX + colW[4], audY + rowH1 / 3);
  doc.line(audX, audY + 2 * rowH1 / 3, audX + colW[4], audY + 2 * rowH1 / 3);
  // Textos Fila 1
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Historia Clínica", x0 + colW[0] / 2, y + rowH1 / 2 + 2, { align: "center" });
  doc.text("Ficha Audiológica", x0 + colW[0] + colW[1] / 2, y + rowH1 / 2 + 2, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`${datos.norden}`, x0 + colW[0] + colW[1] + colW[2] / 2, y + rowH1 / 2 + 2, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Audiómetro", audX + colW[4] / 2, y + rowH1 / 2 + 2, { align: "center" });
  // Fila 2: Fecha del Examen, Fecha, Examen, Tipos de Examen, Audiómetro subdividido
  const y2 = y + rowH1;
  doc.rect(x0, y2, wTotal, rowH2);
  x = x0;
  for (let i = 0; i < colW.length - 1; i++) {
    x += colW[i];
    doc.line(x, y2, x, y2 + rowH2);
  }
  // Audiómetro subdivisión interna (3 filas)
  audY = y2;
  doc.line(audX, audY + rowH2 / 3, audX + colW[4], audY + rowH2 / 3);
  doc.line(audX, audY + 2 * rowH2 / 3, audX + colW[4], audY + 2 * rowH2 / 3);
  // Textos Fila 2
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fecha del Examen", x0 + colW[0] / 2, y2 + rowH2 / 2 + 2, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`${datos.fechaExamen}`, x0 + colW[0] + colW[1] / 2, y2 + rowH2 / 2 + 2, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("dd / mm / aa", x0 + colW[0] + colW[1] / 2, y2 + rowH2 / 2 + 6, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("EXAMEN", x0 + colW[0] + colW[1] + colW[2] / 2, y2 + rowH2 / 2 + 2, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`Pre - Ocupacional (${datos.tipoExamen == "Pre-ocupacional" ? "X" : " "})`, x0 + colW[0] + colW[1] + colW[2] + colW[3] / 4, y2 + rowH2 / 2 - 2, { align: "left" });
  doc.text(`Periódica (${datos.tipoExamen == "Periodica" ? "X" : " "})`, x0 + colW[0] + colW[1] + colW[2] + colW[3] / 4, y2 + rowH2 / 2 + 2, { align: "left" });
  doc.text(`Retiro (${datos.tipoExamen == "Retiro" ? "X" : " "})`, x0 + colW[0] + colW[1] + colW[2] + colW[3] / 4, y2 + rowH2 / 2 + 6, { align: "left" });
  doc.text(`Anual (${datos.tipoExamen == "Anual" ? "X" : " "})`, x0 + colW[0] + colW[1] + colW[2] + colW[3] / 2, y2 + rowH2 / 2 + 6, { align: "left" });
  // Audiómetro datos
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Marca", audX + 8, y2 + rowH2 / 3 - 2, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`${datos.marca}`, audX + colW[4] / 2, y2 + rowH2 / 3 - 2, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Modelo", audX + 8, y2 + 2 * rowH2 / 3 - 2, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`${datos.modelo}`, audX + colW[4] / 2, y2 + 2 * rowH2 / 3 - 2, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Calibración", audX + 8, y2 + rowH2 - 2, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`${datos.calibracion}`, audX + colW[4] / 2, y2 + rowH2 - 2, { align: "center" });
  // Fila 3: Apellidos y Nombres (celdas combinadas) + Audiómetro subdividido
  const y3 = y2 + rowH2;
  doc.rect(x0, y3, wTotal, rowH3Sup);
  // Línea vertical para audiómetro
  doc.line(audX, y3, audX, y3 + rowH3Sup);
  // Audiómetro subdivisión interna (3 filas)
  doc.line(audX, y3 + rowH3Sup / 3, audX + colW[4], y3 + rowH3Sup / 3);
  doc.line(audX, y3 + 2 * rowH3Sup / 3, audX + colW[4], y3 + 2 * rowH3Sup / 3);
  // Texto Apellidos y Nombres
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Apellidos y Nombres", x0 + 2, y3 + rowH3Sup / 2 + 2, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`${datos.nombres}`, x0 + 60, y3 + rowH3Sup / 2 + 2, { align: "left" });
  y += rowH1 + rowH2 + rowH3Sup;

  // --- Bloque de datos personales (2 filas) ---
  let yDatos = y + rowH1 + rowH2;
  const rowH3 = 8,
    rowH4 = 8;
  // Fila 3
  // Proporciones para fila 3 (Apellidos, Edad, Sexo, Ocupación, Años de trabajo)
  const colW3 = [0.32, 0.1, 0.08, 0.32, 0.18].map((f) => f * wTotal);
  let xCol3 = x0;
  doc.rect(x0, yDatos, wTotal, rowH3);
  for (let i = 0; i < colW3.length - 1; i++) {
    xCol3 += colW3[i];
    doc.line(xCol3, yDatos, xCol3, yDatos + rowH3);
  }
  // Agregar línea vertical extra para separar el valor de 'Años de Trabajo'
  const xAniosTrabajo = x0 + colW3[0] + colW3[1] + colW3[2] + colW3[3];
  const xAniosTrabajoValor = xAniosTrabajo + colW3[4] * 0.6;
  doc.line(xAniosTrabajoValor, yDatos, xAniosTrabajoValor, yDatos + rowH3);

  // Etiquetas fila 3
  doc.setFont("helvetica", "normal").setFontSize(8);
  let xText = x0 + 2;
  doc.text("Apellidos y Nombres", xText, yDatos + 5);
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`${datos.nombres}`, x0 + colW3[0] / 2 + x0, yDatos + 5, {
    align: "center",
  });
  doc.setFont("helvetica", "normal").setFontSize(8);
  xText += colW3[0];
  doc.text("Edad", xText + 2, yDatos + 5);
  doc
    .setFont("helvetica", "bold")
    .text(`${datos.edad} años`, xText + colW3[1] / 2, yDatos + 5, {
      align: "center",
    });
  doc.setFont("helvetica", "normal").setFontSize(8);
  xText += colW3[1];
  doc.text("Sexo", xText + 2, yDatos + 5);
  doc
    .setFont("helvetica", "bold")
    .text(`${datos.sexo}`, xText + colW3[2] / 2, yDatos + 5, {
      align: "center",
    });
  doc.setFont("helvetica", "normal").setFontSize(8);
  xText += colW3[2];
  doc.text("Ocupación", xText + 2, yDatos + 5);
  doc
    .setFont("helvetica", "bold")
    .text(`${datos.ocupacion}`, xText + colW3[3] / 2, yDatos + 5, {
      align: "center",
    });
  doc.setFont("helvetica", "normal").setFontSize(8);
  xText += colW3[3];
  // Centrar verticalmente y alinear más a la izquierda el texto 'Años de Trabajo'
  doc.text("Años de Trabajo", xText -62, yDatos + rowH3 / 2 + 1, {
    align: "left",
    // aling
     
    baseline: "middle"
  });

  // Fila 4
  yDatos += rowH3;
  // Proporciones para fila 4 (Empresa Contratista, Empresa, Tiempo exposición)
  const colW4 = [0.38, 0.38, 0.24].map((f) => f * wTotal);
  let xCol4 = x0;
  doc.rect(x0, yDatos, wTotal, rowH4);
  for (let i = 0; i < colW4.length - 1; i++) {
    xCol4 += colW4[i];
    doc.line(xCol4, yDatos, xCol4, yDatos + rowH4);
  }
  // Etiquetas fila 4
  xText = x0 + 2;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Empresa Contratista", xText, yDatos + 5);
  doc
    .setFont("helvetica", "bold")
    .text(`${datos.contrata}`, xText + colW4[0] / 2, yDatos + 5, {
      align: "center",
    });
  xText += colW4[0];
  doc.setFont("helvetica", "normal").text("Empresa", xText + 2, yDatos + 5);
  doc
    .setFont("helvetica", "bold")
    .text(`${datos.empresa}`, xText + colW4[1] / 2, yDatos + 5, {
      align: "center",
    });
  xText += colW4[1];
  // Label en dos líneas
  doc
    .setFont("helvetica", "normal")
    .text("Tiempo de", xText + colW4[2] / 2, yDatos + 3, {
      align: "center",
    });
  doc.text("exposición", xText + colW4[2] / 2, yDatos + 6, {
    align: "center",
  });
  // Dato centrado debajo
  doc
    .setFont("helvetica", "bold")
    .text(`${datos.tiempoExposicion}`, xText + colW4[2] / 2, yDatos + 10, {
      align: "center",
    });

  // --- Uso de Protectores Auditivos y Apreciación del Ruido ---
  let yProtec = yDatos + rowH4;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.rect(x0, yProtec, 70, 8);
  doc.rect(x0 + 70, yProtec, wTotal - 70, 8);
  doc.text("Uso de Protectores Auditivos", x0 + 35, yProtec + 5, {
    align: "center",
  });
  doc.text("Apreciación del Ruido", x0 + 70 + (wTotal - 70) / 2, yProtec + 5, {
    align: "center",
  });
  yProtec += 8;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.rect(x0, yProtec, 70, 7);
  doc.rect(x0 + 70, yProtec, wTotal - 70, 7);
  doc.text(
    `Tapones (${datos.tapones ? "X" : " "})    Orejeras (${
      datos.orejeras ? "X" : " "
    })`,
    x0 + 35,
    yProtec + 5,
    {
      align: "center",
    }
  );
  doc.text(
    `Ruido muy Intenso (${
      datos.ruidoMuyIntenso ? "X" : " "
    })    Ruido moderado (${
      datos.ruidoModerado ? "X" : " "
    })    Ruido no molesto (${datos.ruidoNoMolesto ? "X" : " "})`,
    x0 + 70 + (wTotal - 70) / 2,
    yProtec + 5,
    { align: "center" }
  );

  // --- Tabla de antecedentes ---
  let yAnte = yProtec + 7;
  // Calcular columnas proporcionales al ancho total
  const colWAnte = [0.23, 0.07, 0.07, 0.23, 0.07, 0.07].map((f) => f * wTotal);
  const tableWAnte = wTotal;
  const tableH = 7 * 6; // 6 filas + encabezado
  doc.rect(x0, yAnte, tableWAnte, tableH);
  let xCol = x0;
  for (let i = 0; i < colWAnte.length - 1; i++) {
    xCol += colWAnte[i];
    doc.line(xCol, yAnte, xCol, yAnte + tableH);
  }
  for (let i = 1; i < 7; i++) {
    doc.line(x0, yAnte + i * 6, x0 + tableWAnte, yAnte + i * 6);
  }
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ANTECEDENTES relacionados", x0 + 2, yAnte + 4);
  doc.text("SI", x0 + colWAnte[0] + colWAnte[1] / 2, yAnte + 4, {
    align: "center",
  });
  doc.text("NO", x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] / 2, yAnte + 4, {
    align: "center",
  });
  // Agregar 'SÍNTOMAS ACTUALES' centrado en la celda vacía
  doc.text(
    "SÍNTOMAS ACTUALES",
    x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] + colWAnte[3] / 2,
    yAnte + 4,
    { align: "center" }
  );
  doc.text(
    "SI",
    x0 +
      colWAnte[0] +
      colWAnte[1] +
      colWAnte[2] +
      colWAnte[3] +
      colWAnte[4] / 2,
    yAnte + 4,
    { align: "center" }
  );
  doc.text(
    "NO",
    x0 +
      colWAnte[0] +
      colWAnte[1] +
      colWAnte[2] +
      colWAnte[3] +
      colWAnte[4] +
      colWAnte[5] / 2,
    yAnte + 4,
    { align: "center" }
  );
  doc.setFont("helvetica", "normal").setFontSize(8);
  const antecedentes = [
    [
      "Consumo de Tabaco",
      `${datos.consumoTabaco ? "X" : ""}`,
      `${datos.consumoTabaco ? "" : "X"}`,

      "Disminución de la audición",
      `${datos.disminucionAudicion ? "X" : ""}`,
      `${datos.disminucionAudicion ? "" : "X"}`,
    ],
    [
      "Servicio Militar",
      `${datos.servicioMilitar ? "X" : ""}`,
      `${datos.servicioMilitar ? "" : "X"}`,

      "Dolor de oídos",
      `${datos.dolorOidos ? "X" : ""}`,
      `${datos.dolorOidos ? "" : "X"}`,
    ],
    [
      "Hobbies con exposición a ruido",
      `${datos.hobbiesRuido ? "X" : ""}`,
      `${datos.hobbiesRuido ? "" : "X"}`,

      "Zumbido",
      `${datos.zumbido ? "X" : ""}`,
      `${datos.zumbido ? "" : "X"}`,
    ],
    [
      "Exposición laboral a químicos",
      `${datos.exposicionQuimicos ? "X" : ""}`,
      `${datos.exposicionQuimicos ? "" : "X"}`,

      "Mareos",
      `${datos.mareos ? "X" : ""}`,
      `${datos.mareos ? "" : "X"}`,
    ],
    [
      "Infección al Oído",
      `${datos.infeccionOidoAntecente ? "X" : ""}`,
      `${datos.infeccionOidoAntecente ? "" : "X"}`,

      "Infección al oído",
      `${datos.infeccionOidoActual ? "X" : ""}`,
      `${datos.infeccionOidoActual ? "" : "X"}`,
    ],
    [
      "Uso de Ototóxicos",
      `${datos.ototoxicos ? "X" : ""}`,
      `${datos.ototoxicos ? "" : "X"}`,

      "Otros",
      `${datos.otros ? "X" : ""}`,
      `${datos.otros ? "" : "X"}`,
    ],
  ];
  for (let i = 0; i < antecedentes.length; i++) {
    const row = antecedentes[i];
    doc.text(row[0], x0 + 2, yAnte + 10 + i * 6);
    doc
      .setFont("helvetica", "bold")
      .text(row[1], x0 + colWAnte[0] + colWAnte[1] / 2, yAnte + 10 + i * 6, {
        align: "center",
      });
    doc
      .setFont("helvetica", "normal")
      .text(
        row[2],
        x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] / 2,
        yAnte + 10 + i * 6,
        { align: "center" }
      );
    doc.text(
      row[3],
      x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] + 2,
      yAnte + 10 + i * 6
    );
    doc
      .setFont("helvetica", "bold")
      .text(
        row[5],
        x0 +
          colWAnte[0] +
          colWAnte[1] +
          colWAnte[2] +
          colWAnte[3] +
          colWAnte[4] +
          colWAnte[5] / 2,
        yAnte + 10 + i * 6,
        { align: "center" }
      );
    doc
      .setFont("helvetica", "normal")
      .text(
        row[4],
        x0 +
          colWAnte[0] +
          colWAnte[1] +
          colWAnte[2] +
          colWAnte[3] +
          colWAnte[4] / 2,
        yAnte + 10 + i * 6,
        { align: "center" }
      );
  }

  // --- Otoscopia ---
  let yOto = yAnte + tableH + 7;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("OTOSCOPIA:", x0, yOto);

  // --- NUEVO: Sección de dos columnas ---
  // Márgenes laterales más amplios
  const colGap = 8;
  const colH = 75; // más bajo para que las líneas estén más juntas
  const colY = yOto + 8;
  // Espacio para etiquetas dB
  const dbLabelW = 12;
  // Área útil total para el bloque inferior (gráfico + tablas)
  const usableW = pageW - 2 * margin - dbLabelW;
  // El ancho del gráfico será la mitad del área útil menos la separación
  const graphW = (usableW - colGap) / 2;
  const graphH = colH;
  const graphX = margin + dbLabelW;
  const graphY = colY;
  // La tabla empieza después del gráfico y el gap
  const tableX = graphX + graphW + colGap;
  const tableWRight = usableW - graphW - colGap;
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
    { tipo: "bracketLeft", color: "red" },
    { tipo: "bracketRight", color: "blue" },
  ];
  const prevLineWidth = doc.getLineWidth();
  tipos.forEach(({ tipo, color }) => {
    // Filtrar puntos de este tipo y color, y ordenarlos por frecuencia
    const pts = puntos
      .filter((p) => p.tipo === tipo && p.color === color && p.db !== null && p.db !== undefined)
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
      const size = 2;
      doc.line(x - size / 2, yP - size / 2, x - size / 2, yP + size / 2);
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP - size / 2);
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP + size / 2);
    } else if (punto.tipo === "bracketRight") {
      // Dibujar un ']' centrado en (x, yP)
      const size = 2;
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
  const t2ColWArr = [tableWRight * 0.6, tableWRight * 0.2, tableWRight * 0.2];
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
  doc.text("LOGOAUDIOMETRIA", tableX + t2ColWArr[0] / 2, tY + t2RowH / 2, { align: "center", baseline: "middle" });
  doc.text("DERECHA", tableX + t2ColWArr[0] + t2ColWArr[1] / 2, tY + t2RowH / 2, { align: "center", baseline: "middle" });
  doc.text("IZQUIERDA", tableX + t2ColWArr[0] + t2ColWArr[1] + t2ColWArr[2] / 2, tY + t2RowH / 2, { align: "center", baseline: "middle" });
  // Filas de etiquetas y datos
  doc.setFont("helvetica", "normal").setFontSize(7);
  const logoRows = [
    "Umbral de discriminación",
    "% de discriminación",
    "Umbral de Confort MCL",
    "Umbral de disconfort UCL",
  ];
  const datosLogoAudiometria = [
    { derecha: "40 dB", izquierda: "45 dB" },
    { derecha: "92%", izquierda: "88%" },
    { derecha: "75 dB", izquierda: "70 dB" },
    { derecha: "95 dB", izquierda: "90 dB" },
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
  const conclusionesTexto = datos.txtConclusiones || "";
  const conclusionesLines = doc.splitTextToSize(conclusionesTexto, conclW - conclCol1W - 8).slice(0, 2);
  let conclusionesY = conclY + 6;
  for (let i = 0; i < conclusionesLines.length; i++) {
    doc.text(conclusionesLines[i], conclX + conclCol1W + 3, conclusionesY + i * 6, {
      align: "left"
    });
  }
  doc.text("Sello y Firma", conclX + conclCol1W + conclCol2W + conclCol3W / 2, conclY + conclH1 + conclH2 / 2 + 2, {
    align: "center",
    baseline: "middle",
  });

  // Fila 2: tres columnas perfectamente alineadas
  doc.rect(conclX, conclY + conclH1, conclCol1W, conclH2);
  doc.rect(conclX + conclCol1W, conclY + conclH1, conclCol2W, conclH2);
  doc.rect(conclX + conclCol1W + conclCol2W, conclY + conclH1, conclCol3W, conclH2);
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
  doc.text("Sello y Firma", conclX + conclCol1W + conclCol2W + conclCol3W / 2, conclY + conclH1 + conclH2 / 2 + 2, {
    align: "center",
    baseline: "middle",
  });

  // Fila 3: tres columnas perfectamente alineadas
  doc.rect(conclX, conclY + conclH1 + conclH2, conclCol1W, conclH2);
  doc.rect(conclX + conclCol1W, conclY + conclH1 + conclH2, conclCol2W, conclH2);
  doc.rect(conclX + conclCol1W + conclCol2W, conclY + conclH1 + conclH2, conclCol3W, conclH2);
  doc.text("Nombre del Medico", conclX + 3, conclY + conclH1 + conclH2 + conclH2 / 2 + 2, {
    align: "left",
    baseline: "middle",
  });
  doc.text("Sello y Firma", conclX + conclCol1W + conclCol2W + conclCol3W / 2, conclY + conclH1 + conclH2 + conclH2 / 2 + 2, {
    align: "center",
    baseline: "middle",
  });

  // 4) Imprimir automáticamente
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
