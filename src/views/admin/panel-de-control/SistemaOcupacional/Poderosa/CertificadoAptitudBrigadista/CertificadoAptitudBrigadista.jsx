import { useState } from "react";
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
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerAptitudBrigadista";

const tabla = "certificado_aptitud_brigadista";
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExam",
    "aptitud",
    "conclusiones",
    "restricciones",
    "recomendaciones",
    "user_medicoFirma",
    "nombre_medico",
];

const CertificadoAptitudBrigadista = () => {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fechaExam: today,
        tipoExamen: "",
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
        aptitud: "",
        conclusiones: "",
        restricciones: "",
        recomendaciones: "",
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
        handleRadioButton,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "CertificadoAptitudBrigadista" });
 
    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES, });

    // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
    // el id y se revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

    const [errors, setErrors] = useState({});

    // El error de Conclusiones se muestra solo tras intentar guardar y mientras el campo
    // siga vacío; se limpia solo a medida que el usuario escribe.
    const conclusionesError =
        errors.conclusiones && !form.conclusiones?.trim() ? errors.conclusiones : "";

    const validateForm = () => {
        const next = {};
        if (!form.conclusiones?.trim()) {
            next.conclusiones = "Las conclusiones son obligatorias.";
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
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha de Ingreso"
                    name="fechaExam"
                    type="date"
                    value={form.fechaExam}
                    onChange={handleChangeSimple}
                    disabled={form.tieneRegistro}
                    labelWidth="120px"
                    edited={isFieldEdited("fechaExam")}
                    onRevert={() => revertField("fechaExam")}
                />

            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            <div className="flex flex-col md:flex-row gap-3 items-start w-full ">
                <div className="w-full md:w-[40%]">
                    <SectionFieldset legend="Aptitud" className="w-full">
                        <InputsRadioGroup
                            vertical
                            disabled={camposDeshabilitados}
                            name="aptitud" value={form?.aptitud} className="py-2"
                            onChange={handleRadioButton} options={[
                                { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" }
                            ]}
                            edited={isFieldEdited("aptitud")}
                            onRevert={() => revertField("aptitud")}
                        />

                    </SectionFieldset>
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

                <div className="w-full md:w-[60%]  ">
                    <SectionFieldset legend="Conclusiones y Observaciones" className="w-full space-y-3">
                        <InputTextArea
                            label="Conclusiones"
                            name="conclusiones"
                            onChange={handleChange}
                            value={form.conclusiones}
                            rows={3}
                            labelWidth="120px"
                            required
                            disabled={camposDeshabilitados}
                            error={conclusionesError}
                            edited={isFieldEdited("conclusiones")}
                            onRevert={() => revertField("conclusiones")}
                        />
                        <InputTextArea
                            label="Restricciones"
                            name="restricciones"
                            onChange={handleChange}
                            rows={3}
                            value={form.restricciones}
                            labelWidth="120px"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("restricciones")}
                            onRevert={() => revertField("restricciones")}
                        />
                        <InputTextArea
                            label="Recomendaciones"
                            name="recomendaciones"
                            onChange={handleChange}
                            rows={3}
                            value={form.recomendaciones}
                            labelWidth="120px"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("recomendaciones")}
                            onRevert={() => revertField("recomendaciones")}
                        />
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
                handleClear={handleClearForm}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    )
}

export default CertificadoAptitudBrigadista
