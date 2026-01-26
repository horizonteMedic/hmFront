import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import {
  InputTextOneLine,
  InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { PrintHojaR, VerifyTR, SubmitDataService } from "./controllerCoprocultivo";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const tabla = "ac_coprocultivo";
const colorOptions = ["Marrón", "Mostaza", "Verdoso"];
const consistenciaOptions = ["Sólido", "Semisólido", "Diarreico"];
const presenceOptions = ["Ausente", "Presente"];
const floraOptions = ["Presente", "Regular cantidad"];
const resultadoOptions = ["Negativo", "Positivo"];

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
  } = useForm(initialFormState);

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
    SubmitDataService(form, token, userlogued, handleClear);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
    });
  };


  const renderPresenceGroup = (label, field, options = presenceOptions, disabledInput = true) => (
    <div className="space-y-2">
      <InputTextOneLine
        label={label}
        name={field}
        value={form[field]}
        onChange={handleChange}
        disabled={disabledInput}
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
      {/* Información del Examen */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onChange={handleChangeNumberDecimals}
          onKeyUp={handleSearch}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
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
              labelWidth="120px"
            />
            <div className="flex items-center gap-4">
              <label className="font-semibold" style={{ minWidth: "120px", maxWidth: "120px" }}></label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.leucocitos === "NO SE OBSERVAN"}
                    onChange={() => toggleOption("leucocitos", "No se observan")}
                  />
                  No se observan
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
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
              labelWidth="120px"
            />
            <div className="flex items-center gap-4">
              <label className="font-semibold" style={{ minWidth: "120px", maxWidth: "120px" }}></label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.hematies === "NO SE OBSERVAN"}
                    onChange={() => toggleOption("hematies", "No se observan")}
                  />
                  No se observan
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
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
          rows={4}
        />
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
        <EmpleadoComboBox
          value={form.nombre_doctorAsignado}
          label="Doctor Asignado"
          form={form}
          onChange={handleChangeSimple}
          nameField="nombre_doctorAsignado"
          idField="user_doctorAsignado"
        />
      </SectionFieldset>

      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}

