export const InputsSelect = (props) => {
    return(
      
        <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="cargo" className="block w-36">{props.title}:</label>
              <select
                id={props.nombre}
                name={props.nombre}
                disabled={props.disabled}
                value={props.value}
                onChange={props.handleChange}
                className="border pointer border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              >
                <option value="">Seleccionar</option>
                {props.Selects.map((option) => (
                  <option key={option.id}>{option.mensaje}</option>
                ))}
              </select>
            </div>
      
    )
  }
  

export const InputsSelect2 = (props) => {
  const options = Array.isArray(props.Selects) ? props.Selects : [];

    return(
      <>
              <label htmlFor="cargo" className="block w-[14em]">{props.title}:</label>
              <select
                id={props.nombre}
                value={props.value}
                disabled={props.disabled}
                name={props.nombre}
                onChange={props.handleChange}
                className="border pointer border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              >
                <option value="">Seleccionar</option>
                {options.map((option) => (
                  <option key={option.id}>{option.mensaje || option.descripcion}</option>
                ))}
              </select>
              </>
    )
  }

export const InputsText = (props) => {
  return (
    <>
      <label>Razón Social:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Seleccione"
          className="w-full border pointer border-gray-300 rounded-md py-2 px-3"
          disabled={!tipo || tipo === 'seleccione'}
        />
        {searchTerm && (
          <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
            {filteredData.map((option, index) => (
              <div
                key={index}
                className="cursor-pointer p-2 hover:bg-gray-200"
                onClick={() => {
                  setRazonSocial(option.razonSocial);
                  setRuc(option.ruc);
                  setSearchTerm('');
                  setFilteredData([]);
                }}
              >
                {option.razonSocial}
              </div>
            ))}
          </div>
        )}
        {razonSocial && (
          <div className="text-sm mt-1">Seleccionado: <strong>{razonSocial}</strong></div>
        )}
    </>
  )
}
