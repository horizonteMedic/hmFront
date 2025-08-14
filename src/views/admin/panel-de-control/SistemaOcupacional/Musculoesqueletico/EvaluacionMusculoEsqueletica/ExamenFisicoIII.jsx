import React from "react";

const RadioGroup = ({ label, name, value, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold min-w-[80px]">{label}:</span>
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

const RadioGroupSiNo = ({ label, name, value, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold min-w-[80px]">{label}:</span>
      <div className="flex gap-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            checked={value === "SI"}
            onChange={(e) => onChange(e, "SI")}
          />
          SI
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            checked={value === "NO"}
            onChange={(e) => onChange(e, "NO")}
          />
          NO
        </label>
      </div>
    </div>
  );
};

const RadioGroupNormal = ({ label, name, value, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold min-w-[80px]">{label}:</span>
      <div className="flex gap-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            checked={value === "NORMAL"}
            onChange={(e) => onChange(e, "NORMAL")}
          />
          Normal
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            checked={value === "DERECHA"}
            onChange={(e) => onChange(e, "DERECHA")}
          />
          Derecha
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            checked={value === "CONCAV. IZQUIERDA"}
            onChange={(e) => onChange(e, "CONCAV. IZQUIERDA")}
          />
          Concav. Izquierda
        </label>
      </div>
    </div>
  );
};

const RadioGroupNumerico = ({ label, name, value, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold min-w-[80px]">{label}:</span>
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((numero) => (
          <label key={numero} className="flex items-center gap-1">
            <input
              type="radio"
              name={name}
              checked={value === numero.toString()}
              onChange={(e) => onChange(e, numero.toString())}
            />
            {numero}
          </label>
        ))}
      </div>
    </div>
  );
};

export default function ExamenFisicoIII({ form, handleRadioButton, handleChange }) {
  return (
    <div className="space-y-6">
      {/* Grid de 3x3 para Examen Físico III */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fila 1 - Columna 1: TOBILLO */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            MIEMBROS INFERIORES (TOBILLO)
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="font-semibold mb-2">Lado Izquierdo</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Flexión"
                  name="flexionTobillo"
                  value={form.flexionTobillo || "N"}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Extensión"
                  name="extensionTobillo"
                  value={form.extensionTobillo || "N"}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Lado Derecho</div>
              <div className="space-y-2">
                <RadioGroup
                  label="Flexión"
                  name="flexionTobilloDerecho"
                  value={form.flexionTobilloDerecho || "N"}
                  onChange={handleRadioButton}
                />
                <RadioGroup
                  label="Extensión"
                  name="extensionTobilloDerecho"
                  value={form.extensionTobilloDerecho || "N"}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fila 1 - Columna 2: DESVIACIÓN DE EJE */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            COLUMNA VERTEBRAL (DESVIACIÓN DE EJE)
          </div>
          <div className="space-y-4">
            <RadioGroupNormal
              label="Cervical"
              name="desviacionEjeCervical"
              value={form.desviacionEjeCervical || "NORMAL"}
              onChange={handleRadioButton}
            />
            <RadioGroupNormal
              label="Dorsal"
              name="desviacionEjeDorsal"
              value={form.desviacionEjeDorsal || "NORMAL"}
              onChange={handleRadioButton}
            />
            <RadioGroupNormal
              label="Lumbar"
              name="desviacionEjeLumbar"
              value={form.desviacionEjeLumbar || "NORMAL"}
              onChange={handleRadioButton}
            />
          </div>
        </div>

        {/* Fila 1 - Columna 3: DESV. DE COLUMNA */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            C. VERTEBRAL (DESV. DE COLUMNA)
          </div>
          <div className="space-y-4">
            <RadioGroupSiNo
              label="Cifosis"
              name="cifosis"
              value={form.cifosis || "NO"}
              onChange={handleRadioButton}
            />
            <RadioGroupSiNo
              label="Escoliosis"
              name="escoliosis"
              value={form.escoliosis || "NO"}
              onChange={handleRadioButton}
            />
            <RadioGroupSiNo
              label="Lordosis"
              name="lordosis"
              value={form.lordosis || "NO"}
              onChange={handleRadioButton}
            />
            <RadioGroupSiNo
              label="Mixta"
              name="mixta"
              value={form.mixta || "NO"}
              onChange={handleRadioButton}
            />
          </div>
        </div>

        {/* Fila 2 - Columna 1: FUERZA MUSCULAR */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            FUERZA MUSCULAR (GRADO)
          </div>
          <div>
            <RadioGroupNumerico
              label="Grado"
              name="fuerzaMuscular"
              value={form.fuerzaMuscular || "1"}
              onChange={handleRadioButton}
            />
          </div>
        </div>

        {/* Fila 2 - Columna 2: PALPACIÓN - DOLOR */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            COLUMNA VERTEBRAL (PALPACIÓN - DOLOR)
          </div>
          <div className="space-y-4">
            <RadioGroupSiNo
              label="Cervical"
              name="dolorCervical"
              value={form.dolorCervical || "NO"}
              onChange={handleRadioButton}
            />
            <RadioGroupSiNo
              label="Dorsal"
              name="dolorDorsal"
              value={form.dolorDorsal || "NO"}
              onChange={handleRadioButton}
            />
            <RadioGroupSiNo
              label="Lumbar"
              name="dolorLumbar"
              value={form.dolorLumbar || "NO"}
              onChange={handleRadioButton}
            />
          </div>
        </div>

        {/* Fila 2 - Columna 3: EXPLORACIÓN */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            COLUMNA VERTEBRAL (EXPLORACIÓN)
          </div>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Signo de Lesague :</span>
              <div className="ml-6 space-y-3 mt-2">
                <RadioGroupSiNo
                  label="Derecho"
                  name="signoLesagueDerecho"
                  value={form.signoLesagueDerecho || "NO"}
                  onChange={handleRadioButton}
                />
                <RadioGroupSiNo
                  label="Izquierdo"
                  name="signoLesagueIzquierdo"
                  value={form.signoLesagueIzquierdo || "NO"}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}