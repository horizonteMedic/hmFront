import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faTint,
  faHeartbeat,
  faSave,
  faBroom,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import Swal from "sweetalert2";

import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { PrintHojaR, SubmitTestFatiga, VerifyTR } from "./ControllerTestF";


const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
const tabla = "test_fatiga_somnolencia"

const Test_fatiga = () => {
  const { token, selectedSede, datosFooter, userlogued, userCompleto } =
    useSessionData();
  const initialFormState = {
    norden: "",
    fexamen: today,
    nombres: "",
    dni: "",
    edad: "",
    sexoPa: "",
    areaO: "",
    razonEmpresa: "",
    //SITUACIÓN
    rbs1Nunca: true,
    rbs1Poca: false,
    rbs1Moderada: false,
    rbs1Alta: false,

    rbs2Nunca: true,
    rbs2Poca: false,
    rbs2Moderada: false,
    rbs2Alta: false,
    
    rbs3Nunca: true,
    rbs3Poca: false,
    rbs3Moderada: false,
    rbs3Alta: false,

    rbs4Nunca: true,
    rbs4Poca: false,
    rbs4Moderada: false,
    rbs4Alta: false,

    rbs5Nunca: true,
    rbs5Poca: false,
    rbs5Moderada: false,
    rbs5Alta: false,

    rbs6Nunca: true,
    rbs6Poca: false,
    rbs6Moderada: false,
    rbs6Alta: false,

    rbs7Nunca: true,
    rbs7Poca: false,
    rbs7Moderada: false,
    rbs7Alta: false,

    rbs8Nunca: true,
    rbs8Poca: false,
    rbs8Moderada: false,
    rbs8Alta: false,

    rbs9Nunca: true,
    rbs9Poca: false,
    rbs9Moderada: false,
    rbs9Alta: false,

    txtPuntaje: "0",
    rbNo: false,
    rbSi: false,
    txtMedico: userCompleto.datos.nombres_user,
    dniUser: userCompleto.datos.dni_user
  };

  const { form, setForm, handleChange, handleChangeNumber, handleClear, handleClearnotO, handleCheckBoxChange} = useForm(initialFormState)
  
  const handlePrint = () => {
    if (!form.norden) return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Test de Fatiga y Somnolencia?",
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
        PrintHojaR(form.norden, token, tabla, datosFooter);
      }
    });
  };

  const scoreMap = {
  Nunca: 0,
  Poca: 1,
  Moderada: 2,
    Alta: 3}

 const handleInputChangeCheckedGroup = (e, group) => {
    const { name } = e.target;

    setForm(prev => {
        const newForm = { ...prev };

        // Primero, desmarcamos todos los radios del grupo
        group.forEach(code => newForm[code] = false);

        // Activamos solo el seleccionado
        newForm[name] = true;

        // Calcular puntaje acumulado
        let puntaje = 0;
        Object.keys(newForm).forEach(key => {
            if (newForm[key] === true) {
                if (key.includes("Nunca")) puntaje += 0;
                else if (key.includes("Poca")) puntaje += 1;
                else if (key.includes("Moderada")) puntaje += 2;
                else if (key.includes("Alta")) puntaje += 3;
            }
        });

        newForm.txtPuntaje = puntaje;

        return newForm;
    });
};
  const RowCheck = ({title, N, P, M, A}) => {
   
    return(
        <>
            <div className="col-span-2">{title}</div>
            <div className="text-center"><input type="radio" checked={form[N]} onChange={(e) => handleInputChangeCheckedGroup(e, [N,P,M,A])} name={N} /></div>
            <div className="text-center"><input type="radio" checked={form[P]} onChange={(e) => handleInputChangeCheckedGroup(e, [N,P,M,A])} name={P} /></div>
            <div className="text-center"><input type="radio" checked={form[M]} onChange={(e) => handleInputChangeCheckedGroup(e, [N,P,M,A])} name={M} /></div>
            <div className="text-center"><input type="radio" checked={form[A]} onChange={(e) => handleInputChangeCheckedGroup(e, [N,P,M,A])} name={A} /></div>
        </>
    )
  }
  
  return (
    <div className="">
      <div className="max-w-[70%] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Test de Fatiga y Somnolencia</h1>
        {/* Tabs */}
        <div className="flex flex-col space-x-1 mt-4 border shadow p-8 mx-auto">
            <h1 className=" text-xl">Filiación</h1>
            <div className="flex flex-col border rounded p-4 mt-6 overflow-auto">
                <div className="flex items-center my-2 ">
                    <label className="w-20 text-right mr-2" htmlFor="">N° Orden:</label>
                    <input type="text" value={form.norden} name="norden" onChange={handleChangeNumber} className="border rounded px-2 py-1  " 
                    onKeyUp={(event) => {
                    if (event.key === "Enter")
                        handleClearnotO(),
                        VerifyTR(
                          form.norden,
                          tabla,
                          token,
                          setForm,
                          selectedSede
                        );
                    }} />
                    <label className="w-20 text-right mr-2" htmlFor="">Fecha:</label>
                    <input type="date" value={form.fexamen} name="fexamen" onChange={handleChange} className="border rounded px-2 py-1  " />
                </div>
                <div className="flex items-center my-2">
                    <label className="w-20 text-right mr-2" htmlFor="">Nombres:</label>
                    <input type="text" value={form.nombres} disabled className="border rounded px-2 py-1 min-w-[38%] " />
                    <label className="w-20 text-right mr-2" htmlFor="">DNI:</label>
                    <input type="text" value={form.dni} disabled className="border rounded px-2 py-1  " />
                    <label className="w-20 text-right mr-2" htmlFor="">Edad:</label>
                    <input type="text" value={form.edad} disabled className="border rounded px-2 py-1 w-20" />
                    <label className="w-20 text-right mr-2" htmlFor="">Sexo:</label>
                    <input type="text" disabled value={form.sexoPa === "F" ? "FEMENINO" : form.sexoPa === "M" ? "MASCULINO" : ""} className="border rounded px-2 py-1" />
                </div>
                <div className="flex items-center my-2">
                    <label className="w-20 text-right mr-2" htmlFor="">Area de Trabajo:</label>
                    <input type="text" value={form.areaO} disabled className="border rounded px-2 py-1 w-[38%] " />
                    <label className="w-20 text-right ml-4 mr-2" htmlFor="">Empresa:</label>
                    <input type="text" value={form.razonEmpresa} disabled className="border rounded px-2 py-1 w-[38%] " />
                </div>
            </div>
            {/* Tabs */}
        <div className="flex space-x-1 overflow-x-auto mt-4">
            <button
              className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap bg-[#233245] text-white `}
            >
              <FontAwesomeIcon icon={faTint} className="mr-2" />
              Examen
            </button>
        </div>

        {/* Active Content */}
          <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
              <h1 className="text-blue-800 font-bold">SITUACIÓN</h1>
                <div className="border-2 flex border-blue-900 p-2 justify-center">
                    <div className="grid grid-cols-[5fr,1fr,1fr,1fr,1fr,1fr,1fr] gap-2 items-center ">
                        {/* Encabezados */}
                        <div className="col-span-2"></div>
                        <div className="text-center font-bold text-blue-800">Nunca</div>
                        <div className="text-center font-bold text-blue-800">Poca</div>
                        <div className="text-center font-bold text-blue-800">Moderada</div>
                        <div className="text-center font-bold text-blue-800">Alta</div>
                        <div className=""></div>
                        {/* Pregunta 1 */}
                        <RowCheck title={"1. Sentado leyendo"}  
                        N="rbs1Nunca" 
                        P="rbs1Poca" 
                        M="rbs1Moderada" 
                        A="rbs1Alta" />
                        

                        {/* Pregunta 2 */}
                        <RowCheck title={"2. Viendo televisión"}
                         N="rbs2Nunca" 
                        P="rbs2Poca" 
                        M="rbs2Moderada" 
                        A="rbs2Alta"/>

                        {/* Pregunta 3 */}
                        <RowCheck title={"3. Sentado (por ejemplo en el teatro, en una reunión, en el cine, en una conferencia, escuchando misa o en el culto)"}
                         N="rbs3Nunca" 
                        P="rbs3Poca" 
                        M="rbs3Moderada" 
                        A="rbs3Alta"/>

                        {/* Pregunta 4 */}
                        <RowCheck title={"4. Como pasajero en un automóvil, ómnibus, micro o combi durante una hora o menos de recorrido"}
                         N="rbs4Nunca" 
                        P="rbs4Poca" 
                        M="rbs4Moderada" 
                        A="rbs4Alta"/>

                        {/* Pregunta 5 */}
                        <RowCheck title={"5. Recostado en la tarde si las circunstancias lo permiten"}
                         N="rbs5Nunca" 
                        P="rbs5Poca" 
                        M="rbs5Moderada" 
                        A="rbs5Alta"/>
                        <div className="flex flex-col justify-center items-center">
                            <label htmlFor="">PUNTAJE</label>
                            <input type="text" value={form.txtPuntaje} onChange={handleChange} name="txtPuntaje" className="w-24 border rounded px-2 py-1" />
                        </div>

                        {/* Pregunta 6 */}
                        <RowCheck title={"6. Sentado conversando con alguien"}
                         N="rbs6Nunca" 
                        P="rbs6Poca" 
                        M="rbs6Moderada" 
                        A="rbs6Alta"/>

                        {/* Pregunta 7 */}
                        <RowCheck title={"7. Sentado luego del almuerzo y sin haber bebido"}
                         N="rbs7Nunca" 
                        P="rbs7Poca" 
                        M="rbs7Moderada" 
                        A="rbs7Alta"/>

                        {/* Pregunta 8 */}
                        <RowCheck title={"8. Conduciendo el automóvil cuando se detiene algunos minutos por razones de tráfico"}
                         N="rbs8Nunca" 
                        P="rbs8Poca" 
                        M="rbs8Moderada" 
                        A="rbs8Alta"/>

                        {/* Pregunta 9 */}
                        <RowCheck title={"9. Parado y apoyándose o no en una pared o mueble"}
                         N="rbs9Nunca" 
                        P="rbs9Poca" 
                        M="rbs9Moderada" 
                        A="rbs9Alta"/>
                        
                    </div>
                </div>  
                <div className="flex flex-col justify-center items-center my-6">
                    <h1 className="text-blue-800 font-bold text-left">Pregunta Obligatoria</h1>
                    <div className="flex items-center justify-center">
                        <label className="w-[60%] " htmlFor="">Usted maneja vehículos motorizados (auto, camioneta, ómnibus, combi, montacarga, grúa, etc).</label>
                        <label className="text-xl" htmlFor="">Si</label>
                        <input type="checkbox" checked={form.rbSi} name="rbSi" onChange={(e) => handleInputChangeCheckedGroup(e, ["rbSi","rbNo"])} id="" className=" mx-3"/>
                        <label className="text-xl" htmlFor="">No</label>
                        <input type="checkbox" checked={form.rbNo} name="rbNo" onChange={(e) => handleInputChangeCheckedGroup(e, ["rbSi","rbNo"])} id="" className=" mx-3"/>
                    </div>
                </div>
                <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
                    <h1 className="text-blue-800 font-bold">GRABAR / ACTUALIZAR</h1>
                    <div className="flex gap-2 justify-around">
                      <div className="flex flex-col p-2 ">
                        <label htmlFor="">Nombre y Apellidos del Médico - N° de Colegiatura:</label>
                        <input type="text" value={form.txtMedico} name="txtMedico"  className="w-full border rounded px-2 py-1 mt-2" />
                      </div>
                      <div className="flex flex-col p-2 ">
                          <button
                          type="button"
                          onClick={() => SubmitTestFatiga(form,token,userlogued,handleClear,tabla, datosFooter)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                          >
                              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                          </button>
                          <button
                              type="button"
                              onClick={handleClear}
                              className="bg-yellow-400 mt-2 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                          >
                          <FontAwesomeIcon icon={faBroom} /> Limpiar
                          </button>
                      </div>
                      <div className="flex flex-col p-2 ">
                        <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                        <div className="flex items-center gap-2">
                            <input
                            name="norden"
                            value={form.norden}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 text-base"
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
          </div>

          
        </div>



      </div>
    </div>
  );
};

export default Test_fatiga;

