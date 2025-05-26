const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configuración del transporter (reemplaza con tus credenciales)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu_correo@gmail.com', // Reemplaza con tu correo
    pass: 'tu_contraseña_de_aplicacion' // Reemplaza con tu contraseña de aplicación
  }
});

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de reclamaciones funcionando' });
});

router.post('/enviar-correo', async (req, res) => {
  try {
    const { to, subject, formData, fecha, hora } = req.body;

    const htmlContent = `
      <h2>Nueva Reclamación Registrada</h2>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Hora:</strong> ${hora}</p>
      
      <h3>1. IDENTIFICACIÓN DEL USUARIO</h3>
      <p><strong>Tipo de Documento:</strong> ${formData.docType}</p>
      <p><strong>N° Documento:</strong> ${formData.numDoc}</p>
      <p><strong>Nombre/Razón Social:</strong> ${formData.nombreRazonSocial}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Domicilio:</strong> ${formData.domicilio}</p>
      <p><strong>Teléfono:</strong> ${formData.telefono}</p>

      <h3>2. IDENTIFICACIÓN DEL RECLAMANTE</h3>
      <p><strong>Tipo de Documento:</strong> ${formData.docTypeReclamante}</p>
      <p><strong>N° Documento:</strong> ${formData.numDocReclamante}</p>
      <p><strong>Nombre/Razón Social:</strong> ${formData.nombreRazonSocialReclamante}</p>
      <p><strong>Email:</strong> ${formData.emailReclamante}</p>
      <p><strong>Domicilio:</strong> ${formData.domicilioReclamante}</p>
      <p><strong>Teléfono:</strong> ${formData.telefonoReclamante}</p>

      <h3>3. DETALLE DEL RECLAMO</h3>
      <p><strong>Área:</strong> ${formData.area}</p>
      <p><strong>Servicio:</strong> ${formData.servicio}</p>
      <p><strong>Descripción:</strong> ${formData.descripcionHechos}</p>

      <h3>4. AUTORIZACIÓN DE NOTIFICACIÓN</h3>
      <p><strong>Autoriza notificación por email:</strong> ${formData.autorizaEmail}</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to.join(', '),
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});

module.exports = router; 