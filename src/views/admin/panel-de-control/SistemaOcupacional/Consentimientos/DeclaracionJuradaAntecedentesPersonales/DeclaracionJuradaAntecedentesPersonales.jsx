import { InputsBooleanRadioGroup, InputTextArea, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
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
} from "./controllerDeclaracionJuradaAntecedentesPersonales";
import BotonesForm from "../../../../../components/templates/BotonesForm";

const tabla = "DECLA_JURA_ANTECE_PERSON_FAM";

// Al cambiar "existen antecedentes" se limpia el detalle: se revierten en conjunto.
const CAMPOS_ANTECEDENTES = ["existenAntecedentes", "detalleAntecedentes"];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fecha", ...CAMPOS_ANTECEDENTES];

const textoFinalConsentimiento = "(De marcar SI, detallar que antecedentes existen, considerar los antecedentes de la madre, padre, abuelo y abuela)";
const textoFinalConsentimiento2 = "Se suscribe la presente declaración jurada en conformidad de lo antes expuesto.";

export default function DeclaracionJuradaAntecedentesPersonales() {
  const today = getToday();
  const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

  const initialFormState = {
    norden: "",
    fecha: today,
    idConsentimiento: null,
    nombres: "",
    dni: "",
    empresa: "",
    ocupacion: "",
    existenAntecedentes: false,
    detalleAntecedentes: "",

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
    handleRadioButtonBoolean,
    handleChangeNumber,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "DeclaracionJuradaAntecedentesPersonales" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
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
      <SectionFieldset legend="Declaración Jurada de Antecedentes Personales" className="space-y-3">
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
          <div className="text-justify space-y-3">
            <InputTextOneLine
              label="Para la Empresa"
              name="empresa"
              value={form.empresa}
              disabled
              labelWidth="140px"
            />
            <InputsBooleanRadioGroup
              label="Declaro bajo juramento: Existen antecedentes personales y familiares"
              name="existenAntecedentes"
              value={form.existenAntecedentes}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm((prev) => ({
                  ...prev,
                  detalleAntecedentes: ""
                }));
              }}
              labelOnTop
              disabled={camposDeshabilitados}
              edited={isFieldEdited("existenAntecedentes")}
              onRevert={() => revertFields(CAMPOS_ANTECEDENTES)}
            />
            <p className=" text-gray-500">
              {textoFinalConsentimiento}
            </p>
            <InputTextArea
              label="Detalle de Antecedentes"
              name="detalleAntecedentes"
              value={form.detalleAntecedentes}
              onChange={handleChange}
              disabled={camposDeshabilitados || !form.existenAntecedentes}
              edited={isFieldEdited("detalleAntecedentes")}
              onRevert={() => revertField("detalleAntecedentes")}
              rows={8}
            />
            <p className="text-justify">
              {textoFinalConsentimiento2}
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
