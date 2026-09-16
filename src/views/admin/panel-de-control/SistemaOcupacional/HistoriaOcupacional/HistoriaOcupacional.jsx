import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import AutoResizeInput from "./Inputs";
import {
  handleSearch,
  handleSelect,
  PrintHojaR,
  SubmiteHistoriaOcupacionalController,
  VerifyTR,
} from "./controller/controllerHO";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import RevertButton from "../../../../components/reusableComponents/RevertButton";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";

const today = getToday();
const tabla = "historia_oc_info";

// Estilos de la tabla de experiencia ocupacional (antes en HistoriaOcupacional.module.css).
// Se aplican a <th>/<td> con variantes arbitrarias para no depender de una hoja CSS.
const historiaTableClass = [
  "w-full border-collapse bg-white",
  // Celdas (th + td): borde gris, padding en em y alineación a la izquierda.
  "[&_th]:border [&_th]:border-gray-300 [&_th]:px-[0.7em] [&_th]:py-[0.5em] [&_th]:text-left",
  "[&_td]:border [&_td]:border-gray-300 [&_td]:px-[0.7em] [&_td]:py-[0.5em] [&_td]:text-left",
  // Encabezados: fondo gris, negrita, color primario y borde inferior grueso.
  "[&_th]:bg-gray-100 [&_th]:font-bold [&_th]:text-primario [&_th]:tracking-[0.2px] [&_th]:border-b-[2.5px] [&_th]:border-b-primario",
  // Primera columna (Año): ancho acotado y centrada.
  "[&_th:first-child]:w-[70px] [&_th:first-child]:min-w-[60px] [&_th:first-child]:max-w-[90px] [&_th:first-child]:text-center",
  "[&_td:first-child]:w-[70px] [&_td:first-child]:min-w-[60px] [&_td:first-child]:max-w-[90px] [&_td:first-child]:text-center",
].join(" ");

// Campos propios del formulario que el usuario puede editar en un registro existente
// (para resaltar/revertir cambios). Los detalles de experiencia ocupacional se
// gestionan aparte en su propia tabla.
const CAMPOS_EDITABLES = ["fecha", "user_medicoFirma", "nombre_medico"];

// Campos de una fila de experiencia ocupacional que, al diferir de su valor
// original, marcan esa fila como editada (sombreado naranja) y son los que
// `revertRow` restaura.
const CAMPOS_FILA = [
  "fecha",
  "empresa",
  "altitud",
  "actividad",
  "areaEmpresa",
  "ocupacion",
  "superficie",
  "socavon",
  "riesgo",
  "proteccion",
  "causaRetiro",
];

// Fila vacía de la tabla de experiencia ocupacional.
const EMPTY_ROW = {
  historiaDetalleId: null,
  fecha: "",
  empresa: "",
  altitud: "",
  actividad: "",
  areaEmpresa: "",
  ocupacion: "",
  superficie: "",
  socavon: "",
  riesgo: "",
  proteccion: "",
  causaRetiro: "",
};

const riesgosOptions = [
  {
    id: 1,
    title: "INTERIOR MINA",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTO REPETITIVOS, ALTAS TEMPERATURAS, HUMEDAD, POLVO, EXPLOSIONES, APLASTAMIENTOS, DESCARGAS ELECTRICAS,INTOXICACION POR GASES, GOLPE, CAIDAS, RUIDO",
  },
  {
    id: 2,
    title: "MINA (SUPERFICIE O TAJO ABIERTO)",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, HUMEDAD, INSOLACION",
  },
  {
    id: 3,
    title: "COCINA (COCINEROS O AYUDANTES DE COCINA)",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, QUEMADURAS, VAPORES ORGANICOS Y QUIMICOS, CORTES, CAIDAS",
  },
  {
    id: 4,
    title: "ALMACEN",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, DERRUMBAMIENTO DE OBJETOS, QUEMADURAS, CORTES, CAIDAS DE ALTURA DE 1.80M, FRACTURAS",
  },
  {
    id: 5,
    title: "SOLDADOR",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, QUEMADURAS, DESCARGAS ELECTRICAS, ELECTROCUCION, GOLPES, CORTES, CAIDAS SOBRE 1.8 M, RUIDO",
  },
  {
    id: 6,
    title: "OPERADOR DE EQUIPO PESADO",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, VIBRACIONES, RUIDO, ESFUERZO VISUAL, INSOLACION, RUIDO",
  },
  {
    id: 7,
    title: "VALLIJERO",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, HUMEDAD, DERMATITIS",
  },
  {
    id: 8,
    title: "AZAFATA",
    mensaje: "MOV. Y POSICIONES DISERGONOMICAS, TENDINITIS",
  },
  {
    id: 9,
    title: "MANEJO MANUAL DE CARGOS",
    mensaje: "MANEJO MANUAL DE CARGOS",
  },
  {
    id: 10,
    title: "RIESGOS CONDUCTORES",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, CHOQUES,VOLCADOS, VIBRACIONESBAJAS,CAIDA DE ROCAS, BAJAS TEMPERATURAS,RUIDO, POLVO",
  },
  {
    id: 11,
    title: "RIESGOS OBREROS",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS, BAJAS TEMPERATURAS,INSOLACIÓN,GOLPES,CAIDAS,RUIDO",
  },
  {
    id: 12,
    title: "RIES. MECANICOS",
    mensaje:
      "MOV. Y POSICIONES DISERGONOMICAS,QUEMADURAS,CORTES,DESCARGAS ELECTRICAS,RUIDO",
  },
  {
    id: 13,
    title: "RIESGO ADMINISTRATIVO",
    mensaje: "MOV. Y POSICIONES DISERGONOMICAS",
  },
];

