import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch";
import { handleSubidaMasiva, handleSubirArchivoDefaultSinSellos, ReadArchivosFormDefault } from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import { guardarRegistro, actualizarRegistro, validarSede } from "../../../../../utils/registroOcupacionalUtils";

//===============Zona Modificación===============
// nameService del examen (también lo usa Auditoría de Protocolos para abrir el reporte)
export const TABLA_OFTALMOLOGIA = "oftalmologia2021";

const obtenerReporteUrl =
  "/api/v01/ct/agudezaVisual/obtenerReporteEvaluacionOftalmologica";
const registrarUrl =
  "/api/v01/ct/agudezaVisual/registrarActualizarEvaluacionOftalmologica";
const obtenerDataRegistrada =
  "/api/v01/ct/agudezaVisual/obtenerInformacionOftalmologiaConSusObservaciones";
const registrarPDF =
  "/api/v01/ct/archivos/archivoInterconsulta"

export const GetInfoServicio = (nro, tabla, set, token) => {
  try {
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
      .then((res) => {
        if (res.norden) {
          console.log(res);
          set((prev) => ({
            ...prev,
            ...res,
            codOf: res.codOf,
            completo: res.completo,
            nomExam: res.nomExam,
            fechaExam: res.fechaOf,
            fechaNac: res.fechaNac ? formatearFechaCorta(res.fechaNac) : "",
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

            visionColores: res.vcolores,
            visionColoresCie10: res.visionColoresCie10,
            enfOculares: res.eoculares,
            enfOcularesCie10: res.enfOcularesCie10,
            presenciaPterigion: res.eoculares1 ?? "",
            presenciaPterigionCie10: res.presenciaPterigionCie10,

            SubirDoc: true,
            digitalizacion: res.digitalizacion,

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            user_doctorAsignado: res.doctorAsignado,

            // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
            // EvaluacionOftalmologicaReporteDTO aún no devuelve estos campos: mientras tanto quedan vacíos.
            fechaRegistro: res.fechaRegistro ?? "",
            userRegistro: res.userRegistro ?? "",
            fechaActualizacion: res.fechaActualizacion ?? "",
            usuarioActualizacion: res.usuarioActualizacion ?? "",
            tieneRegistro: true,
          }));
        } else {
          Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        }
      })
      .finally(() => {
        Swal.close();
      });
  } catch (error) {
    console.log(error);
    Swal.fire("Error", "Ocurrio un error al obtener los datos del paciente", "error");
  }
};

export const GetInfoDataOftalmoConObservaciones = (nro, set, token) => {
  getFetch(`${obtenerDataRegistrada}?nOrden=${nro}`, token).then((res) => {
    if (res.norden) {
      console.log(res);
      set((prev) => ({
        ...prev,
        // diagnostico: (res.eoculares ?? "") + "\n" + (res.eoculares1 ?? ""),
        vc_sinc_od: res.vcercaSOd ?? "",
        vc_sinc_oi: res.vcercaSOi ?? "",
        vc_conc_od: res.vcercaCOd ?? "",
        vc_conc_oi: res.vcercaCOi ?? "",
        vl_sinc_od: res.vlejosSOd ?? "",
        vl_sinc_oi: res.vlejosSOi ?? "",
        vl_conc_od: res.vlejosCOd ?? "",
        vl_conc_oi: res.vlejosCOi ?? "",
        bino_sinc: res.vbinocular ?? "",
        bino_conc: res.vbinocularLo ?? "",
        reflejos_pupilares: res.rpupilares ?? "",
      }));
    }
  });
};

