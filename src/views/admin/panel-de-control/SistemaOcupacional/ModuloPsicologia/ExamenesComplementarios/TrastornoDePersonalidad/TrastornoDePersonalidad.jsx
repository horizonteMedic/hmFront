import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerTrastornoDePersonalidad';
import { InputsBooleanRadioGroup, InputTextArea, InputTextOneLine, RadioTable, SectionFieldset } from '../../../../../../components/reusableComponents/ResusableComponents';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';

const tabla = 'trastornos_personalidad';

const opGrupoA = [
    { name: "paranoide", label: "1.- Paranoide" },
    { name: "esquizoide", label: "2.- Esquizoide" },
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

        cumpleConPerfil: undefined,

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
        esquizoide: "",
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
        handleRadioButtonBoolean,
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
        <form className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
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
                    onChange={handleRadioButtonBoolean}
                    trueLabel='Cumple'
                    falseLabel='No Cumple'
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

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

            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </form>
    );
}