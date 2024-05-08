import { URLAzure } from "../../../../config/config";

//El rol no se borra, solo se pone su estado en false
export default async function DeleteRol(id,token){

    const response = await fetch(`${URLAzure}/api/v01/ct/rol/${id}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }

        })

        if(response.ok){
            return
        } else {
            throw new Error('Network response was not ok.');
        }

}