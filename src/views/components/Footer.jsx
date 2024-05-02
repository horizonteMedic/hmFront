import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        <p>© {currentYear} Todos los derechos reservados.</p>
        <p>Horizonte Medic</p>
      </div>
    </footer>
  );
}

export default Footer;
