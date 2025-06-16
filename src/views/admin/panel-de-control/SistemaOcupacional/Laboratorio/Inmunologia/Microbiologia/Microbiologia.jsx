// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Microbiologia.jsx
import React, { useReducer, useEffect, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE'
import Microbiologia_Digitalizado from '../../../../../../jaspers/AnalisisBioquimicos/Microbiologia_Digitalizado'

const today = new Date().toISOString().split('T')[0]

const initialState = {
  norden: '',
  fecha: today,
  nombres: '',
  edad: '',
  examenDirecto: false,
  bk1: '',
  bk1Radio: '',
  bk2: '',
  bk2Radio: '',
  koh: '',
  kohRadio: '',
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

export default function Microbiologia({ apiBase, token, selectedSede }) {
  const [form, dispatch] = useReducer(reducer, initialState)
  const fechaRef = useRef(null)

  useEffect(() => {
    if (!form.norden) return
    VerifyTR(form.norden, 'microbiologia', token, dispatch, selectedSede)
  }, [form.norden, token, selectedSede])

  const setField = useCallback((field, value) => dispatch({ type:'SET', field, value }), [])

  const handleSave = useCallback(async () => {
    try {
      // await fetch...
      Swal.fire('Guardado','Microbiología guardada','success')
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
      title: '¿Desea Imprimir Hoja de Microbiología?',
      html: `<div>N° <b>${form.norden}</b> - <b>${form.nombres}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir'
    }).then(res => {
      if (res.isConfirmed) {
        Microbiologia_Digitalizado({
          norden: form.norden,
          nombres: form.nombres,
          edad: form.edad,
          fecha: form.fecha,
          bk1: form.bk1,
          bk2: form.bk2,
          koh: form.koh
        })
        Swal.fire('Imprimiendo','','success')
      }
    })
  }, [form])

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">MICROBIOLOGÍA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha" name="norden" value={form.norden} onChange={e=>setField('norden',e.target.value)} onKeyUp={e=>e.key==='Enter'&&VerifyTR(form.norden,'microbiologia',token,dispatch,selectedSede)} />
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={e=>setField('fecha',e.target.value)} inputRef={fechaRef} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={e=>setField('nombres',e.target.value)} disabled />
        <Field label="Edad" name="edad" value={form.edad} onChange={e=>setField('edad',e.target.value)} disabled />
      </div>
      <Checkbox label="Examen Directo" checked={form.examenDirecto} onChange={v=>setField('examenDirecto',v)} />
      <div className="text-center font-semibold">MUESTRA: ESPUTO</div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-4 font-bold">PRUEBA</div>
        <div className="col-span-2 font-bold">RESULTADO</div>
        <div className="col-span-6"></div>

        {[
          { label:'Examen de BK - BACILOSCOPIA 1ª', key:'bk1', radio:'bk1Radio' },
          { label:'Examen de BK - BACILOSCOPIA 2ª', key:'bk2', radio:'bk2Radio' },
          { label:'KOH', key:'koh', radio:'kohRadio' }
        ].map((item,i) => (
          <React.Fragment key={i}>
            <div className="col-span-4">{item.label} :</div>
            <div className="col-span-2">
              <input
                className="border rounded px-2 py-1 w-full"
                name={item.key}
                value={form[item.key]}
                onChange={e=>setField(item.key, e.target.value)}
              />
            </div>
            <div className="col-span-6 flex gap-4">
              {['NEGATIVO','POSITIVO','NA'].map(opt => (
                <label key={opt} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={item.radio}
                    checked={form[item.radio]===opt}
                    onChange={()=>setField(item.radio,opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <input
            name="printCount"
            value={form.printCount}
            onChange={e=>setField('printCount',e.target.value)}
            className="border rounded px-2 py-1 w-24"
            placeholder="Veces"
          />
          <ActionButton color="blue" icon={faPrint} onClick={handlePrint}>Imprimir</ActionButton>
        </div>
        <div className="flex gap-4">
          <ActionButton color="green" icon={faSave} onClick={handleSave}>Guardar</ActionButton>
          <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
        </div>
      </div>
    </div>
  )
}

// Aux
function Field({ label, name, type='text', value, onChange, disabled, inputRef, onKeyUp }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
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
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      {label}
    </label>
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
