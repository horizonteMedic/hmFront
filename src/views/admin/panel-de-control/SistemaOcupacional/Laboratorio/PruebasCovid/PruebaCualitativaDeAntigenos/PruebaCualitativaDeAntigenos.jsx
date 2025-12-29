import { useState, useEffect } from 'react';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerPruebaCualitativaDeAntigenos';
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsBooleanRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import { getFetch } from '../../../../getFetch/getFetch';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';

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

export default function PruebaCualitativaDeAntigenos() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    if (token) {
      getFetch(`/api/v01/ct/pruebasCovid/obtenerMarcasCovid`, token)
        .then((res) => {
          setMarcas(res);
        })
        .catch(() => {
          console.log('Error al obtener marcas de COVID-19');
        });
    }
  }, []);

  const initialFormState = {
    norden: '',
    fecha: today,

    nombreExamen: "",

    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    marca: '',
    doctor: 'N/A',
    positivo: false,
    negativo: false,
    fechaSintomas: today,
    sintomas: [],
    marsa: false,
    observaciones: '',

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButtonBoolean,
    handleCheckBoxChange,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
<<<<<<< HEAD
    SubmitDataService(form, token, userlogued, handleClear);
=======
    SubmitDataService(form, token, userlogued, handleClear, tabla);
>>>>>>> 26e624014566d7a1c94a7d61ccf7ba918c25e50a
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
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

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      {/* Información del Examen */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onChange={handleChangeNumberDecimals}
          onKeyUp={handleSearch}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Nombre del Examen"
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />
        <InputCheckbox
          label="MARSA"
          name="marsa"
          checked={form.marsa}
          onChange={handleCheckBoxChange}
        />
      </SectionFieldset>

      <SectionFieldset legend="Datos Personales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          disabled
          labelWidth="120px"
        />
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="Edad (Años)"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Sexo"
            name="sexo"
            value={form.sexo}
            disabled
            labelWidth="120px"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="DNI"
            name="dni"
            value={form.dni}
            labelWidth="120px"
            disabled
          />
          <InputTextOneLine
            label="Fecha Nacimiento"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            disabled
            labelWidth="120px"
          />
        </div>
        <InputTextOneLine
          label="Lugar Nacimiento"
          name="lugarNacimiento"
          value={form.lugarNacimiento}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Estado Civil"
          name="estadoCivil"
          value={form.estadoCivil}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Nivel Estudios"
          name="nivelEstudios"
          value={form.nivelEstudios}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>
      <SectionFieldset legend="Datos Laborales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputTextOneLine
          label="Empresa"
          name="empresa"
          value={form.empresa}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Contrata"
          name="contrata"
          value={form.contrata}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Ocupación"
          name="ocupacion"
          value={form.ocupacion}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Cargo Desempeñar"
          name="cargoDesempenar"
          value={form.cargoDesempenar}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>
      <SectionFieldset legend="Marca y Método" className="space-y-4">
        <div className="grid grid-cols-1  gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[120px] max-w-[120px]">
                Marca:
              </label>
              <select
                name="marca"
                value={form.marca}
                onChange={handleChangeSimple}
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

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3'>
        <SectionFieldset legend="Resultado">
          <InputsBooleanRadioGroup
            name="resultado"
            value={form.resultado}
            onChange={handleRadioButtonBoolean}
            trueLabel='Positivo'
            falseLabel='Negativo'
          />
        </SectionFieldset>

        <SectionFieldset legend="Fecha de Síntomas">
          <InputTextOneLine
            label="Fecha Síntomas"
            name="fechaSintomas"
            type="date"
            value={form.fechaSintomas}
            onChange={handleChangeSimple}
            labelWidth="140px"
          />
        </SectionFieldset>
      </div>
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
      {/* Médico */}
      <SectionFieldset legend="Asignación de Médico" className="space-y-4">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
      </SectionFieldset>

      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}
