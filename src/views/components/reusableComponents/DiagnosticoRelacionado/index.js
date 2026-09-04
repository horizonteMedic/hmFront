// Punto de entrada único del módulo de Diagnóstico Relacionado. Para
// integrarlo en un formulario nuevo normalmente solo hace falta:
//
//   import {
//     DiagnosticoRelacionadoField,
//     hidratarFormulariosDiagnostico,
//     serializarFormulariosDiagnostico,
//   } from ".../reusableComponents/DiagnosticoRelacionado";
//
// 1) Agregar `formulariosDiagnostico: []` al estado inicial del form.
// 2) Renderizar <DiagnosticoRelacionadoField token seleccionados setSeleccionados />.
// 3) Al cargar un registro existente: setForm(prev => ({ ...prev,
//    formulariosDiagnostico: hidratarFormulariosDiagnostico(res.formulariosDiagnostico) })).
// 4) Al armar el body del submit: formulariosDiagnostico:
//    serializarFormulariosDiagnostico(form.formulariosDiagnostico).

export { default as DiagnosticoRelacionadoField } from "./DiagnosticoRelacionadoField";
export { default as DiagnosticoRelacionadoModal } from "./DiagnosticoRelacionadoModal";
export { default as DiagnosticoRelacionadoFormModal } from "./DiagnosticoRelacionadoFormModal";
export { default as DiagnosticoRelacionadoSeleccionadosList } from "./DiagnosticoRelacionadoSeleccionadosList";
export { TablaDx, FilaDx, DescripcionInput } from "./DiagnosticoRelacionadoTabla";
export { useDiagnosticoRelacionadoCatalogo } from "./useDiagnosticoRelacionadoCatalogo";
export {
  renumerar,
  toggleSeleccion,
  actualizarDescripcion,
  moverSeleccion,
  hidratarFormulariosDiagnostico,
  serializarFormulariosDiagnostico,
} from "./DiagnosticoRelacionadoLogic";
export { getDiagnosticosRelacionados, registrarDiagnostico } from "./controllerDiagnosticoRelacionado";
