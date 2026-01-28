import { InputTextOneLine, InputTextArea } from "../../../../../views/components/reusableComponents/ResusableComponents.jsx";
import SectionFieldset from "../../../../../views/components/reusableComponents/SectionFieldset.jsx";
import { useForm } from "../../../../hooks/useForm.js"; // <- ruta CORRECTA
import { useSessionData } from "../../../../hooks/useSessionData.js";
import { getToday, getHoraActual } from "../../../../utils/helpers.js";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../components/templates/Templates";
import InputsRadioGroup from "../../../../../views/components/reusableComponents/InputsRadioGroup.jsx";
import EmpleadoComboBox from "../../../../../views/components/reusableComponents/EmpleadoComboBox.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";
    
export default function CertificadoMedicoOcupacional2() {
    const today = getToday();
    const hora = getHoraActual();

    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        norden: "",
        fecha: today,
        fechaDesde: today,
        fechahasta: today,
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
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",
        apto: "",
        conclusiones: "",

        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleClear,
        handleClearnotO,
        handlePrintDefault
    } = useForm(initialFormState);

        // Handlers adicionales
    const handleSearch = (e) => {
        if (e.key === "Enter") {
        handleClearnotO();
        VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handleClearnotOandEspecialidad = () => {
        setForm((prev) => ({ ...initialFormState, norden: prev.norden, fechaDesde: today, fechahasta: today }));
        try {
            localStorage.setItem(
                "Certificado_Medico_Ocupacional_form",
                JSON.stringify({ ...initialFormState, norden: form.norden, fechaDesde: today, fechahasta: today })
            );
        } catch (err) {
            console.warn("Error guardando localStorage", err);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            // PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const handleSave = () => {
        // SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
        console.log("Guardando datos:", form);
    };

    const handleRadioButton = (e) => {
        handleChangeSimple({ target: { name: "apto", value: e.target.value } });
    };

    const handleRadioButton2 = (e) => {
        const { name, value } = e.target;
        const textoFinal = value; 
        setForm((prev) => ({ ...prev, [name]: textoFinal }));
    };

return (
  <div className="space-y-3 px-4 max-w-[100%] xl:max-w-[90%] mx-auto">
    <div className="flex flex-row gap-4 items-start">
      <div className="flex-[4] space-y-3">
        
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-3 gap-3">
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
          label="Hora"
          name="hora"
          value={hora}
          disabled
        />
        </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

<div className="grid grid-cols-2 gap-4">
    <div className="space-y-3">
        <SectionFieldset legend="Estado de Aptitud">
            <div className="p-3 space-y-2">
                <InputsRadioGroup
                    vertical
                    name="apto" 
                    value={form?.apto} 
                    className="py-1 text-[11px] font-bold"
                    onChange={handleRadioButton} 
                    options={[
                        { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                        { label: "APTO con RESTRICCION (para el puesto en el que trabaja o postula)", value: "APTOCONRESTRICCION" },
                        { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" }
                    ]}
                />
                <div className="w-full flex justify-between items-center pt-2 pb-2 px-2 border-t border-b bg-gray-50/50">
                    <InputTextOneLine
                        label="Fecha"
                        name="fechaDesde"
                        type="date"
                        value={form?.fechaDesde}
                        labelWidth="60px"
                        onChange={handleChange}
                    />
                    <InputTextOneLine
                        label="Fecha Venc"
                        name="fechahasta"
                        type="date"
                        value={form?.fechahasta}
                        labelWidth="85px"
                        onChange={handleChange}
                    />
                </div>

                <div className="pt-2 space-y-1">
                    <InputsRadioGroup
                        name="conclusiones" value={form.conclusiones} 
                        onChange={handleRadioButton2} className="text-[10px] font-bold"
                        options={[{ label: "1. MARSA - OPERATIVA, SUPERVISOR, AYUDANTE", value: "Check1" }]}
                    />
                    <InputsRadioGroup
                        name="conclusiones" value={form.conclusiones} 
                        onChange={handleRadioButton2} className="text-[10px] font-bold"
                        options={[{ label: "2. MARSA - CONDUCTOR u OPERADOR MAQUINARIA", value: "Check2" }]}
                    />
                    
                    <div className="w-full grid grid-cols-2 gap-2">
                        <InputsRadioGroup
                            name="conclusiones" value={form.conclusiones} 
                            onChange={handleRadioButton2} className="text-[10px] font-bold"
                            options={[{ label: "3. MARSA - RETIRO", value: "Check3" }]}
                        />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2">
                        <InputsRadioGroup
                            name="conclusiones" value={form.conclusiones} 
                            onChange={handleRadioButton2} className="text-[10px] font-bold"
                            options={[{ label: "4. RETIRO BOROO", value: "Check4" }]}
                        />
                    </div>
                    <InputsRadioGroup
                        name="conclusiones" value={form.conclusiones} 
                        onChange={handleRadioButton2} className="text-[10px] font-bold"
                        options={[{ label: "5. BOROO - PSICONSENSOMETRICO Y ALTURA Perfil Lipidico.", value: "Check5" }]}
                    />
                </div>
                  <EmpleadoComboBox
                      value={form.nombre_medico}
                      form={form}
                       onChange={handleChangeSimple}
                  />
            </div>
        </SectionFieldset>
    </div>

          <SectionFieldset legend="Exámenes / Observaciones" className="h-full">
            <InputTextArea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChangeSimple}
              rows={12}
              className="w-full h-full"
            />
          </SectionFieldset>
          
        </div>
      </div>

<div className="w-1/5 space-y-4">
    
    <SectionFieldset legend="Resultados Oftalmología">
        <div className="p-2 space-y-6 text-[10px]">
            
            <div className="space-y-3">
                <p className="text-center font-bold border-b text-blue-700 uppercase">Sin Corregir</p>
                <div className="grid grid-cols-2 gap-4">
                    {/* O.D. */}
                    <div className="space-y-2">
                        <p className="text-center font-bold border-b">O.D.</p>
                        <InputTextOneLine label="V.C." name="visionCercaSincorregirOd_v_cerca_s_od" value={form?.visionCercaSincorregirOd_v_cerca_s_od} disabled labelWidth="30px" />
                        <InputTextOneLine label="V.L." name="visionLejosSincorregirOd_v_lejos_s_od" value={form?.visionLejosSincorregirOd_v_lejos_s_od} disabled labelWidth="30px" />
                    </div>
                    {/* O.I. */}
                    <div className="space-y-2">
                        <p className="text-center font-bold border-b">O.I.</p>
                        <InputTextOneLine label="V.C." name="visionCercaSincorregirOi_v_cerca_s_oi" value={form?.visionCercaSincorregirOi_v_cerca_s_oi} disabled labelWidth="30px" />
                        <InputTextOneLine label="V.L." name="visionLejosSincorregirOi_v_lejos_s_oi" value={form?.visionLejosSincorregirOi_v_lejos_s_oi} disabled labelWidth="30px" />
                    </div>
                </div>
            </div>

            {/* SUB-BLOQUE: CORREGIDA */}
            <div className="space-y-3 pt-2 border-t">
                <p className="text-center font-bold border-b text-blue-700 uppercase">Corregida</p>
                <div className="grid grid-cols-2 gap-4">
                    {/* O.D. */}
                    <div className="space-y-2">
                        <p className="text-center font-bold border-b">O.D.</p>
                        <InputTextOneLine label="V.C." name="oftalodccmologia_odcc" value={form?.oftalodccmologia_odcc} disabled labelWidth="30px" />
                        <InputTextOneLine label="V.L." name="odlcOftalmologia_odlc" value={form?.odlcOftalmologia_odlc} disabled labelWidth="30px" />
                    </div>
                    {/* O.I. */}
                    <div className="space-y-2">
                        <p className="text-center font-bold border-b">O.I.</p>
                        <InputTextOneLine label="V.C." name="oiccoftalmologia_oicc" value={form?.oiccoftalmologia_oicc} disabled labelWidth="30px" />
                        <InputTextOneLine label="V.L." name="oilcOftalmologia_oilc" value={form?.oilcOftalmologia_oilc} disabled labelWidth="30px" />
                    </div>
                </div>
            </div>

            {/* OTROS VALORES */}
            <div className="space-y-2 pt-2 border-t">
                <InputTextOneLine label="V.Clrs" name="vcOftalmologia_vc" value={form?.vcOftalmologia_vc} disabled labelWidth="40px" />
                <InputTextOneLine label="V.B." name="vbOftalmologia_vb" value={form?.vbOftalmologia_vb} disabled labelWidth="40px" />
                <InputTextOneLine label="R.P." name="rpOftalmologia_rp" value={form?.rpOftalmologia_rp} disabled labelWidth="40px" />
                <InputTextArea label="Enfermedades Oculares" rows={2} name="enfermedadesOcularesOftalmologia_e_oculares" value={form?.enfermedadesOcularesOftalmologia_e_oculares} disabled className="text-[10px]" />
            </div>
        </div>
    </SectionFieldset>

    {/* SECCIÓN LABORATORIO */}
    <SectionFieldset legend="Laboratorio">
        <div className="p-2 space-y-2">
            <InputTextOneLine label="Hemoglobina" name="hemoglobina_txthemoglobina" value={form?.hemoglobina_txthemoglobina} disabled labelWidth="85px" />
            <InputTextOneLine label="V.S.G" name="vsgLabClinico_txtvsg" value={form?.vsgLabClinico_txtvsg} disabled labelWidth="85px" />
            <InputTextOneLine label="Glucosa" name="glucosaLabClinico_txtglucosabio" value={form?.glucosaLabClinico_txtglucosabio} disabled labelWidth="85px" />
            <InputTextOneLine label="Creatina" name="leucocitoSematologiaLabClinico" value={form?.leucocitoSematologiaLabClinico} disabled labelWidth="85px" />
        </div>
    </SectionFieldset>
</div>

    </div>

    <div className="flex justify-between items-center pt-4 border-t">
       <BotonesAccion 
          form={form} 
          handleSave={handleSave} 
          handleClear={handleClear} 
          handlePrint={handlePrint} 
       />
    </div>

  </div>
);
}