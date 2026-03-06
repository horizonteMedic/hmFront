import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../hooks/useForm";
import useRealTime from "../../../../../hooks/useRealTime";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { SubmitDataService, VerifyTR } from "./controllerHojaRutaEmo";

const tabla = "hoja_ruta_emo";
const today = getToday();

const HojaDeRutaEmo = () => {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
    const initialFormState = {
        // Header
        norden: "",
        fechaExamen: today,
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

        //EXAMENES

        usuarioEvaluacionMedica: "",
        observacionesEvaluacionMedica: "",
        //psicologica
        usuarioInformeBrigadista: "",
        observacionInformeBrigadista: "",
        //Visual
        usuarioEvaluacionOftalmologica: "",
        observacionesEvaluacionVisual: "",
        //Audiometria
        usuarioAudiometria: "",
        observacionAudiometria: "",
        //Espirometria
        usuarioEspirometria: "",
        observacionEspirometria: "",
        //Radiografia de torax
        usuarioToraxConvencional: "",
        observacionRadiografiaTorax: "",
        //Cardiologia
        usuarioElectrocardiograma: "",
        observacionesElectrocardiograma: "",
        //Laboratorio
        usuarioExamenLaboratorio: "",
        observacionesExamenLaboratorio: "",
        //Brigadista
        usuarioCertificadoAptitudBrigadista: "",
        observacionBrigadista: "",
        //horas
        observacionesGenerales: "",
        horaEntrada: "",
        horaSalida: useRealTime(),

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
                    name="fechaExamen"
                    type="date"
                    value={form.fechaExamen}
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

                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="PESO"
                        name="peso"
                        type="text"
                        value={form.peso}
                        labelWidth="34px"
                        disabled
                    />
                    <InputTextOneLine
                        label="TALLA"
                        name="talla"
                        type="text"
                        value={form.talla}
                        disabled
                        labelWidth="36px"
                    />
                    <InputTextOneLine
                        label="P/A"
                        name="pa"
                        type="text"
                        value={form.pa}
                        disabled
                        labelWidth="35px"
                    />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="SAT02"
                        name="sat02"
                        type="text"
                        value={form.sat02}
                        disabled
                        labelWidth="38px"
                    />
                    <InputTextOneLine
                        label="CINTURA"
                        name="cintura"
                        type="text"
                        value={form.cintura}
                        disabled
                        labelWidth="55px"
                    />
                    <InputTextOneLine
                        label="CADERA"
                        name="cadera"
                        type="text"
                        value={form.cadera}
                        disabled
                        labelWidth="55px"
                    />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="FC"
                        name="fc"
                        type="text"
                        value={form.fc}
                        disabled
                        labelWidth="34px"
                    />
                    <InputTextOneLine
                        label="FR"
                        name="fr"
                        type="text"
                        value={form.fr}
                        disabled
                        labelWidth="36px"
                    />
                    <InputTextOneLine
                        label="CUELLO"
                        name="cuello"
                        type="text"
                        value={form.cuello}
                        disabled
                        labelWidth="45px"
                    />
                </div>

                {/*MEDICINA */}
                <h1 className="font-bold text-lg text-center">MEDICINA
                    *Evaluación médica
                </h1>

                <InputTextOneLine
                    truelabel={false}
                    value={form.usuarioEvaluacionMedica}
                    form={form}
                    onChange={handleChangeSimple}
                    disabled
                />
                <InputTextOneLine
                    name="observacionesEvaluacionMedica"
                    disabled
                    type="text"
                    value={form.observacionesEvaluacionMedica}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*PSICOLOGICA */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN PSICOLÓGIA
                    <br />
                    *Informe Psicologico Brigadista
                </h1>

                <InputTextOneLine
                    truelabel={false}
                    disabled
                    value={form.usuarioInformeBrigadista}
                    form={form}
                    onChange={handleChangeSimple}
                />
                <InputTextOneLine
                    name="observacionInformeBrigadista"
                    disabled
                    type="text"
                    value={form.observacionInformeBrigadista}
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
                    truelabel={false}
                    disabled
                    value={form.usuarioEvaluacionOftalmologica}
                    form={form}
                    onChange={handleChangeSimple}
                />
                <InputTextOneLine
                    name="observacionesEvaluacionVisual"
                    disabled
                    type="text"
                    value={form.observacionesEvaluacionVisual}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION AUDIOMETRIA */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN AUDIOMETRIA
                    <br />
                    *AUDIOMETRIA
                </h1>

                <InputTextOneLine
                    truelabel={false}
                    value={form.usuarioAudiometria}
                    form={form}
                    onChange={handleChangeSimple}
                    disabled
                />
                <InputTextOneLine
                    name="observacionAudiometria"
                    disabled
                    type="text"
                    value={form.observacionAudiometria}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION ESPIROMETRIA */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN ESPIROMETRIA
                    <br />
                    *Cuestionario de Espirometria
                </h1>

                <InputTextOneLine
                    truelabel={false}
                    value={form.usuarioEspirometria}
                    form={form}
                    onChange={handleChangeSimple}
                    disabled
                />
                <InputTextOneLine
                    name="observacionEspirometria"
                    disabled
                    type="text"
                    value={form.observacionEspirometria}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION RADIOGRAFICA DE TORAX */}
                <h1 className="font-bold text-lg text-center">EVALUACIÓN RADIOGRAFIA DE TORAX
                    <br />
                    *Tórax Convencional *Tórax OIT
                </h1>

                <InputTextOneLine
                    truelabel={false}
                    value={form.usuarioToraxConvencional}
                    form={form}
                    onChange={handleChangeSimple}
                    disabled
                />
                <InputTextOneLine
                    name="observacionRadiografiaTorax"
                    disabled
                    type="text"
                    value={form.observacionRadiografiaTorax}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*EVALUACION CARDIOLOGIA */}
                <h1 className="font-bold text-lg text-center">CARDIOLOGIA
                    <br />
                    *Electrocardiograma
                </h1>

                <InputTextOneLine
                    truelabel={false}
                    disabled
                    value={form.usuarioElectrocardiograma}
                    form={form}
                    onChange={handleChangeSimple}
                />
                <InputTextOneLine
                    name="observacionesElectrocardiograma"
                    disabled
                    type="text"
                    value={form.observacionesElectrocardiograma}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/* LABORATIOR*/}
                <h1 className="font-bold text-lg text-center">EXÁMENES DE LABORATORIO

                </h1>

                <InputTextOneLine
                    truelabel={false}
                    value={form.usuarioExamenLaboratorio}
                    form={form}
                    onChange={handleChangeSimple}
                    disabled
                />
                <InputTextOneLine
                    name="observacionesExamenLaboratorio"
                    type="text"
                    disabled
                    value={form.observacionesExamenLaboratorio}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

                {/*BRIGADISTA */}
                <h1 className="font-bold text-lg text-center">BRIGADISTA
                    <br />
                    *Examen Medico Brigadista *Certificado de Aptitud Brigadista *Hoja de Consulta Externa - Brl
                </h1>

                <InputTextOneLine
                    className="flex justify-center items-center"
                    truelabel={false}
                    disabled
                    value={form.usuarioCertificadoAptitudBrigadista}
                    form={form}
                    onChange={handleChangeSimple}
                />
                <InputTextOneLine
                    name="observacionBrigadista"
                    type="text"
                    disabled
                    value={form.observacionBrigadista}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

            </SectionFieldset>

            <SectionFieldset legend="Conclusiones" className="gap-x-4 gap-y-3">
                <InputTextArea
                    label="Conclusiones"
                    name="observacionesGenerales"
                    type="text"
                    rows={3}
                    value={form.observacionesGenerales}
                    onChange={handleChange}
                    labelWidth="120px"
                />
                <div className="w-full flex justify-between">
                    {form.horaEntrada && <div className="flex gap-2 items-center justify-center">
                        <label htmlFor="">HORA ENTRADA:</label>
                        <h1 className="text-lg font-bold">{form.horaEntrada}</h1>
                    </div>}
                    <div className="flex gap-2 items-center justify-center">
                        <label htmlFor="">HORA SALIDA:</label>
                        <h1 className="text-lg font-bold">{form.horaSalida}</h1>
                    </div>
                </div>
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