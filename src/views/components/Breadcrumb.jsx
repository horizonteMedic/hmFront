import React from 'react';
import { useLocation, Link } from 'react-router-dom';

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
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
            <Link
              to={`/${paths.slice(0, index + 1).join('/')}`}
              className={`${
                index === paths.length - 1 ? 'font-semibold' : 'text-gray-500'
              }`}
            >
              {index === paths.length - 1 ? path : path + ' / '}
            </Link>
            {index < paths.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
