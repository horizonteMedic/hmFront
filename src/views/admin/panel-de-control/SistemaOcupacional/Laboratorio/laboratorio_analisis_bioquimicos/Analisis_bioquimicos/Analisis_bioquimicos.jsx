// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/Analisis_bioquimicos/Analisis_bioquimicos.jsx
import React, { useReducer, useState, useEffect, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faBroom, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons'
import microscopioImg from '../microscopio.webp'
import { GetInfoPacAnalisisBio, Loading, PrintHojaR, SubmitAnalsisiBio, VerifyTR } from '../controller/ControllerABio'
import { GetTableAnalBio } from '../model/model'
import { getFetch } from '../../../../getFetch/getFetch'
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function AnalisisBioquimicos({ token, selectedSede, userlogued }) {
  const tabla = 'analisis_bioquimicos'
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
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
  const [startDate, setStartDate] = useState(new Date());
  const [pacientesCompletados, setPacientesCompletados] = useState(0);
  const [pacientesFaltantes, setPacientesFaltantes] = useState(0);

  // Calcula VLDL, HDL y LDL automáticamente
  useEffect(() => {
    // Si todos los campos base están vacíos, limpiar LDL, HDL y VLDL
    if (
      !form.colesterolTotal && !form.trigliceridos && !form.hdl && !form.vldl
    ) {
      setForm(f => ({ ...f, hdl: '', vldl: '', ldl: '' }));
      return;
    }

    // HDL depende solo de colesterolTotal
    let hdl = '';
    if (form.colesterolTotal === '-') {
      hdl = '-';
    } else if (form.colesterolTotal) {
      const colesterolTotal = parseFloat(form.colesterolTotal);
      hdl = !isNaN(colesterolTotal) ? (colesterolTotal * 0.25).toFixed(2) : '';
    }

    // VLDL depende solo de trigliceridos
    let vldl = '';
    if (form.trigliceridos === '-') {
      vldl = '-';
    } else if (form.trigliceridos) {
      const trigliceridos = parseFloat(form.trigliceridos);
      vldl = !isNaN(trigliceridos) ? (trigliceridos / 5).toFixed(2) : '';
    }

    // LDL depende de colesterolTotal, vldl y hdl
    let ldl = '';
    if (
      form.colesterolTotal === '-' ||
      vldl === '-' ||
      hdl === '-'
    ) {
      ldl = '-';
    } else if (form.colesterolTotal && vldl && hdl) {
      const colesterolTotal = parseFloat(form.colesterolTotal);
      const vldlNum = parseFloat(vldl);
      const hdlNum = parseFloat(hdl);
      if (!isNaN(colesterolTotal) && !isNaN(vldlNum) && !isNaN(hdlNum)) {
        ldl = (colesterolTotal - vldlNum - hdlNum).toFixed(2);
      }
    }

    setForm(f => {
      if (f.vldl === vldl && f.hdl === hdl && f.ldl === ldl) return f;
      return { ...f, vldl, hdl, ldl };
    });
  }, [form.trigliceridos, form.colesterolTotal]);

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
          setExams(res || []);
        })
        .catch(() => {
          console.log("ocurrió un error");
          setExams([]);
        });
    }
  }, [searchParams.code, searchParams.nombre, refresh]);

  useEffect(() => {
    if (exams && exams.length > 0) {
      const completados = exams.filter(e => e.color === 'VERDE').length;
      setPacientesCompletados(completados);
      setPacientesFaltantes(exams.length - completados);
    } else {
      setPacientesCompletados(0);
      setPacientesFaltantes(0);
    }
  }, [exams]);

  //NOMBRES DEL DOCTOR
  useEffect(() => {
    getFetch(`/api/v01/ct/laboratorio/listadoUsuariosPorPrioridadNameUser?nameUser=${userlogued}`,token)
      .then((res) => {
        setListDoc(res)
        setForm(f => ({ ...f, medico: res[0] }))
        setSearchMedico(res[0])
      })
      .catch(() => {});
  },[])

  // placeholder: fetch exams when searchParams change
  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleClear = () => {
    setForm({
      examType: 'ficha', norden: '', paciente: '', fecha: today,
      creatinina: '', colesterolTotal: '', ldl: '', hdl: '', vldl: '', trigliceridos: ''
    })
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
            setExams(res || []);
          })
          .catch(() => setExams([]));
      } else {
        setExams([]);
      }
    }, 400);
  };

  const SearchCode = (event) => {
    if (event.key === 'Enter') {
      if (searchParams.code === "" && searchParams.nombre === "") return;
      Loading('Realizando Busqueda')
      const data = {
        opcion_id_p: 2,
        norden: Number(searchParams.code),
        nombres_apellidos_p: ""
      }
      GetTableAnalBio(data, selectedSede, token)
        .then((res) => {
          if (res && res.length) {
            setExams(res);
          } else {
            Swal.fire('Sin Resultado','No se encontraron registros','warning')
          }
          Swal.close();
        })
        .catch(() => {
          setExams([])
          Swal.close();
        });
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

  const RefreshTable = () => {
    setRefresh(refresh +1)
  }

  // refs para inputs de parámetros bioquímicos
  const bioRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  return (
    <div className="w-full p-4 space-y-6">
      <h2 className="text-4xl font-bold text-center">Análisis Bioquímicos</h2>

      <div className="flex gap-2 w-full bg-gray-50 p-2">
        {/* IZQUIERDA 50% */}
        <div className="w-1/2 bg-white rounded shadow p-4 space-y-6">
          {/* Tipo de Examen */}
          <Section title="Tipo de Examen">
            <div className="flex items-center gap-6 text-lg">
              <Radio
                label="No recibo"
                name="examType"
                value="norecibo"
                checked={form.examType === 'norecibo'}
                onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}
              />
              <Radio
                label="Ficha Médica Ocupacional"
                name="examType"
                value="ficha"
                checked={form.examType === 'ficha'}
                onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}
              />
            </div>
          </Section>

          {/* Datos Generales */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1 font-medium text-lg">
              N° Ficha:
              <input
                name="norden"
                value={form.norden}
                autoComplete='off'
                onKeyUp={(event) => {if(event.key === 'Enter') VerifyTR(form.norden, tabla, token, setForm, selectedSede, setSearchMedico)}}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 w-24 ml-1 text-xl font-bold"
              />
            </label>
            <label className="flex-1 flex items-center gap-1 font-medium text-lg relative">
              Médico / Técnico:
              <input
                name="medico"
                autoComplete='off'
                value={searchMedico}
                onChange={handleMedicoSearch}
                className="border rounded px-2 py-1 flex-1 ml-1 text-lg"
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
            </label>
            <img src={microscopioImg} alt="Microscopio" className="w-32" />
          </div>

          {/* Paciente y Fecha */}
          <div className="flex items-center gap-4">
            <label className="flex-1 flex items-center gap-1 font-medium text-lg">
              Paciente:
              <input
                name="paciente"
                value={form.paciente}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 flex-1 ml-1 text-lg"
                disabled
              />
            </label>
            <label className="flex items-center gap-1 font-medium text-lg">
              Fecha:
              <input
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 w-40 ml-1 text-lg"
              />
            </label>
          </div>

          {/* Parámetros Bioquímicos */}
          <Section>
            {[
              { key: 'creatinina',      label: 'Creatinina',        hint: '0.8 - 1.4 mg/dl' },
              { key: 'colesterolTotal', label: 'Colesterol Total',  hint: '< 200 mg/dl' },
              { key: 'trigliceridos',   label: 'Triglicéridos',    hint: '< 150 mg/dl' },
              { key: 'hdl',             label: 'H.D.L. Colesterol', hint: '40 - 60 mg/dl' },
              { key: 'ldl',             label: 'L.D.L. Colesterol', hint: '< 129 mg/dl' },
              { key: 'vldl',            label: 'V.L.D.L. Colesterol',hint: '< 30 mg/dl' },
            ].map(({ key, label, hint }, idx, arr) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <span className="font-medium min-w-[150px] text-lg">{label}:</span>
                  <input
                    className="border rounded px-2 py-1 w-32 text-lg"
                    name={key}
                    value={form[key]}
                    onChange={handleFormChange}
                    ref={bioRefs[idx]}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (idx < arr.length - 1) {
                          bioRefs[idx + 1].current && bioRefs[idx + 1].current.focus();
                        }
                      }
                    }}
                  />
                  <span className="text-gray-500 text-lg">(V.N. {hint})</span>
                </div>
                {/* Validación visual para dos decimales */}
                {['hdl','ldl','vldl'].includes(key) && form[key] && form[key] !== '-' && !/^-?\d*\.\d{2}$/.test(form[key]) && (
                  <span className="text-red-500 text-xs ml-[150px]">Debe tener dos decimales, ej: 9.00</span>
                )}
              </div>
            ))}
          </Section>

          {/* Acciones */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <ActionButton onClick={() => {SubmitAnalsisiBio(form,userlogued,token,handleClear,tabla,RefreshTable)}} color="green" icon={faSave}>Guardar/Actualizar</ActionButton>
            <ActionButton onClick={handleClear} color="yellow" icon={faBroom}>Limpiar</ActionButton>
          </div>
        </div>

        {/* DERECHA 50% */}
        <div className="w-1/2 bg-white rounded shadow p-4 flex flex-col gap-4">
          {/* Agrupar Buscar y Código en la misma línea */}
          <div className="flex gap-2 items-center w-full max-w-full">
            <span className="font-medium text-lg">Buscar:</span>
            <input
              name="nombre"
              value={searchParams.nombre}
              onChange={handleNombreChange}
              className="border rounded px-2 py-1 text-lg flex-1 min-w-0"
              style={{ maxWidth: 400 }}
            />
            <button onClick={() => Swal.fire('Buscar', JSON.stringify(searchParams), 'info')} className="p-2 bg-gray-200 rounded ml-1">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <span className="font-medium text-lg ml-2">Código:</span>
            <input
              name="code"
            value={searchParams.code}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\\d{0,7}$/.test(value)) {
                  setSearchParams(prev => ({...prev, code: value, nombre: ""}))
                }
              }}
              onKeyUp={(event) => {SearchCode(event)}}
              className="border rounded px-2 py-1 text-lg"
              style={{ width: 120 }}
            />
          </div>
         
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
        className={`border rounded px-2 py-1 ${disabled ? 'bg-gray-100' : ''}`} />
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

