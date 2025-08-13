import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ExamenFisicoI from "./ExamenFisicoI";
import ExamenFisicoII from "./ExamenFisicoII";
import ExamenFisicoIII from "./ExamenFisicoIII";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormState = {
  norden: "",
  nombres: "",
  dni: "",
  areaTrabajo: "",
  edad: "",
  sexo: "",
  fecha: today,
  empresa: "",
  tiempoServicio: "",

  // Síntomas
  sintomas: "NO",
  cualesSintomas: "NINGUNO",

  // Uso de Faja Lumbar
  usoFajaLumbar: "NO",

  // Técnica de Levantamiento
  tecnicaLevantamiento: "NO",

  // Capacitación
  capacitacionLevantamiento: "NO",

  // Cabeza y Cuello
  extensionCabeza: "CONSERVADO",
  flexionCabeza: "CONSERVADO",
  gradoExtension: "N",
  gradoFlexion: "N",

  // Miembros Superiores - Tórax
  flexionTorax: "N",
  extensionTorax: "N",
  rotacionTorax: "N",
  flexionToraxDerecho: "N",
  extensionToraxDerecho: "N",
  rotacionToraxDerecho: "N",

  // Miembros Superiores - Hombro
  flexionHombro: "N",
  extensionHombro: "N",
  abduccionHombro: "N",
  aduccionHombro: "N",
  rotacionInternaHombro: "N",
  rotacionExternaHombro: "N",
  flexionHombroDerecho: "N",
  extensionHombroDerecho: "N",
  abduccionHombroDerecho: "N",
  aduccionHombroDerecho: "N",
  rotacionInternaHombroDerecho: "N",
  rotacionExternaHombroDerecho: "N",

  // Miembros Superiores - Brazo
  flexionBrazo: "N",
  extensionBrazo: "N",
  flexionBrazoDerecho: "N",
  extensionBrazoDerecho: "N",

  // Miembros Superiores - Antebrazo
  pronacionAntebrazo: "N",
  supinacionAntebrazo: "N",
  pronacionAntebrazoDerecho: "N",
  supinacionAntebrazoDerecho: "N",

  // Examen Físico II - Muñeca
  flexionMuneca: "N",
  extensionMuneca: "N",
  desviacionCubitalMuneca: "N",
  desviacionRadialMuneca: "N",
  signoPhallen: "NO",
  signoTinel: "NO",

  // Examen Físico II - Cadera
  flexionCadera: "N",
  extensionCadera: "N",
  abduccionCadera: "N",
  aduccionCadera: "N",
  rotacionInternaCadera: "N",
  rotacionExternaCadera: "N",

  // Examen Físico II - Pierna
  flexionPierna: "N",
  extensionPierna: "N",

  // Examen Físico II - Rodilla
  flexionRodilla: "N",
  extensionRodilla: "N",
  rotacionInternaRodilla: "N",
  rotacionExternaRodilla: "N",

  // Examen Físico III - Tobillo
  flexionTobillo: "N",
  extensionTobillo: "N",

  // Examen Físico III - Columna Vertebral
  desviacionEjeCervical: "NORMAL",
  desviacionEjeDorsal: "NORMAL",
  desviacionEjeLumbar: "NORMAL",
  cifosis: "NO",
  escoliosis: "NO",
  lordosis: "NO",
  mixta: "NO",
  fuerzaMuscular: "1",
  dolorCervical: "NO",
  dolorDorsal: "NO",
  dolorLumbar: "NO",
  signoLesagueDerecho: "NO",
  signoLesagueIzquierdo: "NO",

  // Conclusión y Comentarios
  tratamiento: "NO",
  conclusion: "SI",
  diagnostico: "",
  recomendaciones: "",
  nombreMedico: "",
};

