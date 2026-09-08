import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch.js";
import { SubmitHistoriaOcupacional } from "../model/model.js";
import { convertirGenero } from "../../../../../utils/helpers.js";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils.js";

// ===== Configuración =====
const existenciaUrl = "/api/v01/ct/consentDigit/existenciaExamenes";
const infoPacienteUrl = "/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros";
const detallesPorNordenUrl =
  "/api/v01/ct/historiaOcupacional/obtenerHistoriaOcupacionalDetallesPorNorden";
const ultimoDetallePorDniUrl =
  "/api/v01/local-huamachuco/historiaOcupacional/obtenerUltimoDetalleRegistroPorDni";
const obtenerReporteUrl =
  "/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional";

// Reporte Jasper. El glob debe ser un literal para que Vite lo resuelva en build.
const jasperModules = import.meta.glob(
  "../../../../../jaspers/HistoriaOcupacional/*.jsx"
);

export const Loading = (text) => {
  Swal.fire({
    title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
    html: `<div style="font-size:1.1em;"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
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
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// ===== Utilidades =====
const getAñoInicial = (fecha) => {
  const match = fecha?.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : Infinity;
};

// Ordena los detalles por el año que aparece primero en el campo "fecha".
const ordenarDetalles = (detalles = []) =>
  [...detalles].sort((a, b) => getAñoInicial(a.fecha) - getAñoInicial(b.fecha));

// ===== Verificación por N° Orden =====
// Decide si el N° Orden corresponde a un registro NUEVO o EXISTENTE y delega la
// carga en el mapeo correspondiente. Mantiene el flujo original (id === 0 -> nuevo).
export const VerifyTR = async (nro, tabla, token, set, sede, setTable) => {
  if (!nro) {
    await Swal.fire(
      "Error",
      "Debe Introducir un N° Orden válido",
      "error"
    );
    return;
  }

  Loading("Validando datos");
  const res = await getFetch(
    `${existenciaUrl}?nOrden=${nro}&nomService=${tabla}`,
    token
  );

  if (!res || res.error) {
    Swal.fire(
      "Norden no encontrado",
      `No se encontraron registros para el N° Orden ${nro}.`,
      "warning"
    );
    return;
  }

  if (res.id === 0) {
    // Registro NUEVO: datos del paciente + historia ocupacional previa.
    const dni = await GetInfoServicio(nro, set, token, sede);
    GetInfoAnterior(dni, nro, token, setTable, sede);
  } else {
    // Registro EXISTENTE.
    Swal.fire(
      "Alerta",
      "Este paciente ya cuenta con registros de Historia Ocupacional.",
      "warning"
    );
    GetInfoServicioEditar(nro, tabla, set, token, setTable);
  }
};

// ===== Mapeo: Registro nuevo (datos del paciente) =====
// Devuelve el DNI del paciente para poder buscar su historia previa.
export const GetInfoServicio = async (nro, set, token, sede) => {
  let dni;
  const res = await getFetch(
    `${infoPacienteUrl}?nOrden=${nro}&nomSede=${sede}`,
    token
  );

  if (res && !res.error) {
    set((prev) => ({
      ...prev,
      norden: res.norden ?? prev.norden,
      // Datos personales
      nombres: res.nombresApellidos ?? "",
      dni: res.dni ?? "",
      edad: res.edad ?? "",
      sexo: convertirGenero(res.genero),
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      lugarNacimiento: res.lugarNacimiento ?? "",
      estadoCivil: res.estadoCivil ?? "",
      nivelEstudios: res.nivelEstudios ?? "",
      // Datos laborales
      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      ocupacion: res.areaO ?? "",
      cargoDesempenar: res.cargo ?? "",
      // Área de trabajo (campo propio de Historia Ocupacional).
      areaO: res.areaO ?? "",
      tieneRegistro: false,
    }));
    dni = res.dni;
  }

  Swal.close();
  return dni;
};

// ===== Historia ocupacional previa (solo para registro nuevo) =====
// 1) Detalles asociados al mismo N° Orden.
// 2) Si no hay y la sede es HMAC, se busca el último registro por DNI en Huamachuco.
export const GetInfoAnterior = (dni, nro, token, setTable, sede) => {
  getFetch(`${detallesPorNordenUrl}?nOrden=${nro}`, token)
    .then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        Swal.fire(
          "Info",
          "Se cargó la historia ocupacional previa de este N° Orden.",
          "info"
        );
        setTable(ordenarDetalles(res));
        return;
      }
      if (sede === "HMAC") {
        GetInfoHuamachuco(dni, nro, token, setTable);
      } else {
        Swal.fire(
          "Info",
          "Este N° Orden no tiene registros de historia ocupacional previos.",
          "info"
        );
      }
    })
    .catch((err) => {
      console.error(err);
      Swal.close();
    });
};

const GetInfoHuamachuco = (dni, nro, token, setTable) => {
  Loading("Buscando en Huamachuco");
  getFetch(`${ultimoDetallePorDniUrl}?dni=${dni}`, token).then((res) => {
    if (res && res.resultado) {
      setTable(ordenarDetalles(res.resultado.detalles || []));
      Swal.close();
    } else {
      Swal.fire(
        "Info",
        "Este N° Orden no tiene registros de historia ocupacional previos en Huamachuco.",
        "info"
      );
    }
  });
};

// ===== Mapeo: Edición (registro existente) =====
export const GetInfoServicioEditar = (
  nro,
  tabla,
  set,
  token,
  setTable,
  onFinish = () => {}
) => {
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then((res) => {
      if (res && res.norden) {
        set((prev) => ({
          ...prev,
          norden: res.norden ?? prev.norden,
          codHo: res.codHo ?? null,
          fecha: res.fechaHo ?? prev.fecha,
          areaO: res.areaO ?? prev.areaO ?? "",
          // Datos personales (defensivo: el nombre de campo varía según el backend).
          nombres: res.nombresApellidos ?? res.nombres ?? "",
          dni: res.dni ?? res.dniPa ?? "",
          edad: res.edad ?? "",
          sexo: convertirGenero(res.sexo ?? res.genero),
          fechaNacimiento: formatearFechaCorta(
            res.fechaNac ?? res.fechaNacimiento ?? ""
          ),
          lugarNacimiento: res.lugarNac ?? res.lugarNacimiento ?? "",
          estadoCivil: res.estadoCivilPaciente ?? "",
          nivelEstudios: res.nivelEstudioPaciente ?? "",
          // Datos laborales
          empresa: res.empresa ?? "",
          contrata: res.contrata ?? "",
          ocupacion: res.ocupacion ?? res.areaO ?? "",
          cargoDesempenar: res.cargo ?? res.cargoPaciente ?? "",
          // Médico que certifica
          user_medicoFirma: res.usuarioFirma
            ? res.usuarioFirma
            : prev.user_medicoFirma,
          // Auditoría REAL (defensivo). Se guarda cruda; la vista la formatea.
          fechaRegistro: res.fechaRegistro ?? "",
          userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
          fechaActualizacion: res.fechaActualizacion ?? "",
          usuarioActualizacion: res.usuarioActualizacion ?? "",
          tieneRegistro: true,
          eliminados: [],
        }));
        setTable(ordenarDetalles(res.detalles || []));
      } else {
        Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
      }
    })
    .catch((err) => {
      console.error(err);
      Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
    })
    .finally(() => {
      Swal.close();
      onFinish();
    });
};

// ===== Guardar / Actualizar =====
export const SubmiteHistoriaOcupacionalController = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  registros
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  Loading("Registrando Datos");
  SubmitHistoriaOcupacional(form, registros, user, token)
    .then((res) => {
      if (res.id === 1 || res.id === 0) {
        Swal.fire({
          title: "Éxito",
          text: `${res.mensaje ?? ""},\n¿Desea imprimir?`,
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
        Swal.fire("Error", "Ocurrió un error al Registrar", "error");
      }
    })
    .catch(() => {
      Swal.fire("Error", "Ocurrió un error al Registrar", "error");
    });
};

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then(async (res) => {
      if (res && res.norden) {
        const nombre = res.nameJasper;
        const loader =
          jasperModules[
            `../../../../../jaspers/HistoriaOcupacional/${nombre}.jsx`
          ];
        if (!loader) {
          console.error(`Jasper no encontrado: ${nombre}`);
          Swal.fire("Error", "No se encontró el formato de impresión.", "error");
          return;
        }
        const modulo = await loader();
        if (typeof modulo.default === "function") {
          modulo.default(res);
        } else {
          console.error(
            `El archivo ${nombre}.jsx no exporta una función por defecto`
          );
        }
      }
      Swal.close();
    })
    .catch(() => Swal.close());
};

// ===== Autocompletables (empresa, altitud, área, ocupación, riesgo, protección) =====
export const handleSearch = (e, setSearch, change, setFiltered, list) => {
  const v = e.target.value.toUpperCase();
  setSearch(v);
  change(e.target.name, v);
  setFiltered(
    v ? list.filter((m) => m.mensaje.toLowerCase().includes(v.toLowerCase())) : []
  );
};

export const handleSelect = (e, name, value, setSearch, change, setFiltered) => {
  setSearch(value.toUpperCase());
  change(name, value.toUpperCase());
  setFiltered([]);
};
