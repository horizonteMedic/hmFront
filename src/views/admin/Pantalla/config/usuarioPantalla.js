// Usuario de servicio con el que la pantalla se autentica sola (no hay login de personas).
// Es el mismo usuario que usa el formulario de Registro Único (RegistroUnico/Formulario.jsx).
export const USUARIO_PANTALLA = { nombre: "Pacientes", password: "123456" };

// Cada cuánto se vuelve a consultar el endpoint para refrescar la tabla.
export const INTERVALO_REFRESCO_MS = 60000;
