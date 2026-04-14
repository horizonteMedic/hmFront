import Swal from "sweetalert2";
import { SubmitData } from "../../../../utils/apiHelpers"
import { LoadingDefault } from "../../../../utils/functionUtils"

const urlSubmit = '/api/v01/st/registros/matrizControlInterno2026'
const urlSubmitPerso = '/api/v01/st/registros/matrizControlInterno2026Examenes'

export const SubmitValorizaciones = async (form, token, setData) => {
    const body = {
        "tipoPago": form.tipoPago,
        "contrata": form.razonContrata,
        "empresa": form.razonEmpresa,
        "fechaDesde": form.fechaInicio,
        "fechaHasta": form.fechaFinal
    };
    const url = form.TipoBusqueda ? urlSubmit : urlSubmitPerso
    LoadingDefault('Realizando Busqueda')
    SubmitData(body, url, token)
        .then((res) => {
            if (Array.isArray(res) && res.length > 0) {
                console.log(res)
                setData(res)
                setData(prev =>
                    prev.map(col => ({
                        ...col,
                        valor: true
                    })))
                Swal.close()
            } else {
                Swal.fire("Error", "No se Encontrearon Registros", "error")
            }
        })
        .catch(() => {
            Swal.fire("Error", "Ocurrio un error en la consulta", "error")
        })
}