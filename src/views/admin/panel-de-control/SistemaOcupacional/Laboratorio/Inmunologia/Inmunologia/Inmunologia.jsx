// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Inmunologia.jsx
import React, { useReducer, useEffect, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import inmunologia1 from '../../../../../../jaspers/inmunologialab'
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE'

const pruebasList = [
  'TIFICO O',
  'TIFICO H',
  'PARATIFICO A',
  'PARATIFICO B',
  'Brucella abortus'
]
const today = new Date().toISOString().split('T')[0]

const initialState = {
  norden: '',
  fecha: today,
  nombres: '',
  edad: '',
  resultados: pruebasList.map(() => '1/40'),
  hepatitis: false,
  hepatitisA: '',
  printCount: '',
  medico: ''
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET': {
      const { field, value } = action
      return Array.isArray(state[field])
        ? { ...state, [field]: value }
        : { ...state, [field]: value }
    }
    case 'RESET':
      return initialState
    case 'LOAD':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default function Inmunologia({ apiBase, token, selectedSede }) {
  const [form, dispatch] = useReducer(reducer, { ...initialState })
  const fechaRef = useRef(null)

  useEffect(() => {
    if (!form.norden) return
    VerifyTR(form.norden, 'inmunologia', token, dispatch, selectedSede)
  }, [form.norden, token, selectedSede])

  const setField = useCallback((field, value) => dispatch({ type:'SET', field, value }), [])

  const handleResultadoChange = (idx, value) => {
    const arr = [...form.resultados]
    arr[idx] = value
    setField('resultados', arr)
  }

  const handleSave = useCallback(async () => {
    try {
      // await fetch...
      Swal.fire('Guardado','Inmunología guardada','success')
    } catch {
      Swal.fire('Error','No se pudo guardar','error')
    }
  }, [form])

  const handleClear = useCallback(() => {
    dispatch({ type:'RESET' })
    Swal.fire('Limpiado','Formulario reiniciado','success')
  }, [])

  const handlePrint = useCallback(() => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Inmunología?',
      html: `<div>N° <b>${form.norden}</b> - <b>${form.nombres}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir'
    }).then(res => {
      if (res.isConfirmed) {
        inmunologia1({ ...form })
        Swal.fire('Imprimiendo','','success')
      }
    })
  }, [form])

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">INMUNOLOGÍA</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha" name="norden" value={form.norden} onChange={e=>setField('norden',e.target.value)} onKeyUp={e=>e.key==='Enter'&&VerifyTR(form.norden,'inmunologia',token,dispatch,selectedSede)} />
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={e=>setField('fecha',e.target.value)} inputRef={fechaRef} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={e=>setField('nombres',e.target.value)} disabled dynamicWidth />
        <Field label="Edad"    name="edad"    value={form.edad}    onChange={e=>setField('edad',e.target.value)} disabled />
      </div>

      <Section>
        <h3 className="font-semibold text-center">MÉTODO EN LÁMINA PORTAOBJETO</h3>
      </Section>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-2 font-bold flex items-center">PRUEBAS</div>
        <div className="col-span-2 font-bold flex items-center">RESULTADOS</div>
        <div className="col-span-8"></div>
        {pruebasList.map((lbl, i) => (
          <React.Fragment key={i}>
            <div className="col-span-2 flex items-center">{lbl}</div>
            <div className="col-span-2">
              <input
                className="border rounded px-2 py-1 w-full"
                value={form.resultados[i]}
                onChange={e=>handleResultadoChange(i,e.target.value)}
              />
            </div>
            <div className="col-span-8"></div>
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-2 items-center mt-4">
        <div className="col-span-4 flex items-center">
          <Checkbox label={<span className="font-bold">PRUEBA HEPATITIS</span>} checked={form.hepatitis} onChange={v=>setField('hepatitis',v)} />
        </div>
        <div className="col-span-4 flex items-center">
          {form.hepatitis && (
            <input
              className="border rounded px-2 py-1 ml-4 w-full"
              name="hepatitisA"
              value={form.hepatitisA}
              onChange={e=>setField('hepatitisA',e.target.value)}
              placeholder="Prueba Rápida HEPATITIS A"
              disabled={!form.hepatitis}
            />
          )}
        </div>
        <div className="col-span-4"></div>
      </div>

      {/* Campo ASIGNAR MEDICO */}
      <div className="flex items-center mt-6 mb-2">
        <label className="font-medium mr-2" htmlFor="asignarMedico">ASIGNAR MEDICO:</label>
        <select
          id="asignarMedico"
          className="border rounded px-2 py-1 min-w-[220px]"
          value={form.medico || ''}
          onChange={e => setField('medico', e.target.value)}
        >
          <option value="">Seleccionar medico</option>
          <option value="medico1">Dr. Juan Pérez</option>
          <option value="medico2">Dra. Ana Torres</option>
          <option value="medico3">Dr. Luis Gómez</option>
        </select>
      </div>

      {/* Botones y área de imprimir */}
      <div className="flex justify-between items-end mt-6">
        <div className="flex gap-4">
          <ActionButton color="green" icon={faSave} onClick={handleSave}>Guardar/Actualizar</ActionButton>
          <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold italic text-blue-800 mb-1">IMPRIMIR</div>
          <div className="flex items-center gap-2">
            <input
              name="printCount"
              value={form.printCount}
              onChange={e=>setField('printCount',e.target.value)}
              className="border rounded px-2 py-1 w-24"
              placeholder="Veces"
            />
            <ActionButton color="blue" icon={faPrint} onClick={handlePrint} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Aux
function Field({ label, name, type='text', value, onChange, disabled, inputRef, onKeyUp, dynamicWidth }) {
  return (
    <div className="flex flex-col min-w-0">
      <label className="font-medium mb-1">{label}</label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onKeyUp={onKeyUp}
        className={`border rounded px-2 py-1 ${disabled?'bg-gray-100':''} ${dynamicWidth?'min-w-0 truncate overflow-x-auto':''}`}
        style={dynamicWidth ? { width: '100%' } : {}}
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
  return <div className="mb-2">{children}</div>
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
