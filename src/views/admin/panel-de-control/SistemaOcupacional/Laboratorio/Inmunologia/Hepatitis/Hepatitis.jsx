import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerHepatitis';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';

const tabla = 'lhepatitis';

export default function Hepatitis() {
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const today = getToday();

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

    tipoHepatitis: "A",
    marca: 'RAPID TEST - MONTEST',
    resultadoHAV: '',
    resultadoHBsAg: '',

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
    handleRadioButton,
    handleFocusNext,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
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

  const handleHavChange = (checked) => {
    setForm(prev => ({
      ...prev,
      hav: checked,
      hbsag: checked ? false : prev.hbsag,
      resultadoHBsAg: checked ? '' : prev.resultadoHBsAg,
      resultadoHBsAgRadio: checked ? '' : prev.resultadoHBsAgRadio
    }));
  };

  const handleHbsagChange = (checked) => {
    setForm(prev => ({
      ...prev,
      hbsag: checked,
      hav: checked ? false : prev.hav,
      resultadoHAV: checked ? '' : prev.resultadoHAV,
      resultadoHAVRadio: checked ? '' : prev.resultadoHAVRadio
    }));
  };

  const handleResultadoHAVRadio = (e, value) => {
    handleRadioButton(e, value);
    setForm(prev => ({
      ...prev,
      resultadoHAV: value,
      resultadoHAVRadio: value
    }));
  };

  const handleResultadoHBsAgRadio = (e, value) => {
    handleRadioButton(e, value);
    setForm(prev => ({
      ...prev,
      resultadoHBsAg: value,
      resultadoHBsAgRadio: value
    }));
  };

  return (
    <form className="space-y-3 p-4">
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </SectionFieldset>

      <SectionFieldset legend="Datos Personales" collapsible className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          disabled
          labelWidth="120px"
        />
        <div className="grid md:grid-cols-2 gap-3">
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
        <div className="grid md:grid-cols-2 gap-3">
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

      <SectionFieldset legend="Tipo de Prueba">
        <InputsRadioGroup
          name="tipoHepatitis"
          value={form.tipoHepatitis}
          onChange={(e, value) => {
            handleRadioButton(e, value);
            setForm(prev => ({
              ...prev,
              resultadoHAV: value != "A" ? "" : prev.resultadoHAV,
              resultadoHBsAg: value != "B" ? "" : prev.resultadoHBsAg
            }))
          }}
          options={[
            { label: "HEPATITIS A (HAV)", value: "A" },
            { label: "HEPATITIS B (HBsAg)", value: "B" },
          ]}
        />
      </SectionFieldset>

      <SectionFieldset legend="Marca">
        <InputTextOneLine
          label="Marca"
          name="marca"
          value={form.marca}
          onChange={handleChange}
          labelWidth="180px"
        />
      </SectionFieldset>

      <SectionFieldset legend="Resultados" className="space-y-4">
        <div className="grid grid-cols-11 gap-x-4 gap-y-3 items-center">
          {/* HAV */}
          <InputTextOneLine
            label='HEPATITIS A (HAV) - RAPID TEST'
            name="resultadoHAV"
            value={form.resultadoHAV}
            onChange={handleChange}
            disabled={form.tipoHepatitis != "A"}
            labelWidth='180px'
            className='col-span-7'
          />
          <InputsRadioGroup
            name="resultadoHAV"
            value={form.resultadoHAV}
            onChange={handleRadioButton}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            disabled={form.tipoHepatitis != "A"}
          />

          {/* HBsAg */}
          <InputTextOneLine
            label='HEPATITIS B (HBsAg) - RAPID TEST'
            name="resultadoHBsAg"
            value={form.resultadoHBsAg}
            onChange={handleChange}
            disabled={form.tipoHepatitis != "B"}
            labelWidth='180px'
            className='col-span-7'
          />
          <InputsRadioGroup
            name="resultadoHBsAg"
            value={form.resultadoHBsAg}
            onChange={handleRadioButton}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            disabled={form.tipoHepatitis != "B"}
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico" className="space-y-4">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
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
  );
}
