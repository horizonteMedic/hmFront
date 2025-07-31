import React, { useState } from "react";
import OdontogramaAdultos from "./OdontogramaAdultos";
import OdontologiaReportes from "./OdontologiaReportes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faClipboardList,
  faExpand,
  faCheck,
  faTimes,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const Odontologia = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [observacionText, setObservacionText] = useState("");

  const changeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setObservacionText("");
  };

  const handleLevantarObservacion = () => {
    if (observacionText.trim()) {
      console.log("Levantando observación:", observacionText);
      // Aquí puedes agregar la lógica para guardar la observación
      closeModal();
    }
  };

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.log(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
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
                    // value={form.norden || ""}
                    // onChange={handleChange}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        // handleClearnotO();
                        // VerifyTR(
                        //   form.norden,
                        //   tabla,
                        //   token,
                        //   setForm,
                        //   selectedSede
                        // );
                      }
                    }}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Fecha de Examen :</label>
                    <input
                      name="fechaExamen"
                      type="date"
                      // value={form.fechaExamen}
                      // onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                  <div className="flex flex-1 mt-auto">
                    <button
                      type="button"
                      // disabled={form.codOf == null}
                      // onClick={() => {
                      //   setShowModal(true);
                      //   setForm2((prev) => ({ ...prev, norden: form.norden }));
                      // }}
                      className={`px-3 h-[22px] rounded flex items-center w-full justify-center transition-colors duration-200 my-auto
                                ${
                                  true
                                    ? "bg-gray-300 text-gray-500 "
                                    : "bg-green-200 hover:bg-green-300 text-green-800 cursor-pointer"
                                }`}
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={`mr-2 ${
                          true ? "text-gray-500" : "text-green-800"
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
                    // value={form.nombres || ""}
                    disabled
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Sexo :</label>
                    <input
                      name="sexo"
                      // value={form.sexo}
                      disabled
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Edad :</label>
                    <input
                      name="edad"
                      // value={form.edad}
                      disabled
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold">Empresa :</label>
                  <input
                    name="empresa"
                    // value={form.empresa || ""}
                    disabled
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold">Contrata :</label>
                  <input
                    name="contrata"
                    // value={form.contrata || ""}
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
            {activeTab === 1 && <OdontogramaAdultos />}
            {activeTab === 2 && <OdontologiaReportes />}
          </div>
        </div>

        {/* Modal Levantar Observación */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="mr-2 text-yellow-500"
                  />
                  Levantar Observación
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  style={{ fontSize: "13px" }}
                >
                  Observación:
                </label>
                <textarea
                  value={observacionText}
                  onChange={(e) => setObservacionText(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
                  rows="4"
                  placeholder="Ingrese la observación..."
                  style={{ fontSize: "13px" }}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded transition-colors"
                  style={{ fontSize: "13px" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLevantarObservacion}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center transition-colors"
                  style={{ fontSize: "13px" }}
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Odontologia;
