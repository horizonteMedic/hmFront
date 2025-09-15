import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getToday, getTodayPlusOneYear } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
  "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16Completo";
const registrarUrl =
  "/api/v01/ct/anexos/anexo16/registrarActualizarAnexo16";

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
    codigoAnexo: form.codigoAnexo,
    norden: form.norden,
    fecha: form.fechaExam,
    //Ant. Personales
    neoplasia: form.neoplasia,
    neoplasiaDescripcion: form.neoplasiaDescripcion,
    its: form.its,
    itsDescripcion: form.itsDescripcion,
    quemaduras: form.quemaduras,
    quemadurasDescripcion: form.quemadurasDescripcion,
    cirugias: form.cirugias,
    cirugiasDescripcion: form.cirugiasDescripcion,
    antecedentesPersonalesOtros: form.otrosAntecedentes,
    antecedentesPersonalesOtrosDescripcion: form.otrosAntecedentesDescripcion,

    //Residencia en el lugar de trabajo
    residenciaSi: form.reside,
    residenciaNo: !form.reside,
    residenciaTiempo: form.tiempoReside,
    essalud: form.essalud,
    eps: form.eps,
    residenciaTrabajoOtros: form.otrosResidencia,
    sctr: form.sctr,
    sctrOtros: form.otrosResidencia1,

    //Antecedentes Familiares
    padre: form.antecendentesPadre,
    madre: form.antecendentesMadre,
    hermanos: form.antecendentesHermano,
    esposa: form.antecendentesEsposao,

    //Detalles del Puesto
    puestoActual: form.puestoActual,
    tiempo: form.tiempoPuesto,

    //Medicamentos
    medicamentosSi: form.tomaMedicamento,
    medicamentosNo: !form.tomaMedicamento,
    tipoMedicamento: form.tipoMedicamentos,
    frecuenciaMedicamentos: form.frecuenciaMedicamentos,

    //Número de Hijos
    hijosVivos: form.hijosVivos,
    hijosMuertos: form.hijosMuertos,
    totalHijos: form.totalHijos,
    numeroDependientes: form.hijosDependientes,

    // Examen Físico por Sistemas
    cabeza: form.cabeza,
    nariz: form.nariz,
    cuello: form.cuello,
    perimetro: form.perimetro,
    boca: form.boca,
    oidos: form.oidos,
    faringe: form.faringe,
    visionColores: form.visionColores,
    enfermedadesOculares: form.enfermedadOculares,
    reflejosPupilares: form.reflejosPupilares,
    visionBinocular: form.visionBinocular,
    miembrosSuperiores: form.miembrosSuperiores,
    miembrosInferiores: form.miembrosInferiores,
    ectoscopia: form.ectoscopia,
    estadoMental: form.estadoMental,
    anamnesis: form.anamnesis,
    marcha: form.marcha,
    columnaVertebral: form.columnaVertebral,
    aparatoRespiratorio: form.aparatoRespiratorio,
    aparatoCardiovascular: form.apaCardiovascular,
    aparatoDigestivo: form.aparatoDigestivo,
    aparatoGeiotourinario: form.aGenitourinario,
    aparatoLocomotor: form.aparatoLocomotor,
    sistemaLinfatico: form.sistemaLinfatico,
    piel: form.piel,
    observacionesFichaMedica: form.observacionesGenerales,
    conclusion: form.conclusionRespiratoria,
    edad: form.edad + " años",
    enfermedadesOcularesOtros: form.enfermedadOtros,
    sistemaNervioso: form.sistemaNervioso,
    otrosExamenes: form.otrosExamenes,
    restricciones: form.restricciones,

    esApto: form.aptitud == "APTO",
    noEsApto: form.aptitud == "NO APTO",
    aptoRestriccion: form.aptitud == "RESTRICCION",
    fechaDesde: form.fechaAptitud,
    fechaVence: form.fechaVencimiento,
    medico: form.nombre_medico,
    userRegistro: form.user,
    accidentes: form.dataEnfermedades.map((item) => ({
      ...item,
      codigoAnexo: null,
      fecha: null,
      userRegistro: form.user,
    })),
  };
  console.log(body);

  await SubmitDataServiceDefault(
    token,
    limpiar,
    body,
    registrarUrl,
    () => {
      Swal.close();
    },
    false
  );
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

export const PrintHojaR = (nro, token, tabla, numPage, datosFooter) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
    token
  ).then(async (res) => {
    if (res.norden) {
      const nombre = res.nameJasper;
      console.log(nombre);
      const jasperModules = import.meta.glob(
        "../../../../../jaspers/Anexo16/*.jsx"
      );
      let modulo;
      if (numPage == 2) {
        modulo = await jasperModules[
          `../../../../../jaspers/Anexo16/${nombre}.jsx`
        ]();
      } else {
        modulo = await jasperModules[
          `../../../../../jaspers/Anexo16/${nombre}.jsx`
        ]();
      }

      // Ejecuta la función exportada por default con los datos
      if (typeof modulo.default === "function") {
        modulo.default({ ...res, datosFooter });
      } else {
        console.error(
          `El archivo ${nombre}.jsx no exporta una función por defecto`
        );
      }
      Swal.close();
    } else {
      Swal.close();
    }
  });
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

const GetInfoPac = async (nro, set, token, sede) => {
  const res = await GetInfoPacDefault(nro, token, sede);
  if (res) {
    set((prev) => ({
      ...prev,
      ...res,
      fechaNac: formatearFechaCorta(res.fechaNac ?? ""),
      edad: res.edad + " años",
      nombres: res.nombresApellidos,
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

export const GetInfoServicio = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {}
) => {
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=false`,
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
  onFinish = () => {}
) => {
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=false`,
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
