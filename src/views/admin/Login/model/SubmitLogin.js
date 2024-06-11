import { URLAzure } from "../../../config/config"

export default async function SubmitLogin(user,password) {

    const data = {
        nombre: user,
        password: password
    }
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/st/auth/login`,options)
    .then(res => {
        if (!res.ok) {
            return res.status
    }  return res.json()
})
    .then(response => response)
}
    
