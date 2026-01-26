import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch";
import { SubmitData } from "../model";
import jsPDF from "jspdf";

//===============Zona Modificación===============
const obtenerReporteUrl =
  "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica";
const registrarUrl =
  "/api/v01/ct/evaluacionMusculoEsqueletica/registrarActualizarEvaluacionMusculoEsqueletica";
const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
const leerBoolSI = (bool) => {
  return bool ? "SI" : "NO";
};
const leerOpcion = (res, name) =>
  ["N", "R", "M"].find((op) => res[`${name}${op}`]) || "";

const leerOpcionDerecho = (res, name) =>
  ["N", "R", "M"].find((op) => res[`${name}${op}1`]) || "";

const leerOpcionNorDerIz = (res, name) =>
  [
    ["Normal", "NORMAL"],
    ["Derecha", "DERECHA"],
    ["Izquierda", "CONCAV. IZQUIERDA"],
  ].find(([sufijo]) => res[`${name}${sufijo}`])?.[1] || "";

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
          nombres: res.paciente.nombres ?? "",
          dni: res.paciente.dni ?? "",
          areaTrabajo: res.paciente.areaTrabajo ?? "",
          edad: res.paciente.edad + " años",
          sexo: res.paciente.sexo ?? "",
          fecha: res.fechaExamen,
          empresa: res.paciente.empresa ?? "",
          tiempoServicio: res.tipoServicio ?? "",

          // Síntomas
          sintomas: leerBoolSI(res.sintomaSi),
          cualesSintomas: res.sintomas ?? "",

          // Uso de Faja Lumbar
          usoFajaLumbar: leerBoolSI(res.fajaSi),

          // Técnica de Levantamiento
          tecnicaLevantamiento: leerBoolSI(res.adecuadaTecnicacargaSi),

          // Capacitación
          capacitacionLevantamiento: leerBoolSI(
            res.capacitacionLevantamientoCargaSi
          ),

          // Cabeza y Cuello
          extensionCabeza: res.extencionCabeza,
          flexionCabeza: res.flexionCabeza,
          gradoExtension: leerOpcion(res, "extensionCabeza"),
          gradoFlexion: leerOpcion(res, "flexionCabeza"),

          // Miembros Superiores - Tórax
          flexionTorax: leerOpcion(res, "flexionTorax"),
          extensionTorax: leerOpcion(res, "extensionTorax"),
          rotacionTorax: leerOpcion(res, "rotacionTorax"),
          flexionToraxDerecho: leerOpcionDerecho(res, "flexionTorax"),
          extensionToraxDerecho: leerOpcionDerecho(res, "extensionTorax"),
          rotacionToraxDerecho: leerOpcionDerecho(res, "rotacionTorax"),

          // Miembros Superiores - Hombro
          flexionHombro: leerOpcion(res, "flexionHombro"),
          extensionHombro: leerOpcion(res, "extensionHombro"),
          abduccionHombro: leerOpcion(res, "abduccionHombro"),
          aduccionHombro: leerOpcion(res, "aduccionHombro"),
          rotacionInternaHombro: leerOpcion(res, "rotacionInternaHombro"),
          rotacionExternaHombro: leerOpcion(res, "rotacionExternaHombro"),
          flexionHombroDerecho: leerOpcionDerecho(res, "flexionHombro"),
          extensionHombroDerecho: leerOpcionDerecho(res, "extensionHombro"),
          abduccionHombroDerecho: leerOpcionDerecho(res, "abduccionHombro"),
          aduccionHombroDerecho: leerOpcionDerecho(res, "aduccionHombro"),
          rotacionInternaHombroDerecho: leerOpcionDerecho(
            res,
            "rotacionInternaHombro"
          ),
          rotacionExternaHombroDerecho: leerOpcionDerecho(
            res,
            "rotacionExternaHombro"
          ),

          // Miembros Superiores - Brazo
          flexionBrazo: leerOpcion(res, "flexionBrazo"),
          extensionBrazo: leerOpcion(res, "extensionBrazo"),
          flexionBrazoDerecho: leerOpcionDerecho(res, "flexionBrazo"),
          extensionBrazoDerecho: leerOpcionDerecho(res, "extensionBrazo"),

          // Miembros Superiores - Antebrazo
          pronacionAntebrazo: leerOpcion(res, "pronacionAntebrazo"),
          supinacionAntebrazo: leerOpcion(res, "supinacionAntebrazo"),
          pronacionAntebrazoDerecho: leerOpcionDerecho(
            res,
            "pronacionAntebrazo"
          ),
          supinacionAntebrazoDerecho: leerOpcionDerecho(
            res,
            "supinacionAntebrazo"
          ),

          // Examen Físico II - Muñeca
          flexionMuneca: leerOpcion(res, "flexionMunieca"),
          extensionMuneca: leerOpcion(res, "extensionMunieca"),
          desviacionCubitalMuneca: leerOpcion(res, "desviacionCubitalMunieca"),
          desviacionRadialMuneca: leerOpcion(res, "desiacionRadialMunieca"),
          // Muñeca - Lado Derecho
          flexionMunecaDerecho: leerOpcionDerecho(res, "flexionMunieca"),
          extensionMunecaDerecho: leerOpcionDerecho(res, "extensionMunieca"),
          desviacionCubitalMunecaDerecho: leerOpcionDerecho(
            res,
            "desviacionCubitalMunieca"
          ),
          desviacionRadialMunecaDerecho: leerOpcionDerecho(
            res,
            "desiacionRadialMunieca"
          ),
          signoPhallen: leerBoolSI(res.phallenSi),
          signoTinel: leerBoolSI(res.tinelSi),

          // Examen Físico II - Cadera
          flexionCadera: leerOpcion(res, "flexionCadera"),
          extensionCadera: leerOpcion(res, "extensionCadera"),
          abduccionCadera: leerOpcion(res, "abduccionCadera"),
          aduccionCadera: leerOpcion(res, "aduccionCadera"),
          rotacionInternaCadera: leerOpcion(res, "rotacionInternaCadera"),
          rotacionExternaCadera: leerOpcion(res, "rotacionExternaCadera"),
          // Cadera - Lado Derecho
          flexionCaderaDerecho: leerOpcionDerecho(res, "flexionCadera"),
          extensionCaderaDerecho: leerOpcionDerecho(res, "extensionCadera"),
          abduccionCaderaDerecho: leerOpcionDerecho(res, "abduccionCadera"),
          aduccionCaderaDerecho: leerOpcionDerecho(res, "aduccionCadera"),
          rotacionInternaCaderaDerecho: leerOpcionDerecho(
            res,
            "rotacionInternaCadera"
          ),
          rotacionExternaCaderaDerecho: leerOpcionDerecho(
            res,
            "rotacionExternaCadera"
          ),

          // Examen Físico II - Pierna
          flexionPierna: leerOpcion(res, "flexionPierna"),
          extensionPierna: leerOpcion(res, "extensionPierna"),
          // Pierna - Lado Derecho
          flexionPiernaDerecho: leerOpcionDerecho(res, "flexionPierna"),
          extensionPiernaDerecho: leerOpcionDerecho(res, "extensionPierna"),

          // Examen Físico II - Rodilla
          flexionRodilla: leerOpcion(res, "flexionRodilla"),
          extensionRodilla: leerOpcion(res, "extensionRodilla"),
          rotacionInternaRodilla: leerOpcion(res, "rotacionInternaRodilla"),
          rotacionExternaRodilla: leerOpcion(res, "rotacionExternaRodilla"),
          // Rodilla - Lado Derecho
          flexionRodillaDerecho: leerOpcionDerecho(res, "flexionRodilla"),
          extensionRodillaDerecho: leerOpcionDerecho(res, "extensionRodilla"),
          rotacionInternaRodillaDerecho: leerOpcionDerecho(
            res,
            "rotacionInternaRodilla"
          ),
          rotacionExternaRodillaDerecho: leerOpcionDerecho(
            res,
            "rotacionExternaRodilla"
          ),

          // Examen Físico III - Tobillo
          flexionTobillo: leerOpcion(res, "flexionTobillo"),
          extensionTobillo: leerOpcion(res, "extensionTobillo"),
          // Tobillo - Lado Derecho
          flexionTobilloDerecho: leerOpcionDerecho(res, "flexionTobillo"),
          extensionTobilloDerecho: leerOpcionDerecho(res, "extensionTobillo"),

          // Examen Físico III - Columna Vertebral
          desviacionEjeCervical: leerOpcionNorDerIz(
            res,
            "columaVertebralEjeCervical"
          ),

          desviacionEjeDorsal: leerOpcionNorDerIz(
            res,
            "columaVertebralEjeDorsal"
          ),
          desviacionEjeLumbar: leerOpcionNorDerIz(
            res,
            "columaVertebralEjeLumbar"
          ),
          cifosis: leerBoolSI(res.columaVertebralDesviacionCifosisSi),
          escoliosis: leerBoolSI(res.columaVertebralDesviacionEscoliosisSi),
          lordosis: leerBoolSI(res.columaVertebralDesviacionLordosisSi),
          mixta: leerBoolSI(res.columaVertebralDesviacionMixtaSi),
          fuerzaMuscular:
            ["1", "2", "3", "4", "5"].find(
              (g) => res[`fuerzaMuscularGrado${g}`]
            ) || "",
          dolorCervical: leerBoolSI(res.columaVertebralPalpacionCervicalSi),
          dolorDorsal: leerBoolSI(res.columaVertebralPalpacionDorsalSi),
          dolorLumbar: leerBoolSI(res.columaVertebralPalpacionLumbarSi),
          signoLesagueDerecho: leerBoolSI(
            res.columaVertebralExploracionLesagueDerechoSi
          ),
          signoLesagueIzquierdo: leerBoolSI(
            res.columaVertebralExploracionLesagueIzquierdoSi
          ),

          // Conclusión y Comentarios
          tratamiento: leerBoolSI(res.tratamientoSi),
          conclusion: leerBoolSI(res.conclusionAsintomaticoSi),
          diagnostico: res.diagnostico ?? "",
          recomendaciones: res.recomendaciones ?? "",
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
    extensionCabezaN: form.gradoExtension == "N",
    extensionCabezaR: form.gradoExtension == "R",
    extensionCabezaM: form.gradoExtension == "M",
    flexionCabezaN: form.gradoFlexion == "N",
    flexionCabezaR: form.gradoFlexion == "R",
    flexionCabezaM: form.gradoFlexion == "M",

    flexionHombroN: form.flexionHombro == "N",
    flexionHombroR: form.flexionHombro == "R",
    flexionHombroM: form.flexionHombro == "M",
    flexionHombroN1: form.flexionHombroDerecho == "N",
    flexionHombroR1: form.flexionHombroDerecho == "R",
    flexionHombroM1: form.flexionHombroDerecho == "M",
    extensionHombroN: form.extensionHombro == "N",
    extensionHombroR: form.extensionHombro == "R",
    extensionHombroM: form.extensionHombro == "M",
    extensionHombroN1: form.extensionHombroDerecho == "N",
    extensionHombroR1: form.extensionHombroDerecho == "R",
    extensionHombroM1: form.extensionHombroDerecho == "M",
    abduccionHombroN: form.abduccionHombro == "N",
    abduccionHombroR: form.abduccionHombro == "R",
    abduccionHombroM: form.abduccionHombro == "M",
    abduccionHombroN1: form.abduccionHombroDerecho == "N",
    abduccionHombroR1: form.abduccionHombroDerecho == "R",
    abduccionHombroM1: form.abduccionHombroDerecho == "M",
    aduccionHombroN: form.aduccionHombro == "N",
    aduccionHombroR: form.aduccionHombro == "R",
    aduccionHombroM: form.aduccionHombro == "M",
    aduccionHombroN1: form.aduccionHombroDerecho == "N",
    aduccionHombroR1: form.aduccionHombroDerecho == "R",
    aduccionHombroM1: form.aduccionHombroDerecho == "M",
    rotacionInternaHombroN: form.rotacionInternaHombro == "N",
    rotacionInternaHombroR: form.rotacionInternaHombro == "R",
    rotacionInternaHombroM: form.rotacionInternaHombro == "M",
    rotacionInternaHombroN1: form.rotacionInternaHombroDerecho == "N",
    rotacionInternaHombroR1: form.rotacionInternaHombroDerecho == "R",
    rotacionInternaHombroM1: form.rotacionInternaHombroDerecho == "M",
    rotacionExternaHombroN: form.rotacionExternaHombro == "N",
    rotacionExternaHombroR: form.rotacionExternaHombro == "R",
    rotacionExternaHombroM: form.rotacionExternaHombro == "M",
    rotacionExternaHombroN1: form.rotacionExternaHombroDerecho == "N",
    rotacionExternaHombroR1: form.rotacionExternaHombroDerecho == "R",
    rotacionExternaHombroM1: form.rotacionExternaHombroDerecho == "M",
    flexionBrazoN: form.flexionBrazo == "N",
    flexionBrazoR: form.flexionBrazo == "R",
    flexionBrazoM: form.flexionBrazo == "M",
    flexionBrazoN1: form.flexionBrazoDerecho == "N",
    flexionBrazoR1: form.flexionBrazoDerecho == "R",
    flexionBrazoM1: form.flexionBrazoDerecho == "M",
    extensionBrazoN: form.extensionBrazo == "N",
    extensionBrazoR: form.extensionBrazo == "R",
    extensionBrazoM: form.extensionBrazo == "M",
    extensionBrazoN1: form.extensionBrazoDerecho == "N",
    extensionBrazoR1: form.extensionBrazoDerecho == "R",
    extensionBrazoM1: form.extensionBrazoDerecho == "M",
    pronacionAntebrazoN: form.pronacionAntebrazo == "N",
    pronacionAntebrazoR: form.pronacionAntebrazo == "R",
    pronacionAntebrazoM: form.pronacionAntebrazo == "M",
    pronacionAntebrazoN1: form.pronacionAntebrazoDerecho == "N",
    pronacionAntebrazoR1: form.pronacionAntebrazoDerecho == "R",
    pronacionAntebrazoM1: form.pronacionAntebrazoDerecho == "M",
    supinacionAntebrazoN: form.supinacionAntebrazo == "N",
    supinacionAntebrazoR: form.supinacionAntebrazo == "R",
    supinacionAntebrazoM: form.supinacionAntebrazo == "M",
    supinacionAntebrazoN1: form.supinacionAntebrazoDerecho == "N",
    supinacionAntebrazoR1: form.supinacionAntebrazoDerecho == "R",
    supinacionAntebrazoM1: form.supinacionAntebrazoDerecho == "M",
    flexionMuniecaN: form.flexionMuneca == "N",
    flexionMuniecaR: form.flexionMuneca == "R",
    flexionMuniecaM: form.flexionMuneca == "M",
    flexionMuniecaN1: form.flexionMunecaDerecho == "N",
    flexionMuniecaR1: form.flexionMunecaDerecho == "R",
    flexionMuniecaM1: form.flexionMunecaDerecho == "M",
    extensionMuniecaN: form.extensionMuneca == "N",
    extensionMuniecaR: form.extensionMuneca == "R",
    extensionMuniecaM: form.extensionMuneca == "M",
    extensionMuniecaN1: form.extensionMunecaDerecho == "N",
    extensionMuniecaR1: form.extensionMunecaDerecho == "R",
    extensionMuniecaM1: form.extensionMunecaDerecho == "M",
    desviacionCubitalMuniecaN: form.desviacionCubitalMuneca == "N",
    desviacionCubitalMuniecaR: form.desviacionCubitalMuneca == "R",
    desviacionCubitalMuniecaM: form.desviacionCubitalMuneca == "M",
    desviacionCubitalMuniecaN1: form.desviacionCubitalMunecaDerecho == "N",
    desviacionCubitalMuniecaR1: form.desviacionCubitalMunecaDerecho == "R",
    desviacionCubitalMuniecaM1: form.desviacionCubitalMunecaDerecho == "M",
    desiacionRadialMuniecaN: form.desviacionRadialMuneca == "N",
    desiacionRadialMuniecaR: form.desviacionRadialMuneca == "R",
    desiacionRadialMuniecaM: form.desviacionRadialMuneca == "M",
    desiacionRadialMuniecaN1: form.desviacionRadialMunecaDerecho == "N",
    desiacionRadialMuniecaR1: form.desviacionRadialMunecaDerecho == "R",
    desiacionRadialMuniecaM1: form.desviacionRadialMunecaDerecho == "M",
    phallenSi: form.signoPhallen == "SI",
    phallenNo: form.signoPhallen == "NO",
    tinelSi: form.signoTinel == "SI",
    tinelNo: form.signoTinel == "NO",

    flexionToraxN: form.flexionTorax == "N",
    flexionToraxR: form.flexionTorax == "R",
    flexionToraxM: form.flexionTorax == "M",
    flexionToraxN1: form.flexionToraxDerecho == "N",
    flexionToraxR1: form.flexionToraxDerecho == "R",
    flexionToraxM1: form.flexionToraxDerecho == "M",
    extensionToraxN: form.extensionTorax == "N",
    extensionToraxR: form.extensionTorax == "R",
    extensionToraxM: form.extensionTorax == "M",
    extensionToraxN1: form.extensionToraxDerecho == "N",
    extensionToraxR1: form.extensionToraxDerecho == "R",
    extensionToraxM1: form.extensionToraxDerecho == "M",
    rotacionToraxN: form.rotacionTorax == "N",
    rotacionToraxR: form.rotacionTorax == "R",
    rotacionToraxM: form.rotacionTorax == "M",
    rotacionToraxN1: form.rotacionToraxDerecho == "N",
    rotacionToraxR1: form.rotacionToraxDerecho == "R",
    rotacionToraxM1: form.rotacionToraxDerecho == "M",
    flexionCaderaN: form.flexionCadera == "N",
    flexionCaderaR: form.flexionCadera == "R",
    flexionCaderaM: form.flexionCadera == "M",
    flexionCaderaN1: form.flexionCaderaDerecho == "N",
    flexionCaderaR1: form.flexionCaderaDerecho == "R",
    flexionCaderaM1: form.flexionCaderaDerecho == "M",
    extensionCaderaN: form.extensionCadera == "N",
    extensionCaderaR: form.extensionCadera == "R",
    extensionCaderaM: form.extensionCadera == "M",
    extensionCaderaN1: form.extensionCaderaDerecho == "N",
    extensionCaderaR1: form.extensionCaderaDerecho == "R",
    extensionCaderaM1: form.extensionCaderaDerecho == "M",
    abduccionCaderaN: form.abduccionCadera == "N",
    abduccionCaderaR: form.abduccionCadera == "R",
    abduccionCaderaM: form.abduccionCadera == "M",
    abduccionCaderaN1: form.abduccionCaderaDerecho == "N",
    abduccionCaderaR1: form.abduccionCaderaDerecho == "R",
    abduccionCaderaM1: form.abduccionCaderaDerecho == "M",
    aduccionCaderaN: form.aduccionCadera == "N",
    aduccionCaderaR: form.aduccionCadera == "R",
    aduccionCaderaM: form.aduccionCadera == "M",
    aduccionCaderaN1: form.aduccionCaderaDerecho == "N",
    aduccionCaderaR1: form.aduccionCaderaDerecho == "R",
    aduccionCaderaM1: form.aduccionCaderaDerecho == "M",
    rotacionInternaCaderaN: form.rotacionInternaCadera == "N",
    rotacionInternaCaderaR: form.rotacionInternaCadera == "R",
    rotacionInternaCaderaM: form.rotacionInternaCadera == "M",
    rotacionInternaCaderaN1: form.rotacionInternaCaderaDerecho == "N",
    rotacionInternaCaderaR1: form.rotacionInternaCaderaDerecho == "R",
    rotacionInternaCaderaM1: form.rotacionInternaCaderaDerecho == "M",
    rotacionExternaCaderaN: form.rotacionExternaCadera == "N",
    rotacionExternaCaderaR: form.rotacionExternaCadera == "R",
    rotacionExternaCaderaM: form.rotacionExternaCadera == "M",
    rotacionExternaCaderaN1: form.rotacionExternaCaderaDerecho == "N",
    rotacionExternaCaderaR1: form.rotacionExternaCaderaDerecho == "R",
    rotacionExternaCaderaM1: form.rotacionExternaCaderaDerecho == "M",
    flexionPiernaN: form.flexionPierna == "N",
    flexionPiernaR: form.flexionPierna == "R",
    flexionPiernaM: form.flexionPierna == "M",
    flexionPiernaN1: form.flexionPiernaDerecho == "N",
    flexionPiernaR1: form.flexionPiernaDerecho == "R",
    flexionPiernaM1: form.flexionPiernaDerecho == "M",
    extensionPiernaN: form.extensionPierna == "N",
    extensionPiernaR: form.extensionPierna == "R",
    extensionPiernaM: form.extensionPierna == "M",
    extensionPiernaN1: form.extensionPiernaDerecho == "N",
    extensionPiernaR1: form.extensionPiernaDerecho == "R",
    extensionPiernaM1: form.extensionPiernaDerecho == "M",
    flexionRodillaN: form.flexionRodilla == "N",
    flexionRodillaR: form.flexionRodilla == "R",
    flexionRodillaM: form.flexionRodilla == "M",
    flexionRodillaN1: form.flexionRodillaDerecho == "N",
    flexionRodillaR1: form.flexionRodillaDerecho == "R",
    flexionRodillaM1: form.flexionRodillaDerecho == "M",
    extensionRodillaN: form.extensionRodilla == "N",
    extensionRodillaR: form.extensionRodilla == "R",
    extensionRodillaM: form.extensionRodilla == "M",
    extensionRodillaN1: form.extensionRodillaDerecho == "N",
    extensionRodillaR1: form.extensionRodillaDerecho == "R",
    extensionRodillaM1: form.extensionRodillaDerecho == "M",
    rotacionInternaRodillaN: form.rotacionInternaRodilla == "N",
    rotacionInternaRodillaR: form.rotacionInternaRodilla == "R",
    rotacionInternaRodillaM: form.rotacionInternaRodilla == "M",
    rotacionInternaRodillaN1: form.rotacionInternaRodillaDerecho == "N",
    rotacionInternaRodillaR1: form.rotacionInternaRodillaDerecho == "R",
    rotacionInternaRodillaM1: form.rotacionInternaRodillaDerecho == "M",
    rotacionExternaRodillaN: form.rotacionExternaRodilla == "N",
    rotacionExternaRodillaR: form.rotacionExternaRodilla == "R",
    rotacionExternaRodillaM: form.rotacionExternaRodilla == "M",
    rotacionExternaRodillaN1: form.rotacionExternaRodillaDerecho == "N",
    rotacionExternaRodillaR1: form.rotacionExternaRodillaDerecho == "R",
    rotacionExternaRodillaM1: form.rotacionExternaRodillaDerecho == "M",
    flexionTobilloN: form.flexionTobillo == "N",
    flexionTobilloR: form.flexionTobillo == "R",
    flexionTobilloM: form.flexionTobillo == "M",
    flexionTobilloN1: form.flexionTobilloDerecho == "N",
    flexionTobilloR1: form.flexionTobilloDerecho == "R",
    flexionTobilloM1: form.flexionTobilloDerecho == "M",
    extensionTobilloN: form.extensionTobillo == "N",
    extensionTobilloR: form.extensionTobillo == "R",
    extensionTobilloM: form.extensionTobillo == "M",
    extensionTobilloN1: form.extensionTobilloDerecho == "N",
    extensionTobilloR1: form.extensionTobilloDerecho == "R",
    extensionTobilloM1: form.extensionTobilloDerecho == "M",
    fuerzaMuscularGrado1: form.fuerzaMuscular == "1",
    fuerzaMuscularGrado2: form.fuerzaMuscular == "2",
    fuerzaMuscularGrado3: form.fuerzaMuscular == "3",
    fuerzaMuscularGrado4: form.fuerzaMuscular == "4",
    fuerzaMuscularGrado5: form.fuerzaMuscular == "5",
    columaVertebralEjeCervicalNormal: form.desviacionEjeCervical == "NORMAL",
    columaVertebralEjeCervicalDerecha: form.desviacionEjeCervical == "DERECHA",
    columaVertebralEjeCervicalIzquierda:
      form.desviacionEjeCervical == "CONCAV. IZQUIERDA",
    columaVertebralEjeDorsalNormal: form.desviacionEjeDorsal == "NORMAL",
    columaVertebralEjeDorsalDerecha: form.desviacionEjeDorsal == "DERECHA",
    columaVertebralEjeDorsalIzquierda:
      form.desviacionEjeDorsal == "CONCAV. IZQUIERDA",
    columaVertebralEjeLumbarNormal: form.desviacionEjeLumbar == "NORMAL",
    columaVertebralEjeLumbarDerecha: form.desviacionEjeLumbar == "DERECHA",
    columaVertebralEjeLumbarIzquierda:
      form.desviacionEjeLumbar == "CONCAV. IZQUIERDA",
    columaVertebralDesviacionCifosisSi: form.cifosis == "SI",
    columaVertebralDesviacionCifosisNo: form.cifosis == "NO",
    columaVertebralDesviacionEscoliosisSi: form.escoliosis == "SI",
    columaVertebralDesviacionEscoliosisNo: form.escoliosis == "NO",
    columaVertebralDesviacionLordosisSi: form.lordosis == "SI",
    columaVertebralDesviacionLordosisNo: form.lordosis == "NO",
    columaVertebralDesviacionMixtaSi: form.mixta == "SI",
    columaVertebralDesviacionMixtaNo: form.mixta == "NO",
    columaVertebralPalpacionCervicalSi: form.dolorCervical == "SI",
    columaVertebralPalpacionCervicalNo: form.dolorCervical == "NO",
    columaVertebralPalpacionDorsalSi: form.dolorDorsal == "SI",
    columaVertebralPalpacionDorsalNo: form.dolorDorsal == "NO",
    columaVertebralPalpacionLumbarSi: form.dolorLumbar == "SI",
    columaVertebralPalpacionLumbarNo: form.dolorLumbar == "NO",
    columaVertebralExploracionLesagueDerechoSi:
      form.signoLesagueDerecho == "SI",
    columaVertebralExploracionLesagueDerechoNo:
      form.signoLesagueDerecho == "NO",
    columaVertebralExploracionLesagueIzquierdoSi:
      form.signoLesagueIzquierdo == "SI",
    columaVertebralExploracionLesagueIzquierdoNo:
      form.signoLesagueIzquierdo == "NO",
    tratamientoSi: form.tratamiento == "SI",
    tratamientoNo: form.tratamiento == "NO",
    dniUser: dniUser,
    diagnostico: form.diagnostico,
    conclusionAsintomaticoSi: form.conclusion == "SI",
    conclusionAsintomaticoNo: form.conclusion == "NO",
    recomendaciones: form.recomendaciones,
    usuarioFirma: form.user_medicoFirma,
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
        const nombre = res.informacionSede.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          "../../../../../jaspers/MusculoEsqueletica/**/*.jsx"
        );
        // Determinar la ruta según el nombre del jasper
        if (nombre === "EvaluacionMuscoloEsqueletica") {
          // Primera llamada: Digitalizado/EvaluacionMuscoloEsqueletica.jsx
          const rutaArchivo1 = `../../../../../jaspers/MusculoEsqueletica/Digitalizado/${nombre}.jsx`;
          const modulo1 = await jasperModules[rutaArchivo1]();
          if (typeof modulo1.default === "function") {
            await modulo1.default({ ...res, ...datosFooter });
          } else {
            console.error(
              `El archivo ${nombre}.jsx no exporta una función por defecto`
            );
          }
          
          // Segunda llamada: EvaluacionMusculoEsqueletica2021_Digitalizado_boro.jsx
          const rutaArchivo2 = `../../../../../jaspers/MusculoEsqueletica/EvaluacionMusculoEsqueletica2021_Digitalizado_boro.jsx`;
          const modulo2 = await jasperModules[rutaArchivo2]();
          if (typeof modulo2.default === "function") {
            await modulo2.default({ ...res, ...datosFooter });
          } else {
            console.error(
              `El archivo EvaluacionMusculoEsqueletica2021_Digitalizado_boro.jsx no exporta una función por defecto`
            );
          }
        } else {
          const rutaArchivo = `../../../../../jaspers/MusculoEsqueletica/${nombre}.jsx`;
          const modulo = await jasperModules[rutaArchivo]();
          // Ejecuta la función exportada por default con los datos
          if (typeof modulo.default === "function") {
            modulo.default({ ...res, ...datosFooter });
          } else {
            console.error(
              `El archivo ${nombre}.jsx no exporta una función por defecto`
            );
          }
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
          "Este paciente ya cuenta con registros de MusculoEsqueletica.",
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
