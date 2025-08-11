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
import Parenquimatosas from "./Parenquimatosas/Parenquimatosas";
import Pleurales from "./Pleurales/Pleurales";
import Engrosamiento from "./Engrosamiento/Engrosamiento";
import { useState } from "react";
import {
  PrintHojaR,
  PrintHojaSinDatos,
  SubmitOIT,
  VerifyTR,
} from "./controller/OIT_controller";
import Swal from "sweetalert2";
const tabla = "oit";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const OIT = ({ token, selectedSede, userlogued, userDatos }) => {
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
    opcionSComentario:"",
    //
    SinDatos: false,
  });

  const handleClean = () => {
    setForm({
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
      opcionSComentario:""
    });
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

  const handleset = () => {
    setForm((prev) => ({
      ...prev,
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
      opcionSComentario:""
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

  return (
    <div className="">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">OIT</h1>
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
            </div>
          </div>
        </div>

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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 px-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                SubmitOIT(form, token, userlogued, handleClean, tabla);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
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
            <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
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
    </div>
  );
};

export default OIT;
