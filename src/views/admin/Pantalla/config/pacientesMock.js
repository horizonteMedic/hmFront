// Datos de demostración (se activan con `?demo` en la URL) para revisar el diseño sin backend.
// Se arman con la forma cruda del backend y pasan por la misma normalización que los datos reales.
import { normalizarOrden } from "../services/pantallaPacientesService";

const COLORES = [
    { letra: "A", hex: "#00FFFF" },
    { letra: "B", hex: "#3399FF" },
    { letra: "C", hex: "#FFCC00" },
    { letra: "D", hex: "#99CC33" },
    { letra: "E", hex: "#FF6699" },
];

// Exámenes por área, en el orden de las letras de `estados` (10 en total).
const AREAS_BASE = [
    { id: 1, nombre: "Triaje", examenes: ["Triaje"] },
    { id: 2, nombre: "Laboratorio", examenes: ["Hemograma", "Glucosa", "Orina"] },
    { id: 3, nombre: "Rayos X", examenes: ["Rx Tórax"] },
    { id: 4, nombre: "Audiometría", examenes: ["Audiometría"] },
    { id: 5, nombre: "Oftalmología", examenes: ["Agudeza visual", "Ishihara"] },
    { id: 6, nombre: "Psicología", examenes: ["Psicología"] },
    { id: 7, nombre: "Cardiología", examenes: ["EKG"] },
];

// `estados`: una letra por examen: "T" = ya pasó, "F" = pendiente, "-" = no está en su protocolo.
const orden = (id, nombres, estados) => {
    let posicion = 0;
    return {
        orden: id,
        nombres,
        fecha: "2026-10-26",
        hora: "09:00:00",
        textoColor: COLORES[id % COLORES.length].letra,
        codigoColor: COLORES[id % COLORES.length].hex,
        areas: AREAS_BASE.map((area) => ({
            id: area.id,
            nombre: area.nombre,
            examenes: area.examenes
                .map((nombre, i) => ({ id: i + 1, nombre, estado: estados[posicion++] }))
                .filter(({ estado }) => estado !== "-")
                .map(({ estado, ...examen }) => ({ ...examen, pasoExamen: estado === "T" })),
        })),
    };
};

export const PACIENTES_MOCK = [
    orden(1, "JUAN CARLOS PÉREZ QUISPE", "TTTTTTTFFF"),
    orden(2, "MARÍA FERNANDA HUAMÁN RÍOS", "TTTTT--TTT"),
    orden(3, "LUIS ALBERTO TORRES MENDOZA", "TFFFFFFFFF"),
    orden(4, "ANA LUCÍA VARGAS SALAZAR", "TTTTT-----"),
    orden(5, "JOSÉ MIGUEL CÁCERES DÍAZ", "TTTTTTTTFF"),
    orden(6, "ROSA ELENA FLORES MEDINA", "FFFF-FF---"),
    orden(7, "CARLOS EDUARDO RAMÍREZ SOTO", "TTTTTTTTTF"),
    orden(8, "PATRICIA GUTIÉRREZ LUNA", "TTTT-T---T"),
    orden(9, "MIGUEL ÁNGEL ROJAS CÁRDENAS", "TFTFTF----"),
    orden(10, "SOFÍA ALEJANDRA CASTILLO PAREDES", "TTFFFFFFFF"),
    orden(11, "DIEGO ARMANDO CHÁVEZ PONCE", "TTTFT-----"),
    orden(12, "GABRIELA MAMANI CONDORI", "FFFF------"),
    orden(13, "FERNANDO DELGADO ORTIZ", "TTTTTTFFFF"),
    orden(14, "LUCÍA VALENTINA ESPINOZA RIVAS", "TTTTTTTTTF"),
    orden(15, "RICARDO AGUILAR ZAMORA", "TFFFFFF-FF"),
    orden(16, "CARMEN ROSA NÚÑEZ BRAVO", "TTTT---TT-"),
    orden(17, "HÉCTOR MANUEL SALINAS CAMPOS", "TFFF------"),
    orden(18, "VALERIA MENDOZA ARCE", "TTTTTTTTFF"),
    orden(19, "ÓSCAR DAVID HERRERA PALACIOS", "TTFT------"),
    orden(20, "DANIELA PAMELA LEDESMA VIDAL", "TTTTTTTTTT"),
    orden(21, "VIVIANA AYDE DELGADO VEGA", "TFFF--F---"),
    orden(22, "PEDRO PABLO CRUZ LEÓN", "TTFFTT-F--"),
].map(normalizarOrden);
