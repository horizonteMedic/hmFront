import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const InputText = (props) => {
    return (
        
            <div className="h-full">
                <label htmlFor={props.name} className=" font-semibold text-white" style={{ fontSize: '15px' }}>{props.name}:</label>
                <input type="text" id={props.name} name={props.name} maxLength={props.name === 'dni' && 8} value={props.value} 
                onChange={props.handleChange} className="text-black form-input border rounded w-full h-10  py-2 px-2" />
                {props.name === 'dni' && <button onClick={props.handleSearch} className='px-4 py-2 rounded-lg azuloscurobackground text-white flex items-center space-x-2'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>}
            </div>
    )
}

export const InputSelect = (props) => {
    console.log(props.selected)
    return (
        
            <div className="h-full">
                <label htmlFor={props.name} className="font-semibold text-white" style={{ fontSize: '15px' }}>{props.name}:</label>
                <select id={props.name} name={props.name} value={props.value} onChange={props.handleChange} className="text-black form-select cursor-pointer p-1  py-2 px-2 border rounded w-full">
                    <option value="">Selecione</option>
                    {props.name === 'sexo' && (<><option value="F">Femenino</option><option value="M">Masculino</option></>)}    
                    {props.name === 'estadoCivil' && (<><option value="SOLTERO">SOLTERO</option>
                        <option value="CASADO">CASADO</option>
                        <option value="VIUDO">VIUDO</option>
                        <option value="CONVIVIENTE">CONVIVIENTE</option>
                        <option value="SEPARADO">SEPARADO</option>
                        <option value="DIVORCIADO">DIVORCIADO</option></>)}
                    {props.name !== 'sexo' && props.name !== 'estadoCivil' && props.selected.map((option) => (
                        <option key={option.id} value={props.name === 'departamento' || props.name === 'provincia' || props.name === 'distrito' ? JSON.stringify(option) : option.descripcion}>{option.descripcion || option.nombre}</option>
                    ))}
                </select>    
            </div>
    )
}