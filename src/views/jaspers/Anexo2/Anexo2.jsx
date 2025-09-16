import jsPDF from "jspdf";
import headerAnexo2 from "./Headers/Header_Anexo2.jsx";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";

export default function Anexo2(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 0; // Sin márgenes
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  
  // Extraer accidentes directamente del JSON
  const accidentes = data.accidentes || [];

  // Datos de prueba para los campos de Anexo2
  const datosPrueba = {
    // === INFORMACIÓN GENERAL ===
    numeroOrden: "96639",
    tipoEvaluacion: {
      preOcupacional: true,
      anual: true,
      retiro: true,
      otros: true
    },
    fechaExamen: "05/08/2025",
    lugarExamen: {
      departamento: "La Libertad",
      provincia: "Trujillo",
      distrito: "Trujillo"
    },

    // === DATOS DE LA EMPRESA ===
    datosEmpresa: {
      contrata: "MINERA FALCON S.A.C.",
      empresa: "CIA MINERA PODEROSA S A",
      actividadEconomica: "Explotación de minerales",
      lugarTrabajo: "Interior mina"
    },

    // === UBICACIÓN Y PUESTO ===
    ubicacion: {
      departamento: "La Libertad",
      provincia: "Trujillo",
      distrito: "Trujillo"
    },
    puestoPostula: "Operador de maquinaria pesada",

    // === II. FILIACIÓN DEL TRABAJADOR ===
    filiacionTrabajador: {
      nombresApellidos: "Juan Carlos Pérez García",
      fechaNacimiento: "15/03/1985",
      edad: "39",
      domicilioFiscal: "Av. Principal 123, Urbanización Los Olivos",
      dni: "12345678",
      ubicacion: {
        departamento: "La Libertad",
        provincia: "Trujillo",
        distrito: "Trujillo"
      },
      residenciaLugarTrabajo: {
        si: true,
        no: true
      },
      tiempoResidencia: "5 años",
      seguros: {
        essalud: true,
        eps: true,
        otro1: true,
        sctr: true,
        otro2: true
      },
      contacto: {
        correoElectronico: "juan.perez@email.com",
        telefono: "987654321",
        gradoInstruccion: "Técnico Superior"
      },
      estadoCivil: "Casado",
      totalHijos: "2",
      dependientes: "3"
    },

    // === III. ANTECEDENTES PATOLÓGICOS PERSONALES ===
    antecedentesPatologicos: {
      // Condiciones médicas - Columna 1 (Izquierda)
      alergias: { si: true, no: true },
      asma: { si: true, no: true },
      bronquitis: { si: true, no: true },
      quemaduras: { si: true, no: true },
      cirugias: { si: true, no: true },

      // Condiciones médicas - Columna 2 (Centro)
      tbc: { si: true, no: true },
      its: { si: true, no: true },
      convulsiones: { si: true, no: true },
      neoplasia: { si: true, no: true },
      intoxicaciones: { si: true, no: true },

      // Condiciones médicas - Columna 3 (Derecha)
      hepatitis: { si: true, no: true },
      tifoidea: { si: true, no: true },
      hta: { si: true, no: true },
      diabetes: { si: true, no: true },
      otros: { si: true, no: true },

      // Hábitos Nocivos
      habitosNocivos: {
        alcohol: { si: true, no: true, tipo: "Ocasional", cantidad: "2-3 veces por mes" },
        tabaco: { si: true, no: true, tipo: "Texto muestra", cantidad: "Cantidad de muestra" },
        drogas: { si: true, no: true, tipo: "Texto muestra", cantidad: "Cantidad de muestra" },
        medicamento: { si: true, no: true, tipo: "Antihipertensivos", cantidad: "Diario" }
      }
    },

    // === IV. ANTECEDENTES PATOLÓGICOS FAMILIARES ===
    antecedentesFamiliares: {
      padre: "Diabetes, Hipertensión",
      madre: "Asma, Alergias",
      hermanos: "Ninguno",
      esposa: "María García",
      hijosVivos: "2",
      numeroHijos: "2"
    },

    // === ABSENTISMO ===
    absentismo: {
      enfermedades: [
        {
          enfermedad: "FRACTURITA ",
          asociadoTrabajo: { si: false, no: true },
          año: "2024",
          diasDescanso: "30",
          codigoAnexo: 10559,
          fecha: null,
          userRegistro: null
        },
        {
          enfermedad: "QUEMADURA",
          asociadoTrabajo: { si: true, no: false },
          año: "2025",
          diasDescanso: "25",
          codigoAnexo: 10559,
          fecha: null,
          userRegistro: null
        },
        {
          enfermedad: "FRACTURITA",
          asociadoTrabajo: { si: true, no: false },
          año: "2025",
          diasDescanso: "4",
          codigoAnexo: 10559,
          fecha: null,
          userRegistro: null
        }
      ]
    },

    // === V. EVALUACIÓN MÉDICA ===
    evaluacionMedica: {
      anamnesis: "Paciente refiere dolor lumbar intermitente desde hace 6 meses, relacionado con actividades laborales. No antecedentes de traumatismos recientes.",
      examenClinico: {
        talla: "1.75",
        peso: "80",
        imc: "26.1",
        pulso: "72",
        frecuenciaRespiratoria: "16",
        frecuenciaCardiaca: "72",
        presionArterial: "120/80",
        temperatura: "36.5",
        otros: "Sin hallazgos patológicos relevantes"
      },
      // === EXAMEN FÍSICO ===
      ectoscopia: "Paciente en buen estado general, consciente, orientado, colaborador. Presenta buen estado nutricional, sin signos de deshidratación. ",
      estadoMental: "Consciente, orientado en tiempo, espacio y persona. Sin alteraciones del estado de ánimo aparente. Colaborador durante la entrevista, con lenguaje fluido y coherente.",
      examenFisico: {
        piel: "Tegumento íntegro, sin lesiones visibles, de coloración normal. No se observan manchas, lunares atípicos o lesiones sospechosas. ",
        cabello: "Cabello normal, sin alopecia patológica. Presenta buena densidad y distribución. No se observan signos de caspa excesiva"
      }
    },

    // === PÁGINA 2: EXAMEN DE OJOS ===
    examenOjos: {
      // Sin Hallazgos - Sin Corregir
      sinCorregir: {
        visionCerca: {
          od: "20/20", // Ojo derecho
          oi: "20/20"  // Ojo izquierdo
        },
        visionLejos: {
          od: "20/20",
          oi: "20/20"
        }
      },
      // Sin Hallazgos - Corregida
      corregida: {
        visionCerca: {
          od: "20/25",
          oi: "20/25"
        },
        visionLejos: {
          od: "20/20",
          oi: "20/20"
        }
      },
      // Visión de Colores (campo único)
      visionColores: "10/14",
      // Hallazgos
      hallazgos: {
        enfermedadesOculares: "Sin patologías oculares evidentes. Fundoscopía normal bilateral. No alteraciones en la motilidad ocular. ",
        reflejosPupilares: "CONSERVADO"
      }
    },

    // === PÁGINA 2: EXAMEN FÍSICO POR SISTEMAS ===
    examenFisicoSistemas: {
      oidos: "Oídos normales, sin secreciones patológicas. Membranas timpánicas íntegras.",
      nariz: "Nariz permeable, sin obstrucciones. Mucosa nasal normal.",
      boca: "Cavidad oral normal, sin lesiones. Mucosa oral íntegra.",
      faringe: "Faringe normal, sin signos de inflamación.",
      cuello: "Cuello sin masas palpables, tiroides normal.",
      aparatoRespiratorio: "Auscultación pulmonar normal, sin sibilancias ni crepitantes.",
      aparatoCardiovascular: "Ritmo cardíaco regular, sin soplos. Pulso periférico normal.",
      aparatoDigestivo: "Abdomen blando, no doloroso. No hepatomegalia ni esplenomegalia.",
      aparatoGenitourinario: "Sistema genitourinario normal al examen externo. Sistema genitourinario normal al examen externo Sistema genitourinario normal al examen externo Sistema genitourinario normal al examen externo Sistema genitourinario normaL",
      aparatoLocomotor: "Articulaciones con movilidad normal, sin limitaciones.",
      sistemaLinfatico: "No adenopatías palpables.",
      marcha: "Marcha normal, sin alteraciones.",
      columna: "Columna vertebral alineada, sin desviaciones.",
      miembrosSuperiores: "Miembros superiores con movilidad completa, sin limitaciones.",
      miembrosInferiores: "Miembros inferiores con movilidad completa, sin limitaciones.",
      sistemaNervioso: "Reflejos normales, coordinación conservada."
    },

    // === PÁGINA 2: CONCLUSIONES Y DIAGNÓSTICOS ===
    conclusiones: {
      // VI. CONCLUSIONES DE EVALUACIÓN PSICOLÓGICA
      conclusionesEvaluacionPsicologica: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP.",

      // VII. CONCLUSIONES RADIOGRÁFICAS
      conclusionesRadiograficas: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP. TRAMA BRONCOVASCULAR ACENTUADA EN ACP",

      // VIII. HALLAZGOS PATOLÓGICOS DE LABORATORIO
      hallazgosPatologicosLaboratorio: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP. TRAMA BRONCOVASCULAR ACENTUADA EN ACP",

      // IX. CONCLUSIÓN AUDIOMETRÍA
      conclusionAudiometria: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP. TRAMA BRONCOVASCULAR ACENTUADA EN ACP ",

      // X. CONCLUSIÓN DE ESPIROMETRÍA
      conclusionEspirometria: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP. TRAMA BRONCOVASCULAR ACENTUADA EN ACP",

      // XI. OTROS
      otros: "No se registran otros hallazgos de relevancia clínica.",

      // XII. DIAGNÓSTICO MÉDICO OCUPACIONAL Y RECOMENDACIONES
      diagnosticoMedicoOcupacional: "APTO PARA EL PUESTO DE TRABAJO. El trabajador presenta un estado de salud general satisfactorio sin contraindicaciones médicas para el desempeño de sus funciones laborales. Se recomienda continuar con las medidas de seguridad y salud ocupacional establecidas, realizar evaluaciones médicas periódicas según normativa vigente, y mantener un estilo de vida saludable con ejercicio regular y alimentación balanceada."
    },

    // === PÁGINA 2: SECCIÓN XIII - CONCLUSIONES FINALES ===
    conclusionesFinales: {
      // Checkboxes de aptitud
      apto: true,
      aptoConRestriccion: true,
      noApto: true,

      // Campo de restricciones
      restricciones: "Sin restricciones médicas específicas. Sin restricciones médicas específicas. ",

      // Firmas
      firmaMedico: "/img/firmas_sellos_prueba/firma_sello.png",
      huellaPaciente: "/img/firmas_sellos_prueba/HUELLA_DIGITAL.png",
      firmaPaciente: "/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png"
    }
  };


  // Datos reales (mapeo desde data)
  const datosReales = {
    // === INFORMACIÓN GENERAL ===
    numeroOrden: String(data.norden_n_orden ?? ""),
    tipoEvaluacion: {
      preOcupacional: data.nombreExamen_nom_examen == "PRE-OCUPACIONAL" ?? false,
      anual: data.nombreExamen_nom_examen == "ANUAL" ?? false,
      retiro: data.nombreExamen_nom_examen == "RETIRO" ?? false,
      otros: data.nombreExamen_nom_examen != "PRE-OCUPACIONAL" && data.nombreExamen_nom_examen != "ANUAL" && data.nombreExamen_nom_examen != "RETIRO"
    },
    fechaExamen: formatearFechaCorta(data.fechaAnexo_fecha ?? ""), //agregar formateo
    lugarExamen: {
      departamento: data.departamentoExamen ?? "",//revisar pedir
      provincia: data.provinciaExamen ?? "",//revisar pedir
      distrito: data.distritoExamen ?? ""//revisar pedir
    },

    // === DATOS DE LA EMPRESA ===
    datosEmpresa: {
      contrata: data.contrata_razon_contrata ?? "",
      empresa: data.empresa_razon_empresa ?? "",
      actividadEconomica: "",
      lugarTrabajo: ""
    },

    // === UBICACIÓN Y PUESTO ===
    ubicacion: {
      departamento: "",
      provincia: "",
      distrito: ""
    },
    puestoPostula: data.nombreExamen_nom_examen == "PRE-OCUPACIONAL" ? (data.cargo_cargo_de ?? "") : "",

    // === II. FILIACIÓN DEL TRABAJADOR ===
    filiacionTrabajador: {
      nombresApellidos: (data.nombres_nombres_pa ?? "") + " " + (data.apellidos_apellidos_pa ?? ""),
      fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente_fecha_nacimiento_pa ?? ""), //agregar formateo
      edad: (data.edad_fecha_nacimiento_pa ?? "") + " años",
      domicilioFiscal: data.direccionPaciente_direccion_pa ?? "",
      dni: String(data.dni_cod_pa ?? ""),
      ubicacion: {
        departamento: data.departamentoPaciente_departamento_pa ?? "",
        provincia: data.provinciaPaciente_provincia_pa ?? "",
        distrito: data.distritoPaciente_distrito_pa ?? ""
      },
      residenciaLugarTrabajo: {
        si: data.residenciaSi_chkresidenciasi ?? false,
        no: data.residenciaNo_chkresidenciano ?? false
      },
      tiempoResidencia: data.residenciaTiempo_txttiemporesidencia ?? "",
      seguros: {
        essalud: data.essalud_chkessalud ?? false,
        eps: data.eps_chkeps ?? false,
        otro1: data.residenciaTrabajoOtros_chkotros ?? false,
        sctr: data.sctr_chksctr ?? false,
        otro2: data.sctrOtros_chkotros1 ?? false
      },
      contacto: {
        correoElectronico: data.emailPaciente_email_pa ?? "",
        telefono: data.celularPaciente_cel_pa ?? "",
        gradoInstruccion: data.nivelEstudiosPaciente_nivel_est_pa ?? ""
      },
      estadoCivil: data.estadoCivilPaciente_estado_civil_pa ?? "",
      totalHijos: data.totalHijos_txttotalhijos ?? "",
      dependientes: data.numeroDependientes_txtndependientes ?? ""
    },

    // === III. ANTECEDENTES PATOLÓGICOS PERSONALES ===
    antecedentesPatologicos: {
      // Condiciones médicas - Columna 1 (Izquierda)
      alergias: { si: data.alergias ?? false, no: !data.alergias ?? true },//revisar pedir
      asma: { si: data.asma ?? false, no: !data.asma ?? true },//revisar pedir
      bronquitis: { si: data.bronquitis ?? false, no: !data.bronquitis ?? true },//revisar pedir
      quemaduras: { si: data.quemaduras_chkquemaduras ?? false, no: !data.quemaduras_chkquemaduras ?? true },
      cirugias: { si: data.cirugias_chkcirugias ?? false, no: !data.cirugias_chkcirugias ?? true },

      // Condiciones médicas - Columna 2 (Centro)
      tbc: { si: data.tbc ?? false, no: !data.tbc ?? true }, //revisar pedir
      its: { si: data.its_chkits ?? false, no: !data.its_chkits ?? true },
      convulsiones: { si: data.convulsiones ?? false, no: !data.convulsiones ?? true },//revisar pedir
      neoplasia: { si: data.neoplasia_chkneoplasia ?? false, no: !data.neoplasia_chkneoplasia ?? true },
      intoxicaciones: { si: data.intoxicaciones ?? false, no: !data.intoxicaciones ?? true },//revisar pedir

      // Condiciones médicas - Columna 3 (Derecha)
      hepatitis: { si: data.hepatitis ?? false, no: !data.hepatitis ?? true },//revisar pedir
      tifoidea: { si: data.tifoidea ?? false, no: !data.tifoidea ?? true },//revisar pedir
      hta: { si: data.hta ?? false, no: !data.hta ?? true },//revisar pedir
      diabetes: { si: data.diabetes ?? false, no: !data.diabetes ?? true },//revisar pedir
      otros: { si: data.antecedentesPersonalesOtros_chkapotros ?? false, no: !data.antecedentesPersonalesOtros_chkapotros ?? true },

      // Hábitos Nocivos
      habitosNocivos: {
        alcohol: { si: data.alcohol ?? false, no: !data.alcohol ?? true, tipo: data.alcoholTipo ?? "", cantidad: data.alcoholCantidad ?? "" },//revisar pedir
        tabaco: { si: data.tabaco ?? false, no: !data.tabaco ?? true, tipo: data.tabacoTipo ?? "", cantidad: data.tabacoCantidad ?? "" },//revisar pedir
        drogas: { si: data.drogas ?? false, no: !data.drogas ?? true, tipo: data.drogasTipo ?? "", cantidad: data.drogasCantidad ?? "" },//revisar pedir
        medicamento: { si: data.medicamentosSi_rbsimed ?? false, no: data.medicamentosNo_rbnomed ?? false, tipo: data.tipoMedicamento_txttipomedicamento ?? "", cantidad: data.frecuenciaMedicamentos_txtfrecuenciamed ?? "" }
      }
    },

    // === IV. ANTECEDENTES PATOLÓGICOS FAMILIARES ===
    antecedentesFamiliares: {
      padre: data.padre_txtpadre ?? "",
      madre: data.madre_txtmadre ?? "",
      hermanos: data.hermanos_txthermanos ?? "",
      esposa: data.esposa_txtesposa ?? "",
      hijosVivos: String(data.hijosVivosAnexo2_txthijosvivos ?? ""),
      numeroHijos: String(data.hijosMuertosAnexo2_txthijosmuertos ?? "")
    },

    // === ABSENTISMO ===
    absentismo: {
      // Usar accidentes directamente del JSON
      enfermedades: accidentes?.map(accidente => ({
        enfermedad: accidente.enfermedad ?? "",
        asociadoTrabajo: { 
          si: accidente.asociadoTrabajo === "true" || accidente.asociadoTrabajo === true, 
          no: accidente.asociadoTrabajo === "false" || accidente.asociadoTrabajo === false 
        },
        año: accidente.anio ?? "",
        diasDescanso: accidente.diasDescanso ?? "",
        codigoAnexo: accidente.codigoAnexo ?? "",
        fecha: accidente.fecha ?? "",
        userRegistro: accidente.userRegistro ?? ""
      })) ?? []
    },

    // === V. EVALUACIÓN MÉDICA ===
    evaluacionMedica: {
      anamnesis: data.anamnesis_txtanamnesis ?? "",
      examenClinico: {
        talla: data.talla_talla ?? "",
        peso: data.peso_peso ?? "",
        imc: data.imc_imc ?? "",
        pulso: data.pulso ?? "",
        frecuenciaRespiratoria: data.frespiratoria_f_respiratoria ?? "",
        frecuenciaCardiaca: data.fcardiaca_f_cardiaca ?? "",
        presionArterial: data.sistolica_sistolica ?? "",
        temperatura: data.temperatura_temperatura ?? "",
        otros: `SAR O2 : ${data.sat02_sat_02 ?? ""}`
      },
      // === EXAMEN FÍSICO ===
      ectoscopia: data.ectoscopia_txtectoscopia ?? "",
      estadoMental: data.estadoMental_txtestadomental ?? "",
      examenFisico: {
        piel: data.piel_txtpiel ?? "",
        cabello: data.cabeza_txtpelo ?? ""
      }
    },

    // === PÁGINA 2: EXAMEN DE OJOS ===
    examenOjos: {
      // Sin Hallazgos - Sin Corregir
      sinCorregir: {
        visionCerca: {
          od: data.visionCercaSinCorregirOd_v_cerca_s_od ?? "",
          oi: data.visionCercaSinCorregirOi_v_cerca_s_oi ?? ""
        },
        visionLejos: {
          od: data.visionLejosSinCorregirOd_v_lejos_s_od ?? "",
          oi: data.visionLejosSinCorregirOi_v_lejos_s_oi ?? ""
        }
      },
      // Sin Hallazgos - Corregida
      corregida: {
        visionCerca: {
          od: data.visionCercaCorregidaOd_v_cerca_c_od ?? "",
          oi: data.visionCercaCorregidaOi_v_cerca_c_oi ?? ""
        },
        visionLejos: {
          od: data.visionLejosCorregidaOd_v_lejos_c_od ?? "",
          oi: data.visionLejosCorregidaOi_v_lejos_c_oi ?? ""
        }
      },
      // Visión de Colores (campo único)
      visionColores: data.visionColores_v_colores ?? "",
      // Hallazgos
      hallazgos: {
        enfermedadesOculares: data.enfermedadesOcularesOftalmo_e_oculares ?? "",
        reflejosPupilares: data.reflejosPupilares_r_pupilares ?? ""
      }
    },

    // === PÁGINA 2: EXAMEN FÍSICO POR SISTEMAS ===
    examenFisicoSistemas: {
      oidos: data.oidos_txtoidos ?? "",
      nariz: data.nariz_txtnariz ?? "",
      boca: data.boca_txtboca ?? "",
      faringe: data.faringe_txtfaringe ?? "",
      cuello: data.cuello_txtcuello ?? "",
      aparatoRespiratorio: data.aparatoRespiratorio_txtaparatorespiratorio ?? "",
      aparatoCardiovascular: data.aparatoCardiovascular_txtaparatocardiovascular ?? "",
      aparatoDigestivo: data.aparatoDigestivo_txtaparatodigestivo ?? "",
      aparatoGenitourinario: data.aparatoGeiotourinario_txtaparatogeiotourinario ?? "",
      aparatoLocomotor: data.aparatoLocomotor_txtaparatolocomotor ?? "",
      sistemaLinfatico: data.sistemaLinfatico_txtsistemalinfatico ?? "",
      marcha: data.marcha_txtmarcha ?? "",
      columna: data.columnaVertebral_txtcolumnavertebral ?? "",
      miembrosSuperiores: data.miembrosSuperiores_txtmiembrossuperiores ?? "",
      miembrosInferiores: data.miembrosInferiores_txtmiembrosinferiores ?? "",
      sistemaNervioso: data.sistemaNervioso_sistemanervioso ?? ""
    },

    // === PÁGINA 2: CONCLUSIONES Y DIAGNÓSTICOS ===
    conclusiones: {
      // VI. CONCLUSIONES DE EVALUACIÓN PSICOLÓGICA
      conclusionesEvaluacionPsicologica: data.recomendacionesInfoPsicologico_recomendaciones ?? "",

      // VII. CONCLUSIONES RADIOGRÁFICAS
      conclusionesRadiograficas: data.conclusionesRadiograficas_txtconclusionesradiograficas ?? "",

      // VIII. HALLAZGOS PATOLÓGICOS DE LABORATORIO
      hallazgosPatologicosLaboratorio: data.observacionesLabClinico_txtobservacioneslb ?? "",

      // IX. CONCLUSIÓN AUDIOMETRÍA
      conclusionAudiometria: data.diagnosticoAudiometria_diagnostico ?? "",

      // X. CONCLUSIÓN DE ESPIROMETRÍA
      conclusionEspirometria: data.conclusion_txtconclusion ?? "",

      // XI. OTROS
      otros: data.otrosExamenes_txtotrosex ?? "",

      // XII. DIAGNÓSTICO MÉDICO OCUPACIONAL Y RECOMENDACIONES
      diagnosticoMedicoOcupacional: data.observacionesFichaMedica_txtobservacionesfm ?? ""
    },

    // === PÁGINA 2: SECCIÓN XIII - CONCLUSIONES FINALES ===
    conclusionesFinales: {
      // Checkboxes de aptitud
      apto: data.esApto_apto_si ?? false,
      aptoConRestriccion: data.aptoRestriccion_apto_re ?? false,
      noApto: data.noEsApto_apto_no ?? false,

      // Campo de restricciones
      restricciones: data.restricciones_txtrestricciones ?? "",

      // Firmas
      firmaMedico: data.digitalizacion?.find(
        item => item.nombreDigitalizacion === "SELLOFIRMA"
      )?.url ?? "",
      huellaPaciente: data.digitalizacion?.find(
        item => item.nombreDigitalizacion === "HUELLA"
      )?.url ?? "",
      firmaPaciente: data.digitalizacion?.find(
        item => item.nombreDigitalizacion === "FIRMAP"
      )?.url ?? ""
    }
  };

  // Usar datos reales o datos de prueba
  // Verificar si hay datos reales de la API (presencia de norden_n_orden indica datos reales)
  const datosFinales = data && data.norden_n_orden ? datosReales : datosPrueba;

  // === PÁGINA 1 ===
  // === 0) HEADER ===
  headerAnexo2(doc, data, 1);

  // === 1) Imagen de fondo para Anexo2 ===
  const fondoImg = "/img/Anexo2/Pag1_anexo2.png";

  // Márgenes de 8mm a cada lado
  const margenLateral = 8; // 8mm

  // Usar el ancho del documento menos los márgenes laterales
  const imgWidth = pageW - (margenLateral * 2); // Ancho menos márgenes
  const imgHeight = pageH * 0.9; // 90% de la altura para dejar espacio para ajustar

  // Posicionar desde abajo hacia arriba con márgenes laterales
  const xOffset = margenLateral; // Margen izquierdo
  const yOffset = pageH - imgHeight - 8; // Subido 5 puntos hacia arriba

  try {
    doc.addImage(fondoImg, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  } catch (e) {
    doc.text("Imagen de Anexo2 no disponible", margin, yOffset + 10);
  }

  // === 2) CAMPOS DE DATOS PERSONALIZABLES ===
  doc.setFont("helvetica", "bold").setFontSize(9);

  // === SECCIÓN: INFORMACIÓN GENERAL ===
  // Número de Orden
  const xNumeroOrden = 32; // Posición X para número de orden
  const yNumeroOrden = 26; // Posición Y para número de orden (subido 5 puntos)

  // Tipo de Evaluación - Posiciones X para checkboxes
  const xTipoPreOcupacional = 80; // Posición X para PRE-OCUPACIONAL
  const yTipoPreOcupacional = 31.2; // Posición Y para PRE-OCUPACIONAL (subido 5 puntos)

  const xTipoAnual = 109; // Posición X para ANUAL
  const yTipoAnual = 31.2; // Posición Y para ANUAL (subido 5 puntos)

  const xTipoRetiro = 142.4; // Posición X para RETIRO
  const yTipoRetiro = 31.2; // Posición Y para RETIRO (subido 5 puntos)

  const xTipoOtros = 174.5; // Posición X para OTROS
  const yTipoOtros = 31.2; // Posición Y para OTROS (subido 5 puntos)

  // Fecha de Examen
  const xFechaExamen = 135; // Posición X para fecha de examen
  const yFechaExamen = 26; // Posición Y para fecha de examen (subido 5 puntos)

  // Lugar de Examen
  const xLugarDepartamento = 55; // Posición X para departamento
  const yLugarDepartamento = 36.2; // Posición Y para departamento
  const xLugarProvincia = 105; // Posición X para provincia
  const yLugarProvincia = 36.2; // Posición Y para provincia
  const xLugarDistrito = 147.4; // Posición X para distrito
  const yLugarDistrito = 36.2; // Posición Y para distrito

  // Información General
  // Número de Orden
  if (datosFinales.numeroOrden) {
    doc.setFont("helvetica", "normal").setFontSize(13);
    doc.text(datosFinales.numeroOrden.toUpperCase(), xNumeroOrden, yNumeroOrden);
  }

  // Tipo de Evaluación - Checkboxes
  if (datosFinales.tipoEvaluacion) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(12);

    if (datosFinales.tipoEvaluacion.preOcupacional) {
      doc.text("X", xTipoPreOcupacional, yTipoPreOcupacional);
    }
    if (datosFinales.tipoEvaluacion.anual) {
      doc.text("X", xTipoAnual, yTipoAnual);
    }
    if (datosFinales.tipoEvaluacion.retiro) {
      doc.text("X", xTipoRetiro, yTipoRetiro);
    }
    if (datosFinales.tipoEvaluacion.otros) {
      doc.text("X", xTipoOtros, yTipoOtros);
    }

    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // Fecha de Examen
  if (datosFinales.fechaExamen) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(datosFinales.fechaExamen.toUpperCase(), xFechaExamen, yFechaExamen);
  }

  // Lugar de Examen
  if (datosFinales.lugarExamen) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    if (datosFinales.lugarExamen.departamento) {
      doc.text(datosFinales.lugarExamen.departamento.toUpperCase(), xLugarDepartamento, yLugarDepartamento);
    }
    if (datosFinales.lugarExamen.provincia) {
      doc.text(datosFinales.lugarExamen.provincia.toUpperCase(), xLugarProvincia, yLugarProvincia);
    }
    if (datosFinales.lugarExamen.distrito) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(datosFinales.lugarExamen.distrito.toUpperCase(), xLugarDistrito, yLugarDistrito);
    }
  }

  // === SECCIÓN: I. DATOS DE LA EMPRESA ===
  // Posiciones para datos de la empresa
  const xContrata = 27; // Posición X para contrata
  const yContrata = 47; // Posición Y para contrata
  const xEmpresa = 27; // Posición X para empresa
  const yEmpresa = 52; // Posición Y para empresa
  const xActividadEconomica = 40; // Posición X para actividad económica
  const yActividadEconomica = 57; // Posición Y para actividad económica
  const xLugarTrabajo = 35; // Posición X para lugar de trabajo
  const yLugarTrabajo = 62; // Posición Y para lugar de trabajo

  // Datos de la Empresa
  if (datosFinales.datosEmpresa) {
    const empresa = datosFinales.datosEmpresa;

    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);

    // Contrata
    if (empresa.contrata) {
      doc.text(empresa.contrata.toUpperCase(), xContrata, yContrata);
    }

    // Empresa
    if (empresa.empresa) {
      doc.text(empresa.empresa.toUpperCase(), xEmpresa, yEmpresa);
    }

    // Actividad Económica
    if (empresa.actividadEconomica) {
      doc.text(empresa.actividadEconomica.toUpperCase(), xActividadEconomica, yActividadEconomica);
    }

    // Lugar de trabajo
    if (empresa.lugarTrabajo) {
      doc.text(empresa.lugarTrabajo.toUpperCase(), xLugarTrabajo, yLugarTrabajo);
    }
  }

  // === SECCIÓN: UBICACIÓN Y PUESTO ===
  // Posiciones para ubicación
  const xUbicacionDepartamento = 55; // Posición X para departamento
  const yUbicacionDepartamento = 68; // Posición Y para departamento
  const xUbicacionProvincia = 105; // Posición X para provincia
  const yUbicacionProvincia = 68; // Posición Y para provincia
  const xUbicacionDistrito = 147.4; // Posición X para distrito
  const yUbicacionDistrito = 68; // Posición Y para distrito

  // Posición para puesto a que postula
  const xPuestoPostula = 74; // Posición X para puesto a que postula
  const yPuestoPostula = 73; // Posición Y para puesto a que postula

  // Ubicación
  if (datosFinales.ubicacion) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);

    if (datosFinales.ubicacion.departamento) {
      doc.text(datosFinales.ubicacion.departamento.toUpperCase(), xUbicacionDepartamento, yUbicacionDepartamento);
    }
    if (datosFinales.ubicacion.provincia) {
      doc.text(datosFinales.ubicacion.provincia.toUpperCase(), xUbicacionProvincia, yUbicacionProvincia);
    }
    if (datosFinales.ubicacion.distrito) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(datosFinales.ubicacion.distrito.toUpperCase(), xUbicacionDistrito, yUbicacionDistrito);
    }
  }

  // Puesto a que postula - Solo si es PRE-OCUPACIONAL
  if (datosFinales.tipoEvaluacion?.preOcupacional && datosFinales.puestoPostula) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.puestoPostula.toUpperCase(), xPuestoPostula, yPuestoPostula);
  }

  // === SECCIÓN: II. FILIACIÓN DEL TRABAJADOR ===
  if (datosFinales.filiacionTrabajador) {
    const filiacion = datosFinales.filiacionTrabajador;

    // Posiciones para filiación del trabajador
    const xNombresApellidos = 40;
    const yNombresApellidos = 84.2;
    const xFechaNacimiento = 128;
    const yFechaNacimiento = 84.2;
    const xEdad = 173;
    const yEdad = 84.2;

    const xDomicilioFiscal = 34;
    const yDomicilioFiscal = 89.7;
    const xDni = 173;
    const yDni = 89.7;

    const xUbicacionDept = 55;
    const yUbicacionDept = 94;
    const xUbicacionProv = 115;
    const yUbicacionProv = 94;
    const xUbicacionDist = 147.4;
    const yUbicacionDist = 94;

    const xResidenciaSi = 83;
    const yResidenciaSi = 100.5;
    const xResidenciaNo = 105.2;
    const yResidenciaNo = 100.5;
    const xTiempoResidencia = 160;
    const yTiempoResidencia = 100.2;

    const xEssalud = 42;
    const yEssalud = 105.8;
    const xEps = 79;
    const yEps = 105.8;
    const xOtro1 = 115;
    const yOtro1 = 105.8;
    const xSctr = 151;
    const ySctr = 105.8;
    const xOtro2 = 188;
    const yOtro2 = 105.8;

    const xCorreo = 39;
    const yCorreo = 110.5;
    const xTelefono = 108;
    const yTelefono = 110.5;
    const xGradoInstruccion = 160;
    const yGradoInstruccion = 110.5;

    const xEstadoCivil = 30;
    const yEstadoCivil = 115.8;
    const xTotalHijos = 90;
    const yTotalHijos = 115.8;
    const xDependientes = 170;
    const yDependientes = 115.8;

    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);

    // Nombres y Apellidos
    if (filiacion.nombresApellidos) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(filiacion.nombresApellidos.toUpperCase(), xNombresApellidos, yNombresApellidos);
    }

    // Fecha de Nacimiento
    if (filiacion.fechaNacimiento) {
      doc.text(filiacion.fechaNacimiento.toUpperCase(), xFechaNacimiento, yFechaNacimiento);
    }

    // Edad
    if (filiacion.edad) {
      doc.text(`${filiacion.edad}`.toUpperCase(), xEdad, yEdad);
    }

    // Domicilio Fiscal
    if (filiacion.domicilioFiscal) {
      doc.text(filiacion.domicilioFiscal.toUpperCase(), xDomicilioFiscal, yDomicilioFiscal);
    }

    // DNI
    if (filiacion.dni) {
      doc.text(filiacion.dni.toUpperCase(), xDni, yDni);
    }

    // Ubicación
    if (filiacion.ubicacion) {
      if (filiacion.ubicacion.departamento) {
        doc.text(filiacion.ubicacion.departamento.toUpperCase(), xUbicacionDept, yUbicacionDept);
      }
      if (filiacion.ubicacion.provincia) {
        doc.text(filiacion.ubicacion.provincia.toUpperCase(), xUbicacionProv, yUbicacionProv);
      }
      if (filiacion.ubicacion.distrito) {
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(filiacion.ubicacion.distrito.toUpperCase(), xUbicacionDist, yUbicacionDist);
      }
    }

    // Residencia en el lugar de trabajo - Checkboxes
    if (filiacion.residenciaLugarTrabajo) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(12);

      if (filiacion.residenciaLugarTrabajo.si) {
        doc.text("X", xResidenciaSi, yResidenciaSi);
      }
      if (filiacion.residenciaLugarTrabajo.no) {
        doc.text("X", xResidenciaNo, yResidenciaNo);
      }

      doc.setTextColor(0, 0, 0); // Resetear a negro
      doc.setFont("helvetica", "normal").setFontSize(9);
    }

    // Tiempo de residencia
    if (filiacion.tiempoResidencia) {
      doc.text(filiacion.tiempoResidencia.toUpperCase(), xTiempoResidencia, yTiempoResidencia);
    }

    // Seguros - Checkboxes
    if (filiacion.seguros) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(12);

      if (filiacion.seguros.essalud) {
        doc.text("X", xEssalud, yEssalud);
      }
      if (filiacion.seguros.eps) {
        doc.text("X", xEps, yEps);
      }
      if (filiacion.seguros.otro1) {
        doc.text("X", xOtro1, yOtro1);
      }
      if (filiacion.seguros.sctr) {
        doc.text("X", xSctr, ySctr);
      }
      if (filiacion.seguros.otro2) {
        doc.text("X", xOtro2, yOtro2);
      }

      doc.setTextColor(0, 0, 0); // Resetear a negro
      doc.setFont("helvetica", "normal").setFontSize(9);
    }

    // Contacto
    if (filiacion.contacto) {
      if (filiacion.contacto.correoElectronico) {
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(filiacion.contacto.correoElectronico.toUpperCase(), xCorreo, yCorreo);
      }
      if (filiacion.contacto.telefono) {
        doc.text(filiacion.contacto.telefono.toUpperCase(), xTelefono, yTelefono);
      }
      if (filiacion.contacto.gradoInstruccion) {
        doc.text(filiacion.contacto.gradoInstruccion.toUpperCase(), xGradoInstruccion, yGradoInstruccion);
      }
    }

    // Estado Civil
    if (filiacion.estadoCivil) {
      doc.text(filiacion.estadoCivil.toUpperCase(), xEstadoCivil, yEstadoCivil);
    }

    // Total de hijos
    if (filiacion.totalHijos) {
      doc.text(filiacion.totalHijos.toUpperCase(), xTotalHijos, yTotalHijos);
    }

    // Dependientes
    if (filiacion.dependientes) {
      doc.text(filiacion.dependientes.toUpperCase(), xDependientes, yDependientes);
    }
  }

  // === SECCIÓN: III. ANTECEDENTES PATOLÓGICOS PERSONALES ===
  if (datosFinales.antecedentesPatologicos) {
    const antecedentes = datosFinales.antecedentesPatologicos;

    // Posiciones para condiciones médicas - Columna 1 (Izquierda)
    const xAlergiasSi = 37.5;
    const yAlergiasSi = 132.8;
    const xAlergiasNo = 43;
    const yAlergiasNo = 132.8;

    const xAsmaSi = 37.5;
    const yAsmaSi = 138;
    const xAsmaNo = 43;
    const yAsmaNo = 138;

    const xBronquitisSi = 37.5;
    const yBronquitisSi = 143.2;
    const xBronquitisNo = 43;
    const yBronquitisNo = 143.2;

    const xQuemadurasSi = 37.5;
    const yQuemadurasSi = 148.4;
    const xQuemadurasNo = 43;
    const yQuemadurasNo = 148.4;

    const xCirugiasSi = 37.5;
    const yCirugiasSi = 153.6;
    const xCirugiasNo = 43;
    const yCirugiasNo = 153.6;

    // Posiciones para condiciones médicas - Columna 2 (Centro)
    const xTbcSi = 93.8;
    const yTbcSi = 132.8;
    const xTbcNo = 98.8;
    const yTbcNo = 132.8;

    const xItsSi = 93.8;
    const yItsSi = 138;
    const xItsNo = 98.8;
    const yItsNo = 138;

    const xConvulsionesSi = 93.8;
    const yConvulsionesSi = 143.2;
    const xConvulsionesNo = 98.8;
    const yConvulsionesNo = 143.2;

    const xNeoplasiaSi = 93.8;
    const yNeoplasiaSi = 148.4;
    const xNeoplasiaNo = 98.80;
    const yNeoplasiaNo = 148.4;

    const xIntoxicacionesSi = 93.8;
    const yIntoxicacionesSi = 153.6;
    const xIntoxicacionesNo = 98.8;
    const yIntoxicacionesNo = 153.6;

    // Posiciones para condiciones médicas - Columna 3 (Derecha)
    const xHepatitisSi = 152;
    const yHepatitisSi = 132.8;
    const xHepatitisNo = 156.9;
    const yHepatitisNo = 132.8;

    const xTifoideaSi = 152;
    const yTifoideaSi = 138;
    const xTifoideaNo = 156.9;
    const yTifoideaNo = 138;

    const xHtaSi = 152;
    const yHtaSi = 143.2;
    const xHtaNo = 156.9;
    const yHtaNo = 143.2;

    const xDiabetesSi = 152;
    const yDiabetesSi = 148.4;
    const xDiabetesNo = 156.9;
    const yDiabetesNo = 148.4;

    const xOtrosSi = 152;
    const yOtrosSi = 153.6;
    const xOtrosNo = 156.9;
    const yOtrosNo = 153.6;

    // Posiciones para Hábitos Nocivos
    // Alcohol
    const xAlcoholSi = 37.5;
    const yAlcoholSi = 164.4;
    const xAlcoholNo = 43;
    const yAlcoholNo = 164.4;

    const xAlcoholTipo = 50;
    const yAlcoholTipo = 164.2;

    const xAlcoholCantidad = 108;
    const yAlcoholCantidad = 164.2;

    // Tabaco
    const xTabacoSi = 37.5;
    const yTabacoSi = 169.8;
    const xTabacoNo = 43;
    const yTabacoNo = 169.8;

    const xTabacoTipo = 50;
    const yTabacoTipo = 169.6;

    const xTabacoCantidad = 108;
    const yTabacoCantidad = 169.6;

    // Drogas
    const xDrogasSi = 37.5;
    const yDrogasSi = 175.2;
    const xDrogasNo = 43;
    const yDrogasNo = 175.2;

    const xDrogasTipo = 50;
    const yDrogasTipo = 175;

    const xDrogasCantidad = 108;
    const yDrogasCantidad = 175;

    // Medicamento
    const xMedicamentoSi = 37.5;
    const yMedicamentoSi = 180.6;
    const xMedicamentoNo = 43;
    const yMedicamentoNo = 180.6;

    const xMedicamentoTipo = 50;
    const yMedicamentoTipo = 180.4;

    const xMedicamentoCantidad = 108;
    const yMedicamentoCantidad = 180.4;

    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);

    // Función para renderizar checkboxes SI/NO
    const renderCheckbox = (condicion, xSi, ySi, xNo, yNo) => {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(12);

      if (condicion.si) {
        doc.text("X", xSi, ySi);
      }
      if (condicion.no) {
        doc.text("X", xNo, yNo);
      }

      doc.setTextColor(0, 0, 0); // Resetear a negro
      doc.setFont("helvetica", "normal").setFontSize(9);
    };

    // Condiciones médicas - Columna 1 (Izquierda)
    renderCheckbox(antecedentes.alergias, xAlergiasSi, yAlergiasSi, xAlergiasNo, yAlergiasNo);
    renderCheckbox(antecedentes.asma, xAsmaSi, yAsmaSi, xAsmaNo, yAsmaNo);
    renderCheckbox(antecedentes.bronquitis, xBronquitisSi, yBronquitisSi, xBronquitisNo, yBronquitisNo);
    renderCheckbox(antecedentes.quemaduras, xQuemadurasSi, yQuemadurasSi, xQuemadurasNo, yQuemadurasNo);
    renderCheckbox(antecedentes.cirugias, xCirugiasSi, yCirugiasSi, xCirugiasNo, yCirugiasNo);

    // Condiciones médicas - Columna 2 (Centro)
    renderCheckbox(antecedentes.tbc, xTbcSi, yTbcSi, xTbcNo, yTbcNo);
    renderCheckbox(antecedentes.its, xItsSi, yItsSi, xItsNo, yItsNo);
    renderCheckbox(antecedentes.convulsiones, xConvulsionesSi, yConvulsionesSi, xConvulsionesNo, yConvulsionesNo);
    renderCheckbox(antecedentes.neoplasia, xNeoplasiaSi, yNeoplasiaSi, xNeoplasiaNo, yNeoplasiaNo);
    renderCheckbox(antecedentes.intoxicaciones, xIntoxicacionesSi, yIntoxicacionesSi, xIntoxicacionesNo, yIntoxicacionesNo);

    // Condiciones médicas - Columna 3 (Derecha)
    renderCheckbox(antecedentes.hepatitis, xHepatitisSi, yHepatitisSi, xHepatitisNo, yHepatitisNo);
    renderCheckbox(antecedentes.tifoidea, xTifoideaSi, yTifoideaSi, xTifoideaNo, yTifoideaNo);
    renderCheckbox(antecedentes.hta, xHtaSi, yHtaSi, xHtaNo, yHtaNo);
    renderCheckbox(antecedentes.diabetes, xDiabetesSi, yDiabetesSi, xDiabetesNo, yDiabetesNo);
    renderCheckbox(antecedentes.otros, xOtrosSi, yOtrosSi, xOtrosNo, yOtrosNo);

    // Hábitos Nocivos
    if (antecedentes.habitosNocivos) {
      // Alcohol - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.alcohol) {
        renderCheckbox(antecedentes.habitosNocivos.alcohol, xAlcoholSi, yAlcoholSi, xAlcoholNo, yAlcoholNo);
        if (antecedentes.habitosNocivos.alcohol.tipo) {
          doc.text(antecedentes.habitosNocivos.alcohol.tipo.toUpperCase(), xAlcoholTipo, yAlcoholTipo);
        }
        if (antecedentes.habitosNocivos.alcohol.cantidad) {
          doc.text(antecedentes.habitosNocivos.alcohol.cantidad.toUpperCase(), xAlcoholCantidad, yAlcoholCantidad);
        }
      }

      // Tabaco - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.tabaco) {
        renderCheckbox(antecedentes.habitosNocivos.tabaco, xTabacoSi, yTabacoSi, xTabacoNo, yTabacoNo);
        if (antecedentes.habitosNocivos.tabaco.tipo) {
          doc.text(antecedentes.habitosNocivos.tabaco.tipo.toUpperCase(), xTabacoTipo, yTabacoTipo);
        }
        if (antecedentes.habitosNocivos.tabaco.cantidad) {
          doc.text(antecedentes.habitosNocivos.tabaco.cantidad.toUpperCase(), xTabacoCantidad, yTabacoCantidad);
        }
      }

      // Drogas - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.drogas) {
        renderCheckbox(antecedentes.habitosNocivos.drogas, xDrogasSi, yDrogasSi, xDrogasNo, yDrogasNo);
        if (antecedentes.habitosNocivos.drogas.tipo) {
          doc.text(antecedentes.habitosNocivos.drogas.tipo.toUpperCase(), xDrogasTipo, yDrogasTipo);
        }
        if (antecedentes.habitosNocivos.drogas.cantidad) {
          doc.text(antecedentes.habitosNocivos.drogas.cantidad.toUpperCase(), xDrogasCantidad, yDrogasCantidad);
        }
      }

      // Medicamento - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.medicamento) {
        renderCheckbox(antecedentes.habitosNocivos.medicamento, xMedicamentoSi, yMedicamentoSi, xMedicamentoNo, yMedicamentoNo);
        if (antecedentes.habitosNocivos.medicamento.tipo) {
          doc.text(antecedentes.habitosNocivos.medicamento.tipo.toUpperCase(), xMedicamentoTipo, yMedicamentoTipo);
        }
        if (antecedentes.habitosNocivos.medicamento.cantidad) {
          doc.text(antecedentes.habitosNocivos.medicamento.cantidad.toUpperCase(), xMedicamentoCantidad, yMedicamentoCantidad);
        }
      }
    }
  }

  // === SECCIÓN: IV. ANTECEDENTES PATOLÓGICOS FAMILIARES ===
  if (datosFinales.antecedentesFamiliares) {
    const familia = datosFinales.antecedentesFamiliares;

    // Posiciones para antecedentes familiares
    const xPadre = 25;
    const yPadre = 190;

    const xMadre = 90;
    const yMadre = 190;

    const xHermanos = 160;
    const yHermanos = 190;

    const xEsposa = 25;
    const yEsposa = 196;

    const xHijosVivos = 90;
    const yHijosVivos = 196;

    const xNumeroHijos = 160;
    const yNumeroHijos = 196;

    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);

    // Padre
    if (familia.padre) {
      doc.text(familia.padre.toUpperCase(), xPadre, yPadre);
    }

    // Madre
    if (familia.madre) {
      doc.text(familia.madre.toUpperCase(), xMadre, yMadre);
    }

    // Hermanos
    if (familia.hermanos) {
      doc.text(familia.hermanos.toUpperCase(), xHermanos, yHermanos);
    }

    // Esposa
    if (familia.esposa) {
      doc.text(familia.esposa.toUpperCase(), xEsposa, yEsposa);
    }

    // Hijos vivos
    if (familia.hijosVivos) {
      doc.text(familia.hijosVivos.toUpperCase(), xHijosVivos, yHijosVivos);
    }

    // Número de hijos
    if (familia.numeroHijos) {
      doc.text(familia.numeroHijos.toUpperCase(), xNumeroHijos, yNumeroHijos);
    }
  }

  // === SECCIÓN: ABSENTISMO ===
  if (datosFinales.absentismo && datosFinales.absentismo.enfermedades) {
    const enfermedades = datosFinales.absentismo.enfermedades;

    // Posiciones base para la primera fila
    const xBaseEnfermedad = 20; // Posición para el nombre de la enfermedad
    const yBaseEnfermedad = 214.3;
    const xBaseSi = 107.8;
    const yBaseSi = 214.3;
    const xBaseNo = 124;
    const yBaseNo = 214.3;  
    const xBaseAno = 138.5;
    const yBaseAno = 214.3;
    const xBaseDias = 180;
    const yBaseDias = 214.3;

    // Espaciado entre filas
    const espaciadoFila = 5.4;

    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.setTextColor(0, 0, 0);

    // Renderizar hasta 7 enfermedades (o las que quepan en el espacio disponible)
    enfermedades.slice(0, 7).forEach((enfermedad, index) => {
      const yOffset = index * espaciadoFila;
      
      // Nombre de la enfermedad/accidente
      if (enfermedad.enfermedad) {
        doc.text(enfermedad.enfermedad.toUpperCase(), xBaseEnfermedad, yBaseEnfermedad + yOffset);
      }
      
      // Checkbox SI/NO
      if (enfermedad.asociadoTrabajo) {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(12);

        if (enfermedad.asociadoTrabajo.si) {
          doc.text("X", xBaseSi, yBaseSi + yOffset);
        }
        if (enfermedad.asociadoTrabajo.no) {
          doc.text("X", xBaseNo, yBaseNo + yOffset);
        }

        doc.setTextColor(0, 0, 0); // Resetear a negro
        doc.setFont("helvetica", "normal").setFontSize(9);
      }

      // Año
      if (enfermedad.año) {
        doc.text(enfermedad.año.toUpperCase(), xBaseAno, yBaseAno + yOffset);
      }

      // Días de descanso
      if (enfermedad.diasDescanso) {
        doc.text(enfermedad.diasDescanso.toUpperCase(), xBaseDias, yBaseDias + yOffset, { align: "center" });
      }
    });
  }

  // === SECCIÓN: V. EVALUACIÓN MÉDICA ===
  if (datosFinales.evaluacionMedica) {
    const evaluacion = datosFinales.evaluacionMedica;

    // Posiciones para evaluación médica
    const xAnamnesis = 30;
    const yAnamnesis = 254;

    // Examen clínico - Fila 1
    const xTalla = 43;
    const yTalla = 262.4;
    const xPeso = 70;
    const yPeso = 262.4;
    const xImc = 85;
    const yImc = 262.4;
    const xPulso = 107;
    const yPulso = 262.4;

    // Examen clínico - Fila 2
    const xFrecuenciaRespiratoria = 135;
    const yFrecuenciaRespiratoria = 262.4;
    const xFrecuenciaCardiaca = 157;
    const yFrecuenciaCardiaca = 262.4;
    const xPresionArterial = 172;
    const yPresionArterial = 262.4;
    const xTemperatura = 193;
    const yTemperatura = 262.4;

    // Examen clínico - Fila 3
    const xOtros = 37;
    const yOtros = 268;

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 0, 0);

    // Anamnesis
    if (evaluacion.anamnesis) {
      doc.text(evaluacion.anamnesis.toUpperCase(), xAnamnesis, yAnamnesis, { maxWidth: 170 });
    }

    // Examen clínico
    if (evaluacion.examenClinico) {
      const examen = evaluacion.examenClinico;

      // Fila 1
      if (examen.talla) {
        doc.text(examen.talla.toUpperCase(), xTalla, yTalla);
      }
      if (examen.peso) {
        doc.text(examen.peso.toUpperCase(), xPeso, yPeso);
      }
      if (examen.imc) {
        doc.text(examen.imc.toUpperCase(), xImc, yImc);
      }
      if (examen.pulso) {
        doc.text(examen.pulso.toUpperCase(), xPulso, yPulso);
      }

      // Fila 2
      if (examen.frecuenciaRespiratoria) {
        doc.text(examen.frecuenciaRespiratoria.toUpperCase(), xFrecuenciaRespiratoria, yFrecuenciaRespiratoria);
      }
      if (examen.frecuenciaCardiaca) {
        doc.text(examen.frecuenciaCardiaca.toUpperCase(), xFrecuenciaCardiaca, yFrecuenciaCardiaca);
      }
      if (examen.presionArterial) {
        doc.text(examen.presionArterial.toUpperCase(), xPresionArterial, yPresionArterial);
      }
      if (examen.temperatura) {
        doc.text(examen.temperatura.toUpperCase(), xTemperatura, yTemperatura);
      }

      // Fila 3
      if (examen.otros) {
        doc.setFont("helvetica", "normal").setFontSize(8);
        // Si es una lista (array), convertir a string separado por comas
        let otrosTexto = examen.otros;
        if (Array.isArray(examen.otros)) {
          otrosTexto = examen.otros.join(", ");
        } else if (typeof otrosTexto === 'string') {
          // Si es string pero tiene saltos de línea, reemplazarlos por comas
          otrosTexto = otrosTexto.replace(/\n/g, ", ");
        }
        doc.text(otrosTexto.toUpperCase(), xOtros, yOtros, { maxWidth: 170 });
      }
    }

    // Ectoscopía y Estado Mental (parte de Evaluación Médica)
    const xEctoscopia = 34;
    const yEctoscopia = 277.8;
    const xEstadoMental = 34;
    const yEstadoMental = 284.1;

    // Ectoscopía
    if (evaluacion.ectoscopia) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(evaluacion.ectoscopia.toUpperCase(), xEctoscopia, yEctoscopia, { maxWidth: 170 });
    }

    // Estado Mental
    if (evaluacion.estadoMental) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(evaluacion.estadoMental.toUpperCase(), xEstadoMental, yEstadoMental, { maxWidth: 170 });
    }
  }

  // === SECCIÓN: FIRMAS ===
  const firmasAPintar = [
    {
      nombre: "FIRMAP", x: 21, y: 350, maxw: 50
    },
    {
      nombre: "HUELLA", x: 80, y: 350, maxw: 20
    },
    {
      nombre: "SELLOFIRMA", x: 120, y: 350, maxw: 50
    }
  ];

  // Validar que data.informacionSede exista antes de acceder a sus propiedades
  const digitalizacion = data?.informacionSede?.digitalizacion || [];
  agregarFirmas(doc, digitalizacion, firmasAPintar).then(() => {
    // === PÁGINA 2 ===
    doc.addPage();

    // === 0) HEADER para Página 2 ===
    headerAnexo2(doc, data, 2);

    // === 1) Imagen de fondo para Anexo2 - Página 2 ===
    const fondoImg2 = "/img/Anexo2/Pag2_anexo2.png";

    // Márgenes de 8mm a cada lado (usar la misma variable de la página 1)
    const margenLateral2 = 8; // 8mm

    // Usar el ancho del documento menos los márgenes laterales
    const imgWidth2 = pageW - (margenLateral2 * 2); // Ancho menos márgenes
    const imgHeight2 = pageH * 0.9; // 90% de la altura para dejar espacio para ajustar

    // Posicionar desde abajo hacia arriba con márgenes laterales
    const xOffset2 = margenLateral2; // Margen izquierdo
    const yOffset2 = pageH - imgHeight2 - 8; // Subido 5 puntos hacia arriba

    try {
      doc.addImage(fondoImg2, "PNG", xOffset2, yOffset2, imgWidth2, imgHeight2);
    } catch (e) {
      doc.text("Imagen de Anexo2 Página 2 no disponible", margin, yOffset2 + 10);
    }

    // === 2) CAMPOS DE DATOS PARA PÁGINA 2 - EXAMEN DE OJOS ===
    if (datosFinales.examenOjos) {
      const examenOjos = datosFinales.examenOjos;

      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.setTextColor(0, 0, 0);

      // === SECCIÓN: SIN HALLAZGOS - SIN CORREGIR ===
      // Visión de Cerca - Sin Corregir
      const xVisionCercaSinCorregirOD = 41; // Posición X para O.D.
      const yVisionCercaSinCorregirOD = 83; // Posición Y para O.D.

      const xVisionCercaSinCorregirOI = 58; // Posición X para O.I.
      const yVisionCercaSinCorregirOI = 83; // Posición Y para O.I.

      // Visión de Lejos - Sin Corregir
      const xVisionLejosSinCorregirOD = 41;
      const yVisionLejosSinCorregirOD = 89;
      const xVisionLejosSinCorregirOI = 58;
      const yVisionLejosSinCorregirOI = 89;

      // === SECCIÓN: SIN HALLAZGOS - CORREGIDA ===
      // Visión de Cerca - Corregida
      const xVisionCercaCorregidaOD = 74; // Posición X para O.D.
      const yVisionCercaCorregidaOD = 83; // Posición Y para O.D.
      const xVisionCercaCorregidaOI = 91.5; // Posición X para O.I.
      const yVisionCercaCorregidaOI = 83; // Posición Y para O.I.

      // Visión de Lejos - Corregida
      const xVisionLejosCorregidaOD = 74;
      const yVisionLejosCorregidaOD = 89;
      const xVisionLejosCorregidaOI = 91.5;
      const yVisionLejosCorregidaOI = 89;

      // Visión de Colores (campo único que abarca toda la fila)
      const xVisionColores = 69; // Centrado en toda la fila
      const yVisionColores = 96;

      // === SECCIÓN: HALLAZGOS ===
      // Enfermedades Oculares
      const xEnfermedadesOculares = 108;
      const yEnfermedadesOculares = 74;

      // Reflejos Pupilares
      const xReflejosPupilares = 141.5;
      const yReflejosPupilares = 96;

      // Renderizar datos - Sin Corregir
      if (examenOjos.sinCorregir) {
        const sinCorregir = examenOjos.sinCorregir;

        // Visión de Cerca
        if (sinCorregir.visionCerca) {
          if (sinCorregir.visionCerca.od) {
            doc.text(sinCorregir.visionCerca.od.toUpperCase(), xVisionCercaSinCorregirOD, yVisionCercaSinCorregirOD);
          }
          if (sinCorregir.visionCerca.oi) {
            doc.text(sinCorregir.visionCerca.oi.toUpperCase(), xVisionCercaSinCorregirOI, yVisionCercaSinCorregirOI);
          }
        }

        // Visión de Lejos
        if (sinCorregir.visionLejos) {
          if (sinCorregir.visionLejos.od) {
            doc.text(sinCorregir.visionLejos.od.toUpperCase(), xVisionLejosSinCorregirOD, yVisionLejosSinCorregirOD);
          }
          if (sinCorregir.visionLejos.oi) {
            doc.text(sinCorregir.visionLejos.oi.toUpperCase(), xVisionLejosSinCorregirOI, yVisionLejosSinCorregirOI);
          }
        }

      }

      // Renderizar datos - Corregida
      if (examenOjos.corregida) {
        const corregida = examenOjos.corregida;

        // Visión de Cerca
        if (corregida.visionCerca) {
          if (corregida.visionCerca.od) {
            doc.text(corregida.visionCerca.od.toUpperCase(), xVisionCercaCorregidaOD, yVisionCercaCorregidaOD);
          }
          if (corregida.visionCerca.oi) {
            doc.text(corregida.visionCerca.oi.toUpperCase(), xVisionCercaCorregidaOI, yVisionCercaCorregidaOI);
          }
        }

        // Visión de Lejos
        if (corregida.visionLejos) {
          if (corregida.visionLejos.od) {
            doc.text(corregida.visionLejos.od.toUpperCase(), xVisionLejosCorregidaOD, yVisionLejosCorregidaOD);
          }
          if (corregida.visionLejos.oi) {
            doc.text(corregida.visionLejos.oi.toUpperCase(), xVisionLejosCorregidaOI, yVisionLejosCorregidaOI);
          }
        }
      }

      // Visión de Colores (campo único que abarca toda la fila)
      if (examenOjos.visionColores) {
        doc.text(examenOjos.visionColores.toUpperCase(), xVisionColores, yVisionColores, { align: "center" });
      }

      // Renderizar Hallazgos
      if (examenOjos.hallazgos) {
        // Enfermedades Oculares
        if (examenOjos.hallazgos.enfermedadesOculares) {
          doc.setFontSize(9);
          doc.text(examenOjos.hallazgos.enfermedadesOculares.toUpperCase(), xEnfermedadesOculares, yEnfermedadesOculares, { maxWidth: 100 });
        }

        // Reflejos Pupilares
        if (examenOjos.hallazgos.reflejosPupilares) {
          doc.setFontSize(9);
          doc.text(examenOjos.hallazgos.reflejosPupilares.toUpperCase(), xReflejosPupilares, yReflejosPupilares, { maxWidth: 100 });
        }
      }
    }

    // === SECCIÓN: EXAMEN FÍSICO ===
    if (datosFinales.evaluacionMedica) {
      const evaluacion = datosFinales.evaluacionMedica;

      // Posiciones para los hallazgos (los textos "Piel:", "Cabello:" ya están en la imagen)
      const xPielHallazgos = 25;
      const yPielHallazgos = 39;

      const xCabelloHallazgos = 25;
      const yCabelloHallazgos = 50;

      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.setTextColor(0, 0, 0);

      // Solo renderizar los hallazgos (los textos "Piel:", "Cabello:" ya están en la imagen)
      doc.setFont("helvetica", "normal").setFontSize(9);

      // Hallazgos de Piel
      if (evaluacion.examenFisico?.piel) {
        doc.text(evaluacion.examenFisico.piel.toUpperCase(), xPielHallazgos, yPielHallazgos, { maxWidth: 170 });
      }

      // Hallazgos de Cabello
      if (evaluacion.examenFisico?.cabello) {
        doc.text(evaluacion.examenFisico.cabello.toUpperCase(), xCabelloHallazgos, yCabelloHallazgos, { maxWidth: 170 });
      }
    }

    // === SECCIÓN: EXAMEN FÍSICO POR SISTEMAS ===
    if (datosFinales.examenFisicoSistemas) {
      const sistemas = datosFinales.examenFisicoSistemas;

      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.setTextColor(0, 0, 0);

      // Posiciones para cada sistema (ajustar según la imagen real)
      const posicionesSistemas = [
        { campo: 'oidos', x: 40, y: 104 },
        { campo: 'nariz', x: 40, y: 115 },
        { campo: 'boca', x: 40, y: 126 },
        { campo: 'faringe', x: 40, y: 139 },
        { campo: 'cuello', x: 40, y: 150 },
        { campo: 'aparatoRespiratorio', x: 40, y: 162 },
        { campo: 'aparatoCardiovascular', x: 40, y: 174 },
        { campo: 'aparatoDigestivo', x: 40, y: 186 },
        { campo: 'aparatoGenitourinario', x: 40, y: 198 },
        { campo: 'aparatoLocomotor', x: 40, y: 210 },
        { campo: 'sistemaLinfatico', x: 40, y: 222 },
        { campo: 'marcha', x: 40, y: 234 },
        { campo: 'columna', x: 40, y: 245 },
        { campo: 'miembrosSuperiores', x: 40, y: 258 },
        { campo: 'miembrosInferiores', x: 40, y: 270 },
        { campo: 'sistemaNervioso', x: 40, y: 281 }
      ];

      // Renderizar cada sistema
      posicionesSistemas.forEach(({ campo, x, y }) => {
        if (sistemas[campo]) {
          doc.text(sistemas[campo].toUpperCase(), x, y, { maxWidth: 160, lineHeightFactor: 0.9 });
        }
      });
    }


    // === PÁGINA 3 ===
    doc.addPage();

    // === 0) HEADER para Página 3 ===
    headerAnexo2(doc, data, 3);

    // === 1) Imagen de fondo para Anexo2 - Página 3 ===
    const fondoImg3 = "/img/Anexo2/Pag3_anexo2.png";

    // Márgenes de 8mm a cada lado (usar la misma variable de las páginas anteriores)
    const margenLateral3 = 8; // 8mm

    // Usar el ancho del documento menos los márgenes laterales
    const imgWidth3 = pageW - (margenLateral3 * 2); // Ancho menos márgenes
    const imgHeight3 = pageH * 0.9; // 90% de la altura para dejar espacio para ajustar

    // Posicionar desde abajo hacia arriba con márgenes laterales
    const xOffset3 = margenLateral3; // Margen izquierdo
    const yOffset3 = pageH - imgHeight3 - 8; // Subido 5 puntos hacia arriba

    try {
      doc.addImage(fondoImg3, "PNG", xOffset3, yOffset3, imgWidth3, imgHeight3);
    } catch (e) {
      doc.text("Imagen de Anexo2 Página 3 no disponible", margin, yOffset3 + 10);
    }

    // === 2) CAMPOS DE DATOS PARA PÁGINA 3 - CONCLUSIONES Y FIRMAS ===

    // === SECCIÓN: CONCLUSIONES Y DIAGNÓSTICOS ===
    if (datosFinales.conclusiones) {
      const conclusiones = datosFinales.conclusiones;

      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.setTextColor(0, 0, 0);

      // Posiciones para cada sección de conclusiones (ajustar según la imagen real)
      const posicionesConclusiones = [
        // VI. CONCLUSIONES DE EVALUACIÓN PSICOLÓGICA (ancho completo)
        { campo: 'conclusionesEvaluacionPsicologica', x: 12, y: 32, maxWidth: 170 },

        // VII. CONCLUSIONES RADIOGRÁFICAS (mitad izquierda)
        { campo: 'conclusionesRadiograficas', x: 12, y: 67, maxWidth: 100 },

        // VIII. HALLAZGOS PATOLÓGICOS DE LABORATORIO (mitad derecha)
        { campo: 'hallazgosPatologicosLaboratorio', x: 110, y: 67, maxWidth: 100 },

        // IX. CONCLUSIÓN AUDIOMETRÍA (mitad izquierda)
        { campo: 'conclusionAudiometria', x: 12, y: 100, maxWidth: 100 },

        // X. CONCLUSIÓN DE ESPIROMETRÍA (mitad derecha)
        { campo: 'conclusionEspirometria', x: 110, y: 100, maxWidth: 100 },

        // XI. OTROS (ancho completo)
        { campo: 'otros', x: 12, y: 133, maxWidth: 170 },

        // XII. DIAGNÓSTICO MÉDICO OCUPACIONAL Y RECOMENDACIONES (ancho completo)
        { campo: 'diagnosticoMedicoOcupacional', x: 12, y: 180, maxWidth: 170 }
      ];

      // Renderizar cada conclusión
      posicionesConclusiones.forEach(({ campo, x, y, maxWidth }) => {
        if (conclusiones[campo]) {
          // Solo manejar listas para campos específicos que lo necesiten
          let texto = conclusiones[campo];

          // Campos que SÍ necesitan conversión de listas a texto con comas
          const camposConListas = ['conclusionesEvaluacionPsicologica', 'conclusionesRadiograficas', 'hallazgosPatologicosLaboratorio', 'conclusionAudiometria', 'conclusionEspirometria'];

          if (camposConListas.includes(campo)) {
            if (Array.isArray(conclusiones[campo])) {
              texto = conclusiones[campo].join(", ");
            } else if (typeof texto === 'string') {
              // Si es string pero tiene saltos de línea, reemplazarlos por comas
              texto = texto.replace(/\n/g, ", ");
            }
          }
          // Para 'otros' y 'diagnosticoMedicoOcupacional' mantener el formato original

          doc.text(texto.toUpperCase(), x, y, { maxWidth, lineHeightFactor: 1 });
        }
      });
    }

    // === SECCIÓN: XIII - CONCLUSIONES FINALES ===
    if (datosFinales.conclusionesFinales) {
      const conclusionesFinales = datosFinales.conclusionesFinales;

      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.setTextColor(0, 0, 0);

      // Posiciones para checkboxes de aptitud
      const xApto = 36;
      const yApto = 267.5;
      const xAptoConRestriccion = 36;
      const yAptoConRestriccion = 276;
      const xNoApto = 36;
      const yNoApto = 284;

      // Posición para campo de restricciones
      const xRestricciones = 47;
      const yRestricciones = 266;

      // Posiciones para la firma del médico
      const xFirmaMedico = 120;
      const yFirmaMedico = 260;

      // Posiciones para la firma del paciente
      const xFirmaPaciente = 158;
      const yFirmaPaciente = 260;

      // Posiciones para la huella del paciente
      const xHuellaPaciente = 194;
      const yHuellaPaciente = 260;

      // Renderizar checkboxes de aptitud
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(12);

      if (conclusionesFinales.apto) {
        doc.text("X", xApto, yApto);
      }
      if (conclusionesFinales.aptoConRestriccion) {
        doc.text("X", xAptoConRestriccion, yAptoConRestriccion);
      }
      if (conclusionesFinales.noApto) {
        doc.text("X", xNoApto, yNoApto);
      }

      doc.setTextColor(0, 0, 0); // Resetear a negro
      doc.setFont("helvetica", "normal").setFontSize(9);

      // Renderizar campo de restricciones
      if (conclusionesFinales.restricciones) {
        doc.text(conclusionesFinales.restricciones.toUpperCase(), xRestricciones, yRestricciones, { maxWidth: 70 });
      }

      // Renderizar firmas
      if (conclusionesFinales.firmaMedico) {
        try {
          doc.addImage(conclusionesFinales.firmaMedico, "PNG", xFirmaMedico, yFirmaMedico, 40, 20);
        } catch (e) {
          console.error("Error al cargar firma del médico:", e);
        }
      }

      // Firma del paciente
      if (conclusionesFinales.firmaPaciente) {
        try {
          doc.addImage(conclusionesFinales.firmaPaciente, "PNG", xFirmaPaciente, yFirmaPaciente, 40, 20);
        } catch (e) {
          console.error("Error al cargar firma del paciente:", e);
        }
      }

      // Huella del paciente
      if (conclusionesFinales.huellaPaciente) {
        try {
          doc.addImage(conclusionesFinales.huellaPaciente, "PNG", xHuellaPaciente, yHuellaPaciente, 15, 25);
        } catch (e) {
          console.error("Error al cargar huella del paciente:", e);
        }
      }
    }

    imprimir(doc);
  });
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

function agregarFirmas(doc, digitalizacion = [], firmasAPintar = []) {
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagenUrl;
      img.onload = () => {
        const sigH = 35; // alto máximo
        const maxW = maxw; // ancho máximo como parámetro
        const baseX = x;
        const baseY = y;

        let imgW = img.width;
        let imgH = img.height;

        // Escala proporcional en base a ancho y alto máximos
        const scale = Math.min(maxW / imgW, sigH / imgH, 1);
        imgW *= scale;
        imgH *= scale;

        // Ahora el ancho se adapta
        const sigW = imgW;

        // Centrar la imagen
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;

        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve();
      };
      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve();
      };
    });
  };

  const firmas = digitalizacion.reduce(
    (acc, d) => ({ ...acc, [d.nombreDigitalizacion]: d.url }),
    {}
  );

  const promesasFirmas = firmasAPintar
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  return Promise.all(promesasFirmas);
}
