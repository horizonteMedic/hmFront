import Swal from "sweetalert2";
import { getFetch, getFetchManejo, SubmitData, SubmitDataManejo } from "./apiHelpers";
import { colocarSellosEnPdf, getSign, uint8ToBase64, optimizePdf, imagenToPdf, imagenToPdfA4 } from "./helpers";
import { PDFDocument } from "pdf-lib";

export const LoadingDefault = (text) => {
    Swal.fire({
        title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
        html: `<div style="font-size:1.1em;"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
        icon: "info",
        background: "#f0f6ff",
        color: "#22223b",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        customClass: {
            popup: "swal2-border-radius",
            title: "swal2-title-custom",
            htmlContainer: "swal2-html-custom",
        },
        showClass: {
            popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
            popup: "animate__animated animate__fadeOutUp",
        },
        didOpen: () => {
            Swal.showLoading();
        },
    });
};
export const GetInfoPacDefault = async (nro, token, sede) => {
    try {
        const res = await getFetch(
            `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
            token
        );

        return res; // 🔹 ahora retorna la respuesta
    } catch (error) {
        Swal.fire(
            "Error",
            "Paciente no encontrado",
            "error"
        );
        throw error;
    } finally {
        Swal.close();
    }
};
export const PrintHojaRDefault = (nro, token, tabla, datosFooter, obtenerReporteUrl, jasperModules, nombreCarpeta) => {

    LoadingDefault("Cargando Formato a Imprimir");

    getFetch(
        `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
        token
    )
        .then(async (res) => {
            // Manejar errores de la respuesta
            if (res.error) {
                console.error("Error en la respuesta del servidor:", res);
                Swal.fire(
                    "Error",
                    `No se pudo obtener el reporte. ${res.status === 404 ? 'El endpoint no existe o no hay datos.' : `Error ${res.status}: ${res.statusText || res.message || 'Error desconocido'}`}`,
                    "error"
                );
                Swal.close();
                return;
            }

            if (res.norden || res.norden_n_orden || res.n_orden) {
                if (!(res.dataPrincipal ?? true)) {
                    Swal.fire(
                        "Error",
                        "No existe registro",
                        "error"
                    );
                    return;
                }
                const nombre = res.nameJasper || res.namejasper;
                console.log("Nombre Jasper recibido:", nombre);
                console.log("Nombre Carpeta:", nombreCarpeta);

                if (!nombre || !nombreCarpeta) {
                    console.error("Faltan datos necesarios:", { nombre, nombreCarpeta });
                    Swal.fire("Error", "Error al obtener el formato de impresión", "error");
                    Swal.close();
                    return;
                }

                // Construir la ruta completa
                const rutaCompleta = `${nombreCarpeta}/${nombre}.jsx`;
                console.log("Ruta completa construida:", rutaCompleta);

                // Verificar las claves disponibles
                const clavesDisponibles = Object.keys(jasperModules);
                console.log("Claves disponibles en jasperModules:", clavesDisponibles);

                // Intentar encontrar el módulo
                let moduloFunc = jasperModules[rutaCompleta];

                // Si no se encuentra la ruta exacta, buscar por nombre del archivo
                if (!moduloFunc) {
                    console.warn(`No se encontró la ruta exacta: ${rutaCompleta}`);
                    // Buscar cualquier clave que contenga el nombre (sin extensión)
                    const nombreSinExtension = nombre.replace(/\.jsx?$/, '');
                    // Extraer palabras clave del nombre (ej: "Informe_Lab_panel4D" -> ["panel", "4d"])
                    const palabrasClave = nombreSinExtension.toLowerCase()
                        .replace(/informe|lab|_/g, ' ')
                        .split(/\s+/)
                        .filter(p => p.length > 0);

                    const claveEncontrada = clavesDisponibles.find(key => {
                        const nombreArchivo = key.split('/').pop().replace(/\.jsx?$/, '').toLowerCase();
                        // Buscar coincidencia exacta
                        if (nombreArchivo === nombreSinExtension.toLowerCase()) {
                            return true;
                        }
                        // Buscar si contiene todas las palabras clave
                        if (palabrasClave.length > 0) {
                            return palabrasClave.every(palabra => nombreArchivo.includes(palabra));
                        }
                        // Buscar si el nombre del archivo contiene el nombre buscado o viceversa
                        return nombreArchivo.includes(nombreSinExtension.toLowerCase()) ||
                            nombreSinExtension.toLowerCase().includes(nombreArchivo);
                    });

                    if (claveEncontrada) {
                        console.log(`Se encontró una clave similar: ${claveEncontrada}`);
                        moduloFunc = jasperModules[claveEncontrada];
                    } else {
                        // Si hay solo un archivo en la carpeta, usarlo
                        if (clavesDisponibles.length === 1) {
                            console.log(`Usando el único archivo disponible: ${clavesDisponibles[0]}`);
                            moduloFunc = jasperModules[clavesDisponibles[0]];
                        } else {
                            console.error("No se pudo encontrar el módulo jasper");
                            Swal.fire("Error", `No se encontró el formato de impresión: ${nombre}.jsx`, "error");
                            Swal.close();
                            return;
                        }
                    }
                }

                if (!moduloFunc || typeof moduloFunc !== 'function') {
                    console.error("El módulo encontrado no es una función:", moduloFunc);
                    Swal.fire("Error", `Error al cargar el formato de impresión: ${nombre}.jsx`, "error");
                    Swal.close();
                    return;
                }

                const modulo = await moduloFunc();
                console.log("Módulo cargado:", modulo);

                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === "function") {
                    modulo.default({ ...res, ...datosFooter }, null);
                } else {
                    console.error(`El módulo no exporta una función por defecto`);
                    Swal.fire("Error", `El formato de impresión ${nombre}.jsx no es válido`, "error");
                }
            }
            Swal.close();
        })
    // .finally(() => {

    // });
};

export const getInfoTablaDefault = (nombreSearch, codigoSearch, setData, token, obtenerReporteInfoTablaUrl) => {
    try {
        getFetch(
            `${obtenerReporteInfoTablaUrl}?${codigoSearch == "" ? "" : `nOrden=${codigoSearch}`
            }
    ${nombreSearch == "" ? "" : `&nombres=${nombreSearch}`}`,
            token
        ).then((res) => {
            setData(res);
        });
    } catch (error) {
        Swal.fire(
            "Error",
            "Ocurrió un error al obtener los datos de la tabla",
            "error"
        );
    }
};

export const VerifyTRDefault = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    LoadingDefault("Validando datos");
    getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    ).then((res) => {
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else {
            tieneRegistro();//obtener data servicio
        }
    });
};

export const VerifyTRPerzonalizadoDefault = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }, necesitaExamen = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    LoadingDefault("Validando datos");
    try {
        getFetch(
            `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
            token
        ).then((res) => {
            if (res.id === 0) {
                //No tiene registro previo 
                noTieneRegistro();//datos paciente
            } else if (res.id === 2) {
                necesitaExamen();
            } else {
                tieneRegistro();//obtener data servicio
            }
        });
    } catch (error) {
        console.log(error)
        Swal.fire("Ocurrio un Error al Validar la Información");
    }

};

