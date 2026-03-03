import InputsBooleanRadioGroup from "../../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
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