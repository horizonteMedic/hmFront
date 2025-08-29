
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faSave, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerAntecedentesDeAltura";

const tabla = "antecedentes_enfermedades_altura";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

export default function AntecedentesDeAltura() {
  const { token, userlogued, selectedSede, datosFooter } =
    useSessionData();
  
  const initialFormState = {
    norden: "",
    codigoAntecedentesAltura: null,
    nombre: "",
    edad: "",
    fechaNac: "",
    fechaExam: today,
    contrata: "",
    empresa: "",
    dni: "",
    sexo: "",
    actividadRealizar: "",
    apto: "APTO",
    
    // Información del médico
    nombreMedico: "",
    cmp: "",
    emailMedico: "",
    direccionMedico: "",
    
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
    nombres_search: "",
    codigo_search: "",
    usuario: userlogued ?? "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);



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

  const handleAptoChange = (value) => {
    setForm((prev) => ({ ...prev, apto: value }));
  };

  const handleAntecedenteChange = (antecedente, value) => {
    setForm((prev) => ({ ...prev, [antecedente]: value }));
  };



  return (
    <div className="w-full p-4 text-[11px]">
      <h2 className="text-2xl font-bold text-center mb-10">
        Antecedentes de Enfermedades en Altura
      </h2>
      
      <div className="w-full">
        {/* PANEL ÚNICO - FORMULARIO DE DATOS */}
        <div className="border rounded shadow-md p-6 w-[90%] mx-auto">
          {/* SECCIÓN SUPERIOR - FILIACIÓN */}
          <div className="space-y-4 p-4 rounded border">
            {/* Fila 1: N° Orden, Fecha, DNI, Aptitud, Actividad a Realizar */}
            <div className="grid grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
                  N° Orden:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="norden"
                  value={form.norden || ""}
                  onKeyUp={handleSearch}
                  onChange={handleChangeNumber}
                  placeholder="0909090"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
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
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
                  DNI:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="dni"
                  value={form.dni || ""}
                  disabled
                  placeholder="21139408"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
                  Aptitud:
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="apto"
                      checked={form.apto === "APTO"}
                      onChange={() => handleAptoChange("APTO")}
                    />
                    <span className="text-[11px]">Apto</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="apto"
                      checked={form.apto === "NO APTO"}
                      onChange={() => handleAptoChange("NO APTO")}
                    />
                    <span className="text-[11px]">No Apto</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
                  Actividad:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="actividadRealizar"
                  value={form.actividadRealizar || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Fila 2: Nombres, Sexo, Fecha Nac, Edad */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
                  Nombres:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="nombres"
                  value={form.nombre || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
                  Sexo:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="sexo"
                  value={form.sexo || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
                  Fecha Nac:
                </label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  name="fechaNac"
                  value={form.fechaNac || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[11px] whitespace-nowrap">
                  Edad:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="edad"
                  value={form.edad || ""}
                  disabled
                />
              </div>
            </div>

            {/* Fila 3: Empresa, Contrata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold text=[11px]  whitespace-nowrap">
                  Empresa:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="empresa"
                  value={form.empresa || ""}
                  disabled
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text=[11px]  whitespace-nowrap">
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
          <div className="space-y-3 rounded border p-4 mt-3 bg-white">
            <h3 className="font-bold text-lg text-blue-900">Médico</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Nombre:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="nombreMedico"
                  value={form.nombreMedico || ""}
                  onChange={handleChange}
                  placeholder="."
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  CMP:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="cmp"
                  value={form.cmp || ""}
                  onChange={handleChange}
                  placeholder="."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Email:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="emailMedico"
                  value={form.emailMedico || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Dirección:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="direccionMedico"
                  value={form.direccionMedico || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ANTECEDENTES PATOLÓGICOS */}
          <div className="space-y-3 rounded border p-4 mt-3 bg-white">
            <h3 className="font-bold text-lg text-blue-900 mb-3">
              ANTECEDENTES PATOLÓGICOS
            </h3>
            
            {/* Dos columnas de antecedentes */}
            <div className="grid grid-cols-2 gap-8">
              {/* Columna 1 */}
              <div className="space-y-3">
                {[
                  { key: "accidenteCerebrovascular", label: "Accidente cerebrovascular" },
                  { key: "anginaInestable", label: "Angina inestable" },
                  { key: "antecedenteBypass", label: "Antecedente de Bypass arterial coronario/Angioplastia/Stent" },
                  { key: "antecedenteEdemaCerebral", label: "Antecedente de edema cerebral de altura" },
                  { key: "antecedenteEdemaPulmonar", label: "Antecendente de edema pulmonar de altura" },
                  { key: "antecedenteNeumotorax", label: "Antecedente de Neumotórax en los ultimos 6 meses" },
                  { key: "arritmiaCardiaca", label: "Arritmia cardiaca no controlada" },
                  { key: "cardiomiopatiaHipertrofica", label: "Cardiomiopatía hipertrófica idiopática" },
                  { key: "cirugiaMayor", label: "Cirugía mayor en los últimos 30 días" },
                  { key: "insuficienciaValvulaAortica", label: "Cualquier insuficiencia en la válvula aórtica" },
                  { key: "diabetesMellitus", label: "Diabetes Mellitus" },
                  { key: "embarazo", label: "Embarazo" },
                  { key: "epilepsia", label: "Epilepsia" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text=[11px] flex-1">{item.label}</span>
                    <div className="flex gap-6 ml-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={form[item.key] === false}
                          onChange={() => handleAntecedenteChange(item.key, false)}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px]  font-medium">NO</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={form[item.key] === true}
                          onChange={() => handleAntecedenteChange(item.key, true)}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px]  font-medium">SI</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna 2 */}
              <div className="space-y-3">
                {[
                  { key: "epoc", label: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada" },
                  { key: "eritrocitosisExcesiva", label: "Eritrocitosis excesiva (mal de montaña crónico)" },
                  { key: "hipertensionArterial", label: "Hipertensión arterial" },
                  { key: "hipertensionPulmonar", label: "Hipertensión pulmonar" },
                  { key: "infartoMiocardio", label: "Infarto al miocardio en los últimos 6 meses" },
                  { key: "insuficienciaCardiaca", label: "Insuficiencia cardíaca congestiva" },
                  { key: "patologiaHemorragicaRetina", label: "Patología hemorrágica de retina" },
                  { key: "patologiaValvularCardiaca", label: "Patología Valvular Cardíaca en tratamiento (ICC)" },
                  { key: "presenciaMarcapasos", label: "Presencia de marcapasos" },
                  { key: "riesgoCardiovascularAlto", label: "Presencia de riesgo cardiovascular alto" },
                  { key: "trastornosCoagulacion", label: "Trastornos de la coagulación" },
                  { key: "trombosisVenosaCerebral", label: "Trombosis venosa cerebral" },
                  { key: "otros", label: "Otros" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text=[11px]  flex-1">{item.label}</span>
                    <div className="flex gap-6 ml-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={form[item.key] === false}
                          onChange={() => handleAntecedenteChange(item.key, false)}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px]  font-medium">NO</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={form[item.key] === true}
                          onChange={() => handleAntecedenteChange(item.key, true)}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px]  font-medium">SI</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campo de descripción para "Otros" */}
            {form.otros && (
              <div className="mt-3">
                <label className="font-semibold block mb-2">Especificar otros:</label>
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
                  className="bg-blue-600 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPrint} /> Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


