import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import { InputCheckbox, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";

export default function FinalAutorizacion({ form, setForm, handleChange, handleCheckBoxChange, handleRadioButton, handleChangeSimple }) {
  return (
    <div className="space-y-6 text-[11px]">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Autorización para el uso de Respiradores</h4>
        <p className=" text-gray-600 mb-4">
          Seleccione la clase de autorización y, si corresponde, las restricciones para el uso del respirador.
        </p>

        <div className="grid grid-cols-2">
          {/* Clasificación por clases */}
          <div className="mb-6">
            <label className="block font-bold  mb-3">Clasificación</label>
            <InputsRadioGroup
              name="claseAutorizacion"
              vertical
              value={form?.claseAutorizacion}
              onChange={(e, value) => {
                setForm((prev) => ({
                  ...prev,
                  claseIIEmergenciaEscape: false,
                  claseIISoloPAPR: false,
                  claseIINoSBCA: false,
                  claseIIOtros: false,
                }));
                handleRadioButton(e, value)
              }}
              options={[
                { label: "Clase I - Sin restricciones en el uso del respirador", value: "CLASE_I" },
                { label: "Clase II - Uso condicional", value: "CLASE_II" },
                { label: "Clase III - NO SE PERMITE el uso de respirador", value: "CLASE_III" },
                { label: "Clase IV - Requiere examen médico exhaustivo previo", value: "CLASE_IV" },
                { label: "Clase V - Restricciones adicionales temporales/permanentes (sin respirador)", value: "CLASE_V" },
              ]}
            />
          </div>
          {/* Restricciones adicionales para Clase II */}
          {form?.claseAutorizacion === "CLASE_II" && (
            <div className="mb-6">
              <p className=" font-bold mb-3">Uso condicional (seleccione las restricciones específicas):</p>
              <div className="grid grid-cols-1 gap-3">
                <InputCheckbox
                  label="A ser utilizados en respuestas a emergencia o para escape solamente"
                  name="claseIIEmergenciaEscape"
                  checked={form?.claseIIEmergenciaEscape}
                  onChange={handleCheckBoxChange}
                />
                <InputCheckbox
                  label="Solo PAPR"
                  name="claseIISoloPAPR"
                  checked={form?.claseIISoloPAPR}
                  onChange={handleCheckBoxChange}
                />
                <InputCheckbox
                  label="No SBCA"
                  name="claseIINoSBCA"
                  checked={form?.claseIINoSBCA}
                  onChange={handleCheckBoxChange}
                />
                <InputCheckbox
                  label="Otros"
                  name="claseIIOtros"
                  checked={form?.claseIIOtros}
                  onChange={handleCheckBoxChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Datos adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine
            label="Expira en"
            name="fechaExpiraAutorizacion"
            type="date"
            value={form?.fechaExpiraAutorizacion}
            onChange={handleChangeSimple}
          />
        </div>
      </div>
    </div>
  );
}