import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsBooleanRadioGroup,
  InputsRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function Antecedentes({
  form,
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Antecedentes Psiconeuroológicos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TEC Moderado/Grave */}
          <div className="space-y-2">
            <InputsBooleanRadioGroup
              label="TEC Moderado/ Grave"
              name="tecModeradoGrave"
              value={form?.tecModeradoGrave}
              onChange={handleRadioButtonBoolean}
              labelWidth="130px"
            />
            {form?.tecModeradoGrave && (
              <InputTextArea
                label="Descripción"
                name="tecModeradoGraveDescripcion"
                value={form?.tecModeradoGraveDescripcion}
                onChange={handleChange}
                rows={2}
              />
            )}
          </div>

          {/* Convulsiones */}
          <div className="space-y-2">
            <InputsBooleanRadioGroup
              label="Convulsiones"
              name="convulsiones"
              value={form?.convulsiones}
              onChange={handleRadioButtonBoolean}
              labelWidth="130px"
            />
            {form?.convulsiones && (
              <InputTextArea
                label="Descripción"
                name="convulsionesDescripcion"
                value={form?.convulsionesDescripcion}
                onChange={handleChange}
                rows={2}
              />
            )}
          </div>

          {/* Mareos/Modosidad/Acatisia */}
          <div className="space-y-2">
            <InputsBooleanRadioGroup
              label="Mareos/ Modosidad/ Acatisia"
              name="mareosModosidadAcatisia"
              value={form?.mareosModosidadAcatisia}
              onChange={handleRadioButtonBoolean}
              labelWidth="130px"
            />
            {form?.mareosModosidadAcatisia && (
              <InputTextArea
                label="Descripción"
                name="mareosModosidadAcatasiaDescripcion"
                value={form?.mareosModosidadAcatasiaDescripcion}
                onChange={handleChange}
                rows={2}
              />
            )}
          </div>

          {/* Problemas de Audición */}
          <div className="space-y-2">
            <InputsBooleanRadioGroup
              label="Problemas de Audición"
              name="problemasAudicion"
              value={form?.problemasAudicion}
              onChange={handleRadioButtonBoolean}
              labelWidth="130px"

            />
            {form?.problemasAudicion && (
              <InputTextArea
                label="Descripción"
                name="problemasAudicionDescripcion"
                value={form?.problemasAudicionDescripcion}
                onChange={handleChange}
                rows={2}
              />
            )}
          </div>

          {/* Problemas de Equilibrio */}
          <div className="space-y-2">
            <InputsBooleanRadioGroup
              label="Problemas de Equilibrio"
              name="problemasEquilibrio"
              value={form?.problemasEquilibrio}
              onChange={handleRadioButtonBoolean}
              labelWidth="130px"
            />
            {form?.problemasEquilibrio && (
              <InputTextArea
                label="Descripción"
                name="problemasEquilibrioDescripcion"
                value={form?.problemasEquilibrioDescripcion}
                onChange={handleChange}
                rows={2}
              />
            )}
          </div>

          {/* Acrofobia */}
          <div className="space-y-2">
            <InputsBooleanRadioGroup
              label="Acrofobia"
              name="acrofobia"
              value={form?.acrofobia}
              onChange={handleRadioButtonBoolean}
              labelWidth="130px"
            />
            {form?.acrofobia && (
              <InputTextArea
                label="Descripción"
                name="acrofobiaDescripcion"
                value={form?.acrofobiaDescripcion}
                onChange={handleChange}
                rows={2}
              />
            )}
          </div>

          {/* Agarofobia */}
          <div className="space-y-2">
            <InputsBooleanRadioGroup
              label="Agarofobia"
              name="agarofobia"
              value={form?.agarofobia}
              onChange={handleRadioButtonBoolean}
              labelWidth="130px"
            />
            {form?.agarofobia && (
              <InputTextArea
                label="Descripción"
                name="agarofobiaDescripcion"
                value={form?.agarofobiaDescripcion}
                onChange={handleChange}
                rows={2}
              />
            )}
          </div>
        </div>
      </section>

      {/* Consumo de Sustancias */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Consumo de Sustancias
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputTextOneLine
            label="Tabaco"
            name="tabaco"
            value={form?.tabaco}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Alcohol"
            name="alcohol"
            value={form?.alcohol}
            onChange={handleChange}
          />
          <InputsRadioGroup
            label="Drogas"
            name="drogas"
            value={form?.drogas}
            onChange={handleRadioButton}
            options={[
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" },
            ]}
          />
          <InputTextOneLine
            label="Hoja de Coca"
            name="hojaCoca"
            value={form?.hojaCoca}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Café"
            name="cafe"
            value={form?.cafe}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Diagnóstico */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Diagnóstico
        </h3>
        <InputTextArea
          label="Diagnóstico"
          name="diagnostico"
          value={form?.diagnostico}
          onChange={handleChange}
          rows={4}
        />
      </section>

      {/* Conclusiones y Recomendaciones */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Conclusiones y Recomendaciones
        </h3>

        {/* Aptitud */}
        <div className="mb-4">
          <h4 className="font-medium mb-3 text-gray-700">Aptitud</h4>
          <div className="flex gap-6">
            <InputCheckbox
              label="Apto"
              name="apto"
              checked={form?.apto}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="No Apto"
              name="noApto"
              checked={form?.noApto}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Apto con Restricción"
              name="aptoConRestriccion"
              checked={form?.aptoConRestriccion}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>

        {/* Recomendaciones específicas */}
        <div className="mb-4">
          <h4 className="font-medium mb-3 text-gray-700">Recomendaciones Específicas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextOneLine
            label="Nombre y Apellidos del Médico"
            name="nombreApellidosMedico"
            value={form?.nombreApellidosMedico}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Nro. Colegiatura"
            name="nroColegiaturaDoctor"
            value={form?.nroColegiaturaDoctor}
            onChange={handleChange}
          />
        </div>
      </section>
    </div>
  );
}