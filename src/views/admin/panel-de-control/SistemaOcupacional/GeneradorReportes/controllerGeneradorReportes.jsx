import Swal from "sweetalert2";
import { GetInfoPacDefault, LoadingDefault, ReadArchivosFormDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import FolioJasper from "../../../../jaspers/FolioJasper/FolioJasper";
import { ListaPorPlantilla } from "../Folio/Folio";

const GetExamenURL = `/api/v01/st/registros/obtenerExistenciasExamenes`
const GetExamenExterno = `/api/v01/st/registros/detalleUrlArchivos`
const GetNomenclatura = `/api/v01/ct/fichaInterconsulta/obtenerEspecialidadesNomenclaturaFichaInterconsulta`
const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta"

export { ListaPorPlantilla };

export const GetInfoPac = async (nro, set, token, sede, ExamenesList) => {
    LoadingDefault("Validando datos");
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
            domicilioActual: res.direccion ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : res.genero === "F" ? "FEMENINO" : "",
        }));
        await GetExamenesCheck(nro, set, token, ExamenesList);

    }
};

const GetExamenesCheck = async (nro, set, token, ExamenesList) => {
    LoadingDefault("Cargando examenes");
    const listaFiltrada = ExamenesList.filter(exa => exa.nombre != "INTERCONSULTAS");
    try {
        const res = await getFetch(`${GetExamenURL}?nOrden=${nro}`, token);
        let listaActualizada = [...listaFiltrada];

        if (res) {
            const resArray = Object.values(res);
            listaActualizada = listaActualizada.map((examen) => {
                const match = resArray.find((item) => item.nameService === examen.tabla);
                return {
                    ...examen,
                    resultado: match ? match.existe : false,
                    imprimir: match ? match.existe : false,
                };
            });
        }

        const examenesConNomenclatura = listaActualizada.filter((examen) => examen.nomenclaturaSubida);
        const promesasArchivosExternos = examenesConNomenclatura.map((examen) =>
            getFetch(`${GetExamenExterno}/${nro}/${examen.nomenclaturaSubida}`, token)
                .then((response) => ({ nomenclaturaSubida: examen.nomenclaturaSubida, response }))
                .catch(() => ({ nomenclaturaSubida: examen.nomenclaturaSubida, response: null }))
        );

        const resultadosArchivosExternos = await Promise.all(promesasArchivosExternos);
        resultadosArchivosExternos.forEach(({ nomenclaturaSubida, response }) => {
            if (response?.id === 1) {
                listaActualizada = listaActualizada.map((examen) =>
                    examen.nomenclaturaSubida === nomenclaturaSubida
                        ? { ...examen, resultado: true, imprimir: true, urlArchivo: response.mensaje }
                        : examen
                );
            }
        });

        set((prev) => ({ ...prev, listaExamenes: listaActualizada }));
    } catch (error) {
        console.error("Error al cargar exámenes:", error);
    } finally {
        Swal.close();
    }
};

export const ReadArchivosForm = async (form, setVisualerOpen, token, nomenclatura = null) => {
    ReadArchivosFormDefault(form, setVisualerOpen, token, nomenclatura)
}

export const handleImprimirYSubir = async (examen, form, token, selectedSede, userlogued, datosFooter, abortControllerRef) => {
    try {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        Swal.fire({
            title: 'Generando Reporte',
            text: `Generando ${examen.nombre}...`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // Generar el PDF usando FolioJasper para un solo examen
        // Creamos una lista con solo este examen y marcamos imprimir=true
        const soloEsteExamen = [{ ...examen, imprimir: true, resultado: true }];

        const pdfResult = await FolioJasper(
            form.norden,
            token,
            soloEsteExamen,
            null,
            "INDIVIDUAL",
            controller.signal,
            form.nombres,
            form.apellidos,
            datosFooter,
            false // No comprimido por defecto
        );

        Swal.close();

        // Preguntar si desea subir el archivo
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás de acuerdo en subir el archivo?',
            text: `El reporte "${examen.nombre}" se subirá al sistema.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, subir',
            cancelButtonText: 'No, solo imprimir',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        });

        if (isConfirmed && examen.nomenclaturaSubida) {
            const nomenclature = examen.nomenclaturaSubida;

            // Preparar el form para handleSubirArchivoDefaultSinSellos
            // El componente espera que el archivo esté en form.SubirDoc (que es un booleano en SubidaArchivos)
            // Pero handleSubirArchivoDefaultSinSellos en realidad abre un selector de archivos si no se le pasa uno.
            // Necesitamos una forma de pasarle los bytes directamente.

            // Revisemos handleSubirArchivoDefaultSinSellos en functionUtils.js
            await subirArchivoDirecto(pdfResult, form, nomenclature, selectedSede, userlogued, token);
        }
        if (!examen.nomenclaturaSubida) {
            Swal.fire('Error', 'El examen no tiene nomenclatura subida.', 'error');
            return;
        }

    } catch (error) {
        if (error.name === 'AbortError') return;
        console.error("Error en handleImprimirYSubir:", error);
        Swal.fire('Error', 'Hubo un problema al procesar el reporte.', 'error');
    }
};

async function subirArchivoDirecto(pdfData, form, nomenclature, selectedSede, userlogued, token) {
    try {
        LoadingDefault("Subiendo archivo...");

        const blob = pdfData instanceof Blob ? pdfData : new Blob([pdfData], { type: "application/pdf" });

        // Convertir Blob a base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        const pdfBase64Final = await base64Promise;
        const nombreArchivo = `${form.norden}_${nomenclature}.pdf`;

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

            nombreArchivo: nombreArchivo,
            codigoSede: selectedSede,
            fileBase64: pdfBase64Final,
            nomenclatura_tipo_archivo: nomenclature,
            orden: form.norden,
            indice_carga_masiva: undefined,
        };

        const result = await SubmitData(datos, registrarPDF, token);

        if (result.id === 1 || result.id === "1") {
            Swal.fire('¡Éxito!', 'Archivo subido correctamente.', 'success');
        } else {
            throw new Error(result.mensaje || "Error desconocido al subir");
        }
    } catch (error) {
        console.error("Error al subir archivo:", error);
        Swal.fire('Error', error.message || 'No se pudo subir el archivo.', 'error');
    }
}
