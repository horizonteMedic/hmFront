import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPen } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { getMedicamentoDetalle, editarMedicamento } from '../model/ProductosEnInventario';
import { FloatingInput, FloatingAutocomplete, PRESENTACIONES_OPTIONS } from '../components/FloatingField';

const Campo = ({ label, value }) => (
  <div className="mb-3">
    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
    <span className="block text-gray-800">{value ?? '-'}</span>
  </div>
);

const DetalleMedicamentoModal = ({ closeModal, id, token, Refresgpag }) => {
  const [medicamento, setMedicamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nombre, setNombre] = useState('');
  const [presentacion, setPresentacion] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  const [marca, setMarca] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');

  useEffect(() => {
    setLoading(true);
    getMedicamentoDetalle(id, token)
      .then((response) => {
        setMedicamento(response);
        setNombre(response?.nombre || '');
        setPresentacion(response?.presentacion || '');
        setLaboratorio(response?.laboratorio || '');
        setMarca(response?.marca || '');
        setUnidadMedida(response?.unidadMedida || '');
        setStockMinimo(response?.stockMinimo ?? '');
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleCancelarEdicion = () => {
    setNombre(medicamento?.nombre || '');
    setPresentacion(medicamento?.presentacion || '');
    setLaboratorio(medicamento?.laboratorio || '');
    setMarca(medicamento?.marca || '');
    setUnidadMedida(medicamento?.unidadMedida || '');
    setStockMinimo(medicamento?.stockMinimo ?? '');
    setEditMode(false);
  };

  const handleGuardar = () => {
    if (!nombre || !presentacion || stockMinimo === '') {
      Swal.fire({
        title: 'Error',
        text: 'Nombre, presentación y stock mínimo son obligatorios.',
        icon: 'error',
        confirmButtonColor: '#084788',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    setSaving(true);
    editarMedicamento(id, nombre, presentacion, laboratorio, marca, unidadMedida, parseInt(stockMinimo), token)
      .then(() => {
        Swal.fire({
          title: '¡Exito!',
          text: 'Se ha editado el Medicamento',
          icon: 'success',
          confirmButtonColor: '#084788',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          Refresgpag?.();
          closeModal();
        });
      })
      .catch((error) => {
        console.error('Error', error);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al editar el medicamento',
          icon: 'error',
          confirmButtonColor: '#084788',
          confirmButtonText: 'Aceptar'
        });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] md:w-[500px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white"
          onClick={closeModal}
        />
        <div className="p-3 azuloscurobackground flex justify-between items-center">
          <h1 className="text-start font-bold color-azul text-white">{editMode ? 'Editar Medicamento' : 'Detalle del Medicamento'}</h1>
        </div>
        <div className="container p-4">
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : medicamento ? (
            <>
              {!editMode ? (
                <>
                  <Campo label="Nombre" value={medicamento.nombre} />
                  <Campo label="Presentación" value={medicamento.presentacion} />
                  <Campo label="Laboratorio" value={medicamento.laboratorio} />
                  <Campo label="Marca" value={medicamento.marca} />
                  <Campo label="Unidad de Medida" value={medicamento.unidadMedida} />
                  <Campo label="Stock Mínimo" value={medicamento.stockMinimo} />
                  {medicamento.stockActual !== undefined && <Campo label="Stock Actual" value={medicamento.stockActual} />}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 text-sm font-semibold text-[#084788] hover:text-[#233245]"
                    >
                      <FontAwesomeIcon icon={faPen} />
                      Habilitar edición
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <form className="space-y-4">
                    <FloatingInput id="d-nombre" label="Nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <FloatingAutocomplete id="d-presentacion" label="Presentación" required value={presentacion} onChange={(e) => setPresentacion(e.target.value)} groupedOptions={PRESENTACIONES_OPTIONS} />
                    <FloatingInput id="d-laboratorio" label="Laboratorio" value={laboratorio} onChange={(e) => setLaboratorio(e.target.value)} />
                    <FloatingInput id="d-marca" label="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
                    <FloatingInput id="d-unidadMedida" label="Unidad de Medida" value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)} />
                    <FloatingInput id="d-stockMinimo" label="Stock Mínimo" required type="number" min="0" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} />
                  </form>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      disabled={saving}
                      onClick={handleCancelarEdicion}
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={saving}
                      onClick={handleGuardar}
                      className="azul-btn px-4 py-2 rounded-md font-semibold"
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-center text-red-500">No se pudo cargar el detalle del medicamento.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleMedicamentoModal;
