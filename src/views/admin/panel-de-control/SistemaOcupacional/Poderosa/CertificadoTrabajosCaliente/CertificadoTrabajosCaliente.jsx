import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import { useForm } from "../../../../../hooks/useForm"
import { getToday } from "../../../../../utils/helpers";
import useRealTime from "../../../../../hooks/useRealTime";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./ControllerCertCaliente";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSessionData } from "../../../../../hooks/useSessionData";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";

const today = getToday();
const fecha = new Date(today);
fecha.setFullYear(fecha.getFullYear() + 1);

const nextYearDate = fecha.toISOString().split("T")[0];

const tabla = "aptitud_trabajos_encaliente"
const CertificadoTrabajosCaliente = () => {
    const { token, userlogued, selectedSede, datosFooter, userCompleto, userName } =
        useSessionData();

    const InitialForm = {
        norden: "",
        nombreExamen: "",
        nombres: "",
        dniPaciente: "",
        edadPaciente: "",
        sexo: "",
        empresa: "",
        apto: "",
        fechaExamen: today,
        fechaHasta: nextYearDate,
        observaciones: "",
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
        userlogued: userlogued,

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    }

    const { form, setForm, handleChangeNumber, handleChange, handleChangeSimple, handleClearnotO, handleClear, handleRadioButton, handlePrintDefault } = useForm(InitialForm, { storageKey: "Certificado_Trabajos_Hot_form" })

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
        console.log("Guardando datos:", form);
    };

    return (
        <>
            <div className="mx-auto bg-white overflow-hidden">
                {/* Header */}
                <h1 className="text-blue-600 font-semibold p-4 pb-0 mb-0 m-4">Aptitud</h1>
                <div className="flex h-full">
                    {/* Contenido principal - 80% */}
                    <div className="w-full">
                        <div className="w-full">
                            {/* Datos del trabajador */}
                            <section className="bg-white border border-gray-200 rounded-lg p-4  mt-0 m-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <InputTextOneLine
                                    label="N° Orden"
                                    name="norden"
                                    labelWidth="60px"
                                    value={form?.norden}
                                    onChange={handleChangeNumber}
                                    onKeyUp={handleSearch}
                                />
                                <InputTextOneLine
                                    label="Tipo de Examen"
                                    name="nombreExamen"
                                    disabled
                                    value={form?.nombreExamen}
                                    labelWidth="100px"
                                    onChange={handleChange}
                                />
                                <div className="flex justify-end mt-3">
                                    <h1 className="text-lg font-bold">{useRealTime()}</h1>
                                </div>

                            </section>

                            <h1 className="text-blue-600 font-semibold p-4 pb-0 mb-0 m-4">Certifica que el Sr.</h1>
                            <section className="bg-white border border-gray-200 rounded-lg p-4 mt-0 m-4">
                                {/* Fila 1: Datos personales */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <InputTextOneLine
                                        label="Nombres y Apellidos"
                                        name="nombres"
                                        disabled
                                        value={form?.nombres}
                                        onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                        label="DNI"
                                        disabled
                                        labelWidth="50px"
                                        name="dniPaciente"
                                        value={form?.dniPaciente}
                                        onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                        label="Edad"
                                        disabled
                                        labelWidth="50px"
                                        name="edadPaciente"
                                        value={form?.edadPaciente}
                                        onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                        label="Género"
                                        disabled
                                        labelWidth="60px"
                                        name="sexo"
                                        value={form?.sexo}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Fila 2: Empresa y Contratista */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <InputTextOneLine
                                        label="Empresa"
                                        name="empresa"
                                        disabled
                                        value={form?.empresa}
                                        onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                        label="Contratista"
                                        disabled
                                        name="contratista"
                                        value={form?.contrata}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Fila 3: Puesto y Ocupación */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <InputTextOneLine
                                        label="Puesto al que Postula"
                                        name="cargoPaciente"
                                        disabled
                                        value={form?.cargoPaciente}
                                        onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                        label="Ocupación Actual o Última Ocupación"
                                        name="ocupacionPaciente"
                                        disabled
                                        value={form?.ocupacionPaciente}
                                        onChange={handleChange}
                                    />
                                </div>
                            </section>
                            <div className="flex w-full">
                                <div className="w-1/2">
                                    <section className="bg-white border border-gray-200 rounded-lg p-4 gap-4 mt-0 m-4">
                                        <InputsRadioGroup
                                            vertical
                                            name="apto" value={form?.apto} className="py-2"
                                            onChange={handleRadioButton} options={[
                                                { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                                { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" }
                                            ]}
                                        />

                                        <div className="w-full flex justify-between items-center pt-4 pb-2 px-2">
                                            <InputTextOneLine
                                                label="Fecha"
                                                name="fechaExamen"
                                                type="date"
                                                value={form?.fechaExamen}
                                                labelWidth="50px"
                                                onChange={handleChange}
                                            />
                                            <InputTextOneLine
                                                label="Fecha Venc"
                                                name="fechaHasta"
                                                type="date"
                                                value={form?.fechaHasta}
                                                labelWidth="65px"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <SectionFieldset legend="Asignación de Médico">
                                            <EmpleadoComboBox
                                                value={form.nombre_medico}
                                                label="Especialista"
                                                form={form}
                                                onChange={handleChangeSimple}
                                            />
                                        </SectionFieldset>
                                        <div className="w-full flex justify-between items-center gap-1 mt-4">
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={handleSave}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                                >
                                                    <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleClear}
                                                    className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                                >
                                                    <FontAwesomeIcon icon={faBroom} /> Limpiar
                                                </button>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <span className="font-bold italic text-base mb-1 mx-4">Imprimir</span>
                                                <input
                                                    name="norden"
                                                    value={form?.norden}
                                                    onChange={handleChangeNumber}
                                                    className="border rounded px-2 py-1 text-base w-24"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={handlePrint}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                                                >
                                                    <FontAwesomeIcon icon={faPrint} />
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                </div>
                                <div className="w-1/2 h-auto">
                                    <InputTextArea
                                        label="Observaciones"
                                        value={form?.observaciones}
                                        onChange={handleChange}
                                        classNameLabel="text-blue-600"
                                        rows={20}
                                        name="observaciones"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default CertificadoTrabajosCaliente