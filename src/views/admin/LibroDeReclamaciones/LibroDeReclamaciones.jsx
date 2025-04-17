import React, { useState, useEffect } from 'react';
import './LibroDeReclamaciones.css';

const LibroDeReclamaciones = () => {
  const [formData, setFormData] = useState({
    // Section 1
    docType: '',
    numDoc: '',
    nombreRazonSocial: '',
    email: '',
    domicilio: '',
    telefono: '',
    // Section 2
    docTypeReclamante: '',
    numDocReclamante: '',
    nombreRazonSocialReclamante: '',
    emailReclamante: '',
    domicilioReclamante: '',
    telefonoReclamante: '',
    // Section 3
    area: '',
    servicio: '',
    descripcionHechos: '',
    // Section 4
    autorizaEmail: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="header mb-6 p-4">
        <div className="flex items-center justify-between">
          <img 
            src="/img/logo-color.png" 
            alt="Horizonte Médic Logo" 
            className="h-20" // increased from h-16
          />
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">LIBRO DE RECLAMACIONES</h2>
            <p className="text-sm text-gray-600">Hoja de Reclamación</p>
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="bg-white p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Fecha:</label>
            <input 
              type="text" 
              value={currentTime.toLocaleDateString('es-PE')} 
              className="w-full border-b border-gray-300 outline-none" 
              readOnly 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Hora:</label>
            <input 
              type="text" 
              value={currentTime.toLocaleTimeString('es-PE')} 
              className="w-full border-b border-gray-300 outline-none" 
              readOnly 
            />
          </div>
        </div>
      </div>

      {/* Form continues... */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Section 1 */}
        <div className="bg-gray-100 p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">1. IDENTIFICACIÓN DEL USUARIO O TERCERO LEGITIMADO</h3>
          <div className="bg-white p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">DOCUMENTO DE IDENTIDAD*</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="docType" value="DNI" onChange={handleChange} className="form-radio" />
                    <span className="ml-2">DNI</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="docType" value="CE" onChange={handleChange} className="form-radio" />
                    <span className="ml-2">CE</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="docType" value="PASAPORTE" onChange={handleChange} className="form-radio" />
                    <span className="ml-2">PASAPORTE</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="docType" value="RUC" onChange={handleChange} className="form-radio" />
                    <span className="ml-2">RUC</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">N° DOCUMENTO*</label>
                <input type="text" name="numDoc" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2">NOMBRE O RAZÓN SOCIAL*</label>
                <input type="text" name="nombreRazonSocial" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">E-MAIL</label>
                <input type="email" name="email" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2">DOMICILIO*</label>
                <input type="text" name="domicilio" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">TELÉFONO*</label>
                <input type="tel" name="telefono" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-blue-100 p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            2. IDENTIFICACIÓN DE QUIEN PRESENTA EL RECLAMO
            <span className="text-sm font-normal text-gray-600 ml-2">
              (En caso del ser el usuario afectado no es necesario su llenado)
            </span>
          </h3>
          <div className="bg-white p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">DOCUMENTO DE IDENTIDAD*</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="docTypeReclamante" value="DNI" onChange={handleChange} className="form-radio" />
                    <span className="ml-2">DNI</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="docTypeReclamante" value="CE" onChange={handleChange} className="form-radio" />
                    <span className="ml-2">CE</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="docTypeReclamante" value="PASAPORTE" onChange={handleChange} className="form-radio" />
                    <span className="ml-2">PASAPORTE</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="docTypeReclamante" value="RUC" onChange={handleChange} className="form-radio" />
                    <span className="ml-2">RUC</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">N° DOCUMENTO*</label>
                <input type="text" name="numDocReclamante" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2">NOMBRE O RAZÓN SOCIAL*</label>
                <input type="text" name="nombreRazonSocialReclamante" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">E-MAIL</label>
                <input type="email" name="emailReclamante" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2">DOMICILIO*</label>
                <input type="text" name="domicilioReclamante" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">TELÉFONO*</label>
                <input type="tel" name="telefonoReclamante" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-gray-100 p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">3. DETALLE DEL RECLAMO</h3>
          <div className="bg-white p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">ÁREA*</label>
                <select name="area" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none">
                  <option value="">SELECCIONE</option>
                  {/* Add your area options */}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">SERVICIO*</label>
                <select name="servicio" onChange={handleChange} className="w-full border-b border-gray-300 focus:border-blue-500 outline-none">
                  <option value="">SELECCIONE</option>
                  {/* Add your service options */}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">DESCRIPCIÓN DE LOS HECHOS* (Máximo 900 caracteres)</label>
              <textarea 
                name="descripcionHechos"
                onChange={handleChange}
                className="w-full border rounded p-2 focus:border-blue-500 outline-none"
                rows="6"
                maxLength="900"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-gray-100 p-4">
          <h3 className="text-lg font-semibold mb-4">4. AUTORIZO NOTIFICACIÓN DEL RESULTADO DEL RECLAMO AL E-MAIL CONSIGNADO (MARCAR)</h3>
          <div className="bg-white p-4 rounded flex gap-4">
            <label className="inline-flex items-center">
              <input type="radio" name="autorizaEmail" value="SI" onChange={handleChange} className="form-radio" />
              <span className="ml-2">SI</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="autorizaEmail" value="NO" onChange={handleChange} className="form-radio" />
              <span className="ml-2">NO</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Enviar Reclamo
          </button>
        </div>
      </form>
    </div>
  );
};

export default LibroDeReclamaciones;