import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitConsentimientoLab, VerifyTR } from '../Controller/ControllerC';
import Swal from 'sweetalert2';



const Panel10D = ({token,selectedSede,userlogued}) => {
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const antecedentesList = [
    { label: 'CONSUME MARIHUANA (THC)', key: 'MARIHUANA', fecha: today },
    { label: 'CONSUME COCAINA (COC)', key: 'COCAINA', fecha: today  },
    { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS', key: 'COCA', fecha: today  },
    { label: 'CONSUME ANFETAMINAS (AMP)', key: 'ANFETAMINAS', fecha: today  },
    { label: 'CONSUME METHANFETAMINAS (MET)', key: 'METAN', fecha: today  },
    { label: 'CONSUME BENZODIAZEPINAS (BZO)', key: 'BENZO', fecha: today  },
    { label: 'CONSUME OPIÁCEOS (OPI)', key: 'OPIA', fecha: today  },
    { label: 'CONSUME BARBITÚRICOS (BAR)', key: 'BARBI', fecha: today  },
    { label: 'CONSUME METADONA (MTD)', key: 'METADONA', fecha: today  },
    { label: 'CONSUME FENCICLIDINA (PCP)', key: 'FENCI', fecha: today  },
    { label: 'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)', key: 'ANTI', fecha: today  },
  ];

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
    antecedentes: [
      { label: 'CONSUME MARIHUANA (THC)', key: 'MARIHUANA', fecha: today, value: false },
      { label: 'CONSUME COCAINA (COC)', key: 'COCAINA', fecha: today, value: false  },
      { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS', key: 'COCA', fecha: today, value: false  },
      { label: 'CONSUME ANFETAMINAS (AMP)', key: 'ANFETAMINAS', fecha: today, value: false  },
      { label: 'CONSUME METHANFETAMINAS (MET)', key: 'METAN', fecha: today, value: false  },
      { label: 'CONSUME BENZODIAZEPINAS (BZO)', key: 'BENZO', fecha: today, value: false  },
      { label: 'CONSUME OPIÁCEOS (OPI)', key: 'OPIA', fecha: today, value: false  },
      { label: 'CONSUME BARBITÚRICOS (BAR)', key: 'BARBI', fecha: today, value: false  },
      { label: 'CONSUME METADONA (MTD)', key: 'METADONA', fecha: today, value: false  },
      { label: 'CONSUME FENCICLIDINA (PCP)', key: 'FENCI', fecha: today, value: false  },
      { label: 'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)', key: 'ANTI', fecha: today , value: false },
    ],
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
      { label: 'CONSUME MARIHUANA (THC)', key: 'MARIHUANA', fecha: today, value: false },
      { label: 'CONSUME COCAINA (COC)', key: 'COCAINA', fecha: today, value: false  },
      { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS', key: 'COCA', fecha: today, value: false  },
      { label: 'CONSUME ANFETAMINAS (AMP)', key: 'ANFETAMINAS', fecha: today, value: false  },
      { label: 'CONSUME METHANFETAMINAS (MET)', key: 'METAN', fecha: today, value: false  },
      { label: 'CONSUME BENZODIAZEPINAS (BZO)', key: 'BENZO', fecha: today, value: false  },
      { label: 'CONSUME OPIÁCEOS (OPI)', key: 'OPIA', fecha: today, value: false  },
      { label: 'CONSUME BARBITÚRICOS (BAR)', key: 'BARBI', fecha: today, value: false  },
      { label: 'CONSUME METADONA (MTD)', key: 'METADONA', fecha: today, value: false  },
      { label: 'CONSUME FENCICLIDINA (PCP)', key: 'FENCI', fecha: today, value: false  },
      { label: 'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)', key: 'ANTI', fecha: today , value: false },
    ],
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
      { label: 'CONSUME MARIHUANA (THC)', key: 'MARIHUANA', fecha: today, value: false },
      { label: 'CONSUME COCAINA (COC)', key: 'COCAINA', fecha: today, value: false  },
      { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS', key: 'COCA', fecha: today, value: false  },
      { label: 'CONSUME ANFETAMINAS (AMP)', key: 'ANFETAMINAS', fecha: today, value: false  },
      { label: 'CONSUME METHANFETAMINAS (MET)', key: 'METAN', fecha: today, value: false  },
      { label: 'CONSUME BENZODIAZEPINAS (BZO)', key: 'BENZO', fecha: today, value: false  },
      { label: 'CONSUME OPIÁCEOS (OPI)', key: 'OPIA', fecha: today, value: false  },
      { label: 'CONSUME BARBITÚRICOS (BAR)', key: 'BARBI', fecha: today, value: false  },
      { label: 'CONSUME METADONA (MTD)', key: 'METADONA', fecha: today, value: false  },
      { label: 'CONSUME FENCICLIDINA (PCP)', key: 'FENCI', fecha: today, value: false  },
      { label: 'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)', key: 'ANTI', fecha: today , value: false },
    ],
    }));
  }

  // Forzar apertura del calendario al hacer focus
  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };
  
  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Consentimiento Panel 10D?',
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
        PrintHojaR(form,'con_panel10D',token);
      }
    });
  };
  console.log(form.antecedentes)
  return (
    <form className="w-full max-w-7xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-lg">Nro Orden :</label>
          <input name="norden" value={form.norden} onChange={handleInputChange} className="border rounded px-3 py-2 w-48 text-base"
          onKeyUp={(event) => {if(event.key === 'Enter')handleset(),VerifyTR(form.norden,'con_panel10D',token,setForm,selectedSede,form)}} />
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
        CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS<br />
        PANEL 10 D (AMP-BAR-BZO-COC-MET-MTP-PCP-THC-OPI-TCA)
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 justify-start text-base">
        <span>Yo</span>
        <input name="nombres" value={form.nombres} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[120px] max-w-[400px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px`}} />
        <span>, de</span>
        <input name="edad" value={form.edad} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[50px] max-w-[80px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(80, Math.max(50, (String(form.edad)?.length || 0) * 14))}px`}} />
        <span>años de edad, identificado con DNI N°</span>
        <input name="dni" value={form.dni} readOnly className="border-b border-gray-400 px-3 py-2 min-w-[80px] max-w-[150px] text-base bg-gray-100 cursor-not-allowed" style={{width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px`}} />
      </div>

      <div className="text-justify text-base mb-4">
        , habiendo recibido consejería e información acerca de la prueba para el panel de 10D drogas en orina; y en pleno uso de mis facultades mentales AUTORIZO se tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post -Test y mis resultados.
      </div>

      <div className="font-semibold mb-2 text-lg">ANTECEDENTES</div>
      <div className="flex flex-col gap-y-4 mb-8">
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
              {/*label === 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS' && form.antecedentes[key] === true && (
                <input
                  type="date"
                  className="border rounded px-2 py-1 ml-4"
                  value={form.fechaCoca || ''}
                  onChange={e => setForm(prev => ({ ...prev, fechaCoca: e.target.value }))}
                />
              )*/}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button type="button" onClick={(() => {SubmitConsentimientoLab(form,"con_panel10D",token, userlogued, form.antecedentes.COCA ? form.fechaCoca : null, false, handleLimpiar)})} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded flex items-center gap-2 text-lg shadow-md transition-colors">
          <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
        </button>
        <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded flex items-center gap-2 text-lg shadow-md transition-colors" onClick={handleLimpiar}>
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-semibold text-blue-900 text-lg">IMPRIMIR</span>
          <input className="border rounded px-3 py-2 w-32 text-base" value={form.norden} name="norden" onChange={handleInputChange} />
          <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded border border-blue-700 flex items-center shadow-md transition-colors" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Panel10D; 