import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch.js';
import { SubmitHematologia } from "./model.js";

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

export const VerifyTR = async (nro,tabla,token,set,setO,sede,setSearchMedico) => {
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
            GetInfoExamenHematologia(nro,tabla,set,setO,token,setSearchMedico)
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
        empContratista: res.contrata
        }));
    })
    .finally(() => {
      Swal.close()
    })
}


export const GetInfoExamenHematologia = (nro,tabla,set,setO,token,setSearchMedico) => {
  getFetch(`/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico?nOrden=${nro}&nameService=${tabla}`,token)
  .then((res) => {
    console.log(res)
    console.log(res.chkPositivo === true ? 'POSITIVO' : res.chkNegativo === true ? 'NEGATIVO' : res.chkNegativo === false && res.chkPositivo === false ? 'N/A' : '')
    if (res.norden) {
      set(prev => ({
        ...prev,
        ...res,
        paciente: res.nombres,
        fecha: res.fechaLab,
        responsable: res.resLab,
        empContratista: res.contrata,
        grupo: res.chka ? 'A' : res.chkab ? 'AB' : res.chkb ? 'B' : res.chko ? 'O' : '',
        rh: res.rbrhpositivo === true ? 'Rh(+)' : res.rbrhnegativo === true ? 'Rh(-)' : '',
        //HEMATOLOGIA
        hemoglobina: res.txtHemoglobina,
        hematocrito: res.txtHematocrito,
        vsg: res.txtVsg,
        leucocitos: res.txtLeucocitosHematologia,
        hematies: res.txtHematiesHematologia,
        plaquetas: res.txtPlaquetas,
        linfocitos: res.txtLinfocitosHematologia,
        neutrofilos: res.txtNeutrofilos,
        abastonados: res.txtAbastonados,
        segmentados: res.txtSegmentadosHematologia,
        monocitos: res.txtMonocitosHematologia,
        eosinofilos: res.txtEosinofilosHematologia,
        basofilos: res.txtBasofilosHematologia,
        //BIO
        glucosa: res.txtGlucosaBio,
        creatinina: res.txtCreatininaBio,
        rpr: res.chkPositivo === true ? 'POSITIVO' : res.chkNegativo === true ? 'NEGATIVO' : res.chkNegativo === false && res.chkPositivo === false ? 'N/A' : '',
        vih: res.txtVih,
      }));
      setO(prev => ({
        ...prev,
        ...res,
        Incoloro: false,
        Medicamentosa: false,
        Transparente: false,
        Turbio: false,
        NoAplica: false,
        Color: res.txtColorEf,
        Aspecto: res.txtAspectoEf,
        Densidad: res.txtDensidadEf,
        PH: res.txtPhEf,
        // Examen Químico
        Nitritos: res.txtNitritosEq,
        Proteínas: res.txtProteinasEq,
        Cetonas: res.txtCetonasEq,
        LeucocitosQ: res.txtLeucocitosEq,
        AcAscorbico: res.txtAcAscorbico,
        Urobilinogeno: res.txtUrobilinogenoEq,
        Bilirrubina: res.txtBilirrubinaEq,
        GlucosaQ: res.txtGlucosaEq,
        Sangre: res.txtSangreEq,
        // Sedimento
        LeucocitosS: res.txtLeucocitosSu,
        Hematies: res.txtHematiesSu,
        CelEpiteliales: res.txtCelEpitelialesSu,
        Cristales: res.txtCristalesSu,
        Cilindros: res.txtCilindrosSu,
        Bacterias: res.txtBacteriasSu,
        GramSC: res.txtPusSu,
        Otros: res.txtOtrosSu,
        // Drogas
        Cocaina: res.txtCocaina,
        Marihuana: res.txtMarihuana,
        ScreeningPos: false,
        ScreeningNeg: false,
        ScreeningNA: false,
        ConfirmPos: false,
        ConfirmNeg: false,
        ConfirmNA: false,
        // Observaciones
        observaciones: res.txtObservacionesLb,
        // Imprimir
      }))
      setSearchMedico(res.resLab)
    }
  })
  .finally(() => {
    Swal.close()
  })
}

export const SubmitHematologiaLabCLinico = async (form,formO,token,user,limpiar) => {
   if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos','error')
    return
  }
  Loading('Registrando Datos')
  SubmitHematologia(form,formO,token,user)
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
  getFetch(`/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico?nOrden=${nro}&nameService=lab_clinico`,token)
  .then(async (res) => {
    if (res.norden) {
      const nombre = res.nameJasper;
      console.log(nombre)
      const jasperModules = import.meta.glob('../../../../../../jaspers/AnalisisBioquimicos/*.jsx');
      const modulo = await jasperModules[`../../../../../../jaspers/AnalisisBioquimicos/${nombre}.jsx`]();
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