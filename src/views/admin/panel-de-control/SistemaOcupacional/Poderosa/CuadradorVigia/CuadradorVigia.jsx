import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { useForm } from "../../../../../hooks/useForm"
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerCuadradorVigia";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getDatePlus364Days, getToday } from "../../../../../utils/helpers";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "certificado_aptitud_cuadrador"

export default function CuadradorVigia() {
    const today = getToday();
    const nextYearDate = getDatePlus364Days(today);

    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const InitialForm = {
        norden: "",
        nombreExamen: "",
        explotacion: "",
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
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

        // Médico que Certifica //BUSCADOR
        nombre_doctorAsignado: userName,
        user_doctorAsignado: userlogued,
    }

    const {
        form,
        setForm,
        handleChangeNumber,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleChange,
        handleClearnotO,
        handleClear,
        handleRadioButton,
        handlePrintDefault } = useForm(InitialForm, { storageKey: "CuadradorVigiaPoderosa" })

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
            {/* Header */}
            <SectionFieldset legend="Información general" className="grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form?.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />

                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    disabled
                    value={form?.nombreExamen}
                    onChange={handleChange}
                />
                <InputsRadioGroup
                    label="Explotación"
                    name="explotacion"
                    value={form?.explotacion}
                    onChange={handleRadioButton}
                    options={[
                        { label: "Superficie", value: "SUPERFICIE" },
                        { label: "Planta", value: "PLANTA" },
                        { label: "Subsuelo", value: "SUBSUELO" },
                    ]}
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

                    <SectionFieldset legend="Aptitud">
                        <InputsRadioGroup
                            vertical
                            name="apto" value={form?.apto} className="py-2"
                            onChange={handleRadioButton} options={[
                                { label: "APTO", value: "APTO" },
                                { label: "APTO CON RESTRICCION", value: "APTO_CON_RESTRICCION" },
                                { label: "APTO TEMPORAL", value: "APTO_TEMPORAL" },
                                { label: "NO APTO", value: "NO_APTO" },
                            ]}
                        />
                        <div className="w-full flex justify-between items-center pt-4 pb-2 px-2">
                            <InputTextOneLine
                                label="Fecha"
                                name="fechaExamen"
                                type="date"
                                value={form?.fechaExamen}
                                labelWidth="50px"
                                onChange={handleChangeSimple}
                            />
                            <InputTextOneLine
                                label="Fecha Venc"
                                name="fechaHasta"
                                type="date"
                                value={form?.fechaHasta}
                                labelWidth="65px"
                                onChange={handleChangeSimple}
                            />
                        </div>
                    </SectionFieldset>

                    <SectionFieldset legend="Asignación de Médico">
                        {/* <EmpleadoComboBox
                            value={form.nombre_medico}
                            label="Especialista"
                            form={form}
                            onChange={handleChangeSimple}
                        /> */}
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

                <SectionFieldset legend="Observaciones">
                    <InputTextArea
                        value={form?.observaciones}
                        onChange={handleChange}
                        classNameLabel="text-blue-600"
                        rows={14}
                        name="observaciones"
                    />
                </SectionFieldset>
            </div>

            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />

        </div>
    )
}
