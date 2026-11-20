import { URLAzure } from "../../../../../config/config";

//12.16

export function SubmitRegistrarPaciente(data,sede,token) {
 
    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  const [dd, mm, yyyy] = data.fechaNaciminetoPa.split('-');
  const fechaFormateada = `${yyyy}-${mm}-${dd}`;

  // Paciente ya registrado (cargado con GET datosPaciente): se reenvía su fecha-hora de registro original y
  // los campos del DTO que el formulario no muestra, para que al editar no se sobrescriban con la fecha de
  // hoy ni se borren. Paciente nuevo: fecha-hora actual y esos campos en null, como siempre.
  const existente = Boolean(data.tieneRegistro && data.fechaRegistroPa);
  const body = {
    codPa: data.codPa,
    nombresPa: data.nombresPa,
    fechaNaciminetoPa: fechaFormateada,
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
    fotoPa: data.fotoPa || null,
    codAleatorioPa: data.codAleatorioPa || null,
    telCasaPa: data.telCasaPa,
    telTrabajoPa: data.telTrabajoPa || null,
    celPa: data.celPa,
    fechaRegistroPa: existente ? data.fechaRegistroPa : `${year}-${month}-${day}`,
    apellidosPa: data.apellidosPa,
    horaRegistroPa: existente && data.horaRegistroPa ? data.horaRegistroPa : `${hours}:${minutes}:${seconds}`,
    tipoDoc: data.tipoDoc || 1,
    ...(data.cargo ? { cargo: data.cargo } : {}),
    ...(data.area ? { area: data.area } : {}),
    ...(data.tipoExamen ? { tipoExamen: data.tipoExamen } : {}),
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