import { useEffect } from "react";
import {
  PrintHojaR,
  SubmitDataService,
  UpdateDataService,
  TABLA_CUESTIONARIO_AUDIOMETRIA,
  VerifyTR,
} from "./controllerAudiometriaCuestionario";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";

const tabla = TABLA_CUESTIONARIO_AUDIOMETRIA;

const OPCIONES_SI_NO = [
  { label: "SI", value: "SI" },
  { label: "NO", value: "NO" },
];

// Preguntas 1 a 15. `campos` son las respuestas que dependen de marcar SI (se limpian al marcar NO).
const PREGUNTAS = [
  {
    n: 1,
    texto:
      "1.- Tiene conocimiento de algún problema del oído y/o audición que haya tenido o haya sido diagnosticado y/o en estudio, así como : perdida de audición, hipoacusia, otitis medio agudo, cronico, supurativo externo, presencia de secreción purulenta y/o sanguinolenta con o sin mal olor, escucha sonidos como pititos, soplidos del viento, sonido del mar ocufenos, tinnitus mareos, vértigo, nauseas, rinitis alérgica parolisis facial, adormecimiento de hemicoro, tumores del sistema nerviosos central.",
    campos: [
      ["p1_cual", "¿Cuál?"],
      ["p1_cuando", "¿Cuándo?"],
      ["p1_quehizo", "¿Qué Hizo?"],
    ],
  },
  { n: 2, texto: "2.- Ha realizado viaje o ha llegado de viaje en las 16 horas anteriores a esta entrevista y examen." },
  { n: 3, texto: "3.- Ha estado escuchando música con audífonos en las 16 horas anteriores a esta entrevista o examen." },
  { n: 4, texto: "4.- Se ha desplazado y/o movilizado en moto lineal y/o en vehículo con las ventanas abiertas." },
  { n: 5, texto: "5.- Ha trabajado expuesto a ruido y/o vibraciones en las 16 horas anteriores a esta entrevista y examen." },
  { n: 6, texto: "6.- Ha bebido bebidas alcohólicas y/o fumó cigarrillos en las 16 horas anteriores a esta entrevista y examen." },
  { n: 7, texto: "7.- Ha estado despierto o trabajando en turno de noche 16 horas anteriores a esta entrevista y examen." },
  { n: 8, texto: "8.- ¿Está resfriado con tos, con dolor auricular, fiebre y/u otra enfermedad respiratoria aguda." },
  {
    n: 9,
    texto: "9.- ¿Le han practicado cirugía de oído (timpanoplastía, mastoidectomía, estopediectomía)?",
    campos: [
      ["p9_cual", "¿Cuál?"],
      ["p9_donde", "¿Dónde lo diagnosticaron?"],
      ["p9_quehizo", "¿Qué Hizo?"],
    ],
  },
  {
    n: 10,
    texto: "10.- ¿Ha tenido traumatismo craneoencefálico traumatismo en el oído?",
    campos: [
      ["p10_cual", "¿Cuál?"],
      ["p10_donde", "¿Dónde?"],
      ["p10_quehizo", "¿Qué Hizo?"],
    ],
  },
  {
    n: 11,
    texto:
      "11.- ¿Ha consumido o consume medicamentos como: Clipatino, aminoglucósidos (bancomicina y amikacina) aspirina, furosemida y/o antituberculosos?",
    campos: [
      ["p11_cual", "¿Cuál?"],
      ["p11_tiempo", "¿Por cuanto tiempo?"],
    ],
  },
  {
    n: 12,
    texto:
      "12.- ¿Ha estado expuesto a solventes orgánicos (tolveno, xileno, disulfuro de carbono, plomo, mercurio, monóxido de carbono) plaguicidas, organofosforados y piretroides?",
    campos: [
      ["p12_cual", "¿Cuál?"],
      ["p12_tiempo", "¿Por cuanto tiempo?"],
    ],
  },
  {
    n: 13,
    texto: "13.- ¿Ha estado expuesto a vibraciones continuas?",
    campos: [
      ["p13_tiempo", "¿Cuánto tiempo?"],
      ["p13_cuando", "¿Cuándo?"],
      ["p13_donde", "¿Dónde?"],
    ],
  },
  {
    n: 14,
    texto:
      "14.- ¿Sufre de: hipertensión arterial diabetes mellitus, hipotiroidismo, insuficiencia renal crónica, enfermedades autoinmunes?",
    campos: [
      ["p14_cual", "¿Cuál?"],
      ["p14_donde", "¿Dónde lo diagnosticaron?"],
      ["p14_quehizo", "¿Qué hizo?"],
    ],
  },
  {
    n: 15,
    texto: "15.- ¿Consume cigarrillos?",
    campos: [["p15_cuantos", "¿Cuántos por mes?"]],
  },
];

