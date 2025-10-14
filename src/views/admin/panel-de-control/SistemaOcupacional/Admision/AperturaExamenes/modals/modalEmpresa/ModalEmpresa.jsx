import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faMouse,
  faPlus,
  faEdit,
  faBroom,
  faFileExport,
  faUnlock,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { SubmitNewEmpresa } from "./CRUD";
import InputTextOneLine from "../../../../../../../components/reusableComponents/InputTextOneLine";

const ModalEmpresa = ({
  isOpen,
  onClose,
  onSave,
  Swal,
  Get,
  token,
  GetRazonS,
}) => {
  const [formData, setFormData] = useState({
    ruc: "",
    razonSocial: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
    telefonos: "",
    responsable: "",
    email: "",
  });
  const [List, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [habilitar, setHabilitar] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [existeRUC, setExisteRUC] = useState(true);
  const [puedeHabilitar, setPuedeHabilitar] = useState(false);

  useEffect(() => {
    Get(`/api/v01/ct/infoAdmisionEmpresa/listadoEmpresas`, token).then(
      (res) => {
        setList(res);
        setFilteredList(res);
      }
    );
  }, [refresh]);

  const existeEmpresa = (ruc) => {
    Get(
      `/api/v01/ct/infoAdmisionEmpresa/validarExistenciaEmpresa?ruc=${ruc}`,
      token
    )
      .then((res) => {
        if (res.id == 1) {
          setExisteRUC(true);
          setPuedeHabilitar(false);
          Swal.fire("Error", "El RUC ya existe", "error");
        } else {
          buscarEmpresaenLinea(ruc);
          // setExisteRUC(false);
          // setPuedeHabilitar(true);
        }
      })
      .catch((error) => {
        console.error("Error checking RUC existence:", error);
        setExisteRUC(false);
        setPuedeHabilitar(true);
        // Swal.fire("Error", "Error al verificar el RUC", "error");
      });
  };

  const buscarEmpresaenLinea = (ruc) => {
    Get(
      `/api/v01/ct/infoAdmisionEmpresa/datosEmpresa/${ruc}`,
      token
    )
      .then((res) => {
        if (res.ruc == ruc) {
          setFormData((prev) => ({
            ...prev,
            ruc: res.ruc || "",
            razonSocial: res.razonSocial || "",
            direccion: res.direccion || "",
            distrito: res.distrito || "",
            provincia: res.provincia || "",
            departamento: res.departamento || "",
            responsable: res.responsable || "",
          }));
          Swal.fire("Success", "Empresa no registrada. Datos encontrados en Línea", "success");
        }
      })
      .catch((error) => {
        console.error("Error checking RUC existence:", error);
        // Swal.fire("Error", "Error al verificar el RUC", "error");
      })
      .finally(() => {
        setExisteRUC(false);
        setPuedeHabilitar(true);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    const filtered = List.filter((item) =>
      item.razonEmpresa.toUpperCase().includes(value)
    );
    setFilteredList(filtered);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredList.length > 0) {
      const selectedItem = filteredList[0];
      setFormData({
        ruc: selectedItem.rucEmpresa || "",
        razonSocial: selectedItem.razonEmpresa || "",
        direccion: selectedItem.direccionEmpresa || "",
        telefonos: selectedItem.telefonoEmpresa || "",
        responsable: selectedItem.responsableEmpresa || "",
        email: selectedItem.emailEmpresa || "",
      });
    }
  };
  const handleRucPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').trim();
    setFormData((prev) => ({
      ...prev,
      ruc: pastedText.toUpperCase(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const camposRequeridos = ["ruc", "razonSocial"]; // agrega los campos que quieras
    const camposVacios = camposRequeridos.filter((campo) => !formData[campo]);
    if (camposVacios.length > 0) {
      return Swal.fire("Error", "Complete los campos vacíos", "error");
    }
    const datos = {
      rucEmpresa: formData.ruc,
      razonEmpresa: formData.razonSocial,
      direccionEmpresa: formData.direccion,
      telefonoEmpresa: formData.telefonos,
      distritoEmpresa: formData.distrito,
      provinciaEmpresa: formData.provincia,
      departamentoEmpresa: formData.departamento,
      responsableEmpresa: formData.responsable,
      emailEmpresa: formData.email,
      apiToken: null,
    };

    Swal.fire({
      title: "Guardando cambios",
      text: "Por favor espere...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    SubmitNewEmpresa(datos, token).then((res) => {
      if (res.rucEmpresa) {
        Swal.fire("Exito!", `Se Registro/Actualizo con exito`, "success");
        setRefresh(refresh + 1);
        handleClear();
      }
    });
  };

  const ReturnRS = (e) => {
    GetRazonS(e);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      ruc: "",
      razonSocial: "",
      direccion: "",
      distrito: "",
      provincia: "",
      departamento: "",
      telefonos: "",
      responsable: "",
      email: "",
    });
    setSearchTerm("");
    setFilteredList(List);
    onClose();
  };

  const handleClear = () => {
    setFormData({
      ruc: "",
      razonSocial: "",
      direccion: "",
      distrito: "",
      provincia: "",
      departamento: "",
      telefonos: "",
      responsable: "",
      email: "",
    });
    setSearchTerm("");
    setFilteredList(List);
    setExisteRUC(true);
    setHabilitar(false);
    setPuedeHabilitar(false);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[800px] relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-600 text-xl font-semibold">
            Agregar Empresa
          </h2>
          <div className="text-sm text-gray-500">
            Agregue su Empresa y ESC para Cerrar
          </div>
        </div>

        <div className="grid grid-cols-[100px,1fr,200px] gap-2 items-center">
          <label className="text-right">RUC:</label>
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              onPaste={handleRucPaste}
              className={`border rounded px-2 py-1 flex-1 ${habilitar ? "bg-slate-300" : "bg-white"
                }`}
              maxLength={11}
              disabled={habilitar}
              required
            />
            <div className="flex justify-between items-center ">
              <button
                type="button"
                onClick={() => existeEmpresa(formData.ruc)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-base px-6 py-2 rounded flex items-center gap-2 w-full  max-w-[120px]"
              >
                <FontAwesomeIcon icon={faSearch} /> Validar
              </button>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={(e) => {
                handleSubmit(e);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded  flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar
            </button>
          </div>

          <label className="text-right">Razón Social:</label>
          <input
            type="text"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            disabled={habilitar || existeRUC}
            className={`border rounded px-2 py-1 ${habilitar || existeRUC ? "bg-slate-300" : "bg-white"
              }`}
            required
          />
          <button
            type="button"
            onClick={(e) => {
              handleSubmit(e);
            }}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded  flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faEdit} /> Actualizar
          </button>

          <label className="text-right">Dirección:</label>
          <input
            type="text"
            name="direccion"
            disabled={habilitar || existeRUC}
            value={formData.direccion}
            onChange={handleChange}
            className={`border rounded px-2 py-1 ${habilitar || existeRUC ? "bg-slate-300" : "bg-white"
              }`}
          />
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1 bg-yellow-500 text-white rounded  flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
          <label className="text-right">Distrito:</label>
          <InputTextOneLine
            name="distrito"
            value={formData.distrito}
            onChange={handleChange}
            disabled={habilitar || existeRUC}
            inputClassName={` ${habilitar || existeRUC ? "bg-slate-300" : "bg-white"
              }`}
          />
          <button
            type="button"
            className="px-3 py-1 bg-green-600 text-white rounded  flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileExport} /> Exportar
          </button>
          <label className="text-right">Provincia:</label>
          <InputTextOneLine
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            disabled={habilitar || existeRUC}
            inputClassName={` ${habilitar || existeRUC ? "bg-slate-300" : "bg-white"
              }`}
          />
          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1 bg-red-500 text-white rounded  flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} /> Cerrar
          </button>

          <label className="text-right">Departamento:</label>
          <InputTextOneLine
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            disabled={habilitar || existeRUC}
            inputClassName={` ${habilitar || existeRUC ? "bg-slate-300" : "bg-white"
              }`}
          />
          <button
            type="button"
            onClick={() => {
              setHabilitar(!habilitar);
              setExisteRUC(false);
            }}
            disabled={!puedeHabilitar}
            className="px-3 py-1 bg-green-500 text-white rounded  flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faUnlock} /> Habilitar
          </button>
          <label className="text-right">Teléfonos:</label>
          <input
            type="text"
            disabled={habilitar || existeRUC}
            name="telefonos"
            value={formData.telefonos}
            onChange={handleChange}
            className={`border rounded px-2 py-1 ${habilitar || existeRUC ? "bg-slate-300" : "bg-white"
              }`}
          />
          <div />

          <label className="text-right">Responsable:</label>
          <input
            type="text"
            disabled={habilitar || existeRUC}
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
            className={`border rounded px-2 py-1 ${habilitar || existeRUC ? "bg-slate-300" : "bg-white"
              }`}
          />
          <div />

          <label className="text-right">Email:</label>
          <input
            type="email"
            disabled={habilitar || existeRUC}
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`border rounded px-2 py-1 ${habilitar || existeRUC ? "bg-slate-300" : "bg-white"
              }`}
          />
          <div />
        </div>

        {/* Search Razón Social input */}
        <div className="mt-4 mb-2">
          <div className="flex items-center gap-2">
            <label className="text-right w-[100px]">Razón Social:</label>
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="Buscar razón social..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredList(List);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="mb-2 text-md text-red-600 flex items-center gap-2"
          style={{ fontWeight: "500" }}
        >
          <FontAwesomeIcon icon={faMouse} className="text-blue-600" />
          <span>
            Click izquierdo: Llena los datos | Click derecho: Envía al registro
          </span>
        </div>

        {/* Table section */}
        <div className="mt-2">
          <div className="border rounded">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">RUC</th>
                    <th className="px-4 py-2 text-left">Raz. Social</th>
                    <th className="px-4 py-2 text-left">Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => {
                        setFormData({
                          ruc: item.rucEmpresa || "",
                          razonSocial: item.razonEmpresa || "",
                          direccion: item.direccionEmpresa || "",
                          distrito: item.distritoEmpresa || "",
                          provincia: item.provinciaEmpresa || "",
                          departamento: item.departamentoEmpresa || "",
                          telefonos: item.telefonoEmpresa || "",
                          responsable: item.responsableEmpresa || "",
                          email: item.emailEmpresa || "",
                        }),
                          setHabilitar(true);
                        setPuedeHabilitar(true);
                        setExisteRUC(false);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault(), ReturnRS(item.razonEmpresa);
                      }}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{item.rucEmpresa}</td>
                      <td className="px-4 py-2">{item.razonEmpresa}</td>
                      <td className="px-4 py-2">{item.direccionEmpresa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEmpresa;
