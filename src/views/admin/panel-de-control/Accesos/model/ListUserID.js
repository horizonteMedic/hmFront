import { useEffect, useState } from "react";

export function ListUser(id, token) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    console.log('id',id)
    useEffect(() => {
        setLoading(true);
        fetch(`https://servicios-web-hm.azurewebsites.net/api/v01/ct/usuario/${id}`,{
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then((response => response.json()))
            .then(data => {
                console.log('datos:',data)
                setData(data);
            })
            .finally(() => setLoading(false))
    }, [])
    
    return {data, loading}
    
}