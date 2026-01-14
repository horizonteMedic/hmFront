import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faComments } from "@fortawesome/free-solid-svg-icons";
import {
  GetInfoServicio,
  getInfoTabla,
  handleSubirArchivo,
  Loading,
  PrintConsultaEjecutada,
  PrintHojaR,
  ReadArchivosForm,
  SubmitDataService,
  VerifyTR,
} from "./controllerRayoxXToraxPA";
import Swal from "sweetalert2";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import { getToday } from "../../../../../utils/helpers";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../../components/reusableComponents/ButtonsPDF";

const tabla = "radiografia_torax";

export default function RayosXToraxPA() {
  const [dataTabla, setDataTabla] = useState([]);
  const today = getToday();

  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

  const initialFormState = {
    norden: "",
    codRat: null,
    fechaExam: today,
    nombreExamen: "",

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

    vertices: "LIBRES",
    hilios: "NORMALES",
    senosCostofrenicos: "LIBRES",
    camposPulmonares: "NORMALES",
    mediastinos: "NORMALES",
    siluetaCardiovascular: "NORMAL",
    osteomuscular: "NORMAL",
    conclusiones: "NORMAL",
    observaciones: "NORMAL",

    nombres_search: "",
    codigo_search: "",
    fechaDesde: today,
    fechaHasta: today,

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    SubirDoc: false,
    nomenclatura: "RAYOS X TORAX"
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
  } = useForm(initialFormState, { storageKey: "rayosX_torax_PA" });

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

  const handleEjecutarConsulta = () => {
    Swal.fire({
      title: "¿Desea Imprimir Consulta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        PrintConsultaEjecutada(
          form.fechaDesde,
          form.fechaHasta,
          token,
          datosFooter
        );
      }
    });
  };

  const obtenerInfoTabla = () => {
    getInfoTabla(form.nombres_search, form.codigo_search, setDataTabla, token);
  };

  useEffect(() => {
    obtenerInfoTabla();
  }, []);

  return (
    <div className="px-4 max-w-[95%] mx-auto grid xl:grid-cols-2 gap-6">
      {/* Columna izquierda: Formulario */}
      <div className="space-y-3">
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-x-4 gap-y-3">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
            onKeyUp={handleSearch}
          />
          <InputTextOneLine
            label="Fecha"
            name="fechaExam"
            type="date"
            value={form.fechaExam}
            onChange={handleChangeSimple}
          />
          <InputTextOneLine
            label="Tipo Examen"
            name="nombreExamen"
            value={form.nombreExamen}
            disabled
          />
          {form.SubirDoc &&
            <ButtonsPDF
              handleSave={() => { handleSubirArchivo(form, selectedSede, userlogued, token) }}
              handleRead={() => { ReadArchivosForm(form, setVisualerOpen, token) }}
            />
          }
        </SectionFieldset>

        <DatosPersonalesLaborales form={form} minSizePrincipal="none" />

        <SectionFieldset
          legend="Evaluación Radiográfica"
          className="space-y-3"
        >
          <InputTextOneLine
            label="Vértices"
            name="vertices"
            value={form.vertices ?? ""}
            onChange={handleChange}
            labelWidth="150px"
          />

          <InputTextOneLine
            label="Hilios"
            name="hilios"
            value={form.hilios ?? ""}
            onChange={handleChange}
            labelWidth="150px"
          />

          <InputTextOneLine
            label="Senos Costofrénicos"
            name="senosCostofrenicos"
            value={form.senosCostofrenicos ?? ""}
            onChange={handleChange}
            labelWidth="150px"
          />

          <div className="space-y-2">
            <InputTextOneLine
              label="Campos Pulmonares"
              name="camposPulmonares"
              value={form.camposPulmonares ?? ""}
              onChange={handleChange}
              labelWidth="150px"
            />

            <InputCheckbox
              label="Trama Broncovascular Acentuada en ACP"
              name="tramaBroncovascular"
              checked={
                form.camposPulmonares ===
                "TRAMA BRONCOVASCULAR ACENTUADA EN ACP"
              }
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  camposPulmonares: e.target.checked
                    ? "TRAMA BRONCOVASCULAR ACENTUADA EN ACP"
                    : "",
                }));
              }}
              className="ml-[170px]"
            />
          </div>

          <InputTextOneLine
            label="Campos Mediastinos"
            name="mediastinos"
            value={form.mediastinos ?? ""}
            onChange={handleChange}
            labelWidth="150px"
          />

          <InputTextOneLine
            label="Silueta Cardiovascular"
            name="siluetaCardiovascular"
            value={form.siluetaCardiovascular ?? ""}
            onChange={handleChange}
            labelWidth="150px"
          />

          <InputTextOneLine
            label="Osteomuscular"
            name="osteomuscular"
            value={form.osteomuscular ?? ""}
            onChange={handleChange}
            labelWidth="150px"
          />

          <InputTextOneLine
            label="Conclusiones Radiográficas"
            name="conclusiones"
            value={form.conclusiones ?? ""}
            onChange={handleChange}
            labelWidth="150px"
          />

          <div className="md:col-span-2 flex gap-x-4">
            <InputTextArea
              label="Observaciones"
              name="observaciones"
              value={form.observaciones ?? ""}
              rows={3}
              onChange={handleChange}
            />
            <div className="flex flex-col gap-y-2 mt-4 min-w-[190px]">
              <InputCheckbox
                label="Evaluación Anual"
                name="evaluacionAnual"
                checked={form.observaciones === "EVALUACIÓN ANUAL"}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    observaciones: e.target.checked
                      ? "EVALUACIÓN ANUAL"
                      : "",
                  }));
                }}
              />
              <InputCheckbox
                label="No se Tomó Radiografía de Tórax"
                name="noRadiografiaTorax"
                checked={form.observaciones === "NO SE TOMÓ RADIOGRAFIA DE TÓRAX"}
                onChange={(e) => {
                  const texto = e.target.checked
                    ? "NO SE TOMÓ RADIOGRAFIA DE TÓRAX"
                    : "";
                  setForm((prev) => ({
                    ...prev,
                    vertices: texto,
                    hilios: texto,
                    senosCostofrenicos: texto,
                    camposPulmonares: texto,
                    mediastinos: texto,
                    siluetaCardiovascular: texto,
                    osteomuscular: texto,
                    conclusiones: texto,
                    observaciones: texto,
                  }));
                }}
              />

              <InputCheckbox
                label="Evaluación por Neumología"
                name="evaluacionNeumologia"
                checked={form.observaciones === "EVALUACIÓN POR NEUMOLOGÍA"}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    observaciones: e.target.checked
                      ? "EVALUACIÓN POR NEUMOLOGÍA"
                      : "",
                  }));
                }}
              />
            </div>
          </div>
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
          handleChangeNumberDecimals={handleChangeNumberDecimals}
          hidePrint
        />
      </div>
      {/* Columna derecha: Panel de historial/búsqueda */}
      <div className="space-y-3">
        <SectionFieldset legend="Búsqueda de Registros" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <InputTextOneLine
              label="Nombre"
              labelOnTop
              name="nombres_search"
              value={form.nombres_search}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  obtenerInfoTabla();
                }
              }}
              onChange={(e) => { handleChange(e); setForm(prev => ({ ...prev, codigo_search: "" })) }}
            />
            <InputTextOneLine
              label="Código"
              labelOnTop
              name="codigo_search"
              value={form.codigo_search}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  obtenerInfoTabla();
                }
              }}
              onChange={(e) => { handleChangeNumberDecimals(e); setForm(prev => ({ ...prev, nombres_search: "" })) }}
            />
          </div>
          <Table
            data={dataTabla}
            tabla={tabla}
            set={setForm}
            token={token}
            clean={handleClear}
            datosFooter={datosFooter}
          />
        </SectionFieldset>

        <SectionFieldset legend="Reportes por Fechas" className="grid grid-cols-1 md:grid-cols-10 gap-x-4 gap-y-3">
          <InputTextOneLine
            label="Fecha Desde"
            labelOnTop
            name="fechaDesde"
            type="date"
            value={form.fechaDesde}
            onChange={handleChangeSimple}
            className="md:col-span-4"
          />
          <InputTextOneLine
            label="Fecha Hasta"
            labelOnTop
            name="fechaHasta"
            type="date"
            value={form.fechaHasta}
            onChange={handleChangeSimple}
            className="md:col-span-4"
          />
          <div className="flex justify-end pt-4 md:col-span-2">
            <button
              type="button"
              onClick={handleEjecutarConsulta}
              className="bg-blue-500 hover:bg-blue-600 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faComments} /> Ejecutar Consulta
            </button>
          </div>

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
        </SectionFieldset>
      </div>
    </div>
  );
}
function Table({ data, tabla, set, token, clean, datosFooter }) {
  // confirmación antes de imprimir
  const handlePrintConfirm = (nro) => {
    Swal.fire({
      title: "Confirmar impresión",
      text: `¿Deseas imprimir la ficha Nº ${nro}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, imprimir",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(nro, token, tabla, datosFooter);
      }
    });
  };

  function clicktable(nro) {
    clean();
    Loading("Importando Datos");
    GetInfoServicio(nro, tabla, set, token, () => {
      Swal.close();
    });
  }

  const columns = [
    {
      label: "N° Orden",
      accessor: "norden",
      width: "120px",
      render: (row) => <span className="font-bold">{row.norden}</span>,
    },
    {
      label: "Nombres",
      accessor: "nombres",
    },
    {
      label: "Fecha",
      accessor: "fechaInforme",
      render: (row) => formatearFechaCorta(row.fecha),
    },
  ];

  return (
    <TablaTemplate
      columns={columns}
      data={data}
      height={780}
      onRowClick={(row) => clicktable(row.norden)}
      onRowRightClick={(row) => handlePrintConfirm(row.norden)}
    />
  );
}
