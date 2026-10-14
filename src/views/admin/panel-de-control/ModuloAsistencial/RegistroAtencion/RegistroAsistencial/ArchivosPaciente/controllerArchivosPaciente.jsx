import { SubmitData, getFetch } from "../../../../../../utils/apiHelpers";

const registrarArchivoUrl = "/api/v01/st/registros/registrarArchivoAsistencial";
const detalleArchivoUrl = "/api/v01/st/registros/detalleUrlArchivoAsistencial";

// Archivos del paciente asistencial: clave de UI -> tipo de archivo del backend y nombre con el
// que se guarda. Se envían como PNG (la firma y la huella se guardan con fondo transparente).
export const ARCHIVOS_PACIENTE = {
  firma: { tipoArchivo: "FIRMA_PACIENTE_ASISTENCIAL", nombreArchivo: "FirmaPaciente.png" },
  huella: { tipoArchivo: "HUELLA_PACIENTE_ASISTENCIAL", nombreArchivo: "HuellaPaciente.png" },
  foto: { tipoArchivo: "FOTO_PACIENTE", nombreArchivo: "FotoPaciente.png" },
};

export const SIN_ARCHIVO = { id: 0, url: "" };

// Registra (o reemplaza) un archivo del paciente identificado por su N° de Historia Clínica.
// Nunca rechaza: ante un fallo de red devuelve { id: 0 }, que los modales de captura
// (firma / huella / foto) interpretan como "no se pudo registrar" y avisan al usuario.
export const subirArchivoAsistencial = async ({ numeroHistoriaClinica, key, base64 }, token) => {
  const { tipoArchivo, nombreArchivo } = ARCHIVOS_PACIENTE[key];
  const body = { numeroHistoriaClinica, tipoArchivo, nombreArchivo, extension: ".png", base64 };

  try {
    return await SubmitData(body, registrarArchivoUrl, token);
  } catch (error) {
    console.error("registrarArchivoAsistencial ->", error);
    return { id: 0 };
  }
};

// Consulta si el paciente ya tiene el archivo: { id: 1, url } si existe, SIN_ARCHIVO si no.
// El backend responde { id, mensaje } -> id > 0 y mensaje = URL; id 0 y "Sin registro" si no hay.
export const consultarArchivoAsistencial = async (numeroHistoriaClinica, key, token) => {
  try {
    const res = await getFetch(
      `${detalleArchivoUrl}/${numeroHistoriaClinica}/${ARCHIVOS_PACIENTE[key].tipoArchivo}`,
      token
    );
    return res?.id && res.mensaje ? { id: 1, url: res.mensaje } : SIN_ARCHIVO;
  } catch (error) {
    console.error("detalleUrlArchivoAsistencial ->", error);
    return SIN_ARCHIVO;
  }
};
