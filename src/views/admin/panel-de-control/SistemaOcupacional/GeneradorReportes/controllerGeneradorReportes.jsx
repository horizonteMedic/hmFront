import Swal from "sweetalert2";
import { GetInfoPacDefault, LoadingDefault, ReadArchivosFormDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import FolioJasper from "../../../../jaspers/FolioJasper/FolioJasper";
import { ListaPorPlantilla } from "../Folio/Folio";

const GetExamenURL = `/api/v01/st/registros/obtenerExistenciasExamenes`
const GetExamenExterno = `/api/v01/st/registros/detalleUrlArchivos`
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

export const handleImprimirYSubirMasivo = async (examenes, form, token, selectedSede, userlogued, datosFooter, abortControllerRef, search) => {
    const lista = Array.isArray(examenes) ? examenes.filter((e) => e?.resultado) : [];
    if (!form?.norden || lista.length === 0) return;

    const decision = await Swal.fire({
        title: "Generar reportes",
        text: `Se generarán ${lista.length} reportes de la orden ${form.norden}.`,
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Generar y subir",
        denyButtonText: "Solo generar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        denyButtonColor: "#6b7280",
        cancelButtonColor: "#d33",
    });

    if (!decision.isConfirmed && !decision.isDenied) return;
    const subir = decision.isConfirmed;

    try {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        let generados = 0;
        let subidos = 0;
        let omitidosSinNomenclatura = 0;
        let fallidos = 0;
        let cancelado = false;

        Swal.fire({
            title: subir ? "Generando y subiendo" : "Generando",
            html: `0 / ${lista.length}`,
            allowOutsideClick: false,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            didOpen: () => {
                Swal.showLoading();
                const btn = Swal.getCancelButton();
                if (btn) btn.addEventListener("click", () => controller.abort());
            },
        });

        for (let i = 0; i < lista.length; i++) {
            const examen = lista[i];
            if (controller.signal.aborted) {
                cancelado = true;
                break;
            }

            Swal.update({
                html: `${i + 1} / ${lista.length}<br/><b>${examen.nombre}</b>`,
            });

            try {
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
                    true
                );

                generados += 1;

                if (!subir) continue;

                console.log("el examen es:", examen.nomenclaturaSubida)

                if (examen.nomenclaturaSubida == null || examen.nomenclaturaSubida === "") {
                    omitidosSinNomenclatura += 1;
                    continue;
                }

                const uploadRes = await subirArchivoDirecto(
                    pdfResult,
                    form,
                    examen.nomenclaturaSubida,
                    selectedSede,
                    userlogued,
                    token,
                    search,
                    { showLoading: false, showSuccessAlert: false, showErrorAlert: false, refreshAfterUpload: false }
                );

                if (uploadRes?.ok) subidos += 1;
                else fallidos += 1;
            } catch (error) {
                if (error?.name === "AbortError") {
                    cancelado = true;
                    break;
                }
                fallidos += 1;
            }
        }

        Swal.close();

        if (subir && subidos > 0) {
            await search();
        }

        const resumen = [
            `Generados: ${generados}`,
            subir ? `Subidos: ${subidos}` : null,
            `Fallidos: ${fallidos}`,
            "",
            cancelado ? "Estado: Cancelado" : "Estado: Finalizado",
        ]
            .filter(item => item !== null)
            .join("<br>");

        await Swal.fire({
            title: "Generación Finalizada",
            icon: cancelado ? "warning" : fallidos > 0 ? "warning" : "success",
            html: resumen,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
        });
    } catch (error) {
        if (error?.name === "AbortError") return;
        console.error("Error en handleImprimirYSubirMasivo:", error);
        Swal.fire("Error", "Hubo un problema al procesar los reportes.", "error");
    }
};

export const handleImprimirYSubir = async (examen, form, token, selectedSede, userlogued, datosFooter, abortControllerRef, search) => {
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
            true // No comprimido por defecto
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
            await subirArchivoDirecto(pdfResult, form, nomenclature, selectedSede, userlogued, token, search);
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

async function subirArchivoDirecto(pdfData, form, nomenclature, selectedSede, userlogued, token, search, options = {}) {
    try {
        const {
            showLoading = true,
            showSuccessAlert = true,
            showErrorAlert = true,
            refreshAfterUpload = true,
        } = options;

        if (showLoading) LoadingDefault("Subiendo archivo...");

        const blob = pdfData instanceof Blob ? pdfData : new Blob([pdfData], { type: "application/pdf" });

        // Convertir Blob a base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        const pdfBase64Final = await base64Promise;
        const nombreArchivo = `${form.norden}-${nomenclature}-${form.apellidos ?? ""} ${form.nombre ?? ""}.pdf`;

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
            if (refreshAfterUpload) search();
            if (showSuccessAlert) Swal.fire('¡Éxito!', 'Archivo subido correctamente.', 'success');
            return { ok: true, result };
        } else {
            throw new Error(result.mensaje || "Error desconocido al subir");
        }
    } catch (error) {
        console.error("Error al subir archivo:", error);
        const { showErrorAlert = true } = options;
        if (showErrorAlert) Swal.fire('Error', error.message || 'No se pudo subir el archivo.', 'error');
        return { ok: false, error };
    }
}
