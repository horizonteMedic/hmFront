import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useState, useRef } from "react";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import FolioJasper from "../../../../jaspers/FolioJasper/FolioJasper";
import { getToday } from "../../../../utils/helpers";
import { GetInfoPac, obtenerFirmas, SubmitDataService } from "./controllerFolio";
import Swal from "sweetalert2";
import { buildExamenesList } from "./folioCatalogo";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";

const ExamenesListPRUEBAS2 = buildExamenesList([
    "OFTALMOLOGIA_VISION_TESTER",
    "PSICOSENSOMETRICO_VEHI_FOLIO",
]);

const ExamenesListPRUEBASArchivos = buildExamenesList([
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",   //Tiene firma
    "OFTALMOLOGIA_VISION_TESTER",//Tiene firma
    "PSICOSENSOMETRICO_CERT_ALTURA", //Tiene firma
    "PSICOSENSOMETRICO_VEHI_FOLIO", //Tiene firma
    "RADIOGRAFIA_COLUMNA_ARCHIVO",
    "RADIOGRAFIA_COLUMNA_ARCHIVO2",
    "RAYOS_X_TORAX_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListPRUEBAS = buildExamenesList([
    // "OFTALMOLOGIA_VISION_TESTER",
    // "PSICOSENSOMETRICO_CERT_ALTURA",        //revisar
    // "PSICOSENSOMETRICO_CERT_ALTURA_PODEROSA",
    // "PSICOSENSOMETRICO_CERT_ALTURA_1_8",
    // "PSICOSENSOMETRICO_VEHI_FOLIO",
    // "ESPIROMETRIA_ARCHIVO",
    // "LABORATORIO_ARCHIVO_EXTERNO",
    // "DECLARACION_USO_FIRMA_ARCHIVO",
    "PERFIL_LIPIDICO",
    "ANALISIS_GLUCOSA_BASAL",
    //PRUEBA 1 = ANEXOS
    // "INFORME_PSICOLOGICO",
    // "INFORME_PODEROSA_OPERAR",
    // "PSICOLOGIA_ANEXO_02",
    // "PSICOLOGIA_ANEXO_03",
    // //PRUEBA 2 = BOROO
    // "INFORME_PSICOLABORAL",  
    // "INFORME_RIESGO_PSICOSOCIAL", //nuevo
    // "INFORME_BURNOUT", //nuevo
    // //Prueba 3
    // "ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA",
    // "ESPACIOS_CONFINADOS_PSICOLOGIA",
    // "CALIDADSUEÑO",
    // "INFORME_PSICOLOGIA_FOBIAS",
    // "AVERSION_RIESGO", //nuevo
    // "TRABAJO_ALTURA_PSICO",
    // "TRANSTORNO_PERSONALIDAD_PSICO", //nuevo
    // //Prueba 4
    // "INFORME_CONDUCTORES", //nuevo
    // "ALTO_RIESGO", //nuevo
    // "TRABAJO_ESPECIFICOS",
    // "CUESTIONARIO_BERLIN",
    // "EXAMENES_COMPLEMENTARIOS",
    // "BRIGADISTAS_PSICOLOGIA", //nuevo
    // "BOMBA_ELECTRICA", //nuevo
    // "PSICOLOGIA_VIGIA" //nuevo
]);

const ExamenesListCAMPANA = buildExamenesList([ // Campaña
    "CERTIFICADO_APTITUD_ANEXO_16",  // 1
    "ANEXO_16",                      // 2
    "ENFERMEDADES_ALTURA",           // 3
    "ANEXO_16A",                     // 4
    "USO_RESPIRADORES",              // 5
    "HISTORIA_OCUPACIONAL",          // 6
    "ANTECEDENTES_PATOLOGICOS",      // 7
    "CUESTIONARIO_NORDICO",          // 8
    "EVALUACION_MUSCULO_ESQUELETICA",// 9
    "LABORATORIO_CLINICO",           // 10
    "PERFIL_LIPIDICO",               // 11
    "OIT",                           // 12
    "RADIOGRAFIA_TORAX",             // 13
    "ELECTROCARDIOGRAMA",            // 14
    "ESPIROMETRIA_ARCHIVO",          // 15
    "AUDIOMETRIA_OHLA",              // 16
    "INFORME_PSICOLOGICO",           // 17
    "OFTALMOLOGIA",                  // 18
    "CONSENTIMIENTO_INFORMADO_EXAMEN_MEDICO_OCUPACIONAL",      // 19
    "DECLARACION_USO_FIRMA_ARCHIVO"                            // 20 nuevo
]);

