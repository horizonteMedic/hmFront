import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useState } from "react";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import FolioJasper from "../../../../jaspers/FolioJasper/FolioJasper";
import { getToday } from "../../../../utils/helpers";
import { GetInfoPac } from "./controllerFolio";
import Swal from "sweetalert2";
import { buildExamenesList } from "./folioCatalogo";

const ExamenesListPRUEBAS2 = buildExamenesList([
    "OFTALMOLOGIA_VISION_TESTER",
    "PSICOSENSOMETRICO_VEHI_FOLIO",
]);

const ExamenesListPRUEBAS = buildExamenesList([
    "FICHA_OFTALMOLOGICA",
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
    "CONSENTIMIENTO_INFORMADO",      // 19
]);

const ExamenesListOHLA = buildExamenesList([       //OHLA
    "RESUMEN_MEDICO_PODEROSA",                 // 1
    "CONSTANCIA_EXAMEN_MEDICO_OCUPACIONAL",    // 2
    "ANEXO_16",                                // 3
    "CERTIFICADO_ALTURA",                      // 4
    "OFTALMOLOGIA_VISION_TESTER",              // 5
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
    "RAYOS_X_TORAX_ARCHIVO",                   // 22
    "RADIOGRAFIA_COLUMNA",                     // 23
    "RADIOGRAFIA_COLUMNA_ARCHIVO",             // 24
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
    "CONSENT_PANEL_5D",
    "OIT",
    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "ODONTOGRAMA",
    "PSICOLOGIA_ANEXO_02",
    "ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA",
    "EXAMENES_COMPLEMENTARIOS",
    "TRABAJO_ALTURA_PSICO",
    "OFTALMOLOGIA",
    "CONSENT_DECLARACION_APTITUD",
    "CONSENTIMIENTO_INFORMADO",
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
    "CONSENT_PANEL_5D",
    "OIT",
    "RADIOGRAFIA_COLUMNA",
    "RADIOGRAFIA_COLUMNA_ARCHIVO",
    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "ODONTOGRAMA",
    "ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA",
    "CUESTIONARIO_BERLIN",
    "ESPACIOS_CONFINADOS_PSICOLOGIA",
    "OFTALMOLOGIA",
    "CONSENT_DECLARACION_APTITUD",
    "CONSENTIMIENTO_INFORMADO",
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
    "CONSENT_PANEL_5D",
    "OIT",
    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "ODONTOGRAMA",
    "PSICOLOGIA_ANEXO_02",
    "EXAMENES_COMPLEMENTARIOS",
    "OFTALMOLOGIA",
    "CONSENT_DECLARACION_APTITUD",
    "CONSENTIMIENTO_INFORMADO",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListSummaGold = buildExamenesList([   //SUMMAGOLD
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",
    "ANEXO_16A",
    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",
    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",
    "CONSENT_MARIHUANA",
    "OIT",
    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO",
    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "ODONTOGRAMA",
    "INFORME_PSICOLOGICO",
    "OFTALMOLOGIA",
    "OFTALMOLOGIA_VISION_TESTER",
    "CONSENTIMIENTO_INFORMADO",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListSmmot = buildExamenesList([       //SMMOT
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",
    "ANEXO_02",
    "CERTIFICADO_ALTURA",
    "PSICOSENSOMETRICO_CERT_ALTURA",
    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",
    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",
    "OIT",
    "RADIOGRAFIA_TORAX",
    "RAYOS_X_TORAX_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "PSICOLOGIA_ANEXO_02",
    "FICHA_OFTALMOLOGICA",
    "CONSENTIMIENTO_INFORMADO",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListRetiroLaArena = buildExamenesList([   // Retiro La Arena
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",

    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",

    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",

    "OIT",

    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "CUESTIONARIO_AUDIOMETRIA",

    "FICHA_OFTALMOLOGICA",

    "CONSENTIMIENTO_INFORMADO",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListRetiroSummaGold = buildExamenesList([   //  Retiro SummaGold
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",

    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",

    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",

    "OIT",

    "ESPIROMETRIA_ARCHIVO",
    "AUDIOMETRIA_OHLA",
    "ODONTOGRAMA",

    "FICHA_OFTALMOLOGICA",

    "CONSENTIMIENTO_INFORMADO",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListPsicosensometricoSolo = buildExamenesList([   // Psicosensometrico Solo
    "CERTIFICADO_VEHICULOS",
    "FICHA_SAS",

    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",

    "AUDIOMETRIA_OHLA",
    "CUESTIONARIO_AUDIOMETRIA",

    "TRABAJO_ESPECIFICOS",
    "FICHA_OFTALMOLOGICA",

    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListProseguridadBasico = buildExamenesList([   // PROSEGURIDAD BASICO
    "CERTIFICADO_ANEXO_02",
    "ANEXO_02",

    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",

    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",

    "CONSENT_PANEL_2D",

    "AUDIOMETRIA_OHLA",

    "PSICOLOGIA_ANEXO_03",

    "CONSENT_SINTOMATICO_RESPIRATORIO",

    "CONSENTIMIENTO_INFORMADO",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListPoderosaSoloConduccion = buildExamenesList([ // PODEROSA SOLO CONDUCCION DE VEHICULOS
    "RESUMEN_MEDICO_PODEROSA",
    "CONSTANCIA_EXAMEN_MEDICO_OCUPACIONAL",
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",

    "ENFERMEDADES_ALTURA_GEOGRAFICA",
    "ANEXO_16A",

    "CERTIFICADO_VEHICULOS",
    "FICHA_SAS",
    "LICENCIA_CONDUCIR_INTERNA_PODEROSA",
    "HOJA_CONSULTA_EXTERNA",
    "USO_RESPIRADORES",

    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",

    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",

    "OIT",

    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO_EXTERNO",
    "ESPIROMETRIA_ARCHIVO_EXTERNO",
    "AUDIOMETRIA_OHLA",
    "CUESTIONARIO_AUDIOMETRIA",

    "ODONTOGRAMA",

    "INFORME_PSICOLOGICO_PODEROSA_LICENCIA",

    "FICHA_OFTALMOLOGICA",

    "CONSENT_EVALUACION_MEDICA",
    "CONSENTIMIENTO_INFORMADO",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ExamenesListPoderosaSoloAltura = buildExamenesList([ // PODEROSA SOLO ALTURA
    "RESUMEN_MEDICO_PODEROSA",
    "CONSTANCIA_EXAMEN_MEDICO_OCUPACIONAL",
    "CERTIFICADO_APTITUD_ANEXO_16",
    "ANEXO_16",

    "ENFERMEDADES_ALTURA_GEOGRAFICA",
    "ANEXO_16A",

    "CERTIFICADO_ALTURA_PODEROSA",
    "PSICOSENSOMETRICO_ARCHIVO_EXTERNO",
    "CERTIFICADO_APTITUD_ALTURA_PODEROSA",

    "USO_RESPIRADORES",

    "HISTORIA_OCUPACIONAL",
    "ANTECEDENTES_PATOLOGICOS",
    "DECLARACION_JURADA_ANTECEDENTES",
    "CUESTIONARIO_NORDICO",
    "EVALUACION_MUSCULO_ESQUELETICA",

    "CONSENT_MUESTRA_SANGRE",
    "LABORATORIO_CLINICO",
    "PERFIL_LIPIDICO",

    "OIT",

    "ELECTROCARDIOGRAMA",
    "ELECTROCARDIOGRAMA_ARCHIVO_EXTERNO",
    "ESPIROMETRIA_ARCHIVO_EXTERNO",
    "AUDIOMETRIA_OHLA",
    "CUESTIONARIO_AUDIOMETRIA",

    "ODONTOGRAMA",

    "INFORME_PSICOLOGICO_PODEROSA",

    "TRABAJO_EN_ALTURA",

    "FICHA_OFTALMOLOGICA",

    "CONSENT_EVALUACION_MEDICA",
    "CONSENTIMIENTO_INFORMADO",
    "DECLARACION_USO_FIRMA_ARCHIVO",
    "INTERCONSULTAS"
]);

const ListaPorPlantilla = {
    OHLA: ExamenesListOHLA,
    OHLA1: ExamenesListOHLA1,
    OHLA2: ExamenesListOHLA2,
    OHLA3: ExamenesListOHLA3,
    CAMPANA: ExamenesListCAMPANA,
    PRUEBAS: ExamenesListPRUEBAS,
    SUMMAGOLD: ExamenesListSummaGold,
    SMMOT: ExamenesListSmmot,
    RETIRO_LA_ARENA: ExamenesListRetiroLaArena,
    RETIRO_SUMMAGOLD: ExamenesListRetiroSummaGold,
    PSICOSENSOMETRICO_SOLO: ExamenesListPsicosensometricoSolo,
    PROSEGURIDAD_BASICO: ExamenesListProseguridadBasico,
    PODEROSA_SOLO_CONDUCCION: ExamenesListPoderosaSoloConduccion,
    PODEROSA_SOLO_ALTURA: ExamenesListPoderosaSoloAltura,
};

const Folio = () => {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();
    const [selectedListType, setSelectedListType] = useState("OHLA");
    const initialFormState = {
        norden: "",
        codigoInforme: null,
        fechaEntrevista: today,
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
        listaExamenes: ListaPorPlantilla["OHLA"],
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleClear,
        handleRadioButtonBoolean,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "Folio_KEY" });

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            const currentList = ListaPorPlantilla[selectedListType] || ListaPorPlantilla["OHLA"];
            GetInfoPac(form.norden, setForm, token, selectedSede, currentList);
            //VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handleListChange = (e) => {
        const newValue = e.target.value;
        setSelectedListType(newValue);
        const newList = ListaPorPlantilla[newValue] || ListaPorPlantilla["OHLA"];

        if (form.norden) {
            handleClearnotO();
            GetInfoPac(form.norden, setForm, token, selectedSede, newList);
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
            didOpen: () => {
                Swal.showLoading();
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
            await FolioJasper(form.norden, token, form.listaExamenes, updateProgress, selectedListType);

            // Cerrar la alerta de carga y mostrar éxito
            Swal.fire({
                icon: 'success',
                title: '¡Folio Generado!',
                text: 'El folio se ha generado correctamente',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
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
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha Entrevista"
                    name="fechaEntrevista"
                    type="date"
                    value={form.fechaEntrevista}
                    onChange={handleChange}
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
            </SectionFieldset>

            {/* ===== SECCIÓN: EXAMENES ===== */}
            <SectionFieldset legend="Examenes" className="flex flex-col justify-center items-center w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {form.listaExamenes?.map((examen, index) => (
                        <div key={index} className="flex justify-between items-center border p-3 rounded-md shadow-sm bg-white gap-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={examen.imprimir || false}
                                    onChange={() => toggleExamen(index)}
                                    disabled={!examen.resultado}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <span className="font-medium text-gray-700 text-sm whitespace-normal break-words max-w-[150px] cursor-pointer" onClick={() => toggleExamen(index)}>
                                    {index + 1}.- {examen.nombre}
                                </span>
                            </div>
                            <span className={`font-bold text-sm ${examen.resultado ? 'text-green-600' : 'text-red-600'}`}>
                                {examen.resultado ? 'PASO' : 'NO PASO'}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center w-full gap-4">
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-md mt-4 text-semibold"
                        onClick={() => { handleClear(); setSelectedListType("OHLA") }}
                    >
                        Limpiar
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4 text-semibold"
                        onClick={handleGenerarFolio}
                    >
                        Generar Folio
                    </button>
                </div>

            </SectionFieldset>
        </div>
    );
};

export default Folio;
