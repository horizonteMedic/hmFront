import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { GetInfoPacDefault, LoadingDefault } from "../../../../utils/functionUtils";

const GetExamenes = '/api/v01/ct/campana/obtenerEstados'
const PostExamen = '/api/v01/ct/campana/registrarEstadoExamen'

const CLAVES_EXAMEN = ["toma_muestras", "examen_medico", "comp_radiografia", "comp_ekg"];

export const GetInfoPac = async (nro, set, token, sede, setEstados) => {
    LoadingDefault("Validando datos");
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            nombre: res.nombres ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            domicilioActual: res.direccion ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : res.genero === "F" ? "FEMENINO" : "",
        }));
        await GetExamenesCheck(nro, token, setEstados);
    }
};

const GetExamenesCheck = async (nro, token, setEstados) => {
    const res = await getFetch(`${GetExamenes}?nOrden=${nro}`, token);
    const lista = res?.resultado ?? [];
    console.log('lista', lista)
    // Backend devuelve nombreExamen en UPPERCASE → normalizamos a lowercase para comparar
    const mapaBackend = {};
    lista.forEach((item) => {
        mapaBackend[item.nombreExamen.toLowerCase()] = item.estado;
    });

    // Para cada clave: si existe en el backend → true/false; si no existe → null
    const estadosMapeados = {};
    CLAVES_EXAMEN.forEach((clave) => {
        estadosMapeados[clave] = Object.prototype.hasOwnProperty.call(mapaBackend, clave)
            ? mapaBackend[clave]
            : null;
    });

    setEstados(estadosMapeados);
};

export const RegistrarEstadoExamen = async (norden, nombreExamen, estado, usuarioRegistro, token) => {
    return await SubmitData(
        { norden: Number(norden), nombreExamen, estado, usuarioRegistro },
        PostExamen,
        token
    );
};
