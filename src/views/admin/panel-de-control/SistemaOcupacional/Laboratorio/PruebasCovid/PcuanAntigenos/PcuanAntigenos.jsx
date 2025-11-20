import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerPcuanAntigenos";
import {
  InputTextOneLine,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import Swal from "sweetalert2";
import { URLAzure } from "../../../../../../config/config";

const DEFAULT_TECNICA = {
  tecnica: "Inmunofluorescencia",
  sensibilidad: "95.00%",
  especificidad: "95.00%",
};
const tabla = "examen_inmunologico";

export default function PcuanAntigenos() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const [marcas, setMarcas] = useState([]);
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch(
          `${URLAzure}/api/v01/ct/pruebasCovid/obtenerMarcasCovid`,
          options
        );
        if (!response.ok) throw new Error("Error al cargar marcas");
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        console.error("Error fetching marcas:", error);
        Swal.fire("Error", "No se pudieron cargar las marcas", "error");
      }
    };
    if (token) {
      fetchMarcas();
    }
  }, [token]);

  const initialFormState = {
    norden: "",
    fecha: today,
    nombres: "",
    dni: "",
    edad: "",
    marca: "",
    doctor: "N/A",
    valor: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const selectedMarca =
    marcas.find((m) => m.mensaje === form.marca) || DEFAULT_TECNICA;

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        COVID-19 Prueba Rápida (Antígeno)
      </h2>
      <form className="space-y-6">
        <SectionFieldset
          legend="Información del Examen"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={handleSearch}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Nombres y Apellidos"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="120px"
          />
          <div className="grid grid-cols-2 gap-4">
            <InputTextOneLine
              label="DNI"
              name="dni"
              value={form.dni}
              disabled
              labelWidth="80px"
              inputClassName="w-32"
            />
            <InputTextOneLine
              label="Edad"
              name="edad"
              value={form.edad}
              disabled
              labelWidth="80px"
              inputClassName="w-20"
            />
          </div>
        </SectionFieldset>

        <SectionFieldset legend="COVID - 19 Prueba Rápida" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[70px] max-w-[70px]">
                  MARCA:
                </label>
                <select
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">--Seleccione--</option>
                  {marcas.map((m) => (
                    <option key={m.id} value={m.mensaje}>
                      {m.mensaje}
                    </option>
                  ))}
                </select>
              </div>
              <InputTextOneLine
                label="Doctor"
                name="doctor"
                value={form.doctor}
                disabled
                labelWidth="70px"
              />
              <InputTextOneLine
                label="Valor"
                name="valor"
                value={form.valor}
                onChange={handleChange}
                labelWidth="70px"
              />
            </div>
            <div className="border rounded bg-gray-50 p-4 text-base min-h-[100px]">
              <div>
                <span className="font-semibold">Tecnica:</span>{" "}
                {selectedMarca.tecnica || DEFAULT_TECNICA.tecnica}
              </div>
              <div>
                <span className="font-semibold">SENSIBILIDAD:</span>{" "}
                {selectedMarca.sensibilidad || DEFAULT_TECNICA.sensibilidad}
              </div>
              <div>
                <span className="font-semibold">ESPECIFICIDAD:</span>{" "}
                {selectedMarca.especificidad || DEFAULT_TECNICA.especificidad}
              </div>
            </div>
          </div>
        </SectionFieldset>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-bold italic mb-2">Imprimir</span>
            <div className="flex items-center gap-2">
              <InputTextOneLine
                name="norden"
                value={form.norden}
                onChange={handleChange}
                inputClassName="w-24"
              />
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
