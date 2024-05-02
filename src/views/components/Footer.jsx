// // Footer.js
import React from 'react';
import './Footer.css';
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* <p>© {currentYear} Todos los derechos reservados.</p>
      <p>Horizonte Medic</p> */}
    </footer>
  );
}

export default Footer;