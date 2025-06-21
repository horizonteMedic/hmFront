// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Gonadotropina.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { PrintHojaR, SubmitGonadotropinaLab, VerifyTR } from './controller';

const today = new Date().toISOString().split('T')[0]

export default function Gonadotropina({ token, selectedSede, userlogued }) {
  const tabla = 'lgonadotropina'
  
  // Individual useState hooks for each form field
  const [norden, setNorden] = useState('')
  const [fecha, setFecha] = useState(today)
  const [nombres, setNombres] = useState('')
  const [edad, setEdad] = useState('')
  const [resultado, setResultado] = useState('')
  const [resultadoRadio, setResultadoRadio] = useState('')
  const [medico, setMedico] = useState('')
  const [printCount, setPrintCount] = useState('')
  
  const fechaRef = useRef(null)

  useEffect(() => {
    setResultado(resultadoRadio)
  }, [resultadoRadio])

  const handleClear = () => {
    setNorden('')
    setFecha(today)
    setNombres('')
    setEdad('')
    setResultado('')
    setResultadoRadio('')
    setMedico('')
    setPrintCount('')
    Swal.fire('Limpiado', 'Formulario reiniciado', 'success')
  }

  const handleSave = () => {
    const formData = {
      norden,
      fecha,
      nombres,
      edad,
      resultado,
      resultadoRadio,
      medico,
      printCount
    }
    SubmitGonadotropinaLab(formData, token, userlogued, handleClear)
  }

  const handlePrint = () => {
    if (!norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir?',
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${norden}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir',
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(norden, token);
        Swal.fire('Imprimiendo', '', 'success')
      }
    });
  }

  const handleVerifyTR = (nordenValue) => {
    VerifyTR(nordenValue, tabla, token, (payload) => {
      setNorden(payload.norden || '')
      setFecha(payload.fecha || today)
      setNombres(payload.nombres || '')
      setEdad(payload.edad || '')
      setResultado(payload.resultado || '')
      setResultadoRadio(payload.resultadoRadio || '')
      setMedico(payload.medico || '')
      setPrintCount(payload.printCount || '')
    }, selectedSede)
  }

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">GONADOTROPINA CORIÓNICA HUMANA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Nro Ficha"
          name="norden"
          value={norden}
          onChange={e => setNorden(e.target.value)}
          onKeyUp={event => { if (event.key === 'Enter') handleVerifyTR(norden) }}
        />
        <Field
          label="Fecha"
          name="fecha"
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          inputRef={fechaRef}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombres" name="nombres" value={nombres} disabled={true} dynamicWidth />
        <Field label="Edad" name="edad" value={edad} disabled={true} />
      </div>

      <div className="grid grid-cols-12 gap-2 items-center mt-4">
        <div className="col-span-4 font-bold flex items-center">PRUEBAS</div>
        <div className="col-span-2 font-bold flex items-center">RESULTADOS</div>
        <div className="col-span-6"></div>

        <div className="col-span-4 flex items-center">GONADOTROPINA CORIÓNICA HUMANA</div>
        <div className="col-span-2">
          <input
            className="border rounded px-2 py-1 w-full bg-gray-100"
            name="resultado"
            value={resultado}
            disabled
          />
        </div>
        <div className="col-span-6 flex gap-4">
          {["NEGATIVO", "POSITIVO"].map(opt => (
            <label key={opt} className="flex items-center gap-1">
              <input
                type="radio"
                name="resultadoRadio"
                checked={resultadoRadio === opt}
                onChange={() => setResultadoRadio(opt)}
              />
              <span className="font-bold">{opt}</span>
            </label>
          ))}
        </div>
      </div>

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

// Reusable components
function Field({ label, name, type = 'text', value, onChange, disabled, onKeyUp, inputRef, dynamicWidth }) {
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
        className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''} ${dynamicWidth ? 'min-w-0 truncate overflow-x-auto' : ''}`}
        style={dynamicWidth ? { width: '100%' } : {}}
      />
    </div>
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
      <FontAwesomeIcon icon={icon} /> {children}
    </button>
  )
}