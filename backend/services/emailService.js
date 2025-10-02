const nodemailer = require('nodemailer');

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar configuración del transporter
transporter.verify((error, success) => {
  if (error) {
    console.log('Error en configuración de email:', error);
  } else {
    console.log('Servidor de email listo para enviar mensajes');
  }
});

/**
 * Envía notificación de interés al vendedor
 * @param {Object} options - Opciones del email
 * @param {string} options.vendedorEmail - Email del vendedor
 * @param {string} options.vendedorNombre - Nombre del vendedor
 * @param {string} options.interesadoNombre - Nombre del interesado
 * @param {string} options.interesadoEmail - Email del interesado
 * @param {string} options.interesadoTelefono - Teléfono del interesado
 * @param {string} options.listingTitulo - Título del anuncio
 * @param {string} options.listingId - ID del anuncio
 * @param {string} options.mensaje - Mensaje opcional del interesado
 */
const enviarNotificacionInteres = async (options) => {
  const {
    vendedorEmail,
    vendedorNombre,
    interesadoNombre,
    interesadoEmail,
    interesadoTelefono,
    listingTitulo,
    listingId,
    mensaje,
  } = options;

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const listingUrl = `${frontendUrl}/listings/${listingId}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9fafb;
        }
        .header {
          background-color: #6366f1;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .info-box {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #6366f1;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Alguien está interesado en tu artículo!</h1>
        </div>
        <div class="content">
          <p>Hola ${vendedorNombre},</p>
          <p>Tenemos buenas noticias. <strong>${interesadoNombre}</strong> ha expresado interés en tu anuncio:</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0;">${listingTitulo}</h3>
            <p><strong>Persona interesada:</strong> ${interesadoNombre}</p>
            <p><strong>Email:</strong> ${interesadoEmail}</p>
            ${interesadoTelefono ? `<p><strong>Teléfono:</strong> ${interesadoTelefono}</p>` : ''}
            ${mensaje ? `<p><strong>Mensaje:</strong><br/>${mensaje}</p>` : ''}
          </div>

          <p>Puedes contactar directamente a esta persona para coordinar la venta.</p>

          <center>
            <a href="${listingUrl}" class="button">Ver mi anuncio</a>
          </center>

          <p>¡Buena suerte con tu venta!</p>
        </div>
        <div class="footer">
          <p>SecondMarket - Tu marketplace de segunda mano</p>
          <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"SecondMarket" <${process.env.EMAIL_USER}>`,
    to: vendedorEmail,
    subject: `¡Alguien está interesado en tu artículo: ${listingTitulo}!`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw error;
  }
};

module.exports = {
  enviarNotificacionInteres,
};
