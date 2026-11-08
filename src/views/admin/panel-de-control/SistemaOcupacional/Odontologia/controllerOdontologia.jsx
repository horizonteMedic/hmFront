import Swal from "sweetalert2";
import { getFetch } from "../../getFetch/getFetch";
import { SubmitData } from "./model";
import { sellarAuditoria } from "../../../../utils/auditoriaUtils";
import { guardarRegistro, actualizarRegistro, validarSede } from "../../../../utils/registroOcupacionalUtils";
import { contadoresParaRegistrar, labelParaLeer, valorParaRegistrar } from "./estadosOdontograma";

//===============Zona Modificación===============
// nameService del examen (también lo usa Auditoría de Protocolos para abrir el reporte)
export const TABLA_ODONTOLOGIA = "odontograma";

const obtenerReporteUrl = "/api/v01/ct/odontograma/obtenerReporteOdontograma";
const obtenerReporteUrlLo =
  "/api/v01/ct/odontograma/obtenerReporteOdontogramaLo";
const registrarUrl = "/api/v01/ct/odontograma/registrarActualizarOdontograma";
const registrarUrlLo =
  "/api/v01/ct/odontograma/registrarActualizarOdontogramaLo";

const reporteConsultaUrl =
  "/api/v01/ct/odontograma/obtenerReporteOdontogramaFechas";

const obtenerListaNordenUrl = "/api/v01/ct/odontograma/obtenerOdontogramaAnteriorPorNorden";
const obtenerInfoPacienteUrl = "/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros";

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
          ...res,

          codOd: res.codOd,
          fechaExam: res.fechaOd,
          edad: res.edad + " años",

          d1: labelParaLeer(res.lbl18),
          d2: labelParaLeer(res.lbl17),
          d3: labelParaLeer(res.lbl16),
          d4: labelParaLeer(res.lbl15),
          d5: labelParaLeer(res.lbl14),
          d6: labelParaLeer(res.lbl13),
          d7: labelParaLeer(res.lbl12),
          d8: labelParaLeer(res.lbl11),

          d9: labelParaLeer(res.lbl21),
          d10: labelParaLeer(res.lbl22),
          d11: labelParaLeer(res.lbl23),
          d12: labelParaLeer(res.lbl24),
          d13: labelParaLeer(res.lbl25),
          d14: labelParaLeer(res.lbl26),
          d15: labelParaLeer(res.lbl27),
          d16: labelParaLeer(res.lbl28),

          d17: labelParaLeer(res.lbl48),
          d18: labelParaLeer(res.lbl47),
          d19: labelParaLeer(res.lbl46),
          d20: labelParaLeer(res.lbl45),
          d21: labelParaLeer(res.lbl44),
          d22: labelParaLeer(res.lbl43),
          d23: labelParaLeer(res.lbl42),
          d24: labelParaLeer(res.lbl41),

          d25: labelParaLeer(res.lbl31),
          d26: labelParaLeer(res.lbl32),
          d27: labelParaLeer(res.lbl33),
          d28: labelParaLeer(res.lbl34),
          d29: labelParaLeer(res.lbl35),
          d30: labelParaLeer(res.lbl36),
          d31: labelParaLeer(res.lbl37),
          d32: labelParaLeer(res.lbl38),

          observaciones: res.txtObservaciones || "",
          observacionesCie10: res.observacionesCie10 || "",
          noPasoExamen: res?.txtObservaciones?.includes(
            "NO PASO EXAMEN ODONTOLOGICO"
          ),
          user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

          // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
          // OdontogramaReporteDTO aún no devuelve estos campos: mientras tanto quedan vacíos.
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
      onFinish();
    });
};
export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

