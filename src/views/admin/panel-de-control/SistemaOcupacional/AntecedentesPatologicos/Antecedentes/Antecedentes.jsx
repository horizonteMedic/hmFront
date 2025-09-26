
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faMale, faFemale, faBroom, faPrint, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Varones from "./Varones/Varones";
import Damas from "./Damas/Damas";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import MedicoSearch from "../../../../../components/reusableComponents/MedicoSearch";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Antecedentes({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleCheckBoxChange,
  handleChangeSimple,
  handleRadioButton,
  handleRadioButtonBoolean,
  MedicosMulti,
  handleSave,
  handlePrint, 
  handleClear,
}) {
  const [activeTabReproduccion, setActiveTabReproduccion] = useState(0);

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
  const handleAgregar = () => {
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
    setForm({
      ...form,
      antecedentes: [...form.antecedentes, {
        codAntecedentesPatologicosQuirurgicos: 0,
        fecha: form.fechaAntecedente,
        hospitalOperacion: form.hospital,
        operacion: form.operacion,
        diasHospitalizado: form.diasHospitalizacion,
        complicaciones: form.complicaciones,
      }],
      fechaAntecedente: "",
      hospital: "",
      operacion: "",
      diasHospitalizacion: "",
      complicaciones: "",
    });
  };
  const handleLimpiar = () => {
    setForm({
      ...form,
      antecedentes: [],
      fechaAntecedente: "",
      hospital: "",
      operacion: "",
      diasHospitalizacion: "",
      complicaciones: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-4">Antecedentes Quirúrgicos</h4>

        {/* Formulario para agregar antecedentes */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <InputTextOneLine
              label="Año"
              labelOnTop
              name="fechaAntecedente"
              value={form.fechaAntecedente}
              onChange={handleChange}
            />
            <InputTextOneLine
              label="Hospital (Nombre - Lugar)"
              labelOnTop
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
            />
            <InputTextOneLine
              label="Operación"
              labelOnTop
              name="operacion"
              value={form.operacion}
              onChange={handleChange}
            />
            <InputTextOneLine
              label="Días Hospitalización"
              labelOnTop
              name="diasHospitalizacion"
              value={form.diasHospitalizacion}
              onChange={handleChangeNumber}
            />
            <InputTextOneLine
              label="Complicaciones"
              labelOnTop
              name="complicaciones"
              value={form.complicaciones}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAgregar}
              className="bg-[#059668] hover:bg-[#047857] text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Agregar
            </button>
            <button
              onClick={handleLimpiar}
              className="bg-[#facc14] hover:bg-[#eab308] text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTrash} />
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabla de antecedentes */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Año</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Hospital(Nombre - Lugar)</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Operación</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Días</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">Complicaciones</th>
              </tr>
            </thead>
            <tbody>
              {form.antecedentes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 border-b border-gray-200">
                    No hay antecedentes quirúrgicos registrados
                  </td>
                </tr>
              ) : (
                form.antecedentes.map((antecedente) => (
                  <tr key={antecedente.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.fecha}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.hospitalOperacion}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.operacion}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.diasHospitalizado}</td>
                    <td className="px-4 py-3">{antecedente.complicaciones}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Antecedentes de Reproducción - Solo cuando BOROO NO está activado */}
      {!form?.boroo && (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold mb-4">Antecedentes de Reproducción</h4>
          {/* Tab Navigation */}
          <nav className="flex bg-white border-b border-gray-200 mb-4">
            {tabsReproduccion.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTabReproduccion === tab.id
                  ? "border-red-500 font-semibold text-red-600"
                  : "border-transparent"
                  }`}
                onClick={() => setActiveTabReproduccion(tab.id)}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="max-w-full">
            {tabsReproduccion.map((tab) => {
              const Component = tab.component;
              return (
                activeTabReproduccion === tab.id && (
                  <Component
                    key={tab.id}
                    form={form}
                    setForm={setForm}
                    handleChange={handleChange}
                    handleChangeNumber={handleChangeNumber}
                    handleRadioButton={handleRadioButton}
                    handleCheckBoxChange={handleCheckBoxChange}
                    handleChangeSimple={handleChangeSimple}
                    handleRadioButtonBoolean={handleRadioButtonBoolean}
                  />
                )
              );
            })}
          </div>
        </div>
      )}

      {/* Sección de Antecedentes Patológicos Familiares - Solo cuando BOROO está activado */}
      {form?.boroo && (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold mb-4">ANTECEDENTES PATOLÓGICOS FAMILIARES:</h4>

          <div className="space-y-4">
            <InputTextOneLine
              label="Padre Especifique"
              name="padre"
              value={form.padre}
              onChange={handleChange}
              labelWidth="180px"
            />
            <InputTextOneLine
              label="Madre Especifique"
              name="madre"
              value={form.madre}
              onChange={handleChange}
              labelWidth="180px"
            />
            <InputTextOneLine
              label="Hermanos Especifique"
              name="hermanos"
              value={form.hermanos}
              onChange={handleChange}
              labelWidth="180px"
            />
            <InputTextOneLine
              label="Hijos Especifique"
              name="hijos"
              value={form.hijos}
              onChange={handleChange}
              labelWidth="180px"
            />
            <InputTextOneLine
              label="Esposa/Cónyuge Especifique"
              name="esposaConyuge"
              value={form.esposaConyuge}
              onChange={handleChange}
              labelWidth="180px"
            />
            <InputTextOneLine
              label="Si posee Carné de CONADIS, especifique"
              name="carnetConadis"
              value={form.carnetConadis}
              onChange={handleChange}
              labelWidth="180px"
            />
          </div>
        </div>
      )}

      {/* Fila de dos columnas: Médico e Imprimir */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Columna 1 - Campo Médico */}
          <MedicoSearch
            value={form.nombre_medico}
            onChange={handleChange}
            MedicosMulti={MedicosMulti}
          />
          {/* Columna 2 - Sección de impresión */}
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Guardar/Actualizar
              </button>
              <button
              onClick={handleClear}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faBroom} />
                Limpiar
              </button>
            </div>
            <span className="font-bold ml-12">Imprimir</span>
            <InputTextOneLine
              name="norden"
              value={form.norden}
              onChange={handleChangeNumber}
            /> 
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
