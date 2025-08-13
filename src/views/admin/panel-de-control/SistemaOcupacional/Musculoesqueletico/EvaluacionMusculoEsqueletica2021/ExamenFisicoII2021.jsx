import React from "react";

const ExamenFisicoII2021 = ({ form, handleRadioButton, handleChange, handleChangeNumber }) => {
  return (
    <div className="space-y-6">
      {/* Contenido principal - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMNA IZQUIERDA - 2 cards apilados */}
        <div className="space-y-6">
          
          {/* Card 1: COLUMNA VERTEBRAL */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-blue-900 text-center mb-4">
              COLUMNA VERTEBRAL
            </h3>
            
            <div className="space-y-4">
              {/* Encabezados de columnas */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="font-semibold text-center text-blue-900">EXPLORACIÓN</div>
                <div className="font-semibold text-center text-blue-900">HALLAZGO</div>
                <div className="font-semibold text-center text-blue-900">DESCRIPCIÓN (Nivel, características, otras)</div>
              </div>
              
              {/* Fila 1: Desviación del Eje */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Desviación del Eje:</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="desviacionEje"
                      value="SI"
                      checked={form.desviacionEje === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="desviacionEje"
                      value="NO"
                      checked={form.desviacionEje === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  name="desviacionEjeDescripcion"
                  value={form.desviacionEjeDescripcion || ""}
                  onChange={handleChange}
                  placeholder="Descripción..."
                />
              </div>
              
              {/* Fila 2: Test de Adams */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Test de Adams:</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testAdams"
                      value="+"
                      checked={form.testAdams === "+"}
                      onChange={(e) => handleRadioButton(e, "+")}
                    />
                    <span>+</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testAdams"
                      value="O"
                      checked={form.testAdams === "O"}
                      onChange={(e) => handleRadioButton(e, "O")}
                    />
                    <span>O</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testAdams"
                      value="-"
                      checked={form.testAdams === "-"}
                      onChange={(e) => handleRadioButton(e, "-")}
                    />
                    <span>-</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  name="testAdamsDescripcion"
                  value={form.testAdamsDescripcion || ""}
                  onChange={handleChange}
                  placeholder="Descripción..."
                />
              </div>
              
              {/* Fila 3: Dandy */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Dandy:</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="dandy"
                      value="+"
                      checked={form.dandy === "+"}
                      onChange={(e) => handleRadioButton(e, "+")}
                    />
                    <span>+</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="dandy"
                      value="O"
                      checked={form.dandy === "O"}
                      onChange={(e) => handleRadioButton(e, "O")}
                    />
                    <span>O</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="dandy"
                      value="-"
                      checked={form.dandy === "-"}
                      onChange={(e) => handleRadioButton(e, "-")}
                    />
                    <span>-</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  name="dandyDescripcion"
                  value={form.dandyDescripcion || ""}
                  onChange={handleChange}
                  placeholder="Descripción..."
                />
              </div>
              
              {/* Fila 4: Lasegue */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Lasegue:</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="lasegue"
                      value="+"
                      checked={form.lasegue === "+"}
                      onChange={(e) => handleRadioButton(e, "+")}
                    />
                    <span>+</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="lasegue"
                      value="O"
                      checked={form.lasegue === "O"}
                      onChange={(e) => handleRadioButton(e, "O")}
                    />
                    <span>O</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="lasegue"
                      value="-"
                      checked={form.lasegue === "-"}
                      onChange={(e) => handleRadioButton(e, "-")}
                    />
                    <span>-</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  name="lasegueDescripcion"
                  value={form.lasegueDescripcion || ""}
                  onChange={handleChange}
                  placeholder="Descripción..."
                />
              </div>
              
              {/* Fila 5: Contractura Muscular */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Contractura Muscular:</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="contracturaMuscular"
                      value="SI"
                      checked={form.contracturaMuscular === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="contracturaMuscular"
                      value="NO"
                      checked={form.contracturaMuscular === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  name="contracturaMuscularDescripcion"
                  value={form.contracturaMuscularDescripcion || ""}
                  onChange={handleChange}
                  placeholder="Descripción..."
                />
              </div>
              
              {/* Fila 6: Cicatriz Post-Operatoria */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Cicatriz Post-Operatoria:</span>
                <div className="flex gap-3 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="cicatrizPostOperatoria"
                      value="SI"
                      checked={form.cicatrizPostOperatoria === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="cicatrizPostOperatoria"
                      value="NO"
                      checked={form.cicatrizPostOperatoria === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  name="cicatrizPostOperatoriaDescripcion"
                  value={form.cicatrizPostOperatoriaDescripcion || ""}
                  onChange={handleChange}
                  placeholder="Descripción..."
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* COLUMNA DERECHA - Grid 2x3 */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Fila 1, Col 1: TEST DE JOBE */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-blue-900 text-center mb-3">
              TEST DE JOBE
            </h4>
            <p className="text-gray-600 text-center mb-3">
              Aparece dolor que limita el movimiento
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Derecha</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testJobeDerecha"
                      value="SI"
                      checked={form.testJobeDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testJobeDerecha"
                      value="NO"
                      checked={form.testJobeDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Izquierda</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testJobeIzquierda"
                      value="SI"
                      checked={form.testJobeIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testJobeIzquierda"
                      value="NO"
                      checked={form.testJobeIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fila 1, Col 2: TEST DE PATTE */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-blue-900 text-center mb-3">
              TEST DE PATTE
            </h4>
            <p className="text-gray-600 text-center mb-3">
              Aparece dolor que limita el movimiento
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Derecha</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testPatteDerecha"
                      value="SI"
                      checked={form.testPatteDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testPatteDerecha"
                      value="NO"
                      checked={form.testPatteDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Izquierda</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testPatteIzquierda"
                      value="SI"
                      checked={form.testPatteIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testPatteIzquierda"
                      value="NO"
                      checked={form.testPatteIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fila 2, Col 1: TEST DE GERBER */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-blue-900 text-center mb-3">
              TEST DE GERBER
            </h4>
            <p className="text-gray-600 text-center mb-3">
              Aparece dolor que limita el movimiento
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Derecha</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testGerberDerecha"
                      value="SI"
                      checked={form.testGerberDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testGerberDerecha"
                      value="NO"
                      checked={form.testGerberDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Izquierda</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testGerberIzquierda"
                      value="SI"
                      checked={form.testGerberIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="testGerberIzquierda"
                      value="NO"
                      checked={form.testGerberIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fila 2, Col 2: PALM UP TEST */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-blue-900 text-center mb-3">
              PALM UP TEST
            </h4>
            <p className="text-gray-600 text-center mb-3">
              Aparece dolor que limita el movimiento
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Derecha</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="palmUpTestDerecha"
                      value="SI"
                      checked={form.palmUpTestDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="palmUpTestDerecha"
                      value="NO"
                      checked={form.palmUpTestDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Izquierda</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="palmUpTestIzquierda"
                      value="SI"
                      checked={form.palmUpTestIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="palmUpTestIzquierda"
                      value="NO"
                      checked={form.palmUpTestIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fila 3, Col 1: EPICONDILITIS */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-blue-900 text-center mb-3">
              EPICONDILITIS
            </h4>
            <p className="text-gray-600 text-center mb-3">
              Aparece dolor en el Epicóndilo
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Derecha</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="epicondilitisDerecha"
                      value="SI"
                      checked={form.epicondilitisDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="epicondilitisDerecha"
                      value="NO"
                      checked={form.epicondilitisDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Izquierda</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="epicondilitisIzquierda"
                      value="SI"
                      checked={form.epicondilitisIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="epicondilitisIzquierda"
                      value="NO"
                      checked={form.epicondilitisIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fila 3, Col 2: EPITROCLEITIS */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-blue-900 text-center mb-3">
              EPITROCLEITIS
            </h4>
            <p className="text-gray-600 text-center mb-3">
              Aparece dolor en la Epitróclea
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Derecha</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="epitrocleitisDerecha"
                      value="SI"
                      checked={form.epitrocleitisDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="epitrocleitisDerecha"
                      value="NO"
                      checked={form.epitrocleitisDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Izquierda</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="epitrocleitisIzquierda"
                      value="SI"
                      checked={form.epitrocleitisIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="epitrocleitisIzquierda"
                      value="NO"
                      checked={form.epitrocleitisIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fila 4, Col 1: PHALEN */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-blue-900 text-center mb-3">
              PHALEN
            </h4>
            <p className="text-gray-600 text-center mb-3">
              Parestesias región Carpal-N.Mediano
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Derecha</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="phalenDerecha"
                      value="SI"
                      checked={form.phalenDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="phalenDerecha"
                      value="NO"
                      checked={form.phalenDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Izquierda</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="phalenIzquierda"
                      value="SI"
                      checked={form.phalenIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="phalenIzquierda"
                      value="NO"
                      checked={form.phalenIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fila 4, Col 2: PHALEN - INVERTIDO */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-blue-900 text-center mb-3">
              PHALEN - INVERTIDO
            </h4>
            <p className="text-gray-600 text-center mb-3">
              Parestesias región Carpal-N.Mediano
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Derecha</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="phalenInvertidoDerecha"
                      value="SI"
                      checked={form.phalenInvertidoDerecha === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="phalenInvertidoDerecha"
                      value="NO"
                      checked={form.phalenInvertidoDerecha === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-blue-900 block mb-2">Izquierda</span>
                <div className="flex gap-2 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="phalenInvertidoIzquierda"
                      value="SI"
                      checked={form.phalenInvertidoIzquierda === "SI"}
                      onChange={(e) => handleRadioButton(e, "SI")}
                    />
                    <span>SI</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="phalenInvertidoIzquierda"
                      value="NO"
                      checked={form.phalenInvertidoIzquierda === "NO"}
                      onChange={(e) => handleRadioButton(e, "NO")}
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamenFisicoII2021;
