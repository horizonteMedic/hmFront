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
} from "../Audiometria/controllerAudiometria";

export default function AudiometriaOhla({ token, selectedSede, userlogued }) {
  const tabla = "audiometria_2023";
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

  const frecuencias = ["500", "1000", "2000", "3000", "4000", "6000", "8000"];

  const initialFormState = {
    codAu: "",
    norden: "",
    fecha: today,
    fechaNac: "",
    nombres: "",
    edad: "",
    dni: "",
    nomExam: "",
    no_paso_Examen: false,
    activar_grafico: false,

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

    od_o_500: "",
    od_o_1000: "",
    od_o_2000: "",
    od_o_3000: "",
    od_o_4000: "",
    od_o_6000: "",
    od_o_8000: "",

    llenar_osea: false,
    oi_o_500: "",
    oi_o_1000: "",
    oi_o_2000: "",
    oi_o_3000: "",
    oi_o_4000: "",
    oi_o_6000: "",
    oi_o_8000: "",

    perdida_global: "",
    asignar_especialista: false,

    //antiguos
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

    diagnostico_od: "",
    diagnostico_oi: "",
    comentarios_audiometria: "",

    proteccion_simpleODoble: "",
    control_semestralOAnual: "",
    recomendaciones_otras: "",

    empresa: "",
    contrata: "",
  };

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
    <div className="w-full max-w-[90vw] lg:max-w-[70vw] mx-auto bg-white rounded shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">AUDIOMETRIA OHLA</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Lado izquierdo */}
        <div className="border rounded p-4 mt-6 flex flex-col gap-4">
          {/* Encabezado */}

          <div className="flex flex-col 2xl:flex-row gap-4">
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
              <label className="font-semibold text-base min-w-[50px]">
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
          <div className="flex flex-col 2xl:flex-row gap-4">
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
            <div className="flex-1 flex items-center gap-4">
              <label className="font-semibold min-w-[50px] text-base">
                Fecha de Nacimiento:
              </label>
              <input
                name="fechaNac"
                value={form.fechaNac}
                disabled
                className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
              />
            </div>
          </div>

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
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
              Edad:
            </label>
            <input
              name="edad"
              value={form.edad}
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

          <div className="h-0.5 w-full bg-gray-200 rounded"></div>
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
          {/* end  Encabezado */}
          <div className="flex justify-end gap-4 py-1 pr-4">
            <label className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                name="no_paso_Examen"
                checked={form.no_paso_Examen}
                onChange={() => {
                  toggleCheckBox("no_paso_Examen");
                }}
              />
              No Paso Examen
            </label>
            <label className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                name="activar_grafico"
                checked={form.activar_grafico}
                onChange={() => {
                  toggleCheckBox("activar_grafico");
                }}
              />
              Activar Gráfico
            </label>
          </div>
          {/* Audiometría  Área  */}
          <div className="grid grid-cols-1 gap-8 border rounded p-4 ">
            <h4 className="font-semibold text-lg ">Audiometría Área:</h4>
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
          {/* Audiometría Ósea */}
          <div className="grid grid-cols-1 gap-8 border rounded p-4 ">
            <div className="flex justify-between items-center pr-2">
              <h4 className="font-semibold text-lg ">Audiometría Ósea:</h4>
              <label className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  name="llenar_osea"
                  checked={form.llenar_osea}
                  onChange={() => {
                    toggleCheckBox("llenar_osea");
                  }}
                />
                Llenar
              </label>
            </div>
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
          <div className="flex flex-row gap-4 pr-4">
            <div className="flex-1 flex items-center gap-2">
              <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
                % pérdida global:
              </label>
              <input
                name="perdida_global"
                value={form.perdida_global}
                disabled
                className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
              />
            </div>
            <label className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                name="asignar_especialista"
                checked={form.asignar_especialista}
                onChange={() => {
                  toggleCheckBox("asignar_especialista");
                }}
              />
              Asignar Especialista
            </label>
          </div>
        </div>
        {/* Lado derecho */}
          <div className="border rounded p-4 mt-6 flex flex-col gap-4">
          {/* Encabezado */}

          <div className="flex flex-col 2xl:flex-row gap-4">
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
              <label className="font-semibold text-base min-w-[50px]">
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
          <div className="flex flex-col 2xl:flex-row gap-4">
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
            <div className="flex-1 flex items-center gap-4">
              <label className="font-semibold min-w-[50px] text-base">
                Fecha de Nacimiento:
              </label>
              <input
                name="fechaNac"
                value={form.fechaNac}
                disabled
                className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
              />
            </div>
          </div>

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
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
              Edad:
            </label>
            <input
              name="edad"
              value={form.edad}
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

          <div className="h-0.5 w-full bg-gray-200 rounded"></div>
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
          {/* end  Encabezado */}
          <div className="flex justify-end gap-4 py-1 pr-4">
            <label className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                name="no_paso_Examen"
                checked={form.no_paso_Examen}
                onChange={() => {
                  toggleCheckBox("no_paso_Examen");
                }}
              />
              No Paso Examen
            </label>
            <label className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                name="activar_grafico"
                checked={form.activar_grafico}
                onChange={() => {
                  toggleCheckBox("activar_grafico");
                }}
              />
              Activar Gráfico
            </label>
          </div>
          {/* Audiometría  Área  */}
          <div className="grid grid-cols-1 gap-8 border rounded p-4 ">
            <h4 className="font-semibold text-lg ">Audiometría Área:</h4>
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
          
          <div className="flex flex-row gap-4 pr-4">
            <div className="flex-1 flex items-center gap-2">
              <label className="font-semibold min-w-[50px] md:min-w-[90px] text-base">
                % pérdida global:
              </label>
              <input
                name="perdida_global"
                value={form.perdida_global}
                disabled
                className="border rounded px-2 py-1 text-base flex-1 bg-gray-100"
              />
            </div>
            <label className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                name="asignar_especialista"
                checked={form.asignar_especialista}
                onChange={() => {
                  toggleCheckBox("asignar_especialista");
                }}
              />
              Asignar Especialista
            </label>
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
  );
}
