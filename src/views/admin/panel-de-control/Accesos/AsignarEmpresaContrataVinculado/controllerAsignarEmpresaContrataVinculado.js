import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { SubmitData, getFetch } from "../../../../utils/apiHelpers";

const asignarVinculacionUrl = "/api/usuarios-vinculaciones/asignar";
const obtenerVinculacionesUrl = "/api/usuarios-vinculaciones/usuario";
const registrarEmpresaContrataUrl = "/api/v01/ct/empresaContrata/crearActualizar";

export const AsignarVinculacionEmpresaContrata = (idUser, idsEmpresaContrata, token, onSuccess) => {
    const body = {
        idUser,
        idsEmpresaContrata
    };

    LoadingDefault("Vinculando Datos");
    return SubmitData(body, asignarVinculacionUrl, token).then((res) => {
        if (res?.codigo == 200 && res?.estatus === "OK") {
            Swal.fire({
                title: "Éxito",
                text: res?.resultado || "Se ha vinculado la Empresa-Contrata con éxito",
                icon: "success",
                confirmButtonColor: "#3085d6",
            }).then((result) => {
                if (result.isConfirmed) onSuccess?.();
            });
        } else {
            Swal.fire("Error", "Ocurrió un error al vincular la Empresa-Contrata", "error");
        }
    }).catch(() => {
        Swal.fire("Error", "Ocurrió un error al vincular la Empresa-Contrata", "error");
    });
};

// Crea una nueva relación Empresa-Contrata (o Empresa sola, si no se envía rucContrata).
export const CrearRelacionEmpresaContrata = (rucEmpresa, rucContrata, usuarioRegistro, token, onSuccess) => {
    const body = {
        id: null,
        rucEmpresa: rucEmpresa.trim(),
        rucContrata: (rucContrata ?? "").trim(),
        usuarioRegistro
    };

    LoadingDefault("Registrando Datos");
    return SubmitData(body, registrarEmpresaContrataUrl, token).then((res) => {
        if (res?.codigo == 201) {
            Swal.fire({
                title: "Éxito",
                text: "Se ha creado la relación Empresa-Contrata",
                icon: "success",
                confirmButtonColor: "#3085d6",
            }).then((result) => {
                if (result.isConfirmed) onSuccess?.();
            });
        } else {
            Swal.fire("Error", "Ocurrió un error al crear la relación Empresa-Contrata", "error");
        }
    }).catch(() => {
        Swal.fire("Error", "Ocurrió un error al crear la relación Empresa-Contrata", "error");
    });
};

// Devuelve el array de ids de Empresa-Contrata actualmente vinculadas al usuario.
export const ObtenerVinculacionesUsuario = async (idUser, token) => {
    try {
        const res = await getFetch(`${obtenerVinculacionesUrl}/${idUser}`, token);
        const lista = Array.isArray(res?.resultado) ? res.resultado : (Array.isArray(res) ? res : []);

        return lista
            .map(item => (item && typeof item === "object") ? (item.idEmpresaContrata ?? item.id) : item)
            .filter(id => id !== undefined && id !== null);
    } catch (error) {
        return [];
    }
};
