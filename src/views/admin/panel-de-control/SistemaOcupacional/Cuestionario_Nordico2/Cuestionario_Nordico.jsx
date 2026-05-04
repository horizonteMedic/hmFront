import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMicroscope,
    faTint,
    faHeartbeat,
    faDownload,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import Swal from "sweetalert2";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { VerifyTR, SubmitCuestionarioNordic, PrintHojaR, handleSubirArchivo, ReadArchivosForm, handleSubirArchivoMasivo } from "./ControllerCuestionarioNordico.jsx"
import { useState } from "react";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales.jsx";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset.jsx";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine.jsx";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup.jsx";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
const tabla = "cuestionario_nordico"

const Cuestionario_Nordico = () => {

    const { token, selectedSede, datosFooter, userlogued, userCompleto, userName } =
        useSessionData();
    const initialFormState = {
        //Header
        norden: "",
        fechaCuestionario: today,
        codigoCuestionario: null,

        //Datos personales
        nombres: "",
        edad: "",
        sexo: "",
        dni: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        estadoCivil: "",
        nivelEstudios: "",

        //datos laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        anios: "",
        meses: "",
        horasTrabajadas: "",
        esDiestro: false,
        esZurdo: false,
        //Responder
        cuelloNo: true,
        cuelloSi: false,
        pregunta1CuelloNo: false,
        pregunta1CuelloSi: false,
        pregunta2CuelloNo: false,
        pregunta2CuelloSi: false,
        //Hombros
        hombrosNo: true,
        hombroDerechoSi: false,
        hombroIzquierdoSi: false,
        ambosHombrosSi: false,
        pregunta1HombrosNo: false,
        pregunta1HombrosSi: false,
        pregunta2HombrosNo: false,
        pregunta2HombrosSi: false,
        //Codos
        codosNo: true,
        codoDerechoSi: false,
        codoIzquierdoNo: false,
        ambosCodosSi: false,
        pregunta1CodosNo: false,
        pregunta1CodosSi: false,
        pregunta2CodosNo: false,
        pregunta2CodosSi: false,
        //Muñeca
        munecaNo: true,
        munecaDerechaSi: false,
        munecaIzquierdaSi: false,
        ambasMunecasSi: false,
        pregunta1MunecasNo: false,
        pregunta1MunecasSi: false,
        pregunta2MunecasNo: false,
        pregunta2MunecasSi: false,
        //Otros
        //Espalda Alta
        espaldaAltaToraxNo: true,
        espaldaAltaToraxSi: false,
        pregunta1EspaldaAltaToraxNo: false,
        pregunta1EspaldaAltaToraxSi: false,
        pregunta2EspaldaAltaToraxNo: false,
        pregunta2EspaldaAltaToraxSi: false,
        //Espalda Baja
        espaldaBajaLumbarNo: true,
        espaldaBajaLumbarSi: false,
        pregunta1EspaldaBajaLumbarNo: false,
        pregunta1EspaldaBajaLumbarSi: false,
        pregunta2EspaldaBajaLumbarNo: false,
        pregunta2EspaldaBajaLumbarSi: false,
        //Caderas
        caderasOMuslosNo: true,
        caderasOMuslosSi: false,
        pregunta1CaderasOMuslosNo: false,
        pregunta1CaderasOMuslosSi: false,
        pregunta2CaderasOMuslosNo: false,
        pregunta2CaderasOMuslosSi: false,
        //Rodillas
        rodillasNo: true,
        rodillasSi: false,
        pregunta1RodillasNo: false,
        pregunta1RodillasSi: false,
        pregunta2RodillasNo: false,
        pregunta2RodillasSi: false,
        //Tobillos
        tobillosOPiesNo: true,
        tobillosOPiesSi: false,
        pregunta1TobillosOPiesNo: false,
        pregunta1TobillosOPiesSi: false,
        pregunta2TobillosOPiesNo: false,
        pregunta2TobillosOPiesSi: false,
        //Espalda Baja form
        pregunta1EspaldaBajaNo: true,
        pregunta1EspaldaBajaSi: false,
        pregunta2EspaldaBajaNo: false,
        pregunta2EspaldaBajaSi: false,
        pregunta3EspaldaBajaNo: false,
        pregunta3EspaldaBajaSi: false,
        //Dias 1
        pregunta4AEspaldaBaja: false,
        pregunta4BEspaldaBaja: false,
        pregunta4CEspaldaBaja: false,
        pregunta4DEspaldaBaja: false,
        pregunta4EEspaldaBaja: false,
        //5
        pregunta5AEspaldaBajaNo: false,
        pregunta5AEspaldaBajaSi: false,
        pregunta5BEspaldaBajaNo: false,
        pregunta5BEspaldaBajaSi: false,
        //6 Dias 2
        pregunta6AEspaldaBaja: false,
        pregunta6BEspaldaBaja: false,
        pregunta6CEspaldaBaja: false,
        pregunta6DEspaldaBaja: false,
        //7
        pregunta7EspaldaBajaNo: false,
        pregunta7EspaldaBajaSi: false,
        //8
        pregunta8EspaldaBajaNo: false,
        pregunta8EspaldaBajaSi: false,
        //Hombros
        pregunta1ProblemasHombrosNo: true,
        pregunta1ProblemasHombrosSi: false,
        //10.
        pregunta2ProblemasHombrosNo: false,
        pregunta2ProblemasHombroIzquierdoSi: false,
        pregunta2ProblemasHombroDerechoSi: false,
        pregunta2ProblemasAmbosHombros: false,
        //11
        pregunta3ProblemasHombrosNo: false,
        pregunta3ProblemasHombrosSi: false,
        //12
        pregunta4ProblemasHombrosNo: false,
        pregunta4ProblemasHombroIzquierdoSi: false,
        pregunta4ProblemasHombroDerechoSi: false,
        pregunta4ProblemasAmbosHombros: false,
        //13
        pregunta5AProblemasHombros: false,
        pregunta5BProblemasHombros: false,
        pregunta5CProblemasHombros: false,
        pregunta5DProblemasHombros: false,
        //14
        pregunta6AProblemasHombrosNo: false,
        pregunta6AProblemasHombrosSi: false,

        pregunta6BProblemasHombrosNo: false,
        pregunta6BProblemasHombrosSi: false,
        //15
        pregunta7AProblemasHombros: false,
        pregunta7BProblemasHombros: false,
        pregunta7CProblemasHombros: false,
        pregunta7DProblemasHombros: false,
        //16
        pregunta8ProblemasHombrosNo: false,
        pregunta8ProblemasHombrosSi: false,
        //17
        pregunta9ProblemasHombrosNo: false,
        pregunta9ProblemasHombroIzquierdoSi: false,
        pregunta9ProblemasHombroDerechoSi: false,
        pregunta9ProblemasAmbosHombros: false,
        //Cuello
        pregunta1ProblemasCuelloNo: true,
        pregunta1ProblemasCuelloSi: false,
        //2
        pregunta2ProblemasCuelloNo: false,
        pregunta2ProblemasCuelloSi: false,
        //3
        pregunta3ProblemasCuelloNo: false,
        pregunta3ProblemasCuelloSi: false,
        //4
        pregunta4AProblemasCuello: false,
        pregunta4BProblemasCuello: false,
        pregunta4CProblemasCuello: false,
        pregunta4DProblemasCuello: false,
        pregunta4EProblemasCuello: false,
        //5
        pregunta5AProblemasCuelloNo: false,
        pregunta5AProblemasCuelloSi: false,

        pregunta5BProblemasCuelloNo: false,
        pregunta5BProblemasCuelloSi: false,
        //6
        pregunta6AProblemasCuello: false,
        pregunta6BProblemasCuello: false,
        pregunta6CProblemasCuello: false,
        pregunta6DProblemasCuello: false,
        //7
        pregunta7ProblemasCuelloNo: false,
        pregunta7ProblemasCuelloSi: false,
        //8
        pregunta8ProblemasCuelloNo: false,
        pregunta8ProblemasCuelloSi: false,

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        SubirDoc: false,
        nomenclatura: "PRUEBA DE ESFUERZO"
    };

    const [visualerOpen, setVisualerOpen] = useState(null)
    const { form, setForm, handleChange, handleChangeNumber, handleClear, handleChangeSimple, handleClearnotO, handleInputChangeChecked, handleRadioButtonBoolean } = useForm(initialFormState)

    const handlePrint = () => {
        if (!form.norden) return Swal.fire("Error", "Debe colocar un N° Orden", "error");
        Swal.fire({
            title: "¿Desea Imprimir Cuestionario Nordico?",
            html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, Imprimir",
            cancelButtonText: "Cancelar",
            customClass: {
                title: "swal2-title",
                confirmButton: "swal2-confirm",
                cancelButton: "swal2-cancel",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                PrintHojaR(form.norden, token, tabla);
            }
        });
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    return (
        <>
            <div className="max-w-[90%] mx-auto gap-x-4" >
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="flex flex-col w-full lg:col-span-2 gap-x-4 gap-y-3">
                        <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-4">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                value={form.norden}
                                onKeyUp={handleSearch}
                                onChange={handleChangeNumber}
                            />

                            <InputTextOneLine
                                label="Fecha"
                                name="fechaExam"
                                type="date"
                                value={form.fechaExam}
                                onChange={handleChangeSimple}
                            />
                        </SectionFieldset>

                        <DatosPersonalesLaborales form={form} />

                        <SectionFieldset legend="Cuestionario" className="grid grid-cols-1 gap-y-3 gap-x-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <label className="my-auto">¿Cuántos años y meses ha estado Ud. haciendo el presente tipo de trabajo?</label>
                                <InputTextOneLine
                                    label="Años"
                                    name="anios"
                                    value={form.anios}
                                    onChange={handleChangeNumber}
                                    labelWidth="80px"
                                />
                                <InputTextOneLine
                                    label="Meses"
                                    name="meses"
                                    value={form.meses}
                                    onChange={handleChangeNumber}
                                    labelWidth="80px"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                {/* <label className="my-auto">¿En promedio, cuántas horas a la semana trabaja?</label> */}
                                <InputTextOneLine
                                    label="¿En promedio, cuántas horas a la semana trabaja?"
                                    name="horasTrabajadas"
                                    value={form.horasTrabajadas}
                                    onChange={handleChangeNumber}
                                    labelWidth="280px"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <InputsBooleanRadioGroup
                                    label="¿Es usted? "
                                    name="diestro"
                                    value={form?.esDiestro}
                                    onChange={handleRadioButtonBoolean}
                                    trueLabel="Diestro"
                                    falseLabel="Zurdo"
                                />
                            </div>

                            <div>
                                <h1>¿Cómo responder el cuestionario?</h1>
                                <label className="my-auto">En este dibujo Ud. puede ver la posición aproximada de las partes del cuerpo referidos en el cuestionario. Ud. debe decidir cuál parte tiene o ha tenido molestias / problema (si lo ha tenido), por favor responda poniendo una x en el respectivo recuadro para cada pregunta.</label>
                            </div>

                        </SectionFieldset>
                    </div>
                    <div className="max-w-[70%] flex flex-col mx-auto">
                        <img className=" border-[1px] border-primario border-solid rounded-md" src="img/Nordico/nordico.png" alt="" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <SectionFieldset legend="Para ser respondido por todos">
                        <label>Ha tenido Ud. Durante cualquier tiempo en los ultimos 12 meses problemas (molestias, dolor o disconfort) en:</label>
                    </SectionFieldset>

                    <SectionFieldset className="grid grid-cols-1 lg:grid-cols-2" legend="Para ser respondido únicamente por quienes han tenido problemas">
                        <SectionFieldset legend="Ha estado impedido en cualquier tiempo durante los pasados 12 meses para hacer sus rutinas habituales en el trabajo o su casa por este problema?">

                        </SectionFieldset>
                        
                        <SectionFieldset legend="¿Ud. Ha tenido problemas durante los ultimos 7 días?">

                        </SectionFieldset>
                    </SectionFieldset>
                </div>
            </div>

        </>
    )
}

export default Cuestionario_Nordico;