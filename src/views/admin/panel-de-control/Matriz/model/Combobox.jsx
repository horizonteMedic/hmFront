import { useState, useEffect } from 'react';
import { useAuthStore } from "../../../../../store/auth"
import { URLAzure } from '../../../../config/config';

const ComboboxEmpresa = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch(`${URLAzure}/api/v01/ct/sistemaArchivos/listadoEmpresasOcontratas/EMPRESA`,{
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

const ComboboxContrata = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch(`${URLAzure}/api/v01/ct/sistemaArchivos/listadoEmpresasOcontratas/CONTRATA`,{
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

export { ComboboxEmpresa, ComboboxContrata, ComboboxSedes }