const ExamenesListCOMPLETO = buildExamenesList([ // Completo
    "RESUMEN_MEDICO_PODEROSA",                 // 1
    "CONSTANCIA_EXAMEN_MEDICO_OCUPACIONAL",    // 2
    "CERTIFICADO_APTITUD_ANEXO_16",  // 3
    "ANEXO_16",                      // 4
    "CERTIFICADO_ANEXO_02",
    "ANEXO_02",
    "ENFERMEDADES_ALTURA",           // 5

    "ANEXO_16A",
    "PSICOSENSOMETRICO_CERT_ALTURA_PODEROSA", //Gr nuevo
    "CERTIFICADO_ALTURA_PODEROSA", //Gr nuevo
    "HOJA_DE_CONSULTA_EXTERNA", //Gr nuevo
    "LICENCIA_CONDUCIR_PODEROSA", //Gr nuevo
    "APTITUD_HERRAMIENTAS_MANUALES", //Gr nuevo

    "CERTIFICADO_ALTURA",
    "PSICOSENSOMETRICO_CERT_ALTURA",        //revisar
    "PSICOSENSOMETRICO_CERT_ALTURA_1_8",
    "CERTIFICADO_APTITUD_ALTURA_PODEROSA",
    "CERTIFICADO_VEHICULOS",
    "PSICOSENSOMETRICO_VEHI_FOLIO",
    "FICHA_SAS",


    "USO_RESPIRADORES",             // 7
    "ALTURA1PUNTO8",                 // 8
    "HISTORIA_OCUPACIONAL",          // 9

    "ANTECEDENTES_PATOLOGICOS",      // 10
    "DECLARACION_JURADA_ANTECEDENTES", // 11
    "CUESTIONARIO_NORDICO",          // 12
    "EVALUACION_MUSCULO_ESQUELETICA_BOROO",
    "EVALUACION_MUSCULO_ESQUELETICA",// 12
    "LABORATORIO_ARCHIVO_EXTERNO",
    "CONSENT_MUESTRA_SANGRE",

    //LABORATORIO
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",
    "PERFIL_RENAL",
    "PERFIL_HEPATICO",
    "ANALISIS_RIESGO_CORONARIO",
    "GONADOTROPINA",
    "PANEL_2D",
    "PANEL_3D",
    "PANEL_4D",
    "PANEL_5D",
    "PANEL_10D",
    "CONSENT_PANEL_2D",
    "CONSENT_PANEL_3D",
    "CONSENT_PANEL_4D",
    "CONSENT_PANEL_5D",
    "CONSENT_PANEL_10D",
    "CONSENT_MARIHUANA",
    "CONSENT_DROGAS_BOROO",

    "INMUNOLOGIA_BK_KOH",
    "MANIPULADORES_COPROCULTIVO",
    "MANIPULADORES_PARASITOLOGIA",
    "EXAMEN_ORINA_LAB",
    "INMUNLOGIA_AGLUTINACIONES",
    "INMUNOLOGIA_HEPATITIS",

    "HEMOGRAMA",
    "HEMOGLOBINA",
    "ANALISIS_GLUCOSA_BASAL",
    "ACIDO_URICO",
    "ANALISIS_TOLERANCIA_GLUCOSA",
    "INMUNOLOGIA_VDRL",
    "INMUNOLOGIA_VIH",
    "INMUNOLOGIA_THEVENON",

    "OIT",                           // 14
    "RADIOGRAFIA_TORAX",             // 15
    "RAYOS_X_TORAX_ARCHIVO",         // 16
    "RADIOGRAFIA_COLUMNA",           // 17
    "RADIOGRAFIA_COLUMNA_ARCHIVO",   // 18
    "RADIOGRAFIA_COLUMNA_ARCHIVO2",  // 19
    "ELECTROCARDIOGRAMA",            // 20
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",          // 21
    "AUDIOMETRIA_OHLA",              // 22
    "FICHA_AUDIOMETRIA",

    "CUESTIONARIO_AUDIOMETRIA",
    "ODONTOGRAMA",
    "TEST_FATIGA_SOMNOLENCIA",

    //PSICOLOGÍA
    "INFORME_PSICOLOGICO",
    "PSICOLOGIA_ANEXO_02",
    "PSICOLOGIA_ANEXO_03",
    "INFORME_PODEROSA_OPERAR",
    "INFORME_PSICOLABORAL",
    "INFORME_RIESGO_PSICOSOCIAL",
    "TRABAJO_ESPECIFICOS",
    "INFORME_PSICOLOGIA_FOBIAS",
    "ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA",
    "CUESTIONARIO_BERLIN",
    "CALIDADSUEÑO",
    "EXAMENES_COMPLEMENTARIOS",
    "ESPACIOS_CONFINADOS_PSICOLOGIA",
    "INFORME_CONDUCTORES",
    "INFORME_PODEROSA_OPERAR_LICENCIA",
    "INFORME_PODEROSA_OPERAR_CALIENTE",
    "ALTO_RIESGO",
    "BRIGADISTAS_PSICOLOGIA",
    "INFORME_BURNOUT",
    "AVERSION_RIESGO",
    "TRABAJO_ALTURA_PSICO",
    "BOMBA_ELECTRICA",
    "PSICOLOGIA_VIGIA",
    "TRANSTORNO_PERSONALIDAD_PSICO",

    "OFTALMOLOGIA",
    "OFTALMOLOGIA_VISION_TESTER",
    "FICHA_OFTALMOLOGICA",
    "CONSENT_DECLARACION_APTITUD",
    "CONSENT_SINTOMATICO_RESPIRATORIO",
    "CONSENT_INFORMADO_EVALUACION_MEDICA",
    "CONSENT_BUENA_SALUD",
    "CONSENTIMIENTO_INFORMADO_EXAMEN_MEDICO_OCUPACIONAL",
    "DECLARACION_USO_FIRMA_ARCHIVO",           // 36
    "INTERCONSULTAS"                         // 22 nuevo
]);

