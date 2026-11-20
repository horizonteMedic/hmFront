import { AUTORIZA_PRECARGA, aFechaDMA, crearDatosIniciales, EXAMEN_ANUAL, hoyDMA } from './constantes.js';

// Capa de mapeo entre el backend y el formulario. Las claves del usuario que registra cambian según el
// endpoint, y aquí quedan todas juntas:
//   · GET busquedaHistoriaOcupNOrden (BackendHistoriaClinicaOcupacionalDTO) lo devuelve como `usuarioRegistro`
//   · POST historiaClinicaOcupacional (RequestHistoriaClinicaOcupacionalDTO) lo recibe como `user_registro`
//     (lo arma SubmitHistoriaC con el usuario en sesión)
//   · Las pre-cargas (buscarPorDni) lo devuelven como `usuarioRegistro` (quien creó la pre-carga)

const texto = (valor) => valor ?? '';

// Historia cargada desde la tabla (GET busquedaHistoriaOcupNOrden)
export const historiaAFormulario = (res) => ({
  ...crearDatosIniciales(),
  ...res, // el resto del DTO viaja tal cual al actualizar (lo que el formulario no muestra se conserva)
  codPa: String(texto(res.codPa)),
  nombres: texto(res.nombres),
  apellidos: texto(res.apellidos),
  razonContrata: texto(res.razonContrata),
  n_medico: texto(res.n_medico),
  protocolo: texto(res.protocolo),
  cargoDe: texto(res.cargoDe),
  areaO: texto(res.areaO),
  nomEx: texto(res.nomEx),
  mineralPo: texto(res.mineralPo),
  alturaPo: texto(res.alturaPo),
  autoriza: texto(res.autoriza),
  textObserv1: texto(res.textObserv1),
  textObserv2: texto(res.textObserv2),
  fechaAperturaPo: aFechaDMA(res.fechaAperturaPo),
  userRegistro: texto(res.usuarioRegistro),
  tieneRegistro: true,
});

// Datos de la última historia del paciente (IMPORTAR): se copia todo menos lo que identifica a la historia
// vieja (N° de historia y pre-carga) y la fecha de apertura, que vuelve a ser hoy. La historia importada
// siempre es nueva, así que el examen es el fijo de este formulario.
export const importadoAFormulario = (actual, importado) => ({
  ...actual,
  ...importado,
  nomExamen: EXAMEN_ANUAL,
  n_orden: actual.n_orden,
  idPreNorden: actual.idPreNorden,
  fechaAperturaPo: hoyDMA(),
});

// Pre-carga elegida (buscarPorDni) + paciente buscado por DNI
export const preCargaAFormulario = (actual, item, paciente) => ({
  ...actual,
  ...item,
  nombres: paciente.nombresPa,
  apellidos: paciente.apellidosPa,
  fechaAperturaPo: actual.fechaAperturaPo,
  preCargaUsuario: texto(item.usuarioRegistro),
  protocolo: texto(item.protocolo),
  textObserv1: texto(item.observacion1),
  idPreNorden: item.id,
  n_medico: item.medico,
  cargoDe: item.cargo,
  areaO: item.area,
  nomEx: item.nomEx,
  mineralPo: item.mineral,
  alturaPo: item.altura,
  autoriza: AUTORIZA_PRECARGA,
  nomExamen: EXAMEN_ANUAL,
});
