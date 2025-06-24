// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/BioquimicaAcidoUrico.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { PrintHojaR, SubmiteAcidoUricoLab, VerifyTR } from './controllerAcidoU.jsx'

const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function BioquimicaAcidoUrico({ token, selectedSede, userlogued }) {
  // Individual useState hooks for each form field
  const tabla = 'ac_bioquimica2022'
  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    prueba: 'ÁCIDO ÚRICO SÉRICO',
    muestra: 'SUERO',
    resultado: '',
    printCount: '',
    medico: ''
  });

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      prueba: 'ÁCIDO ÚRICO SÉRICO',
      muestra: 'SUERO',
      resultado: '',
      printCount: '',
      medico: ''
    })
  }

  const handleSeat = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      prueba: 'ÁCIDO ÚRICO SÉRICO',
      muestra: 'SUERO',
      resultado: '',
      printCount: '',
      medico: ''
    }))
  }

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Acido Urico?',
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
  <h2 className="text-2xl font-bold text-center">ÁCIDO ÚRICO</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field
      label="Nro Ficha"
      name="norden"
      value={form.norden}
      onChange={handleFormChange}
      onKeyUp={e => {
      if (e.key === 'Enter') {
        handleSeat()
        VerifyTR(form.norden,tabla,token,setForm, selectedSede)
      }}}
    />
      <Field
        label="Fecha"
        name="fecha"
        type="date"
        value={form.fecha}
        onChange={handleFormChange}
      />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} disabled />
        <Field label="Edad" name="edad" value={form.edad} disabled />
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-center pt-4 border-t mt-4">
        <FieldRow label="PRUEBA:">
          <input
            className="border rounded px-2 py-1 bg-gray-100 w-full"
            value={form.prueba}
            readOnly
          />
        </FieldRow>
        <FieldRow label="MUESTRA:">
          <input
            className="border rounded px-2 py-1 bg-gray-100 w-full"
            value={form.muestra}
            readOnly
          />
        </FieldRow>
        <FieldRow label="RESULTADO:">
          <input
            className="border rounded px-2 py-1 w-full"
            name="resultado"
            value={form.resultado}
            onChange={handleFormChange}
          />
        </FieldRow>
        <FieldRow label="VALORES NORMALES:">
          <div className="border rounded px-2 py-2 bg-gray-100 w-full text-sm">
            <div>Mujeres : 2.5 - 6.8 mg/dl</div>
            <div>Hombres : 3.6 - 7.7 mg/dl</div>
          </div>
        </FieldRow>
      </div>

      <div className="flex items-center mt-6 mb-2">
        <label className="font-medium mr-2" htmlFor="asignarMedico">ASIGNAR MEDICO:</label>
        <select
          id="asignarMedico"
          className="border rounded px-2 py-1 min-w-[220px]"
          name="medico"
          disabled
          value={form.medico}
          onChange={handleFormChange}
        >
          <option value="">Seleccionar medico</option>
          <option value="medico1">Dr. Juan Pérez</option>
          <option value="medico2">Dra. Ana Torres</option>
          <option value="medico3">Dr. Luis Gómez</option>
        </select>
      </div>

      <div className="flex justify-between items-end mt-6">
        <div className="flex gap-4">
          <ActionButton color="green" icon={faSave} onClick={() => {SubmiteAcidoUricoLab(form,token, userlogued,handleClear,tabla)}}>Guardar/Actualizar</ActionButton>
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

function Field({ label, name, type = 'text', value, onChange, disabled, onKeyUp }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onKeyUp={onKeyUp}
        className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`}
      />
    </div>
  )
}

function FieldRow({ label, children }) {
  return (
    <>
      <div className="text-right font-semibold pr-2">
        {label}
      </div>
      <div className="col-span-2">
        {children}
      </div>
    </>
  )
}

function ActionButton({ color, icon, onClick, children }) {
  const bg = {
    green: 'bg-emerald-600 hover:bg-emerald-700',
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    blue: 'bg-blue-600 hover:bg-blue-700'
  }[color]
  return (
    <button onClick={onClick} className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2`}>
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
