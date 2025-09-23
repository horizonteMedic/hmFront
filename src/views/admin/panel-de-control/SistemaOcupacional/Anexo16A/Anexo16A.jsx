/* eslint-disable react/prop-types */
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
  InputsRadioGroup,
  InputTextOneLine,
  InputTextArea,
} from "../../../../components/reusableComponents/ResusableComponents";

// Vista base para Anexo 16-A - Formulario médico ocupacional
export default function Anexo16A({
  form: propForm,
  handleChange: propHandleChange,
  handleChangeNumber: propHandleChangeNumber,
  handleCheckBoxChange: propHandleCheckBoxChange,
  handleRadioButtonBoolean: propHandleRadioButtonBoolean,
  handleRadioButton: propHandleRadioButton,
  handleSearch: propHandleSearch,
  handlePrint,
  handleSave,
  handleClear,
}) {
  // Estado local del formulario
  const [form, setForm] = useState(propForm || {
    norden: "",
    fechaExam: "",
    apto: false,
    inapto: false,
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
    medicoNombre: "",
    medicoCmp: "",
    medicoDireccion: "",
    cirugiaMayor: false,
    desordenesCoagulacion: false,
    diabetes: false,
    hipertension: false,
    embarazo: false,
    fur: false,
    furFecha: "",
    problemasNeurologicos: false,
    infecionesRecientes: false,
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
    empresaContratista: "",
    empresa: "",
    observaciones: "",
    vcOD: "",
    vlOD: "",
    vcOI: "",
    vlOI: "",
    vcCorregidaOD: "",
    vlCorregidaOD: "",
    vclrsOD: "",
    vbOD: "",
    rpOD: "",
    vcCorregidaOI: "",
    vlCorregidaOI: "",
    vclrsOI: "",
    vbOI: "",
    rpOI: "",
    enfermedadesOculares: ""
  });

  // Funciones de manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (propHandleChange) propHandleChange(e);
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (propHandleChangeNumber) propHandleChangeNumber(e);
  };

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
    if (propHandleCheckBoxChange) propHandleCheckBoxChange(e);
  };

  const handleSearch = (e) => {
    if (propHandleSearch) propHandleSearch(e);
  };

  // Función auxiliar para manejar radio buttons SI/NO
  const handleSiNoChange = (fieldName, e, value) => {
    setForm(prev => ({ ...prev, [fieldName]: value }));
    if (propHandleCheckBoxChange) {
      propHandleCheckBoxChange({ target: { name: fieldName, checked: value } });
    }
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
            value={form?.norden || ""}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
                labelWidth="80px"
          />
          <InputTextOneLine
                label="Fecha"
            name="fechaExam"
            type="date"
            value={form?.fechaExam || ""}
            onChange={handleChange}
                labelWidth="60px"
              />
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700">Apto/Inapto:</span>
                <InputsBooleanRadioGroup
                  name="aptoInapto"
                  value={form?.apto ? true : form?.inapto ? false : null}
                  onChange={(e, value) => {
                    setForm(prev => ({ 
                      ...prev, 
                      apto: value === true, 
                      inapto: value === false 
                    }));
                  }}
                  trueLabel="Apto"
                  falseLabel="Inapto"
                />
              </div>
              <InputTextOneLine
                label="Actividad a Realizar"
                name="actividadRealizar"
                value={form?.actividadRealizar || ""}
                onChange={handleChange}
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
                <InputTextOneLine label="Nombres y Apellidos" name="nombres" value={form?.nombres || ""} disabled labelWidth="140px" />
                <InputTextOneLine label="Fecha de Nacimiento" name="fechaNac" type="date" value={form?.fechaNac || ""} disabled labelWidth="140px" />
              </div>
              {/* Fila 2: DNI, Sexo y Edad */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <InputTextOneLine label="DNI" name="dni" value={form?.dni || ""} disabled labelWidth="60px" />
                <InputTextOneLine label="Sexo" name="sexo" value={form?.sexo || ""} disabled labelWidth="50px" />
                <InputTextOneLine label="Edad" name="edad" value={form?.edad || ""} disabled labelWidth="50px" />
              </div>
            </div>
          </div>

          {/* Funciones Vitales */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">F.C:</label>
                <InputTextOneLine name="fc" value={form?.fc || ""} onChange={handleChangeNumber} />
                <span className="text-gray-500">x min.</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">P.A:</label>
                <InputTextOneLine name="pa" value={form?.pa || ""} onChange={handleChangeNumber} />
                <span className="text-gray-500">mmHg.</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">F.R:</label>
                <InputTextOneLine name="fr" value={form?.fr || ""} onChange={handleChangeNumber} />
                <span className="text-gray-500">x min.</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">IMC:</label>
                <InputTextOneLine name="imc" value={form?.imc || ""} onChange={handleChangeNumber} />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">Sat. O2:</label>
                <InputTextOneLine name="satO2" value={form?.satO2 || ""} onChange={handleChangeNumber} />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">T°:</label>
                <InputTextOneLine name="temperatura" value={form?.temperatura || ""} onChange={handleChangeNumber} />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">Peso:</label>
                <InputTextOneLine name="peso" value={form?.peso || ""} onChange={handleChangeNumber} />
                <span className="text-gray-500">kg.</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 min-w-[30px]">Talla:</label>
                <InputTextOneLine name="talla" value={form?.talla || ""} onChange={handleChangeNumber} />
                <span className="text-gray-500">m.</span>
              </div>
            </div>
          </div>

          {/* Médico */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">Médico</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <InputTextOneLine label="Nombre completo" name="medicoNombre" value={form?.medicoNombre || ""} onChange={handleChange} />
              <InputTextOneLine label="CMP" name="medicoCmp" value={form?.medicoCmp || ""} onChange={handleChange} />
              <InputTextOneLine label="Dirección" name="medicoDireccion" value={form?.medicoDireccion || ""} onChange={handleChange} />
        </div>
      </div>

          {/* Antecedentes Médicos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">El/la presenta o ha presentado en los 6 últimos meses</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Columna Izquierda */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={form?.cirugiaMayor ? "text-red-500" : ""}>Cirugía Mayor Reciente</span>
                  <InputsBooleanRadioGroup
                    name="cirugiaMayor"
                    value={form?.cirugiaMayor}
                    onChange={(e, value) => handleSiNoChange("cirugiaMayor", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.desordenesCoagulacion ? "text-red-500" : ""}>Desórdenes de la coagulación, trombosis, etc</span>
                  <InputsBooleanRadioGroup
                    name="desordenesCoagulacion"
                    value={form?.desordenesCoagulacion}
                    onChange={(e, value) => handleSiNoChange("desordenesCoagulacion", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.diabetes ? "text-red-500" : ""}>Diabetes Mellitus</span>
                  <InputsBooleanRadioGroup
                    name="diabetes"
                    value={form?.diabetes}
                    onChange={(e, value) => handleSiNoChange("diabetes", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.hipertension ? "text-red-500" : ""}>Hipertensión Arterial</span>
                  <InputsBooleanRadioGroup
                    name="hipertension"
                    value={form?.hipertension}
                    onChange={(e, value) => handleSiNoChange("hipertension", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.embarazo ? "text-red-500" : ""}>Embarazo</span>
                  <InputsBooleanRadioGroup
                    name="embarazo"
                    value={form?.embarazo}
                    onChange={(e, value) => handleSiNoChange("embarazo", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={form?.fur ? "text-red-500" : ""}>FUR:</span>
                    <InputTextOneLine name="furFecha" value={form?.furFecha || ""} onChange={handleChange} />
                  </div>
                  <InputsBooleanRadioGroup
                    name="fur"
                    value={form?.fur}
                    onChange={(e, value) => handleSiNoChange("fur", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.problemasNeurologicos ? "text-red-500" : ""}>Problemas Neurológicos: Epilepsia, vértigo, etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasNeurologicos"
                    value={form?.problemasNeurologicos}
                    onChange={(e, value) => handleSiNoChange("problemasNeurologicos", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.infeccionesRecientes ? "text-red-500" : ""}>Infecciones recientes (especialmente oídos, nariz, garganta)</span>
                  <InputsBooleanRadioGroup
                    name="infeccionesRecientes"
                    value={form?.infeccionesRecientes}
                    onChange={(e, value) => handleSiNoChange("infeccionesRecientes", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
          </div>
        </div>

              {/* Columna Derecha */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={form?.obesidadMorbida ? "text-red-500" : ""}>Obesidad Mórbida (IMC mayor a 35 m/Kg 2)</span>
                  <InputsBooleanRadioGroup
                    name="obesidadMorbida"
                    value={form?.obesidadMorbida}
                    onChange={(e, value) => handleSiNoChange("obesidadMorbida", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.problemasCardiacos ? "text-red-500" : ""}>Problemas Cardiacos: marca pasos, coronariopatías, etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasCardiacos"
                    value={form?.problemasCardiacos}
                    onChange={(e, value) => handleSiNoChange("problemasCardiacos", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.problemasRespiratorios ? "text-red-500" : ""}>Problemas respiratorios: Asma, EPOC etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasRespiratorios"
                    value={form?.problemasRespiratorios}
                    onChange={(e, value) => handleSiNoChange("problemasRespiratorios", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.problemasOftalmologicos ? "text-red-500" : ""}>Problemas Oftalmológicos: Retinopatía, glaucoma, etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasOftalmologicos"
                    value={form?.problemasOftalmologicos}
                    onChange={(e, value) => handleSiNoChange("problemasOftalmologicos", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.problemasDigestivos ? "text-red-500" : ""}>Problemas Digestivos: Úlcera péptica, hepatitis, etc</span>
                  <InputsBooleanRadioGroup
                    name="problemasDigestivos"
                    value={form?.problemasDigestivos}
                    onChange={(e, value) => handleSiNoChange("problemasDigestivos", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.apneaSueño ? "text-red-500" : ""}>Apnea del Sueño</span>
                  <InputsBooleanRadioGroup
                    name="apneaSueño"
                    value={form?.apneaSueño}
                    onChange={(e, value) => handleSiNoChange("apneaSueño", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.otraCondicion ? "text-red-500" : ""}>Otra condición Médica Importante</span>
                  <InputsBooleanRadioGroup
                    name="otraCondicion"
                    value={form?.otraCondicion}
                    onChange={(e, value) => handleSiNoChange("otraCondicion", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.alergias ? "text-red-500" : ""}>Alergias</span>
                  <InputsBooleanRadioGroup
                    name="alergias"
                    value={form?.alergias}
                    onChange={(e, value) => handleSiNoChange("alergias", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={form?.usoMedicacion ? "text-red-500" : ""}>Uso de Medicación Actual</span>
                  <InputsBooleanRadioGroup
                    name="usoMedicacion"
                    value={form?.usoMedicacion}
                    onChange={(e, value) => handleSiNoChange("usoMedicacion", e, value)}
                    trueLabel="SI"
                    falseLabel="NO"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">Recomendaciones</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <InputCheckbox 
                label="Corregir Agudeza Visual"
                checked={!!form?.corregirAgudeza} 
                name="corregirAgudeza" 
                onChange={handleCheckBoxChange} 
              />
              <InputCheckbox 
                label="Obesidad I. Dieta Hipocalórica y Ejercicios"
                checked={!!form?.obesidadDieta} 
                name="obesidadDieta" 
                onChange={handleCheckBoxChange} 
              />
              <InputCheckbox 
                label="D m II controlado, tto con:....."
                checked={!!form?.diabetesControlado} 
                name="diabetesControlado" 
                onChange={handleCheckBoxChange} 
              />
              <InputCheckbox 
                label="Sobrepeso. Dieta Hipocalórica y Ejercicios"
                checked={!!form?.sobrepeso} 
                name="sobrepeso" 
                onChange={handleCheckBoxChange} 
              />
              <InputCheckbox 
                label="HTA Controlada, en tto con:..."
                checked={!!form?.htaControlada} 
                name="htaControlada" 
                onChange={handleCheckBoxChange} 
              />
              <InputCheckbox 
                label="Uso de Lentes Correct. Lectura de Cerca"
                checked={!!form?.lentesCorrectivos} 
                name="lentesCorrectivos" 
                onChange={handleCheckBoxChange} 
              />
            </div>
      </div>

          {/* Empresa Contratista */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <InputTextOneLine label="Emp. Contratista" name="empresaContratista" value={form?.empresaContratista || ""} onChange={handleChange} />
              <InputTextOneLine label="Empresa" name="empresa" value={form?.empresa || ""} onChange={handleChange} />
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-3">Observaciones</h4>
            <InputTextArea rows={4} name="observaciones" value={form?.observaciones || ""} onChange={handleChange} />
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
                      <InputTextOneLine name="vcOD" value={form?.vcOD || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.L.:</span>
                      <InputTextOneLine name="vlOD" value={form?.vlOD || ""} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-2">O.I</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.C.:</span>
                      <InputTextOneLine name="vcOI" value={form?.vcOI || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.L.:</span>
                      <InputTextOneLine name="vlOI" value={form?.vlOI || ""} onChange={handleChange} />
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
                      <InputTextOneLine name="vcCorregidaOD" value={form?.vcCorregidaOD || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.L.:</span>
                      <InputTextOneLine name="vlCorregidaOD" value={form?.vlCorregidaOD || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.Clrs:</span>
                      <InputTextOneLine name="vclrsOD" value={form?.vclrsOD || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.B.:</span>
                      <InputTextOneLine name="vbOD" value={form?.vbOD || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">R.P.:</span>
                      <InputTextOneLine name="rpOD" value={form?.rpOD || ""} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-2">O.I</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.C.:</span>
                      <InputTextOneLine name="vcCorregidaOI" value={form?.vcCorregidaOI || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.L.:</span>
                      <InputTextOneLine name="vlCorregidaOI" value={form?.vlCorregidaOI || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.Clrs:</span>
                      <InputTextOneLine name="vclrsOI" value={form?.vclrsOI || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">V.B.:</span>
                      <InputTextOneLine name="vbOI" value={form?.vbOI || ""} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] min-w-[30px]">R.P.:</span>
                      <InputTextOneLine name="rpOI" value={form?.rpOI || ""} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enfermedades Oculares */}
            <div className="mb-4 flex-1">
              <h5 className="font-semibold text-gray-700 mb-2">Enfermedades Oculares</h5>
              <InputTextArea rows={3} name="enfermedadesOculares" value={form?.enfermedadesOculares || ""} onChange={handleChange} />
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
                  value={form?.norden || ""}
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


