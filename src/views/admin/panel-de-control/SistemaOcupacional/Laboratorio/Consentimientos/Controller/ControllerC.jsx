import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch.js';
import { GetInfoLaboratioEx, SubmitInfoLaboratioExBoro } from "./model.js";
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const camposAPI = {
  MARIHUANA: { valor: 'antConsumeMarih', fecha: 'fechaConsumeMarih' },
  COCAINA: { valor: 'antConsumeCocacina', fecha: 'fechaConsumeCocacina' },
  COCA: { valor: 'antConsumeHojaCoca', fecha: 'fechaConsumoHojaCoca' },
  ANFETAMINAS: { valor: 'antConsumeAnfetaminaOExtasis', fecha: 'fechaConsumeAnfetamina' },
  METAN: { valor: 'antConsumeMethanfetaminaOOpiaceos', fecha: 'fechaConsumeMethanfetamina' },
  BENZO: { valor: 'antConsumeBenzodiacepinas', fecha: 'fechaConsumeBenzodiacepinas' },
  OPIA: { valor: 'antConsumeOpiacesos', fecha: 'fechaConsumeOpiacesos' },
  BARBI: { valor: 'antConsumeBarbituricos', fecha: 'fechaConsumeBarbituricos' },
  METADONA: { valor: 'antConsumeMetadona', fecha: 'fechaConsumeMetadona' },
  FENCI: { valor: 'antConsumeFenciclidina', fecha: 'fechaConsumeFenciclidina' },
  ANTI: { valor: 'antConsumeAntidepreTricicli', fecha: 'fechaConsumeAntidepreTricicli' }
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

export const VerifyTR = async (nro,tabla,token,set,sede, form,boro = false) => {
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
        } else if (res.id === 1) {
            GetInfoPacLaboratorioFil(nro,tabla,set,token, boro, form)
        } else {
          Swal.fire("Error", "Ocurrio un error", "error")
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

export const GetInfoPacLaboratorioFil = (nro,tabla,set,token, boro, form) => {
  
  if (boro === true) {
    getFetch(`/api/v01/ct/laboratorio/consentimientoLaboratorioBoro?nOrden=${nro}&nameConset=${tabla}`,token)
    .then((res) => {
       Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Consentimiento Boro",
          "warning"
      )
      set(prev => ({
        ...prev,
        ...res,
        enfermedad: { key: res.antBoroAlgunaEnfermedad, cual: res.critCualAlgunaEnfermedad ? res.critCualAlgunaEnfermedad : '' },
        medicamento: { key: res.antBoroAlgunMedicamento, cual: res.critCualAlgunMedicamento ? res.critCualAlgunMedicamento : '' },
        matecoca: { key: res.antBoroConsumenMateCoca, fecha: res.critFechaConsumoMateCoca },
        chaccha: { key: res.masticaHojaCoca, fecha: res.fechaConsumoHojaCoca},
        tratamiento: { key: res.antBoroTratQuirugODental, cual: res.critCualTratQuirugODental ? res.critCualTratQuirugODental : '', 
          cuando: res.critCuandoTratQuirugODental ? res.critCuandoTratQuirugODental : '', donde: res.critDondeTratQuirugODental ? res.critDondeTratQuirugODental : '' },
      }))
    })
  } else {
    getFetch(`/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${nro}&nameConset=${tabla}`,token)
    .then((res) => {
      if (res.norden) {
        if (tabla === 'consent_Muestra_Sangre') {
           Swal.fire(
            "Alerta",
            "Este paciente ya cuenta con registros de Consentimiento Muestra de Sangre",
            "warning"
          )
          set(prev => ({
            ...prev,
            ...res,
          }));
        } else {
          const antecedentesActualizados = form.antecedentes.map((item) => {
            const campos = camposAPI[item.key] || {};
            return {
              ...item,
              value: res[campos.valor] ?? false,
              fecha: res[campos.fecha] ?? today
            };
          });
           Swal.fire(
            "Alerta",
            "Este paciente ya cuenta con registros de Consentimientos",
            "warning"
          )
          set(prev => ({
            ...prev,
            ...res,
            antecedentes: antecedentesActualizados,
          }));
        }

      } else {
        Swal.fire('Error', 'Ocurrio un error al traer los datos','error')
      }
    })
  }
}

export const SubmitConsentimientoLab = async (form, tabla, token, user, fechaCoca = null, boro = false, limpiar = null) => {
  if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos','error')
    return
  }
  Loading('Registrando Datos')
  if (boro === true) {
    SubmitInfoLaboratioExBoro(form,token,user)
    .then((res) => {
      if (res.norden) {
        Swal.fire({title: 'Exito', text:`Se completo el Registro Correctamente,\n¿Desea imprimir?`, icon:'success', showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          limpiar()
          if (result.isConfirmed) {
            PrintHojaR(res,tabla,token,true)
          }
        })
      }
    })
  } else {
     GetInfoLaboratioEx(form,tabla,token,user, fechaCoca)
    .then((res) => {
      if (res.id === 1 || res.id === 0) {
        Swal.fire({title: 'Exito', text:`${res.mensaje},\n¿Desea imprimir?`, icon:'success', showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          limpiar()
          if (result.isConfirmed) {
            PrintHojaR(form,tabla,token)
          }
        })
      } else {
        Swal.fire('Error','Ocurrio un error al Registrar','error')
      }
    })
  }
}

