import { 
    Valores, 
    VerifyTR, 
    SubmitDataService, 
} from "./controllerCertificadoMedicoOcupacional.jsx";

import { InputTextOneLine, InputTextArea } from "../../../../../views/components/reusableComponents/ResusableComponents.jsx";
import SectionFieldset from "../../../../../views/components/reusableComponents/SectionFieldset.jsx";
import { useForm } from "../../../../hooks/useForm.js"; 
import { useSessionData } from "../../../../hooks/useSessionData.js";
import { getToday } from "../../../../utils/helpers.js";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../components/templates/Templates";
import InputsRadioGroup from "../../../../../views/components/reusableComponents/InputsRadioGroup.jsx";
import EmpleadoComboBox from "../../../../../views/components/reusableComponents/EmpleadoComboBox.jsx";

const tabla = "certificado_aptitud_medico_resumen";

export default function CertificadoMedicoOcupacional2() {
    // ... resto de tu componente
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        norden: "",
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
        apto: "APTO",
        conclusiones: "",
        observaciones: "",

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


const handleSave = () => {
    // Descomentado para que guarde en la BD
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
};

const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const handleRadioButton = (e) => {
        handleChangeSimple({ target: { name: "apto", value: e.target.value } });
    };

    const handleRadioButton2 = (e, valor) => {

        const textoFinal = generarConclusiones(form, Valores, valor);

        setForm((prev) => ({
            ...prev,
            // conclusiones: valor,
            observaciones: textoFinal,
        }));
    };

    function generarConclusiones(form, valores, textoSeleccionado) {
        let conclusiones = "";

        // ==============================
        // 🔹 1. TRIAJE
        // ==============================
        const { pesoTriaje, tallaTriaje } = form;

        if (pesoTriaje && tallaTriaje) {
            conclusiones += `- TRIAJE ( PESO: ${pesoTriaje} KG ; TALLA: ${tallaTriaje} CM )\n`;
        }

        // ==============================
        // 🔹 2. OBTENER PLANTILLA SEGÚN RADIO
        // ==============================
        let plantillaTexto = "";

        if (typeof textoSeleccionado === "string" && valores.hasOwnProperty(textoSeleccionado)) {
            plantillaTexto = valores[textoSeleccionado];
        } else {
            // buscar si es exactamente igual a algún Valores[clave]
            const keyMatch = Object.keys(valores).find(k => valores[k] === textoSeleccionado);
            if (keyMatch) {
                plantillaTexto = valores[keyMatch];
            } else {
                // sino asumimos que textoSeleccionado es ya el texto de plantilla
                plantillaTexto = textoSeleccionado || "";
            }
        }

        const plantillaLineas = plantillaTexto
            ? plantillaTexto.split("\n").map(l => l.trim()).filter(Boolean)
            : [];

        const grupoFactor = form.grupoFactor && form.grupoFactor !== "N/A" ? form.grupoFactor : null;

        const lineasProcesadas = plantillaLineas.map(linea => {
            if (linea.includes("{grupoFactor}")) {
                if (grupoFactor) {
                    return linea.replace("{grupoFactor}", grupoFactor);
                } else {
                    return linea.replace(/,?\s*Grupo Sangu[ií]neo y Factor\s*\(\{grupoFactor\}\)/i, "").trim();
                }
            }
            return linea;
        });

        conclusiones += lineasProcesadas.join("\n");
        return conclusiones.trim();
    }


    return (
        <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
            <div className="grid grid-cols-5 gap-x-4 gap-y-3">
                <div className="col-span-4 space-y-3">
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
                            label="Tipo de Examen"
                            name="nombreExamen"
                            value={form?.nombreExamen}
                            labelWidth="120px"
                            onChange={handleChangeSimple}
                        />                        
                        <InputTextOneLine
                            label="Hora"
                            name="hora"
                            value={hora}
                            disabled
                        />
                    </SectionFieldset>

                    <DatosPersonalesLaborales form={form} />

                    <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                        <SectionFieldset legend="Estado de Aptitud" className="space-y-6">
                            <InputsRadioGroup
                                vertical
                                name="apto"
                                value={form?.apto}
                                onChange={handleRadioButton}
                                options={[
                                    { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                    { label: "APTO con RESTRICCION (para el puesto en el que trabaja o postula)", value: "APTOCONRESTRICCION" },
                                    { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" }
                                ]}
                            />
                            <div className="grid 2xl:grid-cols-2 gap-x-6 gap-y-3">
                                <InputTextOneLine
                                    label="Fecha Inicio"
                                    name="fechaDesde"
                                    type="date"
                                    value={form?.fechaDesde}
                                    labelWidth="110px"
                                    onChange={handleChangeSimple}
                                />
                                <InputTextOneLine
                                    label="Fecha Vencimiento"
                                    name="fechahasta"
                                    type="date"
                                    value={form?.fechahasta}
                                    labelWidth="110px"
                                    onChange={handleChange}
                                />
                            </div>

                            <InputsRadioGroup
                                name="conclusiones"
                                value={form.conclusiones}
                                onChange={(e, valor) => handleRadioButton2(e, valor)}
                                vertical
                                options={[
                                    { label: "1. MARSA - OPERATIVA, SUPERVISOR, AYUDANTE", value: "CHECK1" },
                                    { label: "2. MARSA - CONDUCTOR U OPERADOR MAQUINARIA", value: "CHECK2" },
                                    { label: "3. MARSA - RETIRO", value: "CHECK3" },
                                    { label: "4. RETIRO BOROO", value: "CHECK4" },
                                    { label: "5. BOROO - PSICONSENSOMETRICO Y ALTURA Perfil Lipidico.", value: "CHECK5" },
                                    { label: "6. PROTOCOLO PODEROSA RETIRO", value: "CHECK6" },
                                    { label: "7. PROTOCOLO PODEROSA", value: "CHECK7" }
                                ]}
                            />
                            <EmpleadoComboBox
                                value={form.nombre_medico}
                                form={form}
                                onChange={handleChangeSimple}
                            />
                        </SectionFieldset>

                        <SectionFieldset legend="Exámenes / Observaciones">
                            <InputTextArea
                                name="observaciones"
                                value={form.observaciones}
                                onChange={handleChangeSimple}
                                rows={12}
                                className="w-full h-full"
                            />
                        </SectionFieldset>

                    </div>
                    <BotonesAccion
                        form={form}
                        handleSave={handleSave}
                        handleClear={handleClear}
                        handlePrint={handlePrint}
                        handleChangeNumberDecimals={handleChangeNumberDecimals}
                    />
                </div>
                <div className="space-y-3">

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


        </div>
    );
}