// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Inmunologia.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { PrintHojaR, SubmitInmunologiaLab, VerifyTR } from './controller'


const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function Inmunologia({ token, selectedSede, userlogued }) {
  // Individual useState hooks for each form field
  const tabla = 'inmunologia'
  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    tificoO: '',
    tificoH: '',
    paratificoA: '',
    paratificoB: '',
    brucella: '',
    hepatitis: false,
    hepatitisA: '',
    printCount: '',
    medico: ''
  });
  
  // Refs para cada campo
  const fechaRef = useRef(null);
  const tificoORef = useRef(null);
  const tificoHRef = useRef(null);
  const paratificoARef = useRef(null);
  const paratificoBRef = useRef(null);
  const brucellaRef = useRef(null);
  const hepatitisARef = useRef(null);
  const medicoRef = useRef(null);
  const printRef = useRef(null);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleResultadoChange = (idx, value) => {
    const arr = [...resultados]
    arr[idx] = value
    setResultados(arr)
  }

  const handleSave = async () => {
    try {
      // await fetch...
      Swal.fire('Guardado','Inmunología guardada','success')
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
      tificoO: '',
      tificoH: '',
      paratificoA: '',
      paratificoB: '',
      brucella: '',
      hepatitis: false,
      hepatitisA: '',
      printCount: '',
      medico: ''
    });
  }

  const handleSeat = () => {
   setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      tificoO: '',
      tificoH: '',
      paratificoA: '',
      paratificoB: '',
      brucella: '',
      hepatitis: false,
      hepatitisA: '',
      printCount: '',
      medico: ''
    }));
  }

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Inmunologia?',
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
      <h2 className="text-2xl font-bold text-center">INMUNOLOGÍA</h2>

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
              fechaRef.current?.focus();
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
          onKeyUp={e => {
            if (e.key === 'Enter') {
              tificoORef.current?.focus();
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={handleFormChange}
          disabled
          dynamicWidth
        />
        <Field
          label="Edad"
          name="edad"
          value={form.edad}
          onChange={handleFormChange}
          disabled
        />
      </div>

      <Section>
        <h3 className="font-semibold text-center">MÉTODO EN LÁMINA PORTAOBJETO</h3>
      </Section>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-2 font-bold flex items-center">PRUEBAS</div>
        <div className="col-span-2 font-bold flex items-center">RESULTADOS</div>
        <div className="col-span-8"></div>

        {[
          { name: 'tificoO', label: 'TIFICO O', ref: tificoORef, nextRef: tificoHRef },
          { name: 'tificoH', label: 'TIFICO H', ref: tificoHRef, nextRef: paratificoARef },
          { name: 'paratificoA', label: 'PARATIFICO A', ref: paratificoARef, nextRef: paratificoBRef },
          { name: 'paratificoB', label: 'PARATIFICO B', ref: paratificoBRef, nextRef: brucellaRef },
          { name: 'brucella', label: 'Brucella abortus', ref: brucellaRef, nextRef: medicoRef },
        ].map(({ name, label, ref, nextRef }) => (
          <React.Fragment key={name}>
            <div className="col-span-2 flex items-center">{label}</div>
            <div className="col-span-2">
              <input
                name={name}
                className="border rounded px-2 py-1 w-full"
                value={form[name]}
                onChange={handleFormChange}
                ref={ref}
                onKeyUp={e => {
                  if (e.key === 'Enter' && nextRef) {
                    nextRef.current?.focus();
                  }
                }}
              />
            </div>
            <div className="col-span-8"></div>
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-2 items-center mt-4">
        <div className="col-span-4 flex items-center">
          <Checkbox
            label={<span className="font-bold">PRUEBA HEPATITIS</span>}
            checked={form.hepatitis}
            onChange={v => {
              setForm(f => ({ ...f, hepatitis: v, hepatitisA: '' }));
              if (v) {
                setTimeout(() => hepatitisARef.current?.focus(), 0);
              }
            }}
          />
        </div>
        <div className="col-span-4 flex items-center">
          {form.hepatitis && (
            <input
              className="border rounded px-2 py-1 ml-4 w-full"
              name="hepatitisA"
              value={form.hepatitisA}
              onChange={handleFormChange}
              placeholder="Prueba Rápida HEPATITIS A"
              disabled={!form.hepatitis}
              ref={hepatitisARef}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  medicoRef.current?.focus();
                }
              }}
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
          name="medico"
          value={form.medico}
          onChange={handleFormChange}
          ref={medicoRef}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              printRef.current?.focus();
            }
          }}
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
          <ActionButton color="green" icon={faSave} onClick={() => {SubmitInmunologiaLab(form,token,userlogued,handleClear,tabla)}}>Guardar/Actualizar</ActionButton>
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
              ref={printRef}
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
