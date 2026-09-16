import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faTint,
  faHeartbeat,
  faSave,
  faBroom,
  faPrint,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { getFetch } from "../../getFetch/getFetch";
import Parenquimatosas from "./Parenquimatosas/Parenquimatosas";
import Pleurales from "./Pleurales/Pleurales";
import Engrosamiento from "./Engrosamiento/Engrosamiento";
import { useState } from "react";
import {
  handleSubirArchivo,
  handleSubirArchivoMasivo,
  PrintHojaR,
  PrintHojaSinDatos,
  ReadArchivosForm,
  SubmitOIT,
  VerifyTR,
} from "./controller/OIT_controller";
import Swal from "sweetalert2";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import { useSessionData } from "../../../../hooks/useSessionData";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { getOITInitialFormState } from "./oitFormDefaults";
import CargaMasivaOIT from "./CargaMasivaOIT/CargaMasivaOIT";
const tabla = "oit";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const OIT = () => {

  const { token, userlogued, selectedSede, userName, userDNI } = useSessionData();

  const [activeTab, setActiveTab] = useState(0);
  //const tabsConPermiso = tabs.filter(tab => permiso(tab.vista, tab.permiso));
  const [form, setForm] = useState(
    getOITInitialFormState({ today, userlogued, userName, userDNI })
  );
  const [modalCargaMasiva, setModalCargaMasiva] = useState(false);

  const handleClean = () => {
    setForm(getOITInitialFormState({ today, userlogued, userName, userDNI }));
  };
  console.log(form);
  const tabs = [
    {
      label: "Parenquimatosas",
      icon: faMicroscope,
      component: (
        <Parenquimatosas
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
    {
      label: "Pleurales",
      icon: faTint,
      component: (
        <Pleurales
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
    {
      label: "Engrosamiento",
      icon: faHeartbeat,
      component: (
        <Engrosamiento
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
  ];

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleChangeSimple = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };


  const handleset = () => {
    const defaults = getOITInitialFormState({ today, userlogued, userName, userDNI });
    setForm((prev) => ({
      ...prev,
      ...defaults,
      norden: prev.norden,
      aPruebaDeSoledad: prev.aPruebaDeSoledad,
      SinDatos: prev.SinDatos,
      nombre_medico: prev.nombre_medico,
      user_medicoFirma: prev.user_medicoFirma,
    }));
  };

  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    if (form.SinDatos) {
      Swal.fire({
        title: "¿Desea Imprimir OIT SIN DATOS?",
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
          PrintHojaSinDatos(form.norden, token, tabla);
        }
      });
    } else {
      Swal.fire({
        title: "¿Desea Imprimir OIT?",
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
    }
  };

  const [visualerOpen, setVisualerOpen] = useState(null)

  return (
    <div className="">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">OIT</h1>
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setModalCargaMasiva(true)}
            className="verde-btn px-4 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faUpload} /> Carga Masiva
          </button>
        </div>
        <div className=" border rounded-md p-4 shadow-sm bg-white">
          <div className="flex flex-col space-y-3">
            {/*1ra fila*/}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/*Norden*/}
              <div className="flex items-center gap-4 ">
                <label className="font-semibold max-w-[65px] min-w-[65px]">
                  N° Orden:
                </label>
                <input
                  type="text"
                  name="norden"
                  value={form.norden}
                  onChange={handleInputChange}
                  id="norden"
                  className="border rounded px-2 py-1 w-full"
                  onKeyUp={(event) => {
                    if (event.key === "Enter")
                      handleset(),
                        VerifyTR(
                          form.norden,
                          tabla,
                          token,
                          setForm,
                          selectedSede
                        );
                  }}
                />
              </div>
              {/*Lector*/}
              <div className="flex items-center gap-4 lg:col-span-2">
                <label className="font-semibold max-w-[65px] min-w-[65px]">
                  Lector:
                </label>
                <input
                  type="text"
                  name="lector"
                  value={form.doctor}
                  id="lector"
                  disabled
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              {/*Nro Placa*/}
              <div className="flex items-center gap-4">
                <label className="font-semibold max-w-[65px] min-w-[65px]">
                  Nro Placa:
                </label>
                <input
                  type="text"
                  name="placa"
                  id="placa"
                  value={form.nplaca}
                  disabled
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>
            {/*2da fila */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-4 md:col-span-2">
                <label className="font-semibold max-w-[65px] min-w-[65px]">
                  Nombre:
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={form.nombres}
                  onChange={handleInputChange}
                  disabled
                  id="nombres"
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold max-w-[65px] min-w-[65px]">
                  Edad:
                </label>
                <input
                  type="text"
                  name="edad"
                  id="edad"
                  value={form.edad}
                  onChange={handleInputChange}
                  disabled
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <label className="flex gap-2 font-semibold ">
                Sin Datos:
                <input
                  checked={form.SinDatos}
                  onChange={() => {
                    setForm((prev) => ({ ...prev, SinDatos: !form.SinDatos }));
                  }}
                  type="checkbox"
                  name="SinDatos"
                  id="SinDatos"
                  className="ml-[28px]"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-4">
                <label className="font-semibold max-w-[65px] min-w-[65px] ">
                  Fecha de Lectura:
                </label>
                <input
                  type="date"
                  name="flectura"
                  value={form.flectura}
                  onChange={handleInputChange}
                  id="flectura"
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              {/* <span className="text-sm text-gray-500 mt-1 mr-4">
                Día - Mes - Año
              </span> */}
              <div className="flex items-center gap-4">
                <label className="font-semibold max-w-[65px] min-w-[65px] ">
                  Fecha de Radiografia:
                </label>
                <input
                  type="date"
                  name="fradiografia"
                  value={form.fradiografia}
                  onChange={handleInputChange}
                  id="fradiografia"
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              {/* <span className="text-sm text-gray-500 mt-1 mr-4">
                Día - Mes - Año
              </span> */}
              <ButtonsPDF
                {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token, form.nomenclatura) } } : {}}
                {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
                handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token, form.nomenclatura) }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 overflow-x-auto mt-4">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${activeTab === idx
                ? "bg-[#233245] text-white font-bold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
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



        {/* Active Content */}
        <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
          {tabs[activeTab].component}
        </div>

        <SectionFieldset legend="Asignación de Médico">
          <EmpleadoComboBox
            value={form.nombre_medico}
            label="Especialista"
            form={form}
            onChange={handleChangeSimple}
          />
        </SectionFieldset>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 px-4">
          <div className="flex gap-4">
            {form.aPruebaDeSoledad && (
              <button
                type="button"
                onClick={() => {

                  SubmitOIT(form, token, userlogued, handleClean, tabla);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
              </button>
            )}
            <button
              type="button"
              onClick={handleClean}
              className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
          {/* <div className="flex gap-1 items-center">
            <label htmlFor="">Imprimir: </label>
            <input
              className="border rounded px-2 py-1 w-24"
              name="norden"
              value={form.norden}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors"
            >
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div> */}

          <div className="flex flex-col items-end">
            <span className="font-bold italic text-base mb-1">Imprimir</span>
            <div className="flex items-center gap-2">
              <input
                name="norden"
                value={form.norden}
                onChange={handleInputChange}
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

      {modalCargaMasiva && (
        <CargaMasivaOIT
          onClose={() => setModalCargaMasiva(false)}
          token={token}
          userlogued={userlogued}
          userName={userName}
          userDNI={userDNI}
          tabla={tabla}
          sede={selectedSede}
        />
      )}
    </div>
  );
};

export default OIT;
