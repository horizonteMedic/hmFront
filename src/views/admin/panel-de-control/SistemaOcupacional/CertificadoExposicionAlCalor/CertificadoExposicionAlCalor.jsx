import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";

export default function CertificadoExposicionAlCalor() {

    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName, userCMP, hora } = useSessionData();

    const initialFormState = {
        norden: "",
        id: null,
        fechaExamen: today,
        nombreExamen: "",

        nombres: "",
        edad: "",
        sexo: "",
        dni: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",


        signosVitalesResultados: "",
        signosVitalesObservaciones: "",
        sistemaCardiovascularResultados: "",
        sistemaCardiovascularObservaciones: "",
        sistemaRespiratorioResultados: "",
        sistemaRespiratorioObservaciones: "",
        estadoNeurológicoResultados: "",
        estadoNeurológicoObservaciones: "",
        estadoHidratacionResultados: "",
        estadoHidratacionObservaciones: "",
        toleranciaCalorResultados: "",
        toleranciaCalorObservaciones: "",
        sudoracionResultados: "",
        sudoracionObservaciones: "",


        esApto: false,
        noEsApto: false,
        aptoRestriccion: false,

        observaciones: "",
        restricciones: "",

        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "certificado_exposicion_al_calor" });

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

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
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

                <InputTextOneLine
                    label="Hora"
                    name="hora"
                    value={hora}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Datos del especialista" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputTextOneLine
                    label="Médico evaluador"
                    name="nombre_medico"
                    value={form.nombre_medico}
                    disabled
                    labelWidth="120px"
                />

                <InputTextOneLine
                    label="CMP"
                    name="userCMP"
                    value={userCMP}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <SectionFieldset legend="Evaluación Clínica y Ocupacional" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputTextArea
                    label="Signos Vitales"
                    name="signosVitalesObservaciones"
                    value={form.signosVitalesObservaciones}
                    labelWidth="120px"
                />


            </SectionFieldset>

            <SectionFieldset legend="Evaluación Clínica y Ocupacional" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Derecho</div>
                    <div className="space-y-3">
                        <InputTextArea label="Signos Vitales" name="vcOD" value={form?.vcOD} disabled labelWidth="70px" />
                        <InputTextOneLine label="Visión Lejos" name="vlOD" value={form?.vlOD} disabled labelWidth="70px" />
                    </div>
                </div>
                <div>
                    <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Izquierdo</div>
                    <div className="space-y-3">
                        <InputTextOneLine label="Visión Cerca" name="vcOI" value={form?.vcOI} disabled labelWidth="70px" />
                        <InputTextOneLine label="Visión Lejos" name="vlOI" value={form?.vlOI} disabled labelWidth="70px" />
                    </div>
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Aptitud" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputsRadioGroup
                    name="aptitud"
                    value={form.aptitud}
                    disabled={!form.cerrado}
                    onChange={(e, value) => {
                        if (value == "APTO") {
                            setForm((prev) => ({
                                ...prev,
                                restricciones: "NINGUNO",
                            }));
                        }
                        handleRadioButton(e, value);
                    }}
                    vertical
                    options={[
                        {
                            label: "APTO (Puede realizar trabajos con exposición al calor.)",
                            value: "APTO",
                        },
                        {
                            label: "APTO CON RESTRICCION (Debe cumplir medidas preventivas específicas.)",
                            value: "RESTRICCION",
                        },
                        {
                            label: "NO APTO (No apto para trabajos con exposición al calor y vapor)",
                            value: "NO APTO",
                        },
                    ]}
                />
            </SectionFieldset>

            <SectionFieldset legend="Recomendaciones">
                <ul>
                    <li>Mantener adecuada hidratación antes, durante y después de la jornada laboral.</li>
                    <li>Realizar pausas activas y descansos programados.</li>
                    <li>Uso obligatorio de EPP adecuado.</li>
                    <li>Monitoreo periódico de signos de fatiga térmica.</li>
                    <li>Capacitación en prevención de estrés térmico.</li>
                </ul>
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico" className="w-full">
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