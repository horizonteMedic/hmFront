export default async function NewUser(username, password, estado, ruc, idEmpleado) {

    const data = {
        username: username,
        password: password,
        estado: estado,
        ruc: null,
        idEmpleado: idEmpleado
    }

    console.log('data: ',JSON.stringify(data))
    const response = await fetch('https://servicios-web-hm.azurewebsites.net/api/v01/st/auth/register', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    console.log('respuesta',response)
    if(response.ok){
        return 
    } else {
        throw new Error('Network response was not ok.');
    }
        
    }

    


