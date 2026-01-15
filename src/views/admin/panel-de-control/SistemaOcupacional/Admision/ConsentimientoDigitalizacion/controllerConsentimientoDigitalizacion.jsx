import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    handleSubirArchivoDefaultSinSellos,
    LoadingDefault,
    ReadArchivosFormDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../getFetch/getFetch";
import { generatePdf } from "./PdfGenerado";
import { VerifyHoF } from "../model/Submit";
import { SubmitConsentimiento } from "../model/Consentimiento";


const obtenerInfoConsentimientoUrl = "/api/v01/ct/consentDigit/infoFormatoConsentDigitalizado";
const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta"


export const GetInfoServicio = async (nro, tabla, set, token, sede, onFinish = () => { }) => {
    try {
        const res = await getFetch(
            `${obtenerInfoConsentimientoUrl}/${nro}`,
            token
        );

        if (res && res.dni) {
            set((prev) => ({
                ...prev,
                norden: nro,
                fecha: res.fecha_examen ?? "",
                nombres: res.nombres ?? "",
                dni: res.dni ?? "",

                SubirDoc: true,
                digitalizacion: res.digitalizacion
            }));
        } else {
            Swal.fire("Error", "Ha ocurrido un error", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Ha ocurrido un error", "error");
    } finally {
        onFinish();
    }
};

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res && res.dni) {
        set((prev) => ({
            ...prev,
            norden: nro,
            nombres: res.nombresApellidos ?? prev.nombres ?? "",
            dni: res.dni ?? prev.dni ?? "",
        }));
    }
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            GetInfoServicio(nro, tabla, set, token, sede, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con un consentimiento registrado.",
                    "warning"
                );
            });
        }
    );
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Ingrese Nro orden", "error");
        return;
    }

    LoadingDefault("Registrando Datos");

    const data = {
        user,
        norden: form.norden,
        fecha: form.fecha,
    };

    try {
        const res = await SubmitConsentimiento(data, token);

        if (res && res.norden) {
            limpiar();
            Swal.fire({
                title: "Exito",
                text: "Consentimiento guardado exitosamente,\n¿Desea Imprimir?",
                icon: "success",
                showCancelButton: true,
                cancelButtonText: "No",
            }).then((result) => {
                if (result.isConfirmed) {
                    PrintHojaR(form.norden, token, tabla);
                }
            });
        } else {
            Swal.fire("Error", "Ha ocurrido un error", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Ha ocurrido un error", "error");
    }
};

const PrintValidation = async (dni, orderNumber, token) => {
    try {
        const [Huella, Firma, jasper] = await Promise.all([
            VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${dni}/HUELLA`),
            VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${dni}/FIRMAP`),
            getFetch(
                `${obtenerInfoConsentimientoUrl}/${orderNumber}`,
                token
            ),
        ]);

        const huellaData = Huella.id === 1 ? { id: 1, url: Huella.mensaje } : { id: 0, url: "" };
        const firmaData = Firma.id === 1 ? { id: 1, url: Firma.mensaje } : { id: 0, url: "" };

        generatePdf({
            nombre: jasper.nombres,
            dni,
            orderNumber,
            FirmaP: firmaData,
            HuellaP: huellaData,
            token,
            jasper,
        });
    } catch (error) {
        Swal.fire("Error", "No se pudo generar el consentimiento", "error");
        console.error(error);
    } finally {
        Swal.close();
    }
};

export const PrintHojaR = async (nro, token, tabla, datosFooter) => {
    if (!nro) {
        await Swal.fire("Error", "Ingrese Nro orden", "error");
        return;
    }

    Swal.fire({
        title: "Generando Consentimiento",
        text: "Espere por favor...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const res = await getFetch(
            `${obtenerInfoConsentimientoUrl}/${nro}`,
            token
        );

        if (res && res.dni) {
            await PrintValidation(res.dni, nro, token);
        } else {
            Swal.fire("Error", "No existe un consentimiento con este N° de Orden", "error");
        }
    } catch (error) {
        Swal.fire("Error", "No se pudo generar el consentimiento", "error");
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};



export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
    handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
    ReadArchivosFormDefault(form, setVisualerOpen, token)
}
