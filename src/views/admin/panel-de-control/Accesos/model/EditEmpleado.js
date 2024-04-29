export default async function EditEmpleado(ID, TipoDoc, Nrodoc, Nombres, Apellidos, Email, FechaNacimiento, 
    Cip, Celular, Distrito, Direccion, Cargo, Estado, FechaInicio, UserRegistro, User) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    const actual = `${year}-${month}-${day}`

    let FechaNac = ''

    if (FechaNacimiento instanceof Date) {
        const Fecha = FechaNacimiento ? FechaNacimiento.toISOString().split('T')[0] : '';
        FechaNac = Fecha
    } else {
        FechaNac = FechaNacimiento
    }
    console.log(FechaNac)
    const data = {
        tipoDoc: TipoDoc,
        numDocumento: Nrodoc,
        nombres: Nombres,
        apellidos: Apellidos,
        cargo: Cargo,
        ubigeo: Distrito,
        cip: Cip,
        correoElect: Email,
        celular: Celular,
        telFijo: null,
        direccion: Direccion,
        estado: Estado,
        fechaNacimiento: FechaNac,
        fechaRegistro: FechaInicio,
        userRegistro: UserRegistro,
        fechaActualizacion: actual,
        userActualizacion: User
    }

    console.log('JOSN: ',JSON.stringify(data))
        const response = await fetch(`https://servicios-web-hm.azurewebsites.net/api/v01/st/empleado/${ID}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        console.log(response)
        if(response.ok){
            return
        } else {
            throw new Error('Network response was not ok.');
        }
        
    }

    


