import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerExamenOrina';
import {
    InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';

const tabla = 'lab_clinico';

export default function ExamenOrina() {
    const { token, userlogued, selectedSede, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: '',
        fecha: today,

        codLabclinico: null,

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

        // Campos de Examen de Orina - Estados iniciales
        color: 'AMARILLO CLARO',
        aspecto: 'TRANSPARENTE',
        densidad: '',
        ph: '',

        nitritos: 'NEGATIVO',
        proteinas: 'NEGATIVO',
        cetonas: 'NEGATIVO',
        leucocitosExamenQuimico: 'NEGATIVO',
        acAscorbico: 'NEGATIVO',
        urobilinogeno: 'NEGATIVO',
        bilirrubina: 'NEGATIVO',
        glucosaExamenQuimico: 'NEGATIVO',
        sangre: 'NEGATIVO',

        leucocitosSedimentoUnitario: '0-1',
        hematiesSedimentoUnitario: '0-0',
        celEpiteliales: 'ESCASAS',
        cristales: 'NO SE OBSERVAN',
        almidon: 'NO SE OBSERVAN',
        levadura: "NO SE OBSERVAN",
        cilindros: 'NO SE OBSERVAN',
        bacterias: 'NO SE OBSERVAN',
        gramSc: 'NO SE OBSERVAN',
        otros: 'NO SE OBSERVAN',

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        nombre_doctorAsignado: "",
        user_doctorAsignado: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleFocusNext,
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
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
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

            <div className="font-semibold text-center bg-gray-100 p-3 rounded">
                MUESTRA: ORINA
            </div>

            {/*Examen de Orina */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-3 flex flex-col">
                    <SectionFieldset legend="Examen Físico" className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-4">
                                <label className="font-semibold min-w-[100px] max-w-[100px]">Color :</label>
                                <select name="color" value={form.color} className="border rounded p-1 w-full" onChange={handleChange}>
                                    <option>N/A</option>
                                    <option>AMARILLO CLARO</option>
                                    <option>AMARILLO PAJIZO</option>
                                    <option>AMARILLO AMBAR</option>
                                    <option>AMBAR</option>
                                    <option>INCOLORO</option>
                                    <option>MEDICAMENTOSO</option>
                                    <option>SANGUINOLENTO</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="font-semibold min-w-[100px] max-w-[100px]">Aspecto:</label>
                                <select name="aspecto" value={form.aspecto} className="border rounded p-1 w-full" onChange={handleChange}>
                                    <option>N/A</option>
                                    <option>LIGERAMENTE TURBIO</option>
                                    <option>TRANSPARENTE</option>
                                    <option>TURBIO</option>
                                </select>
                            </div>
                            <InputTextOneLine
                                label="Densidad"
                                name="densidad"
                                value={form.densidad}
                                labelWidth="100px"
                                onChange={handleChange}
                            />
                            <InputTextOneLine
                                label="PH"
                                name="ph"
                                value={form.ph}
                                labelWidth="100px"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setForm(prev => {
                                        const isNA = form.color === "N/A";

                                        const defaults = {
                                            color: "AMARILLO CLARO",
                                            aspecto: "TRANSPARENTE",
                                            densidad: "",
                                            ph: "",
                                            nitritos: "NEGATIVO",
                                            proteinas: "NEGATIVO",
                                            cetonas: "NEGATIVO",
                                            leucocitosExamenQuimico: "NEGATIVO",
                                            acAscorbico: "NEGATIVO",
                                            urobilinogeno: "NEGATIVO",
                                            bilirrubina: "NEGATIVO",
                                            glucosaExamenQuimico: "NEGATIVO",
                                            sangre: "NEGATIVO",
                                            leucocitosSedimentoUnitario: "0-1",
                                            hematiesSedimentoUnitario: "0-0",
                                            celEpiteliales: "ESCASAS",
                                            cristales: "NO SE OBSERVAN",
                                            almidon: "NO SE OBSERVAN",
                                            levadura: "NO SE OBSERVAN",
                                            cilindros: "NO SE OBSERVAN",
                                            bacterias: "NO SE OBSERVAN",
                                            gramSc: "NO SE OBSERVAN",
                                            otros: "NO SE OBSERVAN",
                                        };
                                        const cleared = Object.fromEntries(
                                            Object.keys(defaults).map(key => [key, "N/A"])
                                        );
                                        return {
                                            ...prev,
                                            ...(isNA ? defaults : cleared)
                                        };
                                    });

                                }}
                            >
                                No Aplica
                            </button>
                        </div>
                    </SectionFieldset>

                    <SectionFieldset legend="Sedimento Urinario" className="space-y-2 grid xl:grid-cols-2 gap-x-4">
                        <div className="grid gap-y-2">
                            {[
                                { label: 'Leucocitos (x campos)', key: 'leucocitosSedimentoUnitario' },
                                { label: 'CelEpiteliales', key: 'celEpiteliales' },
                                { label: 'Cilindros', key: 'cilindros' },
                                { label: 'Almidon', key: 'almidon' },
                                { label: 'Gram S/C', key: 'gramSc' },
                            ].map((item) => (
                                <InputTextOneLine
                                    label={item.label}
                                    name={item.key}
                                    key={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    onKeyUp={handleFocusNext}
                                />
                            ))}
                        </div>
                        <div className="grid gap-y-2">
                            {[
                                { label: 'Hematies (x campos)', key: 'hematiesSedimentoUnitario' },
                                { label: 'Cristales', key: 'cristales' },
                                { label: 'Bacterias', key: 'bacterias' },
                                { label: 'Levadura', key: 'levadura' },
                                { label: 'Otros', key: 'otros' },
                            ].map((item) => (
                                <InputTextOneLine
                                    label={item.label}
                                    name={item.key}
                                    key={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    onKeyUp={handleFocusNext}
                                />
                            ))}
                        </div>
                    </SectionFieldset>
                </div>
                <div className="space-y-3 flex flex-col">
                    <SectionFieldset legend="Examen Químico" className="grid xl:grid-cols-2 gap-y-2 xl:gap-y-0 gap-x-4">
                        <div className="grid gap-y-2 ">
                            {[
                                { label: 'Nitritos', key: 'nitritos' },
                                { label: 'Cetonas', key: 'cetonas' },
                                { label: 'Ác. Ascórbico', key: 'acAscorbico' },
                                { label: 'Bilirrubina', key: 'bilirrubina' },
                                { label: 'Sangre', key: 'sangre' },
                            ].map((item) => (
                                <InputTextOneLine
                                    label={item.label}
                                    name={item.key}
                                    key={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    onKeyUp={handleFocusNext}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-2 ">
                            {[
                                { label: 'Proteínas', key: 'proteinas' },
                                { label: 'Leucocitos', key: 'leucocitosExamenQuimico' },
                                { label: 'Urobilinógeno', key: 'urobilinogeno' },
                                { label: 'Glucosa', key: 'glucosaExamenQuimico' },

                            ].map((item) => (
                                <InputTextOneLine
                                    label={item.label}
                                    name={item.key}
                                    key={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    onKeyUp={handleFocusNext}
                                />
                            ))}
                        </div>
                    </SectionFieldset>
                    <SectionFieldset legend="Especialista">
                        <EmpleadoComboBox
                            value={form.nombre_medico}
                            label="Especialista"
                            form={form}
                            onChange={handleChangeSimple}
                        />
                        <EmpleadoComboBox
                            value={form.nombre_doctorAsignado}
                            label="Doctor Asignado"
                            form={form}
                            onChange={handleChangeSimple}
                            nameField="nombre_doctorAsignado"
                            idField="user_doctorAsignado"
                        />
                    </SectionFieldset>
                </div>
            </div>

            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div>
    );
}
