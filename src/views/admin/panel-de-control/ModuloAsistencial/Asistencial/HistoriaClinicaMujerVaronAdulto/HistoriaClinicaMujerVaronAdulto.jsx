import {
  InputTextOneLine,
  InputTextArea,
  SectionFieldset,
  RadioTable
} from "../../../../../components/reusableComponents/ResusableComponents";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { ConfirmarImpresion, SubmitDataService, VerifyTR } from "./controllerHistoriaClinicaMujerVaronAdulto";
import { DatosPersonalesLaborales } from "../../../../../components/templates/Templates";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";

// Campos propios (no checkbox) que el usuario puede editar (para resaltar/revertir cambios).
// Los checkboxes (sustancias/vigilancia/antecedentes) no soportan edited/onRevert.
const CAMPOS_EDITABLES = [
  "fecha_apertura_hcl",
  "nombre_padre",
  "nombre_madre",
  "localidad",
  "nacionalidad",
  "lugares_6_meses",
  "consumo_drogas",
  "especificarDrogasSedentarismo",
  "sedentarismo",
  "menarquiaAnios",
  "inicio_relaciones_sexuales",
  "vacuna_dt_1_dosis",
  "vacuna_dt_1_fecha",
  "vacuna_dt_2_dosis",
  "vacuna_dt_2_fecha",
  "vacuna_dt_3_dosis",
  "vacuna_dt_3_fecha",
  "vacuna_hvb_1_dosis",
  "vacuna_hvb_1_fecha",
  "vacuna_hvb_2_dosis",
  "vacuna_hvb_2_fecha",
  "vacuna_hvb_3_dosis",
  "vacuna_hvb_3_fecha",
  "vacuna_antiamarilica_1_dosis",
  "vacuna_antiamarilica_1_fecha",
  "examenFisico",
  "examenesAuxiliares",
  "diagnostico",
  "tratamiento",
  "user_medicoFirma",
  "nombre_medico",
];

