export default async function SubmitPasswordActualizado(email,password) {
    try{
        const response = await fetch(`https://servicios-web-hm.azurewebsites.net/api/v01/st/email/actualizarPassword/${email}/${password}`, {
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