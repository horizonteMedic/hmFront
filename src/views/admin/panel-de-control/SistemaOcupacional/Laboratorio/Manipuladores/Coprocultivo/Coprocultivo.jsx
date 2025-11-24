import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import {
  InputTextOneLine,
  InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { PrintHojaR, VerifyTR, SubmitDataService } from "./controllerCoprocultivo";

const tabla = "ac_coprocultivo";
const colorOptions = ["Marrón", "Mostaza", "Verdoso"];
const consistenciaOptions = ["Sólido", "Semisólido", "Diarreico"];
const presenceOptions = ["Ausente", "Presente"];
const floraOptions = ["Presente", "Regular cantidad"];
const resultadoOptions = ["Negativo", "Positivo"];

export default function Coprocultivo() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: "",
    fecha: today,
    nombres: "",
    edad: "",
    muestra: "HECES",
    color: "",
    consistencia: "",
    moco_fecal: "",
    sangrev: "",
    restosa: "",
    leucocitos: "",
    leucocitos_count: "",
    hematies: "",
    hematies_count: "",
    parasitos: "",
    gotasg: "",
    levaduras: "",
    identificacion: "Escherichia coli(*)",
    florac: "",
    resultado: "",
    observaciones:
      "No se aisló Escherichia Coli Enteroinvasiva - Enteropatógena - Enterohemorrágica.\nNo se aisló bacteria patógenas.",
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const toggleOption = (field, value) => {
    const normalized = value.toUpperCase();
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] === normalized ? "" : normalized,
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
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
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
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">COPROCULTIVO</h2>
      <form className="space-y-6">
        <SectionFieldset
          legend="Información del Examen"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <InputTextOneLine
            label="N° Ficha"
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={handleSearch}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Nombres"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
            inputClassName="w-24"
          />
        </SectionFieldset>

        <SectionFieldset legend="Muestra" className="space-y-4">
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

        <SectionFieldset legend="Examen Microscópico" className="space-y-4">
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

        <SectionFieldset legend="Asignar Médico">
          <select
            disabled
            className="w-full border rounded px-2 py-1 bg-gray-100"
          >
            <option>-- Seleccionar --</option>
          </select>
        </SectionFieldset>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-bold italic mb-2">Imprimir</span>
            <div className="flex items-center gap-2">
              <InputTextOneLine
                name="norden"
                value={form.norden}
                onChange={handleChange}
                inputClassName="w-24"
              />
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

