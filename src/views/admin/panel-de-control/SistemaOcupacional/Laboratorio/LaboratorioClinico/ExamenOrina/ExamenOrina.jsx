// src/views/Orina/Orina.jsx
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint, faSave, faBroom } from '@fortawesome/free-solid-svg-icons'

const physicalLabels  = ['Incoloro','Medicamentosa','Transparente','Turbio','No Aplica']
const chemicalLabels  = ['Nitritos','Proteínas','Cetonas','Leucocitos','Ac. Ascórbico','Urobilinógeno','Bilirrubina','Glucosa','Sangre']
const sedimentLabels  = ['Leucocitos','Hematíes','Cel. Epiteliales','Cristales','Cilindros','Bacterias','GRAM S/C','Otros']
const drugLabels      = ['Cocaína','Marihuana']
const posNegLabels    = ['Pos.','Neg.','N/A']

const makeMap = (keys, init) =>
  keys.reduce((o,k) => ({ ...o, [k]: typeof init==='function'? init(k) : init }), {})

const initialForm = {
  physicalOptions: makeMap(physicalLabels, false),
  physicalDetails: { Color:'', Aspecto:'N/A', Densidad:'', PH:'' },
  chemical:       makeMap(chemicalLabels,   'NEGATIVO'),
  sediment:       makeMap(sedimentLabels,   ''),
  drugValues:     makeMap(drugLabels,       ''),
  screeningFlags: makeMap(posNegLabels,     false),
  confirmFlags:   makeMap(posNegLabels,     false),
  observaciones:  '',
  print:          { orden:false, recibo:false, value:'' },
}

export default function ExamenOrina() {
  const [form, setForm] = useState(initialForm)

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const setNestedField = (section, key, value) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('print.')) {
      const k = name.split('.')[1]
      setForm(prev => ({
        ...prev,
        print: {
          ...prev.print,
          [k]: type === 'checkbox' ? checked : value
        }
      }))
    } else if (Object.prototype.hasOwnProperty.call(initialForm, name)) {
      setField(name, type === 'checkbox' ? checked : value)
    }
  }

  const handleClear = () => setForm(initialForm)
  const handleSave = () => {
    // await fetch('/api/orina',{method:'POST',body:JSON.stringify(form)})
    console.log('Guardando', form)
  }
  const handlePrint = () => {
    window.open(
      `/api/orina/print/${form.print.value}?orden=${form.print.orden}&recibo=${form.print.recibo}`,
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
                  checked={form.physicalOptions[opt]}
                  onChange={e=>setNestedField('physicalOptions',opt,e.target.checked)}
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
                      value={form.physicalDetails[f]}
                      onChange={e=>setNestedField('physicalDetails',f,e.target.value)}
                    >
                      <option>N/A</option><option>Claro</option><option>Turbio</option>
                    </select>
                  : <input
                      className="border rounded p-1"
                      value={form.physicalDetails[f]}
                      onChange={e=>setNestedField('physicalDetails',f,e.target.value)}
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
                <span className="w-28 font-medium text-sm">{lbl}:</span>
                <input
                  className="border rounded p-1 w-full"
                  value={form.chemical[lbl]}
                  onChange={e=>setNestedField('chemical',lbl,e.target.value)}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Sedimento Unitario">
          <div className="grid grid-cols-2 gap-2">
            {sedimentLabels.map(lbl=>(
              <div key={lbl} className="flex items-center gap-2">
                <span className="w-32 font-medium text-sm">{lbl}:</span>
                <input
                  className="border rounded p-1 w-full"
                  value={form.sediment[lbl]}
                  onChange={e=>setNestedField('sediment',lbl,e.target.value)}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Drogas">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {posNegLabels.map(lbl=>(
              <label key={lbl} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.screeningFlags[lbl]}
                  onChange={e=>setNestedField('screeningFlags',lbl,e.target.checked)}
                />
                {lbl}
              </label>
            ))}
          </div>
          <div className="space-y-2">
            {drugLabels.map(drug=>(
              <div key={drug} className="flex items-center gap-2">
                <span className="w-32 font-medium text-sm">{drug}:</span>
                <input
                  className="border rounded p-1 w-full"
                  value={form.drugValues[drug]}
                  onChange={e=>setNestedField('drugValues',drug,e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {posNegLabels.map(lbl=>(
              <label key={lbl} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.confirmFlags[lbl]}
                  onChange={e=>setNestedField('confirmFlags',lbl,e.target.checked)}
                />
                {lbl}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Observaciones">
          <textarea
            className="border rounded w-full h-24 p-2"
            value={form.observaciones}
            onChange={e=>setField('observaciones', e.target.value)}
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
            name="print.orden"
            checked={form.print.orden}
            onChange={handleInputChange}
          />
          <label>Nro Orden</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="print.recibo"
            checked={form.print.recibo}
            onChange={handleInputChange}
          />
          <label>Nro Recibo</label>
        </div>
        <input
          name="print.value"
          value={form.print.value}
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