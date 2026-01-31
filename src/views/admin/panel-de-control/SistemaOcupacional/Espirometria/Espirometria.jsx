import {
    InputTextOneLine,
    InputCheckbox,
    InputTextArea,
} from "../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
import { handleSubirArchivoMasivo, ReadArchivosForm, SubmitDataService, VerifyTR } from "./controllerEspirometria";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../components/templates/Templates";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import { handleSubirArchivo } from "../Altura18/controllerAltura18";

const tabla = "funcion_abs";

export default function Espirometria() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fecha: today,
        nombreExamen: "",
        pasoExamen: false,
        codExam: null,
        codAbs: null,

        dni: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        fvc: "",
        fev1: "",
        fev1_fvc: "",
        fef: "",

        peso: "",
        talla: "",
        sistolica: "",
        diastolica: "",

        fvcTeorico: "",
        fev1Teorico: "",

        interpretacion: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        nombre_doctorAsignado: "",
        user_doctorAsignado: "",

        nombre_doctorExtra: "",
        user_doctorExtra: "",

        SubirDoc: false,
        nomenclatura: "ESPIROMETRIA"
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleFocusNext,
        handleChangeSimple,
        handleCheckBoxChange,
        handleClear,
        handleClearnotO,
    } = useForm(initialFormState, { storageKey: "espirometria" });

    const [visualerOpen, setVisualerOpen] = useState(null)

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };
    console.log(form)

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
                <InputCheckbox
                    label={<span className="text-red-500">No Pasó Examen</span>}
                    name="pasoExamen"
                    checked={form.pasoExamen}
                    onChange={(e) => {
                        setForm((prev) => ({
                            ...prev,
                            fvc: e.target.checked ? "N/A" : "",
                            fev1: e.target.checked ? "N/A" : "",
                            fev1_fvc: e.target.checked ? "N/A" : "",
                            fef: e.target.checked ? "N/A" : "",
                            interpretacion: e.target.checked
                                ? "NO SE REALIZÓ ESPIROMETRÍA"
                                : "",
                        }));
                        handleCheckBoxChange(e);
                    }}
                />
                <ButtonsPDF
                    {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
                    {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
                    handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Criterios" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
                <div className="space-y-3">
                    <InputTextOneLine
                        label="FVC %"
                        name="fvc"
                        value={form?.fvc}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                    />
                    <InputTextOneLine
                        label="FEV1 %"
                        name="fev1"
                        value={form?.fev1}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                    />
                    <InputTextOneLine
                        label="FEV1/FVC %"
                        name="fev1_fvc"
                        value={form?.fev1_fvc}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                    />
                    <InputTextOneLine
                        label="FEF 25-75 %"
                        name="fef"
                        value={form?.fef}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                    />
                </div>
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Peso"
                        name="peso"
                        value={form?.peso}
                        disabled
                    />
                    <InputTextOneLine
                        label="Talla"
                        name="talla"
                        value={form?.talla}
                        disabled
                    />
                    <InputTextOneLine
                        label="Sistólica"
                        name="sistolica"
                        value={form?.sistolica}
                        disabled
                    />
                    <InputTextOneLine
                        label="Diastólica"
                        name="diastolica"
                        value={form?.diastolica}
                        disabled
                    />
                </div>
                <div className="space-y-3">
                    <InputTextOneLine
                        label="FVC Teórico"
                        name="fvcTeorico"
                        value={form?.fvcTeorico}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                    />
                    <InputTextOneLine
                        label="FEV1 Teórico"
                        name="fev1Teorico"
                        value={form?.fev1Teorico}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                    />
                </div>
                <InputTextArea
                    label="Interpretación"
                    rows={4}
                    name="interpretacion"
                    value={form?.interpretacion}
                    className="xl:col-span-3"
                    onChange={handleChange}
                />
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                />
                <EmpleadoComboBox
                    value={form.nombre_doctorAsignado}
                    label="Doctor Asignado"
                    form={form}
                    onChange={handleChangeSimple}
                    nameField="nombre_doctorAsignado"
                    idField="user_doctorAsignado"
                />
                <EmpleadoComboBox
                    value={form.nombre_doctorExtra}
                    label="Doctor Extra"
                    form={form}
                    onChange={handleChangeSimple}
                    nameField="nombre_doctorExtra"
                    idField="user_doctorExtra"
                />
            </SectionFieldset>

            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={() => { }}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
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
        </div >
    );
}