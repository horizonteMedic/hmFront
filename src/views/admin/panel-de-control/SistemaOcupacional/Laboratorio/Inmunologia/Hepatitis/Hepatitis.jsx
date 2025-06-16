// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Hepatitis.jsx
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
  hav: false,
  hbsag: false,
  printCount: ''
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET':      return { ...state, [action.field]: action.value }
    case 'RESET':    return initialState
    case 'LOAD':     return { ...state, ...action.payload }
    default:         return state
  }
}

export default function Hepatitis({ apiBase, token, selectedSede }) {
  const [form, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!form.ficha) return
    async function load() {
      // GET placeholder
      // const res = await fetch(`${apiBase}/hepatitis/${form.ficha}`,{headers:{Authorization:`Bearer ${token}`}})
      // const data = await res.json()
      // dispatch({ type:'LOAD', payload:data })
    }
    load()
  }, [form.ficha, apiBase, token])

  const setField = useCallback((field, value) => dispatch({ type:'SET', field, value }), [])

  const handleSave = useCallback(async () => {
    try {
      // POST placeholder
      // await fetch(`${apiBase}/hepatitis`,{...})
      Swal.fire('Guardado','Datos guardados','success')
    } catch {
      Swal.fire('Error','No se pudo guardar','error')
    }
  }, [form])

  const handleClear = useCallback(() => {
    dispatch({ type:'RESET' })
    Swal.fire('Limpiado','Formulario reiniciado','success')
  }, [])

  const handlePrint = useCallback(() => {
    window.open(`${apiBase}/hepatitis/print?ficha=${form.ficha}&count=${form.printCount}`,'_blank')
    Swal.fire('Imprimiendo','','success')
  }, [form.ficha, form.printCount, apiBase])

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">HEPATITIS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha" name="ficha" value={form.ficha} onChange={e=>setField('ficha',e.target.value)} />
        <Field label="Fecha"      name="fecha" type="date" value={form.fecha} onChange={e=>setField('fecha',e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={e=>setField('nombres',e.target.value)} />
        <Field label="Edad"    name="edad"    value={form.edad}    onChange={e=>setField('edad',e.target.value)} />
      </div>
      <Section title="Selección de prueba">
        <Checkbox label="HEPATITIS A (HAV)"   checked={form.hav}    onChange={v=>setField('hav',v)} />
        <Checkbox label="HEPATITIS B (HBsAg)" checked={form.hbsag} onChange={v=>setField('hbsag',v)} />
      </Section>
      <div className="flex items-center gap-4">
        <input
          name="printCount"
          value={form.printCount}
          onChange={e=>setField('printCount',e.target.value)}
          className="border rounded px-2 py-1 w-24"
          placeholder="Veces"
        />
        <ActionButton color="blue" icon={faPrint} onClick={handlePrint}>Imprimir</ActionButton>
      </div>
      <div className="flex justify-between">
        <ActionButton color="green" icon={faSave} onClick={handleSave}>Guardar</ActionButton>
        <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
      </div>
    </div>
  )
}

// Reusable
function Field({ label, name, type='text', value, onChange, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
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
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      {label}
    </label>
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
    green:  'bg-emerald-600 hover:bg-emerald-700',
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    blue:   'bg-blue-600 hover:bg-blue-700'
  }[color]
  return (
    <button onClick={onClick} className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2`}>
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
