import { useState, useEffect } from 'react';
import { useAuthStore } from "../../../../../store/auth"
import { URLAzure } from '../../../../config/config';
const ComboboxSedes = () => {
  const [options, setOptions] = useState([]);
  const token = useAuthStore((state) => state.token);
  const userlogued = useAuthStore((state) => state.userlogued);
  useEffect(() => { 
        fetch(`${URLAzure}/api/v01/ct/sistemaArchivos/sedePorUsuario/${userlogued.sub}`,{
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

const ComboboxEmpresas = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    const userlogued = useAuthStore((state) => state.userlogued);
    useEffect(() => { 
          fetch(`${URLAzure}/api/v01/ct/sistemaArchivos/busquedaEmpresaContrata/${userlogued.sub}/EMPRESA`,{
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
  
const ComboboxContratas = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    const userlogued = useAuthStore((state) => state.userlogued);
    useEffect(() => { 
          fetch(`${URLAzure}/api/v01/ct/sistemaArchivos/busquedaEmpresaContrata/${userlogued.sub}/CONTRATA`,{
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
  

export { ComboboxSedes, ComboboxEmpresas, ComboboxContratas }