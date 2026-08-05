import { faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CIE10 from "../../admin/panel-de-control/SistemaOcupacional/Anexo16/CIE10/CIE10";
import { useEffect, useState } from "react";

/**
 * Componente para mostrar y gestionar una lista de diagnósticos CIE10.
 *
 * Props opcionales de sincronización con un campo externo (ej. textarea "diagnostico"):
 *   setAdditionalForm      – setForm del formulario externo (puede ser el mismo setForm)
 *   additionalFieldName    – nombre del campo externo ("diagnostico")
 *   additionalDelimiter    – separador usado al agregar al campo externo (default "\n")
 *
 * Cuando estas props están presentes:
 *   - Al agregar un CIE10 → se añade la línea al campo externo.
 *   - Al eliminar un CIE10 → se elimina la línea correspondiente del campo externo.
 *   - La sincronización inversa (externo → lista) debe manejarse en el padre
 *     (ver handleDiagnosticoChange en Triaje).
 */
const CIE10List = ({
  value,
  onChange,
  label = "Diagnósticos CIE10",
  delimiter = "\n",
  token,
  setForm,
  fieldName,
  disabled = false,
  allowAdd = true,
  allowRemove = true,
  additionalValue,
  onAdditionalChange,
  setAdditionalForm,
  additionalFieldName,
  additionalDelimiter = "\n",
}) => {
  const handleChange = onChange || ((nuevoValor) => {
    if (setForm && fieldName) {
      setForm(prev => ({ ...prev, [fieldName]: nuevoValor }));
    }
  });

  // Función para parsear la cadena en un array de objetos { codigo, descripcion }
  const parseDiagnosticos = (str) => {
    if (!str || str.trim() === "") return [];
    const normalized = str.replace(/\n/g, delimiter);
    const items = normalized.split(delimiter).filter(item => item.trim() !== "");
    return items.map(item => {
      const match = item.match(/CIE 10: ([A-Za-z0-9.]+) - (.+)/i);
      if (match) return { codigo: match[1], descripcion: match[2] };
      const parts = item.split(" - ");
      if (parts.length >= 2) {
        return {
          codigo: parts[0].replace(/CIE 10:\s*/i, ""),
          descripcion: parts.slice(1).join(" - "),
        };
      }
      return { codigo: item, descripcion: item };
    });
  };

  const [diagnosticos, setDiagnosticos] = useState(() => parseDiagnosticos(value));
  const [valorAnterior, setValorAnterior] = useState(value);

  // Función para manejar la confirmación de diagnósticos (al agregar)
  const handleConfirmCIE10 = (newValue) => {
    const lista = parseDiagnosticos(newValue);
    setDiagnosticos(lista);

    if (newValue !== valorAnterior && setAdditionalForm && additionalFieldName) {
      const listaAnterior = parseDiagnosticos(valorAnterior);
      const codigosAnteriores = new Set(listaAnterior.map(d => d.codigo));
      const nuevosDiagnosticos = lista.filter(d => !codigosAnteriores.has(d.codigo));

      nuevosDiagnosticos.forEach(item => {
        setAdditionalForm(prev => {
          const valorActual = prev[additionalFieldName] || "";
          const separador = valorActual.trim() === "" ? "" : additionalDelimiter;
          const linea = `CIE 10: ${item.codigo} - ${item.descripcion}`;
          return {
            ...prev,
            [additionalFieldName]: valorActual + separador + linea,
          };
        });
      });
    }

    setValorAnterior(newValue);
  };

  // Actualizar el estado si el valor cambia desde fuera del componente
  useEffect(() => {
    const lista = parseDiagnosticos(value);
    setDiagnosticos(lista);
    setValorAnterior(value);
  }, [value]);

  // Función para convertir el array de vuelta a una cadena
  const stringifyDiagnosticos = (arr) =>
    arr.map(item => `CIE 10: ${item.codigo} - ${item.descripcion}`).join(delimiter);

  const copiarDiagnostico = async (item) => {
    const texto = `CIE 10: ${item.codigo} - ${item.descripcion}`;
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = texto;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  // Elimina de la lista y también del campo externo si está configurado
  const eliminarDiagnostico = (index) => {
    const item = diagnosticos[index];
    const nuevosDiagnosticos = diagnosticos.filter((_, i) => i !== index);
    handleChange(stringifyDiagnosticos(nuevosDiagnosticos));

    if (setAdditionalForm && additionalFieldName) {
      setAdditionalForm(prev => {
        const valorActual = prev[additionalFieldName] || "";
        const patronBusqueda = `CIE 10: ${item.codigo} - ${item.descripcion}`;
        const lineas = valorActual
          .split("\n")
          .filter(linea => linea.trim().toUpperCase() !== patronBusqueda.toUpperCase());
        return { ...prev, [additionalFieldName]: lineas.join("\n") };
      });
    }
  };

  const isAddDisabled = disabled || !allowAdd;
  const isRemoveDisabled = disabled || !allowRemove;

  return (
    <div className="space-y-2">
      <div className="flex justify-between w-full">
        <label className="block font-semibold">{label} :</label>
        {!isAddDisabled && (
          <CIE10
            token={token}
            setForm={setForm}
            fieldName={fieldName}
            inputType="multiple"
            containerClassName="mr-2"
            isIcon
            value={value}
            onConfirm={handleConfirmCIE10}
          />
        )}
      </div>
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
              <span
                className="text-sm text-green-800 flex-1 break-words whitespace-normal leading-tight"
                title={item.descripcion}
              >
                {item.descripcion}
              </span>
              {!isRemoveDisabled && (
                <>
                  <button
                    type="button"
                    onClick={() => copiarDiagnostico(item)}
                    className="text-blue-500 hover:text-blue-700 shrink-0 pr-1"
                    title="Copiar diagnóstico"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarDiagnostico(index)}
                    className="text-red-500 hover:text-red-700 shrink-0 pr-2"
                    title="Eliminar diagnóstico"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CIE10List;
