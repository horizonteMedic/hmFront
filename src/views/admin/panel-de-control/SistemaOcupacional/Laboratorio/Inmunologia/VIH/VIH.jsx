import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerVIH';
import {
    InputTextOneLine,
    InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';

const tabla = '';

export default function VIH() {
    const { token, userlogued, selectedSede, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: '',
        fecha: today,

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

        muestra: 'SUERO',
        resultado: 'NEGATIVO',

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
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Muestra y Resultado" className="grid gap-y-3">
                <InputTextOneLine
                    label="Muestra"
                    name="muestra"
                    value={form.muestra}
                    onChange={handleChange}
                    labelWidth="120px"
                />
                <div className="flex gap-4">
                    <InputTextOneLine
                        label='VIH'
                        name="resultado"
                        value={form.resultado}
                        disabled
                        className='w-full max-w-[80%]'
                        labelWidth='120px'
                    />
                    <InputsRadioGroup
                        name="resultado"
                        value={form.resultado}
                        onChange={handleRadioButton}
                        options={[
                            { label: 'Positivo', value: 'POSITIVO' },
                            { label: 'Negativo', value: 'NEGATIVO' },
                        ]}
                    />
                </div>

            </SectionFieldset>

            <SectionFieldset legend="Especialista">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    form={form}
                    label='Especialista que Certifica'
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
                        <FontAwesomeIcon icon={faSave} /> Guardar
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
                            inputClassName="w-28"
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
