import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerPcualAntig';
import {
  InputTextOneLine,
  InputTextArea,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import { getFetch } from '../../../../getFetch/getFetch';

const sintomasList = [
  'Tos', 'Dolor de garganta', 'Congestión nasal', 'Dificultad respiratoria',
  'Fiebre/Escalofrío', 'Malestar general', 'Pérdida olfato o gusto',
  'Diarrea', 'Náuseas/vómitos', 'Cefalea', 'Irritabilidad/confusión',
  'Dolor', 'Expectoración'
];

const DEFAULT_METODO = {
  metodo: 'Inmunocromatografía',
  sensibilidad: '94.55%',
  especificidad: '100.00%'
};

const tabla = 'examen_inmunologico';

export default function PcualAntig() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const [marcas, setMarcas] = useState([]);
  const [carga, setCarga] = useState(true);

  useEffect(() => {
    if (token) {
      getFetch(`/api/v01/ct/pruebasCovid/obtenerMarcasCovid`, token)
        .then((res) => {
          setCarga(false);
          setMarcas(res);
        })
        .catch(() => {
          setCarga(false);
        });
    }
  }, [token]);

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    dni: '',
    edad: '',
    marca: '',
    doctor: 'N/A',
    positivo: false,
    negativo: false,
    fechaSintomas: today,
    sintomas: [],
    marsa: false,
    observaciones: ''
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
      setForm((prev) => ({
        ...prev,
        fecha: today,
        nombres: '',
        dni: '',
        edad: '',
        marca: '',
        doctor: 'N/A',
        positivo: false,
        negativo: false,
        fechaSintomas: today,
        sintomas: [],
        marsa: false,
        observaciones: ''
      }));
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const handleSintomaChange = (sintoma, checked) => {
    const sintomasActuales = new Set(form.sintomas);
    checked ? sintomasActuales.add(sintoma) : sintomasActuales.delete(sintoma);
    const sintomasArray = [...sintomasActuales];

    // Obtener líneas actuales del campo observaciones
    const lineasActuales = (form.observaciones || "").split("\n");

    // Filtrar: deja todas las líneas que NO son síntomas conocidos
    const lineasNoSintomas = lineasActuales.filter((linea) => {
      const contenido = linea.trim().replace(/^- /, "").toLowerCase();
      return !sintomasList.some((s) => s.toLowerCase() === contenido);
    });

    // Agregar los síntomas seleccionados como nuevas líneas
    const nuevasLineasSintomas = sintomasArray.map((s) => `- ${s}`);

    // Combinar y limpiar doble salto de línea
    const nuevasObservaciones = [...lineasNoSintomas, ...nuevasLineasSintomas]
      .filter((linea, index, arr) => arr.indexOf(linea) === index)
      .join("\n");

    setForm(prev => ({
      ...prev,
      sintomas: sintomasArray,
      observaciones: nuevasObservaciones,
    }));
  };

  const handleObservacionesChange = (e) => {
    setForm(prev => ({
      ...prev,
      observaciones: e.target.value,
    }));
  };

  const handleResultadoChange = (value) => {
    setForm(prev => ({
      ...prev,
      positivo: value === 'positivo',
      negativo: value === 'negativo',
    }));
  };
  const resultadoValue = form.positivo ? 'positivo' : form.negativo ? 'negativo' : '';

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        COVID-19 Prueba Cualitativa (Antígenos)
      </h2>
      <form className="space-y-6">
        <SectionFieldset legend="Información del Examen" className="space-y-4">
          {/* Fila 1: N° Orden, Fecha, MARSA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={handleSearch}
            disabled={carga}
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="marsa"
              checked={form.marsa}
              onChange={handleChange}
              className="scale-110"
            />
            <span className="font-semibold text-red-600">MARSA</span>
          </div>
          </div>
          {/* Fila 2: Nombres y Apellidos, DNI, Edad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine
            label="Nombres y Apellidos"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="120px"
          />
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

        <SectionFieldset legend="Marca y Método" className="space-y-4">
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
                  {marcas.map((option) => (
                    <option key={option.id} value={option.mensaje}>
                      {option.mensaje}
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
            </div>
            <div className="border rounded bg-gray-50 p-4 text-base min-h-[80px]">
              <div>
                <span className="font-semibold">Método:</span> {DEFAULT_METODO.metodo}
              </div>
              <div>
                <span className="font-semibold">Sensibilidad:</span> {DEFAULT_METODO.sensibilidad}
              </div>
              <div>
                <span className="font-semibold">Especificidad:</span> {DEFAULT_METODO.especificidad}
              </div>
            </div>
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Resultado">
          <InputsRadioGroup
            name="resultado"
            value={resultadoValue}
            onChange={(e, value) => handleResultadoChange(value)}
            options={[
              { label: 'Positivo', value: 'positivo' },
              { label: 'Negativo', value: 'negativo' }
            ]}
            groupClassName="gap-6"
          />
        </SectionFieldset>

        <SectionFieldset legend="Fecha de Síntomas">
          <InputTextOneLine
            label="Fecha Síntomas"
            name="fechaSintomas"
            type="date"
            value={form.fechaSintomas}
            onChange={handleChange}
            labelWidth="140px"
          />
        </SectionFieldset>

        <SectionFieldset legend="Síntomas y Observaciones" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {sintomasList.map(s => (
              <label key={s} className="flex items-center gap-2 ">
                <input
                  type="checkbox"
                  checked={form.sintomas.includes(s)}
                  onChange={(e) => handleSintomaChange(s, e.target.checked)}
                />
                {s}
              </label>
            ))}
          </div>
          <InputTextArea
            label="Observaciones"
            name="observaciones"
            value={form.observaciones}
            onChange={handleObservacionesChange}
            rows={4}
          />
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
