import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons"
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup"
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea"
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import { useForm } from "../../../../../hooks/useForm"
import useRealTime from "../../../../../hooks/useRealTime"
import { PrintHojaR, SubmitDataService, VerifyTR } from "./ControllerHojaConsultaExterna"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSessionData } from "../../../../../hooks/useSessionData"
import { getToday } from "../../../../../utils/helpers"

const tabla = "hoja_consulta_externa"
const today = getToday();


const HojaConsultaExterna = () => {
    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();

    const InitialForm = {
        norden: "",
        nombreExamen: "",
        fechaExamen: today,
        nombres: "",
        dniPaciente: "",
        edadPaciente: "",
        sexo: "",
        empresa: "",
        cajon: "",
        postaVijus: false,
        cedro: false,
        paraiso: false,
        otros: false,
        contratista: "",
        otrosDescripcion: "",
        observaciones: "",
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
    }

    const { form, setForm, handleChangeNumber, handleChangeSimple, handleClearnotO, handleClear, handleChange, handlePrintDefault, handleRadioButton } = useForm(InitialForm, { storageKey: "Hoja_Consulta_Externa_form" })

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
                                <InputTextOneLine
                                    label="Fecha de Examen"
                                    name="fechaExamen"
                                    type="date"
                                    value={form?.fechaExamen}
                                    labelWidth="100px"
                                    onChange={handleChangeSimple}
                                />
                                <div className="flex justify-end mt-3">
                                    <h1 className="text-lg font-bold">{useRealTime()}</h1>
                                </div>

                            </section>

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
                                    <InputsRadioGroup
                                        name="cajon" value={form?.cajon} className="py-2"
                                        onChange={handleRadioButton} options={[
                                            { label: "POSTA VIJUS", value: "POSTA VIJUS" },
                                            { label: "CEDRO", value: "CEDRO" },
                                            { label: "PARAISO", value: "PARAISO" },
                                            { label: "OTROS", value: "OTROS" }
                                        ]}
                                    />

                                </div>

                                {/* Fila 3: Puesto y Ocupación */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <InputTextOneLine
                                        label="Contratista"
                                        disabled
                                        name="contratista"
                                        value={form?.contrata}
                                        onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                        label=""
                                        disabled={form.cajon !== "OTROS"}
                                        name="otrosDescripcion"
                                        value={form?.otrosDescripcion}
                                        onChange={handleChange}
                                    />

                                </div>
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
                            <section className=" rounded-lg p-4 mt-0 m-4">
                                <InputTextArea
                                    label="Observaciones"
                                    value={form?.observaciones}
                                    onChange={handleChangeSimple}
                                    classNameLabel="text-blue-600"
                                    rows={15}
                                    name="observaciones"
                                />
                            </section>
                            <div className="w-auto flex flex-col justify-center items-center gap-1 p-4 pt-0 m-4 mt-0">
                                <InputTextOneLine
                                    label="Medico que Certifica"
                                    name="nombre_medico"
                                    disabled
                                    className=" w-[400px]"
                                    value={form?.nombre_medico}
                                    onChange={handleChange}
                                />
                                <div className="flex gap-1 items-center">
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
                                    <span className="font-bold italic text-center text-base  mx-4">IMPRIMIR</span>
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
                                <div className="flex gap-1 items-center">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default HojaConsultaExterna