import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ComboboxEmpresa, ComboboxContrata } from '../model/Combobox';
import { AsignarEmpresaoContrata } from '../model/AsignarEoCUser';
import Swal from 'sweetalert2';

const CrearEmpresaContrataModal = ({ closeModal, id, user, token, Refresgpag }) => {
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState([]);
  const [razonSocial, setRazonSocial] = useState('');
  const [ruc, setRuc] = useState('');
  const [estado, setEstado] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const ListEmpresa = ComboboxEmpresa();
  const ListContrata = ComboboxContrata();

  const handleTipoChange = (event) => {
    setData([]);
    setTipo(event.target.value);
    setRuc('');
    if (event.target.value === 'EMPRESA') {
      setData(ListEmpresa);
    } else if (event.target.value === 'CONTRATA') {
      setData(ListContrata);
    } else {
      setData([]);
    }
  };

  const handleRazonSocialChange = (e) => {
    setRazonSocial(e.target.value);
    const selectedEmpresa = ListEmpresa.find(empresa => empresa.razonSocial === e.target.value);
    const selectedContrata = ListContrata.find(contrata => contrata.razonSocial === e.target.value);
    if (selectedEmpresa) {
      setRuc(selectedEmpresa.ruc);
    } else if (selectedContrata) {
      setRuc(selectedContrata.ruc);
    } else {
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
    if (!tipo || tipo === 'seleccione') {
      Swal.fire({
        title: "Error",
        text: "Por favor, seleccione una Empresa o Contrata.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
      return;
    }
  
    if (!razonSocial) {
      Swal.fire({
        title: "Error",
        text: "Por favor, seleccione una razón social.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
      return;
    }
  
    if (!ruc) {
      Swal.fire({
        title: "Error",
        text: "No se ha encontrado un RUC asociado. Por favor, seleccione una razón social válida.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
      return;
    }
  
    // Si todo está correcto, procede a registrar
    AsignarEmpresaoContrata(ruc, id, tipo, estado, user, token)
      .then(data => {
        AleertSucces();
      })
      .catch(error => {
        console.error('Error', error);
      });
  };
  
  function AleertSucces() {
    Swal.fire({
      title: "¡Éxito!",
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredResults = data.filter((option) =>
      option.razonSocial.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[500px] h-auto relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
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
              className="pointer border border-gray-300 rounded-xl py-2 px-3 "
            >
              <option value="seleccione">Empresa o Contrata</option>
              <option value="EMPRESA">Empresa</option>
              <option value="CONTRATA">Contrata</option>
            </select>
          </div>
          <div className="mb-4">
            <label>Razón Social:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Seleccione"
              className="w-full border pointer border-gray-300 rounded-md py-2 px-3"
              disabled={!tipo || tipo === 'seleccione'}
            />
            {searchTerm && (
              <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                {filteredData.map((option, index) => (
                  <div
                    key={index}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => {
                      setRazonSocial(option.razonSocial);
                      setRuc(option.ruc);
                      setSearchTerm('');
                      setFilteredData([]);
                    }}
                  >
                    {option.razonSocial}
                  </div>
                ))}
              </div>
            )}
            {razonSocial && (
              <div className="text-sm mt-1">Seleccionado: <strong>{razonSocial}</strong></div>
            )}
          </div>
          <div className="mb-4">
            <label>RUC:</label>
            <input
              type="text"
              disabled
              value={ruc}
              onChange={handleRucChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 "
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="mr-2">
              Estado:
            </label>
            <input
              type="checkbox"
              checked={estado}
              onChange={handleEstadoChange}
              className="pointer"
            />
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
