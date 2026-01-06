import { InputsBooleanRadioGroup, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import {
    PrintHojaR,
    SubmitDataService,
    VerifyTR,
} from "./controllerConformidadEMO";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "registro_conformidad_emo";

const textoFinalConsentimiento = `Me ha entregado, informado y explicado de manera presencial por medios digitales los resultados del Examen Médico Ocupacional que se me ha realizado.\nAsí mismo me comprometo a cumplir con las indicaciones y recomendaciones recibidas por parte del médico ocupacional.`;
const textoFinalConsentimiento2 = `Doy conformidad de lo indicado mediante mi firma y/o huella digital.`;

export default function ConformidadEMO() {
    const today = getToday();
    const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

    const initialFormState = {
        norden: "",
        fecha: today,
        nombres: "",
        edad: "",
        dni: "",
        empresa: "",
        ocupacion: "",
    };

    const {
        form,
        setForm,
        handleChangeSimple,
        handleChangeNumberDecimals,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "conformidadEMO" });

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
            <SectionFieldset legend="Consentimiento Evaluación Médica" className="space-y-3">
                {/* Información Personal */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Yo"
                        name="nombres"
                        value={form.nombres}
                        disabled
                        labelWidth="30px"
                    />
                    <div className="flex items-center flex-wrap">
                        <InputTextOneLine
                            label="de"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="30px"
                            className="mr-4"
                        />
                        <label className="font-semibold min-w-[50px]">años de edad,</label>
                        <InputTextOneLine
                            label="identificado con DNI"
                            name="dni"
                            value={form.dni}
                            disabled
                            labelWidth="110px"
                        />
                    </div>
                    <InputTextOneLine
                        label="Con ocupación laboral de"
                        name="ocupacion"
                        value={form.ocupacion}
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
                        <p className="text-justify">
                            {textoFinalConsentimiento2}
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

