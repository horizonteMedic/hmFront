import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { getSign, formatearTextoATitulo } from "../../utils/helpers.js";
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
        
        // Si solo una tiene data, devolver esa formateada
        if (campo1 && !campo2) return formatearTextoATitulo(campo1);
        if (!campo1 && campo2) return formatearTextoATitulo(campo2);
        
        // Si ambas tienen data, devolver ambas formateadas y separadas por nueva línea
        return `${formatearTextoATitulo(campo1)}\n${formatearTextoATitulo(campo2)}`;
      })(),
      reflejosPupilares: data.reflejosPupilaresAnexo7c_txtreflejospupilares ?? "",
      visionColores: data.visionColoresAnexo7c_txtvisioncolores ?? "",
      testIshiharaNormal: data.tecishiharaNormal_rbtecishihara_normal ?? false,
      testIshiharaAnormal: data.tecishiharaAnormal_rbtecishihara_anormal ?? false,
      testColoresPurosNormal: data.teccoleresNormal_rbteccoleres_normal ?? false,
      testColoresPurosAnormal: data.teccoleresAnormal_rbteccoleres_anormal ?? false,
      testProfundidadNormal: data.tecestereopsiaNormal_rbtecestereopsia_normal ?? false,
      testProfundidadAnormal: data.tecestereopsiaAnormal_rbtecestereopsia_anormal ?? false
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

  // Función para convertir texto a formato gramatical (primera letra mayúscula, resto minúsculas)
  const formatearTextoGramatical = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;
    
    // Dividir por líneas para manejar listas con viñetas
    const lineas = texto.split('\n');
    const lineasFormateadas = lineas.map(linea => {
      if (!linea.trim()) return linea; // Mantener líneas vacías
      
      const lineaTrim = linea.trim();
      
      // Si empieza con "-" (con o sin espacio), formatear después del guión
      if (lineaTrim.startsWith('-')) {
        const match = lineaTrim.match(/^(-\s*)(.+)/);
        if (match) {
          const guionEspacio = match[1]; // "-" o "- "
          const contenido = match[2];
          return guionEspacio + contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
        }
      }
      
      // Formatear palabra por palabra, manteniendo siglas
      const palabras = lineaTrim.split(/(\s+)/); // Dividir preservando espacios
      const palabrasFormateadas = palabras.map(palabra => {
        // Si es solo espacios, mantenerlo
        if (/^\s+$/.test(palabra)) return palabra;
        
        // Formatear la palabra: primera letra mayúscula, resto minúsculas
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
      });
      
      return palabrasFormateadas.join('');
    });
    
    return lineasFormateadas.join('\n');
  };

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    // Título en todas las páginas
    doc.setFont("helvetica", "bold").setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("ANEXO 16", pageW / 2, 28, { align: "center" });
    doc.text("FICHA MEDICA Ocupacional", pageW / 2, 32, { align: "center" });

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
    const tablaAncho = 195;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(160, 160, 160);
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
    const tablaAncho = 195;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo celeste
    doc.setFillColor(173, 216, 230);
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
    const tablaAncho = 195;
    
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
  const tablaAncho = 195;
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
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);
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
  doc.text(formatearTextoGramatical(datosFinales.antecedentesMedicos?.personales || ""), tablaInicioX + 40, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // Antecedentes familiares
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes familiares:", tablaInicioX + 2, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.antecedentesMedicos?.familiares || ""), tablaInicioX + 40, yTextoAntecedentes + 1);
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
    if (habito.nada) return "Nada";
    if (habito.poco) return "Poco";
    if (habito.habitual) return "Habitual";
    if (habito.excesivo) return "Excesivo";
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

  // Fila de datos: FVC | {data} | FV31 | {data} | FVE1/FVC | {data} | FEF | {data}
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FVC", colPositions[0] + 2, yTextoEspirometria + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.funcionRespiratoria?.fvc || "") + " L", colPositions[1] + 2, yTextoEspirometria + 1);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FV31", colPositions[2] + 2, yTextoEspirometria + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.funcionRespiratoria?.fev1 || "") + " L", colPositions[3] + 2, yTextoEspirometria + 1);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FVE1/FVC", colPositions[4] + 2, yTextoEspirometria + 1);
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
  doc.text(formatearTextoGramatical(datosFinales.funcionRespiratoria?.conclusion || ""), tablaInicioX + 25, yTextoEspirometria + 1);
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

  // Fila 5: Presión Arterial (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
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
  const anchoTituloPA = doc.getTextWidth("Presión Arterial:");
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sistólica: " + (datosFinales.presionSistolica || "") + " mmHg   Diastólica: " + (datosFinales.presionDiastolica || "") + " mmHg", tablaInicioX + 2 + anchoTituloPA + 5, yTextoVitales + 1);
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

  // Función para formatear texto: primera letra mayúscula, resto minúscula, excepto siglas y palabras especiales
  const formatearTexto = (texto) => {
    if (!texto) return "";
    const textoStr = texto.toString().trim();
    if (textoStr === "N/A" || textoStr === "N/A.") return textoStr;
    
    // Dividir el texto en palabras
    const palabras = textoStr.split(' ');
    
    // Formatear cada palabra
    const palabrasFormateadas = palabras.map(palabra => {
      // Limpiar signos de puntuación para la verificación
      const palabraLimpia = palabra.replace(/[.,;:]/g, '');
      
      // Detectar RCRR en cualquier caso (rcrr, Rcrr, RCRR, etc.) y convertir a RCRR
      if (palabraLimpia.toUpperCase() === 'RCRR') {
        // Restaurar signos de puntuación si los hay
        return 'RCRR' + palabra.substring(palabraLimpia.length);
      }
      
      // Si la palabra está completamente en mayúsculas y es una sigla (2 o más letras mayúsculas), mantenerla
      if (palabraLimpia === palabraLimpia.toUpperCase() && palabraLimpia.length >= 2 && /^[A-Z]+$/.test(palabraLimpia)) {
        // Restaurar signos de puntuación si los hay
        return palabraLimpia + palabra.substring(palabraLimpia.length);
      }
      
      // Para el resto, formato normal: primera letra mayúscula, resto minúscula
      if (palabra.length > 0) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
      }
      return palabra;
    });
    
    return palabrasFormateadas.join(' ');
  };

  // Fila 1: Cabeza | Perímetro Cuello | Cuello | Nariz
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cabeza:", tablaInicioX + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.evaluacionFisica?.cabeza || ""), tablaInicioX + 20, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Perímetro Cuello:", tablaInicioX + tablaAncho / 4 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.evaluacionFisica?.perimetroCuello || "") + " cm", tablaInicioX + tablaAncho / 4 + 30, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cuello:", tablaInicioX + tablaAncho / 2 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.evaluacionFisica?.cuello || ""), tablaInicioX + tablaAncho / 2 + 15, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Nariz:", tablaInicioX + (3 * tablaAncho / 4) + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.evaluacionFisica?.nariz || ""), tablaInicioX + (3 * tablaAncho / 4) + 15, yTextoExamenDetallado + 1);
  yTextoExamenDetallado += filaAltura;

  // Fila 2: Boca, Amígdalas, Faringe, Laringe (un solo campo)
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Boca, Amígdalas, Faringe, Laringe:", tablaInicioX + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.evaluacionFisica?.bocaAmigdalas || ""), tablaInicioX + 60, yTextoExamenDetallado + 1);
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
  doc.setFillColor(160, 160, 160); // Color gris
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
  const textoEnfermedades = datosFinales.evaluacionOftalmologica?.enfermedadesOculares || "";
  const maxWidth = colObservacionesAncho - 4; // Ancho disponible menos margen (reducido de 8 a 4 para evitar cortes prematuros)
  const lineHeight = 3.8; // Interlineado aumentado para que el texto tenga más espacio
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
  lines.slice(0, lineasPorFila).forEach((line, index) => {
    doc.text(line, xObservaciones + 4, yPos - 2 + (index * lineHeight));
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
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Mostrar las líneas restantes en esta fila
  if (lines && lines.length > lineasPorFila) {
    lines.slice(lineasPorFila).forEach((line, index) => {
      doc.text(line, xObservaciones + 4, yPos - 2 + (index * lineHeight));
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
  doc.text(formatearTextoGramatical(datosFinales.evaluacionOftalmologica?.reflejosPupilares || ""), xObservaciones - 45, yPos + 3.5);
  
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
  doc.text(datosFinales.evaluacionOftalmologica?.visionColores || "", xVision + 35, yPos + 3.5);
  
  // Test de Ishihara: true = Normal, false = Anormal
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test de Ishihara:", xIshihara + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const ishiharaResultado = datosFinales.evaluacionOftalmologica?.testIshiharaNormal ? "Normal" : "Anormal";
  doc.text(ishiharaResultado, xIshihara + 30, yPos + 3.5);
  
  // Test de colores puros: true = Normal, false = Anormal
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test colores puros:", xColores + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const coloresPurosResultado = datosFinales.evaluacionOftalmologica?.testColoresPurosNormal ? "Normal" : "Anormal";
  doc.text(coloresPurosResultado, xColores + 30, yPos + 3.5);
  
  // Test de profundidad: true = Normal, false = Alterado
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test profundidad:", xProfundidad + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const profundidadResultado = datosFinales.evaluacionOftalmologica?.testProfundidadNormal ? "Normal" : "Alterado";
  doc.text(profundidadResultado, xProfundidad + 30, yPos + 3.5);
  
  yPos += filaAltura;

  // === SECCIÓN 8: OÍDOS ===
  // Fila gris: 8. OÍDOS
  doc.setFillColor(160, 160, 160); // Color gris
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
  doc.text(formatearTextoGramatical(datosFinales.evaluacionOidos?.otoscopia?.oidoDerecho || ""), x1 + 20, yPos + 3.5);
  doc.text(formatearTextoGramatical(datosFinales.evaluacionOidos?.otoscopia?.oidoIzquierdo || ""), x2 + 20, yPos + 3.5);
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

  // Estructura de dos columnas: Texto a la izquierda, Imagen a la derecha
  const anchoColDerecha = 55; // Columna derecha más estrecha para imagen
  const anchoColIzquierda = tablaAncho - anchoColDerecha; // Columna izquierda para texto
  const puntoDivision = tablaInicioX + anchoColIzquierda;
  
  // Preparar contenido
  const textoPulmones = "Descripción: " + formatearTextoGramatical(datosFinales.evaluacionFisicaAdicional?.pulmones?.descripcion || "");
  const anchoTextoDisponible = anchoColIzquierda - 4;
  const lineasPulmones = doc.splitTextToSize(textoPulmones, anchoTextoDisponible);
  
  // Altura de la columna izquierda (texto + fila de status)
  const alturaTexto = lineasPulmones.length * 3 + 4;
  const alturaTotal = Math.max(30, alturaTexto + filaAltura); // Mínimo 30mm para acomodar imagen
  
  // Dibujar líneas principales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotal);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotal);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaTotal, tablaInicioX + tablaAncho, yPos + alturaTotal);
  
  // Línea vertical divisoria
  doc.line(puntoDivision, yPos, puntoDivision, yPos + alturaTotal);
  
  // === COLUMNA IZQUIERDA: Status y Descripción ===
  const yPosInicial = yPos;
  
  // Fila de status dentro de la columna izquierda
  const colPulmonesWidth = 35;
  const colAnchoNormal = (anchoColIzquierda - colPulmonesWidth) / 2;
  const colAnchoAnormal = colAnchoNormal;
  
  let xPulmones = tablaInicioX;
  let xNormal = xPulmones + colPulmonesWidth;
  let xAnormal = xNormal + colAnchoNormal;
  const xFinalColumna = tablaInicioX + anchoColIzquierda;
  
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
  doc.text("Normal", xNormal + 2, yPos + 3.5);
  doc.text("Anormal", xAnormal + 2, yPos + 3.5);
  
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
  doc.line(xPulmones, yPosDescripcion, xFinalColumna, yPosDescripcion);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const interlineadoDesc = 3;
  lineasPulmones.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPosDescripcion + 3.5 + (index * interlineadoDesc));
  });
  
  // === COLUMNA DERECHA: Imagen centrada ===
  try {
    const imgPulmones = '/img/Anexo16/pulmonesFrame.png';
    const imgWidth = 20;
    const imgHeight = 20;
    // Centrar horizontalmente: (ancho columna derecha - ancho imagen) / 2
    const imgX = puntoDivision + (anchoColDerecha - imgWidth) / 2;
    // Centrar verticalmente: (altura total - altura imagen) / 2
    const imgY = yPosInicial + (alturaTotal - imgHeight) / 2;
    doc.addImage(imgPulmones, 'PNG', imgX, imgY, imgWidth, imgHeight);
  } catch (error) {
    console.log('No se pudo cargar la imagen de pulmones:', error);
  }
  
  yPos = yPosInicial + alturaTotal;

    // Fila: CARDIOVASCULAR dentro de la sección PULMONES
    const tituloCardiovascular = "Cardiovascular: ";
    const datoCardiovascular = formatearTextoGramatical(datosFinales.cardiovascular || "");
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
    doc.text("Normal", xNormalPiel + 2, yPos + 3.5);
    doc.text("Anormal", xAnormalPiel + 2, yPos + 3.5);

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
    const textoPiel = "Descripción: " + formatearTextoGramatical(datosFinales.evaluacionFisicaAdicional?.piel?.descripcion || "");
    const anchoDisponiblePiel = tablaAncho - 4;
    const lineasPiel = doc.splitTextToSize(textoPiel, anchoDisponiblePiel);
    const alturaDinamicaPiel = Math.max(filaAltura, lineasPiel.length * 2.5 + 2);

    // Dibujar líneas de la fila dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaPiel);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaPiel);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaDinamicaPiel, tablaInicioX + tablaAncho, yPos + alturaDinamicaPiel);

    // Contenido de descripción
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(lineasPiel, tablaInicioX + 2, yPos + 3.5);
    yPos += alturaDinamicaPiel;

  // === SECCIÓN MIEMBROS SUPERIORES ===
  yPos = dibujarHeaderSeccion("11. MIEMBROS SUPERIORES", yPos, filaAltura);

  // Fila de Miembros Superiores con altura dinámica
  const tituloMiembrosSuperiores = "Miembros Superiores: ";
  const datoMiembrosSuperiores = formatearTextoGramatical(datosFinales.evaluacionFisicaAdicional?.miembrosSuperiores || "");
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
  const datoMiembrosInferiores = formatearTextoGramatical(datosFinales.evaluacionFisicaAdicional?.miembrosInferiores || "");
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
  const datoReflejos = formatearTextoGramatical(datosFinales.evaluacionNeurologica?.reflejosOsteotendinosos || "");
  const textoReflejos = tituloReflejos + datoReflejos;
  
  const tituloMarcha = "Marcha: ";
  const datoMarcha = formatearTexto(datosFinales.evaluacionNeurologica?.marcha || "");
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
  const datoColumna = formatearTextoGramatical(datosFinales.evaluacionColumnaAbdomen?.columnaVertebral || "");
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
  const datoAbdomen = formatearTextoGramatical(datosFinales.evaluacionColumnaAbdomen?.abdomen || "");
  const textoAbdomen = tituloAbdomen + datoAbdomen;
  // Función para determinar el estado del tacto rectal
  const obtenerEstadoTactoRectal = () => {
    if (datosFinales.evaluacionRectalHernias?.tactoRectal?.normal) return "Normal";
    if (datosFinales.evaluacionRectalHernias?.tactoRectal?.anormal) return "Anormal";
    if (datosFinales.evaluacionRectalHernias?.tactoRectal?.noSeHizo) return "No se hizo";
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
  const datoAnillos = formatearTextoGramatical(datosFinales.evaluacionColumnaAbdomen?.anillosInguinales || "");
  const textoAnillos = tituloAnillos + datoAnillos;
  
  const tituloHernias = "Hernias: ";
  const datoHernias = formatearTexto(datosFinales.evaluacionRectalHernias?.hernias || "");
  const textoHernias = tituloHernias + datoHernias;
  
  const tituloVarices = "Varices: ";
  const datoVarices = formatearTexto(datosFinales.evaluacionRectalHernias?.varices || "");
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
  const datoOrganos = formatearTextoGramatical(datosFinales.evaluacionColumnaAbdomen?.organosGenitales || "");
  const textoOrganos = tituloOrganos + datoOrganos;
  
  const tituloGanglios = "Ganglios Linfáticos: ";
  const datoGanglios = formatearTextoGramatical(datosFinales.evaluacionRectalHernias?.gangliosLinfaticos || "");
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
  const datoLenguaje = formatearTexto(datosFinales.evaluacionMental?.lenguajeAtencionMemoria || "");
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
  const datoEstadoMental = formatearTextoGramatical(datosFinales.evaluacionMental?.estadoMental || "");
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

  // === FILA: NRO RX, FECHA, CALIDAD, SÍMBOLOS ===
  const tituloNroRx = "Nro Rayos X: ";
  const datoNroRx = formatearTexto(datosFinales.nroRx || "");
  const textoNroRx = tituloNroRx + datoNroRx;
  
  const tituloFechaRx = "Fecha: ";
  const datoFechaRx = formatearTexto(datosFinales.fechaRx || "");
  const textoFechaRx = tituloFechaRx + datoFechaRx;
  
  const tituloCalidadRx = "Calidad: ";
  const datoCalidadRx = formatearTexto(datosFinales.calidadRx || "");
  const textoCalidadRx = tituloCalidadRx + datoCalidadRx;
  
  const tituloSimbolosRx = "Símbolos: ";
  const datoSimbolosRx = formatearTexto(datosFinales.simbolosRx || "");
  const textoSimbolosRx = tituloSimbolosRx + datoSimbolosRx;
  
  // Calcular altura dinámica para cada columna (4 columnas)
  const anchoDisponibleNroRx = tablaAncho / 4 - 4;
  const anchoDisponibleFechaRx = tablaAncho / 4 - 4;
  const anchoDisponibleCalidadRx = tablaAncho / 4 - 4;
  const anchoDisponibleSimbolosRx = tablaAncho / 4 - 4;
  
  const lineasNroRx = doc.splitTextToSize(textoNroRx, anchoDisponibleNroRx);
  const lineasFechaRx = doc.splitTextToSize(textoFechaRx, anchoDisponibleFechaRx);
  const lineasCalidadRx = doc.splitTextToSize(textoCalidadRx, anchoDisponibleCalidadRx);
  const lineasSimbolosRx = doc.splitTextToSize(textoSimbolosRx, anchoDisponibleSimbolosRx);
  
  // Usar la altura de la columna con más líneas
  const maxLineasRx = Math.max(lineasNroRx.length, lineasFechaRx.length, lineasCalidadRx.length, lineasSimbolosRx.length);
  const alturaDinamicaRx = Math.max(filaAltura, maxLineasRx * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaRx);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + alturaDinamicaRx);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaRx);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + alturaDinamicaRx);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaRx);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaRx, tablaInicioX + tablaAncho, yPos + alturaDinamicaRx);

  // Contenido con formato mixto
  // Nro Rx
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloNroRx, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloNroRx = doc.getTextWidth(tituloNroRx);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoNroRx, tablaInicioX + 2 + anchoTituloNroRx + 5, yPos + 3.5);
  
  // Fecha Rx
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloFechaRx, tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  const anchoTituloFechaRx = doc.getTextWidth(tituloFechaRx);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoFechaRx, tablaInicioX + tablaAncho / 4 + 2 + anchoTituloFechaRx + 5, yPos + 3.5);
  
  // Calidad Rx
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloCalidadRx, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  const anchoTituloCalidadRx = doc.getTextWidth(tituloCalidadRx);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoCalidadRx, tablaInicioX + tablaAncho / 2 + 2 + anchoTituloCalidadRx + 5, yPos + 3.5);
  
  // Símbolos Rx
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloSimbolosRx, tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  const anchoTituloSimbolosRx = doc.getTextWidth(tituloSimbolosRx);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoSimbolosRx, tablaInicioX + (3 * tablaAncho / 4) + 2 + anchoTituloSimbolosRx + 5 , yPos + 3.5);
  yPos += alturaDinamicaRx;

  // === FILA: VÉRTICES ===
  const tituloVertices = "Vértices: ";
  const datoVertices = formatearTextoGramatical(datosFinales.vertices || "");
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

  // === FILA: CAMPOS PULMONARES, MEDIASTINOS, HILIOS, SENOS ===
  const tituloCamposPulmonares = "CAMPO PULMONARES ";
  const datoCamposPulmonares = ""; // Solo título, sin datos
  const textoCamposPulmonares = tituloCamposPulmonares + datoCamposPulmonares;
  
  const tituloMediastinos = "Mediastinos: ";
  const datoMediastinos = formatearTextoGramatical(datosFinales.mediastinos || "");
  const textoMediastinos = tituloMediastinos + datoMediastinos;
  
  const tituloHilios = "Hilios: ";
  const datoHilios = formatearTextoGramatical(datosFinales.hilios || "");
  const textoHilios = tituloHilios + datoHilios;
  
  const tituloSenos = "Senos: ";
  const datoSenos = formatearTextoGramatical(datosFinales.senos || "");
  const textoSenos = tituloSenos + datoSenos;
  
  // Calcular altura dinámica para cada columna (4 columnas)
  const anchoDisponibleCamposPulmonares = tablaAncho / 4 - 4;
  const anchoDisponibleMediastinos = tablaAncho / 4 - 4;
  const anchoDisponibleHilios = tablaAncho / 4 - 4;
  const anchoDisponibleSenos = tablaAncho / 4 - 4;
  
  const lineasCamposPulmonares = doc.splitTextToSize(textoCamposPulmonares, anchoDisponibleCamposPulmonares);
  const lineasMediastinos = doc.splitTextToSize(textoMediastinos, anchoDisponibleMediastinos);
  const lineasHilios = doc.splitTextToSize(textoHilios, anchoDisponibleHilios);
  const lineasSenos = doc.splitTextToSize(textoSenos, anchoDisponibleSenos);
  
  // Usar la altura de la columna con más líneas
  const maxLineasCampos = Math.max(lineasCamposPulmonares.length, lineasMediastinos.length, lineasHilios.length, lineasSenos.length);
  const alturaDinamicaCampos = Math.max(filaAltura, maxLineasCampos * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaCampos, tablaInicioX + tablaAncho, yPos + alturaDinamicaCampos);

  // Contenido con formato mixto
  // Campos Pulmonares
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloCamposPulmonares, tablaInicioX + 2, yPos + 3.5);
  const anchoTituloCamposPulmonares = doc.getTextWidth(tituloCamposPulmonares);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoCamposPulmonares, tablaInicioX + 2 + anchoTituloCamposPulmonares + 5, yPos + 3.5);
  
  // Mediastinos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloMediastinos, tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  const anchoTituloMediastinos = doc.getTextWidth(tituloMediastinos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoMediastinos, tablaInicioX + tablaAncho / 4 + 2 + anchoTituloMediastinos + 5, yPos + 3.5);
  
  // Hilios
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloHilios, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  const anchotituloHilios = doc.getTextWidth(tituloHilios);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoHilios, tablaInicioX + tablaAncho / 2 + 2 + anchotituloHilios + 5, yPos + 3.5);
  
  // Senos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(tituloSenos, tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  const anchoTituloSenos = doc.getTextWidth(tituloSenos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datoSenos, tablaInicioX + (3 * tablaAncho / 4) + 2 + anchoTituloSenos + 5, yPos + 3.5);
  yPos += alturaDinamicaCampos;

  // === FILA: SILUETA CARDIOVASCULAR ===
  const tituloSilueta = "Silueta Cardiovascular: ";
  const datoSilueta = formatearTexto(datosFinales.siluetaCardiovascular || "");
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
  const datoConclusiones = formatearTexto(datosFinales.conclusionesRadiograficas || "");
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

  // Definir columnas para la tabla ILO (7 columnas basadas en la descripción)
  const numColsILO = 7;
  const colWidthILO = tablaAncho / numColsILO;
  const colPositionsILO = [];
  for (let i = 0; i <= numColsILO; i++) {
    colPositionsILO.push(tablaInicioX + (i * colWidthILO));
  }

  // Fila 1: Espacio para X (fila superior para marcar la categoría)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Agregar división en el medio de la tercera celda (índice 2)
  const terceraCeldaMitad = colPositionsILO[2] + (colWidthILO / 2);
  doc.line(terceraCeldaMitad, yPos, terceraCeldaMitad, yPos + filaAltura);

  // Agregar dos divisiones en la cuarta celda (índice 3)
  const cuartaCeldaTercio1 = colPositionsILO[3] + (colWidthILO / 3);
  const cuartaCeldaTercio2 = colPositionsILO[3] + (2 * colWidthILO / 3);
  doc.line(cuartaCeldaTercio1, yPos, cuartaCeldaTercio1, yPos + filaAltura);
  doc.line(cuartaCeldaTercio2, yPos, cuartaCeldaTercio2, yPos + filaAltura);

  // Agregar dos divisiones en la quinta celda (índice 4) para "3/2 3/3 3/+"
  const quintaCeldaTercio1 = colPositionsILO[4] + (colWidthILO / 3);
  const quintaCeldaTercio2 = colPositionsILO[4] + (2 * colWidthILO / 3);
  doc.line(quintaCeldaTercio1, yPos, quintaCeldaTercio1, yPos + filaAltura);
  doc.line(quintaCeldaTercio2, yPos, quintaCeldaTercio2, yPos + filaAltura);

  // Colocar X en la columna correspondiente según datosFinales.neumoconiosisCategoria
  let xPosILO = 0;
  if (datosFinales.neumoconiosisCategoria) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    const anchoX = doc.getTextWidth("X");
    
    // Calcular posición X basada en la categoría específica
    if (datosFinales.neumoconiosisCategoria === '0/0') {
      xPosILO = colPositionsILO[0] + (colWidthILO / 2);
    } else if (datosFinales.neumoconiosisCategoria === '1/0') {
      xPosILO = colPositionsILO[1] + (colWidthILO / 2);
    } else if (datosFinales.neumoconiosisCategoria === '1/1') {
      xPosILO = colPositionsILO[2] + (colWidthILO / 4); // Primera mitad de la celda 2
    } else if (datosFinales.neumoconiosisCategoria === '1/2') {
      xPosILO = terceraCeldaMitad + (colWidthILO / 4); // Segunda mitad de la celda 2
    } else if (datosFinales.neumoconiosisCategoria === '2/1') {
      xPosILO = colPositionsILO[3] + (colWidthILO / 6); // Primera tercera parte de la celda 3
    } else if (datosFinales.neumoconiosisCategoria === '2/2') {
      xPosILO = cuartaCeldaTercio1 + (colWidthILO / 6); // Segunda tercera parte de la celda 3
    } else if (datosFinales.neumoconiosisCategoria === '2/3') {
      xPosILO = cuartaCeldaTercio2 + (colWidthILO / 6); // Tercera parte de la celda 3
    } else if (datosFinales.neumoconiosisCategoria === '3/2') {
      xPosILO = colPositionsILO[4] + (colWidthILO / 6); // Primera tercera parte de la celda 4
    } else if (datosFinales.neumoconiosisCategoria === '3/3') {
      xPosILO = quintaCeldaTercio1 + (colWidthILO / 6); // Segunda tercera parte de la celda 4
    } else if (datosFinales.neumoconiosisCategoria === '3/+') {
      xPosILO = quintaCeldaTercio2 + (colWidthILO / 6); // Tercera parte de la celda 4
    } else if (['A', 'B', 'C'].includes(datosFinales.neumoconiosisCategoria)) {
      xPosILO = colPositionsILO[5] + (colWidthILO / 2);
    } else if (datosFinales.neumoconiosisCategoria === 'ST') {
      xPosILO = colPositionsILO[6] + (colWidthILO / 2);
    } else {
      xPosILO = colPositionsILO[0] + (colWidthILO / 2); // Default a 0/0
    }
    
    // Centrar la X verticalmente en la celda
    doc.text("X", xPosILO - (anchoX / 2), yPos + (filaAltura / 2) + 1.5);
  }
  yPos += filaAltura;

  // Fila 2: Etiquetas de categorías (0/0 | 1/0 | 1/1 1/2 | 2/1 2/2 2/3 | 3/2 3/3 3/+ | A,B,C | ST)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

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
      doc.text(texto1, colPositionsILO[i] + ((colWidthILO / 2 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "1/2" en la segunda mitad
      doc.text(texto2, terceraCeldaMitad + ((colWidthILO / 2 - anchoTexto2) / 2), yPos + 3.5);
    } else if (i === 3) {
      // Para la cuarta celda (2/1 2/2 2/3), centrar cada parte en su subdivisión
      const texto1 = "2/1";
      const texto2 = "2/2";
      const texto3 = "2/3";
      const anchoTexto1 = doc.getTextWidth(texto1);
      const anchoTexto2 = doc.getTextWidth(texto2);
      const anchoTexto3 = doc.getTextWidth(texto3);
      
      // Centrar "2/1" en la primera tercera parte
      doc.text(texto1, colPositionsILO[i] + ((colWidthILO / 3 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "2/2" en la segunda tercera parte
      doc.text(texto2, cuartaCeldaTercio1 + ((colWidthILO / 3 - anchoTexto2) / 2), yPos + 3.5);
      // Centrar "2/3" en la tercera parte
      doc.text(texto3, cuartaCeldaTercio2 + ((colWidthILO / 3 - anchoTexto3) / 2), yPos + 3.5);
    } else if (i === 4) {
      // Para la quinta celda (3/2 3/3 3/+), centrar cada parte en su subdivisión
      const texto1 = "3/2";
      const texto2 = "3/3";
      const texto3 = "3/+";
      const anchoTexto1 = doc.getTextWidth(texto1);
      const anchoTexto2 = doc.getTextWidth(texto2);
      const anchoTexto3 = doc.getTextWidth(texto3);
      
      // Centrar "3/2" en la primera tercera parte
      doc.text(texto1, colPositionsILO[i] + ((colWidthILO / 3 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "3/3" en la segunda tercera parte
      doc.text(texto2, quintaCeldaTercio1 + ((colWidthILO / 3 - anchoTexto2) / 2), yPos + 3.5);
      // Centrar "3/+" en la tercera parte
      doc.text(texto3, quintaCeldaTercio2 + ((colWidthILO / 3 - anchoTexto3) / 2), yPos + 3.5);
    } else {
      // Para las demás celdas, centrar normalmente
      doc.text(label, colPositionsILO[i] + ((colWidthILO - anchoLabel) / 2), yPos + 3.5);
    }
  }
  yPos += filaAltura;

  // Fila 3: Etiquetas de profusión (cero | 1/0 | uno | dos | tres | cuatro | -)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const profLabels = ['cero', '1/0', 'uno', 'dos', 'tres', 'cuatro', '-'];
  for (let i = 0; i < numColsILO; i++) {
    const label = profLabels[i];
    const anchoLabel = doc.getTextWidth(label);
    doc.text(label, colPositionsILO[i] + ((colWidthILO - anchoLabel) / 2), yPos + 3.5);
  }
  yPos += filaAltura;

  // === SECCIÓN ADICIONAL: OTROS HALLAZGOS RADIOGRÁFICOS ===
  yPos = dibujarHeaderSeccion("14. OTROS HALLAZGOS RADIOGRÁFICOS", yPos, filaAltura);

  // Fila para "Sin neumoconiosis" y "Imagen Radiográfica de exposición de polvo" (2 columnas)
  const colWidthOther = tablaAncho / 2;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colWidthOther, yPos, tablaInicioX + colWidthOther, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido con formato mixto
  // Sin neumoconiosis
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sin neumoconiosis:", tablaInicioX + 2, yPos + 3.5);
  const anchoTituloSinNeumoconiosis = doc.getTextWidth("Sin neumoconiosis:");
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.sinNeumoconiosis || ""), tablaInicioX + 2 + anchoTituloSinNeumoconiosis + 10, yPos + 3.5);
  
  // Imagen Radiográfica de exposición de polvo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Imagen Radiográfica de exposición de polvo:", tablaInicioX + colWidthOther + 2, yPos + 3.5);
  const anchoTituloImagenRadiografica = doc.getTextWidth("Imagen Radiográfica de exposición de polvo:");
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.imagenRadiograficaExposicionPolvo || ""), tablaInicioX + colWidthOther + 2 + anchoTituloImagenRadiografica + 10, yPos + 3.5);
  yPos += filaAltura;

  // Fila para "Con neumoconiosis" (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido con formato mixto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Con neumoconiosis:", tablaInicioX + 2, yPos + 3.5);
  const anchoTituloConNeumoconiosis = doc.getTextWidth("Con neumoconiosis:");
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTexto(datosFinales.conNeumoconiosis || ""), tablaInicioX + 2 + anchoTituloConNeumoconiosis + 10, yPos + 3.5);
  yPos += filaAltura;

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
  doc.text(formatearTexto(datosFinales.reaccionesSerologicasLues || ""), tablaInicioX + 2 + anchoTituloReaccionesSerologicas + 10, yPos + 3.5);
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
  doc.text(formatearTexto(vsgValue ? `${vsgValue} mm/h` : ""), tablaInicioX + 15, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Glucosa:", tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const glucosaValue = data.glucosaLaboratorioClinico_txtglucosabio || "";
  doc.text(formatearTexto(glucosaValue ? `${glucosaValue} mg/dL` : ""), tablaInicioX + tablaAncho / 4 + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Urea:", tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(("N/A mg/dL"), tablaInicioX + tablaAncho / 2 + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Creatinina:", tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const creatininaValue = data.creatininaLaboratorioClinico_txtcreatininabio || "";
  doc.text(formatearTexto(creatininaValue ? `${creatininaValue} mg/dL` : ""), tablaInicioX + (3 * tablaAncho / 4) + 30, yPos + 3.5);
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
  doc.text(`${formatearTexto(data.ldlcolesterolAnalisisBioquimico_txtldlcolesterol || "")} mg/dL`, tablaInicioX + 12, yPos + 3.5);

  // Columna 2 (H.D.L)
  const posCol2 = tablaInicioX + lipidoCol1;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("H.D.L:", posCol2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${formatearTexto(data.hdlcolesterolAnalisisBioquimico_txthdlcolesterol || "")} mg/dL`, posCol2 + 12, yPos + 3.5);

  // Columna 3 (V.L.D.L) - Movida más a la izquierda
  const posCol3 = posCol2 + lipidoCol2;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("V.L.D.L:", posCol3 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${formatearTexto(data.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol || "")} mg/dL`, posCol3 + 14, yPos + 3.5);

  // Columna 4 (Triglicéridos)
  const posCol4 = posCol3 + lipidoCol3;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Triglicéridos:", posCol4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${formatearTexto(data.trigliceridosAnalisisBioquimico_txttrigliceridos || "")} mg/dL`, posCol4 + 20, yPos + 3.5);

  // Columna 5 (Colesterol total)
  const posCol5 = posCol4 + lipidoCol4;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Colesterol total:", posCol5 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${formatearTexto(data.colesterolAnalisisBioquimico_txtcolesterol || "")} mg/dL`, posCol5 + 25, yPos + 3.5);

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
  doc.text(formatearTexto(data.cocainaLaboratorioClinico_txtcocaina || ""), tablaInicioX + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Marihuana:", tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTexto(data.marihuanaLaboratorioClinico_txtmarihuana || ""), tablaInicioX + tablaAncho / 4 + 30, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Mercurio:", tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTexto("N/A"), tablaInicioX + tablaAncho / 2 + 30, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Plomo:", tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTexto("N/A"), tablaInicioX + (3 * tablaAncho / 4) + 25, yPos + 3.5);
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
  
  doc.text(formatearTexto(grupoSanguineoTexto), tablaInicioX + 40, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Factor:", tablaInicioX + tablaAncho / 3 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Convertir objeto factorRh a string
  let factorRhTexto = "";
  if (data.grupoSanguineoRhPositivo_rbrhpositivo) factorRhTexto = "Rh(+) Positivo";
  else if (data.grupoSanguineoRhNegativo_rbrhnegativo) factorRhTexto = "Rh(-) Negativo";
  
  doc.text(formatearTexto(factorRhTexto), tablaInicioX + tablaAncho / 3 + 25, yPos + 3.5);

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
  doc.text(formatearTexto((data.hemoglobina_txthemoglobina || "") + " gr. %"), tablaInicioX + (2 * tablaAncho / 3) + 35, yPos + 3.5);
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
  
  doc.text(formatearTexto(aptoParaTrabajarTexto), tablaInicioX + 50, yPos + 3.5);
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
  const anchoDisponibleOtrosExamenesPag3 = tablaAncho - 4;
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
  doc.setFont("helvetica", "normal").setFontSize(8);
  const lineasOtrosExamenesFormateadas = lineasOtrosExamenesPag3.map(linea => linea.toUpperCase());
  lineasOtrosExamenesFormateadas.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoOtrosExamenes));
  });
  yPos += alturaDinamicaOtrosExamenesPag3;

  // === SECCIÓN: CONCLUSIONES ===
  yPos = dibujarHeaderSeccion("17. CONCLUSIONES", yPos, filaAltura);

  // Fila creciente para conclusiones
  const textoConclusionesPag3 = datosFinales.conclusiones || "";
  const anchoDisponibleConclusionesPag3 = tablaAncho - 4;
  const lineasConclusionesPag3 = doc.splitTextToSize(textoConclusionesPag3, anchoDisponibleConclusionesPag3);
  
  // Interlineado para el texto
  const interlineadoTexto = 3;
  
  // Calcular altura dinámica basada en el contenido
  const alturaDinamicaConclusionesPag3 = Math.max(45, lineasConclusionesPag3.length * interlineadoTexto + 4);

  // Dibujar líneas de la fila creciente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaConclusionesPag3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusionesPag3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaConclusionesPag3, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusionesPag3);

  // Contenido de la fila creciente con interlineado controlado
  doc.setFont("helvetica", "normal").setFontSize(8);
  const lineasConclusionesFormateadas = lineasConclusionesPag3.map(linea => linea.toUpperCase());
  lineasConclusionesFormateadas.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoTexto));
  });
  yPos += alturaDinamicaConclusionesPag3;

  // === SECCIÓN: RECOMENDACIONES / RESTRICCIONES ===
  yPos = dibujarHeaderSeccion("18. RECOMENDACIONES / RESTRICCIONES", yPos, filaAltura);

  // Fila creciente para recomendaciones
  const textoRecomendacionesPag3 = datosFinales.recomendacionesRestricciones || "";
  const anchoDisponibleRecomendacionesPag3 = tablaAncho - 4;
  const lineasRecomendacionesPag3 = doc.splitTextToSize(textoRecomendacionesPag3, anchoDisponibleRecomendacionesPag3);
  
  // Calcular altura dinámica basada en el contenido
  const alturaDinamicaRecomendacionesPag3 = Math.max(45, lineasRecomendacionesPag3.length * interlineadoTexto + 4);

  // Dibujar líneas de la fila creciente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaRecomendacionesPag3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaRecomendacionesPag3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaRecomendacionesPag3, tablaInicioX + tablaAncho, yPos + alturaDinamicaRecomendacionesPag3);

  // Contenido de la fila creciente con interlineado controlado
  doc.setFont("helvetica", "normal").setFontSize(8);
  const lineasRecomendacionesFormateadas = lineasRecomendacionesPag3.map(linea => linea.toUpperCase());
  lineasRecomendacionesFormateadas.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoTexto));
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