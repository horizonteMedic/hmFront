// Quita tildes y caracteres no alfanuméricos: "Ñañez" -> "nanez"
const normalizar = (str) =>
  (str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

// Primera letra del nombre + primera palabra del apellido
export const generarUsername = (nombres, apellidos) => {
  const inicial = normalizar((nombres || '').trim().charAt(0));
  const primerApellido = normalizar((apellidos || '').trim().split(/\s+/)[0]);
  return `${inicial}${primerApellido}`;
};

const USERNAME_MIN = 3;
const PASSWORD_MIN = 4;

/** Valida el formulario antes de llamar al endpoint. Devuelve { campo: 'mensaje' } (vacío si todo está bien). */
export const validarRegistro = ({ idEmpleado, username, password }) => {
  const errores = {};

  if (!idEmpleado) {
    errores.documento = 'Busca un empleado por su N° de documento antes de registrar.';
  }

  const user = (username || '').trim();
  if (!user) {
    errores.username = 'Ingresa un nombre de usuario.';
  } else if (/\s/.test(user)) {
    errores.username = 'El usuario no puede contener espacios.';
  } else if (user.length < USERNAME_MIN) {
    errores.username = `El usuario debe tener al menos ${USERNAME_MIN} caracteres.`;
  }

  if (!password) {
    errores.password = 'Ingresa una contraseña.';
  } else if (password.length < PASSWORD_MIN) {
    errores.password = `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
  }

  return errores;
};

/**
 * Traduce un RegisterUserError a algo entendible para el usuario.
 * Devuelve { mensaje, campo? }: si trae `campo`, el mensaje se muestra también bajo ese input.
 */
export const interpretarErrorRegistro = (error) => {
  if (error?.network) {
    return { mensaje: 'No se pudo conectar con el servidor. Revisa tu conexión a internet e inténtalo nuevamente.' };
  }

  const texto = `${error?.mensaje ?? ''} ${error?.detalle ?? ''}`.toLowerCase();
  const status = error?.status ?? 0;

  if (status === 409 || /duplic|already|exist|unique|ya (existe|est[aá] registrad)/.test(texto)) {
    return {
      campo: 'username',
      mensaje: 'Ese nombre de usuario ya está en uso. Prueba con otro.'
    };
  }

  if (status === 401 || status === 403) {
    return { mensaje: 'No tienes permisos para registrar usuarios o tu sesión expiró. Vuelve a iniciar sesión.' };
  }

  if (status === 400) {
    return {
      mensaje: error.code === 'VALIDATION_ERROR' && error.detalle
        ? `Los datos no son válidos: ${error.detalle}`
        : 'Los datos enviados no son válidos. Revisa el formulario e inténtalo de nuevo.'
    };
  }

  if (status >= 500) {
    return {
      mensaje: 'El servidor no pudo completar el registro. Verifica que el nombre de usuario no esté en uso; si el problema continúa, contacta a sistemas.'
    };
  }

  return { mensaje: 'No se pudo registrar el usuario. Inténtalo nuevamente.' };
};
