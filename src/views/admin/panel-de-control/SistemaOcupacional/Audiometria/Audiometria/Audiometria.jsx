// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Manipuladores/Coprocultivo/Coprocultivo.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faBroom,
  faPrint,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import {
  SubmitDataService,
  VerifyTR,
  PrintHojaR,
} from "./controllerAudiometria";

const tabla = "audiometria_2023";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
const chemicals = [
  "plomo",
  "mercurio",
  "tolueno",
  "xileno",
  "plaguicidas",
  "organofosforados",
];
const frecuencias = ["500", "1000", "2000", "3000", "4000", "6000", "8000"];
const initialFormState = {
  codAu: "",
  norden: "",
  fecha: today,
  dni: "",
  fechaNac: "",
  nombres: "",
  edad: "",
  nomExam: "",

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

  practica_tiro: "NO",
  uso_walkman: "NO",
  otros_antecedentes: "NO",
  cuales_antecedentes_extralaborales: "",
  otoscopia_odiocho: "Normal",
  otoscopia_odilzquierdo: "Normal",

  od_500: "",
  od_1000: "",
  od_2000: "",
  od_3000: "",
  od_4000: "",
  od_6000: "",
  od_8000: "",

  oi_500: "",
  oi_1000: "",
  oi_2000: "",
  oi_3000: "",
  oi_4000: "",
  oi_6000: "",
  oi_8000: "",

  diagnostico_od: "",
  diagnostico_oi: "",
  comentarios_audiometria: "",

  proteccion_simpleODoble: "",
  control_semestralOAnual: "",
  recomendaciones_otras: "",

  od_o_500: "",
  od_o_1000: "",
  od_o_2000: "",
  od_o_3000: "",
  od_o_4000: "",
  od_o_6000: "",
  od_o_8000: "",
  oi_o_500: "",
  oi_o_1000: "",
  oi_o_2000: "",
  oi_o_3000: "",
  oi_o_4000: "",
  oi_o_6000: "",
  oi_o_8000: "",

  empresa: "",
  contrata: "",
};
export default function Audiometria({ token, selectedSede, userlogued }) {
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleChangeNumber = (e) => {
    const { name, value } = e.target;

    // Solo permitir números (opcionalmente incluyendo vacío para poder borrar)
    if (/^\d*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleClear = () => {
    setForm(initialFormState);
    setStatus("Formulario limpiado");
  };

  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
  };
  const getNextArrayItem = (pre = "", current, post = "", array, next = "") => {
    const index = array.indexOf(current);
    if (index === -1 || index === array.length - 1) {
      return next; // No existe o ya es el último
    }
    return `${pre}${array[index + 1]}${post}`;
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
        PrintHojaR(form.norden, token, tabla);
      }
    });
  };
  const tipoHipoacusia = (promedio) => {
    let textoPromedio = "";
    if (promedio >= -10 && promedio <= 25) textoPromedio = "Normal";
    else if (promedio > 25 && promedio <= 40) textoPromedio = "Hipoacusia leve";
    else if (promedio > 40 && promedio <= 55)
      textoPromedio = "Hipoacusia moderada";
    else if (promedio > 55 && promedio <= 70)
      textoPromedio = "Hipoacusia moderada-severa";
    else if (promedio > 70 && promedio <= 90)
      textoPromedio = "Hipoacusia severa";
    else if (promedio > 90) textoPromedio = "Hipoacusia profunda";
    return textoPromedio;
  };
  const calcularOidos = () => {
    try {
      const odValues = [
        form.od_500,
        form.od_1000,
        form.od_2000,
        form.od_3000,
        form.od_4000,
        form.od_6000,
        form.od_8000,
      ]
        .map((v) => parseFloat(v) || 0)
        .filter((v) => v >= 25);

      let odPromedio = (
        odValues.reduce((acc, val) => acc + val, 0) / odValues.length
      ).toFixed(2);

      odPromedio = isNaN(odPromedio) ? 0 : odPromedio;

      console.log("Oído Derecho - Promedio:", odPromedio);

      setForm((f) => ({
        ...f,
        diagnostico_od: tipoHipoacusia(odPromedio),
      }));

      const oiValues = [
        form.oi_500,
        form.oi_1000,
        form.oi_2000,
        form.oi_3000,
        form.oi_4000,
        form.oi_6000,
        form.oi_8000,
      ]
        .map((v) => parseFloat(v) || 0)
        .filter((v) => v > 25);
      let oiPromedio = (
        oiValues.reduce((acc, val) => acc + val, 0) / oiValues.length
      ).toFixed(2);
      oiPromedio = isNaN(oiPromedio) ? 0 : oiPromedio;

      console.log("Oído Izquierdo - Promedio:", oiPromedio);

      setForm((f) => ({
        ...f,
        diagnostico_oi: tipoHipoacusia(oiPromedio) + "",
      }));
    } catch (error) {
      console.error("Error al calcular el oído derecho:", error);
      Swal.fire("Error", "No se pudo calcular el oído derecho", "error");
    }
  };

  return (
    <div className="w-full max-w-[90vw] lg:max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">AUDIOMETRIA</h2>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
              Nro Ficha:
            </label>
            <input
              name="norden"
              value={form.norden}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleClearnotO();
                  VerifyTR(form.norden, tabla, token, setForm, selectedSede);
                }
              }}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-base flex-1"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold text-base min-w-[50px] md:min-w-[90px]">
              Fecha:
            </label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-base flex-1"
            />
          </div>
        </div>
        {/* Paciente */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
              Nombres:
            </label>
            <input
              name="nombres"
              value={form.nombres}
              disabled
              className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
            />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className=" flex items-center gap-2">
              <label className="font-semibold text-base min-w-[50px]  md:min-w-[90px]">
                Edad:
              </label>
              <input
                name="edad"
                value={form.edad}
                disabled
                className="border rounded px-2 py-1 text-base w-24 bg-gray-100"
              />
            </div>

            <div className=" flex xl:justify-end items-center gap-4">
              <label className="font-semibold text-base min-w-[50px] ">
                Fecha de Nacimiento:
              </label>
              <input
                name="fechaNac"
                value={form.fechaNac}
                disabled
                className="border rounded px-2 py-1 text-base w-24 bg-gray-100 min-w-36"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
              DNI:
            </label>
            <input
              name="dni"
              value={form.dni}
              disabled
              className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
              Ex. Médico:
            </label>
            <input
              name="nomExam"
              value={form.nomExam}
              disabled
              className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
              Empresa:
            </label>
            <input
              name="empresa"
              value={form.empresa}
              disabled
              className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
              Contrata:
            </label>
            <input
              name="contrata"
              value={form.contrata}
              disabled
              className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
            <div className="border rounded p-4 mt-6">
              <h3 className="font-semibold text-lg mb-4">
                Exposición Ocupacional:
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-3">
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
                        onChange={() => {
                          handleCheckRadio("exposicion_ruido", "NO");
                          setForm((f) => ({
                            ...f,
                            promedio_horas: "",
                            anios_exposicion: "",
                            meses_exposicion: "",
                          }));
                        }}
                      />
                      NO
                    </label>
                  </div>
                  <div
                    className={`border rounded p-4 mt-6 ${
                      form.exposicion_ruido === "NO"
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
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
                          type="text"
                          name="anios_exposicion"
                          min="0"
                          max="150"
                          value={form.anios_exposicion}
                          disabled={form.exposicion_ruido === "NO"}
                          onChange={handleChangeNumber}
                          className="border rounded px-2 py-1 w-24"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label>Meses:</label>
                        <input
                          type="text"
                          name="meses_exposicion"
                          min="0"
                          max="12"
                          value={form.meses_exposicion}
                          disabled={form.exposicion_ruido === "NO"}
                          onChange={handleChangeNumber}
                          className="border rounded px-2 py-1 w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="border rounded p-4 mt-6">
              <h3 className="font-semibold text-lg mb-4">
                Exposición Ocupacional:
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-12">
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
                        onChange={() => {
                          handleCheckRadio("protectores_auditivos", "NO");
                          setForm((f) => ({
                            ...f,
                            tapones: false,
                            orejeras: false,
                          }));
                        }}
                      />
                      NO
                    </label>
                  </div>

                  <div
                    className={`border rounded p-4 mt-6 ${
                      form.protectores_auditivos === "NO"
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
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
                        onChange={() => {
                          handleCheckRadio("exposicion_quimicos", "NO");
                          setForm((f) => ({
                            ...f,
                            plomo_hrs: "",
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
                        }}
                      />
                      NO
                    </label>
                  </div>
                  {/* Químicos a los que está expuesto: */}
                  <div
                    className={`border rounded p-4 mt-6 ${
                      form.exposicion_quimicos === "NO"
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    <h3 className="font-semibold text-lg mb-4">
                      Químicos a los que está expuesto:
                    </h3>
                    <div className="grid grid-cols-7 gap-4 mb-2">
                      <div className="flex flex-col items-center">
                        <label className=" rounded  py-1 w-full  mt-7">
                          {"Hrs./dia"}
                        </label>
                        <label className="rounded  py-1 w-full ">
                          {"Tpo.(Años)"}
                        </label>
                      </div>
                      {chemicals.map((chem, index) => (
                        <div key={chem} className="flex flex-col items-center">
                          <label className="capitalize">
                            {chem.length > 5
                              ? chem.slice(0, 1).toUpperCase() +
                                chem.slice(1, 5) +
                                "."
                              : chem.slice(0, 1).toUpperCase() + chem.slice(1)}
                          </label>
                          <input
                            type="text"
                            name={`${chem}_hrs`}
                            value={form[`${chem}_hrs`] || ""}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full text-center"
                            onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                document
                                  .getElementsByName(
                                    `${getNextArrayItem(
                                      "",
                                      chem,
                                      "_hrs",
                                      chemicals,
                                      "plomo_anios"
                                    )}`
                                  )?.[0]
                                  ?.focus();
                              }
                            }}
                          />
                          <input
                            type="text"
                            name={`${chem}_anios`}
                            value={form[`${chem}_anios`] || ""}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full text-center mt-1"
                            onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();

                                document
                                  .getElementsByName(
                                    `${getNextArrayItem(
                                      "",
                                      chem,
                                      "_anios",
                                      chemicals,
                                      ""
                                    )}`
                                  )?.[0]
                                  ?.focus();
                              }
                            }}
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

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                      {/* Antecedentes Extra-Laborales: */}
                      <div className="border rounded p-4 mt-6">
                        <h3 className="font-semibold text-lg mb-4">
                          Antecedentes Extra-Laborales:
                        </h3>
                        <div className="space-y-3">
                          {[
                            ["practica_tiro", "Práctica de tiro"],
                            ["uso_walkman", "Uso de Walkman"],
                            ["otros_antecedentes", "Otros"],
                          ].map(([name, label]) => (
                            <div
                              key={name}
                              className="grid grid-cols-[100px,1fr] "
                            >
                              <label>{label}:</label>
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-1">
                                  <input
                                    type="radio"
                                    name={name}
                                    checked={form[name] === "SI"}
                                    onChange={() =>
                                      handleCheckRadio(name, "SI")
                                    }
                                  />
                                  SI
                                </label>
                                <label className="flex items-center gap-1">
                                  <input
                                    type="radio"
                                    name={name}
                                    checked={form[name] === "NO"}
                                    onChange={() =>
                                      handleCheckRadio(name, "NO")
                                    }
                                  />
                                  NO
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <label className="block font-medium mb-1">
                            Cuáles:
                          </label>
                          <input
                            type="text"
                            name="cuales_antecedentes_extralaborales"
                            value={form.cuales_antecedentes_extralaborales}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                cuales_antecedentes_extralaborales:
                                  e.target.value,
                              }))
                            }
                            className="w-full border rounded px-2 py-1 text-base"
                          />
                        </div>
                      </div>
                      {/* Otoscopia: */}
                      <div className="border rounded p-4 mt-6">
                        <h3 className="font-semibold text-lg mb-4">
                          Otoscopia:
                        </h3>
                        <div className=" w-full  space-y-3">
                          <div className="flex items-center gap-4">
                            <label className="w-40">Oído Derecho:</label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name="otoscopia_odiocho"
                                checked={form.otoscopia_odiocho.includes(
                                  "Normal"
                                )}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    otoscopia_odiocho: "Normal",
                                  }))
                                }
                              />
                              Normal
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name="otoscopia_odiocho"
                                checked={form.otoscopia_odiocho.includes(
                                  "Anormal"
                                )}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    otoscopia_odiocho: "Anormal",
                                  }))
                                }
                              />
                              Anormal
                            </label>
                          </div>
                          <input
                            name="otoscopia_odiocho"
                            value={form.otoscopia_odiocho}
                            onChange={handleChange}
                            // readOnly
                            className="border rounded px-2 py-1 text-base w-full mb-1"
                          />
                          <div className="flex gap-4">
                            <label className="w-40">Oído Izquierdo:</label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name="otoscopia_odilzquierdo"
                                checked={form.otoscopia_odilzquierdo.includes(
                                  "Normal"
                                )}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    otoscopia_odilzquierdo: "Normal",
                                  }))
                                }
                              />
                              Normal
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name="otoscopia_odilzquierdo"
                                checked={form.otoscopia_odilzquierdo.includes(
                                  "Anormal"
                                )}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    otoscopia_odilzquierdo: "Anormal",
                                  }))
                                }
                              />
                              Anormal
                            </label>
                          </div>
                          <input
                            name="otoscopia_odilzquierdo"
                            value={form.otoscopia_odilzquierdo}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 text-base w-full mb-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Audiometría*/}
        <div className="border rounded p-4 mt-6 ">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 ">
            {/* Audiometría  Área  */}
            <div className="grid grid-cols-1 gap-8 border rounded p-4 ">
              <h4 className="font-semibold text-lg ">Audiometría Aérea:</h4>
              {/* Oído Derecho */}
              <div className="flex flex-col p-4 border rounded items-center justify-center">
                <h4 className="font-medium mb-2 w-full">Oído Derecho</h4>
                <div className="grid grid-cols-8 gap-1 text-center text-sm font-semibold ">
                  <div className="flex flex-col items-start  gap-2">
                    <p>hz</p>
                    <p>dB (A)</p>
                  </div>
                  {frecuencias.map((hz) => (
                    <div key={hz}>
                      <p>{hz}</p>
                      <input
                        type="text"
                        name={`od_${hz}`}
                        value={form[`od_${hz}`] || ""}
                        onChange={handleChangeNumber}
                        // placeholder="dB"
                        className="border rounded px-1 py-1 text-center w-full"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            document
                              .getElementsByName(
                                `${getNextArrayItem(
                                  "od_",
                                  hz,
                                  "",
                                  frecuencias,
                                  "oi_500"
                                )}`
                              )?.[0]
                              ?.focus();
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Oído Izquierdo */}
              <div className="flex flex-col p-4 border rounded items-center justify-center">
                <h4 className="font-medium mb-2 w-full">Oído Izquierdo</h4>
                <div className="grid grid-cols-8 gap-1 text-center text-sm font-semibold">
                  <div className="flex flex-col items-start gap-2">
                    <p>hz</p>
                    <p>dB (A)</p>
                  </div>
                  {frecuencias.map((hz) => (
                    <div key={hz}>
                      <p>{hz}</p>
                      <input
                        type="text"
                        name={`oi_${hz}`}
                        value={form[`oi_${hz}`] || ""}
                        onChange={handleChangeNumber}
                        // placeholder="dB"
                        className="border rounded px-1 py-1 text-center w-full"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            document
                              .getElementsByName(
                                `${getNextArrayItem(
                                  "oi_",
                                  hz,
                                  "",
                                  frecuencias,
                                  ""
                                )}`
                              )?.[0]
                              ?.focus();
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnóstico y Comentarios */}
            <div className="grid grid-cols-1  gap-4 border rounded p-4">
              <div className="flex justify-between items-center ">
                <label className="font-semibold text-lg ">Diagnóstico:</label>
                <button
                  type="button"
                  onClick={() => {
                    calcularOidos();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-base px-6 py-2 rounded flex items-center gap-2 w-full  max-w-[120px]"
                >
                  <FontAwesomeIcon icon={faStethoscope} /> Diagnosticar
                </button>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Diagnóstico Oído Derecho:
                </label>
                <input
                  type="text"
                  name="diagnostico_od"
                  value={form.diagnostico_od || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Diagnóstico Oído Izquierdo:
                </label>
                <input
                  type="text"
                  name="diagnostico_oi"
                  value={form.diagnostico_oi || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Comentarios:</label>
                <textarea
                  name="comentarios_audiometria"
                  value={form.comentarios_audiometria || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  rows={3}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
            {/* Audiometría Ósea */}
            <div className="grid grid-cols-1 gap-8 border rounded p-4 ">
              <h4 className="font-semibold text-lg ">Audiometría Ósea:</h4>
              {/* Oído Derecho */}
              <div className="flex flex-col p-4 border rounded items-center justify-center">
                <h4 className="font-medium mb-2 w-full">Oído Derecho</h4>
                <div className="grid grid-cols-8 gap-1 text-center text-sm font-semibold ">
                  <div className="flex flex-col items-start  gap-2">
                    <p>hz</p>
                    <p>dB (A)</p>
                  </div>
                  {frecuencias.map((hz) => (
                    <div key={`od_o_${hz}`}>
                      <p>{hz}</p>
                      <input
                        type="text"
                        name={`od_o_${hz}`}
                        value={form[`od_o_${hz}`] || ""}
                        onChange={handleChangeNumber}
                        // placeholder="dB"
                        className="border rounded px-1 py-1 text-center w-full"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            document
                              .getElementsByName(
                                `${getNextArrayItem(
                                  "od_o_",
                                  hz,
                                  "",
                                  frecuencias,
                                  "oi_o_500"
                                )}`
                              )?.[0]
                              ?.focus();
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Oído Izquierdo */}
              <div className="flex flex-col p-4 border rounded items-center justify-center">
                <h4 className="font-medium mb-2 w-full">Oído Izquierdo</h4>
                <div className="grid grid-cols-8 gap-1 text-center text-sm font-semibold">
                  <div className="flex flex-col items-start gap-2">
                    <p>hz</p>
                    <p>dB (A)</p>
                  </div>
                  {frecuencias.map((hz) => (
                    <div key={`oi_o_${hz}`}>
                      <p>{hz}</p>
                      <input
                        type="text"
                        name={`oi_o_${hz}`}
                        value={form[`oi_o_${hz}`] || ""}
                        onChange={handleChangeNumber}
                        // placeholder="dB"
                        className="border rounded px-1 py-1 text-center w-full"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            document
                              .getElementsByName(
                                `${getNextArrayItem(
                                  "oi_o_",
                                  hz,
                                  "",
                                  frecuencias,
                                  ""
                                )}`
                              )?.[0]
                              ?.focus();
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="border rounded p-4">
              <h3 className="font-semibold text-lg mb-4">Recomendaciones:</h3>

              <div className="mb-4">
                <label className="block mb-2">
                  Uso adecuado de Protección Auditiva:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="proteccion_simpleODoble"
                      checked={form.proteccion_simpleODoble === "simple"}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          proteccion_simpleODoble: e.target.checked
                            ? "simple"
                            : "",
                        }))
                      }
                    />
                    Simple
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="proteccion_simpleODoble"
                      checked={form.proteccion_simpleODoble === "doble"}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          proteccion_simpleODoble: e.target.checked
                            ? "doble"
                            : "",
                        }))
                      }
                    />
                    Doble
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Control audiométrico:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="control_semestralOAnual"
                      checked={form.control_semestralOAnual === "semestral"}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          control_semestralOAnual: e.target.checked
                            ? "semestral"
                            : "",
                        }))
                      }
                    />
                    Semestral
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="control_semestralOAnual"
                      checked={form.control_semestralOAnual === "anual"}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          control_semestralOAnual: e.target.checked
                            ? "anual"
                            : "",
                        }))
                      }
                    />
                    Anual
                  </label>
                </div>
              </div>

              <div>
                <label className="font-medium block mb-2">Otras:</label>
                <textarea
                  name="recomendaciones_otras"
                  value={form.recomendaciones_otras || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded px-2 py-1 text-base"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                SubmitDataService(form, token, userlogued, handleClear, tabla);
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
                onChange={handleChange}
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
