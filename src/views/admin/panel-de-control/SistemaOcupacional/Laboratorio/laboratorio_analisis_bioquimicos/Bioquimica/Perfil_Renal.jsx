// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/PerfilRenal.jsx
import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { PrintHojaR, SubmitePerfilRenalLab, VerifyTR } from './controllerPerfR'

const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
export default function PerfilRenal({ token, selectedSede,userlogued }) {
  // Individual useState hooks for each form field
  const tabla = 'l_bioquimica'
  const [form, setForm] = useState({
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
  });

  const creatininaRef = useRef(null);
  const ureaRef = useRef(null);
  const acidoUricoRef = useRef(null);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Placeholder para la lógica de guardado
      Swal.fire('Guardado', 'Perfil renal guardado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar', 'error')
    }
  }

  const handleClear = () => {
    setForm({
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
    })
  }

  const handleSeat = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      muestra: 'SUERO',
      creatinina: '',
      urea: '',
      acidoUrico: '',
      printCount: '',
      medico: ''
    }))
  }

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Perfil Renal?',
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
      <h2 className="text-2xl font-bold text-center">PERFIL RENAL</h2>

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
              if (creatininaRef.current) creatininaRef.current.focus();
            }
          }}
        />
        <Field
          label="Fecha"
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleFormChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={form.nombres} disabled />
        <Field label="Edad" name="edad" value={form.edad} disabled />
      </div>

      <div>
        <label className="font-semibold mb-1 block">Muestra</label>
        <input
          readOnly
          name="muestra"
          value={form.muestra}
          className="border rounded px-2 py-1 bg-gray-100 w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t mt-4">
        <div className="font-bold text-center">PRUEBAS</div>
        <div className="font-bold text-center">RESULTADOS</div>

        <label className="font-semibold text-left">CREATININA SÉRICA</label>
        <input
          name="creatinina"
          value={form.creatinina}
          onChange={handleFormChange}
          className="border rounded px-2 py-1 w-full"
          ref={creatininaRef}
          onKeyDown={e => {
            if (e.key === 'Enter') ureaRef.current && ureaRef.current.focus();
          }}
        />

        <label className="font-semibold text-left">UREA SÉRICA</label>
        <input
          name="urea"
          value={form.urea}
          onChange={handleFormChange}
          className="border rounded px-2 py-1 w-full"
          ref={ureaRef}
          onKeyDown={e => {
            if (e.key === 'Enter') acidoUricoRef.current && acidoUricoRef.current.focus();
          }}
        />

        <label className="font-semibold text-left">ÁCIDO ÚRICO SÉRICO</label>
        <input
          name="acidoUrico"
          value={form.acidoUrico}
          onChange={handleFormChange}
          className="border rounded px-2 py-1 w-full"
          ref={acidoUricoRef}
        />
      </div>

      <div className="flex items-center mt-6 mb-2">
        <label className="font-medium mr-2" htmlFor="asignarMedico">ASIGNAR MEDICO:</label>
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

      <div className="flex justify-between items-end mt-6">
        <div className="flex gap-4">
          <ActionButton color="green" icon={faSave} onClick={() => {SubmitePerfilRenalLab(form,token,userlogued,handleClear,tabla)}}>Guardar/Actualizar</ActionButton>
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
              placeholder="Veces"
            />
            <ActionButton color="blue" icon={faPrint} onClick={handlePrint} />
          </div>
        </div>
      </div>
    </div>
  )
}

const Field = React.forwardRef(function Field({ label, name, type = 'text', value, onChange, disabled, onKeyUp }, ref) {
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
        ref={ref}
        className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`}
      />
    </div>
  )
});

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
