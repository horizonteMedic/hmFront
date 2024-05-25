import React from 'react';

const PorcentajeCarga = ({ porcentaje }) => {
  return (
    <div className="p-2 text-center">
      {porcentaje ? `Datos cargados: ${porcentaje}%` : ''}
    </div>
  );
};

export default PorcentajeCarga;
