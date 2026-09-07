import { esProduccion } from "../views/config/config"

const DIAGNOSTICOS = {
    PRODUCCION: {
        OBESIDAD_TIPO_1: 3,
        OBESIDAD_TIPO_2: 4,
        OBESIDAD_TIPO_3: 1,
    },
    DESARROLLO: {
        OBESIDAD_TIPO_1: 42,
        OBESIDAD_TIPO_2: 52,
        OBESIDAD_TIPO_3: 2,
    },
}

export const DIAGNOSTICOS_RELACIONADOS =
    esProduccion
        ? DIAGNOSTICOS.PRODUCCION
        : DIAGNOSTICOS.DESARROLLO