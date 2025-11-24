import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch";
import { SubmitData } from "../model";

//===============Zona Modificación===============
const obtenerReporteUrl =
  "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica2021";
const registrarUrl =
  "/api/v01/ct/evaluacionMusculoEsqueletica/registrarActualizarEvaluacionMusculoEsqueletica2021";

const leerBoolSINO = (res, name) => {
  if (res[name + "Si"]) {
    return "SI";
  }
  if (res[name + "No"]) {
    return "NO";
  }
  return "";
};

const leerBoolPOSITIVO = (res, name) => {
  if (res[name + "Positivo"]) {
    return "+";
  }
  if (res[name + "Negativo"]) {
    return "-";
  }
  return "";
};

export const GetInfoServicio = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          norden: res.norden ?? "",
          codEvaluacion: res.codEvaluacion ?? "",
          nombres: res.nombres ?? "",
          dni: res.dni ?? "",
          areaTrabajo: res.area ?? "",
          edad: res.edad + " años",
          sexo: res.sexo ?? "",
          fecha: res.fechaExamen,
          empresa: res.empresa ?? "",
          tiempoServicio: res.tiempoServicio ?? "",

          // PARTE 1: APTITUD ESPALDA
          flexFuerzaAbdomen: res.aptitudEspaldaAbdomen ?? "",
          cadera: res.aptitudEspaldaCadera ?? "",
          muslo: res.aptitudEspaldaMuslo ?? "",
          abdomenLateralI: res.aptitudEspaldaAbdomenL ?? "",
          totalAptitudEspalda: res.totalPuntosAptitudEspalda ?? "",
          observacionesAptitudEspalda: res.observacionAptitudEspalda ?? "",

          // PARTE 1: RANGOS ARTICULARES
          abduccionHombro180: res.rangosArticularesAbduccion180 ?? "",
          abduccionHombro60: res.rangosArticularesAbduccion60 ?? "",
          rotacionExterna90: res.rangosArticularesRotacion90 ?? "",
          rotacionExternaHombroInterna:
            res.rangosArticularesRotacionInterna ?? "",
          totalRangosArticulares: res.totalPuntosRangosArticulares ?? "",
          observacionesRangosArticulares:
            res.observacionRangosArticulares ?? "",

          // Campos de dolor contra resistencia
          dolorAbduccionHombro180: leerBoolSINO(
            res,
            "rangosArticularesAbduccion180"
          ),

          dolorAbduccionHombro60: leerBoolSINO(
            res,
            "rangosArticularesAbduccion60"
          ),
          dolorRotacionExterna90: leerBoolSINO(
            res,
            "rangosArticularesRotacion90"
          ),
          dolorRotacionExternaHombroInterna: leerBoolSINO(
            res,
            "rangosArticularesRotacionInterna"
          ),

          // PARTE 2: COLUMNA VERTEBRAL
          desviacionEje: leerBoolSINO(res, "columnaVertebralDesviacion"),
          testAdams: leerBoolPOSITIVO(res, "columnaVertebralAdams"),
          dandy: leerBoolPOSITIVO(res, "columnaVertebralDandy"),
          lasegue: leerBoolPOSITIVO(res, "columnaVertebralLasegue"),
          contracturaMuscular: leerBoolSINO(res, "columnaVertebralContractura"),
          cicatrizPostOperatoria: leerBoolSINO(res, "columnaVertebralCicatriz"),
          desviacionEjeDescripcion:
            res.columnaVertebralDesviacionDescripcion ?? "",
          testAdamsDescripcion: res.columnaVertebralAdamsDescripcion ?? "",
          dandyDescripcion: res.columnaVertebralDandyDescripcion ?? "",
          lasegueDescripcion: res.columnaVertebralLasegueDescripcion ?? "",
          contracturaMuscularDescripcion:
            res.columnaVertebralContracturaDescripcion ?? "",
          cicatrizPostOperatoriaDescripcion:
            res.columnaVertebralCicatrizDescripcion ?? "",

          // PARTE 2: TESTS
          testJobeDerecha: leerBoolSINO(res, "testJobederecha"),
          testJobeIzquierda: leerBoolSINO(res, "testJobeizquierda"),
          testPatteDerecha: leerBoolSINO(res, "testPateDerecha"),
          testPatteIzquierda: leerBoolSINO(res, "testPateIzquierda"),
          testGerberDerecha: leerBoolSINO(res, "testGerberDerecha"),
          testGerberIzquierda: leerBoolSINO(res, "testGerberIzquierda"),
          palmUpTestDerecha: leerBoolSINO(res, "testPulmDerecha"),
          palmUpTestIzquierda: leerBoolSINO(res, "testPulmIzquierda"),
          epicondilitisDerecha: leerBoolSINO(res, "epiconDilitisDerecha"),
          epicondilitisIzquierda: leerBoolSINO(res, "epiconDilitisizquierda"),
          epitrocleitisDerecha: leerBoolSINO(res, "epitroCleitisDerecha"),
          epitrocleitisIzquierda: leerBoolSINO(res, "epitroCleitisIzquierda"),
          phalenDerecha: leerBoolSINO(res, "phalenDerecha"),
          phalenIzquierda: leerBoolSINO(res, "phalenIzquierda"),
          phalenInvertidoDerecha: leerBoolSINO(res, "phalenInvertidoDerecha"),
          phalenInvertidoIzquierda: leerBoolSINO(
            res,
            "phalenInvertidoIzquierda"
          ),

          // PARTE 3: MANIOBRAS DE DESCARTE
          tinnelDerecha: leerBoolSINO(res, "tinnelDerecha"),
          tinnelIzquierda: leerBoolSINO(res, "tinnelIzquierda"),
          finkelsTeinDerecha: leerBoolSINO(res, "finkelsTeinDerecha"),
          finkelsTeinIzquierda: leerBoolSINO(res, "finkelsTeinIzquierda"),

          // PARTE 3: EVAL. DINAMICA - CADERA Y RODILLA
          abduccionCaderaDerecha: res.caderaDerechaAbduccion,
          abduccionCaderaIzquierda: res.caderaIzquierdaAbduccion,

          aduccionCaderaDerecha: res.caderaDerechaAduccion,
          aduccionCaderaIzquierda: res.caderaIzquierdaAduccion,

          flexionCaderaDerecha: res.caderaDerechaFlexion,
          flexionCaderaIzquierda: res.caderaIzquierdaFlexion,
          flexionRodillaDerecha: res.rodillaDerechaFlexion,
          flexionRodillaIzquierda: res.rodillaIzquierdaFlexion,
          extensionCaderaDerecha: res.caderaDerechaExtension,
          extensionCaderaIzquierda: res.caderaIzquierdaExtension,
          extensionRodillaDerecha: res.rodillaDerechaExtension,
          extensionRodillaIzquierda: res.rodillaIzquierdaExtension,
          rotacionExternaCaderaDerecha: res.caderaDerechaRotExterna,
          rotacionExternaCaderaIzquierda: res.caderaIzquierdaRotExterna,
          rotacionExternaRodillaDerecha: res.rodillaDerechaRotExterna,
          rotacionExternaRodillaIzquierda: res.rodillaIzquierdaRotExterna,
          rotacionInternaCaderaDerecha: res.caderaDerechaRotInterna,
          rotacionInternaCaderaIzquierda: res.caderaIzquierdaRotInterna,
          rotacionInternaRodillaDerecha: res.rodillaDerechaRotInterna,
          rotacionInternaRodillaIzquierda: res.rodillaIzquierdaRotInterna,
          irradiacionCaderaDerecha: res.caderaDerechaIrradiacion,
          irradiacionCaderaIzquierda: res.caderaIzquierdaIrradiacion,
          irradiacionRodillaDerecha: res.rodillaDerechaIrradiacion,
          irradiacionRodillaIzquierda: res.rodillaIzquierdaIrradiacion,
          altMasaMuscularCaderaDerecha: res.caderaDerechaMasaMuscular,
          altMasaMuscularCaderaIzquierda: res.caderaIzquierdaMasaMuscular,
          altMasaMuscularRodillaDerecha: res.rodillaDerechaMasaMuscular,
          altMasaMuscularRodillaIzquierda: res.rodillaIzquierdaMasaMuscular,

          // PARTE 4: EVAL. DINAMICA - TOBILLOS
          abduccionTobilloDerecho: res.tobilloDerechoAbduccion,
          abduccionTobilloIzquierdo: res.tobilloIzquierdoAbduccion,
          aduccionTobilloDerecho: res.tobilloDerechoAduccion,
          aduccionTobilloIzquierdo: res.tobilloIzquierdoAduccion,
          flexionTobilloDerecho: res.tobilloDerechoFlexion,
          flexionTobilloIzquierdo: res.tobilloIzquierdoFlexion,
          extensionTobilloDerecho: res.tobilloDerechoExtension,
          extensionTobilloIzquierdo: res.tobilloIzquierdoExtension,
          rotacionExternaTobilloDerecho: res.tobilloDerechoRotExterna,
          rotacionExternaTobilloIzquierdo: res.tobilloIzquierdoRotExterna,
          rotacionInternaTobilloDerecho: res.tobilloDerechoRotInterna,
          rotacionInternaTobilloIzquierdo: res.tobilloIzquierdoRotInterna,
          irradiacionTobilloDerecho: res.tobilloDerechoIrradiacion,
          irradiacionTobilloIzquierdo: res.tobilloIzquierdoIrradiacion,
          altMasaMuscularTobilloDerecho: res.tobilloDerechoMasaMuscular,
          altMasaMuscularTobilloIzquierdo: res.tobilloIzquierdoMasaMuscular,

          cie10: res.cie10,
          conclusiones: res.conclusiones,
          recomendaciones: res.recomendaciones,

          user_medicoFirma: res.usuarioFirma,
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};
const cortarHastaPrimerEspacio = (str) => {
  const index = str.indexOf(" ");
  return index === -1 ? str : str.substring(0, index);
};
export const SubmitDataService = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  datosFooter,
  dniUser
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    codEvaluacion: form.codEvaluacion,
    norden: form.norden,
    dni: form.dni,
    edad: cortarHastaPrimerEspacio(form.edad + ""),
    tiempoServicio: form.tiempoServicio,
    fechaExamen: form.fecha,

    aptitudEspaldaAbdomen: form.flexFuerzaAbdomen,
    aptitudEspaldaCadera: form.cadera,
    aptitudEspaldaMuslo: form.muslo,
    aptitudEspaldaAbdomenL: form.abdomenLateralI,
    totalPuntosAptitudEspalda: form.totalAptitudEspalda,
    observacionAptitudEspalda: form.observacionesAptitudEspalda,
    rangosArticularesAbduccion180: form.abduccionHombro180,
    rangosArticularesAbduccion60: form.abduccionHombro60,
    rangosArticularesRotacion90: form.rotacionExterna90,
    rangosArticularesRotacionInterna: form.rotacionExternaHombroInterna,
    totalPuntosRangosArticulares: form.totalRangosArticulares,
    rangosArticularesAbduccion180Si: form.dolorAbduccionHombro180 == "SI",
    rangosArticularesAbduccion180No: form.dolorAbduccionHombro180 == "NO",
    rangosArticularesAbduccion60Si: form.dolorAbduccionHombro60 == "SI",
    rangosArticularesAbduccion60No: form.dolorAbduccionHombro60 == "NO",
    rangosArticularesRotacion90Si: form.dolorRotacionExterna90 == "SI",
    rangosArticularesRotacion90No: form.dolorRotacionExterna90 == "NO",
    rangosArticularesRotacionInternaSi:
      form.dolorRotacionExternaHombroInterna == "SI",
    rangosArticularesRotacionInternaNo:
      form.dolorRotacionExternaHombroInterna == "NO",
    observacionRangosArticulares: form.observacionesRangosArticulares,

    columnaVertebralDesviacionSi: form.desviacionEje == "SI",
    columnaVertebralDesviacionNo: form.desviacionEje == "NO",
    columnaVertebralDesviacionDescripcion: form.desviacionEjeDescripcion,
    columnaVertebralAdamsPositivo: form.testAdams == "+",
    columnaVertebralAdamsNegativo: form.testAdams == "-",
    columnaVertebralAdamsDescripcion: form.testAdamsDescripcion,
    columnaVertebralDandyPositivo: form.dandy == "+",
    columnaVertebralDandyNegativo: form.dandy == "-",
    columnaVertebralDandyDescripcion: form.dandyDescripcion,
    columnaVertebralLaseguePositivo: form.lasegue == "+",
    columnaVertebralLasegueNegativo: form.lasegue == "-",
    columnaVertebralLasegueDescripcion: form.lasegueDescripcion,
    columnaVertebralContracturaSi: form.contracturaMuscular == "SI",
    columnaVertebralContracturaNo: form.contracturaMuscular == "NO",
    columnaVertebralContracturaDescripcion: form.contracturaMuscularDescripcion,
    columnaVertebralCicatrizSi: form.cicatrizPostOperatoria == "SI",
    columnaVertebralCicatrizNo: form.cicatrizPostOperatoria == "NO",
    columnaVertebralCicatrizDescripcion: form.cicatrizPostOperatoriaDescripcion,
    testJobederechaSi: form.testJobeDerecha == "SI",
    testJobederechaNo: form.testJobeDerecha == "NO",
    testJobeizquierdaSi: form.testJobeIzquierda == "SI",
    testJobeizquierdaNo: form.testJobeIzquierda == "NO",
    testPateDerechaSi: form.testPatteDerecha == "SI",
    testPateDerechaNo: form.testPatteDerecha == "NO",
    testPateIzquierdaSi: form.testPatteIzquierda == "SI",
    testPateIzquierdaNo: form.testPatteIzquierda == "NO",
    testGerberDerechaSi: form.testGerberDerecha == "SI",
    testGerberDerechaNo: form.testGerberDerecha == "NO",
    testGerberIzquierdaSi: form.testGerberIzquierda == "SI",
    testGerberIzquierdaNo: form.testGerberIzquierda == "NO",
    testPulmDerechaSi: form.palmUpTestDerecha == "SI",
    testPulmDerechaNo: form.palmUpTestDerecha == "NO",
    testPulmIzquierdaSi: form.palmUpTestIzquierda == "SI",
    testPulmIzquierdaNo: form.palmUpTestIzquierda == "NO",
    epiconDilitisDerechaSi: form.epicondilitisDerecha == "SI",
    epiconDilitisDerechaNo: form.epicondilitisDerecha == "NO",
    epiconDilitisizquierdaSi: form.epicondilitisIzquierda == "SI",
    epiconDilitisizquierdaNo: form.epicondilitisIzquierda == "NO",
    epitroCleitisDerechaSi: form.epitrocleitisDerecha == "SI",
    epitroCleitisDerechaNo: form.epitrocleitisDerecha == "NO",
    epitroCleitisIzquierdaSi: form.epitrocleitisIzquierda == "SI",
    epitroCleitisIzquierdaNo: form.epitrocleitisIzquierda == "NO",
    phalenDerechaSi: form.phalenDerecha == "SI",
    phalenDerechaNo: form.phalenDerecha == "NO",
    phalenIzquierdaSi: form.phalenIzquierda == "SI",
    phalenIzquierdaNo: form.phalenIzquierda == "NO",
    phalenInvertidoDerechaSi: form.phalenInvertidoDerecha == "SI",
    phalenInvertidoDerechaNo: form.phalenInvertidoDerecha == "NO",
    phalenInvertidoIzquierdaSi: form.phalenInvertidoIzquierda == "SI",
    phalenInvertidoIzquierdaNo: form.phalenInvertidoIzquierda == "NO",

    tinnelDerechaSi: form.tinnelDerecha == "SI",
    tinnelDerechaNo: form.tinnelDerecha == "NO",
    tinnelIzquierdaSi: form.tinnelIzquierda == "SI",
    tinnelIzquierdaNo: form.tinnelIzquierda == "NO",
    finkelsTeinDerechaSi: form.finkelsTeinDerecha == "SI",
    finkelsTeinDerechaNo: form.finkelsTeinDerecha == "NO",
    finkelsTeinIzquierdaSi: form.finkelsTeinIzquierda == "SI",
    finkelsTeinIzquierdaNo: form.finkelsTeinIzquierda == "NO",

    caderaDerechaAbduccion: form.abduccionCaderaDerecha,
    caderaDerechaAduccion: form.aduccionCaderaDerecha,
    caderaDerechaFlexion: form.flexionCaderaDerecha,
    caderaDerechaExtension: form.extensionCaderaDerecha,
    caderaDerechaRotExterna: form.rotacionExternaCaderaDerecha,
    caderaDerechaRotInterna: form.rotacionInternaCaderaDerecha,
    caderaDerechaIrradiacion: form.irradiacionCaderaDerecha,
    caderaDerechaMasaMuscular: form.altMasaMuscularCaderaDerecha,

    caderaIzquierdaAbduccion: form.abduccionCaderaIzquierda,
    caderaIzquierdaAduccion: form.aduccionCaderaIzquierda,
    caderaIzquierdaFlexion: form.flexionCaderaIzquierda,
    caderaIzquierdaExtension: form.extensionCaderaIzquierda,
    caderaIzquierdaRotExterna: form.rotacionExternaCaderaIzquierda,
    caderaIzquierdaRotInterna: form.rotacionInternaCaderaIzquierda,
    caderaIzquierdaIrradiacion: form.irradiacionCaderaIzquierda,
    caderaIzquierdaMasaMuscular: form.altMasaMuscularCaderaIzquierda,
    rodillaDerechaFlexion: form.flexionRodillaDerecha,
    rodillaDerechaExtension: form.extensionRodillaDerecha,
    rodillaDerechaRotExterna: form.rotacionExternaRodillaDerecha,
    rodillaDerechaRotInterna: form.rotacionInternaRodillaDerecha,
    rodillaDerechaIrradiacion: form.irradiacionRodillaDerecha,
    rodillaDerechaMasaMuscular: form.altMasaMuscularRodillaDerecha,
    rodillaIzquierdaFlexion: form.flexionRodillaIzquierda,
    rodillaIzquierdaExtension: form.extensionRodillaIzquierda,
    rodillaIzquierdaRotExterna: form.rotacionExternaRodillaIzquierda,
    rodillaIzquierdaRotInterna: form.rotacionInternaRodillaIzquierda,
    rodillaIzquierdaIrradiacion: form.irradiacionRodillaIzquierda,
    rodillaIzquierdaMasaMuscular: form.altMasaMuscularRodillaIzquierda,

    tobilloDerechoAbduccion: form.abduccionTobilloDerecho,
    tobilloDerechoAduccion: form.aduccionTobilloDerecho,
    tobilloDerechoFlexion: form.flexionTobilloDerecho,
    tobilloDerechoExtension: form.extensionTobilloDerecho,
    tobilloDerechoRotExterna: form.rotacionExternaTobilloDerecho,
    tobilloDerechoRotInterna: form.rotacionInternaTobilloDerecho,
    tobilloDerechoIrradiacion: form.irradiacionTobilloDerecho,
    tobilloDerechoMasaMuscular: form.altMasaMuscularTobilloDerecho,

    tobilloIzquierdoAbduccion: form.abduccionTobilloIzquierdo,
    tobilloIzquierdoAduccion: form.aduccionTobilloIzquierdo,
    tobilloIzquierdoFlexion: form.flexionTobilloIzquierdo,
    tobilloIzquierdoExtension: form.extensionTobilloIzquierdo,
    tobilloIzquierdoRotExterna: form.rotacionExternaTobilloIzquierdo,
    tobilloIzquierdoRotInterna: form.rotacionInternaTobilloIzquierdo,
    tobilloIzquierdoIrradiacion: form.irradiacionTobilloIzquierdo,
    tobilloIzquierdoMasaMuscular: form.altMasaMuscularTobilloIzquierdo,
    conclusiones: form.conclusiones,
    cie10: form.cie10,
    recomendaciones: form.recomendaciones,
    medico: form.nombreMedico,

    usuarioFirma: form.user_medicoFirma,
    dniUser: dniUser,
    userRegistro: user,
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
          PrintHojaR(form.norden, token, tabla, datosFooter);
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

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          "../../../../../jaspers/MusculoEsqueletica/*.jsx"
        );
        const modulo = await jasperModules[
          `../../../../../jaspers/MusculoEsqueletica/${nombre}.jsx`
        ]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === "function") {
          modulo.default({ ...res, ...datosFooter });
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
    html: `
      <div style="font-size:1.1em;overflow:hidden;">
        <span style="color:#0d9488;font-weight:bold;"></span>
      </div>
      <div style="margin-top:10px;overflow:hidden;">Espere por favor...</div>
      <div style="margin-top:10px;overflow:hidden;">
        <i class="fa fa-spinner fa-spin fa-2x" style="color:#0d9488;"></i>
      </div>
    `,
    icon: "info",
    background: "#f0f6ff",
    color: "#22223b",
    showConfirmButton: false,
    allowOutsideClick: true,
    allowEscapeKey: false,
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
        sexo: res.genero,
        edad: res.edad + " años",
        nombres: res.nombresApellidos,
        areaTrabajo: res.areaO,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};
