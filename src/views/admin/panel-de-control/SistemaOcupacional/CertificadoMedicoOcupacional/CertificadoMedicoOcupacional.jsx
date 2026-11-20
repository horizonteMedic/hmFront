import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR, Valores } from "./ControllerCMO";

const tabla = "certificado_aptitud_medico_resumen";
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// La aptitud no se edita aquí: viene de la Ficha de Aptitud.
const CAMPOS_EDITABLES = [
    "fechaDesde",
    "fechahasta",
    "conclusiones",
    "user_medicoFirma",
    "nombre_medico",
];

// Plantillas de "Exámenes" que rellenan las conclusiones (el texto de cada una está en Valores).
const PLANTILLAS = [
    { label: "1. MARSA - OPERATIVA, SUPERVISOR, AYUDANTE", value: "Check1" },
    { label: "2. MARSA - CONDUCTOR u OPERADOR MAQUINARIA", value: "Check2" },
    { label: "3. MARSA - RETIRO", value: "Check3" },
    { label: "4. RETIRO BOROO", value: "Check4" },
    { label: "5. BOROO - PSICONSENSOMETRICO Y ALTURA Perfil Lipidico.", value: "Check5" },
    { label: "6. PROTOCOLO PODEROSA RETIRO", value: "Check6" },
    { label: "7. PROTOCOLO PODEROSA", value: "Check7" },
];

// Arma las conclusiones: línea de triaje (si hay peso y talla) + la plantilla elegida, con el
// grupo sanguíneo y factor del paciente (o sin esa mención si no lo tiene).
function generarConclusiones(form, valores, textoSeleccionado) {
    let conclusiones = "";

    // ===== 1. TRIAJE =====
    const { pesoTriaje, tallaTriaje } = form;

    if (pesoTriaje && tallaTriaje) {
        conclusiones += `- TRIAJE ( PESO: ${pesoTriaje} KG ; TALLA: ${tallaTriaje} CM )\n`;
    }

    // ===== 2. PLANTILLA SEGÚN LA OPCIÓN ELEGIDA =====
    let plantillaTexto = "";

    if (typeof textoSeleccionado === "string" && Object.prototype.hasOwnProperty.call(valores, textoSeleccionado)) {
        plantillaTexto = valores[textoSeleccionado];
    } else {
        // buscar si es exactamente igual a algún Valores[clave]
        const keyMatch = Object.keys(valores).find(k => valores[k] === textoSeleccionado);
        if (keyMatch) {
            plantillaTexto = valores[keyMatch];
        } else {
            // sino asumimos que textoSeleccionado es ya el texto de plantilla
            plantillaTexto = textoSeleccionado || "";
        }
    }

    const plantillaLineas = plantillaTexto
        ? plantillaTexto.split("\n").map(l => l.trim()).filter(Boolean)
        : [];

    const grupoFactor = form.grupoFactor && form.grupoFactor !== "N/A" ? form.grupoFactor : null;

    const lineasProcesadas = plantillaLineas.map(linea => {
        if (linea.includes("{grupoFactor}")) {
            if (grupoFactor) {
                return linea.replace("{grupoFactor}", grupoFactor);
            } else {
                return linea.replace(/,?\s*Grupo Sangu[ií]neo y Factor\s*\(\{grupoFactor\}\)/i, "").trim();
            }
        }
        return linea;
    });

    conclusiones += lineasProcesadas.join("\n");
    return conclusiones.trim();
}

