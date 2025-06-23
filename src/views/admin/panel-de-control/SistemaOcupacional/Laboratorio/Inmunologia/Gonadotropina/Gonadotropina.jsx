// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Gonadotropina.jsx
import React, { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { PrintHojaR, SubmitGonadotropinaLab, VerifyTR } from './controller';

const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function Gonadotropina({ token, selectedSede, userlogued }) {
  const tabla = 'lgonadotropina'
  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    resultado: 'NEGATIVO',
    positivo: false,
    negativo: true,
    printCount: ''
  })

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }


  const handleClear = () => {
    setForm({
      norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    resultado: 'NEGATIVO',
    positivo: false,
    negativo: true,
    printCount: ''
    })
  }

   const handlePrint = () => {
      if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
      Swal.fire({
        title: '¿Desea Imprimir Gonadotropina?',
        html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Imprimir',
        cancelButtonText: 'Cancelar',
        customClass: {
          title: 'swal2-title',
          confirmButton: 'swal2-confirm',
          cancelButton: 'swal2-cancel'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          PrintHojaR(form.norden,token);
        }
      });
    };

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
        <div className="flex flex-row min-w-0 items-center gap-1">
          <label className="font-medium mb-1">Resultado</label>
          <input
            type='text'
            name='resultado'
            value={form.resultado}
            onChange={handleFormChange}
            className={`border rounded px-2 py-1 mr-4`}
          />
          <Checkbox
          label="Positivo"
          name="positivo"
          checked={form.positivo}
          onChange={() => {setForm(prev => ({...prev, negativo: false, positivo: true, resultado: 'POSITIVO'}))}}
          />
          <Checkbox
            label="Negativo"
            name="negativo"
            checked={form.negativo}
            onChange={() => {setForm(prev => ({...prev, positivo: false, negativo: true, resultado: 'NEGATIVO'}))}}
          />
      </div>
        
      </Section>
      <div className="flex justify-between">
        <ActionButton color="green" icon={faSave} onClick={() => {SubmitGonadotropinaLab(form,token,userlogued,handleClear)}}>Guardar</ActionButton>
        <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
        <div className="flex flex-row items-end">
          <input className="border rounded px-2 py-1 w-24" value={form.norden} name="norden" onChange={handleFormChange}  />
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>IMPRIMIR</span>
          </button>
        </div>
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
        type={type}
        name={name}
        onKeyUp={onKeyUp}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`border rounded px-2 py-1 ${disabled?'bg-gray-100':''}`}
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
function Section({ children }) {
  return <div className="space-y-2">{children}</div>
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 mr-4">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      {label}
    </label>
  )
}