import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerHojaRutaEmo";

const tabla = "hoja_ruta_emo";
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "observacionesEvaluacionMedica",
    "observacionInformeBrigadista",
    "observacionesEvaluacionVisual",
    "observacionAudiometria",
    "observacionEspirometria",
    "observacionRadiografiaTorax",
    "observacionesElectrocardiograma",
    "observacionesExamenLaboratorio",
    "observacionBrigadista",
    "observacionesGenerales",
    "user_medicoFirma",
    "nombre_medico",
];

const HojaDeRutaEmo = () => {
    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        tipoExamen: "",
        fechaExamen: today,
        horaEntrada: "",
        horaSalida: "",

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

        // Vitales (Triaje)
        peso: "",
        talla: "",
        pa: "",
        sat02: "",
        cintura: "",
        cadera: "",
        fc: "",
        fr: "",
        cuello: "",

        // Medicina
        usuarioEvaluacionMedica: "",
        observacionesEvaluacionMedica: "",
        // Psicología (Informe Brigadista)
        usuarioInformeBrigadista: "",
        observacionInformeBrigadista: "",
        // Visual
        usuarioEvaluacionOftalmologica: "",
        observacionesEvaluacionVisual: "",
        // Audiometría
        usuarioAudiometria: "",
        observacionAudiometria: "",
        // Espirometría
        usuarioEspirometria: "",
        observacionEspirometria: "",
        // Radiografía de Tórax
        usuarioToraxConvencional: "",
        observacionRadiografiaTorax: "",
        // Cardiología
        usuarioElectrocardiograma: "",
        observacionesElectrocardiograma: "",
        // Laboratorio
        usuarioExamenLaboratorio: "",
        observacionesExamenLaboratorio: "",
        // Brigadista
        usuarioCertificadoAptitudBrigadista: "",
        observacionBrigadista: "",

        // Conclusiones
        observacionesGenerales: "",

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
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "HojaRutaEMO" });

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
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            {/* ===== SECCIÓN: INFORMACIÓN GENERAL ===== */}
            <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-3">
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
                    name="tipoExamen"
                    disabled
                    value={form.tipoExamen}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha de Ingreso"
                    name="fechaExamen"
                    type="date"
                    value={form.fechaExamen}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    labelWidth="120px"
                    edited={isFieldEdited("fechaExamen")}
                    onRevert={() => revertField("fechaExamen")}
                />
                <InputTextOneLine
                    label="Hora"
                    name="horaSalida"
                    labelWidth="120px"
                    disabled
                    value={form.tieneRegistro ? form.horaSalida : hora}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            {/* ===== SECCIÓN: EXÁMENES ===== */}
            <SectionFieldset legend="Exámenes" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <label className="text-center text-lg font-semibold" htmlFor="">EXÁMENES</label>
                <label className="text-center text-lg font-semibold" htmlFor="">PRUEBAS REALIZADAS POR</label>
                <label className="text-center text-lg font-semibold" htmlFor="">OBSERVACIONES</label>

                {/* Vitales (Triaje) */}
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine label="PESO" name="peso" value={form.peso} labelWidth="34px" disabled />
                    <InputTextOneLine label="TALLA" name="talla" value={form.talla} labelWidth="36px" disabled />
                    <InputTextOneLine label="P/A" name="pa" value={form.pa} labelWidth="35px" disabled />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine label="SAT02" name="sat02" value={form.sat02} labelWidth="38px" disabled />
                    <InputTextOneLine label="CINTURA" name="cintura" value={form.cintura} labelWidth="55px" disabled />
                    <InputTextOneLine label="CADERA" name="cadera" value={form.cadera} labelWidth="55px" disabled />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine label="FC" name="fc" value={form.fc} labelWidth="34px" disabled />
                    <InputTextOneLine label="FR" name="fr" value={form.fr} labelWidth="36px" disabled />
                    <InputTextOneLine label="CUELLO" name="cuello" value={form.cuello} labelWidth="45px" disabled />
                </div>

                {/* MEDICINA */}
                <h1 className="font-bold text-lg text-center self-center">MEDICINA<br />*Evaluación médica</h1>
                <InputTextOneLine name="usuarioEvaluacionMedica" value={form.usuarioEvaluacionMedica} disabled />
                <InputTextOneLine
                    name="observacionesEvaluacionMedica"
                    value={form.observacionesEvaluacionMedica}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionesEvaluacionMedica")}
                    onRevert={() => revertField("observacionesEvaluacionMedica")}
                />

                {/* PSICOLÓGICA */}
                <h1 className="font-bold text-lg text-center self-center">EVALUACIÓN PSICOLÓGICA<br />*Informe Psicológico Brigadista</h1>
                <InputTextOneLine name="usuarioInformeBrigadista" value={form.usuarioInformeBrigadista} disabled />
                <InputTextOneLine
                    name="observacionInformeBrigadista"
                    value={form.observacionInformeBrigadista}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionInformeBrigadista")}
                    onRevert={() => revertField("observacionInformeBrigadista")}
                />

                {/* EVALUACIÓN VISUAL */}
                <h1 className="font-bold text-lg text-center self-center">EVALUACIÓN VISUAL<br />*Evaluación Oftalmológica *Agudeza visual</h1>
                <InputTextOneLine name="usuarioEvaluacionOftalmologica" value={form.usuarioEvaluacionOftalmologica} disabled />
                <InputTextOneLine
                    name="observacionesEvaluacionVisual"
                    value={form.observacionesEvaluacionVisual}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionesEvaluacionVisual")}
                    onRevert={() => revertField("observacionesEvaluacionVisual")}
                />

                {/* AUDIOMETRÍA */}
                <h1 className="font-bold text-lg text-center self-center">EVALUACIÓN AUDIOMETRÍA<br />*Audiometría</h1>
                <InputTextOneLine name="usuarioAudiometria" value={form.usuarioAudiometria} disabled />
                <InputTextOneLine
                    name="observacionAudiometria"
                    value={form.observacionAudiometria}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionAudiometria")}
                    onRevert={() => revertField("observacionAudiometria")}
                />

                {/* ESPIROMETRÍA */}
                <h1 className="font-bold text-lg text-center self-center">EVALUACIÓN ESPIROMETRÍA<br />*Cuestionario de Espirometría</h1>
                <InputTextOneLine name="usuarioEspirometria" value={form.usuarioEspirometria} disabled />
                <InputTextOneLine
                    name="observacionEspirometria"
                    value={form.observacionEspirometria}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionEspirometria")}
                    onRevert={() => revertField("observacionEspirometria")}
                />

                {/* RADIOGRAFÍA DE TÓRAX */}
                <h1 className="font-bold text-lg text-center self-center">EVALUACIÓN RADIOGRAFÍA DE TÓRAX<br />*Tórax Convencional *Tórax OIT</h1>
                <InputTextOneLine name="usuarioToraxConvencional" value={form.usuarioToraxConvencional} disabled />
                <InputTextOneLine
                    name="observacionRadiografiaTorax"
                    value={form.observacionRadiografiaTorax}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionRadiografiaTorax")}
                    onRevert={() => revertField("observacionRadiografiaTorax")}
                />

                {/* CARDIOLOGÍA */}
                <h1 className="font-bold text-lg text-center self-center">CARDIOLOGÍA<br />*Electrocardiograma</h1>
                <InputTextOneLine name="usuarioElectrocardiograma" value={form.usuarioElectrocardiograma} disabled />
                <InputTextOneLine
                    name="observacionesElectrocardiograma"
                    value={form.observacionesElectrocardiograma}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionesElectrocardiograma")}
                    onRevert={() => revertField("observacionesElectrocardiograma")}
                />

                {/* LABORATORIO */}
                <h1 className="font-bold text-lg text-center self-center">EXÁMENES DE LABORATORIO</h1>
                <InputTextOneLine name="usuarioExamenLaboratorio" value={form.usuarioExamenLaboratorio} disabled />
                <InputTextOneLine
                    name="observacionesExamenLaboratorio"
                    value={form.observacionesExamenLaboratorio}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionesExamenLaboratorio")}
                    onRevert={() => revertField("observacionesExamenLaboratorio")}
                />

                {/* BRIGADISTA */}
                <h1 className="font-bold text-lg text-center self-center">BRIGADISTA<br />*Examen Médico Brigadista *Certificado de Aptitud Brigadista *Hoja de Consulta Externa - Brl</h1>
                <InputTextOneLine name="usuarioCertificadoAptitudBrigadista" value={form.usuarioCertificadoAptitudBrigadista} disabled />
                <InputTextOneLine
                    name="observacionBrigadista"
                    value={form.observacionBrigadista}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionBrigadista")}
                    onRevert={() => revertField("observacionBrigadista")}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: CONCLUSIONES ===== */}
            <SectionFieldset legend="Conclusiones" className="space-y-3">
                <InputTextArea
                    label="Conclusiones"
                    name="observacionesGenerales"
                    rows={3}
                    value={form.observacionesGenerales}
                    onChange={handleChange}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observacionesGenerales")}
                    onRevert={() => revertField("observacionesGenerales")}
                />
                <div className="w-full flex justify-between">
                    {form.horaEntrada && (
                        <div className="flex gap-2 items-center justify-center">
                            <label>HORA ENTRADA:</label>
                            <h1 className="text-lg font-bold">{form.horaEntrada}</h1>
                        </div>
                    )}
                    <div className="flex gap-2 items-center justify-center">
                        <label>HORA SALIDA:</label>
                        <h1 className="text-lg font-bold">{form.tieneRegistro ? form.horaSalida : hora}</h1>
                    </div>
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN: ASIGNACIÓN DE MÉDICO ===== */}
            <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Doctor Asignado"
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
    )
}

export default HojaDeRutaEmo