export const GetInfoServicioDefault = async (
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish = () => { },
    esJasper = false
) => {
    try {
        console.log(esJasper)
        const res = await getFetch(
            `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=${esJasper}`,
            token
        );
        if (res?.norden || res?.norden_n_orden || res?.n_orden) {
            return res;
        } else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        return null;
    } finally {
        onFinish();
    }
};

export const GetInfoServicioDefaultManejo = async (
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish = () => { }
) => {
    try {
        const res = await getFetchManejo(
            `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=false`,
            token
        );
        if (!res) return null;

        const tieneOrden =
            res.norden ||
            res.norden_n_orden ||
            res.n_orden;

        return tieneOrden ? res : null;

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        return null;
    } finally {
        onFinish();
    }
};

export const SubmitDataServiceDefault = async (
    token,
    limpiar,
    body,
    registrarUrl,
    onFinish = () => { },
    tienePrint = true,
) => {
    LoadingDefault("Registrando Datos");
    SubmitData(body, registrarUrl, token).then((res) => {
        console.log(res)
        if (res.id === 1 || res.nOrden) {
            if (tienePrint) {
                Swal.fire({
                    title: "Exito",
                    text: `${res.mensaje ?? ""},\n¿Desea imprimir?`,
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                }).then((result) => {
                    if (result.isConfirmed) {
                        onFinish();
                    }
                });

            } else {
                onFinish();
            }
            limpiar();
        } else if (res.id === 0) {
            Swal.fire("Error", "Ocurrio un error al Registrar", "error");
        } else {
            Swal.fire("Error", "Ocurrio un error al Registrar", "error");
        }
    });
};
export const SubmitDataServiceDefaultManejo = async (
    token,
    limpiar,
    body,
    registrarUrl,
    onPrint = () => { },
    tienePrint = true,
) => {
    try {
        LoadingDefault("Registrando Datos");
        const res = await SubmitDataManejo(body, registrarUrl, token)
        if (tienePrint) {
            Swal.fire({
                title: "Exito",
                text: `${res.resultado ?? ""},\n¿Desea imprimir?`,
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    onPrint();
                }
            });
        } else {
            Swal.fire({
                title: "Exito",
                text: `${res.resultado ?? ""}`,
                icon: "success",
            })
        }
        limpiar();
    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Ocurrio un error al registrar los datos", "error");
        return null;
    }
};

export const handleSubirArchivoDefault = async (form, selectedSede, urlPDf, userlogued, token, coordenadas) => {

    const sFirma = await getSign(form, "FIRMAP")
    const sHuella = await getSign(form, "HUELLA")
    const sSello = await getSign(form, "SELLOFIRMA")
    const sSello2 = await getSign(form, "SELLOFIRMADOCASIG")
    const sSello3 = await getSign(form, "SELLOFIRMADOCASIG-EXTRA")
    const { value: file } = await Swal.fire({
        title: "Selecciona un archivo PDF",
        input: "file",
        inputAttributes: {
            accept: "application/pdf", // solo PDF
            "aria-label": "Sube tu archivo en formato PDF"
        },
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        inputValidator: (file) => {
            if (!file) return "Debes seleccionar un archivo.";
            if (file.type !== "application/pdf") return "Solo se permiten archivos PDF.";
        },
    });
    if (!file) return; // Usuario canceló la selección de archivo

    // Segundo diálogo: preguntar si quiere agregar sellos
    const { value: agregarSellos, isConfirmed } = await Swal.fire({
        title: "¿Agregar Sellos y Firmas?",
        input: "checkbox",
        inputValue: 1,
        inputPlaceholder: "Agregar Sellos y Firmas al PDF",
        showCancelButton: true,
        confirmButtonText: "Subir",
        cancelButtonText: "Cancelar"
    });
    if (!isConfirmed) return; // Usuario canceló

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2);

    // Procesar el archivo
    const reader = new FileReader();
    reader.onload = async (e) => {
        LoadingDefault("Subiendo documento")
        const base64WithoutHeader = e.target.result.split(',')[1];
        let pdfBytes = Uint8Array.from(atob(base64WithoutHeader), c => c.charCodeAt(0));
        console.log(agregarSellos)
        // Solo aplicar sellos si el usuario lo solicitó
        if (agregarSellos) {
            const sellos = {
                FIRMA: sFirma,
                HUELLA: sHuella,
                SELLOFIRMA: sSello,
                SELLOFIRMADOCASIG: sSello2,
                "SELLOFIRMADOCASIG-EXTRA": sSello3,
            };
            pdfBytes = await colocarSellosEnPdf(pdfBytes, sellos, coordenadas);
        } else {
            console.log("SIN SELLOS");
        }

        // Calcular tamaño antes de optimizar
        const tamañoAntesKB = (pdfBytes.length / 1024).toFixed(2);
        console.log(`📄 Tamaño del PDF ANTES de optimizar: ${tamañoAntesKB} KB (${pdfBytes.length} bytes)`);

        // Optimizar el PDF
        const pdfBytesOptimizado = await optimizePdf(pdfBytes);

        // Calcular tamaño después de optimizar
        const tamañoDespuesKB = (pdfBytesOptimizado.length / 1024).toFixed(2);
        const reduccionKB = (tamañoAntesKB - tamañoDespuesKB).toFixed(2);
        const porcentajeReduccion = ((reduccionKB / tamañoAntesKB) * 100).toFixed(1);

        console.log(`📄 Tamaño del PDF DESPUÉS de optimizar: ${tamañoDespuesKB} KB (${pdfBytesOptimizado.length} bytes)`);
        console.log(`✅ Reducción: ${reduccionKB} KB (${porcentajeReduccion}%)`);

        const pdfBase64Final = uint8ToBase64(new Uint8Array(pdfBytesOptimizado));


        const pdfBlob = new Blob([pdfBytesOptimizado], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        // Abre el PDF en una nueva pestaña
        //window.open(pdfUrl, "_blank");

        // Limpia luego (no inmediato)
        setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
        }, 1000);

        const nombreOriginal = file.name.replace(/\.pdf$/i, "");
        const idCorto = generarIdCorto();
        const nombreFinal = `${nombreOriginal}-${idCorto}.pdf`;

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

            nombreArchivo: nombreFinal,
            codigoSede: selectedSede,
            fileBase64: pdfBase64Final,
            nomenclatura_tipo_archivo: form.nomenclatura,
            orden: form.norden,
            indice_carga_masiva: undefined,
        };

        const response = await SubmitData(datos, urlPDf, token);
        if (response.id === 1) {

            Swal.fire("Exito", "Archivo Subido con exto", "success")
        } else {
            Swal.fire("Error", "No se pudo subir", "error")
        }
    };
    reader.readAsDataURL(file);
};


