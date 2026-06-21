const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Nodemailer usando las variables de entorno de Easypanel
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_ADDRESS || 'mail.arkhon.com.ar',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USERNAME || 'consultas@katrix.com.ar',
        pass: process.env.SMTP_PASSWORD || 'GqNSNcbcEL',
    },
    tls: {
        rejectUnauthorized: process.env.SMTP_TLS_VERIFY_NONE !== 'true'
    }
});

// Endpoint para el formulario de contacto
app.post('/api/contact', async (req, res) => {
    try {
        const { nombre, email, servicio_interes, mensaje } = req.body;

        if (!nombre || !email || !servicio_interes) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const mailOptions = {
            from: `"${nombre} (${email})" <${process.env.SMTP_USERNAME || 'consultas@katrix.com.ar'}>`,
            to: process.env.SMTP_USERNAME || 'consultas@katrix.com.ar',
            replyTo: email,
            subject: `Nuevo prospecto desde Katrix Landing: ${nombre}`,
            html: `
                <h2>Nuevo Contacto desde la Web</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email Corporativo:</strong> ${email}</p>
                <p><strong>Servicio de Interés:</strong> ${servicio_interes}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje || 'Sin mensaje adicional.'}</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Mensaje enviado: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({ error: 'Error interno del servidor al enviar el correo' });
    }
});

// Servir archivos estáticos de Angular
const angularAppPath = path.join(__dirname, 'dist', 'katrix-landing', 'browser');
app.use(express.static(angularAppPath));

// Rutas de Angular (SPA) - Cualquier ruta que no sea API devuelve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(angularAppPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor Node.js ejecutándose en el puerto ${port}`);
});
