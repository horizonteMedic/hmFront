import Swal from "sweetalert2";
import {
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getToday, getTodayPlusOneYear } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";

const registrarUrl = "/api/v01/ct/anexos/anexo16/registrarActualizarAnexo7c";
const obtenerSimpleUrl = "/api/v01/ct/anexos/anexo16/obtenerAnexo16";
const obtenerParaEditarUrl = "/api/v01/ct/anexos/anexo16/reporteEditarAnexo16";
const obtenerParaJasperUrl = "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16";

export const SubmitDataService = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  datosFooter
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  const body = {
    norden: form.norden,
    codigoAnexo: form.codigoAnexo,
    fecha: form.fechaExam,
    ruido: form.ruido,
    polvo: form.polvo,
    vidSegmentario: form.vidSegmentario,
    vidTotal: form.vidTotal,
    cancerigenos: form.cancerigenos,
    mutagenicos: form.mutagenicos,
    solventes: form.solventes,
    metales: form.metales,
    temperatura: form.temperaturaAgente,
    biologicos: form.biologicos,
    posturas: form.posturas,
    turnos: form.turnos,
    cargas: form.cargas,
    movRepet: form.movRepet,
    pvd: form.pvd,
    otros: form.otros,
    reubicacionSi: form.reubicacion,
    reubicacionNo: !form.reubicacion,
    tabacoNada: form.tabaco === "NADA",
    tabacoPoco: form.tabaco === "POCO",
    tabacoHabitual: form.tabaco === "HABITUAL",
    tabacoExcesivo: form.tabaco === "EXCESIVO",
    alcoholNada: form.alcohol === "NADA",
    alcoholPoco: form.alcohol === "POCO",
    alcoholHabitual: form.alcohol === "HABITUAL",
    alcoholExcesivo: form.alcohol === "EXCESIVO",
    drogasNada: form.drogas === "NADA",
    drogasPoco: form.drogas === "POCO",
    drogasHabitual: form.drogas === "HABITUAL",
    drogasExcesivo: form.drogas === "EXCESIVO",
    puestoActual: form.puestoActual,
    tiempo: form.tiempoPuesto,
    antecedentesPersonales: form.antecedentesPersonalesOcupacionales,
    antecedentesFamiliares: form.antecedentesFamiliares,
    hijosVivos: form.hijosVivos,
    hijosMuertos: form.hijosMuertos,
    cabeza: form.cabeza,
    nariz: form.nariz,
    cuello: form.cuello,
    perimetro: form.perimetro,
    bocaAmigdalasFaringeLaringe: form.bocaAmigdalasFaringeLaringe,
    visionColores: form.visionColores,
    enfermedadesOculares: form.enfermedadOculares,
    reflejosPupilares: form.reflejosPupilares,
    binocular: form.visionBinocular,
    od: form.otoscopiaOd,
    oi: form.otoscopiaOi,
    torax: form.torax,
    corazon: form.corazon,
    pulmonesNormal: form.pulmones === "NORMAL",
    pulmonesAnormal: form.pulmones === "ANORMAL",
    pulmonesDescripcion: form.pulmonesObservaciones,
    miembrosSuperiores: form.miembrosSuperiores,
    miembrosInferiores: form.miembrosInferiores,
    reflejosOsteotendinosos: form.reflejosOsteotendinosos,
    marcha: form.marcha,
    columnaVertebral: form.columnaVertebral, //revisar
    abdomen: form.abdomen, //revisar
    anillosInguinales: form.anillosInguinales, //revisar
    organosGenitales: form.organosGenitales, //revisar
    tactoRectalNoHizo: form.tactoRectalNoHizo, //revisar
    tactoRectalNormal: form.tactoRectalNormal, //revisar
    tactoRectalAnormal: form.tactoRectalAnormal, //revisar
    describirObservacion: form.describirObservacion, //revisar
    hernias: form.hernias, //revisar
    varices: form.varices, //revisar
    ganglios: form.ganglios, //revisar
    lenguage: form.lenguage, //revisar
    observacionesFichaMedica: form.observacionesGenerales,
    conclusion: form.conclusionRespiratoria,
    tetano: form.tetano,
    hepatitisB: form.hepatitisB,
    fiebreAmarilla: form.fiebreAmarilla,
    edad: form.edad,
    diagnosticoAudio: form.observaciones,
    enfermedadesOcularesOtros: form.enfermedadOtros,
    conclusionMedico: form.conclusionMedico,
    antecedentesPersonales2: form.otroAntecedentePersonal,
    estadoMental: form.estadoMental, //revisar
    anamnesis: form.anamnesis, //revisar
    alturaEstructura: form.alturaEstruct,
    alturaGeografica: form.alturaGeograf,
    quimicos: form.quimicos,
    electricos: form.electricos,
    vibraciones: form.vibraciones,
    userRegistro: user,
  };
  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob("../../../../jaspers/Anexo16/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerParaJasperUrl,
    jasperModules,
    "../../../../jaspers/Anexo16"
  );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
  VerifyTRDefault(
    nro,
    tabla,
    token,
    set,
    sede,
    () => {
      //NO Tiene registro
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
      });
    },
    () => {
      //Tiene registro
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Anexo 16.",
          "warning"
        );
      });
    }
  );
};

