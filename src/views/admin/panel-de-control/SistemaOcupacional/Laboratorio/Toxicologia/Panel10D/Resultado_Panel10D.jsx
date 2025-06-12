// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Toxicologia/Panel10D/Rseultado_Panel10D.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const pruebas10D = [
  'COCAINA (COC)',
  'MARIHUANA (THC)',
  'ANFETAMINA (AMP)',
  'METANFETAMINA (MET)',
  'BENZODIAZEPINA (BZO)',
  'OPIÁCEOS (OPI)',
  'BARBITÚRICOS (BAR)',
  'METADONA (MTD)',
  'FENCICLIDINA (PCP)',
  'ANTIDEPRESIVOS TRICÍCLICOS (TCA)',
];

const Rseultado_Panel10D = ({ initialData = {}, apiBase }) => {
  const [form, setForm] = useState({
    nroFicha: '',
    fecha: '',
    nombres: '',
    edad: '',
    resultados: pruebas10D.map(() => 'NEGATIVO'),
    ...initialData
  });
  const fechaRef = useRef(null);

  useEffect(() => {
    if (initialData.nroFicha) {
      setForm(f => ({ ...f, ...initialData }));
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleResultadoChange = (idx, value) => {
    setForm(f => {
      const resultados = [...f.resultados];
      resultados[idx] = value;
      return { ...f, resultados };
    });
  };

  const handleLimpiar = () => {
    setForm({
      nroFicha: '',
      fecha: '',
      nombres: '',
      edad: '',
      resultados: pruebas10D.map(() => 'NEGATIVO'),
    });
  };

  const handleFechaFocus = e => {
    e.target.showPicker?.();
  };

  const handleSave = async () => {
    await fetch(`${apiBase}/toxicologia/10d`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    // manejar respuesta, notificaciones, etc.
  };

  const handlePrint = () => {
    window.open(`${apiBase}/toxicologia/10d/print/${form.nroFicha}`, '_blank');
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
            name="nroFicha"
            value={form.nroFicha}
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
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Nombres:</label>
          <input
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            disabled
            style={{ width: nameWidth }}
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
          value="MÉTODO: INMUNOCROMATOGRÁFICO"
          readOnly
        />
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8">
        <div className="font-bold">PRUEBAS</div>
        <div className="font-bold">RESULTADOS</div>
        {pruebas10D.map((label, idx) => (
          <React.Fragment key={label}>
            <div className="flex items-center">{label}</div>
            <input
              className="border rounded px-3 py-2 w-40"
              value={form.resultados[idx]}
              onChange={e => handleResultadoChange(idx, e.target.value)}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Botones */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2 mr-8">
          <span className="font-semibold text-blue-900 italic">IMPRIMIR</span>
          <input className="border rounded px-3 py-2 w-28" />
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
          onClick={handleSave}
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