// ===== Mapeo: Body base =====
// Campos propios del examen (sin auditoría): el usuario que registra lo agrega sellarAuditoria.
const construirBase = (form) => ({
    codOd: form.codOd,
    norden: form.norden,
    fechaOd: form.fechaExam,
    edadOd: form.edad.replace("años", ""),
    lbl18: valorParaRegistrar(form.d1),
    lbl17: valorParaRegistrar(form.d2),
    lbl16: valorParaRegistrar(form.d3),
    lbl15: valorParaRegistrar(form.d4),
    lbl14: valorParaRegistrar(form.d5),
    lbl13: valorParaRegistrar(form.d6),
    lbl12: valorParaRegistrar(form.d7),
    lbl11: valorParaRegistrar(form.d8),

    lbl21: valorParaRegistrar(form.d9),
    lbl22: valorParaRegistrar(form.d10),
    lbl23: valorParaRegistrar(form.d11),
    lbl24: valorParaRegistrar(form.d12),
    lbl25: valorParaRegistrar(form.d13),
    lbl26: valorParaRegistrar(form.d14),
    lbl27: valorParaRegistrar(form.d15),
    lbl28: valorParaRegistrar(form.d16),

    lbl31: valorParaRegistrar(form.d25),
    lbl32: valorParaRegistrar(form.d26),
    lbl33: valorParaRegistrar(form.d27),
    lbl34: valorParaRegistrar(form.d28),
    lbl35: valorParaRegistrar(form.d29),
    lbl36: valorParaRegistrar(form.d30),
    lbl37: valorParaRegistrar(form.d31),
    lbl38: valorParaRegistrar(form.d32),

    lbl41: valorParaRegistrar(form.d24),
    lbl42: valorParaRegistrar(form.d23),
    lbl43: valorParaRegistrar(form.d22),
    lbl44: valorParaRegistrar(form.d21),
    lbl45: valorParaRegistrar(form.d20),
    lbl46: valorParaRegistrar(form.d19),
    lbl47: valorParaRegistrar(form.d18),
    lbl48: valorParaRegistrar(form.d17),

    ...contadoresParaRegistrar(form),
    txtObservaciones: form.observaciones,
    observacionesCie10: form.observacionesCie10,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.nombre_medico,
});

// Body completo (creación / actualización). OdontogramaDTO usa `userRegistro` para el usuario que registra.
// El reporte (GET) aún no devuelve la fecha de registro, así que al editar, si no se conoce el creador, se
// manda el usuario en sesión (como siempre) en vez de null para no borrarlo.
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
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) =>
  guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    idsExito,
  });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) =>
  actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    idsExito,
  });