export const Loading = (mensaje) => { LoadingDefault(mensaje); };

export const GetInfoServicio = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
) => {
  getFetch(
    `${obtenerSimpleUrl}?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then((res) => {
      if (res.norden_n_orden) {
        console.log(res);
        if (res) {
          let data = {
            norden: res.norden_n_orden,
            puestoActual: res.puestoActual_txtpuestoactual ?? "",
            tiempoPuesto: res.tiempo_txttiempo ?? "",
            observacionesGenerales: "",
            otrosExamenes: "",
            conclusionRespiratoria: "",
          };

          // Procesar datos específicos del Anexo 16
          data.nomExamen = res.nombreExamen_nom_examen ?? "";
          data.dni = res.dni_cod_pa ?? "";
          data.nombres = res.nombres_nombres_pa ?? "";
          data.apellidos = res.apellidos_apellidos_pa ?? "";
          data.fechaNac = formatearFechaCorta(
            res.fechaNacimientoPaciente_fecha_nacimiento_pa
          );
          data.sexo = res.sexo_sexo_pa ?? "";
          data.lugarNac = res.lugarNacPaciente_lugar_nac_pa ?? "";
          data.domicilio = res.direccionPaciente_direccion_pa ?? "";
          data.telefono = res.telefonoCasaPaciente_tel_casa_pa ?? "";
          data.estadoCivil = res.estadoCivilPaciente_estado_civil_pa ?? "";
          data.gradoInstruccion = res.nivelEstudiosPaciente_nivel_est_pa ?? "";
          data.empresa = res.empresa_razon_empresa ?? "";
          data.contrata = res.contrata_razon_contrata ?? "";
          data.edad = (res.edad_fecha_nacimiento_pa ?? "") + " años";
          data.explotacion = res.explotacion_nom_ex ?? "";
          data.alturaLaboral = res.altura_altura_po ?? "";
          data.mineralExp = res.mineral_mineral_po ?? "";
          data.puestoPostula = res.cargo_cargo_de ?? "";
          data.areaPuesto = res.area_area_o ?? "";

          const today = getToday();
          const todayPlusOneYear = getTodayPlusOneYear();

          data.fechaExam = today;
          data.fechaAptitud = today;
          data.fechaVencimiento = todayPlusOneYear;

          console.log("DATAAA", data);
          set((prev) => ({ ...prev, ...data }));
        }
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};

export const GetInfoServicioEditar = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
) => {
  getFetch(
    `${obtenerParaEditarUrl}?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then((res) => {
      if (res.norden_n_orden) {
        console.log(res);
        if (res) {
          let data = {
            norden: res.norden_n_orden,
            codigoAnexo: res.codigoAnexo_cod_anexo,
            observacionesGenerales: "",
            otrosExamenes: "",
            conclusionRespiratoria: "",
            fechaExam: res.fechaAnexo_fecha,

            // Datos específicos del Anexo 16
            nomExamen: res.nombreExamen_nom_examen ?? "",
            dni: res.dni_cod_pa ?? "",
            nombres: res.nombres_nombres_pa ?? "",
            apellidos: res.apellidos_apellidos_pa ?? "",
            fechaNac: formatearFechaCorta(
              res.fechaNacimientoPaciente_fecha_nacimiento_pa
            ),
            sexo: res.sexo_sexo_pa ?? "",
            lugarNac: res.lugarNacPaciente_lugar_nac_pa ?? "",
            domicilio: res.direccionPaciente_direccion_pa ?? "",
            telefono: res.telefonoCasaPaciente_tel_casa_pa ?? "",
            estadoCivil: res.estadoCivilPaciente_estado_civil_pa ?? "",
            gradoInstruccion: res.nivelEstudiosPaciente_nivel_est_pa ?? "",
            empresa: res.empresa_razon_empresa ?? "",
            contrata: res.contrata_razon_contrata ?? "",
            edad: (res.edad_fecha_nacimiento_pa ?? "") + " años",
            explotacion: res.explotacion_nom_ex ?? "",
            alturaLaboral: res.altura_altura_po ?? "",
            mineralExp: res.mineral_mineral_po ?? "",
            puestoPostula: res.cargo_cargo_de ?? "",
            areaPuesto: res.area_area_o ?? "",

            aptitud: res.esApto_apto_si
              ? "APTO"
              : res.noEsApto_apto_no
                ? "NO APTO"
                : res.aptoRestriccion_apto_re
                  ? "RESTRICCION"
                  : "",
            fechaAptitud: res.fechaDesde_fechadesde ?? "",
            fechaVencimiento: res.fechaHasta_fechahasta ?? "",
            nombre_medico: res.medico_medico ?? "",
            dataEnfermedades: res.accidentes ?? [],
          };

          console.log("DATA EDITAR", data);
          set((prev) => ({ ...prev, ...data }));
        }
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};
