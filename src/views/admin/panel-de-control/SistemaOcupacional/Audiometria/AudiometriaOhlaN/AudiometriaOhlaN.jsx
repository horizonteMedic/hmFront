import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faFileAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";

import AudiometriaOhlaNParte1 from "./AudiometriaOhlaNParte1";
import AudiometriaOhlaNParte2 from "./AudiometriaOhlaNParte2";
import {
  VerifyTR,
  VerifyTRFicha,
  SubmitDataServiceAmbos,
  PrintHojaR,
  validarSedeOrden,
} from "../AudiometriaOhla/controllerAudiometriaOhla";

const TABLA_OHLA = "audiometria_po";
const TABLA_FICHA = "ficha_audiologica";

const frecuencias = ["500", "1000", "2000", "3000", "4000", "6000", "8000"];
const camposOido = (prefijo) => frecuencias.map((hz) => `${prefijo}_${hz}`);

// Campos que el usuario puede editar en cada parte (para resaltar/revertir cambios).
const CAMPOS_EDITABLES_OHLA = [
  "fecha",
  ...camposOido("od"),
  ...camposOido("oi"),
  ...camposOido("od_o"),
  ...camposOido("oi_o"),
  "diagnostico",
  "diagnosticoCie10",
];

const CAMPOS_EDITABLES_FICHA = [
  "fecha",
  "aniosTrabajo",
  "mesesTrabajo",
  "otoscopia",
  "noExamen",
  "bellPlus",
  "maico",
  "marca",
  "modelo",
  "calibracion",
  "tiempoExposicion",
  "tapones",
  "orejeras",
  "apreciacion_ruido",
  "consumo_tabaco",
  "servicio_militar",
  "hobbies_ruido",
  "exposicion_quimicos",
  "infeccion_oido",
  "uso_ototoxicos",
  "disminucion_audicion",
  "dolor_oidos",
  "zumbido",
  "mareos",
  "infeccion_oido_actual",
  "otro",
  "otroDescripcion",
  "conclusiones",
  "od_250",
  "od_500",
  "od_1000",
  "oi_250",
  "oi_500",
  "oi_1000",
  "d_umbral_discriminacion",
  "d_porcentaje",
  "d_umbral_confort",
  "d_umbral_disconfort",
  "i_umbral_discriminacion",
  "i_porcentaje",
  "i_umbral_confort",
  "i_umbral_disconfort",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
  "user_doctorExtra",
  "nombre_doctorExtra",
];

