import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronDown, 
    faChevronRight, 
    faFolder, 
    faFile, 
    faTimes, 
    faCheck,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Función para obtener colores según el nivel jerárquico (reutilizada del componente principal)
const getHierarchyColors = (level, hasChildren) => {
    const colorSchemes = [
        {
            bg: 'bg-slate-800',
            bgHover: 'hover:bg-slate-700',
            text: 'text-white',
            icon: 'text-blue-300',
            border: 'border-slate-600'
        },
        {
            bg: 'bg-slate-600',
            bgHover: 'hover:bg-slate-500',
            text: 'text-white',
            icon: 'text-blue-200',
            border: 'border-slate-400'
        },
        {
            bg: 'bg-slate-400',
            bgHover: 'hover:bg-slate-300',
            text: 'text-slate-900',
            icon: 'text-blue-600',
            border: 'border-slate-300'
        },
        {
            bg: 'bg-slate-200',
            bgHover: 'hover:bg-slate-100',
            text: 'text-slate-800',
            icon: 'text-blue-500',
            border: 'border-slate-200'
        }
    ];

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

// Función para verificar si un elemento es descendiente de otro
const isDescendant = (potentialChild, potentialParent, allItems) => {
    if (!potentialChild || !potentialParent) return false;
    
    let currentItem = potentialChild;
    while (currentItem && currentItem.idPadre !== null) {
        if (currentItem.idPadre === potentialParent.id) {
            return true;
        }
        currentItem = allItems.find(item => item.id === currentItem.idPadre);
    }
    return false;
};

// Componente para un elemento individual del árbol en el modal
const ModalTreeItem = ({ 
    item, 
    children, 
    level = 0, 
    onItemSelect, 
    selectedItem, 
    currentItem,
    allItems,
    isDisabled 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = children && children.length > 0;
    const colors = getHierarchyColors(level, hasChildren);
    const isSelected = selectedItem && selectedItem.id === item.id;
    
    // Verificar si este elemento debe estar deshabilitado
    const isCurrentParent = currentItem.idPadre === item.id;
    const shouldDisable = isDisabled || 
        item.id === currentItem.id 
        // ||  isCurrentParent ||
        // isDescendant(currentItem, item, allItems);

    // Función para obtener el mensaje de error apropiado
    const getDisabledReason = () => {
        if (item.id === currentItem.id) {
            return "No puedes seleccionar el mismo elemento";
        }
        if (isCurrentParent) {
            return "Este ya es el padre actual";
        }
        if (isDescendant(currentItem, item, allItems)) {
            return "No puedes seleccionar un descendiente";
        }
        return "";
    };

    const toggleExpanded = (e) => {
        e.stopPropagation();
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };

    const handleItemClick = (e) => {
        e.stopPropagation();
        if (!shouldDisable) {
            onItemSelect(item);
        }
    };

    const getIndentStyle = () => ({
        paddingLeft: `${level * 24}px`
    });

    return (
        <div className="select-none">
            <div
                className={`flex items-center py-2 px-3 transition-all duration-200 border-l-4 ${
                    shouldDisable 
                        ? 'cursor-not-allowed opacity-50 bg-gray-100 border-gray-300' 
                        : `cursor-pointer ${
                            isSelected 
                                ? 'bg-blue-100 border-blue-500' 
                                : colors.bg
                        } ${
                            isSelected 
                                ? 'hover:bg-blue-200' 
                                : colors.bgHover
                        } ${
                            isSelected 
                                ? 'border-blue-500' 
                                : colors.border
                        }`
                } ${
                    isSelected 
                        ? 'text-blue-900' 
                        : shouldDisable 
                            ? 'text-gray-400' 
                            : colors.text
                } ${hasChildren ? 'font-semibold' : 'font-normal'}`}
                style={getIndentStyle()}
                onClick={handleItemClick}
            >
                <div className="flex items-center min-w-0 flex-1">
                    {hasChildren ? (
                        <div
                            onClick={toggleExpanded}
                            className={`flex items-center p-1 rounded transition-colors duration-200 ${
                                shouldDisable 
                                    ? 'cursor-not-allowed' 
                                    : 'cursor-pointer hover:bg-black hover:bg-opacity-10'
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={isExpanded ? faChevronDown : faChevronRight}
                                className={`h-3 w-3 mr-2 flex-shrink-0 transition-transform duration-200 ${
                                    isSelected 
                                        ? 'text-blue-600' 
                                        : shouldDisable 
                                            ? 'text-gray-300' 
                                            : colors.icon
                                }`}
                            />
                        </div>
                    ) : (
                        <div className="w-5 mr-2 flex-shrink-0"></div>
                    )}

                    <FontAwesomeIcon
                        icon={hasChildren ? faFolder : faFile}
                        className={`h-3 w-3 mr-2 flex-shrink-0 ${
                            isSelected 
                                ? 'text-blue-600' 
                                : shouldDisable 
                                    ? 'text-gray-300' 
                                    : colors.icon
                        }`}
                    />

                    <span className="truncate text-sm">
                        {item.nombre}
                    </span>

                    {shouldDisable && (
                        <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="h-3 w-3 ml-2 text-red-400 flex-shrink-0"
                            title={getDisabledReason()}
                        />
                    )}
                </div>

                {item.rutaVista && (
                    <span className={`text-xs ml-2 flex-shrink-0 opacity-70 ${
                        isSelected 
                            ? 'text-blue-700' 
                            : shouldDisable 
                                ? 'text-gray-400' 
                                : colors.text
                    }`}>
                        {item.rutaVista}
                    </span>
                )}
            </div>

            {hasChildren && (
                <div
                    className={`transition-all duration-200 ${
                        isExpanded ? 'block' : 'hidden'
                    }`}
                >
                    <div className="border-l-2 border-gray-200 ml-4">
                        {children.map(child => (
                            <ModalTreeNode
                                key={child.item.id}
                                node={child}
                                level={level + 1}
                                onItemSelect={onItemSelect}
                                selectedItem={selectedItem}
                                currentItem={currentItem}
                                allItems={allItems}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para un nodo del árbol en el modal
const ModalTreeNode = ({ node, level, onItemSelect, selectedItem, currentItem, allItems }) => {
    return (
        <ModalTreeItem
            item={node.item}
            children={node.children}
            level={level}
            onItemSelect={onItemSelect}
            selectedItem={selectedItem}
            currentItem={currentItem}
            allItems={allItems}
        />
    );
};

// Componente principal del modal
const ChangeParentModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    currentItem, 
    treeData, 
    allItems 
}) => {
    const [selectedNewParent, setSelectedNewParent] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedNewParent(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleItemSelect = (item) => {
        setSelectedNewParent(item);
    };

    const handleConfirm = () => {
        if (selectedNewParent) {
            onConfirm(currentItem, selectedNewParent);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedNewParent(null);
        onClose();
    };

    // Agregar opción "Sin padre" (null)
    const rootOption = {
        id: null,
        nombre: "Sin padre (Elemento raíz)",
        nivel: -1,
        idPadre: null,
        rutaVista: null
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header del modal */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-bold text-white truncate">Cambiar Padre</h2>
                        <p className="text-blue-100 text-xs sm:text-sm mt-1 truncate">
                            Elemento actual: <span className="font-semibold">{currentItem.nombre}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="text-white hover:text-blue-200 transition-colors duration-200 ml-4 flex-shrink-0"
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>

                {/* Contenido del modal */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 bg-yellow-50 border-b border-yellow-200">
                        <div className="flex items-center text-yellow-800">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                                No puedes seleccionar el mismo elemento, su padre actual o sus descendientes como nuevo padre.
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {/* Opción "Sin padre" */}
                            <div
                                className={`flex items-center py-3 px-4 transition-all duration-200 border-l-4 cursor-pointer rounded ${
                                    selectedNewParent && selectedNewParent.id === null
                                        ? 'bg-blue-100 border-blue-500 text-blue-900'
                                        : 'bg-green-50 border-green-400 text-green-800 hover:bg-green-100'
                                }`}
                                onClick={() => handleItemSelect(rootOption)}
                            >
                                <FontAwesomeIcon
                                    icon={faFolder}
                                    className={`h-4 w-4 mr-3 ${
                                        selectedNewParent && selectedNewParent.id === null
                                            ? 'text-blue-600'
                                            : 'text-green-600'
                                    }`}
                                />
                                <span className="font-semibold">Sin padre (Elemento raíz)</span>
                            </div>

                            {/* Árbol de elementos */}
                            {treeData.map(node => (
                                <ModalTreeNode
                                    key={node.item.id}
                                    node={node}
                                    level={0}
                                    onItemSelect={handleItemSelect}
                                    selectedItem={selectedNewParent}
                                    currentItem={currentItem}
                                    allItems={allItems}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer del modal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg gap-4 sm:gap-0">
                    <div className="text-sm text-gray-600 order-2 sm:order-1">
                        {selectedNewParent ? (
                            <span className="flex items-center">
                                <FontAwesomeIcon icon={faCheck} className="h-4 w-4 mr-2 text-green-600" />
                                Nuevo padre seleccionado: <span className="font-semibold text-gray-800 ml-1 truncate">
                                    {selectedNewParent.nombre}
                                </span>
                            </span>
                        ) : (
                            <span>Selecciona un nuevo padre para continuar</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 order-1 sm:order-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedNewParent}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                                selectedNewParent
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <FontAwesomeIcon icon={faCheck} className="h-4 w-4 mr-2" />
                            Confirmar Cambio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeParentModal;