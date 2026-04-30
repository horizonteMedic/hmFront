import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup"
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea"
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import { useForm } from "../../../../../hooks/useForm"
import { PrintHojaR, SubmitDataService, VerifyTR } from "./ControllerHojaConsultaExterna"
import { useSessionData } from "../../../../../hooks/useSessionData"
import { getToday } from "../../../../../utils/helpers"
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox"
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales"
import BotonesAccion from "../../../../../components/templates/BotonesAccion"

const tabla = "hoja_consulta_externa"

const HojaConsultaExterna = () => {
    const today = getToday();

    const { token, userlogued, selectedSede, datosFooter, userCompleto, userName, hora } = useSessionData();

    const InitialForm = {
        norden: "",
        nombreExamen: "",
        fechaExamen: today,

        dni: "",
        nombres: "",
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

        cajon: "",
        postaVijus: false,
        cedro: false,
        paraiso: false,
        otros: false,
        contratista: "",
        otrosDescripcion: "",
        observaciones: "",
        observacionesAuto: "",
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    }

    const {
        form,
        setForm,
        handleChangeNumber,
        handleChangeSimple,
        handleClearnotO,
        handleClear,
        handleChange,
        handlePrintDefault,
        handleRadioButton,
        handleChangeNumberDecimals
    } = useForm(InitialForm, { storageKey: "Hoja_Consulta_Externa_form" })

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
            <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
                <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-3">
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

                    <InputTextOneLine
                        label="Hora"
                        name="hora"
                        disabled
                        value={hora}
                    />
                </SectionFieldset>

                {/* Datos del trabajador */}
                <DatosPersonalesLaborales form={form} />

                <SectionFieldset legend="Caja" className="grid grid-cols-1 lg:grid-cols-2">
                    <InputsRadioGroup
                        name="cajon"
                        value={form?.cajon}
                        className="py-2"
                        onChange={handleRadioButton}
                        options={[
                            { label: "POSTA VIJUS", value: "POSTA VIJUS" },
                            { label: "CEDRO", value: "CEDRO" },
                            { label: "PARAISO", value: "PARAISO" },
                            { label: "OTROS", value: "OTROS" }
                        ]}
                    />

                    <InputTextOneLine
                        label="Otros"
                        disabled={form.cajon !== "OTROS"}
                        name="otrosDescripcion"
                        value={form?.otrosDescripcion}
                        onChange={handleChange}
                    />
                </SectionFieldset>

                <SectionFieldset legend="Observaciones">
                    <InputTextArea
                        label="Observaciones"
                        value={form?.observaciones}
                        onChange={handleChangeSimple}
                        onBlur={() => { setForm(prev => ({ ...prev, observaciones: form.observaciones.toUpperCase() })) }}
                        rows={15}
                        name="observaciones"
                    />

                    {form.observacionesAuto != "" && (
                        <InputTextArea
                            label="Observaciones AUTO"
                            value={form?.observacionesAuto}
                            rows={15}
                            name="observacionesAuto"
                            disabled
                        />)}


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
                    handleChangeNumberDecimals={handleChangeNumberDecimals}
                    handleSave={handleSave}
                    handleClear={handleClear}
                    handlePrint={handlePrint}
                />
            </div>
        </>
    )
}

export default HojaConsultaExterna