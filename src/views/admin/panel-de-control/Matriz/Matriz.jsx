import React, { useEffect, useState } from 'react';
import './pagina_manteniminento.css';
import { ComboboxContrata, ComboboxSedes } from './model/Combobox';
import { GetMatrizAdmin } from './model/MatrizPOST';
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';
import { HeadsetMicTwoTone } from '@mui/icons-material';

const MatrizPostulante = () => {

  const token = useAuthStore(state => state.token);
  const [loading, setLoading] = useState(false)
  // Estado para los selectores de empresa y sede
  const [datos, setDatos] = useState({
    rucContrata: '',
    rucEmpresa: '',
    fechaInicio: '',
    fechaFinal: '',
    sede: ''
  })
  const [data, setData] = useState([])
  const [head, setHeaders] = useState([])
  
  const today = new Date().toISOString().split('T')[0];
  const Contratas = ComboboxContrata()
  const Sedes = ComboboxSedes()

  useEffect(() => {
    if (today) {
      setDatos(prevDatos => ({
        ...prevDatos,
        fechaInicio: today,
        fechaFinal: today,
      }));
    }
  },[today])

  useEffect(() => {
    
    const ContrataDefiner = Contratas.find(contrata => contrata.ruc === '20602703119')
    const SedeDefiner = Sedes.find(sedes => sedes.cod_sede === 'T-NP')

    if (ContrataDefiner) {
      setDatos(prevDatos => ({
        ...prevDatos,
        rucContrata: ContrataDefiner,
      }));
    } 

    if (SedeDefiner) {
      setDatos(prevDatos => ({
        ...prevDatos,
        sede: SedeDefiner
      }))
    }
  },[Contratas, Sedes])
  
  // Funciones de manejo de eventos para actualizar el estado cuando se selecciona una opción
  const handleChange = (e) => {
    const { name } = e.target;
    const selectedOption = JSON.parse(e.target.value);
    setDatos({
      ...datos,
      [name]: selectedOption,
    });
  };

  const SubmitAPI = () => {
    setLoading(true)
    const datosapi = {
      rucContrata: datos.rucContrata.ruc,
      rucEmpresa: '',
      fechaInicio: datos.fechaInicio,
      fechaFinal: datos.fechaFinal,
      sede: datos.sede.cod_sede
    }
    GetMatrizAdmin(datosapi,token)
    .then(response => {
      setData(response)
      const headers = Object.keys(response[0]);
      setHeaders(headers)
    })
    .catch(error => {
      console.log('ocurrio un telible Error',error)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Matriz Postulante</h1>
        </div>
        <div className="grid grid-cols-4 gap-4 p-6">
          <div>
            <p className="font-semibold">R.U.C. Contrata</p>
            <select
              value={datos.rucContrata ? JSON.stringify(datos.rucContrata) : ''}
              onChange={handleChange}
              name='rucContrata'
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Seleccionar Contrata</option>
              {Contratas.map((option) => (
                <option key={option.ruc} value={JSON.stringify(option)}>{option.razonSocial}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="font-semibold">Sede</p>
            <select
              value={datos.sede ? JSON.stringify(datos.sede) : ''}
              onChange={handleChange}
              name='sede'
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Seleccionar Sede</option>
              {Sedes.map((option) => (
                <option key={option.cod_sede} value={JSON.stringify(option)}>{option.nombre_sede}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="font-semibold">Fecha Inicio</p>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={datos.fechaInicio}
              onChange={(e) => setDatos({
                ...datos,
                fechaInicio: e.target.value,
              })}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
          <div>
            <p className="font-semibold">Fecha Fin</p>
            <input
              type="date"
              id="fechaFin"
              name="fechaFinal"
              value={datos.fechaFinal}
              onChange={(e) => setDatos({
                ...datos,
                fechaFinal: e.target.value,
              })}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
          <div>
            <p className="font-semibold">Matrices</p>
            <select
              name='sede'
              onChange={SubmitAPI}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Selecionar...</option>
              <option value="Matriz-1">Matriz Administrativa</option>
              <option value="">Matriz 2</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto p-3">
          
            <table className="w-full border border-gray-300">
              <thead>
                {head.map((header) => (
                  <th key={header} className="border border-gray-300 px-4 py-2">{header}</th>
                ))}  
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {head.map((header) => (
                      <td key={header} className="border border-gray-300 px-4 py-2">{item[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>
        </div>
        <div className="flex justify-end p-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md azul-btn">Guardar</button>
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default MatrizPostulante;