export const SubmitDataServiceLO = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  closeModal,
  datosFooter
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    norden: form.norden,
    fechaOd: form.fechaExam,
    edadOd: form.edad.replace("años", ""),
    lbl18: valorParaRegistrar(form.d1),
    lbl17: valorParaRegistrar(form.d2),
    lbl16: valorParaRegistrar(form.d3),
    lbl15: valorParaRegistrar(form.d4),
    lbl14: valorParaRegistrar(form.d5),
    lbl13: valorParaRegistrar(form.d6),
    lbl12: valorParaRegistrar(form.d7),
    lbl11: valorParaRegistrar(form.d8),

    lbl21: valorParaRegistrar(form.d9),
    lbl22: valorParaRegistrar(form.d10),
    lbl23: valorParaRegistrar(form.d11),
    lbl24: valorParaRegistrar(form.d12),
    lbl25: valorParaRegistrar(form.d13),
    lbl26: valorParaRegistrar(form.d14),
    lbl27: valorParaRegistrar(form.d15),
    lbl28: valorParaRegistrar(form.d16),

    lbl31: valorParaRegistrar(form.d25),
    lbl32: valorParaRegistrar(form.d26),
    lbl33: valorParaRegistrar(form.d27),
    lbl34: valorParaRegistrar(form.d28),
    lbl35: valorParaRegistrar(form.d29),
    lbl36: valorParaRegistrar(form.d30),
    lbl37: valorParaRegistrar(form.d31),
    lbl38: valorParaRegistrar(form.d32),

    lbl41: valorParaRegistrar(form.d24),
    lbl42: valorParaRegistrar(form.d23),
    lbl43: valorParaRegistrar(form.d22),
    lbl44: valorParaRegistrar(form.d21),
    lbl45: valorParaRegistrar(form.d20),
    lbl46: valorParaRegistrar(form.d19),
    lbl47: valorParaRegistrar(form.d18),
    lbl48: valorParaRegistrar(form.d17),

    ...contadoresParaRegistrar(form),
    txtObservaciones: form.observaciones,
    userRegistro: user,
  };
  SubmitData(body, registrarUrlLo, token).then((res) => {
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
        closeModal();
        if (result.isConfirmed) {
          PrintHojaRLO(form.norden, token, tabla, datosFooter);
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

// `silencioso`: no muestra los avisos informativos ("ya cuenta con registros" / "sin registros anteriores"),
// porque en el formulario incrustado el estado del registro ya se ve en pantalla. La elección de un N° de
// orden anterior para copiar el odontograma se conserva.
export const VerifyTR = async (nro, tabla, token, set, sede, { silencioso = false } = {}) => {
  if (!nro) {
    await Swal.fire(
      "Error",
      "Debe Introducir un Nro de Historia Clinica válido",
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

  getFetch(
    `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
    token
  ).then((res) => {
    console.log(res);
    if (res.id === 0) {
      //No tiene registro previo: ofrece copiar un odontograma de un N° de orden anterior
      OpenModalNorden(nro, tabla, set, token, sede, { silencioso });
    } else {
      GetInfoServicio(nro, tabla, set, token, () => {
        if (silencioso) {
          Swal.close();
          return;
        }
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Odontograma.",
          "warning"
        );
      });
    }
  });
};

export const VerifyTRLO = async (nro, tabla, token, set, sede) => {
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
      VerifyTR(nro, "odontograma", token, set, sede);
    } else {
      GetInfoServicioLO(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Levantamiento de Observación.",
          "warning"
        );
      });
    }
  });
};

export const GetInfoServicioLO = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
) => {
  getFetch(`${obtenerReporteUrlLo}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,

          fechaExam: res.fechaOd,
          edad: res.edad + " años",
          d1: labelParaLeer(res.lbl18),
          d2: labelParaLeer(res.lbl17),
          d3: labelParaLeer(res.lbl16),
          d4: labelParaLeer(res.lbl15),
          d5: labelParaLeer(res.lbl14),
          d6: labelParaLeer(res.lbl13),
          d7: labelParaLeer(res.lbl12),
          d8: labelParaLeer(res.lbl11),

          d9: labelParaLeer(res.lbl21),
          d10: labelParaLeer(res.lbl22),
          d11: labelParaLeer(res.lbl23),
          d12: labelParaLeer(res.lbl24),
          d13: labelParaLeer(res.lbl25),
          d14: labelParaLeer(res.lbl26),
          d15: labelParaLeer(res.lbl27),
          d16: labelParaLeer(res.lbl28),

          d17: labelParaLeer(res.lbl48),
          d18: labelParaLeer(res.lbl47),
          d19: labelParaLeer(res.lbl46),
          d20: labelParaLeer(res.lbl45),
          d21: labelParaLeer(res.lbl44),
          d22: labelParaLeer(res.lbl43),
          d23: labelParaLeer(res.lbl42),
          d24: labelParaLeer(res.lbl41),

          d25: labelParaLeer(res.lbl31),
          d26: labelParaLeer(res.lbl32),
          d27: labelParaLeer(res.lbl33),
          d28: labelParaLeer(res.lbl34),
          d29: labelParaLeer(res.lbl35),
          d30: labelParaLeer(res.lbl36),
          d31: labelParaLeer(res.lbl37),
          d32: labelParaLeer(res.lbl38),

          observaciones: res.txtObservaciones || "",
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};

export const GetInfoPac = (
  nro,
  set,
  token,
  sede,
  onFinish = () => {
    Swal.close();
  }
) => {
  getFetch(
    `${obtenerInfoPacienteUrl}?nOrden=${nro}&nomSede=${sede}`,
    token
  )
    .then((res) => {
      console.log("pros", res);
      set((prev) => ({
        ...prev,
        ...res,
        nombres: res.nombresApellidos,
        edad: res.edad + " años",
        sexo: res.genero,
      }));
    })
    .finally(() => {
      onFinish();
    });
};

// Muestra los N° de orden anteriores del paciente 
export const OpenModalNorden = async (norden, tabla, set, token, sede, { silencioso = false } = {}) => {
  const list = await getFetch(`${obtenerListaNordenUrl}?nOrden=${norden}`, token);
  if (!Array.isArray(list) || list.length === 0) {
    if (silencioso) {
      // Sin aviso: GetInfoPac cierra el "Validando datos" al terminar
      GetInfoPac(norden, set, token, sede);
      return;
    }
    GetInfoPac(norden, set, token, sede, () => { });
    Swal.fire({
      title: "N° de Orden sin registros anteriores",
      text: "No hay registros anteriores para este N° de Orden.",
      icon: "warning",
    });
    return;
  }

  // Nombres de campo defensivos: el backend de este endpoint no está
  // confirmado, así que se prueban varias variantes comunes en el proyecto.
  const inputOptions = list.reduce((acc, item) => {
    const nordenItem = item.norden ?? item.nOrden ?? item.n_orden;
    const fechaItem =
      item.fecha_registro_odontograma ??
      item.fechaOd ??
      item.fecha_registro ??
      item.fecha ??
      "";
    acc[nordenItem] = `N° ${nordenItem} - ${fechaItem}`;
    return acc;
  }, {});

  const resultadoModal = await Swal.fire({
    title: "Selecciona un N° de orden",
    html: `<p style="margin:0 0 4px;color:#64748b;font-size:12px;">Elige el registro anterior</p>`,
    input: "radio",
    inputOptions,
    inputValidator: (value) => {
      if (!value) return "Debes seleccionar una opción o crear una nueva.";
    },
    showCancelButton: true,
    confirmButtonText: "Buscar",
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
    customClass: {
      popup: "swal-dinamico swal-norden-popup",
    },
    didOpen: () => {
      const popup = Swal.getPopup();

      const applyLayout = () => {
        const title = popup.querySelector(".swal2-title");
        const htmlContainer = popup.querySelector(".swal2-html-container");
        const radioGroup = popup.querySelector(".swal2-radio");
        const actions = popup.querySelector(".swal2-actions");

        popup.style.maxWidth = "350px";
        popup.style.width = "80vw";
        popup.style.maxHeight = "80vh";
        popup.style.display = "flex";
        popup.style.flexDirection = "column";
        popup.style.overflow = "hidden";

        if (title) title.style.flex = "0 0 auto";
        if (htmlContainer) htmlContainer.style.flex = "0 0 auto";
        if (actions) actions.style.flex = "0 0 auto";
        if (radioGroup) {
          radioGroup.style.flex = "1 1 auto";
          radioGroup.style.minHeight = "0";
        }
      };

      applyLayout();
      window.addEventListener("resize", applyLayout);
      popup._nordenResizeHandler = applyLayout;

      let style = document.getElementById("swal-norden-styles");
      if (!style) {
        style = document.createElement("style");
        style.id = "swal-norden-styles";
        document.head.appendChild(style);
      }
      style.textContent = `
                .swal-norden-popup {
                    padding-bottom: 1em;
                }
                .swal-norden-popup .swal2-title {
                    margin: 0;
                    padding: .5rem .5rem .5rem;
                    font-size: 1.4em;
                }
                .swal-norden-popup .swal2-html-container {
                    margin: 0.3em 0.9em 0 ;
                }
                .swal-norden-popup .swal2-radio {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 6px;
                    width: auto;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 6px 6px 2px;
                    margin: 1em 1em 0 !important;
                    padding-top: 15px;
                }
                .swal-norden-popup .swal2-radio label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0 !important;
                    padding: 8px 12px;
                    border: 1px solid #d7dde5;
                    border-radius: 8px;
                    background: #f8fafc;
                    cursor: pointer;
                    box-sizing: border-box;
                    transition: border-color .15s ease, background-color .15s ease;
                }
                .swal-norden-popup .swal2-radio label:hover {
                    border-color: #0d9488;
                    background: #f0fdfa;
                }
                .swal-norden-popup .swal2-radio label:has(input:checked) {
                    border-color: #0d9488;
                    background: #e6fbf8;
                    box-shadow: 0 0 0 1px #0d9488 inset;
                }
                .swal-norden-popup .swal2-radio input[type="radio"] {
                    width: 16px;
                    height: 16px;
                    margin: 0;
                    accent-color: #0d9488;
                    flex-shrink: 0;
                }
                .swal-norden-popup .swal2-radio .swal2-label {
                    margin: 0;
                    font-size: 11px;
                    color: #1f2937;
                    text-align: left;
                }
                .swal-norden-popup .swal2-radio::-webkit-scrollbar {
                    width: 6px;
                }
                .swal-norden-popup .swal2-radio::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
            `;
    },
    willClose: () => {
      const popup = Swal.getPopup();
      if (popup?._nordenResizeHandler) {
        window.removeEventListener("resize", popup._nordenResizeHandler);
      }
    }
  });

  const seleccion = resultadoModal.value;

  if (seleccion) {
    // Trae el odontograma del N° de orden anterior elegido 
    GetInfoServicioParaNuevoRegistro(seleccion, norden, tabla, set, token, sede, () => {
      Swal.close();
    });
  } else if (resultadoModal.dismiss === Swal.DismissReason.cancel) {
    GetInfoPac(norden, set, token, sede, () => { });
  }
};

// Trae la información de un N° de orden anterior (dientes, conteos y
// observaciones) hacia el N° de orden actual. Los datos básicos del
// paciente (nombres, sexo, edad, empresa, contrata) se traen del N° de
// orden ACTUAL, no del anterior.
export const GetInfoServicioParaNuevoRegistro = async (
  nordenBuscar,
  nordenActual,
  tabla,
  set,
  token,
  sede,
  onFinish = () => { }
) => {
  Loading("Cargando datos anteriores");
  const [res, resActual] = await Promise.all([
    getFetch(`${obtenerReporteUrl}?nOrden=${nordenBuscar}&nameService=${tabla}`, token),
    getFetch(`${obtenerInfoPacienteUrl}?nOrden=${nordenActual}&nomSede=${sede}`, token),
  ]);

  if (!res || !res.norden) {
    Swal.fire("Error", "Ocurrio un error al traer los datos anteriores", "error");
    onFinish();
    return;
  }

  const hoy = new Date();
  const fechaActual = `${hoy.getFullYear()}-${("0" + (hoy.getMonth() + 1)).slice(-2)}-${("0" + hoy.getDate()).slice(-2)}`;

  set((prev) => ({
    ...prev,
    ...resActual,

    d1: labelParaLeer(res.lbl18),
    d2: labelParaLeer(res.lbl17),
    d3: labelParaLeer(res.lbl16),
    d4: labelParaLeer(res.lbl15),
    d5: labelParaLeer(res.lbl14),
    d6: labelParaLeer(res.lbl13),
    d7: labelParaLeer(res.lbl12),
    d8: labelParaLeer(res.lbl11),

    d9: labelParaLeer(res.lbl21),
    d10: labelParaLeer(res.lbl22),
    d11: labelParaLeer(res.lbl23),
    d12: labelParaLeer(res.lbl24),
    d13: labelParaLeer(res.lbl25),
    d14: labelParaLeer(res.lbl26),
    d15: labelParaLeer(res.lbl27),
    d16: labelParaLeer(res.lbl28),

    d17: labelParaLeer(res.lbl48),
    d18: labelParaLeer(res.lbl47),
    d19: labelParaLeer(res.lbl46),
    d20: labelParaLeer(res.lbl45),
    d21: labelParaLeer(res.lbl44),
    d22: labelParaLeer(res.lbl43),
    d23: labelParaLeer(res.lbl42),
    d24: labelParaLeer(res.lbl41),

    d25: labelParaLeer(res.lbl31),
    d26: labelParaLeer(res.lbl32),
    d27: labelParaLeer(res.lbl33),
    d28: labelParaLeer(res.lbl34),
    d29: labelParaLeer(res.lbl35),
    d30: labelParaLeer(res.lbl36),
    d31: labelParaLeer(res.lbl37),
    d32: labelParaLeer(res.lbl38),

    observaciones: res.txtObservaciones || "",
    observacionesCie10: res.observacionesCie10 || "",
    noPasoExamen: res?.txtObservaciones?.includes("NO PASO EXAMEN ODONTOLOGICO") ?? false,

    // El N° de orden, código y datos básicos del paciente son SIEMPRE los
    // del N° de orden ACTUAL, nunca los del norden anterior elegido.
    norden: nordenActual,
    codOd: null,
    fechaExam: fechaActual,
    nombres: resActual?.nombresApellidos ?? prev.nombres,
    sexo: resActual?.genero ?? prev.sexo,
    edad: resActual?.edad ? `${resActual.edad} años` : prev.edad,
    empresa: resActual?.empresa ?? prev.empresa,
    contrata: resActual?.contrata ?? prev.contrata,
  }));

  onFinish();
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, //revisar
    token
  )
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        // Buscar en subcarpetas también
        const jasperModules = import.meta.glob(
          "../../../../jaspers/Odontologia/**/*.jsx"
        );
        // Determinar la ruta según el nombre del jasper
        let rutaArchivo;
        if (nombre === "Odontograma_Digitalizado" || nombre === "Odontograma_lo_Digitalizado") {
          rutaArchivo = `../../../../jaspers/Odontologia/OdontogramaDigitalizado/${nombre}.jsx`;
        } else {
          rutaArchivo = `../../../../jaspers/Odontologia/${nombre}.jsx`;
        }
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
    })
    .finally(() => {
      Swal.close();
    });
};

export const PrintHojaRLO = (nro, token, tabla, datosFooter) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(
    `${obtenerReporteUrlLo}?nOrden=${nro}&nameService=${tabla}`, //revisar
    token
  )
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        // Buscar en subcarpetas también
        const jasperModules = import.meta.glob(
          "../../../../jaspers/Odontologia/**/*.jsx"
        );
        // Determinar la ruta según el nombre del jasper
        let rutaArchivo;
        if (nombre === "Odontograma_Digitalizado" || nombre === "Odontograma_lo_Digitalizado") {
          rutaArchivo = `../../../../jaspers/Odontologia/OdontogramaDigitalizado/${nombre}.jsx`;
        } else {
          rutaArchivo = `../../../../jaspers/Odontologia/${nombre}.jsx`;
        }
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
    })
    .finally(() => {
      Swal.close();
    });
};

