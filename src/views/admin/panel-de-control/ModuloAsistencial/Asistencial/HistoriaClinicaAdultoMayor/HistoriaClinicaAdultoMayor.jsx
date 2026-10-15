import {
  InputTextOneLine,
  InputTextArea,
  SectionFieldset,
  RadioTable
} from "../../../../../components/reusableComponents/ResusableComponents";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { DatosPersonalesLaborales } from "../../../../../components/templates/Templates";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { ConfirmarImpresion, EliminarVacuna, SubmitDataService, VerifyTR } from "./controllerHistoriaClinicaAdultoMayor";
import InmunizacionesAdultoMayor from "./InmunizacionesAdultoMayor";
import AntecedentesQuirurgicosAdultoMayor from "./AntecedentesQuirurgicosAdultoMayor";

// Campos propios que el usuario puede editar (para resaltar/revertir cambios). Los antecedentes
// personales/familiares y el bloque clínico (examen físico, diagnóstico…) vienen de OTROS módulos en
// solo lectura, y las vacunas nuevas son un borrador de filas: ninguno entra aquí.
const CAMPOS_EDITABLES = [
  "fecha_apertura_hcl",
  "religion",
  "raza",
  "procedencia",
  "familiar_responsable",
  "edad_familiar",
  "domicilio_telefono_familiar",
  "parentesco",
  "sexualmente_activo",
  "problema_sexualidad",
  "reaccion_adversa_medicamentos",
  "reaccion_adversa_medicamentos_cual",
  "medicamentos_uso_frecuente",
  "medicamentos_uso_frecuente_cual",
  "medicamentos_observacion",
  "spg_incontinencia_urinaria",
  "spg_estrenimiento",
  "spg_ulceras_presion",
  "spg_insomnio",
  "spg_inmovilizacion",
  "spg_confusion_aguda",
  "spg_vertigo",
  "spg_sincope",
  "spg_prostatismo",
  "spg_deprivacion_auditiva",
  "spg_deprivacion_visual",
  "spg_caidas",
  "spg_caidas_ultimo_ano",
  "spg_n_caidas",
  "spg_fracturas",
  "spg_sitio_anatomico",
  "examenFisico",
  "examenesAuxiliares",
  "diagnostico",
  "tratamiento",
  "seguimientoYControl",
  "observaciones",
  "user_medicoFirma",
  "nombre_medico",
];

const OPCIONES_SI_NO = [
  { value: "SI", label: "SI" },
  { value: "NO", label: "NO" },
];

// Antecedentes Personales: solo lectura (los entrega el backend desde Antecedentes Patológicos).
const soloLectura = (items) => items.map((item) => ({ ...item, disabled: true }));

const ANTECEDENTES_IZQUIERDA = soloLectura([
  { name: "ap_hipertension", label: "Hipertensión Arterial" },
  { name: "ap_diabetes", label: "Diabetes" },
  { name: "ap_obesidad", label: "Obesidad / Sobrepeso" },
  { name: "ap_infarto_cardiaco", label: "Infarto Cardiaco / ICC" },
  { name: "ap_acv", label: "ACV (derrame cerebral)" },
  { name: "ap_osteoporosis", label: "Osteoporosis" },
  { name: "ap_hospitalizacion", label: "Hospitalización Últ 3 años" },
  { name: "ap_transfusion", label: "Transfusión" },
  { name: "ap_interv_quirurgica", label: "Interv. Quirúrgica" },
  { name: "ap_accidentes", label: "Accidentes" },
  { name: "ap_cancer", label: "Cáncer" },
]);

const ANTECEDENTES_DERECHA = soloLectura([
  { name: "ap_tuberculosis", label: "Tuberculosis" },
  { name: "ap_its_vih", label: "ITS - VIH - SIDA" },
  { name: "ap_hepatitis_b", label: "Hepatitis B" },
  { name: "ap_malaria", label: "Malaria" },
  { name: "ap_osteoartrosis", label: "Osteoartrosis" },
  { name: "ap_glaucoma", label: "Glaucoma" },
  { name: "ap_convulsiones", label: "Convulsiones" },
  { name: "ap_depresion", label: "Depresión" },
  { name: "ap_riesgo_ocupacional", label: "Riesgo Ocupacional" },
  { name: "ap_mordedura_animales", label: "Mordedura de animales" },
]);

// Estos dos SÍ se registran en esta Historia Clínica.
const SEXUALIDAD = [
  { name: "sexualmente_activo", label: "Sexualmente Activo (a)" },
  { name: "problema_sexualidad", label: "Problema de Sexualidad" },
];

