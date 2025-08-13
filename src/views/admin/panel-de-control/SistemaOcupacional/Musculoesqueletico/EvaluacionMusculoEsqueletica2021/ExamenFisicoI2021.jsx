import React from "react";

const ExamenFisicoI2021 = ({ form, handleRadioButton, handleChange, handleChangeNumber }) => {
  return (
    <div className="space-y-6">
      {/* Contenido de las dos secciones principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección izquierda: APTITUD ESPALDA */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-xl font-bold text-blue-900 text-center mb-4">
            APTITUD ESPALDA
          </h3>
          
          <div className="space-y-4">
            {/* Encabezado de columnas */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="font-semibold text-center text-blue-900">Puntos</div>
              <div></div>
            </div>
            
            {/* Criterios de evaluación */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Flex/fuerza Abdomen:</span>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-20 text-center"
                  name="flexFuerzaAbdomen"
                  value={form.flexFuerzaAbdomen || ""}
                  onChange={handleChangeNumber}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Cadera:</span>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-20 text-center"
                  name="cadera"
                  value={form.cadera || ""}
                  onChange={handleChangeNumber}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Muslo:</span>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-20 text-center"
                  name="muslo"
                  value={form.muslo || ""}
                  onChange={handleChangeNumber}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Abdomen lateral I:</span>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-20 text-center"
                  name="abdomenLateralI"
                  value={form.abdomenLateralI || ""}
                  onChange={handleChangeNumber}
                />
              </div>
              
              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-bold text-blue-900">Total:</span>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-20 text-center font-bold text-blue-900"
                  name="totalAptitudEspalda"
                  value={form.totalAptitudEspalda || ""}
                  onChange={handleChangeNumber}
                  readOnly
                />
              </div>
            </div>
            
            {/* Observaciones */}
            <div className="mt-6">
              <label className="block font-semibold mb-2">Observaciones:</label>
              <textarea
                className="w-full border rounded px-3 py-2 h-24 resize-none"
                name="observacionesAptitudEspalda"
                value={form.observacionesAptitudEspalda || ""}
                onChange={handleChange}
                placeholder="Ingrese observaciones aquí..."
              />
            </div>
          </div>
        </div>
        
        {/* Sección derecha: RANGOS ARTICULARES */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-xl font-bold text-blue-900 text-center mb-4">
            RANGOS ARTICULARES
          </h3>
          
          <div className="space-y-4">
            {/* Encabezado de columnas */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="font-semibold text-center text-blue-900">Grados</div>
              <div className="font-semibold text-center text-blue-900">Dolor contra resistencia</div>
            </div>
            
            {/* Criterios de evaluación */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Abducción hombro 180°:</span>
                <div className="flex gap-4">
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-20 text-center"
                    name="abduccionHombro180"
                    value={form.abduccionHombro180 || ""}
                    onChange={handleChangeNumber}
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="dolorAbduccionHombro180"
                        value="SI"
                        checked={form.dolorAbduccionHombro180 === "SI"}
                        onChange={(e) => handleRadioButton(e, "SI")}
                      />
                      <span>SI</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="dolorAbduccionHombro180"
                        value="NO"
                        checked={form.dolorAbduccionHombro180 === "NO"}
                        onChange={(e) => handleRadioButton(e, "NO")}
                      />
                      <span>NO</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Abducción hombro 60°:</span>
                <div className="flex gap-4">
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-20 text-center"
                    name="abduccionHombro60"
                    value={form.abduccionHombro60 || ""}
                    onChange={handleChangeNumber}
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="dolorAbduccionHombro60"
                        value="SI"
                        checked={form.dolorAbduccionHombro60 === "SI"}
                        onChange={(e) => handleRadioButton(e, "SI")}
                      />
                      <span>SI</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="dolorAbduccionHombro60"
                        value="NO"
                        checked={form.dolorAbduccionHombro60 === "NO"}
                        onChange={(e) => handleRadioButton(e, "NO")}
                      />
                      <span>NO</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Rotación externa 90°:</span>
                <div className="flex gap-4">
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-20 text-center"
                    name="rotacionExterna90"
                    value={form.rotacionExterna90 || ""}
                    onChange={handleChangeNumber}
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="dolorRotacionExterna90"
                        value="SI"
                        checked={form.dolorRotacionExterna90 === "SI"}
                        onChange={(e) => handleRadioButton(e, "SI")}
                      />
                      <span>SI</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="dolorRotacionExterna90"
                        value="NO"
                        checked={form.dolorRotacionExterna90 === "NO"}
                        onChange={(e) => handleRadioButton(e, "NO")}
                      />
                      <span>NO</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Rotación externa hombro interna:</span>
                <div className="flex gap-4">
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-20 text-center"
                    name="rotacionExternaHombroInterna"
                    value={form.rotacionExternaHombroInterna || ""}
                    onChange={handleChangeNumber}
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="dolorRotacionExternaHombroInterna"
                        value="SI"
                        checked={form.dolorRotacionExternaHombroInterna === "SI"}
                        onChange={(e) => handleRadioButton(e, "SI")}
                      />
                      <span>SI</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="dolorRotacionExternaHombroInterna"
                        value="NO"
                        checked={form.dolorRotacionExternaHombroInterna === "NO"}
                        onChange={(e) => handleRadioButton(e, "NO")}
                      />
                      <span>NO</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-bold text-blue-900">Total:</span>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-20 text-center font-bold text-blue-900"
                  name="totalRangosArticulares"
                  value={form.totalRangosArticulares || ""}
                  onChange={handleChangeNumber}
                  readOnly
                />
              </div>
            </div>
            
            {/* Observaciones */}
            <div className="mt-6">
              <label className="block font-semibold mb-2">Observaciones:</label>
              <textarea
                className="w-full border rounded px-3 py-2 h-24 resize-none"
                name="observacionesRangosArticulares"
                value={form.observacionesRangosArticulares || ""}
                onChange={handleChange}
                placeholder="Ingrese observaciones aquí..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamenFisicoI2021;
