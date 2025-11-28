import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faFile, faPlus, faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../hooks/useSessionData';
 
import AddChildModal from './AddChildModal';
import { 
    obtenerOpcionesInterfaz, 
    registrarOpcionInterfaz, 
    actualizarOpcionInterfaz,
    eliminarOpcionInterfaz,
    prepararDatosNuevaOpcion,
    prepararDatosActualizacionOpcion
} from './controllerGestion.jsx';

// Función para obtener colores según el nivel jerárquico
const getHierarchyColors = (level, hasChildren) => {
    const colorSchemes = [
        // Nivel 0 - Raíz (más oscuro)
        {
            bg: 'bg-slate-800',
            bgHover: 'hover:bg-slate-700',
            text: 'text-white',
            icon: 'text-blue-300',
            border: 'border-slate-600'
        },
        // Nivel 1 - Segundo nivel
        {
            bg: 'bg-slate-600',
            bgHover: 'hover:bg-slate-500',
            text: 'text-white',
            icon: 'text-blue-200',
            border: 'border-slate-400'
        },
        // Nivel 2 - Tercer nivel
        {
            bg: 'bg-slate-400',
            bgHover: 'hover:bg-slate-300',
            text: 'text-slate-900',
            icon: 'text-blue-600',
            border: 'border-slate-300'
        },
        // Nivel 3+ - Niveles más profundos (más claro)
        {
            bg: 'bg-slate-200',
            bgHover: 'hover:bg-slate-100',
            text: 'text-slate-800',
            icon: 'text-blue-500',
            border: 'border-slate-200'
        }
    ];

    // Si no tiene hijos, usar colores más suaves
    if (!hasChildren) {
        const leafColors = [
            {
                bg: 'bg-gray-100',
                bgHover: 'hover:bg-gray-50',
                text: 'text-gray-700',
                icon: 'text-gray-400',
                border: 'border-gray-200'
            },
            {
                bg: 'bg-gray-50',
                bgHover: 'hover:bg-white',
                text: 'text-gray-600',
                icon: 'text-gray-400',
                border: 'border-gray-100'
            },
            {
                bg: 'bg-white',
                bgHover: 'hover:bg-gray-50',
                text: 'text-gray-600',
                icon: 'text-gray-400',
                border: 'border-gray-100'
            },
            {
                bg: 'bg-white',
                bgHover: 'hover:bg-gray-50',
                text: 'text-gray-500',
                icon: 'text-gray-300',
                border: 'border-gray-50'
            }
        ];
        return leafColors[Math.min(level, leafColors.length - 1)];
    }

    return colorSchemes[Math.min(level, colorSchemes.length - 1)];
};

