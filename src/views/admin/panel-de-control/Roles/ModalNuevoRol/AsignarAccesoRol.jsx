import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCogs, faFileAlt, faBuilding, faLock, faList, faTentArrowDownToLine, faHandshake, faNotesMedical, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getFetch } from '../../getFetch/getFetch';
import { ListViewxRol, NewVistaxRol, DeleteVistaxRol } from '../model/ListViewxRol';
import Swal from 'sweetalert2';
import ModalAsignacionesSub from './modalasiganacionessub';

const iconMapping = {
  'Sistema': faCogs,
  'Menú de Roles': faUser,
  'Menú de Accesos': faLock,
  'Reportes': faFileAlt,
  'Matriz Postulante': faList,
  'Configuracion': faCogs,
  'Administrar Archivos': faFileAlt,
  'Administrar Sedes': faTentArrowDownToLine,
  'Agregar Campaña': faNotesMedical,
  'Administrar Empresas': faBuilding,
  'Administrar Contratas': faHandshake
};

const ArrowIcon = ({ isOpen, toggle }) => {
  return (
    <svg
      className="w-6 h-6 ml-2 cursor-pointer transform transition-transform duration-300"
      onClick={toggle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: 'transform 0.3s ease' }}
    >
      {isOpen ? (
        <polyline points="6 9 12 15 18 9" />
      ) : (
        <polyline points="18 15 12 9 6 15" />
      )}
    </svg>
  );
};

const TreeNode = ({ node, isParent, asigned, ID_ROL, userlogued, token, Refresgpag }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [idAsignation, setIdAsignation] = useState('');
  const [showSubModal, setShowSubModal] = useState(false);
  const [accionesSeleccionadas, setAccionesSeleccionadas] = useState([]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const assignedNode = asigned.find(item => item.id_opcion_interfaz === node.id);
    setIsChecked(assignedNode ? true : false);
    setIdAsignation(assignedNode ? assignedNode.id : '');
  }, [node.id, asigned]);

  const handleCheckboxChange = () => {
    if (isChecked) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas quitar esta vista al Rol?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: {
          popup: 'swal2-popup-custom',
          confirmButton: 'swal2-confirm-custom',
          cancelButton: 'swal2-cancel-custom'
        },
        backdrop: `rgba(44,62,80,0.7)`
      }).then((result) => {
        if (result.isConfirmed) {
          DeleteVistaxRol(idAsignation, token)
            .then(() => {
              Swal.fire({
                title: '¡Eliminado!',
                text: 'Se ha quitado la asignación.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#f8f9fa',
                color: '#233245'
              });
              setIsChecked(false);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });
    } else {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas asignar esta vista a este Rol?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#233245',
        cancelButtonColor: '#fc6b03',
        confirmButtonText: 'Sí, asignar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: {
          popup: 'swal2-popup-custom',
          confirmButton: 'swal2-confirm-custom',
          cancelButton: 'swal2-cancel-custom'
        },
        backdrop: `rgba(44,62,80,0.7)`
      }).then((result) => {
        if (result.isConfirmed) {
          const datos = {
            descripcion: `Acceso a ${node.label}`,
            id_rol: ID_ROL,
            id_opcion_interfaz: node.id
          };
          NewVistaxRol(datos, userlogued, token)
            .then(() => {
              Swal.fire({
                title: '¡Asignado!',
                text: 'Se ha asignado correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#f8f9fa',
                color: '#233245'
              });
              setIsChecked(true);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });
    }
  };

  const handleSubModalOpen = (e) => {
    e.stopPropagation();
    setShowSubModal(true);
  };

  const handleSubModalClose = () => {
    setShowSubModal(false);
  };

  const accionesEjemplo = ['Actualizar', 'Eliminar', 'Mostrar'];

  const handleSeleccionAccion = (accion) => {
    setAccionesSeleccionadas((prev) =>
      prev.includes(accion)
        ? prev.filter((a) => a !== accion)
        : [...prev, accion]
    );
  };

  return (
    <div className={`mt-2 mb-2 ${isParent ? '' : ''}`}>
      <div className="flex items-center">
        {node.children && node.children.length > 0 && (
          <ArrowIcon isOpen={isOpen} toggle={handleToggle} />
        )}
        {isParent ? null : <span className="mr-1">-</span>}
        <button
          className={`ml-1 ${isParent ? 'btn-azul text-white' : 'btn-naranja text-white'} hover:bg-blue-600 px-2 py-1 rounded`}
          style={{ backgroundColor: isParent ? '#233245 ' : '#fc6b03' }}
          onClick={isParent ? undefined : handleSubModalOpen}
          type="button"
        >
          {iconMapping[node.label] && (
            <FontAwesomeIcon icon={iconMapping[node.label]} className="mr-1" />
          )}
          {node.label}
        </button>
        <input
          type="checkbox"
          className="ml-auto pointer"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      {isOpen && node.children && node.children.length > 0 && (
        <div style={{ marginLeft: 20 }}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              isParent={false}
              asigned={asigned}
              ID_ROL={ID_ROL}
              userlogued={userlogued}
              token={token}
              Refresgpag={Refresgpag}
            />
          ))}
        </div>
      )}
      {/* Modal para asignar acciones a sub vista */}
      {!isParent && (
        <ModalAsignacionesSub
          open={showSubModal}
          onClose={handleSubModalClose}
          nombre={node.label}
          acciones={accionesEjemplo}
          seleccionadas={accionesSeleccionadas}
          onChangeSeleccion={handleSeleccionAccion}
        />
      )}
    </div>
  );
};

const MyTreeView = ({ closeModal, token, Refresgpag, userlogued, ID_ROL, Nombre }) => {
  const [data, setData] = useState([]);
  const [dataasignacion, setDataasignacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFetch('/api/v01/ct/opcionesInterfaz', token),
      ListViewxRol(ID_ROL, token)
    ])
      .then(([opcionesInterfazResponse, listViewxRolResponse]) => {
        setData(opcionesInterfazResponse);
        setDataasignacion(listViewxRolResponse);
      })
      .catch((error) => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const buildTree = (data, parentId = null) => {
    const items = data
      .filter((item) => item.idPadre === parentId)
      .map((item) => {
        return {
          id: item.id,
          label: item.nombre,
          children: buildTree(data, item.id),
          descripcion: item.descripcion
        };
      });

    // Sort items: items with children first, then items without children
    return items.sort((a, b) => {
      const aHasChildren = a.children && a.children.length > 0;
      const bHasChildren = b.children && b.children.length > 0;
      if (aHasChildren && !bHasChildren) return -1;
      if (!aHasChildren && bHasChildren) return 1;
      return 0;
    });
  };

  const treeData = buildTree(data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
          onClick={closeModal}
        />
        <div className="p azuloscurobackground flex justify-between p-3.5">
          <p className="text-start font-bold color-azul text-white">Asignar vistas a: {Nombre}</p>
        </div>
        <div className="p-4">
          <div
            className="modal-body relative"
            style={{ maxHeight: '400px', overflowY: 'auto' }}
          >
            <div className="tree smart-form">
              <ul role="tree">
                {treeData.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    isParent={true}
                    asigned={dataasignacion}
                    ID_ROL={ID_ROL}
                    userlogued={userlogued}
                    token={token}
                    Refresgpag={Refresgpag}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTreeView;
