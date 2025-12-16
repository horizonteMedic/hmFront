import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import {
    PrintHojaR,
    SubmitDataService,
    VerifyTR,
} from "./controllerConsentimientoInformado";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "consentimientoInformado";

const textoConsentimiento = `certifico que he sido informado/a acerca de la naturaleza y propósito del examen médico ocupacional así como pruebas complementarias determinada por la empresa:`;
const textoFinalConsentimiento = `De acuerdo a los peligros y riesgos identificados en mi puesto de trabajo. En ese sentido en forma consciente y voluntaria doy mi consentimiento, para que se me realice el examen médico ocupacional de acuerdo a la Resolución ministerial N° 312-2011/MINSA. Y doy fe que la información brindada a HORIZONTE MEDIC es verídica. Así mismo, autorizo a HORIZONTE MEDIC para que brinde mi historia clínica y toda información resultante de mi examen médico ocupacional al Médico Ocupacional de mi empresa para que tenga acceso a mi Historia Clínica de acuerdo a la N.T.N° 022 MINSA/dgsp-V.02 y Ley N° 26842, Ley general de salud.`;

export default function ConsentimientoInformado() {
    const today = getToday();
    const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

    const initialFormState = {
        norden: "",
        codCons: null,
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
    } = useForm(initialFormState, { storageKey: "consentimientoInformado" });


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
            <SectionFieldset legend="Consentimiento Informado Ocupacional" className="space-y-3">
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
                        <p className="mb-3">
                            {textoConsentimiento}
                        </p>

                        <div className="mb-3">
                            <InputTextOneLine
                                label="Empresa"
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
