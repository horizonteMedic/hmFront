// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/LaboratorioClinico/Hematologia/Hematologia.jsx
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import { VerifyTR } from '../ControllerLC/ControllerLC'

const PRUEBAS = [
  { key: 'hemoglobina', label: 'HEMOGLOBINA' },
  { key: 'hematocrito', label: 'HEMATOCRITO' },
  { key: 'hematies', label: 'HEMATÍES' },
  { key: 'volumen_corpuscular_medio', label: 'Volumen Corpuscular medio' },
  { key: 'hemoglobina_corpuscular_media', label: 'Hemoglobina Corpuscular media' },
  { key: 'concentracion_hemoglobina_corpuscular', label: 'Concentración de la Hemoglobina Corpuscular' },
  { key: 'leucocitos', label: 'LEUCOCITOS' },
  { key: 'plaquetas', label: 'PLAQUETAS' }
]

const DIFERENCIAL = [
  { key: 'neutrofilos', label: 'NEUTRÓFILOS (%)' },
  { key: 'abastonados', label: 'ABASTONADOS (%)' },
  { key: 'segmentados', label: 'SEGMENTADOS (%)' },
  { key: 'monocitos', label: 'MONOCITOS (%)' },
  { key: 'eosinofilos', label: 'EOSINÓFILOS (%)' },
  { key: 'basofilos', label: 'BASÓFILOS (%)' },
  { key: 'linfocitos', label: 'LINFOCITOS (%)' }
]

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const initialForm = {
  norden: '',
  fecha: today,
  paciente: '',
  edad: '',
  medico: '',
  // Pruebas
  hemoglobina: '',
  hematocrito: '',
  hematies: '',
  volumen_corpuscular_medio: '',
  hemoglobina_corpuscular_media: '',
  concentracion_hemoglobina_corpuscular: '',
  leucocitos: '',
  plaquetas: '',
  // Diferencial
  neutrofilos: '',
  abastonados: '',
  segmentados: '',
  monocitos: '',
  eosinofilos: '',
  basofilos: '',
  linfocitos: ''
}

export default function Hematologia({ apiBase, token, selectedSede, userlogued }) {
  const tabla = 'hemograma_autom'
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setField(name, value.toUpperCase())
  }

  const handleSave = () => {
    try {
      const payload = { ...form, sede: selectedSede }
      // await fetch(`${apiBase}/hematologia`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(payload)
      // })
      setStatus('Guardado exitoso')
    } catch (err) {
      setStatus('Error al guardar')
    }
  }

  const handleClear = () => {
    setForm(initialForm)
  }

  const handlePrint = () => {
    window.open(`${apiBase}/hematologia/print?norden=${form.norden}`, '_blank')
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">HEMATOLOGÍA</h2>

      {/* Encabezado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha" name="norden" value={form.norden}
          onKeyUp={event => {if(event.key === 'Enter')VerifyTR(form.norden,tabla,token,setForm, selectedSede)}} onChange={handleInputChange} />
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleInputChange} />
      </div>

      {/* Paciente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="paciente" name="paciente" value={form.paciente} disabled />
        <Field label="Edad" name="edad" value={form.edad} disabled />
      </div>

      {/* Muestra fija */}
      <div className="font-semibold">MUESTRA: SANGRE TOTAL C/ EDTA</div>

      {/* Resultados y Recuento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">PRUEBAS</h3>
          <div className="space-y-2">
            {PRUEBAS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="flex-1">{label}</span>
                <input
                  className="border rounded px-2 py-1 w-32"
                  name={key}
                  value={form[key]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">RECUENTO DIFERENCIAL</h3>
          <div className="space-y-2">
            {DIFERENCIAL.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="flex-1">{label}</span>
                <input
                  className="border rounded px-2 py-1 w-32"
                  name={key}
                  value={form[key]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Médico */}
      <div>
        <label className="font-semibold block mb-1">Asignar Médico</label>
        <select
          name="medico"
          value={form.medico}
          disabled
          className="border rounded px-2 py-1 w-full bg-gray-100"
        >
          <option value="">-- N/A --</option>
        </select>
      </div>

      {/* Acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-3">
          <Button onClick={handleSave} color="green" icon={faSave}>Guardar/Actualizar</Button>
          <Button onClick={handleClear} color="yellow" icon={faBroom}>Limpiar</Button>
        </div>
        <div className="flex flex-col items-end">
          <span className="italic font-semibold mb-2">IMPRIMIR</span>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>Ficha</span>
          </button>
        </div>
      </div>

      {status && (
        <p className="text-center text-green-600 font-medium">{status}</p>
      )}
    </div>
  )
}

function Field({ label, name, type = 'text', value, onKeyUp, onChange, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onKeyUp={onKeyUp}
        disabled={disabled}
        onChange={onChange}
        className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`}
      />
    </div>
  )
}

function Button({ onClick, color, icon, children }) {
  const bg = color==='green'
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-yellow-400 hover:bg-yellow-500'
  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-3 py-1 rounded inline-flex items-center gap-2 text-sm`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
