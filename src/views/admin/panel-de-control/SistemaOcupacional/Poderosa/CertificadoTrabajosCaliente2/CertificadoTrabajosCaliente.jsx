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
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";

const today = getToday();
const fecha = new Date(today);
fecha.setFullYear(fecha.getFullYear() + 1);

const nextYearDate = fecha.toISOString().split("T")[0];

const tabla = "aptitud_trabajos_encaliente"

export default function CertificadoTrabajosCaliente() {

    const { token, userlogued, selectedSede, datosFooter, userCompleto, userName, hora } =
        useSessionData();

    const InitialForm = {
        norden: "",
        nombreExamen: "",
        nombres: "",
        edad: "",
        sexo: "",
        dni: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        estadoCivil: "",
        nivelEstudios: "",

        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        apto: "",
        fechaExamen: today,
        fechaHasta: nextYearDate,
        observaciones: "",
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
        userlogued: userlogued,

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

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
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            {/*Header*/}
            <SectionFieldset legend="Información general" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form?.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    disabled
                    value={form?.nombreExamen}
                />
                <InputTextOneLine
                    label="Hora"
                    value={hora}
                    disabled
                    className="font-bold"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-3"> 
                    <SectionFieldset legend="Aptitudes" className="grid grid-cols-1 gap-x-4 gap-y-3">
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
                    </SectionFieldset>

                    <SectionFieldset legend="Asignación de Médico">
                        <EmpleadoComboBox
                            value={form.nombre_medico}
                            label="Especialista"
                            form={form}
                            onChange={handleChangeSimple}
                        />
                    </SectionFieldset>
                </div>

                <SectionFieldset legend="Observaciones" className="grid grid-cols-1 gap-x-4 gap-y-3">
                    <InputTextArea
                        value={form?.observaciones}
                        onChange={handleChange}
                        classNameLabel="text-blue-600"
                        rows={20}
                        name="observaciones"
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
            </div>
        </div>
    )
}
