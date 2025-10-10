import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import { useForm } from "../../../../hooks/useForm";
import useRealTime from "../../../../hooks/useRealTime";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import { useSessionData } from "../../../../hooks/useSessionData";
import { VerifyTR } from "./ControllerCMO";

const tabla = "certificado_aptitud_medico_resumen"

export default function CertificadoMedicoOcupacional() {
    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();

    const InitialForm = {
        norden: "",

        nombreExamen: "",
        nombres: "",
        dniPaciente: "",
        edadPaciente: "",
        sexo: "",
        empresa: "",
        contrata: "",
        cargoPaciente: "",
        ocupacionPaciente: "",
        //Izquierda
        apto: true,
        aptoConRestriccion: false,
        noApto: false,

        fechaDesde: "",
        fechahasta: "",

        //Cuadrito feo
        visionCercaSincorregirOd_v_cerca_s_od: "",
        visionLejosSincorregirOd_v_lejos_s_od: "",
        visionCercaSincorregirOi_v_cerca_s_oi: "",
        visionLejosSincorregirOi_v_lejos_s_oi: "",
        
        enfermedadesOcularesOftalmologia_e_oculares:""

    }

    const { form, setForm, handleChangeNumber,handleChange, handleClearnotO, handleRadioButton } = useForm(InitialForm)

    const handleRadioButtonPerso = (e, value) => {
        const { name } = e.target;

        // Reinicia todos a false, pero activa solo el que se seleccionó
        setForm((prev) => ({
            ...prev,
            apto: false,
            aptoConRestriccion: false,
            noApto: false,
            [name]: true,
        }));
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
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
        <div className="mx-auto bg-white overflow-hidden">
            {/* Header */}
            <h1 className="text-blue-600 font-semibold p-4 pb-0 mb-0 m-4">Aptitud</h1>
            <div className="flex h-full">
            {/* Contenido principal - 80% */}
                <div className="w-4/5">
                    <div className="w-full">
                        {/* Datos del trabajador */}
                        <section className="bg-white border border-gray-200 rounded-lg p-4  mt-0 m-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                labelWidth="60px"
                                value={form?.norden}
                                onChange={handleChangeNumber}
                                onKeyUp={handleSearch}
                            />
                            <InputTextOneLine
                                label="Tipo de Examen"
                                name="nombreExamen"
                                value={form?.nombreExamen}
                                labelWidth="100px"
                                onChange={handleChange}
                            />
                            <div className="flex gap-2 justify-center items-center w-full">
                                <InputTextOneLine
                                    label="Imprimir Resumen Medico"
                                    labelWidth="140px"
                                    name="norden"
                                    value={form?.norden}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    //onClick={handlePrint}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPrint} />
                                </button>
                            </div>
                            
                            <div className="flex justify-end mt-3">
                                <h1 className="text-lg font-bold">{useRealTime()}</h1>
                            </div>
                            
                        </section>

                        <h1 className="text-blue-600 font-semibold p-4 pb-0 mb-0 m-4">Certifica que el Sr.</h1>
                        <section className="bg-white border border-gray-200 rounded-lg p-4 mt-0 m-4">
                            {/* Fila 1: Datos personales */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <InputTextOneLine
                                label="Nombres y Apellidos"
                                name="nombres"
                                value={form?.nombres}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="DNI"
                                labelWidth="50px"
                                name="dniPaciente"
                                value={form?.dniPaciente}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="Edad"
                                labelWidth="50px"
                                name="edadPaciente"
                                value={form?.edadPaciente}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="Género"
                                labelWidth="60px"
                                name="sexo"
                                value={form?.sexo}
                                onChange={handleChange}
                                />
                            </div>

                            {/* Fila 2: Empresa y Contratista */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <InputTextOneLine
                                label="Empresa"
                                name="empresa"
                                value={form?.empresa}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="Contratista"
                                name="contratista"
                                value={form?.contrata}
                                onChange={handleChange}
                                />
                            </div>

                            {/* Fila 3: Puesto y Ocupación */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <InputTextOneLine
                                label="Puesto al que Postula"
                                name="cargoPaciente"
                                value={form?.cargoPaciente}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="Ocupación Actual o Última Ocupación"
                                name="ocupacionPaciente"
                                value={form?.ocupacionPaciente}
                                onChange={handleChange}
                                />
                            </div>
                        </section>
                        <div className="flex w-full">
                            <div className="w-1/2">
                                <section className="bg-white border border-gray-200 rounded-lg p-4 gap-4 mt-0 m-4">
                                    <InputsRadioGroup
                                    name="apto" value={form.apto} className="py-2"
                                    onChange={handleRadioButtonPerso} options={[
                                        { label: "APTO (para el puesto en el que trabaja o postula)", value: "Apto" },
                                        { label: "APTO (para el puesto en el que trabaja o postula)", value: "aptoConRestriccion" },
                                        { label: "APTO (para el puesto en el que trabaja o postula)", value: "noApto" }
                                    ]}
                                    />
                                    
                                    <div className="w-full flex justify-between items-center pt-4 pb-2 px-2">
                                        <InputTextOneLine
                                            label="Fecha"
                                            name="fechaDesde"
                                            type="date"
                                            value={form?.fechaDesde}
                                            labelWidth="50px"
                                            onChange={handleChange}
                                        />
                                        <InputTextOneLine
                                            label="Fecha Venc"
                                            name="fechahasta"
                                            type="date"
                                            value={form?.fechahasta}
                                            labelWidth="65px"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </section>
                                <section className="bg-white rounded-lg p-4 pt-1 gap-4 mt-0 m-4">
                                    <InputsRadioGroup
                                    name="especialidad" value={form.especialidad} className="py-2"
                                    onChange={handleRadioButton} options={[{ label: "1. MARSA - OPERATIVA, SUPERVISOR, AYUDANTE", value: "OFTALMOLOGÍA" }]}
                                    />
                                    <InputsRadioGroup
                                    name="especialidad" value={form.especialidad} className="py-2"
                                    onChange={handleRadioButton} options={[{ label: "2. MARSA - CONDUCTOR u OPERADOR MAQUINARIA", value: "OFTALMOLOGÍA" }]}
                                    />
                                    <div className="w-full grid grid-cols-2">
                                        <InputsRadioGroup
                                        name="especialidad" value={form.especialidad} className="py-2"
                                        onChange={handleRadioButton} options={[{ label: "3. MARSA - RETIRO ", value: "OFTALMOLOGÍA" }]}
                                        />
                                        <InputsRadioGroup
                                        name="especialidad" value={form.especialidad} className="py-2"
                                        onChange={handleRadioButton} options={[{ label: "6. PROTOCOLO PODEROSA RETIRO", value: "OFTALMOLOGÍA" }]}
                                        />
                                    </div>
                                    <div className="w-full grid grid-cols-2">
                                        <InputsRadioGroup
                                        name="especialidad" value={form.especialidad} className="py-2"
                                        onChange={handleRadioButton} options={[{ label: "4. RETIRO BOROO", value: "OFTALMOLOGÍA" }]}
                                        />
                                        <InputsRadioGroup
                                        name="especialidad" value={form.especialidad} className="py-2"
                                        onChange={handleRadioButton} options={[{ label: "7. PROTOCOLO PODEROSA", value: "OFTALMOLOGÍA" }]}
                                        />
                                    </div>
                                    <InputsRadioGroup
                                    name="especialidad" value={form.especialidad} className="py-2"
                                    onChange={handleRadioButton} options={[{ label: "5. BOROO - PSICONSENSOMETRICO Y ALTURA   Perfil Lipidico. ", value: "OFTALMOLOGÍA" }]}
                                    />
                                    <InputTextOneLine
                                    label="Medico que Certifica"
                                    name="nombres"
                                    className="mt-2"
                                    value={form?.nombres}
                                    onChange={handleChange}
                                    />
                                    <div className="w-full flex justify-between items-center gap-1 mt-4">
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                //onClick={handleSave}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                                            </button>
                                            <button
                                                type="button"
                                                //onClick={handleClear}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faBroom} /> Limpiar
                                            </button>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <span className="font-bold italic text-base mb-1 mx-4">IMPRIMIR</span>
                                            <input
                                                name="norden"
                                                value={form.norden}
                                                onChange={handleChangeNumber}
                                                className="border rounded px-2 py-1 text-base w-24"
                                            />

                                            <button
                                                type="button"
                                                //onClick={handlePrint}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faPrint} />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="w-1/2">
                                <InputTextArea
                                    label="Examenes"
                                    value={form.tratamiento}
                                    onChange={handleChange}
                                    classNameLabel="text-blue-600"
                                    rows={20}
                                    name="tratamiento"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            {/* Panel lateral de Agudeza Visual - 20% */}
            <div className="w-1/5">
                <div className="bg-white border border-gray-200 rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
                    <h4 className="font-bold text-lg text-gray-800 mb-3 text-center">Sin Corregir</h4>
                    {/* Sin Corregir */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2 text-center">Sin Corregir</h5>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="">
                                    <div className="font-semibold mb-2 text-center">O.D</div>
                                    <div className="space-y-3">
                                        <InputTextOneLine label="V.C." name="visionCercaSincorregirOd_v_cerca_s_od" value={form?.visionCercaSincorregirOd_v_cerca_s_od} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="visionLejosSincorregirOd_v_lejos_s_od" value={form?.visionLejosSincorregirOd_v_lejos_s_od} disabled labelWidth="35px" />
                                    </div>
                                </div>
                                <div className="">
                                    <div className="font-semibold mb-2 text-center">O.I</div>
                                    <div className="space-y-3">
                                        <InputTextOneLine label="V.C." name="visionCercaSincorregirOi_v_cerca_s_oi" value={form?.visionCercaSincorregirOi_v_cerca_s_oi} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="visionLejosSincorregirOi_v_lejos_s_oi" value={form?.visionLejosSincorregirOi_v_lejos_s_oi} disabled labelWidth="35px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Corregida */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2 text-center">Corregida</h5>
                            {/* Fila OD y OI */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="font-semibold mb-2 text-center">O.D</div>
                                    <InputTextOneLine
                                        label="V.C."
                                        name="vcCorregidaOD"
                                        value={form?.vcCorregidaOD}
                                        disabled
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="V.L."
                                        name="vlCorregidaOD"
                                        value={form?.vlCorregidaOD}
                                        disabled
                                        labelWidth="35px"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="font-semibold mb-2 text-center">O.I</div>
                                    <InputTextOneLine
                                        label="V.C."
                                        name="vcCorregidaOI"
                                        value={form?.vcCorregidaOI}
                                        disabled
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="V.L."
                                        name="vlCorregidaOI"
                                        value={form?.vlCorregidaOI}
                                        disabled
                                        labelWidth="35px"
                                    />
                                </div>
                            </div>
                            {/* Fila extra (ancho completo) */}
                            <div className="mt-4 space-y-3">
                                <InputTextOneLine
                                    label="V.Clrs"
                                    name="vclrs"
                                    value={form?.vclrs}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                                <InputTextOneLine
                                    name="vb"
                                    label="V.B."
                                    value={form?.vb}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                                <InputTextOneLine
                                    label="R.P."
                                    name="rp"
                                    value={form?.rp}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                            </div>
                        </div>
                        {/* Enfermedades Oculares */}
                        <InputTextArea label="Enfermedades Oculares" rows={2    } name="enfermedadesOcularesOftalmologia_e_oculares" value={form?.enfermedadesOcularesOftalmologia_e_oculares} onChange={handleChange} disabled />
                </div>
                <div className="bg-white  rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
                    <InputTextOneLine
                        label="Hemoglobina"
                        name="vcCorregidaOD"
                        value={form?.vcCorregidaOD}
                        disabled
                        labelWidth="80px"
                    />
                    <InputTextOneLine
                        label="V.S.G"
                        name="vcCorregidaOD"
                        value={form?.vcCorregidaOD}
                        disabled
                        labelWidth="80px"
                    />
                    <InputTextOneLine
                        label="Glucosa"
                        name="vcCorregidaOD"
                        value={form?.vcCorregidaOD}
                        disabled
                        labelWidth="80px"
                    />
                    <InputTextOneLine
                        label="Creatina"
                        name="vcCorregidaOD"
                        value={form?.vcCorregidaOD}
                        disabled
                        labelWidth="80px"
                    />
                </div>
            </div>
        </div>
            
        </div>
    )
}
