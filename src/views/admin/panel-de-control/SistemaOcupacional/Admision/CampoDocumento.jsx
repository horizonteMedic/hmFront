import InputTextOneLine from '../../../../components/reusableComponents/InputTextOneLine';
import { SelectField } from '../../../../components/reusableComponents/InputSelect';
import { aTipoDoc, limpiarNroDoc, opcionesTipoDocumento, TIPO_DNI, tieneNumero } from '../../../../utils/documentoPaciente';

// Tipo + número de documento del paciente. Al cambiar el tipo el número se vuelve a filtrar con las reglas
// del nuevo tipo.
const CampoDocumento = ({
  tipoDoc,
  nroDoc,
  onChange, // ({ tipoDoc, nroDoc }) => void
  onKeyUp,
  disabled = false,
  disabledTipo = disabled,
  labelWidth = '120px',
  className = '',
  inputClassName = '',
  placeholder,
  required = false,
  error = '',
  edited = false,
  onRevert,
  avisoSinNumero = 'Sin número de documento',
  children, // botones junto al número (buscar, importar...)
}) => {
  const alCambiarTipo = (e) => {
    const tipo = aTipoDoc(e.target.value);
    onChange({ tipoDoc: tipo, nroDoc: limpiarNroDoc(tipo, nroDoc) });
  };
  const alCambiarNumero = (e) => onChange({ tipoDoc, nroDoc: limpiarNroDoc(tipoDoc, e.target.value) });
  const conNumero = tieneNumero(tipoDoc);
  const esDni = Number(tipoDoc) === TIPO_DNI;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SelectField
        inline
        label="Tipo Doc."
        name="tipoDoc"
        value={tipoDoc ?? ''}
        onChange={alCambiarTipo}
        options={opcionesTipoDocumento(tipoDoc)}
        placeholder="No disponible"
        hidePlaceHolder={Boolean(tipoDoc)}
        disabled={disabledTipo}
        labelWidth={labelWidth}
        required={required}
        edited={edited}
        onRevert={onRevert}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        {conNumero ? (
          <InputTextOneLine
            label="N° Documento"
            name="nroDoc"
            value={nroDoc}
            onChange={alCambiarNumero}
            onKeyUp={onKeyUp}
            disabled={disabled}
            labelWidth={labelWidth}
            className="min-w-0 sm:flex-1"
            inputClassName={inputClassName}
            inputMode={esDni ? 'numeric' : 'text'}
            maxLength={esDni ? 8 : 20}
            placeholder={placeholder}
            autocomplete="off"
            required={required}
            error={error}
            edited={edited}
          />
        ) : (
          <p className="mb-0 min-w-0 py-1 italic text-gray-600 sm:flex-1">{avisoSinNumero}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default CampoDocumento;
