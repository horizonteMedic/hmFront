
const EstadoSolicitud = (estado) => {

    const Error = ({children}) =>{
        return( 
            <div className="text-red-800 bg-pink-100 text-lg p-2 mt-5 rounded-lg transition duration-100 ease-in-out">
                <p>
                   {children}
                </p>
            </div>
        )
    }

    const Entro = ({children}) => {
        return(
            <div className="text-green-800 bg-green-100 text-lg p-2 mt-5 rounded-lg transition duration-100 ease-in-out">
                <p>
                    {children}
                </p>
            </div>
        )
    }

    if (estado === '500') {
        return <Error>Error al Ingresar, intente mas tarde</Error>
    } else {
        return <Entro>Ingreso con Exito</Entro>
    }
}

export default EstadoSolicitud