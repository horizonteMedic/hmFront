import { URLAzure } from "../../../../../config/config";
import { getHoraActual } from "../../../../../utils/helpers";
import { parseMoney } from "../../../../../utils/listUtils";
const FIELDS_TO_COMPARE = [
  'montoAdicionales',
  'montoProtocolo',
  'montoTotal',
  'fechaPago',
  'formaPago',
];

export function SubmitHistoriaC(data, sede, token, operacion, originalExams = [], originalPago = {}) {

  const removePrefix = (str, prefix) => {
    if (typeof str !== "string") return ""; // o puedes lanzar un error si prefieres
    const regex = new RegExp('^' + prefix);
    return str.replace(regex, '');
  };
  const precioAdic = removePrefix(data.precioAdic, 'S/.');
  const currentDate = new Date(); // Obtiene la fecha y hora actual
  const year = currentDate.getFullYear(); // Obtiene el año actual
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
  const day = ('0' + currentDate.getDate()).slice(-2);
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  const [dd, mm, yyyy] = data.fechaAperturaPo.split('/');
  const fechaFormateada = `${yyyy}/${mm}/${dd}`;

  // ---- CALCULAR versionRegistro ----
  let versionExamenes = 1;
  if (data.versionRegistroExamenes && Number(data.versionRegistroExamenes) > 0) {
    versionExamenes = Number(data.versionRegistroExamenes) + 1;
  }

  let versionPago = 1;
  if (data.versionRegistroPago && Number(data.versionRegistroPago) > 0) {
    versionPago = Number(data.versionRegistroPago) + 1;
  }

  const hasPagoChanges = (current, original) => {
    if (!original) return true;

    for (const field of FIELDS_TO_COMPARE) {
      if (
        (current[field] ?? null) !==
        (original[field] ?? null)
      ) {
        return true;
      }
    }

    return false;
  };



  // -------- VALIDACIÓN DE CAMBIOS EN EXÁMENES (SOLO PARA EDICIÓN) --------
  let examenesBody = [];
  let pagoBody = {};
  //EXAMENES
  if (operacion === 2 && originalExams) {
    // Función auxiliar para obtener IDs de exámenes
    const getExamIds = (list) => {
      if (!list) return new Set();
      return new Set(list.map(ex => ex.idExamen || ex.id));
    };

    const currentIds = getExamIds(data.examenesAdicionales);
    const originalIds = getExamIds(originalExams);

    // Verificar si hay cambios
    let hasChanges = false;
    if (currentIds.size !== originalIds.size) {
      hasChanges = true;
    } else {
      for (let id of currentIds) {
        if (!originalIds.has(id)) {
          hasChanges = true;
          break;
        }
      }
    }

    if (hasChanges) {
      // Si hay cambios, armamos la lista con la nueva versión
      examenesBody = data.examenesAdicionales.map(ex => ({
        id: null,
        idExamenAdicionalProtocolo: ex.idExamenAdicionalProtocolo,
        versionRegistro: versionExamenes,
        usuarioRegistro: data.user_registro,
        norden: null
      }));
    } else {
      // Si no hay cambios, enviamos lista vacía y mantenemos la versión anterior (o no enviamos nada si el backend lo maneja)
      // El requerimiento dice: "si no hago ningun cambio... debe enviar una lista vacia []"
      examenesBody = [];
      // Nota: Si enviamos lista vacía, el backend probablemente no actualizará los exámenes ni la versión.
    }
  } else {
    // Para registro nuevo (operacion 1) o si no se pasaron originalExams, comportamiento normal
    examenesBody = data.examenesAdicionales.map(ex => ({
      id: null,
      idExamenAdicionalProtocolo: ex.idExamenAdicionalProtocolo,
      versionRegistro: versionExamenes,
      usuarioRegistro: data.user_registro,
      norden: null
    }));
  }

  //PAGO
  if (operacion === 2 && originalPago) {
    const precioPo = parseMoney(data.precioPo)
    const currentPago = {
      montoAdicionales: Number(data.montoAdicionales) ?? 0,
      montoProtocolo: Number(data.montoProtocolo) ?? 0,
      montoTotal: Number(precioPo) ?? 0,
      fechaPago: data.fechaPago,
      formaPago: data.tipoPago,
    };
    const pagoChanged = hasPagoChanges(currentPago, originalPago);
    if (pagoChanged) {
      // HAY cambios → nueva versión
      pagoBody = {
        versionRegistro: versionPago,
        montoAdicionales: currentPago.montoAdicionales,
        montoProtocolo: currentPago.montoProtocolo,
        montoTotal: currentPago.montoTotal,
        fechaPago: currentPago.fechaPago,
        horaPago: getHoraActual(),
        formaPago: currentPago.formaPago,
        usuarioRegistro: data.user_registro,
        estado: true,
      };

    } else {
      // NO hay cambios → reenviar original
      pagoBody = null
    }
  } else {
    pagoBody = {
      versionRegistro: versionPago,
      montoAdicionales: Number(data.montoAdicionales) ?? 0,
      montoProtocolo: Number(data.montoProtocolo) ?? 0,
      montoTotal: Number(data.precioPo) ?? 0,
      fechaPago: data.fechaPago,
      horaPago: getHoraActual(),
      formaPago: data.tipoPago,
      usuarioRegistro: data.user_registro,
      estado: true,
    }
  }

  function formatPrecioPo(value) {
    if (value == null) return "";

    const str = value.toString().trim();

    // Si ya viene con formato S/.
    if (/^S\/\.\s*\d+(\.\d+)?$/.test(str)) {
      return str;
    }

    // Si es solo número (entero o decimal)
    if (/^\d+(\.\d+)?$/.test(str)) {
      return `S/.${str}`;
    }

    // Cualquier otro caso, devolver tal cual (por seguridad)
    return str;
  }


  const body = {

    tipoOperacion: operacion,
    n_orden: data.n_orden ? data.n_orden : null,
    codPa: data.codPa,
    razonEmpresa: data.razonEmpresa,
    razonContrata: data.razonContrata,
    nomEx: data.nomEx,
    alturaPo: data.alturaPo,
    mineralPo: data.mineralPo,
    fechaAperturaPo: fechaFormateada,
    precioPo: formatPrecioPo(data.precioPo),
    estadoEx: "EN PROCESO",
    nomExamen: data.nomExamen,
    cargoDe: data.cargoDe,
    areaO: data.areaO,
    n_medico: data.n_medico,
    n_hora: `${hours}:${minutes}:${seconds}`,
    tipoPago: data.tipoPago,
    n_fisttest: false, //1
    n_psicosen: false, //2
    n_testaltura: false, //3
    color: 30,
    grupoSan: null,
    grupoFactorSan: null,
    codClinica: "4353-H",
    visualCompl: false,//6
    trabCalientes: false, //4
    chk_covid1: false,
    chk_covid2: false,
    manipAlimentos: false, //7
    textObserv1: data.textObserv1,
    textObserv2: data.textObserv2,
    codSede: sede,
    tipoPruebaCovid: "RA",
    tipoPrueba: "N/A",
    nombreHotel: "N/A",
    protocolo: data.idProtocolo, //Protocolooooo ID
    precioAdic: `${precioAdic ? 'S/.' + precioAdic : 'S/.0'}`,
    autoriza: data.autoriza,
    n_operacion: null,
    herraManuales: false, //8
    rxcDorsoLumbar: false, //9
    rxcKLumbar: false, //10
    rxcLumbosacra: false, //5
    rxcPlomos: false,//12
    mercurioo: false,//13
    tmarihuana: false,
    tcocaina: false,
    espaciosConfinados: false,
    user_registro: data.user_registro,
    examenesAdicionales: examenesBody,
    detallePago: pagoBody
    //ID NO MANDO
    /*versionRegistro: versionPago, //EL ME ENVIA UNA VERSION Y SI ACTUALIZO ES LA VERSION + 1, SI NO ACTUALIZO NO ENVIO TODO DETALLE PAGO
    montoAdicionales: data.montoAdicionales,
    montoProtocolo: data.montoProtocolo,
    montoTotal: data.precioPo,
    //idConfiguracionDeposito NO ENVIAR
    fechaPago: fechaFormateada,
    horaPago: { //ENVIAR HORA PAGO; SOLO PASO PARA CUANDO SE REGISTRE NO PARA CUANDO SE ACTUALIZA
      hour: hours,
      minute: minutes,
      second: seconds,
      nano: 0
    },
    formaPago: data.tipoPago,
    usuarioRegistro: data.user_registro,
    //CRISTIAN WEBON
    estado: true, //seimpre true
    //norden: null //NO ENVIAR*/
  };

  console.log(body)

  const url = `${URLAzure}/api/v01/ct/registroPacientes/historiaClinicaOcupacional`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }
  return fetch(url, options).then(res => {
    if (!res.ok) {
      return res
    } return res.json()
  }).then(response => response)
}

export function GetHistoriaC(data, sede, token) {

  const body = {
    opcion_id_p: data.opcion_id_p,
    norden_p: data.norden,
    nombres_apellidos_p: data.nombres_apellidos_p,
    cod_sede_p: sede
  };
  const url = `${URLAzure}/api/v01/ct/registroPacientes/listadoHistoriasOcupacionalesConFiltros`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }
  return fetch(url, options).then(res => {
    if (!res.ok) {
      return res
    } return res.json()
  }).then(response => response)
}
