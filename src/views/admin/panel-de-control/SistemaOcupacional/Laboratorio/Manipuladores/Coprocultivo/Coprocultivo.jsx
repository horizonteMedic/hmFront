// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Manipuladores/Coprocultivo/Coprocultivo.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
import { PrintHojaR, VerifyTR,SubmitCoprocultivoManipulador } from "./controllerCoprocultivo";
import Swal from "sweetalert2";

export default function Coprocultivo({ token, selectedSede, userlogued }) {
  const tabla = "ac_coprocultivo";
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

  const [form, setForm] = useState({
    norden: "",
    fecha: today,
    nombres: "",
    edad: "",
    // MUESTRA
    muestra: "HECES",
    color: "",
    consistencia: "",
    moco_fecal: "",
    sangrev: "",
    restosa: "",
    // MICROSCÓPICO
    leucocitos: "",
    leucocitos_count: "",
    hematies: "",
    hematies_count: "",
    parasitos: "",
    gotasg: "",
    levaduras: "",
    // IDENTIFICACIÓN
    identificacion: "Escherichia coli(*)",
    florac: "",
    // RESULTADO
    resultado: "",
    // OBSERVACIONES
    observaciones:
      "No se aisló Escherichia Coli Enteroinvasiva - Enteropatógena - Enterohemorrágica.\nNo se aisló bacteria patógenas.",
  });
  const [status, setStatus] = useState("");

  // inicializa fecha hoy

  const handleCheckRadio = (name, value) => {
    setForm((f) => ({
      ...f,
      [name]: f[name] === value.toUpperCase() ? "" : value.toUpperCase(),
    }));
  };
  const handleCheckRadioXValue = (name) => {
    setForm((f) => ({
      ...f,
      [name]: f[name].toUpperCase().includes("X CAMPO") ? "" : /\d/.test(f[name]) ? f[name] + " X CAMPO" : " X CAMPO",
    }));
  };

  const handleClear = () => {
    setForm((f) => ({
      ...f,
      norden: "",
      fecha: today,
      nombres: "",
      edad: "",
      // MUESTRA
      muestra: "HECES",
      color: "",
      consistencia: "",
      moco_fecal: "",
      sangrev: "",
      restosa: "",
      // MICROSCÓPICO
      leucocitos: "",
      leucocitos_count: "",
      hematies: "",
      hematies_count: "",
      parasitos: "",
      gotasg: "",
      levaduras: "",
      // IDENTIFICACIÓN
      identificacion: "Escherichia coli(*)",
      florac: "",
      // RESULTADO
      resultado: "",
      // OBSERVACIONES
      observaciones:
        "No se aisló Escherichia Coli Enteroinvasiva - Enteropatógena - Enterohemorrágica.\nNo se aisló bacteria patógenas.",
      }));
    setStatus("Formulario limpiado");
  };

  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Coprocultivo?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
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
        PrintHojaR(form.norden, token, tabla);
      }
    });
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">COPROCULTIVO</h2>
      <div
        className="space-y-6"
      >
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[90px] text-base">
              Nro Ficha:
            </label>
            <input
              name="norden"
              value={form.norden}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  VerifyTR(form.norden, tabla, token, setForm, selectedSede);
                }
              }}
              onChange={(e) =>
                setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
              }
              className="border rounded px-2 py-1 text-base flex-1"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold text-base">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={(e) =>
                setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
              }
              className="border rounded px-2 py-1 text-base flex-1"
            />
          </div>
        </div>
        {/* Paciente */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[90px] text-base">
              Nombres:
            </label>
            <input
              name="nombres"
              value={form.nombres}
              disabled
              className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold text-base">Edad:</label>
            <input
              name="edad"
              value={form.edad}
              disabled
              className="border rounded px-2 py-1 text-base w-24 bg-gray-100"
            />
          </div>
        </div>

        {/* Primera fila: MUESTRA | EXAMEN MICROSCÓPICO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MUESTRA */}
          <fieldset className="bg-gray-100 border border-gray-300 rounded-md p-4">
            <legend className="font-bold text-base mb-4">MUESTRA</legend>
            <div className="space-y-3">
              {/* Muestra text */}
              <div>
                <label className="block font-semibold text-base mb-1">
                  Muestra:
                </label>
                <input
                  name="muestra"
                  value={form.muestra}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
                  }
                  className="border rounded px-2 py-1 text-base w-full"
                />
              </div>
              {/* Color */}
              <div>
                <label className="block font-semibold text-base mb-1">
                  Color:
                </label>
                <input
                  name="color"
                  value={form.color}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex flex-wrap gap-3">
                  {["Marrón", "Mostaza", "Verdoso"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="color"
                        value={opt}
                        onChange={() => handleCheckRadio("color", opt)}
                        checked={form.color === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* Consistencia */}
              <div>
                <label className="block font-semibold text-base mb-1">
                  Consistencia:
                </label>
                <input
                  name="consistencia"
                  value={form.consistencia}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex flex-wrap gap-3">
                  {["Sólido", "Semisólido", "Diarreico"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="consistencia"
                        value={opt}
                        onChange={() => handleCheckRadio("consistencia", opt)}
                        checked={form.consistencia === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* Moco Fecal */}
              <div>
                <label className="block font-semibold text-base mb-1">
                  Moco Fecal:
                </label>
                <input
                  name="moco_fecal"
                  value={form.moco_fecal}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex flex-wrap gap-3">
                  {["Ausente", "Presente"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="moco_fecal"
                        value={opt}
                        onChange={() => handleCheckRadio("moco_fecal", opt)}
                        checked={form.moco_fecal === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* Sangre Visible */}
              <div>
                <label className="block font-semibold text-base mb-1">
                  Sangre Visible:
                </label>
                <input
                  name="sangrev"
                  value={form.sangrev}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex flex-wrap gap-3">
                  {["Ausente", "Presente"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="sangrev"
                        value={opt}
                        onChange={() => handleCheckRadio("sangrev", opt)}
                        checked={form.sangrev === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* Restos Alim. */}
              <div>
                <label className="block font-semibold text-base mb-1">
                  Restos Alimenticios:
                </label>
                <input
                  name="restosa"
                  value={form.restosa}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex flex-wrap gap-3">
                  {["Ausente", "Presente"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="restosa"
                        value={opt}
                        onChange={() => handleCheckRadio("restosa", opt)}
                        checked={form.restosa === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* EXAMEN MICROSCÓPICO */}
          <fieldset className="bg-gray-100 border border-gray-300 rounded-md p-4">
            <legend className="font-bold text-base mb-4">
              EXAMEN MICROSCÓPICO
            </legend>
            <div className="space-y-3">
              {/* Leucocitos */}
              <div className="flex flex-col">
                <label className="block font-semibold text-base mb-1">
                  Leucocitos:
                </label>
                <input
                  name="leucocitos"
                  value={form.leucocitos}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
                  }
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-base">
                    <input
                      type="checkbox"
                      name="leucocitos"
                      value="No se observan"
                      onChange={() =>
                        handleCheckRadio("leucocitos", "No se observan")
                      }
                      checked={
                        form.leucocitos === "No se observan".toUpperCase()
                      }
                    />
                    No se observan
                  </label>                  
                  <label className="flex items-center gap-1 text-base">
                    <input
                      type="checkbox"
                      name="leucocitos"
                      value="__x campo"
                      onChange={() =>
                        handleCheckRadioXValue("leucocitos") 
                      }
                      checked={
                        form.leucocitos.toUpperCase().includes("X CAMPO")
                      }
                    />
                    __x campo
                  </label>
                </div>
              </div>
              {/* Hematíes */}
              <div className="flex flex-col">
                <label className="block font-semibold text-base mb-1">
                  Hematíes:
                </label>
                <input
                  name="hematies"
                  value={form.hematies}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
                  }
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-base">
                    <input
                      type="checkbox"
                      name="hematies"
                      value="No se observan"
                      onChange={() =>
                        handleCheckRadio("hematies", "No se observan")
                      }
                      checked={
                        form.hematies === "No se observan".toUpperCase()
                      }
                    />
                    No se observan
                  </label>                  
                  <label className="flex items-center gap-1 text-base">
                    <input
                      type="checkbox"
                      name="hematies"
                      value="__x campo"
                      onChange={() =>
                        handleCheckRadioXValue("hematies")
                      }
                      checked={
                        form.hematies.toUpperCase().includes("X CAMPO")
                      }
                    />
                    __x campo
                  </label>
                </div>
              </div>
              {/* Parásitos */}
              <div className="flex flex-col">
                <label className="block font-semibold text-base mb-1">
                  Parásitos:
                </label>
                <input
                  name="parasitos"
                  value={form.parasitos}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex gap-3">
                  {["Ausente", "Presente"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="parasitos"
                        value={opt}
                        onChange={() => handleCheckRadio("parasitos", opt)}
                        checked={form.parasitos === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* Gotas de grasa */}
              <div className="flex flex-col">
                <label className="block font-semibold text-base mb-1">
                  Gotas de grasa:
                </label>
                <input
                  name="gotasg"
                  value={form.gotasg}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex gap-3">
                  {["Ausente", "Presente"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="gotasg"
                        value={opt}
                        onChange={() => handleCheckRadio("gotasg", opt)}
                        checked={form.gotasg === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* Levaduras */}
              <div className="flex flex-col">
                <label className="block font-semibold text-base mb-1">
                  Levaduras:
                </label>
                <input
                  name="levaduras"
                  value={form.levaduras}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex gap-3">
                  {["Ausente", "Presente"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="levaduras"
                        value={opt}
                        onChange={() => handleCheckRadio("levaduras", opt)}
                        checked={form.levaduras === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Segunda fila: IDENTIFICACIÓN Y ANTIBIOGRAMA | RESULTADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IDENTIFICACIÓN Y ANTIBIOGRAMA */}
          <fieldset className="bg-gray-100 border border-gray-300 rounded-md p-4">
            <legend className="font-bold text-base mb-4">
              IDENTIFICACIÓN Y ANTIBIOGRAMA
            </legend>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-base mb-1">
                  Identificación:
                </label>
                <input
                  name="identificacion"
                  value={form.identificacion}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
                  }
                  className="border rounded px-2 py-1 text-base w-full"
                />
              </div>
              <div>
                <label className="block font-semibold text-base mb-1">
                  Flora Coliforme:
                </label>
                <input
                  name="florac"
                  value={form.florac}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex gap-3">
                  {["Presente", "Regular cantidad"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="florac"
                        value={opt}
                        onChange={() => handleCheckRadio("florac", opt)}
                        checked={form.florac === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* RESULTADO */}
          <fieldset className="bg-gray-100 border border-gray-300 rounded-md p-4">
            <legend className="font-bold text-base mb-4">RESULTADO</legend>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-base mb-1">
                  Resultado:
                </label>
                <input
                  name="resultado"
                  value={form.resultado}
                  readOnly
                  placeholder="—"
                  className="border rounded px-2 py-1 text-base w-full mb-1"
                />
                <div className="flex gap-3">
                  {["Negativo", "Positivo"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1 text-base"
                    >
                      <input
                        type="checkbox"
                        name="resultado"
                        value={opt}
                        onChange={() => handleCheckRadio("resultado", opt)}
                        checked={form.resultado === opt.toUpperCase()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block font-semibold text-base mb-1">
            Observaciones:
          </label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={(e) =>
              setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
            }
            rows={4}
            className="border rounded px-2 py-1 text-base w-full"
          />
        </div>

        {/* Asignar Médico */}
        <div>
          <label className="block font-semibold text-base mb-1">
            ASIGNAR MÉDICO:
          </label>
          <select
            disabled
            className="w-full border rounded px-2 py-1 bg-gray-100 text-base"
          >
            <option>--Seleccione--</option>
          </select>
        </div>

        {/* Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              // type="submit"
              onClick={() =>{SubmitCoprocultivoManipulador(form, token, userlogued, handleClear, tabla);}}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
            <div className="flex items-center gap-2">
              <input
                name="norden"
                value={form.norden}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
                }
                className="border rounded px-2 py-1 text-base w-24"
              />

              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>

        {status && (
          <p className="mt-4 text-center text-green-600 text-base">{status}</p>
        )}
      </div>
    </div>
  );
}
