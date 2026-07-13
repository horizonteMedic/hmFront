import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getDatePlus364Days, getToday } from "../../../../../utils/helpers";

export default function RegistroAsistencial() {

    const today = getToday();

    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Datos básicos
        numeroDocumento: "",
        NHCL: "",
        tipoExamen: "",

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

        conclusiones: "",
        apto: "APTO",
        fechaValido: today,
        fechaVencimiento: getDatePlus364Days(today),
        recomendaciones: "",
        restricciones: "NINGUNO.",

        // Checkboxes de recomendaciones
        corregirAgudezaVisualTotal: false,
        corregirAgudezaVisual: false,
        dietaHipocalorica: false,
        evitarMovimientosDisergonomicos: false,
        noHacerTrabajoAltoRiesgo: false,
        noHacerTrabajoSobre18: false,
        usoEppAuditivo: false,
        usoLentesConducir: false,
        usoLentesTrabajo: false,
        usoLentesTrabajoSobre18: false,
        ninguno: true,
        noConducirVehiculos: false,

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleRadioButton,
        handleChangeSimple,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "fichaAptitudAnexo2" });



    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };


    return (
        <div className="mx-auto max-w-[90%] lg:max-w-[80%] grid gap-y-3 gap-x-4 py-4">
            <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-y-3 gap-x-4">
               <InputTextOneLine
                    label="Numero de documento"
                    name="numeroDocumento"
                    value={form.numeroDocumento}
                    labelWidth="130px"
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="NHCL"
                    name="NHCL"
                    value={form?.NHCL}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
                <InputsRadioGroup
                    name="tipoDocumento"
                    value={form.tipoDocumento}
                    onChange={handleRadioButton}
                    options={[
                        { label: "D.N.I", value: "dni" },
                        { label: "Pasaporte", value: "pasaporte" },
                        { label: "S/D", value: "SD" },
                    ]}
                /> 
            </SectionFieldset>

            <SectionFieldset legend="Fecha" className="grid xl:grid-cols-3 gap-y-3 gap-x-4">
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    value={form.fecha}
                    type="Date"
                />
                <InputTextOneLine
                    label="Hora"
                    name="hora"
                    value={hora}
                    inputClassName="font-bold"
                    disabled
                />
            </SectionFieldset>

            <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Nombres"
                    name="nombres"
                    value={form.nombres}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Apellidos"
                    name="apellidos"
                    value={form.apellidos}
                    labelWidth="120px"
                />
                <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="Fecha Nacimiento"
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        type="Date"
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Edad (Años)"
                        name="edad"
                        value={form.edad}
                        labelWidth="120px"
                    />
                </div>
                <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="Sexo"
                        name="sexo"
                        value={form.sexo}
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Estado Civil"
                        name="estadoCivil"
                        value={form.estadoCivil}
                        labelWidth="120px"
                    />
                </div>
                <InputTextOneLine
                    label="Nivel Estudios"
                    name="nivelEstudios"
                    value={form.nivelEstudios}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Lugar Nacimiento"
                    name="lugarNacimiento"
                    value={form.lugarNacimiento}
                    labelWidth="120px"
                /> 
                <InputTextOneLine
                    label="Departamento"
                    name="departamento"
                    value={form.departamento}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Provincia"
                    name="provincia"
                    value={form.provincia}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Distrito"
                    name="distrito"
                    value={form.distrito}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Domicilio Actual"
                    name="domicilioActual"
                    value={form.domicilioActual}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Telefono"
                    name="telefono"
                    value={form.telefono}
                    labelWidth="120px"
                />
            </SectionFieldset>

            <SectionFieldset legend="Datos Laborales" className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Ocupación"
                    name="ocupacion"
                    value={form.ocupacion}
                    disabled
                    labelWidth="120px"
                /> 
            </SectionFieldset>
            
             <BotonesAccion form={form}
             />
        </div>
    )
}