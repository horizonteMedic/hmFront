import { useCallback, useEffect, useState } from "react";
import { getDiagnosticosRelacionados } from "./controllerDiagnosticoRelacionado";

/**
 * Catálogo de diagnósticos relacionados: data de referencia (no específica
 * de ningún formulario), aislada en su propio hook para que cualquier
 * consumidor (DiagnosticoRelacionadoField, o un formulario a medida) pueda
 * pedirla sin duplicar la lógica de fetch/loading.
 */
export function useDiagnosticoRelacionadoCatalogo(token) {
  const [catalogo, setCatalogo] = useState([]);
  const [loadingCatalogo, setLoadingCatalogo] = useState(false);

  const refrescarCatalogo = useCallback(() => {
    return getDiagnosticosRelacionados(setLoadingCatalogo, setCatalogo, token);
  }, [token]);

  useEffect(() => {
    refrescarCatalogo();
  }, [refrescarCatalogo]);

  return { catalogo, loadingCatalogo, refrescarCatalogo };
}
