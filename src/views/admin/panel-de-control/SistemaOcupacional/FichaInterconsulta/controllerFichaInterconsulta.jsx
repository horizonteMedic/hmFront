import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";
import { getHoraActual, getToday } from "../../../../utils/helpers";

const obtenerEspecialidad =
    "/api/v01/ct/fichaInterconsulta/obtenerEspecialidadesFichaInterconsulta";
const obtenerReporteUrl =
    "/api/v01/ct/fichaInterconsulta/obtenerFichaInterconsultaReporte";
const registrarUrl =
    "/api/v01/ct/fichaInterconsulta/registrarActualizarFichaInterconsulta";
const today = getToday();

//Para ver uno registrado y ver sus especialidades
export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { },
    jasperModules = "",
    datosFooter = ""
) => {
    const res = await GetInfoEspecialidadInterconsulta(
        nro,
        token,
        onFinish
    );
    if (res) {
        console.log(res)
        //por index
        const inputOptions = res.reduce((acc, item) => {
            acc[item.id] = item.mensaje; // usa el ID real del backend
            return acc;
        }, {});

        //por mensaje
        /*const inputOptions = res.reduce((acc, item) => {
        acc[item.mensaje] = item.mensaje;
        return acc;
        }, {}); */
        const totalRadios = Object.keys(inputOptions).length;
        console.log(totalRadios)
        // Altura estimada por cantidad (ajusta a gusto)
        let height = 300; // base
        let width;
        if (totalRadios <= 2) width = "400px";
        else if (totalRadios <= 5) width = "550px";
        else if (totalRadios <= 8) width = "700px";
        else width = "900px";
        if (totalRadios > 5) height += (totalRadios - 5) * 30; // suma 40px por cada extra
        // Mostrar SweetAlert con radios
        const { value: seleccion } = await Swal.fire({
             title: "Selecciona una especialidad",
            input: "radio",
            inputOptions,
            inputValidator: (value) => {
                if (!value) return "Debes seleccionar una opción o crear una nueva.";
            },
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "Buscar",
            denyButtonText: "Nuevo registro",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
            customClass: {
                popup: "swal-dinamico",
            },
            didOpen: () => {
                const popup = Swal.getPopup();
                popup.style.maxHeight = `${height}px`;
                popup.style.width = width; // ← se aplica el ancho dinámico aquí
            }
        });

        // Si seleccionó una opción
        if (seleccion) {
            console.log(seleccion)
            const especialidadSeleccionada = res.find(
                (item) => item.id === parseInt(seleccion, 10)
            );
            console.log("✅ Especialidad seleccionada:", especialidadSeleccionada);
            if (jasperModules) {
                PrintHojaRFichaInterconsulta(
                    nro,
                    especialidadSeleccionada.mensaje,
                    token,
                    tabla,
                    datosFooter,
                    obtenerReporteUrl,
                    jasperModules,
                    "../../../../jaspers/FichaInterconsulta"
                );
                
            } else {
                GetInfoServicioEditar(nro, especialidadSeleccionada, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Ficha Interconsulta",
                    "warning"
                )})

                
                // Aquí puedes retornar o usar especialidadSeleccionada.mensaje
            }   
            
        }

        // Si presiona "Nuevo registro"
        else if (Swal.getDenyButton()) {
            // Detecta el botón de "Nuevo registro"
            const isDenied = Swal.isVisible() && Swal.getDenyButton().classList.contains("swal2-deny");
            if (isDenied) {
                GetInfoServicioNewEditar(nro, Object.values(inputOptions)[0], tabla, set, token, () => { Swal.close(); }, totalRadios + 1)
            }
        }
        
    }
};



//Sin registros
export const GetInfoEspecialidad = async (
    nro,
    especialidad,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioInterconsulta(
        nro,
        especialidad,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            ...res,
            // Header
            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            PA: `${res.sistolica}/${res.diastolica}`,
            edadPaciente: `${res.edadPaciente}`,
            dniUser: res.dniUsuario,
            fechaExamen: prev.fechaExamen,
            motivo: prev.motivo
            
        }));
    }
};
//para ver uno ya registrado
export const GetInfoServicioEditar = async (
    nro,
    especialidad,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioInterconsulta(
        nro,
        especialidad.mensaje,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            ...res,
            // Header
            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            PA: `${res.sistolica}/${res.diastolica}`,
            edadPaciente: `${res.edadPaciente}`,
            dniUser: res.dniUsuario,
            SubirDoc: true,
            
        }));
    }
};

