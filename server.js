import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de CORS para producción
app.use(cors({
  origin: 'https://devclientes.horizontemedic.com',
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Servir archivos estáticos en producción
app.use(express.static(path.join(__dirname, 'build')));

// Configuración del transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sistemas.developer.hm@gmail.com',
    pass: 'attdcwbvovpxhwyn'
  }
});

// Verificar la conexión del transporter
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error al verificar el transporter:', error);
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

// Ruta para enviar correo
app.post('/api/send-email', async (req, res) => {
  try {
    const { from, to, subject, html } = req.body;
    console.log('Intentando enviar correo a:', to);

    const mailOptions = {
      from,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Correo enviado exitosamente',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error detallado al enviar el correo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el correo',
      error: error.message 
    });
  }
});

// Manejar rutas de React en producción
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 