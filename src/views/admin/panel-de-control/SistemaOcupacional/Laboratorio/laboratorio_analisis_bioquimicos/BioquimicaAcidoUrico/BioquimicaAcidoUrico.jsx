// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/BioquimicaAcidoUrico.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import Acido_Urico_Digitalizado from '../../../../../../jaspers/AnalisisBioquimicos/Acido_Urico.jsx'
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE'

const today = new Date().toISOString().split('T')[0]

export default function BioquimicaAcidoUrico({ token, selectedSede }) {
  // Individual useState hooks for each form field
  const [norden, setNorden] = useState('')
  const [fecha, setFecha] = useState(today)
  const [nombres, setNombres] = useState('')
  const [edad, setEdad] = useState('')
  const [prueba, setPrueba] = useState('ÁCIDO ÚRICO SÉRICO')
  const [muestra, setMuestra] = useState('SUERO')
  const [resultado, setResultado] = useState('')
  const [printCount, setPrintCount] = useState('')
  const [medico, setMedico] = useState('')
  const [sede, setSede] = useState(selectedSede)

  const handleSave = () => {
    Swal.fire('Guardado', 'Datos de Ácido Úrico guardados', 'success')
  }

  const handleClear = () => {
    setNorden('')
    setFecha(today)
    setNombres('')
    setEdad('')
    setPrueba('ÁCIDO ÚRICO SÉRICO')
    setMuestra('SUERO')
    setResultado('')
    setPrintCount('')
    setMedico('')
    Swal.fire('Limpiado', 'Formulario reiniciado', 'success')
  }

  const handlePrint = () => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Bioquímica?',
      html: `<div>N° <b>${norden}</b> - <b>${nombres}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir'
    }).then(result => {
      if (result.isConfirmed) {
        Acido_Urico_Digitalizado({ 
          norden, 
          fecha, 
          nombres, 
          edad, 
          prueba, 
          muestra, 
          resultado, 
          printCount, 
          medico, 
          sede 
        })
        Swal.fire('Imprimiendo', '', 'success')
      }
    })
  }

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">ÁCIDO ÚRICO</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="norden"
          value={norden}
          onChange={e => setNorden(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && VerifyTR(norden, 'ac_bioquimica2022', token, (payload) => {
            setNorden(payload.norden || '')
            setFecha(payload.fecha || today)
            setNombres(payload.nombres || '')
            setEdad(payload.edad || '')
            setPrueba(payload.prueba || 'ÁCIDO ÚRICO SÉRICO')
            setMuestra(payload.muestra || 'SUERO')
            setResultado(payload.resultado || '')
            setPrintCount(payload.printCount || '')
            setMedico(payload.medico || '')
            setSede(payload.sede || selectedSede)
          }, selectedSede)}
        />
        <Field label="Fecha" name="fecha" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={nombres} disabled />
        <Field label="Edad" name="edad" value={edad} disabled />
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-center pt-4 border-t mt-4">
        <FieldRow label="PRUEBA:">
          <input className="border rounded px-2 py-1 bg-gray-100 w-full" value={prueba} readOnly />
        </FieldRow>
        <FieldRow label="MUESTRA:">
          <input className="border rounded px-2 py-1 bg-gray-100 w-full" value={muestra} readOnly />
        </FieldRow>
        <FieldRow label="RESULTADO:">
          <input
            className="border rounded px-2 py-1 w-full"
            value={resultado}
            onChange={e => setResultado(e.target.value)}
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
          value={medico}
          onChange={e => setMedico(e.target.value)}
        >
          <option value="">Seleccionar medico</option>
          <option value="medico1">Dr. Juan Pérez</option>
          <option value="medico2">Dra. Ana Torres</option>
          <option value="medico3">Dr. Luis Gómez</option>
        </select>
      </div>

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
              onChange={e => setPrintCount(e.target.value)}
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
