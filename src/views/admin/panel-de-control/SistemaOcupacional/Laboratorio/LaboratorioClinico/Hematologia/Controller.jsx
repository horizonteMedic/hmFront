import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch.js';
import { SubmitHematograma } from "../ControllerLC/model.js";

const Loading = (text) => {
    Swal.fire({
      title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
      html: `<div style=\"font-size:1.1em;\"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>` ,
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

export const VerifyTR = async (nro,tabla,token,set,sede) => {
    if (!nro) { 
      await Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error') 
      return
    }
    Loading('Validando datos')
    getFetch(`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,token)
    .then((res) => {
        if (res.id === 0) {
            GetInfoPac(nro,set,token,sede)
        } else {
            GetInfoExamenHematologia(nro,tabla,set,token)
        }
    })
}

export const GetInfoPac = (nro,set,token,sede) => {
    getFetch(`/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,token)
    .then((res) => {
        console.log('pros',res)
        set(prev => ({
        ...prev,
        ...res,
        paciente: res.nombresApellidos,
        }));
    })
    .finally(() => {
      Swal.close()
    })
}

export const GetInfoExamenHematologia = (nro,tabla,set,token) => {
  getFetch(`/api/v01/ct/laboratorio/obtenerReporteLabHematograma?nOrden=${nro}&nameService=${tabla}`,token)
  .then((res) => {
    console.log(res)
    if (res.norden) {
      set(prev => ({
        ...prev,
        paciente: res.nombres,
        edad: res.edad,
        fecha: res.fechaExamen,
        // Pruebas
        hemoglobina: res.txtHemoglobina,
        hematocrito: res.txtHematocrito,
        hematies: res.txtHematies,
        volumen_corpuscular_medio: res.txtVolumen,
        hemoglobina_corpuscular_media: res.txtHemocorpuscular,
        concentracion_hemoglobina_corpuscular: res.txtConcentracion,
        leucocitos: res.txtLeucocitos,
        plaquetas: res.txtPlaquetas,
        // Diferencial
        neutrofilos: res.txtNeutrofilos,
        abastonados: res.txtAbastonados,
        segmentados: res.txtSegmentados,
        monocitos: res.txtMonocitos,
        eosinofilos: res.txtEosinofios,
        basofilos: res.txtBasofilos,
        linfocitos: res.txtLinfocitos
      }))
    }
  })
  .finally(() => {
    Swal.close()
  })
}

export const SubmitHematogramaLabClinic = async (form,token,user,limpiar) => {
    if (!form.norden) {
        await Swal.fire('Error', 'Datos Incompletos','error')
        return
    }
    Loading('Registrando Datos')
    SubmitHematograma(form,token,user)
    .then((res) => {
        console.log(res)
        if (res.id === 1 || res.id === 0) {
        Swal.fire({title: 'Exito', text:`${res.mensaje},\n¿Desea imprimir?`, icon:'success', showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            limpiar()
            if (result.isConfirmed) {
                PrintHojaR(form.norden,token)
            }
        })
        } else {
            Swal.fire('Error','Ocurrio un error al Registrar','error')
        }
    })
}

export const PrintHojaR = (nro,token) => {
  Loading('Cargando Formato a Imprimir')
  getFetch(`/api/v01/ct/laboratorio/obtenerReporteLabHematograma?nOrden=${nro}&nameService=hemograma_autom`,token)
  .then(async (res) => {
    if (res.norden) {
      const nombre = res.nameJasper;
      console.log(nombre)
      const jasperModules = import.meta.glob('../../../../../../jaspers/LaboratorioClinico/*.jsx');
      const modulo = await jasperModules[`../../../../../../jaspers/LaboratorioClinico/${nombre}.jsx`]();
      // Ejecuta la función exportada por default con los datos
      if (typeof modulo.default === 'function') {
        modulo.default(res);
      } else {
        console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
      }
    }
  })
  .finally(() => {
    Swal.close()
  })
}