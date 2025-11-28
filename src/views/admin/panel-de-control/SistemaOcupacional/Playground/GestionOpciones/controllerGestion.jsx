import Swal from "sweetalert2";
import { URLAzure } from "../../../../../config/config";

// URLs de los endpoints
const opcionesInterfazUrl = "/api/v01/ct/opcionesInterfaz";

/**
 * Función para mostrar loading
 */
export const Loading = (mensaje = "Cargando...") => {
    Swal.fire({
        title: mensaje,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

/**
 * Función para validar los datos antes de enviar
 */
const validarDatosOpcion = (datos) => {
    const errores = [];

    if (!datos.nombre || datos.nombre.trim() === "") {
        errores.push("El nombre es requerido");
    }

    if (datos.descripcion === undefined || datos.descripcion === null) {
        errores.push("La descripción es requerida");
    }

    if (typeof datos.estado !== "boolean") {
        errores.push("El estado debe ser un valor booleano");
    }

    if (typeof datos.nivel !== "number" || Number.isNaN(datos.nivel)) {
        errores.push("El nivel debe ser un número válido");
    }

    if (datos.idPadre !== null && typeof datos.idPadre !== "number") {
        errores.push("El ID del padre debe ser un número o null");
    }

    if (!datos.fechaRegistro || !datos.fechaRegistro.match(/^\d{4}-\d{2}-\d{2}$/)) {
        errores.push("La fecha de registro debe tener formato YYYY-MM-DD");
    }

    if (!datos.userRegistro || datos.userRegistro.trim() === "") {
        errores.push("El usuario de registro es requerido");
    }

    if (datos.fechaActualizacion && !datos.fechaActualizacion.match(/^\d{4}-\d{2}-\d{2}$/)) {
        errores.push("La fecha de actualización debe tener formato YYYY-MM-DD");
    }

    if (datos.fechaActualizacion && (!datos.userActualizacion || datos.userActualizacion.trim() === "")) {
        errores.push("El usuario de actualización es requerido cuando hay fecha de actualización");
    }

    return errores;
};

/**
 * Función para obtener todas las opciones de interfaz
 */
export const obtenerOpcionesInterfaz = async (token) => {
    try {
        Loading("Obteniendo opciones...");

        const urlCompleta = `${URLAzure}${opcionesInterfazUrl}`;
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(urlCompleta, options);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        Swal.close();

        return data;
    } catch (error) {
        console.error("Error al obtener opciones de interfaz:", error);
        Swal.fire(
            "Error",
            `Error al obtener las opciones: ${error.message}`,
            "error"
        );
        return null;
    }
};

/**
 * Función para registrar una nueva opción de interfaz
 */
export const registrarOpcionInterfaz = async (datosOpcion, token) => {
    try {
        // Validar datos antes de enviar
        const errores = validarDatosOpcion(datosOpcion);
        if (errores.length > 0) {
            await Swal.fire("Error de Validación", errores.join("\n"), "error");
            return null;
        }

        Loading("Registrando nueva opción...");

        const body = {
            nombre: datosOpcion.nombre.trim(),
            rutaVista: datosOpcion.rutaVista || null,
            descripcion: datosOpcion.descripcion.trim(),
            estado: datosOpcion.estado,
            nivel: datosOpcion.nivel,
            idPadre: datosOpcion.idPadre,
            fechaRegistro: datosOpcion.fechaRegistro,
            userRegistro: datosOpcion.userRegistro.trim(),
            fechaActualizacion: datosOpcion.fechaActualizacion || null,
            userActualizacion: datosOpcion.userActualizacion ? datosOpcion.userActualizacion.trim() : null,
        };

        const urlCompleta = `${URLAzure}${opcionesInterfazUrl}`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        };

        const response = await fetch(urlCompleta, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        await Swal.fire(
            "Éxito",
            "La opción ha sido registrada correctamente",
            "success"
        );

        return data;
    } catch (error) {
        console.error("Error al registrar opción de interfaz:", error);
        await Swal.fire(
            "Error",
            `Error al registrar la opción: ${error.message}`,
            "error"
        );
        return null;
    }
};

/**
 * Función para actualizar una opción de interfaz existente
 */
export const actualizarOpcionInterfaz = async (id, datosOpcion, token) => {
    try {
        if (!id || typeof id !== "number") {
            await Swal.fire("Error", "ID de opción inválido", "error");
            return null;
        }

        // Validar datos antes de enviar
        const errores = validarDatosOpcion(datosOpcion);
        if (errores.length > 0) {
            await Swal.fire("Error de Validación", errores.join("\n"), "error");
            return null;
        }

        Loading("Actualizando opción...");

        const body = {
            id: id,
            nombre: datosOpcion.nombre.trim(),
            rutaVista: datosOpcion.rutaVista || null,
            descripcion: datosOpcion.descripcion.trim(),
            estado: datosOpcion.estado,
            nivel: datosOpcion.nivel,
            idPadre: datosOpcion.idPadre,
            fechaRegistro: datosOpcion.fechaRegistro,
            userRegistro: datosOpcion.userRegistro.trim(),
            fechaActualizacion: datosOpcion.fechaActualizacion,
            userActualizacion: datosOpcion.userActualizacion.trim(),
        };

        const urlCompleta = `${URLAzure}${opcionesInterfazUrl}/${id}`;
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        };

        const response = await fetch(urlCompleta, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        await Swal.fire(
            "Éxito",
            "La opción ha sido actualizada correctamente",
            "success"
        );

        return data;
    } catch (error) {
        console.error("Error al actualizar opción de interfaz:", error);
        await Swal.fire(
            "Error",
            `Error al actualizar la opción: ${error.message}`,
            "error"
        );
        return null;
    }
};

/**
 * Función para obtener la fecha actual en formato YYYY-MM-DD
 */
export const obtenerFechaActual = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
};

/**
 * Función para preparar datos de nueva opción con valores por defecto
 */
export const prepararDatosNuevaOpcion = (datosFormulario, usuario) => {
    const fechaActual = obtenerFechaActual();

    return {
        nombre: datosFormulario.nombre,
        rutaVista: datosFormulario.rutaVista || null,
        descripcion: datosFormulario.descripcion || "",
        estado: datosFormulario.estado !== undefined ? datosFormulario.estado : true,
        nivel: datosFormulario.nivel,
        idPadre: datosFormulario.idPadre || null,
        fechaRegistro: fechaActual,
        userRegistro: usuario,
        fechaActualizacion: null,
        userActualizacion: null,
    };
};

/**
 * Función para preparar datos de actualización de opción
 */
export const prepararDatosActualizacionOpcion = (datosFormulario, datosOriginales, usuario) => {
    const fechaActual = obtenerFechaActual();

    return {
        nombre: datosFormulario.nombre,
        rutaVista: datosFormulario.rutaVista || null,
        descripcion: datosFormulario.descripcion || "",
        estado: datosFormulario.estado !== undefined ? datosFormulario.estado : true,
        nivel: datosFormulario.nivel,
        idPadre: datosFormulario.idPadre || null,
        fechaRegistro: datosOriginales.fechaRegistro,
        userRegistro: datosOriginales.userRegistro,
        fechaActualizacion: fechaActual,
        userActualizacion: usuario,
    };
};

/**
 * Función para eliminar una opción de interfaz
 */
export const eliminarOpcionInterfaz = async (id, token) => {
    try {
        if (!id || typeof id !== "number") {
            await Swal.fire("Error", "ID de opción inválido", "error");
            return null;
        }

        // Primera confirmación
        const primeraConfirmacion = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará la opción seleccionada",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
        });

        if (!primeraConfirmacion.isConfirmed) {
            return null;
        }

        // Segunda confirmación
        const segundaConfirmacion = await Swal.fire({
            title: "¡Confirmación final!",
            text: "Esta acción no se puede deshacer. ¿Realmente deseas eliminar esta opción?",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar definitivamente",
            cancelButtonText: "No, cancelar"
        });

        if (!segundaConfirmacion.isConfirmed) {
            return null;
        }

        Loading("Eliminando opción...");

        const urlCompleta = `${URLAzure}${opcionesInterfazUrl}/${id}`;
        const options = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(urlCompleta, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`);
        }

        await Swal.fire(
            "¡Eliminado!",
            "La opción ha sido eliminada correctamente",
            "success"
        );

        return true;
    } catch (error) {
        console.error("Error al eliminar opción de interfaz:", error);
        await Swal.fire(
            "Error",
            `Error al eliminar la opción: ${error.message}`,
            "error"
        );
        return null;
    }
};

/**
 * Función para manejar errores de red
 */
export const manejarErrorRed = (error) => {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
        return "Error de conexión. Verifique su conexión a internet.";
    }

    if (error.message.includes("401")) {
        return "No autorizado. Su sesión puede haber expirado.";
    }

    if (error.message.includes("403")) {
        return "No tiene permisos para realizar esta acción.";
    }

    if (error.message.includes("404")) {
        return "Recurso no encontrado.";
    }

    if (error.message.includes("500")) {
        return "Error interno del servidor. Intente nuevamente más tarde.";
    }

    return error.message || "Error desconocido";
};
