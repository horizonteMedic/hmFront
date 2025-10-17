import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsBooleanRadioGroup,
  InputsRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function Antecedentes({
  form,
  setForm,
  handleChange,
  handleCheckBoxChange,
  handleRadioButtonBoolean,
  handleRadioButton,
}) {
  return (
    <div className="space-y-6">
      {/* Accidentes de Trabajo o Enfermedades Profesionales */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 ">
        <h3 className="font-bold mb-3 text-gray-800">
          Historial
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InputTextArea
            label="Accidentes de Trabajo o Enfermedades Profesionales"
            name="accidentesTrabajoEnfermedades"
            value={form?.accidentesTrabajoEnfermedades}
            onChange={handleChange}
            rows={6}
          />
          <InputTextArea
            label="Antecedentes Familiares"
            name="antecedentesFamiliares"
            value={form?.antecedentesFamiliares}
            onChange={handleChange}
            rows={6}
          />
        </div>
      </section>
      {/* Antecedentes Psiconeuroológicos */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold mb-3">
          Antecedentes Psiconeuroológicos
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {/* TEC Moderado/Grave */}
          <div className="flex gap-4">
            <InputsBooleanRadioGroup
              label="TEC Moderado/ Grave"
              name="tecModeradoGrave"
              value={form?.tecModeradoGrave}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm(prev => ({ ...prev, tecModeradoGraveDescripcion: "" }))
              }}
              labelWidth="130px"
            />
            <InputTextOneLine
              name="tecModeradoGraveDescripcion"
              value={form?.tecModeradoGraveDescripcion}
              className="w-full my-auto"
              disabled={!form?.tecModeradoGrave}
              onChange={handleChange}
            />
          </div>
          {/* Convulsiones */}
          <div className="flex gap-4">
            <InputsBooleanRadioGroup
              label="Convulsiones"
              name="convulsiones"
              value={form?.convulsiones}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm(prev => ({ ...prev, convulsionesDescripcion: "" }))
              }}
              labelWidth="130px"
            />
            <InputTextOneLine
              name="convulsionesDescripcion"
              value={form?.convulsionesDescripcion}
              onChange={handleChange}
              className="w-full my-auto"
              disabled={!form?.convulsiones}
            />
          </div>

          {/* Mareos/Modosidad/Acatisia */}
          <div className="flex gap-4">
            <InputsBooleanRadioGroup
              label="Mareos/ Modosidad/ Acatisia"
              name="mareosModosidadAcatisia"
              value={form?.mareosModosidadAcatisia}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm(prev => ({ ...prev, mareosModosidadAcatasiaDescripcion: "" }))
              }}
              labelWidth="130px"
            />
            <InputTextOneLine
              name="mareosModosidadAcatasiaDescripcion"
              value={form?.mareosModosidadAcatasiaDescripcion}
              onChange={handleChange}
              className="w-full my-auto"
              disabled={!form?.mareosModosidadAcatisia}
            />
          </div>

          {/* Problemas de Audición */}
          <div className="flex gap-4">
            <InputsBooleanRadioGroup
              label="Problemas de Audición"
              name="problemasAudicion"
              value={form?.problemasAudicion}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm(prev => ({ ...prev, problemasAudicionDescripcion: "" }))
              }}
              labelWidth="130px"
            />
            <InputTextOneLine
              name="problemasAudicionDescripcion"
              value={form?.problemasAudicionDescripcion}
              onChange={handleChange}
              className="w-full my-auto"
              disabled={!form?.problemasAudicion}
            />
          </div>

          {/* Problemas de Equilibrio */}
          <div className="flex gap-4">
            <InputsBooleanRadioGroup
              label="Problemas de Equilibrio"
              name="problemasEquilibrio"
              value={form?.problemasEquilibrio}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm(prev => ({ ...prev, problemasEquilibrioDescripcion: "" }))
              }}
              labelWidth="130px"
            />
            <InputTextOneLine
              name="problemasEquilibrioDescripcion"
              value={form?.problemasEquilibrioDescripcion}
              onChange={handleChange}
              className="w-full my-auto"
              disabled={!form?.problemasEquilibrio}
            />
          </div>

          {/* Acrofobia */}
          <div className="flex gap-4">
            <InputsBooleanRadioGroup
              label="Acrofobia"
              name="acrofobia"
              value={form?.acrofobia}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm(prev => ({ ...prev, acrofobiaDescripcion: "" }))
              }}
              labelWidth="130px"
            />
            <InputTextOneLine
              name="acrofobiaDescripcion"
              value={form?.acrofobiaDescripcion}
              onChange={handleChange}
              className="w-full my-auto"
              disabled={!form?.acrofobia}
            />
          </div>

          {/* Agarofobia */}
          <div className="flex gap-4">
            <InputsBooleanRadioGroup
              label="Agarofobia"
              name="agarofobia"
              value={form?.agarofobia}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm(prev => ({ ...prev, agarofobiaDescripcion: "" }))
              }}
              labelWidth="130px"
            />
            <InputTextOneLine
              name="agarofobiaDescripcion"
              value={form?.agarofobiaDescripcion}
              onChange={handleChange}
              className="w-full my-auto"
              disabled={!form?.agarofobia}
            />
          </div>
        </div>
      </section>

      {/* Consumo de Sustancias */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold  text-gray-800">
          Consumo de Sustancias
        </h3>
        <table className="w-full">
          <thead>
            <tr className="">
              <th className="px-4 py-2 text-center font-semibold">CANTIDAD</th>
              <th className="px-4 py-2 text-center font-semibold">FRECUENCIA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  label="Tabaco"
                  name="tabaco"
                  value={form?.tabaco}
                  onChange={handleChange}
                  labelWidth="60px"
                />
              </td>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  name="tabacoFrecuencia"
                  value={form?.tabacoFrecuencia}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  label="Alcohol"
                  name="alcohol"
                  value={form?.alcohol}
                  onChange={handleChange}
                  labelWidth="60px"
                />
              </td>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  name="alcoholFrecuencia"
                  value={form?.alcoholFrecuencia}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  label="Drogas"
                  name="drogas"
                  value={form?.drogas}
                  onChange={handleChange}
                  labelWidth="60px"
                />
              </td>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  name="drogasFrecuencia"
                  value={form?.drogasFrecuencia}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  label="Hoja de Coca"
                  name="hojaCoca"
                  value={form?.hojaCoca}
                  onChange={handleChange}
                  labelWidth="60px"
                />
              </td>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  name="hojaCocaFrecuencia"
                  value={form?.hojaCocaFrecuencia}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  label="Café"
                  name="cafe"
                  value={form?.cafe}
                  onChange={handleChange}
                  labelWidth="60px"
                />
              </td>
              <td className=" px-2 py-2">
                <InputTextOneLine
                  name="cafeFrecuencia"
                  value={form?.cafeFrecuencia}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Diagnóstico */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold mb-3">
          Conclusiones Finales
        </h3>
        <InputTextArea
          label="Diagnóstico"
          name="diagnostico"
          value={form?.diagnostico}
          onChange={handleChange}
          rows={4}
        />
        <div className="mb-4 gap-4 grid grid-cols-3 mt-3">
          <InputTextArea
            label="Conclusiones y Recomendaciones"
            name="conclusionesRecomendaciones"
            value={form?.conclusionesRecomendaciones}
            onChange={handleChange}
            className="col-span-2"
            rows={4}
          />
          {/* Recomendaciones específicas */}
          <div className="grid grid-cols-1 gap-2">
            <InputCheckbox
              label="Sobrepeso/Obesidad - Dieta Hipocalórica"
              name="sobrepesoObesidadHipocalorica"
              checked={form?.sobrepesoObesidadHipocalorica}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Corregir Agudeza Visual"
              name="corregirAgudezaVisual"
              checked={form?.corregirAgudezaVisual}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Corregir Agudeza Visual Total"
              name="corregirAgudezaVisualTotal"
              checked={form?.corregirAgudezaVisualTotal}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Obesidad - Dieta Hipocalórica"
              name="obesidadDietaHipocalorica"
              checked={form?.obesidadDietaHipocalorica}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Uso de Lentes Correctores para Lectura de Cerca"
              name="usoLentesCorrectoresLecturaCerca"
              checked={form?.usoLentesCorrectoresLecturaCerca}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Corregir Agudeza para Lectura de Cerca"
              name="corregirAgudezaLecturaCerca"
              checked={form?.corregirAgudezaLecturaCerca}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>

        {/* Médico */}
        <InputTextOneLine
          label="Médico que Certifica"
          name="nombre_medico"
          value={form?.nombre_medico}
          labelOnTop
          disabled
        />
      </section>
    </div>
  );
}