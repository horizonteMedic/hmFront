import { URLAzure } from "../../../../config/config";

//12.16
export function SubmitRegistrarPaciente(data,sede,token) {
 
    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const departamentoPa = data.departamentoPa
  ? (data.departamentoPa.nombre ? data.departamentoPa.nombre : data.departamentoPa)
  : null;
    console.log(departamentoPa)
  const body = {
    codPa: data.codPa,
    nombresPa: data.nombresPa,
    fechaNaciminetoPa: data.fechaNaciminetoPa,
    sexoPa: data.sexoPa,
    emailPa: data.emailPa,
    lugarNacPa: data.lugarNacPa,
    nivelEstPa: data.nivelEstPa,
    ocupacionPa: data.ocupacionPa,
    estadoCivilPa: data.estadoCivilPa,
    direccionPa: data.direccionPa,
    departamentoPa: data.departamentoPa ? (data.departamentoPa.nombre ? data.departamentoPa.nombre : data.departamentoPa) : null,
    provinciaPa: data.provinciaPa ? (data.provinciaPa.nombre ? data.provinciaPa.nombre : data.provinciaPa): null,
    distritoPa: data.distritoPa? (data.distritoPa.nombre ? data.distritoPa.nombre : data.distritoPa): null,
    caserioPA: data.caserioPA,
    fotoPa: null,
    codAleatorioPa: null,
    telCasaPa: data.telCasaPa,
    telTrabajoPa: null,
    celPa: data.celPa,
    fechaRegistroPa: `${year}-${month}-${day}`,
    apellidosPa: data.apellidosPa,
    horaRegistroPa: `${hours}:${minutes}:${seconds}`,
    tipoDoc: 1
  };    

  const url = `${URLAzure}/api/v01/ct/registroPacientes/datosPaciente/${sede}`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }
    return fetch(url,options).then(res =>  {
        if (!res.ok) {
            return res
        } return res.json()}).then(response => response) 

}

//12.17
export function SearchPacienteDNI(sede,dni,token) {
  
  const url = `${URLAzure}/api/v01/ct/registroPacientes/datosPaciente/${sede}/${dni}`
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res =>  {
        if (!res.ok) {
            return res
        } return res.json()}).then(response => response) 
}