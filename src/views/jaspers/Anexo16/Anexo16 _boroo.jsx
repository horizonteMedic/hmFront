import jsPDF from "jspdf";
import headerAnexo16Boroo from "./Headers/Header_Anexo16_Boroo.jsx";

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
      vertices: "LIBRES",
      hilios: "NORMALES",
      senos: "LIBRES",
      mediastinos: "NORMALES",
      conclusionesRadiograficas: "TRAMA BRONCOVASCULAR",
      siluetaCardiovascular: "NORMAL"
    },
    // Reacciones serológicas
    reaccionesSerologicas: {
      titulacion: "0/0" // Primera opción marcada
    },
    // Reacciones serológicas LUES
    reaccionesSerologicasLues: {
      positivo: true,
      negativo: false
    },
    // Otros exámenes
    otrosExamenes: "Examen de orina: NORMAL. Hemograma: NORMAL. Glicemia: 85 mg/dl.",
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
    }
  };
  const datosReales = {
    fechaExamen: res.fechaAnexo7c_fecha ?? "",
    mineralesExplotados: res.mineral_mineral_po ?? "",
    lugarFechaNacimiento: res.lugarNacimientoPaciente_lugar_nac_pa ?? "",
    domicilioHabitual: res.direccionPaciente_direccion ?? "",
    tipoTrabajo: {
      superficie: res.explotacion_nom_ex === "SUPERFICIE" ?? false,
      concentrador: res.explotacion_nom_ex === "CONCENTRADOR" ?? false,
      subsuelo: res.explotacion_nom_ex === "SUBSUELO" ?? false
    },
    alturaLabor: {
      debajo2500: res.altura_altura_po === "DEBAJO 2500" ?? false,
      rango2501_4000: res.altura_altura_po === "2501 A 4000" ?? false,
      rango2501_3000: res.altura_altura_po === "2501 A 3000" ?? false,
      rango4001_4500: res.altura_altura_po === "4001 A 4500" ?? false,
      rango2001_3500: res.altura_altura_po === "2001 A 3500" ?? false,
      mas4501: res.altura_altura_po === "MAS DE 4501" ?? false
    },
    // Datos personales
    datosPersonales: {
      edad: res.edad_edad ?? "",
      sexo: {
        masculino: res.sexo_sexo_pa === "M" ?? false,
        femenino: res.sexo_sexo_pa === "F" ?? false
      },
      dni: res.dni_cod_pa ?? "",
      telefono: res.celularPaciente_cel_pa ?? "",
      estadoCivil: {
        soltero: res.estadoCivilPaciente_estado_civil_pa === "SOLTERO" ?? false,
        casado: res.estadoCivilPaciente_estado_civil_pa === "CASADO" ?? false,
        conviviente: res.estadoCivilPaciente_estado_civil_pa === "CONVIVIENTE" ?? false,
        viudo: res.estadoCivilPaciente_estado_civil_pa === "VIUDO" ?? false,
        divorciado: res.estadoCivilPaciente_estado_civil_pa === "DIVORCIADO" ?? false
      },
      gradoInstruccion: {
        analfabeto: res.nivelEstudioPaciente_nivel_est_pa === "ANALFABETO" ?? false,
        primariaCompleta: res.nivelEstudioPaciente_nivel_est_pa === "PRIMARIA COMPLETA" ?? false,
        primariaIncompleta: res.nivelEstudioPaciente_nivel_est_pa === "PRIMARIA INCOMPLETA" ?? false,
        secundariaCompleta: res.nivelEstudioPaciente_nivel_est_pa === "SECUNDARIA COMPLETA" ?? false,
        secundariaIncompleta: res.nivelEstudioPaciente_nivel_est_pa === "SECUNDARIA INCOMPLETA" ?? false,
        universidad: res.nivelEstudioPaciente_nivel_est_pa === "UNIVERSIDAD" ?? false,
        tecnico: res.nivelEstudioPaciente_nivel_est_pa === "TECNICO" ?? false
      }
    },
    // Factores de riesgo ocupacional
    factoresRiesgo: {
      // Primera columna
      ruido: res.ruidoAnexo7c_chkruido ?? false,
      polvo: res.polvoAnexo7c_chkpolvo ?? false,
      vibSegmentario: res.vidSegmentarioAnexo7c_chkvidsegmentario ?? false,
      vibTotal: res.vidTotalAnexo7c_chkvidtotal ?? false,
      // Segunda columna
      cancerigenos: res.cancerigenosAnexo7c_chkcancerigenos ?? false,
      mutagenicos: res.mutagenicosAnexo7c_chkmutagenicos ?? false,
      solventes: res.solventesAnexo7c_chksolventes ?? false,
      metales: res.metalesAnexo7c_chkmetales ?? false,
      // Tercera columna
      temperatura: res.temperaturaAnexo7c_chktemperatura ?? false,
      biologicos: res.biologicosAnexo7c_chkbiologicos ?? false,
      posturas: res.posturasAnexo7c_chkposturas ?? false,
      turnos: res.turnosAnexo7c_chkturnos ?? false,
      // Cuarta columna
      carga: res.cargasAnexo7c_chkcargas ?? false,
      movRepet: res.movRepetAnexo7c_chkmovrepet ?? false,
      pvd: res.pvdAnexo7c_chkpvd ?? false,
      otros: res.otrosAnexo7c_chkotros ?? false
    },
    // Información del puesto
    informacionPuesto: {
      puestoPostula: res.cargo_cargo_de ?? "",
      puestoActual: res.puestoActualAnexo7c_txtpuestoactual ?? "",
      tiempo: res.tiempoAnexo7c_txttiempo ?? "",
      reubicacion: {
        si: res.reubicacionSiAnexo7c_tbrsi ?? false,
        no: res.reubicacionNoAnexo7c_rbrno ?? false
      }
    },
    // Antecedentes médicos
    antecedentesMedicos: {
      personales: res.antecedentesPersonalesAnexo7c_txtantecedentespersonales ?? "",
      familiares: res.antecedentesFamiliaresAnexo7c_txtantecedentesfamiliares ?? ""
    },
    // Inmunizaciones
    inmunizaciones: {
      tetano: res.tetanoAnexo7c_tetano ?? false,
      hepatitisB: res.hepatitisBAnexo7c_hepatitisb ?? false,
      fiebreAmarilla: res.fiebreAmarillaAnexo7c_fiebreamarilla ?? false
    },
    // Número de hijos
    numeroHijos: {
      vivos: res.hijosVivosAnexo7c_txthijosvivos ?? "0",
      muertos: res.hijosMuertosAnexo7c ?? "0"
    },
    // Hábitos
    habitos: {
      tabaco: {
        nada: res.tabacoNadaAexo7c_chktnada ?? false,
        poco: res.tabacoPocoAnexo7c_chktpoco ?? false,
        habitual: res.tabacoHabitualAnexo7c_chkthabitual ?? false,
        excesivo: res.tabacoExcesivoAnexo7c_chktexcesivo ?? false
      },
      alcohol: {
        nada: res.alcoholNadaAnexo7c_chkanada ?? false,
        poco: res.alcoholPocoAnexo7c_chkapoco ?? false,
        habitual: res.alcoholHabitualAnexo7c_chkahabitual ?? false,
        excesivo: res.alcoholExcesivoAnexo7c_chkaexcesivo ?? false
      },
      drogas: {
        nada: res.drogasNadaAnexo7c_chkdnada ?? false,
        poco: res.drogasPocoAnexo7c_chkdpoco ?? false,
        habitual: res.drogasHabitualAnexo7c_chkdhabitual ?? false,
        excesivo: res.drogasExcesivoAnexo7c_chkdexcesivo ?? false
      }
    },
    // Medidas corporales
    medidasCorporales: {
      talla: res.tallaTriaje_talla ?? "",
      peso: res.pesoTriaje_peso ?? "",
      imc: res.imcTriaje_imc ?? "",
      cintura: res.cinturaTriaje_cintura ?? "",
      cadera: res.caderaTriaje_cadera ?? "",
      icc: res.iccTriaje_icc ?? ""
    },
    // Función respiratoria
    funcionRespiratoria: {
      fvc: res.fvcFuncionRespiratoria_fvc ?? "",
      fev1: res.fev1FuncionRespiratoria_fev1 ?? "",
      fev1Fvc: res.fev1FvcFuncionRespiratoria_fev1fvc ?? "",
      fef2575: res.fef2575FuncionRespiratoria_fef25_75 ?? "",
      conclusion: res.conclusionAnexo7c_txtconclusion ?? ""
    },
    // Temperatura
    temperatura: res.temperaturaTriaje_temperatura ?? "",
    // Evaluación física
    evaluacionFisica: {
      cabeza: res.cabezaAnexo7c_txtcabeza ?? "",
      perimetroCuello: res.perimetroCuelloTriaje_perimetro_cuello ?? "",
      bocaAmigdalas: res.baflAnexo7c_txtb_a_f_l ?? "",
      cuello: res.cuelloAnexo7c_txtcuello ?? "",
      nariz: res.narizAnexo7c_txtnariz ?? "",
      dentadura: {
        piezasMalEstado: res.piezasMalEstadoOdontograma_txtpiezasmalestado ?? "",
        piezasFaltantes: res.ausentesOdontograma_txtausentes ?? ""
      }
    },
    // Evaluación oftalmológica
    evaluacionOftalmologica: {
      vision: {
        cerca: {
          sinCorregir: {
            od: res.visionCercaSinCorregirOd_v_cerca_s_od ?? "",
            oi: res.visionCercaSinCorregirOi_v_cerca_s_oi ?? ""
          },
          corregida: {
            od: res.odcc_odcc ?? "",
            oi: res.oicc_oicc ?? ""
          }
        },
        lejos: {
          sinCorregir: {
            od: res.visionLejosSinCorregirOd_v_lejos_s_od ?? "",
            oi: res.visionLejosSinCorregirOi_v_lejos_s_oi ?? ""
          },
          corregida: {
            od: res.odlc_odlc ?? "",
            oi: res.oilc_oilc ?? ""
          }
        }
      },
      enfermedadesOculares: res.enfermedadesOcularesAnexo7c_txtenfermedadesoculares ?? "",
      reflejosPupilares: res.reflejosPupilaresAnexo7c_txtreflejospupilares ?? "",
      testIshihara: res.tecishiharaNormal_rbtecishihara_normal ? "NORMAL" : (res.tecishiharaAnormal_rbtecishihara_anormal ? "ANORMAL" : ""), //revisar - mapeo de test
      testColoresPuros: res.teccoleresNormal_rbteccoleres_normal ? "NORMAL" : (res.teccoleresAnormal_rbteccoleres_anormal ? "ANORMAL" : ""), //revisar - mapeo de test
      testProfundidad: res.tecestereopsiaNormal_rbtecestereopsia_normal ? "NORMAL" : (res.tecestereopsiaAnormal_rbtecestereopsia_anormal ? "ANORMAL" : "") //revisar - mapeo de test
    },
    // Evaluación de oídos
    evaluacionOidos: {
      audiometria: {
        oidoDerecho: {
          frecuencia500: res.oidoDerecho500Audiometria_o_d_500 ?? "",
          frecuencia1000: res.oidoDerecho1000Audiometria_o_d_1000 ?? "",
          frecuencia2000: res.oidoDerecho2000Audiometria_o_d_2000 ?? "",
          frecuencia3000: res.oidoDerecho3000Audiometria_o_d_3000 ?? "",
          frecuencia4000: res.oidoDerecho4000Audiometria_o_d_4000 ?? "",
          frecuencia5000: res.oidoDerecho6000Audiometria_o_d_6000 ?? "", //revisar - no hay campo 5000 en JSON, usando 6000
          frecuencia8000: res.oidoDerecho8000Audiometria_o_d_8000 ?? ""
        },
        oidoIzquierdo: {
          frecuencia500: res.oidoIzquierdo500Audiometria_o_i_500 ?? "",
          frecuencia1000: res.oidoIzquierdo1000Audiometria_o_i_1000 ?? "",
          frecuencia2000: res.oidoIzquierdo2000Audiometria_o_i_2000 ?? "",
          frecuencia3000: res.oidoIzquierdo3000Audiometria_o_i_3000 ?? "",
          frecuencia4000: res.oidoIzquierdo4000Audiometria_o_i_4000 ?? "",
          frecuencia5000: res.oidoIzquierdo6000Audiometria_o_i_6000 ?? "", //revisar - no hay campo 5000 en JSON, usando 6000
          frecuencia8000: res.oidoIzquierdo8000Audiometria_o_i_8000 ?? ""
        }
      },
      otoscopia: {
        oidoDerecho: res.odAnexo7c_txtod ?? "",
        oidoIzquierdo: res.oiAnexo7c_txtoi ?? ""
      }
    },
    // Cardiovascular
    cardiovascular: res.toraxAnexo7c_txttorax ?? "", //revisar - usando campo tórax como cardiovascular
    // Signos vitales
    signosVitales: {
      frecuenciaRespiratoria: res.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "",
      frecuenciaCardiaca: res.frecuenciaCardiacaTriaje_f_cardiaca ?? "",
      saturacionOxigeno: res.saturacionOxigenoTriaje_sat_02 ?? "",
      presionArterial: {
        sistolica: res.sistolicaTriaje_sistolica ?? "",
        diastolica: res.diastolicaTriaje_diastolica ?? ""
      }
    },
    // Evaluación física adicional
    evaluacionFisicaAdicional: {
      pulmones: {
        normal: res.pulmonesNormalAnexo7c_rbnormal ?? false,
        anormal: res.pulmonesAnormalAnexo7c_rbanormal ?? false,
        descripcion: res.pulmonesDescripcionAnexo7c_txtpulmones ?? ""
      },
      miembrosSuperiores: res.miembrosSuperioresAnexo7c_txtmiembrossuperiores ?? "",
      miembrosInferiores: res.miembrosInferioresAnexo7c_txtmiembrosinferiores ?? ""
    },
    // Página 2 - Evaluación neurológica y física
    evaluacionNeurologica: {
      reflejosOsteotendinosos: res.reflejosOsteotendinososAnexo7c_txtreflejososteotendinosos ?? "",
      marcha: res.marchaAnexo7c_txtmarcha ?? ""
    },
    // Evaluación de columna y abdomen
    evaluacionColumnaAbdomen: {
      columnaVertebral: res.columnaVertebralAnexo7c_txtcolumnavertebral ?? "",
      abdomen: res.abdomenAnexo7c_txtabdomen ?? "",
      anillosInguinales: res.anillosInguinalesAnexo7c_txtanillosinguinales ?? "",
      organosGenitales: res.organosGenitalesAnexo7c_txtorganosgenitales ?? ""
    },
    // Evaluación rectal y hernias
    evaluacionRectalHernias: {
      tactoRectal: {
        noSeHizo: res.tactoRectalNoHizoAnexo7c_rbtnohizo ?? false,
        anormal: res.tactoRectalAnormalAnexo7c_rbtanormal ?? false,
        normal: res.tactoRectalNormalAnexo7c_rbtnormal ?? false
      },
      hernias: res.herniasAnexo7c_txthernias ?? "",
      varices: res.varicesAnexo7c_txtvarices ?? "",
      gangliosLinfaticos: res.gangliosAnexo7c_txtganglios ?? ""
    },
    // Evaluación mental
    evaluacionMental: {
      lenguajeAtencionMemoria: res.lenguageAnexo7c_txtlenguage ?? "",
      anamnesis: res.anamnesisAnexo7c_txtanamnesis ?? "",
      estadoMental: res.estadoMentalAnexo7c_txtestadomental ?? ""
    },
    // Radiografía de tórax
    radiografiaTorax: {
      numeroRx: res.nrx_n_rx ?? "",
      fecha: res.fechaExamenRadiografico_fecha_exra ?? "",
      calidad: res.calidadExamenRadiografico_txtcalidad ?? "",
      simbolos: res.simbolosExamenRadiografico_txtsimbolos ?? "",
      vertices: res.verticesRadiografiaTorax_txtvertices ?? "",
      hilios: res.hilosRadiografiaTorax_txthilios ?? "",
      senos: res.senosCostoFrenicos_txtsenoscostofrenicos ?? "",
      mediastinos: res.meadiastinos_txtmediastinos ?? "",
      conclusionesRadiograficas: res.conclusionesRadiograficas_txtconclusionesradiograficas ?? "",
      siluetaCardiovascular: res.siluetaCardioVascular_txtsiluetacardiovascular ?? ""
    },
    // Reacciones serológicas
    reaccionesSerologicas: {
      titulacion: "", //revisar - no hay campo específico en JSON para titulación
    },
    // Reacciones serológicas LUES
    reaccionesSerologicasLues: {
      positivo: res.positivoLaboratorioClinico_chkpositivo ?? false,
      negativo: res.negativoLaboratorioClinico_chknegativo ?? false
    },
    // Otros exámenes
    otrosExamenes: res.examenRadiograficoOtros_txtotrosex ?? "",
    // Documento de identidad
    docIdentidad: res.dni_cod_pa ?? "", //revisar - usando mismo campo que dni
    // Exámenes de laboratorio
    examenesLaboratorio: {
      // Hemograma Completo
      vsg: res.vsgLaboratorioClinico_txtvsg ?? "",
      glucosa: res.glucosaLaboratorioClinico_txtglucosabio ?? "",
      urea: "", //revisar - no hay campo específico en JSON
      creatinina: res.creatininaLaboratorioClinico_txtcreatininabio ?? "",
      // Perfil Lipídico Completo
      ldl: res.ldlcolesterolAnalisisBioquimico_txtldlcolesterol ?? "",
      hdl: res.hdlcolesterolAnalisisBioquimico_txthdlcolesterol ?? "",
      vldl: res.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol ?? "",
      trigliceridos: res.trigliceridosAnalisisBioquimico_txttrigliceridos ?? "",
      colesterolTotal: res.colesterolAnalisisBioquimico_txtcolesterol ?? "",
      // Examen Completo de Orina
      cocainaOrina: res.cocainaLaboratorioClinico_txtcocaina ?? "",
      marihuanaOrina: res.marihuanaLaboratorioClinico_txtmarihuana ?? "",
      mercurioOrina: "", //revisar - no hay campo específico en JSON
      plomoOrina: "" //revisar - no hay campo específico en JSON
    }
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
    doc.setFont("helvetica", "normal").setFontSize(7.5);
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

  // PULMONES - Descripción
  const xPulmonesDescripcion = 30;
  const yPulmonesDescripcion = 264;
  if (datosFinales.evaluacionFisicaAdicional && datosFinales.evaluacionFisicaAdicional.pulmones && datosFinales.evaluacionFisicaAdicional.pulmones.descripcion) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionFisicaAdicional.pulmones.descripcion.toUpperCase(), xPulmonesDescripcion, yPulmonesDescripcion, { maxWidth: 160 });
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
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionMental.anamnesis.toUpperCase(), xAnamnesis, yAnamnesis, { maxWidth: 150 });
  }

  // ESTADO MENTAL
  const xEstadoMental = 35;
  const yEstadoMental = 102;
  if (datosFinales.evaluacionMental && datosFinales.evaluacionMental.estadoMental) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.evaluacionMental.estadoMental.toUpperCase(), xEstadoMental, yEstadoMental, { maxWidth: 150 });
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
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.simbolos, xSimbolos, ySimbolos);
  }

  // VÉRTICES
  const xVertices = 95;
  const yVertices = 108;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.vertices) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.vertices.toUpperCase(), xVertices, yVertices);
  }

  // HILIOS NORMALES
  const xHilios = 95;
  const yHilios = 117.2;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.hilios) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.hilios.toUpperCase(), xHilios, yHilios);
  }

  // SENOS
  const xSenos = 94.5;
  const ySenos = 121.7;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.senos) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.senos.toUpperCase(), xSenos, ySenos);
  }

  // MEDIASTINOS
  const xMediastinos = 170;
  const yMediastinos = 113;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.mediastinos) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.mediastinos.toUpperCase(), xMediastinos, yMediastinos);
  }

  // CONCLUSIONES RADIOGRÁFICAS
  const xConclusionesRadiograficas = 84;
  const yConclusionesRadiograficas = 130;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.conclusionesRadiograficas) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.conclusionesRadiograficas.toUpperCase(), xConclusionesRadiograficas, yConclusionesRadiograficas);
  }

  // SILUETA CARDIOVASCULAR
  const xSiluetaCardiovascular = 150;
  const ySiluetaCardiovascular = 123;
  if (datosFinales.radiografiaTorax && datosFinales.radiografiaTorax.siluetaCardiovascular) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.radiografiaTorax.siluetaCardiovascular.toUpperCase(), xSiluetaCardiovascular, ySiluetaCardiovascular);
  }

  // === SECCIÓN: REACCIONES SEROLÓGICAS ===
  // TITULACIÓN - Checkboxes (Clasificación ILO)
  const titulacionPosiciones = [
    { titulo: "0/0", x: 12, y: 136.7, marcado: true },
    { titulo: "1/0", x: 28.5, y: 136.7, marcado: true },
    { titulo: "1/1", x: 40.2, y: 136.7, marcado: true },
    { titulo: "1/2", x: 49.5, y: 136.7, marcado: true },
    { titulo: "2/1", x: 59, y: 136.7, marcado: true },
    { titulo: "2/2", x: 69, y: 136.7, marcado: true },
    { titulo: "2/3", x: 79, y: 136.7, marcado: true },
    { titulo: "3/2", x: 89, y: 136.7, marcado: true },
    { titulo: "3/3", x: 98.5, y: 136.7, marcado: true },
    { titulo: "3/+", x: 108.5, y: 136.7, marcado: true },
    { titulo: "A,B,C", x: 122, y: 136.7, marcado: true },
    { titulo: "St", x: 136, y: 136.7, marcado: true }
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

  // === SECCIÓN: REACCIONES SEROLÓGICAS LUES ===
  const reaccionesSerologicasLuesPosiciones = [
    { tipo: "positivo", x: 166.1, y: 142, texto: "POSITIVO" },
    { tipo: "negativo", x: 193, y: 142, texto: "NEGATIVO" }
  ];

  if (datosFinales.reaccionesSerologicasLues) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    reaccionesSerologicasLuesPosiciones.forEach(pos => {
      if (datosFinales.reaccionesSerologicasLues[pos.tipo]) {
        doc.text("X", pos.x, pos.y);
      }
    });

    doc.setTextColor(0, 0, 0); // Resetear a negro
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
  const xFirmaPaciente = 150;
  const yFirmaPaciente = 195;
  const firmaWidth = 40;
  const firmaHeight = 18;

  try {
    doc.addImage("/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png", "PNG", xFirmaPaciente, yFirmaPaciente, firmaWidth, firmaHeight);
  } catch (e) {
    // Si no se puede cargar la imagen, mostrar texto alternativo
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Firma del Paciente", xFirmaPaciente, yFirmaPaciente + 8);
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
