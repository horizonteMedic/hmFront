import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerAptitudBrigadista";

const tabla = "certificado_aptitud_brigadista";
const today = getToday();

const CertificadoAptitudBrigadista = () => {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
    const initialFormState = {
        // Header
        norden: "",
        fechaExam: today,
        tipoExamen: "",
        // Datos personales
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
        aptitud: "",
        conclusiones: "",
        restricciones: "",
        recomendaciones: "",
        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleRadioButtonBoolean,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "CertificadoAptitudBrigadista" });

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
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
            {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
            <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha de Ingreso"
                    name="fechaExam"
                    type="date"
                    value={form.fechaExam}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            <div className="flex gap-3 items-start w-full ">
                <div className="w-[40%]">
                    <SectionFieldset legend="Aptitud" className="w-full">
                        <InputsRadioGroup
                            vertical
                            name="aptitud" value={form?.aptitud} className="py-2"
                            onChange={handleRadioButton} options={[
                                { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" }
                            ]}
                        />

                    </SectionFieldset>
                    <SectionFieldset legend="Asignación de Médico" className="w-full">
                        <EmpleadoComboBox
                            value={form.nombre_medico}
                            label="Especialista"
                            form={form}
                            onChange={handleChangeSimple}
                        />
                    </SectionFieldset>
                </div>

                <div className="w-[60%]  ">
                    <SectionFieldset legend="Conclusiones y Observaciones" className="w-full space-y-3">
                        <InputTextArea
                            label="Conclusiones"
                            name="conclusiones"
                            onChange={handleChange}
                            value={form.conclusiones}
                            rows={3}
                            labelWidth="120px"
                        />
                        <InputTextArea
                            label="Restricciones"
                            name="restricciones"
                            onChange={handleChange}
                            rows={3}
                            value={form.restricciones}
                            labelWidth="120px"
                        />
                        <InputTextArea
                            label="Recomendaciones"
                            name="recomendaciones"
                            onChange={handleChange}
                            rows={3}
                            value={form.recomendaciones}
                            labelWidth="120px"
                        />
                    </SectionFieldset>

                </div>
            </div>
            {/* BOTONES DE ACCIÓN */}
            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
            />
        </div>
    )
}

export default CertificadoAptitudBrigadista