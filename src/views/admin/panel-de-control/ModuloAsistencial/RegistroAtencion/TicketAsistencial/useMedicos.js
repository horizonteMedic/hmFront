import { useCallback, useEffect, useState } from "react";
import { ListarMedicosYOdontologos } from "./controllerTicketAsistencial";

const mismo = (a, b) => String(a ?? "").trim().toUpperCase() === String(b ?? "").trim().toUpperCase();

// Médicos y odontólogos que pueden asignarse a un ticket (GET .../empleado/listadoMedicosYOdontologos).
// `nombreMedico(ticket)` devuelve el nombre a mostrar/imprimir de un ticket ya guardado: el ticket
// guarda el usuario (`medicoUsuario`), que se resuelve contra esta lista; si el usuario no está en
// ella (p. ej. ya no es médico) o es un ticket antiguo, cae al texto `medico` y por último al usuario.
export const useMedicos = (token) => {
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    if (!token) return undefined;
    let activo = true;
    ListarMedicosYOdontologos(token).then((lista) => {
      if (activo) setMedicos(lista);
    });
    return () => {
      activo = false;
    };
  }, [token]);

  const nombreMedico = useCallback(
    (ticket) =>
      medicos.find((m) => mismo(m.username, ticket?.medicoUsuario))?.nombres ??
      ticket?.medico ??
      ticket?.medicoUsuario ??
      "",
    [medicos]
  );

  return { medicos, nombreMedico };
};
