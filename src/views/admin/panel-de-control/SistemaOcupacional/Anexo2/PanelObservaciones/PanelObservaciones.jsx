import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";

export default function PanelObservaciones({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleRadioButton,
  handleCheckBoxChange,
  handleClear,
  handleClearnotO,
  handleRadioButtonBoolean,
}) {
  return (
    <div className="bg-gray-50 p-4 h-full">
      <div className="space-y-4">
        {/* Observaciones Generales */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">
              Observaciones Generales :
            </h4>
          </div>
          <textarea
            rows="8"
            name="observacionesGenerales"
            value={form.observacionesGenerales ?? ""}
            disabled
            className="border rounded px-2 py-1 w-full resize-none bg-gray-100"
          />
        </div>

        {/* Perfil Lipídico */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-700 mb-3">Perfil Lipídico</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <InputTextOneLine
                label="Colesterol Total"
                name="colesterolTotal"
                value={form.colesterolTotal}
                labelWidth="100px"
                disabled
              />

              <InputTextOneLine
                label="L.D.L Colesterol"
                name="LDLColesterol"
                value={form.LDLColesterol}
                labelWidth="100px"
                disabled
              />

              <InputTextOneLine
                label="H.D.L Colesterol"
                name="HDLColesterol"
                value={form.HDLColesterol}
                labelWidth="100px"
                disabled
              />

              <InputTextOneLine
                label="V.L.D.L Colesterol"
                name="VLDLColesterol"
                value={form.VLDLColesterol}
                labelWidth="100px"
                disabled
              />

              <InputTextOneLine
                label="Triglicéridos"
                name="trigliceridos"
                value={form.trigliceridos}
                labelWidth="100px"
                disabled
              />
            </div>
          </div>
        </div>
        {/* Comparación Grupo Sanguíneo */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">
            Comparación Grupo Sanguíneo
          </h4>
          <div className="flex items-center space-x-2">
            <InputTextOneLine
              label=""
              name="grupoSanguineoPrevio"
              value={form.grupoSanguineoPrevio}
              disabled
            />

            <span className="font-medium">=</span>

            <InputTextOneLine
              label=""
              name="grupoSanguineoGrupo"
              value={form.grupoSanguineoGrupo}
              disabled
            />
          </div>
        </div>
        {/* Grupo Sanguíneo */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1">
          <h4 className="font-semibold text-gray-800 mb-2">Grupo Sanguíneo</h4>

          <div className="space-y-2">
            <InputsRadioGroup
              name="grupoSanguineo"
              value={form.grupoSanguineo}
              onChange={handleRadioButton}
              disabled
              options={[
                { label: "O", value: "O" },
                { label: "A", value: "A" },
                { label: "B", value: "B" },
                { label: "AB", value: "AB" },
              ]}
            />
            <InputsRadioGroup
              name="factorRh"
              value={form.factorRh}
              onChange={handleRadioButton}
              disabled
              options={[
                { label: "Rh(+)", value: "RH(+)" },
                { label: "Rh(-)", value: "RH(-)" },
              ]}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="font-semibold text-gray-800 mb-2">
            Resultados de Laboratorio
          </p>

          <div className="grid gap-2">
            <InputTextOneLine
              label="V.S.G"
              name="vsg"
              value={form.vsg}
              labelWidth="110px"
              disabled
            />

            <InputTextOneLine
              label="Glucosa"
              name="glucosa"
              value={form.glucosa}
              labelWidth="110px"
              disabled
            />

            <InputTextOneLine
              label="Creatinina"
              name="creatinina"
              value={form.creatinina}
              labelWidth="110px"
              disabled
            />

            <InputTextOneLine
              label="Marihuana"
              name="marihuana"
              value={form.marihuana}
              labelWidth="110px"
              disabled
            />

            <InputTextOneLine
              label="Cocaína"
              name="cocaina"
              value={form.cocaina}
              labelWidth="110px"
              disabled
            />

            <InputTextOneLine
              label="Hemoglobina / Hematocrito (gr. %)"
              name="hemoglobinaHematocrito"
              value={form.hemoglobinaHematocrito}
              labelWidth="110px"
              disabled
            />
          </div>
        </div>

        {/* Botón Asignar Médico */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded font-medium">
            ASIGNAR MEDICO
          </button>
        </div>
      </div>
    </div>
  );
}
