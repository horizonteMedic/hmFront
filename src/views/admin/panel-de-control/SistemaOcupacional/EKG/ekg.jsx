import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import {
  GetInfoServicio,
  getInfoTabla,
  Loading,
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerEKG";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getToday } from "../../../../utils/helpers";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import TablaTemplate from "../../../../components/templates/TablaTemplate";

const tabla = "informe_electrocardiograma";

export default function EKG() {
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: "",
    codigoElectroCardiograma: null,
    nombre: "",
    edad: "",
    fechaNac: "",
    fechaExam: today,
    contrata: "",
    empresa: "",

    informeCompleto: false,
    ritmo: "SINUSAL",
    fc: "",
    eje: "",
    pr: "0.20",
    qrs: "0.08",
    ondaP: "",
    st: "",
    ondaT: "",
    qtc: "N/E",

    conclusiones: "",
    hallazgos: "",
    recomendaciones: "",

    nombres_search: "",
    codigo_search: "",
    usuario: userlogued,

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeSimple,
    handleChangeNumberDecimals,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "ekg" });

  const [dataTabla, setDataTabla] = useState([]);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const handleHallazgosChange = (e, value) => {
    const { checked } = e.target;
    setForm((prev) => {
      let hallazgos = prev.hallazgos;

      if (checked) {
        if (hallazgos.trim() === "" || hallazgos.trim() === "NORMAL") {
          hallazgos = value;
        } else {
          hallazgos += "\n" + value;
        }
      } else {
        hallazgos = "";
      }

      return { ...prev, hallazgos };
    });
  };

  const obtenerInfoTabla = () => {
    getInfoTabla(
      form.nombres_search,
      form.codigo_search,
      form.usuario,
      setDataTabla,
      token
    );
  };

  useEffect(() => {
    obtenerInfoTabla();
  }, []);

  return (
    <div className="px-4 max-w-[90%] xl:max-w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">
      <div className="space-y-3">
        {/* SECCIÓN SUPERIOR - FILIACIÓN */}
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
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
            name="fechaExam"
            type="date"
            value={form.fechaExam}
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
            label="Informe Especialista"
            name="informeCompleto"
            checked={form?.informeCompleto}
            onChange={(e) => {
              handleCheckBoxChange(e);
              setForm((prev) => ({
                ...prev,
                conclusiones: "",

                ritmo: "",
                fc: "",
                eje: "",
                pr: "",
                qrs: "",
                ondaP: "",
                st: "",
                ondaT: "",
                qtc: "",
              }));
            }}
          />
        </SectionFieldset>

        <SectionFieldset legend="Datos Personales" collapsible className="grid grid-cols-1 3xl:grid-cols-2 gap-x-4 gap-y-3">
          <InputTextOneLine
            label="Nombres"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="120px"
          />
          <div className="grid 2xl:grid-cols-2 gap-3">
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
          <div className="grid 2xl:grid-cols-2 gap-3">
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

        <SectionFieldset legend="Datos Laborales" collapsible className="grid gap-y-3">
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
        
        <SectionFieldset
          legend="Parámetros Electrocardiográficos"
          className="grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3"
        >
          <div className="grid xl:grid-cols-4 gap-x-4 gap-y-3 xl:col-span-3 mb-3">
            <InputCheckbox
              label="Ritmo: Sinusal"
              name="ritmo"
              checked={form.ritmo === "SINUSAL"}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  ritmo: e.target.checked ? "SINUSAL" : "",
                }));
              }}
            />

            <InputCheckbox
              label="P.R: 0.20"
              name="pr"
              checked={form.pr === "0.20"}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  pr: e.target.checked ? "0.20" : "",
                }));
              }}
            />

            <InputCheckbox
              label="Q.T.C.: N/E"
              name="qtc"
              checked={form.qtc === "N/E"}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  qtc: e.target.checked ? "N/E" : "",
                }));
              }}
            />

            <InputCheckbox
              label="Q.R.S.: 0.08"
              name="qrs"
              checked={form.qrs === "0.08"}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  qrs: e.target.checked ? "0.08" : "",
                }));
              }}
            />
          </div>
          {/* Fila 1 */}
          <InputTextOneLine
            label="Ritmo"
            name="ritmo"
            value={form.ritmo ?? ""}
            onChange={handleChange}
            labelWidth="80px"
          />

          <InputTextOneLine
            label="F.C. (x min)"
            name="fc"
            value={form.fc ?? ""}
            onChange={handleChange}
            labelWidth="80px"
          />

          <InputTextOneLine
            label="Eje (°)"
            name="eje"
            value={form.eje ?? ""}
            onChange={handleChange}
            labelWidth="80px"
          />

          {/* Fila 2 */}
          <InputTextOneLine
            label="P.R."
            name="pr"
            value={form.pr ?? ""}
            onChange={handleChange}
            labelWidth="80px"
          />

          <InputTextOneLine
            label="Q.R.S."
            name="qrs"
            value={form.qrs ?? ""}
            onChange={handleChange}
            labelWidth="80px"
          />

          <InputTextOneLine
            label="Q.T.C."
            name="qtc"
            value={form.qtc ?? ""}
            onChange={handleChange}
            labelWidth="80px"
          />

          {/* Fila 3 */}
          <InputTextOneLine
            label="S.T."
            name="st"
            value={form.st ?? ""}
            onChange={handleChange}
            disabled={!form.informeCompleto}
            labelWidth="80px"
          />

          <InputTextOneLine
            label="Onda T."
            name="ondaT"
            value={form.ondaT ?? ""}
            onChange={handleChange}
            disabled={!form.informeCompleto}
            labelWidth="80px"
          />

          <InputTextOneLine
            label="Onda P"
            name="ondaP"
            value={form.ondaP ?? ""}
            onChange={handleChange}
            disabled={!form.informeCompleto}
            labelWidth="80px"
          />
        </SectionFieldset>


        {/* HALLAZGO Y RECOMENDACIONES */}
        <SectionFieldset
          legend="Conclusiones y Recomendaciones"
          className="space-y-3"
        >
          <InputTextArea
            label="Hallazgos / Observaciones"
            name="hallazgos"
            value={form.hallazgos}
            rows={4}
            onChange={handleChange}
          />

          {/* Checkboxes de hallazgos */}
          <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4">
            <InputCheckbox
              label="Normal"
              name="normal"
              checked={form.hallazgos.includes("NORMAL")}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  hallazgos: e.target.checked ? "NORMAL" : "",
                  recomendaciones: e.target.checked ? "EVALUACIÓN ANUAL" : "",
                }));
              }}
            />

            <InputCheckbox
              label="B.S. Fisiológica"
              name="bradicardiaSinusalFisiologica"
              checked={form.hallazgos.includes("BRADICARDIA SINUSAL FISIOLOGICA")}
              onChange={(e) => {
                handleHallazgosChange(e, "BRADICARDIA SINUSAL FISIOLOGICA");
                setForm((prev) => ({
                  ...prev,
                  recomendaciones: e.target.checked ? "EVALUACIÓN ANUAL" : "",
                }));
              }}
            />

            <InputCheckbox
              label="B.S. Asintomática"
              name="bradicardiaSinusalAsintomatica"
              checked={form.hallazgos.includes("BRADICARDIA SINUSAL ASINTOMATICA")}
              onChange={(e) => {
                handleHallazgosChange(e, "BRADICARDIA SINUSAL ASINTOMATICA");
                setForm((prev) => ({
                  ...prev,
                  recomendaciones: e.target.checked ? "EVALUACIÓN ANUAL" : "",
                }));
              }}
            />

            <InputCheckbox
              label="B.I. Rama Derecha"
              name="bloqueoRamaDerecha"
              checked={form.hallazgos.includes("BLOQUEO INCOMPLETO RAMA DERECHA")}
              onChange={(e) => {
                handleHallazgosChange(e, "BLOQUEO INCOMPLETO RAMA DERECHA");
                setForm((prev) => ({
                  ...prev,
                  recomendaciones: e.target.checked
                    ? ""
                    : prev.recomendaciones,
                }));
              }}
            />

            <InputCheckbox
              label="D.I. Eje Cardíaco"
              name="desviacionEjeCardiacoIzquierda"
              checked={form.hallazgos.includes("DESVIACIÓN IZQUIERDA DEL EJE CARDIACO")}
              onChange={(e) => {
                handleHallazgosChange(e, "DESVIACIÓN IZQUIERDA DEL EJE CARDIACO");
                setForm((prev) => ({
                  ...prev,
                  recomendaciones: e.target.checked
                    ? ""
                    : prev.recomendaciones,
                }));
              }}
            />

            <InputCheckbox
              label="D.D. Eje Cardíaco"
              name="desviacionEjeCardiacoDerecha"
              checked={form.hallazgos.includes("DESVIACIÓN DERECHA EJE CARDIACO")}
              onChange={(e) => {
                handleHallazgosChange(e, "DESVIACIÓN DERECHA EJE CARDIACO");
                setForm((prev) => ({
                  ...prev,
                  recomendaciones: e.target.checked
                    ? ""
                    : prev.recomendaciones,
                }));
              }}
            />
          </div>

          <InputTextArea
            label="Conclusiones"
            name="conclusiones"
            value={form.conclusiones}
            rows={4}
            onChange={handleChange}
            disabled={!form.informeCompleto}
          />

          <InputTextArea
            label="Recomendaciones"
            name="recomendaciones"
            value={form.recomendaciones}
            rows={4}
            onChange={handleChange}
          />
        </SectionFieldset>

        <SectionFieldset legend="Asignación de Médico">
          <EmpleadoComboBox
            value={form.nombre_medico}
            label="Especialista"
            form={form}
            onChange={handleChangeSimple}
          />
        </SectionFieldset>
        {/* BOTONES DE ACCIÓN */}
        <BotonesAccion
          form={form}
          handleSave={handleSave}
          handleClear={handleClear}
          handlePrint={handlePrint}
          handleChangeNumberDecimals={handleChangeNumberDecimals}
        />
      </div>

      {/* PANEL DERECHO - BÚSQUEDA Y RESULTADOS */}
      <div className="space-y-3">
        <SectionFieldset legend="Búsqueda de Registros" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <InputTextOneLine
              label="Nombre"
              labelOnTop
              name="nombres_search"
              value={form.nombres_search}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  obtenerInfoTabla();
                }
              }}
              onChange={(e) => { handleChange(e); setForm(prev => ({ ...prev, codigo_search: "" })) }}
            />
            <InputTextOneLine
              label="Código"
              labelOnTop
              name="codigo_search"
              value={form.codigo_search}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  obtenerInfoTabla();
                }
              }}
              onChange={(e) => { handleChangeNumberDecimals(e); setForm(prev => ({ ...prev, nombres_search: "" })) }}
            />
          </div>
          <div className="flex-1">
            <Table
              data={dataTabla}
              tabla={tabla}
              set={setForm}
              token={token}
              clean={handleClear}
              datosFooter={datosFooter}
            />
          </div>
        </SectionFieldset>
        <SectionFieldset legend="Diagrama de Derivaciones del ECG" >
          <img
            src="img/diagrama_derivaciones_ecg.svg"
            alt="Diagrama de Derivaciones del ECG"
            className="mx-auto max-w-[250px] py-4"
          />
        </SectionFieldset>
      </div>
    </div>
  );
}
function Table({ data, tabla, set, token, clean, datosFooter }) {
  // confirmación antes de imprimir
  const handlePrintConfirm = (nro) => {
    Swal.fire({
      title: "Confirmar impresión",
      text: `¿Deseas imprimir la ficha Nº ${nro}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, imprimir",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(nro, token, tabla, datosFooter);
      }
    });
  };

  function clicktable(nro) {
    clean();
    Loading("Importando Datos");
    GetInfoServicio(nro, tabla, set, token, () => {
      Swal.close();
    });
  }
  const columns = [
    {
      label: "N° Orden",
      accessor: "norden",
      width: "120px",
      render: (row) => <span className="font-bold">{row.norden}</span>,
    },
    {
      label: "Nombres",
      accessor: "nombres",
    },
    {
      label: "Fecha",
      accessor: "fechaInforme",
      render: (row) => formatearFechaCorta(row.fechaInforme),
    },
  ];

  return (
    <TablaTemplate
      columns={columns}
      data={data}
      height={761}
      onRowClick={(row) => clicktable(row.norden)}
      onRowRightClick={(row) => handlePrintConfirm(row.norden)}
    />

  );
}
