import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import Consentimiento_Boro_Digitalizado from '../../../../../../jaspers/Consentimiento_Boro_Digitalizado';
import Swal from 'sweetalert2';
import { VerifyTR } from '../Controller/ControllerC';

const antecedentesList = [
  { label: 'CONSUME COCAINA' },
  { label: 'CONSUME MARIHUANA' },
];

const preguntasAdicionales = [
  { label: '¿Sufre alguna enfermedad?', field: 'enfermedad', tipo: 'text', especifica: '¿Cuál?' },
  { label: '¿Consume regularmente algún medicamento?', field: 'medicamento', tipo: 'text', especifica: '¿Cuál?' },
  { label: '¿Chaccha o mastica hoja de coca?', field: 'coca', tipo: 'date', especifica: 'Especifique la fecha:' },
  { label: '¿En las últimas 48 horas, se realizó algún tratamiento quirúrgico o dental?', field: 'tratamiento', tipo: 'text', especifica: 'Especifique cuál:' },
  { label: '', field: 'tratamiento_cuando', tipo: 'text', especifica: 'Especifique cuándo:' },
  { label: '', field: 'tratamiento_donde', tipo: 'text', especifica: 'Especifique dónde:' },
];

const medicosList = [
  { value: '', label: 'Seleccionar un doctor' },
  { value: 'dr1', label: 'Dr. Juan Pérez' },
  { value: 'dr2', label: 'Dra. María López' },
];

