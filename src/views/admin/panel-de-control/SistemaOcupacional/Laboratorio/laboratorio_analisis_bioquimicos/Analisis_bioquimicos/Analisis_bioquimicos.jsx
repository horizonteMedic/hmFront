// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Analisis_bioquimicos.jsx
import React, { useReducer, useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons'
import microscopioImg from '../microscopio.webp'
import { VerifyTR } from '../controller/ControllerABio'

export default function AnalisisBioquimicos({ token, selectedSede }) {
  const tabla = 'analisis_bioquimicos'

  const [form, setForm] = useState({
    examType: 'ficha',
    norden: '',
    medico: '',
    paciente: '',
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

  // placeholder: fetch exams when searchParams change
  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }, [])

  const handleSearchChange = e => {
    const { name, value } = e.target
    setSearchParams(p => ({ ...p, [name]: value }))
  }

  const handleEdit = () => console.log('Editar', form.norden)
  const handleSave = () => console.log('Guardar', form)
  const handleClear = () => setForm({
    examType: 'ficha', norden: '', medico: '', paciente: '', fecha: '',
    creatinina: '', colesterolTotal: '', ldl: '', hdl: '', vldl: '', trigliceridos: ''
  })
  const handlePrint = () => console.log('Imprimir', form.norden)
  
  return (
    <div className="w-full p-4 space-y-6">
      <h2 className="text-3xl font-bold text-center">Análisis Bioquímicos</h2>

      <div className="flex gap-2 w-full bg-gray-50 p-2">
        {/* IZQUIERDA 60% */}
        <div className="w-3/5 bg-white rounded shadow p-4 space-y-6">
          {/* Tipo de Examen */}
          <Section title="Tipo de Examen">
            <div className="flex items-center gap-6">
              <Radio
                label="No recibo"
                name="examType"
                value="norecibo"
                checked={form.examType === 'norecibo'}
                onChange={e => setField('examType', e.target.value)}
              />
              <Radio
                label="Ficha Médica Ocupacional"
                name="examType"
                value="ficha"
                checked={form.examType === 'ficha'}
                onChange={e => setField('examType', e.target.value)}
              />
              <ActionButton onClick={handleEdit} color="blue" icon={faSearch}>
                Buscar
              </ActionButton>
            </div>
          </Section>

          {/* Datos Generales */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1 font-medium">
              N° Ficha:
              <input
                name="norden"
                value={form.norden}
                autoComplete='off'
                onKeyUp={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,tabla,token,setForm,selectedSede)}}
                onChange={handleFormChange}
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
                name="paciente"
                value={form.paciente}
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
          <Section>
            {[
              { key: 'creatinina',     label: 'Creatinina',     hint: '0.8 - 1.4 mg/dl' },
              { key: 'colesterolTotal',label: 'Colesterol Total',hint: '< 200 mg/dl' },
              { key: 'ldl',            label: 'L.D.L Colesterol',hint: '< 129 mg/dl' },
              { key: 'hdl',            label: 'H.D.L Colesterol',hint: '40 - 60 mg/dl' },
              { key: 'vldl',           label: 'V.L.D.L Colesterol',hint: '< 30 mg/dl' },
              { key: 'trigliceridos',  label: 'Triglicéridos',   hint: '< 150 mg/dl' }
            ].map(({ key, label, hint }) => (
              <div key={key} className="flex items-center gap-4">
                <span className="font-medium min-w-[150px]">{label}:</span>
                <input
                  className="border rounded px-2 py-1 w-32"
                  name={key}
                  value={form[key]}
                  onChange={e => setField(key, e.target.value)}
                />
                <span className="text-gray-500">(V.N. {hint})</span>
              </div>
            ))}
          </Section>

          {/* Acciones */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <ActionButton onClick={handleSave} color="green" icon={faSave}>Guardar/Actualizar</ActionButton>
            <ActionButton onClick={handleClear} color="yellow" icon={faBroom}>Limpiar</ActionButton>
          </div>
        </div>

        {/* DERECHA 40% */}
        <div className="w-2/5 bg-white rounded shadow p-4 flex flex-col gap-4">
          <SearchField
            label="Buscar"
            name="buscar"
            value={searchParams.buscar}
            onChange={handleSearchChange}
            onSearch={() => Swal.fire('Buscar', JSON.stringify(searchParams), 'info')}
          />
          <SearchField
            label="Código"
            name="codigo"
            value={searchParams.codigo}
            onChange={handleSearchChange}
          />
          <Table data={exams} />
        </div>
      </div>

      <div className="flex justify-end">
        <ActionButton onClick={handlePrint} color="blue" icon={faPrint}>Imprimir</ActionButton>
      </div>
    </div>
  )
}

// Aux components
function Field({ label, name, type = 'text', value, onChange, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`}
      />
    </div>
  )
}

function Radio({ label, ...props }) {
  return (
    <label className="flex items-center gap-1">
      <input type="radio" {...props} className="form-radio" />
      {label}
    </label>
  )
}

function SearchField({ label, name, value, onChange, onSearch }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{label}:</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-2 py-1 flex-1"
      />
      {onSearch && (
        <button onClick={onSearch} className="p-2 bg-gray-200 rounded">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      )}
    </div>
  )
}

function Table({ data }) {
  return (
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
        {data.length > 0 ? (
          data.map((row, i) => (
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
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      {title && <h3 className="font-semibold text-blue-700">{title}</h3>}
      {children}
    </div>
  )
}

function ActionButton({ color, icon, onClick, children }) {
  const bg = {
    green:  'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    blue:   'bg-blue-600 hover:bg-blue-700'
  }[color]
  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
