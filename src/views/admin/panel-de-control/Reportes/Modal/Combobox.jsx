import { useState, useEffect } from 'react';
import { useAuthStore } from "../../../../../store/auth"

const ComboboxSedes = () => {
  const [options, setOptions] = useState([]);
  const token = useAuthStore((state) => state.token);
  const userlogued = useAuthStore((state) => state.userlogued);
  useEffect(() => { 
        fetch(`https://servicios-web-hm.azurewebsites.net/api/v01/ct/sistemaArchivos/sedePorUsuario/${userlogued.sub}`,{
        method: 'GET', 
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .then((data) => {
            setOptions(data);
        })
        .catch((error) => {
            console.error('Error obteniendo opciones de tipo de documento:', error);
        });
    }, []);

  return options;
};


export { ComboboxSedes }