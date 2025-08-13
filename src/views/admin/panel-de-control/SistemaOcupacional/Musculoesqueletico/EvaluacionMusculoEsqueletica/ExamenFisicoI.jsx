import React from "react";

const ExamenFisicoI = ({ form, handleRadioButton, handleChange }) => {
  return (
    <div className="space-y-6">

      {/* Cabeza y Cuello */}
      <div className="border rounded p-4">
        <div className="text-blue-700 font-semibold text-center mb-3">
          CABEZA Y CUELLO
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <label className="font-semibold min-w-[80px]">Extensión:</label>
              <input
                className="border rounded px-2 py-1 flex-1"
                name="extensionCabeza"
                value={form.extensionCabeza}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold min-w-[80px]">Grado:</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gradoExtension"
                    checked={form.gradoExtension === "N"}
                    onChange={(e) => handleRadioButton(e, "N")}
                  />
                  N
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gradoExtension"
                    checked={form.gradoExtension === "R"}
                    onChange={(e) => handleRadioButton(e, "R")}
                  />
                  R
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gradoExtension"
                    checked={form.gradoExtension === "M"}
                    onChange={(e) => handleRadioButton(e, "M")}
                  />
                  M
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-4 mb-3">
              <label className="font-semibold min-w-[80px]">Flexión:</label>
              <input
                className="border rounded px-2 py-1 flex-1"
                name="flexionCabeza"
                value={form.flexionCabeza}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold min-w-[80px]">Grado:</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gradoFlexion"
                    checked={form.gradoFlexion === "N"}
                    onChange={(e) => handleRadioButton(e, "N")}
                  />
                  N
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gradoFlexion"
                    checked={form.gradoFlexion === "R"}
                    onChange={(e) => handleRadioButton(e, "R")}
                  />
                  R
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gradoFlexion"
                    checked={form.gradoFlexion === "M"}
                    onChange={(e) => handleRadioButton(e, "M")}
                  />
                  M
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de 2x2 para Miembros Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna 1 - Fila 1: TÓRAX */}
        <div className="border rounded p-4">
          <div className="text-blue-700 font-semibold text-center mb-3">
            MIEMBROS SUPERIORES (TÓRAX)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Lado Izquierdo</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Flexión"
                  name="flexionTorax"
                  value={form.flexionTorax}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Extensión"
                  name="extensionTorax"
                  value={form.extensionTorax}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Rotación"
                  name="rotacionTorax"
                  value={form.rotacionTorax}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Lado Derecho</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Flexión"
                  name="flexionToraxDerecho"
                  value={form.flexionToraxDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Extensión"
                  name="extensionToraxDerecho"
                  value={form.extensionToraxDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Rotación"
                  name="rotacionToraxDerecho"
                  value={form.rotacionToraxDerecho}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2 - Fila 1: HOMBRO */}
        <div className="border rounded p-4">
          <div className="text-blue-700 font-semibold text-center mb-3">
            MIEMBROS SUPERIORES (HOMBRO)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Lado Izquierdo</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Flexión"
                  name="flexionHombro"
                  value={form.flexionHombro}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Extensión"
                  name="extensionHombro"
                  value={form.extensionHombro}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Abducción"
                  name="abduccionHombro"
                  value={form.abduccionHombro}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Aducción"
                  name="aduccionHombro"
                  value={form.aduccionHombro}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Rotación Interna"
                  name="rotacionInternaHombro"
                  value={form.rotacionInternaHombro}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Rotación Externa"
                  name="rotacionExternaHombro"
                  value={form.rotacionExternaHombro}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Lado Derecho</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Flexión"
                  name="flexionHombroDerecho"
                  value={form.flexionHombroDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Extensión"
                  name="extensionHombroDerecho"
                  value={form.extensionHombroDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Abducción"
                  name="abduccionHombroDerecho"
                  value={form.abduccionHombroDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Aducción"
                  name="aduccionHombroDerecho"
                  value={form.aduccionHombroDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Rotación Interna"
                  name="rotacionInternaHombroDerecho"
                  value={form.rotacionInternaHombroDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Rotación Externa"
                  name="rotacionExternaHombroDerecho"
                  value={form.rotacionExternaHombroDerecho}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 1 - Fila 2: BRAZO */}
        <div className="border rounded p-4">
          <div className="text-blue-700 font-semibold text-center mb-3">
            MIEMBROS SUPERIORES (BRAZO)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Lado Izquierdo</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Flexión"
                  name="flexionBrazo"
                  value={form.flexionBrazo}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Extensión"
                  name="extensionBrazo"
                  value={form.extensionBrazo}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Lado Derecho</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Flexión"
                  name="flexionBrazoDerecho"
                  value={form.flexionBrazoDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Extensión"
                  name="extensionBrazoDerecho"
                  value={form.extensionBrazoDerecho}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2 - Fila 2: ANTEBRAZO */}
        <div className="border rounded p-4">
          <div className="text-blue-700 font-semibold text-center mb-3">
            MIEMBROS SUPERIORES (ANTEBRAZO)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Lado Izquierdo</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Pronación"
                  name="pronacionAntebrazo"
                  value={form.pronacionAntebrazo}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Supinación"
                  name="supinacionAntebrazo"
                  value={form.supinacionAntebrazo}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Lado Derecho</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Pronación"
                  name="pronacionAntebrazoDerecho"
                  value={form.pronacionAntebrazoDerecho}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Supinación"
                  name="supinacionAntebrazoDerecho"
                  value={form.supinacionAntebrazoDerecho}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para grupos de radio buttons
const RadioGroup = ({ label, name, value, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold min-w-[120px]">{label}:</span>
      <div className="flex gap-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            checked={value === "N"}
            onChange={(e) => onChange(e, "N")}
          />
          N
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            checked={value === "R"}
            onChange={(e) => onChange(e, "R")}
          />
          R
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            checked={value === "M"}
            onChange={(e) => onChange(e, "M")}
          />
          M
        </label>
      </div>
    </div>
  );
};

export default ExamenFisicoI;
