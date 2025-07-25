import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export default function OftalmologiaOhla() {
  const [tab, setTab] = useState(0);
  return (
    <div className="w-full text-[11px]">
      <form className=" p-4 rounded w-full border mb-4">
        <div className="grid grid-cols-4 items-center gap-3 w-full">
          {/* Primera fila: solo los 4 campos principales */}
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">N° Orden :</label>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">Ex. Médico :</label>
            <input className="border rounded px-2 py-1  w-full" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">Fecha Ex :</label>
            <input type="date" className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">Fecha Nac :</label>
            <input type="date" className="border rounded px-2 py-1 w-full" />
          </div>
          {/* Segunda fila: Nombres, DNI */}
          <div className="flex items-center gap-4 col-span-3">
            <label className="font-semibold min-w-[65px]">Nombres :</label>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">DNI :</label>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          {/* Tercera fila: Empresa, Contrata */}
          <div className="flex items-center gap-4 col-span-2">
            <label className="font-semibold min-w-[65px]">Empresa :</label>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex items-center gap-4 col-span-2">
            <label className="font-semibold min-w-[65px]">Contrata :</label>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
        </div>
      </form>
      {/* Tabs */}
      <div className="flex border-b mb-2">
        <button
          onClick={() => setTab(0)}
          className={`px-4 py-2 font-semibold border-t border-l border-r rounded-t ${
            tab === 0 ? "bg-white" : "bg-gray-100"
          } ${tab === 0 ? "border-b-0" : "border-b"}`}
        >
          PARTE I
        </button>
        <button
          onClick={() => setTab(1)}
          className={`px-4 py-2 font-semibold border-t border-l border-r rounded-t ml-1 ${
            tab === 1 ? "bg-white" : "bg-gray-100"
          } ${tab === 1 ? "border-b-0" : "border-b"}`}
        >
          PARTE II
        </button>
        <button
          onClick={() => setTab(2)}
          className={`px-4 py-2 font-semibold border-t border-l border-r rounded-t ml-1 ${
            tab === 2 ? "bg-white" : "bg-gray-100"
          } ${tab === 2 ? "border-b-0" : "border-b"}`}
        >
          PARTE III
        </button>
      </div>
      {/* Contenido de los tabs */}
      <div className="bg-white border rounded-b p-6 oftalmo-13px">
        {tab === 0 && (
          <div className="grid grid-cols-2 gap-8">
            {/* Columna 1: Todo el bloque oftalmológico */}
            <div className="space-y-4">
              {/* Evaluación Oftalmológica */}
              <div className="border rounded p-4">
                <div className="text-blue-700 font-semibold text-center mb-2">
                  Evaluación Oftalmologica
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
                  <label>Párpados y Anexos:</label>
                  <select className="border rounded px-2 py-1">
                    <option>NORMAL</option>
                  </select>
                  <label>Corneas:</label>
                  <select className="border rounded px-2 py-1">
                    <option>NORMAL</option>
                  </select>
                  <label>Otros Hallazgos:</label>
                  <select className="border rounded px-2 py-1">
                    <option>NINGUNO</option>
                  </select>
                  <label>Conjuntivas:</label>
                  <select className="border rounded px-2 py-1">
                    <option>NORMAL</option>
                  </select>
                  <label>Cristalino:</label>
                  <select className="border rounded px-2 py-1">
                    <option>TRANSPARENTE</option>
                  </select>
                </div>
              </div>
              {/* Fondo de Ojo */}
              <div className="border rounded p-4">
                <div className="text-blue-700 font-semibold text-center mb-2">
                  FONDO DE OJO
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span>Normal</span>
                  <input
                    type="radio"
                    name="fondo_normal"
                    className="ml-2 text-[11px]"
                  />{" "}
                  <span className="ml-1 text-[11px]">OD</span>
                  <input
                    type="radio"
                    name="fondo_normal"
                    className="ml-4 text-[11px]"
                  />{" "}
                  <span className="ml-1 text-[11px]">OI</span>
                  <span className="ml-8 text-[11px]">Hallazgos:</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Anormal</span>
                  <input
                    type="radio"
                    name="fondo_anormal"
                    className="ml-2 text-[11px]"
                  />{" "}
                  <span className="ml-1 text-[11px]">OD</span>
                  <input
                    type="radio"
                    name="fondo_anormal"
                    className="ml-4 text-[11px]"
                  />{" "}
                  <span className="ml-1 text-[11px]">OI</span>
                  <input
                    className="border rounded px-2 py-1 ml-8 flex-1 min-w-[180px] text-[11px]"
                    value="N/A"
                    readOnly
                  />
                </div>
              </div>
              {/* PIO y Correctores Oculares */}
              <div className="flex gap-4">
                {/* PIO */}
                <div
                  className="border rounded p-3 bg-[#f5f5f5] flex flex-col justify-between min-w-[180px] max-w-[220px] w-full"
                  style={{ flex: "0 0 200px" }}
                >
                  <div className="text-blue-700 font-semibold text-center mb-2">
                    PIO:
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-[11px]">OD</span>
                      <input className="border rounded px-2 py-1 w-16 text-[11px]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-[11px]">OI</span>
                      <input className="border rounded px-2 py-1 w-16 text-[11px]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-[11px]">No Aplica</span>
                      <input
                        className="border rounded px-2 py-1 w-16 text-[11px]"
                        value="X"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                {/* Correctores Oculares */}
                <div className="border rounded p-3 bg-[#f5f5f5] flex-1 min-w-[320px]">
                  <div className="text-blue-700 font-semibold text-center mb-2">
                    Correctores Oculares
                  </div>
                  <div className="flex items-center gap-6 mb-2">
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="corrector"
                        className="text-[11px]"
                      />{" "}
                      SI
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="corrector"
                        className="text-[11px]"
                      />{" "}
                      NO
                    </label>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-1 text-[11px]">
                      <input type="checkbox" className="text-[11px]" /> Cerca
                    </label>
                    <span className="text-[11px] ml-2">
                      Si tiene lentes y no los trajo
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 text-[11px]">
                      <input type="checkbox" className="text-[11px]" /> Lejos
                    </label>
                    <div className="border rounded px-2 py-1 flex items-center gap-4 ml-2 bg-white">
                      <label className="flex items-center gap-1 text-[11px]">
                        <input type="checkbox" className="text-[11px]" /> NTCC
                      </label>
                      <label className="flex items-center gap-1 text-[11px]">
                        <input type="checkbox" className="text-[11px]" /> NTCL
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Columna 2: Antecedentes, test, refracción */}
            <div className="space-y-6">
              <div className="border rounded p-4 mb-2">
                <div className="oftalmo-title mb-2">Antecedentes</div>
                <div className="mb-2">
                  <label>Antecedentes personales importantes:</label>
                  <input
                    className="border rounded px-2 py-1 w-full mt-1"
                    value="NO REFIERE"
                    readOnly
                  />
                </div>
                <div>
                  <label>Antecedentes familiares importantes:</label>
                  <input
                    className="border rounded px-2 py-1 w-full mt-1"
                    value="NO REFIERE"
                    readOnly
                  />
                </div>
              </div>
              {/* Test de Evaluación Complementaria */}
              <div className="border rounded p-4">
                <div className="text-blue-700 font-semibold text-center mb-2">
                  TEST DE EVALUACIÓN COMPLEMENTARIA
                </div>
                <div className="grid grid-cols-[260px_1fr] gap-x-2 gap-y-1">
                  {/* Fila 1 */}
                  <span className="flex items-center h-8 text-[11px]">
                    Test de Ishihara (Colores)
                  </span>
                  <div className="flex gap-6 items-center h-8">
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="ishihara"
                        className="text-[11px]"
                      />{" "}
                      Normal
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="ishihara"
                        className="text-[11px]"
                      />{" "}
                      Anormal
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="ishihara"
                        className="text-[11px]"
                      />{" "}
                      N.C.
                    </label>
                  </div>
                  {/* Fila 2 */}
                  <span className="flex items-center h-8 text-[11px]">
                    Test de Colores Puros (Rojo-Amarillo-Verde)
                  </span>
                  <div className="flex gap-6 items-center h-8">
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="colores_puros"
                        className="text-[11px]"
                      />{" "}
                      Normal
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[11px]" />{" "}
                    <span className="ml-1 text-[11px]">Anormal</span>
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="colores_puros"
                        className="text-[11px]"
                      />{" "}
                      N.C.
                    </label>
                  </div>
                  {/* Fila 3 */}
                  <span className="flex items-center h-8 text-[11px]">
                    Estereopsia (Test Profundidad)
                  </span>
                  <div className="flex gap-2 items-center h-8">
                    <input className="border rounded px-2 py-1 text-[11px] w-16 mr-2" />
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="estereopsia"
                        className="text-[11px]"
                      />{" "}
                      Normal
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[11px]" />{" "}
                    <span className="ml-1 text-[11px]">Anormal</span>
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="estereopsia"
                        className="text-[11px]"
                      />{" "}
                      N.C.
                    </label>
                  </div>
                </div>
              </div>
              {/* Refracción */}
              <div className="border rounded p-4">
                <div className="oftalmo-title mb-2">REFRACCIÓN</div>
                <div className="flex items-center gap-8 mb-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="oftalmo-input" />{" "}
                    <span className="oftalmo-label">Aplica</span>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                      className="oftalmo-input"
                    />{" "}
                    <span className="oftalmo-label font-semibold">
                      No Aplica
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* De Lejos */}
                  <div className="border rounded p-2">
                    <div className="oftalmo-title mb-1">DE LEJOS</div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <div></div>
                      <span>SF</span>
                      <span>CIL.</span>
                      <span>EJE</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className="oftalmo-label">OD</span>
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className="oftalmo-label">OI</span>
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="oftalmo-label">DIP</span>
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                    </div>
                  </div>
                  {/* De Cerca */}
                  <div className="border rounded p-2">
                    <div className="oftalmo-title mb-1">DE CERCA</div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <div></div>
                      <span>SF</span>
                      <span>CIL.</span>
                      <span>EJE</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className="oftalmo-label">OD</span>
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className="oftalmo-label">OI</span>
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="oftalmo-label">DIP</span>
                      <input className="border rounded px-2 py-1 oftalmo-input w-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 1 && (
          <div className="grid grid-cols-2 gap-6">
            {/* Columna izquierda: Agudeza Visual y Diagnóstico */}
            <div>
              {/* Agudeza Visual Final */}
              <div>
                <div className="text-blue-700 font-semibold text-[11px] mb-1">
                  AGUDEZA <span className="text-red-600">VISUAL FINAL</span>{" "}
                  <span className="text-blue-700">(CON REFRACCIÓN)</span>
                </div>
                <div className="border rounded p-2 mb-4 w-[340px]">
                  <div className="grid grid-cols-3 gap-2 items-center mb-2">
                    <div></div>
                    <span className="text-center">OD</span>
                    <span className="text-center">OI</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center mb-1">
                    <span>De Lejos</span>
                    <input className="border rounded px-2 py-1 w-20 text-[11px]" />
                    <input className="border rounded px-2 py-1 w-20 text-[11px]" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <span>De Cerca</span>
                    <input className="border rounded px-2 py-1 w-20 text-[11px]" />
                    <input className="border rounded px-2 py-1 w-20 text-[11px]" />
                  </div>
                </div>
              </div>
              {/* Diagnóstico */}
              <div className="mt-2">
                <div className="font-semibold text-[11px] mb-1">
                  DIAGNÓSTICO
                </div>
                <div className="border rounded p-2">
                  <textarea className="w-full h-24 border rounded p-2 text-[11px] resize-none bg-[#f5f5f5]" />
                </div>
              </div>
            </div>
            {/* Columna derecha: Indicaciones y Restricciones */}
            <div className="flex flex-col gap-4">
              {/* Indicaciones */}
              <div className="border rounded p-2 bg-[#f5f5f5]">
                <div className="text-blue-700 font-semibold text-[11px] mb-1">
                  INDICACIONES
                </div>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Ninguna
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Uso de
                    Correctores Oculares Cerca
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Uso de
                    Correctores Oculares Lejos (Trabajos de Oficina)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Control
                    complementario por Oftalmología : Lentes correctores - Cerca
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Control
                    complementario por Oftalmología : Lentes correctores - Lejos
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Lentes:
                    Cambio de Lunas
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Pterigion
                    III° - IV°
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Otras
                  </label>
                </div>
              </div>
              {/* Restricciones */}
              <div className="border rounded p-2 bg-[#f5f5f5]">
                <div className="font-semibold text-[11px] mb-1">
                  <span className="text-blue-700">RESTRICCIONES</span>{" "}
                  <span className="text-red-600">
                    (Aplican al entorno laboral)
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> No
                    restringe actividades labores en el puesto de trabajo
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Uso de
                    Correctores Oculares - Lejos
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> Uso de
                    Correctores Oculares - Cerca (Trabajos de Oficina)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> No
                    trabajos con cables eléctricos ni fibra óptica
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-[11px]" /> No
                    conducción vehicular
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="border rounded p-4 bg-white w-full">
          <div className="text-[11px]">
            {/* Encabezados */}
            <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center mb-1">
              <div></div>
              <div className="col-span-2 text-center font-semibold">
                Sin Correctores
              </div>
              <div className="col-span-2 text-center font-semibold">
                Con Correctores
              </div>
              <div className="col-span-2 text-center font-semibold">
                Con Agujero Estenopeico
              </div>
            </div>
            <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center mb-2">
              <div></div>
              <div className="text-center">O.D</div>
              <div className="text-center">O.I</div>
              <div className="text-center">O.D</div>
              <div className="text-center">O.I</div>
              <div className="text-center">O.D</div>
              <div className="text-center">O.I</div>
            </div>

            {/* Visión de Cerca */}
            <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center mb-1">
              <div className="whitespace-nowrap">Visión de Cerca :</div>
              {[...Array(6)].map((_, i) => (
                <input
                  key={`vc-${i}`}
                  className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] text-center"
                />
              ))}
            </div>

            {/* Visión de Lejos */}
            <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center mb-1">
              <div className="whitespace-nowrap">Visión de Lejos :</div>
              {[...Array(6)].map((_, i) => (
                <input
                  key={`vl-${i}`}
                  className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] text-center"
                />
              ))}
            </div>

            {/* Binocular + Reflejos Pupilares */}
            <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center">
              <div className="whitespace-nowrap">Binocular (Reev.)</div>
              <input className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] text-center" />
              <div></div>
              <input className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] text-center" />
              <div></div>
              <div className="text-right font-semibold whitespace-nowrap col-span-1">
                Reflejos Pupilares :
              </div>
              <input className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
