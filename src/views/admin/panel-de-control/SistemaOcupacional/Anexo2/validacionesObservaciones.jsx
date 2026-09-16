// Funciones puras para construir el texto de observaciones/CIE10 de Anexo2.
// Cada validador recibe el/los valor(es) a evaluar más el texto acumulado hasta el momento,
// y devuelve el texto actualizado (agregando la observación solo si la condición se cumple).

export function agregarTexto(textoActual, nuevoTexto) {
  if (!nuevoTexto || !nuevoTexto.trim()) return textoActual;
  if (!textoActual || !textoActual.trim()) return nuevoTexto;
  return `${textoActual}\n${nuevoTexto}`;
}

export function agregarObservacion(base, texto) {
  if (!texto) return base;
  return base ? `${base}\n${texto}` : texto;
}

export function limpiarObservaciones(texto) {
  return [...new Set(
    String(texto || '')
      .split('\n')
      .map(x => x.trim())
      .filter(x => x !== '')
  )]
    .sort((a, b) => a.localeCompare(b, 'es'))
    .join('\n');
}

// ==================== ESPIROMETRIA ====================

export function validarInterpretacionEspirometria(interpretacion, cie10Interpretacion, observaciones) {
  if (interpretacion == null) return { observaciones };
  return {
    observaciones: observaciones + "ESPIROMETRIA: " + interpretacion + " " + (cie10Interpretacion ?? "") + "\n",
  };
}

export function validarEspirometriaRestrictiva(fvc, conclusionRespiratoria, observaciones, cie10, actualizarConclusion = true) {
  if (fvc == "" || fvc == "N/A") {
    return { conclusionRespiratoria, observaciones, cie10 };
  }
  const fvcNum = parseFloat(fvc);
  if (fvcNum >= 80) {
    return {
      conclusionRespiratoria: actualizarConclusion ? conclusionRespiratoria + "NORMAL" : conclusionRespiratoria,
      observaciones,
      cie10,
    };
  }
  const textoObservacion = "PATRON RESTRICTIVO LEVE.EVALUACION EN 6 MESES. CIE 10: R94.2 - RESULTADOS ANORMALES EN ESTUDIOS FUNCIONALES DEL PULMÓN";
  return {
    conclusionRespiratoria: actualizarConclusion ? conclusionRespiratoria + "PATRON RESTRICTIVO" + "\n" : conclusionRespiratoria,
    observaciones: observaciones + textoObservacion + "\n",
    cie10: agregarTexto(cie10, 'CIE 10: R94.2 - RESULTADOS ANORMALES EN ESTUDIOS FUNCIONALES DEL PULMÓN'),
  };
}

// Caso del ejemplo original: "NO PASO EXAMEN DE ESPIROMETRIA" + patrón obstructivo (FEV1/FVC).
export function validarEspirometriaObstructiva(fvc, fev1Fvc, conclusionRespiratoria, observaciones, cie10) {
  if (fvc != "" && fvc == "N/A") {
    return {
      conclusionRespiratoria,
      observaciones: observaciones + "NO PASO EXAMEN DE ESPIROMETRIA" + "\n",
      cie10,
    };
  }

  if (fev1Fvc == "" || fvc == "N/A") {
    return { conclusionRespiratoria, observaciones, cie10 };
  }

  const fev1fvcNum = parseFloat(fev1Fvc);
  if (fev1fvcNum >= 70.0) {
    const debeAgregarNormal =
      conclusionRespiratoria != "NORMAL" && conclusionRespiratoria != "-NORMAL";
    return {
      conclusionRespiratoria: debeAgregarNormal
        ? conclusionRespiratoria + "NORMAL" + "\n"
        : conclusionRespiratoria,
      observaciones,
      cie10,
    };
  }

  const textoObservacion = "PATRON OBSTRUCTIVO LEVE.EVALUACION EN 6 MESES. CIE 10: R94.2 - RESULTADOS ANORMALES EN ESTUDIOS FUNCIONALES DEL PULMÓN";
  return {
    conclusionRespiratoria: conclusionRespiratoria + "PATRON OBSTRUCTIVO" + "\n",
    observaciones: observaciones + textoObservacion + "\n",
    cie10: agregarTexto(cie10, 'CIE 10: R94.2 - RESULTADOS ANORMALES EN ESTUDIOS FUNCIONALES DEL PULMÓN'),
  };
}

// ==================== IMAGENOLOGIA ====================

export function validarRayosXTorax(conclusion, observacionesRt, cie10Conclusiones, observaciones, incluirPuntoFinal = true) {
  if (!conclusion && !observacionesRt) return { observaciones };
  const texto =
    `RAYOS X TORAX: ` +
    (conclusion ?? "") +
    (conclusion && observacionesRt ? " - " : "") +
    (observacionesRt ?? "") +
    (cie10Conclusiones ?? "") +
    (incluirPuntoFinal ? ".\n" : "");
  return { observaciones: observaciones + texto };
}

const CONCLUSIONES_COLUMNA_NORMALES = [
  "RADIOGRAFÍA DE COLUMNA LUMBAR AP-L SIN ALTERACIONES SIGNIFICATIVAS.",
  "RADIOGRAFÍA DE COLUMNA LUMBOSACRA AP-L SIN ALTERACIONES SIGNIFICATIVAS.",
  "CUERPOS VERTEBRALES DORSOLUMBARES EVALUADOS SIN ALTERACIONES SIGNIFICATIVAS.",
];



