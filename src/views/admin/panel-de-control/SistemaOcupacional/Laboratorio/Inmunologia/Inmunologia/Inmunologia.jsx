import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';
import inmunologia1 from '../../../../../../jaspers/inmunologialab';
import Swal from 'sweetalert2';
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE';
const pruebasList = [
  { label: 'TIFICO O' },
  { label: 'TIFICO H' },
  { label: 'PARATIFICO A' },
  { label: 'PARATIFICO B' },
  { label: 'Brucella abortus' },
];

const Inmunologia = ({token,selectedSede}) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    resultados: Array(pruebasList.length).fill('1/40'),
    hepatitis: false,
    hepatitisA: '',
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleResultadoChange = (idx, value) => {
    const updated = [...form.resultados];
    updated[idx] = value;
    setForm({ ...form, resultados: updated });
  };

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      resultados: Array(pruebasList.length).fill('1/40'),
      hepatitis: false,
      hepatitisA: '',
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handleImprimir = () => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Inmunología?',
      html: `<div style='font-size:1.1em;margin-top:8px;'>N° <b style='color:#5b6ef5;'>${form.norden}</b> - <span style='color:#1abc9c;font-weight:bold;'>${form.nombres}</span></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir',
      cancelButtonText: 'Cancelar',
      customClass: {
        title: 'swal2-title',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        inmunologia1({
          n_orden: form.norden,
          nombre: form.nombres,
          edad: form.edad,
          fecha: form.fecha,
          cbomarca: 'COVID-19',
          chkinvalido: 'NEGATIVO',
          txtvrigm: 'NEGATIVO',
          txtvrigg: 'NEGATIVO'
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">INMUNOLOGÍA</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input 
              name="norden" 
              value={form.norden} 
              onChange={handleInputChange} 
              className="border rounded px-2 py-1 flex-1"
              onKeyUp={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,'inmunologia',token,setForm,selectedSede)}} 
            />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Fecha:</label>
            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 flex-1"
              ref={fechaRef}
              onFocus={handleFechaFocus}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nombres:</label>
            <input 
              name="nombres" 
              value={form.nombres} 
              onChange={handleInputChange} 
              className="border rounded px-2 py-1 bg-gray-100"
              style={{ minWidth: '120px', maxWidth: '400px', width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px` }}
              disabled
            />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Edad:</label>
            <input 
              name="edad" 
              value={form.edad} 
              onChange={handleInputChange} 
              className="border rounded px-2 py-1 w-24 bg-gray-100" 
              disabled
            />
          </div>
        </div>

        <div className="font-bold text-base text-center mb-2">MÉTODO EN LÁMINA PORTAOBJETO</div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
          <div className="font-bold text-base">PRUEBAS</div>
          <div className="font-bold text-base">RESULTADOS</div>
          {pruebasList.map((item, idx) => (
            <React.Fragment key={item.label}>
              <div className="flex items-center text-base">{item.label}</div>
              <input
                className="border rounded px-2 py-1 w-40 text-base"
                value={form.resultados[idx]}
                onChange={e => handleResultadoChange(idx, e.target.value)}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input 
            type="checkbox" 
            name="hepatitis" 
            checked={form.hepatitis} 
            onChange={handleInputChange} 
          />
          <label className="text-base font-semibold">PRUEBA HEPATITIS</label>
          {form.hepatitis && (
            <>
              <span className="ml-4 text-base">Prueba Rápida HEPATITIS A</span>
              <input
                className="border rounded px-2 py-1 w-56 text-base ml-2"
                name="hepatitisA"
                value={form.hepatitisA}
                onChange={handleInputChange}
              />
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
          <div className="flex gap-3">
            <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors">
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors" onClick={handleLimpiar}>
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
            <div className="flex gap-1 mt-1">
              <input className="border rounded px-2 py-1 w-24" />
              <button 
                type="button" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors"
                onClick={handleImprimir}
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Inmunologia; 