function Table({ data, tabla, set, token, clean, setMed }) {
  // confirmación antes de imprimir
  const handlePrintConfirm = (nro) => {
    Swal.fire({
      title: 'Confirmar impresión',
      text: `¿Deseas imprimir la ficha Nº ${nro}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, imprimir',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(nro, tabla, token);
      }
    });
  };

  function clicktable(nro) {
    clean();
    Loading('Importando Datos');
    GetInfoPacAnalisisBio(nro, tabla, set, token, setMed);
  }

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(12 * 4rem)' }}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left text-lg">N° Orden</th>
            <th className="border px-2 py-1 text-left text-lg">Nombres</th>
            <th className="border px-2 py-1 text-left text-lg">Fecha Apertura</th>
            <th className="border px-2 py-1 text-left text-lg">Examen</th>
            <th className="border px-2 py-1 text-left text-lg">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className={`hover:bg-gray-50 cursor-pointer text-lg ${row.color === 'AMARILLO' ? 'bg-[#ffff00]' : row.color === 'VERDE' ? 'bg-[#00ff00]' : 'bg-[#ff6767]'}`}
                onClick={() => clicktable(row.n_orden)}
                onContextMenu={(e) => { e.preventDefault(); handlePrintConfirm(row.n_orden); }}
              >
                <td className="border px-2 py-1 font-bold">{row.n_orden}</td>
                <td className="border px-2 py-1">{row.nombres}</td>
                <td className="border px-2 py-1">{row.fecha_apertura_po}</td>
                <td className="border px-2 py-1">{row.nom_examen}</td>
                <td className="border px-2 py-1">{row.estado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500 text-lg">
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
      {title && <h3 className="font-semibold text-blue-700 text-xl">{title}</h3>}
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
      className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2 text-lg`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  )
}