export const handleSubirArchivoDefaultSinSellos = async (
    form,
    selectedSede,
    urlPDf,
    userlogued,
    token
) => {
    const { value: file } = await Swal.fire({
        title: "Selecciona un archivo PDF",
        input: "file",
        inputAttributes: {
            accept: "application/pdf",
            "aria-label": "Sube tu archivo en formato PDF",
        },
        showCancelButton: true,
        confirmButtonText: "Subir",
        cancelButtonText: "Cancelar",
        inputValidator: (file) => {
            if (!file) return "Debes seleccionar un archivo.";
            if (file.type !== "application/pdf")
                return "Solo se permiten archivos PDF.";
        },
    });

    if (!file) return;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);

    const reader = new FileReader();
    reader.onload = async (e) => {
        LoadingDefault("Subiendo documento");

        const base64WithoutHeader = e.target.result.split(",")[1];
        const pdfBytes = Uint8Array.from(
            atob(base64WithoutHeader),
            (c) => c.charCodeAt(0)
        );

        const pdfBase64Final = uint8ToBase64(pdfBytes);

        const nombreOriginal = file.name.replace(/\.pdf$/i, "");
        const idCorto = generarIdCorto();
        const nombreFinal = `${nombreOriginal}-${idCorto}.pdf`;

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

            nombreArchivo: nombreFinal,
            codigoSede: selectedSede,
            fileBase64: pdfBase64Final,
            nomenclatura_tipo_archivo: form.nomenclatura,
            orden: form.norden,
            indice_carga_masiva: undefined,
        };

        const response = await SubmitData(datos, urlPDf, token);

        if (response?.id === 1) {
            Swal.fire("Éxito", "Archivo subido con éxito", "success");
        } else {
            Swal.fire("Error", "No se pudo subir el archivo", "error");
        }
    };

    reader.readAsDataURL(file);
};


