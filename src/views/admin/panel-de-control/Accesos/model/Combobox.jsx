import { useState, useEffect } from 'react';
import { useAuthStore } from "../../../../../store/auth"

const ComboboxDepartamentos = () => {
  const [options, setOptions] = useState([]);
  const token = useAuthStore((state) => state.token);
  useEffect(() => { 
        fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/departamento',{
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

const ComboboxProvincias = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/provincia',{
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
  
const ComboboxDistritos = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/distrito',{
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

const ComboboxSexo = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/detalleParametros/detalleParametrizable/Sexo',{
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

const ComboboxTipoDoc = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/detalleParametros/detalleParametrizable/Tipo de Documento',{
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
    useEffect(() => { 
          fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/sede',{
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

export { ComboboxDepartamentos, ComboboxProvincias, ComboboxDistritos, ComboboxSexo, ComboboxTipoDoc, ComboboxSedes }