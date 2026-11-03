// Documento de identidad del paciente, compartido por Registro de Pacientes y las Aperturas de exámenes.
// La identidad del paciente es el par (tipoDoc, nroDoc): el mismo número puede ser el DNI de una persona y
// el carné de otra. El número siempre es TEXTO (un DNI puede empezar con 0 y un pasaporte lleva letras).
// `codPa` es solo el código interno del backend: a los extranjeros les asigna 900,000,000 o más, así que
// nunca se muestra como documento.

import { getFetch } from './apiHelpers';

export const TIPO_DNI = 1;
export const TIPO_CARNE_EXTRANJERIA = 2;
export const TIPO_PASAPORTE = 3;
export const TIPO_SIN_DOCUMENTO = 4;

export const TIPOS_DOCUMENTO = [
  { value: TIPO_DNI, label: 'DNI' },
  { value: TIPO_CARNE_EXTRANJERIA, label: 'CARNÉ DE EXTRANJERÍA' },
  { value: TIPO_PASAPORTE, label: 'PASAPORTE' },
  { value: TIPO_SIN_DOCUMENTO, label: 'SIN DOCUMENTO' },
];

const CODPA_INTERNO_DESDE = 900000000;

export const etiquetaTipoDoc = (tipo) => TIPOS_DOCUMENTO.find((t) => t.value === Number(tipo))?.label ?? '';

// El <select> entrega texto: se guarda como número
export const aTipoDoc = (valor) => Number(valor) || '';

// Lo que se puede escribir en el campo número según el tipo (sin Number() ni parseInt: se guarda tal cual)
export const limpiarNroDoc = (tipo, valor) => {
  const texto = String(valor ?? '');
  switch (Number(tipo)) {
    case TIPO_DNI:
      return texto.replace(/\D/g, '').slice(0, 8);
    case TIPO_CARNE_EXTRANJERIA:
    case TIPO_PASAPORTE:
      return texto.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
    default:
      return '';
  }
};

// '' si el documento es válido; si no, el mensaje a mostrar
export const validarDocumento = (tipo, nroDoc) => {
  const nro = String(nroDoc ?? '').trim();
  switch (Number(tipo)) {
    case TIPO_DNI:
      return /^\d{1,8}$/.test(nro) ? '' : 'El DNI debe tener entre 1 y 8 dígitos';
    case TIPO_CARNE_EXTRANJERIA:
    case TIPO_PASAPORTE:
      return /^[A-Z0-9]{1,20}$/i.test(nro) ? '' : `El ${etiquetaTipoDoc(tipo).toLowerCase()} debe ser alfanumérico, hasta 20 caracteres`;
    case TIPO_SIN_DOCUMENTO:
      return '';
    default:
      return 'Seleccione el tipo de documento';
  }
};

// Sin tipo (historia de extranjero cargada, que no trae su documento) tampoco hay número que mostrar
export const tieneNumero = (tipo) => Boolean(Number(tipo)) && Number(tipo) !== TIPO_SIN_DOCUMENTO;

// ¿codPa es un código interno (extranjero / sin documento) y no un DNI?
export const esCodPaInterno = (codPa) => Number(codPa) >= CODPA_INTERNO_DESDE;

// Documento de un paciente que llega del backend. Si la respuesta no trae nroDoc (p. ej. una historia
// clínica, que solo trae codPa), el codPa de un DNI es el propio DNI; el de un extranjero no dice nada.
export const documentoDesdeBackend = (res) => {
  if (res?.nroDoc) return { tipoDoc: aTipoDoc(res.tipoDoc) || TIPO_DNI, nroDoc: String(res.nroDoc) };
  const codPa = res?.codPa;
  if (codPa === null || codPa === undefined || codPa === '' || esCodPaInterno(codPa)) {
    return { tipoDoc: aTipoDoc(res?.tipoDoc), nroDoc: '' };
  }
  return { tipoDoc: TIPO_DNI, nroDoc: String(codPa).padStart(8, '0') };
};

// Documento que Registro de Pacientes le pasa a la Apertura al registrar (DNIG): { tipoDoc, nroDoc, codPa }.
// Un texto suelto es un DNI (formato anterior).
export const documentoDesdeRegistro = (DNIG) => {
  if (!DNIG) return { tipoDoc: TIPO_DNI, nroDoc: '', codPa: '' };
  if (typeof DNIG !== 'object') return { tipoDoc: TIPO_DNI, nroDoc: String(DNIG), codPa: '' };
  return {
    tipoDoc: aTipoDoc(DNIG.tipoDoc) || TIPO_DNI,
    nroDoc: String(DNIG.nroDoc ?? ''),
    codPa: DNIG.codPa ? String(DNIG.codPa) : '',
  };
};