export const handleImgtoPdfDefault = async (
    form,
    selectedSede,
    urlPDf,
    userlogued,
    token,
    nomenclatura
) => {
    const { value: file } = await Swal.fire({
        title: "Selecciona una imagen o PDF",
        input: "file",
        inputAttributes: {
            accept: "application/pdf,image/jpeg,image/png",
            "aria-label": "Sube una imagen o PDF",
        },
        showCancelButton: true,
        confirmButtonText: "Subir",
        cancelButtonText: "Cancelar",
        inputValidator: (file) => {
            if (!file) return "Debes seleccionar un archivo.";
            if (!file.type.startsWith("image/") &&
                file.type !== "application/pdf"
            ) {
                return "Solo se permiten imágenes (JPG/PNG) o PDF.";
            }
        },
    });

    if (!file) return;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);

    LoadingDefault("Procesando documento");

    let pdfBytesFinal;

    if (file.type.startsWith("image/")) {
        // ✅ IMAGEN → PDF
        pdfBytesFinal = await imagenToPdfA4(file);
    } else {
        // ✅ PDF NORMAL
        const reader = new FileReader();
        pdfBytesFinal = await new Promise((resolve) => {
            reader.onload = (e) => {
                const base64WithoutHeader = e.target.result.split(",")[1];
                const bytes = Uint8Array.from(
                    atob(base64WithoutHeader),
                    (c) => c.charCodeAt(0)
                );
                resolve(bytes);
            };
            reader.readAsDataURL(file);
        });
    }

    const pdfBase64Final = uint8ToBase64(pdfBytesFinal);

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

        nombreArchivo: file.name.replace(/\.(jpg|jpeg|png)$/i, ".pdf"),
        codigoSede: selectedSede,
        fileBase64: pdfBase64Final,
        nomenclatura_tipo_archivo: nomenclatura,
        orden: form.norden,
        indice_carga_masiva: undefined,
    };

    const response = await SubmitData(datos, urlPDf, token);

    if (response?.id === 1) {
        Swal.fire("Éxito", "Archivo subido con éxito", "success");
    } else {
        Swal.fire("Error", "No se pudo subir el archivo", "error");
    }
};

