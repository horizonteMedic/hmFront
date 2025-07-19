import React, { useEffect, useState } from "react";
import styles from "./HistoriaOcupacional.module.css";
import {
  handleSearch,
  handleSelect,
  PrintHojaR,
  SubmiteHistoriaOcupacionalController,
  VerifyTR,
} from "./controller/controllerHO";
import { getFetch } from "../../getFetch/getFetch";
import Swal from "sweetalert2";
import AutoResizeInput from "./Inputs";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
const tabla = "historia_oc_info";

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
    mensaje:
      "EPPS BASICOS : CASCO, LENTES, GUANTES,OVERAL,ZAPATOS DE SEGURIDAD",
  },
  {
    id: 5,
    mensaje:
      "EPPS COMPLETO : CASCO, LENTES, GUANTES,TAPONES AUDITIVOS,RESPIRADOR, OREJERAS,ZAPATOS DE SEGURIDAD",
  },
  { id: 6, mensaje: "NINGUNO" },
];

const HistoriaOcupacional = ({
  token,
  userlogued,
  selectedSede,
  listas,
  userDatos,
}) => {
  function fixEncodingModern(str) {
  const bytes = new Uint8Array([...str].map(c => c.charCodeAt(0)));
  return new TextDecoder('utf-8').decode(bytes);
}

  const [form, setForm] = useState({
    norden: "",
    nombres: "",
    fecha: today,
    //Area de trabajo
    areaO: "",
    dni: "",
    dniUser: userDatos.datos.dni_user,
    nombreUser: fixEncodingModern(userDatos.datos.nombres_user),
  });
  const [rowData, setRowData] = useState({
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
  });

  const [registros, setRegistros] = useState([]);
  //AUTOCOMPLETABLES
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

  //listas
  const { EmpresasMulti, AlturaMulti, AreaMulti, CargosMulti } = listas;
  // Opciones random de ejemplo para los selects
  //ALGUNOS YA TREEN DATOS DE VERITAS

  const handleRowChange = (field, value) => {
    const numero = Number(value); // solo para lógica de control

    if (field === "socavon") {
      setRowData((prev) => ({
        ...prev,
        socavon: value, // se guarda como string
        superficie: numero !== 0 ? "0" : prev.superficie, // se resetea si socavon no es 0
      }));
      return;
    }

    if (field === "superficie") {
      setRowData((prev) => ({
        ...prev,
        superficie: value,
        socavon: numero !== 0 ? "0" : prev.socavon,
      }));
      return;
    }

    setRowData((prev) => ({ ...prev, [field]: value }));
  };

  const getAñoInicial = (fecha) => {
    const match = fecha.match(/\d{4}/); // Busca el primer año (4 dígitos)
    return match ? parseInt(match[0], 10) : Infinity;
  };

  const handleRegistrar = async () => {
    // Validar que al menos año y empresa estén llenos (puedes ajustar la validación)
    if (!rowData.fecha || !rowData.empresa) {
      await Swal.fire("Error", "Faltan datos", "error");
      return;
    }
    const nuevaLista = [...registros, rowData];
    nuevaLista.sort((a, b) => getAñoInicial(a.fecha) - getAñoInicial(b.fecha));
    setRegistros(nuevaLista);
    setRowData({
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
    });
    setSearchEmpresa("");
    setSearchCargoOcupacion("");
    setSearchAltitud("");
    setSearchArea("");
    setSearchRiesgo("");
    setSearchProt("");
  };

  const handleClean = () => {
    setForm({
      norden: "",
      nombres: "",
      fecha: today,
      areaO: "",
      dni: "",
    });
    setRowData({
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
    });
    setRegistros([]);
    setSearchEmpresa("");
    setSearchCargoOcupacion("");
    setSearchAltitud("");
    setSearchRiesgo("");
    setSearchProt("");
    setSearchArea("");
  };

  const handleset = () => {
    setForm((f) => ({
      ...f,
      nombres: "",
      areaO: "",
      fecha: today,
    }));
    setRegistros([]);
    setSearchEmpresa("");
    setSearchCargoOcupacion("");
    setSearchAltitud("");
    setSearchArea("");
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleEditChange = (index, field, value) => {
    setRegistros((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Historia Ocupacional?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
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
        PrintHojaR(form.norden, token, tabla);
      }
    });
  };

  const deleteRow = async (indexToRemove) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar fila?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      setRegistros((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  return (
    <div
      className={styles.historiaOcupacionalContainer}
      style={{ fontSize: 13, color: "#000" }}
    >
      <h1
        className={styles.tituloPrincipal}
        style={{ fontSize: 15, color: "#000", fontWeight: "bold" }}
      >
        HISTORIAL OCUPACIONAL
      </h1>
      <fieldset className={styles.fieldset}>
        <legend style={{ fontSize: 15, color: "#000" }}>
          Datos Historia ocupacional
        </legend>
        <div className={styles.rowCampos}>
          <div className={styles.campoGrupo}>
            <label style={{ color: "#000" }}>N° Orden :</label>
            <input
              type="text"
              name="norden"
              className={styles.inputSmall}
              value={form.norden}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  handleset();
                  VerifyTR(
                    form.norden,
                    tabla,
                    token,
                    setForm,
                    selectedSede,
                    setRegistros
                  );
                }
              }}
              onChange={(e) => handleInputChange(e)}
              placeholder=""
              style={{ fontSize: 13, color: "#000" }}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: "#000" }}>Nombres y Apellidos :</label>
            <input
              type="text"
              className={styles.inputLarge}
              value={form.nombres}
              name="nombres"
              disabled
              placeholder="Nombre y Apellido"
              style={{ fontSize: 13, color: "#000" }}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: "#000" }}>Área de Trabajo :</label>
            <input
              type="text"
              value={form.areaO}
              name="areaO"
              autoComplete="off"
              // onChange={handleInputChange}
              disabled
              className={styles.inputXLarge}
              style={{ fontSize: 13, color: "#000" }}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: "#000" }}>Fecha :</label>
            <input
              type="date"
              value={form.fecha}
              onChange={handleInputChange}
              name="fecha"
              className={`${styles.inputSmall} w-auto`}
              placeholder="dd/mm/aa"
              style={{ fontSize: 13, color: "#000" }}
            />
          </div>
        </div>
      </fieldset>
      <div className={styles.tableWrapper}>
        <table
          className={`${styles.historiaTable} mb-48`}
          style={{ fontSize: 13, color: "#000" }}
        >
          <thead>
            <tr>
              <th rowSpan={2}>Año</th>
              <th rowSpan={2}>Empresa - Lugar Geográfico</th>
              <th rowSpan={2}>Altitud</th>
              <th rowSpan={2}>Actividad</th>
              <th rowSpan={2}>Área Empresa</th>
              <th rowSpan={2}>Ocupación</th>
              <th colSpan={2} style={{ textAlign: "center" }}>
                Tiempo de Labor
              </th>
              <th rowSpan={2}>Riesgos</th>
              <th rowSpan={2}>Protección</th>
            </tr>
            <tr>
              <th>Socavon</th>
              <th>Superficie</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <AutoResizeInput
                  value={rowData.fecha}
                  onChange={(e) =>
                    handleRowChange("fecha", e.target.value.toUpperCase())
                  }
                />
              </td>
              <td>
                {/* <AutoResizeInput
                  value={rowData.empresa}
                  onChange={(e) => handleRowChange("empresa", e.target.value)}
                /> */}
                <div className="relative">
                  <div className="flex flex-col items-center justify-center">
                    <textarea
                      autoComplete="off"
                      rows={5}
                      className={`resize-none overflow-hidden w-full bg-transparent outline-none `}
                      value={searchEmpresa}
                      name="empresa"
                      onChange={(e) => {
                        // Ajustar altura
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;

                        handleSearch(
                          e,
                          setSearchEmpresa,
                          handleRowChange,
                          setFilteredEmpresa,
                          EmpresasMulti
                        );
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" && filteredEmpresa.length > 0) {
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
                    {searchEmpresa && filteredEmpresa.length > 0 && (
                      <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-60">
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
              <td>
                {/* <AutoResizeInput
                  value={rowData.altitud}
                  onChange={(e) => handleRowChange("altitud", e.target.value)}
                /> */}
                <div className="relative">
                  <div className="flex flex-col items-center justify-center">
                    <textarea
                      type="text"
                      id="altitud"
                      rows={5}
                      autoComplete="off"
                      className={`resize-none overflow-hidden w-full bg-transparent outline-none `}
                      value={searchAltitud}
                      name="altitud"
                      onChange={(e) => {
                        // Ajustar altura
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                        handleSearch(
                          e,
                          setSearchAltitud,
                          handleRowChange,
                          setFilteredAltitud,
                          AlturaMulti
                        );
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" && filteredAltitud.length > 0) {
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
                    {searchAltitud && filteredAltitud.length > 0 && (
                      <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-50">
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
              <td>
                <AutoResizeInput
                  value={rowData.actividad}
                  onChange={(e) =>
                    handleRowChange("actividad", e.target.value.toUpperCase())
                  }
                />
              </td>
              <td>
                {/* <AutoResizeInput
                  value={rowData.areaEmpresa}
                  onChange={(e) =>
                    handleRowChange("areaEmpresa", e.target.value)
                  }
                /> */}
                <div className="relative">
                  <div className="flex flex-col items-center justify-center">
                    <textarea
                      type="text"
                      id="areaEmpresa"
                      autoComplete="off"
                      rows={5}
                      className={`resize-none overflow-hidden w-full bg-transparent outline-none `}
                      value={searchArea}
                      name="areaEmpresa"
                      onChange={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
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
                      onBlur={() => setTimeout(() => setFilteredArea([]), 100)}
                    />
                    {searchArea && filteredArea.length > 0 && (
                      <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
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
              <td>
                {/* <AutoResizeInput
                  value={rowData.ocupacion}
                  onChange={(e) => handleRowChange("ocupacion", e.target.value)}
                /> */}
                <div className="relative">
                  <div className="flex flex-col items-center justify-center">
                    <textarea
                      autoComplete="off"
                      rows={5}
                      className={`resize-none overflow-hidden w-full bg-transparent outline-none `}
                      value={searchCargoOcupacion}
                      name="ocupacion"
                      onChange={(e) => {
                        // Ajustar altura
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;

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
                          // document.getElementById("altitud")?.focus();
                        }
                      }}
                      onBlur={() =>
                        setTimeout(() => setFilteredCargoOcupacion([]), 100)
                      }
                    />
                    {searchCargoOcupacion &&
                      filteredCargoOcupacion.length > 0 && (
                        <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-60">
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
              <td>
                <AutoResizeInput
                  value={rowData.socavon}
                  onChange={(e) =>
                    handleRowChange("socavon", e.target.value.toUpperCase())
                  }
                />
              </td>
              <td>
                <AutoResizeInput
                  value={rowData.superficie}
                  onChange={(e) =>
                    handleRowChange("superficie", e.target.value.toUpperCase())
                  }
                />
              </td>
              <td>
                <AutoResizeInput
                  value={rowData.riesgo}
                  onChange={(e) => {
                    setSearchRiesgo(e.target.value);
                    handleRowChange("riesgo", e.target.value.toUpperCase());
                  }}
                />
              </td>
              <td>
                <AutoResizeInput
                  value={rowData.proteccion}
                  onChange={(e) => {
                    setSearchProt(e.target.value);
                    handleRowChange("proteccion", e.target.value.toUpperCase());
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Buscadores debajo de la tabla */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2em",
          marginTop: 24,
          alignItems: "flex-end",
        }}
      >
        {/*EMPRESA*/}
        {/* <div className='relative'>
          <div className='flex flex-col items-center justify-center'>
              <label htmlFor="">Empresas</label>
              <input type="text" autoComplete='off' className={styles.inputLarge} value={searchEmpresa} name='empresa'
                onChange={(e) => {handleSearch(e,setSearchEmpresa,handleRowChange,setFilteredEmpresa,EmpresasMulti)}}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && filteredEmpresa.length > 0) {
                    e.preventDefault();
                    handleSelect(e,e.target.name,filteredEmpresa[0].mensaje,setSearchEmpresa,handleRowChange,setFilteredEmpresa);
                    document.getElementById('altitud').focus();
                  }
                }}
                onBlur={() => setTimeout(() => setFilteredEmpresa([]), 100)}/>
              {searchEmpresa && filteredEmpresa.length > 0 && (
                <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                  {filteredEmpresa.map((opt) => (
                    <li
                      key={opt.id}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                      onMouseDown={(e) => handleSelect(e,'empresa',opt.mensaje,setSearchEmpresa,handleRowChange,setFilteredEmpresa)}
                    >
                      {opt.mensaje}
                    </li>
                  ))}
                </ul>
              )}
          </div>
          
        </div> */}
        {/*ALTITUD*/}
        {/* <div className="relative">
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="">Altitud</label>
            <input
              type="text"
              id="altitud"
              autoComplete="off"
              className={styles.inputLarge}
              value={searchAltitud}
              name="altitud"
              onChange={(e) => {
                handleSearch(
                  e,
                  setSearchAltitud,
                  handleRowChange,
                  setFilteredAltitud,
                  AlturaMulti
                );
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" && filteredAltitud.length > 0) {
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
              onBlur={() => setTimeout(() => setFilteredAltitud([]), 100)}
            />
            {searchAltitud && filteredAltitud.length > 0 && (
              <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-50">
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
        </div> */}
        {/*AREAS*/}
        {/* <div className="relative">
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="">Areas</label>
            <input
              type="text"
              id="areaEmpresa"
              autoComplete="off"
              className={styles.inputLarge}
              value={searchArea}
              name="areaEmpresa"
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
              onBlur={() => setTimeout(() => setFilteredArea([]), 100)}
            />
            {searchArea && filteredArea.length > 0 && (
              <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
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
        </div> */}
        {/*RIESGOS */}
        <div className="relative flex-1">
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="">Riesgos</label>
            <input
              type="text"
              id="riesgo"
              autoComplete="off"
              // className={styles.inputLarge}
              className={`${styles.inputLarge} min-w-[100%]`}
              value={searchRiesgo}
              name="riesgo"
              onFocus={() => {
                setFilteredRiesgo(riesgosOptions);
              }}
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
                if (e.key === "Enter" && filteredRiesgo.length > 0) {
                  e.preventDefault();
                  handleSelect(
                    e,
                    e.target.name,
                    filteredRiesgo[0].mensaje,
                    setSearchRiesgo,
                    handleRowChange,
                    setFilteredRiesgo
                  );
                  document.getElementById("proteccion").focus();
                }
              }}
              onBlur={() => setTimeout(() => setFilteredRiesgo([]), 100)}
            />
            {true && (
              <ul className="absolute inset-x-0 top-full bg-white  border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
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
        {/*EPPS*/}
        <div className="relative flex-1 ">
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="">Protección</label>
            <input
              type="text"
              id="proteccion"
              autoComplete="off"
              className={`${styles.inputLarge} min-w-[100%]`}
              value={searchProt}
              name="proteccion"
              onFocus={() => {
                setFilteredProt(proteccionOptions);
              }}
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
              onBlur={() => setTimeout(() => setFilteredProt([]), 100)}
            />
            {true && (
              <ul className="absolute inset-x-0 top-full bg-white  border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
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
        <button
          type="button"
          style={{
            height: 32,
            marginLeft: "auto",
            background: "#233245",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "0 16px",
            cursor: "pointer",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onClick={handleRegistrar}
        >
          <i className="fas fa-plus"></i> Registrar
        </button>
      </div>
      {/* Preview de registros vacío */}
      {registros.length === 0 && (
        <div
          style={{
            border: "1px dashed #bbb",
            background: "#f7f7f7",
            color: "#888",
            padding: 24,
            margin: "24px 0",
            borderRadius: 6,
            textAlign: "center",
            fontSize: 13,
          }}
        >
          Aquí se mostrarán los registros
        </div>
      )}
      {/* Tabla de registros */}
      {registros.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 15, color: "#000", fontWeight: "bold" , marginBottom:"1em"}}>
            Lista de Registros
          </h3>
          <div className={styles.tableWrapper}>
            <table
              className={styles.historiaTable}
              style={{ fontSize: 13, color: "#000" }}
            >
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
                </tr>
              </thead>
              <tbody>
                {registros.map((reg, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 cursor-pointer"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      deleteRow(idx);
                    }}
                  >
                    <td>
                      <AutoResizeInput
                        value={reg.fecha}
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
                        onChange={(e) =>
                          handleEditChange(
                            idx,
                            "proteccion",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bloque EPP visual al final */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          marginTop: 40,
          padding: 12,
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          background: "#fafbfc",
          fontSize: 13,
          color: "#000",
        }}
      >
        <div style={{ fontWeight: "bold", minWidth: 220, fontSize: 15 }}>
          EPP: Equipo de Protección Personal
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Imprimir N° Orden :
            <input
              type="text"
              value={form.norden}
              name="norden"
              onChange={handleInputChange}
              style={{
                width: 80,
                marginLeft: 8,
                border: "1px solid #ccc",
                borderRadius: 3,
                padding: "2px 6px",
                fontSize: 13,
                color: "#000",
              }}
            />
            <button
              onClick={handlePrint}
              style={{
                marginLeft: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#000",
                fontSize: 16,
              }}
            >
              <i className="fas fa-print"></i>
            </button>
          </div>
        </div>
        <fieldset
          style={{
            border: "1px solid #bbb",
            borderRadius: 4,
            padding: 8,
            minWidth: 260,
          }}
        >
          <button
            onClick={() => {
              SubmiteHistoriaOcupacionalController(
                form,
                token,
                userlogued,
                handleClean,
                tabla,
                registros
              );
            }}
            style={{
              height: 32,
              background: "#059669",
              color: "#fff",
              border: "none",
              borderRadius: 3,
              padding: "0 16px",
              marginRight: 8,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <i className="fas fa-save" style={{ marginRight: 6 }}></i>{" "}
            Guardar/Actualizar
          </button>
          <button
            onClick={handleClean}
            style={{
              height: 32,
              background: "#fc6b03",
              color: "#fff",
              border: "none",
              borderRadius: 3,
              padding: "0 16px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <i className="fas fa-broom" style={{ marginRight: 6 }}></i> Limpiar
          </button>
        </fieldset>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginLeft: 16,
            width: "50%",
          }}
        >
          <div className="flex  items-center ">
            <p className="min-w-[120px]">DNI Responsable :</p>
            <input
              type="text"
              disabled
              value={form.dniUser}
              className="p-2 w-full"
              style={{
                marginLeft: 4,
                fontSize: 13,
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
          <div className="flex  items-center ">
            <p className="min-w-[120px]"> Nombres :</p>
            <input
              type="text"
              disabled
              value={form.nombreUser}
              className="p-2 w-full"
              style={{
                marginLeft: 4,
                fontSize: 13,
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriaOcupacional;
