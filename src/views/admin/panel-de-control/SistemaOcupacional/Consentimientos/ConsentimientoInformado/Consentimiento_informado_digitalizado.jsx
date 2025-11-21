import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faPrint, faSave, faSync } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import useRealTime from "../../../../../hooks/useRealTime";
import {
    PrintHojaR,
    SubmitDataService,
    VerifyTR,
} from "./controllerConsentimientoInformado";

const tabla = "consentimientoInformado";
const today = getToday();

const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

const initialFormState = {
    norden: "",
    codCons: null,
    fechaExam: today,
    fecha: today,
    nomExam: "",
    fechaNac: "",
    nombres: "",
    dni: "",
    empresa: "",
    contrata: "",
    ocupacion: "",
    nombreCompleto: "",
    documentoIdentidad: "",
    ocupacionLaboral: "",
    fechaConsentimiento: today,
    horaActual: getCurrentTime(),
    textoConsentimiento: `certifico que he sido informado/a acerca de la naturaleza y propósito del examen médico ocupacional así como pruebas complementarias determinada por la empresa:`,
    informacionAdicional: "",
    textoFinalConsentimiento: `De acuerdo a los peligros y riesgos identificados en mi puesto de trabajo. En ese sentido en forma consciente y voluntaria doy mi consentimiento, para que se me realice el examen médico ocupacional de acuerdo a la Resolución ministerial N° 312-2011/MINSA. Y doy fe que la información brindada a HORIZONTE MEDIC es verídica. Así mismo, autorizo a HORIZONTE MEDIC para que brinde mi historia clínica y toda información resultante de mi examen médico ocupacional al Médico Ocupacional de mi empresa para que tenga acceso a mi Historia Clínica de acuerdo a la N.T.N° 022 MINSA/dgsp-V.02 y Ley N° 26842, Ley general de salud.`,
};

export default function ConsentimientoInformadoOcupacional() {
    const { token, selectedSede, userlogued, datosFooter } = useSessionData();
    const hora = useRealTime();

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "consentimientoInformado" });

    useEffect(() => {
        setForm((prev) => ({ ...prev, horaActual: getCurrentTime() }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <div className="w-[90%] mx-auto text-[11px] mt-12">
            {/* Título principal */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Consentimiento Informado Ocupacional
                </h1>
                <p className="text-center text-gray-600 text-md">
                    Sistema de Gestión de Consentimientos - HORIZONTE MEDIC
                </p>
            </div>

            {/* Búsqueda */}
            <SectionFieldset legend="Información del Examen" className="mb-4">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden || ""}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    placeholder="Ingrese N° Orden"
                    labelWidth="120px"
                />
            </SectionFieldset>

            {/* Contenido del Consentimiento */}
            <SectionFieldset legend="Consentimiento Informado Ocupacional" className="space-y-4">
                {/* Información Personal */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="font-semibold min-w-[30px]">Yo:</label>
                        <InputTextOneLine
                            name="nombres"
                            value={form.nombres || ""}
                            onChange={handleChange}
                            disabled
                            placeholder="Nombre completo"
                            labelWidth="0px"
                            className="flex-1"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="font-semibold min-w-[280px]">
                            identificado con documento de identidad N°:
                        </label>
                        <InputTextOneLine
                            name="dni"
                            value={form.dni || ""}
                            onChange={handleChange}
                            disabled
                            placeholder="DNI"
                            labelWidth="0px"
                            className="w-48"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="font-semibold min-w-[180px]">Con ocupación laboral de:</label>
                        <InputTextOneLine
                            name="ocupacion"
                            value={form.ocupacion || ""}
                            onChange={handleChange}
                            disabled
                            placeholder="Ocupación laboral"
                            labelWidth="0px"
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Texto del Consentimiento */}
                <div className="space-y-4">
                    <div className="text-justify leading-relaxed">
                        <p className="mb-3">
                            {form.textoConsentimiento}
                        </p>
                        
                        <div className="mb-3">
                            <InputTextOneLine
                                label="Empresa"
                                name="empresa"
                                value={form.empresa || ""}
                                onChange={handleChange}
                                disabled
                                placeholder="Información adicional sobre el examen"
                                labelWidth="120px"
                            />
                        </div>
                        
                        <p className="text-justify leading-relaxed">
                            {form.textoFinalConsentimiento}
                        </p>
                    </div>
                </div>

                {/* Fecha y Hora */}
                <div className="flex items-center gap-8 flex-wrap">
                    <div className="flex items-center gap-4">
                        <label className="font-semibold min-w-[60px]">Fecha:</label>
                        <InputTextOneLine
                            type="date"
                            name="fecha"
                            value={form.fecha || ""}
                            onChange={handleChange}
                            labelWidth="0px"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="font-semibold min-w-[50px]">Hora:</label>
                        <span className="border rounded px-2 py-1 bg-gray-50">{hora}</span>
                    </div>
                </div>
            </SectionFieldset>

            {/* Botones de Acción */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-2">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSave} />
                        <FontAwesomeIcon icon={faSync} />
                        Grabar/Actualizar
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
                    <span className="font-bold italic text-base mb-1">Imprimir</span>
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
    );
}
