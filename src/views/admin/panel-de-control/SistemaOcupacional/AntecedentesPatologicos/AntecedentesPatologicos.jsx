import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faStethoscope, faFileMedical } from "@fortawesome/free-solid-svg-icons";
import AntecedentesPatologicosTab from "./AntecedentesPatologicosTab/AntecedentesPatologicosTab"
// import Antecedentes from "./Normal/Antecedentes/Antecedentes";
import { InputTextOneLine, InputTextArea } from "../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useState } from "react";

// Tab Normal de Antecedentes Patológicos
export default function Normal() {
  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();
  const initialFormState = {
    norden: "",
  };
  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleChangeSimple,
    handleCheckBoxChange,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      name: "Antecedentes Patológicos",
      icon: faUser,
      component: AntecedentesPatologicosTab,
    },
    // {
    //   id: 1,
    //   name: "Indicar Enfermedades",
    //   icon: faStethoscope,
    //   component: IndicarEnfermedades,
    // },
    // {
    //   id: 2,
    //   name: "Antecedentes",
    //   icon: faFileMedical,
    //   component: Antecedentes,
    // },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Columna 1 - Ancha con los 3 tabs */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <nav className="flex bg-white border-b border-gray-200 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === tab.id
                    ? "border-[#233245] font-semibold"
                    : "border-transparent"
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <div className="max-w-full">
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  activeTab === tab.id && (
                    <Component
                      key={tab.id}
                      form={form}
                      setForm={setForm}
                      handleChange={handleChange}
                      handleChangeNumber={handleChangeNumber}
                      handleRadioButton={handleRadioButton}
                      handleCheckBoxChange={handleCheckBoxChange}
                      handleChangeSimple={handleChangeSimple}
                      handleRadioButtonBoolean={handleRadioButtonBoolean}
                    />
                  )
                );
              })}
            </div>
          </div>

          {/* Columna 2 - Pequeña con formulario ocular */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-full">
              <h5 className="font-semibold mb-3">Examen Ocular</h5>

              {/* Sin Corregir */}
              <div className="mb-4">
                <h6 className="font-semibold mb-2">Sin Corregir</h6>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.D</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="vcOD" value={form?.vcOD || "00"} onChange={() => { }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="vlOD" value={form?.vlOD || ""} onChange={() => { }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.I</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="vcOI" value={form?.vcOI || "00"} onChange={() => { }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="vlOI" value={form?.vlOI || ""} onChange={() => { }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corregida */}
              <div className="mb-4">
                <h6 className="font-semibold mb-2">Corregida</h6>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.D</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="vcCorregidaOD" value={form?.vcCorregidaOD || "00"} onChange={() => { }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="vlCorregidaOD" value={form?.vlCorregidaOD || "00"} onChange={() => { }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.I</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="vcCorregidaOI" value={form?.vcCorregidaOI || "00"} onChange={() => { }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="vlCorregidaOI" value={form?.vlCorregidaOI || "00"} onChange={() => { }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campos adicionales de Corregida */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="min-w-[50px]">V.Clrs:</span>
                    <InputTextOneLine name="vclrs" value={form?.vclrs || "NORMAL"} onChange={() => { }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="min-w-[50px]">V.B.:</span>
                    <InputTextOneLine name="vb" value={form?.vb || "00"} onChange={() => { }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="min-w-[50px]">R.P.:</span>
                    <InputTextOneLine name="rp" value={form?.rp || ""} onChange={() => { }} />
                  </div>
                </div>
              </div>

              {/* Campos de texto */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1">Enfermedades Oculares:</label>
                  <InputTextArea rows={1} name="enfermedadesOculares" value={form?.enfermedadesOculares || ""} onChange={() => { }} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Dosis de vacunas:</label>
                  <InputTextArea rows={1} name="dosisVacunas" value={form?.dosisVacunas || ""} onChange={() => { }} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Cocaína:</label>
                  <InputTextArea rows={1} name="cocaina" value={form?.cocaina || ""} onChange={() => { }} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Marihuana:</label>
                  <InputTextArea rows={1} name="marihuana" value={form?.marihuana || ""} onChange={() => { }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
