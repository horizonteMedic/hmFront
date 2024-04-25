import {Error, Entro} from './Estados'

const EstadoSolicitud = (estado) => {


    if (estado === '501') {
        return <Error>Error al Ingresar, intente mas tarde</Error>
    } if (estado === '500') {
        return <Error>Credenciales Incorrectas</Error>
    } else {
        return <Entro>Ingreso con Exito</Entro>
    }
}

export default EstadoSolicitud