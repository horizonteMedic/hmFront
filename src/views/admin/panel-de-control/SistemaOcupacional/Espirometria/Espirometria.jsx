import {
    InputTextOneLine,
    InputCheckbox,
} from "../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
import { SubmitDataService, VerifyTR } from "./controllerEspirometria";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../components/templates/Templates";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";

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

        fvcTeorico: "",
        fev1Teorico: "",

        interpretacion: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
        SubirDoc: false,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleCheckBoxChange,
        handleClear,
        handleClearnotO,
    } = useForm(initialFormState, { storageKey: "espirometria" });

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
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
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />
            {form.SubirDoc && <div className="flex justify-center items-center gap-3">
                <button onClick={handleSubirArchivo} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                    <FontAwesomeIcon icon={faUpload} />
                    Subir Archivo
                </button>
                <button onClick={ReadArchivosForm} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                    <FontAwesomeIcon icon={faDownload} />
                    Ver Archivo
                </button>
            </div>}

            <SectionFieldset legend="Criterios Psicológicos" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
                <div className="space-y-3">
                    <InputTextOneLine
                        label="FVC %"
                        name="fvc"
                        value={form?.fvc}
                        onChange={handleChange}
                    />
                    <InputTextOneLine
                        label="FEV1 %"
                        name="fev1"
                        value={form?.fev1}
                        onChange={handleChange}
                    />
                    <InputTextOneLine
                        label="FEV1/FVC %"
                        name="fev1_fvc"
                        value={form?.fev1_fvc}
                        onChange={handleChange}
                    />
                    <InputTextOneLine
                        label="FEF 25-75 %"
                        name="fef"
                        value={form?.fef}
                        onChange={handleChange}
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
                </div>
                <div className="space-y-3">
                    <InputTextOneLine
                        label="FVC Teórico"
                        name="fvcTeorico"
                        value={form?.fvcTeorico}
                        onChange={handleChange}
                    />
                    <InputTextOneLine
                        label="FEV1 Teórico"
                        name="fev1Teorico"
                        value={form?.fev1Teorico}
                        onChange={handleChange}
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
                handlePrint={() => { }}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
                hidePrint
            />
        </div>
    );
}