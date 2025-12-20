import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { getSign } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default async function Anexo7C_Antiguo(data = {}, docExistente = null) {
  // Normalizar estructura de datos: si viene con anexo16Reporte, aplanar la estructura
  if (data.anexo16Reporte && typeof data.anexo16Reporte === 'object') {
    // Combinar anexo16Reporte con las propiedades de nivel superior
    // Priorizar propiedades de nivel superior sobre anexo16Reporte
    const { anexo16Reporte, digitalizacion, textoColor, codigoColor, norden, ...topLevelProps } = data;
    data = {
      ...anexo16Reporte,
      ...topLevelProps,
      // Asegurar que estas propiedades específicas se mantengan del nivel superior si existen
      digitalizacion: digitalizacion || anexo16Reporte.digitalizacion,
      textoColor: textoColor || anexo16Reporte.textoColor,
      codigoColor: codigoColor || anexo16Reporte.codigoColor,
      norden: norden || anexo16Reporte.norden
    };
  }

  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Función helper para obtener el offset del footer según la página
  const getFooterOffset = () => {
    return numeroPagina === 1 ? 13 : 8; // Footer primera página 3mm más cerca del contenido (offset reducido)
  };

  // Función helper para convertir valores vacíos/null a "N/A"
  const formatNA = (value) => {
    if (value === null || value === undefined || value === "" || value === "''" || value === '""') {
      return "N/A";
    }
    const strValue = String(value).trim();
    if (strValue === "" || strValue === "null" || strValue === "undefined") {
      return "N/A";
    }
    // Si ya es "N/A", mantenerlo
    if (strValue.toUpperCase() === "N/A") {
      return "N/A";
    }
    return strValue;
  };

  const datosFinales = {
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
    fechaExamen: formatearFechaCorta(data.fechaAnexo7c_fecha ?? ""),
    tipoExamen: String(data.nombreExamen_nom_examen ?? ""),
    empresa: data.empresa_razon_empresa || "",
    contrata: data.contrata_razon_contrata || "",
    lugarFechaNacimiento: `${data.lugarNacimientoPaciente_lugar_nac_pa ?? ""}\n${formatearFechaCorta(data.fechaNacimientoPaciente_fecha_nacimiento_pa ?? "")}`,
    domicilioHabitual: data.direccionPaciente_direccion ?? "",
    mineralesExplotados: data.mineral_mineral_po ?? "",
    tipoTrabajo: {
      superficie: data.explotacion_nom_ex === "SUPERFICIE" || data.explotacion_nom_ex === "SUPERFICIAL",
      concentrador: data.explotacion_nom_ex === "CONCENTRADOR",
      subsuelo: data.explotacion_nom_ex === "SUBSUELO"
    },
    alturaLabor: {
      debajo2500: data.altura_altura_po === "DEBAJO 2500",
      rango2501_3000: data.altura_altura_po === "2501 A 3000",
      rango3001_3500: data.altura_altura_po === "3001 A 3500",
      rango3501_4000: data.altura_altura_po === "3501 A 4000",
      rango4001_4500: data.altura_altura_po === "4001 A 4500",
      mas4501: data.altura_altura_po === "MAS DE 4501"
    },
    // Datos adicionales para la fila personal
    edad: data.edad_edad ?? "",
    sexoM: data.sexo_sexo_pa === "M",
    sexoF: data.sexo_sexo_pa === "F",
    dni: String(data.dni_cod_pa ?? ""),
    telefono: data.celularPaciente_cel_pa || data.numeroContacto_num_contacto || "",
    estadoCivil: {
      soltero: data.estadoCivilPaciente_estado_civil_pa === "SOLTERO",
      conviviente: data.estadoCivilPaciente_estado_civil_pa === "CONVIVIENTE",
      casado: data.estadoCivilPaciente_estado_civil_pa === "CASADO",
      viudo: data.estadoCivilPaciente_estado_civil_pa === "VIUDO",
      divorciado: data.estadoCivilPaciente_estado_civil_pa === "DIVORCIADO"
    },
    gradoInstruccion: (() => {
      const nivelEstudio = String(data.nivelEstudioPaciente_nivel_est_pa || "").toUpperCase().trim();
      if (!nivelEstudio) {
        return {
          analfabeto: false,
          primariaCom: false,
          secCom: false,
          univers: false,
          primariaInc: false,
          secInc: false,
          tecnico: false
        };
      }

      // Comparación exacta como en JasperReports: $F{nivel_est_pa}.equals("VALOR")?"X":""
      return {
        analfabeto: nivelEstudio === "ANALFABETO",
        primariaCom: nivelEstudio === "PRIMARIA COMPLETA",
        primariaInc: nivelEstudio === "PRIMARIA INCOMPLETA",
        secCom: nivelEstudio === "SECUNDARIA COMPLETA",
        secInc: nivelEstudio === "SECUNDARIA INCOMPLETA",
        univers: nivelEstudio === "UNIVERSITARIO",
        tecnico: nivelEstudio === "TECNICO"
      };
    })(),
    // Datos adicionales para la fila de riesgos ocupacionales
    riesgos: {
      ruido: data.ruidoAnexo7c_chkruido ?? false,
      polvo: data.polvoAnexo7c_chkpolvo ?? false,
      vibSegmentario: data.vidSegmentarioAnexo7c_chkvidsegmentario ?? false,
      vibTotal: data.vidTotalAnexo7c_chkvidtotal ?? false,
      carcinogenos: data.cancerigenosAnexo7c_chkcancerigenos ?? false,
      mutagenicos: data.mutagenicosAnexo7c_chkmutagenicos ?? false,
      solventes: data.solventesAnexo7c_chksolventes ?? false,
      metales: data.metalesAnexo7c_chkmetales ?? false,
      temperatura: data.temperaturaAnexo7c_chktemperatura ?? false,
      biologicos: data.biologicosAnexo7c_chkbiologicos ?? false,
      posturas: data.posturasAnexo7c_chkposturas ?? false,
      turnos: data.turnosAnexo7c_chkturnos ?? false,
      carga: data.cargasAnexo7c_chkcargas ?? false,
      movRepet: data.movRepetAnexo7c_chkmovrepet ?? false,
      pvd: data.pvdAnexo7c_chkpvd ?? false,
      otros: data.otrosAnexo7c_chkotros ?? false,
    },
    puestoPostula: data.cargo_cargo_de ?? "",
    puestoActual: data.puestoActualAnexo7c_txtpuestoactual ?? "",
    tiempo: data.tiempoAnexo7c_txttiempo ?? "",
    reubicacionSi: data.reubicacionSiAnexo7c_tbrsi ?? false,
    reubicacionNo: data.reubicacionNoAnexo7c_rbrno ?? false,
    // Datos para Anamnesis y Antecedentes Ocupacionales
    anamnesis: data.anamnesisAnexo7c_txtanamnesis ?? "",
    antecedentesPersonales: data.antecedentesPersonalesAnexo7c_txtantecedentespersonales ?? "",
    antecedentesFamiliares: data.antecedentesFamiliaresAnexo7c_txtantecedentesfamiliares ?? "",
    inmunizaciones: {
      tetano: data.tetanoAnexo7c_tetano ?? false,
      hepatitisB: data.hepatitisBAnexo7c_hepatitisb ?? false,
      fiebreAmarilla: data.fiebreAmarillaAnexo7c_fiebreamarilla ?? false,
    },
    numeroHijos: {
      vivos: data.hijosVivosAnexo7c_txthijosvivos ?? "",
      muertos: data.hijosMuertosAnexo7c ?? "",
    },
    // Hábitos
    habitos: {
      tabaco: {
        nada: data.tabacoNadaAexo7c_chktnada ?? false,
        poco: data.tabacoPocoAnexo7c_chktpoco ?? false,
        habitual: data.tabacoHabitualAnexo7c_chkthabitual ?? false,
        excesivo: data.tabacoExcesivoAnexo7c_chktexcesivo ?? false,
      },
      alcohol: {
        nada: data.alcoholNadaAnexo7c_chkanada ?? false,
        poco: data.alcoholPocoAnexo7c_chkapoco ?? false,
        habitual: data.alcoholHabitualAnexo7c_chkahabitual ?? false,
        excesivo: data.alcoholExcesivoAnexo7c_chkaexcesivo ?? false,
      },
      drogas: {
        nada: data.drogasNadaAnexo7c_chkdnada ?? false,
        poco: data.drogasPocoAnexo7c_chkdpoco ?? false,
        habitual: data.drogasHabitualAnexo7c_chkdhabitual ?? false,
        excesivo: data.drogasExcesivoAnexo7c_chkdexcesivo ?? false,
      },
    },
    // Medidas corporales
    medidasCorporales: {
      talla: data.tallaTriaje_talla ?? "",
      peso: data.pesoTriaje_peso ?? "",
      imc: data.imcTriaje_imc ?? "",
      cintura: data.cinturaTriaje_cintura ?? "",
      cadera: data.caderaTriaje_cadera ?? "",
      icc: data.iccTriaje_icc ?? "",
    },
    // Función respiratoria
    funcionRespiratoria: {
      fvc: data.fvcFuncionRespiratoria_fvc ?? "",
      fev1: data.fev1FuncionRespiratoria_fev1 ?? "",
      fev1Fvc: data.fev1FvcFuncionRespiratoria_fev1fvc ?? "",
      fef2575: data.fef2575FuncionRespiratoria_fef25_75 ?? "",
      conclusion: data.interpretacionFuncionRespiratoria_interpretacion ?? "",
    },
    // Temperatura
    temperatura: data.temperaturaTriaje_temperatura ?? "",
    // Examen físico cabeza y cuello
    examenFisicoCabezaCuello: {
      cabeza: data.cabezaAnexo7c_txtcabeza ?? "",
      perimetroCuello: data.perimetroCuelloTriaje_perimetro_cuello ?? "",
      bocaAmigdalasFaringeLaringe: data.baflAnexo7c_txtb_a_f_l ?? "",
      cuello: data.cuelloAnexo7c_txtcuello ?? "",
      nariz: data.narizAnexo7c_txtnariz ?? "",
      dentadura: {
        piezasEnMalEstado: String(data.piezasMalEstadoOdontograma_txtpiezasmalestado ?? ""),
        piezasQueFaltan: String(data.ausentesOdontograma_txtausentes ?? ""),
      },
    },
    // Examen de ojos
    examenOjos: {
      visionCerca: {
        sinCorregirOD: data.visionCercaSinCorregirOd_v_cerca_s_od ?? "",
        sinCorregirOI: data.visionCercaSinCorregirOi_v_cerca_s_oi ?? "",
        corregidaOD: data.odcc_odcc ?? "",
        corregidaOI: data.oicc_oicc ?? "",
      },
      visionLejos: {
        sinCorregirOD: data.visionLejosSinCorregirOd_v_lejos_s_od ?? "",
        sinCorregirOI: data.visionLejosSinCorregirOi_v_lejos_s_oi ?? "",
        corregidaOD: data.odlc_odlc ?? "",
        corregidaOI: data.oilc_oilc ?? "",
      },
      enfermedadesOculares: data.enfermedadesOcularesAnexo7c_txtenfermedadesoculares ?? "",
      enfermedadesOcularesOtros: data.enfermedadesOcularesOtrosOftalmo_e_oculares1 ?? "",
      reflejosPupilares: (data.rp_rp || data.reflejosPupilaresAnexo7c_txtreflejospupilares) ?? "",
      testIshihara: data.tecishiharaNormal_rbtecishihara_normal ? "NORMAL" : (data.tecishiharaAnormal_rbtecishihara_anormal ? "ANORMAL" : ""),
      testColoresPuros: data.teccoleresNormal_rbteccoleres_normal ? "NORMAL" : (data.teccoleresAnormal_rbteccoleres_anormal ? "ANORMAL" : ""),
      testProfundidad: data.tecestereopsiaNormal_rbtecestereopsia_normal ? "NORMAL" : (data.tecestereopsiaAnormal_rbtecestereopsia_anormal ? "ANORMAL" : ""),
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
          frecuencia6000: data.oidoDerecho6000Audiometria_o_d_6000 ?? "",
          frecuencia8000: data.oidoDerecho8000Audiometria_o_d_8000 ?? ""
        },
        oidoIzquierdo: {
          frecuencia500: data.oidoIzquierdo500Audiometria_o_i_500 ?? "",
          frecuencia1000: data.oidoIzquierdo1000Audiometria_o_i_1000 ?? "",
          frecuencia2000: data.oidoIzquierdo2000Audiometria_o_i_2000 ?? "",
          frecuencia3000: data.oidoIzquierdo3000Audiometria_o_i_3000 ?? "",
          frecuencia4000: data.oidoIzquierdo4000Audiometria_o_i_4000 ?? "",
          frecuencia6000: data.oidoIzquierdo6000Audiometria_o_i_6000 ?? "",
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
    // Evaluación neurológica
    evaluacionNeurologica: {
      reflejosOsteotendinosos: data.reflejosOsteotendinososAnexo7c_txtreflejososteotendinosos ?? "",
      marcha: data.marchaAnexo7c_txtmarcha ?? ""
    },
    // Evaluación de columna y abdomen
    evaluacionColumnaAbdomen: {
      columnaVertebral: data.columnaVertebralAnexo7c_txtcolumnavertebral ?? "",
      abdomen: data.abdomenAnexo7c_txtabdomen ?? ""
    },
    // Evaluación rectal
    evaluacionRectal: {
      tactoRectal: {
        noSeHizo: data.tactoRectalNoHizoAnexo7c_rbtnohizo ?? false,
        anormal: data.tactoRectalAnormalAnexo7c_rbtanormal ?? false,
        normal: data.tactoRectalNormalAnexo7c_rbtnormal ?? false
      }
    },
    // Evaluación mental
    evaluacionMental: {
      lenguajeAtencionMemoria: data.lenguageAnexo7c_txtlenguage ?? "",
      estadoMental: data.estadoMentalAnexo7c_txtestadomental ?? ""
    },
    // Radiografía de tórax
    radiografiaTorax: {
      numeroRx: String(data.nrx_n_rx ?? ""),
      fecha: formatearFechaCorta(data.fechaExamenRadiografico_fecha_exra ?? ""),
      calidad: data.calidadExamenRadiografico_txtcalidad ?? "",
      simbolos: data.simbolosExamenRadiografico_txtsimbolos ?? "",
      vertices: data.verticesRadiografiaTorax_txtvertices ?? "",
      composicionesPulmonares: data.composicionesPulmonares_txtcomposicionespulmonares ?? "",
      mediastinos: data.meadiastinos_txtmediastinos ?? "",
      hilios: data.hilosRadiografiaTorax_txthilios ?? "",
      senos: data.senosCostoFrenicos_txtsenoscostofrenicos ?? "",
      conclusiones: data.conclusionesRadiograficas_txtconclusionesradiograficas ?? "",
      siluetaCardiovascular: data.siluetaCardioVascular_txtsiluetacardiovascular ?? ""
    },
    // Clasificación de Neumoconiosis
    clasificacionNeumoconiosis: {
      clasificaciones: {
        "0/0": data.examenRadiografico0_ex_0 ?? false,
        "1/0": data.examenRadiografico10_ex_10 ?? false,
        "1/1": data.examenRadiografico11_ex_11 ?? false,
        "1/2": data.examenRadiografico12_ex_12 ?? false,
        "2/1": data.examenRadiografico21_ex_21 ?? false,
        "2/2": data.examenRadiografico22_ex_22 ?? false,
        "2/3": data.examenRadiografico23_ex_23 ?? false,
        "3/2": data.examenRadiografico32_ex_32 ?? false,
        "3/3": data.examenRadiografico33_ex_33 ?? false,
        "3/+": data.examenRadiografico3mas_ex_3mas ?? false,
        "A,B,C": data.examenRadiograficoAbc_ex_abc ?? false,
        "St": data.examenRadiograficoSt_ex_st ?? false
      },
      sinNeumoconiosis: formatNA(data.examenRadiograficoSinNeumoconiosis_txtsinneumoconiosis),
      imagenRadiograficaPolvo: formatNA(data.examenRadiograficoIrep_txtirep),
      conNeumoconiosis: (() => {
        const value = data.examenRadiograficoConNeumoconiosis_txtconneumoconiosis;
        // Si viene vacío, '', "", null, undefined → "No"
        if (value === null || value === undefined || value === "" || value === "''" || value === '""') {
          return "No";
        }
        // Si viene true o alguna data texto o solo true → "Si"
        const strValue = String(value).trim();
        if (strValue === "" || strValue === "null" || strValue === "undefined") {
          return "No";
        }
        // Si tiene contenido (texto o true), mostrar "Si"
        return "Si";
      })()
    },
    // Reacciones Serológicas Lues
    reaccionesSerologicasLues: {
      negativo: data.negativoLaboratorioClinico_chknegativo ?? false,
      positivo: data.positivoLaboratorioClinico_chkpositivo ?? false
    },
    // Exámenes de Laboratorio
    examenesLaboratorio: {
      hemograma: {
        vsg: formatNA(data.vsgLaboratorioClinico_txtvsg),
        glucosa: formatNA(data.glucosaLaboratorioClinico_txtglucosabio),
        urea: formatNA(data.ureaAnexo7c_txturea), // Por defecto N/A
        creatinina: formatNA(data.creatininaLaboratorioClinico_txtcreatininabio),
        leucocitos: formatNA(data.leucocitos_txtleucocitosematologia),
        hematies: formatNA(data.hematies_txthematiesematologia),
        plaquetas: formatNA(data.plaquetas_txtplaquetas),
        neutrofilos: formatNA(data.neutrofilos_txtneutrofilos),
        abastonados: formatNA(data.abastonados_txtabastonados),
        segmentados: formatNA(data.segmentados_txtsegmentadosematologia),
        monocitos: formatNA(data.monocitos_txtmonocitosematologia),
        eosinofilos: formatNA(data.eosinofilos_txteosinofiosematologia),
        basofilos: formatNA(data.basofilos_txtbasofilosematologia),
        linfocitos: formatNA(data.linfocitos_txtlinfocitosematologia)
      },
      perfilLipidico: {
        colesterolTotal: formatNA(data.colesterolAnalisisBioquimico_txtcolesterol),
        ldl: formatNA(data.ldlcolesterolAnalisisBioquimico_txtldlcolesterol),
        hdl: formatNA(data.hdlcolesterolAnalisisBioquimico_txthdlcolesterol),
        vldl: formatNA(data.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol),
        trigliceridos: formatNA(data.trigliceridosAnalisisBioquimico_txttrigliceridos)
      },
      examenOrina: {
        cocaina: formatNA(data.cocainaLaboratorioClinico_txtcocaina),
        marihuana: formatNA(data.marihuanaLaboratorioClinico_txtmarihuana),
        mercurio: formatNA(data.mercurioOrinaAnexo7c_txtmercurio), // Por defecto N/A
        plomo: formatNA(data.plomoSangreAnexo7c_txtplomo) // Por defecto N/A
      }
    },
    // Grupo Sanguíneo
    grupoSanguineo: {
      tipo: {
        o: data.grupoSanguineoO_chko ?? false,
        a: data.grupoSanguineoA_chka ?? false,
        b: data.grupoSanguineoB_chkb ?? false,
        ab: data.grupoSanguineoAB_chkab ?? false
      },
      factorRh: {
        negativo: data.grupoSanguineoRhNegativo_rbrhnegativo ?? false,
        positivo: data.grupoSanguineoRhPositivo_rbrhpositivo ?? false
      },
      hemoglobinaHematocrito: data.hemoglobina_txthemoglobina ?? ""
    },
    // Otros Exámenes
    otrosExamenes: {
      dataCreciente: data.examenRadiograficoOtros_txtotrosex ?? ""
    },
    // Apto para Trabajar
    aptoParaTrabajar: {
      si: data.examenRadiograficoAptoSi_apto_si ?? false,
      no: data.examenRadiograficoAptoNo_apto_no ?? false,
      revaluacionEmpresa: data.examenRadiograficoAptoRe_apto_re ?? false
    },
    // Conclusiones
    conclusiones: data.observacionesFichaMedicaAnexo7c_txtobservacionesfm ?? "",
    // Recomendaciones / Restricciones
    recomendacionesRestricciones: data.conclusionMedicoAnexo7c_txtconclusionmed ?? "",
  };

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    // Título en todas las páginas
    doc.setFont("helvetica", "bold").setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("ANEXO 16", pageW / 2, 28, { align: "center" });
    doc.text("FICHA MEDICA OCUPACIONAL", pageW / 2, 32, { align: "center" });

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(7);
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
  await drawHeader(numeroPagina);

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

  // === CONFIGURACIÓN DE TABLA ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35.5;
  const filaAltura = 5;

  // Fila 1: Apellidos y nombres | Examen medico (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido Fila 1
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("APELLIDOS Y NOMBRES:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.apellidosNombres || "", tablaInicioX + 35, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("EXAMEN MEDICO:", tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + tablaAncho / 2 + 30, yPos + 3.5);
  yPos += filaAltura;

  // Fila 2: Empresa (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido Fila 2
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("EMPRESA:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.empresa || "", tablaInicioX + 24, yPos + 3.5);
  yPos += filaAltura;

  // Fila 3: Contrata (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido Fila 3
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("CONTRATA:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yPos + 3.5);
  yPos += filaAltura;

  // === FILA: FECHA DEL EXAMEN | MINERALES EXPLOTADOS O PROCESADOS ===
  // Estructura: 40% izquierda | 60% derecha
  const anchoCol1 = tablaAncho * 0.40;
  const div1 = tablaInicioX + anchoCol1;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(div1, yPos, div1, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("FECHA DEL EXAMEN:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.fechaExamen || "", tablaInicioX + 35, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("MINERALES EXPLOTADOS O PROCESADOS:", div1 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.mineralesExplotados || "", div1 + 57, yPos + 3.5);
  yPos += filaAltura;

  // === FILA: 4 COLUMNAS - LUGAR Y FECHA DE NACIMIENTO | DOMICILIO HABITUAL | Checkboxes Explotación | Checkboxes Altura ===
  // Estructura: 4 columnas iguales (25% cada una)
  const anchoCol4 = tablaAncho / 4; // 25% cada columna
  const divCol1 = tablaInicioX + anchoCol4;
  const divCol2 = tablaInicioX + (anchoCol4 * 2);
  const divCol3 = tablaInicioX + (anchoCol4 * 3);
  // Altura aumentada para que quepan todos los checkboxes
  const alturaFilaGrande = 18; // 16mm de altura

  // Líneas verticales (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaGrande);
  doc.line(divCol1, yPos, divCol1, yPos + alturaFilaGrande);
  doc.line(divCol2, yPos, divCol2, yPos + alturaFilaGrande);
  doc.line(divCol3, yPos, divCol3, yPos + alturaFilaGrande);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaGrande);

  // Líneas horizontales
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaGrande, tablaInicioX + tablaAncho, yPos + alturaFilaGrande);

  // Línea horizontal divisoria en columna 4 para ALTURA
  const alturaHeader = filaAltura;
  doc.line(divCol3, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

  // Línea vertical divisoria en columna 4 para separar las 2 sub-columnas de alturas
  const divSubCol = divCol3 + (anchoCol4 / 2);
  doc.line(divSubCol, yPos + alturaHeader, divSubCol, yPos + alturaFilaGrande);

  // COLUMNA 1: LUGAR Y FECHA DE NACIMIENTO
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("LUGAR Y FECHA DE NACIMIENTO:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const lineasNacimiento = datosFinales.lugarFechaNacimiento.split('\n');
  lineasNacimiento.forEach((linea, index) => {
    if (linea && linea.trim()) {
      // Separar la data del label: más espacio vertical y alineación a la izquierda con margen
      doc.text(linea.trim(), tablaInicioX + 2, yPos + 3.5 + 4 + (index * 3.5));
    }
  });

  // COLUMNA 2: DOMICILIO HABITUAL
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DOMICILIO HABITUAL:", divCol1 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const textoDomicilio = datosFinales.domicilioHabitual || "";
  if (textoDomicilio) {
    const anchoDisponible = anchoCol4 - 4; // Ancho disponible menos márgenes
    const lineasDomicilio = doc.splitTextToSize(textoDomicilio, anchoDisponible);
    lineasDomicilio.forEach((linea, index) => {
      if (yPos + 3.5 + 4 + (index * 3.5) <= yPos + alturaFilaGrande - 1) {
        // Separar la data del label: más espacio vertical
        doc.text(linea, divCol1 + 2, yPos + 3.5 + 4 + (index * 3.5));
      }
    });
  }

  // COLUMNA 3: Checkboxes de Explotación (SUPERFICIE, CONCENTRADOR, SUBSUELO)
  const checkboxSize = 3; // Tamaño del checkbox
  const checkboxY = yPos + 2;
  const checkboxX = divCol2 + 2;
  const checkboxSpacing = 3.5;

  // SUPERFICIE
  let yCheckActual = checkboxY;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(checkboxX, yCheckActual, checkboxSize, checkboxSize);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("SUPERFICIE", checkboxX + checkboxSize + 1, yCheckActual + 2);
  if (datosFinales.tipoTrabajo?.superficie) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = checkboxX + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheckActual + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }

  // CONCENTRADOR
  yCheckActual += checkboxSpacing;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(checkboxX, yCheckActual, checkboxSize, checkboxSize);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("CONCENTRADOR", checkboxX + checkboxSize + 1, yCheckActual + 2);
  if (datosFinales.tipoTrabajo?.concentrador) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = checkboxX + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheckActual + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }

  // SUBSUELO
  yCheckActual += checkboxSpacing;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(checkboxX, yCheckActual, checkboxSize, checkboxSize);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("SUBSUELO", checkboxX + checkboxSize + 1, yCheckActual + 2);
  if (datosFinales.tipoTrabajo?.subsuelo) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = checkboxX + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheckActual + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }

  // COLUMNA 4: ALTURA DE LA LABOR (MSNM) con checkboxes en 2 sub-columnas
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ALTURA DE LA LABOR (MSNM):", divCol3 + 2, yPos + 3.5);

  // Checkboxes de Altura en 2 sub-columnas dentro de la columna 4
  const checkboxAlturaY = yPos + alturaHeader + 2;
  const anchoSubCol = anchoCol4 / 2; // Mitad de la columna 4 para cada sub-columna
  let checkboxAlturaX1 = divCol3 + 2; // Sub-columna izquierda
  let checkboxAlturaX2 = divCol3 + anchoSubCol + 2; // Sub-columna derecha
  const checkboxAlturaSpacing = 3.5;

  // Sub-columna izquierda de alturas
  const alturasIzq = [
    { label: "Debajo 2500", value: datosFinales.alturaLabor?.debajo2500 },
    { label: "2501 a 3000", value: datosFinales.alturaLabor?.rango2501_3000 },
    { label: "3001 a 3500", value: datosFinales.alturaLabor?.rango3001_3500 }
  ];

  alturasIzq.forEach((altura, index) => {
    const yCheck = checkboxAlturaY + (index * checkboxAlturaSpacing);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(checkboxAlturaX1, yCheck, checkboxSize, checkboxSize);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(altura.label, checkboxAlturaX1 + checkboxSize + 1, yCheck + 2);
    if (altura.value) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCentered = checkboxAlturaX1 + (checkboxSize / 2) - (textWidthX / 2);
      const yCentered = yCheck + (checkboxSize / 2) + 1;
      doc.text("X", xCentered, yCentered);
    }
  });

  // Sub-columna derecha de alturas
  const alturasDer = [
    { label: "3501 a 4000", value: datosFinales.alturaLabor?.rango3501_4000 },
    { label: "4001 a 4500", value: datosFinales.alturaLabor?.rango4001_4500 },
    { label: "Más de 4501", value: datosFinales.alturaLabor?.mas4501 }
  ];

  alturasDer.forEach((altura, index) => {
    const yCheck = checkboxAlturaY + (index * checkboxAlturaSpacing);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(checkboxAlturaX2, yCheck, checkboxSize, checkboxSize);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(altura.label, checkboxAlturaX2 + checkboxSize + 1, yCheck + 2);
    if (altura.value) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCentered = checkboxAlturaX2 + (checkboxSize / 2) - (textWidthX / 2);
      const yCentered = yCheck + (checkboxSize / 2) + 1;
      doc.text("X", xCentered, yCentered);
    }
  });

  yPos += alturaFilaGrande;

  // === FILA: EDAD | SEXO | DNI/CE/NIE (con TELEFONO) | ESTADO CIVIL | GRADO DE INSTRUCCION ===
  // Estructura: 5 columnas con anchos específicos
  const colWidthsPersonal = [20, 15, 45, 55, 65]; // Suman 200
  const divPersonal = [tablaInicioX];
  let acum = tablaInicioX;
  colWidthsPersonal.forEach(w => {
    acum += w;
    divPersonal.push(acum);
  });

  const alturaFilaPersonal = 18; // Aumentado para evitar choque

  // Líneas verticales
  divPersonal.forEach(div => {
    doc.line(div, yPos, div, yPos + alturaFilaPersonal);
  });

  // Líneas horizontales
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaPersonal, tablaInicioX + tablaAncho, yPos + alturaFilaPersonal);

  // Encabezados de columna
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("EDAD", divPersonal[0] + 2, yPos + 3.5);
  doc.text("SEXO", divPersonal[1] + 2, yPos + 3.5);
  doc.text("DNI / CE / NIE", divPersonal[2] + 2, yPos + 3.5);
  doc.text("ESTADO CIVIL", divPersonal[3] + 2, yPos + 3.5);
  doc.text("GRADO DE INSTRUCCION", divPersonal[4] + 2, yPos + 3.5);

  // Contenido: EDAD
  doc.setFont("helvetica", "normal").setFontSize(7);
  const edadTexto = datosFinales.edad ? `${datosFinales.edad} Años` : "";
  const edadAncho = doc.getTextWidth(edadTexto);
  doc.text(edadTexto, divPersonal[0] + (colWidthsPersonal[0] / 2) - (edadAncho / 2), yPos + (alturaFilaPersonal / 2) + 1);

  // Contenido: SEXO (checkboxes verticales)
  let yCheck = yPos + 5;
  const xCheckSexo = divPersonal[1] + 2;
  const spacing = 4;

  // M
  doc.rect(xCheckSexo, yCheck, checkboxSize, checkboxSize);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("M", xCheckSexo + checkboxSize + 1, yCheck + 2);
  if (datosFinales.sexoM) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xCheckSexo + checkboxSize / 2 - 1, yCheck + 2.5);
  }

  // F
  yCheck += spacing;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCheckSexo, yCheck, checkboxSize, checkboxSize);
  doc.text("F", xCheckSexo + checkboxSize + 1, yCheck + 2);
  if (datosFinales.sexoF) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xCheckSexo + checkboxSize / 2 - 1, yCheck + 2.5);
  }

  // Contenido: DNI / CE / NIE y TELEFONO
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.dni || "", divPersonal[2] + 2, yPos + 6.5);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("TELEFONO", divPersonal[2] + 2, yPos + 11.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.telefono || "", divPersonal[2] + 2, yPos + 14.5);

  // Contenido: ESTADO CIVIL (checkboxes en 3 líneas)
  const xCol1Estado = divPersonal[3] + 2;
  const xCol2Estado = divPersonal[3] + 28;
  yCheck = yPos + 5;

  // Línea 1: Soltero y Conviviente
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol1Estado, yCheck, checkboxSize, checkboxSize);
  doc.text("SOLTERO", xCol1Estado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.estadoCivil?.soltero) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xCol1Estado + checkboxSize / 2 - 1, yCheck + 2.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol2Estado, yCheck, checkboxSize, checkboxSize);
  doc.text("CONVIVIENTE", xCol2Estado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.estadoCivil?.conviviente) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xCol2Estado + checkboxSize / 2 - 1, yCheck + 2.5);
  }

  // Línea 2: Casado y Viudo
  yCheck += spacing;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol1Estado, yCheck, checkboxSize, checkboxSize);
  doc.text("CASADO", xCol1Estado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.estadoCivil?.casado) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xCol1Estado + checkboxSize / 2 - 1, yCheck + 2.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol2Estado, yCheck, checkboxSize, checkboxSize);
  doc.text("VIUDO", xCol2Estado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.estadoCivil?.viudo) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xCol2Estado + checkboxSize / 2 - 1, yCheck + 2.5);
  }

  // Línea 3: Divorciado
  yCheck += spacing;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol1Estado, yCheck, checkboxSize, checkboxSize);
  doc.text("DIVORCIADO", xCol1Estado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.estadoCivil?.divorciado) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xCol1Estado + checkboxSize / 2 - 1, yCheck + 2.5);
  }

  // Contenido: GRADO DE INSTRUCCION (checkboxes en 3 líneas)
  const xCol1Grado = divPersonal[4] + 2;
  const xCol2Grado = divPersonal[4] + 22;
  const xCol3Grado = divPersonal[4] + 42;
  yCheck = yPos + 5;

  // Línea 1: Analfabeto
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol1Grado, yCheck, checkboxSize, checkboxSize);
  doc.text("Analfabeto", xCol1Grado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.gradoInstruccion?.analfabeto) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = xCol1Grado + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheck + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }

  // Línea 2: Primaria.Com., Sec.Com., Univers.
  yCheck += spacing;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol1Grado, yCheck, checkboxSize, checkboxSize);
  doc.text("Primaria.Com.", xCol1Grado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.gradoInstruccion?.primariaCom) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = xCol1Grado + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheck + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol2Grado, yCheck, checkboxSize, checkboxSize);
  doc.text("Sec.Com.", xCol2Grado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.gradoInstruccion?.secCom) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = xCol2Grado + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheck + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol3Grado, yCheck, checkboxSize, checkboxSize);
  doc.text("Univers.", xCol3Grado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.gradoInstruccion?.univers) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = xCol3Grado + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheck + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }

  // Línea 3: Primaria.Inc., Sec.Inc., Técnico
  yCheck += spacing;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol1Grado, yCheck, checkboxSize, checkboxSize);
  doc.text("Primaria.Inc.", xCol1Grado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.gradoInstruccion?.primariaInc) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = xCol1Grado + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheck + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol2Grado, yCheck, checkboxSize, checkboxSize);
  doc.text("Sec.Inc.", xCol2Grado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.gradoInstruccion?.secInc) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = xCol2Grado + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheck + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCol3Grado, yCheck, checkboxSize, checkboxSize);
  doc.text("Técnico", xCol3Grado + checkboxSize + 1, yCheck + 2);
  if (datosFinales.gradoInstruccion?.tecnico) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCentered = xCol3Grado + (checkboxSize / 2) - (textWidthX / 2);
    const yCentered = yCheck + (checkboxSize / 2) + 1;
    doc.text("X", xCentered, yCentered);
  }

  yPos += alturaFilaPersonal;

  // === FILA: FACTORES DE RIESGO OCUPACIONAL (OPTIMIZADA) ===

  // Estructura: 4 columnas de checkboxes + 1 columna ancha para puestos/tiempo/reubicación

  const anchoColRiesgoCheck = 25; // Ancho reducido para columnas de checkboxes (35mm)

  const divRiesgo = [
    tablaInicioX,
    tablaInicioX + anchoColRiesgoCheck,
    tablaInicioX + (anchoColRiesgoCheck * 2),
    tablaInicioX + (anchoColRiesgoCheck * 3),
    tablaInicioX + (anchoColRiesgoCheck * 4),
    tablaInicioX + tablaAncho
  ];

  const alturaFilaRiesgo = 18;

  // Líneas verticales (solo bordes externos + separadores entre columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaRiesgo);
  doc.line(divRiesgo[1], yPos, divRiesgo[1], yPos + alturaFilaRiesgo);
  doc.line(divRiesgo[2], yPos, divRiesgo[2], yPos + alturaFilaRiesgo);
  doc.line(divRiesgo[3], yPos, divRiesgo[3], yPos + alturaFilaRiesgo);
  doc.line(divRiesgo[4], yPos, divRiesgo[4], yPos + alturaFilaRiesgo);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaRiesgo);

  // Líneas horizontales
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaRiesgo, tablaInicioX + tablaAncho, yPos + alturaFilaRiesgo);

  // === CHECKBOXES COMPACTOS (4 por columna, sin líneas internas) ===

  const checkboxRiesgoSize = 2.8;
  const checkboxRiesgoY = yPos + 2.2;
  const checkboxRiesgoSpacing = 3.3;
  const labelOffsetX = 1;

  // Función para dibujar checkbox + etiqueta
  const drawCheck = (x, y, label, checked) => {
    doc.rect(x, y, checkboxRiesgoSize, checkboxRiesgoSize);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(label, x + checkboxRiesgoSize + labelOffsetX, y + 1.8);
    if (checked) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text("X", x + 0.4, y + 2.2);
    }
  };

  // COLUMNA 1
  let xCheckRiesgo = tablaInicioX + 2;
  let yCheckRiesgo = checkboxRiesgoY;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Ruido", datosFinales.riesgos?.ruido);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Polvo", datosFinales.riesgos?.polvo);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Vib Segmentario", datosFinales.riesgos?.vibSegmentario);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Vib Total", datosFinales.riesgos?.vibTotal);

  // COLUMNA 2
  xCheckRiesgo = divRiesgo[1] + 2;
  yCheckRiesgo = checkboxRiesgoY;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Carcinogenos", datosFinales.riesgos?.carcinogenos);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Mutagenicos", datosFinales.riesgos?.mutagenicos);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Solventes", datosFinales.riesgos?.solventes);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Metales", datosFinales.riesgos?.metales);

  // COLUMNA 3
  xCheckRiesgo = divRiesgo[2] + 2;
  yCheckRiesgo = checkboxRiesgoY;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Temperatura", datosFinales.riesgos?.temperatura);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Biologicos", datosFinales.riesgos?.biologicos);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Posturas", datosFinales.riesgos?.posturas);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Turnos", datosFinales.riesgos?.turnos);

  // COLUMNA 4
  xCheckRiesgo = divRiesgo[3] + 2;
  yCheckRiesgo = checkboxRiesgoY;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Carga", datosFinales.riesgos?.carga);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Mov. Repet.", datosFinales.riesgos?.movRepet);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "PVD", datosFinales.riesgos?.pvd);
  yCheckRiesgo += checkboxRiesgoSpacing;
  drawCheck(xCheckRiesgo, yCheckRiesgo, "Otros", datosFinales.riesgos?.otros);

  // === COLUMNA 5: INFORMACIÓN DE PUESTO (ancha) ===
  const xCol5 = divRiesgo[4] + 2;
  let yCol5 = checkboxRiesgoY;

  doc.setFont("helvetica", "bold").setFontSize(7.2);
  doc.text("PUESTO.POSTULA:", xCol5, yCol5 + 1.8);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.puestoPostula || "", xCol5 + 25, yCol5 + 1.8);

  yCol5 += checkboxRiesgoSpacing;
  doc.setFont("helvetica", "bold").setFontSize(7.2);
  doc.text("PUESTO ACTUAL:", xCol5, yCol5 + 1.8);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.puestoActual || "", xCol5 + 25, yCol5 + 1.8);

  yCol5 += checkboxRiesgoSpacing;
  doc.setFont("helvetica", "bold").setFontSize(7.2);
  doc.text("TIEMPO:", xCol5, yCol5 + 1.8);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.tiempo || "", xCol5 + 25, yCol5 + 1.8);

  yCol5 += checkboxRiesgoSpacing;
  doc.setFont("helvetica", "bold").setFontSize(7.2);
  doc.text("REUBICACION:", xCol5, yCol5 + 1.8);
  const xSi = xCol5 + 24;
  const yCheckboxReub = yCol5 + 0.2;
  doc.rect(xSi, yCheckboxReub, checkboxRiesgoSize, checkboxRiesgoSize);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const yTextoSino = yCheckboxReub + (checkboxRiesgoSize / 2) + 0.5;
  doc.text("SI", xSi + checkboxRiesgoSize + 1, yTextoSino);
  if (datosFinales.reubicacionSi) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCenteredX = xSi + (checkboxRiesgoSize / 2) - (textWidthX / 2);
    const yCenteredX = yCheckboxReub + (checkboxRiesgoSize / 2) + 1;
    doc.text("X", xCenteredX, yCenteredX);
  }

  const xNo = xSi + 14;
  doc.rect(xNo, yCheckboxReub, checkboxRiesgoSize, checkboxRiesgoSize);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("NO", xNo + checkboxRiesgoSize + 1, yTextoSino);
  if (datosFinales.reubicacionNo) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    const xCenteredX = xNo + (checkboxRiesgoSize / 2) - (textWidthX / 2);
    const yCenteredX = yCheckboxReub + (checkboxRiesgoSize / 2) + 1;
    doc.text("X", xCenteredX, yCenteredX);
  }

  yPos += alturaFilaRiesgo;

  // === SECCIÓN: ANTECEDENTES OCUPACIONALES ===

  // Verificar si necesitamos nueva página
  const pageHeight = doc.internal.pageSize.getHeight();
  const espacioNecesario = 20; // Espacio aproximado necesario
  if (yPos + espacioNecesario > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Fila 1: ANAMNESIS (fila creciente)
  // Fila header con label
  const alturaFilaHeaderAnamnesis = 5;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaHeaderAnamnesis);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaHeaderAnamnesis);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaHeaderAnamnesis, tablaInicioX + tablaAncho, yPos + alturaFilaHeaderAnamnesis);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ANAMNESIS", tablaInicioX + 2, yPos + 3.5);

  yPos += alturaFilaHeaderAnamnesis;

  // Fila creciente con data
  const alturaFilaCrecienteAnamnesis = 10; // Altura mínima
  const textoAnamnesis = datosFinales.anamnesis || "";
  const anchoDisponibleAnamnesis = tablaAncho - 4;
  const lineasAnamnesis = doc.splitTextToSize(textoAnamnesis, anchoDisponibleAnamnesis);
  const interlineadoAnamnesis = 2.5;
  const alturaDinamicaAnamnesis = Math.max(alturaFilaCrecienteAnamnesis, lineasAnamnesis.length * interlineadoAnamnesis + 4);

  // Dibujar líneas de la fila creciente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaAnamnesis);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnamnesis);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaAnamnesis, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnamnesis);

  // Contenido de la fila creciente
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasAnamnesis.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoAnamnesis));
  });

  yPos += alturaDinamicaAnamnesis;

  // Fila 2: ANTECEDENTES OCUPACIONALES (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(7)
    ;
  doc.text("ANTECEDENTES OCUPACIONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila 2: ANTECEDENTES PERSONALES (izquierda) | Espacio en blanco (derecha)
  // Estructura: La división debe alinearse con el inicio de ANTECEDENTES FAMILIARES
  const anchoColAntecedentes = tablaAncho * 0.40; // 40% del ancho total (más ancho)
  const divAntecedentes = tablaInicioX + anchoColAntecedentes;
  const alturaFilaAntecedentes = 12; // Altura suficiente para texto de 2 líneas

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaAntecedentes);
  doc.line(divAntecedentes, yPos, divAntecedentes, yPos + alturaFilaAntecedentes);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaAntecedentes, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes);

  // Columna izquierda: ANTECEDENTES PERSONALES
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ANTECEDENTES PERSONALES", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("(enfermedades y accidentes en el trabajo o fuera de el mismo)", tablaInicioX + 2, yPos + 6.5);

  // Columna derecha: Espacio para completar (mostrar datos si existen)
  if (datosFinales.antecedentesPersonales) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoAntecedentes = String(datosFinales.antecedentesPersonales).trim();
    // Dividir texto en líneas si es muy largo
    const maxWidth = tablaAncho - anchoColAntecedentes - 4;
    const lineas = doc.splitTextToSize(textoAntecedentes, maxWidth);
    lineas.forEach((linea, index) => {
      if (yPos + 3.5 + (index * 3) + 3 <= yPos + alturaFilaAntecedentes - 1) {
        doc.text(linea, divAntecedentes + 2, yPos + 3.5 + (index * 3));
      }
    });
  }

  yPos += alturaFilaAntecedentes;

  // === SECCIÓN: ANTECEDENTES FAMILIARES | INMUNIZACIONES | NÚMERO DE HIJOS ===
  // Estructura: 3 columnas con anchos ajustados para alinearse con ANTECEDENTES PERSONALES
  // Asegurar que el borde izquierdo se alinee con ANTECEDENTES PERSONALES
  const anchoCol1Sec = tablaAncho * 0.40; // 40% - Mismo ancho que ANTECEDENTES PERSONALES
  const anchoCol2Sec = tablaAncho * 0.30; // 30% - INMUNIZACIONES
  const anchoCol3Sec = tablaAncho * 0.30; // 30% - NÚMERO DE HIJOS
  const inicioSec3Col = tablaInicioX; // Mismo inicio que ANTECEDENTES PERSONALES
  const divCol1Sec = inicioSec3Col + anchoCol1Sec;
  const divCol2Sec = inicioSec3Col + anchoCol1Sec + anchoCol2Sec;
  const alturaFilaSeccion = 19; // Altura suficiente para contenido

  // Verificar si necesitamos nueva página
  if (yPos + alturaFilaSeccion > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Líneas verticales - alineadas con ANTECEDENTES PERSONALES
  doc.line(inicioSec3Col, yPos, inicioSec3Col, yPos + alturaFilaSeccion);
  doc.line(divCol1Sec, yPos, divCol1Sec, yPos + alturaFilaSeccion);
  doc.line(divCol2Sec, yPos, divCol2Sec, yPos + alturaFilaSeccion);
  doc.line(inicioSec3Col + tablaAncho, yPos, inicioSec3Col + tablaAncho, yPos + alturaFilaSeccion);

  // Líneas horizontales
  doc.line(inicioSec3Col, yPos, inicioSec3Col + tablaAncho, yPos);
  doc.line(inicioSec3Col, yPos + alturaFilaSeccion, inicioSec3Col + tablaAncho, yPos + alturaFilaSeccion);

  // Línea horizontal divisoria para header de cada sección
  const alturaHeaderSec = filaAltura;
  doc.line(inicioSec3Col, yPos + alturaHeaderSec, divCol1Sec, yPos + alturaHeaderSec);
  doc.line(divCol1Sec, yPos + alturaHeaderSec, divCol2Sec, yPos + alturaHeaderSec);
  doc.line(divCol2Sec, yPos + alturaHeaderSec, inicioSec3Col + tablaAncho, yPos + alturaHeaderSec);

  // === COLUMNA 1: ANTECEDENTES FAMILIARES ===
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textAntecedentesFamiliares = "ANTECEDENTES FAMILIARES";
  const textWidthFamiliares = doc.getTextWidth(textAntecedentesFamiliares);
  doc.text(textAntecedentesFamiliares, inicioSec3Col + (anchoCol1Sec / 2) - (textWidthFamiliares / 2), yPos + 3.5);

  // Contenido de antecedentes familiares (si existe) - separado del label con más espacio
  if (datosFinales.antecedentesFamiliares) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoFamiliares = String(datosFinales.antecedentesFamiliares).trim();
    const anchoDisponible = anchoCol1Sec - 4; // Ancho disponible menos márgenes
    const lineas = doc.splitTextToSize(textoFamiliares, anchoDisponible);
    const yTextoInicio = yPos + alturaHeaderSec + 4; // Más espacio después del header (separación del label)
    lineas.forEach((linea, index) => {
      const yLineaTexto = yTextoInicio + (index * 3.5); // Interlineado aumentado de 2.5 a 3.5
      if (yLineaTexto + 3.5 <= yPos + alturaFilaSeccion - 1) {
        doc.text(linea, inicioSec3Col + 2, yLineaTexto);
      }
    });
  }

  // === COLUMNA 2: INMUNIZACIONES ===
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textInmunizaciones = "INMUNIZACIONES";
  const textWidthInmunizaciones = doc.getTextWidth(textInmunizaciones);
  doc.text(textInmunizaciones, divCol1Sec + (anchoCol2Sec / 2) - (textWidthInmunizaciones / 2), yPos + 3.5);

  // Checkboxes de inmunizaciones
  const checkboxInmSize = 2.8;
  const checkboxInmYInicio = yPos + alturaHeaderSec + 2;
  const checkboxInmSpacing = 4;
  const checkboxInmX = divCol1Sec + 2;

  // TETANO
  let yCheckInm = checkboxInmYInicio;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(checkboxInmX, yCheckInm, checkboxInmSize, checkboxInmSize);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("TETANO", checkboxInmX + checkboxInmSize + 1, yCheckInm + 1.8);
  if (datosFinales.inmunizaciones?.tetano) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", checkboxInmX + checkboxInmSize / 2 - 1, yCheckInm + 2.2);
  }

  // HEPATITIS - B
  yCheckInm += checkboxInmSpacing;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(checkboxInmX, yCheckInm, checkboxInmSize, checkboxInmSize);
  doc.text("HEPATITIS - B", checkboxInmX + checkboxInmSize + 1, yCheckInm + 1.8);
  if (datosFinales.inmunizaciones?.hepatitisB) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", checkboxInmX + checkboxInmSize / 2 - 1, yCheckInm + 2.2);
  }

  // FIEBRE AMARILLA
  yCheckInm += checkboxInmSpacing;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(checkboxInmX, yCheckInm, checkboxInmSize, checkboxInmSize);
  doc.text("FIEBRE AMARILLA", checkboxInmX + checkboxInmSize + 1, yCheckInm + 1.8);
  if (datosFinales.inmunizaciones?.fiebreAmarilla) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", checkboxInmX + checkboxInmSize / 2 - 1, yCheckInm + 2.2);
  }

  // === COLUMNA 3: NÚMERO DE HIJOS ===
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textNumeroHijos = "NUMERO DE HIJOS";
  const textWidthNumeroHijos = doc.getTextWidth(textNumeroHijos);
  doc.text(textNumeroHijos, divCol2Sec + (anchoCol3Sec / 2) - (textWidthNumeroHijos / 2), yPos + 3.5);

  // Subdivisión para VIVOS y MUERTOS
  const anchoSubColHijos = anchoCol3Sec / 2;
  const divSubColHijos = divCol2Sec + anchoSubColHijos;
  const alturaSubHeaderHijos = filaAltura;

  // Línea vertical divisoria
  doc.line(divSubColHijos, yPos + alturaHeaderSec, divSubColHijos, yPos + alturaFilaSeccion);

  // Línea horizontal divisoria
  doc.line(divCol2Sec, yPos + alturaHeaderSec + alturaSubHeaderHijos, tablaInicioX + tablaAncho, yPos + alturaHeaderSec + alturaSubHeaderHijos);

  // Headers de subcolumnas
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textVivos = "VIVOS";
  const textWidthVivos = doc.getTextWidth(textVivos);
  doc.text(textVivos, divCol2Sec + (anchoSubColHijos / 2) - (textWidthVivos / 2), yPos + alturaHeaderSec + 3.5);
  const textMuertos = "MUERTOS";
  const textWidthMuertos = doc.getTextWidth(textMuertos);
  doc.text(textMuertos, divSubColHijos + (anchoSubColHijos / 2) - (textWidthMuertos / 2), yPos + alturaHeaderSec + 3.5);

  // Contenido de VIVOS y MUERTOS
  const contenidoY = yPos + alturaHeaderSec + alturaSubHeaderHijos + 5;
  doc.setFont("helvetica", "normal").setFontSize(7);
  const textVivosData = datosFinales.numeroHijos?.vivos || "";
  const textWidthVivosData = doc.getTextWidth(textVivosData);
  doc.text(textVivosData, divCol2Sec + (anchoSubColHijos / 2) - (textWidthVivosData / 2), contenidoY);
  const textMuertosData = datosFinales.numeroHijos?.muertos || "";
  const textWidthMuertosData = doc.getTextWidth(textMuertosData);
  doc.text(textMuertosData, divSubColHijos + (anchoSubColHijos / 2) - (textWidthMuertosData / 2), contenidoY);

  yPos += alturaFilaSeccion;

  // === SECCIÓN: HÁBITOS | MEDIDAS ANTROPOMÉTRICAS | FUNCIÓN RESPIRATORIA | MEDIDAS ADICIONALES ===

  // Verificar si necesitamos nueva página
  const espacioNecesarioHabitos = 30;
  if (yPos + espacioNecesarioHabitos > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Estructura: 4 columnas con anchos específicos
  // HÁBITOS (30%) | MEDIDAS ANTROPOMÉTRICAS (25%) | FUNCIÓN RESPIRATORIA (30%) | MEDIDAS ADICIONALES (15%)
  const anchoHabitos = tablaAncho * 0.30;
  const anchoMedidas = tablaAncho * 0.25;
  const anchoFuncion = tablaAncho * 0.30;
  const anchoMedidasAdic = tablaAncho * 0.15;

  const divHabitos = tablaInicioX + anchoHabitos;
  const divMedidas = divHabitos + anchoMedidas;
  const divFuncion = divMedidas + anchoFuncion;
  const alturaSeccionHabitos = 30; // Altura aumentada para que entre todo bien

  // Líneas verticales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionHabitos);
  doc.line(divHabitos, yPos, divHabitos, yPos + alturaSeccionHabitos);
  doc.line(divMedidas, yPos, divMedidas, yPos + alturaSeccionHabitos);
  doc.line(divFuncion, yPos, divFuncion, yPos + alturaSeccionHabitos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionHabitos);

  // Líneas horizontales
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaSeccionHabitos, tablaInicioX + tablaAncho, yPos + alturaSeccionHabitos);

  // Línea horizontal divisoria para header
  const alturaHeaderHabitos = filaAltura;
  doc.line(tablaInicioX, yPos + alturaHeaderHabitos, tablaInicioX + tablaAncho, yPos + alturaHeaderHabitos);

  // === COLUMNA 1: HÁBITOS ===
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textHabitos = "HABITOS";
  const textWidthHabitos = doc.getTextWidth(textHabitos);
  doc.text(textHabitos, tablaInicioX + (anchoHabitos / 2) - (textWidthHabitos / 2), yPos + 3.5);

  // Grid de checkboxes: 4 filas (Nada, Poco, Habitual, Excesivo) x 3 columnas (Tabaco, Alcohol, Drogas)
  const checkboxHabSize = 2.5;
  const anchoHabCol = anchoHabitos / 3;

  // Headers de columnas de hábitos (justo después del header principal)
  doc.setFont("helvetica", "bold").setFontSize(7);
  const yHeadersHabitos = yPos + alturaHeaderHabitos + 4;
  doc.text("TABACO", tablaInicioX + (anchoHabCol / 2) - (doc.getTextWidth("TABACO") / 2), yHeadersHabitos);
  doc.text("ALCOHOL", tablaInicioX + anchoHabCol + (anchoHabCol / 2) - (doc.getTextWidth("ALCOHOL") / 2), yHeadersHabitos);
  doc.text("DROGAS", tablaInicioX + (anchoHabCol * 2) + (anchoHabCol / 2) - (doc.getTextWidth("DROGAS") / 2), yHeadersHabitos);

  // Checkboxes empiezan después de los headers - mejor centrado vertical
  const espacioDespuesSubHeaders = 3;
  const espacioDisponible = alturaSeccionHabitos - (yHeadersHabitos - yPos) - espacioDespuesSubHeaders - 2;
  const checkboxHabYInicio = yHeadersHabitos + espacioDespuesSubHeaders;
  const checkboxHabSpacing = espacioDisponible / 4; // Distribuir uniformemente los 4 checkboxes

  // Líneas verticales internas para hábitos
  doc.line(tablaInicioX + anchoHabCol, yPos + alturaHeaderHabitos, tablaInicioX + anchoHabCol, yPos + alturaSeccionHabitos);
  doc.line(tablaInicioX + (anchoHabCol * 2), yPos + alturaHeaderHabitos, tablaInicioX + (anchoHabCol * 2), yPos + alturaSeccionHabitos);

  // Labels de filas
  const labelsHabitos = ["NADA", "POCO", "HABITUAL", "EXCESIVO"];

  // Función para dibujar checkbox de hábito con su etiqueta
  const drawHabitoCheckConLabel = (xCheckbox, xLabel, y, label, checked) => {
    // Dibujar checkbox
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(xCheckbox, y, checkboxHabSize, checkboxHabSize);
    if (checked) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckbox + (checkboxHabSize / 2) - (textWidthX / 2);
      const yCenteredX = y + (checkboxHabSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
    }
    // Dibujar etiqueta
    doc.setFont("helvetica", "normal").setFontSize(6.5);
    doc.text(label, xLabel, y + 1.8);
  };

  // Tabaco (columna 1)
  let yCheckHab = checkboxHabYInicio;
  const xTabaco = tablaInicioX + anchoHabCol - checkboxHabSize - 2;
  const xLabelTabaco = tablaInicioX + 2;
  drawHabitoCheckConLabel(xTabaco, xLabelTabaco, yCheckHab, labelsHabitos[0], datosFinales.habitos?.tabaco?.nada);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xTabaco, xLabelTabaco, yCheckHab, labelsHabitos[1], datosFinales.habitos?.tabaco?.poco);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xTabaco, xLabelTabaco, yCheckHab, labelsHabitos[2], datosFinales.habitos?.tabaco?.habitual);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xTabaco, xLabelTabaco, yCheckHab, labelsHabitos[3], datosFinales.habitos?.tabaco?.excesivo);

  // Alcohol (columna 2)
  yCheckHab = checkboxHabYInicio;
  const xAlcohol = tablaInicioX + (anchoHabCol * 2) - checkboxHabSize - 2;
  const xLabelAlcohol = tablaInicioX + anchoHabCol + 2;
  drawHabitoCheckConLabel(xAlcohol, xLabelAlcohol, yCheckHab, labelsHabitos[0], datosFinales.habitos?.alcohol?.nada);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xAlcohol, xLabelAlcohol, yCheckHab, labelsHabitos[1], datosFinales.habitos?.alcohol?.poco);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xAlcohol, xLabelAlcohol, yCheckHab, labelsHabitos[2], datosFinales.habitos?.alcohol?.habitual);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xAlcohol, xLabelAlcohol, yCheckHab, labelsHabitos[3], datosFinales.habitos?.alcohol?.excesivo);

  // Drogas (columna 3)
  yCheckHab = checkboxHabYInicio;
  const xDrogas = tablaInicioX + (anchoHabCol * 3) - checkboxHabSize - 2;
  const xLabelDrogas = tablaInicioX + (anchoHabCol * 2) + 2;
  drawHabitoCheckConLabel(xDrogas, xLabelDrogas, yCheckHab, labelsHabitos[0], datosFinales.habitos?.drogas?.nada);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xDrogas, xLabelDrogas, yCheckHab, labelsHabitos[1], datosFinales.habitos?.drogas?.poco);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xDrogas, xLabelDrogas, yCheckHab, labelsHabitos[2], datosFinales.habitos?.drogas?.habitual);
  yCheckHab += checkboxHabSpacing;
  drawHabitoCheckConLabel(xDrogas, xLabelDrogas, yCheckHab, labelsHabitos[3], datosFinales.habitos?.drogas?.excesivo);

  // === COLUMNA 2: MEDIDAS ANTROPOMÉTRICAS ===
  doc.setFont("helvetica", "bold").setFontSize(7.5); // Reducido ligeramente para evitar cortes
  const textMedidas = "MEDIDAS ANTROPOMÉTRICAS";
  const textWidthMedidas = doc.getTextWidth(textMedidas);
  doc.text(textMedidas, divHabitos + (anchoMedidas / 2) - (textWidthMedidas / 2), yPos + 3.5);

  // Subdivisión: TALLA | PESO (arriba), IMC (abajo completo)
  const alturaSubMedidas = alturaHeaderHabitos;
  doc.line(divHabitos, yPos + alturaSubMedidas, divMedidas, yPos + alturaSubMedidas);
  doc.line(divHabitos + (anchoMedidas / 2), yPos + alturaSubMedidas, divHabitos + (anchoMedidas / 2), yPos + alturaSeccionHabitos);

  // TALLA y PESO - mejor centrados verticalmente
  const espacioContenido = (alturaSeccionHabitos - alturaSubMedidas) / 3;
  const yMedidas = yPos + alturaSubMedidas + espacioContenido;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Talla:", divHabitos + 2, yMedidas);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const tallaTexto = datosFinales.medidasCorporales?.talla ? `${datosFinales.medidasCorporales.talla} m` : "";
  doc.text(tallaTexto, divHabitos + 10, yMedidas);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Peso:", divHabitos + (anchoMedidas / 2) + 2, yMedidas);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const pesoTexto = datosFinales.medidasCorporales?.peso ? `${datosFinales.medidasCorporales.peso} kg` : "";
  doc.text(pesoTexto, divHabitos + (anchoMedidas / 2) + 10, yMedidas);

  // IMC (abajo completo) - mejor centrado
  const yIMC = yMedidas + espacioContenido;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("IMC:", divHabitos + 2, yIMC);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text((datosFinales.medidasCorporales?.imc || "") + " kg/m²", divHabitos + 10, yIMC);

  // === COLUMNA 3: FUNCIÓN RESPIRATORIA (Espirometría) ===
  doc.setFont("helvetica", "bold").setFontSize(7); // Reducido para evitar cortes
  const textFuncion = "FUNCIÓN RESPIRATORIA (Espirometría)";
  const textWidthFuncion = doc.getTextWidth(textFuncion);
  doc.text(textFuncion, divMedidas + (anchoFuncion / 2) - (textWidthFuncion / 2), yPos + 3.5);

  // Subdivisión en 2 columnas
  const anchoFuncionCol = anchoFuncion / 2;

  // Línea horizontal separadora en el medio para dividir el espacio en dos partes iguales
  const espacioDisponibleFuncion = alturaSeccionHabitos - alturaHeaderHabitos;
  const yLineaSeparadora = yPos + alturaHeaderHabitos + (espacioDisponibleFuncion / 2);

  // Espaciado para los campos superiores (arriba de la línea)
  const espacioSuperior = (yLineaSeparadora - (yPos + alturaHeaderHabitos)) / 3;
  const yFuncion = yPos + alturaHeaderHabitos + espacioSuperior;
  const spacingFuncion = espacioSuperior;

  // Línea vertical divisoria solo hasta la línea separadora (no llega hasta abajo)
  doc.line(divMedidas + anchoFuncionCol, yPos + alturaHeaderHabitos, divMedidas + anchoFuncionCol, yLineaSeparadora);

  // Columna izquierda
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("FVC:", divMedidas + 2, yFuncion);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const fvcTexto = datosFinales.funcionRespiratoria?.fvc ? `${datosFinales.funcionRespiratoria.fvc}l` : "";
  doc.text(fvcTexto, divMedidas + 12, yFuncion);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("FEV1:", divMedidas + 2, yFuncion + spacingFuncion);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const fev1Texto = datosFinales.funcionRespiratoria?.fev1 ? `${datosFinales.funcionRespiratoria.fev1}l` : "";
  doc.text(fev1Texto, divMedidas + 12, yFuncion + spacingFuncion);

  // Columna derecha
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("FEV1/FVC:", divMedidas + anchoFuncionCol + 2, yFuncion);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const fev1FvcTexto = datosFinales.funcionRespiratoria?.fev1Fvc ? `${datosFinales.funcionRespiratoria.fev1Fvc}%` : "";
  doc.text(fev1FvcTexto, divMedidas + anchoFuncionCol + 20, yFuncion);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("FEF 25-75%:", divMedidas + anchoFuncionCol + 2, yFuncion + spacingFuncion);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const fef2575Texto = datosFinales.funcionRespiratoria?.fef2575 ? `${datosFinales.funcionRespiratoria.fef2575}l/s` : "";
  doc.text(fef2575Texto, divMedidas + anchoFuncionCol + 20, yFuncion + spacingFuncion);

  // Línea horizontal separadora antes de "Conclusión"
  doc.line(divMedidas, yLineaSeparadora, divMedidas + anchoFuncion, yLineaSeparadora);

  // Conclusión (usa todo el ancho de la columna) - después de la línea separadora
  const yConclusionLabel = yLineaSeparadora + 2.5; // Más espacio después de la línea
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Conclusión:", divMedidas + 2, yConclusionLabel);
  doc.setFont("helvetica", "normal").setFontSize(6.5);
  const textoConclusion = datosFinales.funcionRespiratoria?.conclusion || "";
  if (textoConclusion) {
    const anchoDisponible = anchoFuncion - 4; // Ancho disponible menos márgenes
    const lineasConclusion = doc.splitTextToSize(textoConclusion, anchoDisponible);
    const yTextoInicio = yConclusionLabel + 2.5; // Espacio entre label y texto
    lineasConclusion.forEach((linea, index) => {
      const yLineaTexto = yTextoInicio + (index * 2.5);
      if (yLineaTexto + 2.5 <= yPos + alturaSeccionHabitos - 1) {
        doc.text(linea, divMedidas + 2, yLineaTexto);
      }
    });
  }

  // === COLUMNA 4: MEDIDAS ADICIONALES ===
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textMedidasAdic = "TEMPERATURA";
  const textWidthMedidasAdic = doc.getTextWidth(textMedidasAdic);
  doc.text(textMedidasAdic, divFuncion + (anchoMedidasAdic / 2) - (textWidthMedidasAdic / 2), yPos + 3.5);

  // Línea divisoria horizontal para separar TEMPERATURA del resto
  const alturaSubMedidasAdic = alturaHeaderHabitos + 5;
  doc.line(divFuncion, yPos + alturaSubMedidasAdic, divFuncion + anchoMedidasAdic, yPos + alturaSubMedidasAdic);

  // TEMPERATURA (solo el valor, el label ya está en el header) - centrado
  const espacioTemp = (alturaSubMedidasAdic - alturaHeaderHabitos) / 2;
  const yMedidasAdic = yPos + alturaHeaderHabitos + espacioTemp + 0.5; // Bajado 0.5 mm
  doc.setFont("helvetica", "normal").setFontSize(7);
  const temperaturaTexto = datosFinales.temperatura ? `${datosFinales.temperatura} °C` : "";
  const centroMedidasAdic = divFuncion + (anchoMedidasAdic / 2);
  doc.text(temperaturaTexto, centroMedidasAdic, yMedidasAdic, { align: "center" });

  // Cintura, Cadera, ICC (después de la línea divisoria) - mejor centrados verticalmente
  const espacioRestante = alturaSeccionHabitos - alturaSubMedidasAdic;
  const espacioEntreItems = espacioRestante / 4;
  const yDespuesLinea = yPos + alturaSubMedidasAdic + espacioEntreItems;
  const spacingMedidasAdic = espacioEntreItems;

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Cintura:", divFuncion + 2, yDespuesLinea);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const cinturaTexto = datosFinales.medidasCorporales?.cintura ? `${datosFinales.medidasCorporales.cintura} cm` : "";
  doc.text(cinturaTexto, divFuncion + 15, yDespuesLinea);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Cadera:", divFuncion + 2, yDespuesLinea + spacingMedidasAdic);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const caderaTexto = datosFinales.medidasCorporales?.cadera ? `${datosFinales.medidasCorporales.cadera} cm` : "";
  doc.text(caderaTexto, divFuncion + 15, yDespuesLinea + spacingMedidasAdic);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ICC:", divFuncion + 2, yDespuesLinea + (spacingMedidasAdic * 2));
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.medidasCorporales?.icc || "", divFuncion + 15, yDespuesLinea + (spacingMedidasAdic * 2));

  yPos += alturaSeccionHabitos;

  // === SECCIÓN: EXAMEN FÍSICO CABEZA Y CUELLO ===

  // Verificar si necesitamos nueva página
  const espacioNecesarioExamen = 25;
  if (yPos + espacioNecesarioExamen > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Estructura: 2 columnas iguales
  const anchoColExamen = tablaAncho / 2;
  const divColExamen = tablaInicioX + anchoColExamen;
  const alturaFilaExamen = 5;

  // Líneas horizontales para filas 1 y 2 (las verticales y la última horizontal se dibujarán después)
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaExamen, tablaInicioX + tablaAncho, yPos + alturaFilaExamen);
  doc.line(tablaInicioX, yPos + (alturaFilaExamen * 2), tablaInicioX + tablaAncho, yPos + (alturaFilaExamen * 2));

  // COLUMNA IZQUIERDA - Fila 1: CABEZA
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("CABEZA:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenFisicoCabezaCuello?.cabeza || "", tablaInicioX + 20, yPos + 3.5);

  // COLUMNA DERECHA - Fila 1: CUELLO
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("CUELLO:", divColExamen + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenFisicoCabezaCuello?.cuello || "", divColExamen + 20, yPos + 3.5);

  // COLUMNA IZQUIERDA - Fila 2: PERIMETRO CUELLO
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("PERIMETRO CUELLO:", tablaInicioX + 2, yPos + alturaFilaExamen + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const perimetroCuelloTexto = datosFinales.examenFisicoCabezaCuello?.perimetroCuello ? `${datosFinales.examenFisicoCabezaCuello.perimetroCuello} cm` : "";
  doc.text(perimetroCuelloTexto, tablaInicioX + 40, yPos + alturaFilaExamen + 3.5);

  // COLUMNA DERECHA - Fila 2: NARÍZ
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("NARÍZ:", divColExamen + 2, yPos + alturaFilaExamen + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenFisicoCabezaCuello?.nariz || "", divColExamen + 20, yPos + alturaFilaExamen + 3.5);

  // COLUMNA IZQUIERDA - Fila 3: BOCA, AMIGDALAS, FARINGE, LARINGE (fila creciente)
  const yFila3 = yPos + (alturaFilaExamen * 2);

  // Fila header con label
  const alturaFilaHeaderBoca = 5;
  doc.line(tablaInicioX, yFila3, tablaInicioX, yFila3 + alturaFilaHeaderBoca);
  doc.line(divColExamen, yFila3, divColExamen, yFila3 + alturaFilaHeaderBoca);
  doc.line(tablaInicioX, yFila3, divColExamen, yFila3);
  doc.line(tablaInicioX, yFila3 + alturaFilaHeaderBoca, divColExamen, yFila3 + alturaFilaHeaderBoca);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("BOCA, AMIGDALAS, FARINGE, LARINGE:", tablaInicioX + 2, yFila3 + 3.5);

  const yFila3Data = yFila3 + alturaFilaHeaderBoca;

  // Fila creciente con data
  const alturaFilaCrecienteBoca = 8; // Altura mínima
  const textoBoca = datosFinales.examenFisicoCabezaCuello?.bocaAmigdalasFaringeLaringe || "";
  const anchoDisponibleBoca = anchoColExamen - 4;
  const lineasBoca = doc.splitTextToSize(textoBoca, anchoDisponibleBoca);
  const interlineadoBoca = 2.5;
  const alturaDinamicaBoca = Math.max(alturaFilaCrecienteBoca, lineasBoca.length * interlineadoBoca + 4);

  // Dibujar líneas de la fila creciente (solo columna izquierda)
  doc.line(tablaInicioX, yFila3Data, tablaInicioX, yFila3Data + alturaDinamicaBoca);
  doc.line(divColExamen, yFila3Data, divColExamen, yFila3Data + alturaDinamicaBoca);
  doc.line(tablaInicioX, yFila3Data, divColExamen, yFila3Data);
  doc.line(tablaInicioX, yFila3Data + alturaDinamicaBoca, divColExamen, yFila3Data + alturaDinamicaBoca);

  // Contenido de la fila creciente
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasBoca.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yFila3Data + 3.5 + (index * interlineadoBoca));
  });

  // Ajustar altura total de la fila 3 (fila creciente)
  const alturaTotalFila3 = alturaFilaHeaderBoca + alturaDinamicaBoca;

  // COLUMNA DERECHA - Fila 3: DENTADURA
  // Ajustar altura de la columna derecha para que coincida con la izquierda
  const alturaColumnaDerecha = alturaTotalFila3;

  // Dibujar líneas de la columna derecha
  doc.line(divColExamen, yFila3, divColExamen, yFila3 + alturaColumnaDerecha);
  doc.line(tablaInicioX + tablaAncho, yFila3, tablaInicioX + tablaAncho, yFila3 + alturaColumnaDerecha);
  doc.line(divColExamen, yFila3, tablaInicioX + tablaAncho, yFila3);
  doc.line(divColExamen, yFila3 + alturaColumnaDerecha, tablaInicioX + tablaAncho, yFila3 + alturaColumnaDerecha);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DENTADURA:", divColExamen + 2, yFila3 + 3.5);

  // Subcampos de dentadura - separados del label con más espacio
  const yDentaduraData = yFila3 + 7; // Separación del label (de 5.5 a 7)
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Piezas en mal estado:", divColExamen + 2, yDentaduraData);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const piezasMalEstado = datosFinales.examenFisicoCabezaCuello?.dentadura?.piezasEnMalEstado || "";
  doc.text(piezasMalEstado, divColExamen + 45, yDentaduraData);

  const yDentaduraData2 = yDentaduraData + 4; // Interlineado aumentado (de 2 a 4)
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Piezas que faltan:", divColExamen + 2, yDentaduraData2);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const piezasQueFaltan = datosFinales.examenFisicoCabezaCuello?.dentadura?.piezasQueFaltan || "";
  doc.text(piezasQueFaltan, divColExamen + 45, yDentaduraData2);

  // Ajustar altura total de la sección
  const alturaSeccionExamenAjustada = (alturaFilaExamen * 2) + alturaTotalFila3;

  // Redibujar líneas verticales de toda la sección con la altura correcta
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionExamenAjustada);
  doc.line(divColExamen, yPos, divColExamen, yPos + alturaSeccionExamenAjustada);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionExamenAjustada);
  doc.line(tablaInicioX, yPos + alturaSeccionExamenAjustada, tablaInicioX + tablaAncho, yPos + alturaSeccionExamenAjustada);

  yPos += alturaSeccionExamenAjustada;

  // === SECCIÓN: EXAMEN DE OJOS ===

  // Verificar si necesitamos nueva página
  const espacioNecesarioOjos = 35;
  if (yPos + espacioNecesarioOjos > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Dividir en dos columnas: izquierda (tabla de visión) y derecha (enfermedades/reflejos)
  const anchoColumnaIzquierda = tablaAncho / 2;
  const anchoColumnaDerecha = tablaAncho / 2;
  const xColumnaIzquierda = tablaInicioX;
  const xColumnaDerecha = tablaInicioX + anchoColumnaIzquierda;

  // === COLUMNA IZQUIERDA: Tabla de visión (SIN CORREGIR / CORREGIDA) ===
  const alturaHeaderPrincipal = 4; // Altura para SIN CORREGIR / CORREGIDA
  const alturaSubHeader = 4; // Altura para OJOS / O.D / O.I
  const alturaFilaVision = 5; // Aumentado para que el texto quepa mejor
  const anchoColOjos = 25; // Ancho aumentado para la columna "OJOS"
  const anchoColVision = (anchoColumnaIzquierda - anchoColOjos) / 2; // Mitad para cada sección de visión
  const anchoSubColOjos = anchoColVision / 2; // O.D y O.I

  const xOjos = xColumnaIzquierda;
  const xSinCorregir = xOjos + anchoColOjos;
  const xCorregida = xSinCorregir + anchoColVision;
  const alturaSeccionVision = alturaHeaderPrincipal + alturaSubHeader + (alturaFilaVision * 2); // Headers + 2 filas

  // Líneas verticales principales (solo hasta la mitad)
  doc.line(xOjos, yPos, xOjos, yPos + alturaSeccionVision);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + alturaSeccionVision);
  // Línea divisoria entre SIN CORREGIR y CORREGIDA (desde la primera fila)
  doc.line(xCorregida, yPos, xCorregida, yPos + alturaSeccionVision);
  doc.line(xColumnaDerecha, yPos, xColumnaDerecha, yPos + alturaSeccionVision); // Línea divisoria entre columnas (solo hasta la mitad)

  // Líneas horizontales completas (arriba y abajo de toda la sección)
  doc.line(xColumnaIzquierda, yPos, tablaInicioX + tablaAncho, yPos);
  // Línea divisoria entre header principal y subheaders (solo hasta la mitad izquierda)
  doc.line(xColumnaIzquierda, yPos + alturaHeaderPrincipal, xColumnaDerecha, yPos + alturaHeaderPrincipal);
  // Línea divisoria entre subheaders y filas de datos (solo hasta la mitad izquierda)
  doc.line(xColumnaIzquierda, yPos + alturaHeaderPrincipal + alturaSubHeader, xColumnaDerecha, yPos + alturaHeaderPrincipal + alturaSubHeader);
  doc.line(xColumnaIzquierda, yPos + alturaHeaderPrincipal + alturaSubHeader + alturaFilaVision, xColumnaDerecha, yPos + alturaHeaderPrincipal + alturaSubHeader + alturaFilaVision); // Solo en columna izquierda
  doc.line(xColumnaIzquierda, yPos + alturaSeccionVision, tablaInicioX + tablaAncho, yPos + alturaSeccionVision);

  // Líneas verticales para subcolumnas O.D y O.I (solo desde la segunda fila, no en la primera fila)
  doc.line(xSinCorregir + anchoSubColOjos, yPos + alturaHeaderPrincipal, xSinCorregir + anchoSubColOjos, yPos + alturaSeccionVision);
  doc.line(xCorregida + anchoSubColOjos, yPos + alturaHeaderPrincipal, xCorregida + anchoSubColOjos, yPos + alturaSeccionVision);

  // Headers superiores (SIN CORREGIR y CORREGIDA) - cada uno centrado en su propia sección
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("SIN CORREGIR", xSinCorregir + (anchoColVision / 2) - (doc.getTextWidth("SIN CORREGIR") / 2), yPos + 3);
  doc.text("CORREGIDA", xCorregida + (anchoColVision / 2) - (doc.getTextWidth("CORREGIDA") / 2), yPos + 3);

  // Subheaders: OJOS, O.D y O.I (en la segunda fila del header)
  const ySubHeader = yPos + alturaHeaderPrincipal;
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textOjos = "OJOS";
  doc.text(textOjos, xOjos + (anchoColOjos / 2) - (doc.getTextWidth(textOjos) / 2), ySubHeader + 3);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("O.D", xSinCorregir + (anchoSubColOjos / 2) - (doc.getTextWidth("O.D") / 2), ySubHeader + 3);
  doc.text("O.I", xSinCorregir + anchoSubColOjos + (anchoSubColOjos / 2) - (doc.getTextWidth("O.I") / 2), ySubHeader + 3);
  doc.text("O.D", xCorregida + (anchoSubColOjos / 2) - (doc.getTextWidth("O.D") / 2), ySubHeader + 3);
  doc.text("O.I", xCorregida + anchoSubColOjos + (anchoSubColOjos / 2) - (doc.getTextWidth("O.I") / 2), ySubHeader + 3);

  // Fila: Visión de Cerca (centrada verticalmente en la fila)
  const yVisionCerca = yPos + alturaHeaderPrincipal + alturaSubHeader;
  const yCentroVisionCerca = yVisionCerca + (alturaFilaVision / 2);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Visión de Cerca", xOjos + 2, yCentroVisionCerca + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenOjos?.visionCerca?.sinCorregirOD || "", xSinCorregir + (anchoSubColOjos / 2) - (doc.getTextWidth(datosFinales.examenOjos?.visionCerca?.sinCorregirOD || "") / 2), yCentroVisionCerca + 1);
  doc.text(datosFinales.examenOjos?.visionCerca?.sinCorregirOI || "", xSinCorregir + anchoSubColOjos + (anchoSubColOjos / 2) - (doc.getTextWidth(datosFinales.examenOjos?.visionCerca?.sinCorregirOI || "") / 2), yCentroVisionCerca + 1);
  doc.text(datosFinales.examenOjos?.visionCerca?.corregidaOD || "", xCorregida + (anchoSubColOjos / 2) - (doc.getTextWidth(datosFinales.examenOjos?.visionCerca?.corregidaOD || "") / 2), yCentroVisionCerca + 1);
  doc.text(datosFinales.examenOjos?.visionCerca?.corregidaOI || "", xCorregida + anchoSubColOjos + (anchoSubColOjos / 2) - (doc.getTextWidth(datosFinales.examenOjos?.visionCerca?.corregidaOI || "") / 2), yCentroVisionCerca + 1);

  // Fila: Visión de Lejos (centrada verticalmente en la fila)
  const yVisionLejos = yVisionCerca + alturaFilaVision;
  const yCentroVisionLejos = yVisionLejos + (alturaFilaVision / 2);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Visión de Lejos", xOjos + 2, yCentroVisionLejos + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenOjos?.visionLejos?.sinCorregirOD || "", xSinCorregir + (anchoSubColOjos / 2) - (doc.getTextWidth(datosFinales.examenOjos?.visionLejos?.sinCorregirOD || "") / 2), yCentroVisionLejos + 1);
  doc.text(datosFinales.examenOjos?.visionLejos?.sinCorregirOI || "", xSinCorregir + anchoSubColOjos + (anchoSubColOjos / 2) - (doc.getTextWidth(datosFinales.examenOjos?.visionLejos?.sinCorregirOI || "") / 2), yCentroVisionLejos + 1);
  doc.text(datosFinales.examenOjos?.visionLejos?.corregidaOD || "", xCorregida + (anchoSubColOjos / 2) - (doc.getTextWidth(datosFinales.examenOjos?.visionLejos?.corregidaOD || "") / 2), yCentroVisionLejos + 1);
  doc.text(datosFinales.examenOjos?.visionLejos?.corregidaOI || "", xCorregida + anchoSubColOjos + (anchoSubColOjos / 2) - (doc.getTextWidth(datosFinales.examenOjos?.visionLejos?.corregidaOI || "") / 2), yCentroVisionLejos + 1);

  // === COLUMNA DERECHA: ENFERMEDADES OCULARES y REFLEJOS PUPILARES ===
  const alturaSeccionEnfermedades = alturaSeccionVision; // Misma altura que la tabla de visión

  // Líneas verticales para columna derecha (ya están dibujadas arriba, solo el borde derecho)
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionEnfermedades);

  // Línea horizontal divisoria entre ENFERMEDADES y REFLEJOS
  const alturaDivisoria = alturaSeccionEnfermedades - 5; // 5mm para reflejos
  doc.line(xColumnaDerecha, yPos + alturaDivisoria, tablaInicioX + tablaAncho, yPos + alturaDivisoria);

  // ENFERMEDADES OCULARES (parte superior derecha)
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ENFERMEDADES OCULARES:", xColumnaDerecha + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);

  // Obtener la variable directamente de data
  const enfermedades = String(data.enfermedadesOcularesAnexo7c_txtenfermedadesoculares || "").trim();

  // Función para dividir texto por \n y crear items con guión
  const dividirEnItems = (texto) => {
    if (!texto || texto.length === 0) return [];
    // Dividir por \n y limpiar cada línea
    return texto.split('\n')
      .map(linea => linea.trim())
      .filter(linea => linea.length > 0);
  };

  const items = dividirEnItems(enfermedades);

  const anchoDisponible = anchoColumnaDerecha - 6; // Menos espacio para el guión
  const yTextoInicio = yPos + 6.5; // Más espacio después del título
  let yActual = yTextoInicio;
  const interlineado = 3;
  const anchoGuion = doc.getTextWidth("- ");

  // Mostrar todos los items con guión
  if (items.length > 0) {
    items.forEach((item) => {
      // Dibujar el guión
      doc.text("- ", xColumnaDerecha + 2, yActual);

      // Dividir el texto del item en líneas si es necesario
      const lineas = doc.splitTextToSize(item, anchoDisponible);

      // Dibujar la primera línea del item (después del guión)
      if (lineas.length > 0) {
        doc.text(lineas[0], xColumnaDerecha + 2 + anchoGuion, yActual);
        yActual += interlineado;

        // Dibujar las líneas siguientes del mismo item (sin guión, indentadas)
        for (let i = 1; i < lineas.length; i++) {
          if (yActual + interlineado <= yPos + alturaDivisoria - 1) {
            doc.text(lineas[i], xColumnaDerecha + 2 + anchoGuion, yActual);
            yActual += interlineado;
          }
        }
      }
    });
  } else {
    // Si no hay items, mostrar "NINGUNA"
    doc.text("NINGUNA", xColumnaDerecha + 2, yActual);
  }

  // REFLEJOS PUPILARES (parte inferior derecha)
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Reflejos Pupilares :", xColumnaDerecha + 2, yPos + alturaDivisoria + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenOjos?.reflejosPupilares || "", xColumnaDerecha + 35, yPos + alturaDivisoria + 3.5);

  // Actualizar yPos con la altura máxima de ambas columnas
  yPos += Math.max(alturaSeccionVision, alturaSeccionEnfermedades);

  // Parte 3: Visión de Colores
  const alturaSeccionColores = 5;

  // Verificar si necesitamos nueva página
  if (yPos + alturaSeccionColores > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  const anchoColColores = tablaAncho / 4; // 4 columnas: Label + 3 tests
  const xColores = tablaInicioX;
  const xIshihara = xColores + anchoColColores;
  const xColoresPuros = xIshihara + anchoColColores;
  const xProfundidad = xColoresPuros + anchoColColores;

  // Líneas verticales
  doc.line(xColores, yPos, xColores, yPos + alturaSeccionColores);
  doc.line(xIshihara, yPos, xIshihara, yPos + alturaSeccionColores);
  doc.line(xColoresPuros, yPos, xColoresPuros, yPos + alturaSeccionColores);
  doc.line(xProfundidad, yPos, xProfundidad, yPos + alturaSeccionColores);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionColores);

  // Líneas horizontales
  doc.line(xColores, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(xColores, yPos + alturaSeccionColores, tablaInicioX + tablaAncho, yPos + alturaSeccionColores);

  // Label "Visión de Colores"
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textColores = "Visión de Colores";
  doc.text(textColores, xColores + (anchoColColores / 2) - (doc.getTextWidth(textColores) / 2), yPos + 3.5);

  // Test de Ishihara
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Test de Ishihara:", xIshihara + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenOjos?.testIshihara || "", xIshihara + 30, yPos + 3.5);

  // Test de colores puros
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Test de colores puros:", xColoresPuros + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenOjos?.testColoresPuros || "", xColoresPuros + 30, yPos + 3.5);

  // Test de Profundidad
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Test de Profundidad:", xProfundidad + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.examenOjos?.testProfundidad || "", xProfundidad + 30, yPos + 3.5);

  yPos += alturaSeccionColores;

  // === SECCIÓN: OÍDOS ===

  // Definir frecuencias
  const frecuencias = [500, 1000, 2000, 3000, 4000, 6000, 8000];

  // Verificar si necesitamos nueva página
  const alturaFilaOidos = 5;
  const alturaTotalOidos = alturaFilaOidos * 3; // 1 fila header + 2 filas (Hz y dB(A))
  const espacioNecesarioOidos = alturaTotalOidos;
  if (yPos + espacioNecesarioOidos > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Estructura: 2 columnas iguales (Oído derecho e izquierdo)
  const anchoColOidos = tablaAncho / 2;
  const divColOidos = tablaInicioX + anchoColOidos;

  // Ancho de la primera celda (Hz o dB(A)) y ancho de cada celda de frecuencia
  const anchoLabelCol = 20; // Ancho para la celda "Hz" o "dB(A)"
  const anchoColFrecuencia = (anchoColOidos - anchoLabelCol) / frecuencias.length;

  // Líneas verticales principales (extendidas para toda la altura)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotalOidos);
  doc.line(divColOidos, yPos, divColOidos, yPos + alturaTotalOidos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotalOidos);

  // FILA 1: Header con OÍDOS
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaOidos, tablaInicioX + tablaAncho, yPos + alturaFilaOidos);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("OÍDOS", tablaInicioX + 2, yPos + 3.5);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Audición derecho", tablaInicioX + 15, yPos + 3.5);
  doc.text("Audición izquierdo", divColOidos + 2, yPos + 3.5);

  let currentY = yPos + alturaFilaOidos;

  // FILA 2: Hz | 500 | 1000 | 2000 | 3000 | 4000 | 6000 | 8000
  // Dibujar líneas verticales para subdividir cada columna
  // Línea vertical para separar label de frecuencias (columna izquierda)
  doc.line(tablaInicioX + anchoLabelCol, currentY, tablaInicioX + anchoLabelCol, currentY + alturaFilaOidos);
  // Líneas verticales para frecuencias (columna izquierda)
  for (let i = 1; i < frecuencias.length; i++) {
    const xIzq = tablaInicioX + anchoLabelCol + (i * anchoColFrecuencia);
    doc.line(xIzq, currentY, xIzq, currentY + alturaFilaOidos);
  }

  // Línea vertical para separar label de frecuencias (columna derecha)
  doc.line(divColOidos + anchoLabelCol, currentY, divColOidos + anchoLabelCol, currentY + alturaFilaOidos);
  // Líneas verticales para frecuencias (columna derecha)
  for (let i = 1; i < frecuencias.length; i++) {
    const xDer = divColOidos + anchoLabelCol + (i * anchoColFrecuencia);
    doc.line(xDer, currentY, xDer, currentY + alturaFilaOidos);
  }

  doc.line(tablaInicioX, currentY + alturaFilaOidos, tablaInicioX + tablaAncho, currentY + alturaFilaOidos);

  // Escribir "Hz" y frecuencias en cada columna
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Hz", tablaInicioX + 2, currentY + 3.5); // Columna izquierda
  frecuencias.forEach((freq, index) => {
    const xIzq = tablaInicioX + anchoLabelCol + (index * anchoColFrecuencia) + (anchoColFrecuencia / 2);
    doc.text(String(freq), xIzq, currentY + 3.5, { align: "center" });
  });

  doc.text("Hz", divColOidos + 2, currentY + 3.5); // Columna derecha
  frecuencias.forEach((freq, index) => {
    const xDer = divColOidos + anchoLabelCol + (index * anchoColFrecuencia) + (anchoColFrecuencia / 2);
    doc.text(String(freq), xDer, currentY + 3.5, { align: "center" });
  });

  currentY += alturaFilaOidos;

  // FILA 3: dB(A) | valores | valores | ...
  // Línea vertical para separar label de valores (columna izquierda)
  doc.line(tablaInicioX + anchoLabelCol, currentY, tablaInicioX + anchoLabelCol, currentY + alturaFilaOidos);
  // Líneas verticales para valores (columna izquierda)
  for (let i = 1; i < frecuencias.length; i++) {
    const xIzq = tablaInicioX + anchoLabelCol + (i * anchoColFrecuencia);
    doc.line(xIzq, currentY, xIzq, currentY + alturaFilaOidos);
  }

  // Línea vertical para separar label de valores (columna derecha)
  doc.line(divColOidos + anchoLabelCol, currentY, divColOidos + anchoLabelCol, currentY + alturaFilaOidos);
  // Líneas verticales para valores (columna derecha)
  for (let i = 1; i < frecuencias.length; i++) {
    const xDer = divColOidos + anchoLabelCol + (i * anchoColFrecuencia);
    doc.line(xDer, currentY, xDer, currentY + alturaFilaOidos);
  }

  doc.line(tablaInicioX, currentY + alturaFilaOidos, tablaInicioX + tablaAncho, currentY + alturaFilaOidos);

  // Escribir "dB(A)" y valores en cada columna
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("dB(A)", tablaInicioX + 2, currentY + 3.5); // Columna izquierda

  // Valores oído derecho
  const valoresDerecho = [
    datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia500 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia1000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia2000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia3000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia4000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia6000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoDerecho?.frecuencia8000 || ""
  ];

  valoresDerecho.forEach((valor, index) => {
    const xIzq = tablaInicioX + anchoLabelCol + (index * anchoColFrecuencia) + (anchoColFrecuencia / 2);
    if (valor) {
      doc.text(String(valor), xIzq, currentY + 3.5, { align: "center" });
    }
  });

  doc.text("dB(A)", divColOidos + 2, currentY + 3.5); // Columna derecha

  // Valores oído izquierdo
  const valoresIzquierdo = [
    datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia500 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia1000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia2000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia3000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia4000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia6000 || "",
    datosFinales.evaluacionOidos?.audiometria?.oidoIzquierdo?.frecuencia8000 || ""
  ];

  valoresIzquierdo.forEach((valor, index) => {
    const xDer = divColOidos + anchoLabelCol + (index * anchoColFrecuencia) + (anchoColFrecuencia / 2);
    if (valor) {
      doc.text(String(valor), xDer, currentY + 3.5, { align: "center" });
    }
  });

  // Actualizar yPos al final de la sección
  yPos = currentY + alturaFilaOidos;

  // === SECCIÓN: OTOSCOPÍA, CARDIOVASCULAR, SIGNOS VITALES Y PRESIÓN ARTERIAL ===

  // Verificar si necesitamos nueva página
  const alturaSeccionVitales = 18; // Altura reducida para toda la sección
  if (yPos + alturaSeccionVitales > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Estructura: 3 columnas
  // Columna 1: OTOSCOPÍA y CARDIOVASCULAR (40%)
  // Columna 2: Signos vitales (F.Respiratoria, F.Cardiaca, Sat.02) (30%)
  // Columna 3: PRESIÓN ARTERIAL SISTEMÁTICA (30%)
  const anchoColVitales1 = tablaAncho * 0.40;
  const anchoColVitales2 = tablaAncho * 0.30;
  const anchoColVitales3 = tablaAncho * 0.30;
  const divColVitales1 = tablaInicioX + anchoColVitales1;
  const divColVitales2 = divColVitales1 + anchoColVitales2;

  // Las líneas verticales y horizontales se dibujarán después de calcular la altura ajustada

  // === COLUMNA 1: OTOSCOPÍA y CARDIOVASCULAR ===
  // La altura de OTOSCOPÍA será dinámica, y CARDIOVASCULAR será creciente

  // OTOSCOPÍA - Header
  const alturaFilaHeaderOtoscopia = 5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("OTOSCOPÍA", tablaInicioX + 2, yPos + 3.5);

  // OTOSCOPÍA - Data con altura dinámica
  const yOtoscopiaData = yPos + alturaFilaHeaderOtoscopia;
  doc.setFont("helvetica", "normal").setFontSize(7);
  const odValue = (datosFinales.evaluacionOidos?.otoscopia?.oidoDerecho || "").toUpperCase();
  const oiValue = (datosFinales.evaluacionOidos?.otoscopia?.oidoIzquierdo || "").toUpperCase();
  const textoOtoscopia = `O.D.: ${odValue}  |  O.I.: ${oiValue}`;

  // Calcular altura dinámica para otoscopía
  const alturaFilaCrecienteOtoscopia = 8; // Altura mínima
  const anchoDisponibleOtoscopia = anchoColVitales1 - 4;
  const lineasOtoscopia = doc.splitTextToSize(textoOtoscopia, anchoDisponibleOtoscopia);
  const interlineadoOtoscopia = 2.5;
  const alturaDinamicaOtoscopia = Math.max(alturaFilaCrecienteOtoscopia, lineasOtoscopia.length * interlineadoOtoscopia + 4);

  // Dibujar líneas de la fila de otoscopía (solo columna izquierda)
  doc.line(tablaInicioX, yOtoscopiaData, tablaInicioX, yOtoscopiaData + alturaDinamicaOtoscopia);
  doc.line(divColVitales1, yOtoscopiaData, divColVitales1, yOtoscopiaData + alturaDinamicaOtoscopia);
  doc.line(tablaInicioX, yOtoscopiaData, divColVitales1, yOtoscopiaData);
  doc.line(tablaInicioX, yOtoscopiaData + alturaDinamicaOtoscopia, divColVitales1, yOtoscopiaData + alturaDinamicaOtoscopia);

  // Contenido de la fila de otoscopía con saltos de línea
  lineasOtoscopia.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yOtoscopiaData + 3.5 + (index * interlineadoOtoscopia));
  });

  // Calcular altura total de otoscopía
  const alturaOtoscopia = alturaFilaHeaderOtoscopia + alturaDinamicaOtoscopia;

  // CARDIOVASCULAR - Fila creciente separada
  const yCardioHeader = yPos + alturaOtoscopia;

  // Fila header con label "CARDIOVASCULAR :"
  const alturaFilaHeaderCardio = 5;
  doc.line(tablaInicioX, yCardioHeader, tablaInicioX, yCardioHeader + alturaFilaHeaderCardio);
  doc.line(divColVitales1, yCardioHeader, divColVitales1, yCardioHeader + alturaFilaHeaderCardio);
  doc.line(tablaInicioX, yCardioHeader, divColVitales1, yCardioHeader);
  // NO dibujar línea horizontal después del label

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("CARDIOVASCULAR :", tablaInicioX + 2, yCardioHeader + 3.5);

  const yCardioData = yCardioHeader + alturaFilaHeaderCardio;

  // Fila creciente con data - Usar SOLO data.corazonAnexo7c_txtcorazon
  const alturaFilaCrecienteCardio = 8; // Altura mínima
  const textoCardiovascular = String(data.corazonAnexo7c_txtcorazon || "").trim();
  const anchoDisponibleCardio = anchoColVitales1 - 4;
  const lineasCardio = doc.splitTextToSize(textoCardiovascular, anchoDisponibleCardio);
  const interlineadoCardio = 2.5;
  const alturaDinamicaCardio = Math.max(alturaFilaCrecienteCardio, lineasCardio.length * interlineadoCardio + 4);

  // Dibujar líneas de la fila creciente (solo columna izquierda)
  doc.line(tablaInicioX, yCardioData, tablaInicioX, yCardioData + alturaDinamicaCardio);
  doc.line(divColVitales1, yCardioData, divColVitales1, yCardioData + alturaDinamicaCardio);
  doc.line(tablaInicioX, yCardioData, divColVitales1, yCardioData);
  doc.line(tablaInicioX, yCardioData + alturaDinamicaCardio, divColVitales1, yCardioData + alturaDinamicaCardio);

  // Contenido de la fila creciente
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasCardio.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yCardioData + 3.5 + (index * interlineadoCardio));
  });

  // Ajustar altura de la sección CARDIOVASCULAR
  const alturaTotalCardio = alturaFilaHeaderCardio + alturaDinamicaCardio;
  const alturaSeccionCardioAjustada = alturaOtoscopia + alturaTotalCardio;

  // Ajustar altura total de la sección de vitales
  const alturaSeccionVitalesAjustada = Math.max(alturaSeccionVitales, alturaSeccionCardioAjustada);

  // Redibujar línea divisoria entre OTOSCOPÍA y CARDIOVASCULAR
  doc.line(tablaInicioX, yPos + alturaOtoscopia, divColVitales1, yPos + alturaOtoscopia);

  // Redibujar líneas verticales de la columna 1 con la altura ajustada
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionVitalesAjustada);
  doc.line(divColVitales1, yPos, divColVitales1, yPos + alturaSeccionVitalesAjustada);

  // Redibujar línea inferior de la columna 1
  doc.line(tablaInicioX, yPos + alturaSeccionVitalesAjustada, divColVitales1, yPos + alturaSeccionVitalesAjustada);

  // Redibujar líneas verticales principales con la altura ajustada
  doc.line(divColVitales2, yPos, divColVitales2, yPos + alturaSeccionVitalesAjustada);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionVitalesAjustada);

  // Redibujar líneas horizontales principales
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaSeccionVitalesAjustada, tablaInicioX + tablaAncho, yPos + alturaSeccionVitalesAjustada);

  // === COLUMNA 2: SIGNOS VITALES ===
  const alturaItemVital = alturaSeccionVitales / 3; // Dividir en 3 partes iguales

  // F.Respiratoria
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("F.RESPIRATORIA :", divColVitales1 + 2, yPos + alturaItemVital / 2 + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const freqResp = datosFinales.signosVitales?.frecuenciaRespiratoria || "";
  doc.text(freqResp ? `${freqResp} x min.` : "", divColVitales1 + 25, yPos + alturaItemVital / 2 + 1);

  // F.Cardiaca
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("F.CARDIACA :", divColVitales1 + 2, yPos + alturaItemVital + alturaItemVital / 2 + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const freqCard = datosFinales.signosVitales?.frecuenciaCardiaca || "";
  doc.text(freqCard ? `${freqCard} x min` : "", divColVitales1 + 25, yPos + alturaItemVital + alturaItemVital / 2 + 1);

  // Sat.02
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("SAT.02 :", divColVitales1 + 2, yPos + (alturaItemVital * 2) + alturaItemVital / 2 + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const satO2 = datosFinales.signosVitales?.saturacionOxigeno || "";
  doc.text(satO2 ? `${satO2} %` : "", divColVitales1 + 25, yPos + (alturaItemVital * 2) + alturaItemVital / 2 + 1);

  // === COLUMNA 3: PRESIÓN ARTERIAL SISTEMÁTICA ===
  const alturaHeaderPA = 5; // Altura para el header
  const alturaFilaPA = (alturaSeccionVitales - alturaHeaderPA) / 2; // Altura para cada fila (Sistólica y Diastólica)

  // Línea horizontal divisoria para el header
  doc.line(divColVitales2, yPos + alturaHeaderPA, tablaInicioX + tablaAncho, yPos + alturaHeaderPA);

  // Línea horizontal divisoria entre Sistólica y Diastólica
  doc.line(divColVitales2, yPos + alturaHeaderPA + alturaFilaPA, tablaInicioX + tablaAncho, yPos + alturaHeaderPA + alturaFilaPA);

  // Línea vertical divisoria entre label y valor
  const anchoLabelPA = 35;
  const divPA = divColVitales2 + anchoLabelPA;
  doc.line(divPA, yPos + alturaHeaderPA, divPA, yPos + alturaSeccionVitales);

  // Header
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textPA = "PRESIÓN ARTERIAL SISTEMÁTICA";
  const textWidthPA = doc.getTextWidth(textPA);
  doc.text(textPA, divColVitales2 + (anchoColVitales3 / 2) - (textWidthPA / 2), yPos + 3.5);

  // SISTÓLICA
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("SISTÓLICA", divColVitales2 + 2, yPos + alturaHeaderPA + alturaFilaPA / 2 + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const valorSistolica = datosFinales.signosVitales?.presionArterial?.sistolica || "";
  if (valorSistolica) {
    doc.text(`${valorSistolica} mmHg`, divPA + (anchoColVitales3 - anchoLabelPA) / 2, yPos + alturaHeaderPA + alturaFilaPA / 2 + 1, { align: "center" });
  }

  // DIASTÓLICA
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DIASTÓLICA", divColVitales2 + 2, yPos + alturaHeaderPA + alturaFilaPA + alturaFilaPA / 2 + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const valorDiastolica = datosFinales.signosVitales?.presionArterial?.diastolica || "";
  if (valorDiastolica) {
    doc.text(`${valorDiastolica} mmHg`, divPA + (anchoColVitales3 - anchoLabelPA) / 2, yPos + alturaHeaderPA + alturaFilaPA + alturaFilaPA / 2 + 1, { align: "center" });
  }

  yPos += alturaSeccionVitalesAjustada;

  // === SECCIÓN: PULMONES y PIEL ===

  // Verificar si necesitamos nueva página
  const alturaSeccionPulmonesPiel = 12; // Altura para la sección
  if (yPos + alturaSeccionPulmonesPiel > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Estructura: 2 columnas iguales
  const anchoColPulmonesPiel = tablaAncho / 2;
  const divColPulmonesPiel = tablaInicioX + anchoColPulmonesPiel;

  // Las líneas verticales y horizontales se dibujarán después de calcular la altura dinámica

  const alturaFila1 = 5; // Altura para la primera fila (con checkboxes)

  // Línea horizontal divisoria entre fila 1 y fila 2
  doc.line(tablaInicioX, yPos + alturaFila1, tablaInicioX + tablaAncho, yPos + alturaFila1);

  const checkboxSizePulmonesPiel = 3;
  const checkboxYPulmones = yPos + alturaFila1 / 2; // Centrado verticalmente en la primera fila

  // === COLUMNA 1: PULMONES ===
  // Título y checkboxes en la misma línea
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("PULMONES :", tablaInicioX + 2, checkboxYPulmones + 1);

  // Checkbox Normal
  const xCheckNormal = tablaInicioX + 22;
  const yCheckNormal = checkboxYPulmones - checkboxSizePulmonesPiel / 2;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(xCheckNormal, yCheckNormal, checkboxSizePulmonesPiel, checkboxSizePulmonesPiel);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Normal", xCheckNormal + checkboxSizePulmonesPiel + 1, checkboxYPulmones + 1);
  if (datosFinales.evaluacionFisicaAdicional?.pulmones?.normal) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    doc.text("X", xCheckNormal + checkboxSizePulmonesPiel / 2 - textWidthX / 2, yCheckNormal + checkboxSizePulmonesPiel / 2 + 1.2);
  }

  // Checkbox Anormal
  const xCheckAnormal = tablaInicioX + 42;
  const yCheckAnormal = checkboxYPulmones - checkboxSizePulmonesPiel / 2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCheckAnormal, yCheckAnormal, checkboxSizePulmonesPiel, checkboxSizePulmonesPiel);
  doc.text("Anormal", xCheckAnormal + checkboxSizePulmonesPiel + 1, checkboxYPulmones + 1);
  if (datosFinales.evaluacionFisicaAdicional?.pulmones?.anormal) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    doc.text("X", xCheckAnormal + checkboxSizePulmonesPiel / 2 - textWidthX / 2, yCheckAnormal + checkboxSizePulmonesPiel / 2 + 1.2);
  }

  // Descripción de PULMONES - Fila creciente separada (sin línea de división después del label)
  const yDescripcionHeader = yPos + alturaFila1;

  // Fila header con label "Descripción :" (sin línea horizontal después del label)
  const alturaFilaHeaderDescripcion = 5;
  doc.line(tablaInicioX, yDescripcionHeader, tablaInicioX, yDescripcionHeader + alturaFilaHeaderDescripcion);
  doc.line(divColPulmonesPiel, yDescripcionHeader, divColPulmonesPiel, yDescripcionHeader + alturaFilaHeaderDescripcion);
  // NO dibujar línea horizontal después del label (eliminada la línea superior del header)

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Descripción :", tablaInicioX + 2, yDescripcionHeader + 3.5);

  const yDescripcionData = yDescripcionHeader + alturaFilaHeaderDescripcion;

  // Fila creciente con data - Usar SOLO data.pulmonesDescripcionAnexo7c_txtpulmones
  const alturaFilaCrecienteDescripcion = 8; // Altura mínima
  const textoPulmones = String(data.pulmonesDescripcionAnexo7c_txtpulmones || "").trim();
  const anchoDisponibleDescripcion = anchoColPulmonesPiel - 4;
  const lineasPulmones = doc.splitTextToSize(textoPulmones, anchoDisponibleDescripcion);
  const interlineadoDescripcion = 2.5;
  const alturaDinamicaDescripcion = Math.max(alturaFilaCrecienteDescripcion, lineasPulmones.length * interlineadoDescripcion + 4);

  // Dibujar líneas de la fila creciente (solo columna izquierda)
  // NO dibujar líneas horizontales (ni superior ni inferior) - solo líneas verticales
  doc.line(tablaInicioX, yDescripcionData, tablaInicioX, yDescripcionData + alturaDinamicaDescripcion);
  doc.line(divColPulmonesPiel, yDescripcionData, divColPulmonesPiel, yDescripcionData + alturaDinamicaDescripcion);
  // NO dibujar línea horizontal inferior - se dibujará al final de toda la sección

  // Contenido de la fila creciente
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasPulmones.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yDescripcionData + 3.5 + (index * interlineadoDescripcion));
  });

  // Ajustar altura total de la sección PULMONES
  const alturaTotalDescripcion = alturaFilaHeaderDescripcion + alturaDinamicaDescripcion;
  const alturaSeccionPulmonesPielAjustada = alturaFila1 + alturaTotalDescripcion;

  // Las líneas verticales y horizontales se redibujarán después de calcular la altura de PIEL

  // === COLUMNA 2: PIEL ===
  // Título y checkboxes en la misma línea
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("PIEL :", divColPulmonesPiel + 2, checkboxYPulmones + 1);

  // Checkbox Normal
  const xCheckNormalPiel = divColPulmonesPiel + 18;
  const yCheckNormalPiel = checkboxYPulmones - checkboxSizePulmonesPiel / 2;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(xCheckNormalPiel, yCheckNormalPiel, checkboxSizePulmonesPiel, checkboxSizePulmonesPiel);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Normal", xCheckNormalPiel + checkboxSizePulmonesPiel + 1, checkboxYPulmones + 1);
  if (datosFinales.evaluacionFisicaAdicional?.piel?.normal) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    doc.text("X", xCheckNormalPiel + checkboxSizePulmonesPiel / 2 - textWidthX / 2, yCheckNormalPiel + checkboxSizePulmonesPiel / 2 + 1.2);
  }

  // Checkbox Anormal
  const xCheckAnormalPiel = divColPulmonesPiel + 38;
  const yCheckAnormalPiel = checkboxYPulmones - checkboxSizePulmonesPiel / 2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCheckAnormalPiel, yCheckAnormalPiel, checkboxSizePulmonesPiel, checkboxSizePulmonesPiel);
  doc.text("Anormal", xCheckAnormalPiel + checkboxSizePulmonesPiel + 1, checkboxYPulmones + 1);
  if (datosFinales.evaluacionFisicaAdicional?.piel?.anormal) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    doc.text("X", xCheckAnormalPiel + checkboxSizePulmonesPiel / 2 - textWidthX / 2, yCheckAnormalPiel + checkboxSizePulmonesPiel / 2 + 1.2);
  }

  // Descripción de PIEL - Fila creciente separada (sin línea de división después del label)
  const yDescripcionPielHeader = yPos + alturaFila1;

  // Fila header con label "Descripción :" (sin línea horizontal después del label)
  const alturaFilaHeaderDescripcionPiel = 5;
  doc.line(divColPulmonesPiel, yDescripcionPielHeader, divColPulmonesPiel, yDescripcionPielHeader + alturaFilaHeaderDescripcionPiel);
  doc.line(tablaInicioX + tablaAncho, yDescripcionPielHeader, tablaInicioX + tablaAncho, yDescripcionPielHeader + alturaFilaHeaderDescripcionPiel);
  doc.line(divColPulmonesPiel, yDescripcionPielHeader, tablaInicioX + tablaAncho, yDescripcionPielHeader);
  // NO dibujar línea horizontal después del label

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Descripción :", divColPulmonesPiel + 2, yDescripcionPielHeader + 3.5);

  const yDescripcionPielData = yDescripcionPielHeader + alturaFilaHeaderDescripcionPiel;

  // Fila creciente con data - Usar directamente pielDescripcionAnexo7c_piel_descripcion
  const alturaFilaCrecienteDescripcionPiel = 8; // Altura mínima
  const textoPiel = String(data.pielDescripcionAnexo7c_piel_descripcion || datosFinales.evaluacionFisicaAdicional?.piel?.descripcion || "").trim();
  const anchoDisponibleDescripcionPiel = anchoColPulmonesPiel - 4;
  const lineasPiel = doc.splitTextToSize(textoPiel, anchoDisponibleDescripcionPiel);
  const interlineadoDescripcionPiel = 2.5;
  const alturaDinamicaDescripcionPiel = Math.max(alturaFilaCrecienteDescripcionPiel, lineasPiel.length * interlineadoDescripcionPiel + 4);

  // Dibujar líneas de la fila creciente (solo columna derecha)
  // NO dibujar líneas horizontales (ni superior ni inferior) - solo líneas verticales
  doc.line(divColPulmonesPiel, yDescripcionPielData, divColPulmonesPiel, yDescripcionPielData + alturaDinamicaDescripcionPiel);
  doc.line(tablaInicioX + tablaAncho, yDescripcionPielData, tablaInicioX + tablaAncho, yDescripcionPielData + alturaDinamicaDescripcionPiel);
  // NO dibujar línea horizontal inferior - se dibujará al final de toda la sección

  // Contenido de la fila creciente
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasPiel.forEach((linea, index) => {
    doc.text(linea, divColPulmonesPiel + 2, yDescripcionPielData + 3.5 + (index * interlineadoDescripcionPiel));
  });

  // Ajustar altura total de la columna PIEL para que coincida con PULMONES
  const alturaTotalDescripcionPiel = alturaFilaHeaderDescripcionPiel + alturaDinamicaDescripcionPiel;
  const alturaColumnaPiel = alturaFila1 + alturaTotalDescripcionPiel;

  // Asegurar que ambas columnas tengan la misma altura (usar la mayor)
  const alturaFinalSeccion = Math.max(alturaSeccionPulmonesPielAjustada, alturaColumnaPiel);

  // Redibujar líneas de la columna derecha con la altura correcta
  doc.line(divColPulmonesPiel, yPos, divColPulmonesPiel, yPos + alturaFinalSeccion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFinalSeccion);
  doc.line(divColPulmonesPiel, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(divColPulmonesPiel, yPos + alturaFinalSeccion, tablaInicioX + tablaAncho, yPos + alturaFinalSeccion);

  // Actualizar altura de la sección si es necesario
  if (alturaFinalSeccion > alturaSeccionPulmonesPielAjustada) {
    // Redibujar líneas verticales de toda la sección
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFinalSeccion);
    doc.line(divColPulmonesPiel, yPos, divColPulmonesPiel, yPos + alturaFinalSeccion);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFinalSeccion);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFinalSeccion, tablaInicioX + tablaAncho, yPos + alturaFinalSeccion);
  }

  yPos += alturaFinalSeccion;

  // === SECCIÓN: MIEMBROS SUPERIORES E INFERIORES ===

  // Calcular altura dinámica para miembros superiores
  const textoMiembrosSuperiores = String(datosFinales.evaluacionFisicaAdicional?.miembrosSuperiores || "").trim();
  const anchoDisponibleMiembrosSuperiores = tablaAncho - 40 - 4; // Ancho total menos label y márgenes
  const lineasMiembrosSuperiores = doc.splitTextToSize(textoMiembrosSuperiores, anchoDisponibleMiembrosSuperiores);
  const alturaMinimaMiembros = 5;
  const interlineadoMiembros = 2.5;
  const alturaDinamicaMiembrosSuperiores = Math.max(alturaMinimaMiembros, lineasMiembrosSuperiores.length * interlineadoMiembros + 4);

  // Calcular altura dinámica para miembros inferiores
  const textoMiembrosInferiores = String(datosFinales.evaluacionFisicaAdicional?.miembrosInferiores || "").trim();
  const anchoDisponibleMiembrosInferiores = tablaAncho - 40 - 4; // Ancho total menos label y márgenes
  const lineasMiembrosInferiores = doc.splitTextToSize(textoMiembrosInferiores, anchoDisponibleMiembrosInferiores);
  const alturaDinamicaMiembrosInferiores = Math.max(alturaMinimaMiembros, lineasMiembrosInferiores.length * interlineadoMiembros + 4);

  // Verificar si necesitamos nueva página (usando alturas dinámicas)
  const alturaTotalMiembros = alturaDinamicaMiembrosSuperiores + alturaDinamicaMiembrosInferiores;
  if (yPos + alturaTotalMiembros > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // FILA 1: Miembros superiores
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaMiembrosSuperiores);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosSuperiores);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaMiembrosSuperiores, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosSuperiores);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("MIEMBROS SUPERIORES:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasMiembrosSuperiores.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 40, yPos + 3.5 + (index * interlineadoMiembros));
  });

  yPos += alturaDinamicaMiembrosSuperiores;

  // FILA 2: Miembros inferiores
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaMiembrosInferiores);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosInferiores);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaMiembrosInferiores, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosInferiores);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("MIEMBROS INFERIORES:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasMiembrosInferiores.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 40, yPos + 3.5 + (index * interlineadoMiembros));
  });

  yPos += alturaDinamicaMiembrosInferiores;

  // === SECCIÓN: EVALUACIÓN NEUROLÓGICA, COLUMNA Y ABDOMEN ===

  // Verificar si necesitamos nueva página
  const alturaFilaEvaluacion = 5;
  const alturaTotalEvaluacion = alturaFilaEvaluacion * 4; // 4 filas (ABDOMEN y TACTO RECTAL separados)
  if (yPos + alturaTotalEvaluacion > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // FILA 1: Reflejos Osteotendinosos | Marcha (2 columnas)
  const anchoColEvaluacion = tablaAncho / 2;
  const divColEvaluacion = tablaInicioX + anchoColEvaluacion;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaEvaluacion);
  doc.line(divColEvaluacion, yPos, divColEvaluacion, yPos + alturaFilaEvaluacion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaEvaluacion, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacion);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("REFLEJOS OSTEOTENDINOSOS:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.evaluacionNeurologica?.reflejosOsteotendinosos || "", tablaInicioX + 50, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("MARCHA:", divColEvaluacion + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.evaluacionNeurologica?.marcha || "", divColEvaluacion + 20, yPos + 3.5);

  yPos += alturaFilaEvaluacion;

  // FILA 2: Columna vertebral (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaEvaluacion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaEvaluacion, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacion);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("COLUMNA VERTEBRAL:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.evaluacionColumnaAbdomen?.columnaVertebral || "", tablaInicioX + 40, yPos + 3.5);

  yPos += alturaFilaEvaluacion;

  // FILA 3: Abdomen (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaEvaluacion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaEvaluacion, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacion);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ABDOMEN", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.evaluacionColumnaAbdomen?.abdomen || "", tablaInicioX + 25, yPos + 3.5);

  yPos += alturaFilaEvaluacion;

  // FILA 4: Tacto rectal (columna completa con checkboxes)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaEvaluacion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaEvaluacion, tablaInicioX + tablaAncho, yPos + alturaFilaEvaluacion);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("TACTO RECTAL:", tablaInicioX + 2, yPos + 3.5);

  const checkboxSizeTacto = 3;
  const checkboxYTacto = yPos + 1.5;
  const checkboxCenterY = checkboxYTacto + checkboxSizeTacto / 2;
  const xCheckNoHizoTacto = tablaInicioX + 30;
  const xCheckNormalTacto = tablaInicioX + 50;
  const xCheckAnormalTacto = tablaInicioX + 70;

  // Checkbox "No se hizo"
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(xCheckNoHizoTacto, checkboxYTacto, checkboxSizeTacto, checkboxSizeTacto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("No se hizo", xCheckNoHizoTacto + checkboxSizeTacto + 1, checkboxCenterY + 0.8);
  if (datosFinales.evaluacionRectal?.tactoRectal?.noSeHizo) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    doc.text("X", xCheckNoHizoTacto + checkboxSizeTacto / 2 - textWidthX / 2, checkboxCenterY + 1.2);
  }

  // Checkbox "Normal"
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCheckNormalTacto, checkboxYTacto, checkboxSizeTacto, checkboxSizeTacto);
  doc.text("Normal", xCheckNormalTacto + checkboxSizeTacto + 1, checkboxCenterY + 0.8);
  if (datosFinales.evaluacionRectal?.tactoRectal?.normal) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    doc.text("X", xCheckNormalTacto + checkboxSizeTacto / 2 - textWidthX / 2, checkboxCenterY + 1.2);
  }

  // Checkbox "Anormal"
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.rect(xCheckAnormalTacto, checkboxYTacto, checkboxSizeTacto, checkboxSizeTacto);
  doc.text("Anormal", xCheckAnormalTacto + checkboxSizeTacto + 1, checkboxCenterY + 0.8);
  if (datosFinales.evaluacionRectal?.tactoRectal?.anormal) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    const textWidthX = doc.getTextWidth("X");
    doc.text("X", xCheckAnormalTacto + checkboxSizeTacto / 2 - textWidthX / 2, checkboxCenterY + 1.2);
  }

  yPos += alturaFilaEvaluacion;

  // === SECCIÓN: ANILLOS INGUINALES, HERNIAS Y VARICES ===

  // Verificar si necesitamos nueva página
  const alturaFilaInguinales = 5;
  const alturaTotalInguinales = alturaFilaInguinales * 2; // 2 filas
  if (yPos + alturaTotalInguinales > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Dividir en 3 columnas
  const anchoColInguinales = tablaAncho / 3;
  const divColInguinales1 = tablaInicioX + anchoColInguinales;
  const divColInguinales2 = tablaInicioX + (anchoColInguinales * 2);

  // Líneas verticales
  doc.line(divColInguinales1, yPos, divColInguinales1, yPos + alturaTotalInguinales);
  doc.line(divColInguinales2, yPos, divColInguinales2, yPos + alturaTotalInguinales);

  // FILA 1: Labels
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaInguinales);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaInguinales);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaInguinales, tablaInicioX + tablaAncho, yPos + alturaFilaInguinales);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ANILLOS INGUINALES", tablaInicioX + 2, yPos + 3.5);
  doc.text("HERNIAS", divColInguinales1 + 2, yPos + 3.5);
  doc.text("VARICES", divColInguinales2 + 2, yPos + 3.5);

  yPos += alturaFilaInguinales;

  // FILA 2: Data
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaInguinales);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaInguinales);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaInguinales, tablaInicioX + tablaAncho, yPos + alturaFilaInguinales);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(data.anillosInguinalesAnexo7c_txtanillosinguinales || "", tablaInicioX + 2, yPos + 3.5);
  doc.text(data.herniasAnexo7c_txthernias || "", divColInguinales1 + 2, yPos + 3.5);
  doc.text(data.varicesAnexo7c_txtvarices || "", divColInguinales2 + 2, yPos + 3.5);

  yPos += alturaFilaInguinales;

  // === SECCIÓN: ORGANOS GENITALES Y GANGLIOS LINFATICOS ===

  // Verificar si necesitamos nueva página
  const alturaFilaOrganos = 5;
  const alturaTotalOrganos = alturaFilaOrganos * 2; // 2 filas
  if (yPos + alturaTotalOrganos > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Dividir en 2 columnas
  const anchoColOrganos = tablaAncho / 2;
  const divColOrganos = tablaInicioX + anchoColOrganos;

  // Línea vertical
  doc.line(divColOrganos, yPos, divColOrganos, yPos + alturaTotalOrganos);

  // FILA 1: Labels
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaOrganos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaOrganos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaOrganos, tablaInicioX + tablaAncho, yPos + alturaFilaOrganos);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ORGANOS GENITALES", tablaInicioX + 2, yPos + 3.5);
  doc.text("GANGLIOS LINFATICOS", divColOrganos + 2, yPos + 3.5);

  yPos += alturaFilaOrganos;

  // FILA 2: Data
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaOrganos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaOrganos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaOrganos, tablaInicioX + tablaAncho, yPos + alturaFilaOrganos);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(data.organosGenitalesAnexo7c_txtorganosgenitales || "", tablaInicioX + 2, yPos + 3.5);
  doc.text(data.gangliosAnexo7c_txtganglios || "", divColOrganos + 2, yPos + 3.5);

  yPos += alturaFilaOrganos;

  // === SECCIÓN: EVALUACIÓN MENTAL ===

  // Verificar si necesitamos nueva página
  const alturaFilaMental = 5;
  const alturaTotalMental = alturaFilaMental * 3; // 3 filas (agregada fila de data de lenguaje)
  if (yPos + alturaTotalMental > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // FILA 1: Lenguaje, Atención, Memoria, Inteligencia, Orientación, Afectividad
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMental);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMental);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaMental, tablaInicioX + tablaAncho, yPos + alturaFilaMental);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("LENGUAJE, ATENCIÓN, MEMORIA, INTELIGENCIA, ORIENTACIÓN, AFECTIVIDAD", tablaInicioX + 2, yPos + 3.5);

  yPos += alturaFilaMental;

  // FILA 2: Data de Lenguaje
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMental);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMental);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaMental, tablaInicioX + tablaAncho, yPos + alturaFilaMental);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(data.lenguageAnexo7c_txtlenguage || "", tablaInicioX + 2, yPos + 3.5);

  yPos += alturaFilaMental;

  // FILA 3: Estado mental
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMental);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMental);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaMental, tablaInicioX + tablaAncho, yPos + alturaFilaMental);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("ESTADO MENTAL:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.evaluacionMental?.estadoMental || "", tablaInicioX + 35, yPos + 3.5);

  yPos += alturaFilaMental;

  // === SECCIÓN: RADIOGRAFÍA DE TÓRAX ===

  // Verificar si necesitamos nueva página
  const alturaFilaRX = 5;
  const alturaTotalRX = alturaFilaRX * 5; // 5 filas (agregamos una fila más para Silueta cardiovascular)
  if (yPos + alturaTotalRX > pageHeight - 20) {
    footerTR(doc, { footerOffsetY: getFooterOffset() });
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // Estructura: 3 columnas
  // Columna 1: pequeña (N° RX, Fecha, calidad, simbolos) - 20%
  // Columna 2: pequeña (imagen) - 25%
  // Columna 3: ancha (texto) - 55%
  const anchoColRX1 = tablaAncho * 0.20;
  const anchoColRX2 = tablaAncho * 0.25;
  const anchoColRX3 = tablaAncho * 0.55;
  const divColRX1 = tablaInicioX + anchoColRX1;
  const divColRX2 = divColRX1 + anchoColRX2;

  // Líneas verticales principales (para todas las filas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotalRX);
  doc.line(divColRX1, yPos, divColRX1, yPos + alturaTotalRX);
  doc.line(divColRX2, yPos, divColRX2, yPos + alturaTotalRX);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotalRX);

  // Dividir columna 3 en 2 sub-columnas (solo para filas 2, 3 y 4)
  const anchoCol3Sub1 = anchoColRX3 / 2;
  const divCol3Sub1 = divColRX2 + anchoCol3Sub1;

  // Columna 2: Imagen (ocupa todas las filas, manteniendo proporción)
  // Centrar la imagen dentro de la columna 2
  const margenImagen = 2;
  const anchoImagen = anchoColRX2 - (margenImagen * 2);
  const xImagen = divColRX1 + margenImagen; // Posición X dentro de la columna 2
  const yImagen = yPos + 0.5;

  // Función para cargar imagen manteniendo proporciones
  const loadImg = (src) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });

  // Ruta de la imagen
  const imgPath = "/img/Anexo16/pulmonesFrame.png";

  // Cargar imagen de forma asíncrona pero asegurarse de que se añada
  loadImg(imgPath)
    .then((img) => {
      try {
        // Calcular altura manteniendo el aspect ratio original de la imagen
        const aspectRatio = img.height / img.width;
        const alturaImagen = anchoImagen * aspectRatio;
        // Verificar que la imagen no exceda la altura total disponible
        const alturaMaxima = alturaTotalRX - 1;
        let alturaFinal = alturaImagen;
        if (alturaImagen > alturaMaxima) {
          alturaFinal = alturaMaxima;
          // Ajustar ancho proporcionalmente si la altura se limita
          const anchoFinal = alturaFinal / aspectRatio;
          const xImagenCentrada = divColRX1 + (anchoColRX2 - anchoFinal) / 2;
          doc.addImage(img, "PNG", xImagenCentrada, yImagen, anchoFinal, alturaFinal);
        } else {
          // Centrar verticalmente si la imagen es más pequeña que la altura disponible
          const yImagenCentrada = yPos + (alturaTotalRX - alturaFinal) / 2;
          doc.addImage(img, "PNG", xImagen, yImagenCentrada, anchoImagen, alturaFinal);
        }
      } catch (imgError) {
        console.warn("Error al añadir imagen al PDF:", imgError);
        // Intentar añadir directamente con la ruta
        try {
          const alturaImagenEstimada = anchoImagen * 0.75; // Aspect ratio aproximado
          const alturaMaxima = alturaTotalRX - 1;
          const alturaFinal = alturaImagenEstimada > alturaMaxima ? alturaMaxima : alturaImagenEstimada;
          const yImagenCentrada = yPos + (alturaTotalRX - alturaFinal) / 2;
          doc.addImage(imgPath, "PNG", xImagen, yImagenCentrada, anchoImagen, alturaFinal);
        } catch (directError) {
          console.warn("No se pudo añadir imagen directamente:", directError);
        }
      }

      // Continuar con el resto del código después de añadir la imagen
      continuarConRadiografia();
    })
    .catch((error) => {
      // Si la imagen no se puede cargar, intentar añadirla directamente con la ruta
      console.warn("No se pudo cargar la imagen:", error);
      try {
        const alturaImagenEstimada = anchoImagen * 0.75; // Aspect ratio aproximado
        const alturaMaxima = alturaTotalRX - 1;
        const alturaFinal = alturaImagenEstimada > alturaMaxima ? alturaMaxima : alturaImagenEstimada;
        const yImagenCentrada = yPos + (alturaTotalRX - alturaFinal) / 2;
        doc.addImage(imgPath, "PNG", xImagen, yImagenCentrada, anchoImagen, alturaFinal);
      } catch (directError) {
        console.warn("No se pudo añadir imagen directamente:", directError);
      }
      continuarConRadiografia();
    });

  // Función para continuar con el código después de cargar la imagen
  async function continuarConRadiografia() {

    // Línea horizontal superior (completa)
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // Línea horizontal inferior (completa)
    doc.line(tablaInicioX, yPos + alturaTotalRX, tablaInicioX + tablaAncho, yPos + alturaTotalRX);

    // FILA 1: N° RX | (imagen) | vértices
    // Líneas horizontales solo en columna 1 y 3, NO en columna 2
    doc.line(tablaInicioX, yPos + alturaFilaRX, divColRX1, yPos + alturaFilaRX); // Solo en columna 1
    doc.line(divColRX2, yPos + alturaFilaRX, tablaInicioX + tablaAncho, yPos + alturaFilaRX); // Solo en columna 3

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("N° RX:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.numeroRx || "", tablaInicioX + 15, yPos + 3.5);

    // Columna 3: vértices (ocupa todo el ancho de col3)
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("VERTICES:", divColRX2 + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.vertices || "", divColRX2 + 20, yPos + 3.5);

    yPos += alturaFilaRX;

    // FILA 2: Fecha | (imagen) | Compos pulmonares | mediastinos
    // Líneas horizontales solo en columna 1 y 3, NO en columna 2
    doc.line(tablaInicioX, yPos + alturaFilaRX, divColRX1, yPos + alturaFilaRX); // Solo en columna 1
    doc.line(divColRX2, yPos + alturaFilaRX, tablaInicioX + tablaAncho, yPos + alturaFilaRX); // Solo en columna 3

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("FECHA:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.fecha || "", tablaInicioX + 15, yPos + 3.5);

    // Columna 3 sub1: Compos pulmonares
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("CAMPOS PULMONARES:", divColRX2 + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.composicionesPulmonares || "", divColRX2 + 40, yPos + 3.5);

    // Columna 3 sub2: mediastinos
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("MEDIASTINOS:", divCol3Sub1 + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.mediastinos || "", divCol3Sub1 + 28, yPos + 3.5);

    yPos += alturaFilaRX;

    // FILA 3: calidad | (imagen) | hilios | senos
    // Líneas horizontales solo en columna 1 y 3, NO en columna 2
    doc.line(tablaInicioX, yPos + alturaFilaRX, divColRX1, yPos + alturaFilaRX); // Solo en columna 1
    doc.line(divColRX2, yPos + alturaFilaRX, tablaInicioX + tablaAncho, yPos + alturaFilaRX); // Solo en columna 3

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("CALIDAD:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.calidad || "", tablaInicioX + 18, yPos + 3.5);

    // Columna 3 sub1: hilios
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("HILIOS:", divColRX2 + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.hilios || "", divColRX2 + 18, yPos + 3.5);

    // Columna 3 sub2: senos
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SENOS:", divCol3Sub1 + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.senos || "", divCol3Sub1 + 18, yPos + 3.5);

    yPos += alturaFilaRX;

    // FILA 4: simbolos | (imagen) | Conclusiones
    // Líneas horizontales solo en columna 1 y 3, NO en columna 2
    doc.line(tablaInicioX, yPos + alturaFilaRX, divColRX1, yPos + alturaFilaRX); // Solo en columna 1
    doc.line(divColRX2, yPos + alturaFilaRX, tablaInicioX + tablaAncho, yPos + alturaFilaRX); // Solo en columna 3

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SIMBOLOS:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.simbolos || "", tablaInicioX + 20, yPos + 3.5);

    // Columna 2: espacio vacío (sin líneas horizontales internas)

    // Columna 3: Conclusiones (ocupa todo el ancho de col3)
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("CONCLUSIONES:", divColRX2 + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.conclusiones || "", divColRX2 + 30, yPos + 3.5);

    yPos += alturaFilaRX;

    // FILA 5: (vacío col1) | (imagen) | Silueta cardiovascular
    // No hay líneas horizontales adicionales (ya está la línea inferior completa)

    // Columna 1: vacía
    // Columna 2: espacio vacío (imagen continúa)

    // Columna 3: Silueta cardiovascular (ocupa todo el ancho de col3)
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SILUETA CARDIOVASCULAR:", divColRX2 + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(datosFinales.radiografiaTorax?.siluetaCardiovascular || "", divColRX2 + 45, yPos + 3.5);

    yPos += alturaFilaRX;

    // === SECCIÓN: CLASIFICACIÓN DE NEUMOCONIOSIS ===

    // Verificar si necesitamos nueva página
    const alturaFilaNeumo = 5;
    const alturaFilaCategoria = 5;
    const alturaFilaDescripcion = 5;
    const alturaFilaVacia = 8;
    const alturaTotalNeumo = alturaFilaNeumo * 2 + alturaFilaCategoria + alturaFilaDescripcion + alturaFilaVacia; // Checkboxes + Códigos + Categorías + Descripciones + Vacía
    if (yPos + alturaTotalNeumo > pageHeight - 20) {
      footerTR(doc, { footerOffsetY: getFooterOffset() });
      doc.addPage();
      numeroPagina++;
      await drawHeader(numeroPagina);
      yPos = 35.5;
    }

    // Estructura: 7 columnas principales (0/0 | 1/0 | 1/1+1/2 | 2/1+2/2+2/3 | 3/2+3/3+3/+ | A,B,C | St)
    const numColumnasPrincipales = 7;
    const anchoColumnaPrincipal = tablaAncho / numColumnasPrincipales;

    // Línea horizontal superior
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // Calcular altura hasta FILA 4 (solo FILAS 1, 2, 3)
    const alturaHastaFila4 = alturaFilaNeumo * 2 + alturaFilaCategoria; // FILA 1, 2, 3

    // Líneas verticales principales (8 líneas para 7 columnas)
    // Dibujar solo en las FILAS 1, 2, 3 (antes de FILA 4 y FILA 5)
    for (let i = 0; i <= numColumnasPrincipales; i++) {
      const xLinea = tablaInicioX + (i * anchoColumnaPrincipal);
      // Tramo superior: desde el inicio hasta antes de FILA 4
      doc.line(xLinea, yPos, xLinea, yPos + alturaHastaFila4);
    }

    // FILA 1: Checkboxes (12 checkboxes distribuidos en 7 columnas)
    const checkboxSize = 3;
    const checkboxY = yPos + alturaFilaNeumo / 2;

    // Estructura de checkboxes: 0/0 | 1/0 | 1/1, 1/2 | 2/1, 2/2, 2/3 | 3/2, 3/3, 3/+ | A,B,C | St
    const estructuraCheckboxes = [
      ["0/0"],
      ["1/0"],
      ["1/1", "1/2"],
      ["2/1", "2/2", "2/3"],
      ["3/2", "3/3", "3/+"],
      ["A,B,C"],
      ["St"]
    ];

    estructuraCheckboxes.forEach((grupo, colIndex) => {
      const xColumna = tablaInicioX + (colIndex * anchoColumnaPrincipal);

      if (grupo.length === 1) {
        // Centrar si solo hay un checkbox
        const xCheckbox = xColumna + (anchoColumnaPrincipal / 2);
        doc.rect(xCheckbox - (checkboxSize / 2), checkboxY - (checkboxSize / 2), checkboxSize, checkboxSize);

        // Marcar si está seleccionado
        if (datosFinales.clasificacionNeumoconiosis?.clasificaciones?.[grupo[0]]) {
          doc.setFont("helvetica", "bold").setFontSize(7);
          const textWidth = doc.getTextWidth("X");
          const xText = xCheckbox - (textWidth / 2);
          const yText = checkboxY + (checkboxSize / 4);
          doc.text("X", xText, yText);
        }
      } else {
        // Distribuir checkboxes centrados en la columna
        const espacioEntreCheckboxes = 2;
        const anchoTotalCheckboxes = (checkboxSize * grupo.length) + (espacioEntreCheckboxes * (grupo.length - 1));
        const inicioCheckboxes = xColumna + (anchoColumnaPrincipal - anchoTotalCheckboxes) / 2;

        grupo.forEach((clave, indexEnGrupo) => {
          const xCheckbox = inicioCheckboxes + (indexEnGrupo * (checkboxSize + espacioEntreCheckboxes)) + (checkboxSize / 2);

          // Dibujar checkbox
          doc.rect(xCheckbox - (checkboxSize / 2), checkboxY - (checkboxSize / 2), checkboxSize, checkboxSize);

          // Marcar si está seleccionado
          if (datosFinales.clasificacionNeumoconiosis?.clasificaciones?.[clave]) {
            doc.setFont("helvetica", "bold").setFontSize(7);
            const textWidth = doc.getTextWidth("X");
            const xText = xCheckbox - (textWidth / 2);
            const yText = checkboxY + (checkboxSize / 4);
            doc.text("X", xText, yText);
          }
        });
      }
    });

    // Línea horizontal después de checkboxes
    doc.line(tablaInicioX, yPos + alturaFilaNeumo, tablaInicioX + tablaAncho, yPos + alturaFilaNeumo);
    yPos += alturaFilaNeumo;

    // FILA 2: Códigos (agrupados según estructura)
    doc.setFont("helvetica", "normal").setFontSize(7);

    estructuraCheckboxes.forEach((grupo, colIndex) => {
      const xColumna = tablaInicioX + (colIndex * anchoColumnaPrincipal);

      if (grupo.length === 1) {
        // Centrar si solo hay un código
        const xCodigo = xColumna + (anchoColumnaPrincipal / 2);
        doc.text(grupo[0], xCodigo, yPos + 3.5, { align: "center" });
      } else {
        // Distribuir códigos horizontalmente, uno después del otro con espacio mínimo
        const espacioEntreCodigos = 1.5;
        let anchoTotalCodigos = 0;
        grupo.forEach((codigo) => {
          anchoTotalCodigos += doc.getTextWidth(codigo);
        });
        anchoTotalCodigos += espacioEntreCodigos * (grupo.length - 1);

        // Centrar el grupo completo
        const inicioCodigos = xColumna + (anchoColumnaPrincipal - anchoTotalCodigos) / 2;
        let xAcumulado = inicioCodigos;

        grupo.forEach((codigo, indexEnGrupo) => {
          doc.text(codigo, xAcumulado, yPos + 3.5);
          if (indexEnGrupo < grupo.length - 1) {
            xAcumulado += doc.getTextWidth(codigo) + espacioEntreCodigos;
          }
        });
      }
    });

    // Línea horizontal después de códigos
    doc.line(tablaInicioX, yPos + alturaFilaNeumo, tablaInicioX + tablaAncho, yPos + alturaFilaNeumo);
    yPos += alturaFilaNeumo;

    // FILA 3: Categorías (7 columnas)
    doc.setFont("helvetica", "bold").setFontSize(7);

    // Columna 1: CERO
    const xCero = tablaInicioX;
    doc.text("CERO", xCero + (anchoColumnaPrincipal / 2), yPos + 3.5, { align: "center" });

    // Columna 2: 1/0
    const xCol2 = xCero + anchoColumnaPrincipal;
    doc.text("1/0", xCol2 + (anchoColumnaPrincipal / 2), yPos + 3.5, { align: "center" });

    // Columna 3: UNO
    const xUno = xCol2 + anchoColumnaPrincipal;
    doc.text("UNO", xUno + (anchoColumnaPrincipal / 2), yPos + 3.5, { align: "center" });

    // Columna 4: DOS
    const xDos = xUno + anchoColumnaPrincipal;
    doc.text("DOS", xDos + (anchoColumnaPrincipal / 2), yPos + 3.5, { align: "center" });

    // Columna 5: TRES
    const xTres = xDos + anchoColumnaPrincipal;
    doc.text("TRES", xTres + (anchoColumnaPrincipal / 2), yPos + 3.5, { align: "center" });

    // Columna 6: CUATRO
    const xCuatro = xTres + anchoColumnaPrincipal;
    doc.text("CUATRO", xCuatro + (anchoColumnaPrincipal / 2), yPos + 3.5, { align: "center" });

    // Columna 7: - (vacía)
    const xCol7 = xCuatro + anchoColumnaPrincipal;
    doc.text("-", xCol7 + (anchoColumnaPrincipal / 2), yPos + 3.5, { align: "center" });

    // Línea horizontal después de categorías
    doc.line(tablaInicioX, yPos + alturaFilaCategoria, tablaInicioX + tablaAncho, yPos + alturaFilaCategoria);
    yPos += alturaFilaCategoria;

    // FILA 4: Etiquetas descriptivas (3 columnas grandes)
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Bordes verticales izquierdo y derecho de la tabla en esta fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDescripcion);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDescripcion);

    // Celda 1: SIN NEUMOCONIOSIS (columna 1 - CERO)
    const anchoCelda1 = anchoColumnaPrincipal; // Solo columna CERO
    const textSinNeumo = "Sin neumoconiosis";
    const centroCelda1 = xCero + (anchoCelda1 / 2);
    doc.text(textSinNeumo, centroCelda1, yPos + 3.5, { align: "center" });
    // Línea vertical entre celda 1 y 2
    doc.line(xCol2, yPos, xCol2, yPos + alturaFilaDescripcion);

    // Celda 2: IMAGEN RADIOGRAFICA de EXPOSICIÓN A POLVO (columna 2 - 1/0)
    const anchoCelda2 = anchoColumnaPrincipal; // Solo columna 1/0
    const textoCompleto = "Imagen Radiografica de Exposición a Polvo";
    const centroCelda2 = xCol2 + (anchoCelda2 / 2);
    const margenCelda = 2; // Margen interno de la celda

    // Función para dividir texto en líneas que quepan en el ancho disponible
    const dividirTextoEnLineas = (texto, anchoMaximo, fontSize) => {
      doc.setFontSize(fontSize);
      const palabras = texto.split(" ");
      const lineas = [];
      let lineaActual = "";

      palabras.forEach((palabra, index) => {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);

        if (anchoTexto <= anchoMaximo || lineaActual === "") {
          lineaActual = textoPrueba;
        } else {
          lineas.push(lineaActual);
          lineaActual = palabra;
        }

        // Si es la última palabra, agregar la línea
        if (index === palabras.length - 1) {
          lineas.push(lineaActual);
        }
      });

      return lineas;
    };

    // Intentar con tamaño 5 primero
    let fontSize = 5;
    let lineas = dividirTextoEnLineas(textoCompleto, anchoCelda2 - margenCelda, fontSize);

    // Verificar si alguna línea excede el ancho
    doc.setFontSize(fontSize);
    const excedeAncho = lineas.some(linea => doc.getTextWidth(linea) > anchoCelda2 - margenCelda);

    // Si hay más de 3 líneas o alguna excede el ancho, reducir más
    if (lineas.length > 3 || excedeAncho) {
      fontSize = 4;
      lineas = dividirTextoEnLineas(textoCompleto, anchoCelda2 - margenCelda, fontSize);
    }

    // Dibujar las líneas centradas verticalmente
    doc.setFontSize(fontSize);
    const espacioEntreLineas = fontSize * 0.5; // Espacio entre líneas
    const alturaTotalTexto = (lineas.length - 1) * espacioEntreLineas + fontSize * 0.4;
    const yInicioTexto = yPos + (alturaFilaDescripcion / 2) - (alturaTotalTexto / 2) + (fontSize * 0.3);

    lineas.forEach((linea, index) => {
      const yLinea = yInicioTexto + (index * espacioEntreLineas);
      doc.text(linea, centroCelda2, yLinea, { align: "center" });
    });

    doc.setFontSize(7); // Restaurar tamaño
    // Línea vertical entre celda 2 y 3
    doc.line(xUno, yPos, xUno, yPos + alturaFilaDescripcion);

    // Celda 3: CON NEUMOCONIOSIS (columnas 3-7: UNO, DOS, TRES, CUATRO, -)
    const anchoCelda3 = anchoColumnaPrincipal * 5; // Columnas UNO, DOS, TRES, CUATRO, -
    const textConNeumo = "Con Neumoconiosis";
    const centroCelda3 = xUno + (anchoCelda3 / 2);
    doc.text(textConNeumo, centroCelda3, yPos + 3.5, { align: "center" });

    // Línea horizontal después de descripciones
    doc.line(tablaInicioX, yPos + alturaFilaDescripcion, tablaInicioX + tablaAncho, yPos + alturaFilaDescripcion);
    yPos += alturaFilaDescripcion;

    // FILA 5: Espacio para datos (tamaño 5, altura mayor)
    // Configurar tamaño de fuente para datos futuros
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Bordes verticales izquierdo y derecho de la tabla en esta fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaVacia);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaVacia);

    // Líneas verticales divisorias (solo las 2 necesarias, igual que en FILA 4)
    // Línea entre celda 1 (CERO) y celda 2 (1/0)
    doc.line(xCol2, yPos, xCol2, yPos + alturaFilaVacia);
    // Línea entre celda 2 (1/0) y celda 3 (UNO hasta el final)
    doc.line(xUno, yPos, xUno, yPos + alturaFilaVacia);

    // Línea horizontal inferior (completa)
    doc.line(tablaInicioX, yPos + alturaFilaVacia, tablaInicioX + tablaAncho, yPos + alturaFilaVacia);

    // Mostrar datos en FILA 5
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Celda 1: SIN NEUMOCONIOSIS
    const textoSinNeumo = datosFinales.clasificacionNeumoconiosis?.sinNeumoconiosis || "N/A";
    const maxAnchoCelda1 = anchoColumnaPrincipal - 4;
    const lineasSinNeumo = doc.splitTextToSize(textoSinNeumo, maxAnchoCelda1);
    const yInicioSinNeumo = yPos + (alturaFilaVacia / 2) - ((lineasSinNeumo.length - 1) * 2);
    lineasSinNeumo.forEach((linea, index) => {
      doc.text(linea, xCero + (anchoColumnaPrincipal / 2), yInicioSinNeumo + (index * 2.5), { align: "center" });
    });

    // Celda 2: IMAGEN RADIOGRAFICA de EXPOSICIÓN A POLVO
    const textoImagen = datosFinales.clasificacionNeumoconiosis?.imagenRadiograficaPolvo || "N/A";
    const maxAnchoCelda2 = anchoColumnaPrincipal - 4;
    const lineasImagen = doc.splitTextToSize(textoImagen, maxAnchoCelda2);
    const yInicioImagen = yPos + (alturaFilaVacia / 2) - ((lineasImagen.length - 1) * 2);
    lineasImagen.forEach((linea, index) => {
      doc.text(linea, xCol2 + (anchoColumnaPrincipal / 2), yInicioImagen + (index * 2.5), { align: "center" });
    });

    // Celda 3: CON NEUMOCONIOSIS
    const textoConNeumo = datosFinales.clasificacionNeumoconiosis?.conNeumoconiosis || "NO";
    const maxAnchoCelda3 = anchoColumnaPrincipal * 5 - 4;
    const lineasConNeumo = doc.splitTextToSize(textoConNeumo, maxAnchoCelda3);
    const yInicioConNeumo = yPos + (alturaFilaVacia / 2) - ((lineasConNeumo.length - 1) * 2);
    lineasConNeumo.forEach((linea, index) => {
      doc.text(linea, xUno + (anchoColumnaPrincipal * 5 / 2), yInicioConNeumo + (index * 2.5), { align: "center" });
    });

    // Restaurar tamaño de fuente por defecto
    doc.setFontSize(7);

    yPos += alturaFilaVacia;

    // === SECCIÓN: REACCIONES SEROLÓGICAS LUES ===

    // Verificar si necesitamos nueva página
    const alturaFilaLues = 6;
    if (yPos + alturaFilaLues > pageHeight - 20) {
      footerTR(doc, { footerOffsetY: getFooterOffset() });
      doc.addPage();
      numeroPagina++;
      await drawHeader(numeroPagina);
      yPos = 35.5;
    }

    // Bordes verticales izquierdo y derecho
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLues);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLues);

    // Línea horizontal superior
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // Texto: REACCIONES SEROLÓGICAS LUES
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("REACCIONES SEROLÓGICAS LUES", tablaInicioX + 2, yPos + 3.5);

    // Texto: a-Lues
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("a-Lues", tablaInicioX + 60, yPos + 3.5);

    // Checkboxes NEGATIVO y POSITIVO
    const checkboxLuesSize = 2.8;
    const checkboxLuesY = yPos + 1;

    // Checkbox NEGATIVO
    const xCheckNegativo = tablaInicioX + 75;
    doc.rect(xCheckNegativo, checkboxLuesY, checkboxLuesSize, checkboxLuesSize);
    doc.text("NEGATIVO", xCheckNegativo + checkboxLuesSize + 1, yPos + 3.5);
    if (datosFinales.reaccionesSerologicasLues?.negativo) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckNegativo + (checkboxLuesSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxLuesY + (checkboxLuesSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }

    // Checkbox POSITIVO
    const xCheckPositivo = tablaInicioX + 100;
    doc.rect(xCheckPositivo, checkboxLuesY, checkboxLuesSize, checkboxLuesSize);
    doc.text("POSITIVO", xCheckPositivo + checkboxLuesSize + 1, yPos + 3.5);
    if (datosFinales.reaccionesSerologicasLues?.positivo) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckPositivo + (checkboxLuesSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxLuesY + (checkboxLuesSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }

    // Línea horizontal inferior
    doc.line(tablaInicioX, yPos + alturaFilaLues, tablaInicioX + tablaAncho, yPos + alturaFilaLues);
    yPos += alturaFilaLues;

    // === SECCIÓN: EXÁMENES DE LABORATORIO ===

    // Verificar si necesitamos nueva página
    const alturaFilaLabHeader = 5;
    const alturaFilaLab = 5;
    const alturaTotalLab = alturaFilaLabHeader + (alturaFilaLab * 9); // Header + 9 filas (3 títulos celestes + 6 filas de datos: 4 hemograma + 1 lipidico + 1 orina)
    if (yPos + alturaTotalLab > pageHeight - 20) {
      footerTR(doc, { footerOffsetY: getFooterOffset() });
      doc.addPage();
      numeroPagina++;
      await drawHeader(numeroPagina);
      yPos = 35.5;
    }

    // Bordes verticales izquierdo y derecho (completos)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotalLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotalLab);

    // Línea horizontal superior
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // FILA HEADER: EXAMENES DE LABORATORIO
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("EXAMENES DE LABORATORIO", tablaInicioX + 2, yPos + 3.5);

    // Línea horizontal después del header
    doc.line(tablaInicioX, yPos + alturaFilaLabHeader, tablaInicioX + tablaAncho, yPos + alturaFilaLabHeader);
    yPos += alturaFilaLabHeader;

    // === HEMOGRAMA COMPLETO ===
    // Fila celeste (fondo gris)
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaLab, 'F');
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("HEMOGRAMA COMPLETO", tablaInicioX + 2, yPos + 3.5);
    yPos += alturaFilaLab;

    // Fila con celdas: VSG | GLUCOSA | UREA | CREATININA
    const numCeldasHemograma = 4;
    const anchoCeldaHemograma = tablaAncho / numCeldasHemograma;
    const divsHemograma = [];
    for (let i = 1; i < numCeldasHemograma; i++) {
      divsHemograma.push(tablaInicioX + (anchoCeldaHemograma * i));
    }

    // Líneas verticales divisorias
    divsHemograma.forEach(div => {
      doc.line(div, yPos, div, yPos + alturaFilaLab);
    });

    // Bordes de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    // Celda 1: VSG
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("VSG:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const vsgValue = datosFinales.examenesLaboratorio?.hemograma?.vsg || "N/A";
    const vsgText = vsgValue === "N/A" ? vsgValue : `${vsgValue} mm/h`;
    doc.text(vsgText, tablaInicioX + 25, yPos + 3.5);

    // Celda 2: GLUCOSA
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("GLUCOSA:", divsHemograma[0] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const glucosaValue = datosFinales.examenesLaboratorio?.hemograma?.glucosa || "N/A";
    const glucosaText = glucosaValue === "N/A" ? glucosaValue : `${glucosaValue} mg/dl`;
    doc.text(glucosaText, divsHemograma[0] + 25, yPos + 3.5);

    // Celda 3: UREA
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("UREA:", divsHemograma[1] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const ureaValue = datosFinales.examenesLaboratorio?.hemograma?.urea || "N/A";
    const ureaText = ureaValue === "N/A" ? ureaValue : `${ureaValue} mg/dl`;
    doc.text(ureaText, divsHemograma[1] + 25, yPos + 3.5);

    // Celda 4: CREATININA
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("CREATININA:", divsHemograma[2] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const creatininaValue = datosFinales.examenesLaboratorio?.hemograma?.creatinina || "N/A";
    const creatininaText = creatininaValue === "N/A" ? creatininaValue : `${creatininaValue} mg/dl`;
    doc.text(creatininaText, divsHemograma[2] + 25, yPos + 3.5);

    yPos += alturaFilaLab;

    // Fila 2: LEUCOCITOS | SEGMENTADOS | LINFOCITOS | HEMATIES
    divsHemograma.forEach(div => {
      doc.line(div, yPos, div, yPos + alturaFilaLab);
    });
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    // Celda 1: LEUCOCITOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("LEUCOCITOS:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const leucocitosValue = datosFinales.examenesLaboratorio?.hemograma?.leucocitos || "N/A";
    const leucocitosText = leucocitosValue === "N/A" ? leucocitosValue : `${leucocitosValue} /mm³`;
    doc.text(leucocitosText, tablaInicioX + 25, yPos + 3.5);

    // Celda 2: SEGMENTADOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SEGMENTADOS:", divsHemograma[0] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const segmentadosValue = datosFinales.examenesLaboratorio?.hemograma?.segmentados || "N/A";
    const segmentadosText = segmentadosValue === "N/A" ? segmentadosValue : `${segmentadosValue} %`;
    doc.text(segmentadosText, divsHemograma[0] + 25, yPos + 3.5);

    // Celda 3: LINFOCITOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("LINFOCITOS:", divsHemograma[1] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const linfocitosValue = datosFinales.examenesLaboratorio?.hemograma?.linfocitos || "N/A";
    const linfocitosText = linfocitosValue === "N/A" ? linfocitosValue : `${linfocitosValue} %`;
    doc.text(linfocitosText, divsHemograma[1] + 25, yPos + 3.5);

    // Celda 4: HEMATIES
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("HEMATIES:", divsHemograma[2] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const hematiesValue = datosFinales.examenesLaboratorio?.hemograma?.hematies || "N/A";
    const hematiesText = hematiesValue === "N/A" ? hematiesValue : `${hematiesValue} /mm³`;
    doc.text(hematiesText, divsHemograma[2] + 25, yPos + 3.5);

    yPos += alturaFilaLab;

    // Fila 3: NEUTROFILOS | EOSINOFILOS | MONOCITOS | PLAQUETAS
    divsHemograma.forEach(div => {
      doc.line(div, yPos, div, yPos + alturaFilaLab);
    });
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    // Celda 1: NEUTROFILOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("NEUTROFILOS:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const neutrofilosValue = datosFinales.examenesLaboratorio?.hemograma?.neutrofilos || "N/A";
    const neutrofilosText = neutrofilosValue === "N/A" ? neutrofilosValue : `${neutrofilosValue} %`;
    doc.text(neutrofilosText, tablaInicioX + 25, yPos + 3.5);

    // Celda 2: EOSINOFILOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("EOSINOFILOS:", divsHemograma[0] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const eosinofilosValue = datosFinales.examenesLaboratorio?.hemograma?.eosinofilos || "N/A";
    const eosinofilosText = eosinofilosValue === "N/A" ? eosinofilosValue : `${eosinofilosValue} %`;
    doc.text(eosinofilosText, divsHemograma[0] + 25, yPos + 3.5);

    // Celda 3: MONOCITOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("MONOCITOS:", divsHemograma[1] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const monocitosValue = datosFinales.examenesLaboratorio?.hemograma?.monocitos || "N/A";
    const monocitosText = monocitosValue === "N/A" ? monocitosValue : `${monocitosValue} %`;
    doc.text(monocitosText, divsHemograma[1] + 25, yPos + 3.5);

    // Celda 4: PLAQUETAS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("PLAQUETAS:", divsHemograma[2] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const plaquetasValue = datosFinales.examenesLaboratorio?.hemograma?.plaquetas || "N/A";
    const plaquetasText = plaquetasValue === "N/A" ? plaquetasValue : `${plaquetasValue} /mm³`;
    doc.text(plaquetasText, divsHemograma[2] + 25, yPos + 3.5);

    yPos += alturaFilaLab;

    // Fila 4: ABASTONADOS | BASOFILOS
    divsHemograma.forEach(div => {
      doc.line(div, yPos, div, yPos + alturaFilaLab);
    });
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    // Celda 1: ABASTONADOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("ABASTONADOS:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const abastonadosValue = datosFinales.examenesLaboratorio?.hemograma?.abastonados || "N/A";
    const abastonadosText = abastonadosValue === "N/A" ? abastonadosValue : `${abastonadosValue} %`;
    doc.text(abastonadosText, tablaInicioX + 25, yPos + 3.5);

    // Celda 2: BASOFILOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("BASOFILOS:", divsHemograma[0] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const basofilosValue = datosFinales.examenesLaboratorio?.hemograma?.basofilos || "N/A";
    const basofilosText = basofilosValue === "N/A" ? basofilosValue : `${basofilosValue} %`;
    doc.text(basofilosText, divsHemograma[0] + 25, yPos + 3.5);

    yPos += alturaFilaLab;

    // === PERFIL LIPIDICO COMPLETO ===
    // Fila celeste (fondo gris)
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaLab, 'F');
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("PERFIL LIPIDICO COMPLETO", tablaInicioX + 2, yPos + 3.5);
    yPos += alturaFilaLab;

    // Fila con celdas: COLESTEROL TOTAL | LDL | H.D.L | V.L.D.L | TRIGLICERIDOS
    // Anchos proporcionales: COLESTEROL TOTAL más ancho, LDL/H.D.L/V.L.D.L más estrechas
    const anchoColesterol = tablaAncho * 0.28; // 38% - más ancho
    const anchoLDL = tablaAncho * 0.16; // 12% - más estrecho
    const anchoHDL = tablaAncho * 0.16; // 12% - más estrecho
    const anchoVLDL = tablaAncho * 0.16; // 12% - más estrecho
    // TRIGLICERIDOS toma el espacio restante (26%)

    // Posiciones de las divisiones
    const divLDL = tablaInicioX + anchoColesterol;
    const divHDL = divLDL + anchoLDL;
    const divVLDL = divHDL + anchoHDL;
    const divTrigliceridos = divVLDL + anchoVLDL;

    // Líneas verticales divisorias
    doc.line(divLDL, yPos, divLDL, yPos + alturaFilaLab);
    doc.line(divHDL, yPos, divHDL, yPos + alturaFilaLab);
    doc.line(divVLDL, yPos, divVLDL, yPos + alturaFilaLab);
    doc.line(divTrigliceridos, yPos, divTrigliceridos, yPos + alturaFilaLab);

    // Bordes de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    // Celda 1: COLESTEROL TOTAL
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("COLESTEROL TOTAL:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const colesterolValue = datosFinales.examenesLaboratorio?.perfilLipidico?.colesterolTotal || "N/A";
    const colesterolText = colesterolValue === "N/A" ? colesterolValue : `${colesterolValue} mg/dl`;
    doc.text(colesterolText, tablaInicioX + 35, yPos + 3.5);

    // Celda 2: LDL
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("LDL:", divLDL + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const ldlValue = datosFinales.examenesLaboratorio?.perfilLipidico?.ldl || "N/A";
    const ldlText = ldlValue === "N/A" ? ldlValue : `${ldlValue} mg/dl`;
    doc.text(ldlText, divLDL + 15, yPos + 3.5);

    // Celda 3: H.D.L
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("H.D.L:", divHDL + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const hdlValue = datosFinales.examenesLaboratorio?.perfilLipidico?.hdl || "N/A";
    const hdlText = hdlValue === "N/A" ? hdlValue : `${hdlValue} mg/dl`;
    doc.text(hdlText, divHDL + 15, yPos + 3.5);

    // Celda 4: V.L.D.L
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("V.L.D.L:", divVLDL + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const vldlValue = datosFinales.examenesLaboratorio?.perfilLipidico?.vldl || "N/A";
    const vldlText = vldlValue === "N/A" ? vldlValue : `${vldlValue} mg/dl`;
    doc.text(vldlText, divVLDL + 15, yPos + 3.5);

    // Celda 5: TRIGLICERIDOS
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("TRIGLICERIDOS:", divTrigliceridos + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const trigliceridosValue = datosFinales.examenesLaboratorio?.perfilLipidico?.trigliceridos || "N/A";
    const trigliceridosText = trigliceridosValue === "N/A" ? trigliceridosValue : `${trigliceridosValue} mg/dl`;
    doc.text(trigliceridosText, divTrigliceridos + 25, yPos + 3.5);

    yPos += alturaFilaLab;

    // === EXAMEN COMPLETO DE ORINA ===
    // Fila celeste (fondo gris)
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaLab, 'F');
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("EXAMEN COMPLETO DE ORINA", tablaInicioX + 2, yPos + 3.5);
    yPos += alturaFilaLab;

    // Fila con celdas: COCAINA EN ORINA | MARIHUANA EN ORINA | MERCURIO EN ORINA | PLOMO EN SANGRE
    const numCeldasOrina = 4;
    const anchoCeldaOrina = tablaAncho / numCeldasOrina;
    const divsOrina = [];
    for (let i = 1; i < numCeldasOrina; i++) {
      divsOrina.push(tablaInicioX + (anchoCeldaOrina * i));
    }

    // Líneas verticales divisorias
    divsOrina.forEach(div => {
      doc.line(div, yPos, div, yPos + alturaFilaLab);
    });

    // Bordes de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLab);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);

    // Celda 1: COCAINA EN ORINA
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("COCAINA EN ORINA:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const cocainaText = datosFinales.examenesLaboratorio?.examenOrina?.cocaina || "N/A";
    doc.text(cocainaText, tablaInicioX + 30, yPos + 3.5);

    // Celda 2: MARIHUANA EN ORINA
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("MARIHUANA EN ORINA:", divsOrina[0] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const marihuanaText = datosFinales.examenesLaboratorio?.examenOrina?.marihuana || "N/A";
    doc.text(marihuanaText, divsOrina[0] + 32, yPos + 3.5);

    // Celda 3: MERCURIO EN ORINA
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("MERCURIO EN ORINA:", divsOrina[1] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const mercurioText = datosFinales.examenesLaboratorio?.examenOrina?.mercurio || "N/A";
    doc.text(mercurioText, divsOrina[1] + 30, yPos + 3.5);

    // Celda 4: PLOMO EN SANGRE
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("PLOMO EN SANGRE:", divsOrina[2] + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const plomoText = datosFinales.examenesLaboratorio?.examenOrina?.plomo || "N/A";
    doc.text(plomoText, divsOrina[2] + 30, yPos + 3.5);

    // Línea horizontal inferior
    doc.line(tablaInicioX, yPos + alturaFilaLab, tablaInicioX + tablaAncho, yPos + alturaFilaLab);
    yPos += alturaFilaLab;

    // === SECCIÓN: GRUPO SANGUINEO ===

    // Verificar si necesitamos nueva página
    const alturaFilaGrupoSang = 6;
    if (yPos + alturaFilaGrupoSang > pageHeight - 20) {
      footerTR(doc, { footerOffsetY: getFooterOffset() });
      doc.addPage();
      numeroPagina++;
      await drawHeader(numeroPagina);
      yPos = 35.5;
    }

    // Bordes verticales izquierdo y derecho
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaGrupoSang);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaGrupoSang);

    // Línea horizontal superior
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // Texto: GRUPO SANGUINEO
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("GRUPO SANGUINEO", tablaInicioX + 2, yPos + 3.5);

    // Checkboxes Grupo Sanguíneo: O, A, B, AB
    const checkboxGrupoSize = 2.8;
    const checkboxGrupoY = yPos + 1;
    let xCheckActual = tablaInicioX + 35;

    // Checkbox O
    doc.rect(xCheckActual, checkboxGrupoY, checkboxGrupoSize, checkboxGrupoSize);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("O", xCheckActual + checkboxGrupoSize + 1, yPos + 3.5);
    if (datosFinales.grupoSanguineo?.tipo?.o) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckActual + (checkboxGrupoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxGrupoY + (checkboxGrupoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }
    xCheckActual += checkboxGrupoSize + 8; // Reducido a 8 para juntarlos

    // Checkbox A
    doc.rect(xCheckActual, checkboxGrupoY, checkboxGrupoSize, checkboxGrupoSize);
    doc.text("A", xCheckActual + checkboxGrupoSize + 1, yPos + 3.5);
    if (datosFinales.grupoSanguineo?.tipo?.a) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckActual + (checkboxGrupoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxGrupoY + (checkboxGrupoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }
    xCheckActual += checkboxGrupoSize + 8; // Reducido a 8 para juntarlos

    // Checkbox B
    doc.rect(xCheckActual, checkboxGrupoY, checkboxGrupoSize, checkboxGrupoSize);
    doc.text("B", xCheckActual + checkboxGrupoSize + 1, yPos + 3.5);
    if (datosFinales.grupoSanguineo?.tipo?.b) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckActual + (checkboxGrupoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxGrupoY + (checkboxGrupoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }
    xCheckActual += checkboxGrupoSize + 8; // Reducido a 8 para juntarlos

    // Checkbox AB
    doc.rect(xCheckActual, checkboxGrupoY, checkboxGrupoSize, checkboxGrupoSize);
    doc.text("AB", xCheckActual + checkboxGrupoSize + 1, yPos + 3.5);
    if (datosFinales.grupoSanguineo?.tipo?.ab) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckActual + (checkboxGrupoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxGrupoY + (checkboxGrupoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }
    xCheckActual += checkboxGrupoSize + 8; // Espacio después de AB

    // Línea divisoria 1: Entre GRUPO SANGUINEO y Factor Rh
    const xDiv1 = xCheckActual + 2; // Justo después de AB
    doc.line(xDiv1, yPos, xDiv1, yPos + alturaFilaGrupoSang);

    // Factor Rh - posicionado después de los checkboxes de grupo sanguíneo
    let xCheckRh = xDiv1 + 5; // Espacio adicional antes de Factor Rh
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Factor Rh", xCheckRh, yPos + 3.5);
    xCheckRh += 18; // Reducido para juntarlos

    // Checkbox Rh(-)
    doc.rect(xCheckRh, checkboxGrupoY, checkboxGrupoSize, checkboxGrupoSize);
    doc.text("Rh(-)", xCheckRh + checkboxGrupoSize + 1, yPos + 3.5);
    if (datosFinales.grupoSanguineo?.factorRh?.negativo) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckRh + (checkboxGrupoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxGrupoY + (checkboxGrupoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }
    xCheckRh += checkboxGrupoSize + 12; // Reducido para juntarlos

    // Checkbox Rh(+)
    doc.rect(xCheckRh, checkboxGrupoY, checkboxGrupoSize, checkboxGrupoSize);
    doc.text("Rh(+)", xCheckRh + checkboxGrupoSize + 1, yPos + 3.5);
    if (datosFinales.grupoSanguineo?.factorRh?.positivo) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckRh + (checkboxGrupoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxGrupoY + (checkboxGrupoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }

    // Línea divisoria 2: Entre Factor Rh y Hemoglobina/Hematocrito
    const xDiv2 = xCheckRh + checkboxGrupoSize + 15; // Justo después de Rh(+)
    doc.line(xDiv2, yPos, xDiv2, yPos + alturaFilaGrupoSang);

    // Hemoglobina/Hematocrito - movido más a la izquierda
    const xDivHem = xDiv2 + 5; // Posicionado después de la línea divisoria
    const hemoglobinaValue = datosFinales.grupoSanguineo?.hemoglobinaHematocrito || "";
    const hemoglobinaText = hemoglobinaValue ? `${hemoglobinaValue} g/dl` : "N/A";

    // Determinar color según rango de hemoglobina
    let colorHemoglobina = [0, 0, 0]; // Negro por defecto
    const hemoglobinaValueFloat = parseFloat(hemoglobinaValue || "0");
    const esHombre = datosFinales.sexoM;
    const esMujer = datosFinales.sexoF;

    if (hemoglobinaValueFloat > 0) {
      if (esHombre && (hemoglobinaValueFloat < 14 || hemoglobinaValueFloat > 20)) {
        colorHemoglobina = [255, 0, 0]; // Rojo si hombre < 14 o > 20
      } else if (esMujer && (hemoglobinaValueFloat < 13.5 || hemoglobinaValueFloat > 20)) {
        colorHemoglobina = [255, 0, 0]; // Rojo si mujer < 13.5 o > 20
      }
    }

    // Label en tamaño normal
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Hemoglobina: ", xDivHem + 2, yPos + 3.5);

    // Data en tamaño 9 con color
    const labelWidth = doc.getTextWidth("Hemoglobina: ");
    doc.setFont("helvetica", "bold").setFontSize(8.5);
    doc.setTextColor(colorHemoglobina[0], colorHemoglobina[1], colorHemoglobina[2]);
    doc.text(hemoglobinaText, xDivHem + 2 + labelWidth, yPos + 3.5);
    doc.setTextColor(0, 0, 0); // Volver al color negro

    // Línea horizontal inferior
    doc.line(tablaInicioX, yPos + alturaFilaGrupoSang, tablaInicioX + tablaAncho, yPos + alturaFilaGrupoSang);
    yPos += alturaFilaGrupoSang;

    // === SECCIÓN: APTO PARA TRABAJAR ===

    // Verificar si necesitamos nueva página
    const alturaFilaApto = 6;
    if (yPos + alturaFilaApto > pageHeight - 20) {
      footerTR(doc, { footerOffsetY: getFooterOffset() });
      doc.addPage();
      numeroPagina++;
      await drawHeader(numeroPagina);
      yPos = 35.5;
    }

    // Bordes verticales izquierdo y derecho
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaApto);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaApto);

    // Línea horizontal superior
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // Texto: APTO PARA TRABAJAR
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("APTO PARA TRABAJAR", tablaInicioX + 2, yPos + 3.5);

    // Checkboxes
    const checkboxAptoSize = 2.8;
    const checkboxAptoY = yPos + 1;
    let xCheckApto = tablaInicioX + 50;

    // Checkbox Si
    doc.rect(xCheckApto, checkboxAptoY, checkboxAptoSize, checkboxAptoSize);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Si", xCheckApto + checkboxAptoSize + 1, yPos + 3.5);
    if (datosFinales.aptoParaTrabajar?.si) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckApto + (checkboxAptoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxAptoY + (checkboxAptoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }
    xCheckApto += checkboxAptoSize + 12;

    // Checkbox No
    doc.rect(xCheckApto, checkboxAptoY, checkboxAptoSize, checkboxAptoSize);
    doc.text("No", xCheckApto + checkboxAptoSize + 1, yPos + 3.5);
    if (datosFinales.aptoParaTrabajar?.no) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckApto + (checkboxAptoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxAptoY + (checkboxAptoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }
    xCheckApto += checkboxAptoSize + 12;

    // Checkbox Revaluación en empresa
    doc.rect(xCheckApto, checkboxAptoY, checkboxAptoSize, checkboxAptoSize);
    doc.text("Revaluación en empresa", xCheckApto + checkboxAptoSize + 1, yPos + 3.5);
    if (datosFinales.aptoParaTrabajar?.revaluacionEmpresa) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      const textWidthX = doc.getTextWidth("X");
      const xCenteredX = xCheckApto + (checkboxAptoSize / 2) - (textWidthX / 2);
      const yCenteredX = checkboxAptoY + (checkboxAptoSize / 2) + 1;
      doc.text("X", xCenteredX, yCenteredX);
      doc.setFont("helvetica", "normal").setFontSize(7);
    }

    // Línea horizontal inferior
    doc.line(tablaInicioX, yPos + alturaFilaApto, tablaInicioX + tablaAncho, yPos + alturaFilaApto);
    yPos += alturaFilaApto;

    // === FOOTER PÁGINA 2 ===
    footerTR(doc, { footerOffsetY: getFooterOffset() });

    // === CREAR PÁGINA 3 ===
    doc.addPage();
    numeroPagina = 3;
    yPos = 35.5; // Posición inicial de la nueva página

    // Dibujar header en la nueva página
    await drawHeader(numeroPagina);

    // === SECCIÓN: OTROS EXAMENES (PÁGINA 3) ===

    const alturaFilaOtrosHeader = 5;
    const alturaFilaCrecienteOtros = 35; // Altura por defecto
    const textoOtrosExamenes = datosFinales.otrosExamenes?.dataCreciente || "";
    const anchoDisponibleOtrosExamenes = tablaAncho - 3;
    const lineasOtrosExamenes = doc.splitTextToSize(textoOtrosExamenes, anchoDisponibleOtrosExamenes);
    const interlineadoOtrosExamenes = 3;
    const alturaDinamicaOtrosExamenes = Math.max(alturaFilaCrecienteOtros, lineasOtrosExamenes.length * interlineadoOtrosExamenes + 4);
    const alturaTotalOtros = alturaFilaOtrosHeader + alturaDinamicaOtrosExamenes;

    // Bordes verticales izquierdo y derecho (completos)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotalOtros);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotalOtros);

    // Línea horizontal superior
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // FILA HEADER: OTROS EXAMENES (con fondo celeste)
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaOtrosHeader, 'F');
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaOtrosHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaOtrosHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaOtrosHeader, tablaInicioX + tablaAncho, yPos + alturaFilaOtrosHeader);

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("OTROS EXAMENES", tablaInicioX + 2, yPos + 3.5);

    // Línea horizontal después del header
    doc.line(tablaInicioX, yPos + alturaFilaOtrosHeader, tablaInicioX + tablaAncho, yPos + alturaFilaOtrosHeader);
    yPos += alturaFilaOtrosHeader;

    // FILA: data creciente
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineasOtrosExamenesFormateadas = lineasOtrosExamenes.map(linea => linea.toUpperCase());
    lineasOtrosExamenesFormateadas.forEach((linea, index) => {
      doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoOtrosExamenes));
    });

    // Línea horizontal inferior
    doc.line(tablaInicioX, yPos + alturaDinamicaOtrosExamenes, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtrosExamenes);
    yPos += alturaDinamicaOtrosExamenes;

    // === SECCIÓN: CONCLUSIONES (PÁGINA 3) ===

    const alturaFilaConclusionesHeader = 5;
    const textoConclusiones = datosFinales.conclusiones || "";

    // Split into items respecting \n or numbered points
    let itemsConclusiones = [];
    if (textoConclusiones.includes('\n')) {
      itemsConclusiones = textoConclusiones.split('\n').filter(item => item.trim() !== '');
    } else {
      itemsConclusiones = textoConclusiones.split(/(?=\d+\.\s)/).filter(item => item.trim() !== '');
    }

    const anchoDisponibleConclusiones = tablaAncho - 8; // Margen aumentado (4mm a cada lado)
    const espacioEntreItems = 2;

    // Calcular altura primero (simulación)
    let alturaCalculadaConclusiones = 0;
    if (itemsConclusiones.length > 0) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      let alturaSimulada = 4; // padding inicial aumentado
      itemsConclusiones.forEach((item, index) => {
        if (index > 0) {
          alturaSimulada += espacioEntreItems;
        }
        const itemUpper = item.trim().toUpperCase();
        const lineasSimuladas = doc.splitTextToSize(itemUpper, anchoDisponibleConclusiones);
        alturaSimulada += lineasSimuladas.length * (7 * 0.35); // fontSize * 0.35
      });
      alturaCalculadaConclusiones = Math.max(50, alturaSimulada + 8); // altura mínima 50mm, padding final aumentado
    } else {
      alturaCalculadaConclusiones = 50; // altura mínima por defecto 50mm
    }

    // Ya estamos en página 3, no crear nueva página aquí

    let yStartBoxConclusiones = yPos;

    // Dibujar header
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yStartBoxConclusiones, tablaAncho, alturaFilaConclusionesHeader, 'F');
    doc.line(tablaInicioX, yStartBoxConclusiones, tablaInicioX, yStartBoxConclusiones + alturaFilaConclusionesHeader);
    doc.line(tablaInicioX + tablaAncho, yStartBoxConclusiones, tablaInicioX + tablaAncho, yStartBoxConclusiones + alturaFilaConclusionesHeader);
    doc.line(tablaInicioX, yStartBoxConclusiones, tablaInicioX + tablaAncho, yStartBoxConclusiones);
    doc.line(tablaInicioX, yStartBoxConclusiones + alturaFilaConclusionesHeader, tablaInicioX + tablaAncho, yStartBoxConclusiones + alturaFilaConclusionesHeader);

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("CONCLUSIONES", tablaInicioX + 2, yStartBoxConclusiones + 3.5);

    // Dibujar contenido con márgenes adecuados
    let yCurrentConclusiones = yStartBoxConclusiones + alturaFilaConclusionesHeader + 4; // Margen superior aumentado
    doc.setFont("helvetica", "normal").setFontSize(7);

    itemsConclusiones.forEach((item, index) => {
      if (index > 0) {
        yCurrentConclusiones += espacioEntreItems;
      }
      const itemUpper = item.trim().toUpperCase();
      yCurrentConclusiones = dibujarTextoConSaltoLinea(itemUpper, tablaInicioX + 4, yCurrentConclusiones, anchoDisponibleConclusiones); // Margen X aumentado a 4mm
    });

    // Ajustar altura calculada con el contenido real, asegurando mínimo 50mm
    const alturaRealCalculada = yCurrentConclusiones - yStartBoxConclusiones + 8; // padding final aumentado
    alturaCalculadaConclusiones = Math.max(50, alturaRealCalculada); // Altura mínima 50mm

    // Dibujar líneas del box
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yStartBoxConclusiones, tablaInicioX, yStartBoxConclusiones + alturaCalculadaConclusiones);
    doc.line(tablaInicioX + tablaAncho, yStartBoxConclusiones, tablaInicioX + tablaAncho, yStartBoxConclusiones + alturaCalculadaConclusiones);
    doc.line(tablaInicioX, yStartBoxConclusiones, tablaInicioX + tablaAncho, yStartBoxConclusiones);
    doc.line(tablaInicioX, yStartBoxConclusiones + alturaCalculadaConclusiones, tablaInicioX + tablaAncho, yStartBoxConclusiones + alturaCalculadaConclusiones);

    yPos = yStartBoxConclusiones + alturaCalculadaConclusiones;

    // === SECCIÓN: RECOMENDACIONES / RESTRICCIONES ===

    // Verificar si necesitamos nueva página
    const alturaFilaRecomendacionesHeader = 5;
    const textoRecomendaciones = datosFinales.recomendacionesRestricciones || "";
    const anchoDisponibleRecomendaciones = tablaAncho - 8; // Margen aumentado (4mm a cada lado)

    // Procesar texto: separar por \n primero, si no hay \n, dividir por patrones de números (1., 2., etc.)
    let itemsRecomendaciones = [];
    if (textoRecomendaciones.includes('\n')) {
      itemsRecomendaciones = textoRecomendaciones.split('\n').filter(item => item.trim() !== '');
    } else {
      itemsRecomendaciones = textoRecomendaciones.split(/(?=\d+\.\s)/).filter(item => item.trim() !== '');
    }

    // Procesar cada ítem: dividir en líneas y agregar espacio entre ítems
    let todasLasLineasRecomendaciones = [];
    let alturaAcumuladaRecomendaciones = 0;
    const interlineadoTexto = 3;

    itemsRecomendaciones.forEach((item, itemIndex) => {
      const itemFormateado = item.trim().toUpperCase();
      if (!itemFormateado) return;

      const lineasDelItem = doc.splitTextToSize(itemFormateado, anchoDisponibleRecomendaciones);

      lineasDelItem.forEach((linea) => {
        todasLasLineasRecomendaciones.push({
          texto: linea,
          itemIndex: itemIndex,
          alturaLinea: interlineadoTexto
        });
        alturaAcumuladaRecomendaciones += interlineadoTexto;
      });

      if (itemIndex < itemsRecomendaciones.length - 1) {
        alturaAcumuladaRecomendaciones += espacioEntreItems;
      }
    });

    const alturaDinamicaRecomendaciones = Math.max(50, alturaAcumuladaRecomendaciones + 8); // altura mínima 50mm, margen inferior aumentado

    // Ya estamos en página 3, no crear nueva página aquí

    // Dibujar header
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaRecomendacionesHeader, 'F');
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaRecomendacionesHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaRecomendacionesHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaRecomendacionesHeader, tablaInicioX + tablaAncho, yPos + alturaFilaRecomendacionesHeader);

    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("RECOMENDACIONES / RESTRICCIONES", tablaInicioX + 2, yPos + 3.5);
    yPos += alturaFilaRecomendacionesHeader;

    // Dibujar líneas de la fila creciente
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaRecomendaciones);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaRecomendaciones);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaDinamicaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaDinamicaRecomendaciones);

    // Dibujar contenido línea por línea con espaciado entre ítems y márgenes adecuados
    doc.setFont("helvetica", "normal").setFontSize(7);
    let yPosActualRecomendaciones = yPos + 4; // Margen superior aumentado
    let itemIndexAnteriorRecomendaciones = -1;

    todasLasLineasRecomendaciones.forEach((lineaObj) => {
      if (lineaObj.itemIndex !== itemIndexAnteriorRecomendaciones && itemIndexAnteriorRecomendaciones !== -1) {
        yPosActualRecomendaciones += espacioEntreItems;
      }

      doc.text(lineaObj.texto, tablaInicioX + 4, yPosActualRecomendaciones); // Margen X aumentado a 4mm
      yPosActualRecomendaciones += interlineadoTexto;
      itemIndexAnteriorRecomendaciones = lineaObj.itemIndex;
    });

    yPos += alturaDinamicaRecomendaciones;

    // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
    const alturaSeccionDeclaracion = 30;

    // Verificar si necesitamos nueva página
    if (yPos + alturaSeccionDeclaracion > pageHeight - 20) {
      footerTR(doc, { footerOffsetY: getFooterOffset() });
      doc.addPage();
      numeroPagina++;
      await drawHeader(numeroPagina);
      yPos = 35.5;
    }

    // Dibujar las líneas de la sección de declaración (3 columnas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionDeclaracion);
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionDeclaracion);
    doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionDeclaracion);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion);

    // === COLUMNA 1: DECLARACIÓN ===
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoDeclaracion = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";

    // Función para justificar texto
    const justificarTexto = (texto, x, y, anchoMaximo, interlineado) => {
      const lineas = doc.splitTextToSize(texto, anchoMaximo);
      let yActual = y;

      lineas.forEach((linea, index) => {
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

    justificarTexto(textoDeclaracion, tablaInicioX + 2, yPos + 3, 55, 2.5);

    // === COLUMNA 2: FIRMA Y HUELLA DEL TRABAJADOR ===
    const firmaTrabajadorY = yPos + 3;
    const centroColumna2X = tablaInicioX + 60 + (60 / 2);

    // Agregar firma del trabajador
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

    // Agregar huella del trabajador
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
    footerTR(doc, { footerOffsetY: getFooterOffset() });

    // === Imprimir ===
    // === Imprimir ===
    if (docExistente) {
      return doc;
    } else {
      imprimir(doc);
    }
  }
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