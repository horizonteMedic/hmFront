// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Analisis_bioquimicos.jsx
import React, { useReducer, useState, useEffect, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons'
import microscopioImg from '../microscopio.webp'
import { GetInfoPacAnalisisBio, Loading, PrintHojaR, SubmitAnalsisiBio, VerifyTR } from '../controller/ControllerABio'
import { GetTableAnalBio } from './model'
import { getFetch } from '../../../../getFetch/getFetch'
import Swal from 'sweetalert2'
export default function AnalisisBioquimicos({ token, selectedSede, userlogued }) {
  const tabla = 'analisis_bioquimicos'
  const today = new Date().toISOString().split("T")[0];
  
  const [form, setForm] = useState({
    examType: 'ficha',
    norden: '',
    medico: '',
    paciente: '',
    fecha: today,
    creatinina: '',
    colesterolTotal: '',
    ldl: '',
    hdl: '',
    vldl: '',
    trigliceridos: ''
  })
  const [searchParams, setSearchParams] = useState({ nombre: '', code: '' })
  const [listDoc, setListDoc] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [exams, setExams] = useState([])

  //Datos de tabla
  useEffect(() => {
    if (searchParams.code === "" && searchParams.nombre === "") {
      const data = {
        opcion_id_p: 1,
        norden_p: 0,
        nombres_apellidos_p: ""
      };
      GetTableAnalBio(data, selectedSede, token)
        .then((res) => {
          if (res) {
            setExams(res);
          } else {
            setExams([]);
          }
        })
        .catch(() => {
          console.log("ocurrió un error");
        });
    }
  }, [searchParams.code, searchParams.nombre, refresh]);

  //NOMBRES DEL DOCTOR
  useEffect(() => {
    getFetch(`/api/v01/ct/laboratorio/listadoUsuariosPorPrioridadNameUser?nameUser=${userlogued}`,token)
    .then((res) => {
      setListDoc(res)
      setForm(f => ({ ...f, medico: res[0] }))
      setSearchMedico(res[0])
    })
  },[])

  // placeholder: fetch exams when searchParams change
  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

 
  const handleClear = () => {
    setForm({
    examType: 'ficha', norden: '', medico: '', paciente: '', fecha: today,
    creatinina: '', colesterolTotal: '', ldl: '', hdl: '', vldl: '', trigliceridos: ''
    })
    setSearchMedico("")
}

  // Debounce para evitar demasiadas llamadas
  const debounceTimeout = useRef(null);
  const handleNombreChange = (e) => {
      const value = e.target.value.toUpperCase();
      setSearchParams(prev => ({ ...prev, nombre: value, code: "" }));
  
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  
      debounceTimeout.current = setTimeout(() => {
        if (value.trim() !== "") {
          const data = {
            opcion_id_p: 3,
            norden: "",
            nombres_apellidos_p: value
          };
          GetTableAnalBio(data, selectedSede, token)
          .then((res) => {
            if (res) {
              setExams(res);
            } else {
              setExams([]);
            }
          })
          .catch(() => setExams([]));
        } else {
          setExams([]);
        }
      }, 400);
    };
  
  const SearchCode = (event) => {
    if (event.key === 'Enter') {
      if (searchParams.code === "" && searchParams.nombre === "") {
        return;
      }
      Loading('Realizando Busqueda')
      const data = {
        opcion_id_p: 2,
        norden: Number(searchParams.code),
        nombres_apellidos_p: ""
      }
      GetTableAnalBio(data, selectedSede, token)
      .then((res) => {
        if (res) {
          if (res.length) {
            setExams(res); // Solo si tiene elementos
          } else {
            Swal.fire('Sin Resultado','No se encontraron registros','warning')
          }
        } else {
          setExams([])
        }
        Swal.close();
      })
    }
  }

  //AUTOCOMPLETAR DEL DOC
  const [searchMedico, setSearchMedico]  = useState(form.medico);
  const [filteredMedicos, setFilteredMedicos] = useState([]);

  const handleMedicoSearch = e => {
    const v = e.target.value.toUpperCase();
    setSearchMedico(v);
    setForm(d => ({...d, medico: v}))
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
    setForm(d => ({ ...d, medico: m }));
    setFilteredMedicos([]);
  };

  return (
    <div className="w-full p-4 space-y-6">
      <h2 className="text-3xl font-bold text-center">Análisis Bioquímicos</h2>

      <div className="flex gap-2 w-full bg-gray-50 p-2">
        {/* IZQUIERDA 60% */}
        <div className="w-3/5 bg-white rounded shadow p-4 space-y-6">
          {/* Tipo de Examen */}
          <Section title="Tipo de Examen">
            <div className="flex items-center gap-6">
              <Radio
                label="No recibo"
                name="examType"
                value="norecibo"
                checked={form.examType === 'norecibo'}
                onChange={e => setField('examType', e.target.value)}
              />
              <Radio
                label="Ficha Médica Ocupacional"
                name="examType"
                value="ficha"
                checked={form.examType === 'ficha'}
                onChange={e => setField('examType', e.target.value)}
              />

            </div>
          </Section>

          {/* Datos Generales */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1 font-medium">
              N° Ficha:
              <input
                name="norden"
                value={form.norden}
                autoComplete='off'
                onKeyUp={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,tabla,token,setForm,selectedSede,setSearchMedico)}}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 w-20 ml-1"
              />
            </label>
            <label className="flex-1 flex items-center gap-1 font-medium relative">
              Médico / Técnico:
              <input
                name="medico"
                autoComplete='off'
                value={searchMedico}
                onChange={handleMedicoSearch}
                className="border rounded px-2 py-1 flex-1 ml-1"
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
                      key={m.id}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      onMouseDown={() => handleSelectMedico(m)}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </label>
            <img src={microscopioImg} alt="Microscopio" className="w-32" />
          </div>

          {/* Paciente y Fecha */}
          <div className="flex items-center gap-4">
            <label className="flex-1 flex items-center gap-1 font-medium">
              Paciente:
              <input
                name="paciente"
                value={form.paciente}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 flex-1 ml-1"
              />
            </label>
            <label className="flex items-center gap-1 font-medium">
              Fecha:
              <input
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 w-36 ml-1"
              />
            </label>
          </div>

          {/* Parámetros Bioquímicos */}
          <Section>
            {[
              { key: 'creatinina',     label: 'Creatinina',     hint: '0.8 - 1.4 mg/dl' },
              { key: 'colesterolTotal',label: 'Colesterol Total',hint: '< 200 mg/dl' },
              { key: 'ldl',            label: 'L.D.L Colesterol',hint: '< 129 mg/dl' },
              { key: 'hdl',            label: 'H.D.L Colesterol',hint: '40 - 60 mg/dl' },
              { key: 'vldl',           label: 'V.L.D.L Colesterol',hint: '< 30 mg/dl' },
              { key: 'trigliceridos',  label: 'Triglicéridos',   hint: '< 150 mg/dl' }
            ].map(({ key, label, hint }) => (
              <div key={key} className="flex items-center gap-4">
                <span className="font-medium min-w-[150px]">{label}:</span>
                <input
                  className="border rounded px-2 py-1 w-32"
                  name={key}
                  value={form[key]}
                  onChange={handleFormChange}
                />
                <span className="text-gray-500">(V.N. {hint})</span>
              </div>
            ))}
          </Section>

          {/* Acciones */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <ActionButton onClick={() => {SubmitAnalsisiBio(form,userlogued,token,handleClear,tabla)}} color="green" icon={faSave}>Guardar/Actualizar</ActionButton>
            <ActionButton onClick={handleClear} color="yellow" icon={faBroom}>Limpiar</ActionButton>
          </div>
        </div>

        {/* DERECHA 40% */}
        <div className="w-2/5 bg-white rounded shadow p-4 flex flex-col gap-4">
          <SearchField
            label="Buscar"
            name="nombre"
            value={searchParams.nombre}
            onChange={handleNombreChange}
            onSearch={() => Swal.fire('Buscar', JSON.stringify(searchParams), 'info')}
          />
          <SearchField
            label="Código"
            name="code"
            value={searchParams.code}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,7}$/.test(value)) { // máximo 7 dígitos numéricos
                setSearchParams(prev => ({
                  ...prev,
                  code: value,
                  nombre: ""
                }));
              }
            }}
            onKeyUp={(event) => {SearchCode(event)}}
          />
          <Table data={exams} tabla={tabla} set={setForm} token={token} clean={handleClear} setMed={setSearchMedico} />
        </div>
      </div>

      
    </div>
  )
}

