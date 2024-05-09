import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUsers, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from './ModalRegistroEmpleado/Modal';
import EditModal from './ModalEditEmpleado/EditModal';
import ConfigurarAccesosModal from './ModalConfigUsuario/Modalconfig'; 
import RegistroUsuarioModal from './ModalRegistroUsuario/ModalRegistroUsuario'; 
import UsersModal from './ModalViewUser/ModalViewUser';
import { getFetch } from '../getFetch/getFetch';
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';
import Swal from 'sweetalert2'
import DeleteEmpleado from '../Accesos/model/DeleteEmpleado'; 

const Accesos = () => {
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refres, setRefresh] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfigurarAccesosModalOpen, setIsConfigurarAccesosModalOpen] = useState(false);
  const [isRegistroUsuarioModalOpen, setIsRegistroUsuarioModalOpen] = useState(false); 
  const [isViewUsersModalOpen, SetIsViewUsersModalOpen] = useState(false)
  const [idEmpleado, SetIdEmpleado] = useState('')

  const [tipoDocumento, setTipoDocumento] = React.useState('');
  const [nrodoc, setNrodoc] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [startDate, setStartDate] = React.useState(null);
  const [cip, setCip] = useState('')
  const [sexo, setSexo] = React.useState('');
  const [celular, setCelular] = useState('')
  const [departamento, setDepartamento] = React.useState('');
  const [provincia, setProvincia] = React.useState('');
  const [distrito, setDistrito] = React.useState('');
  const [direccion, setDireccion] = useState('')
  const [cargo, setCargo] = useState('')
  const [activo, setActivo] = React.useState(false);
  const [fechainicio, setFechainicio] = useState('');
  const [userRegistro, setUserRegistro] = useState('');
    console.log(data)
  useEffect(() => {
    setLoading(true)
    getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/st/empleado', token)
    .then(response => {
      setData(response)
    })
    .catch(error => {
      throw new Error('Network response was not ok.',error);
    })
    .finally(() => {
      setLoading(false)
    })
  },[refres])

  const Refresgpag = () => {
    setRefresh(refres + +1)
  }


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (id,tipoDocumento, nroDocumento, nombres, apellidos, cargo, ubigeo, cip, correoElectronico, celular, direccion, estado, 
    fechaNacimiento, fechaRegistro, sexo, usuarioRegistro) => {
    SetIdEmpleado(id)
    setTipoDocumento(tipoDocumento)
    setNrodoc(nroDocumento);
    setNombres(nombres);
    setApellidos(apellidos);
    setEmail(correoElectronico);
    setStartDate(fechaNacimiento)
    //Fecha seteada
    setSexo(sexo);
    setCip(cip)
    setCelular(celular);
    setDistrito(ubigeo);
    setDireccion(direccion);
    setCargo(cargo);
    setActivo(estado);
    setFechainicio(fechaRegistro)
    setUserRegistro(usuarioRegistro)
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
    SetIdEmpleado(id)
    isViewUsersModalOpen ? SetIsViewUsersModalOpen(false) : SetIsViewUsersModalOpen(true)
  }
  const deleteEmpleado = (id,tipoDocumento, nroDocumento, nombres, apellidos, cargo, ubigeo, cip, correoElectronico, celular, direccion,  
    fechaNacimiento, fechaRegistro, sexo, usuarioRegistro) => {
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "No puedes revertir esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Deshabilitar!"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteEmpleado(id,tipoDocumento, nroDocumento, nombres, apellidos, cargo, ubigeo, cip, correoElectronico, celular, direccion,  
          fechaNacimiento, fechaRegistro, sexo, usuarioRegistro,userlogued.sub)
          .then(()=>{
            Swal.fire({
              title: "Deshabilitado!",
              text: "El Empleado ha sido Deshabilitado.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) Refresgpag()
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "El Empleado no se ha podido Deshabilitado!",
              icon: "error"
            });
          }
          )
      }
    });
  }

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white  rounded-lg overflow-hidden shadow-xl  w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-start font-bold color-azul text-white">Usuarios con Accesos</h1>
        </div>
        <div className="flex justify-between p-6">
          <h2 className="text-lg font-semibold">Empleados Registrados</h2>
          <div className="flex">
            <button className="naranja-btn px-4 py-2 rounded-md mr-2" onClick={openModal}>+ Registrar Empleado</button>
            <button className="azul-btn px-4 py-2 rounded-md" onClick={openRegistroUsuarioModal}>+ Registrar Usuario</button>
          </div>
        </div>

        <div className="overflow-x-auto mb-4 p-3">
          <table className="w-full border border-gray-300 px-3 py-2">
            <thead>
              <tr className="bg-gray-200">
                {/* <th className="border border-gray-300 px-2 py-1">Nro.</th> */}
                <th className="border border-gray-300 px-2 py-1">Acciones</th>
                <th className="border border-gray-300 px-2 py-1">Tipo Doc.</th>
                <th className="border border-gray-300 px-2 py-1">Número</th>
                <th className="border border-gray-300 px-2 py-1">Apellidos</th>
                <th className="border border-gray-300 px-2 py-1">Nombres</th>
                <th className="border border-gray-300 px-2 py-1">Cargo</th>
                <th className="border border-gray-300 px-2 py-1 text-center w-[5%]">Estado</th>
              </tr>
            </thead>
            <tbody>
            {data?.map((item, index) => (
                <tr key={index}>
                {/* <td className="border border-gray-300 px-2 py-1">{item.id_empleado}</td> */}
                <td className="border border-gray-300 px-2 py-1  text-center">
                  <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-4 cursor-pointer" onClick={() => {openEditModal(item.id_empleado,
                  item.tipoDoc,item.numDocumento, item.nombres, item.apellidos, item.cargo, item.ubigeo, item.cip, item.correoElect, item.celular, 
                  item.direccion, item.estado, item.fechaNacimiento, item.fechaRegistro, item.sexo, item.userRegistro)}} 
                  title="Editar" />
                  <FontAwesomeIcon icon={faUsers} className="text-orange-500 mr-4  cursor-pointer" onClick={() => OpenViewUsersModal(item.id_empleado)} 
                  title="Ver Usuarios" />
                  <FontAwesomeIcon icon={faTrash} onClick={() => {deleteEmpleado(item.id_empleado,item.tipoDoc,item.numDocumento, item.nombres, item.apellidos, item.cargo, item.ubigeo, item.cip, item.correoElect, item.celular, 
                  item.direccion, item.fechaNacimiento, item.fechaRegistro, item.sexo, item.userRegistro)}} className="text-red-500 cursor-pointer" 
                  title="Eliminar" />

                </td>
                <td className="border border-gray-300 px-2 py-1">{item.tipoDoc}</td>
                <td className="border border-gray-300 px-2 py-1">{item.numDocumento}</td>
                <td className="border border-gray-300 px-2 py-1">{item.apellidos}</td>
                <td className="border border-gray-300 px-2 py-1">{item.nombres}</td>
                <td className="border border-gray-300 px-2 py-1">{item.cargo}</td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  <div style={{ borderRadius: '1rem' }} className={`py-1 px-2 ${item.estado ? 'bg-green-500' : 'bg-red-500'} text-white fw-bold`}>
                    {item.estado ? 'Activo' : 'Inactivo'}
                  </div>
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
          {/* <div className="flex items-center ml-6 md:ml-8">
            <FontAwesomeIcon icon={faCog} className="text-green-500" />
            <p className="text-sm ml-2 md:ml-4">Configurar Accesos</p>
          </div> */}
          <div className="flex items-center ml-6 md:ml-8">
            <FontAwesomeIcon icon={faUsers} className="text-orange-500" />
            <p className="text-sm ml-2 md:ml-4">Ver Usuarios</p>
          </div>
          <div className="flex items-center ml-6 md:ml-8">
            <FontAwesomeIcon icon={faTrash} className="text-red-500" />
            <p className="text-sm ml-2 md:ml-4">Eliminar</p>
          </div>
          {/* <div className="flex items-center ml-2 md:ml-4">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
            <p className="text-sm ml-2 md:ml-4">Activo</p>
          </div>
          <div className="flex items-center ml-6 md:ml-8">
            <FontAwesomeIcon icon={faBan} className="text-red-500" />
            <p className="text-sm ml-2 md:ml-4">Inactivo</p>
          </div> */}
        </div>

      </div>
      {/* Asegúrate de que los modales estén configurados correctamente */}
      {isModalOpen && <Modal closeModal={closeModal} Refresgpag={Refresgpag} />}
      {isEditModalOpen && <EditModal closeModal={closeEditModal} Refresgpag={Refresgpag} ID={idEmpleado} TipoDoc={tipoDocumento} Nrodoc={nrodoc} Nombres={nombres}
      Apellidos={apellidos} Email={email} Sexo={sexo} FechaNacimiento={startDate} Cip={cip} Celular={celular} Distrito={distrito} Direccion={direccion}
      Cargo={cargo} Estado={activo} FechaInicio={startDate} UserRegistro={userRegistro} />}
      {isConfigurarAccesosModalOpen && <ConfigurarAccesosModal closeModal={closeConfigurarAccesosModal} />}
      {isRegistroUsuarioModalOpen && <RegistroUsuarioModal closeModal={closeRegistroUsuarioModal} token={token} Refresgpag={Refresgpag}/>}
      {isViewUsersModalOpen && <UsersModal closeModal={OpenViewUsersModal} idEmpleado={idEmpleado} userlogued={userlogued.sub} token={token}/>}
    </div>
  );
};

export default Accesos;