//Uno con registro, pero desea agregar uno mas
export const GetInfoServicioNewEditar = async (
    nro,
    especialidad,
    tabla,
    set,
    token,
    onFinish = () => { },
    NewNomenclatura = ""
) => {
    const res = await GetInfoServicioInterconsulta(
        nro,
        especialidad,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
             ...res,
            codigoFichaInterconsulta: null,
            especialidad: "",
            // Header
            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            PA: `${res.sistolica}/${res.diastolica}`,
            edadPaciente: `${res.edadPaciente}`,
            dniUser: res.dniUsuario,
            motivo: prev.motivo,
            hallazgo: "",
            diagnostico: "",
            tratamiento: "",
            apto: false,
            NewNomenclatura: NewNomenclatura
        }));
    }
};

export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        "codigoFichaInterconsulta": form.codigoFichaInterconsulta ? form.codigoFichaInterconsulta : null,
        "norden": form.norden,
        "fechaExamen": form.fechaExamen,
        "edadPaciente": form.edadPaciente,
        "dniUsuario": form.dniUser,
        "especialidad": form.especialidad,
        "motivo": form.motivo,
        "hallazgo": form.hallazgo,
        "diagnostico": form.diagnostico,
        "tratamiento": form.tratamiento,
        "apto":  false,
        "noApto":  false,
        "horaSalida": getHoraActual(),
        "orden": null,
        "nomenclatura": `INTERCONSULTA${form.NewNomenclatura ? ` ${form.NewNomenclatura}` : ""}`
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden,  token, tabla, datosFooter);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../jaspers/FichaInterconsulta/*.jsx");
    GetInfoServicio(nro, tabla, null, token, () => { Swal.close() }, jasperModules, datosFooter);
};

export const VerifyTR = async (nro, especialidad, tabla, token, set, sede) => {
    VerifyTRPerzonalizado(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoEspecialidad(nro, especialidad, tabla, set, token, () => { Swal.close(); });
        },
        () => {
            //Tiene registro
                GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); })
                /*GetInfoServicioEditar(nro, especialidad, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Ficha Interconsulta",
                    "warning"
                );*/  
        },
        () => {
            //Necesita Agudeza visual Triaje
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje.",
                "warning"
            );
        }
    );
};

export const VerifyTRPerzonalizado = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }, necesitaExamen = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    Loading("Validando datos");
    getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    ).then((res) => {
        console.log(res)
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else if (res.id === 2) {
            necesitaExamen();
        } else {
            tieneRegistro();//obtener data servicio
        }
    });
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

export const GetInfoServicioInterconsulta = async (
    nro,
    especialidad,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish = () => { }
) => {
    try {
        console.log('llegue a consultar causam',especialidad)
        const res = await getFetch(
            `${obtenerReporteUrl}?nOrden=${nro}&especialidad=${especialidad}&nameService=${tabla}&esJasper=false`,
            token
        );
        if (res?.norden || res?.norden_n_orden||res?.n_orden) {
            return res;
        } else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        return null;
    } finally {
        onFinish();
    }
};

export const GetInfoNoRegisterInterconsulta = async (
    nro,
    especialidad,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish = () => { }
) => {
    try {
        const res = await getFetch(
            `${obtenerReporteUrl}?nOrden=${nro}&especialidad=${especialidad}&nameService=${tabla}&esJasper=false`,
            token
        );
        if (res?.norden || res?.norden_n_orden||res?.n_orden) {
            return res;
        } else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        return null;
    } finally {
        onFinish();
    }
};



export const PrintHojaRFichaInterconsulta = (nro, especialidad, token, tabla, datosFooter, obtenerReporteUrl, jasperModules, nombreCarpeta) => {

    LoadingDefault("Cargando Formato a Imprimir");

    getFetch(
        `${obtenerReporteUrl}?nOrden=${nro}&especialidad=${especialidad}&nameService=${tabla}&esJasper=true`,
        token
    )
        .then(async (res) => {
            console.log(res)
            if (res.norden || res.norden_n_orden|| res.n_orden) {
                const nombre = res.nameJasper;
                console.log(nombre)
                const modulo = await jasperModules[
                    `${nombreCarpeta}/${nombre}.jsx`
                ]();
                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === "function") {
                    modulo.default({ ...res, ...datosFooter });
                }
            }
        })
        .finally(() => {
            Swal.close();
        });
};


//para ver las especialidadses registradas
export const GetInfoEspecialidadInterconsulta = async (
    nro,
    token,
    onFinish = () => { }
) => {
    try {
        const res = await getFetch(
            `${obtenerEspecialidad}?nOrden=${nro}`,
            token
        );
        if (Array.isArray(res) && res.length > 0) {
            return res;
        } else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        return null;
    } finally {
        onFinish();
    }
}