const MEDICAMENTOS = [
  { name: "reaccion_adversa_medicamentos", label: "Reacción Adversa a Medicamentos" },
  { name: "medicamentos_uso_frecuente", label: "Medicamentos de uso frecuente" },
];

const SINDROMES_IZQUIERDA = [
  { name: "spg_incontinencia_urinaria", label: "Incontinencia Urinaria" },
  { name: "spg_estrenimiento", label: "Estreñimiento" },
  { name: "spg_ulceras_presion", label: "Úlceras por presión" },
  { name: "spg_insomnio", label: "Insomnio" },
  { name: "spg_inmovilizacion", label: "Inmovilización" },
  { name: "spg_confusion_aguda", label: "Confusión Aguda (Delirio)" },
];

const SINDROMES_DERECHA = [
  { name: "spg_vertigo", label: "Vértigo" },
  { name: "spg_sincope", label: "Síncope" },
  { name: "spg_prostatismo", label: "Prostatismo" },
  { name: "spg_deprivacion_auditiva", label: "Deprivación Auditiva" },
  { name: "spg_deprivacion_visual", label: "Deprivación Visual" },
  { name: "spg_caidas", label: "Caídas" },
  { name: "spg_caidas_ultimo_ano", label: "Caídas en el último año" },
];

const VACUNA_VACIA = { vacuna: "", fecha: "" };

