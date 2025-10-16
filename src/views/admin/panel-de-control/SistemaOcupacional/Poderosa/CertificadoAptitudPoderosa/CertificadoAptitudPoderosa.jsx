import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { useForm } from "../../../../../hooks/useForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import useRealTime from "../../../../../hooks/useRealTime";

const CertificadoAptitudPoderosa = () => {

    const { form,handleChangeNumber,handleChange, handleRadioButton, handleClear } = useForm()

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotOandEspecialidad();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
        console.log("Guardando datos:", form);
    };

    return(
        <>
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
                                    disabled
                                    value={form?.nombres}
                                    onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                    label="DNI"
                                    disabled
                                    labelWidth="50px"
                                    name="dniPaciente"
                                    value={form?.dniPaciente}
                                    onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                    label="Edad"
                                    disabled
                                    labelWidth="50px"
                                    name="edadPaciente"
                                    value={form?.edadPaciente}
                                    onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                    label="Género"
                                    disabled
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
                                    disabled
                                    value={form?.empresa}
                                    onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                    label="Contratista"
                                    disabled
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
                                    disabled
                                    value={form?.cargoPaciente}
                                    onChange={handleChange}
                                    />
                                    <InputTextOneLine
                                    label="Ocupación Actual o Última Ocupación"
                                    name="ocupacionPaciente"
                                    disabled
                                    value={form?.ocupacionPaciente}
                                    onChange={handleChange}
                                    />
                                </div>
                            </section>
                            <div className="flex w-full">
                                <div className="w-1/2">
                                    <section className="bg-white border border-gray-200 rounded-lg p-4 gap-4 mt-0 m-4">
                                            <InputsRadioGroup
                                            vertical
                                            name="apto" value={form?.apto} className="py-2"
                                            onChange={handleRadioButton} options={[
                                                { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                                { label: "APTO con RESTRICCION (para el puesto en el que trabaja o postula)", value: "APTOCONRESTRICCION" },
                                                { label: "NO APTO TEMPORAL (para el puesto en el que trabaja o postula)", value: "APTOCONRESTRICCION" },
                                                { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" }
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
                                        
                                        <InputTextOneLine
                                        label="Medico que Certifica"
                                        name="nombreMedico"
                                        disabled
                                        className="mt-2"
                                        value={form?.nombreMedico}
                                        onChange={handleChange}
                                        />
                                        <div className="w-full flex justify-between items-center gap-1 mt-4">
                                            <div className="flex gap-1">
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
                                            <div className="flex gap-1 items-center">
                                                <span className="font-bold italic text-base mb-1 mx-4">IMPRIMIR</span>
                                                <input
                                                    name="norden"
                                                    value={form?.norden}
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
                                    </section>
                                </div>
                                <div className="w-1/2 h-auto">
                                    <InputsRadioGroup
                                    name="conclusiones"
                                    vertical
                                    value={form?.conclusiones}
                                    className="py-2"
                                    onChange={handleRadioButton}
                                    options={[
                                        { label: "CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO", value: "Check1" },
                                        { label: "CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO", value: "Check2" },
                                        { label: "CORREGIR AGUDEZA VISUAL PARA LECTURA CERCA", value: "Check3" },
                                        { label: "EVITAR MOVIMIENTOS Y POSICIONES DISERGONOMICAS", value: "Check4" },
                                        { label: "NO HACER TRABAJO DE ALTO RIESGO", value: "Check5" },
                                        { label: "NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO", value: "Check6" },
                                        { label: "USO DE EPP AUDITIVO ANTE EXPOSICION A RUIDO >=80 DB", value: "Check7" },
                                        { label: "USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS", value: "Check8" },
                                        { label: "USO DE LENTES CORRECTORES PARA TRABAJO", value: "Check9" },
                                        { label: "USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO", value: "Check10" },
                                        { label: "USO DE LENTES CORRECTORES LECTURA DE CERCA", value: "Check11" },
                                        { label: "NO CONDUCIR VEHÍCULOS", value: "Check12" },
                                        { label: "NO HACER TRABAJO CON CÓDIGO COLORES", value: "Check13" },
                                        { label: "DIETA HIPOCALÓRICA Y EJERCICIOS", value: "Check14" },
                                        { label: "NINGUNO", value: "Check15" },
                                    ]}
                                    />
                                </div>
                            </div>
                            <div className="w-full p-4 gap-4 mt-0 m-4">
                                 <InputTextArea
                                        label="Observaciones"
                                        value={form?.conclusiones}
                                        onChange={handleChange}
                                        classNameLabel="text-blue-600"
                                        rows={5}
                                        name="conclusiones"
                                    />               
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
                                            name="oftalodccmologia_odcc"
                                            value={form?.oftalodccmologia_odcc}
                                            disabled
                                            labelWidth="35px"
                                        />
                                        <InputTextOneLine
                                            label="V.L."
                                            name="odlcOftalmologia_odlc"
                                            value={form?.odlcOftalmologia_odlc}
                                            disabled
                                            labelWidth="35px"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="font-semibold mb-2 text-center">O.I</div>
                                        <InputTextOneLine
                                            label="V.C."
                                            name="oiccoftalmologia_oicc"
                                            value={form?.oiccoftalmologia_oicc}
                                            disabled
                                            labelWidth="35px"
                                        />
                                        <InputTextOneLine
                                            label="V.L."
                                            name="oilcOftalmologia_oilc"
                                            value={form?.oilcOftalmologia_oilc}
                                            disabled
                                            labelWidth="35px"
                                        />
                                    </div>
                                </div>
                                {/* Fila extra (ancho completo) */}
                                <div className="mt-4 space-y-3">
                                    <InputTextOneLine
                                        label="V.Clrs"
                                        name="vcOftalmologia_vc"
                                        value={form?.vcOftalmologia_vc}
                                        disabled
                                        className="flex-1 w-full"
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        name="vbOftalmologia_vb"
                                        label="V.B."
                                        value={form?.vbOftalmologia_vb}
                                        disabled
                                        className="flex-1 w-full"
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="R.P."
                                        name="rpOftalmologia_rp"
                                        value={form?.rpOftalmologia_rp}
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
                            name="hemoglobina_txthemoglobina"
                            value={form?.hemoglobina_txthemoglobina}
                            disabled
                            labelWidth="80px"
                        />
                        <InputTextOneLine
                            label="V.S.G"
                            name="vsgLabClinico_txtvsg"
                            value={form?.vsgLabClinico_txtvsg}
                            disabled
                            labelWidth="80px"
                        />
                        <InputTextOneLine
                            label="Glucosa"
                            name="glucosaLabClinico_txtglucosabio"
                            value={form?.glucosaLabClinico_txtglucosabio}
                            disabled
                            labelWidth="80px"
                        />
                        <InputTextOneLine
                            label="Creatina"
                            name="leucocitoSematologiaLabClinico"
                            value={form?.leucocitoSematologiaLabClinico}
                            disabled
                            labelWidth="80px"
                        />
                    </div>
                </div>
            </div>
                
            </div>
        </>
    )
}

export default CertificadoAptitudPoderosa