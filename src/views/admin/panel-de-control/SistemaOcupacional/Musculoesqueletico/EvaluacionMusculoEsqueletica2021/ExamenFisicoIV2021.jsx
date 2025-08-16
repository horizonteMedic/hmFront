import React from "react";

const ExamenFisicoIV2021 = ({ form, handleRadioButton, handleChange, handleChangeNumber }) => {
  return (
    <div className="space-y-6">
      {/* Contenido principal - EVAL. DINAMICA DE ARTICULACIONES - TOBILLOS */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <h3 className="text-xl font-bold text-blue-900 text-center mb-6">
          EVAL. DINAMICA DE ARTICULACIONES - TOBILLOS
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-blue-900">
                <th className="text-left py-3 px-4 font-semibold text-blue-900 text-lg">MOVILIDAD - DOLOR</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-900 text-lg">Tobillo derecho</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-900 text-lg">Tobillo izquierdo</th>
              </tr>
            </thead>
            <tbody>
              {/* Fila 1: Abducción */}
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Abducción</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="abduccionTobilloDerecho"
                    value={form.abduccionTobilloDerecho || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="abduccionTobilloIzquierdo"
                    value={form.abduccionTobilloIzquierdo || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
              </tr>
              
              {/* Fila 2: Aducción */}
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Aducción</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="aduccionTobilloDerecho"
                    value={form.aduccionTobilloDerecho || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="aduccionTobilloIzquierdo"
                    value={form.aduccionTobilloIzquierdo || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
              </tr>
              
              {/* Fila 3: Flexión */}
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Flexión</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="flexionTobilloDerecho"
                    value={form.flexionTobilloDerecho || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="flexionTobilloIzquierdo"
                    value={form.flexionTobilloIzquierdo || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
              </tr>
              
              {/* Fila 4: Extensión */}
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Extensión</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="extensionTobilloDerecho"
                    value={form.extensionTobilloDerecho || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="extensionTobilloIzquierdo"
                    value={form.extensionTobilloIzquierdo || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
              </tr>
              
              {/* Fila 5: Rot. Externa */}
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Rot. Externa</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="rotacionExternaTobilloDerecho"
                    value={form.rotacionExternaTobilloDerecho || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="rotacionExternaTobilloIzquierdo"
                    value={form.rotacionExternaTobilloIzquierdo || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
              </tr>
              
              {/* Fila 6: Rot. Interna */}
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Rot. Interna</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="rotacionInternaTobilloDerecho"
                    value={form.rotacionInternaTobilloDerecho || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="rotacionInternaTobilloIzquierdo"
                    value={form.rotacionInternaTobilloIzquierdo || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
              </tr>
              
              {/* Fila 7: Irradiación */}
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Irradiación</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="irradiacionTobilloDerecho"
                    value={form.irradiacionTobilloDerecho || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="irradiacionTobilloIzquierdo"
                    value={form.irradiacionTobilloIzquierdo || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
              </tr>
              
              {/* Fila 8: Alt. Masa muscular */}
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Alt. Masa muscular</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="altMasaMuscularTobilloDerecho"
                    value={form.altMasaMuscularTobilloDerecho || ""}
                    onChange={handleChange}
                    placeholder="Grado"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="altMasaMuscularTobilloIzquierdo"
                    value={form.altMasaMuscularTobilloIzquierdo || ""}
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
  );
};

export default ExamenFisicoIV2021;
