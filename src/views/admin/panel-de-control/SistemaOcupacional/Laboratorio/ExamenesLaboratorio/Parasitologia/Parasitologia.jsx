import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';
import parasitologia from '../../../../../../jaspers/parasitologia';
import Swal from 'sweetalert2';
import { VerifyTR } from '../ControllerE/ControllerE';

const Parasitologia = ({token,selectedSede}) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    muestras: [
      { color: '', aspecto: '', lugol: '' },
      { color: '', aspecto: '', lugol: '' },
      { color: '', aspecto: '', lugol: '' },
    ],
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMuestraChange = (idx, field, value) => {
    const updated = [...form.muestras];
    updated[idx][field] = value;
    setForm({ ...form, muestras: updated });
  };

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      muestras: [
        { color: '', aspecto: '', lugol: '' },
        { color: '', aspecto: '', lugol: '' },
        { color: '', aspecto: '', lugol: '' },
      ],
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handleImprimir = () => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Parasitología?',
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
        parasitologia({
          norden: form.norden,
          nombre: form.nombres,
          edad: form.edad,
          fecha: form.fecha,
          muestras: form.muestras
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Parasitología</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input 
              name="norden" 
              value={form.norden} 
              onChange={handleInputChange} 
              className="border rounded px-2 py-1 flex-1" 
              onKeyUp={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,'parasitologia',token,setForm,selectedSede)}}
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

        <div className="flex flex-wrap gap-8 mb-8 justify-center">
          {[0, 1, 2].map(idx => (
            <div key={idx} className="bg-gray-50 border rounded p-4 min-w-[220px] flex-1">
              <div className="font-bold text-base mb-2 text-center">MUESTRA {idx + 1}</div>
              <div className="mb-2">
                <label className="block text-base">COLOR</label>
                <input
                  className="border rounded px-2 py-1 w-full text-base"
                  value={form.muestras[idx].color}
                  onChange={e => handleMuestraChange(idx, 'color', e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="block text-base">ASPECTO</label>
                <input
                  className="border rounded px-2 py-1 w-full text-base"
                  value={form.muestras[idx].aspecto}
                  onChange={e => handleMuestraChange(idx, 'aspecto', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-base">LUGOL</label>
                <input
                  className="border rounded px-2 py-1 w-full text-base"
                  value={form.muestras[idx].lugol}
                  onChange={e => handleMuestraChange(idx, 'lugol', e.target.value)}
                />
              </div>
            </div>
          ))}
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
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors" onClick={handleImprimir}>
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Parasitologia; 