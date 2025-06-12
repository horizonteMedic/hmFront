import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faCalendarAlt,
  faPrint,
  faSave,
  faBroom
} from '@fortawesome/free-solid-svg-icons'

const sintomasAsintomatico = [
  'Tos',
  'Dolor de garganta',
  'Congestión Nasal',
  'Dificultad respiratoria',
  'Fiebre/Escalofrío',
  'Malestar general',
  'Pérdida olfato o gusto'
]

const sintomasSintomatico = [
  'Diarrea',
  'Náuseas / vómitos',
  'Cefalea',
  'Irritabilidad / confusión',
  'Dolor',
  'Expectoración'
]

export default function Inmunologico() {
  const [form, setForm] = useState({
    orden: '',
    fecha: '',
    nombre: '',
    dni: '',
    edad: '',
    marca: '',
    igmReactivo: false,
    igmNo: false,
    iggReactivo: false,
    iggNo: false,
    iggInvalido: false,
    saturacion: '',
    fechaExamen: '',
    asintomatico: true,
    sintomatico: false,
    sintomas: {},
    otrosSintomas: ''
  })

  useEffect(() => {
    async function fetchDatosIniciales() {
      // TODO: fetch(`/api/orden/${form.orden}`)...
    }
    if (form.orden) fetchDatosIniciales()
  }, [form.orden])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSintoma = sym => {
    setForm(prev => ({
      ...prev,
      sintomas: { ...prev.sintomas, [sym]: !prev.sintomas[sym] }
    }))
  }

  const handleEdit = async () => {
    // TODO: fetch GET `/api/orden/${form.orden}`
    console.log('Editar orden', form.orden)
  }
  const handleSave = async () => {
    // TODO: fetch POST `/api/guardar`
    console.log('Grabar/Actualizar', form)
  }
  const handleClear = () => {
    setForm({
      orden: '',
      fecha: '',
      nombre: '',
      dni: '',
      edad: '',
      marca: '',
      igmReactivo: false,
      igmNo: false,
      iggReactivo: false,
      iggNo: false,
      iggInvalido: false,
      saturacion: '',
      fechaExamen: '',
      asintomatico: true,
      sintomatico: false,
      sintomas: {},
      otrosSintomas: ''
    })
  }
  const handlePrint = () => console.log('Imprimir', form.orden)

  return (
    <div className="bg-white rounded shadow p-6 flex gap-6 text-md">
      {/* IZQUIERDA 60% */}
      <div className="w-3/5 flex flex-col space-y-6">
        {/* Aptitud */}
        <div className="border border-gray-200 rounded p-4">
          <h2 className="font-medium text-blue-700 mb-3">Aptitud</h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="font-medium flex items-center gap-1">
              N° Orden:
              <input
                name="orden"
                value={form.orden}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-24 ml-1"
              />
            </label>
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faEdit} /> Editar
            </button>
            <label className="font-medium flex items-center gap-1">
              Fecha:
              <input
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-36 ml-1"
              />
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 ml-1" />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="font-medium flex-1 flex items-center gap-1">
              Nombres y Apellidos:
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="border rounded px-2 py-1 flex-1 ml-1"
              />
            </label>
            <button onClick={handlePrint} className="bg-transparent border-none p-0">
              <FontAwesomeIcon icon={faPrint} className="text-2xl text-blue-700" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="font-medium flex items-center gap-1">
              DNI:
              <input
                name="dni"
                value={form.dni}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-24 ml-1"
              />
            </label>
            <label className="font-medium flex items-center gap-1">
              Edad:
              <input
                name="edad"
                value={form.edad}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-16 ml-1"
              />
            </label>
          </div>
        </div>

        {/* COVID-19 */}
        <div className="border border-gray-200 rounded p-4">
          <h2 className="font-medium text-blue-700 mb-3">COVID-19 Prueba Rápida</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="font-medium">MARCA:</label>
              <select
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                <option value="">Selecciona</option>
              </select>
              <button onClick={handlePrint} className="bg-transparent border-none p-0">
                <FontAwesomeIcon icon={faPrint} className="text-xl text-blue-700 ml-1" />
              </button>
            </div>

            {/* IgM */}
            <div className="flex items-center gap-4">
              <label className="font-medium flex items-center gap-1">
                <input
                  name="igmReactivo"
                  type="checkbox"
                  checked={form.igmReactivo}
                  onChange={handleChange}
                /> Reactivo
              </label>
              <label className="font-medium flex items-center gap-1">
                <input
                  name="igmNo"
                  type="checkbox"
                  checked={form.igmNo}
                  onChange={handleChange}
                /> No Reactivo
              </label>
            </div>
            <textarea className="border rounded w-full h-24 p-2" />

            {/* IgG */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <label className="font-medium flex items-center gap-1">
                  <input
                    name="iggReactivo"
                    type="checkbox"
                    checked={form.iggReactivo}
                    onChange={handleChange}
                  /> Reactivo
                </label>
                <label className="font-medium flex items-center gap-1">
                  <input
                    name="iggNo"
                    type="checkbox"
                    checked={form.iggNo}
                    onChange={handleChange}
                  /> No Reactivo
                </label>
              </div>
              <label className="font-medium flex items-center gap-1">
                <input
                  name="iggInvalido"
                  type="checkbox"
                  checked={form.iggInvalido}
                  onChange={handleChange}
                /> Inválido
              </label>
            </div>
            <textarea className="border rounded w-full h-24 p-2" />
          </div>
        </div>

        {/* Hoteles */}
        <div className="border border-gray-200 rounded p-4">
          <div className="font-medium mb-3">SOLO PARA PC (HOTELES)</div>
          <div className="flex items-center gap-6 mb-4">
            <label className="flex items-center gap-1">
              <input
                name="asintomatico"
                type="checkbox"
                checked={form.asintomatico}
                onChange={handleChange}
              /> Asintomático
            </label>
            <label className="flex items-center gap-1">
              <input
                name="sintomatico"
                type="checkbox"
                checked={form.sintomatico}
                onChange={handleChange}
              /> Sintomático
            </label>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="min-w-[90px]">Saturación:</label>
                <input
                  name="saturacion"
                  value={form.saturacion}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[90px]">Fecha examen:</label>
                <input
                  name="fechaExamen"
                  type="date"
                  value={form.fechaExamen}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-36"
                />
              </div>
            </div>

            <div className="space-y-1">
              {sintomasAsintomatico.map(sym => (
                <label key={sym} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!!form.sintomas[sym]}
                    onChange={() => handleSintoma(sym)}
                  /> {sym}
                </label>
              ))}
            </div>

            <div className="space-y-1">
              {sintomasSintomatico.map(sym => (
                <label key={sym} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!!form.sintomas[sym]}
                    onChange={() => handleSintoma(sym)}
                  /> {sym}
                </label>
              ))}
              <div className="mt-4">
                <label className="font-medium block mb-1">Otros síntomas:</label>
                <input
                  name="otrosSintomas"
                  value={form.otrosSintomas}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DERECHA 40%: botones */}
      <div className="w-2/5 flex justify-end items-start gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSave} /> Guardar
        </button>
        <button
          onClick={handleClear}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
      </div>
    </div>
  )
}
