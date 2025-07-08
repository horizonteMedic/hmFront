import React from "react";

export default function Parte3Cuestionario({ form, setForm, onPrint, onSubmit, onClear }) {
  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <div className="space-y-6">
        {/* Pregunta 14 */}
        <div className="mb-4">
          <div className="font-bold mb-1" style={{fontSize:'13px'}}>14.- ¿Sufre de: hipertensión arterial diabetes mellitus, hipotiroidismo, insuficiencia renal crónica, enfermedades autoinmunes?</div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p14" value="SI" checked={form.p14 === 'SI'} onChange={e => setForm(f => ({ ...f, p14: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p14" value="NO" checked={form.p14 === 'NO'} onChange={e => setForm(f => ({ ...f, p14: e.target.value }))} /> NO
            </label>
          </div>
          {form.p14 === 'SI' && (
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Cuál?</label>
                <input name="p14_cual" value={form.p14_cual || ''} onChange={e => setForm(f => ({ ...f, p14_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[120px]" style={{fontSize:'13px'}}>¿Dónde lo diagnosticaron?</label>
                <input name="p14_donde" value={form.p14_donde || ''} onChange={e => setForm(f => ({ ...f, p14_donde: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Qué hizo?</label>
                <input name="p14_quehizo" value={form.p14_quehizo || ''} onChange={e => setForm(f => ({ ...f, p14_quehizo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
            </div>
          )}
        </div>

        {/* Pregunta 15 */}
        <div className="mb-4">
          <div className="font-bold mb-1" style={{fontSize:'13px'}}>15.- ¿Consume cigarrillos?</div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p15" value="SI" checked={form.p15 === 'SI'} onChange={e => setForm(f => ({ ...f, p15: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p15" value="NO" checked={form.p15 === 'NO'} onChange={e => setForm(f => ({ ...f, p15: e.target.value }))} /> NO
            </label>
            {form.p15 === 'SI' && (
              <div className="flex items-center gap-2 ml-4">
                <label className="min-w-[120px]" style={{fontSize:'13px'}}>¿Cuántos por mes?</label>
                <input name="p15_cuantos" value={form.p15_cuantos || ''} onChange={e => setForm(f => ({ ...f, p15_cuantos: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
            )}
          </div>
        </div>

        {/* Pregunta 16 */}
        <div className="mb-4">
          <div className="font-bold mb-1" style={{fontSize:'13px'}}>16.- ¿Ha realizado actividades de ?</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { label: 'Caza', name: 'p16_caza' },
              { label: 'Tiro al blanco', name: 'p16_tiro' },
              { label: 'Concurrencia frecuente a discotecas y/o bares', name: 'p16_discoteca' },
              { label: 'Uso de auriculares', name: 'p16_auriculares' },
              { label: 'Servicio militar', name: 'p16_militar' },
              { label: 'Boxeo', name: 'p16_boxeo' },
            ].map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <input type="checkbox" name={item.name} checked={!!form[item.name]} onChange={e => setForm(f => ({ ...f, [item.name]: !f[item.name] }))} />
                <label className="font-semibold" style={{fontSize:'13px'}}>{item.label}</label>
                <label className="ml-2" style={{fontSize:'13px'}}>¿Cuánto tiempo?</label>
                <input name={item.name + '_tiempo'} value={form[item.name + '_tiempo'] || ''} onChange={e => setForm(f => ({ ...f, [item.name + '_tiempo']: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px', minWidth: '120px'}} />
              </div>
            ))}
          </div>
        </div>

        {/* Controles finales */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex flex-col items-start border rounded p-2">
            <span className="font-bold mb-1" style={{fontSize:'13px'}}>Imprimir Cuestionario</span>
            <div className="flex items-center gap-2">
              <label className="font-semibold" style={{fontSize:'13px'}}>Nro Orden :</label>
              <input name="norden" value={form.norden} disabled className="border rounded px-2 py-1 bg-orange-100" style={{fontSize:'13px', width:'90px'}} />
              <button type="button" onClick={onPrint} className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded">🖨️</button>
            </div>
          </div>
          <div className="flex flex-col items-center border rounded p-2">
            <span className="font-bold mb-1" style={{fontSize:'13px'}}>Cuestionario Terminado</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onSubmit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2" style={{fontSize:'13px'}}>Agrega/Actualizar</button>
              <button type="button" onClick={onClear} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2" style={{fontSize:'13px'}}>Limpiar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 