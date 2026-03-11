const registrarUrl = "/api/v01/ct/empresaContrata/crearActualizar";


export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!form.rucEmpresa) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        
        userRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};