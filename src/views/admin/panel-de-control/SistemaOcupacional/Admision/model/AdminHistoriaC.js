import { URLAzure } from "../../../../../config/config";

export function SubmitHistoriaC(data, sede, token, operacion, originalExams = []) {

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
  let version = 1;
  if (data.versionRegistro && Number(data.versionRegistro) > 0) {
    version = Number(data.versionRegistro) + 1;
  }

  // -------- VALIDACIÓN DE CAMBIOS EN EXÁMENES (SOLO PARA EDICIÓN) --------
  let examenesBody = [];

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
        versionRegistro: version,
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
      versionRegistro: version,
      usuarioRegistro: data.user_registro,
      norden: null
    }));
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
    precioPo: data.precioPo,
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
    examenesAdicionales: examenesBody
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
