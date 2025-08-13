import React from "react";

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

const RadioGroupSiNo = ({ label, name, value, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold min-w-[120px]">{label}:</span>
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

export default function ExamenFisicoII({ form, handleRadioButton, handleChange }) {
  return (
    <div className="space-y-6">
      {/* Grid de 2x2 para Examen Físico II */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna 1 - Fila 1: MUÑECA */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            MIEMBROS SUPERIORES (MUÑECA)
          </div>
          <div className="space-y-4">
            <RadioGroup
              label="Flexión"
              name="flexionMuneca"
              value={form.flexionMuneca || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Extensión"
              name="extensionMuneca"
              value={form.extensionMuneca || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Desviación Cubital"
              name="desviacionCubitalMuneca"
              value={form.desviacionCubitalMuneca || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Desviación Radial"
              name="desviacionRadialMuneca"
              value={form.desviacionRadialMuneca || "N"}
              onChange={handleRadioButton}
            />
            
            <div className="border-t pt-4 mt-4">
              <div className="mb-3">
                <RadioGroupSiNo
                  label="S. de Phallen"
                  name="signoPhallen"
                  value={form.signoPhallen || "NO"}
                  onChange={handleRadioButton}
                />
              </div>
              <div>
                <RadioGroupSiNo
                  label="S. Tinel"
                  name="signoTinel"
                  value={form.signoTinel || "NO"}
                  onChange={handleRadioButton}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2 - Fila 1: CADERA */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            MIEMBROS INFERIORES (CADERA)
          </div>
          <div className="space-y-4">
            <RadioGroup
              label="Flexión"
              name="flexionCadera"
              value={form.flexionCadera || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Extensión"
              name="extensionCadera"
              value={form.extensionCadera || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Abducción"
              name="abduccionCadera"
              value={form.abduccionCadera || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Aducción"
              name="aduccionCadera"
              value={form.aduccionCadera || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Rotación Interna"
              name="rotacionInternaCadera"
              value={form.rotacionInternaCadera || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Rotación Externa"
              name="rotacionExternaCadera"
              value={form.rotacionExternaCadera || "N"}
              onChange={handleRadioButton}
            />
          </div>
        </div>

        {/* Columna 1 - Fila 2: PIERNA */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            MIEMBROS INFERIORES (PIERNA)
          </div>
          <div className="space-y-4">
            <RadioGroup
              label="Flexión"
              name="flexionPierna"
              value={form.flexionPierna || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Extensión"
              name="extensionPierna"
              value={form.extensionPierna || "N"}
              onChange={handleRadioButton}
            />
          </div>
        </div>

        {/* Columna 2 - Fila 2: RODILLA */}
        <div className="border rounded p-4">
          <div className=" text-blue-900 font-semibold text-center mb-3">
            MIEMBROS INFERIORES (RODILLA)
          </div>
          <div className="space-y-4">
            <RadioGroup
              label="Flexión"
              name="flexionRodilla"
              value={form.flexionRodilla || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="Extensión"
              name="extensionRodilla"
              value={form.extensionRodilla || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="R. Interna"
              name="rotacionInternaRodilla"
              value={form.rotacionInternaRodilla || "N"}
              onChange={handleRadioButton}
            />
            <RadioGroup
              label="R. Externa"
              name="rotacionExternaRodilla"
              value={form.rotacionExternaRodilla || "N"}
              onChange={handleRadioButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}