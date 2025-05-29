import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';
import microbiologia from '../../../../../jaspers/microbiologia';
import Swal from 'sweetalert2';

const Microbiologia = () => {
  const [form, setForm] = useState({
    nroFicha: '',
    fecha: '',
    nombres: '',
    edad: '',
    examenDirecto: false,
    bk1: '',
    bk1Radio: '',
    bk2: '',
    bk2Radio: '',
    koh: '',
    kohRadio: '',
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRadioChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleLimpiar = () => {
    setForm({
      nroFicha: '',
      fecha: '',
      nombres: '',
      edad: '',
      examenDirecto: false,
      bk1: '',
      bk1Radio: '',
      bk2: '',
      bk2Radio: '',
      koh: '',
      kohRadio: '',
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handleImprimir = () => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Microbiología?',
      html: `<div style='font-size:1.1em;margin-top:8px;'>N° <b style='color:#5b6ef5;'>${form.nroFicha}</b> - <span style='color:#1abc9c;font-weight:bold;'>${form.nombres}</span></div>`,
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
        microbiologia({
          n_orden: form.nroFicha,
          nombre: form.nombres,
          edad: form.edad,
          fecha: form.fecha,
          txtmuestra1: form.bk1,
          txtmuestra2: form.bk2
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Microbiología</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input 
              name="nroFicha" 
              value={form.nroFicha} 
              onChange={handleInputChange} 
              className="border rounded px-2 py-1 flex-1" 
            />
            <button type="button" className="ml-2 bg-gray-200 px-3 py-1 rounded border border-gray-300 flex items-center gap-1">
              <FontAwesomeIcon icon={faEdit} /> Editar
            </button>
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
              className="border rounded px-2 py-1 flex-1" 
              disabled
            />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Edad:</label>
            <input 
              name="edad" 
              value={form.edad} 
              onChange={handleInputChange} 
              className="border rounded px-2 py-1 w-24" 
              disabled
            />
          </div>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <input 
            type="checkbox" 
            name="examenDirecto" 
            checked={form.examenDirecto} 
            onChange={handleInputChange} 
          />
          <label className="text-base">EXAMEN DIRECTO</label>
        </div>

        <div className="font-bold text-base text-center mb-2">MUESTRA: ESPUTO</div>

        <div className="grid grid-cols-12 gap-y-4 gap-x-2 mb-4 items-center">
          <div className="col-span-4 font-bold text-base">PRUEBA</div>
          <div className="col-span-2 font-bold text-base">RESULTADO</div>
          <div className="col-span-6"></div>
          {/* BK 1 */}
          <div className="col-span-4 flex items-center text-base">Examen de BK - BACILOSCOPIA 1ª Muestra :</div>
          <div className="col-span-2">
            <input
              className="border rounded px-2 py-1 w-full text-base"
              name="bk1"
              value={form.bk1}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-6 flex gap-6 items-center">
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="bk1Radio"
                checked={form.bk1Radio === 'NEGATIVO'}
                onChange={() => handleRadioChange('bk1Radio', 'NEGATIVO')}
              />
              BAAR - NEGATIVO
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="bk1Radio"
                checked={form.bk1Radio === 'POSITIVO'}
                onChange={() => handleRadioChange('bk1Radio', 'POSITIVO')}
              />
              BAAR - POSITIVO
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="bk1Radio"
                checked={form.bk1Radio === 'NA'}
                onChange={() => handleRadioChange('bk1Radio', 'NA')}
              />
              N/A
            </label>
          </div>
          {/* BK 2 */}
          <div className="col-span-4 flex items-center text-base">Examen de BK - BACILOSCOPIA 2ª Muestra :</div>
          <div className="col-span-2">
            <input
              className="border rounded px-2 py-1 w-full text-base"
              name="bk2"
              value={form.bk2}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-6 flex gap-6 items-center">
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="bk2Radio"
                checked={form.bk2Radio === 'NEGATIVO'}
                onChange={() => handleRadioChange('bk2Radio', 'NEGATIVO')}
              />
              BAAR - NEGATIVO
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="bk2Radio"
                checked={form.bk2Radio === 'POSITIVO'}
                onChange={() => handleRadioChange('bk2Radio', 'POSITIVO')}
              />
              BAAR - POSITIVO
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="bk2Radio"
                checked={form.bk2Radio === 'NA'}
                onChange={() => handleRadioChange('bk2Radio', 'NA')}
              />
              N/A
            </label>
          </div>
          {/* KOH */}
          <div className="col-span-4 flex items-center text-base">KOH :</div>
          <div className="col-span-2">
            <input
              className="border rounded px-2 py-1 w-full text-base"
              name="koh"
              value={form.koh}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-6 flex gap-6 items-center">
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="kohRadio"
                checked={form.kohRadio === 'POSITIVO'}
                onChange={() => handleRadioChange('kohRadio', 'POSITIVO')}
              />
              POSITIVO
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="kohRadio"
                checked={form.kohRadio === 'NEGATIVO'}
                onChange={() => handleRadioChange('kohRadio', 'NEGATIVO')}
              />
              NEGATIVO
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
          <div className="flex gap-3">
            <button type="button" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold">
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold" onClick={handleLimpiar}>
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
            <div className="flex gap-1 mt-1">
              <input className="border rounded px-2 py-1 w-24" />
              <button type="button" className="bg-gray-200 px-2 py-1 rounded border border-gray-300 hover:bg-gray-300" onClick={handleImprimir}>
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Microbiologia; 