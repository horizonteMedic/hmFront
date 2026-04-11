import { SubmitData } from "../../../../utils/apiHelpers"
import { LoadingDefault } from "../../../../utils/functionUtils"

const urlSubmit = '/api/v01/st/registros/matrizControlInterno2026'

export const SubmitValorizaciones = async (form, token,) => {
    const body = {
        "tipoPago": form.tipoPago,
        "contrata": form.razonContrata,
        "empresa": form.razonEmpresa,
        "fechaDesde": form.fechaInicio,
        "fechaHasta": form.fechaFinal
    };
    LoadingDefault('Realizando Busqueda')
    SubmitData(body, urlSubmit, token)
        .then((res) => {
            console.log(res)

        })
}