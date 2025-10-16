import {
  InputTextOneLine,
  InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function ExamenFisico({
  form,
  handleChange,
  handleChangeNumber,
}) {
  return (
    <div className="space-y-6">
      {/* Perímetros */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Perímetros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine
            label="Perímetro de Cadera (cm)"
            name="perimetroCadera"
            value={form?.perimetroCadera}
            onChange={handleChangeNumber}
          />
          <InputTextOneLine
            label="Perímetro de Cuello (cm)"
            name="perimetroCuello"
            value={form?.perimetroCuello}
            onChange={handleChangeNumber}
          />
          <InputTextOneLine
            label="Perímetro de Cintura (cm)"
            name="perimetroCintura"
            value={form?.perimetroCintura}
            onChange={handleChangeNumber}
          />
        </div>
      </section>

      {/* Medidas Corporales */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Medidas Corporales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine
            label="Talla (cm)"
            name="talla"
            value={form?.talla}
            onChange={handleChangeNumber}
          />
          <InputTextOneLine
            label="Peso (kg)"
            name="peso"
            value={form?.peso}
            onChange={handleChangeNumber}
          />
          <InputTextOneLine
            label="IMC"
            name="imc"
            value={form?.imc}
            onChange={handleChangeNumber}
          />
        </div>
      </section>
      {/* Medidas Corporales */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Medidas Extra
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine
            label="Frecuencia Cardiaca"
            name="fc"
            value={form?.fc}
            onChange={handleChangeNumber}
          />
          <InputTextOneLine
            label="Frecuencia Respiratoria"
            name="fr"
            value={form?.fr}
            onChange={handleChangeNumber}
          />
          <InputTextOneLine
            label="Presión Arterial"
            name="pa"
            value={form?.pa}
            onChange={handleChangeNumber}
            labelWidth="84px"
          />
        </div>
      </section>

      {/* Inspección General */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Inspección General
        </h3>
        <InputTextArea
          label="Descripción"
          name="inspeccionGeneral"
          value={form?.inspeccionGeneral}
          onChange={handleChange}
          rows={3}
        />
      </section>

      {/* Examen Físico Detallado */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Examen Físico Detallado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextArea
            label="Cabeza"
            name="cabeza"
            value={form?.cabeza}
            onChange={handleChange}
            rows={2}
          />
          <InputTextArea
            label="Piel"
            name="piel"
            value={form?.piel}
            onChange={handleChange}
            rows={2}
          />
          <InputTextArea
            label="Movilidad Ocular"
            name="movilidadOcular"
            value={form?.movilidadOcular}
            onChange={handleChange}
            rows={2}
          />
          <InputTextArea
            label="Nariz"
            name="nariz"
            value={form?.nariz}
            onChange={handleChange}
            rows={2}
          />
          <InputTextOneLine
            label="Otoscopia O.D"
            name="otoscopiaOD"
            value={form?.otoscopiaOD}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Otoscopia O.I"
            name="otoscopiaOI"
            value={form?.otoscopiaOI}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Aparato Respiratorio */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Aparato Respiratorio
        </h3>
        <InputTextArea
          label="Descripción"
          name="aparatoRespiratorio"
          value={form?.aparatoRespiratorio}
          onChange={handleChange}
          rows={3}
        />
      </section>

      {/* Aparato Cardiovascular */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Aparato Cardiovascular
        </h3>
        <InputTextArea
          label="Descripción"
          name="aparatoCardiovascular"
          value={form?.aparatoCardiovascular}
          onChange={handleChange}
          rows={3}
        />
      </section>

      {/* Abdomen */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Abdomen
        </h3>
        <InputTextArea
          label="Descripción"
          name="abdomen"
          value={form?.abdomen}
          onChange={handleChange}
          rows={3}
        />
      </section>

      {/* Sistema Musculoesquelético */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Sistema Musculoesquelético
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextArea
            label="Musculoesquelético"
            name="musculoEsqueletico"
            value={form?.musculoEsqueletico}
            onChange={handleChange}
            rows={3}
          />
          <InputTextArea
            label="Columna"
            name="columna"
            value={form?.columna}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </section>

      {/* Test de Epworth y Otros Exámenes */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Test de Epworth y Otros Exámenes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextArea
            label="Test de Epworth"
            name="testEpworth"
            value={form?.testEpworth}
            onChange={handleChange}
            rows={3}
          />
          <InputTextArea
            label="Otros Exámenes de Laboratorio"
            name="otrosExaLaboratorio"
            value={form?.otrosExaLaboratorio}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </section>
    </div>
  );
}