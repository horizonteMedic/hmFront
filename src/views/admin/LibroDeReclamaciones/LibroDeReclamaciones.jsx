import React, { useState, useEffect } from 'react';
// import './LibroDeReclamaciones.css';
import axios from 'axios';
import { URLAzure } from '../../config/config';
import Swal from 'sweetalert2';

const API_URL = `${URLAzure}/api/v01/st/email/libroReclamacionesEnviarCorreo`;

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
  const [loading, setLoading] = useState(false);

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
    if (!/^[0-9]{8}$/.test(formData.numDoc)) {
      newErrors.numDoc = 'El DNI debe tener exactamente 8 dígitos numéricos';
    }
    if (!formData.nombreRazonSocial) {
      newErrors.nombreRazonSocial = 'El nombre es requerido';
    }
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!/^[0-9]{9}$/.test(formData.telefono)) {
      newErrors.telefono = 'El celular debe tener exactamente 9 dígitos numéricos';
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
    // Solo permitir números en DNI y celular
    if (name === 'numDoc') {
      if (!/^\d*$/.test(value)) return;
    }
    if (name === 'telefono') {
      if (!/^\d*$/.test(value)) return;
    }
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
      Swal.fire({ icon: 'error', title: 'Campos inválidos', text: 'Por favor, complete todos los campos correctamente.' });
      return;
    }
    
    setLoading(true);
    Swal.fire({
      title: 'Enviando reclamo...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
    
    try {
      // Transformar a mayúsculas los campos de texto
      const upperForm = {
        ...formData,
        nombreRazonSocial: formData.nombreRazonSocial.toUpperCase(),
        email: formData.email.toUpperCase(),
        descripcionHechos: formData.descripcionHechos.toUpperCase(),
        area: formData.area.toUpperCase(),
        docType: formData.docType.toUpperCase(),
        autorizaEmail: formData.autorizaEmail.toUpperCase()
      };
      const destinatarios = [
        'agarcia@horizontemedic.com',
        'caguirre@horizontemedic.com',
        'jeansimon176@gmail.com'
      ];
      const asunto = 'LIBRO DE RECLAMACIONES';
      const cuerpoHtml = `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#f9f9f9;padding:24px;border-radius:10px;box-shadow:0 2px 8px #0001;">
          <h2 style="color:#0f4e8c;text-align:center;margin-bottom:24px;">NUEVA RECLAMACIÓN REGISTRADA</h2>
          <table style="width:100%;background:#fff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:8px 0 4px 0;text-align:center;" colspan="2">
                <span style="color:#888;font-size:14px;">${currentTime.toLocaleDateString('es-PE')} - ${currentTime.toLocaleTimeString('es-PE')}</span>
              </td>
            </tr>
            <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;margin:12px 0;"></td></tr>
            <tr>
              <td style="font-weight:bold;color:#0f4e8c;padding:8px 0;">TIPO DE DOCUMENTO:</td>
              <td style="padding:8px 0;">${upperForm.docType}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;color:#0f4e8c;">N° DOCUMENTO:</td>
              <td>${upperForm.numDoc}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;color:#0f4e8c;">NOMBRE:</td>
              <td>${upperForm.nombreRazonSocial}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;color:#0f4e8c;">EMAIL:</td>
              <td>${upperForm.email}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;color:#0f4e8c;">TELÉFONO:</td>
              <td>${upperForm.telefono}</td>
            </tr>
            <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;margin:12px 0;"></td></tr>
            <tr>
              <td style="font-weight:bold;color:#0f4e8c;">ÁREA:</td>
              <td>${upperForm.area}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;color:#0f4e8c;">DESCRIPCIÓN:</td>
              <td>${upperForm.descripcionHechos}</td>
            </tr>
            <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;margin:12px 0;"></td></tr>
            <tr>
              <td style="font-weight:bold;color:#0f4e8c;">AUTORIZA NOTIFICACIÓN POR EMAIL:</td>
              <td>${upperForm.autorizaEmail}</td>
            </tr>
          </table>
          <div style="text-align:center;margin-top:24px;">
            <img src="https://sistema.horizontemedic.com/img/logo-color.png" alt="Logo Horizonte Médic" style="height:48px;margin-bottom:8px;" />
            <div style="color:#0f4e8c;font-size:13px;">Horizonte Médic</div>
            <!-- Aquí el pie de página -->
          </div>
        </div>
      `;

      await axios.post(API_URL, {
        destinatarios,
        asunto,
        cuerpoHtml
      });

      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: '¡Reclamación enviada!',
        text: 'Su reclamo fue enviado correctamente.',
        showConfirmButton: true
      });
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
      setErrors({});
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: 'Hubo un error al enviar la reclamación. Por favor, intente nuevamente.'
      });
      console.error('Error al enviar la reclamación:', error);
    }
  };

  // Función para saber si el formulario está listo para enviar
  const isFormValid = () => {
    return (
      formData.docType &&
      /^[0-9]{8}$/.test(formData.numDoc) &&
      formData.nombreRazonSocial &&
      formData.email && /\S+@\S+\.\S+/.test(formData.email) &&
      /^[0-9]{9}$/.test(formData.telefono) &&
      formData.area &&
      formData.descripcionHechos &&
      formData.autorizaEmail
    );
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

          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={loading || !isFormValid()}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md"
            >
              {loading ? 'Cargando...' : 'Enviar Reclamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibroDeReclamaciones;