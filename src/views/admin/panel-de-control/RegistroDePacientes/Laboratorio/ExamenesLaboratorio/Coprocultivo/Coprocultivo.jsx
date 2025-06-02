import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';
import Coprocultivo_Digitalizado from '../../../../../../jaspers/Coprocultivo_Digitalizado';
import Swal from 'sweetalert2';

const Coprocultivo = ({ token, selectedSede }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    muestra: '',
    color: '',
    consistencia: '',
    moco_fecal: '',
    sangrev: '',
    restosa: '',
    leucocitos: '',
    hematies: '',
    parasitos: '',
    gotasg: '',
    levaduras: '',
    identificacion: '',
    florac: '',
    resultado: '',
    observaciones: '',
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
      muestra: '',
      color: '',
      consistencia: '',
      moco_fecal: '',
      sangrev: '',
      restosa: '',
      leucocitos: '',
      hematies: '',
      parasitos: '',
      gotasg: '',
      levaduras: '',
      identificacion: '',
      florac: '',
      resultado: '',
      observaciones: '',
      sede: selectedSede || '',
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  const handleImprimir = () => {
    Swal.fire({
      title: '¿Desea Imprimir Hoja de Coprocultivo?',
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
        Coprocultivo_Digitalizado({
          norden: form.norden,
          nombre: form.nombres,
          edad: form.edad,
          fecha: form.fecha,
          txtmuestra: form.muestra,
          txtcolor: form.color,
          txtconsistencia: form.consistencia,
          txtmoco_fecal: form.moco_fecal,
          txtsangrev: form.sangrev,
          txtrestosa: form.restosa,
          txtleucocitos: form.leucocitos,
          txthematies: form.hematies,
          txtparasitos: form.parasitos,
          txtgotasg: form.gotasg,
          txtlevaduras: form.levaduras,
          txtidentificacion: form.identificacion,
          txtflorac: form.florac,
          txtresultado: form.resultado,
          txtobservaciones: form.observaciones,
          sede: form.sede
        });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Coprocultivo</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input className="border rounded px-2 py-1 flex-1" name="norden" value={form.norden} onChange={handleInputChange}
            onKeyUp={(event) => {if(event.key === 'Enter')VerifyTR(form.norden,'ac_coprocultivo',token,setForm,selectedSede)}} />
            <button type="button" className="ml-2 bg-gray-200 px-3 py-1 rounded border border-gray-300 flex items-center gap-1"><FontAwesomeIcon icon={faEdit} /> Editar</button>
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Fecha:</label>
            <input type="date" className="border rounded px-2 py-1 flex-1" name="fecha" value={form.fecha} onChange={handleInputChange} ref={fechaRef} onFocus={handleFechaFocus} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nombres:</label>
            <input className="border rounded px-2 py-1 flex-1" name="nombres" value={form.nombres} onChange={handleInputChange} disabled />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Edad:</label>
            <input className="border rounded px-2 py-1 w-24" name="edad" value={form.edad} onChange={handleInputChange} disabled />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Muestra */}
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">MUESTRA</legend>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Muestra:</label><input className="border rounded px-2 py-1 flex-1" name="muestra" value={form.muestra} onChange={handleInputChange} readOnly /></div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Color:</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" name="color" value="Marrón" checked={form.color.includes("Marrón")} onChange={handleInputChange} /> Marrón</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="color" value="Mostaza" checked={form.color.includes("Mostaza")} onChange={handleInputChange} /> Mostaza</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="color" value="Verdoso" checked={form.color.includes("Verdoso")} onChange={handleInputChange} /> Verdoso</label>
              </div>
            </div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Consistencia:</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" name="consistencia" value="Sólido" checked={form.consistencia.includes("Sólido")} onChange={handleInputChange} /> Sólido</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="consistencia" value="Semisólido" checked={form.consistencia.includes("Semisólido")} onChange={handleInputChange} /> Semisólido</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="consistencia" value="Diarreico" checked={form.consistencia.includes("Diarreico")} onChange={handleInputChange} /> Diarreico</label>
              </div>
            </div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Moco Fecal:</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" name="moco_fecal" value="Ausente" checked={form.moco_fecal.includes("Ausente")} onChange={handleInputChange} /> Ausente</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="moco_fecal" value="Presente" checked={form.moco_fecal.includes("Presente")} onChange={handleInputChange} /> Presente</label>
              </div>
            </div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Sangre Visible:</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" name="sangrev" value="Ausente" checked={form.sangrev.includes("Ausente")} onChange={handleInputChange} /> Ausente</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="sangrev" value="Presente" checked={form.sangrev.includes("Presente")} onChange={handleInputChange} /> Presente</label>
              </div>
            </div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Restos Alim.:</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" name="restosa" value="Ausente" checked={form.restosa.includes("Ausente")} onChange={handleInputChange} /> Ausente</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="restosa" value="Presente" checked={form.restosa.includes("Presente")} onChange={handleInputChange} /> Presente</label>
              </div>
            </div>
          </fieldset>
          {/* Examen Microscópico */}
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">EXAMEN MICROSCÓPICO</legend>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Leucocitos:</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="leucocitos" value="No se observan" checked={form.leucocitos === "No se observan"} onChange={handleInputChange} /> No se observan</label>
              <input className="border rounded px-2 py-1 w-24 ml-2" name="leucocitos" value={form.leucocitos} onChange={handleInputChange} placeholder="__x campo" />
            </div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Hematíes:</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="hematies" value="No se observan" checked={form.hematies === "No se observan"} onChange={handleInputChange} /> No se observan</label>
              <input className="border rounded px-2 py-1 w-24 ml-2" name="hematies" value={form.hematies} onChange={handleInputChange} placeholder="__x campo" />
            </div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Parásitos:</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="parasitos" value="Ausente" checked={form.parasitos === "Ausente"} onChange={handleInputChange} /> Ausente</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="parasitos" value="Presente" checked={form.parasitos === "Presente"} onChange={handleInputChange} /> Presente</label>
            </div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Gotas de grasa:</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="gotasg" value="Ausente" checked={form.gotasg === "Ausente"} onChange={handleInputChange} /> Ausente</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="gotasg" value="Presente" checked={form.gotasg === "Presente"} onChange={handleInputChange} /> Presente</label>
            </div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Levaduras:</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="levaduras" value="Ausente" checked={form.levaduras === "Ausente"} onChange={handleInputChange} /> Ausente</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="levaduras" value="Presente" checked={form.levaduras === "Presente"} onChange={handleInputChange} /> Presente</label>
            </div>
          </fieldset>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Identificación y antibiograma */}
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">IDENTIFICACIÓN Y ANTIBIOGRAMA</legend>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Identificación:</label><input className="border rounded px-2 py-1 flex-1" name="identificacion" value={form.identificacion} onChange={handleInputChange} readOnly /></div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Flora Coliforme:</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="florac" value="Presente" checked={form.florac.includes("Presente")} onChange={handleInputChange} /> Presente</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="florac" value="Regular cantidad" checked={form.florac.includes("Regular cantidad")} onChange={handleInputChange} /> Regular cantidad</label>
            </div>
          </fieldset>
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">IDENTIFICACIÓN Y ANTIBIOGRAMA</legend>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Resultado:</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="resultado" value="Negativo" checked={form.resultado.includes("Negativo")} onChange={handleInputChange} /> Negativo</label>
              <label className="flex items-center gap-1"><input type="checkbox" name="resultado" value="Positivo" checked={form.resultado.includes("Positivo")} onChange={handleInputChange} /> Positivo</label>
            </div>
          </fieldset>
        </div>
        <div className="mb-2">
          <label className="font-semibold text-blue-900 text-sm">Observaciones:</label>
          <textarea className="border rounded px-2 py-1 w-full bg-blue-50 text-gray-700" rows={3} name="observaciones" value={form.observaciones} onChange={handleInputChange} />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
          <div className="flex gap-3">
            <button type="button" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold"><FontAwesomeIcon icon={faSave} /> Guardar/Actualizar</button>
            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold" onClick={handleLimpiar}><FontAwesomeIcon icon={faBroom} /> Limpiar</button>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
            <div className="flex gap-1 mt-1">
              <input className="border rounded px-2 py-1 w-24" />
              <button type="button" className="bg-gray-200 px-2 py-1 rounded border border-gray-300" onClick={handleImprimir}><FontAwesomeIcon icon={faPrint} /></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Coprocultivo; 