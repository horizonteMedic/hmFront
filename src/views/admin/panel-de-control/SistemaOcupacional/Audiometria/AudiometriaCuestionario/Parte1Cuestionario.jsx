import React from "react";

export default function Parte1Cuestionario({ form, setForm }) {
  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">CUESTIONARIO DE AUDIOMETRÍA</h2>
      <div className="space-y-6">
        {/* Encabezado ordenado en dos filas */}
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex flex-row gap-8 items-center w-full">
            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="font-semibold min-w-[90px]" style={{fontSize:'13px'}}>Nro Orden :</label>
              <input name="norden" value={form.norden} onChange={e => setForm(f => ({ ...f, norden: e.target.value }))} className="border rounded px-2 py-1" style={{fontSize:'13px', width:'90px'}} />
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="font-semibold" style={{fontSize:'13px'}}>Fecha :</label>
              <input type="date" name="fecha" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className="border rounded px-2 py-1" style={{fontSize:'13px', width:'120px'}} />
            </div>
            <div className="flex items-center gap-2 min-w-[300px] flex-1">
              <label className="font-semibold" style={{fontSize:'13px'}}>Nombre Completo:</label>
              <input name="nombres" value={form.nombres} disabled className="border rounded px-2 py-1 bg-gray-100 flex-1" style={{fontSize:'13px'}} />
            </div>
          </div>
          <div className="flex flex-row gap-8 items-center w-full">
            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="font-semibold min-w-[90px]" style={{fontSize:'13px'}}>Edad :</label>
              <input name="edad" value={form.edad} disabled className="border rounded px-2 py-1 bg-gray-100" style={{fontSize:'13px', width:'70px'}} />
            </div>
            <div className="flex items-center gap-2 min-w-[300px]">
              <label className="font-semibold mr-2" style={{fontSize:'13px'}}>Género :</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
                  <input type="radio" name="genero" value="Masculino" checked={form.genero === 'Masculino'} onChange={e => setForm(f => ({ ...f, genero: e.target.value }))} /> Masculino
                </label>
                <label className="flex items-center gap-1 font-semibold" style={{fontSize:'13px'}}>
                  <input type="radio" name="genero" value="Femenino" checked={form.genero === 'Femenino'} onChange={e => setForm(f => ({ ...f, genero: e.target.value }))} /> Femenino
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="font-bold mb-2" style={{fontSize:'15px'}}>Antecedentes médicos:</div>

        {/* Pregunta 1 */}
        <div className="mb-4">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            1.- Tiene conocimiento de algún problema del oído y/o audición que haya tenido o haya sido diagnosticado y/o en estudio, así como : pérdida de audición, hipoacusia, otitis medio agudo, crónico, supurativo externo, presencia de secreción purulenta y/o sanguinolenta con o sin mal olor, escucha sonidos como pititos, soplidos del viento, sonido del mar, ócufenos, tinnitus mareos, vértigo, nauseas, rinitis alérgica parálisis facial, adormecimiento de hemicor, tumores del sistema nerviosos central.
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p1" value="SI" checked={form.p1 === 'SI'} onChange={e => setForm(f => ({ ...f, p1: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p1" value="NO" checked={form.p1 === 'NO'} onChange={e => setForm(f => ({ ...f, p1: e.target.value }))} /> NO
            </label>
          </div>
          {form.p1 === 'SI' && (
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Cuál?</label>
                <input name="p1_cual" value={form.p1_cual || ''} onChange={e => setForm(f => ({ ...f, p1_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Cuándo?</label>
                <input name="p1_cuando" value={form.p1_cuando || ''} onChange={e => setForm(f => ({ ...f, p1_cuando: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Qué Hizo?</label>
                <input name="p1_quehizo" value={form.p1_quehizo || ''} onChange={e => setForm(f => ({ ...f, p1_quehizo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
            </div>
          )}
        </div>

        {/* Pregunta 2 */}
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            2.- Ha realizado viaje o ha llegado de viaje en las 16 horas anteriores a esta entrevista y examen.
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p2" value="SI" checked={form.p2 === 'SI'} onChange={e => setForm(f => ({ ...f, p2: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p2" value="NO" checked={form.p2 === 'NO'} onChange={e => setForm(f => ({ ...f, p2: e.target.value }))} /> NO
            </label>
          </div>
        </div>

        {/* Pregunta 3 */}
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            3.- Ha estado escuchando música con audífonos en las 16 horas anteriores a esta entrevista o examen.
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p3" value="SI" checked={form.p3 === 'SI'} onChange={e => setForm(f => ({ ...f, p3: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p3" value="NO" checked={form.p3 === 'NO'} onChange={e => setForm(f => ({ ...f, p3: e.target.value }))} /> NO
            </label>
          </div>
        </div>

        {/* Pregunta 4 */}
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            4.- Se ha desplazado y/o movilizado en moto lineal y/o en vehículo con las ventanas abiertas.
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p4" value="SI" checked={form.p4 === 'SI'} onChange={e => setForm(f => ({ ...f, p4: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p4" value="NO" checked={form.p4 === 'NO'} onChange={e => setForm(f => ({ ...f, p4: e.target.value }))} /> NO
            </label>
          </div>
        </div>

        {/* Pregunta 5 */}
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            5.- Ha trabajado expuesto a ruido y/o vibraciones en las 16 horas anteriores a esta entrevista y examen.
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p5" value="SI" checked={form.p5 === 'SI'} onChange={e => setForm(f => ({ ...f, p5: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p5" value="NO" checked={form.p5 === 'NO'} onChange={e => setForm(f => ({ ...f, p5: e.target.value }))} /> NO
            </label>
          </div>
        </div>

        {/* Pregunta 6 */}
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            6.- Ha bebido bebidas alcohólicas y/o fumado cigarrillos en las 16 horas anteriores a esta entrevista y examen.
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p6" value="SI" checked={form.p6 === 'SI'} onChange={e => setForm(f => ({ ...f, p6: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p6" value="NO" checked={form.p6 === 'NO'} onChange={e => setForm(f => ({ ...f, p6: e.target.value }))} /> NO
            </label>
          </div>
        </div>

        {/* Pregunta 7 */}
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            7.- Ha estado despierto o trabajando en turno de noche 16 horas anteriores a esta entrevista y examen.
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p7" value="SI" checked={form.p7 === 'SI'} onChange={e => setForm(f => ({ ...f, p7: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p7" value="NO" checked={form.p7 === 'NO'} onChange={e => setForm(f => ({ ...f, p7: e.target.value }))} /> NO
            </label>
          </div>
        </div>

        {/* Pregunta 8 */}
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            8.- ¿Está resfriado con tos, con dolor auricular, fiebre y/u otra enfermedad respiratoria aguda.
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p8" value="SI" checked={form.p8 === 'SI'} onChange={e => setForm(f => ({ ...f, p8: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p8" value="NO" checked={form.p8 === 'NO'} onChange={e => setForm(f => ({ ...f, p8: e.target.value }))} /> NO
            </label>
          </div>
        </div>

        {/* Pregunta 9 */}
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1" style={{fontSize:'13px'}}>
            9.- ¿Le han practicado cirugía de oído (timpanoplastía, mastoidectomía, estapediectomía)?
          </div>
          <div className="flex items-center gap-8 mt-1 mb-2">
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p9" value="SI" checked={form.p9 === 'SI'} onChange={e => setForm(f => ({ ...f, p9: e.target.value }))} /> SI
            </label>
            <label className="flex items-center gap-1 text-base font-semibold" style={{fontSize:'13px'}}>
              <input type="radio" name="p9" value="NO" checked={form.p9 === 'NO'} onChange={e => setForm(f => ({ ...f, p9: e.target.value }))} /> NO
            </label>
          </div>
          {form.p9 === 'SI' && (
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Cuál?</label>
                <input name="p9_cual" value={form.p9_cual || ''} onChange={e => setForm(f => ({ ...f, p9_cual: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[120px]" style={{fontSize:'13px'}}>¿Dónde lo diagnosticaron?</label>
                <input name="p9_donde" value={form.p9_donde || ''} onChange={e => setForm(f => ({ ...f, p9_donde: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
              <div className="flex items-center gap-2">
                <label className="min-w-[60px]" style={{fontSize:'13px'}}>¿Qué Hizo?</label>
                <input name="p9_quehizo" value={form.p9_quehizo || ''} onChange={e => setForm(f => ({ ...f, p9_quehizo: e.target.value }))} className="border rounded px-2 py-1 flex-1" style={{fontSize:'13px'}} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 