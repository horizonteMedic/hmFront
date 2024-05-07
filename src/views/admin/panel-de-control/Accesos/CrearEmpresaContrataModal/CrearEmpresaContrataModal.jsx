import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ComboboxEmpresa, ComboboxContrata } from '../model/Combobox';
import { AsignarEmpresaoContrata } from '../model/AsignarEoCUser';
import Swal from 'sweetalert2';
//ASignar Empresa o Contrata
const CrearEmpresaContrataModal = ({ closeModal, id, user, token, Refresgpag }) => {
    const [tipo, setTipo] = useState('');
    const [data, setData] = useState([])
    const [razonSocial, setRazonSocial] = useState('');
    const [ruc, setRuc] = useState('');
    const [estado, setEstado] = useState(false);

    const ListEmpresa = ComboboxEmpresa()
    const ListContrata = ComboboxContrata()

    function AleertSucces() {
        Swal.fire({
          title: "¡Exito!",
          text: "Se ha creado a un Nuevo Usuario",
          icon: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.isConfirmed) {
            closeModal();
            Refresgpag();
          }
        });
      }

    const handleTipoChange = (event) => {
        setData([])
        setTipo(event.target.value);
        setRuc('')
        if (event.target.value === 'EMPRESA') {
            setData(ListEmpresa)
        } else if (event.target.value === 'CONTRATA') {
            setData(ListContrata)
        } else {
            setData([])
        }
    };

    const handleRazonSocialChange = (e) => {

        const selectedEmpresa = ListEmpresa.find(empresa => empresa.razonSocial === e.target.value);
        const selectedContrata = ListContrata.find(contrata => contrata.razonSocial === e.target.value);

            if (selectedEmpresa) {
                setRazonSocial(e.target.value);
                setRuc(selectedEmpresa.ruc);
                return
            } else {
                setRazonSocial('');
                setRuc('');
            }
        
            if (selectedContrata) {
                setRazonSocial(e.target.value);
                setRuc(selectedContrata.ruc);
                return
            } else {
                setRazonSocial('');
                setRuc('');
            }
    };

    const handleRucChange = (event) => {
        setRuc(event.target.value);
    };

    const handleEstadoChange = () => {
        setEstado(!estado);
    };

    const registrarEmpresaContrata = () => {
        AsignarEmpresaoContrata(ruc, id, tipo, estado, user,token)
        .then(data => {
          AleertSucces()
        })
        .catch(error => {
          console.error('Error', error);
        });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[500px] h-auto relative">

            <FontAwesomeIcon
                icon={faTimes}
                className="absolute top-0 right-0 m-3 cursor-pointer  color-blanco"
                onClick={closeModal}
            />
            <div className="p azuloscurobackground flex justify-between p-3.5">
                <h1 className="text-start font-bold color-azul text-white">Asignación de Empresas / Contratas</h1>
            </div>
            <div className='container p-4'>
                <div className="mb-4">
                    <label className="mr-2">
                        Seleccionar entre:
                    </label>
                    <select
                        value={tipo}
                        onChange={handleTipoChange}
                        className=" pointer border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
                    >
                        <option value="seleccione">Seleccione...</option>
                        <option value="EMPRESA">Empresa</option>
                        <option value="CONTRATA">Contrata</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label>Razón Social:</label>
                    <select
                        type="text"
                        value={razonSocial}
                        onChange={handleRazonSocialChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
                        >
                        <option value="">Seleccione...</option>
                        {data?.map((option, index) => (
                            <option key={index} value={option.razonSocial}>{option.razonSocial}</option>
                            ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label>RUC:</label>
                    <input
                        type="text"
                        disabled
                        value={ruc}
                        onChange={handleRucChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <label>
                        Estado:
                        <input
                            type="checkbox"
                            checked={estado}
                            onChange={handleEstadoChange}
                            className="ml-2 pointer"
                        />
                    </label>
                </div>
                <div className="flex justify-center"> 
                        <button
                            onClick={registrarEmpresaContrata}
                            className="mb-3 naranjabackgroud text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Registrar
                        </button>
                    </div>
               
            </div>
        </div>
        </div>
    );
};

export default CrearEmpresaContrataModal;
