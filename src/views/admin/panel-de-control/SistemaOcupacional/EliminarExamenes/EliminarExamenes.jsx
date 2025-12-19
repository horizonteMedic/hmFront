import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faTimes } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine } from "../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { VerifyTR, DeleteExamen } from "./controllerEliminarExamenes";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";

const tabla = "eliminar_examenes";

export default function EliminarExamenes() {
    const { token, selectedSede } = useSessionData();

    const initialFormState = {
        norden: "",
        nombreExamen: "",

        nombres: "",
        dni: "",
        edad: "",
        sexo: "",

        empresa: "",
        contrata: "",
        areaTrabajo: "",
        puestoActual: "",

        // Examen Ocupacional
        triaje: "", labClinico: "", rxTorax: "", fichaAudiologica: "", audiometria: "",
        espirometria: "", odontograma: "", psicologia: "", fichaOIT: "", exRxSanguineos: "",
        fichaAntPatologicos: "", histOcupacional: "", cuestionarioNordico: "", evMusculoEsqueletica: "",
        oftalmologia: "", actitudMedOcupacional: "", usoRespiradores: "", anexo16A: "",
        consentimientoDosaje: "", anexo16: "", electrocardiograma: "",
        // Trabajos en Altura
        certTrabAlturaBarrik: "", certTrabajoAltura: "",
        // Otros Formatos
        evMuscEsqueletico: "", cuestCalidadSueno: "", testFatSomnolencia: "",
        evalOftalmologica: "", certManipuladores: "", cuestAudiometria: "", informeAudiometria: "",
        perimetroToraxico: "",
        // Conducción de Vehículos
        fichaSAS: "", certConduccVehiculos: "",
        // Fichas Sin Restricción
        fMedica: "", fAptitudMedOcup: "", fMedicaAnexo2: "", fAptitudAnexo2: "",
        fMedAgro: "", fAptitudAgro: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleClear,
        handleChangeNumberDecimals,
        handleClearnotO,
    } = useForm(initialFormState, { storageKey: "eliminarExamenesOcupacional" });

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handleDelete = (campo) => {
        DeleteExamen(form.norden, campo, token, setForm, form);
    };

    const ExamenRow = ({ label, name, value }) => (
        <div className="flex items-center gap-2 mb-1">
            <InputTextOneLine
                label={label}
                name={name}
                value={value}
                onChange={handleChange}
                disabled
                labelWidth="160px"
            />
            <button
                type="button"
                onClick={() => handleDelete(name)}
                className="text-red-500 hover:text-red-700 border border-red-300 rounded px-2 py-1"
                title="Eliminar"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    );

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            {/* Búsqueda */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form?.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            {/* Layout principal con flex */}
            <div className="flex gap-3 items-start">
                {/* Columna 1: EXAMEN OCUPACIONAL */}
                <div className="flex-1">
                    <SectionFieldset legend="EXAMEN OCUPACIONAL">
                        <ExamenRow label="Triaje" name="triaje" value={form.triaje} />
                        <ExamenRow label="Lab. Clinico" name="labClinico" value={form.labClinico} />
                        <ExamenRow label="Rx. Torax P.A" name="rxTorax" value={form.rxTorax} />
                        <ExamenRow label="Ficha Audiologica" name="fichaAudiologica" value={form.fichaAudiologica} />
                        <ExamenRow label="Audiometria" name="audiometria" value={form.audiometria} />
                        <ExamenRow label="Espirometria" name="espirometria" value={form.espirometria} />
                        <ExamenRow label="Odontograma" name="odontograma" value={form.odontograma} />
                        <ExamenRow label="Informe Psicologico" name="psicologia" value={form.psicologia} />
                        <ExamenRow label="Ficha OIT" name="fichaOIT" value={form.fichaOIT} />
                        <ExamenRow label="Ex. Rx Sanguineos" name="exRxSanguineos" value={form.exRxSanguineos} />
                        <ExamenRow label="Ficha Ant. Patológicos" name="fichaAntPatologicos" value={form.fichaAntPatologicos} />
                        <ExamenRow label="Hist. Ocupacional" name="histOcupacional" value={form.histOcupacional} />
                        <ExamenRow label="Cuestionario Nórdico" name="cuestionarioNordico" value={form.cuestionarioNordico} />
                        <ExamenRow label="Ev.MuscoloEsqueletica" name="evMusculoEsqueletica" value={form.evMusculoEsqueletica} />
                        <ExamenRow label="Oftalmología" name="oftalmologia" value={form.oftalmologia} />
                        <ExamenRow label="Actitud Med.Ocupacional" name="actitudMedOcupacional" value={form.actitudMedOcupacional} />
                        <ExamenRow label="Uso de Respiradores" name="usoRespiradores" value={form.usoRespiradores} />
                        <ExamenRow label="Anexo 16-A" name="anexo16A" value={form.anexo16A} />
                        <ExamenRow label="Consentimiento Dosaje" name="consentimientoDosaje" value={form.consentimientoDosaje} />
                        <ExamenRow label="Anexo 16" name="anexo16" value={form.anexo16} />
                        <ExamenRow label="Electrocardiograma" name="electrocardiograma" value={form.electrocardiograma} />
                    </SectionFieldset>
                </div>

                {/* Columna 2: Trabajos en Altura + Otros Formatos + Conducción */}
                <div className="flex-1 space-y-3">
                    <SectionFieldset legend="Trabajos en Altura">
                        <ExamenRow label="Cert.Trab.Altura(Barrik)" name="certTrabAlturaBarrik" value={form.certTrabAlturaBarrik} />
                        <ExamenRow label="Cert. Trabajo Altura" name="certTrabajoAltura" value={form.certTrabajoAltura} />
                    </SectionFieldset>

                    <SectionFieldset legend="Otros Formatos">
                        <ExamenRow label="Ev.Musc.Esqueletico" name="evMuscEsqueletico" value={form.evMuscEsqueletico} />
                        <ExamenRow label="Cuest.CalidadSueño" name="cuestCalidadSueno" value={form.cuestCalidadSueno} />
                        <ExamenRow label="TestFatSomnolencia" name="testFatSomnolencia" value={form.testFatSomnolencia} />
                        <ExamenRow label="Eval. Oftalmologica" name="evalOftalmologica" value={form.evalOftalmologica} />
                        <ExamenRow label="Cert. Manipuladores" name="certManipuladores" value={form.certManipuladores} />
                        <ExamenRow label="Cuest. Audiometria" name="cuestAudiometria" value={form.cuestAudiometria} />
                        <ExamenRow label="Informe Audiometria" name="informeAudiometria" value={form.informeAudiometria} />
                        <ExamenRow label="Perimetro Toraxico" name="perimetroToraxico" value={form.perimetroToraxico} />
                    </SectionFieldset>

                    <SectionFieldset legend="Conducción de Vehículos">
                        <ExamenRow label="Ficha S.A.S" name="fichaSAS" value={form.fichaSAS} />
                        <ExamenRow label="Cert.Cond.Vehiculos(Barrik)" name="certConduccVehiculos" value={form.certConduccVehiculos} />
                    </SectionFieldset>
                </div>

                {/* Columna 3: Fichas Sin Restricción + COVID-19 */}
                <div className="flex-1 space-y-3">
                    <SectionFieldset legend="Fichas Sin Restricción">
                        <ExamenRow label="F.Medica" name="fMedica" value={form.fMedica} />
                        <ExamenRow label="F.Aptitud Med.Ocup" name="fAptitudMedOcup" value={form.fAptitudMedOcup} />
                        <ExamenRow label="F.Medica Anexo2" name="fMedicaAnexo2" value={form.fMedicaAnexo2} />
                        <ExamenRow label="F.Aptitud Anexo2" name="fAptitudAnexo2" value={form.fAptitudAnexo2} />
                        <ExamenRow label="F.Med Agro" name="fMedAgro" value={form.fMedAgro} />
                        <ExamenRow label="F.Aptitud Agro" name="fAptitudAgro" value={form.fAptitudAgro} />
                    </SectionFieldset>
                </div>
            </div>

            <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                    </button>
                </div>
            </section>
        </div>
    );
}
