import { useEffect, useState } from "react";
import OdontogramaAdultos from "./OdontogramaAdultos";
import OdontologiaReportes from "./OdontologiaReportes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faClipboardList,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  getInfoTabla,
  PrintConsultaEjecutada,
  PrintHojaR,
  SubmitDataService,
  SubmitDataServiceLO,
  VerifyTR,
} from "./controllerOdontologia";
import OdontogramaLevantarObservacion from "./OdontogramaLevantarObservacion";
import Swal from "sweetalert2";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";

const tabla = "odontograma";
const tablaLO = "odontograma_lo";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormState = {
  norden: "",
  codOd: null,
  fechaExam: today,
  nombres: "",
  sexo: "",
  edad: "",
  empresa: "",
  contrata: "",

  d1: "Normal",
  d2: "Normal",
  d3: "Normal",
  d4: "Normal",
  d5: "Normal",
  d6: "Normal",
  d7: "Normal",
  d8: "Normal",
  d9: "Normal",
  d10: "Normal",
  d11: "Normal",
  d12: "Normal",
  d13: "Normal",
  d14: "Normal",
  d15: "Normal",
  d16: "Normal",
  d17: "Normal",
  d18: "Normal",
  d19: "Normal",
  d20: "Normal",
  d21: "Normal",
  d22: "Normal",
  d23: "Normal",
  d24: "Normal",
  d25: "Normal",
  d26: "Normal",
  d27: "Normal",
  d28: "Normal",
  d29: "Normal",
  d30: "Normal",
  d31: "Normal",
  d32: "Normal",

  ausente: 0,
  cariada: 0,
  porExtraer: 0,
  fracturada: 0,
  corona: 0,
  obturacion: 0,
  puente: 0,
  pprMetalica: 0,
  pprAcrilica: 0,
  pTotal: 0,
  normal: 32,
  malEstado: 0,

  observaciones: "",
  noPasoExamen: false,

  nombres_search: "",
  codigo_search: "",
  fechaDesde: today,
  fechaHasta: today,
  filtroOcupacional: true,
  filtroClientesConsulta: false,
};

const initialFormStateLO = {
  norden: "",
  fechaExam: today,
  nombres: "",
  sexo: "",
  edad: "",
  empresa: "",
  contrata: "",

  d1: "Normal",
  d2: "Normal",
  d3: "Normal",
  d4: "Normal",
  d5: "Normal",
  d6: "Normal",
  d7: "Normal",
  d8: "Normal",
  d9: "Normal",
  d10: "Normal",
  d11: "Normal",
  d12: "Normal",
  d13: "Normal",
  d14: "Normal",
  d15: "Normal",
  d16: "Normal",
  d17: "Normal",
  d18: "Normal",
  d19: "Normal",
  d20: "Normal",
  d21: "Normal",
  d22: "Normal",
  d23: "Normal",
  d24: "Normal",
  d25: "Normal",
  d26: "Normal",
  d27: "Normal",
  d28: "Normal",
  d29: "Normal",
  d30: "Normal",
  d31: "Normal",
  d32: "Normal",

  ausente: 0,
  cariada: 0,
  porExtraer: 0,
  fracturada: 0,
  corona: 0,
  obturacion: 0,
  puente: 0,
  pprMetalica: 0,
  pprAcrilica: 0,
  pTotal: 0,
  normal: 32,
  malEstado: 0,

  observaciones: "",
};

