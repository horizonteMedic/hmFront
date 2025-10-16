import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function Neurologico({
  form,
  handleChange,
  handleCheckBoxChange,
  handleRadioButtonBoolean,
}) {
  return (
    <div className="space-y-6">
      {/* Reflejos */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Reflejos
        </h3>
        <InputsBooleanRadioGroup
          label="Reflejos Conservados"
          name="reflejosConservados"
          value={form?.reflejosConservados}
          onChange={handleRadioButtonBoolean}
        />
      </section>

      {/* Pruebas Neurológicas Específicas */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Pruebas Neurológicas Específicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextOneLine
            label="Dedo-Nariz"
            name="dedoNariz"
            value={form?.dedoNariz}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Índice Banany"
            name="indiceBanany"
            value={form?.indiceBanany}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Disdiadococinesia"
            name="disdiadococinesia"
            value={form?.disdiadococinesia}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Romberg Simple"
            name="rombergSimple"
            value={form?.rombergSimple}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Romberg Sensibilizado"
            name="rombergSensibilizado"
            value={form?.rombergSensibilizado}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Marcha en Tándem"
            name="marchaEnTandem"
            value={form?.marchaEnTandem}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Pruebas Generales */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Pruebas Generales
        </h3>
        <InputTextArea
          label="Descripción de Pruebas"
          name="pruebas"
          value={form?.pruebas}
          onChange={handleChange}
          rows={4}
        />
      </section>

      {/* Resultados de Pruebas Específicas */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Resultados de Pruebas Específicas
        </h3>

        {/* Pruebas Generales */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-700">Pruebas Generales</h4>
          <div className="flex gap-6">
            <InputCheckbox
              label="Negativo"
              name="pruebasNegativo"
              checked={form?.pruebasNegativo}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Positivo"
              name="pruebasPositivo"
              checked={form?.pruebasPositivo}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>

        {/* Pruebas Untenberg */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-700">Pruebas Untenberg</h4>
          <div className="flex gap-6">
            <InputCheckbox
              label="Untenberg"
              name="pruebasUntenberg"
              checked={form?.pruebasUntenberg}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Negativo"
              name="pruebasNegativoUntenberg"
              checked={form?.pruebasNegativoUntenberg}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Positivo"
              name="pruebasPositivoUntenberg"
              checked={form?.pruebasPositivoUntenberg}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>

        {/* Otras Pruebas */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-700">Otras Pruebas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputCheckbox
              label="Babinski"
              name="pruebasBabinski"
              checked={form?.pruebasBabinski}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Dix-Hallpike"
              name="pruebasDixHallpike"
              checked={form?.pruebasDixHallpike}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Marcha"
              name="pruebasMarcha"
              checked={form?.pruebasMarcha}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>
      </section>

      {/* Observaciones Neurológicas */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Observaciones Neurológicas
        </h3>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-800 text-sm mb-2">
            <strong>Nota:</strong> Registre cualquier hallazgo anormal o significativo encontrado durante el examen neurológico.
          </p>
          <p className="text-yellow-700 text-sm">
            Las pruebas neurológicas son fundamentales para evaluar la aptitud para trabajos en altura,
            especialmente en lo que respecta al equilibrio, coordinación y función vestibular.
          </p>
        </div>
      </section>
    </div>
  );
}