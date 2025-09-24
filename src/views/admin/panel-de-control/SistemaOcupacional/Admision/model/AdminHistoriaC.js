import { URLAzure } from "../../../../../config/config";

export function SubmitHistoriaC(data, sede, token, operacion) {

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
    n_fisttest: data.n_fisttest, //1
    n_psicosen: data.n_psicosen, //2
    n_testaltura: data.n_testaltura, //3
    color: 30,
    grupoSan: null,
    grupoFactorSan: null,
    codClinica: "4353-H",
    visualCompl: data.visualCompl,//6
    trabCalientes: data.trabCalientes, //4
    chk_covid1: false,
    chk_covid2: false,
    manipAlimentos: data.manipAlimentos, //7
    textObserv1: data.textObserv1,
    textObserv2: data.textObserv2,
    codSede: sede,
    tipoPruebaCovid: "RA",
    tipoPrueba: "N/A",
    nombreHotel: "N/A",
    protocolo: "Protocolo",
    precioAdic: `${precioAdic ? 'S/.' + precioAdic : 'S/.0'}`,
    autoriza: data.autoriza,
    n_operacion: null,
    herraManuales: data.herraManuales, //8
    rxcDorsoLumbar: data.rxcDorsoLumbar, //9
    rxcKLumbar: data.rxcKLumbar, //10
    rxcLumbosacra: data.rxcLumbosacra, //5
    rxcPlomos: data.rxcPlomos,//12
    mercurioo: data.mercurioo,//13
    tmarihuana: data.tmarihuana,
    tcocaina: data.tcocaina, 
    espaciosConfinados: data.espaciosConfinados, 
    user_registro: data.user_registro,
  };

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
