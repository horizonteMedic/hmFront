export default async function DeleteRol(id,token){

    const response = await fetch(`https://servicios-web-hm.azurewebsites.net/api/v01/ct/rol/${id}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${token}`
            }

        })
        console.log('espursta:',response)
        if(response.ok){
            return
        } else {
            throw new Error('Network response was not ok.');
        }

}