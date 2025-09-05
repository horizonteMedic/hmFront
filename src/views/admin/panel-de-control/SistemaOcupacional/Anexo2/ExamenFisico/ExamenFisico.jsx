import {
  InputTextArea,
  InputTextOneLine,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function ExamenFisico({
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
    <div className="p-6" style={{ fontSize: "11px" }}>
      <h3 className="font-semibold mb-6 text-gray-800">
        Examen Físico por Sistemas
      </h3>

      {/* Examen Físico por Sistemas */}
      <div className="space-y-2">
        <InputTextOneLine
          label="Cabeza"
          name="cabeza"
          value={form.cabeza}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Cuello"
          name="cuello"
          value={form.cuello}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Boca"
          name="boca"
          value={form.boca}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Faringe"
          name="faringe"
          value={form.faringe}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Nariz"
          name="nariz"
          value={form.nariz}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Oídos"
          name="oidos"
          value={form.oidos}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Marcha"
          name="marcha"
          value={form.marcha}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Piel"
          name="piel"
          value={form.piel}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Aparato Respiratorio"
          name="aparatoRespiratorio"
          value={form.aparatoRespiratorio}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Apa. Cardiovascular"
          name="apaCardiovascular"
          value={form.apaCardiovascular}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Aparato Digestivo"
          name="aparatoDigestivo"
          value={form.aparatoDigestivo}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="A. Genitourinario"
          name="aGenitourinario"
          value={form.aGenitourinario}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Aparato Locomotor"
          name="aparatoLocomotor"
          value={form.aparatoLocomotor}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Miembros Superiores"
          name="miembrosSuperiores"
          value={form.miembrosSuperiores}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Miembros Inferiores"
          name="miembrosInferiores"
          value={form.miembrosInferiores}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Sistema Linfático"
          name="sistemaLinfatico"
          value={form.sistemaLinfatico}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Sistema Nervioso"
          name="sistemaNervioso"
          value={form.sistemaNervioso}
          labelWidth="125px"
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Columna Vertebral"
          name="columnaVertebral"
          value={form.columnaVertebral}
          labelWidth="125px"
          onChange={handleChange}
        />
      </div>

      {/* Sección de Otros Exámenes y Médico */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Otros Exámenes */}
        <InputTextArea
          rows="8"
          label="Otros Exámenes"
          name="otrosExamenes"
          value={form.otrosExamenes}
          onChange={handleChange}
        />

        {/* Médico que Certifica */}
        <div>
          <label className="block font-semibold  mb-1">
            Medico que Certifica:
          </label>
          <InputTextOneLine
            name="medicoCertifica"
            value={form.medicoCertifica}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
