import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerTrastornoDePersonalidad';
import { InputsBooleanRadioGroup, InputTextArea, InputTextOneLine, RadioTable, SectionFieldset } from '../../../../../../components/reusableComponents/ResusableComponents';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import RegistroEstadoPill from '../../../../../../components/reusableComponents/RegistroEstadoPill';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesForm from '../../../../../../components/templates/BotonesForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const tabla = 'trastornos_personalidad';

const opGrupoA = [
    { name: "paranoide", label: "1.- Paranoide" },
    { name: "esquizoide", label: "2.- Esquizoide" },
    { name: "esquizotipico", label: "3.- Esquizotípico" },
    { name: "inestabilidadImpulsivo", label: "4.- T. Inestabilidad Emocional Subtipo Impulsivo" },
    { name: "inestabilidadLimite", label: "5.- T. Inestabilidad Emocional Subtipo Límite" },
];
const opGrupoB = [
    { name: "histrionico", label: "1.- Histriónico" },
    { name: "antisocial", label: "2.- Antisocial" },
    { name: "narcisista", label: "3.- Narcisista" },
];
const opGrupoC = [
    { name: "anancastico", label: "1.- Anancástico" },
    { name: "dependiente", label: "2.- Dependiente" },
    { name: "ansioso", label: "3.- Ansioso" },
];

const opcionesGrupos = [
    { value: "BAJO", label: "Bajo" },
    { value: "MEDIO", label: "Medio" },
    { value: "ALTO", label: "Alto" },
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "cumpleConPerfil",
    "paranoide",
    "esquizoide",
    "esquizotipico",
    "inestabilidadImpulsivo",
    "inestabilidadLimite",
    "histrionico",
    "antisocial",
    "narcisista",
    "anancastico",
    "dependiente",
    "ansioso",
    "analisisYResultados",
    "recomendaciones",
    "interpretacion",
    "user_medicoFirma",
    "nombre_medico",
];

export default function TrastornoDePersonalidad() {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: '',
        fecha: today,

        cumpleConPerfil: undefined,

        nombreExamen: "",

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

        paranoide: "",
        esquizoide: "",
        esquizotipico: "",
        inestabilidadImpulsivo: "",
        inestabilidadLimite: "",

        histrionico: "",
        antisocial: "",
        narcisista: "",

        anancastico: "",
        dependiente: "",
        ansioso: "",

        analisisYResultados: "",
        recomendaciones: "",
        interpretacion: "",

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
        handleRadioButtonBoolean,
        handleChangeSimple,
        handleClearnotO,
        handleClear,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "trastornoDePersonalidadPsicologia" });

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
        if (!e || e.key === 'Enter') {
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

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <InputsBooleanRadioGroup
                    label="Cumple con perfil"
                    name="cumpleConPerfil"
                    value={form.cumpleConPerfil}
                    labelWidth='120px'
                    onChange={handleRadioButtonBoolean}
                    trueLabel='Cumple'
                    falseLabel='No Cumple'
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("cumpleConPerfil")}
                    onRevert={() => revertField("cumpleConPerfil")}
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Grupos" className='grid space-y-3'>
                <SectionFieldset legend="Grupo A">
                    <RadioTable
                        items={opGrupoA}
                        options={opcionesGrupos}
                        form={form}
                        handleRadioButton={handleRadioButton}
                        labelColumns={1}
                        disabled={camposDeshabilitados}
                        isFieldEdited={isFieldEdited}
                        onRevert={revertField}
                    />
                </SectionFieldset>
                <div className='grid xl:grid-cols-2 gap-y-3 gap-x-4'>
                    <SectionFieldset legend="Grupo B">
                        <RadioTable
                            items={opGrupoB}
                            options={opcionesGrupos}
                            form={form}
                            handleRadioButton={handleRadioButton}
                            labelColumns={1}
                            disabled={camposDeshabilitados}
                            isFieldEdited={isFieldEdited}
                            onRevert={revertField}
                        />
                    </SectionFieldset>
                    <SectionFieldset legend="Grupo C">
                        <RadioTable
                            items={opGrupoC}
                            options={opcionesGrupos}
                            form={form}
                            handleRadioButton={handleRadioButton}
                            labelColumns={1}
                            disabled={camposDeshabilitados}
                            isFieldEdited={isFieldEdited}
                            onRevert={revertField}
                        />
                    </SectionFieldset>
                </div>
            </SectionFieldset>
            <SectionFieldset legend="Resultados" className='grid xl:grid-cols-2 gap-x-4 gap-y-3'>
                <InputTextArea
                    label="Análisis y Resultados"
                    name="analisisYResultados"
                    value={form.analisisYResultados}
                    onChange={handleChange}
                    className='col-span-2'
                    rows={5}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("analisisYResultados")}
                    onRevert={() => revertField("analisisYResultados")}
                />
                <InputTextArea
                    label="Recomendaciones"
                    name="recomendaciones"
                    value={form.recomendaciones}
                    onChange={handleChange}
                    rows={5}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("recomendaciones")}
                    onRevert={() => revertField("recomendaciones")}
                />
                <InputTextArea
                    label="Interpretación Paranoide"
                    name="interpretacion"
                    value={form.interpretacion}
                    onChange={handleChange}
                    rows={5}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("interpretacion")}
                    onRevert={() => revertField("interpretacion")}
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
