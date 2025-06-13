// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Analisis_bioquimicos.jsx
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faBroom,
  faPrint,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import microscopioImg from '../microscopio.webp'
import { VerifyTR } from '../controller/ControllerABio'

export default function AnalisisBioquimicos({ token, selectedSede }) {
  const tabla = 'analisis_bioquimicos'
  const [form, setForm] = useState({
    examType: 'ficha',
    norden: '',
    medico: '',
    nombres: '',
    fecha: '',
    creatinina: '',
    colesterolTotal: '',
    ldl: '',
    hdl: '',
    vldl: '',
    trigliceridos: ''
  })
  const [searchParams, setSearchParams] = useState({ buscar: '', codigo: '' })
  const [exams, setExams] = useState([])

  useEffect(() => {
    async function fetchExams() {
      console.log('Fetch exams with', searchParams)
    }
    fetchExams()
  }, [searchParams])

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  const handleRadio = e => setForm(f => ({ ...f, examType: e.target.value }))
  const handleSearchChange = e => {
    const { name, value } = e.target
    setSearchParams(p => ({ ...p, [name]: value }))
  }

  const handleEdit = () => console.log('Editar', form.norden)
  const handleSave = () => console.log('Guardar', form)
  const handleClear = () => setForm({
    examType: 'ficha', norden: '', medico: '', nombres: '', fecha: '',
    creatinina: '', colesterolTotal: '', ldl: '', hdl: '', vldl: '', trigliceridos: ''
  })
  const handlePrint = () => console.log('Imprimir', form.norden)

  return (
    <div className="w-full">
      {/* Título General */}
      <h2 className="text-3xl font-bold text-center mb-6">Análisis Bioquímicos</h2>

      <div className="flex w-full  bg-gray-50 gap-2 text-md">
        {/* IZQUIERDA 60% */}
        <div className="w-3/5 bg-white rounded shadow p-4 flex flex-col space-y-6">
          {/* Tipo de Examen */}
          <div className="border border-gray-200 rounded p-3">
            <h3 className="font-medium text-blue-700 mb-2">Tipo de Examen</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="examType"
                  value="norecibo"
                  checked={form.examType === 'norecibo'}
                  onChange={handleRadio}
                /> No recibo
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="examType"
                  value="ficha"
                  checked={form.examType === 'ficha'}
                  onChange={handleRadio}
                /> Ficha Médica Ocupacional
              </label>
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSearch} /> Buscar
              </button>
            </div>
          </div>

          {/* Datos Generales */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1 font-medium">
              N° Ficha:
              <input
                name="norden"
                value={form.norden}
                autoComplete='off'
                onChange={handleFormChange}
                onKeyUp={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,tabla,token,setForm,selectedSede)}}
                className="border rounded px-2 py-1 w-20 ml-1"
              />
            </label>
            <label className="flex-1 flex items-center gap-1 font-medium">
              Médico / Técnico:
              <input
                name="medico"
                value={form.medico}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 flex-1 ml-1"
              />
            </label>
            <img src={microscopioImg} alt="Microscopio" className="w-32" />
          </div>

          {/* Paciente y Fecha */}
          <div className="flex items-center gap-4">
            <label className="flex-1 flex items-center gap-1 font-medium">
              Paciente:
              <input
                name="nombres"
                value={form.nombres}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 flex-1 ml-1"
              />
            </label>
            <label className="flex items-center gap-1 font-medium">
              Fecha:
              <input
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 w-36 ml-1"
              />
            </label>
          </div>

          {/* Parámetros Bioquímicos */}
          {[
            { key: 'creatinina', label: 'Creatinina', hint: '0.8 - 1.4 mg/dl' },
            { key: 'colesterolTotal', label: 'Colesterol Total', hint: '< 200 mg/dl' },
            { key: 'ldl', label: 'L.D.L Colesterol', hint: '< 129 mg/dl' },
            { key: 'hdl', label: 'H.D.L Colesterol', hint: '40 - 60 mg/dl' },
            { key: 'vldl', label: 'V.L.D.L Colesterol', hint: '< 30 mg/dl' },
            { key: 'trigliceridos', label: 'Triglicéridos', hint: '< 150 mg/dl' }
          ].map(({ key, label, hint }) => (
            <div key={key} className="flex items-center gap-4">
              <label className="font-medium min-w-[150px]">{label}:</label>
              <input
                name={key}
                value={form[key]}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 w-32"
              />
              <span className="text-gray-500">(V.N. {hint})</span>
            </div>
          ))}

          {/* Botones Guardar y Limpiar */}
          <div className="flex gap-4 pt-2 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
        </div>

        {/* DERECHA 40%: Buscador y Tabla */}
        <div className="w-2/5 bg-white rounded shadow p-4 flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <label className="font-medium">Buscar:</label>
            <input
              name="buscar"
              value={searchParams.buscar}
              onChange={handleSearchChange}
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              onClick={() => console.log('Buscar', searchParams)}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-medium">Código:</label>
            <input
              name="codigo"
              value={searchParams.codigo}
              onChange={handleSearchChange}
              className="border rounded px-2 py-1 w-24"
            />
          </div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">Examen</th>
                <th className="border px-2 py-1 text-left">Title 2</th>
                <th className="border px-2 py-1 text-left">Title 3</th>
                <th className="border px-2 py-1 text-left">Title 4</th>
              </tr>
            </thead>
            <tbody>
              {exams.length ? (
                exams.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{row.title1}</td>
                    <td className="border px-2 py-1">{row.title2}</td>
                    <td className="border px-2 py-1">{row.title3}</td>
                    <td className="border px-2 py-1">{row.title4}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
