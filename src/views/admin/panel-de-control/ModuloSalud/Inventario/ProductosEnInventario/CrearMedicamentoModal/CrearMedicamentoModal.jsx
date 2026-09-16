import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { crearMedicamento } from '../model/ProductosEnInventario';
import { FloatingInput, FloatingAutocomplete, PRESENTACIONES_OPTIONS } from '../components/FloatingField';

const CrearMedicamentoModal = ({ setShowModal, Refresgpag, token }) => {
  const [creating, setCreating] = useState(false);

  const [nombre, setNombre] = useState('');
  const [presentacion, setPresentacion] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  const [marca, setMarca] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');

  const handleCloseModal = () => {
    setShowModal(false);
  };

  function AlertSucces() {
    handleCloseModal();
    Refresgpag();
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha registrado un Nuevo Medicamento",
      icon: "success",
      confirmButtonColor: "#084788",
      confirmButtonText: "Aceptar"
    });
  }

  const handleSaveMedicamento = () => {
    if (!nombre || !presentacion || stockMinimo === '') {
      let errorMessage = 'Por favor, complete los siguientes campos obligatorios:';
      if (!nombre) errorMessage += '\n- Nombre';
      if (!presentacion) errorMessage += '\n- Presentación';
      if (stockMinimo === '') errorMessage += '\n- Stock Mínimo';

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#084788',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    setCreating(true);
    crearMedicamento(nombre, presentacion, laboratorio, marca, unidadMedida, parseInt(stockMinimo), token)
      .then(() => {
        AlertSucces();
      })
      .catch((error) => {
        console.error('Error', error);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al crear el medicamento',
          icon: 'error',
          confirmButtonColor: '#084788',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        });
      })
      .finally(() => {
        setCreating(false);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white"
          onClick={handleCloseModal}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Agregar Nuevo Medicamento</h1>
        </div>
        <div className="container p-4">
          <form className="space-y-4">
            <FloatingInput id="c-nombre" label="Nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <FloatingAutocomplete id="c-presentacion" label="Presentación" required value={presentacion} onChange={(e) => setPresentacion(e.target.value)} groupedOptions={PRESENTACIONES_OPTIONS} />
            <FloatingInput id="c-laboratorio" label="Laboratorio" value={laboratorio} onChange={(e) => setLaboratorio(e.target.value)} />
            <FloatingInput id="c-marca" label="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
            <FloatingInput id="c-unidadMedida" label="Unidad de Medida" value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)} />
            <FloatingInput id="c-stockMinimo" label="Stock Mínimo" required type="number" min="0" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} />
          </form>
          <div className="flex justify-end mt-4">
            <button
              disabled={creating}
              onClick={handleSaveMedicamento}
              className="azul-btn text-white font-bold py-2 px-4 rounded">
              {creating ? 'Creando Medicamento...' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearMedicamentoModal;