// ===== Mapeo: Body base =====
// Campos propios del examen (sin auditoría): el usuario que registra lo agrega sellarAuditoria.
const construirBase = (form) => ({
    codOf: form.codOf,
    norden: form.norden,
    completo: form.completo,
    fechaOf: form.fechaExam,
    rbecPtosisOd: form.ptosisPalpebralOd,
    rbecPtosisOi: form.ptosisPalpebralOi,
    rbecEstrabismoOd: form.estrabismoOd,
    rbecEstrabismoOi: form.estrabismoOi,
    rbecConjuntivitisOd: form.conjuntivitisOd,
    rbecConjuntivitisOi: form.conjuntivitisOi,
    rbecCataratasOd: form.cataratasOd,
    rbecCataratasOi: form.cataratasOi,
    rbecPterigionOd: form.pterigionGradoOd,
    rbecPterigionOi: form.pterigionGradoOi,
    rbecPingueculaOd: form.pingueculaOd,
    rbecPingueculaOi: form.pingueculaOi,
    rbecClalacionOd: form.chalazionOd,
    rbecClalacionOi: form.chalazionOi,
    rbecOtrosOd: form.otrosOd,
    rbecOtrosOi: form.otrosOi,
    txtecHallazgos: form.examenClinicoHallazgos,
    rbfONormalOd: form.fondoNormalOD,
    rbfONormalOi: form.fondoNormalOI,
    rbfOAnormalOd: form.fondoAnormalOD,
    rbfOAnormalOi: form.fondoAnormalOI,
    txtFoHallazgos: form.fondoHallazgos,
    txtPioOd: form.pioOd,
    txtPioOi: form.pioOi,
    txtPioNa: form.noAplica,
    rbcOsi: form.correctorOcular == "SI",
    rbcOno: form.correctorOcular == "NO",
    rbcOcerca: form.correctorCerca,
    rbcOlejos: form.correctorLejos,
    chkNtcc: form.noTrajocorrectorCerca,
    chkNtcl: form.noTrajocorrectorLejos,
    txtCercaSinCorregirOd: form.vc_sinc_od,
    txtCercaSinCorregirOi: form.vc_sinc_oi,
    txtLejosSinCorregirOd: form.vl_sinc_od,
    txtLejosSinCorregirOi: form.vl_sinc_oi,
    txtCercaCorregidaOd: form.vc_conc_od,
    txtCercaCorregidaOi: form.vc_conc_oi,
    txtLejosCorregidaOd: form.vl_conc_od,
    txtLejosCorregidaOi: form.vl_conc_oi,
    txtCercaAgujeroOd: form.vc_agujero_od,
    txtCercaAgujeroOi: form.vc_agujero_oi,
    txtLejosAgujeroOd: form.vl_agujero_od,
    txtLejosAgujeroOi: form.vl_agujero_oi,
    txtBinocularSinCorregir: form.bino_sinc,
    txtBinocularCorregida: form.bino_conc,
    rbtEcIshiharaNormal: form.ishihara == "NORMAL",
    rbtEcIshiharaAnormal: form.ishihara == "ANORMAL",
    rbtEcIshiharaNc: form.ishihara == "N.C.",
    rbtEcColeresNormal: form.coloresPuros == "NORMAL",
    rbtEcColeresAnormal: form.coloresPuros == "ANORMAL",
    rbtEcColeresNc: form.coloresPuros == "N.C.",
    txtTecEstereopsia: form.estereopsiaText,
    rbtEcEstereopsiaNormal: form.estereopsia == "NORMAL",
    rbtEcEstereopsiaAnormal: form.estereopsia == "ANORMAL",
    rbtEcEstereopsiaNc: form.estereopsia == "N.C.",
    chkRefraccionAplica: form.aplicaRefraccion == "SI",
    chkRefraccionNoAplica: form.aplicaRefraccion == "NO",
    txtLejosOdSf: form.odsfL,
    txtLejosOdCil: form.odcilL,
    txtLejosOdEje: form.odejeL,
    txtLejosOiSf: form.oisfL,
    txtLejosOiCil: form.oicilL,
    txtLejosOiEje: form.oiejeL,
    txtLejosOdDip: form.dipL,
    txtCercaOdSf: form.odsfC,
    txtCercaOdCil: form.odcilC,
    txtCercaOdEje: form.odejeC,
    txtCercaOiSf: form.oisfC,
    txtCercaOiCil: form.oicilC,
    txtCercaOiEje: form.oiejeC,
    txtCercaOdDip: form.dipC,
    txtAvConRefraccionLejosOd: form.agudezaOdLejos,
    txtAvConRefraccionLejosOi: form.agudezaOiLejos,
    txtAvConRefraccionCercaOd: form.agudezaOdCerca,
    txtAvConRefraccionCercaOi: form.agudezaOiCerca,
    txtDiagnostico: form.diagnostico,
    chkInNinguna: form.ninguna,
    chkI2: form.usoCorrectoresCerca,
    chkI3: form.usoCorrectoresLejos,
    chkI4Cerca: form.lentesCorrectoresCerca,
    chkI4Lejos: form.lentesCorrectoresLejos,
    chkI5: form.lentesCambioLunas,
    chkI6: form.indicacionPterigion,
    chkI7: form.indicacionOtras,
    chkR1: form.noRestringeActividades,
    chkR2Lejos: form.restriccionCorrectorLejos,
    chkR2Cerca: form.restriccionCorrectorCerca,
    chkR3: form.noTrabajosCableElectrico,
    chkR4: form.noConduccion,
    txtRp: form.reflejos_pupilares,
    userMedicoOcup: "",

    txtParpaAnex: form.parpadosYAnexos,
    txtCorneas: form.corneas,
    txtOtrosHallaz: form.otrosHallazgos,
    txtConjuntivas: form.conjuntivas,
    txtCristalino: form.cristalino,
    txtAntPersImp: form.antecedentesPersonales,
    txtFamImp: form.antecedentesFamiliares,

    vcolores: form.visionColores,
    visionColoresCie10: form.visionColoresCie10,
    eoculares: form.enfOculares,
    enfOcularesCie10: form.enfOcularesCie10,
    eoculares1: form.presenciaPterigion,
    presenciaPterigionCie10: form.presenciaPterigionCie10,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). EvaluacionOftalmologicaDTO usa `userRegistro` para el usuario que
// registra. El reporte (GET) aún no devuelve la fecha de registro, así que al editar, si no se conoce el
// creador, se manda el usuario en sesión (como siempre) en vez de null para no borrarlo.
const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(construirBase(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro || user,
    fechaRegistro: form.fechaRegistro,
  });

// Este endpoint responde id 1 al registrar y 0 al actualizar.
const idsExito = [0, 1];

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla) =>
  guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla),
    idsExito,
  });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla) =>
  actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla),
    idsExito,
  });

