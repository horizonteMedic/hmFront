
export default async function NewRol(rol,descripcion,estado,token,userlogued) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

    const data = {
        nombre: rol,
        descripcion: descripcion,
        estado: estado,
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: userlogued,
        fechaActualizacion: null,
        userActualizacion: null 
    }
        const response = await fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/rol', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        if(response.ok){
            const responseData = await response.json(); 
            const data = responseData.data; 
            return { data: data }
        } else {
            throw new Error('Network response was not ok.');
        }
        
    }

    