export default function Odontologia() {
  const {
    form,
    setForm,
    handleChange,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const { token, userlogued, selectedSede, datosFooter } = useSessionData();

  const {
    form: formLO,
    setForm: setFormLO,
    handleChange: handleChangeLO,
    handleClear: handleClearLO,
    handleClearnotO: handleClearnotOLO,
  } = useForm(initialFormStateLO);

  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataTabla, setDataTabla] = useState([]);

  const changeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    handleClearLO();
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEjecutarConsulta = () => {
    Swal.fire({
      title: "¿Desea Imprimir Consulta?",
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
        PrintConsultaEjecutada(
          form.fechaDesde,
          form.fechaHasta,
          token,
          datosFooter
        );
      }
    });
  };

  const handleSaveLO = () => {
    SubmitDataServiceLO(
      formLO,
      token,
      userlogued,
      handleClearLO,
      tablaLO,
      closeModal,
      datosFooter
    );
  };
  useEffect(() => {
    obtenerInfoTabla();
  }, []);

  const obtenerInfoTabla = () => {
    getInfoTabla(form.nombres_search, form.codigo_search, setDataTabla, token);
  };

  return (
    <div className="w-full  mx-auto bg-white p-6">
      <h2 className="text-2xl font-bold text-center mb-6">ODONTOLOGÍA</h2>
      <div className="mx-auto bg-white rounded-lg overflow-hidden relative mt-6">
        <div className="container mx-auto mt-1 mb-12 px-4 sm:px-6 lg:px-8">
          <div className="pt-4">
            {/*superior*/}
            <div className="border p-6 rounded mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-semibold">N° Orden :</label>
                  <input
                    name="norden"
                    value={form.norden || ""}
                    onChange={handleChange}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        handleClearnotO();
                        VerifyTR(
                          form.norden,
                          tabla,
                          token,
                          setForm,
                          selectedSede
                        );
                      }
                    }}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Fecha de Examen :</label>
                    <input
                      name="fechaExam"
                      type="date"
                      value={form.fechaExam}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                  <div className="flex flex-1 mt-auto">
                    <button
                      type="button"
                      disabled={form.codOd == null}
                      onClick={() => {
                        openModal();
                        setFormLO((prev) => ({ ...prev, norden: form.norden }));
                      }}
                      className={`px-3 h-[22px] rounded flex items-center w-full justify-center transition-colors duration-200 my-auto
                                ${
                                  form.codOd == null
                                    ? "bg-gray-300 text-gray-500 "
                                    : "bg-green-200 hover:bg-green-300 text-green-800 cursor-pointer"
                                }`}
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={`mr-2 ${
                          form.codOd == null
                            ? "text-gray-500"
                            : "text-green-800"
                        }`}
                      />
                      <p className="">LEVANTAR OBSERVACION</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Nombres :</label>
                  <input
                    name="nombres"
                    value={form.nombres || ""}
                    disabled
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Sexo :</label>
                    <input
                      name="sexo"
                      value={form.sexo}
                      disabled
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Edad :</label>
                    <input
                      name="edad"
                      value={form.edad}
                      disabled
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold">Empresa :</label>
                  <input
                    name="empresa"
                    value={form.empresa || ""}
                    disabled
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold">Contrata :</label>
                  <input
                    name="contrata"
                    value={form.contrata || ""}
                    disabled
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1">
              <div
                className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold  cursor-pointer   focus:outline-none flex items-center whitespace-nowrap ${
                  activeTab === 1
                    ? "bg-[#233245] text-white font-bold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${activeTab === 1 ? "border-b-0" : "border-b"}`}
                onClick={() => changeTab(1)}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Odontograma Adultos
              </div>
              <div
                className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold cursor-pointer  focus:outline-none flex items-center whitespace-nowrap ${
                  activeTab === 2
                    ? "bg-[#233245] text-white font-bold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${activeTab === 2 ? "border-b-0" : "border-b"}`}
                onClick={() => changeTab(2)}
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Reportes
              </div>
            </div>

            {/* Contenido de los tabs */}
            {activeTab === 1 && (
              <OdontogramaAdultos
                form={form}
                setForm={setForm}
                handleChange={handleChange}
                handleCheckBoxChange={handleCheckBoxChange}
                handleClear={handleClear}
                handleSave={handleSave}
                handlePrint={handlePrint}
              />
            )}
            {activeTab === 2 && (
              <OdontologiaReportes
                form={form}
                setForm={setForm}
                handleChange={handleChange}
                handleEjecutarConsulta={handleEjecutarConsulta}
                tabla={tabla}
                token={token}
                handleClear={handleClear}
                dataTabla={dataTabla}
                setActiveTab={setActiveTab}
                obtenerInfoTabla={obtenerInfoTabla}
                selectedSede={selectedSede}
                datosFooter={datosFooter}
              />
            )}
          </div>
        </div>

        {/* Modal Levantar Observación */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg px-2 w-full max-h-[95%] mx-4 ">
              <OdontogramaLevantarObservacion
                form={formLO}
                setForm={setFormLO}
                handleChange={handleChangeLO}
                closeModal={closeModal}
                token={token}
                selectedSede={selectedSede}
                handleClear={handleClearLO}
                handleClearnotO={handleClearnotOLO}
                handleSave={handleSaveLO}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
