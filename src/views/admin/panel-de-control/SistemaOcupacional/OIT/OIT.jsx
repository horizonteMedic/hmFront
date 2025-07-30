import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope, faTint, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { getFetch } from '../../getFetch/getFetch';
import Parenquimatosas from './Parenquimatosas/Parenquimatosas';
import Pleurales from './Pleurales/Pleurales';
import Engrosamiento from './Engrosamiento/Engrosamiento';
import { useState } from 'react';


const OIT = ({token, selectedSede, userlogued}) => {
    const tabs = [
    {
        label: 'Parenquimatosas',
        icon: faMicroscope,
        component: <Parenquimatosas token={token} selectedSede={selectedSede} userlogued={userlogued} />
    },
    {
        label: 'Pleurales',
        icon: faTint,
        component: <Pleurales token={token} selectedSede={selectedSede} userlogued={userlogued}  />
    },
    {
        label: 'Engrosamiento',
        icon: faHeartbeat,
        component: <Engrosamiento token={token} selectedSede={selectedSede} userlogued={userlogued} />
    }
    ];
    const [activeTab, setActiveTab] = useState(0);
    //const tabsConPermiso = tabs.filter(tab => permiso(tab.vista, tab.permiso));


    return (
    <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden py-8">
        <div className="w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">OIT</h1>
            <div className='ml-20 border rounded-md p-3 shadow-sm bg-white'>
                <h2>Datos del Sistema</h2>
                <div className='m-3 flex flex-col'>
                    <div className='flex flex-row items-center my-2'>
                        <label htmlFor="">N° Orden: </label>
                        <input type="text" name="norden" id="norden" className='border rounded px-2 py-1 mx-4' />
                        <label htmlFor="">Lector: </label>
                        <input type="text" name="lector" id="lector" className='border w-[22%] min-w-[14%] rounded px-2 py-1 mx-4' />
                        <label htmlFor="">Nro Placa: </label>
                        <input type="text" name="placa" id="placa" className='border rounded px-2 py-1 mx-4' />
                    </div>
                    <div className='flex flex-row items-center my-2'>
                        <label htmlFor="">Nombre: </label>
                        <input type="text" name="nombres" id="nombres" className='border rounded w-[35%] px-2 py-1 mx-4' />
                        <label htmlFor="">Edad: </label>
                        <input type="text" name="edad" id="edad" className='border rounded px-2 py-1 mx-4' />
                        <input type="checkbox" name="check" id="check" />
                        <label htmlFor="">Sin Datos: </label>
                    </div>
                    <div className='flex flex-row items-center my-2 ml-10'>
                        <label htmlFor="">Fecha de Lectura: </label>
                        <input type="date" name="fechaLec" id="fechaLec" className='border rounded w-[35%] px-2 py-1 mx-4' />
                         <span className='text-sm text-gray-500 mt-1 mr-4'>Día - Mes - Año</span>
                        <label htmlFor="">Fecha de Radiografia: </label>
                        <input type="date" name="fechaRad" id="fechaRad" className='border rounded px-2 py-1 mx-4' />
                        <span className='text-sm text-gray-500 mt-1 mr-4'>Día - Mes - Año</span>
                    </div>
                </div>
            </div>
           
            
            
            {/* Tabs */}
            <div className="flex space-x-1 overflow-x-auto mt-4">
            {tabs.map((tab, idx) => (
                <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${
                    activeTab === idx
                    ? 'bg-[#233245] text-white font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                >
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                {tab.label}
                </button>
            ))}
            </div>

            {/* Active Content */}
            <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
            {tabs[activeTab].component}
            </div>
        </div>
    </div>
    );
}

export default OIT