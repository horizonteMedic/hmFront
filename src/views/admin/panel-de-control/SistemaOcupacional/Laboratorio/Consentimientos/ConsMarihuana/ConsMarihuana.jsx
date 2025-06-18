import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitConsentimientoLab, VerifyTR } from '../Controller/ControllerC';
import Swal from 'sweetalert2';


const ConsMarihuana = ({token,selectedSede,userlogued}) => {
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    dni: '',
    antecedentes: [
      { label: 'CONSUME MARIHUANA', key: 'MARIHUANA', fecha: today, value: false },
    ]
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAntecedenteChange = (key, newValue) => {
    setForm(prev => ({
      ...prev,
      antecedentes: prev.antecedentes.map(item =>
        item.key === key
          ? { ...item, value: newValue }
          : item
      )
    }));
  };

  const handleFechaChange = (key, nuevaFecha) => {
    setForm(prev => ({
      ...prev,
      antecedentes: prev.antecedentes.map(item =>
        item.key === key
          ? { ...item, fecha: nuevaFecha }
          : item
      )
    }));
  };


  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      antecedentes: [
        { label: 'CONSUME MARIHUANA', key: 'MARIHUANA', fecha: today, value: false },
      ]
    });
  };

  const handleset = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      antecedentes: [
        { label: 'CONSUME MARIHUANA', key: 'MARIHUANA', fecha: today, value: false },
      ]
    }));
  }

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Consentimiento Marihuana?',
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
        PrintHojaR(form,'consent_marihuana',token);
      }
    });
  };

  return (
    <form className="w-full max-w-7xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-lg">Nro Orden :</label>
          <input name="norden" value={form.norden} onChange={handleInputChange} className="border rounded px-3 py-2 w-48 text-base"
          onKeyUp={(event) => {if(event.key === 'Enter')handleset(),VerifyTR(form.norden,'consent_marihuana',token,setForm,selectedSede,form)}} />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-lg">Fecha :</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-56 text-base"
            ref={fechaRef}
            onFocus={handleFechaFocus}
          />
        </div>
      </div>

      <div className="text-center font-bold text-xl mb-4">
        CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE MARIHUANA
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 justify-start text-base">
        <span>YO,</span>
        <input name="nombres" value={form.nombres} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[120px] max-w-[400px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px`}} />
        <span>de,</span>
        <input name="edad" value={form.edad} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[40px] max-w-[70px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(50, Math.max(30, (String(form.edad)?.length || 0) * 14))}px`}} />
        <span>años de edad, identificado con DNI nº</span>
        <input name="dni" value={form.dni} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[80px] max-w-[120px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px`}} />
      </div>

      <div className="text-justify text-base mb-4">
        ; habiendo recibido consejería e información acerca de la prueba para Marihuana en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post – Test y mis resultados.
      </div>

      <div className="font-semibold mb-2 text-lg">ANTECEDENTES :</div>
      <div className="flex flex-wrap gap-8 mb-8">
        {form.antecedentes.map(({ label, key, fecha, value }) => (
          <div key={key} className="flex items-center gap-6">
            <label className="text-base font-medium flex-1 whitespace-nowrap">{label}</label>
            <div className="flex items-center gap-4 ml-2">
              <label className="flex items-center gap-1 text-base">
                <input
                  type="radio"
                  name={`antecedente_${key}`}
                  checked={value === false}
                  onChange={() => handleAntecedenteChange(key, false)}
                />
                NO
              </label>
              <label className="flex items-center gap-1 text-base">
                <input
                  type="radio"
                  name={`antecedente_${key}`}
                  checked={value === true}
                  onChange={() => handleAntecedenteChange(key, true)}
                />
                SI
              </label>

              {value === true && (
                  <input
                    type="date"
                    className="border rounded px-2 py-1 ml-4"
                    value={fecha}
                    onChange={e => handleFechaChange(key, e.target.value)}
                  />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
        <div className="flex gap-3">
          <button type="button" onClick={(() => {SubmitConsentimientoLab(form,"consent_marihuana",token, userlogued, null, false, handleLimpiar)})} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors">
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors" onClick={handleLimpiar}>
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
          <div className="flex gap-1 mt-1">
            <input className="border rounded px-2 py-1 w-24" value={form.norden} name="norden" onChange={handleInputChange}/>
            <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors" onClick={handlePrint}>
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ConsMarihuana; 