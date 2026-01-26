import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch.js";
import { SubmitHistoriaOcupacional } from "../model/model.js";
import jsPDF from "jspdf";
export const Loading = (text) => {
  Swal.fire({
    title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
    html: `<div style=\"font-size:1.1em;\"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
    icon: 'info',
    background: '#f0f6ff',
    color: '#22223b',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    customClass: {
      popup: 'swal2-border-radius',
      title: 'swal2-title-custom',
      htmlContainer: 'swal2-html-custom',
    },
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    },
    didOpen: () => {
      Swal.showLoading();
    }
  });
}


export const VerifyTR = async (nro, tabla, token, set, sede, setTable) => {
  if (!nro) {
    await Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error')
    return
  }
  Loading('Validando datos')
  getFetch(`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`, token)
    .then((res) => {
      console.log(res)
      if (res.id === 0) {
        GetInfoPac(nro, set, token, sede)

        GetInfoAnterior(nro, token, setTable)
      } else {
        Swal.fire('Alerta', 'Este paciente ya cuenta con registros de Historia Ocupacional.', 'warning');
        GetInfoHistoriaOcupacinal(nro, tabla, set, token, setTable)
      }
    })
}

export const GetInfoAnterior = (nro, token, setTable) => {
  getFetch(`/api/v01/ct/historiaOcupacional/obtenerHistoriaOcupacionalDetallesPorNorden?nOrden=${nro}`, token)
    .then((res) => {
      if (res && res.length > 0) {
        Swal.fire('Info', 'Este norden no cuenta con historia ocupacional', 'info')
        console.log(res)
        const detallesOrdenados = res.sort(
          (a, b) => getAñoInicial(a.fecha) - getAñoInicial(b.fecha)
        );

        setTable(detallesOrdenados);
      } else {
        Swal.close()
        Swal.fire('Info', 'Este norden no tiene registros de historia ocupacional previos', 'info')

      }
    }).catch((err) => {
      console.error(err)
      Swal.close()
    })
}

export const GetInfoPac = (nro, set, token, sede) => {
  getFetch(`/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`, token)
    .then((res) => {
      console.log('pros', res)
      set(prev => ({
        ...prev,
        ...res,
      }));
    })

}

const getAñoInicial = (fecha) => {
  const match = fecha?.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : Infinity;
};

export const GetInfoHistoriaOcupacinal = (nro, tabla, set, token, setTable) => {
  getFetch(`/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res)
        const detallesOrdenados = [...res.detalles].sort(
          (a, b) => getAñoInicial(a.fecha) - getAñoInicial(b.fecha)
        );
        set(prev => ({
          ...prev,
          ...res,
          fecha: res.fechaHo,

          nombres: res.nombresApellidos,
          user_medicoFirma: res.usuarioFirma,
        }));
        setTable(detallesOrdenados)
      } else {
        Swal.fire('Error', 'Ocurrio un error al traer los datos', 'error')
      }
    })
    .finally(() => {
      Swal.close()
    })
}

export const SubmiteHistoriaOcupacionalController = async (form, token, user, limpiar, tabla, registros) => {
  if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos', 'error')
    return
  }
  Loading('Registrando Datos')
  SubmitHistoriaOcupacional(form, registros, user, token)
    .then((res) => {
      console.log(res)
      if (res.id === 1 || res.id === 0) {
        Swal.fire({
          title: 'Exito', text: `${res.mensaje},\n¿Desea imprimir?`, icon: 'success', showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          limpiar()
          if (result.isConfirmed) {
            PrintHojaR(form.norden, token, tabla)
          }
        })
      } else {
        Swal.fire('Error', 'Ocurrio un error al Registrar', 'error')
      }
    })
}

export const PrintHojaR = (nro, token, tabla) => {
  Loading('Cargando Formato a Imprimir')
  getFetch(`/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        console.log(res)
        const nombre = res.nameJasper;
        const detallesOrdenados = [...res.detalles].sort(
          (a, b) => getAñoInicial(a.fecha) - getAñoInicial(b.fecha)
        );
        console.log(nombre)
        const jasperModules = import.meta.glob('../../../../../jaspers/HistoriaOcupacional/*.jsx');
        const modulo = await jasperModules[`../../../../../jaspers/HistoriaOcupacional/${nombre}.jsx`]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === 'function') {
          modulo.default(res);
        } else {
          console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
        }
        Swal.close()
      } else {
        Swal.close()
      }
    })


}

//AUTOCOMPLETABLES
export const handleSearch = (e, setSearch, change, setFiltered, list) => {
  console.log(e.target.value.toUpperCase())
  const v = e.target.value.toUpperCase();
  setSearch(v);
  change(e.target.name, v);
  setFiltered(
    v ? list.filter((m) => m.mensaje.toLowerCase().includes(v.toLowerCase())) : []
  );
};

export const handleSelect = (e, name, value, setSearch, change, setFiltered) => {
  console.log(value.toUpperCase())
  setSearch(value.toUpperCase());
  change(name, value.toUpperCase());
  setFiltered([]);
};