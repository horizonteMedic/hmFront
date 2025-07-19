import jsPDF from "jspdf";
import headerFicha from "./headers/header_FichaAudiologica1_Digitalizado.jsx";

export default function FichaAudiologica_Digitalizado(data = {}) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 32;

  // 1) Header
  headerFicha(doc, data);

  // const datos = {
  //   norden: "95899",
  //   marca: "AMPLIVOX",
  //   modelo: "BELL PLUS",
  //   calibracion: "01/07/2025",
  //   fechaExamen: "24/10/2025",
  //   tipoExamen: "Anual",
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
  //   ruidoMuyIntenso: false,
  //   ruidoModerado: true,
  //   ruidoNoMolesto: false,

  //   consumoTabaco: true,
  //   servicioMilitar: false,
  //   hobbiesRuido: true,
  //   exposicionQuimicos: false,
  //   infeccionOidoAntecente: true,
  //   ototoxicos: false,

  //   disminucionAudicion: true,
  //   dolorOidos: false,
  //   zumbido: true,
  //   mareos: false,
  //   infeccionOidoActual: true,
  //   otros: true,

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

  //   txtConclusiones:
  //     "El paciente presenta una pérdida auditiva leve en el oído derecho y una pérdida auditiva moderada en el oído izquierdo.",
  //   txtResponsable: "SHIRLEY KATHERINE GUTIERREZ ARTEAGA",
  //   txtMedico: "DR. JUAN PEREZ GARCIA",

  //   od500: 2,
  //   od1000: 3,
  //   od2000: 40,
  //   od3000: 70,
  //   od4000: 20,
  //   od6000: 16,
  //   od8000: 30,

  //   oi500: 10,
  //   oi1000: 15,
  //   oi2000: 20,
  //   oi3000: 30,
  //   oi4000: 40,
  //   oi6000: 60,
  //   oi8000: 80,

  //   od1_500: 2,
  //   od1_1000: 3,
  //   od1_2000: 40,
  //   od1_3000: 70,
  //   od1_4000: 20,
  //   od1_6000: 16,
  //   od1_8000: 30,

  //   oi1_500: 70,
  //   oi1_1000: 15,
  //   oi1_2000: 20,
  //   oi1_3000: 100,
  //   oi1_4000: 40,
  //   oi1_6000: 20,
  //   oi1_8000: 90,
  // };

  const obtener = (name) => {
    return data[name] || "";
  };
  const obtenerNumero = (name) => {
    return data[name] || 0;
  };

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

    txtConclusiones: obtener("txtConclusiones"),
    txtResponsable: obtener("txtResponsable"),
    txtMedico: obtener("txtMedico"),

    od500: obtenerNumero("od500"),
    od1000: obtenerNumero("od1000"),
    od2000: obtenerNumero("od2000"),
    od3000: obtenerNumero("od3000"),
    od4000: obtenerNumero("od4000"),
    od6000: obtenerNumero("od6000"),
    od8000: obtenerNumero("od8000"),

    oi500: obtenerNumero("oi500"),
    oi1000: obtenerNumero("oi1000"),
    oi2000: obtenerNumero("oi2000"),
    oi3000: obtenerNumero("oi3000"),
    oi4000: obtenerNumero("oi4000"),
    oi6000: obtenerNumero("oi6000"),
    oi8000: obtenerNumero("oi8000"),

    od1_500: obtenerNumero("od1_500"),
    od1_1000: obtenerNumero("od1_1000"),
    od1_2000: obtenerNumero("od1_2000"),
    od1_3000: obtenerNumero("od1_3000"),
    od1_4000: obtenerNumero("od1_4000"),
    od1_6000: obtenerNumero("od1_6000"),
    od1_8000: obtenerNumero("od1_8000"),

    oi1_500: obtenerNumero("oi1_500"),
    oi1_1000: obtenerNumero("oi1_1000"),
    oi1_2000: obtenerNumero("oi1_2000"),
    oi1_3000: obtenerNumero("oi1_3000"),
    oi1_4000: obtenerNumero("oi1_4000"),
    oi1_6000: obtenerNumero("oi1_6000"),
    oi1_8000: obtenerNumero("oi1_8000"),
  };

  // 2) Título
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("FICHA AUDIOLOGICA", pageW / 2, y, { align: "center" });
  y += 6;

  // --- Bloque superior (2 filas, 4 columnas) ---
  const x0 = margin;
  const wTotal = pageW - 2 * margin;
  const colW = [38, 38, 38, wTotal - 38 * 3]; // 4 columnas
  const rowH1 = 10,
    rowH2 = 13;
  // Fila 1
  doc.setLineWidth(0.4);
  doc.rect(x0, y, wTotal, rowH1);
  let x = x0;
  for (let i = 0; i < 3; i++) {
    x += colW[i];
    doc.line(x, y, x, y + rowH1);
  }
  // Fila 2
  doc.rect(x0, y + rowH1, wTotal, rowH2);
  //  doc.rect(x0, y + rowH1, wTotal, rowH2);
  x = x0;
  for (let i = 0; i < 3; i++) {
    x += colW[i];
    doc.line(x, y + rowH1, x, y + rowH1 + rowH2);
  }
  // Subdividir última celda derecha en 4 filas internas (Audiómetro)
  const audX = x0 + colW[0] + colW[1] + colW[2];
  const audW = colW[3];
  const audRowH = rowH1 / 4;
  // for (let i = 1; i < 4; i++) {
  //   doc.line(audX, y + i * audRowH, audX + audW, y + i * audRowH);
  // }
  // Etiquetas fila 1
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Historia Clínica", x0 + 2, y + 5.5);
  doc.text("Ficha Audiológica", x0 + colW[0] + 2, y + 5.5);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`${datos.norden}`, x0 + colW[0] + colW[1] + 2, y + 5.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Audiómetro subdividido
  doc.setFont("helvetica", "bold").text("Marca", audX + 2, y + audRowH - 2.5);
  doc
    .setFont("helvetica", "normal")
    .text(`${datos.marca}`, audX + 22, y + audRowH - 2.5);
  doc
    .setFont("helvetica", "bold")
    .text("Modelo", audX + 2, y + audRowH * 2 - 2.5);
  doc
    .setFont("helvetica", "normal")
    .text(`${datos.modelo}`, audX + 22, y + audRowH * 2 - 2.5);
  doc
    .setFont("helvetica", "bold")
    .text("Calibración", audX + 2, y + audRowH * 3 - 2.5);
  doc
    .setFont("helvetica", "normal")
    .text(`${datos.calibracion}`, audX + 22, y + audRowH * 3 - 2.5);

  // Etiquetas fila 2
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fecha del Examen", x0 + 2, y + rowH1 + 5);
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`${datos.fechaExamen}`, x0 + colW[0] / 2, y + rowH1 + 9, {
    align: "center",
  });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("dd / mm / aa", x0 + colW[0] / 2, y + rowH1 + 12, {
    align: "center",
  });
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("EXAMEN", x0 + colW[0] + colW[1] / 2, y + rowH1 + 8, {
    align: "center",
  });
  doc.setFont("helvetica", "normal").setFontSize(7);

  doc.text(
    `Pre - Ocupacional (${datos.tipoExamen == "Pre-ocupacional" ? "X" : " "})`,
    x0 + colW[0] + colW[1] + 2,
    y + rowH1 + 3
  );

  doc.text(
    `Periódica (${datos.tipoExamen == "Periodica" ? "X" : " "})`,
    x0 + colW[0] + colW[1] + 2,
    y + rowH1 + 6
  );
  doc.text(
    `Retiro (${datos.tipoExamen == "Retiro" ? "X" : " "})`,
    x0 + colW[0] + colW[1] + 2,
    y + rowH1 + 9
  );
  doc.text(
    `Anual (${datos.tipoExamen == "Anual" ? "X" : " "})`,
    x0 + colW[0] + colW[1] + 2,
    y + rowH1 + 12
  );

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
  doc.text("Años de Trabajo", xText + 2, yDatos + 5);
  doc
    .setFont("helvetica", "bold")
    .text(`${datos.aniosTrabajo}`, xText + colW3[4] / 2, yDatos + 5, {
      align: "center",
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
    const yTick = graphY + i * (graphH / 13) + 2;
    doc.text(String(dB), graphX - 7, yTick, { align: "right" });
  }
  doc.text("dB", graphX - 10, graphY + graphH / 2, { align: "right" });

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
    { freq: 500, db: datos.od1_500, color: "red", tipo: "circle" },
    { freq: 1000, db: datos.od1_1000, color: "red", tipo: "circle" },
    { freq: 2000, db: datos.od1_2000, color: "red", tipo: "circle" },
    { freq: 3000, db: datos.od1_3000, color: "red", tipo: "circle" },
    { freq: 4000, db: datos.od1_4000, color: "red", tipo: "circle" },
    { freq: 6000, db: datos.od1_6000, color: "red", tipo: "circle" },
    { freq: 8000, db: datos.od1_8000, color: "red", tipo: "circle" },
    //azul ]
    { freq: 500, db: datos.oi1_500, color: "blue", tipo: "x" },
    { freq: 1000, db: datos.oi1_1000, color: "blue", tipo: "x" },
    { freq: 2000, db: datos.oi1_2000, color: "blue", tipo: "x" },
    { freq: 3000, db: datos.oi1_3000, color: "blue", tipo: "x" },
    { freq: 4000, db: datos.oi1_4000, color: "blue", tipo: "x" },
    { freq: 6000, db: datos.oi1_6000, color: "blue", tipo: "x" },
    { freq: 8000, db: datos.oi1_8000, color: "blue", tipo: "x" },
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
      .filter((p) => p.tipo === tipo && p.color === color)
      .sort((a, b) => a.freq - b.freq);
    if (pts.length < 2) return;
    // Dibujar línea conectando los puntos
    doc.setLineWidth(0.4);
    if (color === "red") doc.setDrawColor(255, 0, 0);
    else if (color === "blue") doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineCap(1);
    for (let i = 0; i < pts.length - 1; i++) {
      const freqIdx1 = freqs.indexOf(pts[i].freq);
      const freqIdx2 = freqs.indexOf(pts[i + 1].freq);
      if (freqIdx1 === -1 || freqIdx2 === -1) continue;
      const x1 = graphX + freqIdx1 * (graphW / 8);
      const y1 = graphY + ((pts[i].db + 10) / 120) * graphH;
      const x2 = graphX + freqIdx2 * (graphW / 8);
      const y2 = graphY + ((pts[i + 1].db + 10) / 120) * graphH;
      doc.line(x1, y1, x2, y2);
    }
  });
  // Dibujar los puntos (círculo o X)
  puntos.forEach((punto) => {
    const freqIdx = freqs.indexOf(punto.freq);
    if (freqIdx === -1) return;
    const x = graphX + freqIdx * (graphW / 8);
    const yP = graphY + ((punto.db + 10) / 120) * graphH;
    if (punto.color === "red") doc.setDrawColor(255, 0, 0);
    else if (punto.color === "blue") doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    if (punto.tipo === "circle") {
      doc.circle(x, yP, 1.0);
    } else if (punto.tipo === "x") {
      // Dibujar una X centrada en (x, yP)
      const size = 1.5;
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP + size / 2);
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP - size / 2);
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
    doc.text(
      diapasonRows[i],
      tableX + tColW + 3,
      tY + (i + 2) * tRowH + tRowH / 2,
      { align: "left", baseline: "middle" }
    );
  }

  const datosDiapasones = [
    { od: datos.txtDod250, oi: datos.txtDoi250 }, // 250 Hz
    { od: datos.txtDod500, oi: datos.txtDoi500 }, // 500 Hz
    { od: datos.txtDod1000, oi: datos.txtDoi1000 }, // 1000 Hz
  ];
  for (let i = 0; i < diapasonRows.length; i++) {
    const row = datosDiapasones[i];

    // OD
    doc.text(
      row.od || "",
      tableX + tColW / 2,
      tY + (i + 2) * tRowH + tRowH / 2,
      { align: "center", baseline: "middle" }
    );
    // OI
    doc.text(
      row.oi || "",
      tableX + 2 * tColW + tColW / 2,
      tY + (i + 2) * tRowH + tRowH / 2,
      { align: "center", baseline: "middle" }
    );
  }

  // --- Tabla LOGOAUDIOMETRIA ---
  tY += tH + 8;
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
  // Primera fila: solo una celda, sin líneas internas
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("LOGOAUDIOMETRIA", tableX + tableWRight / 2, tY + t2RowH / 2, {
    align: "center",
    baseline: "middle",
  });
  // Columnas con anchos personalizados SOLO desde la segunda fila
  let t2X = tableX;
  for (let i = 0; i < t2Cols - 1; i++) {
    t2X += t2ColWArr[i];
    // Solo dibujar líneas verticales desde la segunda fila hacia abajo
    doc.line(t2X, tY + t2RowH, t2X, tY + t2H);
  }
  // Encabezados de columna (segunda fila)
  doc.setFontSize(7);
  doc.text(
    "DERECHA",
    tableX + t2ColWArr[0] + t2ColWArr[1] / 2,
    tY + t2RowH + t2RowH / 2,
    { align: "center", baseline: "middle" }
  );
  doc.text(
    "IZQUIERDA",
    tableX + t2ColWArr[0] + t2ColWArr[1] + t2ColWArr[2] / 2,
    tY + t2RowH + t2RowH / 2,
    { align: "center", baseline: "middle" }
  );
  // Filas de etiquetas centradas
  doc.setFont("helvetica", "normal").setFontSize(7);
  const logoRows = [
    "Umbral de discriminación",
    "% de discriminación",
    "Umbral de Confort MCL",
    "Umbral de disconfort UCL",
  ];
  for (let i = 0; i < logoRows.length; i++) {
    doc.text(
      logoRows[i],
      tableX + t2ColWArr[0] / 2,
      tY + (i + 2) * t2RowH - t2RowH / 2,
      { align: "center", baseline: "middle" }
    );
  }
  const datosLogoAudiometria = [
    { derecha: "40 dB", izquierda: "45 dB" }, // Umbral de discriminación
    { derecha: "92%", izquierda: "88%" }, // % de discriminación
    { derecha: "75 dB", izquierda: "70 dB" }, // Umbral de Confort MCL
    { derecha: "95 dB", izquierda: "90 dB" }, // Umbral de disconfort UCL
  ];
  for (let i = 0; i < datosLogoAudiometria.length; i++) {
    const fila = datosLogoAudiometria[i];

    // Columna DERECHA
    doc.text(
      fila.derecha || "",
      tableX + t2ColWArr[0] + t2ColWArr[1] / 2,
      tY + (i + 2) * t2RowH - t2RowH / 2,
      { align: "center", baseline: "middle" }
    );

    // Columna IZQUIERDA
    doc.text(
      fila.izquierda || "",
      tableX + t2ColWArr[0] + t2ColWArr[1] + t2ColWArr[2] / 2,
      tY + (i + 2) * t2RowH - t2RowH / 2,
      { align: "center", baseline: "middle" }
    );
  }

  // --- Tabla de conclusiones y firmas (a todo el ancho) ---
  const conclY = Math.max(graphY + graphH, tY + t2H) + 12;
  const conclH = 12;
  const conclRows = 3;
  const conclW = pageW - 2 * 8;
  const conclX = 8;
  const conclCol1W = conclW * 0.23;
  const conclCol2W = conclW * 0.57;
  const conclCol3W = conclW * 0.2;
  // Marco exterior
  doc.rect(conclX, conclY, conclW, conclH * conclRows);
  // Líneas horizontales
  for (let i = 1; i < conclRows; i++) {
    doc.line(conclX, conclY + i * conclH, conclX + conclW, conclY + i * conclH);
  }
  // Líneas verticales
  doc.line(
    conclX + conclCol1W,
    conclY,
    conclX + conclCol1W,
    conclY + conclH * conclRows
  );
  doc.line(
    conclX + conclCol1W + conclCol2W,
    conclY,
    conclX + conclCol1W + conclCol2W,
    conclY + conclH * conclRows
  );
  // Unificar tamaño de fuente
  doc.setFont("helvetica", "normal").setFontSize(9);
  // Fila 1
  doc.text("Conclusiones:", conclX + 3, conclY + conclH / 2 + 2, {
    align: "left",
    baseline: "middle",
  });
  doc.text(
    `${datos.txtConclusiones}`,
    conclX + conclCol1W + 3,
    conclY + conclH / 2 + 2,
    {
      align: "left",
      baseline: "middle",
    }
  );
  doc.text(
    "Sello y Firma",
    conclX + conclCol1W + conclCol2W + conclCol3W / 2,
    conclY + conclH / 2 + 2,
    { align: "center", baseline: "middle" }
  );
  // Fila 2
  // Ajustar texto largo para que no se monte ni desborde
  const label2 = "Nombre del profesional que realiza la audiometría";
  const label2Lines = doc.splitTextToSize(label2, conclCol1W - 6);
  let label2Y = conclY + conclH + conclH / 2 + 1;
  if (label2Lines.length > 1) {
    // Si hay salto, centrar verticalmente
    label2Y = conclY + conclH + conclH / 2 - 2;
    doc.text(label2Lines, conclX + 3, label2Y, {
      align: "left",
      baseline: "middle",
    });
  } else {
    doc.text(label2, conclX + 3, conclY + conclH + conclH / 2 + 2, {
      align: "left",
      baseline: "middle",
    });
  }
  // Campo profesional: ajustar para que no se salga
  const profName = `${datos.txtResponsable}`;
  const profNameLines = doc.splitTextToSize(profName, conclCol2W - 6);
  let profNameY = conclY + conclH + conclH / 2 + 2;
  if (profNameLines.length > 1) {
    profNameY = conclY + conclH + conclH / 2 - 2;
    doc.text(profNameLines, conclX + conclCol1W + 3, profNameY, {
      align: "left",
      baseline: "middle",
    });
  } else {
    doc.text(
      profName,
      conclX + conclCol1W + 3,
      conclY + conclH + conclH / 2 + 2,
      { align: "left", baseline: "middle" }
    );
  }
  doc.text(
    "Sello y Firma",
    conclX + conclCol1W + conclCol2W + conclCol3W / 2,
    conclY + conclH + conclH / 2 + 2,
    { align: "center", baseline: "middle" }
  );
  // Fila 3
  doc.text(
    "Nombre del Medico",
    conclX + 3,
    conclY + 2 * conclH + conclH / 2 + 2,
    { align: "left", baseline: "middle" }
  );
  doc.text(
    `${datos.txtMedico}`,
    conclX + conclCol1W + 3,
    conclY + 2 * conclH + conclH / 2 + 2,
    {
      align: "left",
      baseline: "middle",
    }
  );
  doc.text(
    "Sello y Firma",
    conclX + conclCol1W + conclCol2W + conclCol3W / 2,
    conclY + 2 * conclH + conclH / 2 + 2,
    { align: "center", baseline: "middle" }
  );

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