const Boro = ({ token, selectedSede }) => {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    dni: '',
    trabajador: '',
    postulante: '',
    empresa: '',
    enfermedad: { si: 'NO', cual: '' },
    medicamento: { si: 'NO', cual: '' },
    matecoca: { si: 'NO', fecha: '' },
    chaccha: { si: 'NO' },
    tratamiento: { si: 'NO', cual: '', cuando: '', donde: '' },
    notas: '',
    medico: '',
  });

  const fechaRef = useRef(null);
  const mateCocaFechaRef = useRef(null);
  const chacchaFechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAntecedenteChange = (idx, value) => {
    const updated = [...form.antecedentes];
    updated[idx] = value;
    setForm({ ...form, antecedentes: updated });
  };

  const handlePreguntaChange = (field, key, value) => {
    setForm({ ...form, [field]: { ...form[field], [key]: value } });
  };

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      trabajador: '',
      postulante: '',
      empresa: '',
      enfermedad: { si: 'NO', cual: '' },
      medicamento: { si: 'NO', cual: '' },
      matecoca: { si: 'NO', fecha: '' },
      chaccha: { si: 'NO' },
      tratamiento: { si: 'NO', cual: '', cuando: '', donde: '' },
      notas: '',
      medico: '',
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handlePrint = () => {
    const datos = {
      ...form,
      enfermedad_si: form.enfermedad.si,
      enfermedad_cual: form.enfermedad.cual,
      medicamento_si: form.medicamento.si,
      medicamento_cual: form.medicamento.cual,
      matecoca_si: form.matecoca.si,
      matecoca_fecha: form.matecoca.fecha,
      chaccha_si: form.chaccha.si,
      tratamiento_si: form.tratamiento.si,
      tratamiento_cual: form.tratamiento.cual,
      tratamiento_cuando: form.tratamiento.cuando,
      tratamiento_donde: form.tratamiento.donde,
      notas: form.notas,
      medico: form.medico,
    };
    Swal.fire({
      title: '¿Desea Imprimir Consentimiento Boro?',
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>${form.nombres}</b> - DNI <b>${form.dni}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir',
      cancelButtonText: 'Cancelar',
      customClass: {
        title: 'swal2-title',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Consentimiento_Boro_Digitalizado(datos);
      }
    });
  };

  const handleMateCocaRadio = (value) => {
    if (form.matecoca.si === value) {
      handlePreguntaChange('matecoca', 'si', 'NO');
      handlePreguntaChange('matecoca', 'fecha', '');
      return;
    }
    handlePreguntaChange('matecoca', 'si', value);
    if (value === 'SI') {
      setTimeout(() => {
        if (mateCocaFechaRef.current) {
          mateCocaFechaRef.current.showPicker && mateCocaFechaRef.current.showPicker();
        }
      }, 100);
    } else {
      handlePreguntaChange('matecoca', 'fecha', '');
    }
  };

  const handleChacchaRadio = (value) => {
    if (form.chaccha.si === value) {
      handlePreguntaChange('chaccha', 'si', 'NO');
      handlePreguntaChange('chaccha', 'fecha', '');
      return;
    }
    handlePreguntaChange('chaccha', 'si', value);
    if (value === 'SI') {
      setTimeout(() => {
        if (chacchaFechaRef.current) {
          chacchaFechaRef.current.showPicker && chacchaFechaRef.current.showPicker();
        }
      }, 100);
    } else {
      handlePreguntaChange('chaccha', 'fecha', '');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f6fa' }}>
      <form className="w-full bg-white p-10 rounded shadow text-base" style={{ width: '60%' }}>
        {/* Encabezado */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="font-semibold text-lg">Nro Orden :</label>
          <input
            name="norden"
            value={form.norden}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-40 text-lg"
            onKeyUp={(event) => {
              if (event.key === 'Enter')
                VerifyTR(form.norden, 'consent_Boro', token, setForm, selectedSede);
            }}
          />
          <label className="font-semibold text-lg ml-4">Fecha :</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-48 text-lg"
            ref={fechaRef}
            onFocus={handleFechaFocus}
          />
        </div>

        {/* Título */}
        <div className="text-center font-bold text-2xl mb-4 mt-2">
          CONSENTIMIENTO PARA REALIZAR LA PRUEBA DE DOSAJE DE MARIHUANA Y COCAÍNA
        </div>

        {/* Línea de datos personales */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-lg">
          <span>Yo</span>
          <input
            name="nombres"
            value={form.nombres}
            readOnly
            className="border-b border-gray-400 px-2 py-1 min-w-[120px] max-w-[400px] text-lg bg-gray-100 cursor-not-allowed"
            style={{ width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px` }}
          />
          <span>de</span>
          <input
            name="edad"
            value={form.edad}
            readOnly
            className="border-b border-gray-400 px-2 py-1 min-w-[30px] max-w-[50px] bg-gray-100 cursor-not-allowed text-lg"
            style={{ width: `${Math.min(50, Math.max(30, (String(form.edad)?.length || 0) * 14))}px` }}
          />
          <span>años de edad, con documento de identidad N°</span>
          <input
            name="dni"
            value={form.dni}
            readOnly
            className="border-b border-gray-400 px-2 py-1 min-w-[80px] max-w-[120px] bg-gray-100 cursor-not-allowed text-lg"
            style={{ width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px` }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-3 text-lg">
          <span>trabajador (</span>
          <input
            type="radio"
            name="trabajador"
            checked={form.trabajador === 'SI'}
            onChange={() => setForm({ ...form, trabajador: 'SI', postulante: '' })}
          />
          <span>) o postulante (</span>
          <input
            type="radio"
            name="postulante"
            checked={form.postulante === 'SI'}
            onChange={() => setForm({ ...form, trabajador: '', postulante: 'SI' })}
          />
          <span>), de la empresa</span>
          <input
            name="empresa"
            value={form.empresa}
            onChange={handleInputChange}
            className="border-b border-gray-400 px-2 py-1 min-w-[120px] max-w-[200px] bg-white text-lg"
            style={{ width: `${Math.min(200, Math.max(120, (form.empresa?.length || 0) * 10))}px` }}
          />
        </div>

        <div className="text-justify mb-4 text-lg">
          autorizo al POLICLINICO HORIZONTE MEDIC, para que se me realice el examen toxicológico de drogas en orina y/o saliva, según los protocolos establecidos y que los resultados se entreguen directamente a la empresa.
        </div>

        <div className="mb-3 font-semibold text-xl">Además, declaro que la información que brindaré a continuación es verdadera:</div>

        {/* Preguntas */}
        <div className="flex flex-col gap-3 mb-4 text-lg">
          {/* Enfermedad */}
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="enfermedad_si"
              checked={form.enfermedad.si === 'SI'}
              onChange={() => handlePreguntaChange('enfermedad', 'si', 'SI')}
            />
            <span>¿Sufre alguna enfermedad?</span>
            <span className="ml-2">¿Cuál?</span>
            <input
              type="text"
              value={form.enfermedad.cual}
              onChange={e => handlePreguntaChange('enfermedad', 'cual', e.target.value)}
              className="border px-2 py-1 w-56 ml-1 text-lg"
            />
          </div>
          {/* Medicamento */}
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="medicamento_si"
              checked={form.medicamento.si === 'SI'}
              onChange={() => handlePreguntaChange('medicamento', 'si', 'SI')}
            />
            <span>¿Consume regularmente algún medicamento?</span>
            <span className="ml-2">¿Cuál?</span>
            <input
              type="text"
              value={form.medicamento.cual}
              onChange={e => handlePreguntaChange('medicamento', 'cual', e.target.value)}
              className="border px-2 py-1 w-56 ml-1 text-lg"
            />
          </div>
          {/* Mate de coca */}
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="matecoca_si"
              checked={form.matecoca.si === 'SI'}
              onChange={() => handleMateCocaRadio('SI')}
            />
            <span>¿Consume regularmente mate de coca?</span>
            {form.matecoca.si === 'SI' && (
              <>
                <span className="ml-2">Especifique la fecha:</span>
                <input
                  type="date"
                  value={form.matecoca.fecha}
                  onChange={e => handlePreguntaChange('matecoca', 'fecha', e.target.value)}
                  className="border px-2 py-1 w-48 ml-1 text-lg"
                  ref={mateCocaFechaRef}
                  onFocus={handleFechaFocus}
                />
              </>
            )}
          </div>
          {/* Chaccha o mastica hoja de coca */}
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="chaccha_si"
              checked={form.chaccha.si === 'SI'}
              onChange={() => handleChacchaRadio('SI')}
            />
            <span>¿Chaccha o mastica hoja de coca?</span>
            {form.chaccha.si === 'SI' && (
              <>
                <span className="ml-2">Especifique la fecha:</span>
                <input
                  type="date"
                  value={form.chaccha.fecha || ''}
                  onChange={e => handlePreguntaChange('chaccha', 'fecha', e.target.value)}
                  className="border px-2 py-1 w-48 ml-1 text-lg"
                  ref={chacchaFechaRef}
                  onFocus={handleFechaFocus}
                />
              </>
            )}
          </div>
          {/* Tratamiento quirúrgico o dental */}
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="tratamiento_si"
              checked={form.tratamiento.si === 'SI'}
              onChange={() => handlePreguntaChange('tratamiento', 'si', 'SI')}
            />
            <span>¿En las últimas 48 horas, se realizó algún tratamiento quirúrgico o dental? Especifique cuál:</span>
            <input
              type="text"
              value={form.tratamiento.cual}
              onChange={e => handlePreguntaChange('tratamiento', 'cual', e.target.value)}
              className="border px-2 py-1 w-56 ml-1 text-lg"
            />
          </div>
          <div className="flex items-center gap-3 ml-8">
            <span>Especifique cuándo:</span>
            <input
              type="text"
              value={form.tratamiento.cuando}
              onChange={e => handlePreguntaChange('tratamiento', 'cuando', e.target.value)}
              className="border px-2 py-1 w-40 ml-1 text-lg"
            />
            <span>Especifique dónde:</span>
            <input
              type="text"
              value={form.tratamiento.donde}
              onChange={e => handlePreguntaChange('tratamiento', 'donde', e.target.value)}
              className="border px-2 py-1 w-40 ml-1 text-lg"
            />
          </div>
        </div>

        {/* Notas y Médico */}
        <div className="flex flex-wrap gap-8 mb-6 mt-2">
          <div className="flex flex-col">
            <label className="font-semibold text-lg">Notas:</label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-80 h-20 resize-none text-lg"
            />
          </div>
          <div className="flex flex-col justify-end">
            <label className="font-semibold text-lg">MEDICO:</label>
            <select
              name="medico"
              value={form.medico}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-64 text-lg"
            >
              {medicosList.map((med) => (
                <option key={med.value} value={med.value}>{med.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-4 items-center mt-6">
          <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded flex items-center gap-3 font-semibold shadow-md transition-colors text-lg">
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-3 rounded flex items-center gap-3 font-semibold shadow-md transition-colors text-lg" onClick={handleLimpiar}>
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
          <span className="font-bold text-blue-900 text-lg italic ml-6">IMPRIMIR</span>
          <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded border border-blue-700 flex items-center shadow-md transition-colors ml-2 text-lg" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Boro; 