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
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">PERFIL HEPÁTICO</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha"   name="ficha"   value={form.ficha}   onChange={e=>setField('ficha',e.target.value)} />
        <Field label="Fecha"        name="fecha"   type="date" value={form.fecha} onChange={e=>setField('fecha',e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={e=>setField('nombres',e.target.value)} />
        <Field label="Edad"    name="edad"    value={form.edad}    onChange={e=>setField('edad',e.target.value)} />
      </div>

      <Section title="Bioquímica Hepática">
        {[
          ['tgo','TGO','U/L'],
          ['tgp','TGP','U/L'],
          ['ggt','GGT','U/L'],
          ['fosfAlc','FOSFATASA ALCALINA','U/L'],
          ['biliTotal','BILIRRUBINA TOTAL','mg/dL'],
          ['biliInd','BILIRRUBINA INDIRECTA','mg/dL'],
          ['biliDir','BILIRRUBINA DIRECTA','mg/dL'],
          ['protTot','PROTEÍNAS TOTALES','g/dL'],
          ['albumina','ALBÚMINA','g/dL'],
          ['globSer','GLOBULINA SÉRICA','g/dL'],
        ].map(([key,label,unit]) => (
          <Field
            key={key}
            label={label}
            name={key}
            unit={unit}
            value={form[key]}
            onChange={e=>setField(key,e.target.value)}
          />
        ))}
      </Section>

      <div className="flex justify-between">
        <ActionButton color="green" icon={faSave} onClick={handleSave}>Guardar</ActionButton>
        <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
        <div className="flex items-center gap-2">
          <input
            name="printCount"
            value={form.printCount}
            onChange={e=>setField('printCount',e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
          <ActionButton color="blue" icon={faPrint} onClick={handlePrint}>Imprimir</ActionButton>
        </div>
      </div>
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
