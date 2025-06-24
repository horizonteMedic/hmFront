import React, { useState, useEffect, useRef } from 'react';
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
      fecha: today,
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
      vih: '',
      vihNA: false,
      gfSangPedido: ''
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

  useEffect(() => {
    const grupo = form.grupo || '';
    const rh = (form.rh || '').replace('Rh','');
    setField('gfSangPedido', `${grupo} ${rh}`.trim());
  }, [form.grupo, form.rh]);

  
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
  
  // Estado para N/A de Hematología
  const [hematologiaNA, setHematologiaNA] = useState(false);

  // Refs para inputs de Hematología
  const hematologiaKeys = [
    'hemoglobina','hematocrito','vsg','leucocitos','hematies','plaquetas',
    'neutrofilos','abastonados','segmentados','monocitos','eosinofilos','basofilos','linfocitos'
  ];
  const hematologiaRefs = hematologiaKeys.map(() => useRef());

  // Función para setear todos los campos de Hematología a 'N/A' o restaurar
  const handleHematologiaNA = (checked) => {
    setHematologiaNA(checked);
    const value = checked ? 'N/A' : '';
      setForm(prev => {
        const newFields = {};
      hematologiaKeys.forEach(k => { newFields[k] = value; });
        return { ...prev, ...newFields };
      });
    if (checked) {
      setField('grupo', '');
      setField('rh', '');
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full text-md">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-md"
          >Editar</button>
          <Checkbox
            label={<span className="text-red-600 font-semibold text-md">INCOMPLETO</span>}
            checked={!form.ficha}
            onChange={v => setField('ficha', !v)}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white p-4 rounded shadow font-sans text-md">
          
            {/* Top general section */}
            <div className="space-y-1">
              <div className="flex items-center gap-x-4">
                <label className="font-medium mb-1">Responsable Lab<span className="text-sm ml-1"></span></label>
                <div className="flex items-center gap-2 relative w-full">
                  <input
                    type='text'
                    autoComplete='off'
                    name='responsable'
                    value={searchMedico}
                    onChange={handleMedicoSearch}
                    className={`border rounded px-2 py-1 flex-1 w-full  bg-gray-100}`}
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
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center flex-1">
                        <label className="w-28 font-semibold shrink-0">Nombres :</label>
                        <input name="paciente" value={form.paciente} className="border border-gray-400 rounded-sm px-1 w-full text-md bg-gray-100" disabled />
                    </div>
                    <div className="flex items-center">
                        <label className="font-semibold mr-2 shrink-0">G.F. Sang. Pedido</label>
                        <input name="gfSangPedido" value={form.gfSangPedido} className="border border-gray-400 rounded-sm px-1 w-32 bg-gray-100 text-md" disabled />
                    </div>
                </div>
                 <div className="flex items-center col-span-2">
                    <label className="w-28 font-semibold shrink-0">Emp. Contratista :</label>
                    <input name="empContratista" value={form.empContratista} className="border border-gray-400 rounded-sm px-1 w-full text-md bg-gray-100" disabled />
                </div>
                <div className="flex items-center col-span-2">
                    <label className="w-28 font-semibold shrink-0">Empresa :</label>
                    <input name="empresa" value={form.empresa} className="border border-gray-400 rounded-sm px-1 w-full text-md bg-gray-100" disabled />
                </div>
            </div>

            {/* Hematología */}
            <fieldset className="border border-gray-400 p-2 mt-2">
                <legend className="px-2 font-semibold text-md flex items-center gap-4">Hematología
                    <Checkbox label="N/A" checked={hematologiaNA} onChange={handleHematologiaNA} />
                </legend>
                <div className="grid grid-cols-2 gap-x-8">
                {/* Left Column */}
                <div className="space-y-1">
                    <div className="flex items-center">
                        <label className="w-32 font-semibold">Grupo Sanguíneo :</label>
                        <div className="flex gap-2">
                            {['O','A','B','AB'].map(opt => (
                            <label key={opt} className="flex items-center gap-1">
                                <input type="radio" name="grupo" value={opt} checked={form.grupo === opt} onClick={e => setField('grupo', form.grupo === e.target.value ? '' : e.target.value)} disabled={form.empresaNA || hematologiaNA} />{opt}
                            </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="w-32 font-semibold">Factor Rh :</label>
                        <div className="flex gap-2">
                            <label className="flex items-center gap-1">
                                <input type="radio" name="rh" value="Rh(+)" checked={form.rh === 'Rh(+)'} onClick={e => setField('rh', form.rh === e.target.value ? '' : e.target.value)} disabled={form.empresaNA || hematologiaNA} />Rh(+)
                            </label>
                            <label className="flex items-center gap-1">
                                <input type="radio" name="rh" value="Rh(-)" checked={form.rh === 'Rh(-)'} onClick={e => setField('rh', form.rh === e.target.value ? '' : e.target.value)} disabled={form.empresaNA || hematologiaNA} />Rh(-)
                            </label>
                        </div>
                    </div>
                    {[
                        ['hemoglobina','g/dl'], ['hematocrito','%'], ['vsg','mm/Hora'], 
                        ['leucocitos','mm³'], ['hematies','mm³'], ['plaquetas','mm³']
                    ].map(([key, unit], idx) => (
                    <div key={key} className="flex items-center">
                        <label className="w-32 font-semibold">{capitalize(key)} :</label>
                        <input
                            name={key}
                            value={form[key]}
                            onChange={handleInputChange}
                            className="border border-gray-400 rounded-sm px-1 w-24 text-md"
                            disabled={form.empresaNA || hematologiaNA}
                            ref={hematologiaRefs[idx]}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    const next = hematologiaRefs[idx + 1];
                                    if (next && next.current) next.current.focus();
                                }
                            }}
                        />
                        <span className="ml-2 w-16">{unit}</span>
                    </div>
                    ))}
                </div>
                {/* Right Column */}
                <div className="space-y-1">
                    {[
                        ['neutrofilos','%'], ['abastonados','%'], ['segmentados','%'], 
                        ['monocitos','%'], ['eosinofilos','%'], ['basofilos','%'], ['linfocitos','%']
                    ].map(([key, unit], idx) => (
                    <div key={key} className="flex items-center">
                        <label className="w-32 font-semibold">{capitalize(key)} :</label>
                        <input
                            name={key}
                            value={form[key]}
                            onChange={handleInputChange}
                            className="border border-gray-400 rounded-sm px-1 w-24 text-md"
                            disabled={form.empresaNA || hematologiaNA}
                            ref={hematologiaRefs[idx + 6]}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    const next = hematologiaRefs[idx + 7];
                                    if (next && next.current) next.current.focus();
                                }
                            }}
                        />
                        <span className="ml-2">{unit}</span>
                    </div>
                    ))}
                </div>
                </div>
            </fieldset>

            {/* Bioquímica */}
            <fieldset className="border border-gray-400 p-2 mt-2">
                <legend className="px-2 font-semibold text-md">Bioquímica</legend>
                <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <label className="w-24 font-semibold">Glucosa :</label>
                    <input name="glucosa" value={form.glucosa} onChange={handleInputChange} className="border border-gray-400 rounded-sm px-1 w-28 text-md" disabled={form.glucosaNA}/>
                    <span className="w-12">mg/dl</span>
                    <Checkbox label="N/A" checked={form.glucosaNA} onChange={v => { setField('glucosaNA', v); setField('glucosa', v ? 'N/A' : ''); }} />
                    <span className="ml-4 text-md">Valores normales 70 - 110 mg/dl</span>
                </div>
                <div className="flex items-center gap-2">
                    <label className="w-24 font-semibold">Creatinina :</label>
                    <input name="creatinina" value={form.creatinina} onChange={handleInputChange} className="border border-gray-400 rounded-sm px-1 w-28 text-md" disabled={form.creatininaNA}/>
                    <span className="w-12">mg/dl</span>
                    <Checkbox label="N/A" checked={form.creatininaNA} onChange={v => { setField('creatininaNA', v); setField('creatinina', v ? 'N/A' : ''); }} />
                    <span className="ml-4 text-md">Valores normales 0.8 - 1.4 mg/dl</span>
                </div>
                </div>
            </fieldset>

            {/* Reacciones Serológicas */}
            <fieldset className="border border-gray-400 p-2 mt-2">
                <legend className="px-2 font-semibold text-md">Reacciones Serológicas</legend>
                <div className="grid grid-cols-2 divide-x divide-gray-400">
                    <div className="pr-4 space-y-1">
                        <div className="flex items-center gap-2">
                        <label className="w-12 font-semibold">RPR :</label>
                        <input name="rpr" value={form.rprNA ? 'N/A' : form.rpr} onChange={handleInputChange} className="border border-gray-400 rounded-sm px-1 flex-1 text-md" disabled={form.rprNA} />
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <Checkbox label="+" checked={form.rpr === 'POSITIVO'} onChange={() => { setField('rpr', 'POSITIVO'); setField('rprNA', false); }} disabled={form.rprNA}/>
                            <Checkbox label="-" checked={form.rpr === 'NEGATIVO'} onChange={() => { setField('rpr', 'NEGATIVO'); setField('rprNA', false); }} disabled={form.rprNA}/>
                            <Checkbox label="N/A" checked={form.rprNA} onChange={v => { setField('rprNA', v); setField('rpr', v ? 'N/A' : ''); }} />
                        </div>
                    </div>
                    <div className="pl-4 space-y-1">
                        <div className="flex items-center gap-2">
                        <label className="w-12 font-semibold">VIH :</label>
                        <input name="vih" value={form.vihNA ? 'N/A' : form.vih} onChange={handleInputChange} className="border border-gray-400 rounded-sm px-1 flex-1 text-md" disabled={form.vihNA}/>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <Checkbox label="+" checked={form.vih === 'POSITIVO'} onChange={() => { setField('vih', 'POSITIVO'); setField('vihNA', false); }} disabled={form.vihNA}/>
                            <Checkbox label="-" checked={form.vih === 'NEGATIVO'} onChange={() => { setField('vih', 'NEGATIVO'); setField('vihNA', false); }} disabled={form.vihNA}/>
                            <Checkbox label="N/A" checked={form.vihNA} onChange={v => { setField('vihNA', v); setField('vih', v ? 'N/A' : ''); }} />
                        </div>
                    </div>
                </div>
            </fieldset>
            <div className="flex justify-between mt-6">
              <button onClick={handleClear} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded text-md">Limpiar</button>
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
         
        </div>
      </div>

     

      {status && <p className="text-center text-green-600 text-md">{status}</p>}
    </div>
  );
};

// Componentes auxiliares
function Field({ label, name, type = 'text', unit = '', value, onChange, children, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1 text-md">{label}{unit && <span className="text-md ml-1">{unit}</span>}</label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={`border rounded px-2 py-1 flex-1 text-md ${disabled ? 'bg-gray-100' : ''}`}
        />
        {children}
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-1 text-md">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium mb-1 text-md">{label}</span>
      <div className="flex items-center gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-1 text-md">
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
      <h3 className="text-blue-700 font-semibold text-md">{title}</h3>
      {children}
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default HematologiaBioquimicaSIEO;
