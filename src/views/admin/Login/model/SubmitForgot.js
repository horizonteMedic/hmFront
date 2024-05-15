import { URLAzure } from "../../../config/config"

export default async function SubmitForgot(email) {
    const asunto = 'Codigo de recuperación de contraseña'
    const mensaje = 'mensaje de prueba'

    const data = {
        destinatario: email,
        asunto: asunto,
        mensaje: mensaje
    }
    try{
        const response = await fetch(`${URLAzure}/api/v01/st/email/enviar-correo`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })


        if(response.ok){
            const responseData = await response.json(); 
            const data = responseData.id; 
            return { id: data }
        } else {
            return { id: null }
        }
    } catch{
        return { id: null };
    }
}

