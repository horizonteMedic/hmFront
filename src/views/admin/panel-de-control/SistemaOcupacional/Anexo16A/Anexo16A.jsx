import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faPrint,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  InputCheckbox,
  InputsBooleanRadioGroup,
  InputTextOneLine,
  InputTextArea,
} from "../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./Anexo16AController";

const tabla = "anexo16a";
const today = getToday();

export default function Anexo16A() {
  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const initialFormState = {
    norden: "",
    fechaExam: today,
    codigoAnexo: null,
    apto: false,
    actividadRealizar: "",
    dni: "",
    nombres: "",
    sexo: "",
    fechaNac: "",
    edad: "",
    fc: "",
    pa: "",
    fr: "",
    imc: "",
    satO2: "",
    temperatura: "",
    peso: "",
    talla: "",
    medicoNombre: userCompleto?.datos?.nombres_user?.toUpperCase() ?? "",
    medicoCmp: userCompleto?.datos?.cmp?.toUpperCase() ?? "",
    medicoDireccion: userCompleto?.datos?.direccion?.toUpperCase() ?? "",
    cirugiaMayor: false,
    desordenesCoagulacion: false,
    diabetes: false,
    hipertension: false,
    embarazo: false,
    furDescripcion: "",
    problemasNeurologicos: false,
    infeccionesRecientes: false,
    medicacionActual: "",
    obesidadMorbida: false,
    problemasCardiacos: false,
    problemasRespiratorios: false,
    problemasOftalmologicos: false,
    problemasDigestivos: false,
    apneaSueño: false,
    otraCondicion: false,
    alergias: false,
    usoMedicacion: false,
    corregirAgudeza: false,
    obesidadDieta: false,
    diabetesControlado: false,
    sobrepeso: false,
    htaControlada: false,
    lentesCorrectivos: false,
    contrata: "",
    empresa: "",
    observaciones: "",
    //Agudeza Visual
    vcOD: "",
    vlOD: "",
    vcOI: "",
    vlOI: "",
    vcCorregidaOD: "",
    vlCorregidaOD: "",
    vclrs: "",
    vb: "",
    rp: "",
    vcCorregidaOI: "",
    vlCorregidaOI: "",
    enfermedadesOculares: "",

    imcRed: false,
    obesidadMorbidaRed: false,
    hipertensionRed: false,
    problemasOftalmologicosRed: false,
  }
  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButtonBoolean,
    handleChangeSimple,
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

  // Textos específicos para cada checkbox
  const checkboxTexts = {
    corregirAgudeza: "Corregir Agudeza Visual",
    obesidadDieta: "Obesidad I. Dieta Hipocalórica y Ejercicios",
    diabetesControlado: "D m II controlado, tto con:.....",
    sobrepeso: "Sobrepeso. Dieta Hipocalórica y Ejercicios",
    htaControlada: "HTA Controlada, en tto con:...",
    lentesCorrectivos: "Uso de Lentes Correct. Lectura de Cerca"
  };

  // Handler personalizado para checkboxes que actualiza observaciones
  const handleCheckBoxChangeWithObservations = (e) => {
    const { name, checked } = e.target;
    const textoAsociado = checkboxTexts[name];

    setForm((prevForm) => {
      // Actualizar el estado del checkbox
      const newForm = { ...prevForm, [name]: checked };

      // Obtener observaciones actuales y convertir a array de líneas
      const observacionesActuales = (prevForm.observaciones || "").split("\n").filter(line => line.trim() !== "");

      if (checked) {
        // Si se marca el checkbox, agregar el texto si no existe
        if (textoAsociado && !observacionesActuales.includes(textoAsociado)) {
          observacionesActuales.push(textoAsociado);
        }
      } else {
        // Si se desmarca el checkbox, eliminar el texto asociado
        const index = observacionesActuales.indexOf(textoAsociado);
        if (index > -1) {
          observacionesActuales.splice(index, 1);
        }
      }

      // Actualizar las observaciones
      newForm.observaciones = observacionesActuales.join("\n");

      return newForm;
    });
  };
  return (
    <div className="p-4" style={{ fontSize: "10px" }}>
      {/* Layout principal con grid de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* Columna principal (izquierda) - 3/4 del ancho */}
        <div className="lg:col-span-3 space-y-4">
          {/* Encabezado */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              <InputTextOneLine
                label="N° Orden"
                name="norden"
                value={form?.norden}
                onKeyUp={handleSearch}
                onChange={handleChangeNumber}
                labelWidth="80px"
              />
              <InputTextOneLine
                label="Fecha"
                name="fechaExam"
                type="date"
                value={form?.fechaExam}
                onChange={handleChangeSimple}
                labelWidth="60px"
              />
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700">Apto/Inapto:</span>
                <InputsBooleanRadioGroup
                  name="apto"
                  value={form?.apto}
                  onChange={handleRadioButtonBoolean}
                  trueLabel="Apto"
                  falseLabel="Inapto"
                />
              </div>
              <InputTextOneLine
                label="Actividad a Realizar"
                name="actividadRealizar"
                value={form?.actividadRealizar}
                disabled
                labelWidth="120px"
              />
            </div>
          </div>

          {/* Información del Paciente */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">Información del Paciente</h4>
            <div className="space-y-3">
              {/* Fila 1: Nombres y Fecha de Nacimiento */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputTextOneLine label="Nombres y Apellidos" name="nombres" value={form?.nombres} disabled labelWidth="140px" />
                <InputTextOneLine label="Fecha de Nacimiento" name="fechaNac" value={form?.fechaNac} disabled labelWidth="140px" />
              </div>
              {/* Fila 2: DNI, Sexo y Edad */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <InputTextOneLine label="DNI" name="dni" value={form?.dni} disabled labelWidth="60px" />
                <InputTextOneLine label="Sexo" name="sexo" value={form?.sexo} disabled labelWidth="50px" />
                <InputTextOneLine label="Edad" name="edad" value={form?.edad} disabled labelWidth="50px" />
              </div>
            </div>
          </div>
          {/* Empresa Contratista */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <InputTextOneLine label="Emp. Contratista" name="contrata" value={form?.contrata} disabled />
              <InputTextOneLine label="Empresa" name="empresa" value={form?.empresa} disabled />
            </div>
          </div>
          {/* Funciones Vitales */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">F.C:</label>
                <InputTextOneLine name="fc" value={form?.fc} disabled />
                <span className="text-gray-500">x min.</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">P.A:</label>
                <InputTextOneLine name="pa" value={form?.pa} disabled />
                <span className="text-gray-500">mmHg.</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">F.R:</label>
                <InputTextOneLine name="fr" value={form?.fr} disabled />
                <span className="text-gray-500">x min.</span>
              </div>
              <div className="flex items-center gap-2">
                <label className={`font-semibold text-gray-700 min-w-[30px] ${form?.imcRed ? 'text-red-500' : ''}`}>IMC:</label>
                <InputTextOneLine name="imc" value={form?.imc} disabled />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">Sat. O2:</label>
                <InputTextOneLine name="satO2" value={form?.satO2} disabled />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">T°:</label>
                <InputTextOneLine name="temperatura" value={form?.temperatura} disabled />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">Peso:</label>
                <InputTextOneLine name="peso" value={form?.peso} disabled />
                <span className="text-gray-500">kg.</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">Talla:</label>
                <InputTextOneLine name="talla" value={form?.talla} disabled />
                <span className="text-gray-500">m.</span>
              </div>
            </div>
          </div>

          {/* Médico */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">Médico</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <InputTextOneLine label="Nombre completo" name="medicoNombre" value={form?.medicoNombre} disabled className="uppercase" />
              <InputTextOneLine label="CMP" name="medicoCmp" value={form?.medicoCmp} disabled className="uppercase" />
              <InputTextOneLine label="Dirección" name="medicoDireccion" value={form?.medicoDireccion} disabled className="uppercase" />
            </div>
          </div>

          {/* Antecedentes Médicos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">El/la presenta o ha presentado en los 6 últimos meses</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Columna Izquierda */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span >Cirugía Mayor Reciente</span>
                  <InputsBooleanRadioGroup
                    name="cirugiaMayor"
                    value={form?.cirugiaMayor}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span  >Desórdenes de la coagulación, trombosis, etc</span>
                  <InputsBooleanRadioGroup
                    name="desordenesCoagulacion"
                    value={form?.desordenesCoagulacion}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span >Diabetes Mellitus</span>
                  <InputsBooleanRadioGroup
                    name="diabetes"
                    value={form?.diabetes}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${form?.hipertensionRed ? 'text-red-500' : ''}`}>Hipertensión Arterial</span>
                  <InputsBooleanRadioGroup
                    name="hipertension"
                    value={form?.hipertension}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span  >Embarazo</span>
                  <InputsBooleanRadioGroup
                    name="embarazo"
                    value={form?.embarazo}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <InputTextOneLine label="FUR" name="furDescripcion" value={form?.furDescripcion} onChange={handleChange} disabled={!form.embarazo} />
                <div className="flex items-center justify-between">
                  <span>Problemas Neurológicos: Epilepsia, vértigo, etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasNeurologicos"
                    value={form?.problemasNeurologicos}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span  >Infecciones recientes (especialmente oídos, nariz, garganta)</span>
                  <InputsBooleanRadioGroup
                    name="infeccionesRecientes"
                    value={form?.infeccionesRecientes}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`${form?.obesidadMorbidaRed ? 'text-red-500' : ''}`}>Obesidad Mórbida (IMC mayor a 35 m/Kg 2)</span>
                  <InputsBooleanRadioGroup
                    name="obesidadMorbida"
                    value={form?.obesidadMorbida}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span >Problemas Cardiacos: marca pasos, coronariopatías, etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasCardiacos"
                    value={form?.problemasCardiacos}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span  >Problemas respiratorios: Asma, EPOC etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasRespiratorios"
                    value={form?.problemasRespiratorios}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${form?.problemasOftalmologicosRed ? 'text-red-500' : ''}`}>Problemas Oftalmológicos: Retinopatía, glaucoma, etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasOftalmologicos"
                    value={form?.problemasOftalmologicos}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span >Problemas Digestivos: Úlcera péptica, hepatitis, etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasDigestivos"
                    value={form?.problemasDigestivos}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Apnea del Sueño</span>
                  <InputsBooleanRadioGroup
                    name="apneaSueño"
                    value={form?.apneaSueño}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span >Otra condición Médica Importante</span>
                  <InputsBooleanRadioGroup
                    name="otraCondicion"
                    value={form?.otraCondicion}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span >Alergias</span>
                  <InputsBooleanRadioGroup
                    name="alergias"
                    value={form?.alergias} onChange={handleRadioButtonBoolean}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span  >Uso de Medicación Actual</span>
                  <InputsBooleanRadioGroup
                    name="usoMedicacion"
                    value={form?.usoMedicacion}
                    onChange={(e, value) => {
                      if (value == false)
                        setForm(prev => ({ ...prev, medicacionActual: "" }));
                      handleRadioButtonBoolean(e, value)
                    }}
                  />
                </div>
                <InputTextOneLine label="Medicación Actual" name="medicacionActual" value={form?.medicacionActual} onChange={handleChange} disabled={!form.usoMedicacion} />

              </div>
            </div>
          </div>

          {/* Recomendaciones y Observaciones en columnas */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">Recomendaciones</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <InputCheckbox
                label="Corregir Agudeza Visual"
                checked={form?.corregirAgudeza}
                name="corregirAgudeza"
                onChange={handleCheckBoxChangeWithObservations}
              />
              <InputCheckbox
                label="Obesidad I. Dieta Hipocalórica y Ejercicios"
                checked={form?.obesidadDieta}
                name="obesidadDieta"
                onChange={handleCheckBoxChangeWithObservations}
              />
              <InputCheckbox
                label="D m II controlado, tto con:....."
                checked={form?.diabetesControlado}
                name="diabetesControlado"
                onChange={handleCheckBoxChangeWithObservations}
              />
              <InputCheckbox
                label="Sobrepeso. Dieta Hipocalórica y Ejercicios"
                checked={form?.sobrepeso}
                name="sobrepeso"
                onChange={handleCheckBoxChangeWithObservations}
              />
              <InputCheckbox
                label="HTA Controlada, en tto con:..."
                checked={form?.htaControlada}
                name="htaControlada"
                onChange={handleCheckBoxChangeWithObservations}
              />
              <InputCheckbox
                label="Uso de Lentes Correct. Lectura de Cerca"
                checked={form?.lentesCorrectivos}
                name="lentesCorrectivos"
                onChange={handleCheckBoxChangeWithObservations}
              />
            </div>
          </div>
          {/* Observaciones */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">Observaciones</h4>
            <InputTextArea rows={4} name="observaciones" value={form?.observaciones} onChange={handleChange} />
          </div>
        </div>

        {/* Columna de Agudeza Visual (derecha) - 1/4 del ancho */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 flex flex-col">
            <h4 className="font-semibold text-gray-800 mb-3">Agudeza Visual</h4>

            {/* Sin Corregir */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-700 mb-2">Sin Corregir</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="font-semibold mb-2">O.D</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.C.:</span>
                      <InputTextOneLine name="vcOD" value={form?.vcOD} disabled />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.L.:</span>
                      <InputTextOneLine name="vlOD" value={form?.vlOD} disabled />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-2">O.I</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.C.:</span>
                      <InputTextOneLine name="vcOI" value={form?.vcOI} disabled />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.L.:</span>
                      <InputTextOneLine name="vlOI" value={form?.vlOI} disabled />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Corregida */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-700 mb-2">Corregida</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="font-semibold mb-2 ">O.D</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.C.:</span>
                      <InputTextOneLine name="vcCorregidaOD" value={form?.vcCorregidaOD} disabled />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.L.:</span>
                      <InputTextOneLine name="vlCorregidaOD" value={form?.vlCorregidaOD} disabled />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.Clrs:</span>
                      <InputTextOneLine name="vclrs" value={form?.vclrs} disabled />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.B.:</span>
                      <InputTextOneLine name="vb" value={form?.vb} disabled />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">R.P.:</span>
                      <InputTextOneLine name="rp" value={form?.rp} disabled />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-2">O.I</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.C.:</span>
                      <InputTextOneLine name="vcCorregidaOI" value={form?.vcCorregidaOI} disabled />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.L.:</span>
                      <InputTextOneLine name="vlCorregidaOI" value={form?.vlCorregidaOI} disabled />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">:</span>
                      {/* <InputTextOneLine name="vclrs" value={form?.vclrs} disabled /> */}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">:</span>
                      {/* <InputTextOneLine name="vbOI" value={form?.vbOI} disabled /> */}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">:</span>
                      {/* <InputTextOneLine name="rpOI" value={form?.rpOI} disabled /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enfermedades Oculares */}
            <div className="mb-4 flex-1">
              <h5 className="font-semibold text-gray-700 mb-2">Enfermedades Oculares</h5>
              <InputTextArea rows={5} name="enfermedadesOculares" value={form?.enfermedadesOculares} onChange={handleChange} disabled />
            </div>

            {/* Botones de Acción dentro de la columna derecha */}
            <div className="mt-auto space-y-2">
              {/* Fila 1: Botón 1 y Botón 2 lado a lado */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white  px-3 py-2 rounded flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faBroom} /> Limpiar
                </button>
              </div>

              {/* Fila 2: Input y Botón lado a lado */}
              <div className="flex gap-2">
                <input
                  name="norden"
                  value={form?.norden}
                  onChange={handleChange}
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="N° Orden"
                />
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white  px-3 py-2 rounded flex items-center justify-center gap-2"
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