export default function EvaluacionMusculoEsqueletica({
  token,
  selectedSede,
  userlogued,
}) {
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value.toUpperCase() }));
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    if (/^[\d/]*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleRadioButton = (e, value) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value.toUpperCase(),
    }));
  };

  const handleClear = () => {
    setForm(initialFormState);
  };
  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
  };

  const handleSave = () => {
    // Aquí iría la función de guardado
    // SubmitDataService(form, token, userlogued, handleClear, tabla);
    Swal.fire("Éxito", "Datos guardados correctamente", "success");
  };

  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Reporte?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí iría la función de impresión
        // PrintHojaR(form.norden, token, tabla);
        Swal.fire("Éxito", "Reporte enviado a impresión", "success");
      }
    });
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  return (
    <div className="w-full text-[11px]">
      {/* Header Form */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b-2 pb-2">
          FILIACIÓN
        </h2>
        <form className="p-4 rounded w-full border">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center gap-3 w-full">
            {/* Primera fila: n° orden, nombres (largo), edad */}
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">N° Orden :</label>
              <input
                className="border rounded px-2 py-1 w-full "
                name="norden"
                value={form.norden || ""}
                onChange={handleChangeNumber}
                onKeyDown={handleSearch}
              />
            </div>
            <div className="flex items-center gap-4 xl:col-span-2">
              <label className="font-semibold min-w-[65px]">Nombres :</label>
              <input
                className="border rounded px-2 py-1 w-full "
                name="nombres"
                value={form.nombres || ""}
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">Edad :</label>
              <input
                className="border rounded px-2 py-1 w-full "
                name="edad"
                value={form.edad ?? ""}
                disabled
              />
            </div>

            {/* Segunda fila: dni, fecha, sexo, t. servicio */}
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">DNI :</label>
              <input
                className="border rounded px-2 py-1 w-full "
                name="dni"
                value={form.dni ?? ""}
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">Fecha :</label>
              <input
                type="date"
                className="border rounded px-2 py-1 w-full"
                name="fecha"
                value={form.fecha || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">Sexo :</label>
              <input
                className="border rounded px-2 py-1 w-full "
                name="sexo"
                value={form.sexo || ""}
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">
                T. Servicio :
              </label>
              <input
                className="border rounded px-2 py-1 w-full "
                name="tiempoServicio"
                value={form.tiempoServicio || ""}
                disabled
              />
            </div>

            {/* Tercera fila: área trabajo (largo), empresa (largo) */}
            <div className="flex items-center gap-4 xl:col-span-2">
              <label className="font-semibold min-w-[65px] max-w-[65px]">
                Área Trabajo :
              </label>
              <input
                className="border rounded px-2 py-1 w-full "
                name="areaTrabajo"
                value={form.areaTrabajo || ""}
                disabled
              />
            </div>
            <div className="flex items-center gap-4 xl:col-span-2">
              <label className="font-semibold min-w-[65px]">Empresa :</label>
              <input
                className="border rounded px-2 py-1 w-full "
                name="empresa"
                value={form.empresa || ""}
                disabled
              />
            </div>
          </div>
        </form>
      </div>

      {/* Síntomas Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Columna 1: Síntomas */}
          <div className="border rounded p-4 bg-blue-50">
            <div className="text-blue-900 font-semibold text-center mb-3">
              SÍNTOMAS
            </div>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="sintomas"
                  checked={form.sintomas === "SI"}
                  onChange={(e) => handleRadioButton(e, "SI")}
                />
                SI
              </label>
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="sintomas"
                  checked={form.sintomas === "NO"}
                  onChange={(e) => handleRadioButton(e, "NO")}
                />
                NO
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-[11px]">Cuales:</label>
              <input
                className="border rounded px-2 py-1 flex-1 text-[11px]"
                name="cualesSintomas"
                value={form.cualesSintomas}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Columna 2: Uso de Faja Lumbar */}
          <div className="border rounded p-4 bg-blue-50">
            <div className="text-blue-900 font-semibold text-center mb-3">
              USO DE FAJA LUMBAR
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="usoFajaLumbar"
                  checked={form.usoFajaLumbar === "SI"}
                  onChange={(e) => handleRadioButton(e, "SI")}
                />
                SI
              </label>
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="usoFajaLumbar"
                  checked={form.usoFajaLumbar === "NO"}
                  onChange={(e) => handleRadioButton(e, "NO")}
                />
                NO
              </label>
            </div>
          </div>

          {/* Columna 3: Técnica de Levantamiento */}
          <div className="border rounded py-4 px-2 bg-blue-50">
            <div className="text-blue-900 font-semibold text-center mb-3">
              ADECUADA TÉCNICA DE LEVANTAMIENTO DE CARGA
            </div>
            <div className="flex items-center gap-4 px-3">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="tecnicaLevantamiento"
                  checked={form.tecnicaLevantamiento === "SI"}
                  onChange={(e) => handleRadioButton(e, "SI")}
                />
                SI
              </label>
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="tecnicaLevantamiento"
                  checked={form.tecnicaLevantamiento === "NO"}
                  onChange={(e) => handleRadioButton(e, "NO")}
                />
                NO
              </label>
            </div>
          </div>

          {/* Columna 4: Capacitación */}
          <div className="border rounded p-4 bg-blue-50">
            <div className="text-blue-900 font-semibold text-center mb-3">
              CAPACITACIÓN EN LEVANTAMIENTO DE CARGA
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="capacitacionLevantamiento"
                  checked={form.capacitacionLevantamiento === "SI"}
                  onChange={(e) => handleRadioButton(e, "SI")}
                />
                SI
              </label>
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="capacitacionLevantamiento"
                  checked={form.capacitacionLevantamiento === "NO"}
                  onChange={(e) => handleRadioButton(e, "NO")}
                />
                NO
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* TÍTULO: EXAMEN FÍSICO I */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 border-b-2 pb-2">
          PARTE 1: EXAMEN FÍSICO I
        </h2>
        <ExamenFisicoI
          form={form}
          handleRadioButton={handleRadioButton}
          handleChange={handleChange}
        />
      </div>

      {/* TÍTULO: EXAMEN FÍSICO II */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 border-b-2 pb-2">
          PARTE 2: EXAMEN FÍSICO II
        </h2>
        <ExamenFisicoII
          form={form}
          handleRadioButton={handleRadioButton}
          handleChange={handleChange}
        />
      </div>

      {/* TÍTULO: EXAMEN FÍSICO III */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 border-b-2 pb-2">
          PARTE 3: EXAMEN FÍSICO III
        </h2>
        <ExamenFisicoIII
          form={form}
          handleRadioButton={handleRadioButton}
          handleChange={handleChange}
        />
      </div>

      {/* CONCLUSIONES Y COMENTARIOS */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 border-b-2 pb-2">
          CONCLUSIONES Y COMENTARIOS
        </h2>
        <div className="border rounded p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-8 mb-3">
                <span className="font-semibold w-[75px]">Tratamiento:</span>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tratamiento"
                    checked={form.tratamiento === "SI"}
                    onChange={(e) => handleRadioButton(e, "SI")}
                  />
                  SI
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tratamiento"
                    checked={form.tratamiento === "NO"}
                    onChange={(e) => handleRadioButton(e, "NO")}
                  />
                  NO
                </label>
              </div>

              <div className="flex items-center gap-8 mb-3">
                <span className="font-semibold w-[75px]">Conclusión:</span>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="conclusion"
                    checked={form.conclusion === "SI"}
                    onChange={(e) => handleRadioButton(e, "SI")}
                  />
                  SI
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="conclusion"
                    checked={form.conclusion === "NO"}
                    onChange={(e) => handleRadioButton(e, "NO")}
                  />
                  NO
                </label>
              </div>
            </div>

            <div>
              <div className="mb-3">
                <label className="font-semibold block mb-1">
                  Nombre y Apellidos del Médico - N° Colegiatura:
                </label>
                <input
                  className="border rounded px-3 py-1 w-full"
                  name="nombreMedico"
                  value={form.nombreMedico || ""}
                />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="font-semibold block mb-1">Diagnóstico:</label>
            <textarea
              className="border rounded px-3 py-1 w-full resize-none"
              name="diagnostico"
              rows={3}
              value={form.diagnostico}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">
              Recomendaciones y plan de acción:
            </label>
            <textarea
              className="border rounded px-3 py-2 w-full h-24 resize-none"
              name="recomendaciones"
              rows={3}
              value={form.recomendaciones}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Agregar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
            <div className="flex items-center gap-2">
              <input
                name="norden"
                value={form.norden}
                onChange={handleChange}
                className="border rounded px-2 py-1 text-base w-24"
              />
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
