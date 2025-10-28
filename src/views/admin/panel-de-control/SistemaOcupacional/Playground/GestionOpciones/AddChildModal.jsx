import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faCheck,
    faExclamationTriangle,
    faAsterisk,
    faInfoCircle,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

const AddChildModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    parentItem,
    allItems 
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        rutaVista: '',
        descripcion: '',
        estado: true
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Resetear formulario cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setFormData({
                nombre: '',
                rutaVista: '',
                descripcion: '',
                estado: true
            });
            setErrors({});
            setIsSubmitting(false);
            setShowSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Función para validar el formulario
    const validateForm = () => {
        const newErrors = {};

        // Validar nombre (obligatorio)
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        } else if (formData.nombre.trim().length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else if (formData.nombre.trim().length > 100) {
            newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
        }

        // Validar que el nombre no exista ya en el mismo nivel
        const existingNames = allItems
            .filter(item => item.idPadre === parentItem?.id)
            .map(item => item.nombre.toLowerCase());
        
        if (formData.nombre.trim() && existingNames.includes(formData.nombre.trim().toLowerCase())) {
            newErrors.nombre = 'Ya existe un elemento con este nombre en el mismo nivel';
        }

        // Validar ruta de vista (opcional pero con formato)
        if (formData.rutaVista.trim()) {
            const rutaPattern = /^\/[a-zA-Z0-9\-_\/]*$/;
            if (!rutaPattern.test(formData.rutaVista.trim())) {
                newErrors.rutaVista = 'La ruta debe comenzar con "/" y contener solo letras, números, guiones y barras';
            }
            if (formData.rutaVista.trim().length > 200) {
                newErrors.rutaVista = 'La ruta no puede exceder 200 caracteres';
            }
        }

        // Validar descripción (opcional pero con límite)
        if (formData.descripcion.trim() && formData.descripcion.trim().length > 500) {
            newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar cambios en los campos del formulario
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Llamar directamente a onConfirm con los datos del formulario
            // El componente padre se encargará de la integración con la API
            await onConfirm(formData);

            setShowSuccess(true);
            
            // Esperar un momento para mostrar el éxito antes de cerrar
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Error al crear elemento:', error);
            setErrors({ submit: 'Error al crear el elemento. Inténtalo de nuevo.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header del modal */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-bold text-white truncate">Agregar Nuevo Elemento</h2>
                        <p className="text-green-100 text-xs sm:text-sm mt-1 truncate">
                            {parentItem ? (
                                <>Padre: <span className="font-semibold">{parentItem.nombre}</span></>
                            ) : (
                                'Elemento raíz'
                            )}
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className={`text-white transition-colors duration-200 ml-4 flex-shrink-0 ${
                            isSubmitting 
                                ? 'cursor-not-allowed opacity-50' 
                                : 'hover:text-green-200'
                        }`}
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>

                {/* Contenido del modal */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {showSuccess ? (
                        <div className="flex flex-col items-center justify-center h-64 text-green-600">
                            <FontAwesomeIcon icon={faCheck} className="h-12 w-12 sm:h-16 sm:w-16 mb-4" />
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">¡Elemento creado exitosamente!</h3>
                            <p className="text-gray-600 text-center text-sm sm:text-base">El nuevo elemento se ha agregado correctamente.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {/* Campo Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre <FontAwesomeIcon icon={faAsterisk} className="h-2 w-2 text-red-500 ml-1" />
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                        errors.nombre 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    placeholder="Ingrese el nombre del elemento"
                                    disabled={isSubmitting}
                                />
                                {errors.nombre && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-1" />
                                        {errors.nombre}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Mínimo 3 caracteres, máximo 100 caracteres
                                </p>
                            </div>

                            {/* Campo Ruta de Vista */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ruta de Vista
                                    <FontAwesomeIcon icon={faInfoCircle} className="h-3 w-3 text-blue-500 ml-1" title="Campo opcional" />
                                </label>
                                <input
                                    type="text"
                                    value={formData.rutaVista}
                                    onChange={(e) => handleInputChange('rutaVista', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 font-mono text-sm ${
                                        errors.rutaVista 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    placeholder="/ruta/de/la/vista"
                                    disabled={isSubmitting}
                                />
                                {errors.rutaVista && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-1" />
                                        {errors.rutaVista}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Debe comenzar con "/" (ej: /admin/usuarios). Máximo 200 caracteres
                                </p>
                            </div>

                            {/* Campo Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                    <FontAwesomeIcon icon={faInfoCircle} className="h-3 w-3 text-blue-500 ml-1" title="Campo opcional" />
                                </label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 resize-none ${
                                        errors.descripcion 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    placeholder="Descripción opcional del elemento"
                                    disabled={isSubmitting}
                                />
                                {errors.descripcion && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-1" />
                                        {errors.descripcion}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Máximo 500 caracteres ({formData.descripcion.length}/500)
                                </p>
                            </div>

                            {/* Campo Estado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Estado</label>
                                <div className="flex space-x-6">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="estado"
                                            value="true"
                                            checked={formData.estado === true}
                                            onChange={(e) => handleInputChange('estado', e.target.value === 'true')}
                                            className="mr-3 text-green-600 focus:ring-green-500"
                                            disabled={isSubmitting}
                                        />
                                        <span className="text-green-800 font-medium">Habilitado</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="estado"
                                            value="false"
                                            checked={formData.estado === false}
                                            onChange={(e) => handleInputChange('estado', e.target.value === 'true')}
                                            className="mr-3 text-red-600 focus:ring-red-500"
                                            disabled={isSubmitting}
                                        />
                                        <span className="text-red-800 font-medium">Deshabilitado</span>
                                    </label>
                                </div>
                            </div>

                            {/* Error de envío */}
                            {errors.submit && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-2" />
                                        {errors.submit}
                                    </p>
                                </div>
                            )}
                        </form>
                    )}
                </div>

                {/* Footer del modal */}
                {!showSuccess && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg gap-4 sm:gap-0">
                        <div className="text-sm text-gray-600 order-2 sm:order-1">
                            <FontAwesomeIcon icon={faAsterisk} className="h-2 w-2 text-red-500 mr-1" />
                            Campos obligatorios
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 order-1 sm:order-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className={`px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg transition-colors duration-200 text-center ${
                                    isSubmitting 
                                        ? 'cursor-not-allowed opacity-50' 
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                                    isSubmitting
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faCheck} className="h-4 w-4 mr-2" />
                                        Crear Elemento
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddChildModal;