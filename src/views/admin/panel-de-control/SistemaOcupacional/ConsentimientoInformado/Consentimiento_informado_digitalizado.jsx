import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faCalendar,
  faEdit,
  faPrint,
  faSave,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { getFetch } from "../../getFetch/getFetch";
import { SubmitConsentimientoInformado } from "./model";
import { useSessionData } from "../../../../hooks/useSessionData";

const tabla = "consentimientoInformado";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
const currentTime = date.toLocaleTimeString('en-US', { 
  hour12: false, 
  hour: '2-digit', 
  minute: '2-digit', 
  second: '2-digit' 
});

const initialFormState = {
  norden: "",
  codCons: null,
  fechaExam: today,
  fecha: today,
  nomExam: "",
  fechaNac: "",
  nombres: "",
  dni: "",
  empresa: "",
  contrata: "",
  ocupacion: "",
  // Datos del consentimiento
  nombreCompleto: "",
  documentoIdentidad: "",
  ocupacionLaboral: "",
  fechaConsentimiento: today,
  horaActual: currentTime,
  
  
  // Texto del consentimiento (pre-llenado)
  textoConsentimiento: `certifico que he sido informado/a acerca de la naturaleza y propósito del examen médico ocupacional así como pruebas complementarias determinada por la empresa:`,
  
  // Información adicional
  informacionAdicional: "",
  
  // Texto final del consentimiento (pre-llenado)
  textoFinalConsentimiento: `De acuerdo a los peligros y riesgos identificados en mi puesto de trabajo. En ese sentido en forma consciente y voluntaria doy mi consentimiento, para que se me realice el examen médico ocupacional de acuerdo a la Resolución ministerial N° 312-2011/MINSA. Y doy fe que la información brindada a HORIZONTE MEDIC es verídica. Así mismo, autorizo a HORIZONTE MEDIC para que brinde mi historia clínica y toda información resultante de mi examen médico ocupacional al Médico Ocupacional de mi empresa para que tenga acceso a mi Historia Clínica de acuerdo a la N.T.N° 022 MINSA/dgsp-V.02 y Ley N° 26842, Ley general de salud.`,
};

