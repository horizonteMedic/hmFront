import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    PrintHojaR,
    SubmitDataService,
    UpdateDataService,
    VerifyTR,
} from "./controllerConsentimientoInformado";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import ModalSubidaMasiva from "./modalSubidaMasiva/ModalSubidaMasiva";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const tabla = "consentimientoInformado";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fecha"];

const textoConsentimiento = `certifico que he sido informado/a acerca de la naturaleza y propósito del examen médico ocupacional así como pruebas complementarias determinada por la empresa:`;
const textoFinalConsentimiento = `De acuerdo a los peligros y riesgos identificados en mi puesto de trabajo. En ese sentido en forma consciente y voluntaria doy mi consentimiento, para que se me realice el examen médico ocupacional de acuerdo a la Resolución ministerial N° 312-2011/MINSA. Y doy fe que la información brindada a HORIZONTE MEDIC es verídica. Así mismo, autorizo a HORIZONTE MEDIC para que brinde mi historia clínica y toda información resultante de mi examen médico ocupacional al Médico Ocupacional de mi empresa para que tenga acceso a mi Historia Clínica de acuerdo a la N.T.N° 022 MINSA/dgsp-V.02 y Ley N° 26842, Ley general de salud.`;

export default function ConsentimientoInformado() {
    const today = getToday();
    const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();
    const [showModal, setShowModal] = useState(false);

    const initialFormState = {
        norden: "",
        codCons: null,
        fecha: today,
        nombres: "",
        dni: "",
        empresa: "",
        ocupacion: "",

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
        handleChangeSimple,
        handleChangeNumber,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "consentimientoInformado" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

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

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleUpdate = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

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
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            {showModal && (
                <ModalSubidaMasiva
                    onClose={() => setShowModal(false)}
                    token={token}
                    userlogued={userlogued}
                    sede={selectedSede}
                />
            )}

            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            >
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="pointer-events-auto verde-btn px-3 py-1.5 rounded flex items-center gap-2"
                >
                    Subida Masiva <FontAwesomeIcon icon={faUpload} />
                </button>
            </AccionesRegistroHeader>

            <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={hayRegistroCargado}
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fecha")}
                    onRevert={() => revertField("fecha")}
                />
                <InputTextOneLine
                    label="Hora"
                    name="hora"
                    value={hora}
                    disabled
                />
            </SectionFieldset>

            {/* Contenido del Consentimiento */}
            <SectionFieldset legend="Consentimiento Informado Ocupacional" className="space-y-3">
                {/* Información Personal */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Yo"
                        name="nombres"
                        value={form.nombres}
                        onChange={handleChange}
                        disabled
                        labelWidth="30px"
                    />
                    <InputTextOneLine
                        label="Identificado con DNI"
                        name="dni"
                        value={form.dni}
                        disabled
                        labelWidth="140px"
                    />
                    <InputTextOneLine
                        label="Con ocupación laboral de"
                        name="ocupacion"
                        value={form.ocupacion}
                        onChange={handleChange}
                        disabled
                        labelWidth="140px"
                    />
                </div>

                {/* Texto del Consentimiento */}
                <div className="space-y-4">
                    <div className="text-justify leading-relaxed">
                        <p className="mb-3">
                            {textoConsentimiento}
                        </p>

                        <div className="mb-3">
                            <InputTextOneLine
                                label="Empresa"
                                name="empresa"
                                value={form.empresa}
                                disabled
                                labelWidth="140px"
                            />
                        </div>
                        <p className="text-justify">
                            {textoFinalConsentimiento}
                        </p>
                    </div>
                </div>
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
                onNordenChange={handlePrintNordenChange}
                handleSave={form.tieneRegistro && edicionHabilitada ? handleUpdate : handleSave}
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
