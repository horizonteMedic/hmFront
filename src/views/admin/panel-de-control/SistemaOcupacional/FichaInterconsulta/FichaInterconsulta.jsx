import { faSave, faBroom, faPrint, faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import useRealTime from "../../../../hooks/useRealTime";
import { useForm } from "../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaInterconsulta";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import Swal from "sweetalert2";
import {SubirInterconsulta, ReadArchivos} from "./model";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { useState } from "react";
import { SubmitData } from "../../../../utils/apiHelpers";

const tabla = "ficha_interconsulta"
const today = getToday();

const Especialidades = [
  "Neurología del Sueño",
  "Neurocirugia",
  "Alergología",
  "Neurología",
  "Cirugía General",
  "Cirugía Cardiologo",
  "Cirugía Cabeza y Cuello",
  "Gastroenterología",
  "Fisiatria",
  "Medicina Fisica",
  "Oncologia",
  "Cirugía Oncológica",
  "Hematología",
  "Ginecologia",
  "Oftalmología",
  "Cardiología",
  "Neumología",
  "Medicina Interna",
  "Endocrinología",
  "Traumatología",
  "Reumatología",
  "Nutrición",
  "Otorrinolaringologia"
]

export default function FichaInterconsulta() {

    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();
    const [visualerOpen, setVisualerOpen] = useState(null)
    const Initialform = {
        norden: "",
        fechaExamen: today,
        especialidad: "",
        cargoPaciente: "",
        //Datos Usuario
        dniPaciente: "",
        dniUser: userCompleto?.datos?.dni_user,
        nombres: "",
        sexo: "",
        fechaNacimientoPaciente: "",
        edadPaciente: "",
        //Funciones Vitales
        frecuenciaCardiaca: "",
        PA: "",
        frecuenciaRespiratoriaTriaje: "",
        imcTriaje: "",
        saturacionOxigenoTriaje: "",
        temperatura: "",
        peso: "",
        tallaTriaje: "",

        contrata: "",
        empresa: "",
        //Medico
        nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
        cmpUsuario: "",
        direccionClinica: "",
        //Cuadros
        motivo: "SE SOLICITA EVALUACION POR ESPECIALIDAD PARA DIAGNOSTICO, TRATAMIENTO, CONTROLES POSTERIORES Y DEFINIR APTITUD PARA ELABORAR",
        hallazgo: "",
        diagnostico: "",
        tratamiento: "",
        apto: false,
        SubirDoc: false,
        nomenclatura: "",
        orden: "",
        NewNomenclatura: ""
    }

    const { form, setForm, handleChangeSimple, handleChange, handleClear, handleClearnotO, handleChangeNumber, handleRadioButtonBoolean, handleRadioButton, handlePrintDefault } = useForm(Initialform, { storageKey: "ficha_interconsultas_form" })
    console.log(form.codigoFichaInterconsulta)
                   

    const handleClearnotOandEspecialidad = () => {
        setForm((prev) => ({ ...Initialform, norden: prev.norden }));
        if (typeof window !== "undefined" && "ficha_interconsultas_form") {
        try {
            localStorage.setItem("ficha_interconsultas_form", JSON.stringify({ ...Initialform, norden: form.norden }));
        } catch (err) {
            console.warn("useForm: error guardando localStorage en clearnotO", err);
        }
        }
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotOandEspecialidad();
            VerifyTR(form.norden, form.especialidad, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        if (!form.norden) {
            Swal.fire("Error","Debe colocar un Numero de Orden",'error')
            return
        }
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const handleSave = () => {
        if (!form.especialidad) return Swal.fire("Error","Debe solucionar al menos una especialidad","error")
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
        console.log("Guardando datos:", form);
    };

    const handleSubirArchivo = async () => {
        const { value: file } = await Swal.fire({
        title: "Selecciona un archivo PDF",
        input: "file",
        inputAttributes: {
            accept: "application/pdf", // solo PDF
            "aria-label": "Sube tu archivo en formato PDF"
        },
        showCancelButton: true,
        confirmButtonText: "Subir",
        cancelButtonText: "Cancelar",
        inputValidator: (file) => {
            if (!file) return "Debes seleccionar un archivo.";
            if (file.type !== "application/pdf") return "Solo se permiten archivos PDF.";
        },
        });

        if (file) {
        // Puedes convertirlo a Base64 si lo necesitas
        const reader = new FileReader();
        reader.onload = async (e)  => {
            LoadingDefault("Subiendo documento")
            const base64WithoutHeader = e.target.result.split(',')[1];
            const datos = {
                nombre: file.name,
                sede: selectedSede,
                base64:  base64WithoutHeader,
                nomenclatura: form.nomenclatura,
                norden: form.norden
            };
            const response = await SubirInterconsulta(datos, userlogued, token);
            if (response.id === 1) {
                const body = {
                    "codigoFichaInterconsulta": form.codigoFichaInterconsulta,
                    "nomenclatura": form.nomenclatura
                }
                const response = await SubmitData(body,'/api/v01/ct/fichaInterconsulta/actualizarNomenclaturaFichaInterconsulta',token)
                console.log(response)
                Swal.fire("Exito", "Archivo Subido con exto","success")
            } else {
                Swal.fire("Error", "No se pudo subir","error")
            }
            console.log(response)
        };
        reader.readAsDataURL(file);
        }
    };
    
    const ReadArchivosForm = async () => {
        LoadingDefault("Cargando Interconsulta")
        ReadArchivos(form.norden, form.nomenclatura)
        .then(response => {
            if (response.id === 1) {
                setVisualerOpen(response)
            }
            Swal.close()
        })
        .catch(error => {
            Swal.fire("Error","Ocurrio un Error al visualizar la interconsulta","error")
            throw new Error('Network response was not ok.', error);
        })
    }
   
    return (
        <>
            <div className="space-y-6 max-w-[95%] mx-auto">
                {/* Header */}
                <section className="bg-white border border-gray-200 rounded-lg p-4 w-full">
                    {/* Fila de inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        <InputTextOneLine label="N° Orden" value={form.norden} name="norden" onKeyUp={handleSearch} onChange={handleChangeNumber}  />
                        <InputTextOneLine label="Fecha de Examen" value={form.fechaExamen} onChange={handleChangeSimple} type="date" name="fechaExamen" />
                        <div className="flex items-center gap-4 w-full">
                            <label htmlFor="">Especialidades</label>
                            <select value={form.especialidad} name="especialidad" onChange={handleChangeSimple} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" >
                                <option value="">Selecione una Especialidad...</option>
                                {Especialidades?.sort((a, b) => a.localeCompare(b)) // ordena alfabéticamente respetando tildes
                                    .map((option, index) => (
                                    <option key={index} value={option.toUpperCase()}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/*<InputTextOneLine label="Especialidad" value={form.especialidad} onChange={handleChange} name="especialidad" />*/}
                        <InputTextOneLine label="Puesto de Trabajo" value={form.cargoPaciente} disabled onChange={handleChange} name="cargoPaciente" />
                    </div>

                    {/* Hora en tiempo real */}
                    <div className="flex justify-end mt-3">
                        <h1 className="text-lg font-bold">{useRealTime()}</h1>
                    </div>

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
  
                    

                    <div className="grid gap-4 mt-4 pt-4 border-t-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-center">
                        {/* DNI */}
                        <InputTextOneLine
                            label="DNI:"
                            labelWidth="40px"
                            value={form.dniPaciente}
                            disabled
                            name="dniPaciente"
                        />

                        {/* Nombres (debe expandirse más) */}
                        <InputTextOneLine
                            label="Nombres:"
                            labelWidth="70px"
                            value={form.nombres}
                            name="nombres"
                            disabled
                            className="lg:col-span-2"
                        />

                        {/* Sexo (campo pequeño) */}
                        <InputTextOneLine
                            label="Sexo:"
                            labelWidth="40px"
                            value={form.sexo}
                            name="sexo"
                            disabled
                            className="max-w-[120px]"
                            inputClassName="!w-[80px] text-center"
                        />

                        {/* Fecha de nacimiento */}
                        <InputTextOneLine
                            label="Fecha de Nacimiento"
                            value={form.fechaNacimientoPaciente}
                            disabled
                            name="fechaNacimientoPaciente"
                        />

                        {/* Edad (campo pequeño) */}
                        <InputTextOneLine
                            label="Edad:"
                            labelWidth="40px"
                            value={form.edadPaciente}
                            disabled
                            name="edadPaciente"
                            className="max-w-[100px]"
                            inputClassName="!w-[70px] text-center"
                        />
                        
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <InputTextOneLine label="Emp. Contratista" value={form.contrata} disabled name="contrata" />
                        <InputTextOneLine label="Empresa" value={form.empresa} disabled name="empresa" />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <InputTextOneLine label="Area de Trabajo" value={form.areaPaciente} disabled name="contrata" />
                        <InputTextOneLine label="Puesto de Trabajo" value={form.cargoPaciente} disabled name="empresa" />
                    </div>

                </section>
                <h1 className="text-blue-600 font-semibold ">Funciones Vitales</h1>
                <section className="bg-white border border-gray-200 rounded-lg mt-0 p-4 w-full">
                    {/* Checkboxes en grid responsivo */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mt-4 items-center">
                        {/* F.C */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="F.C"
                            labelWidth="30px"
                            disabled
                            value={form.frecuenciaCardiaca}
                            className="min-w-[90px] w-full !gap-1"
                            name="fc"
                            />
                            <span className="text-sm text-gray-600">x min</span>
                        </div>

                        {/* P.A */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="P.A"
                            labelWidth="30px"
                            value={form.PA}
                            disabled
                            className="min-w-[90px] w-full !gap-1"
                            name="pa"
                            />
                            <span className="text-sm text-gray-600">mmHg</span>
                        </div>

                        {/* F.R */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="F.R"
                            labelWidth="30px"
                            disabled
                            value={form.frecuenciaRespiratoriaTriaje}
                            className="min-w-[90px] w-full !gap-1"
                            name="fr"
                            />
                            <span className="text-sm text-gray-600">x min</span>
                        </div>

                        {/* IMC */}
                        <InputTextOneLine
                            label="IMC"
                            labelWidth="30px"
                            value={form.imcTriaje}
                            disabled
                            className="min-w-[90px] w-full !gap-1"
                            name="imc"
                        />

                        {/* Sat. O2 */}
                        <InputTextOneLine
                            label="Sat. O°"
                            labelWidth="45px"
                            value={form.saturacionOxigenoTriaje}
                            disabled
                            className="min-w-[90px] w-full !gap-1"
                            name="sat"
                        />

                        {/* T° */}
                        <InputTextOneLine
                            label="T°"
                            value={form.temperatura}
                            disabled
                            labelWidth="25px"
                            className="min-w-[90px] w-full !gap-1"
                            name="temperatura"
                        />

                        {/* Peso */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="Peso"
                            value={form.peso}
                            disabled
                            labelWidth="40px"
                            className="min-w-[90px] w-full !gap-1"
                            name="peso"
                            />
                            <span className="text-sm text-gray-600">Kg</span>
                        </div>

                        {/* Talla */}
                        <div className="flex items-center gap-1">
                            <InputTextOneLine
                            label="Talla"
                            value={form.tallaTriaje}
                            disabled
                            labelWidth="45px"
                            className="min-w-[90px] w-full !gap-1"
                            name="talla"
                            />
                            <span className="text-sm text-gray-600">m</span>
                        </div>
                    </div>
                </section>

                <h1 className="text-blue-600 font-semibold ">Médico</h1>
                <section className="bg-white border border-gray-200 rounded-lg mt-0 p-4 w-full">
                    {/* Checkboxes en grid responsivo */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                        {/* Nombre Completo (más grande, ocupa 2 columnas en pantallas medianas o grandes) */}
                        <div className="sm:col-span-2">
                            <InputTextOneLine label="Nombre Completo" value={form.nombre_medico} disabled name="nombre_medico" />
                        </div>

                        {/* CMP (pequeño) */}
                        <div className="sm:col-span-1">
                            <InputTextOneLine label="CMP" value={form.cmpUsuario} disabled name="cmp" />
                        </div>

                    </div>
                </section>

                
                <section className="bg-white rounded-lg  my-4 w-full">
                    <div className="w-full flex justify-around items-center gap-4">
                        <InputTextArea
                            label="Motivo de Interconsulta"
                            rows={6}
                            value={form.motivo}
                            onChange={handleChange}
                            classNameLabel="text-blue-600"
                            name="motivo"
                        />

                        <InputTextArea
                            label="Hallazgos Relevantes"
                            value={form.hallazgo}
                            onChange={handleChange}
                            classNameLabel="text-blue-600"
                            rows={6}
                             classNameArea="bg-[#99FFFF]"
                            name="hallazgo"
                        />
                    </div>
                </section>
                <section className="bg-white rounded-lg my-2 w-full">
                    <div className="w-full flex justify-around items-start gap-4">
                        <div className="flex flex-col items-start w-full">
                            <InputTextArea
                                label="Diagnostico"
                                value={form.diagnostico}
                                onChange={handleChange}
                                rows={6}
                                classNameLabel="text-blue-600"
                                name="diagnostico"
                                classNameArea="bg-[#99FFFF]"
                            />
                        </div>
                        
                        <div className="flex flex-col w-full">
                            <InputTextArea
                                label="Tratamiento"
                                value={form.tratamiento}
                                onChange={handleChange}
                                classNameLabel="text-blue-600"
                                rows={6}
                                name="tratamiento"
                                classNameArea="bg-[#99FFFF]"
                            />
                            
                            <div className="flex  p-3 mt-4 text-lg items-center font-bold rounded-lg justify-between">
                                <div className="flex justify-between gap-1 p-2 border">
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                                    </button>
                                </div>
                                <div className="flex justify-center gap-1 text-center p-2 border items-center">
                                    <span className="font-bold italic text-base mb-1 mx-4">IMPRIMIR</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            name="norden"
                                            value={form.norden}
                                            onChange={handleChangeNumber}
                                            className="border rounded px-2 py-1 text-base w-24"
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
                </section>
                {visualerOpen && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
                        <div className="px-4 py-2 naranjabackgroud flex justify-between">
                            <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
                            <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
                        </div>
                        <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
                            <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`}  type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
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
        </>
    )
}
