import React from 'react';

export default function ModalLevantarObservacion({ onClose, datos }) {
  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[850px] relative max-w-lg w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-lg font-bold mb-2">Levantar Observación</h2>
        <div className="mb-2">
          <div className="flex gap-4 items-center mb-1">
            <label className="font-semibold">N° Orden :</label>
            <input value={datos.nroOrden || ''} readOnly className="border rounded px-2 py-1 w-28 bg-yellow-100" />
            <label className="font-semibold ml-4">Fecha de Examen :</label>
            <input value={datos.fechaExamen || ''} readOnly className="border rounded px-2 py-1 w-36" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-0.5">
            <div>
              <label className="font-semibold">Examen Médico :</label>
              <input value={datos.examenMedico || ''} readOnly className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="font-semibold">DNI :</label>
              <input value={datos.dni || ''} readOnly className="border rounded px-2 py-1 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-0.5">
            <div>
              <label className="font-semibold">Nombres :</label>
              <input value={datos.nombres || ''} readOnly className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="font-semibold">Apellidos :</label>
              <input value={datos.apellidos || ''} readOnly className="border rounded px-2 py-1 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-0.5">
            <div>
              <label className="font-semibold">Fecha Nacimiento :</label>
              <input value={datos.fechaNacimiento || ''} readOnly className="border rounded px-2 py-1 w-full" />
            </div>
            <div></div>
          </div>
          {/* Empresa y Contrata en la misma fila */}
          <div className="grid grid-cols-2 gap-2 mb-0.5">
            <div>
              <label className="font-semibold">Empresa :</label>
              <input value={datos.empresa || ''} readOnly className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="font-semibold">Contrata :</label>
              <input value={datos.contrata || ''} readOnly className="border rounded px-2 py-1 w-full" />
            </div>
          </div>
        </div>
        {/* Sección de visión solo lectura */}
        <div className="border rounded p-4 bg-gray-50 mb-2">
          <div className="grid grid-cols-5 gap-2 mb-1 text-center font-semibold">
            <div></div>
            <div colSpan={2}>Sin Corregir</div>
            <div colSpan={2}>Corregida</div>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-1 text-center">
            <div></div>
            <div>O.D</div>
            <div>O.I</div>
            <div>O.D</div>
            <div>O.I</div>
          </div>
          {/* Visión de Cerca */}
          <div className="grid grid-cols-5 gap-2 mb-0.5 items-center">
            <label className="text-right pr-2">Visión de Cerca :</label>
            <input value={datos.visionCercaOD || ''} readOnly className="border rounded px-2 py-1" />
            <input value={datos.visionCercaOI || ''} readOnly className="border rounded px-2 py-1" />
            <input value={datos.visionCercaODC || ''} readOnly className="border rounded px-2 py-1" />
            <input value={datos.visionCercaOIC || ''} readOnly className="border rounded px-2 py-1" />
          </div>
          {/* Visión de Lejos */}
          <div className="grid grid-cols-5 gap-2 mb-0.5 items-center">
            <label className="text-right pr-2">Visión de Lejos :</label>
            <input value={datos.visionLejosOD || ''} readOnly className="border rounded px-2 py-1" />
            <input value={datos.visionLejosOI || ''} readOnly className="border rounded px-2 py-1" />
            <input value={datos.visionLejosODC || ''} readOnly className="border rounded px-2 py-1" />
            <input value={datos.visionLejosOIC || ''} readOnly className="border rounded px-2 py-1" />
          </div>
          {/* Visión de Colores */}
          <div className="grid grid-cols-5 gap-2 mb-0.5 items-center">
            <label className="text-right pr-2">Visión de Colores :</label>
            <input value={datos.visionColores || ''} readOnly className="border rounded px-2 py-1 col-span-2" />
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" checked={!!datos.normal} readOnly disabled className="mr-1" /> Normal
            </div>
          </div>
          {/* Visión Binocular */}
          <div className="grid grid-cols-5 gap-2 mb-0.5 items-center">
            <label className="text-right pr-2">Visión Binocular :</label>
            <input value={datos.visionBinocular || ''} readOnly className="border rounded px-2 py-1 col-span-2" />
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" checked={!!datos.conservado} readOnly disabled className="mr-1" /> Conservado
            </div>
          </div>
          {/* Reflejos Pupilares */}
          <div className="grid grid-cols-5 gap-2 mb-0.5 items-center">
            <label className="text-right pr-2">Reflejos Pupilares :</label>
            <input value={datos.reflejosPupilares || ''} readOnly className="border rounded px-2 py-1 col-span-2" />
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" checked={!!datos.ninguna} readOnly disabled className="mr-1" /> Ninguna
            </div>
          </div>
          {/* Enfermedades Oculares */}
          <div className="grid grid-cols-5 gap-2 mb-0.5 items-center">
            <label className="text-right pr-2">Enferm.Oculares :</label>
            <input value={datos.enfOculares || ''} readOnly className="border rounded px-2 py-1 col-span-2" />
            <div></div>
          </div>
          {/* PTERIG. checkboxes debajo de Enfermedades Oculares */}
          <div className="flex flex-row items-center gap-8 mt-1 mb-1 ml-36">
            <label className="flex items-center gap-1"><input type="checkbox" checked={!!datos.pterigDerec} readOnly disabled /> <span className="font-semibold">PTERIG.OJO DEREC</span></label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={!!datos.pterigIzq} readOnly disabled /> <span className="font-semibold">PTERIG. OJO IZQ</span></label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={!!datos.pterigBilateral} readOnly disabled /> <span className="font-semibold">PTERIG. BILATERAL</span></label>
          </div>
        </div>
        {/* Normal y Agudeza visual de lejos */}
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={!!datos.normalGeneral} readOnly disabled className="mr-1" /> Normal
        </div>
        <div className="mb-2">
          <label className="font-semibold">Agudeza visual de lejos:</label>
          <input value={datos.agudezaLejos || ''} readOnly className="border rounded px-2 py-1 w-full" />
        </div>
        <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Cerrar</button>
      </div>
    </div>
  );
} 