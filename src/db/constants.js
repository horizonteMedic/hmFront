import { esProduccion } from "../views/config/config"

const DIAGNOSTICOS = {
    BAJO_DE_PESO: {
        prod: 0, dev: 7
    },
    OBESIDAD_TIPO_1: {
        prod: 0, dev: 8
    },
    OBESIDAD_TIPO_2: {
        prod: 0, dev: 9
    },
    OBESIDAD_TIPO_3: {
        prod: 0, dev: 11,
    },
}

const ambiente = esProduccion ? "prod" : "dev"

export const DIAGNOSTICOS_RELACIONADOS = Object.fromEntries(
    Object.entries(DIAGNOSTICOS).map(([key, ids]) => [key, ids[ambiente]])
)

// Grupo de clasificación de IMC: sólo puede existir uno de estos a la vez.
export const GRUPO_DIAGNOSTICOS_IMC = [
    DIAGNOSTICOS_RELACIONADOS.BAJO_DE_PESO,
    DIAGNOSTICOS_RELACIONADOS.OBESIDAD_TIPO_1,
    DIAGNOSTICOS_RELACIONADOS.OBESIDAD_TIPO_2,
    DIAGNOSTICOS_RELACIONADOS.OBESIDAD_TIPO_3,
]

// Lista de grupos de diagnósticos relacionados mutuamente excluyentes:
// dentro de cada grupo sólo puede haber UN diagnóstico seleccionado a la vez.
// Para agregar un grupo nuevo basta con sumar otro arreglo de ids aquí.
export const GRUPOS_DIAGNOSTICOS_RELACIONADOS_UNICOS = [
    GRUPO_DIAGNOSTICOS_IMC,
]