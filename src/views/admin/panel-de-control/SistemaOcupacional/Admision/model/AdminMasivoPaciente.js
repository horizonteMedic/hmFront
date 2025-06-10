import { URLAzure } from "../../../../../config/config";

//12.16
export function SubmitMasivoRegistarPaciente(data,sede,token) {
 
    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
  const body = {
    codPa: data.DNI,
    nombresPa: data.Nombres,
    fechaNaciminetoPa: data.FechaNacimiento,
    sexoPa: data.Sexo,
    emailPa: data.Email,
    lugarNacPa: data.LugarNacimiento,
    nivelEstPa: data.NivelEstudios,
    ocupacionPa: data.Ocupacion,
    estadoCivilPa: data.EstadoCivil,
    direccionPa: data.Direccion,
    departamentoPa: data.Departamento,
    provinciaPa: data.Provincia,
    distritoPa: data.Distrito,
    caserioPA: data.Caserio,
    fotoPa: null,
    codAleatorioPa: null,
    telCasaPa: data.Telefono,
    telTrabajoPa: null,
    celPa: data.Celular,
    fechaRegistroPa: `${year}-${month}-${day}`,
    apellidosPa: data.Apellidos,
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
export function SubmitCitas(data,user,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    const body = {
        dni: data.dni,
        celular: data.celular ? data.celular : null,
        fechaReserva: data.fechaReserva,
        nomenSede: data.nomenSede,
        rucEmpresa: data.rucEmpresa,
        rucContrata: data.rucContrata,
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: user,
        fechaActualizacion: null,
        userActualizacion: null,
        cargo: data.cargo,
        area: data.area,
        tipoExamen: data.tipoExamen
    }
    const url = `${URLAzure}/api/v01/ct/ocupacional/citaOcupacional`
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
