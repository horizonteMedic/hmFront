import React from "react";

const ExamenFisicoIII2021 = ({ form, handleRadioButton, handleChange, handleChangeNumber }) => {
  return (
    <div className="space-y-6">
      {/* Contenido principal - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMNA IZQUIERDA - MANIOBRAS DE DESCARTE */}
        <div className="space-y-6">
          
          {/* Card 1: TINNEL Test */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-blue-900 text-center mb-4">
              TINNEL Test
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Parestesias en recorrido del N.Mediano
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Lado Derecho */}
              <div className="text-center">
                <span className="font-semibold text-blue-900 block mb-3">Derecha</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tinnelDerecha"
                      value="SI"
                      checked={form.tinnelDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tinnelDerecha"
                      value="NO"
                      checked={form.tinnelDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              
              {/* Lado Izquierdo */}
              <div className="text-center">
                <span className="font-semibold text-blue-900 block mb-3">Izquierda</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tinnelIzquierda"
                      value="SI"
                      checked={form.tinnelIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tinnelIzquierda"
                      value="NO"
                      checked={form.tinnelIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card 2: FINKELS-TEIN Test */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-blue-900 text-center mb-4">
              FINKELS-TEIN Test
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Dolor en Abductor Largo del pulgar
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Lado Derecho */}
              <div className="text-center">
                <span className="font-semibold text-blue-900 block mb-3">Derecha</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="finkelsTeinDerecha"
                      value="SI"
                      checked={form.finkelsTeinDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="finkelsTeinDerecha"
                      value="NO"
                      checked={form.finkelsTeinDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              
              {/* Lado Izquierdo */}
              <div className="text-center">
                <span className="font-semibold text-blue-900 block mb-3">Izquierda</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="finkelsTeinIzquierda"
                      value="SI"
                      checked={form.finkelsTeinIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="finkelsTeinIzquierda"
                      value="NO"
                      checked={form.finkelsTeinIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* COLUMNA DERECHA - EVAL. DINAMICA DE ARTICULACIONES */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-xl font-bold text-blue-900 text-center mb-4">
            EVAL. DINAMICA DE ARTICULACIONES
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-900">
                  <th className="text-left py-2 px-2 font-semibold text-blue-900">MOVILIDAD - DOLOR</th>
                  <th className="text-center py-2 px-2 font-semibold text-blue-900">Cadera derecha</th>
                  <th className="text-center py-2 px-2 font-semibold text-blue-900">Cadera izquierda</th>
                  <th className="text-center py-2 px-2 font-semibold text-blue-900">Rodilla derecha</th>
                  <th className="text-center py-2 px-2 font-semibold text-blue-900">Rodilla izquierda</th>
                </tr>
              </thead>
              <tbody>
                {/* Fila 1: Abducción */}
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium">Abducción</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="abduccionCaderaDerecha"
                      value={form.abduccionCaderaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="abduccionCaderaIzquierda"
                      value={form.abduccionCaderaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center bg-gray-100"
                      name="abduccionRodillaDerecha"
                      value={form.abduccionRodillaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                      disabled
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center bg-gray-100"
                      name="abduccionRodillaIzquierda"
                      value={form.abduccionRodillaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                      disabled
                    />
                  </td>
                </tr>
                
                {/* Fila 2: Aducción */}
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium">Aducción</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="aduccionCaderaDerecha"
                      value={form.aduccionCaderaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="aduccionCaderaIzquierda"
                      value={form.aduccionCaderaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center bg-gray-100"
                      name="aduccionRodillaDerecha"
                      value={form.aduccionRodillaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                      disabled
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center bg-gray-100"
                      name="aduccionRodillaIzquierda"
                      value={form.aduccionRodillaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                      disabled
                    />
                  </td>
                </tr>
                
                {/* Fila 3: Flexión */}
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium">Flexión</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="flexionCaderaDerecha"
                      value={form.flexionCaderaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="flexionCaderaIzquierda"
                      value={form.flexionCaderaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="flexionRodillaDerecha"
                      value={form.flexionRodillaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="flexionRodillaIzquierda"
                      value={form.flexionRodillaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                </tr>
                
                {/* Fila 4: Extensión */}
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium">Extensión</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="extensionCaderaDerecha"
                      value={form.extensionCaderaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="extensionCaderaIzquierda"
                      value={form.extensionCaderaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="extensionRodillaDerecha"
                      value={form.extensionRodillaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="extensionRodillaIzquierda"
                      value={form.extensionRodillaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                </tr>
                
                {/* Fila 5: Rot. Externa */}
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium">Rot. Externa</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="rotacionExternaCaderaDerecha"
                      value={form.rotacionExternaCaderaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="rotacionExternaCaderaIzquierda"
                      value={form.rotacionExternaCaderaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="rotacionExternaRodillaDerecha"
                      value={form.rotacionExternaRodillaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="rotacionExternaRodillaIzquierda"
                      value={form.rotacionExternaRodillaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                </tr>
                
                {/* Fila 6: Rot. Interna */}
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium">Rot. Interna</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="rotacionInternaCaderaDerecha"
                      value={form.rotacionInternaCaderaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="rotacionInternaCaderaIzquierda"
                      value={form.rotacionInternaCaderaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="rotacionInternaRodillaDerecha"
                      value={form.rotacionInternaRodillaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="rotacionInternaRodillaIzquierda"
                      value={form.rotacionInternaRodillaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                </tr>
                
                {/* Fila 7: Irradiación */}
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium">Irradiación</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="irradiacionCaderaDerecha"
                      value={form.irradiacionCaderaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="irradiacionCaderaIzquierda"
                      value={form.irradiacionCaderaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="irradiacionRodillaDerecha"
                      value={form.irradiacionRodillaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="irradiacionRodillaIzquierda"
                      value={form.irradiacionRodillaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                </tr>
                
                {/* Fila 8: Alt. Masa muscular */}
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium">Alt. Masa muscular</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="altMasaMuscularCaderaDerecha"
                      value={form.altMasaMuscularCaderaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="altMasaMuscularCaderaIzquierda"
                      value={form.altMasaMuscularCaderaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="altMasaMuscularRodillaDerecha"
                      value={form.altMasaMuscularRodillaDerecha || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-center"
                      name="altMasaMuscularRodillaIzquierda"
                      value={form.altMasaMuscularRodillaIzquierda || ""}
                      onChange={handleChange}
                      placeholder="Grado"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamenFisicoIII2021;