const CONCLUSION_RADIOGRAFICA_NORMAL =
  "CUERPOS VERTEBRALES MUESTRAN MORFOLOGÍA NORMAL.\n" +
  "SACRO NO MUESTRA LESIONES EVIDENTES.\n" +
  "ESPACIOS INTERVERTEBRALES CONSERVADOS.\n" +
  "DENSIDAD ÓSEA ADECUADA.\n" +
  "LORDOSIS LUMBAR NORMAL.\n" +
  "CANAL RAQUÍDEO CON AMPLITUD NORMAL.";

export function validarInformeRadiografico(conclusion, cie10Conclusion, observaciones) {
  if (conclusion == null || conclusion === CONCLUSION_RADIOGRAFICA_NORMAL) {
    return { observaciones };
  }
  return { observaciones: observaciones + `INFORME RADIOGRAFICO : ${conclusion}  ${cie10Conclusion ?? ""}\n` };
}

export function validarHallazgosRadiograficosTorax(hallazgos, observaciones) {
  const {
    vertices,
    hilos,
    senos,
    campos,
    mediastinos,
    silueta,
    osteoMuscular,
    conclusionesRadiograficas,
  } = hallazgos;

  if (vertices == null || vertices == "NO SE TOMÓ RX DE TORAX") {
    return { observaciones };
  }

  let resultado = observaciones;
  if (vertices != null && vertices != "LIBRES") resultado += vertices;
  if (hilos != null && hilos != "NORMALES") resultado += hilos;
  if (senos != null && senos != "LIBRES") resultado += senos;
  if (campos != null && campos != "NORMALES") resultado += campos;
  if (mediastinos != null && mediastinos != "NORMALES") resultado += mediastinos;
  if (silueta != null && silueta != "NORMAL") resultado += silueta;
  if (osteoMuscular != null && osteoMuscular != "NORMAL") resultado += osteoMuscular;
  if (conclusionesRadiograficas != null && conclusionesRadiograficas != "NORMAL") resultado += conclusionesRadiograficas;

  return { observaciones: resultado };
}

export function validarMusculoesqueletico(diagnostico, conclusiones, cie10Diagnostico, observaciones) {
  const mostrar = diagnostico != null
    ? diagnostico !== "NORMAL"
    : (conclusiones != null && conclusiones !== "NORMAL");
  if (!mostrar) return { observaciones };
  const texto = `MUSCULOESQUELETICA: ${conclusiones ? conclusiones + "\n" : ""}${diagnostico ?? ""} ${cie10Diagnostico ?? ""}\n`;
  return { observaciones: observaciones + texto };
}

// ==================== OTROS EXAMENES ====================

export function validarFichaConduccion(observacionesConduccion, observaciones) {
  if (observacionesConduccion == null) return { observaciones };
  return { observaciones: observaciones + "FICHA CONDUCCION: " + observacionesConduccion + "\n" };
}

export function validarOdontograma(observacionesOdonto, cie10Odontologia, observaciones) {
  if (observacionesOdonto == null || observacionesOdonto == "NINGUNA") return { observaciones };
  return { observaciones: observaciones + `ODONTOGRAMA : ${observacionesOdonto}  ${cie10Odontologia ?? ""}\n` };
}

export function validarLabClinico(observacionesLab, cie10Hematologia, observaciones) {
  const contenido = observacionesLab != null && observacionesLab != ""
    ? observacionesLab + "  " + (cie10Hematologia ?? "")
    : "SIN OBSERVACIONES";
  return { observaciones: observaciones + `LAB CLINICO: ${contenido}\n` };
}

export function validarExamenRadiograficoSanguineo(observacionesRs, observaciones) {
  if (observacionesRs == null) return { observaciones };
  return { observaciones: observaciones + `EX. RX SANGUINEOS : ${observacionesRs}\n` };
}

export function validarCocaina(valor, observaciones, incluirPositivo = false) {
  const esPositivo = valor === "REACTIVO" || (incluirPositivo && valor === "POSITIVO");
  if (!esPositivo) {
    return { observaciones, cocaina: valor, cocainaRed: false };
  }
  const texto = incluirPositivo ? `COCAINA:${valor}\n` : `COCAINA: REACTIVO.\n`;
  return { observaciones: observaciones + texto, cocaina: valor, cocainaRed: true };
}

export function validarMarihuana(valor, observaciones, incluirPositivo = false) {
  const esPositivo = valor === "REACTIVO" || (incluirPositivo && valor === "POSITIVO");
  if (!esPositivo) {
    return { observaciones, marihuana: valor, marihuanaRed: false };
  }
  const texto = incluirPositivo ? `MARIHUANA: ${valor}\n` : `MARIHUANA: REACTIVO.\n`;
  return { observaciones: observaciones + texto, marihuana: valor, marihuanaRed: true };
}




export function validarHemoglobina(hemo, sexo, observaciones) {
  if (hemo == "N/A" || hemo == "") {
    return { observaciones, hemoglobinaRed: false };
  }
  let hemoglobinaBaja = false;
  let hemoglobinaAlta = false;
  if (sexo === "M" || sexo === "MASCULINO") {
    hemoglobinaBaja = hemo < 14;
    hemoglobinaAlta = hemo > 20;
  } else if (sexo === "F" || sexo === "FEMENINO") {
    hemoglobinaBaja = hemo < 13.5;
    hemoglobinaAlta = hemo > 20;
  }
  const hemoglobinaRed = hemoglobinaBaja || hemoglobinaAlta;
  if (!hemoglobinaRed) {
    return { observaciones, hemoglobinaRed };
  }
  const motivo = hemoglobinaBaja ? "HEMOGLOBINA: BAJA" : "HEMOGLOBINA: ALTA";
  return {
    observaciones: (observaciones || "") + `${motivo}.\n`,
    hemoglobinaRed,
  };
}

export function validarCariesDental(piezasMalEstado, observaciones, cie10) {
  if (piezasMalEstado === "") return { observaciones, cie10 };
  const malEstado = parseFloat(piezasMalEstado);
  if (malEstado < 1) return { observaciones, cie10 };
  return {
    observaciones: observaciones + "CARIES DENTAL.TTO.EVALUACION EN 6 MESES. CIE 10: K02 - CARIES DENTAL\n",
    cie10: agregarTexto(cie10, 'CIE 10: K02 - CARIES DENTAL'),
  };
}

const CIE10_OBESIDAD = "CIE 10: E66.9 - OBESIDAD, NO ESPECIFICADA";

export function validarImc(imc, observaciones, cie10) {
  if (!imc || imc === "") {
    return { observaciones, cie10, imcRed: false };
  }
  const imcNum = parseFloat(imc);
  let texto = null;
  if (imcNum >= 25 && imcNum < 30) {
    texto = "SOBREPESO:DIETA HIPOCALORICA Y EJERCICIOS. " + CIE10_OBESIDAD + "\n";
  } else if (imcNum >= 30 && imcNum < 35) {
    texto = "OBESIDAD I.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS " + CIE10_OBESIDAD + "\n";
  } else if (imcNum >= 35 && imcNum < 40) {
    texto = "OBESIDAD II.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO " + CIE10_OBESIDAD + "\n";
  } else if (imcNum >= 40 && imcNum < 45) {
    texto = "OBESIDAD III.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO " + CIE10_OBESIDAD + "\n";
  } else if (imcNum >= 45) {
    texto = "OBESIDAD IV.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO " + CIE10_OBESIDAD + "\n";
  }

  if (texto == null) {
    return { observaciones, cie10, imcRed: false };
  }
  return {
    observaciones: observaciones + texto,
    cie10: agregarTexto(cie10, CIE10_OBESIDAD),
    imcRed: true,
  };
}

// ==================== OFTALMOLOGIA / AUDIOMETRIA / EKG ====================

export function validarOftalmologia(enfermedadOculares, enfermedadOtros, cie10EnfOculares, cie10Pterigion, observaciones) {
  const tieneEnfermedad = enfermedadOculares !== "NINGUNA" && enfermedadOculares !== "";
  const tieneOtros = enfermedadOtros !== "NINGUNA" && enfermedadOtros !== "";
  if (!tieneEnfermedad && !tieneOtros) {
    return { observaciones };
  }
  const texto = "OFTALMOLOGIA: " + enfermedadOculares + " " + (enfermedadOtros ?? "") + "  " + (cie10EnfOculares ?? "") + "  " + (cie10Pterigion ?? "") + "\n";
  return { observaciones: observaciones + texto };
}

export function validarVisionColores(visionColores, observaciones) {
  if (visionColores === "NINGUNA" || visionColores === "NORMAL") {
    return { observaciones };
  }
  return { observaciones: observaciones + `${visionColores}\n` };
}

export function validarAudiometria(od500, diagnostico, cie10Diagnostico, observaciones) {
  if (od500 !== "" && od500 !== "N/A" && diagnostico !== "NORMAL") {
    return { observaciones: observaciones + `${diagnostico}.USO DE EPP AUDITIVO.EVALUACION ANUAL ${cie10Diagnostico ?? ""}\n` };
  }
  if (od500 === "N/A") {
    return { observaciones: observaciones + "NO PASO EXAMEN AUDIOMETRIA.\n" };
  }
  return { observaciones };
}

export function validarElectrocardiograma(hallazgo, conclusiones, recomendaciones, cie10Hallazgos, cie10Conclusiones, observaciones) {
  const hallazgoAnormal = hallazgo && hallazgo !== "NORMAL";
  const conclusionAnormal = conclusiones && !conclusiones.includes("DENTRO DE PARAMETROS NORMALES");
  if (!hallazgoAnormal && !conclusionAnormal) {
    return { observaciones };
  }
  const texto = `-ELECTROCARDIOGRAMA: ${hallazgo ? hallazgo + "\n" : ""}${conclusiones ? conclusiones + "\n" : ""}${recomendaciones ?? ""} ${cie10Hallazgos ?? ""}\n${cie10Conclusiones ?? ""}\n`;
  return { observaciones: observaciones + texto };
}

// ==================== METABOLICO / CARDIOVASCULAR ====================

export function validarPerfilLipidico(colesterolTotal, ldlColesterol, hdlColesterol, vldlColesterol, trigliceridos, observaciones, cie10) {
  const ct = parseFloat(colesterolTotal);
  const ldl = parseFloat(ldlColesterol) || 0;
  const hdl = parseFloat(hdlColesterol) || 0;
  const vldl = parseFloat(vldlColesterol) || 0;
  const trigli = parseFloat(trigliceridos) || 0;

  let resultadoObservaciones = observaciones;
  let resultadoCie10 = cie10;
  let colesterolRed = false;
  let trigliceridosRed = false;

  if (ct > 200) {
    resultadoObservaciones += "HIPERCOLESTEROLEMIA. CIE 10: E78.0 - HIPERCOLESTEROLEMIA PURA";
    resultadoCie10 = agregarTexto(resultadoCie10, "CIE 10: E78.0 - HIPERCOLESTEROLEMIA PURA");
    colesterolRed = true;
  }
  if (trigli > 150) {
    resultadoObservaciones += "- HIPERTRIGLICERIDEMIA. CIE 10: E78.1 - HIPERGLICERIDEMIA PURA";
    resultadoCie10 = agregarTexto(resultadoCie10, "CIE 10: E78.1 - HIPERGLICERIDEMIA PURA");
    trigliceridosRed = true;
  }

  const LDLColesterolRed = ldl > 129;
  const HDLColesterolRed = hdl < 40 || hdl > 60;
  const VLDLColesterolRed = vldl > 30;

  if (ct > 200 || trigli > 150 || ldl > 129 || hdl < 40 || hdl > 60 || vldl > 30) {
    resultadoObservaciones += "DIETA HIPOCALORICA Y EJERCICIOS. \n";
  }

  return {
    observaciones: resultadoObservaciones,
    cie10: resultadoCie10,
    colesterolRed,
    trigliceridosRed,
    LDLColesterolRed,
    HDLColesterolRed,
    VLDLColesterolRed,
  };
}

export function validarPresionArterial(sistolica, diastolica, observaciones, cie10, incluirCie10EnTexto = true) {
  if (sistolica === "" || diastolica === "") {
    return { observaciones, cie10 };
  }
  const sistolicaNum = parseFloat(sistolica);
  const diastolicaNum = parseFloat(diastolica);
  if (sistolicaNum < 140 && diastolicaNum < 90) {
    return { observaciones, cie10 };
  }
  const textoObservacion = incluirCie10EnTexto
    ? "HTA NO CONTROLADA. CIE 10: I10 - HIPERTENSIÓN ESENCIAL (PRIMARIA)\n"
    : "HTA NO CONTROLADA.\n";
  return {
    observaciones: observaciones + textoObservacion,
    cie10: agregarTexto(cie10, "CIE 10: I10 - HIPERTENSIÓN ESENCIAL (PRIMARIA)"),
  };
}


// ==================== AMBOS ====================

export function validarRadiografiaColumna(conclusion, observaciones) {
  if (!conclusion || CONCLUSIONES_COLUMNA_NORMALES.includes(conclusion)) {
    return { observaciones };
  }
  return { observaciones: observaciones + `RADIOGRAFIA COLUMNA: ` + conclusion + ".\n" };
}


export function validarGlucosa(glucosa) {
  if (glucosa == "" || glucosa == "N/A") return { glucosaRed: false };
  const glucosaNum = parseFloat(glucosa);
  return { glucosaRed: glucosaNum >= 110 || glucosaNum < 70 };
}

export function validarCreatinina(creatinina) {
  if (creatinina == "" || creatinina == "N/A") return { creatininaRed: false };
  const creatininaNum = parseFloat(creatinina);
  return { creatininaRed: creatininaNum >= 1.4 || creatininaNum < 0.8 };
}


export function validarRiesgoCardiovascularFramingham(empresa, edad, nomExamen, riesgoCoronarioValor, observaciones) {
  const aplica = empresa === "MINERA BOROO MISQUICHILCA S.A." && parseFloat(edad) > 30 && nomExamen === "PRE-OCUPACIONAL";
  if (!aplica) return { observaciones };
  return {
    observaciones: agregarObservacion(observaciones, `RIESGO CARDIOVASCULAR SEGUN FRAMINGHAM: ${riesgoCoronarioValor}. CONTROL ANUAL\n`),
  };
}



// ============================================================================
// FUNCIONES PROPIAS DE ANEXO 16
// idénticas a Anexo 2 (radiografía de columna, glucosa, creatinina,
// riesgo cardiovascular Framingham) se reutilizan arriba, sin duplicar.
// ============================================================================

export function validarInterpretacionEspirometriaAnexo16(interpretacion, cie10Interpretacion, observaciones) {
  if (interpretacion == null) return { observaciones };
  const cie10Texto = cie10Interpretacion ? "\n" + cie10Interpretacion : "";
  return { observaciones: observaciones + "ESPIROMETRIA: " + interpretacion + " " + cie10Texto + "\n" };
}

export function validarRayosXToraxAnexo16(conclusion, observacionesRt, cie10Conclusiones, observaciones) {
  if (!conclusion && !observacionesRt) return { observaciones };
  const cie10Texto = cie10Conclusiones ? "\n" + cie10Conclusiones : "";
  const texto =
    `RAYOS X TORAX: ` +
    (conclusion ?? "") +
    (conclusion && observacionesRt ? " - " : "") +
    (observacionesRt ?? "") +
    cie10Texto +
    ".\n";
  return { observaciones: observaciones + texto };
}

export function validarMusculoesqueleticoAnexo16(diagnostico, conclusiones, cie10Diagnostico, observaciones, incluirEspacioInicial = false) {
  const mostrar = diagnostico != null
    ? diagnostico !== "NORMAL"
    : (conclusiones != null && conclusiones !== "NORMAL");
  if (!mostrar) return { observaciones };
  const cie10Texto = cie10Diagnostico ? "\n" + cie10Diagnostico : "";
  const prefijo = incluirEspacioInicial ? " " : "";
  const texto = `${prefijo}MUSCULOESQUELETICA: ${conclusiones ? conclusiones + "\n" : ""}${diagnostico ?? ""}${cie10Texto}\n`;
  return { observaciones: observaciones + texto };
}

export function validarElectrocardiogramaAnexo16(hallazgo, conclusiones, recomendaciones, cie10Hallazgos, cie10Conclusiones, observaciones, prefijo = "-") {
  const hallazgoAnormal = hallazgo && hallazgo !== "NORMAL";
  const conclusionAnormal = conclusiones && !conclusiones.includes("DENTRO DE PARAMETROS NORMALES");
  if (!hallazgoAnormal && !conclusionAnormal) return { observaciones };
  const cie10HallazgosTexto = cie10Hallazgos ? "\n" + cie10Hallazgos : "";
  const cie10ConclusionesTexto = cie10Conclusiones ? "\n" + cie10Conclusiones : "";
  const texto = `${prefijo}ELECTROCARDIOGRAMA: ${hallazgo ? hallazgo + "\n" : ""}${conclusiones ? conclusiones + "\n" : ""}${recomendaciones ?? ""} ${cie10HallazgosTexto} ${cie10ConclusionesTexto}\n`;
  return { observaciones: observaciones + texto };
}

export function validarInformeRadiograficoAnexo16(conclusion, cie10Conclusion, observaciones, prefijo = ". ") {
  if (conclusion == null || conclusion === CONCLUSION_RADIOGRAFICA_NORMAL) return { observaciones };
  const cie10Texto = cie10Conclusion ? "\n" + cie10Conclusion : "";
  return { observaciones: observaciones + `${prefijo}INFORME RADIOGRAFICO : ${conclusion} ${cie10Texto}\n` };
}

const HALLAZGOS_TORAX_ANEXO16 = [
  { campo: "vertices", normal: "LIBRES", etiqueta: "VERTICES TORAX" },
  { campo: "hilos", normal: "NORMALES", etiqueta: "HILIOS TORAX" },
  { campo: "senos", normal: "LIBRES", etiqueta: "SENOS TORAX" },
  { campo: "campos", normal: "NORMALES", etiqueta: "CAMPOS PULMONARES TORAX" },
  { campo: "mediastinos", normal: "NORMALES", etiqueta: "CAMPOS MEDIASTINOS TORAX" },
  { campo: "silueta", normal: "NORMAL", etiqueta: "SILUETA CARDIOVASCULAR TORAX" },
  { campo: "osteoMuscular", normal: "NORMAL", etiqueta: "OSTEOMUSCULAR TORAX" },
];

export function validarHallazgosRadiograficosToraxAnexo16(hallazgos, contador, observaciones) {
  if (hallazgos.vertices == null || hallazgos.vertices === "NO SE TOMÓ RX DE TORAX") {
    return { observaciones, contador };
  }
  let resultado = observaciones;
  let contadorActual = contador;
  for (const { campo, normal, etiqueta } of HALLAZGOS_TORAX_ANEXO16) {
    const valor = hallazgos[campo];
    if (valor != null && valor !== normal) {
      resultado += contadorActual + ". " + etiqueta + ":" + valor + "\n";
      contadorActual++;
    }
  }
  return { observaciones: resultado, contador: contadorActual };
}

export function validarObservacionesRadiografiaToraxAnexo16(observacionesRt, contador, observaciones) {
  if (observacionesRt == null || observacionesRt === "NORMAL") return { observaciones, contador };
  return {
    observaciones: observaciones + contador + "." + observacionesRt + "\n",
    contador: contador + 1,
  };
}

export function agregarObservacionNumerada(valor, contador, observaciones) {
  if (valor == null) return { observaciones, contador };
  return {
    observaciones: observaciones + contador + ". " + valor + "\n",
    contador: contador + 1,
  };
}

export function validarLabClinicoAnexo16(observacionesLab, cie10Hematologia, contador, observaciones) {
  const cie10Texto = cie10Hematologia ? "\n" + cie10Hematologia : "";
  const contenido = observacionesLab != null && observacionesLab !== ""
    ? "LABORATORIO: " + observacionesLab + " " + cie10Texto
    : "LABORATORIO: SIN OBSERVACIONES";
  return {
    observaciones: observaciones + contador + ". " + contenido + "\n",
    contador: contador + 1,
  };
}