export default function AudiometriaOhlaN() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const [activeTab, setActiveTab] = useState(0);
  const [dataTabla, setDataTabla] = useState([]);
  const [errors, setErrors] = useState({});
  // Sube cada vez que se carga un registro desde la tabla (aunque sea el mismo), para volver a bloquear la edición
  const [cargaId, setCargaId] = useState(0);

  const initialFormStateOhla = {
    codAu: "",
    norden: "",
    fecha: today,
    fechaNac: "",
    nombres: "",
    edad: "",
    dni: "",
    empresa: "",
    contrata: "",
    nomExam: "",
    no_paso_Examen: false,
    activar_grafico: true,

    od_500: "",
    od_1000: "",
    od_2000: "",
    od_3000: "",
    od_4000: "",
    od_6000: "",
    od_8000: "",

    oi_500: "",
    oi_1000: "",
    oi_2000: "",
    oi_3000: "",
    oi_4000: "",
    oi_6000: "",
    oi_8000: "",

    od_o_500: "",
    od_o_1000: "",
    od_o_2000: "",
    od_o_3000: "",
    od_o_4000: "",
    od_o_6000: "",
    od_o_8000: "",

    llenar_osea: false,
    oi_o_500: "",
    oi_o_1000: "",
    oi_o_2000: "",
    oi_o_3000: "",
    oi_o_4000: "",
    oi_o_6000: "",
    oi_o_8000: "",

    perdida_global: "",
    asignar_especialista: false,

    nombres_search: "",
    codigo_search: "",
    diagnostico: "",
    diagnosticoCie10: "",

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
  };

  const initialFormStateFicha = {
    norden: "",
    codFa: "",
    fecha: today,
    nomExam: "",
    noExamen: false,

    nombres: "",
    edad: "",
    bellPlus: false,
    maico: false,

    genero: "",
    aniosTrabajo: "",
    mesesTrabajo: "",

    areaO: "",
    otoscopia: "",

    empresa: "",
    contrata: "",

    marca: "AMPLIVOX",
    modelo: "AMPLIVOX 270",
    calibracion: today,
    tiempoExposicion: "",
    tapones: false,
    orejeras: false,
    apreciacion_ruido: "RUIDO NO MOLESTO",

    consumo_tabaco: "NO",
    servicio_militar: "NO",
    hobbies_ruido: "NO",
    exposicion_quimicos: "NO",
    infeccion_oido: "NO",
    uso_ototoxicos: "NO",

    disminucion_audicion: "NO",
    dolor_oidos: "NO",
    zumbido: "NO",
    mareos: "NO",
    infeccion_oido_actual: "NO",
    otro: "NO",
    otroDescripcion: "",

    conclusiones: "",

    od_250: "",
    od_500: "",
    od_1000: "",

    oi_250: "",
    oi_500: "",
    oi_1000: "",

    d_umbral_discriminacion: "",
    d_porcentaje: "",
    d_umbral_confort: "",
    d_umbral_disconfort: "",

    i_umbral_discriminacion: "",
    i_porcentaje: "",
    i_umbral_confort: "",
    i_umbral_disconfort: "",

    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

    nombre_doctorExtra: "",
    user_doctorExtra: "",

    // Control de UI: false = registro nuevo / true = ya existe
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
  };

  const { form: formOhla, setForm: setFormOhla, handleClear: handleClearOhla } = useForm(initialFormStateOhla, {
    storageKey: "audiometriaOhlaN",
  });
  const { form: formFicha, setForm: setFormFicha, handleClear: handleClearFicha } = useForm(initialFormStateFicha, {
    storageKey: "audiometriaOhlaNFicha",
  });

  // OHLA y Ficha son dos registros del mismo examen: cada uno tiene su propio bloqueo/revert, pero
  // "Habilitar edición" los habilita a la vez.
  const editOhla = useRegistroEditable(formOhla, setFormOhla, {
    tieneRegistro: formOhla.tieneRegistro,
    camposEditables: CAMPOS_EDITABLES_OHLA,
    resetKey: cargaId,
  });
  const editFicha = useRegistroEditable(formFicha, setFormFicha, {
    tieneRegistro: formFicha.tieneRegistro,
    camposEditables: CAMPOS_EDITABLES_FICHA,
    resetKey: cargaId,
  });

  const tieneRegistro = formOhla.tieneRegistro || formFicha.tieneRegistro;
  const edicionHabilitada = editOhla.edicionHabilitada || editFicha.edicionHabilitada;
  const habilitarEdicion = () => {
    editOhla.habilitarEdicion();
    editFicha.habilitarEdicion();
  };
  // Si cualquiera de los dos registros ya existe, ambas partes se bloquean juntas hasta "Habilitar edición"
  // (por ejemplo, OHLA existente con Ficha aún nueva).
  const bloqueado = tieneRegistro && !edicionHabilitada;

  const handleClear = () => {
    setErrors({});
    handleClearOhla();
    handleClearFicha();
  };

  const handleClearnotOOhla = () => {
    setFormOhla((prev) => ({ ...initialFormStateOhla, norden: prev.norden, fecha: prev.fecha }));
  };
  const handleClearnotOFicha = () => {
    setFormFicha((prev) => ({ ...initialFormStateFicha, norden: prev.norden, fecha: prev.fecha }));
  };

  const handleChangeNorden = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      setFormOhla((f) => ({ ...f, norden: value }));
      setFormFicha((f) => ({ ...f, norden: value }));
    }
  };

  const handleChangeFecha = (e) => {
    const { value } = e.target;
    setFormOhla((f) => ({ ...f, fecha: value }));
    setFormFicha((f) => ({ ...f, fecha: value }));
  };

  // ===== Búsqueda =====
  const executeSearch = async () => {
    setErrors({});
    if (!(await validarSedeOrden(formOhla.norden, selectedSede, token))) return;
    handleClearnotOOhla();
    handleClearnotOFicha();

    // Se ejecutan en secuencia porque ambas comparten el mismo modal de
    // SweetAlert2 y porque OHLA y Ficha están conectadas: si el paciente ya
    // tiene Audiometría (Normal), se bloquean ambas con una sola alerta
    // (se reutiliza el resultado de VerifyTR).
    const resultado = await VerifyTR(formOhla.norden, TABLA_OHLA, token, setFormOhla, selectedSede);
    await VerifyTRFicha(
      formOhla.norden,
      TABLA_FICHA,
      token,
      setFormFicha,
      selectedSede,
      () => { },
      resultado
    );
  };

  const handleSearch = (e) => {
    if (!e || e.key === "Enter") executeSearch();
  };

  const hayRegistroCargado = Boolean(formOhla.nombres || formOhla.dni || formFicha.nombres);

  // El error del N° Orden se muestra solo tras intentar guardar y se limpia cuando ya hay un paciente cargado.
  const ordenError = errors.norden && !hayRegistroCargado ? errors.norden : "";

  const handleSave = () => {
    if (!hayRegistroCargado) {
      setErrors({ norden: "Busque el N° de orden para cargar los datos del paciente." });
      return;
    }
    setErrors({});
    SubmitDataServiceAmbos(
      formOhla,
      formFicha,
      token,
      userlogued,
      handleClearOhla,
      handleClearFicha,
      formOhla.activar_grafico,
      formOhla.asignar_especialista
    );
  };

  const handlePrint = () => {
    if (!formOhla.norden) {
      Swal.fire("Error", "Debe colocar un N° Orden", "error");
      return;
    }
    Swal.fire({
      title: "¿Desea Imprimir Audiometría OHLA N?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${formOhla.norden}</b></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(
          formOhla.norden,
          token,
          TABLA_OHLA,
          formOhla.activar_grafico,
          formOhla.asignar_especialista
        );
      }
    });
  };

  const tabs = [
    { id: 0, label: "Parte 1", icon: faHeadphones },
    { id: 1, label: "Parte 2", icon: faFileAlt },
  ];

  const handleChangeMedico = (e) => {
    const { name, value } = e.target;
    setFormFicha((f) => ({ ...f, [name]: value }));
  };

  // Cada médico se compone de 2 campos (id + nombre): se detecta el cambio por el id y se revierten en conjunto.
  const medicos = [
    { label: "Profesional que Realiza la Audiometría", nombre: "nombre_medico", id: "user_medicoFirma" },
    { label: "Doctor Asignado", nombre: "nombre_doctorAsignado", id: "user_doctorAsignado" },
    { label: "Doctor Extra", nombre: "nombre_doctorExtra", id: "user_doctorExtra" },
  ];

  // Adaptador: DatosPersonalesLaborales espera nombres de campo propios del
  // formulario legado de Audiometría, pero formOhla se llena desde dos
  // endpoints distintos que devuelven claves distintas para lo mismo:
  //  - Paciente nuevo (infoPersonalPaciente/busquedaPorFiltros): genero, areaO, cargo
  //  - Registro OHLA existente (obtenerInformacionAudiometriaPo): sexo, areaTrabajo, ocupacion
  // Se soportan ambas variantes con fallback (ver jaspers/Audiometria/Audiometria/Audiometria2021-_Digitalizado.jsx).
  const sexoRaw = formOhla.sexo ?? formOhla.genero ?? "";
  const sexoNormalizado =
    sexoRaw === "M" || sexoRaw === "Masculino" || sexoRaw === "MASCULINO"
      ? "MASCULINO"
      : sexoRaw === "F" || sexoRaw === "Femenino" || sexoRaw === "FEMENINO"
        ? "FEMENINO"
        : sexoRaw;

  const datosPacienteForm = {
    nombres: formOhla.nombres,
    edad: formOhla.edad,
    sexo: sexoNormalizado,
    dni: formOhla.dni,
    fechaNacimiento: formOhla.fechaNac,
    lugarNacimiento: formOhla.lugarNacimiento,
    estadoCivil: formOhla.estadoCivil,
    nivelEstudios: formOhla.nivelEstudio ?? formOhla.nivelEstudios,
    empresa: formOhla.empresa,
    contrata: formOhla.contrata,
    ocupacion: formOhla.ocupacion,
    cargoDesempenar: formOhla.cargo,
  };

  // La Ficha es la que devuelve el usuario que registró; si solo existe OHLA se usa ese registro.
  const auditoria = buildAuditoria(formFicha.tieneRegistro ? formFicha : formOhla, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto pb-6">
      <AccionesRegistroHeader
        tieneRegistro={tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      {/* Encabezado compartido: N° Orden, Fecha y datos del paciente (único) */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={formOhla.norden}
            onChange={handleChangeNorden}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            labelWidth="100px"
            className="w-full"
            error={ordenError}
          />
          <SearchButton onClick={executeSearch} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={formOhla.fecha}
          onChange={handleChangeFecha}
          disabled={bloqueado}
          labelWidth="100px"
          edited={editOhla.isFieldEdited("fecha") || editFicha.isFieldEdited("fecha")}
          onRevert={() => {
            editOhla.revertField("fecha");
            editFicha.revertField("fecha");
          }}
        />
        <InputTextOneLine
          label="Ex. Médico"
          name="nomExam"
          value={formOhla.nomExam}
          disabled
          labelWidth="100px"
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={datosPacienteForm} />

      {/* Pestañas Parte 1 / Parte 2 */}
      <div className="bg-primarioClaro border rounded">
        <nav className="flex overflow-x-auto scrollbar-tabs bg-white border-b border-gray-200 rounded-t">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`shrink-0 whitespace-nowrap flex-1 px-4 py-3 uppercase tracking-wider text-[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeTab === tab.id
                ? "border-[#233245] text-[#233245] font-semibold"
                : "border-transparent"
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4">
          {activeTab === 0 && (
            <AudiometriaOhlaNParte1
              token={token}
              form={formOhla}
              setForm={setFormOhla}
              setFormFicha={setFormFicha}
              handleClearFicha={handleClearFicha}
              handleClear={handleClearOhla}
              dataTabla={dataTabla}
              setDataTabla={setDataTabla}
              disabled={bloqueado}
              isFieldEdited={editOhla.isFieldEdited}
              revertFields={editOhla.revertFields}
              onCargarRegistro={() => setCargaId((id) => id + 1)}
            />
          )}
          {activeTab === 1 && (
            <AudiometriaOhlaNParte2
              form={formFicha}
              setForm={setFormFicha}
              disabled={bloqueado}
              isFieldEdited={editFicha.isFieldEdited}
              revertField={editFicha.revertField}
              revertFields={editFicha.revertFields}
            />
          )}
        </div>
      </div>

      {/* Asignación de firmas: compartida, fuera de los tabs */}
      <SectionFieldset legend="Asignación de Médico" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {medicos.map(({ label, nombre, id }) => (
          <EmpleadoComboBox
            key={id}
            value={formFicha[nombre]}
            label={label}
            form={formFicha}
            onChange={handleChangeMedico}
            {...(id === "user_medicoFirma" ? {} : { nameField: nombre, idField: id })}
            disabled={bloqueado}
            edited={editFicha.isFieldEdited(id)}
            onRevert={() => editFicha.revertFields([id, nombre])}
          />
        ))}
      </SectionFieldset>

      {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
      {hayRegistroCargado && (
        <AuditoriaRegistro
          mostrarEdicion={tieneRegistro}
          fechaCreacion={auditoria.fechaCreacion}
          fechaEdicion={auditoria.fechaActualizacion}
          usuarioRegistro={auditoria.usuarioRegistro}
          usuarioEdicion={auditoria.usuarioActualizacion}
        />
      )}

      {/* ===== BOTONES DE ACCIÓN ===== */}
      {/* Guardar está en la Parte 2: guarda OHLA y Ficha juntas */}
      <BotonesForm
        form={formOhla}
        handleChangeNumberDecimals={handleChangeNorden}
        handleSave={handleSave}
        saveLabel={tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={activeTab === 0 || (tieneRegistro && !edicionHabilitada)}
        hideEdit={!tieneRegistro || edicionHabilitada}
      >
        {activeTab === 0 && (
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className="
              bg-[#233245] hover:bg-[#1a2531]
              text-white text-base px-6 py-2 rounded
              flex items-center gap-2
              transition-all duration-150 ease-out
              hover:shadow-lg
              active:scale-95 active:shadow-inner"
          >
            Siguiente <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </BotonesForm>
    </div>
  );
}
