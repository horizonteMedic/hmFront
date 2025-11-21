import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom } from '@fortawesome/free-solid-svg-icons';
import { GetInfoPacAnalisisBio, Loading, PrintHojaR, SubmitDataService, VerifyTR, GetTableAnalBio } from '../controller/ControllerABio';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { getFetch } from '../../../../getFetch/getFetch';
import Swal from 'sweetalert2';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const tabla = 'analisis_bioquimicos';

export default function AnalisisBioquimicos() {
  const { token, userlogued, selectedSede } = useSessionData();
  const today = getToday();

  const initialFormState = {
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
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
  } = useForm(initialFormState);

  const [searchParams, setSearchParams] = useState({ nombre: '', code: '' });
  const [listDoc, setListDoc] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [exams, setExams] = useState([]);
  const [searchMedico, setSearchMedico] = useState('');
  const [filteredMedicos, setFilteredMedicos] = useState([]);

  // Calcula VLDL, HDL y LDL automáticamente
  useEffect(() => {
    if (!form.colesterolTotal && !form.trigliceridos && !form.hdl && !form.vldl) {
      setForm(f => ({ ...f, hdl: '', vldl: '', ldl: '' }));
      return;
    }

    let hdl = '';
    if (form.colesterolTotal === '-') {
      hdl = '-';
    } else if (form.colesterolTotal) {
      const colesterolTotal = parseFloat(form.colesterolTotal);
      hdl = !isNaN(colesterolTotal) ? (colesterolTotal * 0.25).toFixed(1) : '';
    }

    let vldl = '';
    if (form.trigliceridos === '-') {
      vldl = '-';
    } else if (form.trigliceridos) {
      const trigliceridos = parseFloat(form.trigliceridos);
      vldl = !isNaN(trigliceridos) ? (trigliceridos / 5).toFixed(1) : '';
    }

    let ldl = '';
    if (form.colesterolTotal === '-' || vldl === '-' || hdl === '-') {
      ldl = '-';
    } else if (form.colesterolTotal && vldl && hdl) {
      const colesterolTotal = parseFloat(form.colesterolTotal);
      const vldlNum = parseFloat(vldl);
      const hdlNum = parseFloat(hdl);
      if (!isNaN(colesterolTotal) && !isNaN(vldlNum) && !isNaN(hdlNum)) {
        ldl = (colesterolTotal - vldlNum - hdlNum).toFixed(1);
      }
    }

    setForm(f => {
      if (f.vldl === vldl && f.hdl === hdl && f.ldl === ldl) return f;
      return { ...f, vldl, hdl, ldl };
    });
  }, [form.trigliceridos, form.colesterolTotal]);

  // Datos de tabla
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
          setExams([]);
        });
    }
  }, [searchParams.code, searchParams.nombre, refresh, selectedSede, token]);

  // NOMBRES DEL DOCTOR
  useEffect(() => {
    getFetch(`/api/v01/ct/laboratorio/listadoUsuariosPorPrioridadNameUser?nameUser=${userlogued}`, token)
      .then((res) => {
        setListDoc(res || []);
        if (res && res.length > 0) {
          setForm(f => ({ ...f, medico: res[0] }));
          setSearchMedico(res[0]);
        }
      })
      .catch(() => {});
  }, [userlogued, token]);

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, () => setRefresh(prev => prev + 1));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      VerifyTR(form.norden, tabla, token, setForm, selectedSede, setSearchMedico);
    }
  };

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
      Loading('Realizando Busqueda');
      const data = {
        opcion_id_p: 2,
        norden: Number(searchParams.code),
        nombres_apellidos_p: ""
      };
      GetTableAnalBio(data, selectedSede, token)
        .then((res) => {
          if (res && res.length) {
            setExams(res);
          } else {
            Swal.fire('Sin Resultado', 'No se encontraron registros', 'warning');
          }
          Swal.close();
        })
        .catch(() => {
          setExams([]);
          Swal.close();
        });
    }
  };

  const handleMedicoSearch = (e) => {
    const v = e.target.value.toUpperCase();
    setSearchMedico(v);
    setForm(d => ({ ...d, medico: v }));
    setFilteredMedicos(
      v
        ? listDoc.filter(m => m.toLowerCase().includes(v.toLowerCase()))
        : []
    );
  };

  const handleSelectMedico = (m) => {
    setSearchMedico(m);
    setForm(d => ({ ...d, medico: m }));
    setFilteredMedicos([]);
  };


  const bioquimicosFields = [
    { key: 'creatinina', label: 'Creatinina', hint: '0.8 - 1.4 mg/dl' },
    { key: 'colesterolTotal', label: 'Colesterol Total', hint: '< 200 mg/dl' },
    { key: 'trigliceridos', label: 'Triglicéridos', hint: '< 150 mg/dl' },
    { key: 'hdl', label: 'H.D.L. Colesterol', hint: '40 - 60 mg/dl' },
    { key: 'ldl', label: 'L.D.L. Colesterol', hint: '< 129 mg/dl' },
    { key: 'vldl', label: 'V.L.D.L. Colesterol', hint: '< 30 mg/dl' },
  ];

  return (
    <div className="w-full p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">ANÁLISIS BIOQUÍMICOS</h2>

      <div className="flex gap-4 w-full">
        {/* IZQUIERDA 50% */}
        <div className="w-1/2 bg-white rounded shadow p-6 space-y-6">
          <SectionFieldset legend="Tipo de Examen" className="space-y-4">
            <InputsRadioGroup
              name="examType"
              value={form.examType}
              onChange={(e, value) => setForm(prev => ({ ...prev, examType: value }))}
              options={[
                { label: 'No recibo', value: 'norecibo' },
                { label: 'Ficha Médica Ocupacional', value: 'ficha' }
              ]}
              groupClassName="gap-6"
            />
          </SectionFieldset>

          <SectionFieldset legend="Datos Generales" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputTextOneLine
                label="N° Ficha"
                name="norden"
                value={form.norden}
                onChange={handleChangeNumber}
                onKeyUp={handleSearch}
                labelWidth="120px"
                inputClassName="text-xl font-bold"
              />
              <InputTextOneLine
                label="Fecha"
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                labelWidth="120px"
              />
            </div>

            <div className="space-y-4">
              <InputTextOneLine
                label="Paciente"
                name="paciente"
                value={form.paciente}
                onChange={handleChange}
                disabled
                labelWidth="120px"
              />
              <div className="relative">
                <label className="block font-medium mb-1">Médico / Técnico:</label>
                <input
                  name="medico"
                  autoComplete='off'
                  value={searchMedico}
                  onChange={handleMedicoSearch}
                  className="border rounded px-2 py-1 w-full text-lg"
                  onKeyUp={e => {
                    if (e.key === 'Enter' && filteredMedicos.length > 0) {
                      e.preventDefault();
                      handleSelectMedico(filteredMedicos[0]);
                    }
                  }}
                  onFocus={() => {
                    if (searchMedico) {
                      setFilteredMedicos(
                        listDoc.filter(m => m.toLowerCase().includes(searchMedico.toLowerCase()))
                      );
                    }
                  }}
                  onBlur={() => setTimeout(() => setFilteredMedicos([]), 100)}
                />
                {searchMedico && filteredMedicos.length > 0 && (
                  <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
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
          </SectionFieldset>

          <SectionFieldset legend="Parámetros Bioquímicos" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {bioquimicosFields.map(({ key, label, hint }) => (
                <div key={key} className="flex flex-col gap-1">
                  <div className="flex items-center gap-4">
                    <label className="font-medium min-w-[180px] text-base">{label}:</label>
                    <InputTextOneLine
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      inputClassName="w-32"
                    />
                    <span className="text-gray-500 text-sm">(V.N. {hint})</span>
                  </div>
                  {['hdl', 'ldl', 'vldl'].includes(key) && form[key] && form[key] !== '-' && !/^-?\d*\.\d{1}$/.test(form[key]) && (
                    <span className="text-red-500 text-xs ml-[180px]">Debe tener dos decimales, ej: 9.00</span>
                  )}
                </div>
              ))}
            </div>
          </SectionFieldset>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2 text-lg"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2 text-lg"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
        </div>

        {/* DERECHA 50% */}
        <div className="w-1/2 bg-white rounded shadow p-6 flex flex-col gap-4">
          <SectionFieldset legend="Búsqueda" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="flex-1 flex items-center gap-2">
                <label className="font-medium text-base whitespace-nowrap">Buscar:</label>
                <input
                  name="nombre"
                  value={searchParams.nombre}
                  onChange={handleNombreChange}
                  className="border rounded px-2 py-1 text-base flex-1"
                  placeholder="Buscar por nombre..."
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-medium text-base whitespace-nowrap">Código:</label>
                <input
                  name="code"
                  value={searchParams.code}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setSearchParams(prev => ({ ...prev, code: value, nombre: "" }));
                    }
                  }}
                  onKeyUp={SearchCode}
                  className="border rounded px-2 py-1 text-base w-32"
                  placeholder="N° Orden"
                />
              </div>
            </div>
          </SectionFieldset>

          <SectionFieldset legend="Lista de Exámenes" className="space-y-4">
            <Table data={exams} tabla={tabla} set={setForm} token={token} clean={handleClear} setMed={setSearchMedico} />
          </SectionFieldset>
        </div>
      </div>
    </div>
  );
}

function Table({ data, tabla, set, token, clean, setMed }) {
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
        PrintHojaR(nro, token);
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
  );
}
