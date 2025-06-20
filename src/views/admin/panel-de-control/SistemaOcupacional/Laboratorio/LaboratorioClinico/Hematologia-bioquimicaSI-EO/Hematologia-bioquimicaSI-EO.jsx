import React, { useState, useEffect } from 'react';
import microscopioImg from './microscopio.webp';
import { VerifyTR } from '../ControllerLC/ControllerLC';
import { getFetch } from '../../../../getFetch/getFetch';

export const HematologiaBioquimicaSIEO = ({ token, selectedSede, userlogued, form, setForm, setFormO }) => {
  const tabla = 'lab_clinico';
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const [tableLab, settableLab] = useState([])
  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleClear = () => {
    setForm({
      ficha: true,
      norden: '',
      responsable: '',
      paciente: '',
      empContratista: '',
      empresa: '',
      empresaNA: false,
      grupo: '',
      rh: '',
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
      glucosaNA: false,
      creatinina: '',
      creatininaNA: false,
      rpr: '',
      rprNA: false,
      rprPos: false,
      vih: '',
      vihNA: false,
      vihPos: false
    });
    settableLab([])
  };

  const handlePrint = () => {
    console.log('Printing form:', form);
  };

  const GetTable = (nro) => {
    getFetch(`/api/v01/ct/laboratorio/listadoGrupoFactorSanguineo?nOrden=${nro}`,token)
    .then((res) => {
      settableLab(res)
    })
  }

  const [status, setStatus] = useState('');
  const [listDoc, setListDoc] = useState([])

//NOMBRES DEL DOCTOR
  useEffect(() => {
    getFetch(`/api/v01/ct/laboratorio/listadoUsuariosPorPrioridadNameUser?nameUser=${userlogued}`,token)
      .then((res) => {
        setListDoc(res)
        setForm(f => ({ ...f, responsable: res[0] }))
        setSearchMedico(res[0])
      })
      .catch(() => {});
  },[])

  //AUTOCOMPLETAR DEL DOC
  const [searchMedico, setSearchMedico]  = useState(form.responsable);
  const [filteredMedicos, setFilteredMedicos] = useState([]);

  const handleMedicoSearch = e => {
    
    const v = e.target.value.toUpperCase();
    setSearchMedico(v);
    setField('responsable', v)
    setFilteredMedicos(
      v
        ? listDoc.filter(m =>
            m.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };

  const handleSelectMedico = m => {
    setSearchMedico(m);
    setField('responsable', m)
    setFilteredMedicos([]);
  };
  
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center w-full gap-3 p-2 justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <label className="font-medium flex items-center whitespace-nowrap">
            <input type="checkbox" className="mr-1"/> Consultas
          </label>
          <label className="font-medium flex items-center whitespace-nowrap">
            <input type="checkbox" className="mr-1"/> Particular
          </label>
          <label className="font-medium flex items-center whitespace-nowrap">
            <input type="checkbox" className="mr-1" defaultChecked/> Ficha Médica Ocupacional
          </label>
          <label className="font-medium flex items-center whitespace-nowrap">
            N° Orden:
            <input
              name="norden"
              value={form.norden}
              onChange={handleInputChange}
              onKeyUp={event => { if (event.key === 'Enter')handleClear(),VerifyTR(form.norden, tabla, token, setForm, setFormO, selectedSede,setSearchMedico),GetTable(form.norden) }}
              className="border rounded px-2 py-1 w-28 text-md ml-1"
            />
          </label>
          <label className="font-medium flex items-center whitespace-nowrap">
            N° Recibo:
            <input className="border rounded px-2 py-1 w-28 text-md ml-1" />
          </label>
          <label className="font-medium flex items-center whitespace-nowrap">
            DNI:
            <input className="border rounded px-2 py-1 w-28 text-md ml-1" />
          </label>
          <label className="font-medium flex items-center whitespace-nowrap">
            Fecha:
            <input name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-36 text-md ml-1" />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setField('ficha', !form.ficha)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
          >Editar</button>
          <Checkbox
            label={<span className="text-red-600 font-semibold">INCOMPLETO</span>}
            checked={!form.ficha}
            onChange={v => setField('ficha', !v)}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white p-4 rounded shadow space-y-6">
          <Section title="Datos Generales">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Responsable Lab<span className="text-sm ml-1"></span></label>
              <div className="flex items-center gap-2 relative">
                <input
                  type='text'
                  autoComplete='off'
                  name='responsable'
                  value={searchMedico}
                  onChange={handleMedicoSearch}
                  className={`border rounded px-2 py-1 flex-1  bg-gray-100}`}
                  onKeyUp={e => {
                    if (e.key === 'Enter' && filteredMedicos.length > 0) {
                      e.preventDefault();
                      handleSelectMedico(filteredMedicos[0]);
                    }
                  }}
                  onFocus={() => {
                    if (searchMedico) {
                      setFilteredMedicos(
                        listDoc.filter(m =>
                          m.toLowerCase().includes(searchMedico.toLowerCase())
                        )
                      );
                    }
                  }}
                  onBlur={() => setTimeout(() => setFilteredMedicos([]), 100)}
                />
                {searchMedico && filteredMedicos.length > 0 && (
                  <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredMedicos.map(m => (
                      <li
                        key={m}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg"
                        onMouseDown={() => handleSelectMedico(m)}
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <Field label="Nombres" name="paciente" value={form.paciente} onChange={e => setField('paciente', e.target.value)} />
            <div className="flex gap-4">
              <Field label="Emp. Contratista" name="empContratista" value={form.empContratista} onChange={e => setField('empContratista', e.target.value)} />
              <div className="flex items-center gap-2">
                <Field label="Empresa" name="empresa" value={form.empresa} onChange={e => setField('empresa', e.target.value)} />
                <Checkbox label="N/A" checked={form.empresaNA} onChange={v => setField('empresaNA', v)} />
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
                onChange={v => setField('grupo', v)}
              />
              <RadioGroup
                label="Factor Rh"
                name="rh"
                options={['+','-']}
                value={form.rh}
                onChange={v => setField('rh', v)}
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
              ].map(([key,unit]) => (
                <Field
                  key={key}
                  label={capitalize(key)}
                  name={key}
                  unit={unit}
                  value={form[key]}
                  onChange={e => setField(key, e.target.value)}
                />
              ))}
            </div>
          </Section>

          <Section title="Bioquímica">
            <div className="flex flex-col gap-2 border rounded p-2">
              <div className="flex items-center gap-2">
                <label className="w-24">Glucosa :</label>
                <input
                  type="text"
                  name="glucosa"
                  value={form.glucosa}
                  onChange={e => setField('glucosa', e.target.value)}
                  className="border rounded px-2 py-1 w-28"
                  disabled={form.glucosaNA}
                />
                <span>mg/dl</span>
                <Checkbox label="N/A" checked={form.glucosaNA} onChange={v => setField('glucosaNA', v)} />
                <span className="ml-4 text-xs text-gray-600">Valores normales 70 - 110 mg/dl</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-24">Creatinina :</label>
                <input
                  type="text"
                  name="creatinina"
                  value={form.creatinina}
                  onChange={e => setField('creatinina', e.target.value)}
                  className="border rounded px-2 py-1 w-28"
                  disabled={form.creatininaNA}
                />
                <span>mg/dl</span>
                <Checkbox label="N/A" checked={form.creatininaNA} onChange={v => setField('creatininaNA', v)} />
                <span className="ml-4 text-xs text-gray-600">Valores normales 0.8 - 1.4 mg/dl</span>
              </div>
            </div>
          </Section>

          <Section title="Reacciones Serológicas">
            <div className="flex border rounded p-2 divide-x divide-gray-300">
              <div className="flex-1 flex items-center gap-2 pr-4">
                <label className="w-12">RPR :</label>
                <input
                  type="text"
                  name="rpr"
                  value={form.rprNA ? 'N/A' : form.rpr}
                  onChange={e => setField('rpr', e.target.value)}
                  className="border rounded px-2 py-1 w-28"
                  disabled={form.rprNA}
                />
                <div className="flex items-center gap-1 ml-2">
                  <Checkbox label="+" checked={form.rprPos && !form.rprNA && form.rpr !== 'N/A'} onChange={v => { setForm(prev => ({...prev, rpr: ''})),setField('rprPos', v); setField('rprNA', false); }} disabled={form.rprNA} />
                  <Checkbox label="-" checked={!form.rprPos && !form.rprNA && form.rpr !== 'N/A'} onChange={v => { setForm(prev => ({...prev, rpr: ''})),setField('rprPos', !v); setField('rprNA', false); }} disabled={form.rprNA} />
                  <Checkbox label="N/A" checked={form.rprNA} onChange={v => { setField('rprNA', v); if (v) setField('rpr', 'N/A'); }} />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2 pl-4">
                <label className="w-12">VIH :</label>
                <input
                  type="text"
                  name="vih"
                  value={form.vihNA ? 'N/A' : form.vih}
                  onChange={e => setField('vih', e.target.value)}
                  className="border rounded px-2 py-1 w-28"
                  disabled={form.vihNA}
                />
                <div className="flex items-center gap-1 ml-2">
                  <Checkbox label="+" checked={form.vihPos && !form.vihNA && form.vih !== 'N/A'} onChange={v => { setForm(prev => ({...prev, vih: ''})),setField('vihPos', v); setField('vihNA', false); }} disabled={form.vihNA} />
                  <Checkbox label="-" checked={!form.vihPos && !form.vihNA && form.vih !== 'N/A'} onChange={v => { setForm(prev => ({...prev, vih: ''})),setField('vihPos', !v); setField('vihNA', false); }} disabled={form.vihNA} />
                  <Checkbox label="N/A" checked={form.vihNA || form.vih === 'N/A'} onChange={v => { setField('vihNA', v); if (v) setField('vih', 'N/A'); }} />
                </div>
              </div>
            </div>
          </Section>

          <div className="flex justify-between mt-6">
            <button onClick={handleClear} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">Limpiar</button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow w-full lg:w-1/3 flex flex-col justify-between">
          <Section title="Registros anteriores">
            <table className="w-full text-md border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-blue-300 text-center">
                  <th>Fecha Laboratorio</th>
                  <th>Grupo Sanguineo</th>
                  <th>Factor RH</th>
                </tr>
              </thead>
              <tbody>
                {tableLab.length == 0  && <tr><td className="border border-gray-300 px-2 py-1 mb-1 text-center" colSpan={7}>Sin Datos...</td></tr>}
                {tableLab.map((row, i) => (
                  <tr
                    key={i}
                    className={`text-center transition-all duration-200 relative after:content-[""] after:absolute after:inset-0 }`}
                    style={{zIndex: 1, position: 'relative'}}
                  >
                    <td className="font-bold border-b border-gray-200 py-1">{row.fechaLab}</td>
                    <td className="border-b border-gray-200 py-1">{row.grupoSanguineo}</td>
                    <td className="border-b border-gray-200 py-1">{row.factorRh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  );
};

// Componentes auxiliares
function Field({ label, name, type = 'text', unit = '', value, onChange, children, disabled }) {
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
          className={`border rounded px-2 py-1 flex-1 ${disabled ? 'bg-gray-100' : ''}`}
        />
        {children}
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-1">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium mb-1">{label}</span>
      <div className="flex items-center gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-1">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={e => onChange(e.target.value)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-blue-700 font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default HematologiaBioquimicaSIEO;
