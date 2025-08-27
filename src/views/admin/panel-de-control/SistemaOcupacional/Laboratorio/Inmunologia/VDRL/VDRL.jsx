import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitVDRLLab, VerifyTR } from './controller';
import Swal from 'sweetalert2';

const VDRL = ({ token, selectedSede, userlogued }) => {
  const tabla = 'inmunologia';
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    muestra: 'SUERO',
    examen: 'VDRL',
    metodo: 'Aglutinación de lípidos complejos',
    resultado: 'NO REACTIVO',
    medico: ''
  });

  // Refs para navegación
  const fechaRef = useRef(null);
  const resultadoRef = useRef(null);
  const medicoRef = useRef(null);
  const printRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleResultadoChange = (newValue) => {
    setForm(prev => ({ ...prev, resultado: newValue }));
  };

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      muestra: 'SUERO',
      examen: 'VDRL',
      metodo: 'Aglutinación de lípidos complejos',
      resultado: 'NO REACTIVO',
      medico: ''
    });
  };

  const handleSeat = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      muestra: 'SUERO',
      examen: 'VDRL',
      metodo: 'Aglutinación de lípidos complejos',
      resultado: 'NO REACTIVO',
      medico: ''
    }));
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir VDRL?',
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
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
        PrintHojaR(form.norden, tabla, token);
      }
    });
  };

  const nameWidth = Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10));

  return (
    <form className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center underline">INMUNOLOGÍA</h2>

      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Nro Ficha:</label>
          <input
            name="norden"
            value={form.norden}
            onKeyUp={(event) => {
              if(event.key === 'Enter') {
                handleSeat();
                VerifyTR(form.norden, tabla, token, setForm, selectedSede);
              }
            }}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Fecha:</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-40"
            ref={fechaRef}
            onFocus={handleFechaFocus}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                resultadoRef.current?.focus();
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Nombres:</label>
          <input
            name="nombres"
            value={form.nombres}
            onChange={handleInputChange}
            disabled
            style={{ width: nameWidth }}
            className="border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Edad:</label>
          <input
            name="edad"
            value={form.edad}
            onChange={handleInputChange}
            disabled
            className="border rounded px-3 py-2 w-20 bg-gray-100"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold">MUESTRA:</label>
            <input
              name="muestra"
              value={form.muestra}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-32 bg-gray-100"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">EXAMEN SOLICITADO:</label>
            <input
              name="examen"
              value={form.examen}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-32 bg-gray-100"
              disabled
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-300 mb-6" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
        <div className="font-bold text-lg">EXAMEN</div>
        <div className="font-bold text-lg">RESULTADO</div>
        
        <div className="text-base">
          {form.examen} (Método: {form.metodo})
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="resultado"
                checked={form.resultado === 'REACTIVO'}
                onChange={() => handleResultadoChange('REACTIVO')}
              />
              REACTIVO
            </label>
            <label className="flex items-center gap-1 ml-4">
              <input
                type="radio"
                name="resultado"
                checked={form.resultado === 'NO REACTIVO'}
                onChange={() => handleResultadoChange('NO REACTIVO')}
              />
              NO REACTIVO
            </label>
          </div>
          <input
            name="resultado"
            value={form.resultado}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-40"
            ref={resultadoRef}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                medicoRef.current?.focus();
              }
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Médico:</label>
          <input
            name="medico"
            value={form.medico}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-64"
            ref={medicoRef}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                printRef.current?.focus();
              }
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2 mr-8">
          <span className="font-semibold text-blue-900 italic">IMPRIMIR</span>
          <input 
            className="border rounded px-3 py-2 w-28" 
            name="norden" 
            value={form.norden} 
            onChange={handleInputChange}
            ref={printRef}
          />
          <button
            type="button"
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {SubmitVDRLLab(form, userlogued, token, handleLimpiar, tabla)}}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faSave} /> Guardar
        </button>
        <button
          type="button"
          onClick={handleLimpiar}
          className="bg-yellow-400 text-white px-6 py-2 rounded hover:bg-yellow-500"
        >
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
      </div>
    </form>
  );
};

export default VDRL;
