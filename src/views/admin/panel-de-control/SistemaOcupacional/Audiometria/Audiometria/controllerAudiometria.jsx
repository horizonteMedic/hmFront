import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch";
import { SubmitData } from "../model";

//===============Zona Modificación===============
const obtenerReporteUrl = "/api/v01/ct/manipuladores/obtenerReporteAudiometria";
const registrarUrl =
  "/api/v01/ct/manipuladores/registrarActualizarManipuladoresAudiometria";

export const GetInfoServicio = (nro, tabla, set, token) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,
          fecha: res.fecha,
          muestra: res.txtmuestra,
          color: res.txtcolor,
          consistencia: res.txtconsistencia,
          moco_fecal: res.txtmoco_fecal,
          sangrev: res.txtsangrev,
          restosa: res.txtrestosa,
          leucocitos: res.txtleucocitos,
          hematies: res.txthematies,
          parasitos: res.txtparasitos,
          gotasg: res.txtgotasg,
          levaduras: res.txtlevaduras,
          identificacion: res.txtidentificacion,
          florac: res.txtflorac,
          resultado: res.txtresultado,
          observaciones: res.txtobservaciones,
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      Swal.close();
    });
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    codAu: 0,
    norden: form.norden,
    fechaAu: form.fecha,

    rbsasorderaSi: form.sordera == "SI",
    rbsasorderaNo: form.sordera == "NO",
    rbsaacufenosSi: form.acufenos == "SI",
    rbsaacufenosNo: form.acufenos == "NO",
    rbsavertigoSi: form.vertigo == "SI",
    rbsavertigoNo: form.vertigo == "NO",
    rbsaotalgiaSi: form.otalgia == "SI",
    rbsaotalgiaNo: form.otalgia == "NO",
    rbsasecrecionSi: form.secrecion_otica == "SI",
    rbsasecrecionNo: form.secrecion_otica == "NO",
    txtsaotrossintomas: form.otros_sintomas_orl || "",

    rbamrenitisSi: form.rinitis == "SI",
    rbamrenitisNo: form.rinitis == "NO",
    rbamsinusitisSi: form.sinusitis == "SI",
    rbamsinusitisNo: form.sinusitis == "NO",
    rbamotitisSi: form.otitis_media_cronica == "SI",
    rbamotitisNo: form.otitis_media_cronica == "NO",
    rbamototoxicosSi: form.medicamentos_ototoxicos == "SI",
    rbamototoxicosNo: form.medicamentos_ototoxicos == "NO",
    rbammeningitisSi: form.meningitis == "SI",
    rbammeningitisNo: form.meningitis == "NO",
    rbamtecSi: form.tec == "SI",
    rbamtecNo: form.tec == "NO",
    rbamsorderaSi: form.sordera_am == "SI",
    rbamsorderaNo: form.sordera_am == "NO",
    rbamparotiditisSi: form.parotiditis == "SI",
    rbamparotiditisNo: form.parotiditis == "NO",
    rbamsarampionSi: form.sarampion == "SI",
    rbamsarampionNo: form.sarampion == "NO",
    rbamtbcSi: form.tbc == "SI",
    rbamtbcNo: form.tbc == "NO",
    txtamcuales: form.cuales_antecedentes || "",

    rbeoexposicionSi: form.exposicion_ruido == "SI",
    rbeoexposicionNo: form.exposicion_ruido == "NO",
    rbeoprotectoresSi: form.protectores_auditivos == "SI",
    rbeoprotectoresNo: form.protectores_auditivos == "NO",
    rbeosustanciasSi: form.exposicion_quimicos == "SI",
    rbeosustanciasNo: form.exposicion_quimicos == "NO",

    rbte0a2: form.promedio_horas == "0-2",
    rbte2a4: form.promedio_horas == "2-4",
    rbte4a6: form.promedio_horas == "4-6",
    rbte6a8: form.promedio_horas == "6-8",
    rbte8a10: form.promedio_horas == "8-10",
    rbte10a12: form.promedio_horas == "10-12",
    rbtem12: form.promedio_horas == ">12",
    rbteeventual: form.promedio_horas == "eventual",
    txtanios: form.anios_exposicion || "",
    txtmeses: form.meses_exposicion || "",

    chktapones: form.tapones,
    chkorejeras: form.orejeras,
    txthplomo: form.plomo_hrs || "",
    txthmercurio: form.mercurio_hrs || "",
    txthtolueno: form.tolueno_hrs || "",
    txthxileno: form.xileno_hrs || "",
    txthplaguic: form.plaguicidas_hrs || "",
    txthorganofos: form.organofosforados_hrs || "",

    txttplomo: form.plomo_anios || "",
    txttmercurio: form.mercurio_anios || "",
    txtttolueno: form.tolueno_anios || "",
    txttxileno: form.xileno_anios || "",
    txttplaguic: form.plaguicidas_anios || "",
    txttorganofos: form.organofosforados_anios || "",
    txteootros: form.otros_quimicos || "",

    rbaepraticaSi: form.practica_tiro == "SI",
    rbaepraticaNo: form.practica_tiro == "NO",
    rbaeusoSi: form.uso_walkman == "SI",
    rbaeusoNo: form.uso_walkman == "NO",
    rbaeotrosSi: form.otros_antecedentes == "SI",
    rbaeotrosNo: form.otros_antecedentes == "NO",
    txtaecuales: form.cuales_antecedentes_extralaborales || "",
    txtood: form.otoscopia_odiochos || "",
    txtooi: form.otoscopia_odilzquierdo || "",

    od500: form.od_500 || "",
    od1000: form.od_1000 || "",
    od2000: form.od_2000 || "",
    od3000: form.od_3000 || "",
    od4000: form.od_4000 || "",
    od6000: form.od_6000 || "",
    od8000: form.od_8000 || "",

    oi500: form.oi_500 || "",
    oi1000: form.oi_1000 || "",
    oi2000: form.oi_2000 || "",
    oi3000: form.oi_3000 || "",
    oi4000: form.oi_4000 || "",
    oi6000: form.oi_6000 || "",
    oi8000: form.oi_8000 || "",

    txtdiagOd: form.diagnostico_od || "",
    txtdiagOi: form.diagnostico_oi || "",
    txtcomentarios: form.comentarios_audiometria || "",
    chkrpasimple: form.proteccion_simpleODoble == "simple",
    chkrpadoble: form.proteccion_simpleODoble == "doble",
    chkcasemestral: form.control_semestralOAnual == "semestral",
    chkcaanual: form.control_semestralOAnual == "anual",
    txtotrasrecomendaciones: form.recomendaciones_otras || "",

    od1500: form.od_o_500 || "",
    od11000: form.od_o_1000 || "",
    od12000: form.od_o_2000 || "",
    od13000: form.od_o_3000 || "",
    od14000: form.od_o_4000 || "",
    od16000: form.od_o_6000 || "",
    od18000: form.od_o_8000 || "",

    oi1500: form.oi_o_500 || "",
    oi11000: form.oi_o_1000 || "",
    oi12000: form.oi_o_2000 || "",
    oi13000: form.oi_o_3000 || "",
    oi14000: form.oi_o_4000 || "",
    oi16000: form.oi_o_6000 || "",
    oi18000: form.oi_o_8000 || "",

    userRegistro: user,
    userMedicoOcup: "",
    formato: "",
  };
  SubmitData(body, registrarUrl, token).then((res) => {
    console.log(res);
    if (res.id === 1 || res.id === 0) {
      Swal.fire({
        title: "Exito",
        text: `${res.mensaje},\n¿Desea imprimir?`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        limpiar();
        if (result.isConfirmed) {
          PrintHojaR(form.norden, token, tabla);
        }
      });
    } else {
      Swal.fire("Error", "Ocurrio un error al Registrar", "error");
    }
  });
};

export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          `../../../../../../jaspers/Manipuladores/*.jsx`
        );
        const modulo = await jasperModules[
          `../../../../../../jaspers/Manipuladores/${nombre}.jsx`
        ]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === "function") {
          modulo.default(res);
        } else {
          console.error(
            `El archivo ${nombre}.jsx no exporta una función por defecto`
          );
        }
      }
    })
    .finally(() => {
      Swal.close();
    });
};

//===============Fin Zona Modificación===============
export const Loading = (text) => {
  Swal.fire({
    title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
    html: `<div style=\"font-size:1.1em;\"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
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

export const VerifyTR = async (nro, tabla, token, set, sede) => {
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
    } else {
      GetInfoServicio(nro, tabla, set, token);
    }
  });
};

export const GetInfoPac = (nro, set, token, sede) => {
  getFetch(
    `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
    token
  )
    .then((res) => {
      console.log("pros", res);
      set((prev) => ({
        ...prev,
        ...res,
        nombres: res.nombresApellidos,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};
