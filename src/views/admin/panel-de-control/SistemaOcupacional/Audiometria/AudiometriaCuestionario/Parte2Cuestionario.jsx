import React from "react";

export default function Parte2Cuestionario({ form, setForm }) {
  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <div className="space-y-6">
        {/* Pregunta 10 */}
        <div className="mb-4">
          <div className="font-bold mb-1" style={{fontSize:'13px'}}>10.- ¿Ha tenido traumatismo craneoencefálico traumatismo en el oído?</div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p10" value="SI" checked={form.p10 === 'SI'} onChange={e => setForm(f => ({ ...f, p10: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p10" value="NO" checked={form.p10 === 'NO'} onChange={e => setForm(f => ({ ...f, p10: e.target.value }))} /> NO
            </label>
          </div>
          {form.p10 === 'SI' && (
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Cuál?</label>
                <input name="p10_cual" value={form.p10_cual || ''} onChange={e => setForm(f => ({ ...f, p10_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Dónde?</label>
                <input name="p10_donde" value={form.p10_donde || ''} onChange={e => setForm(f => ({ ...f, p10_donde: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Qué Hizo?</label>
                <input name="p10_quehizo" value={form.p10_quehizo || ''} onChange={e => setForm(f => ({ ...f, p10_quehizo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
            </div>
          )}
        </div>

        {/* Pregunta 11 */}
        <div className="mb-4">
          <div className="font-bold mb-1" style={{fontSize:'13px'}}>11.- ¿Ha consumido o consume medicamentos como: Clipatino, aminoglucósidos (bancomicina y amikacina) aspirina, furosemida y/o antituberculosos?</div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p11" value="SI" checked={form.p11 === 'SI'} onChange={e => setForm(f => ({ ...f, p11: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p11" value="NO" checked={form.p11 === 'NO'} onChange={e => setForm(f => ({ ...f, p11: e.target.value }))} /> NO
            </label>
          </div>
          {form.p11 === 'SI' && (
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Cuál?</label>
                <input name="p11_cual" value={form.p11_cual || ''} onChange={e => setForm(f => ({ ...f, p11_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[120px]" style={{fontSize:'13px'}}>¿Por cuanto tiempo?</label>
                <input name="p11_tiempo" value={form.p11_tiempo || ''} onChange={e => setForm(f => ({ ...f, p11_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
            </div>
          )}
        </div>

        {/* Pregunta 12 */}
        <div className="mb-4">
          <div className="font-bold mb-1" style={{fontSize:'13px'}}>12.- ¿Ha estado expuesto a solventes orgánicos (tolveno, xileno, disulfuro de carbono, plomo, mercurio, monóxido de carbono) plaguicidas, organofosforados y piretroides?</div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p12" value="SI" checked={form.p12 === 'SI'} onChange={e => setForm(f => ({ ...f, p12: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p12" value="NO" checked={form.p12 === 'NO'} onChange={e => setForm(f => ({ ...f, p12: e.target.value }))} /> NO
            </label>
          </div>
          {form.p12 === 'SI' && (
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Cuál?</label>
                <input name="p12_cual" value={form.p12_cual || ''} onChange={e => setForm(f => ({ ...f, p12_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[120px]" style={{fontSize:'13px'}}>¿Por cuanto tiempo?</label>
                <input name="p12_tiempo" value={form.p12_tiempo || ''} onChange={e => setForm(f => ({ ...f, p12_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
            </div>
          )}
        </div>

        {/* Pregunta 13 */}
        <div className="mb-4">
          <div className="font-bold mb-1" style={{fontSize:'13px'}}>13.- ¿Ha estado compuesto a vibraciones continuas?</div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p13" value="SI" checked={form.p13 === 'SI'} onChange={e => setForm(f => ({ ...f, p13: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p13" value="NO" checked={form.p13 === 'NO'} onChange={e => setForm(f => ({ ...f, p13: e.target.value }))} /> NO
            </label>
          </div>
          {form.p13 === 'SI' && (
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <label className="min-w-[120px]" style={{fontSize:'13px'}}>¿Cuánto tiempo?</label>
                <input name="p13_tiempo" value={form.p13_tiempo || ''} onChange={e => setForm(f => ({ ...f, p13_tiempo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Cuándo?</label>
                <input name="p13_cuando" value={form.p13_cuando || ''} onChange={e => setForm(f => ({ ...f, p13_cuando: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Dónde?</label>
                <input name="p13_donde" value={form.p13_donde || ''} onChange={e => setForm(f => ({ ...f, p13_donde: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 