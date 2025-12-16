import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerTrastornoDePersonalidad';
import { InputsBooleanRadioGroup, InputTextArea, InputTextOneLine, RadioTable, SectionFieldset } from '../../../../../../components/reusableComponents/ResusableComponents';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';

const tabla = '';

const opGrupoA = [
    { name: "paranoide", label: "1.- Paranoide" },
    { name: "memoria", label: "2.- Esquizoide" },
    { name: "esquizotipico", label: "3.- Esquizotípico" },
    { name: "inestabilidadImpulsivo", label: "4.- T. Inestabilidad Emocional Subtipo Impulsivo" },
    { name: "inestabilidadLimite", label: "5.- T. Inestabilidad Emocional Subtipo Límite" },
];
const opGrupoB = [
    { name: "histrionico", label: "1.- Histriónico" },
    { name: "antisocial", label: "2.- Antisocial" },
    { name: "narcisista", label: "3.- Narcisista" },
];
const opGrupoC = [
    { name: "anancastico", label: "1.- Anancástico" },
    { name: "dependiente", label: "2.- Dependiente" },
    { name: "ansioso", label: "3.- Ansioso" },
];

const opcionesGrupos = [
    { value: "BAJO", label: "Bajo" },
    { value: "MEDIO", label: "Medio" },
    { value: "ALTO", label: "Alto" },
];

export default function TrastornoDePersonalidad() {
    const { token, userlogued, selectedSede, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: '',
        fecha: today,

        cumpleConPerfil: "",

        nombreExamen: "",

        dni: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        paranoide: "",
        memoria: "",
        esquizotipico: "",
        inestabilidadImpulsivo: "",
        inestabilidadLimite: "",

        histrionico: "",
        antisocial: "",
        narcisista: "",

        anancastico: "",
        dependiente: "",
        ansioso: "",

        analisisYResultados: "",
        recomendaciones: "",
        interpretacion: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleRadioButton,
        handleChangeSimple,
        handleClearnotO,
        handleClear,
        handlePrintDefault,
    } = useForm(initialFormState);

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla);
        });
    };

    return (
        <form className="space-y-3 p-4">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre del Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
                <InputsBooleanRadioGroup
                    label="Cumple con perfil"
                    name="cumpleConPerfil"
                    value={form.cumpleConPerfil}
                    labelWidth='120px'
                    onChange={handleChange}
                    trueLabel='Cumple'
                    falseLabel='No Cumple'
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Muestra" className="grid gap-3">
                <InputTextOneLine
                    label='Muestra'
                    name="muestra"
                    value={form.muestra}
                    labelWidth='120px'
                    onChange={handleChange}
                />
            </SectionFieldset>

            <SectionFieldset legend="Grupos" className='grid space-y-3'>
                <SectionFieldset legend="Grupo A">
                    <RadioTable
                        items={opGrupoA}
                        options={opcionesGrupos}
                        form={form}
                        handleRadioButton={handleRadioButton}
                        labelColumns={1}
                    />
                </SectionFieldset>
                <div className='grid xl:grid-cols-2 gap-y-3 gap-x-4'>
                    <SectionFieldset legend="Grupo B">
                        <RadioTable
                            items={opGrupoB}
                            options={opcionesGrupos}
                            form={form}
                            handleRadioButton={handleRadioButton}
                            labelColumns={1}
                        />
                    </SectionFieldset>
                    <SectionFieldset legend="Grupo C">
                        <RadioTable
                            items={opGrupoC}
                            options={opcionesGrupos}
                            form={form}
                            handleRadioButton={handleRadioButton}
                            labelColumns={1}
                        />
                    </SectionFieldset>
                </div>
            </SectionFieldset>
            <SectionFieldset legend="Resultados" className='grid xl:grid-cols-2 gap-x-4 gap-y-3'>
                <InputTextArea
                    label="Análisis y Resultados"
                    name="analisisYResultados"
                    value={form.analisisYResultados}
                    onChange={handleChange}
                    className='col-span-2'
                    rows={5}
                />
                <InputTextArea
                    label="Recomendaciones"
                    name="recomendaciones"
                    value={form.recomendaciones}
                    onChange={handleChange}
                    rows={5}
                />
                <InputTextArea
                    label="Interpretación Paranoide"
                    name="interpretacion"
                    value={form.interpretacion}
                    onChange={handleChange}
                    rows={5}
                />
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                />
            </SectionFieldset>

            <fieldset className="flex flex-col md:flex-row justify-between items-center gap-4 px-3">
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-bold italic mb-2">Imprimir</span>
                    <div className="flex items-center gap-2">
                        <InputTextOneLine
                            name="norden"
                            value={form.norden}
                            onChange={handleChange}
                            inputClassName="w-24"
                        />
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPrint} />
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}