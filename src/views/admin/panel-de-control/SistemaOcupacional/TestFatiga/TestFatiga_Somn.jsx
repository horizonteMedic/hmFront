import { useState } from "react";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import RadioTable from "../../../../components/reusableComponents/RadioTable";
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
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./ControllerTestF";
import {
    OPCIONES_PROBABILIDAD,
    PREGUNTAS_SITUACION,
    RESPUESTAS_INICIALES,
    calcularPuntaje,
} from "./modelTest";

const tabla = "test_fatiga_somnolencia";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fexamen",
    ...PREGUNTAS_SITUACION.map(({ name }) => name),
    "manejaVehiculos",
    "user_medicoFirma",
    "nombre_medico",
];

const Test_fatiga = () => {
    const { token, userlogued, selectedSede, datosFooter, userName, userCompleto } = useSessionData();
    const today = getToday();

    const initialFormState = {
        // Header
        norden: "",
        fexamen: today,
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

        // Situación: cada pregunta guarda UNA opción ("NUNCA" | "POCA" | "MODERADA" | "ALTA")
        ...RESPUESTAS_INICIALES,

        // Pregunta obligatoria: "SI" | "NO"
        manejaVehiculos: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        // Usuario que registra (el backend lo guarda como txtMedico / dniUser)
        txtMedico: userCompleto?.datos?.nombres_user ?? "",
        dniUser: userCompleto?.datos?.dni_user ?? "",

        // Identificador del registro en backend (null = registro nuevo)
        codEval: null,

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
        handleRadioButton,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "TestFatigaSomnolencia" });

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

    const [errors, setErrors] = useState({});

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    // Los errores se muestran solo tras intentar guardar y mientras el campo siga sin
    // resolverse; se limpian solos cuando el usuario lo completa.
    const nordenError = errors.norden && !hayRegistroCargado ? errors.norden : "";
    const manejaVehiculosError =
        errors.manejaVehiculos && !form.manejaVehiculos ? errors.manejaVehiculos : "";

    const validateForm = () => {
        const next = {};
        if (!hayRegistroCargado) {
            next.norden = "Busque un N° Orden válido antes de guardar.";
        }
        if (!form.manejaVehiculos) {
            next.manejaVehiculos = "Indique si el trabajador maneja vehículos motorizados.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        if (!validateForm()) return;
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleClearForm = () => {
        setErrors({});
        handleClear();
    };

    // ===== Búsqueda con boton =====
    const executeSearch = () => {
        setErrors({});
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
            setErrors({});
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

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClearForm}
            />

            {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
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
                        error={nordenError}
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha de Examen"
                    name="fexamen"
                    type="date"
                    value={form.fexamen}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    labelWidth="120px"
                    edited={isFieldEdited("fexamen")}
                    onRevert={() => revertField("fexamen")}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS PERSONALES Y LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            {/* ===== SECCIÓN: SITUACIÓN ===== */}
            <SectionFieldset legend="Situación">
                <p className="mb-3 text-gray-700">
                    ¿Qué tan probable es que usted cabecee o se quede dormido en las siguientes situaciones?
                    Considere los últimos meses de sus actividades habituales; no se refiere a sentirse cansado
                    debido a actividad física. Aunque no haya realizado últimamente las situaciones descritas,
                    considere cómo le habrían afectado. Marque la opción más apropiada para cada situación.
                </p>
                <RadioTable
                    items={PREGUNTAS_SITUACION}
                    options={OPCIONES_PROBABILIDAD}
                    form={form}
                    handleRadioButton={handleRadioButton}
                    labelColumns={5}
                    disabled={camposDeshabilitados}
                    isFieldEdited={isFieldEdited}
                    onRevert={revertField}
                    stackOnMobile
                />
                <div className="mt-3 flex justify-end">
                    <InputTextOneLine
                        label="Puntaje Total"
                        name="txtPuntaje"
                        value={calcularPuntaje(form)}
                        disabled
                        labelWidth="120px"
                        className="w-full sm:w-[260px]"
                    />
                </div>
            </SectionFieldset>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                {/* ===== SECCIÓN: PREGUNTA OBLIGATORIA ===== */}
                <SectionFieldset legend="Pregunta Obligatoria" className="w-full space-y-2">
                    <p className="font-semibold">
                        Usted maneja vehículos motorizados (auto, camioneta, ómnibus, combi, montacarga, grúa, etc.)
                        <span className="text-red-500 ml-0.5">*</span>
                    </p>
                    <InputsRadioGroup
                        name="manejaVehiculos"
                        value={form.manejaVehiculos}
                        onChange={handleRadioButton}
                        disabled={camposDeshabilitados}
                        options={[
                            { label: "SI", value: "SI" },
                            { label: "NO", value: "NO" },
                        ]}
                        edited={isFieldEdited("manejaVehiculos")}
                        onRevert={() => revertField("manejaVehiculos")}
                        error={manejaVehiculosError}
                    />
                </SectionFieldset>

                {/* ===== SECCIÓN: ASIGNACIÓN DE MÉDICO ===== */}
                <SectionFieldset legend="Asignación de Médico" className="w-full">
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
                handleClear={handleClearForm}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    );
};

export default Test_fatiga;
