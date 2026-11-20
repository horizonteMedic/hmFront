import { URLAzure } from "../../../../config/config";

// Error del endpoint con la forma que devuelve el backend:
// { codigo, estatus, resultado: { mensaje, detalle, codigo }, timestamp }
export class RegisterUserError extends Error {
    constructor({ status = 0, code = '', mensaje = '', detalle = '', network = false }) {
        super(mensaje || detalle || 'Error al registrar el usuario');
        this.name = 'RegisterUserError';
        this.status = status;   // HTTP status (0 si no hubo respuesta)
        this.code = code;       // resultado.codigo (VALIDATION_ERROR, NULL_POINTER_ERROR, ...)
        this.mensaje = mensaje;
        this.detalle = detalle;
        this.network = network; // true si fallo la conexión
    }
}

const parseJsonSafe = async (response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

/**
 * Registra un usuario. El endpoint responde con un token (AuthResponse) del usuario
 * creado: aquí se descarta a propósito para que nunca llegue al estado, a logs ni a storage.
 * Resuelve sin valor si se creó; si falla, lanza RegisterUserError.
 */
export default async function NewUser(username, password, estado, ruc, idEmpleado) {
    const data = {
        username: username,
        password: password,
        estado: estado,
        ruc: ruc,
        idEmpleado: idEmpleado
    };

    let response;
    try {
        response = await fetch(`${URLAzure}/api/v01/st/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch {
        throw new RegisterUserError({ network: true });
    }

    if (response.ok) {
        // Se consume el cuerpo para liberar la conexión, sin conservar el token.
        await parseJsonSafe(response);
        return;
    }

    const body = await parseJsonSafe(response);
    const resultado = body?.resultado ?? {};
    throw new RegisterUserError({
        status: response.status,
        code: resultado.codigo ?? '',
        mensaje: resultado.mensaje ?? '',
        detalle: resultado.detalle ?? ''
    });
}
