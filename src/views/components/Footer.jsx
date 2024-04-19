import React from 'react';

import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2024 Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="#">Política de privacidad</a>
          <a href="#">Términos de servicio</a>
          <a href="#">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;