import { getFetch } from "../getFetch/getFetch";
import Triaje from "../SistemaOcupacional/Triaje/Triaje";
import { GetListTriajeMult } from "../SistemaOcupacional/Triaje/Controller";

// Qué abre cada examen del protocolo según su `referenciaNp`; los que no estén aquí aún no son clicables.
//  - Formulario: recibe `nOrdenInicial` (carga esa orden) y `onGuardado` (se llama al registrar el examen).
//  - verReporte(orden, token): abre el reporte del examen ya realizado.
const FORMULARIOS = {
    triaje: {
        titulo: "Triaje",
        Formulario: Triaje,
        verReporte: (orden, token) => GetListTriajeMult(orden, null, getFetch, token, true),
    },
};

export const formularioDe = (examen) =>
    Object.hasOwn(FORMULARIOS, examen.referenciaNp) ? FORMULARIOS[examen.referenciaNp] : undefined;
