import {
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
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Cuello"
          name="cuello"
          value={form.cuello}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Boca"
          name="boca"
          value={form.boca}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Faringe"
          name="faringe"
          value={form.faringe}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Nariz"
          name="nariz"
          value={form.nariz}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Oídos"
          name="oidos"
          value={form.oidos}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Marcha"
          name="marcha"
          value={form.marcha}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Piel"
          name="piel"
          value={form.piel}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Aparato Respiratorio"
          name="aparatoRespiratorio"
          value={form.aparatoRespiratorio}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Apa. Cardiovascular"
          name="apaCardiovascular"
          value={form.apaCardiovascular}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Aparato Digestivo"
          name="aparatoDigestivo"
          value={form.aparatoDigestivo}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="A. Genitourinario"
          name="aGenitourinario"
          value={form.aGenitourinario}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Aparato Locomotor"
          name="aparatoLocomotor"
          value={form.aparatoLocomotor}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Miembros Superiores"
          name="miembrosSuperiores"
          value={form.miembrosSuperiores}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Miembros Inferiores"
          name="miembrosInferiores"
          value={form.miembrosInferiores}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Sistema Linfático"
          name="sistemaLinfatico"
          value={form.sistemaLinfatico}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Sistema Nervioso"
          name="sistemaNervioso"
          value={form.sistemaNervioso}
          disabled
          labelWidth="125px"
        />

        <InputTextOneLine
          label="Columna Vertebral"
          name="columnaVertebral"
          value={form.columnaVertebral}
          disabled
          labelWidth="125px"
        />
      </div>

      {/* Sección de Otros Exámenes y Médico */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Otros Exámenes */}
        <div>
          <label className="block font-semibold  mb-1">Otros Exámenes:</label>
          <textarea
            rows="8"
            name="otrosExamenes"
            value={form.otrosExamenes}
            disabled
            className="border rounded px-2 py-1 w-full resize-none bg-gray-100"
          />
        </div>

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
