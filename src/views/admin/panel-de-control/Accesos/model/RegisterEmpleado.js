import { URLAzure } from "../../../../config/config";

export default async function NewEmpleado(form, userlogued) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2);

    const data = {
        tipoDoc: form.tipoDocumento,
        numDocumento: form.nrodoc,
        nombres: form.nombres,
        apellidos: form.apellidos,
        cargo: form.cargo,
        ubigeo: form.distrito,
        sexo: form.sexo,
        cip: null,
        correoElect: form.email,
        celular: form.celular,
        telFijo: null,
        direccion: form.direccion,
        estado: form.estado,
        fechaNacimiento: form.startDate,
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: userlogued,
        fechaActualizacion: null,
        userActualizacion: null
    }

    const response = await fetch(`${URLAzure}/api/v01/st/empleado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const responseData = await response.json();
        const data = responseData.data;
        return { data: data }
    } else {
        throw new Error('Network response was not ok.');
    }

}



//12.17
export function SearchPacienteDNI(sede, dni, token) {

    const url = `${URLAzure}/api/v01/ct/registroPacientes/datosPaciente/${sede}/${dni}`
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url, options).then(res => {
        if (!res.ok) {
            return res
        } return res.json()
    }).then(response => response)
}
