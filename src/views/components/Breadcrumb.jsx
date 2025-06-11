import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PATH_NAMES = {
  'panel-de-control': 'Panel Principal',
  'sistema-ocupacional': 'SistemaOcupacional',
  'laboratorio-clinico': 'Laboratorio Clínico',
  'analisis-bioquimicos': 'Análisis Bioquímicos',
  'admision': 'Admisión',
  'laboratorio': 'Laboratorio',
  'psicologia': 'Psicología',
  'medicina-general': 'Medicina General',
  'rayos-x': 'Rayos X',
  'ekg': 'EKG',
  'espirometria': 'Espirometría',
  'audiometria': 'Audiometría',
  'odontologia': 'Odontología',
  'oftalmologia': 'Oftalmología',
  'coproparasitologico': 'Coproparasitológico',
  // Agrega más según tus rutas
};

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter((path) => path !== '');

  return (
    <nav className="bg-gray-100 py-2 px-4">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link to="/panel-de-control" className="text-gray-500">
            Panel Principal
          </Link>
          <span className="mx-2">/</span>
        </li>
        {paths.map((path, index) => {
          const displayName = PATH_NAMES[path] || decodeURIComponent(path);
          const to = '/' + paths.slice(0, index + 1).join('/');
          return (
            <li key={index} className="flex items-center">
              <Link
                to={to}
                className={`${index === paths.length - 1 ? 'font-semibold' : 'text-gray-500'}`}
              >
                {displayName}
              </Link>
              {index < paths.length - 1 && <span className="mx-2">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
