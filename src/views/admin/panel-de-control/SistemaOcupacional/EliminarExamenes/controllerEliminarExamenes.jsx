import Swal from "sweetalert2";
import { URLAzure } from "../../../../config/config";

export const VerifyTR = async (norden, tabla, token, setForm, selectedSede) => {
    if (!norden) {
        Swal.fire("Error", "Ingrese un número de orden", "error");
        return;
    }

    try {
        const response = await fetch(`${URLAzure}/api/servicios/getInfoServicio/${norden}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data) {
                setForm((prev) => ({
                    ...prev,
                    nombre: `${data.apellidosPaciente || ""} ${data.nombresPaciente || ""}`.trim(),
                    examen: data.nombreExamen || "",
                    // Aquí se pueden mapear los demás campos según la respuesta del backend
                }));
            } else {
                Swal.fire("Información", "No se encontró el registro", "info");
            }
        } else {
            Swal.fire("Error", "Error al buscar el registro", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "Error de conexión", "error");
    }
};

export const DeleteExamen = async (norden, campo, token, setForm, form) => {
    if (!norden) {
        Swal.fire("Error", "Primero busque un paciente", "error");
        return;
    }

    const result = await Swal.fire({
        title: "¿Está seguro?",
        text: `¿Desea eliminar el registro de ${campo}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`${URLAzure}/api/eliminar-examenes/${norden}/${campo}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
                setForm((prev) => ({
                    ...prev,
                    [campo]: "",
                }));
            } else {
                Swal.fire("Error", "No se pudo eliminar el registro", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", "Error de conexión", "error");
        }
    }
};

