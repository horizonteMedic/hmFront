import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero, getSign } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

// Utilidad para eliminar duplicados sin alterar el formato original
function dedupeText(input) {
  if (input === null || input === undefined) return "";
  const s = String(input);
  if (s === "") return "";

  // Caso 1: el texto completo está duplicado dos veces de forma exacta
  const len = s.length;
  if (len % 2 === 0) {
    const half = s.slice(0, len / 2);
    if (half === s.slice(len / 2)) {
      return half; // preserva formato y mayúsculas/minúsculas exactamente
    }
  }

  // Caso 2: duplicado con separador sencillo entre las dos mitades (espacios/puntuación)
  // Devuelve exactamente la primera ocurrencia, preservando su forma original
  const match = s.match(/^(.*?)[\s,;.-]+\1$/s);
  if (match) {
    return match[1];
  }

  return s;
}

export default function InformePsicologico_Anexo02_Nuevo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidos_apellidos_pa || "") + " " + (data.nombres_nombres_pa || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaAnexo_fecha || ""),
    tipoExamen: String(data.nombreExamen_nom_examen || ""),
    sexo: convertirGenero(data.sexo_sexo_pa || ""),
    documentoIdentidad: String(data.dni_cod_pa || ""),
    edad: String(data.edad_fecha_nacimiento_pa || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente_fecha_nacimiento_pa || ""),
    areaTrabajo: data.area_area_o || "",
    puestoTrabajo: data.cargo_cargo_de || "",
    empresa: data.empresa_razon_empresa || "",
    contrata: data.contrata_razon_contrata || "",
    actividadEconomica: data.explotacion_nom_ex || "",
    resideEnLugarTrabajo: data.residenciaSi_chkresidenciasi ? 'SI' : 'NO',
    tiempoResidencia: data.residenciaTiempo_txttiemporesidencia || "",
    correoElectronico: data.emailPaciente_email_pa || "",
    telefono: data.telefonoPaciente_telefono_pa || data.celularPaciente_celular_pa || data.telefono || "",
    estadoCivil: data.estadoCivilPaciente_estado_civil_pa || "",
    numTotalHijos: data.totalHijos_txttotalhijos || "",
    numDependientes: data.numeroDependientes_txtndependientes || "",
    gradoInstruccion: data.nivelEstudiosPaciente_nivel_est_pa || data.nivelEstudioPaciente_nivel_est_pa || data.nivelEstPa || "",
    essalud: data.essalud_chkessalud || false,
    eps: data.eps_chkeps || false,
    otro1: data.residenciaTrabajoOtros_chkotros || false,
    scrt: data.sctr_chksctr || false,
    otro2: data.sctrOtros_chkotros1 || false,
    alergias_si: data.alergias || false,
    asma_si: data.asma || false,
    bronquitis_si: data.bronquitis || false,
    quemaduras_si: data.quemaduras_chkquemaduras || false,
    cirugias_si: data.cirugias_chkcirugias || false,
    tbc_si: data.tbc || false,
    its_si: data.its_chkits || false,
    convulciones_si: data.convulsiones || false,
    neoplasia_si: data.neoplasia_chkneoplasia || false,
    intoxicaciones_si: data.intoxicaciones || false,
    hepatitis_si: data.hepatitis || false,
    tifoidea_si: data.tifoidea || false,
    hta_si: data.hta || false,
    diabetes_si: data.diabetes || false,
    otros_si: data.antecedentesPersonalesOtros_chkapotros || false,
    otros_descripcion: data.antecedentesPersonalesOtrosDescripcion_txtotrosantecendetes ?? "",
    // Hábitos nocivos
    alcohol_si: data.alcohol || false,
    alcohol_tipo: data.alcoholTipo || "",
    alcohol_cantidad_frecuencia: data.alcoholFrecuencia || "",
    tabaco_si: data.tabaco || false,
    tabaco_tipo: data.tabacoTipo || "",
    tabaco_cantidad_frecuencia: data.tabacoTipo || "", // En JSON tabacoTipo contiene "CIGARRILLOS X MES"
    drogas_si: data.drogas || false,
    drogas_tipo: data.drogasTipo || "",
    drogas_cantidad_frecuencia: data.drogasFrecuencia || "",
    medicamento_si: data.medicamentosSi_rbsimed || false,
    medicamento_tipo: data.tipoMedicamento_txttipomedicamento || "",
    medicamento_cantidad_frecuencia: data.frecuenciaMedicamentos_txtfrecuenciamed || "",
    // Antecedentes familiares
    padre_antecedentes: (data.padreAntecedentesPatologicos_padre_detall === null || data.padreAntecedentesPatologicos_padre_detall === undefined || data.padreAntecedentesPatologicos_padre_detall === "")
      ? ((data.padre_txtpadre === null || data.padre_txtpadre === undefined || data.padre_txtpadre === "") ? "" : data.padre_txtpadre)
      : data.padreAntecedentesPatologicos_padre_detall,
    madre_antecedentes: (data.madreAntecedentesPatologicos_madre_detall === null || data.madreAntecedentesPatologicos_madre_detall === undefined || data.madreAntecedentesPatologicos_madre_detall === "")
      ? ((data.madre_txtmadre === null || data.madre_txtmadre === undefined || data.madre_txtmadre === "") ? "" : data.madre_txtmadre)
      : data.madreAntecedentesPatologicos_madre_detall,
    hermanos_antecedentes: (data.hermanosAntecedentesPatologicos_hermanos_detall === null || data.hermanosAntecedentesPatologicos_hermanos_detall === undefined || data.hermanosAntecedentesPatologicos_hermanos_detall === "")
      ? ((data.hermanos_txthermanos === null || data.hermanos_txthermanos === undefined || data.hermanos_txthermanos === "") ? "" : data.hermanos_txthermanos)
      : data.hermanosAntecedentesPatologicos_hermanos_detall,
    esposo_antecedentes: (data.esposaAntecedentesPatologicos_espos_cony_detall === null || data.esposaAntecedentesPatologicos_espos_cony_detall === undefined || data.esposaAntecedentesPatologicos_espos_cony_detall === "")
      ? ((data.esposa_txtesposa === null || data.esposa_txtesposa === undefined || data.esposa_txtesposa === "") ? "" : data.esposa_txtesposa)
      : data.esposaAntecedentesPatologicos_espos_cony_detall,
    hijos_vivos: (data.hijosVivosAnexo2_txthijosvivos === null || data.hijosVivosAnexo2_txthijosvivos === undefined || data.hijosVivosAnexo2_txthijosvivos === "")
      ? ((data.hijasVivasAntecedentesPatologicos_txtdhijosvivos === null || data.hijasVivasAntecedentesPatologicos_txtdhijosvivos === undefined || data.hijasVivasAntecedentesPatologicos_txtdhijosvivos === "") ? "" : data.hijasVivasAntecedentesPatologicos_txtdhijosvivos)
      : data.hijosVivosAnexo2_txthijosvivos,
    numero_hijos: (data.totalHijos_txttotalhijos === null || data.totalHijos_txttotalhijos === undefined || data.totalHijos_txttotalhijos === "") ? "" : data.totalHijos_txttotalhijos,
    absentismo_enfermedades: (data.ausentes_txtausentes === null || data.ausentes_txtausentes === undefined || data.ausentes_txtausentes === "") ? "" : String(data.ausentes_txtausentes),
    // Enfermedades y accidentes - En JSON los accidentes están en array vacío []
    enfermedad_accidente_1: (data.accidentes && data.accidentes[0]?.enfermedad) || "",
    asociado_trabajo_1: (data.accidentes && data.accidentes[0] && (data.accidentes[0].asociadoTrabajo === "true" || data.accidentes[0].asociadoTrabajo === true)) || false,
    año_1: (data.accidentes && data.accidentes[0]?.anio) || (data.accidentes && data.accidentes[0]?.año) || "",
    dias_descanso_1: (data.accidentes && data.accidentes[0]?.diasDescanso)
      ? `${data.accidentes[0].diasDescanso} dias`
      : ((data.accidentes && data.accidentes[0]?.dias) ? `${data.accidentes[0].dias} dias` : ""),
    enfermedad_accidente_2: (data.accidentes && data.accidentes[1]?.enfermedad) || "",
    asociado_trabajo_2: (data.accidentes && data.accidentes[1] && (data.accidentes[1].asociadoTrabajo === "true" || data.accidentes[1].asociadoTrabajo === true)) || false,
    año_2: (data.accidentes && data.accidentes[1]?.anio) || (data.accidentes && data.accidentes[1]?.año) || "",
    dias_descanso_2: (data.accidentes && data.accidentes[1]?.diasDescanso)
      ? `${data.accidentes[1].diasDescanso} dias`
      : ((data.accidentes && data.accidentes[1]?.dias) ? `${data.accidentes[1].dias} dias` : ""),
    enfermedad_accidente_3: (data.accidentes && data.accidentes[2]?.enfermedad) || "",
    asociado_trabajo_3: (data.accidentes && data.accidentes[2] && (data.accidentes[2].asociadoTrabajo === "true" || data.accidentes[2].asociadoTrabajo === true)) || false,
    año_3: (data.accidentes && data.accidentes[2]?.anio) || (data.accidentes && data.accidentes[2]?.año) || "",
    dias_descanso_3: (data.accidentes && data.accidentes[2]?.diasDescanso)
      ? `${data.accidentes[2].diasDescanso} dias`
      : ((data.accidentes && data.accidentes[2]?.dias) ? `${data.accidentes[2].dias} dias` : ""),
    // Datos adicionales para header
    numeroFicha: String(data.norden_n_orden || ""),
    sede: data.sede || "",
    direccionPaciente: String(data.direccionPaciente_direccion_pa || ""),
    departamento: data.departamentoPaciente_departamento_pa || "",
    provincia: data.provinciaPaciente_provincia_pa || "",
    distrito: data.distritoPaciente_distrito_pa || "",
    // Datos de color
    color: data.color_color || "",
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || "",
    // Datos de vitales
    talla: (data.talla_talla === null || data.talla_talla === undefined || data.talla_talla === "") ? "" : data.talla_talla,
    peso: (data.peso_peso === null || data.peso_peso === undefined || data.peso_peso === "") ? "" : data.peso_peso,
    imc: (data.imc_imc === null || data.imc_imc === undefined || data.imc_imc === "") ? "" : data.imc_imc,
    pulso: (data.pulso_pulso === null || data.pulso_pulso === undefined || data.pulso_pulso === "")
      ? ((data.cintura_cintura === null || data.cintura_cintura === undefined || data.cintura_cintura === "") ? "" : data.cintura_cintura)
      : data.pulso_pulso,
    frecuenciaRespiratoria: (data.frespiratoria_f_respiratoria === null || data.frespiratoria_f_respiratoria === undefined || data.frespiratoria_f_respiratoria === "") ? "" : data.frespiratoria_f_respiratoria,
    frecuenciaCardiaca: (data.fcardiaca_f_cardiaca === null || data.fcardiaca_f_cardiaca === undefined || data.fcardiaca_f_cardiaca === "") ? "" : data.fcardiaca_f_cardiaca,
    presionArterialSistolica: (data.sistolica_sistolica === null || data.sistolica_sistolica === undefined || data.sistolica_sistolica === "") ? "" : data.sistolica_sistolica,
    presionArterialDiastolica: (data.diastolica_diastolica === null || data.diastolica_diastolica === undefined || data.diastolica_diastolica === "") ? "" : data.diastolica_diastolica,
    temperatura: (data.temperatura_temperatura === null || data.temperatura_temperatura === undefined || data.temperatura_temperatura === "") ? "" : data.temperatura_temperatura,
    // Datos de evaluación médica
    anamnesis: (data.anamnesis_txtanamnesis === null || data.anamnesis_txtanamnesis === undefined || data.anamnesis_txtanamnesis === "") ? "" : data.anamnesis_txtanamnesis,
    otrosExamenClinico: (data.sat02_sat_02 === null || data.sat02_sat_02 === undefined || data.sat02_sat_02 === "") ? "" : data.sat02_sat_02,
    ectoscopia: (data.ectoscopia_txtectoscopia === null || data.ectoscopia_txtectoscopia === undefined || data.ectoscopia_txtectoscopia === "") ? "" : data.ectoscopia_txtectoscopia,
    estadoMental: (data.estadoMental_txtestadomental === null || data.estadoMental_txtestadomental === undefined || data.estadoMental_txtestadomental === "") ? "" : data.estadoMental_txtestadomental,
    // Datos de examen físico
    piel: (data.piel_txtpiel === null || data.piel_txtpiel === undefined || data.piel_txtpiel === "") ? "" : data.piel_txtpiel,
    cabello: (data.cabeza_txtpelo === null || data.cabeza_txtpelo === undefined || data.cabeza_txtpelo === "") ? "" : data.cabeza_txtpelo,
    // Datos de examen de ojos
    visionCercaSinCorregirOd: (data.visionCercaSinCorregirOd_v_cerca_s_od === null || data.visionCercaSinCorregirOd_v_cerca_s_od === undefined || data.visionCercaSinCorregirOd_v_cerca_s_od === "") ? "" : data.visionCercaSinCorregirOd_v_cerca_s_od,
    visionCercaSinCorregirOi: (data.visionCercaSinCorregirOi_v_cerca_s_oi === null || data.visionCercaSinCorregirOi_v_cerca_s_oi === undefined || data.visionCercaSinCorregirOi_v_cerca_s_oi === "") ? "" : data.visionCercaSinCorregirOi_v_cerca_s_oi,
    visionLejosSinCorregirOd: (data.visionLejosSinCorregirOd_v_lejos_s_od === null || data.visionLejosSinCorregirOd_v_lejos_s_od === undefined || data.visionLejosSinCorregirOd_v_lejos_s_od === "") ? "" : data.visionLejosSinCorregirOd_v_lejos_s_od,
    visionLejosSinCorregirOi: (data.visionLejosSinCorregirOi_v_lejos_s_oi === null || data.visionLejosSinCorregirOi_v_lejos_s_oi === undefined || data.visionLejosSinCorregirOi_v_lejos_s_oi === "") ? "" : data.visionLejosSinCorregirOi_v_lejos_s_oi,
    visionCercaCorregidaOd: (data.visionCercaCorregidaOd_v_cerca_c_od === null || data.visionCercaCorregidaOd_v_cerca_c_od === undefined || data.visionCercaCorregidaOd_v_cerca_c_od === "") ? "" : data.visionCercaCorregidaOd_v_cerca_c_od,
    visionCercaCorregidaOi: (data.visionCercaCorregidaOi_v_cerca_c_oi === null || data.visionCercaCorregidaOi_v_cerca_c_oi === undefined || data.visionCercaCorregidaOi_v_cerca_c_oi === "") ? "" : data.visionCercaCorregidaOi_v_cerca_c_oi,
    visionLejosCorregidaOd: (data.visionLejosCorregidaOd_v_lejos_c_od === null || data.visionLejosCorregidaOd_v_lejos_c_od === undefined || data.visionLejosCorregidaOd_v_lejos_c_od === "") ? "" : data.visionLejosCorregidaOd_v_lejos_c_od,
    visionLejosCorregidaOi: (data.visionLejosCorregidaOi_v_lejos_c_oi === null || data.visionLejosCorregidaOi_v_lejos_c_oi === undefined || data.visionLejosCorregidaOi_v_lejos_c_oi === "") ? "" : data.visionLejosCorregidaOi_v_lejos_c_oi,
    visionColores: (data.visionColores_v_colores === null || data.visionColores_v_colores === undefined || data.visionColores_v_colores === "") ? "" : data.visionColores_v_colores,
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
    reflejosPupilares: (data.reflejosPupilares_r_pupilares === null || data.reflejosPupilares_r_pupilares === undefined || data.reflejosPupilares_r_pupilares === "") ? "" : data.reflejosPupilares_r_pupilares,
    // Datos de examen físico por sistemas
    oidos: (data.oidos_txtoidos === null || data.oidos_txtoidos === undefined || data.oidos_txtoidos === "") ? "" : data.oidos_txtoidos,
    nariz: (data.nariz_txtnariz === null || data.nariz_txtnariz === undefined || data.nariz_txtnariz === "") ? "" : data.nariz_txtnariz,
    boca: (data.boca_txtboca === null || data.boca_txtboca === undefined || data.boca_txtboca === "") ? "" : data.boca_txtboca,
    faringe: (data.faringe_txtfaringe === null || data.faringe_txtfaringe === undefined || data.faringe_txtfaringe === "") ? "" : data.faringe_txtfaringe,
    cuello: (data.cuello_txtcuello === null || data.cuello_txtcuello === undefined || data.cuello_txtcuello === "") ? "" : data.cuello_txtcuello,
    aparatoRespiratorio: (data.aparatoRespiratorio_txtaparatorespiratorio === null || data.aparatoRespiratorio_txtaparatorespiratorio === undefined || data.aparatoRespiratorio_txtaparatorespiratorio === "") ? "" : data.aparatoRespiratorio_txtaparatorespiratorio,
    aparatoCardiovascular: (data.aparatoCardiovascular_txtaparatocardiovascular === null || data.aparatoCardiovascular_txtaparatocardiovascular === undefined || data.aparatoCardiovascular_txtaparatocardiovascular === "") ? "" : data.aparatoCardiovascular_txtaparatocardiovascular,
    aparatoDigestivo: (data.aparatoDigestivo_txtaparatodigestivo === null || data.aparatoDigestivo_txtaparatodigestivo === undefined || data.aparatoDigestivo_txtaparatodigestivo === "") ? "" : data.aparatoDigestivo_txtaparatodigestivo,
    aparatoGenitourinario: (data.aparatoGeiotourinario_txtaparatogeiotourinario === null || data.aparatoGeiotourinario_txtaparatogeiotourinario === undefined || data.aparatoGeiotourinario_txtaparatogeiotourinario === "") ? "" : data.aparatoGeiotourinario_txtaparatogeiotourinario,
    aparatoLocomotor: (data.aparatoLocomotor_txtaparatolocomotor === null || data.aparatoLocomotor_txtaparatolocomotor === undefined || data.aparatoLocomotor_txtaparatolocomotor === "") ? "" : data.aparatoLocomotor_txtaparatolocomotor,
    sistemaLinfatico: (data.sistemaLinfatico_txtsistemalinfatico === null || data.sistemaLinfatico_txtsistemalinfatico === undefined || data.sistemaLinfatico_txtsistemalinfatico === "") ? "" : data.sistemaLinfatico_txtsistemalinfatico,
    marcha: (data.marcha_txtmarcha === null || data.marcha_txtmarcha === undefined || data.marcha_txtmarcha === "") ? "" : data.marcha_txtmarcha,
    columna: (data.columnaVertebral_txtcolumnavertebral === null || data.columnaVertebral_txtcolumnavertebral === undefined || data.columnaVertebral_txtcolumnavertebral === "") ? "" : data.columnaVertebral_txtcolumnavertebral,
    miembrosSuperiores: (data.miembrosSuperiores_txtmiembrossuperiores === null || data.miembrosSuperiores_txtmiembrossuperiores === undefined || data.miembrosSuperiores_txtmiembrossuperiores === "") ? "" : data.miembrosSuperiores_txtmiembrossuperiores,
    miembrosInferiores: (data.miembrosInferiores_txtmiembrosinferiores === null || data.miembrosInferiores_txtmiembrosinferiores === undefined || data.miembrosInferiores_txtmiembrosinferiores === "") ? "" : data.miembrosInferiores_txtmiembrosinferiores,
    sistemaNervioso: (data.sistemaNervioso_sistemanervioso === null || data.sistemaNervioso_sistemanervioso === undefined || data.sistemaNervioso_sistemanervioso === "") ? "" : data.sistemaNervioso_sistemanervioso,
    // Datos de conclusiones - Manejar null, undefined y strings vacíos
    conclusionesEvaluacionPsicologica: (data.recomendacionesInfoPsicologico_recomendaciones === null || data.recomendacionesInfoPsicologico_recomendaciones === undefined || data.recomendacionesInfoPsicologico_recomendaciones === "") ? "" : data.recomendacionesInfoPsicologico_recomendaciones,
    conclusionesRadiograficas: (data.conclusionesRadiograficas_txtconclusionesradiograficas === null || data.conclusionesRadiograficas_txtconclusionesradiograficas === undefined || data.conclusionesRadiograficas_txtconclusionesradiograficas === "") ? "" : data.conclusionesRadiograficas_txtconclusionesradiograficas,
    hallazgosPatologicosLaboratorio: (data.observacionesLabClinico_txtobservacioneslb === null || data.observacionesLabClinico_txtobservacioneslb === undefined || data.observacionesLabClinico_txtobservacioneslb === "") ? "" : data.observacionesLabClinico_txtobservacioneslb,
    conclusionAudiometria: (data.diagnosticoAudiometria_diagnostico === null || data.diagnosticoAudiometria_diagnostico === undefined || data.diagnosticoAudiometria_diagnostico === "") ? "" : data.diagnosticoAudiometria_diagnostico,
    conclusionEspirometria: (data.interpretacion_interpretacion === null || data.interpretacion_interpretacion === undefined || data.interpretacion_interpretacion === "")
      ? ((data.conclusion_txtconclusion === null || data.conclusion_txtconclusion === undefined || data.conclusion_txtconclusion === "") ? "" : data.conclusion_txtconclusion)
      : data.interpretacion_interpretacion,
    otros: dedupeText((data.otrosExamenes_txtotrosex === null || data.otrosExamenes_txtotrosex === undefined || data.otrosExamenes_txtotrosex === "") ? "" : data.otrosExamenes_txtotrosex),
    diagnosticoMedicoOcupacional: (data.observacionesFichaMedica_txtobservacionesfm === null || data.observacionesFichaMedica_txtobservacionesfm === undefined || data.observacionesFichaMedica_txtobservacionesfm === "") ? "" : data.observacionesFichaMedica_txtobservacionesfm,
    // Datos de conclusiones finales
    apto: data.esApto_apto_si === true || data.esApto_apto_si === "true",
    aptoConRestriccion: data.aptoRestriccion_apto_re === true || data.aptoRestriccion_apto_re === "true",
    noApto: data.noEsApto_apto_no === true || data.noEsApto_apto_no === "true",
    restricciones: (data.restricciones_txtrestricciones === null || data.restricciones_txtrestricciones === undefined || data.restricciones_txtrestricciones === "") ? "" : data.restricciones_txtrestricciones,
    fechaDesde: formatearFechaCorta(data.fechaDesde_fechadesde || ""),
    fechaHasta: formatearFechaCorta(data.fechaHasta_fechahasta || ""),
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Lista de antecedentes
  const antecedentes = [
    { name: 'Alergias', si: datosFinales.alergias_si },
    { name: 'Asma', si: datosFinales.asma_si },
    { name: 'Bronquitis', si: datosFinales.bronquitis_si },
    { name: 'Quemaduras', si: datosFinales.quemaduras_si },
    { name: 'Cirugias', si: datosFinales.cirugias_si },
    { name: 'TBC', si: datosFinales.tbc_si },
    { name: 'ITS', si: datosFinales.its_si },
    { name: 'Convulciones', si: datosFinales.convulciones_si },
    { name: 'Neoplasia', si: datosFinales.neoplasia_si },
    { name: 'Intoxicaciones', si: datosFinales.intoxicaciones_si },
    { name: 'Hepatitis', si: datosFinales.hepatitis_si },
    { name: 'Tifoidea', si: datosFinales.tifoidea_si },
    { name: 'HTA', si: datosFinales.hta_si },
    { name: 'Diabetes', si: datosFinales.diabetes_si },
    { name: 'Otros', si: datosFinales.otros_si }
  ];

  // Lista de hábitos nocivos
  const habitosNocivos = [
    { name: 'Alcohol', si: datosFinales.alcohol_si, tipo: datosFinales.alcohol_tipo, cantidad: datosFinales.alcohol_cantidad_frecuencia },
    { name: 'Tabaco', si: datosFinales.tabaco_si, tipo: datosFinales.tabaco_tipo, cantidad: datosFinales.tabaco_cantidad_frecuencia },
    { name: 'Drogas', si: datosFinales.drogas_si, tipo: datosFinales.drogas_tipo, cantidad: datosFinales.drogas_cantidad_frecuencia },
    { name: 'Medicamento', si: datosFinales.medicamento_si, tipo: datosFinales.medicamento_tipo, cantidad: datosFinales.medicamento_cantidad_frecuencia }
  ];

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (en todas las páginas)
    doc.setFont("helvetica", "bold").setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("ANEXO 02", pageW / 2, 32, { align: "center" });

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
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // Función para dibujar fila celeste con dos columnas y títulos centrados
  const dibujarFilaCelesteConColumnas = (tituloCol1, tituloCol2, yPos, alturaFila = 5) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;

    // Proporciones de columnas: Órgano más estrecha, Hallazgos más ancha
    const anchoColOrgano = 40; // Columna estrecha para Órgano o Sistema
    const anchoColHallazgos = tablaAncho - anchoColOrgano; // Resto para Hallazgos (140mm)
    const puntoDivision = tablaInicioX + anchoColOrgano;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo celeste
    doc.setFillColor(199, 241, 255);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFila, 'F');

    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila); // Línea izquierda
    doc.line(puntoDivision, yPos, puntoDivision, yPos + alturaFila); // División central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + alturaFila); // Línea inferior

    // Dibujar títulos de las columnas centrados
    doc.setFont("helvetica", "bold").setFontSize(8);
    // Centro de la primera columna (Órgano)
    const centroCol1 = tablaInicioX + anchoColOrgano / 2;
    // Centro de la segunda columna (Hallazgos)
    const centroCol2 = puntoDivision + anchoColHallazgos / 2;
    doc.text(tituloCol1, centroCol1, yPos + 3.5, { align: "center" });
    doc.text(tituloCol2, centroCol2, yPos + 3.5, { align: "center" });

    return { yPos: yPos + alturaFila, puntoDivision, anchoColHallazgos }; // Retorna la nueva posición Y y datos de columnas
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

  // Fila: Departamento, Provincia, Distrito (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
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

  // Nueva Fila: Reside en el lugar de trabajo | tiempo de residencia (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Nueva Fila: ESSALUD | X | EPS | X | OTRO | X | SCRT | X | OTRO | X | (5 columnas)
  const colWidth = 40;
  let colX = tablaInicioX;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 0; i < 4; i++) { // 4 divisiones internas para 5 columnas
    colX += colWidth;
    doc.line(colX, yPos, colX, yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Nueva Fila: Correo electrónico | Teléfono (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // División media
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Nueva Fila: Estado civil | N° total de hijos | N° Dependientes | Grado Instrucción (4 columnas)
  // Ajustado: N° total de hijos y N° Dependientes más estrechas, Grado Instrucción más ancho
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División 1: Estado civil (45mm)
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + filaAltura); // División 2: N° total de hijos (35mm - más estrecha)
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura); // División 3: N° Dependientes (35mm - más estrecha)
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Grado Instrucción (80mm - más ancha)
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
  doc.text(datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Departamento, Provincia, Distrito
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Departamento:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.departamento || "", tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Provincia:", tablaInicioX + 62, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.provincia || "", tablaInicioX + 80, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Distrito:", tablaInicioX + 122, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.distrito || "", tablaInicioX + 140, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1);
  yTexto += filaAltura;

  // Nueva: Reside en el lugar de trabajo | tiempo de residencia
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reside en el lugar de trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.resideEnLugarTrabajo || "", tablaInicioX + 45, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tiempo de residencia:", tablaInicioX + 102, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tiempoResidencia || "", tablaInicioX + 138, yTexto + 1);
  yTexto += filaAltura;

  // Nueva: ESSALUD | X | EPS | X | OTRO | X | SCRT | X | OTRO | X |
  const opcionesSeguro = [
    { label: 'ESSALUD', field: 'essalud' },
    { label: 'EPS', field: 'eps' },
    { label: 'OTRO', field: 'otro1' },
    { label: 'SCRT', field: 'scrt' },
    { label: 'OTRO', field: 'otro2' }
  ];
  let xCol = tablaInicioX;
  doc.setFont("helvetica", "bold").setFontSize(8);
  for (let i = 0; i < opcionesSeguro.length; i++) {
    const opcion = opcionesSeguro[i];
    doc.text(opcion.label + ':', xCol + 2, yTexto + 1);
    // Colocar X si está seleccionado
    if (datosFinales[opcion.field]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text('X', xCol + 25, yTexto + 1);
      doc.setFont("helvetica", "bold").setFontSize(8);
    }
    xCol += colWidth;
  }
  yTexto += filaAltura;

  // Nueva: Correo electrónico | Teléfono
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Correo electrónico:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.correoElectronico || "", tablaInicioX + 32, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Teléfono:", tablaInicioX + 102, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.telefono || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Nueva: Estado civil | N° total de hijos | N° Dependientes | Grado Instrucción
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado civil:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.estadoCivil || "", tablaInicioX + 21, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° total de hijos:", tablaInicioX + 52, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.numTotalHijos || "", tablaInicioX + 77, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° Dependientes:", tablaInicioX + 87, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.numDependientes || "", tablaInicioX + 113, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grado Instrucción:", tablaInicioX + 122, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.gradoInstruccion || "", tablaInicioX + 150, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN 2: DATOS DE LA EMPRESA ===
  yPos = dibujarHeaderSeccion("2. DATOS DE LA EMPRESA", yPos, filaAltura);
  yTexto = yPos + 2.5;

  // Fila: Empresa (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Fila: Contratista (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Fila: Actividad Económica (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido Actividad Económica
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Actividad Económica:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.actividadEconomica || "", tablaInicioX + 35, yTexto + 1);
  yTexto += filaAltura;

  // Fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN 3: ANTECEDENTES PATOLÓGICOS PERSONALES ===
  yPos = dibujarHeaderSeccion("3. ANTECEDENTES PATOLÓGICOS PERSONALES", yPos, filaAltura);

  // Configuración de columnas para la tabla de antecedentes
  const colAnteWidth = 49;
  const colSiNoWidth = 7;
  const groupWidth = 63;
  const verticalLinesAnte = [5, 54, 61, 68, 117, 124, 131, 180, 187, 205];

  // Fila de encabezado de columnas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // inferior
  verticalLinesAnte.forEach(x => {
    doc.line(x, yPos, x, yPos + filaAltura);
  });

  // Textos de encabezado centrados
  doc.setFont("helvetica", "bold").setFontSize(8);
  let currentX = tablaInicioX;
  for (let g = 0; g < 3; g++) {
    // Centrar "ANTECEDENTE" en la columna de nombre (ancho 49mm, centro en +24.5)
    doc.text("ANTECEDENTE", currentX + 24.5, yPos + 3.5, { align: "center" });
    // Centrar "SI" en su columna (ancho 7mm, centro en +3.5 desde inicio de columna)
    doc.text("SI", currentX + colAnteWidth + 3.5, yPos + 3, { align: "center" });
    // Centrar "NO" en su columna
    doc.text("NO", currentX + colAnteWidth + colSiNoWidth + 3.5, yPos + 3, { align: "center" });
    currentX += groupWidth;
  }
  yPos += filaAltura;

  // Filas de datos
  const numRows = 5;
  for (let row = 0; row < numRows; row++) {
    const startIdx = row * 3;

    // Líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    verticalLinesAnte.forEach(x => {
      doc.line(x, yPos, x, yPos + filaAltura);
    });

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    currentX = tablaInicioX;
    for (let g = 0; g < 3; g++) {
      const idx = startIdx + g;
      if (idx < antecedentes.length) {
        const ant = antecedentes[idx];
        doc.text(ant.name, currentX + 1, yPos + 3.5);
        const xSi = currentX + colAnteWidth + 3.5;
        const xNo = currentX + colAnteWidth + colSiNoWidth + 3.5;
        if (ant.si) {
          doc.setFont("helvetica", "bold").setFontSize(10);
          doc.text('X', xSi, yPos + 3.5, { align: "center" });
          doc.setFont("helvetica", "normal").setFontSize(8);
          if (ant.name === "Otros") {
            doc.setFont("helvetica", "normal").setFontSize(5);
            doc.text(datosFinales.otros_descripcion, xSi - 42, yPos + 2.5, { maxWidth: 37 });
            doc.setFont("helvetica", "normal").setFontSize(8);
          }
        } else {
          doc.setFont("helvetica", "bold").setFontSize(10);
          doc.text('X', xNo, yPos + 3, { align: "center" });
          doc.setFont("helvetica", "normal").setFontSize(8);
        }
      }
      currentX += groupWidth;
    }
    yPos += filaAltura;
  }

  // === FILA CELESTE: HÁBITOS NOCIVOS ===
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  // Dibujar líneas de la fila celeste
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de la fila celeste
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("HÁBITOS NOCIVOS", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Configuración de columnas para la tabla de hábitos
  const colHabNameWidth = 60;
  const colSiWidth = 8;
  const colNoWidth = 8;
  const colTipoWidth = 55;
  const colCantWidth = 59;
  const verticalLinesHab = [
    5, // left
    65, // after name
    73, // after Si
    81, // after No
    136, // after Tipo
    205 // right (tablaInicioX + tablaAncho = 5 + 200 = 205)
  ];

  // Fila de encabezado
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  verticalLinesHab.forEach(x => {
    doc.line(x, yPos, x, yPos + filaAltura);
  });

  // Textos de encabezado centrados
  doc.setFont("helvetica", "bold").setFontSize(8);
  // Centrar "HÁBITOS NOCIVOS" en columna name (ancho 60mm, centro 35)
  doc.text("HÁBITOS NOCIVOS", tablaInicioX + 35, yPos + 3.5, { align: "center" });
  // Centrar "SI"
  doc.text("SI", 69, yPos + 3.5, { align: "center" });
  // Centrar "NO"
  doc.text("NO", 77, yPos + 3.5, { align: "center" });
  // Centrar "TIPO" (ancho 55mm, centro 108.5)
  doc.text("TIPO", 108.5, yPos + 3.5, { align: "center" });
  // Centrar "CANTIDAD - FRECUENCIA" (ancho 59mm, centro 165.5)
  doc.text("CANTIDAD - FRECUENCIA", 165.5, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Filas de hábitos
  habitosNocivos.forEach((habito) => {
    // Calcular altura necesaria para el campo de cantidad/frecuencia (si tiene texto largo)
    let alturaNecesaria = filaAltura;
    const yTextoInicio = yPos + 3.5;
    const xInicioCantidad = 137; // Posición X donde comienza el texto de cantidad/frecuencia
    const anchoDisponibleCantidad = colCantWidth - 2; // Ancho disponible: ancho de columna menos márgenes
    
    // Calcular altura necesaria para cantidad usando splitTextToSize
    let lineasCantidad = [];
    const cantidadTexto = (habito.cantidad === null || habito.cantidad === undefined || habito.cantidad === "") ? "-" : habito.cantidad;
    if (cantidadTexto && cantidadTexto !== "-") {
      doc.setFont("helvetica", "normal").setFontSize(7);
      lineasCantidad = doc.splitTextToSize(cantidadTexto, anchoDisponibleCantidad);
      const alturaCantidad = Math.max(filaAltura, lineasCantidad.length * 2.8 + 2);
      alturaNecesaria = Math.max(alturaNecesaria, alturaCantidad);
    }
    
    // Dibujar líneas de la fila con altura dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaNecesaria, tablaInicioX + tablaAncho, yPos + alturaNecesaria);
    verticalLinesHab.forEach(x => {
      doc.line(x, yPos, x, yPos + alturaNecesaria);
    });

    // Contenido
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(habito.name, tablaInicioX + 1, yPos + 3.5);
    const xSi = 69;
    const xNo = 77;
    if (habito.si) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text('X', xSi, yPos + 3.5, { align: "center" });
    } else {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text('X', xNo, yPos + 3.5, { align: "center" });
    }
    doc.setFont("helvetica", "normal").setFontSize(7);
    const tipoTexto = (habito.tipo === null || habito.tipo === undefined || habito.tipo === "") ? "-" : habito.tipo;
    doc.text(tipoTexto, 82, yPos + 3.5);
    
    // Cantidad/Frecuencia con salto de línea si es necesario
    if (cantidadTexto && cantidadTexto !== "-" && lineasCantidad.length > 0) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      // Dibujar cada línea usando splitTextToSize
      lineasCantidad.forEach((linea, index) => {
        doc.text(linea, xInicioCantidad, yTextoInicio + (index * 2.8));
      });
    } else {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(cantidadTexto, xInicioCantidad, yPos + 3.5);
    }
    yPos += alturaNecesaria;
  });

  // === SECCIÓN 4: ANTECEDENTES PATOLÓGICOS FAMILIARES ===
  yPos = dibujarHeaderSeccion("4. ANTECEDENTES PATOLÓGICOS FAMILIARES", yPos, filaAltura);

  // Primera fila: Padre | Madre | Hermanos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Segunda fila: Espos(a) | N° de hijos vivos | N° Hijos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de la primera fila
  let yTextoFamilia = yPos - (filaAltura * 2) + 2.5;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Padre:", tablaInicioX + 2, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const padreTexto = (datosFinales.padre_antecedentes === null || datosFinales.padre_antecedentes === undefined || datosFinales.padre_antecedentes === "") ? "-" : datosFinales.padre_antecedentes;
  doc.text(padreTexto, tablaInicioX + 15, yTextoFamilia + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Madre:", tablaInicioX + 62, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const madreTexto = (datosFinales.madre_antecedentes === null || datosFinales.madre_antecedentes === undefined || datosFinales.madre_antecedentes === "") ? "-" : datosFinales.madre_antecedentes;
  doc.text(madreTexto, tablaInicioX + 75, yTextoFamilia + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hermanos:", tablaInicioX + 122, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const hermanosTexto = (datosFinales.hermanos_antecedentes === null || datosFinales.hermanos_antecedentes === undefined || datosFinales.hermanos_antecedentes === "") ? "-" : datosFinales.hermanos_antecedentes;
  doc.text(hermanosTexto, tablaInicioX + 140, yTextoFamilia + 1);
  yTextoFamilia += filaAltura;

  // Contenido de la segunda fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Espos(a):", tablaInicioX + 2, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const esposoTexto = (datosFinales.esposo_antecedentes === null || datosFinales.esposo_antecedentes === undefined || datosFinales.esposo_antecedentes === "") ? "-" : datosFinales.esposo_antecedentes;
  doc.text(esposoTexto, tablaInicioX + 20, yTextoFamilia + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° de hijos vivos:", tablaInicioX + 62, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const hijosVivosTexto = (datosFinales.hijos_vivos === null || datosFinales.hijos_vivos === undefined || datosFinales.hijos_vivos === "") ? "-" : datosFinales.hijos_vivos;
  doc.text(hijosVivosTexto, tablaInicioX + 90, yTextoFamilia + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° Hijos:", tablaInicioX + 122, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  const numeroHijosTexto = (datosFinales.numero_hijos === null || datosFinales.numero_hijos === undefined || datosFinales.numero_hijos === "") ? "-" : datosFinales.numero_hijos;
  doc.text(numeroHijosTexto, tablaInicioX + 140, yTextoFamilia + 1);
  yTextoFamilia += filaAltura;

  // === FILA CELESTE: ABSENTISMO ===
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  // Dibujar líneas de la fila celeste
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de la fila celeste
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Absentismo: Enfermedades y Accidentes (Asociados a trabajos o no)", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === TABLA DE ENFERMEDADES Y ACCIDENTES ===
  // Configuración de columnas ajustada para span
  const verticalLinesEnfermedad = [5, 85, 105, 125, 150, 205];

  // Header de la tabla (dos filas de altura)
  let yHeader1 = yPos;
  doc.line(tablaInicioX, yHeader1, tablaInicioX + tablaAncho, yHeader1); // top
  const verticalsHeader1 = [5, 85, 125, 150, 205];
  verticalsHeader1.forEach(x => doc.line(x, yHeader1, x, yHeader1 + filaAltura));

  let yHeader2 = yPos + filaAltura;
  // Línea horizontal solo debajo de "Asociado al Trabajo" (desde columna 85 hasta 125)
  doc.line(85, yHeader2, 125, yHeader2); // middle - solo para "Asociado al Trabajo"
  const verticalsHeader2 = [5, 85, 105, 125, 150, 205];
  verticalsHeader2.forEach(x => doc.line(x, yHeader2, x, yHeader2 + filaAltura));

  let yHeaderBottom = yPos + 2 * filaAltura;
  doc.line(tablaInicioX, yHeaderBottom, tablaInicioX + tablaAncho, yHeaderBottom); // bottom

  // Textos del header - primera fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  // Centrar "Asociado al Trabajo" en su columna (ancho 20mm, centro en 105)
  doc.text("Asociado al Trabajo", 105, yHeader1 + 3.5, { align: "center" });
  // Centrar "Año" en su columna (ancho 25mm, centro en 137.5) - misma altura que ENFERMEDAD. ACCIDENTE
  doc.text("Año", 137.5, yHeader2 + 1, { align: "center" });
  // Centrar "Días de descanso" en su columna (ancho 45mm, centro en 172.5) - misma altura que ENFERMEDAD. ACCIDENTE
  doc.text("Días de descanso", 172.5, yHeader2 + 1, { align: "center" });

  // Textos del header - segunda fila
  // Centrar "ENFERMEDAD. ACCIDENTE" en su columna (ancho 80mm, centro en 45) y justo encima de la línea horizontal
  doc.text("ENFERMEDAD. ACCIDENTE", 45, yHeader2 + 1, { align: "center" });
  // Centrar "SI" en su columna (ancho 10mm, centro en 95) y justo encima de la línea
  doc.text("Si", 95, yHeader2 + 3.5, { align: "center" });
  // Centrar "NO" en su columna (ancho 10mm, centro en 115) y justo encima de la línea
  doc.text("No", 115, yHeader2 + 3.5, { align: "center" });

  yPos += 2 * filaAltura;

  // Filas de datos (dinámico - usar directamente el array de accidentes)
  const enfermedadesAccidentes = (data.accidentes || []).map(accidente => {
    // Convertir asociadoTrabajo: "true" -> true, "false" -> false
    let asociado = false;
    if (accidente.asociadoTrabajo === "true" || accidente.asociadoTrabajo === true) {
      asociado = true;
    } else if (accidente.asociadoTrabajo === "false" || accidente.asociadoTrabajo === false) {
      asociado = false;
    }

    // Formatear días de descanso
    const diasDescanso = accidente.diasDescanso || accidente.dias || '';
    const diasFormateado = diasDescanso ? `${diasDescanso} dias` : '';

    return {
      enfermedad: accidente.enfermedad || '',
      asociado: asociado,
      año: accidente.anio || accidente.año || '',
      dias: diasFormateado
    };
  }).filter(item =>
    // Filtrar solo items que tengan al menos un dato
    item.enfermedad.trim() !== '' || item.año.trim() !== '' || item.dias.trim() !== ''
  );

  // Verificar si hay datos (al menos una enfermedad, año o días con contenido)
  const hayDatos = enfermedadesAccidentes.some(item =>
    item.enfermedad.trim() !== '' || item.año.trim() !== '' || item.dias.trim() !== ''
  );

  if (!hayDatos) {
    // Si no hay datos, mostrar mensaje "(No hay registros)" sin líneas divisorias internas
    // Dibujar solo el borde completo de la fila (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha

    doc.setFont("helvetica", "italic").setFontSize(8);
    doc.setTextColor(255, 0, 0); // Color rojo
    doc.text("(No hay registros)", tablaInicioX + tablaAncho / 2, yPos + 3.5, { align: "center" });
    doc.setTextColor(0, 0, 0); // Restaurar color negro
    yPos += filaAltura;
  } else {
    // Si hay datos, mostrar las filas normalmente (dinámico - todas las filas)
    enfermedadesAccidentes.forEach((item) => {
      // Líneas de la fila
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
      verticalLinesEnfermedad.forEach(x => {
        doc.line(x, yPos, x, yPos + filaAltura);
      });

      // Contenido de la fila
      doc.setFont("helvetica", "normal").setFontSize(7);
      dibujarTextoConSaltoLinea(item.enfermedad || '', tablaInicioX + 2, yPos + 3.5, 78);

      // Marcar SI o NO según el valor (true = SI, false = NO)
      if (item.asociado === true) {
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text('X', 95, yPos + 4, { align: "center" });
      } else {
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text('X', 115, yPos + 4, { align: "center" });
      }

      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(item.año || '', 137.5, yPos + 4, { align: "center" });
      doc.text(item.dias || '', 172.5, yPos + 4, { align: "center" });
      yPos += filaAltura;
    });
  }

  // === SECCIÓN 5: EVALUACIÓN MÉDICA ===
  yPos = dibujarHeaderSeccion("5. EVALUACIÓN MÉDICA", yPos, filaAltura);

  // === FILA CELESTE: ANAMNESIS ===
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  // Dibujar líneas de la fila celeste
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de la fila celeste
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ANAMNESIS", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === FILA DE ANAMNESIS ===
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(7);
  if (datosFinales.anamnesis) {
    const anamnesisMayusculas = String(datosFinales.anamnesis).toUpperCase();
    doc.text(anamnesisMayusculas, tablaInicioX + 2, yPos + 3.5);
  }
  yPos += filaAltura;

  // === FILA CELESTE: ÍNICO ===
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  // Dibujar líneas de la fila celeste
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de la fila celeste
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EXAMEN CLÍNICO", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === FILA DE VITALES (TALLA, PESO, IMC, etc.) ===
  // Configuración de columnas para vitales: 2 filas de 4 items cada una
  const colVitalWidth = 50; // 200mm / 4 columnas
  const verticalLinesVitales = [5, 55, 105, 155, 205]; // 4 divisiones para 4 columnas

  // Formatear presión arterial
  const presionArterial = datosFinales.presionArterialSistolica && datosFinales.presionArterialDiastolica
    ? `${datosFinales.presionArterialSistolica}/${datosFinales.presionArterialDiastolica}`
    : datosFinales.presionArterialSistolica || datosFinales.presionArterialDiastolica || '';

  const vitales = [
    {
      label: "Talla:",
      value: datosFinales.talla ? `${datosFinales.talla} cm` : ''
    },
    {
      label: "Peso:",
      value: datosFinales.peso ? `${datosFinales.peso} kg` : ''
    },
    {
      label: "IMC:",
      value: datosFinales.imc ? `${datosFinales.imc} kg/m²` : ''
    },
    {
      label: "P.:",
      value: datosFinales.pulso ? `${datosFinales.pulso} bpm` : ''
    },
    {
      label: "F.Resp.:",
      value: datosFinales.frecuenciaRespiratoria ? `${datosFinales.frecuenciaRespiratoria} rpm` : ''
    },
    {
      label: "F.Card.:",
      value: datosFinales.frecuenciaCardiaca ? `${datosFinales.frecuenciaCardiaca} lpm` : ''
    },
    {
      label: "PA:",
      value: presionArterial ? `${presionArterial} mmHg` : ''
    },
    {
      label: "Temperatura:",
      value: datosFinales.temperatura ? `${datosFinales.temperatura} °C` : ''
    }
  ];

  // Dividir vitales en dos grupos de 4
  const vitalesFila1 = vitales.slice(0, 4); // Primeros 4 items
  const vitalesFila2 = vitales.slice(4, 8); // Últimos 4 items

  // === PRIMERA FILA DE VITALES ===
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  verticalLinesVitales.forEach(x => {
    doc.line(x, yPos, x, yPos + filaAltura);
  });

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.setTextColor(0, 0, 0); // Color negro

  let xVital = tablaInicioX;
  vitalesFila1.forEach((vital) => {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.setTextColor(0, 0, 0); // Color negro en negrita
    doc.text(vital.label, xVital + 1, yPos + 3.5);

    // Valor en normal (sin negrita)
    if (vital.value) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.setTextColor(0, 0, 0); // Color negro
      // Calcular posición X para el valor (después de la etiqueta)
      const labelWidth = doc.getTextWidth(vital.label);
      doc.text(vital.value, xVital + labelWidth + 5, yPos + 3.5);
    }
    xVital += colVitalWidth;
  });
  yPos += filaAltura;

  // === SEGUNDA FILA DE VITALES ===
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  verticalLinesVitales.forEach(x => {
    doc.line(x, yPos, x, yPos + filaAltura);
  });

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.setTextColor(0, 0, 0); // Color negro

  xVital = tablaInicioX;
  vitalesFila2.forEach((vital) => {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.setTextColor(0, 0, 0); // Color negro en negrita
    doc.text(vital.label, xVital + 1, yPos + 3.5);

    // Valor en normal (sin negrita)
    if (vital.value) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.setTextColor(0, 0, 0); // Color negro
      // Calcular posición X para el valor (después de la etiqueta)
      const labelWidth = doc.getTextWidth(vital.label);
      doc.text(vital.value, xVital + labelWidth + 5, yPos + 3.5);
    }
    xVital += colVitalWidth;
  });
  yPos += filaAltura;

  // === FILA: OTROS ===
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Otros:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  if (datosFinales.otrosExamenClinico) {
    const otrosTexto = `SAT O2: ${datosFinales.otrosExamenClinico}`;
    const labelWidth = doc.getTextWidth("Otros:");
    doc.text(otrosTexto, tablaInicioX + labelWidth + 5, yPos + 3.5);
  }
  yPos += filaAltura;

  // === FILA: ECTOSCOPIA ===
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ectoscopia:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  if (datosFinales.ectoscopia) {
    const labelWidth = doc.getTextWidth("Ectoscopia:");
    doc.text(datosFinales.ectoscopia, tablaInicioX + labelWidth + 8, yPos + 3.5);
  }
  yPos += filaAltura;

  // === FILA: ESTADO MENTAL ===
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado mental:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  if (datosFinales.estadoMental) {
    const labelWidth = doc.getTextWidth("Estado mental:");
    doc.text(datosFinales.estadoMental, tablaInicioX + labelWidth + 8, yPos + 3.5);
  }
  yPos += filaAltura;

  // Verificar si necesitamos nueva página antes de continuar
  const alturaMaximaPag1 = doc.internal.pageSize.getHeight() - 25; // Margen inferior para footer

  if (yPos > alturaMaximaPag1) {
    // === FOOTER PÁGINA 1 ===
    footerTR(doc, { footerOffsetY: 8 });

    // === CREAR PÁGINA INTERMEDIA ===
    doc.addPage();
    numeroPagina++;
    drawHeader(numeroPagina);
    yPos = 35.5;
  } else {
    // === FOOTER PÁGINA 1 ===
    footerTR(doc, { footerOffsetY: 8 });

    // === CREAR PÁGINA 2 ===
    doc.addPage();
    numeroPagina = 2;
    yPos = 35.5; // Posición inicial de la nueva página

    // Dibujar header en la nueva página
    drawHeader(numeroPagina);
  }

  // === PÁGINA 2: EXAMEN FÍSICO ===
  // Fila gris: EXAMEN FISICO
  dibujarHeaderSeccion("EXAMEN FISICO", yPos, filaAltura);
  yPos += filaAltura;

  // === FILA CELESTE: HEADER DE COLUMNAS ===
  const resultadoFilaCeleste = dibujarFilaCelesteConColumnas("Órgano o Sistema", "Hallazgos", yPos, filaAltura);
  yPos = resultadoFilaCeleste.yPos;
  const puntoDivision = resultadoFilaCeleste.puntoDivision;
  const anchoColHallazgos = resultadoFilaCeleste.anchoColHallazgos;
  const anchoColOrgano = puntoDivision - tablaInicioX;

  // === FILA: PIEL ===
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(puntoDivision, yPos, puntoDivision, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Piel:", tablaInicioX + 2, yPos + 3.5);

  // Mostrar datos o guion si no hay datos
  const textoPiel = datosFinales.piel || "-";
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(textoPiel, puntoDivision + 2, yPos + 3.5);

  yPos += filaAltura;

  // === FILA: CABELLO ===
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(puntoDivision, yPos, puntoDivision, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cabello:", tablaInicioX + 2, yPos + 3.5);

  // Mostrar datos o guion si no hay datos
  const textoCabello = datosFinales.cabello || "-";
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(textoCabello, puntoDivision + 2, yPos + 3.5);

  yPos += filaAltura;

  // === SECCIÓN OJOS ===
  // Fila gris: OJOS
  doc.setFillColor(173, 216, 230); // Color gris (igual que otras secciones)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ojos", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === TABLA DE AGUDEZA VISUAL ===
  const filaAlturaAgudeza = 4.5;
  const colAgudezaAncho = 30; // AGUDEZA VISUAL
  const colSinCorregirAncho = 30; // SIN CORREGIR
  const colCorregidaAncho = 30; // CORREGIDA
  const colObservacionesAncho = 110; // ENFERMEDADES OCULARES (ajustado para tablaAncho 200)

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
  const textoEnfermedadesRaw = datosFinales.enfermedadesOculares || "";
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
  const maxWidth = colObservacionesAncho - 4; // Ancho disponible menos margen
  const lineHeight = 3; // Interlineado
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
  const odSinCorregir = datosFinales.visionCercaSinCorregirOd || "";
  const oiSinCorregir = datosFinales.visionCercaSinCorregirOi || "";
  const anchoOdSinCorregir = doc.getTextWidth(odSinCorregir);
  const anchoOiSinCorregir = doc.getTextWidth(oiSinCorregir);
  doc.text(odSinCorregir, xSinCorregir + (colSinCorregirAncho / 2 - anchoOdSinCorregir) / 2, yPos + 3.5);
  doc.text(oiSinCorregir, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOiSinCorregir) / 2, yPos + 3.5);

  // Centrar datos O.D y O.I en CORREGIDA
  const odCorregida = datosFinales.visionCercaCorregidaOd || "";
  const oiCorregida = datosFinales.visionCercaCorregidaOi || "";
  const anchoOdCorregida = doc.getTextWidth(odCorregida);
  const anchoOiCorregida = doc.getTextWidth(oiCorregida);
  doc.text(odCorregida, xCorregida + (colCorregidaAncho / 2 - anchoOdCorregida) / 2, yPos + 3.5);
  doc.text(oiCorregida, mitadCorregida + (colCorregidaAncho / 2 - anchoOiCorregida) / 2, yPos + 3.5);

  // Mostrar las primeras líneas del texto de enfermedades oculares en esta fila
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
  const odLejosSinCorregir = datosFinales.visionLejosSinCorregirOd || "";
  const oiLejosSinCorregir = datosFinales.visionLejosSinCorregirOi || "";
  const anchoOdLejosSinCorregir = doc.getTextWidth(odLejosSinCorregir);
  const anchoOiLejosSinCorregir = doc.getTextWidth(oiLejosSinCorregir);
  doc.text(odLejosSinCorregir, xSinCorregir + (colSinCorregirAncho / 2 - anchoOdLejosSinCorregir) / 2, yPos + 3.5);
  doc.text(oiLejosSinCorregir, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOiLejosSinCorregir) / 2, yPos + 3.5);

  // Centrar datos O.D y O.I en CORREGIDA
  const odLejosCorregida = datosFinales.visionLejosCorregidaOd || "";
  const oiLejosCorregida = datosFinales.visionLejosCorregidaOi || "";
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

  // === FILA: REFLEJOS PUPILARES Y VISIÓN DE COLORES ===
  // Columna de Reflejos Pupilares más estrecha
  const anchoColReflejos = 60; // Columna estrecha
  const anchoColVision = tablaAncho - anchoColReflejos; // Resto para Visión de colores
  const puntoDivisionReflejos = tablaInicioX + anchoColReflejos;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(puntoDivisionReflejos, yPos, puntoDivisionReflejos, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de Reflejos Pupilares
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reflejos Pupilares:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.reflejosPupilares || "").toString().toUpperCase(), tablaInicioX + 35, yPos + 3.5);

  // Contenido de Visión de Colores
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de colores:", puntoDivisionReflejos + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.visionColores || "").toString().toUpperCase(), puntoDivisionReflejos + 35, yPos + 3.5);

  yPos += filaAltura;

  // === FILA CELESTE: HEADER DE COLUMNAS (EXAMEN FÍSICO POR SISTEMAS) ===
  const resultadoFilaCelesteSistemas = dibujarFilaCelesteConColumnas("Órgano o Sistema", "Hallazgos", yPos, filaAltura);
  yPos = resultadoFilaCelesteSistemas.yPos;
  const puntoDivisionSistemas = resultadoFilaCelesteSistemas.puntoDivision;
  const anchoColHallazgosSistemas = resultadoFilaCelesteSistemas.anchoColHallazgos;

  // === FILAS DE EXAMEN FÍSICO POR SISTEMAS ===
  const sistemasExamen = [
    { label: "Oídos", data: datosFinales.oidos },
    { label: "Nariz", data: datosFinales.nariz },
    { label: "Boca", data: datosFinales.boca },
    { label: "Faringe", data: datosFinales.faringe },
    { label: "Cuello", data: datosFinales.cuello },
    { label: "Ap. Respiratorio", data: datosFinales.aparatoRespiratorio },
    { label: "Ap. Cardiovascular", data: datosFinales.aparatoCardiovascular },
    { label: "Ap. Digestivo", data: datosFinales.aparatoDigestivo },
    { label: "Ap. Genitourinario", data: datosFinales.aparatoGenitourinario },
    { label: "Ap. Locomotor", data: datosFinales.aparatoLocomotor },
    { label: "Sistema Linfático", data: datosFinales.sistemaLinfatico },
    { label: "Marcha", data: datosFinales.marcha },
    { label: "Columna", data: datosFinales.columna },
    { label: "M. Inferiores", data: datosFinales.miembrosInferiores },
    { label: "M. Superiores", data: datosFinales.miembrosSuperiores },
    { label: "Sistema Nervioso", data: datosFinales.sistemaNervioso },
  ];

  sistemasExamen.forEach((sistema) => {
    let yInicioFila = yPos;

    // Dibujar línea superior
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // Dibujar etiqueta
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(`${sistema.label}:`, tablaInicioX + 2, yPos + 3.5);

    // Renderizar texto de hallazgos con altura dinámica
    const textoHallazgo = sistema.data || "-";
    doc.setFont("helvetica", "normal").setFontSize(7); // Tamaño de fuente 7 para datos

    // Calcular posición Y inicial para el texto (desde donde empieza el texto)
    const yInicioTexto = yPos + 2.5;
    const yFinalTexto = dibujarTextoConSaltoLinea(textoHallazgo, puntoDivisionSistemas + 2, yInicioTexto, anchoColHallazgosSistemas - 4);

    // Calcular altura de fila dinámica
    // Altura mínima: 15mm, pero crece según el contenido
    // Sumamos un pequeño margen inferior para que el texto no quede pegado
    const alturaTexto = yFinalTexto - yInicioTexto;
    const alturaFila = Math.max(7, alturaTexto + 2);
    yPos = yInicioFila + alturaFila;

    // Dibujar todas las líneas verticales y línea inferior con la altura correcta
    doc.line(tablaInicioX, yInicioFila, tablaInicioX, yPos); // Línea izquierda
    doc.line(puntoDivisionSistemas, yInicioFila, puntoDivisionSistemas, yPos); // División central
    doc.line(tablaInicioX + tablaAncho, yInicioFila, tablaInicioX + tablaAncho, yPos); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea inferior
  });

  // === SECCIÓN VI: CONCLUSIÓN DE EVALUACIÓN PSICOLÓGICA ===
  yPos = dibujarHeaderSeccion("6. CONCLUSIÓN DE EVALUACIÓN PSICOLÓGICA", yPos, filaAltura);

  // Fila de datos dinámica creciente
  const textoConclusionesPsicologicas = (datosFinales.conclusionesEvaluacionPsicologica || "").toString();
  const datosConclusionesPsicologicas = textoConclusionesPsicologicas ? textoConclusionesPsicologicas.toUpperCase() : "-";
  const anchoDisponibleConclusionesPsicologicas = tablaAncho - 4;
  doc.setFont("helvetica", "normal").setFontSize(8);
  const lineasConclusionesPsicologicas = doc.splitTextToSize(datosConclusionesPsicologicas, anchoDisponibleConclusionesPsicologicas);
  const interlineadoConclusiones = 3;
  const alturaDinamicaConclusionesPsicologicas = Math.max(8, lineasConclusionesPsicologicas.length * interlineadoConclusiones + 4);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaConclusionesPsicologicas);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusionesPsicologicas);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaConclusionesPsicologicas, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusionesPsicologicas);

  // Contenido (font size 7)
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasConclusionesPsicologicas.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoConclusiones));
  });
  yPos += alturaDinamicaConclusionesPsicologicas;

  // === SECCIÓN VII Y VIII: DOS COLUMNAS ===
  // Estructura de dos columnas
  const anchoCol = tablaAncho / 2;
  const puntoDivisionCols = tablaInicioX + anchoCol;

  // Preparar datos
  const textoConclusionesRadiograficas = (datosFinales.conclusionesRadiograficas || "").toString();
  const textoHallazgosLaboratorio = (datosFinales.hallazgosPatologicosLaboratorio || "").toString();

  // Convertir a mayúsculas y manejar vacíos
  const datosCol1 = textoConclusionesRadiograficas ? textoConclusionesRadiograficas.toUpperCase() : "-";
  const datosCol2 = textoHallazgosLaboratorio ? textoHallazgosLaboratorio.toUpperCase() : "-";

  // Calcular altura dinámica para cada columna
  const anchoDisponibleCol = anchoCol - 4;
  doc.setFont("helvetica", "normal").setFontSize(8);
  const lineasCol1 = doc.splitTextToSize(datosCol1, anchoDisponibleCol);
  const lineasCol2 = doc.splitTextToSize(datosCol2, anchoDisponibleCol);
  const maxLineas = Math.max(lineasCol1.length, lineasCol2.length);
  const alturaDinamica = Math.max(8, maxLineas * interlineadoConclusiones + 4);

  const yPosInicial = yPos;

  // Dibujar headers de sección (filas grises)
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, anchoCol, filaAltura, 'F');
  doc.rect(puntoDivisionCols, yPos, anchoCol, filaAltura, 'F');

  // Líneas de los headers
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(puntoDivisionCols, yPos, puntoDivisionCols, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Textos de headers
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("7. CONCLUSIONES RADIOGRÁFICAS", tablaInicioX + 2, yPos + 3.5);
  doc.text("8. HALLAZGOS PATOLÓGICOS DE LABORATORIO", puntoDivisionCols + 2, yPos + 3.5);
  yPos += filaAltura;

  // Dibujar líneas de contenido
  doc.line(tablaInicioX, yPosInicial, tablaInicioX, yPosInicial + filaAltura + alturaDinamica);
  doc.line(puntoDivisionCols, yPosInicial, puntoDivisionCols, yPosInicial + filaAltura + alturaDinamica);
  doc.line(tablaInicioX + tablaAncho, yPosInicial, tablaInicioX + tablaAncho, yPosInicial + filaAltura + alturaDinamica);
  doc.line(tablaInicioX, yPosInicial + filaAltura + alturaDinamica, tablaInicioX + tablaAncho, yPosInicial + filaAltura + alturaDinamica);

  // Contenido (font size 7)
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasCol1.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoConclusiones));
  });
  lineasCol2.forEach((linea, index) => {
    doc.text(linea, puntoDivisionCols + 2, yPos + 3.5 + (index * interlineadoConclusiones));
  });
  yPos = yPosInicial + filaAltura + alturaDinamica;

  // === FOOTER PÁGINA 2 ===
  footerTR(doc, { footerOffsetY: 8 });

  // === CREAR PÁGINA 3 ===
  doc.addPage();
  numeroPagina = 3;
  yPos = 35.5; // Posición inicial de la nueva página

  // Dibujar header en la nueva página
  drawHeader(numeroPagina);

  // === SECCIÓN IX Y X: DOS COLUMNAS ===
  // Estructura de dos columnas
  const anchoColPag3 = tablaAncho / 2;
  const puntoDivisionColsPag3 = tablaInicioX + anchoColPag3;

  // Preparar datos
  const textoAudiometria = (datosFinales.conclusionAudiometria || "").toString();
  const textoEspirometria = (datosFinales.conclusionEspirometria || "").toString();

  // Convertir a mayúsculas y manejar vacíos
  const datosAudiometria = textoAudiometria ? textoAudiometria.toUpperCase() : "-";
  const datosEspirometria = textoEspirometria ? textoEspirometria.toUpperCase() : "-";

  // Calcular altura dinámica para cada columna
  const anchoDisponibleColPag3 = anchoColPag3 - 4;
  doc.setFont("helvetica", "normal").setFontSize(8);
  const lineasAudiometria = doc.splitTextToSize(datosAudiometria, anchoDisponibleColPag3);
  const lineasEspirometria = doc.splitTextToSize(datosEspirometria, anchoDisponibleColPag3);
  const maxLineas2 = Math.max(lineasAudiometria.length, lineasEspirometria.length);
  const alturaDinamica2 = Math.max(8, maxLineas2 * interlineadoConclusiones + 4);

  const yPosInicial2 = yPos;

  // Dibujar headers de sección (filas grises)
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, anchoColPag3, filaAltura, 'F');
  doc.rect(puntoDivisionColsPag3, yPos, anchoColPag3, filaAltura, 'F');

  // Líneas de los headers
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(puntoDivisionColsPag3, yPos, puntoDivisionColsPag3, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Textos de headers
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("9. CONCLUSIÓN AUDIOMETRÍA", tablaInicioX + 2, yPos + 3.5);
  doc.text("10. CONCLUSIÓN DE ESPIROMETRÍA", puntoDivisionColsPag3 + 2, yPos + 3.5);
  yPos += filaAltura;

  // Dibujar líneas de contenido
  doc.line(tablaInicioX, yPosInicial2, tablaInicioX, yPosInicial2 + filaAltura + alturaDinamica2);
  doc.line(puntoDivisionColsPag3, yPosInicial2, puntoDivisionColsPag3, yPosInicial2 + filaAltura + alturaDinamica2);
  doc.line(tablaInicioX + tablaAncho, yPosInicial2, tablaInicioX + tablaAncho, yPosInicial2 + filaAltura + alturaDinamica2);
  doc.line(tablaInicioX, yPosInicial2 + filaAltura + alturaDinamica2, tablaInicioX + tablaAncho, yPosInicial2 + filaAltura + alturaDinamica2);

  // Contenido (font size 7)
  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasAudiometria.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoConclusiones));
  });
  lineasEspirometria.forEach((linea, index) => {
    doc.text(linea, puntoDivisionColsPag3 + 2, yPos + 3.5 + (index * interlineadoConclusiones));
  });
  yPos = yPosInicial2 + filaAltura + alturaDinamica2;

  // === PÁGINA 3: SECCIÓN XI: OTROS ===
  const textoOtros = (datosFinales.otros || "").toString();
  const datosOtros = textoOtros ? textoOtros.toUpperCase() : "-";

  yPos = dibujarHeaderSeccion("11. OTROS", yPos, filaAltura);

  const anchoDisponibleOtros = tablaAncho - 4;
  const lineasOtros = doc.splitTextToSize(datosOtros, anchoDisponibleOtros);
  const alturaDinamicaOtros = Math.max(40, lineasOtros.length * interlineadoConclusiones + 4);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaOtros);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtros);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaOtros, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtros);

  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasOtros.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoConclusiones));
  });
  yPos += alturaDinamicaOtros;

  // === SECCIÓN XII: DIAGNÓSTICO MÉDICO OCUPACIONAL Y RECOMENDACIONES ===
  const textoDiagnostico = (datosFinales.diagnosticoMedicoOcupacional || "").toString();
  const datosDiagnostico = textoDiagnostico ? textoDiagnostico.toUpperCase() : "-";

  yPos = dibujarHeaderSeccion("12. DIAGNÓSTICO MÉDICO OCUPACIONAL Y RECOMENDACIONES", yPos, filaAltura);

  const anchoDisponibleDiagnostico = tablaAncho - 4;
  const lineasDiagnostico = doc.splitTextToSize(datosDiagnostico, anchoDisponibleDiagnostico);
  const alturaDinamicaDiagnostico = Math.max(40, lineasDiagnostico.length * interlineadoConclusiones + 4);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaDiagnostico);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaDiagnostico);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaDiagnostico, tablaInicioX + tablaAncho, yPos + alturaDinamicaDiagnostico);

  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasDiagnostico.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoConclusiones));
  });
  yPos += alturaDinamicaDiagnostico;

  // === SECCIÓN XIII: CONCLUSIONES ===
  yPos = dibujarHeaderSeccion("13. CONCLUSIONES", yPos, filaAltura);

  // Fila con Apto | X | Apto con restricción | X | No apto | X
  // Distribución: 3 columnas de texto de ~53mm cada una, 3 columnas de checkbox de ~13mm cada una
  // Total: 53*3 + 13*3 = 159 + 39 = 198mm (ajustado a 200mm)
  const colConclusWidth = 53; // Ancho de cada columna de texto
  const colCheckWidth = 13; // Ancho de cada columna de checkbox
  const verticalLinesConclus = [
    tablaInicioX, // inicio
    tablaInicioX + colConclusWidth, // después de "Apto"
    tablaInicioX + colConclusWidth + colCheckWidth, // después de X
    tablaInicioX + colConclusWidth + colCheckWidth + colConclusWidth, // después de "Apto con restricción"
    tablaInicioX + colConclusWidth + colCheckWidth + colConclusWidth + colCheckWidth, // después de X
    tablaInicioX + colConclusWidth + colCheckWidth + colConclusWidth + colCheckWidth + colConclusWidth, // después de "No apto"
    tablaInicioX + tablaAncho // final
  ];

  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  verticalLinesConclus.forEach(x => {
    doc.line(x, yPos, x, yPos + filaAltura);
  });

  // Contenido de la fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO", tablaInicioX + 2, yPos + 3.5);
  if (datosFinales.apto) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text('X', tablaInicioX + colConclusWidth + colCheckWidth / 2, yPos + 3.5, { align: "center" });
  }

  // Apto con restricción
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO CON RESTRICCIÓN", tablaInicioX + colConclusWidth + colCheckWidth + 2, yPos + 3.5);
  if (datosFinales.aptoConRestriccion) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text('X', tablaInicioX + colConclusWidth + colCheckWidth + colConclusWidth + colCheckWidth / 2, yPos + 3.5, { align: "center" });
  }

  // No apto
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO APTO", tablaInicioX + colConclusWidth + colCheckWidth + colConclusWidth + colCheckWidth + 2, yPos + 3.5);
  if (datosFinales.noApto) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text('X', tablaInicioX + colConclusWidth + colCheckWidth + colConclusWidth + colCheckWidth + colConclusWidth + colCheckWidth / 2, yPos + 3.5, { align: "center" });
  }

  yPos += filaAltura;

  // === FILA: FECHA DESDE | FECHA HASTA ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha desde:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.fechaDesde || "", tablaInicioX + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha hasta:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.fechaHasta || "", tablaInicioX + 125, yPos + 3.5);

  yPos += filaAltura;

  // === FILA GRIS: RESTRICCIONES ===
  yPos = dibujarHeaderSeccion("14. RESTRICCIONES", yPos, filaAltura);

  // Fila dinámica para restricciones
  const textoRestricciones = (datosFinales.restricciones || "").toString();
  
  // Preservar símbolos especiales como ≥, ≤, etc. antes de convertir a mayúsculas
  // Reemplazar temporalmente los símbolos, convertir a mayúsculas, y luego restaurarlos
  const simbolosEspeciales = [
    { original: '≥', temporal: '___MAYOR_IGUAL___' },
    { original: '≤', temporal: '___MENOR_IGUAL___' },
    { original: '≠', temporal: '___DIFERENTE___' },
    { original: '±', temporal: '___MAS_MENOS___' }
  ];
  
  let textoProcesado = textoRestricciones;
  // Guardar los símbolos originales
  simbolosEspeciales.forEach(simbolo => {
    textoProcesado = textoProcesado.replace(new RegExp(simbolo.original, 'g'), simbolo.temporal);
  });
  
  // Convertir a mayúsculas
  const datosRestricciones = textoProcesado ? textoProcesado.toUpperCase() : "-";
  
  // Restaurar los símbolos originales
  let datosFinalesRestricciones = datosRestricciones;
  simbolosEspeciales.forEach(simbolo => {
    datosFinalesRestricciones = datosFinalesRestricciones.replace(new RegExp(simbolo.temporal, 'g'), simbolo.original);
  });
  
  // Si jsPDF no renderiza bien "≥", reemplazarlo por ">=" para mejor compatibilidad
  // Comentar esta línea si el símbolo se renderiza correctamente
  datosFinalesRestricciones = datosFinalesRestricciones.replace(/≥/g, '>=');

  const anchoDisponibleRestricciones = tablaAncho - 4;
  const lineasRestricciones = doc.splitTextToSize(datosFinalesRestricciones, anchoDisponibleRestricciones);
  const alturaDinamicaRestricciones = Math.max(20, lineasRestricciones.length * interlineadoConclusiones + 4);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaRestricciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaRestricciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaRestricciones, tablaInicioX + tablaAncho, yPos + alturaDinamicaRestricciones);

  doc.setFont("helvetica", "normal").setFontSize(7);
  lineasRestricciones.forEach((linea, index) => {
    doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (index * interlineadoConclusiones));
  });
  yPos += alturaDinamicaRestricciones;

  // Verificar si necesitamos espacio para las firmas
  const alturaMaximaPag3 = doc.internal.pageSize.getHeight() - 25; // Margen inferior para footer
  if (yPos > alturaMaximaPag3 - 30) {
    // No hay espacio suficiente, crear nueva página
    footerTR(doc, { footerOffsetY: 8 });
    doc.addPage();
    numeroPagina++;
    drawHeader(numeroPagina);
    yPos = 35.5;
  }

  // === SECCIÓN DE FIRMAS ===
  const alturaSeccionFirmas = 30;
  const anchoColumnaFirmas = tablaAncho / 2; // Cada columna tiene 100mm (200mm / 2)

  // Dibujar las líneas de la sección de firmas (2 columnas iguales)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + anchoColumnaFirmas, yPos, tablaInicioX + anchoColumnaFirmas, yPos + alturaSeccionFirmas); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaSeccionFirmas, tablaInicioX + tablaAncho, yPos + alturaSeccionFirmas); // Línea inferior

  // === COLUMNA 1: FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yPos + 3;

  // Calcular centro de la columna 1 para centrar las imágenes
  const centroColumna1X = tablaInicioX + (anchoColumnaFirmas / 2); // Centro de la columna 1

  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = getSign(data, "FIRMAP");
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroColumna1X - 20;
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
      const x = centroColumna1X + 8;
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma y Huella del trabajador", centroColumna1X, yPos + 26, { align: "center" });

  // === COLUMNA 2: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoY = yPos + 3;

  // Calcular centro de la columna 2
  const centroColumna2X = tablaInicioX + anchoColumnaFirmas + (anchoColumnaFirmas / 2); // Centro de la columna 2

  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = centroColumna2X - 22.5; // Centrar la imagen (45mm / 2)
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sello y Firma del Médico", centroColumna2X, yPos + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna2X, yPos + 28.5, { align: "center" });

  // === FOOTER PÁGINA 3 ===
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