// src/views/Orina/Orina.jsx
import React, { useReducer, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint, faSave, faBroom } from '@fortawesome/free-solid-svg-icons'

const physicalLabels  = ['Incoloro','Medicamentosa','Transparente','Turbio','No Aplica']
const chemicalLabels  = ['Nitritos','Proteínas','Cetonas','Leucocitos','Ac. Ascórbico','Urobilinógeno','Bilirrubina','Glucosa','Sangre']
const sedimentLabels  = ['Leucocitos','Hematíes','Cel. Epiteliales','Cristales','Cilindros','Bacterias','GRAM S/C','Otros']
const drugLabels      = ['Cocaína','Marihuana']
const posNegLabels    = ['Pos.','Neg.','N/A']

const makeMap = (keys, init) =>
  keys.reduce((o,k) => ({ ...o, [k]: typeof init==='function'? init(k) : init }), {})

const initialState = {
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

function reducer(state, action) {
  switch(action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_NESTED':
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          [action.key]: action.value
        }
      }
    case 'RESET':
      return initialState
    case 'LOAD_PAYLOAD':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default function Orina() {
  const [form, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!form.print.value) return
    async function load() {
      // const res = await fetch(`/api/orina/${form.print.value}`)
      // const data = await res.json()
      // dispatch({ type:'LOAD_PAYLOAD', payload:data })
    }
    load()
  }, [form.print.value])

  const onNested = useCallback((section, key, val) => {
    dispatch({ type:'SET_NESTED', section, key, value:val })
  }, [])

  const onChange = useCallback(e => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('print.')) {
      const k = name.split('.')[1]
      dispatch({
        type:'SET_NESTED',
        section:'print',
        key:k,
        value: type==='checkbox' ? checked : value
      })
    } else if (initialState.hasOwnProperty(name)) {
      dispatch({
        type:'SET_FIELD',
        field:name,
        value: type==='checkbox' ? checked : value
      })
    }
  }, [])

  const handleClear = useCallback(() => dispatch({ type:'RESET' }), [])
  const handleSave  = useCallback(() => {
    // await fetch('/api/orina',{method:'POST',body:JSON.stringify(form)})
    console.log('Guardando', form)
  }, [form])
  const handlePrint = useCallback(() => {
    window.open(
      `/api/orina/print/${form.print.value}?orden=${form.print.orden}&recibo=${form.print.recibo}`,
      '_blank'
    )
  }, [form.print])

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
                  onChange={e=>onNested('physicalOptions',opt,e.target.checked)}
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
                      onChange={e=>onNested('physicalDetails',f,e.target.value)}
                    >
                      <option>N/A</option><option>Claro</option><option>Turbio</option>
                    </select>
                  : <input
                      className="border rounded p-1"
                      value={form.physicalDetails[f]}
                      onChange={e=>onNested('physicalDetails',f,e.target.value)}
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
                  onChange={e=>onNested('chemical',lbl,e.target.value)}
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
                  onChange={e=>onNested('sediment',lbl,e.target.value)}
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
                  onChange={e=>onNested('screeningFlags',lbl,e.target.checked)}
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
                  onChange={e=>onNested('drugValues',drug,e.target.value)}
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
                  onChange={e=>onNested('confirmFlags',lbl,e.target.checked)}
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
            onChange={e=>dispatch({ type:'SET_FIELD', field:'observaciones', value:e.target.value })}
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
            onChange={onChange}
          />
          <label>Nro Orden</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="print.recibo"
            checked={form.print.recibo}
            onChange={onChange}
          />
          <label>Nro Recibo</label>
        </div>
        <input
          name="print.value"
          value={form.print.value}
          onChange={onChange}
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
