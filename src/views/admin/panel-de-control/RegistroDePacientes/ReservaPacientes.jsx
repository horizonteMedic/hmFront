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

  const handleFilterChange = (event) => {
    setFilterSede(event.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Filtrar y ordenar las reservas
  let filteredReservations = reservations.filter((reservation) =>
    reservation.usuario.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterSede === '' || reservation.sede.toLowerCase() === filterSede.toLowerCase())
  );

  // Ordenar según la dirección de ordenamiento
  filteredReservations.sort((a, b) => {
    if (sortDirection === 'ascending') {
      return a.cantidad - b.cantidad;
    } else {
      return b.cantidad - a.cantidad;
    }
  });

  return (
    <div className="overflow-x-auto" style={{ maxHeight: '500px' }}>
      <div className="flex space-x-2 mb-3">
        <input
          type="text"
          placeholder="Buscar por usuario..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <button onClick={toggleSortDirection} className="border border-gray-300 rounded-md px-3 py-2 flex items-center">
          <span style={{ marginRight: '0.5rem' }}>Ordenar por cantidad</span>
          {sortDirection === 'ascending' ? <FontAwesomeIcon icon={faSortAmountUp} /> : <FontAwesomeIcon icon={faSortAmountDown} />}
        </button>
      </div>

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
          {filteredReservations.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-2 border text-center">No se encontraron reservas registradas con este usuario / usuario no existe.</td>
            </tr>
          ) : (
            filteredReservations.map((reservation, index) => (
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
          )}
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
