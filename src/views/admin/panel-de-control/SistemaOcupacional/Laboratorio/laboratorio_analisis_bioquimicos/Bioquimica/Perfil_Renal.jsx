// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/PerfilRenal.jsx
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE'
import Perfil_Renal_Digitalizado from '../../../../../../jaspers/AnalisisBioquimicos/Perfil_Renal'

const today = new Date().toISOString().split('T')[0]

const testFields = [
  { label: 'CREATININA SÉRICA', name: 'creatinina' },
  { label: 'UREA SÉRICA', name: 'urea' },
  { label: 'ACIDO URICO SÉRICO', name: 'acidoUrico' },
]

export default function PerfilRenal({ apiBase, token, selectedSede }) {
  // Individual useState hooks for each form field
  const [norden, setNorden] = useState('')
  const [fecha, setFecha] = useState(today)
  const [nombres, setNombres] = useState('')
  const [edad, setEdad] = useState('')
  const [muestra, setMuestra] = useState('SUERO')
  const [creatinina, setCreatinina] = useState('')
  const [urea, setUrea] = useState('')
  const [acidoUrico, setAcidoUrico] = useState('')
  const [printCount, setPrintCount] = useState('')
  const [medico, setMedico] = useState('')

  const handleSave = async () => {
    try {
      // Placeholder para la lógica de guardado
      Swal.fire('Guardado', 'Perfil renal guardado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar', 'error')
    }
  }

  const handleClear = () => {
    setNorden('')
    setFecha(today)
    setNombres('')
    setEdad('')
    setMuestra('SUERO')
    setCreatinina('')
    setUrea('')
    setAcidoUrico('')
    setPrintCount('')
    setMedico('')
    Swal.fire('Limpiado', 'Formulario reiniciado', 'success')
  }

  const handlePrint = () => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Perfil Renal?',
      html: `<div>N° <b>${norden}</b> - <b>${nombres}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir'
    }).then(res => {
      if (res.isConfirmed) {
        Perfil_Renal_Digitalizado({
          n_orden: norden,
          paciente: nombres,
          edad: edad,
          fecha: fecha,
          txtcreatinina: creatinina,
          txtureaserica: urea,
          txtacidourico: acidoUrico
        })
        Swal.fire('Imprimiendo','','success')
      }
    })
  }

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">PERFIL RENAL</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="norden"
          value={norden}
          onChange={e => setNorden(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && VerifyTR(norden, 'perfil_renal', token, (payload) => {
            setNorden(payload.norden || '')
            setFecha(payload.fecha || today)
            setNombres(payload.nombres || '')
            setEdad(payload.edad || '')
            setMuestra(payload.muestra || 'SUERO')
            setCreatinina(payload.creatinina || '')
            setUrea(payload.urea || '')
            setAcidoUrico(payload.acidoUrico || '')
            setPrintCount(payload.printCount || '')
            setMedico(payload.medico || '')
          }, selectedSede)}
        />
        <Field label="Fecha" type="date" name="fecha" value={fecha} onChange={e => setFecha(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={nombres} disabled />
        <Field label="Edad" name="edad" value={edad} disabled />
      </div>
      
      <div>
        <label className="font-semibold mb-1 block">Muestra</label>
        <input readOnly value={muestra} className="border rounded px-2 py-1 bg-gray-100 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t mt-4">
        <div className="font-bold text-center">PRUEBAS</div>
        <div className="font-bold text-center">RESULTADOS</div>
        <label className="font-semibold text-left">CREATININA SÉRICA</label>
        <input
          name="creatinina"
          value={creatinina}
          onChange={e => setCreatinina(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <label className="font-semibold text-left">UREA SÉRICA</label>
        <input
          name="urea"
          value={urea}
          onChange={e => setUrea(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <label className="font-semibold text-left">ACIDO URICO SÉRICO</label>
        <input
          name="acidoUrico"
          value={acidoUrico}
          onChange={e => setAcidoUrico(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div className="flex items-center mt-6 mb-2">
        <label className="font-medium mr-2" htmlFor="asignarMedico">ASIGNAR MEDICO:</label>
        <select id="asignarMedico" className="border rounded px-2 py-1 min-w-[220px]" value={medico || ''} onChange={e => setMedico(e.target.value)}>
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
            <input name="printCount" value={printCount} onChange={e => setPrintCount(e.target.value)} className="border rounded px-2 py-1 w-24" placeholder="Veces" />
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
      <input type={type} name={name} value={value} disabled={disabled} onChange={onChange} onKeyUp={onKeyUp} className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`} />
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
