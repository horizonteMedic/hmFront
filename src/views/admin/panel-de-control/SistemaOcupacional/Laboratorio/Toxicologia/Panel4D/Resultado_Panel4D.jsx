import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitPanel4D, VerifyTR } from './controller4D';
import Swal from 'sweetalert2';

const Resultado_Panel4D = ({ token, selectedSede, userlogued }) => {
  const tabla = 'toxicologia'
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    valueC: 'NEGATIVO',
    valueM: 'NEGATIVO',
    valueO: 'NEGATIVO',
    valueMet: 'NEGATIVO',
  });

  // Refs para navegación
  const fechaRef = useRef(null);
  const valueCRef = useRef(null);
  const valueMRef = useRef(null);
  const valueORef = useRef(null);
  const valueMetRef = useRef(null);
  const printRef = useRef(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value.toUpperCase() }));
  };

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      valueC: 'NEGATIVO',
      valueM: 'NEGATIVO',
      valueO: 'NEGATIVO',
      valueMet: 'NEGATIVO',
    });
  };

  const handleSeat = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      valueC: 'NEGATIVO',
      valueM: 'NEGATIVO',
      valueO: 'NEGATIVO',
      valueMet: 'NEGATIVO',
    }));
  };

  const handleFechaFocus = e => {
    e.target.showPicker?.();
  };

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Panel 4D?',
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
        PrintHojaR(form.norden,tabla,token);
      }
    });
  };

  const nameWidth = Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10));

  return (
    <form className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">PANEL DROGAS 4D</h2>

      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Nro Ficha:</label>
          <input
            name="norden"
            value={form.norden}
            onKeyUp={(event) => {
              if(event.key === 'Enter') {
                handleSeat()
                VerifyTR(form.norden, tabla, token, setForm, selectedSede);
              }
            }}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Fecha:</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-40"
            ref={fechaRef}
            onFocus={handleFechaFocus}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueCRef.current?.focus();
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Nombres:</label>
          <input
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            disabled
            style={{ width: nameWidth }}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Edad:</label>
          <input
            name="edad"
            value={form.edad}
            onChange={handleChange}
            disabled
            className="border rounded px-3 py-2 w-20"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-8">
        <div className="font-bold">PRUEBA CUALITATIVO</div>
        <div className="font-bold"> </div>
        <div className="font-bold">RESULTADOS</div>
        
        <div className="flex items-center">COCAÍNA (COC)</div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.valueC === 'POSITIVO'} onChange={() => setForm(f => ({...f, valueC: 'POSITIVO'}))} /> Positivo
          </label>
          <label className="flex items-center gap-1" style={{ marginLeft: '24px' }}>
            <input type="checkbox" checked={form.valueC === 'NEGATIVO'} onChange={() => setForm(f => ({...f, valueC: 'NEGATIVO'}))} /> Negativo
          </label>
        </div>
        <input
          name='valueC'
          className="border rounded px-3 py-2 w-32"
          value={form.valueC}
          onChange={handleChange}
          ref={valueCRef}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              valueMRef.current?.focus();
            }
          }}
        />
        
        <div className="flex items-center">MARIHUANA (THC)</div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.valueM === 'POSITIVO'} onChange={() => setForm(f => ({...f, valueM: 'POSITIVO'}))} /> Positivo
          </label>
          <label className="flex items-center gap-1" style={{ marginLeft: '24px' }}>
            <input type="checkbox" checked={form.valueM === 'NEGATIVO'} onChange={() => setForm(f => ({...f, valueM: 'NEGATIVO'}))} /> Negativo
          </label>
        </div>
        <input
          name='valueM'
          className="border rounded px-3 py-2 w-32"
          value={form.valueM}
          onChange={handleChange}
          ref={valueMRef}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              valueORef.current?.focus();
            }
          }}
        />
        
        <div className="flex items-center">OPIÁCEOS</div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.valueO === 'POSITIVO'} onChange={() => setForm(f => ({...f, valueO: 'POSITIVO'}))} /> Positivo
          </label>
          <label className="flex items-center gap-1" style={{ marginLeft: '24px' }}>
            <input type="checkbox" checked={form.valueO === 'NEGATIVO'} onChange={() => setForm(f => ({...f, valueO: 'NEGATIVO'}))} /> Negativo
          </label>
        </div>
        <input
          name='valueO'
          className="border rounded px-3 py-2 w-32"
          value={form.valueO}
          onChange={handleChange}
          ref={valueORef}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              valueMetRef.current?.focus();
            }
          }}
        />
        
        <div className="flex items-center">METHANFETAMINAS</div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.valueMet === 'POSITIVO'} onChange={() => setForm(f => ({...f, valueMet: 'POSITIVO'}))} /> Positivo
          </label>
          <label className="flex items-center gap-1" style={{ marginLeft: '24px' }}>
            <input type="checkbox" checked={form.valueMet === 'NEGATIVO'} onChange={() => setForm(f => ({...f, valueMet: 'NEGATIVO'}))} /> Negativo
          </label>
        </div>
        <input
          name='valueMet'
          className="border rounded px-3 py-2 w-32"
          value={form.valueMet}
          onChange={handleChange}
          ref={valueMetRef}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              printRef.current?.focus();
            }
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2 mr-8">
          <span className="font-semibold text-blue-900 italic">IMPRIMIR</span>
          <input 
            className="border rounded px-3 py-2 w-28" 
            name='norden' 
            value={form.norden} 
            onChange={handleChange}
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
          onClick={() => {SubmitPanel4D(form,userlogued,token,handleLimpiar,tabla)}}
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

export default Resultado_Panel4D;
