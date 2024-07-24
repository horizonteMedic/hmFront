import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const InputText = (props) => {
    const { label, name, value, handleChange, handleSearch } = props;

    return (
        <div className="h-full">
            <label htmlFor={name} className="font-semibold text-white" style={{ fontSize: '15px' }}>
                {label}:
            </label>
            <div className="relative">
                <input 
                    type="text" 
                    id={name} 
                    name={name} 
                    maxLength={name === 'dni' ? 8 : undefined} 
                    value={value} 
                    onChange={handleChange} 
                    className="text-black form-input border rounded w-full h-10  py-4 px-2" 
                />
                {name === 'dni' && (
                    <button 
                        onClick={handleSearch} 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-[8px] rounded-lg azuloscurobackground text-white flex items-center space-x-2"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                )}
            </div>
        </div>
    );
};

export const InputSelect = (props) => {
    const { label, name, value, handleChange, selected } = props;
    console.log(value)
    return (
        <div className="h-full">
            <label htmlFor={name} className="font-semibold text-white" style={{ fontSize: '15px' }}>
                {label}:
            </label>
            <select 
                id={name} 
                name={name} 
                value={value} 
                onChange={handleChange} 
                className="text-black form-select cursor-pointer p-1 py-2 px-2 border rounded w-full"
            >
                <option value="">Seleccione</option>
                {name === 'sexo' && (
                    <>
                        <option value="F">Femenino</option>
                        <option value="M">Masculino</option>
                    </>
                )}
                {name === 'estadoCivil' && (
                    <>
                        <option value="SOLTERO">Soltero</option>
                        <option value="CASADO">Casado</option>
                        <option value="VIUDO">Viudo</option>
                        <option value="CONVIVIENTE">Conviviente</option>
                        <option value="SEPARADO">Separado</option>
                        <option value="DIVORCIADO">Divorciado</option>
                    </>
                )}
                {name !== 'sexo' && name !== 'estadoCivil' && selected.map(option => (
                    <option 
                        key={option.id} 
                        value={name === 'departamento' || name === 'provincia' || name === 'distrito' ? JSON.stringify(option) : option.descripcion}
                    >
                        {option.descripcion || option.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export const InputSearch = (props) => {
    const { label, name, value, handleChange, searchTerm, selected, handleSelectProfesion, selectedProfesion } = props;
   
    return (
        <div className="h-full">
            <label htmlFor={name} className="font-semibold text-white" style={{ fontSize: '15px' }}>
                {label}:
            </label>
            <div className="relative">
                <input 
                    type="text" 
                    id={name} 
                    name={name} 
                    value={value} 
                    autoComplete='off'
                    onChange={handleChange} 
                    className="text-black form-input border rounded w-full h-10  py-4 px-2" 
                />
                {searchTerm && (
                    <div className="border border-gray-300 bg-white rounded-md mt-1 max-h-48 overflow-y-auto">
                    {selected.map((option, index) => (
                        <div
                        key={index}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                        onClick={() => handleSelectProfesion(option)}
                        >
                        {option.descripcion}
                        </div>
                    ))}
                    </div>
                )}
            </div>
            {selectedProfesion  && (
                <div className="text-sm mt-1 flex items-center justify-center text-white">
                    Seleccionado: <strong>{selectedProfesion}</strong>
                </div>
                )}
        </div>
    )
}