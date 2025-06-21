// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/PerfilRenal.jsx
import React, { useReducer, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE'
import Perfil_Renal_Digitalizado from '../../../../../../jaspers/AnalisisBioquimicos/Perfil_Renal'

const today = new Date().toISOString().split('T')[0]

const initialState = {
  norden: '',
  fecha: today,
  nombres: '',
  edad: '',
  muestra: 'SUERO',
  creatinina: '',
  urea: '',
  acidoUrico: '',
  printCount: '',
  medico: ''
}

const testFields = [
  { label: 'CREATININA SÉRICA', name: 'creatinina' },
  { label: 'UREA SÉRICA', name: 'urea' },
  { label: 'ACIDO URICO SÉRICO', name: 'acidoUrico' },
]

function reducer(state, action) {
  switch (action.type) {
    case 'SET': return { ...state, [action.field]: action.value }
    case 'LOAD': return { ...state, ...action.payload }
    case 'RESET': return initialState
    default: return state
  }
}

export default function PerfilRenal({ apiBase, token, selectedSede }) {
  const [form, dispatch] = useReducer(reducer, initialState)

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET', field, value })
  }, [])

  const handleSave = useCallback(async () => {
    try {
      // Placeholder para la lógica de guardado
      Swal.fire('Guardado', 'Perfil renal guardado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar', 'error')
    }
  }, [form])

  const handleClear = useCallback(() => {
    dispatch({ type: 'RESET' })
    Swal.fire('Limpiado', 'Formulario reiniciado', 'success')
  }, [])

  const handlePrint = useCallback(() => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Perfil Renal?',
      html: `<div>N° <b>${form.norden}</b> - <b>${form.nombres}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir'
    }).then(res => {
      if (res.isConfirmed) {
        Perfil_Renal_Digitalizado({
          n_orden: form.norden,
          paciente: form.nombres,
          edad: form.edad,
          fecha: form.fecha,
          txtcreatinina: form.creatinina,
          txtureaserica: form.urea,
          txtacidourico: form.acidoUrico
        })
        Swal.fire('Imprimiendo','','success')
      }
    })
  }, [form])

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">PERFIL RENAL</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="norden"
          value={form.norden}
          onChange={e => setField('norden', e.target.value)}
          onKeyUp={e => e.key === 'Enter' && VerifyTR(form.norden, 'perfil_renal', token, dispatch, selectedSede)}
        />
        <Field label="Fecha" type="date" name="fecha" value={form.fecha} onChange={e => setField('fecha', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} disabled />
        <Field label="Edad" name="edad" value={form.edad} disabled />
      </div>
      
      <div>
        <label className="font-semibold mb-1 block">Muestra</label>
        <input readOnly value={form.muestra} className="border rounded px-2 py-1 bg-gray-100 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t mt-4">
        <div className="font-bold text-center">PRUEBAS</div>
        <div className="font-bold text-center">RESULTADOS</div>
        {testFields.map(({label, name}) => (
          <React.Fragment key={name}>
            <label className="font-semibold text-left">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={e => setField(name, e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center mt-6 mb-2">
        <label className="font-medium mr-2" htmlFor="asignarMedico">ASIGNAR MEDICO:</label>
        <select id="asignarMedico" className="border rounded px-2 py-1 min-w-[220px]" value={form.medico || ''} onChange={e => setField('medico', e.target.value)}>
          <option value="">Seleccionar medico</option>
          <option value="medico1">Dr. Juan Pérez</option>
          <option value="medico2">Dra. Ana Torres</option>
          <option value="medico3">Dr. Luis Gómez</option>
        </select>
      </div>

      <div className="flex justify-between items-end mt-6">
        <div className="flex gap-4">
          <ActionButton color="green" icon={faSave} onClick={handleSave}>Guardar/Actualizar</ActionButton>
          <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold italic text-blue-800 mb-1">IMPRIMIR</div>
          <div className="flex items-center gap-2">
            <input name="printCount" value={form.printCount} onChange={e => setField('printCount', e.target.value)} className="border rounded px-2 py-1 w-24" placeholder="Veces" />
            <ActionButton color="blue" icon={faPrint} onClick={handlePrint} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, disabled, onKeyUp }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      <input type={type} name={name} value={value} disabled={disabled} onChange={onChange} onKeyUp={onKeyUp} className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`} />
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
      <FontAwesomeIcon icon={icon} /> {children}
    </button>
  )
}
