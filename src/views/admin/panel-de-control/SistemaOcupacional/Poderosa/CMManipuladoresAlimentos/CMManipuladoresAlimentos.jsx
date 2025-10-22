import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faPrint,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  InputTextOneLine,
  InputTextArea,
  InputsBooleanRadioGroup,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";
import { getToday } from "../../../../../utils/helpers";
import { useSessionData } from "../../../../../hooks/useSessionData";
import Swal from "sweetalert2";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerCMManipuladoresAlimentos";

const tabla = "";
const today = getToday();

export default function CMManipuladoresAlimentos() {

  const { token, userlogued, selectedSede, datosFooter, userName } =
    useSessionData();

  const initialFormState = {
    // Header - Campos principales
    norden: "",
    codigoCertificado: null,
    fechaExam: today,
    nombreExamen: "",
    esApto: undefined,

    // Datos personales
    nombres: "",
    dni: "",
    edad: "",
    sexo: "",
    empresa: "",
    contrata: "",
    cargo: "",
    areaTrabajo: "",

    // Médico
    nombre_medico: userName,

    // Recomendaciones
    recomendaciones: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeSimple,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "CMManipuladoresAlimentos" });
  
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
            label="Fecha Examen "
            name="fechaExam"
            type="date"
            value={form?.fechaExam}
            onChange={handleChangeSimple}
          />
          <InputsBooleanRadioGroup
            label="Aptitud"
            name="esApto"
            value={form.esApto}
            trueLabel="APTO"
            falseLabel="NO APTO"
            onChange={handleRadioButtonBoolean}
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
              labelWidth="60px"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
              <InputTextOneLine
                label="DNI"
                name="dni"
                value={form?.dni}
                disabled
                labelWidth="60px"
              />
              <InputTextOneLine
                label="Sexo"
                name="sexo"
                value={form?.sexo}
                disabled
                labelWidth="60px"
              />
              <InputTextOneLine
                label="Edad"
                name="edad"
                value={form?.edad}
                disabled
                labelWidth="60px"
              />
            </div>
            <InputTextOneLine
              label="Área Trabajo"
              name="areaTrabajo"
              value={form?.areaTrabajo}
              disabled
              labelWidth="60px"
            />
            <InputTextOneLine
              label="Cargo"
              name="cargo"
              value={form?.cargo}
              disabled
              labelWidth="60px"
            />
            <InputTextOneLine
              label="Empresa"
              name="empresa"
              value={form?.empresa}
              disabled
              labelWidth="60px"
            />
            <InputTextOneLine
              label="Contrata"
              name="contrata"
              value={form?.contrata}
              disabled
              labelWidth="60px"
            />
          </div>
        </section>

        {/* Conclusiones Finales */}
        <fieldset className="bg-white border border-gray-200 rounded-lg p-4 mx-4 mt-4">
          <legend className="font-bold mb-2 text-gray-800 text-[10px]">
            Conclusiones Finales
          </legend>
          <InputTextArea
            label="Recomendaciones"
            name="recomendaciones"
            value={form?.recomendaciones}
            onChange={handleChange}
            rows={4}
          />
          {/* Médico */}
          <InputTextOneLine
            label="Médico que Certifica"
            name="nombre_medico"
            value={form?.nombre_medico}
            labelOnTop
            disabled
          />
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
        </section>
      </div>
    </div>
  );
}