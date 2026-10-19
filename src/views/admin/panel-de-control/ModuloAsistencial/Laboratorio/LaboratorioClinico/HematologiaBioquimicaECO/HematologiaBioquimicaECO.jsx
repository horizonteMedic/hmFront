import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  SectionFieldset,
  InputsRadioGroup,
  CIE10List
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { ConfirmarImpresion, handleSubirArchivo, handleSubirArchivoMasivo, ReadArchivosForm, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerHematologiaBioquimicaECO";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import ButtonsPDF from "../../../../../../components/reusableComponents/ButtonsPDF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fechaExamen",
  "grupoSanguineo",
  "factorRh",
  "hemoglobina",
  "hematocrito",
  "vsg",
  "leucocitos",
  "hematies",
  "plaquetas",
  "neutrofilos",
  "abastonados",
  "segmentados",
  "monocitos",
  "eosinofilos",
  "basofilos",
  "linfocitos",
  "rpr",
  "vih",
  "glucosa",
  "creatinina",
  "color",
  "aspecto",
  "densidad",
  "ph",
  "nitritos",
  "proteinas",
  "cetonas",
  "leucocitosExamenQuimico",
  "acAscorbico",
  "urobilinogeno",
  "bilirrubina",
  "glucosaExamenQuimico",
  "sangre",
  "leucocitosSedimentoUnitario",
  "hematiesSedimentoUnitario",
  "celEpiteliales",
  "cristales",
  "cilindros",
  "bacterias",
  "gramSc",
  "otros",
  "cocaina",
  "marihuana",
  "observaciones",
  "observacionesCie10",
  "notasDoctor",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function HematologiaBioquimicaECO() {
  const today = getToday();

  const { token, userlogued, selectedSede, userName } = useSessionData();

  const initialFormState = {
    numeroTicket: "",
    ticketImprimir: "",
    codLabclinico: null,
    fechaExamen: today,

    responsable: "",
    gfSangPedido: "",

    pacienteId: null,
    numeroDocumento: "",
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
    ocupacion: "",

    grupoSanguineo: "",
    factorRh: "",

    hemoglobina: "",
    hematocrito: "",
    vsg: "",
    leucocitos: "",
    hematies: "",
    plaquetas: "",
    neutrofilos: "",
    abastonados: "",
    segmentados: "",
    monocitos: "",
    eosinofilos: "",
    basofilos: "",
    linfocitos: "",

    rpr: 'N/A',
    vih: 'N/A',
    glucosa: "",
    creatinina: "",

    // Campos de Examen de Orina - Estados iniciales
    color: 'AMARILLO CLARO',
    aspecto: 'TRANSPARENTE',
    densidad: '',
    ph: '',

    nitritos: 'NEGATIVO',
    proteinas: 'NEGATIVO',
    cetonas: 'NEGATIVO',
    leucocitosExamenQuimico: 'NEGATIVO',
    acAscorbico: 'NEGATIVO',
    urobilinogeno: 'NEGATIVO',
    bilirrubina: 'NEGATIVO',
    glucosaExamenQuimico: 'NEGATIVO',
    sangre: 'NEGATIVO',

    leucocitosSedimentoUnitario: '0-1',
    hematiesSedimentoUnitario: '0-0',
    celEpiteliales: 'ESCASAS',
    cristales: 'NO SE OBSERVAN',
    cilindros: 'NO SE OBSERVAN',
    bacterias: 'NO SE OBSERVAN',
    gramSc: 'NO SE OBSERVAN',
    otros: 'NO SE OBSERVAN',

    cocaina: '',
    marihuana: '',

    observaciones: '',
    observacionesCie10: '',

    notasDoctor: "",

    SubirDoc: false,
    nomenclatura: "LABORATORIO MANIPULADORES",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
  };


  const [visualerOpen, setVisualerOpen] = useState(null)

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handleFocusNext,
    handleRadioButton,
  } = useForm(initialFormState, { storageKey: "asistLaboratorioClinico" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico y el doctor asignado se componen de 2 campos (id de firma + nombre): se detecta
  // el cambio por el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
  const isDoctorEdited = isFieldEdited("user_doctorAsignado");
  const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear);
  };

  const handleHemoglobinaBlur = (e) => {
    const { value } = e.target;
    if (value === "" || value === "N/A") return;

    const numero = Number(value);
    if (isNaN(numero) || numero <= 0 || numero > 25) {
      Swal.fire("Valor no válido", "La Hemoglobina debe ser un valor mayor a 0 y menor o igual a 25 g/dl", "warning");
      setForm(prev => ({ ...prev, hemoglobina: "" }));
    }
  };

  // Equivalente a handleClearnotO pero conservando el N° Ticket digitado.
  const limpiarSalvoTicket = () => {
    setForm((prev) => ({ ...initialFormState, numeroTicket: prev.numeroTicket }));
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    limpiarSalvoTicket();
    VerifyTR(form.numeroTicket, token, setForm);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres);

  const handlePrint = () => {
    ConfirmarImpresion(form.ticketImprimir, token);
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  useEffect(() => {
    const grupo = form.grupoSanguineo;
    const rh = (form.factorRh).replace("RH", "");
    setForm(prev => ({ ...prev, gfSangPedido: `${grupo} ${rh}`.trim() }));
  }, [form.grupoSanguineo, form.factorRh]);

  return (
    <div className="max-w-[95%] xl:max-w-[90%] mx-auto space-y-3">
      <div className="px-4">
        <AccionesRegistroHeader
          tieneRegistro={form.tieneRegistro}
          hayRegistroCargado={hayRegistroCargado}
          edicionHabilitada={edicionHabilitada}
          onHabilitarEdicion={habilitarEdicion}
          onLimpiar={handleClear}
        />
      </div>
      <div className="space-y-3 px-4">
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4">
          <div className="flex gap-x-3 w-full">
            <InputTextOneLine
              label="N° Ticket"
              name="numeroTicket"
              value={form.numeroTicket}
              onChange={handleChangeNumber}
              onKeyUp={handleSearch}
              disabled={hayRegistroCargado}
              labelWidth="120px"
              className="w-full"
            />
            <SearchButton onClick={executeSearch} className="xl:hidden" />
          </div>
          <InputTextOneLine
            label="Fecha"
            name="fechaExamen"
            type="date"
            value={form.fechaExamen}
            onChange={handleChangeSimple}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("fechaExamen")}
            onRevert={() => revertField("fechaExamen")}
            labelWidth="120px"
          />
          <ButtonsPDF
            {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
            {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
            handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
          />
        </SectionFieldset>

        <DatosPersonalesLaborales form={form} laborales={false}
        />

        <SectionFieldset legend="Grupo Sanguineo" collapsible className="grid grid-cols-1 gap-3 lg:gap-4">
          <InputTextOneLine
            label="G.F. Sang. Pedido"
            name="gfSangPedido"
            value={form.gfSangPedido}
            disabled
            labelWidth="120px"
          />
        </SectionFieldset> 
        {/* Contenido principal en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hematología */}
          <SectionFieldset legend="Hematología" className="space-y-3">
            <div className="flex justify-end">
              <button
                type="button"
                disabled={camposDeshabilitados}
                className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  const text = form.vsg == "N/A" ? "" : "N/A";
                  setForm(prev => ({
                    ...prev,
                    vsg: text,
                    leucocitos: text,
                    hematies: text,
                    plaquetas: text,
                    neutrofilos: text,
                    abastonados: text,
                    segmentados: text,
                    monocitos: text,
                    eosinofilos: text,
                    basofilos: text,
                    linfocitos: text,
                    creatinina: text,
                  }))
                }}
              >
                N/A
              </button>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-3">
                <InputsRadioGroup
                  label="Grupo Sanguíneo"
                  name="grupoSanguineo"
                  value={form.grupoSanguineo}
                  options={[{ label: "O", value: "O" }, { label: "A", value: "A" }, { label: "B", value: "B" }, { label: "AB", value: "AB" }]}
                  labelWidth="120px"
                  onChange={handleRadioButton}
                  allowUncheck
                  disabled={camposDeshabilitados}
                  edited={isFieldEdited("grupoSanguineo")}
                  onRevert={() => revertField("grupoSanguineo")}
                />
                <InputsRadioGroup
                  label="Factor Rh"
                  name="factorRh"
                  options={[{ label: "Rh(+)", value: "RH(+)" }, { label: "Rh(-)", value: "RH(-)" }]}
                  value={form.factorRh}
                  labelWidth="120px"
                  className="mb-4"
                  onChange={handleRadioButton}
                  allowUncheck
                  disabled={camposDeshabilitados}
                  edited={isFieldEdited("factorRh")}
                  onRevert={() => revertField("factorRh")}
                />
                {[
                  ["Hemoglobina", "g/dl"],
                  ["Hematocrito", "%"],
                  ["Vsg", "mm/Hora"],
                  ["Leucocitos", "mm³"],
                  ["Hematies", "mm³"],
                  ["Plaquetas", "mm³"],
                ].map(([key, unit]) => (
                  <InputTextOneLine
                    label={`${key} (${unit})`}
                    key={key}
                    name={key.toLowerCase()}
                    value={form[key.toLowerCase()]}
                    labelWidth="120px"
                    onChange={handleChange}
                    onKeyUp={handleFocusNext}
                    onBlur={key === "Hemoglobina" ? handleHemoglobinaBlur : undefined}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited(key.toLowerCase())}
                    onRevert={() => revertField(key.toLowerCase())}
                  />
                ))}
              </div>
              <div className="space-y-3 mt-20">
                {[
                  ["Neutrofilos", "%"],
                  ["Abastonados", "%"],
                  ["Segmentados", "%"],
                  ["Monocitos", "%"],
                  ["Eosinofilos", "%"],
                  ["Basofilos", "%"],
                  ["Linfocitos", "%"],
                ].map(([key, unit]) => (
                  <InputTextOneLine
                    label={`${key} (${unit})`}
                    key={key}
                    name={key.toLowerCase()}
                    value={form[key.toLowerCase()]}
                    labelWidth="120px"
                    onChange={handleChange}
                    onKeyUp={(e) => { handleFocusNext(e, key == "Linfocitos" ? "glucosa" : "") }}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited(key.toLowerCase())}
                    onRevert={() => revertField(key.toLowerCase())}
                  />
                ))}
              </div>
            </div>
          </SectionFieldset>
          <div className="space-y-3">
            {/* Reacciones Serológicas */}
            <SectionFieldset legend="Reacciones Serológicas" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {["rpr", "vih"].map(item => (
                <div className="space-y-3" key={item}>
                  <InputTextOneLine
                    label={item.toUpperCase()}
                    name={item}
                    value={form[item]}
                    disabled
                  />
                  <div className="flex justify-center">
                    <InputsRadioGroup
                      name={item}
                      value={form[item]}
                      options={[
                        { label: '+', value: 'POSITIVO' },
                        { label: '-', value: 'NEGATIVO' },
                        { label: 'N/A', value: 'N/A' }
                      ]}
                      onChange={handleRadioButton}
                      disabled={camposDeshabilitados}
                      edited={isFieldEdited(item)}
                      onRevert={() => revertField(item)}
                    />
                  </div>
                </div>
              ))}
            </SectionFieldset>
            {/* Bioquímica */}
            <SectionFieldset legend="Bioquímica" className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <InputTextOneLine
                  label="Glucosa (mg/dl)"
                  name="glucosa"
                  value={form.glucosa}
                  labelWidth="120px"
                  onChange={handleChange}
                  onKeyUp={(e) => { handleFocusNext(e, "creatinina") }}
                  disabled={camposDeshabilitados}
                  edited={isFieldEdited("glucosa")}
                  onRevert={() => revertField("glucosa")}
                />
                <div className="flex gap-4 items-center">
                  <InputCheckbox
                    label="N/A"
                    checked={form.glucosa === "N/A"}
                    onChange={e => setForm(f => ({ ...f, glucosa: e.target.checked ? "N/A" : "" }))}
                    disabled={camposDeshabilitados}
                  />
                  <span className="ml-6 text-gray-600 font-medium">
                    Valores normales 70 - 110 mg/dl
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <InputTextOneLine
                  label="Creatinina (mg/dl)"
                  name="creatinina"
                  value={form.creatinina}
                  labelWidth="120px"
                  onChange={handleChange}
                  onKeyUp={(e) => { handleFocusNext(e, "densidad") }}
                  disabled={camposDeshabilitados}
                  edited={isFieldEdited("creatinina")}
                  onRevert={() => revertField("creatinina")}
                />
                <div className="flex gap-4 items-center">
                  <InputCheckbox
                    label="N/A"
                    checked={form.creatinina === "N/A"}
                    onChange={e => setForm(f => ({ ...f, creatinina: e.target.checked ? "N/A" : "" }))}
                    disabled={camposDeshabilitados}
                  />
                  <span className="ml-6 text-gray-600 font-medium">
                    Valores normales 0.8 - 1.4 mg/dl
                  </span>
                </div>
              </div>
            </SectionFieldset>

          </div>

        </div>

        {/*Examen de Orina */}
        <SectionFieldset legend="Examen de Orina" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6 flex flex-col">
              <SectionFieldset legend="Examen Físico" className="space-y-4 flex-1">
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={camposDeshabilitados}
                    className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        color: form.color == "N/A" ? "AMARILLO CLARO" : "N/A",
                        aspecto: form.color == "N/A" ? "TRANSPARENTE" : "N/A",
                        densidad: form.color == "N/A" ? "" : "N/A",
                        ph: form.color == "N/A" ? "" : "N/A",

                        nitritos: form.color == "N/A" ? "NEGATIVO" : "N/A",
                        proteinas: form.color == "N/A" ? "NEGATIVO" : "N/A",
                        cetonas: form.color == "N/A" ? "NEGATIVO" : "N/A",
                        leucocitosExamenQuimico: form.color == "N/A" ? "NEGATIVO" : "N/A",
                        acAscorbico: form.color == "N/A" ? "NEGATIVO" : "N/A",
                        urobilinogeno: form.color == "N/A" ? "NEGATIVO" : "N/A",
                        bilirrubina: form.color == "N/A" ? "NEGATIVO" : "N/A",
                        glucosaExamenQuimico: form.color == "N/A" ? "NEGATIVO" : "N/A",
                        sangre: form.color == "N/A" ? "NEGATIVO" : "N/A",

                        leucocitosSedimentoUnitario: form.color == "N/A" ? "0-1" : "N/A",
                        hematiesSedimentoUnitario: form.color == "N/A" ? "0-0" : "N/A",
                        celEpiteliales: form.color == "N/A" ? "ESCASAS" : "N/A",
                        cristales: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",
                        cilindros: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",
                        bacterias: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",
                        gramSc: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",
                        otros: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",

                        cocaina: form.color == "N/A" ? "" : "N/A",
                        marihuana: form.color == "N/A" ? "" : "N/A",
                      }))
                    }}
                  >
                    No Aplica
                  </button>
                </div>
                <div className="grid xl:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4">
                    <label className="font-semibold min-w-[100px] max-w-[100px]">Color :</label>
                    <select
                      name="color"
                      value={form.color}
                      disabled={camposDeshabilitados}
                      className={`border rounded p-1 w-full ${camposDeshabilitados ? "bg-gray-300" : ""} ${isFieldEdited("color") ? "border-orange-400 bg-orange-100" : ""}`}
                      onChange={handleChange}
                    >
                      <option>N/A</option>
                      <option>AMARILLO CLARO</option>
                      <option>AMARILLO PAJIZO</option>
                      <option>AMARILLO AMBAR</option>
                      <option>AMBAR</option>
                      <option>INCOLORO</option>
                      <option>MEDICAMENTOSO</option>
                      <option>SANGUINOLENTO</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="font-semibold min-w-[100px] max-w-[100px]">Aspecto:</label>
                    <select
                      name="aspecto"
                      value={form.aspecto}
                      disabled={camposDeshabilitados}
                      className={`border rounded p-1 w-full ${camposDeshabilitados ? "bg-gray-300" : ""} ${isFieldEdited("aspecto") ? "border-orange-400 bg-orange-100" : ""}`}
                      onChange={handleChange}
                    >
                      <option>N/A</option>
                      <option>LIGERAMENTE TURBIO</option>
                      <option>TRANSPARENTE</option>
                      <option>TURBIO</option>
                    </select>
                  </div>
                  <InputTextOneLine
                    label="Densidad"
                    name="densidad"
                    value={form.densidad}
                    labelWidth="100px"
                    onChange={handleChange}
                    onKeyUp={(e) => { handleFocusNext(e, "ph") }}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("densidad")}
                    onRevert={() => revertField("densidad")}
                  />
                  <InputTextOneLine
                    label="PH"
                    name="ph"
                    value={form.ph}
                    labelWidth="100px"
                    onChange={handleChange}
                    onKeyUp={(e) => { handleFocusNext(e, "cocaina") }}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("ph")}
                    onRevert={() => revertField("ph")}
                  />
                </div>
              </SectionFieldset>

              <SectionFieldset legend="Sedimento Urinario" className="space-y-2 grid xl:grid-cols-2 gap-x-4">
                <div className="grid gap-y-2">
                  {[
                    { label: 'Leucocitos (x campos)', key: 'leucocitosSedimentoUnitario' },
                    { label: 'CelEpiteliales', key: 'celEpiteliales' },
                    { label: 'Cilindros', key: 'cilindros' },
                    { label: 'Gram S/C', key: 'gramSc' },
                  ].map((item) => (
                    <InputTextOneLine
                      label={item.label}
                      name={item.key}
                      key={item.key}
                      value={form[item.key]}
                      onChange={handleChange}
                      onKeyUp={handleFocusNext}
                      disabled={camposDeshabilitados}
                      edited={isFieldEdited(item.key)}
                      onRevert={() => revertField(item.key)}
                    />
                  ))}
                </div>
                <div className="grid gap-y-2">
                  {[
                    { label: 'Hematies (x campos)', key: 'hematiesSedimentoUnitario' },
                    { label: 'Cristales', key: 'cristales' },
                    { label: 'Bacterias', key: 'bacterias' },
                    { label: 'Otros', key: 'otros' },
                  ].map((item) => (
                    <InputTextOneLine
                      label={item.label}
                      name={item.key}
                      key={item.key}
                      value={form[item.key]}
                      onChange={handleChange}
                      onKeyUp={handleFocusNext}
                      disabled={camposDeshabilitados}
                      edited={isFieldEdited(item.key)}
                      onRevert={() => revertField(item.key)}
                    />
                  ))}
                </div>
              </SectionFieldset>
            </div>
            <div className="space-y-6 flex flex-col">
              <SectionFieldset legend="Examen Químico" className="grid xl:grid-cols-2 gap-y-2 xl:gap-y-0 gap-x-4">
                <div className="grid gap-y-2 ">
                  {[
                    { label: 'Nitritos', key: 'nitritos' },
                    { label: 'Cetonas', key: 'cetonas' },
                    { label: 'Ác. Ascórbico', key: 'acAscorbico' },
                    { label: 'Bilirrubina', key: 'bilirrubina' },
                    { label: 'Sangre', key: 'sangre' },
                  ].map((item) => (
                    <InputTextOneLine
                      label={item.label}
                      name={item.key}
                      key={item.key}
                      value={form[item.key]}
                      onChange={handleChange}
                      onKeyUp={handleFocusNext}
                      disabled={camposDeshabilitados}
                      edited={isFieldEdited(item.key)}
                      onRevert={() => revertField(item.key)}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-y-2 ">
                  {[
                    { label: 'Proteínas', key: 'proteinas' },
                    { label: 'Leucocitos', key: 'leucocitosExamenQuimico' },
                    { label: 'Urobilinógeno', key: 'urobilinogeno' },
                    { label: 'Glucosa', key: 'glucosaExamenQuimico' },

                  ].map((item) => (
                    <InputTextOneLine
                      label={item.label}
                      name={item.key}
                      key={item.key}
                      value={form[item.key]}
                      onChange={handleChange}
                      onKeyUp={handleFocusNext}
                      disabled={camposDeshabilitados}
                      edited={isFieldEdited(item.key)}
                      onRevert={() => revertField(item.key)}
                    />
                  ))}
                </div>
              </SectionFieldset>

              <SectionFieldset legend="Drogas" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[
                  { label: 'Cocaína', key: 'cocaina' },
                  { label: 'Marihuana', key: 'marihuana' }
                ].map(item => (
                  <div className="space-y-3" key={item.key}>
                    <InputTextOneLine
                      label={item.label}
                      name={item.key}
                      value={form[item.key]}
                      onChange={handleChange}
                      onKeyUp={(e) => { handleFocusNext(e, item.key == "cocaina" ? "marihuana" : "") }}
                      disabled={camposDeshabilitados}
                      edited={isFieldEdited(item.key)}
                      onRevert={() => revertField(item.key)}
                    />
                    <div className="flex justify-center">
                      <InputsRadioGroup
                        name={item.key}
                        value={form[item.key]}
                        options={[
                          { label: 'POSITIVO', value: 'POSITIVO' },
                          { label: 'NEGATIVO', value: 'NEGATIVO' },
                          { label: 'N/A', value: 'N/A' }
                        ]}
                        onChange={handleRadioButton}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited(item.key)}
                        onRevert={() => revertField(item.key)}
                      />
                    </div>
                  </div>
                ))}
              </SectionFieldset>
            </div>
          </div>

          <SectionFieldset legend="Conclusiones" className="space-y-4">
            <InputTextArea
              label="Observaciones"
              name="observaciones"
              value={form.observaciones}
              rows={4}
              onChange={handleChange}
              disabled={camposDeshabilitados}
              edited={isFieldEdited("observaciones")}
              onRevert={() => revertField("observaciones")}
            />
            <div className="bg-green-200 p-3 rounded-xl col-span-3">
              <CIE10List
                value={form.observacionesCie10}
                fieldName="observacionesCie10"
                label="Observaciones CIE10"
                token={token}
                setForm={setForm}
                disabled={camposDeshabilitados}
              />
            </div>
            <InputTextArea
              label="Notas Para Doctor"
              name="notasDoctor"
              value={form.notasDoctor}
              rows={4}
              onChange={handleChange}
              disabled={camposDeshabilitados}
              edited={isFieldEdited("notasDoctor")}
              onRevert={() => revertField("notasDoctor")}
            />
            <EmpleadoComboBox
              value={form.nombre_medico}
              label="Especialista"
              form={form}
              onChange={handleChangeSimple}
              disabled={camposDeshabilitados}
              edited={isMedicoEdited}
              onRevert={revertMedico}
            />
            <EmpleadoComboBox
              value={form.nombre_doctorAsignado}
              label="Doctor Asignado"
              form={form}
              onChange={handleChangeSimple}
              nameField="nombre_doctorAsignado"
              idField="user_doctorAsignado"
              disabled={camposDeshabilitados}
              edited={isDoctorEdited}
              onRevert={revertDoctor}
            />
          </SectionFieldset>
        </SectionFieldset>

        {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
        {hayRegistroCargado && (
          <AuditoriaRegistro
            mostrarEdicion={form.tieneRegistro}
            fechaCreacion={auditoria.fechaCreacion}
            fechaEdicion={auditoria.fechaActualizacion}
            usuarioRegistro={auditoria.usuarioRegistro}
            usuarioEdicion={auditoria.usuarioActualizacion}
          />
        )}

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

        {/* ===== BOTONES DE ACCIÓN ===== */}
        <BotonesForm
          form={form}
          handleChangeNumberDecimals={handleChangeNumberDecimals}
          handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
          saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
          handleEdit={habilitarEdicion}
          handleClear={handleClear}
          handlePrint={handlePrint}
          printField="ticketImprimir"
          printLabel="IMPRIMIR N° TICKET"
          hideSave={form.tieneRegistro && !edicionHabilitada}
          hideEdit={!form.tieneRegistro || edicionHabilitada}
        />
      </div>
    </div>
  );
}
