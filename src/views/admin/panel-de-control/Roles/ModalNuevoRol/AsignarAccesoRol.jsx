import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCogs, faFileAlt, faBuilding, faLock, faList, faTentArrowDownToLine, faHandshake, faNotesMedical } from '@fortawesome/free-solid-svg-icons';

const iconMapping = {
  'Sistema': faCogs,
  'Roles': faUser,
  'Accesos': faLock,
  'Reportes': faFileAlt,
  'Matriz Postulante': faList,
  'Configuración': faCogs,
  'Lista de Archivos': faFileAlt,
  'Administrar Sedes': faTentArrowDownToLine,
  'Agregar Campaña': faNotesMedical,
  'Administrar Empresas': faBuilding,
  'Administrar Contratas': faHandshake
};

const ArrowIcon = ({ isOpen, toggle }) => {
  return (
    <svg
      className="w-4 h-4 ml-1 cursor-pointer"
      onClick={toggle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isOpen ? (
        <polyline points="6 9 12 15 18 9" />
      ) : (
        <polyline points="18 15 12 9 6 15" />
      )}
    </svg>
  );
};

const TreeNode = ({ node, isParent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckbox = (e) => {
    // Handle checkbox logic here
    e.stopPropagation(); // Prevent parent node from toggling
  };

  return (
    <div className={`mt-2 mb-2 ${isParent ? '' : ''}`}>
      <div className="flex items-center">
        <ArrowIcon isOpen={isOpen} toggle={handleToggle} />
        <button
          className={`ml-1 ${isParent ? 'btn-azul text-white' : 'btn-naranja text-white'} hover:bg-blue-600 px-2 py-1 rounded`}
          onClick={handleToggle}
          style={{ backgroundColor: isParent ? '#233245 '  : '#fc6b03' }}
        >
          <FontAwesomeIcon icon={iconMapping[node.label]} className="mr-1" />
          {node.label}
        </button>
        <input
          type="checkbox"
          className="ml-auto pointer"
          onClick={handleCheckbox}
        />
      </div>
      {isOpen && (
        <div style={{ marginLeft: 20 }}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} isParent={false} />
          ))}
        </div>
      )}
    </div>
  );
};

const MyTreeView = ({ closeModal }) => {
  const treeData = [
    {
      id: 1,
      label: 'Sistema',
      children: [
        {
          id: 2,
          label: 'Roles',
          children: [],
        },
        {
          id: 3,
          label: 'Accesos',
          children: [],
        },
        {
          id: 4,
          label: 'Reportes',
          children: [],
        },
        {
          id: 5,
          label: 'Matriz Postulante',
          children: [],
        },
      ],
    },
    {
      id: 6,
      label: 'Configuración',
      children: [
        {
          id: 7,
          label: 'Lista de Archivos',
          children: [],
        },
        {
          id: 8,
          label: 'Administrar Sedes',
          children: [],
        },
        {
          id: 9,
          label: 'Agregar Campaña',
          children: [],
        },
        {
          id: 10,
          label: 'Administrar Empresas',
          children: [],
        },
        {
          id: 11,
          label: 'Administrar Contratas',
          children: [],
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md">
        <div className="px-4 py-2 flex justify-between bg-gray-200">
          <h2 className="text-lg font-semibold">Asignar Acceso</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
            Cerrar
          </button>
        </div>
        <div className="p-4">
          <div className="modal-body relative">
            <div className="tree smart-form">
              <ul role="tree">
                {treeData.map((node) => (
                  <TreeNode key={node.id} node={node} isParent={true} />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 flex justify-end bg-gray-200">
          <button className="px-4 py-2 azul-btn rounded-md">Asignar</button>
        </div>
      </div>
    </div>
  );
};

export default MyTreeView;