// Documento para crear / editar una orden: con número se valida el número; sin número hace falta el codPa
// (paciente sin documento recién registrado, o historia de extranjero cargada, que solo trae codPa)
export const validarDocumentoOrden = ({ tipoDoc, nroDoc, codPa }) => {
  if (!tipoDoc || !tieneNumero(tipoDoc)) {
    if (codPa) return '';
    return tipoDoc
      ? 'Paciente sin documento: regístrelo primero en Registro de Pacientes'
      : 'Seleccione el tipo de documento';
  }
  return validarDocumento(tipoDoc, nroDoc);
};

// Documento para MOSTRAR en fichas y formularios que solo reciben `dni` (que ahí es el codPa interno).
// El codPa de un extranjero no es su documento: no se muestra. El de un DNI se completa a 8 dígitos
// (el número pierde el 0 inicial). Un texto que ya es el documento se muestra tal cual.
export const textoDocumento = (dni) => {
  if (dni === null || dni === undefined || dni === '') return '';
  const texto = String(dni).trim();
  if (!/^\d+$/.test(texto)) return texto;
  if (esCodPaInterno(texto)) return 'EXTRANJERO';
  return texto.length < 8 ? texto.padStart(8, '0') : texto;
};

// Tipo de documento escrito en un Excel ("DNI", "Carnet Extra", "C.E.", "Pasaporte", "2"...). Vacío = DNI;
// '' si no se reconoce.
export const tipoDocDesdeTexto = (valor) => {
  const texto = String(valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ.\s]/g, '')
    .toUpperCase();
  if (!texto) return TIPO_DNI;
  if (/^[1-4]$/.test(texto)) return Number(texto);
  if (texto.startsWith('DNI')) return TIPO_DNI;
  if (texto.includes('CARN') || texto.includes('EXTRANJ') || texto === 'CE') return TIPO_CARNE_EXTRANJERIA;
  if (texto.includes('PASAP')) return TIPO_PASAPORTE;
  if (texto.startsWith('SIN')) return TIPO_SIN_DOCUMENTO;
  return '';
};

// Documento del paciente de una orden: { codPa, tipoDoc, tipoDocNombre, nroDoc }, o null si no existe o falla
export const obtenerDocumentoPorOrden = async (nOrden, token) => {
  try {
    const res = await getFetch(`/api/v01/ct/registroPacientes/documento/orden/${encodeURIComponent(nOrden)}`, token);
    return res && !res.error && res.nroDoc !== undefined ? res : null;
  } catch {
    return null;
  }
};

// Rótulo corto (para "DNI:") y nombre (para el texto de indicaciones) de cada tipo
const ROTULOS_DOCUMENTO = {
  [TIPO_DNI]: { etiquetaDoc: 'DNI', nombreDoc: 'DNI' },
  [TIPO_CARNE_EXTRANJERIA]: { etiquetaDoc: 'CE', nombreDoc: 'CARNÉ DE EXTRANJERÍA' },
  [TIPO_PASAPORTE]: { etiquetaDoc: 'PAS', nombreDoc: 'PASAPORTE' },
  [TIPO_SIN_DOCUMENTO]: { etiquetaDoc: 'DOC', nombreDoc: 'DOCUMENTO DE IDENTIDAD' },
};

// Datos de un PDF con el documento real: `dni` pasa a ser el número y se agregan etiquetaDoc / nombreDoc
// para los rótulos. Sin documento (no se encontró) los datos quedan igual y el PDF dice "DNI".
export const datosConDocumento = (datos, documento) => {
  const rotulos = documento && ROTULOS_DOCUMENTO[Number(documento.tipoDoc)];
  if (!rotulos) return datos;
  return {
    ...datos,
    ...rotulos,
    dni: Number(documento.tipoDoc) === TIPO_SIN_DOCUMENTO ? 'SIN DOCUMENTO' : documento.nroDoc || datos?.dni,
  };
};

// Mensaje de error del backend (registro y órdenes responden id = 0 con mensaje)
export const mensajeBackend = (res, porDefecto) => (res && res.id === 0 && res.mensaje ? res.mensaje : porDefecto);
