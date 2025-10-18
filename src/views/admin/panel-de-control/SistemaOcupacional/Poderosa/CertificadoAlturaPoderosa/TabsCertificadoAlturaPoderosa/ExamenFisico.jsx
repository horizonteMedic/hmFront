import {
  InputTextOneLine,
  InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function ExamenFisico({
  form,
  handleChange,
}) {
  return (
    <div className="space-y-6">
      {/* Perímetros */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Triaje
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine
            label="Perímetro de Cadera (cm)"
            name="perimetroCadera"
            value={form?.perimetroCadera}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="Perímetro de Cuello (cm)"
            name="perimetroCuello"
            value={form?.perimetroCuello}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="Perímetro de Cintura (cm)"
            name="perimetroCintura"
            value={form?.perimetroCintura}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="Talla (m)"
            name="talla"
            value={form?.talla}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="Peso (kg)"
            name="peso"
            value={form?.peso}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="IMC"
            name="imc"
            value={form?.imc}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="Frecuencia Cardiaca"
            name="fc"
            value={form?.fc}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="Frecuencia Respiratoria"
            name="fr"
            value={form?.fr}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="Presión Arterial"
            name="pa"
            value={form?.pa}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="ICC"
            name="icc"
            value={form?.icc}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="P. Torácico Inspiración"
            name="pToracicoInspiracion"
            value={form?.pToracicoInspiracion}
            disabled
            labelWidth="84px"
          />
          <InputTextOneLine
            label="P. Torácico Espiración"
            name="pToracicoEspiracion"
            value={form?.pToracicoEspiracion}
            disabled
            labelWidth="84px"
          />
        </div>
      </section>

      {/* Examen Físico Detallado */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Examen Físico Detallado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-3">
            <InputTextArea
              label="Apreciación General"
              name="apreciacionGeneral"
              value={form?.apreciacionGeneral}
              onChange={handleChange}
              rows={3}
            />
            <InputTextOneLine
              label="Cabeza"
              name="cabeza"
              value={form?.cabeza}
              onChange={handleChange}
            />
            <InputTextOneLine
              label="Piel"
              name="piel"
              value={form?.piel}
              onChange={handleChange}
            />
            <InputTextOneLine
              label="Movilidad Ocular"
              name="movilidadOcular"
              value={form?.movilidadOcular}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
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
            <InputTextOneLine
              label="Nariz"
              name="nariz"
              value={form?.nariz}
              onChange={handleChange}
            />
            <InputTextArea
              label="Aparato Respiratorio"
              name="aparatoRespiratorio"
              value={form?.aparatoRespiratorio}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="grid gap-3">
            <InputTextOneLine
              label="Aparato Cardiovascular"
              name="aparatoCardiovascular"
              value={form?.aparatoCardiovascular}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Abdomen"
              name="abdomen"
              value={form?.abdomen}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Musculoesquelético"
              name="musculoEsqueletico"
              value={form?.musculoEsqueletico}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Columna"
              name="columna"
              value={form?.columna}
              onChange={handleChange}
              labelWidth="120px"
            />
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
        </div>
      </section>
    </div>
  );
}