import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUsers, faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';
import Modal from './ModalRegistroEmpleado/Modal';
import EditModal from './ModalEditEmpleado/EditModal';
import RegistroUsuarioModal from './ModalRegistroUsuario/ModalRegistroUsuario';
import UsersModal from './ModalViewUser/ModalViewUser';
import { getFetch } from '../getFetch/getFetch';
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';

const Accesos = () => {
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfigurarAccesosModalOpen, setIsConfigurarAccesosModalOpen] = useState(false);
  const [isRegistroUsuarioModalOpen, setIsRegistroUsuarioModalOpen] = useState(false);
  const [isViewUsersModalOpen, SetIsViewUsersModalOpen] = useState(false);
  const [idEmpleado, SetIdEmpleado] = useState('');

  const [tipoDocumento, setTipoDocumento] = useState('');
  const [nrodoc, setNrodoc] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [cip, setCip] = useState('');
  const [sexo, setSexo] = useState('');
  const [celular, setCelular] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cargo, setCargo] = useState('');
  const [activo, setActivo] = useState(false);
  const [fechainicio, setFechainicio] = useState('');
  const [userRegistro, setUserRegistro] = useState('');

  // Estado para el ordenamiento
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

  useEffect(() => {
    setLoading(true);
    getFetch(`/api/v01/st/empleado/listadoBusquedaUsername/${userlogued.sub}`, token)
      .then(response => {
        setData(response);
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refres]);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const Refresgpag = () => {
    setRefresh(refres + 1);
  };

  const sortData = (column) => {
    const sortedData = [...data];
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setSortColumn(column);

    sortedData.sort((a, b) => {
      const aValue = a[column].toLowerCase();
      const bValue = b[column].toLowerCase();

      if (newOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setData(sortedData);
  };

  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? faSortAlphaDown : faSortAlphaUp;
    }
    return faSortAlphaDown;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (id, tipoDocumento, nroDocumento, nombres, apellidos, cargo, ubigeo, cip, correoElectronico, celular, direccion, estado,
    fechaNacimiento, fechaRegistro, sexo, usuarioRegistro) => {
    SetIdEmpleado(id);
    setTipoDocumento(tipoDocumento);
    setNrodoc(nroDocumento);
    setNombres(nombres);
    setApellidos(apellidos);
    setEmail(correoElectronico);
    setStartDate(fechaNacimiento);
    setSexo(sexo);
    setCip(cip);
    setCelular(celular);
    setDistrito(ubigeo);
    setDireccion(direccion);
    setCargo(cargo);
    setActivo(estado);
    setFechainicio(fechaRegistro);
    setUserRegistro(usuarioRegistro);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openConfigurarAccesosModal = () => {
    setIsConfigurarAccesosModalOpen(true);
  };

  const closeConfigurarAccesosModal = () => {
    setIsConfigurarAccesosModalOpen(false);
  };

  const openRegistroUsuarioModal = () => {
    setIsRegistroUsuarioModalOpen(true);
  };

  const closeRegistroUsuarioModal = () => {
    setIsRegistroUsuarioModalOpen(false);
  };

  const OpenViewUsersModal = (id) => {
    SetIdEmpleado(id);
    SetIsViewUsersModalOpen(prevState => !prevState);
  };

  // Filtrar los datos según el término de búsqueda
  // Filtrar los datos según el término de búsqueda
  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.nombres.toLowerCase().includes(searchLower) ||
      item.apellidos.toLowerCase().includes(searchLower) ||
      String(item.numDocumento).toLowerCase().includes(searchLower) || // Convertir numDocumento a string
      item.cargo.toLowerCase().includes(searchLower) ||
      (item.empresas && item.empresas.toLowerCase().includes(searchLower))
    );
  });


  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Usuarios con Accesos</h1>
        </div>
        <div className="px-6 pt-4 pb-2 flex justify-between items-center">
          {/* Input para búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, DNI, cargo o razón social"
            className="p-2 border border-gray-300 rounded-md w-[300px]  mr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Botones para registrar */}
          <div className="flex space-x-2">
            <button className="naranja-btn px-4 py-2 w-[150px]  rounded-md" onClick={openModal}>+ Registrar Empleado</button>
            <button className="azul-btn px-4 py-2  w-[150px]   rounded-md" onClick={openRegistroUsuarioModal}>+ Registrar Usuario</button>
          </div>
        </div>


        <div className="overflow-x-auto mb-1 p-3" style={{ maxHeight: '460px', overflowY: 'auto' }}>
          <table className="w-full border border-gray-300 px-3 py-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Acciones</th>
                <th className="border border-gray-300 px-2 py-1">Tipo Doc.</th>
                <th className="border border-gray-300 px-2 py-1">Número</th>
                <th className="border border-gray-300 px-2 py-1 cursor-pointer" onClick={() => sortData('apellidos')}>
                  Apellidos
                  <FontAwesomeIcon icon={getSortIcon('apellidos')} className="ml-2" />
                </th>
                <th className="border border-gray-300 px-2 py-1 cursor-pointer" onClick={() => sortData('nombres')}>
                  Nombres
                  <FontAwesomeIcon icon={getSortIcon('nombres')} className="ml-2" />
                </th>
                <th className="border border-gray-300 px-2 py-1">Cargo</th>
                <th className="border border-gray-300 px-2 py-1">Razón Social</th>

              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-blue-500 mr-2 cursor-pointer"
                      onClick={() => openEditModal(item.id_empleado, item.tipoDoc, item.numDocumento, item.nombres, item.apellidos, item.cargo, item.ubigeo, item.cip, item.correoElect, item.celular, item.direccion, item.estado, item.fechaNacimiento, item.fechaRegistro, item.sexo, item.userRegistro)}
                      title="Editar"
                    />
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="text-orange-500 mr-2 cursor-pointer"
                      onClick={() => OpenViewUsersModal(item.id_empleado)}
                      title="Ver Usuarios"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{item.tipoDoc}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.numDocumento}</td>
                  <td className="border border-gray-300 px-2 py-1">{toTitleCase(item.apellidos)}</td>
                  <td className="border border-gray-300 px-2 py-1">{toTitleCase(item.nombres)}</td>
                  <td className="border border-gray-300 px-2 py-1">{toTitleCase(item.cargo)}</td>
                  <td className="border border-gray-300 px-2 py-1 whitespace-pre-line">
                    {item.empresas ? item.empresas
                      .split(" - ")
                      .map((empresa, index) => (
                        <div key={index}>- {empresa}</div>
                      ))
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leyenda de iconos */}
        <div className="flex justify-center bg-gray-100 rounded-lg p-4 md:px-6 md:py-4 md:mx-4 md:my-2">
          <div className="flex items-center ml-6 md:ml-8 ">
            <FontAwesomeIcon icon={faEdit} className="text-blue-500" />
            <p className="text-sm ml-2 md:ml-4">Editar</p>
          </div>
          <div className="flex items-center ml-6 md:ml-8">
            <FontAwesomeIcon icon={faUsers} className="text-orange-500" />
            <p className="text-sm ml-2 md:ml-4">Ver Usuarios</p>
          </div>
        </div>
      </div>

      {/* Modales */}
      {isModalOpen && <Modal closeModal={closeModal} Refresgpag={Refresgpag} />}
      {isEditModalOpen && (
        <EditModal
          closeModal={closeEditModal}
          Refresgpag={Refresgpag}
          ID={idEmpleado}
          TipoDoc={tipoDocumento}
          Nrodoc={nrodoc}
          Nombres={nombres}
          Apellidos={apellidos}
          Email={email}
          Sexo={sexo}
          FechaNacimiento={startDate}
          Cip={cip}
          Celular={celular}
          Distrito={distrito}
          Direccion={direccion}
          Cargo={cargo}
          Estado={activo}
          FechaInicio={startDate}
          UserRegistro={userRegistro}
        />
      )}
      {isConfigurarAccesosModalOpen && <ConfigurarAccesosModal closeModal={closeConfigurarAccesosModal} />}
      {isRegistroUsuarioModalOpen && <RegistroUsuarioModal closeModal={closeRegistroUsuarioModal} token={token} Refresgpag={Refresgpag} />}
      {isViewUsersModalOpen && <UsersModal closeModal={OpenViewUsersModal} idEmpleado={idEmpleado} userlogued={userlogued.sub} token={token} />}
    </div>
  );
};

export default Accesos;
