import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual, getTodayPlusOneYear } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./ControllerAptitudPoderosa";

const tabla = "aptitud_altura_poderosa";
const today = getToday();

// Opciones de la sección "Conclusiones": cada opción agrega su texto a Observaciones al
// seleccionarla (no reemplaza lo ya escrito; "NINGUNO" reinicia el campo).
const OPCIONES_CONCLUSIONES = [
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
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "fechaHasta",
    "apto",
    "observaciones",
    "user_medicoFirma",
    "nombre_medico",
];

const CertificadoAptitudPoderosa = () => {
    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        nombreExamen: "",
        fechaExamen: today,
        fechaHasta: getTodayPlusOneYear(),

        // Datos personales
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

        // Aptitud
        apto: "",
        conclusiones: "",
        observaciones: "",

        // ===== Agudeza Visual (Triaje / Oftalmología, solo lectura) =====
        visionCercaSincorregirOd_v_cerca_s_od: "",
        visionLejosSincorregirOd_v_lejos_s_od: "",
        visionCercaSincorregirOi_v_cerca_s_oi: "",
        visionLejosSincorregirOi_v_lejos_s_oi: "",
        oftalodccmologia_odcc: "",
        odlcOftalmologia_odlc: "",
        oiccoftalmologia_oicc: "",
        oilcOftalmologia_oilc: "",
        vcOftalmologia_vc: "",
        vbOftalmologia_vb: "",
        rpOftalmologia_rp: "",
        enfermedadesOcularesOftalmo_e_oculares: "",

        // ===== Laboratorio (solo lectura) =====
        hemoglobina_txthemoglobina: "",
        vsgLabClinico_txtvsg: "",
        glucosaLabClinico_txtglucosabio: "",
        creatininaLabClinico_txtcreatininabio: "",

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
        handleChangeNumber,
        handleChangeSimple,
        handleChange,
        handleClearnotO,
        handleClear,
        handleRadioButton,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "Certificado_Aptitud_Poderosa_form" });

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

    // Selector rápido de conclusiones: agrega el texto elegido a Observaciones (no lo reemplaza).
    const handleRadioButtonConclusiones = (e) => {
        const { name, value } = e.target;
        const selectedOption = OPCIONES_CONCLUSIONES.find((opt) => opt.value === value);

        if (value === "Check15") {
            setForm((f) => ({ ...f, [name]: value, observaciones: "- NINGUNO" }));
            return;
        }
        if (!selectedOption) return;

        const textoAgregar = `- ${selectedOption.label}`;
        setForm((f) => {
            let nuevasObservaciones = f.observaciones || "";
            if (nuevasObservaciones.includes("- NINGUNO")) {
                nuevasObservaciones = nuevasObservaciones.replace("- NINGUNO", "").trim();
            }
            nuevasObservaciones = nuevasObservaciones
                ? `${nuevasObservaciones}\n${textoAgregar}`
                : textoAgregar;
            return { ...f, [name]: value, observaciones: nuevasObservaciones };
        });
    };

    // ===== Búsqueda con boton =====
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

    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.dni || form.tieneRegistro);
        if (hayDatosCargados && value !== form.norden) {
            setForm({ ...initialFormState, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    // ===== Impresión =====
    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter, selectedSede);
        });
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            {hayRegistroCargado && (
                <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
                    <RegistroEstadoPill tieneRegistro={form.tieneRegistro} />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-3 items-start">
                {/* ===== COLUMNA PRINCIPAL ===== */}
                <div className="w-full flex-1 space-y-3">
                    {/* ===== SECCIÓN: INFORMACIÓN GENERAL ===== */}
                    <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                        <div className="w-full flex gap-x-3">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                value={form.norden}
                                onKeyUp={handleSearch}
                                onChange={handleChangeNumber}
                                disabled={nordenDisabled}
                                labelWidth="120px"
                                className="flex-1"
                            />
                            <SearchButton onClick={executeSearch} className="lg:hidden" />
                        </div>
                        <InputTextOneLine
                            label="Tipo de Examen"
                            name="nombreExamen"
                            disabled
                            value={form.nombreExamen}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Hora"
                            labelWidth="120px"
                            disabled
                            value={hora}
                            className="font-bold"
                        />
                    </SectionFieldset>

                    {/* ===== SECCIÓN: DATOS LABORALES ===== */}
                    <DatosPersonalesLaborales form={form} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 items-start">
                        <div className="space-y-3">
                            <SectionFieldset legend="Aptitud" className="space-y-3">
                                <InputsRadioGroup
                                    vertical
                                    disabled={camposDeshabilitados}
                                    name="apto"
                                    value={form.apto}
                                    className="py-2"
                                    onChange={handleRadioButton}
                                    options={[
                                        { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                        { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" },
                                    ]}
                                    edited={isFieldEdited("apto")}
                                    onRevert={() => revertField("apto")}
                                />
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <InputTextOneLine
                                        label="Fecha"
                                        name="fechaExamen"
                                        type="date"
                                        value={form.fechaExamen}
                                        labelWidth="90px"
                                        onChange={handleChangeSimple}
                                        disabled={camposDeshabilitados}
                                        edited={isFieldEdited("fechaExamen")}
                                        onRevert={() => revertField("fechaExamen")}
                                    />
                                    <InputTextOneLine
                                        label="Fecha Venc."
                                        name="fechaHasta"
                                        type="date"
                                        value={form.fechaHasta}
                                        labelWidth="90px"
                                        onChange={handleChangeSimple}
                                        disabled={camposDeshabilitados}
                                        edited={isFieldEdited("fechaHasta")}
                                        onRevert={() => revertField("fechaHasta")}
                                    />
                                </div>
                            </SectionFieldset>

                            <SectionFieldset legend="Observaciones">
                                <InputTextArea
                                    label="Observaciones"
                                    name="observaciones"
                                    value={form.observaciones}
                                    onChange={handleChange}
                                    rows={5}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited("observaciones")}
                                    onRevert={() => revertField("observaciones")}
                                />
                            </SectionFieldset>

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
                        </div>

                        <SectionFieldset legend="Conclusiones (agrega texto a Observaciones)">
                            <InputsRadioGroup
                                vertical
                                name="conclusiones"
                                value={form.conclusiones}
                                className="py-2"
                                onChange={handleRadioButtonConclusiones}
                                disabled={camposDeshabilitados}
                                options={OPCIONES_CONCLUSIONES}
                            />
                        </SectionFieldset>
                    </div>
                </div>

                {/* ===== BARRA LATERAL: AGUDEZA VISUAL Y LABORATORIO (solo lectura) ===== */}
                <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-3">
                    <SectionFieldset legend="Agudeza Visual">
                        <div className="space-y-4">
                            <div>
                                <div className="font-semibold mb-2 text-center text-sm">Sin Corregir</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <div className="font-semibold text-center text-xs">O.D</div>
                                        <InputTextOneLine label="V.C." name="visionCercaSincorregirOd_v_cerca_s_od" value={form.visionCercaSincorregirOd_v_cerca_s_od} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="visionLejosSincorregirOd_v_lejos_s_od" value={form.visionLejosSincorregirOd_v_lejos_s_od} disabled labelWidth="35px" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="font-semibold text-center text-xs">O.I</div>
                                        <InputTextOneLine label="V.C." name="visionCercaSincorregirOi_v_cerca_s_oi" value={form.visionCercaSincorregirOi_v_cerca_s_oi} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="visionLejosSincorregirOi_v_lejos_s_oi" value={form.visionLejosSincorregirOi_v_lejos_s_oi} disabled labelWidth="35px" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold mb-2 text-center text-sm">Corregida</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <div className="font-semibold text-center text-xs">O.D</div>
                                        <InputTextOneLine label="V.C." name="oftalodccmologia_odcc" value={form.oftalodccmologia_odcc} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="odlcOftalmologia_odlc" value={form.odlcOftalmologia_odlc} disabled labelWidth="35px" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="font-semibold text-center text-xs">O.I</div>
                                        <InputTextOneLine label="V.C." name="oiccoftalmologia_oicc" value={form.oiccoftalmologia_oicc} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="oilcOftalmologia_oilc" value={form.oilcOftalmologia_oilc} disabled labelWidth="35px" />
                                    </div>
                                </div>
                                <div className="mt-3 space-y-2">
                                    <InputTextOneLine label="V.Clrs" name="vcOftalmologia_vc" value={form.vcOftalmologia_vc} disabled labelWidth="50px" />
                                    <InputTextOneLine label="V.B." name="vbOftalmologia_vb" value={form.vbOftalmologia_vb} disabled labelWidth="50px" />
                                    <InputTextOneLine label="R.P." name="rpOftalmologia_rp" value={form.rpOftalmologia_rp} disabled labelWidth="50px" />
                                </div>
                            </div>
                            <InputTextArea label="Enfermedades Oculares" name="enfermedadesOcularesOftalmo_e_oculares" rows={5} value={form.enfermedadesOcularesOftalmo_e_oculares} disabled />
                        </div>
                    </SectionFieldset>

                    <SectionFieldset legend="Laboratorio">
                        <div className="space-y-2">
                            <InputTextOneLine label="Hemoglobina" name="hemoglobina_txthemoglobina" value={form.hemoglobina_txthemoglobina} disabled labelWidth="90px" />
                            <InputTextOneLine label="V.S.G" name="vsgLabClinico_txtvsg" value={form.vsgLabClinico_txtvsg} disabled labelWidth="90px" />
                            <InputTextOneLine label="Glucosa" name="glucosaLabClinico_txtglucosabio" value={form.glucosaLabClinico_txtglucosabio} disabled labelWidth="90px" />
                            <InputTextOneLine label="Creatinina" name="creatininaLabClinico_txtcreatininabio" value={form.creatininaLabClinico_txtcreatininabio} disabled labelWidth="90px" />
                        </div>
                    </SectionFieldset>
                </aside>
            </div>

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
    )
}

export default CertificadoAptitudPoderosa
