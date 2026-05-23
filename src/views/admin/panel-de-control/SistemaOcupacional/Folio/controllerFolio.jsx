import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    LoadingDefault,
    PrintHojaRDefault,
    PrintHojaRJsReportDefault,
    ReadArchivosFormDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { deleteArchivoPorOrdenNomenclatura, getFetch, SubmitData, SubmitDataManejo } from "../../../../utils/apiHelpers";
import { Loading } from "../Anexo2/controllerAnexo2";

const GetExamenURL = `/api/v01/st/registros/obtenerExistenciasExamenes`
const GetExamenExterno = `/api/v01/st/registros/detalleUrlArchivos`
const GetNomenclatura = `/api/v01/ct/fichaInterconsulta/obtenerEspecialidadesNomenclaturaFichaInterconsulta`

const registrarUrl = "/api/v01/ct/asignarFirma/registrarActualizarOrdenOcupacionalFirma";
const obtenerUrl = "/api/v01/ct/asignarFirma/obtenerOrdenOcupacionalFirmaPorNOrden"


//CAMO 
const obtenerReporteJsCAMO2ReportUrl = "/api/v01/ct/anexos/fichaAnexo2/descargarReporteFichaAnexo2"
const obtenerReporteJsCAMO16ReportUrl = "/api/v01/ct/anexos/descargarReporteFichaAptitudAnexo16"

const Anexo16URL = "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16";
const Anexo2URL = "/api/v01/ct/anexos/anexo2/obtenerReporteAnexo2Completo";

const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta";

export const nombresExamen = {
    ANUAL: "EMOA",
    REUBICACION: "EMPO",
    RETIRO: "EMOR",
    "PRE-OCUPACIONAL": "EMPO",
    "TEST-ALTURA": "TEST ALTURA",
    "PSICOSENSOMETRIA": "PSICOSENSOMETRICO",
    "MANIPULADOR-ALIMENTOS": "MANIPULADOR ALIMENTOS",
    "ANEXO 16A": "ANEXO 16A",
    "PSICOSENSOMETRICO ADMISION": "PSICOSENSOMETRICO",
    "TEST ALTURA ADMISION": "TEST ALTURA",
}

export const GetArchivosFolioStatus = async (nOrden, token) => {
    if (!nOrden) return [];

    try {
        LoadingDefault("Cargando archivos del folio");

        const entries = Object.entries(nombresExamen);
        const results = await Promise.all(
            entries.map(async ([tipo, nomenclatura]) => {
                try {
                    const response = await getFetch(`${GetExamenExterno}/${nOrden}/${nomenclatura}`, token);
                    const existe = response?.id === 1 || response?.id === "1";
                    return {
                        tipo,
                        nomenclatura,
                        existe,
                        url: existe ? response?.mensaje : null,
                        nombreArchivo: existe ? response?.nombreArchivo : null,
                    };
                } catch (error) {
                    console.error(`Error al consultar archivo ${nomenclatura}:`, error);
                    return {
                        tipo,
                        nomenclatura,
                        existe: false,
                        url: null,
                        nombreArchivo: null,
                    };
                }
            })
        );

        return results;
    } catch (error) {
        console.error("Error al consultar archivos del folio:", error);
        return [];
    } finally {
        Swal.close();
    }
};

export const DeleteArchivoFolio = async (nOrden, nomenclatura, token) => {
    if (!nOrden || !nomenclatura) return null;

    try {
        LoadingDefault("Eliminando archivo");
        return await deleteArchivoPorOrdenNomenclatura(nOrden, nomenclatura, token);
    } catch (error) {
        console.error("Error al eliminar archivo del folio:", error);
        return null;
    } finally {
        Swal.close();
    }
};

export const ReadArchivoFolio = async (form, setVisualerOpen, token, nomenclatura) => {
    return ReadArchivosFormDefault(form, setVisualerOpen, token, nomenclatura);
};

