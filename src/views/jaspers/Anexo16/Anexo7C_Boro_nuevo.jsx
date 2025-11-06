import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { getSign } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Anexo7C_Boro(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    // Datos básicos para header
    apellidosNombres: String(data.nombres_nombres ?? "").trim(),
    numeroFicha: String(data.numero ?? ""),
    sede: data.sede || data.nombreSede || "",
    direccionPaciente: String(data.direccionPaciente_direccion ?? ""),
    departamento: data.departamentoPaciente || "",
    provincia: data.provinciaPaciente || "",
    distrito: data.distritoPaciente || "",
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    
    // Mapeo completo desde Anexo7C_Boro.jsx
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
      rango2501_4000: data.altura_altura_po === "3501 A 4000" ?? false,
      rango2501_3000: data.altura_altura_po === "2501 A 3000" ?? false,
      rango4001_4500: data.altura_altura_po === "4001 A 4500" ?? false,
      rango2001_3500: data.altura_altura_po === "3001 A 3500" ?? false,
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
      estadoCivil: data.estadoCivilPaciente_estado_civil_pa ?? "",
      gradoInstruccion: data.nivelEstudioPaciente_nivel_est_pa ?? ""
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
      enfermedadesOculares: (() => {
        const campo1 = data.enfermedadesOcularesOftalmo_e_oculares?.trim() ?? "";
        const campo2 = data.enfermedadesOcularesOtrosOftalmo_e_oculares1?.trim() ?? "";
        
        // Si ambas están vacías, mostrar "NINGUNA"
        if (!campo1 && !campo2) return "NINGUNA";
        
        // Si solo una tiene data, devolver esa en mayúsculas
        if (campo1 && !campo2) return campo1.toUpperCase();
        if (!campo1 && campo2) return campo2.toUpperCase();
        
        // Si ambas tienen data, devolver ambas en mayúsculas y separadas por nueva línea
        return `${campo1.toUpperCase()}\n${campo2.toUpperCase()}`;
      })(),
      reflejosPupilares: (data.reflejosPupilaresAnexo7c_txtreflejospupilares === null || data.reflejosPupilaresAnexo7c_txtreflejospupilares === '-' || data.reflejosPupilaresAnexo7c_txtreflejospupilares === undefined) ? "" : data.reflejosPupilaresAnexo7c_txtreflejospupilares,
      visionColores: (data.visionColoresAnexo7c_txtvisioncolores === null || data.visionColoresAnexo7c_txtvisioncolores === '-' || data.visionColoresAnexo7c_txtvisioncolores === undefined) ? "" : data.visionColoresAnexo7c_txtvisioncolores,
      testIshiharaNormal: (data.tecishiharaNormal_rbtecishihara_normal === null || data.tecishiharaNormal_rbtecishihara_normal === '-' || data.tecishiharaNormal_rbtecishihara_normal === undefined) ? false : data.tecishiharaNormal_rbtecishihara_normal,
      testIshiharaAnormal: (data.tecishiharaAnormal_rbtecishihara_anormal === null || data.tecishiharaAnormal_rbtecishihara_anormal === '-' || data.tecishiharaAnormal_rbtecishihara_anormal === undefined) ? false : data.tecishiharaAnormal_rbtecishihara_anormal,
      testColoresPurosNormal: (data.teccoleresNormal_rbteccoleres_normal === null || data.teccoleresNormal_rbteccoleres_normal === '-' || data.teccoleresNormal_rbteccoleres_normal === undefined) ? false : data.teccoleresNormal_rbteccoleres_normal,
      testColoresPurosAnormal: (data.teccoleresAnormal_rbteccoleres_anormal === null || data.teccoleresAnormal_rbteccoleres_anormal === '-' || data.teccoleresAnormal_rbteccoleres_anormal === undefined) ? false : data.teccoleresAnormal_rbteccoleres_anormal,
      testProfundidadNormal: (data.tecestereopsiaNormal_rbtecestereopsia_normal === null || data.tecestereopsiaNormal_rbtecestereopsia_normal === '-' || data.tecestereopsiaNormal_rbtecestereopsia_normal === undefined) ? false : data.tecestereopsiaNormal_rbtecestereopsia_normal,
      testProfundidadAnormal: (data.tecestereopsiaAnormal_rbtecestereopsia_anormal === null || data.tecestereopsiaAnormal_rbtecestereopsia_anormal === '-' || data.tecestereopsiaAnormal_rbtecestereopsia_anormal === undefined) ? false : data.tecestereopsiaAnormal_rbtecestereopsia_anormal
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
        normal: data.pielAnexo7c_piel ?? false,
        anormal: !(data.pielAnexo7c_piel ?? false),
        descripcion: data.pielDescripcionAnexo7c_piel_descripcion ?? ""
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
    // Campos adicionales para las secciones de radiografía
    nroRx: String(data.nrx_n_rx ?? ""),
    fechaRx: formatearFechaCorta(data.fechaExamenRadiografico_fecha_exra ?? ""),
    calidadRx: data.calidadExamenRadiografico_txtcalidad ?? "",
    simbolosRx: data.simbolosExamenRadiografico_txtsimbolos ?? "",
    vertices: data.verticesRadiografiaTorax_txtvertices ?? "",
    mediastinos: data.meadiastinos_txtmediastinos ?? "",
    hilios: data.hilosRadiografiaTorax_txthilios ?? "",
    senos: data.senosCostoFrenicos_txtsenoscostofrenicos ?? "",
    siluetaCardiovascular: data.siluetaCardioVascular_txtsiluetacardiovascular ?? "",
    conclusionesRadiograficas: data.conclusionesRadiograficas_txtconclusionesradiograficas ?? "",
    // Textos de Neumoconiosis
    textoNeumoconiosis1: data.examenRadiograficoSinNeumoconiosis_txtsinneumoconiosis ?? "",
    textoNeumoconiosis2: data.examenRadiograficoIrep_txtirep ?? "",
    textoNeumoconiosis3: data.examenRadiograficoConNeumoconiosis_txtconneumoconiosis ?? "",
    // Otros hallazgos radiográficos
    sinNeumoconiosis: data.examenRadiograficoSinNeumoconiosis_txtsinneumoconiosis ?? "",
    imagenRadiograficaExposicionPolvo: data.examenRadiograficoIrep_txtirep ?? "",
    conNeumoconiosis: data.examenRadiograficoConNeumoconiosis_txtconneumoconiosis ?? "",
    reaccionesSerologicasLues: data.negativoLaboratorioClinico_chknegativo ? "NEGATIVO" : "",
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
    // reaccionesSerologicasLues ya definido arriba
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
      : [],
    
    // Campos adicionales para compatibilidad con el nuevo formato
    // Signos vitales (formato simple para compatibilidad)
    fRespiratoria: data.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "",
    fCardiaca: data.frecuenciaCardiacaTriaje_f_cardiaca ?? "",
    satO2: data.saturacionOxigenoTriaje_sat_02 ?? "",
    presionSistolica: data.sistolicaTriaje_sistolica ?? "",
    presionDiastolica: data.diastolicaTriaje_diastolica ?? "",
    
    // Neumoconiosis (formato simple para compatibilidad)
    neumoconiosisCategoria: data.examenRadiografico0_ex_0 ? "0/0" :
                            data.examenRadiografico10_ex_10 ? "1/0" :
                            data.examenRadiografico11_ex_11 ? "1/1" :
                            data.examenRadiografico12_ex_12 ? "1/2" :
                            data.examenRadiografico21_ex_21 ? "2/1" :
                            data.examenRadiografico22_ex_22 ? "2/2" :
                            data.examenRadiografico23_ex_23 ? "2/3" :
                            data.examenRadiografico32_ex_32 ? "3/2" :
                            data.examenRadiografico33_ex_33 ? "3/3" :
                            data.examenRadiografico3mas_ex_3mas ? "3/+" :
                            data.examenRadiograficoAbc_ex_abc ? "A" :
                            data.examenRadiograficoSt_ex_st ? "ST" : "",
    
    // Textos de Neumoconiosis (formato simple para compatibilidad)
    // sinNeumoconiosis, imagenRadiograficaExposicionPolvo, conNeumoconiosis ya definidos arriba
    
    // Campos adicionales para compatibilidad con el nuevo formato (formato simple)
    vsgSimple: data.vsgLaboratorioClinico_txtvsg ?? "",
    glucosaSimple: data.glucosaLaboratorioClinico_txtglucosabio ?? "",
    ureaSimple: "N/A", //revisar - no hay campo específico en JSON
    creatininaSimple: data.creatininaLaboratorioClinico_txtcreatininabio ?? "",
    ldlSimple: data.ldlcolesterolAnalisisBioquimico_txtldlcolesterol ?? "",
    hdlSimple: data.hdlcolesterolAnalisisBioquimico_txthdlcolesterol ?? "",
    vldlSimple: data.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol ?? "",
    trigliceridosSimple: data.trigliceridosAnalisisBioquimico_txttrigliceridos ?? "",
    colesterolTotalSimple: data.colesterolAnalisisBioquimico_txtcolesterol ?? "",
    cocainaSimple: data.cocainaLaboratorioClinico_txtcocaina ?? "",
    marihuanaSimple: data.marihuanaLaboratorioClinico_txtmarihuana ?? "",
    mercurioSimple: "N/A", //revisar - no hay campo específico en JSON
    plomoSimple: "N/A", //revisar - no hay campo específico en JSON
    grupoSanguineoSimple: data.grupoSanguineoO_chko ? "O" :
                    data.grupoSanguineoA_chka ? "A" :
                    data.grupoSanguineoB_chkb ? "B" :
                    data.grupoSanguineoAB_chkab ? "AB" : "",
    factorRhSimple: data.grupoSanguineoRhPositivo_rbrhpositivo ? "POSITIVO" :
              data.grupoSanguineoRhNegativo_rbrhnegativo ? "NEGATIVO" : "",
    hemoglobinaHematocritoSimple: data.hemoglobina_txthemoglobina ?? "",
    aptoParaTrabajarSimple: data.examenRadiograficoAptoSi_apto_si ? "SI" :
                      data.examenRadiograficoAptoNo_apto_no ? "NO" : "",
    otrosExamenesSimple: data.examenRadiograficoOtros_txtotrosex ?? "",
    conclusionesSimple: data.observacionesFichaMedicaAnexo7c_txtobservacionesfm ?? "",
    recomendacionesRestriccionesSimple: data.conclusionMedicoAnexo7c_txtconclusionmed ?? "",
    
    // Campos adicionales para compatibilidad con el PDF
    tipoExamen: String(data.nombreExamen_nom_examen ?? ""),
    documentoIdentidad: String(data.dni_cod_pa ?? ""),
    edad: String(data.edad_edad ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente_fecha_nacimiento_pa ?? ""),
    puestoTrabajo: data.cargo_cargo_de || "",
    empresa: data.empresa_razon_empresa || "",
    contrata: data.contrata_razon_contrata || "",
    estadoCivil: data.estadoCivilPaciente_estado_civil_pa || "",
    gradoEstudios: data.nivelEstudioPaciente_nivel_est_pa || "",
    sexo: data.sexo_sexo_pa === "M" ? "MASCULINO" : data.sexo_sexo_pa === "F" ? "FEMENINO" : "",
    antecedentesPersonales: data.antecedentesPersonalesAnexo7c_txtantecedentespersonales || "",
    antecedentesFamiliares: data.antecedentesFamiliaresAnexo7c_txtantecedentesfamiliares || "",
    numeroHijosVivos: data.hijosVivosAnexo7c_txthijosvivos || "",
    numeroHijosMuertos: data.hijosMuertosAnexo7c || "",
    fvc: data.fvcFuncionRespiratoria_fvc || "",
    fev1fvc: data.fev1FvcFuncionRespiratoria_fev1fvc || "",
    fev1: data.fev1FuncionRespiratoria_fev1 || "",
    fef: data.fef2575FuncionRespiratoria_fef25_75 || "",
    conclusionEspirometria: data.conclusionAnexo7c_txtconclusion || "",
    temp: data.temperaturaTriaje_temperatura || "",
    talla: data.tallaTriaje_talla || "",
    peso: data.pesoTriaje_peso || "",
    cintura: data.cinturaTriaje_cintura || "",
    cadera: data.caderaTriaje_cadera || "",
    icc: data.iccTriaje_icc || "",
    imc: data.imcTriaje_imc || "",
    cabeza: data.cabezaAnexo7c_txtcabeza || "",
    perimetroCuello: data.perimetroCuelloTriaje_perimetro_cuello || "",
    cuello: data.cuelloAnexo7c_txtcuello || "",
    nariz: data.narizAnexo7c_txtnariz || "",
    boca: data.baflAnexo7c_txtb_a_f_l || "",
    amigdalas: data.baflAnexo7c_txtb_a_f_l || "",
    faringe: data.baflAnexo7c_txtb_a_f_l || "",
    laringe: data.baflAnexo7c_txtb_a_f_l || "",
    dentadura: "Evaluación dental",
    piezasMalEstado: String(data.piezasMalEstadoOdontograma_txtpiezasmalestado ?? ""),
    piezasFaltantes: String(data.ausentesOdontograma_txtausentes ?? ""),
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    // Título en todas las páginas
    doc.setFont("helvetica", "bold").setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("ANEXO 16", pageW / 2, 28, { align: "center" });
    doc.text("FICHA MEDICA OCUPACIONAL", pageW / 2, 32, { align: "center" });

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

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
  };

  // === DIBUJAR HEADER ===
  drawHeader(numeroPagina);

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return y;
    }
    
    const fontSize = doc.internal.getFontSize();
    const palabras = String(texto).split(' ');
    let lineaActual = '';
    let yPos = y;
    
    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);
      
      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          doc.text(lineaActual, x, yPos);
          yPos += fontSize * 0.35; // salto real entre líneas
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yPos);
          yPos += fontSize * 0.35;
        }
      }
    });
    
    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
      yPos += fontSize * 0.35;
    }
    
    return yPos; // Devuelve la nueva posición final
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // Función para dibujar header de sección con fondo celeste (azul claro)
  const dibujarHeaderSeccionCeleste = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo celeste
    doc.setFillColor(199, 241, 255);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // Función para dibujar fila con división de dos columnas y títulos
  const dibujarFilaConDosColumnas = (tituloCol1, tituloCol2, yPos, alturaFila = 5) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaFila); // División central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

    // Dibujar títulos de las columnas
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(tituloCol1, tablaInicioX + 2, yPos + 3.5);
    doc.text(tituloCol2, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);

    return yPos + alturaFila; // Retorna la nueva posición Y
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35.5;
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Puesto de Trabajo (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Empresa (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Contrata (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Estado Civil, Grado de Estudios (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Minerales explotados o procesados, Reubicación (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Explotación, Altura de la labor (MSNM) (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35.5 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  doc.text(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.edad ? (datosFinales.edad + " AÑOS") : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Convertir objeto sexo a string
  let sexoTexto = "";
  if (datosFinales.datosPersonales && datosFinales.datosPersonales.sexo) {
    if (datosFinales.datosPersonales.sexo.masculino) sexoTexto = "MASCULINO";
    else if (datosFinales.datosPersonales.sexo.femenino) sexoTexto = "FEMENINO";
  }
  
  doc.text(sexoTexto, tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1);
  yTexto += filaAltura;

  // Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto al que Postula:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 38, yTexto + 1);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Estado Civil, Grado de Estudios
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado Civil:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.estadoCivilPaciente_estado_civil_pa || "", tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grado de Estudios:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.nivelEstudioPaciente_nivel_est_pa || "", tablaInicioX +  121, yTexto + 1);
  yTexto += filaAltura;

  // Minerales explotados o procesados, Reubicación
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Minerales explotados o procesados:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.mineralesExplotados || ""), tablaInicioX + 55, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reubicación:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Convertir objeto reubicacion a string
  let reubicacionTexto = "";
  if (datosFinales.informacionPuesto && datosFinales.informacionPuesto.reubicacion) {
    if (datosFinales.informacionPuesto.reubicacion.si) reubicacionTexto = "SI";
    else if (datosFinales.informacionPuesto.reubicacion.no) reubicacionTexto = "NO";
  }
  
  doc.text(reubicacionTexto, tablaInicioX + 115, yTexto + 1);
  yTexto += filaAltura;

  // Explotación, Altura de la labor (MSNM)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Explotación:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Convertir objeto tipoTrabajo a string
  let explotacionTexto = "";
  if (datosFinales.tipoTrabajo) {
    const tipos = [];
    if (datosFinales.tipoTrabajo.superficie) tipos.push("SUPERFICIE");
    if (datosFinales.tipoTrabajo.concentrador) tipos.push("CONCENTRADOR");
    if (datosFinales.tipoTrabajo.subsuelo) tipos.push("SUBSUELO");
    explotacionTexto = tipos.join(", ");
  }
  
  doc.text(explotacionTexto, tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Altura de la labor (MSNM):", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Convertir objeto alturaLabor a string
  let alturaLaborTexto = "";
  if (datosFinales.alturaLabor) {
    const alturas = [];
    if (datosFinales.alturaLabor.debajo2500) alturas.push("DEBAJO 2500");
    if (datosFinales.alturaLabor.rango2501_3000) alturas.push("2501 A 3000");
    if (datosFinales.alturaLabor.rango2001_3500) alturas.push("3001 A 3500");
    if (datosFinales.alturaLabor.rango2501_4000) alturas.push("3501 A 4000");
    if (datosFinales.alturaLabor.rango4001_4500) alturas.push("4001 A 4500");
    if (datosFinales.alturaLabor.mas4501) alturas.push("MAS DE 4501");
    alturaLaborTexto = alturas.join(", ");
  }
  
  doc.text(alturaLaborTexto, tablaInicioX + 132, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN DE FACTORES DE RIESGO OCUPACIONALES ===
  yPos = dibujarHeaderSeccion("FACTORES DE RIESGO OCUPACIONALES", yPos, filaAltura);

  // Calcular divisiones para 8 columnas (4 factores + 4 espacios para X)
  const colWidth = tablaAncho / 8; // Ancho de cada columna
  const colPositions = [];
  const colWidths = [];
  for (let i = 0; i <= 8; i++) {
    colPositions.push(tablaInicioX + (i * colWidth));
    colWidths.push(colWidth);
  }

  // Fila 1: Ruido | | Cancerigenos | | temperatura | | carga | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: polvo | | mutagenos | | biologicos | | mov. repet. | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: vib segmentario | | solventes | | posturas | | PVD | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 4: vib total | | metales | | turno | | otros | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE FACTORES DE RIESGO ===
  let yTextoFactores = yPos - (4 * filaAltura) + 2.5;

  // Fila 1: Ruido, Cancerigenos, temperatura, carga
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Ruido", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("Cancerigenos", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("temperatura", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("carga", colPositions[6] + 2, yTextoFactores + 1);
  
  // Marcar X si está presente (centradas)
  if (datosFinales.factoresRiesgo.ruido) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[1] + colWidths[1]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.cancerigenos) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[3] + colWidths[3]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.temperatura) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[5] + colWidths[5]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.carga) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[7] + colWidths[7]/2 - 1, yTextoFactores + 1);
  }
  yTextoFactores += filaAltura;

  // Fila 2: polvo, mutagenos, biologicos, mov. repet.
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("polvo", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("mutagenos", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("biologicos", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("mov. repet.", colPositions[6] + 2, yTextoFactores + 1);
  
  // Marcar X si está presente (centradas)
  if (datosFinales.factoresRiesgo.polvo) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[1] + colWidths[1]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.mutagenicos) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[3] + colWidths[3]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.biologicos) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[5] + colWidths[5]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.movRepet) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[7] + colWidths[7]/2 - 1, yTextoFactores + 1);
  }
  yTextoFactores += filaAltura;

  // Fila 3: vib segmentario, solventes, posturas, PVD
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("vib segmentario", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("solventes", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("posturas", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("PVD", colPositions[6] + 2, yTextoFactores + 1);
  
  // Marcar X si está presente (centradas)
  if (datosFinales.factoresRiesgo.vibSegmentario) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[1] + colWidths[1]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.solventes) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[3] + colWidths[3]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.posturas) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[5] + colWidths[5]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.pvd) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[7] + colWidths[7]/2 - 1, yTextoFactores + 1);
  }
  yTextoFactores += filaAltura;

  // Fila 4: vib total, metales, turno, otros
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("vib total", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("metales", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("turno", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("otros", colPositions[6] + 2, yTextoFactores + 1);
  
  // Marcar X si está presente (centradas)
  if (datosFinales.factoresRiesgo.vibTotal) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[1] + colWidths[1]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.metales) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[3] + colWidths[3]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.turnos) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[5] + colWidths[5]/2 - 1, yTextoFactores + 1);
  }
  if (datosFinales.factoresRiesgo.otros) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", colPositions[7] + colWidths[7]/2 - 1, yTextoFactores + 1);
  }
  yTextoFactores += filaAltura;

  // === SECCIÓN 2: ANTECEDENTES OCUPACIONALES ===
  yPos = dibujarHeaderSeccion("2. ANTECEDENTES OCUPACIONALES", yPos, filaAltura);

  // Fila: Antecedentes personales (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Antecedentes familiares (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Inmunizaciones | Tetano | X | Hepatitis-B | X | Fiebre amarilla | X |
  const colInmunizacionWidth = 40;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División después de "Inmunizaciones"
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // División después de Tetano
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // División después de Hepatitis-B
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Número de hijos | Vivos: {data} | Muertos: {data} |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División después de "Número de hijos"
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura); // División después de "Vivos"
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA SECCIÓN ANTECEDENTES OCUPACIONALES ===
  let yTextoAntecedentes = yPos - (4 * filaAltura) + 2.5; // Ajustar para el header

  // Antecedentes personales
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes personales:", tablaInicioX + 2, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.antecedentesMedicos?.personales || "").toString().toUpperCase(), tablaInicioX + 40, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // Antecedentes familiares
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes familiares:", tablaInicioX + 2, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.antecedentesMedicos?.familiares || "").toString().toUpperCase(), tablaInicioX + 40, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // Inmunizaciones
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Inmunizaciones:", tablaInicioX + 2, yTextoAntecedentes + 1);

  // Tetano
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tetano:", tablaInicioX + 52, yTextoAntecedentes + 1);
  if (datosFinales.inmunizaciones?.tetano) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 78, yTextoAntecedentes + 1);
  }

  // Hepatitis-B
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hepatitis-B:", tablaInicioX + 92, yTextoAntecedentes + 1);
  if (datosFinales.inmunizaciones?.hepatitisB) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 118, yTextoAntecedentes + 1);
  }

  // Fiebre amarilla
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fiebre amarilla:", tablaInicioX + 132, yTextoAntecedentes + 1);
  if (datosFinales.inmunizaciones?.fiebreAmarilla) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 158, yTextoAntecedentes + 1);
  }
  yTextoAntecedentes += filaAltura;

  // Número de hijos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Número de hijos:", tablaInicioX + 2, yTextoAntecedentes + 1);

  // Vivos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Vivos:", tablaInicioX + 52, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.numeroHijos?.vivos || "", tablaInicioX + 70, yTextoAntecedentes + 1);

  // Muertos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Muertos:", tablaInicioX + 122, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.numeroHijos?.muertos || "", tablaInicioX + 145, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // === SECCIÓN 3: HÁBITOS NOCIVOS ===
  yPos = dibujarHeaderSeccion("3. HÁBITOS NOCIVOS", yPos, filaAltura);

  // Fila: Tabaco: {data} | alcohol: {data} | Drogas: {data}
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura); // División 1/3
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura); // División 2/3
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE HÁBITOS NOCIVOS ===
  let yTextoHabitos = yPos - filaAltura + 2.5;

  // Función para determinar frecuencia de hábitos
  const obtenerFrecuencia = (habito) => {
    if (!habito) return "";
    if (habito.nada) return "NADA";
    if (habito.poco) return "POCO";
    if (habito.habitual) return "HABITUAL";
    if (habito.excesivo) return "EXCESIVO";
    return "";
  };

  // Tabaco
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tabaco:", tablaInicioX + 2, yTextoHabitos + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(obtenerFrecuencia(datosFinales.habitos?.tabaco), tablaInicioX + 20, yTextoHabitos + 1);

  // Alcohol
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Alcohol:", tablaInicioX + tablaAncho / 3 + 2, yTextoHabitos + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(obtenerFrecuencia(datosFinales.habitos?.alcohol), tablaInicioX + tablaAncho / 3 + 20, yTextoHabitos + 1);

  // Drogas
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Drogas:", tablaInicioX + (2 * tablaAncho / 3) + 2, yTextoHabitos + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(obtenerFrecuencia(datosFinales.habitos?.drogas), tablaInicioX + (2 * tablaAncho / 3) + 20, yTextoHabitos + 1);
  yTextoHabitos += filaAltura;

  // === SECCIÓN 4: ESPIROMETRÍA ===
  yPos = dibujarHeaderSeccion("4. ESPIROMETRÍA", yPos, filaAltura);

  // Fila para datos de espirometría (8 columnas: label | data | label | data | etc.)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila para conclusión (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE ESPIROMETRÍA ===
  let yTextoEspirometria = yPos - (2 * filaAltura) + 2.5;

  // Fila de datos: FVC | {data} | FEV1 | {data} | FEV1/FVC | {data} | FEF | {data}
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FVC", colPositions[0] + 2, yTextoEspirometria + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.funcionRespiratoria?.fvc || "") + " L", colPositions[1] + 2, yTextoEspirometria + 1);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FEV1", colPositions[2] + 2, yTextoEspirometria + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.funcionRespiratoria?.fev1 || "") + " L", colPositions[3] + 2, yTextoEspirometria + 1);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FEV1/FVC", colPositions[4] + 2, yTextoEspirometria + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.funcionRespiratoria?.fev1Fvc || "") + " %", colPositions[5] + 2, yTextoEspirometria + 1);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FEF 25-75%", colPositions[6] + 2, yTextoEspirometria + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.funcionRespiratoria?.fef2575 || "") + " L/s", colPositions[7] + 2, yTextoEspirometria + 1);
  yTextoEspirometria += filaAltura;

  // Conclusión
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Conclusión:", tablaInicioX + 2, yTextoEspirometria + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.funcionRespiratoria?.conclusion || "").toString().toUpperCase(), tablaInicioX + 25, yTextoEspirometria + 1);
  yTextoEspirometria += filaAltura;


  // === SECCIÓN 5: SIGNOS VITALES Y MEDICIONES CORPORALES ===
  yPos = dibujarHeaderSeccion("5. SIGNOS VITALES Y MEDICIONES CORPORALES", yPos, filaAltura);

  // Fila 1: Temperatura | Talla | Peso (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura); // División 1/3
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura); // División 2/3
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: Cintura | Cadera (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: ICC | IMC (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 4: F. Respiratoria | F. Cardiaca | SatO2 (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 5: Presión Arterial (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE SIGNOS VITALES Y MEDICIONES ===
  let yTextoMediciones = yPos - (5 * filaAltura) + 2.5;

  // Fila 1: Temperatura | Talla | Peso
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Temperatura:", tablaInicioX + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.temperatura || "") + "°C", tablaInicioX + 30, yTextoMediciones + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla:", tablaInicioX + tablaAncho / 3 + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.medidasCorporales?.talla || "") + " m", tablaInicioX + tablaAncho / 3 + 20, yTextoMediciones + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso:", tablaInicioX + (2 * tablaAncho / 3) + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.medidasCorporales?.peso || "") + " kg", tablaInicioX + (2 * tablaAncho / 3) + 20, yTextoMediciones + 1);
  yTextoMediciones += filaAltura;

  // Fila 2: Cintura | Cadera
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cintura:", tablaInicioX + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.medidasCorporales?.cintura || "") + " cm", tablaInicioX + 25, yTextoMediciones + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cadera:", tablaInicioX + tablaAncho / 2 + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.medidasCorporales?.cadera || "") + " cm", tablaInicioX + tablaAncho / 2 + 25, yTextoMediciones + 1);
  yTextoMediciones += filaAltura;

  // Fila 3: ICC | IMC
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Índice Cintura-Cadera (ICC):", tablaInicioX + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.medidasCorporales?.icc || "", tablaInicioX + 60, yTextoMediciones + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Índice de Masa Corporal (IMC):", tablaInicioX + tablaAncho / 2 + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.medidasCorporales?.imc || "") + " kg/m²", tablaInicioX + tablaAncho / 2 + 60, yTextoMediciones + 1);
  yTextoMediciones += filaAltura;

  // === CONTENIDO DE LAS FILAS 4 Y 5 (SIGNOS VITALES ADICIONALES) ===
  let yTextoVitales = yPos - (2 * filaAltura) + 2.5;

  // Fila 4: F. Respiratoria | F. Cardiaca | SatO2
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("F. Respiratoria:", tablaInicioX + 2, yTextoVitales + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.fRespiratoria || "") + " x/min", tablaInicioX + 35, yTextoVitales + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("F. Cardiaca:", tablaInicioX + tablaAncho / 3 + 2, yTextoVitales + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.fCardiaca || "") + " x/min", tablaInicioX + tablaAncho / 3 + 35, yTextoVitales + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("SatO2:", tablaInicioX + (2 * tablaAncho / 3) + 2, yTextoVitales + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.satO2 || "") + "%", tablaInicioX + (2 * tablaAncho / 3) + 20, yTextoVitales + 1);
  yTextoVitales += filaAltura;

  // Fila 5: Presión Arterial
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Presión Arterial:", tablaInicioX + 2, yTextoVitales + 1);
  
  // Columna 2: Sistólica
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sistólica:", tablaInicioX + tablaAncho / 3 + 2, yTextoVitales + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.presionSistolica || "").toString().toUpperCase() + " mmHg", tablaInicioX + tablaAncho / 3 + 20, yTextoVitales + 1);
  
  // Columna 3: Diastólica
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Diastólica:", tablaInicioX + (2 * tablaAncho / 3) + 2, yTextoVitales + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.presionDiastolica || "").toString().toUpperCase() + " mmHg", tablaInicioX + (2 * tablaAncho / 3) + 25, yTextoVitales + 1);
  
  yTextoVitales += filaAltura;

  // === SECCIÓN 6: EXAMEN FÍSICO DETALLADO ===
  yPos = dibujarHeaderSeccion("6. EXAMEN FÍSICO DETALLADO", yPos, filaAltura);

  // Fila 1: Cabeza | Perímetro Cuello | Cuello | Nariz (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: Boca, Amígdalas, Faringe, Laringe (un solo campo)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: Dentadura | Piezas en mal estado | Piezas faltantes (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // === CONTENIDO DE EXAMEN FÍSICO DETALLADO ===
  let yTextoExamenDetallado = yPos - (2 * filaAltura) + 2.5;

  // Fila 1: Cabeza | Perímetro Cuello | Cuello | Nariz
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cabeza:", tablaInicioX + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionFisica?.cabeza || "").toString().toUpperCase(), tablaInicioX + 20, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Perímetro Cuello:", tablaInicioX + tablaAncho / 4 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionFisica?.perimetroCuello || "") + " cm", tablaInicioX + tablaAncho / 4 + 30, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cuello:", tablaInicioX + tablaAncho / 2 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionFisica?.cuello || "").toString().toUpperCase(), tablaInicioX + tablaAncho / 2 + 15, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Nariz:", tablaInicioX + (3 * tablaAncho / 4) + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionFisica?.nariz || "").toString().toUpperCase(), tablaInicioX + (3 * tablaAncho / 4) + 15, yTextoExamenDetallado + 1);
  yTextoExamenDetallado += filaAltura;

  // Fila 2: Boca, Amígdalas, Faringe, Laringe (un solo campo)
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Boca, Amígdalas, Faringe, Laringe:", tablaInicioX + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionFisica?.bocaAmigdalas || "").toString().toUpperCase(), tablaInicioX + 60, yTextoExamenDetallado + 1);
  yTextoExamenDetallado += filaAltura;

  // Fila 3: Dentadura | Piezas en mal estado | Piezas faltantes
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Dentadura:", tablaInicioX + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Evaluación dental", tablaInicioX + 25, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Piezas en mal estado:", tablaInicioX + tablaAncho / 3 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluacionFisica?.dentadura?.piezasMalEstado || "", tablaInicioX + tablaAncho / 3 + 40, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Piezas faltantes:", tablaInicioX + (2 * tablaAncho / 3) + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluacionFisica?.dentadura?.piezasFaltantes || "", tablaInicioX + (2 * tablaAncho / 3) + 35, yTextoExamenDetallado + 1);

  // === SECCIÓN OJOS ===
  // Fila gris: OJOS
  doc.setFillColor(196, 196, 196); // Color gris
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("7. OJOS", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === TABLA DE AGUDEZA VISUAL ===
  const filaAlturaAgudeza = 4.5;
  const colAgudezaAncho = 30; // AGUDEZA VISUAL
  const colSinCorregirAncho = 30; // SIN CORREGIR
  const colCorregidaAncho = 30; // CORREGIDA
  const colObservacionesAncho = 95; // OBSERVACIONES
  
  // Posiciones de columnas
  let xAgudeza = tablaInicioX;
  let xSinCorregir = xAgudeza + colAgudezaAncho;
  let xCorregida = xSinCorregir + colSinCorregirAncho;
  let xObservaciones = xCorregida + colCorregidaAncho;
  
  // Dibujar header de la tabla de agudeza visual
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(xCorregida, yPos, xCorregida, yPos + filaAlturaAgudeza);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  
  // Contenido del header
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("AGUDEZA VISUAL", xAgudeza + 2, yPos + 3.5);
  
  // Centrar "SIN CORREGIR"
  const textoSinCorregir = "SIN CORREGIR";
  const anchoSinCorregir = doc.getTextWidth(textoSinCorregir);
  doc.text(textoSinCorregir, xSinCorregir + (colSinCorregirAncho - anchoSinCorregir) / 2, yPos + 3.5);
  
  // Centrar "CORREGIDA"
  const textoCorregida = "CORREGIDA";
  const anchoCorregida = doc.getTextWidth(textoCorregida);
  doc.text(textoCorregida, xCorregida + (colCorregidaAncho - anchoCorregida) / 2, yPos + 3.5);
  
  // Centrar "ENFERMEDADES OCULARES"
  const textoObservaciones = "ENFERMEDADES OCULARES";
  const anchoObservaciones = doc.getTextWidth(textoObservaciones);
  doc.text(textoObservaciones, xObservaciones + (colObservacionesAncho - anchoObservaciones) / 2, yPos + 3.5);
  yPos += filaAlturaAgudeza;
  
  // Calcular posiciones de las mitades de las columnas antes de usarlas
  const mitadSinCorregir = xSinCorregir + (colSinCorregirAncho / 2);
  const mitadCorregida = xCorregida + (colCorregidaAncho / 2);
  
  // Preparar texto de enfermedades oculares con wrap
  const textoEnfermedadesRaw = datosFinales.evaluacionOftalmologica?.enfermedadesOculares || "";
  // Dividir por saltos de línea y agregar guión a cada línea (excepto si es "NINGUNA")
  let textoEnfermedades = "";
  if (textoEnfermedadesRaw) {
    const lineasEnfermedades = textoEnfermedadesRaw.split('\n');
    textoEnfermedades = lineasEnfermedades
      .filter(linea => linea.trim()) // Filtrar líneas vacías
      .map(linea => {
        const lineaTrim = linea.trim();
        // Si es "NINGUNA", no agregar guión; de lo contrario, agregar guión si no lo tiene
        if (lineaTrim === "NINGUNA") {
          return lineaTrim;
        }
        return lineaTrim.startsWith('-') ? lineaTrim : `- ${lineaTrim}`;
      })
      .join('\n');
  }
  const maxWidth = colObservacionesAncho - 4; // Ancho disponible menos margen (reducido de 8 a 4 para evitar cortes prematuros)
  const lineHeight = 3; // Interlineado reducido un poco
  const lines = doc.splitTextToSize(textoEnfermedades, maxWidth);
  
  // Dibujar subheader con O.D y O.I
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(xCorregida, yPos, xCorregida, yPos + filaAlturaAgudeza);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  // Línea horizontal superior solo hasta el final de CORREGIDA
  doc.line(tablaInicioX, yPos, xObservaciones, yPos);
  // Línea horizontal inferior solo hasta el final de CORREGIDA
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, xObservaciones, yPos + filaAlturaAgudeza);
  
  // Dibujar líneas verticales para dividir O.D y O.I
  doc.line(mitadSinCorregir, yPos, mitadSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(mitadCorregida, yPos, mitadCorregida, yPos + filaAlturaAgudeza);
  
  // Contenido del subheader
  doc.setFont("helvetica", "bold").setFontSize(8);
  
  // Centrar "O.D" en la primera celda de SIN CORREGIR
  const textoOD1 = "O.D";
  const anchoOD1 = doc.getTextWidth(textoOD1);
  doc.text(textoOD1, xSinCorregir + (colSinCorregirAncho / 2 - anchoOD1) / 2, yPos + 3.5);
  
  // Centrar "O.I" en la segunda celda de SIN CORREGIR
  const textoOI1 = "O.I";
  const anchoOI1 = doc.getTextWidth(textoOI1);
  doc.text(textoOI1, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOI1) / 2, yPos + 3.5);
  
  // Centrar "O.D" en la primera celda de CORREGIDA
  const textoOD2 = "O.D";
  const anchoOD2 = doc.getTextWidth(textoOD2);
  doc.text(textoOD2, xCorregida + (colCorregidaAncho / 2 - anchoOD2) / 2, yPos + 3.5);
  
  // Centrar "O.I" en la segunda celda de CORREGIDA
  const textoOI2 = "O.I";
  const anchoOI2 = doc.getTextWidth(textoOI2);
  doc.text(textoOI2, mitadCorregida + (colCorregidaAncho / 2 - anchoOI2) / 2, yPos + 3.5);
  yPos += filaAlturaAgudeza;
  
  // Número de líneas que se mostrarán en cada fila de agudeza visual
  const lineasPorFila = 1;
  
  // Dibujar fila de datos para Visión de Cerca
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(xCorregida, yPos, xCorregida, yPos + filaAlturaAgudeza);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  // Línea horizontal superior solo hasta el final de CORREGIDA
  doc.line(tablaInicioX, yPos, xObservaciones, yPos);
  // Línea horizontal inferior solo hasta el final de CORREGIDA
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, xObservaciones, yPos + filaAlturaAgudeza);
  
  // Dibujar líneas verticales para dividir O.D y O.I en la fila de datos
  doc.line(mitadSinCorregir, yPos, mitadSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(mitadCorregida, yPos, mitadCorregida, yPos + filaAlturaAgudeza);
  
  // Contenido de la fila Visión de Cerca
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de Cerca:", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Centrar datos O.D y O.I en SIN CORREGIR
  const odSinCorregir = datosFinales.evaluacionOftalmologica?.vision?.cerca?.sinCorregir?.od || "";
  const oiSinCorregir = datosFinales.evaluacionOftalmologica?.vision?.cerca?.sinCorregir?.oi || "";
  const anchoOdSinCorregir = doc.getTextWidth(odSinCorregir);
  const anchoOiSinCorregir = doc.getTextWidth(oiSinCorregir);
  doc.text(odSinCorregir, xSinCorregir + (colSinCorregirAncho / 2 - anchoOdSinCorregir) / 2, yPos + 3.5);
  doc.text(oiSinCorregir, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOiSinCorregir) / 2, yPos + 3.5);
  
  // Centrar datos O.D y O.I en CORREGIDA
  const odCorregida = datosFinales.evaluacionOftalmologica?.vision?.cerca?.corregida?.od || "";
  const oiCorregida = datosFinales.evaluacionOftalmologica?.vision?.cerca?.corregida?.oi || "";
  const anchoOdCorregida = doc.getTextWidth(odCorregida);
  const anchoOiCorregida = doc.getTextWidth(oiCorregida);
  doc.text(odCorregida, xCorregida + (colCorregidaAncho / 2 - anchoOdCorregida) / 2, yPos + 3.5);
  doc.text(oiCorregida, mitadCorregida + (colCorregidaAncho / 2 - anchoOiCorregida) / 2, yPos + 3.5);
  
  // Mostrar las primeras líneas del texto de enfermedades oculares en esta fila
  // Asegurar que solo se muestren las líneas que caben en la altura disponible
  doc.setFont("helvetica", "normal").setFontSize(7);
  lines.slice(0, lineasPorFila).forEach((line, index) => {
    doc.text(line, xObservaciones + 4, yPos - 1 + (index * lineHeight));
  });
  
  yPos += filaAlturaAgudeza;

  // Línea horizontal separadora entre filas de datos (solo hasta el final de CORREGIDA)
  doc.line(tablaInicioX, yPos, xObservaciones, yPos);

  // Dibujar fila de datos para Visión de Lejos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(xCorregida, yPos, xCorregida, yPos + filaAlturaAgudeza);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  // Línea horizontal superior solo hasta el final de CORREGIDA
  doc.line(tablaInicioX, yPos, xObservaciones, yPos);
  // Línea horizontal inferior solo hasta el final de CORREGIDA
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, xObservaciones, yPos + filaAlturaAgudeza);
  
  // Dibujar líneas verticales para dividir O.D y O.I en la fila de datos
  doc.line(mitadSinCorregir, yPos, mitadSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(mitadCorregida, yPos, mitadCorregida, yPos + filaAlturaAgudeza);
  
  // Contenido de la fila Visión de Lejos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de Lejos:", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Centrar datos O.D y O.I en SIN CORREGIR
  const odLejosSinCorregir = datosFinales.evaluacionOftalmologica?.vision?.lejos?.sinCorregir?.od || "";
  const oiLejosSinCorregir = datosFinales.evaluacionOftalmologica?.vision?.lejos?.sinCorregir?.oi || "";
  const anchoOdLejosSinCorregir = doc.getTextWidth(odLejosSinCorregir);
  const anchoOiLejosSinCorregir = doc.getTextWidth(oiLejosSinCorregir);
  doc.text(odLejosSinCorregir, xSinCorregir + (colSinCorregirAncho / 2 - anchoOdLejosSinCorregir) / 2, yPos + 3.5);
  doc.text(oiLejosSinCorregir, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOiLejosSinCorregir) / 2, yPos + 3.5);
  
  // Centrar datos O.D y O.I en CORREGIDA
  const odLejosCorregida = datosFinales.evaluacionOftalmologica?.vision?.lejos?.corregida?.od || "";
  const oiLejosCorregida = datosFinales.evaluacionOftalmologica?.vision?.lejos?.corregida?.oi || "";
  const anchoOdLejosCorregida = doc.getTextWidth(odLejosCorregida);
  const anchoOiLejosCorregida = doc.getTextWidth(oiLejosCorregida);
  doc.text(odLejosCorregida, xCorregida + (colCorregidaAncho / 2 - anchoOdLejosCorregida) / 2, yPos + 3.5);
  doc.text(oiLejosCorregida, mitadCorregida + (colCorregidaAncho / 2 - anchoOiLejosCorregida) / 2, yPos + 3.5);
  
  // Continuar con las líneas restantes del texto de enfermedades oculares
  doc.setFont("helvetica", "normal").setFontSize(7);
  
  // Mostrar las líneas restantes en esta fila
  if (lines && lines.length > lineasPorFila) {
    lines.slice(lineasPorFila).forEach((line, index) => {
      doc.text(line, xObservaciones + 4, yPos - 1 + (index * lineHeight));
    });
  }
  
  yPos += filaAlturaAgudeza;

  // Dibujar fila adicional para REFLEJOS PUPILARES (sin líneas divisoras)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  
  // Contenido de la fila REFLEJOS PUPILARES
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reflejos Pupilares:", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionOftalmologica?.reflejosPupilares || "").toString().toUpperCase(), xObservaciones - 45, yPos + 3.5);
  
  yPos += filaAlturaAgudeza;

  // === FILA: VISIÓN DE COLORES ===
  // 4 columnas iguales
  const colAnchoVision = tablaAncho / 4;
  
  const xVision = tablaInicioX;
  const xIshihara = xVision + colAnchoVision;
  const xColores = xIshihara + colAnchoVision;
  const xProfundidad = xColores + colAnchoVision;
  
  // Dibujar líneas verticales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xIshihara, yPos, xIshihara, yPos + filaAltura);
  doc.line(xColores, yPos, xColores, yPos + filaAltura);
  doc.line(xProfundidad, yPos, xProfundidad, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Contenido de la fila Visión de Colores
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de colores:", xVision + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionOftalmologica?.visionColores || "").toString().toUpperCase(), xVision + 35, yPos + 3.5);
  
  // Test de Ishihara: true = Normal, false = Anormal, ambos false = vacío
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test de Ishihara:", xIshihara + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const ishiharaNormal = datosFinales.evaluacionOftalmologica?.testIshiharaNormal;
  const ishiharaAnormal = datosFinales.evaluacionOftalmologica?.testIshiharaAnormal;
  const ishiharaResultado = ishiharaNormal ? "NORMAL" : (ishiharaAnormal ? "ANORMAL" : "");
  doc.text(ishiharaResultado, xIshihara + 30, yPos + 3.5);
  
  // Test de colores puros: true = Normal, false = Anormal, ambos false = vacío
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test colores puros:", xColores + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const coloresPurosNormal = datosFinales.evaluacionOftalmologica?.testColoresPurosNormal;
  const coloresPurosAnormal = datosFinales.evaluacionOftalmologica?.testColoresPurosAnormal;
  const coloresPurosResultado = coloresPurosNormal ? "NORMAL" : (coloresPurosAnormal ? "ANORMAL" : "");
  doc.text(coloresPurosResultado, xColores + 30, yPos + 3.5);
  
  // Test de profundidad: true = Normal, false = Alterado, ambos false = vacío
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test profundidad:", xProfundidad + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const profundidadNormal = datosFinales.evaluacionOftalmologica?.testProfundidadNormal;
  const profundidadAnormal = datosFinales.evaluacionOftalmologica?.testProfundidadAnormal;
  const profundidadResultado = profundidadNormal ? "NORMAL" : (profundidadAnormal ? "ALTERADO" : "");
  doc.text(profundidadResultado, xProfundidad + 30, yPos + 3.5);
  
  yPos += filaAltura;

  // === SECCIÓN 8: OÍDOS ===
  // Fila gris: 8. OÍDOS
  doc.setFillColor(196, 196, 196); // Color gris
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("8. OÍDOS", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila títulos: Oído derecho | Oído izquierdo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const textoOidoDerecho = "OÍDO DERECHO";
  const anchoOidoDerecho = doc.getTextWidth(textoOidoDerecho);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(textoOidoDerecho, tablaInicioX + (tablaAncho / 2 - anchoOidoDerecho) / 2, yPos + 3.5);

  const textoOidoIzquierdo = "OÍDO IZQUIERDO";
  const anchoOidoIzquierdo = doc.getTextWidth(textoOidoIzquierdo);
  doc.text(textoOidoIzquierdo, tablaInicioX + tablaAncho / 2 + (tablaAncho / 2 - anchoOidoIzquierdo) / 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila frecuencias
  const numColsPerEarOidos = 8;
  const colWidthOidos = (tablaAncho / 2) / numColsPerEarOidos;
  const frequencies = [500, 1000, 2000, 3000, 4000, 5000, 8000];

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Líneas verticales para ambos lados
  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    for (let j = 0; j <= numColsPerEarOidos; j++) {
      const x = startX + j * colWidthOidos;
      doc.line(x, yPos, x, yPos + filaAltura);
    }
  }
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Etiqueta Hz en columna 0 y frecuencias en columnas 1-7
  doc.setFont("helvetica", "bold").setFontSize(7);
  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    // Hz en col 0
    const textoHz = "Hz";
    const anchoHz = doc.getTextWidth(textoHz);
    doc.text(textoHz, startX + (colWidthOidos - anchoHz) / 2, yPos + 3.5);
    // Frecuencias
    for (let k = 0; k < frequencies.length; k++) {
      const colIndex = k + 1;
      const x = startX + colIndex * colWidthOidos;
      const textoFreq = frequencies[k].toString();
      const anchoFreq = doc.getTextWidth(textoFreq);
      doc.text(textoFreq, x + (colWidthOidos - anchoFreq) / 2, yPos + 3.5);
    }
  }
  yPos += filaAltura;

  // Fila de datos
  // Líneas verticales para ambos lados
  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    for (let j = 0; j <= numColsPerEarOidos; j++) {
      const x = startX + j * colWidthOidos;
      doc.line(x, yPos, x, yPos + filaAltura);
    }
  }
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Etiquetas dB(A) en columna 0 y datos en 1-7
  doc.setFont("helvetica", "bold").setFontSize(8);
  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    const textoDb = "dB(A)";
    const anchoDb = doc.getTextWidth(textoDb);
    doc.text(textoDb, startX + (colWidthOidos - anchoDb) / 2, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Datos para oídos
  const rightFreqData = {
    500: datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia500 || "",
    1000: datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia1000 || "",
    2000: datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia2000 || "",
    3000: datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia3000 || "",
    4000: datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia4000 || "",
    5000: datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia5000 || "",
    8000: datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia8000 || ""
  };
  const leftFreqData = {
    500: datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia500 || "",
    1000: datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia1000 || "",
    2000: datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia2000 || "",
    3000: datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia3000 || "",
    4000: datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia4000 || "",
    5000: datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia5000 || "",
    8000: datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia8000 || ""
  };
  const allData = [rightFreqData, leftFreqData];

  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    const freqData = allData[side];
    for (let k = 0; k < frequencies.length; k++) {
      const freq = frequencies[k];
      const dataVal = freqData[freq] || "";
      const colIndex = k + 1;
      const x = startX + colIndex * colWidthOidos;
      const anchoData = doc.getTextWidth(dataVal);
      doc.text(dataVal, x + (colWidthOidos - anchoData) / 2, yPos + 3.5);
    }
  }
  yPos += filaAltura;

  // === FILA: OTOSCOPIA ===
  const col1Width = 30; // OTOSCOPIA
  const col2Width = (tablaAncho - col1Width) / 2; // O.D/O.I

  let x1 = tablaInicioX + col1Width;
  let x2 = x1 + col2Width;

  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(x1, yPos, x1, yPos + filaAltura);
  doc.line(x2, yPos, x2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OTOSCOPIA", tablaInicioX + 2, yPos + 3.5);
  doc.text("O.D:", x1 + 2, yPos + 3.5);
  doc.text("O.I:", x2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionOidos?.otoscopia?.oidoDerecho || "").toString().toUpperCase(), x1 + 20, yPos + 3.5);
  doc.text((datosFinales.evaluacionOidos?.otoscopia?.oidoIzquierdo || "").toString().toUpperCase(), x2 + 20, yPos + 3.5);
  yPos += filaAltura;


  // === FOOTER PÁGINA 1 ===
  footerTR(doc, { footerOffsetY: 8 });

  // === CREAR PÁGINA 2 ===
  // Forzar creación de segunda página para PULMONES y PIEL
  doc.addPage();
  numeroPagina = 2;
  yPos = 35.5; // Posición inicial de la nueva página

  // Dibujar header en la nueva página
  drawHeader(numeroPagina);

  // === PÁGINA 2: PULMONES, CARDIOVASCULAR Y PIEL ===
  
  // === SECCIÓN PULMONES ===
  yPos = dibujarHeaderSeccion("9. PULMONES", yPos, filaAltura);
  
  // Preparar contenido
  const tituloDescripcion = "Descripción: ";
  const contenidoPulmones = (datosFinales.evaluacionFisicaAdicional?.pulmones?.descripcion || "").toString().toUpperCase();
  const anchoTextoDisponible = tablaAncho - 4;
  doc.setFont("helvetica", "bold").setFontSize(8);
  const anchoTituloDesc = doc.getTextWidth(tituloDescripcion);
  const anchoContenido = anchoTextoDisponible - anchoTituloDesc - 2; // -2 para espacio entre título y contenido
  const lineasContenido = contenidoPulmones ? doc.splitTextToSize(contenidoPulmones, anchoContenido) : [""];
  
  // Altura de la sección (texto + fila de status)
  const alturaTexto = lineasContenido.length * 3 + 4;
  const alturaTotal = alturaTexto + filaAltura;
  
  // Dibujar líneas principales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotal);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotal);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaTotal, tablaInicioX + tablaAncho, yPos + alturaTotal);
  
  const yPosInicial = yPos;
  
  // Fila de status
  const colPulmonesWidth = 35;
  const colAnchoNormal = (tablaAncho - colPulmonesWidth) / 2;
  const colAnchoAnormal = colAnchoNormal;
  
  let xPulmones = tablaInicioX;
  let xNormal = xPulmones + colPulmonesWidth;
  let xAnormal = xNormal + colAnchoNormal;
  const xFinalColumna = tablaInicioX + tablaAncho;
  
  // Dibujar líneas de status
  doc.line(xPulmones, yPos, xPulmones, yPos + filaAltura);
  doc.line(xNormal, yPos, xNormal, yPos + filaAltura);
  doc.line(xAnormal, yPos, xAnormal, yPos + filaAltura);
  doc.line(xFinalColumna, yPos, xFinalColumna, yPos + filaAltura);
  
  // Cajoncitos para X
  const xPosicionXNormal = xNormal + colAnchoNormal - 8;
  const xPosicionXAnormal = xAnormal + colAnchoAnormal - 8;
  
  doc.line(xPosicionXNormal, yPos, xPosicionXNormal, yPos + filaAltura);
  doc.line(xPosicionXAnormal, yPos, xPosicionXAnormal, yPos + filaAltura);
  
  // Contenido de status
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PULMONES", xPulmones + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL", xNormal + 2, yPos + 3.5);
  doc.text("ANORMAL", xAnormal + 2, yPos + 3.5);
  
  // Marcar checkboxes
  if (datosFinales.evaluacionFisicaAdicional?.pulmones?.normal) {
    const anchoCajoncitoNormal = (xNormal + colAnchoNormal) - xPosicionXNormal;
    const centroCajoncitoNormal = xPosicionXNormal + (anchoCajoncitoNormal / 2);
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", centroCajoncitoNormal, yPos + 3.5);
  }
  if (datosFinales.evaluacionFisicaAdicional?.pulmones?.anormal) {
    const anchoCajoncitoAnormal = (xAnormal + colAnchoAnormal) - xPosicionXAnormal;
    const centroCajoncitoAnormal = xPosicionXAnormal + (anchoCajoncitoAnormal / 2);
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", centroCajoncitoAnormal, yPos + 3.5);
  }
  
  // Descripción
  const yPosDescripcion = yPos + filaAltura;
  doc.line(tablaInicioX, yPosDescripcion, tablaInicioX + tablaAncho, yPosDescripcion);
  const interlineadoDesc = 3;
  
  // Dibujar "Descripción:" en negritas
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Descripción:", tablaInicioX + 2, yPosDescripcion + 3.5);
  
  // Dibujar contenido en normal
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (lineasContenido.length > 0 && lineasContenido[0] !== "") {
    lineasContenido.forEach((linea, index) => {
      if (index === 0) {
        // Primera línea al lado del título
        doc.text(linea, tablaInicioX + 2 + anchoTituloDesc + 2, yPosDescripcion + 3.5);
      } else {
        // Resto de líneas desde el inicio
        doc.text(linea, tablaInicioX + 2, yPosDescripcion + 3.5 + (index * interlineadoDesc));
      }
    });
  }
  
  yPos = yPosInicial + alturaTotal;

    // Fila: CARDIOVASCULAR dentro de la sección PULMONES
    const tituloCardiovascular = "Cardiovascular: ";
    const datoCardiovascular = (datosFinales.cardiovascular || "").toString().toUpperCase();
    const textoCardiovascular = tituloCardiovascular + datoCardiovascular;
    const anchoDisponibleCardiovascular = tablaAncho - 4;
    const lineasCardiovascular = doc.splitTextToSize(textoCardiovascular, anchoDisponibleCardiovascular);
    const alturaDinamicaCardiovascular = Math.max(filaAltura, lineasCardiovascular.length * 2.5 + 2);

    // Dibujar líneas de la fila dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaCardiovascular);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaCardiovascular);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaDinamicaCardiovascular, tablaInicioX + tablaAncho, yPos + alturaDinamicaCardiovascular);

    // Contenido con formato mixto
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(tituloCardiovascular, tablaInicioX + 2, yPos + 3.5);
    const anchoTituloCardiovascular = doc.getTextWidth(tituloCardiovascular);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datoCardiovascular, tablaInicioX + 2 + anchoTituloCardiovascular + 5, yPos + 3.5);
    yPos += alturaDinamicaCardiovascular;

  // === SECCIÓN PIEL ===
  yPos = dibujarHeaderSeccion("10. PIEL", yPos, filaAltura);

    // Fila: PIEL | Normal | | Anormal | X |
    const colPielWidth = 45;
    const colAnchoNormalPiel = (tablaAncho - colPielWidth) / 2; // Mitad del espacio restante
    const colAnchoAnormalPiel = colAnchoNormalPiel; // Mismo ancho para Anormal
    
    let xPiel = tablaInicioX;
    let xNormalPiel = xPiel + colPielWidth;
    let xAnormalPiel = xNormalPiel + colAnchoNormalPiel;

    // Dibujar líneas principales de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    
    // Línea vertical después de "PIEL"
    doc.line(xNormalPiel, yPos, xNormalPiel, yPos + filaAltura);
    
    // Línea vertical después de "Normal" (para separar de "Anormal")
    doc.line(xAnormalPiel, yPos, xAnormalPiel, yPos + filaAltura);
    
    // Crear cajoncitos para las X (8mm antes del final de cada columna)
    const xPosicionXNormalPiel = xNormalPiel + colAnchoNormalPiel - 8; // Línea vertical antes de la X para Normal
    const xPosicionXAnormalPiel = xAnormalPiel + colAnchoAnormalPiel - 8; // Línea vertical antes de la X para Anormal
    
    // Dibujar cajoncito de X para Normal
    doc.line(xPosicionXNormalPiel, yPos, xPosicionXNormalPiel, yPos + filaAltura);
    
    // Dibujar cajoncito de X para Anormal
    doc.line(xPosicionXAnormalPiel, yPos, xPosicionXAnormalPiel, yPos + filaAltura);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("PIEL", xPiel + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("NORMAL", xNormalPiel + 2, yPos + 3.5);
    doc.text("ANORMAL", xAnormalPiel + 2, yPos + 3.5);

    // Marcar checkboxes según los datos (centrando la X en el cajoncito)
    if (datosFinales.evaluacionFisicaAdicional?.piel?.normal) {
      const anchoCajoncitoNormalPiel = (xNormalPiel + colAnchoNormalPiel) - xPosicionXNormalPiel;
      const centroCajoncitoNormalPiel = xPosicionXNormalPiel + (anchoCajoncitoNormalPiel / 2);
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", centroCajoncitoNormalPiel, yPos + 3.5);
    }
    if (datosFinales.evaluacionFisicaAdicional?.piel?.anormal) {
      const anchoCajoncitoAnormalPiel = (xAnormalPiel + colAnchoAnormalPiel) - xPosicionXAnormalPiel;
      const centroCajoncitoAnormalPiel = xPosicionXAnormalPiel + (anchoCajoncitoAnormalPiel / 2);
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", centroCajoncitoAnormalPiel, yPos + 3.5);
    }
    yPos += filaAltura;

    // Fila de descripción de PIEL
    const tituloDescripcionPiel = "Descripción: ";
    const contenidoPiel = (datosFinales.evaluacionFisicaAdicional?.piel?.descripcion || "").toString().toUpperCase();
    const anchoDisponiblePiel = tablaAncho - 4;
    doc.setFont("helvetica", "bold").setFontSize(8);
    const anchoTituloDescPiel = doc.getTextWidth(tituloDescripcionPiel);
    const anchoContenidoPiel = anchoDisponiblePiel - anchoTituloDescPiel - 2; // -2 para espacio entre título y contenido
    const lineasContenidoPiel = contenidoPiel ? doc.splitTextToSize(contenidoPiel, anchoContenidoPiel) : [""];
    const alturaDinamicaPiel = Math.max(filaAltura, (lineasContenidoPiel.length * 2.5) + 2);

    // Dibujar líneas de la fila dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaPiel);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaPiel);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaDinamicaPiel, tablaInicioX + tablaAncho, yPos + alturaDinamicaPiel);

    // Contenido de descripción
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Descripción:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (lineasContenidoPiel.length > 0 && lineasContenidoPiel[0] !== "") {
      lineasContenidoPiel.forEach((linea, index) => {
        if (index === 0) {
          // Primera línea al lado del título
          doc.text(linea, tablaInicioX + 2 + anchoTituloDescPiel + 2, yPos + 3.5);
        } else {
          // Resto de líneas desde el inicio
          doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * 2.5));
        }
      });
    }
    yPos += alturaDinamicaPiel;

  // === SECCIÓN MIEMBROS SUPERIORES ===
  yPos = dibujarHeaderSeccion("11. MIEMBROS SUPERIORES", yPos, filaAltura);

  // Fila de Miembros Superiores con altura dinámica
  const tituloMiembrosSuperiores = "Miembros Superiores: ";
  const datoMiembrosSuperiores = (datosFinales.evaluacionFisicaAdicional?.miembrosSuperiores || "").toString().toUpperCase();
  const textoMiembrosSuperiores = tituloMiembrosSuperiores + datoMiembrosSuperiores;
  const anchoDisponibleMiembrosSuperiores = tablaAncho - 4;
  const lineasMiembrosSuperiores = doc.splitTextToSize(textoMiembrosSuperiores, anchoDisponibleMiembrosSuperiores);
  const alturaDinamicaMiembrosSuperiores = Math.max(filaAltura, lineasMiembrosSuperiores.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaMiembrosSuperiores);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosSuperiores);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaMiembrosSuperiores, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosSuperiores);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloMiembrosSuperiores, tablaInicioX + 2, yPos + 3.5);
  const anchoTitulo = doc.getTextWidth(tituloMiembrosSuperiores);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoMiembrosSuperiores, tablaInicioX + 2 + anchoTitulo + 5, yPos + 3.5);
  yPos += alturaDinamicaMiembrosSuperiores;

  // === SECCIÓN MIEMBROS INFERIORES ===
  yPos = dibujarHeaderSeccion("12. MIEMBROS INFERIORES", yPos, filaAltura);

  // Fila de Miembros Inferiores con altura dinámica
  const tituloMiembrosInferiores = "Miembros Inferiores: ";
  const datoMiembrosInferiores = (datosFinales.evaluacionFisicaAdicional?.miembrosInferiores || "").toString().toUpperCase();
  const textoMiembrosInferiores = tituloMiembrosInferiores + datoMiembrosInferiores;
  const anchoDisponibleMiembrosInferiores = tablaAncho - 4;
  const lineasMiembrosInferiores = doc.splitTextToSize(textoMiembrosInferiores, anchoDisponibleMiembrosInferiores);
  const alturaDinamicaMiembrosInferiores = Math.max(filaAltura, lineasMiembrosInferiores.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaMiembrosInferiores);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosInferiores);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaMiembrosInferiores, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosInferiores);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloMiembrosInferiores, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloInferiores = doc.getTextWidth(tituloMiembrosInferiores);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoMiembrosInferiores, tablaInicioX + 2 + anchoTituloInferiores + 5, yPos + 3.5);
  yPos += alturaDinamicaMiembrosInferiores;

  // === FILA: REFLEJOS OSTEO-TENDINOSOS Y MARCHA ===
  const tituloReflejos = "Reflejos Osteotendinosos: ";
  const datoReflejos = (datosFinales.evaluacionNeurologica?.reflejosOsteotendinosos || "").toString().toUpperCase();
  const textoReflejos = tituloReflejos + datoReflejos;
  
  const tituloMarcha = "Marcha: ";
  const datoMarcha = (datosFinales.evaluacionNeurologica?.marcha || "").toString().toUpperCase();
  const textoMarcha = tituloMarcha + datoMarcha;
  
  // Calcular altura dinámica para cada columna
  const anchoDisponibleReflejos = tablaAncho / 2 - 4;
  const anchoDisponibleMarcha = tablaAncho / 2 - 4;
  
  const lineasReflejos = doc.splitTextToSize(textoReflejos, anchoDisponibleReflejos);
  const lineasMarcha = doc.splitTextToSize(textoMarcha, anchoDisponibleMarcha);
  
  // Usar la altura de la columna con más líneas
  const maxLineasReflejosMarcha = Math.max(lineasReflejos.length, lineasMarcha.length);
  const alturaDinamicaReflejosMarcha = Math.max(filaAltura, maxLineasReflejosMarcha * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaReflejosMarcha);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaReflejosMarcha);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaReflejosMarcha);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaReflejosMarcha, tablaInicioX + tablaAncho, yPos + alturaDinamicaReflejosMarcha);

  // Contenido con formato mixto
  // Reflejos Osteotendinosos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloReflejos, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloReflejos = doc.getTextWidth(tituloReflejos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoReflejos, tablaInicioX + 2 + anchoTituloReflejos + 5  , yPos + 3.5);
  
  // Marcha
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloMarcha, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  const anchoTituloMarcha = doc.getTextWidth(tituloMarcha);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoMarcha, tablaInicioX + tablaAncho / 2 + 2 + anchoTituloMarcha + 5, yPos + 3.5);
  yPos += alturaDinamicaReflejosMarcha;

  // === FILA: COLUMNA VERTEBRAL ===
  const tituloColumna = "Columna Vertebral: ";
  const datoColumna = (datosFinales.evaluacionColumnaAbdomen?.columnaVertebral || "").toString().toUpperCase();
  const textoColumna = tituloColumna + datoColumna;
  const anchoDisponibleColumna = tablaAncho - 4;
  const lineasColumna = doc.splitTextToSize(textoColumna, anchoDisponibleColumna);
  const alturaDinamicaColumna = Math.max(filaAltura, lineasColumna.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaColumna);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaColumna);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaColumna, tablaInicioX + tablaAncho, yPos + alturaDinamicaColumna);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloColumna, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloColumna = doc.getTextWidth(tituloColumna);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoColumna, tablaInicioX + 2 + anchoTituloColumna + 5, yPos + 3.5);
  yPos += alturaDinamicaColumna;

  // === FILA: ABDOMEN Y TACTO RECTAL ===
  const tituloAbdomen = "Abdomen: ";
  const datoAbdomen = (datosFinales.evaluacionColumnaAbdomen?.abdomen || "").toString().toUpperCase();
  const textoAbdomen = tituloAbdomen + datoAbdomen;
  // Función para determinar el estado del tacto rectal
  const obtenerEstadoTactoRectal = () => {
    if (datosFinales.evaluacionRectalHernias?.tactoRectal?.normal) return "NORMAL";
    if (datosFinales.evaluacionRectalHernias?.tactoRectal?.anormal) return "ANORMAL";
    if (datosFinales.evaluacionRectalHernias?.tactoRectal?.noSeHizo) return "NO SE HIZO";
    return "";
  };
  
  const tituloTactoRectal = "Tacto Rectal: ";
  const datoTactoRectal = obtenerEstadoTactoRectal();
  const textoTactoRectal = tituloTactoRectal + "  " + datoTactoRectal; // Adding 10mm spacing
  
  // Calcular altura dinámica para cada columna
  const anchoDisponibleAbdomen = tablaAncho / 2 - 4;
  const anchoDisponibleTactoRectal = tablaAncho / 2 - 4;
  
  const lineasAbdomen = doc.splitTextToSize(textoAbdomen, anchoDisponibleAbdomen);
  const lineasTactoRectal = doc.splitTextToSize(textoTactoRectal, anchoDisponibleTactoRectal);
  
  // Usar la altura de la columna con más líneas
  const maxLineasAbdomenTacto = Math.max(lineasAbdomen.length, lineasTactoRectal.length);
  const alturaDinamicaAbdomenTacto = Math.max(filaAltura, maxLineasAbdomenTacto * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaAbdomenTacto);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaAbdomenTacto);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaAbdomenTacto);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaAbdomenTacto, tablaInicioX + tablaAncho, yPos + alturaDinamicaAbdomenTacto);

  // Contenido con formato mixto
  // Abdomen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloAbdomen, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloAbdomen = doc.getTextWidth(tituloAbdomen);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoAbdomen, tablaInicioX + 2 + anchoTituloAbdomen + 5, yPos + 3.5);
  
  // Tacto Rectal
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloTactoRectal, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  const anchoTituloTactoRectal = doc.getTextWidth(tituloTactoRectal);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoTactoRectal, tablaInicioX + tablaAncho / 2 + 2 + anchoTituloTactoRectal + 5, yPos + 3.5);
  yPos += alturaDinamicaAbdomenTacto;

  // === FILA: ANILLOS INGUINALES, HERNIAS Y VARICES ===
  const tituloAnillos = "Anillos Inguinales: ";
  const datoAnillos = (datosFinales.evaluacionColumnaAbdomen?.anillosInguinales || "").toString().toUpperCase();
  const textoAnillos = tituloAnillos + datoAnillos;
  
  const tituloHernias = "Hernias: ";
  const datoHernias = (datosFinales.evaluacionRectalHernias?.hernias || "").toString().toUpperCase();
  const textoHernias = tituloHernias + datoHernias;
  
  const tituloVarices = "Varices: ";
  const datoVarices = (datosFinales.evaluacionRectalHernias?.varices || "").toString().toUpperCase();
  const textoVarices = tituloVarices + datoVarices;
  
  // Calcular altura dinámica para cada columna (3 columnas)
  const anchoDisponibleAnillos = tablaAncho / 3 - 4;
  const anchoDisponibleHernias = tablaAncho / 3 - 4;
  const anchoDisponibleVarices = tablaAncho / 3 - 4;
  
  const lineasAnillos = doc.splitTextToSize(textoAnillos, anchoDisponibleAnillos);
  const lineasHernias = doc.splitTextToSize(textoHernias, anchoDisponibleHernias);
  const lineasVarices = doc.splitTextToSize(textoVarices, anchoDisponibleVarices);
  
  // Usar la altura de la columna con más líneas
  const maxLineasAnillosHerniasVarices = Math.max(lineasAnillos.length, lineasHernias.length, lineasVarices.length);
  const alturaDinamicaAnillosHerniasVarices = Math.max(filaAltura, maxLineasAnillosHerniasVarices * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaAnillosHerniasVarices);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + alturaDinamicaAnillosHerniasVarices);
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + alturaDinamicaAnillosHerniasVarices);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnillosHerniasVarices);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaAnillosHerniasVarices, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnillosHerniasVarices);

  // Contenido con formato mixto
  // Anillos Inguinales
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloAnillos, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloAnillos = doc.getTextWidth(tituloAnillos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoAnillos, tablaInicioX + 2 + anchoTituloAnillos + 5, yPos + 3.5);
  
  // Hernias
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloHernias, tablaInicioX + tablaAncho / 3 + 2, yPos + 3.5);
  const anchoTituloHernias = doc.getTextWidth(tituloHernias);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoHernias, tablaInicioX + tablaAncho / 3 + 2 + anchoTituloHernias + 5, yPos + 3.5);
  
  // Varices
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloVarices, tablaInicioX + (2 * tablaAncho / 3) + 2, yPos + 3.5);
  const anchoTituloVarices = doc.getTextWidth(tituloVarices);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoVarices, tablaInicioX + (2 * tablaAncho / 3) + 2 + anchoTituloVarices + 5, yPos + 3.5);
  yPos += alturaDinamicaAnillosHerniasVarices;

  // === FILA: ÓRGANOS GENITALES Y GANGLIOS LINFÁTICOS ===
  const tituloOrganos = "Órganos Genitales: ";
  const datoOrganos = (datosFinales.evaluacionColumnaAbdomen?.organosGenitales || "").toString().toUpperCase();
  const textoOrganos = tituloOrganos + datoOrganos;
  
  const tituloGanglios = "Ganglios Linfáticos: ";
  const datoGanglios = (datosFinales.evaluacionRectalHernias?.gangliosLinfaticos || "").toString().toUpperCase();
  const textoGanglios = tituloGanglios + datoGanglios;
  
  // Calcular altura dinámica para cada columna
  const anchoDisponibleOrganos = tablaAncho / 2 - 4;
  const anchoDisponibleGanglios = tablaAncho / 2 - 4;
  
  const lineasOrganos = doc.splitTextToSize(textoOrganos, anchoDisponibleOrganos);
  const lineasGanglios = doc.splitTextToSize(textoGanglios, anchoDisponibleGanglios);
  
  // Usar la altura de la columna con más líneas
  const maxLineasOrganosGanglios = Math.max(lineasOrganos.length, lineasGanglios.length);
  const alturaDinamicaOrganosGanglios = Math.max(filaAltura, maxLineasOrganosGanglios * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaOrganosGanglios);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaOrganosGanglios);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaOrganosGanglios);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaOrganosGanglios, tablaInicioX + tablaAncho, yPos + alturaDinamicaOrganosGanglios);

  // Contenido con formato mixto
  // Órganos Genitales
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloOrganos, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloOrganos = doc.getTextWidth(tituloOrganos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoOrganos, tablaInicioX + 2 + anchoTituloOrganos + 5, yPos + 3.5);
  
  // Ganglios Linfáticos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloGanglios, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  const anchoTituloGanglios = doc.getTextWidth(tituloGanglios);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoGanglios, tablaInicioX + tablaAncho / 2 + 2 + anchoTituloGanglios + 5, yPos + 3.5);
  yPos += alturaDinamicaOrganosGanglios;

  // === FILA: LENGUAJE, ATENCIÓN, MEMORIA, INTELIGENCIA, ORIENTACIÓN, AFECTIVIDAD ===
  const tituloLenguaje = "Lenguaje, Atención, Memoria, Inteligencia, Orientación, Afectividad: ";
  const datoLenguaje = (datosFinales.evaluacionMental?.lenguajeAtencionMemoria || "").toString().toUpperCase();
  const textoLenguaje = tituloLenguaje + datoLenguaje;
  const anchoDisponibleLenguaje = tablaAncho - 4;
  const lineasLenguaje = doc.splitTextToSize(textoLenguaje, anchoDisponibleLenguaje);
  const alturaDinamicaLenguaje = Math.max(filaAltura, lineasLenguaje.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaLenguaje);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaLenguaje);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaLenguaje, tablaInicioX + tablaAncho, yPos + alturaDinamicaLenguaje);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloLenguaje, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloLenguaje = doc.getTextWidth(tituloLenguaje);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoLenguaje, tablaInicioX + 2 + anchoTituloLenguaje + 5, yPos + 3.5);
  yPos += alturaDinamicaLenguaje;

  // === FILA: ANAMNESIS ===
  const tituloAnamnesis = "Anamnesis: ";
  const datoAnamnesis = datosFinales.evaluacionMental?.anamnesis || "";
  const textoAnamnesis = tituloAnamnesis + datoAnamnesis;
  const anchoDisponibleAnamnesis = tablaAncho - 8; // Aumentar el ancho disponible para usar todo el espacio
  const lineasAnamnesis = doc.splitTextToSize(textoAnamnesis, anchoDisponibleAnamnesis);
  const interlineadoAnamnesis = 3;
  const alturaDinamicaAnamnesis = Math.max(filaAltura, lineasAnamnesis.length * interlineadoAnamnesis + 4);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaAnamnesis);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnamnesis);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaAnamnesis, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnamnesis);

  // Contenido dibujado línea por línea
  doc.setFont("helvetica", "normal").setFontSize(8);
  lineasAnamnesis.forEach((linea, index) => {
    // Primera línea con título en negrita
    if (index === 0) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text("Anamnesis:", tablaInicioX + 2, yPos + 3.5);
      const anchoTitulo = doc.getTextWidth("Anamnesis: ");
      doc.setFont("helvetica", "normal").setFontSize(8);
      const restoTexto = linea.replace("Anamnesis: ", "");
      if (restoTexto.trim()) {
        doc.text(restoTexto, tablaInicioX + 2 + anchoTitulo, yPos + 3.5);
      }
    } else {
      doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoAnamnesis));
    }
  });
  yPos += alturaDinamicaAnamnesis;

  // === FILA: ESTADO MENTAL ===
  const tituloEstadoMental = "Estado Mental: ";
  const datoEstadoMental = (datosFinales.evaluacionMental?.estadoMental || "").toString().toUpperCase();
  const textoEstadoMental = tituloEstadoMental + datoEstadoMental;
  const anchoDisponibleEstadoMental = tablaAncho - 4;
  const lineasEstadoMental = doc.splitTextToSize(textoEstadoMental, anchoDisponibleEstadoMental);
  const alturaDinamicaEstadoMental = Math.max(filaAltura, lineasEstadoMental.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaEstadoMental);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaEstadoMental);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaEstadoMental, tablaInicioX + tablaAncho, yPos + alturaDinamicaEstadoMental);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloEstadoMental, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloEstadoMental = doc.getTextWidth(tituloEstadoMental);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoEstadoMental, tablaInicioX + 2 + anchoTituloEstadoMental, yPos + 3.5);
  yPos += alturaDinamicaEstadoMental;

  // === FILA: 3 COLUMNAS - RX (izq) | IMAGEN (centro) | CAMPOS PULMONARES (der) ===
  // Estructura de tres columnas
  const anchoCol1 = tablaAncho * 0.35; // Columna 1: Datos RX (35%)
  const anchoCol2 = tablaAncho * 0.30; // Columna 2: Imagen (30%)
  const anchoCol3 = tablaAncho * 0.35; // Columna 3: Campos pulmonares (35%)
  const puntoDivision1 = tablaInicioX + anchoCol1;
  const puntoDivision2 = puntoDivision1 + anchoCol2;
  
  // Preparar datos columna 1 (RX)
  const tituloNroRx = "Nro Rayos X: ";
  const datoNroRx = (datosFinales.nroRx || "").toString().toUpperCase();
  const tituloFechaRx = "Fecha: ";
  const datoFechaRx = (datosFinales.fechaRx || "").toString().toUpperCase();
  const tituloCalidadRx = "Calidad: ";
  const datoCalidadRx = (datosFinales.calidadRx || "").toString().toUpperCase();
  const tituloSimbolosRx = "Símbolos: ";
  const datoSimbolosRx = (datosFinales.simbolosRx || "").toString().toUpperCase();
  
  // Preparar datos columna 3 (Campos Pulmonares)
  const tituloCamposPulmonares = "CAMPO PULMONARES";
  const tituloMediastinos = "Mediastinos: ";
  const datoMediastinos = (datosFinales.mediastinos || "").toString().toUpperCase();
  const tituloHilios = "Hilios: ";
  const datoHilios = (datosFinales.hilios || "").toString().toUpperCase();
  const tituloSenos = "Senos: ";
  const datoSenos = (datosFinales.senos || "").toString().toUpperCase();
  
  // Calcular altura necesaria (la más alta entre las columnas 1 y 3)
  const alturaPorFila = 5; // Altura de cada fila de campo
  const alturaTotalCampos = alturaPorFila * 4; // 4 filas en columna 1 y 4 en columna 3
  const alturaTotalRx = Math.max(25, alturaTotalCampos); // Mínimo 25mm para imagen
  
  const yPosInicialRx = yPos;
  
  // Dibujar líneas principales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotalRx);
  doc.line(puntoDivision1, yPos, puntoDivision1, yPos + alturaTotalRx); // División col1-col2
  doc.line(puntoDivision2, yPos, puntoDivision2, yPos + alturaTotalRx); // División col2-col3
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotalRx);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaTotalRx, tablaInicioX + tablaAncho, yPos + alturaTotalRx);
  
  // === COLUMNA 1: Datos RX (izquierda) ===
  let yActual = yPos;
  
  // Fila 1: Nro Rayos X
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloNroRx, tablaInicioX + 2, yActual + 3.5);
  const anchoTituloNroRx = doc.getTextWidth(tituloNroRx);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoNroRx, tablaInicioX + 2 + anchoTituloNroRx + 5, yActual + 3.5);
  yActual += alturaPorFila;
  doc.line(tablaInicioX, yActual, puntoDivision1, yActual); // Línea divisoria horizontal
  
  // Fila 2: Fecha
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloFechaRx, tablaInicioX + 2, yActual + 3.5);
  const anchoTituloFechaRx = doc.getTextWidth(tituloFechaRx);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoFechaRx, tablaInicioX + 2 + anchoTituloFechaRx + 5, yActual + 3.5);
  yActual += alturaPorFila;
  doc.line(tablaInicioX, yActual, puntoDivision1, yActual); // Línea divisoria horizontal
  
  // Fila 3: Calidad
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloCalidadRx, tablaInicioX + 2, yActual + 3.5);
  const anchoTituloCalidadRx = doc.getTextWidth(tituloCalidadRx);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoCalidadRx, tablaInicioX + 2 + anchoTituloCalidadRx + 5, yActual + 3.5);
  yActual += alturaPorFila;
  doc.line(tablaInicioX, yActual, puntoDivision1, yActual); // Línea divisoria horizontal
  
  // Fila 4: Símbolos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloSimbolosRx, tablaInicioX + 2, yActual + 3.5);
  const anchoTituloSimbolosRx = doc.getTextWidth(tituloSimbolosRx);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoSimbolosRx, tablaInicioX + 2 + anchoTituloSimbolosRx + 5, yActual + 3.5);
  
  // === COLUMNA 2: Imagen de pulmones centrada (centro) ===
  try {
    const imgPulmones = '/img/Anexo16/pulmonesFrame.png';
    const imgWidth = 20;
    const imgHeight = 20;
    // Centrar horizontalmente en columna 2
    const imgX = puntoDivision1 + (anchoCol2 - imgWidth) / 2;
    // Centrar verticalmente
    const imgY = yPosInicialRx + (alturaTotalRx - imgHeight) / 2;
    doc.addImage(imgPulmones, 'PNG', imgX, imgY, imgWidth, imgHeight);
  } catch (error) {
    console.log('No se pudo cargar la imagen de pulmones:', error);
  }
  
  // === COLUMNA 3: Campos Pulmonares (derecha) ===
  yActual = yPos;
  
  // Fila 1: CAMPO PULMONARES (título)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloCamposPulmonares, puntoDivision2 + 2, yActual + 3.5);
  yActual += alturaPorFila;
  doc.line(puntoDivision2, yActual, tablaInicioX + tablaAncho, yActual); // Línea divisoria horizontal
  
  // Fila 2: Mediastinos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloMediastinos, puntoDivision2 + 2, yActual + 3.5);
  const anchoTituloMediastinos = doc.getTextWidth(tituloMediastinos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoMediastinos, puntoDivision2 + 2 + anchoTituloMediastinos + 5, yActual + 3.5);
  yActual += alturaPorFila;
  doc.line(puntoDivision2, yActual, tablaInicioX + tablaAncho, yActual); // Línea divisoria horizontal
  
  // Fila 3: Hilios
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloHilios, puntoDivision2 + 2, yActual + 3.5);
  const anchoTituloHilios = doc.getTextWidth(tituloHilios);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoHilios, puntoDivision2 + 2 + anchoTituloHilios + 5, yActual + 3.5);
  yActual += alturaPorFila;
  doc.line(puntoDivision2, yActual, tablaInicioX + tablaAncho, yActual); // Línea divisoria horizontal
  
  // Fila 4: Senos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloSenos, puntoDivision2 + 2, yActual + 3.5);
  const anchoTituloSenos = doc.getTextWidth(tituloSenos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoSenos, puntoDivision2 + 2 + anchoTituloSenos + 5, yActual + 3.5);
  
  yPos += alturaTotalRx;

  // === FILA: VÉRTICES ===
  const tituloVertices = "Vértices: ";
  const datoVertices = (datosFinales.vertices || "").toString().toUpperCase();
  const textoVertices = tituloVertices + datoVertices;
  const anchoDisponibleVertices = tablaAncho - 4;
  const lineasVertices = doc.splitTextToSize(textoVertices, anchoDisponibleVertices);
  const alturaDinamicaVertices = Math.max(filaAltura, lineasVertices.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaVertices);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaVertices);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaVertices, tablaInicioX + tablaAncho, yPos + alturaDinamicaVertices);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloVertices, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloVertices = doc.getTextWidth(tituloVertices);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoVertices, tablaInicioX + 2 + anchoTituloVertices + 5, yPos + 3.5);
  yPos += alturaDinamicaVertices;


  // === FILA: SILUETA CARDIOVASCULAR ===
  const tituloSilueta = "Silueta Cardiovascular: ";
  const datoSilueta = (datosFinales.siluetaCardiovascular || "").toString().toUpperCase();
  const textoSilueta = tituloSilueta + datoSilueta;
  const anchoDisponibleSilueta = tablaAncho - 4;
  const lineasSilueta = doc.splitTextToSize(textoSilueta, anchoDisponibleSilueta);
  const alturaDinamicaSilueta = Math.max(filaAltura, lineasSilueta.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaSilueta);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaSilueta);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaSilueta, tablaInicioX + tablaAncho, yPos + alturaDinamicaSilueta);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloSilueta, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloSilueta = doc.getTextWidth(tituloSilueta);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoSilueta, tablaInicioX + 2 + anchoTituloSilueta + 5, yPos + 3.5);
  yPos += alturaDinamicaSilueta;

  // === FILA: CONCLUSIONES RADIOGRÁFICAS ===
  const tituloConclusiones = "Conclusiones Radiográficas: ";
  const datoConclusiones = (datosFinales.conclusionesRadiograficas || "").toString().toUpperCase();
  const textoConclusiones = tituloConclusiones + datoConclusiones;
  const anchoDisponibleConclusiones = tablaAncho - 4;
  const lineasConclusiones = doc.splitTextToSize(textoConclusiones, anchoDisponibleConclusiones);
  const alturaDinamicaConclusiones = Math.max(filaAltura, lineasConclusiones.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaConclusiones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusiones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaConclusiones, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusiones);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloConclusiones, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloConclusiones = doc.getTextWidth(tituloConclusiones);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoConclusiones, tablaInicioX + 2 + anchoTituloConclusiones + 5 , yPos + 3.5);
  yPos += alturaDinamicaConclusiones;

  // === NUEVA SECCIÓN PARA CLASIFICACIÓN ILO NEUMOCONIOSIS (AGREGADA PARA PÁGINA 2) ===
  yPos = dibujarHeaderSeccion("13. CLASIFICACIÓN NEUMOCONIOSIS", yPos, filaAltura);

  // Altura reducida para las filas de esta sección (0.35mm menos)
  const filaAlturaNeumo = filaAltura - 0.35;

  // Definir columnas para la tabla ILO (7 columnas con anchos personalizados)
  // Reducir A B C y ST, aumentar 0/0 y 1/0
  const numColsILO = 7;
  const colWidthsILO = [
    tablaAncho * 0.18,  // 0/0 - aumentado
    tablaAncho * 0.18,  // 1/0 - aumentado
    tablaAncho * 0.15,  // 1/1 1/2
    tablaAncho * 0.15,  // 2/1 2/2 2/3
    tablaAncho * 0.15,  // 3/2 3/3 3/+
    tablaAncho * 0.10,  // A B C - reducido
    tablaAncho * 0.09   // ST - reducido
  ];
  
  const colPositionsILO = [tablaInicioX];
  let acumulado = tablaInicioX;
  for (let i = 0; i < numColsILO; i++) {
    acumulado += colWidthsILO[i];
    colPositionsILO.push(acumulado);
  }

  // Fila 1: Espacio para X (fila superior para marcar la categoría)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaNeumo);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAlturaNeumo);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaNeumo);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaNeumo, tablaInicioX + tablaAncho, yPos + filaAlturaNeumo);

  // Agregar división en el medio de la tercera celda (índice 2)
  const terceraCeldaMitad = colPositionsILO[2] + (colWidthsILO[2] / 2);
  doc.line(terceraCeldaMitad, yPos, terceraCeldaMitad, yPos + filaAlturaNeumo);

  // Agregar dos divisiones en la cuarta celda (índice 3)
  const cuartaCeldaTercio1 = colPositionsILO[3] + (colWidthsILO[3] / 3);
  const cuartaCeldaTercio2 = colPositionsILO[3] + (2 * colWidthsILO[3] / 3);
  doc.line(cuartaCeldaTercio1, yPos, cuartaCeldaTercio1, yPos + filaAlturaNeumo);
  doc.line(cuartaCeldaTercio2, yPos, cuartaCeldaTercio2, yPos + filaAlturaNeumo);

  // Agregar dos divisiones en la quinta celda (índice 4) para "3/2 3/3 3/+"
  const quintaCeldaTercio1 = colPositionsILO[4] + (colWidthsILO[4] / 3);
  const quintaCeldaTercio2 = colPositionsILO[4] + (2 * colWidthsILO[4] / 3);
  doc.line(quintaCeldaTercio1, yPos, quintaCeldaTercio1, yPos + filaAlturaNeumo);
  doc.line(quintaCeldaTercio2, yPos, quintaCeldaTercio2, yPos + filaAlturaNeumo);

  // Colocar X en la columna correspondiente según datosFinales.neumoconiosisCategoria
  let xPosILO = 0;
  if (datosFinales.neumoconiosisCategoria) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    const anchoX = doc.getTextWidth("X");
    
    // Calcular posición X basada en la categoría específica
    if (datosFinales.neumoconiosisCategoria === '0/0') {
      xPosILO = colPositionsILO[0] + (colWidthsILO[0] / 2);
    } else if (datosFinales.neumoconiosisCategoria === '1/0') {
      xPosILO = colPositionsILO[1] + (colWidthsILO[1] / 2);
    } else if (datosFinales.neumoconiosisCategoria === '1/1') {
      xPosILO = colPositionsILO[2] + (colWidthsILO[2] / 4); // Primera mitad de la celda 2
    } else if (datosFinales.neumoconiosisCategoria === '1/2') {
      xPosILO = terceraCeldaMitad + (colWidthsILO[2] / 4); // Segunda mitad de la celda 2
    } else if (datosFinales.neumoconiosisCategoria === '2/1') {
      xPosILO = colPositionsILO[3] + (colWidthsILO[3] / 6); // Primera tercera parte de la celda 3
    } else if (datosFinales.neumoconiosisCategoria === '2/2') {
      xPosILO = cuartaCeldaTercio1 + (colWidthsILO[3] / 6); // Segunda tercera parte de la celda 3
    } else if (datosFinales.neumoconiosisCategoria === '2/3') {
      xPosILO = cuartaCeldaTercio2 + (colWidthsILO[3] / 6); // Tercera parte de la celda 3
    } else if (datosFinales.neumoconiosisCategoria === '3/2') {
      xPosILO = colPositionsILO[4] + (colWidthsILO[4] / 6); // Primera tercera parte de la celda 4
    } else if (datosFinales.neumoconiosisCategoria === '3/3') {
      xPosILO = quintaCeldaTercio1 + (colWidthsILO[4] / 6); // Segunda tercera parte de la celda 4
    } else if (datosFinales.neumoconiosisCategoria === '3/+') {
      xPosILO = quintaCeldaTercio2 + (colWidthsILO[4] / 6); // Tercera parte de la celda 4
    } else if (['A', 'B', 'C'].includes(datosFinales.neumoconiosisCategoria)) {
      xPosILO = colPositionsILO[5] + (colWidthsILO[5] / 2);
    } else if (datosFinales.neumoconiosisCategoria === 'ST') {
      xPosILO = colPositionsILO[6] + (colWidthsILO[6] / 2);
    } else {
      xPosILO = colPositionsILO[0] + (colWidthsILO[0] / 2); // Default a 0/0
    }
    
    // Centrar la X verticalmente en la celda
    doc.text("X", xPosILO - (anchoX / 2), yPos + (filaAlturaNeumo / 2) + 1.5);
  }
  yPos += filaAlturaNeumo;

  // Fila 2: Etiquetas de categorías (0/0 | 1/0 | 1/1 1/2 | 2/1 2/2 2/3 | 3/2 3/3 3/+ | A,B,C | ST)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaNeumo);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAlturaNeumo);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaNeumo);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaNeumo, tablaInicioX + tablaAncho, yPos + filaAlturaNeumo);

  doc.setFont("helvetica", "normal").setFontSize(7);
  const catLabels = ['0/0', '1/0', '1/1 1/2', '2/1 2/2 2/3', '3/2 3/3 3/+', 'A B C', 'ST'];
  for (let i = 0; i < numColsILO; i++) {
    const label = catLabels[i];
    const anchoLabel = doc.getTextWidth(label);
    
    if (i === 2) {
      // Para la tercera celda (1/1 1/2), centrar cada parte en su subdivisión
      const texto1 = "1/1";
      const texto2 = "1/2";
      const anchoTexto1 = doc.getTextWidth(texto1);
      const anchoTexto2 = doc.getTextWidth(texto2);
      
      // Centrar "1/1" en la primera mitad
      doc.text(texto1, colPositionsILO[i] + ((colWidthsILO[i] / 2 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "1/2" en la segunda mitad
      doc.text(texto2, terceraCeldaMitad + ((colWidthsILO[i] / 2 - anchoTexto2) / 2), yPos + 3.5);
    } else if (i === 3) {
      // Para la cuarta celda (2/1 2/2 2/3), centrar cada parte en su subdivisión
      const texto1 = "2/1";
      const texto2 = "2/2";
      const texto3 = "2/3";
      const anchoTexto1 = doc.getTextWidth(texto1);
      const anchoTexto2 = doc.getTextWidth(texto2);
      const anchoTexto3 = doc.getTextWidth(texto3);
      
      // Centrar "2/1" en la primera tercera parte
      doc.text(texto1, colPositionsILO[i] + ((colWidthsILO[i] / 3 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "2/2" en la segunda tercera parte
      doc.text(texto2, cuartaCeldaTercio1 + ((colWidthsILO[i] / 3 - anchoTexto2) / 2), yPos + 3.5);
      // Centrar "2/3" en la tercera parte
      doc.text(texto3, cuartaCeldaTercio2 + ((colWidthsILO[i] / 3 - anchoTexto3) / 2), yPos + 3.5);
    } else if (i === 4) {
      // Para la quinta celda (3/2 3/3 3/+), centrar cada parte en su subdivisión
      const texto1 = "3/2";
      const texto2 = "3/3";
      const texto3 = "3/+";
      const anchoTexto1 = doc.getTextWidth(texto1);
      const anchoTexto2 = doc.getTextWidth(texto2);
      const anchoTexto3 = doc.getTextWidth(texto3);
      
      // Centrar "3/2" en la primera tercera parte
      doc.text(texto1, colPositionsILO[i] + ((colWidthsILO[i] / 3 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "3/3" en la segunda tercera parte
      doc.text(texto2, quintaCeldaTercio1 + ((colWidthsILO[i] / 3 - anchoTexto2) / 2), yPos + 3.5);
      // Centrar "3/+" en la tercera parte
      doc.text(texto3, quintaCeldaTercio2 + ((colWidthsILO[i] / 3 - anchoTexto3) / 2), yPos + 3.5);
    } else {
      // Para las demás celdas, centrar normalmente
      doc.text(label, colPositionsILO[i] + ((colWidthsILO[i] - anchoLabel) / 2), yPos + 3.5);
    }
  }
  yPos += filaAlturaNeumo;

  // Fila 3: Etiquetas de profusión (cero | 1/0 | uno | dos | tres | cuatro | -)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaNeumo);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAlturaNeumo);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaNeumo);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaNeumo, tablaInicioX + tablaAncho, yPos + filaAlturaNeumo);

  const profLabels = ['cero', '1/0', 'uno', 'dos', 'tres', 'cuatro', '-'];
  for (let i = 0; i < numColsILO; i++) {
    const label = profLabels[i];
    const anchoLabel = doc.getTextWidth(label);
    doc.text(label, colPositionsILO[i] + ((colWidthsILO[i] - anchoLabel) / 2), yPos + 3.5);
  }
  yPos += filaAlturaNeumo;

  // Fila 4: 3 celdas alineadas con las columnas ILO (solo las dos primeras divisiones) - Solo datos
  // Usar las mismas posiciones de colPositionsILO para alinear las divisiones
  const posCelda1 = tablaInicioX; // Inicio (colPositionsILO[0])
  const posDiv1 = colPositionsILO[1]; // Primera división (después de "0/0")
  const posDiv2 = colPositionsILO[2]; // Segunda división (después de "1/0")
  const posFinal = tablaInicioX + tablaAncho; // Final
  
  // Dibujar líneas verticales (alineadas con las columnas ILO)
  doc.line(posCelda1, yPos, posCelda1, yPos + filaAlturaNeumo); // Línea izquierda
  doc.line(posDiv1, yPos, posDiv1, yPos + filaAlturaNeumo); // Primera división (después de "cero")
  doc.line(posDiv2, yPos, posDiv2, yPos + filaAlturaNeumo); // Segunda división (después de "1/0")
  doc.line(posFinal, yPos, posFinal, yPos + filaAlturaNeumo); // Línea derecha
  
  // Dibujar líneas horizontales
  doc.line(posCelda1, yPos, posFinal, yPos); // Línea superior
  doc.line(posCelda1, yPos + filaAlturaNeumo, posFinal, yPos + filaAlturaNeumo); // Línea inferior
  
  // Agregar contenido (solo datos, sin etiquetas)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.sinNeumoconiosis || "").toString().toUpperCase(), posCelda1 + 2, yPos + 3.5); // Celda 1: Sin neumoconiosis
  doc.text((datosFinales.imagenRadiograficaExposicionPolvo || "").toString().toUpperCase(), posDiv1 + 2, yPos + 3.5); // Celda 2: Imagen Radiográfica
  doc.text((datosFinales.conNeumoconiosis || "").toString().toUpperCase(), posDiv2 + 2, yPos + 3.5); // Celda 3: Con neumoconiosis
  
  yPos += filaAlturaNeumo;

  // Fila para "Reacciones serológicas LUES-no LUES" (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reacciones serológicas LUES-no LUES:", tablaInicioX + 2, yPos + 3.5);
  const anchoTituloReaccionesSerologicas = doc.getTextWidth("Reacciones serológicas LUES-no LUES:");
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.reaccionesSerologicasLues || "").toString().toUpperCase(), tablaInicioX + 2 + anchoTituloReaccionesSerologicas + 10, yPos + 3.5);
  yPos += filaAltura;

  // === SECCIÓN: EXAMENES DE LABORATORIO ===
  yPos = dibujarHeaderSeccion("15. EXAMENES DE LABORATORIO", yPos, filaAltura);

  // Fila celeste: Hemograma completo
  yPos = dibujarHeaderSeccionCeleste("Hemograma completo", yPos, filaAltura);

  // Fila: VSG | Glucosa | Urea | Creatinina (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido VSG, Glucosa, Urea, Creatinina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VSG:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const vsgValue = data.vsgLaboratorioClinico_txtvsg || "";
  doc.text(vsgValue ? `${vsgValue.toString().toUpperCase()} mm/h` : "", tablaInicioX + 15, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Glucosa:", tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const glucosaValue = data.glucosaLaboratorioClinico_txtglucosabio || "";
  doc.text(glucosaValue ? `${glucosaValue.toString().toUpperCase()} mg/dL` : "N/A mg/dL", tablaInicioX + tablaAncho / 4 + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Urea:", tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("N/A mg/dL", tablaInicioX + tablaAncho / 2 + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Creatinina:", tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const creatininaValue = data.creatininaLaboratorioClinico_txtcreatininabio || "";
  doc.text(creatininaValue ? `${creatininaValue.toString().toUpperCase()} mg/dL` : "N/A mg/dL", tablaInicioX + (3 * tablaAncho / 4) + 30, yPos + 3.5);
  yPos += filaAltura;

  // Fila celeste: Perfil lipídico completo
  yPos = dibujarHeaderSeccionCeleste("Perfil lipídico completo", yPos, filaAltura);

  // Fila: L.DL | H.D.L | V.L.D.L | Triglicéridos | Colesterol total (5 columnas)
  // Anchos personalizados para cada columna para que V.L.D.L esté más a la izquierda
  const lipidoCol1 = 35;  // L.DL
  const lipidoCol2 = 35;   // H.D.L (reducida)
  const lipidoCol3 = 35;   // V.L.D.L (más a la izquierda)
  const lipidoCol4 = 39;   // Triglicéridos
  // Columna 5 (Colesterol total) usa el espacio restante (≈40mm)
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + lipidoCol1, yPos, tablaInicioX + lipidoCol1, yPos + filaAltura);
  doc.line(tablaInicioX + lipidoCol1 + lipidoCol2, yPos, tablaInicioX + lipidoCol1 + lipidoCol2, yPos + filaAltura);
  doc.line(tablaInicioX + lipidoCol1 + lipidoCol2 + lipidoCol3, yPos, tablaInicioX + lipidoCol1 + lipidoCol2 + lipidoCol3, yPos + filaAltura);
  doc.line(tablaInicioX + lipidoCol1 + lipidoCol2 + lipidoCol3 + lipidoCol4, yPos, tablaInicioX + lipidoCol1 + lipidoCol2 + lipidoCol3 + lipidoCol4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  // Contenido perfil lipídico - Columna 1 (L.DL)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("L.DL:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${(data.ldlcolesterolAnalisisBioquimico_txtldlcolesterol || "").toString().toUpperCase()} mg/dL`, tablaInicioX + 12, yPos + 3.5);

  // Columna 2 (H.D.L)
  const posCol2 = tablaInicioX + lipidoCol1;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("H.D.L:", posCol2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${(data.hdlcolesterolAnalisisBioquimico_txthdlcolesterol || "").toString().toUpperCase()} mg/dL`, posCol2 + 12, yPos + 3.5);

  // Columna 3 (V.L.D.L) - Movida más a la izquierda
  const posCol3 = posCol2 + lipidoCol2;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("V.L.D.L:", posCol3 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${(data.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol || "").toString().toUpperCase()} mg/dL`, posCol3 + 14, yPos + 3.5);

  // Columna 4 (Triglicéridos)
  const posCol4 = posCol3 + lipidoCol3;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Triglicéridos:", posCol4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${(data.trigliceridosAnalisisBioquimico_txttrigliceridos || "").toString().toUpperCase()} mg/dL`, posCol4 + 20, yPos + 3.5);

  // Columna 5 (Colesterol total)
  const posCol5 = posCol4 + lipidoCol4;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Colesterol total:", posCol5 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${(data.colesterolAnalisisBioquimico_txtcolesterol || "").toString().toUpperCase()} mg/dL`, posCol5 + 25, yPos + 3.5);

yPos += filaAltura;


  // Fila celeste: Examen completo de orina
  yPos = dibujarHeaderSeccionCeleste("Examen completo de orina", yPos, filaAltura);

  // Fila: Cocaína | Marihuana | Mercurio | Plomo (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido examen de orina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cocaína:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((data.cocainaLaboratorioClinico_txtcocaina || "").toString().toUpperCase(), tablaInicioX + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Marihuana:", tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((data.marihuanaLaboratorioClinico_txtmarihuana || "").toString().toUpperCase(), tablaInicioX + tablaAncho / 4 + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Mercurio:", tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("N/A", tablaInicioX + tablaAncho / 2 + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Plomo:", tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("N/A", tablaInicioX + (3 * tablaAncho / 4) + 20, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Grupo sanguíneo | Factor | Hemoglobina/Hematocrito (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido grupo sanguíneo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grupo sanguíneo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Convertir objeto grupoSanguineo a string
  let grupoSanguineoTexto = "";
  const grupos = [];
  if (data.grupoSanguineoO_chko) grupos.push("O");
  if (data.grupoSanguineoA_chka) grupos.push("A");
  if (data.grupoSanguineoB_chkb) grupos.push("B");
  if (data.grupoSanguineoAB_chkab) grupos.push("AB");
  grupoSanguineoTexto = grupos.join(", ");
  
  doc.text(grupoSanguineoTexto.toUpperCase(), tablaInicioX + 40, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Factor:", tablaInicioX + tablaAncho / 3 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Convertir objeto factorRh a string
  let factorRhTexto = "";
  if (data.grupoSanguineoRhPositivo_rbrhpositivo) factorRhTexto = "RH(+) POSITIVO";
  else if (data.grupoSanguineoRhNegativo_rbrhnegativo) factorRhTexto = "RH(-) NEGATIVO";
  
  doc.text(factorRhTexto.toUpperCase(), tablaInicioX + tablaAncho / 3 + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hemoglobina:", tablaInicioX + (2 * tablaAncho / 3) + 2, yPos + 3.5);
  
  // Determinar color según rango de hemoglobina
  let colorHemoglobina = [0, 0, 0]; // Negro por defecto
  const hemoglobinaValue = parseFloat(data.hemoglobina_txthemoglobina || "0");
  const esHombre = data.sexo_sexo_pa === "M";
  const esMujer = data.sexo_sexo_pa === "F";
  
  if (hemoglobinaValue > 0) {
    if (esHombre && (hemoglobinaValue < 14 || hemoglobinaValue > 20)) {
      colorHemoglobina = [255, 0, 0]; // Rojo si hombre < 14 o > 20
    } else if (esMujer && (hemoglobinaValue < 13.5 || hemoglobinaValue > 20)) {
      colorHemoglobina = [255, 0, 0]; // Rojo si mujer < 13.5 o > 20
    }
  }
  
  doc.setFont("helvetica", "bold").setFontSize(9.5);
  doc.setTextColor(colorHemoglobina[0], colorHemoglobina[1], colorHemoglobina[2]);
  doc.text(((data.hemoglobina_txthemoglobina || "") + " gr. %").toString(), tablaInicioX + (2 * tablaAncho / 3) + 35, yPos + 3.5);
  doc.setTextColor(0, 0, 0); // Volver al color negro
  yPos += filaAltura;

  // Fila: APTO PARA TRABAJAR (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO PARA TRABAJAR:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Convertir objeto aptoParaTrabajar a string
  let aptoParaTrabajarTexto = "";
  if (data.examenRadiograficoAptoSi_apto_si) aptoParaTrabajarTexto = "SI";
  else if (data.examenRadiograficoAptoNo_apto_no) aptoParaTrabajarTexto = "NO";
  
  doc.text(aptoParaTrabajarTexto.toUpperCase(), tablaInicioX + 50, yPos + 3.5);
  yPos += filaAltura;

  // === FOOTER PÁGINA 2 ===
  footerTR(doc, { footerOffsetY: 8 });

  // === CREAR PÁGINA 3 ===
  doc.addPage();
  numeroPagina = 3;
  yPos = 35.5; // Posición inicial de la nueva página

  // Dibujar header en la nueva página
  drawHeader(numeroPagina);

  // === SECCIÓN: OTROS EXAMENES ===
  yPos = dibujarHeaderSeccion("16. OTROS EXAMENES", yPos, filaAltura);

  // Fila creciente con altura por defecto de 35mm
  const alturaFilaCrecientePag3 = 35; // 35mm por defecto
  const textoOtrosExamenesPag3 = datosFinales.otrosExamenes || "";
  // Calcular ancho máximo: tablaAncho (200) - margen texto izquierdo (2) - margen derecho (1) = 197mm para maximizar uso
  const anchoDisponibleOtrosExamenesPag3 = tablaAncho - 3; // Usa máximo ancho posible (200 - 3 = 197mm)
  const lineasOtrosExamenesPag3 = doc.splitTextToSize(textoOtrosExamenesPag3, anchoDisponibleOtrosExamenesPag3);
  
  // Interlineado para el texto
  const interlineadoOtrosExamenes = 3;
  
  // Calcular altura dinámica basada en el contenido
  const alturaDinamicaOtrosExamenesPag3 = Math.max(alturaFilaCrecientePag3, lineasOtrosExamenesPag3.length * interlineadoOtrosExamenes + 4);

  // Dibujar líneas de la fila creciente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaOtrosExamenesPag3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtrosExamenesPag3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaOtrosExamenesPag3, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtrosExamenesPag3);

  // Contenido de la fila creciente con interlineado controlado
  doc.setFont("helvetica", "normal").setFontSize(7);
  const lineasOtrosExamenesFormateadas = lineasOtrosExamenesPag3.map(linea => linea.toUpperCase());
  lineasOtrosExamenesFormateadas.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoOtrosExamenes));
  });
  yPos += alturaDinamicaOtrosExamenesPag3;

// === SECCIÓN: CONCLUSIONES ===
yPos = dibujarHeaderSeccion("17. CONCLUSIONES", yPos, filaAltura);

const textoConclusionesPag3 = datosFinales.conclusiones || "";

// Split into items respecting \n or numbered points
let items = [];
if (textoConclusionesPag3.includes('\n')) {
  // If already has line breaks, use them
  items = textoConclusionesPag3.split('\n').filter(item => item.trim() !== '');
} else {
  // Otherwise, split by numbered points (1., 2., etc.)
  items = textoConclusionesPag3.split(/(?=\d+\.\s)/).filter(item => item.trim() !== '');
}

const anchoDisponible = tablaAncho - 4; // 196mm to avoid edge clipping
const espacioEntreItems = 2; // mm space between points

let yStartBox = yPos;
let yCurrent = yPos + 3.5; // Increased top padding to 3.5mm for better spacing from gray header

doc.setFont("helvetica", "normal").setFontSize(7);

items.forEach((item, index) => {
  if (index > 0) {
    yCurrent += espacioEntreItems; // Add space only between points, not within
  }
  
  const itemUpper = item.trim().toUpperCase();
  yCurrent = dibujarTextoConSaltoLinea(itemUpper, tablaInicioX + 2, yCurrent, anchoDisponible);
});

// Calculate dynamic height based on actual drawn content
const alturaCalculada = yCurrent - yStartBox + 2; // Padding at bottom

// Now draw the box lines using the calculated height (ensures full coverage, no cutoff)
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.2);
doc.line(tablaInicioX, yStartBox, tablaInicioX, yStartBox + alturaCalculada);
doc.line(tablaInicioX + tablaAncho, yStartBox, tablaInicioX + tablaAncho, yStartBox + alturaCalculada);
doc.line(tablaInicioX, yStartBox, tablaInicioX + tablaAncho, yStartBox);
doc.line(tablaInicioX, yStartBox + alturaCalculada, tablaInicioX + tablaAncho, yStartBox + alturaCalculada);

yPos += alturaCalculada;

  // === SECCIÓN: RECOMENDACIONES / RESTRICCIONES ===
  yPos = dibujarHeaderSeccion("18. RECOMENDACIONES / RESTRICCIONES", yPos, filaAltura);

  // Fila creciente para recomendaciones
  const textoRecomendacionesPag3 = datosFinales.recomendacionesRestricciones || "";
  // Calcular ancho máximo: tablaAncho (200) - margen texto izquierdo (2) - margen derecho (1) = 197mm para maximizar uso
  const anchoDisponibleRecomendacionesPag3 = tablaAncho - 3; // Usa máximo ancho posible (200 - 3 = 197mm)
  
  // Procesar texto: separar por \n primero, si no hay \n, dividir por patrones de números (1., 2., etc.)
  let itemsRecomendaciones = [];
  if (textoRecomendacionesPag3.includes('\n')) {
    // Si ya tiene saltos de línea, usar esos
    itemsRecomendaciones = textoRecomendacionesPag3.split('\n').filter(item => item.trim() !== '');
  } else {
    // Si no tiene saltos, dividir por patrones de número seguido de punto al inicio de línea
    itemsRecomendaciones = textoRecomendacionesPag3.split(/(?=\d+\.\s)/).filter(item => item.trim() !== '');
  }
  
  // Procesar cada ítem: dividir en líneas y agregar espacio entre ítems
  let todasLasLineasRecomendaciones = [];
  let alturaAcumuladaRecomendaciones = 0;
  
  itemsRecomendaciones.forEach((item, itemIndex) => {
    const itemFormateado = item.trim().toUpperCase();
    if (!itemFormateado) return;
    
    // Dividir el ítem en líneas según el ancho disponible
    const lineasDelItem = doc.splitTextToSize(itemFormateado, anchoDisponibleRecomendacionesPag3);
    
    // Agregar cada línea del ítem
    lineasDelItem.forEach((linea) => {
      todasLasLineasRecomendaciones.push({
        texto: linea,
        itemIndex: itemIndex, // Guardar índice del ítem para detectar cambios
        alturaLinea: interlineadoTexto
      });
      alturaAcumuladaRecomendaciones += interlineadoTexto;
    });
    
    // Agregar espacio adicional (1mm) después de cada ítem (excepto el último)
    if (itemIndex < itemsRecomendaciones.length - 1) {
      alturaAcumuladaRecomendaciones += espacioEntreItems;
    }
  });
  
  // Calcular altura dinámica basada en todas las líneas
  const alturaDinamicaRecomendacionesPag3 = Math.max(45, alturaAcumuladaRecomendaciones + 4);

  // Dibujar líneas de la fila creciente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaRecomendacionesPag3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaRecomendacionesPag3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaRecomendacionesPag3, tablaInicioX + tablaAncho, yPos + alturaDinamicaRecomendacionesPag3);

  // Dibujar contenido línea por línea con espaciado entre ítems
  doc.setFont("helvetica", "normal").setFontSize(7);
  let yPosActualRecomendaciones = yPos + 3.5;
  let itemIndexAnteriorRecomendaciones = -1;
  
  todasLasLineasRecomendaciones.forEach((lineaObj) => {
    // Si cambió de ítem (no es el primero), agregar espacio adicional antes
    if (lineaObj.itemIndex !== itemIndexAnteriorRecomendaciones && itemIndexAnteriorRecomendaciones !== -1) {
      yPosActualRecomendaciones += espacioEntreItems;
    }
    
    // Dibujar la línea
    doc.text(lineaObj.texto, tablaInicioX + 2, yPosActualRecomendaciones);
    
    // Avanzar posición Y con interlineado normal
    yPosActualRecomendaciones += interlineadoTexto;
    
    // Actualizar índice del ítem anterior
    itemIndexAnteriorRecomendaciones = lineaObj.itemIndex;
  });
  
  yPos += alturaDinamicaRecomendacionesPag3;

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
  const alturaSeccionDeclaracion = 30; // Altura para la sección de declaración

  // Dibujar las líneas de la sección de declaración (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionDeclaracion); // Línea izquierda
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionDeclaracion); // Primera división
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionDeclaracion); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion); // Línea inferior

  // === COLUMNA 1: DECLARACIÓN ===
  doc.setFont("helvetica", "normal").setFontSize(6);
  const textoDeclaracion = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";
  
  // Función para justificar texto
  const justificarTexto = (texto, x, y, anchoMaximo, interlineado) => {
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    let yActual = y;
    
    lineas.forEach((linea, index) => {
      // Solo justificar si no es la última línea y tiene más de una palabra
      if (index < lineas.length - 1 && linea.includes(' ')) {
        const palabras = linea.split(' ');
        if (palabras.length > 1) {
          const anchoTexto = doc.getTextWidth(linea);
          const espacioDisponible = anchoMaximo - anchoTexto;
          const espaciosEntrePalabras = palabras.length - 1;
          const espacioExtra = espacioDisponible / espaciosEntrePalabras;
          
          let xActual = x;
          palabras.forEach((palabra, i) => {
            doc.text(palabra, xActual, yActual);
            if (i < palabras.length - 1) {
              const anchoPalabra = doc.getTextWidth(palabra);
              xActual += anchoPalabra + (doc.getTextWidth(' ') + espacioExtra);
            }
          });
        } else {
          doc.text(linea, x, yActual);
        }
      } else {
        doc.text(linea, x, yActual);
      }
      yActual += interlineado;
    });
  };
  
  // Dibujar texto justificado
  justificarTexto(textoDeclaracion, tablaInicioX + 2, yPos + 3, 55, 2.5);

  // === COLUMNA 2: FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yPos + 3;
  
  // Calcular centro de la columna 2 para centrar las imágenes
  const centroColumna2X = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
  
  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = getSign(data, "FIRMAP");
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroColumna2X - 20;
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }

  // Agregar huella del trabajador (lado derecho, vertical)
  let huellaTrabajadorUrl = getSign(data, "HUELLA");
  if (huellaTrabajadorUrl) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      const x = centroColumna2X + 8;
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  const centroColumna2 = tablaInicioX + 60 + (60 / 2);
  doc.text("Firma y Huella del trabajador", centroColumna2, yPos + 26, { align: "center" });

  // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 125;
  const firmaMedicoY = yPos + 3;
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = firmaMedicoX + 10;
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  const centroColumna3 = tablaInicioX + 120 + (70 / 2);
  doc.text("Sello y Firma del Médico", centroColumna3, yPos + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna3, yPos + 28.5, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

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