export default function HistoriaClinicaMujerVaronAdulto() {
  const today = getToday();
  const { token, userlogued, userName, listaEmpleados, datosFooter } = useSessionData();

  const initialFormState = {
    // Control de edición + auditoría (useRegistroEditable / buildAuditoria)
    id: null,
    pacienteId: null,
    tieneRegistro: false,
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",

    // Header
    n_hcl: "",
    ticketImprimir: "",
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
    especificarDrogasSedentarismo: "",
    sedentarismo: undefined,
    inicio_relaciones_sexuales: "",
    // Datos Mujer
    menarquiaAnios: "",
    regimenCatamenialSangrado: "",
    regimenCatamenialCiclo: "",

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
    ap_transfusion_sanguinea: false,

    // Antecedentes Patológicos Familiares (solo lectura, ver AntecedentesPatologicos)
    padre: "",
    madre: "",
    hermanos: "",
    hijos: "",
    esposaConyuge: "",

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

    // Examen / Diagnóstico (solo lectura, informativo del ticket)
    examenFisico: "",
    examenesAuxiliares: "",
    diagnostico: "",
    tratamiento: "",

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
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButton,
    handleCheckBoxChange,
    handleClear,
  } = useForm(initialFormState, { storageKey: "hc_mujer_varon_adulto" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const hayRegistroCargado = Boolean(form.nombres || form.dni);

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, datosFooter);
  };

  const handlePrint = () => {
    ConfirmarImpresion(form.ticketImprimir, token, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const numeroTicket = form.n_hcl;
      setForm({ ...initialFormState, n_hcl: numeroTicket });
      VerifyTR(numeroTicket, token, setForm, today, listaEmpleados);
    }
  };

  return (
    <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      <SectionFieldset legend="Header" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputTextOneLine
          label="N° Ticket"
          name="n_hcl"
          value={form.n_hcl}
          onChange={handleChangeNumber}
          onKeyUp={handleSearch}
        />
        <InputTextOneLine
          label="Fecha Apertura"
          name="fecha_apertura_hcl"
          type="date"
          value={form.fecha_apertura_hcl}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("fecha_apertura_hcl")}
          onRevert={() => revertField("fecha_apertura_hcl")}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} laborales={false} />

      <SectionFieldset legend="Datos Generales" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" collapsible>
        <InputTextOneLine
          label="Nombre del Padre"
          name="nombre_padre"
          value={form.nombre_padre}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("nombre_padre")}
          onRevert={() => revertField("nombre_padre")}
        />
        <InputTextOneLine
          label="Nombre de la Madre"
          name="nombre_madre"
          value={form.nombre_madre}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("nombre_madre")}
          onRevert={() => revertField("nombre_madre")}
        />
        <InputTextOneLine label="Dirección" name="direccion" value={form.direccion} disabled />
        <InputTextOneLine
          label="Localidad"
          name="localidad"
          value={form.localidad}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("localidad")}
          onRevert={() => revertField("localidad")}
        />
        <InputTextOneLine label="Distrito" name="distrito" value={form.distrito} disabled />
        <InputTextOneLine label="Provincia" name="provincia" value={form.provincia} disabled />
        <InputTextOneLine label="Departamento" name="departamento" value={form.departamento} disabled />
        <InputTextOneLine
          label="Nacionalidad"
          name="nacionalidad"
          value={form.nacionalidad}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("nacionalidad")}
          onRevert={() => revertField("nacionalidad")}
        />
        {/* <InputTextOneLine label="Raza" name="raza" value={form.raza} disabled />
        <InputTextOneLine label="Religión" name="religion" value={form.religion} disabled />
        <InputTextOneLine label="GPO. SANG" name="grupo_sang" value={form.grupo_sang} disabled />
        <InputTextOneLine label="Factor RH" name="factor_rh" value={form.factor_rh} disabled /> */}
        <InputTextOneLine
          label="Lugares (6 meses)"
          name="lugares_6_meses"
          value={form.lugares_6_meses}
          onChange={handleChange}
          // className="lg:col-span-3"
          disabled={camposDeshabilitados}
          edited={isFieldEdited("lugares_6_meses")}
          onRevert={() => revertField("lugares_6_meses")}
        />
      </SectionFieldset>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionFieldset legend="Antecedentes Personales" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            
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
                disabled={camposDeshabilitados}
                isFieldEdited={isFieldEdited}
                onRevert={revertField}
              />
              {form.consumo_drogas === "SI" && (
                <InputTextOneLine
                  label="Especificar"
                  name="especificarDrogasSedentarismo"
                  value={form.especificarDrogasSedentarismo}
                  onChange={handleChange}
                  disabled={camposDeshabilitados}
                  edited={isFieldEdited("especificarDrogasSedentarismo")}
                  onRevert={() => revertField("especificarDrogasSedentarismo")}
                />
              )}
            </div>

            <div className="space-y-2 border p-2 rounded">
              <p className="font-semibold text-md">Datos Mujer:</p>
              <div className="grid grid-cols-1 gap-2">
                <InputTextOneLine
                  label="Menarquía (años)"
                  name="menarquiaAnios"
                  value={form.menarquiaAnios}
                  onChange={handleChange}
                  labelWidth="120px"
                  disabled={camposDeshabilitados}
                  edited={isFieldEdited("menarquiaAnios")}
                  onRevert={() => revertField("menarquiaAnios")}
                  className="text-sm"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Régimen Catamenial:</span>
                  <input type="text" name="regimenCatamenialSangrado" value={form.regimenCatamenialSangrado} onChange={handleChange} disabled={camposDeshabilitados} className="w-10 border-b border-gray-400 text-center disabled:bg-gray-300 text-sm" />
                  <span className="text-sm">/</span>
                  <input type="text" name="regimenCatamenialCiclo" value={form.regimenCatamenialCiclo} onChange={handleChange} disabled={camposDeshabilitados} className="w-10 border-b border-gray-400 text-center disabled:bg-gray-300 text-sm" />
                  <span className="text-sm">días</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2 border p-2 rounded">
              <p className="font-semibold text-md">Vigilancia de Enfermedades No Transmisibles: </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="vigilancia_diabetes" checked={form.vigilancia_diabetes} onChange={handleCheckBoxChange} disabled={camposDeshabilitados} />
                  <span>Diabetes</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="vigilancia_hipertension" checked={form.vigilancia_hipertension} onChange={handleCheckBoxChange} disabled={camposDeshabilitados} />
                  <span>Hipertensión Arterial</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="vigilancia_violencia" checked={form.vigilancia_violencia} onChange={handleCheckBoxChange} disabled={camposDeshabilitados} />
                  <span>Violencia Intrafamiliar</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 border p-2 rounded">
              <p className="font-semibold text-md">Consumo de sustancias nocivas:</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="sustancia_hoja_coca" checked={form.sustancia_hoja_coca} onChange={handleCheckBoxChange} disabled={camposDeshabilitados} />
                  <span>Hoja de coca</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="sustancia_alcohol" checked={form.sustancia_alcohol} onChange={handleCheckBoxChange} disabled={camposDeshabilitados} />
                  <span>Bebidas Alcohólicas</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="sustancia_tabaco" checked={form.sustancia_tabaco} onChange={handleCheckBoxChange} disabled={camposDeshabilitados} />
                  <span>Tabaco</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="sustancia_cafe" checked={form.sustancia_cafe} onChange={handleCheckBoxChange} disabled={camposDeshabilitados} />
                  <span>Café</span>
                </label>
              </div>
            </div>


            
          </div>

          <InputTextOneLine
            label="Edad Inicio Relaciones Sex."
            name="inicio_relaciones_sexuales"
            value={form.inicio_relaciones_sexuales}
            onChange={handleChange}
            labelWidth="150px"
            disabled={camposDeshabilitados}
            edited={isFieldEdited("inicio_relaciones_sexuales")}
            onRevert={() => revertField("inicio_relaciones_sexuales")}
          />

        </SectionFieldset>

        <SectionFieldset legend="Antecedentes Patológicos" className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
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
                  <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleCheckBoxChange} disabled />
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
                { name: "ap_neoplasia", label: "15. Neoplasia" },
                { name: "ap_transfusion_sanguinea", label: "16. Transfusión Sanguínea" },
              ].map(item => (
                <label key={item.name} className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleCheckBoxChange} disabled />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
          <hr />
          <div className="space-y-2">
            <RadioTable
              items={[
                { name: "ap_alergia_medicamentos", label: "16. ALERGIA MEDICAMENTOS" },
              ]}
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" }
              ]}
              form={form}
              handleRadioButton={handleRadioButton}
              disabled
            />
            {form.ap_alergia_medicamentos === "SI" && (
              <InputTextOneLine
                label="Especifique"
                name="ap_alergia_medicamentos_especificar"
                value={form.ap_alergia_medicamentos_especificar}
                onChange={handleChange}
                disabled
              />
            )}
          </div>
        </SectionFieldset>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionFieldset legend="Antecedentes Patológicos Familiares" collapsible className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputTextOneLine
            label="Padre - Especifique"
            name="padre"
            value={form.padre}
            labelWidth="180px"
            disabled
          />
          <InputTextOneLine
            label="Madre - Especifique"
            name="madre"
            value={form.madre}
            labelWidth="180px"
            disabled
          />
          <InputTextOneLine
            label="Hermanos - Especifique"
            name="hermanos"
            value={form.hermanos}
            labelWidth="180px"
            disabled
          />
          <InputTextOneLine
            label="Hijos - Especifique"
            name="hijos"
            value={form.hijos}
            labelWidth="180px"
            disabled
          />
          <InputTextOneLine
            label="Esposa/Cónyuge - Especifique"
            name="esposaConyuge"
            value={form.esposaConyuge}
            labelWidth="180px"
            disabled
          />
        </SectionFieldset>


        <SectionFieldset legend="Inmunizaciones" >
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 whitespace-nowrap">VACUNAS</th>
                  <th className="border border-gray-300 p-2" colSpan="6">DOSIS / FECHA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold whitespace-nowrap">DT</td>
                  <td className="border border-gray-300 p-0.5"><input type="text" name="vacuna_dt_1_dosis" value={form.vacuna_dt_1_dosis} onChange={handleChange} disabled={camposDeshabilitados} className="w-full min-w-[40px] text-center outline-none disabled:bg-gray-300" placeholder="Dosis" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="date" name="vacuna_dt_1_fecha" value={form.vacuna_dt_1_fecha} onChange={handleChangeSimple} disabled={camposDeshabilitados} className="w-full min-w-[92px] outline-none disabled:bg-gray-300" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="text" name="vacuna_dt_2_dosis" value={form.vacuna_dt_2_dosis} onChange={handleChange} disabled={camposDeshabilitados} className="w-full min-w-[40px] text-center outline-none disabled:bg-gray-300" placeholder="Dosis" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="date" name="vacuna_dt_2_fecha" value={form.vacuna_dt_2_fecha} onChange={handleChangeSimple} disabled={camposDeshabilitados} className="w-full min-w-[92px] outline-none disabled:bg-gray-300" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="text" name="vacuna_dt_3_dosis" value={form.vacuna_dt_3_dosis} onChange={handleChange} disabled={camposDeshabilitados} className="w-full min-w-[40px] text-center outline-none disabled:bg-gray-300" placeholder="Dosis" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="date" name="vacuna_dt_3_fecha" value={form.vacuna_dt_3_fecha} onChange={handleChangeSimple} disabled={camposDeshabilitados} className="w-full min-w-[92px] outline-none disabled:bg-gray-300" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold whitespace-nowrap">HVB</td>
                  <td className="border border-gray-300 p-0.5"><input type="text" name="vacuna_hvb_1_dosis" value={form.vacuna_hvb_1_dosis} onChange={handleChange} disabled={camposDeshabilitados} className="w-full min-w-[40px] text-center outline-none disabled:bg-gray-300" placeholder="Dosis" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="date" name="vacuna_hvb_1_fecha" value={form.vacuna_hvb_1_fecha} onChange={handleChangeSimple} disabled={camposDeshabilitados} className="w-full min-w-[92px] outline-none disabled:bg-gray-300" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="text" name="vacuna_hvb_2_dosis" value={form.vacuna_hvb_2_dosis} onChange={handleChange} disabled={camposDeshabilitados} className="w-full min-w-[40px] text-center outline-none disabled:bg-gray-300" placeholder="Dosis" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="date" name="vacuna_hvb_2_fecha" value={form.vacuna_hvb_2_fecha} onChange={handleChangeSimple} disabled={camposDeshabilitados} className="w-full min-w-[92px] outline-none disabled:bg-gray-300" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="text" name="vacuna_hvb_3_dosis" value={form.vacuna_hvb_3_dosis} onChange={handleChange} disabled={camposDeshabilitados} className="w-full min-w-[40px] text-center outline-none disabled:bg-gray-300" placeholder="Dosis" /></td>
                  <td className="border border-gray-300 p-0.5"><input type="date" name="vacuna_hvb_3_fecha" value={form.vacuna_hvb_3_fecha} onChange={handleChangeSimple} disabled={camposDeshabilitados} className="w-full min-w-[92px] outline-none disabled:bg-gray-300" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold whitespace-nowrap">ANTIAMARILICA</td>
                  <td className="border border-gray-300 p-0.5" colSpan="1"><input type="text" name="vacuna_antiamarilica_1_dosis" value={form.vacuna_antiamarilica_1_dosis} onChange={handleChange} disabled={camposDeshabilitados} className="w-full min-w-[40px] text-center outline-none disabled:bg-gray-300" placeholder="Dosis" /></td>
                  <td className="border border-gray-300 p-0.5" colSpan="1"><input type="date" name="vacuna_antiamarilica_1_fecha" value={form.vacuna_antiamarilica_1_fecha} onChange={handleChangeSimple} disabled={camposDeshabilitados} className="w-full min-w-[92px] outline-none disabled:bg-gray-300" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionFieldset>
      </div>

      <SectionFieldset collapsible className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputTextOneLine
          label="Examen Físico"
          name="examenFisico"
          value={form.examenFisico}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("examenFisico")}
          onRevert={() => revertField("examenFisico")}
          labelWidth="180px"
        />
        <InputTextOneLine
          label="Examenes Auxiliares"
          name="examenesAuxiliares"
          value={form.examenesAuxiliares}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("examenesAuxiliares")}
          onRevert={() => revertField("examenesAuxiliares")}
          labelWidth="180px"
        />
        <InputTextOneLine
          label="Diagnostico"
          name="diagnostico"
          value={form.diagnostico}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("diagnostico")}
          onRevert={() => revertField("diagnostico")}
          labelWidth="180px"
        />
        <InputTextOneLine
          label="Tratamiento"
          name="tratamiento"
          value={form.tratamiento}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("tratamiento")}
          onRevert={() => revertField("tratamiento")}
          labelWidth="180px"
        />
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

      <BotonesForm
        form={form}
        handleSave={handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
        handlePrint={handlePrint}
        printField="ticketImprimir"
        printLabel="IMPRIMIR N° TICKET"
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}
