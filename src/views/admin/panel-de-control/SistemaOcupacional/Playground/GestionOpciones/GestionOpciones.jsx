import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faFile, faPlus, faExchangeAlt, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import data from './obtener.json';
import { useSessionData } from '../../../../../hooks/useSessionData';

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
const TreeItem = ({ item, children, level = 0, onItemSelect, selectedItem }) => {
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
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para un nodo del árbol (wrapper que incluye hijos)
const TreeNode = ({ node, level, onItemSelect, selectedItem }) => {
    return (
        <TreeItem
            item={node.item}
            children={node.children}
            level={level}
            onItemSelect={onItemSelect}
            selectedItem={selectedItem}
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

// Componente del panel de detalles
const DetailsPanel = ({ selectedItem, onItemUpdate, onAddChild, onChangeParent }) => {
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
                    <div className="space-y-3">
                        <button
                            onClick={() => onAddChild(selectedItem)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                            <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                            Agregar Hijo
                        </button>

                        <button
                            onClick={() => onChangeParent(selectedItem)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                            <FontAwesomeIcon icon={faExchangeAlt} className="h-4 w-4 mr-2" />
                            Cambiar Padre
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
    const { token } = useSessionData();

    useEffect(() => {
        const tree = buildTree(data);
        setTreeData(tree);
    }, []);

    const handleItemSelect = (item) => {
        setSelectedItem(item);
    };

    const handleItemUpdate = (updatedItem) => {
        // Actualizar el item en el array de datos
        const updatedData = data.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        );

        // Reconstruir el árbol con los datos actualizados
        const updatedTree = buildTree(updatedData);
        setTreeData(updatedTree);

        // Actualizar el item seleccionado
        setSelectedItem(updatedItem);

        console.log('Item actualizado:', updatedItem);
    };

    const handleAddChild = (item) => {
        // Placeholder para funcionalidad futura
        console.log('Agregar hijo a:', item.nombre);
    };

    const handleChangeParent = (item) => {
        // Placeholder para funcionalidad futura
        console.log('Cambiar padre de:', item.nombre);
    };

    return (
        <div className="flex justify-center w-full min-h-screen bg-gray-50 p-4">
            <div className="flex w-full max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Panel izquierdo - Árbol */}
                <div className="w-[500px] flex-shrink-0 border-r border-gray-200">
                    {/* Header */}
                    <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-slate-800 to-slate-700">
                        <h1 className="text-xl font-bold text-white">
                            Gestión de Opciones del Sistema
                        </h1>
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
                        {treeData.length > 0 ? (
                            <div className="space-y-1 min-h-full">
                                {treeData.map(node => (
                                    <TreeNode
                                        key={node.item.id}
                                        node={node}
                                        level={0}
                                        onItemSelect={handleItemSelect}
                                        selectedItem={selectedItem}
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
                        onChangeParent={handleChangeParent}
                    />
                </div>
            </div>
        </div>
    );
}
