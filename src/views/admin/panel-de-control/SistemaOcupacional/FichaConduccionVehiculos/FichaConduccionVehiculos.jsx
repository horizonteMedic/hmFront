import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faStethoscope,
    faChartLine,
    faBroom,
    faPrint,
    faSave,
    faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsRadioGroup,
    InputCheckbox
} from "../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../hooks/useForm";
import ExamenMedico from "./ExamenMedico/ExamenMedico";
import Antecedentes from "./Antecedentes/Antecedentes";
import PruebasComplementarias from "./PruebasComplementarias/PruebasComplementarias";
import { getToday, getTodayPlusOneYear } from "../../../../utils/helpers";
import { useSessionData } from "../../../../hooks/useSessionData";
import Swal from "sweetalert2";
import { handleSubirArchivo, handleSubirArchivoMasivo, PrintHojaR, ReadArchivosForm, SubmitDataService, VerifyTR } from "./controllerFichaConduccionVehiculos";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";

const tabla = "b_certificado_conduccion";
const today = getToday();
export default function FichaConduccionVehiculos() {
    const [activeTab, setActiveTab] = useState(0);

    const { token, userlogued, selectedSede, datosFooter, userCompleto, userName } =
        useSessionData();

    const initialFormState = {
        // Datos personales
        norden: "",
        codigoCertificado_cod_certificado: null,
        fechaExam: today,
        tipoExamen: "",
        razonVisita: "PRIMERA ACTITUD",
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        experienciaAnios: "",

        empresa: "",
        contrata: "",
        puestoPostula: "",
        puestoActual: "",
        //=====================TAB LATERAL=====================
        // Agudeza Visual
        vcOD: "",
        vlOD: "",
        vcOI: "",
        vlOI: "",

        vcCorregidaOD: "",
        vlCorregidaOD: "",
        vcCorregidaOI: "",
        vlCorregidaOI: "",

        vclrs: "",
        vb: "",
        rp: "",
        enfermedadesOculares: "",
        //=====================TAB EXAMEN MEDICO=====================
        frecuenciaCardiaca: "",
        frecuenciaRespiratoria: "",
        presionArterial: "",
        talla: "",
        peso: "",
        imc: "",
        imcRed: false,
        perimetroCuello: "",
        perimetroCintura: "",
        perimetroCadera: "",
        icc: "",
        perimetroToracicoInspiracion: "",
        perimetroToracicoEspiracion: "",
        // Examen Médico - Hallazgos del Examen Físico
        limitacionFuerzaExtremidades: false,
        alteracionEquilibrioRomberg: false,
        anormalidadMarchaOjosCerrados: false,
        alteracionCoordinacionDedoNariz: false,
        asimetriaFacial: false,
        sustentacionUnPie: false,
        presenciaNistagmus: false,
        anormalidadMovimientosOculares: false,
        pupilasNoCirla: false,
        anormalidadLenguaje: false,
        movimientosInvoluntarios: false,
        // Examen Médico - Información Adicional
        detalleInformacionExamenMedico: "",

        //=====================TAB ANTECEDENTES=====================
        alteracionConsciencia: false,
        alcoholismoCronico: false,
        movimientosInvoluntariosEnfermedades: false,
        perdidaRecurrenteConsciencia: false,
        diabetesHipoglicemiaNoControlada: false,
        insuficienciaRenalCronicaGradoIV: false,
        // Antecedentes - Columna Derecha
        efectosEnfermedadTratamiento: false,
        sustanciasEstupefacientesSinTratamiento: false,
        sustanciasEstupefacientesConAlteracion: false,
        sindromeApneaObstructivaSueño: false,
        obesidadIMC30: false,
        anemiaCriteriosOMS2011: false,
        comentariosDetalleAntecedentes: "",

        //=====================TAB PRUEBAS COMPLEMENTARIAS=====================
        // Pruebas Complementarias
        hipoacusiaFrecuenciasConversacionales: false,
        alteracionAgudezaVisual: false,
        noReconocimientoColores: false,
        campimetriaAnormal: false,
        pruebaVisionProfundidadAlterada: false,
        testSASAnormal: false,
        evaluacionPsicosensometricaAlterada: false,
        // Otros Datos de Relevancia
        medicinasTomando: "",
        otrosDatosRelevancia: "",

        //PARTE INFERIOR
        // Conclusión y Comentarios
        aptoDesde: today,
        aptoHasta: getTodayPlusOneYear(),
        conclusion: null,
        observacionesRecomendaciones: "",
        nombreMedicoColegiatura: userCompleto?.datos?.nombres_user?.toUpperCase() ?? "",
        dniUsuario: userCompleto?.datos?.dni_user ?? "",
        // Recomendaciones
        sobrepesoDietaHipocalorica: false,
        corregirAgudezaVisual: false,
        corregirAgudezaVisualTotal: false,
        obesidadDietaHipocalorica: false,
        usoLentesCorrectoresLectura: false,
        corregirAgudezaLectura: false,

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        SubirDoc: false,
        nomenclatura: "PSICOSENSOMETRICO VEHI-FOLIO"
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleClearnotO,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handlePrintDefault,
        handleCheckBoxChange,
        handleClear,
    } = useForm(initialFormState, { storageKey: "fichaConduccionVehiculos" });

    // Mapeo de textos para Recomendaciones vinculadas a los checkboxes
    const recomendacionesTextMap = {
        sobrepesoDietaHipocalorica: "SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
        corregirAgudezaVisual: "CORREGIR AGUDEZA VISUAL.",
        corregirAgudezaVisualTotal: "CORREGIR AGUDEZA VISUAL TOTAL.",
        obesidadDietaHipocalorica: "OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
        usoLentesCorrectoresLectura: "USO DE LENTES CORRECTORES PARA LECTURA DE CERCA.",
        corregirAgudezaLectura: "CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA.",
    };

    // Handler para checkboxes de Recomendaciones: agrega/quita texto en observacionesRecomendaciones
    const handleRecomendacionCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setForm((prev) => {
            const next = { ...prev, [name]: checked };
            // Obtenemos las líneas existentes
            const existentes = (prev.observacionesRecomendaciones || "")
                .split(/\n/)
                .map((l) => l.trim())
                .filter((l) => l.length > 0);
            // Texto asociado al checkbox
            const texto = recomendacionesTextMap[name];
            let nuevasLineas = [...existentes];
            if (checked) {
                // Si se marca y aún no está, lo agregamos al final
                if (!nuevasLineas.includes(texto)) {
                    nuevasLineas.push(texto);
                }
            } else {
                // Si se desmarca, lo quitamos
                nuevasLineas = nuevasLineas.filter((l) => l !== texto);
            }
            const nuevoObs = nuevasLineas.join("\n");
            return { ...next, observacionesRecomendaciones: nuevoObs };
        });
    };
    const [visualerOpen, setVisualerOpen] = useState(null)

    const tabs = [
        {
            id: 0,
            name: "Examen Médico",
            icon: faStethoscope,
            component: ExamenMedico,
        },
        {
            id: 1,
            name: "Antecedentes",
            icon: faUser,
            component: Antecedentes,
        },
        {
            id: 2,
            name: "Pruebas Complementarias",
            icon: faChartLine,
            component: PruebasComplementarias,
        },
    ];

    const handleSave = () => {
        if (form.conclusion == null) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, seleccione la aptitud.",
            })
            return
        }
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
        <div className="flex h-full">
            {/* Contenido principal - 80% */}
            <div className="w-4/5">
                <div className="w-full">
                    {/* Datos del trabajador */}
                    <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <InputTextOneLine
                            label="N° Orden"
                            name="norden"
                            value={form?.norden}
                            onChange={handleChangeNumber}
                            onKeyUp={handleSearch}
                        />
                        <InputTextOneLine
                            label="Fecha Examen"
                            type="date"
                            name="fechaExam"
                            value={form?.fechaExam}
                            onChange={handleChangeSimple}
                        />
                        <InputTextOneLine
                            label="Tipo de Examen"
                            name="tipoExamen"
                            value={form?.tipoExamen}
                            disabled
                        />
                        <InputsRadioGroup
                            name="razonVisita"
                            value={form?.razonVisita}
                            onChange={handleRadioButton}
                            options={[
                                { label: "1ra Actitud", value: "PRIMERA ACTITUD" },
                                { label: "Revalidación", value: "REVALIDACION" },
                            ]}
                        />
                        <ButtonsPDF
                            {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
                            {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
                            handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
                        />
                    </section>
                    <section className="bg-white border border-gray-200 rounded-lg p-4 m-4">
                        <h3 className="text-lg font-semibold mb-3">Datos del Paciente</h3>
                        {/* Fila 1: Nombres, DNI, Edad, Género */}
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 mb-1">
                            <InputTextOneLine
                                label="Nombres y Apellidos"
                                name="nombres"
                                value={form?.nombres}
                                disabled
                            />
                            <InputTextOneLine
                                label="T. Experiencia"
                                name="experienciaAnios"
                                value={form?.experienciaAnios}
                                onChange={handleChange}
                            />
                            <InputTextOneLine
                                label="Sexo"
                                name="sexo"
                                value={form?.sexo}
                                disabled
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <InputTextOneLine
                                    label="DNI"
                                    name="dni"
                                    value={form?.dni}
                                    disabled
                                />
                                <InputTextOneLine
                                    label="Edad"
                                    name="edad"
                                    value={form?.edad}
                                    disabled
                                />
                            </div>
                            <InputTextOneLine
                                label="Empresa"
                                name="empresa"
                                value={form?.empresa}
                                disabled
                            />
                            <InputTextOneLine
                                label="Contrata"
                                name="contrata"
                                value={form?.contrata}
                                disabled
                            />
                            <InputTextOneLine
                                label="Area de Trabajo"
                                name="puestoPostula"
                                value={form?.puestoPostula}
                                disabled
                            />
                            <InputTextOneLine
                                label="Puesto de Trabajo"
                                name="puestoActual"
                                value={form?.puestoActual}
                                disabled
                            />
                        </div>
                    </section>

                    {/* Tab Navigation */}
                    <nav className="flex bg-white border-b border-gray-200 sticky top-0 z-20">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`flex-1 px-4 py-3 uppercase tracking-wider text=[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeTab === tab.id
                                    ? "border-[#233245] text-[#233245] font-semibold"
                                    : "border-transparent"
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                {tab.name}
                            </button>
                        ))}
                    </nav>

                    {/* Tab Content */}
                    <div className="max-w-full">
                        {tabs.map((tab) => {
                            const Component = tab.component;
                            return (
                                activeTab === tab.id && (
                                    <Component
                                        key={tab.id}
                                        form={form}
                                        setForm={setForm}
                                        handleChange={handleChange}
                                        handleChangeNumber={handleChangeNumber}
                                        handleRadioButtonBoolean={handleRadioButtonBoolean}
                                        handleClear={handleClear}
                                    />
                                )
                            );
                        })}
                    </div>

                    {/* Sección Estática - Conclusión y Comentarios */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 m-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Conclusión y Comentarios</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Columna Izquierda - Conclusión */}
                            <div className="space-y-4">
                                <div>
                                    <label className="font-semibold mb-2">
                                        Apto para conducción de vehículos:
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <InputTextOneLine
                                            label="Desde"
                                            name="aptoDesde"
                                            type="date"
                                            value={form?.aptoDesde}
                                            onChange={handleChangeSimple}
                                        />
                                        <InputTextOneLine
                                            label="Hasta"
                                            name="aptoHasta"
                                            type="date"
                                            value={form?.aptoHasta}
                                            onChange={handleChangeSimple}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-semibold mb-2">
                                        Conclusiones:
                                    </label>
                                    <InputsRadioGroup
                                        label="Restricción"
                                        name="conclusion"
                                        value={form?.conclusion}
                                        onChange={handleRadioButton}
                                        vertical
                                        options={[
                                            { label: "Apto", value: "APTO" },
                                            { label: "Observado", value: "OBSERVADO" },
                                            { label: "No Apto", value: "NO APTO" },
                                            { label: "Apto con Restricción", value: "APTO CON RESTRICCION" },
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Columna Central - Observaciones */}
                            <div className="space-y-4">
                                <InputTextArea
                                    label="Observaciones y Recomendaciones"
                                    name="observacionesRecomendaciones"
                                    value={form?.observacionesRecomendaciones}
                                    onChange={handleChange}
                                    rows={6}
                                />
                                <EmpleadoComboBox
                                    value={form.nombre_medico}
                                    form={form}
                                    onChange={handleChangeSimple}
                                />
                            </div>

                            {/* Columna Derecha - Recomendaciones */}
                            <div className="space-y-2">
                                <h5 className="font-semibold text-gray-700 mb-3">Recomendaciones:</h5>
                                <div className="space-y-2">
                                    <InputCheckbox
                                        label="SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."
                                        name="sobrepesoDietaHipocalorica"
                                        checked={form?.sobrepesoDietaHipocalorica}
                                        onChange={handleRecomendacionCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="CORREGIR AGUDEZA VISUAL."
                                        name="corregirAgudezaVisual"
                                        checked={form?.corregirAgudezaVisual}
                                        onChange={handleRecomendacionCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="CORREGIR AGUDEZA VISUAL TOTAL."
                                        name="corregirAgudezaVisualTotal"
                                        checked={form?.corregirAgudezaVisualTotal}
                                        onChange={handleRecomendacionCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."
                                        name="obesidadDietaHipocalorica"
                                        checked={form?.obesidadDietaHipocalorica}
                                        onChange={handleRecomendacionCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="USO DE LENTES CORRECTORES PARA LECTURA DE CERCA"
                                        name="usoLentesCorrectoresLectura"
                                        checked={form?.usoLentesCorrectoresLectura}
                                        onChange={handleRecomendacionCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA."
                                        name="corregirAgudezaLectura"
                                        checked={form?.corregirAgudezaLectura}
                                        onChange={handleRecomendacionCheckboxChange}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Botones de Acción */}
                        <section className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
                            <div className=" flex gap-4">
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
                            <div className="flex flex-col items-end">
                                <span className="font-bold italic text-base mb-1">Imprimir</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        name="norden"
                                        value={form.norden}
                                        onChange={handleChange}
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
                </div>
            </div>

            {/* Panel lateral de Agudeza Visual - 20% */}
            <div className="w-1/5">
                <div className="bg-white border border-gray-200 rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-3">Agudeza Visual</h4>
                    {/* Sin Corregir */}
                    <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2 text-center">Sin Corregir</h5>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="">
                                <div className="font-semibold mb-2 text-center">O.D</div>
                                <div className="space-y-3">
                                    <InputTextOneLine label="V.C." name="vcOD" value={form?.vcOD} disabled labelWidth="35px" />
                                    <InputTextOneLine label="V.L." name="vlOD" value={form?.vlOD} disabled labelWidth="35px" />
                                </div>
                            </div>
                            <div className="">
                                <div className="font-semibold mb-2 text-center">O.I</div>
                                <div className="space-y-3">
                                    <InputTextOneLine label="V.C." name="vcOI" value={form?.vcOI} disabled labelWidth="35px" />
                                    <InputTextOneLine label="V.L." name="vlOI" value={form?.vlOI} disabled labelWidth="35px" />
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
                    {visualerOpen && (
                        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
                                <div className="px-4 py-2 naranjabackgroud flex justify-between">
                                    <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
                                    <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
                                </div>
                                <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
                                    <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
                                </div>
                                <div className="flex justify-center">
                                    <a href={visualerOpen.mensaje} download={visualerOpen.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                                        <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Enfermedades Oculares */}
                    <InputTextArea label="Enfermedades Oculares" rows={5} name="enfermedadesOculares" value={form?.enfermedadesOculares} onChange={handleChange} disabled />
                </div>
            </div>
        </div>
    );
}
