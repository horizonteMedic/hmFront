// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Gonadotropina.jsx
import React, { useReducer, useEffect, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

const today = new Date().toISOString().split('T')[0]

const initialState = {
  ficha: '',
  fecha: today,
  nombres: '',
  edad: '',
  resultado: '',
  resultadoRadio: '',
  medico: '',
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

export default function Gonadotropina({ apiBase, token, selectedSede }) {
  const [form, dispatch] = useReducer(reducer, initialState)
  const fechaRef = useRef(null)

  // Simulación de carga automática de nombres/edad al ingresar ficha
  useEffect(() => {
    if (!form.ficha) return
    async function load() {
      // Simulación: aquí iría la llamada a la API para obtener nombres y edad
      // const res = await fetch(`${apiBase}/gonadotropina/${form.ficha}`,{headers:{Authorization:`Bearer ${token}`}})
      // const data = await res.json()
      // dispatch({ type:'LOAD', payload:data })
      // Demo:
      if (form.ficha === '123') {
        dispatch({ type: 'LOAD', payload: { nombres: 'María Fernanda de la Cruz', edad: '29' } })
      } else {
        dispatch({ type: 'LOAD', payload: { nombres: '', edad: '' } })
      }
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
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">GONADOTROPINA CORIÓNICA HUMANA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="ficha"
          value={form.ficha}
          onChange={e => setField('ficha', e.target.value)}
        />
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={e=>setField('fecha',e.target.value)} inputRef={fechaRef} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={e=>setField('nombres',e.target.value)} disabled dynamicWidth />
        <Field label="Edad" name="edad" value={form.edad} onChange={e=>setField('edad',e.target.value)} disabled />
      </div>
      <div className="grid grid-cols-12 gap-2 items-center mt-4">
        <div className="col-span-4 font-bold flex items-center">PRUEBAS</div>
        <div className="col-span-2 font-bold flex items-center">RESULTADOS</div>
        <div className="col-span-6"></div>

        {/* GONADOTROPINA CORIÓNICA HUMANA */}
        <div className="col-span-4 flex items-center">GONADOTROPINA CORIÓNICA HUMANA</div>
        <div className="col-span-2">
          <input
            className="border rounded px-2 py-1 w-full"
            name="resultado"
            value={form.resultado}
            onChange={e=>setField('resultado', e.target.value)}
            disabled
          />
        </div>
        <div className="col-span-6 flex gap-4">
          {["NEGATIVO","POSITIVO"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="radio"
                name="resultadoRadio"
                checked={form.resultadoRadio===opt}
                onChange={e => {
                  if (e.target.checked) {
                    setField('resultadoRadio', opt);
                    setField('resultado', opt);
                  }
                }}
              />
              <span className="font-bold">{opt}</span>
            </label>
          ))}
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
function Field({ label, name, type='text', value, onChange, disabled, inputRef, dynamicWidth }) {
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
        className={`border rounded px-2 py-1 ${disabled?'bg-gray-100':''} ${dynamicWidth?'min-w-0 truncate overflow-x-auto':''}`}
        style={dynamicWidth ? { width: '100%' } : {}}
      />
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