export async function subirArchivoFolio(archivoData, { form, nomenclature, selectedSede, userlogued, token }) {
    try {
        LoadingDefault("Subiendo archivo...");

        const blob = archivoData instanceof Blob
            ? archivoData
            : new Blob([archivoData], { type: "application/pdf" });

        const reader = new FileReader();
        const pdfBase64Final = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        const apellidos = (form?.apellidos ?? "").trim();
        const nombres = (form?.nombres ?? form?.nombre ?? "").trim();
        const nombreArchivo = `${form?.norden}-${nomenclature}-${apellidos}${apellidos && nombres ? " " : ""}${nombres}.pdf`;

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const day = ("0" + currentDate.getDate()).slice(-2);

        const datos = {
            rutaArchivo: null,
            dni: null,
            historiaClinica: null,
            servidor: "azure",
            estado: true,
            fechaRegistro: `${year}-${month}-${day}`,
            userRegistro: userlogued,
            fechaActualizacion: null,
            userActualizacion: null,
            id_tipo_archivo: null,
            nombreArchivo,
            codigoSede: selectedSede,
            fileBase64: pdfBase64Final,
            nomenclatura_tipo_archivo: nomenclature,
            orden: form?.norden,
            indice_carga_masiva: undefined,
        };

        const result = await SubmitData(datos, registrarPDF, token);

        if (result?.id === 1 || result?.id === "1") {
            Swal.fire("¡Éxito!", "Archivo subido correctamente.", "success");
            return { ok: true, result };
        }

        throw new Error(result?.mensaje || "Error desconocido al subir");
    } catch (error) {
        console.error("Error al subir archivo:", error);
        Swal.fire("Error", error?.message || "No se pudo subir el archivo.", "error");
        return { ok: false, error };
    }
}

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
    const existeInterconsultas = ExamenesList.some(exa => exa.nombre == "INTERCONSULTAS");
    const listaFiltrada = ExamenesList.filter(exa => exa.nombre != "INTERCONSULTAS");//limpiar interconsulta
    try {
        const res = await getFetch(`${GetExamenURL}?nOrden=${nro}`, token);

        let listaActualizada = [...listaFiltrada];

        // 🔹 Procesar exámenes generales
        if (res) {
            const resArray = Object.values(res);

            listaActualizada = listaActualizada.map((examen) => {
                const match = resArray.find(
                    (item) => item.nameService === examen.tabla
                );

                return {
                    ...examen,
                    resultado: match ? match.existe : false,
                    imprimir: match ? match.existe : false,
                };
            });
        }

        // 🔹 Procesar INTERCONSULTAS
        try {

            if (existeInterconsultas) { //SI EXISTE
                const interconsultasResponse = await getFetch(`${GetNomenclatura}?nOrden=${nro}`, token);
                console.log("interconsultasResponse", interconsultasResponse);
                // Validar si la respuesta tiene contenido y si al menos uno tiene nomenclatura
                if (interconsultasResponse?.resultado && Array.isArray(interconsultasResponse.resultado)) {
                    const interconsultasConNomenclatura = interconsultasResponse.resultado.filter(
                        (item) => item.nomenclatura && item.nomenclatura.trim() !== ""
                    );
                    console.log("interconsultasConNomenclatura", interconsultasConNomenclatura);
                    // Si hay interconsultas con nomenclatura, agregarlas al final de la lista
                    if (interconsultasConNomenclatura.length > 0) {
                        const interconsultasFormateadas = interconsultasConNomenclatura.map((item) => ({
                            nombre: `INTERCONSULTA - ${item.especialidad}`,
                            resultado: true,
                            imprimir: true,
                            tabla: item.nomenclatura,
                            nomenclatura: item.nomenclatura,
                        }));

                        // Agregar interconsultas al final de la lista
                        listaActualizada = [...listaActualizada, ...interconsultasFormateadas];
                    }
                }
            }
        } catch (error) {
            console.error("Error al cargar interconsultas:", error);
            // No detenemos el flujo si falla la carga de interconsultas
        }

        // 🔹 Procesar ARCHIVOS EXTERNOS (dinámico por nomenclatura)
        // Filtrar exámenes que tienen nomenclatura
        const examenesConNomenclatura = listaActualizada.filter(
            (examen) => examen.nomenclatura
        );
        // Hacer todas las llamadas en paralelo
        const promesasArchivosExternos = examenesConNomenclatura.map((examen) =>
            getFetch(`${GetExamenExterno}/${nro}/${examen.nomenclatura}`, token)
                .then((response) => ({
                    nomenclatura: examen.nomenclatura,
                    tabla: examen.tabla,
                    response,
                }))
                .catch((error) => {
                    console.error(`Error al cargar ${examen.nomenclatura}:`, error);
                    return { nomenclatura: examen.nomenclatura, tabla: examen.tabla, response: null };
                })
        );

        const resultadosArchivosExternos = await Promise.all(promesasArchivosExternos);

        // Actualizar lista con los resultados de archivos externos
        resultadosArchivosExternos.forEach(({ tabla, response }) => {
            if (response?.id === 1) {
                listaActualizada = listaActualizada.map((examen) =>
                    examen.tabla === tabla
                        ? {
                            ...examen,
                            resultado: true,
                            imprimir: true,
                            url: response.mensaje,
                        }
                        : examen
                );
            }
        });



        // 🔹 Set final (un solo render)
        set((prev) => ({
            ...prev,
            listaExamenes: listaActualizada,
        }));

    } catch (error) {
        console.error("Error al cargar exámenes:", error);
    } finally {
        Swal.close();
    }

};

