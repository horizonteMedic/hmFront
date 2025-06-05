import Swal from "sweetalert2";
import { getFetch } from "../../../../getFetch/getFetch";
import { GetInfoLaboratioEx } from "./model";

const backendToLabelMap = {
  antConsumeMarih: "CONSUME MARIHUANA (THC)",
  antConsumeCocacina: "CONSUME COCAINA (COC)",
  antConsumeHojaCoca: "CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS",
  antConsumeAnfetaminaOExtasis: "CONSUME ANFETAMINAS (AMP)",
  antConsumeMethanfetamina: "CONSUME METHANFETAMINAS (MET)",
  antConsumeBenzodiacepinas: "CONSUME BENZODIAZEPINAS (BZO)",
  antConsumeOpiacesos: "CONSUME OPIÁCEOS (OPI)",
  antConsumeBarbituricos: "CONSUME BARBITÚRICOS (BAR)",
  antConsumeMetadona: "CONSUME METADONA (MTD)",
  antConsumeFenciclidina: "CONSUME FENCICLIDINA (PCP)",
  antConsumeAntidepreTricicli: "CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)",
};

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
    getFetch(`/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${nro}&nameConset=${tabla}`,token)
    .then((res) => {
      if (res.norden) {
        console.log('registrao datos',res)
        const antecedentesConvertidos = {};

        for (const [key, label] of Object.entries(backendToLabelMap)) {
          antecedentesConvertidos[label] = res.hasOwnProperty(key) ? res[key] : false;
        }
        set(prev => ({
          ...prev,
          ...res,
          antecedentes: antecedentesConvertidos
        }));
      } else {
        Swal.fire('Error', 'Ocurrio un error al traer los datos','error')
      }
    })
    .finally(() => {
      Swal.close()
    })
}

export const SubmitConsentimientoLab = async (form, tabla, token, user) => {
  if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos','error')
    return
  }
  Loading('Registrando Datos')
  GetInfoLaboratioEx(form,tabla,token,user)
  .then((res) => {
    console.log('registro',res)
    console.log(form)
    if (res.id === 1 || res.id === 0) {
      Swal.fire({title: 'Exito', text:`${res.mensaje},\n¿Desea imprimir?`, icon:'success', showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          PrintHojaR(form,tabla,token)
        }
      })
    }
  })
}

export const PrintHojaR = async (datos,tabla,token) => {
  Loading('Cargando Formato a Imprimir')
   // Ej: 'ConsentimientoPanel10D'
  getFetch(`/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${datos.norden}&nameConset=${tabla}`,token)
  .then(async (res) => {
    if (res.norden) {
      const nombre = res.nameJasper;
      console.log(nombre)
      const jasperModules = import.meta.glob('../../../../../../jaspers/*.jsx');
      const modulo = await jasperModules[`../../../../../../jaspers/${nombre}.jsx`]();
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