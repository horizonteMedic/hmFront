import { URLAzure } from "../../../../config/config";

export default async function NewUser(username, password, estado, ruc, idEmpleado) {

    const data = {
        username: username,
        password: password,
        estado: estado,
        ruc: ruc,
        idEmpleado: idEmpleado
    }

    const response = await fetch(`${URLAzure}/api/v01/st/auth/register`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if(response.ok){
        return 
    } else {
        throw new Error('Network response was not ok.');
    }
        
    }

    


