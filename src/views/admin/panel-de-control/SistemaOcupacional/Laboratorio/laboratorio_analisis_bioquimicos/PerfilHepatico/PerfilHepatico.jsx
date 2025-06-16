// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/PerfilHepatico.jsx
import React, { useReducer, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

const today = new Date().toISOString().split('T')[0]

const initialState = {
  ficha: '',
  fecha: today,
  nombres: '',
  edad: '',
  tgo: '',
  tgp: '',
  ggt: '',
  fosfAlc: '',
  biliTotal: '',
  biliInd: '',
  biliDir: '',
  protTot: '',
  albumina: '',
  globSer: '',
  printCount: ''
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'LOAD':
      return { ...state, ...action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function PerfilHepatico({ apiBase, token, selectedSede }) {
  const [form, dispatch] = useReducer(reducer, { ...initialState })
  
  useEffect(() => {
    if (!form.ficha) return
    async function load() {
      // placeholder GET
      // const res = await fetch(`${apiBase}/hepatico/${form.ficha}`, { headers:{Authorization:`Bearer ${token}`} })
      // const data = await res.json()
      // dispatch({ type:'LOAD', payload:data })
    }
    load()
  }, [form.ficha, apiBase, token])

  const setField = useCallback((field, value) => {
    dispatch({ type:'SET_FIELD', field, value })
  }, [])

  const handleSave = useCallback(async () => {
    try {
      // POST placeholder
      // await fetch(`${apiBase}/hepatico`, {...})
      Swal.fire('Guardado', 'Perfil hepático guardado', 'success')
    } catch {
      Swal.fire('Error', 'No se pudo guardar', 'error')
    }
  }, [form])

  const handleClear = useCallback(() => {
    dispatch({ type:'RESET' })
    Swal.fire('Limpiado', 'Formulario reiniciado', 'success')
  }, [])

  const handlePrint = useCallback(() => {
    window.open(`${apiBase}/hepatico/print?ficha=${form.ficha}&count=${form.printCount}`, '_blank')
    Swal.fire('Imprimiendo', '', 'success')
  }, [form.ficha, form.printCount, apiBase])

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">PERFIL HEPÁTICO</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input className="border rounded px-2 py-1 flex-1" disabled />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Fecha:</label>
            <input type="date" className="border rounded px-2 py-1 flex-1" disabled />
          </div>
        </div>
      </form>
    </div>
  )
}

// --- Aux components ---
function Field({ label, name, type='text', unit='', value, onChange, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">
        {label}{unit && <span className="ml-1 text-sm">({unit})</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`border rounded px-2 py-1 ${disabled?'bg-gray-100':''}`}
      />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-blue-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function ActionButton({ color, icon, onClick, children }) {
  const bg = {
    green:  'bg-emerald-600 hover:bg-emerald-700',
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
