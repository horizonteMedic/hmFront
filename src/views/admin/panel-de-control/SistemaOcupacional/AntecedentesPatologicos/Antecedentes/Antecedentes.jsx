import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faMale, faFemale } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Swal from "sweetalert2";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import Varones from "./Varones/Varones";
import Damas from "./Damas/Damas";

const tabsReproduccion = [
  {
    id: 0,
    name: "En caso de Varones",
    icon: faMale,
    component: Varones,
  },
  {
    id: 1,
    name: "En caso de Damas",
    icon: faFemale,
    component: Damas,
  },
];

export default function Antecedentes({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleCheckBoxChange,
  handleChangeSimple,
  handleRadioButton,
  handleRadioButtonBoolean,
  disabled = false,
  isFieldEdited = () => false,
  revertField = () => { },
  revertFields = () => { },
}) {
  const [activeTabReproduccion, setActiveTabReproduccion] = useState(0);
  const ActiveReproduccion = tabsReproduccion[activeTabReproduccion].component;

  // Resaltado + botón de revertir de un campo
  const revertible = (campo) => ({
    edited: isFieldEdited(campo),
    onRevert: () => revertField(campo),
  });

  // La lista de operaciones se revierte junto con los ids eliminados
  const quirurgicosEditados = isFieldEdited("antecedentes") || isFieldEdited("antecedentesEliminados");

  const handleAgregar = () => {
    if (disabled) return;
    if (
      !form.fechaAntecedente ||
      !form.hospital ||
      !form.operacion ||
      !form.diasHospitalizacion ||
      !form.complicaciones
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }
    setForm(prev => ({
      ...prev,
      antecedentes: [...prev.antecedentes, {
        codAntecedentesPatologicosQuirurgicos: 0,
        quirurjicosId: null,
        fecha: prev.fechaAntecedente,
        hospitalOperacion: prev.hospital,
        operacion: prev.operacion,
        diasHospitalizado: prev.diasHospitalizacion,
        complicaciones: prev.complicaciones,
      }],
      fechaAntecedente: "",
      hospital: "",
      operacion: "",
      diasHospitalizacion: "",
      complicaciones: "",
    }));
  };

  const handleLimpiar = () => {
    if (disabled) return;
    setForm(prev => ({
      ...prev,
      antecedentesEliminados: [
        ...prev.antecedentesEliminados,
        ...prev.antecedentes
          .filter(reg => reg.quirurjicosId != null)
          .map(reg => reg.quirurjicosId)
      ],
      antecedentes: [],
      fechaAntecedente: "",
      hospital: "",
      operacion: "",
      diasHospitalizacion: "",
      complicaciones: "",
    }));
  };

  const handleEliminarAntecedente = (index) => {
    if (disabled) return;
    setForm(prev => {
      const reg = prev.antecedentes[index];
      const antecedentesEliminados = reg && reg.quirurjicosId != null
        ? [...prev.antecedentesEliminados, reg.quirurjicosId]
        : prev.antecedentesEliminados;
      const antecedentes = prev.antecedentes.filter((_, i) => i !== index);
      return {
        ...prev,
        antecedentes,
        antecedentesEliminados,
      };
    });
  };

  return (
    <div className="space-y-3">
      <SectionFieldset
        legend="Antecedentes Quirúrgicos"
        className="space-y-4"
        actions={
          quirurgicosEditados && (
            <RevertButton
              onClick={() => revertFields(["antecedentes", "antecedentesEliminados"])}
              title="Revertir antecedentes quirúrgicos"
            />
          )
        }
      >
        {/* Formulario para agregar antecedentes */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <InputTextOneLine
              label="Año"
              labelOnTop
              name="fechaAntecedente"
              value={form.fechaAntecedente}
              onChange={handleChange}
              disabled={disabled}
            />
            <InputTextOneLine
              label="Hospital (Nombre - Lugar)"
              labelOnTop
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              disabled={disabled}
            />
            <InputTextOneLine
              label="Operación"
              labelOnTop
              name="operacion"
              value={form.operacion}
              onChange={handleChange}
              disabled={disabled}
            />
            <InputTextOneLine
              label="Días Hospitalización"
              labelOnTop
              name="diasHospitalizacion"
              value={form.diasHospitalizacion}
              onChange={handleChangeNumber}
              disabled={disabled}
            />
            <InputTextOneLine
              label="Complicaciones"
              labelOnTop
              name="complicaciones"
              value={form.complicaciones}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleAgregar}
              disabled={disabled}
              className="bg-[#059668] hover:bg-[#047857] text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faPlus} />
              Agregar
            </button>
            <button
              type="button"
              onClick={handleLimpiar}
              disabled={disabled}
              className="bg-[#facc14] hover:bg-[#eab308] text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faTrash} />
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabla de antecedentes */}
        <div className="border border-gray-200 bg-white rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Año</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Hospital(Nombre - Lugar)</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Operación</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Días</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Complicaciones</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {form.antecedentes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500 border-b border-gray-200">
                    No hay antecedentes quirúrgicos registrados
                  </td>
                </tr>
              ) : (
                form.antecedentes.map((antecedente, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.fecha}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.hospitalOperacion}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.operacion}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.diasHospitalizado}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.complicaciones}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleEliminarAntecedente(index)}
                        disabled={disabled}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionFieldset>

      {/* Antecedentes de Reproducción */}
      <SectionFieldset legend="Antecedentes de Reproducción">
        <div className="bg-white border border-gray-200 rounded-lg">
          <nav className="flex bg-white border-b border-gray-200 rounded-t-lg">
            {tabsReproduccion.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`flex-1 px-4 py-3 uppercase tracking-wider text-[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeTabReproduccion === tab.id
                  ? "border-[#233245] text-[#233245] font-semibold"
                  : "border-transparent"
                  }`}
                onClick={() => setActiveTabReproduccion(tab.id)}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
          <div className="p-4">
            <ActiveReproduccion
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              handleChangeNumber={handleChangeNumber}
              handleRadioButton={handleRadioButton}
              handleCheckBoxChange={handleCheckBoxChange}
              handleChangeSimple={handleChangeSimple}
              handleRadioButtonBoolean={handleRadioButtonBoolean}
              disabled={disabled}
              isFieldEdited={isFieldEdited}
              revertField={revertField}
            />
          </div>
        </div>
      </SectionFieldset>

      {/* Antecedentes Patológicos Familiares */}
      <SectionFieldset legend="Antecedentes Patológicos Familiares" className="space-y-3">
        <InputTextOneLine
          label="Padre Especifique"
          name="padre"
          value={form.padre}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="220px"
          {...revertible("padre")}
        />
        <InputTextOneLine
          label="Madre Especifique"
          name="madre"
          value={form.madre}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="220px"
          {...revertible("madre")}
        />
        <InputTextOneLine
          label="Hermanos Especifique"
          name="hermanos"
          value={form.hermanos}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="220px"
          {...revertible("hermanos")}
        />
        <InputTextOneLine
          label="Hijos Especifique"
          name="hijos"
          value={form.hijos}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="220px"
          {...revertible("hijos")}
        />
        <InputTextOneLine
          label="Esposa/Cónyuge Especifique"
          name="esposaConyuge"
          value={form.esposaConyuge}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="220px"
          {...revertible("esposaConyuge")}
        />
        <InputTextOneLine
          label="Si posee Carné de CONADIS, especifique"
          name="carnetConadis"
          value={form.carnetConadis}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="220px"
          {...revertible("carnetConadis")}
        />
      </SectionFieldset>
    </div>
  );
}
