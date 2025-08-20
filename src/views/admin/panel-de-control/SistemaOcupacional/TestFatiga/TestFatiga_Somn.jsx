import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faTint,
  faHeartbeat,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import Swal from "sweetalert2";

import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";


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

  const RowCheck = ({title}) => {
    return(
        <>
            <div className="col-span-2">{title}</div>
            <div className="text-center"><input type="radio" name="p1" /></div>
            <div className="text-center"><input type="radio" name="p1" /></div>
            <div className="text-center"><input type="radio" name="p1" /></div>
            <div className="text-center"><input type="radio" name="p1" /></div>
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
            <div className="flex flex-col border rounded p-4 mt-6">
                <div className="flex items-center my-2 ">
                    <label className="w-[5%] text-right mr-2" htmlFor="">N° Orden:</label>
                    <input type="text" className="border rounded px-2 py-1  " />
                    <label className="w-[5%] text-right mr-2" htmlFor="">Fecha:</label>
                    <input type="date" className="border rounded px-2 py-1  " />
                </div>
                <div className="flex items-center my-2">
                    <label className="w-[5%] text-right mr-2" htmlFor="">Nombres:</label>
                    <input type="text" className="border rounded px-2 py-1 w-[38%] " />
                    <label className="w-[5%] text-right mr-2" htmlFor="">DNI:</label>
                    <input type="text" className="border rounded px-2 py-1  " />
                    <label className="w-[5%] text-right mr-2" htmlFor="">Edad:</label>
                    <input type="text" className="border rounded px-2 py-1 w-[5%]" />
                    <label className="w-[5%] text-right mr-2" htmlFor="">Sexo:</label>
                    <input type="text" className="border rounded px-2 py-1" />
                </div>
                <div className="flex items-center my-2">
                    <label className="w-[5%] text-right mr-2" htmlFor="">Area de Trabajo:</label>
                    <input type="text" className="border rounded px-2 py-1 w-[38%] " />
                    <label className="w-[5%] text-right ml-4 mr-2" htmlFor="">Empresa:</label>
                    <input type="text" className="border rounded px-2 py-1 w-[38%] " />
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
                    <RowCheck title={"1. Sentado leyendo"}/>
                    

                    {/* Pregunta 2 */}
                    <RowCheck title={"2. Viendo televisión"}/>

                    {/* Pregunta 3 */}
                    <RowCheck title={"3. Sentado (por ejemplo en el teatro, en una reunión, en el cine, en una conferencia, escuchando misa o en el culto)"}/>

                    {/* Pregunta 4 */}
                    <RowCheck title={"4. Como pasajero en un automóvil, ómnibus, micro o combi durante una hora o menos de recorrido"}/>

                    {/* Pregunta 5 */}
                    <RowCheck title={"5. Recostado en la tarde si las circunstancias lo permiten"}/>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="">PUNTAJE</label>
                        <input type="text" className="w-24" />
                    </div>

                    {/* Pregunta 6 */}
                    <RowCheck title={"6. Sentado conversando con alguien"}/>

                    {/* Pregunta 7 */}
                    <RowCheck title={"7. Sentado luego del almuerzo y sin haber bebido"}/>

                    {/* Pregunta 8 */}
                    <RowCheck title={"8. Conduciendo el automóvil cuando se detiene algunos minutos por razones de tráfico"}/>

                    {/* Pregunta 9 */}
                    <RowCheck title={"9. Parado y apoyándose o no en una pared o mueble"}/>
                    
                </div>
            </div>  
            <div className="flex flex-col justify-center items-center my-6">
                <h1 className="text-blue-800 font-bold text-left">Pregunta Obligatoria</h1>
                <div className="flex items-center justify-center">
                    <label className="w-[60%] " htmlFor="">Usted maneja vehículos motorizados (auto, camioneta, ómnibus, combi, montacarga, grúa, etc).</label>
                    <label className="text-xl" htmlFor="">Si</label>
                    <input type="checkbox" name="pregunta1EspaldaBajaNo" id="" className=" mx-3"/>
                    <label className="text-xl" htmlFor="">No</label>
                    <input type="checkbox" name="pregunta1EspaldaBajaSi" id="" className=" mx-3"/>
                </div>
            </div>
        </div>
        </div>



      </div>
    </div>
  );
};

export default Test_fatiga;

Test_fatiga.propTypes = {
  token: PropTypes.string.isRequired,
  selectedSede: PropTypes.string.isRequired,
  userlogued: PropTypes.object.isRequired,
  userDatos: PropTypes.shape({
    datos: PropTypes.shape({
      dni_user: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
