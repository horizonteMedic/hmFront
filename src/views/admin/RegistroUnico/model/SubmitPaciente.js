import { URLAzure } from "../../../config/config";

//12.16
export function SubmitRegistrarPaciente(data,token) {
 
    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
  const body = {
    codPa: data.dni,
    nombresPa: data.nombres,
    fechaNaciminetoPa: data.fechaNacimiento,
    sexoPa: data.sexo,
    emailPa: data.email,
    lugarNacPa: data.lugarNacimiento,
    nivelEstPa: data.nivelEstudio,
    ocupacionPa: data.profesion,
    estadoCivilPa: data.estadoCivil,
    direccionPa: data.direccion,
    departamentoPa: data.departamento ? (data.departamento.nombre ? data.departamento.nombre : data.departamento) : null,
    provinciaPa: data.provincia ? (data.provincia.nombre ? data.provincia.nombre : data.provincia): null,
    distritoPa: data.distrito? (data.distrito.nombre ? data.distrito.nombre : data.distrito): null,
    caserioPA: data.caserio,
    fotoPa: null,
    codAleatorioPa: null,
    telCasaPa: data.telefono,
    telTrabajoPa: null,
    celPa: data.celular,
    fechaRegistroPa: `${year}-${month}-${day}`,
    apellidosPa: data.apellidos,
    horaRegistroPa: `${hours}:${minutes}:${seconds}`,
    tipoDoc: 1
  };    

  const url = `${URLAzure}/api/v01/ct/registroPacientes/datosPaciente/T-NP`
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