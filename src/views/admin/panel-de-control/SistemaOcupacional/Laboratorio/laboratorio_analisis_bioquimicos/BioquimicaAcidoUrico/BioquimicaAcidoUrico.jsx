import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';
import AnalisisClinicosB_Digitalizado from '../../../../../../jaspers/AnalisisClinicosB_Digitalizado';
import Swal from 'sweetalert2';
import { VerifyTR } from '../../ExamenesLaboratorio/ControllerE/ControllerE';

const BioquimicaAcidoUrico = ({ token, selectedSede }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    prueba: 'ÁCIDO ÚRICO SÉRICO',
    muestra: 'SUERO',
    resultado: '',
    valoresn: 'Mujeres : 2.5 - 6.8 mg/dl\nHombres : 3.6 - 7.7 mg/dl',
    sede: selectedSede || '',
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      prueba: 'ÁCIDO ÚRICO SÉRICO',
      muestra: 'SUERO',
      resultado: '',
      valoresn: 'Mujeres : 2.5 - 6.8 mg/dl\nHombres : 3.6 - 7.7 mg/dl',
      sede: selectedSede || '',
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handleImprimir = () => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Bioquímica?',
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
        AnalisisClinicosB_Digitalizado({
          norden: form.norden,
          nombre: form.nombres,
          edad: form.edad,
          fecha: form.fecha,
          txtprueba: form.prueba,
          txtmuestra: form.muestra,
          txtresultado: form.resultado,
          txtvaloresn: form.valoresn,
          sede: form.sede
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">ÁCIDO ÚRICO</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input name="norden" value={form.norden} onChange={handleInputChange} className="border rounded px-2 py-1 flex-1"
            onKeyUp={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,'ac_bioquimica2022',token,setForm,selectedSede)}} />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Fecha:</label>
            <input name="fecha" type="date" value={form.fecha} onChange={handleInputChange} className="border rounded px-2 py-1 flex-1" ref={fechaRef} onFocus={handleFechaFocus} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nombres:</label>
            <input name="nombres" value={form.nombres} onChange={handleInputChange} className="border rounded px-2 py-1 bg-gray-100"
              style={{ minWidth: '120px', maxWidth: '400px', width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px` }} disabled />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Edad:</label>
            <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-2 py-1 w-24 bg-gray-100" disabled />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold min-w-[120px]">PRUEBA:</label>
          <input name="prueba" className="border rounded px-2 py-1 flex-1 bg-gray-100" value={form.prueba} readOnly />
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold min-w-[120px]">MUESTRA:</label>
          <input name="muestra" className="border rounded px-2 py-1 flex-1 bg-gray-100" value={form.muestra} readOnly />
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold min-w-[120px]">RESULTADO:</label>
          <input name="resultado" className="border rounded px-2 py-1 flex-1" value={form.resultado} onChange={handleInputChange} />
        </div>
        <div className="flex gap-2 items-start">
          <label className="font-semibold min-w-[140px]">VALORES NORMALES:</label>
          <textarea name="valoresn" className="border rounded px-2 py-1 flex-1 bg-gray-100" rows={2} readOnly value={form.valoresn} />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
          <div className="flex gap-3">
            <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"><FontAwesomeIcon icon={faSave} /> Guardar/Actualizar</button>
            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors" onClick={handleLimpiar}><FontAwesomeIcon icon={faBroom} /> Limpiar</button>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
            <div className="flex gap-1 mt-1">
              <input className="border rounded px-2 py-1 w-24" />
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors" onClick={handleImprimir}><FontAwesomeIcon icon={faPrint} /></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BioquimicaAcidoUrico; 