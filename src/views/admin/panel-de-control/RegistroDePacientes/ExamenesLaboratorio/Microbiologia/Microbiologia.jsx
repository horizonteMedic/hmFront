import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <form className="w-full max-w-5xl mx-auto bg-white p-8 rounded shadow mt-4" style={{marginTop: '24px'}}>
      <div className="flex flex-wrap items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Nro Ficha:</label>
          <input name="nroFicha" value={form.nroFicha} onChange={handleInputChange} className="border rounded px-3 py-2 w-32 text-base" />
        </div>
        <button type="button" className="text-blue-700 hover:text-blue-900 flex items-center px-3 text-base">
          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
        </button>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Fecha:</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-40 text-base"
            ref={fechaRef}
            onFocus={handleFechaFocus}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Nombres:</label>
          <input name="nombres" value={form.nombres} onChange={handleInputChange} className="border rounded px-3 py-2 w-56 text-base" />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Edad:</label>
          <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-3 py-2 w-20 text-base" />
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <input type="checkbox" name="examenDirecto" checked={form.examenDirecto} onChange={handleInputChange} />
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
            className="border rounded px-3 py-2 w-full text-base"
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
            className="border rounded px-3 py-2 w-full text-base"
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
            className="border rounded px-3 py-2 w-full text-base"
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

      <div className="flex flex-wrap items-center gap-4 mb-4 justify-end">
        <div className="flex items-center gap-2 mr-8">
          <span className="font-semibold text-blue-900 text-base italic">IMPRIMIR</span>
          <input className="border rounded px-3 py-2 w-28 text-base" />
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-base">
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
        <button type="button" className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 text-base hover:bg-green-700">
          <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
        </button>
        <button type="button" className="bg-yellow-400 text-white px-6 py-2 rounded flex items-center gap-2 text-base hover:bg-yellow-500" onClick={handleLimpiar}>
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
      </div>
    </form>
  );
};

export default Microbiologia; 