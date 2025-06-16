// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/BioquimicaAcidoUrico.jsx
import React, { useReducer, useEffect, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import AnalisisClinicosB_Digitalizado from '../../../../../../jaspers/AnalisisClinicosB_Digitalizado'
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE'

const today = new Date().toISOString().split('T')[0]

const initialState = {
  norden: '',
  fecha: today,
  nombres: '',
  edad: '',
  prueba: 'ÁCIDO ÚRICO SÉRICO',
  muestra: 'SUERO',
  resultado: '',
  valoresn: 'Mujeres : 2.5 - 6.8 mg/dl\nHombres : 3.6 - 7.7 mg/dl',
  sede: ''
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'LOAD':
      return { ...state, ...action.payload }
    case 'RESET':
      return { ...initialState, sede: state.sede }
    default:
      return state
  }
}

export default function BioquimicaAcidoUrico({ token, selectedSede }) {
  const [form, dispatch] = useReducer(reducer, { ...initialState, sede: selectedSede })
  const fechaRef = useRef(null)

  // when norden enters, verify and load
  useEffect(() => {
    if (!form.norden) return
    async function load() {
      await VerifyTR(form.norden, 'ac_bioquimica2022', token, dispatch, selectedSede)
    }
    load()
  }, [form.norden, token, selectedSede])

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }, [])

  const handleSave = useCallback(() => {
    // placeholder POST
    // await fetch(...)
    Swal.fire('Guardado', 'Datos de Ácido Úrico guardados', 'success')
  }, [])

  const handleClear = useCallback(() => {
    dispatch({ type: 'RESET' })
    Swal.fire('Limpiado', 'Formulario reiniciado', 'success')
  }, [])

  const handlePrint = useCallback(() => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Bioquímica?',
      html: `<div>N° <b>${form.norden}</b> - <b>${form.nombres}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir'
    }).then(result => {
      if (result.isConfirmed) {
        AnalisisClinicosB_Digitalizado({ ...form })
        Swal.fire('Imprimiendo', '', 'success')
      }
    })
  }, [form])

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">ÁCIDO ÚRICO</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="norden"
          value={form.norden}
          onChange={e => setField('norden', e.target.value)}
          onKeyUp={e => e.key==='Enter' && VerifyTR(form.norden,'ac_bioquimica2022',token,dispatch,selectedSede)}
        />
        <Field
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={e=>setField('fecha',e.target.value)}
          inputRef={fechaRef}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={e=>setField('nombres',e.target.value)}
          disabled
        />
        <Field
          label="Edad"
          name="edad"
          value={form.edad}
          onChange={e=>setField('edad',e.target.value)}
          disabled
        />
      </div>

      <Field label="PRUEBA" name="prueba" value={form.prueba} disabled />
      <Field label="MUESTRA" name="muestra" value={form.muestra} disabled />
      <Field label="RESULTADO" name="resultado" value={form.resultado} onChange={e=>setField('resultado',e.target.value)} />

      <Section>
        <label className="font-semibold">VALORES NORMALES</label>
        <textarea
          rows={2}
          readOnly
          value={form.valoresn}
          className="border rounded px-2 py-1 bg-gray-100 w-full"
        />
      </Section>

      <div className="flex justify-between">
        <ActionButton color="green" icon={faSave} onClick={handleSave}>Guardar/Actualizar</ActionButton>
        <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
        <ActionButton color="blue" icon={faPrint} onClick={handlePrint}>Imprimir</ActionButton>
      </div>
    </div>
  )
}

// --- Aux components ---
function Field({ label, name, type = 'text', value, onChange, disabled, inputRef, onKeyUp }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onKeyUp={onKeyUp}
        className={`border rounded px-2 py-1 ${disabled?'bg-gray-100':''}`}
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
