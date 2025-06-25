// src/views/Orina/Orina.jsx
import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint, faSave, faBroom } from '@fortawesome/free-solid-svg-icons'
import { PrintHojaR, SubmitHematologiaLabCLinico } from '../ControllerLC/ControllerLC'
import Swal from 'sweetalert2'
const physicalLabels  = ['Incoloro','Medicamentosa','Transparente','Turbio','No Aplica']
const chemicalLabels  = ['Nitritos','Proteínas','Cetonas','LeucocitosQ','AcAscorbico','Urobilinogeno','Bilirrubina','GlucosaQ','Sangre']
const sedimentLabels  = ['LeucocitosS', 'Hematies', 'CelEpiteliales', 'Cristales', 'Cilindros', 'Bacterias', 'GramSC', 'Otros']
const drugLabels      = ['Cocaina','Marihuana']
const posNegLabels    = ['ScreeningPos','ScreeningNeg','ScreeningNA','ConfirmPos','ConfirmNeg','ConfirmNA']

const initialForm = {
  // Examen Físico
  Incoloro: false,
  Medicamentosa: false,
  Transparente: false,
  Turbio: false,
  NoAplica: false,
  Color: '',
  Aspecto: 'N/A',
  Densidad: '',
  PH: '',
  // Examen Químico
  Nitritos: 'NEGATIVO',
  Proteínas: 'NEGATIVO',
  Cetonas: 'NEGATIVO',
  LeucocitosQ: 'NEGATIVO',
  AcAscorbico: 'NEGATIVO',
  Urobilinogeno: 'NEGATIVO',
  Bilirrubina: 'NEGATIVO',
  GlucosaQ: 'NEGATIVO',
  Sangre: 'NEGATIVO',
  // Sedimento
  LeucocitosS: 'ESCASAS',
  Hematies: 'NO SE OBSERVAN',
  CelEpiteliales: 'ESCASAS',
  Cristales: 'NO SE OBSERVAN',
  Cilindros: 'NO SE OBSERVAN',
  Bacterias: 'NO SE OBSERVAN',
  GramSC: 'NO SE OBSERVAN',
  Otros: 'NO SE OBSERVAN',
  // Drogas
  Cocaina: '',
  Marihuana: '',
  ScreeningPos: false,
  ScreeningNeg: false,
  ScreeningNA: false,
  ConfirmPos: false,
  ConfirmNeg: false,
  ConfirmNA: false,
  // Observaciones
  observaciones: '',
  // Imprimir
  printValue: ''
}

