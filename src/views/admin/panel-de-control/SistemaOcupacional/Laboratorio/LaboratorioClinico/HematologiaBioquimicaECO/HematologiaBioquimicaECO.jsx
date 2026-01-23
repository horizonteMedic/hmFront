import { useEffect } from "react";
import { getFetch } from "../../../../getFetch/getFetch";
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  SectionFieldset,
  InputsRadioGroup
} from '../../../../../../components/reusableComponents/ResusableComponents';
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerHematologiaBioquimicaECO";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const tabla = "lab_clinico";

export default function HematologiaBioquimicaECO() {
  const today = getToday();

  const { token, userlogued, selectedSede, userName } = useSessionData();

  const initialFormState = {
    norden: "",
    codLabclinico: null,
    fechaExamen: today,

    nombreExamen: "",

    responsable: "",
    gfSangPedido: "",

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

    grupoSanguineo: "",
    factorRh: "",

    hemoglobina: "",
    hematocrito: "",
    vsg: "",
    leucocitos: "",
    hematies: "",
    plaquetas: "",
    neutrofilos: "",
    abastonados: "",
    segmentados: "",
    monocitos: "",
    eosinofilos: "",
    basofilos: "",
    linfocitos: "",

    rpr: 'N/A',
    vih: 'N/A',
    glucosa: "",
    creatinina: "",
    dataTabla: [],

    // Campos de Examen de Orina - Estados iniciales
    color: 'AMARILLO CLARO',
    aspecto: 'TRANSPARENTE',
    densidad: '',
    ph: '',

    nitritos: 'NEGATIVO',
    proteinas: 'NEGATIVO',
    cetonas: 'NEGATIVO',
    leucocitosExamenQuimico: 'NEGATIVO',
    acAscorbico: 'NEGATIVO',
    urobilinogeno: 'NEGATIVO',
    bilirrubina: 'NEGATIVO',
    glucosaExamenQuimico: 'NEGATIVO',
    sangre: 'NEGATIVO',

    leucocitosSedimentoUnitario: '0-1',
    hematiesSedimentoUnitario: '0-0',
    celEpiteliales: 'ESCASAS',
    cristales: 'NO SE OBSERVAN',
    cilindros: 'NO SE OBSERVAN',
    bacterias: 'NO SE OBSERVAN',
    gramSc: 'NO SE OBSERVAN',
    otros: 'NO SE OBSERVAN',

    cocaina: '',
    marihuana: '',

    observaciones: '',

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
    handleClearnotO,
    handlePrintDefault,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handleFocusNext,
    handleRadioButton,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
    });
  };

  // const GetTable = (nro) => {
  //   getFetch(
  //     `/api/v01/ct/laboratorio/listadoGrupoFactorSanguineo?nOrden=${nro}`,
  //     token
  //   ).then((res) => {
  //     setForm(prev => ({ ...prev, dataTabla: res || [] }));
  //   });
  // };
  const GetTable = (nro) => {
    getFetch(
      `/api/v01/ct/laboratorio/listadoGrupoFactorSanguineo?nOrden=${nro}`,
      token
    )
      .then((res) => {
        setForm(prev => ({
          ...prev,
          dataTabla: Array.isArray(res) ? res : []
        }));
      })
      .catch((err) => {
        // Si es 404, tabla vacía
        if (err?.status === 404) {
          setForm(prev => ({ ...prev, dataTabla: [] }));
        } else {
          console.error(err);
        }
      });
  };


  useEffect(() => {
    if (!form.nombres || !form.norden) return;
    GetTable(form.norden)
  }, [form.nombres]);

  useEffect(() => {
    const grupo = form.grupoSanguineo;
    const rh = (form.factorRh).replace("RH", "");
    setForm(prev => ({ ...prev, gfSangPedido: `${grupo} ${rh}`.trim() }));
  }, [form.grupoSanguineo, form.factorRh]);

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4">
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
          name="fechaExamen"
          type="date"
          value={form.fechaExamen}
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
        <InputTextOneLine
          label="G.F. Sang. Pedido"
          name="gfSangPedido"
          value={form.gfSangPedido}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="DNI"
          name="dni"
          value={form.dni}
          labelWidth="120px"
          disabled
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
        <InputTextOneLine
          label="Fecha Nacimiento"
          name="fechaNacimiento"
          value={form.fechaNacimiento}
          disabled
          labelWidth="120px"
        />
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
      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hematología */}
        <SectionFieldset legend="Hematología" className="space-y-3">
          <div className="flex justify-end">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => {
                const text = form.vsg == "N/A" ? "" : "N/A";
                setForm(prev => ({
                  ...prev,
                  vsg: text,
                  leucocitos: text,
                  hematies: text,
                  plaquetas: text,
                  neutrofilos: text,
                  abastonados: text,
                  segmentados: text,
                  monocitos: text,
                  eosinofilos: text,
                  basofilos: text,
                  linfocitos: text,
                  creatinina: text,
                }))
              }}
            >
              N/A
            </button>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-3">
              <InputsRadioGroup
                label="Grupo Sanguíneo"
                name="grupoSanguineo"
                value={form.grupoSanguineo}
                options={[{ label: "O", value: "O" }, { label: "A", value: "A" }, { label: "B", value: "B" }, { label: "AB", value: "AB" }]}
                labelWidth="120px"
                onChange={handleRadioButton}
              />
              <InputsRadioGroup
                label="Factor Rh"
                name="factorRh"
                options={[{ label: "Rh(+)", value: "RH(+)" }, { label: "Rh(-)", value: "RH(-)" }]}
                value={form.factorRh}
                labelWidth="120px"
                className="mb-4"
                onChange={handleRadioButton}
              />
              {[
                ["Hemoglobina", "g/dl"],
                ["Hematocrito", "%"],
                ["Vsg", "mm/Hora"],
                ["Leucocitos", "mm³"],
                ["Hematies", "mm³"],
                ["Plaquetas", "mm³"],
              ].map(([key, unit]) => (
                <InputTextOneLine
                  label={`${key} (${unit})`}
                  key={key}
                  name={key.toLowerCase()}
                  value={form[key.toLowerCase()]}
                  labelWidth="120px"
                  onChange={handleChange}
                  onKeyUp={handleFocusNext}
                />
              ))}
            </div>
            <div className="space-y-3 mt-20">
              {[
                ["Neutrofilos", "%"],
                ["Abastonados", "%"],
                ["Segmentados", "%"],
                ["Monocitos", "%"],
                ["Eosinofilos", "%"],
                ["Basofilos", "%"],
                ["Linfocitos", "%"],
              ].map(([key, unit]) => (
                <InputTextOneLine
                  label={`${key} (${unit})`}
                  key={key}
                  name={key.toLowerCase()}
                  value={form[key.toLowerCase()]}
                  labelWidth="120px"
                  onChange={handleChange}
                  onKeyUp={(e) => { handleFocusNext(e, key == "Linfocitos" ? "glucosa" : "") }}
                />
              ))}
            </div>
          </div>
        </SectionFieldset>
        <div className="space-y-3">
          {/* Reacciones Serológicas */}
          <SectionFieldset legend="Reacciones Serológicas" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {["rpr", "vih"].map(item => (
              <div className="space-y-3" key={item}>
                <InputTextOneLine
                  label={item.toUpperCase()}
                  name={item}
                  value={form[item]}
                  disabled
                />
                <div className="flex justify-center">
                  <InputsRadioGroup
                    name={item}
                    value={form[item]}
                    options={[
                      { label: '+', value: 'POSITIVO' },
                      { label: '-', value: 'NEGATIVO' },
                      { label: 'N/A', value: 'N/A' }
                    ]}
                    onChange={handleRadioButton}
                  />
                </div>
              </div>
            ))}
          </SectionFieldset>
          {/* Bioquímica */}
          <SectionFieldset legend="Bioquímica" className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <InputTextOneLine
                label="Glucosa (mg/dl)"
                name="glucosa"
                value={form.glucosa}
                labelWidth="120px"
                onChange={handleChange}
                onKeyUp={(e) => { handleFocusNext(e, "creatinina") }}
              />
              <div className="flex gap-4 items-center">
                <InputCheckbox
                  label="N/A"
                  checked={form.glucosa === "N/A"}
                  onChange={e => setForm(f => ({ ...f, glucosa: e.target.checked ? "N/A" : "" }))}
                />
                <span className="ml-6 text-gray-600 font-medium">
                  Valores normales 70 - 110 mg/dl
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InputTextOneLine
                label="Creatinina (mg/dl)"
                name="creatinina"
                value={form.creatinina}
                labelWidth="120px"
                onChange={handleChange}
                onKeyUp={(e) => { handleFocusNext(e, "densidad") }}
              />
              <div className="flex gap-4 items-center">
                <InputCheckbox
                  label="N/A"
                  checked={form.creatinina === "N/A"}
                  onChange={e => setForm(f => ({ ...f, creatinina: e.target.checked ? "N/A" : "" }))}
                />
                <span className="ml-6 text-gray-600 font-medium">
                  Valores normales 0.8 - 1.4 mg/dl
                </span>
              </div>
            </div>
          </SectionFieldset>

          {/* Registros anteriores */}
          <SectionFieldset legend="Registros anteriores" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full  border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className=" text-center">
                    <th className="border px-2 py-1">Fecha Lab</th>
                    <th className="border px-2 py-1">Grupo</th>
                    <th className="border px-2 py-1">RH</th>
                  </tr>
                </thead>
                <tbody>
                  {form.dataTabla.length === 0 ? (
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 text-center" colSpan={3}>
                        Sin Datos...
                      </td>
                    </tr>
                  ) : (
                    form.dataTabla.map((row, i) => (
                      <tr key={i} className="text-center">
                        <td className="font-bold border-b border-gray-200 py-1 ">{row.fechaLab}</td>
                        <td className="border-b border-gray-200 py-1 ">{row.grupoSanguineo}</td>
                        <td className="border-b border-gray-200 py-1 ">{row.factorRh}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </SectionFieldset>
        </div>

      </div>

      {/*Examen de Orina */}
      <SectionFieldset legend="Examen de Orina" className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6 flex flex-col">
            <SectionFieldset legend="Examen Físico" className="space-y-4 flex-1">
              <div className="flex justify-end">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      color: form.color == "N/A" ? "AMARILLO CLARO" : "N/A",
                      aspecto: form.color == "N/A" ? "TRANSPARENTE" : "N/A",
                      densidad: form.color == "N/A" ? "" : "N/A",
                      ph: form.color == "N/A" ? "" : "N/A",

                      nitritos: form.color == "N/A" ? "NEGATIVO" : "N/A",
                      proteinas: form.color == "N/A" ? "NEGATIVO" : "N/A",
                      cetonas: form.color == "N/A" ? "NEGATIVO" : "N/A",
                      leucocitosExamenQuimico: form.color == "N/A" ? "NEGATIVO" : "N/A",
                      acAscorbico: form.color == "N/A" ? "NEGATIVO" : "N/A",
                      urobilinogeno: form.color == "N/A" ? "NEGATIVO" : "N/A",
                      bilirrubina: form.color == "N/A" ? "NEGATIVO" : "N/A",
                      glucosaExamenQuimico: form.color == "N/A" ? "NEGATIVO" : "N/A",
                      sangre: form.color == "N/A" ? "NEGATIVO" : "N/A",

                      leucocitosSedimentoUnitario: form.color == "N/A" ? "0-1" : "N/A",
                      hematiesSedimentoUnitario: form.color == "N/A" ? "0-0" : "N/A",
                      celEpiteliales: form.color == "N/A" ? "ESCASAS" : "N/A",
                      cristales: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",
                      cilindros: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",
                      bacterias: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",
                      gramSc: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",
                      otros: form.color == "N/A" ? "NO SE OBSERVAN" : "N/A",

                      cocaina: form.color == "N/A" ? "" : "N/A",
                      marihuana: form.color == "N/A" ? "" : "N/A",
                    }))
                  }}
                >
                  No Aplica
                </button>
              </div>
              <div className="grid xl:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <label className="font-semibold min-w-[100px] max-w-[100px]">Color :</label>
                  <select name="color" value={form.color} className="border rounded p-1 w-full" onChange={handleChange}>
                    <option>N/A</option>
                    <option>AMARILLO CLARO</option>
                    <option>AMARILLO PAJIZO</option>
                    <option>AMARILLO AMBAR</option>
                    <option>AMBAR</option>
                    <option>INCOLORO</option>
                    <option>MEDICAMENTOSO</option>
                    <option>SANGUINOLENTO</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="font-semibold min-w-[100px] max-w-[100px]">Aspecto:</label>
                  <select name="aspecto" value={form.aspecto} className="border rounded p-1 w-full" onChange={handleChange}>
                    <option>N/A</option>
                    <option>LIGERAMENTE TURBIO</option>
                    <option>TRANSPARENTE</option>
                    <option>TURBIO</option>
                  </select>
                </div>
                <InputTextOneLine
                  label="Densidad"
                  name="densidad"
                  value={form.densidad}
                  labelWidth="100px"
                  onChange={handleChange}
                  onKeyUp={(e) => { handleFocusNext(e, "ph") }}
                />
                <InputTextOneLine
                  label="PH"
                  name="ph"
                  value={form.ph}
                  labelWidth="100px"
                  onChange={handleChange}
                  onKeyUp={(e) => { handleFocusNext(e, "cocaina") }}
                />
              </div>
            </SectionFieldset>

            <SectionFieldset legend="Sedimento Urinario" className="space-y-2 grid xl:grid-cols-2 gap-x-4">
              <div className="grid gap-y-2">
                {[
                  { label: 'Leucocitos (x campos)', key: 'leucocitosSedimentoUnitario' },
                  { label: 'CelEpiteliales', key: 'celEpiteliales' },
                  { label: 'Cilindros', key: 'cilindros' },
                  { label: 'Gram S/C', key: 'gramSc' },
                ].map((item) => (
                  <InputTextOneLine
                    label={item.label}
                    name={item.key}
                    key={item.key}
                    value={form[item.key]}
                    onChange={handleChange}
                    onKeyUp={handleFocusNext}
                  />
                ))}
              </div>
              <div className="grid gap-y-2">
                {[
                  { label: 'Hematies (x campos)', key: 'hematiesSedimentoUnitario' },
                  { label: 'Cristales', key: 'cristales' },
                  { label: 'Bacterias', key: 'bacterias' },
                  { label: 'Otros', key: 'otros' },
                ].map((item) => (
                  <InputTextOneLine
                    label={item.label}
                    name={item.key}
                    key={item.key}
                    value={form[item.key]}
                    onChange={handleChange}
                    onKeyUp={handleFocusNext}
                  />
                ))}
              </div>
            </SectionFieldset>
          </div>
          <div className="space-y-6 flex flex-col">
            <SectionFieldset legend="Examen Químico" className="grid xl:grid-cols-2 gap-y-2 xl:gap-y-0 gap-x-4">
              <div className="grid gap-y-2 ">
                {[
                  { label: 'Nitritos', key: 'nitritos' },
                  { label: 'Cetonas', key: 'cetonas' },
                  { label: 'Ác. Ascórbico', key: 'acAscorbico' },
                  { label: 'Bilirrubina', key: 'bilirrubina' },
                  { label: 'Sangre', key: 'sangre' },
                ].map((item) => (
                  <InputTextOneLine
                    label={item.label}
                    name={item.key}
                    key={item.key}
                    value={form[item.key]}
                    onChange={handleChange}
                    onKeyUp={handleFocusNext}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-y-2 ">
                {[
                  { label: 'Proteínas', key: 'proteinas' },
                  { label: 'Leucocitos', key: 'leucocitosExamenQuimico' },
                  { label: 'Urobilinógeno', key: 'urobilinogeno' },
                  { label: 'Glucosa', key: 'glucosaExamenQuimico' },

                ].map((item) => (
                  <InputTextOneLine
                    label={item.label}
                    name={item.key}
                    key={item.key}
                    value={form[item.key]}
                    onChange={handleChange}
                    onKeyUp={handleFocusNext}
                  />
                ))}
              </div>
            </SectionFieldset>

            <SectionFieldset legend="Drogas" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[
                { label: 'Cocaína', key: 'cocaina' },
                { label: 'Marihuana', key: 'marihuana' }
              ].map(item => (
                <div className="space-y-3" key={item.key}>
                  <InputTextOneLine
                    label={item.label}
                    name={item.key}
                    value={form[item.key]}
                    onChange={handleChange}
                    onKeyUp={(e) => { handleFocusNext(e, item.key == "cocaina" ? "marihuana" : "") }}
                  />
                  <div className="flex justify-center">
                    <InputsRadioGroup
                      name={item.key}
                      value={form[item.key]}
                      options={[
                        { label: 'POSITIVO', value: 'POSITIVO' },
                        { label: 'NEGATIVO', value: 'NEGATIVO' },
                        { label: 'N/A', value: 'N/A' }
                      ]}
                      onChange={handleRadioButton}
                    />
                  </div>
                </div>
              ))}
            </SectionFieldset>
          </div>
        </div>

        <SectionFieldset legend="Conclusiones" className="space-y-4">
          <InputTextArea
            label="Observaciones"
            name="observaciones"
            value={form.observaciones}
            rows={4}
            onChange={handleChange}
          />
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
      </SectionFieldset>

      <BotonesAccion //space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
};
