// src/views/Orina/Orina.jsx
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint, faSave, faBroom } from '@fortawesome/free-solid-svg-icons'

const physicalLabels  = ['Incoloro','Medicamentosa','Transparente','Turbio','No Aplica']
const chemicalLabels  = ['Nitritos','Proteínas','Cetonas','LeucocitosQ','AcAscorbico','Urobilinogeno','Bilirrubina','GlucosaQ','Sangre']
const sedimentLabels  = ['LeucocitosS','Hematies','CelEpiteliales','Cristales','Cilindros','Bacterias','GramSC','Otros']
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
  LeucocitosS: '',
  Hematies: '',
  CelEpiteliales: '',
  Cristales: '',
  Cilindros: '',
  Bacterias: '',
  GramSC: '',
  Otros: '',
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
  printOrden: false,
  printRecibo: false,
  printValue: ''
}

export default function ExamenOrina() {
  const [form, setForm] = useState(initialForm)

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setField(name, type === 'checkbox' ? checked : value)
  }

  const handleClear = () => setForm(initialForm)
  const handleSave = () => {
    // await fetch('/api/orina',{method:'POST',body:JSON.stringify(form)})
    console.log('Guardando', form)
  }
  const handlePrint = () => {
    window.open(
      `/api/orina/print/${form.printValue}?orden=${form.printOrden}&recibo=${form.printRecibo}`,
      '_blank'
    )
  }

  return (
    <div className="p-4 grid grid-cols-5 gap-4">
      {/* == IZQUIERDA: 3/5 == */}
      <div className="col-span-3 bg-white p-3 rounded shadow space-y-4">
        <Section title="Examen Físico">
          <div className="grid grid-cols-3 gap-2">
            {physicalLabels.map(opt => (
              <label key={opt} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name={opt}
                  checked={form[opt]}
                  onChange={handleInputChange}
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['Color','Aspecto','Densidad','PH'].map(f=>(
              <div key={f} className="flex flex-col">
                <span className="font-medium text-sm">{f}</span>
                {f==='Aspecto'
                  ? <select
                      className="border rounded p-1"
                      name={f}
                      value={form[f]}
                      onChange={handleInputChange}
                    >
                      <option>N/A</option><option>Claro</option><option>Turbio</option>
                    </select>
                  : <input
                      className="border rounded p-1"
                      name={f}
                      value={form[f]}
                      onChange={handleInputChange}
                    />
                }
              </div>
            ))}
          </div>
        </Section>

        <Section title="Examen Químico">
          <div className="grid grid-cols-2 gap-2">
            {chemicalLabels.map(lbl=>(
              <div key={lbl} className="flex items-center gap-2">
                <span className="w-28 font-medium text-sm">{lbl.replace('Q','')}:</span>
                <input
                  className="border rounded p-1 w-full"
                  name={lbl}
                  value={form[lbl]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Sedimento Unitario">
          <div className="grid grid-cols-2 gap-2">
            {sedimentLabels.map(lbl=>(
              <div key={lbl} className="flex items-center gap-2">
                <span className="w-32 font-medium text-sm">{lbl.replace('S','')}:</span>
                <input
                  className="border rounded p-1 w-full"
                  name={lbl}
                  value={form[lbl]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Drogas">
          <div className="space-y-2">
            {drugLabels.map(drug=>(
              <div key={drug} className="flex items-center gap-2">
                <span className="w-32 font-medium text-sm">{drug}:</span>
                <input
                  className="border rounded p-1 w-full"
                  name={drug}
                  value={form[drug]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['ScreeningPos','ScreeningNeg','ScreeningNA'].map(lbl=>(
              <label key={lbl} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name={lbl}
                  checked={form[lbl]}
                  onChange={handleInputChange}
                />
                {lbl.replace('Screening','')}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['ConfirmPos','ConfirmNeg','ConfirmNA'].map(lbl=>(
              <label key={lbl} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name={lbl}
                  checked={form[lbl]}
                  onChange={handleInputChange}
                />
                {lbl.replace('Confirm','')}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Observaciones">
          <textarea
            className="border rounded w-full h-24 p-2"
            name="observaciones"
            value={form.observaciones}
            onChange={handleInputChange}
          />
        </Section>

        <div className="flex gap-2">
          <Button onClick={handleClear}  color="yellow" icon={faBroom}>Limpiar</Button>
          <Button onClick={handleSave}   color="green"  icon={faSave}>Grabar</Button>
        </div>
      </div>

      {/* == DERECHA: 2/5 == */}
      <div className="col-span-2 bg-white p-3 rounded shadow space-y-4 text-sm">
        <h3 className="text-blue-700 font-medium">Imprimir</h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="printOrden"
            checked={form.printOrden}
            onChange={handleInputChange}
          />
          <label>Nro Orden</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="printRecibo"
            checked={form.printRecibo}
            onChange={handleInputChange}
          />
          <label>Nro Recibo</label>
        </div>
        <input
          name="printValue"
          value={form.printValue}
          onChange={handleInputChange}
          placeholder="Código..."
          className="border rounded p-1 w-full"
        />
        <button onClick={handlePrint} className="ml-auto">
          <FontAwesomeIcon icon={faPrint} className="text-2xl text-blue-700" />
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-1">
      <h3 className="text-blue-700 font-semibold">{title}</h3>
      {children}
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
      className={`${bg} text-white px-3 py-1 rounded inline-flex items-center gap-2 text-sm`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
