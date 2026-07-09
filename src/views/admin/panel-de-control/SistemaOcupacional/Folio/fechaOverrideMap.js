import { addDays, addYears, format, parse } from "date-fns";

// Mapa tabla -> nombres de campo de fecha usados por cada reporte del folio.
// Generado a partir de los componentes en src/views/jaspers (ver reportesMap.js).
// fechaField / vencimientoField / extraFechaFields admiten rutas con punto para
// campos anidados (ej: "antecedentes.fechaAntecedente"). extraFechaFields son
// campos adicionales que también deben quedar en la fecha personalizada (no en
// el vencimiento), por ejemplo pares "fecha desde" que usan otros reportes.
export const TABLA_FECHA_MAP = {
    "CONSENT_INFORMADO_MEDICA": { fechaField: "fechaRegistro", vencimientoField: null }, // CONSENTIMIENTO INFORMADO DE EVALUACION MEDICA
    "CONSENT_SINTOMATICO": { fechaField: "fechaRegistro", vencimientoField: null }, // DECLARACION DE SINTOMATICO RESPIRATORIO
    "DECLA_INFO_APTITUD_MO": { fechaField: "fechaRegistro", vencimientoField: null }, // DECLARACIÓN JURADA DE INFORMACION APTITUD MEDICO OCUPACIONAL
    "DECLA_JURA_ANTECE_PERSON_FAM": { fechaField: "fechaRegistro", vencimientoField: null, extraFechaFields: ["fechaFirma"] }, // DECLARACION JURADA DE ANTECEDENTES PATOLOGICOS Y FAMILIARES
    "ac_bioquimica2022": { fechaField: "fecha", vencimientoField: null }, // ACIDO URICO
    "ac_coprocultivo": { fechaField: "fecha", vencimientoField: null }, // MANIPULADORES COPROCULTIVO
    "ac_coproparasitologico": { fechaField: "fecha", vencimientoField: null }, // MANIPULADORES PARASITOLOGIA
    "alto_riesgo": { fechaField: "fechaRegistro", vencimientoField: null }, // ALTO RIESGO
    "analisis_bioquimicos": { fechaField: "fecha", vencimientoField: null }, // ANALISIS BIOQUIMICOS - PERFIL LIPIDICO
    "analisis_bioquimicos_glucosa_basal": { fechaField: "fecha", vencimientoField: null }, // ANALISIS BIOQUIMICOS - GLUCOSA BASAL
    "anexo16a": { fechaField: "fechaAnexo16a_fecha_anexo", vencimientoField: null }, // ANEXO 16A
    "anexo7c": { fechaField: "fechaAnexo7c_fecha", vencimientoField: null }, // ANEXO 16
    "anexo_agroindustrial": { fechaField: "fechaAnexo_fecha", vencimientoField: "fechaHasta_fechahasta", extraFechaFields: ["fechaDesde_fechadesde"] }, // ANEXO 02
    "antece_enfermedades_altura": { fechaField: "antecedentes.fechaAntecedente", vencimientoField: null }, // ENFERMEDADES EN ALTURA
    "antecedentes_patologicos": { fechaField: "fechaAntecedentesPatologicos_fecha_ap", vencimientoField: null }, // ANTECEDENTES PATOLOGICOS
    "aptitud_altura_poderosa": { fechaField: "fechaExamen", vencimientoField: "fechaHasta" }, // CERTIFICADO APTITUD ALTURA PODEROSA
    "aptitud_licencia_conduciri": { fechaField: "fechaExamen", vencimientoField: "fechaHasta" }, // LICENCIA PARA CONDUCIR INTERNA PODEROSA
    "aptitud_medico_ocupacional_agro": { fechaField: "fechaDesde", vencimientoField: "fechaHasta" }, // CERTIFICADO MEDICO OCUPACIONAL ANEXO 02
    "aptitud_trabajos_encaliente": { fechaField: "fechaExamen", vencimientoField: "fechaHasta" }, // APTITUD TRABAJOS EN CALIENTE
    "audiometria_2023": { fechaField: "fechaAu", vencimientoField: null }, // FICHA AUDIOMETRIA
    "audiometria_po": { fechaField: "fechaExamen", vencimientoField: null }, // FICHA AUDIOLOGICA OHLA
    "aversionalriesgo": { fechaField: "fechaRegistro", vencimientoField: null }, // AVERSION RIESGO
    "b_certificado_altura": { fechaField: "fechaExamen_f_examen", vencimientoField: "fechaHasta_f_hasta", extraFechaFields: ["fechaDesde_f_desde"] }, // CERTIFICADO ALTURA
    "b_certificado_conduccion": { fechaField: "fechaExamen_f_examen", vencimientoField: "fechaHasta_f_hasta", extraFechaFields: ["fechaDesde_f_desde"] }, // CERTIFICADO VEHICULOS
    "b_uso_respiradores": { fechaField: "datosRespiradores.fechaExamen_fecha_examen", vencimientoField: "datosRespiradores.fechaExpira_fecha_expira" }, // USO DE RESPIRADORES
    "bombaelectrica": { fechaField: "fechaRegistro", vencimientoField: null }, // BOMBA ELECTRICA
    "calidad_sueño": { fechaField: "fecha", vencimientoField: null }, // CALIDAD DE SUEÑO
    "certificacion_medica_altura": { fechaField: "fechaCertificacion", vencimientoField: null }, // ALTURA 1.8
    "certificado_altura_poderosa": { fechaField: "fechaExamen_f_examen", vencimientoField: null }, // CERTIFICADO ALTURA PODEROSA
    "certificado_aptitud_cuadrador": { fechaField: "fechaExamen", vencimientoField: "fechaCaducidad" }, // CUADRADOR VIGIA
    "certificado_aptitud_herramientas_manuales": { fechaField: "fechaCertificado", vencimientoField: "fechaCaducidad" }, // APTITUD HERRAMIENTAS MANUALES
    "certificado_aptitud_medico_ocupacional": { fechaField: "fechaDesde", vencimientoField: "fechaHasta" }, // CERTIFICADO DE APTITUD ANEXO 16
    "certificado_aptitud_medico_resumen": { fechaField: "fechaDesde", vencimientoField: null }, // CONSTANCIA DE EXAMEN MEDICO OCUPACIONAL
    "certificado_exposicion_al_calor": { fechaField: "fecha", vencimientoField: null }, // CERTIFICADO EXPOSICION AL CALOR
    "certificado_manipuladores_barrick": { fechaField: "fechaExamen", vencimientoField: null }, // CERTIFICADO MANIPULADORES DE ALIMENTOS
    "colinesterasa": { fechaField: "fecha", vencimientoField: null }, // COLINESTERASA
    "con_panel10D": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO PANEL 10D
    "con_panel2D": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO PANEL 2D
    "con_panel3D": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO PANEL 3D
    "con_panel4D": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO PANEL 4D
    "con_panel5D": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO PANEL 5D
    "consent_Boro": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO DROGAS BOROO
    "consent_Muestra_Sangre": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO DE MUESTRA DE SANGRE
    "consent_marihuana": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO DE MARIHUANA
    "consentimientoInformado": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO INFORMADO EXAMEN MEDICO OCUPACIONAL
    "consentimientobuenasalud": { fechaField: "fecha", vencimientoField: null }, // CONSENTIMIENTO BUENA SALUD
    "cuadradorvigia": { fechaField: "fechaRegistro", vencimientoField: null }, // PSICOLOGIA VIGIA
    "cuestionario_audiometria": { fechaField: "fechaCuestionario", vencimientoField: null }, // CUESTIONARIO AUDIOMETRIA
    "cuestionario_berlin": { fechaField: "fechaRegistro", vencimientoField: null }, // CUESTIONARIO BERLIN
    "cuestionario_nordico": { fechaField: "fechaCuestionario", vencimientoField: null }, // CUESTIONARIO NORDICO
    "escala_lake_louise": { fechaField: "fecha", vencimientoField: null }, // ESCALA DE LAKE LOUISE
    "especificos": { fechaField: "fechaRegistro", vencimientoField: null }, // TRABAJOS EN ESPECIFICOS
    "etanol_saliva": { fechaField: "fecha", vencimientoField: null }, // ETANOL EN SALIVA
    "evaluacion_musculo_esqueletica": { fechaField: "fechaExamen", vencimientoField: null }, // EVALUACION MUSCULO ESQUELETICA
    "evaluacion_musculo_esqueletica2021": { fechaField: "fechaExamen", vencimientoField: null }, // EVALUACION MUSCULO ESQUELETICA BOROO
    "evaluacion_psicologica_poderosa_caliente": { fechaField: "fechaEntrevista", vencimientoField: null }, // INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR - CALIENTE
    "evaluacion_psicologica_poderosa_licencia": { fechaField: "fechaEntrevista", vencimientoField: null }, // INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR - LICENCIA
    "evaluacion_psicologica_poderosa_normal": { fechaField: "fechaEntrevista", vencimientoField: null }, // INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR - NORMAL
    "exam_complementarios": { fechaField: "fechaRegistro", vencimientoField: null }, // EXAMENES COMPLEMENTARIOS
    "ficha_datos_paciente": { fechaField: "fechaIngreso", vencimientoField: null }, // FICHA DATOS PACIENTE
    "ficha_psicologica_anexo02": { fechaField: "fechaExamen_fecha", vencimientoField: null }, // PSICOLOGIA ANEXO 02
    "ficha_psicologica_anexo03": { fechaField: "fechaExamen_fecha", vencimientoField: null }, // PSICOLOGIA ANEXO 03
    "ficha_sas": { fechaField: "fechaSas_fecha_sas", vencimientoField: null }, // FICHA SAS
    "fobias": { fechaField: "fechaRegistro", vencimientoField: null }, // INFORME PSICOLOGIA FOBIAS
    "glucosatolerancia": { fechaField: "fechaExamen", vencimientoField: null }, // ANALISIS BIOQUIMICOS - TOLERANCIA GLUCOSA
    "hemograma_autom": { fechaField: "fechaExamen", vencimientoField: null }, // HEMOGRAMA
    "hepatitis_b": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA - HEPATITIS B
    "hepatitis_c": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA - HEPATITIS C
    "historia_oc_info": { fechaField: "fechaHo", vencimientoField: null }, // HISTORIA OCUPACIONAL
    "hoja_consulta_externa": { fechaField: "fechaExamen", vencimientoField: null }, // HOJA DE CONSULTA EXTERNA
    "infor_conductores": { fechaField: "fechaRegistro", vencimientoField: null }, // INFORME CONDUCTORES
    "informe_burnout": { fechaField: "fecha", vencimientoField: null }, // INFORME BURNOUT
    "informe_electrocardiograma": { fechaField: "fechaExamen", vencimientoField: null }, // ELECTROCARDIOGRAMA
    "informe_psicolaboral": { fechaField: "fecha", vencimientoField: null }, // INFORME PSICOLABORAL
    "informe_psicologico": { fechaField: "fechaEntrevista", vencimientoField: null }, // INFORME PSICOLOGICO
    "informe_psicologico_estres": { fechaField: "fechaExamen", vencimientoField: null }, // TEST DE ESTRES FATIGA Y SOMNOLENCIA PSICOLOGIA
    "informe_riesgos_psicosociales": { fechaField: "fecha", vencimientoField: null }, // INFORME RIESGO PSICOSOCIAL
    "inmunologia": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA - AGLUTINACIONES
    "inmunologia_vdrl": { fechaField: "fechaExamen", vencimientoField: null }, // INMUNOLOGIA - VDRL
    "koh": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA BK-KOH DIRECTO
    "l_bioquimica": { fechaField: "fecha", vencimientoField: null }, // ANALISIS BIOQUIMICOS - PERFIL RENAL
    "lab_clinico": { fechaField: "fechaLab", vencimientoField: null }, // LABORATORIO CLINICO
    "lab_clinico_examen_orina": { fechaField: "fecha", vencimientoField: null }, // EXAMEN ORINA LABORATORIO
    "lab_clinico_hemoglobina": { fechaField: "fecha", vencimientoField: null }, // HEMOGLOBINA
    "lgonadotropina": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA - GONADOTROPINA
    "lhepatitis": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA - HEPATITIS A
    "microbiologia": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA BK-KOH
    "odontograma": { fechaField: "fechaExamen", vencimientoField: null }, // ODONTROGRAMA
    "oftalmologia2021": { fechaField: "fechaOf", vencimientoField: null }, // OFTALMOLOGIA
    "oit": { fechaField: "fradiografia", vencimientoField: null, extraFechaFields: ["flectura"] }, // OIT
    "panel10d": { fechaField: "fecha", vencimientoField: null }, // PANEL 10D
    "panel2d": { fechaField: "fecha", vencimientoField: null }, // PANEL 2D
    "panel3d": { fechaField: "fecha", vencimientoField: null }, // PANEL 3D
    "panel4d": { fechaField: "fecha", vencimientoField: null }, // PANEL 4D
    "pcr_ultrasensible": { fechaField: "fecha", vencimientoField: null }, // PCR ULTRASENSIBLE
    "perfil_hepatico": { fechaField: "fecha", vencimientoField: null }, // ANALISIS BIOQUIMICOS - PERFIL HEPÁTICO
    "psi_brigadistas": { fechaField: "fechaRegistro", vencimientoField: null }, // BRIGADISTAS PSICOLOGIA
    "psicologia_espacios_confinados": { fechaField: "fecha", vencimientoField: null }, // ESPACIOS CONFINADOS PSICOLOGIA
    "psicologiafobias": { fechaField: "fecha", vencimientoField: null }, // TRABAJO EN ALTURA PSICOLOGIA
    "radiografia": { fechaField: "fechaExamen", vencimientoField: null }, // INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA)
    "radiografia_torax": { fechaField: "fechaExamen", vencimientoField: null }, // RADIOGRAFIA TORAX
    "resumen_medico_poderosa": { fechaField: "fechaFichaAnexo16_fecha", vencimientoField: "fechaHastaFichaAnexo16_fecha_hasta" }, // RESUMEN MEDICO ANEXO 16
    "resumen_medico_poderosa_anexo02": { fechaField: "fechaFichaAnexo2_fecha", vencimientoField: "fechaVencimientoAnexo02" }, // RESUMEN MEDICO ANEXO 02
    "riesgo_cardiovascular": { fechaField: "fecha", vencimientoField: null }, // RIESGO CARDIOVASCULAR
    "riesgo_electrico": { fechaField: "fecha", vencimientoField: "fechaExpiracion", extraFechaFields: ["fechaExamen"] }, // CERTIFICADO RIESGO ELECTRICO
    "riesgocoronario": { fechaField: "fechaExamen", vencimientoField: null }, // ANALISIS BIOQUIMICOS - RIESGO CORONARIO
    "tamizaje_dermatologico": { fechaField: "fechaExamen", vencimientoField: null }, // TAMIZAJE DERMATOLOGICO
    "test_fatiga_somnolencia": { fechaField: "fexamen", vencimientoField: null }, // TEST FATIGA Y SOMNOLENCIA
    "thevenon": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA - THEVENON
    "toxicologia": { fechaField: "fecha", vencimientoField: null }, // PANEL 5D
    "trastornos_personalidad": { fechaField: "fechaRegistro", vencimientoField: null }, // TRANSTORNO PERSONALIDAD PSICOLOGIA
    "vih": { fechaField: "fecha", vencimientoField: null }, // INMUNOLOGIA - VIH
};

