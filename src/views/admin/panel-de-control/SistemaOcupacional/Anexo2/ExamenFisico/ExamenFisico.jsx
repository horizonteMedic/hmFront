

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faSave, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import {
  getInfoTabla,
  PrintHojaR,
  SubmitDataService,
} from "./controllerExamenFisico";

const tabla = "informe_examen_fisico";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const ExamenFisico = () => {
  const { token, userlogued, datosFooter } = useSessionData();
  
  const initialFormState = {
    norden: "",
    codigoExamenFisico: null,
    nombre: "",
    edad: "",
    fechaNac: "",
    fechaExam: today,
    contrata: "",
    empresa: "",

    // Examen Físico por Sistemas
    cabeza: "",
    cuello: "",
    boca: "",
    faringe: "",
    nariz: "",
    oidos: "",
    marcha: "",
    piel: "",
    aparatoRespiratorio: "",
    apaCardiovascular: "",
    aparatoDigestivo: "",
    aGenitourinario: "",
    aparatoLocomotor: "",
    miembrosSuperiores: "",
    miembrosInferiores: "",
    sistemaLinfatico: "",
    sistemaNervioso: "",
    columnaVertebral: "",

    // Otros Exámenes
    otrosExamenes: "",

    // Médico que Certifica
    medicoCertifica: "",

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
    <div className="p-6" style={{ fontSize: '11px' }}>
      <h3 className="font-semibold mb-6 text-gray-800">Examen Físico por Sistemas</h3>
      
      {/* Examen Físico por Sistemas */}
      <div className="space-y-4">
        {/* Cabeza */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Cabeza:</label>
          <input 
            type="text" 
            name="cabeza"
            value={form.cabeza || ""}
            onChange={handleChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Cuello */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Cuello:</label>
          <input 
            type="text" 
            defaultValue="CENTRAL, MOVIL, NO MASAS NO TUMORACIONES."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Boca */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Boca:</label>
          <input 
            type="text" 
            defaultValue="HUMECTADA, LENGUA ROSADA, CARRILLOS ROSADOS, NO MASA, NO TUMORACIONES, NO LESIONES EN MUCOSA."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Faringe */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Faringe:</label>
          <input 
            type="text" 
            defaultValue="HUMECTADA, SONROSADA, AMIGADALAS NO HIPERTROFICAS, NO CONGESTIVAS."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Nariz */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Nariz:</label>
          <input 
            type="text" 
            defaultValue="CENTRAL, PERMEABLE"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Oidos */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Oidos:</label>
          <input 
            type="text" 
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            placeholder="Observaciones..."
          />
        </div>

        {/* Marcha */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Marcha:</label>
          <input 
            type="text" 
            defaultValue="NORMAL"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Piel */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Piel:</label>
          <input 
            type="text" 
            defaultValue="NORMAL.NO MANCHA, NO SPRESENCIA DE LUNARES SOSPECHOSOS DE MALIGNIDAD."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Aparato Respiratorio */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Aparato Respiratorio:</label>
          <input 
            type="text" 
            defaultValue="RESPIRACION NORMAL, EXPANSION TORACICA SIMETRICA, BPMV EN ACP, NO RALES."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Apa.Cardiovascular */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Apa.Cardiovascular:</label>
          <input 
            type="text" 
            defaultValue="NO INGURGITACION YUGULAR, CAROTIDEO, RADIAL, FEMORAL, PEDIO CONSERVADOS.RCRR, NO SOPLOS, NO FROTES."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Aparato Digestivo */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Aparato Digestivo:</label>
          <input 
            type="text" 
            defaultValue="SERVADOS, NO RUIDOS ANORMALES, BLANDO, DEPRESIBLE, NO DOLOR A LA PALPACION SUPERFICIAL NI PROFUNDA, NO MASAS NI TUMORACIONES PALPABLES."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* A.Genitourinario */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">A.Genitourinario:</label>
          <input 
            type="text" 
            defaultValue="PL: NEGATIVO. PRU: NEGATIVO.HIPOGASTRIO PLANO, B/D, NO DOLOROSO A LA PALPACION SUPERFIAL NI PROFUNDA.NO MASAS NI TUMORACIONES PALPABLES."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Aparato Locomotor */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Aparato Locomotor:</label>
          <input 
            type="text" 
            defaultValue="BIPEDESTACION, MUSCULATURA CONSERVADA, MOTRICIDAD CORPORAL Y SEGMENTARIA CONSERVADA."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Miembros Superiores */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Miembros Superiores:</label>
          <input 
            type="text" 
            defaultValue="SIMETRICOS, NO DEFORMIDADES, MOTRICIDAD CONSERVADA."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Miembros Inferiores */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Miembros Inferiores:</label>
          <input 
            type="text" 
            defaultValue="SIMETRICOS, NO DEFORMIDADES, MOTRICIDAD CONSERVADA."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Sistema Linfatico */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Sistema Linfatico:</label>
          <input 
            type="text" 
            defaultValue="NO ADENOMEGALIAS PATOLOGICA."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Sistema Nervioso */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Sistema Nervioso:</label>
          <input 
            type="text" 
            defaultValue="DESPIERTO, OTEP, SENSIBILIDAD Y MOTRICIDAD CONSERVADA, ROTS CONSERVADOS.PARES CRANEALES CONSERVADOS.NO SIGNOS MENINGEOS."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Columna Vertebral */}
        <div className="flex items-start space-x-4">
          <label className="w-48  font-medium text-gray-700 mt-2">Columna Vertebral:</label>
          <input 
            type="text" 
            defaultValue="CENTRAL, CURVATURAS CONSERVADAS, MOTRICIDAD CONSERVADA."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
      </div>

      {/* Sección de Otros Exámenes y Médico */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Otros Exámenes */}
        <div className="lg:col-span-2">
          <label className="block  font-medium text-gray-700 mb-2">Otros Exámenes:</label>
          <textarea 
            rows="8" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            defaultValue={`-CREATININA: N/A mg/dl.
-VSG: N/A.
-EX ORINA: NORMAL.
-COCAINA: POSITIVO.
-MARIHUANA: POSITIVO.`}
          />
        </div>

        {/* Médico que Certifica */}
        <div className="lg:col-span-1">
          <label className="block  font-medium text-gray-700 mb-2">Medico que Certifica:</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del médico"
          />
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

export default ExamenFisico;
