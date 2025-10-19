
export default function CriteriosPsicologicosI({
  form,
  handleRadioButton,
}) {

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ASPECTO INTELECTUAL */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center bg-red-100 text-red-800 py-2 rounded">
            ASPECTO INTELECTUAL
          </h3>

          {/* Tabla de aspectos intelectuales */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {/* Encabezados de columna */}
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              <div className="p-3 font-semibold text-gray-700 col-span-2"></div>
              <div className="p-3 text-center font-semibold text-gray-700">I</div>
              <div className="p-3 text-center font-semibold text-gray-700">NP1</div>
              <div className="p-3 text-center font-semibold text-gray-700">NP</div>
              <div className="p-3 text-center font-semibold text-gray-700">NPS</div>
              <div className="p-3 text-center font-semibold text-gray-700">S</div>
            </div>

            {/* Fila 1: Razonamiento y resolución de problemas */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">1. Razonamiento y resolución de problemas</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="razonamientoProblemas"
                  value="I"
                  checked={form?.razonamientoProblemas === "I"}
                  onChange={(e) => handleRadioButton(e, "I")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="razonamientoProblemas"
                  value="NP1"
                  checked={form?.razonamientoProblemas === "NP1"}
                  onChange={(e) => handleRadioButton(e, "NP1")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="razonamientoProblemas"
                  value="NP"
                  checked={form?.razonamientoProblemas === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="razonamientoProblemas"
                  value="NPS"
                  checked={form?.razonamientoProblemas === "NPS"}
                  onChange={(e) => handleRadioButton(e, "NPS")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="razonamientoProblemas"
                  value="S"
                  checked={form?.razonamientoProblemas === "S"}
                  onChange={(e) => handleRadioButton(e, "S")}
                />
              </div>
            </div>

            {/* Fila 2: Memoria */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">2. Memoria</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="memoria"
                  value="I"
                  checked={form?.memoria === "I"}
                  onChange={(e) => handleRadioButton(e, "I")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="memoria"
                  value="NP1"
                  checked={form?.memoria === "NP1"}
                  onChange={(e) => handleRadioButton(e, "NP1")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="memoria"
                  value="NP"
                  checked={form?.memoria === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="memoria"
                  value="NPS"
                  checked={form?.memoria === "NPS"}
                  onChange={(e) => handleRadioButton(e, "NPS")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="memoria"
                  value="S"
                  checked={form?.memoria === "S"}
                  onChange={(e) => handleRadioButton(e, "S")}
                />
              </div>
            </div>

            {/* Fila 3: Atención y concentración */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">3. Atención y concentración</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="atencionConcentracion"
                  value="I"
                  checked={form?.atencionConcentracion === "I"}
                  onChange={(e) => handleRadioButton(e, "I")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="atencionConcentracion"
                  value="NP1"
                  checked={form?.atencionConcentracion === "NP1"}
                  onChange={(e) => handleRadioButton(e, "NP1")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="atencionConcentracion"
                  value="NP"
                  checked={form?.atencionConcentracion === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="atencionConcentracion"
                  value="NPS"
                  checked={form?.atencionConcentracion === "NPS"}
                  onChange={(e) => handleRadioButton(e, "NPS")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="atencionConcentracion"
                  value="S"
                  checked={form?.atencionConcentracion === "S"}
                  onChange={(e) => handleRadioButton(e, "S")}
                />
              </div>
            </div>

            {/* Fila 4: Coordinación viso-motora */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">4. Coordinación viso-motora</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="coordinacionVisoMotora"
                  value="I"
                  checked={form?.coordinacionVisoMotora === "I"}
                  onChange={(e) => handleRadioButton(e, "I")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="coordinacionVisoMotora"
                  value="NP1"
                  checked={form?.coordinacionVisoMotora === "NP1"}
                  onChange={(e) => handleRadioButton(e, "NP1")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="coordinacionVisoMotora"
                  value="NP"
                  checked={form?.coordinacionVisoMotora === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="coordinacionVisoMotora"
                  value="NPS"
                  checked={form?.coordinacionVisoMotora === "NPS"}
                  onChange={(e) => handleRadioButton(e, "NPS")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="coordinacionVisoMotora"
                  value="S"
                  checked={form?.coordinacionVisoMotora === "S"}
                  onChange={(e) => handleRadioButton(e, "S")}
                />
              </div>
            </div>

            {/* Fila 5: Orientación espacial */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">5. Orientación espacial</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionEspacial"
                  value="I"
                  checked={form?.orientacionEspacial === "I"}
                  onChange={(e) => handleRadioButton(e, "I")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionEspacial"
                  value="NP1"
                  checked={form?.orientacionEspacial === "NP1"}
                  onChange={(e) => handleRadioButton(e, "NP1")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionEspacial"
                  value="NP"
                  checked={form?.orientacionEspacial === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionEspacial"
                  value="NPS"
                  checked={form?.orientacionEspacial === "NPS"}
                  onChange={(e) => handleRadioButton(e, "NPS")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionEspacial"
                  value="S"
                  checked={form?.orientacionEspacial === "S"}
                  onChange={(e) => handleRadioButton(e, "S")}
                />
              </div>
            </div>

            {/* Fila 6: Comprensión verbal */}
            <div className="grid grid-cols-7  hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">6. Comprensión verbal</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="comprensionVerbal"
                  value="I"
                  checked={form?.comprensionVerbal === "I"}
                  onChange={(e) => handleRadioButton(e, "I")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="comprensionVerbal"
                  value="NP1"
                  checked={form?.comprensionVerbal === "NP1"}
                  onChange={(e) => handleRadioButton(e, "NP1")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="comprensionVerbal"
                  value="NP"
                  checked={form?.comprensionVerbal === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="comprensionVerbal"
                  value="NPS"
                  checked={form?.comprensionVerbal === "NPS"}
                  onChange={(e) => handleRadioButton(e, "NPS")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="comprensionVerbal"
                  value="S"
                  checked={form?.comprensionVerbal === "S"}
                  onChange={(e) => handleRadioButton(e, "S")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ASPECTOS PERSONALIDAD */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center bg-blue-100 text-blue-800 py-2 rounded">
            ASPECTOS PERSONALIDAD
          </h3>

          {/* Tabla de aspectos personalidad */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {/* Encabezados de columna */}
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              <div className="p-3 font-semibold text-gray-700 col-span-2"></div>
              <div className="p-3 text-center font-semibold text-gray-700">B</div>
              <div className="p-3 text-center font-semibold text-gray-700">NPB</div>
              <div className="p-3 text-center font-semibold text-gray-700">NP</div>
              <div className="p-3 text-center font-semibold text-gray-700">NPA</div>
              <div className="p-3 text-center font-semibold text-gray-700">A</div>
            </div>

            {/* Fila 1: Estabilidad Emocional */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">1. Estabilidad Emocional</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="estabilidadEmocional"
                  value="B"
                  checked={form?.estabilidadEmocional === "B"}
                  onChange={(e) => handleRadioButton(e, "B")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="estabilidadEmocional"
                  value="NPB"
                  checked={form?.estabilidadEmocional === "NPB"}
                  onChange={(e) => handleRadioButton(e, "NPB")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="estabilidadEmocional"
                  value="NP"
                  checked={form?.estabilidadEmocional === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="estabilidadEmocional"
                  value="NPA"
                  checked={form?.estabilidadEmocional === "NPA"}
                  onChange={(e) => handleRadioButton(e, "NPA")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="estabilidadEmocional"
                  value="A"
                  checked={form?.estabilidadEmocional === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
            </div>

            {/* Fila 2: Tolerancia a la Frustración */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">2. Tolerancia a la Frustración</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="toleranciaFrustracion"
                  value="B"
                  checked={form?.toleranciaFrustracion === "B"}
                  onChange={(e) => handleRadioButton(e, "B")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="toleranciaFrustracion"
                  value="NPB"
                  checked={form?.toleranciaFrustracion === "NPB"}
                  onChange={(e) => handleRadioButton(e, "NPB")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="toleranciaFrustracion"
                  value="NP"
                  checked={form?.toleranciaFrustracion === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="toleranciaFrustracion"
                  value="NPA"
                  checked={form?.toleranciaFrustracion === "NPA"}
                  onChange={(e) => handleRadioButton(e, "NPA")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="toleranciaFrustracion"
                  value="A"
                  checked={form?.toleranciaFrustracion === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
            </div>

            {/* Fila 3: Autoestima */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">3. Autoestima</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autoestima"
                  value="B"
                  checked={form?.autoestima === "B"}
                  onChange={(e) => handleRadioButton(e, "B")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autoestima"
                  value="NPB"
                  checked={form?.autoestima === "NPB"}
                  onChange={(e) => handleRadioButton(e, "NPB")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autoestima"
                  value="NP"
                  checked={form?.autoestima === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autoestima"
                  value="NPA"
                  checked={form?.autoestima === "NPA"}
                  onChange={(e) => handleRadioButton(e, "NPA")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autoestima"
                  value="A"
                  checked={form?.autoestima === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
            </div>

            {/* Fila 4: Asertividad */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">4. Asertividad</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="asertividad"
                  value="B"
                  checked={form?.asertividad === "B"}
                  onChange={(e) => handleRadioButton(e, "B")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="asertividad"
                  value="NPB"
                  checked={form?.asertividad === "NPB"}
                  onChange={(e) => handleRadioButton(e, "NPB")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="asertividad"
                  value="NP"
                  checked={form?.asertividad === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="asertividad"
                  value="NPA"
                  checked={form?.asertividad === "NPA"}
                  onChange={(e) => handleRadioButton(e, "NPA")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="asertividad"
                  value="A"
                  checked={form?.asertividad === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
            </div>

            {/* Fila 5: Ansiedad ESTADO */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">5. Ansiedad ESTADO</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadEstado"
                  value="B"
                  checked={form?.ansiedadEstado === "B"}
                  onChange={(e) => handleRadioButton(e, "B")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadEstado"
                  value="NPB"
                  checked={form?.ansiedadEstado === "NPB"}
                  onChange={(e) => handleRadioButton(e, "NPB")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadEstado"
                  value="NP"
                  checked={form?.ansiedadEstado === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadEstado"
                  value="NPA"
                  checked={form?.ansiedadEstado === "NPA"}
                  onChange={(e) => handleRadioButton(e, "NPA")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadEstado"
                  value="A"
                  checked={form?.ansiedadEstado === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
            </div>

            {/* Fila 6: Ansiedad RASGO */}
            <div className="grid grid-cols-7 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">6. Ansiedad RASGO</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadRasgo"
                  value="B"
                  checked={form?.ansiedadRasgo === "B"}
                  onChange={(e) => handleRadioButton(e, "B")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadRasgo"
                  value="NPB"
                  checked={form?.ansiedadRasgo === "NPB"}
                  onChange={(e) => handleRadioButton(e, "NPB")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadRasgo"
                  value="NP"
                  checked={form?.ansiedadRasgo === "NP"}
                  onChange={(e) => handleRadioButton(e, "NP")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadRasgo"
                  value="NPA"
                  checked={form?.ansiedadRasgo === "NPA"}
                  onChange={(e) => handleRadioButton(e, "NPA")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="ansiedadRasgo"
                  value="A"
                  checked={form?.ansiedadRasgo === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}