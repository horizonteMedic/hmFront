import { URLAzure } from "../../../../config/config";

export default async function DeleteEmpleado(empleadoId, TipoDoc, Nrodoc, Nombres, Apellidos, Cargo, Distrito, Cip, Email, Celular, Direccion,  
    FechaNacimiento, fechaRegistro, sexo, UserRegistro, User) {
    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    const actual = `${year}-${month}-${day}`

    const data = {
        tipoDoc: TipoDoc,
        numDocumento: Nrodoc,
        nombres: Nombres,
        apellidos: Apellidos,
        cargo: Cargo,
        ubigeo: Distrito,
        sexo: sexo,
        cip: Cip,
        correoElect: Email,
        celular: Celular,
        telFijo: null,
        direccion: Direccion,
        estado: false,
        fechaNacimiento: FechaNacimiento,
        fechaRegistro: fechaRegistro,
        userRegistro: UserRegistro,
        fechaActualizacion: actual,
        userActualizacion: User
    }
    try {
        const response = await fetch(`${URLAzure}/api/v01/st/empleado/${empleadoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(response.ok){
            const responseData = await response.json(); 
            return responseData;
        } else {
            throw new Error('No se pudo eliminar el empleado');
        }
    } catch (error) {
        throw new Error('Error al eliminar el empleado: ' + error.message);
    }
}
