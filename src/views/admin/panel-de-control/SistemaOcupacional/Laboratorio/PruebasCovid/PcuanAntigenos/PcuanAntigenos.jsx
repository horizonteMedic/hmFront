// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/PruebasCovid/PcuanAntigenos/PcuanAntigenos.jsx

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
import { PrintHojaR, SubmitData, VerifyTR } from "./controllerPCuantAntigenos";
import Swal from "sweetalert2";
import { URLAzure } from "../../../../../../config/config";

const DEFAULT_TECNICA = {
  tecnica: "Inmunofluorescencia",
  sensibilidad: "95.00%",
  especificidad: "95.00%",
};
const tabla = "examen_inmunologico";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

export default function PcuanAntigenos({ token, selectedSede, userlogued }) {
  //   const MARCAS = [
  //    {
  //      value: "ID-19 IGM/IGG TEST CASSETTE",
  //      tecnica: "Inmunofluorescencia",
  //      sensibilidad: "95.00%",
  //      especificidad: "95.00%",
  //    },
  //    Puedes agregar más marcas aquí si es necesario
  // ];}
  const [marcas, setMarcas] = useState([]);
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch(
          `${URLAzure}/api/v01/ct/pruebasCovid/obtenerMarcasCovid`,
          options
        );
        if (!response.ok) throw new Error("Error al cargar marcas");
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        console.error("Error fetching marcas:", error);
        Swal.fire("Error", "No se pudieron cargar las marcas", "error");
      }
    };
    fetchMarcas();
  }, []);

  const [form, setForm] = useState({
    norden: "",
    fecha: today,
    nombres: "",
    dni: "",
    edad: "",
    marca: "",
    doctor: "N/A",
    valor: "",
  });
  const [status, setStatus] = useState("");
  const nombreInputRef = useRef(null);

  useEffect(() => {
    setForm((f) => ({ ...f, fecha: today }));
  }, []);

  // Ajuste dinámico del ancho del input de nombres
  useEffect(() => {
    if (nombreInputRef.current) {
      const len = form.nombres?.length || 0;
      const min = 120,
        max = 400;
      nombreInputRef.current.style.width = `${Math.min(
        max,
        Math.max(min, len * 10)
      )}px`;
    }
  }, [form.nombres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Prueba Cuantitativa de Antígenos?",
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

  const handleClear = (incluyeNorden = true) => {
    setForm((f) => ({
      ...f,
      norden: incluyeNorden ? "" : f.norden,
      fecha: today,
      nombres: "",
      dni: "",
      edad: "",

      marca: "",
      doctor: "N/A",
      valor: "",
    }));
    setStatus("Formulario limpiado");
  };

  const selectedMarca =
    marcas.find((m) => m.value === form.marca) || DEFAULT_TECNICA;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow">
      {/* Título principal */}
      <div className="text-2xl font-bold text-center mb-8">
        COVID-19 Prueba Rápida (Antígeno)
      </div>

      {/* Encabezado */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">N° Orden :</label>
          <input
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleClear(false);
                VerifyTR(form.norden, tabla, token, setForm, selectedSede);
              }
            }}
            className="border rounded px-3 py-2 w-40 text-base"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Fecha :</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-44 text-base"
          />
        </div>
      </div>

      {/* Datos personales */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">
            Nombres y Apellidos :
          </label>
          <input
            name="nombres"
            value={form.nombres}
            disabled
            ref={nombreInputRef}
            className="border rounded px-3 py-2 text-base bg-gray-100 cursor-not-allowed transition-all duration-200"
            style={{ minWidth: 120, maxWidth: 400 }}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">DNI :</label>
          <input
            name="dni"
            value={form.dni}
            disabled
            className="border rounded px-3 py-2 w-32 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Edad :</label>
          <input
            name="edad"
            value={form.edad}
            disabled
            className="border rounded px-3 py-2 w-20 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Sección COVID-19 Prueba Rápida */}
      <div className="border rounded p-4 mb-8">
        <div className="font-bold text-base mb-2">COVID - 19 Prueba Rápida</div>
        <div className="flex flex-wrap gap-6 items-start">
          <div className="flex flex-col gap-4 flex-1 min-w-[260px]">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-base min-w-[70px]">
                MARCA:
              </label>
              <select
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="border rounded px-2 py-1 flex-1"
              >
                <option value="">--Seleccione--</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.mensaje}>
                    {m.mensaje}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="ml-2 bg-gray-200 border border-gray-400 px-2 py-1 rounded text-base"
              >
                📄
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-base min-w-[70px]">
                Doctor:
              </label>
              <input
                name="doctor"
                value={form.doctor}
                disabled
                className="border rounded px-2 py-1 flex-1 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-base min-w-[70px]">
                Valor:
              </label>
              <input
                name="valor"
                value={form.valor}
                onChange={handleChange}
                className="border rounded px-2 py-1 flex-1"
              />
            </div>
          </div>
          {/* Cuadro de técnica */}
          <div className="flex-1 min-w-[260px]">
            <div
              className="border rounded bg-gray-50 p-4 text-base min-h-[100px]"
              style={{ minWidth: 220 }}
            >
              <div>
                <span className="font-semibold">Tecnica:</span>
                Inmunofluorescencia
              </div>
              <div>
                <span className="font-semibold">SENSIBILIDAD:</span>95.00%
              </div>
              <div>
                <span className="font-semibold">ESPECIFICIDAD:</span>95.00%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones al final */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              SubmitData(form, token, userlogued, handleClear, tabla);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button
            type="button"
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"
            onClick={handleClear}
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-blue-900 text-xs italic">
            IMPRIMIR
          </span>
          <div className="flex gap-1 mt-1">
            <input
              className="border rounded px-2 py-1 w-24"
              value={form.norden}
              name="norden"
              onChange={handleChange}
            />
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors"
              onClick={handlePrint}
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
