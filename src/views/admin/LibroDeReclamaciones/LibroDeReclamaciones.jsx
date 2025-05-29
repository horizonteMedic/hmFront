import React, { useState, useEffect } from 'react';
// import './LibroDeReclamaciones.css';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://devclientes.horizontemedic.com/api'
  : 'http://localhost:3001/api';

const LibroDeReclamaciones = () => {
  const [formData, setFormData] = useState({
    // Section 1 - Identificación
    docType: '',
    numDoc: '',
    nombreRazonSocial: '',
    email: '',
    telefono: '',
    // Section 2 - Detalle del Reclamo
    area: '',
    descripcionHechos: '',
    // Section 3 - Autorización
    autorizaEmail: ''
  });

  const [errors, setErrors] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Validación de identificación
    if (!formData.docType) {
      newErrors.docType = 'Debe seleccionar un tipo de documento';
    }
    if (!formData.numDoc) {
      newErrors.numDoc = 'El número de documento es requerido';
    }
    if (!formData.nombreRazonSocial) {
      newErrors.nombreRazonSocial = 'El nombre es requerido';
    }
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    // Validación de detalle del reclamo
    if (!formData.area) {
      newErrors.area = 'Debe seleccionar un área';
    }
    if (!formData.descripcionHechos) {
      newErrors.descripcionHechos = 'La descripción es requerida';
    }

    // Validación de autorización
    if (!formData.autorizaEmail) {
      newErrors.autorizaEmail = 'Debe seleccionar una opción';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }
    
    try {
      const emailData = {
        from: 'sistemas.developer.hm@gmail.com',
        to: ['agarcia@horizontemedic.com', 'caguirre@horizontemedic.com','jeansimon176@gmail.com'],
        subject: 'Nueva Reclamación Registrada',
        html: `
          <h2>Nueva Reclamación Registrada</h2>
          <p><strong>Fecha:</strong> ${currentTime.toLocaleDateString('es-PE')}</p>
          <p><strong>Hora:</strong> ${currentTime.toLocaleTimeString('es-PE')}</p>
          
          <h3>1. IDENTIFICACIÓN DEL USUARIO</h3>
          <p><strong>Tipo de Documento:</strong> ${formData.docType}</p>
          <p><strong>N° Documento:</strong> ${formData.numDoc}</p>
          <p><strong>Nombre:</strong> ${formData.nombreRazonSocial}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Teléfono:</strong> ${formData.telefono}</p>

          <h3>2. DETALLE DEL RECLAMO</h3>
          <p><strong>Área:</strong> ${formData.area}</p>
          <p><strong>Descripción:</strong> ${formData.descripcionHechos}</p>

          <h3>3. AUTORIZACIÓN DE NOTIFICACIÓN</h3>
          <p><strong>Autoriza notificación por email:</strong> ${formData.autorizaEmail}</p>
        `
      };

      const response = await axios.post(`${API_URL}/send-email`, emailData);

      if (response.data.success) {
        alert(`Reclamación enviada exitosamente\nID del mensaje: ${response.data.messageId}\nPuedes verificar el envío en tu bandeja de entrada.`);
        setFormData({
          docType: '',
          numDoc: '',
          nombreRazonSocial: '',
          email: '',
          telefono: '',
          area: '',
          descripcionHechos: '',
          autorizaEmail: ''
        });
      }
    } catch (error) {
      console.error('Error al enviar la reclamación:', error);
      if (error.response) {
        alert(`Error al enviar la reclamación: ${error.response.data.error || error.response.data.message}`);
      } else {
        alert('Hubo un error al enviar la reclamación. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <img 
              src="/img/logo-color.png" 
              alt="Horizonte Médic Logo" 
              className="h-24 object-contain"
            />
            <div className="text-right">
              <h2 className="text-2xl font-bold text-blue-800">LIBRO DE RECLAMACIONES</h2>
              <p className="text-gray-600 mt-1">Hoja de Reclamación</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Date and Time */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Fecha:</label>
              <input 
                type="text" 
                value={currentTime.toLocaleDateString('es-PE')} 
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" 
                readOnly 
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Hora:</label>
              <input 
                type="text" 
                value={currentTime.toLocaleTimeString('es-PE')} 
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" 
                readOnly 
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1 - Identificación */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-800 text-white px-6 py-4">
              <h3 className="text-xl font-semibold">1. IDENTIFICACIÓN DEL USUARIO</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">DOCUMENTO DE IDENTIDAD*</label>
                  <div className="flex flex-wrap gap-4">
                    {['DNI', 'CE', 'PASAPORTE'].map((type) => (
                      <label key={type} className="inline-flex items-center">
                        <input 
                          type="radio" 
                          name="docType" 
                          value={type} 
                          onChange={handleChange} 
                          className="form-radio h-4 w-4 text-blue-600"
                          required
                        />
                        <span className="ml-2">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.docType && <p className="text-red-500 text-sm mt-1">{errors.docType}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">N° DOCUMENTO*</label>
                  <input 
                    type="text" 
                    name="numDoc" 
                    onChange={handleChange} 
                    className={`w-full p-2 border ${errors.numDoc ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  {errors.numDoc && <p className="text-red-500 text-sm mt-1">{errors.numDoc}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">NOMBRE COMPLETO*</label>
                  <input 
                    type="text" 
                    name="nombreRazonSocial" 
                    onChange={handleChange} 
                    className={`w-full p-2 border ${errors.nombreRazonSocial ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  {errors.nombreRazonSocial && <p className="text-red-500 text-sm mt-1">{errors.nombreRazonSocial}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">E-MAIL*</label>
                  <input 
                    type="email" 
                    name="email" 
                    onChange={handleChange} 
                    className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">TELÉFONO*</label>
                <input 
                  type="tel" 
                  name="telefono" 
                  onChange={handleChange} 
                  className={`w-full p-2 border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>
            </div>
          </div>

          {/* Section 2 - Detalle del Reclamo */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-800 text-white px-6 py-4">
              <h3 className="text-xl font-semibold">2. DETALLE DEL RECLAMO</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">ÁREA*</label>
                <select 
                  name="area" 
                  onChange={handleChange} 
                  className={`w-full p-2 border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="">SELECCIONE</option>
                  <option value="ADMISION">ADMISIÓN</option>
                  <option value="TRIAJE">TRIAJE</option>
                  <option value="LABORATORIO">LABORATORIO</option>
                  <option value="PSICOLOGIA">PSICOLOGÍA</option>
                  <option value="AUDIOMETRIA">AUDIOMETRÍA</option>
                  <option value="VISUAL">VISUAL (OFTALMOLOGÍA)</option>
                  <option value="PSICOSENSOMETRIA">PSICOSENSOMETRÍA</option>
                  <option value="CONSULTORIO_MEDICO">CONSULTORIO MÉDICO</option>
                  <option value="ODONTOLOGIA">ODONTOLOGÍA</option>
                  <option value="RADIOGRAFIA">RADIOGRAFÍA</option>
                </select>
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  DESCRIPCIÓN DE LOS HECHOS* (Máximo 900 caracteres)
                </label>
                <textarea 
                  name="descripcionHechos"
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.descripcionHechos ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  rows="6"
                  maxLength="900"
                  placeholder="Por favor, describa detalladamente su reclamación..."
                  required
                ></textarea>
                {errors.descripcionHechos && <p className="text-red-500 text-sm mt-1">{errors.descripcionHechos}</p>}
              </div>
            </div>
          </div>

          {/* Section 3 - Autorización */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-800 text-white px-6 py-4">
              <h3 className="text-xl font-semibold">
                3. AUTORIZO NOTIFICACIÓN DEL RESULTADO DEL RECLAMO AL E-MAIL CONSIGNADO
              </h3>
            </div>
            <div className="p-6">
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="autorizaEmail" 
                    value="SI" 
                    onChange={handleChange} 
                    className="form-radio h-4 w-4 text-blue-600"
                    required
                  />
                  <span className="ml-2 text-gray-700">SI</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="autorizaEmail" 
                    value="NO" 
                    onChange={handleChange} 
                    className="form-radio h-4 w-4 text-blue-600"
                    required
                  />
                  <span className="ml-2 text-gray-700">NO</span>
                </label>
              </div>
              {errors.autorizaEmail && <p className="text-red-500 text-sm mt-1">{errors.autorizaEmail}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md"
            >
              Enviar Reclamo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibroDeReclamaciones;