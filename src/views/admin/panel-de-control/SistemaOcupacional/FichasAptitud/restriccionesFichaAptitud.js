// Restricciones/recomendaciones marcables de las fichas de aptitud (Anexo 2, Anexo 16).
// Solo difiere entre fichas el texto de "EPP auditivo", por eso se recibe como parámetro.
//
// El orden es el de las líneas del texto "Restricciones". El texto de cada casilla es, a la vez,
// la línea que se agrega a "Restricciones".
export const crearRestriccionesFicha = (textoEppAuditivo) => {
  const restricciones = [
    { name: "corregirAgudezaVisualTotal", label: "CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO" },
    { name: "corregirAgudezaVisual", label: "CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO" },
    { name: "dietaHipocalorica", label: "DIETA HIPOCALÓRICA Y EJERCICIOS" },
    { name: "evitarMovimientosDisergonomicos", label: "EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS" },
    { name: "noHacerTrabajoConCodigoColores", label: "NO HACER TRABAJO CON CÓDIGO DE COLORES" },
    { name: "noHacerTrabajoAltoRiesgo", label: "NO HACER TRABAJO DE ALTO RIESGO" },
    { name: "noHacerTrabajoSobre18", label: "NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO" },
    { name: "usoEppAuditivo", label: textoEppAuditivo },
    { name: "usoLentesConducir", label: "USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS" },
    { name: "usoLentesTrabajo", label: "USO DE LENTES CORRECTORES PARA TRABAJO." },
    { name: "usoLentesTrabajoSobre18", label: "USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO" },
    { name: "noConducirVehiculos", label: "NO CONDUCIR VEHÍCULOS" },
  ];

  const nombres = restricciones.map(({ name }) => name);

  return {
    restricciones,
    nombres,
    desmarcadas: Object.fromEntries(nombres.map((name) => [name, false])),

    // Texto de "Restricciones" a partir de las casillas marcadas.
    armar: (form) =>
      restricciones.filter(({ name }) => form[name]).map(({ label }) => label).join("\n"),

    // Al editar un registro, deduce las casillas marcadas a partir del texto guardado.
    inferir: (descripcion) =>
      Object.fromEntries(
        restricciones.map(({ name, label }) => [name, descripcion?.includes(label) || false])
      ),
  };
};
