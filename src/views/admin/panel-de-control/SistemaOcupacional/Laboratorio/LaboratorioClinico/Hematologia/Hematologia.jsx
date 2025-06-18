// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/LaboratorioClinico/Hematologia/Hematologia.jsx
import React, { useReducer, useEffect, useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import { VerifyTR } from '../ControllerLC/ControllerLC'

const PRUEBAS = [
  'HEMOGLOBINA',
  'HEMATOCRITO',
  'HEMATÍES',
  'Volumen Corpuscular medio',
  'Hemoglobina Corpuscular media',
  'Concentración de la Hemoglobina Corpuscular',
  'LEUCOCITOS',
  'PLAQUETAS'
]

const DIFERENCIAL = [
  'NEUTRÓFILOS (%)',
  'ABASTONADOS (%)',
  'SEGMENTADOS (%)',
  'MONOCITOS (%)',
  'EOSINÓFILOS (%)',
  'BASÓFILOS (%)',
  'LINFOCITOS (%)'
]

const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const initialState = {
  norden: '',
  fecha: today,
  paciente: '',
  edad: '',
  resultados: Array(PRUEBAS.length).fill(''),
  recuentos: Array(DIFERENCIAL.length).fill(''),
  medico: ''
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_ARRAY':
      const arr = [...state[action.field]]
      arr[action.index] = action.value
      return { ...state, [action.field]: arr }
    case 'LOAD':
      return { ...state, ...action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function Hematologia({ apiBase, token, selectedSede, userlogued }) {
  const tabla = 'hemograma_autom'
  const [form, setForm] = useState({
     norden: '',
    fecha: today,
    paciente: '',
    edad: '',
    pruebas: [
      { key: 'HEMOGLOBINA', value: ''},
      { key: 'HEMATOCRITO', value: ''},
      { key: 'HEMATÍES', value: ''},
      { key: 'Volumen Corpuscular medio', value: ''},
      { key: 'Hemoglobina Corpuscular media', value: ''},
      { key: 'Concentración de la Hemoglobina Corpuscular', value: ''},
      { key: 'LEUCOCITOS', value: ''},
      { key: 'PLAQUETAS', value: ''},
    ],
    recuentos: [
      { key: 'NEUTRÓFILOS (%)', value: ''},
      { key: 'ABASTONADOS (%)', value: ''},
      { key: 'SEGMENTADOS (%)', value: ''},
      { key: 'MONOCITOS (%)', value: ''},
      { key: 'EOSINÓFILOS (%)', value: ''},
      { key: 'BASÓFILOS (%)', value: ''},
      { key: 'LINFOCITOS (%)', value: ''}
    ],
    medico: ''
  })
  const [status, setStatus] = React.useState('')
  
  console.log(form)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value.toUpperCase() })
  }

  const onArrayChange = (campo, index) => (e) => {
    const nuevoValor = e.target.value;
    setForm((prev) => {
      const nuevoArray = [...prev[campo]];
      nuevoArray[index] = {
        ...nuevoArray[index],
        value: nuevoValor
      };
      return {
        ...prev,
        [campo]: nuevoArray
      };
    });
  };

  const handleSave = useCallback(async () => {
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
  }, [form, apiBase, token, selectedSede])

  const handleClear = () => {
    setForm({
       norden: '',
    fecha: today,
    paciente: '',
    edad: '',
    pruebas: [
      { key: 'HEMOGLOBINA', value: ''},
      { key: 'HEMATOCRITO', value: ''},
      { key: 'HEMATÍES', value: ''},
      { key: 'Volumen Corpuscular medio', value: ''},
      { key: 'Hemoglobina Corpuscular media', value: ''},
      { key: 'Concentración de la Hemoglobina Corpuscular', value: ''},
      { key: 'LEUCOCITOS', value: ''},
      { key: 'PLAQUETAS', value: ''},
    ],
    recuentos: [
      { key: 'NEUTRÓFILOS (%)', value: ''},
      { key: 'ABASTONADOS (%)', value: ''},
      { key: 'SEGMENTADOS (%)', value: ''},
      { key: 'MONOCITOS (%)', value: ''},
      { key: 'EOSINÓFILOS (%)', value: ''},
      { key: 'BASÓFILOS (%)', value: ''},
      { key: 'LINFOCITOS (%)', value: ''}
    ],
    medico: ''
    })
  }

  const handlePrint = useCallback(() => {
    window.open(`${apiBase}/hematologia/print?norden=${form.norden}`, '_blank')
  }, [apiBase, form.norden])



  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">HEMATOLOGÍA</h2>

      {/* Encabezado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha" name="norden" value={form.norden} 
        onKeyup={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,tabla,token,setForm, selectedSede)}} onChange={onChange} />
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={onChange} />
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
            {PRUEBAS.map((lbl, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1">{lbl}</span>
                <input
                  className="border rounded px-2 py-1 w-32"
                  value={form.pruebas[i].value}
                  onChange={onArrayChange('pruebas', i)}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">RECUENTO DIFERENCIAL</h3>
          <div className="space-y-2">
            {DIFERENCIAL.map((lbl, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1">{lbl}</span>
                <input
                  className="border rounded px-2 py-1 w-32"
                  value={form.recuentos[i]}
                  onChange={onArrayChange('recuentos', i)}
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
          <ActionButton color="emerald" icon={faSave} onClick={handleSave}>
            Guardar/Actualizar
          </ActionButton>
          <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>
            Limpiar
          </ActionButton>
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

// Input field component
function Field({ label, name, type = 'text', value, onKeyup, onChange, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onKeyUp={onKeyup}
        disabled={disabled}
        onChange={onChange}
        className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`}
      />
    </div>
  )
}

// Action button component
function ActionButton({ color, icon, onClick, children }) {
  const bg = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    yellow:  'bg-yellow-400 hover:bg-yellow-500'
  }[color]
  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-4 py-1 rounded inline-flex items-center gap-2`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
