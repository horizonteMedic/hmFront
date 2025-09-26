import { useState } from "react";

export default function MedicoSearch({ 
  value, 
  onChange, 
  MedicosMulti, 
  className = "border rounded px-2 py-1 w-full",
  label = "Medico que Certifica:",
  placeholder = ""
}) {
  const [filteredNombresMedicos, setFilteredNombresMedicos] = useState([]);

  const handleNombreMedicoSearch = (e) => {
    const v = e.target.value.toUpperCase();
    const filtered = v
      ? MedicosMulti.filter((medico) =>
          medico.mensaje.toLowerCase().includes(v.toLowerCase())
        )
      : [];
    
    setFilteredNombresMedicos(filtered);
    // Call onChange with event object structure that handleChange expects
    onChange({
      target: {
        name: 'nombre_medico',
        value: v
      }
    });
  };

  const handleSelectNombreMedico = (medico) => {
    setFilteredNombresMedicos([]);
    // Call onChange with event object structure that handleChange expects
    onChange({
      target: {
        name: 'nombre_medico',
        value: medico.mensaje
      }
    });
  };

  return (
    <div>
      <label className="block font-semibold mb-1">
        {label}
      </label>
      <div className="relative flex-grow flex items-center">
        <input
          id="nombre_medico"
          name="nombre_medico"
          type="text"
          autoComplete="off"
          value={value || ""}
          onChange={handleNombreMedicoSearch}
          className={className}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              filteredNombresMedicos.length > 0
            ) {
              e.preventDefault();
              handleSelectNombreMedico(filteredNombresMedicos[0]);
            }
          }}
          onFocus={() => {
            if (value) {
              setFilteredNombresMedicos(
                MedicosMulti.filter((emp) =>
                  emp.mensaje
                    .toLowerCase()
                    .includes(value.toLowerCase())
                )
              );
            }
          }}
          onBlur={() =>
            setTimeout(
              () => setFilteredNombresMedicos([]),
              100
            )
          }
        />
        {value && filteredNombresMedicos.length > 0 && (
          <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded max-h-40 overflow-y-auto z-10">
            {filteredNombresMedicos.map((medico) => (
              <li
                key={medico.id}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                onMouseDown={() => handleSelectNombreMedico(medico)}
              >
                {medico.mensaje}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}