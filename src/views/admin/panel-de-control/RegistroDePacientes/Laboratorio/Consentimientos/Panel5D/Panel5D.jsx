import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import Consentimiento_Panel5D_ohla_Digitalizado from '../../../../../../jaspers/Consentimiento_Panel5D_ohla_Digitalizado';
import Swal from 'sweetalert2';
import { SubmitConsentimientoLab, VerifyTR } from '../Controller/ControllerC';

const antecedentesList = [
  { label: 'CONSUME MARIHUANA (THC)' },
  { label: 'CONSUME COCAINA (COC)' },
  { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS' },
  { label: 'CONSUME ANFETAMINAS (AMP)' },
  { label: 'CONSUME METHANFETAMINAS (MET)' },
  { label: 'CONSUME BENZODIAZEPINAS (BZO)' },
];

const Panel5D = ({token, selectedSede, userlogued}) => {
  const today = new Date().toISOString().split("T")[0];

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
    antecedentes: createAntecedentesObject(),
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAntecedenteChange = (label, value) => {
    setForm(prev => ({
      ...prev,
      antecedentes: {
        ...prev.antecedentes,
        [label]: value,
      }
    }));
  };

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      antecedentes: Array(antecedentesList.length).fill('NO'),
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handlePrint = () => {
    // Mapear los datos del formulario a los campos esperados por el Jasper
    const datos = {
      nombres: form.nombres,
      edad: form.edad,
      dni: form.dni,
      sede: '', // Puedes completar si tienes este dato
      fecha: form.fecha,
      // Antecedentes: marcar SI/NO según el estado
      ant0_si: form.antecedentes[0] === 'SI',
      ant0_no: form.antecedentes[0] === 'NO',
      ant1_si: form.antecedentes[1] === 'SI',
      ant1_no: form.antecedentes[1] === 'NO',
      ant2_si: form.antecedentes[2] === 'SI',
      ant2_no: form.antecedentes[2] === 'NO',
      ant3_si: form.antecedentes[3] === 'SI',
      ant3_no: form.antecedentes[3] === 'NO',
      ant4_si: form.antecedentes[4] === 'SI',
      ant4_no: form.antecedentes[4] === 'NO',
      ant5_si: form.antecedentes[5] === 'SI',
      ant5_no: form.antecedentes[5] === 'NO',
    };
    Swal.fire({
      title: '¿Desea Imprimir Consentimiento Panel 5D?',
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>${form.nombres}</b> - DNI <b>${form.dni}</b></div>`,
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
        Consentimiento_Panel5D_ohla_Digitalizado(datos);
      }
    });
  };
  console.log(form)
  return (
    <form className="w-full max-w-7xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-lg">Nro Orden :</label>
          <input name="norden" value={form.norden} onChange={handleInputChange} className="border rounded px-3 py-2 w-48 text-base" 
          onKeyUp={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,'con_panel5D',token,setForm,selectedSede)}}/>
        </div>
        <button type="button" className="text-blue-700 hover:text-blue-900 flex items-center px-3 text-base">
          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
        </button>
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
        CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS PANEL 5D<br />
        (COCAINA, MARIHUANA, ANFETAMINA, METHANFETAMINA Y BENZODIAZEPINA)
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 justify-start text-base">
        <span>Yo</span>
        <input name="nombres" value={form.nombres} readOnly className="border-b border-gray-400 px-3 py-2 w-64 text-base bg-gray-100 cursor-not-allowed" />
        <span>de</span>
        <input name="edad" value={form.edad} readOnly className="border-b border-gray-400 px-3 py-2 w-20 text-base bg-gray-100 cursor-not-allowed" />
        <span>años de edad, identificado con DNI n°</span>
        <input name="dni" value={form.dni} readOnly className="border-b border-gray-400 px-3 py-2 w-40 text-base bg-gray-100 cursor-not-allowed" />
      </div>

      <div className="text-justify text-base mb-4">
        , habiendo recibido consejería e información acerca de la prueba para el panel de 5 drogas en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post – Test y mis resultados.<br />
        Además, declaro que la información que brindaré a continuación es verdadera:
      </div>

      <div className="font-semibold mb-2 text-lg">ANTECEDENTES</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        {antecedentesList.map(({ label }) => (
          <div key={label} className="flex items-center gap-6">
            <label className="text-base font-medium flex-1 whitespace-nowrap">{label}</label>
            <div className="flex items-center gap-4 ml-2">
              <label className="flex items-center gap-1 text-base">
                <input
                  type="radio"
                  name={`antecedente_${label}`}
                  checked={form.antecedentes[label] === false}
                  onChange={() => handleAntecedenteChange(label, false)}
                />
                NO
              </label>
              <label className="flex items-center gap-1 text-base">
                <input
                  type="radio"
                  name={`antecedente_${label}`}
                  checked={form.antecedentes[label] === true}
                  onChange={() => handleAntecedenteChange(label, true)}
                />
                SI
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
        <div className="flex gap-3">
          <button type="button" onClick={(() => {SubmitConsentimientoLab(form,"con_panel5D",token, userlogued)})} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold">
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold" onClick={handleLimpiar}>
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
          <div className="flex gap-1 mt-1">
            <input className="border rounded px-2 py-1 w-24" />
            <button type="button" className="bg-gray-200 px-2 py-1 rounded border border-gray-300" onClick={handlePrint}>
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Panel5D; 