import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
  InputTextOneLine,
  InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import {
  PrintHojaR,
  VerifyTR,
  SubmitDataService,
  UpdateDataService,
} from "./controllerCoprocultivo";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesForm from "../../../../../../components/templates/BotonesForm";

const tabla = "ac_coprocultivo";
const colorOptions = ["Marrón", "Mostaza", "Verdoso"];
const consistenciaOptions = ["Sólido", "Semisólido", "Diarreico"];
const presenceOptions = ["Ausente", "Presente"];
const floraOptions = ["Presente", "Regular cantidad"];
const resultadoOptions = ["Negativo", "Positivo"];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "muestra",
  "color",
  "consistencia",
  "moco_fecal",
  "sangrev",
  "restosa",
  "leucocitos",
  "hematies",
  "parasitos",
  "gotasg",
  "levaduras",
  "identificacion",
  "florac",
  "resultado",
  "observaciones",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function Coprocultivo() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: "",
    fecha: today,

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

    muestra: "HECES",
    color: "-",
    consistencia: "-",
    moco_fecal: "-",
    sangrev: "-",
    restosa: "-",
    leucocitos: "",
    hematies: "-",
    parasitos: "-",
    gotasg: "-",
    levaduras: "-",
    identificacion: "ESCHERICHIA COLI(*)",
    florac: "-",
    resultado: "-",
    observaciones:
      "NO SE AISLÓ ESCHERICHIA COLI ENTEROINVASIVA - ENTEROPATÓGENA - ENTEROHEMORRÁGICA.\nNO SE AISLÓ BACTERIA PATÓGENAS.",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

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
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "coprocultivo" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico y el doctor asignado se componen de 2 campos (id de firma + nombre): se detecta
  // el cambio por el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
  const isDoctorEdited = isFieldEdited("user_doctorAsignado");
  const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

  const toggleOption = (field, value) => {
    const normalized = value.toUpperCase();
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] === normalized ? "-" : normalized,
    }));
  };

  const toggleCampoValue = (field) => {
    setForm((prev) => {
      const current = prev[field] ?? "";
      const hasXCampo = current.toUpperCase().includes("X CAMPO");
      if (hasXCampo) {
        return { ...prev, [field]: current.replace(/ *x campo/gi, "").trim() };
      }
      if (/\d/.test(current)) {
        return { ...prev, [field]: `${current.trim()} X CAMPO`.toUpperCase() };
      }
      return { ...prev, [field]: "X CAMPO" };
    });
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla);
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

  const renderPresenceGroup = (label, field, options = presenceOptions) => (
    <div className="space-y-2">
      <InputTextOneLine
        label={label}
        name={field}
        value={form[field]}
        onChange={handleChange}
        disabled={camposDeshabilitados}
        edited={isFieldEdited(field)}
        onRevert={() => revertField(field)}
        labelWidth="120px"
      />
      <div className="flex items-center gap-4">
        <label className="font-semibold" style={{ minWidth: "120px", maxWidth: "120px" }}></label>
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => (
            <label
              key={`${field}-${opt}`}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                disabled={camposDeshabilitados}
                checked={form[field] === opt.toUpperCase()}
                onChange={() => toggleOption(field, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      {/* Información del Examen */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
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
      </SectionFieldset>

      <SectionFieldset legend="Datos Personales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          disabled
          labelWidth="120px"
        />
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="Edad (Años)"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Sexo"
            name="sexo"
            value={form.sexo}
            disabled
            labelWidth="120px"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="DNI"
            name="dni"
            value={form.dni}
            labelWidth="120px"
            disabled
          />
          <InputTextOneLine
            label="Fecha Nacimiento"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            disabled
            labelWidth="120px"
          />
        </div>
        <InputTextOneLine
          label="Lugar Nacimiento"
          name="lugarNacimiento"
          value={form.lugarNacimiento}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Estado Civil"
          name="estadoCivil"
          value={form.estadoCivil}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Nivel Estudios"
          name="nivelEstudios"
          value={form.nivelEstudios}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>
      <SectionFieldset legend="Datos Laborales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputTextOneLine
          label="Empresa"
          name="empresa"
          value={form.empresa}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Contrata"
          name="contrata"
          value={form.contrata}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Ocupación"
          name="ocupacion"
          value={form.ocupacion}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Cargo Desempeñar"
          name="cargoDesempenar"
          value={form.cargoDesempenar}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionFieldset legend="Muestra" className="space-y-3">
          <InputTextOneLine
            label="Muestra"
            name="muestra"
            value={form.muestra}
            onChange={handleChange}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("muestra")}
            onRevert={() => revertField("muestra")}
            labelWidth="120px"
          />
          {renderPresenceGroup("Color", "color", colorOptions)}
          {renderPresenceGroup("Consistencia", "consistencia", consistenciaOptions)}
          {renderPresenceGroup("Moco Fecal", "moco_fecal")}
          {renderPresenceGroup("Sangre Visible", "sangrev")}
          {renderPresenceGroup("Restos Alimenticios", "restosa")}
        </SectionFieldset>

        <SectionFieldset legend="Examen Microscópico" className="space-y-3">
          <div className="space-y-2">
            <InputTextOneLine
              label="Leucocitos"
              name="leucocitos"
              value={form.leucocitos}
              onChange={handleChange}
              disabled={camposDeshabilitados}
              edited={isFieldEdited("leucocitos")}
              onRevert={() => revertField("leucocitos")}
              labelWidth="120px"
            />
            <div className="flex items-center gap-4">
              <label className="font-semibold" style={{ minWidth: "120px", maxWidth: "120px" }}></label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={camposDeshabilitados}
                    checked={form.leucocitos === "NO SE OBSERVAN"}
                    onChange={() => toggleOption("leucocitos", "No se observan")}
                  />
                  No se observan
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={camposDeshabilitados}
                    checked={form.leucocitos?.toUpperCase().includes("X CAMPO")}
                    onChange={() => toggleCampoValue("leucocitos")}
                  />
                  __ x campo
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <InputTextOneLine
              label="Hematíes"
              name="hematies"
              value={form.hematies}
              onChange={handleChange}
              disabled={camposDeshabilitados}
              edited={isFieldEdited("hematies")}
              onRevert={() => revertField("hematies")}
              labelWidth="120px"
            />
            <div className="flex items-center gap-4">
              <label className="font-semibold" style={{ minWidth: "120px", maxWidth: "120px" }}></label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={camposDeshabilitados}
                    checked={form.hematies === "NO SE OBSERVAN"}
                    onChange={() => toggleOption("hematies", "No se observan")}
                  />
                  No se observan
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={camposDeshabilitados}
                    checked={form.hematies?.toUpperCase().includes("X CAMPO")}
                    onChange={() => toggleCampoValue("hematies")}
                  />
                  __ x campo
                </label>
              </div>
            </div>
          </div>

          {renderPresenceGroup("Parásitos", "parasitos")}
          {renderPresenceGroup("Gotas de grasa", "gotasg")}
          {renderPresenceGroup("Levaduras", "levaduras")}
        </SectionFieldset>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionFieldset legend="Identificación y Antibiograma" className="space-y-4">
          <InputTextOneLine
            label="Identificación"
            name="identificacion"
            value={form.identificacion}
            onChange={handleChange}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("identificacion")}
            onRevert={() => revertField("identificacion")}
            labelWidth="120px"
          />
          {renderPresenceGroup("Flora Coliforme", "florac", floraOptions)}
        </SectionFieldset>

        <SectionFieldset legend="Resultado" className="space-y-4">
          {renderPresenceGroup("Resultado", "resultado", resultadoOptions)}
        </SectionFieldset>
      </div>

      <SectionFieldset legend="Observaciones">
        <InputTextArea
          label="Observaciones"
          name="observaciones"
          value={form.observaciones}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("observaciones")}
          onRevert={() => revertField("observaciones")}
          rows={4}
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
        <EmpleadoComboBox
          value={form.nombre_doctorAsignado}
          label="Doctor Asignado"
          form={form}
          onChange={handleChangeSimple}
          nameField="nombre_doctorAsignado"
          idField="user_doctorAsignado"
          disabled={camposDeshabilitados}
          edited={isDoctorEdited}
          onRevert={revertDoctor}
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
