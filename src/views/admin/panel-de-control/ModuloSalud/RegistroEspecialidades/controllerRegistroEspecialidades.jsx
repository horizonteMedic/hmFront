import { URLAzure } from "../../../../config/config";

async function apiRequest(url, { method = "GET", token, body } = {}) {
  const headers = { Authorization: `Bearer ${token}` };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data = null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    }

    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null, networkError: true };
  }
}

// GET /api/visitas/{visitaId} -> { visita, fichas: [{ id, estado, especialidad }] }
export function getVisita(visitaId, token) {
  return apiRequest(`${URLAzure}/api/visitas/${visitaId}`, { token });
}

// PATCH /api/visitas/especialidades/{visitaEspecialidadId}/atencion
// estado: "PASO" | "NO_PASO"
export function patchAtencion(visitaEspecialidadId, { usuarioRegistro, estado }, token) {
  return apiRequest(`${URLAzure}/api/visitas/especialidades/${visitaEspecialidadId}/atencion`, {
    method: "PATCH",
    token,
    body: { usuarioRegistro, estado, observacion: "" },
  });
}

// POST /api/inventario/entregas
export function crearEntrega({ visitaEspecialidadId, medicamentoId, cantidad, usuarioRegistro }, token) {
  return apiRequest(`${URLAzure}/api/inventario/entregas`, {
    method: "POST",
    token,
    body: { visitaEspecialidadId, medicamentoId, cantidad, usuarioRegistro },
  });
}

// POST /api/inventario/entregas/{entregaId}/anular
export function anularEntrega(entregaId, { usuarioRegistro, cargoUsuarioRegistro, motivo }, token) {
  return apiRequest(`${URLAzure}/api/inventario/entregas/${entregaId}/anular`, {
    method: "POST",
    token,
    body: { usuarioRegistro, cargoUsuarioRegistro, motivo },
  });
}
