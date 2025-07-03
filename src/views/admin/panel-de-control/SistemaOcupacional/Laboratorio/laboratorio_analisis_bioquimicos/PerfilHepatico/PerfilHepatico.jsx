// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/PerfilHepatico.jsx
import React, { useReducer, useCallback, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { PrintHojaR, SubmitPerfilHepaticoLab, VerifyTR } from './controllerPerfilH';

const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const testFields = [
  { label: 'FOSFATASA ALCALINA', name: 'fosfAlc' },
  { label: 'GGT', name: 'ggt' },
  { label: 'TGP', name: 'tgp' },
  { label: 'TGO', name: 'tgo' },
  { label: 'BILIRRUBINA TOTAL', name: 'biliTotal' },
  { label: 'BILIRRUBINA DIRECTA', name: 'biliDir' },
  { label: 'BILIRRUBINA INDIRECTA', name: 'biliInd' },
  { label: 'PROTEINAS TOTALES', name: 'protTot' },
  { label: 'ALBUMINA', name: 'albumina' },
  { label: 'GLOBULINA SERICA', name: 'globSer' },
]

export default function PerfilHepatico({ token, selectedSede, userlogued }) {
    const tabla = 'perfil_hepatico'

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    tgo: '',
    tgp: '',
    ggt: '',
    fosfAlc: '',
    biliTotal: '',
    biliInd: '',
    biliDir: '',
    protTot: '',
    albumina: '',
    globSer: '',
    printCount: '',
    medico: ''
  })
  
  // Refs para inputs de pruebas
  const testRefs = useRef(testFields.map(() => React.createRef()));
  
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      // Cálculo automático de Bilirrubina Indirecta
      if (name === 'biliTotal' || name === 'biliDir') {
        const total = parseFloat(name === 'biliTotal' ? value : updated.biliTotal);
        const dir = parseFloat(name === 'biliDir' ? value : updated.biliDir);
        if (!isNaN(total) && !isNaN(dir)) {
          updated.biliInd = (total - dir).toFixed(2);
        }
      }
      // Cálculo automático de Proteínas Totales
      if (name === 'albumina' || name === 'globSer') {
        const alb = parseFloat(name === 'albumina' ? value : updated.albumina);
        const glob = parseFloat(name === 'globSer' ? value : updated.globSer);
        if (!isNaN(alb) && !isNaN(glob)) {
          updated.protTot = (alb - glob).toFixed(2);
        }
      }
      return updated;
    });
  };

  const handleSave = useCallback(async () => {
    try {
      // POST placeholder
      // await fetch(`${apiBase}/hepatico`, {...})
      Swal.fire('Guardado', 'Perfil hepático guardado', 'success')
    } catch {
      Swal.fire('Error', 'No se pudo guardar', 'error')
    }
  }, [form])

  const handleClear = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      tgo: '',
      tgp: '',
      ggt: '',
      fosfAlc: '',
      biliTotal: '',
      biliInd: '',
      biliDir: '',
      protTot: '',
      albumina: '',
      globSer: '',
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
      tgo: '',
      tgp: '',
      ggt: '',
      fosfAlc: '',
      biliTotal: '',
      biliInd: '',
      biliDir: '',
      protTot: '',
      albumina: '',
      globSer: '',
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

  return (
    <div className="max-w-6xl w-[950px] mx-auto bg-white rounded shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">PERFIL HEPÁTICO</h2>

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
        <Field
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={handleFormChange}
          disabled
        />
        <Field
          label="Edad"
          name="edad"
          value={form.edad}
          onChange={handleFormChange}
          disabled
        />
      </div>

      <div className="grid grid-cols-5 gap-x-6 gap-y-3 items-center">
        <div className="col-span-2 font-bold text-center mb-2">PRUEBAS</div>
        <div className="col-span-3 font-bold text-center mb-2">RESULTADOS</div>

        {testFields.map(({ label, name }, idx, arr) => (
          <React.Fragment key={name}>
            <label className="col-span-2 font-semibold text-right">{label}</label>
            <div className="col-span-3">
              <input
                name={name}
                value={form[name]}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 w-full"
                ref={testRefs.current[idx]}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (idx < arr.length - 1) {
                      testRefs.current[idx + 1].current && testRefs.current[idx + 1].current.focus();
                    }
                  }
                }}
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center mt-6 mb-2">
        <label className="font-medium mr-2" htmlFor="asignarMedico">
          ASIGNAR MEDICO:
        </label>
        <select
          id="asignarMedico"
          name="medico"
          className="border rounded px-2 py-1 min-w-[220px]"
          value={form.medico || ''}
          onChange={handleFormChange}
          disabled
        >
          <option value="">Seleccionar medico</option>
          <option value="medico1">Dr. Juan Pérez</option>
          <option value="medico2">Dra. Ana Torres</option>
          <option value="medico3">Dr. Luis Gómez</option>
        </select>
      </div>

      <div className="flex justify-between items-end mt-6">
        <div className="flex gap-4">
          <ActionButton color="green" icon={faSave} onClick={() => {SubmitPerfilHepaticoLab(form,token,userlogued,handleClear,tabla)}}>
            Guardar/Actualizar
          </ActionButton>
          <ActionButton color="yellow" icon={faBroom} onClick={handleClear}>
            Limpiar
          </ActionButton>
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

function Field({ label, name, type='text', value, onChange, disabled, onKeyUp }) {
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
