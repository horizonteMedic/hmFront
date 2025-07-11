import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitConsentimientoLab, VerifyTR } from '../Controller/ControllerC';
import Swal from 'sweetalert2';

const antecedentesList = [
  { label: 'CONSUME MARIHUANA (THC)' },
  { label: 'CONSUME COCAINA (COC)' },
  { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS' },
  { label: 'CONSUME ANFETAMINAS (AMP)' },
  { label: 'CONSUME METHANFETAMINAS (MET)' },
  { label: 'CONSUME BENZODIAZEPINAS (BZO)' },
  { label: 'CONSUME OPIÁCEOS (OPI)' },
  { label: 'CONSUME BARBITÚRICOS (BAR)' },
  { label: 'CONSUME METADONA (MTD)' },
  { label: 'CONSUME FENCICLIDINA (PCP)' },
  { label: 'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)' },
];

const MuestraDeSangre = ({token,selectedSede,userlogued}) => {
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const createAntecedentesObject = () => {
    const obj = {};
    antecedentesList.forEach(({ label }) => {
      obj[label] = false;
    });
    return obj;
  };


  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    dni: '',
    empresa: '',
    antecedentes: []
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
      dni: '',
      empresa: '',
    });
  };

  const handleset = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      empresa: '',
      antecedentes: createAntecedentesObject(),
    }));
  }

  const handleAntecedenteChange = (label, value) => {
    setForm(prev => ({
      ...prev,
      antecedentes: {
        ...prev.antecedentes,
        [label]: value,
      }
    }));
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Consentimiento Muestra de Sangre?',
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
        PrintHojaR(form,'consent_Muestra_Sangre',token);
      }
    });
  };

  return (
    <form className="w-full max-w-7xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-lg">Nro Orden :</label>
          <input name="norden" value={form.norden} onChange={handleInputChange} className="border rounded px-3 py-2 w-48 text-base"
          onKeyUp={(event) => {if(event.key === 'Enter')handleset(),VerifyTR(form.norden,'consent_Muestra_Sangre',token,setForm,selectedSede)}} />
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
        CONSENTIMIENTO INFORMADO PARA LA TOMA DE MUESTRA DE SANGRE
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 justify-start text-base">
        <span>YO,</span>
        <input name="nombres" value={form.nombres} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[120px] max-w-[400px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px`}} />
        <span>de,</span>
        <input name="edad" value={form.edad} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[50px] max-w-[80px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(80, Math.max(50, (String(form.edad)?.length || 0) * 14))}px`}} />
        <span>años de edad, identificado con DNI nº</span>
        <input name="dni" value={form.dni} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[80px] max-w-[120px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px`}} />
      </div>

      <div className="text-justify text-base mb-2">
        ; habiendo recibido consejería e información acerca de los exámenes en sangre que se me va ha realizar según solicitud del protocolo médico de la empresa
      </div>
      <div className="mb-2 flex justify-center">
        <input name="protocolo" value={form.empresa} readOnly onChange={handleInputChange} className="border-b border-gray-400 px-3 py-2 w-96 text-base bg-gray-100 cursor-not-allowed" placeholder="Protocolo médico de la empresa" />
      </div>
      <div className="text-justify text-base mb-4">
        ; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra de sangre para cumplir con los exámenes pertinentes.
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button type="button" onClick={(() => {SubmitConsentimientoLab(form,"consent_Muestra_Sangre",token, userlogued,null,false,handleLimpiar)})} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded flex items-center gap-2 text-lg shadow-md transition-colors">
          <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
        </button>
        <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded flex items-center gap-2 text-lg shadow-md transition-colors" onClick={handleLimpiar}>
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-semibold text-blue-900 text-lg">IMPRIMIR</span>
          <input className="border rounded px-3 py-2 w-32 text-base" value={form.norden} name="norden" onChange={handleInputChange}/>
          <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded border border-blue-700 flex items-center shadow-md transition-colors" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default MuestraDeSangre; 