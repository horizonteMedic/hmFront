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
  marca: 'RAPID TEST - MONTEST',
  resultadoHAV: '',
  resultadoHAVRadio: '',
  resultadoHBsAg: '',
  resultadoHBsAgRadio: '',
  printCount: '',
  medico: ''
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

  useEffect(() => {
    if (form.hav) {
      dispatch({ type: 'SET', field: 'hbsag', value: false });
      dispatch({ type: 'SET', field: 'resultadoHBsAg', value: '' });
      dispatch({ type: 'SET', field: 'resultadoHBsAgRadio', value: '' });
    }
    if (form.hbsag) {
      dispatch({ type: 'SET', field: 'hav', value: false });
      dispatch({ type: 'SET', field: 'resultadoHAV', value: '' });
      dispatch({ type: 'SET', field: 'resultadoHAVRadio', value: '' });
    }
  }, [form.hav, form.hbsag]);

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

  // Lógica para habilitar/deshabilitar campos según el check (mejorada para cambio instantáneo y limpieza al desmarcar)
  const handleCheck = useCallback((field) => {
    if (field === 'hav') {
      if (!form.hav) {
        // Se va a activar HAV
        dispatch({ type: 'SET', field: 'hav', value: true });
        dispatch({ type: 'SET', field: 'hbsag', value: false });
        dispatch({ type: 'SET', field: 'resultadoHBsAg', value: '' });
        dispatch({ type: 'SET', field: 'resultadoHBsAgRadio', value: '' });
      } else {
        // Se va a desactivar HAV
        dispatch({ type: 'SET', field: 'hav', value: false });
        dispatch({ type: 'SET', field: 'resultadoHAV', value: '' });
        dispatch({ type: 'SET', field: 'resultadoHAVRadio', value: '' });
      }
    } else if (field === 'hbsag') {
      if (!form.hbsag) {
        // Se va a activar HBsAg
        dispatch({ type: 'SET', field: 'hbsag', value: true });
        dispatch({ type: 'SET', field: 'hav', value: false });
        dispatch({ type: 'SET', field: 'resultadoHAV', value: '' });
        dispatch({ type: 'SET', field: 'resultadoHAVRadio', value: '' });
      } else {
        // Se va a desactivar HBsAg
        dispatch({ type: 'SET', field: 'hbsag', value: false });
        dispatch({ type: 'SET', field: 'resultadoHBsAg', value: '' });
        dispatch({ type: 'SET', field: 'resultadoHBsAgRadio', value: '' });
      }
    }
  }, [form.hav, form.hbsag]);

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha" name="ficha" value={form.ficha} onChange={e=>setField('ficha',e.target.value)} />
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={e=>setField('fecha',e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={e=>setField('nombres',e.target.value)} disabled dynamicWidth />
        <Field label="Edad" name="edad" value={form.edad} onChange={e=>setField('edad',e.target.value)} disabled />
      </div>
      <div className="flex items-center gap-6 mt-2">
        <Checkbox label="HEPATITIS A (HAV)" checked={form.hav} onChange={()=>handleCheck('hav')} />
        <Checkbox label="HEPATITIS B (HBsAg)" checked={form.hbsag} onChange={()=>handleCheck('hbsag')} />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold">MARCA :</span>
        <input
          className="border rounded px-2 py-1 min-w-[220px]"
          name="marca"
          value={form.marca}
          onChange={e=>setField('marca',e.target.value)}
        />
      </div>
      <div className="grid grid-cols-12 gap-2 items-center mt-4">
        <div className="col-span-4 font-bold flex items-center">PRUEBAS</div>
        <div className="col-span-4 font-bold flex items-center">RESULTADOS</div>
        <div className="col-span-4"></div>
        {/* HAV */}
        <div className="col-span-4 flex items-center">HEPATITIS A (HAV) - RAPID TEST</div>
        <div className="col-span-4">
          <input
            className="border rounded px-2 py-1 w-full"
            name="resultadoHAV"
            value={form.resultadoHAV}
            onChange={e=>setField('resultadoHAV',e.target.value)}
            disabled={!form.hav}
          />
        </div>
        <div className="col-span-4 flex gap-4">
          {["POSITIVO","NEGATIVO"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="radio"
                name="resultadoHAVRadio"
                checked={form.resultadoHAVRadio===opt}
                onChange={e => {
                  if (e.target.checked) {
                    setField('resultadoHAVRadio', opt);
                    setField('resultadoHAV', opt);
                  }
                }}
                disabled={!form.hav}
              />
              <span className="font-bold">{opt}</span>
            </label>
          ))}
        </div>
        {/* HBsAg */}
        <div className="col-span-4 flex items-center">HEPATITIS B (HBsAg) - RAPID TEST</div>
        <div className="col-span-4">
          <input
            className="border rounded px-2 py-1 w-full"
            name="resultadoHBsAg"
            value={form.resultadoHBsAg}
            onChange={e=>setField('resultadoHBsAg',e.target.value)}
            disabled={!form.hbsag}
          />
        </div>
        <div className="col-span-4 flex gap-4">
          {["POSITIVO","NEGATIVO"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="radio"
                name="resultadoHBsAgRadio"
                checked={form.resultadoHBsAgRadio===opt}
                onChange={e => {
                  if (e.target.checked) {
                    setField('resultadoHBsAgRadio', opt);
                    setField('resultadoHBsAg', opt);
                  }
                }}
                disabled={!form.hbsag}
              />
              <span className="font-bold">{opt}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Área de imprimir */}
      <div className="flex justify-end items-end mt-2">
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
      {/* Botones */}
      <div className="flex gap-4 mt-2">
        <ActionButton color="green" icon={faSave} onClick={handleSave}>Guardar/Actualizar</ActionButton>
        <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
      </div>
    </div>
  )
}

// Reusable
function Field({ label, name, type='text', value, onChange, disabled, dynamicWidth }) {
  return (
    <div className="flex flex-col min-w-0">
      <label className="font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
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
