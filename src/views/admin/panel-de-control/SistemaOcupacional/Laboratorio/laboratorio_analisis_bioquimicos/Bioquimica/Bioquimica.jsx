// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/PerfilRenal.jsx
import React, { useReducer, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

const initialState = {
  ficha: '',
  fecha: new Date().toISOString().split('T')[0],
  nombres: '',
  edad: '',
  creatinina: '',
  urea: '',
  acidoUrico: '',
  printCount: ''
}

function formReducer(state, action) {
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

export default function PerfilRenal({ apiBase, token, selectedSede }) {
  const [form, dispatch] = useReducer(formReducer, initialState)

  // when ficha changes, load existing record
  useEffect(() => {
    if (!form.ficha) return
    async function load() {
      // placeholder for API call:
      // const res = await fetch(`${apiBase}/renal/${form.ficha}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // const data = await res.json()
      // dispatch({ type: 'LOAD', payload: data })
    }
    load()
  }, [form.ficha, apiBase, token])

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }, [])

  const handleSave = useCallback(async () => {
    try {
      const payload = { ...form, sede: selectedSede }
      // await fetch(`${apiBase}/renal`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(payload)
      // })
      Swal.fire('Guardado', 'Perfil renal guardado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar', 'error')
    }
  }, [form, apiBase, token, selectedSede])

  const handleClear = useCallback(() => {
    dispatch({ type: 'RESET' })
    Swal.fire('Limpiado', 'Formulario reiniciado', 'success')
  }, [])

  const handlePrint = useCallback(() => {
    window.open(`${apiBase}/renal/print?ficha=${form.ficha}&count=${form.printCount}`, '_blank')
    Swal.fire('Imprimiendo', 'Se ha abierto la ventana de impresión', 'success')
  }, [apiBase, form.ficha, form.printCount])

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">PERFIL RENAL</h2>

      {/* Encabezado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="ficha"
          value={form.ficha}
          onChange={e => setField('ficha', e.target.value)}
        />
        <Field
          label="Fecha"
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={e => setField('fecha', e.target.value)}
        />
      </div>

      {/* Paciente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={e => setField('nombres', e.target.value)}
        />
        <Field
          label="Edad"
          name="edad"
          value={form.edad}
          onChange={e => setField('edad', e.target.value)}
        />
      </div>

      {/* Muestra fija */}
      <div>
        <label className="font-semibold">Muestra:</label>
        <input
          readOnly
          value="SUERO"
          className="border rounded px-2 py-1 bg-gray-100 ml-2"
        />
      </div>

      {/* Pruebas y Resultados */}
      <div className="grid grid-cols-3 gap-4">
        <Section>
          <h3 className="font-bold">PRUEBAS</h3>
          <div className="space-y-2 mt-2">
            <span>CREATININA SÉRICA</span>
            <span>UREA SÉRICA</span>
            <span>ÁCIDO ÚRICO SÉRICO</span>
          </div>
        </Section>
        <Section>
          <h3 className="font-bold">RESULTADOS</h3>
          <div className="space-y-2 mt-2">
            <input
              className="border rounded px-2 py-1 w-full"
              value={form.creatinina}
              onChange={e => setField('creatinina', e.target.value)}
            />
            <input
              className="border rounded px-2 py-1 w-full"
              value={form.urea}
              onChange={e => setField('urea', e.target.value)}
            />
            <input
              className="border rounded px-2 py-1 w-full"
              value={form.acidoUrico}
              onChange={e => setField('acidoUrico', e.target.value)}
            />
          </div>
        </Section>
        <div className="flex flex-col justify-between">
          <ActionButton color="green" icon={faSave} onClick={handleSave}>
            Guardar/Actualizar
          </ActionButton>
          <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>
            Limpiar
          </ActionButton>
        </div>
      </div>

      {/* Imprimir */}
      <div className="flex flex-col items-end space-y-2">
        <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
        <div className="flex items-center gap-2">
          <input
            name="printCount"
            value={form.printCount}
            onChange={e => setField('printCount', e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
          <ActionButton color="blue" icon={faPrint} onClick={handlePrint} />
        </div>
      </div>
    </div>
  )
}

// Aux components

function Field({ label, name, type = 'text', value, onChange, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
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
    <button
      onClick={onClick}
      className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