export const handleSubidaMasiva = async (form, selectedSede, urlPDf, userlogued, token) => {
    let pdfFiles = [];
    const { isConfirmed } = await Swal.fire({
        title: "Selecciona la carpeta con PDFs",
        input: "file",
        inputAttributes: {
            webkitdirectory: true,
            directory: true,
            multiple: true,
            accept: "application/pdf",
        },
        showCancelButton: true,
        confirmButtonText: "Subir archivos",
        cancelButtonText: "Cancelar",
        didOpen: () => {
            const input = Swal.getInput();
            input.addEventListener("change", () => {
                const files = Array.from(input.files || []);
                pdfFiles = files.filter(f => f.type === "application/pdf");

                const htmlList = pdfFiles.length
                    ? `
                        <div style="max-height:250px;overflow:auto;text-align:left">
                            <b>Archivos detectados (${pdfFiles.length}):</b>
                            <ul>
                                ${pdfFiles.map(f => `<li>${f.name}</li>`).join("")}
                            </ul>
                        </div>
                      `
                    : `<p style="color:red">No se encontraron archivos PDF</p>`;

                Swal.update({ html: htmlList });
            });
        },

        preConfirm: () => {
            if (!pdfFiles.length) {
                Swal.showValidationMessage(
                    "No hay archivos PDF válidos para subir"
                );
                return false;
            }
            return true;
        },
    });

    if (!isConfirmed) return;

    LoadingDefault("Subiendo documentos...");

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);

    const uploadPromises = pdfFiles.map(async (file) => {
        const orden = obtenerOrdenDesdeNombre(file.name);
        if (!orden) {
            return { name: file.name, status: "ignored", message: "Sin N° Orden detectado" };
        }

        try {
            const base64 = await readFileAsBase64(file);
            const base64WithoutHeader = base64.split(",")[1];

            const pdfBytes = Uint8Array.from(
                atob(base64WithoutHeader),
                (c) => c.charCodeAt(0)
            );

            const pdfBase64Final = uint8ToBase64(pdfBytes);

            const nombreOriginal = file.name.replace(/\.pdf$/i, "");
            const nombreFinal = `${nombreOriginal}-${generarIdCorto()}.pdf`;

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

                nombreArchivo: nombreFinal,
                codigoSede: selectedSede,
                fileBase64: pdfBase64Final,
                nomenclatura_tipo_archivo: form.nomenclatura,
                orden,
                indice_carga_masiva: undefined,
            };

            const res = await SubmitData(datos, urlPDf, token);
            return {
                name: file.name,
                status: res?.id === 1 ? "success" : "error",
                message: res?.id === 1 ? "OK" : (res?.message || "Error al subir")
            };
        } catch (err) {
            console.error(err);
            return { name: file.name, status: "error", message: "Error interno" };
        }
    });

    try {
        const results = await Promise.all(uploadPromises);

        const exitosos = results.filter(r => r.status === "success");
        const fallidos = results.filter(r => r.status !== "success");

        const htmlList = `
            <div style="text-align:left; max-height:300px; overflow:auto;">
                <p><b>Resumen:</b> ${exitosos.length} subidos, ${fallidos.length} no subidos.</p>
                
                ${exitosos.length > 0 ? `
                    <h5 style="color:green; margin-top:10px; font-size:16px;">Subidos correctamente:</h5>
                    <ul style="font-size:14px; margin-bottom:10px;">
                        ${exitosos.map(f => `<li>${f.name}</li>`).join("")}
                    </ul>
                ` : ""}

                ${fallidos.length > 0 ? `
                    <h5 style="color:red; margin-top:10px; font-size:16px;">No se pudieron subir:</h5>
                    <ul style="font-size:14px;">
                        ${fallidos.map(f => `<li>${f.name} <span style="color:gray">(${f.message})</span></li>`).join("")}
                    </ul>
                ` : ""}
            </div>
        `;

        Swal.fire({
            title: "Carga Finalizada",
            html: htmlList,
            icon: fallidos.length === 0 ? "success" : "warning",
            width: "600px"
        });
    } catch (err) {
        console.error(err);
        Swal.fire(
            "Error",
            "Ocurrió un error crítico durante el proceso",
            "error"
        );
    }
}