export const PrintHojaR = async (datos,tabla,token, boro = false) => {
  Loading('Cargando Formato a Imprimir')
   // Ej: 'ConsentimientoPanel10D'
  let errorEncontrado = false;
  if (boro === true) {
    getFetch(`/api/v01/ct/laboratorio/consentimientoLaboratorioBoro?nOrden=${datos.norden}&nameConset=${tabla}`,token)
    .then(async (res) => {
      if (res.norden) {
        const nombre = res.nameJasper;
        console.log(nombre)
        const jasperModules = import.meta.glob('../../../../../../jaspers/Consentimientos/*.jsx');
        const modulo = await jasperModules[`../../../../../../jaspers/Consentimientos/${nombre}.jsx`]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === 'function') {
          modulo.default(res);
        } else {
          console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
        }
        Swal.close()
      }
      Swal.close();
    })
    .catch((error) => {
        console.error("Error al obtener el consentimiento:", error);
        Swal.fire({
          icon: "error",
          title: "N° Orden no existente",
          text: "Por favor, ingrese un N° Orden válido.",
        });
    });
  } else{
    getFetch(`/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${datos.norden}&nameConset=${tabla}`,token)
    .then(async (res) => {
      if (res.norden) {
        const nombre = res.nameJasper;
        console.log(nombre)
        const jasperModules = import.meta.glob('../../../../../../jaspers/Consentimientos/*.jsx');
        const modulo = await jasperModules[`../../../../../../jaspers/Consentimientos/${nombre}.jsx`]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === 'function') {
          modulo.default(res);
        } else {
          console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
        }
        Swal.close()
      }
      
    })
    .catch((error) => {
        console.error("Error al obtener el consentimiento:", error);
        
        errorEncontrado = true;
        Swal.fire({
        icon: "error",
        title: "N° Orden no existente",
        text: "Por favor, ingrese un N° Orden válido.",
        });
    });
    // .finally(() => {
    //   if(!errorEncontrado) {
    //     Swal.close();
    //   }
    // })
  }
  
}


export const PrintHojaRMasivo = async (norden,token) => {
  if (!norden){
    await Swal.fire('Error', 'Datos Incompletos','error')
    return 
  } 
  const tablas = [
    'con_panel10D',
    'con_panel5D',
    'con_panel3D',
    'con_panel2D',
    'consent_Muestra_Sangre',
    'consent_marihuana',
    'consent_Boro'
  ]
  await Loading('Cargando Formato a Imprimir')
  const jasperModules = import.meta.glob('../../../../../../jaspers/Consentimientos/*.jsx');
  for (const tabla of tablas) {
    try {
      const url =
      tabla === 'consent_Boro'
        ? `/api/v01/ct/laboratorio/consentimientoLaboratorioBoro?nOrden=${norden}&nameConset=${tabla}`
        : `/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${norden}&nameConset=${tabla}`;
      const res = await getFetch(url, token);
      
      if (res && res.norden && res.nameJasper) {
        const nombre = res.nameJasper;
        const path = `../../../../../../jaspers/Consentimientos/${nombre}.jsx`;

        if (jasperModules[path]) {
          const modulo = await jasperModules[path]();
          
          if (typeof modulo.default === 'function') {
            await modulo.default(res);
          } else {
            console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
          }
        } else {
          console.error(`No se encontró el módulo Jasper: ${path}`);
        }
      }
    } catch (error) {
      console.error(`Error al procesar la tabla ${tabla}:`, error);
    }
  }
  Swal.close();


}