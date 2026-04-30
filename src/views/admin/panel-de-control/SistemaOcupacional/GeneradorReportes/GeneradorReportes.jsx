import { useState, useRef } from "react";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import { GetInfoPac, handleImprimirYSubir, handleImprimirYSubirMasivo, ReadArchivosForm } from "./controllerGeneradorReportes";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import { buildExamenesList } from "../Folio/folioCatalogo";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ExamenesListCOMPLETO = buildExamenesList([
    "CERTIFICADO_ANEXO_02",
    "CERTIFICADO_APTITUD_ANEXO_16",
    "RESUMEN_MEDICO_PODEROSA",
    "FICHA_DATOS_PACIENTE",
    "CERTIFICADO_VEHICULOS"
]);

export const ListaPorPlantilla = {
    "COMPLETO": ExamenesListCOMPLETO,
};

export default function GeneradorReportes() {
    const abortControllerRef = useRef(null);
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();
    const [selectedListType, setSelectedListType] = useState("COMPLETO");
    const [showOnlyPassed, setShowOnlyPassed] = useState(false);
    const [bulkRunning, setBulkRunning] = useState(false);

    const [visualerOpen, setVisualerOpen] = useState(null)

    const initialFormState = {
        norden: "",
        nombreExamen: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",
        listaExamenes: ListaPorPlantilla["COMPLETO"],
    };

    const {
        form,
        setForm,
        handleChangeNumber,
        handleClear,
        handleClearnotO,
    } = useForm(initialFormState);

    const handleSearch = async (e) => {
        if (e.key === "Enter") {
            search();
        }
    };

    const search = async () => {
        handleClearnotO();
        const currentList = ListaPorPlantilla[selectedListType] || ListaPorPlantilla["COMPLETO"];
        await GetInfoPac(form.norden, setForm, token, selectedSede, currentList);
    }

    const handleGenerarMasivo = async () => {
        if (bulkRunning) return;
        const examenesParaGenerar = (form.listaExamenes ?? []).filter((e) => e?.resultado);
        if (!form.norden || examenesParaGenerar.length === 0) return;

        setBulkRunning(true);
        try {
            await handleImprimirYSubirMasivo(
                examenesParaGenerar,
                form,
                token,
                selectedSede,
                userlogued,
                datosFooter,
                abortControllerRef,
                search
            );
        } finally {
            setBulkRunning(false);
        }
    };

    const handleListChange = (e) => {
        const newValue = e.target.value;
        setSelectedListType(newValue);
        const newList = ListaPorPlantilla[newValue] || ListaPorPlantilla["COMPLETO"];

        if (form.norden) {
            handleClearnotO();
            GetInfoPac(form.norden, setForm, token, selectedSede, newList);
        } else {
            setForm((prev) => ({
                ...prev,
                listaExamenes: newList,
            }));
        }
    };

    return (
        <div className="w-full space-y-3 px-4 max-w-[95%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Configuración" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                    <label className="font-semibold" style={{ minWidth: "120px" }}>Plantilla:</label>
                    <select
                        className="border rounded px-2 py-1 w-full"
                        value={selectedListType}
                        onChange={handleListChange}
                    >
                        {Object.keys(ListaPorPlantilla).map(elemento => (
                            <option value={elemento} key={elemento}>{elemento}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showPassed"
                        checked={showOnlyPassed}
                        onChange={(e) => setShowOnlyPassed(e.target.checked)}
                        disabled={!form.nombres}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    />
                    <label htmlFor="showPassed" className={`text-sm font-medium ${!form.nombres ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}>
                        Mostrar solo exámenes realizados
                    </label>
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Lista de Reportes" className="flex flex-col w-full">
                <div className="flex justify-end pb-3">
                    <button
                        type="button"
                        className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${(!form.nombres || bulkRunning || !(form.listaExamenes ?? []).some((e) => e?.resultado))
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                            }`}
                        disabled={!form.nombres || bulkRunning || !(form.listaExamenes ?? []).some((e) => e?.resultado)}
                        onClick={handleGenerarMasivo}
                    >
                        Generar reportes (secuencial)
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                    {form.listaExamenes?.map((examen, index) => {
                        if (showOnlyPassed && !examen.resultado) return null;

                        return (
                            <div
                                key={index}
                                className={`flex flex-col justify-between border p-4 rounded-xl shadow-sm gap-3 transition-all duration-200 ${examen.resultado ? "bg-white border-blue-200" : "bg-gray-50 border-gray-200 opacity-75"
                                    }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-gray-800 text-sm leading-tight">
                                        {index + 1}.- {examen.nombre}
                                    </span>

                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${examen.resultado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {examen.resultado ? "REALIZADO" : "PENDIENTE"}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                            {examen.urlArchivo ? "SUBIDO" : "NO SUBIDO"}
                                        </span>
                                        <ButtonsPDF
                                            {...(examen.urlArchivo ? {
                                                handleRead: () =>
                                                    ReadArchivosForm(form, setVisualerOpen, token, examen.nomenclaturaSubida)
                                            } : {})}
                                            Nombre_1={`Subir archivo`}
                                            Nombre_2={`Ver archivo`}
                                        />
                                    </div>
                                </div>

                                <button
                                    className={`w-full py-2 px-4 rounded-lg text-sm font-bold transition-all ${examen.resultado
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                    disabled={!examen.resultado}
                                    onClick={() => handleImprimirYSubir(examen, form, token, selectedSede, userlogued, datosFooter, abortControllerRef,search)}
                                >
                                    Imprimir y Subir
                                </button>
                            </div>
                        );
                    })}
                </div>
            </SectionFieldset>

            <BotonesAccion
                form={form}
                handleClear={handleClear}
                hideSave
                hidePrint
            />
            {visualerOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
                        <div className="px-4 py-2 naranjabackgroud flex justify-between">
                            <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
                            <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
                        </div>
                        <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
                            <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
                        </div>
                        <div className="flex justify-center">
                            <a href={visualerOpen.mensaje} download={visualerOpen.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
