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

const tabla = "ficha_datos_pacientes";
const today = getToday();

const DirecionGeneralMineria = () => {

    const { token, userlogued, selectedSede, datosFooter } = useSessionData();
    const initialFormState = {
        norden: "",
        id: null,
        fechaIngreso: today,
        tipoTrabajador: "",

        empresa: "",
        cargo: "",

        nombres: "",
        apellidos: "",
        fechaNacimiento: "",

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
        //SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        //if (e.key === "Enter") {
        //  handleClearnotO();
        //VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        //}
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
                    name="fechaIngreso"
                    type="date"
                    value={form.fechaIngreso}
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
                    name="fechaNacimiento"
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={handleChangeSimple}
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
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Color de Ojos"
                    name="colorOjos"
                    value={form.colorOjos}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Cabello"
                    name="cabello"
                    value={form.cabello}
                    disabled
                    labelWidth="120px"
                />

            </SectionFieldset>

            <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                <SectionFieldset legend="FACTORES HEREDITARIOS">

                    <RadioTable
                        items={[
                            { name: "condPalpitaciones", label: "1.- Asma" },
                            { name: "condConvulsiones", label: "2.- Alergias" },
                            { name: "condDiabetes", label: "3.- Bronquitis" },
                            { name: "condReaccionesAlergicasRespiracion", label: "4.- Pleuresia" },
                            { name: "condClaustrofobia", label: "5.- Neumonia" },
                            { name: "condClaustrofobia", label: "6.- Respiracion" },
                            { name: "condClaustrofobia", label: "7.- Sangre en la Saliva" },
                            { name: "condClaustrofobia", label: "8.- Respiracion Breve" },
                            { name: "condClaustrofobia", label: "9.- Problemas Nasales" },
                            { name: "condClaustrofobia", label: "10.- T.B.C." },
                            { name: "condClaustrofobia", label: "Fuma" },
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
                            { name: "condClaustrofobia", label: "11.- Palpitaciones" },
                            { name: "condClaustrofobia", label: "12.- Ritmo Cardiaco Irregular" },
                            { name: "condClaustrofobia", label: "13.- Fallas Cardiacas" },
                            { name: "condClaustrofobia", label: "14.- Desmayos" },
                            { name: "condClaustrofobia", label: "15.- Tobillos Hinchados" },
                            { name: "condClaustrofobia", label: "16.- Moretones Anormales" },
                            { name: "condClaustrofobia", label: "17.- Presion Alta" },
                            { name: "condClaustrofobia", label: "18.- Heridas del Pecho" },
                            { name: "condClaustrofobia", label: "19.- Otras Enfermedades" },
                            { name: "condClaustrofobia", label: "Toma alguna medicina" },
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
                            name="fechaNacimiento"
                            type="date"
                            value={form.fechaNacimiento}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Pulso en Reposo"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="B.P."
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Despues de 30 flexiones en 60 seg"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Respiracion en reposo"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputsBooleanRadioGroup
                            label="Obstruccion Nasal"
                            name="apto"
                            labelWidth="120px"
                            value={form?.apto}
                            onChange={handleRadioButtonBoolean}
                            trueLabel="Si"
                            falseLabel="No"
                        />
                        <InputTextOneLine
                            label="Forma del pecho"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Expansión del pecho Normal"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />

                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Pulmones"
                            name="fechaNacimiento"
                            type="text"
                            value={form.fechaNacimiento}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Corazon"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Enfermedades Cronicas"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">
                            <InputTextOneLine
                                label="Funcion Pulmonar"
                                name="cabello"
                                value={form.cabello}
                                disabled
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="FVC"
                                name="cabello"
                                value={form.cabello}
                                disabled
                                labelWidth="120px"
                            />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">

                            <InputTextOneLine
                                label="FEVL"
                                name="cabello"
                                value={form.cabello}
                                disabled
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Otros"
                                name="cabello"
                                value={form.cabello}
                                disabled
                                labelWidth="120px"
                            />
                        </div>
                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">
                            <InputTextOneLine
                                label="En Forma"
                                name="cabello"
                                value={form.cabello}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Fuera de Forma"
                                name="cabello"
                                value={form.cabello}
                                labelWidth="120px"
                            />
                        </div>

                    </div>
                </SectionFieldset>

                <SectionFieldset legend="Rayos X" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Fecha"
                            name="fechaNacimiento"
                            type="date"
                            value={form.fechaNacimiento}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />

                        <InputTextOneLine
                            label="Pecho Normal"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="T.B.C."
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Pneumoconiosis"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Clasificacion de la OIT (1980)"
                            name="cabello"
                            value={form.cabello}
                            disabled
                            labelWidth="120px"
                        />

                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Fllm N° de la placa"
                            name="cabello"
                            value={form.cabello}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Corazon"
                            name="fechaNacimiento"
                            type="text"
                            value={form.fechaNacimiento}
                            onChange={handleChangeSimple}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Otros Cambios"
                            name="cabello"
                            value={form.cabello}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Examen de Saliva"
                            name="cabello"
                            value={form.cabello}
                            labelWidth="120px"
                        />
                    </div>
                </SectionFieldset>
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