// Aux components
function Field({ label, name, type = 'text', value, onChange, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`}
      />
    </div>
  )
}

function Radio({ label, ...props }) {
  return (
    <label className="flex items-center gap-1">
      <input type="radio" {...props} className="form-radio" />
      {label}
    </label>
  )
}

function SearchField({ label, name, value, onChange, onSearch, onKeyUp }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{label}:</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-2 py-1 flex-1"
        onKeyUp={onKeyUp}
      />
      {onSearch && (
        <button onClick={onSearch} className="p-2 bg-gray-200 rounded">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      )}
    </div>
  )
}

function Table({ data, tabla, set, token,clean,setMed }) {

  function clicktable(nro) {
    clean()
    Loading('Importando Datos')
    GetInfoPacAnalisisBio(nro,tabla,set,token,setMed)
  }

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(12 * 4rem)' }}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">N° Orden</th>
            <th className="border px-2 py-1 text-left">Nombres</th>
            <th className="border px-2 py-1 text-left">Fecha Apertura</th>
            <th className="border px-2 py-1 text-left">Examen</th>
            <th className="border px-2 py-1 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className={`hover:bg-gray-50 cursor-pointer ${row.color === 'AMARILLO' ? 'bg-[#ffff00]' : row.color === 'VERDE' ? 'bg-[#00ff00]' : 'bg-[#ff6767]'}`} 
              onClick={() => {clicktable(row.n_orden)}} onContextMenu={(e) => {e.preventDefault(),PrintHojaR(row.n_orden,tabla,token)}} >
                <td className="border px-2 py-1">{row.n_orden}</td>
                <td className="border px-2 py-1">{row.nombres}</td>
                <td className="border px-2 py-1">{row.fecha_apertura_po}</td>
                <td className="border px-2 py-1">{row.nom_examen}</td>
                <td className="border px-2 py-1">{row.estado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      {title && <h3 className="font-semibold text-blue-700">{title}</h3>}
      {children}
    </div>
  )
}

function ActionButton({ color, icon, onClick, children }) {
  const bg = {
    green:  'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    blue:   'bg-blue-600 hover:bg-blue-700'
  }[color]
  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
