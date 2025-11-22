import { useState, useEffect } from "react";
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { getFetch } from "../../../../getFetch/getFetch";
import Swal from 'sweetalert2';

import {
  InputTextOneLine,
  InputCheckbox,
  SectionFieldset,
  InputsRadioGroup
} from '../../../../../../components/reusableComponents/ResusableComponents';

import { getToday } from "../../../../../../utils/helpers";
import ExamenOrina from "../ExamenOrina/ExamenOrina";
import { useForm } from "../../../../../../hooks/useForm";

const tabla = "lab_clinico";

export default function HematologiaBioquimicaSIEO() {
  const today = getToday();

  const { token, userlogued, selectedSede, datosFooter } = useSessionData();

  const initialFormState = {
    norden: "",
    fechaExamen: today,
    dni: "",
    incompleto: false,

    responsable: "",
    nombres: "",
    gfSangPedido: "",
    contrata: "",
    empresa: "",

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
  };

  const {
    form,
    setForm,
    handleChange,
    handleClearnotO,
    handlePrintDefault,
    handleChangeNumber,
    handleChangeSimple,
    handleClear,
    handleRadioButtonBoolean,
    handleRadioButton,
  } = useForm(initialFormState, { storageKey: "fichaPsicologicaAnexo2" });

  const handleSave = () => {
    // SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      // PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };


  const GetTable = (nro) => {
    getFetch(
      `/api/v01/ct/laboratorio/listadoGrupoFactorSanguineo?nOrden=${nro}`,
      token
    ).then((res) => {
      setForm({ ...form, dataTabla: res || [] });
    });
  };

  // useEffect(() => {
  //   const grupo = form.grupo ;
  //   const rh = (form.rh ).replace("Rh", "");
  //   setField("gfSangPedido", `${grupo} ${rh}`.trim());
  // }, [form.grupo, form.rh]);

  return (
    <div className="p-4 space-y-3">
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          disabled
        />
        <InputTextOneLine
          label="Fecha"
          name="fechaExamen"
          type="date"
          value={form.fechaExamen}
          disabled
        />
        <InputTextOneLine
          label="DNI"
          name="dni"
          value={form.dni}
          disabled
        />
        <InputCheckbox
          label="Ficha Médica Ocupacional"
          checked={true}
          disabled
        />
        <InputCheckbox
          label={<span className="text-red-600 font-bold">INCOMPLETO</span>}
          checked={form.incompleto}
        />
      </SectionFieldset>
      <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <InputTextOneLine
          label="Responsable Lab"
          name="responsable"
          value={form.responsable}
          className="col-span-2"
          labelWidth="140px"
          disabled
        />
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          disabled
          labelWidth="140px"
        />
        <InputTextOneLine
          label="G.F. Sang. Pedido"
          name="gfSangPedido"
          value={form.gfSangPedido}
          disabled
          labelWidth="140px"
        />
        <InputTextOneLine
          label="Contrata"
          name="contrata"
          value={form.contrata}
          disabled
          labelWidth="140px"
        />
        <InputTextOneLine
          label="Empresa"
          name="empresa"
          value={form.empresa}
          disabled
          labelWidth="140px"
        />
      </SectionFieldset>
      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hematología */}
        <SectionFieldset legend="Hematología" className="space-y-3">
          <InputCheckbox
            label={<span className="font-medium">N/A</span>}
            checked={false}
            disabled
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
              ))}
            </div>
            <div className="space-y-3">
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
                />
              ))}
            </div>
          </div>
        </SectionFieldset>
        <div className="space-y-3">
          {/* Reacciones Serológicas */}
          <SectionFieldset legend="Reacciones Serológicas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <InputTextOneLine
                  label="RPR"
                  name="rpr"
                  value={form.rpr}
                  disabled
                />
                <div className="flex items-center gap-4 justify-center">
                  <InputCheckbox
                    label="-"
                    checked={form.rpr === "NEGATIVO"}
                    onChange={e => setForm(f => ({ ...f, rpr: e.target.checked ? "NEGATIVO" : "" }))}
                  />
                  <InputCheckbox
                    label="+"
                    checked={form.rpr === "POSITIVO"}
                    onChange={e => setForm(f => ({ ...f, rpr: e.target.checked ? "POSITIVO" : "" }))}
                  />
                  <InputCheckbox
                    label="N/A"
                    checked={form.rpr === "N/A"}
                    onChange={e => setForm(f => ({ ...f, rpr: e.target.checked ? "N/A" : "" }))}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <InputTextOneLine
                  label="VIH"
                  name="vih"
                  value={form.vih}
                  disabled
                />
                <div className="flex items-center gap-4 justify-center">
                  <InputCheckbox
                    label="-"
                    checked={form.vih === "NEGATIVO"}
                    onChange={e => setForm(f => ({ ...f, vih: e.target.checked ? "NEGATIVO" : "" }))}
                  />
                  <InputCheckbox
                    label="+"
                    checked={form.vih === "POSITIVO"}
                    onChange={e => setForm(f => ({ ...f, vih: e.target.checked ? "POSITIVO" : "" }))}
                  />
                  <InputCheckbox
                    label="N/A"
                    checked={form.vih === "N/A"}
                    onChange={e => setForm(f => ({ ...f, vih: e.target.checked ? "N/A" : "" }))}
                  />
                </div>
              </div>
            </div>
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
                  {/* {tableLab.length === 0 ? (
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 text-center" colSpan={3}>
                        Sin Datos...
                      </td>
                    </tr>
                  ) : (
                    tableLab.map((row, i) => (
                      <tr key={i} className="text-center">
                        <td className="font-bold border-b border-gray-200 py-1 ">{row.fechaLab}</td>
                        <td className="border-b border-gray-200 py-1 ">{row.grupoSanguineo}</td>
                        <td className="border-b border-gray-200 py-1 ">{row.factorRh}</td>
                      </tr>
                    ))
                  )} */}
                </tbody>
              </table>
            </div>
          </SectionFieldset>
        </div>

      </div>

      {/* <ExamenOrina
        form={formO}
        setForm={setFormO}
        formH={form}
        ClearForm={ClearForm}
        setFormH={setForm}
        ClearFormO={ClearFormO}
      /> */}
    </div>
  );
};
