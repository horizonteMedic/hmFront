import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine } from "../../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerCalidadDeSueno";
import ParteI from "./TabsCalidadDeSueno/ParteI";
import ParteII from "./TabsCalidadDeSueno/ParteII";
import ParteIII from "./TabsCalidadDeSueno/ParteIII";

const today = getToday();
const tabla = "";

export default function CalidadDeSueno() {
    const [activeTab, setActiveTab] = useState(0);
    const { token, userlogued, selectedSede, datosFooter, userDNI } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fechaExam: today,
        nombreExamen: "",
        // Datos personales
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        empresa: "",
        contrata: "",
        puestoPostula: "",
        puestoActual: "",
        gradoInstruccion: "",
        dniUsuario: userDNI,

        // ====================== PARTE I ======================
        horaAcostarse: "",
        tiempoDormir: "",
        horaLevantarse: "",
        horasDormidas: "",

        // ====================== PARTE II ======================
        probPrimeraHora: "",
        probDespertoNoche: "",
        probLevantarseBano: "",
        probNoRespirarBien: "",
        probTosiaRonca: "",
        probSentiaFrio: "",
        probSentiaCalor: "",
        probPesadillas: "",
        probDolores: "",

        // ====================== PARTE III ======================
        medicinasDormirFrecuencia: "",
        somnolenciaSocialFrecuencia: "",
        despertaNochePromedio: "",
        calidadSuenoGeneral: "",
        animoDificultaActividad: "",
        comparteHabitacion: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleChangeSimple,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "calidad_de_sueno" });

    const tabs = [
        { id: 0, name: "Examen parte I", icon: faListCheck, component: ParteI },
        { id: 1, name: "Examen parte II", icon: faListCheck, component: ParteII },
        { id: 2, name: "Examen parte III", icon: faListCheck, component: ParteIII },
    ];

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

    const ActiveComponent = tabs[activeTab]?.component || (() => null);

    return (
        <div className="mx-auto bg-white">
            <div className="flex h-full">
                {/* Contenido principal - ancho completo */}
                <div className="w-full">
                    <div className="w-full">
                        {/* Datos del trabajador */}
                        <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                value={form?.norden}
                                onChange={handleChangeNumber}
                                onKeyUp={handleSearch}
                            />
                            <InputTextOneLine
                                label="Fecha"
                                name="fechaExam"
                                type="date"
                                value={form?.fechaExam}
                                onChange={handleChange}
                            />
                            <InputTextOneLine
                                label="Tipo de Examen"
                                name="nombreExamen"
                                value={form?.nombreExamen}
                                disabled
                            />
                        </section>

                        {/* Información del trabajador */}
                        <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 gap-4">
                            <h3 className="text-lg font-semibold mb-3">Datos del Paciente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <InputTextOneLine label="Nombres y Apellidos" name="nombres" value={form?.nombres} disabled />
                                <div className="grid grid-cols-3 gap-4">
                                    <InputTextOneLine label="DNI" name="dni" value={form?.dni} disabled />
                                    <InputTextOneLine label="Edad" name="edad" value={form?.edad} disabled />
                                    <InputTextOneLine label="Sexo" name="sexo" value={form?.sexo} disabled />
                                </div>
                                <InputTextOneLine label="Empresa" name="empresa" value={form?.empresa} disabled />
                                <InputTextOneLine label="Contrata" name="contrata" value={form?.contrata} disabled />
                                <InputTextOneLine label="Area de Trabajo" name="puestoPostula" value={form?.puestoPostula} disabled />
                                <InputTextOneLine label="Puesto de Trabajo" name="puestoActual" value={form?.puestoActual} disabled />
                                <InputTextOneLine label="Grado de Instruccion" name="gradoInstruccion" value={form?.gradoInstruccion} disabled />
                            </div>
                        </section>

                        {/* Navegación de pestañas */}
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

                        {/* Contenido de la pestaña activa */}
                        <div className="px-4 pt-4">
                            <ActiveComponent
                                form={form}
                                setForm={setForm}
                                handleChange={handleChange}
                                handleChangeNumber={handleChangeNumber}
                                handleClear={handleClear}
                                handleSave={handleSave}
                                handlePrint={handlePrint}
                                handleRadioButton={handleRadioButton}
                                handleChangeSimple={handleChangeSimple}
                            />
                        </div>

                        {/* Acciones */}
                        <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-4">
                            <div className="flex gap-4">
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
        </div>
    );
}
