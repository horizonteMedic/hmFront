import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch";
import { SubmitData } from "../model";

//===============Zona Modificación===============
const obtenerReporteUrl =
  "/api/v01/ct/evaluacionMusculoEsqueletica/registrarActualizarEvaluacionMusculoEsqueletica";
const registrarUrl =
  "/api/v01/ct/evaluacionMusculoEsqueletica/registrarActualizarEvaluacionMusculoEsqueletica";

export const GetInfoServicio = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {}
) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,
          codOf: res.codOf,
          nomExam: res.nomExam,
          fechaExam: res.fechaOf,
          fechaNac: res.fechaNac ? convertirFecha(res.fechaNac) : "",
          nombres: res.nombre + " " + res.apellido,
          dni: res.dni,
          empresa: res.empresa,
          contrata: res.contrata,

          parpadosYAnexos: res.txtParpaAnex ?? "",
          corneas: res.txtCorneas ?? "",
          otrosHallazgos: res.txtOtrosHallaz ?? "",
          conjuntivas: res.txtConjuntivas ?? "",
          cristalino: res.txtCristalino ?? "",

          fondoNormalOD: res.rbfONormalOd,
          fondoNormalOI: res.rbfONormalOi,
          fondoAnormalOD: res.rbfOAnormalOd,
          fondoAnormalOI: res.rbfOAnormalOi,
          fondoHallazgos: res.txtFoHallazgos,

          pioOd: res.txtPioOd ?? "",
          pioOi: res.txtPioOi ?? "",
          noAplica: res.txtPioNa ?? "",

          correctorOcular: res.rbcOsi ? "SI" : "NO",
          correctorCerca: res.rbcOcerca,
          correctorLejos: res.rbcOlejos,
          noTrajocorrectorCerca: res.chkNtcc,
          noTrajocorrectorLejos: res.chkNtcl,

          antecedentesPersonales: res.txtAntPersImp ?? "",
          antecedentesFamiliares: res.txtFamImp ?? "",

          ishihara: res.rbtEcIshiharaNormal
            ? "NORMAL"
            : res.rbtEcIshiharaAnormal
            ? "ANORMAL"
            : res.rbtEcIshiharaNc
            ? "N.C."
            : "",
          coloresPuros: res.rbtEcColeresNormal
            ? "NORMAL"
            : res.rbtEcColeresAnormal
            ? "ANORMAL"
            : res.rbtEcColeresNc
            ? "N.C."
            : "",
          estereopsia: res.rbtEcEstereopsiaNormal
            ? "NORMAL"
            : res.rbtEcEstereopsiaAnormal
            ? "ANORMAL"
            : res.rbtEcEstereopsiaNc
            ? "N.C."
            : "",
          estereopsiaText: res.txtTecEstereopsia ?? "",

          aplicaRefraccion: res.chkRefraccionAplica ? "SI" : "NO",
          odsfL: res.txtLejosOdSf ?? "",
          odcilL: res.txtLejosOdCil ?? "",
          odejeL: res.txtLejosOdEje ?? "",

          oisfL: res.txtLejosOiSf ?? "",
          oicilL: res.txtLejosOiCil ?? "",
          oiejeL: res.txtLejosOiEje ?? "",
          dipL: res.txtLejosOdDip ?? "",

          odsfC: res.txtCercaOdSf ?? "",
          odcilC: res.txtCercaOdCil ?? "",
          odejeC: res.txtCercaOdEje ?? "",

          oisfC: res.txtCercaOiSf ?? "",
          oicilC: res.txtCercaOiCil ?? "",
          oiejeC: res.txtCercaOiEje ?? "",
          dipC: res.txtCercaOdDip ?? "",

          agudezaOdLejos: res.txtAvConRefraccionLejosOd ?? "",
          agudezaOiLejos: res.txtAvConRefraccionLejosOi ?? "",
          agudezaOdCerca: res.txtAvConRefraccionCercaOd ?? "",
          agudezaOiCerca: res.txtAvConRefraccionCercaOi ?? "",
          diagnostico: res.txtDiagnostico ?? "",

          ninguna: res.chkInNinguna,
          usoCorrectoresCerca: res.chkI2,
          usoCorrectoresLejos: res.chkI3,
          lentesCorrectoresCerca: res.chkI4Cerca,
          lentesCorrectoresLejos: res.chkI4Lejos,
          lentesCambioLunas: res.chkI5,
          indicacionPterigion: res.chkI6,
          indicacionOtras: res.chkI7,

          noRestringeActividades: res.chkR1,
          restriccionCorrectorLejos: res.chkR2Lejos,
          restriccionCorrectorCerca: res.chkR2Cerca,
          noTrabajosCableElectrico: res.chkR3,
          noConduccion: res.chkR4,

          vc_sinc_od: res.txtCercaSinCorregirOd ?? "",
          vc_sinc_oi: res.txtCercaSinCorregirOi ?? "",
          vc_conc_od: res.txtCercaCorregidaOd ?? "",
          vc_conc_oi: res.txtCercaCorregidaOi ?? "",
          vc_agujero_od: res.txtCercaAgujeroOd ?? "",
          vc_agujero_oi: res.txtCercaAgujeroOi ?? "",
          vl_sinc_od: res.txtLejosSinCorregirOd ?? "",
          vl_sinc_oi: res.txtLejosSinCorregirOi ?? "",
          vl_conc_od: res.txtLejosCorregidaOd ?? "",
          vl_conc_oi: res.txtLejosCorregidaOi ?? "",
          vl_agujero_od: res.txtLejosAgujeroOd ?? "",
          vl_agujero_oi: res.txtLejosAgujeroOi ?? "",
          bino_sinc: res.txtBinocularSinCorregir ?? "",
          bino_conc: res.txtBinocularCorregida ?? "",
          reflejos_pupilares: res.txtRp ?? "",

          ptosisPalpebralOd: res.rbecPtosisOd,
          ptosisPalpebralOi: res.rbecPtosisOi,
          pterigionGradoOd: res.rbecPterigionOd,
          pterigionGradoOi: res.rbecPterigionOi,

          estrabismoOd: res.rbecEstrabismoOd,
          estrabismoOi: res.rbecEstrabismoOi,
          pingueculaOd: res.rbecPingueculaOd,
          pingueculaOi: res.rbecPingueculaOi,

          conjuntivitisOd: res.rbecConjuntivitisOd,
          conjuntivitisOi: res.rbecConjuntivitisOi,
          chalazionOd: res.rbecClalacionOd,
          chalazionOi: res.rbecClalacionOi,

          cataratasOd: res.rbecCataratasOd,
          cataratasOi: res.rbecCataratasOi,
          otrosOd: res.rbecOtrosOd,
          otrosOi: res.rbecOtrosOi,
          examenClinicoHallazgos: res.txtecHallazgos ?? "",
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    // txtFamImp: form.antecedentesFamiliares,
    codEvaluacion: form.codEvaluacion,
    norden: form.nombres,
    dni: form.dni,
    edad: form.edad,
    tipoServicio: form.tiempoServicio,
    fechaExamen: form.fecha,

    sintomaSi: form.sintomas == "SI",
    sintomaNo: form.sintomas == "NO",
    sintomas: form.cualesSintomas,
    fajaSi: form.usoFajaLumbar == "SI",
    fajaNo: form.usoFajaLumbar == "NO",
    adecuadaTecnicacargaSi: form.tecnicaLevantamiento == "SI",
    adecuadaTecnicacargaNo: form.tecnicaLevantamiento == "NO",
    capacitacionLevantamientoCargaSi: form.capacitacionLevantamiento == "SI",
    capacitacionLevantamientoCargaNo: form.capacitacionLevantamiento == "NO",
    extencionCabeza: form.extensionCabeza,
    flexionCabeza: form.flexionCabeza,
    extensionCabezaN: form.gradoExtension=="N",
    extensionCabezaR: form.gradoExtension=="R",
    extensionCabezaM: form.gradoExtension=="M",
    flexionCabezaN: form.gradoFlexion=="N",
    flexionCabezaR: form.gradoFlexion=="R",
    flexionCabezaM: form.gradoFlexion=="M",

    flexionHombroN: form.flexionHombro=="N",
    flexionHombroR: form.flexionHombro=="R",
    flexionHombroM: form.flexionHombro=="M",
    flexionHombroN1: form.flexionHombroDerecho=="N",
    flexionHombroR1: form.flexionHombroDerecho=="R",
    flexionHombroM1: form.flexionHombroDerecho=="M",
    extensionHombroN: form.extensionHombro=="N",
    extensionHombroR: form.extensionHombro=="R",
    extensionHombroM: form.extensionHombro=="M",
    extensionHombroN1: form.extensionHombroDerecho=="N",
    extensionHombroR1: form.extensionHombroDerecho=="R",
    extensionHombroM1: form.extensionHombroDerecho=="M",
    abduccionHombroN: form.abduccionHombro=="N",
    abduccionHombroR: form.abduccionHombro=="R",
    abduccionHombroM: form.abduccionHombro=="M",
    abduccionHombroN1: form.abduccionHombroDerecho=="N",
    abduccionHombroR1: form.abduccionHombroDerecho=="R",
    abduccionHombroM1: form.abduccionHombroDerecho=="M",
    aduccionHombroN: form.aduccionHombro=="N",
    aduccionHombroR: form.aduccionHombro=="R",
    aduccionHombroM: form.aduccionHombro=="M",
    aduccionHombroN1: form.aduccionHombroDerecho=="N",
    aduccionHombroR1: form.aduccionHombroDerecho=="R",
    aduccionHombroM1: form.aduccionHombroDerecho=="M",
    rotacionInternaHombroN: form.rotacionInternaHombro=="N",
    rotacionInternaHombroR: form.rotacionInternaHombro=="R",
    rotacionInternaHombroM: form.rotacionInternaHombro=="M",
    rotacionInternaHombroN1: form.rotacionInternaHombroDerecho=="N",
    rotacionInternaHombroR1: form.rotacionInternaHombroDerecho=="R",
    rotacionInternaHombroM1: form.rotacionInternaHombroDerecho=="M",
    rotacionExternaHombroN: form.rotacionExternaHombro=="N",
    rotacionExternaHombroR: form.rotacionExternaHombro=="R",
    rotacionExternaHombroM: form.rotacionExternaHombro=="M",
    rotacionExternaHombroN1: form.rotacionExternaHombroDerecho=="N",
    rotacionExternaHombroR1: form.rotacionExternaHombroDerecho=="R",
    rotacionExternaHombroM1: form.rotacionExternaHombroDerecho=="M",
    flexionBrazoN: form.flexionBrazo=="N",
    flexionBrazoR: form.flexionBrazo=="R",
    flexionBrazoM: form.flexionBrazo=="M",
    flexionBrazoN1: form.flexionBrazoDerecho=="N",
    flexionBrazoR1: form.flexionBrazoDerecho=="R",
    flexionBrazoM1: form.flexionBrazoDerecho=="M",
    extensionBrazoN: form.extensionBrazo=="N",
    extensionBrazoR: form.extensionBrazo=="R",
    extensionBrazoM: form.extensionBrazo=="M",
    extensionBrazoN1: form.extensionBrazoDerecho=="N",
    extensionBrazoR1: form.extensionBrazoDerecho=="R",
    extensionBrazoM1: form.extensionBrazoDerecho=="M",
    pronacionAntebrazoN: form.pronacionAntebrazo=="N",
    pronacionAntebrazoR: form.pronacionAntebrazo=="R",
    pronacionAntebrazoM: form.pronacionAntebrazo=="M",
    pronacionAntebrazoN1: form.pronacionAntebrazoDerecho=="N",
    pronacionAntebrazoR1: form.pronacionAntebrazoDerecho=="R",
    pronacionAntebrazoM1: form.pronacionAntebrazoDerecho=="M",
    supinacionAntebrazoN: form.supinacionAntebrazo=="N",
    supinacionAntebrazoR: form.supinacionAntebrazo=="R",
    supinacionAntebrazoM: form.supinacionAntebrazo=="M",
    supinacionAntebrazoN1: form.supinacionAntebrazoDerecho=="N",
    supinacionAntebrazoR1: form.supinacionAntebrazoDerecho=="R",
    supinacionAntebrazoM1: form.supinacionAntebrazoDerecho=="M",
    flexionMuniecaN: form.flexionMuneca=="N",
    flexionMuniecaR: form.flexionMuneca=="R",
    flexionMuniecaM: form.flexionMuneca=="M",
    flexionMuniecaN1: form.flexionMunecaDerecho=="N",
    flexionMuniecaR1: form.flexionMunecaDerecho=="R",
    flexionMuniecaM1: form.flexionMunecaDerecho=="M",
    extensionMuniecaN: true,
    extensionMuniecaR: true,
    extensionMuniecaM: true,
    extensionMuniecaN1: true,
    extensionMuniecaR1: true,
    extensionMuniecaM1: true,
    desviacionCubitalMuniecaN: true,
    desviacionCubitalMuniecaR: true,
    desviacionCubitalMuniecaM: true,
    desviacionCubitalMuniecaN1: true,
    desviacionCubitalMuniecaR1: true,
    desviacionCubitalMuniecaM1: true,
    desiacionRadialMuniecaN: true,
    desiacionRadialMuniecaR: true,
    desiacionRadialMuniecaM: true,
    desiacionRadialMuniecaN1: true,
    desiacionRadialMuniecaR1: true,
    desiacionRadialMuniecaM1: true,
    phallenSi: true,
    phallenNo: true,
    tinelSi: true,
    tinelNo: true,
    flexionToraxN: true,
    flexionToraxR: true,
    flexionToraxM: true,
    flexionToraxN1: true,
    flexionToraxR1: true,
    flexionToraxM1: true,
    extensionToraxN: true,
    extensionToraxR: true,
    extensionToraxM: true,
    extensionToraxN1: true,
    extensionToraxR1: true,
    extensionToraxM1: true,
    rotacionToraxN: true,
    rotacionToraxR: true,
    rotacionToraxM: true,
    rotacionToraxN1: true,
    rotacionToraxR1: true,
    rotacionToraxM1: true,
    flexionCaderaN: true,
    flexionCaderaR: true,
    flexionCaderaM: true,
    flexionCaderaN1: true,
    flexionCaderaR1: true,
    flexionCaderaM1: true,
    extensionCaderaN: true,
    extensionCaderaR: true,
    extensionCaderaM: true,
    extensionCaderaN1: true,
    extensionCaderaR1: true,
    extensionCaderaM1: true,
    abduccionCaderaN: true,
    abduccionCaderaR: true,
    abduccionCaderaM: true,
    abduccionCaderaN1: true,
    abduccionCaderaR1: true,
    abduccionCaderaM1: true,
    aduccionCaderaN: true,
    aduccionCaderaR: true,
    aduccionCaderaM: true,
    aduccionCaderaN1: true,
    aduccionCaderaR1: true,
    aduccionCaderaM1: true,
    rotacionInternaCaderaN: true,
    rotacionInternaCaderaR: true,
    rotacionInternaCaderaM: true,
    rotacionInternaCaderaN1: true,
    rotacionInternaCaderaR1: true,
    rotacionInternaCaderaM1: true,
    rotacionExternaCaderaN: true,
    rotacionExternaCaderaR: true,
    rotacionExternaCaderaM: true,
    rotacionExternaCaderaN1: true,
    rotacionExternaCaderaR1: true,
    rotacionExternaCaderaM1: true,
    flexionPiernaN: true,
    flexionPiernaR: true,
    flexionPiernaM: true,
    flexionPiernaN1: true,
    flexionPiernaR1: true,
    flexionPiernaM1: true,
    extensionPiernaN: true,
    extensionPiernaR: true,
    extensionPiernaM: true,
    extensionPiernaN1: true,
    extensionPiernaR1: true,
    extensionPiernaM1: true,
    flexionRodillaN: true,
    flexionRodillaR: true,
    flexionRodillaM: true,
    flexionRodillaN1: true,
    flexionRodillaR1: true,
    flexionRodillaM1: true,
    extensionRodillaN: true,
    extensionRodillaR: true,
    extensionRodillaM: true,
    extensionRodillaN1: true,
    extensionRodillaR1: true,
    extensionRodillaM1: true,
    rotacionInternaRodillaN: true,
    rotacionInternaRodillaR: true,
    rotacionInternaRodillaM: true,
    rotacionInternaRodillaN1: true,
    rotacionInternaRodillaR1: true,
    rotacionInternaRodillaM1: true,
    rotacionExternaRodillaN: true,
    rotacionExternaRodillaR: true,
    rotacionExternaRodillaM: true,
    rotacionExternaRodillaN1: true,
    rotacionExternaRodillaR1: true,
    rotacionExternaRodillaM1: true,
    flexionTobilloN: true,
    flexionTobilloR: true,
    flexionTobilloM: true,
    flexionTobilloN1: true,
    flexionTobilloR1: true,
    flexionTobilloM1: true,
    extensionTobilloN: true,
    extensionTobilloR: true,
    extensionTobilloM: true,
    extensionTobilloN1: true,
    extensionTobilloR1: true,
    extensionTobilloM1: true,
    fuerzaMuscularGrado1: true,
    fuerzaMuscularGrado2: true,
    fuerzaMuscularGrado3: true,
    fuerzaMuscularGrado4: true,
    fuerzaMuscularGrado5: true,
    columaVertebralEjeCervicalNormal: true,
    columaVertebralEjeCervicalDerecha: true,
    columaVertebralEjeCervicalIzquierda: true,
    columaVertebralEjeDorsalNormal: true,
    columaVertebralEjeDorsalDerecha: true,
    columaVertebralEjeDorsalIzquierda: true,
    columaVertebralEjeLumbarNormal: true,
    columaVertebralEjeLumbarDerecha: true,
    columaVertebralEjeLumbarIzquierda: true,
    columaVertebralDesviacionCifosisSi: true,
    columaVertebralDesviacionCifosisNo: true,
    columaVertebralDesviacionEscoliosisSi: true,
    columaVertebralDesviacionEscoliosisNo: true,
    columaVertebralDesviacionLordosisSi: true,
    columaVertebralDesviacionLordosisNo: true,
    columaVertebralDesviacionMixtaSi: true,
    columaVertebralDesviacionMixtaNo: true,
    columaVertebralPalpacionCervicalSi: true,
    columaVertebralPalpacionCervicalNo: true,
    columaVertebralPalpacionDorsalSi: true,
    columaVertebralPalpacionDorsalNo: true,
    columaVertebralPalpacionLumbarSi: true,
    columaVertebralPalpacionLumbarNo: true,
    columaVertebralExploracionLesagueDerechoSi: true,
    columaVertebralExploracionLesagueDerechoNo: true,
    columaVertebralExploracionLesagueIzquierdoSi: true,
    columaVertebralExploracionLesagueIzquierdoNo: true,
    tratamientoSi: true,
    tratamientoNo: true,
    dniUser: 0,
    diagnostico: "string",
    conclusionAsintomaticoSi: true,
    conclusionAsintomaticoNo: true,
    recomendaciones: "string",
    userRegistro: "string",
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
function convertirFecha(fecha) {
  if (fecha === "") return "";
  const [dia, mes, anio] = fecha.split("-");
  return `${anio}/${mes.padStart(2, "0")}/${dia.padStart(2, "0")}`;
}

export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          "../../../../../jaspers/Oftalmologia/*.jsx"
        );
        const modulo = await jasperModules[
          `../../../../../jaspers/Oftalmologia/${nombre}.jsx`
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
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Consentimiento.",
          "warning"
        );
      });
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
        fechaNac: convertirFecha(res.fechaNac),
        nombres: res.nombresApellidos,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};