// Pregunta 16: actividades (casilla + cuánto tiempo)
const ACTIVIDADES = [
  { name: "p16_caza", label: "Caza", tiempo: "p16_caza_tiempo" },
  { name: "p16_tiro", label: "Tiro al blanco", tiempo: "p16_tiro_tiempo" },
  { name: "p16_discoteca", label: "Concurrencia frecuente a discotecas y/o bares", tiempo: "p16_discoteca_tiempo" },
  { name: "p16_auriculares", label: "Uso de auriculares", tiempo: "p16_auriculares_tiempo" },
  { name: "p16_servicio", label: "Servicio militar", tiempo: "p16_servicio_tiempo" },
  { name: "p16_boxeo", label: "Boxeo", tiempo: "p16_boxeo_tiempo" },
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  ...PREGUNTAS.flatMap(({ n, campos = [] }) => [`p${n}`, ...campos.map(([name]) => name)]),
  ...ACTIVIDADES.flatMap(({ name, tiempo }) => [name, tiempo]),
  "user_medicoFirma",
  "nombre_medico",
];

// Con `nOrdenInicial` el formulario va incrustado (p. ej. Auditoría de Protocolos): carga esa orden al abrir,
// bloquea el N° Orden y avisa con `onGuardado` al registrar o actualizar el cuestionario.
export default function AudiometriaCuestionario({ nOrdenInicial, onGuardado }) {
  const embebido = Boolean(nOrdenInicial);
  const today = getToday();
  const { token, userlogued, selectedSede, userName } = useSessionData();

  const initialFormState = {
    norden: embebido ? String(nOrdenInicial) : "",
    codCuestionario: null,
    fecha: today,
    nombres: "",
    dni: "",
    edad: "",

    genero: "",

    // Preguntas del cuestionario
    p1: "NO",
    p2: "NO",
    p3: "NO",
    p4: "NO",
    p5: "NO",
    p6: "NO",
    p7: "NO",
    p8: "NO",
    p9: "NO",
    p10: "NO",
    p11: "NO",
    p12: "NO",
    p13: "NO",
    p14: "NO",
    p15: "NO",
    // Campos condicionales
    p1_cual: "",
    p1_cuando: "",
    p1_quehizo: "",
    p9_cual: "",
    p9_donde: "",
    p9_quehizo: "",
    p10_cual: "",
    p10_donde: "",
    p10_quehizo: "",
    p11_cual: "",
    p11_tiempo: "",
    p12_cual: "",
    p12_tiempo: "",
    p13_tiempo: "",
    p13_cuando: "",
    p13_donde: "",
    p14_cual: "",
    p14_donde: "",
    p14_quehizo: "",
    p15_cuantos: "",
    // Pregunta 16 (todas en false por defecto)
    p16_caza: false,
    p16_caza_tiempo: "",
    p16_tiro: false,
    p16_tiro_tiempo: "",
    p16_discoteca: false,
    p16_discoteca_tiempo: "",
    p16_auriculares: false,
    p16_auriculares_tiempo: "",
    p16_servicio: false,
    p16_servicio_tiempo: "",
    p16_boxeo: false,
    p16_boxeo_tiempo: "",
    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
  };

  const {
    form,
    setForm,
    handleChangeSimple,
    handleChangeNumber,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
    handleChangeNumberDecimals,
  } = useForm(initialFormState, { storageKey: embebido ? undefined : "cuestionarioAudiometria" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  // Resaltado + botón de revertir de un campo; `grupo` revierte además los campos que dependen de él
  const revertible = (campo, grupo = [campo]) => ({
    edited: isFieldEdited(campo),
    onRevert: () => revertFields(grupo),
  });

  // Incrustado no se limpia el formulario al registrar: se avisa para que el contenedor muestre el nuevo estado
  const alRegistrar = embebido ? () => onGuardado?.() : handleClear;

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, alRegistrar, tabla);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, alRegistrar, tabla);
  };

  // Incrustado: abre la orden recibida (datos del paciente si aún no hay cuestionario; si ya existe, sus respuestas)
  useEffect(() => {
    if (embebido) {
      VerifyTR(String(nOrdenInicial), tabla, token, setForm, selectedSede, { silencioso: true });
    }
  }, [embebido, nOrdenInicial, selectedSede, token, setForm]);

  // ===== Búsqueda con boton =====
  const executeSearch = () => {
    handleClearnotO();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres || form.dni);

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.dni || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  // ===== Impresión =====
  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
    });
  };

  // Al marcar NO se limpian las respuestas que dependen de la pregunta
  const cambiarRespuesta = (pregunta) => (e, value) => {
    const limpiar = value === "NO" ? Object.fromEntries((pregunta.campos ?? []).map(([name]) => [name, ""])) : {};
    setForm((f) => ({ ...f, [`p${pregunta.n}`]: value, ...limpiar }));
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div className={embebido ? "space-y-3 px-4" : "space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto"}>
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
        mostrarLimpiar={!embebido}
      />

      {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
      <SectionFieldset legend="Cuestionario de Audiometría" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
            disabled={embebido || hayRegistroCargado}
            labelWidth="120px"
            className="w-full"
          />
          {!embebido && <SearchButton onClick={executeSearch} className="lg:hidden" />}
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...revertible("fecha")}
        />
        <InputTextOneLine label="Nombres" name="nombres" value={form.nombres} disabled labelWidth="120px" />
        <InputTextOneLine label="DNI" name="dni" value={form.dni} disabled labelWidth="120px" />
        <InputTextOneLine label="Edad" name="edad" value={form.edad} disabled labelWidth="120px" />
        <InputsRadioGroup
          label="Género"
          name="genero"
          value={form.genero}
          options={[
            { label: "Masculino", value: "Masculino" },
            { label: "Femenino", value: "Femenino" },
          ]}
          onChange={() => { }}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: ANTECEDENTES MÉDICOS (PREGUNTAS 1 A 15) ===== */}
      <SectionFieldset legend="Antecedentes Médicos" className="space-y-4">
        {PREGUNTAS.map((pregunta) => {
          const campo = `p${pregunta.n}`;
          const contestada = form[campo] === "SI";
          const campos = pregunta.campos ?? [];
          return (
            <div key={pregunta.n} className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
              <div className={campos.length === 0 ? "flex flex-col md:flex-row md:items-center gap-x-4 gap-y-2 justify-between" : "space-y-2"}>
                <p className="mb-0 font-semibold">{pregunta.texto}</p>
                <InputsRadioGroup
                  name={campo}
                  value={form[campo]}
                  options={OPCIONES_SI_NO}
                  onChange={cambiarRespuesta(pregunta)}
                  disabled={camposDeshabilitados}
                  className="shrink-0"
                  {...revertible(campo, [campo, ...campos.map(([name]) => name)])}
                />
              </div>
              {campos.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 ml-4 border-l-2 border-gray-200 pl-4">
                  {campos.map(([name, label]) => (
                    <InputTextOneLine
                      key={name}
                      label={label}
                      name={name}
                      value={form[name]}
                      onChange={handleChangeSimple}
                      disabled={camposDeshabilitados || !contestada}
                      labelWidth="190px"
                      {...revertible(name)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </SectionFieldset>

      {/* ===== SECCIÓN: PREGUNTA 16 ===== */}
      <SectionFieldset legend="16.- ¿Ha realizado actividades de?" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        {ACTIVIDADES.map(({ name, label, tiempo }) => (
          <div key={name} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <InputCheckbox
              label={label}
              name={name}
              checked={form[name]}
              disabled={camposDeshabilitados}
              onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.checked, [tiempo]: "" }))}
            />
            <InputTextOneLine
              label="¿Cuánto tiempo?"
              name={tiempo}
              value={form[tiempo]}
              onChange={handleChangeSimple}
              disabled={camposDeshabilitados || !form[name]}
              labelWidth="120px"
              {...revertible(tiempo, [name, tiempo])}
            />
          </div>
        ))}
      </SectionFieldset>

      {/* ===== SECCIÓN: ASIGNACIÓN DE MÉDICO ===== */}
      <SectionFieldset legend="Asignación de Médico" className="w-full">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isMedicoEdited}
          onRevert={revertMedico}
        />
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

      {/* ===== BOTONES DE ACCIÓN ===== */}
      <BotonesForm
        form={form}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
        onNordenChange={handlePrintNordenChange}
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
        hideClear={embebido}
        hidePrint={embebido}
      />
    </div>
  );
}
