import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope, faTint, faHeartbeat, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { getFetch } from '../../getFetch/getFetch';
import Parenquimatosas from './Parenquimatosas/Parenquimatosas';
import Pleurales from './Pleurales/Pleurales';
import Engrosamiento from './Engrosamiento/Engrosamiento';
import { useState } from 'react';
import { SubmitOIT, VerifyTR } from './controller/OIT_controller';

const tabla = 'oit'
const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const OIT = ({token, selectedSede, userlogued,userDatos}) => {
    
    const [activeTab, setActiveTab] = useState(0);
    //const tabsConPermiso = tabs.filter(tab => permiso(tab.vista, tab.permiso));
    const [form, setForm] = useState({
        //DATOS PERSONALES
        norden: "",
        nplaca: "",
        nombres: "",
        dni: "",
        dniUser: userDatos.datos.dni_user,
        edad: "",
        fradiografia: today,
        flectura: today,
        //PARENQUIMATOSAS
        rbAceptable: false,
        rbInaceptable: false,
        rbBajacalidad: false,
        rbBuena: false,
            //causas
        rbSobreexposicion: false,
        rbSubexposicion: false,
        rbPosicioncentrado: false,
        rbInspiracionInsuficiente: false,
        rbEscapulas: false,
        rbArtefactos: false,
        rbOtros: false,
        //PARENQUIMATOSAS2.0
        txtDefectosTecnicos: "",
        chk1D: false,
        chk1I: false,
        chk2D: false,
        chk2I: false,
        chk3D: false,
        chk3I: false,
        //a
        chk1: false,
        chk2: false,
        chk3: false,
        chk4: false,
        chk5: false,
        chk6: false,
        chk7: false,
        chk8: false,
        chk9: false,
        chk10: false,
        chk11: false,
        chk12: false,
        //b
        chkP1: false,
        chkP2: false,
        chkP3: false,
        chkP4: false,
        chkP5: false,
        chkP6: false,
        chkS1: false,
        chkS2: false,
        chkS3: false,
        chkS4: false,
        chkS5: false,
        chkS6: false,
        //c
        chko: false,
        chka: false,
        chkb: false,
        chkc: false,
        //Pleurales
        chkE1: false,
        chkE2: false,
        chkE3: false,
        chkE4: false,
        chkE5: false,
        chkE6: false,
            //a
        chk2_1: false,
        chk2_2: false,
        chk2_3: false,
        chk2_4: false,
        chk2_5: false,
        chk2_6: false,
        chk2_7: false,
        chk2_8: false,
        chk2_9: false,
        chk2_10: false,
        chk2_11: false,
        chk2_12: false,
        chk2_13: false,
        chk2_14: false,
        chk2_15: false,
        chk2_16: false,
        chk2_17: false,
        chk2_18: false,
        chk2_19: false,
        chk2_20: false,
        chk2_21: false,
        chk2_22: false,
        chk2_23: false,
        chk2_24: false,
        chk2_25: false,
        chk2_26: false,
        chk2_27: false,
        chk2_28: false,
        chk2_29: false,
        chk2_30: false,
        chk2_31: false,
        chk2_32: false,
        chk2_33: false,
        chk2_34: false,
        chk2_35: false,
        chk2_36: false,
        chk2_37: false,
        chk2_38: false,
        chk2_39: false,
        chk2_40: false,
        chk2_41: false,
        chk2_42: false,
        chk2_43: false,
        chk2_44: false,
        chk2_45: false,
        chk2_46: false,
        chk2_47: false,
        chk2_48: false,
        chk2_49: false,
        chk2_50: false,
        chk2_51: false,
        chk2_52: false,
        chk2_53: false,
        chk2_54: false,
        chk2_55: false,
        chk2_56: false,
        chk2_57: false,
        chk2_58: false,
        chk2_59: false,
        chk2_60: false,
        chk2_61: false,
        chk2_62: false,
        chk2_63: false,
        chk2_64: false,
        chk2_65: false,
        chk2_66: false,
        chk2_67: false,
        chk2_68: false,
        chk2_69: false,
        //
        chk_01: false,
        chk_02: false,
        chk_03: false,
        chk_04: false,
        chk_05: false,
        chk_06: false,
        chk_07: false,
        chk_08: false,
        chk_09: false,
        chk_10: false,
        chk_11: false,
        chk_12: false,
        chk_13: false,
        chk_14: false,
        chk_15: false,
        chk_16: false,
        chk_17: false,
        chk_18: false,
        chk_19: false,
        chk_20: false,
        chk_21: false,
        chk_22: false,
        chk_23: false,
        chk_24: false,
        chk_25: false,
        chk_26: false,
        chk_27: false,
        chk_28: false,
        chk_29: false,
        txtSComentarios: ""
    })

    const handleClean = () => {
        setForm({
            //DATOS PERSONALES
            norden: "",
            nplaca: "",
            nombres: "",
            dni: "",
            edad: "",
            fradiografia: today,
            flectura: today,
            //PARENQUIMATOSAS
            rbAceptable: false,
            rbInaceptable: false,
            rbBajacalidad: false,
            rbBuena: false,
                //causas
            rbSobreexposicion: false,
            rbSubexposicion: false,
            rbPosicioncentrado: false,
            rbInspiracionInsuficiente: false,
            rbEscapulas: false,
            rbArtefactos: false,
            rbOtros: false,
            //PARENQUIMATOSAS2.0
            txtDefectosTecnicos: "",
            chk1D: false,
            chk1I: false,
            chk2D: false,
            chk2I: false,
            chk3D: false,
            chk3I: false,
            //a
            chk1: false,
            chk2: false,
            chk3: false,
            chk4: false,
            chk5: false,
            chk6: false,
            chk7: false,
            chk8: false,
            chk9: false,
            chk10: false,
            chk11: false,
            chk12: false,
            //b
            chkP1: false,
            chkP2: false,
            chkP3: false,
            chkP4: false,
            chkP5: false,
            chkP6: false,
            chkS1: false,
            chkS2: false,
            chkS3: false,
            chkS4: false,
            chkS5: false,
            chkS6: false,
            //c
            chko: false,
            chka: false,
            chkb: false,
            chkc: false,
            //Pleurales
            chkE1: false,
            chkE2: false,
            chkE3: false,
            chkE4: false,
            chkE5: false,
            chkE6: false,
                //a
            chk2_1: false,
            chk2_2: false,
            chk2_3: false,
            chk2_4: false,
            chk2_5: false,
            chk2_6: false,
            chk2_7: false,
            chk2_8: false,
            chk2_9: false,
            chk2_10: false,
            chk2_11: false,
            chk2_12: false,
            chk2_13: false,
            chk2_14: false,
            chk2_15: false,
            chk2_16: false,
            chk2_17: false,
            chk2_18: false,
            chk2_19: false,
            chk2_20: false,
            chk2_21: false,
            chk2_22: false,
            chk2_23: false,
            chk2_24: false,
            chk2_25: false,
            chk2_26: false,
            chk2_27: false,
            chk2_28: false,
            chk2_29: false,
            chk2_30: false,
            chk2_31: false,
            chk2_32: false,
            chk2_33: false,
            chk2_34: false,
            chk2_35: false,
            chk2_36: false,
            chk2_37: false,
            chk2_38: false,
            chk2_39: false,
            chk2_40: false,
            chk2_41: false,
            chk2_42: false,
            chk2_43: false,
            chk2_44: false,
            chk2_45: false,
            chk2_46: false,
            chk2_47: false,
            chk2_48: false,
            chk2_49: false,
            chk2_50: false,
            chk2_51: false,
            chk2_52: false,
            chk2_53: false,
            chk2_54: false,
            chk2_55: false,
            chk2_56: false,
            chk2_57: false,
            chk2_58: false,
            chk2_59: false,
            chk2_60: false,
            chk2_61: false,
            chk2_62: false,
            chk2_63: false,
            chk2_64: false,
            chk2_65: false,
            chk2_66: false,
            chk2_67: false,
            chk2_68: false,
            chk2_69: false,
            //
            chk_01: false,
            chk_02: false,
            chk_03: false,
            chk_04: false,
            chk_05: false,
            chk_06: false,
            chk_07: false,
            chk_08: false,
            chk_09: false,
            chk_10: false,
            chk_11: false,
            chk_12: false,
            chk_13: false,
            chk_14: false,
            chk_17: false,
            chk_18: false,
            chk_19: false,
            chk_20: false,
            chk_21: false,
            chk_22: false,
            chk_23: false,
            chk_24: false,
            chk_25: false,
            chk_26: false,
            chk_27: false,
            chk_28: false,
            chk_29: false,
            txtSComentarios: ""
        })
    }
    console.log(form)
    const tabs = [
    {
        label: 'Parenquimatosas',
        icon: faMicroscope,
        component: <Parenquimatosas token={token} selectedSede={selectedSede} userlogued={userlogued} form={form} setForm={setForm} />
    },
    {
        label: 'Pleurales',
        icon: faTint,
        component: <Pleurales token={token} selectedSede={selectedSede} userlogued={userlogued} form={form} setForm={setForm}/>
    },
    {
        label: 'Engrosamiento',
        icon: faHeartbeat,
        component: <Engrosamiento token={token} selectedSede={selectedSede} userlogued={userlogued} form={form} setForm={setForm} />
    }
    ];

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    };

    const handleset = () => {
        setForm(prev => ({
        ...prev,
        nplaca: "",
        nombres: "",
        dni: "",
        edad: "",
        fradiografia: today,
        flectura: today,
        }));
    }

    return (
    <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden py-8">
        <div className="w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">OIT</h1>
            <div className='ml-20 border rounded-md p-3 shadow-sm bg-white'>
                <h2>Datos del Sistema</h2>
                <div className='m-3 flex flex-col'>
                    <div className='flex flex-row items-center my-2'>
                        <label htmlFor="">N° Orden: </label>
                        <input type="text" name="norden" value={form.norden} onChange={handleInputChange} id="norden" className='border rounded px-2 py-1 mx-4' 
                        onKeyUp={(event) => {if(event.key === 'Enter')handleset(),VerifyTR(form.norden,tabla,token,setForm,selectedSede)}}/>
                        <label htmlFor="">Lector: </label>
                        <input type="text" name="lector" id="lector" disabled className='border w-[22%] min-w-[14%] rounded px-2 py-1 mx-4' />
                        <label htmlFor="">Nro Placa: </label>
                        <input type="text" name="placa" id="placa" value={form.nplaca} disabled onChange={handleInputChange} className='border rounded px-2 py-1 mx-4' />
                    </div>
                    <div className='flex flex-row items-center my-2'>
                        <label htmlFor="">Nombre: </label>
                        <input type="text" name="nombres" value={form.nombres} onChange={handleInputChange} disabled id="nombres" className='border rounded w-[35%] px-2 py-1 mx-4' />
                        <label htmlFor="">Edad: </label>
                        <input type="text" name="edad" id="edad" value={form.edad} onChange={handleInputChange} disabled className='border rounded px-2 py-1 mx-4' />
                        <input type="checkbox" name="check" id="check" />
                        <label htmlFor="">Sin Datos: </label>
                    </div>
                    <div className='flex flex-row items-center my-2 ml-10'>
                        <label htmlFor="">Fecha de Lectura: </label>
                        <input type="date" name="flectura" value={form.flectura} onChange={handleInputChange} id="flectura" className='border rounded w-[35%] px-2 py-1 mx-4' />
                         <span className='text-sm text-gray-500 mt-1 mr-4'>Día - Mes - Año</span>
                        <label htmlFor="">Fecha de Radiografia: </label>
                        <input type="date" name="fradiografia" value={form.fradiografia} onChange={handleInputChange} id="fradiografia" className='border rounded px-2 py-1 mx-4' />
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
            <div className='flex justify-between mt-6 mx-12'>
                <div className='gap-1 flex'>
                    <button type="button" onClick={() => {SubmitOIT(form,token,userlogued,handleClean,tabla)}}  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors">
                    <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                    </button>
                    <button type="button" onClick={handleClean} className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors" >
                    <FontAwesomeIcon icon={faBroom} /> Limpiar
                    </button>
                </div>
                <div className='flex gap-1 items-center'>
                    <label htmlFor="">Imprimir: </label>
                    <input className="border rounded px-2 py-1 w-24"  name="norden"   />
                    <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors" >
                        <FontAwesomeIcon icon={faPrint} />
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default OIT