export default function ConsentimientoInformadoOcupacional({ token, selectedSede, userlogued, userDatos }) {
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const { datosFooter, userCompleto } =
    useSessionData();

  useEffect(() => {
    setForm(() => ({ ...initialFormState, horaActual: getCurrentTime() }));
  },[])

  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value.toUpperCase() }));
  };
  
  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    if (/^[\d/]*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };
  
  const handleClear = () => {
    setForm(() => ({ ...initialFormState, horaActual: getCurrentTime() }));
  };
  
  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden, horaActual: getCurrentTime() }));
  };
  
  const Loading = (text) => {
    Swal.fire({
      title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
      html: `<div style="font-size:1.1em;"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
      icon: "info",
      background: "#f0f6ff",
      color: "#22223b",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal2-border-radius",
        title: "swal2-title-custom",
        htmlContainer: "swal2-html-custom",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const convertirFecha = (fecha) => {
    if (fecha === "") return "";
    const [dia, mes, anio] = fecha.split("-");
    return `${anio}/${mes.padStart(2, "0")}/${dia.padStart(2, "0")}`;
  };

  const GetInfoPac = (nro, set, token, sede) => {
    getFetch(
      `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
      token
    )
      .then((res) => {
        console.log("pros", res);
        if (res.norden) {
          set((prev) => ({
          ...prev,
          ...res,
          fechaNac: convertirFecha(res.fechaNac),
          nombres: res.nombresApellidos,
          ocupacion: res.cargo
        }));
        }
        
      })
      .finally(() => {
        Swal.close();
      });
  };

  const GetInfoPacConsentInfor = (nro,tabla,set,token) => {
      getFetch(`/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado?nOrden=${nro}&nameService=${tabla}`,token)
      .then((res) => {
        console.log(res)
        set(prev => ({
          ...prev,
          ...res,
        }))
      })
      .finally(() => {
        Swal.close()
      })
  }

  const VerifyTR = async (nro, tabla, token, set, sede) => {
    if (!nro) {
      await Swal.fire(
        "Error",
        "Debe Introducir un Nro de Historia Clinica válido",
        "error"
      );
      return;
    }
    Loading("Validando datos");
    getFetch(
      `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
      token
    ).then((res) => {
      console.log(res);
      if (res.id === 0) {
        //No tiene registro previo
        GetInfoPac(nro, set, token, sede);
      } else if (res.id === 1) {
        // Ya existe registro
        GetInfoPacConsentInfor(nro, tabla, set, token)
      }
    });
  };

  const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    if (!form.norden) {
      await Swal.fire("Error", "Datos Incompletos", "error");
      return;
    }
    Loading("Registrando Datos");
    SubmitConsentimientoInformado(form,userlogued,token)
    .then((res) => {
      console.log(res)
      if (res.id === 1 || res.id === 0) {
      Swal.fire({title: 'Exito', text:`${res.mensaje},\n¿Desea imprimir?`, icon:'success', showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
      }).then((result) => {
          limpiar()
          if (result.isConfirmed) {

              PrintHojaR(form.norden,token,tabla)
          }
      })
      } else {
          Swal.fire('Error','Ocurrio un error al Registrar','error')
      }
    })
  };

  const PrintHojaR = (nro, token, tabla) => {
    Loading("Cargando Formato a Imprimir");
    getFetch(`/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado?nOrden=${nro}&nameService=${tabla}`,token)
      .then(async (res) => {
        if (res.norden) {
          console.log(res)
          const nombre = res.nameJasper;
          console.log(nombre)
          const jasperModules = import.meta.glob('../../../../jaspers/ConsentimientoInformado/*.jsx');
          const modulo = await jasperModules[`../../../../jaspers/ConsentimientoInformado/${nombre}.jsx`]();
          // Ejecuta la función exportada por default con los datos
          if (typeof modulo.default === 'function') {
            modulo.default({ ...res, ...datosFooter });
          } else {
            console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
          }
          Swal.close()
        } else {
          Swal.close()
        }
      })
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };
  
  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };
  
  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Reporte?",
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

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="w-[90%] mx-auto text-[11px] my-12">
      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Consentimiento Informado Ocupacional
        </h1>
        <p className="text-center text-gray-600 text-md">
          Sistema de Gestión de Consentimientos - HORIZONTE MEDIC
        </p>
      </div>

        <form onSubmit={(e) => e.preventDefault()} className="p-3 rounded w-full border mb-4 bg-white shadow-sm" >
          <div className="flex items-center gap-3">
            <label className="font-semibold text-md">N° Orden:</label>
            <input
              className="border rounded px-3 py-2 w-40 text-md"
              name="norden"
              value={form.norden || ""}
              onKeyUp={handleSearch}
              onChange={handleChangeNumber}
              placeholder="Ingrese N° Orden"
            />
            
          </div>
        </form>

      {/* Contenido del Consentimiento */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">

        {/* Información Personal */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[30px]">Yo:</label>
            <input
              className="border rounded px-2 py-1 flex-1"
              name="nombres"
              value={form.nombres || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Nombre completo"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[280px]">
              identificado con documento de identidad N°:
            </label>
            <input
              className="border rounded px-2 py-1 w-48"
              name="dni"
              value={form.dni || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="DNI"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[180px]">
              Con ocupación laboral de:
            </label>
            <input
              className="border rounded px-2 py-1 flex-1"
              name="ocupacion"
              value={form.ocupacion || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Ocupación laboral"
            />
          </div>
        </div>

        {/* Texto del Consentimiento */}
        <div className="space-y-4 mb-6">
          <div className="text-justify leading-relaxed">
            <p className="mb-3">
              {form.textoConsentimiento}
            </p>
            
            <div className="mb-3">
              <input
                className="border rounded px-2 py-1 w-full"
                name="empresa"
                value={form.empresa || ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Información adicional sobre el examen"
              />
            </div>
            
            <p className="text-justify leading-relaxed">
              {form.textoFinalConsentimiento}
            </p>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="flex items-center gap-8 mb-6">
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[60px]">Fecha:</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              name="fecha"
              value={form.fecha || ""}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[50px]">Hora:</label>
            <span className="border rounded px-2 py-1 bg-gray-50">
              {form.horaActual}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-2">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} />
            <FontAwesomeIcon icon={faSync} />
            Grabar/Actualizar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
          <div className="flex items-center gap-2">
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
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
  );
}