export function validarCocainaAnexo16(valor, contador, observaciones) {
  if (valor !== "REACTIVO" && valor !== "POSITIVO") {
    return { observaciones, contador, cocaina: valor, cocainaRed: false };
  }
  const texto = contador + ". TEST DE COCAINA: " + valor + " COLABORADOR DE LA COMUNIDAD, CONSUME HOJA DE COCA.\n";
  return { observaciones: observaciones + texto, contador: contador + 1, cocaina: valor, cocainaRed: true };
}

export function validarMarihuanaAnexo16(valor, contador, observaciones) {
  if (valor !== "REACTIVO" && valor !== "POSITIVO") {
    return { observaciones, contador, marihuana: valor, marihuanaRed: false };
  }
  const texto = contador + ". MARIHUANA: " + valor + " COLABORADOR DE LA COMUNIDAD, CONSUME HOJA DE COCA.\n";
  return { observaciones: observaciones + texto, contador: contador + 1, marihuana: valor, marihuanaRed: true };
}

export function validarCariesDentalAnexo16(piezasMalEstado, contador, observaciones) {
  if (!piezasMalEstado || piezasMalEstado === "") return { observaciones, contador };
  const malEstado = parseFloat(piezasMalEstado);
  if (malEstado < 1) return { observaciones, contador };
  return {
    observaciones: observaciones + contador + ". " + "CARIES DENTAL.TTO.EVALUACION EN 6 MESES.\n",
    contador: contador + 1,
  };
}

export function validarImcAnexo16(imc, contador, observaciones) {
  if (!imc || imc === "") return { observaciones, contador, imcRed: false };
  const imcNum = parseFloat(imc);
  let texto = null;
  if (imcNum >= 25 && imcNum < 30) {
    texto = "SOBREPESO:DIETA HIPOCALORICA Y EJERCICIOS.\n";
  } else if (imcNum >= 30 && imcNum < 35) {
    texto = "OBESIDAD I.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS\n";
  } else if (imcNum >= 35 && imcNum < 40) {
    texto = "OBESIDAD II.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO\n";
  } else if (imcNum >= 40 && imcNum < 45) {
    texto = "OBESIDAD III.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO\n";
  } else if (imcNum >= 45 && imcNum < 50) {
    texto = "OBESIDAD IV.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO\n";
  }
  if (texto == null) return { observaciones, contador, imcRed: false };
  return {
    observaciones: observaciones + contador + ". " + texto,
    contador: contador + 1,
    imcRed: true,
  };
}

export function validarOftalmologiaAnexo16(enfermedadOculares, enfermedadOtros, cie10EnfOculares, cie10Pterigion, contador, observaciones) {
  const tieneEnfermedad = enfermedadOculares !== "NINGUNA" && enfermedadOculares !== "";
  const tieneOtros = enfermedadOtros !== "NINGUNA" && enfermedadOtros !== "";
  if (!tieneEnfermedad && !tieneOtros) return { observaciones, contador };
  const cie10EnfTexto = cie10EnfOculares ? "\n" + cie10EnfOculares : "";
  const cie10PterigionTexto = cie10Pterigion ? "\n" + cie10Pterigion : "";
  const texto = contador + ".OFTALMOLOGIA: " + enfermedadOculares + " " + (enfermedadOtros ?? "") + " " + cie10EnfTexto + cie10PterigionTexto + "\n";
  return { observaciones: observaciones + texto, contador: contador + 1 };
}

export function validarOdontogramaAnexo16(observacionesOdonto, cie10Odontologia, contador, observaciones) {
  if (observacionesOdonto == null || observacionesOdonto === "NINGUNA") {
    return { observaciones, contador, dentaduraObservaciones: undefined };
  }
  const cie10Texto = cie10Odontologia ? "\n" + cie10Odontologia : "";
  const texto = contador + ". ODONTOGRAMA : " + observacionesOdonto + " " + cie10Texto + "\n";
  return {
    observaciones: observaciones + texto,
    contador: contador + 1,
    dentaduraObservaciones: observacionesOdonto,
  };
}

export function validarEspirometriaAnexo16(fvc, fev1Fvc, interpretacionEspirometria, contador, observaciones) {
  if (fvc === "N/A") {
    return {
      observaciones: observaciones + contador + ". " + "NO PASO EXAMEN DE ESPIROMETRIA.\n",
      contador: contador + 1,
      conclusionRespiratoria: interpretacionEspirometria,
    };
  }
  if (interpretacionEspirometria && interpretacionEspirometria.trim().length > 2) {
    return { observaciones, contador, conclusionRespiratoria: interpretacionEspirometria };
  }
  let conclusion = "";
  let resultado = observaciones;
  let contadorActual = contador;
  if (fev1Fvc !== "" && fvc !== "N/A") {
    const fev1fvc = parseFloat(fev1Fvc);
    if (fev1fvc >= 70.0) {
      if (conclusion !== "-NORMAL") {
        conclusion += "-NORMAL\n";
      }
    } else {
      conclusion += "-PATRON OBSTRUCTIVO\n";
      resultado += contadorActual + ". " + "PATRON OBSTRUCTIVO LEVE. EVALUACION EN 6 MESES.\n";
      contadorActual++;
    }
  }
  if (fvc !== "" && fvc !== "N/A") {
    const fvcNum = parseFloat(fvc);
    if (fvcNum >= 80) {
      conclusion += "-NORMAL";
    } else {
      conclusion += "-PATRON RESTRICTIVO\n";
      resultado += contadorActual + ". " + "PATRON RESTRICTIVO LEVE.EVALUACION EN 6 MESES.\n";
      contadorActual++;
    }
  }
  return { observaciones: resultado, contador: contadorActual, conclusionRespiratoria: conclusion };
}

