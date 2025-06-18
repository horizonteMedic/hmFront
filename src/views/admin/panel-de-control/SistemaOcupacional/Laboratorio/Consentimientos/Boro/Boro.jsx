import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import Consentimiento_Boro_Digitalizado from '../../../../../../jaspers/Consentimientos/Consentimiento_Boro_Digitalizado';
import Swal from 'sweetalert2';
import { PrintHojaR, SubmitConsentimientoLab, VerifyTR } from '../Controller/ControllerC';

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

const Boro = ({ token, selectedSede, userlogued }) => {
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    dni: '',
    trabajador: true,
    postulante: false,
    empresa: '',
    enfermedad: { key: false, cual: '' },
    medicamento: { key: false, cual: '' },
    matecoca: { key: false, fecha: today },
    chaccha: { key: false, fecha: today },
    tratamiento: { key: false, cual: '', cuando: '', donde: '' },
    notas: '',
    medico: '',
  });

  const fechaRef = useRef(null);
  const mateCocaFechaRef = useRef(null);
  const chacchaFechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
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
      trabajador: true,
      postulante: false,
      empresa: '',
      enfermedad: { key: false, cual: '' },
      medicamento: { key: false, cual: '' },
      matecoca: { key: false, fecha: '' },
      chaccha: { key: false, fecha: today },
      tratamiento: { key: false, cual: '', cuando: '', donde: '' },
      notas: '',
      medico: '',
    });
  };

  const handleset = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      trabajador: true,
      postulante: false,
      empresa: '',
      enfermedad: { key: false, cual: '' },
      medicamento: { key: false, cual: '' },
      matecoca: { key: false, fecha: today },
      chaccha: { key: false, fecha: today },
      tratamiento: { key: false, cual: '', cuando: '', donde: '' },
      notas: '',
      medico: '',
    }));
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Consentimiento BORO?',
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
        PrintHojaR(form,'consent_Boro',token,true);
      }
    });
  };

  return (
    <form className="w-full max-w-7xl mx-auto bg-white p-8 rounded shadow">
        {/* Encabezado */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="font-semibold text-lg">Nro Orden :</label>
          <input
            name="norden"
            value={form.norden}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-40 text-lg"
            onKeyUp={(event) => {
              if (event.key === 'Enter'){
                handleset()
                VerifyTR(form.norden, 'consent_Boro', token, setForm, selectedSede, null,true);
              }
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
          <div className="relative">
            <input
              name="nombres"
              value={form.nombres}
              readOnly
              className="border-b border-gray-400 px-2 py-1 bg-gray-100 cursor-not-allowed text-lg"
              style={{ 
                width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px`,
                minWidth: '120px',
                maxWidth: '400px'
              }}
            />
          </div>
          <span>de</span>
          <div className="relative">
            <input
              name="edad"
              value={form.edad}
              readOnly
              className="border-b border-gray-400 px-2 py-1 bg-gray-100 cursor-not-allowed text-lg"
              style={{ 
                width: `${Math.min(50, Math.max(30, (String(form.edad)?.length || 0) * 14))}px`,
                minWidth: '30px',
                maxWidth: '50px'
              }}
            />
          </div>
          <span>años de edad, con documento de identidad N°</span>
          <div className="relative">
            <input
              name="dni"
              value={form.dni}
              readOnly
              className="border-b border-gray-400 px-2 py-1 bg-gray-100 cursor-not-allowed text-lg"
              style={{ 
                width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px`,
                minWidth: '80px',
                maxWidth: '120px'
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-3 text-lg">
          <span>trabajador (</span>
          <input
            type="radio"
            name="trabajador"
            checked={form.trabajador}
            onChange={() => setForm({ ...form, trabajador: true, postulante: false })}
          />
          <span>) o postulante (</span>
          <input
            type="radio"
            name="postulante"
            checked={form.postulante}
            onChange={() => setForm({ ...form, trabajador: false, postulante: true })}
          />
          <span>), de la empresa</span>
          <input
            name="empresa"
            value={form.empresa}
            disabled
            onChange={handleInputChange}
            className="border-b border-gray-400 px-2 py-1 min-w-[120px] max-w-[200px] bg-gray-100 text-lg"
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
              type="checkbox"
              name="enfermedad_si"
              checked={form.enfermedad.key}
              onChange={() => handlePreguntaChange('enfermedad', 'key', !form.enfermedad.key)}
            />
            <span>¿Sufre alguna enfermedad?</span>
            <span className="ml-2">¿Cuál?</span>
            <input
              type="text"
              disabled={!form.enfermedad.key}
              value={form.enfermedad.cual}
              onChange={e => handlePreguntaChange('enfermedad', 'cual', e.target.value)}
              className="border px-2 py-1 w-56 ml-1 text-lg"
            />
          </div>
          {/* Medicamento */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="medicamento_si"
              checked={form.medicamento.key}
              onChange={() => handlePreguntaChange('medicamento', 'key', !form.medicamento.key)}
            />
            <span>¿Consume regularmente algún medicamento?</span>
            <span className="ml-2">¿Cuál?</span>
            <input
              type="text"
              disabled={!form.medicamento.key}
              value={form.medicamento.cual}
              onChange={e => handlePreguntaChange('medicamento', 'cual', e.target.value)}
              className="border px-2 py-1 w-56 ml-1 text-lg"
            />
          </div>
          {/* Mate de coca */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="matecoca_si"
              checked={form.matecoca.key}
              onChange={() => handlePreguntaChange('matecoca', 'key', !form.matecoca.key)}
            />
            <span>¿Consume regularmente mate de coca?</span>
            {form.matecoca.key === true && (
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
              type="checkbox"
              name="chaccha_si"
              checked={form.chaccha.key}
              onChange={() => handlePreguntaChange('chaccha', 'key', !form.chaccha.key)}
            />
            <span>¿Chaccha o mastica hoja de coca?</span>
            {form.chaccha.key === true && (
              <>
                <span className="ml-2">Especifique la fecha:</span>
                <input
                  type="date"
                  value={form.chaccha.fecha}
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
              type="checkbox"
              name="tratamiento_si"
              checked={form.tratamiento.key}
              onChange={() => handlePreguntaChange('tratamiento', 'key', !form.tratamiento.key)}
            />
            <span>¿En las últimas 48 horas, se realizó algún tratamiento quirúrgico o dental? Especifique cuál:</span>
            <input
              type="text"
              disabled={!form.tratamiento.key}
              value={form.tratamiento.cual}
              onChange={e => handlePreguntaChange('tratamiento', 'cual', e.target.value)}
              className="border px-2 py-1 w-56 ml-1 text-lg"
            />
          </div>
          <div className="flex items-center gap-3 ml-8">
            <span>Especifique cuándo:</span>
            <input
              type="text"
              disabled={!form.tratamiento.key}
              value={form.tratamiento.cuando}
              onChange={e => handlePreguntaChange('tratamiento', 'cuando', e.target.value)}
              className="border px-2 py-1 w-40 ml-1 text-lg"
            />
            <span>Especifique dónde:</span>
            <input
              type="text"
              disabled={!form.tratamiento.key}
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
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-4 items-center mt-6">
          <button type="button" onClick={() => {SubmitConsentimientoLab(form,"consent_Boro",token,userlogued,null,true, handleLimpiar)}} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded flex items-center gap-3 font-semibold shadow-md transition-colors text-lg">
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-3 rounded flex items-center gap-3 font-semibold shadow-md transition-colors text-lg" onClick={handleLimpiar}>
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
          <span className="font-bold text-blue-900 text-lg italic ml-6">IMPRIMIR</span>
          <input className="border rounded px-3 py-2 w-32 text-base" value={form.norden} name="norden" onChange={handleInputChange} />
          <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded border border-blue-700 flex items-center shadow-md transition-colors ml-2 text-lg" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      </form>
  );
};

export default Boro; 