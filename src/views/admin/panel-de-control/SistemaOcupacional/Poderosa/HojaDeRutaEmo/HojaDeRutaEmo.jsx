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

const tabla = "certificado_aptitud_brigadista";
const today = getToday();

const HojaDeRutaEmo = () => {
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

        nombre_doctorAsignado: "",
        user_doctorAsignado: "",

        nombre_doctorExtra: "",
        user_doctorExtra: "",
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
        //SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            //VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            //PrintHojaR(form.norden, token, tabla, datosFooter);
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

            <SectionFieldset legend="EXAMENES" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <label className="text-center text-lg" htmlFor="">EXÁMENES</label>
                <label className="text-center text-lg" htmlFor="">PRUEBAS REALIZADAS POR</label>
                <label className="text-center text-lg" htmlFor="">OBSERVACIONES</label>
                <h1 className="font-bold text-lg text-center">TRIAJE</h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="PESO"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="34px"
                    />
                    <InputTextOneLine
                        label="TALLA"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="36px"
                    />
                    <InputTextOneLine
                        label="P/A"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="35px"
                    />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="SAT02"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="38px"
                    />
                    <InputTextOneLine
                        label="CINTURA"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="55px"
                    />
                    <InputTextOneLine
                        label="CADERA"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="55px"
                    />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="FC"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="34px"
                    />
                    <InputTextOneLine
                        label="FR"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="36px"
                    />
                    <InputTextOneLine
                        label="CUELLO"
                        name="fechaExam"
                        type="text"
                        value={form.triaje2}
                        onChange={handleChangeSimple}
                        labelWidth="45px"
                    />
                </div>

                {/*MEDICINA */}
                <h1 className="font-bold text-lg text-center">MEDICINA
                    *Evaluación médica
                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*PSICOLOGICA */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN PSICOLÓGIA
                    <br />
                    *Informe Psicologico Brigadista
                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION VISUAL */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN VISUAL
                    <br />
                    *Evaluación Oftalmológica
                    *Agudeza visual
                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION AUDIOMETRIA */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN AUDIOMETRIA
                    <br />
                    *AUDIOMETRIA
                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION ESPIROMETRIA */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN ESPIROMETRIA
                    <br />
                    *Cuestionario de Espirometria
                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION RADIOGRAFICA DE TORAX */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN RADIOGRAFIA DE TORAX
                    <br />
                    *Tórax Convencional *Tórax OIT
                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION CARDIOLOGIA */}
                <h1 className="font-bold text-lg text-center">CARDIOLOGIA
                    <br />
                    *Electrocardiograma
                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/* */}
                <h1 className="font-bold text-lg text-center">EXÁMENES DE LABORATORIO

                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*BRIGADISTA */}
                <h1 className="font-bold text-lg text-center">BRIGADISTA
                    <br />
                    *Examen Medico Brigadista *Certificado de Aptitud Brigadista *Hoja de Consulta Externa - Brl
                </h1>

                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    name="fechaExam"
                    type="text"
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

            </SectionFieldset>

            <SectionFieldset legend="Conclusiones">
                <InputTextArea
                    label="Conclusiones"
                    name="fechaExam"
                    type="text"
                    rows={3}
                    value={form.triaje2}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico" className="w-full">
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

export default HojaDeRutaEmo