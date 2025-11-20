import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const CelebrationAnimation = ({ show }) => {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    if (show) {
      // Crear múltiples emojis de celebración que caen desde arriba
      const newEmojis = [];
      const emojiTypes = ['🎉', '💰', '💸', '🎊', '💵', '🪙', '💎', '🏆', '⭐', '✨'];
      
      for (let i = 0; i < 80; i++) {
        newEmojis.push({
          id: i,
          emoji: emojiTypes[Math.floor(Math.random() * emojiTypes.length)],
          x: Math.random() * window.innerWidth,
          y: -50 - Math.random() * 100, // Empezar desde arriba de la pantalla
          rotation: Math.random() * 360,
          scale: Math.random() * 1.5 + 0.3, // Diferentes tamaños
          animationDelay: Math.random() * 3,
          duration: Math.random() * 3 + 4, // Más tiempo para caer
          fallSpeed: Math.random() * 2 + 1 // Velocidad de caída variable
        });
      }
      setEmojis(newEmojis);

      // Ocultar la animación después de 8 segundos
      const timer = setTimeout(() => {
        setEmojis([]);
      }, 8000);

      return () => clearTimeout(timer);
    } else {
      // Limpiar emojis si show se vuelve false
      setEmojis([]);
    }
  }, [show]);

  if (!show || emojis.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Emojis cayendo desde arriba */}
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute"
          style={{
            left: `${emoji.x}px`,
            top: `${emoji.y}px`,
            transform: `rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
            animationDelay: `${emoji.animationDelay}s`,
            animationDuration: `${emoji.duration}s`,
            fontSize: `${emoji.scale * 2}rem`,
            animation: `fall ${emoji.duration}s ${emoji.animationDelay}s linear forwards`
          }}
        >
          {emoji.emoji}
        </div>
      ))}
      
      {/* Mensaje central espectacular */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-12 py-8 rounded-2xl shadow-2xl animate-pulse border-4 border-yellow-300">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">💰</div>
            <div className="text-2xl font-black mb-2 text-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
              HOY PAGAN GENTE!!
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS para la animación de caída */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

CelebrationAnimation.propTypes = {
  show: PropTypes.bool.isRequired
};

export default CelebrationAnimation;