export function validarVisionColoresAnexo16(visionColores, contador, observaciones) {
  if (!visionColores || visionColores === "") return { observaciones, contador };
  return {
    observaciones: observaciones + contador + ". " + visionColores + "\n",
    contador: contador + 1,
  };
}

export function validarPresionArterialAnexo16(sistolica, diastolica, contador, observaciones) {
  if (sistolica === "" || diastolica === "") return { observaciones, contador };
  const sistolicaNum = parseFloat(sistolica);
  const diastolicaNum = parseFloat(diastolica);
  if (sistolicaNum < 140 && diastolicaNum < 90) return { observaciones, contador };
  return {
    observaciones: observaciones + contador + "-" + "HTA NO CONTROLADA.\n",
    contador: contador + 1,
  };
}

export function validarHemoglobinaConTextoAnexo16(hemo, sexo, contador, observaciones) {
  if (!hemo || hemo === "" || hemo === "N/A") return { observaciones, contador, hemoglobinaRed: false };
  const hemoglobinaNum = parseFloat(hemo);
  if (isNaN(hemoglobinaNum)) return { observaciones, contador, hemoglobinaRed: false };
  let hemoglobinaBaja = false;
  let hemoglobinaAlta = false;
  if (sexo === "M" || sexo === "MASCULINO") {
    hemoglobinaBaja = hemoglobinaNum < 14;
    hemoglobinaAlta = hemoglobinaNum > 20;
  } else if (sexo === "F" || sexo === "FEMENINO") {
    hemoglobinaBaja = hemoglobinaNum < 13.5;
    hemoglobinaAlta = hemoglobinaNum > 20;
  }
  const hemoglobinaRed = hemoglobinaBaja || hemoglobinaAlta;
  if (!hemoglobinaRed) return { observaciones, contador, hemoglobinaRed };
  const motivo = hemoglobinaBaja ? "HEMOGLOBINA: BAJA" : "HEMOGLOBINA: ALTA";
  return {
    observaciones: (observaciones || "") + `${contador}. ${motivo}.\n`,
    contador: contador + 1,
    hemoglobinaRed,
  };
}

export function validarHemoglobinaFlagAnexo16(hemo, sexo) {
  if (!hemo || hemo === "" || hemo === "N/A") return { hemoglobinaRed: undefined };
  const hemoglobinaNum = parseFloat(hemo);
  if (isNaN(hemoglobinaNum)) return { hemoglobinaRed: undefined };
  if (sexo === "M" || sexo === "MASCULINO") {
    return { hemoglobinaRed: hemoglobinaNum < 14 || hemoglobinaNum > 20 };
  }
  if (sexo === "F" || sexo === "FEMENINO") {
    return { hemoglobinaRed: hemoglobinaNum < 13.5 || hemoglobinaNum > 20 };
  }
  return { hemoglobinaRed: undefined };
}

export function validarPerfilLipidicoAnexo16(colesterolTotal, ldlColesterol, hdlColesterol, vldlColesterol, trigliceridos, contador, observaciones) {
  let resultado = observaciones;
  let contadorActual = contador;
  let colesterolRed = false;
  let trigliceridosRed = false;
  let ldlRed = false;
  let hdlRed = false;
  let vldlRed = false;

  if (colesterolTotal && colesterolTotal !== "-" && colesterolTotal !== "") {
    const colesterol = parseFloat(colesterolTotal);
    if (!isNaN(colesterol) && colesterol > 200) {
      resultado += `${contadorActual}. HIPERCOLESTEROLEMIA.DIETA HIPOCALORICA Y EJERCICIOS.\n`;
      colesterolRed = true;
      contadorActual++;
    }
  }

  if (ldlColesterol && ldlColesterol !== "-" && ldlColesterol !== "") {
    const ldl = parseFloat(ldlColesterol);
    if (!isNaN(ldl)) ldlRed = ldl > 129;
  }

  if (hdlColesterol && hdlColesterol !== "-" && hdlColesterol !== "") {
    const hdl = parseFloat(hdlColesterol);
    if (!isNaN(hdl)) hdlRed = hdl < 40 || hdl > 60;
  }

  if (vldlColesterol && vldlColesterol !== "-" && vldlColesterol !== "") {
    const vldl = parseFloat(vldlColesterol);
    if (!isNaN(vldl)) vldlRed = vldl > 30;
  }

  if (trigliceridos && trigliceridos !== "-" && trigliceridos !== "") {
    const trigli = parseFloat(trigliceridos);
    if (!isNaN(trigli) && trigli > 150) {
      resultado += `${contadorActual}. HIPERTRIGLICERIDEMIA.DIETA HIPOCALORICA Y EJERCICIOS.\n`;
      trigliceridosRed = true;
      contadorActual++;
    }
  }

  return {
    observaciones: resultado,
    contador: contadorActual,
    colesterolRed,
    trigliceridosRed,
    ldlRed,
    hdlRed,
    vldlRed,
  };
}

