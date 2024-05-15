import { URLAzure } from "../../../config/config";

export default async function SubmitLogin(user,password) {

    const data = {
        nombre: user,
        password: password
    }

    try{
        const response = await fetch(`${URLAzure}/api/v01/st/auth/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })


        if(response.ok){
            const responseData = await response.json(); // Convertir la respuesta a JSON
            const token = responseData.token; // Obtener el token de la respuesta
            return { estado: response.status, token: token }
        } else {
            return { estado: `${response.status}`, token: null }
        }
    } catch{
        return { estado: '501' };
    }
}

