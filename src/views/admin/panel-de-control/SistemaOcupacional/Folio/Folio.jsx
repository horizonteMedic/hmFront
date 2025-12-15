import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import FolioJasper from "../../../../jaspers/FolioJasper/FolioJasper";
import { getToday } from "../../../../utils/helpers";
import { GetInfoPac } from "./controllerFolio";

const tabla = "informe_psicologico";
const today = getToday();

const ExamenesList = [
    {
        nombre: "CERTIFICADO DE APTITUD ANEXO 16",
        resultado: false,
        tabla: "certificado_aptitud_medico_ocupacional",
        url: "/api/v01/ct/anexos/fichaAnexo16/obtenerReporteFichaAnexo16",
        esJasper: true
    },
    {
        nombre: "ANEXO 16 ",
        resultado: false,
        tabla: "anexo7c",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporte2Anexo16"
    },
    {
        nombre: "ENFERMEDADES EN ALTURA ",
        resultado: false,
        tabla: "antece_enfermedades_altura",
        url: "/api/v01/ct/antecedentesEnfermedadesAltura/obtenerReporteAntecedentesEnfermedadesAltura"
    },
    {
        nombre: "ANEXO 16A",
        resultado: false,
        tabla: "anexo16a",
        url: "/api/v01/ct/anexos/anexo16a/obtenerReporteAnexo16a",
        esJasper: true
    },
    {
        nombre: "USO DE RESPIRADORES",
        resultado: false,
        tabla: "b_uso_respiradores",
        url: "/api/v01/ct/respiradores/obtenerReporteRespiradores",
        esJasper: true
    },
    {
        nombre: "HISTORIA OCUPACIONAL ",
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
    {
        nombre: "CUESTIONARIO NORDICO",
        resultado: false,
        tabla: "cuestionario_nordico",
        url: "/api/v01/ct/cuestionarioNordico/obtenerReporteCuestionarioNordico"
    },
    {
        nombre: "EVALUACION MUSCULO ESQUELETICA ",
        resultado: false,
        tabla: "evaluacion_musculo_esqueletica",
        url: "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica"
    },
    {
        nombre: "LABORATORIO CLINICO ",
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
    {
        nombre: "RADIOGRAFIA TORAX",
        resultado: false,
        tabla: "radiografia_torax",
        url: "/api/v01/ct/rayosX/obtenerReporteRadiografiaTorax"
    },
    {
        nombre: "FICHA AUDIOLOGICA",
        resultado: false,
        tabla: "ficha_audiologica",
        url: "/api/v01/ct/audiometria/obtenerReporteAudiometriaM"
    },
    {
        nombre: "INFORME PSICOLOGICO",
        resultado: false,
        tabla: "informe_psicologico",
        url: "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico",
        esJasper: true
    },
    {
        nombre: "FICHA OFTALMOLOGICA",
        resultado: false,
        tabla: "oftalmologia",
        url: "/api/v01/ct/agudezaVisual/obtenerReporteOftalmologia"
    },
    {
        nombre: "CONSENTIMIENTO INFORMADO ",
        resultado: false,
        tabla: "consentimientoInformado",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado"
    },
];

const Folio = () => {
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
                        onClick={() => { FolioJasper(form.norden, token, form.listaExamenes) }}
                    >
                        Generar Folio
                    </button>
                </div>

            </SectionFieldset>
        </div>
    );
};

export default Folio;