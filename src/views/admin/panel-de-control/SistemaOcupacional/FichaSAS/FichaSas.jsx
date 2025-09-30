import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputCheckbox,
    InputsRadioGroup,
    InputsBooleanRadioGroup
} from "../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
import MedicoSearch from "../../../../components/reusableComponents/MedicoSearch";

const tabla = "ficha_sas"
const today = getToday();

export default function FichaSas({ MedicosMulti }) {

    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();

    const initialFormState = {
        // Header
        //datos personales
        //trabaja noche

        // Antecedentes personales

        // Médico que Certifica
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleChangeSimple,
        handleCheckBoxChange,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState);

    const handleSave = () => {
        // SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
        console.log("Guardando datos:", form);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            // PrintHojaR(form.norden, token, tabla, datosFooter);
            console.log("Imprimiendo:", form.norden);
        });
    };

    return (
        <div className="space-y-6 max-w-[95%] mx-auto">
            {/* Header */}
            <section className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form?.norden}
                    onChange={handleChangeNumber}
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="Fecha Examen"
                    type="date"
                    name="fecha"
                    value={form?.fechaExam}
                    onChange={handleChangeSimple}
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="tipoExamen"
                    value={form?.tipoExamen}
                    disabled
                />
                <InputTextOneLine
                    label="Tipo Licencia"
                    name="tipoLicencia"
                    value={form?.tipoLicencia}
                    onChange={handleChangeSimple}
                />
            </section>
            {/* FILIACIÓN */}
            <section className="space-y-6">
                {/* Datos del trabajador */}
                <section className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Datos del Paciente</h3>
                    {/* Fila 1: Nombres, DNI, Edad, Género */}
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-3">
                        <InputTextOneLine
                            label="Nombres y Apellidos"
                            name="nombres"
                            value={form?.nombres}
                            disabled
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <InputTextOneLine
                                label="DNI"
                                name="dni"
                                value={form?.dni}
                                disabled
                            />
                            <InputTextOneLine
                                label="Edad"
                                name="edad"
                                value={form?.edad}
                                disabled
                            />
                            <InputTextOneLine
                                label="Sexo"
                                name="sexo"
                                value={form?.sexo}
                                disabled
                            />
                        </div>
                        <InputTextOneLine
                            label="Empresa"
                            name="empresa"
                            value={form?.empresa}
                            disabled
                        />
                        <InputTextOneLine
                            label="Contrata"
                            name="contrata"
                            value={form?.contrata}
                            disabled
                        />
                        <InputTextOneLine
                            label="Area de Trabajo"
                            name="puestoPostula"
                            value={form?.puestoPostula}
                            disabled
                        />
                        <InputTextOneLine
                            label="Puesto de Trabajo"
                            name="puestoActual"
                            value={form?.puestoActual}
                            disabled
                        />
                    </div>
                </section>
                {/* Trabajo de Noche & Antecedentes Personales */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Trabajo de noche */}
                    <section className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-12">
                            <h3 className="text-lg font-semibold mb-3 min-w-[128px]">Trabajo de Noche</h3>
                            <InputsBooleanRadioGroup
                                name="trabajoNoche"
                                value={form?.trabajoNoche}
                                onChange={(e, value) => {
                                    if (!e.value) {
                                        setForm({ ...form, diasTrabajoNoche: "", diasDescansoNoche: "", anosTrabajoNoche: "" })
                                    };
                                    handleRadioButtonBoolean(e, value)
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <InputTextOneLine
                                label="N° días trabajo"
                                name="diasTrabajoNoche"
                                value={form?.diasTrabajoNoche}
                                onChange={handleChangeNumber}
                                disabled={!form?.trabajoNoche}
                                labelWidth="140px"
                            />
                            <InputTextOneLine
                                label="N° días descanso"
                                name="diasDescansoNoche"
                                value={form?.diasDescansoNoche}
                                onChange={handleChangeNumber}
                                disabled={!form?.trabajoNoche}
                                labelWidth="140px"
                            />
                            <InputTextOneLine
                                label="Años de trabajo en dicho horario de trabajo"
                                name="anosTrabajoNoche"
                                value={form?.anosTrabajoNoche}
                                onChange={handleChangeNumber}
                                disabled={!form?.trabajoNoche}
                                labelWidth="140px"
                            />
                        </div>
                    </section>
                    {/* Antecedentes personales */}
                    <section className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Antecedentes Personales</h3>
                        <div className="grid gap-3">
                            <div className="flex w-full gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[100px]">Ápnea del sueño:</span>
                                    <InputsBooleanRadioGroup
                                        name="apneaDelSueno"
                                        value={form?.apneaDelSueno}
                                        onChange={(e, value) => {
                                            if (!value) {
                                                setForm({ ...form, ultimoControl: "" })
                                            };
                                            handleRadioButtonBoolean(e, value)
                                        }}
                                    />
                                </div>
                                <InputTextOneLine
                                    label="Último control"
                                    name="ultimoControl"
                                    value={form?.ultimoControl}
                                    disabled={!form?.apneaDelSueno}
                                    onChange={handleChange}
                                    className="w-full"
                                    labelWidth="90px"
                                />
                            </div>
                            <div className="flex w-full gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[100px]">HTA:</span>
                                    <InputsBooleanRadioGroup
                                        name="hta"
                                        value={form?.hta}
                                        onChange={(e, value) => {
                                            if (!value) {
                                                setForm({ ...form, medicacionRiesgo: "" })
                                            };
                                            handleRadioButtonBoolean(e, value)
                                        }}
                                    />
                                </div>
                                <InputTextOneLine
                                    label="Medicación (riesgo >2)"
                                    name="medicacionRiesgo"
                                    value={form?.medicacionRiesgo}
                                    disabled={!form?.hta}
                                    onChange={handleChange}
                                    className="w-full"
                                    labelWidth="90px"
                                />
                            </div>
                            <div className="flex w-full gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[100px]">Polisomnografía realizada:</span>
                                    <InputsBooleanRadioGroup
                                        name="polisomnografiaRealizada"
                                        value={form?.polisomnografiaRealizada}
                                        onChange={(e, value) => {
                                            setForm((prev) => ({ ...prev, fechaUltimaPolisomnografia: !value ? "" : today }))
                                            handleRadioButtonBoolean(e, value)
                                        }}
                                    />
                                </div>
                                <InputTextOneLine
                                    label="Fecha última polisomnografía"
                                    name="fechaUltimaPolisomnografia"
                                    value={form?.fechaUltimaPolisomnografia}
                                    disabled={!form?.polisomnografiaRealizada}
                                    type="date"
                                    onChange={handleChangeSimple}
                                    className="w-full"
                                    labelWidth="90px"
                                />
                            </div>
                            <span className="font-bold">Antecedentes de choque de vehículo</span>
                            <div className="flex w-full gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[100px] max-w-[100px]">Accidente en la mina:</span>
                                    <InputsBooleanRadioGroup
                                        name="accidenteEnLaMina"
                                        value={form?.accidenteEnLaMina}
                                        onChange={handleRadioButtonBoolean}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[90px] max-w-[90px]">Accidente fuera de la mina:</span>
                                    <InputsBooleanRadioGroup
                                        name="accidenteFueraDeLaMina"
                                        value={form?.accidenteFueraDeLaMina}
                                        onChange={handleRadioButtonBoolean}
                                    />
                                </div>

                            </div>
                        </div>
                    </section>
                </section>
            </section>
            {/* EN CASO CHOQUE */}

            {/* Médico y Botones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <MedicoSearch
                        value={form.nombre_medico}
                        onChange={handleChangeSimple}
                        MedicosMulti={MedicosMulti}
                    />
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                    {/* Botones de acción */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faSave} /> Grabar/Actualizar
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faTrash} /> Limpiar
                            </button>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPrint} /> Imprimir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}