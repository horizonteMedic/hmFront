import { faBroom, faSave } from "@fortawesome/free-solid-svg-icons";
import {
  InputsRadioGroup,
  InputTextArea,
  InputTextOneLine,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PanelObservaciones({
  form,
  handleRadioButton,
  handleClear,
  handleSave,
}) {
  return (
    <div className="p-4 h-full mt-16">
      <div className="space-y-4">
        {/* Observaciones Generales */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <InputTextArea
            rows={18}
            label="Observaciones Generales"
            name="observacionesGenerales"
            value={form.observacionesGenerales}
            disabled
          />
        </div>
 {/* Conclusiones */}
 <div className="bg-white border border-gray-200 rounded-lg p-3">
           <InputTextArea
             rows={8}
             label="Conclusiones"
             name="conclusiones"
             value={form.conclusiones}
             disabled
           />
         </div>

         {/* Audiometría Normal */}
         <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
           <div className="text-red-600 font-bold text-sm uppercase">
             AUDIOMETRIA - NORMAL - NORMAL .EVALUACION ANUA L
           </div>
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

        
       
         {/* Botones de Acción */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
