import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import { useForm } from "../../../../hooks/useForm";
import useRealTime from "../../../../hooks/useRealTime";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import { useSessionData } from "../../../../hooks/useSessionData";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./ControllerCMO";
import { getToday } from "../../../../utils/helpers";
import { Valores } from "./ControllerCMO";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "certificado_aptitud_medico_resumen"
const today = getToday();
const fecha = new Date(today);
fecha.setFullYear(fecha.getFullYear() + 1);

const nextYearDate = fecha.toISOString().split("T")[0];

export default function CertificadoMedicoOcupacional() {
    const { token, userlogued, selectedSede, datosFooter, userName } =
        useSessionData();

    const InitialForm = {
        norden: "",

        nombreExamen: "",
        nombres: "",
        dniPaciente: "",
        edadPaciente: "",
        sexo: "",
        empresa: "",
        contrata: "",
        cargoPaciente: "",
        ocupacionPaciente: "",
        //Izquierda
        apto: "APTO",

        fechaDesde: today,
        fechahasta: nextYearDate,
        conclusiones: "",

        //Cuadrito feo
        visionCercaSincorregirOd_v_cerca_s_od: "",
        visionLejosSincorregirOd_v_lejos_s_od: "",
        visionCercaSincorregirOi_v_cerca_s_oi: "",
        visionLejosSincorregirOi_v_lejos_s_oi: "",

        oftalodccmologia_odcc: "",
        oiccoftalmologia_oicc: "",
        odlcOftalmologia_odlc: "",
        oilcOftalmologia_oilc: "",
        vcOftalmologia_vc: "",
        vbOftalmologia_vb: "",
        rpOftalmologia_rp: "",

        enfermedadesOcularesOftalmologia_e_oculares: "",
        hemoglobina_txthemoglobina: "",
        vsgLabClinico_txtvsg: "",
        glucosaLabClinico_txtglucosabio: "",
        leucocitoSematologiaLabClinico: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    }

    const { form, setForm, handleChangeNumber,handleChange, handleRadioButton, handleClearnotO, handleClear, handlePrintDefault } = useForm(InitialForm, { storageKey: "Certificado_Medico_Ocupacional_form" })

    const handleClearnotOandEspecialidad = () => {
        setForm((prev) => ({ ...InitialForm, norden: prev.norden, fechaDesde: today, fechahasta: today }));
        if (typeof window !== "undefined" && "Certificado_Medico_Ocupacional_form") {
            try {
                localStorage.setItem("Certificado_Medico_Ocupacional_form", JSON.stringify({ ...InitialForm, norden: form.norden, fechaDesde: today, fechahasta: today }));
            } catch (err) {
                console.warn("useForm: error guardando localStorage en clearnotO", err);
            }
        }
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotOandEspecialidad();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
        console.log("Guardando datos:", form);
    };

    const handleRadioButton2 = (e) => {
        const { name, value } = e.target;

        // value ya trae el texto del Check seleccionado (por ejemplo valores.Check1)
        const textoFinal = generarConclusiones(form, Valores, value);

        setForm((prev) => ({
            ...prev,
            [name]: textoFinal,
        }));

    };

    /*function generarConclusiones(form, valores, textoSeleccionado) {
        let conclusiones = "";

        // ==============================
        // 🔹 1. TRIAJE
        // ==============================
        const { pesoTriaje, tallaTriaje } = form;

        if (pesoTriaje && tallaTriaje) {
            conclusiones += `- TRIAJE ( PESO: ${pesoTriaje} KG ; TALLA: ${tallaTriaje} CM )\n`;
        }

        // ==============================
        // 🔹 2. LABORATORIO
        // ==============================
        const {
            leucocitoSematologiaLabClinico,
            hemoglobina_txthemoglobina,
            hematocritoLabClinico_txthematocrito,
            grupoFactor,
            glucosaLabClinico_txtglucosabio,
            creatininaLabClinico_txtcreatininabio,
            densidadLabClinico_txtdensidadef,
            bacteriaLabClinico_txtbacteriassu,
            vsgLabClinico_txtvsg,
            cocainaLabClinico_txtcocaina,
            marihuanaLabClinico_txtmarihuana,
        } = form;

        const labItems = [];

        if (leucocitoSematologiaLabClinico) labItems.push("HMA");
        if (hemoglobina_txthemoglobina) labItems.push("HB");
        if (hematocritoLabClinico_txthematocrito) labItems.push("HTO");
        if (grupoFactor) labItems.push(`GRUPO SANGUÍNEO Y FACTOR (${grupoFactor})`);
        if (glucosaLabClinico_txtglucosabio && glucosaLabClinico_txtglucosabio !== "N/A") labItems.push("GLUCOSA");
        if (creatininaLabClinico_txtcreatininabio && creatininaLabClinico_txtcreatininabio !== "N/A") labItems.push("CREATININA");
        if (densidadLabClinico_txtdensidadef) labItems.push("EX. ORINA");
        if (bacteriaLabClinico_txtbacteriassu && bacteriaLabClinico_txtbacteriassu !== "NO SE OBSERVAN") labItems.push("BRAM s/c");
        if (vsgLabClinico_txtvsg) labItems.push("VSG");
        if (cocainaLabClinico_txtcocaina && cocainaLabClinico_txtcocaina !== "N/A") labItems.push("TEST COCAÍNA");
        if (marihuanaLabClinico_txtmarihuana && marihuanaLabClinico_txtmarihuana !== "N/A") labItems.push("MARIHUANA");

        if (labItems.length > 0) {
            conclusiones += `- LABORATORIO: ${labItems.join(", ")}\n`;
        }

        // ==============================
        // 🔹 3. BLOQUE FINAL (SEGÚN CHECKBOX)
        // ==============================
         // --- Concatenar con el texto del Check seleccionado ---
        conclusiones += textoSeleccionado || "";

        return conclusiones.trim();
        }*/

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
        <div className="mx-auto bg-white overflow-hidden">
            {/* Header */}
            <h1 className="text-blue-600 font-semibold p-4 pb-0 mb-0 m-4">Aptitud</h1>
            <div className="flex h-full">
                {/* Contenido principal - 80% */}
                <div className="w-4/5">
                    <div className="w-full">
                        {/* Datos del trabajador */}
                        <section className="bg-white border border-gray-200 rounded-lg p-4  mt-0 m-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                labelWidth="60px"
                                value={form?.norden}
                                onChange={handleChangeNumber}
                                onKeyUp={handleSearch}
                            />
                            <InputTextOneLine
                                label="Tipo de Examen"
                                name="nombreExamen"
                                value={form?.nombreExamen}
                                labelWidth="100px"
                                onChange={handleChange}
                            />
                            <div className="flex justify-end mt-3">
                                <h1 className="text-lg font-bold">{useRealTime()}</h1>
                            </div>

                        </section>

                        <h1 className="text-blue-600 font-semibold p-4 pb-0 mb-0 m-4">Certifica que el Sr.</h1>
                        <section className="bg-white border border-gray-200 rounded-lg p-4 mt-0 m-4">
                            {/* Fila 1: Datos personales */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <InputTextOneLine
                                    label="Nombres y Apellidos"
                                    name="nombres"
                                    disabled
                                    value={form?.nombres}
                                    onChange={handleChange}
                                />
                                <InputTextOneLine
                                    label="DNI"
                                    disabled
                                    labelWidth="50px"
                                    name="dniPaciente"
                                    value={form?.dniPaciente}
                                    onChange={handleChange}
                                />
                                <InputTextOneLine
                                    label="Edad"
                                    disabled
                                    labelWidth="50px"
                                    name="edadPaciente"
                                    value={form?.edadPaciente}
                                    onChange={handleChange}
                                />
                                <InputTextOneLine
                                    label="Género"
                                    disabled
                                    labelWidth="60px"
                                    name="sexo"
                                    value={form?.sexo}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Fila 2: Empresa y Contratista */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <InputTextOneLine
                                    label="Empresa"
                                    name="empresa"
                                    disabled
                                    value={form?.empresa}
                                    onChange={handleChange}
                                />
                                <InputTextOneLine
                                    label="Contratista"
                                    disabled
                                    name="contratista"
                                    value={form?.contrata}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Fila 3: Puesto y Ocupación */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <InputTextOneLine
                                    label="Puesto al que Postula"
                                    name="cargoPaciente"
                                    disabled
                                    value={form?.cargoPaciente}
                                    onChange={handleChange}
                                />
                                <InputTextOneLine
                                    label="Ocupación Actual o Última Ocupación"
                                    name="ocupacionPaciente"
                                    disabled
                                    value={form?.ocupacionPaciente}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>
                        <div className="flex w-full">
                            <div className="w-1/2">
                                <section className="bg-white border border-gray-200 rounded-lg p-4 gap-4 mt-0 m-4">
                                    <InputsRadioGroup
                                        vertical
                                        name="apto" value={form?.apto} className="py-2"
                                        onChange={handleRadioButton} options={[
                                            { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                            { label: "APTO con RESTRICCION (para el puesto en el que trabaja o postula)", value: "APTOCONRESTRICCION" },
                                            { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" }
                                        ]}
                                    />

                                    <div className="w-full flex justify-between items-center pt-4 pb-2 px-2">
                                        <InputTextOneLine
                                            label="Fecha"
                                            name="fechaDesde"
                                            type="date"
                                            value={form?.fechaDesde}
                                            labelWidth="50px"
                                            onChange={handleChange}
                                        />
                                        <InputTextOneLine
                                            label="Fecha Venc"
                                            name="fechahasta"
                                            type="date"
                                            value={form?.fechahasta}
                                            labelWidth="65px"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </section>
                                <section className="bg-white rounded-lg p-4 pt-1 gap-4 mt-0 m-4">
                                    <InputsRadioGroup
                                    name="conclusiones" value={form.conclusiones} className="py-2"
                                    onChange={handleRadioButton2} options={[
                                        { label: "1. MARSA - OPERATIVA, SUPERVISOR, AYUDANTE", value: "Check1" }
                                    ]}
                                    />
                                    <InputsRadioGroup
                                    name="conclusiones" value={form.conclusiones} className="py-2"
                                    onChange={handleRadioButton2} options={[
                                        { label: "2. MARSA - CONDUCTOR u OPERADOR MAQUINARIA", value: "Check2" }
                                    ]}
                                    />
                                    <div className="w-full grid grid-cols-2">
                                        <InputsRadioGroup
                                        name="conclusiones" value={form.conclusiones} className="py-2"
                                        onChange={handleRadioButton2} options={[{ label: "3. MARSA - RETIRO ", value: "Check3" }]}
                                        />
                                        <InputsRadioGroup
                                        name="conclusiones" value={form.conclusiones} className="py-2"
                                        onChange={handleRadioButton2} options={[{ label: "6. PROTOCOLO PODEROSA RETIRO", value: "Check6"}]}
                                        />
                                    </div>
                                    <div className="w-full grid grid-cols-2">
                                        <InputsRadioGroup
                                        name="conclusiones" value={form.conclusiones} className="py-2"
                                        onChange={handleRadioButton2} options={[{ label: "4. RETIRO BOROO", value: "Check4" }]}
                                        />
                                        <InputsRadioGroup
                                        name="conclusiones" value={form.conclusiones} className="py-2"
                                        onChange={handleRadioButton2} options={[{ label: "7. PROTOCOLO PODEROSA", value: "Check7" }]}
                                        />
                                    </div>
                                    <InputsRadioGroup
                                    name="conclusiones" value={form.conclusiones} className="py-2"
                                    onChange={handleRadioButton2} options={[{ label: "5. BOROO - PSICONSENSOMETRICO Y ALTURA   Perfil Lipidico. ", value: "Check5" }]}
                                    />
                                    <EmpleadoComboBox
                                        value={form.nombre_medico}
                                        form={form}
                                        onChange={handleChangeSimple}
                                    />
                                    <div className="w-full flex justify-between items-center gap-1 mt-4">
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClear}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faBroom} /> Limpiar
                                            </button>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <span className="font-bold italic text-base mb-1 mx-4">IMPRIMIR</span>
                                            <input
                                                name="norden"
                                                value={form.norden}
                                                onChange={handleChangeNumber}
                                                className="border rounded px-2 py-1 text-base w-24"
                                            />

                                            <button
                                                type="button"
                                                onClick={handlePrint}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faPrint} />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="w-1/2 h-auto">
                                <InputTextArea
                                    label="Examenes"
                                    value={form.conclusiones}
                                    onChange={handleChange}
                                    classNameLabel="text-blue-600"
                                    rows={20}
                                    name="conclusiones"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel lateral de Agudeza Visual - 20% */}
                <div className="w-1/5">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
                        <h4 className="font-bold text-lg text-gray-800 mb-3 text-center">Sin Corregir</h4>
                        {/* Sin Corregir */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2 text-center">Sin Corregir</h5>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="">
                                    <div className="font-semibold mb-2 text-center">O.D</div>
                                    <div className="space-y-3">
                                        <InputTextOneLine label="V.C." name="visionCercaSincorregirOd_v_cerca_s_od" value={form?.visionCercaSincorregirOd_v_cerca_s_od} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="visionLejosSincorregirOd_v_lejos_s_od" value={form?.visionLejosSincorregirOd_v_lejos_s_od} disabled labelWidth="35px" />
                                    </div>
                                </div>
                                <div className="">
                                    <div className="font-semibold mb-2 text-center">O.I</div>
                                    <div className="space-y-3">
                                        <InputTextOneLine label="V.C." name="visionCercaSincorregirOi_v_cerca_s_oi" value={form?.visionCercaSincorregirOi_v_cerca_s_oi} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="visionLejosSincorregirOi_v_lejos_s_oi" value={form?.visionLejosSincorregirOi_v_lejos_s_oi} disabled labelWidth="35px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Corregida */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2 text-center">Corregida</h5>
                            {/* Fila OD y OI */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="font-semibold mb-2 text-center">O.D</div>
                                    <InputTextOneLine
                                        label="V.C."
                                        name="oftalodccmologia_odcc"
                                        value={form?.oftalodccmologia_odcc}
                                        disabled
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="V.L."
                                        name="odlcOftalmologia_odlc"
                                        value={form?.odlcOftalmologia_odlc}
                                        disabled
                                        labelWidth="35px"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="font-semibold mb-2 text-center">O.I</div>
                                    <InputTextOneLine
                                        label="V.C."
                                        name="oiccoftalmologia_oicc"
                                        value={form?.oiccoftalmologia_oicc}
                                        disabled
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="V.L."
                                        name="oilcOftalmologia_oilc"
                                        value={form?.oilcOftalmologia_oilc}
                                        disabled
                                        labelWidth="35px"
                                    />
                                </div>
                            </div>
                            {/* Fila extra (ancho completo) */}
                            <div className="mt-4 space-y-3">
                                <InputTextOneLine
                                    label="V.Clrs"
                                    name="vcOftalmologia_vc"
                                    value={form?.vcOftalmologia_vc}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                                <InputTextOneLine
                                    name="vbOftalmologia_vb"
                                    label="V.B."
                                    value={form?.vbOftalmologia_vb}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                                <InputTextOneLine
                                    label="R.P."
                                    name="rpOftalmologia_rp"
                                    value={form?.rpOftalmologia_rp}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                            </div>
                        </div>
                        {/* Enfermedades Oculares */}
                        <InputTextArea label="Enfermedades Oculares" rows={2} name="enfermedadesOcularesOftalmologia_e_oculares" value={form?.enfermedadesOcularesOftalmologia_e_oculares} onChange={handleChange} disabled />
                    </div>
                    <div className="bg-white  rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
                        <InputTextOneLine
                            label="Hemoglobina"
                            name="hemoglobina_txthemoglobina"
                            value={form?.hemoglobina_txthemoglobina}
                            disabled
                            labelWidth="80px"
                        />
                        <InputTextOneLine
                            label="V.S.G"
                            name="vsgLabClinico_txtvsg"
                            value={form?.vsgLabClinico_txtvsg}
                            disabled
                            labelWidth="80px"
                        />
                        <InputTextOneLine
                            label="Glucosa"
                            name="glucosaLabClinico_txtglucosabio"
                            value={form?.glucosaLabClinico_txtglucosabio}
                            disabled
                            labelWidth="80px"
                        />
                        <InputTextOneLine
                            label="Creatina"
                            name="leucocitoSematologiaLabClinico"
                            value={form?.leucocitoSematologiaLabClinico}
                            disabled
                            labelWidth="80px"
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}
