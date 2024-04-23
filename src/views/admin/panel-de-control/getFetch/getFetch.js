import { useEffect, useState } from "react";

export function getFetch(url) {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos obtenidos:', data);
            setData(data => setData(data));
        })
        .catch(error => console.error('Error en la solicitud Fetch:', error));
    },[])

    return {data}
}