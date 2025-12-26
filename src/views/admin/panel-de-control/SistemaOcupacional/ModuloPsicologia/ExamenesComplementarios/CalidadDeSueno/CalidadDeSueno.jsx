import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine } from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerCalidadDeSueno";
import ParteI from "./TabsCalidadDeSueno/ParteI";
import ParteII from "./TabsCalidadDeSueno/ParteII";
import ParteIII from "./TabsCalidadDeSueno/ParteIII";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";

const tabla = "calidad_sueño";

export default function CalidadDeSueno() {
    const today = getToday();
    const [activeTab, setActiveTab] = useState(0);
    const { token, userlogued, selectedSede, datosFooter, userDNI } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fechaExam: today,
        nombreExamen: "",

        // Datos personales
        dni: "",
        nombres: "",
        apellidos: "",
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
        probOtrasRazones: "",

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
        handleChangeNumberDecimals,
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
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form?.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha"
                    name="fechaExam"
                    type="date"
                    value={form?.fechaExam}
                    onChange={handleChange}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    value={form?.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

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

            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div>
    );
}