export default function ExamenOrina({token, selectedSede, userlogued, form, setForm, formH, ClearForm, setFormH, ClearFormO}) {

  // Refs para inputs de Examen Químico, Sedimento y Drogas
  const chemicalRefs = chemicalLabels.map(() => useRef());
  const sedimentRefs = sedimentLabels.map(() => useRef());
  const drugRefs = drugLabels.map(() => useRef());

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'LeucocitosS') {
      // Solo permitir números, guiones y espacios
      if (/^[0-9\-\s]*$/.test(value)) {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleClear = () => {
    setForm(initialForm);
    ClearForm();
    ClearFormO();
  }
  
  const handlePrint = () => {
    if (!formH.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Laboratorio Clinico?',
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${formH.norden}</b></div>`,
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
        PrintHojaR(formH.norden,token);
      }
    });
  }

  // Nueva función para manejar radios de drogas
  const handleDrugRadio = (drug, value) => {
    setForm(prev => ({
      ...prev,
      [drug]: value === 'Pos' ? 'POSITIVO' : value === 'Neg' ? 'NEGATIVO' : 'N/A',
    }));
  };

  // Nueva función para manejar el cambio de No Aplica
  const handleNoAplicaChange = (checked) => {
    setForm(prev => {
      if (checked) {
        // Marcar todo como N/A
        return {
          ...prev,
          NoAplica: true,
          Incoloro: false,
          Medicamentosa: false,
          Transparente: false,
          Turbio: false,
          Color: 'N/A',
          Aspecto: 'N/A',
          Densidad: 'N/A',
          PH: 'N/A',
          Nitritos: 'N/A',
          Proteínas: 'N/A',
          Cetonas: 'N/A',
          LeucocitosQ: 'N/A',
          AcAscorbico: 'N/A',
          Urobilinogeno: 'N/A',
          Bilirrubina: 'N/A',
          GlucosaQ: 'N/A',
          Sangre: 'N/A',
          LeucocitosS: 'N/A',
          Hematies: 'N/A',
          CelEpiteliales: 'N/A',
          Cristales: 'N/A',
          Cilindros: 'N/A',
          Bacterias: 'N/A',
          GramSC: 'N/A',
          Otros: 'N/A',
        };
      } else {
        // Restaurar valores por defecto
        return {
          ...prev,
          ...initialForm,
          NoAplica: false
        };
      }
    });
  };

  return (
    <div className="p-4 grid grid-cols-5 gap-4 text-md">
      {/* == IZQUIERDA: 3/5 == */}
      <div className="col-span-3 bg-white p-3 rounded shadow space-y-4">
        <fieldset className="border p-2 rounded">
          <legend className="px-1 font-semibold">Examen Físico</legend>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {physicalLabels.map(opt => (
              <label key={opt} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name={opt}
                  checked={form[opt]}
                  onChange={opt === 'No Aplica' ? e => handleNoAplicaChange(e.target.checked) : handleInputChange}
                  disabled={opt !== 'No Aplica'}
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Color :</label>
              <select name="Color" value={form.Color} onChange={handleInputChange} className="border rounded p-1 w-full">
                <option>N/A</option>
                <option>Amarillo</option>
                <option>Rojo</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Aspecto :</label>
              <select name="Aspecto" value={form.Aspecto} onChange={handleInputChange} className="border rounded p-1 w-full">
                <option>N/A</option>
                <option>Claro</option>
                <option>Turbio</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Densidad :</label>
              <input name="Densidad" value={form.Densidad} onChange={handleInputChange} className="border rounded p-1 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">PH :</label>
              <input name="PH" value={form.PH} onChange={handleInputChange} className="border rounded p-1 w-full" />
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-2 rounded">
          <legend className="px-1 font-semibold">Examen Químico</legend>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {chemicalLabels.map((lbl, idx, arr) => (
              <div key={lbl} className="grid grid-cols-2 items-center gap-2">
                <label className="font-medium">{lbl.replace('Q','').replace('S','')}:</label>
                <input
                  className="border rounded p-1 w-full"
                  name={lbl}
                  value={form[lbl]}
                  onChange={handleInputChange}
                  ref={chemicalRefs[idx]}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (idx < arr.length - 1) {
                        chemicalRefs[idx + 1].current && chemicalRefs[idx + 1].current.focus();
                      } else if (sedimentRefs[0]) {
                        sedimentRefs[0].current && sedimentRefs[0].current.focus();
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="border p-2 rounded">
          <legend className="px-1 font-semibold">Sedimento Unitario</legend>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {sedimentLabels.map((lbl, idx, arr) => (
              <div key={lbl} className="grid grid-cols-2 items-center gap-2">
                <label className="font-medium">{lbl.replace('Q','').replace('S','')}:</label>
                <input
                  className="border rounded p-1 w-full"
                  name={lbl}
                  value={form[lbl]}
                  onChange={handleInputChange}
                  ref={sedimentRefs[idx]}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (idx < arr.length - 1) {
                        sedimentRefs[idx + 1].current && sedimentRefs[idx + 1].current.focus();
                      } else if (drugRefs[0]) {
                        drugRefs[0].current && drugRefs[0].current.focus();
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </fieldset>
        
        <div className="grid grid-cols-2 gap-4">
          <fieldset className="border p-2 rounded">
            <legend className="px-1 font-semibold">Drogas</legend>
            <div className="space-y-2">
              {drugLabels.map((drug, idx, arr) => (
                <div key={drug} className="grid grid-cols-[auto,1fr,auto] items-center gap-x-2">
                  <label className="font-medium">{drug}:</label>
                  <input
                    className="border rounded p-1 w-full"
                    name={drug}
                    value={form[drug]}
                    onChange={handleInputChange}
                    ref={drugRefs[idx]}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (idx < arr.length - 1) {
                          drugRefs[idx + 1].current && drugRefs[idx + 1].current.focus();
                        }
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`${drug}_result`}
                        value="Pos"
                        checked={form[drug] === 'POSITIVO'}
                        onChange={() => handleDrugRadio(drug, 'Pos')}
                      /> Pos.
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`${drug}_result`}
                        value="Neg"
                        checked={form[drug] === 'NEGATIVO'}
                        onChange={() => handleDrugRadio(drug, 'Neg')}
                      /> Neg.
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`${drug}_result`}
                        value="NA"
                        checked={form[drug] === 'N/A'}
                        onChange={() => handleDrugRadio(drug, 'NA')}
                      /> N/A
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
          
          <div>
            <h3 className="font-semibold mb-1">Observaciones</h3>
            <textarea
              className="border rounded w-full h-32 p-2"
              name="observaciones"
              value={form.observaciones}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleClear}  color="yellow" icon={faBroom}>Limpiar</Button>
          <Button onClick={() => {SubmitHematologiaLabCLinico(formH,form,token,userlogued,handleClear)}}   color="green"  icon={faSave}>Grabar</Button>
        </div>
      </div>

      {/* == DERECHA: 2/5 == */}
      <div className="col-span-2 bg-white p-3 rounded shadow space-y-4">
        <fieldset className="border p-2 rounded">
          <legend className="px-1 font-semibold">Imprimir</legend>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900 italic">IMPRIMIR</span>
            <input
              name="norden"
              value={formH.norden}
              onChange={(e) => {setFormH(prev => ({...prev, norden: e.target.value}))}}
              className="border rounded px-3 py-2 w-28"
            />
            <button onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <FontAwesomeIcon icon={faPrint}/>
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  )
}

function Button({ onClick, color, icon, children }) {
  const bg = color==='green'
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-yellow-400 hover:bg-yellow-500'
  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-3 py-1 rounded inline-flex items-center gap-2 text-md`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}