export const handleSubidaMasivaImagenes = async (
    form,
    selectedSede,
    urlPDf,
    userlogued,
    token,
    nomenclatura
) => {
    let imageFiles = [];

    const { isConfirmed } = await Swal.fire({
        title: "Selecciona la carpeta con imágenes",
        input: "file",
        width: 650,
        inputAttributes: {
            webkitdirectory: true,
            directory: true,
            multiple: true,
            accept: "image/jpeg,image/png",
        },
        showCancelButton: true,
        confirmButtonText: "Procesar imágenes",
        cancelButtonText: "Cancelar",

        didOpen: () => {
            const input = Swal.getInput();

            input.addEventListener("change", () => {
                const files = Array.from(input.files || []);
                imageFiles = files.filter(f => f.type.startsWith("image/"));

                const htmlList = imageFiles.length
                    ? `
                        <div style="max-height:260px;overflow:auto;text-align:left">
                            <b>Imágenes detectadas (${imageFiles.length}):</b>
                            <ul>
                                ${imageFiles.map(f =>
                        `<li>${f.name} <span style="color:#888">(→ PDF)</span></li>`
                    ).join("")}
                            </ul>
                        </div>
                      `
                    : `<p style="color:red">No se encontraron imágenes válidas</p>`;

                Swal.update({ html: htmlList });
            });
        },

        preConfirm: () => {
            if (!imageFiles.length) {
                Swal.showValidationMessage(
                    "No hay imágenes válidas para subir"
                );
                return false;
            }
            return true;
        }
    });

    if (!isConfirmed) return;

    LoadingDefault("Convirtiendo imágenes a PDF...");

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);

    const uploadPromises = imageFiles.map(async (file) => {
        const orden = obtenerOrdenDesdeNombre(file.name);
        if (!orden) {
            return {
                name: file.name,
                status: "ignored",
                message: "Sin N° Orden detectado"
            };
        }

        try {
            // 🔥 IMAGEN → PDF A4
            const pdfBytes = await imagenToPdfA4(file);
            const pdfBase64Final = uint8ToBase64(pdfBytes);

            const nombreFinal =
                file.name.replace(/\.(jpg|jpeg|png)$/i, "") +
                `-${generarIdCorto()}.pdf`;

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

                nombreArchivo: nombreFinal,
                codigoSede: selectedSede,
                fileBase64: pdfBase64Final,
                nomenclatura_tipo_archivo: nomenclatura,
                orden,
                indice_carga_masiva: undefined,
            };

            const res = await SubmitData(datos, urlPDf, token);

            return {
                name: file.name,
                status: res?.id === 1 ? "success" : "error",
                message: res?.id === 1 ? "OK" : "Error al subir"
            };
        } catch (err) {
            console.error(err);
            return {
                name: file.name,
                status: "error",
                message: "Error interno"
            };
        }
    });

    const results = await Promise.all(uploadPromises);

    const exitosos = results.filter(r => r.status === "success");
    const fallidos = results.filter(r => r.status !== "success");

    const htmlResumen = `
        <div style="text-align:left; max-height:300px; overflow:auto;">
            <p><b>Resumen:</b> ${exitosos.length} subidas, ${fallidos.length} no subidas</p>

            ${exitosos.length ? `
                <h4 style="color:green">Convertidas y subidas:</h4>
                <ul>${exitosos.map(r => `<li>${r.name}</li>`).join("")}</ul>
            ` : ""}

            ${fallidos.length ? `
                <h4 style="color:red">Errores:</h4>
                <ul>
                    ${fallidos.map(r =>
        `<li>${r.name} <span style="color:gray">(${r.message})</span></li>`
    ).join("")}
                </ul>
            ` : ""}
        </div>
    `;

    Swal.fire({
        title: "Proceso finalizado",
        html: htmlResumen,
        icon: fallidos.length ? "warning" : "success",
        width: 600
    });
};