export const GetFirmasAsignadasGeneral = async (nro, token) => {
    try {
        const res = await getFetch(
            `${obtenerUrl}?nOrden=${nro}`,
            token
        );
        return res;
    } catch (error) {
        console.log(error)
        return null;
    }
};
export const obtenerFirmas = async (nro, token, set) => {
    try {
        const res = await GetFirmasAsignadasGeneral(nro, token);
        if (res && res.resultado) {
            console.log("res", res.resultado);
            set(prev => ({
                ...prev,
                user_medicoFirma: res.resultado.profesional,
                idFirma: res.resultado.id,
            }))
        }
    } catch (error) {
        throw error;
    } finally {
        Swal.close();
    }
}

export const SubmitDataService = async (
    token,
    finallyFun = () => { },
    form,
    userlogued
) => {
    try {
        LoadingDefault("Registrando Datos");
        const body = {
            id: form.idFirma,
            norden: form.norden,
            profesional: form.user_medicoFirma,
            doctorAsignado: "",
            doctorExtra: "",
            usuarioRegistro: form.idFirma == null ? userlogued : null,
            usuarioActualizacion: form.idFirma == null ? null : userlogued
        }

        const res = await SubmitDataManejo(body, registrarUrl, token)
        Swal.fire({
            title: "Exito",
            text: `${res.resultado ?? ""}`,
            icon: "success",
        })
        finallyFun();
    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Ocurrio un error al registrar los datos", "error");
        return null;
    }
};

// export const PrintHojaRAnexo2 = (nro, token, datosFooter) => {
//     const jasperModules = import.meta.glob(
//         "../../../../jaspers/Ficha_Anexo2/*.jsx"
//     );
//     PrintHojaRDefault(
//         nro,
//         token,
//         "aptitud_medico_ocupacional_agro",
//         datosFooter,
//         obtenerUrlCAMO2,
//         jasperModules,
//         "../../../../jaspers/Ficha_Anexo2"
//     );
// };

// export const PrintHojaRAnexo16 = (nro, token, datosFooter) => {
//     const jasperModules = import.meta.glob(
//         "../../../../jaspers/Ficha_Anexo16/*.jsx"
//     );
//     PrintHojaRDefault(
//         nro,
//         token,
//         "certificado_aptitud_medico_ocupacional",
//         datosFooter,
//         obtenerUrlCAMO16,
//         jasperModules,
//         "../../../../jaspers/Ficha_Anexo16"
//     );
// };
export const PrintHojaRAnexo16 = (nro, token, datosFooter) => {
    Loading("Cargando Formato a Imprimir");
    getFetch(
        `${Anexo16URL}?nOrden=${nro}&nameService=anexo7c`,
        token
    ).then(async (res) => {
        if (res.norden_n_orden) {
            const nombre = res.nameJasper;
            console.log(nombre);
            const jasperModules = import.meta.glob(
                "../../../../jaspers/Anexo16/*.jsx"
            );
            const modulo = await jasperModules[
                `../../../../jaspers/Anexo16/${nombre}.jsx`
            ]();

            // Ejecuta la función exportada por default con los datos
            if (typeof modulo.default === "function") {
                modulo.default({ ...res, datosFooter });
            } else {
                console.error(
                    `El archivo ${nombre}.jsx no exporta una función por defecto`
                );
            }
            Swal.close();
        } else {
            Swal.close();
        }
    });
    /*PrintHojaRJsReportDefault(
        nro,
        token,
        "anexo7c",
        obtenerReporteJsCAMO16ReportUrl
    );*/
};
export const PrintHojaRAnexo2 = (nro, token, datosFooter) => {
    Loading("Cargando Formato a Imprimir");
    getFetch(
        `${Anexo2URL}?nOrden=${nro}&nameService=certificado_aptitud_medico_ocupacional&esJasper=true`,
        token
    ).then(async (res) => {
        if (res.norden_n_orden) {
            // const nombre = res.nameJasper;
            const nombre = "Anexo2";
            console.log(nombre);
            const jasperModules = import.meta.glob(
                "../../../../jaspers/Anexo2/*.jsx"
            );
            const modulo = await jasperModules[
                `../../../../jaspers/Anexo2/${nombre}.jsx`
            ]();

            //Ejecuta la función exportada por default con los datos
            if (typeof modulo.default === "function") {
                modulo.default({ ...res, datosFooter });
            } else {
                console.error(
                    `El archivo ${nombre}.jsx no exporta una función por defecto`
                );
            }
            Swal.close();
        } else {
            Swal.close();
        }
    });
    /*PrintHojaRJsReportDefault(
        nro,
        token,
        "certificado_aptitud_medico_ocupacional",
        obtenerReporteJsCAMO2ReportUrl
    );*/
};
