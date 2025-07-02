// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Manipuladores/Coprocultivo/Coprocultivo.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import { SubmitCoprocultivoManipulador } from "../../Laboratorio/Manipuladores/Coprocultivo/controllerCoprocultivo";

export default function Audiometria({ token, selectedSede, userlogued }) {
  const tabla = "audiometria_2023";
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

    sordera: "NO",
    acufenos: "NO",
    vertigo: "NO",
    otalgia: "NO",
    secrecion_otica: "NO",
    otros_sintomas_orl: "",

    rinitis: "NO",
    sinusitis: "NO",
    otitis_media_cronica: "NO",
    medicamentos_ototoxicos: "NO",
    meningitis: "NO",
    tec: "NO",
    sordera_am: "NO",
    parotiditis: "NO",
    sarampion: "NO",
    tbc: "NO",
    cuales_antecedentes: "",

    exposicion_ruido: "NO",
    protectores_auditivos: "NO",
    exposicion_quimicos: "NO",

    promedio_horas: "",
    anios_exposicion: "",
    meses_exposicion: "",

    // tipo_protectores: [],
    tapones: false,
    orejeras: false,

    plomo_hrs: "", // New fields
    mercurio_hrs: "",
    tolueno_hrs: "",
    xileno_hrs: "",
    plaguicidas_hrs: "",
    organofosforados_hrs: "",
    plomo_anios: "",
    mercurio_anios: "",
    tolueno_anios: "",
    xileno_anios: "",
    plaguicidas_anios: "",
    organofosforados_anios: "",
    otros_quimicos: "",
  });
  const [status, setStatus] = useState("");

  // inicializa fecha hoy

  const handleCheckRadio = (name, value) => {
    setForm((f) => ({
      ...f,
      [name]: f[name] === value.toUpperCase() ? "" : value.toUpperCase(),
    }));
  };
  const toggleCheckBox = (name) => {
    setForm((f) => ({
      ...f,
      [name]: !f[name],
    }));
  };

  // const handleCheckRadioMultiple = (name, value) => {
  //   setForm((f) => {
  //     const currentTypes = f[name] || [];
  //     if (currentTypes.includes(value)) {
  //       return { ...f, [name]: currentTypes.filter((v) => v !== value) };
  //     } else {
  //       return { ...f, [name]: [...currentTypes, value] };
  //     }
  //   });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleClear = () => {
    setForm((f) => ({
      ...f,
      norden: "",
      fecha: today,
      nombres: "",
      edad: "",

      sordera: "NO",
      acufenos: "NO",
      vertigo: "NO",
      otalgia: "NO",
      secrecion_otica: "NO",
      otros_sintomas_orl: "",

      rinitis: "NO",
      sinusitis: "NO",
      otitis_media_cronica: "NO",
      medicamentos_ototoxicos: "NO",
      meningitis: "NO",
      tec: "NO",
      sordera_am: "NO",
      parotiditis: "NO",
      sarampion: "NO",
      tbc: "NO",
      cuales_antecedentes: "",

      exposicion_ruido: "NO",
      protectores_auditivos: "NO",
      exposicion_quimicos: "NO",

      promedio_horas: "",
      anios_exposicion: "",
      meses_exposicion: "",

      // tipo_protectores: [],
      tapones: false,
      orejeras: false,

      plomo_hrs: "", // New fields
      mercurio_hrs: "",
      tolueno_hrs: "",
      xileno_hrs: "",
      plaguicidas_hrs: "",
      organofosforados_hrs: "",
      plomo_anios: "",
      mercurio_anios: "",
      tolueno_anios: "",
      xileno_anios: "",
      plaguicidas_anios: "",
      organofosforados_anios: "",
      otros_quimicos: "",
    }));
  };

  const handleClearnotO = () => {
    setForm((f) => ({
      ...f,
      fecha: today,
      nombres: "",
      edad: "",
    }));
  };

  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Audiometría?",
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
        // PrintHojaR(form.norden, token, tabla);
      }
    });
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">AUDIOMETRIA</h2>
      <div className="space-y-6">
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
                  handleClearnotO();
                  // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
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

        {/* Primera fila*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Síntomas Actuales */}
            <div className="border rounded p-4 mt-6">
              <h3 className="font-semibold text-lg mb-4">Síntomas Actuales:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Columna 1 */}
                <div className="space-y-2">
                  {[
                    ["sordera", "Sordera"],
                    ["acufenos", "Acúfenos"],
                    ["vertigo", "Vértigo"],
                    ["otalgia", "Otalgia"],
                    ["secrecion_otica", "Secreción Ótica"],
                  ].map(([name, label]) => (
                    <div className="flex items-center gap-4" key={name}>
                      <label className="w-40">{label}:</label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={name}
                          checked={form[name] === "SI"}
                          onChange={() => handleCheckRadio(name, "SI")}
                        />
                        SI
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={name}
                          checked={form[name] === "NO"}
                          onChange={() => handleCheckRadio(name, "NO")}
                        />
                        NO
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuáles */}
              <div className="mt-4">
                <label className="block font-medium mb-1">
                  Otros síntomas ORL:
                </label>
                <input
                  type="text"
                  name="otros_sintomas_orl"
                  value={form.otros_sintomas_orl}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      otros_sintomas_orl: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1 text-base"
                />
              </div>
            </div>
            {/* Antecedentes Médicos de importancia */}
            <div className="border rounded p-4 mt-6">
              <h3 className="font-semibold text-lg mb-4">
                Antecedentes Médicos de importancia:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Columna 1 */}
                <div className="space-y-2">
                  {[
                    ["rinitis", "Rinitis"],
                    ["sinusitis", "Sinusitis"],
                    ["otitis_media_cronica", "Otitis Media Crónica"],
                    ["medicamentos_ototoxicos", "Medicamentos Ototóxicos"],
                    ["meningitis", "Meningitis"],
                  ].map(([name, label]) => (
                    <div className="flex items-center gap-4" key={name}>
                      <label className="w-40">{label}:</label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={name}
                          checked={form[name] === "SI"}
                          onChange={() => handleCheckRadio(name, "SI")}
                        />
                        SI
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={name}
                          checked={form[name] === "NO"}
                          onChange={() => handleCheckRadio(name, "NO")}
                        />
                        NO
                      </label>
                    </div>
                  ))}
                </div>

                {/* Columna 2 */}
                <div className="space-y-2">
                  {[
                    ["tec", "TEC"],
                    ["sordera_am", "Sordera"],
                    ["parotiditis", "Parotiditis"],
                    ["sarampion", "Sarampión"],
                    ["tbc", "TBC"],
                  ].map(([name, label]) => (
                    <div className="flex items-center gap-4" key={name}>
                      <label className="w-40">{label}:</label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={name}
                          checked={form[name] === "SI"}
                          onChange={() => handleCheckRadio(name, "SI")}
                        />
                        SI
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={name}
                          checked={form[name] === "NO"}
                          onChange={() => handleCheckRadio(name, "NO")}
                        />
                        NO
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuáles */}
              <div className="mt-4">
                <label className="block font-medium mb-1">Cuáles:</label>
                <input
                  type="text"
                  name="cuales_antecedentes"
                  value={form.cuales_antecedentes}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      cuales_antecedentes: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1 text-base"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="border rounded p-4 mt-6">
              <h3 className="font-semibold text-lg mb-4">
                Exposición Ocupacional:
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Columna 1 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="w-40">Exposición al ruido:</label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={"exposicion_ruido"}
                        checked={form.exposicion_ruido === "SI"}
                        onChange={() =>
                          handleCheckRadio("exposicion_ruido", "SI")
                        }
                      />
                      SI
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={"exposicion_ruido"}
                        checked={form.exposicion_ruido === "NO"}
                        onChange={() =>
                          handleCheckRadio("exposicion_ruido", "NO")
                        }
                      />
                      NO
                    </label>
                  </div>

                  <div className="border rounded p-4 mt-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Exposición a Ruido (Promedio de horas por día)
                    </h3>

                    {/* Primera fila */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                      {["0-2", "4-6", "8-10", ">12"].map((val) => (
                        <label className="flex items-center gap-2" key={val}>
                          <input
                            type="radio"
                            name="promedio_horas"
                            checked={form.promedio_horas === val}
                            disabled={form.exposicion_ruido === "NO"}
                            onChange={() =>
                              setForm((f) => ({ ...f, promedio_horas: val }))
                            }
                          />
                          {val}
                        </label>
                      ))}
                    </div>

                    {/* Segunda fila */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {["2-4", "6-8", "10-12", "eventual"].map((val) => (
                        <label className="flex items-center gap-2" key={val}>
                          <input
                            type="radio"
                            name="promedio_horas"
                            checked={form.promedio_horas === val}
                            disabled={form.exposicion_ruido === "NO"}
                            onChange={() =>
                              setForm((f) => ({ ...f, promedio_horas: val }))
                            }
                          />
                          {val === "eventual" ? "Eventual" : val}
                        </label>
                      ))}
                    </div>

                    {/* Años y meses de exposición */}
                    <div className="flex gap-6 flex-wrap items-center">
                      <div className="flex items-center gap-2">
                        <label>Años de Exposición (Aprox.):</label>
                        <input
                          type="number"
                          name="anios_exposicion"
                          min="0"
                          max="150"
                          value={form.anios_exposicion}
                          disabled={form.exposicion_ruido === "NO"}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              anios_exposicion: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1 w-24"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label>Meses:</label>
                        <input
                          type="number"
                          name="meses_exposicion"
                          min="0"
                          max="12"
                          value={form.meses_exposicion}
                          disabled={form.exposicion_ruido === "NO"}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              meses_exposicion: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1 w-24"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-40">
                      Uso de Protectores Auditivos:
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={"protectores_auditivos"}
                        checked={form.protectores_auditivos === "SI"}
                        onChange={() =>
                          handleCheckRadio("protectores_auditivos", "SI")
                        }
                      />
                      SI
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={"protectores_auditivos"}
                        checked={form.protectores_auditivos === "NO"}
                        onChange={() =>
                          handleCheckRadio("protectores_auditivos", "NO")
                        }
                      />
                      NO
                    </label>
                  </div>

                  <div className="border rounded p-4 mt-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Tipo de Protectores:
                    </h3>
                    <div className="flex  gap-2">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          name="tapones"
                          value={form.tapones}
                          disabled={form.protectores_auditivos === "NO"}
                          checked={form.tapones}
                          onChange={() => toggleCheckBox("tapones")}
                        />
                        Tapones
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          name="orejeras"
                          value={form.orejeras}
                          disabled={form.protectores_auditivos === "NO"}
                          checked={form.orejeras}
                          onChange={() => toggleCheckBox("orejeras")}
                        />
                        Orejeras
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-40">
                      Exposición a sustancias químicas:
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={"exposicion_quimicos"}
                        checked={form.exposicion_quimicos === "SI"}
                        onChange={() =>
                          handleCheckRadio("exposicion_quimicos", "SI")
                        }
                      />
                      SI
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={"exposicion_quimicos"}
                        checked={form.exposicion_quimicos === "NO"}
                        onChange={() =>
                          handleCheckRadio("exposicion_quimicos", "NO")
                        }
                      />
                      NO
                    </label>
                  </div>
                  <div className="border rounded p-4 mt-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Químicos a los que está expuesto:
                    </h3>
                    <div className="grid grid-cols-7 gap-4 mb-2">
                      <div className="flex flex-col items-center">
                        <label className=" rounded  py-1 w-full text-center mt-7">{"ga2"}</label>
                        <label className=" rounded px-2 py-1 w-full text-center">{"ga3"}</label>
                      </div>
                      {[
                        "plomo",
                        "mercurio",
                        "tolueno",
                        "xileno",
                        "plaguicidas",
                        "organofo.",
                      ].map((chem) => (
                        <div key={chem} className="flex flex-col items-center">
                          <label className="capitalize">{chem}</label>
                          <input
                            type="text"
                            name={`${chem}_hrs`}
                            value={form[`${chem}_hrs`] || ""}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full text-center"
                            // placeholder="Hrs./día"
                          />
                          <input
                            type="text"
                            name={`${chem}_anios`}
                            value={form[`${chem}_anios`] || ""}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full text-center mt-1"
                            // placeholder="Años"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="block font-medium mb-1">
                        Otros (detallar):
                      </label>
                      <input
                        type="text"
                        name="otros_quimicos"
                        value={form.otros_quimicos}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1 text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              // type="submit"
              onClick={() => {
                // SubmitCoprocultivoManipulador(
                //   form,
                //   token,
                //   userlogued,
                //   handleClear,
                //   tabla
                // );
              }}
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
                onClick={() => {
                  //handlePrint
                }}
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
