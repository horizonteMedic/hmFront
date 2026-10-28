import { isValid, parse } from 'date-fns';

// ===== Listas fijas del formulario =====
export const OPCIONES_SEXO = ['MASCULINO', 'FEMENINO'];
export const SEXO_ETIQUETA = { M: 'MASCULINO', F: 'FEMENINO' };

export const NIVELES_ESTUDIO = [
    'ANALFABETO',
    'PRIMARIA COMPLETA',
    'PRIMARIA INCOMPLETA',
    'SECUNDARIA COMPLETA',
    'SECUNDARIA INCOMPLETA',
    'UNIVERSITARIO',
    'TECNICO',
];

export const ESTADOS_CIVILES = ['SOLTERO', 'CASADO', 'VIUDO', 'CONVIVIENTE', 'SEPARADO', 'DIVORCIADO'];

// campo del formulario -> nombre que se muestra en el aviso de "Faltan completar"
// (apellidosPa no es obligatorio: así funcionaba el formulario y se conserva)
export const CAMPOS_REQUERIDOS = {
    codPa: 'DNI/LM',
    nombresPa: 'Nombres',
    fechaNaciminetoPa: 'Fecha de nacimiento',
    sexoPa: 'Sexo',
    lugarNacPa: 'Lugar de nacimiento',
    nivelEstPa: 'Nivel de estudio',
    ocupacionPa: 'Profesión / ocupación',
    estadoCivilPa: 'Estado civil',
    direccionPa: 'Dirección',
    departamentoPa: 'Departamento',
    provinciaPa: 'Provincia',
    distritoPa: 'Distrito',
    celPa: 'Celular',
};

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
export const CAMPOS_EDITABLES = [
    'nombresPa',
    'apellidosPa',
    'fechaNaciminetoPa',
    'sexoPa',
    'emailPa',
    'lugarNacPa',
    'nivelEstPa',
    'ocupacionPa',
    'estadoCivilPa',
    'direccionPa',
    'departamentoPa',
    'provinciaPa',
    'distritoPa',
    'caserioPA',
    'telCasaPa',
    'celPa',
];

// Estado de un formulario en blanco. Los campos "ocultos" son del DTO del paciente pero el formulario
// no los muestra: se llenan al cargar un paciente existente y se reenvían tal cual al guardarlo.
export const crearDatosIniciales = () => ({
    codPa: '',
    nombresPa: '',
    apellidosPa: '',
    fechaNaciminetoPa: '',
    sexoPa: '',
    emailPa: '',
    lugarNacPa: '',
    nivelEstPa: '',
    ocupacionPa: '',
    estadoCivilPa: '',
    direccionPa: '',
    departamentoPa: '',
    provinciaPa: '',
    distritoPa: '',
    caserioPA: '',
    telCasaPa: '',
    celPa: '',

    // Campos del DTO que el formulario no muestra
    fotoPa: '',
    codAleatorioPa: '',
    telTrabajoPa: '',
    tipoDoc: '',
    cargo: '',
    area: '',
    tipoExamen: '',
    fechaRegistroPa: '',
    horaRegistroPa: '',

    // Control de UI: false = paciente nuevo / true = paciente ya registrado
    tieneRegistro: false,

    // Auditoría. El DTO del paciente solo trae fecha y hora de registro (fechaRegistroPa / horaRegistroPa):
    // no tiene usuario que registra ni datos de edición, así que esos campos quedan vacíos.
    userRegistro: '',
    fechaRegistro: '',
    usuarioActualizacion: '',
    fechaActualizacion: '',
});

const texto = (valor) => valor ?? '';

// "2026-10-24" (o "2026-10-24T00:00:00") -> "24-10-2026"
const aFechaGuiones = (fecha) => {
    if (!fecha) return '';
    const [yyyy, mm, dd] = String(fecha).slice(0, 10).split('-');
    return yyyy && mm && dd ? `${dd}-${mm}-${yyyy}` : '';
};

// ===== Mapeo: GET datosPaciente -> formulario =====
// RequestDatosPacienteDTO. null -> '' para que el resaltado de "campo editado" no confunda null con ''.
export const pacienteAFormulario = (res) => ({
    ...crearDatosIniciales(),
    codPa: String(texto(res.codPa)),
    nombresPa: texto(res.nombresPa),
    apellidosPa: texto(res.apellidosPa),
    fechaNaciminetoPa: aFechaGuiones(res.fechaNaciminetoPa),
    sexoPa: texto(res.sexoPa).charAt(0).toUpperCase(), // el backend guarda 'M' / 'F'
    emailPa: texto(res.emailPa),
    lugarNacPa: texto(res.lugarNacPa),
    nivelEstPa: texto(res.nivelEstPa),
    ocupacionPa: texto(res.ocupacionPa),
    estadoCivilPa: texto(res.estadoCivilPa),
    direccionPa: texto(res.direccionPa),
    departamentoPa: texto(res.departamentoPa),
    provinciaPa: texto(res.provinciaPa),
    distritoPa: texto(res.distritoPa),
    caserioPA: texto(res.caserioPA),
    telCasaPa: texto(res.telCasaPa),
    celPa: texto(res.celPa),

    fotoPa: texto(res.fotoPa),
    codAleatorioPa: texto(res.codAleatorioPa),
    telTrabajoPa: texto(res.telTrabajoPa),
    tipoDoc: texto(res.tipoDoc),
    cargo: texto(res.cargo),
    area: texto(res.area),
    tipoExamen: texto(res.tipoExamen),
    fechaRegistroPa: texto(res.fechaRegistroPa),
    horaRegistroPa: texto(res.horaRegistroPa),

    // Auditoría REAL: la creación es la fecha + hora de registro del paciente.
    fechaRegistro: res.fechaRegistroPa
        ? `${String(res.fechaRegistroPa).slice(0, 10)}T${String(res.horaRegistroPa || '00:00:00').slice(0, 12)}`
        : '',
    tieneRegistro: true,
});

// ===== Fecha de nacimiento: DD-MM-AAAA mientras se escribe =====
export const mascaraFechaNacimiento = (valor) => {
    const digitos = String(valor).replace(/\D/g, '').slice(0, 8);
    if (digitos.length >= 5) return digitos.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1-$2-$3');
    if (digitos.length >= 3) return digitos.replace(/(\d{2})(\d{0,2})/, '$1-$2');
    return digitos;
};

// DD-MM-AAAA, fecha real y no futura (el modelo la parte por '-' para enviarla como AAAA-MM-DD)
export const esFechaNacimientoValida = (fecha) => {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(fecha)) return false;
    const parsed = parse(fecha, 'dd-MM-yyyy', new Date());
    return isValid(parsed) && parsed <= new Date() && parsed.getFullYear() >= 1900;
};