export const handleSubidaMasivaImagenesRXDinamico = async (
    form,
    selectedSede,
    urlPDf,
    userlogued,
    token,
    nomenclatura
) => {
    let imageFiles = [];

    const { isConfirmed } = await Swal.fire({
        title: "Selecciona la carpeta con imágenes",
        input: "file",
        width: 650,
        inputAttributes: {
            webkitdirectory: true,
            directory: true,
            multiple: true,
            accept: "image/jpeg,image/png",
        },
        showCancelButton: true,
        confirmButtonText: "Procesar imágenes",
        cancelButtonText: "Cancelar",

        didOpen: () => {
            const input = Swal.getInput();

            input.addEventListener("change", () => {
                const files = Array.from(input.files || []);
                imageFiles = files.filter(f => f.type.startsWith("image/"));

                const htmlList = imageFiles.length
                    ? `
                        <div style="max-height:260px;overflow:auto;text-align:left">
                            <b>Imágenes detectadas (${imageFiles.length}):</b>
                            <ul>
                                ${imageFiles.map(f =>
                        `<li>${f.name} <span style="color:#888">(→ PDF)</span></li>`
                    ).join("")}
                            </ul>
                        </div>
                      `
                    : `<p style="color:red">No se encontraron imágenes válidas</p>`;

                Swal.update({ html: htmlList });
            });
        },

        preConfirm: () => {
            if (!imageFiles.length) {
                Swal.showValidationMessage(
                    "No hay imágenes válidas para subir"
                );
                return false;
            }
            return true;
        }
    });

    if (!isConfirmed) return;

    LoadingDefault("Convirtiendo imágenes a PDF...");

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);

    const uploadPromises = imageFiles.map(async (file) => {
        const orden = obtenerOrdenDesdeNombre(file.name);
        if (!orden) {
            return {
                name: file.name,
                status: "ignored",
                message: "Sin N° Orden detectado"
            };
        }

        // 🔎 detectar nomenclatura
        const nomenclaturaDetectada = obtenerNomenclaturaDesdeNombre(
            file.name,
            form
        );

        if (!nomenclaturaDetectada) {
            return {
                name: file.name,
                status: "ignored",
                message: "Nomenclatura no detectada (RXCL / RXCL2)"
            };
        }

        try {
            // 🔥 IMAGEN → PDF A4
            const pdfBytes = await imagenToPdfA4(file);
            const pdfBase64Final = uint8ToBase64(pdfBytes);

            const nombreFinal =
                file.name.replace(/\.(jpg|jpeg|png)$/i, "") +
                `-${generarIdCorto()}.pdf`;

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

                nombreArchivo: nombreFinal,
                codigoSede: selectedSede,
                fileBase64: pdfBase64Final,
                nomenclatura_tipo_archivo: nomenclaturaDetectada,
                orden,
                indice_carga_masiva: undefined,
            };

            const res = await SubmitData(datos, urlPDf, token);

            return {
                name: file.name,
                status: res?.id === 1 ? "success" : "error",
                message: res?.id === 1 ? "OK" : "Error al subir"
            };
        } catch (err) {
            console.error(err);
            return {
                name: file.name,
                status: "error",
                message: "Error interno"
            };
        }
    });
    const results = await Promise.all(uploadPromises);
    const exitosos = results.filter(r => r.status === "success");
    const fallidos = results.filter(r => r.status !== "success");

    const htmlResumen = `
        <div style="text-align:left; max-height:300px; overflow:auto;">
            <p><b>Resumen:</b> ${exitosos.length} subidas, ${fallidos.length} no subidas</p>

            ${exitosos.length ? `
                <h4 style="color:green">Convertidas y subidas:</h4>
                <ul>${exitosos.map(r => `<li>${r.name}</li>`).join("")}</ul>
            ` : ""}

            ${fallidos.length ? `
                <h4 style="color:red">Errores:</h4>
                <ul>
                    ${fallidos.map(r =>
        `<li>${r.name} <span style="color:gray">(${r.message})</span></li>`
    ).join("")}
                </ul>
            ` : ""}
        </div>
    `;

    Swal.fire({
        title: "Proceso finalizado",
        html: htmlResumen,
        icon: fallidos.length ? "warning" : "success",
        width: 600
    });
};


export const ReadArchivosFormDefault = async (form, setVisualerOpen, token, nomenclatura) => {
    LoadingDefault("Cargando Archivo")
    getFetch(`/api/v01/st/registros/detalleUrlArchivos/${form.norden}/${nomenclatura ?? form.nomenclatura}`, token)
        .then(response => {
            console.log(response)
            if (response.id === 1) {
                setVisualerOpen(response)

                Swal.close()
            } else {
                Swal.fire("Error", "No Existe reporte para este Numero de Orden", "error")
            }
        })
        .catch(error => {
            Swal.fire("Error", "Ocurrio un Error al visualizar el archivo", "error")
            throw new Error('Network response was not ok.', error);
        })
}

const generarIdCorto = () => {
    const time = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `${time}${random}`;
};


const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const obtenerOrdenDesdeNombre = (filename) => {
    const match = filename.match(/^(\d+)/);
    return match ? match[1] : null;
};

const obtenerNomenclaturaDesdeNombre = (filename, form) => {
    const normalized = filename
        .toUpperCase()
        .replace(/\s+/g, "")   // elimina espacios
        .replace(/[-_]/g, ""); // elimina guiones y underscores

    if (normalized.includes("RXCL2")) {
        return form.nomenclatura2; // INFORME RADIOGRAFICO 2
    }

    if (normalized.includes("RXCL")) {
        return form.nomenclatura; // INFORME RADIOGRAFICO
    }

    return null;
};