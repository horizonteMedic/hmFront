import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const GetExamenURL = `/api/v01/st/registros/obtenerExistenciasExamenes`

export const GetInfoPac = async (nro, set, token, sede, ExamenesList) => {
    LoadingDefault("Validando datos");
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        console.log(res);
        set((prev) => ({
            ...prev,
            ...res,
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            domicilioActual: res.direccion ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : res.genero === "F" ? "FEMENINO" : "",
        }));
        GetExamenesCheck(nro, set, token, ExamenesList);
    }
};

const GetExamenesCheck = async (nro, set, token, ExamenesList) => {
    LoadingDefault("Cargando examenes");
    const res = await getFetch(`${GetExamenURL}?nOrden=${nro}`, token);
    if (res) {
        console.log(res);
        const listaActualizada = ExamenesList.map(examen => {
            const match = res.find(item => item.nameService === examen.tabla);
            return {
                ...examen,
                resultado: match ? match.existe : false
            };
        });
        console.log(listaActualizada);
        set(prev => ({
            ...prev,
            listaExamenes: listaActualizada
        }));
        Swal.close();
    }
};