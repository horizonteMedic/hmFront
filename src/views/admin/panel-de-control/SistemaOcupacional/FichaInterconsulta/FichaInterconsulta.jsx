import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import useRealTime from "../../../../hooks/useRealTime";
import { useForm } from "../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaInterconsulta";
import { useSessionData } from "../../../../hooks/useSessionData";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import { getToday } from "../../../../utils/helpers";
import Swal from "sweetalert2";

const tabla = "ficha_interconsulta"
const today = getToday();


export default function FichaInterconsulta() {

    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();
    
    const Initialform = {
        norden: "",
        fechaExamen: today,
        especialidad: "",
        cargoPaciente: "",
        //Datos Usuario
        dniPaciente: "",
        dniUser: userCompleto?.datos?.dni_user,
        nombres: "",
        sexo: "",
        fechaNacimientoPaciente: "",
        edadPaciente: "",
        //Funciones Vitales
        frecuenciaCardiaca: "",
        PA: "",
        frecuenciaRespiratoriaTriaje: "",
        imcTriaje: "",
        saturacionOxigenoTriaje: "",
        temperatura: "",
        peso: "",
        tallaTriaje: "",

        contrata: "",
        empresa: "",
        //Medico
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
        cmpUsuario: "",
        direccionClinica: "",
        //Cuadros
        motivo: "",
        hallazgo: "",
        diagnostico: "",
        tratamiento: "",
        apto: false
    }

    const { form, setForm, handleChangeSimple, handleChange, handleClear, handleClearnotO, handleChangeNumber, handleRadioButtonBoolean, handleRadioButton, handlePrintDefault } = useForm(Initialform, { storageKey: "ficha_interconsultas_form" })

    

    const handleClearnotOandEspecialidad = () => {
        setForm((prev) => ({ ...Initialform, norden: prev.norden, especialidad: prev.especialidad }));
        if (typeof window !== "undefined" && "ficha_interconsultas_form") {
        try {
            localStorage.setItem("ficha_interconsultas_form", JSON.stringify({ ...Initialform, norden: form.norden, especialidad: form.especialidad }));
        } catch (err) {
            console.warn("useForm: error guardando localStorage en clearnotO", err);
        }
        }
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotOandEspecialidad();
            VerifyTR(form.norden, form.especialidad, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        if (!form.especialidad) {
            Swal.fire("Error","Debe seleccionar una especialidad",'error')
            return
        }
        handlePrintDefault(() => {
            PrintHojaR(form.norden, form.especialidad, token, tabla, datosFooter);
        });
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
        console.log("Guardando datos:", form);
    };
    
    return (
        <>
            <div className="space-y-6 max-w-[95%] mx-auto">
                {/* Header */}
                <section className="bg-white border border-gray-200 rounded-lg p-4 w-full">
                    {/* Fila de inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        <InputTextOneLine label="N° Orden" value={form.norden} name="norden" onKeyUp={handleSearch} onChange={handleChangeNumber}  />
                        <InputTextOneLine label="Fecha de Examen" value={form.fechaExamen} onChange={handleChangeSimple} type="date" name="fechaExamen" />
                        <InputTextOneLine label="Especialidad" value={form.especialidad} onChange={handleChange} name="especialidad" />
                        <InputTextOneLine label="Puesto de Trabajo" value={form.cargoPaciente} disabled onChange={handleChange} name="cargoPaciente" />
                    </div>

                    {/* Hora en tiempo real */}
                    <div className="flex justify-end mt-3">
                        <h1 className="text-lg font-bold">{useRealTime()}</h1>
                    </div>

                    {/* Checkboxes en grid responsivo */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 xl:flex justify-center mt-4">
                        <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Oftalmología", value: "OFTALMOLOGÍA" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Cardiología", value: "CARDIOLOGÍA" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Neumología", value: "NEUMOLOGÍA" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Medicina Interna", value: "MEDICINA INTERNA" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Endocrinología", value: "ENDOCRINOLOGÍA" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Traumatología", value: "TRAUMATOLOGÍA" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Reumatología", value: "REUMATOLOGÍA" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Hematología", value: "HEMATOLOGÍA" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Nutrición", value: "NUTRICIÓN" }]}
                            />

                            <InputsRadioGroup
                            name="especialidad" value={form.especialidad}
                            onChange={handleRadioButton} options={[{ label: "Otorrinolaringología", value: "OTORRINOLARINGOLOGIA" }]}
                            />
                        
                        {/*<InputCheckbox label="Oftalmología" labelRight />
                        <InputCheckbox label="Cardiología" labelRight />
                        <InputCheckbox label="Neumología" labelRight />
                        <InputCheckbox label="Medicina Interna" labelRight />
                        <InputCheckbox label="Endocrinología" labelRight />
                        <InputCheckbox label="Traumatología" labelRight />
                        <InputCheckbox label="Reumatología" labelRight />
                        <InputCheckbox label="Hematología" labelRight />
                        <InputCheckbox label="Nutrición" labelRight />
                        <InputCheckbox label="Otorrinolaringologia" labelRight />*/}
                    </div>

                    <div className="grid gap-4 mt-4 pt-4 border-t-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-center">
                    {/* DNI */}
                    <InputTextOneLine
                        label="DNI:"
                        labelWidth="40px"
                        value={form.dniPaciente}
                        disabled
                        name="dniPaciente"
                    />

                    {/* Nombres (debe expandirse más) */}
                    <InputTextOneLine
                        label="Nombres:"
                        labelWidth="70px"
                        value={form.nombres}
                        name="nombres"
                        disabled
                        className="lg:col-span-2"
                    />

                    {/* Sexo (campo pequeño) */}
                    <InputTextOneLine
                        label="Sexo:"
                        labelWidth="40px"
                        value={form.sexo}
                        name="sexo"
                        disabled
                        className="max-w-[120px]"
                        inputClassName="!w-[80px] text-center"
                    />

                    {/* Fecha de nacimiento */}
                    <InputTextOneLine
                        label="Fecha de Nacimiento"
                        value={form.fechaNacimientoPaciente}
                        disabled
                        name="fechaNacimientoPaciente"
                    />

                    {/* Edad (campo pequeño) */}
                    <InputTextOneLine
                        label="Edad:"
                        labelWidth="40px"
                        value={form.edadPaciente}
                        disabled
                        name="edadPaciente"
                        className="max-w-[100px]"
                        inputClassName="!w-[70px] text-center"
                    />
                    </div>
                </section>
                <h1 className="text-blue-600 font-semibold ">Funciones Vitales</h1>
                <section className="bg-white border border-gray-200 rounded-lg mt-0 p-4 w-full">
                    {/* Checkboxes en grid responsivo */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mt-4 items-center">
                        {/* F.C */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="F.C:"
                            labelWidth="30px"
                            disabled
                            value={form.frecuenciaCardiaca}
                            className="min-w-[90px] w-full !gap-1"
                            name="fc"
                            />
                            <span className="text-sm text-gray-600">x min</span>
                        </div>

                        {/* P.A */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="P.A:"
                            labelWidth="30px"
                            value={form.PA}
                            disabled
                            className="min-w-[90px] w-full !gap-1"
                            name="pa"
                            />
                            <span className="text-sm text-gray-600">mmHg</span>
                        </div>

                        {/* F.R */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="F.R:"
                            labelWidth="30px"
                            disabled
                            value={form.frecuenciaRespiratoriaTriaje}
                            className="min-w-[90px] w-full !gap-1"
                            name="fr"
                            />
                            <span className="text-sm text-gray-600">x min</span>
                        </div>

                        {/* IMC */}
                        <InputTextOneLine
                            label="IMC"
                            labelWidth="30px"
                            value={form.imcTriaje}
                            disabled
                            className="min-w-[90px] w-full !gap-1"
                            name="imc"
                        />

                        {/* Sat. O2 */}
                        <InputTextOneLine
                            label="Sat. O°"
                            labelWidth="45px"
                            value={form.saturacionOxigenoTriaje}
                            disabled
                            className="min-w-[90px] w-full !gap-1"
                            name="sat"
                        />

                        {/* T° */}
                        <InputTextOneLine
                            label="T°"
                            value={form.temperatura}
                            disabled
                            labelWidth="25px"
                            className="min-w-[90px] w-full !gap-1"
                            name="temperatura"
                        />

                        {/* Peso */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="Peso"
                            value={form.peso}
                            disabled
                            labelWidth="40px"
                            className="min-w-[90px] w-full !gap-1"
                            name="peso"
                            />
                            <span className="text-sm text-gray-600">Kg</span>
                        </div>

                        {/* Talla */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="Talla"
                            value={form.tallaTriaje}
                            disabled
                            labelWidth="45px"
                            className="min-w-[90px] w-full !gap-1"
                            name="talla"
                            />
                            <span className="text-sm text-gray-600">m</span>
                        </div>
                    </div>
                </section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <InputTextOneLine label="Emp. Contratista" value={form.contrata} disabled name="contrata" />
                    <InputTextOneLine label="Empresa" value={form.empresa} disabled name="empresa" />
                </div>

                <h1 className="text-blue-600 font-semibold ">Médico</h1>
                <section className="bg-white border border-gray-200 rounded-lg mt-0 p-4 w-full">
                    {/* Checkboxes en grid responsivo */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                        {/* Nombre Completo (más grande, ocupa 2 columnas en pantallas medianas o grandes) */}
                        <div className="sm:col-span-2">
                            <InputTextOneLine label="Nombre Completo" value={form.nombre_medico} disabled name="nombre_medico" />
                        </div>

                        {/* CMP (pequeño) */}
                        <div className="sm:col-span-1">
                            <InputTextOneLine label="CMP" value={form.cmpUsuario} disabled name="cmp" />
                        </div>

                    </div>
                </section>

                
                <section className="bg-white rounded-lg  my-4 w-full">
                    <div className="w-full flex justify-around items-center gap-4">
                        <InputTextArea
                            label="Motivo de Interconsulta"
                            rows={6}
                            value={form.motivo}
                            onChange={handleChange}
                            classNameLabel="text-blue-600"
                            name="motivo"
                        />

                        <InputTextArea
                            label="Hallazgos Relevantes"
                            value={form.hallazgo}
                            onChange={handleChange}
                            classNameLabel="text-blue-600"
                            rows={6}
                             classNameArea="bg-[#99FFFF]"
                            name="hallazgo"
                        />
                    </div>
                </section>
                <section className="bg-white rounded-lg my-2 w-full">
                    <div className="w-full flex justify-around items-center gap-4">
                        <div className="flex flex-col items-end w-full">
                            <InputTextArea
                                label="Diagnostico"
                                value={form.diagnostico}
                                onChange={handleChange}
                                rows={6}
                                classNameLabel="text-blue-600"
                                name="diagnostico"
                                classNameArea="bg-[#99FFFF]"
                            />
                            <div className="flex p-3 mt-4 text-lg items-center font-bold border rounded-lg justify-between">
                                <InputsBooleanRadioGroup trueLabel="Apto" value={form.apto} name="apto" onChange={handleRadioButtonBoolean} falseLabel="Inapto" />
                            </div>
                        </div>
                        
                        <div className="flex flex-col w-full">
                            <InputTextArea
                                label="Tratamiento"
                                value={form.tratamiento}
                                onChange={handleChange}
                                classNameLabel="text-blue-600"
                                rows={6}
                                name="tratamiento"
                                classNameArea="bg-[#99FFFF]"
                            />
                            
                            <div className="flex  p-3 mt-4 text-lg items-center font-bold rounded-lg justify-between">
                                <div className="flex justify-between gap-1 p-2 border">
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                                    </button>
                                </div>
                                <div className="flex justify-center gap-1 text-center p-2 border items-center">
                                    <span className="font-bold italic text-base mb-1 mx-4">IMPRIMIR</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            name="norden"
                                            value={form.norden}
                                            onChange={handleChangeNumber}
                                            className="border rounded px-2 py-1 text-base w-24"
                                        />

                                        <button
                                            type="button"
                                            onClick={handlePrint}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                                        >
                                            <FontAwesomeIcon icon={faPrint} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </section>
            </div>
        </>
    )
}
