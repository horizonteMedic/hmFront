/* eslint-disable react/prop-types */
import { useState } from "react";
import { InputTextOneLine, InputTextArea } from "../../../../../../components/reusableComponents/ResusableComponents";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faMale, faFemale, faBroom, faPrint, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Varones from "./Varones/Varones";
import Damas from "./Damas/Damas";

// Componente Antecedentes Quirúrgicos
export default function Antecedentes({ form, handleSiNoChange }) {
  const [antecedentesQuirurgicos, setAntecedentesQuirurgicos] = useState([]);
  const [nuevoAntecedente, setNuevoAntecedente] = useState({
    fecha: "",
    hospital: "",
    operacion: "",
    diasHospitalizacion: "",
    complicaciones: ""
  });
  const [activeTabReproduccion, setActiveTabReproduccion] = useState(0);
  const [antecedentesFamiliares, setAntecedentesFamiliares] = useState({
    padre: "",
    madre: "",
    hermanos: "",
    hijos: "",
    esposaConyuge: "",
    carnetConadis: ""
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para campos numéricos
    if (name === "diasHospitalizacion" || name === "fecha") {
      // Solo permitir números y campo vacío
      if (value === "") {
        setNuevoAntecedente(prev => ({
          ...prev,
          [name]: ""
        }));
        return;
      }
      
      // Verificar que solo contenga números
      if (!/^\d+$/.test(value)) {
        return; // No actualizar si contiene letras o caracteres especiales
      }
      
      const numericValue = parseInt(value);
      if (numericValue < 0) {
        return; // No actualizar si es negativo
      }
    }
    
    setNuevoAntecedente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAntecedentesFamiliaresChange = (e) => {
    const { name, value } = e.target;
    setAntecedentesFamiliares(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgregar = () => {
    if (nuevoAntecedente.fecha && nuevoAntecedente.operacion) {
      setAntecedentesQuirurgicos(prev => [...prev, { ...nuevoAntecedente, id: Date.now() }]);
      setNuevoAntecedente({
        fecha: "",
        hospital: "",
        operacion: "",
        diasHospitalizacion: "",
        complicaciones: ""
      });
    }
  };

  const handleLimpiar = () => {
    setNuevoAntecedente({
      fecha: "",
      hospital: "",
      operacion: "",
      diasHospitalizacion: "",
      complicaciones: ""
    });
  };

  // Funciones para los botones de acción
  const handleClearAll = () => {
    setAntecedentesQuirurgicos([]);
    setNuevoAntecedente({
      fecha: "",
      hospital: "",
      operacion: "",
      diasHospitalizacion: "",
      complicaciones: ""
    });
  };

  const handlePrint = () => {
    console.log("Imprimir");
  };

  const handleAddUpdate = () => {
    console.log("Agregar/Actualizar");
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-4">Antecedentes Quirúrgicos</h4>
        
        {/* Formulario para agregar antecedentes */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Año</label>
              <InputTextOneLine
                name="fecha"
                type="number"
                value={nuevoAntecedente.fecha}
                onChange={handleInputChange}
                placeholder="Ej: 2023"
                min="0"
                max="2030"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Hospital (Nombre - Lugar)</label>
              <InputTextOneLine
                name="hospital"
                value={nuevoAntecedente.hospital}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Operación</label>
              <InputTextOneLine
                name="operacion"
                value={nuevoAntecedente.operacion}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Días Hospitalización</label>
              <InputTextOneLine
                name="diasHospitalizacion"
                type="number"
                value={nuevoAntecedente.diasHospitalizacion}
                onChange={handleInputChange}
                min="0"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Complicaciones</label>
              <InputTextOneLine
                name="complicaciones"
                value={nuevoAntecedente.complicaciones}
                onChange={handleInputChange}
              />
            </div>
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
              {antecedentesQuirurgicos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 border-b border-gray-200">
                    No hay antecedentes quirúrgicos registrados
                  </td>
                </tr>
              ) : (
                antecedentesQuirurgicos.map((antecedente) => (
                  <tr key={antecedente.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.fecha}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.hospital}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.operacion}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{antecedente.diasHospitalizacion}</td>
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
                className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${
                  activeTabReproduccion === tab.id
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
                    handleSiNoChange={handleSiNoChange}
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
            {/* Padre */}
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Padre Especifique:</span>
              <InputTextOneLine
                name="padre"
                value={antecedentesFamiliares.padre}
                onChange={handleAntecedentesFamiliaresChange}
                className="flex-1"
                placeholder=""
              />
            </div>

            {/* Madre */}
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Madre Especifique:</span>
              <InputTextOneLine
                name="madre"
                value={antecedentesFamiliares.madre}
                onChange={handleAntecedentesFamiliaresChange}
                className="flex-1"
                placeholder=""
              />
            </div>

            {/* Hermanos */}
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Hermanos Especifique:</span>
              <InputTextOneLine
                name="hermanos"
                value={antecedentesFamiliares.hermanos}
                onChange={handleAntecedentesFamiliaresChange}
                className="flex-1"
                placeholder=""
              />
            </div>

            {/* Hijos */}
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Hijos Especifique:</span>
              <InputTextOneLine
                name="hijos"
                value={antecedentesFamiliares.hijos}
                onChange={handleAntecedentesFamiliaresChange}
                className="flex-1"
                placeholder=""
              />
            </div>

            {/* Esposa/Cónyuge */}
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Esposa/Cónyuge Especifique:</span>
              <InputTextOneLine
                name="esposaConyuge"
                value={antecedentesFamiliares.esposaConyuge}
                onChange={handleAntecedentesFamiliaresChange}
                className="flex-1"
                placeholder=""
              />
            </div>

            {/* Carné de CONADIS */}
            <div className="flex items-start gap-4">
              <span className="font-medium min-w-[200px] mt-2">Si posee Carné de CONADIS, especifique:</span>
              <InputTextArea
                name="carnetConadis"
                value={antecedentesFamiliares.carnetConadis}
                onChange={handleAntecedentesFamiliaresChange}
                className="flex-1"
                rows={4}
                placeholder=""
              />
            </div>
          </div>
        </div>
      )}

     

      {/* Fila de dos columnas: Médico e Imprimir */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Columna 1 - Campo Médico */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Médico :</span>
            <InputTextOneLine
              name="medico"
              value=""
              onChange={() => {}}
              className="flex-1"
              placeholder=".."
            />
          </div>

          {/* Columna 2 - Sección de impresión */}
          <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleAddUpdate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faUserPlus} />
              Guardar/Actualizar
            </button>
            <button
              onClick={handleClearAll}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} />
              Limpiar
            </button>
          </div>
            <span className="font-bold ml-12">Imprimir</span>
            <InputTextOneLine
              name="nordenImprimir"
              value=""
              onChange={() => {}}
              className="w-32"
              placeholder="N° Orden"
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
