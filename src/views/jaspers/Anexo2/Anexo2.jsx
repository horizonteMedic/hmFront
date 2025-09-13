import jsPDF from "jspdf";
import headerAnexo2 from "./Headers/Header_Anexo2.jsx";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";

export default function Anexo2(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 0; // Sin márgenes
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba para los campos de Anexo2
  const datosPrueba = {
    // === INFORMACIÓN GENERAL ===
    numeroOrden: "96639",
    tipoEvaluacion: {
      preOcupacional: false,
      anual: true,
      retiro: false,
      otros: false
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
        no: false
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
      lesionesMusculares: {
        asociadoTrabajo: { si: true, no: true },
        año: "2023",
        diasDescanso: "15"
      },
      lesionActualizada: {
        asociadoTrabajo: { si: true, no: true },
        año: "2024",
        diasDescanso: "5"
      }
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
        conclusionesRadiograficas: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP.",
      
      // VIII. HALLAZGOS PATOLÓGICOS DE LABORATORIO
      hallazgosPatologicosLaboratorio: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP.",
      
      // IX. CONCLUSIÓN AUDIOMETRÍA
      conclusionAudiometria: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP.",
      
      // X. CONCLUSIÓN DE ESPIROMETRÍA
      conclusionEspirometria: "TRAMA BRONCOVASCULAR ACENTUADA EN ACP.",
      
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
      preOcupacional: data.nombreExamen_nom_examen=="PRE-OCUPACIONAL" ?? false, 
      anual: data.nombreExamen_nom_examen=="ANUAL" ?? false,
      retiro: data.nombreExamen_nom_examen=="RETIRO" ?? false,
      otros: data.nombreExamen_nom_examen!="PRE-OCUPACIONAL" && data.nombreExamen_nom_examen!="ANUAL" && data.nombreExamen_nom_examen!="RETIRO" 
    },
    fechaExamen: formatearFechaCorta(data.fechaAnexo_fecha ?? ""), //agregar formateo
    lugarExamen: {
      departamento: data.departamentoPaciente_departamento_pa ?? "",//revisar pedir
      provincia: data.provinciaPaciente_provincia_pa ?? "",//revisar pedir
      distrito: data.distritoPaciente_distrito_pa ?? ""//revisar pedir
    },
    
    // === DATOS DE LA EMPRESA ===
    datosEmpresa: {
      contrata: data.contrata_razon_contrata ?? "",
      empresa: data.empresa_razon_empresa ?? "",
      actividadEconomica: "",
      lugarTrabajo:  ""
    },
    
    // === UBICACIÓN Y PUESTO ===
    ubicacion: {
      departamento:  "",
      provincia: "",
      distrito: ""
    },
    puestoPostula: data.cargo_cargo_de ?? "",
    
    // === II. FILIACIÓN DEL TRABAJADOR ===
    filiacionTrabajador: {
      nombresApellidos: (data.nombres_nombres_pa ?? "") + " " + (data.apellidos_apellidos_pa ?? ""),
      fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente_fecha_nacimiento_pa ?? ""), //agregar formateo
      edad: (data.edad_fecha_nacimiento_pa ?? "")+" años",
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
      alergias: { si: data.alergiasSi ?? false, no: data.alergiasNo ?? false },//revisar pedir
      asma: { si: data.asmaSi ?? false, no: data.asmaNo ?? false },//revisar pedir
      bronquitis: { si: data.bronquitisSi ?? false, no: data.bronquitisNo ?? false },//revisar pedir
      quemaduras: { si: data.quemaduras_chkquemaduras ?? false, no: !data.quemaduras_chkquemaduras ?? true },
      cirugias: { si: data.cirugias_chkcirugias ?? false, no: !data.cirugias_chkcirugias ?? true },
      
      // Condiciones médicas - Columna 2 (Centro)
      tbc: { si: data.tbcSi ?? false, no: data.tbcNo ?? false }, //revisar pedir
      its: { si: data.its_chkits ?? false, no: !data.its_chkits ?? true },
      convulsiones: { si: data.convulsionesSi ?? false, no: data.convulsionesNo ?? false },//revisar pedir
      neoplasia: { si: data.neoplasia_chkneoplasia ?? false, no: !data.neoplasia_chkneoplasia ?? true },
      intoxicaciones: { si: data.intoxicacionesSi ?? false, no: data.intoxicacionesNo ?? false },//revisar pedir
      
      // Condiciones médicas - Columna 3 (Derecha)
      hepatitis: { si: data.hepatitisSi ?? false, no: data.hepatitisNo ?? false },//revisar pedir
      tifoidea: { si: data.tifoideaSi ?? false, no: data.tifoideaNo ?? false },//revisar pedir
      hta: { si: data.htaSi ?? false, no: data.htaNo ?? false },//revisar pedir
      diabetes: { si: data.diabetesSi ?? false, no: data.diabetesNo ?? false },//revisar pedir
      otros: { si: data.antecedentesPersonalesOtros_chkapotros ?? false, no: !data.antecedentesPersonalesOtros_chkapotros ?? true },
      
      // Hábitos Nocivos
      habitosNocivos: {
        alcohol: { si: data.alcoholSi ?? false, no: data.alcoholNo ?? false, tipo: data.alcoholTipo ?? "", cantidad: data.alcoholCantidad ?? "" },//revisar pedir
        tabaco: { si: data.tabacoSi ?? false, no: data.tabacoNo ?? false, tipo: data.tabacoTipo ?? "", cantidad: data.tabacoCantidad ?? "" },//revisar pedir
        drogas: { si: data.drogasSi ?? false, no: data.drogasNo ?? false, tipo: data.drogasTipo ?? "", cantidad: data.drogasCantidad ?? "" },//revisar pedir
        medicamento: { si: data.medicamentosSi_rbsimed ?? false, no: data.medicamentosNo_rbnomed ?? false, tipo: data.tipoMedicamento_txttipomedicamento ?? "", cantidad: data.frecuenciaMedicamentos_txtfrecuenciamed ?? "" }
      }
    },
    
    // === IV. ANTECEDENTES PATOLÓGICOS FAMILIARES ===
    antecedentesFamiliares: {
      padre: data.padre_txtpadre ?? "",
      madre: data.madre_txtmadre ?? "",
      hermanos: data.hermanos_txthermanos ?? "",
      esposa: data.esposa_txtesposa ?? "",
      hijosVivos: String(data.hijosVivosAntecedentesPatologicos_txtvhijosvivos ?? ""),
      numeroHijos: String(data.hijosFallecidosAntecedentesPatologicos_txtvhijosfallecidos ?? "")
    },
    
    // === ABSENTISMO ===
    absentismo: { //revisar deberia ser una tabla
      lesionesMusculares: {
        asociadoTrabajo: { si: data.lesionesMuscularesSi ?? false, no: data.lesionesMuscularesNo ?? false },
        año: data.lesionesMuscularesAno ?? "",
        diasDescanso: data.lesionesMuscularesDias ?? ""
      },
      lesionActualizada: {
        asociadoTrabajo: { si: data.lesionActualizadaSi ?? false, no: data.lesionActualizadaNo ?? false },
        año: data.lesionActualizadaAno ?? "",
        diasDescanso: data.lesionActualizadaDias ?? ""
      }
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
        otros: data.otrosExamenes_txtotrosex ?? ""
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
      firmaMedico: data.firmaMedico ?? "/img/firmas_sellos_prueba/firma_sello.png",
      huellaPaciente: data.huellaPaciente ?? "/img/firmas_sellos_prueba/HUELLA_DIGITAL.png",
      firmaPaciente: data.firmaPaciente ?? "/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png"
    }
  };

  // Usar datos reales o datos de prueba
  const datosFinales = data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

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
  doc.setFont("helvetica", "bold").setFontSize(10);

  // === SECCIÓN: INFORMACIÓN GENERAL ===
  // Número de Orden
  const xNumeroOrden = 25; // Posición X para número de orden
  const yNumeroOrden = 26; // Posición Y para número de orden (subido 5 puntos)
  
  // Tipo de Evaluación - Posiciones X para checkboxes
  const xTipoPreOcupacional = 78.5; // Posición X para PRE-OCUPACIONAL
  const yTipoPreOcupacional = 31.2; // Posición Y para PRE-OCUPACIONAL (subido 5 puntos)
  
  const xTipoAnual = 110; // Posición X para ANUAL
  const yTipoAnual = 31.2; // Posición Y para ANUAL (subido 5 puntos)

  const xTipoRetiro = 145.5; // Posición X para RETIRO
  const yTipoRetiro = 31.2; // Posición Y para RETIRO (subido 5 puntos)

  const xTipoOtros = 179.3; // Posición X para OTROS
  const yTipoOtros = 31.2; // Posición Y para OTROS (subido 5 puntos)
  
  // Fecha de Examen
  const xFechaExamen = 135; // Posición X para fecha de examen
  const yFechaExamen = 26; // Posición Y para fecha de examen (subido 5 puntos)
  
  // Lugar de Examen
  const xLugarDepartamento = 57; // Posición X para departamento
  const yLugarDepartamento = 36.2; // Posición Y para departamento
  const xLugarProvincia = 119; // Posición X para provincia
  const yLugarProvincia = 36.2; // Posición Y para provincia
  const xLugarDistrito = 175; // Posición X para distrito
  const yLugarDistrito = 36.2; // Posición Y para distrito

  // Información General
  // Número de Orden
  if (datosFinales.numeroOrden) {
    doc.setFont("helvetica", "normal").setFontSize(13);
    doc.text(datosFinales.numeroOrden, xNumeroOrden, yNumeroOrden);
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
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text(datosFinales.fechaExamen, xFechaExamen, yFechaExamen);
  }
  
  // Lugar de Examen
  if (datosFinales.lugarExamen) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    if (datosFinales.lugarExamen.departamento) {
      doc.text(datosFinales.lugarExamen.departamento, xLugarDepartamento, yLugarDepartamento);
    }
    if (datosFinales.lugarExamen.provincia) {
      doc.text(datosFinales.lugarExamen.provincia, xLugarProvincia, yLugarProvincia);
    }
    if (datosFinales.lugarExamen.distrito) {
      doc.text(datosFinales.lugarExamen.distrito, xLugarDistrito, yLugarDistrito);
    }
  }

  // === SECCIÓN: I. DATOS DE LA EMPRESA ===
  // Posiciones para datos de la empresa
  const xContrata = 25; // Posición X para contrata
  const yContrata = 47; // Posición Y para contrata
  const xEmpresa = 25; // Posición X para empresa
  const yEmpresa = 52; // Posición Y para empresa
  const xActividadEconomica = 35; // Posición X para actividad económica
  const yActividadEconomica = 57; // Posición Y para actividad económica
  const xLugarTrabajo = 35; // Posición X para lugar de trabajo
  const yLugarTrabajo = 62; // Posición Y para lugar de trabajo

  // Datos de la Empresa
  if (datosFinales.datosEmpresa) {
    const empresa = datosFinales.datosEmpresa;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Contrata
    if (empresa.contrata) {
      doc.text(empresa.contrata, xContrata, yContrata);
    }
    
    // Empresa
    if (empresa.empresa) {
      doc.text(empresa.empresa, xEmpresa, yEmpresa);
    }
    
    // Actividad Económica
    if (empresa.actividadEconomica) {
      doc.text(empresa.actividadEconomica, xActividadEconomica, yActividadEconomica);
    }
    
    // Lugar de trabajo
    if (empresa.lugarTrabajo) {
      doc.text(empresa.lugarTrabajo, xLugarTrabajo, yLugarTrabajo);
    }
  }

  // === SECCIÓN: UBICACIÓN Y PUESTO ===
  // Posiciones para ubicación
  const xUbicacionDepartamento = 57; // Posición X para departamento
  const yUbicacionDepartamento = 68; // Posición Y para departamento
  const xUbicacionProvincia = 119; // Posición X para provincia
  const yUbicacionProvincia = 68; // Posición Y para provincia
  const xUbicacionDistrito = 175; // Posición X para distrito
  const yUbicacionDistrito = 68; // Posición Y para distrito
  
  // Posición para puesto a que postula
  const xPuestoPostula = 69; // Posición X para puesto a que postula
  const yPuestoPostula = 73; // Posición Y para puesto a que postula

  // Ubicación
  if (datosFinales.ubicacion) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    if (datosFinales.ubicacion.departamento) {
      doc.text(datosFinales.ubicacion.departamento, xUbicacionDepartamento, yUbicacionDepartamento);
    }
    if (datosFinales.ubicacion.provincia) {
      doc.text(datosFinales.ubicacion.provincia, xUbicacionProvincia, yUbicacionProvincia);
    }
    if (datosFinales.ubicacion.distrito) {
      doc.text(datosFinales.ubicacion.distrito, xUbicacionDistrito, yUbicacionDistrito);
    }
  }
  
  // Puesto a que postula - Solo si es PRE-OCUPACIONAL
  if (datosFinales.tipoEvaluacion?.preOcupacional && datosFinales.puestoPostula) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(datosFinales.puestoPostula, xPuestoPostula, yPuestoPostula);
  }

  // === SECCIÓN: II. FILIACIÓN DEL TRABAJADOR ===
  if (datosFinales.filiacionTrabajador) {
    const filiacion = datosFinales.filiacionTrabajador;
    
    // Posiciones para filiación del trabajador
    const xNombresApellidos = 35;
    const yNombresApellidos = 84.2;
    const xFechaNacimiento = 128;
    const yFechaNacimiento = 84.2;
    const xEdad = 173;
    const yEdad = 84.2;
    
    const xDomicilioFiscal = 32;
    const yDomicilioFiscal = 89.7;
    const xDni = 173;
    const yDni = 89.7;
    
    const xUbicacionDept = 57;
    const yUbicacionDept = 95;
    const xUbicacionProv = 119;
    const yUbicacionProv = 95;
    const xUbicacionDist = 175;
    const yUbicacionDist = 95;
    
    const xResidenciaSi = 81;
    const yResidenciaSi = 100.5;
    const xResidenciaNo = 106.3;
    const yResidenciaNo = 100.5;
    const xTiempoResidencia = 160;
    const yTiempoResidencia = 100.2;
    
    const xEssalud = 38;
    const yEssalud = 105.8;
    const xEps = 75;
    const yEps = 105.8;
    const xOtro1 = 115;
    const yOtro1 = 105.8;
    const xSctr = 155;
    const ySctr = 105.8;
    const xOtro2 = 195;
    const yOtro2 = 105.8;
    
    const xCorreo = 35;
    const yCorreo = 110.5;
    const xTelefono = 108;
    const yTelefono = 110.5;
    const xGradoInstruccion = 165;
    const yGradoInstruccion = 110.5;
    
    const xEstadoCivil = 25;
    const yEstadoCivil = 115.8;
    const xTotalHijos = 90;
    const yTotalHijos = 115.8;
    const xDependientes =  170;
    const yDependientes = 115.8;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Nombres y Apellidos
    if (filiacion.nombresApellidos) {
      doc.text(filiacion.nombresApellidos, xNombresApellidos, yNombresApellidos);
    }
    
    // Fecha de Nacimiento
    if (filiacion.fechaNacimiento) {
      doc.text(filiacion.fechaNacimiento, xFechaNacimiento, yFechaNacimiento);
    }
    
    // Edad
    if (filiacion.edad) {
      doc.text(`${filiacion.edad} Años`, xEdad, yEdad);
    }
    
    // Domicilio Fiscal
    if (filiacion.domicilioFiscal) {
      doc.text(filiacion.domicilioFiscal, xDomicilioFiscal, yDomicilioFiscal);
    }
    
    // DNI
    if (filiacion.dni) {
      doc.text(filiacion.dni, xDni, yDni);
    }
    
    // Ubicación
    if (filiacion.ubicacion) {
      if (filiacion.ubicacion.departamento) {
        doc.text(filiacion.ubicacion.departamento, xUbicacionDept, yUbicacionDept);
      }
      if (filiacion.ubicacion.provincia) {
        doc.text(filiacion.ubicacion.provincia, xUbicacionProv, yUbicacionProv);
      }
      if (filiacion.ubicacion.distrito) {
        doc.text(filiacion.ubicacion.distrito, xUbicacionDist, yUbicacionDist);
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
      doc.setFont("helvetica", "normal").setFontSize(10);
    }
    
    // Tiempo de residencia
    if (filiacion.tiempoResidencia) {
      doc.text(filiacion.tiempoResidencia, xTiempoResidencia, yTiempoResidencia);
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
      doc.setFont("helvetica", "normal").setFontSize(10);
    }
    
    // Contacto
    if (filiacion.contacto) {
      if (filiacion.contacto.correoElectronico) {
        doc.text(filiacion.contacto.correoElectronico, xCorreo, yCorreo);
      }
      if (filiacion.contacto.telefono) {
        doc.text(filiacion.contacto.telefono, xTelefono, yTelefono);
      }
      if (filiacion.contacto.gradoInstruccion) {
        doc.text(filiacion.contacto.gradoInstruccion, xGradoInstruccion, yGradoInstruccion);
      }
    }
    
    // Estado Civil
    if (filiacion.estadoCivil) {
      doc.text(filiacion.estadoCivil, xEstadoCivil, yEstadoCivil);
    }
    
    // Total de hijos
    if (filiacion.totalHijos) {
      doc.text(filiacion.totalHijos, xTotalHijos, yTotalHijos);
    }
    
    // Dependientes
    if (filiacion.dependientes) {
      doc.text(filiacion.dependientes, xDependientes, yDependientes);
    }
  }

  // === SECCIÓN: III. ANTECEDENTES PATOLÓGICOS PERSONALES ===
  if (datosFinales.antecedentesPatologicos) {
    const antecedentes = datosFinales.antecedentesPatologicos;
    
    // Posiciones para condiciones médicas - Columna 1 (Izquierda)
    const xAlergiasSi = 32;
    const yAlergiasSi = 132.8;
    const xAlergiasNo = 37.5;
    const yAlergiasNo = 132.8;
    
    const xAsmaSi = 32;
    const yAsmaSi = 138;
    const xAsmaNo = 37.5;
    const yAsmaNo = 138;
    
    const xBronquitisSi = 32;
    const yBronquitisSi = 143.2;
    const xBronquitisNo = 37.5;
    const yBronquitisNo = 143.2;
    
    const xQuemadurasSi = 32;
    const yQuemadurasSi = 148.4;
    const xQuemadurasNo = 37.5;
    const yQuemadurasNo = 148.4;
    
    const xCirugiasSi = 32;
    const yCirugiasSi = 153.6;
    const xCirugiasNo = 37.5;
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
    const xHepatitisSi = 156.5;
    const yHepatitisSi = 132.8;
    const xHepatitisNo = 161.8;
    const yHepatitisNo = 132.8;
    
    const xTifoideaSi = 156.5;
    const yTifoideaSi = 138;
    const xTifoideaNo = 161.8;
    const yTifoideaNo = 138;
    
    const xHtaSi = 156.5;
    const yHtaSi = 143.2;
    const xHtaNo = 161.8;
    const yHtaNo = 143.2;
    
    const xDiabetesSi = 156.5;
    const yDiabetesSi = 148.4;
    const xDiabetesNo = 161.8;
    const yDiabetesNo = 148.4;
    
    const xOtrosSi = 156.5;
    const yOtrosSi = 153.6;
    const xOtrosNo = 161.8;
    const yOtrosNo = 153.6;
    
    // Posiciones para Hábitos Nocivos
    // Alcohol
    const xAlcoholSi = 32;
    const yAlcoholSi = 164.4;
    const xAlcoholNo = 37.5;
    const yAlcoholNo = 164.4;

    const xAlcoholTipo = 46;
    const yAlcoholTipo = 164.2;

    const xAlcoholCantidad = 108;
    const yAlcoholCantidad = 164.2;
    
    // Tabaco
    const xTabacoSi = 32;
    const yTabacoSi = 169.8;
    const xTabacoNo = 37.5;
    const yTabacoNo = 169.8;

    const xTabacoTipo = 46;
    const yTabacoTipo = 169.6;

    const xTabacoCantidad = 108;
    const yTabacoCantidad = 169.6;
    
    // Drogas
    const xDrogasSi = 32;
    const yDrogasSi = 175.2;
    const xDrogasNo = 37.5;
    const yDrogasNo = 175.2;

    const xDrogasTipo = 46;
    const yDrogasTipo = 175;

    const xDrogasCantidad = 108;
    const yDrogasCantidad = 175;
    
    // Medicamento
    const xMedicamentoSi = 32;
    const yMedicamentoSi = 180.6;
    const xMedicamentoNo = 37.5;
    const yMedicamentoNo = 180.6;
    
    const xMedicamentoTipo = 46;
    const yMedicamentoTipo = 180.4;

    const xMedicamentoCantidad = 108;
    const yMedicamentoCantidad = 180.4;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
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
      doc.setFont("helvetica", "normal").setFontSize(10);
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
          doc.text(antecedentes.habitosNocivos.alcohol.tipo, xAlcoholTipo, yAlcoholTipo);
        }
        if (antecedentes.habitosNocivos.alcohol.cantidad) {
          doc.text(antecedentes.habitosNocivos.alcohol.cantidad, xAlcoholCantidad, yAlcoholCantidad);
        }
      }
      
      // Tabaco - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.tabaco) {
        renderCheckbox(antecedentes.habitosNocivos.tabaco, xTabacoSi, yTabacoSi, xTabacoNo, yTabacoNo);
        if (antecedentes.habitosNocivos.tabaco.tipo) {
          doc.text(antecedentes.habitosNocivos.tabaco.tipo, xTabacoTipo, yTabacoTipo);
        }
        if (antecedentes.habitosNocivos.tabaco.cantidad) {
          doc.text(antecedentes.habitosNocivos.tabaco.cantidad, xTabacoCantidad, yTabacoCantidad);
        }
      }
      
      // Drogas - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.drogas) {
        renderCheckbox(antecedentes.habitosNocivos.drogas, xDrogasSi, yDrogasSi, xDrogasNo, yDrogasNo);
        if (antecedentes.habitosNocivos.drogas.tipo) {
          doc.text(antecedentes.habitosNocivos.drogas.tipo, xDrogasTipo, yDrogasTipo);
        }
        if (antecedentes.habitosNocivos.drogas.cantidad) {
          doc.text(antecedentes.habitosNocivos.drogas.cantidad, xDrogasCantidad, yDrogasCantidad);
        }
      }
      
      // Medicamento - Checkbox + campos de texto
      if (antecedentes.habitosNocivos.medicamento) {
        renderCheckbox(antecedentes.habitosNocivos.medicamento, xMedicamentoSi, yMedicamentoSi, xMedicamentoNo, yMedicamentoNo);
        if (antecedentes.habitosNocivos.medicamento.tipo) {
          doc.text(antecedentes.habitosNocivos.medicamento.tipo, xMedicamentoTipo, yMedicamentoTipo);
        }
        if (antecedentes.habitosNocivos.medicamento.cantidad) {
          doc.text(antecedentes.habitosNocivos.medicamento.cantidad, xMedicamentoCantidad, yMedicamentoCantidad);
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

    const xMadre = 100;
    const yMadre = 190;

    const xHermanos = 170;
    const yHermanos = 190;
    
    const xEsposa = 25;
    const yEsposa = 196;

    const xHijosVivos = 100;
    const yHijosVivos = 196;

    const xNumeroHijos = 170;
    const yNumeroHijos = 196;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Padre
    if (familia.padre) {
      doc.text(familia.padre, xPadre, yPadre);
    }
    
    // Madre
    if (familia.madre) {
      doc.text(familia.madre, xMadre, yMadre);
    }
    
    // Hermanos
    if (familia.hermanos) {
      doc.text(familia.hermanos, xHermanos, yHermanos);
    }
    
    // Esposa
    if (familia.esposa) {
      doc.text(familia.esposa, xEsposa, yEsposa);
    }
    
    // Hijos vivos
    if (familia.hijosVivos) {
      doc.text(familia.hijosVivos, xHijosVivos, yHijosVivos);
    }
    
    // Número de hijos
    if (familia.numeroHijos) {
      doc.text(familia.numeroHijos, xNumeroHijos, yNumeroHijos);
    }
  }

  // === SECCIÓN: ABSENTISMO ===
  if (datosFinales.absentismo) {
    const absentismo = datosFinales.absentismo;
    
    // Posiciones para absentismo
    const xLesionesMuscularesSi = 107.8;
    const yLesionesMuscularesSi = 214.6;

    const xLesionesMuscularesNo = 126;
    const yLesionesMuscularesNo =  214.6;
    
    const xLesionesMuscularesAno = 143;
    const yLesionesMuscularesAno =  214.6;
    
    const xLesionesMuscularesDias = 181.5;
    const yLesionesMuscularesDias =  214.6;
    
    const xLesionActualizadaSi = 107.8;
    const yLesionActualizadaSi = 220;

    const xLesionActualizadaNo = 126;
    const yLesionActualizadaNo = 220;

    const xLesionActualizadaAno = 143;
    const yLesionActualizadaAno = 220;

    const xLesionActualizadaDias = 181.5;
    const yLesionActualizadaDias = 220;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Lesiones Musculares
    if (absentismo.lesionesMusculares) {
      const lesion = absentismo.lesionesMusculares;
      
      // Checkbox SI/NO
      if (lesion.asociadoTrabajo) {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(12);
        
        if (lesion.asociadoTrabajo.si) {
          doc.text("X", xLesionesMuscularesSi, yLesionesMuscularesSi);
        }
        if (lesion.asociadoTrabajo.no) {
          doc.text("X", xLesionesMuscularesNo, yLesionesMuscularesNo);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
        doc.setFont("helvetica", "normal").setFontSize(10);
      }
      
      // Año
      if (lesion.año) {
        doc.text(lesion.año, xLesionesMuscularesAno, yLesionesMuscularesAno);
      }
      
      // Días de descanso
      if (lesion.diasDescanso) {
        doc.text(lesion.diasDescanso, xLesionesMuscularesDias, yLesionesMuscularesDias, { align: "center" });
      }
    }
    
    // Lesión Actualizada
    if (absentismo.lesionActualizada) {
      const lesion = absentismo.lesionActualizada;
      
      // Checkbox SI/NO
      if (lesion.asociadoTrabajo) {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(12);
        
        if (lesion.asociadoTrabajo.si) {
          doc.text("X", xLesionActualizadaSi, yLesionActualizadaSi);
        }
        if (lesion.asociadoTrabajo.no) {
          doc.text("X", xLesionActualizadaNo, yLesionActualizadaNo);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
        doc.setFont("helvetica", "normal").setFontSize(10);
      }
      
      // Año
      if (lesion.año) {
        doc.text(lesion.año, xLesionActualizadaAno, yLesionActualizadaAno);
      }
      
      // Días de descanso
      if (lesion.diasDescanso) {
        doc.text(lesion.diasDescanso, xLesionActualizadaDias, yLesionActualizadaDias, { align: "center" });
      }
    }
  }

  // === SECCIÓN: V. EVALUACIÓN MÉDICA ===
  if (datosFinales.evaluacionMedica) {
    const evaluacion = datosFinales.evaluacionMedica;
    
    // Posiciones para evaluación médica
    const xAnamnesis = 25;
    const yAnamnesis = 230.5;
    
    // Examen clínico - Fila 1
    const xTalla = 48;
    const yTalla = 239;
    const xPeso = 95;
    const yPeso = 239;
    const xImc = 135;
    const yImc = 239;
    const xPulso = 180;
    const yPulso = 239;
    
    // Examen clínico - Fila 2
    const xFrecuenciaRespiratoria = 48;
    const yFrecuenciaRespiratoria = 244.3;
    const xFrecuenciaCardiaca = 95;
    const yFrecuenciaCardiaca = 244.3;
    const xPresionArterial = 135;
    const yPresionArterial = 244.3;
    const xTemperatura = 189;
    const yTemperatura = 244.3;
    
    // Examen clínico - Fila 3
    const xOtros = 48;
    const yOtros = 249.5;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Anamnesis
    if (evaluacion.anamnesis) {
      doc.text(evaluacion.anamnesis, xAnamnesis, yAnamnesis, { maxWidth: 170 });
    }
    
    // Examen clínico
    if (evaluacion.examenClinico) {
      const examen = evaluacion.examenClinico;
      
      // Fila 1
      if (examen.talla) {
        doc.text(examen.talla, xTalla, yTalla);
      }
      if (examen.peso) {
        doc.text(examen.peso, xPeso, yPeso);
      }
      if (examen.imc) {
        doc.text(examen.imc, xImc, yImc);
      }
      if (examen.pulso) {
        doc.text(examen.pulso, xPulso, yPulso);
      }
      
      // Fila 2
      if (examen.frecuenciaRespiratoria) {
        doc.text(examen.frecuenciaRespiratoria, xFrecuenciaRespiratoria, yFrecuenciaRespiratoria);
      }
      if (examen.frecuenciaCardiaca) {
        doc.text(examen.frecuenciaCardiaca, xFrecuenciaCardiaca, yFrecuenciaCardiaca);
      }
      if (examen.presionArterial) {
        doc.text(examen.presionArterial, xPresionArterial, yPresionArterial);
      }
      if (examen.temperatura) {
        doc.text(examen.temperatura, xTemperatura, yTemperatura);
      }
      
      // Fila 3
      if (examen.otros) {
        doc.text(examen.otros, xOtros, yOtros);
      }
    }
  }

  // === SECCIÓN: EXAMEN FÍSICO ===
  if (datosFinales.evaluacionMedica) {
    const evaluacion = datosFinales.evaluacionMedica;
    
    // Posiciones para Ectoscopía y Estado Mental
    const xEctoscopia = 25;
    const yEctoscopia = 255;
    const xEstadoMental = 28;
    const yEstadoMental = 262.3;
    
    // Posiciones para la tabla de Examen Físico (solo para referencia, no se usan)
    
    // Posiciones para los hallazgos (los textos "Piel:", "Cabello:" ya están en la imagen)
    const xPielHallazgos = 37;
    const yPielHallazgos = 282;
    
    const xCabelloHallazgos = 37;
    const yCabelloHallazgos = 287;
    
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Ectoscopía
    if (evaluacion.ectoscopia) {
      doc.text(evaluacion.ectoscopia, xEctoscopia, yEctoscopia, { maxWidth: 170 });
    }
    
    // Estado Mental
    if (evaluacion.estadoMental) {
      doc.text(evaluacion.estadoMental, xEstadoMental, yEstadoMental, { maxWidth: 170 });
    }
    
    // Solo renderizar los hallazgos (los textos "Piel:", "Cabello:" ya están en la imagen)
    doc.setFont("helvetica", "normal").setFontSize(10);
    
    // Hallazgos de Piel
    if (evaluacion.examenFisico?.piel) {
      doc.text(evaluacion.examenFisico.piel, xPielHallazgos, yPielHallazgos, { maxWidth: 170 });
    }
    
    // Hallazgos de Cabello
    if (evaluacion.examenFisico?.cabello) {
      doc.text(evaluacion.examenFisico.cabello, xCabelloHallazgos, yCabelloHallazgos, { maxWidth: 170 });
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
      
      doc.setFont("helvetica", "normal").setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // === SECCIÓN: SIN HALLAZGOS - SIN CORREGIR ===
      // Visión de Cerca - Sin Corregir
      const xVisionCercaSinCorregirOD = 37.5; // Posición X para O.D.
      const yVisionCercaSinCorregirOD = 40; // Posición Y para O.D.

      const xVisionCercaSinCorregirOI = 55; // Posición X para O.I.
      const yVisionCercaSinCorregirOI = 40; // Posición Y para O.I.
      
      // Visión de Lejos - Sin Corregir
      const xVisionLejosSinCorregirOD = 37.5;
      const yVisionLejosSinCorregirOD = 45;
      const xVisionLejosSinCorregirOI = 55;
      const yVisionLejosSinCorregirOI = 45;
      
      // === SECCIÓN: SIN HALLAZGOS - CORREGIDA ===
      // Visión de Cerca - Corregida
      const xVisionCercaCorregidaOD = 73; // Posición X para O.D.
      const yVisionCercaCorregidaOD = 40; // Posición Y para O.D.
      const xVisionCercaCorregidaOI = 91.5  ; // Posición X para O.I.
      const yVisionCercaCorregidaOI = 40; // Posición Y para O.I.
      
      // Visión de Lejos - Corregida
      const xVisionLejosCorregidaOD = 73;
      const yVisionLejosCorregidaOD = 45;
      const xVisionLejosCorregidaOI = 91.5;
      const yVisionLejosCorregidaOI = 45;
      
      // Visión de Colores (campo único que abarca toda la fila)
      const xVisionColores = 68; // Centrado en toda la fila
      const yVisionColores = 50;
      
      // === SECCIÓN: HALLAZGOS ===
      // Enfermedades Oculares
      const xEnfermedadesOculares = 110;
      const yEnfermedadesOculares = 35;
      
      // Reflejos Pupilares
      const xReflejosPupilares = 141.5;
      const yReflejosPupilares = 49.5;
      
      // Renderizar datos - Sin Corregir
      if (examenOjos.sinCorregir) {
        const sinCorregir = examenOjos.sinCorregir;
        
        // Visión de Cerca
        if (sinCorregir.visionCerca) {
          if (sinCorregir.visionCerca.od) {
            doc.text(sinCorregir.visionCerca.od, xVisionCercaSinCorregirOD, yVisionCercaSinCorregirOD);
          }
          if (sinCorregir.visionCerca.oi) {
            doc.text(sinCorregir.visionCerca.oi, xVisionCercaSinCorregirOI, yVisionCercaSinCorregirOI);
          }
        }
        
        // Visión de Lejos
        if (sinCorregir.visionLejos) {
          if (sinCorregir.visionLejos.od) {
            doc.text(sinCorregir.visionLejos.od, xVisionLejosSinCorregirOD, yVisionLejosSinCorregirOD);
          }
          if (sinCorregir.visionLejos.oi) {
            doc.text(sinCorregir.visionLejos.oi, xVisionLejosSinCorregirOI, yVisionLejosSinCorregirOI);
          }
        }
        
      }
      
      // Renderizar datos - Corregida
      if (examenOjos.corregida) {
        const corregida = examenOjos.corregida;
        
        // Visión de Cerca
        if (corregida.visionCerca) {
          if (corregida.visionCerca.od) {
            doc.text(corregida.visionCerca.od, xVisionCercaCorregidaOD, yVisionCercaCorregidaOD);
          }
          if (corregida.visionCerca.oi) {
            doc.text(corregida.visionCerca.oi, xVisionCercaCorregidaOI, yVisionCercaCorregidaOI);
          }
        }
        
        // Visión de Lejos
        if (corregida.visionLejos) {
          if (corregida.visionLejos.od) {
            doc.text(corregida.visionLejos.od, xVisionLejosCorregidaOD, yVisionLejosCorregidaOD);
          }
          if (corregida.visionLejos.oi) {
            doc.text(corregida.visionLejos.oi, xVisionLejosCorregidaOI, yVisionLejosCorregidaOI);
          }
        }
      }
      
      // Visión de Colores (campo único que abarca toda la fila)
      if (examenOjos.visionColores) {
        doc.text(examenOjos.visionColores, xVisionColores, yVisionColores, { align: "center" });
      }
      
      // Renderizar Hallazgos
      if (examenOjos.hallazgos) {
        // Enfermedades Oculares
        if (examenOjos.hallazgos.enfermedadesOculares) {
          doc.setFontSize(9);
          doc.text(examenOjos.hallazgos.enfermedadesOculares, xEnfermedadesOculares, yEnfermedadesOculares, { maxWidth: 100 });
        }
        
        // Reflejos Pupilares
        if (examenOjos.hallazgos.reflejosPupilares) {
          doc.setFontSize(9);
          doc.text(examenOjos.hallazgos.reflejosPupilares, xReflejosPupilares, yReflejosPupilares, { maxWidth: 100 });
        }
      }
    }
    
    // === SECCIÓN: EXAMEN FÍSICO POR SISTEMAS ===
    if (datosFinales.examenFisicoSistemas) {
      const sistemas = datosFinales.examenFisicoSistemas;
      
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      // Posiciones para cada sistema (ajustar según la imagen real)
      const posicionesSistemas = [
        { campo: 'oidos', x: 36, y: 54.2},
        { campo: 'nariz', x: 36, y: 59.3 },
        { campo: 'boca', x: 36, y: 64.4 },
        { campo: 'faringe', x: 36, y: 69 },
        { campo: 'cuello', x: 36, y: 73.8 },
        { campo: 'aparatoRespiratorio', x: 36, y: 78.6 },
        { campo: 'aparatoCardiovascular', x: 36, y: 86 },
        { campo: 'aparatoDigestivo', x: 36, y: 94 },
        { campo: 'aparatoGenitourinario', x: 36, y: 102 },
        { campo: 'aparatoLocomotor', x: 36, y: 109.3 },
        { campo: 'sistemaLinfatico', x: 36, y: 114.2 },
        { campo: 'marcha', x: 36, y: 119 },
        { campo: 'columna', x: 36, y: 124 },
        { campo: 'miembrosSuperiores', x: 36, y: 129 },
        { campo: 'miembrosInferiores', x: 36, y: 137 },
        { campo: 'sistemaNervioso', x: 36, y: 145 }
      ];
      
      // Renderizar cada sistema
      posicionesSistemas.forEach(({ campo, x, y }) => {
        if (sistemas[campo]) {
          doc.text(sistemas[campo], x, y, { maxWidth: 170, lineHeightFactor: 0.9 });
        }
      });
    }
    
    // === SECCIÓN: CONCLUSIONES Y DIAGNÓSTICOS ===
    if (datosFinales.conclusiones) {
      const conclusiones = datosFinales.conclusiones;
      
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      // Posiciones para cada sección de conclusiones (ajustar según la imagen real)
      const posicionesConclusiones = [
        // VI. CONCLUSIONES DE EVALUACIÓN PSICOLÓGICA (ancho completo)
        { campo: 'conclusionesEvaluacionPsicologica', x: 5, y: 159, maxWidth: 180 },
        
        // VII. CONCLUSIONES RADIOGRÁFICAS (mitad izquierda)
        { campo: 'conclusionesRadiograficas', x: 5, y: 178, maxWidth: 100 },
        
        // VIII. HALLAZGOS PATOLÓGICOS DE LABORATORIO (mitad derecha)
        { campo: 'hallazgosPatologicosLaboratorio', x: 110, y: 178, maxWidth: 100 },
        
        // IX. CONCLUSIÓN AUDIOMETRÍA (mitad  )
        { campo: 'conclusionAudiometria', x: 5, y: 196, maxWidth: 80 },
        
        // X. CONCLUSIÓN DE ESPIROMETRÍA (mitad derecha)
        { campo: 'conclusionEspirometria', x: 110, y: 196, maxWidth: 80 },
        
        // XI. OTROS (mitad izquierda)
        { campo: 'otros', x: 5, y: 210, maxWidth: 180 },
        
        // XII. DIAGNÓSTICO MÉDICO OCUPACIONAL Y RECOMENDACIONES (ancho completo)
        { campo: 'diagnosticoMedicoOcupacional', x: 5, y: 225, maxWidth: 180 }
      ];
      
      // Renderizar cada conclusión
      posicionesConclusiones.forEach(({ campo, x, y, maxWidth }) => {
        if (conclusiones[campo]) {
          doc.text(conclusiones[campo], x, y, { maxWidth, lineHeightFactor: 0.9 });
        }
      });
    }
    
    // === SECCIÓN: XIII - CONCLUSIONES FINALES ===
    if (datosFinales.conclusionesFinales) {
      const conclusionesFinales = datosFinales.conclusionesFinales;
      
      doc.setFont("helvetica", "normal").setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Posiciones para checkboxes de aptitud
      const xApto = 30.5;
      const yApto = 269.6;
      const xAptoConRestriccion = 30.5;
      const yAptoConRestriccion = 276.7;
      const xNoApto = 30.5;
      const yNoApto = 285;
      
      // Posición para campo de restricciones
      const xRestricciones = 45;
      const yRestricciones = 270;
      
       // Posiciones para la firma del médico
      const xFirmaMedico = 120;
      const yFirmaMedico = 263;

      // Posiciones para la firma del paciente
      const xFirmaPaciente = 158;
      const yFirmaPaciente = 263;

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
        doc.text(conclusionesFinales.restricciones, xRestricciones, yRestricciones, { maxWidth: 75 });
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
