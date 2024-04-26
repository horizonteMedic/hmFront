import { useEffect, useState } from "react";

export function getFetch(url, token) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        fetch(url,{
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then((response => response.json()))
            .then(data => {
                setData(data);
            })
            .finally(() => setLoading(false))
    }, [])
    
    return {data, loading}
    
}