const DATE_FORMAT = "yyyy-MM-dd";

function setByPath(obj, path, value) {
    const keys = path.split(".");
    const clone = { ...obj };
    let cursor = clone;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        cursor[key] = { ...(cursor[key] || {}) };
        cursor = cursor[key];
    }
    cursor[keys[keys.length - 1]] = value;
    return clone;
}

/**
 * Sobrescribe la fecha del examen (y su vencimiento) en los datos de un reporte
 * del folio, según la tabla del examen. No hace nada si no hay fecha personalizada
 * o si la tabla no tiene un mapeo conocido.
 *
 * @param {object} data - datos ya obtenidos del backend para el reporte
 * @param {string} tabla - examen.tabla del catálogo del folio
 * @param {string} fechaPersonalizada - fecha en formato yyyy-MM-dd (la que entrega <input type="date">)
 * @param {number|string} [diasVencimiento] - días a sumar para el vencimiento; si se omite se usa 1 año exacto
 */
export function aplicarFechaPersonalizada(data, tabla, fechaPersonalizada, diasVencimiento) {
    if (!data || !fechaPersonalizada || !tabla) return data;

    const mapping = TABLA_FECHA_MAP[tabla];
    if (!mapping) return data;

    const fechaBase = parse(fechaPersonalizada, DATE_FORMAT, new Date());
    if (Number.isNaN(fechaBase.getTime())) return data;

    let resultado = data;

    if (mapping.fechaField) {
        resultado = setByPath(resultado, mapping.fechaField, fechaPersonalizada);
    }

    for (const campo of mapping.extraFechaFields ?? []) {
        resultado = setByPath(resultado, campo, fechaPersonalizada);
    }

    if (mapping.vencimientoField) {
        const dias = diasVencimiento !== undefined && diasVencimiento !== null && diasVencimiento !== ""
            ? Number(diasVencimiento)
            : null;

        const fechaVencimiento = Number.isFinite(dias) && dias > 0
            ? addDays(fechaBase, dias)
            : addYears(fechaBase, 1);

        resultado = setByPath(resultado, mapping.vencimientoField, format(fechaVencimiento, DATE_FORMAT));
    }

    return resultado;
}
