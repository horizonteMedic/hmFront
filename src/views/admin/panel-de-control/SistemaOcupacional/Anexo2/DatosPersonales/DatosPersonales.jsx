import Swal from "sweetalert2";
import {
  InputCheckbox,
  InputsBooleanRadioGroup,
  InputTextArea,
  InputTextOneLine,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function DatosPersonales({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleCheckBoxChange,
  handleRadioButtonBoolean,
  handleSearch,
}) {
  function handleAgregarEnfermedad() {
    setForm((prev) => {
      const nuevasEnfermedades = [
        ...prev.dataEnfermedades,
        {
          enfermedad: prev.enfermedad,
          asociadoTrabajo: prev.asociadoTrabajo,
          anio: prev.anio,
          diasDescanso: prev.diasDescanso,
        },
      ].sort((a, b) => Number(a.anio) - Number(b.anio)); // Ordena de menor a mayor

      return {
        ...prev,
        enfermedad: "",
        asociadoTrabajo: false,
        anio: "",
        diasDescanso: "",
        dataEnfermedades: nuevasEnfermedades,
      };
    });
  }

  function handleLimpiarEnfermedad() {
    setForm((prev) => ({
      ...prev,
      dataEnfermedades: [],
    }));
  }

  function handleEliminarEnfermedad(index) {
    setForm((prev) => ({
      ...prev,
      dataEnfermedades: prev.dataEnfermedades.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="p-4" style={{ fontSize: "10px" }}>
      {/* Header con información del examen */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
        <h3 className="font-semibold mb-2 text-gray-800">Datos Personales</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
            labelWidth="100px"
          />
          <InputTextOneLine
            label="Examen Médico"
            name="nomExamen"
            value={form.nomExamen}
            disabled
            labelWidth="100px"
          />
          <InputTextOneLine
            label="Fecha Examen"
            name="fechaExam"
            type="date"
            value={form.fechaExam}
            onChange={handleChange}
            labelWidth="100px"
          />
        </div>
      </div>

      {/* Contenido principal - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Columna Izquierda */}
        <div className="lg:col-span-6 space-y-3">
          {/* Identificación Personal */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Identificación Personal
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <InputTextOneLine
                label="DNI"
                name="dni"
                value={form.dni}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Fecha Nac."
                name="fechaNac"
                value={form.fechaNac}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Nombres"
                name="nombres"
                value={form.nombres}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Apellidos"
                name="apellidos"
                value={form.apellidos}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Sexo"
                name="sexo"
                value={form.sexo}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Edad"
                name="edad"
                value={form.edad}
                disabled
                labelWidth="65px"
              />
            </div>
          </div>

          {/* Contacto y Estado Civil */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Contacto y Estado Civil
            </h4>
            <div className="space-y-2">
              <InputTextOneLine
                label="Lugar Nac."
                name="lugarNac"
                value={form.lugarNac}
                disabled
              />
              <InputTextOneLine
                label="Domicilio"
                name="domicilio"
                value={form.domicilio}
                disabled
              />
              <InputTextOneLine
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                disabled
              />
              <InputTextOneLine
                label="Estado Civil"
                name="estadoCivil"
                value={form.estadoCivil}
                disabled
              />
              <InputTextOneLine
                label="Grado Inst."
                name="gradoInstruccion"
                value={form.gradoInstruccion}
                disabled
              />
            </div>
          </div>

          {/* Información Laboral */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Información Laboral
            </h4>
            <div className="space-y-2">
              <InputTextOneLine
                label="Empresa"
                name="empresa"
                value={form.empresa}
                disabled
              />
              <InputTextOneLine
                label="Contrata"
                name="contrata"
                value={form.contrata}
                disabled
              />
              <InputTextOneLine
                label="Mineral Exp"
                name="mineralExp"
                value={form.mineralExp}
                disabled
              />
              <InputTextOneLine
                label="Explotación"
                name="explotacion"
                value={form.explotacion}
                disabled
              />
              <InputTextOneLine
                label="Altura Labor"
                name="alturaLaboral"
                value={form.alturaLaboral}
                disabled
              />
              <InputTextOneLine
                label="Puesto Postula"
                name="puestoPostula"
                value={form.puestoPostula}
                disabled
              />
              <InputTextOneLine
                label="Área Puesto"
                name="areaPuesto"
                value={form.areaPuesto}
                disabled
              />
              <InputTextOneLine
                label="Puesto Actual"
                name="puestoActual"
                value={form.puestoActual}
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Tiempo"
                name="tiempoPuesto"
                value={form.tiempoPuesto}
                onChange={handleChange}
              />
            </div>
          </div>
          <InputTextArea
            label="Notas Para Doctor"
            name="notasDoctor"
            value={form.notasDoctor}
            rows={4}
            disabled
          />
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-6 space-y-3">
          {/* Antecedentes Personales */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Antecedentes Personales
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid grid-cols-2">
                <InputCheckbox
                  label="Neoplasia"
                  checked={form.neoplasia}
                  name="neoplasia"
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    if (!e.target.checked)
                      setForm((prevForm) => ({
                        ...prevForm,
                        neoplasiaDescripcion: "",
                      }));
                  }}
                />
                <InputTextOneLine
                  name="neoplasiaDescripcion"
                  value={form.neoplasiaDescripcion}
                  onChange={handleChange}
                  disabled={!form.neoplasia}
                />
              </div>
              <div className="grid grid-cols-2">
                <InputCheckbox
                  label="ITS"
                  checked={form.its}
                  name="its"
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    if (!e.target.checked)
                      setForm((prevForm) => ({
                        ...prevForm,
                        itsDescripcion: "",
                      }));
                  }}
                />
                <InputTextOneLine
                  name="itsDescripcion"
                  value={form.itsDescripcion}
                  onChange={handleChange}
                  disabled={!form.its}
                />
              </div>

              <div className="grid grid-cols-2">
                <InputCheckbox
                  label="Quemaduras"
                  checked={form.quemaduras}
                  name="quemaduras"
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    if (!e.target.checked)
                      setForm((prevForm) => ({
                        ...prevForm,
                        quemadurasDescripcion: "",
                      }));
                  }}
                />
                <InputTextOneLine
                  name="quemadurasDescripcion"
                  value={form.quemadurasDescripcion}
                  onChange={handleChange}
                  disabled={!form.quemaduras}
                />
              </div>

              <div className="grid grid-cols-2">
                <InputCheckbox
                  label="Cirugías"
                  checked={form.cirugias}
                  name="cirugias"
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    if (!e.target.checked)
                      setForm((prevForm) => ({
                        ...prevForm,
                        cirugiasDescripcion: "",
                      }));
                  }}
                />
                <InputTextOneLine
                  name="cirugiasDescripcion"
                  value={form.cirugiasDescripcion}
                  onChange={handleChange}
                  disabled={!form.cirugias}
                />
              </div>

              <div className="grid grid-cols-4 col-span-2">
                <InputCheckbox
                  label="Otros"
                  checked={form.otrosAntecedentes}
                  name="otrosAntecedentes"
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    if (!e.target.checked)
                      setForm((prevForm) => ({
                        ...prevForm,
                        otrosAntecedentesDescripcion: "",
                      }));
                  }}
                />
                <InputTextOneLine
                  name="otrosAntecedentesDescripcion"
                  value={form.otrosAntecedentesDescripcion}
                  onChange={handleChange}
                  disabled={!form.otrosAntecedentes}
                  className="col-span-3 -ml-0.5"
                />
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            {/* Residencia en el lugar de trabajo */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 mb-2">
                Residencia en el lugar de trabajo
              </h4>
              <div className="space-y-2">
                <div className="grid gap-2 grid-cols-1 ">
                  <div className="flex gap-4">
                    <label className="font-semibold text-gray-700 max-w-[80px] min-w-[80px]">
                      Reside:
                    </label>
                    <InputsBooleanRadioGroup
                      name="reside"
                      value={form.reside}
                      onChange={handleRadioButtonBoolean}
                    />
                  </div>
                  <InputTextOneLine
                    label="Tiempo"
                    name="tiempoReside"
                    value={form.tiempoReside}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <InputCheckbox
                    label="ESSALUD"
                    checked={form.essalud}
                    onChange={handleCheckBoxChange}
                    name="essalud"
                  />
                  <InputCheckbox
                    label="EPS"
                    checked={form.eps}
                    onChange={handleCheckBoxChange}
                    name="eps"
                  />
                  <InputCheckbox
                    label="Otros"
                    checked={form.otrosResidencia}
                    onChange={handleCheckBoxChange}
                    name="otrosResidencia"
                  />
                  <InputCheckbox
                    label="SCTR"
                    checked={form.sctr}
                    onChange={handleCheckBoxChange}
                    name="sctr"
                  />
                  <InputCheckbox
                    label="Otros"
                    checked={form.otrosResidencia1}
                    onChange={handleCheckBoxChange}
                    name="otrosResidencia1"
                  />
                </div>
              </div>
            </div>
            {/* Número de Hijos */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 mb-2">
                Número de Hijos
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <InputTextOneLine
                  label="Vivos"
                  name="hijosVivos"
                  value={form.hijosVivos}
                  onChange={handleChange}
                />
                <InputTextOneLine
                  label="Muertos"
                  name="hijosMuertos"
                  value={form.hijosMuertos}
                  onChange={handleChange}
                />
                <InputTextOneLine
                  label="Dependientes"
                  name="hijosDependientes"
                  value={form.hijosDependientes}
                  onChange={handleChange}
                />
                <InputTextOneLine
                  label="Total"
                  name="totalHijos"
                  value={form.totalHijos}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Antecedentes Familiares */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Antecedentes Familiares
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <InputTextOneLine
                label="Padre"
                name="antecendentesPadre"
                value={form.antecendentesPadre}
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Madre"
                name="antecendentesMadre"
                value={form.antecendentesMadre}
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Hermanos"
                name="antecendentesHermano"
                value={form.antecendentesHermano}
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Esposa(o)"
                name="antecendentesEsposao"
                value={form.antecendentesEsposao}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Medicamentos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <h4 className="font-semibold text-gray-800 mb-2">Medicamentos</h4>
            <div className="flex gap-4">
              <label className="font-semibold text-gray-700 max-w-[120px] min-w-[120px]">
                Toma medicamentos:
              </label>
              <InputsBooleanRadioGroup
                name="tomaMedicamento"
                value={form.tomaMedicamento}
                onChange={(e, value) => {
                  handleRadioButtonBoolean(e, value);
                  if (!value)
                    setForm((prevForm) => ({
                      ...prevForm,
                      tipoMedicamentos: "",
                      frecuenciaMedicamentos: "",
                    }));
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputTextOneLine
                label="Tipo"
                name="tipoMedicamentos"
                value={form.tipoMedicamentos}
                onChange={handleChange}
                disabled={!form.tomaMedicamento}
              />
              <InputTextOneLine
                label="Frecuencia"
                name="frecuenciaMedicamentos"
                value={form.frecuenciaMedicamentos}
                onChange={handleChange}
                disabled={!form.tomaMedicamento}
              />
            </div>
          </div>

          {/* Absentismo */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Absentismo: Enfermedades y accidentes
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {/* Enfermedad, Accidente */}
              <InputTextOneLine
                label="Enfermedad, Accidente"
                name="enfermedad"
                value={form.enfermedad}
                onChange={handleChange}
              />
              {/* Asociado al Trabajo */}
              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-700 min-w-[120px]">
                  Asociado al Trabajo:
                </label>
                <InputsBooleanRadioGroup
                  name="asociadoTrabajo"
                  value={form.asociadoTrabajo}
                  onChange={handleRadioButtonBoolean}
                />
              </div>
              {/* Año y Días descanso */}
              <InputTextOneLine
                label="Año"
                name="anio"
                value={form.anio}
                onChange={handleChangeNumber}
              />
              <InputTextOneLine
                label="Días descanso"
                name="diasDescanso"
                value={form.diasDescanso}
                onChange={handleChangeNumber}
              />
            </div>
            <div className="flex gap-4 justify-center mt-3 mb-3">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleAgregarEnfermedad}
              >
                Agregar
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={handleLimpiarEnfermedad}
              >
                Limpiar
              </button>
            </div>
            <Table data={form.dataEnfermedades} onEliminar={handleEliminarEnfermedad} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Table({ data, onEliminar }) {
  const handleContextMenu = (e, index) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este elemento se eliminará permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onEliminar(index);
        Swal.fire("Eliminado", "El elemento ha sido eliminado.", "success");
      }
    });
  }

  return (
    <div className="overflow-y-auto py-3" style={{ maxHeight: "150px" }}>
      <table className="w-full table-auto border-collapse ">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left text-lg">
              Enfermedad-Accidente
            </th>
            <th className="border px-2 py-1 text-left text-lg">
              Asociado Trabajo
            </th>
            <th className="border px-2 py-1 text-left text-lg">Año</th>
            <th className="border px-2 py-1 text-left text-lg">
              Días Descanso
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className={`hover:bg-[#233245] hover:text-white cursor-pointer text-lg `}
                onContextMenu={(e) => handleContextMenu(e, i)}
                title="Click derecho para eliminar"
              >
                <td className="border px-2 py-1 font-bold">
                  {row.enfermedad ?? ""}
                </td>
                <td className="border px-2 py-1">
                  {row.asociadoTrabajo ? "SÍ" : "NO"}
                </td>
                <td className="border px-2 py-1">{row.anio ?? ""}</td>
                <td className="border px-2 py-1">{row.diasDescanso ?? ""}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-4 text-gray-500 text-lg"
              >
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
