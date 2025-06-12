import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint, faSave, faBroom } from '@fortawesome/free-solid-svg-icons'

const physicalLabels = [
  'Incoloro',
  'Medicamentosa',
  'Transparente',
  'Turbio',
  'No Aplica'
]
const chemicalLabels = [
  'Nitritos',
  'Proteínas',
  'Cetonas',
  'Leucocitos',
  'Ac. Ascórbico',
  'Urobilinógeno',
  'Bilirrubina',
  'Glucosa',
  'Sangre'
]
const sedimentLabels = [
  'Leucocitos',
  'Hematíes',
  'Cel. Epiteliales',
  'Cristales',
  'Cilindros',
  'Bacterias',
  'GRAM S/C',
  'Otros'
]
const drugLabels = ['Cocaína', 'Marihuana']
const posNegLabels = ['Pos.', 'Neg.', 'N/A']

export default function Orina() {
  const [form, setForm] = useState({
    physicalOptions: physicalLabels.reduce((o, l) => ({ ...o, [l]: false }), {}),
    physicalDetails: { Color: '', Aspecto: 'N/A', Densidad: '', PH: '' },
    chemical: chemicalLabels.reduce((o, l) => ({ ...o, [l]: 'NEGATIVO' }), {}),
    sediment: sedimentLabels.reduce((o, l) => ({ ...o, [l]: '' }), {}),
    drugValues: drugLabels.reduce((o, l) => ({ ...o, [l]: '' }), {}),
    screeningFlags: posNegLabels.reduce((o, l) => ({ ...o, [l]: false }), {}),
    confirmFlags: posNegLabels.reduce((o, l) => ({ ...o, [l]: false }), {}),
    observaciones: '',
    print: { orden: false, recibo: false, value: '' }
  })

  // fetch initial data when print.value changes
  useEffect(() => {
    async function fetchData() {
      // const res = await fetch(`/api/orina/${form.print.value}`)
      // const data = await res.json()
      // setForm(prev => ({ ...prev, ...data }))
    }
    if (form.print.value) fetchData()
  }, [form.print.value])

  const handleNested = (section, key, val) => {
    setForm(f => ({
      ...f,
      [section]: { ...f[section], [key]: val }
    }))
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('print.')) {
      const k = name.split('.')[1]
      setForm(f => ({
        ...f,
        print: { ...f.print, [k]: type === 'checkbox' ? checked : value }
      }))
    } else {
      setForm(f => ({
        ...f,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSave = async () => {
    // await fetch('/api/orina', { method: 'POST', body: JSON.stringify(form) })
    console.log('Guardar', form)
  }
  const handleClear = () => {
    setForm({
      physicalOptions: physicalLabels.reduce((o, l) => ({ ...o, [l]: false }), {}),
      physicalDetails: { Color: '', Aspecto: 'N/A', Densidad: '', PH: '' },
      chemical: chemicalLabels.reduce((o, l) => ({ ...o, [l]: 'NEGATIVO' }), {}),
      sediment: sedimentLabels.reduce((o, l) => ({ ...o, [l]: '' }), {}),
      drugValues: drugLabels.reduce((o, l) => ({ ...o, [l]: '' }), {}),
      screeningFlags: posNegLabels.reduce((o, l) => ({ ...o, [l]: false }), {}),
      confirmFlags: posNegLabels.reduce((o, l) => ({ ...o, [l]: false }), {}),
      observaciones: '',
      print: { orden: false, recibo: false, value: '' }
    })
  }
  const handlePrint = () => console.log('Imprimir', form.print)

  return (
    <div className="flex flex-col gap-2 w-full text-md">
      <div className="flex gap-4">
        {/* IZQUIERDA 60% */}
        <div className="bg-white rounded shadow p-4 w-3/5 flex flex-col space-y-6">
          {/* Examen Físico */}
          <div>
            <h3 className="text-lg text-blue-700 font-bold mb-2">
              Examen Físico
            </h3>
            <div className="flex flex-wrap gap-4 mb-3">
              {physicalLabels.map(opt => (
                <label
                  key={opt}
                  className="font-medium flex items-center gap-1"
                >
                  <input
                    type="checkbox"
                    checked={form.physicalOptions[opt]}
                    onChange={e =>
                      handleNested('physicalOptions', opt, e.target.checked)
                    }
                  />{' '}
                  {opt}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              {['Color', 'Aspecto', 'Densidad', 'PH'].map(field => (
                <label
                  key={field}
                  className="font-medium flex items-center gap-1"
                >
                  {field}:
                  {field === 'Aspecto' ? (
                    <select
                      className="border rounded px-2 py-1 ml-1"
                      value={form.physicalDetails[field]}
                      onChange={e =>
                        handleNested('physicalDetails', field, e.target.value)
                      }
                    >
                      <option>N/A</option>
                      <option>Claro</option>
                      <option>Turbio</option>
                    </select>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 w-24 ml-1"
                      value={form.physicalDetails[field]}
                      onChange={e =>
                        handleNested('physicalDetails', field, e.target.value)
                      }
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Examen Químico */}
          <div>
            <h3 className="text-lg text-blue-700 font-bold mb-2">
              Examen Químico
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {chemicalLabels.map(label => (
                <div key={label} className="flex items-center gap-2">
                  <label className="min-w-[120px] font-medium">{label}:</label>
                  <input
                    className="border rounded px-2 py-1 w-28"
                    value={form.chemical[label]}
                    onChange={e =>
                      handleNested('chemical', label, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sedimento Unitario */}
          <div>
            <h3 className="text-lg text-blue-700 font-bold mb-2">
              Sedimento Unitario
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {sedimentLabels.map(label => (
                <div key={label} className="flex items-center gap-2">
                  <label className="min-w-[140px] font-medium">{label}:</label>
                  <input
                    className="border rounded px-2 py-1 w-28"
                    value={form.sediment[label]}
                    onChange={e =>
                      handleNested('sediment', label, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Drogas */}
          <div>
            <h3 className="text-lg text-blue-700 font-bold mb-2">Drogas</h3>
            <div className="flex items-center gap-4 mb-3">
              {posNegLabels.map(label => (
                <label key={label} className="flex items-center gap-1 font-medium">
                  <input
                    type="checkbox"
                    checked={form.screeningFlags[label]}
                    onChange={e =>
                      handleNested('screeningFlags', label, e.target.checked)
                    }
                  />{' '}
                  {label}
                </label>
              ))}
            </div>
            {drugLabels.map(drug => (
              <div key={drug} className="flex items-center gap-2 mb-2">
                <label className="min-w-[100px] font-medium">{drug}:</label>
                <input
                  className="border rounded px-2 py-1 w-32"
                  value={form.drugValues[drug]}
                  onChange={e =>
                    handleNested('drugValues', drug, e.target.value)
                  }
                />
              </div>
            ))}
            <div className="flex items-center gap-4">
              {posNegLabels.map(label => (
                <label key={label} className="flex items-center gap-1 font-medium">
                  <input
                    type="checkbox"
                    checked={form.confirmFlags[label]}
                    onChange={e =>
                      handleNested('confirmFlags', label, e.target.checked)
                    }
                  />{' '}
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <h3 className="text-lg text-blue-700 font-bold mb-2">
              Observaciones
            </h3>
            <textarea
              className="border rounded w-full h-24 p-2 resize-none"
              value={form.observaciones}
              onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Grabar
            </button>
          </div>
        </div>

        {/* DERECHA 40% */}
        <div className="bg-white rounded shadow p-4 w-2/5 flex flex-col">
          <div className="font-medium text-md text-blue-700 mb-4">Imprimir</div>
          <label className="font-medium flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              name="print.orden"
              checked={form.print.orden}
              onChange={handleChange}
              className="mr-1"
            />{' '}
            Nro Orden
          </label>
          <label className="font-medium flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              name="print.recibo"
              checked={form.print.recibo}
              onChange={handleChange}
              className="mr-1"
            />{' '}
            Nro Recibo
          </label>
          <input
            type="text"
            name="print.value"
            value={form.print.value}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full mb-4"
          />
          <button
            onClick={handlePrint}
            className="self-end bg-transparent border-none p-0"
          >
            <FontAwesomeIcon icon={faPrint} className="text-2xl text-blue-700" />
          </button>
        </div>
      </div>
    </div>
  )
}
  