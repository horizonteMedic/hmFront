import { InputTextOneLine, InputTextArea, SectionFieldset, RadioTable } from "../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerTamizajeDermatologico";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../components/templates/Templates";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "tamizaje_dermatologico";

export default function TamizajeDermatologico() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fecha: today,
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

        afrontamientoTomaDecisiones: "",
        estiloDeConflicto: "",
        afrontamientoSituacionesRiesgo: "",
        nivelAnsiedad: "",

        // Análisis FODA
        fortalezasOportunidades: "",
        amenazasDebilidades: "",

        // Tamizaje Dermatológico
        enfermedadPiel: false,
        enfermedadPielDetalle: "",
        algunaLesion: false,
        algunaLesionLocalizacion: "",
        algunaLesionDesdeCuando: "",
        coloracionPiel: false,
        variasLesiones: false,
        enrojecimiento: false,
        enrojecimientoLocalizacion: "",
        comezon: false,
        comezonLocalizacion: "",
        hinchazon: false,
        hinchazonLocalizacion: "",
        alergiaAsma: false,
        usaEpp: true,
        usaEppProteccion: "",
        cambiosEnUnas: false,
        algunaMedicacion: false,

        // Para el médico
        dermatopatia: false,
        necesitaDermatologo: false,
        interconsultaDermatologia: false,

        // Observaciones y Recomendaciones
        observaciones: "",
        recomendaciones: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "tamizaje_dermatologico" });

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
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-3">
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

            <SectionFieldset legend="Tamizaje">
                <RadioTable
                    items={[
                        {
                            name: "enfermedadPiel",
                            label: "1.- ¿Sufre usted alguna enfermedad de la piel?",
                            extraContent: (form.enfermedadPiel &&
                                <InputTextOneLine
                                    label="¿Qué diagnóstico tiene?"
                                    name="enfermedadPielDetalle"
                                    value={form?.enfermedadPielDetalle}
                                    onChange={handleChange}
                                    disabled={!form.enfermedadPiel}
                                    labelWidth="200px"
                                />
                            )
                        },
                        {
                            name: "algunaLesion",
                            label: "2.- Actualmente, ¿Tiene alguna lesión?",
                            extraContent: (form.algunaLesion &&
                                <div className="grid gap-y-2">
                                    <InputTextOneLine
                                        label="¿Dónde se localiza?"
                                        name="algunaLesionLocalizacion"
                                        value={form?.algunaLesionLocalizacion}
                                        onChange={handleChange}
                                        disabled={!form.algunaLesion}
                                        labelWidth="200px"
                                    />
                                    <InputTextOneLine
                                        label="¿Desde cuándo tiene la lesión?"
                                        name="algunaLesionDesdeCuando"
                                        value={form?.algunaLesionDesdeCuando}
                                        onChange={handleChange}
                                        disabled={!form.algunaLesion}
                                        labelWidth="200px"
                                    />
                                </div>
                            )
                        },
                        { name: "coloracionPiel", label: "3.- ¿Presenta algún cambio de coloración de la piel?" },
                        { name: "variasLesiones", label: "4.- ¿Estas lesiones se repiten varias veces al año?" },
                        {
                            name: "enrojecimiento",
                            label: "5.- ¿Usted tiene enrojecimiento de alguna zona del cuerpo?",
                            extraContent: (form.enrojecimiento &&
                                <InputTextOneLine
                                    label="¿Dónde se localiza?"
                                    name="enrojecimientoLocalizacion"
                                    value={form?.enrojecimientoLocalizacion}
                                    onChange={handleChange}
                                    disabled={!form.enrojecimiento}
                                    labelWidth="200px"
                                />
                            )
                        },
                        {
                            name: "comezon",
                            label: "6.- ¿Tiene comezón?",
                            extraContent: (form.comezon &&
                                <InputTextOneLine
                                    label="¿Dónde se localiza?"
                                    name="comezonLocalizacion"
                                    value={form?.comezonLocalizacion}
                                    onChange={handleChange}
                                    disabled={!form.comezon}
                                    labelWidth="200px"
                                />
                            )
                        },
                        {
                            name: "hinchazon",
                            label: "7.- ¿Presenta hinchazón en parte de su cuerpo?",
                            extraContent: (form.hinchazonLocalizacion &&
                                <InputTextOneLine
                                    label="Si respondió sí, ¿Dónde se localiza?"
                                    name="hinchazonLocalizacion"
                                    value={form?.hinchazonLocalizacion}
                                    onChange={handleChange}
                                    disabled={!form.hinchazon}
                                    labelWidth="200px"
                                />
                            )
                        },
                        { name: "alergiaAsma", label: "8.- ¿Sufre de Rinitis Alérgica o ASMA?" },
                        {
                            name: "usaEpp",
                            label: "9.- ¿Usa EPP?",
                            extraContent: (form.usaEpp &&
                                <InputTextOneLine
                                    label="¿Qué tipo de protección usa?"
                                    name="usaEppProteccion"
                                    value={form?.usaEppProteccion}
                                    onChange={handleChange}
                                    disabled={!form.usaEpp}
                                    labelWidth="200px"
                                />
                            )
                        },
                        { name: "cambiosEnUnas", label: "10.- ¿Presenta cambios en las uñas?" },
                        { name: "algunaMedicacion", label: "11.- ¿Está tomando alguna medicación?" },
                    ]}
                    options={[
                        { value: true, label: "SI" },
                        { value: false, label: "NO" }
                    ]}
                    labelColumns={6}
                    form={form}
                    handleRadioButton={handleRadioButtonBoolean}
                />
            </SectionFieldset>


            <SectionFieldset legend="Comentarios">
                <InputTextArea
                    name="comentarios"
                    value={form?.comentarios}
                    onChange={handleChange}
                    rows={4}
                />
            </SectionFieldset>
            <SectionFieldset legend="Para el Médico">
                <RadioTable
                    items={[
                        { name: "dermatopatia", label: "El paciente, al examen físico, ¿presenta alguna lesión sugerente a Dermatopatía?" },
                        { name: "necesitaDermatologo", label: "El paciente necesita ser evaluado por médico dermatológico para la realización de las siguientes pruebas: De sensibilidad subcutánea, luz de Wood y Maniobra de Nikolsky" },
                        { name: "interconsultaDermatologia", label: "El paciente, ¿Necesita interconsulta con la especialidad de Dermatología?" },
                    ]}
                    options={[
                        { value: true, label: "SI" },
                        { value: false, label: "NO" }
                    ]}
                    labelColumns={6}
                    form={form}
                    handleRadioButton={handleRadioButtonBoolean}
                />
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
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div>
    );
}