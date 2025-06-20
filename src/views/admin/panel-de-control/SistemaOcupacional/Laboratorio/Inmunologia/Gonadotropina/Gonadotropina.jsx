// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Gonadotropina.jsx
import React, { useReducer, useEffect, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { VerifyTR } from './controller';

const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function Gonadotropina({ apiBase, token, selectedSede }) {
  const tabla = 'lgonadotropina'
  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    resultado: '',
    positivo: false,
    printCount: ''
  })

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

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
        <Field label="Nro Ficha" name="norden" value={form.norden} onChange={handleFormChange} 
          onKeyUp={event => {if(event.key === 'Enter')VerifyTR(form.norden,tabla,token,setForm, selectedSede)}}/>
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleFormChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={handleFormChange} disabled={true}/>
        <Field label="Edad"    name="edad"    value={form.edad}    onChange={handleFormChange} disabled={true}/>
      </div>
      <Section>
        <Field label="Resultado" name="resultado" value={form.resultado} onChange={handleFormChange} />
        <Checkbox
          label="Positivo"
          checked={form.positivo}
          onChange={handleFormChange}
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
function Field({ label, name, type='text', value, onChange, disabled, onKeyUp }) {
  return (
    <div className="flex flex-col min-w-0">
      <label className="font-medium mb-1">{label}</label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        onKeyUp={onKeyUp}
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
