// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Microbiologia.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import Microbiologia_Digitalizado from '../../../../../../jaspers/Inmunologia/Microbiologia_Digitalizado'
import { PrintHojaR, SubmitMicrobiologiaLab, VerifyTR } from './controller'

const today = new Date().toISOString().split('T')[0]

export default function Microbiologia({ token, selectedSede, userlogued }) {
  // Individual useState hooks for each form field
  const tabla = 'microbiologia'
  const [form, setForm] = useState({
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
    printCount: '',
    medico: ''
  });
  
  const fechaRef = useRef(null)

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  
  const handleSave = async () => {
    try {
      // await fetch...
      Swal.fire('Guardado','Microbiología guardada','success')
    } catch {
      Swal.fire('Error','No se pudo guardar','error')
    }
  }

  const handleClear = () => {
    setForm({
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
      printCount: '',
      medico: ''
    })
  }

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir MICROBIOLOGIA?',
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
        PrintHojaR(form.norden,token,tabla);
      }
    });
  }

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">MICROBIOLOGÍA</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="norden"
          value={form.norden}
          onChange={handleFormChange}
          onKeyUp={event => {
            if (event.key === 'Enter') {
              VerifyTR(form.norden, tabla, token, setForm, selectedSede);
            }
          }}
        />
        <Field
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleFormChange}
          inputRef={fechaRef}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={handleFormChange} disabled />
        <Field label="Edad" name="edad" value={form.edad} onChange={handleFormChange} disabled />
      </div>

      <Checkbox
        label="Examen Directo"
        checked={form.examenDirecto}
        onChange={v => setForm(f => ({ ...f, examenDirecto: v }))}
      />

      <div className="text-center font-semibold">MUESTRA: ESPUTO</div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-4 font-bold flex items-center">PRUEBA</div>
        <div className="col-span-2 font-bold flex items-center">RESULTADO</div>
        <div className="col-span-6"></div>

        {/* BK 1 */}
        <div className="col-span-4 flex items-center">Examen de BK - BACILOSCOPIA 1ª<span className="ml-1">:</span></div>
        <div className="col-span-2">
          <input
            className="border rounded px-2 py-1 w-full"
            name="bk1"
            value={form.bk1}
            onChange={handleFormChange}
            disabled={form.examenDirecto}
          />
        </div>
        <div className="col-span-6 flex gap-4">
          {["BAAR - NEGATIVO", "BAAR - POSITIVO", "N/A"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="bk1Radio"
                checked={form.bk1Radio === opt}
                disabled={form.examenDirecto}
                onChange={e => {
                  setForm(f => ({
                    ...f,
                    bk1Radio: e.target.checked ? opt : '',
                    bk1: e.target.checked ? opt : ''
                  }));
                }}
              />
              {opt}
            </label>
          ))}
        </div>

        {/* BK 2 */}
        <div className="col-span-4 flex items-center">Examen de BK - BACILOSCOPIA 2ª<span className="ml-1">:</span></div>
        <div className="col-span-2">
          <input
            className="border rounded px-2 py-1 w-full"
            name="bk2"
            value={form.bk2}
            onChange={handleFormChange}
            disabled={form.examenDirecto}
          />
        </div>
        <div className="col-span-6 flex gap-4">
          {["BAAR - NEGATIVO", "BAAR - POSITIVO", "N/A"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="bk2Radio"
                checked={form.bk2Radio === opt}
                disabled={form.examenDirecto}
                onChange={e => {
                  setForm(f => ({
                    ...f,
                    bk2Radio: e.target.checked ? opt : '',
                    bk2: e.target.checked ? opt : ''
                  }));
                }}
              />
              {opt}
            </label>
          ))}
        </div>

        {/* KOH */}
        <div className="col-span-4 flex items-center">KOH<span className="ml-1">:</span></div>
        <div className="col-span-2">
          <input
            className="border rounded px-2 py-1 w-full"
            name="koh"
            value={form.koh}
            onChange={handleFormChange}
            disabled={!form.examenDirecto}
          />
        </div>
        <div className="col-span-6 flex gap-4">
          {["BAAR - NEGATIVO", "BAAR - POSITIVO", "N/A"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="kohRadio"
                checked={form.kohRadio === opt}
                disabled={!form.examenDirecto}
                onChange={e => {
                  setForm(f => ({
                    ...f,
                    kohRadio: e.target.checked ? opt : '',
                    koh: e.target.checked ? opt : ''
                  }));
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* ASIGNAR MÉDICO */}
      <div className="flex items-center mt-6 mb-2">
        <label className="font-medium mr-2" htmlFor="asignarMedico">ASIGNAR MÉDICO:</label>
        <select
          id="asignarMedico"
          disabled
          className="border rounded px-2 py-1 min-w-[220px]"
          name="medico"
          value={form.medico}
          onChange={handleFormChange}
        >
          <option value="">Seleccionar médico</option>
          <option value="medico1">Dr. Juan Pérez</option>
          <option value="medico2">Dra. Ana Torres</option>
          <option value="medico3">Dr. Luis Gómez</option>
        </select>
      </div>

      {/* BOTONES E IMPRESIÓN */}
      <div className="flex justify-between items-end mt-6">
        <div className="flex gap-4">
          <ActionButton color="green" icon={faSave} onClick={() => {SubmitMicrobiologiaLab(form,token,userlogued,handleClear,tabla)}}>Guardar/Actualizar</ActionButton>
          <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold italic text-blue-800 mb-1">IMPRIMIR</div>
          <div className="flex items-center gap-2">
            <input
              name="norden"
              value={form.norden}
              onChange={handleFormChange}
              className="border rounded px-2 py-1 w-24"
            />
            <ActionButton color="blue" icon={faPrint} onClick={handlePrint} />
          </div>
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
