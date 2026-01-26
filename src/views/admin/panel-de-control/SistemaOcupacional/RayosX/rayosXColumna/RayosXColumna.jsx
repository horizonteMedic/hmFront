import {
  handleSubirArchivo,
  handleSubirArchivo2,
  PrintHojaR,
  ReadArchivosForm,
  SubmitDataService,
  VerifyTR,
} from "./controllerRayosXColumna";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { getToday } from "../../../../../utils/helpers";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../../components/reusableComponents/ButtonsPDF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const tabla = "radiografia";

export default function RayosXColumna() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const initialFormState = {
    norden: "",
    fechaExam: today,

    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    tipoRadiografia: "DORSOLUMBAR",
    informe:
      "CUERPOS VERTEBRALES MUESTRAN MORFOLOGÍA NORMAL.\n" +
      "SACRO NO MUESTRA LESIONES EVIDENTES.\n" +
      "ESPACIOS INTERVERTEBRALES CONSERVADOS.\n" +
      "DENSIDAD ÓSEA ADECUADA.\n" +
      "LORDOSIS LUMBAR NORMAL.\n" +
      "CANAL RAQUÍDEO CON AMPLITUD NORMAL.",
    conclusion:
      "CUERPOS VERTEBRALES DORSOLUMBARES EVALUADOS SIN ALTERACIONES SIGNIFICATIVAS.",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    SubirDoc: false,
    nomenclatura: "INFORME RADIOGRAFICO",
    nomenclatura2: "INFORME RADIOGRAFICO 2",
  };

  const {
    form,
    setForm,
    handleChange,
    handleRadioButton,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
    handlePrintDefault
  } = useForm(initialFormState, { storageKey: "rayosXColumna" });

  const [visualerOpen, setVisualerOpen] = useState(null)

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      {/* Sección Aptitud */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-3">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onChange={handleChangeNumberDecimals}
          onKeyUp={handleSearch}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Fecha"
          name="fechaExam"
          type="date"
          value={form.fechaExam}
          onChange={handleChangeSimple}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Nombre del Examen"
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />

      </SectionFieldset>
      {form.SubirDoc &&
        <div className="flex gap-2 w-full flex-col justify-center">
          <ButtonsPDF
            handleSave={() => { handleSubirArchivo2(form, selectedSede, userlogued, token, form.nomenclatura) }}
            handleRead={() => { ReadArchivosForm(form, setVisualerOpen, token) }}
          />
          <ButtonsPDF
            handleSave={() => { handleSubirArchivo2(form, selectedSede, userlogued, token, form.nomenclatura2) }}
            handleRead={() => { ReadArchivosForm(form, setVisualerOpen, token, form.nomenclatura2) }}
            Nombre_1="Subir Archivo 2"
            Nombre_2="Ver Archivo 2"
          />
        </div>
      }
      <DatosPersonalesLaborales form={form} />
      {/* Sección Radiografía de Columna */}
      <SectionFieldset legend="Radiografía de Columna" className="space-y-3">
        <InputsRadioGroup
          name="tipoRadiografia"
          value={form.tipoRadiografia}
          options={[
            { label: "Lumbar", value: "LUMBAR" },
            { label: "Lumbosacro", value: "LUMBOSACRA AP-L" },
            { label: "Dorsolumbar", value: "DORSOLUMBAR" },
          ]}
          onChange={(e, value) => {
            handleRadioButton(e, value);
            const conclusiones = {
              LUMBAR:
                "RADIOGRAFÍA DE COLUMNA LUMBAR AP-L SIN ALTERACIONES SIGNIFICATIVAS.",
              "LUMBOSACRA AP-L":
                "RADIOGRAFÍA DE COLUMNA LUMBOSACRA AP-L SIN ALTERACIONES SIGNIFICATIVAS.",
              DORSOLUMBAR:
                "CUERPOS VERTEBRALES DORSOLUMBARES EVALUADOS SIN ALTERACIONES SIGNIFICATIVAS.",
            };
            setForm((prev) => ({
              ...prev,
              conclusion: conclusiones[value] ?? prev.conclusion,
            }));
          }}
        />
        <InputTextArea
          label="Informe (El estudio radiográfico representado en incidencia frontal y lateral muestra) "
          name="informe"
          value={form.informe ?? ""}
          rows={6}
          onChange={handleChange}
        />
        <InputTextArea
          label="Conclusión"
          name="conclusion"
          value={form.conclusion ?? ""}
          rows={4}
          onChange={handleChange}
        />
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
      </SectionFieldset>

      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
      {visualerOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
            <div className="px-4 py-2 naranjabackgroud flex justify-between">
              <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
              <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
            </div>
            <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
              <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
            </div>
            <div className="flex justify-center">
              <a href={visualerOpen.mensaje} download={visualerOpen.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
