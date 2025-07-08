import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const AudiometriaFichaAudiologica = () => {
  // Estado para los datos del formulario (antes era data fijo)
  const [form, setForm] = useState({
    norden: '12345',
    fecha: '2024-06-01',
    tipoExamen: 'Preocupacional',
    apellidosNombres: 'Juan Pérez García',
    edad: '35',
    sexo: 'Masculino',
    ocupacion: 'Operario',
    aniosTrabajo: '5',
    mesesTrabajo: '3',
    empresaContratista: 'Contratista SAC',
    empresa: 'Empresa Principal S.A.',
    otoscopia: 'Normal',
    audiometroMarca: 'AMPLIVOX',
    audiometroModelo: 'AMPLIVOX 270',
    audiometroCalibracion: '2024-01-15',
    tiempoExposicion: '',
    h_d: false,
    min_d: false,
    noExamen: false,
    bellPlus: false,
  });

  // Helpers para parsear y actualizar el input inteligentemente
  const parseExposicion = (input) => {
    // Devuelve { hd: '', min: '' }
    const hdMatch = input.match(/(\d+)\s*H\/D/i);
    const minMatch = input.match(/(\d+)\s*MIN\/D/i);
    return {
      hd: hdMatch ? hdMatch[1] : '',
      min: minMatch ? minMatch[1] : '',
    };
  };

  const buildExposicion = (hd, min, h_d, min_d) => {
    let parts = [];
    if (h_d && hd) parts.push(`${hd} H/D`);
    if (min_d && min) parts.push(`${min} MIN/D`);
    return parts.join(' ');
  };

  // Cuando el usuario edita el input manualmente
  const handleExposicionInput = (e) => {
    const value = e.target.value;
    const parsed = parseExposicion(value);
    setForm(f => ({
      ...f,
      tiempoExposicion: value,
      // Si el usuario borra el sufijo, deschequea el checkbox
      h_d: value.toUpperCase().includes('H/D'),
      min_d: value.toUpperCase().includes('MIN/D'),
    }));
  };

  // Cuando el usuario marca/desmarca H/D
  const handleCheckHD = (checked) => {
    const { hd, min } = parseExposicion(form.tiempoExposicion);
    let newHd = hd;
    // Si no hay número para H/D, intenta tomar el primer número
    if (checked && !hd) {
      const firstNum = form.tiempoExposicion.match(/\d+/);
      newHd = firstNum ? firstNum[0] : '';
    }
    setForm(f => ({
      ...f,
      h_d: checked,
      tiempoExposicion: buildExposicion(checked ? newHd : '', min, checked, f.min_d),
    }));
  };

  // Cuando el usuario marca/desmarca MIN/D
  const handleCheckMinD = (checked) => {
    const { hd, min } = parseExposicion(form.tiempoExposicion);
    let newMin = min;
    // Si no hay número para MIN/D, intenta tomar el segundo número
    if (checked && !min) {
      // Busca el segundo número
      const nums = form.tiempoExposicion.match(/\d+/g);
      newMin = nums && nums.length > 1 ? nums[1] : '';
    }
    setForm(f => ({
      ...f,
      min_d: checked,
      tiempoExposicion: buildExposicion(hd, checked ? newMin : '', f.h_d, checked),
    }));
  };

  // Función para guardar (placeholder)
  const handleSave = () => {
    // Aquí iría la lógica real de guardado
    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'Los datos han sido guardados/actualizados correctamente.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Función para imprimir (placeholder)
  const handlePrint = () => {
    if (!form.norden) {
      Swal.fire('Error', 'Debe colocar un N° Orden', 'error');
      return;
    }
    Swal.fire({
      title: '¿Desea Imprimir Ficha Audiológica?',
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
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
        // Aquí iría la función real de impresión, por ahora solo un mensaje
        Swal.fire({
          icon: 'info',
          title: 'Imprimiendo...',
          text: `Se imprimiría la ficha N° Orden: ${form.norden}`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Función para limpiar (opcional, solo resetea los campos editables)
  const handleClear = () => {
    // Si tienes campos editables, aquí los puedes limpiar
    Swal.fire({
      icon: 'info',
      title: 'Limpiar',
      text: 'Función de limpiar implementada (placeholder).',
      timer: 1000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="w-full bg-white rounded shadow p-4 border border-gray-200 mb-4">
      <div className="w-full flex flex-row flex-nowrap gap-4" style={{fontSize:'12px'}}>
        {/* Columna 1 */}
        <div className="basis-[65%] min-w-0 " style={{fontSize:'12px'}}>
          {/* Fila 1 */}
          <div className="flex flex-row gap-4 items-center flex-wrap min-w-0 mb-2">
            <label className="font-bold min-w-[80px]">Nro Orden :</label>
            <input value={form.norden} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100" style={{fontSize:'12px', width:'90px'}} />
            <label className="font-bold ml-2">Fecha de Examen :</label>
            <input value={form.fecha} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100" style={{fontSize:'12px', width:'120px'}} />
            <label className="font-bold ml-2">Tipo de Examen :</label>
            <input value={form.tipoExamen} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100" style={{fontSize:'12px', width:'120px'}} />
            <input
              type="checkbox"
              checked={form.noExamen}
              onChange={e => setForm(f => ({ ...f, noExamen: e.target.checked }))}
              className="ml-2"
            />
            <span className="text-red-600 font-bold" style={{fontSize:'12px'}}>No Examen</span>
          </div>
          {/* Fila 2 */}
          <div className="flex flex-row gap-4 items-center flex-wrap min-w-0 mb-2">
            <label className="font-bold min-w-[130px]">Apellidos y Nombres :</label>
            <input value={form.apellidosNombres} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100 w-full max-w-[250px]" style={{fontSize:'12px'}} />
            <label className="font-bold ml-2">Edad :</label>
            <input value={form.edad} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100" style={{fontSize:'12px', width:'50px'}} />
            <span style={{fontSize:'11px'}}>años</span>
            <input
              type="checkbox"
              checked={form.bellPlus}
              onChange={e => setForm(f => ({ ...f, bellPlus: e.target.checked }))}
              className="ml-2"
            />
            <span style={{fontSize:'11px'}}>BELL PLUS</span>
          </div>
          {/* Fila 3 */}
          <div className="flex flex-row gap-4 items-center flex-wrap min-w-0 mb-2">
            <label className="font-bold">Sexo :</label>
            <input value={form.sexo} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100" style={{fontSize:'12px', width:'80px'}} />
            <label className="font-bold ml-2">Ocupación :</label>
            <input value={form.ocupacion} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100" style={{fontSize:'12px', width:'140px'}} />
            <label className="font-bold ml-2">Años Trabajo. :</label>
            <input value={form.aniosTrabajo} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100" style={{fontSize:'12px', width:'50px'}} />
            <label className="font-bold ml-2">y Meses :</label>
            <input value={form.mesesTrabajo} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100" style={{fontSize:'12px', width:'50px'}} />
          </div>
          {/* Fila 4 */}
          <div className="flex flex-row gap-4 items-center flex-wrap min-w-0 mb-2">
            <label className="font-bold min-w-[130px]">Empresa Contratista :</label>
            <input value={form.empresaContratista} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100 flex-1 max-w-[250px]" style={{fontSize:'12px'}} />
            <label className="font-bold ml-2 min-w-[80px]">Otoscopia :</label>
            <input value={form.otoscopia} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100 flex-1 max-w-[250px]" style={{fontSize:'12px'}} />
          </div>
          {/* Fila 5 */}
          <div className="flex flex-row gap-4 items-center flex-wrap min-w-0 mb-2">
            <label className="font-bold ml-2 min-w-[70px]">Empresa :</label>
            <input value={form.empresa} disabled className="border border-gray-400 rounded px-2 py-1 bg-gray-100 flex-1 max-w-[250px]" style={{fontSize:'12px'}} />
          </div>
        </div>
        {/* Columna 2 */}
        <div className="basis-[35%] min-w-0 flex flex-col gap-4" style={{fontSize:'12px'}}>
          <div className="flex flex-col gap-1 items-start">
            <label className="font-bold min-w-[220px] mb-1">Tiempo de exposición total ponderado:</label>
            <input
              type="text"
              value={form.tiempoExposicion}
              onChange={handleExposicionInput}
              className="border border-gray-400 rounded px-2 py-1 bg-white"
              style={{fontSize:'12px', width:'160px'}}
              placeholder="Ej: 8 H/D 30 MIN/D"
            />
            <div className="flex flex-row gap-4 mt-1">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.h_d}
                  onChange={e => handleCheckHD(e.target.checked)}
                />
                <span style={{fontSize:'11px'}}>H/D</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.min_d}
                  onChange={e => handleCheckMinD(e.target.checked)}
                />
                <span style={{fontSize:'11px'}}>MIN/D</span>
              </label>
            </div>
          </div>
          <fieldset className="border rounded p-2 min-w-[220px]" style={{fontSize:'12px'}}>
            <legend className="font-bold" style={{fontSize:'12px'}}>Audiómetro</legend>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label className="font-bold min-w-[60px]">Marca :</label>
                <input value={form.audiometroMarca} className="border border-gray-400 rounded px-2 py-1 bg-white" style={{fontSize:'12px', width:'110px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold min-w-[60px]">Modelo :</label>
                <input value={form.audiometroModelo} className="border border-gray-400 rounded px-2 py-1 bg-white" style={{fontSize:'12px', width:'110px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold min-w-[60px]">Calibración :</label>
                <input value={form.audiometroCalibracion} className="border border-gray-400 rounded px-2 py-1 bg-white" style={{fontSize:'12px', width:'110px'}} />
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      {/* --- NUEVO BLOQUE EN DOS COLUMNAS --- */}
      <div className="w-full flex flex-row flex-nowrap gap-4">
        {/* Columna Izquierda */}
        <div className="flex-1 min-w-0 bg-white rounded shadow p-4 border border-gray-200" style={{fontSize:'12px'}}>
          {/* Uso de protectores auditivos y apreciación del ruido */}
          <div className="flex flex-wrap gap-4 mb-2 items-center">
            <fieldset className="border rounded p-2 min-w-[220px] flex-1" style={{fontSize:'12px'}}>
              <legend className="font-bold" style={{fontSize:'12px'}}>Uso de protectores Auditivos</legend>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1"><input type="checkbox" checked /> Tapones</label>
                <label className="flex items-center gap-1"><input type="checkbox" /> Grajeras</label>
              </div>
            </fieldset>
            <fieldset className="border rounded p-2 min-w-[220px] flex-1" style={{fontSize:'12px'}}>
              <legend className="font-bold" style={{fontSize:'12px'}}>Apreciación del Ruido</legend>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1"><input type="radio" /> Ruido muy intenso</label>
                <label className="flex items-center gap-1"><input type="radio" checked /> Ruido moderado</label>
                <label className="flex items-center gap-1"><input type="radio" /> Ruido no molesto</label>
              </div>
            </fieldset>
          </div>
          {/* Antecedentes y Síntomas */}
          <div className="flex flex-row gap-4 mb-2">
            {/* Antecedentes */}
            <fieldset className="border rounded p-2 flex-1" style={{fontSize:'12px'}}>
              <legend className="font-bold" style={{fontSize:'12px'}}>ANTECEDENTES relacionados</legend>
              <table className="w-full">
                <tbody>
                  {[
                    'Consumo de tabaco',
                    'Servicio Militar',
                    'Hobbies con exposición a ruido',
                    'Exposición laboral a químicos',
                    'Infección al Oído',
                    'Uso de Ototoxicos',
                  ].map((item, idx) => (
                    <tr key={idx} style={{fontSize:'12px'}}>
                      <td className="pr-2" style={{fontSize:'12px'}}>{item}</td>
                      <td><input type="checkbox" /> </td>
                      <td><input type="checkbox" checked /> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-1" style={{fontSize:'12px'}}><span className="mr-8">SI</span>NO</div>
            </fieldset>
            {/* Síntomas */}
            <fieldset className="border rounded p-2 flex-1" style={{fontSize:'12px'}}>
              <legend className="font-bold" style={{fontSize:'12px'}}>SÍNTOMAS actuales</legend>
              <table className="w-full">
                <tbody>
                  {[
                    'Disminución de la audición',
                    'Dolor de Oídos',
                    'Zumbido',
                    'Mareos',
                    'Infección al Oído',
                    'Otra',
                  ].map((item, idx) => (
                    <tr key={idx} style={{fontSize:'12px'}}>
                      <td className="pr-2" style={{fontSize:'12px'}}>{item}</td>
                      <td><input type="checkbox" /> </td>
                      <td><input type="checkbox" checked /> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-1" style={{fontSize:'12px'}}><span className="mr-8">SI</span>NO</div>
            </fieldset>
          </div>
          {/* Datos de profesional y botones */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <label className="min-w-[270px]" style={{fontSize:'12px'}}>Nombre del profesional que realiza la audiometría :</label>
              <input  value="" className="border border-gray-400 rounded-lg px-3 py-1 bg-white flex-1" style={{fontSize:'12px'}} />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <label className="min-w-[100px]" style={{fontSize:'12px'}}>Conclusiones :</label>
              <input  value="" className="border border-gray-400 rounded-lg px-3 py-1 bg-white flex-1" style={{fontSize:'12px'}} />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <label className="min-w-[120px]" style={{fontSize:'12px'}}>Nombre del Médico :</label>
              <input  value="" className="border border-gray-400 rounded-lg px-3 py-1 bg-white flex-1" style={{fontSize:'12px'}} />
            </div>
          </div>
          <div className="flex gap-2 mt-4" style={{fontSize:'12px'}}>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border-none font-semibold bg-[#059669] text-white transition" style={{minWidth:'140px'}} onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} style={{ color: '#fff', fontSize: '12px' }} /> Guardar/Actualizar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border-none font-semibold bg-[#facc14] text-[#FFFFFF] transition" style={{minWidth:'120px'}} onClick={handleClear}>
              <FontAwesomeIcon icon={faBroom} style={{ color: 'white', fontSize: '12px' }} /> Limpiar
            </button>
          </div>
        </div>
        {/* Columna Derecha */}
        <div className="flex-1 min-w-0 bg-white rounded shadow p-4 border border-gray-200 flex flex-col gap-4" style={{fontSize:'12px'}}>
          {/* Diapasones */}
          <fieldset className="border rounded p-3 flex-1">
            <legend className="font-bold" style ={{fontSize:'12px'}}>DIAPASONES RINNE Y WEBER</legend>
            <div className="grid grid-cols-3 gap-2 items-center mb-1">
              <div></div>
              <div className="text-center font-bold" style={{width:'150px'}}>O.D</div>
              <div className="text-center font-bold" style={{width:'150px'}}>O.I</div>
            </div>
            {[
              { label: '250 Hz.', key: '250' },
              { label: '500 Hz.', key: '500' },
              { label: '1000 Hz.', key: '1000' },
            ].map((hz, idx) => (
              <div className="grid grid-cols-3 gap-2 items-center mb-1" key={hz.key}>
                <div className="text-left" style={{width:'90px'}}>{hz.label}</div>
                <input className="border border-gray-400 rounded-lg px-3 py-1 bg-white w-full max-w-[150px]" style={{fontSize:'12px'}} />
                <input className="border border-gray-400 rounded-lg px-3 py-1 bg-white w-full max-w-[150px]" style={{fontSize:'12px'}} />
              </div>
            ))}
          </fieldset>
          {/* Logoaudiometría */}
          <fieldset className="border rounded p-3 flex-1">
            <legend className="font-bold" style={{fontSize:'12px'}}>LOGOAUDIOMETRIA</legend>
            <div className="grid grid-cols-3 gap-2 items-center mb-1">
              <div></div>
              <div className="text-center font-bold" style={{width:'150px'}}>Derecha</div>
              <div className="text-center font-bold" style={{width:'150px'}}>Izquierda</div>
            </div>
            {[
              'Umbral de discriminación',
              '% de discriminación',
              'Umbral de Confort MCL',
              'Umbral de Disconfort UCL',
            ].map((label, idx) => (
              <div className="grid grid-cols-3 gap-2 items-center mb-1" key={label}>
                <div className="text-left" style={{width:'120px'}}>{label}</div>
                <input className="border border-gray-400 rounded-lg px-3 py-1 bg-white w-full max-w-[150px]" style={{fontSize:'12px'}} />
                <input className="border border-gray-400 rounded-lg px-3 py-1 bg-white w-full max-w-[150px]" style={{fontSize:'12px'}} />
              </div>
            ))}
          </fieldset>
          {/* Imprimir Audiológica */}
          <fieldset className="border rounded p-3 min-w-0">
            <legend className="font-bold" style={{fontSize:'12px'}}>Imprimir Audiologica</legend>
            <div className="flex items-center gap-2">
              <label className="font-bold min-w-[90px]" style={{ fontSize: '12px' }}>N° :</label>
              <input
                className="border rounded-lg px-3 py-2 bg-gray-100"
                style={{ fontSize: '12px', width: '100px', color: '#222', fontWeight: 'bold', outline: 'none' }}
              />
              <button
                type="button"
                className="ml-2 px-4 py-2.5 rounded-lg border-none bg-[#2664eb] transition text-white flex items-center justify-center"
                title="Imprimir Audiológica"
                onClick={handlePrint}
                style={{ fontSize: '12px' }}
              >
                <FontAwesomeIcon icon={faPrint} style={{ color: '#fff', fontSize: '12px' }} />
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default AudiometriaFichaAudiologica; 