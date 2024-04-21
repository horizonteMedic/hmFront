import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../../components/Navbar-client";
import Footer from "../../components/Footer";

// Componente de Tarjeta
const Card = ({ title, to, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    textDecoration: 'none', // Elimina el subrayado del enlace
    width: '100px',
    height: '100px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
  };

  const textStyle = {
    color: 'white',
    fontSize: '15px',
    fontWeight: 'bold',
    textAlign: 'center', 
  };

  return (
    <Link to={to} style={cardStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={textStyle}>{title}</div>
    </Link>
  );
};

export default function Dashboard() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'teal', 'indigo', 'orange', 'gray'];

  const topCards = [
    { title: 'Registro de Pacientes', to: '/registro-de-pacientes', color: colors[0] },
    { title: 'Triaje', to: '/triaje', color: colors[1] },
    { title: 'Card 3', to: '/card-3', color: colors[2] },
    { title: 'Card 4', to: '/card-4', color: colors[3] },
    { title: 'Card 5', to: '/card-5', color: colors[4] }
  ];

  const bottomCards = colors.slice(5, 10).map((color, index) => ({ title: `Card ${index + 6}`, to: `/card-${index + 6}`, color }));

  return (
    <>
      <Navbar />
      <section className="relative h-screen">
        <div className="flex flex-col h-full justify-center items-center">
          <div className="flex justify-center">
            {topCards.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {bottomCards.map((card, index) => (
              <Card key={index + 5} {...card} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
