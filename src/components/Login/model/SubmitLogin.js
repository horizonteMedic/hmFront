export default async function SubmitLogin(user,password) {

    const data = {
        nombre: user,
        password: password
    }
    console.log(data)
    try{
        const response = await fetch('https://servicios-web-hm.azurewebsites.net/api/v01/st/auth/login', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })


        if(response.ok){
            console.log('datos enviados')
            return 
        } else {
            console.log('datos no enviados')
        }
    } catch{
        console.log('error de red')
        return { estado: '200' };
    }
}

