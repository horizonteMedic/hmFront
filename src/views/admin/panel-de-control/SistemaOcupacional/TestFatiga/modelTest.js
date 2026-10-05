// Modelo del Test de Fatiga y Somnolencia.
// El backend guarda cada situación como 4 booleanos (rbs1Nunca, rbs1Poca, rbs1Moderada,
// rbs1Alta, ...). En el formulario cada situación es UN solo valor ("NUNCA" | "POCA" |
// "MODERADA" | "ALTA") para poder usar un grupo de radios; aquí se hace la conversión.

// `sufijo` es el final del nombre del booleano en el backend (rbs{n}{sufijo}).
export const OPCIONES_PROBABILIDAD = [
    { value: "NUNCA", label: "Nunca", sufijo: "Nunca", puntaje: 0 },
    { value: "POCA", label: "Poca", sufijo: "Poca", puntaje: 1 },
    { value: "MODERADA", label: "Moderada", sufijo: "Moderada", puntaje: 2 },
    { value: "ALTA", label: "Alta", sufijo: "Alta", puntaje: 3 },
];

export const PREGUNTAS_SITUACION = [
    { name: "rbs1", label: "1. Sentado leyendo" },
    { name: "rbs2", label: "2. Viendo televisión" },
    { name: "rbs3", label: "3. Sentado (por ejemplo en el teatro, en una reunión, en el cine, en una conferencia, escuchando misa o en el culto)" },
    { name: "rbs4", label: "4. Como pasajero en un automóvil, ómnibus, micro o combi durante una hora o menos de recorrido" },
    { name: "rbs5", label: "5. Recostado en la tarde si las circunstancias lo permiten" },
    { name: "rbs6", label: "6. Sentado conversando con alguien" },
    { name: "rbs7", label: "7. Sentado luego del almuerzo y sin haber bebido" },
    { name: "rbs8", label: "8. Conduciendo el automóvil cuando se detiene algunos minutos por razones de tráfico" },
    { name: "rbs9", label: "9. Parado y apoyándose o no en una pared o mueble" },
];

// Estado inicial de las 9 situaciones: todas en "Nunca" (igual que el formulario original).
export const RESPUESTAS_INICIALES = Object.fromEntries(
    PREGUNTAS_SITUACION.map(({ name }) => [name, "NUNCA"])
);

// Respuesta del backend (4 booleanos por situación) -> valor único por situación.
export const respuestasDesdeBackend = (res) =>
    Object.fromEntries(
        PREGUNTAS_SITUACION.map(({ name }) => {
            const opcion = OPCIONES_PROBABILIDAD.find((o) => res?.[`${name}${o.sufijo}`] === true);
            return [name, opcion ? opcion.value : ""];
        })
    );

// Valor único por situación -> 4 booleanos por situación (body del backend).
export const respuestasHaciaBackend = (form) =>
    Object.fromEntries(
        PREGUNTAS_SITUACION.flatMap(({ name }) =>
            OPCIONES_PROBABILIDAD.map((o) => [`${name}${o.sufijo}`, form[name] === o.value])
        )
    );

// Puntaje total = suma del puntaje de la opción elegida en cada situación.
export const calcularPuntaje = (form) =>
    PREGUNTAS_SITUACION.reduce((total, { name }) => {
        const opcion = OPCIONES_PROBABILIDAD.find((o) => o.value === form[name]);
        return total + (opcion ? opcion.puntaje : 0);
    }, 0);
