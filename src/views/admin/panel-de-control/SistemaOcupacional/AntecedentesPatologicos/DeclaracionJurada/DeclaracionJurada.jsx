import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import RadioTable from "../../../../../components/reusableComponents/RadioTable";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import {
  CAMPO_DETALLE_DECLARACION_JURADA,
  DECLARACION_JURADA_COLUMNAS,
  esEmpresaMarsa,
  OPCIONES_NO_SI,
} from "../../../../../utils/declaracionJuradaSaludUtils";

// Pestaña "Declaración Jurada": el trabajador declara bajo juramento que no tiene ni ha tenido ninguno de los
// cuadros clínicos listados. NO = no lo tiene (valor por defecto) · SI = lo tiene o lo tuvo (se detalla abajo).
// Es el formato de MARSA: los cuadros y el detalle solo se habilitan cuando la empresa del N° de orden es MARSA
// (además del bloqueo general del registro ya guardado).
export default function DeclaracionJurada({
  form,
  handleChange,
  handleRadioButtonBoolean,
  disabled = false,
  isFieldEdited = () => false,
  revertField = () => { },
}) {
  const esMarsa = esEmpresaMarsa(form?.empresa);
  const bloqueado = disabled || !esMarsa;

  return (
    <div className="space-y-3">
      {!esMarsa && (
        <p className="p-2 rounded border border-amber-300 bg-amber-50 text-amber-800 text-sm">
          {form?.empresa ? (
            <>
              La Declaración Jurada de Salud solo se llena para la empresa MARSA. La empresa de este N° de orden es{" "}
              <span className="font-semibold">{form.empresa}</span>.
            </>
          ) : (
            "La Declaración Jurada de Salud solo se llena para la empresa MARSA: busque un N° de orden de esa empresa para habilitar los cuadros."
          )}
        </p>
      )}

      <SectionFieldset legend="Declaración Jurada de Salud" className="space-y-4">
        <p>
          Yo, <span className="font-semibold">{form?.nombres || "NOMBRES Y APELLIDOS"}</span>, identificado con DNI N°{" "}
          <span className="font-semibold">{form?.dni || "XXXXXXXX"}</span>, declaro bajo juramento que no tengo ni he
          tenido ninguno de los siguientes cuadros clínicos:
        </p>

        {/* Las dos tablas del formato (ítems 1–26 y 27–51); bajo 1600 px se apilan para no angostar las preguntas */}
        <div className="grid grid-cols-1 min-[1600px]:grid-cols-2 gap-x-4 gap-y-3 items-start">
          {DECLARACION_JURADA_COLUMNAS.map((items, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg">
              <RadioTable
                items={items}
                options={OPCIONES_NO_SI}
                labelColumns={6}
                form={form}
                handleRadioButton={handleRadioButtonBoolean}
                disabled={bloqueado}
                isFieldEdited={isFieldEdited}
                onRevert={revertField}
                stackOnMobile
              />
            </div>
          ))}
        </div>

        <InputTextArea
          label="Detalle en caso que alguno sea afirmativo"
          name={CAMPO_DETALLE_DECLARACION_JURADA}
          rows={3}
          value={form?.[CAMPO_DETALLE_DECLARACION_JURADA]}
          onChange={handleChange}
          disabled={bloqueado}
          edited={isFieldEdited(CAMPO_DETALLE_DECLARACION_JURADA)}
          onRevert={() => revertField(CAMPO_DETALLE_DECLARACION_JURADA)}
        />
      </SectionFieldset>
    </div>
  );
}
