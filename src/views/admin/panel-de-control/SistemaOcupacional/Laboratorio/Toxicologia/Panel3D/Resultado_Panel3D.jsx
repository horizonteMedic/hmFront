// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Toxicologia/Panel3D/Resultado_Panel3D.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitPanel3D, VerifyTR } from './controller3D';
import Swal from 'sweetalert2';

const Resultado_Panel3D = ({ token, selectedSede, userlogued }) => {
  const tabla = 'panel3d'
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    valueM: 'NEGATIVO',
    valueC: 'NEGATIVO',
    valueE: 'NEGATIVO',
    metodo: 'INMUNOCROMATOGRAFICO',
  });

  // Refs para navegación
  const fechaRef = useRef(null);
  const valueCRef = useRef(null);
  const valueMRef = useRef(null);
  const valueERef = useRef(null);
  const printRef = useRef(null);

  const handleChange = ({ name, value }) =>
    setForm(f => ({ ...f, [name]: value.toUpperCase() }));

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      valueM: 'NEGATIVO',
      valueC: 'NEGATIVO',
      valueE: 'NEGATIVO',
      metodo: 'INMUNOCROMATOGRAFICO',
    });
  };

  const handleSeat = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      valueM: 'NEGATIVO',
      valueC: 'NEGATIVO',
      valueE: 'NEGATIVO',
      metodo: 'METODO: INMUNOCROMATOGRAFICO',
    }));
  };

  const handleFechaFocus = e => e.target.showPicker?.();

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Panel 3D?',
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
      <h2 className="text-2xl font-bold mb-6 text-center">PANEL 3D</h2>

      {/* Cabecera */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Nro Ficha:</label>
          <input
            name="norden"
            value={form.norden}
            onChange={e => handleChange(e.target)}
            onKeyUp={(event) => {
              if(event.key === 'Enter') {
                handleSeat()
                VerifyTR(form.norden, tabla, token, setForm, selectedSede);
              }
            }}
            className="border rounded px-3 py-2 w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Fecha:</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={e => handleChange(e.target)}
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
            onChange={e => handleChange(e.target)}
            style={{ width: nameWidth }}
            disabled
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Edad:</label>
          <input
            name="edad"
            value={form.edad}
            onChange={e => handleChange(e.target)}
            disabled
            className="border rounded px-3 py-2 w-20"
          />
        </div>
      </div>

      {/* Método */}
      <div className="mb-4">
        <div className="font-semibold">PRUEBA RÁPIDA CUALITATIVA</div>
        <input
          className="border rounded px-3 py-2 w-full mt-1 mb-2"
          onChange={e => handleChange(e.target)}
          name='metodo'
          value={form.metodo}

        />
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8">
        <div className="font-bold">PRUEBAS</div>
        <div className="font-bold">RESULTADOS</div>
        <div className="flex items-center">COCAINA (COC)</div>
          <input
            name='valueC'
            className="border rounded px-3 py-2 w-40"
            value={form.valueC}
            onChange={e => handleChange(e.target)}
            ref={valueCRef}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueMRef.current?.focus();
              }
            }}
          />
        <div className="flex items-center">MARIHUANA (THC)</div>
          <input
            name='valueM'
            className="border rounded px-3 py-2 w-40"
            value={form.valueM}
            onChange={e => handleChange(e.target)}
            ref={valueMRef}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueERef.current?.focus();
              }
            }}
          />
        <div className="flex items-center">EXTASIS (MDMA)</div>
          <input
            name='valueE'
            className="border rounded px-3 py-2 w-40"
            value={form.valueE}
            onChange={e => handleChange(e.target)}
            ref={valueERef}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                printRef.current?.focus();
              }
            }}
          />
      </div>

      {/* Botones */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2 mr-8">
          <span className="font-semibold text-blue-900 italic">IMPRIMIR</span>
          <input 
            className="border rounded px-3 py-2 w-28" 
            name='norden' 
            value={form.norden} 
            onChange={e => handleChange(e.target)}
            ref={printRef}
          />
          <button onClick={handlePrint} type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <FontAwesomeIcon icon={faPrint}/>
          </button>
        </div>
        <button onClick={() => {SubmitPanel3D(form,userlogued,token,handleLimpiar,tabla)}} type="button"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          <FontAwesomeIcon icon={faSave}/> Guardar
        </button>
        <button onClick={handleLimpiar} type="button"
          className="bg-yellow-400 text-white px-6 py-2 rounded hover:bg-yellow-500">
          <FontAwesomeIcon icon={faBroom}/> Limpiar
        </button>
      </div>
    </form>
  );
};

export default Resultado_Panel3D;
