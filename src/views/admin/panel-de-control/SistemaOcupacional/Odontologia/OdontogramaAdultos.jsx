import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileAlt, faBroom, faHistory } from '@fortawesome/free-solid-svg-icons';
import './OdontogramaAdultos.css';

const OdontogramaAdultos = () => {
  const dientesSuperioresArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];

  const dientesInferioresArray = [
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  ];

  const initialDientesOptions = Object.fromEntries(
    [...dientesSuperioresArray, ...dientesInferioresArray].map((diente) => [diente, "Normal"])
  );


  const [contextMenu, setContextMenu] = useState(null);
  const [dienteOptions, setDienteOptions] = useState(initialDientesOptions);
  const [contadorOptions, setContadorOptions] = useState({
    'Ausente': 0,
    'Cariada por opturar': 0,
    'Por extraer': 0,
    'Fracturada': 0,
    'Corona': 0,
    'ObturacionEfectuada': 0,
    'Puente': 0,
    'P.P.R Metalica': 0,
    'P.P.R Acrilica': 0,
    'P.Total': 0,
    'Normal': 32,
    'Dientes en mal estado': 0,
  });

  const [observaciones, setObservaciones] = useState('NO PASO EXAMEN ODONTOLOGICO');
  const [noPasoExamen, setNoPasoExamen] = useState(false);

  // Cerrar menú contextual con ESC o click fuera
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setContextMenu(null);
      }
    };

    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest('.context-menu')) {
        setContextMenu(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);



  const handleContextMenu = (event, diente) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Calcular posición del menú
    const menuHeight = 400; // Altura del menú
    const windowHeight = window.innerHeight;
    const mouseY = event.clientY;
    const mouseX = event.clientX;
    
    // Determinar si es un diente inferior (dientes 17-32)
    const isDienteInferior = diente >= 17 && diente <= 32;
    
    let menuY;
    let menuX = mouseX - 2;
    
    // Para dientes inferiores, siempre mostrar arriba
    if (isDienteInferior) {
      menuY = mouseY - menuHeight - 10;
    } else {
      // Para dientes superiores, verificar espacio disponible
      if (mouseY + menuHeight > windowHeight) {
        menuY = mouseY - menuHeight - 10;
      } else {
        menuY = mouseY - 4;
      }
    }
    
    // Asegurar que el menú no se salga por arriba
    if (menuY < 10) {
      menuY = 10;
    }
    
    // Asegurar que el menú no se salga por los lados
    const menuWidth = 200;
    if (menuX + menuWidth > window.innerWidth) {
      menuX = window.innerWidth - menuWidth - 10;
    }
    if (menuX < 10) {
      menuX = 10;
    }
    
    setContextMenu({
      mouseX: menuX,
      mouseY: menuY,
      diente,
    });
  };

  const handleOptionClick = (option) => {
    const diente = contextMenu.diente;
    const prevOption = dienteOptions[diente];

    if (prevOption === option) {
      setContextMenu(null);
      return;
    }

    // Actualizar contadores
    setContadorOptions((prevContadores) => {
      const newContadores = { ...prevContadores };
      
      // Si había una opción previa, restar 1 de esa opción
      if (prevOption) {
        newContadores[prevOption] = newContadores[prevOption] - 1;
      }
      
      // Sumar 1 a la nueva opción
      newContadores[option] = newContadores[option] + 1;
      
      return newContadores;
    });

    // Actualizar la opción del diente
    setDienteOptions((prevOptions) => ({
      ...prevOptions,
      [diente]: option,
    }));

    setContextMenu(null);
  };

  const handleAgregarActualizar = () => {
    // Aquí iría la lógica para guardar/actualizar los datos
    console.log('Agregar/Actualizar:', {
      dienteOptions,
      contadorOptions,
      observaciones,
      noPasoExamen
    });
  };

  const handleLimpiar = () => {
    setDienteOptions(initialDientesOptions);
    setContadorOptions({
      'Ausente': 0,
      'Cariada por opturar': 0,
      'Por extraer': 0,
      'Fracturada': 0,
      'Corona': 0,
      'ObturacionEfectuada': 0,
      'Puente': 0,
      'P.P.R Metalica': 0,
      'P.P.R Acrilica': 0,
      'P.Total': 0,
      'Normal': 32,
      'Dientes en mal estado': 0,
    });
    setObservaciones('NO PASO EXAMEN ODONTOLOGICO');
    setNoPasoExamen(false);
  };

  const handleVerHistorial = () => {
    // Aquí iría la lógica para ver el historial
    console.log('Ver historial');
  };

  const renderInput = (label) => (
    <div className="contador-item">
      <label className="contador-label">{label}:</label>
      <input
        type="text"
        value={contadorOptions[label]}
        readOnly
        className="contador-input"
      />
    </div>
  );

  const renderDiente = (diente, imgUrl, rotate = false) => (
    <div
      className="diente-item"
      onContextMenu={(e) => handleContextMenu(e, diente)}
    >
      <img
        src={imgUrl}
        alt={`Diente ${diente}`}
        className={`diente-imagen ${rotate ? 'rotate-180' : ''}`}
      />
      <span className="diente-numero">{diente}</span>
      {dienteOptions[diente] && (
        <div className="indicador-diente">
          {renderIndicator(dienteOptions[diente])}
        </div>
      )}
    </div>
  );

  const renderIndicator = (option) => {
    switch (option) {
      case 'Ausente':
        return <span className="text-blue-500 text-6xl">✕</span>;
      case 'Cariada por opturar':
        return <span className="text-red-500 text-7xl">●</span>;
      case 'Por extraer':
        return <span className="text-red-500 text-6xl">⊗</span>;
      case 'Fracturada':
        return <span className="text-black text-6xl">╱</span>;
      case 'Corona':
        return <span className="text-blue-500 text-6xl">▲</span>;
      case 'ObturacionEfectuada':
        return <span className="text-blue-500 text-7xl">●</span>;
      case 'Puente':
        return <span className="text-black text-6xl">▭</span>;
      case 'P.P.R Metalica':
        return <span className="text-black text-6xl">―</span>;
      case 'P.P.R Acrilica':
        return <span className="text-black text-6xl">=</span>;
      case 'P.Total':
        return <span className="text-black text-6xl">≈</span>;
      case 'Normal':
        return <span className="text-green-500 text-6xl">☑</span>;
      case 'Dientes en mal estado':
        return <span className="text-yellow-500 text-3xl">🟡</span>;
      default:
        return null;
    }
  };

  const menuOptions = [
    { label: 'Ausente', icon: '✕', color: 'text-blue-500' },
    { label: 'Cariada por opturar', icon: '●', color: 'text-red-500' },
    { label: 'Por extraer', icon: '⊗', color: 'text-red-500' },
    { label: 'Fracturada', icon: '╱', color: 'text-black' },
    { label: 'Corona', icon: '▲', color: 'text-blue-500' },
    { label: 'ObturacionEfectuada', icon: '●', color: 'text-blue-500' },
    { label: 'Puente', icon: '▭', color: 'text-black' },
    { label: 'P.P.R Metalica', icon: '―', color: 'text-black' },
    { label: 'P.P.R Acrilica', icon: '=', color: 'text-black' },
    { label: 'P.Total', icon: '≈', color: 'text-black' },
    { label: 'Normal', icon: '☑', color: 'text-green-500' },
    { label: 'Dientes en mal estado', icon: '●', color: 'text-yellow-500' },
  ];

  return (
    <div className="odontograma-container">
      <h2 className="odontograma-title">Odontograma Adultos</h2>
      
      <div className="seccion-titulo">Dientes Superiores</div>
      <div className="dientes-grid">
                      {dientesSuperioresArray.map((diente) => (
                <div key={diente}>
                  {renderDiente(
                    diente,
                    diente === 6 || diente === 11
                      ? 'https://cdn-icons-png.flaticon.com/512/91/91154.png'
                      : diente === 1 || diente === 2 || diente === 3 || diente === 14 || diente === 15 || diente === 16
                      ? 'https://cdn-icons-png.flaticon.com/512/91/91159.png'
                      : 'https://cdn-icons-png.flaticon.com/512/91/91162.png',
                    true
                  )}
                </div>
              ))}
      </div>

      <div className="seccion-titulo">Dientes Inferiores</div>
      <div className="dientes-grid">
                      {dientesInferioresArray.map((diente) => (
                <div key={diente}>
                  {renderDiente(
                    diente,
                    diente === 22 || diente === 27
                      ? 'https://cdn-icons-png.flaticon.com/512/91/91154.png'
                      : diente === 17 || diente === 18 || diente === 19 || diente === 30 || diente === 31 || diente === 32
                      ? 'https://cdn-icons-png.flaticon.com/512/91/91159.png'
                      : 'https://cdn-icons-png.flaticon.com/512/91/91162.png',
                    false
                  )}
                </div>
              ))}
      </div>

      <div className="leyenda-container">
        {menuOptions.map((option) => (
          <div key={option.label} className="leyenda-item">
            <span className={`${option.color} text-xl`}>{option.icon}</span>
            <span>{option.label}</span>
          </div>
        ))}
      </div>

      <div className="contador-container">
        {[
          'Ausente',
          'Cariada por opturar', 
          'Por extraer',
          'Fracturada',
          'Corona',
          'ObturacionEfectuada',
          'Puente',
          'P.P.R Metalica',
          'P.P.R Acrilica',
          'P.Total',
          'Normal',
          'Dientes en mal estado'
        ].map((key) => (
          <div key={key}>
            {renderInput(key)}
          </div>
        ))}
      </div>

      <div className="observaciones-container">
        <div className="observaciones-section">
          <label className="observaciones-label">Observaciones:</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="observaciones-textarea"
            rows="3"
          />
        </div>
        
        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={noPasoExamen}
              onChange={(e) => setNoPasoExamen(e.target.checked)}
              className="checkbox-input"
            />
            NO PASO EXAMEN ODONTOLOGICO
          </label>
        </div>

        <div className="botones-container">
          <button
            onClick={handleAgregarActualizar}
            className="btn-agregar"
          >
            <FontAwesomeIcon icon={faPlus} className="btn-icon" />
            <FontAwesomeIcon icon={faFileAlt} className="btn-icon" />
            Agregar/Actualizar
          </button>
          
          <button
            onClick={handleLimpiar}
            className="btn-limpiar"
          >
            <FontAwesomeIcon icon={faBroom} className="btn-icon" />
            Limpiar
          </button>
          
          <button
            onClick={handleVerHistorial}
            className="btn-historial"
          >
            <FontAwesomeIcon icon={faHistory} className="btn-icon" />
            Ver Historial
          </button>
        </div>
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
        >
          {menuOptions.map((option) => (
            <div
              key={option.label}
              className="context-menu-item"
              onClick={() => handleOptionClick(option.label)}
            >
              <span className={`${option.color} text-xl`}>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OdontogramaAdultos;
