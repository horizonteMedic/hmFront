import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faTint,
  faHeartbeat,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import Swal from "sweetalert2";
import Cuestionario from "./Cuestionario/Cuestionario";
import Responder from "./Responder/Responder";
import Espalda_Baja from "./Espalda_Baja/Espalda_Baja";
import Hombros from "./Hombros/Hombros";
import Cuello from "./Cuello/Cuello";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { VerifyTR, SubmitCuestionarioNordic, PrintHojaR } from "./controller/ControllerCN"

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
const tabla = "cuestionario_nordico"

const Cuestionario_Nordico = () => {
  const { token, selectedSede, datosFooter, userlogued, userCompleto } =
    useSessionData();
  const initialFormState = {
    norden: "",
    codigoCuestionario: null,
    fechaCuestionario: today,
    nombres: "",
    edad: "",
    sexo: "",
    dni: "",
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
  };

  
  const { form, setForm, handleChange, handleChangeNumber, handleClear, handleClearnotO, handleInputChangeChecked } = useForm(initialFormState)
  
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

  return (
    <div className="">
      <div className="max-w-[70%] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Cuestionario Nórdico de Signos y Síntomas Osteomusculares</h1>
        {/* Tabs */}
        <div className="flex flex-col space-x-1 mt-4 border shadow p-8 mx-auto">
           <Cuestionario
              token={token}
              selectedSede={selectedSede}
              userlogued={userlogued}
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              handleChangeNumber={handleChangeNumber}
              handleClearnotO={handleClearnotO}
              handleInputChangeChecked={handleInputChangeChecked}
              tabla={tabla}
              VerifyTR={VerifyTR}
            />
            <Responder
              token={token}
              selectedSede={selectedSede}
              userlogued={userlogued}
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              handleChangeNumber={handleChangeNumber}
              handleClearnotO={handleClearnotO}
              handleInputChangeChecked={handleInputChangeChecked}
            />
            <Espalda_Baja
              token={token}
              selectedSede={selectedSede}
              userlogued={userlogued}
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              handleChangeNumber={handleChangeNumber}
              handleClearnotO={handleClearnotO}
              handleInputChangeChecked={handleInputChangeChecked}
            />
            <Hombros
              token={token}
              selectedSede={selectedSede}
              userlogued={userlogued}
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              handleChangeNumber={handleChangeNumber}
              handleClearnotO={handleClearnotO}
              handleInputChangeChecked={handleInputChangeChecked}
            />
            <Cuello
              token={token}
              userlogued={userlogued}
              form={form}
              setForm={setForm}
              handleInputChangeChecked={handleInputChangeChecked}
              SubmitCuestionarioNordic={SubmitCuestionarioNordic}
              tabla={tabla}
              handleClear={handleClear}
              handleChange={handleChange}
              handlePrint={handlePrint}
            />

        </div>



      </div>
    </div>
  );
};

export default Cuestionario_Nordico;


