// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Hepatitis.jsx
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { PrintHojaR, SubmitHepatitisLab, VerifyTR } from './controller';

const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function Hepatitis({ token, selectedSede, userlogued }) {
  // Individual useState hooks for each form field
    const tabla = 'lhepatitis'

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    hav: true,
    hbsag: false,
    marca: 'RAPID TEST - MONTEST',
    resultadoHAV: '',
    resultadoHAVRadio: '',
    resultadoHBsAg: '',
    resultadoHBsAgRadio: '',
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
      hav: true,
      hbsag: false,
      marca: 'RAPID TEST - MONTEST',
      resultadoHAV: '',
      resultadoHAVRadio: '',
      resultadoHBsAg: '',
      resultadoHBsAgRadio: '',
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
      hav: true,
      hbsag: false,
      marca: 'RAPID TEST - MONTEST',
      resultadoHAV: '',
      resultadoHAVRadio: '',
      resultadoHBsAg: '',
      resultadoHBsAgRadio: '',
      printCount: '',
      medico: ''
    }))
  }

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Hepatitis?',
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

  // Lógica para habilitar/deshabilitar campos según el check (mejorada para cambio instantáneo y limpieza al desmarcar)

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nro Ficha" name="norden" value={form.norden} onChange={handleFormChange} 
        onKeyUp={e => {
          if (e.key === 'Enter') {
            handleSeat()
            VerifyTR(form.norden,tabla,token,setForm, selectedSede)
          }
        }}/>
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleFormChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} onChange={handleFormChange} disabled dynamicWidth />
        <Field label="Edad" name="edad" value={form.edad} onChange={handleFormChange} disabled />
      </div>

      <div className="flex items-center gap-6 mt-2">
        <Checkbox label="HEPATITIS A (HAV)" checked={form.hav} onChange={v => setForm(p => ({ ...p, hav: v, hbsag: false, resultadoHBsAg: ''  }))} />
        <Checkbox label="HEPATITIS B (HBsAg)" checked={form.hbsag} onChange={v => setForm(p => ({ ...p, hbsag: v, hav: false, resultadoHAV: '' }))} />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold">MARCA :</span>
        <input
          className="border rounded px-2 py-1 min-w-[220px]"
          name="marca"
          value={form.marca}
          onChange={handleFormChange}
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
            onChange={handleFormChange}
            disabled={!form.hav}
          />
        </div>
        <div className="col-span-4 flex gap-4">
          {["POSITIVO", "NEGATIVO"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="radio"
                name="resultadoHAVRadio"
                checked={form.resultadoHAVRadio === opt}
                onChange={e => {
                  if (e.target.checked) {
                    setForm(prev => ({
                      ...prev,
                      resultadoHAVRadio: opt,
                      resultadoHAV: opt
                    }));
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
            onChange={handleFormChange}
            disabled={!form.hbsag}
          />
        </div>
        <div className="col-span-4 flex gap-4">
          {["POSITIVO", "NEGATIVO"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="radio"
                name="resultadoHBsAgRadio"
                checked={form.resultadoHBsAgRadio === opt}
                onChange={e => {
                  if (e.target.checked) {
                    setForm(prev => ({
                      ...prev,
                      resultadoHBsAgRadio: opt,
                      resultadoHBsAg: opt
                    }));
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
              name="norden"
              value={form.norden}
              onChange={handleFormChange}
              className="border rounded px-2 py-1 w-24"
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
          name="medico"
          value={form.medico}
          onChange={handleFormChange}
          disabled
        >
          <option value="">Seleccionar medico</option>
          <option value="medico1">Dr. Juan Pérez</option>
          <option value="medico2">Dra. Ana Torres</option>
          <option value="medico3">Dr. Luis Gómez</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-4 mt-2">
        <ActionButton color="green" icon={faSave} onClick={() => {SubmitHepatitisLab(form,token,userlogued,handleClear,tabla)}}>Guardar/Actualizar</ActionButton>
        <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>Limpiar</ActionButton>
      </div>
    </div>
  )
}

// Reusable
function Field({ label, name, type='text', value, onChange, disabled, dynamicWidth, onKeyUp }) {
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
        className={`border rounded px-2 py-1 ${disabled?'bg-gray-100':''} ${dynamicWidth?'min-w-0 truncate overflow-x-auto':''}`}
        style={dynamicWidth ? { width: '100%' } : {}}
      />
    </div>
  )
}
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input type="radio" checked={checked} onChange={e=>onChange(e.target.checked)} />
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
