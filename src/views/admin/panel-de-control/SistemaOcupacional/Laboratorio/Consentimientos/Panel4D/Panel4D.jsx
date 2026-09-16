import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faPen } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { InputTextOneLine, InputsBooleanRadioGroup } from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerPanel4D';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "antecedentes",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

const Panel4D = () => {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    panel4dId: null,
    fecha: today,
    nombres: '',
    edad: '',
    dni: '',
    fechaCoca: today,
    antecedentes: [
      { label: 'CONSUME MARIHUANA', key: 'MARIHUANA', fecha: today, value: false },
      { label: 'CONSUMIO HOJA DE COCA EN LOS 7 DIAS PREVIOS', key: 'COCA', fecha: today, value: false },
      { label: 'CONSUME COCAÍNA', key: 'COCAINA', fecha: today, value: false },
      { label: 'CONSUME OPIÁCEOS', key: 'OPIA', fecha: today, value: false },
      { label: 'CONSUME METHANFETAMINAS', key: 'METAN', fecha: today, value: false },
    ],
    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
  };

  const { form, setForm, handleChange, handleChangeSimple, handleClear, handlePrintDefault } = useForm(initialFormState, { storageKey: "consPanel4D" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
  const isDoctorEdited = isFieldEdited("user_doctorAsignado");
  const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

  const handleAntecedenteChange = (key, newValue) => {
    setForm(prev => ({
      ...prev,
      antecedentes: prev.antecedentes.map(item =>
        item.key === key
          ? { ...item, value: newValue }
          : item
      )
    }));
  };

  const handleFechaChange = (key, nuevaFecha) => {
    setForm(prev => ({
      ...prev,
      antecedentes: prev.antecedentes.map(item =>
        item.key === key
          ? { ...item, fecha: nuevaFecha }
          : item
      )
    }));
  };

  const handleset = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      fechaCoca: today,
      antecedentes: [
        { label: 'CONSUME MARIHUANA', key: 'MARIHUANA', fecha: today, value: false },
        { label: 'CONSUMIO HOJA DE COCA EN LOS 7 DIAS PREVIOS', key: 'COCA', fecha: today, value: false },
        { label: 'CONSUME COCAÍNA', key: 'COCAINA', fecha: today, value: false },
        { label: 'CONSUME OPIÁCEOS', key: 'OPIA', fecha: today, value: false },
        { label: 'CONSUME METHANFETAMINAS', key: 'METAN', fecha: today, value: false },
      ],
      // Médico que Certifica //BUSCADOR
      nombre_medico: userName,
      user_medicoFirma: userlogued,

      nombre_doctorAsignado: "",
      user_doctorAsignado: "",

      tieneRegistro: false,
      userRegistro: "",
      fechaRegistro: "",
      usuarioActualizacion: "",
      fechaActualizacion: "",
    }));
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form, token);
    }, '¿Desea Imprimir Consentimiento Panel 4D?', form.norden);
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear);
  };

  const hayRegistroCargado = Boolean(form.nombres);

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      <h2 className="text-2xl font-bold text-center mb-6">CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE COCAÍNA, MARIHUANA, OPIÁCEOS Y METHANFETAMINAS</h2>

      <form className="space-y-6">
        <SectionFieldset legend="Datos del Paciente" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <InputTextOneLine
              label="Nro Orden"
              name="norden"
              value={form.norden}
              onChange={handleChange}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  handleset();
                  VerifyTR(form.norden, token, setForm, selectedSede, form);
                }
              }}
              disabled={hayRegistroCargado}
              labelWidth="120px"
              className="flex-1"
            />
            <InputTextOneLine
              label="Fecha"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              disabled={camposDeshabilitados}
              edited={isFieldEdited("fecha")}
              onRevert={() => revertField("fecha")}
              labelWidth="120px"
              className="flex-1"
            />
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Información Personal" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-base">
            <span>YO,</span>
            <input
              name="nombres"
              value={form.nombres || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[120px] max-w-[400px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px` }}
            />
            <span>de,</span>
            <input
              name="edad"
              value={form.edad || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[50px] max-w-[80px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(80, Math.max(50, (String(form.edad)?.length || 0) * 14))}px` }}
            />
            <span>años de edad, identificado con DNI nº</span>
            <input
              name="dni"
              value={form.dni || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[80px] max-w-[120px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px` }}
            />
          </div>
          <div className="text-justify text-base">
            ; habiendo recibido consejería e información acerca de la prueba para cocaína, marihuana, opiáceos y methanfetaminas en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post – Test y mis resultados.
          </div>
        </SectionFieldset>

        <SectionFieldset legend="ANTECEDENTES" className="space-y-4">
          {form.antecedentes.map(({ label, key, fecha, value }) => (
            <div key={key} className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="text-base font-medium flex-1 whitespace-nowrap min-w-[5px]">{label}</label>
              <div className="flex items-center gap-4">
                <InputsBooleanRadioGroup
                  name={`antecedente_${key}`}
                  value={value}
                  onChange={(e, newValue) => handleAntecedenteChange(key, newValue)}
                  trueLabel="SI"
                  falseLabel="NO"
                  disabled={camposDeshabilitados}
                  className="flex items-center"
                  groupClassName="gap-4"
                />
                {value === true && (
                  <InputTextOneLine
                    label="Fecha"
                    name={`fecha_${key}`}
                    type="date"
                    value={fecha}
                    onChange={e => handleFechaChange(key, e.target.value)}
                    disabled={camposDeshabilitados}
                    labelWidth="80px"
                  />
                )}
              </div>
            </div>
          ))}
        </SectionFieldset>

        <SectionFieldset legend="Asignación de Médico">
          <EmpleadoComboBox
            value={form.nombre_medico}
            label="Especialista"
            form={form}
            onChange={handleChangeSimple}
            disabled={camposDeshabilitados}
            edited={isMedicoEdited}
            onRevert={revertMedico}
          />
          <EmpleadoComboBox
            value={form.nombre_doctorAsignado}
            label="Doctor Asignado"
            form={form}
            onChange={handleChangeSimple}
            nameField="nombre_doctorAsignado"
            idField="user_doctorAsignado"
            disabled={camposDeshabilitados}
            edited={isDoctorEdited}
            onRevert={revertDoctor}
          />
        </SectionFieldset>

        {hayRegistroCargado && (
          <AuditoriaRegistro
            mostrarEdicion={form.tieneRegistro}
            fechaCreacion={auditoria.fechaCreacion}
            fechaEdicion={auditoria.fechaActualizacion}
            usuarioRegistro={auditoria.usuarioRegistro}
            usuarioEdicion={auditoria.usuarioActualizacion}
          />
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            {(!form.tieneRegistro || edicionHabilitada) && (
              <button
                type="button"
                onClick={form.tieneRegistro ? handleEdit : handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} /> {form.tieneRegistro ? "Guardar Cambios" : "Guardar"}
              </button>
            )}
            {form.tieneRegistro && !edicionHabilitada && (
              <button
                type="button"
                onClick={habilitarEdicion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPen} /> Editar
              </button>
            )}
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
              onClick={handleClear}
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-bold italic mb-2">Imprimir</span>
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
};

export default Panel4D;