const proteccionOptions = [
  {
    id: 1,
    mensaje:
      "CASCO,LENTES,TAPONES AUDITIVOS,RESPIRADOR,CHALECO DE SEGURIDAD, OVERALL, GUANTES,ZAPATOS DE SEGURIDAD",
  },
  { id: 2, mensaje: "MANDIL, MANDILON" },
  { id: 3, mensaje: "CHALECO ANTIBALAS" },
  {
    id: 4,
    mensaje: "EPPS BASICOS : CASCO, LENTES, GUANTES,OVERAL,ZAPATOS DE SEGURIDAD",
  },
  {
    id: 5,
    mensaje:
      "EPPS COMPLETO : CASCO, LENTES, GUANTES,TAPONES AUDITIVOS,RESPIRADOR, OREJERAS,ZAPATOS DE SEGURIDAD",
  },
  { id: 6, mensaje: "NINGUNO" },
  {
    id: 7,
    mensaje:
      "GORRO, POLO MANGA LARGA, PROTECCIÓN SOLAR, GUANTES, TYVEK, GUANTES DE NITRILO, BOTAS CAÑA ALTA, MASCARILLAS N95",
  },
];

const HistoriaOcupacional = ({ listas }) => {
  const { token, userlogued, selectedSede, userName, userDNI } = useSessionData();

  const initialFormState = {
    // Header
    norden: "",
    codHo: null,
    fecha: today,
    eliminados: [],
    // Datos personales
    nombres: "",
    dni: "",
    edad: "",
    sexo: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    estadoCivil: "",
    nivelEstudios: "",
    // Datos laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",
    // Área de trabajo (campo propio de Historia Ocupacional)
    areaO: "",
    // Responsable (usuario en sesión)
    dniUser: userDNI,
    nombreUser: userName,
    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
    // Control de UI: false = registro nuevo / true = registro existente
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
  } = useForm(initialFormState);

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, {
    tieneRegistro: form.tieneRegistro,
    camposEditables: CAMPOS_EDITABLES,
  });

  const [rowData, setRowData] = useState(EMPTY_ROW);
  const [registros, setRegistros] = useState([]);
  // true mientras se está completando la fila nueva (primera fila, sombreado verde).
  const [addingNew, setAddingNew] = useState(false);

  // Id incremental para identificar cada fila de forma estable, independiente
  // de su posición (que cambia al ordenar por año).
  const uidCounterRef = useRef(0);
  const generateUid = () => {
    uidCounterRef.current += 1;
    return `fila-${uidCounterRef.current}`;
  };

  // Envuelve el setter de registros que reciben las cargas desde el servidor
  // (búsqueda por N° Orden) para anotar cada fila con su snapshot original:
  // así se puede detectar si el usuario la editó (sombreado naranja) y revertirla.
  const setRegistrosFromServer = (data) => {
    setRegistros(
      (data || []).map((reg) => ({
        ...reg,
        _uid: generateUid(),
        _isNew: false,
        _original: { ...reg },
      }))
    );
  };

  // AUTOCOMPLETABLES
  const [searchEmpresa, setSearchEmpresa] = useState("");
  const [searchCargoOcupacion, setSearchCargoOcupacion] = useState("");
  const [searchAltitud, setSearchAltitud] = useState("");
  const [searchArea, setSearchArea] = useState("");
  const [searchRiesgo, setSearchRiesgo] = useState("");
  const [searchProt, setSearchProt] = useState("");

  const [filteredEmpresa, setFilteredEmpresa] = useState([]);
  const [filteredCargoOcupacion, setFilteredCargoOcupacion] = useState([]);
  const [filteredAltitud, setFilteredAltitud] = useState([]);
  const [filteredArea, setFilteredArea] = useState([]);
  const [filteredRiesgo, setFilteredRiesgo] = useState([]);
  const [filteredProt, setFilteredProt] = useState([]);
  const [filteredActividad, setFilteredActividad] = useState([]);
  const [filteredSuperficie, setFilteredSuperficie] = useState([]);
  const [filteredSocavon, setFilteredSocavon] = useState([]);

  const empresaRef = useRef(null);
  const altitudRef = useRef(null);
  const actividadRef = useRef(null);
  const areaRef = useRef(null);
  const ocupacionRef = useRef(null);
  const socavonRef = useRef(null);
  const superficieRef = useRef(null);
  const riesgoRef = useRef(null);
  const protRef = useRef(null);

  const autoResize = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => autoResize(empresaRef), [searchEmpresa]);
  useEffect(() => autoResize(altitudRef), [searchAltitud]);
  useEffect(() => autoResize(actividadRef), [rowData.actividad]);
  useEffect(() => autoResize(areaRef), [searchArea]);
  useEffect(() => autoResize(ocupacionRef), [searchCargoOcupacion]);
  useEffect(() => autoResize(socavonRef), [rowData.socavon]);
  useEffect(() => autoResize(superficieRef), [rowData.superficie]);
  useEffect(() => autoResize(riesgoRef), [searchRiesgo]);
  useEffect(() => autoResize(protRef), [searchProt]);

  // listas
  const { EmpresasMulti, AlturaMulti, AreaMulti, CargosMulti } = listas;
  const ActividadMulti = [
    { id: 1, mensaje: "AGROINDUSTRIA" },
    { id: 2, mensaje: "METAL MECÁNICA" },
    { id: 3, mensaje: "CONSTRUCCIÓN" },
    { id: 4, mensaje: "RETAIL" },
    { id: 5, mensaje: "PETRÓLEO" },
  ];

  const handleRowChange = (field, value) => {
    const numero = Number(value); // solo para lógica de control

    if (field === "empresa") {
      const empresaUpper = value.toUpperCase();
      if (empresaUpper.includes("GREEN PERU")) {
        setSearchAltitud("34 M.S.N.M.");
        setSearchArea("CAMPO");
        setSearchCargoOcupacion("AYUDANTE");
        setSearchRiesgo(
          "MOV. Y POSICIONES DISERGONOMICAS, BAJAS TEMPERATURAS,INSOLACIÓN,GOLPES,CAIDAS,RUIDO"
        );
        setSearchProt(
          "GORRO, POLO MANGA LARGA, PROTECCIÓN SOLAR, GUANTES, TYVEK, GUANTES DE NITRILO, BOTAS CAÑA ALTA, MASCARILLAS N95"
        );
        setRowData((prev) => ({
          ...prev,
          empresa: value,
          altitud: "34 M.S.N.M.",
          actividad: "AGROINDUSTRIA",
          areaEmpresa: "CAMPO",
          ocupacion: "AYUDANTE",
          socavon: "0",
          superficie: "AÑOS",
          riesgo:
            "MOV. Y POSICIONES DISERGONOMICAS, BAJAS TEMPERATURAS,INSOLACIÓN,GOLPES,CAIDAS,RUIDO",
          proteccion:
            "GORRO, POLO MANGA LARGA, PROTECCIÓN SOLAR, GUANTES, TYVEK, GUANTES DE NITRILO, BOTAS CAÑA ALTA, MASCARILLAS N95",
        }));
        return;
      }
      setRowData((prev) => ({ ...prev, empresa: value }));
      return;
    }

    if (field === "socavon") {
      setRowData((prev) => ({
        ...prev,
        socavon: value,
        superficie: prev.superficie == "" && numero !== 0 ? "0" : prev.superficie,
      }));
      return;
    }

    if (field === "superficie") {
      setRowData((prev) => ({
        ...prev,
        superficie: value,
        socavon: prev.socavon == "" && numero !== 0 ? "0" : prev.socavon,
      }));
      return;
    }

    setRowData((prev) => ({ ...prev, [field]: value }));
  };

  const getAñoInicial = (fecha) => {
    const match = fecha.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : Infinity;
  };

  // Inserta una fila respetando el orden por año (mismo criterio que antes).
  const insertarOrdenado = (lista, fila) => {
    const nuevaLista = [...lista, fila];
    nuevaLista.sort((a, b) => {
      const añoA = getAñoInicial(a.fecha);
      const añoB = getAñoInicial(b.fecha);
      if (añoA !== añoB) {
        return añoA - añoB;
      }
      return a.fecha.length - b.fecha.length;
    });
    return nuevaLista;
  };

  const resetRowEntry = () => {
    setRowData(EMPTY_ROW);
    setSearchEmpresa("");
    setSearchCargoOcupacion("");
    setSearchAltitud("");
    setSearchArea("");
    setSearchRiesgo("");
    setSearchProt("");
    setFilteredSuperficie([]);
    setFilteredSocavon([]);
  };

  // ===== Botón "+ Agregar Nuevo" =====
  // 1er click (sin fila activa): abre la fila nueva (verde) para completarla.
  // Click siguiente (con la fila ya completada): esa fila pasa a formar parte
  // de la lista de registros (ordenada por año, conservando el sombreado
  // verde) y se abre una fila en blanco para seguir agregando.
  const handleAgregarNuevoClick = async () => {
    if (!addingNew) {
      setAddingNew(true);
      return;
    }

    const sinDatos = !rowData.fecha && !rowData.empresa;
    if (sinDatos) return; // fila en blanco: nada que registrar todavía

    if (!rowData.fecha || !rowData.empresa) {
      await Swal.fire("Error", "Faltan datos", "error");
      return;
    }

    setRegistros((prev) =>
      insertarOrdenado(prev, { ...rowData, _uid: generateUid(), _isNew: true })
    );
    resetRowEntry();
  };

  // Cancela (clic derecho) la fila nueva en edición sin guardarla.
  const handleCancelNuevaFila = async () => {
    const confirm = await Swal.fire({
      title: "¿Cancelar registro nuevo?",
      text: "Se perderán los datos ingresados en esta fila.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Seguir editando",
    });
    if (confirm.isConfirmed) {
      resetRowEntry();
      setAddingNew(false);
    }
  };

  const handleEditChange = (index, field, value) => {
    setRegistros((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // ¿La fila difiere de su valor original cargado del servidor? Solo aplica a
  // filas preexistentes: las nuevas añadidas esta sesión siempre van en verde.
  const isRowEdited = (reg) =>
    !reg._isNew &&
    Boolean(reg._original) &&
    CAMPOS_FILA.some((campo) => (reg[campo] ?? "") !== (reg._original[campo] ?? ""));

  // Sombreado de la fila: verde = nueva (añadida esta sesión), naranja =
  // editada, blanco/gris = registro previo sin cambios.
  const rowClassFor = (reg) => {
    if (reg._isNew) {
      return "bg-green-50 hover:bg-green-100 border-l-4 border-green-500";
    }
    if (isRowEdited(reg)) {
      return "bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500";
    }
    return "hover:bg-gray-50";
  };

  // Revierte todos los campos de una fila preexistente a su valor original.
  const revertRow = (index) => {
    setRegistros((prev) =>
      prev.map((item, i) =>
        i === index && item._original ? { ...item, ...item._original } : item
      )
    );
  };

  const deleteRow = async (indexToRemove) => {
    if (camposDeshabilitados) return;
    const confirm = await Swal.fire({
      title: "¿Eliminar fila?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      if (registros[indexToRemove].historiaDetalleId != null) {
        setForm((prev) => ({
          ...prev,
          eliminados: [
            ...prev.eliminados,
            registros[indexToRemove].historiaDetalleId,
          ],
        }));
      }
      setRegistros((prev) => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  // ===== Búsqueda por N° Orden =====
  const executeSearch = () => {
    // Reinicia todo menos el N° Orden antes de consultar (comportamiento original).
    handleClearnotO();
    setRegistros([]);
    resetRowEntry();
    setAddingNew(false);
    VerifyTR(form.norden, tabla, token, setForm, selectedSede, setRegistrosFromServer);
  };

  const handleSearchNorden = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  // ===== Limpiar =====
  const handleClearForm = () => {
    handleClear();
    setRegistros([]);
    resetRowEntry();
    setAddingNew(false);
  };

  // ===== Input N° Orden de la barra IMPRIMIR =====
  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(
      form.nombres || form.dni || form.tieneRegistro
    );
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
      setRegistros([]);
      resetRowEntry();
      setAddingNew(false);
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  // ===== Guardar / Actualizar =====
  const handleGuardar = () => {
    // Si hay una fila nueva en edición con datos, se confirma automáticamente
    // para no perderla silenciosamente al guardar.
    let listaFinal = registros;
    if (addingNew && (rowData.fecha || rowData.empresa)) {
      if (!rowData.fecha || !rowData.empresa) {
        Swal.fire(
          "Datos incompletos",
          "Complete o cancele (clic derecho) la fila nueva antes de guardar.",
          "warning"
        );
        return;
      }
      listaFinal = insertarOrdenado(registros, {
        ...rowData,
        _uid: generateUid(),
        _isNew: true,
      });
      setRegistros(listaFinal);
      resetRowEntry();
    }

    const doSubmit = () =>
      SubmiteHistoriaOcupacionalController(
        form,
        token,
        userlogued,
        handleClearForm,
        tabla,
        listaFinal
      );

    if (listaFinal.length === 0) {
      Swal.fire({
        title: "¿Está seguro?",
        text: "Está por registrar una Historia Ocupacional sin ninguna fila. ¿Desea continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) doSubmit();
      });
      return;
    }
    doSubmit();
  };

  // ===== Impresión =====
  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, selectedSede);
    });
  };

  const hayRegistroCargado = Boolean(form.nombres || form.dni);

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div className="px-4 max-w-[95%] xl:max-w-[90%] mx-auto space-y-3 text-black">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClearForm}
      />

      {/* ===== SECCIÓN: DATOS HISTORIA OCUPACIONAL ===== */}
      <SectionFieldset
        legend="Datos Historia Ocupacional"
        className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3"
      >
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearchNorden}
            disabled={hayRegistroCargado}
            labelWidth="120px"
            className="w-full"
          />
          <SearchButton onClick={executeSearch} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          edited={isFieldEdited("fecha")}
          onRevert={() => revertField("fecha")}
        /> 
      </SectionFieldset>

      {/* ===== SECCIÓN: DATOS PERSONALES Y LABORALES ===== */}
      <DatosPersonalesLaborales form={form} />

      {/* ===== SECCIÓN: EXPERIENCIA OCUPACIONAL ===== */}
      <SectionFieldset legend="Experiencia Ocupacional" className="space-y-3">
        {!camposDeshabilitados && (
          <div className="flex flex-col items-center gap-1 py-2">
            <button
              type="button"
              onClick={handleAgregarNuevoClick}
              className="inline-flex items-center text-center gap-2 bg-[#233245] hover:bg-[#1c2836] text-white text-lg px-4 py-2 rounded transition-colors"
            >
              <i className="fas fa-plus" />{" "}
              {addingNew ? "Guardar y agregar otro" : "Agregar nuevo"}
            </button>
            {addingNew && (
              <p className="text-xs text-gray-500">
                Complete la fila resaltada en verde y presione el botón para guardarla.
              </p>
            )}
          </div>
        )}

        {registros.length === 0 && !addingNew ? (
          <div className="border border-dashed border-gray-300 bg-gray-50 text-gray-400 rounded-md py-6 text-center text-sm">
            Aquí se mostrarán los registros
          </div>
        ) : (
          // max-h fijado en px (no rem) porque :root tiene font-size:10px !important
          // en este módulo, lo que rompería la escala de las utilidades max-h-* de Tailwind.
          // 120px = encabezado + 3 filas (~29.5px c/u); desde la 4ta fila aparece scroll vertical.
          <div className="overflow-auto max-h-[460px]">
            <table className={`${historiaTableClass} text-[13px] text-black`}>
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Empresa - Lugar Geográfico</th>
                  <th>Altitud</th>
                  <th>Actividad</th>
                  <th>Área Empresa</th>
                  <th>Ocupación</th>
                  <th>Superficie</th>
                  <th>Socavón</th>
                  <th>Riesgos</th>
                  <th>Protección</th>
                  <th>Causa de Retiro</th>
                </tr>
              </thead>
              <tbody>
                {addingNew && (
                  <tr
                    className="bg-green-50 hover:bg-green-100 border-l-4 border-green-500"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleCancelNuevaFila();
                    }}
                  >
                    <td>
                      <AutoResizeInput
                        value={rowData.fecha}
                        onChange={(e) =>
                          handleRowChange("fecha", e.target.value.toUpperCase())
                        }
                      />
                    </td>
                    <td onClick={() => empresaRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={empresaRef}
                            autoComplete="off"
                            rows={1}
                            className={`resize-none overflow-hidden w-full bg-transparent outline-none `}
                            value={searchEmpresa}
                            name="empresa"
                            onFocus={() => setFilteredEmpresa(EmpresasMulti)}
                            onChange={(e) => {
                              handleSearch(
                                e,
                                setSearchEmpresa,
                                handleRowChange,
                                setFilteredEmpresa,
                                EmpresasMulti
                              );
                            }}
                            onKeyUp={(e) => {
                              if (
                                e.key === "Enter" &&
                                filteredEmpresa.length > 0
                              ) {
                                e.preventDefault();
                                handleSelect(
                                  e,
                                  e.target.name,
                                  filteredEmpresa[0].mensaje,
                                  setSearchEmpresa,
                                  handleRowChange,
                                  setFilteredEmpresa
                                );
                                document.getElementById("altitud")?.focus();
                              }
                            }}
                            onBlur={() =>
                              setTimeout(() => setFilteredEmpresa([]), 100)
                            }
                          />
                          {filteredEmpresa.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-60">
                              {filteredEmpresa.map((opt) => (
                                <li
                                  key={opt.id}
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={(e) => {
                                    handleSelect(
                                      e,
                                      "empresa",
                                      opt.mensaje,
                                      setSearchEmpresa,
                                      handleRowChange,
                                      setFilteredEmpresa
                                    );
                                    document.getElementById("altitud")?.focus();
                                  }}
                                >
                                  {opt.mensaje}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={() => altitudRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={altitudRef}
                            type="text"
                            id="altitud"
                            rows={1}
                            autoComplete="off"
                            className={`resize-none overflow-hidden w-full bg-transparent outline-none `}
                            value={searchAltitud}
                            name="altitud"
                            onFocus={() => setFilteredAltitud(AlturaMulti)}
                            onChange={(e) => {
                              const v = e.target.value.toUpperCase();
                              setSearchAltitud(v);
                              handleRowChange("altitud", v);
                              const matches = v
                                ? AlturaMulti.filter((m) =>
                                    m.mensaje
                                      .toLowerCase()
                                      .includes(v.toLowerCase())
                                  )
                                : [];
                              const trimmed = v.trim();
                              if (/^\d+$/.test(trimmed)) {
                                matches.unshift({
                                  id: "sugerencia-msnm",
                                  mensaje: `${trimmed} M.S.N.M.`,
                                });
                              }
                              setFilteredAltitud(matches);
                            }}
                            onKeyUp={(e) => {
                              if (
                                e.key === "Enter" &&
                                filteredAltitud.length > 0
                              ) {
                                e.preventDefault();
                                handleSelect(
                                  e,
                                  e.target.name,
                                  filteredAltitud[0].mensaje,
                                  setSearchAltitud,
                                  handleRowChange,
                                  setFilteredAltitud
                                );
                                document.getElementById("areaEmpresa").focus();
                              }
                            }}
                            onBlur={() =>
                              setTimeout(() => setFilteredAltitud([]), 100)
                            }
                          />
                          {filteredAltitud.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-50">
                              {filteredAltitud.map((opt) => (
                                <li
                                  key={opt.id}
                                  name="altitud"
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={(e) =>
                                    handleSelect(
                                      e,
                                      "altitud",
                                      opt.mensaje,
                                      setSearchAltitud,
                                      handleRowChange,
                                      setFilteredAltitud
                                    )
                                  }
                                >
                                  {opt.mensaje}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={() => actividadRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={actividadRef}
                            rows={1}
                            autoComplete="off"
                            className="resize-none overflow-hidden w-full bg-transparent outline-none"
                            value={rowData.actividad}
                            name="actividad"
                            onChange={(e) => {
                              const v = e.target.value.toUpperCase();
                              handleRowChange("actividad", v);
                              setFilteredActividad(
                                v
                                  ? ActividadMulti.filter((m) =>
                                      m.mensaje
                                        .toLowerCase()
                                        .includes(v.toLowerCase())
                                    )
                                  : []
                              );
                            }}
                            onFocus={() => setFilteredActividad(ActividadMulti)}
                            onKeyUp={(e) => {
                              if (
                                e.key === "Enter" &&
                                filteredActividad.length > 0
                              ) {
                                e.preventDefault();
                                handleRowChange(
                                  "actividad",
                                  filteredActividad[0].mensaje
                                );
                                setFilteredActividad([]);
                              }
                            }}
                            onBlur={() =>
                              setTimeout(() => setFilteredActividad([]), 100)
                            }
                          />
                          {filteredActividad.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-50">
                              {filteredActividad.map((opt) => (
                                <li
                                  key={opt.id}
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={() => {
                                    handleRowChange("actividad", opt.mensaje);
                                    setFilteredActividad([]);
                                  }}
                                >
                                  {opt.mensaje}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={() => areaRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={areaRef}
                            type="text"
                            id="areaEmpresa"
                            autoComplete="off"
                            rows={1}
                            className={`resize-none overflow-hidden w-full bg-transparent outline-none `}
                            value={searchArea}
                            name="areaEmpresa"
                            onFocus={() => setFilteredArea(AreaMulti)}
                            onChange={(e) => {
                              handleSearch(
                                e,
                                setSearchArea,
                                handleRowChange,
                                setFilteredArea,
                                AreaMulti
                              );
                            }}
                            onKeyUp={(e) => {
                              if (e.key === "Enter" && filteredArea.length > 0) {
                                e.preventDefault();
                                handleSelect(
                                  e,
                                  e.target.name,
                                  filteredArea[0].mensaje,
                                  setSearchArea,
                                  handleRowChange,
                                  setFilteredArea
                                );
                                document.getElementById("riesgo").focus();
                              }
                            }}
                            onBlur={() =>
                              setTimeout(() => setFilteredArea([]), 100)
                            }
                          />
                          {filteredArea.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-10">
                              {filteredArea.map((opt) => (
                                <li
                                  key={opt.id}
                                  name="areaEmpresa"
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={(e) =>
                                    handleSelect(
                                      e,
                                      "areaEmpresa",
                                      opt.mensaje,
                                      setSearchArea,
                                      handleRowChange,
                                      setFilteredArea
                                    )
                                  }
                                >
                                  {opt.mensaje}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={() => ocupacionRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={ocupacionRef}
                            autoComplete="off"
                            rows={1}
                            className={`resize-none overflow-hidden w-full bg-transparent outline-none `}
                            value={searchCargoOcupacion}
                            name="ocupacion"
                            onFocus={() =>
                              setFilteredCargoOcupacion(CargosMulti)
                            }
                            onChange={(e) => {
                              handleSearch(
                                e,
                                setSearchCargoOcupacion,
                                handleRowChange,
                                setFilteredCargoOcupacion,
                                CargosMulti
                              );
                            }}
                            onKeyUp={(e) => {
                              if (
                                e.key === "Enter" &&
                                filteredCargoOcupacion.length > 0
                              ) {
                                e.preventDefault();
                                handleSelect(
                                  e,
                                  e.target.name,
                                  filteredCargoOcupacion[0].mensaje,
                                  setSearchCargoOcupacion,
                                  handleRowChange,
                                  setFilteredCargoOcupacion
                                );
                              }
                            }}
                            onBlur={() =>
                              setTimeout(
                                () => setFilteredCargoOcupacion([]),
                                100
                              )
                            }
                          />
                          {filteredCargoOcupacion.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-60">
                              {filteredCargoOcupacion.map((opt, index) => (
                                <li
                                  key={index}
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={(e) =>
                                    handleSelect(
                                      e,
                                      "ocupacion",
                                      opt.mensaje,
                                      setSearchCargoOcupacion,
                                      handleRowChange,
                                      setFilteredCargoOcupacion
                                    )
                                  }
                                >
                                  {opt.mensaje}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={() => superficieRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={superficieRef}
                            rows={1}
                            autoComplete="off"
                            className="resize-none overflow-hidden w-full bg-transparent outline-none"
                            value={rowData.superficie}
                            name="superficie"
                            onChange={(e) => {
                              const v = e.target.value.toUpperCase();
                              handleRowChange("superficie", v);
                              const trimmed = v.trim();
                              let sugerencia = null;
                              if (/^\d+$/.test(trimmed)) {
                                const n = parseInt(trimmed, 10);
                                sugerencia = `${trimmed} ${
                                  n === 1 ? "AÑO" : "AÑOS"
                                }`;
                              } else {
                                const match = trimmed.match(
                                  /^(\d+)\s+A[ÑN]OS?\.?\s+(\d+)$/
                                );
                                if (match) {
                                  const meses = parseInt(match[2], 10);
                                  sugerencia = `${trimmed} ${
                                    meses === 1 ? "MES" : "MESES"
                                  }`;
                                }
                              }
                              setFilteredSuperficie(
                                sugerencia ? [sugerencia] : []
                              );
                            }}
                            onKeyUp={(e) => {
                              if (
                                e.key === "Enter" &&
                                filteredSuperficie.length > 0
                              ) {
                                e.preventDefault();
                                handleRowChange(
                                  "superficie",
                                  filteredSuperficie[0]
                                );
                                setFilteredSuperficie([]);
                              }
                            }}
                            onBlur={() =>
                              setTimeout(() => setFilteredSuperficie([]), 100)
                            }
                          />
                          {filteredSuperficie.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-50">
                              {filteredSuperficie.map((sug, i) => (
                                <li
                                  key={i}
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={() => {
                                    handleRowChange("superficie", sug);
                                    setFilteredSuperficie([]);
                                  }}
                                >
                                  {sug}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={() => socavonRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={socavonRef}
                            rows={1}
                            autoComplete="off"
                            className="resize-none overflow-hidden w-full bg-transparent outline-none"
                            value={rowData.socavon}
                            name="socavon"
                            onChange={(e) => {
                              const v = e.target.value.toUpperCase();
                              handleRowChange("socavon", v);
                              const trimmed = v.trim();
                              let sugerencia = null;
                              if (/^\d+$/.test(trimmed)) {
                                const n = parseInt(trimmed, 10);
                                sugerencia = `${trimmed} ${
                                  n === 1 ? "AÑO" : "AÑOS"
                                }`;
                              } else {
                                const match = trimmed.match(
                                  /^(\d+)\s+A[ÑN]OS?\.?\s+(\d+)$/
                                );
                                if (match) {
                                  const meses = parseInt(match[2], 10);
                                  sugerencia = `${trimmed} ${
                                    meses === 1 ? "MES" : "MESES"
                                  }`;
                                }
                              }
                              setFilteredSocavon(sugerencia ? [sugerencia] : []);
                            }}
                            onKeyUp={(e) => {
                              if (
                                e.key === "Enter" &&
                                filteredSocavon.length > 0
                              ) {
                                e.preventDefault();
                                handleRowChange("socavon", filteredSocavon[0]);
                                setFilteredSocavon([]);
                              }
                            }}
                            onBlur={() =>
                              setTimeout(() => setFilteredSocavon([]), 100)
                            }
                          />
                          {filteredSocavon.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-50">
                              {filteredSocavon.map((sug, i) => (
                                <li
                                  key={i}
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={() => {
                                    handleRowChange("socavon", sug);
                                    setFilteredSocavon([]);
                                  }}
                                >
                                  {sug}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={() => riesgoRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={riesgoRef}
                            id="riesgo"
                            rows={1}
                            autoComplete="off"
                            className="resize-none overflow-hidden w-full bg-transparent outline-none"
                            value={searchRiesgo}
                            name="riesgo"
                            onFocus={() => setFilteredRiesgo(riesgosOptions)}
                            onChange={(e) => {
                              handleSearch(
                                e,
                                setSearchRiesgo,
                                handleRowChange,
                                setFilteredRiesgo,
                                riesgosOptions
                              );
                            }}
                            onKeyUp={(e) => {
                              if (
                                e.key === "Enter" &&
                                filteredRiesgo.length > 0
                              ) {
                                e.preventDefault();
                                handleSelect(
                                  e,
                                  e.target.name,
                                  filteredRiesgo[0].mensaje,
                                  setSearchRiesgo,
                                  handleRowChange,
                                  setFilteredRiesgo
                                );
                                document.getElementById("proteccion")?.focus();
                              }
                            }}
                            onBlur={() =>
                              setTimeout(() => setFilteredRiesgo([]), 100)
                            }
                          />
                          {filteredRiesgo.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-50">
                              {filteredRiesgo.map((opt, index) => (
                                <li
                                  key={index}
                                  name="riesgo"
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={(e) =>
                                    handleSelect(
                                      e,
                                      "riesgo",
                                      opt.mensaje,
                                      setSearchRiesgo,
                                      handleRowChange,
                                      setFilteredRiesgo
                                    )
                                  }
                                >
                                  {opt.title}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={() => protRef.current?.focus()}>
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center">
                          <textarea
                            ref={protRef}
                            id="proteccion"
                            rows={1}
                            autoComplete="off"
                            className="resize-none overflow-hidden w-full bg-transparent outline-none"
                            value={searchProt}
                            name="proteccion"
                            onFocus={() => setFilteredProt(proteccionOptions)}
                            onChange={(e) => {
                              handleSearch(
                                e,
                                setSearchProt,
                                handleRowChange,
                                setFilteredProt,
                                proteccionOptions
                              );
                            }}
                            onKeyUp={(e) => {
                              if (e.key === "Enter" && filteredProt.length > 0) {
                                e.preventDefault();
                                handleSelect(
                                  e,
                                  e.target.name,
                                  filteredProt[0].mensaje,
                                  setSearchProt,
                                  handleRowChange,
                                  setFilteredProt
                                );
                              }
                            }}
                            onBlur={() =>
                              setTimeout(() => setFilteredProt([]), 100)
                            }
                          />
                          {filteredProt.length > 0 && (
                            <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-72 min-w-[320px] overflow-y-auto z-40">
                              {filteredProt.map((opt) => (
                                <li
                                  key={opt.id}
                                  name="proteccion"
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                                  onMouseDown={(e) =>
                                    handleSelect(
                                      e,
                                      "proteccion",
                                      opt.mensaje,
                                      setSearchProt,
                                      handleRowChange,
                                      setFilteredProt
                                    )
                                  }
                                >
                                  {opt.mensaje}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <AutoResizeInput
                        value={rowData.causaRetiro}
                        onChange={(e) => {
                          handleRowChange(
                            "causaRetiro",
                            e.target.value.toUpperCase()
                          );
                        }}
                      />
                    </td>
                  </tr>
                )}
                {registros.map((reg, idx) => (
                  <tr
                    key={reg._uid ?? idx}
                    className={`${rowClassFor(reg)} cursor-pointer`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      deleteRow(idx);
                    }}
                  >
                    <td>
                      <AutoResizeInput
                        value={reg.fecha}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "fecha",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.empresa}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "empresa",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.altitud}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "altitud",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.actividad}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "actividad",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.areaEmpresa}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "areaEmpresa",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.ocupacion}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "ocupacion",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.superficie}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "superficie",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.socavon}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "socavon",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.riesgo}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "riesgo",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeInput
                        value={reg.proteccion}
                        disabled={camposDeshabilitados}
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "proteccion",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <AutoResizeInput
                          value={reg.causaRetiro}
                          disabled={camposDeshabilitados}
                          onChange={(e) =>
                            handleEditChange(
                              idx,
                              "causaRetiro",
                              e.target.value.toUpperCase()
                            )
                          }
                        />
                        {!camposDeshabilitados && isRowEdited(reg) && (
                          <RevertButton
                            title="Revertir fila a su valor original"
                            onClick={() => revertRow(idx)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(registros.length > 0 || addingNew) && (
          <p className="text-xs text-gray-500">
            Clic derecho sobre una fila para eliminarla
            {addingNew ? " (o cancelar la fila nueva)" : ""}.
          </p>
        )}
      </SectionFieldset>

      {/* ===== SECCIÓN: RESPONSABLE Y MÉDICO ===== */}
      <SectionFieldset
        legend="Responsable y Médico que Certifica"
        className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3"
      >
        {/* <InputTextOneLine
          label="DNI Responsable"
          name="dniUser"
          value={form.dniUser}
          disabled
          labelWidth="150px"
        />
        <InputTextOneLine
          label="Nombres Responsable"
          name="nombreUser"
          value={form.nombreUser}
          disabled
          labelWidth="150px"
        /> */}
        <div className="md:col-span-2">
          <EmpleadoComboBox
            value={form.nombre_medico}
            form={form}
            onChange={handleChangeSimple}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("user_medicoFirma")}
            onRevert={() => revertFields(["user_medicoFirma", "nombre_medico"])}
          />
        </div>
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
        onNordenChange={handlePrintNordenChange}
        handleSave={handleGuardar}
        saveLabel={
          form.tieneRegistro && edicionHabilitada
            ? "Guardar Cambios"
            : "Guardar/Actualizar"
        }
        handleEdit={habilitarEdicion}
        handleClear={handleClearForm}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />
    </div>
  );
};

export default HistoriaOcupacional;
