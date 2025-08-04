import { getFetch } from "../../../getFetch/getFetch";
import Swal from "sweetalert2";

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
        console.log(res)
        if (res.id === 0) {
            GetInfoPac(nro,set,token,sede)
        } else {
            GetInfoPacLaboratorioFil(nro,tabla,set,token)
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
        nombres: res.nombresApellidos,
        }));
    })
    .finally(() => {
      Swal.close()
    })
}

export const GetInfoPacLaboratorioFil = (nro,tabla,set,token) => {
    getFetch(`/api/v01/ct/oit/obtenerReporteOit?nOrden=${nro}&nameService=${tabla}`,token)
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