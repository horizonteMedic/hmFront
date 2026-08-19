import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import Swal from "sweetalert2";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useEffect, useRef, useState } from "react";
import { getEspecialidades, getInfoTabla, SearchPaciente, SubmitRegistro } from "./controllerRegistroVisita";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faCheck } from "@fortawesome/free-solid-svg-icons";



export default function RegistroVisita({ pacienteActivo, onAutoRegistrado, onVisitaSeleccionada }) {
  const initialFormState = {
    pacienteId: "",
    TipoDoc: "1",
    origen: "",
    dni: "",
    nombres: "",
    Seleccionespecialidades: [],
  };
  const [dataTabla, setDataTabla] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [refresh, setRefresh] = useState(false)

  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const autoSubmitRef = useRef(null);

  const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);

  // Auto-registro cuando viene desde RegistroPaciente
  useEffect(() => {
    if (!pacienteActivo || especialidades.length === 0) return;
    if (autoSubmitRef.current === pacienteActivo.pacienteId) return;
    autoSubmitRef.current = pacienteActivo.pacienteId;

    const seleccionadas = especialidades
      .filter((e) => e.activo)
      .map((e) => ({ id: e.id, nombre: e.nombre }));

    const formData = {
      ...initialFormState,
      pacienteId: pacienteActivo.pacienteId,
      dni: pacienteActivo.dni,
      nombres: pacienteActivo.nombres,
      Seleccionespecialidades: seleccionadas,
    };

    setForm(formData);
    SubmitRegistro(formData, token, userlogued, handleLimpiar, () => { setRefresh(refresh + 1) });
    onAutoRegistrado?.();
  }, [pacienteActivo, especialidades]);

  const obtenerInfoTabla = () => {
    getInfoTabla(setDataTabla, token);
  };

  const obtenerEspecialidades = () => {
    getEspecialidades(setEspecialidades, token);
  };

  useEffect(() => {
    obtenerInfoTabla();
  }, [refresh]);

  useEffect(() => {
    obtenerEspecialidades();
  }, []);

  useEffect(() => {
    if (especialidades.length === 0) return;
    setForm((f) => ({
      ...f,
      Seleccionespecialidades: especialidades
        .filter((e) => e.activo)
        .map((e) => ({ id: e.id, nombre: e.nombre })),
    }));
  }, [especialidades]);

  const handleLimpiar = () => {
    setDisabled(true);
    setForm((f) => ({
      ...initialFormState,
      Seleccionespecialidades: f.Seleccionespecialidades,
    }));
  };

  const handleSubmit = () => {
    SubmitRegistro(form, token, userlogued, handleLimpiar, () => { setRefresh(refresh + 1) })
  }

  // ── Búsqueda ──────────────────────────────────────────────────────────────
  const handleSearch = async (e, tipoBusqueda) => {
    if (e.key === "Enter") {
      setDisabled(true)
      SearchPaciente(form, token, handleLimpiar, setForm, tipoBusqueda);
    }
  };

  return (
    <div className="px-4 max-w-[95%] mx-auto grid xl:grid-cols-2 gap-6">
      {/* Columna izquierda: Formulario */}
      <div className="space-y-3">
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-x-4 gap-y-3">
          <div className="flex gap-4 w-full col-span-full">
            <InputTextOneLine
              label="DNI"
              name="dni"
              value={form.dni}
              onKeyUp={(e) => { handleSearch(e, "DNI") }}
              onChange={handleChangeNumberDecimals}
              className="flex-[1] min-w-0"
              disabled={disabled}
            />
            <InputTextOneLine
              label="Nombres y Apellidos"
              name="nombres"
              value={form.nombres}
              onKeyUp={(e) => { handleSearch(e, "NOMBRES") }}
              onChange={handleChange}
              labelWidth="155px"
              className="flex-[2] min-w-0"
              disabled={disabled}
            />
          </div>

          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            disabled
          //onChange={handleChangeNumberDecimals}
          //onKeyUp={handleSearch}
          />
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faCheck} /> Registrar
              </button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => handleLimpiar()}
                className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faBroom} /> Limpiar
              </button>
            </div>
          </div>

        </SectionFieldset>

      </div>
      {/* Columna derecha: Panel de historial/búsqueda */}
      <div className="space-y-3">
        <SectionFieldset legend="Búsqueda de Registros" className="space-y-3">
          {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
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
          </div>*/}
          <Table
            data={dataTabla}
            set={setForm}
            token={token}
            clean={handleLimpiar}
            datosFooter={datosFooter}
            onRowClick={(row) => onVisitaSeleccionada?.(row.visitaId)}
          />
        </SectionFieldset>

      </div>
    </div>
  );
}


function Table({ data, tabla, set, token, clean, datosFooter, onRowClick }) {

  const columns = [
    {
      label: "N° Orden",
      accessor: "norden",
      width: "120px",
      render: (row) => <span className="font-bold">{row.norden}</span>,
    },
    {
      label: "DNI",
      accessor: "dni",
      width: "120px",
      render: (row) => <span className="font-bold">{row.dni}</span>,
    },
    {
      label: "Nombres",
      accessor: "nombres",
      render: (row) => <span className="">{row.nombres} {row.apellidos}</span>,
    },
    {
      label: "Fecha Visita",
      accessor: "fechaVisita",
      render: (row) => row.fechaVisita,
    },
    {
      label: "Estado Visita",
      accessor: "fechaVisita",
      render: (row) => <span className={`px-2 text-center text-white rounded-xl ${row.estadoVisita === "ABIERTA" ? "bg-green-400" : ""}`}>{row.estadoVisita}</span>,
    },
    {
      label: "Especialidades",
      accessor: "especialidades",
      render: (row) => (
        <ul className="list-disc list-inside space-y-0.5">
          {row.especialidades.map((option) => (
            <li key={option.id ?? option.nombre} className="text-sm">{option.nombre}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <TablaTemplate
      columns={columns}
      data={data}
      height={780}
      onRowClick={(row) => onRowClick?.(row)}
      onRowRightClick={(row) => handlePrintConfirm(row.norden)}
    />
  );
}
