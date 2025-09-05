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

  MedicosMulti,
}) {
  const handleNombreMedicoSearch = (e) => {
    const v = e.target.value.toUpperCase();
    setForm((d) => ({
      ...d,
      nombre_medico: v,
      filteredNombresMedicos: v
        ? MedicosMulti.filter((medico) =>
            medico.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : [],
    }));
  };
  const handleSelectNombreMedico = (medico) => {
    setForm((d) => ({
      ...d,
      nombre_medico: medico.mensaje,
      filteredNombresMedicos: [],
    }));
  };

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
          <div className="relative flex-grow flex items-center">
            <input
              id="nombre_medico"
              name="nombre_medico"
              type="text"
              autoComplete="off"
              value={form.nombre_medico || ""}
              onChange={handleNombreMedicoSearch}
              className="border rounded px-2 py-1 w-full"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  form.filteredNombresMedicos.length > 0
                ) {
                  e.preventDefault();
                  handleSelectNombreMedico(form.filteredNombresMedicos[0]);
                }
              }}
              onFocus={() => {
                if (form.nombre_medico) {
                  setForm((prev) => ({
                    ...prev,
                    filteredNombresMedicos: MedicosMulti.filter((emp) =>
                      emp.mensaje
                        .toLowerCase()
                        .includes(form.nombre_medico.toLowerCase())
                    ),
                  }));
                }
              }}
              onBlur={() =>
                setTimeout(
                  () =>
                    setForm((prev) => ({
                      ...prev,
                      filteredNombresMedicos: [],
                    })),
                  100
                )
              }
            />
            {form.nombre_medico && form.filteredNombresMedicos.length > 0 && (
              <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded max-h-40 overflow-y-auto z-10">
                {form.filteredNombresMedicos.map((medico) => (
                  <li
                    key={medico.id}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                    onMouseDown={() => handleSelectNombreMedico(medico)}
                  >
                    {medico.mensaje}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
