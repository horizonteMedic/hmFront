import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload, faEye } from '@fortawesome/free-solid-svg-icons';
import { getFirma, registrarFirma } from '../model/FirmaModel';
import Swal from 'sweetalert2';

const ModalFirma = ({ closeModal, dni, token, nombreEmpleado }) => {
    const [firmaUrl, setFirmaUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchFirma();
    }, [dni]);

    const fetchFirma = async () => {
        try {
            setLoading(true);
            const data = await getFirma(dni, token);
            if (data && data.base64) {
                // Asumiendo que el base64 viene sin el prefijo data:image/jpeg;base64,
                const fullBase64 = data.base64.startsWith('data:') 
                    ? data.base64 
                    : `data:image/jpeg;base64,${data.base64}`;
                setFirmaUrl(fullBase64);
            } else {
                setFirmaUrl(null);
            }
        } catch (error) {
            console.error('Error al obtener firma:', error);
            setFirmaUrl(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            Swal.fire('Error', 'Por favor seleccione un archivo', 'error');
            return;
        }

        try {
            Swal.fire({
                title: 'Subiendo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = async () => {
                const base64String = reader.result.split(',')[1];
                const fileName = selectedFile.name;
                
                await registrarFirma(dni, base64String, fileName, token);
                
                Swal.fire('Éxito', 'Firma registrada correctamente', 'success');
                setFirmaUrl(reader.result);
                setSelectedFile(null);
                setPreviewUrl(null);
                fetchFirma(); // Recargar para confirmar
            };
        } catch (error) {
            console.error('Error al subir firma:', error);
            Swal.fire('Error', 'No se pudo subir la firma', 'error');
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[90%] max-w-[500px] relative">
                <FontAwesomeIcon
                    icon={faTimes}
                    className="absolute top-0 right-0 m-3 cursor-pointer text-white z-10"
                    onClick={closeModal}
                />
                <div className="azuloscurobackground flex justify-between p-3.5">
                    <h1 className="text-start font-bold text-white">Gestionar Firma - {nombreEmpleado}</h1>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2 flex items-center">
                            <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-500" />
                            Firma Actual
                        </h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center items-center bg-gray-50 min-h-[150px]">
                            {loading ? (
                                <p>Cargando...</p>
                            ) : firmaUrl ? (
                                <img src={firmaUrl} alt="Firma" className="max-h-[120px] object-contain" />
                            ) : (
                                <p className="text-gray-500 italic">No hay firma registrada</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2 flex items-center">
                            <FontAwesomeIcon icon={faUpload} className="mr-2 text-orange-500" />
                            Subir Nueva Firma
                        </h2>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                        />
                        {previewUrl && (
                            <div className="mt-2 border border-gray-200 rounded p-2 flex flex-col items-center">
                                <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                                <img src={previewUrl} alt="Preview" className="max-h-[100px] object-contain" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile}
                            className={`px-4 py-2 rounded-md text-white ${!selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            Guardar Firma
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalFirma;
