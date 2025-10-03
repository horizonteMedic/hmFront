import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faStethoscope,
    faChartLine,
    faCheck,
    faBroom,
    faPrint,
} from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea
} from "../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../hooks/useForm";
import ExamenMedico from "./ExamenMedico/ExamenMedico";
import Antecedentes from "./Antecedentes/Antecedentes";
import PruebasComplementarias from "./PruebasComplementarias/PruebasComplementarias";

export default function FichaConduccionVehiculos() {
    const [activeTab, setActiveTab] = useState(0);
    
    const initialFormState = {
        // Datos personales
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        fecha: "",
        experienciaAnios: "",
        areaTrabajo: "",
        empresa: "",
        primeraActitud: false,
        revalidacion: false,
        // Agudeza Visual
        vcOD: "",
        vlOD: "",
        vcOI: "",
        vlOI: "",
        vcCorregidaOD: "",
        vlCorregidaOD: "",
        vclrs: "",
        vb: "",
        rp: "",
        vcCorregidaOI: "",
        vlCorregidaOI: "",
        enfermedadesOculares: "",
        // Medidas Generales
        fc: "",
        fr: "",
        pa: "",
        // Examen Médico - Medidas Antropométricas y Signos Vitales
        frecuenciaCardiaca: "",
        frecuenciaRespiratoria: "",
        presionArterial: "",
        talla: "",
        peso: "",
        imc: "",
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
        // Antecedentes - Columna Izquierda
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
        // Conclusión y Comentarios
        aptoDesde: "",
        aptoHasta: "",
        conclusion: "Apto", // Apto, Observado, No Apto, Apto con Restricción
        observacionesRecomendaciones: "",
        nombreMedicoColegiatura: "",
        // Recomendaciones
        sobrepesoDietaHipocalorica: false,
        corregirAgudezaVisual: false,
        corregirAgudezaVisualTotal: false,
        obesidadDietaHipocalorica: false,
        usoLentesCorrectoresLectura: false,
        corregirAgudezaLectura: false,
        // Imprimir
        nordenImprimir: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButtonBoolean,
        handleCheckBoxChange,
        handleClear,
    } = useForm(initialFormState, { storageKey: "ficha_conduccion_form" });

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

    return (
        <div className="mx-auto bg-white overflow-hidden">
            <div className="flex h-full">
                {/* Contenido principal - 80% */}
                <div className="w-4/5">
                    <div className="w-full">
                        {/* Datos del trabajador */}
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
                                <div className="grid grid-cols-4 gap-2">
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
                                    <InputTextOneLine
                                        label="Sexo"
                                        name="sexo"
                                        value={form?.sexo}
                                        disabled
                                    />
                                     <InputTextOneLine
                                        label="T. Experiencia"
                                        name="experienciaAnios"
                                        value={form?.experienciaAnios}
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
                                    className={`flex-1 px-4 py-3 uppercase tracking-wider text=[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
                                        activeTab === tab.id
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Apto para conducción de vehículos:
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Desde:</label>
                                                <InputTextOneLine
                                                    name="aptoDesde"
                                                    type="date"
                                                    value={form?.aptoDesde || ""}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Hasta:</label>
                                                <InputTextOneLine
                                                    name="aptoHasta"
                                                    type="date"
                                                    value={form?.aptoHasta || ""}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Conclusiones:
                                        </label>
                                        <div className="space-y-2">
                                            {["Apto", "Observado", "No Apto", "Apto con Restricción"].map((option) => (
                                                <label key={option} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="conclusion"
                                                        value={option}
                                                        checked={form?.conclusion === option}
                                                        onChange={handleChange}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Central - Observaciones */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Observaciones y Recomendaciones:
                                        </label>
                                        <InputTextArea
                                            name="observacionesRecomendaciones"
                                            value={form?.observacionesRecomendaciones || ""}
                                            onChange={handleChange}
                                            rows={6}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre y Apellidos del Médico - N° de Colegiatura:
                                        </label>
                                        <InputTextOneLine
                                            name="nombreMedicoColegiatura"
                                            value={form?.nombreMedicoColegiatura || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Columna Derecha - Recomendaciones */}
                                <div className="space-y-2">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Recomendaciones:</h5>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="sobrepesoDietaHipocalorica"
                                                checked={form?.sobrepesoDietaHipocalorica || false}
                                                onChange={handleCheckBoxChange}
                                                className="mr-2"
                                            />
                                            <span className="text-xs">Sobrepeso.Dieta Hipocalórica y ejer.</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="corregirAgudezaVisual"
                                                checked={form?.corregirAgudezaVisual || false}
                                                onChange={handleCheckBoxChange}
                                                className="mr-2"
                                            />
                                            <span className="text-xs">Corregir Agudeza Visual</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="corregirAgudezaVisualTotal"
                                                checked={form?.corregirAgudezaVisualTotal || false}
                                                onChange={handleCheckBoxChange}
                                                className="mr-2"
                                            />
                                            <span className="text-xs">Corregir Agudeza Visual Total</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="obesidadDietaHipocalorica"
                                                checked={form?.obesidadDietaHipocalorica || false}
                                                onChange={handleCheckBoxChange}
                                                className="mr-2"
                                            />
                                            <span className="text-xs">Obesidad I.Dieta Hipocalórica y ejer.</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="usoLentesCorrectoresLectura"
                                                checked={form?.usoLentesCorrectoresLectura || false}
                                                onChange={handleCheckBoxChange}
                                                className="mr-2"
                                            />
                                            <span className="text-xs">Uso de Lentes Correctores lectura ce...</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="corregirAgudezaLectura"
                                                checked={form?.corregirAgudezaLectura || false}
                                                onChange={handleCheckBoxChange}
                                                className="mr-2"
                                            />
                                            <span className="text-xs">Corregir Agudeza para lectura ce...</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                    Agregar/Actualizar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faBroom} />
                                    Limpiar
                                </button>
                                <div className="flex gap-2">
                                    <InputTextOneLine
                                        name="nordenImprimir"
                                        value={form?.nordenImprimir || ""}
                                        onChange={handleChange}
                                        placeholder="N° Orden"
                                        className="w-32"
                                    />
                                    <button
                                        type="button"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faPrint} />
                                        Imprimir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel lateral de Agudeza Visual - 20% */}
                <div className="w-1/5">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 m-4 flex-1 flex flex-col">
                        <h4 className="font-semibold text-gray-800 mb-3">Agudeza Visual</h4>

                        {/* Sin Corregir */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2">Sin Corregir</h5>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <div className="font-semibold mb-2">O.D</div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] min-w-[30px]">V.C.:</span>
                                            <InputTextOneLine name="vcOD" value={form?.vcOD} disabled />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] min-w-[30px]">V.L.:</span>
                                            <InputTextOneLine name="vlOD" value={form?.vlOD} disabled />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold mb-2">O.I</div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] min-w-[30px]">V.C.:</span>
                                            <InputTextOneLine name="vcOI" value={form?.vcOI} disabled />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] min-w-[30px]">V.L.:</span>
                                            <InputTextOneLine name="vlOI" value={form?.vlOI} disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Corregida */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2">Corregida</h5>

                            {/* Fila OD y OI */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] min-w-[35px]">V.C.</span>
                                        <InputTextOneLine
                                            name="vcCorregidaOD"
                                            value={form?.vcCorregidaOD}
                                            disabled
                                            className="flex-1 w-full"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] min-w-[35px]">V.L.</span>
                                        <InputTextOneLine
                                            name="vlCorregidaOD"
                                            value={form?.vlCorregidaOD}
                                            disabled
                                            className="flex-1 w-full"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] min-w-[35px]">V.C.</span>
                                        <InputTextOneLine
                                            name="vcCorregidaOI"
                                            value={form?.vcCorregidaOI}
                                            disabled
                                            className="flex-1 w-full"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] min-w-[35px]">V.L.</span>
                                        <InputTextOneLine
                                            name="vlCorregidaOI"
                                            value={form?.vlCorregidaOI}
                                            disabled
                                            className="flex-1 w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fila extra (ancho completo) */}
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] min-w-[45px]">V.Clrs</span>
                                    <InputTextOneLine
                                        name="vclrs"
                                        value={form?.vclrs}
                                        disabled
                                        className="flex-1 w-full"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] min-w-[45px]">V.B.</span>
                                    <InputTextOneLine
                                        name="vb"
                                        value={form?.vb}
                                        disabled
                                        className="flex-1 w-full"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] min-w-[45px]">R.P.</span>
                                    <InputTextOneLine
                                        name="rp"
                                        value={form?.rp}
                                        disabled
                                        className="flex-1 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Enfermedades Oculares */}
                        <div className="mb-4 flex-1">
                            <h5 className="font-semibold text-gray-700 mb-2">Enfermedades Oculares</h5>
                            <InputTextArea rows={5} name="enfermedadesOculares" value={form?.enfermedadesOculares} onChange={handleChange} disabled />
                        </div>

                        {/* Medidas Generales */}
                        <div className="mt-4">
                            <h5 className="font-semibold text-gray-700 mb-3">Medidas Generales</h5>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="font-semibold text-gray-700 min-w-[30px]">FC:</label>
                                    <InputTextOneLine name="fc" value={form?.fc} disabled className="flex-1" />
                                    <span className="text-gray-500 text-xs">x min</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="font-semibold text-gray-700 min-w-[30px]">FR:</label>
                                    <InputTextOneLine name="fr" value={form?.fr} disabled className="flex-1" />
                                    <span className="text-gray-500 text-xs">x min</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="font-semibold text-gray-700 min-w-[30px]">PA:</label>
                                    <InputTextOneLine name="pa" value={form?.pa} disabled className="flex-1" />
                                    <span className="text-gray-500 text-xs">mmHg</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="font-semibold text-gray-700 min-w-[30px]">TALLA:</label>
                                    <InputTextOneLine name="talla" value={form?.talla} disabled className="flex-1" />
                                    <span className="text-gray-500 text-xs">m</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="font-semibold text-gray-700 min-w-[30px]">PESO:</label>
                                    <InputTextOneLine name="peso" value={form?.peso} disabled className="flex-1" />
                                    <span className="text-gray-500 text-xs">kg</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="font-semibold text-gray-700 min-w-[30px]">IMC:</label>
                                    <InputTextOneLine name="imc" value={form?.imc} disabled className="flex-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


