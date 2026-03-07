import InputsBooleanRadioGroup from "../../../../../components/reusableComponents/InputsBooleanRadioGroup";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import RadioTable from "../../../../../components/reusableComponents/RadioTable";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import BotonesAccion from "../../../../../components/templates/BotonesAccion"
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerDireccionGeneralMineria";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";

const tabla = "ministerio_energia_minas";
const today = getToday();

const DirecionGeneralMineria = () => {

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

        //EXAMEN MEDICO
        fechaNacimientoPaciente: "",
        peso: "",
        talla: "",
        colorPiel: "",
        colorOjos: "",
        cabello: "",

        //FACTORES HEREDITARIOS
        //1
        asma: false,
        alergias: false,
        bronquitis: false,
        pleuresia: false,
        neumonia: false,
        respiracion: false,
        sangreSaliva: false,
        respiracionBreve: false,
        problemasNasales: false,
        tbc: false,
        fuma: false,
        //2
        palpitaciones: false,
        ritmoCardiacoIrregular: false,
        fallasCardiacas: false,
        desmayos: false,
        tobillosHinchados: false,
        moretonesAnormales: false,
        presionAlta: false,
        heridasPecho: false,
        otrasEnfermedades: false,
        tomaMedicina: false,

        //DETALLES
        //EXAMNE MEDICO
        pulsoReposo: "",
        pulsoReposoBp: "",
        pulso30flexiones: "",
        respiracionReposo: "",
        respiracion30flexiones: "",
        obstruccionNasal: "",
        formaPecho: "",
        expansionPecho: "",
        pulmones: "",
        corazon: "",
        enfermedadesCronicas: "",
        funcionPulmonar: "",
        fvc: "",
        fevl: "",
        otros: "",
        enForma: "",

        //RAYOS X
        fechaPlaca: "",
        pechoNormal: "",
        tbcRayosX: "",
        pneumoconiosis: "",
        clasificacionOit: "",
        filmNumeroPlaca: "",
        corazonRayosX: "",
        otrosCambios: "",
        examenSaliva: "",
        //OPINOINES
        hallazgosAnormales: "",
        opinionClinica: "",

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
    } = useForm(initialFormState, { storageKey: "DireccionGeneralMineria" });

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

            {/* ===== SECCIÓN: EXAMEN MEDICOS =====*/}
            <SectionFieldset legend="EXÁMEN MEDICO (Debe ser llenado por el médico que hace la evaluación fisica)" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Fecha de Nacimiento"
                    name="fechaNacimientoPaciente"
                    type="text"
                    value={form.fechaNacimientoPaciente}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Peso"
                    name="peso"
                    value={form.peso}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Talla"
                    name="talla"
                    value={form.talla}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Color de Piel"
                    name="colorPiel"
                    value={form.colorPiel}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Color de Ojos"
                    name="colorOjos"
                    value={form.colorOjos}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Cabello"
                    name="cabello"
                    value={form.cabello}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />

            </SectionFieldset>

            <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                <SectionFieldset legend="FACTORES HEREDITARIOS">

                    <RadioTable
                        items={[
                            { name: "asma", label: "1.- Asma" },
                            { name: "alergias", label: "2.- Alergias" },
                            { name: "bronquitis", label: "3.- Bronquitis" },
                            { name: "pleuresia", label: "4.- Pleuresia" },
                            { name: "neumonia", label: "5.- Neumonia" },
                            { name: "respiracion", label: "6.- Respiracion" },
                            { name: "sangreSaliva", label: "7.- Sangre en la Saliva" },
                            { name: "respiracionBreve", label: "8.- Respiracion Breve" },
                            { name: "problemasNasales", label: "9.- Problemas Nasales" },
                            { name: "tbc", label: "10.- T.B.C." },
                            { name: "fuma", label: "Fuma" },
                        ]}
                        options={[
                            { label: "SI", value: true },
                            { label: "NO", value: false },
                        ]}
                        form={form}
                        groupLabel="T.B.C."
                        handleRadioButton={handleRadioButtonBoolean}
                    />
                </SectionFieldset>
                <SectionFieldset legend="CANCER PULMONAR">
                    <RadioTable
                        items={[
                            { name: "palpitaciones", label: "11.- Palpitaciones" },
                            { name: "ritmoCardiacoIrregular", label: "12.- Ritmo Cardiaco Irregular" },
                            { name: "fallasCardiacas", label: "13.- Fallas Cardiacas" },
                            { name: "desmayos", label: "14.- Desmayos" },
                            { name: "tobillosHinchados", label: "15.- Tobillos Hinchados" },
                            { name: "moretonesAnormales", label: "16.- Moretones Anormales" },
                            { name: "presionAlta", label: "17.- Presion Alta" },
                            { name: "heridasPecho", label: "18.- Heridas del Pecho" },
                            { name: "otrasEnfermedades", label: "19.- Otras Enfermedades" },
                            { name: "tomaMedicina", label: "Toma alguna medicina" },
                        ]}
                        options={[
                            { label: "SI", value: true },
                            { label: "NO", value: false },
                        ]}
                        form={form}
                        groupLabel="CANCER PULMONAR"
                        handleRadioButton={handleRadioButtonBoolean}
                    />
                </SectionFieldset>
            </div>


            {/* ===== SECCIÓN: DETALLES =====*/}
            <SectionFieldset legend="DETALLES" className="grid grid-cols-1  gap-x-4 gap-y-3">
                <SectionFieldset legend="Examen Medico" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Fecha"
                            name="fechaExamen"
                            type="text"
                            value={form.fechaExamen}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Pulso en Reposo"
                            name="pulsoReposo"
                            value={form.pulsoReposo}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="B.P."
                            name="pulsoReposoBp"
                            value={form.pulsoReposoBp}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Despues de 30 flexiones en 60 seg"
                            name="pulso30flexiones"
                            value={form.pulso30flexiones}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Respiracion en reposo"
                            name="respiracionReposo"
                            value={form.respiracionReposo}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Despues de 30 flexiones en 60 seg"
                            name="respiracion30flexiones"
                            value={form.respiracion30flexiones}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputsBooleanRadioGroup
                            label="Obstruccion Nasal"
                            name="obstruccionNasal"
                            labelWidth="120px"
                            value={form?.obstruccionNasal}
                            onChange={handleRadioButtonBoolean}
                            trueLabel="Si"
                            falseLabel="No"
                        />
                        <InputTextOneLine
                            label="Forma del pecho"
                            name="formaPecho"
                            value={form.formaPecho}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Expansión del pecho Normal"
                            name="expansionPecho"
                            value={form.expansionPecho}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />

                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Pulmones"
                            name="pulmones"
                            type="text"
                            value={form.pulmones}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Corazon"
                            name="corazon"
                            value={form.corazon}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Enfermedades Cronicas"
                            name="enfermedadesCronicas"
                            value={form.enfermedadesCronicas}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">
                            <InputTextOneLine
                                label="Funcion Pulmonar"
                                name="funcionPulmonar"
                                value={form.funcionPulmonar}
                                disabled
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="FVC"
                                name="fvc"
                                value={form.fvc}
                                disabled
                                labelWidth="120px"
                            />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">

                            <InputTextOneLine
                                label="FEVL"
                                name="fevl"
                                value={form.fevl}
                                disabled
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Otros"
                                name="otros"
                                value={form.otros}
                                disabled
                                labelWidth="120px"
                            />
                        </div>
                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">
                            <InputsBooleanRadioGroup
                                label="En Forma"
                                name="enForma"
                                labelWidth="120px"
                                value={form?.enForma}
                                onChange={handleRadioButtonBoolean}
                                trueLabel="Si"
                                falseLabel="No"
                            />
                        </div>

                    </div>
                </SectionFieldset>

                <SectionFieldset legend="Rayos X" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Fecha"
                            name="fechaPlaca"
                            type="text"
                            value={form.fechaPlaca}
                            disabled
                            labelWidth="120px"
                        />

                        <InputTextOneLine
                            label="Pecho Normal"
                            name="pechoNormal"
                            value={form.pechoNormal}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="T.B.C."
                            name="tbcRayosX"
                            value={form.tbcRayosX}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Pneumoconiosis"
                            name="pneumoconiosis"
                            value={form.pneumoconiosis}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Clasificacion de la OIT (1980)"
                            name="clasificacionOit"
                            value={form.clasificacionOit}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />

                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Fllm N° de la placa"
                            name="filmNumeroPlaca"
                            value={form.filmNumeroPlaca}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Corazon"
                            name="corazonRayosX"
                            type="text"
                            value={form.corazonRayosX}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Otros Cambios"
                            name="otrosCambios"
                            value={form.otrosCambios}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Examen de Saliva"
                            name="examenSaliva"
                            disabled
                            value={form.examenSaliva}
                            labelWidth="120px"
                        />
                    </div>
                </SectionFieldset>
            </SectionFieldset>

            <SectionFieldset legend="Opinioes" className="grid grid-cols-1  gap-x-4 gap-y-3">
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="Pecho Normal"
                        name="pechoNormal"
                        value={form.pechoNormal}
                        labelWidth="120px"
                        disabled
                    />
                    <InputTextOneLine
                        label="Hallazgos Anormales"
                        name="hallazgosAnormales"
                        value={form.hallazgosAnormales}
                        labelWidth="120px"
                        onChange={handleChangeSimple}
                    />
                    <InputTextOneLine
                        label="Clasificacion de la OIT (1980)"
                        name="clasificacionOit"
                        onChange={handleChangeSimple}
                        value={form.clasificacionOit}
                        labelWidth="120px"
                    />
                </div>

                <InputTextArea
                    label="OPINION CLINICA (solo si difiere del examen medico)"
                    name="opinionClinica"
                    rows={2}
                    onChange={handleChangeSimple}
                    value={form.opinionClinica}
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

export default DirecionGeneralMineria