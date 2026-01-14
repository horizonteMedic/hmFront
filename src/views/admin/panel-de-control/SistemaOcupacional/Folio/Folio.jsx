import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import FolioJasper from "../../../../jaspers/FolioJasper/FolioJasper";
import { getToday } from "../../../../utils/helpers";
import { GetInfoPac } from "./controllerFolio";
import Swal from "sweetalert2";

const ExamenesList2 = [
    {
        nombre: "RAYOS X TORAX ARCHIVO", //NUEVO ARCHIVO
        resultado: false,
        tabla: "RAYOS X TORAX",
        url: ""
    },
]

const ExamenesList = [
    {
        nombre: "RESUMEN MEDICO PODEROSA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "resumen_medico_poderosa",
        url: "/api/v01/ct/anexos/obtenerReporteResumenMedico",
    },
    {
        nombre: "CONSTANCIA DE EXAMEN MEDICO OCUPACIONAL",
        resultado: false,
        tabla: "certificado_aptitud_medico_resumen",
        url: "/api/v01/ct/certificadoAptitudMedicoOcupacional/obtenerReporteCertificadoMedicoOcupacional",
        esJasper: true
    },
    {
        nombre: "CERTIFICADO DE APTITUD ANEXO 16",
        resultado: false,
        tabla: "certificado_aptitud_medico_ocupacional",
        url: "/api/v01/ct/anexos/fichaAnexo16/obtenerReporteFichaAnexo16",
        esJasper: true
    },
    {
        nombre: "ANEXO 16",
        resultado: false,
        tabla: "anexo7c",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16"
    },
    //FICHA APTITUD ANEXO 2
    {
        nombre: "CERTIFICADO MEDICO OCUPACIONAL ANEXO 02",
        resultado: false,
        tabla: "aptitud_medico_ocupacional_agro",
        url: "/api/v01/ct/anexos/fichaAnexo2/obtenerReporteFichaAnexo2",
        esJasper: true
    },
    //ANEXO 02
    {
        nombre: "ANEXO 02",
        resultado: false,
        tabla: "anexo_agroindustrial",
        url: "/api/v01/ct/anexos/anexo2/obtenerReporteAnexo2Completo",
        esJasper: true
    },
    //ENFERMEDADES ALTURA GEOGRAFICA
    {
        nombre: "ENFERMEDADES EN ALTURA",
        resultado: false,
        tabla: "antece_enfermedades_altura",
        url: "/api/v01/ct/antecedentesEnfermedadesAltura/obtenerReporteAntecedentesEnfermedadesAltura"
    },
    //ANEXO 16A
    {
        nombre: "ANEXO 16A",
        resultado: false,
        tabla: "anexo16a",
        url: "/api/v01/ct/anexos/anexo16a/obtenerReporteAnexo16a",
        esJasper: true
    },
    //Certificado en Altura
    {
        nombre: "CERTIFICADO ALTURA",
        resultado: false,
        tabla: "b_certificado_altura",
        url: "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAltura",
        esJasper: true
    },
    //PSICOSENSOMETRICO
    // {
    //     nombre: "PSICOSENSOMETRICO ",//NUEVO ARCHIVO EXTERNO
    //     resultado: false,
    //     tabla: "PSICOSENSOMETRICO",
    //     url: ""
    // },
    //Certificado en Altura PODEROSA
    {
        nombre: "CERTIFICADO APTITUD ALTURA PODEROSA",
        resultado: false,
        tabla: "aptitud_altura_poderosa",
        url: "/api/v01/ct/aptitudAltura/obtenerReporteAptitudAlturaPoderosa",
        esJasper: true
    },
    //Certificado Vehiculos
    {
        nombre: "CERTIFICADO VEHICULOS",
        resultado: false,
        tabla: "b_certificado_conduccion",
        url: "/api/v01/ct/certificadoConduccion/obtenerReporteCertificadoConduccion",
        esJasper: true
    },
    //Ficha sas
    {
        nombre: "FICHA SAS",
        resultado: false,
        tabla: "ficha_sas",
        url: "/api/v01/ct/fichaApneaSueno/obtenerReporteFichaSas",
        esJasper: true
    },
    //LICENCIA PARA CONDUCIR INTERNA PODEROSA
    {
        nombre: "LICENCIA PARA CONDUCIR INTERNA PODEROSA",//NUEVO  OPTIMIZAR
        resultado: false,
        tabla: "aptitud_licencia_conduciri",
        url: "/api/v01/ct/aptitudLicenciaConducir/obtenerReporteAptitudLicenciaConducir",
        esJasper: true
    },
    //HOJA DE CONSULTA EXTERNA
    {
        nombre: "HOJA DE CONSULTA EXTERNA",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "hoja_consulta_externa",
        url: "/api/v01/ct/hojaConsultaExterna/obtenerReporteHojaConsultaExterna",
    },
    {
        nombre: "USO DE RESPIRADORES",
        resultado: false,
        tabla: "b_uso_respiradores",
        url: "/api/v01/ct/respiradores/obtenerReporteRespiradores",
        esJasper: true
    },
    {
        nombre: "HISTORIA OCUPACIONAL",
        resultado: false,
        tabla: "historia_oc_info",
        url: "/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional"
    },
    {
        nombre: "ANTECEDENTES PATOLOGICOS",
        resultado: false,
        tabla: "antecedentes_patologicos",
        url: "/api/v01/ct/antecedentesPatologicos/obtenerReporteAntecedentesPatologicos",
        esJasper: true
    },
    //DECLARACION JURADA DE ANTECEDENTES PATOLOGICOS Y FAMILIARES
    {
        nombre: "DECLARACION JURADA DE ANTECEDENTES PATOLOGICOS Y FAMILIARES",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "DECLA_JURA_ANTECE_PERSON_FAM",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },
    {
        nombre: "CUESTIONARIO NORDICO",
        resultado: false,
        tabla: "cuestionario_nordico",
        url: "/api/v01/ct/cuestionarioNordico/obtenerReporteCuestionarioNordico"
    },
    {
        nombre: "EVALUACION MUSCULO ESQUELETICA",
        resultado: false,
        tabla: "evaluacion_musculo_esqueletica",
        url: "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica"
    },
    //CONSENTIMIENTO DE MUESTRA DE SANGRE
    {
        nombre: "CONSENTIMIENTO DE MUESTRA DE SANGRE",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "consent_Muestra_Sangre",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true
    },
    {
        nombre: "LABORATORIO CLINICO",
        resultado: false,
        tabla: "lab_clinico",
        url: "/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico"
    },
    {
        nombre: "ANALISIS BIOQUIMICOS (PERFIL LIPIDICO) OPCIONAL EN ALGUNOS EXAMANES ",
        resultado: false,
        tabla: "analisis_bioquimicos",
        url: "/api/v01/ct/laboratorio/reporteAnalisisBioquimico"
    },
    //INMUNOLOGIA - GENODOTROPINA
    {
        nombre: "INMUNOLOGIA - GENODOTROPINA",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "lgonadotropina",
        url: "/api/v01/ct/inmunologia/obtenerReporteLgonadotropina",
    },
    //CONSENTIMIENTO DE MARIHUANA 
    {
        nombre: "CONSENTIMIENTO DE MARIHUANA",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "consent_marihuana",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },
    //CONSENTIMIENTO PANEL 2D
    {
        nombre: "CONSENTIMIENTO PANEL 2D",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "con_panel2D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },
    //CONSENTIMIENTO DROGAS BOROO
    {
        nombre: "CONSENTIMIENTO DROGAS BOROO",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "consent_Boro",
        url: "/api/v01/ct/laboratorio/consentimientoLaboratorioBoro",
        nameConset: true,
    },
    {
        nombre: "OIT",
        resultado: false,
        tabla: "oit",
        url: "/api/v01/ct/oit/obtenerReporteOit"
    },
    {
        nombre: "RADIOGRAFIA TORAX",
        resultado: false,
        tabla: "radiografia_torax",
        url: "/api/v01/ct/rayosX/obtenerReporteRadiografiaTorax"
    },
    //RAYOS X TORAX ARCHIVO
    // {
    //     nombre: "RAYOS X TORAX ARCHIVO", //NUEVO ARCHIVO FALTA IMPRIMIR
    //     resultado: false,
    //     tabla: "RAYOS X TORAX",
    //     url: ""
    // },
    //INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA)
    {
        nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA)", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "radiografia",
        url: "/api/v01/ct/rayosX/obtenerReporteInformeRadiografico"
    },
    //INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA) ARCHIVO
    // {
    //     nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA) ARCHIVO", //NUEVO ARCHIVO FALTA IMPRIMIR
    //     resultado: false,
    //     tabla: "INFORME RADIOGRAFICO",
    //     url: ""
    // },
    {
        nombre: "ELECTROCARDIOGRAMA",
        resultado: false,
        tabla: "informe_electrocardiograma",
        url: "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma",
        esJasper: true
    },
    //ELECTROCARDIOGRAMA ARCHIVO
    // {
    //     nombre: "ELECTROCARDIOGRAMA ARCHIVO", //NUEVO ARCHIVO FALTA IMPRIMIR
    //     resultado: false,
    //     tabla: "ELECTROCARDIOGRAMA",
    //     url: ""
    // },
    {
        nombre: "ESPIROMETRIA",
        resultado: false,
        tabla: "ESPIROMETRIA",
        url: ""
    },
    {
        nombre: "FICHA AUDIOLOGICA OHLA",
        resultado: false,
        tabla: "audiometria_po",
        url: "/api/v01/ct/audiometria/obtenerReporteAudiometriaM"
    },
    //FICHA AUDIOMETRIA
    {
        nombre: "FICHA AUDIOMETRIA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "audiometria_2023",
        url: "/api/v01/ct/manipuladores/obtenerReporteAudiometria"
    },
    //CUESTIONARIO AUDIOMETRIA 
    {
        nombre: "CUESTIONARIO AUDIOMETRIA ", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "cuestionario_audiometria",
        url: "/api/v01/ct/audiometria/obtenerReporteCuestionarioAudiometria"
    },
    //FICHA INTERCONSULTA 
    // {
    //     nombre: "FICHA INTERCONSULTA", //NUEVO REVISAR SERAN VARIOS CONSUMOS
    //     resultado: false,
    //     tabla: "ficha_interconsulta",
    //     url: "/api/v01/ct/fichaInterconsulta/obtenerFichaInterconsultaReporte"
    // },
    //ODONTROGRAMA
    {
        nombre: "ODONTROGRAMA", //NUEVO OPTIMIZAR Y REENCUADRE JEAN
        resultado: false,
        tabla: "odontograma",
        url: "/api/v01/ct/odontograma/obtenerReporteOdontograma"
    },
    //PSICOLOGIA ANEXO 03
    {
        nombre: "PSICOLOGIA ANEXO 03", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "ficha_psicologica_anexo03",
        url: "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo03",
        esJasper: true,
    },
    //TEST DE FATIGA Y SOMNOLENCIA
    {
        nombre: "TEST DE FATIGA Y SOMNOLENCIA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "informe_psicologico_estres",
        url: "/api/v01/ct/informePsicologicoAdeco/obtenerReporteInformePsicologicoAdeco",
        esJasper: true,
    },
    //INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR
    {
        nombre: "INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "evaluacion_psicologica_poderosa",
        url: "/api/v01/ct/evaluacionPsicologicaPoderosa/obtenerReporteEvaluacionPsicologicaPoderosa",
        esJasper: true,
    },
    //PSICOLOGIA ANEXO 02
    {
        nombre: "PSICOLOGIA ANEXO 02", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "ficha_psicologica_anexo02",
        url: "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo02",
        esJasper: true,
    },
    {
        nombre: "INFORME PSICOLOGICO",
        resultado: false,
        tabla: "informe_psicologico",
        url: "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico",
        esJasper: true
    },
    //INFORME PSICOLOGIA FOBIAS
    {
        nombre: "INFORME PSICOLOGIA FOBIAS", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "fobias",
        url: "/api/v01/ct/fobias/obtenerReporte",
        esJasper: true
    },
    //INFORME PSICOLABORAL
    {
        nombre: "INFORME PSICOLABORAL", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "informe_psicolaboral",
        url: "/api/v01/ct/informePsicolaboral/obtenerReporteInformePsicolaboral",
        esJasper: true
    },
    //TRABAJOS EN ESPECIFICOS
    {
        nombre: "TRABAJOS EN ESPECIFICOS", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "especificos",
        url: "/api/v01/ct/trabajoEspecifico/obtenerReporteTrabajosEspecificos",
        esJasper: true
    },
    //TRABAJO EN ALTURA
    {
        nombre: "TRABAJO EN ALTURA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "psicologiafobias",
        url: "/api/v01/ct/informePsicologicoFobias/obtenerReporteInformePsicologicoFobias",
        esJasper: true
    },
    //OFTALMOLOGIA
    {
        nombre: "OFTALMOLOGIA", //NUEVO OPTIMIZAR JEAN URGENTE
        resultado: false,
        tabla: "oftalmologia2021",
        url: "/api/v01/ct/agudezaVisual/obtenerReporteEvaluacionOftalmologica",
    },
    //OFTALMOLOGIA VISION TESTER
    // {
    //     nombre: "OFTALMOLOGIA VISION TESTER", //NUEVO ARCHIVO FALTA IMPRIMIR
    //     resultado: false,
    //     tabla: "OFTALMOLOGIA VISION TESTER",
    //     url: ""
    // },
    {
        nombre: "FICHA OFTALMOLOGICA",
        resultado: false,
        tabla: "oftalmologia",
        url: "/api/v01/ct/agudezaVisual/obtenerReporteOftalmologia"
    },
    //DECLARACION DE SINTOMATICO RESPIRATORIO
    {
        nombre: "DECLARACION DE SINTOMATICO RESPIRATORIO", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "CONSENT_SINTOMATICO",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },
    //CONSENTIMIENTO INFORMADO DE EVALUACION MEDICA
    {
        nombre: "CONSENTIMIENTO INFORMADO DE EVALUACION MEDICA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "CONSENT_INFORMADO_MEDICA",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },
    //CONSENTIMIENTO BUENA SALUD
    {
        nombre: "CONSENTIMIENTO BUENA SALUD", //NUEVO
        resultado: false,
        tabla: "consentimientobuenasalud",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoBuenaSalud",
        esJasper: true
    },
    {
        nombre: "CONSENTIMIENTO INFORMADO",
        resultado: false,
        tabla: "consentimientoInformado",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado"
    },
    //DECLARACION JURADA PARA EL USO DE FIRMA ELECTRONICA
    // {
    //     nombre: "DECLARACION JURADA PARA EL USO DE FIRMA ELECTRONICA", //NUEVO ARCHIVO
    //     resultado: false,
    //     tabla: "DECLARACION USO FIRMA",
    //     url: "",
    // },
    //DNI Y OTROS DOCUMENTOS
    // {
    //     nombre: "DNI Y OTROS DOCUMENTOS", //NUEVO ARCHIVO
    //     resultado: false,
    //     tabla: "DNI Y OTROS DOCUMENTOS",
    //     url: "",
    // },
];

const Folio = () => {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();
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
        listaExamenes: ExamenesList,
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
            GetInfoPac(form.norden, setForm, token, selectedSede, ExamenesList);
            //VerifyTR(form.norden, tabla, token, setForm, selectedSede);
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
            await FolioJasper(form.norden, token, form.listaExamenes, updateProgress);

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
            {/* ===== SECCIÓN: EXAMENES ===== */}
            <SectionFieldset legend="Examenes" className="flex flex-col justify-center items-center w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {form.listaExamenes?.map((examen, index) => (
                        <div key={index} className="flex justify-between items-center border p-3 rounded-md shadow-sm bg-white">
                            <span className="font-medium text-gray-700 text-sm whitespace-normal break-words max-w-[150px]">{examen.nombre}</span>
                            <span className={`font-bold text-sm ${examen.resultado ? 'text-green-600' : 'text-red-600'}`}>
                                {examen.resultado ? 'PASO' : 'NO PASO'}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center w-full gap-4">
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-md mt-4 text-semibold"
                        onClick={handleClear}
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