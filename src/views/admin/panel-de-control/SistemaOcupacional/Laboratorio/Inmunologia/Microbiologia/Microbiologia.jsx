// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Microbiologia.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE'
import Microbiologia_Digitalizado from '../../../../../../jaspers/Inmunologia/Microbiologia_Digitalizado'

const today = new Date().toISOString().split('T')[0]

export default function Microbiologia({ apiBase, token, selectedSede }) {
  // Individual useState hooks for each form field
  const [norden, setNorden] = useState('')
  const [fecha, setFecha] = useState(today)
  const [nombres, setNombres] = useState('')
  const [edad, setEdad] = useState('')
  const [examenDirecto, setExamenDirecto] = useState(false)
  const [bk1, setBk1] = useState('')
  const [bk1Radio, setBk1Radio] = useState('')
  const [bk2, setBk2] = useState('')
  const [bk2Radio, setBk2Radio] = useState('')
  const [koh, setKoh] = useState('')
  const [kohRadio, setKohRadio] = useState('')
  const [printCount, setPrintCount] = useState('')
  const [medico, setMedico] = useState('')
  
  const fechaRef = useRef(null)

  useEffect(() => {
    if (examenDirecto) {
      // Limpiar BK 1ª y BK 2ª
      setBk1('');
      setBk1Radio('');
      setBk2('');
      setBk2Radio('');
    } else {
      // Limpiar KOH
      setKoh('');
      setKohRadio('');
    }
  }, [examenDirecto]);

  const handleSave = async () => {
    try {
      // await fetch...
      Swal.fire('Guardado','Microbiología guardada','success')
    } catch {
      Swal.fire('Error','No se pudo guardar','error')
    }
  }

  const handleClear = () => {
    setNorden('')
    setFecha(today)
    setNombres('')
    setEdad('')
    setExamenDirecto(false)
    setBk1('')
    setBk1Radio('')
    setBk2('')
    setBk2Radio('')
    setKoh('')
    setKohRadio('')
    setPrintCount('')
    setMedico('')
    Swal.fire('Limpiado','Formulario reiniciado','success')
  }

  const handlePrint = () => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Microbiología?',
      html: `<div>N° <b>${norden}</b> - <b>${nombres}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir'
    }).then(res => {
      if (res.isConfirmed) {
        Microbiologia_Digitalizado({
          norden: norden,
          nombres: nombres,
          edad: edad,
          fecha: fecha,
          bk1: bk1,
          bk2: bk2,
          koh: koh
        })
        Swal.fire('Imprimiendo','','success')
      }
    })
  }

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">MICROBIOLOGÍA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="norden"
          value={norden}
          onChange={e => setNorden(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && VerifyTR(norden, 'microbiologia', token, (payload) => {
            setNorden(payload.norden || '')
            setFecha(payload.fecha || today)
            setNombres(payload.nombres || '')
            setEdad(payload.edad || '')
            setExamenDirecto(payload.examenDirecto || false)
            setBk1(payload.bk1 || '')
            setBk1Radio(payload.bk1Radio || '')
            setBk2(payload.bk2 || '')
            setBk2Radio(payload.bk2Radio || '')
            setKoh(payload.koh || '')
            setKohRadio(payload.kohRadio || '')
            setPrintCount(payload.printCount || '')
            setMedico(payload.medico || '')
          }, selectedSede)}
        />
        <Field label="Fecha" name="fecha" type="date" value={fecha} onChange={e=>setFecha(e.target.value)} inputRef={fechaRef} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={nombres} onChange={e=>setNombres(e.target.value)} disabled />
        <Field label="Edad" name="edad" value={edad} onChange={e=>setEdad(e.target.value)} disabled />
      </div>
      <Checkbox label="Examen Directo" checked={examenDirecto} onChange={v=>setExamenDirecto(v)} />
      <div className="text-center font-semibold">MUESTRA: ESPUTO</div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-4 font-bold flex items-center">PRUEBA</div>
        <div className="col-span-2 font-bold flex items-center">RESULTADO</div>
        <div className="col-span-6"></div>

        {/* Examen de BK - BACILOSCOPIA 1ª */}
        <div className="col-span-4 flex items-center">Examen de BK - BACILOSCOPIA 1ª<span className="ml-1">:</span></div>
        <div className="col-span-2">
          <input
            className="border rounded px-2 py-1 w-full"
            name="bk1"
            value={bk1}
            onChange={e=>setBk1(e.target.value)}
            disabled={examenDirecto}
          />
        </div>
        <div className="col-span-6 flex gap-4">
          {["BAAR - NEGATIVO","BAAR - POSITIVO","N/A"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="bk1Radio"
                checked={bk1Radio===opt}
                disabled={examenDirecto}
                onChange={e => {
                  if (e.target.checked) {
                    setBk1Radio(opt);
                    setBk1(opt);
                  } else {
                    setBk1Radio('');
                    setBk1('');
                  }
                }}
              />
              {opt}
            </label>
          ))}
        </div>

        {/* Examen de BK - BACILOSCOPIA 2ª */}
        <div className="col-span-4 flex items-center">Examen de BK - BACILOSCOPIA 2ª<span className="ml-1">:</span></div>
        <div className="col-span-2">
          <input
            className="border rounded px-2 py-1 w-full"
            name="bk2"
            value={bk2}
            onChange={e=>setBk2(e.target.value)}
            disabled={examenDirecto}
          />
        </div>
        <div className="col-span-6 flex gap-4">
          {["BAAR - NEGATIVO","BAAR - POSITIVO","N/A"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="bk2Radio"
                checked={bk2Radio===opt}
                disabled={examenDirecto}
                onChange={e => {
                  if (e.target.checked) {
                    setBk2Radio(opt);
                    setBk2(opt);
                  } else {
                    setBk2Radio('');
                    setBk2('');
                  }
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
            value={koh}
            onChange={e=>setKoh(e.target.value)}
            disabled={!examenDirecto}
          />
        </div>
        <div className="col-span-6 flex gap-4">
          {["BAAR - NEGATIVO","BAAR - POSITIVO","N/A"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="kohRadio"
                checked={kohRadio===opt}
                disabled={!examenDirecto}
                onChange={e => {
                  if (e.target.checked) {
                    setKohRadio(opt);
                    setKoh(opt);
                  } else {
                    setKohRadio('');
                    setKoh('');
                  }
                }}
              />
              {opt}
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
          value={medico || ''}
          onChange={e => setMedico(e.target.value)}
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
              value={printCount}
              onChange={e=>setPrintCount(e.target.value)}
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