export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          "../../../../../jaspers/Oftalmologia/**/*.jsx"
        );
        // Determinar la ruta según el nombre del jasper
        let rutaJasper;

        rutaJasper = `../../../../../jaspers/Oftalmologia/${nombre}.jsx`;

        const modulo = await jasperModules[rutaJasper]();
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
      "Debe Introducir un Nro de Orden válido",
      "error"
    );
    return;
  }
  Loading("Validando datos");

  // Como el resto de formularios de la plantilla: el N° Orden debe pertenecer a la sede actual.
  if (sede) {
    const { estado, descripcionSede } = await validarSede(nro, sede, token);
    if (estado === "otraSede") {
      Swal.fire({
        icon: "warning",
        title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
        html: `El N° Orden ${nro} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.`,
      });
      return;
    }
    if (estado !== "ok") {
      Swal.fire({
        icon: "error",
        title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
        html: `Verifique el número de orden ${nro} e intente nuevamente.`,
      });
      return;
    }
  }

  try {
    const res = await getFetch(
      `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
      token
    );

    console.log(res);
    if (res.id !== 0) {
      //Tiene registro previo
      GetInfoServicio(nro, tabla, set, token);
      return;
    } 
    
    // VALIDAR SI EL PACIENTE EXISTE
    const paciente = await getFetch(
      `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
      token
    );

    // NO EXISTE
    if (!paciente || paciente.error) {
      await Swal.fire(
        "Error",
        "Debe ingresar un Nro de Orden válido",
        "error"
      );
      return;
    }

    // EXISTE PERO SIN FORMULARIO
    GetInfoPac(nro, set, token, sede);
    GetInfoDataOftalmoConObservaciones(nro, set, token);

  } catch (error) {
    console.error(error);

    await Swal.fire(
      "Error",
      "El número de orden no existe",
      "error"
    );
  }
};

export const GetInfoPac = (nro, set, token, sede) => {
  try {
    getFetch(
      `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
      token
    )
      .then((res) => {
        console.log("pros", res);
        set((prev) => ({
          ...prev,
          ...res,
          fechaNac: formatearFechaCorta(res.fechaNac),
          nombres: res.nombresApellidos,
        }));
      })
      .finally(() => {
        Swal.close();
      });
  } catch (error) {
    console.log(error);
    Swal.fire("Error", "Ocurrio un error al obtener los datos del paciente", "error");
  }

};

export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
  // const coordenadas = {
  //   HUELLA: { x: 400, y: 680, width: 60, height: 60 },
  //   FIRMA: { x: 466, y: 680, width: 120, height: 60 },
  //   SELLOFIRMADOCASIG: { x: 40, y: 680, width: 120, height: 80 },
  // };
  handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
  ReadArchivosFormDefault(form, setVisualerOpen, token)
}

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token) => {
  handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token)
}
