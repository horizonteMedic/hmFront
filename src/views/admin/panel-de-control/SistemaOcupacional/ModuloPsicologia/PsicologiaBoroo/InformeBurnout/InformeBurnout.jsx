import {
    InputTextOneLine,
    InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformeBurnout";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "informe_burnout";

export default function InformeBurnout() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        norden: '',
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

        // Síndrome de Burnout
        sindromeBurnout: "",
        agotamientoEmocional: "",
        despersonalizacion: "",
        realizacionPersonal: "",

        // Textos libres
        resultados: "",
        conclusiones: "",
        recomendaciones: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleChangeSimple,
        handleChangeNumberDecimals,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "informeBurnoutPsicologia" });

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
        <div className="space-y-3 px-4 max-w-[90%]  xl:max-w-[80%] mx-auto">
            {/* Header con información del examen */}
            <div className="w-full space-y-3">
                <SectionFieldset legend="Información del Examen">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <InputTextOneLine
                            label="N° Orden"
                            name="norden"
                            value={form.norden}
                            onKeyUp={handleSearch}
                            onChange={handleChangeNumber}
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
                            label="Nombre de Examen"
                            name="nombreExamen"
                            value={form.nombreExamen}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                </SectionFieldset>

                <DatosPersonalesLaborales form={form} />
            </div>

            <SectionFieldset legend="Criterios Psicológicos">
                <div className="space-y-4">
                    <InputTextOneLine
                        label="Síndrome de Burnout"
                        name="sindromeBurnout"
                        value={form?.sindromeBurnout}
                        onChange={handleChange}
                        labelWidth="170px"
                    />
                    <div className="pt-2">
                        <h5 className="font-bold  mb-3">III. Sub Escalas</h5>
                        <div className="grid grid-cols-1 gap-3 ml-4">
                            <InputTextOneLine
                                label="-Agotamiento Emocional"
                                name="agotamientoEmocional"
                                value={form?.agotamientoEmocional}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                            <InputTextOneLine
                                label="-Despersonalización"
                                name="despersonalizacion"
                                value={form?.despersonalizacion}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                            <InputTextOneLine
                                label="-Realización Personal"
                                name="realizacionPersonal"
                                value={form?.realizacionPersonal}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                        </div>
                    </div>
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Conclusiones Finales" className="space-y-3">
                <InputTextArea
                    label="Resultados"
                    name="resultados"
                    value={form?.resultados}
                    onChange={handleChange}
                    rows={4}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputTextArea
                        label="Conclusiones"
                        name="conclusiones"
                        value={form?.conclusiones}
                        onChange={handleChange}
                        rows={4}
                    />
                    <InputTextArea
                        label="Recomendaciones"
                        name="recomendaciones"
                        value={form?.recomendaciones}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico">
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