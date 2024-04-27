export default async function deleteEmpleado(empleadoId) {
    try {
        const response = await fetch(`https://servicios-web-hm.azurewebsites.net/api/v01/st/empleado/${empleadoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            const responseData = await response.json(); 
            return responseData;
        } else {
            throw new Error('No se pudo eliminar el empleado');
        }
    } catch (error) {
        throw new Error('Error al eliminar el empleado: ' + error.message);
    }
}
