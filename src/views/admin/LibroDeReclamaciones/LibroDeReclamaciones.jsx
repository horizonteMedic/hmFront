import React, { useState } from 'react';
import './LibroDeReclamaciones.css';

const LibroDeReclamaciones = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Part 1 - User Identification
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    menorEdad: false,
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    telefono: '',
    email: '',
    // Part 2 - Service Identification
    tipoServicio: '',
    fechaIncidente: '',
    canalCompra: '',
    descripcion: '',
    montoPagado: '',
    // Part 3 - Complaint Details
    tipoReclamo: '',
    detalleReclamo: '',
    pedidoSolicitud: '',
    aceptaTerminos: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const validateStep1 = () => {
    return formData.nombre && 
           formData.apellido && 
           formData.tipoDocumento && 
           formData.numeroDocumento && 
           formData.direccion && 
           formData.departamento && 
           formData.provincia && 
           formData.distrito && 
           formData.email;
  };

  const validateStep2 = () => {
    return formData.tipoServicio && 
           formData.descripcion;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }
    if (step === 2 && !validateStep2()) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep1 = () => (
    <div className="card-body">
      <h3 className="text-primary mb-4">Identificación del cliente</h3>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Nombre*</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Apellido*</label>
          <input
            type="text"
            className="form-control"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Tipo de Documento*</label>
          <select
            className="form-select"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            required
          >
            <option value="">Elegir tipo de documento</option>
            <option value="dni">DNI</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="ce">Carnet de Extranjería</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">N° Documento*</label>
          <input
            type="text"
            className="form-control"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">¿Eres menor de Edad?*</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="menorEdad"
              value="no"
              checked={!formData.menorEdad}
              onChange={() => setFormData(prev => ({...prev, menorEdad: false}))}
              required
            />
            <label className="form-check-label">No</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="menorEdad"
              value="si"
              checked={formData.menorEdad}
              onChange={() => setFormData(prev => ({...prev, menorEdad: true}))}
            />
            <label className="form-check-label">Si</label>
          </div>
        </div>
      </div>

      <h3 className="text-primary mb-4">Datos de ubicación del cliente</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Dirección*</label>
          <input
            type="text"
            className="form-control"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Departamento*</label>
          <input
            type="text"
            className="form-control"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Provincia*</label>
          <input
            type="text"
            className="form-control"
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Distrito*</label>
          <input
            type="text"
            className="form-control"
            name="distrito"
            value={formData.distrito}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <h3 className="text-primary mb-4">Datos de contacto del cliente</h3>
      <p className="text-muted small mb-4">
        *En caso Usted no coloque una dirección de correo electrónico válida, nuestra empresa no podrá, de conformidad con el artículo 4 B del reglamento del
        Libro de Reclamaciones, enviarle por dicha vía, el acceso a la presente hoja de reclamación virtual; sin embargo, la no colocación de una dirección de
        correo electrónico válida, no impedirá que Usted pueda concluir satisfactoriamente el proceso de ingreso de su reclamo o queja, siempre que Usted
        consigne los datos mínimos exigidos por la legislación vigente.
      </p>

      <div className="mb-3">
        <label className="form-label">Teléfono (opcional)</label>
        <input
          type="tel"
          className="form-control"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Email*</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="text-end">
        <button type="button" className="btn btn-primary btn-lg" onClick={nextStep}>
          Siguiente
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="card-body">
      <h3 className="text-primary mb-4">Identificación del bien contratado</h3>
      
      <div className="mb-4">
        <label className="form-label">Producto o Servicio*</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="tipoServicio"
              value="producto"
              checked={formData.tipoServicio === 'producto'}
              onChange={handleChange}
              required
            />
            <label className="form-check-label">Producto</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="tipoServicio"
              value="servicio"
              checked={formData.tipoServicio === 'servicio'}
              onChange={handleChange}
            />
            <label className="form-check-label">Servicio</label>
          </div>
        </div>
      </div>

      
      <div className="mb-4">
        <label className="form-label">Fecha del Incidente (Opcional)</label>
        <input
          type="date"
          className="form-control"
          name="fechaIncidente"
          value={formData.fechaIncidente}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Indica el canal de compra (Opcional)</label>
        <div className="canal-compra-options">
          {['Virtual', 'Presencial', 'Telefónico', 'No Compré / No Contraté', 'Otro'].map(canal => (
            <div className="form-check" key={canal}>
              <input
                type="radio"
                className="form-check-input"
                name="canalCompra"
                value={canal}
                checked={formData.canalCompra === canal}
                onChange={handleChange}
              />
              <label className="form-check-label">{canal}</label>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-primary mb-4">Detalles del Bien o Servicio</h3>
      
      <div className="mb-4">
        <label className="form-label">Descripción*</label>
        <textarea
          className="form-control"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="4"
          placeholder="Describe el bien"
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Monto Pagado (opcional)</label>
        <div className="input-group">
          <span className="input-group-text">S/</span>
          <input
            type="number"
            className="form-control"
            name="montoPagado"
            value={formData.montoPagado}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary btn-lg" onClick={prevStep}>
          Anterior
        </button>
        <button type="button" className="btn btn-primary btn-lg" onClick={nextStep}>
          Siguiente
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="card-body">
      <h3 className="text-primary mb-4">Detalle de la reclamación</h3>
      
      <div className="reclamo-info mb-4">
        <p className="mb-2">*RECLAMO: Disconformidad relacionada a los productos o servicios.</p>
        <p>*QUEJA: Disconformidad NO relacionada a los productos o servicios; si no al descontento respecto a la atención al público.</p>
      </div>

      <div className="mb-4">
        <label className="form-label">Reclamo o Queja*</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="tipoReclamo"
              value="reclamo"
              checked={formData.tipoReclamo === 'reclamo'}
              onChange={handleChange}
              required
            />
            <label className="form-check-label">Reclamo</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="tipoReclamo"
              value="queja"
              checked={formData.tipoReclamo === 'queja'}
              onChange={handleChange}
            />
            <label className="form-check-label">Queja</label>
          </div>
        </div>
      </div>

      <h3 className="text-primary mb-4">Pedido del Consumidor</h3>
      
      <div className="mb-4">
        <label className="form-label">Detalle del Reclamo o Queja*</label>
        <textarea
          className="form-control"
          name="detalleReclamo"
          value={formData.detalleReclamo}
          onChange={handleChange}
          rows="4"
          placeholder="Cuéntanos lo que motiva tu reclamo o queja."
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Indicanos lo que Solicitas*</label>
        <textarea
          className="form-control"
          name="pedidoSolicitud"
          value={formData.pedidoSolicitud}
          onChange={handleChange}
          rows="4"
          placeholder="¿Qué solicitas por parte del reclamado? Ej: Devolución del monto pagado / cambio de producto / aplicación de garantía"
          required
        />
      </div>

      <div className="terminos-container mb-4">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="aceptaTerminos"
            checked={formData.aceptaTerminos}
            onChange={handleChange}
            required
          />
          <label className="form-check-label">
            He leído y doy conformidad de mis datos y garantizo la veracidad de mi reclamo o queja
          </label>
        </div>
        <p className="terminos-text mt-3">
          Estimado Cliente, muchas gracias por registrar su incidencia en nuestro Libro de Reclamaciones Virtual, su opinión es muy importante para nosotros. «La confirmación de envío de la presente hoja de reclamación, expresa únicamente la recepción de la misma, más no la aceptación de su contenido. La presente reclamación será tramitada dentro del plazo de ley.» «Nuestra área de servicio al cliente le informará (i) La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI, (ii) El proveedor deberá dar respuesta al reclamo en un plazo no mayor a quince (15) días hábiles. Este plazo es improrrogable.»
        </p>
        <p className="privacy-notice">
          * Los datos personales de los reclamantes no serán utilizados para otras finalidades ajenas o incompatibles con este libro de reclamaciones.
        </p>
        <p className="privacy-notice">
          * Los datos personales de los reclamantes serán tratados de acuerdo a las políticas de privacidad de: MINNA SAC - RUC: 20608510592
        </p>
      </div>

      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary btn-lg" onClick={prevStep}>
          Anterior
        </button>
        <button type="submit" className="btn btn-primary btn-lg">
          Enviar
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="steps-indicator mb-4">
        <div className="d-flex justify-content-between">
          <div className={`step ${step === 1 ? 'active' : ''}`}>1. Identificación del Usuario</div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>2. Identificación del Bien Contratado</div>
          <div className={`step ${step === 3 ? 'active' : ''}`}>3. Detalle de la Reclamación</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </form>
    </div>
  );
};

export default LibroDeReclamaciones;