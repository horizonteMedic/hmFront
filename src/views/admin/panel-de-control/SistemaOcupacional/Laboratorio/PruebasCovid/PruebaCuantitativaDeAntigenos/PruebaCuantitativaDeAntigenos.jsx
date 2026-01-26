import { useState, useEffect } from "react";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerPruebaCuantitativaDeAntigenos";
import {
  InputTextOneLine,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { getFetch } from "../../../../../../utils/apiHelpers";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const DEFAULT_TECNICA = {
  tecnica: "Inmunofluorescencia",
  sensibilidad: "95.00%",
  especificidad: "95.00%",
};
const tabla = "examen_inmunologico";

export default function PruebaCuantitativaDeAntigenos() {
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

    marca: "",
    doctor: "N/A",
    valor: "",

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
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear);
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

  const selectedMarca =
    marcas.find((m) => m.mensaje === form.marca) || DEFAULT_TECNICA;

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
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
      <SectionFieldset legend="COVID - 19 Prueba Rápida" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                {marcas.map((m) => (
                  <option key={m.id} value={m.mensaje}>
                    {m.mensaje}
                  </option>
                ))}
              </select>
            </div>
            <InputTextOneLine
              label="Valor"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              labelWidth="120px"
            />
          </div>
          <div className="border rounded bg-gray-50 p-4 text-base min-h-[100px]">
            <div>
              <span className="font-semibold">Tecnica:</span>{" "}
              {selectedMarca.tecnica || DEFAULT_TECNICA.tecnica}
            </div>
            <div>
              <span className="font-semibold">SENSIBILIDAD:</span>{" "}
              {selectedMarca.sensibilidad || DEFAULT_TECNICA.sensibilidad}
            </div>
            <div>
              <span className="font-semibold">ESPECIFICIDAD:</span>{" "}
              {selectedMarca.especificidad || DEFAULT_TECNICA.especificidad}
            </div>
          </div>
        </div>
      </SectionFieldset>

      {/* Médico */}
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
    </div>
  );
}
