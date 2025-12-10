import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { GetInfoPac } from "./controllerFolio";

const tabla = "informe_psicologico";
const today = getToday();

const ExamenesList = [
    {
        nombre: "CERTIFICADO DE APTITUD ANEXO 16",
        resultado: false,
    },
    {
        nombre: "ANEXO 16 ",
        resultado: false,
    },
    {
        nombre: "ENFERMEDADES EN ALTURA ",
        resultado: false,
    },
    {
        nombre: "ANEXO 16A",
        resultado: false,
    },
    {
        nombre: "USO DE RESPIRADORES",
        resultado: false,
    },
    {
        nombre: "HISTORIA OCUPACIONAL ",
        resultado: false,
    },
    {
        nombre: "ANTECEDENTES PATOLOGICOS",
        resultado: false,
    },
    {
        nombre: "CUESTIONARIO NORDICO",
        resultado: false,
    },
    {
        nombre: "EVALUACION MUSCULO ESQUELETICA ",
        resultado: false,
    },
    {
        nombre: "LABORATORIO CLINICO ",
        resultado: false,
    },
    {
        nombre: "ANALISIS BIOQUIMICOS (PERFIL LIPIDICO) OPCIONAL EN ALGUNOS EXAMANES ",
        resultado: false,
    },
    {
        nombre: "RADIOGRAFIA TORAX",
        resultado: false,
    },
    {
        nombre: "FICHA AUDIOLOGICA",
        resultado: false,
    },
    {
        nombre: "INFORME PSICOLOGICO",
        resultado: false,
    },
    {
        nombre: "FICHA OFTALMOLOGICA",
        resultado: false,
    },
    {
        nombre: "CONSENTIMIENTO INFORMADO ",
        resultado: false,
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
            GetInfoPac(form.norden, setForm, token, selectedSede);
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
                <button
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4 text-semibold"
                >
                    Generar Folio
                </button>

            </SectionFieldset>
        </div>
    );
};

export default Folio;