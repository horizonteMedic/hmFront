import React, { useState, useEffect, useRef } from 'react';
import microscopioImg from './microscopio.webp';
import { VerifyTR } from '../ControllerLC/ControllerLC';
import { getFetch } from '../../../../getFetch/getFetch';

export const HematologiaBioquimicaSIEO = ({ token, selectedSede, userlogued, form, setForm, setFormO, listDoc, setSearchMedico, searchMedico }) => {
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

  useEffect(() => {
    const grupo = form.grupo || '';
    const rh = (form.rh || '').replace('Rh','');
    setField('gfSangPedido', `${grupo} ${rh}`.trim());
  }, [form.grupo, form.rh]);

  
  //AUTOCOMPLETAR DEL DOC
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

  // Desmarcar N/A si se traen datos reales
  useEffect(() => {
    // Si alguno de los campos de Hematología o Bioquímica tiene valor distinto de '' y distinto de 'N/A', desmarcar N/A
    const hematoCampos = [
      ...hematologiaKeys,
      'glucosa', 'creatinina'
    ];
    const hayDatos = hematoCampos.some(k => form[k] && form[k] !== 'N/A');
    if (hayDatos) {
      if (hematologiaNA) setHematologiaNA(false);
      if (form.glucosaNA) setField('glucosaNA', false);
      if (form.creatininaNA) setField('creatininaNA', false);
    }
  }, [form]);

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
      hematologiaKeys.forEach(k => {
        if (["hemoglobina","hematocrito"].includes(k)) {
          newFields[k] = checked ? '' : '';
        } else {
          newFields[k] = value;
        }
      });
      // Bioquímica: glucosa libre, creatinina sí N/A
      newFields['glucosa'] = checked ? '' : '';
      newFields['glucosaNA'] = false;
      newFields['creatinina'] = value;
      newFields['creatininaNA'] = checked;
      return { ...prev, ...newFields };
    });
    if (checked) {
      setField('grupo', '');
      setField('rh', '');
    }
  };

  // Ref para glucosa y creatinina
  const glucosaRef = useRef();
  const creatininaRef = useRef();

  // Reacciones Serológicas: N/A marcado por defecto
  const [rprNA, setRprNA] = useState(true);
  const [vihNA, setVihNA] = useState(true);

  return (
    <div className="flex flex-col gap-2 w-full text-md">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center w-full gap-6 p-2 justify-between">
        <div className="flex flex-wrap items-center gap-6 flex-1 min-w-0">
          <label className="font-bold flex items-center whitespace-nowrap"> <input type="checkbox" className="mr-1"/> Consultas </label>
          <label className="font-bold flex items-center whitespace-nowrap"> <input type="checkbox" className="mr-1"/> Particular </label>
          <label className="font-bold flex items-center whitespace-nowrap"> <input type="checkbox" className="mr-1" defaultChecked/> Ficha Médica Ocupacional </label>
          <label className="font-bold flex items-center whitespace-nowrap"> N° Orden: <input name="norden" value={form.norden} onChange={handleInputChange} onKeyUp={event => { if (event.key === 'Enter') { if (!form.norden) { window.Swal && window.Swal.fire('Error', 'Debe Introducir un Nro de Historia Clínica válido', 'error'); event.preventDefault(); return; } handleClear(); VerifyTR(form.norden, tabla, token, setForm, setFormO, selectedSede, setSearchMedico); GetTable(form.norden); } }} className="border rounded px-2 py-1 w-36 text-md ml-1" /> </label>
          <label className="font-bold flex items-center whitespace-nowrap"> N° Recibo: <input className="border rounded px-2 py-1 w-36 text-md ml-1 bg-gray-100" disabled /> </label>
          <label className="font-bold flex items-center whitespace-nowrap"> DNI: <input value={form.dni} className="border rounded px-2 py-1 w-36 text-md ml-1" /> </label>
          <label className="font-bold flex items-center whitespace-nowrap"> Fecha: <input name="fecha" type="date" value={form.fecha} onChange={handleInputChange} className="border rounded px-2 py-1 w-44 text-md ml-1" /> </label>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setField('ficha', !form.ficha)}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1 rounded text-md font-bold"
          >Editar</button>
          <Checkbox
            label={<span className="text-red-600 font-bold text-md">INCOMPLETO</span>}
            checked={!form.ficha}
            onChange={v => setField('ficha', !v)}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white p-4 rounded shadow font-sans text-md">
          
            {/* Top general section */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="w-44 font-bold mb-0">Responsable Lab</label>
                <div className="flex-1 relative">
                  <input type='text' autoComplete='off' name='responsable' value={searchMedico} onChange={handleMedicoSearch} className={`border rounded px-2 py-1 w-full bg-gray-100 font-bold`} onKeyUp={e => { if (e.key === 'Enter' && filteredMedicos.length > 0) { e.preventDefault(); handleSelectMedico(filteredMedicos[0]); } }} onFocus={() => { if (searchMedico) { setFilteredMedicos(listDoc.filter(m => m.toLowerCase().includes(searchMedico.toLowerCase()))); } }} onBlur={() => setTimeout(() => setFilteredMedicos([]), 100)} />
                  {searchMedico && filteredMedicos.length > 0 && (
                    <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredMedicos.map(m => (
                        <li key={m} className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold" onMouseDown={() => handleSelectMedico(m)}>{m}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1">
                        <label className="w-44 font-bold mb-0">Nombres</label>
                        <input name="paciente" value={form.paciente} className="border border-gray-400 rounded-sm px-1 w-full text-md bg-gray-100 font-bold" disabled />
                    </div>
                    <div className="flex items-center">
                        <label className="w-44 font-bold mb-0 ml-4">G.F. Sang. Pedido</label>
                        <input name="gfSangPedido" value={form.gfSangPedido} className="border border-gray-400 rounded-sm px-1 w-44 bg-gray-100 text-md font-bold" disabled />
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <label className="w-44 font-bold mb-0">Emp. Contratista</label>
                    <input name="empContratista" value={form.empContratista} className="border border-gray-400 rounded-sm px-1 w-full text-md bg-gray-100 font-bold" disabled />
                </div>
                <div className="flex items-center gap-4">
                    <label className="w-44 font-bold mb-0">Empresa</label>
                    <input name="empresa" value={form.empresa} className="border border-gray-400 rounded-sm px-1 w-full text-md bg-gray-100 font-bold" disabled />
                </div>
            </div>

            {/* Hematología */}
            <div className="mt-8 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xl text-[#233245]">Hematología</span>
                <Checkbox label={<span className="font-medium">N/A</span>} checked={hematologiaNA} onChange={handleHematologiaNA} />
              </div>
              <div className="grid grid-cols-2 gap-x-8">
                {/* Left Column */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center h-12 mb-0">
                    <label className="w-40 font-medium text-[#233245]">Grupo Sanguíneo</label>
                    <div className="flex gap-4 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
                      {['O','A','B','AB'].map(opt => (
                        <label key={opt} className="flex items-center gap-1 text-gray-900 font-medium">
                          <input type="radio" name="grupo" value={opt} checked={form.grupo === opt} onClick={e => setField('grupo', form.grupo === e.target.value ? '' : e.target.value)} disabled={form.empresaNA} className="accent-blue-600 w-5 h-5 rounded-full border-2 border-gray-400" />{opt}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row items-center h-12 mb-0">
                    <label className="w-40 font-medium text-[#233245]">Factor Rh :</label>
                    <div className="flex gap-4 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
                      <label className="flex items-center gap-1 text-gray-900 font-medium">
                        <input type="radio" name="rh" value="Rh(+)" checked={form.rh === 'Rh(+)'} onClick={e => setField('rh', form.rh === e.target.value ? '' : e.target.value)} disabled={form.empresaNA} className="accent-blue-600 w-5 h-5 rounded-full border-2 border-gray-400" />Rh(+)
                      </label>
                      <label className="flex items-center gap-1 text-gray-900 font-medium">
                        <input type="radio" name="rh" value="Rh(-)" checked={form.rh === 'Rh(-)'} onClick={e => setField('rh', form.rh === e.target.value ? '' : e.target.value)} disabled={form.empresaNA} className="accent-blue-600 w-5 h-5 rounded-full border-2 border-gray-400" />Rh(-)
                      </label>
                    </div>
                  </div>
                  {[ 
                    ['hemoglobina','g/dl'], ['hematocrito','%'], ['vsg','mm/Hora'], 
                    ['leucocitos','mm³'], ['hematies','mm³'], ['plaquetas','mm³']
                  ].map(([key, unit], idx) => (
                    <div key={key} className="flex flex-row items-center h-12 mb-0">
                      <label className="w-40 font-medium text-[#233245]">{capitalize(key)} :</label>
                      <input
                        name={key}
                        value={form[key]}
                        onChange={handleInputChange}
                        className={`border border-gray-300 rounded-lg px-3 py-1 w-44 text-md shadow-sm bg-white focus:ring-2 focus:ring-gray-300 transition-all font-medium ${form.empresaNA ? 'bg-gray-200 text-gray-500' : 'text-gray-900'}`}
                        disabled={form.empresaNA}
                        ref={hematologiaRefs[idx]}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const next = hematologiaRefs[idx + 1];
                            if (next && next.current) next.current.focus();
                          }
                        }}
                      />
                      <span className="ml-2 w-16 font-medium">{unit}</span>
                    </div>
                  ))}
                </div>
                {/* Right Column alineado */}
                <div className="flex flex-col gap-2">
                  {[
                    ['neutrofilos','%'], ['abastonados','%'], ['segmentados','%'], 
                    ['monocitos','%'], ['eosinofilos','%'], ['basofilos','%'], ['linfocitos','%']
                  ].map(([key, unit], idx) => (
                    <div key={key} className="flex flex-row items-center h-12 mb-0">
                      <label className="w-40 font-medium text-[#233245] text-right pr-2">{capitalize(key)} :</label>
                      <input
                        name={key}
                        value={form[key]}
                        onChange={handleInputChange}
                        className={`border border-gray-300 rounded-lg px-3 py-1 w-44 text-md shadow-sm bg-white focus:ring-2 focus:ring-gray-300 transition-all font-medium ${form.empresaNA ? 'bg-gray-200 text-gray-500' : 'text-gray-900'}`}
                        disabled={form.empresaNA}
                        ref={hematologiaRefs[idx + 6]}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            // Si es linfocitos, focus a glucosa
                            if (key === 'linfocitos') {
                              if (glucosaRef && glucosaRef.current) glucosaRef.current.focus();
                            } else {
                              const next = hematologiaRefs[idx + 7];
                              if (next && next.current) next.current.focus();
                            }
                          }
                        }}
                      />
                      <span className="ml-2 w-16 font-medium">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bioquímica */}
            <div className="mt-8 mb-2">
              <span className="font-bold text-xl mb-4 text-[#233245] block">Bioquímica</span>
              <div className="space-y-3">
                <div className="flex flex-row items-center h-12 mb-0 gap-x-4">
                  <label className="w-40 font-medium text-[#233245]">Glucosa :</label>
                  <input name="glucosa" ref={glucosaRef} value={form.glucosa} onChange={handleInputChange} className={`border border-gray-300 rounded-lg px-3 py-1 w-44 text-md shadow-sm bg-white focus:ring-2 focus:ring-gray-300 transition-all font-medium ${form.glucosaNA ? 'bg-gray-200 text-gray-500' : 'text-gray-900'}`} disabled={form.glucosaNA}
                    onKeyDown={e => { if(e.key==='Enter'){ if(creatininaRef && creatininaRef.current) creatininaRef.current.focus(); } }}/>
                  <span className="ml-4 w-12 font-medium">mg/dl</span>
                  <span className="ml-4"><Checkbox label={<span className='font-medium'>N/A</span>} checked={form.glucosaNA || form.glucosa === "N/A"} onChange={v => { setField('glucosaNA', v); setField('glucosa', v ? 'N/A' : ''); }} /></span>
                  <span className="ml-6 text-md text-gray-600 font-medium">Valores normales 70 - 110 mg/dl</span>
                </div>
                <div className="flex flex-row items-center h-12 mb-0 gap-x-4">
                  <label className="w-40 font-medium text-[#233245]">Creatinina :</label>
                  <input name="creatinina" ref={creatininaRef} value={form.creatinina} onChange={handleInputChange} className={`border border-gray-300 rounded-lg px-3 py-1 w-44 text-md shadow-sm bg-white focus:ring-2 focus:ring-gray-300 transition-all font-medium ${form.creatininaNA ? 'bg-gray-200 text-gray-500' : 'text-gray-900'}`} disabled={form.creatininaNA}/>
                  <span className="ml-4 w-12 font-medium">mg/dl</span>
                  <span className="ml-4"><Checkbox label={<span className='font-medium'>N/A</span>} checked={form.creatininaNA || form.creatinina === "N/A"} onChange={v => { setField('creatininaNA', v); setField('creatinina', v ? 'N/A' : ''); }} /></span>
                  <span className="ml-6 text-md text-gray-600 font-medium">Valores normales 0.8 - 1.4 mg/dl</span>
                </div>
              </div>
            </div>

            {/* Reacciones Serológicas */}
            <div className="mt-8 mb-2">
              <span className="font-bold text-xl mb-4 text-[#233245] block">Reacciones Serológicas</span>
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="pr-4 space-y-2">
                  <div className="flex flex-row items-center mb-2">
                    <label className="w-20 font-medium text-[#233245]">RPR :</label>
                    <input name="rpr" value={rprNA ? 'N/A' : form.rpr} onChange={handleInputChange} className={`border border-gray-300 rounded-lg px-3 py-1 flex-1 text-md shadow-sm font-medium bg-white focus:ring-2 focus:ring-gray-300 transition-all ${rprNA ? 'bg-gray-200 text-gray-500' : 'text-gray-900'}`} disabled={rprNA} />
                  </div>
                  <div className="flex items-center gap-4 justify-center">
                    <Checkbox label={<span className='font-medium'>-</span>} checked={form.rpr === 'NEGATIVO'} onChange={() => { setField('rpr', 'NEGATIVO'); setField('rprNA', false); }} disabled={rprNA}/>
                    <Checkbox label={<span className='font-medium'>+</span>} checked={form.rpr === 'POSITIVO'} onChange={() => { setField('rpr', 'POSITIVO'); setField('rprNA', false); }} disabled={rprNA}/>
                    <Checkbox label={<span className='font-medium'>N/A</span>} checked={rprNA} onChange={v => { setRprNA(v); setField('rprNA', v); setField('rpr', v ? 'N/A' : ''); }} />
                  </div>
                </div>
                <div className="pl-4 space-y-2">
                  <div className="flex flex-row items-center mb-2">
                    <label className="w-20 font-medium text-[#233245]">VIH :</label>
                    <input name="vih" value={vihNA ? 'N/A' : form.vih} onChange={handleInputChange} className={`border border-gray-300 rounded-lg px-3 py-1 flex-1 text-md shadow-sm font-medium bg-white focus:ring-2 focus:ring-gray-300 transition-all ${vihNA ? 'bg-gray-200 text-gray-500' : 'text-gray-900'}`} disabled={vihNA}/>
                  </div>
                  <div className="flex items-center gap-4 justify-center">
                    <Checkbox label={<span className='font-medium'>-</span>} checked={form.vih === 'NEGATIVO'} onChange={() => { setField('vih', 'NEGATIVO'); setField('vihNA', false); }} disabled={vihNA}/>
                    <Checkbox label={<span className='font-medium'>+</span>} checked={form.vih === 'POSITIVO'} onChange={() => { setField('vih', 'POSITIVO'); setField('vihNA', false); }} disabled={vihNA}/>
                    <Checkbox label={<span className='font-medium'>N/A</span>} checked={vihNA} onChange={v => { setVihNA(v); setField('vihNA', v); setField('vih', v ? 'N/A' : ''); }} />
                  </div>
                </div>
              </div>
            </div>
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

function Checkbox({ label, checked, onChange, ...props }) {
  return (
    <label className="flex items-center gap-1 text-md">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="accent-blue-600" {...props} />
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
