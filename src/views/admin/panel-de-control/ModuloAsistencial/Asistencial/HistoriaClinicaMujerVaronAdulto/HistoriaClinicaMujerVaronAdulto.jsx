import {
  InputTextOneLine,
  InputTextArea,
  SectionFieldset,
  RadioTable
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { useForm } from "../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerHistoriaClinicaMujerVaronAdulto";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../../components/templates/Templates";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "hc_mujer_varon_adulto";

export default function HistoriaClinicaMujerVaronAdulto() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

  const initialFormState = {
    // Header
    n_hcl: "",
    fecha_apertura_hcl: today,

    // Datos Generales
    nombre_padre: "",
    nombre_madre: "",
    direccion: "",
    localidad: "",
    distrito: "",
    provincia: "",
    departamento: "",
    nacionalidad: "",
    lugares_6_meses: "",
    procedencia: "",
    grupo_sang: "",
    factor_rh: "",
    raza: "",
    religion: "",

    // Antecedentes Personales
    sustancia_hoja_coca: false,
    sustancia_alcohol: false,
    sustancia_tabaco: false,
    sustancia_cafe: false,
    consumo_drogas: undefined,
    consumo_drogas_especificar: "",
    sedentarismo: undefined,
    inicio_relaciones_sexuales: "",
    // Datos Mujer
    mujer_menarquia: "",
    mujer_regimen_catamenial_1: "",
    mujer_regimen_catamenial_2: "",

    // Antecedentes Patológicos
    ap_obesidad: false,
    ap_epilepsia: false,
    ap_asma: false,
    ap_tuberculosis: false,
    ap_dengue: false,
    ap_malaria: false,
    ap_its: false,
    ap_glaucoma: false,
    ap_vih_sida: false,
    ap_hepatitis_b: false,
    ap_depresion: false,
    ap_infarto_cardiaco: false,
    ap_dislipidemia: false,
    ap_insuficiencia_renal: false,
    ap_neoplasia: "",
    ap_alergia_medicamentos: undefined,
    ap_alergia_medicamentos_especificar: "",
    ap_transfusion_sanguinea: undefined,

    // Antecedentes Familiares
    af_hipertension: false,
    af_epilepsia: false,
    af_asma: false,
    af_problemas_psiquiatricos: false,
    af_tuberculosis: false,
    af_diabetes: false,
    af_dislipidemia: false,
    af_hepatitis_b: false,
    af_insuficiencia_renal: false,
    af_neoplasia: false,
    af_vih_sida: false,
    af_otros: "",

    // Inmunizaciones
    vacuna_dt_1_dosis: "",
    vacuna_dt_1_fecha: "",
    vacuna_dt_2_dosis: "",
    vacuna_dt_2_fecha: "",
    vacuna_dt_3_dosis: "",
    vacuna_dt_3_fecha: "",
    vacuna_hvb_1_dosis: "",
    vacuna_hvb_1_fecha: "",
    vacuna_hvb_2_dosis: "",
    vacuna_hvb_2_fecha: "",
    vacuna_hvb_3_dosis: "",
    vacuna_hvb_3_fecha: "",
    vacuna_antiamarilica_1_dosis: "",
    vacuna_antiamarilica_1_fecha: "",

    // Vigilancia
    vigilancia_diabetes: false,
    vigilancia_hipertension: false,
    vigilancia_violencia: false,

    // Médico que Certifica
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    // Campos de DatosPersonalesLaborales
    norden: "",
    fecha: today,
    nombreExamen: "HISTORIA CLINICA DE LA MUJER Y EL VARON ADULTO",
    esApto: undefined,
    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButton,
    handleRadioButtonBoolean,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "hc_mujer_varon_adulto" });

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede, today);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  return (
    <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
      <SectionFieldset legend="Header" className="grid grid-cols-1 2xl:grid-cols-4 gap-3">
        <InputTextOneLine
          label="N° HCL"
          name="n_hcl"
          value={form.n_hcl}
          onChange={handleChangeNumberDecimals}
          onKeyUp={handleSearch}
        />
        <InputTextOneLine
          label="Fecha Apertura"
          name="fecha_apertura_hcl"
          type="date"
          value={form.fecha_apertura_hcl}
          onChange={handleChangeSimple}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Datos Generales" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" collapsible>
        <InputTextOneLine label="Nombre del Padre" name="nombre_padre" value={form.nombre_padre} onChange={handleChange} />
        <InputTextOneLine label="Nombre de la Madre" name="nombre_madre" value={form.nombre_madre} onChange={handleChange} />
        <InputTextOneLine label="Dirección" name="direccion" value={form.direccion} disabled />
        <InputTextOneLine label="Localidad" name="localidad" value={form.localidad} onChange={handleChange} />
        <InputTextOneLine label="Distrito" name="distrito" value={form.distrito} disabled />
        <InputTextOneLine label="Provincia" name="provincia" value={form.provincia} disabled />
        <InputTextOneLine label="Departamento" name="departamento" value={form.departamento} disabled />
        <InputTextOneLine label="Nacionalidad" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} />
        <InputTextOneLine label="Raza" name="raza" value={form.raza} disabled />
        <InputTextOneLine label="Religión" name="religion" value={form.religion} disabled />
        <InputTextOneLine label="GPO. SANG" name="grupo_sang" value={form.grupo_sang} disabled />
        <InputTextOneLine label="Factor RH" name="factor_rh" value={form.factor_rh} disabled />
        <InputTextOneLine label="Procedencia" name="procedencia" value={form.procedencia} disabled />
        <InputTextArea label="Lugares en que estuvo en los últimos 6 meses" name="lugares_6_meses" value={form.lugares_6_meses} onChange={handleChange} rows={2} className="lg:col-span-3" />
      </SectionFieldset>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionFieldset legend="Antecedentes Personales" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 border p-2 rounded">
              <p className="font-semibold text-sm">Consumo de sustancias nocivas:</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="sustancia_hoja_coca" checked={form.sustancia_hoja_coca} onChange={handleCheckBoxChange} />
                  <span>Hoja de coca</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="sustancia_alcohol" checked={form.sustancia_alcohol} onChange={handleCheckBoxChange} />
                  <span>Bebidas Alcohólicas</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="sustancia_tabaco" checked={form.sustancia_tabaco} onChange={handleCheckBoxChange} />
                  <span>Tabaco</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="sustancia_cafe" checked={form.sustancia_cafe} onChange={handleCheckBoxChange} />
                  <span>Café</span>
                </label>
              </div>
            </div>
            <div className="space-y-2 border p-2 rounded">
              <RadioTable
                items={[
                  { name: "consumo_drogas", label: "Consumo de Drogas" },
                  { name: "sedentarismo", label: "Sedentarismo" },
                ]}
                options={[
                  { value: "SI", label: "SI" },
                  { value: "NO", label: "NO" }
                ]}
                form={form}
                handleRadioButton={handleRadioButton}
              />
              {form.consumo_drogas === "SI" && (
                <InputTextOneLine label="Especificar" name="consumo_drogas_especificar" value={form.consumo_drogas_especificar} onChange={handleChange} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputTextOneLine label="Edad Inicio Relaciones Sex." name="inicio_relaciones_sexuales" value={form.inicio_relaciones_sexuales} onChange={handleChange} />
            <div className="space-y-2 border p-2 rounded">
              <p className="font-semibold text-sm">DATOS MUJER:</p>
              <div className="grid grid-cols-1 gap-2">
                <InputTextOneLine label="Menarquía (años)" name="mujer_menarquia" value={form.mujer_menarquia} onChange={handleChange} labelWidth="120px" />
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Régimen Catamenial:</span>
                  <input type="text" name="mujer_regimen_catamenial_1" value={form.mujer_regimen_catamenial_1} onChange={handleChange} className="w-10 border-b border-gray-400 text-center" />
                  <span className="text-sm">/</span>
                  <input type="text" name="mujer_regimen_catamenial_2" value={form.mujer_regimen_catamenial_2} onChange={handleChange} className="w-10 border-b border-gray-400 text-center" />
                  <span className="text-sm">días</span>
                </div>
              </div>
            </div>
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Antecedentes Patológicos" className="space-y-3">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="grid grid-cols-1 gap-1">
              {[
                { name: "ap_obesidad", label: "1. Obesidad" },
                { name: "ap_epilepsia", label: "2. Epilepsia" },
                { name: "ap_asma", label: "3. Asma" },
                { name: "ap_tuberculosis", label: "4. Tuberculosis" },
                { name: "ap_dengue", label: "5. Dengue" },
                { name: "ap_malaria", label: "6. Malaria" },
                { name: "ap_its", label: "7. ITS" },
                { name: "ap_glaucoma", label: "8. Glaucoma" },
              ].map(item => (
                <label key={item.name} className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleCheckBoxChange} />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-1">
              {[
                { name: "ap_vih_sida", label: "9. VIH/SIDA" },
                { name: "ap_hepatitis_b", label: "10. Hepatitis B" },
                { name: "ap_depresion", label: "11. Depresión" },
                { name: "ap_infarto_cardiaco", label: "12. Infarto Cardiaco" },
                { name: "ap_dislipidemia", label: "13. Dislipidemia" },
                { name: "ap_insuficiencia_renal", label: "14. Insuficiencia Renal" },
              ].map(item => (
                <label key={item.name} className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleCheckBoxChange} />
                  <span>{item.label}</span>
                </label>
              ))}
              <InputTextOneLine label="15. Neoplasia" name="ap_neoplasia" value={form.ap_neoplasia} onChange={handleChange} />
            </div>
          </div>
          <hr />
          <div className="space-y-2">
            <RadioTable
              items={[
                { name: "ap_alergia_medicamentos", label: "16. ALERGIA MEDICAMENTOS" },
                { name: "ap_transfusion_sanguinea", label: "17. Transfusión Sanguínea" },
              ]}
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" }
              ]}
              form={form}
              handleRadioButton={handleRadioButton}
            />
            {form.ap_alergia_medicamentos === "SI" && (
              <InputTextOneLine label="Especifique" name="ap_alergia_medicamentos_especificar" value={form.ap_alergia_medicamentos_especificar} onChange={handleChange} />
            )}
          </div>
        </SectionFieldset>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionFieldset legend="Antecedentes Familiares">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              { name: "af_hipertension", label: "1. Hipertensión Arterial" },
              { name: "af_epilepsia", label: "2. Epilepsia" },
              { name: "af_asma", label: "3. Asma" },
              { name: "af_problemas_psiquiatricos", label: "4. Problemas Psiquiátricos" },
              { name: "af_tuberculosis", label: "5. Tuberculosis" },
              { name: "af_diabetes", label: "6. Diabetes" },
              { name: "af_dislipidemia", label: "7. Dislipidemia" },
              { name: "af_hepatitis_b", label: "8. Hepatitis B" },
              { name: "af_insuficiencia_renal", label: "9. Insuficiencia Renal" },
              { name: "af_neoplasia", label: "10. Neoplasia" },
              { name: "af_vih_sida", label: "11. VIH/SIDA" },
            ].map(item => (
              <label key={item.name} className="flex items-center space-x-2 text-sm">
                <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleCheckBoxChange} />
                <span>{item.label}</span>
              </label>
            ))}
            <div className="col-span-2 mt-2">
              <InputTextOneLine label="12. Otros" name="af_otros" value={form.af_otros} onChange={handleChange} />
            </div>
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Vigilancia de Enfermedades No Transmisibles">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="vigilancia_diabetes" checked={form.vigilancia_diabetes} onChange={handleCheckBoxChange} />
              <span>DIABETES</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="vigilancia_hipertension" checked={form.vigilancia_hipertension} onChange={handleCheckBoxChange} />
              <span>HIPERTENSIÓN ARTERIAL</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="vigilancia_violencia" checked={form.vigilancia_violencia} onChange={handleCheckBoxChange} />
              <span>VIOLENCIA INTRAFAMILIAR</span>
            </label>
          </div>
        </SectionFieldset>
      </div>

      <SectionFieldset legend="Inmunizaciones">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">VACUNAS</th>
                <th className="border border-gray-300 p-2" colSpan="6">DOSIS / FECHA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">DT</td>
                <td className="border border-gray-300 p-1"><input type="text" name="vacuna_dt_1_dosis" value={form.vacuna_dt_1_dosis} onChange={handleChange} className="w-full text-center outline-none" placeholder="Dosis" /></td>
                <td className="border border-gray-300 p-1"><input type="date" name="vacuna_dt_1_fecha" value={form.vacuna_dt_1_fecha} onChange={handleChangeSimple} className="w-full outline-none" /></td>
                <td className="border border-gray-300 p-1"><input type="text" name="vacuna_dt_2_dosis" value={form.vacuna_dt_2_dosis} onChange={handleChange} className="w-full text-center outline-none" placeholder="Dosis" /></td>
                <td className="border border-gray-300 p-1"><input type="date" name="vacuna_dt_2_fecha" value={form.vacuna_dt_2_fecha} onChange={handleChangeSimple} className="w-full outline-none" /></td>
                <td className="border border-gray-300 p-1"><input type="text" name="vacuna_dt_3_dosis" value={form.vacuna_dt_3_dosis} onChange={handleChange} className="w-full text-center outline-none" placeholder="Dosis" /></td>
                <td className="border border-gray-300 p-1"><input type="date" name="vacuna_dt_3_fecha" value={form.vacuna_dt_3_fecha} onChange={handleChangeSimple} className="w-full outline-none" /></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">HVB</td>
                <td className="border border-gray-300 p-1"><input type="text" name="vacuna_hvb_1_dosis" value={form.vacuna_hvb_1_dosis} onChange={handleChange} className="w-full text-center outline-none" placeholder="Dosis" /></td>
                <td className="border border-gray-300 p-1"><input type="date" name="vacuna_hvb_1_fecha" value={form.vacuna_hvb_1_fecha} onChange={handleChangeSimple} className="w-full outline-none" /></td>
                <td className="border border-gray-300 p-1"><input type="text" name="vacuna_hvb_2_dosis" value={form.vacuna_hvb_2_dosis} onChange={handleChange} className="w-full text-center outline-none" placeholder="Dosis" /></td>
                <td className="border border-gray-300 p-1"><input type="date" name="vacuna_hvb_2_fecha" value={form.vacuna_hvb_2_fecha} onChange={handleChangeSimple} className="w-full outline-none" /></td>
                <td className="border border-gray-300 p-1"><input type="text" name="vacuna_hvb_3_dosis" value={form.vacuna_hvb_3_dosis} onChange={handleChange} className="w-full text-center outline-none" placeholder="Dosis" /></td>
                <td className="border border-gray-300 p-1"><input type="date" name="vacuna_hvb_3_fecha" value={form.vacuna_hvb_3_fecha} onChange={handleChangeSimple} className="w-full outline-none" /></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">ANTIAMARILICA</td>
                <td className="border border-gray-300 p-1" colSpan="2"><input type="text" name="vacuna_antiamarilica_1_dosis" value={form.vacuna_antiamarilica_1_dosis} onChange={handleChange} className="w-full text-center outline-none" placeholder="Dosis" /></td>
                <td className="border border-gray-300 p-1" colSpan="4"><input type="date" name="vacuna_antiamarilica_1_fecha" value={form.vacuna_antiamarilica_1_fecha} onChange={handleChangeSimple} className="w-full outline-none" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico">
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
