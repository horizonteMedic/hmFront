import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faPrint,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  InputTextOneLine,
  InputTextArea,
  InputsRadioGroup,
  SectionFieldset,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";
import { getToday, getTodayPlusOneYear } from "../../../../../utils/helpers";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerCAHerramientasManuales";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "certificado_aptitud_herramientas_manuales";
const today = getToday();

export default function CAHerramientasManuales() {

  const { token, userlogued, selectedSede, datosFooter, userName } =
    useSessionData();

  const initialFormState = {
    // Header - Campos principales
    norden: "",
    idCertificado: null,
    fechaExam: today,
    fechahasta: getTodayPlusOneYear(),
    nombreExamen: "",
    aptitud: "",

    // Datos personales
    nombres: "",
    dni: "",
    edad: "",
    sexo: "",
    empresa: "",
    contrata: "",
    explotacion: "",
    cargo: "",
    areaTrabajo: "",


    // observacion
    observacion: "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeSimple,
    handleRadioButton,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "CAHerramientasManuales" });

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
    <div className="mx-auto bg-white">
      <div className="w-full ">
        {/* Datos del trabajador */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form?.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
          />
          <InputTextOneLine
            label="Nombre Examen"
            name="nombreExamen"
            value={form?.nombreExamen}
            disabled
          />
          <InputTextOneLine
            label="Fecha Examen"
            name="fechaExam"
            type="date"
            value={form?.fechaExam}
            onChange={handleChangeSimple}
          />
          <InputTextOneLine
            label="Fecha Hasta"
            name="fechahasta"
            type="date"
            value={form?.fechahasta}
            onChange={handleChangeSimple}
          />

        </section>

        {/* Información del trabajador */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 gap-4">
          <h3 className="font-bold mb-3">Datos del Paciente</h3>
          {/* Fila 1: Nombres, DNI, Edad, Género */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InputTextOneLine
              label="Nombres y Apellidos"
              name="nombres"
              value={form?.nombres}
              disabled
              labelWidth="65px"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
              <InputTextOneLine
                label="DNI"
                name="dni"
                value={form?.dni}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Sexo"
                name="sexo"
                value={form?.sexo}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Edad"
                name="edad"
                value={form?.edad}
                disabled
                labelWidth="65px"
              />
            </div>
            <InputTextOneLine
              label="Área Trabajo"
              name="areaTrabajo"
              value={form?.areaTrabajo}
              disabled
              labelWidth="65px"
            />
            <InputTextOneLine
              label="Cargo"
              name="cargo"
              value={form?.cargo}
              disabled
              labelWidth="65px"
            />
            <InputTextOneLine
              label="Empresa"
              name="empresa"
              value={form?.empresa}
              disabled
              className="col-span-2"
              labelWidth="65px"
            />
            <InputTextOneLine
              label="Contrata"
              name="contrata"
              value={form?.contrata}
              disabled
              labelWidth="65px"
            />
            <InputTextOneLine
              label="Explotación"
              name="explotacion"
              value={form?.explotacion}
              disabled
              labelWidth="65px"
            />
          </div>
        </section>

        {/* Conclusiones Finales */}
        <fieldset className="bg-white border border-gray-200 rounded-lg p-4 mx-4 mt-4 space-y-3">
          <legend className="font-bold mb-2 text-gray-800 text-[10px]">
            Conclusiones Finales
          </legend>
          <div className="grid grid-cols-7">
            <InputsRadioGroup
              label="Aptitud"
              labelOnTop
              vertical
              name="aptitud"
              value={form.aptitud}
              options={[
                { label: "APTO", value: "APTO" },
                { label: "APTO CON RESTRICCION", value: "APTO CON RESTRICCION" },
                { label: "APTO TEMPORAL", value: "APTO TEMPORAL" },
                { label: "NO APTO", value: "NO APTO" }
              ]}
              onChange={handleRadioButton}
            />
            <InputTextArea
              label="Observacion"
              name="observacion"
              className="col-span-6"
              value={form?.observacion}
              onChange={handleChange}
              rows={6}
            />
          </div>
          {/* Médico */}
          <SectionFieldset legend="Asignación de Médico">
            <EmpleadoComboBox
              value={form.nombre_medico}
              label="Especialista"
              form={form}
              onChange={handleChangeSimple}
            />
          </SectionFieldset>
        </fieldset>

        <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
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
            <span className="font-bold italic text-base mb-1">Imprimir</span>
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
        </section>
      </div>
    </div>
  );
}