export default function CertificadoMedicoOcupacional() {
    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        nombreExamen: "",

        // Datos personales
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        // Aptitud (solo lectura) y vigencia
        apto: "APTO",
        // Por defecto la vigencia empieza igual que la fecha: así quedaba siempre tras buscar la orden.
        fechaDesde: today,
        fechahasta: today,
        conclusiones: "",

        // Triaje / Laboratorio (solo lectura: alimentan las conclusiones)
        pesoTriaje: "",
        tallaTriaje: "",
        grupoFactor: "",
        hemoglobina_txthemoglobina: "",
        vsgLabClinico_txtvsg: "",
        glucosaLabClinico_txtglucosabio: "",
        leucocitoSematologiaLabClinico: "",
        creatininaLabClinico_txtcreatininabio: "",

        // Agudeza visual (solo lectura)
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
        enfermedadesOcularesOftalmologia_e_oculares: "",

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
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "Certificado_Medico_Ocupacional_form" });

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

    // ===== Guardar / Editar =====
    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
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

    // ===== Plantillas de conclusiones =====
    // Una plantilla aparece marcada mientras las conclusiones coincidan con lo que ella genera
    // (al editar el texto a mano deja de estar marcada).
    const plantillaActiva =
        PLANTILLAS.find((p) => generarConclusiones(form, Valores, p.value) === form.conclusiones)?.value ?? "";

    const handleSeleccionarPlantilla = (_e, value) => {
        setForm((prev) => ({ ...prev, conclusiones: generarConclusiones(prev, Valores, value) }));
    };

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[95%] mx-auto pb-6">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            {/* ===== SECCIÓN: N° ORDEN ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={nordenDisabled}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Hora"
                    name="hora"
                    value={hora}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS PERSONALES Y LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3 items-start">
                {/* ===== COLUMNA PRINCIPAL ===== */}
                <div className="space-y-3">
                    <SectionFieldset legend="Aptitud" className="space-y-3">
                        {/* La aptitud viene de la Ficha de Aptitud: no se modifica desde aquí */}
                        <InputsRadioGroup
                            disabled
                            vertical
                            name="apto"
                            value={form.apto}
                            className="py-2"
                            onChange={() => { }}
                            options={[
                                { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                { label: "APTO con RESTRICCION (para el puesto en el que trabaja o postula)", value: "APTOCONRESTRICCION" },
                                { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" },
                                { label: "CON OBSERVACION", value: "OBSERVACION" },
                                { label: "EVALUADO", value: "EVALUADO" },
                            ]}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                            <InputTextOneLine
                                label="Fecha"
                                name="fechaDesde"
                                type="date"
                                value={form.fechaDesde}
                                onChange={handleChangeSimple}
                                disabled={camposDeshabilitados}
                                labelWidth="90px"
                                edited={isFieldEdited("fechaDesde")}
                                onRevert={() => revertField("fechaDesde")}
                            />
                            <InputTextOneLine
                                label="Fecha Venc."
                                name="fechahasta"
                                type="date"
                                value={form.fechahasta}
                                onChange={handleChangeSimple}
                                disabled={camposDeshabilitados}
                                labelWidth="90px"
                                edited={isFieldEdited("fechahasta")}
                                onRevert={() => revertField("fechahasta")}
                            />
                        </div>
                    </SectionFieldset>

                    <SectionFieldset legend="Exámenes (Conclusiones)" className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <InputsRadioGroup
                            vertical
                            name="plantillaConclusiones"
                            value={plantillaActiva}
                            className="py-2"
                            disabled={camposDeshabilitados}
                            onChange={handleSeleccionarPlantilla}
                            options={PLANTILLAS}
                        />
                        <InputTextArea
                            label="Exámenes"
                            name="conclusiones"
                            value={form.conclusiones}
                            onChange={handleChange}
                            rows={16}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("conclusiones")}
                            onRevert={() => revertField("conclusiones")}
                        />
                    </SectionFieldset>

                    <SectionFieldset legend="Asignación de Médico">
                        <EmpleadoComboBox
                            value={form.nombre_medico}
                            form={form}
                            onChange={handleChangeSimple}
                            disabled={camposDeshabilitados}
                            edited={isMedicoEdited}
                            onRevert={revertMedico}
                        />
                    </SectionFieldset>
                </div>

                {/* ===== COLUMNA LATERAL (solo lectura: datos de otros exámenes) ===== */}
                <div className="space-y-3">
                    <SectionFieldset legend="Agudeza Visual - Sin Corregir" className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="font-semibold text-center">O.D</div>
                            <InputTextOneLine label="V.C." name="visionCercaSincorregirOd_v_cerca_s_od" value={form.visionCercaSincorregirOd_v_cerca_s_od} disabled labelWidth="35px" />
                            <InputTextOneLine label="V.L." name="visionLejosSincorregirOd_v_lejos_s_od" value={form.visionLejosSincorregirOd_v_lejos_s_od} disabled labelWidth="35px" />
                        </div>
                        <div className="space-y-3">
                            <div className="font-semibold text-center">O.I</div>
                            <InputTextOneLine label="V.C." name="visionCercaSincorregirOi_v_cerca_s_oi" value={form.visionCercaSincorregirOi_v_cerca_s_oi} disabled labelWidth="35px" />
                            <InputTextOneLine label="V.L." name="visionLejosSincorregirOi_v_lejos_s_oi" value={form.visionLejosSincorregirOi_v_lejos_s_oi} disabled labelWidth="35px" />
                        </div>
                    </SectionFieldset>

                    <SectionFieldset legend="Agudeza Visual - Corregida" className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="font-semibold text-center">O.D</div>
                                <InputTextOneLine label="V.C." name="oftalodccmologia_odcc" value={form.oftalodccmologia_odcc} disabled labelWidth="35px" />
                                <InputTextOneLine label="V.L." name="odlcOftalmologia_odlc" value={form.odlcOftalmologia_odlc} disabled labelWidth="35px" />
                            </div>
                            <div className="space-y-3">
                                <div className="font-semibold text-center">O.I</div>
                                <InputTextOneLine label="V.C." name="oiccoftalmologia_oicc" value={form.oiccoftalmologia_oicc} disabled labelWidth="35px" />
                                <InputTextOneLine label="V.L." name="oilcOftalmologia_oilc" value={form.oilcOftalmologia_oilc} disabled labelWidth="35px" />
                            </div>
                        </div>
                        <InputTextOneLine label="V.Clrs" name="vcOftalmologia_vc" value={form.vcOftalmologia_vc} disabled labelWidth="45px" />
                        <InputTextOneLine label="V.B." name="vbOftalmologia_vb" value={form.vbOftalmologia_vb} disabled labelWidth="45px" />
                        <InputTextOneLine label="R.P." name="rpOftalmologia_rp" value={form.rpOftalmologia_rp} disabled labelWidth="45px" />
                    </SectionFieldset>

                    <SectionFieldset legend="Enfermedades Oculares">
                        <InputTextArea
                            name="enfermedadesOcularesOftalmologia_e_oculares"
                            value={form.enfermedadesOcularesOftalmologia_e_oculares}
                            rows={5}
                            disabled
                        />
                    </SectionFieldset>

                    <SectionFieldset legend="Laboratorio" className="space-y-3">
                        <InputTextOneLine label="Hemoglobina" name="hemoglobina_txthemoglobina" value={form.hemoglobina_txthemoglobina} disabled labelWidth="95px" />
                        <InputTextOneLine label="V.S.G" name="vsgLabClinico_txtvsg" value={form.vsgLabClinico_txtvsg} disabled labelWidth="95px" />
                        <InputTextOneLine label="Glucosa" name="glucosaLabClinico_txtglucosabio" value={form.glucosaLabClinico_txtglucosabio} disabled labelWidth="95px" />
                        <InputTextOneLine label="Leucocitos" name="leucocitoSematologiaLabClinico" value={form.leucocitoSematologiaLabClinico} disabled labelWidth="95px" />
                        <InputTextOneLine label="Creatinina" name="creatininaLabClinico_txtcreatininabio" value={form.creatininaLabClinico_txtcreatininabio} disabled labelWidth="95px" />
                    </SectionFieldset>
                </div>
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
    );
}