const ExamenesListOHLA = buildExamenesList([       //OHLA
    "RESUMEN_MEDICO_PODEROSA",                 // 1
    "CONSTANCIA_EXAMEN_MEDICO_OCUPACIONAL",    // 2
    "ANEXO_16",                                // 3
    "CERTIFICADO_ALTURA",                      // 4
    "OFTALMOLOGIA_VISION_TESTER",              // 5 no se mostrara si existe  PSICOSENSOMETRICO_VEHI_FOLIO 
    "CERTIFICADO_VEHICULOS",                   // 6
    "FICHA_SAS",                               // 7
    "PSICOSENSOMETRICO_VEHI_FOLIO",            // 8
    "HISTORIA_OCUPACIONAL",                    // 9
    "ANTECEDENTES_PATOLOGICOS",                // 10
    "DECLARACION_JURADA_ANTECEDENTES",         // 11
    "CUESTIONARIO_NORDICO",                    // 12
    "EVALUACION_MUSCULO_ESQUELETICA",          // 13
    "CONSENT_MUESTRA_SANGRE",                  // 14
    "LABORATORIO_CLINICO",                     // 15
    "PERFIL_LIPIDICO",                         // 16
    "GONADOTROPINA",                           // 17
    "PERFIL_RENAL",                            // 18
    "PERFIL_HEPATICO",                         // 19
    "CONSENT_PANEL_5D",                        // 20
    "OIT",                                     // 21
    "RADIOGRAFIA_TORAX",             // 15
    "RAYOS_X_TORAX_ARCHIVO",         // 16
    "RADIOGRAFIA_COLUMNA",           // 17
    "RADIOGRAFIA_COLUMNA_ARCHIVO",   // 18
    "RADIOGRAFIA_COLUMNA_ARCHIVO2",  // 19
    "ELECTROCARDIOGRAMA",                      // 25
    "ESPIROMETRIA_ARCHIVO",                    // 26
    "AUDIOMETRIA_OHLA",                        // 27
    "ODONTOGRAMA",                             // 28
    "PSICOLOGIA_ANEXO_02",                     // 29
    "ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA",    // 30
    "CUESTIONARIO_BERLIN",                     // 31
    "INFORME_PSICOLOGICO",                     // 32
    "TRABAJO_ALTURA_PSICO",                    // 33
    "OFTALMOLOGIA",                            // 34
    "CONSENT_DECLARACION_APTITUD",             // 35
    "CONSENTIMIENTO_INFORMADO_EXAMEN_MEDICO_OCUPACIONAL", //EXTRA VIVIANA
    "DECLARACION_USO_FIRMA_ARCHIVO",           // 36
    "INTERCONSULTAS"                           // 37
]);

