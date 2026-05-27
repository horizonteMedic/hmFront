import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import useRealTime from "../../../../hooks/useRealTime";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./ControllerCertificadoExposicionAlCalor";

export default function CertificadoExposicionAlCalor() {
  const tabla = "certificado_exposicion_al_calor";

  const today = getToday();
  const {
    token,
    userlogued,
    selectedSede,
    datosFooter,
    userName,
    userCMP,
  } = useSessionData();

  const initialFormState = {
    norden: "",
    id: null,
    fecha: today,
    nombreExamen: "",

    nombres: "",
    edad: "",
    sexo: "",
    dni: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    signosVitalesResultados: "",
    signosVitalesObservaciones: "",
    sistemaCardiovascularResultados:
      "NO INGURGITACION YUGULAR, CAROTIDEO, RADIAL, FEMORAL, PEDIO CONSERVADOS.RCRR, NO SOPLOS, NO FROTES.",
    sistemaCardiovascularObservaciones: "NINGUNA",
    sistemaRespiratorioResultados:
      "RESPIRACIÓN NORMAL, EXPANSIÓN TORACICA SIMÉTRICA, BPMV EN ACP, NO RALES.",
    sistemaRespiratorioObservaciones: "NINGUNA",
    estadoNeurologicoResultados:
      "DESPIERTO, OTEP, SENSIBILIDAD Y MOTRICIDAD CONSERVADA, ROTS CONSERVADOS. PARES CRANEALES CONSERVADOS. NO SIGNOS MENINGEOS.",
    estadoNeurologicoObservaciones: "NINGUNA",
    estadoHidratacionResultados:
      "MUCOSAS ORALES HIDRATADAS, PIEL TURGENTE, LLENADO CAPILAR < 2 SEG.",
    estadoHidratacionObservaciones: "NINGUNA",
    toleranciaCalorResultados: "SI",
    toleranciaCalorObservaciones: "N/A",
    sudoracionResultados: "SI",
    sudoracionObservaciones: "N/A",

    aptitud: "",

    observaciones: "",
    restricciones: "",

    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handleRadioButton,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, {
    storageKey: "certificado_exposicion_al_calor",
  });

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
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <SectionFieldset
        legend="Información del Examen"
        className="grid grid-cols-1 lg:grid-cols-4 gap-3"
      >
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
          name="fecha"
          type="date"
          value={form.fecha}
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

        <InputTextOneLine
          label="Hora"
          name="hora"
          value={form.hora}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset
        legend="Datos del especialista"
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
      >
        <InputTextOneLine
          label="Médico evaluador"
          name="nombre_medico"
          value={form.nombre_medico}
          onChange={handleChangeSimple}
          disabled
          labelWidth="120px"
        />

        <InputTextOneLine
          label="CMP"
          name="userCMP"
          onChange={handleChangeSimple}
          value={userCMP}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <SectionFieldset
        legend="Evaluación Clínica y Ocupacional"
        className="grid md:grid-cols-2 gap-x-4 gap-y-3"
      >
        <div>
          <div className="font-semibold mb-2 text-center ml-[80px]">
            Resultado
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              <label className="col-span-1">Signos vitales</label>
              <InputTextArea
                className="col-span-4"
                rows={6}
                name="signosVitalesResultados"
                value={form?.signosVitalesResultados}
                onChange={handleChangeSimple}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <label className="col-span-1">Sistema Cardiovascular</label>
              <InputTextArea
                className="col-span-4"
                rows={6}
                name="sistemaCardiovascularResultados"
                value={form?.sistemaCardiovascularResultados}
                onChange={handleChangeSimple}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <label className="col-span-1">Sistema Respiratorio</label>
              <InputTextArea
                className="col-span-4"
                rows={6}
                name="sistemaRespiratorioResultados"
                value={form?.sistemaRespiratorioResultados}
                onChange={handleChangeSimple}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <label className="col-span-1">Estado Neurológico</label>
              <InputTextArea
                className="col-span-4"
                rows={6}
                name="estadoNeurologicoResultados"
                value={form?.estadoNeurologicoResultados}
                onChange={handleChangeSimple}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <label className="col-span-1">Estado de Hidratación</label>
              <InputTextArea
                className="col-span-4"
                rows={6}
                name="estadoHidratacionResultados"
                value={form?.estadoHidratacionResultados}
                onChange={handleChangeSimple}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <label className="col-span-1">Tolerancia al Calor</label>
              <InputTextArea
                className="col-span-4"
                rows={6}
                name="toleranciaCalorResultados"
                value={form?.toleranciaCalorResultados}
                onChange={handleChangeSimple}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <label className="col-span-1">
                Sudoración / Termorregulación
              </label>
              <InputTextArea
                className="col-span-4"
                rows={6}
                name="sudoracionResultados"
                value={form?.sudoracionResultados}
                onChange={handleChangeSimple}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2 text-center ml-[80px]">
            Observaciones
          </div>
          <div className="space-y-3">
            <InputTextArea
              className="col-span-4"
              rows={6}
              name="signosVitalesObservaciones"
              value={form?.signosVitalesObservaciones}
              onChange={handleChangeSimple}
            />
            <InputTextArea
              className="col-span-4"
              rows={6}
              name="sistemaCardiovascularObservaciones"
              value={form?.sistemaCardiovascularObservaciones}
              onChange={handleChangeSimple}
            />
            <InputTextArea
              className="col-span-4"
              rows={6}
              name="sistemaRespiratorioObservaciones"
              value={form?.sistemaRespiratorioObservaciones}
              onChange={handleChangeSimple}
            />
            <InputTextArea
              className="col-span-4"
              rows={6}
              name="estadoNeurologicoObservaciones"
              value={form?.estadoNeurologicoObservaciones}
              onChange={handleChangeSimple}
            />
            <InputTextArea
              className="col-span-4"
              rows={6}
              name="estadoHidratacionObservaciones"
              value={form?.estadoHidratacionObservaciones}
              onChange={handleChangeSimple}
            />
            <InputTextArea
              className="col-span-4"
              rows={6}
              name="toleranciaCalorObservaciones"
              value={form?.toleranciaCalorObservaciones}
              onChange={handleChangeSimple}
            />
            <InputTextArea
              className="col-span-4"
              rows={6}
              name="sudoracionObservaciones"
              value={form?.sudoracionObservaciones}
              onChange={handleChangeSimple}
            />
          </div>
        </div>
      </SectionFieldset>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SectionFieldset
          legend="Conclusión de Aptitud"
          className="grid grid-cols-1  gap-3"
        >
          <InputsRadioGroup
            name="aptitud"
            value={form?.aptitud}
            onChange={handleRadioButton}
            vertical
            options={[
              {
                label: "APTO (Puede realizar trabajos con exposición al calor.)",
                value: "APTO",
              },
              {
                label:
                  "APTO CON RESTRICCION (Debe cumplir medidas preventivas específicas.)",
                value: "RESTRICCION",
              },
              {
                label:
                  "NO APTO (No apto para trabajos con exposición al calor y vapor)",
                value: "NO APTO",
              },
            ]}
          />

          <InputTextArea
            label="Observaciones"
            name="observaciones"
            value={form?.observaciones}
            onChange={handleChangeSimple}
            rows={5}
          ></InputTextArea>
        </SectionFieldset>

        <SectionFieldset legend="Restricciones">
          <InputTextArea
            name="restricciones"
            value={form?.restricciones}
            onChange={handleChangeSimple}
            rows={10}
          ></InputTextArea>
        </SectionFieldset>
      </div>

      <SectionFieldset legend="Asignación de Médico" className="w-full">
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
    </div>
  );
}
