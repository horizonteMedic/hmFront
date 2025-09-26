import jsPDF from "jspdf";
import headerAnexo16Boroo from "./Headers/Header_Anexo16_Boroo.jsx";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";

export default function Anexo16Boroo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 0; // Sin márgenes
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // === PÁGINA 1 ===
  // === 0) HEADER ===
  headerAnexo16Boroo(doc, data, 1);

  // === 1) Imagen de fondo para Anexo16 Boroo - Página 1 ===
  const fondoImg = "/img/Anexo16/Anexo16_Boroo_Pag1.png";

  // Márgenes de 6mm a cada lado (consistente con Anexo16 normal)
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
    doc.text("Imagen de Anexo16 Boroo Página 1 no disponible", margin, yOffset + 10);
  }

  // === 2) CAMPOS DE DATOS PERSONALIZABLES PARA PÁGINA 1 ===

  // Datos de prueba para Anexo16 Boroo
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
        }
      },
      enfermedadesOculares: "NINGUNA",
      reflejosPupilares: "NORMALES, ISOCÓRICAS, FOTORREACTIVAS",
      testIshihara: "NORMAL",
      testColoresPuros: "NORMAL",
      testProfundidad: "NORMAL"
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
          frecuencia5000: "5",
          frecuencia8000: "10"
        },
        oidoIzquierdo: {
          frecuencia500: "10",
          frecuencia1000: "5",
          frecuencia2000: "10",
          frecuencia3000: "15",
          frecuencia4000: "10",
          frecuencia5000: "10",
          frecuencia8000: "5"
        }
      },
      otoscopia: {
        oidoDerecho: "NORMAL",
        oidoIzquierdo: "NORMAL"
      }
    },
    // Cardiovascular
    cardiovascular: "CONSERVADO",
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
        descripcion: "AUSCULTACIÓN PULMONAR NORMAL, SIN SIBILANCIAS NI RONCUS"
      },
      piel: {
        normal: true,
        anormal: true,
        descripcion: "PIEL NORMAL, SIN ALTERACIONES"
      },
      miembrosSuperiores: "MOVILIDAD COMPLETA, FUERZA MUSCULAR NORMAL, SIN DEFORMIDADES",
      miembrosInferiores: "MARCHA NORMAL, FUERZA MUSCULAR ADECUADA, SIN EDEMAS"
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
        normal: true
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
      vertices: "TEXTO MAS LARGO PRUEBA",
      hilios: "TEXTO MAS LARGO PRUEBA",
      senos: "TEXTO MAS LARGO PRUEBA",
      mediastinos: "NORMALES",
      conclusionesRadiograficas: "TRAMA BRONCOVASCULAR",
      siluetaCardiovascular: "NORMAL"
    },
    // Textos de Neumoconiosis
    textoNeumoconiosis1: "Texto de prueba 1 largo para ver como se ve",
    textoNeumoconiosis2: "Texto de prueba 2 largo para ver como se ve",
    textoNeumoconiosis3: "Texto de prueba 3 largo para ver como se ve",
    // Reacciones serológicas
    reaccionesSerologicas: {
      titulacion: "0/0" // Primera opción marcada
    },
    // Reacciones serológicas LUES
    reaccionesSerologicasLues: {
      positivo: true,
      negativo: true
    },
    // Grupo sanguíneo
    grupoSanguineo: {
      grupo: {
        o: true,
        a: true,
        b: true,
        ab: true
      },
      factorRh: {
        positivo: true,
        negativo: true
      }
    },
    // Hemoglobina/Hematocrito
    hemoglobinaHematocrito: "13 gr. %",
    // Otros exámenes
    otrosExamenes: "Examen de orina: NORMAL. Hemograma: NORMAL. Glicemia: 85 mg/dl.",
    // Apto para trabajar
    aptoParaTrabajar: {
      si: true,
      no: true,
    },
    // Revaluación de empresa
    revaluacionEmpresa: true,
    // Documento de identidad
    docIdentidad: "76543210",
    // Exámenes de laboratorio
    examenesLaboratorio: {
      // Hemograma Completo
      vsg: "15",
      glucosa: "85",
      urea: "25",
      creatinina: "0.9",
      // Perfil Lipídico Completo
      ldl: "110",
      hdl: "45",
      vldl: "25",
      trigliceridos: "150",
      colesterolTotal: "180",
      // Examen Completo de Orina
      cocainaOrina: "NEGATIVO",
      marihuanaOrina: "NEGATIVO",
      mercurioOrina: "NORMAL",
      plomoOrina: "NORMAL"
    },
    // Conclusiones y Recomendaciones/Restricciones (Página 2)
    conclusiones: "EVALUACIÓN CLÍNICA DENTRO DE PARÁMETROS NORMALES.",
    recomendacionesRestricciones: "MANTENER HÁBITOS SALUDABLES. CONTROL MÉDICO ANUAL.",
    // Observaciones
    observaciones: [
      "1-ELECTROCARDIOGRAMA: BRADICARDIA SINUSAL ASINTOMATICA. DESVIACION IZQUIERDA DEL EJE CARDIACO. DESVIACION DERECHA DEL EJE CARDIACO. DESVIACION IZQUIERDA DEL EJE CARDIACO. .- EVALUACION ANUAL.",
      "2-ELECTROCARDIOGRAMA PODEROSA: .- EVALUACION ANUAL. - EVALUACION EN 6 MESES.",
      "3-TRAMA BRONCOVASCULAR ACENTUADA EN ACP.",
      "4-TRAMA BRONCOVASCULAR ACENTUADA EN ACP.",
      "5- EVALUACION POR NEUMOLOGIA",
      "6-7-- USO DE LENTES CORRECTORES.",
      "8-AMETROPIA LEVE BILATERAL- DISCROMATOPSIA. - PTERIGIÓN BILATERAL.",
      "9-- DISCROMATOPSIA. - PTERIGIÓN BILATERAL.:EVALUACION POR OFTALMOLOGIA.",
      "10-ODONTOGRAMA : NO PASO EXAMEN ODONTOLOGICO",
      "AUDIOMETRIA - NORMAL - NORMAL .EVALUACION ANUAL",
      "11-ELECTROCARDIOGRAMA: BRADICARDIA SINUSAL ASINTOMATICA. DESVIACION IZQUIERDA DEL EJE CARDIACO. DESVIACION DERECHA DEL EJE CARDIACO. DESVIACION IZQUIERDA DEL EJE CARDIACO. - EVALUACION ANUAL.",
      "12-ELECTROCARDIOGRAMA PODEROSA: .- EVALUACION ANUAL. - EVALUACION EN 6 MESES.",
      "1-ELECTROCARDIOGRAMA: - EVALUACION ANUAL."
    ]
  };
  const datosReales = {
    fechaExamen: formatearFechaCorta(data.fechaAnexo7c_fecha ?? ""),
    mineralesExplotados: data.mineral_mineral_po ?? "",
    lugarFechaNacimiento: `${data.lugarNacimientoPaciente_lugar_nac_pa ?? ""}\n${formatearFechaCorta(data.fechaNacimientoPaciente_fecha_nacimiento_pa ?? "")}`,
    domicilioHabitual: data.direccionPaciente_direccion ?? "",
    tipoTrabajo: {
      superficie: data.explotacion_nom_ex === "SUPERFICIE" ?? false,
      concentrador: data.explotacion_nom_ex === "CONCENTRADOR" ?? false,
      subsuelo: data.explotacion_nom_ex === "SUBSUELO" ?? false
    },
    alturaLabor: {
      debajo2500: data.altura_altura_po === "DEBAJO 2500" ?? false,
      rango2501_4000: data.altura_altura_po === "2501 A 4000" ?? false,
      rango2501_3000: data.altura_altura_po === "2501 A 3000" ?? false,
      rango4001_4500: data.altura_altura_po === "4001 A 4500" ?? false,
      rango2001_3500: data.altura_altura_po === "2001 A 3500" ?? false,
      mas4501: data.altura_altura_po === "MAS DE 4501" ?? false
    },
    // Datos personales
    datosPersonales: {
      edad: data.edad_edad ?? "",
      sexo: {
        masculino: data.sexo_sexo_pa === "M" ?? false,
        femenino: data.sexo_sexo_pa === "F" ?? false
      },
      dni: String(data.dni_cod_pa ?? ""),
      telefono: data.celularPaciente_cel_pa ?? "",
      estadoCivil: {
        soltero: data.estadoCivilPaciente_estado_civil_pa === "SOLTERO" ?? false,
        casado: data.estadoCivilPaciente_estado_civil_pa === "CASADO" ?? false,
        conviviente: data.estadoCivilPaciente_estado_civil_pa === "CONVIVIENTE" ?? false,
        viudo: data.estadoCivilPaciente_estado_civil_pa === "VIUDO" ?? false,
        divorciado: data.estadoCivilPaciente_estado_civil_pa === "DIVORCIADO" ?? false
      },
      gradoInstruccion: {
        analfabeto: data.nivelEstudioPaciente_nivel_est_pa === "ANALFABETO" ?? false,
        primariaCompleta: data.nivelEstudioPaciente_nivel_est_pa === "PRIMARIA COMPLETA" ?? false,
        primariaIncompleta: data.nivelEstudioPaciente_nivel_est_pa === "PRIMARIA INCOMPLETA" ?? false,
        secundariaCompleta: data.nivelEstudioPaciente_nivel_est_pa === "SECUNDARIA COMPLETA" ?? false,
        secundariaIncompleta: data.nivelEstudioPaciente_nivel_est_pa === "SECUNDARIA INCOMPLETA" ?? false,
        universidad: data.nivelEstudioPaciente_nivel_est_pa === "UNIVERSITARIO" ?? false,
        tecnico: data.nivelEstudioPaciente_nivel_est_pa === "TECNICO" ?? false,
      }
    },
    // Factores de riesgo ocupacional
    factoresRiesgo: {
      // Primera columna
      ruido: data.ruidoAnexo7c_chkruido ?? false,
      polvo: data.polvoAnexo7c_chkpolvo ?? false,
      vibSegmentario: data.vidSegmentarioAnexo7c_chkvidsegmentario ?? false,
      vibTotal: data.vidTotalAnexo7c_chkvidtotal ?? false,
      // Segunda columna
      cancerigenos: data.cancerigenosAnexo7c_chkcancerigenos ?? false,
      mutagenicos: data.mutagenicosAnexo7c_chkmutagenicos ?? false,
      solventes: data.solventesAnexo7c_chksolventes ?? false,
      metales: data.metalesAnexo7c_chkmetales ?? false,
      // Tercera columna
      temperatura: data.temperaturaAnexo7c_chktemperatura ?? false,
      biologicos: data.biologicosAnexo7c_chkbiologicos ?? false,
      posturas: data.posturasAnexo7c_chkposturas ?? false,
      turnos: data.turnosAnexo7c_chkturnos ?? false,
      // Cuarta columna
      carga: data.cargasAnexo7c_chkcargas ?? false,
      movRepet: data.movRepetAnexo7c_chkmovrepet ?? false,
      pvd: data.pvdAnexo7c_chkpvd ?? false,
      otros: data.otrosAnexo7c_chkotros ?? false
    },
    // Información del puesto
    informacionPuesto: {
      puestoPostula: data.cargo_cargo_de ?? "",
      puestoActual: data.puestoActualAnexo7c_txtpuestoactual ?? "",
      tiempo: data.tiempoAnexo7c_txttiempo ?? "",
      reubicacion: {
        si: data.reubicacionSiAnexo7c_tbrsi ?? false,
        no: data.reubicacionNoAnexo7c_rbrno ?? false
      }
    },
    // Antecedentes médicos
    antecedentesMedicos: {
      personales: data.antecedentesPersonalesAnexo7c_txtantecedentespersonales ?? "",
      familiares: data.antecedentesFamiliaresAnexo7c_txtantecedentesfamiliares ?? ""
    },
    // Inmunizaciones
    inmunizaciones: {
      tetano: data.tetanoAnexo7c_tetano ?? false,
      hepatitisB: data.hepatitisBAnexo7c_hepatitisb ?? false,
      fiebreAmarilla: data.fiebreAmarillaAnexo7c_fiebreamarilla ?? false
    },
    // Número de hijos
    numeroHijos: {
      vivos: data.hijosVivosAnexo7c_txthijosvivos ?? "0",
      muertos: data.hijosMuertosAnexo7c ?? "0"
    },
    // Hábitos
    habitos: {
      tabaco: {
        nada: data.tabacoNadaAexo7c_chktnada ?? false,
        poco: data.tabacoPocoAnexo7c_chktpoco ?? false,
        habitual: data.tabacoHabitualAnexo7c_chkthabitual ?? false,
        excesivo: data.tabacoExcesivoAnexo7c_chktexcesivo ?? false
      },
      alcohol: {
        nada: data.alcoholNadaAnexo7c_chkanada ?? false,
        poco: data.alcoholPocoAnexo7c_chkapoco ?? false,
        habitual: data.alcoholHabitualAnexo7c_chkahabitual ?? false,
        excesivo: data.alcoholExcesivoAnexo7c_chkaexcesivo ?? false
      },
      drogas: {
        nada: data.drogasNadaAnexo7c_chkdnada ?? false,
        poco: data.drogasPocoAnexo7c_chkdpoco ?? false,
        habitual: data.drogasHabitualAnexo7c_chkdhabitual ?? false,
        excesivo: data.drogasExcesivoAnexo7c_chkdexcesivo ?? false
      }
    },
    // Medidas corporales
    medidasCorporales: {
      talla: data.tallaTriaje_talla ?? "",
      peso: data.pesoTriaje_peso ?? "",
      imc: data.imcTriaje_imc ?? "",
      cintura: data.cinturaTriaje_cintura ?? "",
      cadera: data.caderaTriaje_cadera ?? "",
      icc: data.iccTriaje_icc ?? ""
    },
    // Función respiratoria
    funcionRespiratoria: {
      fvc: data.fvcFuncionRespiratoria_fvc ?? "",
      fev1: data.fev1FuncionRespiratoria_fev1 ?? "",
      fev1Fvc: data.fev1FvcFuncionRespiratoria_fev1fvc ?? "",
      fef2575: data.fef2575FuncionRespiratoria_fef25_75 ?? "",
      conclusion: data.conclusionAnexo7c_txtconclusion ?? ""
    },
    // Temperatura
    temperatura: data.temperaturaTriaje_temperatura ?? "",
    // Evaluación física
    evaluacionFisica: {
      cabeza: data.cabezaAnexo7c_txtcabeza ?? "",
      perimetroCuello: data.perimetroCuelloTriaje_perimetro_cuello ?? "",
      bocaAmigdalas: data.baflAnexo7c_txtb_a_f_l ?? "",
      cuello: data.cuelloAnexo7c_txtcuello ?? "",
      nariz: data.narizAnexo7c_txtnariz ?? "",
      dentadura: {
        piezasMalEstado: String(data.piezasMalEstadoOdontograma_txtpiezasmalestado ?? ""),
        piezasFaltantes: String(data.ausentesOdontograma_txtausentes ?? ""),
      }
    },
    // Evaluación oftalmológica
    evaluacionOftalmologica: {
      vision: {
        cerca: {
          sinCorregir: {
            od: data.visionCercaSinCorregirOd_v_cerca_s_od ?? "",
            oi: data.visionCercaSinCorregirOi_v_cerca_s_oi ?? ""
          },
          corregida: {
            od: data.odcc_odcc ?? "",
            oi: data.oicc_oicc ?? ""
          }
        },
        lejos: {
          sinCorregir: {
            od: data.visionLejosSinCorregirOd_v_lejos_s_od ?? "",
            oi: data.visionLejosSinCorregirOi_v_lejos_s_oi ?? ""
          },
          corregida: {
            od: data.odlc_odlc ?? "",
            oi: data.oilc_oilc ?? ""
          }
        }
      },
      enfermedadesOculares: `${data.enfermedadesOcularesOftalmo_e_oculares ?? ""}\n${data.enfermedadesOcularesOtrosOftalmo_e_oculares1 ?? ""}`,
      reflejosPupilares: data.reflejosPupilaresAnexo7c_txtreflejospupilares ?? "",
      testIshihara: data.tecishiharaNormal_rbtecishihara_normal ? "NORMAL" : (data.tecishiharaAnormal_rbtecishihara_anormal ? "ANORMAL" : ""),
      testColoresPuros: data.teccoleresNormal_rbteccoleres_normal ? "NORMAL" : (data.teccoleresAnormal_rbteccoleres_anormal ? "ANORMAL" : ""),
      testProfundidad: data.tecestereopsiaNormal_rbtecestereopsia_normal ? "NORMAL" : (data.tecestereopsiaAnormal_rbtecestereopsia_anormal ? "ANORMAL" : "")
    },
    // Evaluación de oídos
    evaluacionOidos: {
      audiometria: {
        oidoDerecho: {
          frecuencia500: data.oidoDerecho500Audiometria_o_d_500 ?? "",
          frecuencia1000: data.oidoDerecho1000Audiometria_o_d_1000 ?? "",
          frecuencia2000: data.oidoDerecho2000Audiometria_o_d_2000 ?? "",
          frecuencia3000: data.oidoDerecho3000Audiometria_o_d_3000 ?? "",
          frecuencia4000: data.oidoDerecho4000Audiometria_o_d_4000 ?? "",
          frecuencia5000: data.oidoDerecho6000Audiometria_o_d_6000 ?? "", //revisar - no hay campo 5000 en JSON, usando 6000
          frecuencia8000: data.oidoDerecho8000Audiometria_o_d_8000 ?? ""
        },
        oidoIzquierdo: {
          frecuencia500: data.oidoIzquierdo500Audiometria_o_i_500 ?? "",
          frecuencia1000: data.oidoIzquierdo1000Audiometria_o_i_1000 ?? "",
          frecuencia2000: data.oidoIzquierdo2000Audiometria_o_i_2000 ?? "",
          frecuencia3000: data.oidoIzquierdo3000Audiometria_o_i_3000 ?? "",
          frecuencia4000: data.oidoIzquierdo4000Audiometria_o_i_4000 ?? "",
          frecuencia5000: data.oidoIzquierdo6000Audiometria_o_i_6000 ?? "", //revisar - no hay campo 5000 en JSON, usando 6000
          frecuencia8000: data.oidoIzquierdo8000Audiometria_o_i_8000 ?? ""
        }
      },
      otoscopia: {
        oidoDerecho: data.odAnexo7c_txtod ?? "",
        oidoIzquierdo: data.oiAnexo7c_txtoi ?? ""
      }
    },
    // Cardiovascular
    cardiovascular: data.corazonAnexo7c_txtcorazon ?? "",
    // Signos vitales
    signosVitales: {
      frecuenciaRespiratoria: data.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "",
      frecuenciaCardiaca: data.frecuenciaCardiacaTriaje_f_cardiaca ?? "",
      saturacionOxigeno: data.saturacionOxigenoTriaje_sat_02 ?? "",
      presionArterial: {
        sistolica: data.sistolicaTriaje_sistolica ?? "",
        diastolica: data.diastolicaTriaje_diastolica ?? ""
      }
    },
    // Evaluación física adicional
    evaluacionFisicaAdicional: {
      pulmones: {
        normal: data.pulmonesNormalAnexo7c_rbnormal ?? false,
        anormal: data.pulmonesAnormalAnexo7c_rbanormal ?? false,
        descripcion: data.pulmonesDescripcionAnexo7c_txtpulmones ?? ""
      },
      piel: {
        normal: data.pielNormalAnexo7c_rbnormal ?? false,
        anormal: data.pielAnormalAnexo7c_rbanormal ?? false,
        descripcion: data.pielDescripcionAnexo7c_txtpiel ?? ""
      },
      miembrosSuperiores: data.miembrosSuperioresAnexo7c_txtmiembrossuperiores ?? "",
      miembrosInferiores: data.miembrosInferioresAnexo7c_txtmiembrosinferiores ?? ""
    },
    // Página 2 - Evaluación neurológica y física
    evaluacionNeurologica: {
      reflejosOsteotendinosos: data.reflejosOsteotendinososAnexo7c_txtreflejososteotendinosos ?? "",
      marcha: data.marchaAnexo7c_txtmarcha ?? ""
    },
    // Evaluación de columna y abdomen
    evaluacionColumnaAbdomen: {
      columnaVertebral: data.columnaVertebralAnexo7c_txtcolumnavertebral ?? "",
      abdomen: data.abdomenAnexo7c_txtabdomen ?? "",
      anillosInguinales: data.anillosInguinalesAnexo7c_txtanillosinguinales ?? "",
      organosGenitales: data.organosGenitalesAnexo7c_txtorganosgenitales ?? ""
    },
    // Evaluación rectal y hernias
    evaluacionRectalHernias: {
      tactoRectal: {
        noSeHizo: data.tactoRectalNoHizoAnexo7c_rbtnohizo ?? false,
        anormal: data.tactoRectalAnormalAnexo7c_rbtanormal ?? false,
        normal: data.tactoRectalNormalAnexo7c_rbtnormal ?? false
      },
      hernias: data.herniasAnexo7c_txthernias ?? "",
      varices: data.varicesAnexo7c_txtvarices ?? "",
      gangliosLinfaticos: data.gangliosAnexo7c_txtganglios ?? ""
    },
    // Evaluación mental
    evaluacionMental: {
      lenguajeAtencionMemoria: data.lenguageAnexo7c_txtlenguage ?? "",
      anamnesis: data.anamnesisAnexo7c_txtanamnesis ?? "",
      estadoMental: data.estadoMentalAnexo7c_txtestadomental ?? ""
    },
    // Radiografía de tórax
    radiografiaTorax: {
      numeroRx: String(data.nrx_n_rx ?? ""),
      fecha: formatearFechaCorta(data.fechaExamenRadiografico_fecha_exra ?? ""),
      calidad: data.calidadExamenRadiografico_txtcalidad ?? "",
      simbolos: data.simbolosExamenRadiografico_txtsimbolos ?? "",
      vertices: data.verticesRadiografiaTorax_txtvertices ?? "",
      hilios: data.hilosRadiografiaTorax_txthilios ?? "",
      senos: data.senosCostoFrenicos_txtsenoscostofrenicos ?? "",
      mediastinos: data.meadiastinos_txtmediastinos ?? "",
      conclusionesRadiograficas: data.conclusionesRadiograficas_txtconclusionesradiograficas ?? "",
      siluetaCardiovascular: data.siluetaCardioVascular_txtsiluetacardiovascular ?? ""
    },
    // Textos de Neumoconiosis
    textoNeumoconiosis1: data.examenRadiograficoSinNeumoconiosis_txtsinneumoconiosis ?? "",
    textoNeumoconiosis2: data.examenRadiograficoIrep_txtirep ?? "",
    textoNeumoconiosis3: data.examenRadiograficoConNeumoconiosis_txtconneumoconiosis ?? "",
    // Reacciones serológicas
    reaccionesSerologicas: {
      titulacion: "",
      titulacion_0_0: data.examenRadiografico0_ex_0 ?? false,
      titulacion_1_0: data.examenRadiografico10_ex_10 ?? false,
      titulacion_1_1: data.examenRadiografico11_ex_11 ?? false,
      titulacion_1_2: data.examenRadiografico12_ex_12 ?? false,
      titulacion_2_1: data.examenRadiografico21_ex_21 ?? false,
      titulacion_2_2: data.examenRadiografico22_ex_22 ?? false,
      titulacion_2_3: data.examenRadiografico23_ex_23 ?? false,
      titulacion_3_2: data.examenRadiografico32_ex_32 ?? false,
      titulacion_3_3: data.examenRadiografico33_ex_33 ?? false,
      titulacion_3_plus: data.examenRadiografico3mas_ex_3mas ?? false,
      titulacion_abc: data.examenRadiograficoAbc_ex_abc ?? false,
      titulacion_st: data.examenRadiograficoSt_ex_st ?? false,
    },
    // Reacciones serológicas LUES
    reaccionesSerologicasLues: {
      positivo: data.positivoLaboratorioClinico_chkpositivo ?? false,
      negativo: data.negativoLaboratorioClinico_chknegativo ?? false
    },
    // Grupo sanguíneo
    grupoSanguineo: {
      grupo: {
        o: data.grupoSanguineoO_chko ?? false,
        a: data.grupoSanguineoA_chka ?? false,
        b: data.grupoSanguineoB_chkb ?? false,
        ab: data.grupoSanguineoAB_chkab ?? false
      },
      factorRh: {
        positivo: data.grupoSanguineoRhPositivo_rbrhpositivo ?? false,
        negativo: data.grupoSanguineoRhNegativo_rbrhnegativo ?? false
      }
    },
    // Hemoglobina/Hematocrito
    hemoglobinaHematocrito: data.hemoglobina_txthemoglobina ?? "",
    // Otros exámenes
    otrosExamenes: data.examenRadiograficoOtros_txtotrosex ?? "",
    // Apto para trabajar
    aptoParaTrabajar: {
      si: data.examenRadiograficoAptoSi_apto_si ?? false,
      no: data.examenRadiograficoAptoNo_apto_no ?? false
    },
    // Revaluación de empresa
    revaluacionEmpresa: data.examenRadiograficoAptoRe_apto_re ?? false,
    // Documento de identidad
    docIdentidad: String(data.dni_cod_pa ?? ""),
    // Exámenes de laboratorio
    examenesLaboratorio: {
      // Hemograma Completo
      vsg: data.vsgLaboratorioClinico_txtvsg ?? "",
      glucosa: data.glucosaLaboratorioClinico_txtglucosabio ?? "",
      urea: "N/A", //revisar - no hay campo específico en JSON
      creatinina: data.creatininaLaboratorioClinico_txtcreatininabio ?? "",
      // Perfil Lipídico Completo
      ldl: data.ldlcolesterolAnalisisBioquimico_txtldlcolesterol ?? "",
      hdl: data.hdlcolesterolAnalisisBioquimico_txthdlcolesterol ?? "",
      vldl: data.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol ?? "",
      trigliceridos: data.trigliceridosAnalisisBioquimico_txttrigliceridos ?? "",
      colesterolTotal: data.colesterolAnalisisBioquimico_txtcolesterol ?? "",
      // Examen Completo de Orina
      cocainaOrina: data.cocainaLaboratorioClinico_txtcocaina ?? "",
      marihuanaOrina: data.marihuanaLaboratorioClinico_txtmarihuana ?? "",
      mercurioOrina: "N/A", //revisar - no hay campo específico en JSON
      plomoOrina: "N/A" //revisar - no hay campo específico en JSON
    },
    // Conclusiones y Recomendaciones/Restricciones (Página 2)
    conclusiones: data.observacionesFichaMedicaAnexo7c_txtobservacionesfm ?? "",
    recomendacionesRestricciones: data.conclusionMedicoAnexo7c_txtconclusionmed ?? "",
    // Observaciones
    observaciones: data.observacionesFichaMedicaAnexo7c_txtobservacionesfm
      ? data.observacionesFichaMedicaAnexo7c_txtobservacionesfm.split('\n').filter(obs => obs.trim() !== '')
      : []
  };

  // Usar datos de prueba por ahora
  const datosFinales = data && data.norden_n_orden ? datosReales : datosPrueba;


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
    { tipo: "superficie", x: 128, y: 47, texto: "SUPERFICIE" },
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
  const yEdad = 74;
  if (datosFinales.datosPersonales && datosFinales.datosPersonales.edad) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    // Número de edad centrado
    doc.text(datosFinales.datosPersonales.edad, xEdad, yEdad, { align: 'center' });

    // "Años" centrado abajo
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Años", xEdad, yEdad + 3, { align: 'center' });
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
  const yPuestoPostula = 88;
  if (datosFinales.informacionPuesto && datosFinales.informacionPuesto.puestoPostula) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.informacionPuesto.puestoPostula.toUpperCase(), xPuestoPostula, yPuestoPostula);
  }

  // Puesto Actual
  const xPuestoActual = 155;
  const yPuestoActual = 93;
  if (datosFinales.informacionPuesto && datosFinales.informacionPuesto.puestoActual) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.informacionPuesto.puestoActual.toUpperCase(), xPuestoActual, yPuestoActual);
  }

  // Tiempo
  const xTiempo = 155;
  const yTiempo = 98.5;
  if (datosFinales.informacionPuesto && datosFinales.informacionPuesto.tiempo) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.informacionPuesto.tiempo.toUpperCase(), xTiempo, yTiempo);
  }

  // Reubicación - Checkboxes
  const reubicacionPosiciones = [
    { tipo: "si", x: 173, y: 104, texto: "SI" },
    { tipo: "no", x: 190, y: 104, texto: "NO" }
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
    doc.text(datosFinales.medidasCorporales.talla + " m", xTalla, yTalla);
  }

  // Peso
  const xPeso = 95;
  const yPeso = 149;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.peso) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.peso + " kg", xPeso, yPeso);
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
    doc.text(datosFinales.funcionRespiratoria.fvc + " L", xFvc, yFvc);
  }

  // FEV1
  const xFev1 = 120;
  const yFev1 = 154;
  if (datosFinales.funcionRespiratoria && datosFinales.funcionRespiratoria.fev1) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.funcionRespiratoria.fev1 + " L", xFev1, yFev1);
  }

  // FEV1/FVC
  const xFev1Fvc = 160;
  const yFev1Fvc = 148;
  if (datosFinales.funcionRespiratoria && datosFinales.funcionRespiratoria.fev1Fvc) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.funcionRespiratoria.fev1Fvc + " %", xFev1Fvc, yFev1Fvc);
  }

  // FEF 25-75%
  const xFef2575 = 160;
  const yFef2575 = 154;
  if (datosFinales.funcionRespiratoria && datosFinales.funcionRespiratoria.fef2575) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.funcionRespiratoria.fef2575 + " l/s", xFef2575, yFef2575);
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
    doc.text(datosFinales.temperatura + " °C", xTemperatura, yTemperatura);
  }

  // === SECCIÓN: CINTURA / CADERA / ICC ===
  // Cintura
  const xCintura = 185;
  const yCintura = 154;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.cintura) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.cintura + " cm", xCintura, yCintura);
  }

  // Cadera
  const xCadera = 185;
  const yCadera = 158;
  if (datosFinales.medidasCorporales && datosFinales.medidasCorporales.cadera) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.medidasCorporales.cadera + " cm", xCadera, yCadera);
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
    doc.text(datosFinales.evaluacionFisica.perimetroCuello + " cm", xPerimetroCuello, yPerimetroCuello);
  }

  // BOCA, AMÍGDALAS, FARINGE, LARINGE
  const xBocaAmigdalas = 11;
  const yBocaAmigdalas = 183;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.bocaAmigdalas) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.bocaAmigdalas.toUpperCase(), xBocaAmigdalas, yBocaAmigdalas, { maxWidth: 80 });
  }

  // CUELLO
  const xCuello = 123;
  const yCuello = 170;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.cuello) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.cuello.toUpperCase(), xCuello, yCuello, { maxWidth: 80 });
  }

  // NARÍZ
  const xNariz = 123;
  const yNariz = 175;
  if (datosFinales.evaluacionFisica && datosFinales.evaluacionFisica.nariz) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisica.nariz.toUpperCase(), xNariz, yNariz, { maxWidth: 80 });
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

  // ENFERMEDADES OCULARES
  const xEnfermedadesOculares = 110;
  const yEnfermedadesOculares = 195;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.enfermedadesOculares) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.enfermedadesOculares.toUpperCase(), xEnfermedadesOculares, yEnfermedadesOculares, { maxWidth: 100 });
  }

  // REFLEJOS PUPILARES
  const xReflejosPupilares = 135;
  const yReflejosPupilares = 210;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.reflejosPupilares) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.reflejosPupilares.toUpperCase(), xReflejosPupilares, yReflejosPupilares, { maxWidth: 100 });
  }

  // === SECCIÓN: TESTS DE VISIÓN ===
  // TEST DE ISHIHARA
  const xTestIshihara = 64;
  const yTestIshihara = 216.5;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.testIshihara) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.testIshihara.toUpperCase(), xTestIshihara, yTestIshihara);
  }

  // TEST DE COLORES PUROS
  const xTestColoresPuros = 120;
  const yTestColoresPuros = 216.5;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.testColoresPuros) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.testColoresPuros.toUpperCase(), xTestColoresPuros, yTestColoresPuros);
  }

  // TEST DE PROFUNDIDAD
  const xTestProfundidad = 178;
  const yTestProfundidad = 216.5;
  if (datosFinales.evaluacionOftalmologica && datosFinales.evaluacionOftalmologica.testProfundidad) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionOftalmologica.testProfundidad.toUpperCase(), xTestProfundidad, yTestProfundidad);
  }

  // === SECCIÓN: EVALUACIÓN DE OÍDOS ===
  // AUDIOMETRÍA - OÍDO DERECHO
  const audiometriaOidoDerecho = [
    { frecuencia: "frecuencia500", x: 28.5, y: 233, valor: "20" },
    { frecuencia: "frecuencia1000", x: 40, y: 233, valor: "15" },
    { frecuencia: "frecuencia2000", x: 52, y: 233, valor: "20" },
    { frecuencia: "frecuencia3000", x: 63, y: 233, valor: "25" },
    { frecuencia: "frecuencia4000", x: 74, y: 233, valor: "10" },
    { frecuencia: "frecuencia5000", x: 85, y: 233, valor: "5" },
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
    { frecuencia: "frecuencia5000", x: 185, y: 233, valor: "10" },
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

  // === SECCIÓN: CARDIOVASCULAR ===
  const xCardiovascular = 40;
  const yCardiovascular = 251;
  if (datosFinales.cardiovascular) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.cardiovascular.toUpperCase(), xCardiovascular, yCardiovascular, { maxWidth: 100 });
  }

  // === SECCIÓN: PULMONES ===
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

  // PIEL - Checkboxes
  const pielPosiciones = [
    { tipo: "normal", x: 144.5, y: 259.5, texto: "Normal" },
    { tipo: "anormal", x: 175.4, y: 259.5, texto: "Anormal" }
  ];

  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.piel) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    pielPosiciones.forEach(pos => {
      if (datosFinales.evaluacionFisicaAdicional.piel[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // PULMONES - Descripción
  const xPulmonesDescripcion = 30;
  const yPulmonesDescripcion = 264;
  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.pulmones && datosFinales.evaluacionFisicaAdicional.pulmones.descripcion) {
    doc.setFont("helvetica", "normal").setFontSize(6);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisicaAdicional.pulmones.descripcion.toUpperCase(), xPulmonesDescripcion, yPulmonesDescripcion, { maxWidth: 80 });
  }

  // PIEL - Descripción
  const xPielDescripcion = 132;
  const yPielDescripcion = 264;
  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.piel && datosFinales.evaluacionFisicaAdicional.piel.descripcion) {
    doc.setFont("helvetica", "normal").setFontSize(6);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisicaAdicional.piel.descripcion.toUpperCase(), xPielDescripcion, yPielDescripcion, { maxWidth: 80 });
  }

  // === SECCIÓN: MIEMBROS SUPERIORES ===
  const xMiembrosSuperiores = 40;
  const yMiembrosSuperiores = 271;
  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.miembrosSuperiores) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisicaAdicional.miembrosSuperiores.toUpperCase(), xMiembrosSuperiores, yMiembrosSuperiores, { maxWidth: 160 });
  }

  // === SECCIÓN: MIEMBROS INFERIORES ===
  const xMiembrosInferiores = 40;
  const yMiembrosInferiores = 281;
  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.miembrosInferiores) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisicaAdicional.miembrosInferiores.toUpperCase(), xMiembrosInferiores, yMiembrosInferiores, { maxWidth: 160 });
  }

  // === SECCIÓN: SIGNOS VITALES ===
  // F.Respiratoria
  const xFrecuenciaRespiratoria = 133;
  const yFrecuenciaRespiratoria = 240.5;
  if (datosFinales.signosVitales && datosFinales.signosVitales.frecuenciaRespiratoria) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.frecuenciaRespiratoria + " x min", xFrecuenciaRespiratoria, yFrecuenciaRespiratoria);
  }

  // F.Cardíaca
  const xFrecuenciaCardiaca = 133;
  const yFrecuenciaCardiaca = 244.3;
  if (datosFinales.signosVitales && datosFinales.signosVitales.frecuenciaCardiaca) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.frecuenciaCardiaca + " x min", xFrecuenciaCardiaca, yFrecuenciaCardiaca);
  }

  // Sat.02
  const xSaturacionOxigeno = 133;
  const ySaturacionOxigeno = 248;
  if (datosFinales.signosVitales && datosFinales.signosVitales.saturacionOxigeno) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.saturacionOxigeno + " %", xSaturacionOxigeno, ySaturacionOxigeno);
  }

  // PRESIÓN ARTERIAL SISTÉMICA - Sistólica
  const xPresionSistolica = 185;
  const yPresionSistolica = 244.4;
  if (datosFinales.signosVitales && datosFinales.signosVitales.presionArterial && datosFinales.signosVitales.presionArterial.sistolica) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.presionArterial.sistolica + " mmHg", xPresionSistolica, yPresionSistolica, { align: 'center' });
  }

  // PRESIÓN ARTERIAL SISTÉMICA - Diastólica
  const xPresionDiastolica = 185;
  const yPresionDiastolica = 250.3;
  if (datosFinales.signosVitales && datosFinales.signosVitales.presionArterial && datosFinales.signosVitales.presionArterial.diastolica) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.signosVitales.presionArterial.diastolica + " mmHg", xPresionDiastolica, yPresionDiastolica, { align: 'center' });
  }

  // === PÁGINA 2 ===
  doc.addPage();

  // === 0) HEADER para Página 2 ===
  headerAnexo16Boroo(doc, data, 2);

  // === 1) Imagen de fondo para Anexo16 Boroo - Página 2 ===
  const fondoImg2 = "/img/Anexo16/Anexo16_Boroo_Pag2.png";

  // Márgenes de 6mm a cada lado (usar la misma variable de la página 1)
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
    doc.text("Imagen de Anexo16 Boroo Página 2 no disponible", margin, yOffset2 + 10);
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
    { tipo: "normal", x: 136.4, y: 65.2, texto: "NORMAL" }
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
  const yAnamnesis = 98;
  if (datosFinales.evaluacionMental && datosFinales.evaluacionMental.anamnesis) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);

    // Limpiar el texto: remover saltos de línea y espacios extra
    const textoLimpio = datosFinales.evaluacionMental.anamnesis
      .replace(/\n/g, ' ') // Reemplazar saltos de línea con espacios
      .replace(/\r/g, ' ') // Reemplazar retornos de carro con espacios
      .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
      .trim(); // Remover espacios al inicio y final

    doc.text(textoLimpio.toUpperCase(), xAnamnesis, yAnamnesis, { maxWidth: 180 });
  }

  // ESTADO MENTAL
  const xEstadoMental = 35;
  const yEstadoMental = 102;
  if (datosFinales.evaluacionMental && datosFinales.evaluacionMental.estadoMental) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);

    // Limpiar el texto: remover saltos de línea y espacios extra
    const textoLimpio = datosFinales.evaluacionMental.estadoMental
      .replace(/\n/g, ' ') // Reemplazar saltos de línea con espacios
      .replace(/\r/g, ' ') // Reemplazar retornos de carro con espacios
      .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
      .trim(); // Remover espacios al inicio y final

    doc.text(textoLimpio.toUpperCase(), xEstadoMental, yEstadoMental, { maxWidth: 180 });
  }

  // === SECCIÓN: RADIOGRAFÍA DE TÓRAX ===
  // N° RX
  const xNumeroRx = 26;
  const yNumeroRx = 109;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.numeroRx) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.numeroRx, xNumeroRx, yNumeroRx);
  }

  // FECHA
  const xFechaRx = 26;
  const yFechaRx = 114;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.fecha) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.fecha, xFechaRx, yFechaRx);
  }

  // CALIDAD
  const xCalidad = 26;
  const yCalidad = 118.5;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.calidad) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.calidad, xCalidad, yCalidad);
  }

  // SÍMBOLOS
  const xSimbolos = 26;
  const ySimbolos = 123.5;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.simbolos) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.simbolos, xSimbolos, ySimbolos);
  }

  // VÉRTICES
  const xVertices = 95;
  const yVertices = 108;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.vertices) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.vertices.toUpperCase(), xVertices, yVertices, { maxWidth: 40 });
  }

  // HILIOS NORMALES
  const xHilios = 90;
  const yHilios = 116;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.hilios) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.hilios.toUpperCase(), xHilios, yHilios, { maxWidth: 40 });
  }

  // SENOS
  const xSenos = 90;
  const ySenos = 121;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.senos) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.senos.toUpperCase(), xSenos, ySenos, { maxWidth: 40 });
  }

  // MEDIASTINOS
  const xMediastinos = 170;
  const yMediastinos = 113;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.mediastinos) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.mediastinos.toUpperCase(), xMediastinos, yMediastinos, { maxWidth: 40 });
  }

  // CONCLUSIONES RADIOGRÁFICAS
  const xConclusionesRadiograficas = 84;
  const yConclusionesRadiograficas = 130;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.conclusionesRadiograficas) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.conclusionesRadiograficas.toUpperCase(), xConclusionesRadiograficas, yConclusionesRadiograficas, { maxWidth: 40 });
  }

  // SILUETA CARDIOVASCULAR
  const xSiluetaCardiovascular = 150;
  const ySiluetaCardiovascular = 123;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.siluetaCardiovascular) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.siluetaCardiovascular.toUpperCase(), xSiluetaCardiovascular, ySiluetaCardiovascular, { maxWidth: 40 });
  }

  // === SECCIÓN: TEXTOS DE NEUMOCONIOSIS ===
  // Texto Neumoconiosis 1
  const xTextoNeumoconiosis1 = 8;
  const yTextoNeumoconiosis1 = 154;
  if (datosFinales.textoNeumoconiosis1) {
    doc.setFont("helvetica", "normal").setFontSize(6.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.textoNeumoconiosis1.toUpperCase(), xTextoNeumoconiosis1, yTextoNeumoconiosis1, { maxWidth: 35 });
  }

  // Texto Neumoconiosis 2
  const xTextoNeumoconiosis2 = 44;
  const yTextoNeumoconiosis2 = 154;
  if (datosFinales.textoNeumoconiosis2) {
    doc.setFont("helvetica", "normal").setFontSize(6.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.textoNeumoconiosis2.toUpperCase(), xTextoNeumoconiosis2, yTextoNeumoconiosis2, { maxWidth: 40 });
  }

  // Texto Neumoconiosis 3
  const xTextoNeumoconiosis3 = 86;
  const yTextoNeumoconiosis3 = 154;
  if (datosFinales.textoNeumoconiosis3) {
    doc.setFont("helvetica", "normal").setFontSize(6.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.textoNeumoconiosis3.toUpperCase(), xTextoNeumoconiosis3, yTextoNeumoconiosis3, { maxWidth: 55 });
  }

  // === SECCIÓN: REACCIONES SEROLÓGICAS ===
  // TITULACIÓN - Checkboxes (Clasificación ILO)
  const titulacionPosiciones = [
    { titulo: "0/0", x: 12, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_0_0 },
    { titulo: "1/0", x: 28.5, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_1_0 },
    { titulo: "1/1", x: 40.2, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_1_1 },
    { titulo: "1/2", x: 49.5, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_1_2 },
    { titulo: "2/1", x: 59, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_2_1 },
    { titulo: "2/2", x: 69, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_2_2 },
    { titulo: "2/3", x: 79, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_2_3 },
    { titulo: "3/2", x: 89, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_3_2 },
    { titulo: "3/3", x: 98.5, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_3_3 },
    { titulo: "3/+", x: 108.5, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_3_plus },
    { titulo: "A,B,C", x: 122, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_abc },
    { titulo: "St", x: 136, y: 136.7, marcado: datosFinales.reaccionesSerologicas.titulacion_st }
  ];

  if (datosFinales.reaccionesSerologicas) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    titulacionPosiciones.forEach(pos => {
      if (pos.marcado) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: GRUPO SANGUÍNEO ===
  const grupoSanguineoPosiciones = [
    { tipo: "o", x: 21.2, y: 200.5, texto: "O" },
    { tipo: "a", x: 33.3, y: 200.5, texto: "A" },
    { tipo: "b", x: 46.4, y: 200.5, texto: "B" },
    { tipo: "ab", x: 58.2, y: 200.5, texto: "AB" }
  ];

  if (datosFinales.grupoSanguineo && datosFinales.grupoSanguineo.grupo) {
    doc.setTextColor(0, 0, 255);
    doc.setFont("helvetica", "bold").setFontSize(12);
    grupoSanguineoPosiciones.forEach(pos => {
      if (datosFinales.grupoSanguineo.grupo[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });
    doc.setTextColor(0, 0, 0);
  }

  // FACTOR RH - Checkboxes
  const factorRhPosiciones = [
    { tipo: "negativo", x: 74.5, y: 200.5, texto: "Rh(-)" },
    { tipo: "positivo", x: 92, y: 200.5, texto: "Rh(+)" }
  ];

  if (datosFinales.grupoSanguineo && datosFinales.grupoSanguineo.factorRh) {
    doc.setTextColor(0, 0, 255);
    doc.setFont("helvetica", "bold").setFontSize(12);
    factorRhPosiciones.forEach(pos => {
      if (datosFinales.grupoSanguineo.factorRh[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });
    doc.setTextColor(0, 0, 0);
  }

  // === SECCIÓN: HEMOGLOBINA/HEMATOCRITO ===
  const xHemoglobinaHematocrito = 108;
  const yHemoglobinaHematocrito = 200.5;
  if (datosFinales.hemoglobinaHematocrito) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text(datosFinales.hemoglobinaHematocrito + " gr. %", xHemoglobinaHematocrito, yHemoglobinaHematocrito);
  }

  // === SECCIÓN: APTO PARA TRABAJAR ===
  const aptoParaTrabajarPosiciones = [
    { tipo: "si", x: 23.2, y: 212, texto: "SI" },
    { tipo: "no", x: 35.4, y: 212, texto: "NO" }
  ];

  if (datosFinales.aptoParaTrabajar) {
    doc.setTextColor(0, 0, 255);
    doc.setFont("helvetica", "bold").setFontSize(12);
    aptoParaTrabajarPosiciones.forEach(pos => {
      if (datosFinales.aptoParaTrabajar[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });
    doc.setTextColor(0, 0, 0);
  }

  // === FIRMA Y SELLO MÉDICO ===
  const xFirmaMedico = 78;
  const yFirmaMedico = 206;
  const firmaMedicoWidth = 40;
  const firmaMedicoHeight = 20;

  try {
    const firmaSelloImg = data.digitalizacion?.find(
      item => item.nombreDigitalizacion === "SELLOFIRMA"
    )?.url ?? "";
    doc.addImage(firmaSelloImg, "PNG", xFirmaMedico, yFirmaMedico, firmaMedicoWidth, firmaMedicoHeight);
  } catch (e) {
    // Si no se puede cargar la imagen, mostrar texto alternativo
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Firma y Sello Médico", xFirmaMedico, yFirmaMedico + 8);
  }

  // === SECCIÓN: REVALUACIÓN DE EMPRESA ===
  const xRevaluacionEmpresa = 35.4;
  const yRevaluacionEmpresa = 219.5;
  if (datosFinales.revaluacionEmpresa) {
    doc.setTextColor(0, 0, 255);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("X", xRevaluacionEmpresa, yRevaluacionEmpresa);
    doc.setTextColor(0, 0, 0);
  }

  // === SECCIÓN: REACCIONES SEROLÓGICAS LUES ===
  const reaccionesSerologicasLuesPosiciones = [
    { tipo: "positivo", x: 166.1, y: 142, texto: "POSITIVO" },
    { tipo: "negativo", x: 193, y: 142, texto: "NEGATIVO" }
  ];

  if (datosFinales.reaccionesSerologicasLues) {
    doc.setTextColor(0, 0, 255);
    doc.setFont("helvetica", "bold").setFontSize(12);
    reaccionesSerologicasLuesPosiciones.forEach(pos => {
      if (datosFinales.reaccionesSerologicasLues[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });
    doc.setTextColor(0, 0, 0);
  }

  // === SECCIÓN: OTROS EXAMENES ===
  const xOtrosExamenes = 145.5;
  const yOtrosExamenes = 154;
  if (datosFinales.otrosExamenes) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.otrosExamenes.toUpperCase(), xOtrosExamenes, yOtrosExamenes, { maxWidth: 55 });
  }

  // === SECCIÓN: EXAMENES DE LABORATORIO ===
  // === HEMOGRAMA COMPLETO ===
  // VSG
  const xVsg = 25;
  const yVsg = 170.5;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.vsg) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.vsg.toUpperCase(), xVsg, yVsg);
  }

  // Glucosa
  const xGlucosa = 25;
  const yGlucosa = 175;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.glucosa) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.glucosa.toUpperCase(), xGlucosa, yGlucosa);
  }

  // Úrea
  const xUrea = 25;
  const yUrea = 179;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.urea) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.urea.toUpperCase(), xUrea, yUrea);
  }

  // Creatinina
  const xCreatinina = 25;
  const yCreatinina = 183.1;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.creatinina) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.creatinina.toUpperCase(), xCreatinina, yCreatinina);
  }

  // === PERFIL LIPÍDICO COMPLETO ===
  // L.D.L
  const xLdl = 75;
  const yLdl = 170.5;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.ldl) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.ldl.toUpperCase(), xLdl, yLdl);
  }

  // H.D.L
  const xHdl = 75;
  const yHdl = 175;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.hdl) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.hdl.toUpperCase(), xHdl, yHdl);
  }

  // V.L.D.L
  const xVldl = 75;
  const yVldl = 179;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.vldl) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.vldl.toUpperCase(), xVldl, yVldl);
  }

  // Triglicéridos
  const xTrigliceridos = 75;
  const yTrigliceridos = 183.1;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.trigliceridos) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.trigliceridos.toUpperCase(), xTrigliceridos, yTrigliceridos);
  }

  // Colesterol Total
  const xColesterolTotal = 75;
  const yColesterolTotal = 187;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.colesterolTotal) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.colesterolTotal.toUpperCase(), xColesterolTotal, yColesterolTotal);
  }

  // === EXAMEN COMPLETO DE ORINA ===
  // Cocaína en Orina
  const xCocainaOrina = 127;
  const yCocainaOrina = 170.5;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.cocainaOrina) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.cocainaOrina.toUpperCase(), xCocainaOrina, yCocainaOrina);
  }

  // Marihuana en Orina
  const xMarihuanaOrina = 127;
  const yMarihuanaOrina = 175;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.marihuanaOrina) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.marihuanaOrina.toUpperCase(), xMarihuanaOrina, yMarihuanaOrina);
  }

  // Mercurio en Orina
  const xMercurioOrina = 127;
  const yMercurioOrina = 179;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.mercurioOrina) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.mercurioOrina.toUpperCase(), xMercurioOrina, yMercurioOrina);
  }

  // Plomo en Orina
  const xPlomoOrina = 127;
  const yPlomoOrina = 183.1;
  if (datosFinales.examenesLaboratorio && datosFinales.examenesLaboratorio.plomoOrina) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.examenesLaboratorio.plomoOrina.toUpperCase(), xPlomoOrina, yPlomoOrina);
  }

  // === SECCIÓN: OBSERVACIONES ===
  const xObservaciones = 10;
  let yPosicionActual = 231; // Variable para rastrear la posición actual
  const espacioEntreObservaciones = 0.5; // Espacio entre observaciones (muy reducido)
  const lineHeight = 2.5; // Altura entre líneas de texto dividido (más compacto)
  const maxWidth = 100; // Ancho máximo

  if (datosFinales.observaciones && Array.isArray(datosFinales.observaciones)) {
    doc.setFont("helvetica", "normal").setFontSize(5.5);
    doc.setTextColor(0, 0, 0);

    datosFinales.observaciones.forEach((observacion) => {
      // Dividir texto largo en múltiples líneas si es necesario
      const lines = doc.splitTextToSize(observacion.toUpperCase(), maxWidth);

      // Dibujar cada línea de la observación actual
      lines.forEach((line, lineIndex) => {
        const yLinePosition = yPosicionActual + (lineIndex * lineHeight);
        doc.text(line, xObservaciones, yLinePosition);
      });

      // Calcular la nueva posición para la siguiente observación
      // Sumar el número de líneas de esta observación + espacio entre observaciones
      yPosicionActual += (lines.length * lineHeight) + espacioEntreObservaciones;
    });
  }

  // Columna derecha: RECOMENDACIONES / RESTRICCIONES
  const xRecomendaciones2 = 120;
  const yRecomendaciones2 = 235;
  if (datosFinales.recomendacionesRestricciones) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(
      datosFinales.recomendacionesRestricciones.toUpperCase(),
      xRecomendaciones2,
      yRecomendaciones2,
      { maxWidth: 80 }
    );
  }

  // === SECCIÓN: DOCUMENTO DE IDENTIDAD Y FIRMA ===
  // Solo el DNI (sin etiqueta "Doc. de Identidad:")
  const xDocIdentidad = 170;
  const yDocIdentidad = 217;
  if (datosFinales.docIdentidad) {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.docIdentidad.toUpperCase(), xDocIdentidad, yDocIdentidad);
  }

  // Firma del paciente (imagen)
  const xFirmaPaciente = 150 - 5;
  const yFirmaPaciente = 195;
  const firmaWidth = 40;
  const firmaHeight = 18;

  try {
    const firmaExaminadoImg = data.digitalizacion?.find(
      item => item.nombreDigitalizacion === "FIRMAP"
    )?.url ?? "";
    doc.addImage(firmaExaminadoImg, "PNG", xFirmaPaciente, yFirmaPaciente, firmaWidth, firmaHeight);
  } catch (e) {
    // Si no se puede cargar la imagen, mostrar texto alternativo
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Firma del Paciente", xFirmaPaciente, yFirmaPaciente + 8);
  }
  const xHuellaDigital = 195 - 8;
  const yHuellaDigital = 185;
  try {
    const huellaDigitalImg = data.digitalizacion?.find(
      item => item.nombreDigitalizacion === "HUELLA"
    )?.url ?? "";
    doc.addImage(huellaDigitalImg, "PNG", xHuellaDigital, yHuellaDigital, 18, 25);
  } catch (e) {
    doc.text("Huella Digital", xHuellaDigital, yHuellaDigital + 10);
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