const ExamenesListOHLA1 = buildExamenesList([       //OHLA 1
    "RESUMEN_MEDICO_PODEROSA",
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",
    "CERTIFICADO_ALTURA",
    "PSICOSENSOMETRICO_CERT_ALTURA",
    "CERTIFICADO_VEHICULOS",
    "FICHA_SAS",
    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",
    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",
    "PERFIL_HEPATICO",
    "PERFIL_RENAL",
    "PANEL_5D",
    "GONADOTROPINA",
    "CONSENT_PANEL_5D",
    "OIT",
    "RADIOGRAFIA_TORAX",             // 15
    "RAYOS_X_TORAX_ARCHIVO",         // 16
    "RADIOGRAFIA_COLUMNA",           // 17
    "RADIOGRAFIA_COLUMNA_ARCHIVO",   // 18
    "RADIOGRAFIA_COLUMNA_ARCHIVO2",  // 19
    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "ODONTOGRAMA",
    "PSICOLOGIA_ANEXO_02",
    "EXAMENES_COMPLEMENTARIOS",
    "ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA",
    "TRABAJO_ALTURA_PSICO",
    "OFTALMOLOGIA",
    "OFTALMOLOGIA_VISION_TESTER",
    "CONSENT_DECLARACION_APTITUD",
    "CONSENTIMIENTO_INFORMADO_EXAMEN_MEDICO_OCUPACIONAL",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListOHLA2 = buildExamenesList([       //OHLA 2
    "RESUMEN_MEDICO_PODEROSA",
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",
    "CERTIFICADO_VEHICULOS",
    "PSICOSENSOMETRICO_VEHI_FOLIO",
    "FICHA_SAS",
    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",
    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",
    "PERFIL_HEPATICO",
    "PERFIL_RENAL",
    "PANEL_5D",
    "GONADOTROPINA",
    "CONSENT_PANEL_5D",
    "OIT",
    "RADIOGRAFIA_TORAX",             // 15
    "RAYOS_X_TORAX_ARCHIVO",         // 16
    "RADIOGRAFIA_COLUMNA",           // 17
    "RADIOGRAFIA_COLUMNA_ARCHIVO",   // 18
    "RADIOGRAFIA_COLUMNA_ARCHIVO2",  // 19
    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "ODONTOGRAMA",
    "PSICOLOGIA_ANEXO_02",
    "CUESTIONARIO_BERLIN",
    "EXAMENES_COMPLEMENTARIOS",
    "ESPACIOS_CONFINADOS_PSICOLOGIA",
    "ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA",

    "OFTALMOLOGIA",
    "OFTALMOLOGIA_VISION_TESTER",
    "CONSENT_DECLARACION_APTITUD",
    "CONSENTIMIENTO_INFORMADO_EXAMEN_MEDICO_OCUPACIONAL",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListOHLA3 = buildExamenesList([       //OHLA 3
    "RESUMEN_MEDICO_PODEROSA",
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",
    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",
    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",
    "PERFIL_HEPATICO",
    "PERFIL_RENAL",
    "PANEL_5D",
    "GONADOTROPINA",
    "CONSENT_PANEL_5D",
    "OIT",
    "RADIOGRAFIA_TORAX",             // 15
    "RAYOS_X_TORAX_ARCHIVO",         // 16
    "RADIOGRAFIA_COLUMNA",           // 17
    "RADIOGRAFIA_COLUMNA_ARCHIVO",   // 18
    "RADIOGRAFIA_COLUMNA_ARCHIVO2",  // 19
    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "ODONTOGRAMA",
    "PSICOLOGIA_ANEXO_02",
    "EXAMENES_COMPLEMENTARIOS",
    "OFTALMOLOGIA",
    "OFTALMOLOGIA_VISION_TESTER",
    "CONSENT_DECLARACION_APTITUD",
    "CONSENTIMIENTO_INFORMADO_EXAMEN_MEDICO_OCUPACIONAL",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListPsicologia = buildExamenesList([
    "INFORME_PSICOLOGICO",
    "PSICOLOGIA_ANEXO_02",
    "PSICOLOGIA_ANEXO_03",
    "INFORME_PODEROSA_OPERAR",
    "INFORME_PSICOLABORAL",
    "INFORME_RIESGO_PSICOSOCIAL",
    "TRABAJO_ESPECIFICOS",
    "INFORME_PSICOLOGIA_FOBIAS",
    "ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA",
    "CUESTIONARIO_BERLIN",
    "CALIDADSUEÑO",
    "EXAMENES_COMPLEMENTARIOS",
    "ESPACIOS_CONFINADOS_PSICOLOGIA",
    "INFORME_CONDUCTORES",
    "INFORME_PODEROSA_OPERAR_LICENCIA",
    "INFORME_PODEROSA_OPERAR_CALIENTE",
    "ALTO_RIESGO",
    "BRIGADISTAS_PSICOLOGIA",
    "INFORME_BURNOUT",
    "AVERSION_RIESGO",
    "TRABAJO_ALTURA_PSICO",
    "BOMBA_ELECTRICA",
    "PSICOLOGIA_VIGIA",
    "TRANSTORNO_PERSONALIDAD_PSICO",
]);

const ExamenesListLaboratorio = buildExamenesList([
    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_ARCHIVO_EXTERNO",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",
    "PERFIL_RENAL",
    "PERFIL_HEPATICO",
    "ANALISIS_RIESGO_CORONARIO",
    "GONADOTROPINA",
    "PANEL_2D",
    "PANEL_3D",
    "PANEL_4D",
    "PANEL_5D",
    "PANEL_10D",
    "CONSENT_PANEL_2D",
    "CONSENT_PANEL_3D",
    "CONSENT_PANEL_4D",
    "CONSENT_PANEL_5D",
    "CONSENT_PANEL_10D",
    "CONSENT_MARIHUANA",
    "CONSENT_DROGAS_BOROO",

    "INMUNOLOGIA_BK_KOH",
    "MANIPULADORES_COPROCULTIVO",
    "MANIPULADORES_PARASITOLOGIA",
    "EXAMEN_ORINA_LAB",
    "INMUNLOGIA_AGLUTINACIONES",
    "INMUNOLOGIA_HEPATITIS",

    "HEMOGRAMA",
    "HEMOGLOBINA",
    "ANALISIS_GLUCOSA_BASAL",
    "ACIDO_URICO",
    "ANALISIS_TOLERANCIA_GLUCOSA",
    "INMUNOLOGIA_VDRL",
    "INMUNOLOGIA_VIH",
    "INMUNOLOGIA_THEVENON",
]);

const ListaPorPlantilla = {
    //PRUEBAS: ExamenesListPRUEBAS,
    CAMPANA: ExamenesListCAMPANA,
    "COMPLETO": ExamenesListCOMPLETO,
    //OHLA: ExamenesListOHLA,
    //"OHLA ALTURA - CONDUCCION": ExamenesListOHLA1,
    //"OHLA CONDUCCION": ExamenesListOHLA2,
    //"OHLA SIMPLE": ExamenesListOHLA3,
    PSICOLOGIA: ExamenesListPsicologia,
    LABORATORIO: ExamenesListLaboratorio,
};

const Folio = () => {
    const abortControllerRef = useRef(null);
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();
    const [selectedListType, setSelectedListType] = useState("COMPLETO");
    const [showOnlyPassed, setShowOnlyPassed] = useState(false);
    const initialFormState = {
        norden: "",
        codigoInforme: null,
        nombreExamen: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",
        listaExamenes: ListaPorPlantilla["COMPLETO"],

        // Médico que Certifica //BUSCADOR
        idFirma: null,
        nombre_medico: "",
        user_medicoFirma: "",
    };

    const {
        form,
        setForm,
        handleChangeNumber,
        handleChangeSimple,
        handleClear,
        handleClearnotO,
    } = useForm(initialFormState);

    const handleSearch = async (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            const currentList = ListaPorPlantilla[selectedListType] || ListaPorPlantilla["COMPLETO"];
            await GetInfoPac(form.norden, setForm, token, selectedSede, currentList);
            obtenerFirmas(form.norden, token, setForm);
        }
    };

    const handleRegisterFirma = () => {
        SubmitDataService(token, () => { handleSearch({ key: "Enter" }) }, form);
    }

    const handleListChange = (e) => {
        const newValue = e.target.value;
        setSelectedListType(newValue);
        const newList = ListaPorPlantilla[newValue] || ListaPorPlantilla["COMPLETO"];

        if (form.norden) {
            handleClearnotO();
            GetInfoPac(form.norden, setForm, token, selectedSede, newList);
            obtenerFirmas(form.norden, token, setForm);
        } else {
            setForm((prev) => ({
                ...prev,
                listaExamenes: newList,
            }));
        }
    };

    const toggleExamen = (index) => {
        const newList = [...form.listaExamenes];
        // Solo permitir cambiar si el examen existe (resultado es true)
        if (newList[index].resultado) {
            newList[index].imprimir = !newList[index].imprimir;
            setForm((prev) => ({
                ...prev,
                listaExamenes: newList,
            }));
        }
    };

    const handleGenerarFolio = async () => {
        // Cancelar petición anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Mostrar alerta de carga con barra de progreso
        Swal.fire({
            title: 'Generando Folio',
            html: `
                <div class="mb-4">
                    <p class="text-gray-700 mb-2">Procesando reportes...</p>
                    <div class="w-full bg-gray-200 rounded-full h-6 mb-2">
                        <div id="progress-bar" class="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-white text-sm font-semibold" style="width: 0%">
                            0%
                        </div>
                    </div>
                    <p id="current-report" class="text-sm text-gray-600">Iniciando...</p>
                    <p id="report-count" class="text-xs text-gray-500 mt-1">0 de 0 reportes completados</p>
                </div>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            didOpen: () => {
                Swal.showLoading();
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                controller.abort();
            }
        });

        try {
            // Función callback para actualizar el progreso
            const updateProgress = (current, total, percentage, reportName) => {
                const progressBar = document.getElementById('progress-bar');
                const currentReport = document.getElementById('current-report');
                const reportCount = document.getElementById('report-count');

                if (progressBar) {
                    progressBar.style.width = `${percentage}%`;
                    progressBar.textContent = `${percentage}%`;
                }

                if (currentReport) {
                    currentReport.textContent = `Generando: ${reportName}`;
                }

                if (reportCount) {
                    reportCount.textContent = `${current} de ${total} reportes completados`;
                }
            };

            // Llamar a FolioJasper con el callback de progreso
            await FolioJasper(form.norden, token, form.listaExamenes, updateProgress, selectedListType, controller.signal, form.nombres, form.apellidos);

            // Cerrar la alerta de carga y mostrar éxito
            Swal.fire({
                icon: 'success',
                title: '¡Folio Generado!',
                text: 'El folio se ha generado correctamente',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            if (error.name === 'AbortError' || error.message === 'Aborted') {
                Swal.fire('Cancelado', 'La generación del folio ha sido cancelada.', 'info');
                return;
            }
            console.error('Error generando folio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al generar el folio. Por favor, intenta nuevamente.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div className="w-full space-y-3 px-4">
            {/* ===== SECCIÓN: DATOS NECESARIOS ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>
            {/* Contenido principal */}
            <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Columna Izquierda */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Nombres"
                        name="nombres"
                        value={form.nombres}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Apellidos"
                        name="apellidos"
                        value={form.apellidos}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Fecha Nacimiento"
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Lugar Nacimiento"
                        name="lugarNacimiento"
                        value={form.lugarNacimiento}
                        disabled
                        labelWidth="120px"
                    />
                </div>

                {/* Columna Derecha */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Domicilio Actual"
                        name="domicilioActual"
                        value={form.domicilioActual}
                        disabled
                        labelWidth="120px"
                    />
                    <div className="grid md:grid-cols-2 gap-3">
                        <InputTextOneLine
                            label="Edad (Años)"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Sexo"
                            name="sexo"
                            value={form.sexo}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                    <InputTextOneLine
                        label="Estado Civil"
                        name="estadoCivil"
                        value={form.estadoCivil}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Nivel Estudios"
                        name="nivelEstudios"
                        value={form.nivelEstudios}
                        disabled
                        labelWidth="120px"
                    />
                </div>
            </SectionFieldset>
            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <SectionFieldset legend="Datos Laborales" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InputTextOneLine
                    label="Empresa"
                    name="empresa"
                    value={form.empresa}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Contrata"
                    name="contrata"
                    value={form.contrata}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Ocupación"
                    name="ocupacion"
                    value={form.ocupacion}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Cargo Desempeñar"
                    name="cargoDesempenar"
                    value={form.cargoDesempenar}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: CONFIGURACIÓN ===== */}
            <SectionFieldset legend="Configuración" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                    <label className="font-semibold" style={{ minWidth: "120px" }}>Plantilla Protoco:</label>
                    <select
                        className="border rounded px-2 py-1 w-full"
                        value={selectedListType}
                        onChange={handleListChange}
                    >
                        {Object.keys(ListaPorPlantilla).map(elemento => (
                            <option value={elemento} key={elemento}>{elemento}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full flex  justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="showPassed"
                            checked={showOnlyPassed}
                            onChange={(e) => setShowOnlyPassed(e.target.checked)}
                            disabled={!form.nombres}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <label htmlFor="showPassed" className={`text-sm font-medium ${!form.nombres ? 'text-gray-400' : 'text-gray-700'} cursor-pointer select-none`}>
                            Exámenes Pasados Por el Paciente
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                            No pasados: <span className="text-red-600 ml-1">{form.listaExamenes?.filter(e => !e.resultado).length || 0}</span>
                        </div>
                        <div className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            Pasados: <span className="text-green-600 ml-1">{form.listaExamenes?.filter(e => e.resultado).length || 0}</span>
                        </div>
                        <div className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            Exámenes a imprimir: <span className="text-blue-600 ml-1">{form.listaExamenes?.filter(e => e.imprimir).length || 0}</span>
                        </div>
                    </div>
                </div>
            </SectionFieldset>
            <SectionFieldset legend="Asignación de Profesional Firma" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                />
                <div className="flex mt-auto">
                    <button type="button"
                        className={`
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                ${!form.norden
                                ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95 active:shadow-inner"
                            }
                        `}
                        onClick={handleRegisterFirma}
                        disabled={!form.norden}
                    >Registrar Firma</button>
                </div>

            </SectionFieldset>
            {/* ===== SECCIÓN: EXAMENES ===== */}
            <SectionFieldset legend="Examenes" className="flex flex-col justify-center items-center w-full">

                <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 w-full">
                    {form.listaExamenes?.map((examen, index) => {
                        if (showOnlyPassed && !examen.resultado) return null;

                        let cardClass = "break-inside-avoid mb-4 flex justify-between items-center border-2 p-3 rounded-md shadow-sm gap-2 h-24 transition-all duration-200";

                        if (!examen.resultado) {
                            // NO PASO -> ROJO FUERTE
                            cardClass += " bg-red-200 border-red-400 cursor-not-allowed opacity-90";
                        } else {
                            // SI PASO -> POINTER
                            cardClass += " cursor-pointer hover:shadow-md hover:scale-[1.01]";
                            if (!examen.imprimir) {
                                // PASO PERO DESACTIVADO -> GRIS VERDOSO
                                cardClass += " bg-gray-300 border-green-600 border-dashed";
                            } else {
                                // PASO Y ACTIVADO -> VERDE FUERTE
                                cardClass += " bg-green-200 border-green-500";
                            }
                        }

                        return (
                            <div
                                key={index}
                                className={cardClass}
                                onClick={(e) => {
                                    if (e.target.type !== 'checkbox') {
                                        toggleExamen(index);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={examen.imprimir || false}
                                        onChange={() => toggleExamen(index)}
                                        disabled={!examen.resultado}
                                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
                                    />
                                    <span className="font-bold text-gray-800 text-sm whitespace-normal break-words max-w-[150px] line-clamp-3 leading-tight select-none">
                                        {index + 1}.- {examen.nombre}
                                    </span>
                                </div>

                                <div className="flex flex-col items-end justify-center min-w-fit gap-1">
                                    <span className={`font-black text-sm whitespace-nowrap ${examen.resultado ? 'text-green-800' : 'text-red-800'} select-none`}>
                                        {examen.resultado ? 'PASO' : 'NO PASO'}
                                    </span>
                                    {examen.esArchivo && (
                                        <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm select-none">
                                            ARCHIVO
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center items-center w-full gap-4">
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-md mt-4 text-semibold"
                        onClick={() => { handleClear(); setSelectedListType("COMPLETO") }}
                    >
                        Limpiar
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-md mt-4 text-semibold"
                        onClick={handleGenerarFolio}
                        disabled={(form.listaExamenes?.filter(e => e.imprimir).length || 0) == 0}
                    >
                        Generar Folio
                    </button>
                </div>

            </SectionFieldset>
        </div>
    );
};

export default Folio;
