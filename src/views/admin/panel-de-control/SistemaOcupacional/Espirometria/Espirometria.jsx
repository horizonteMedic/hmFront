import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputCheckbox,
    InputTextArea,
    InputsBooleanRadioGroup,
    InputsRadioGroup,
    CIE10List,
} from "../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import {
    handleSubirArchivoMasivo,
    PrintHojaR,
    ReadArchivosForm,
    SubmitDataService,
    UpdateDataService,
    VerifyTR,
} from "./controllerEspirometria";
import { handleSubirArchivo } from "../Altura18/controllerAltura18";

const tabla = "funcion_abs";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "fvc",
    "fev1",
    "fev1_fvc",
    "fef",
    "fvcTeorico",
    "fev1Teorico",
    "interpretacion",
    "pasoExamen",
    "user_medicoFirma",
    "nombre_medico",
    "user_doctorAsignado",
    "nombre_doctorAsignado",
    "user_doctorExtra",
    "nombre_doctorExtra",
];

export default function Espirometria() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fecha: today,
        nombreExamen: "",
        pasoExamen: false,
        codExam: null,
        codAbs: null,

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

        fvc: "",
        fev1: "",
        fev1_fvc: "",
        fef: "",

        peso: "",
        talla: "",
        sistolica: "",
        diastolica: "",

        fvcTeorico: "",
        fev1Teorico: "",

        interpretacion: "ESPIROMETRIA NORMAL",
        interpretacionCie10: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        nombre_doctorAsignado: "",
        user_doctorAsignado: "",

        nombre_doctorExtra: "",
        user_doctorExtra: "",

        SubirDoc: false,
        nomenclatura: "ESPIROMETRIA",

        // Cuestionario Platino - Espirometría (OHLA)
        esOHLA: false,
        ohlaCirugiaPulmonToraxAbdomen: null,
        ohlaInfartoCorazon: null,
        ohlaDesprendimientoRetina: null,
        ohlaHospitalizadoCorazon: null,
        ohlaMedicamentoTuberculosis: null,
        ohlaEmbarazada: null,
        pulso: "",
        ohlaInfeccionRespiratoria: null,
        ohlaUsoMedicamentoRespiracion: null,
        ohlaFumoCigarro: null,
        ohlaFumoCigarroCuantos: "",
        ohlaEjercicioFisico: null,
        ohlaResultadoPrueba: "",

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
        handleFocusNext,
        handleChangeSimple,
        handleCheckBoxChange,
        handleRadioButtonBoolean,
        handleRadioButton,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "espirometria" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, {
        tieneRegistro: form.tieneRegistro,
        camposEditables: CAMPOS_EDITABLES,
    });

    // Cada médico se compone de 2 campos (id + nombre): se detecta el cambio por el id
    // y se revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
    const isDoctorAsignadoEdited = isFieldEdited("user_doctorAsignado");
    const revertDoctorAsignado = () =>
        revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);
    const isDoctorExtraEdited = isFieldEdited("user_doctorExtra");
    const revertDoctorExtra = () =>
        revertFields(["user_doctorExtra", "nombre_doctorExtra"]);

    const [visualerOpen, setVisualerOpen] = useState(null);

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
            PrintHojaR(form.norden, token, tabla);
        });
    };

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

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                        disabled={hayRegistroCargado}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fecha")}
                    onRevert={() => revertField("fecha")}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre del Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
                <div>
                <InputCheckbox
                    label={<span className="text-red-500">No Pasó Examen</span>}
                    name="pasoExamen"
                    checked={form.pasoExamen}
                    disabled={camposDeshabilitados}
                    onChange={(e) => {
                        setForm((prev) => ({
                            ...prev,
                            fvc: e.target.checked ? "N/A" : "",
                            fev1: e.target.checked ? "N/A" : "",
                            fev1_fvc: e.target.checked ? "N/A" : "",
                            fef: e.target.checked ? "N/A" : "",
                            interpretacion: e.target.checked
                                ? "NO SE REALIZÓ ESPIROMETRÍA"
                                : "",
                        }));
                        handleCheckBoxChange(e);
                    }}
                />
                <InputCheckbox
                    label="Es OHLA"
                    name="esOHLA"
                    checked={form.esOHLA}
                    disabled={camposDeshabilitados}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                            ...prev,
                            esOHLA: checked,
                            ...(checked ? {
                                ohlaCirugiaPulmonToraxAbdomen: false,
                                ohlaInfartoCorazon: false,
                                ohlaDesprendimientoRetina: false,
                                ohlaHospitalizadoCorazon: false,
                                ohlaMedicamentoTuberculosis: false,
                                ohlaEmbarazada: false,
                                ohlaInfeccionRespiratoria: false,
                                ohlaUsoMedicamentoRespiracion: false,
                                ohlaFumoCigarro: false,
                                ohlaFumoCigarroCuantos: "",
                                ohlaEjercicioFisico: false,
                                ohlaResultadoPrueba: "COMPLETA",
                            } : {}),
                        }));
                    }}
                />
                </div>

                <ButtonsPDF
                    {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
                    {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
                    handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Criterios" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
                <div className="space-y-3">
                    <InputTextOneLine
                        label="FVC %"
                        name="fvc"
                        value={form?.fvc}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fvc")}
                        onRevert={() => revertField("fvc")}
                    />
                    <InputTextOneLine
                        label="FEV1 %"
                        name="fev1"
                        value={form?.fev1}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fev1")}
                        onRevert={() => revertField("fev1")}
                    />
                    <InputTextOneLine
                        label="FEV1/FVC %"
                        name="fev1_fvc"
                        value={form?.fev1_fvc}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fev1_fvc")}
                        onRevert={() => revertField("fev1_fvc")}
                    />
                    <InputTextOneLine
                        label="FEF 25-75 %"
                        name="fef"
                        value={form?.fef}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fef")}
                        onRevert={() => revertField("fef")}
                    />
                </div>
                <div className="space-y-3">
                    <InputTextOneLine label="Peso" name="peso" value={form?.peso} disabled />
                    <InputTextOneLine label="Talla" name="talla" value={form?.talla} disabled />
                    <InputTextOneLine label="Sistólica" name="sistolica" value={form?.sistolica} disabled />
                    <InputTextOneLine label="Diastólica" name="diastolica" value={form?.diastolica} disabled />
                </div>
                <div className="space-y-3">
                    <InputTextOneLine
                        label="FVC Teórico"
                        name="fvcTeorico"
                        value={form?.fvcTeorico}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fvcTeorico")}
                        onRevert={() => revertField("fvcTeorico")}
                    />
                    <InputTextOneLine
                        label="FEV1 Teórico"
                        name="fev1Teorico"
                        value={form?.fev1Teorico}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fev1Teorico")}
                        onRevert={() => revertField("fev1Teorico")}
                    />
                </div>
                <InputTextArea
                    label="Interpretación"
                    rows={4}
                    name="interpretacion"
                    value={form?.interpretacion}
                    className="xl:col-span-3 ml-0"
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("interpretacion")}
                    onRevert={() => revertField("interpretacion")}
                />
                <div className="bg-green-200 p-3 rounded-xl col-span-3">
                    <CIE10List
                        value={form.interpretacionCie10}
                        fieldName="interpretacionCie10"
                        label="Interpretación CIE10"
                        token={token}
                        setForm={setForm}
                        disabled={camposDeshabilitados}
                    />
                </div>
            </SectionFieldset>

            {form.esOHLA && (
                <SectionFieldset legend="Cuestionario Platino - Espirometría" className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4">
                    <SectionFieldset legend="Preguntas de Exclusión para la Espirometría" className="flex flex-col gap-x-4 gap-y-3">
                        <InputsBooleanRadioGroup
                            label="1. ¿Tuvo alguna cirugía (operación) en su pulmón, en su tórax o en su abdomen, en los últimos 3 meses?"
                            name="ohlaCirugiaPulmonToraxAbdomen"
                            value={form.ohlaCirugiaPulmonToraxAbdomen}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputsBooleanRadioGroup
                            label="2. ¿Tuvo un ataque cardiaco o infarto al corazón, en los últimos 3 meses?"
                            name="ohlaInfartoCorazon"
                            value={form.ohlaInfartoCorazon}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputsBooleanRadioGroup
                            label="3. ¿Tuvo desprendimiento de la retina o una operación (cirugía) de los ojos, en los últimos 3 meses?"
                            name="ohlaDesprendimientoRetina"
                            value={form.ohlaDesprendimientoRetina}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputsBooleanRadioGroup
                            label="4. ¿Estuvo hospitalizado por cualquier otro problema del corazón, en los últimos 3 meses?"
                            name="ohlaHospitalizadoCorazon"
                            value={form.ohlaHospitalizadoCorazon}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputsBooleanRadioGroup
                            label="5. ¿Está usando medicamentos para la tuberculosis, en este momento?"
                            name="ohlaMedicamentoTuberculosis"
                            value={form.ohlaMedicamentoTuberculosis}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputsBooleanRadioGroup
                            label="6. ¿Está embarazada, en este momento?"
                            name="ohlaEmbarazada"
                            value={form.ohlaEmbarazada}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputTextOneLine
                            label="7. Pulso (bpm)"
                            name="pulso"
                            value={form.pulso}
                            disabled
                            onChange={handleChangeNumberDecimals}
                        />
                    </SectionFieldset>

                    <SectionFieldset legend="Preguntas para Entrevistados sin Criterios de Exclusión" className="flex flex-col gap-x-4 gap-y-3">
                        <InputsBooleanRadioGroup
                            label="1. ¿Tuvo una infección respiratoria (resfriado), en las últimas 3 semanas?"
                            name="ohlaInfeccionRespiratoria"
                            value={form.ohlaInfeccionRespiratoria}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputsBooleanRadioGroup
                            label="2. ¿Usó cualquier remedio o medicamento para la respiración (aerosoles, sprays inhalados o nebulizaciones), en las últimas 3 horas?"
                            name="ohlaUsoMedicamentoRespiracion"
                            value={form.ohlaUsoMedicamentoRespiracion}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputsBooleanRadioGroup
                            label="3. ¿Fumó cualquier tipo de cigarro (puro o pipa), en las últimas dos horas?"
                            name="ohlaFumoCigarro"
                            value={form.ohlaFumoCigarro}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        {form.ohlaFumoCigarro && (
                            <InputTextOneLine
                                label="¿Cuántos?"
                                name="ohlaFumoCigarroCuantos"
                                value={form.ohlaFumoCigarroCuantos}
                                onChange={handleChangeNumberDecimals}
                                disabled={camposDeshabilitados}
                                labelWidth="220px"
                            />
                        )}
                        <InputsBooleanRadioGroup
                            label="4. ¿Realizó algún ejercicio físico fuerte, como gimnasia, caminata o trotar, en la última hora?"
                            name="ohlaEjercicioFisico"
                            value={form.ohlaEjercicioFisico}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            labelOnTop
                        />
                        <InputsRadioGroup
                            name="ohlaResultadoPrueba"
                            label="5. Resultado de la Prueba"
                            labelOnTop
                            value={form.ohlaResultadoPrueba}
                            onChange={handleRadioButton}
                            disabled={camposDeshabilitados}
                            vertical
                            options={[
                                { label: "Prueba completa", value: "COMPLETA" },
                            ]}
                        />
                        <p className="font-semibold text-md text-primario">
                            Prueba incompleta (Marque una de las opciones de abajo)
                        </p>
                        <InputsRadioGroup
                            name="ohlaResultadoPrueba"
                            value={form.ohlaResultadoPrueba}
                            onChange={handleRadioButton}
                            disabled={camposDeshabilitados}
                            vertical
                            options={[
                                { label: "Incompleta: El(la) entrevistado(a) no entendió las instrucciones", value: "INCOMPLETA_NO_ENTENDIO" },
                                { label: "Incompleta: El(la) entrevistado(a) fue excluido por razones médicas (no elegible)", value: "INCOMPLETA_EXCLUIDO_MEDICO" },
                                { label: "Incompleta: El(la) entrevistado(a) no fue capaz de realizar la prueba (otras razones)", value: "INCOMPLETA_NO_CAPAZ" },
                                { label: "Incompleta: El(la) entrevistado(a) rechazó", value: "INCOMPLETA_RECHAZO" },
                            ]}
                        />
                    </SectionFieldset>
                </SectionFieldset>
            )}

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
                <EmpleadoComboBox
                    value={form.nombre_doctorAsignado}
                    label="Doctor Asignado"
                    form={form}
                    onChange={handleChangeSimple}
                    nameField="nombre_doctorAsignado"
                    idField="user_doctorAsignado"
                    disabled={camposDeshabilitados}
                    edited={isDoctorAsignadoEdited}
                    onRevert={revertDoctorAsignado}
                />
                <EmpleadoComboBox
                    value={form.nombre_doctorExtra}
                    label="Doctor Extra"
                    form={form}
                    onChange={handleChangeSimple}
                    nameField="nombre_doctorExtra"
                    idField="user_doctorExtra"
                    disabled={camposDeshabilitados}
                    edited={isDoctorExtraEdited}
                    onRevert={revertDoctorExtra}
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
        </div>
    );
}
