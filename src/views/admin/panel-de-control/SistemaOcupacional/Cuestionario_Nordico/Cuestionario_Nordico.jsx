import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faTint,
  faHeartbeat,
  faSave,
  faBroom,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { getFetch } from "../../getFetch/getFetch";

import { useState } from "react";

import Swal from "sweetalert2";
import Cuestionario from "./Cuestionario/Cuestionario";
import Responder from "./Responder/Responder";
import Espalda_Baja from "./Espalda_Baja/Espalda_Baja";
import Hombros from "./Hombros/Hombros";
import Cuello from "./Cuello/Cuello";
const tabla = "oit";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const Cuestionario_Nordico = ({ token, selectedSede, userlogued, userDatos }) => {
  const [activeTab, setActiveTab] = useState(0);
  //const tabsConPermiso = tabs.filter(tab => permiso(tab.vista, tab.permiso));
  const [form, setForm] = useState({
    //DATOS PERSONALES
    norden: "",
    nplaca: "",
    nombres: "",
    doctor: "",
    dni: "",
    dniUser: userDatos.datos.dni_user,
    edad: "",
    fradiografia: today,
    flectura: today,
    //PARENQUIMATOSAS
    anormalidades_parenquimatosas_si: true,
    anormalidades_parenquimatosas_no: false,
    rbAceptable: true,
    rbInaceptable: false,
    rbBajacalidad: false,
    rbBuena: false,
    //causas
    rbSobreexposicion: false,
    rbSubexposicion: false,
    rbPosicioncentrado: true,
    rbInspiracionInsuficiente: false,
    rbEscapulas: false,
    rbArtefactos: false,
    rbOtros: false,
    //PARENQUIMATOSAS2.0

    txtDefectosTecnicos: "",
    chk1D: false,
    chk1I: false,
    chk2D: false,
    chk2I: false,
    chk3D: false,
    chk3I: false,
    //a
    chk1: false,
    chk2: false,
    chk3: false,
    chk4: false,
    chk5: false,
    chk6: false,
    chk7: false,
    chk8: false,
    chk9: false,
    chk10: false,
    chk11: false,
    chk12: false,
    //b
    chkP1: false,
    chkP2: false,
    chkP3: false,
    chkP4: false,
    chkP5: false,
    chkP6: false,
    chkS1: false,
    chkS2: false,
    chkS3: false,
    chkS4: false,
    chkS5: false,
    chkS6: false,
    //c
    chko: false,
    chka: false,
    chkb: false,
    chkc: false,
    //Pleurales
    chk2Si: true,
    chk2No: false,
    chkE1: false,
    chkE2: false,
    chkE3: false,
    chkE4: false,
    chkE5: false,
    chkE6: false,
    //a
    chk2_1: false,
    chk2_2: false,
    chk2_3: false,
    chk2_4: false,
    chk2_5: false,
    chk2_6: false,
    chk2_7: false,
    chk2_8: false,
    chk2_9: false,
    chk2_10: false,
    chk2_11: false,
    chk2_12: false,
    chk2_13: false,
    chk2_14: false,
    chk2_15: false,
    chk2_16: false,
    chk2_17: false,
    chk2_18: false,
    chk2_19: false,
    chk2_20: false,
    chk2_21: false,
    chk2_22: false,
    chk2_23: false,
    chk2_24: false,
    chk2_25: false,
    chk2_26: false,
    chk2_27: false,
    chk2_28: false,
    chk2_29: false,
    chk2_30: false,
    chk2_31: false,
    chk2_32: false,
    chk2_33: false,
    chk2_34: false,
    chk2_35: false,
    chk2_36: false,
    chk2_37: false,
    chk2_38: false,
    chk2_39: false,
    chk2_40: false,
    chk2_41: false,
    chk2_42: false,
    chk2_43: false,
    chk2_44: false,
    chk2_45: false,
    chk2_46: false,
    chk2_47: false,
    chk2_48: false,
    chk2_49: false,
    chk2_50: false,
    chk2_51: false,
    chk2_52: false,
    chk2_53: false,
    chk2_54: false,
    chk2_55: false,
    chk2_56: false,
    chk2_57: false,
    chk2_58: false,
    chk2_59: false,
    chk2_60: false,
    chk2_61: false,
    chk2_62: false,
    chk2_63: false,
    chk2_64: false,
    chk2_65: false,
    chk2_66: false,
    chk2_67: false,
    chk2_68: false,
    chk2_69: false,
    //
    chk3Si: true,
    chk3No: false,
    chk_01: false,
    chk_02: false,
    chk_03: false,
    chk_04: false,
    chk_05: false,
    chk_06: false,
    chk_07: false,
    chk_08: false,
    chk_09: false,
    chk_10: false,
    chk_11: false,
    chk_12: false,
    chk_13: false,
    chk_14: false,
    chk_15: false,
    chk_16: false,
    chk_17: false,
    chk_18: false,
    chk_19: false,
    chk_20: false,
    chk_21: false,
    chk_22: false,
    chk_23: false,
    chk_24: false,
    chk_25: false,
    chk_26: false,
    chk_27: false,
    chk_28: false,
    chk_29: false,
    txtSComentarios: "",
    //
    SinDatos: false,
  });


  console.log(form);
  const tabs = [
    {
      label: "Cuestionario",
      icon: faMicroscope,
      component: (
        <Cuestionario
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
    {
      label: "Responder",
      icon: faTint,
      component: (
        <Responder
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
    {
      label: "Espalda Baja",
      icon: faHeartbeat,
      component: (
        <Espalda_Baja
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
    {
      label: "Hombros",
      icon: faHeartbeat,
      component: (
        <Hombros
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
    {
      label: "Cuello",
      icon: faHeartbeat,
      component: (
        <Cuello
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
  ];


  return (
    <div className="">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Cuestionario Nordico</h1>
        {/* Tabs */}
        <div className="flex space-x-1 overflow-x-auto mt-4">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${
                activeTab === idx
                  ? "bg-[#233245] text-white font-bold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Content */}
        <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
          {tabs[activeTab].component}
        </div>

      </div>
    </div>
  );
};

export default Cuestionario_Nordico;
