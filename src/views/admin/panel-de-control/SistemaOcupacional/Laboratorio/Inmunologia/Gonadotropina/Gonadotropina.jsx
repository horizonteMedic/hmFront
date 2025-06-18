// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Gonadotropina.jsx
import React, { useReducer, useEffect, useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;


function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialState
    case 'LOAD':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default function Gonadotropina({ apiBase, token, selectedSede }) {
  const [form, setForm] = useState({
    ficha: '',
    fecha: today,
    nombres: '',
    edad: '',
    resultado: '',
    positivo: false,
    printCount: ''
  })

  // load existing when ficha changes
  useEffect(() => {
    if (!form.ficha) return
    async function load() {
      // const res = await fetch(`${apiBase}/gonadotropina/${form.ficha}`,{headers:{Authorization:`Bearer ${token}`}})
      // const data = await res.json()
      // dispatch({ type:'LOAD', payload:data })
    }
    load()
  }, [form.ficha, apiBase, token])

  const setField = useCallback((field, value) => dispatch({ type:'SET', field, value }), [])

  const handleSave = useCallback(async () => {
    try {
      // await fetch(`${apiBase}/gonadotropina`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({...form, sede:selectedSede})})
      Swal.fire('Guardado', 'Datos guardados correctamente', 'success')
    } catch {
      Swal.fire('Error', 'No se pudo guardar', 'error')
    }
  }, [form, apiBase, token, selectedSede])

  const handleClear = useCallback(() => {
    dispatch({ type:'RESET' })
    Swal.fire('Limpiado', 'Formulario reiniciado', 'success')
  }, [])

  const handlePrint = useCallback(() => {
    window.open(`${apiBase}/gonadotropina/print?ficha=${form.ficha}&count=${form.printCount}`, '_blank')
    Swal.fire('Imprimiendo', 'Se abrió la ventana de impresión', 'success')
  }, [form.ficha, form.printCount, apiBase])

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">GONADOTROPINA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha" name="ficha" value={form.ficha} onChange={e=>setField('ficha',e.target.value)} />
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={e=>setField('fecha',e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={e=>setField('nombres',e.target.value)} />
        <Field label="Edad"    name="edad"    value={form.edad}    onChange={e=>setField('edad',e.target.value)} />
      </div>
      <Section>
        <Field label="Resultado" name="resultado" value={form.resultado} onChange={e=>setField('resultado',e.target.value)} />
        <Checkbox
          label="Positivo"
          checked={form.positivo}
          onChange={v=>setField('positivo',v)}
        />
      </Section>
      <div className="flex items-center gap-4">
        <input
          name="printCount"
          value={form.printCount}
          onChange={e=>setField('printCount',e.target.value)}
          className="border rounded px-2 py-1 w-24"
          placeholder="Veces"
        />
        <ActionButton color="blue" icon={faPrint} onClick={handlePrint}>
          Imprimir
        </ActionButton>
      </div>
      <div className="flex justify-between">
        <ActionButton color="green" icon={faSave} onClick={handleSave}>Guardar</ActionButton>
        <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
      </div>
    </div>
  )
}

// Reusable components
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

function Section({ children }) {
  return <div className="space-y-2">{children}</div>
}

function ActionButton({ color, icon, onClick, children }) {
  const bg = {
    green:  'bg-emerald-600 hover:bg-emerald-700',
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    blue:   'bg-blue-600 hover:bg-blue-700'
  }[color]
  return (
    <button onClick={onClick} className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2`}>
      <FontAwesomeIcon icon={icon} /> {children}
    </button>
  )
}
