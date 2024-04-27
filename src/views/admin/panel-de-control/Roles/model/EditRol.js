export default async function EditRol(id,rol,descripcion,estado,token,userlogued) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

    const data = {
        nombre: rol,
        descripcion: descripcion,
        estado: estado,
        fechaActualizacion: `${year}-${month}-${day}`,
        userActualizacion: userlogued
    }
    console.log(data)
        const response = await fetch(`https://servicios-web-hm.azurewebsites.net/api/v01/ct/rol/${id}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        if(response.ok){
            return
        } else {
            throw new Error('Network response was not ok.');
        }
        
    }

    

