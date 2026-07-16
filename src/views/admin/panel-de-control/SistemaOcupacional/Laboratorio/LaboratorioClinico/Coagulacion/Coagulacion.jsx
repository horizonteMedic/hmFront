import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./ControllerCoagulacion";

const tabla = "tiempo_coagulacion_sangria"

const Coagulacion = () => {

    const { token, userlogued, selectedSede, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: '',
        fecha: today,
        codLabclinico: null,

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

        //Examen
        coagulacion: "",
        sangria: "",


        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        // Doctor Asignado //BUSCADOR
        nombre_doctorAsignado: "",
        user_doctorAsignado: "",
    };

    const {
        form,
        setForm,
        handleChangeNumberDecimals,
        handleRadioButton,
        handleChangeSimple,
        handleClearnotO,
        handleClear,
        handlePrintDefault,
    } = useForm(initialFormState);

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla);
        });
    };

    return (
        <>
            <form className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
                <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                </SectionFieldset>

                <DatosPersonalesLaborales form={form} />

                <SectionFieldset legend="Pruebas y Resultados" className="space-y-3">

                    <div className="flex items-center gap-4">
                        <InputTextOneLine
                            label='Tiempo de Coagulación'
                            name="coagulacion"
                            value={form.coagulacion}
                            onChange={handleChangeSimple}
                            //onKeyUp={handleFocusNext}
                            labelWidth="120px"
                            className='w-[90%]'
                        />
                        <div className='flex flex-col items-start text-gray-500 text-[10px] font-medium min-w-[130px]'>
                            <span>{"5 - 12 min."}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <InputTextOneLine
                            label='Tiempo de sangría'
                            name="sangria"
                            value={form.sangria}
                            onChange={handleChangeSimple}
                            //onKeyUp={handleFocusNext}
                            labelWidth="120px"
                            className='w-[90%]'
                        />
                        <div className="text-gray-500 text-[10px] font-medium min-w-[130px]">
                            <span>{"1 - 5 min."}</span>
                        </div>
                    </div>
                </SectionFieldset>

                <SectionFieldset legend="Especialista">
                    <EmpleadoComboBox
                        value={form.nombre_medico}
                        form={form}
                        label='Especialista que Certifica'
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
                </SectionFieldset>
                <BotonesAccion
                    form={form}
                    handleSave={handleSave}
                    handleClear={handleClear}
                    handlePrint={handlePrint}
                    handleChangeNumberDecimals={handleChangeNumberDecimals}
                />
            </form>
        </>
    )
}

export default Coagulacion