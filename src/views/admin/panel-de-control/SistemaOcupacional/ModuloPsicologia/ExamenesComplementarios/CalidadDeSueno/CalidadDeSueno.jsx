import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine } from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerCalidadDeSueno";
import ParteI from "./TabsCalidadDeSueno/ParteI";
import ParteII from "./TabsCalidadDeSueno/ParteII";
import ParteIII from "./TabsCalidadDeSueno/ParteIII";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "calidad_sueño";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// Por el volumen de campos (~20 preguntas en 3 pestañas vía RadioTable/InputsRadioGroup), el
// resaltado/revertido individual solo se aplica a los campos "core"; el resto solo respeta el
// bloqueo general (camposDeshabilitados) vía la nueva prop `disabled` en ParteI/II/III.
const CAMPOS_EDITABLES = [
    "fechaExam",
    "user_medicoFirma",
    "nombre_medico",
];

export default function CalidadDeSueno() {
    const today = getToday();
    const [activeTab, setActiveTab] = useState(0);
    const { token, userlogued, selectedSede, datosFooter, userDNI, userName } = useSessionData();

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

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
        tieneRegistro: false,

        // Auditoría
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
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

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
    // el id y se revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

    const tabs = [
        { id: 0, name: "Examen parte I", icon: faListCheck, component: ParteI },
        { id: 1, name: "Examen parte II", icon: faListCheck, component: ParteII },
        { id: 2, name: "Examen parte III", icon: faListCheck, component: ParteIII },
    ];

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    // ===== Búsqueda con botón =====
    const executeSearch = () => {
        handleClearnotO();
        VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    };

    // ===== Búsqueda con enter =====
    const handleSearch = (e) => {
        if (!e || e.key === "Enter") {
            executeSearch();
        }
    };

    const hayRegistroCargado = Boolean(form.nombres);

    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.tieneRegistro);
        if (hayDatosCargados && value !== form.norden) {
            setForm({ ...initialFormState, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter, selectedSede);
        });
    };

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    const ActiveComponent = tabs[activeTab]?.component || (() => null);

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
                <RegistroEstadoPill
                    tieneRegistro={form.tieneRegistro}
                    className={hayRegistroCargado ? "" : "invisible"}
                />
                {hayRegistroCargado && form.tieneRegistro && !edicionHabilitada && (
                    <button
                        type="button"
                        onClick={habilitarEdicion}
                        className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Habilitar edición
                    </button>
                )}
            </div>

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form?.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                        disabled={hayRegistroCargado}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="xl:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha"
                    name="fechaExam"
                    type="date"
                    value={form?.fechaExam}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fechaExam")}
                    onRevert={() => revertField("fechaExam")}
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
                    disabled={camposDeshabilitados}
                />
            </div>

            <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isMedicoEdited}
                    onRevert={revertMedico}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
            {hayRegistroCargado && (
                <AuditoriaRegistro
                    mostrarEdicion={form.tieneRegistro}
                    fechaCreacion={auditoria.fechaCreacion}
                    fechaEdicion={auditoria.fechaActualizacion}
                    usuarioRegistro={auditoria.usuarioRegistro}
                    usuarioEdicion={auditoria.usuarioActualizacion}
                />
            )}

            {/* ===== BOTONES DE ACCIÓN ===== */}
            <BotonesForm
                form={form}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
                onNordenChange={handlePrintNordenChange}
                handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClear}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    );
}