export function validarCreatininaSericaAnexo16(creatininaSerica, observaciones) {
  const valor = parseFloat(creatininaSerica);
  if (isNaN(valor) || (valor >= 0.8 && valor <= 1.4)) return { observaciones };
  return { observaciones: agregarObservacion(observaciones, `CREATININA SÉRICA: ${valor}`) };
}

export function validarUreaSericaAnexo16(ureaSerica, observaciones) {
  const valor = parseFloat(ureaSerica);
  if (isNaN(valor) || (valor >= 10 && valor <= 50)) return { observaciones };
  return { observaciones: agregarObservacion(observaciones, `UREA SÉRICA: ${valor}`) };
}

export function validarAcidoUricoSericoAnexo16(acidoUrico, esMujer, observaciones) {
  const valor = parseFloat(acidoUrico);
  if (isNaN(valor)) return { observaciones };
  const fueraDeRango = esMujer ? (valor < 2.5 || valor > 6.8) : (valor < 3.6 || valor > 7.7);
  if (!fueraDeRango) return { observaciones };
  return { observaciones: agregarObservacion(observaciones, `ÁCIDO ÚRICO SÉRICO: ${valor}`) };
}

export function validarGonadotropinaAnexo16(esMujer, resultadoGonadotropina, observaciones) {
  if (!esMujer || resultadoGonadotropina !== "POSITIVO") return { observaciones };
  return { observaciones: agregarObservacion(observaciones, `GONADOTROPINA: POSITIVO`) };
}

export function construirObservacionesAudioAnexo16(datos) {
  const {
    od500,
    diagnosticoAudiometrico,
    cie10Diagnostico,
    normal,
    traumaLeveOd,
    traumaLeveOi,
    traumaAvanzadoOd,
    traumaAvanzadoOi,
    hipoacusiaLeveOd,
    hipoacusiaLeveOi,
    hipoacusiaModeradaOd,
    hipoacusiaModeradaOi,
    hipoacusiaAvanzadaOd,
    hipoacusiaAvanzadaOi,
    otrasHipoacusias,
    otrasHipoacusiasTexto,
  } = datos;

  let observacionesAudio = "";

  if (od500 !== "" && od500 !== "N/A" && diagnosticoAudiometrico !== "NORMAL" && diagnosticoAudiometrico !== "") {
    const cie10Texto = cie10Diagnostico ? "\n" + cie10Diagnostico : "";
    observacionesAudio = "AUDIOMETRIA " + diagnosticoAudiometrico + ".EVALUACION ANUAL " + cie10Texto;
  } else if (od500 === "N/A" || od500 === "") {
    observacionesAudio = "NO PASO EXAMEN AUDIOMETRIA.\n";
  }

  if (normal) {
    return "NORMAL";
  }

  if (traumaLeveOd && traumaLeveOi) observacionesAudio += "Trauma Acústico Bilateral Leve ";
  if (traumaLeveOd) observacionesAudio += "\n Trauma Acústico Leve OD";
  if (traumaLeveOi) observacionesAudio += "\n Trauma Acústico Leve OI";
  if (traumaAvanzadoOd && traumaAvanzadoOi) observacionesAudio += "\n Trauma Acústico Bilateral Avanzado ";
  if (traumaAvanzadoOd) observacionesAudio += "\n Trauma Acústico Avanzado OD";
  if (traumaAvanzadoOi) observacionesAudio += "\n Trauma Acústico Avanzado OI";
  if (hipoacusiaLeveOd && hipoacusiaLeveOi) observacionesAudio += "\n Hipoacusia Bilateral Inducida por Ruido, Leve ";
  if (hipoacusiaLeveOd) observacionesAudio += "\n Hipoacusia Inducida por Ruido, Leve  OD";
  if (hipoacusiaLeveOi) observacionesAudio += "\n Hipoacusia Inducida por Ruido, Leve  OI";
  if (hipoacusiaModeradaOd && hipoacusiaModeradaOi) observacionesAudio += "\n Hipoacusia Bilateral Inducida por Ruido, Moderada";
  if (hipoacusiaModeradaOd) observacionesAudio += "\n Hipoacusia Inducida por Ruido, Moderada OD";
  if (hipoacusiaModeradaOi) observacionesAudio += "\n Hipoacusia Inducida por Ruido, Moderada OI";
  if (hipoacusiaAvanzadaOd && hipoacusiaAvanzadaOi) observacionesAudio += "\n Hipoacusia Bilateral Inducida por Ruido, Avanzada ";
  if (hipoacusiaAvanzadaOd) observacionesAudio += "\n Hipoacusia Inducida por Ruido, Avanzada  OD";
  if (hipoacusiaAvanzadaOi) observacionesAudio += "\n Hipoacusia Inducida por Ruido, Avanzada  OI";
  if (otrasHipoacusias) observacionesAudio += "\n  OTRAS HIPOACUSIAS: " + (otrasHipoacusiasTexto ?? "");

  return observacionesAudio;
}
