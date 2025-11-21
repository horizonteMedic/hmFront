import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import {
  PrintHojaR,
  VerifyTR,
  SubmitDataService,
} from "./controllerCoproParasitologia";
import {
  InputTextOneLine,
  InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";

const tabla = "ac_coproparasitologico";
const colorOptions = ["MARRON", "MOSTAZA", "VERDOSO"];
const consistenciaOptions = ["SOLIDO", "SEMISOLIDO", "DIARREICO"];
const presenceOptions = ["AUSENTE", "PRESENTE"];

const muestrasConfig = [
  { id: "1", label: "MUESTRA: HECES I" },
  { id: "2", label: "MUESTRA: HECES II" },
  { id: "3", label: "MUESTRA: HECES III" },
];

const microsConfig = [
  { id: "1", label: "EXAMEN MICROSCÓPICO I" },
  { id: "2", label: "EXAMEN MICROSCÓPICO II" },
  { id: "3", label: "EXAMEN MICROSCÓPICO III" },
];

const muestraFields = [
  { key: "color", label: "Color", options: colorOptions },
  { key: "aspecto", label: "Aspecto", options: consistenciaOptions },
  { key: "moco", label: "Moco Fecal", options: presenceOptions },
  { key: "grasa", label: "Grasa", options: presenceOptions },
  { key: "sangre", label: "Sangre Visible", options: presenceOptions },
  { key: "restos", label: "Restos Alimenticios", options: presenceOptions },
];

const microsFields = [
  { key: "leucocitos", label: "Leucocitos", type: "campo" },
  { key: "hematies", label: "Hematíes", type: "campo" },
  { key: "parasitos", label: "Parásitos", type: "presence" },
];

const createInitialState = (today) => {
  const base = {
    norden: "",
    fecha: today,
    nombres: "",
    edad: "",
    observaciones: "",
    tipoCoproparasitologico: false,
  };
  muestrasConfig.forEach(({ id }) => {
    muestraFields.forEach(({ key }) => {
      base[`heces${id}_${key}`] = "";
    });
  });
  microsConfig.forEach(({ id }) => {
    microsFields.forEach(({ key }) => {
      base[`micro${id}_${key}`] = "";
    });
  });
  return base;
};

export default function Coproparasitologia() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();
  const initialFormState = useMemo(() => createInitialState(today), [today]);

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const [isCopro, setIsCopro] = useState(false);

  useEffect(() => {
    setIsCopro(Boolean(form.tipoCoproparasitologico));
  }, [form.tipoCoproparasitologico]);

  const handleToggleIsCopro = (checked) => {
    setIsCopro(checked);
    setForm((prev) => ({
      ...prev,
      tipoCoproparasitologico: checked,
    }));
  };

  const toggleValue = (field, value) => {
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
    SubmitDataService(
      form,
      token,
      userlogued,
      () => {
        handleClear();
        setIsCopro(false);
      },
      tabla,
      datosFooter
    );
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

  const renderMuestraField = (sampleId, field, disabled) => {
    const name = `heces${sampleId}_${field.key}`;
    return (
      <div key={name} className="space-y-2">
        <InputTextOneLine
          label={field.label}
          name={name}
          value={form[name]}
          onChange={handleChange}
          disabled={disabled}
          labelOnTop
        />
        <div className="flex flex-wrap gap-3">
          {field.options.map((opt) => (
            <label
              key={`${name}-${opt}`}
              className="flex items-center gap-2 text-xs md:text-sm"
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={form[name] === opt}
                onChange={() => toggleValue(name, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderMicroField = (sampleId, field, disabled) => {
    const name = `micro${sampleId}_${field.key}`;
    if (field.type === "campo") {
      return (
        <div key={name} className="space-y-2">
          <InputTextOneLine
            label={field.label}
            name={name}
            value={form[name]}
            onChange={handleChange}
            disabled={disabled}
            labelOnTop
          />
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-xs md:text-sm">
              <input
                type="checkbox"
                disabled={disabled}
                checked={form[name] === "NO SE OBSERVAN"}
                onChange={() => toggleValue(name, "NO SE OBSERVAN")}
              />
              No se observan
            </label>
            <label className="flex items-center gap-2 text-xs md:text-sm">
              <input
                type="checkbox"
                disabled={disabled}
                checked={form[name]?.toUpperCase().includes("X CAMPO")}
                onChange={() => toggleCampoValue(name)}
              />
              __ x campo
            </label>
          </div>
        </div>
      );
    }
    return (
      <div key={name} className="space-y-2">
        <InputTextOneLine
          label={field.label}
          name={name}
          value={form[name]}
          onChange={handleChange}
          disabled={disabled}
          labelOnTop
        />
        <div className="flex flex-wrap gap-3">
          {presenceOptions.map((opt) => (
            <label
              key={`${name}-${opt}`}
              className="flex items-center gap-2 text-xs md:text-sm"
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={form[name] === opt}
                onChange={() => toggleValue(name, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[90vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">PARASITOLOGÍA</h2>

      <SectionFieldset legend="Configuración">
        <label className="flex items-center gap-3 text-sm font-semibold text-red-700">
          <input
            type="checkbox"
            className="scale-110"
            checked={isCopro}
            onChange={(e) => handleToggleIsCopro(e.target.checked)}
          />
          COPROPARASITOLÓGICO
        </label>
      </SectionFieldset>

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
          inputClassName="w-20"
        />
      </SectionFieldset>

      <SectionFieldset legend="Muestras" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {muestrasConfig.map((sample, idx) => {
            const disabled = isCopro && idx > 0;
            return (
              <SectionFieldset
                key={sample.id}
                legend={sample.label}
                fieldsetClassName="border border-gray-200"
                className="space-y-4"
              >
                {muestraFields.map((field) =>
                  renderMuestraField(sample.id, field, disabled)
                )}
              </SectionFieldset>
            );
          })}
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Examen Microscópico" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {microsConfig.map((sample, idx) => {
            const disabled = isCopro && idx > 0;
            return (
              <SectionFieldset
                key={sample.id}
                legend={sample.label}
                fieldsetClassName="border border-gray-200"
                className="space-y-4"
              >
                {microsFields.map((field) =>
                  renderMicroField(sample.id, field, disabled)
                )}
              </SectionFieldset>
            );
          })}
        </div>
      </SectionFieldset>

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
          className="w-full border rounded px-3 py-2 bg-gray-100 text-sm"
        >
          <option>-- Seleccionar --</option>
        </select>
      </SectionFieldset>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
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
            onClick={() => {
              handleClear();
              setIsCopro(false);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold italic mb-2">Imprimir</span>
          <div className="flex items-center gap-2">
            <InputTextOneLine
              label=""
              name="norden"
              value={form.norden}
              onChange={handleChange}
              inputClassName="w-24"
              labelWidth="0px"
              className="w-28"
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
    </div>
  );
}
