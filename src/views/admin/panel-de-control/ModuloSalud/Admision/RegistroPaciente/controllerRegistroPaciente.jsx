import Swal from "sweetalert2";
import { getFetch, SubmitData, updateData } from "../../../../../utils/apiHelpers";
import { LoadingDefault, SubmitDataServiceDefault } from "../../../../../utils/functionUtils";

const SearchURL = "/api/pacientes/buscar"
const SubmitURL = "/api/pacientes"

export const SearchPacienteDNI = async (dni, TipoDoc, token, handleLimpiar, set) => {
    LoadingDefault("Buscando...")
    const res = await getFetch(`${SearchURL}?tipoDocumentoId=${TipoDoc}&numeroDocumento=${dni}`, token);
    /*if (!res.codPa) {
        await Swal.fire({
            toast: true, position: "top-end", icon: "info",
            title: '<span style="font-size:1rem">Paciente no encontrado</span>',
            width: 360, showConfirmButton: false, timer: 1200,
        });
        handleLimpiar(true);
        return;
    }*/
    if (res) {
        if (res.fechaNacimiento) {
            const [yyyy, mm, dd] = res.fechaNacimiento.split('-');
            res.fechaNacimiento = `${dd}-${mm}-${yyyy}`;
        }
        set((prev) => ({
            ...prev,
            origen: res.origen,
            dni: prev.dni,
            nombres: res.nombres,
            apellidos: res.apellidos,
            fechaNacimiento: res.fechaNacimiento,
            sexo: res.sexo === "M" ? "M" : res.sexo === "F" ? "F" : "",
            caserio: res.caserio,
            pacienteId: res.pacienteId
        }));
        Swal.close()
    }
}

export const SubmitRegistro = async (form, token, userlogued, limpiar) => {
    LoadingDefault("Registrando...")
    const url = form.pacienteId
        ? `${SubmitURL}/${form.pacienteId}`
        : `${SubmitURL}?usuarioRegistro=${userlogued}&fuenteReniec=${form.origen === "RENIEC" ? true : false}`;
    const [dd, mm, yyyy] = form.fechaNacimiento.split('-');
    const fechaFormateada = `${yyyy}-${mm}-${dd}`;

    const body = {
        tipoDocumento: {
            id: form.TipoDoc === "4" ? 4 : form.TipoDoc
        },
        numeroDocumento: form.TipoDoc === "4" ? null : form.dni,
        nombres: form.nombres,
        apellidos: form.apellidos,
        fechaNacimiento: fechaFormateada,
        sexo: form.sexo,
        caserio: form.caserio

    };
    if (form.pacienteId) {
        return await updateData(body, url, token);
    }

    return await SubmitData(body, url, token);
}