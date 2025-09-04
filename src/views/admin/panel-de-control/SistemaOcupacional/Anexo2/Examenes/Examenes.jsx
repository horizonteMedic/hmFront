import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faSave, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import {
  getInfoTabla,
  PrintHojaR,
  SubmitDataService,
} from "./controllerExamenes";

const tabla = "informe_examenes_complementarios";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const Examenes = () => {
  const { token, userlogued, datosFooter } = useSessionData();
  
  const initialFormState = {
    norden: "",
    codigoExamenes: null,
    nombre: "",
    edad: "",
    fechaNac: "",
    fechaExam: today,
    contrata: "",
    empresa: "",

    // Función Respiratoria
    fvc: "",
    fev1: "",
    fev1Fvc: "",
    fef2575: "",
    conclusionRespiratoria: "",
    normalRespiratoria: false,
    pObstruccion: false,

    // Medidas Generales
    temperatura: "",
    cintura: "",
    cadera: "",
    icc: "",

    // Signos Vitales
    frecuenciaRespiratoria: "",
    frecuenciaCardiaca: "",
    saturacionO2: "",
    perimetro: "",

    // Audiometría - Oído Derecho
    od500: "",
    od1000: "",
    od2000: "",
    od3000: "",
    od4000: "",
    od6000: "",
    od8000: "",

    // Audiometría - Oído Izquierdo
    oi500: "",
    oi1000: "",
    oi2000: "",
    oi3000: "",
    oi4000: "",
    oi6000: "",
    oi8000: "",

    // Ojos
    visionCercaOd: "",
    visionCercaOi: "",
    visionCercaOdCorregida: "",
    visionCercaOiCorregida: "",
    visionLejosOd: "",
    visionLejosOi: "",
    visionLejosOdCorregida: "",
    visionLejosOiCorregida: "",
    visionColores: "",
    enfermedadOculares: "",
    enfermedadOtros: "",
    reflejosPupilares: "",
    visionBinocular: "",

    // Dentadura
    piezasMalEstado: "",
    piezasFaltan: "",

    // Presión Arterial
    presionSistolica: "",
    presionDiastolica: "",

    // Grupo Sanguíneo
    grupoSanguineo: "",
    rh: "",

    // Observaciones Generales
    ectoscopia: "",
    estadoMental: "",
    anamnesis: "",

    // Obesidad
    ect: "",
    est: "",
    antecedentesObesidad: "",

    nombres_search: "",
    codigo_search: "",
    usuario: userlogued ?? "",
  };

  const {
    form,
    handleChange,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  useEffect(() => {
    const obtenerInfoTabla = () => {
      getInfoTabla(
        form.nombres_search,
        form.codigo_search,
        form.usuario,
        () => {},
        token
      );
    };
    obtenerInfoTabla();
  }, [form.nombres_search, form.codigo_search, form.usuario, token]);

  return (
    <div className="p-4" style={{ fontSize: '10px' }}>
      <h3 className="font-semibold mb-4 text-gray-800">Exámenes Complementarios</h3>
      
      {/* Cuatro columnas arriba */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Función Respiratoria */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Función Respiratoria Abs</h4>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <label className="w-10">FVC:</label>
              <input 
                type="text" 
                name="fvc"
                value={form.fvc || ""}
                onChange={handleChange}
                className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" 
              />
              <span className="text-xs">% I.</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-10">FEV1:</label>
              <input type="text" defaultValue="N/A" className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <span className="text-xs">% I.</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-12">FEV1/FVC:</label>
              <input type="text" defaultValue="N/A" className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <span className="text-xs">%.</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-12">FEF 25-75%:</label>
              <input type="text" defaultValue="N/A" className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <span className="text-xs">l/s.</span>
            </div>
          </div>
          
          <div className="flex space-x-3 mb-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" />
              <span>NORMAL</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" />
              <span>P. OBSTR...</span>
            </label>
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-1">Conclusión:</label>
            <textarea rows="2" className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Medidas Generales */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Medidas Generales</h4>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <label className="w-14 font-medium text-gray-700">Temp.:</label>
              <input type="text" defaultValue="35" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <span>°C</span>
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-14 font-medium text-gray-700">Cintura:</label>
              <input type="text" defaultValue="75" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-14 font-medium text-gray-700">Cadera:</label>
              <input type="text" defaultValue="80" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-14 font-medium text-gray-700">ICC:</label>
              <input type="text" defaultValue="0.94" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
            </div>
          </div>
        </div>

        {/* Signos Vitales y Perímetro */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Signos Vitales y Perímetro</h4>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <label className="w-20 font-medium text-gray-700 whitespace-nowrap">F. Respiratoria:</label>
              <input type="text" defaultValue="60" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <span>min.</span>
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-20 font-medium text-gray-700 whitespace-nowrap">F. Cardiaca:</label>
              <input type="text" defaultValue="60" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <span>min.</span>
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-20 font-medium text-gray-700 whitespace-nowrap">Sat. O2:</label>
              <input type="text" defaultValue="30" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
              <span>%</span>
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-20 font-medium text-gray-700 whitespace-nowrap">Perímetro:</label>
              <input type="text" defaultValue="44" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
            </div>
          </div>
        </div>

        {/* Audiometría */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Audiometría</h4>
          
          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-1">Oído Derecho</h5>
            <div className="grid grid-cols-7 gap-1 mb-2">
              <div className="text-center font-medium">500</div>
              <div className="text-center font-medium">1000</div>
              <div className="text-center font-medium">2000</div>
              <div className="text-center font-medium">3000</div>
              <div className="text-center font-medium">4000</div>
              <div className="text-center font-medium">6000</div>
              <div className="text-center font-medium">8000</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
            </div>
            <div className="text-center mt-1">
              <span className="text-xs">db (A)</span>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-1">Oído Izquierdo</h5>
            <div className="grid grid-cols-7 gap-1 mb-2">
              <div className="text-center font-medium">500</div>
              <div className="text-center font-medium">1000</div>
              <div className="text-center font-medium">2000</div>
              <div className="text-center font-medium">3000</div>
              <div className="text-center font-medium">4000</div>
              <div className="text-center font-medium">6000</div>
              <div className="text-center font-medium">8000</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
              <input type="text" defaultValue="-" className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100" />
            </div>
            <div className="text-center mt-1">
              <span className="text-xs">db (A)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - 4 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-4">
        {/* Ojos */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Ojos</h4>
          
          <div className="mb-2">
            <div className="grid grid-cols-5 gap-1 mb-1">
              <div></div>
              <div className="text-center font-medium">Sin Corregir</div>
              <div className="text-center font-medium">Corregida</div>
              <div></div>
              <div></div>
              <div className="text-center">O.D</div>
              <div className="text-center">O.I</div>
              <div className="text-center">O.D</div>
              <div className="text-center">O.I</div>
              <div></div>
            </div>
            
            <div className="grid grid-cols-5 gap-1 mb-1">
              <label className="font-medium">Visión de Cerca:</label>
              <input type="text" defaultValue="20/20" className="px-1 py-0.5 border border-gray-300 rounded text-center" />
              <input type="text" defaultValue="20/20" className="px-1 py-0.5 border border-gray-300 rounded text-center" />
              <input type="text" defaultValue="00" className="px-1 py-0.5 border border-gray-300 rounded text-center" />
              <input type="text" defaultValue="00" className="px-1 py-0.5 border border-gray-300 rounded text-center" />
            </div>
            
            <div className="grid grid-cols-5 gap-1 mb-1">
              <label className="font-medium">Visión de Lejos:</label>
              <input type="text" defaultValue="20/25" className="px-1 py-0.5 border border-gray-300 rounded text-center" />
              <input type="text" defaultValue="20/30" className="px-1 py-0.5 border border-gray-300 rounded text-center" />
              <input type="text" defaultValue="00" className="px-1 py-0.5 border border-gray-300 rounded text-center" />
              <input type="text" defaultValue="00" className="px-1 py-0.5 border border-gray-300 rounded text-center" />
            </div>
            
            <div className="flex items-center space-x-3">
              <label className="font-medium">Visión de Colores:</label>
              <input type="text" defaultValue="10/14" className="w-20 px-2 py-1 border border-gray-300 rounded text-center bg-blue-50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Enferm. Oculares:</label>
              <input type="text" defaultValue="AMETROPIA LEVE BILATERAL" className="w-full px-2 py-1 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Enfermedad. otros:</label>
              <input type="text" defaultValue="- DISCROMATOPSIA. - PTERIGIÓN BILATERAL." className="w-full px-2 py-1 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Reflejos Pupilares:</label>
              <input type="text" defaultValue="CONSERVADOS" className="w-full px-2 py-1 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Visión Binocular:</label>
              <input type="text" defaultValue="20/20" className="w-full px-2 py-1 border border-gray-300 rounded" />
            </div>
          </div>
        </div>

        {/* Dentadura, Presión Arterial y Grupo Sanguíneo - Apiladas */}
        <div className="lg:col-span-2 flex flex-col h-full">
          {/* Dentadura */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 mb-3">
            <h4 className="font-semibold text-gray-800 mb-2">Dentadura</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-20 font-medium text-gray-700">Piezas en mal estado:</label>
                <input type="text" defaultValue="3" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-20 font-medium text-gray-700">Piezas que faltan:</label>
                <input type="text" defaultValue="2" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
            </div>
          </div>

          {/* Presión Arterial Sistémica */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 mb-3">
            <h4 className="font-semibold text-gray-800 mb-2">Presión Arterial Sistémica</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-14 font-medium text-gray-700">Sistólica:</label>
                <input type="text" defaultValue="50" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
                <span>min.</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-14 font-medium text-gray-700">Diastólica:</label>
                <input type="text" defaultValue="60" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
                <span>min.</span>
              </div>
            </div>
          </div>

          {/* Grupo Sanguíneo */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1">
            <h4 className="font-semibold text-gray-800 mb-2">Grupo Sanguíneo</h4>
            
            <div className="space-y-2">
              <div>
                <div className="flex space-x-3">
                  <label className="flex items-center">
                    <input type="radio" name="grupo" value="O" className="mr-1" />
                    <span>O</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="grupo" value="A" className="mr-1" />
                    <span>A</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="grupo" value="B" className="mr-1" />
                    <span>B</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="grupo" value="AB" className="mr-1" />
                    <span>AB</span>
                  </label>
                </div>
              </div>
              <div>
                <div className="flex space-x-3">
                  <label className="flex items-center">
                    <input type="radio" name="rh" value="+" className="mr-1" />
                    <span>Rh(+)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="rh" value="-" className="mr-1" />
                    <span>Rh(-)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Observaciones Generales y Obesidad - 2 columnas apiladas */}
        <div className="lg:col-span-5 flex flex-col h-full">
          {/* Observaciones Generales */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 mb-3">
            <h4 className="font-semibold text-gray-800 mb-2">Observaciones Generales</h4>
            
            <div className="space-y-2">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Ectoscopía:</label>
                <input type="text" defaultValue="APARENTA BUEN ESTADO DE SALUD." className="w-full px-2 py-1 border border-gray-300 rounded bg-blue-50" />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Estado Mental:</label>
                <input type="text" defaultValue="DESPIERTO, OTEP, COMUNICATIVO." className="w-full px-2 py-1 border border-gray-300 rounded bg-blue-50" />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Anamnesis:</label>
                <textarea 
                  rows="3" 
                  defaultValue="COLABORADOR REFIERE SENTIRSE BIEN, SIN PROBLEMAS DE SALUD, NO practica deporte o deporte de alto rendimiento."
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Obesidad */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1">
            <h4 className="font-semibold text-gray-800 mb-2">Obesidad</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-14 font-medium text-gray-700">Ect.:</label>
                <input type="text" defaultValue="50" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-14 font-medium text-gray-700">Est.:</label>
                <input type="text" defaultValue="60" className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center" />
              </div>
              <div>
                <textarea 
                  rows="2" 
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Antecedentes..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-4 mt-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
          <div className="flex items-center gap-2">
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-base w-24"
            />
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Examenes;