export default function HistoriaClinicaAdultoMayor() {
  const today = getToday();
  const { token, userlogued, userName, listaEmpleados, datosFooter } = useSessionData();

  const initialFormState = {
    // Control de edición + auditoría (useRegistroEditable / buildAuditoria)
    id: null,
    pacienteId: null,
    tieneRegistro: false,
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",

    // Datos Generales
    n_hcl: "",
    ticketImprimir: "",
    numeroHistoriaClinica: "",
    fecha_apertura_hcl: today,

    // Datos Personales (solo lectura: vienen del paciente)
    domicilio: "",
    telefono: "",
    grupo_sanguineo: "",
    // Datos Personales (propios, editables)
    religion: "",
    raza: "",
    procedencia: "",

    // Familiar o Cuidador Responsable
    familiar_responsable: "",
    edad_familiar: "",
    domicilio_telefono_familiar: "",
    parentesco: "",
    // Sin UI en este formulario, pero el backend los guarda en la misma fila: se reenvían sin cambios.
    antecedentesFamiliares: [],
    violenciaFamiliar: null,

    // Antecedentes Patológicos Familiares (solo lectura, ver AntecedentesPatologicos)
    padre: "",
    madre: "",
    hermanos: "",
    hijos: "",
    esposaConyuge: "",

    // Antecedentes Personales (solo lectura, ver AntecedentesPatologicos)
    ap_hipertension: undefined,
    ap_diabetes: undefined,
    ap_obesidad: undefined,
    ap_infarto_cardiaco: undefined,
    ap_acv: undefined,
    ap_osteoporosis: undefined,
    ap_hospitalizacion: undefined,
    ap_transfusion: undefined,
    ap_interv_quirurgica: undefined,
    ap_accidentes: undefined,
    ap_cancer: undefined,
    tipoCancer: "",
    ap_tuberculosis: undefined,
    ap_its_vih: undefined,
    ap_hepatitis_b: undefined,
    ap_malaria: undefined,
    ap_osteoartrosis: undefined,
    ap_glaucoma: undefined,
    ap_convulsiones: undefined,
    ap_depresion: undefined,
    ap_riesgo_ocupacional: undefined,
    ap_mordedura_animales: undefined,
    descripcionMordedura: "",

    // Antecedentes Quirúrgicos (solo lectura, ver AntecedentesPatologicos)
    quirurgicos: [],

    // Sexualidad (editable)
    sexualmente_activo: undefined,
    problema_sexualidad: undefined,

    // Medicamentos
    reaccion_adversa_medicamentos: undefined,
    reaccion_adversa_medicamentos_cual: "",
    medicamentos_uso_frecuente: undefined,
    medicamentos_uso_frecuente_cual: "",
    medicamentos_observacion: "",

    // Inmunizaciones: las registradas (solo lectura, con id) y las nuevas a enviar
    vacunas: [],
    vacunasNuevas: [{ ...VACUNA_VACIA }],

    // Síndromes y Problemas Geriátricos
    spg_incontinencia_urinaria: undefined,
    spg_estrenimiento: undefined,
    spg_ulceras_presion: undefined,
    spg_insomnio: undefined,
    spg_inmovilizacion: undefined,
    spg_confusion_aguda: undefined,
    spg_vertigo: undefined,
    spg_sincope: undefined,
    spg_prostatismo: undefined,
    spg_deprivacion_auditiva: undefined,
    spg_deprivacion_visual: undefined,
    spg_caidas: undefined,
    spg_caidas_ultimo_ano: undefined,
    spg_n_caidas: "",
    spg_fracturas: "",
    spg_sitio_anatomico: "",

    // Observaciones
    observaciones: "",

    // Examen / Diagnóstico (solo lectura, los entrega el backend)
    examenFisico: "",
    examenesAuxiliares: "",
    diagnostico: "",
    tratamiento: "",
    seguimientoYControl: "",

    // Médico que Certifica
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    // Campos de DatosPersonalesLaborales
    dni: "",
    nombres: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeSimple,
    handleChangeNumberDecimals,
    handleRadioButton,
    handleClear,
  } = useForm(initialFormState, { storageKey: "hc_adulto_mayor_ticket" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const hayRegistroCargado = Boolean(form.nombres || form.dni);

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, datosFooter);
  };

  const handlePrint = () => {
    ConfirmarImpresion(form.ticketImprimir, token, datosFooter);
  };

  // ===== Búsqueda con botón / enter =====
  const executeSearch = () => {
    const numeroTicket = form.n_hcl;
    setForm({ ...initialFormState, n_hcl: numeroTicket });
    VerifyTR(numeroTicket, token, setForm, today, listaEmpleados);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") executeSearch();
  };

  // ===== Inmunizaciones =====
  const handleChangeVacunaNueva = (index, campo, valor) => {
    setForm((f) => ({
      ...f,
      vacunasNuevas: f.vacunasNuevas.map((v, i) => (i === index ? { ...v, [campo]: valor } : v)),
    }));
  };

  const handleAgregarVacunaNueva = () => {
    setForm((f) => ({ ...f, vacunasNuevas: [...f.vacunasNuevas, { ...VACUNA_VACIA }] }));
  };

  const handleQuitarVacunaNueva = (index) => {
    setForm((f) => {
      const restantes = f.vacunasNuevas.filter((_, i) => i !== index);
      return { ...f, vacunasNuevas: restantes.length ? restantes : [{ ...VACUNA_VACIA }] };
    });
  };

  const handleEliminarVacuna = (idVacuna) => {
    EliminarVacuna(idVacuna, token, () => {
      setForm((f) => ({ ...f, vacunas: f.vacunas.filter((v) => v.id !== idVacuna) }));
    });
  };

  // El detalle de cáncer / mordedura (solo lectura) aparece justo debajo de su fila.
  const antecedentesIzquierda = ANTECEDENTES_IZQUIERDA.map((item) =>
    item.name === "ap_cancer" && form.ap_cancer === "SI"
      ? {
        ...item,
        extraContent: (
          <InputTextOneLine label="Tipo de Cáncer" name="tipoCancer" value={form.tipoCancer} disabled labelWidth="110px" />
        ),
      }
      : item
  );
  const antecedentesDerecha = ANTECEDENTES_DERECHA.map((item) =>
    item.name === "ap_mordedura_animales" && form.ap_mordedura_animales === "SI"
      ? {
        ...item,
        extraContent: (
          <InputTextOneLine label="Descripción mordedura" name="descripcionMordedura" value={form.descripcionMordedura} disabled labelWidth="160px" />
        ),
      }
      : item
  );

  // Props comunes de los RadioTable editables (bloqueo general + resaltado/revert por fila). La tabla
  // de Antecedentes Personales de la derecha mezcla filas de solo lectura con las de sexualidad: solo
  // las editables pueden resaltarse (las demás no tienen valor original guardado).
  const radioEditableProps = {
    form,
    handleRadioButton,
    options: OPCIONES_SI_NO,
    labelColumns: 6,
    stackOnMobile: true,
    disabled: camposDeshabilitados,
    isFieldEdited: (campo) => CAMPOS_EDITABLES.includes(campo) && isFieldEdited(campo),
    onRevert: revertField,
  };

  return (
    <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      {/* ===== SECCIÓN: DATOS GENERALES ===== */}
      <SectionFieldset legend="Datos Generales" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Ticket"
            name="n_hcl"
            value={form.n_hcl}
            onChange={handleChangeNumberDecimals}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            labelWidth="120px"
            className="w-full"
          />
          <SearchButton onClick={executeSearch} disabled={hayRegistroCargado} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha Apertura"
          name="fecha_apertura_hcl"
          type="date"
          value={form.fecha_apertura_hcl}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("fecha_apertura_hcl")}
          onRevert={() => revertField("fecha_apertura_hcl")}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="N° HCL"
          name="numeroHistoriaClinica"
          value={form.numeroHistoriaClinica}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} laborales={false} />

      {/* DatosPersonalesLaborales ya muestra una sección "Datos Personales": esta lleva los datos propios de la HC. */}
      <SectionFieldset legend="Datos Complementarios" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3" collapsible>
        <InputTextOneLine label="Domicilio" name="domicilio" value={form.domicilio} disabled labelWidth="120px" />
        <InputTextOneLine label="Teléfono" name="telefono" value={form.telefono} disabled labelWidth="120px" />
        <InputTextOneLine
          label="Religión"
          name="religion"
          value={form.religion}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("religion")}
          onRevert={() => revertField("religion")}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Raza"
          name="raza"
          value={form.raza}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("raza")}
          onRevert={() => revertField("raza")}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Procedencia"
          name="procedencia"
          value={form.procedencia}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("procedencia")}
          onRevert={() => revertField("procedencia")}
          labelWidth="120px"
        />
        <InputTextOneLine label="Grupo Sanguíneo" name="grupo_sanguineo" value={form.grupo_sanguineo} disabled labelWidth="120px" />
      </SectionFieldset>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 items-start">
        <SectionFieldset legend="Familiar o Cuidador Responsable" className="space-y-3">
          <InputTextOneLine
            label="Apellidos y Nombres"
            name="familiar_responsable"
            value={form.familiar_responsable}
            onChange={handleChange}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("familiar_responsable")}
            onRevert={() => revertField("familiar_responsable")}
            labelWidth="150px"
          />
          <InputTextOneLine
            label="Edad"
            name="edad_familiar"
            value={form.edad_familiar}
            onChange={handleChangeNumberDecimals}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("edad_familiar")}
            onRevert={() => revertField("edad_familiar")}
            labelWidth="150px"
          />
          <InputTextOneLine
            label="Domicilio / Teléfono"
            name="domicilio_telefono_familiar"
            value={form.domicilio_telefono_familiar}
            onChange={handleChange}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("domicilio_telefono_familiar")}
            onRevert={() => revertField("domicilio_telefono_familiar")}
            labelWidth="150px"
          />
          <InputTextOneLine
            label="Parentesco"
            name="parentesco"
            value={form.parentesco}
            onChange={handleChange}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("parentesco")}
            onRevert={() => revertField("parentesco")}
            labelWidth="150px"
          />
        </SectionFieldset>

        <SectionFieldset legend="Antecedentes Patológicos Familiares" collapsible className="grid grid-cols-1 gap-3">
          <InputTextOneLine label="Padre - Especifique" name="padre" value={form.padre} labelWidth="180px" disabled />
          <InputTextOneLine label="Madre - Especifique" name="madre" value={form.madre} labelWidth="180px" disabled />
          <InputTextOneLine label="Hermanos - Especifique" name="hermanos" value={form.hermanos} labelWidth="180px" disabled />
          <InputTextOneLine label="Hijos - Especifique" name="hijos" value={form.hijos} labelWidth="180px" disabled />
          <InputTextOneLine
            label="Esposa/Cónyuge - Especifique"
            name="esposaConyuge"
            value={form.esposaConyuge}
            labelWidth="180px"
            disabled
          />
        </SectionFieldset>
      </div>

      <SectionFieldset legend="Antecedentes Personales" className="space-y-3">
        <p className="text-sm italic text-gray-600">
          Solo lectura: se cargan desde Antecedentes Patológicos. Únicamente la sexualidad se registra aquí.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 items-start">
          <RadioTable
            items={antecedentesIzquierda}
            options={OPCIONES_SI_NO}
            labelColumns={6}
            stackOnMobile
            form={form}
            handleRadioButton={handleRadioButton}
            disabled
          />
          <RadioTable
            items={[...antecedentesDerecha, ...SEXUALIDAD]}
            {...radioEditableProps}
          />
        </div>
      </SectionFieldset>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 items-start">
        <SectionFieldset legend="Medicamentos" className="space-y-3">
          <RadioTable items={MEDICAMENTOS} {...radioEditableProps} />

          {form.reaccion_adversa_medicamentos === "SI" && (
            <InputTextArea
              label="¿Cuáles medicamentos genera reacción adversa?"
              name="reaccion_adversa_medicamentos_cual"
              value={form.reaccion_adversa_medicamentos_cual}
              onChange={handleChange}
              rows={2}
              disabled={camposDeshabilitados}
              edited={isFieldEdited("reaccion_adversa_medicamentos_cual")}
              onRevert={() => revertField("reaccion_adversa_medicamentos_cual")}
            />
          )}
          {form.medicamentos_uso_frecuente === "SI" && (
            <InputTextArea
              label="¿Cuáles medicamentos son de uso frecuente?"
              name="medicamentos_uso_frecuente_cual"
              value={form.medicamentos_uso_frecuente_cual}
              onChange={handleChange}
              rows={2}
              disabled={camposDeshabilitados}
              edited={isFieldEdited("medicamentos_uso_frecuente_cual")}
              onRevert={() => revertField("medicamentos_uso_frecuente_cual")}
            />
          )}

          <InputTextArea
            label="Dosis, tiempo de uso u otra observación"
            name="medicamentos_observacion"
            value={form.medicamentos_observacion}
            onChange={handleChange}
            rows={3}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("medicamentos_observacion")}
            onRevert={() => revertField("medicamentos_observacion")}
          />
        </SectionFieldset>

        <InmunizacionesAdultoMayor
          vacunas={form.vacunas}
          vacunasNuevas={form.vacunasNuevas}
          disabled={camposDeshabilitados}
          onChangeNueva={handleChangeVacunaNueva}
          onAgregar={handleAgregarVacunaNueva}
          onQuitar={handleQuitarVacunaNueva}
          onEliminar={handleEliminarVacuna}
        />
      </div>

      <AntecedentesQuirurgicosAdultoMayor quirurgicos={form.quirurgicos} />

      <SectionFieldset legend="Síndromes y Problemas Geriátricos" className="space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 items-start">
          <RadioTable items={SINDROMES_IZQUIERDA} {...radioEditableProps} />
          <RadioTable items={SINDROMES_DERECHA} {...radioEditableProps} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
          <InputTextOneLine
            label="N° de caídas"
            name="spg_n_caidas"
            value={form.spg_n_caidas}
            onChange={handleChangeNumberDecimals}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("spg_n_caidas")}
            onRevert={() => revertField("spg_n_caidas")}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fracturas"
            name="spg_fracturas"
            value={form.spg_fracturas}
            onChange={handleChange}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("spg_fracturas")}
            onRevert={() => revertField("spg_fracturas")}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Sitio Anatómico"
            name="spg_sitio_anatomico"
            value={form.spg_sitio_anatomico}
            onChange={handleChange}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("spg_sitio_anatomico")}
            onRevert={() => revertField("spg_sitio_anatomico")}
            labelWidth="120px"
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Observaciones">
        <InputTextArea
          name="observaciones"
          value={form.observaciones}
          onChange={handleChange}
          rows={4}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("observaciones")}
          onRevert={() => revertField("observaciones")}
        />
      </SectionFieldset>

      {/* Solo lectura: el backend los arma desde la consulta del paciente; no se guardan desde aquí. */}
      <SectionFieldset legend="Examen, Diagnóstico y Tratamiento (solo lectura)" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InputTextArea label="Examen Físico" name="examenFisico" onChange={handleChange} disabled={camposDeshabilitados} edited={isFieldEdited("examenFisico")} onRevert={() => revertField("examenFisico")} value={form.examenFisico} rows={3} />
        <InputTextArea label="Examenes Auxiliares" name="examenesAuxiliares" onChange={handleChange} disabled={camposDeshabilitados} edited={isFieldEdited("examenesAuxiliares")} onRevert={() => revertField("examenesAuxiliares")} value={form.examenesAuxiliares} rows={3} />
        <InputTextArea label="Diagnostico" name="diagnostico" onChange={handleChange} disabled={camposDeshabilitados} edited={isFieldEdited("diagnostico")} onRevert={() => revertField("diagnostico")} value={form.diagnostico} rows={3} />
        <InputTextArea label="Tratamiento" name="tratamiento" onChange={handleChange} disabled={camposDeshabilitados} edited={isFieldEdited("tratamiento")} onRevert={() => revertField("tratamiento")} value={form.tratamiento} rows={3} />
        <InputTextArea
          label="Seguimiento y Control"
          name="seguimientoYControl"
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("seguimientoYControl")}
          onRevert={() => revertField("seguimientoYControl")}
          value={form.seguimientoYControl}
          rows={3}
          className="lg:col-span-2"
        />
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico">
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
        handleSave={handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
        handlePrint={handlePrint}
        printField="ticketImprimir"
        printLabel="IMPRIMIR N° TICKET"
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}