// Componente para un elemento individual del árbol
const TreeItem = ({ item, children, level = 0, onItemSelect, selectedItem, onDragStartItem, onDropOnItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = children && children.length > 0;
    const colors = getHierarchyColors(level, hasChildren);
    const isSelected = selectedItem && selectedItem.id === item.id;

    const toggleExpanded = (e) => {
        e.stopPropagation();
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };

    const handleItemClick = (e) => {
        e.stopPropagation();
        onItemSelect(item);
    };

    const getIndentStyle = () => ({
        paddingLeft: `${level * 24}px`
    });

    return (
        <div className="select-none">
            <div
                className={`flex items-center py-3 px-4 transition-all duration-300 ease-in-out border-l-4 cursor-pointer ${isSelected ? 'bg-blue-100 border-blue-500' : colors.bg
                    } ${isSelected ? 'hover:bg-blue-200' : colors.bgHover} ${isSelected ? 'border-blue-500' : colors.border
                    } ${isSelected ? 'text-blue-900' : colors.text} ${hasChildren ? 'font-semibold' : 'font-normal'
                    }`}
                style={getIndentStyle()}
                onClick={handleItemClick}
                draggable
                onDragStart={() => onDragStartItem(item)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onDropOnItem(item); }}
            >
                <div className="flex items-center min-w-0 flex-1">
                    {hasChildren ? (
                        <div
                            onClick={toggleExpanded}
                            className="flex items-center cursor-pointer p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
                        >
                            <FontAwesomeIcon
                                icon={isExpanded ? faChevronDown : faChevronRight}
                                className={`h-4 w-4 mr-3 flex-shrink-0 transition-transform duration-300 ease-in-out ${isSelected ? 'text-blue-600' : colors.icon
                                    } ${isExpanded ? 'transform rotate-0' : 'transform rotate-0'}`}
                            />
                        </div>
                    ) : (
                        <div className="w-7 mr-3 flex-shrink-0"></div>
                    )}

                    <FontAwesomeIcon
                        icon={hasChildren ? faFolder : faFile}
                        className={`h-4 w-4 mr-3 flex-shrink-0 ${isSelected ? 'text-blue-600' : colors.icon}`}
                    />

                    <span className="truncate text-sm">
                        {item.nombre}
                    </span>
                </div>

                {item.rutaVista && (
                    <span className={`text-xs ml-2 flex-shrink-0 opacity-70 ${isSelected ? 'text-blue-700' : colors.text}`}>
                        {item.rutaVista}
                    </span>
                )}
            </div>

            {hasChildren && (
                <div
                    className={`transition-all duration-300 ease-in-out ${isExpanded ? 'block' : 'hidden'
                        }`}
                    style={{
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                >
                    <div className="border-l-2 border-gray-300 ml-6">
                        {children.map(child => (
                            <TreeNode
                                key={child.item.id}
                                node={child}
                                level={level + 1}
                                onItemSelect={onItemSelect}
                                selectedItem={selectedItem}
                                onDragStartItem={onDragStartItem}
                                onDropOnItem={onDropOnItem}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para un nodo del árbol (wrapper que incluye hijos)
const TreeNode = ({ node, level, onItemSelect, selectedItem, onDragStartItem, onDropOnItem }) => {
    return (
        <TreeItem
            item={node.item}
            children={node.children}
            level={level}
            onItemSelect={onItemSelect}
            selectedItem={selectedItem}
            onDragStartItem={onDragStartItem}
            onDropOnItem={onDropOnItem}
        />
    );
};

// Función para construir el árbol jerárquico
const buildTree = (items) => {
    const itemMap = {};
    const tree = [];

    // Crear un mapa de todos los elementos
    items.forEach(item => {
        itemMap[item.id] = {
            item,
            children: []
        };
    });

    // Construir la jerarquía
    items.forEach(item => {
        if (item.idPadre === null) {
            // Es un elemento raíz
            tree.push(itemMap[item.id]);
        } else {
            // Es un hijo, agregarlo al padre
            const parent = itemMap[item.idPadre];
            if (parent) {
                parent.children.push(itemMap[item.id]);
            }
        }
    });

    // Ordenar por nivel y nombre
    const sortTree = (nodes) => {
        nodes.sort((a, b) => {
            if (a.item.nivel !== b.item.nivel) {
                return a.item.nivel - b.item.nivel;
            }
            return a.item.nombre.localeCompare(b.item.nombre);
        });

        nodes.forEach(node => {
            if (node.children.length > 0) {
                sortTree(node.children);
            }
        });
    };

    sortTree(tree);
    return tree;
};

const isDescendant = (potentialChild, potentialParent, allItems) => {
    if (!potentialChild || !potentialParent) return false;
    let currentItem = potentialChild;
    while (currentItem && currentItem.idPadre !== null) {
        if (currentItem.idPadre === potentialParent.id) {
            return true;
        }
        currentItem = allItems.find(i => i.id === currentItem.idPadre);
    }
    return false;
};

// Componente del panel de detalles
const DetailsPanel = ({ selectedItem, onItemUpdate, onAddChild, onDelete, data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState(null);

    useEffect(() => {
        if (selectedItem) {
            setEditedItem({ ...selectedItem });
            setIsEditing(false);
        }
    }, [selectedItem]);

    if (!selectedItem) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <FontAwesomeIcon icon={faFile} className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-lg font-medium">Selecciona un elemento</p>
                    <p className="text-sm mt-2">Haz clic en cualquier elemento del árbol para ver sus detalles</p>
                </div>
            </div>
        );
    }

    // Encontrar el nombre del padre
    const parentItem = data.find(item => item.id === selectedItem.idPadre);
    const parentName = parentItem ? parentItem.nombre : 'Sin padre';

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editedItem.nombre.trim() === '') {
            alert('El nombre es requerido');
            return;
        }

        onItemUpdate(editedItem);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedItem({ ...selectedItem });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditedItem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header del panel */}
            <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Panel de Detalles</h2>
                        <h3 className="text-lg text-blue-100 font-semibold">{selectedItem.nombre}</h3>
                    </div>
                    <div className="flex space-x-2">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="flex items-center px-3 py-2 bg-white bg-opacity-20 text-blue-700 rounded-lg hover:bg-opacity-30 transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-2" />
                                Habilitar
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    <FontAwesomeIcon icon={faSave} className="h-4 w-4 mr-2" />
                                    Registrar
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-2" />
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido de detalles */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                    {/* Nombre - Editable */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedItem.nombre}
                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ingrese el nombre"
                            />
                        ) : (
                            <p className="text-gray-900 font-semibold">{selectedItem.nombre}</p>
                        )}
                    </div>

                    {/* Ruta - Editable */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ruta:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedItem.rutaVista || ''}
                                onChange={(e) => handleInputChange('rutaVista', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                placeholder="Ingrese la ruta de vista"
                            />
                        ) : (
                            <p className="text-gray-900 font-mono ">{selectedItem.rutaVista || 'No especificada'}</p>
                        )}
                    </div>

                    {/* Descripción - Editable */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                        {isEditing ? (
                            <textarea
                                value={editedItem.descripcion || ''}
                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Ingrese la descripción"
                            />
                        ) : (
                            <p className="text-gray-900">{selectedItem.descripcion || 'Sin descripción'}</p>
                        )}
                    </div>

                    {/* Estado - Editable */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                        {isEditing ? (
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="estado"
                                        value="true"
                                        checked={editedItem.estado === true}
                                        onChange={(e) => handleInputChange('estado', e.target.value === 'true')}
                                        className="mr-2 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-green-800 font-medium">Habilitado</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="estado"
                                        value="false"
                                        checked={editedItem.estado === false}
                                        onChange={(e) => handleInputChange('estado', e.target.value === 'true')}
                                        className="mr-2 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-red-800 font-medium">Deshabilitado</span>
                                </label>
                            </div>
                        ) : (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedItem.estado === true
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {selectedItem.estado === true ? 'Habilitado' : 'Deshabilitado'}
                            </span>
                        )}
                    </div>

                    {/* Nivel - Solo lectura */}
                    <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nivel: (Solo lectura)</label>
                        <p className="text-gray-600 font-semibold">{selectedItem.nivel}</p>
                    </div>

                    {/* Nombre del Padre - Solo lectura */}
                    <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nombre del Padre: (Solo lectura)</label>
                        <p className="text-gray-600 font-semibold">{parentName}</p>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            {!isEditing && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => onAddChild(selectedItem)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                            <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                            Agregar Hijo
                        </button>

                        <button
                            onClick={() => onDelete(selectedItem)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                        >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-2" />
                            Eliminar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function GestionOpciones() {
    const [treeData, setTreeData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [draggingItem, setDraggingItem] = useState(null);
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [isAddToRoot, setIsAddToRoot] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userlogued,token } = useSessionData();

    // Función para cargar los datos iniciales desde la API
    const cargarDatosIniciales = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const opciones = await obtenerOpcionesInterfaz(token);
            
            if (opciones) {
                setData(opciones);
                const tree = buildTree(opciones);
                setTreeData(tree);
            } else {
                setError('No se pudieron cargar las opciones de interfaz');
            }
        } catch (err) {
            console.error('Error al cargar datos iniciales:', err);
            setError('Error al cargar los datos iniciales');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            cargarDatosIniciales();
        }
    }, [token]);

    const handleItemSelect = (item) => {
        setSelectedItem(item);
    };

    const handleItemUpdate = async (updatedItem) => {
        try {
            // Preparar los datos para la actualización usando la función del controlador
            const datosActualizacion = prepararDatosActualizacionOpcion(
                updatedItem,
                selectedItem,
                userlogued // Usar userlogued en lugar de 'admin'
            );

            // Mostrar en consola el JSON que se enviará
            console.log('JSON que se enviará para editar:', JSON.stringify(datosActualizacion, null, 2));

            // Llamar a la función de actualización del controlador
            const resultado = await actualizarOpcionInterfaz(updatedItem.id, datosActualizacion, token);

            if (resultado) {
                // Si la actualización fue exitosa, actualizar el estado local
                const updatedData = data.map(item =>
                    item.id === updatedItem.id ? { ...updatedItem, ...datosActualizacion } : item
                );

                setData(updatedData);

                // Reconstruir el árbol con los datos actualizados
                const updatedTree = buildTree(updatedData);
                setTreeData(updatedTree);

                // Actualizar el item seleccionado
                setSelectedItem({ ...updatedItem, ...datosActualizacion });

                console.log('Item actualizado exitosamente:', resultado);
            }
        } catch (error) {
            console.error('Error al actualizar el item:', error);
        }
    };

    const handleAddChild = (item) => {
        setIsAddToRoot(false);
        setIsAddChildModalOpen(true);
    };

    const handleAddRoot = () => {
        setIsAddToRoot(true);
        setIsAddChildModalOpen(true);
    };

    const handleChangeParentConfirm = async (currentItem, newParent) => {
        try {
            const updatedItem = {
                ...currentItem,
                idPadre: newParent.id,
                nivel: newParent.id === null ? 0 : newParent.nivel + 1
            };

            const datosActualizacion = prepararDatosActualizacionOpcion(
                updatedItem,
                currentItem,
                userlogued
            );

            console.log('JSON que se enviará para cambiar padre:', JSON.stringify(datosActualizacion, null, 2));

            const resultado = await actualizarOpcionInterfaz(currentItem.id, datosActualizacion, token);

            if (resultado) {
                // Actualización local sin recargar toda la vista
                setData(prev => {
                    const updatedData = prev.map(it => it.id === currentItem.id ? { ...it, ...datosActualizacion } : it);
                    setTreeData(buildTree(updatedData));
                    return updatedData;
                });

                // Mantener el elemento actual seleccionado tras el cambio de padre
                setSelectedItem(prev => {
                    if (!prev) return updatedItem;
                    return prev.id === currentItem.id ? { ...currentItem, ...datosActualizacion } : prev;
                });

                console.log('Padre cambiado exitosamente:', {
                    item: currentItem.nombre,
                    newParent: newParent.nombre,
                    resultado
                });
            }
        } catch (error) {
            console.error('Error al cambiar el padre:', error);
        }
    };

    const handleDragStart = (item) => {
        setDraggingItem(item);
    };

    const handleDropOnItem = async (targetItem) => {
        if (!draggingItem) return;
        if (draggingItem.id === targetItem.id) return;
        if (isDescendant(targetItem, draggingItem, data)) return;
        await handleChangeParentConfirm(draggingItem, targetItem);
        setDraggingItem(null);
    };

    const handleDropToRoot = async () => {
        if (!draggingItem) return;
        await handleChangeParentConfirm(draggingItem, { id: null });
        setDraggingItem(null);
    };

    const handleAddChildConfirm = async (formData) => {
        try {
            const isRoot = isAddToRoot || !selectedItem;
            const datosParaRegistro = prepararDatosNuevaOpcion({
                nombre: formData.nombre,
                rutaVista: formData.rutaVista,
                descripcion: formData.descripcion,
                estado: formData.estado,
                nivel: isRoot ? 0 : (selectedItem.nivel + 1),
                idPadre: isRoot ? null : selectedItem.id
            }, userlogued);

            console.log('JSON que se enviará para crear nuevo hijo:', JSON.stringify(datosParaRegistro, null, 2));

            const resultado = await registrarOpcionInterfaz(datosParaRegistro, token);

            if (resultado) {
                // Agregar el nuevo hijo localmente y mantener el padre seleccionado
                setData(prev => {
                    const updatedData = [...prev, resultado];
                    setTreeData(buildTree(updatedData));
                    return updatedData;
                });

                setSelectedItem(prev => prev);

                console.log('Nuevo hijo registrado exitosamente:', resultado);
            }
        } catch (error) {
            console.error('Error al registrar nuevo hijo:', error);
        }
    };

    const handleCloseAddChildModal = () => {
        setIsAddChildModalOpen(false);
        setIsAddToRoot(false);
    };

    // Función para manejar la eliminación de un elemento
    const handleDelete = async (item) => {
        try {
            const resultado = await eliminarOpcionInterfaz(item.id, token);

            if (resultado) {
                const parentId = item.idPadre;
                const padre = data.find(it => it.id === parentId) || null;

                // Eliminar localmente y reconstruir árbol sin perder el contexto visual
                setData(prev => {
                    const updatedData = prev.filter(it => it.id !== item.id);
                    setTreeData(buildTree(updatedData));
                    return updatedData;
                });

                // Mantener la selección del padre del elemento eliminado
                setSelectedItem(padre);

                console.log('Elemento eliminado exitosamente:', item);
            }
        } catch (error) {
            console.error('Error al eliminar elemento:', error);
        }
    };

    return (
        <div className="flex justify-center w-full px-4">
            <div className="flex w-full  bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Panel izquierdo - Árbol */}
                <div className="w-[500px] flex-shrink-0 border-r border-gray-200">
                    {/* Header */}
                    <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-slate-800 to-slate-700">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold text-white">
                                Gestión de Opciones del Sistema
                            </h1>
                            <button
                                onClick={handleAddRoot}
                                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                                Agregar a raíz
                            </button>
                        </div>
                    </div>

                    {/* Contenido del árbol con dimensiones fijas y scroll mejorado */}
                    <div
                        className="overflow-y-auto overflow-x-hidden"
                        style={{
                            height: '500px',
                            padding: '16px',
                            WebkitOverflowScrolling: 'touch',
                            scrollBehavior: 'smooth'
                        }}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                    <p className="text-lg font-medium">Cargando opciones...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full text-red-500">
                                <div className="text-center">
                                    <FontAwesomeIcon icon={faTimes} className="h-12 w-12 text-red-300 mb-4" />
                                    <p className="text-lg font-medium">Error al cargar datos</p>
                                    <p className="text-sm mt-2">{error}</p>
                                    <button
                                        onClick={cargarDatosIniciales}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            </div>
                        ) : treeData.length > 0 ? (
                            <div className="space-y-1 min-h-full">
                                <div
                                    className="mb-2 p-3 border-2 border-dashed border-gray-300 rounded text-gray-600 text-sm flex items-center justify-center"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => { e.preventDefault(); handleDropToRoot(); }}
                                >
                                    Soltar aquí para asignar a raíz
                                </div>
                                {treeData.map(node => (
                                    <TreeNode
                                        key={node.item.id}
                                        node={node}
                                        level={0}
                                        onItemSelect={handleItemSelect}
                                        selectedItem={selectedItem}
                                        onDragStartItem={handleDragStart}
                                        onDropOnItem={handleDropOnItem}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <FontAwesomeIcon icon={faFolder} className="h-12 w-12 text-gray-300 mb-4" />
                                    <p className="text-lg font-medium">No hay datos disponibles</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer con estadísticas */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="text-xs text-gray-600 flex justify-between items-center">
                            <span className="font-medium">Total: {data.length} elementos</span>
                            <span className="font-medium">
                                {selectedItem ? `Seleccionado: ${selectedItem.nombre}` : 'Ninguno seleccionado'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Panel derecho - Detalles */}
                <div className="flex-1 min-w-0">
                    <DetailsPanel
                        selectedItem={selectedItem}
                        onItemUpdate={handleItemUpdate}
                        onAddChild={handleAddChild}
                        onDelete={handleDelete}
                        data={data}
                    />
                </div>
            </div>

                

            {/* Modal para agregar hijo */}
            <AddChildModal
                isOpen={isAddChildModalOpen}
                onClose={handleCloseAddChildModal}
                onConfirm={handleAddChildConfirm}
                parentItem={isAddToRoot ? null : selectedItem}
                allItems={data}
            />
        </div>
    );
}
