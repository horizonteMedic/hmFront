import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { GetInfoPacDefault, handleSubidaMasiva, handleSubirArchivoDefaultSinSellos, LoadingDefault, ReadArchivosFormDefault } from "../../../../utils/functionUtils";

const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta"

export const VerifyTR = async (nro, token, set, sede) => {
    GetInfoPac(nro, set, token, sede);
};

const GetInfoPac = async (nro, set, token, sede) => {
    Loading("Buscando paciente");
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : res.genero === "F" ? "FEMENINO" : "",
            SubirDoc: true,
        }));
    }
};

export const handleSubirArchivo = async (form, selectedSede, userlogued, token, nomenclatura = "") => {
    handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token, nomenclatura)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token, nomenclatura = null) => {
    ReadArchivosFormDefault(form, setVisualerOpen, token, nomenclatura)
}

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token, nomenclatura = "") => {
    handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token, nomenclatura)
}

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};