import jsPDF from "jspdf";
import headerAnexo16 from "./Headers/Header_Anexo16.jsx";

export default function Anexo16(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 0; // Sin márgenes
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  
  // === PÁGINA 1 ===
  // === 0) HEADER ===
  headerAnexo16(doc, data, 1);

  // === 1) Imagen de fondo para Anexo16 - Página 1 ===
  const fondoImg = "/img/Anexo16/Anexo16_pag1.png";

  // Márgenes de 8mm a cada lado (consistente con Anexo2)
  const margenLateral = 6; // 6mm

  // Usar el ancho del documento menos los márgenes laterales
  const imgWidth = pageW - (margenLateral * 2); // Ancho menos márgenes
  const imgHeight = pageH * 0.85; // 85% de la altura para dejar espacio para ajustar

  // Posicionar desde abajo hacia arriba con márgenes laterales
  const xOffset = margenLateral; // Margen izquierdo
  const yOffset = pageH - imgHeight - 8; // Subido 8 puntos hacia arriba

  try {
    doc.addImage(fondoImg, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  } catch (e) {
    doc.text("Imagen de Anexo16 Página 1 no disponible", margin, yOffset + 10);
  }

  // === 2) CAMPOS DE DATOS PERSONALIZABLES PARA PÁGINA 1 ===
  
  // Datos de prueba para Anexo16
  const datosPrueba = {
    fechaExamen: "15/08/2025",
    mineralesExplotados: "Oro, Plata, Cobre",
    lugarFechaNacimiento: "Trujillo, 15/03/1985",
    domicilioHabitual: "Av. Principal 123, Urbanización Los Olivos, Trujillo",
    tipoTrabajo: {
      superficie: true,    // No marcado
      concentrador: true,   // Marcado (como en la imagen)
      subsuelo: true      // No marcado
    },
    alturaLabor: {
      debajo2500: true,
      rango2501_4000: true,
      rango2501_3000: true,
      rango4001_4500: true,
      rango2001_3500: true,
      mas4501: true  // Solo marcar uno según la respuesta
    },
    // Datos personales
    datosPersonales: {
      edad: "38",
      sexo: {
        masculino: true,   // M marcado
        femenino: true    // F no marcado
      },
      dni: "12345678",
      telefono: "987654321",
      estadoCivil: {
        soltero: true,
        casado: true,      // Casado marcado
        conviviente: true,
        viudo: true,
        divorciado: true
      },
        gradoInstruccion: {
          analfabeto: true,
          primariaCompleta: true,
          primariaIncompleta: true,
          secundariaCompleta: true,  // Sec.Com marcado
          secundariaIncompleta: true,
          universidad: true,
          tecnico: true
        }
      },
      // Factores de riesgo ocupacional
      factoresRiesgo: {
        // Primera columna
        ruido: true,
        polvo: true,
        vibSegmentario: true,
        vibTotal: true,
        // Segunda columna
        cancerigenos: true,
        mutagenicos: true,
        solventes: true,
        metales: true,
        // Tercera columna
        temperatura: true,
        biologicos: true,
        posturas: true,
        turnos: true,
        // Cuarta columna
        carga: true,
        movRepet: true,
        pvd: true,
        otros: true
      },
      // Información del puesto
      informacionPuesto: {
        puestoPostula: "Operador de Maquinaria Pesada",
        puestoActual: "Asistente de Operaciones",
        tiempo: "2 años",
        reubicacion: {
          si: true,
          no: true  // NO marcado
        }
      },
      // Antecedentes médicos
      antecedentesMedicos: {
        personales: "Hipertensión arterial desde 2020. Accidente laboral en 2019 con fractura de brazo derecho.",
        familiares: "Padre con diabetes tipo 2. Madre con hipertensión arterial."
      },
      // Inmunizaciones
      inmunizaciones: {
        tetano: true,
        hepatitisB: true,
        fiebreAmarilla: true
      },
      // Número de hijos
      numeroHijos: {
        vivos: "2",
        muertos: "0"
      },
      // Hábitos
      habitos: {
        tabaco: {
          nada: true,
          poco: true,
          habitual: true,
          excesivo: true
        },
        alcohol: {
          nada: true,
          poco: true,
          habitual: true,
          excesivo: true
        },
        drogas: {
          nada: true,
          poco: true,
          habitual: true,
          excesivo: true
        }
      },
      // Medidas corporales
      medidasCorporales: {
        talla: "175",
        peso: "78",
        imc: "25.4",
        cintura: "85",
        cadera: "95",
        icc: "0.89"
      },
      // Función respiratoria
      funcionRespiratoria: {
        fvc: "4.2",
        fev1: "3.5",
        fev1Fvc: "83.3",
        fef2575: "3.1",
        conclusion: "Función pulmonar normal"
      },
      // Temperatura
      temperatura: "36.5",
      // Evaluación física
      evaluacionFisica: {
        cabeza: "NORMAL, SIN ALTERACIONES VISIBLES",
        perimetroCuello: "38.5",
        bocaAmigdalas: "MUCOSA ORAL NORMAL, AMÍGDALAS SIN ALTERACIONES",
        cuello: "NORMAL, SIN ADENOPATÍAS",
        nariz: "NORMAL, SIN OBSTRUCCIONES",
        dentadura: {
          piezasMalEstado: "1",
          piezasFaltantes: "2"
        }
      },
      // Evaluación oftalmológica
      evaluacionOftalmologica: {
        vision: {
          cerca: {
            sinCorregir: {
              od: "20/20",  // Ojo derecho
              oi: "20/25"   // Ojo izquierdo
            },
            corregida: {
              od: "20/20",
              oi: "20/20"
            }
          },
          lejos: {
            sinCorregir: {
              od: "20/30",
              oi: "20/40"
            },
            corregida: {
              od: "20/20",
              oi: "20/20"
            }
          },
          colores: "NORMAL"
        },
        enfermedadesOculares: "NINGUNA",
        reflejosPupilares: "NORMALES, ISOCÓRICAS, FOTORREACTIVAS"
      },
       // Evaluación de oídos
       evaluacionOidos: {
         audiometria: {
           oidoDerecho: {
             frecuencia500: "20",
             frecuencia1000: "15",
             frecuencia2000: "20",
             frecuencia3000: "25",
             frecuencia4000: "10",
             frecuencia6000: "5",
             frecuencia8000: "10"
           },
           oidoIzquierdo: {
             frecuencia500: "10",
             frecuencia1000: "5",
             frecuencia2000: "10",
             frecuencia3000: "15",
             frecuencia4000: "10",
             frecuencia6000: "10",
             frecuencia8000: "5"
           }
         },
         otoscopia: {
           oidoDerecho: "NORMAL",
           oidoIzquierdo: "NORMAL"
         }
       },
       // Signos vitales
       signosVitales: {
         frecuenciaRespiratoria: "18",
         frecuenciaCardiaca: "72",
         saturacionOxigeno: "98",
         presionArterial: {
           sistolica: "120",
           diastolica: "80"
         }
       },
       // Evaluación física adicional
       evaluacionFisicaAdicional: {
         pulmones: {
           normal: true,
           anormal: true,
           descripcion: "AUSCULTACIÓN PULMONAR NORMAL, SIN SIBILANCIAS NI RONCUS,AUSCULTACIÓN PULMONAR NORMAL, SIN SIBILANCIAS NI RONCUS"
         },
         miembrosSuperiores: "MOVILIDAD COMPLETA, FUERZA MUSCULAR NORMAL, SIN DEFORMIDADES,MOVILIDAD COMPLETA, FUERZA MUSCULAR NORMAL, SIN DEFORMIDADES,MOVILIDAD COMPLETA, FUERZA MUSCULAR NORMAL, SIN DEFORMIDADES,MOVILIDAD COMPLETA, FUERZA MUSCULAR NORMAL, SIN DEFORMIDADES",
         miembrosInferiores: "MARCHA NORMAL, FUERZA MUSCULAR ADECUADA, SIN EDEMAS,MARCHA NORMAL, FUERZA MUSCULAR ADECUADA, SIN EDEMAS,MARCHA NORMAL, FUERZA MUSCULAR ADECUADA, SIN EDEMAS,MARCHA NORMAL, FUERZA MUSCULAR ADECUADA, SIN EDEMAS"
       },
       // Página 2 - Evaluación neurológica y física
       evaluacionNeurologica: {
         reflejosOsteotendinosos: "CONSERVADOS",
         marcha: "NORMAL"
       },
       // Evaluación de columna y abdomen
       evaluacionColumnaAbdomen: {
         columnaVertebral: "CENTRAL, MÓVIL, CURVATURAS CONSERVADAS",
         abdomen: "RHA(+), B/D, NO DOLOROSO A LA PALPACIÓN",
         anillosInguinales: "CONSERVADOS",
         organosGenitales: "DE CARÁCTER NORMAL"
       },
       // Evaluación rectal y hernias
       evaluacionRectalHernias: {
         tactoRectal: {
           noSeHizo: true,
           anormal: true,
           normal: true,
           describirEnObservacion: true
         },
         hernias: "NO",
         varices: "NO",
         gangliosLinfaticos: "NO LINFADENOPATÍAS"
       },
       // Evaluación mental
       evaluacionMental: {
         lenguajeAtencionMemoria: "NORMAL",
         anamnesis: "COLABORADOR REFIERE SENTIRSE BIEN, SIN PROBLEMAS DE SALUD",
         estadoMental: "DESPIERTO, OTEP, COMUNICATIVO"
       },
       // Radiografía de tórax
       radiografiaTorax: {
         numeroRx: "96639",
         fecha: "28/05/2025",
         calidad: "2",
         simbolos: "N/A",
         vertices: "LIBRES",
         hilios: "NORMALES",
         senos: "LIBRES",
         mediastinos: "NORMALES",
         conclusionesRadiograficas: "TRAMA BRONCOVASCULAR",
         siluetaCardiovascular: "NORMAL"
       },
       // Reacciones serológicas
       reaccionesSerologicas: {
         lues: "a -Lues",
         titulacion: "0/0" // Primera opción marcada
       },
       // Grupo sanguíneo
       grupoSanguineo: {
         grupo: {
           o: true,
           a: false,
           b: false,
           ab: false
         },
         factorRh: {
           positivo: true,
           negativo: false
         }
       },
       // Hemoglobina/Hematocrito
       hemoglobinaHematocrito: "13 gr. %"
    };

  // Usar datos de prueba por ahora
  const datosFinales = datosPrueba;

  // === SECCIÓN: FECHA DEL EXAMEN Y MINERALES ===
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.setTextColor(0, 0, 0);

  // Fecha del Examen (izquierda)
  const xFechaExamen = 40;
  const yFechaExamen = 40.2;
  if (datosFinales.fechaExamen) {
    doc.text(datosFinales.fechaExamen.toUpperCase(), xFechaExamen, yFechaExamen);
  }

  // Minerales Explotados (derecha)
  const xMinerales = 140;
  const yMinerales = 40.2;
  if (datosFinales.mineralesExplotados) {
    doc.text(datosFinales.mineralesExplotados.toUpperCase(), xMinerales, yMinerales);
  }

  // === SECCIÓN: COLUMNAS PRINCIPALES ===
  
  // Columna 1: LUGAR Y FECHA DE NACIMIENTO
  const xLugarNacimiento = 15;
  const yLugarNacimiento = 50;
  if (datosFinales.lugarFechaNacimiento) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.lugarFechaNacimiento.toUpperCase(), xLugarNacimiento, yLugarNacimiento, { maxWidth: 40 });
  }

  // Columna 2: DOMICILIO HABITUAL
  const xDomicilio = 57;
  const yDomicilio = 50;
  if (datosFinales.domicilioHabitual) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.domicilioHabitual.toUpperCase(), xDomicilio, yDomicilio, { maxWidth: 35 });
  }

  // Columna 3: TIPO DE TRABAJO - Checkboxes (SUPERFICIE, CONCENTRADOR, SUBSUELO)
  const tipoTrabajoPosiciones = [
    { tipo: "superficie", x: 128, y: 46, texto: "SUPERFICIE" },
    { tipo: "concentrador", x: 128, y: 54, texto: "CONCENTRADOR" },
    { tipo: "subsuelo", x: 128, y: 61, texto: "SUBSUELO" }
  ];

  if (datosFinales.tipoTrabajo) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    tipoTrabajoPosiciones.forEach(pos => {
      if (datosFinales.tipoTrabajo[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // Columna 4: ALTURA DE LA LABOR (MSNM) - Checkboxes
  const alturaPosiciones = [
    { rango: "debajo2500", x: 162, y: 50.2, texto: "Debajo 2500" },
    { rango: "rango2501_4000", x: 192, y: 50.2, texto: "2501 a 4000" },
    { rango: "rango2501_3000", x: 162, y: 55.7, texto: "2501 a 3000" },
    { rango: "rango4001_4500", x: 192, y: 55.7, texto: "4001 a 4500" },
    { rango: "rango2001_3500", x: 162, y: 61.2, texto: "2001 a 3500" },
    { rango: "mas4501", x: 192, y: 61.2, texto: "Más de 4501" }
  ];

  if (datosFinales.alturaLabor) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    alturaPosiciones.forEach(pos => {
      if (datosFinales.alturaLabor[pos.rango]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: DATOS PERSONALES ===
  // EDAD
  const xEdad = 11;
  const yEdad = 73.5;
  if (datosFinales.datosPersonales && datosFinales.datosPersonales.edad) {
    doc.setFont("helvetica", "normal").setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.datosPersonales.edad, xEdad, yEdad);
  }

  // SEXO - Checkboxes
  const sexoPosiciones = [
    { tipo: "masculino", x: 28.3, y: 74, texto: "M" },
    { tipo: "femenino", x: 28.3, y: 79.8, texto: "F" }
  ];

  if (datosFinales.datosPersonales && datosFinales.datosPersonales.sexo) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    sexoPosiciones.forEach(pos => {
      if (datosFinales.datosPersonales.sexo[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // DNI / CE / NIE
  const xDni = 48.5;
  const yDni = 71;
  if (datosFinales.datosPersonales && datosFinales.datosPersonales.dni) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.datosPersonales.dni, xDni, yDni);
  }

  // TELÉFONO
  const xTelefono = 49;
  const yTelefono = 81;
  if (datosFinales.datosPersonales && datosFinales.datosPersonales.telefono) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.datosPersonales.telefono, xTelefono, yTelefono);
  }

  // ESTADO CIVIL - Checkboxes
  const estadoCivilPosiciones = [
    { tipo: "soltero", x: 90.5, y: 72.5, texto: "Soltero" },
    { tipo: "casado", x: 90.5, y: 78, texto: "Casado" },
    { tipo: "conviviente", x: 119.7, y: 71.1, texto: "Conviviente" },
    { tipo: "viudo", x: 119.7, y: 76.7, texto: "Viudo" },
    { tipo: "divorciado", x: 119.7, y: 82.3, texto: "Divorciado" }
  ];

  if (datosFinales.datosPersonales && datosFinales.datosPersonales.estadoCivil) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    estadoCivilPosiciones.forEach(pos => {
      if (datosFinales.datosPersonales.estadoCivil[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // GRADO DE INSTRUCCIÓN - Checkboxes (en dos columnas)
  const gradoInstruccionPosiciones = [
    // Columna izquierda
    { tipo: "analfabeto", x: 153.2, y: 70.7, texto: "Analfabeto" },
    { tipo: "primariaCompleta", x: 153.2, y: 76.1, texto: "Primaria.Com." },
    { tipo: "primariaIncompleta", x: 153.2, y: 81.5, texto: "Primaria.Inc." },
    // Columna derecha
    { tipo: "secundariaCompleta", x: 172.3, y: 76.1, texto: "Sec.Com" },
    { tipo: "secundariaIncompleta", x: 172.3, y: 81.5, texto: "Sec.Inc" },
    { tipo: "universidad", x: 192, y: 76.1, texto: "Univers" },
    { tipo: "tecnico", x: 192, y: 81.5, texto: "Técnico" }
  ];

  if (datosFinales.datosPersonales && datosFinales.datosPersonales.gradoInstruccion) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    gradoInstruccionPosiciones.forEach(pos => {
      if (datosFinales.datosPersonales.gradoInstruccion[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: FACTORES DE RIESGO OCUPACIONAL ===
  const factoresRiesgoPosiciones = [
    // Primera columna
    { factor: "ruido", x: 34, y: 88.7, texto: "Ruido" },
    { factor: "polvo", x: 34, y: 94, texto: "Polvo" },
    { factor: "vibSegmentario", x: 34, y: 99, texto: "Vib Segmentario" },
    { factor: "vibTotal", x: 34, y: 104, texto: "Vib Total" },
    // Segunda columna
    { factor: "cancerigenos", x: 63, y: 88.7, texto: "Cancerígenos" },
    { factor: "mutagenicos", x: 63, y: 94, texto: "Mutágenicos" },
    { factor: "solventes", x: 63, y: 99, texto: "Solventes" },
    { factor: "metales", x: 63, y: 104, texto: "Metales" },
    // Tercera columna
    { factor: "temperatura", x: 88.5, y: 88.7, texto: "Temperatura" },
    { factor: "biologicos", x: 88.5, y: 94, texto: "Biológicos" },
    { factor: "posturas", x: 88.5, y: 99, texto: "Posturas" },
    { factor: "turnos", x: 88.5, y: 104, texto: "Turnos" },
    // Cuarta columna
    { factor: "carga", x: 115.5, y: 88.7, texto: "Carga" },
    { factor: "movRepet", x: 115.5, y: 94, texto: "Mov. Repet." },
    { factor: "pvd", x: 115.5, y: 99, texto: "PVD" },
    { factor: "otros", x: 115.5, y: 104, texto: "Otros" }
  ];

  if (datosFinales.factoresRiesgo) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    factoresRiesgoPosiciones.forEach(pos => {
      if (datosFinales.factoresRiesgo[pos.factor]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: INFORMACIÓN DEL PUESTO ===
  // Puesto al que Postula
  const xPuestoPostula = 155;
  const yPuestoPostula = 89;
  if (datosFinales.informacionPuesto && datosFinales.informacionPuesto.puestoPostula) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.informacionPuesto.puestoPostula.toUpperCase(), xPuestoPostula, yPuestoPostula);
  }

  // Puesto Actual
  const xPuestoActual = 155;
  const yPuestoActual = 94;
  if (datosFinales.informacionPuesto && datosFinales.informacionPuesto.puestoActual) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.informacionPuesto.puestoActual.toUpperCase(), xPuestoActual, yPuestoActual);
  }

  // Tiempo
  const xTiempo = 155;
  const yTiempo = 99;
  if (datosFinales.informacionPuesto && datosFinales.informacionPuesto.tiempo) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.informacionPuesto.tiempo.toUpperCase(), xTiempo, yTiempo);
  }

  // Reubicación - Checkboxes
  const reubicacionPosiciones = [
    { tipo: "si", x: 148.5, y: 104, texto: "SI" },
    { tipo: "no", x: 165, y: 104, texto: "NO" }
  ];

  if (datosFinales.informacionPuesto && datosFinales.informacionPuesto.reubicacion) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    reubicacionPosiciones.forEach(pos => {
      if (datosFinales.informacionPuesto.reubicacion[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: ANTECEDENTES MÉDICOS ===
  // Antecedentes Personales
  const xAntecedentesPersonales = 70;
  const yAntecedentesPersonales = 115;
  if (datosFinales.antecedentesMedicos && datosFinales.antecedentesMedicos.personales) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.antecedentesMedicos.personales.toUpperCase(), xAntecedentesPersonales, yAntecedentesPersonales, { maxWidth: 130 });
  }

  // Antecedentes Familiares
  const xAntecedentesFamiliares = 8;
  const yAntecedentesFamiliares = 133;
  if (datosFinales.antecedentesMedicos && datosFinales.antecedentesMedicos.familiares) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.antecedentesMedicos.familiares.toUpperCase(), xAntecedentesFamiliares, yAntecedentesFamiliares, { maxWidth: 70 });
  }


  // === SECCIÓN: INMUNIZACIONES ===
  const inmunizacionesPosiciones = [
    { tipo: "tetano", x: 93, y: 135, texto: "TETANO" },
    { tipo: "hepatitisB", x: 122, y: 135, texto: "HEPATITIS - B" },
    { tipo: "fiebreAmarilla", x: 157, y: 135, texto: "FIEBRE AMARILLA" }
  ];

  if (datosFinales.inmunizaciones) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    inmunizacionesPosiciones.forEach(pos => {
      if (datosFinales.inmunizaciones[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: NÚMERO DE HIJOS ===
  const xHijosVivos = 177;
  const yHijosVivos = 137;
  if (datosFinales.numeroHijos && datosFinales.numeroHijos.vivos) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.numeroHijos.vivos, xHijosVivos, yHijosVivos);
  }

  const xHijosMuertos = 195;
  const yHijosMuertos = 137;
  if (datosFinales.numeroHijos && datosFinales.numeroHijos.muertos) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.numeroHijos.muertos, xHijosMuertos, yHijosMuertos);
  }

  // === SECCIÓN: HÁBITOS ===
  const habitosPosiciones = [
    // Tabaco
    { habito: "tabaco", nivel: "nada", x: 26, y: 149, texto: "Nada" },
    { habito: "tabaco", nivel: "poco", x: 26, y: 154.3, texto: "Poco" },
    { habito: "tabaco", nivel: "habitual", x: 26, y: 159.2, texto: "Habitual" },
    { habito: "tabaco", nivel: "excesivo", x: 26, y: 164.8, texto: "Excesivo" },
    // Alcohol
    { habito: "alcohol", nivel: "nada", x: 42, y: 149, texto: "Nada" },
    { habito: "alcohol", nivel: "poco", x: 42, y: 154.3, texto: "Poco" },
    { habito: "alcohol", nivel: "habitual", x: 42, y: 159.2, texto: "Habitual" },
    { habito: "alcohol", nivel: "excesivo", x: 42, y: 164.8, texto: "Excesivo" },
    // Drogas
    { habito: "drogas", nivel: "nada", x: 58.7, y: 149, texto: "Nada" },
    { habito: "drogas", nivel: "poco", x: 58.7, y: 154.3, texto: "Poco" },
    { habito: "drogas", nivel: "habitual", x: 58.7, y: 159.2, texto: "Habitual" },
    { habito: "drogas", nivel: "excesivo", x: 58.7, y: 164.8, texto: "Excesivo" }
  ];

  if (datosFinales.habitos) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    habitosPosiciones.forEach(pos => {
      if (datosFinales.habitos[pos.habito] && datosFinales.habitos[pos.habito][pos.nivel]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: MEDIDAS CORPORALES ===
  // Talla
  const xTalla = 75;
  const yTalla = 149;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.talla) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.talla, xTalla, yTalla);
  }

  // Peso
  const xPeso = 95;
  const yPeso = 149;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.peso) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.peso, xPeso, yPeso);
  }

  // IMC
  const xImc = 84;
  const yImc = 164;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.imc) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.imc, xImc, yImc);
  }

  // === SECCIÓN: FUNCIÓN RESPIRATORIA ===
  // FVC
  const xFvc = 120;
  const yFvc = 148;
  if (datosFinales.funcionRespiratoria && datosFinales.funcionRespiratoria.fvc) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.funcionRespiratoria.fvc, xFvc, yFvc);
  }

  // FEV1
  const xFev1 = 120;
  const yFev1 = 154;
  if (datosFinales.funcionRespiratoria && datosFinales.funcionRespiratoria.fev1) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.funcionRespiratoria.fev1, xFev1, yFev1);
  }

  // FEV1/FVC
  const xFev1Fvc = 160;
  const yFev1Fvc = 148;
  if (datosFinales.funcionRespiratoria && datosFinales.funcionRespiratoria.fev1Fvc) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.funcionRespiratoria.fev1Fvc, xFev1Fvc, yFev1Fvc);
  }

  // FEF 25-75%
  const xFef2575 = 160;
  const yFef2575 = 154;
  if (datosFinales.funcionRespiratoria && datosFinales.funcionRespiratoria.fef2575) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.funcionRespiratoria.fef2575, xFef2575, yFef2575);
  }

  // Conclusión
  const xConclusion = 109;
  const yConclusion = 162;
  if (datosFinales.funcionRespiratoria && datosFinales.funcionRespiratoria.conclusion) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.funcionRespiratoria.conclusion.toUpperCase(), xConclusion, yConclusion, { maxWidth: 70 });
  }

  // === SECCIÓN: TEMPERATURA ===
  const xTemperatura = 185;
  const yTemperatura = 148;
  if (datosFinales.temperatura) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.temperatura, xTemperatura, yTemperatura);
  }

  // === SECCIÓN: CINTURA / CADERA / ICC ===
  // Cintura
  const xCintura = 185;
  const yCintura = 154;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.cintura) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.cintura, xCintura, yCintura);
  }

  // Cadera
  const xCadera = 185;
  const yCadera = 158;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.cadera) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.cadera, xCadera, yCadera);
  }

  // ICC
  const xIcc = 185;
  const yIcc = 163;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.icc) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.icc, xIcc, yIcc);
  }

  // === SECCIÓN: EVALUACIÓN FÍSICA ===
  // CABEZA
  const xCabeza = 25;
  const yCabeza = 170;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.cabeza) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.cabeza.toUpperCase(), xCabeza, yCabeza, { maxWidth: 60 });
  }

  // PERÍMETRO CUELLO
  const xPerimetroCuello = 40;
  const yPerimetroCuello = 175;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.perimetroCuello) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.perimetroCuello.toUpperCase(), xPerimetroCuello, yPerimetroCuello);
  }

  // BOCA, AMÍGDALAS, FARINGE, LARINGE
  const xBocaAmigdalas = 15;
  const yBocaAmigdalas = 183;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.bocaAmigdalas) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.bocaAmigdalas.toUpperCase(), xBocaAmigdalas, yBocaAmigdalas, { maxWidth: 60 });
  }

  // CUELLO
  const xCuello = 125;
  const yCuello = 170;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.cuello) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.cuello.toUpperCase(), xCuello, yCuello, { maxWidth: 60 });
  }

  // NARÍZ
  const xNariz = 125;
  const yNariz = 175;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.nariz) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.nariz.toUpperCase(), xNariz, yNariz, { maxWidth: 60 });
  }

  // DENTADURA - Piezas en mal estado
  const xPiezasMalEstado = 170;
  const yPiezasMalEstado = 181;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.dentadura && datosFinales.evaluacionFisica.dentadura.piezasMalEstado) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.dentadura.piezasMalEstado.toUpperCase(), xPiezasMalEstado, yPiezasMalEstado, { maxWidth: 60 });
  }

  // DENTADURA - Piezas que faltan
  const xPiezasFaltantes = 170;
  const yPiezasFaltantes = 186;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.dentadura && datosFinales.evaluacionFisica.dentadura.piezasFaltantes) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.dentadura.piezasFaltantes.toUpperCase(), xPiezasFaltantes, yPiezasFaltantes, { maxWidth: 60 });
  }

  // === SECCIÓN: EVALUACIÓN OFTALMOLÓGICA (OJOS) ===
  // VISIÓN DE CERCA - SIN CORREGIR
  const xVisionCercaSinCorregirOD = 40;
  const yVisionCercaSinCorregirOD = 203;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.cerca && datosFinales.evaluacionOftalmologica.vision.cerca.sinCorregir) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.cerca.sinCorregir.od.toUpperCase(), xVisionCercaSinCorregirOD, yVisionCercaSinCorregirOD);
  }

  const xVisionCercaSinCorregirOI = 57;
  const yVisionCercaSinCorregirOI = 203;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.cerca && datosFinales.evaluacionOftalmologica.vision.cerca.sinCorregir) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.cerca.sinCorregir.oi.toUpperCase(), xVisionCercaSinCorregirOI, yVisionCercaSinCorregirOI);
  }

  // VISIÓN DE CERCA - CORREGIDA
  const xVisionCercaCorregidaOD = 75;
  const yVisionCercaCorregidaOD = 203;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.cerca && datosFinales.evaluacionOftalmologica.vision.cerca.corregida) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.cerca.corregida.od.toUpperCase(), xVisionCercaCorregidaOD, yVisionCercaCorregidaOD);
  }

  const xVisionCercaCorregidaOI = 94;
  const yVisionCercaCorregidaOI = 203;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.cerca && datosFinales.evaluacionOftalmologica.vision.cerca.corregida) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.cerca.corregida.oi.toUpperCase(), xVisionCercaCorregidaOI, yVisionCercaCorregidaOI);
  }

  // VISIÓN DE LEJOS - SIN CORREGIR
  const xVisionLejosSinCorregirOD = 40;
  const yVisionLejosSinCorregirOD = 210;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.lejos && datosFinales.evaluacionOftalmologica.vision.lejos.sinCorregir) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.lejos.sinCorregir.od.toUpperCase(), xVisionLejosSinCorregirOD, yVisionLejosSinCorregirOD);
  }

  const xVisionLejosSinCorregirOI = 57;
  const yVisionLejosSinCorregirOI = 210;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.lejos && datosFinales.evaluacionOftalmologica.vision.lejos.sinCorregir) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.lejos.sinCorregir.oi.toUpperCase(), xVisionLejosSinCorregirOI, yVisionLejosSinCorregirOI);
  }

  // VISIÓN DE LEJOS - CORREGIDA
  const xVisionLejosCorregidaOD = 75;
  const yVisionLejosCorregidaOD = 210;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.lejos && datosFinales.evaluacionOftalmologica.vision.lejos.corregida) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.lejos.corregida.od.toUpperCase(), xVisionLejosCorregidaOD, yVisionLejosCorregidaOD);
  }

  const xVisionLejosCorregidaOI = 94;
  const yVisionLejosCorregidaOI = 210;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.lejos && datosFinales.evaluacionOftalmologica.vision.lejos.corregida) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.lejos.corregida.oi.toUpperCase(), xVisionLejosCorregidaOI, yVisionLejosCorregidaOI);
  }

  // VISIÓN DE COLORES
  const xVisionColores = 70;
  const yVisionColores = 216;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.vision && datosFinales.evaluacionOftalmologica.vision.colores) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.vision.colores.toUpperCase(), xVisionColores, yVisionColores, { align: 'center' });
  }

  // ENFERMEDADES OCULARES
  const xEnfermedadesOculares = 110;
  const yEnfermedadesOculares = 195;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.enfermedadesOculares) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.enfermedadesOculares.toUpperCase(), xEnfermedadesOculares, yEnfermedadesOculares, { maxWidth: 100 });
  }

  // REFLEJOS PUPILARES
  const xReflejosPupilares = 141;
  const yReflejosPupilares = 216;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.reflejosPupilares) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.reflejosPupilares.toUpperCase(), xReflejosPupilares, yReflejosPupilares, { maxWidth: 100 });
  }

  // === SECCIÓN: EVALUACIÓN DE OÍDOS ===
  // AUDIOMETRÍA - OÍDO DERECHO
  const audiometriaOidoDerecho = [
    { frecuencia: "frecuencia500", x: 28.5, y: 233, valor: "20" },
    { frecuencia: "frecuencia1000", x: 40, y: 233, valor: "15" },
    { frecuencia: "frecuencia2000", x: 52, y: 233, valor: "20" },
    { frecuencia: "frecuencia3000", x: 63, y: 233, valor: "25" },
    { frecuencia: "frecuencia4000", x: 74, y: 233, valor: "10" },
    { frecuencia: "frecuencia6000", x: 85, y: 233, valor: "5" },
    { frecuencia: "frecuencia8000", x: 97, y: 233, valor: "10" }
  ];

  if (datosFinales.evaluacionOidos && datosFinales.evaluacionOidos.audiometria && datosFinales.evaluacionOidos.audiometria.oidoDerecho) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);

    audiometriaOidoDerecho.forEach(pos => {
      if (datosFinales.evaluacionOidos.audiometria.oidoDerecho[pos.frecuencia]) {
        doc.text(datosFinales.evaluacionOidos.audiometria.oidoDerecho[pos.frecuencia], pos.x, pos.y, { align: 'center' });
      }
    });
  }

  // AUDIOMETRÍA - OÍDO IZQUIERDO
  const audiometriaOidoIzquierdo = [
    { frecuencia: "frecuencia500", x: 129, y: 233, valor: "10" },
    { frecuencia: "frecuencia1000", x: 140, y: 233, valor: "5" },
    { frecuencia: "frecuencia2000", x: 151, y: 233, valor: "10" },
    { frecuencia: "frecuencia3000", x: 163, y: 233, valor: "15" },
    { frecuencia: "frecuencia4000", x: 173, y: 233, valor: "10" },
    { frecuencia: "frecuencia6000", x: 185, y: 233, valor: "10" },
    { frecuencia: "frecuencia8000", x: 197, y: 233, valor: "5" }
  ];

  if (datosFinales.evaluacionOidos && datosFinales.evaluacionOidos.audiometria && datosFinales.evaluacionOidos.audiometria.oidoIzquierdo) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);

    audiometriaOidoIzquierdo.forEach(pos => {
      if (datosFinales.evaluacionOidos.audiometria.oidoIzquierdo[pos.frecuencia]) {
        doc.text(datosFinales.evaluacionOidos.audiometria.oidoIzquierdo[pos.frecuencia], pos.x, pos.y, { align: 'center' });
      }
    });
  }

  // OTOSCOPÍA - OÍDO DERECHO
  const xOtoscopiaOidoDerecho = 42;
  const yOtoscopiaOidoDerecho = 240.5;
  if (datosFinales.evaluacionOidos && datosFinales.evaluacionOidos.otoscopia && datosFinales.evaluacionOidos.otoscopia.oidoDerecho) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOidos.otoscopia.oidoDerecho.toUpperCase(), xOtoscopiaOidoDerecho, yOtoscopiaOidoDerecho);
  }

  // OTOSCOPÍA - OÍDO IZQUIERDO
  const xOtoscopiaOidoIzquierdo = 42;
  const yOtoscopiaOidoIzquierdo = 245.1;
  if (datosFinales.evaluacionOidos && datosFinales.evaluacionOidos.otoscopia && datosFinales.evaluacionOidos.otoscopia.oidoIzquierdo) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOidos.otoscopia.oidoIzquierdo.toUpperCase(), xOtoscopiaOidoIzquierdo, yOtoscopiaOidoIzquierdo);
  }

  // === SECCIÓN: SIGNOS VITALES ===
  // F.Respiratoria
  const xFrecuenciaRespiratoria = 133;
  const yFrecuenciaRespiratoria = 240.5;
  if (datosFinales.signosVitales && datosFinales.signosVitales.frecuenciaRespiratoria) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.frecuenciaRespiratoria, xFrecuenciaRespiratoria, yFrecuenciaRespiratoria);
  }

  // F.Cardíaca
  const xFrecuenciaCardiaca = 133;
  const yFrecuenciaCardiaca = 244.3;
  if (datosFinales.signosVitales && datosFinales.signosVitales.frecuenciaCardiaca) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.frecuenciaCardiaca, xFrecuenciaCardiaca, yFrecuenciaCardiaca);
  }

  // Sat.02
  const xSaturacionOxigeno = 133;
  const ySaturacionOxigeno = 248;
  if (datosFinales.signosVitales && datosFinales.signosVitales.saturacionOxigeno) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.saturacionOxigeno, xSaturacionOxigeno, ySaturacionOxigeno);
  }

  // PRESIÓN ARTERIAL SISTÉMICA - Sistólica
  const xPresionSistolica = 185;
  const yPresionSistolica = 244.4;
  if (datosFinales.signosVitales && datosFinales.signosVitales.presionArterial && datosFinales.signosVitales.presionArterial.sistolica) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.presionArterial.sistolica, xPresionSistolica, yPresionSistolica, { align: 'center' });
  }

  // PRESIÓN ARTERIAL SISTÉMICA - Diastólica
  const xPresionDiastolica = 185;
  const yPresionDiastolica = 250.3;
  if (datosFinales.signosVitales && datosFinales.signosVitales.presionArterial && datosFinales.signosVitales.presionArterial.diastolica) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.presionArterial.diastolica, xPresionDiastolica, yPresionDiastolica, { align: 'center' });
  }

  // === SECCIÓN: EVALUACIÓN FÍSICA ADICIONAL ===
  // PULMONES - Checkboxes
  const pulmonesPosiciones = [
    { tipo: "normal", x: 43.7, y: 259.5, texto: "Normal" },
    { tipo: "anormal", x: 74.2, y: 259.5, texto: "Anormal" }
  ];

  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.pulmones) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    pulmonesPosiciones.forEach(pos => {
      if (datosFinales.evaluacionFisicaAdicional.pulmones[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // PULMONES - Descripción
  const xPulmonesDescripcion = 30;
  const yPulmonesDescripcion = 264;
  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.pulmones && datosFinales.evaluacionFisicaAdicional.pulmones.descripcion) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisicaAdicional.pulmones.descripcion.toUpperCase(), xPulmonesDescripcion, yPulmonesDescripcion, { maxWidth: 160 });
  }

  // MIEMBROS SUPERIORES
  const xMiembrosSuperiores = 40;
  const yMiembrosSuperiores = 270.5;
  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.miembrosSuperiores) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisicaAdicional.miembrosSuperiores.toUpperCase(), xMiembrosSuperiores, yMiembrosSuperiores, { maxWidth: 160 });
  }

  // MIEMBROS INFERIORES
  const xMiembrosInferiores = 40;
  const yMiembrosInferiores = 280.5;
  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.miembrosInferiores) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisicaAdicional.miembrosInferiores.toUpperCase(), xMiembrosInferiores, yMiembrosInferiores, { maxWidth: 160 });
  }

  // === PÁGINA 2 ===
  doc.addPage();

  // === 0) HEADER para Página 2 ===
  headerAnexo16(doc, data, 2);

  // === 1) Imagen de fondo para Anexo16 - Página 2 ===
  const fondoImg2 = "/img/Anexo16/Anexo16_pag2.png";

  // Márgenes de 8mm a cada lado (usar la misma variable de la página 1)
  const margenLateral2 = 6; // 6mm

  // Usar el ancho del documento menos los márgenes laterales
  const imgWidth2 = pageW - (margenLateral2 * 2); // Ancho menos márgenes
  const imgHeight2 = pageH * 0.85; // 85% de la altura para dejar espacio para ajustar

  // Posicionar desde abajo hacia arriba con márgenes laterales
  const xOffset2 = margenLateral2; // Margen izquierdo
  const yOffset2 = pageH - imgHeight2 - 8; // Subido 8 puntos hacia arriba

  try {
    doc.addImage(fondoImg2, "PNG", xOffset2, yOffset2, imgWidth2, imgHeight2);
  } catch (e) {
    doc.text("Imagen de Anexo16 Página 2 no disponible", margin, yOffset2 + 10);
  }

  // === 2) CAMPOS DE DATOS PERSONALIZABLES PARA PÁGINA 2 ===
  
  // === SECCIÓN: EVALUACIÓN NEUROLÓGICA ===
  // REFLEJOS OSTEOTENDINOSOS
  const xReflejosOsteotendinosos = 55;
  const yReflejosOsteotendinosos = 42;
  if (datosFinales.evaluacionNeurologica && datosFinales.evaluacionNeurologica.reflejosOsteotendinosos) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionNeurologica.reflejosOsteotendinosos.toUpperCase(), xReflejosOsteotendinosos, yReflejosOsteotendinosos);
  }

  // MARCHA
  const xMarcha = 140;
  const yMarcha = 42;
  if (datosFinales.evaluacionNeurologica && datosFinales.evaluacionNeurologica.marcha) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionNeurologica.marcha.toUpperCase(), xMarcha, yMarcha);
  }

  // === SECCIÓN: EVALUACIÓN DE COLUMNA Y ABDOMEN ===
  // COLUMNA VERTEBRAL
  const xColumnaVertebral = 45;
  const yColumnaVertebral = 48.5;
  if (datosFinales.evaluacionColumnaAbdomen && datosFinales.evaluacionColumnaAbdomen.columnaVertebral) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionColumnaAbdomen.columnaVertebral.toUpperCase(), xColumnaVertebral, yColumnaVertebral, { maxWidth: 80 });
  }

  // ABDOMEN
  const xAbdomen = 15;
  const yAbdomen = 58;
  if (datosFinales.evaluacionColumnaAbdomen && datosFinales.evaluacionColumnaAbdomen.abdomen) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionColumnaAbdomen.abdomen.toUpperCase(), xAbdomen, yAbdomen, { maxWidth: 80 });
  }

  // ANILLOS INGUINALES
  const xAnillosInguinales = 15;
  const yAnillosInguinales = 75;
  if (datosFinales.evaluacionColumnaAbdomen && datosFinales.evaluacionColumnaAbdomen.anillosInguinales) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionColumnaAbdomen.anillosInguinales.toUpperCase(), xAnillosInguinales, yAnillosInguinales);
  }

  // ÓRGANOS GENITALES
  const xOrganosGenitales = 15;
  const yOrganosGenitales = 85;
  if (datosFinales.evaluacionColumnaAbdomen && datosFinales.evaluacionColumnaAbdomen.organosGenitales) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionColumnaAbdomen.organosGenitales.toUpperCase(), xOrganosGenitales, yOrganosGenitales, { maxWidth: 80 });
  }

   // HERNIAS
  const xHernias = 80;
  const yHernias = 75;
  if (datosFinales.evaluacionRectalHernias && datosFinales.evaluacionRectalHernias.hernias) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionRectalHernias.hernias.toUpperCase(), xHernias, yHernias);
  }

  // VÁRICES
  const xVarices = 150;
  const yVarices = 75;
  if (datosFinales.evaluacionRectalHernias && datosFinales.evaluacionRectalHernias.varices) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionRectalHernias.varices.toUpperCase(), xVarices, yVarices);
  }

  // GANGLIOS LINFÁTICOS
  const xGangliosLinfaticos = 120;
  const yGangliosLinfaticos = 85;
  if (datosFinales.evaluacionRectalHernias && datosFinales.evaluacionRectalHernias.gangliosLinfaticos) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionRectalHernias.gangliosLinfaticos.toUpperCase(), xGangliosLinfaticos, yGangliosLinfaticos);
  }

 // === SECCIÓN: EVALUACIÓN RECTAL Y HERNIAS ===
  // TACTO RECTAL - Checkboxes
  const tactoRectalPosiciones = [
    { tipo: "noSeHizo", x: 136.4, y: 60, texto: "NO SE HIZO" },
    { tipo: "anormal", x: 189, y: 60, texto: "ANORMAL" },
    { tipo: "normal", x: 136.4, y: 65.2, texto: "NORMAL" },
    { tipo: "describirEnObservacion", x: 189, y: 65.2, texto: "DESCRIBIR EN OBSERVACIÓN" }
  ];

  if (datosFinales.evaluacionRectalHernias && datosFinales.evaluacionRectalHernias.tactoRectal) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    tactoRectalPosiciones.forEach(pos => {
      if (datosFinales.evaluacionRectalHernias.tactoRectal[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  // === SECCIÓN: EVALUACIÓN MENTAL ===
  // LENGUAJE, ATENCIÓN, MEMORIA, INTELIGENCIA, ORIENTACIÓN, AFECTIVIDAD
  const xLenguajeAtencionMemoria = 15;
  const yLenguajeAtencionMemoria = 94;
  if (datosFinales.evaluacionMental && datosFinales.evaluacionMental.lenguajeAtencionMemoria) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionMental.lenguajeAtencionMemoria.toUpperCase(), xLenguajeAtencionMemoria, yLenguajeAtencionMemoria);
  }

  // ANAMNESIS
  const xAnamnesis = 27;
  const yAnamnesis = 99;
  if (datosFinales.evaluacionMental && datosFinales.evaluacionMental.anamnesis) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionMental.anamnesis.toUpperCase(), xAnamnesis, yAnamnesis, { maxWidth: 150 });
  }

  // ESTADO MENTAL
  const xEstadoMental = 35;
  const yEstadoMental = 103.1;
  if (datosFinales.evaluacionMental && datosFinales.evaluacionMental.estadoMental) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionMental.estadoMental.toUpperCase(), xEstadoMental, yEstadoMental, { maxWidth: 150 });
  }

  // === SECCIÓN: RADIOGRAFÍA DE TÓRAX ===
  // N° RX
  const xNumeroRx = 26;
  const yNumeroRx = 111;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.numeroRx) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.numeroRx, xNumeroRx, yNumeroRx);
  }

  // FECHA
  const xFechaRx = 26;
  const yFechaRx = 116;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.fecha) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.fecha, xFechaRx, yFechaRx);
  }

  // CALIDAD
  const xCalidad = 26;
  const yCalidad = 121;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.calidad) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.calidad, xCalidad, yCalidad);
  }

  // SÍMBOLOS
  const xSimbolos = 26;
  const ySimbolos = 125.5;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.simbolos) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.simbolos, xSimbolos, ySimbolos);
  }

  // VÉRTICES
  const xVertices = 95;
  const yVertices = 110;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.vertices) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.vertices.toUpperCase(), xVertices, yVertices);
  }

  // HILIOS NORMALES
  const xHilios = 95;
  const yHilios = 116;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.hilios) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.hilios.toUpperCase(), xHilios, yHilios);
  }

  // SENOS
  const xSenos = 94.5;
  const ySenos = 122;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.senos) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.senos.toUpperCase(), xSenos, ySenos);
  }

  // MEDIASTINOS
  const xMediastinos = 170;
  const yMediastinos = 115;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.mediastinos) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.mediastinos.toUpperCase(), xMediastinos, yMediastinos);
  }

  // CONCLUSIONES RADIOGRÁFICAS
  const xConclusionesRadiograficas = 85;
  const yConclusionesRadiograficas = 132;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.conclusionesRadiograficas) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.conclusionesRadiograficas.toUpperCase(), xConclusionesRadiograficas, yConclusionesRadiograficas);
  }

  // SILUETA CARDIOVASCULAR
  const xSiluetaCardiovascular = 155;
  const ySiluetaCardiovascular = 126;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.siluetaCardiovascular) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.siluetaCardiovascular.toUpperCase(), xSiluetaCardiovascular, ySiluetaCardiovascular);
  }

  // === SECCIÓN: REACCIONES SEROLÓGICAS ===
  // TITULACIÓN - Checkboxes
  const titulacionPosiciones = [
    { titulo: "0/0", x: 12, y: 138.6, marcado: true },
    { titulo: "1/0", x: 28.5, y: 138.6, marcado: true },
    { titulo: "1/1", x: 40.2, y: 138.6, marcado: true },
    { titulo: "1/2", x: 49.5, y: 138.6, marcado: true },
    { titulo: "2/1", x: 59, y: 138.6, marcado: true },
    { titulo: "2/2", x: 69, y: 138.6, marcado: true },
    { titulo: "2/3", x: 79, y: 138.6, marcado: true },
    { titulo: "3/2", x: 89, y: 138.6, marcado: true },
    { titulo: "3/3", x: 98.5, y: 138.6, marcado: true },
    { titulo: "3/+", x: 108.5, y: 138.6, marcado: true },
    { titulo: "A,B,C", x: 122, y: 138.4, marcado: true },
    { titulo: "St", x: 136, y: 138.6, marcado: true }
  ];

  if (datosFinales.reaccionesSerologicas && datosFinales.reaccionesSerologicas.titulacion) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    titulacionPosiciones.forEach(pos => {
      if (pos.marcado) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // REACCIONES SEROLÓGICAS LUES
  const xReaccionesSerologicasLues = 25;
  const yReaccionesSerologicasLues = 190;
  if (datosFinales.reaccionesSerologicas && datosFinales.reaccionesSerologicas.lues) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.reaccionesSerologicas.lues.toUpperCase(), xReaccionesSerologicasLues, yReaccionesSerologicasLues);
  }

  // === SECCIÓN: GRUPO SANGUÍNEO ===
  // GRUPO SANGUÍNEO - Checkboxes
  const grupoSanguineoPosiciones = [
    { tipo: "o", x: 25, y: 200, texto: "O" },
    { tipo: "a", x: 40, y: 200, texto: "A" },
    { tipo: "b", x: 55, y: 200, texto: "B" },
    { tipo: "ab", x: 70, y: 200, texto: "AB" }
  ];

  if (datosFinales.grupoSanguineo && datosFinales.grupoSanguineo.grupo) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    grupoSanguineoPosiciones.forEach(pos => {
      if (datosFinales.grupoSanguineo.grupo[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // FACTOR RH - Checkboxes
  const factorRhPosiciones = [
    { tipo: "negativo", x: 85, y: 200, texto: "Rh(-)" },
    { tipo: "positivo", x: 100, y: 200, texto: "Rh(+)" }
  ];

  if (datosFinales.grupoSanguineo && datosFinales.grupoSanguineo.factorRh) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    factorRhPosiciones.forEach(pos => {
      if (datosFinales.grupoSanguineo.factorRh[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: HEMOGLOBINA/HEMATOCRITO ===
  const xHemoglobinaHematocrito = 25;
  const yHemoglobinaHematocrito = 210;
  if (datosFinales.hemoglobinaHematocrito) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(255, 0, 0); // Color rojo como en la imagen
    doc.text(datosFinales.hemoglobinaHematocrito.toUpperCase(), xHemoglobinaHematocrito, yHemoglobinaHematocrito);
  }

  // === IMPRIMIR ===
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
