import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup
} from "../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
import MedicoSearch from "../../../../components/reusableComponents/MedicoSearch";
import Mallampati from "../../../../../../public/img/Mallampati.jpg"
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaSas";

const tabla = "ficha_sas"
const today = getToday();

export default function FichaSas({ listas }) {
    const { MedicosMulti } = listas
    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        codigoSas: null,
        fechaExam: today,
        tipoExamen: "",
        tipoLicencia: "",
        //datos personales
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        empresa: "",
        contrata: "",
        puestoPostula: "",
        puestoActual: "",
        //trabaja noche
        trabajoNoche: false,
        diasTrabajoNoche: "",
        diasDescansoNoche: "",
        anosTrabajoNoche: "",
        // Antecedentes personales
        apneaDelSueno: false,
        ultimoControl: "",
        hta: false,
        medicacionRiesgo: "",
        polisomnografiaRealizada: false,
        fechaUltimaPolisomnografia: "",
        accidenteEnLaMina: false,
        accidenteFueraDeLaMina: false,

        // Antecedentes de choques
        criterio1_cabeceo: false, //1
        accidente_nocturno: false, //2
        ausencia_evidencia_maniobra: false, //3
        choque_vehiculo_contra_otro: false, //4
        vehiculo_invadio_carril: false, //5
        conductor_no_recuerda: false, //6
        tratamiento_medicinas_somnolencia: false, //7
        conductor_encontraba_horas_extra: false, //8
        accidente_confirmado_somnolencia: false, //9
        accidente_alta_sospecha_somnolencia: false, //10
        accidente_escasa_evidencia_somnolencia: false, //11
        no_datos_suficientes: false, //12
        accidente_no_debido_somnolencia: false, //13

        // Antecedentes familiares de apnea del sueño
        antec_familiar_apnea: false,
        indique_familiar_apnea: "",

        // Entrevista al paciente
        ronca_al_dormir: false,
        ruidos_respirar_durmiendo: false,
        deja_respirar_durmiendo: false,
        mas_sueno_cansancio: false,

        // Examen Físico
        peso_kg: "",
        talla_mts: "",
        imc_kg_m2: "",
        circunferencia_cuello: "",
        cuello_varon_normal: true, // true para SI, false para NO
        cuello_mujer_normal: true, // true para SI, false para NO
        presion_sistolica: "",
        presion_diastolica: "",
        hta_nueva: true, // true para SI, false para NO

        // Evaluación de vía aérea superior MALLAMPATI
        mallampati_grado: "1", // "1", "2", "3", "4"

        // Conclusión de la Evaluación
        // Requiere PSG antes de certificar aptitud para conducir
        requiere_psg: false,
        criterio_a: false,
        criterio_b: false,

        // Apto por 3 meses a renovar luego de PSG
        apto_3_meses: false,
        criterio_c: false,
        criterio_d: false,
        criterio_d_imc: false,
        criterio_d_hta: false,
        criterio_d_cuello: false,
        criterio_d_epworth: false,
        criterio_d_trastorno: false,
        criterio_d_ahi: false,
        criterio_e: false,

        // Apto con bajo riesgo de Apnea del sueño
        apto_bajo_riesgo: false,

        observaciones: "",

        // Médico que Certifica
        dniUsuario: userCompleto?.datos?.dni_user,
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleChangeSimple,
        handleCheckBoxChange,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "ficha_sas_form" });


    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
        console.log("Guardando datos:", form);
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

    return (
        <div className="space-y-6 max-w-[95%] mx-auto">
            {/* Header */}
            <section className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form?.norden}
                    onChange={handleChangeNumber}
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="Fecha Examen"
                    type="date"
                    name="fechaExam"
                    value={form?.fechaExam}
                    onChange={handleChangeSimple}
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="tipoExamen"
                    value={form?.tipoExamen}
                    disabled
                />
                <InputTextOneLine
                    label="Tipo Licencia"
                    name="tipoLicencia"
                    value={form?.tipoLicencia}
                    onChange={handleChangeSimple}
                />
            </section>
            {/* FILIACIÓN */}
            <section className="space-y-6">
                {/* Datos del trabajador */}
                <section className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Datos del Paciente</h3>
                    {/* Fila 1: Nombres, DNI, Edad, Género */}
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-3">
                        <InputTextOneLine
                            label="Nombres y Apellidos"
                            name="nombres"
                            value={form?.nombres}
                            disabled
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <InputTextOneLine
                                label="DNI"
                                name="dni"
                                value={form?.dni}
                                disabled
                            />
                            <InputTextOneLine
                                label="Edad"
                                name="edad"
                                value={form?.edad}
                                disabled
                            />
                            <InputTextOneLine
                                label="Sexo"
                                name="sexo"
                                value={form?.sexo}
                                disabled
                            />
                        </div>
                        <InputTextOneLine
                            label="Empresa"
                            name="empresa"
                            value={form?.empresa}
                            disabled
                        />
                        <InputTextOneLine
                            label="Contrata"
                            name="contrata"
                            value={form?.contrata}
                            disabled
                        />
                        <InputTextOneLine
                            label="Area de Trabajo"
                            name="puestoPostula"
                            value={form?.puestoPostula}
                            disabled
                        />
                        <InputTextOneLine
                            label="Puesto de Trabajo"
                            name="puestoActual"
                            value={form?.puestoActual}
                            disabled
                        />
                    </div>
                </section>
                {/* Trabajo de Noche & Antecedentes Personales */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Trabajo de noche */}
                    <section className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-12">
                            <h3 className="text-lg font-semibold mb-3 min-w-[128px]">Trabajo de Noche</h3>
                            <InputsBooleanRadioGroup
                                name="trabajoNoche"
                                value={form?.trabajoNoche}
                                onChange={(e, value) => {
                                    if (!e.value) {
                                        setForm({ ...form, diasTrabajoNoche: "", diasDescansoNoche: "", anosTrabajoNoche: "" })
                                    };
                                    handleRadioButtonBoolean(e, value)
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <InputTextOneLine
                                label="N° días trabajo"
                                name="diasTrabajoNoche"
                                value={form?.diasTrabajoNoche}
                                onChange={handleChangeNumber}
                                disabled={!form?.trabajoNoche}
                                labelWidth="140px"
                            />
                            <InputTextOneLine
                                label="N° días descanso"
                                name="diasDescansoNoche"
                                value={form?.diasDescansoNoche}
                                onChange={handleChangeNumber}
                                disabled={!form?.trabajoNoche}
                                labelWidth="140px"
                            />
                            <InputTextOneLine
                                label="Años de trabajo en dicho horario de trabajo"
                                name="anosTrabajoNoche"
                                value={form?.anosTrabajoNoche}
                                onChange={handleChangeNumber}
                                disabled={!form?.trabajoNoche}
                                labelWidth="140px"
                            />
                        </div>
                    </section>
                    {/* Antecedentes personales */}
                    <section className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Antecedentes Personales</h3>
                        <div className="grid gap-3">
                            <div className="flex w-full gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[100px]">Ápnea del sueño:</span>
                                    <InputsBooleanRadioGroup
                                        name="apneaDelSueno"
                                        value={form?.apneaDelSueno}
                                        onChange={(e, value) => {
                                            if (!value) {
                                                setForm({ ...form, ultimoControl: "" })
                                            };
                                            handleRadioButtonBoolean(e, value)
                                        }}
                                    />
                                </div>
                                <InputTextOneLine
                                    label="Último control"
                                    name="ultimoControl"
                                    value={form?.ultimoControl}
                                    disabled={!form?.apneaDelSueno}
                                    onChange={handleChange}
                                    className="w-full"
                                    labelWidth="90px"
                                />
                            </div>
                            <div className="flex w-full gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[100px]">HTA:</span>
                                    <InputsBooleanRadioGroup
                                        name="hta"
                                        value={form?.hta}
                                        onChange={(e, value) => {
                                            if (!value) {
                                                setForm({ ...form, medicacionRiesgo: "" })
                                            };
                                            handleRadioButtonBoolean(e, value)
                                        }}
                                    />
                                </div>
                                <InputTextOneLine
                                    label="Medicación (riesgo >2)"
                                    name="medicacionRiesgo"
                                    value={form?.medicacionRiesgo}
                                    disabled={!form?.hta}
                                    onChange={handleChange}
                                    className="w-full"
                                    labelWidth="90px"
                                />
                            </div>
                            <div className="flex w-full gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[100px]">Polisomnografía realizada:</span>
                                    <InputsBooleanRadioGroup
                                        name="polisomnografiaRealizada"
                                        value={form?.polisomnografiaRealizada}
                                        onChange={(e, value) => {
                                            setForm((prev) => ({ ...prev, fechaUltimaPolisomnografia: !value ? "" : today }))
                                            handleRadioButtonBoolean(e, value)
                                        }}
                                    />
                                </div>
                                <InputTextOneLine
                                    label="Fecha última polisomnografía"
                                    name="fechaUltimaPolisomnografia"
                                    value={form?.fechaUltimaPolisomnografia}
                                    disabled={!form?.polisomnografiaRealizada}
                                    type="date"
                                    onChange={handleChangeSimple}
                                    className="w-full"
                                    labelWidth="90px"
                                />
                            </div>
                            <span className="font-bold">Antecedentes de choque de vehículo</span>
                            <div className="flex w-full gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[100px] max-w-[100px]">Accidente en la mina:</span>
                                    <InputsBooleanRadioGroup
                                        name="accidenteEnLaMina"
                                        value={form?.accidenteEnLaMina}
                                        onChange={handleRadioButtonBoolean}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold min-w-[90px] max-w-[90px]">Accidente fuera de la mina:</span>
                                    <InputsBooleanRadioGroup
                                        name="accidenteFueraDeLaMina"
                                        value={form?.accidenteFueraDeLaMina}
                                        onChange={handleRadioButtonBoolean}
                                    />
                                </div>

                            </div>
                        </div>
                    </section>
                </section>
            </section>
            {/* EN CASO CHOQUE */}
            <section className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Antecedentes del (los) choques (incidentes o accidente)</h3>

                {/* Criterios principales */}
                <div className="">
                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Criterio 1:</span>
                            <span>Se "cabeceó" y por ello ocurrió un accidente (incidente) con un vehículo (alguna vez)</span>
                        </div>
                        <InputsBooleanRadioGroup
                            name="criterio1_cabeceo"
                            value={form?.criterio1_cabeceo}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Criterio 2:</span>
                            <span>2 o más es positivo</span>
                        </div>
                    </div>
                </div>

                {/* Lista de condiciones */}
                <div className="space-y-0 mb-6">
                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>Accidente ocurrido entre las últimas 5 horas de un turno nocturno o entre las 14 y 17 horas (tarde)</span>
                        <InputsBooleanRadioGroup
                            name="accidente_nocturno"
                            value={form?.accidente_nocturno}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>AUSENCIA DE evidencia de maniobra evasiva del chofer para evitar la colisión</span>
                        <InputsBooleanRadioGroup
                            name="ausencia_evidencia_maniobra"
                            value={form?.ausencia_evidencia_maniobra}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>Choque del vehículo contra otro, cayó a un precipicio, no al choque contra un</span>
                        <InputsBooleanRadioGroup
                            name="choque_vehiculo_contra_otro"
                            value={form?.choque_vehiculo_contra_otro}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>Vehículo que invadió el otro carril o se desvió sin causa aparente</span>
                        <InputsBooleanRadioGroup
                            name="vehiculo_invadio_carril"
                            value={form?.vehiculo_invadio_carril}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>El conductor no recuerda claramente lo ocurrido 10 segundos antes del impacto</span>
                        <InputsBooleanRadioGroup
                            name="conductor_no_recuerda"
                            value={form?.conductor_no_recuerda}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>Tratamiento con medicinas que causan somnolencia (benzodiazepinas, antihistamínicos, relajantes</span>
                        <InputsBooleanRadioGroup
                            name="tratamiento_medicinas_somnolencia"
                            value={form?.tratamiento_medicinas_somnolencia}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3">
                        <span>El conductor se encontraba en horas extra (excediendo sus horas habituales de trabajo) o realizando días adicionales de trabajo (sobretiempo)</span>
                        <InputsBooleanRadioGroup
                            name="conductor_encontraba_horas_extra"
                            value={form?.conductor_encontraba_horas_extra}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>
                </div>

                {/* Clasificación del accidente */}
                <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Clasificación del <span className="font-semibold">(los) "choques" o accidentes vehiculares del postulante</span> (marque solo una categoría)</h4>
                    <div className="space-y-0">
                        <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                            <span>Accidente confirmado por Somnolencia (Criterio 1 positivo)</span>
                            <InputsBooleanRadioGroup
                                name="accidente_confirmado_somnolencia"
                                value={form?.accidente_confirmado_somnolencia}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>

                        <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                            <span>Accidente con alta sospecha de somnolencia (Criterio 2 positivo)</span>
                            <InputsBooleanRadioGroup
                                name="accidente_alta_sospecha_somnolencia"
                                value={form?.accidente_alta_sospecha_somnolencia}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>

                        <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                            <span>Accidente con escasa evidencia / sospecha por somnolencia (solo 1 ítem de Criterio 2)</span>
                            <InputsBooleanRadioGroup
                                name="accidente_escasa_evidencia_somnolencia"
                                value={form?.accidente_escasa_evidencia_somnolencia}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>

                        <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                            <span>No se dispone de datos suficientes para clasificar el (los) incidentes</span>
                            <InputsBooleanRadioGroup
                                name="no_datos_suficientes"
                                value={form?.no_datos_suficientes}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>

                        <div className="flex w-full justify-between items-center py-3">
                            <span>Accidente no debido a somnolencia (información suficiente que descarta somnolencia)</span>
                            <InputsBooleanRadioGroup
                                name="accidente_no_debido_somnolencia"
                                value={form?.accidente_no_debido_somnolencia}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ANTECEDENTES FAMILIARES DE APNEA DEL SUEÑO */}
            <section className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-8">
                    <h3 className="text-lg font-semibold min-w-[250px] max-w-[250px]">3. ANTEC. FAMILIAR DE APNEA DEL SUEÑO:</h3>
                    <div className="flex items-center gap-4 w-full">
                        <InputsBooleanRadioGroup
                            name="antec_familiar_apnea"
                            value={form?.antec_familiar_apnea}
                            onChange={handleRadioButtonBoolean}
                            disabled
                        />
                        <InputTextOneLine
                            label="Indique"
                            name="indique_familiar_apnea"
                            value={form?.indique_familiar_apnea}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                </div>
            </section>

            {/* ENTREVISTA AL PACIENTE */}
            <section className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">4. ENTREVISTA AL PACIENTE:</h3>
                </div>

                <div className="space-y-0">
                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>En los últimos 5 años, su pareja o esposa le ha comentado que ronca al dormir</span>
                        <InputsBooleanRadioGroup
                            name="ronca_al_dormir"
                            value={form?.ronca_al_dormir}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>En los últimos 5 años, su pareja o esposa le ah comentado que hace ruidos al respirar mientras duerme</span>
                        <InputsBooleanRadioGroup
                            name="ruidos_respirar_durmiendo"
                            value={form?.ruidos_respirar_durmiendo}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>En los últimos 5 años, su pareja o esposa le ah comentado que deja de respirar cuando duerme (pausa respiratoria)</span>
                        <InputsBooleanRadioGroup
                            name="deja_respirar_durmiendo"
                            value={form?.deja_respirar_durmiendo}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                        <span>Comparado con sus compañeros, usted siente que tiene más sueño o cansancio que ellos mientras trabaja</span>
                        <InputsBooleanRadioGroup
                            name="mas_sueno_cansancio"
                            value={form?.mas_sueno_cansancio}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    {/* PUNTUACIÓN DE LA ESCALA DE EPWORTH - Integrada en la misma sección */}
                    <div className="flex items-center justify-between py-4 mt-4 bg-gray-50 rounded">
                        <div>
                            <span className="font-semibold">PUNTUACIÓN DE LA ESCALA DE EPWORTH (ESS)</span>
                            <br />
                            <span className="text-sm">(NUNCA = 0, POCA = 1, MODERADA = 2, ALTA = 3)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Total puntos (sumatoria)</span>
                            <input
                                type="number"
                                className="border border-gray-300 px-3 py-2 rounded w-20 text-center"
                                value={
                                    (form?.ronca_al_dormir === true ? 1 : 0) +
                                    (form?.ruidos_respirar_durmiendo === true ? 1 : 0) +
                                    (form?.deja_respirar_durmiendo === true ? 1 : 0) +
                                    (form?.mas_sueno_cansancio === true ? 1 : 0)
                                }
                                disabled
                            />
                        </div>
                    </div>


                </div>
            </section>

            {/* EXAMEN FISICO */}
            <section className=" grid md:grid-cols-2 gap-8">
                <section className="bg-white border border-gray-200 rounded-lg p-4">
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">EXAMEN FÍSICO</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Primera fila */}
                            <InputTextOneLine
                                label="Peso (Kg)"
                                name="peso_kg"
                                value={form?.peso_kg}
                                disabled
                            />
                            <InputTextOneLine
                                label="Talla (mts)"
                                name="talla_mts"
                                value={form?.talla_mts}
                                disabled
                            />
                            <div className="flex items-center gap-2">
                                <InputTextOneLine
                                    label="IMC (Kg/m2)"
                                    name="imc_kg_m2"
                                    value={form?.imc_kg_m2}
                                    disabled
                                    className="flex-1"
                                />
                                <span className="text-red-600 text-sm whitespace-nowrap">(&gt; 35 es de alto riesgo)</span>
                            </div>
                            <InputTextOneLine
                                label="P. Sistólica"
                                name="presion_sistolica"
                                value={form?.presion_sistolica}
                                disabled
                            />
                            <InputTextOneLine
                                label="P. Diastólica"
                                name="presion_diastolica"
                                value={form?.presion_diastolica}
                                disabled
                            />
                            <div className="flex gap-4">
                                <span className="font-semibold min-w-[80px] max-w-[80px]">HTA nueva:</span>
                                <InputsBooleanRadioGroup
                                    name="hta_nueva"
                                    value={form?.hta_nueva}
                                    onChange={handleRadioButtonBoolean}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
                            {/* Circunferencia de cuello */}
                            <div className="space-y-4 border rounded p-4">
                                <InputTextOneLine
                                    label="Circunferencia de cuello"
                                    name="circunferencia_cuello"
                                    value={form?.circunferencia_cuello}
                                    disabled
                                />
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Varón (menor de 43.2 cm, es normal)</span>
                                        <div className="flex items-center gap-4">
                                            <span className="font-medium">Normal:</span>
                                            <InputsBooleanRadioGroup
                                                name="cuello_varon_normal"
                                                value={form?.cuello_varon_normal}
                                                onChange={handleRadioButtonBoolean}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Mujer (menor de 40.6 cm, es normal)</span>
                                        <div className="flex items-center gap-4">
                                            <span className="font-medium">Normal:</span>
                                            <InputsBooleanRadioGroup
                                                name="cuello_mujer_normal"
                                                value={form?.cuello_mujer_normal}
                                                onChange={handleRadioButtonBoolean}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Evaluación de vía aérea superior MALLAMPATI */}
                <section className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Evaluación de vía aérea superior MALLAMPATI (Seleccione)</h3>
                    </div>
                    {/* Imágenes de los grados Mallampati */}
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={Mallampati}
                            alt="Evaluación Mallampati - Grados I, II, III, IV"
                            className="w-[300px] md:w-[400px] xl:w-[550px]"
                        />
                        {/* Radio buttons alineados debajo de cada grado */}
                        <div className="grid grid-cols-4 w-[300px] md:w-[400px] xl:w-[550px] ">
                            <div className="flex justify-center">
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mallampati_grado"
                                        value="1"
                                        checked={form.mallampati_grado === '1'}
                                        onChange={(e) => handleRadioButton(e, '1')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Grado I</span>
                                </label>
                            </div>
                            <div className="flex justify-center">
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mallampati_grado"
                                        value="2"
                                        checked={form.mallampati_grado === '2'}
                                        onChange={(e) => handleRadioButton(e, '2')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Grado II</span>
                                </label>
                            </div>
                            <div className="flex justify-center">
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mallampati_grado"
                                        value="3"
                                        checked={form.mallampati_grado === '3'}
                                        onChange={(e) => handleRadioButton(e, '3')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Grado III</span>
                                </label>
                            </div>
                            <div className="flex justify-center">
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mallampati_grado"
                                        value="4"
                                        checked={form.mallampati_grado === '4'}
                                        onChange={(e) => handleRadioButton(e, '4')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Grado IV</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            {/* CONCLUSION DE EVALUACIÓN */}
            <section className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">6. CONCLUSIÓN DE LA EVALUACIÓN</h3>

                {/* Requiere PSG antes de certificar aptitud para conducir */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3 pl-3 pr-2 py-3 bg-gray-50 rounded">
                        <div className="flex-1">
                            <span className="font-semibold">Requiere PSG antes de certificar aptitud para conducir. (un criterio positivo)</span>
                        </div>
                        <InputsBooleanRadioGroup
                            name="requiere_psg"
                            value={form?.requiere_psg}
                            onChange={(e, value) => {
                                setForm(prev => ({
                                    ...prev,
                                    // Si es false, bloquear criterios A y B y ponerlos en false
                                    ...(value === false && {
                                        criterio_a: false,
                                        criterio_b: false
                                    })
                                }));
                                handleRadioButtonBoolean(e, value)
                            }}
                        />
                    </div>

                    {/* Criterio A */}
                    <div className="ml-6 mb-3">
                        <div className="flex justify-between items-center p-2 border-l-4 border-blue-300 bg-blue-50">
                            <div className="flex-1">
                                <span className="font-medium">Criterio A:</span>
                                <span className="ml-2">Excesiva somnolencia determinada por ESS mayor de 15 cabeceo presenciado durante la evaluación (espera, antecedente de accidente por somnolencia o con alta sospecha por somnolencia)</span>
                            </div>
                            <InputsBooleanRadioGroup
                                name="criterio_a"
                                value={form?.criterio_a}
                                onChange={handleRadioButtonBoolean}
                                disabled={!form?.requiere_psg}
                            />
                        </div>
                    </div>

                    {/* Criterio B */}
                    <div className="ml-6 mb-4">
                        <div className="flex justify-between items-center p-2 border-l-4 border-blue-300 bg-blue-50">
                            <div className="flex-1">
                                <span className="font-medium">Criterio B:</span>
                                <span className="ml-2">Antecedentes de SAS sin control reciente o sin cumplimiento de tratamiento (con CPAP o cirugía)</span>
                            </div>
                            <InputsBooleanRadioGroup
                                name="criterio_b"
                                value={form?.criterio_b}
                                onChange={handleRadioButtonBoolean}
                                disabled={!form?.requiere_psg}
                            />
                        </div>
                    </div>
                </div>

                {/* Apto por 3 meses a renovar luego de PSG */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3 pl-3 pr-2 py-3 bg-gray-50 rounded">
                        <div className="flex-1">
                            <span className="font-semibold">Apto por 3 meses a renovar luego de PSG (un criterio positivo)</span>
                        </div>
                        <InputsBooleanRadioGroup
                            name="apto_3_meses"
                            value={form?.apto_3_meses}
                            onChange={(e, value) => {
                                setForm(prev => ({
                                    ...prev,
                                    // Si es false, bloquear criterios C, D y E y ponerlos en false
                                    ...(value === false && {
                                        criterio_c: false,
                                        criterio_d: false,
                                        criterio_d_imc: false,
                                        criterio_d_hta: false,
                                        criterio_d_cuello: false,
                                        criterio_d_epworth: false,
                                        criterio_d_trastorno: false,
                                        criterio_d_ahi: false,
                                        criterio_e: false
                                    })
                                }));
                                handleRadioButtonBoolean(e, value)
                            }}
                        />
                    </div>
                    {/* Criterio C */}
                    <div className="ml-6 mb-3">
                        <div className="flex justify-between items-center p-2 border-l-4 border-green-300 bg-green-50">
                            <div className="flex-1">
                                <span className="font-medium">Criterio C:</span>
                                <span className="ml-2">Historia de higiene de sueño sugiere SAS (presencia de ronquidos, somnolencia excesiva durante la actividad, pausas respiratorias)</span>
                            </div>
                            <InputsBooleanRadioGroup
                                name="criterio_c"
                                value={form?.criterio_c}
                                onChange={handleRadioButtonBoolean}
                                disabled={!form?.apto_3_meses}
                            />
                        </div>
                    </div>
                    {/* Criterio D */}
                    <div className="ml-6 mb-3">
                        <div className="flex justify-between items-start p-2 border-l-4 border-green-300 bg-green-50">
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div>
                                        <span className="font-medium">Criterio D:</span>
                                        <span className="ml-2">Cumple con 2 o más de los siguientes:</span>
                                    </div>
                                    <InputsBooleanRadioGroup
                                        name="criterio_d"
                                        value={form?.criterio_d}

                                        onChange={(e, value) => {
                                            setForm(prev => ({
                                                ...prev,
                                                // Si es false, bloquear criterios C, D y E y ponerlos en false
                                                ...(value === false && {
                                                    criterio_d_imc: false,
                                                    criterio_d_hta: false,
                                                    criterio_d_cuello: false,
                                                    criterio_d_epworth: false,
                                                    criterio_d_trastorno: false,
                                                    criterio_d_ahi: false,
                                                })
                                            }));
                                            handleRadioButtonBoolean(e, value)
                                        }}
                                        disabled={!form?.apto_3_meses}
                                    />
                                </div>
                                <div className="ml-6 mt-2 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="">IMC mayor o igual a 30</span>
                                        <InputsBooleanRadioGroup
                                            name="criterio_d_imc"
                                            value={form?.criterio_d_imc}
                                            onChange={handleRadioButtonBoolean}
                                            disabled={!form?.criterio_d}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="">Hipertensión Arterial (nueva, no controlada con una sola medicación)</span>
                                        <InputsBooleanRadioGroup
                                            name="criterio_d_hta"
                                            value={form?.criterio_d_hta}
                                            onChange={handleRadioButtonBoolean}
                                            disabled={!form?.criterio_d}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="">Circunferencia del cuello anormal</span>
                                        <InputsBooleanRadioGroup
                                            name="criterio_d_cuello"
                                            value={form?.criterio_d_cuello}
                                            onChange={handleRadioButtonBoolean}
                                            disabled={!form?.criterio_d}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="">Puntuación de Epworth mayor de 10 y menor de 16</span>
                                        <InputsBooleanRadioGroup
                                            name="criterio_d_epworth"
                                            value={form?.criterio_d_epworth}
                                            onChange={handleRadioButtonBoolean}
                                            disabled={!form?.criterio_d}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="">Antecedentes de trastorno del sueño (diagnosticado) sin seguimiento</span>
                                        <InputsBooleanRadioGroup
                                            name="criterio_d_trastorno"
                                            value={form?.criterio_d_trastorno}
                                            onChange={handleRadioButtonBoolean}
                                            disabled={!form?.criterio_d}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="">Índice de apnea-hipopnea (AHI) mayor de 5 y menor de 30</span>
                                        <InputsBooleanRadioGroup
                                            name="criterio_d_ahi"
                                            value={form?.criterio_d_ahi}
                                            onChange={handleRadioButtonBoolean}
                                            disabled={!form?.criterio_d}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Criterio E */}
                    <div className="ml-6 mb-4">
                        <div className="flex justify-between items-center p-2 border-l-4 border-green-300 bg-green-50">
                            <div className="flex-1">
                                <span className="font-medium">Criterio E:</span>
                                <span className="ml-2">Evaluación de vía aérea superior patológica*</span>
                            </div>
                            <InputsBooleanRadioGroup
                                name="criterio_e"
                                value={form?.criterio_e}
                                onChange={handleRadioButtonBoolean}
                                disabled={!form?.apto_3_meses}
                            />
                        </div>
                    </div>
                </div>

                {/* Apto con bajo riesgo de Apnea del sueño */}
                <div className="mb-4">
                    <div className="flex justify-between items-center pl-3 pr-2 py-3 bg-gray-50 rounded">
                        <div className="flex-1">
                            <span className="font-semibold">Apto con bajo riesgo de Apnea del sueño (ningún criterio positivo)</span>
                        </div>
                        <InputsBooleanRadioGroup
                            name="apto_bajo_riesgo"
                            value={form?.apto_bajo_riesgo}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>
                </div>
            </section>


            {/* Médico y Botones */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <MedicoSearch
                        value={form.nombre_medico}
                        onChange={handleChangeSimple}
                        MedicosMulti={MedicosMulti}
                    />
                    <InputTextArea
                        label="Observaciones"
                        rows={6}
                        name="observaciones"
                        value={form?.observaciones}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4  px-4 pt-4">
                    <div className=" flex gap-4">
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
                    <div className="flex flex-col items-end">
                        <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                        <div className="flex items-center gap-2">
                            <input
                                name="norden"
                                value={form.norden}
                                onChange={handleChange}
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
                </div>
            </div>
        </div>
    );
}