export const PrintConsultaEjecutada = (inicio, fin, token, datosFooter) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${reporteConsultaUrl}?inicio=${inicio}&fin=${fin}`, //revisar
    token
  )
    .then(async (res) => {
      if (res.nameJasper) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        // Buscar en subcarpetas también
        const jasperModules = import.meta.glob(
          "../../../../jaspers/Odontologia/**/*.jsx"
        );
        // Determinar la ruta según el nombre del jasper
        let rutaArchivo;
        if (nombre === "Odontograma_Digitalizado" || nombre === "Odontograma_lo_Digitalizado") {
          rutaArchivo = `../../../../jaspers/Odontologia/OdontogramaDigitalizado/${nombre}.jsx`;
        } else {
          rutaArchivo = `../../../../jaspers/Odontologia/${nombre}.jsx`;
        }
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
    })
    .finally(() => {
      Swal.close();
    });
};

export const getInfoTabla = (nombreSearch, codigoSearch, setData, token) => {
  try {
    getFetch(
      `/api/v01/ct/odontograma/obtenerOdontogramaPorFiltros?${codigoSearch == "" ? "" : `nOrden=${codigoSearch}`
      }
    ${nombreSearch == "" ? "" : `&nombres=${nombreSearch}`}`,
      token
    ).then((res) => {
      console.log("pros", res);
      setData(res);
    });
  } catch (error) {
    console.error("Error en getInfoTabla:", error);
    Swal.fire(
      "Error",
      "Ocurrió un error al obtener los datos de la tabla",
      "error"
    );
  }
};
