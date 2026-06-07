import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Componente para mostrar y gestionar una lista de diagnósticos CIE10.
 * @param {Object} props - Propiedades del componente
 * @param {string} props.value - Cadena con los diagnósticos separados por " | " o saltos de línea
 * @param {function} props.onChange - Función para actualizar el valor en el formulario
 * @param {string} [props.label="Diagnósticos CIE10"] - Etiqueta para el campo
 * @param {string} [props.delimiter=" | "] - Separador de los diagnósticos en la cadena
 */
const CIE10List = ({ 
  value, 
  onChange, 
  label = "Diagnósticos CIE10", 
  delimiter = " | " 
}) => {
  // Función para parsear la cadena en un array de objetos { codigo, descripcion }
  const parseDiagnosticos = (str) => {
    if (!str || str.trim() === "") return [];
    
    // Primero normalizamos los saltos de línea al delimitador
    const normalized = str.replace(/\n/g, delimiter);
    const items = normalized.split(delimiter).filter(item => item.trim() !== "");
    
    return items.map(item => {
      const match = item.match(/CIE 10: ([A-Za-z0-9.]+) - (.+)/i);
      if (match) {
        return {
          codigo: match[1],
          descripcion: match[2]
        };
      }
      // Si no coincide el patrón, tratamos de extraer código y descripción
      const parts = item.split(" - ");
      if (parts.length >= 2) {
        return {
          codigo: parts[0].replace(/CIE 10:\s*/i, ""),
          descripcion: parts.slice(1).join(" - ")
        };
      }
      return {
        codigo: item,
        descripcion: item
      };
    });
  };

  // Parseamos el valor a un array
  const diagnosticos = parseDiagnosticos(value);

  // Función para convertir el array de vuelta a una cadena
  const stringifyDiagnosticos = (arr) => {
    return arr
      .map(item => `CIE 10: ${item.codigo} - ${item.descripcion}`)
      .join(delimiter);
  };

  // Función para eliminar un diagnóstico
  const eliminarDiagnostico = (index) => {
    const nuevosDiagnosticos = diagnosticos.filter((_, i) => i !== index);
    onChange(stringifyDiagnosticos(nuevosDiagnosticos));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {diagnosticos.length === 0 ? (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-center text-gray-500 text-sm">
          No hay diagnósticos seleccionados
        </div>
      ) : (
        <div className="space-y-1">
          {diagnosticos.map((item, index) => (
            <div
              key={`${item.codigo}-${index}`}
              className="flex items-center gap-3 p-1 bg-green-50 border border-green-200 rounded-md"
            >
              <span className="text-sm font-mono font-bold text-green-700 bg-green-100 px-2 py-1 rounded shrink-0">
                {item.codigo}
              </span>
              <span className="text-sm text-green-800 flex-1 break-words whitespace-normal leading-tight" title={item.descripcion}>
                {item.descripcion}
              </span>
              <button
                onClick={() => eliminarDiagnostico(index)}
                className="text-red-500 hover:text-red-700 shrink-0 p-1"
                title="Eliminar diagnóstico"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CIE10List;
