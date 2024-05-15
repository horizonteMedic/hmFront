import { URLAzure } from "../../../config/config";

export default async function SubmitCodePass(email,code) {
    try{
        const response = await fetch(`${URLAzure}/api/v01/st/email/usarCodigo/${email}/${code}`, {
            method: 'GET'
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