import { useState } from "react";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { handleSubirArchivo, handleSubirArchivoMasivo, ReadArchivosForm, VerifyTR } from "./controllerSubidaArchivos";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SubidaArchivos() {
    const { token, userlogued, selectedSede } = useSessionData();

    const initialFormState = {
        norden: "",

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

        SubirDoc: false,
    };

    const nomenclaturas = {
        "MERCURIO EN ORINA": "MERCURIO EN ORINA",
        "PLOMO EN SANGRE": "PLOMO EN SANGRE",
        "RESONANCIA MAGNETICA": "RESMAG",
        "PRUEBA DE ESFUERZO": "PRUEBA DE ESFUERZO",
        // "MATRIZ": "MTR",
        "ARCHIVO EXTERNO PARA CORREO 1": "ARCHIVO EXTERNO 1",
        "ARCHIVO EXTERNO PARA CORREO 2": "ARCHIVO EXTERNO 2",
        "MATRIZ (EXCEL)": { nomenclatura: "MTR", onlyExcel: true },
    }

    const [visualerOpen, setVisualerOpen] = useState(null)

    const {
        form,
        setForm,
        handleChangeNumberDecimals,
        handleClear,
        handleClearnotO,
    } = useForm(initialFormState);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, token, setForm, selectedSede);
        }
    };

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-4 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
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
            <SectionFieldset legend="Archivos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {Object.entries(nomenclaturas).map(([key, value], index) => {
                        const nomenclatura = typeof value === "string" ? value : value.nomenclatura;
                        const onlyExcel = typeof value === "object" ? value.onlyExcel : false;
                        return (
                            <div
                                key={index}
                                className="border rounded-xl p-4 flex flex-col gap-2 shadow-sm"
                            >
                                {/* Título */}
                                <span className="font-semibold text-sm">
                                    {key}
                                </span>
                                {/* Botones */}
                                <ButtonsPDF
                                    {...(form.SubirDoc ? { handleSave: () => handleSubirArchivo(form, selectedSede, userlogued, token, nomenclatura, onlyExcel) } : {})}
                                    {...(form.SubirDoc ? { handleRead: () => ReadArchivosForm(form, setVisualerOpen, token, nomenclatura) } : {})}
                                    handleMasivo={() => handleSubirArchivoMasivo(form, selectedSede, userlogued, token, nomenclatura, onlyExcel)}
                                    Nombre_1={`Subir archivo ${key}`}
                                    Nombre_2={`Ver archivo ${key}`}
                                    Nombre_3={`Subir masivo ${key}`}
                                />
                            </div>
                        )
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
    )
}
