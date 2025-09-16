import { faBroom, faSave, faUser } from "@fortawesome/free-solid-svg-icons";
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
  activeTab,
  handleChange,
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
            onChange={handleChange}
          />
        </div>
 {/* Conclusiones */}
 <div className="bg-white border border-gray-200 rounded-lg p-3">
           <InputTextArea
             rows={8}
             label="Conclusiones"
             name="conclusiones"
             value={form.conclusiones}
             onChange={handleChange}
           />
         </div>

         {/* Audiometría Normal */}
         <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
           <InputTextOneLine
             name="audiometriaNormal"
             value={form.audiometriaNormal || "AUDIOMETRIA - NORMAL - NORMAL .EVALUACION ANUA L"}
             onChange={handleChange}
             className="text-red-600 font-bold text-sm uppercase w-full"
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
                onChange={handleChange}
              />

              <InputTextOneLine
                label="L.D.L Colesterol"
                name="LDLColesterol"
                value={form.LDLColesterol}
                labelWidth="100px"
                onChange={handleChange}
              />

              <InputTextOneLine
                label="H.D.L Colesterol"
                name="HDLColesterol"
                value={form.HDLColesterol}
                labelWidth="100px"
                onChange={handleChange}
              />

              <InputTextOneLine
                label="V.L.D.L Colesterol"
                name="VLDLColesterol"
                value={form.VLDLColesterol}
                labelWidth="100px"
                onChange={handleChange}
              />

              <InputTextOneLine
                label="Triglicéridos"
                name="trigliceridos"
                value={form.trigliceridos}
                labelWidth="100px"
                onChange={handleChange}
              />
            </div>
          </div>
         </div>

         {/* Botón Asignar Médico - Solo en el tab de Resultados */}
         {activeTab === 2 && (
           <div className="flex justify-center">
             <button
               type="button"
               className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
             >
               <FontAwesomeIcon icon={faUser} /> Asignar Médico
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
