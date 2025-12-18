import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import {
    PrintHojaR,
    SubmitDataService,
    VerifyTR,
} from "./controllerConsentimientoBuenaSalud";
import { getToday } from "../../../../../utils/helpers";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "consentimientobuenasalud";

export default function ConsentimientoBuenaSalud() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, hora } = useSessionData();
    const initialFormState = {
        norden: "",
        fecha: today,
        nombres: "",
        edad: "",
        dni: "",
        textoFinalConsentimiento: `NO PADEZCO DE ENFERMEDAD ALGUNA, NI PRESENTO SÍNTOMAS DE NINGÚN TIPO, por lo cual me considero un persona completamente SANA.`,
    };

    const {
        form,
        setForm,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "consentimientoBuenaSalud" });

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
            <SectionFieldset legend="Consentimiento de Buena Salud" className="space-y-3">
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
                </div>

                {/* Texto del Consentimiento */}
                <div className="space-y-4">
                    <div className="text-justify leading-relaxed">
                        <p className="mb-3">
                            {form.textoFinalConsentimiento}
                        </p>
                        <p className="text-justify leading-relaxed mt-3">
                            Por lo que soy responsable de lo anteriormente declarado.
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
