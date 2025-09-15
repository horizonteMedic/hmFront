import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faHeartbeat,
    faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputsRadioGroup,
    InputTextArea,
    InputCheckbox,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
// import { GetExamenesRealizados, PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformePsicologico";
import Swal from "sweetalert2";

const tabla = "informe_psicologico";
const today = getToday();

export default function InformePsicologico() {
    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();

    const initialFormState = {
        norden: "",
        fechaEntrevista: today,
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        ocupacion: "",
        cargoDesempenar: "",

        // Área Intelectual
        areaIntelectual: "EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO.",
        promedio: false,
        superior: false,
        nInferior: false,
        alto: false,

        pSuperior: false,
        pMedio: false,
        pBajo: false,
        bajo: false,

        facilidad: false,
        dificultad: false,

        pnAdecuado: false,
        nAlto: false,
        nBajo: false,

        yNumerica: false,
        yCalculo: false,

        adecuadaR: false,
        inadecuada: false,

        // Área de Personalidad
        areaPersonalidad: "",

        // Área de Psicomotricidad
        areaPsicomotricidad: "",
        nivelAltoPs: false,
        nivelAdecuadoPs: false,
        nivelBajoPs: false,

        facilidadPs: false,
        dificultadPs: false,


        // Área de Organicidad
        areaOrganicidad: "",
        orientadoEnTiempo: false,

        poseeAltoManejo: false,
        pAdecuadoManejo: false,
        pBajoManejo: false,

        noSeEnvidencia: false,

        // Recomendaciones
        recomendaciones: "",

        // Aprobó Test
        aproboTest: "",

        // Observaciones generales del panel lateral
        observacionesGenerales: "",

        // Médico que Certifica
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
        filteredNombresMedicos: [],
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleCheckBoxChange,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState);


    // Funciones temporales sin funcionalidad del controller
    const handleSave = () => {
        console.log("Función de guardar comentada");
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            console.log("Función de búsqueda comentada");
        }
    };

    const handleSearchExamenesRealizados = (e) => {
        if (e.key === "Enter") {
            console.log("Función de búsqueda de exámenes comentada");
        }
    };

    const handlePrint = () => {
        console.log("Función de impresión comentada");
    };

    return (
        <div className="mx-auto bg-white overflow-hidden ">
            <div className="flex h-full">
                <div className="w-full space-y-6 p-4">
                    {/*==========================Datos Necesarios Section==========================*/}
                    <div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2 text-[#233245]" />
                            <h2 className="text-lg font-semibold text-[#233245] uppercase tracking-wider">Datos Necesarios</h2>
                        </div>
                        {/* ===== SECCIÓN: DATOS NECESARIOS ===== */}
                        <div className="p-4 text-[10px] space-y-3">
                            {/* Header con información del examen */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3 ">
                                <h3 className="font-semibold mb-2">Informe Psicológico</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <InputTextOneLine
                                        label="N° Orden"
                                        name="norden"
                                        value={form.norden}
                                        onKeyUp={handleSearch}
                                        onChange={handleChangeNumber}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Fecha Entrevista"
                                        name="fechaEntrevista"
                                        type="date"
                                        value={form.fechaEntrevista}
                                        onChange={handleChange}
                                        labelWidth="120px"
                                    />
                                </div>
                            </div>
                            {/* Contenido principal */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-3">Datos Necesarios</h4>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Columna Izquierda */}
                                    <div className="space-y-3">
                                        <InputTextOneLine
                                            label="Nombres"
                                            name="nombres"
                                            value={form.nombres}
                                            onChange={handleChange}
                                            disabled
                                            labelWidth="120px"
                                        />
                                        <InputTextOneLine
                                            label="Apellidos"
                                            name="apellidos"
                                            value={form.apellidos}
                                            onChange={handleChange}
                                            disabled
                                            labelWidth="120px"
                                        />
                                        <InputTextOneLine
                                            label="Fecha Nacimiento"
                                            name="fechaNacimiento"
                                            value={form.fechaNacimiento}
                                            onChange={handleChange}
                                            disabled
                                            labelWidth="120px"
                                        />
                                        <InputTextOneLine
                                            label="Lugar Nacimiento"
                                            name="lugarNacimiento"
                                            value={form.lugarNacimiento}
                                            onChange={handleChange}
                                            disabled
                                            labelWidth="120px"
                                        />
                                    </div>

                                    {/* Columna Derecha */}
                                    <div className="space-y-3">
                                        <InputTextOneLine
                                            label="Domicilio Actual"
                                            name="domicilioActual"
                                            value={form.domicilioActual}
                                            onChange={handleChange}
                                            disabled
                                            labelWidth="120px"
                                        />
                                        <InputTextOneLine
                                            label="Edad"
                                            name="edad"
                                            value={form.edad}
                                            onChange={handleChange}
                                            disabled
                                            labelWidth="120px"
                                        />
                                        <InputTextOneLine
                                            label="Estado Civil"
                                            name="estadoCivil"
                                            value={form.estadoCivil}
                                            onChange={handleChange}
                                            disabled
                                            labelWidth="120px"
                                        />
                                        <InputTextOneLine
                                            label="Nivel Estudios"
                                            name="nivelEstudios"
                                            value={form.nivelEstudios}
                                            onChange={handleChange}
                                            disabled
                                            labelWidth="120px"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-3">Datos Laborales</h4>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <InputTextOneLine
                                        label="Ocupación"
                                        name="ocupacion"
                                        value={form.ocupacion}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Cargo Desempeñar"
                                        name="cargoDesempenar"
                                        value={form.cargoDesempenar}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*==========================Área Intelectual Section==========================*/}
                    <div>
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faHeartbeat} className="mr-2 text-[#233245]" />
                            <h2 className="text-lg font-semibold text-[#233245] uppercase tracking-wider">Áreas</h2>
                        </div>
                        {/* ===== SECCIÓN: ÁREA INTELECTUAL ===== */}
                        <div className="p-4" style={{ fontSize: "10px" }}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Columna Izquierda */}
                                <div className="space-y-4">
                                    {/* Área Intelectual */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                                        <h4 className="font-semibold">Área Intelectual</h4>
                                        <div className="space-y-2">
                                            <p className="">Test de inteligencia de barranquilla / test de Otis Intermedia</p>
                                            <InputTextArea
                                                rows={5}
                                                name="areaIntelectual"
                                                value={form.areaIntelectual}
                                                onChange={handleChange}
                                            />
                                            <div className="grid grid-cols-4 gap-2 ">
                                                <div className="border rounded p-3">

                                                    <InputCheckbox
                                                        label="PROMEDIO"
                                                        name="promedio"
                                                        checked={form.promedio}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="SUPERIOR"
                                                        name="superior"
                                                        checked={form.superior}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="N. INFERIOR"
                                                        name="nInferior"
                                                        checked={form.nInferior}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="ALTO"
                                                        name="alto"
                                                        checked={form.alto}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>

                                                <div className="border rounded p-3">
                                                    <InputCheckbox
                                                        label="FACILIDAD"
                                                        name="facilidad"
                                                        checked={form.facilidad}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="DIFICULTAD"
                                                        name="dificultad"
                                                        checked={form.dificultad}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>
                                                <div className="border rounded p-3 col-span-2">
                                                    <InputCheckbox
                                                        label="Y EN CAPACIDAD NUMÉRICA"
                                                        name="yNumerica"
                                                        checked={form.yNumerica}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="Y EN CAPACIDAD DE CÁLCULO"
                                                        name="yCalculo"
                                                        checked={form.yCalculo}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>
                                                <div className="border rounded p-3">
                                                    <InputCheckbox
                                                        label="P. SUPERIOR"
                                                        name="pSuperior"
                                                        checked={form.pSuperior}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="P. MEDIO"
                                                        name="pMedio"
                                                        checked={form.pMedio}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="P. BAJO"
                                                        name="pBajo"
                                                        checked={form.pBajo}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="BAJO"
                                                        name="bajo"
                                                        checked={form.bajo}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>
                                                <div className="border rounded p-3">
                                                    <InputCheckbox
                                                        label="P.N. ADECUADO"
                                                        name="pnAdecuado"
                                                        checked={form.pnAdecuado}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="N. ALTO"
                                                        name="nAlto"
                                                        checked={form.nAlto}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="N. BAJO"
                                                        name="nBajo"
                                                        checked={form.nBajo}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>
                                                <div className="border rounded p-3 col-span-2">
                                                    <InputCheckbox
                                                        label="ADECUADA RETENCIÓN DE DÍGITOS"
                                                        name="adecuadaR"
                                                        checked={form.adecuadaR}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="INADECUADA"
                                                        name="inadecuada"
                                                        checked={form.inadecuada}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Área de Organicidad */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                                        <h4 className="font-semibold">Área de Organicidad</h4>
                                        <div className="space-y-2">
                                            <p >Test de Bender para adultos / test de Benton Forma C</p>

                                            <InputTextArea
                                                rows={5}
                                                name="areaOrganicidad"
                                                value={form.areaOrganicidad}
                                                onChange={handleChange}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="border rounded p-3">
                                                    <InputCheckbox
                                                        label="ALTO MANEJO DE FACULTADES MENTALES"
                                                        name="poseeAltoManejo"
                                                        checked={form.poseeAltoManejo}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="ADECUADO MANEJO DE FACULTADES MENTALES"
                                                        name="pAdecuadoManejo"
                                                        checked={form.pAdecuadoManejo}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="BAJO MANEJO DE FACULTADES MENTALES"
                                                        name="pBajoManejo"
                                                        checked={form.pBajoManejo}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>
                                                <div className="gap-2 grid">
                                                    <div className="border rounded p-3">
                                                        <InputCheckbox
                                                            label="ORIENTADO EN TIEMPO, ESPACIO, Y PERSONA"
                                                            name="orientadoEnTiempo"
                                                            checked={form.orientadoEnTiempo}
                                                            onChange={handleCheckBoxChange}
                                                        />
                                                    </div>
                                                    <div className="border rounded p-3">
                                                        <InputCheckbox
                                                            label="NO SE EVIDENCIA DAÑO ORGÁNICO"
                                                            name="noSeEnvidencia"
                                                            checked={form.noSeEnvidencia}
                                                            onChange={handleCheckBoxChange}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha */}
                                <div className="space-y-4">
                                    {/* Área Personalidad */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                                        <h4 className="font-semibold">Área Personalidad</h4>
                                        <div className="space-y-2">
                                            <p>
                                                Test de la figura humana de Machover / MV Multifásico de Personalidad
                                            </p>
                                            <InputTextArea
                                                rows={5}
                                                name="areaPersonalidad"
                                                value={form.areaPersonalidad}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Área de Psicomotricidad */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                                        <h4 className="font-semibold">Área Psicomotricidad</h4>
                                        <div className="space-y-2">
                                            <p>Prueba de Laberintos de Weschler</p>
                                            <InputTextArea
                                                rows={5}
                                                name="areaPsicomotricidad"
                                                value={form.areaPsicomotricidad}
                                                onChange={handleChange}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="border rounded p-3">
                                                    <InputCheckbox
                                                        label="NIVEL ALTO"
                                                        name="nivelAltoPs"
                                                        checked={form.nivelAltoPs}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="NIVEL ADECUADO"
                                                        name="nivelAdecuadoPs"
                                                        checked={form.nivelAdecuadoPs}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="NIVEL BAJO"
                                                        name="nivelBajoPs"
                                                        checked={form.nivelBajoPs}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>
                                                <div className="border rounded p-3">
                                                    <InputCheckbox
                                                        label="FACILIDAD"
                                                        name="facilidadPs"
                                                        checked={form.facilidadPs}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                    <InputCheckbox
                                                        label="DIFICULTAD"
                                                        name="dificultadPs"
                                                        checked={form.dificultadPs}
                                                        onChange={handleCheckBoxChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recomendaciones */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3 mt-4">
                                <h4 className="font-semibold mb-3">Recomendaciones:</h4>
                                <InputTextArea
                                    rows={4}
                                    name="recomendaciones"
                                    value={form.recomendaciones}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Área Personalidad Section */}
                    <div className="pb-6">
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faChartLine} className="mr-2 text-[#233245]" />
                            <h2 className="text-lg font-semibold text-[#233245] uppercase tracking-wider">Área Personalidad</h2>
                        </div>
                        {/* ===== SECCIÓN: ÁREA PERSONALIDAD ===== */}
                        <div className="p-4" style={{ fontSize: "10px" }}>
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-3">Aprobó Test:</h4>

                                <div className="flex items-center space-x-4 mb-4">
                                    <InputsRadioGroup
                                        options={[{ value: "Si", label: "Sí" }, { value: "No", label: "No" }]}
                                        name="aproboTest"
                                        selectedValue={form.aproboTest}
                                        onChange={handleRadioButton}
                                        direction="horizontal"
                                    />
                                </div>

                                {/* Botones de acción */}
                                <div className="flex space-x-2 mt-4">
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-500 text-white px-4 py-2 rounded text-xs hover:bg-blue-600 flex items-center"
                                    >
                                        💾 Guardar
                                    </button>
                                    <button
                                        onClick={handlePrint}
                                        className="bg-green-500 text-white px-4 py-2 rounded text-xs hover:bg-green-600 flex items-center"
                                    >
                                        🖨️ Actualizar
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-2 rounded text-xs hover:bg-yellow-600 flex items-center"
                                    >
                                        🧹 Limpiar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}