import { useState, useEffect } from "react";
import { VerifyTR } from "../ControllerLC/ControllerLC";
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { getFetch } from "../../../../getFetch/getFetch";
import Swal from 'sweetalert2';
import {
  InputTextOneLine,
  InputCheckbox,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

export const HematologiaBioquimicaSIEO = ({
  form,
  setForm,
  setFormO,
  listDoc,
  setSearchMedico,
  searchMedico,
}) => {
  const { token, selectedSede } = useSessionData();
  const tabla = "lab_clinico";
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const [tableLab, settableLab] = useState([]);
  const [filteredMedicos, setFilteredMedicos] = useState([]);
  const [hematologiaNA, setHematologiaNA] = useState(false);
  const [rprNA, setRprNA] = useState(true);
  const [vihNA, setVihNA] = useState(true);

  const setField = (field, value) => {
    if (value && value.trim && value.trim().toUpperCase() === "N/A") {
      value = "N/A";
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (value && value.trim().toUpperCase() === "N/A") {
      value = "N/A";
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleClear = () => {
    setForm((f) => ({
      ...f,
      fecha: today,
      paciente: "",
      empContratista: "",
      empresa: "",
      empresaNA: false,
      grupo: "",
      rh: "",
      hemoglobina: "",
      hematocrito: "",
      vsg: "",
      leucocitos: "",
      hematies: "",
      plaquetas: "",
      linfocitos: "",
      neutrofilos: "",
      abastonados: "",
      segmentados: "",
      monocitos: "",
      eosinofilos: "",
      basofilos: "",
      glucosa: "",
      glucosaNA: false,
      creatinina: "",
      creatininaNA: false,
      rpr: "N/A",
      rprNA: false,
      vih: "N/A",
      vihNA: false,
      gfSangPedido: "",
    }));
    settableLab([]);
  };

  const GetTable = (nro) => {
    getFetch(
      `/api/v01/ct/laboratorio/listadoGrupoFactorSanguineo?nOrden=${nro}`,
      token
    ).then((res) => {
      settableLab(res || []);
    });
  };

  useEffect(() => {
    const grupo = form.grupo || "";
    const rh = (form.rh || "").replace("Rh", "");
    setField("gfSangPedido", `${grupo} ${rh}`.trim());
  }, [form.grupo, form.rh]);

  const handleMedicoSearch = (e) => {
    const v = e.target.value.toUpperCase();
    setSearchMedico(v);
    setField("responsable", v);
    setFilteredMedicos(
      v ? listDoc.filter((m) => m.toLowerCase().includes(v.toLowerCase())) : []
    );
  };

  const handleSelectMedico = (m) => {
    setSearchMedico(m);
    setField("responsable", m);
    setFilteredMedicos([]);
  };

  const hematologiaKeys = [
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
  ];

  useEffect(() => {
    const hematoCampos = [...hematologiaKeys, "glucosa", "creatinina"];
    const hayDatos = hematoCampos.some((k) => form[k] && form[k] !== "N/A");
    if (hayDatos) {
      if (hematologiaNA) setHematologiaNA(false);
      if (form.glucosaNA) setField("glucosaNA", false);
      if (form.creatininaNA) setField("creatininaNA", false);
    }
  }, [form]);

  const handleHematologiaNA = (checked) => {
    setHematologiaNA(checked);
    const value = checked ? "N/A".trim() : "";
    setForm((prev) => {
      const newFields = {};
      hematologiaKeys.forEach((k) => {
        if (["hemoglobina", "hematocrito"].includes(k)) {
          newFields[k] = checked ? "" : "";
        } else {
          newFields[k] = value;
        }
      });
      newFields["glucosa"] = checked ? "" : "";
      newFields["glucosaNA"] = false;
      newFields["creatinina"] = value;
      newFields["creatininaNA"] = checked;
      return { ...prev, ...newFields };
    });
    if (checked) {
      setField("grupo", "");
      setField("rh", "");
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!form.norden) {
        Swal.fire("Error", "Debe Introducir un Nro de Historia Clínica válido", "error");
        return;
      }
      handleClear();
      VerifyTR(form.norden, tabla, token, setForm, setFormO, selectedSede, setSearchMedico);
      GetTable(form.norden);
    }
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="w-full max-w-[100vw] mx-auto bg-white rounded shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">HEMATOLOGÍA - BIOQUÍMICA SI-EO</h2>

      {/* Barra superior */}
      <SectionFieldset legend="Información General" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden || ""}
            onChange={handleInputChange}
            onKeyUp={handleSearch}
            labelWidth="100px"
            inputClassName="w-36"
          />
          <InputCheckbox
            label="Consultas"
            checked={false}
            onChange={() => {}}
            disabled
          />
          <InputCheckbox
            label="Particular"
            checked={false}
            onChange={() => {}}
            disabled
          />
          <InputCheckbox
            label="Ficha Médica Ocupacional"
            checked={true}
            onChange={() => {}}
            disabled
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine
            label="N° Recibo"
            name="recibo"
            value=""
            disabled
            labelWidth="100px"
            inputClassName="w-36"
          />
          <InputTextOneLine
            label="DNI"
            name="dni"
            value={form.dni || ""}
            disabled
            labelWidth="60px"
            inputClassName="w-36"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha || ""}
            onChange={handleInputChange}
            labelWidth="80px"
            inputClassName="w-44"
          />
        </div>
        <div className="flex items-center gap-4 justify-end pt-2 border-t">
          <button
            onClick={() => setField("ficha", !form.ficha)}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded font-bold"
          >
            Editar
          </button>
          <InputCheckbox
            label={<span className="text-red-600 font-bold">INCOMPLETO</span>}
            checked={!form.ficha}
            onChange={(v) => setField("ficha", !v)}
          />
        </div>
      </SectionFieldset>

      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna 1 */}
        <div className="space-y-6">
          {/* Hematología */}
          <SectionFieldset legend="Hematología" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-xl text-[#233245]">Hematología</span>
              <InputCheckbox
                label={<span className="font-medium">N/A</span>}
                checked={hematologiaNA}
                onChange={handleHematologiaNA}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="w-40 font-medium text-[#233245]">Grupo Sanguíneo:</label>
                  <div className="flex gap-4 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
                    {["O", "A", "B", "AB"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1 text-gray-900 font-medium">
                        <input
                          type="radio"
                          name="grupo"
                          value={opt}
                          checked={form.grupo === opt}
                          onClick={(e) =>
                            setField("grupo", form.grupo === e.target.value ? "" : e.target.value)
                          }
                          disabled={form.empresaNA}
                          className="accent-blue-600 w-5 h-5"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-40 font-medium text-[#233245]">Factor Rh:</label>
                  <div className="flex gap-4 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
                    <label className="flex items-center gap-1 text-gray-900 font-medium">
                      <input
                        type="radio"
                        name="rh"
                        value="Rh(+)"
                        checked={form.rh === "Rh(+)"}
                        onClick={(e) => setField("rh", form.rh === e.target.value ? "" : e.target.value)}
                        disabled={form.empresaNA}
                        className="accent-blue-600 w-5 h-5"
                      />
                      Rh(+)
                    </label>
                    <label className="flex items-center gap-1 text-gray-900 font-medium">
                      <input
                        type="radio"
                        name="rh"
                        value="Rh(-)"
                        checked={form.rh === "Rh(-)"}
                        onClick={(e) => setField("rh", form.rh === e.target.value ? "" : e.target.value)}
                        disabled={form.empresaNA}
                        className="accent-blue-600 w-5 h-5"
                      />
                      Rh(-)
                    </label>
                  </div>
                </div>
                {[
                  ["hemoglobina", "g/dl"],
                  ["hematocrito", "%"],
                  ["vsg", "mm/Hora"],
                  ["leucocitos", "mm³"],
                  ["hematies", "mm³"],
                  ["plaquetas", "mm³"],
                ].map(([key, unit]) => (
                  <div key={key} className="flex items-center gap-4">
                    <label className="font-medium min-w-[100px] ">{capitalize(key)}:</label>
                    <input
                      name={key}
                      value={form[key] || ""}
                      onChange={handleInputChange}
                      className={`border rounded px-2 py-1 w-32 ${
                        form.empresaNA ? "bg-gray-200 text-gray-500" : ""
                      }`}
                      disabled={form.empresaNA}
                    />
                    <span className="ml-2 w-16 font-medium ">{unit}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  ["neutrofilos", "%"],
                  ["abastonados", "%"],
                  ["segmentados", "%"],
                  ["monocitos", "%"],
                  ["eosinofilos", "%"],
                  ["basofilos", "%"],
                  ["linfocitos", "%"],
                ].map(([key, unit]) => (
                  <div key={key} className="flex items-center gap-4">
                    <label className="font-medium min-w-[100px] ">{capitalize(key)}:</label>
                    <input
                      name={key}
                      value={form[key] || ""}
                      onChange={handleInputChange}
                      className={`border rounded px-2 py-1 w-32 ${
                        form.empresaNA ? "bg-gray-200 text-gray-500" : ""
                      }`}
                      disabled={form.empresaNA}
                    />
                    <span className="ml-2 w-16 font-medium ">{unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionFieldset>

          {/* Reacciones Serológicas */}
          <SectionFieldset legend="Reacciones Serológicas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="w-20 font-medium text-[#233245]">RPR:</label>
                  <InputTextOneLine
                    name="rpr"
                    value={form.rpr || ""}
                    onChange={handleInputChange}
                    disabled={rprNA}
                    inputClassName={`flex-1 ${rprNA ? "bg-gray-200 text-gray-500" : ""}`}
                  />
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <InputCheckbox
                    label={<span className="font-medium">-</span>}
                    checked={form.rpr === "NEGATIVO"}
                    onChange={() => {
                      setField("rpr", "NEGATIVO");
                      setField("rprNA", false);
                    }}
                  />
                  <InputCheckbox
                    label={<span className="font-medium">+</span>}
                    checked={form.rpr === "POSITIVO"}
                    onChange={() => {
                      setField("rpr", "POSITIVO");
                      setField("rprNA", false);
                    }}
                  />
                  <InputCheckbox
                    label={<span className="font-medium">N/A</span>}
                    checked={form.rpr === "N/A"}
                    onChange={(v) => {
                      setRprNA(v);
                      setField("rprNA", v);
                      setField("rpr", v ? "N/A".trim() : "");
                    }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="w-20 font-medium text-[#233245]">VIH:</label>
                  <InputTextOneLine
                    name="vih"
                    value={form.vih || ""}
                    onChange={handleInputChange}
                    disabled={vihNA}
                    inputClassName={`flex-1 ${vihNA ? "bg-gray-200 text-gray-500" : ""}`}
                  />
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <InputCheckbox
                    label={<span className="font-medium">-</span>}
                    checked={form.vih === "NEGATIVO"}
                    onChange={() => {
                      setField("vih", "NEGATIVO");
                      setField("vihNA", false);
                    }}
                  />
                  <InputCheckbox
                    label={<span className="font-medium">+</span>}
                    checked={form.vih === "POSITIVO"}
                    onChange={() => {
                      setField("vih", "POSITIVO");
                      setField("vihNA", false);
                    }}
                  />
                  <InputCheckbox
                    label={<span className="font-medium">N/A</span>}
                    checked={form.vih === "N/A"}
                    onChange={(v) => {
                      setVihNA(v);
                      setField("vihNA", v);
                      setField("vih", v ? "N/A".trim() : "");
                    }}
                  />
                </div>
              </div>
            </div>
          </SectionFieldset>
        </div>

        {/* Columna 2 */}
        <div className="space-y-6">
          {/* Datos del Paciente */}
          <SectionFieldset legend="Datos del Paciente" className="space-y-4">
            <div className="relative">
              <InputTextOneLine
                label="Responsable Lab"
                name="responsable"
                value={searchMedico}
                onChange={handleMedicoSearch}
                labelWidth="140px"
                inputClassName="bg-gray-100 font-bold"
                onKeyUp={(e) => {
                  if (e.key === "Enter" && filteredMedicos.length > 0) {
                    e.preventDefault();
                    handleSelectMedico(filteredMedicos[0]);
                  }
                }}
                onFocus={() => {
                  if (searchMedico) {
                    setFilteredMedicos(
                      listDoc.filter((m) =>
                        m.toLowerCase().includes(searchMedico.toLowerCase())
                      )
                    );
                  }
                }}
                onBlur={() => setTimeout(() => setFilteredMedicos([]), 100)}
              />
              {searchMedico && filteredMedicos.length > 0 && (
                <ul className="absolute left-[140px] right-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
                  {filteredMedicos.map((m) => (
                    <li
                      key={m}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 font-bold"
                      onMouseDown={() => handleSelectMedico(m)}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-4">
              <InputTextOneLine
                label="Nombres"
                name="paciente"
                value={form.paciente || ""}
                disabled
                labelWidth="140px"
              />
              <InputTextOneLine
                label="G.F. Sang. Pedido"
                name="gfSangPedido"
                value={form.gfSangPedido || ""}
                disabled
                labelWidth="140px"
                inputClassName="w-44"
              />
              <InputTextOneLine
                label="Emp. Contratista"
                name="empContratista"
                value={form.empContratista || ""}
                disabled
                labelWidth="140px"
              />
              <InputTextOneLine
                label="Empresa"
                name="empresa"
                value={form.empresa || ""}
                disabled
                labelWidth="140px"
              />
            </div>
          </SectionFieldset>

          {/* Bioquímica */}
          <SectionFieldset legend="Bioquímica" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium min-w-[100px] ">Glucosa:</label>
                <input
                  name="glucosa"
                  value={form.glucosa || ""}
                  onChange={handleInputChange}
                  className={`border rounded px-2 py-1 w-32 ${
                    form.glucosaNA ? "bg-gray-200 text-gray-500" : ""
                  }`}
                  disabled={form.glucosaNA}
                />
                <span className="ml-2 w-12 font-medium ">mg/dl</span>
                <InputCheckbox
                  label={<span className="font-medium">N/A</span>}
                  checked={form.glucosaNA || form.glucosa === "N/A"}
                  onChange={(v) => {
                    setField("glucosaNA", v);
                    setField("glucosa", v ? "N/A".trim() : "");
                  }}
                />
                <span className="ml-6  text-gray-600 font-medium">
                  Valores normales 70 - 110 mg/dl
                </span>
              </div>
              <div className="flex items-center gap-4">
                <label className="font-medium min-w-[100px] ">Creatinina:</label>
                <input
                  name="creatinina"
                  value={form.creatinina || ""}
                  onChange={handleInputChange}
                  className={`border rounded px-2 py-1 w-32 ${
                    form.creatininaNA ? "bg-gray-200 text-gray-500" : ""
                  }`}
                  disabled={form.creatininaNA}
                />
                <span className="ml-2 w-12 font-medium ">mg/dl</span>
                <InputCheckbox
                  label={<span className="font-medium">N/A</span>}
                  checked={form.creatininaNA || form.creatinina === "N/A"}
                  onChange={(v) => {
                    setField("creatininaNA", v);
                    setField("creatinina", v ? "N/A".trim() : "");
                  }}
                />
                <span className="ml-6  text-gray-600 font-medium">
                  Valores normales 0.8 - 1.4 mg/dl
                </span>
              </div>
            </div>
          </SectionFieldset>

          {/* Registros anteriores */}
          <SectionFieldset legend="Registros anteriores" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full  border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-300 text-center">
                    <th className="border px-2 py-1">Fecha Lab</th>
                    <th className="border px-2 py-1">Grupo</th>
                    <th className="border px-2 py-1">RH</th>
                  </tr>
                </thead>
                <tbody>
                  {tableLab.length === 0 ? (
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 text-center" colSpan={3}>
                        Sin Datos...
                      </td>
                    </tr>
                  ) : (
                    tableLab.map((row, i) => (
                      <tr key={i} className="text-center">
                        <td className="font-bold border-b border-gray-200 py-1 ">{row.fechaLab}</td>
                        <td className="border-b border-gray-200 py-1 ">{row.grupoSanguineo}</td>
                        <td className="border-b border-gray-200 py-1 ">{row.factorRh}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </SectionFieldset>
        </div>
      </div>

      {/* Botón Limpiar al final */}
      <div className="flex justify-start">
        <button
          onClick={handleClear}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default HematologiaBioquimicaSIEO;
