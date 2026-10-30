import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import {
    PrintHojaR,
    SubmitDataService,
    UpdateDataService,
    VerifyTR,
} from "./controllerConsentimientoBuenaSalud";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../../hooks/useSessionData";
import BotonesForm from "../../../../../components/templates/BotonesForm";

const tabla = "consentimientobuenasalud";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fecha"];

export default function ConsentimientoBuenaSalud() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, hora } = useSessionData();
    const initialFormState = {
        norden: "",
        fecha: today,
        nombres: "",
        edad: "",
        dni: "",
        textoFinalConsentimiento: `NO PADEZCO DE ENFERMEDAD ALGUNA, NI PRESENTO SÍNTOMAS DE NINGÚN TIPO, por lo cual me considero un persona completamente SANA.`,

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
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "consentimientoBuenaSalud" });

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
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

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
            <SectionFieldset legend="Consentimiento de Buena Salud" className="space-y-3">
                {/* Información Personal */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Yo"
                        name="nombres"
                        value={form.nombres}
                        disabled
                        labelWidth="30px"
                    />
                    <div className="flex items-center flex-wrap">
                        <InputTextOneLine
                            label="de"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="30px"
                            className="mr-4"
                        />
                        <label className="font-semibold min-w-[50px]">años de edad,</label>
                        <InputTextOneLine
                            label="identificado con DNI"
                            name="dni"
                            value={form.dni}
                            disabled
                            labelWidth="110px"
                        />
                    </div>
                </div>

                {/* Texto del Consentimiento */}
                <div className="space-y-4">
                    <div className="text-justify leading-relaxed">
                        <p className="mb-3">
                            {form.textoFinalConsentimiento}
                        </p>
                        <p className="text-justify leading-relaxed mt-3">
                            Por lo que soy responsable de lo anteriormente declarado.
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
