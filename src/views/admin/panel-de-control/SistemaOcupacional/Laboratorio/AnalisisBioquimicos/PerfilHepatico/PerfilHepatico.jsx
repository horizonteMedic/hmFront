import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerPerfilHepatico';
import {
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';

const testFields = [
  { label: 'Fosfatasa Alcalina', name: 'fosfAlc' },
  { label: 'GGT', name: 'ggt' },
  { label: 'TGP', name: 'tgp' },
  { label: 'TGO', name: 'tgo' },
  { label: 'Bilirrubina Total', name: 'biliTotal' },
  { label: 'Bilirrubina Directa', name: 'biliDir' },
  { label: 'Bilirrubina Indirecta', name: 'biliInd' },
  { label: 'Proteínas Totales', name: 'protTot' },
  { label: 'Albumina', name: 'albumina' },
  { label: 'Globulina Sérica', name: 'globSer' },
];

const tabla = 'perfil_hepatico';

export default function PerfilHepatico() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: "",
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

    tgo: '',
    tgp: '',
    ggt: '',
    fosfAlc: '',
    biliTotal: '',
    biliInd: '',
    biliDir: '',
    protTot: '',
    albumina: '',
    globSer: '',

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleFocusNext,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleChangeBilirrubina = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      const total = parseFloat(next.biliTotal);
      const directa = parseFloat(next.biliDir);
      const diff = total - directa;
      const result = Number.isFinite(diff) ? (Math.round(diff * 100) / 100).toString() : '';
      next.biliInd = result;
      return next;
    });
  };

  const handleChangeGlobulina = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      const prot = parseFloat(next.protTot);
      const alb = parseFloat(next.albumina);
      const diff = prot - alb;
      const result = Number.isFinite(diff) ? (Math.round(diff * 100) / 100).toString() : '';
      next.globSer = result;
      return next;
    });
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
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

  return (
    <form className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

      <SectionFieldset legend="Resultados" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='space-y-4'>
          {testFields.slice(0, 5).map(({ label, name }) => (
            <InputTextOneLine
              key={name}
              label={label}
              name={name}
              value={form[name]}
              onChange={
                name === 'biliTotal' || name === 'biliDir'
                  ? handleChangeBilirrubina
                  : name === 'protTot' || name === 'albumina'
                    ? handleChangeGlobulina
                    : handleChange
              }
              onKeyUp={handleFocusNext}
              labelWidth="120px"
            />
          ))}
        </div>
        <div className='space-y-4'>
          {testFields.slice(5, 10).map(({ label, name }) => (
            <InputTextOneLine
              key={name}
              label={label}
              name={name}
              value={form[name]}
              onChange={
                name === 'biliTotal' || name === 'biliDir'
                  ? handleChangeBilirrubina
                  : name === 'protTot' || name === 'albumina'
                    ? handleChangeGlobulina
                    : handleChange
              }
              onKeyUp={handleFocusNext}
              labelWidth="120px"
            />
          ))}
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico" className="space-y-4">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
          <EmpleadoComboBox
            value={form.nombre_doctorAsignado}
            label="Doctor Asignado"
            form={form}
            onChange={handleChangeSimple}
            nameField="nombre_doctorAsignado"
            idField="user_doctorAsignado"
          />
      </SectionFieldset>

      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </form>
  );
}
