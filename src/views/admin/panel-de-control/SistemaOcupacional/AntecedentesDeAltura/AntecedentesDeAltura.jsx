import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faSave, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerAntecedentesDeAltura";
import { fixEncodingModern } from "../../../../utils/helpers";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "antece_enfermedades_altura";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

export default function AntecedentesDeAltura() {
  const { token, userlogued, selectedSede, datosFooter, userCompleto, userName } =
    useSessionData();
  const initialFormState = {
    norden: "",
    codigoAntecedentesAltura: null,
    nombres: "",
    edad: "",
    fechaNac: "",
    fechaExam: today,
    contrata: "",
    empresa: "",
    dni: "",
    sexo: "",
    cargo: "",
    apto: true,

    // Información del médico
    dniMedico: userCompleto?.datos?.dni_user ?? "",
    nombreMedico: fixEncodingModern(userCompleto?.datos?.nombres_user ?? ""),
    cmp: userCompleto?.datos?.cmp ?? "",
    email: fixEncodingModern(userCompleto?.datos?.email ?? ""),
    direccionMedico: fixEncodingModern(userCompleto?.datos?.direccion ?? ""),

    // Antecedentes patológicos - todos en false por defecto
    accidenteCerebrovascular: false,
    anginaInestable: false,
    antecedenteBypass: false,
    antecedenteEdemaCerebral: false,
    antecedenteEdemaPulmonar: false,
    antecedenteNeumotorax: false,
    arritmiaCardiaca: false,
    cardiomiopatiaHipertrofica: false,
    cirugiaMayor: false,
    insuficienciaValvulaAortica: false,
    diabetesMellitus: false,
    embarazo: false,
    epilepsia: false,
    epoc: false,
    eritrocitosisExcesiva: false,
    hipertensionArterial: false,
    hipertensionPulmonar: false,
    infartoMiocardio: false,
    insuficienciaCardiaca: false,
    patologiaHemorragicaRetina: false,
    patologiaValvularCardiaca: false,
    presenciaMarcapasos: false,
    riesgoCardiovascularAlto: false,
    trastornosCoagulacion: false,
    trombosisVenosaCerebral: false,
    otros: false,
    otrosDescripcion: "",
    comentarios: "",

    usuario: userlogued ?? "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleClear,
    handleChangeSimple,
    handleClearnotO,
    handlePrintDefault,
    handleRadioButton,
    handleRadioButtonBoolean,
  } = useForm(initialFormState, { storageKey: "antecedentes_altura" });

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  return (
    <div className="w-full p-4 text-[11px]">
      <h2 className="text-2xl font-bold text-center mb-10">
        Antecedentes de Enfermedades en Altura
      </h2>

      <div className="w-full">
        {/* PANEL ÚNICO - FORMULARIO DE DATOS */}
        <div className="border rounded-3xl shadow-md p-6 w-[90%] mx-auto">
          {/* SECCIÓN SUPERIOR - FILIACIÓN */}
          <div className="space-y-4 p-4 rounded-[9px] border">
            {/* Fila 1: N° Orden, Fecha, DNI, Aptitud, Actividad a Realizar */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  N° Orden:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="norden"
                  value={form.norden || ""}
                  onKeyUp={handleSearch}
                  onChange={handleChangeNumber}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Fecha:
                </label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  name="fechaExam"
                  value={form.fechaExam || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  DNI:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="dni"
                  value={form.dni || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Aptitud:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="apto"
                      checked={form.apto}
                      onChange={(e) => handleRadioButtonBoolean(e, true)}
                    />
                    <span className="text-[11px]">Apto</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="apto"
                      checked={!form.apto}
                      onChange={(e) => handleRadioButtonBoolean(e, false)}
                    />
                    <span className="text-[11px]">No Apto</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Fila 2: Nombres, Sexo, Fecha Nac, Edad */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-4 col-span-3">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Nombres:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="nombres"
                  value={form.nombres || ""}
                  disabled
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Sexo:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="sexo"
                  value={form.sexo || ""}
                  disabled
                />
              </div>
            </div>

            {/* Fila 3: Empresa, Contrata */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Fecha Nacimiento:
                </label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  name="fechaNac"
                  value={form.fechaNac || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Edad:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="edad"
                  value={form.edad || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-4 col-span-2">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Actividad:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="cargo"
                  value={form.cargo || ""}
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Empresa:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="empresa"
                  value={form.empresa || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Contrata:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="contrata"
                  value={form.contrata || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN MÉDICO */}
          <div className="space-y-3  rounded-[9px] border p-4 mt-3 bg-white">
            <h3 className="font-bold text-lg text-blue-900">Médico</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Nombres:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full capitalize"
                  name="nombreMedico"
                  value={form.nombreMedico || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  CMP:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="cmp"
                  value={form.cmp || ""}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Email:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="email"
                  value={form.email || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold text-[11px] min-w-[65px] max-w-[65px]">
                  Dirección:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="direccionMedico"
                  value={form.direccionMedico || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* ANTECEDENTES PATOLÓGICOS */}
          <div className="space-y-3 rounded-[9px] border p-4 mt-3 bg-white">
            <h3 className="font-bold text-lg text-blue-900 mb-3">
              ANTECEDENTES PATOLÓGICOS
            </h3>

            {/* Dos columnas de antecedentes */}
            <div className="grid grid-cols-2 gap-8">
              {/* Columna 1 */}
              <div className="space-y-3">
                {[
                  {
                    key: "accidenteCerebrovascular",
                    label: "Accidente cerebrovascular",
                  },
                  { key: "anginaInestable", label: "Angina inestable" },
                  {
                    key: "antecedenteBypass",
                    label:
                      "Antecedente de Bypass arterial coronario/Angioplastia/Stent",
                  },
                  {
                    key: "antecedenteEdemaCerebral",
                    label: "Antecedente de edema cerebral de altura",
                  },
                  {
                    key: "antecedenteEdemaPulmonar",
                    label: "Antecendente de edema pulmonar de altura",
                  },
                  {
                    key: "antecedenteNeumotorax",
                    label: "Antecedente de Neumotórax en los ultimos 6 meses",
                  },
                  {
                    key: "arritmiaCardiaca",
                    label: "Arritmia cardiaca no controlada",
                  },
                  {
                    key: "cardiomiopatiaHipertrofica",
                    label: "Cardiomiopatía hipertrófica idiopática",
                  },
                  {
                    key: "cirugiaMayor",
                    label: "Cirugía mayor en los últimos 30 días",
                  },
                  {
                    key: "insuficienciaValvulaAortica",
                    label: "Cualquier insuficiencia en la válvula aórtica",
                  },
                  { key: "diabetesMellitus", label: "Diabetes Mellitus" },
                  { key: "embarazo", label: "Embarazo" },
                  { key: "epilepsia", label: "Epilepsia" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between border-b border-gray-200 pb-2"
                  >
                    <span className="text=[11px] flex-1">{item.label}</span>
                    <div className="flex gap-6 ml-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={form[item.key] === false}
                          onChange={(e) => handleRadioButtonBoolean(e, false)}
                        />
                        <span className="text-[11px]">NO</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={form[item.key] === true}
                          onChange={(e) => handleRadioButtonBoolean(e, true)}
                        />
                        <span className="text-[11px]">SI</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna 2 */}
              <div className="space-y-3">
                {[
                  {
                    key: "epoc",
                    label:
                      "EPOC - Enfermedad pulmonar obstructiva crónica confirmada",
                  },
                  {
                    key: "eritrocitosisExcesiva",
                    label: "Eritrocitosis excesiva (mal de montaña crónico)",
                  },
                  {
                    key: "hipertensionArterial",
                    label: "Hipertensión arterial",
                  },
                  {
                    key: "hipertensionPulmonar",
                    label: "Hipertensión pulmonar",
                  },
                  {
                    key: "infartoMiocardio",
                    label: "Infarto al miocardio en los últimos 6 meses",
                  },
                  {
                    key: "insuficienciaCardiaca",
                    label: "Insuficiencia cardíaca congestiva",
                  },
                  {
                    key: "patologiaHemorragicaRetina",
                    label: "Patología hemorrágica de retina",
                  },
                  {
                    key: "patologiaValvularCardiaca",
                    label: "Patología Valvular Cardíaca en tratamiento (ICC)",
                  },
                  {
                    key: "presenciaMarcapasos",
                    label: "Presencia de marcapasos",
                  },
                  {
                    key: "riesgoCardiovascularAlto",
                    label: "Presencia de riesgo cardiovascular alto",
                  },
                  {
                    key: "trastornosCoagulacion",
                    label: "Trastornos de la coagulación",
                  },
                  {
                    key: "trombosisVenosaCerebral",
                    label: "Trombosis venosa cerebral",
                  },
                  { key: "otros", label: "Otros" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between border-b border-gray-200 pb-2"
                  >
                    <span className="text=[11px]  flex-1">{item.label}</span>
                    <div className="flex gap-6 ml-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={form[item.key] === false}
                          onChange={(e) => {
                            handleRadioButtonBoolean(e, false);
                            if (item.key === "otros") {
                              setForm((prev) => ({
                                ...prev,
                                otrosDescripcion: "",
                              }));
                            }
                          }}
                        />
                        <span className="text-[11px]">NO</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={form[item.key] === true}
                          onChange={(e) => handleRadioButtonBoolean(e, true)}
                        />
                        <span className="text-[11px]">SI</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campo de descripción para "Otros" */}
            {form.otros && (
              <div className="mt-3">
                <label className="font-semibold block mb-2">
                  Especificar otros:
                </label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  name="otrosDescripcion"
                  value={form.otrosDescripcion}
                  onChange={handleChange}
                  placeholder="Describa otros antecedentes..."
                />
              </div>
            )}

            {/* Comentarios del médico */}
            <div className="mt-5">
              <label className="font-semibold block mb-2">
                Comentarios del medico Evaluador/Observaciones:
              </label>
              <textarea
                className="border rounded px-3 py-2 w-full h-24 resize-none"
                name="comentarios"
                value={form.comentarios}
                onChange={handleChange}
                placeholder="Comentarios y observaciones del médico evaluador..."
              />
            </div>
            <EmpleadoComboBox
              value={form.nombre_medico}
              form={form}
              onChange={handleChangeSimple}
            />
          </div>


          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-4">
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
    </div>
  );
}
