const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configuración del transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sistemas.developer.hm@gmail.com',
    pass: 'attdcwbvovpxhwyn'
  }
});

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de reclamaciones funcionando' });
});

// Ruta para enviar correo de reclamación
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
      <p><strong>Nombre:</strong> ${formData.nombreRazonSocial}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Teléfono:</strong> ${formData.telefono}</p>

      <h3>2. DETALLE DEL RECLAMO</h3>
      <p><strong>Área:</strong> ${formData.area}</p>
      <p><strong>Descripción:</strong> ${formData.descripcionHechos}</p>

      <h3>3. AUTORIZACIÓN DE NOTIFICACIÓN</h3>
      <p><strong>Autoriza notificación por email:</strong> ${formData.autorizaEmail}</p>
    `;

    const mailOptions = {
      from: 'sistemas.developer.hm@gmail.com',
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