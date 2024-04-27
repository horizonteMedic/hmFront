import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Loading } from '../../../../components/Loading';
import { ListUser } from '../model/ListUserID';

const Modal = ({children, closeModal}) => {
    return(
<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px] md:w-[880px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500"
          onClick={closeModal}
        />
        
        {children}
      </div>
</div>
)
}

const UsersModal = ({ closeModal, idEmpleado, token }) => {

    const {data, loading} = ListUser(idEmpleado,token)

    if (loading) {
        return <Loading/>
    }

  return (
    <>
        <Modal closeModal={closeModal}>
        <h1 className="text-2xl font-bold mb-4">Lista de Usuarios vinculados</h1>
        <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Nro.</th>
                <th className="border border-gray-300 px-2 py-1">Username</th>
                <th className="border border-gray-300 px-2 py-1">Estado</th>
                <th className="border border-gray-300 px-2 py-1">Ruc</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(data) ? (
                data.map((item, index) => (
                <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.username}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.estado}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.ruc}</td>
                </tr>
                ))
            ) : data ? (
                // Si data es un objeto, mostrar los detalles del único usuario
                <tr>
                <td className="border border-gray-300 px-2 py-1">{data.idUser}</td>
                <td className="border border-gray-300 px-2 py-1">{data.username}</td>
                <td className={`border border-gray-300 px-2 py-1 ${data.estado ? 'bg-green-300' : 'bg-red-300'}`}>{data.estado  ? 'Activo' : 'Desactivado'}</td>
                <td className="border border-gray-300 px-2 py-1">{data.ruc}</td>
                </tr>
            ) : (
                // Si data es null, undefined u otro valor falsy, mostrar un mensaje de error o vacío
                <tr>
                <td colSpan="4" className="border border-gray-300 px-2 py-1">No hay datos disponibles</td>
                </tr>
            )}
            </tbody>
          </table>
        </Modal>
    </>
  );
};

export default UsersModal;
