import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { registrarIngresoMedicamento } from '../model/ProductosEnInventario';
import { FloatingInput } from '../components/FloatingField';

const getFechaVencimientoPorDefecto = () => {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() + 1);
  return fecha.toISOString().split('T')[0];
};

const IngresoStockModal = ({ closeModal, Refresgpag, token, medicamento, usuarioRegistro }) => {
  const [registrando, setRegistrando] = useState(false);

  const [cantidad, setCantidad] = useState('');
  const [lote, setLote] = useState('0000');
  const [fechaVencimiento, setFechaVencimiento] = useState(getFechaVencimientoPorDefecto());
  const [motivo, setMotivo] = useState('Restock');

  function AlertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha registrado el ingreso de stock",
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

  const handleRegistrarIngreso = () => {
    if (!cantidad || !lote || !fechaVencimiento || !motivo) {
      let errorMessage = 'Por favor, complete los siguientes campos obligatorios:';
      if (!cantidad) errorMessage += '\n- Cantidad';
      if (!lote) errorMessage += '\n- Lote';
      if (!fechaVencimiento) errorMessage += '\n- Fecha de Vencimiento';
      if (!motivo) errorMessage += '\n- Motivo';

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    setRegistrando(true);
    registrarIngresoMedicamento(medicamento.id, parseInt(cantidad), lote, fechaVencimiento, usuarioRegistro, motivo, token)
      .then(() => {
        AlertSucces();
      })
      .catch((error) => {
        console.error('Error', error);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al registrar el ingreso',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        });
      })
      .finally(() => {
        setRegistrando(false);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white"
          onClick={closeModal}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Ingreso de Stock</h1>
        </div>
        <div className="container p-4">
          <p className="mb-3 text-sm text-gray-600">Medicamento: <span className="font-semibold">{medicamento.nombre}</span></p>
          <form className="space-y-4">
            <FloatingInput id="cantidad" label="Cantidad" required type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
            <FloatingInput id="lote" label="Lote" required value={lote} onChange={(e) => setLote(e.target.value)} />
            <FloatingInput id="fechaVencimiento" label="Fecha de Vencimiento" required type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
            <FloatingInput id="motivo" label="Motivo" required value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </form>
          <div className="flex justify-end mt-4">
            <button
              disabled={registrando}
              onClick={handleRegistrarIngreso}
              className="azul-btn text-white font-bold py-2 px-4 rounded">
              {registrando ? 'Registrando...' : 'Registrar Ingreso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngresoStockModal;
