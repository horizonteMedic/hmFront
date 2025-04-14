import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSortAmountUp, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import { getFetch } from './../getFetch/getFetch';

const ReservaPacientes = ({ selectedSede, token, userlogued }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSede, setFilterSede] = useState('');
  const [sortDirection, setSortDirection] = useState('ascending');

  useEffect(() => {
    getFetch(`/api/v01/ct/ocupacional/listadoReserva/${userlogued}`, token)
      .then((res) => {
        setReservations(res);
      })
      .catch(() => {
        console.log('No se pudo encontrar');
      });
  }, [token]);

  const handleButtonClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };
  // Filtrar y ordenar las reservas


  return (
    <div className="overflow-x-auto" style={{ maxHeight: '500px' }}>


      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Usuario</th>
            <th className="px-4 py-2 border">Sede</th>
            <th className="px-4 py-2 border">Cantidad</th>
            <th className="px-4 py-2 border">Fecha de Reserva</th>
            <th className="px-4 py-2 border">Fecha de Registro</th>
            <th className="px-4 py-2 border">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {
            reservations.map((reservation, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{reservation.usuario}</td>
                <td className="px-4 py-2 border">{reservation.sede}</td>
                <td className="px-4 py-2 border">{reservation.cantidad}</td>
                <td className="px-4 py-2 border">{reservation.fechaReserva}</td>
                <td className="px-4 py-2 border">{reservation.fechaRegistro}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleButtonClick(reservation)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      {showModal && (
        <Modal user={selectedUser} onClose={closeModal} token={token}>
          <p>
            {selectedUser ? `Cantidad de pacientes registrados por el usuario: ${selectedUser.usuario}` : 'El usuario no existe.'}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default ReservaPacientes;
