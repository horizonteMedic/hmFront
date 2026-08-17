import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import Swal from "sweetalert2";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useEffect, useRef, useState } from "react";
import { getEspecialidades, getInfoTabla, SubmitRegistro } from "./controllerRegistroVisita";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faCheck } from "@fortawesome/free-solid-svg-icons";

const initialFormState = {
  pacienteId: "",
  TipoDoc: "1",
  origen: "",
  dni: "",
  nombres: "",
  Seleccionespecialidades: []
};

export default function RegistroVisita({ pacienteActivo }) {
  const [dataTabla, setDataTabla] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();

  const { form, setForm, handleChange, handleChangeSimple, handleRadioButton, handleClear } = useForm(initialFormState);

  useEffect(() => {
    if (!pacienteActivo) return;
    setForm((f) => ({
      ...f,
      pacienteId: pacienteActivo.pacienteId,
      dni: pacienteActivo.dni,
      nombres: pacienteActivo.nombres,
    }));
  }, [pacienteActivo]);

  const obtenerInfoTabla = () => {
    getInfoTabla(setDataTabla, token);
  };

  const obtenerEspecialidades = () => {
    getEspecialidades(setEspecialidades, token);
  };

  useEffect(() => {
    obtenerInfoTabla();
  }, []);

  useEffect(() => {
    obtenerEspecialidades();
  }, []);

  const handleSubmit = () => {
    SubmitRegistro(form, token, userlogued, handleClear)
  }

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
              className="flex-[1] min-w-0"
              disabled
            />
            <InputTextOneLine
              label="Nombres y Apellidos"
              name="nombres"
              value={form.nombres}
              labelWidth="155px"
              className="flex-[2] min-w-0"
              disabled
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
          <SelectorEspecialidades
            especialidades={especialidades}
            seleccionadas={form.Seleccionespecialidades}
            onChange={(nuevas) => setForm((f) => ({ ...f, Seleccionespecialidades: nuevas }))}
            className="col-span-full"
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
                onClick={() => handleClear()}
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
            set={setForm}
            token={token}
            clean={handleClear}
            datosFooter={datosFooter}
          />
        </SectionFieldset>

      </div>
    </div>
  );
}

function SelectorEspecialidades({ especialidades = [], seleccionadas = [], onChange, className = "" }) {
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  const opciones = especialidades.filter(
    (e) => e.activo &&
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      !seleccionadas.some((s) => s.id === e.id)
  );

  const agregar = (esp) => {
    onChange([...seleccionadas, { id: esp.id, nombre: esp.nombre }]);
    setBusqueda("");
  };

  const quitar = (id) => onChange(seleccionadas.filter((s) => s.id !== id));

  useEffect(() => {
    const cerrar = (e) => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false); };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  return (
    <div className={`flex items-start gap-4 ${className}`} ref={ref}>
      <label className="font-semibold whitespace-nowrap pt-1" style={{ minWidth: "80px", maxWidth: "80px" }}>
        Especialidad :
      </label>
      <div className="flex-1 min-w-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar especialidad..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setAbierto(true); }}
            onFocus={() => setAbierto(true)}
            className="border rounded px-2 py-1 w-full"
          />
          {abierto && opciones.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
              {opciones.map((esp) => (
                <li
                  key={esp.id}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                  onMouseDown={(e) => { e.preventDefault(); agregar(esp); setAbierto(false); }}
                >
                  {esp.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {seleccionadas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {seleccionadas.map((esp) => (
              <span
                key={esp.id}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
              >
                {esp.nombre}
                <button
                  type="button"
                  onClick={() => quitar(esp.id)}
                  className="ml-1 text-blue-500 hover:text-red-600 font-bold leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Table({ data, tabla, set, token, clean, datosFooter }) {
  // confirmación antes de imprimir

  function clicktable(nro) {
    clean();
    Loading("Importando Datos");
    //GetInfoServicio(nro, tabla, set, token, () => {
    //Swal.close();
    //});
  }

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
      render: (row) => row.especialidades.map((option) => (<span className="">{option.nombre}</span>)),
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
