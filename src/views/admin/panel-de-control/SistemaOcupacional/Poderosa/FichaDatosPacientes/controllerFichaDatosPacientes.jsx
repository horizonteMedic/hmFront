import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRPerzonalizadoDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/ct/fichaDatosPersonales/obtenerReporteFichaDatosPersonales";
const registrarUrl =
    "/api/v01/ct/fichaDatosPersonales/registrarActualizarFichaDatosPersonales";

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",

        }));
    }
};

export const GetInfoServicioEditar = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",

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

    const familiaresConfig = [
        { key: "Padre", parentesco: "PADRE" },
        { key: "Madre", parentesco: "MADRE" },
        { key: "Conviviente", parentesco: "CONVIVIENTE" },
        { key: "Esposa", parentesco: "ESPOSA" },
        { key: "Hijo1", parentesco: "HIJO" },
        { key: "Hijo2", parentesco: "HIJO" },
        { key: "Hijo3", parentesco: "HIJO" },
        { key: "Hijo4", parentesco: "HIJO" },
        { key: "Hijo5", parentesco: "HIJO" }
    ];

    const composicionFamiliar = familiaresConfig.map(f => ({
        id: form[`idfamiliar${f.key}`],
        idFichaDatosPersonales: form.norden,
        parentesco: f.parentesco,
        nombres: form[`familiar${f.key}Nombre`],
        vive: form[`familiar${f.key}Vive`],
        fechaNacimiento: form[`familiar${f.key}FechaNac`],
        edad: form[`familiar${f.key}Edad`],
        dni: form[`familiar${f.key}Dni`],
        gradoInstruccion: form[`familiar${f.key}Grado`],
        autogenerado: form[`familiar${f.key}Autogenerado`]
    }));

    const body = {
        norden: form.norden,
        id: form.id,
        fechaIngreso: form.fechaIngreso,
        empleado: form.tipoTrabajador == "EMPLEADO",
        obrero: form.tipoTrabajador == "OBRERO",
        codigoActividad: "",
        codigoDepartamento: "",
        zona: "",
        distrito: form.distritoNacimiento,
        provincia: form.provinciaNacimiento,
        departamento: form.departamentoNacimiento,
        lincenciaConducir: form.licConducirNo,
        lm: form.lmNo,
        afp: form.afpSnp,
        cussp: form.cusspNo,
        autogenerado: form.autogenerado,
        referenciaDomicilio: form.referenciaDomiciliaria,

        viviendaPropia: form.tipoVivienda == "PROPIA",
        viviendaAlquilada: form.tipoVivienda == "ALQUILADA",
        radioFrecuencia: form.radioFrec,
        numeroCuenta: form.numeroCuentaAhorro,
        banco: form.banco,

        nombreEmergencia: form.emergenciaNombres,
        parentescoEmergencia: form.emergenciaParentesco,
        telefonoEmergencia: form.emergenciaTelefono,
        domicilioEmergencia: form.emergenciaDomicilio,
        otraReferenciaEmergencia: form.emergenciaOtraReferencia,

        sueldo: form.sueldoJornal,
        sistemaTrabajo: form.sistemaTrabajo,
        transporteTerrestreSi: form.transporteTerrestre == "SI",
        transporteTerrestreNo: form.transporteTerrestre == "NO",
        transporteAereoSi: form.transporteAereo == "SI",
        transporteAereoNo: form.transporteAereo == "NO",
        viaticosSi: form.viaticos == "SI",
        viaticosNo: form.viaticos == "NO",
        viaticosDescripcion: form.viaticosValor,
        alimentacionContrata: form.alimentacionContrata,

        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: form.apellidoMaterno,

        usuarioRegistro: user,

        composicionFamiliar: composicionFamiliar ,

        "experienciaLaboral": [
            {
                "id": 0,
                "idFichaDatosPersonales": 0,
                "empresa": "string",
                "telefono": "string",
                "cargoDesemp": "string",
                "fechaInicio": "string",
                "fechaTermino": "string",
                "motivoSalida": "string"
            }
        ],
        "instruccionAdquirida": [
            {
                "id": 0,
                "idFichaDatosPersonales": 0,
                "instruccion": "string",
                "centroEstudio": "string",
                "fechaInicio": "string",
                "fechaTermino": "string",
                "gradoObtenido": "string",
                "cap": 0
            }
        ],
        "referenciasPersonales": [
            {
                "id": 0,
                "idFichaDatosPersonales": 0,
                "nombres": "string",
                "centroTrab": "string",
                "cargoDesemp": "string",
                "telefono": "string",
                "direccion": "string"
            }
        ]
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/FichaDatosPersonales/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/FichaDatosPersonales"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRPerzonalizadoDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Ficha Datos Personales.",
                    "warning"
                );
            });
        },
        () => {
            //Necesita
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Certificado de Altura Poderosa o Laboratorio Clínico.",
                "warning"
            );
        }
    );
};
export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};