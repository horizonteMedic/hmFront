// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Toxicologia/Panel10D/Rseultado_Panel10D.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitPanel10D, VerifyTR } from './controller10D';
import Swal from 'sweetalert2';

const Rseultado_Panel10D = ({ token, selectedSede, userlogued }) => {
  const tabla = 'panel10d'
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    valueM: '',
    valueC: '',
    valueAn: '',
    valueMet: '',
    valueBen: '',
    valueOpi: '',
    valueBar: '',
    valueMetadona: '',
    valueFenci: '',
    valueAnti: '',
    metodo: 'METODO: INMUNOCROMATOGRAFICO'
  });

  // Refs para navegación
  const fechaRef = useRef(null);
  const valueCRef = useRef(null);
  const valueMRef = useRef(null);
  const valueAnRef = useRef(null);
  const valueMetRef = useRef(null);
  const valueBenRef = useRef(null);
  const valueOpiRef = useRef(null);
  const valueBarRef = useRef(null);
  const valueMetadonaRef = useRef(null);
  const valueFenciRef = useRef(null);
  const valueAntiRef = useRef(null);
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
      valueM: '',
      valueC: '',
      valueAn: '',
      valueMet: '',
      valueBen: '',
      valueOpi: '',
      valueBar: '',
      valueMetadona: '',
      valueFenci: '',
      valueAnti: '',
      metodo: 'METODO: INMUNOCROMATOGRAFICO',
    });
  };

  const handleSeat = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      valueM: '',
      valueC: '',
      valueAn: '',
      valueMet: '',
      valueBen: '',
      valueOpi: '',
      valueBar: '',
      valueMetadona: '',
      valueFenci: '',
      valueAnti: '',
      metodo: '',
    }))
  }

  const handleFechaFocus = e => {
    e.target.showPicker?.();
  };

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Panel 10D?',
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

  // ancho dinámico para el campo nombres
  const nameWidth = Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10));

  return (
    <form className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">PANEL 10D</h2>

      {/* Cabecera */}
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
            onChange={handleChange}
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
          value={form.metodo}
          onChange={handleChange}
          name='metodo'
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
                onChange={handleChange}
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
                onChange={handleChange}
                ref={valueMRef}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    valueAnRef.current?.focus();
                  }
                }}
              />
          <div className="flex items-center">ANFETAMINA (AMP)</div>
              <input
                name='valueAn'
                className="border rounded px-3 py-2 w-40"
                value={form.valueAn}
                onChange={handleChange}
                ref={valueAnRef}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    valueMetRef.current?.focus();
                  }
                }}
              />
          <div className="flex items-center">METANFETAMINA (MET)</div>
              <input
                name='valueMet'
                className="border rounded px-3 py-2 w-40"
                value={form.valueMet}
                onChange={handleChange}
                ref={valueMetRef}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    valueBenRef.current?.focus();
                  }
                }}
              />
          <div className="flex items-center">BENZODIAZEPINA (BZO)</div>
              <input
                name='valueBen'
                className="border rounded px-3 py-2 w-40"
                value={form.valueBen}
                onChange={handleChange}
                ref={valueBenRef}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    valueOpiRef.current?.focus();
                  }
                }}
              />
          <div className="flex items-center">OPIÁCEOS (OPI)</div>
              <input
                name='valueOpi'
                className="border rounded px-3 py-2 w-40"
                value={form.valueOpi}
                onChange={handleChange}
                ref={valueOpiRef}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    valueBarRef.current?.focus();
                  }
                }}
              />
          <div className="flex items-center">BARBITÚRICOS (BAR)</div>
              <input
                name='valueBar'
                className="border rounded px-3 py-2 w-40"
                value={form.valueBar}
                onChange={handleChange}
                ref={valueBarRef}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    valueMetadonaRef.current?.focus();
                  }
                }}
              />
          <div className="flex items-center">METADONA (MTD)</div>
              <input
                name='valueMetadona'
                className="border rounded px-3 py-2 w-40"
                value={form.valueMetadona}
                onChange={handleChange}
                ref={valueMetadonaRef}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    valueFenciRef.current?.focus();
                  }
                }}
              />
          <div className="flex items-center">FENCICLIDINA (PCP)</div>
              <input
                name='valueFenci'
                className="border rounded px-3 py-2 w-40"
                value={form.valueFenci}
                onChange={handleChange}
                ref={valueFenciRef}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    valueAntiRef.current?.focus();
                  }
                }}
              />
          <div className="flex items-center">ANTIDEPRESIVOS TRICÍCLICOS (TCA)</div>
              <input
                name='valueAnti'
                className="border rounded px-3 py-2 w-40"
                value={form.valueAnti}
                onChange={handleChange}
                ref={valueAntiRef}
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
          onClick={() => {SubmitPanel10D(form,userlogued,token,handleLimpiar,tabla)}}
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

export default Rseultado_Panel10D;
