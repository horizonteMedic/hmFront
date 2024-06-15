
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditProtocolos = (props) => {

    const InputsText = (props) => {
        return (
            <>
                <label htmlFor="nombre" className="block font-medium mb-2">
                    {props.label}
                </label>
                <input
                    id="nombre"
                    name={props.name}
                    value={props.value}
                    type="text"
                    className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                />
            </>
        )
    }

    const SelectTables = (props) => {
        console.log(props.list)
        return (
            <>
                <table className="w-full mt-6 border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Nombre</th>
                            <th className="border border-gray-300 px-4 py-2">Precio</th>
                            <th className="border border-gray-300 px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.list.map((option,index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{option.razonSocial || option.Nombre}</td>
                                <td className="border border-gray-300 px-4 py-2">{option.precio || option.Precio}</td>
                                <td className="border border-gray-300 px-4 py-2"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        )
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] md:w-[800px] relative">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="absolute top-0 right-0 m-3 cursor-pointer text-white"
                        onClick={props.setShowEditModal}
                    />
                    <div className="p-3 azuloscurobackground flex justify-between">
                        <h1 className="text-start font-bold color-azul text-white">Servicios Creación y Lista</h1>
                    </div>
                    <div className="container p-4">
                        <InputsText label='Nombre del Protocolo:' name='Protocolo' value={props.protocolo} />
                        <InputsText label='Empresa:' name='Empresa' value={props.empresa} />
                        <div className="flex w-full justify-between gap-10">
                            <div className='flex flex-col w-full mt-4'>
                                <p className="mb-2">Listado de Servicios:</p>
                                <div className="mb-4">
                                    <select
                                        id="servicios"
                                        name="servicios"
                                        
                                        className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Elija sus Servicios</option>
                                        {props.ListServicios.map((option, index) => (
                                            <option key={index} value={JSON.stringify(option)} >{option.nombreServicio}</option>
                                        ))}
                                    </select>
                                </div>
                                <SelectTables list={props.servicio}/>
                            </div>
                            <div className='flex flex-col w-full mt-4'>
                                <p className="mb-2">Listado de Contratas:</p>
                                <div className="mb-4">
                                    <select
                                        id="servicios"
                                        name="servicios"

                                        className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Elija sus Contratas</option>

                                    </select>
                                </div>
                                <SelectTables list={props.contrata}/>
                            </div>

                        </div>

                        <div className="flex justify-end">
                            <button
                                className="mt-4 naranja-btn font-bold py-2 px-4 rounded"
                            >
                                Agregar
                            </button>
                        </div>

                    </div>
                </div>


            </div>
        </>
    )
}

export default EditProtocolos