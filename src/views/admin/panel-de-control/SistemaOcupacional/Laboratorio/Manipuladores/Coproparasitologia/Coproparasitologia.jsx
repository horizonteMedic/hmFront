// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Manipuladores/Coproparasitologia/Coproparasitologia.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  PrintHojaR,
  VerifyTR,
  SubmitCoproParasitologiaManipulador,
} from "./controllerCoproParasitologia";
import Swal from "sweetalert2";

const muestraLabels = [
  { key: "heces1", label: "MUESTRA: HECES I" },
  { key: "heces2", label: "MUESTRA: HECES II" },
  { key: "heces3", label: "MUESTRA: HECES III" },
];

const microsLabels = [
  { key: "micro1", label: "EXAMEN MICROSCOPICO I" },
  { key: "micro2", label: "EXAMEN MICROSCOPICO II" },
  { key: "micro3", label: "EXAMEN MICROSCOPICO III" },
];

export default function Coproparasitologia({
  token,
  selectedSede,
  userlogued,
}) {
  const tabla = "ac_coproparasitologico";
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

  // Inicializar valores estructurados
  const initial = {};
  muestraLabels.forEach(({ key }) => {
    initial[key] = {
      color: "",
      aspecto: "",
      moco: "",
      grasa: "",
      sangre: "",
      restos: "",
    };
  });
  microsLabels.forEach(({ key }) => {
    initial[key] = {
      leucocitos: "",
      leucocitosCount: "",
      hematies: "",
      hematiesCount: "",
      parasitos: "",
    };
  });
  initial.norden = "";
  initial.fecha = today;

  const [values, setValues] = useState(initial);
  const [isCopro, setIsCopro] = useState(false);
  const [status, setStatus] = useState("");

  const handleFieldChange = (section, field, value) => {
    setValues((v) => ({
      ...v,
      [section]: {
        ...v[section],
        [field]:
          v[section][field] === value.toUpperCase() ? "" : value.toUpperCase(),
      },
    }));
  };

  const handleClear = () => {
    setValues(initial);
    setIsCopro(false);
    setStatus("Formulario limpiado");
  };

  const handlePrint = () => {
    if (!values.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Parasitología?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${values.norden}</b></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(values.norden, token, tabla);
      }
    });
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">PARASITOLOGÍA</h2>

      <div className="flex items-center mb-4">
        <input
          id="copro"
          type="checkbox"
          checked={isCopro}
          onChange={(e) => setIsCopro(e.target.checked)}
          className="mr-2 scale-110"
        />
        <label htmlFor="copro" className="font-semibold text-red-600">
          COPROPARASITOLOGICO
        </label>
      </div>

      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input
              name="norden"
              value={values.norden}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  VerifyTR(
                    values.norden,
                    tabla,
                    token,
                    setValues,
                    selectedSede
                  );
                }
              }}
              onChange={(e) =>
                setValues((f) => ({ ...f, [e.target.name]: e.target.value }))
              }
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={values.fecha}
              onChange={(e) =>
                setValues((f) => ({ ...f, [e.target.name]: e.target.value }))
              }
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[90px]">Nombres:</label>
            <input
              name="nombres"
              value={values.nombres}
              disabled
              className="border rounded px-2 py-1 flex-1 bg-gray-100"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold">Edad:</label>
            <input
              name="edad"
              value={values.edad}
              disabled
              className="border rounded px-2 py-1 w-24 bg-gray-100"
            />
          </div>
        </div>

        {/* Campos de muestras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {muestraLabels.map(({ key, label }, idx) => (
            <fieldset
              key={key}
              disabled={isCopro && idx > 0}
              className="bg-gray-100 border border-gray-300 rounded-md p-4"
            >
              <legend className="font-bold text-blue-900 mb-4">{label}</legend>
              {["color", "aspecto", "moco", "grasa", "sangre", "restos"].map(
                (field) => (
                  <div key={field} className="mb-4">
                    <label className="block font-semibold mb-1 capitalize">
                      {field === "sangre"
                        ? "Sangre Visible"
                        : field === "restos"
                        ? "Restos"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      value={values[key][field]}
                      onChange={(e) =>
                        handleFieldChange(key, field, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full mb-2"
                    />
                    <div className="flex flex-wrap gap-3">
                      {(field === "color"
                        ? ["MARRON", "MOSTAZA", "VERDOSO"]
                        : field === "aspecto"
                        ? ["SOLIDO", "SEMISOLIDO", "DIARREICO"]
                        : ["Ausente", "Presente"]
                      ).map((opt) => (
                        <label key={opt} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            onChange={() => handleFieldChange(key, field, opt)}
                            checked={values[key][field] === opt.toUpperCase()}
                            disabled={isCopro && idx > 0}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                )
              )}
            </fieldset>
          ))}
        </div>

        {/* Campos microscopio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {microsLabels.map(({ key, label }, idx) => (
            <fieldset
              key={key}
              disabled={isCopro && idx > 0}
              className="bg-gray-100 border border-gray-300 rounded-md p-4"
            >
              <legend className="font-bold text-blue-900 mb-4">{label}</legend>
              {["leucocitos", "hematies", "parasitos"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block font-semibold mb-1 capitalize">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    value={values[key][field]}
                    onChange={(e) =>
                      handleFieldChange(key, field, e.target.value)
                    }
                    className="border rounded px-2 py-1 w-full mb-2"
                  />
                  <div className="flex flex-wrap gap-3 items-center">
                    {["leucocitos", "hematies"].includes(field) && (
                      <input
                        placeholder="__x campo"
                        value={values[key][field + "Count"]}
                        onChange={(e) =>
                          handleFieldChange(
                            key,
                            field + "Count",
                            e.target.value
                          )
                        }
                        disabled={isCopro && idx > 0}
                        className="border rounded px-2 py-1 w-24"
                      />
                    )}
                    {(["parasitos"].includes(field)
                      ? ["Ausente", "Presente"]
                      : ["No se observan"]
                    ).map((opt) => (
                      <label key={opt} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          onChange={() => handleFieldChange(key, field, opt)}
                          checked={values[key][field] === opt.toUpperCase()}
                          disabled={isCopro && idx > 0}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>
          ))}
        </div>

        {/* Médico */}
        <div className="my-6">
          <label className="block font-semibold mb-1">ASIGNAR MÉDICO:</label>
          <select
            disabled
            className="w-full border rounded px-2 py-1 bg-gray-100"
          >
            <option>--Seleccione--</option>
          </select>
        </div>

        {/* Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                SubmitCoproParasitologiaManipulador(
                  { ...values, isCopro },
                  token,
                  userlogued,
                  handleClear,
                  tabla
                );
              }}
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
            <span className="font-bold text-blue-900 italic mb-1">
              IMPRIMIR
            </span>
            <div className="flex gap-2">
              <input
                name="norden"
                value={values.norden}
                onChange={(e) =>
                  setValues((f) => ({ ...f, [e.target.name]: e.target.value }))
                }
                className="border rounded px-2 py-1 w-24"
              />
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>

        {status && <p className="mt-4 text-center text-green-600">{status}</p>}
      </div>
    </div>
  );
}
