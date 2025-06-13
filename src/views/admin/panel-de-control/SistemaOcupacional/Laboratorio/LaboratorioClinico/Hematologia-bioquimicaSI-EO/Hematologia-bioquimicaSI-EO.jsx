import React, { useReducer, useEffect, useCallback } from 'react'
import Swal from 'sweetalert2'
import microscopioImg from './microscopio.webp'

const today = new Date().toISOString().split('T')[0]

const initialState = {
  consultas: false,
  particular: false,
  ficha: true,
  norden: '',
  nrecibo: '',
  dni: '',
  fecha: today,
  responsable: '',
  paciente: '',
  empContratista: '',
  empresa: '',
  empresaNA: false,
  grupo: '',
  rh: '+',
  hemoglobina: '',
  hematocrito: '',
  vsg: '',
  leucocitos: '',
  hematies: '',
  plaquetas: '',
  linfocitos: '',
  neutrofilos: '',
  abastonados: '',
  segmentados: '',
  monocitos: '',
  eosinofilos: '',
  basofilos: '',
  glucosa: '',
  glucosaNA: true,
  creatinina: '',
  creatininaNA: true,
  rpr: '',
  rprNA: true,
  rprPos: false,
  vih: '',
  vihNA: true,
  vihPos: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialState
    case 'LOAD':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default function HematologiaBioquimicaSIEO({ apiBase, token }) {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = React.useState('')

  useEffect(() => {
    if (!form.norden) return
    async function load() {
      // const res = await fetch(`${apiBase}/hc/${form.norden}`, { headers:{Authorization:`Bearer ${token}`} })
      // const data = await res.json()
      // dispatch({ type:'LOAD', payload:data })
    }
    load()
  }, [form.norden, apiBase, token])

  const setField = useCallback((field, value) => {
    dispatch({ type:'SET', field, value })
  }, [])

  const handleSave = useCallback(async () => {
    try {
      const payload = { ...form }
      // await fetch(`${apiBase}/hc`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body:JSON.stringify(payload) })
      Swal.fire({ icon: 'success', title: 'Guardado exitoso', timer: 2000, showConfirmButton: false })
      setStatus('')
    } catch {
      Swal.fire({ icon: 'error', title: 'Error al guardar', text: 'Por favor, inténtalo de nuevo.' })
    }
  }, [form, apiBase, token])

  const handleClear = useCallback(() => {
    dispatch({ type:'RESET' })
    Swal.fire({ icon: 'info', title: 'Formulario limpiado', timer: 1500, showConfirmButton: false })
    setStatus('')
  }, [])

  const handlePrint = useCallback(() => {
    window.open(`${apiBase}/hc/print?norden=${form.norden}`, '_blank')
    Swal.fire({ icon: 'success', title: 'Imprimiendo', timer: 1500, showConfirmButton: false })
  }, [apiBase, form.norden])

  return (
    <div className="w-full max-w-[100vw] mx-auto p-4 space-y-6">
      {/* barra superior */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center flex-1 min-w-0">
          <Checkbox label="Consultas"     checked={form.consultas}  onChange={v=>setField('consultas',v)} />
          <Checkbox label="Particular"    checked={form.particular} onChange={v=>setField('particular',v)} />
          <Checkbox label="Ficha Médica Ocupacional" checked={form.ficha} onChange={v=>setField('ficha',v)} />
          <Field label="N° Orden" name="norden" value={form.norden} onChange={e=>setField('norden',e.target.value)} />
          <Field label="N° Recibo" name="nrecibo" value={form.nrecibo} onChange={e=>setField('nrecibo',e.target.value)} />
          <Field label="DNI"       name="dni"       value={form.dni}    onChange={e=>setField('dni',e.target.value)} />
          <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={e=>setField('fecha',e.target.value)} />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch({ type:'SET', field:'ficha', value:!form.ficha })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
          >Editar</button>
          <Checkbox
            label={<span className="text-red-600 font-semibold">INCOMPLETO</span>}
            checked={!form.ficha}
            onChange={v=>setField('ficha',!v)}
          />
        </div>
      </div>

      {/* contenido principal */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* formulario */}
        <div className="flex-1 bg-white p-4 rounded shadow space-y-6">
          <Section title="Datos Generales">
            <Field label="Responsable Lab" name="responsable" value={form.responsable} onChange={e=>setField('responsable',e.target.value)} />
            <Field label="Nombres"         name="paciente"    value={form.paciente}    onChange={e=>setField('paciente',e.target.value)} />
            <div className="flex gap-4">
              <Field label="Emp. Contratista" name="empContratista" value={form.empContratista} onChange={e=>setField('empContratista',e.target.value)} />
              <div className="flex items-center gap-2">
                <Field label="Empresa"    name="empresa" value={form.empresa} onChange={e=>setField('empresa',e.target.value)} />
                <Checkbox label="N/A" checked={form.empresaNA} onChange={v=>setField('empresaNA',v)} />
              </div>
            </div>
          </Section>

          <Section title="Hematología">
            <div className="flex gap-8">
              <RadioGroup
                label="Grupo Sanguíneo"
                name="grupo"
                options={['O','A','B','AB']}
                value={form.grupo}
                onChange={v=>setField('grupo',v)}
              />
              <RadioGroup
                label="Factor Rh"
                name="rh"
                options={['+','-']}
                value={form.rh}
                onChange={v=>setField('rh',v)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                ['hemoglobina','g/dl'],
                ['hematocrito','%'],
                ['vsg','mm/Hora'],
                ['leucocitos','mm³'],
                ['hematies','mm³'],
                ['plaquetas','mm³'],
                ['linfocitos','%'],
                ['neutrofilos','%'],
                ['abastonados','%'],
                ['segmentados','%'],
                ['monocitos','%'],
                ['eosinofilos','%'],
                ['basofilos','%'],
              ].map(([key,unit])=>(
                <Field
                  key={key}
                  label={capitalize(key)}
                  name={key}
                  unit={unit}
                  value={form[key]}
                  onChange={e=>setField(key,e.target.value)}
                />
              ))}
            </div>
          </Section>

          <Section title="Bioquímica">
            <div className="flex gap-8">
              <Field label="Glucosa"     name="glucosa"     unit="mg/dl" value={form.glucosa}     onChange={e=>setField('glucosa',e.target.value)}>
                <Checkbox label="N/A" checked={form.glucosaNA} onChange={v=>setField('glucosaNA',v)} />
              </Field>
              <Field label="Creatinina"  name="creatinina"  unit="mg/dl" value={form.creatinina}  onChange={e=>setField('creatinina',e.target.value)}>
                <Checkbox label="N/A" checked={form.creatininaNA} onChange={v=>setField('creatininaNA',v)} />
              </Field>
            </div>
          </Section>

          <Section title="Reacciones Serológicas">
            <div className="flex gap-8">
              {['rpr','vih'].map(key=>(
                <Field key={key} label={key.toUpperCase()} name={key} value={form[key]} onChange={e=>setField(key,e.target.value)}>
                  <Checkbox label="N/A" checked={form[`${key}NA`]} onChange={v=>setField(`${key}NA`,v)} />
                  <RadioGroup
                    name={key+'Pos'}
                    options={['+','-']}
                    value={form[`${key}Pos`]? '+' : '-'}
                    onChange={v=>setField(`${key}Pos`, v==='+' )}
                  />
                </Field>
              ))}
            </div>
          </Section>

          <div className="flex justify-between mt-6">
            <button onClick={handleSave}  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Guardar</button>
            <button onClick={handleClear} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">Limpiar</button>
          </div>
        </div>

        {/* registros y microscopio */}
        <div className="bg-white p-4 rounded shadow w-full lg:w-1/3 flex flex-col justify-between">
          <Section title="Registros anteriores">
            <div className="h-32 bg-blue-50 rounded" />
          </Section>
          <div className="flex justify-center">
            <img src={microscopioImg} alt="Microscopio" className="w-64 h-64 object-contain" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center gap-2">
          <i className="fa fa-print" /> Imprimir
        </button>
      </div>

      {status && <p className="text-center text-green-600">{status}</p>}
    </div>
  )
}

// componentes auxiliares
function Field({ label, name, type='text', unit='', value, onChange, children, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}{unit && <span className="text-sm ml-1">{unit}</span>}</label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={`border rounded px-2 py-1 flex-1 ${disabled?'bg-gray-100':''}`}
        />
        {children}
      </div>
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-1">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      {label}
    </label>
  )
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium mb-1">{label}</span>
      <div className="flex items-center gap-2">
        {options.map(opt=>(
          <label key={opt} className="flex items-center gap-1">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value===opt}
              onChange={e=>onChange(e.target.value)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-blue-700 font-semibold">{title}</h3>
      {children}
    </div>
  )
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

