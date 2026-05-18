import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./ControllerEscalaLakeLouise";

const tabla = "escala_lake_louise"

export default function EscalaLakeLouise() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        norden: "",
        id: null,
        fecha: today,
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

        //todos son int
        cefalea: parseInt("0"),
        sintomasDigestivos: parseInt("0"),
        fatiga: parseInt("0"),
        vertigo: parseInt("0"),
        alteracionesSueno: parseInt("0"),
        alteracionesMentales: parseInt("0"),
        ataxia: parseInt("0"),
        edemasPerifericos: parseInt("0"),
        calificacion: "",

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
    } = useForm(initialFormState, { storageKey: "escala_lake_louise" });

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

    const RowCheck = ({ title, name, labels, className }) => {

        return (
            <>
                <div className={`col-span-2 ${className}`}>{title}</div>
                {labels.map((label, value) => (
                    <div key={value} className="text-center">
                        <input
                            type="radio"
                            name={name}
                            value={value}
                            checked={form[name] === value}
                            onChange={() => {
                                const newForm = {
                                    ...form,
                                    [name]: value,
                                };

                                let puntaje = 0;
                                questions.forEach((q) => {
                                    puntaje += Number(newForm[q.name] || 0);
                                });
                                newForm.calificacion = puntaje;
                                setForm(newForm);
                            }}
                        />
                        <div className="text-center">{label}</div>
                    </div>
                ))}
            </>
        )
    }

    const questions = [
        {
            title: "Cefalea",
            name: "cefalea",
            labels: ["Ausente", "Leve", "Moderada", "Grave"],
        },
        {
            title: "Síntomas Digestivos",
            name: "sintomasDigestivos",
            labels: ["Buen apetito", "Poco apetito o náuseas", "Náuseas moderadas o vómitos", "Náuseas o vómitos graves o incapacitantes"],
        },
        {
            title: "Fatiga y/o debilidad",
            name: "fatiga",
            labels: ["Ausentes", "Leve", "Moderada", "Grave o incapacitante"],
        },
        {
            title: "Vértigo/mareos",
            name: "vertigo",
            labels: ["Ausentes", "Leves", "Moderados", "Graves o incapacitantes"],
        },
        {
            title: "Alteraciones del sueño",
            name: "alteracionesSueno",
            labels: ["Duerme como habitualmente lo hace", "No duerme como habitualmente lo hace", "Se despierta muchas veces, sueño nocturno escaso", "No puede dormir"],
        },
        {
            title: "Alteraciones mentales",
            name: "alteracionesMentales",
            labels: ["Ausentes", "Letargo", "Desorientado/confuso", "Estupor/semiconciencia", "Coma"],
        },
        {
            title: "Ataxia (caminar sobre una línea haciendo coincidir taco con punta)",
            name: "ataxia",
            labels: ["Marcha normal", "Marcha tambaleante", "Pisadas fuera de línea", "Caídas al suelo", "Incapacidad para pararse"],
        },
        {
            title: "Edemas periféricos",
            name: "edemasPerifericos",
            labels: ["Ausentes", "En una extremidad", "En ≥ 2 extremidades"],
        },
    ]

    const sintomasQuestions = questions.slice(0, 5);
    const hallazgosQuestions = questions.slice(5);

    const puntaje = Number(form.calificacion || 0);

    let txtPuntaje = "";

    if (puntaje >= 0 && puntaje <= 3) {
        txtPuntaje = "MMA Leve";
    } else if (puntaje >= 4 && puntaje <= 6) {
        txtPuntaje = "MMA Moderado";
    } else if (puntaje >= 7) {
        txtPuntaje = "MMA Grave";
    }

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Situación">
                <div className="flex p-3 justify-center">
                    <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr,1fr] gap-2 items-center ">

                        <div className="col-span-2"></div>

                        {[0, 1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="text-center font-bold text-blue-800 bg-gray-100 py-2 rounded-t-lg"
                            >
                                {n}
                            </div>
                        ))}
                        {sintomasQuestions.map((question, index) => (
                            <RowCheck
                                className="font-bold"
                                key={question.name}
                                title={index + 1 + ".- " + question.title}
                                name={question.name}
                                labels={question.labels}
                            />
                        ))}
                    </div>

                </div>
            </SectionFieldset>

            <SectionFieldset legend="Hallazgos clínicos">
                <div className="flex p-3 justify-center">
                    <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr,1fr,1fr] gap-2 items-center ">

                        <div className="col-span-2"></div>

                        {[0, 1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className="text-center font-bold text-blue-800 bg-gray-100 p-2 rounded-t-lg"
                            >
                                {n}
                            </div>
                        ))}
                        {hallazgosQuestions.map((question, index) => (
                            <RowCheck
                                className="font-bold"
                                key={question.name}
                                title={index + 1 + ".- " + question.title}
                                name={question.name}
                                labels={question.labels}
                            />
                        ))}
                    </div>

                </div>
            </SectionFieldset>

            <SectionFieldset legend="Calificación">
                <div className="grid grid-cols-2 items-center gap-2 py-4">

                    <div className="text-xl text-gray-600">
                        <div>1 - 3 ptos. → MMA leve</div>
                        <div>4 - 6 ptos. → MMA moderado</div>
                        <div>≥ 7 ptos. → MMA grave</div>
                    </div>

                    <div>
                        <div className="text-4xl font-bold text-blue-700">
                            {form.calificacion}
                        </div>
                        <div className="text-xl font-semibold">
                            {txtPuntaje || "Sin clasificación"}
                        </div>
                    </div>

                </div>
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