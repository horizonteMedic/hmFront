import { useState, useEffect } from 'react';
import { useAuthStore } from "../../../../../../store/auth.js";
import { URLAzure } from "../../../../../config/config";

const ComboboxEstadoCivil = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Estado Civil`,{
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

const ComboboxDepartamentos = () => {
  const [options, setOptions] = useState([]);
  const token = useAuthStore((state) => state.token);
  useEffect(() => { 
        fetch(`${URLAzure}/api/v01/ct/departamento`,{
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
          fetch(`${URLAzure}/api/v01/ct/provincia`,{
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
          fetch(`${URLAzure}/api/v01/ct/distrito`,{
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
          fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Sexo`,{
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
          fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Tipo de Documento`,{
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
          fetch(`${URLAzure}/api/v01/ct/sede`,{
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

const ComboboxContratas = () => {
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

  //NEWS
const ComboboxNivelE = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Nivel de Estudios`,{
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

const ComboboxProfesión = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
          fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Profesion o Ocupacion`,{
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

  //ComboboxPALOTROFORUMLARIO
const ComboboxFormaPago = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Formas de pago`,{
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
}

const ComboboxListAuth = () => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/detalleParametros/detalleParametrizable/Autorizacion`,{
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
}

const ComboboxEmpresasMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoEmpresasMutisucursal/${sede}`,{
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
}

const ComboboxContratasMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoContratasMutisucursal/${sede}`,{
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
}

const ComboboxMedicosMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoNombreMedicosMutisucursal/${sede}`,{
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
}

const ComboboxPruebaMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoTipoPruebaMutisucursal/${sede}`,{
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
}

const ComboboxCargoMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoCargoMutisucursal/${sede}`,{
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
}

const ComboboxAreaMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoAreaMutisucursal/${sede}`,{
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
}

const ComboboxExamenMMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoTipoExamenMutisucursal/${sede}`,{
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
}

const ComboboxExplotacionMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoExplotacionMutisucursal/${sede}`,{
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
}

const ComboboxMineralMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoMineralMutisucursal/${sede}`,{
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
}

const ComboboxAlturaMulti = (sede) => {
    const [options, setOptions] = useState([]);
    const token = useAuthStore((state) => state.token);
    useEffect(() => { 
        
          fetch(`${URLAzure}/api/v01/ct/ocupacional/listadoAlturaMutisucursal/${sede}`,{
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
}

const ComboboxPrecioExamenMulti = (sede,examen,token) => {
    
        return fetch(`${URLAzure}/api/v01/ct/ocupacional/PrecioExamenMutisucursal/${sede}/${examen}`,{
          method: 'GET', 
          headers: {
              'Authorization': `Bearer ${token}`
          },
      })
          .then(res => res.json())
          .then(response => response)
          .catch((error) => {
              console.error('Error obteniendo opciones de tipo de documento:', error);
          });
     
}

export { ComboboxEstadoCivil,ComboboxDepartamentos, ComboboxProvincias, ComboboxDistritos, 
    ComboboxSexo, ComboboxTipoDoc, ComboboxSedes, ComboboxNivelE, ComboboxProfesión, ComboboxEmpresas, ComboboxContratas,
    ComboboxFormaPago, ComboboxListAuth, ComboboxEmpresasMulti, ComboboxContratasMulti, ComboboxMedicosMulti, ComboboxPruebaMulti,
    ComboboxCargoMulti, ComboboxAreaMulti, ComboboxExamenMMulti,ComboboxExplotacionMulti, ComboboxMineralMulti, ComboboxAlturaMulti, ComboboxPrecioExamenMulti }