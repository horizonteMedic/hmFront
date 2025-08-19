import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom } from "@fortawesome/free-solid-svg-icons";
import { SubmitDataService, VerifyTR } from "./controllerEspirometria";

const tabla = "funcion_abs";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
const initialForm = {
  norden: "",
  fecha: today,
  codExam: "",
  codAbs: "",
  nombres: "",

  edad: "",
  pasoExamen: false,
  fvc: "",
  fev1: "",
  fev1_fvc: "",
  fef: "",
  peso: "",
  talla: "",
  fvcTeorico: "",
  fev1Teorico: "",
  interpretacion: "",
};

export default function Espirometria({ token, selectedSede, userlogued }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const toggleCheckBox = (e) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: !f[name],
    }));
  };

  const handleClear = () => {
    setForm(initialForm);
  };
  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialForm, norden: prev.norden }));
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
    handleClearnotO();
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };
  const handleNextEnter = (e, nextName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementsByName(nextName)?.[0]?.focus();
    }
  };

  return (
    <div className="mx-auto bg-white rounded shadow p-6 max-w-[90%] text-[11px]">
      <h2 className="text-2xl font-bold text-center ">ESPIROMETRÍA</h2>
      {/* Encabezado */}
      <div className="grid grid-cols-2 gap-4 items-center mt-6 mb-4">
        <Field
          label="Nro Orden"
          name="norden"
          value={form.norden || ""}
          onKeyUp={handleSearch}
          onChange={handleChange}
        />
        <Field
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha || today}
          onChange={handleChange}
        />
        {/* <Field
          label="Cod Exam."
          name="codExam"
          value={form.codExam}
          disabled
          onChange={handleChange}
        /> */}
        <Field
          label="Nombres"
          name="nombres"
          value={form.nombres || ""}
          onChange={handleChange}
          className="col-span-2"
          disabled
        />
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-1">
            <label className="font-semibold">Edad</label>
            <input
              type="text"
              name="edad"
              value={form.edad || ""}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-32 bg-gray-50"
              disabled
            />
            <span>años</span>
            <label className="flex items-center font-semibold ml-4">
              <input
                type="checkbox"
                name="pasoExamen"
                checked={form.pasoExamen || false}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    fvc: e.target.checked ? "N/A" : "",
                    fev1: e.target.checked ? "N/A" : "",
                    fev1_fvc: e.target.checked ? "N/A" : "",
                    fef: e.target.checked ? "N/A" : "",
                    interpretacion: e.target.checked
                      ? "NO SE REALIZÓ ESPIROMETRÍA"
                      : "",
                  }));
                  toggleCheckBox(e);
                }}
                className="mr-1 accent-blue-600 w-5 h-5"
              />
              No Paso Examen
            </label>
          </div>
        </div>
      </div>
      <hr />
      {/* Resultados */}
      <div className="grid grid-cols-3 gap-4 items-center mt-6">
        <Field
          label="FVC %"
          name="fvc"
          value={form.fvc || ""}
          onChange={handleChange}
          onKeyDown={(e) => handleNextEnter(e, "fev1")}
        />
        <Field
          label="Peso"
          name="peso"
          value={form.peso || ""}
          onChange={handleChange}
          disabled
          inputClass="bg-blue-200"
        />
        <Field
          label="FVC Teórico"
          name="fvcTeorico"
          value={form.fvcTeorico || ""}
          onChange={handleChange}
          onKeyDown={(e) => handleNextEnter(e, "fev1Teorico")}
        />
        <Field
          label="FEV1 %"
          name="fev1"
          value={form.fev1 || ""}
          onChange={handleChange}
          onKeyDown={(e) => handleNextEnter(e, "fev1_fvc")}
        />
        <Field
          label="Talla"
          name="talla"
          value={form.talla || ""}
          onChange={handleChange}
          disabled
          inputClass="bg-blue-200"
        />
        <Field
          label="FEV1 Teórico"
          name="fev1Teorico"
          value={form.fev1Teorico || ""}
          onChange={handleChange}
          onKeyDown={(e) => handleNextEnter(e, "interpretacion")}
        />
        <Field
          label="FEV1/FVC %"
          name="fev1_fvc"
          value={form.fev1_fvc || ""}
          onChange={handleChange}
          onKeyDown={(e) => handleNextEnter(e, "fef")}
        />
        <div></div>
        <div></div>
        <Field
          label="FEF 25-75 %"
          name="fef"
          value={form.fef || ""}
          onChange={handleChange}
          onKeyDown={(e) => handleNextEnter(e, "fvcTeorico")}
        />
      </div>
      {/* Interpretación */}
      <div className="py-4">
        <label className="font-semibold block mb-1">Interpretación</label>
        <textarea
          name="interpretacion"
          value={form.interpretacion || ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full min-h-[60px]"
        />
      </div>
      {/* Acciones */}
      <div className="flex gap-4 justify-center">
        <Button onClick={handleSave} color="green" icon={faSave}>
          Guardar
        </Button>
        <Button onClick={handleClear} color="yellow" icon={faBroom}>
          Limpiar
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onKeyDown,
  className = "",
  inputClass = "",
  onKeyUp = () => {},
  style,
  disabled = false,
}) {
  return (
    <div className={`flex flex-col ${className}`} style={style}>
      <label className="font-semibold mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={`border rounded px-2 py-1 ${
          disabled ? "" : "cursor-text"
        } ${inputClass}`}
      />
    </div>
  );
}

function Button({ onClick, color, icon, children }) {
  const bg =
    color === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-yellow-400 hover:bg-yellow-500";
  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-3 py-1 rounded inline-flex items-center gap-2 text-[11px]`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  );
}
