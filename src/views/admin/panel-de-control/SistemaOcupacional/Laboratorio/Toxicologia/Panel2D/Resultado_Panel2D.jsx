// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Toxicologia/Panel2D/Resultado_Panel2D.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitPanel2D, VerifyTR } from './controller2D';

import Swal from 'sweetalert2';
export default function Resultado_Panel2D({ token, selectedSede, userlogued }) {
 const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const tabla = 'panel2d'
  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    valueM: 'NEGATIVO',
    valueC: 'NEGATIVO',
    metodo: 'INMUNOCROMATOGRAFICO',
    medico: ''
  });
  const [status, setStatus] = useState('');

  // Refs para navegación
  const fechaRef = useRef(null);
  const valueMRef = useRef(null);
  const valueCRef = useRef(null);
  const printRef = useRef(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value.toUpperCase() }));
  };

  const handleClear = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      valueM: 'NEGATIVO',
      valueC: 'NEGATIVO',
      medico: '',
      metodo: 'INMUNOCROMATOGRAFICO'
    });
  };

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Panel 2D?',
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

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">PANEL 2D</h2>
      <form className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[100px]">Nro Ficha:</label>
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
              onKeyUp={(event) => {
                if(event.key === 'Enter') {
                  VerifyTR(form.norden, tabla, token, setForm, selectedSede);
                }
              }}
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[100px]">Fecha:</label>
            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
              ref={fechaRef}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  valueMRef.current?.focus();
                }
              }}
            />
          </div>
        </div>
        {/* Paciente */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[100px]">Nombres:</label>
            <input
              name="nombres"
              value={form.nombres}
              disabled
              className="border rounded px-2 py-1 flex-1 bg-gray-100"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[100px]">Edad:</label>
            <input
              name="edad"
              value={form.edad}
              disabled
              className="border rounded px-2 py-1 w-32 bg-gray-100"
            />
          </div>
        </div>
        {/* Pruebas */}
        <div className="font-bold mb-2">PRUEBA RÁPIDA CUALITATIVA</div>
        <div className="mb-4">
          <input
            className="border rounded px-2 py-1 w-full"
            onChange={handleChange}
            name='metodo'
            value={form.metodo}
          />
        </div>
        {/* Resultados */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-6">
          <div className="font-bold">PRUEBAS</div>
          <div className="font-bold"> </div>
          <div className="font-bold">RESULTADOS</div>
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
            value={form.valueM}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-32"
            ref={valueMRef}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueCRef.current?.focus();
              }
            }}
          />
          <div className="flex items-center">COCAINA (COC)</div>
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
            value={form.valueC}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-32"
            ref={valueCRef}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                printRef.current?.focus();
              }
            }}
          />
        </div>
        {/* Médico */}
        <div className="flex items-center gap-2">
          <label className="font-semibold min-w-[100px]">ASIGNAR MÉDICO:</label>
          <select disabled value={form.medico} className="border rounded px-2 py-1 flex-1 bg-gray-100">
            <option value="">-- N/A --</option>
          </select>
        </div>
        {/* Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {SubmitPanel2D(form,userlogued,token,handleClear,tabla)}}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold italic">IMPRIMIR</span>
            <div className="flex items-center gap-2 mt-2">
              <input 
                name="norden" 
                className="border rounded px-2 py-1 w-24" 
                value={form.norden} 
                onChange={handleChange}
                ref={printRef}
              />
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </form>
      {status && <p className="mt-4 text-center text-green-600">{status}</p>}
    </div>
  );
}