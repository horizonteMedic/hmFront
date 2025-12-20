import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import {
    PrintHojaR,
    SubmitDataService,
    VerifyTR,
} from "./controllerSintomaticoRespiratorio";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "";

const textoFinalConsentimiento = `Por lo tanto, en forma consciente y voluntaria, declaro que no presento cefalea, dolor de garganta, tos, fiebre, malestar general ni dificultad para respirar.`;

export default function SintomaticoRespiratorio() {
    const today = getToday();
    const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

    const initialFormState = {
        norden: "",
        fecha: today,
        nombres: "",
        dni: "",
        empresa: "",
        ocupacion: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeSimple,
        handleChangeNumberDecimals,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "sintomaticoRespiratorio" });

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumberDecimals}
                />
                <InputTextOneLine
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                />
                <InputTextOneLine
                    label="Hora"
                    name="hora"
                    value={hora}
                    disabled
                />
            </SectionFieldset>

            {/* Contenido del Consentimiento */}
            <SectionFieldset legend="Consentimiento Sintomático Respiratorio" className="space-y-3">
                {/* Información Personal */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Yo"
                        name="nombres"
                        value={form.nombres}
                        onChange={handleChange}
                        disabled
                        labelWidth="30px"
                    />
                    <InputTextOneLine
                        label="Identificado con DNI"
                        name="dni"
                        value={form.dni}
                        disabled
                        labelWidth="140px"
                    />
                    <InputTextOneLine
                        label="Con ocupación laboral de"
                        name="ocupacion"
                        value={form.ocupacion}
                        onChange={handleChange}
                        disabled
                        labelWidth="140px"
                    />
                </div>

                {/* Texto del Consentimiento */}
                <div className="space-y-4">
                    <div className="text-justify leading-relaxed">
                        <div className="mb-3">
                            <InputTextOneLine
                                label="Para la Empresa"
                                name="empresa"
                                value={form.empresa}
                                disabled
                                labelWidth="140px"
                            />
                        </div>
                        <p className="text-justify">
                            {textoFinalConsentimiento}
                        </p>
                    </div>
                </div>
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
